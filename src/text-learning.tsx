import { useEffect } from 'react'
import path from '../content/reading-path.json'
import catalog from '../content/original-articles/catalog.json'
import { ArticleBody, type Article, type Language } from './original-reading'
import { readingHref, readingReturnLanguage } from './reading-navigation'
import './text-learning.css'
import supportData from '../content/reading-support.json'
import { ReadingWorksheet, type WorksheetId } from './reading-worksheet'
import { toolTitles } from './tool-catalog'
import type { GuideToolId } from './data'
import { designCases } from './case-catalog'
import { CaseTeasers } from './design-cases'

const articles: Article[] = catalog.articles
const heroBase = `${import.meta.env.BASE_URL}assets/reading/river-prototype-`
const copy = {
  'zh-CN': { title: '从一局游戏，开始设计', label: '系统阅读', intro: '从小兔和小刺猬过河开始，看懂一局游戏怎样运转，再一步步设计、测试和改好自己的第一份草稿。', guidance: '7 个部分，28 章。每章都有完整解释，可以顺着读，也可以从目录选一章。练习与设计工作台按需使用。', start: '从第一章读起', library: '全部原创文章', toc: '阅读目录', language: '阅读语言', chapter: '第', chapterEnd: '章', related: '把这个问题再看深一点', previous: '上一章', next: '下一章', finish: '回看整条阅读路径', missing: '没有找到这一章', missingDetail: '请从目录选择一个章节继续阅读。', practice: '想把阅读带到桌上', practiceIntro: '已有游戏的观察方法与设计实践可以帮助你继续探索。你可以按需要使用它们。', practiceLink: '打开可选实践', knowledge: '按问题阅读', connected: '这一部分为何接在这里', count: '章 · 中文 / English' },
  en: { title: 'Start designing, one game at a time', label: 'Systematic reading', intro: 'Help Rabbit and Hedgehog cross a river. Follow how one game works, then develop, test, and revise a first design of your own.', guidance: '7 parts, 28 chapters, with complete explanations. Read in order or choose a chapter. Practice and the design workbench are optional.', start: 'Begin with chapter one', library: 'All original articles', toc: 'Contents', language: 'Reading language', chapter: 'Chapter ', chapterEnd: '', related: 'Take this question further', previous: 'Previous chapter', next: 'Next chapter', finish: 'Return to the complete reading path', missing: 'Chapter not found', missingDetail: 'Choose a chapter from the contents to continue reading.', practice: 'Bringing the reading to the table', practiceIntro: 'Methods for observing games and optional design practice can support further exploration. Use them when they are useful to you.', practiceLink: 'Open optional practice (Chinese)', knowledge: 'Browse by question', connected: 'How this part connects', count: 'chapters · 中文 / English' },
}

