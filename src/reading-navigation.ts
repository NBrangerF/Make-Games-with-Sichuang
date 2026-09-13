export type ReadingLanguage = 'zh-CN' | 'en'
export type ReadingScope = 'all' | 'course' | 'essays'
export type ReadingTrack = 'race' | 'river'
export const casePerspectives = ['actions', 'economy', 'information', 'uncertainty', 'space', 'interaction', 'theme', 'process'] as const
export type CasePerspective = typeof casePerspectives[number]
export const libraryKinds = ['mechanisms', 'themes', 'lessons', 'comparisons'] as const
export const libraryQuestions = ['actions', 'cards', 'uncertainty', 'space', 'economy', 'interaction', 'theme', 'process'] as const
export type LibraryKind = typeof libraryKinds[number]
export type LibraryQuestion = typeof libraryQuestions[number]
export type ReadingLocation = {
  readingTrack?: ReadingTrack
  readingQuery?: string
  readingScope?: ReadingScope
  readingReturnTo?: string
  caseCategory?: 'game' | 'mechanism' | 'theme'
  casePerspective?: CasePerspective
  caseAuthorOnly?: boolean
  caseSection?: string
  libraryKind?: LibraryKind
  libraryQuestion?: LibraryQuestion
}

// Reading return links stay inside the course, articles, and case-study surfaces. Nested returns are
// removed so following related essays cannot grow an unbounded URL chain.
export function readingReturn(value: string | null): string | undefined {
  if (!value || value.length > 2400 || !/^#(?:course\/reading|resources\/(?:read|cases|library))\/[a-zA-Z0-9_-]+\/(?:zh-CN|en)(?:\?[^#]*)?$/.test(value)) return
  const [path, query = ''] = value.split('?')
  const filters = readReadingLocation(query, false)
  return appendReadingLocation(path, filters)
}

export function readReadingLocation(search: string, withReturn = true): ReadingLocation {
  const params = new URLSearchParams(search)
  const query = (params.get('q') || '').slice(0, 200)
  const scope = params.get('scope')
  const category = params.get('type')
  const perspective = params.get('angle') as CasePerspective
  const section = params.get('section') || ''
  const kind = params.get('kind') as LibraryKind
  const question = params.get('group') as LibraryQuestion
  const from = withReturn ? readingReturn(params.get('from')) : undefined
  return {
    ...(params.get('track') === 'river' ? { readingTrack: 'river' as const } : {}),
    ...(query ? { readingQuery: query } : {}),
    ...(scope === 'course' || scope === 'essays' ? { readingScope: scope } : {}),
    ...(from ? { readingReturnTo: from } : {}),
    ...(category === 'game' || category === 'mechanism' || category === 'theme' ? { caseCategory: category } : {}),
    ...(casePerspectives.includes(perspective) ? { casePerspective: perspective } : {}),
    ...(params.get('author') === '1' ? { caseAuthorOnly: true } : {}),
    ...(/^[a-z][a-z0-9-]{0,63}$/.test(section) ? { caseSection: section } : {}),
    ...(libraryKinds.includes(kind) ? { libraryKind: kind } : {}),
    ...(libraryQuestions.includes(question) ? { libraryQuestion: question } : {}),
  }
}

export function appendReadingLocation(path: string, location: ReadingLocation): string {
  const params = new URLSearchParams()
  if (location.readingTrack === 'river') params.set('track', 'river')
  if (location.readingQuery) params.set('q', location.readingQuery.slice(0, 200))
  if (location.readingScope && location.readingScope !== 'all') params.set('scope', location.readingScope)
  if (location.caseCategory) params.set('type', location.caseCategory)
  if (location.casePerspective && casePerspectives.includes(location.casePerspective)) params.set('angle', location.casePerspective)
  if (location.caseAuthorOnly) params.set('author', '1')
  if (location.caseSection && /^[a-z][a-z0-9-]{0,63}$/.test(location.caseSection)) params.set('section', location.caseSection)
  if (location.libraryKind && libraryKinds.includes(location.libraryKind)) params.set('kind', location.libraryKind)
  if (location.libraryQuestion && libraryQuestions.includes(location.libraryQuestion)) params.set('group', location.libraryQuestion)
  const from = readingReturn(location.readingReturnTo || null)
  if (from) params.set('from', from)
  return `${path}${params.size ? `?${params}` : ''}`
}

export function readingHref(kind: 'course' | 'articles' | 'cases' | 'library', id: string | undefined, language: ReadingLanguage, location: ReadingLocation = {}) {
  return appendReadingLocation(`#${kind === 'course' ? 'course/reading' : kind === 'cases' ? 'resources/cases' : kind === 'library' ? 'resources/library' : 'resources/read'}/${encodeURIComponent(id || 'all')}/${language}`, location)
}

export function readingReturnLanguage(from: string | undefined, language: ReadingLanguage) {
  return from?.replace(/\/(zh-CN|en)(?=\?|$)/, `/${language}`)
}
