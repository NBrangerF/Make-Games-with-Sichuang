/** Figures are attached to an exact section in both translations, never a paragraph count. */
export type FigureKind = 'landing' | 'turn' | 'state' | 'choice' | 'chance' | 'reroll' | 'space' | 'supply' | 'finish' | 'combine' | 'cooperate' | 'components' | 'prototype'
export type FigureLanguage = 'zh-CN' | 'en'
export type ArticleFigureSpec = { kind: FigureKind; after: Record<FigureLanguage, string> }
const at = (kind: FigureKind, zh: string, en: string): ArticleFigureSpec => ({ kind, after: { 'zh-CN': zh, en } })
export const articleFigures: Record<string, ArticleFigureSpec> = {
  'race-rules-and-play': at('landing', '把一个回合放慢', 'Slow down one turn'),
  'race-core-actions': at('turn', '从掷骰写到换人', 'Write from the roll to the next player'),
  'race-state-and-resolution': at('state', '先判断能否落下，再处理落点', 'Check the landing before resolving its effect'),
  'race-choices-and-agency': at('choice', '是没有差别，还是没看出差别', 'No difference, or a difference the player missed?'),
  'race-information-and-randomness': at('chance', '在 23，只计算下一次自己的回合', 'At 23, calculate just your next turn'),
  'race-resources-and-endings': at('reroll', '花掉标记，也放弃了眼前的结果', 'Spending also means giving up the known result'),
  'race-space-and-opportunity': at('space', '先找到会停下来的地方', 'Find where the pawn actually stops'),
  'race-design-an-economy': at('supply', '加一个补给格，会改变什么？', 'Add one supply space'),
  'race-goals-and-pacing': at('finish', '只改结束条件，再看同一局面', 'Change only the ending rule'),
  'race-combine-mechanisms': at('combine', '组合之前，先摆一回合', 'Construct one turn before combining rules'),
  'race-cooperation-and-conflict': at('cooperate', '我到了，还得等你', 'I have finished, but I still need you to arrive'),
  'race-rules-and-components': at('components', '把重要区别放在操作发生的地方', 'Put the distinction where the action happens'),
  'race-prototype-for-a-question': at('prototype', '固定结果，是为了检查关系', 'Fix the result to examine the relationship'),
}
