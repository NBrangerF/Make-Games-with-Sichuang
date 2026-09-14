// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { RuleLabAudio } from '../../src/presentation/audio';
import { commitComputer, createDesign, createMatch, resolveAttempt } from '../../src/core';

class Param {
  value = 0;
  cancelScheduledValues = vi.fn();
  setTargetAtTime = vi.fn();
}
class Node {
  connect = vi.fn();disconnect = vi.fn();
}
class Gain extends Node { gain = new Param(); }
class Source extends Node {
  buffer: { key: string } | null = null;
  playbackRate = new Param();onended: (()=>void) | null = null;
  started = false;stopped = false;
  start = vi.fn(()=>{this.started=true;played.push(this.buffer!.key);});
  stop = vi.fn(()=>{this.stopped=true;this.onended?.();});
}
let played: string[] = [];
let contexts: FakeContext[] = [];
let slowKey = '';
class FakeContext {
  state = 'running';destination = {};
  sources: Source[] = [];gains: Gain[] = [];
  constructor() { contexts.push(this); }
  get currentTime() { return performance.now()/1000; }
  resume = vi.fn(async()=>{this.state='running';});
  close = vi.fn(async()=>{this.state='closed';});
  createGain = () => { const node=new Gain();this.gains.push(node);return node; };
  createDynamicsCompressor = () => Object.assign(new Node(), {threshold:new Param(),knee:new Param(),ratio:new Param(),attack:new Param(),release:new Param()});
  createBufferSource = () => { const source=new Source();this.sources.push(source);return source; };
  decodeAudioData = async (bytes: ArrayBuffer & { key: string }) => {
    if(bytes.key===slowKey)await new Promise(resolve=>setTimeout(resolve,250));
    return { duration:.25,key:bytes.key };
  };
}
let audio: RuleLabAudio;
const tick = (ms:number) => vi.advanceTimersByTimeAsync(ms);
const sample = () => resolveAttempt(commitComputer(createMatch(createDesign(),19)),{kind:'rock',boost:0,ability:false},'audio-case').history[0]!;

beforeEach(()=>{
  vi.useFakeTimers({toFake:['setTimeout','clearTimeout','performance']});
  played=[];contexts=[];slowKey='';
  Object.defineProperty(window,'AudioContext',{configurable:true,value:FakeContext});
  Object.defineProperty(document,'visibilityState',{configurable:true,value:'visible'});
  vi.stubGlobal('fetch',vi.fn(async(url:string)=>({ok:true,arrayBuffer:async()=>Object.assign(new ArrayBuffer(1),{key:String(url).split('audio/')[1]!.replace('.wav','')})})));
  audio=new RuleLabAudio();
});
afterEach(()=>{audio.dispose();vi.useRealTimers();vi.unstubAllGlobals();vi.restoreAllMocks();});

