import { rawOutcome, experimentNotes, RULES, ABILITIES, isPassiveAbility } from '../core';
import type { CompiledDesign, Gesture } from '../core/types';
import { actionNames, abilityNames, goalText, ruleNames } from './constants';


export function RulesView({ compiled: c, view, publicTrump = null }: { compiled: CompiledDesign; view: 'graph' | 'list'; publicTrump?: Gesture | null }) {
  const edges = c.gestures.flatMap(a => c.gestures.filter(b => rawOutcome(a,b,c.reverse,publicTrump)==='player').map(b => [a, b] as const));
  const positions = c.gestures.map((_, i) => ({ x: 200 + Math.cos(-Math.PI / 2 + i * 2 * Math.PI / c.gestures.length) * 138, y: 175 + Math.sin(-Math.PI / 2 + i * 2 * Math.PI / c.gestures.length) * 130 }));
  return <div className="rules-view">
    <p className="rule-goal">{goalText(c.design)}</p>{publicTrump&&<p>本手公开王牌是{actionNames[publicTrump]}；下图已按本手关系更新。</p>}
    {view === 'graph' ? <figure className="rules-graph"><svg viewBox="0 0 400 345" role="img" aria-label="手势克制关系，箭头指向被克制的手势">
      <defs><marker id="rule-arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0 0 7 3.5 0 7" fill="currentColor" /></marker></defs>
      {edges.map(([a,b]) => { const p = positions[c.gestures.indexOf(a)], q = positions[c.gestures.indexOf(b)]; const dx=q.x-p.x,dy=q.y-p.y,len=Math.hypot(dx,dy); return <line key={a+b} x1={p.x+dx/len*35} y1={p.y+dy/len*35} x2={q.x-dx/len*40} y2={q.y-dy/len*40} stroke="currentColor" strokeWidth="1.2" opacity=".45" markerEnd="url(#rule-arrow)"/>; })}
      {c.gestures.map((g,i)=><g key={g}><circle cx={positions[i].x} cy={positions[i].y} r="31" fill="var(--paper, #f6f5ed)" stroke="currentColor"/><text x={positions[i].x} y={positions[i].y+5} textAnchor="middle" fill="currentColor" fontSize="14">{actionNames[g]}</text></g>)}
    </svg><figcaption>箭头指向被克制的手势。相同手势打平。</figcaption></figure> : <ul className="rule-relations">{c.gestures.map(a => <li key={a}><strong>{actionNames[a]}</strong><span>胜过 {edges.filter(([from]) => from===a).map(([,to])=>actionNames[to]).join('、')||'无'}</span></li>)}</ul>}
    <div className="rule-facts">{experimentNotes(c.design).map(note=><p key={note}>{note}</p>)}
      {c.challenge && <p>这是你的专属挑战。电脑没有对称的挑战目标，它会尝试阻止你达成；胜负以你的进度结算。</p>}
      {c.life && <p>双方从 3 点生命开始。输一手受到 1 点伤害，{c.healthOnly?'一方生命归零就结束，双方同时归零为平局。':c.goal==='survive'?'你活到上限或击倒对手就成功；你归零就失败，同时归零也失败。':'先归零则输，双方同时归零为平；到手数上限时比较剩余生命。'}</p>}
      {c.cooldown && <p>上一有效手用过的手势，本手不能再用。再搏作废的尝试不造成冷却。</p>}
      {c.finiteCards && <p>每种手势各 {c.cardsPerGesture} 张。每个有效手扣除所用手牌，平局也会扣；没有合法行动时提前结算。</p>}
      {c.exchange && <p>每场可在电脑锁定前，用两张相同的剩余手牌交换一张不同手牌一次。双方各有一次机会。</p>}
      {c.energy && <p>双方初始 {c.initialEnergy} 气，上限 {c.energyCap} 气。两个原手势最终打平时，双方各得 1 气。</p>}
      {c.design.rules.includes('energy.gesture_boost') && <p>手势可预付 1 气强化{c.maxBoost===2?'，也可选 2 气档位':''}：最终获胜才增加相同数量的伤害，失败和平局仍支付费用，克制关系不变。</p>}
      {c.actions.includes('charge') && <p>蓄气：{c.chargeTrade?'弃掉库存最多的 1 张手牌，获得 2 气；没有牌时不能蓄气':'获得 1 气'}；输给手势与波，和蓄气、防御打平。</p>}
      {c.actions.includes('wave') && <p>波：消耗 {c.waveCost} 气；胜过手势与蓄气，和波、防御、破防波打平。</p>}
      {c.actions.includes('guard') && <p>防御：{c.guardCost===0?'免费':'消耗 1 气'}；挡住普通波，和蓄气、防御打平，输给所有原手势{c.actions.includes('piercing_wave')?'和破防波':''}。</p>}
      {c.drawPoint && <p>平局双方各得 1 分。这会增加总分，但不会改变分差。</p>}
      {c.combo && <p>连续第二次获胜开始，每次额外得 1 分；失败或平局会打断连胜，作废重打不影响连胜。</p>}
      {c.lastDouble && <p>原定第 {c.cap} 手的所有积分翻倍，包括平局分和连胜奖励；气和生命伤害保持原样，加时不会再次翻倍。</p>}
      {c.actions.includes('piercing_wave') && <p>破防波：消耗 3 气；胜过手势、蓄气和防御，与普通波、破防波打平。不能加手势强化，基础伤害仍为 1。</p>}
      {RULES.filter(rule=>c.design.rules.includes(rule.id)&&(rule.id.startsWith('experiment.')||['ending.bounded_overtime','goal.collect_three','goal.draw_three','goal.streak_two','goal.first_five_points','goal.fewest_points','goal.efficient_wins','gesture.remove_rock','gesture.public_trump','life.draw_damage','life.win_heal','life.last_hit_double','life.desperation','cards.draw_refund','cards.dealer_refill','energy.leak_thirds','energy.loss_charge','cards.charge_trade','energy.wager','combo.three_styles','cards.capture','cards.combo_refund','shield.guard_store','energy.overflow_shield','energy.restraint','action.special_cooldown','shield.piercing_boost'].includes(rule.id))).map(rule=><p key={rule.id}><strong>{rule.title}：</strong>{rule.description}</p>)}
      {c.life&&(c.desperation||c.lastHitDouble)&&<p>伤害顺序：先按本手开始时生命确定基础伤害，再加手势强化{c.lastHitDouble?`，最后应用第 ${c.cap} 手的伤害乘数`:''}。胜利恢复在伤害之后结算。</p>}
      {c.shield&&<p>护盾最多 1 层：下一次受到实际伤害时减免 1 点并消耗，平局伤害也可抵挡。按每个来源注明的时机获得；主伤害后才得到的盾不能倒过来抵挡之前的伤害，护身能力立即生效。</p>}
      {c.abilities.player && <><p>{isPassiveAbility(c.abilities.player)?'这是你的常驻角色特性，满足条件时自动生效，无需声明，不消耗每场次数。角色只有一个槽位，换角色会替换当前特性。':'你的能力每场可用一次。先点击能力，再提交合法手势；即使条件未发生也消耗次数。波、防御和蓄气不能携带能力。'}</p><dl><div><dt>你的{isPassiveAbility(c.abilities.player)?'常驻特性':'能力'} · {abilityNames[c.abilities.player]}</dt><dd>{ABILITIES.find(a=>a.id===c.abilities.player)?.description}</dd></div></dl></>}

    </div><p className="muted small">双方共用当前规则，能力只属于你。电脑先锁定动作，随后才接收你的选择。</p>
    {c.design.rules.length > 0 && <p className="muted small">当前改动：{c.design.rules.map(id=>ruleNames[id]).join(' · ')}</p>}
  </div>;
}
