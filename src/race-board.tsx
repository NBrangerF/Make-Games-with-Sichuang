import { useId } from 'react'
import { raceBoard } from './race-model'
import type { ReadingLanguage } from './reading-navigation'

const point = (n: number) => {
  const row = Math.floor((n - 1) / 6)
  const column = row % 2 ? 5 - (n - 1) % 6 : (n - 1) % 6
  return { x: 55 + column * 80, y: 292 - row * 80 }
}

export function RaceBoard({ language, position = 6, result }: { language: ReadingLanguage; position?: number; result?: { destination: number } }) {
  const uid = useId().replace(/:/g, '')
  const t = (zh: string, en: string) => language === 'en' ? en : zh
  const numbers = Array.from({ length: 24 }, (_, index) => index + 1)
  return (
    <svg viewBox="0 0 510 345" role="img" aria-labelledby={`${uid}-board-title ${uid}-board-desc`}>
      <title id={`${uid}-board-title`}>{t('二十四格教学棋盘', 'The 24-space teaching board')}</title>
      <desc id={`${uid}-board-desc`}>{t(`按编号前进。梯子 3 到 11、8 到 17；蛇 14 到 4、22 到 12。起始位置 ${position}。${result ? `图中当前位置 ${result.destination}。` : ''}`, `Move in number order. Ladders: 3 to 11, 8 to 17. Snakes: 14 to 4, 22 to 12. Start at ${position}.${result ? ` Shown position: ${result.destination}.` : ''}`)}</desc>
      <defs><marker id={`${uid}-arrow`} markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0 0L6 3L0 6Z" fill="#a43e24"/></marker></defs>
      {numbers.map(n => { const p = point(n); return <g key={n}><rect x={p.x - 37} y={p.y - 37} width="74" height="74" rx="5" fill={n === result?.destination ? '#bfd0b5' : (n + Math.floor((n - 1) / 6)) % 2 ? '#e9e6d7' : '#f9f6ee'} stroke={n === result?.destination ? '#264d3c' : '#d5d5c7'} strokeWidth={n === result?.destination ? 3 : 1}/><text x={p.x - 27} y={p.y - 15} fontSize="14" fill="#314942">{n}</text>{n === 24 && <text x={p.x} y={p.y + 15} textAnchor="middle" fontSize="11" fill="#314942">{t('终点', 'FINISH')}</text>}</g> })}
      {Object.entries(raceBoard.ladders).map(([a, b]) => { const from = point(+a), to = point(b); const dx = to.x - from.x, dy = to.y - from.y; const length = Math.hypot(dx, dy); const x = -dy / length * 5, y = dx / length * 5; return <g key={a} stroke="#557348" strokeWidth="3" fill="none"><path d={`M${from.x + x},${from.y + y} L${to.x + x},${to.y + y} M${from.x - x},${from.y - y} L${to.x - x},${to.y - y}`}/>{[0, .2, .4, .6, .8, 1].map(f => <path key={f} d={`M${from.x + dx * f + x},${from.y + dy * f + y} L${from.x + dx * f - x},${from.y + dy * f - y}`}/>)}</g> })}
      {Object.entries(raceBoard.snakes).map(([a, b]) => { const from = point(+a), to = point(b); return <path key={a} d={`M${from.x},${from.y} C${from.x + 48},${from.y + 40} ${to.x - 48},${to.y - 40} ${to.x},${to.y}`} fill="none" stroke="#a43e24" strokeWidth="4" strokeDasharray="8 3" markerEnd={`url(#${uid}-arrow)`}/> })}
      <circle cx={point(position).x - (result?.destination === position ? 14 : 0)} cy={point(position).y} r="15" fill="#b84628" stroke="#fff9ed" strokeWidth="3"/><text x={point(position).x - (result?.destination === position ? 14 : 0)} y={point(position).y + 4} textAnchor="middle" fill="white" fontSize="12">{t('起', 'S')}</text>
      {result && <g><circle cx={point(result.destination).x + (result.destination === position ? 14 : 0)} cy={point(result.destination).y} r="13" fill="#274e3c" stroke="#fff9ed" strokeWidth="3"/><text x={point(result.destination).x + (result.destination === position ? 14 : 0)} y={point(result.destination).y + 4} textAnchor="middle" fill="white" fontSize="12">{t('到', 'E')}</text></g>}
    </svg>
  )
}
