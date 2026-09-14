"""Original Rule Lab sound masters. No external recordings or sample inputs.
Deterministic layered Foley-style wooden resonators / paper noise, and a distinct electronic bank.
Run from project root: python3 art-source/audio/generate.py
"""
from pathlib import Path
import math, random, wave, json, struct
RATE = 48000
EVENTS = {
 'select': (.12, [240]), 'reveal': (.24, [185, 370]),
 'win': (.44, [392, 494, 587]), 'lose': (.34, [294, 220]),
 'draw': (.24, [330, 330]), 'install': (.44, [294, 440, 587]),
 'undo': (.25, [494, 330]), 'name': (.32, [440, 659]),
 'style': (.30, [392, 587]), 'claim_draw': (.34, [330, 660]),
 'insurance': (.40, [392, 494, 587]), 'retry': (.42, [587, 392, 587]),
 'charge': (.34, [196, 294, 440]), 'attack': (.30, [180, 98]),
 'guard': (.32, [440, 660]), 'save': (.28, [392, 587]),
}

def render(event, tone, duration, notes):
 rng = random.Random('rule-lab-2026-ensemble-'+tone+'-'+event)
 frames = []
 low = 0.0; air = 0.0
 impact = event in ['select', 'reveal', 'attack', 'guard']
 protective = event in ['insurance', 'guard']
 rising = event in ['charge', 'claim_draw', 'install']
 sparkling = event in ['win', 'name', 'install', 'insurance']
 for i in range(round(duration*RATE)):
  t = i / RATE; value = 0
  for n, freq in enumerate(notes):
   local = t - n * duration * (.12 if protective else .19)
   if local < 0: continue
   attack = min(1, local / (.008 if protective else .004))
   if tone == 'paper':
    # A struck wood body, a shorter inharmonic shell, and an independently decaying rim.
    value += attack*(math.exp(-local*19)*math.sin(2*math.pi*freq*local)*.40
      + math.exp(-local*38)*math.sin(2*math.pi*freq*2.73*local)*.15
      + math.exp(-local*56)*math.sin(2*math.pi*freq*4.17*local)*.07)
   else:
    # A rounded FM transient over a sine body; no piercing square-wave buzzer.
    phase = 2*math.pi*freq*1.45*local
    mod = math.sin(phase*2.01)*.48*math.exp(-local*27)
    value += attack*math.exp(-local*14)*(math.sin(phase+mod)*.34+math.sin(phase*2)*.06)
  raw = rng.uniform(-1,1); low = low*.86 + raw*.14;air=air*.98+raw*.02
  if tone == 'paper':
   # High-passed paper friction swells separately from the wooden strike.
   paper_env = math.exp(-t*(42 if event=='select' else 26))*min(1,t/.003)
   value += (raw-low)*(.17 if impact else .075)*paper_env
   if event in ['reveal','attack','retry','charge']:
    swell = math.sin(math.pi*min(1,t/(duration*.72)))**2
    value += (low-air)*swell*.18
  else:
   value += (raw-low)*.055*math.exp(-t*45)*min(1,t/.002)
  if impact:
   # A very short low impact supplies weight without a continuous bass bed.
   freq = 82 if tone=='paper' else 108
   value += math.sin(2*math.pi*(freq*t-45*t*t))*.19*math.exp(-t*35)*min(1,t/.005)
  if rising:
   freq = 160 if tone=='paper' else 240
   value += math.sin(2*math.pi*(freq*t+560*t*t))*.095*math.sin(math.pi*t/duration)**2
  if sparkling:
   local=max(0,t-duration*.30)
   value += math.sin(2*math.pi*(1760 if tone=='paper' else 2349)*local)*.055*math.exp(-local*21)*min(1,local/.008)
  if event=='retry':
   # Three soft pulses read as winding back, rather than a generic victory chime.
   value *= .58+.42*math.sin(t*math.pi*14)**2
  # Restrained gain, smooth attack/tail, deterministic original synthesis.
  tail=min(1,(duration-t)/.027);head=min(1,t/.0015)
  frames.append(value*.52*tail*head)
 return frames

manifest=[]
for tone in ['paper','electronic']:
 for event,(duration,notes) in EVENTS.items():
  frames=render(event,tone,duration,notes)
  assert max(abs(x) for x in frames)<.9
  for source,bits in [('art-source/audio/masters',24),('public/assets/audio',16)]:
   path=Path(source)/tone/(event+'.wav');path.parent.mkdir(parents=True,exist_ok=True)
   with wave.open(str(path),'wb') as out:
    out.setnchannels(1);out.setsampwidth(bits//8);out.setframerate(RATE)
    if bits==24: data=b''.join(int(x*8388607).to_bytes(3,'little',signed=True) for x in frames)
    else: data=b''.join(struct.pack('<h',round(x*32767)) for x in frames)
    out.writeframes(data)
  manifest.append({'event':event,'tone':tone,'sampleRate':RATE,'durationSeconds':duration,'peak':round(max(abs(x) for x in frames),4),'rms':round(math.sqrt(sum(x*x for x in frames)/len(frames)),5),'recipe':'layered-ensemble-v2','source':f'art-source/audio/masters/{tone}/{event}.wav','runtime':f'public/assets/audio/{tone}/{event}.wav'})
Path('art-source/audio/manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
print(f'Created {len(manifest)} original WAV masters and runtime WAVs; runtime bytes: {sum(p.stat().st_size for p in Path("public/assets/audio").rglob("*.wav"))}')
