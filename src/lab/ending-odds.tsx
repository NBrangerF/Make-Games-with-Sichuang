import { useMemo, useState } from 'react'
import { turnsToFinish, type RaceRule } from '../race-model'
import type { ReadingLanguage } from '../reading-navigation'

/*
 * 终点概率实验 / Ending odds: from a space near the finish, how likely is it to finish on your
 * next turn, and how long might you wait? Exact values from the board's transition table
 * (fair independent dice, the other player ignored), not a simulation.
 */

const starts = [18, 19, 20, 21, 23]
const HIST = 10

export function EndingOdds({ language }: { language: ReadingLanguage }) {
  const en = language === 'en'
  const t = (zh: string, e: string) => (en ? e : zh)
  const [start, setStart] = useState(23)
  const [rule, setRule] = useState<RaceRule>('B')
  const result = useMemo(() => turnsToFinish(start, rule), [start, rule])
  const bars = [...result.byTurn.slice(0, HIST), result.byTurn.slice(HIST).reduce((a, b) => a + b, 0) + result.later]
  const peak = Math.max(...bars)
  const pct = (v: number) => `${(v * 100).toFixed(1)}%`
  const rules: Array<{ id: RaceRule; label: string; note: string }> = [
    { id: 'B', label: t('B 刚好到 24', 'B Exact finish'), note: t('一颗骰子，必须刚好走到 24；超过就留在原地。', 'One die; you must land exactly on 24, or stay put.') },
    { id: 'C', label: t('C 两颗选一颗', 'C Two dice, use one'), note: t('两颗骰子选一颗；能到终点就选它，否则选走得更远的那颗。', 'Two dice, use one: finish if either can, otherwise take the one that ends farther.') },
    { id: 'E', label: t('E 到达或越过', 'E Reach or pass'), note: t('一颗骰子，走到或越过 24 都算到达。', 'One die; reaching or passing 24 both finish.') },
  ]

  return (
    <section className="ending-odds" aria-label={t('终点概率实验', 'Ending odds')}>
      <header>
        <p className="lab-kicker">{t('终点概率实验', 'Ending odds')}</p>
        <h3>{t('离终点只差几格，要等多久？', 'A few spaces from the finish: how long is the wait?')}</h3>
      </header>

      <div className="ending-odds__controls">
        <fieldset>
          <legend>{t('从哪一格开始', 'Start on')}</legend>
          <div className="lab-segmented">
            {starts.map(s => (
              <button key={s} type="button" aria-pressed={start === s} onClick={() => setStart(s)}>
                {s}
              </button>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend>{t('终点规则', 'Ending rule')}</legend>
          <div className="lab-segmented">
            {rules.map(r => (
              <button key={r.id} type="button" aria-pressed={rule === r.id} onClick={() => setRule(r.id)}>
                {r.label}
              </button>
            ))}
          </div>
        </fieldset>
      </div>
      <p className="ending-odds__rule">{rules.find(r => r.id === rule)!.note}</p>

      <dl className="ending-odds__figures" aria-live="polite">
        <div>
          <dt>{t('下一个回合就到终点', 'Finish on your next turn')}</dt>
          <dd>
            {result.firstTurn.hits} / {result.firstTurn.of}
            <small>{pct(result.firstTurn.hits / result.firstTurn.of)}</small>
          </dd>
        </div>
        <div>
          <dt>{t('平均要等几个自己的回合', 'Average turns of your own')}</dt>
          <dd>
            {result.mean.toFixed(1)}
            <small>{t('个回合', 'turns')}</small>
          </dd>
        </div>
      </dl>

      <figure className="ending-odds__chart">
        <figcaption>{t('第几个自己的回合到达终点（概率）', 'On which of your own turns you finish (probability)')}</figcaption>
        <div className="ending-odds__bars" role="img" aria-label={bars.map((v, i) => `${i < HIST ? i + 1 : `${HIST + 1}+`}: ${pct(v)}`).join(', ')}>
          {bars.map((v, i) => (
            <div key={i} className="ending-odds__bar">
              <span style={{ height: `${peak ? (v / peak) * 100 : 0}%` }} title={pct(v)} />
              <small>{i < HIST ? i + 1 : `${HIST + 1}+`}</small>
            </div>
          ))}
        </div>
      </figure>

      <p className="lab-note">
        {t(
          '按公平、独立的骰子精确计算，不考虑对手先到终点；C 的选法写在上面。它说明的是等待的长短，不说明哪种规则更好玩。',
          'Computed exactly for fair, independent dice, ignoring the chance that the other player finishes first; C’s choice rule is stated above. It shows how long the wait is, not which rule is more fun.',
        )}
      </p>
    </section>
  )
}
