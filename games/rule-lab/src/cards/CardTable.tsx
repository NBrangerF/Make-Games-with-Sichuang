import { useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { handFan } from './hand-fan';
import type { Action, ActionKind, CompiledDesign, MatchState } from '../core/types';
import { GestureIcon, ResourceIcon } from '../presentation/visuals';
import { audio } from '../presentation/audio';
import { isGesture, rawOutcome } from '../core/match';
import { actionNames } from '../ui/constants';
import { CARD_LIBRARY, cardDefinition, type CardDefinition } from './catalog';
import { cycles, forgeEnabled, recipes } from './engine';
import { Dialog } from '../ui/Dialog';
import { PositionBoard } from '../experiments/PositionBoard';
import type { ExperimentInput } from '../experiments/types';
import './cards.css';
export function CardFace({card,selected=false,disabled=false,onClick,caption,preview=false,style,onKeyDown}:{card:CardDefinition;selected?:boolean;disabled?:boolean;onClick?:()=>void;caption?:string;preview?:boolean;style?:CSSProperties;onKeyDown?:React.KeyboardEventHandler<HTMLButtonElement>}){
const className = `playing-card card-${card.kind} ${selected?'card-selected':''} ${card.effect==='plain'?'card-basic':'card-special'}`;
const content = <>  <span className="card-corner">{isGesture(card.kind)?actionNames[card.kind]: '气'}</span><span className="card-school">{card.school}</span>
  <span className="card-art">{isGesture(card.kind)?<GestureIcon gesture={card.kind} size={80}/>:<ResourceIcon kind={card.kind==='charge'?'charge':card.kind==='guard'?'guard':'attack'} size={72}/>}<i aria-hidden="true"/></span>
  <strong className="card-title">{card.name}</strong><span className="card-description">{card.text}</span><span className="card-footer">{caption??(card.effect==='plain'?'基础手势':'功能手势 · 一张即一招')}</span><span className="card-spine" aria-hidden="true">{card.name}</span></>;
return preview ? <div className={`${className} card-large`} aria-label={`${card.name}大图`}>{content}</div> :
<button type="button" className={className} style={style} aria-label={`选择${card.name}${caption?`，${caption}`:''}`} aria-pressed={selected} disabled={disabled} onClick={onClick} onKeyDown={onKeyDown}>{content}</button>;
}
export function CardReport({compact,children,title='本手效果'}:{compact:boolean;children:ReactNode;title?:string}) {
  const [open,setOpen]=useState(false);
  return compact ? <><button className="text-button card-report-trigger" onClick={()=>setOpen(true)}>{title} ↗</button>{open&&<Dialog title={title} onClose={()=>setOpen(false)}>{children}</Dialog>}</> : children;
}
export function CardTable({match,compiled:c,legal,awaiting,revealing,onPlay,onCraft,onMulligan,input,onInput,battle,controls,footer}:{battle?:ReactNode;controls?:ReactNode;footer?:ReactNode;match:MatchState;compiled:CompiledDesign;legal:Action[];awaiting:boolean;revealing:boolean;onPlay:(kind:ActionKind,id?:string)=>void;onCraft:(definition:string|null,removeId?:string)=>void;onMulligan:(id:string)=>void;input:ExperimentInput;onInput?:(value:ExperimentInput)=>void}){
const zone=match.fighters.player.cardZone;
const [selection,setSelection]=useState<string|null>(null),[pile,setPile]=useState<'draw'|'discard'|'library'|null>(null);
const [inspect,setInspect]=useState(false),[forgeOpen,setForgeOpen]=useState(false);
const fanRef=useRef<HTMLDivElement>(null);
const [width,setWidth]=useState(600),[fanSpace,setFanSpace]=useState(Infinity);
useLayoutEffect(()=>{setInspect(false);setSelection(null);},[match.phase,match.hand]);
useLayoutEffect(()=>{
  const element=fanRef.current;
  if(!element)return;
  const table=element.parentElement!;
  const field=table.querySelector<HTMLElement>('.card-battlefield')!;
  const toolbar=table.querySelector<HTMLElement>('.deck-toolbar')!;
  const command=table.querySelector<HTMLElement>('.card-command')!;
  const measure=()=>{
    if(!element.clientWidth)return;
    setWidth(element.clientWidth);
    const heights=Array.from(field.children).map(child=>child.getBoundingClientRect().height);
    const battleHeight=window.innerWidth>600?Math.max(100,...heights):heights.reduce((sum,height)=>sum+height,0);
    if(table.clientHeight)setFanSpace(table.clientHeight-battleHeight-toolbar.offsetHeight-command.offsetHeight-4);
  };
  measure();
  const observer=typeof ResizeObserver==='undefined'?null:new ResizeObserver(measure);
  [element,table,toolbar,command,...field.children].forEach(el=>observer?.observe(el));window.addEventListener('resize',measure);
  return ()=>{observer?.disconnect();window.removeEventListener('resize',measure);};
},[match.phase,revealing]);
if(!zone)return null;
const specials=c.actions.filter(kind=>!isGesture(kind)).map(kind=>({uid:`action-${kind}`,definition:kind}));
const hand=[...zone.hand,...specials];
const describe=(id:string):CardDefinition=>{const found=CARD_LIBRARY.find(v=>v.id===id);if(found)return found;const kind=id as ActionKind;return {id,kind,name:actionNames[kind],text:kind==='charge'?(c.chargeTrade?'弃库存最多的一张手势牌，获得至多 2 气。':'获得至多 1 气。'):kind==='guard'?`支付 ${c.guardCost} 气，挡住普通波。`:`支付 ${kind==='wave'?c.waveCost:3} 气，${kind==='wave'?'击败手势与蓄气':'击败手势、蓄气与防御'}。`,effect:'plain',price:0,school:'常驻行动'};};
const selected=hand.find(v=>v.uid===selection),def=selected?describe(selected.definition):null;
const canPlay=(uid:string)=>legal.some(a=>a.cardId===uid||!a.cardId&&uid===`action-${a.kind}`);
const count=zone.hand.length+zone.draw.length+zone.discard.length;
const forge=forgeEnabled(match),workshop=forge&&!revealing&&match.phase==='presenting'&&!match.result&&!match.history.at(-1)?.voided;
const crafted=zone.crafted===match.hand;
const fan=handFan(hand.length,width,fanSpace);
const hasPosition=['experiment.sites','experiment.range','experiment.push'].some(id=>match.design.rules.includes(id as never));
const select=(uid:string)=>{setSelection(uid);setInspect(true);void audio.init().then(()=>audio.play('select'));};
const browse=(step:number)=>{const index=hand.findIndex(card=>card.uid===selection);select(hand[(index+step+hand.length)%hand.length]!.uid);};
const play=()=>{if(!selected||!def||!canPlay(selected.uid))return;onPlay(def.kind,selected.uid.startsWith('action-')?undefined:selected.uid);setSelection(null);setInspect(false);};
return <section className="card-table" aria-label="手牌战桌">
  <div className={`card-battlefield ${hasPosition?'has-position':''}`}>
    <div className="card-duel-area">{battle||<div className="card-table-top"><div className="enemy-card-backs" aria-label={`对手手牌 ${match.fighters.computer.cardZone?.hand.length??0} 张，内容保密`}>{Array.from({length:Math.min(7,match.fighters.computer.cardZone?.hand.length??0)},(_,i)=><i key={i}/>)}</div><strong>你的回合</strong><span>{hasPosition?'选好位置，再打出一张牌':'打出一张牌，同时揭晓'}</span></div>}{controls&&<CardReport compact title="本手能力">{controls}</CardReport>}</div>
    <PositionBoard match={match} compiled={c} input={input} onChange={onInput} revealed={!revealing&&!awaiting} compact/>
  </div>
  <div className="deck-toolbar"><div><b>{cycles(match)?'循环牌库':'有限手牌'} <span className="hand-total">{zone.hand.length} 张</span></b><small>{cycles(match)?'保留手牌 · 下手补到 5 张':'用一张，少一张 · 不自动补牌'}</small></div><div className="pile-buttons"><button onClick={()=>setPile('draw')}>牌库 <b>{zone.draw.length}</b></button><button onClick={()=>setPile('discard')}>弃牌 <b>{zone.discard.length}</b></button><button onClick={()=>setPile('library')}>图鉴</button>{forge&&<button disabled={!workshop} onClick={()=>setForgeOpen(true)}>工坊 <b>{zone.ink}</b></button>}</div></div>
  <div ref={fanRef} className="player-hand" role="group" aria-label="选择一张手牌" style={{height:fan.height}}>
    {hand.map((card,index)=><CardFace key={card.uid} card={describe(card.definition)} selected={selection===card.uid} disabled={revealing}
      style={{'--fan-x':`${fan.cards[index]!.x}px`,'--fan-y':`${fan.cards[index]!.y}px`,'--fan-angle':`${fan.cards[index]!.angle}deg`,'--fan-order':index+1,width:fan.cardWidth,height:fan.cardHeight} as CSSProperties}
      caption={card.uid.startsWith('action-')?'常驻 · 代替本手出牌':awaiting&&!canPlay(card.uid)?'当前不可出 · 检查冷却或气':undefined}
      onKeyDown={event=>{if(event.key==='ArrowRight'||event.key==='ArrowLeft'){event.preventDefault();const next=(index+(event.key==='ArrowRight'?1:-1)+hand.length)%hand.length;select(hand[next]!.uid);fanRef.current?.querySelectorAll<HTMLButtonElement>('.playing-card')[next]?.focus();}if(event.key==='Escape')setInspect(false);}}
      onClick={()=>select(card.uid)}/>)}
    {!hand.length&&<p className="empty-hand">手牌已用完</p>}
  </div>
  <div className="card-command" aria-live="polite">
    <span className="hand-instruction">{revealing?'同时揭晓中…':selected?`已选 · ${def!.name}`:'点一张牌，放大查看'}</span>
    {awaiting?<div className="card-command-buttons">{cycles(match)&&match.design.rules.includes('experiment.shuffle')&&<button className="button" disabled={!selected||selected.uid.startsWith('action-')||zone.exchanged===match.hand||!zone.draw.length} onClick={()=>{onMulligan(selected!.uid);setSelection(null);setInspect(false);}}>弃一抽一{zone.exchanged===match.hand?' · 已用':''}</button>}<button className="button button-primary card-submit" disabled={!selected||!canPlay(selected.uid)} onClick={play}>{selected?`打出${def!.name}`:'先选一张牌'}</button></div>:footer}
  </div>
  {selected&&def&&inspect&&!revealing&&<aside className="hand-inspector" aria-label="卡牌详情" onKeyDown={event=>{if(event.key==='Escape')setInspect(false);}}>
    <button className="inspect-close icon-button" aria-label="收起卡牌详情" onClick={()=>setInspect(false)}>×</button>
    <div className="inspect-navigation"><button aria-label="查看上一张手牌" onClick={()=>browse(-1)}>‹</button><span>{hand.findIndex(card=>card.uid===selection)+1} / {hand.length}</span><button aria-label="查看下一张手牌" onClick={()=>browse(1)}>›</button></div>
    <CardFace card={def} preview caption={selected.uid.startsWith('action-')?'常驻 · 代替本手出牌':undefined}/>
    <div className="inspect-notes">{isGesture(def.kind)&&<small>克制：{c.gestures.filter(g=>rawOutcome(def.kind,g,c.reverse)==='player').map(g=>actionNames[g]).join('、')}</small>}{def.effect!=='plain'&&!c.life&&['leech','guard','pierce','combo','grow','reap'].includes(def.effect)&&<small>当前一手决胜：生命相关效果休眠，克制照常。</small>}{awaiting&&!canPlay(selected.uid)&&<small>当前不可出 · 检查冷却或气</small>}{workshop&&!selected.uid.startsWith('action-')&&<button className="text-button" disabled={crafted||zone.ink<1||count<=6} onClick={()=>{onCraft(null,selected.uid);setSelection(null);setInspect(false);}}>精简这张 · 1 锻材</button>}</div>
  </aside>}
  {forgeOpen&&workshop&&<Dialog title="卡牌工坊" subtitle={`锻材 ${zone.ink} / 6 · 牌组 ${count} / 24 · ${crafted?'本手已完成':'造一张或精简一张，也可直接下一手'}`} onClose={()=>setForgeOpen(false)} wide><section className="card-forge" aria-label="卡牌工坊"><div className="forge-recipes">{recipes(match).map(card=><CardFace key={card.id} card={card} caption={`${card.price} 锻材 · ${cycles(match)?'进入弃牌':'加入手牌'}`} disabled={crafted||zone.ink<card.price||count>=24||!cycles(match)&&zone.hand.length>=15} onClick={()=>{onCraft(card.id);setForgeOpen(false);}}/>)}</div><p className="small muted">精简：关闭工坊，点选手牌，再点「精简这张」。至少保留 6 张，制造与精简共用一次机会。</p></section></Dialog>}
  {pile&&<Dialog title={pile==='library'?'手势牌图鉴':pile==='draw'?'你的牌库':'你的弃牌堆'} subtitle={pile==='draw'?'展示组成，不显示抽牌顺序。':'每张功能牌本身就是一张手势牌。'} onClose={()=>setPile(null)} wide><div className="card-codex">{(pile==='library'?CARD_LIBRARY.filter(card=>c.gestures.includes(card.kind as never)):zone[pile].map(card=>cardDefinition(card.definition)).sort((a,b)=>a.id.localeCompare(b.id))).map((card,i)=><CardFace key={`${card.id}-${i}`} card={card} disabled/>)}</div>{pile!=='library'&&!zone[pile].length&&<p>这里暂时没有牌。</p>}</Dialog>}
</section>;
}