export function TextLearning({ chapterId, language = 'zh-CN', returnTo, onOpenTool }: { chapterId?: string; language?: Language; returnTo?: string; onOpenTool: (id: GuideToolId) => void }) {
  const chapterHref = (id: string | undefined, lang: Language) => readingHref('course', id, lang, { readingReturnTo: readingReturnLanguage(returnTo, lang) })
  const c = copy[language]
  const chapterIndex = path.chapters.findIndex(item => item.id === chapterId)
  const chapter = path.chapters[chapterIndex]
  const article = articles.find(item => item.id === chapterId)
  const part = path.parts.find(item => item.id === chapter?.part)
  const previous = path.chapters[chapterIndex - 1]
  const next = path.chapters[chapterIndex + 1]
  const support = supportData.chapters.find(item => item.chapterId === chapterId)
  const contextualCases = support?.caseIds.map(id => designCases.find(item => item.id === id)).filter(item => Boolean(item)) || []
  const fromCases = returnTo?.startsWith('#resources/cases/')
  useEffect(() => {
    document.title = `${chapterId ? article?.title[language] || c.missing : c.label} · 落桌`
    document.getElementById('main-content')?.focus({ preventScroll: true })
  }, [chapterId, article, language, c])
  const chapterList = (compact = false) => path.parts.map((section, partIndex) => <section className="text-learning__part" key={section.id} aria-labelledby={`heading-${section.id}`}>
    <header>{!compact && <span className="text-learning__part-figure" aria-hidden="true">{String(partIndex + 1).padStart(2, '0')}</span>}<p className="text-learning__part-number">{language === 'en' ? 'Part' : '部分'} {String(partIndex + 1).padStart(2, '0')} <span>· {language === 'en' ? 'Chapters' : '第'} {path.chapters.find(item => item.part === section.id)?.number}–{path.chapters.filter(item => item.part === section.id).at(-1)?.number}{language === 'en' ? '' : '章'}</span></p><h2 id={`heading-${section.id}`}>{section.title[language]}</h2>{!compact && <p>{section.introduction[language]}</p>}</header>
    <ol start={path.chapters.find(item => item.part === section.id)!.number}>{path.chapters.filter(item => item.part === section.id).map(item => {
      const entry = articles.find(candidate => candidate.id === item.id)
      return <li key={item.id}><a href={chapterHref(item.id, language)} aria-current={item.id === chapterId ? 'page' : undefined}>{entry?.title[language] || item.id}</a>{entry && !compact && <p>{entry.summary[language]}</p>}</li>
    })}</ol>
  </section>)
  return <main id="main-content" tabIndex={-1} lang={language} className={`text-learning${chapterId ? ' text-learning--chapter' : ''}`}>
    <nav className="original-reading__bar" aria-label={c.label}>
      <div className="original-reading__backlinks">{chapterId && returnTo && <a href={returnTo}>{fromCases ? (language === 'en' ? '← Back to the case' : '← 返回刚才的案例') : (language === 'en' ? '← Back to articles' : '← 返回文章目录')}</a>}<a href={chapterId ? readingHref('course', undefined, language) : `#resources/read/all/${language}`}>{chapterId ? c.toc : c.knowledge}</a></div>
      <div className="original-reading__languages" aria-label={c.language}>{(['zh-CN', 'en'] as const).map(lang => <a key={lang} href={chapterHref(chapterId, lang)} lang={lang} hrefLang={lang} aria-current={lang === language ? 'page' : undefined}>{lang === 'en' ? 'English' : '中文'}</a>)}</div>
    </nav>
    {!chapterId ? <>
      <header className="text-learning__hero"><picture className="text-learning__hero-image"><source srcSet={`${heroBase}640.webp 640w, ${heroBase}960.webp 960w, ${heroBase}1600.webp 1600w`} sizes="(max-width: 700px) 900px, 1400px"/><img src={`${heroBase}1600.webp`} width="1600" height="900" alt="" fetchPriority="high" /></picture><div className="text-learning__hero-copy"><h1>{language === 'zh-CN' ? <><span>从一局游戏，</span><span>开始设计</span></> : c.title}</h1><p className="text-learning__lede">{c.intro}</p><div className="text-learning__entry"><a className="text-learning__begin" href={chapterHref(path.chapters[0].id, language)}>{c.start} <span aria-hidden="true">→</span></a><a href={readingHref('cases', undefined, language)}>{language === 'en' ? 'Explore real games' : '看真实游戏案例'}</a></div></div></header><ol className="text-learning__steps"><li><span>1</span>{language === 'en' ? 'Read one question' : '读懂一个问题'}</li><li><span>2</span>{language === 'en' ? 'Look inside a real game' : '看一局真实游戏'}</li><li><span>3</span>{language === 'en' ? 'Try one small exercise' : '用工具试一小步'}</li></ol><header className="text-learning__contents-intro"><h2>{language === 'en' ? 'Follow one small game through the design process' : '沿着一个小游戏，走过设计过程'}</h2><p>{c.guidance}</p></header>
      <div className="text-learning__contents">{chapterList()}</div>
      <section className="text-learning__case-shelf"><header><h2>{language === 'en' ? 'See the ideas at work in real games' : '把刚读到的想法，放进真实游戏里看'}</h2><a href={readingHref('cases', undefined, language)}>{language === 'en' ? 'All case studies →' : '全部案例 →'}</a></header><CaseTeasers language={language}/></section><aside className="text-learning__practice"><h2>{c.practice}</h2><p>{c.practiceIntro}</p><a href="#course/practice">{c.practiceLink}</a></aside>
    </> : chapter && article ? <>
      <p className="text-learning__eyebrow">{part?.title[language]} · {c.chapter}{chapter.number}{c.chapterEnd} / {path.chapters.length}</p>
      <details className="text-learning__outline"><summary>{c.toc}</summary>{chapterList(true)}</details>
      <ArticleBody key={`${chapterId}/${language}`} article={article} language={language} withOutline afterSection={support ? { number: support.afterSection, node: <ReadingWorksheet sourceId={chapterId!} worksheetId={support.worksheetId as WorksheetId} title={support.title[language]} reason={support.reason[language]} language={language}/> } : undefined} companion={support ? <><h2>{language === 'en' ? 'Try one small step' : '把问题试一小步'}</h2><p>{support.reason[language]}</p><button type="button" className="reading-tool-link" onClick={() => { const exercise = document.getElementById(`worksheet-${chapterId}`); exercise?.scrollIntoView({ block: 'center', behavior: 'auto' }); exercise?.querySelector('textarea')?.focus({ preventScroll: true }) }}>{support.title[language]} <span aria-hidden="true">↓</span></button><button type="button" className="reading-tool-link" onClick={() => onOpenTool(support.toolId as GuideToolId)}>{language === 'en' ? 'Open full workbench (Chinese)' : `打开${toolTitles[support.toolId as GuideToolId]}`} <span aria-hidden="true">↗</span></button>{!!contextualCases.length && <section className="reading-companion-cases"><h2>{language === 'en' ? 'In a real game' : '在真实游戏里看'}</h2>{contextualCases.map(item => item && <a key={item.id} href={readingHref('cases', item.id, language, { readingReturnTo: readingHref('course', chapterId, language) })}><span>{item.game}</span><strong>{item.title[language]}</strong></a>)}</section>}</> : undefined} />
      {!!chapter.related.length && <aside className="text-learning__related"><h2>{c.related}</h2><p>{chapter.relatedPurpose[language]}</p><ul>{chapter.related.map(id => { const item = articles.find(entry => entry.id === id); return item ? <li key={id}><a href={readingHref('articles', id, language, { readingReturnTo: readingHref('course', chapterId, language) })}>{item.title[language]}</a></li> : null })}</ul></aside>}
      <nav className="text-learning__neighbors" aria-label={c.label}>{previous && <a href={chapterHref(previous.id, language)}><span>{c.previous}</span>{articles.find(item => item.id === previous.id)?.title[language]}</a>}{next ? <a className="text-learning__next" href={chapterHref(next.id, language)}><span>{c.next}</span>{articles.find(item => item.id === next.id)?.title[language]}</a> : <a href={chapterHref(undefined, language)}>{c.finish}</a>}</nav>
    </> : <section><h1>{c.missing}</h1><p>{c.missingDetail}</p><a href={chapterHref(undefined, language)}>{c.toc}</a></section>}
  </main>
}
