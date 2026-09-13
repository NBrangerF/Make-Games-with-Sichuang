import { caseGameName } from './case-game-name'
import { libraryEntries } from './design-library-catalog'
import { useEffect } from 'react'
import { chapterForTrack, pathFor, readingTrackFor } from './reading-paths'
import type { ReadingTrack } from './reading-navigation'
import { RacePrototype } from './race-prototype'
import { RaceComparisons } from './race-comparisons'
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
const riverHeroBase = `${import.meta.env.BASE_URL}assets/reading/river-prototype-`
const copy = {
  'zh-CN': { title: '从一局游戏，开始设计', label: '系统阅读', intro: '从小兔和小刺猬过河开始，看懂一局游戏怎样运转，再一步步设计、测试和改好自己的第一份草稿。', guidance: '7 个部分，28 章，跟着一个草稿走完设计过程。可以顺着读，也可以挑一章；想动手时，再展开小练习。', start: '从第一章读起', library: '全部原创文章', toc: '阅读目录', language: '阅读语言', chapter: '第', chapterEnd: '章', related: '接着读', previous: '上一章', next: '下一章', finish: '回看整条阅读路径', missing: '没有找到这一章', missingDetail: '请从目录选择一个章节继续阅读。', practice: '想把阅读带到桌上', practiceIntro: '挑一个自己的点子，照着观察和试玩方法做一份小草稿。', practiceLink: '打开可选实践', knowledge: '按问题阅读', connected: '这一部分为何接在这里', count: '章 · 中文 / English' },
  en: { title: 'Start designing, one game at a time', label: 'Systematic reading', intro: 'Help Rabbit and Hedgehog cross a river. Follow how one game works, then develop, test, and revise a first design of your own.', guidance: '7 parts and 28 chapters follow one draft through the design process. Read in order or pick a chapter. Open an exercise when you want to try it.', start: 'Begin with chapter one', library: 'All original articles', toc: 'Contents', language: 'Reading language', chapter: 'Chapter ', chapterEnd: '', related: 'Read more', previous: 'Previous chapter', next: 'Next chapter', finish: 'Return to the complete reading path', missing: 'Chapter not found', missingDetail: 'Choose a chapter from the contents to continue reading.', practice: 'Bringing the reading to the table', practiceIntro: 'Choose an idea of your own and use the observation and playtest activities to make a small draft.', practiceLink: 'Open optional practice (Chinese)', knowledge: 'Browse by question', connected: 'How this part connects', count: 'chapters · 中文 / English' },
}

