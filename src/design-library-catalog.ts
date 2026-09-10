import { matchesSearch, type ReadingSearchIndex } from './reading-search'
import catalog from '../content/design-library/catalog.json'
import type { LibraryKind, LibraryQuestion, ReadingLanguage } from './reading-navigation'

export type LibraryText = Record<ReadingLanguage, string>
export type LibraryEntry = {
  id: string
  kind: 'mechanism' | 'overview' | 'pattern' | 'structure' | 'theme' | 'setting' | 'lesson' | 'comparison'
  contentVersion: string
  title: LibraryText
  summary: LibraryText
  aliases: Record<ReadingLanguage, string[]>
  searchTerms: Record<ReadingLanguage, string[]>
  question: LibraryQuestion
  chapterIds: string[]
  caseIds: string[]
  relations: { targetId: string; type: 'contrast-with' | 'variant-of' | 'combines-with' | 'see-also' }[]
  bggReferences: { id: number; name: string; url: string; relation: 'same-scope' | 'local-narrower' | 'local-broader' | 'related' }[]
}

export const libraryEntries = catalog.entries as LibraryEntry[]
export const libraryGroup = (kind: LibraryEntry['kind']): LibraryKind => kind === 'lesson' ? 'lessons' : kind === 'comparison' ? 'comparisons' : kind === 'theme' || kind === 'setting' ? 'themes' : 'mechanisms'
export const kindLabels: Record<LibraryKind, LibraryText> = {
  mechanisms: { 'zh-CN': '机制与设计结构', en: 'Mechanisms & structures' },
  themes: { 'zh-CN': '主题与情境', en: 'Themes & settings' },
  lessons: { 'zh-CN': '直接教学', en: 'Practical lessons' },
  comparisons: { 'zh-CN': '规则比较', en: 'Rule comparisons' },
}
export const questionLabels: Record<LibraryQuestion, LibraryText> = {
  actions: { 'zh-CN': '怎样安排可选行动', en: 'Organize available actions' },
  cards: { 'zh-CN': '怎样使用牌与抽取池', en: 'Use cards and drawing pools' },
  uncertainty: { 'zh-CN': '怎样处理信息与风险', en: 'Handle information and risk' },
  space: { 'zh-CN': '怎样让空间有作用', en: 'Give space a role' },
  economy: { 'zh-CN': '怎样分配资源与价值', en: 'Allocate resources and value' },
  interaction: { 'zh-CN': '怎样让玩家相互影响', en: 'Connect players’ decisions' },
  theme: { 'zh-CN': '怎样把主题写进规则', en: 'Connect themes to rules' },
  process: { 'zh-CN': '怎样做原型并修订', en: 'Prototype and revise' },
}

export function searchLibrary(entries: LibraryEntry[], query: string, kind?: LibraryKind, question?: LibraryQuestion, index?: ReadingSearchIndex) {
  return entries.filter(entry => {
    const haystack = [entry.title['zh-CN'], entry.title.en, entry.summary['zh-CN'], entry.summary.en, ...entry.aliases['zh-CN'], ...entry.aliases.en, ...entry.searchTerms['zh-CN'], ...entry.searchTerms.en, ...Object.values(questionLabels[entry.question]), ...entry.bggReferences.map(ref => ref.name)].join(' ').toLocaleLowerCase()
    return (!kind || libraryGroup(entry.kind) === kind) && (!question || entry.question === question) && matchesSearch(haystack, query, index?.get(entry.id))
  })
}
