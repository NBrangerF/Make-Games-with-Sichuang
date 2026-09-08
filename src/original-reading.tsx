import { useEffect, useState, type ReactNode } from 'react'
import catalog from '../content/original-articles/catalog.json'
import readingPath from '../content/reading-path.json'
import { MarkdownReading, extractMarkdownOutline } from './markdown-reading'
import { readingHref, readingReturnLanguage, type ReadingLocation, type ReadingScope } from './reading-navigation'
import './original-reading.css'

export type Language = 'zh-CN' | 'en'
export type Article = { id: string; contentVersion: string; title: Record<Language, string>; summary: Record<Language, string> }
const articles: Article[] = catalog.articles
const texts = import.meta.glob<string>('../content/original-articles/*/*.md', { query: '?raw', import: 'default' })
const hrefFor = (id: string | undefined, language: Language, location: ReadingLocation = {}) => readingHref('articles', id, language, location)
const cLabel = (language: Language) => language === 'en' ? 'Back to articles' : '返回文章目录'
const copy = {
  'zh-CN': { title: '从一个好问题，读懂桌游设计', intro: '关于选择、规则、玩家和共同体验的原创文章。打开就能读，每篇都有中文和英文。', collection: '双语阅读', back: '返回文章目录', loading: '正在打开文章……', error: '这篇文章暂时没有打开。', retry: '重新打开', missing: '没有找到这篇文章', empty: '文章正在整理中。', search: '搜索文章', noMatch: '没有匹配的文章。试试“选择”“规则”或“试玩”。', clear: '清除搜索', all: '全部文章', language: '阅读语言', edition: '同一篇内容 · 两种语言', return: '系统学习目录' },
  en: { title: 'Understand tabletop design, one good question at a time', intro: 'Original articles about choices, rules, players, and shared experiences. Read freely in Chinese or English.', collection: 'Bilingual reading', back: 'Back to articles', loading: 'Opening the article…', error: 'The article could not be opened.', retry: 'Try again', missing: 'Article not found', empty: 'Articles are being prepared.', search: 'Search articles', noMatch: 'No matching articles. Try “choices”, “rules”, or “playtest”.', clear: 'Clear search', all: 'All articles', language: 'Reading language', edition: 'One article · Two languages', return: 'Course contents' },
}

export function ArticleBody({ article, language, afterSection, companion, withOutline = false }: { article: Article; language: Language; afterSection?: { number: number; node: ReactNode }; companion?: ReactNode; withOutline?: boolean }) {
  const [body, setBody] = useState<string | null>(null)
  const [failed, setFailed] = useState(false)
  const [attempt, setAttempt] = useState(0)
  const [wide, setWide] = useState(() => window.matchMedia('(min-width: 701px)').matches)
  useEffect(() => {
    const media = window.matchMedia('(min-width: 701px)')
    const sync = () => setWide(media.matches)
    media.addEventListener('change', sync)
    return () => media.removeEventListener('change', sync)
  }, [])
  useEffect(() => {
    let active = true
    setFailed(false)
    setBody(null)
    const load = texts[`../content/original-articles/${article.id}/${language}.md`]
    if (!load) { setFailed(true); return }
    load().then(text => { if (active) setBody(text) }).catch(() => { if (active) setFailed(true) })
    return () => { active = false }
  }, [article.id, language, attempt])
  if (failed) return <div role="alert"><h1>{article.title[language]}</h1><p>{copy[language].error}</p><button onClick={() => setAttempt(value => value + 1)}>{copy[language].retry}</button></div>
  if (body === null) return <p role="status">{copy[language].loading}</p>
  const reading = <article className="original-reading__body"><MarkdownReading source={body} language={language} afterSection={afterSection} /></article>
  if (!withOutline) return reading
  const outline = extractMarkdownOutline(body).filter(item => item.level === 2)
  return <div className="reading-chapter-layout"><aside className="reading-chapter-outline"><details open={wide}><summary>{language === 'en' ? 'In this chapter' : '这一章'}</summary><nav aria-label={language === 'en' ? 'Chapter sections' : '本章小节'}>{outline.map((item, i) => <button key={item.id} onClick={() => { const target = document.getElementById(item.id); target?.scrollIntoView({ behavior: 'auto', block: 'start' }); target?.setAttribute('tabindex', '-1'); target?.focus({ preventScroll: true }) }}><span>{String(i + 1).padStart(2, '0')}</span>{item.label}</button>)}</nav></details></aside>{reading}{companion && <aside className="reading-chapter-companion"><details open={wide}><summary>{language === 'en' ? 'Exercises, tools & real games' : '本章练习、工具与真实案例'}</summary>{companion}</details></aside>}</div>
}

