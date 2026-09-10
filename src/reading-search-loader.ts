import libraryUrl from '../content/reading-search/library.json?url'
import casesUrl from '../content/reading-search/cases.json?url'
import articlesUrl from '../content/reading-search/articles.json?url'
import { prepareSearchIndex, type ReadingSearchIndex, type SearchSurface } from './reading-search'

const urls = { library: libraryUrl, cases: casesUrl, articles: articlesUrl }
const pending = new Map<SearchSurface, Promise<ReadingSearchIndex>>()

export function loadReadingSearch(surface: SearchSurface): Promise<ReadingSearchIndex> {
  const cached = pending.get(surface)
  if (cached) return cached
  const request = fetch(urls[surface], { signal: AbortSignal.timeout(15000) }).then(async response => {
    if (!response.ok) throw new Error('Search index unavailable')
    return prepareSearchIndex(await response.json(), surface)
  }).catch(error => { pending.delete(surface); throw error })
  pending.set(surface, request)
  return request
}
