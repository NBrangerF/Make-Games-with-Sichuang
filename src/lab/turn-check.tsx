import { useState } from 'react'
import { RaceBoard } from '../race-board'
import { raceBoard, resolveRaceMove } from '../race-model'
import type { ReadingLanguage } from '../reading-navigation'

/*
 * 走一步试试 / Turn check: a position and a roll; click where the pawn ends the turn.
 * The answer comes from the same rules engine as everything else (resolveRaceMove, base version B).
 */

export type TurnCheckSet = 'basics' | 'edges'

const sets: Record<TurnCheckSet, Array<[number, number]>> = {
  // chapter 1: landing triggers, passing does not, snakes, overshoot
  basics: [[6, 2], [6, 6], [12, 2], [23, 2], [2, 1]],
  // chapter 9: the moments where a turn ends without moving, or ends somewhere unexpected
  edges: [[23, 2], [20, 2], [16, 6], [18, 6], [7, 1]],
}

export function explainMove(position: number, die: number, en: boolean) {
  const m = resolveRaceMove(position, die)
  const t = (zh: string, e: string) => (en ? e : zh)
  if (m.overshoot) return t(`${position} + ${die} 超过 24：棋子留在 ${position}，不触发任何格子，换人。`, `${position} + ${die} passes 24, so the pawn stays on ${position}, triggers nothing, and play passes on.`)
  const passed = Object.keys({ ...raceBoard.ladders, ...raceBoard.snakes })
    .map(Number)
    .filter(n => n > position && n < m.landed)
  const passNote = passed.length ? t(`经过 ${passed.join('、')} 不触发；`, `Passing ${passed.join(' and ')} triggers nothing; `) : ''
  if (m.won) return t(`${passNote}${position} + ${die} = 24，刚好到终点，获胜。`, `${passNote}${position} + ${die} = 24, exactly the finish: a win.`)
  if (raceBoard.ladders[m.landed]) return t(`${passNote}${position} + ${die} = ${m.landed}，停在梯底，爬到 ${m.destination}，换人。`, `${passNote}${position} + ${die} = ${m.landed}, a ladder foot, so climb to ${m.destination}; next player.`)
  if (raceBoard.snakes[m.landed]) return t(`${passNote}${position} + ${die} = ${m.landed}，停在蛇头，滑到 ${m.destination}，换人。`, `${passNote}${position} + ${die} = ${m.landed}, a snake’s head, so slide to ${m.destination}; next player.`)
  return t(`${passNote}${position} + ${die} = ${m.landed}，停在这里，换人。`, `${passNote}${position} + ${die} = ${m.landed}; stop there, next player.`)
}

export function TurnCheck({ language, set = 'basics' }: { language: ReadingLanguage; set?: TurnCheckSet }) {
  const en = language === 'en'
  const t = (zh: string, e: string) => (en ? e : zh)
  const questions = sets[set]
  const [index, setIndex] = useState(0)
  const [picked, setPicked] = useState<number | undefined>()
  const [score, setScore] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [position, die] = questions[index]
  const answer = resolveRaceMove(position, die)
  const right = picked === answer.destination

  const pick = (space: number) => {
    if (answered) return
    setPicked(space)
    setAnswered(true)
    if (space === answer.destination) setScore(s => s + 1)
  }
  const next = () => {
    setIndex(i => (i + 1) % questions.length)
    setPicked(undefined)
    setAnswered(false)
    if (index === questions.length - 1) setScore(0)
  }

  return (
    <section className="turn-check" aria-label={t('走一步试试', 'Try a turn')}>
      <header className="turn-check__head">
        <p className="lab-kicker">
          {t('走一步试试 · 基本版 B', 'Try a turn · base version B')} <span>{index + 1} / {questions.length}</span>
        </p>
        <h3>
          {t(`棋子在 ${position}，掷出 ${die}。这一回合结束时，棋子停在哪一格？`, `The pawn is on ${position} and rolls ${die}. Where does it end the turn?`)}
        </h3>
        <p className="turn-check__how">{t('在棋盘上点一格作答。', 'Click a space on the board to answer.')}</p>
      </header>
      <RaceBoard
        language={language}
        position={position}
        pawns={[{ id: 'pawn', position, tone: 'a', label: t('棋', 'P') }]}
        onPick={pick}
        picked={picked}
        result={answered ? { destination: answer.destination, landed: answer.landed } : undefined}
        marks={answered && picked !== undefined ? { [picked]: right ? 'right' : 'wrong' } : undefined}
      />
      <div className="turn-check__feedback" aria-live="polite">
        {answered ? (
          <>
            <p className={right ? 'is-right' : 'is-wrong'}>
              <b>{right ? t('对了。', 'Right.') : t(`不对，应该停在 ${answer.destination}。`, `Not quite: it ends on ${answer.destination}.`)}</b> {explainMove(position, die, en)}
            </p>
            <button type="button" className="lab-button lab-button--solid" onClick={next}>
              {index === questions.length - 1 ? t(`再来一轮（这轮答对 ${score} / ${questions.length}）`, `Go again (${score} / ${questions.length} this round)`) : t('下一题', 'Next')}
            </button>
          </>
        ) : (
          <p className="turn-check__wait">{t('先想好：落在哪一格？那一格有梯子或蛇吗？', 'Think first: where does it land, and is there a ladder or snake there?')}</p>
        )}
      </div>
    </section>
  )
}
