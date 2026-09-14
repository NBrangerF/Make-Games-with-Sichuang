import type { Action, ActionKind, CompiledDesign, GameEvent, Gesture, MatchState, Outcome, Side } from '../core/types';
import { experimentKeys, modifierLabels, type ExperimentKey, type Modifier } from './catalog';
import type { ExperimentFighter, ExperimentInput, ExperimentState, Signal } from './types';

const sides: Side[] = ['player','computer'];
const gestures: Gesture[] = ['rock','scissors','paper','lizard','spock'];
const names: Record<ActionKind,string> = {rock:'石头',scissors:'剪刀',paper:'布',lizard:'蜥蜴',spock:'瓦肯',charge:'蓄气',wave:'波',guard:'防御',piercing_wave:'破防波'};
const other = (s:Side):Side => s==='player'?'computer':'player';
const who = (s:Side) => s==='player'?'你':'对手';
const clamp = (n:number,max:number) => Math.max(0,Math.min(max,n));
export const hasExperiment = (match:Pick<MatchState,'design'>, key:ExperimentKey) => !['modifiers','deck','shuffle','bag'].includes(key) && match.design.rules.includes(`experiment.${key}`);
export const experimentsEnabled = (m:Pick<MatchState,'design'>) => m.design.rules.some(id=>id.startsWith('experiment.'));
const random = (x:ExperimentState) => {x.rng=(Math.imul(x.rng,1664525)+1013904223)>>>0;return x.rng/4294967296;};
function shuffle<T>(x:ExperimentState, list:T[]):T[]{const a=[...list];for(let i=a.length-1;i>0;i--){const j=Math.floor(random(x)*(i+1));[a[i],a[j]]=[a[j]!,a[i]!];}return a;}
const baseDeck:Modifier[]=['leech','sidestep','capture','power','shield','echo'];
export const missionLabels=['用布打出最终平局','选择右侧据点并取得它','以手势击败对方手势'];
export const weatherLabels=['平静','蓄气额外 +1 气','获胜手势 +1 伤'];
export function experimentEvent(m:MatchState,text:string,side?:Side,amount?:number,ability?:GameEvent['ability']){
  m.events.push({id:`${m.id}:e${m.events.length+1}`,type:ability?'passive_triggered':'experiment',attempt:m.attempt,hand:m.hand+1,text,...(side?{side}:{}),...(amount!==undefined?{amount}:{}),...(ability?{ability}:{})});
}
export function prepareExperiments(m:MatchState,c:CompiledDesign):void {
  if(!experimentsEnabled(m))return;
  if(!m.experiment){
    const fighter=():ExperimentFighter=>({queue:null,delayed:0,position:0,factory:0,factoryOverflow:false,upgrade:'none',stash:0,debt:0,modifiers:[],deck:[],discard:[],bag:['red','blue','white','red','blue','white'],drawn:[],risk:[],riskDrawn:[],mission:0,missionDone:false,trophies:[],board:Array(9).fill(0),piece:null,roleUsed:false,focus:0,signal:null});
    m.experiment={preparedHand:-1,rng:(m.seed^0x9e3779b9)>>>0,fighters:{player:fighter(),computer:fighter()},sites:[null,null,null],distance:1,heat:0,well:6,forecast:0,surprise:0,offer:[],bounty:null,rare:[],signalsReady:false,sealedPlayer:null};
    const x=m.experiment;
    for(const s of sides){const f=x.fighters[s];f.mission=Math.floor(random(x)*3);
      if(hasExperiment(m,'deck'))f.deck=shuffle(x,baseDeck);
      else if(hasExperiment(m,'modifiers'))f.modifiers=baseDeck.slice(0,3);
    }
  }
  const x=m.experiment;if(x.preparedHand===m.hand)return;x.preparedHand=m.hand;x.sealedPlayer=null;
  x.signalsReady=!(hasExperiment(m,'declaration')||hasExperiment(m,'promise'));
  x.forecast=hasExperiment(m,'forecast')?Math.floor(random(x)*3):0;
  x.surprise=hasExperiment(m,'surprise')?Math.floor(random(x)*3):0;
  x.offer=shuffle(x,baseDeck).slice(0,3);
  for(const s of sides){const f=x.fighters[s], core=m.fighters[s];f.signal=null;f.factoryOverflow=false;
    if(c.energy&&f.debt){const paid=Math.min(core.energy,f.debt);core.energy-=paid;f.debt-=paid;experimentEvent(m,`${who(s)}偿还 ${paid} 气，尚欠 ${f.debt} 气。`,s);}
    if(f.factory&&hasExperiment(m,'factory')){
      if(f.upgrade==='shield'){core.shield=1;experimentEvent(m,`${who(s)}的工厂铸成 1 盾。`,s);}
      else if(c.energy){const production=f.factory+Number(f.upgrade==='energy'),amount=Math.min(c.energyCap-core.energy,production);f.factoryOverflow=c.overflowShield&&production>amount;core.energy+=amount;experimentEvent(m,`${who(s)}的工厂产出 ${amount} 气。`,s,amount);}
    }
    if(hasExperiment(m,'deck'))while(f.modifiers.length<3){if(!f.deck.length){if(!f.discard.length)break;f.deck=shuffle(x,f.discard);f.discard=[];}f.modifiers.push(f.deck.shift()!);}
    f.drawn=hasExperiment(m,'bag')?shuffle(x,f.bag).slice(0,2):[];
    f.risk=shuffle(x,['safe','safe','safe','danger','danger'] as ('safe'|'danger')[]);f.riskDrawn=[];
  }
  // The CPU's declaration is sealed before the player submits theirs.
  const intent=c.gestures[Math.floor(random(x)*c.gestures.length)]!;
  const budget=m.fighters.computer.energy;
  x.fighters.computer.signal={kind:intent,pledge:hasExperiment(m,'pledge')&&(hasExperiment(m,'declaration')||hasExperiment(m,'promise'))&&budget>=1&&random(x)<.4,promise:hasExperiment(m,'promise')?(budget>=2&&random(x)<.35?'bound':random(x)<.5?'word':'none'):'none'};
  const p=m.fighters.player.energy, cpu=m.fighters.computer.energy;
  x.bounty=hasExperiment(m,'bounty')&&p!==cpu?(p>cpu?'player':'computer'):null;
  const recent=m.history.filter(r=>!r.voided).slice(-6);
  const counts=c.gestures.map(g=>recent.reduce((n,r)=>n+Number(r.player.kind===g)+Number(r.computer.kind===g),0));
  const minimum=Math.min(...counts);x.rare=c.gestures.filter((_,i)=>counts[i]===minimum);
}

