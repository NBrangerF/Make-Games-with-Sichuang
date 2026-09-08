import { useEffect, useState } from 'react'
import { designCases, caseCategories, type CaseCategory, type DesignCase } from './case-catalog'
import { CaseDiagram, DeckExperiment, SimultaneousExperiment } from './case-diagrams'
import { MarkdownReading } from './markdown-reading'
import { readingHref, readingReturnLanguage, type ReadingLanguage } from './reading-navigation'
import articleCatalog from '../content/original-articles/catalog.json'
import path from '../content/reading-path.json'
import type { GuideToolId } from './data'
import { toolTitles } from './tool-catalog'

const texts = import.meta.glob<string>('../content/design-cases/*/*.md', { query: '?raw', import: 'default' })
const caseTools: Record<string, GuideToolId> = { carcassonne: 'decision-trace', pandemic: 'shared-decision', dominion: 'balance-pass', 'six-nimmt': 'decision-trace', hanabi: 'shared-decision', wingspan: 'theme-review' }

function CaseBody({ entry, language }: { entry: DesignCase; language: ReadingLanguage }) {
  const [body, setBody] = useState<string | null>(null)
  const [failed, setFailed] = useState(false)
  const [attempt, setAttempt] = useState(0)
  useEffect(() => {
    let active = true
    setBody(null); setFailed(false)
    const load = texts[`../content/design-cases/${entry.id}/${language}.md`]
    if (!load) { setFailed(true); return }
    load().then(value => { if (active) setBody(value.replace(/^# .+\r?\n/, '')) }).catch(() => { if (active) setFailed(true) })
    return () => { active = false }
  }, [entry.id, language, attempt])
  if (failed) return <section role="alert"><p>{language === 'en' ? 'This case could not be opened.' : '案例暂时未能打开。'}</p><button onClick={() => setAttempt(value => value + 1)}>{language === 'en' ? 'Try again' : '重新打开'}</button></section>
  if (body === null) return <p role="status">{language === 'en' ? 'Opening the analysis…' : '正在打开分析……'}</p>
  const experiment = entry.id === 'dominion' ? <DeckExperiment language={language}/> : entry.id === 'six-nimmt' ? <SimultaneousExperiment language={language}/> : undefined
  return <article className="original-reading__body case-reading-body"><MarkdownReading source={body} language={language} allowSourceLinks afterSection={experiment ? { number: 2, node: experiment } : undefined}/></article>
}

export function CaseTeasers({ language, from, ids }: { language: ReadingLanguage; from?: string; ids?: string[] }) {
  const entries = ids ? ids.map(id => designCases.find(item => item.id === id)).filter((item): item is DesignCase => Boolean(item)) : designCases
  return <div className="case-teasers">{entries.map(entry => <a key={entry.id} className={`case-teaser case-teaser--${entry.category}`} href={readingHref('cases', entry.id, language, { readingReturnTo: from })}><CaseDiagram id={entry.id} language={language} compact/><div><p>{entry.game} <span>{caseCategories[entry.category][language]}</span></p><h3>{entry.title[language]}</h3><span className="case-teaser__read">{language === 'en' ? 'Read the analysis' : '阅读分析'} <span aria-hidden="true">↗</span></span></div></a>)}</div>
}

export function DesignCases({ caseId, language = 'zh-CN', query = '', category, returnTo, onFilterChange, onOpenTool }: { caseId?: string; language?: ReadingLanguage; query?: string; category?: CaseCategory; returnTo?: string; onFilterChange: (query: string, category?: CaseCategory) => void; onOpenTool: (id: GuideToolId) => void }) {
  const t = (zh: string, en: string) => language === 'en' ? en : zh
  const entry = designCases.find(item => item.id === caseId)
  const collection = !caseId || caseId === 'all'
  const filters = { readingQuery: query, caseCategory: category }
  const listHref = readingHref('cases', undefined, language, filters)
  const ownHref = readingHref('cases', caseId, language, filters)
  const backHref = returnTo || listHref
  const fromChapter = returnTo?.startsWith('#course/reading/')
  const needle = query.trim().toLocaleLowerCase()
  const filtered = designCases.filter(item => (!category || item.category === category) && [item.game, item.title.en, item.title['zh-CN'], item.summary.en, item.summary['zh-CN']].join(' ').toLocaleLowerCase().includes(needle))
  useEffect(() => { document.title = `${collection ? t('案例研究', 'Case studies') : entry?.title[language] || t('案例未找到', 'Case not found')} · 落桌`; document.getElementById('main-content')?.focus({ preventScroll: true }) }, [caseId, collection, entry, language])
  return <main id="main-content" tabIndex={-1} lang={language} className={`design-cases${collection ? '' : ' design-cases--detail'}`}>
    <nav className="original-reading__bar" aria-label={t('案例导航', 'Case navigation')}><a href={collection ? readingHref('course', undefined, language) : backHref}>{collection ? t('系统学习目录', 'Course contents') : fromChapter ? t('← 返回刚才的章节', '← Back to the chapter') : t('← 返回案例目录', '← Back to cases')}</a><div className="original-reading__languages" aria-label={t('阅读语言', 'Reading language')}>{(['zh-CN', 'en'] as const).map(lang => <a key={lang} href={readingHref('cases', caseId, lang, { ...filters, readingReturnTo: readingReturnLanguage(returnTo, lang) })} lang={lang} hrefLang={lang} aria-current={lang === language ? 'page' : undefined}>{lang === 'en' ? 'English' : '中文'}</a>)}</div></nav>
    {collection ? <><header className="case-library-intro"><h1>{t('拆开一局游戏，看见设计选择', 'Look inside a game. See its design choices.')}</h1><p>{t('从整局、机制与主题三个角度，把规则和玩家体验连起来。', 'Connect rules and player experience through whole games, mechanisms, and themes.')}</p></header><div className="case-library-search"><label htmlFor="case-search">{t('搜索游戏或设计问题', 'Search games or design questions')}</label><input id="case-search" type="search" value={query} maxLength={200} placeholder={t('Carcassonne、信息、主题…', 'Carcassonne, information, theme…')} onChange={event => onFilterChange(event.target.value, category)}/>{query && <button type="button" onClick={() => onFilterChange('', category)}>{t('清除搜索', 'Clear search')}</button>}</div><div className="case-library-filters" role="group" aria-label={t('分析角度', 'Analysis perspective')}>{(['all', 'game', 'mechanism', 'theme'] as const).map(value => <button key={value} type="button" aria-pressed={(category || 'all') === value} onClick={() => onFilterChange(query, value === 'all' ? undefined : value)}>{caseCategories[value][language]}</button>)}</div><p className="case-library-count" role="status">{t(`${filtered.length} 篇案例`, `${filtered.length} case ${filtered.length === 1 ? 'study' : 'studies'}`)}</p>{filtered.length ? <div className="case-library-entries">{filtered.map((item, index) => <section key={item.id} className={`case-library-entry${index === 0 && !query && !category ? ' case-library-entry--featured' : ''}`}><a className="case-library-entry__visual" href={readingHref('cases', item.id, language, { readingReturnTo: listHref })} aria-label={item.title[language]}><CaseDiagram id={item.id} language={language} compact/></a><div><p className="case-library-entry__game">{item.game} <span>{caseCategories[item.category][language]}</span></p><h2><a href={readingHref('cases', item.id, language, { readingReturnTo: listHref })}>{item.title[language]}</a></h2><p>{item.summary[language]}</p><a className="case-library-entry__read" href={readingHref('cases', item.id, language, { readingReturnTo: listHref })}>{t('阅读分析', 'Read the analysis')} <span aria-hidden="true">→</span></a></div></section>)}</div> : <section className="case-library-empty"><h2>{t('还没有匹配的案例', 'No matching cases')}</h2><p>{t('试试游戏英文名，或者换一个分析角度。', 'Try the game’s English name or another perspective.')}</p><button onClick={() => onFilterChange('', undefined)}>{t('查看全部案例', 'Show all cases')}</button></section>}</> : entry ? <><header className="case-detail-intro"><p>{entry.game} <span>{caseCategories[entry.category][language]}</span></p><h1>{entry.title[language]}</h1><p>{entry.summary[language]}</p></header><div className="case-detail-layout"><div><CaseDiagram id={entry.id} language={language}/><CaseBody key={`${entry.id}/${language}`} entry={entry} language={language}/></div><aside className="case-detail-companion"><h2>{t('把分析带回自己的设计', 'Bring the analysis to your design')}</h2><p>{t('选一处规则关系，在自己的草稿里比较它带来的机会与代价。', 'Choose one rule relationship and compare its opportunities and costs in your own draft.')}</p><button className="reading-tool-link" onClick={() => onOpenTool(caseTools[entry.id])}>{language === 'en' ? 'Open related workbench (Chinese)' : `打开${toolTitles[caseTools[entry.id]]}`} <span aria-hidden="true">↗</span></button><h2>{t('回到主线', 'In the reading path')}</h2><ol>{entry.chapterIds.map(id => { const article = articleCatalog.articles.find(item => item.id === id); const chapter = path.chapters.find(item => item.id === id); return article && chapter ? <li key={id}><span>{t(`第 ${chapter.number} 章`, `Chapter ${chapter.number}`)}</span><a href={readingHref('course', id, language, { readingReturnTo: ownHref })}>{article.title[language]}</a></li> : null })}</ol></aside></div><section className="case-source-scope"><h2>{t('本篇使用的版本与出处', 'Editions and sources used')}</h2><ul>{entry.sources.map(source => <li key={source.url}><a href={source.url} rel="noreferrer">{source.label}</a><p>{source.edition}{source.locator ? ` · ${source.locator}` : ''}</p></li>)}</ul></section><nav className="original-reading__end" aria-label={t('继续探索', 'Continue exploring')}><a href={backHref}>{fromChapter ? t('← 回到刚才的章节', '← Back to the chapter') : t('← 回到案例目录', '← Back to cases')}</a><a href={listHref}>{t('全部案例 →', 'All cases →')}</a></nav></> : <section><h1>{t('没有找到这篇案例', 'Case not found')}</h1><a href={listHref}>{t('查看全部案例', 'Browse all cases')}</a></section>}
  </main>
}
