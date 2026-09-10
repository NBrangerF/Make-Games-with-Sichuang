import { useEffect, useState } from 'react'
import type { ReadingLanguage } from './reading-navigation'
import { loadReadingSearch } from './reading-search-loader'
import { searchTerms, type ReadingSearchIndex, type SearchSnippet, type SearchSurface } from './reading-search'
import './reading-search.css'

export function useReadingSearch(surface: SearchSurface, enabled: boolean) {
  const [state, setState] = useState<{ surface: SearchSurface; index?: ReadingSearchIndex; failed?: boolean }>({ surface })
  const [attempt, setAttempt] = useState(0)
  useEffect(() => {
    if (!enabled || (state.surface === surface && state.index)) return
    let active = true
    setState({ surface })
    loadReadingSearch(surface).then(index => { if (active) setState({ surface, index }) }).catch(() => { if (active) setState({ surface, failed: true }) })
    return () => { active = false }
    // A retry starts a fresh failed request; successful indexes remain cached.
  }, [surface, enabled, attempt])
  const current = state.surface === surface ? state : undefined
  return { index: current?.index, waiting: enabled && !current?.index, failed: enabled && Boolean(current?.failed), retry: () => { setState({ surface }); setAttempt(value => value + 1) } }
}

export function SearchLoading({ failed, retry, language }: { failed: boolean; retry: () => void; language: ReadingLanguage }) {
  return failed ? <section className="reading-search-state" role="alert"><p>{language === 'en' ? 'Full-text search could not load. Retry, or clear the search to browse.' : '正文搜索暂时未能加载。可以重试，或清除搜索后浏览目录。'}</p><button type="button" onClick={retry}>{language === 'en' ? 'Retry search' : '重试搜索'}</button></section> : <p className="reading-search-state" role="status">{language === 'en' ? 'Searching the Chinese and English articles…' : '正在搜索中英文正文……'}</p>
}

function Highlight({ text, query }: { text: string; query: string }) {
  const terms = searchTerms(query).map(term => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  if (!terms.length) return text
  const pattern = new RegExp(`(${terms.join('|')})`, 'giu')
  return text.split(pattern).map((part, i) => i % 2 ? <mark key={i}>{part}</mark> : part)
}

export function SearchExcerpts({ snippets, query, language, sectionHref }: { snippets: SearchSnippet[]; query: string; language: ReadingLanguage; sectionHref?: (id: string) => string }) {
  return <>{snippets.map((p, i) => <div className="reading-search-excerpt" key={`${p.language}/${i}`}><p className="reading-search-excerpt__label">{language === 'en' ? 'In the article' : '正文命中'} · {p.language === 'en' ? 'English' : '中文'}{p.sectionId && sectionHref && <> · <a href={sectionHref(p.sectionId)}>{language === 'en' ? 'Read this section' : '阅读这段分析'}</a></>}</p><p lang={p.language}><Highlight text={p.text} query={query}/></p></div>)}</>
}