export function declarationsNeeded(m:MatchState):boolean{return !!m.experiment&&!m.experiment.signalsReady;}
export function declareExperiment(m:MatchState,signal:Signal,c:CompiledDesign):MatchState{
  if(m.phase!=='preparing'||!declarationsNeeded(m))throw Error('宣言窗口已结束。');
  if(!c.gestures.includes(signal.kind)||typeof signal.pledge!=='boolean'||!['none','word','bound'].includes(signal.promise))throw Error('请选择当前有效的宣言。');
  if(signal.pledge&&!hasExperiment(m,'pledge')||signal.promise!=='none'&&!hasExperiment(m,'promise'))throw Error('尚未加入对应承诺规则。');
  if(Number(signal.pledge)+Number(signal.promise==='bound')>m.fighters.player.energy)throw Error('气不足以预留保证金与绑定援助。');
  const next=structuredClone(m);next.experiment!.fighters.player.signal={...signal};next.experiment!.signalsReady=true;
  experimentEvent(next,`双方宣言揭晓：你说${names[signal.kind]}，对手说${names[next.experiment!.fighters.computer.signal!.kind]}。`);
  return next;
}
export function drawExperimentRisk(m:MatchState):MatchState{
  if(m.phase!=='awaitingPlayer'||m.experiment?.sealedPlayer||!hasExperiment(m,'risk'))throw Error('现在不能继续加码。');
  const next=structuredClone(m),f=next.experiment!.fighters.player;
  if(f.riskDrawn.filter(v=>v==='danger').length>=2||!f.risk.length)throw Error('风险袋本手已停止。');
  f.riskDrawn.push(f.risk.shift()!);return next;
}
export function plannedKind(m:MatchState,s:Side,c:CompiledDesign):ActionKind|null{
  const q=m.experiment?.fighters[s].queue;if(!q||!hasExperiment(m,'queue'))return null;
  if(q==='conditional')return hasExperiment(m,'script')&&c.actions.includes('wave')&&m.fighters[s].energy>=2?'wave':'rock';
  return q;
}
export function enforcePlan(m:MatchState,s:Side,actions:Action[],c:CompiledDesign):Action[]{
  const k=plannedKind(m,s,c);if(!k)return actions;
  // A failed plan is visibly released; no fallback is silently submitted.
  if(!actions.some(a=>a.kind===k))return actions;
  return actions.filter(a=>a.kind===k||(s==='player'&&c.abilities.player==='ability.clockmaker'&&a.ability));
}
export function planFailed(m:MatchState,s:Side,c:CompiledDesign):boolean{
  const k=plannedKind(m,s,c);if(!k)return false;const f=m.fighters[s];
  if(!c.actions.includes(k))return true;
  if(gestures.includes(k as Gesture))return c.finiteCards&&f.cards[k as Gesture]<=0||c.cooldown&&f.lastAction===k;
  const signal=m.experiment?.fighters[s].signal;const reserve=Number(!!signal?.pledge&&hasExperiment(m,'pledge'))+Number(signal?.promise==='bound'&&hasExperiment(m,'promise'));
  return f.energy-reserve<(k==='wave'?c.waveCost:k==='piercing_wave'?3:k==='guard'?c.guardCost:0)||c.specialCooldown&&f.lastAction===k||k==='charge'&&c.chargeTrade&&!c.gestures.some(g=>f.cards[g]>0);
}
const fields:Partial<Record<keyof ExperimentInput,ExperimentKey>>={prediction:'prediction',site:'sites',worker:'workers',move:'range',bid:'auction',draft:'draft',next:'queue',delay:'delayed',speed:'speed',modifier:'modifiers',buy:'deck',shuffle:'shuffle',bag:'bag',bagBuy:'bag',bank:'stash',borrow:'loan',insurance:'insurance',build:'factory',upgrade:'technology',converter:'converter',cell:'puzzle',rotation:'puzzle',discardPiece:'puzzle',sharing:'sharing',give:'trade',want:'trade',honor:'promise',exchangeInfo:'information'};
export function experimentCost(m:MatchState,a:Action):number{
  if(!m.experiment)return 0;const i=a.experiment??{},s=m.experiment.fighters.player;
  return inputCost(m,i,s.signal);
}
function inputCost(m:MatchState,i:ExperimentInput,signal:Signal|null):number{
  const has=(k:ExperimentKey)=>hasExperiment(m,k);
  return Number(has('pledge')&&!!signal?.pledge)+Number(has('promise')&&signal?.promise==='bound')+
    (has('auction')?(i.bid??0):0)+Number(has('speed')&&i.speed==='heavy')+Number(has('deck')&&!!i.buy)+Number(has('shuffle')&&has('deck')&&!!i.shuffle)+Number(has('bag')&&!!i.bagBuy)+
    Number(has('insurance')&&!!i.insurance&&i.insurance!=='none')+Number(has('factory')&&!!i.build)+Number(has('technology')&&has('factory')&&!!i.upgrade&&i.upgrade!=='none')+Number(has('converter')&&i.converter==='energy_card');
}
export function loanCredit(m:MatchState,s:Side,a:Action,c:CompiledDesign):number{return c.energy&&hasExperiment(m,'loan')&&a.experiment?.borrow?Math.min(1,c.energyCap-m.fighters[s].energy):0;}
export function validateExperiment(m:MatchState,s:Side,a:Action,c:CompiledDesign,baseCost:number):void{
  const i=a.experiment??{},x=m.experiment;
  if(!x){if(Object.keys(i).length)throw Error('尚未加入实验机制。');return;}
  const f=x.fighters[s],has=(k:ExperimentKey)=>hasExperiment(m,k);
  for(const [field,value] of Object.entries(i)){
    if(value===undefined)continue;
    const k=fields[field as keyof ExperimentInput];
    if(!k||!has(k)&&!(field==='modifier'&&has('deck')))throw Error(`此附加选择尚未启用：${field}`);
  }
  for(const [key,max,min] of [['site',2,0],['worker',2,0],['move',1,-1],['bid',2,0],['draft',2,0],['modifier',Math.max(0,f.modifiers.length-1),0],['bag',1,0],['cell',8,0],['rotation',3,0]] as const){const n=i[key];if(n!==undefined&&(!Number.isInteger(n)||n<min||n>max))throw Error('附加选择超出可用范围。');}
  for(const key of ['delay','shuffle','bank','borrow','build','discardPiece','honor','exchangeInfo'] as const)if(i[key]!==undefined&&typeof i[key]!=='boolean')throw Error('附加开关无效。');
  for(const [key,values] of [['speed',['normal','quick','heavy']],['insurance',['none','wave','gesture']],['upgrade',['none','energy','shield']],['converter',['none','shield_energy','energy_card']],['sharing',['share','take']],['bagBuy',['red','blue','white']]] as const)if(i[key]!==undefined&&!(values as readonly string[]).includes(i[key]!))throw Error('附加选项无效。');
  if(i.buy&&!Object.hasOwn(modifierLabels,i.buy))throw Error('未知修饰。');
  if(i.prediction&&!c.actions.includes(i.prediction)||i.next&&i.next!=='conditional'&&!c.actions.includes(i.next))throw Error('请选择当前启用的动作。');
  if(i.next==='conditional'&&!has('script'))throw Error('尚未加入条件脚本。');
  if(i.modifier!==undefined&&!f.modifiers[i.modifier])throw Error('没有这张修饰牌。');
  if(i.bag!==undefined&&!f.drawn[i.bag])throw Error('没有这枚筹码。');
  if(i.bank&&a.boost)throw Error('收手时不能同时强化。');
  if(i.build&&f.factory>=2)throw Error('工厂最多两座。');
  if(i.upgrade&&i.upgrade!=='none'&&has('factory')&&(!f.factory||f.upgrade!=='none'))throw Error('先有工厂；每场只能升级一个分支。');
  if(i.bagBuy&&f.bag.length>=18)throw Error('袋中最多十八枚筹码。');
  if(i.give||i.want){if(!i.give||!i.want||i.give===i.want||!c.gestures.includes(i.give)||!c.gestures.includes(i.want))throw Error('交换需要不同的当前手势。');
    if(c.finiteCards&&m.fighters[s].cards[i.give]<1+Number(a.kind===i.give))throw Error('出手与交换必须各自预留一张牌。');}
  const reserve=inputCost(m,i,f.signal);
  if(baseCost+reserve>m.fighters[s].energy+loanCredit(m,s,a,c))throw Error(`需要预留 ${baseCost+reserve} 气，当前资源不足。请降低出价或取消附加消费。`);
  if(has('puzzle')&&f.piece&&!i.discardPiece&&i.cell!==undefined){const board=[...f.board];if(a.ability&&c.abilities[s]==='ability.cartographer')board[i.cell]=0;if(!pieceCells(f.piece,i.cell,i.rotation??0,board))throw Error('拼块在这里放不下，请换位置、旋转或放弃此块。');}
}

