import type { CasePerspective, ReadingLanguage } from './reading-navigation'
export type CaseCategory = 'game' | 'mechanism' | 'theme'
export type CaseSection = {
  id: string
  kind: 'angle' | 'context' | 'designer'
  topics: CasePerspective[]
  title: Record<ReadingLanguage, string>
}
export type DesignCase = {
  id: string
  category: CaseCategory
  game: string
  title: Record<ReadingLanguage, string>
  summary: Record<ReadingLanguage, string>
  chapterIds: string[]
  sections: CaseSection[]
  designerAccount?: { author: string; sectionId: string; sourceUrl: string }
  sources: { label: string; url: string; edition: string; locator: string; checkedAt: string }[]
}
const files = import.meta.glob<DesignCase>('../content/design-cases/*/meta.json', { eager: true, import: 'default' })
const order = ['carcassonne', 'pandemic', 'dominion', 'six-nimmt', 'hanabi', 'wingspan', 'agricola', 'cant-stop', 'for-sale', 'el-grande', 'quacks', 'ticket-to-ride', 'modern-art', 'the-crew', 'azul', 'root', 'radlands', 'spirit-island']
export const designCases = Object.values(files).sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id))
export const caseCategories: Record<CaseCategory | 'all', Record<ReadingLanguage, string>> = {
  all: { 'zh-CN': '全部', en: 'All' }, game: { 'zh-CN': '整局分析', en: 'Whole games' }, mechanism: { 'zh-CN': '机制分析', en: 'Mechanisms' }, theme: { 'zh-CN': '主题分析', en: 'Themes' },
}
