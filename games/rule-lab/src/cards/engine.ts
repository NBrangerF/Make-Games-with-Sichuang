import type { Action, CompiledDesign, FighterState, MatchState, Outcome, Side } from '../core/types';
import { CARD_LIBRARY, cardDefinition, type CardZone, type PlayingCard } from './catalog';
const sides:Side[]=['player','computer'];
export const cardMode = (m:Pick<MatchState,'design'>) => m.design.rules.some(id=>id==='cards.finite'||['experiment.deck','experiment.modifiers','experiment.shuffle','experiment.bag'].includes(id));
export const cycles = (m:Pick<MatchState,'design'>) => m.design.rules.includes('experiment.deck');
export const forgeEnabled = (m:Pick<MatchState,'design'>) => m.design.rules.includes('experiment.bag');
function random(z:CardZone){z.rng=(Math.imul(z.rng,1664525)+1013904223)>>>0;return z.rng/4294967296;}
function shuffle(z:CardZone,cards:PlayingCard[]){for(let i=cards.length-1;i>0;i--){const j=Math.floor(random(z)*(i+1));[cards[i],cards[j]]=[cards[j]!,cards[i]!];}return cards;}
function make(z:CardZone,definition:string):PlayingCard{return {uid:`card-${++z.serial}`,definition};}
function emit(m:MatchState,side:Side,text:string){m.events.push({id:`${m.id}:e${m.events.length+1}`,type:'card_effect',attempt:m.attempt,hand:m.hand+1,side,text:`${side==='player'?'你':'对手'}${text}`});}
export function projectCounts(f:FighterState){if(!f.cardZone)return;for(const g of Object.keys(f.cards) as (keyof typeof f.cards)[])f.cards[g]=f.cardZone.hand.filter(card=>cardDefinition(card.definition).kind===g).length;}
/** Legacy inventory rewards are translated into actual cards, never a second stockpile. */
export function reconcileCards(f:FighterState){const z=f.cardZone;if(!z)return;for(const g of Object.keys(f.cards) as (keyof typeof f.cards)[]){let owned=z.hand.filter(card=>cardDefinition(card.definition).kind===g);while(owned.length>f.cards[g]){const card=owned.shift()!;z.hand.splice(z.hand.indexOf(card),1);z.discard.push(card);}while(owned.length<f.cards[g]){const card=make(z,g);z.hand.push(card);owned.push(card);}}}
export function drawCards(m:MatchState,s:Side,n:number){const f=m.fighters[s],z=f.cardZone;if(!z||!cycles(m))return;let drawn=0;while(n-->0&&z.hand.length<7){if(!z.draw.length){if(!z.discard.length)break;z.draw=shuffle(z,z.discard);z.discard=[];z.recycled++;}z.hand.push(z.draw.shift()!);drawn++;}projectCounts(f);if(drawn)emit(m,s,`抽到 ${drawn} 张牌。`);}
export function prepareCards(m:MatchState,c:CompiledDesign){if(!cardMode(m))return;for(const s of sides){const f=m.fighters[s];if(!f.cardZone){const z:CardZone={hand:[],draw:[],discard:[],rng:(m.seed^(s==='player'?0x12345678:0x87654321))>>>0,serial:0,prepared:-1,recycled:0,ink:2,crafted:-1,exchanged:-1,focus:0};f.cardZone=z;const special=cycles(m)||m.design.rules.includes('experiment.modifiers');for(const g of c.gestures){const options=g==='rock'?['rock','bloodstone','bastion']:g==='scissors'?['scissors','needle','relay']:g==='paper'?['paper','letter','echo']:[g,g,g];for(let i=0;i<c.cardsPerGesture;i++)z.hand.push(make(z,special?options[i%3]!:g));}if(cycles(m)){z.draw=shuffle(z,z.hand);z.hand=[];}}
const z=f.cardZone;if(z.prepared===m.hand)continue;reconcileCardsIfExisting(m,s);z.prepared=m.hand;if(cycles(m))drawCards(m,s,Math.max(0,5-z.hand.length));projectCounts(f);}}
function reconcileCardsIfExisting(m:MatchState,s:Side){if(m.fighters[s].cardZone!.prepared>=0)reconcileCards(m.fighters[s]);}
export function cardActions(f:FighterState,actions:Action[]):Action[]{const z=f.cardZone;if(!z)return actions;return actions.flatMap(action=>{if(!Object.hasOwn(f.cards,action.kind))return [action];return z.hand.filter(card=>cardDefinition(card.definition).kind===action.kind).map(card=>({...action,cardId:card.uid}));});}
export function normalizeCardAction(f:FighterState,action:Action):Action {if(!f.cardZone||action.cardId)return action;const card=f.cardZone.hand.find(card=>cardDefinition(card.definition).kind===action.kind);return card?{...action,cardId:card.uid}:action;}
export function combatCards(m:MatchState,c:CompiledDesign,actions:Record<Side,Action>,outcome:Outcome,h:{shield:(s:Side,reason:string)=>void;energy:(s:Side,n:number)=>void}){
  const used=Object.fromEntries(sides.map(s=>[s,m.fighters[s].cardZone?.hand.find(card=>card.uid===actions[s].cardId)])) as Record<Side,PlayingCard|undefined>;
  const previous=structuredClone(m.fighters);
  const effect=(s:Side)=>used[s]?cardDefinition(used[s]!.definition).effect:'plain';
  for(const s of sides)if(used[s])emit(m,s,`打出${cardDefinition(used[s]!.definition).name}。`);
  for(const s of sides)if(effect(s)==='guard')h.shield(s,'打出磐石卫');
  let hit:Side|null=null;
  return {
    damage:(s:Side,n:number)=>{if(effect(s)==='guard')return 0;const linked=effect(s)==='combo'&&previous[s].lastAction===(actions[s].kind==='scissors'?'paper':'rock');return n+Number(linked);},
    piercing:(s:Side)=>effect(s)==='pierce',
    hit:(s:Side)=>{hit=s;},
    finish:()=>{
      // Dispose both commitments before any draw, capture or refund.
      for(const s of sides){const f=m.fighters[s],z=f.cardZone,card=used[s];if(!z||!card)continue;z.hand=z.hand.filter(v=>v.uid!==card.uid);z.discard.push(card);
        const refund=(c.drawRefund&&outcome==='draw')||(c.comboRefund&&outcome===s&&previous[s].winStreak>=1&&previous[s].lastAction!==actions[s].kind&&!!previous[s].lastAction&&Object.hasOwn(f.cards,previous[s].lastAction));
        if(refund){z.discard.splice(z.discard.indexOf(card),1);z.hand.push(card);}
      }
      for(const s of sides){const f=m.fighters[s],z=f.cardZone,card=used[s],enemy=s==='player'?'computer':'player';if(!z)continue;
        if(c.capture&&outcome===s&&used[enemy]&&used[s])z.hand.push(make(z,used[enemy]!.definition));
        reconcileCards(f);
        if(!card)continue;const def=cardDefinition(card.definition),won=outcome===s;
        if(def.effect==='echo'&&outcome==='draw'&&z.discard.some(v=>v.uid===card.uid)){z.discard=z.discard.filter(v=>v.uid!==card.uid);z.hand.push(card);emit(m,s,'的回响布回到手中。');}
        if(c.life&&f.life>0&&f.life<3&&won&&(def.effect==='grow'||def.effect==='leech'&&hit===s)){f.life++;emit(m,s,`的${def.name}恢复 1 生命。`);}
        if(def.effect==='charge'&&c.energy){h.energy(s,1);emit(m,s,'的余烬岩回 1 气。');}
        if(def.effect==='salvage'&&won&&forgeEnabled(m)){z.ink=Math.min(6,z.ink+1);emit(m,s,'的铸币岩获得 1 锻材。');}
        if(m.experiment&&m.design.rules.includes('experiment.push')&&(def.effect==='anchor'||def.effect==='retreat'&&outcome===enemy)){m.experiment.fighters[s].position=Math.max(0,m.experiment.fighters[s].position-(def.effect==='anchor'?1:2));emit(m,s,`的${def.name}解除墙角压力。`);}
        if(c.abilities[s]==='ability.sheathed'){if(def.effect==='plain')z.focus=Math.min(2,z.focus+1);else{if(c.energy)h.energy(s,z.focus);z.focus=0;}}
        projectCounts(f);
      }
      // Rewards draw only after both inventories are settled.
      for(const s of sides){const z=m.fighters[s].cardZone;if(!z)continue;if(effect(s)==='draw'||effect(s)==='reap'&&outcome===s&&previous[s==='player'?'computer':'player'].life===1)drawCards(m,s,1);if(forgeEnabled(m))z.ink=Math.min(6,z.ink+1);projectCounts(m.fighters[s]);}
    }
  };
}
export function recipes(m:MatchState,s:Side='player'){const z=m.fighters[s].cardZone;if(!z)return [];const pool=CARD_LIBRARY.filter(c=>c.price>1&&m.fighters[s].cards[c.kind as keyof FighterState['cards']]!==undefined);const start=(m.seed+m.hand*3) % pool.length;return [0,1,2].map(i=>pool[(start+i*5)%pool.length]!);}
export function craftCard(m:MatchState,definition:string|null,removeId?:string,side:Side='player'):MatchState{
  const original=m.fighters[side].cardZone;if(!original||!forgeEnabled(m)||m.phase!=='presenting'||m.result||m.history.at(-1)?.voided||original.crafted===m.hand)throw Error('工坊只在未结束的有效手结算后开放一次。');
  const next=structuredClone(m),f=next.fighters[side],z=f.cardZone!;
  if(removeId){if(z.ink<1||z.hand.length+z.draw.length+z.discard.length<=6)throw Error('精简需要 1 锻材，且至少保留 6 张牌。');const card=z.hand.find(v=>v.uid===removeId);if(!card)throw Error('只能精简手中的牌。');z.hand=z.hand.filter(v=>v.uid!==removeId);z.ink--;emit(next,side,`移除了${cardDefinition(card.definition).name}。`);}
  else {const def=recipes(m,side).find(v=>v.id===definition);if(!def||z.ink<def.price)throw Error('请选当前配方并准备足够锻材。');if(z.hand.length+z.draw.length+z.discard.length>=24)throw Error('牌组最多 24 张。');if(!cycles(m)&&z.hand.length>=15)throw Error('有限手牌最多 15 张。');z.ink-=def.price;(cycles(m)?z.discard:z.hand).push(make(z,def.id));emit(next,side,`锻造${def.name}${cycles(m)?'，进入弃牌堆':'，加入手牌'}。`);}
  z.crafted=m.hand;projectCounts(f);return next;
}
export function mulliganCard(m:MatchState,id:string):MatchState{
  const old=m.fighters.player.cardZone;if(!old||!cycles(m)||!m.design.rules.includes('experiment.shuffle')||m.phase!=='awaitingPlayer'||old.exchanged===m.hand||!old.draw.length)throw Error('每手可调度一次，需要循环牌库中还有未抽的牌。');
  const next=structuredClone(m),f=next.fighters.player,z=f.cardZone!,card=z.hand.find(v=>v.uid===id);if(!card)throw Error('请选择手中的牌。');z.hand=z.hand.filter(v=>v.uid!==id);z.discard.push(card);z.exchanged=m.hand;drawCards(next,'player',1);emit(next,'player','调度一张手牌，弃一抽一。');return next;
}

/** The opponent forges from its own resources and recipe row, between effective hands. */
export function prepareComputerForge(m:MatchState):MatchState {
 const z=m.fighters.computer.cardZone;
 if(!z||!forgeEnabled(m)||m.phase!=='presenting'||m.result||m.history.at(-1)?.voided||z.crafted===m.hand)return m;
 const size=z.hand.length+z.draw.length+z.discard.length;
 const recipe=recipes(m,'computer').find(card=>card.price<=z.ink);
 if(recipe&&size<24&&(cycles(m)||z.hand.length<15))return craftCard(m,recipe.id,undefined,'computer');
 return m;
}
