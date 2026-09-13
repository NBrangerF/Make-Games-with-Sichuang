import type { ReadingLanguage } from './reading-navigation'
import { readingHref } from './reading-navigation'
import comparisons from '../content/race-comparisons.json'

export function RaceComparisons({ language, chapterNumber }: { language: ReadingLanguage; chapterNumber?: number }) {
  const entries = comparisons.entries.filter(entry => !chapterNumber || entry.chapters.includes(chapterNumber))
  if (!entries.length) return null
  const t = (zh: string, en: string) => language === 'en' ? en : zh
  return <section className="race-comparisons" aria-label={t('竞速游戏对照', 'Racing game comparisons')}>
    <header><p>{t('同样在前进，决定却不一样', 'Similar movement, different decisions')}</p><h2>{t(chapterNumber ? '把这一点放进真实游戏里看' : '沿途会遇见的竞速游戏', chapterNumber ? 'See the idea in a real game' : 'Games we will meet along the way')}</h2>{!chapterNumber && <p>{t('掷骰移动是一种推进方式；竞速描述的是游戏目标。我们会比较谁移动、谁选择，以及谁从结果中获益。', 'Roll-and-move is a way to advance; racing describes a goal. Compare who moves, who chooses, and who benefits from the outcome.')}</p>}</header>
    <div className="race-comparisons__grid">{entries.map(entry => <article key={entry.id}>
      <p className="race-comparisons__tag">{entry.lens[language]}</p><h3>{entry.name[language]}</h3><p className="race-comparisons__edition">{entry.edition[language]}</p><p>{entry.comparison[language]}</p>
      <a href={readingHref('course', entry.chapterId, language)}>{t(`在第 ${entry.chapters[0]} 章展开 →`, `Explore in chapter ${entry.chapters[0]} →`)}</a>
      {entry.caseId && <a href={readingHref('cases', entry.caseId, language, { readingReturnTo: readingHref('course', chapterNumber ? comparisons.chapterIds[chapterNumber - 1] : undefined, language) })}>{t('阅读完整案例 →', 'Read the full case →')}</a>}
      <details><summary>{t('核对版本与规则', 'Check the edition and rules')}</summary><p>{entry.boundary[language]}</p>{entry.sources.map(source => <a key={source.url} href={source.url} target="_blank" rel="noopener noreferrer">{source.label[language]} ↗</a>)}</details>
    </article>)}</div>
  </section>
}
