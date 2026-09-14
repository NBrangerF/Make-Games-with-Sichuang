import type { ActionKind, Gesture } from '../core/types';
export type CardEffect = 'plain'|'leech'|'guard'|'charge'|'draw'|'pierce'|'combo'|'salvage'|'retreat'|'echo'|'grow'|'reap'|'anchor';
export interface CardDefinition { id:string; kind:ActionKind; name:string; text:string; effect:CardEffect; price:number; school:string }
export const CARD_LIBRARY:CardDefinition[] = [
  {id:'rock',kind:'rock',name:'石头',text:'克制剪刀。没有附加效果。',effect:'plain',price:1,school:'基础'},
  {id:'scissors',kind:'scissors',name:'剪刀',text:'克制布。没有附加效果。',effect:'plain',price:1,school:'基础'},
  {id:'paper',kind:'paper',name:'布',text:'克制石头。没有附加效果。',effect:'plain',price:1,school:'基础'},
  {id:'bloodstone',kind:'rock',name:'饮血岩',text:'获胜且主攻击实际伤血后，恢复 1 生命。',effect:'leech',price:3,school:'汲取'},
  {id:'bastion',kind:'rock',name:'磐石卫',text:'打出时获得 1 盾；获胜的主伤害为 0。',effect:'guard',price:2,school:'守势'},
  {id:'ember',kind:'rock',name:'余烬岩',text:'交锋结束后回 1 气；没有气槽时休眠。',effect:'charge',price:2,school:'蓄势'},
  {id:'ore',kind:'rock',name:'铸币岩',text:'获胜后获得 1 锻材；需要卡牌工坊。',effect:'salvage',price:2,school:'锻造'},
  {id:'anchor',kind:'rock',name:'镇岳石',text:'结算后解除自己 1 格墙角压力。',effect:'anchor',price:2,school:'阵地'},
  {id:'needle',kind:'scissors',name:'破甲剪',text:'获胜的主攻击击碎护盾，伤害不被减免。',effect:'pierce',price:3,school:'破甲'},
  {id:'relay',kind:'scissors',name:'接力剪',text:'上一有效手出布时，获胜主伤害 +1。',effect:'combo',price:2,school:'连携'},
  {id:'swallow',kind:'scissors',name:'燕返剪',text:'落败后解除 2 格墙角压力；需要击退。',effect:'retreat',price:2,school:'游击'},
  {id:'reaper',kind:'scissors',name:'收割剪',text:'对手开手只有 1 生命时，获胜后抽 1 张牌。',effect:'reap',price:2,school:'收割'},
  {id:'letter',kind:'paper',name:'信使布',text:'结算后抽 1 张牌。需要循环牌库；手牌上限 7。',effect:'draw',price:3,school:'过牌'},
  {id:'echo',kind:'paper',name:'回响布',text:'最终平局时回到手中，保留卡牌效果。',effect:'echo',price:2,school:'循环'},
  {id:'bloom',kind:'paper',name:'生息布',text:'获胜且自己仍存活时恢复 1 生命。',effect:'grow',price:3,school:'复苏'},
  {id:'thread',kind:'paper',name:'引线布',text:'上一有效手出石头时，获胜主伤害 +1。',effect:'combo',price:2,school:'连携'},
  {id:'lizard',kind:'lizard',name:'蜥蜴',text:'沿用五手势克制关系。',effect:'plain',price:1,school:'基础'},
  {id:'spock',kind:'spock',name:'瓦肯',text:'沿用五手势克制关系。',effect:'plain',price:1,school:'基础'},
];
export const cardDefinition = (id:string):CardDefinition => CARD_LIBRARY.find(card=>card.id===id) ?? CARD_LIBRARY[0]!;
export interface PlayingCard { uid:string; definition:string }
export interface CardZone { hand:PlayingCard[]; draw:PlayingCard[]; discard:PlayingCard[]; rng:number; serial:number; prepared:number; recycled:number; ink:number; crafted:number; exchanged:number; focus:number }
export const basicCard = (kind:Gesture) => cardDefinition(kind);
