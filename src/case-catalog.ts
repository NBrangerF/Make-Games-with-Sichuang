import type { CasePerspective, ReadingLanguage } from './reading-navigation'
import publicCaseIds from '../content/design-case-ids.json'
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
  gameTitle: Record<ReadingLanguage, string>
  gameAliases: string[]
  title: Record<ReadingLanguage, string>
  summary: Record<ReadingLanguage, string>
  chapterIds: string[]
  sections: CaseSection[]
  designerAccount?: { author: string; sectionId: string; sourceUrl: string }
  sources: { label: string; url: string; edition: string; locator: string; checkedAt: string }[]
}
const files = import.meta.glob<DesignCase>('../content/design-cases/*/meta.json', { eager: true, import: 'default' })
const order = publicCaseIds
export const designCases = order.map(id => files[`../content/design-cases/${id}/meta.json`])
export const caseCategories: Record<CaseCategory | 'all', Record<ReadingLanguage, string>> = {
  all: { 'zh-CN': '全部', en: 'All' }, game: { 'zh-CN': '整局分析', en: 'Whole games' }, mechanism: { 'zh-CN': '机制分析', en: 'Mechanisms' }, theme: { 'zh-CN': '主题分析', en: 'Themes' },
}
