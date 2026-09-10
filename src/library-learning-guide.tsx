import { libraryEntries } from './design-library-catalog'
import { libraryLearningStages, libraryLessonOrder } from './library-learning-path'
import { readingHref, type ReadingLanguage } from './reading-navigation'

const lesson = (id: string) => libraryEntries.find(entry => entry.id === id)!

export function LibraryLearningGuide({ language }: { language: ReadingLanguage }) {
  const t = (zh: string, en: string) => language === 'en' ? en : zh
  const list = readingHref('library', undefined, language, { libraryKind: 'lessons' })
  const link = (id: string) => readingHref('library', id, language, { readingReturnTo: list })
  return <section className="library-learning-guide" aria-labelledby="library-learning-title">
    <h2 id="library-learning-title">{t('第一次来，从哪里开始？', 'Where should I start?')}</h2>
    <p>{t('想理解机制，从两张包裹卡开始；想马上动手，可以直接使用“小车送书”。每篇示范都能独立阅读。', 'To understand mechanisms, start with two parcel cards. To try a game now, go straight to Book Cart. Each worked example can be read on its own.')}</p>
    <nav className="library-learning-starts" aria-label={t('选择教学起点', 'Choose a lesson starting point')}>
      <a href={link('lesson-see-a-mechanism')}>{t('从一次选择看懂机制', 'Understand a mechanism through one choice')} →</a>
      <a href={link('lesson-prototype-a-question')}>{t('用小车游戏做一次原型', 'Try a prototype with Book Cart')} →</a>
    </nav>
    <details>
      <summary>{t('展开 12 课的可选阅读顺序', 'Explore an optional order for the 12 lessons')}</summary>
      <p>{t('按下面的顺序，可以从规则关系走到原型与修订；也可以跳到当前的问题。前六课各自重设局面，后六课共用小车游戏的基准规则。', 'Follow this order from rule relationships to prototyping and revision, or jump to your current question. The first six lessons reset their situations; the last six share the Book Cart base rules.')}</p>
      <ol className="library-learning-stages">{libraryLearningStages.map((stage, index) => <li key={stage.ids[0]}>
        <h3>{stage.title[language]}</h3><p>{stage.purpose[language]}</p>
        <ol start={index * 3 + 1}>{stage.ids.map(id => <li key={id}><a href={link(id)}>{lesson(id).title[language]}</a></li>)}</ol>
      </li>)}</ol>
    </details>
  </section>
}

export function LibraryLessonNavigation({ id, language, returnTo }: { id: string; language: ReadingLanguage; returnTo: string }) {
  const index = libraryLessonOrder.findIndex(item => item === id)
  if (index < 0) return null
  const t = (zh: string, en: string) => language === 'en' ? en : zh
  const previous = libraryLessonOrder[index - 1]
  const next = libraryLessonOrder[index + 1]
  return <nav className="library-lesson-navigation" aria-label={t('直接教学阅读顺序', 'Lesson reading order')}>
    <p>{t(`可选阅读顺序 · 第 ${index + 1} / 12 课`, `Optional reading order · Lesson ${index + 1} of 12`)}</p>
    {previous && <a href={readingHref('library', previous, language, { readingReturnTo: returnTo })}>← {t('上一篇', 'Previous')}: {lesson(previous).title[language]}</a>}
    {next && <a href={readingHref('library', next, language, { readingReturnTo: returnTo })}>{t('下一篇', 'Next')}: {lesson(next).title[language]} →</a>}
    <a href={readingHref('library', undefined, language, { libraryKind: 'lessons' })}>{t('查看全部直接教学', 'Browse all lessons')}</a>
  </nav>
}
