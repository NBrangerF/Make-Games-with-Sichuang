import { useState } from 'react'
import { RaceBoard } from '../race-board'
import { raceBoard, resolveRaceMove, resolveRaceMoveWith } from '../race-model'
import type { ReadingLanguage } from '../reading-navigation'

/*
 * 规则试验台 / Rule bench: play the 24-space race under each draft from chapter 5 and
 * watch what changes. B one die; C roll two, use one; R one die plus two rerolls each;
 * E one die, and reaching or passing 24 wins. Every move is logged in the course's notation.
 */

type Variant = 'B' | 'C' | 'R' | 'E'
type Phase = 'roll' | 'choose' | 'decide' | 'over'
type Log = { player: number; text: string; wait: boolean }

const roll = () => 1 + Math.floor(Math.random() * 6)
const pips = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅']

export function RuleBench({ language, compact = false }: { language: ReadingLanguage; compact?: boolean }) {
  const en = language === 'en'
  const t = (zh: string, e: string) => (en ? e : zh)
  const names = en ? ['Lin', 'Yu'] : ['小林', '小雨']
  const [variant, setVariant] = useState<Variant>('C')
  const [positions, setPositions] = useState([0, 0])
  const [turn, setTurn] = useState(0)
  const [phase, setPhase] = useState<Phase>('roll')
  const [dice, setDice] = useState<number[]>([])
  const [rerolls, setRerolls] = useState([2, 2])
  const [log, setLog] = useState<Log[]>([])
  const [last, setLast] = useState<{ destination: number; landed?: number } | undefined>()

  const variants: Array<{ id: Variant; label: string; rule: string }> = [
    { id: 'B', label: t('B 基本版', 'B Base'), rule: t('掷一颗骰子，照点数走；刚好到 24 才赢，超过就留在原地。', 'Roll one die and move; land exactly on 24 to win, otherwise stay put.') },
    { id: 'C', label: t('C 选骰版', 'C Choice'), rule: t('掷两颗骰子，选一颗走，另一颗不用；终点同 B。', 'Roll two dice, move by one of them, ignore the other; the ending is as in B.') },
    { id: 'R', label: t('R 重掷版', 'R Reroll'), rule: t('掷一颗骰子；每人有两枚重掷标记，移动前可花一枚重掷一次，必须接受新结果。', 'Roll one die; each player has two reroll tokens and may spend one before moving, accepting the new result.') },
    { id: 'E', label: t('E 终点放宽', 'E Easy finish'), rule: t('掷一颗骰子；走到或越过 24 都算到达终点。', 'Roll one die; reaching or passing 24 finishes the race.') },
  ]
  const current = variants.find(v => v.id === variant)!
  const waits = log.filter(entry => entry.wait).length

  const reset = (next: Variant = variant) => {
    setVariant(next)
    setPositions([0, 0])
    setTurn(0)
    setPhase('roll')
    setDice([])
    setRerolls([2, 2])
    setLog([])
    setLast(undefined)
  }

  const move = (die: number, note: string) => {
    const from = positions[turn]
    const m = variant === 'E' ? resolveRaceMoveWith(from, die, 'reach') : resolveRaceMove(from, die)
    const slide = m.destination !== m.landed ? t(`，再到 ${m.destination}`, `, then to ${m.destination}`) : ''
    const step = m.overshoot
      ? t(`超过终点，留在 ${from}`, `overshoots, stays on ${from}`)
      : t(`落到 ${m.landed}${slide}`, `lands on ${m.landed}${slide}`)
    const end = m.won ? t('，到达终点！', ' and finishes!') : t('，换人。', '; next player.')
    const next = [...positions]
    next[turn] = m.destination
    setPositions(next)
    setLast({ destination: m.destination, landed: m.landed })
    setLog(entries => [{ player: turn, text: `${from}${en ? ': ' : '，'}${note}${step}${end}`, wait: m.overshoot }, ...entries].slice(0, 40))
    setDice([])
    if (m.won) setPhase('over')
    else {
      setTurn(turn === 0 ? 1 : 0)
      setPhase('roll')
    }
  }

  const doRoll = () => {
    if (variant === 'C') {
      setDice([roll(), roll()])
      setPhase('choose')
    } else if (variant === 'R' && rerolls[turn] > 0) {
      setDice([roll()])
      setPhase('decide')
    } else {
      const d = roll()
      move(d, t(`掷出 ${d}，`, `rolls ${d}, `))
    }
  }

  const choose = (index: number) => {
    const [a, b] = dice
    const used = index === 0 ? a : b
    move(used, t(`掷出 ${a} 和 ${b}，选 ${used}，`, `rolls ${a} and ${b}, uses ${used}, `))
  }

  const accept = () => {
    const d = dice[0]
    move(d, t(`掷出 ${d}，`, `rolls ${d}, `))
  }

  const reroll = () => {
    const first = dice[0]
    const d = roll()
    const left = [...rerolls]
    left[turn] -= 1
    setRerolls(left)
    // a reroll must be accepted
    move(d, t(`掷出 ${first}，花一枚标记重掷，得 ${d}，`, `rolls ${first}, spends a token, rerolls a ${d}, `))
  }

  const winner = phase === 'over' ? (positions[0] === raceBoard.finish ? 0 : 1) : -1

  return (
    <section className={`rule-bench${compact ? ' rule-bench--compact' : ''}`} aria-label={t('规则试验台', 'Rule bench')}>
      <header className="rule-bench__head">
        <p className="lab-kicker">{t('规则试验台 · 二十四格小赛跑', 'Rule bench · The 24-Space Race')}</p>
        <h3>{t('换一份草稿，再玩一局', 'Switch drafts and play again')}</h3>
      </header>

      <div className="rule-bench__variants" role="radiogroup" aria-label={t('选择草稿', 'Choose a draft')}>
        {variants.map(v => (
          <button key={v.id} type="button" role="radio" aria-checked={variant === v.id} onClick={() => reset(v.id)}>
            {v.label}
          </button>
        ))}
      </div>
      <p className="rule-bench__rule">{current.rule}</p>

      <div className="rule-bench__table">
        <RaceBoard
          language={language}
          result={last}
          pawns={[
            { id: 'p0', position: positions[0], tone: 'a', label: en ? names[0][0] : names[0].slice(-1) },
            { id: 'p1', position: positions[1], tone: 'b', label: en ? names[1][0] : names[1].slice(-1) },
          ]}
        />

        <div className="rule-bench__panel">
          <div className="rule-bench__players">
            {names.map((name, i) => (
              <p key={name} className={`rule-bench__player rule-bench__player--${i ? 'b' : 'a'}`} aria-current={phase !== 'over' && turn === i ? 'true' : undefined}>
                <i aria-hidden="true" />
                <b>{name}</b>
                <span>{t(`在 ${positions[i]}`, `on ${positions[i]}`)}</span>
                {variant === 'R' && <small>{t(`重掷 ×${rerolls[i]}`, `rerolls ×${rerolls[i]}`)}</small>}
              </p>
            ))}
          </div>

          <div className="rule-bench__actions" aria-live="polite">
            {phase === 'roll' && (
              <button type="button" className="lab-button lab-button--solid" onClick={doRoll}>
                {t(`${names[turn]}掷骰`, `${names[turn]} rolls`)}
              </button>
            )}
            {phase === 'choose' && (
              <>
                <p>{t('选一颗骰子走：', 'Use one die:')}</p>
                <div className="rule-bench__dice">
                  {dice.map((d, i) => {
                    const preview = resolveRaceMove(positions[turn], d)
                    return (
                      <button key={i} type="button" className="lab-die" onClick={() => choose(i)}>
                        <span aria-hidden="true">{pips[d - 1]}</span>
                        <small>{t(`走 ${d}`, `use ${d}`)} → {preview.destination}</small>
                      </button>
                    )
                  })}
                </div>
              </>
            )}
            {phase === 'decide' && (
              <>
                <p>
                  {t(`掷出 ${dice[0]}：`, `Rolled ${dice[0]}: `)}
                  <span className="lab-die lab-die--static" aria-hidden="true">{pips[dice[0] - 1]}</span>
                </p>
                <div className="rule-bench__dice">
                  <button type="button" className="lab-button lab-button--solid" onClick={accept}>
                    {t('就走这个', 'Keep it')} → {resolveRaceMove(positions[turn], dice[0]).destination}
                  </button>
                  <button type="button" className="lab-button" onClick={reroll}>
                    {t('花一枚标记重掷', 'Spend a token to reroll')}
                  </button>
                </div>
              </>
            )}
            {phase === 'over' && (
              <p className="rule-bench__winner">{t(`${names[winner]}到达终点。`, `${names[winner]} reaches the finish.`)}</p>
            )}
          </div>

          <dl className="rule-bench__stats">
            <div>
              <dt>{t('已走回合', 'Turns played')}</dt>
              <dd>{log.length}</dd>
            </div>
            <div>
              <dt>{t('原地等待', 'Turns spent waiting')}</dt>
              <dd>{waits}</dd>
            </div>
          </dl>

          <button type="button" className="lab-link" onClick={() => reset()}>
            {t('重新开一局', 'Start a new game')}
          </button>
        </div>
      </div>

      {log.length > 0 && (
        <details className="rule-bench__log" open={!compact}>
          <summary>{t(`记录（最近 ${Math.min(log.length, 40)} 步，按课程写法）`, `Record (latest ${Math.min(log.length, 40)}, in the course’s notation)`)}</summary>
          <ol>
            {log.map((entry, i) => (
              <li key={log.length - i} className={entry.wait ? 'is-wait' : undefined}>
                <b>{names[entry.player]}</b> {entry.text}
              </li>
            ))}
          </ol>
        </details>
      )}
      <p className="lab-note">
        {t('骰子是随机的，每局都不一样。这是给你感受规则的试验台，不是对哪份草稿更好玩的判断。', 'The dice are random, so every game differs. This is a bench for feeling the rules, not a verdict on which draft is more fun.')}
      </p>
    </section>
  )
}
