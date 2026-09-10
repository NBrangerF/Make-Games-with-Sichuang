import { useReadingSearch, SearchLoading, SearchExcerpts } from './reading-search-ui'
import { searchSnippets } from './reading-search'
import { useEffect, useState } from 'react'
import { designCases, caseCategories, type DesignCase } from './case-catalog'
import { casePerspectiveLabels, caseSectionLabel, caseSectionTarget, searchCases, type CaseFilters } from './case-discovery'
import { CaseDiagram, DeckExperiment, SimultaneousExperiment } from './case-diagrams'
import { MarkdownReading } from './markdown-reading'
import { casePerspectives, readingHref, readingReturnLanguage, type CasePerspective, type ReadingLanguage } from './reading-navigation'
import articleCatalog from '../content/original-articles/catalog.json'
import path from '../content/reading-path.json'
import type { GuideToolId } from './data'
import { toolTitles } from './tool-catalog'
import { libraryEntries } from './design-library-catalog'

const texts = import.meta.glob<string>('../content/design-cases/*/*.md', { query: '?raw', import: 'default' })
const caseTools: Record<string, GuideToolId> = { carcassonne: 'decision-trace', pandemic: 'shared-decision', dominion: 'balance-pass', 'six-nimmt': 'decision-trace', hanabi: 'shared-decision', wingspan: 'theme-review', agricola: 'decision-trace', 'cant-stop': 'decision-trace', 'for-sale': 'decision-trace', 'el-grande': 'decision-trace', quacks: 'balance-pass', 'ticket-to-ride': 'decision-trace', 'modern-art': 'balance-pass', 'the-crew': 'shared-decision', azul: 'decision-trace', root: 'decision-trace', radlands: 'balance-pass', 'spirit-island': 'shared-decision' }

function RelatedLibrary({ caseId, language, from }: { caseId: string; language: ReadingLanguage; from: string }) {
  const related = libraryEntries.filter(item => item.caseIds.includes(caseId))
  if (!related.length) return null
  return <section><h2>{language === 'en' ? 'Explore the design ideas' : '继续理解这些设计关系'}</h2><ul>{related.map(item => <li key={item.id}><a href={readingHref('library', item.id, language, { readingReturnTo: from })}>{item.title[language]}</a></li>)}</ul></section>
}

function CaseBody({ entry, language, sectionId }: { entry: DesignCase; language: ReadingLanguage; sectionId?: string }) {
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
  useEffect(() => {
    if (!body || !sectionId || !entry.sections.some(section => section.id === sectionId)) return
    const heading = document.getElementById(caseSectionTarget(sectionId))
    heading?.scrollIntoView({ block: 'start', behavior: 'instant' })
    heading?.focus({ preventScroll: true })
  }, [body, sectionId, entry])
  if (failed) return <section role="alert"><p>{language === 'en' ? 'This case could not be opened.' : '案例暂时未能打开。'}</p><button onClick={() => setAttempt(value => value + 1)}>{language === 'en' ? 'Try again' : '重新打开'}</button></section>
  if (body === null) return <p role="status">{language === 'en' ? 'Opening the analysis…' : '正在打开分析……'}</p>
  const experiment = entry.id === 'dominion' ? <DeckExperiment language={language}/> : entry.id === 'six-nimmt' ? <SimultaneousExperiment language={language}/> : undefined
  return <article className="original-reading__body case-reading-body"><MarkdownReading source={body} language={language} allowSourceLinks headingIds={Object.fromEntries(entry.sections.map(section => [section.title[language], caseSectionTarget(section.id)]))} afterSection={experiment ? { number: 2, node: experiment } : undefined}/></article>
}

export function CaseTeasers({ language, from, ids }: { language: ReadingLanguage; from?: string; ids?: string[] }) {
  const entries = ids ? ids.map(id => designCases.find(item => item.id === id)).filter((item): item is DesignCase => Boolean(item)) : designCases
  return <div className="case-teasers">{entries.map(entry => <a key={entry.id} className={`case-teaser case-teaser--${entry.category}`} href={readingHref('cases', entry.id, language, { readingReturnTo: from })}><CaseDiagram id={entry.id} language={language} compact/><div><p>{entry.game} <span>{caseCategories[entry.category][language]}</span></p><h3>{entry.title[language]}</h3><span className="case-teaser__read">{language === 'en' ? 'Read the analysis' : '阅读分析'} <span aria-hidden="true">↗</span></span></div></a>)}</div>
}