export function sealExperimentAction(m:MatchState,a:Action):MatchState{
  if(!m.experiment||!hasExperiment(m,'information'))return m;
  if(m.experiment.sealedPlayer)throw Error('主动作已经封存。');
  const next=structuredClone(m);next.experiment!.sealedPlayer=structuredClone(a);return next;
}
export function ensureSealedAction(m:MatchState,a:Action):void{
  const sealed=m.experiment?.sealedPlayer;if(!sealed)return;
  const withoutInsurance=(action:Action)=>{const result=structuredClone(action);if(result.experiment)delete result.experiment.insurance;return result;};
  if(JSON.stringify(withoutInsurance(sealed))!==JSON.stringify(withoutInsurance(a)))throw Error('信息揭晓后只能选择保险，主动作和其他选择已经封存。');
}

/** CPU input depends on its private inventory and already-public facts, never the player's draft or private mission. */
export function computerExperiment(m:MatchState,base:Action,c:CompiledDesign,baseCost:(a:Action)=>number,legal:Action[]):Action{
  const x=m.experiment;if(!x)return base;const f=x.fighters.computer,has=(k:ExperimentKey)=>hasExperiment(m,k),pick=(n:number)=>Math.floor(random(x)*n);
  let a={...base};
  const signal=x.fighters.player.signal;
  if(signal&&has('declaration')&&random(x)<(signal.pledge?.8:.35)){
    const counter:Record<Gesture,Gesture>={rock:'paper',paper:'scissors',scissors:'rock',lizard:'rock',spock:'paper'};
    a={...(legal.find(v=>v.kind===counter[signal.kind]&&!v.boost&&!v.ability)??a)};
  }else if(f.signal?.pledge&&random(x)<.7)a={...(legal.find(v=>v.kind===f.signal!.kind&&!v.boost&&!v.ability)??a)};
  const i:ExperimentInput={};
  if(has('prediction')){const history=m.history.filter(r=>!r.voided).slice(-4);i.prediction=history.length?history[pick(history.length)]!.player.kind:c.actions[pick(c.actions.length)];}
  if(has('sites'))i.site=has('mission')&&f.mission===1&&!f.missionDone?2:pick(3);
  if(has('workers'))i.worker=c.energy&&m.fighters.computer.energy<2?0:pick(3);
  if(has('range'))i.move=a.kind==='wave'?1:gestures.includes(a.kind as Gesture)?-1:0;
  if(has('auction'))i.bid=pick(3);
  if(has('draft'))i.draft=pick(3);
  if(has('queue'))i.next=has('script')?'conditional':a.kind==='charge'&&c.actions.includes('wave')?'wave':c.actions[pick(c.actions.length)];
  if(has('delayed'))i.delay=c.life&&random(x)<.12;
  if(has('speed'))i.speed=random(x)<.35?'heavy':random(x)<.5?'quick':'normal';
  if((has('modifiers')||has('deck'))&&f.modifiers.length&&random(x)<.7)i.modifier=pick(f.modifiers.length);
  if(has('deck')&&random(x)<.2)i.buy=baseDeck[pick(baseDeck.length)];
  if(has('shuffle')&&has('deck')&&f.discard.length>2)i.shuffle=true;
  if(has('bag')){i.bag=pick(2);if(f.bag.length<18&&random(x)<.15)i.bagBuy=['red','blue','white'][pick(3)] as 'red'|'blue'|'white';}
  if(has('stash'))i.bank=f.stash>=2||m.fighters.computer.life===1&&f.stash>0;
  if(i.bank)a.boost=0;
  if(has('risk')){const count=pick(4);while(f.riskDrawn.length<count&&f.riskDrawn.filter(v=>v==='danger').length<2&&f.risk.length)f.riskDrawn.push(f.risk.shift()!);}
  if(has('loan'))i.borrow=c.energy&&m.fighters.computer.energy<c.energyCap&&random(x)<.3;
  if(has('insurance')&&random(x)<.3)i.insurance=m.fighters.player.energy>=2?'wave':'gesture';
  if(has('factory'))i.build=c.life&&f.factory<2&&m.fighters.computer.life>1&&random(x)<.25;
  if(has('technology')&&has('factory')&&f.factory&&f.upgrade==='none'&&random(x)<.25)i.upgrade=random(x)<.5?'energy':'shield';
  if(has('converter'))i.converter='shield_energy';
  if(has('puzzle')&&f.piece){outer:for(let r=0;r<4;r++)for(let cell=0;cell<9;cell++)if(pieceCells(f.piece,cell,r,f.board)){i.cell=cell;i.rotation=r;break outer;}if(i.cell===undefined)i.discardPiece=true;}
  if(has('sharing')){const prev=m.history.filter(r=>!r.voided).at(-1);i.sharing=prev?.player.experiment?.sharing==='take'?'take':random(x)<.6?'share':'take';}
  if(has('trade')&&c.finiteCards){i.give=c.gestures.find(g=>m.fighters.computer.cards[g]>1+Number(a.kind===g));i.want=c.gestures.find(g=>g!==i.give&&m.fighters.computer.cards[g]<2);if(!i.give||!i.want){delete i.give;delete i.want;}}
  if(has('promise'))i.honor=random(x)<.65;
  if(has('information'))i.exchangeInfo=random(x)<.75;
  a.experiment=i;
  // Reservation comes from opening resources, never hypothetical gains later in this hand.
  const affordable=()=>baseCost(a)+inputCost(m,i,f.signal)<=m.fighters.computer.energy+loanCredit(m,'computer',a,c);
  for(const key of ['bid','buy','shuffle','bagBuy','insurance','build','upgrade','speed'] as const)if(!affordable())delete i[key];
  if(!affordable()){a.boost=0;a.wager=false;}
  if(!affordable()) {const cheap=legal.find(v=>baseCost(v)+inputCost(m,i,f.signal)<=m.fighters.computer.energy+loanCredit(m,'computer',a,c));if(cheap)a={...cheap,experiment:i};}
  return a;
}

