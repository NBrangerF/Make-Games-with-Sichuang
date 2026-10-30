import { useId, type CSSProperties } from 'react'
import { raceBoard } from './race-model'
import type { ReadingLanguage } from './reading-navigation'

/*
 * The 24-space teaching board, drawn as printed tiles on the green mat.
 * Used by the hero, the article figures, and the interactive pieces (rule bench, turn check).
 * Colours come from CSS classes so the board follows the design tokens.
 */

const STEP = 80
const X0 = 125
const Y0 = 292

/** Centre of a numbered space; 0 is the start pad off the board. */
export function boardPoint(n: number) {
  if (n <= 0) return { x: 45, y: Y0 }
  const row = Math.floor((n - 1) / 6)
  const column = row % 2 ? 5 - ((n - 1) % 6) : (n - 1) % 6
  return { x: X0 + column * STEP, y: Y0 - row * STEP }
}

export type BoardPawn = { id: string; position: number; tone: 'a' | 'b'; label: string }

type Props = {
  language: ReadingLanguage
  /** where the move starts (legacy single-move display) */
  position?: number
  /** where the move ends; `landed` marks the space reached before a ladder or snake */
  result?: { destination: number; landed?: number }
  /** two-player play: draws these pawns instead of the start/end markers */
  pawns?: BoardPawn[]
  /** makes every space a button; used by the turn check */
  onPick?: (space: number) => void
  picked?: number
  marks?: Partial<Record<number, 'right' | 'wrong'>>
}

export function RaceBoard({ language, position = 6, result, pawns, onPick, picked, marks }: Props) {
  const uid = useId().replace(/:/g, '')
  const t = (zh: string, en: string) => (language === 'en' ? en : zh)
  const numbers = Array.from({ length: 24 }, (_, index) => index + 1)
  const interactive = Boolean(onPick)
  const pawnList: BoardPawn[] =
    pawns ??
    [
      { id: 'start', position, tone: 'a', label: t('起', 'S') },
      ...(result ? [{ id: 'end', position: result.destination, tone: 'b' as const, label: t('到', 'E') }] : []),
    ]
  // pawns sharing a space sit side by side
  const offsets = new Map<string, number>()
  const seen = new Map<number, number>()
  for (const pawn of pawnList) {
    const count = seen.get(pawn.position) ?? 0
    offsets.set(pawn.id, count)
    seen.set(pawn.position, count + 1)
  }
  const description = t(
    `按编号前进。梯子 3 到 11、8 到 17；蛇 14 到 4、22 到 12。${pawnList.map(p => `${p.label}在 ${p.position}`).join('，')}。`,
    `Move in number order. Ladders: 3 to 11, 8 to 17. Snakes: 14 to 4, 22 to 12. ${pawnList.map(p => `${p.label} on ${p.position}`).join(', ')}.`,
  )

  const board = (
    <svg className="lab-board" viewBox="0 0 590 345" role="img" aria-labelledby={`${uid}-board-title ${uid}-board-desc`}>
      <title id={`${uid}-board-title`}>{t('二十四格教学棋盘', 'The 24-space teaching board')}</title>
      <desc id={`${uid}-board-desc`}>{description}</desc>
      <defs>
        <marker id={`${uid}-arrow`} markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0 0L6 3L0 6Z" className="lab-board__snake-head" />
        </marker>
      </defs>
      <rect className="lab-board__mat" x="2" y="2" width="586" height="341" rx="14" />
      <g className="lab-board__start">
        <rect x={45 - 30} y={Y0 - 30} width="60" height="60" rx="30" />
        <text x="45" y={Y0 + 4} textAnchor="middle">{t('起点', 'Start')}</text>
      </g>
      {numbers.map(n => {
        const p = boardPoint(n)
        const tone = (n + Math.floor((n - 1) / 6)) % 2 ? 'alt' : 'base'
        const state = [
          n === result?.destination ? 'dest' : '',
          result?.landed !== undefined && n === result.landed && result.landed !== result.destination ? 'landed' : '',
          n === picked ? 'picked' : '',
          marks?.[n] ? `mark-${marks[n]}` : '',
          n === raceBoard.finish ? 'finish' : '',
        ]
          .filter(Boolean)
          .map(s => `lab-board__space--${s}`)
          .join(' ')
        const tile = (
          <>
            <rect className={`lab-board__space lab-board__space--${tone} ${state}`} x={p.x - 37} y={p.y - 37} width="74" height="74" rx="6" />
            <text className="lab-board__number" x={p.x - 29} y={p.y - 19}>{n}</text>
            {n === raceBoard.finish && <text className="lab-board__finish" x={p.x} y={p.y + 22} textAnchor="middle">{t('终点', 'Finish')}</text>}
          </>
        )
        return <g key={n}>{tile}</g>
      })}
      {Object.entries(raceBoard.ladders).map(([a, b]) => {
        const from = boardPoint(+a)
        const to = boardPoint(b)
        const dx = to.x - from.x
        const dy = to.y - from.y
        const length = Math.hypot(dx, dy)
        const x = (-dy / length) * 6
        const y = (dx / length) * 6
        const rungs = Math.floor(length / 18)
        return (
          <g key={a} className="lab-board__ladder" aria-hidden="true">
            <path d={`M${from.x + x},${from.y + y} L${to.x + x},${to.y + y} M${from.x - x},${from.y - y} L${to.x - x},${to.y - y}`} />
            {Array.from({ length: rungs }, (_, i) => {
              const k = (i + 1) / (rungs + 1)
              const cx = from.x + dx * k
              const cy = from.y + dy * k
              return <path key={i} d={`M${cx + x},${cy + y} L${cx - x},${cy - y}`} />
            })}
          </g>
        )
      })}
      {Object.entries(raceBoard.snakes).map(([a, b]) => {
        const from = boardPoint(+a)
        const to = boardPoint(b)
        return (
          <path
            key={a}
            className="lab-board__snake"
            aria-hidden="true"
            d={`M${from.x},${from.y} C${from.x + 48},${from.y + 40} ${to.x - 48},${to.y - 40} ${to.x},${to.y}`}
            markerEnd={`url(#${uid}-arrow)`}
          />
        )
      })}
      {pawnList.map(pawn => {
        const p = boardPoint(pawn.position)
        const shift = (offsets.get(pawn.id) ?? 0) * 26 - ((seen.get(pawn.position) ?? 1) - 1) * 13
        return (
          <g key={pawn.id} className={`lab-board__pawn lab-board__pawn--${pawn.tone}`} aria-hidden="true">
            <circle cx={p.x + shift} cy={p.y + 4} r="15" />
            <text x={p.x + shift} y={p.y + 8.5} textAnchor="middle">{pawn.label}</text>
          </g>
        )
      })}
    </svg>
  )

  if (!interactive) return board
  // clickable spaces are real buttons laid over the drawing, so keyboard and screen readers get proper controls
  return (
    <div className="lab-board-wrap">
      {board}
      <div className="lab-board__picks" role="group" aria-label={t('选一格作答', 'Pick a space')}>
        {numbers.map(n => {
          const p = boardPoint(n)
          const style = {
            left: `${((p.x - 37) / 590) * 100}%`,
            top: `${((p.y - 37) / 345) * 100}%`,
            width: `${(74 / 590) * 100}%`,
            height: `${(74 / 345) * 100}%`,
          } as CSSProperties
          return (
            <button key={n} type="button" style={style} aria-label={t(`第 ${n} 格`, `Space ${n}`)} aria-pressed={n === picked} onClick={() => onPick?.(n)} />
          )
        })}
      </div>
    </div>
  )
}
