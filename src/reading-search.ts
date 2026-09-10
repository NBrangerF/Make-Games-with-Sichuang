import type { ReadingLanguage } from './reading-navigation'

export type SearchSurface = 'library' | 'cases' | 'articles'
export type SearchPassage = { language: ReadingLanguage; text: string; sectionId?: string }
export type SearchDocument = { id: string; passages: SearchPassage[] }
export type SearchIndexData = { version: 1; surface: SearchSurface; documents: SearchDocument[] }
export type SearchSnippet = SearchPassage
export type IndexedDocument = SearchDocument & { folded: string[]; text: string }
export type ReadingSearchIndex = Map<string, IndexedDocument>
export const normalizeSearch = (value: string) => value.normalize('NFKC').toLocaleLowerCase()
export const searchTerms = (query: string) => [...new Set(normalizeSearch(query).trim().split(/\s+/).filter(Boolean))]

export function prepareSearchIndex(data: SearchIndexData, surface: SearchSurface): ReadingSearchIndex {
  if (data.version !== 1 || data.surface !== surface || !Array.isArray(data.documents) || !data.documents.length) throw new Error('Invalid reading index')
  const index: ReadingSearchIndex = new Map()
  for (const document of data.documents) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(document.id) || index.has(document.id) || !Array.isArray(document.passages)) throw new Error('Invalid search document')
    if (!['zh-CN', 'en'].every(language => document.passages.some(p => p.language === language))) throw new Error('Missing search language')
    for (const p of document.passages) {
      if (!['zh-CN', 'en'].includes(p.language) || typeof p.text !== 'string' || !p.text.trim() || (p.sectionId !== undefined && !/^[a-z0-9-]+$/.test(p.sectionId))) throw new Error('Invalid search passage')
    }
    const folded = document.passages.map(p => normalizeSearch(p.text))
    index.set(document.id, { ...document, folded, text: folded.join('\n') })
  }
  return index
}

// A query can use both languages and several passages of the same article.
export function matchesSearch(metadata: string, query: string, document?: IndexedDocument, sectionIds?: string[]) {
  const terms = searchTerms(query)
  const meta = normalizeSearch(metadata)
  const body = sectionIds ? document?.folded.filter((_, i) => sectionIds.includes(document.passages[i].sectionId || '')).join('\n') : document?.text
  return terms.every(term => meta.includes(term) || Boolean(body?.includes(term)))
}

// Keep an exact substring of the published text, including original spelling.
function excerpt(text: string, terms: string[]) {
  const folded = normalizeSearch(text)
  const hit = Math.min(...terms.map(term => folded.indexOf(term)).filter(i => i >= 0))
  // NFKC can change string length. Locate a window using normalized prefixes.
  let offset = 0
  while (offset < text.length && normalizeSearch(text.slice(0, offset)).length < hit) offset++
  const start = Math.max(0, offset - 48)
  const end = Math.min(text.length, Math.max(start + 190, offset + Math.max(...terms.map(t => t.length)) + 35))
  return `${start ? '…' : ''}${text.slice(start, end)}${end < text.length ? '…' : ''}`
}

export function searchSnippets(document: IndexedDocument | undefined, query: string, language: ReadingLanguage, sectionIds?: string[]): SearchSnippet[] {
  const terms = searchTerms(query)
  if (!document || !terms.length) return []
  const candidates = document.passages.flatMap((p, i) => {
    if (sectionIds && !sectionIds.includes(p.sectionId || '')) return []
    const hits = terms.filter(term => document.folded[i].includes(term))
    return hits.length ? [{ passage: p, hits, order: i }] : []
  })
  const selected: SearchSnippet[] = []
  const uncovered = new Set(terms)
  while (candidates.length && selected.length < 2) {
    candidates.sort((a, b) => b.hits.filter(t => uncovered.has(t)).length - a.hits.filter(t => uncovered.has(t)).length || Number(b.passage.language === language) - Number(a.passage.language === language) || a.order - b.order)
    const next = candidates.shift()!
    selected.push({ ...next.passage, text: excerpt(next.passage.text, next.hits) })
    next.hits.forEach(t => uncovered.delete(t))
    if (!uncovered.size) break
  }
  return selected
}
