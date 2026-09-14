import { isScoreGoal, type CompiledDesign, type MatchState } from '../core';
import { GestureIcon } from '../presentation/visuals';
import { actionNames, goalText } from './constants';

/** Every number here comes from disclosed state; the reveal uses the pre-attempt snapshot. */
export function MatchProgress({ match, compiled: c, settled, voided }: { match: MatchState; compiled: CompiledDesign; settled: boolean; voided?: boolean }) {
  const { player, computer } = match.fighters;
  if (c.healthOnly) {
    const hand = match.hand + (settled && !voided ? 0 : 1);
    return <div className="match-summary match-summary-health">
      <p>{goalText(match.design)}</p>
      <span className="hand-count">{match.result ? `本场已结束 · ${match.hand} 次交锋` : `第 ${hand} 次交锋`}</span>
    </div>;
  }

  const shownHand = Math.min(match.hand + (settled && !voided ? 0 : 1), match.effectiveCap);
  const challenge = c.challenge;
  return <div className={`match-summary ${challenge ? 'match-summary-challenge' : ''}`}>
    <p>{goalText(match.design)}</p>
    {c.goal === 'collect_three' ? <div className="collection-race" aria-label="三招收集进度">{(['player', 'computer'] as const).map(side => <div key={side}><span>{side === 'player' ? '你' : '对手'}</span>{(['rock','scissors','paper'] as const).map(g => <span key={g} className={match.fighters[side].collected.includes(g) ? 'collected' : ''} aria-label={`${actionNames[g]}${match.fighters[side].collected.includes(g) ? '已收集' : '未收集'}`}><GestureIcon gesture={g} size={28}/></span>)}</div>)}</div>
      : c.goal === 'draw_three' ? <strong className="challenge-progress">平局 <b>{player.draws}</b> / 3</strong>
      : c.goal === 'streak_two' ? <strong className="challenge-progress">连续获胜 <b>{player.winStreak}</b> / 2</strong>
      : c.goal === 'efficient_wins' ? <div className="budget-progress"><strong>获胜 <b>{player.wins}</b> / 2</strong><strong className={player.energySpent > 3 ? 'over-budget' : ''}>累计花气 <b>{player.energySpent}</b> / 3</strong></div>
      : <strong className="match-score">{c.life ? player.life : isScoreGoal(c.goal) ? player.score : player.wins}<span>:</span>{c.life ? computer.life : isScoreGoal(c.goal) ? computer.score : computer.wins}</strong>}
    <span className="hand-count">{match.result ? `已完成 ${match.hand} 手` : match.overtimeActive ? `加时 ${Math.max(1, shownHand - c.cap)} / 3 手` : `第 ${shownHand} / ${c.cap} 手`}</span>
    {c.goal === 'efficient_wins' && <small className="challenge-note">打到期末才结算；累计花气超过 3，立即失败。</small>}
    {c.goal === 'survive' && <small className="challenge-note">你活到期末或击倒对手即成功；你归零即失败。</small>}
    {c.goal === 'streak_two' && <small className="challenge-note">平局或失败清零；对手的连胜不会结束挑战。</small>}
    {(c.drawPoint || c.combo || c.lastDouble || c.lastHitDouble || c.boundedOvertime) && <div className="score-rules">{c.drawPoint && <span>平局 +1 分</span>}{c.combo && <span>连胜 +1 分</span>}{c.lastDouble && <span className={match.hand === c.cap-1 ? 'final-round' : ''}>第 {c.cap} 手积分 ×2</span>}{c.lastHitDouble && <span className={match.hand === c.cap-1 ? 'final-round' : ''}>第 {c.cap} 手伤害 ×2</span>}{c.boundedOvertime && <span>{match.overtimeActive ? '正在加时' : '到期同分最多加 3 手'}</span>}</div>}
  </div>;
}

export function PublicRuleStatus({ match, compiled: c }: { match: MatchState; compiled: CompiledDesign }) {
  const refilled = match.events.some(event => event.type === 'dealer_refill' && event.attempt === match.attempt);
  if (!match.publicComputerIntent && !match.publicTrump && !c.dealerRefill && !c.leakThirds) return null;
  return <div className="public-rule-status" aria-label="本手公开规则">
    {match.publicComputerIntent&&match.phase==='awaitingPlayer'&&<span className="foreseen-intent"><strong>先见 · 对手已锁定{actionNames[match.publicComputerIntent]}</strong><small>仅动作种类，强化与押注未知</small></span>}
    {match.publicTrump && <span className="trump-badge"><GestureIcon gesture={match.publicTrump} size={26}/><strong>本手王牌 · {actionNames[match.publicTrump]}</strong><small>胜其他手势</small></span>}
    {c.dealerRefill && <span className={refilled ? 'refill-announcement' : ''}>{refilled ? '庄家已补满手牌' : '对手作为庄家：缺少合法手势时补满'}</span>}
    {c.leakThirds && <span>每第 3 手末漏 1 气{(match.hand + ((match.phase === 'presenting' || match.phase === 'finished')&&!match.history.at(-1)?.voided ? 0 : 1)) % 3 === 0 ? ' · 本手触发' : ''}</span>}
  </div>;
}