export function pieceCells(kind:Gesture,cell:number,rotation:number,board:number[]):number[]|null{
  let shape=kind==='rock'?[[0,0],[1,0]]:kind==='scissors'?[[0,0],[0,1],[1,1]]:[[0,0]];
  for(let r=0;r<rotation;r++)shape=shape.map(([x,y])=>[-y!,x!]);
  const minX=Math.min(...shape.map(p=>p[0]!)),minY=Math.min(...shape.map(p=>p[1]!));
  const points=shape.map(([x,y])=>[cell%3+x!-minX,Math.floor(cell/3)+y!-minY]);
  if(points.some(([x,y])=>x!<0||x!>=3||y!<0||y!>=3))return null;
  const result=points.map(([x,y])=>y!*3+x!);return result.some(n=>board[n])?null:result;
}

export interface ExperimentHooks {energy:(s:Side,n:number,reason:string)=>void;shield:(s:Side,reason:string)=>void;damage:(s:Side,n:number)=>void;}
export interface ExperimentResolution {damage:(s:Side,n:number)=>number;charge:(s:Side,normal:number)=>number;finish:()=>void;}
/** All expansion effects use one bounded transaction; rewards never recurse. */
export function resolveExperiments(m:MatchState,c:CompiledDesign,actions:Record<Side,Action>,outcome:Outcome,h:ExperimentHooks,effectStart=m.events.length):ExperimentResolution{
  const x=m.experiment;if(!x)return {damage:(_,n)=>n,charge:(_,n)=>n,finish:()=>{}};
  const has=(k:ExperimentKey)=>hasExperiment(m,k),before=structuredClone(m.fighters),prior=structuredClone(x.fighters);
  const input=(s:Side)=>actions[s].experiment??{};
  const mod=(s:Side)=>input(s).modifier===undefined?undefined:prior[s].modifiers[input(s).modifier!];
  const coin=(s:Side)=>input(s).bag===undefined?undefined:prior[s].drawn[input(s).bag!];
  const active=(s:Side,key:string)=>actions[s].ability&&c.abilities[s]===`ability.${key}`;
  const passive=(s:Side,key:string)=>c.abilities[s]===`ability.${key}`;
  const spend=(s:Side,n:number,label:string)=>{if(!n)return;const f=m.fighters[s];if(f.energy<n)throw Error(`${who(s)}的${label}支付不足。`);f.energy-=n;f.energySpent+=n;experimentEvent(m,`${who(s)}${label}支付 ${n} 气。`,s,n);};
  const gain=(s:Side,n:number,label:string)=>{if(c.energy&&n>0)h.energy(s,n,label);};
  const role=(s:Side,label:string)=>{x.fighters[s].roleUsed=true;experimentEvent(m,`${label}生效。`,s,1,c.abilities[s]!);};
  const refill=(s:Side,g:ActionKind,n=1)=>{if(c.finiteCards&&gestures.includes(g as Gesture)){m.fighters[s].cards[g as Gesture]+=n;experimentEvent(m,`${who(s)}补回 ${n} 张${names[g]}。`,s,n);}};
  const giveModifier=(s:Side,v:Modifier)=>{const f=x.fighters[s];if(has('deck'))f.discard.push(v);else if(f.modifiers.length<6)f.modifiers.push(v);else{experimentEvent(m,`${who(s)}修饰已满六张，本次未收下${modifierLabels[v]}。`,s);return;}experimentEvent(m,`${who(s)}获得修饰「${modifierLabels[v]}」${has('deck')?'，进入弃牌堆':''}。`,s);};
  const winner=outcome==='draw'?null:outcome;
  const bids={player:has('auction')?(input('player').bid??0):0,computer:has('auction')?(input('computer').bid??0):0};
  const auctionWinner:Side|null=!has('auction')?null:bids.player===bids.computer?winner:bids.player>bids.computer?'player':'computer';
  if(has('range'))x.distance=clamp(x.distance+(input('player').move??0)+(input('computer').move??0),2);
  for(const s of sides){const i=input(s),f=x.fighters[s],a=actions[s];
    if(planFailed(m,s,c))experimentEvent(m,`${who(s)}的封存计划无法执行，已公开解除。`,s);
    if(active(s,'clockmaker')&&prior[s].queue)role(s,'钟表师改令');
    if(i.borrow&&has('loan')){const credit=loanCredit(m,s,a,c);m.fighters[s].energy+=credit;f.debt+=credit;experimentEvent(m,`${who(s)}借到 ${credit} 气，下手偿还。`,s,credit);}
    const reserved=inputCost(m,i,prior[s].signal),bidReserve=bids[s];
    // Heavy cost is prepaid even though its penalty is described at the ending beat.
    spend(s,reserved-bidReserve,'附加选择');
    if(has('auction'))spend(s,has('all_pay')||auctionWinner===s?bids[s]:0,'竞价');
    if(has('pledge')&&prior[s].signal?.pledge&&a.kind===prior[s].signal!.kind){gain(s,1,'兑现宣言退还保证金');if(passive(s,'storyteller')&&!prior[s].roleUsed){gain(s,1,'狐面说书人');role(s,'狐面说书人');}}
    if(has('range')&&(i.move??0)<0)f.position=clamp(f.position-1,4);
    if(coin(s)==='blue'||mod(s)==='shield')h.shield(s,'使用防护修饰');
    if(has('speed')&&i.speed==='quick'&&winner===s)gain(s,1,'快招先回气');
    if(has('puzzle')&&prior[s].piece){
      if(i.discardPiece){f.piece=null;experimentEvent(m,`${who(s)}放弃待放拼块。`,s);}
      else if(i.cell!==undefined){if(active(s,'cartographer')){f.board[i.cell]=0;role(s,'绘图师整理空间');}
        const cells=pieceCells(prior[s].piece!,i.cell,i.rotation??0,f.board);
        if(cells){for(const n of cells)f.board[n]=1;f.piece=null;let rows=0;for(let row=0;row<3;row++)if(f.board.slice(row*3,row*3+3).every(Boolean)){f.board.splice(row*3,3,0,0,0);rows++;}gain(s,rows,'拼图整行兑现');experimentEvent(m,`${who(s)}放下拼块${rows?`，完成 ${rows} 行`:''}。`,s);}
      }
    }
  }
  const weatherBonus=Number(has('forecast')&&x.forecast===2)+Number(has('surprise')&&x.surprise===2);
  const riskBonus=(s:Side)=>prior[s].riskDrawn.filter(v=>v==='danger').length>=2?0:prior[s].riskDrawn.filter(v=>v==='safe').length;
  const damage=(s:Side,n:number)=>{
    const i=input(s),a=actions[s];
    if(i.delay&&has('delayed')||i.build&&has('factory')||active(s,'ronin')&&has('push')||active(s,'kite')&&has('range')&&!!i.move)return 0;
    if(has('range')&&(gestures.includes(a.kind as Gesture)?x.distance>1:['wave','piercing_wave'].includes(a.kind)&&x.distance<1))return 0;
    return Math.max(0,n+Number(has('speed')&&i.speed==='heavy')+Number(mod(s)==='power')+Number(coin(s)==='red')+(has('risk')?riskBonus(s):0)+(gestures.includes(a.kind as Gesture)?weatherBonus:0));
  };
  const chargers=sides.filter(s=>actions[s].kind==='charge');
  const shared=has('well')?chargers.length===2?Math.min(1,Math.floor(x.well/2)):Math.min(2,x.well):null;
  const charge=(s:Side,normal:number)=>{const base=shared===null?normal:shared;if(shared!==null)x.well-=base;return base+Number(has('forecast')&&x.forecast===1)+Number(has('surprise')&&x.surprise===1);};
  return {damage,charge,finish:()=>{
    for(const s of sides)if(x.fighters[s].factoryOverflow){h.shield(s,'工厂溢气在主伤害后成盾');x.fighters[s].factoryOverflow=false;}
    if(has('surprise'))experimentEvent(m,`揭晓后环境：${weatherLabels[x.surprise]}。`);
    if(has('range'))experimentEvent(m,`双方移动后距离 ${x.distance}，交锋胜负与射程命中分别结算。`);
    if(has('auction')){experimentEvent(m,`暗标：你 ${bids.player} 气／对手 ${bids.computer} 气；${auctionWinner?`${who(auctionWinner)}拿到奖品`:'流拍'}。`);if(auctionWinner)h.shield(auctionWinner,'竞拍所得，保护下手');}
    const resource=(s:Side,place:number)=>{if(place===0)gain(s,1,'地点收益');if(place===1)h.shield(s,'地点收益');if(place===2)refill(s,actions[s].kind);};
    if(has('sites')){
      const p=input('player').site??1,q=input('computer').site??1;
      if(p===q){if(winner){x.sites[p]=winner;if(has('terrain'))resource(winner,p);}}
      else{for(const s of sides){const place=input(s).site??1;x.sites[place]=s;if(has('terrain'))resource(s,place);}}
      experimentEvent(m,`据点选择：你去${['左','中','右'][p]}，对手去${['左','中','右'][q]}。`);
    }
    if(has('workers')){const p=input('player').worker??0,q=input('computer').worker??0;if(p!==q){resource('player',p);resource('computer',q);}else if(winner)resource(winner,p);experimentEvent(m,`派工：你选${['气井','锻炉','补给站'][p]}，对手选${['气井','锻炉','补给站'][q]}${p===q&&!winner?'，争抢平局，双方落空':''}。`);}
    if(has('draft')){const p=input('player').draft??0,q=input('computer').draft??0;if(p!==q){giveModifier('player',x.offer[p]!);giveModifier('computer',x.offer[q]!);}else if(winner)giveModifier(winner,x.offer[p]!);
      if(p===q&&winner==='computer'&&passive('player','scrapper')&&!prior.player.roleUsed){giveModifier('player','leech');role('player','废铁匠');}}
    if(has('push')&&winner){const loser=other(winner),steps=1+Number(active(winner,'ronin'));if(active(winner,'ronin'))role(winner,'浪人追猎');const extra=Math.max(0,x.fighters[loser].position+steps-4);x.fighters[loser].position=clamp(x.fighters[loser].position+steps,4);if(c.life&&extra)h.damage(loser,extra);experimentEvent(m,`${who(loser)}被击退至 ${x.fighters[loser].position}/4 格。`,loser);}
    if(has('furnace')){const added=sides.reduce((n,s)=>n+Math.max(0,Number(actions[s].boost>0)-Number(active(s,'smith'))),0);x.heat+=added;for(const s of sides)if(active(s,'smith')&&actions[s].boost)role(s,'赤炉锻师');if(x.heat>=3){x.heat=0;if(c.life)for(const s of sides)h.damage(s,1);experimentEvent(m,'共享熔炉达到三格，同时爆发并清零。');}else if(added)experimentEvent(m,`公共热度 ${x.heat}/3。`);}
    if(has('well')&&!chargers.length)x.well=Math.min(6,x.well+1);
    if(has('trade')&&c.finiteCards){const p=input('player'),q=input('computer');if(p.give&&p.want&&p.give===q.want&&p.want===q.give&&m.fighters.player.cards[p.give]>0&&m.fighters.computer.cards[q.give!]>0){m.fighters.player.cards[p.give]--;m.fighters.computer.cards[q.give!]--;m.fighters.player.cards[p.want]++;m.fighters.computer.cards[q.want!]++;experimentEvent(m,`双方交换成交：你交出${names[p.give]}，得到${names[p.want]}。`);}else if(p.give||q.give)experimentEvent(m,'双方交换未匹配，手牌不转移。');}
    for(const s of sides){const i=input(s),a=actions[s],f=x.fighters[s],enemy=other(s),enemyAction=actions[enemy],won=winner===s;
      if(has('prediction')&&i.prediction){const hit=i.prediction===enemyAction.kind;experimentEvent(m,`${who(s)}预判${names[i.prediction]}：${hit?'命中':'未命中'}。`,s,Number(hit));if(hit)gain(s,1,'秘密预判');}
      if(has('mission')&&!f.missionDone){const done=f.mission===0?a.kind==='paper'&&outcome==='draw':f.mission===1?has('sites')&&(i.site??1)===2&&x.sites[2]===s:won&&gestures.includes(a.kind as Gesture)&&gestures.includes(enemyAction.kind as Gesture);if(done){f.missionDone=true;gain(s,1,'完成秘密委托');experimentEvent(m,`${who(s)}完成并公开委托：${missionLabels[f.mission]}。`,s);}}
      if(has('collection')&&won&&gestures.includes(enemyAction.kind as Gesture)&&!f.trophies.includes(enemyAction.kind as Gesture)){f.trophies.push(enemyAction.kind as Gesture);if(f.trophies.length>=3){f.trophies=[];gain(s,2,'战利品套组兑现');}}
      if(has('bounty')&&won&&x.bounty===enemy)gain(s,1,'富者悬赏');
      if(has('rarity')&&x.rare.includes(a.kind as Gesture))gain(s,1,'冷门补贴');
      if(has('stash')){if(i.bank){gain(s,prior[s].stash,'收手兑现战利品');f.stash=0;}else if(won)f.stash++;else if(winner===enemy)f.stash=0;experimentEvent(m,`${who(s)}未入袋战利品 ${f.stash}。`,s);}
      if(has('risk')&&prior[s].riskDrawn.length){const bust=prior[s].riskDrawn.filter(v=>v==='danger').length>=2;if(bust){const lost=Math.min(1,m.fighters[s].energy);m.fighters[s].energy-=lost;experimentEvent(m,`${who(s)}冒险爆掉，加成归零，失去 ${lost} 气。`,s);}else experimentEvent(m,`${who(s)}冒险收手，${riskBonus(s)} 枚安全筹。`,s);}
      if(has('insurance')&&i.insurance&&i.insurance!=='none'){const hit=winner===enemy&&(i.insurance==='wave'?['wave','piercing_wave'].includes(enemyAction.kind):gestures.includes(enemyAction.kind as Gesture));if(hit&&c.finiteCards&&gestures.includes(a.kind as Gesture)&&before[s].cards[a.kind as Gesture]>0){refill(s,a.kind);experimentEvent(m,`${who(s)}保险赔付一张实际打出的牌。`,s);}else experimentEvent(m,`${who(s)}保险未达到赔付条件。`,s);}
      if(active(s,'broker')&&has('auction')&&auctionWinner!==s&&has('all_pay')&&bids[s]>0){gain(s,Math.min(1,bids[s]),'街头庄家返费');role(s,'街头庄家');}
      if(active(s,'kite')&&has('range')&&i.move&&won){f.position=clamp(f.position-2,4);role(s,'纸鸢行者');}
      if(has('sharing')){const self=i.sharing??'share',their=input(enemy).sharing??'share';gain(s,self==='share'&&their==='share'?1:self==='take'&&their==='share'?2:0,'分享与独吞');if(self==='share'&&their==='take'&&passive(s,'monk')&&!prior[s].roleUsed){h.shield(s,'守约僧');role(s,'守约僧');}}

      const selected=mod(s);if(selected!==undefined){
        if((selected==='leech'&&won)||(selected==='echo'&&outcome==='draw'))gain(s,1,modifierLabels[selected]);
        if(selected==='capture'&&won)refill(s,enemyAction.kind);
        if(selected==='sidestep'&&winner===enemy)f.position=clamp(f.position-1,4);
        const index=i.modifier!;f.modifiers.splice(index,1);if(has('deck'))f.discard.push(selected);
        experimentEvent(m,`${who(s)}消耗修饰「${modifierLabels[selected]}」。`,s);
      }
      if(coin(s)==='white')gain(s,1,'白色筹码');
      if(passive(s,'sheathed')&&(has('modifiers')||has('deck'))){if(selected!==undefined){gain(s,prior[s].focus,'藏锋兑现');if(prior[s].focus)role(s,'藏锋者');f.focus=0;}else f.focus=Math.min(2,f.focus+1);}
      if(has('deck')&&i.buy)f.discard.push(i.buy);
      if(has('shuffle')&&has('deck')&&i.shuffle){f.deck=shuffle(x,[...f.deck,...f.discard]);f.discard=[];experimentEvent(m,`${who(s)}提前洗回弃牌。`,s);}
      if(has('bag')&&i.bagBuy)f.bag.push(i.bagBuy);
      if(has('factory')&&i.build){f.factory++;experimentEvent(m,`${who(s)}建成工厂 ${f.factory}/2，下手开始产出。`,s);}
      if(has('technology')&&has('factory')&&i.upgrade&&i.upgrade!=='none'){f.upgrade=i.upgrade;experimentEvent(m,`${who(s)}设备升级为${i.upgrade==='energy'?'高产':'铸盾'}分支。`,s);}
      if(has('converter')){
        if(i.converter==='shield_energy'&&m.events.slice(effectStart).some(e=>e.type==='shield_gained'&&e.side===s&&(e.amount??0)>0))gain(s,1,'新盾转换回气');
        if(i.converter==='energy_card')refill(s,a.kind);
      }
      f.delayed=has('delayed')&&i.delay?1:0;
      if(f.delayed)experimentEvent(m,`${who(s)}预告下手追加一伤；本手主伤害已放弃。`,s);
      if(has('queue')){f.queue=i.next??null;if(f.queue)experimentEvent(m,`${who(s)}封存了下一招。`,s);}
      if(has('puzzle')&&won&&gestures.includes(a.kind as Gesture)){if(!f.piece)f.piece=a.kind as Gesture;else experimentEvent(m,`${who(s)}已有待放拼块，本手新拼块未收下。`,s);}
    }
    if(has('delayed')&&c.life)for(const s of sides)if(prior[s].delayed)h.damage(other(s),prior[s].delayed);
    if(has('promise')){
      for(const s of sides)if(prior[s].signal?.promise==='bound'&&actions[other(s)].kind!=='paper')gain(s,1,'对方未出布，退回绑定援助预留');
      const transfers=sides.map(s=>({side:s,bound:prior[s].signal?.promise==='bound',amount:actions[other(s)].kind==='paper'&&(prior[s].signal?.promise==='bound'||prior[s].signal?.promise==='word'&&input(s).honor&&m.fighters[s].energy>0)?1:0}));
      for(const t of transfers)if(t.amount&&!t.bound)spend(t.side,t.amount,'兑现口头援助');
      for(const t of transfers)if(t.amount){gain(other(t.side),t.amount,'收到援助');experimentEvent(m,`${who(t.side)}兑现援助承诺。`,t.side);}else if(prior[t.side].signal?.promise==='word')experimentEvent(m,`${who(t.side)}的口头援助未兑现。`,t.side);
    }
    if(has('sharing'))experimentEvent(m,`分享选择：你${input('player').sharing==='take'?'独吞':'分享'}，对手${input('computer').sharing==='take'?'独吞':'分享'}。`);
  }};
}

/** A UI projection never contains an unrevealed opponent queue, mission, hand, risk draw or event. */
export function publicExperiment(m:MatchState,revealed=false):ExperimentState|undefined{
  if(!m.experiment)return undefined;const x=structuredClone(m.experiment);x.rng=0;x.sealedPlayer=null;
  if(!revealed)x.surprise=-1;
  const f=x.fighters.computer;f.queue=null;f.modifiers=[];f.deck=[];f.discard=[];f.drawn=[];f.risk=[];f.riskDrawn=[];if(!f.missionDone)f.mission=-1;if(!x.signalsReady)f.signal=null;
  return x;
}
export const currentExperimentCount = experimentKeys.length;