export function DesignCases({ caseId, language = 'zh-CN', query = '', category, perspective, authorOnly, sectionId, returnTo, onFilterChange, onOpenTool }: CaseFilters & { caseId?: string; language?: ReadingLanguage; sectionId?: string; returnTo?: string; onFilterChange: (filters: CaseFilters) => void; onOpenTool: (id: GuideToolId) => void }) {
  const t = (zh: string, en: string) => language === 'en' ? en : zh
  const entry = designCases.find(item => item.id === caseId)
  const collection = !caseId || caseId === 'all'
  const filters = { readingQuery: query, caseCategory: category, casePerspective: perspective, caseAuthorOnly: authorOnly }
  const controls = { query, category, perspective, authorOnly }
  const update = (change: Partial<CaseFilters>) => onFilterChange({ ...controls, ...change })
  const listHref = readingHref('cases', undefined, language, filters)
  const ownHref = readingHref('cases', caseId, language, { ...filters, caseSection: sectionId })
  const backHref = returnTo || listHref
  const fromLibrary = returnTo?.startsWith('#resources/library/')
  const fromChapter = returnTo?.startsWith('#course/reading/')
  const backLabel = fromLibrary ? t('← 返回刚才的条目', '← Back to the library entry') : fromChapter ? t('← 返回刚才的章节', '← Back to the chapter') : t('← 返回案例目录', '← Back to cases')
  const search = useReadingSearch('cases', collection && Boolean(query.trim()))
  const filtered = searchCases(designCases, controls, search.index)
  const sectionHref = (id: string) => readingHref('cases', caseId, language, { ...filters, caseSection: id, readingReturnTo: returnTo })
  useEffect(() => {
    document.title = `${collection ? t('案例研究', 'Case studies') : entry?.title[language] || t('案例未找到', 'Case not found')} · 落桌`
    document.getElementById('main-content')?.focus({ preventScroll: true })
  }, [caseId, collection, entry, language])
  return <main id="main-content" tabIndex={-1} lang={language} className={`design-cases${collection ? '' : ' design-cases--detail'}`}>
    <nav className="original-reading__bar" aria-label={t('案例导航', 'Case navigation')}>
      <a href={collection ? readingHref('course', undefined, language) : backHref}>{collection ? t('系统学习目录', 'Course contents') : backLabel}</a>
      <div className="original-reading__languages" aria-label={t('阅读语言', 'Reading language')}>{(['zh-CN', 'en'] as const).map(lang => <a key={lang} href={readingHref('cases', caseId, lang, { ...filters, caseSection: sectionId, readingReturnTo: readingReturnLanguage(returnTo, lang) })} lang={lang} hrefLang={lang} aria-current={lang === language ? 'page' : undefined}>{lang === 'en' ? 'English' : '中文'}</a>)}</div>
    </nav>
    {collection ? <>
      <header className="case-library-intro"><h1>{t('拆开一局游戏，看见设计选择', 'Look inside a game. See its design choices.')}</h1><p>{t('从一个具体问题进入案例，比较规则怎样改变玩家的选择。每篇都有多个分析角度，可以直接读到相关段落。', 'Start with a design question and compare how rules shape players’ choices. Each case offers several perspectives, with links to the relevant sections.')}</p></header>
      <div className="case-library-search"><label htmlFor="case-search">{t('搜索游戏、设计问题或正文', 'Search games, design questions, or article text')}</label><input id="case-search" type="search" value={query} maxLength={200} placeholder={t('Root 木材、信息、theme…', 'Root wood, information, 主题…')} onChange={event => update({ query: event.target.value })}/>{query && <button type="button" onClick={() => update({ query: '' })}>{t('清除搜索', 'Clear search')}</button>}</div>
      <div className="case-discovery-controls">
        <div><label htmlFor="case-perspective">{t('你想研究什么？', 'What do you want to explore?')}</label><select id="case-perspective" value={perspective || ''} onChange={event => update({ perspective: event.target.value as CasePerspective || undefined })}><option value="">{t('全部设计问题', 'All design questions')}</option>{casePerspectives.map(value => <option key={value} value={value}>{casePerspectiveLabels[value][language]}</option>)}</select></div>
        <label className="case-author-filter"><input type="checkbox" checked={Boolean(authorOnly)} onChange={event => update({ authorOnly: event.target.checked })}/>{t('含设计者开发回顾', 'Includes a designer’s development account')}</label>
      </div>
      <p className="case-discovery-note">{t('开发回顾来自具名作者的访谈或记录。其他推演与对照属于本站分析。', 'Development accounts come from named designers’ interviews or records. The other comparisons and inferences are our analysis.')}</p>
      <details className="case-category-options" open={Boolean(category)}><summary>{t('按篇章侧重筛选', 'Filter by article focus')}</summary><div className="case-library-filters" role="group" aria-label={t('篇章侧重', 'Article focus')}>{(['all', 'game', 'mechanism', 'theme'] as const).map(value => <button key={value} type="button" aria-pressed={(category || 'all') === value} onClick={() => update({ category: value === 'all' ? undefined : value })}>{caseCategories[value][language]}</button>)}</div></details>
      <p className="reading-search-hint">{t('同时搜索中英文正文；选择设计问题后，只搜索该角度的分析。', 'Search both languages. A design-question filter limits body matches to that perspective.')}</p>
      {search.waiting ? <SearchLoading failed={search.failed} retry={search.retry} language={language}/> : <>
      <p className="case-library-count" role="status">{t(`${filtered.length} 篇案例`, `${filtered.length} case ${filtered.length === 1 ? 'study' : 'studies'}`)}</p>
      {filtered.length ? <div className="case-library-entries">{filtered.map(({ entry: item, sections }, index) => {
        const href = readingHref('cases', item.id, language, { readingReturnTo: listHref })
        const readSection = (id: string) => readingHref('cases', item.id, language, { caseSection: id, readingReturnTo: listHref })
        return <section key={item.id} className={`case-library-entry${index === 0 && !query && !category && !perspective && !authorOnly ? ' case-library-entry--featured' : ''}`}>
          <a className="case-library-entry__visual" href={href} aria-label={item.title[language]}><CaseDiagram id={item.id} language={language} compact/></a>
          <div><p className="case-library-entry__game">{item.game} <span>{caseCategories[item.category][language]}</span></p><h2><a href={href}>{item.title[language]}</a></h2><p>{item.summary[language]}</p>
            <SearchExcerpts snippets={searchSnippets(search.index?.get(item.id), query, language, perspective ? item.sections.filter(s => s.topics.includes(perspective)).map(s => s.id) : undefined)} query={query} language={language} sectionHref={readSection}/>
            <ul className="case-entry-sections" aria-label={t('从具体问题开始读', 'Read from a specific question')}>{sections.map(section => <li key={section.id}><a href={readSection(section.id)}>{caseSectionLabel(section.title[language])}</a></li>)}</ul>
            {item.designerAccount && <p className="case-designer-account"><a href={readSection(item.designerAccount.sectionId)}>{t('开发回顾：', 'Development account: ')}{item.designerAccount.author}</a></p>}
            <a className="case-library-entry__read" href={href}>{t('阅读全文', 'Read the full analysis')} <span aria-hidden="true">→</span></a>
          </div>
        </section>
      })}</div> : <section className="case-library-empty"><h2>{t('还没有匹配的案例', 'No matching cases')}</h2><p>{t('试试游戏英文名，或者清除部分筛选。', 'Try the game’s English name or clear some filters.')}</p><button onClick={() => onFilterChange({ query: '' })}>{t('查看全部案例', 'Show all cases')}</button></section>}
      </>}
    </> : entry ? <>
      <header className="case-detail-intro"><p>{entry.game} <span>{caseCategories[entry.category][language]}</span></p><h1>{entry.title[language]}</h1><p>{entry.summary[language]}</p></header>
      {sectionId && !entry.sections.some(section => section.id === sectionId) && <p role="status">{t('没有找到链接指定的段落，可以从下面的目录继续阅读。', 'The linked section was not found. Continue from the contents below.')}</p>}
      <nav className="case-section-nav" aria-label={t('本篇分析目录', 'Analysis contents')}><h2>{t('从哪里开始读', 'Where to start reading')}</h2><ol>{entry.sections.map(section => <li key={section.id}><a href={sectionHref(section.id)} aria-current={section.id === sectionId ? 'location' : undefined}>{caseSectionLabel(section.title[language])}</a></li>)}</ol>{entry.designerAccount && <p>{t('本篇开发回顾：', 'Development account in this case: ')}<a href={sectionHref(entry.designerAccount.sectionId)}>{entry.designerAccount.author}</a></p>}</nav>
      <div className="case-detail-layout"><div><CaseDiagram id={entry.id} language={language}/><CaseBody key={`${entry.id}/${language}`} entry={entry} language={language} sectionId={sectionId}/></div>
        <aside className="case-detail-companion"><h2>{t('把分析带回自己的设计', 'Bring the analysis to your design')}</h2><p>{t('选一处规则关系，在自己的草稿里比较它带来的机会与代价。', 'Choose one rule relationship and compare its opportunities and costs in your own draft.')}</p><button className="reading-tool-link" onClick={() => onOpenTool(caseTools[entry.id])}>{language === 'en' ? 'Open related workbench (Chinese)' : `打开${toolTitles[caseTools[entry.id]]}`} <span aria-hidden="true">↗</span></button><h2>{t('回到主线', 'In the reading path')}</h2><ol>{entry.chapterIds.map(id => { const article = articleCatalog.articles.find(item => item.id === id); const chapter = path.chapters.find(item => item.id === id); return article && chapter ? <li key={id}><span>{t(`第 ${chapter.number} 章`, `Chapter ${chapter.number}`)}</span><a href={readingHref('course', id, language, { readingReturnTo: ownHref })}>{article.title[language]}</a></li> : null })}</ol><RelatedLibrary caseId={entry.id} language={language} from={ownHref}/></aside>
      </div>
      <section className="case-source-scope"><h2>{t('本篇使用的版本与出处', 'Editions and sources used')}</h2><ul>{entry.sources.map(source => <li key={source.url}><a href={source.url} rel="noreferrer">{source.label}</a><p>{source.edition}{source.locator ? ` · ${source.locator}` : ''}</p></li>)}</ul></section>
      <nav className="original-reading__end" aria-label={t('继续探索', 'Continue exploring')}><a href={backHref}>{backLabel}</a><a href={listHref}>{t('全部案例 →', 'All cases →')}</a></nav>
    </> : <section><h1>{t('没有找到这篇案例', 'Case not found')}</h1><a href={listHref}>{t('查看全部案例', 'Browse all cases')}</a></section>}
  </main>
}
