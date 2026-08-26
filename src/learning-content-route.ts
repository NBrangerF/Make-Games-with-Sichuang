export const learningContentIds = [
  'systematic-unit-00-question-first',
  'systematic-unit-01-experience-intent',
  'systematic-unit-02-decisions-core-loop',
  'systematic-unit-03-mechanisms-information-interaction',
  'systematic-unit-04-minimum-prototype',
  'systematic-unit-05-single-question-test',
  'systematic-unit-06-evidence-to-next-version',
  'learn-by-playing-one-moment',
  'game-design-concepts-level-01',
  'game-design-concepts-level-02',
  'what-makes-a-rulebook-accessible-and-entertaining',
  'designer-case-monsoon-market-variables',
  'designer-case-dune-imperium-beginnings',
  'designer-case-quid-for-your-quo',
  'designer-case-paul-grogan-rulebook-layout',
  'designer-case-new-bedford-manufacturing-constraint',
] as const

export type LearningContentId = typeof learningContentIds[number]

const learningContentIdSet = new Set<string>(learningContentIds)

export function isLearningContentId(value: string | undefined): value is LearningContentId {
  return typeof value === 'string' && learningContentIdSet.has(value)
}

export const learningContentTitles: Record<LearningContentId, string> = {
  'systematic-unit-00-question-first': '单元 0：从一个具体问题开始',
  'systematic-unit-01-experience-intent': '单元 1：玩家体验与设计意图',
  'systematic-unit-02-decisions-core-loop': '单元 2：决定与核心循环',
  'systematic-unit-03-mechanisms-information-interaction': '单元 3：机制、信息与互动',
  'systematic-unit-04-minimum-prototype': '单元 4：最小原型',
  'systematic-unit-05-single-question-test': '单元 5：单问题测试',
  'systematic-unit-06-evidence-to-next-version': '单元 6：从证据到下一版',
  'learn-by-playing-one-moment': '边玩边学 01：只分析一局里的一个时刻',
  'game-design-concepts-level-01': '第 1 关：概览 / 什么是游戏？',
  'game-design-concepts-level-02': '第 2 关：游戏设计 / 迭代与快速原型',
  'what-makes-a-rulebook-accessible-and-entertaining': '怎样让规则书既无障碍又有趣？',
  'designer-case-monsoon-market-variables': '一次只测试一种变化',
  'designer-case-dune-imperium-beginnings': '好游戏为什么仍要推翻',
  'designer-case-quid-for-your-quo': '删掉旧机制后系统为什么垮了',
  'designer-case-paul-grogan-rulebook-layout': '规则文字交给排版以后',
  'designer-case-new-bedford-manufacturing-constraint': '一张纸为什么会决定二十座建筑',
}
