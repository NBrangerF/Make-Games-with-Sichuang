import type { AttemptRecord } from '../core/types';
import { revealDurationMs } from './reveal-timing';

export const SOUND_EVENTS = ['select', 'reveal', 'win', 'lose', 'draw', 'install', 'undo', 'name', 'style', 'claim_draw', 'insurance', 'retry', 'charge', 'attack', 'guard', 'save'] as const;
export type SoundEvent = typeof SOUND_EVENTS[number];
export type SoundTone = 'paper' | 'electronic';
export type SoundPreferences = { muted: boolean; tone: SoundTone; volume: number };
type AudioChannel = 'beat' | 'impact' | 'result' | 'ability' | 'interface' | 'preview';
type Cancel = () => void;
type PlayOptions = { tone?: SoundTone; volume?: number; rate?: number; channel?: AudioChannel };
const noop = () => {};
const clamp = (value: number, fallback: number) => Number.isFinite(value) ? Math.max(0, Math.min(1, value)) : fallback;
const channelFor = (event: SoundEvent): AudioChannel => ['win', 'lose', 'draw'].includes(event) ? 'result'
  : ['reveal', 'attack', 'guard', 'charge'].includes(event) ? 'impact'
  : ['claim_draw', 'insurance', 'retry'].includes(event) ? 'ability' : event === 'select' ? 'beat' : 'interface';

/** One AudioContext, bounded voices, cached original samples. Nothing starts before a user gesture. */
export class RuleLabAudio {
  private context: AudioContext | null = null;
  private preferences: SoundPreferences = { muted: false, tone: 'paper', volume: .45 };
  private buffers = new Map<string, AudioBuffer>();
  private pending = new Map<string, Promise<AudioBuffer | null>>();
  private voices = new Map<Cancel, AudioChannel>();
  private channels = new Map<AudioChannel, Cancel>();
  private recent = new Map<string, number>();
  private master: GainNode | null = null;
  private limiter: DynamicsCompressorNode | null = null;
  private presentationCancel: Cancel | null = null;
  private previewCancel: Cancel | null = null;
  private listening = false;
  private onVisibility = () => { if (document.visibilityState === 'hidden') this.cancelAll(); };

