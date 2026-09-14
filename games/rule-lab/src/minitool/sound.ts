/** Short offline synthesis replaces network-loaded WAVs, keeping all existing cue scheduling. */
export function synthesizeCue(context: AudioContext, event: string, tone: 'paper' | 'electronic'): AudioBuffer {
  const names = ['select','reveal','win','lose','draw','install','undo','name','style','claim_draw','insurance','retry','charge','attack','guard','save'];
  const index = Math.max(0,names.indexOf(event));
  const duration = ['win','lose','install','claim_draw'].includes(event) ? .30 : .16;
  const rate = 22050, length = Math.floor(duration * rate);
  const buffer = context.createBuffer(1,length,rate), data = buffer.getChannelData(0);
  let seed = (index + 1) * 7919;
  const frequency = [440,220,660,180,330,540,280,510,620,750,390,490,320,145,205,600][index];
  for(let n=0;n<length;n++) {
    const t=n/rate, envelope=Math.min(1,t/.004)*Math.exp(-t/(duration*.22));
    seed=(Math.imul(seed,1664525)+1013904223)>>>0;
    const noise=(seed/4294967296)*2-1;
    const glide=event==='charge'?1+t*2:event==='lose'?1-t:1;
    const wave=Math.sin(2*Math.PI*frequency*glide*t);
    data[n]=envelope*(tone==='paper' ? noise*.16+wave*.16 : wave*.25+Math.sin(4*Math.PI*frequency*t)*.055);
  }
  return buffer;
}
