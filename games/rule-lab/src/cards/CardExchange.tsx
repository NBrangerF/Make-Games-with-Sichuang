import {useState} from 'react';
import type {CompiledDesign,Gesture,MatchState} from '../core/types';
import {cardDefinition} from './catalog';
import {CardFace} from './CardTable';
import {GestureIcon} from '../presentation/visuals';
import {actionNames} from '../ui/constants';
export function CardExchange({match,compiled:c,onExchange}:{match:MatchState;compiled:CompiledDesign;onExchange:(from:Gesture,to:Gesture)=>void}){
 const f=match.fighters.player;
 const [from,setFrom]=useState<Gesture>(c.gestures.find(g=>f.cards[g]>=2)??'rock');
 const [to,setTo]=useState<Gesture>(c.gestures.find(g=>g!==from)??'paper');
 const available=f.exchangeRemaining>0;
 const payment=f.cardZone?.hand.filter(card=>cardDefinition(card.definition).kind===from).slice(0,2)??[];
 return <div className="physical-exchange"><div><h3>交出两张同手势牌</h3><div className="exchange-gestures" role="group" aria-label="选择支付手势">{c.gestures.map(g=><button key={g} aria-label={`交出两张${actionNames[g]}`} aria-pressed={from===g} disabled={!available||f.cards[g]<2} onClick={()=>setFrom(g)}><GestureIcon gesture={g} size={32}/>{actionNames[g]} × {f.cards[g]}</button>)}</div><div className="exchange-payment" aria-label="将交出的具体卡牌">{payment.map(card=><CardFace key={card.uid} card={cardDefinition(card.definition)} disabled/>)}</div><small>同种手势从左到右取两张；功能也随牌交出。</small></div><div><h3>换回一张基础牌</h3><div className="exchange-gestures" role="group" aria-label="选择换回手势">{c.gestures.map(g=><button key={g} aria-label={`换回${actionNames[g]}`} aria-pressed={to===g} disabled={!available||g===from} onClick={()=>setTo(g)}><GestureIcon gesture={g} size={32}/>{actionNames[g]}</button>)}</div><div className="exchange-payment"><CardFace card={cardDefinition(to)} disabled/></div><button className="button button-primary" disabled={!available||from===to||f.cards[from]<2} onClick={()=>onExchange(from,to)}>{available?'交换':'本场已交换'}</button></div></div>;
}