  getPreferences(): SoundPreferences { return { ...this.preferences }; }
  async init(): Promise<boolean> {
    try {
      if (!this.context) {
        const Constructor = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (!Constructor) return false;
        this.context = new Constructor();
        this.master = this.context.createGain();
        this.master.gain.value = this.preferences.muted ? 0 : this.preferences.volume;
        this.limiter = this.context.createDynamicsCompressor();
        this.limiter.threshold.value = -9; this.limiter.knee.value = 12; this.limiter.ratio.value = 8;
        this.limiter.attack.value = .003; this.limiter.release.value = .12;
        this.master.connect(this.limiter); this.limiter.connect(this.context.destination);
      }
      if (!this.listening) { document.addEventListener('visibilitychange', this.onVisibility); this.listening = true; }
      if (this.context.state === 'suspended') await this.context.resume();
      const ready = this.context.state === 'running';
      if (ready && !this.preferences.muted) this.preload(this.preferences.tone);
      return ready;
    } catch { return false; }
  }
  private level() {
    if (!this.context || !this.master) return;
    this.master.gain.cancelScheduledValues(this.context.currentTime);
    this.master.gain.setTargetAtTime(this.preferences.muted ? 0 : this.preferences.volume, this.context.currentTime, .012);
  }
  setMuted(muted: boolean) { this.preferences.muted = muted;this.level();if (muted) this.cancelAll(); }
  setVolume(volume: number) { this.preferences.volume = clamp(volume, .45);this.level(); }
  setTone(tone: SoundTone) {
    if (tone === this.preferences.tone) return;
    this.cancelAll(); this.preferences.tone = tone;
    if (this.context?.state === 'running' && !this.preferences.muted) this.preload(tone);
  }
  private preload(tone: SoundTone) { for (const event of SOUND_EVENTS) void this.load(event, tone); }
  private async load(event: SoundEvent, tone: SoundTone): Promise<AudioBuffer | null> {
    if (!this.context) return null;
    const key = `${tone}/${event}`;
    if (this.buffers.has(key)) return this.buffers.get(key)!;
    if (this.pending.has(key)) return this.pending.get(key)!;
    const context = this.context;
    const pending = (async () => {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 5000);
      try {
        const response = await fetch(`${import.meta.env.BASE_URL}assets/audio/${key}.wav`, { signal: controller.signal });
        if (!response.ok) return null;
        const buffer = await context.decodeAudioData(await response.arrayBuffer());
        if (this.context === context) this.buffers.set(key, buffer);
        return buffer;
      } catch { return null; }
      finally { clearTimeout(timer);this.pending.delete(key); }
    })();
    this.pending.set(key, pending);return pending;
  }
  /** Loading, repeated clicks and hidden tabs cannot produce a delayed wall of sound. */
  play(event: SoundEvent | string, options: PlayOptions = {}): Cancel {
    if (!SOUND_EVENTS.includes(event as SoundEvent) || !this.context || this.context.state !== 'running' || this.preferences.muted || document.visibilityState === 'hidden') return noop;
    const sound = event as SoundEvent;
    const tone = options.tone ?? this.preferences.tone;
    const channel = options.channel ?? channelFor(sound);
    const requestedAt = performance.now();
    const repeatKey = `${tone}/${sound}/${channel}`;
    if (requestedAt - (this.recent.get(repeatKey) ?? -Infinity) < 55) return noop;
    this.recent.set(repeatKey, requestedAt);
    this.channels.get(channel)?.();
    while (this.voices.size >= 4) this.voices.keys().next().value?.();
    let canceled = false;let finished = false;
    let source: AudioBufferSourceNode | null = null;let gain: GainNode | null = null;
    const cleanup = () => {
      if (finished) return;finished = true;
      this.voices.delete(cancel);
      if (this.channels.get(channel) === cancel) this.channels.delete(channel);
      source?.disconnect();gain?.disconnect();
    };
    const cancel = () => {
      if (canceled || finished) return;canceled = true;
      this.voices.delete(cancel);
      if (this.channels.get(channel) === cancel) this.channels.delete(channel);
      if (source && gain && this.context) {
        // A short release avoids a click when a new beat or navigation replaces a voice.
        const now = this.context.currentTime;
        gain.gain.cancelScheduledValues(now);gain.gain.setTargetAtTime(0, now, .006);
        try { source.stop(now + .025); } catch { cleanup(); }
      } else cleanup();
    };
    this.voices.set(cancel, channel);this.channels.set(channel, cancel);
    void this.load(sound, tone).then(buffer => {
      if (!buffer || canceled || !this.context || this.context.state !== 'running' || this.preferences.muted || !this.master || document.visibilityState === 'hidden' || performance.now() - requestedAt > 180) { cleanup();return; }
      try {
        source = this.context.createBufferSource();source.buffer = buffer;
        source.playbackRate.value = Math.max(.8, Math.min(1.2, options.rate ?? 1));
        gain = this.context.createGain();gain.gain.value = clamp(options.volume ?? .85, .85);
        source.connect(gain);gain.connect(this.master);source.onended = cleanup;source.start();
      } catch { cleanup(); }
    });
    return cancel;
  }

  /** Call directly inside the action handler, before any await, to retain the visual deadline. */
  prepareReveal({ tempo = 'quick', reduced = false }: { tempo?: 'quick' | 'rhythm'; reduced?: boolean } = {}): Cancel {
    this.presentationCancel?.();
    const startedAt = performance.now();
    const duration = revealDurationMs(tempo, reduced);
    const timers: ReturnType<typeof setTimeout>[] = [];const stops: Cancel[] = [];let canceled = false;
    const cancel = () => { canceled = true;timers.forEach(clearTimeout);stops.forEach(stop=>stop());if (this.presentationCancel === cancel) this.presentationCancel = null; };
    this.presentationCancel = cancel;
    void this.init().then(ready => {
      if (!ready || canceled || this.preferences.muted || document.visibilityState === 'hidden') return;
      const elapsed = performance.now() - startedAt;
      for (const [index, at] of (reduced ? [0] : [0, duration * .30, duration * .62]).entries()) {
        if (elapsed > at + 100 || elapsed >= duration) continue;
        timers.push(setTimeout(() => { if (!canceled) stops.push(this.play('select', { channel: 'beat', volume: reduced ? .25 : .37 + index * .10, rate: .93 + index * .045 })); }, Math.max(0, at - elapsed)));
      }
    });
    return cancel;
  }

  /** Only invoke at the shared reveal deadline: concealed actions never select audible cues. */
  playResolution(record: AttemptRecord): Cancel {
    this.presentationCancel?.();
    if (!this.context || this.context.state !== 'running' || this.preferences.muted || document.visibilityState === 'hidden') return noop;
    const timers: ReturnType<typeof setTimeout>[] = [];const stops: Cancel[] = [];let canceled = false;
    const cancel = () => { canceled = true;timers.forEach(clearTimeout);stops.forEach(stop=>stop());if (this.presentationCancel === cancel) this.presentationCancel = null; };
    this.presentationCancel = cancel;
    const piercing = record.player.kind === 'piercing_wave' || record.computer.kind === 'piercing_wave';
    const impact: SoundEvent = piercing ? 'attack' : record.events.some(event=>['guard_blocked','shield_absorbed'].includes(event.type)) ? 'guard'
      : record.player.kind === 'wave' || record.computer.kind === 'wave' ? 'attack'
      : record.player.kind === 'charge' ? 'charge' : 'reveal';
    const passive = !record.voided ? record.events.find(event=>event.type==='passive_triggered'&&event.side==='player'&&(event.amount??0)>0) : undefined;
    const ability = passive?.ability ?? record.events.find(event=>event.type==='ability_used' && event.side==='player')?.ability;
    const abilityCues: Record<string, { sound: SoundEvent; event?: string; rate?: number; passive?: boolean }> = {
      'ability.claim_draw': { sound:'claim_draw' }, 'ability.insurance': { sound:'insurance' }, 'ability.retry': { sound:'retry' },
      'ability.aegis': { sound:'guard', event:'shield_gained', rate:.9 },
      'ability.foresight': { sound:'style', event:'foresight_granted', rate:1.16 },
      'ability.siphon': { sound:'charge', event:'energy_transferred', rate:.82 },
      'ability.reforge': { sound:'install', event:'cards_reforged', rate:1.12 },
      'ability.last_stand': { sound:'win', event:'last_stand_triggered', rate:.85 },
      'ability.scissors_ninja': { sound:'attack', event:'passive_triggered', rate:1.16, passive:true },
      'ability.rock_guardian': { sound:'guard', event:'passive_triggered', rate:.84, passive:true },
      'ability.paper_trickster': { sound:'style', event:'passive_triggered', rate:1.08, passive:true },
      'ability.storyteller': { sound:'style', event:'passive_triggered', rate:1.04, passive:true },
      'ability.ronin': { sound:'attack', event:'passive_triggered', rate:0.9, passive:true },
      'ability.clockmaker': { sound:'style', event:'passive_triggered', rate:0.88, passive:true },
      'ability.scrapper': { sound:'install', event:'passive_triggered', rate:0.9, passive:true },
      'ability.broker': { sound:'charge', event:'passive_triggered', rate:1.12, passive:true },
      'ability.kite': { sound:'guard', event:'passive_triggered', rate:1.15, passive:true },
      'ability.smith': { sound:'attack', event:'passive_triggered', rate:0.82, passive:true },
      'ability.monk': { sound:'guard', event:'passive_triggered', rate:0.94, passive:true },
      'ability.sheathed': { sound:'charge', event:'passive_triggered', rate:0.92, passive:true },
      'ability.cartographer': { sound:'install', event:'passive_triggered', rate:1.18, passive:true },

    };
    const cue = ability ? abilityCues[ability] : undefined;
    const activated = cue && (!cue.passive||!record.voided) && (!cue.event || record.events.some(event=>event.type===cue.event && event.side==='player' && event.ability===ability && (event.amount??0)>0));
    const abilitySound = activated ? cue.sound : null;
    // Reuse our original attack sample with a tighter, higher transient; no missing asset request.
    stops.push(this.play(impact, { channel: 'impact', volume: piercing ? .78 : .72, rate: piercing ? 1.18 : 1 }));
    if (abilitySound) timers.push(setTimeout(()=>{if (!canceled) stops.push(this.play(abilitySound, { channel: 'ability', volume: .60, rate:cue?.rate }));},70));
    if (!record.voided) timers.push(setTimeout(()=>{if (!canceled) stops.push(this.play(record.outcome === 'player' ? 'win' : record.outcome === 'computer' ? 'lose' : 'draw', { channel: 'result', volume: .72 }));},abilitySound ? 210 : 130));
    return cancel;
  }
  preview(tone: SoundTone): Cancel {
    this.previewCancel?.();
    const stops: Cancel[] = [];const timers: ReturnType<typeof setTimeout>[] = [];let canceled = false;
    const cancel = () => { canceled = true;timers.forEach(clearTimeout);stops.forEach(stop=>stop());if (this.previewCancel === cancel) this.previewCancel = null; };
    this.previewCancel = cancel;
    void this.init().then(ready => {
      if (!ready || canceled) return;
      // Predecode this short audition first; it is explicit listening, not a gameplay deadline.
      void Promise.all((['select', 'reveal', 'win'] as const).map(event=>this.load(event,tone))).then(()=>{
        if (canceled) return;
        for (const [index,event] of (['select','reveal','win'] as const).entries()) timers.push(setTimeout(()=>{if (!canceled) stops.push(this.play(event, { tone, channel: 'preview', volume: .72 }));},index*390));
      });
    });
    return cancel;
  }
  cancelAll() { this.presentationCancel?.();this.previewCancel?.();for (const cancel of [...this.voices.keys()]) cancel(); }
  dispose() { this.cancelAll();document.removeEventListener('visibilitychange',this.onVisibility);this.listening=false;void this.context?.close().catch(noop);this.master?.disconnect();this.limiter?.disconnect();this.context=null;this.master=null;this.limiter=null;this.buffers.clear(); }
}
export const audio = new RuleLabAudio();
