import { useReadingSearch, SearchLoading, SearchExcerpts } from './reading-search-ui'
import { searchSnippets } from './reading-search'
import { useEffect } from 'react'
import { ArticleBody } from './original-reading'
import { libraryEntries, libraryGroup, kindLabels, questionLabels, searchLibrary } from './design-library-catalog'
import { libraryKinds, libraryQuestions, readingHref, readingReturnLanguage, type LibraryKind, type LibraryQuestion, type ReadingLanguage } from './reading-navigation'
import articles from '../content/original-articles/catalog.json'
import { designCases } from './case-catalog'
import { LibraryLearningGuide, LibraryLessonNavigation } from './library-learning-guide'
import './design-library.css'

const bodies = import.meta.glob<string>('../content/design-library/*/*.md', { query: '?raw', import: 'default' })

export function DesignLibrary({ entryId, language = 'zh-CN', query = '', kind, question, returnTo, onFilterChange }: { entryId?: string; language?: ReadingLanguage; query?: string; kind?: LibraryKind; question?: LibraryQuestion; returnTo?: string; onFilterChange: (query: string, kind?: LibraryKind, question?: LibraryQuestion) => void }) {
  const t = (zh: string, en: string) => language === 'en' ? en : zh
  const collection = !entryId || entryId === 'all'
  const entry = libraryEntries.find(item => item.id === entryId)
  const filters = { readingQuery: query, libraryKind: kind, libraryQuestion: question }
  const listHref = readingHref('library', undefined, language, filters)
  const ownHref = readingHref('library', entryId, language, filters)
  const backHref = returnTo || listHref
  const backLabel = returnTo?.startsWith('#course/reading/') ? t('返回刚才的章节', 'Back to the chapter') : returnTo?.startsWith('#resources/cases/') ? t('返回刚才的案例', 'Back to the case') : t('返回资料库', 'Back to the library')
  const search = useReadingSearch('library', collection && Boolean(query.trim()))
  const filtered = searchLibrary(libraryEntries, query, kind, question, search.index)
  const availableKinds = libraryKinds.filter(value => value === kind || libraryEntries.some(item => libraryGroup(item.kind) === value))
  const availableQuestions = libraryQuestions.filter(value => value === question || libraryEntries.some(item => item.question === value))
  useEffect(() => {
    document.title = `${collection ? t('机制与主题', 'Mechanisms & themes') : entry?.title[language] || t('条目未找到', 'Entry not found')} · 落桌`
    document.getElementById('main-content')?.focus({ preventScroll: true })
  }, [collection, entry, language])
  const related = entry?.relations.flatMap(relation => { const target = libraryEntries.find(item => item.id === relation.targetId); return target ? [target] : [] }) || []
  const companion = entry && <div className="library-connections">
    <h2>{t('接着看什么', 'Where to go next')}</h2>
    {entry.chapterIds.map(id => { const article = articles.articles.find(item => item.id === id); return article && <p key={id}><a href={readingHref('course', id, language, { readingReturnTo: ownHref })}>{article.title[language]}</a></p> })}
    {entry.caseIds.length > 0 && <h3>{t('真实游戏中的做法', 'In real games')}</h3>}
    {entry.caseIds.map(id => { const game = designCases.find(item => item.id === id); return game && <p key={id}><a href={readingHref('cases', id, language, { readingReturnTo: ownHref })}>{game.game} · {game.title[language]}</a></p> })}
    {related.length > 0 && <h3>{t('相关条目', 'Related entries')}</h3>}
    {related.map(item => <p key={item.id}><a href={readingHref('library', item.id, language, { readingReturnTo: ownHref })}>{item.title[language]}</a></p>)}
    <p className="library-reading-note">{t('可以只阅读示范和答案，也可以拿纸笔试一次。', 'Read the worked examples and answers, or try them with paper and a pencil.')}</p>
  </div>
  return <main id="main-content" tabIndex={-1} lang={language} className="original-reading design-library">
    <nav className="original-reading__bar" aria-label={t('资料库导航', 'Library navigation')}>
      <a href={collection ? readingHref('course', undefined, language) : backHref}>{collection ? t('系统学习目录', 'Course contents') : `← ${backLabel}`}</a>
      <div className="original-reading__languages" aria-label={t('阅读语言', 'Reading language')}>{(['zh-CN', 'en'] as const).map(lang => <a key={lang} href={readingHref('library', entryId, lang, { ...filters, readingReturnTo: readingReturnLanguage(returnTo, lang) })} lang={lang} hrefLang={lang} aria-current={lang === language ? 'page' : undefined}>{lang === 'en' ? 'English' : '中文'}</a>)}</div>
    </nav>
    {collection ? <>
      <header className="original-reading__intro"><p>{t('看懂规则怎样工作', 'See how the rules work')}</p><h1>{t('从一个具体过程，学机制与主题', 'Learn mechanisms and themes through concrete play')}</h1><p>{t('先走完一个选择，再比较另一种规则。每个条目都有完整示范、边界和自查答案。', 'Follow a complete choice, then compare another rule. Each entry includes a worked example, its limits, and a check with answers.')}</p></header>
      <nav className="library-other-reading" aria-label={t('其他阅读方式', 'Other ways to read')}><a href={readingHref('articles', undefined, language)}>{t('按问题阅读原创文章', 'Browse original essays by question')} →</a><a href={readingHref('cases', undefined, language)}>{t('查看真实游戏分析', 'Explore real-game analyses')} →</a></nav>
      {!query.trim() && !question && (!kind || kind === 'lessons') && <LibraryLearningGuide language={language}/>}
      <div className="original-reading__search"><label htmlFor="design-library-search">{t('搜索名称、设计问题或正文', 'Search names, design questions, or article text')}</label><input id="design-library-search" type="search" value={query} maxLength={200} placeholder={t('工放、Worker Placement、风险…', 'Worker placement, risk, 工放…')} onChange={event => onFilterChange(event.target.value, kind, question)} />{query && <button type="button" onClick={() => onFilterChange('', kind, question)}>{t('清除搜索', 'Clear search')}</button>}</div>
      {availableKinds.length > 1 && <div className="original-reading__filters" role="group" aria-label={t('内容类型', 'Content type')}><button type="button" aria-pressed={!kind} onClick={() => onFilterChange(query, undefined, question)}>{t('全部类型', 'All types')}</button>{availableKinds.map(value => <button key={value} type="button" aria-pressed={kind === value} onClick={() => onFilterChange(query, value, question)}>{kindLabels[value][language]}</button>)}</div>}
      <div className="library-question-filter"><label htmlFor="library-question">{t('按设计问题找', 'Find by design question')}</label><select id="library-question" value={question || ''} onChange={event => onFilterChange(query, kind, event.target.value as LibraryQuestion || undefined)}><option value="">{t('全部问题', 'All questions')}</option>{availableQuestions.map(value => <option key={value} value={value}>{questionLabels[value][language]}</option>)}</select></div>
      <p className="reading-search-hint">{t('同时搜索中英文正文；多个词可以用空格分开。', 'Search both languages together; separate several terms with spaces.')}</p>
      {search.waiting ? <SearchLoading failed={search.failed} retry={search.retry} language={language}/> : <>
      <p role="status" className="original-reading__count">{t(`${filtered.length} 个条目`, `${filtered.length} ${filtered.length === 1 ? 'entry' : 'entries'}`)}</p>
      {filtered.length ? <ol className="original-reading__list">{filtered.map((item, index) => <li key={item.id}><span className="original-reading__number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span><div><p className="original-reading__kind">{kindLabels[libraryGroup(item.kind)][language]} · {questionLabels[item.question][language]}</p><h2><a href={readingHref('library', item.id, language, { ...filters, readingReturnTo: listHref })}>{item.title[language]}</a></h2><p>{item.summary[language]}</p><SearchExcerpts snippets={searchSnippets(search.index?.get(item.id), query, language)} query={query} language={language}/><p className="library-alternate-title" lang={language === 'en' ? 'zh-CN' : 'en'}>{item.title[language === 'en' ? 'zh-CN' : 'en']}</p></div></li>)}</ol> : <section className="original-reading__empty"><h2>{t('没有匹配的条目', 'No matching entries')}</h2><p>{t('可以试试中英文名称，或者清除筛选。', 'Try a Chinese or English name, or clear the filters.')}</p><button type="button" onClick={() => onFilterChange('', undefined, undefined)}>{t('查看全部条目', 'Show all entries')}</button></section>}
      </>}
      <p className="library-scope">{t('这是持续扩充的原创教学库。BGG 链接用于分类对照；每篇都明确自己的规则与范围。', 'This original teaching library is growing. BGG links provide classification references; each entry states its own rules and scope.')}</p>
    </> : entry ? <><p className="library-entry-kind">{kindLabels[libraryGroup(entry.kind)][language]} · {questionLabels[entry.question][language]}</p><ArticleBody key={`${entry.id}/${language}`} article={entry} language={language} bodyLoader={bodies[`../content/design-library/${entry.id}/${language}.md`]} allowSourceLinks withOutline companion={companion}/><LibraryLessonNavigation id={entry.id} language={language} returnTo={backHref}/><nav className="original-reading__end" aria-label={t('继续阅读', 'Continue reading')}><a href={backHref}>← {backLabel}</a><a href={listHref}>{t('全部条目', 'All entries')} →</a></nav></> : <section><h1>{t('没有找到这个条目', 'Entry not found')}</h1><p>{t('链接可能已经改变。可以从目录继续查找。', 'The link may have changed. Continue from the library.')}</p><a href={listHref}>{t('返回资料库', 'Back to the library')}</a></section>}
  </main>
}
