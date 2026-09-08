export type ReadingLanguage = 'zh-CN' | 'en'
export type ReadingScope = 'all' | 'course' | 'essays'
export type ReadingLocation = {
  readingQuery?: string
  readingScope?: ReadingScope
  readingReturnTo?: string
  caseCategory?: 'game' | 'mechanism' | 'theme'
}

// Reading return links stay inside the course, articles, and case-study surfaces. Nested returns are
// removed so following related essays cannot grow an unbounded URL chain.
export function readingReturn(value: string | null): string | undefined {
  if (!value || value.length > 2400 || !/^#(?:course\/reading|resources\/(?:read|cases))\/[a-zA-Z0-9_-]+\/(?:zh-CN|en)(?:\?[^#]*)?$/.test(value)) return
  const [path, query = ''] = value.split('?')
  const filters = readReadingLocation(query, false)
  return appendReadingLocation(path, filters)
}

export function readReadingLocation(search: string, withReturn = true): ReadingLocation {
  const params = new URLSearchParams(search)
  const query = (params.get('q') || '').slice(0, 200)
  const scope = params.get('scope')
  const category = params.get('type')
  const from = withReturn ? readingReturn(params.get('from')) : undefined
  return {
    ...(query ? { readingQuery: query } : {}),
    ...(scope === 'course' || scope === 'essays' ? { readingScope: scope } : {}),
    ...(from ? { readingReturnTo: from } : {}),
    ...(category === 'game' || category === 'mechanism' || category === 'theme' ? { caseCategory: category } : {}),
  }
}

export function appendReadingLocation(path: string, location: ReadingLocation): string {
  const params = new URLSearchParams()
  if (location.readingQuery) params.set('q', location.readingQuery.slice(0, 200))
  if (location.readingScope && location.readingScope !== 'all') params.set('scope', location.readingScope)
  if (location.caseCategory) params.set('type', location.caseCategory)
  const from = readingReturn(location.readingReturnTo || null)
  if (from) params.set('from', from)
  return `${path}${params.size ? `?${params}` : ''}`
}

export function readingHref(kind: 'course' | 'articles' | 'cases', id: string | undefined, language: ReadingLanguage, location: ReadingLocation = {}) {
  return appendReadingLocation(`#${kind === 'course' ? 'course/reading' : kind === 'cases' ? 'resources/cases' : 'resources/read'}/${encodeURIComponent(id || 'all')}/${language}`, location)
}

export function readingReturnLanguage(from: string | undefined, language: ReadingLanguage) {
  return from?.replace(/\/(zh-CN|en)(?=\?|$)/, `/${language}`)
}
