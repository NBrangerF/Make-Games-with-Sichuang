import { useState } from 'react';
import { Dialog } from '../ui/Dialog';
import { Flag, Mountain, Sparkles, Shield, Layers } from 'lucide-react';
import type { CompiledDesign, MatchState } from '../core/types';
import { hasExperiment } from './engine';
import type { ExperimentInput } from './types';

const places = ['左侧', '中央', '右侧'];
const distances = ['贴身', '交锋', '远距'];
const moves = [[-1, '靠近'], [0, '停留'], [1, '后退']] as const;

export function PositionBoard({ match, compiled, input = {}, onChange, revealed = false, compact = false }: {
  match: MatchState; compiled: CompiledDesign; input?: ExperimentInput;
  onChange?: (input: ExperimentInput) => void; revealed?: boolean; compact?: boolean;
}) {
  const [help,setHelp]=useState(false);
  const x = match.experiment;
  if (!x) return null;
  const sites = hasExperiment(match, 'sites'), range = hasExperiment(match, 'range'), push = hasExperiment(match, 'push');
  if (!sites && !range && !push) return null;
  const editable = !!onChange && !x.sealedPlayer && !match.result;
  const chosen = x.sealedPlayer?.experiment ?? input;
  const last = revealed ? match.history.at(-1) : undefined;
  const selected = last?.player.experiment?.site ?? chosen.site ?? 1;
  const move = last?.player.experiment?.move ?? chosen.move ?? 0;
  const benefit = [compiled.energy ? '+1 气' : '回气休眠 · 无气槽', '+1 盾', compiled.finiteCards ? '补本手牌 ×1' : '补牌休眠 · 无手牌'];
  return <section className={`position-board tactical-board ${compact?'position-compact':''}`} aria-label="位置战场">
    <div className="tactical-title"><span><Mountain size={18}/> 战术地图</span><small>你的选择先保密 · 随这一手一起执行</small>{compact&&<button className="text-button" onClick={()=>setHelp(true)} aria-label="查看战场说明">规则 ?</button>}</div>
    {(range||push)&&<div className={`duelist-track distance-${x.distance}`} aria-label={`你与对手相距 ${x.distance} 格`}><span className="battle-wall">墙</span><div className="fighter-token token-player"><b>你</b><small>{push?`${x.fighters.player.position}/4 压力`:'出招方'}</small></div><div className="duelist-space"><i/><strong>{distances[x.distance]}</strong><span>{range?`距离 ${x.distance}`:'交锋区'}</span><i/></div><div className="fighter-token token-enemy"><b>对手</b><small>{push?`${x.fighters.computer.position}/4 压力`:'已封存'}</small></div><span className="battle-wall">墙</span></div>}

    {sites && <>
      <div className="position-heading"><strong>{editable ? '先选据点，再出手' : '据点战场'}</strong><small>{editable ? '只让你看到选择' : revealed ? '双方选择已公开' : '等待共同揭晓'}</small></div>
      <div className="experiment-sites" role="group" aria-label="选择据点">
        {x.sites.map((owner, index) => <button key={index} type="button" className={`site ${owner ?? 'unclaimed'}`}
          aria-label={`前往${places[index]}据点`} aria-pressed={selected === index} disabled={!editable}
          onClick={() => onChange?.({ ...input, site: index })}>
          <span className="site-map-icon">{index===0?<Sparkles size={26}/>:index===1?<Shield size={26}/>:<Layers size={26}/>}<Flag size={14} className="site-flag"/></span><strong>{places[index]}</strong><span>{owner === 'player' ? '你的旗' : owner === 'computer' ? '对方的旗' : '尚未占领'}</span>
          {hasExperiment(match, 'terrain') && <small>{benefit[index]}</small>}
          <b className="site-intent">{selected === index ? '你选这里' : '·'}{last && (last.computer.experiment?.site ?? 1) === index ? ' / 对手' : ''}</b>
        </button>)}
      </div>
      <p className="position-hint">同点：交锋胜者占领，平局保留。不同点：各占一处，即使这一拳输了。</p>
      {hasExperiment(match, 'terrain') && <p className="position-hint">收益在本手伤害后领取；下手仍需选点争取，不会自动生产。</p>}
    </>}
    {range && <div className="position-range">
      <div className="position-heading"><strong>双方距离 · {distances[x.distance]}</strong><small>{revealed ? '移动后' : '移动前'} {x.distance} / 2</small></div>
      <ol className="distance-track" aria-label="射程说明">{distances.map((name, index) => <li key={name} aria-current={x.distance === index ? 'step' : undefined}><b>{index} · {name}</b><span>{index === 0 ? '手势可命中' : index === 1 ? '手势 / 波可命中' : '波可命中'}</span></li>)}</ol>
      {editable && <div className="position-moves" role="group" aria-label="本手移动">{moves.map(([value, label]) => <button key={value} aria-pressed={move === value} onClick={() => onChange?.({ ...input, move: value })}>{label}<small>{value === 0 ? '距离不变' : `${value > 0 ? '+' : '−'}1 距离`}</small></button>)}</div>}
      <p className="position-hint">{editable ? `你选${moves.find(([value]) => value === move)?.[1]}；` : ''}双方位移相加后才确定距离。超出射程只取消主伤害，交锋胜负、占点照常。</p>
    </div>}
    {push && <div className="position-pressure" aria-label="墙角压力">
      {(['player', 'computer'] as const).map(side => <div key={side}><span>{side === 'player' ? '你' : '对手'}</span><div className="pressure-track" aria-hidden="true">{[1, 2, 3, 4].map(n => <i key={n} className={x.fighters[side].position >= n ? 'filled' : ''}/>)}</div><b>{x.fighters[side].position} / 4</b></div>)}
      <p className="position-hint">败者向墙角退 1 格；到 4 格后再被推才追加伤害。{range ? '主动靠近先解除自己的 1 格压力。' : ''}{!compiled.life ? '当前无生命：只记录压力，不会出界判负。' : ''}</p>
    </div>}
    {help&&<Dialog title="战场说明" onClose={()=>setHelp(false)}><PositionBoard match={match} compiled={compiled} input={input} revealed={revealed}/></Dialog>}
  </section>;
}