export function OriginalReading({ articleId, language = 'zh-CN', query = '', scope = 'all', returnTo, onFilterChange }: { articleId?: string; language?: Language; query?: string; scope?: ReadingScope; returnTo?: string; onFilterChange: (query: string, scope: ReadingScope) => void }) {
  const filters = { readingQuery: query, readingScope: scope }
  const collectionHref = hrefFor(undefined, language, filters)
  const backHref = returnTo || collectionHref
  const backLabel = returnTo?.startsWith('#course/reading/') ? (language === 'en' ? 'Back to the chapter' : '返回刚才的章节') : cLabel(language)
  const location = { ...filters, readingReturnTo: returnTo }
  const c = copy[language]
  const isCollection = !articleId || articleId === 'all'
  const article = articles.find(item => item.id === articleId)
  const originChapter = returnTo?.match(/^#course\/reading\/([^/]+)\//)?.[1]
  const pathChapter = readingPath.chapters.find(item => item.id === originChapter) || readingPath.chapters.find(item => item.id === articleId || item.related.includes(articleId || ''))
  const needle = query.trim().toLocaleLowerCase()
  const mainIds = new Set(readingPath.chapters.map(chapter => chapter.id))
  const filtered = articles.filter(item => (scope === 'all' || (scope === 'course' ? mainIds.has(item.id) : !mainIds.has(item.id))) && [item.title['zh-CN'], item.title.en, item.summary['zh-CN'], item.summary.en].join(' ').toLocaleLowerCase().includes(needle))
  useEffect(() => {
    document.title = `${isCollection ? c.collection : article?.title[language] || c.missing} · 落桌`
    document.getElementById('main-content')?.focus({ preventScroll: true })
  }, [article, language, isCollection, c])
  return <main id="main-content" tabIndex={-1} lang={language} className="original-reading">
    <nav className="original-reading__bar" aria-label={c.collection}>
      <a href={isCollection ? readingHref('course', undefined, language) : backHref}>{isCollection ? c.return : backLabel}</a>
      <div className="original-reading__languages" aria-label={c.language}>
        {(['zh-CN', 'en'] as const).map(lang => <a key={lang} href={hrefFor(articleId, lang, { ...location, readingReturnTo: readingReturnLanguage(returnTo, lang) })} lang={lang} hrefLang={lang} aria-current={lang === language ? 'page' : undefined}>{lang === 'en' ? 'English' : '中文'}</a>)}
      </div>
    </nav>
    {!isCollection && pathChapter && <p className="original-reading__path"><a href={`#course/reading/${pathChapter.id}/${language}`}>{language === 'en' ? `In the reading path: chapter ${pathChapter.number}` : `在系统阅读中的位置：第${pathChapter.number}章`} · {articles.find(item => item.id === pathChapter.id)?.title[language]}</a></p>}
    {isCollection ? <>
      <header className="original-reading__intro"><p>{c.edition}</p><h1>{c.title}</h1><p>{c.intro}</p></header>
      <div className="original-reading__search"><label htmlFor="original-article-search">{c.search}</label><input id="original-article-search" type="search" value={query} maxLength={200} placeholder={language === 'en' ? 'Choices, rules, playtesting…' : '选择、规则、试玩……'} onChange={event => onFilterChange(event.target.value, scope)} />{query && <button onClick={() => onFilterChange('', scope)}>{c.clear}</button>}</div>
      <div className="original-reading__filters" role="group" aria-label={language === 'en' ? 'Article group' : '文章范围'}>{(['all', 'course', 'essays'] as const).map(value => <button key={value} type="button" aria-pressed={scope === value} onClick={() => onFilterChange(query, value)}>{language === 'en' ? { all: 'All articles', course: 'Course chapters', essays: 'Optional essays' }[value] : { all: '全部', course: '主线章节', essays: '选读' }[value]}</button>)}</div>
      <p role="status" className="original-reading__count">{language === 'en' ? `${filtered.length} ${filtered.length === 1 ? 'article' : 'articles'}` : `${filtered.length} 篇文章`}</p>
      {!articles.length ? <p>{c.empty}</p> : !filtered.length ? <section className="original-reading__empty"><h2>{language === 'en' ? 'No articles found' : '暂时没有找到文章'}</h2><p>{c.noMatch}</p><button onClick={() => onFilterChange('', 'all')}>{language === 'en' ? 'Show all articles' : '显示全部文章'}</button></section> : <ol className="original-reading__list">{filtered.map((item, index) => <li key={item.id}><span className="original-reading__number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span><div><p className="original-reading__kind">{mainIds.has(item.id) ? (language === 'en' ? `Course · Chapter ${readingPath.chapters.find(ch => ch.id === item.id)?.number}` : `主线 · 第 ${readingPath.chapters.find(ch => ch.id === item.id)?.number} 章`) : (language === 'en' ? 'Optional essay' : '选读')}</p><h2><a href={readingHref(mainIds.has(item.id) ? 'course' : 'articles', item.id, language, { readingReturnTo: collectionHref })}>{item.title[language]}</a></h2><p>{item.summary[language]}</p></div></li>)}</ol>}
    </> : article ? <><ArticleBody key={`${article.id}/${language}`} article={article} language={language} /><nav className="original-reading__end" aria-label={language === 'en' ? 'Continue reading' : '继续阅读'}><a href={backHref}>← {backLabel}</a><a href={readingHref('course', pathChapter?.id, language)}>{language === 'en' ? 'Continue along the course →' : '回到主线继续阅读 →'}</a></nav></> : <section><h1>{c.missing}</h1><a href={hrefFor(undefined, language)}>{c.back}</a></section>}
  </main>
}
