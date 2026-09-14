import { useId, useState } from 'react'
import { RaceBoard } from './race-board'
import type { ReadingLanguage } from './reading-navigation'
import { resolveRaceMove } from './race-model'

export function RacePrototype({ language, hero = false }: { language: ReadingLanguage; hero?: boolean }) {
  const [choice, setChoice] = useState<number | null>(null)
  const uid = useId().replace(/:/g, '')
  const t = (zh: string, en: string) => language === 'en' ? en : zh
  const result = choice === null ? undefined : resolveRaceMove(6, choice)
  return <figure className={`race-prototype${hero ? ' race-prototype--hero' : ''}`} aria-labelledby={`${uid}-caption`}>
    <figcaption id={`${uid}-caption`}><span>{t('课程改编 · 二十四格小赛跑', 'Course prototype · The 24-Space Race')}</span><strong>{t('两颗骰子，只选一颗。', 'Two dice. One choice.')}</strong><p>{t('你在第 6 格，掷出 2 和 6。哪颗能让你走得更远？', 'You are on space 6 and roll 2 and 6. Which takes you farther?')}</p></figcaption>
    <RaceBoard language={language} result={result} />
    <div className="race-prototype__choices" role="group" aria-label={t('选择一次示例移动', 'Choose an example move')}>{[2, 6].map(value => <button type="button" key={value} aria-pressed={choice === value} onClick={() => setChoice(value)}><span aria-hidden="true">{value === 2 ? '⚁' : '⚅'}</span>{t(`选 ${value}`, `Choose ${value}`)}</button>)}</div>
    <p className="race-prototype__result" aria-live="polite">{result ? result.destination === 17 ? t('6 → 8 → 17：踩中梯底，2 反而走得更远。', '6 → 8 → 17: land at a ladder. The 2 takes you farther.') : t('6 → 12：经过梯底不会爬升，要正好停在那里。', '6 → 12: passing a ladder does not trigger it. You must land there.') : t('试选一个点数，看规则怎样改变结果。', 'Choose a result to see the rule at work.')}</p>
    {!hero && <p className="race-prototype__note">{t('这是两骰择一版 C 的预设局面，不是随机试玩或游戏效果的证据。基础版 B 只掷一颗骰子。', 'This is a fixed situation in choice version C, not a random playtest or evidence of player experience. Base version B uses one die.')}</p>}
  </figure>
}
