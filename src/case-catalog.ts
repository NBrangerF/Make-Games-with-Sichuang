import type { ReadingLanguage } from './reading-navigation'
export type CaseCategory = 'game' | 'mechanism' | 'theme'
export type DesignCase = {
  id: string
  category: CaseCategory
  game: string
  title: Record<ReadingLanguage, string>
  summary: Record<ReadingLanguage, string>
  chapterIds: string[]
  sources: { label: string; url: string; edition: string; locator: string; checkedAt: string }[]
}
const files = import.meta.glob<DesignCase>('../content/design-cases/*/meta.json', { eager: true, import: 'default' })
const order = ['carcassonne', 'pandemic', 'dominion', 'six-nimmt', 'hanabi', 'wingspan']
export const designCases = Object.values(files).sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id))
export const caseCategories: Record<CaseCategory | 'all', Record<ReadingLanguage, string>> = {
  all: { 'zh-CN': '全部', en: 'All' }, game: { 'zh-CN': '整局分析', en: 'Whole games' }, mechanism: { 'zh-CN': '机制分析', en: 'Mechanisms' }, theme: { 'zh-CN': '主题分析', en: 'Themes' },
}
