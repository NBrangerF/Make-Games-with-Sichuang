import type { ReactNode } from 'react'
import type { ReadingLanguage } from '../reading-navigation'
import { EndingOdds } from './ending-odds'
import { RuleBench } from './rule-bench'
import { TurnCheck } from './turn-check'

/*
 * Which chapters carry a piece you can play, and after which section it appears.
 * Main (race) path only: the pieces run the 24-space race's rules. The section names are the
 * chapter's own headings, so moving a heading means updating it here (check-text-learning verifies).
 */

type Spec = { after: Record<ReadingLanguage, string>; render: (language: ReadingLanguage) => ReactNode }

const after = (zh: string, en: string) => ({ 'zh-CN': zh, en })

export const chapterInteractives: Record<string, Spec> = {
  'race-rules-and-play': {
    after: after('规则规定结果，游玩给结果意义', 'Rules determine outcomes; play gives them meaning'),
    render: language => <TurnCheck language={language} set="basics" />,
  },
  'race-ideas-under-constraints': {
    after: after('用同一个局面看清差别', 'Compare candidates in the same position'),
    render: language => <RuleBench language={language} compact />,
  },
  'race-state-and-resolution': {
    after: after('用边界局面检查，而不只走顺利路线', 'Test boundaries as well as smooth sequences'),
    render: language => <TurnCheck language={language} set="edges" />,
  },
  'race-goals-and-pacing': {
    after: after('一局的时间花在哪里', 'Where does the time go?'),
    render: language => <EndingOdds language={language} />,
  },
  'race-diagnose-feedback': {
    after: after('把抱怨还原到一个局面', 'Recover the situation behind the complaint'),
    render: language => <EndingOdds language={language} />,
  },
}
