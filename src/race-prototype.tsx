import { useId, useState } from 'react'
import type { ReadingLanguage } from './reading-navigation'
import { raceBoard, resolveRaceMove } from './race-model'

const point = (n: number) => {
  const row = Math.floor((n - 1) / 6)
  const column = row % 2 ? 5 - (n - 1) % 6 : (n - 1) % 6
  return { x: 55 + column * 80, y: 292 - row * 80 }
}
export function RacePrototype({ language, hero = false }: { language: ReadingLanguage; hero?: boolean }) {
  const [choice, setChoice] = useState<number | null>(null)
  const uid = useId().replace(/:/g, '')
  const t = (zh: string, en: string) => language === 'en' ? en : zh
  const result = choice === null ? undefined : resolveRaceMove(6, choice)
  const numbers = Array.from({ length: 24 }, (_, index) => index + 1)
  return <figure className={`race-prototype${hero ? ' race-prototype--hero' : ''}`} aria-labelledby={`${uid}-caption`}>
    <figcaption id={`${uid}-caption`}><span>{t('课程改编 · 二十四格小赛跑', 'Course prototype · The 24-Space Race')}</span><strong>{t('两颗骰子，只选一颗。', 'Two dice. One choice.')}</strong><p>{t('你在第 6 格，掷出 2 和 6。哪颗能让你走得更远？', 'You are on space 6 and roll 2 and 6. Which takes you farther?')}</p></figcaption>
    <svg viewBox="0 0 510 345" role="img" aria-labelledby={`${uid}-board-title ${uid}-board-desc`}>
      <title id={`${uid}-board-title`}>{t('二十四格教学棋盘', 'The 24-space teaching board')}</title>
      <desc id={`${uid}-board-desc`}>{t('按编号前进。梯子从 3 到 11、8 到 17；蛇从 14 到 4、22 到 12。棋子现在在第 6 格。', 'Move in number order. Ladders connect 3 to 11 and 8 to 17; snakes connect 14 to 4 and 22 to 12. The pawn starts this example on space 6.')}</desc>
      <defs><marker id={`${uid}-arrow`} markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0 0L6 3L0 6Z" fill="#a43e24"/></marker></defs>
      {numbers.map(n => { const p = point(n); return <g key={n}><rect x={p.x - 37} y={p.y - 37} width="74" height="74" rx="5" fill={n === result?.destination ? '#bfd0b5' : (n + Math.floor((n - 1) / 6)) % 2 ? '#e9e6d7' : '#f9f6ee'} stroke={n === result?.destination ? '#264d3c' : '#d5d5c7'} strokeWidth={n === result?.destination ? 3 : 1}/><text x={p.x - 27} y={p.y - 15} fontSize="14" fill="#314942">{n}</text>{n === 24 && <text x={p.x} y={p.y + 15} textAnchor="middle" fontSize="11" fill="#314942">{t('终点', 'FINISH')}</text>}</g> })}
      {Object.entries(raceBoard.ladders).map(([a, b]) => { const from = point(+a), to = point(b); const dx = to.x - from.x, dy = to.y - from.y; const length = Math.hypot(dx, dy); const x = -dy / length * 5, y = dx / length * 5; return <g key={a} stroke="#557348" strokeWidth="3" fill="none"><path d={`M${from.x + x},${from.y + y} L${to.x + x},${to.y + y} M${from.x - x},${from.y - y} L${to.x - x},${to.y - y}`}/>{[0, .2, .4, .6, .8, 1].map(f => <path key={f} d={`M${from.x + dx * f + x},${from.y + dy * f + y} L${from.x + dx * f - x},${from.y + dy * f - y}`}/>)}</g> })}
      {Object.entries(raceBoard.snakes).map(([a, b]) => { const from = point(+a), to = point(b); return <path key={a} d={`M${from.x},${from.y} C${from.x + 48},${from.y + 40} ${to.x - 48},${to.y - 40} ${to.x},${to.y}`} fill="none" stroke="#a43e24" strokeWidth="4" strokeDasharray="8 3" markerEnd={`url(#${uid}-arrow)`}/> })}
      <circle cx={point(6).x} cy={point(6).y} r="15" fill="#b84628" stroke="#fff9ed" strokeWidth="3"/><text x={point(6).x} y={point(6).y + 4} textAnchor="middle" fill="white" fontSize="12">{t('你', 'YOU')}</text>
      {result && <circle cx={point(result.destination).x} cy={point(result.destination).y} r="13" fill="#274e3c" stroke="#fff9ed" strokeWidth="3"/>}
    </svg>
    <div className="race-prototype__choices" role="group" aria-label={t('选择一次示例移动', 'Choose an example move')}>{[2, 6].map(value => <button type="button" key={value} aria-pressed={choice === value} onClick={() => setChoice(value)}><span aria-hidden="true">{value === 2 ? '⚁' : '⚅'}</span>{t(`选 ${value}`, `Choose ${value}`)}</button>)}</div>
    <p className="race-prototype__result" aria-live="polite">{result ? result.destination === 17 ? t('6 → 8 → 17：踩中梯底，2 反而走得更远。', '6 → 8 → 17: land at a ladder. The 2 takes you farther.') : t('6 → 12：经过梯底不会爬升，要正好停在那里。', '6 → 12: passing a ladder does not trigger it. You must land there.') : t('试选一个点数，看规则怎样改变结果。', 'Choose a result to see the rule at work.')}</p>
    {!hero && <p className="race-prototype__note">{t('这是两骰择一版 C 的预设局面，不是随机试玩或游戏效果的证据。基础版 B 只掷一颗骰子。', 'This is a fixed situation in choice version C, not a random playtest or evidence of player experience. Base version B uses one die.')}</p>}
  </figure>
}