export function TextLearning({ chapterId, language = 'zh-CN', returnTo, readingTrack, onOpenTool }: { chapterId?: string; language?: Language; returnTo?: string; readingTrack?: ReadingTrack; onOpenTool: (id: GuideToolId) => void }) {
  const track = readingTrackFor(chapterId, readingTrack)
  const path = pathFor(track)
  const river = track === 'river'
  const otherTrack = river ? 'race' : 'river'
  const otherChapter = chapterId ? chapterForTrack(chapterId, otherTrack) : undefined
  const chapterHref = (id: string | undefined, lang: Language) => readingHref('course', id, lang, { readingReturnTo: readingReturnLanguage(returnTo, lang), ...(!id && river ? { readingTrack: 'river' } : {}) })
  const c = { ...copy[language], ...(!river ? language === 'en' ? { intro: 'Start with Snakes and Ladders: the wait for a lucky roll, the sudden fall, the rush to the finish. Change one rule at a time to explore choices, test ideas, and make a game of your own.' } : { intro: '从《蛇梯棋》开始：等一个好点数，突然滑落，再追向终点。每次改一条规则，学会理解选择、测试想法，做出自己的第一款小游戏。' } : {}) }
  const chapterIndex = path.chapters.findIndex(item => item.id === chapterId)
  const chapter = path.chapters[chapterIndex]
  const article = articles.find(item => item.id === chapterId)
  const part = path.parts.find(item => item.id === chapter?.part)
  const previous = path.chapters[chapterIndex - 1]
  const next = path.chapters[chapterIndex + 1]
  const support = supportData.chapters.find(item => item.chapterId === chapterId)
  const contextualCases = support?.caseIds.map(id => designCases.find(item => item.id === id)).filter(item => Boolean(item)) || []
  const fromLibrary = returnTo?.startsWith('#resources/library/')
  const contextualLibrary = libraryEntries.filter(item => item.chapterIds.includes(chapterForTrack(chapterId || '', 'river')))
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
      <div className="original-reading__backlinks">{chapterId && returnTo && <a href={returnTo}>{fromLibrary ? (language === 'en' ? '← Back to the library entry' : '← 返回刚才的条目') : fromCases ? (language === 'en' ? '← Back to the case' : '← 返回刚才的案例') : (language === 'en' ? '← Back to articles' : '← 返回文章目录')}</a>}<a href={chapterId ? chapterHref(undefined, language) : `#resources/read/all/${language}`}>{chapterId ? c.toc : c.knowledge}</a></div>
      <div className="original-reading__languages" aria-label={c.language}>{(['zh-CN', 'en'] as const).map(lang => <a key={lang} href={chapterHref(chapterId, lang)} lang={lang} hrefLang={lang} aria-current={lang === language ? 'page' : undefined}>{lang === 'en' ? 'English' : '中文'}</a>)}</div>
    </nav>
    <nav className="reading-track-switch" aria-label={language === 'en' ? 'Course example' : '课程案例'}>
      <span>{language === 'en' ? (river ? 'Alternative · Crossing the river' : 'Main path · Snakes and Ladders') : (river ? '替代路径 · 小兔与小刺猬过河' : '主线 · 蛇梯棋与竞速游戏')}</span>
      <a href={readingHref('course', otherChapter, language, { ...(!otherChapter && !river ? { readingTrack: 'river' } : {}), readingReturnTo: returnTo })}>{language === 'en' ? (river ? 'Switch to the race path →' : `Try the river alternative${chapterId ? '' : ' · 28 chapters'} →`) : (river ? '切换到竞速主线 →' : `换看过河案例${chapterId ? '' : ' · 完整 28 章'} →`)}</a>
    </nav>
    {!chapterId ? <>
      <header className={`text-learning__hero${river ? '' : ' text-learning__hero--race'}`}>{river && <picture className="text-learning__hero-image"><source srcSet={`${riverHeroBase}640.webp 640w, ${riverHeroBase}960.webp 960w, ${riverHeroBase}1600.webp 1600w`} sizes="(max-width: 700px) 900px, 1400px"/><img src={`${riverHeroBase}1600.webp`} width="1600" height="900" alt="" fetchPriority="high" /></picture>}<div className="text-learning__hero-copy"><h1>{language === 'zh-CN' ? river ? <><span>从一局游戏，</span><span>开始设计</span></> : <><span>从蛇梯棋，</span><span>开始设计</span></> : river ? c.title : 'Start designing with Snakes and Ladders'}</h1><p className="text-learning__lede">{c.intro}</p><div className="text-learning__entry"><a className="text-learning__begin" href={chapterHref(path.chapters[0].id, language)}>{c.start} <span aria-hidden="true">→</span></a><a href={readingHref('cases', undefined, language)}>{language === 'en' ? 'Explore real games' : '看真实游戏案例'}</a></div></div>{!river && <RacePrototype language={language} hero />}</header><ol className="text-learning__steps"><li><span>1</span>{language === 'en' ? 'Read an example' : '读一个例子'}</li><li><span>2</span>{language === 'en' ? 'See how other games work' : '看看其他游戏怎么做'}</li><li><span>3</span>{language === 'en' ? 'Revise your own draft' : '改自己的草稿'}</li></ol><header className="text-learning__contents-intro"><h2>{language === 'en' ? 'Follow one small game through the design process' : '沿着一个小游戏，走过设计过程'}</h2><p>{c.guidance}</p></header>
      {!river && <RaceComparisons language={language} />}
      <div className="text-learning__contents">{chapterList()}</div>
      <section className="text-learning__case-shelf"><header><h2>{language === 'en' ? 'See the ideas at work in real games' : '把刚读到的想法，放进真实游戏里看'}</h2><a href={readingHref('cases', undefined, language)}>{language === 'en' ? 'All case studies →' : '全部案例 →'}</a></header><CaseTeasers language={language}/></section><aside className="text-learning__practice"><h2>{c.practice}</h2><p>{c.practiceIntro}</p><a href="#course/practice">{c.practiceLink}</a></aside>
    </> : chapter && article ? <>
      <p className="text-learning__eyebrow">{part?.title[language]} · {c.chapter}{chapter.number}{c.chapterEnd} / {path.chapters.length}</p>
      <details className="text-learning__outline"><summary>{c.toc}</summary>{chapterList(true)}</details>
      <ArticleBody key={`${chapterId}/${language}`} article={article} language={language} withOutline afterSection={support ? { number: support.afterSection, node: <ReadingWorksheet sourceId={chapterId!} worksheetId={support.worksheetId as WorksheetId} title={support.title[language]} reason={support.reason[language]} language={language}/> } : undefined} companion={support ? <><h2>{language === 'en' ? 'Try it' : '动手试试'}</h2><p>{support.reason[language]}</p><button type="button" className="reading-tool-link" onClick={() => { const exercise = document.getElementById(`worksheet-${chapterId}`); exercise?.querySelector('details')?.setAttribute('open', ''); exercise?.scrollIntoView({ block: 'center', behavior: 'auto' }); exercise?.querySelector('textarea')?.focus({ preventScroll: true }) }}>{support.title[language]} <span aria-hidden="true">↓</span></button><button type="button" className="reading-tool-link" onClick={() => onOpenTool(support.toolId as GuideToolId)}>{language === 'en' ? 'Open full workbench (Chinese)' : `打开${toolTitles[support.toolId as GuideToolId]}`} <span aria-hidden="true">↗</span></button>{!!contextualLibrary.length && <section className="reading-companion-cases"><h2>{language === 'en' ? 'See the rule in action' : '看规则具体怎样运行'}</h2>{contextualLibrary.map(item => <a key={item.id} href={readingHref('library', item.id, language, { readingReturnTo: readingHref('course', chapterId, language) })}><strong>{item.title[language]}</strong><span>{item.summary[language]}</span></a>)}</section>}{!!contextualCases.length && <section className="reading-companion-cases"><h2>{language === 'en' ? 'In a real game' : '在真实游戏里看'}</h2>{contextualCases.map(item => item && <a key={item.id} href={readingHref('cases', item.id, language, { readingReturnTo: readingHref('course', chapterId, language) })}><span>{caseGameName(item, language)}</span><strong>{item.title[language]}</strong></a>)}</section>}</> : undefined} />
      {!river && chapter.number >= 27 && <aside className="race-handout"><h2>{language === 'en' ? 'Take C v0.1 to the table' : '把 C v0.1 带到桌上'}</h2><p>{language === 'en' ? 'A printable board and complete rules in the current language. Add two pawns and two ordinary six-sided dice.' : '当前语言的棋盘与完整规则，可打印或保存后离线使用。另备两枚棋子与两颗普通六面骰。'}</p><a href={`${import.meta.env.BASE_URL}downloads/race-c-v0.1-${language}.html`} target="_blank" rel="noopener noreferrer">{language === 'en' ? 'Open printable materials ↗' : '打开可打印材料 ↗'}</a><a href={`${import.meta.env.BASE_URL}downloads/race-c-v0.1-${language}.html`} download>{language === 'en' ? 'Download for offline use' : '下载离线材料'}</a></aside>}
      {!river && [6, 7, 8, 22].includes(chapter.number) && <RacePrototype language={language} />}
      {!river && <RaceComparisons language={language} chapterNumber={chapter.number} />}
      {!!chapter.related.length && <aside className="text-learning__related"><h2>{c.related}</h2><p>{chapter.relatedPurpose[language]}</p><ul>{chapter.related.map(id => { const item = articles.find(entry => entry.id === id); return item ? <li key={id}><a href={readingHref('articles', id, language, { readingReturnTo: readingHref('course', chapterId, language) })}>{item.title[language]}</a></li> : null })}</ul></aside>}
      <nav className="text-learning__neighbors" aria-label={c.label}>{previous && <a href={chapterHref(previous.id, language)}><span>{c.previous}</span>{articles.find(item => item.id === previous.id)?.title[language]}</a>}{next ? <a className="text-learning__next" href={chapterHref(next.id, language)}><span>{c.next}</span>{articles.find(item => item.id === next.id)?.title[language]}</a> : <a href={chapterHref(undefined, language)}>{c.finish}</a>}</nav>
    </> : <section><h1>{c.missing}</h1><p>{c.missingDetail}</p><a href={chapterHref(undefined, language)}>{c.toc}</a></section>}
  </main>
}