export function PositionOutcomes({ match }: { match: MatchState }) {
  const record = match.history.at(-1), after = record?.experimentAfter;
  if (!record || record.voided || !after || !(['sites', 'range', 'push'] as const).some(key => hasExperiment(match, key))) return null;
  const p = record.player.experiment?.site ?? 1, q = record.computer.experiment?.site ?? 1;
  const movement = (value = 0) => value < 0 ? '靠近 −1' : value > 0 ? '后退 +1' : '停留 0';
  const siteResult = p !== q ? '错开争夺，各自占领。' : record.outcome === 'draw' ? '同点平局，原归属不变。' : `${record.outcome === 'player' ? '你' : '对手'}赢得交锋，占领${places[p]}据点。`;
  return <section className="position-result" aria-label="位置结算">
    {hasExperiment(match, 'sites') && <p><strong>占点</strong><span>你 → {places[p]}；对手 → {places[q]}。{siteResult}</span></p>}
    {hasExperiment(match, 'range') && <p><strong>射程</strong><span>你{movement(record.player.experiment?.move)}，对手{movement(record.computer.experiment?.move)}；距离 {record.experimentBefore?.distance ?? 1} → {after.distance}（限制在 0—2）。移动后距离 {after.distance} · {distances[after.distance]}。{record.outcome === 'draw' ? '交锋平局，没有获胜攻击。' : (() => {
      const action = record[record.outcome];
      if (action.kind === 'charge' || action.kind === 'guard') return '获胜动作不造成射程攻击。';
      const wave = action.kind === 'wave' || action.kind === 'piercing_wave';
      const inRange = wave ? after.distance >= 1 : after.distance <= 1;
      return `${record.outcome === 'player' ? '你' : '对手'}的获胜攻击${inRange ? '在射程内，伤害仍按护盾等规则结算。' : '超出射程，本手主伤害为 0。'}`;
    })()}</span></p>}
    {hasExperiment(match, 'push') && <p><strong>压力</strong><span>你 {record.experimentBefore?.fighters.player.position ?? 0} → {after.fighters.player.position} / 4；对手 {record.experimentBefore?.fighters.computer.position ?? 0} → {after.fighters.computer.position} / 4。</span></p>}
  </section>;
}