describe('layered game audio lifecycle',()=>{
  it('stays dormant before interaction, then follows the three public beats without revealing an action',async()=>{
    audio.play('win');expect(contexts).toHaveLength(0);expect(fetch).not.toHaveBeenCalled();
    audio.prepareReveal({tempo:'quick'});await tick(0);expect(played).toEqual(['paper/select']);
    await tick(269);expect(played).toHaveLength(1);
    await tick(1);expect(played).toEqual(['paper/select','paper/select']);
    await tick(288);expect(played).toEqual(['paper/select','paper/select','paper/select']);
    await tick(341);expect(played).toHaveLength(3);
    const record=sample();audio.playResolution(record);await tick(0);
    expect(played.at(-1)).toBe('paper/reveal');
    await tick(129);expect(played.at(-1)).toBe('paper/reveal');
    await tick(1);expect(played.at(-1)).toBe(`paper/${record.outcome==='player'?'win':record.outcome==='computer'?'lose':'draw'}`);
    expect(contexts).toHaveLength(1);
  });

  it('does not turn reduced-motion preparation into delayed extra beats',async()=>{
    audio.prepareReveal({reduced:true});await tick(0);expect(played).toEqual(['paper/select']);
    await tick(80);audio.playResolution(sample());await tick(900);
    expect(played.filter(key=>key==='paper/select')).toHaveLength(1);
  });

  it('debounces repeated cues, replaces a channel, and caps concurrent voices',async()=>{
    await audio.init();await tick(0);
    for(let i=0;i<20;i++)audio.play('win');await tick(0);
    expect(played).toEqual(['paper/win']);
    audio.play('reveal');audio.play('insurance');audio.play('install');await tick(0);
    const ctx=contexts[0]!;expect(ctx.sources.filter(source=>source.started&&!source.stopped)).toHaveLength(4);
    audio.play('style',{channel:'preview'});await tick(0);
    expect(ctx.sources.filter(source=>source.started&&!source.stopped)).toHaveLength(4);
    expect(ctx.sources[0]!.stop).toHaveBeenCalled();
    await tick(60);audio.play('attack');await tick(0);
    expect(ctx.sources.filter(source=>source.started&&!source.stopped)).toHaveLength(4);
    expect(ctx.sources.find(source=>source.buffer?.key==='paper/reveal')!.stopped).toBe(true);
  });

  it('stops active voices and pending outcome layers on mute or hidden-page navigation',async()=>{
    await audio.init();await tick(0);audio.playResolution(sample());await tick(0);
    audio.setMuted(true);audio.setMuted(false);await tick(500);
    expect(played).toEqual(['paper/reveal']);
    expect(contexts[0]!.gains[0]!.gain.setTargetAtTime).toHaveBeenCalled();
    audio.playResolution(sample());await tick(0);
    Object.defineProperty(document,'visibilityState',{configurable:true,value:'hidden'});
    document.dispatchEvent(new Event('visibilitychange'));await tick(500);
    expect(played).toEqual(['paper/reveal','paper/reveal']);
    expect(contexts[0]!.sources.every(source=>source.stopped)).toBe(true);
    audio.playResolution(sample());
    Object.defineProperty(document,'visibilityState',{configurable:true,value:'visible'});
    await tick(500);expect(played).toHaveLength(2);
  });

  it('drops a cue that decoded too late, but keeps its cache for the next valid action',async()=>{
    slowKey='paper/attack';await audio.init();audio.play('attack');await tick(250);
    expect(played).not.toContain('paper/attack');
    audio.play('attack');await tick(0);expect(played).toEqual(['paper/attack']);
    const requests=vi.mocked(fetch).mock.calls.filter(call=>String(call[0]).includes('paper/attack'));
    expect(requests).toHaveLength(1);
  });

  it('a cancelled cue that is still decoding cannot start after returning to the game',async()=>{
    slowKey='paper/insurance';await audio.init();const cancel=audio.play('insurance');cancel();await tick(300);
    expect(played).toEqual([]);
  });

  it('adds only the player ability and suppresses a win/loss sting for voided attempts',async()=>{
    await audio.init();await tick(0);
    const record=sample();
    record.voided=true;
    record.events.push({id:'ability',type:'ability_used',attempt:1,hand:1,side:'player',ability:'ability.retry',text:'再搏'});
    audio.playResolution(record);await tick(500);
    expect(played).toEqual(['paper/reveal','paper/retry']);
  });

  it('uses a distinct piercing impact only at resolution and cancels its pending result',async()=>{
    audio.prepareReveal({reduced:true});await tick(80);
    expect(played).toEqual(['paper/select']);
    const record=sample();record.player={kind:'piercing_wave',boost:0,ability:false};
    const cancel=audio.playResolution(record);await tick(0);
    expect(played).toEqual(['paper/select','paper/attack']);
    expect(contexts[0]!.sources.find(source=>source.buffer?.key==='paper/attack')!.playbackRate.value).toBe(1.18);
    expect(vi.mocked(fetch).mock.calls.every(call=>!String(call[0]).includes('piercing'))).toBe(true);
    cancel();await tick(500);
    expect(played).toEqual(['paper/select','paper/attack']);
    expect(contexts[0]!.sources.every(source=>source.stopped)).toBe(true);
    audio.setMuted(true);audio.playResolution(record);await tick(500);
    expect(played).toHaveLength(2);
  });
  it('uses cached samples for new powers only when their actual effect happens',async()=>{
    await audio.init();await tick(0);
    const record=sample();record.player.ability=true;
    record.events.push({id:'declare-siphon',type:'ability_used',attempt:1,hand:1,side:'player',ability:'ability.siphon',text:'夺气'});
    audio.playResolution(record);await tick(500);
    expect(played).not.toContain('paper/charge');
    played=[];
    record.events.push({id:'transfer',type:'energy_transferred',attempt:1,hand:1,side:'player',amount:2,ability:'ability.siphon',text:'实际转移两气'});
    audio.playResolution(record);await tick(69);expect(played).toEqual(['paper/reveal']);
    await tick(1);expect(played.at(-1)).toBe('paper/charge');
    expect(contexts[0]!.sources.find(source=>source.buffer?.key==='paper/charge')!.playbackRate.value).toBe(.82);
    audio.setMuted(true);await tick(500);
    expect(played).toEqual(['paper/reveal','paper/charge']);
    expect(vi.mocked(fetch).mock.calls.every(call=>!String(call[0]).includes('siphon'))).toBe(true);
  });

  it.each([
    ['ability.scissors_ninja','attack',1.16],
    ['ability.rock_guardian','guard',.84],
    ['ability.paper_trickster','style',1.08],
    ['ability.storyteller','style',1.04],
    ['ability.ronin','attack',0.9],
    ['ability.clockmaker','style',0.88],
    ['ability.scrapper','install',0.9],
    ['ability.broker','charge',1.12],
    ['ability.kite','guard',1.15],
    ['ability.smith','attack',0.82],
    ['ability.monk','guard',0.94],
    ['ability.sheathed','charge',0.92],
    ['ability.cartographer','install',1.18],

  ] as const)('sounds %s only for a positive disclosed player effect, never a voided attempt',async(ability,sound,rate)=>{
    await audio.init();await tick(0);
    const record=sample();
    const effect={id:'passive',type:'passive_triggered' as const,attempt:1,hand:1,side:'player' as const,amount:0,ability,text:'常驻效果'};
    record.events.push(effect);
    audio.playResolution(record);await tick(250);expect(played).not.toContain(`paper/${sound}`);
    played=[];effect.amount=1;record.voided=true;
    audio.playResolution(record);await tick(250);expect(played).toEqual(['paper/reveal']);
    played=[];record.voided=false;
    audio.playResolution(record);await tick(69);expect(played).toEqual(['paper/reveal']);
    await tick(1);expect(played.at(-1)).toBe(`paper/${sound}`);
    expect(contexts[0]!.sources.find(source=>source.buffer?.key===`paper/${sound}`)!.playbackRate.value).toBe(rate);
    audio.setMuted(true);await tick(300);expect(played).toEqual(['paper/reveal',`paper/${sound}`]);
    expect(vi.mocked(fetch).mock.calls.every(call=>!String(call[0]).includes(ability))).toBe(true);
  });

});
