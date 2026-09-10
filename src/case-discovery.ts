import type { CaseCategory, DesignCase } from './case-catalog'
import type { CasePerspective, ReadingLanguage } from './reading-navigation'

export const casePerspectiveLabels: Record<CasePerspective, Record<ReadingLanguage, string>> = {
  actions: { 'zh-CN': '选择与时序', en: 'Choices & timing' },
  economy: { 'zh-CN': '资源与得分', en: 'Resources & scoring' },
  information: { 'zh-CN': '信息与记忆', en: 'Information & memory' },
  uncertainty: { 'zh-CN': '随机与风险', en: 'Chance & risk' },
  space: { 'zh-CN': '空间与位置', en: 'Space & position' },
  interaction: { 'zh-CN': '合作与竞争', en: 'Cooperation & competition' },
  theme: { 'zh-CN': '主题与表达', en: 'Theme & representation' },
  process: { 'zh-CN': '原型与修订', en: 'Prototypes & revisions' },
}

export type CaseFilters = { query: string; category?: CaseCategory; perspective?: CasePerspective; authorOnly?: boolean }
const normalize = (value: string) => value.normalize('NFKC').toLocaleLowerCase()
export const caseSectionTarget = (id: string) => `case-section-${id}`
export const caseSectionLabel = (title: string) => title.replace(/^(?:角度[一二三]：|Angle (?:one|two|three):\s*)/, '')

export function searchCases(entries: DesignCase[], { query, category, perspective, authorOnly }: CaseFilters) {
  const tokens = normalize(query).trim().split(/\s+/).filter(Boolean)
  return entries.flatMap(entry => {
    if ((category && entry.category !== category) || (authorOnly && !entry.designerAccount)) return []
    const candidates = entry.sections.filter(section => !perspective || section.topics.includes(perspective))
    if (!candidates.length) return []
    const base = normalize([entry.id, entry.game, entry.designerAccount?.author || ''].join(' '))
    const sections = candidates.filter(section => {
      const text = `${base} ${normalize([section.title.en, section.title['zh-CN'], ...section.topics.flatMap(topic => Object.values(casePerspectiveLabels[topic]))].join(' '))}`
      return tokens.every(token => text.includes(token))
    })
    if (sections.length) return [{ entry, sections }]
    const description = `${base} ${normalize([entry.title.en, entry.title['zh-CN'], entry.summary.en, entry.summary['zh-CN']].join(' '))}`
    return tokens.every(token => description.includes(token)) ? [{ entry, sections: candidates }] : []
  })
}
