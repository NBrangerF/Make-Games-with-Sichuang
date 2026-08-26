import level01Metadata from '../content/translations/game-design-concepts-level-01-zh-CN.metadata.json'
import level01Source from '../content/translations/game-design-concepts-level-01-zh-CN.md?raw'
import level02Metadata from '../content/translations/game-design-concepts-level-02-zh-CN.metadata.json'
import level02Source from '../content/translations/game-design-concepts-level-02-zh-CN.md?raw'
import rulebookAccessibilityMetadata from '../content/translations/what-makes-a-rulebook-accessible-and-entertaining-zh-CN.metadata.json'
import rulebookAccessibilitySource from '../content/translations/what-makes-a-rulebook-accessible-and-entertaining-zh-CN.md?raw'
import monsoonMetadata from '../content/guides/monsoon-market-variables-case-synthesis-zh-CN-internal.metadata.json'
import monsoonSource from '../content/guides/monsoon-market-variables-case-synthesis-zh-CN-internal.md?raw'
import duneMetadata from '../content/translations/dune-imperium-beginnings-zh-CN-internal.metadata.json'
import duneSource from '../content/translations/dune-imperium-beginnings-zh-CN-internal.md?raw'
import quidMetadata from '../content/guides/quid-for-your-quo-case-synthesis-zh-CN-internal.metadata.json'
import quidSource from '../content/guides/quid-for-your-quo-case-synthesis-zh-CN-internal.md?raw'
import rulebookLayoutMetadata from '../content/guides/paul-grogan-rulebook-layout-case-synthesis-zh-CN-internal.metadata.json'
import rulebookLayoutSource from '../content/guides/paul-grogan-rulebook-layout-case-synthesis-zh-CN-internal.md?raw'
import manufacturingMetadata from '../content/guides/new-bedford-manufacturing-constraint-case-synthesis-zh-CN-internal.metadata.json'
import manufacturingSource from '../content/guides/new-bedford-manufacturing-constraint-case-synthesis-zh-CN-internal.md?raw'
import unit00Metadata from '../content/learning-units/systematic-unit-00-question-first-zh-CN.metadata.json'
import unit00Source from '../content/learning-units/systematic-unit-00-question-first-zh-CN.md?raw'
import unit01Metadata from '../content/learning-units/systematic-unit-01-experience-intent-zh-CN.metadata.json'
import unit01Source from '../content/learning-units/systematic-unit-01-experience-intent-zh-CN.md?raw'
import unit02Metadata from '../content/learning-units/systematic-unit-02-decisions-core-loop-zh-CN.metadata.json'
import unit02Source from '../content/learning-units/systematic-unit-02-decisions-core-loop-zh-CN.md?raw'
import unit03Metadata from '../content/learning-units/systematic-unit-03-mechanisms-information-interaction-zh-CN.metadata.json'
import unit03Source from '../content/learning-units/systematic-unit-03-mechanisms-information-interaction-zh-CN.md?raw'
import unit04Metadata from '../content/learning-units/systematic-unit-04-minimum-prototype-zh-CN.metadata.json'
import unit04Source from '../content/learning-units/systematic-unit-04-minimum-prototype-zh-CN.md?raw'
import unit05Metadata from '../content/learning-units/systematic-unit-05-single-question-test-zh-CN.metadata.json'
import unit05Source from '../content/learning-units/systematic-unit-05-single-question-test-zh-CN.md?raw'
import unit06Metadata from '../content/learning-units/systematic-unit-06-evidence-to-next-version-zh-CN.metadata.json'
import unit06Source from '../content/learning-units/systematic-unit-06-evidence-to-next-version-zh-CN.md?raw'
import learnByPlayingMetadata from '../content/learning-units/learn-by-playing-one-moment-zh-CN.metadata.json'
import learnByPlayingSource from '../content/learning-units/learn-by-playing-one-moment-zh-CN.md?raw'
import type { LearningContentId } from './learning-content-route'
import { extractMarkdownOutline, MarkdownReading } from './markdown-reading'
import type { GuideToolId } from './data'
import { ContextualToolLinks, learningContentToolLinks } from './contextual-tools'

type SourceFact = Readonly<{
  label: string
  value: string
}>

type ReadingEntry = Readonly<{
  source: string
  kind: 'original' | 'translation'
  status: string
  note: string
  facts: readonly SourceFact[]
  previousId?: LearningContentId
  nextId?: LearningContentId
}>

const readingEntries: Record<LearningContentId, ReadingEntry> = {
  'systematic-unit-00-question-first': {
    source: unit00Source,
    kind: 'original',
    status: '本站原创完整学习单元',
    note: '由 Codex 根据列明来源与项目研究完成原创综合，可直接作为当前内部学习版本使用。',
    facts: [
      { label: '作者', value: unit00Metadata.authorship.author },
      { label: '形成方式', value: unit00Metadata.authorship.production },
      { label: '版本', value: unit00Metadata.version },
      { label: '使用范围', value: '仅限本站内部学习' },
    ],
    nextId: 'systematic-unit-01-experience-intent',
  },
  'systematic-unit-01-experience-intent': {
    source: unit01Source,
    kind: 'original',
    status: '本站原创完整学习单元',
    note: '正文使用简单例子逐层增加概念，不要求读者预先理解 MDA 或系统设计术语。',
    facts: [
      { label: '作者', value: unit01Metadata.authorship.author },
      { label: '形成方式', value: unit01Metadata.authorship.production },
      { label: '版本', value: unit01Metadata.version },
      { label: '使用范围', value: '仅限本站内部学习' },
    ],
    previousId: 'systematic-unit-00-question-first',
    nextId: 'systematic-unit-02-decisions-core-loop',
  },
  'systematic-unit-02-decisions-core-loop': {
    source: unit02Source,
    kind: 'original',
    status: '本站原创完整学习单元',
    note: '正文把决定和核心循环压成可以直接观察、绘制和反驳的桌面关系。',
    facts: [
      { label: '作者', value: unit02Metadata.authorship.author },
      { label: '形成方式', value: unit02Metadata.authorship.production },
      { label: '版本', value: unit02Metadata.version },
      { label: '使用范围', value: '仅限本站内部学习' },
    ],
    previousId: 'systematic-unit-01-experience-intent',
    nextId: 'systematic-unit-03-mechanisms-information-interaction',
  },
  'systematic-unit-03-mechanisms-information-interaction': {
    source: unit03Source,
    kind: 'original',
    status: '本站原创完整学习单元',
    note: '正文把机制标签拆成信息权限、状态变化、他人选项、回应窗口与可见反馈组成的因果关系。',
    facts: [
      { label: '作者', value: unit03Metadata.authorship.author },
      { label: '形成方式', value: unit03Metadata.authorship.production },
      { label: '版本', value: unit03Metadata.version },
      { label: '使用范围', value: '仅限本站内部学习' },
    ],
    previousId: 'systematic-unit-02-decisions-core-loop',
    nextId: 'systematic-unit-04-minimum-prototype',
  },
  'systematic-unit-04-minimum-prototype': {
    source: unit04Source,
    kind: 'original',
    status: '本站原创完整学习单元',
    note: '正文把一个原型问题转换为材料最小、信息清楚、可以执行、可以停止并能找回版本的桌面切片。',
    facts: [
      { label: '作者', value: unit04Metadata.authorship.author },
      { label: '形成方式', value: unit04Metadata.authorship.production },
      { label: '版本', value: unit04Metadata.version },
      { label: '使用范围', value: '仅限本站内部学习' },
    ],
    previousId: 'systematic-unit-03-mechanisms-information-interaction',
    nextId: 'systematic-unit-05-single-question-test',
  },
  'systematic-unit-05-single-question-test': {
    source: unit05Source,
    kind: 'original',
    status: '本站原创完整学习单元',
    note: '正文把一次短测试固定为一个问题，并把行为预测、反驳信号、参与范围、无引导任务、观察、停止、复盘和移交连成可执行协议。',
    facts: [
      { label: '作者', value: unit05Metadata.authorship.author },
      { label: '形成方式', value: unit05Metadata.authorship.production },
      { label: '版本', value: unit05Metadata.version },
      { label: '正文汉字', value: String(unit05Metadata.metrics.hanCharacterCount) },
      { label: '使用范围', value: '仅限本站内部学习' },
    ],
    previousId: 'systematic-unit-04-minimum-prototype',
    nextId: 'systematic-unit-06-evidence-to-next-version',
  },
  'systematic-unit-06-evidence-to-next-version': {
    source: unit06Source,
    kind: 'original',
    status: '本站原创完整学习单元',
    note: '正文把冻结版本、原始观察、玩家原话、设计者解释、备选原因与下一项主要改动连成一份可追踪的下一版简报；示范资料明确标为教学演练。',
    facts: [
      { label: '作者', value: unit06Metadata.authorship.author },
      { label: '形成方式', value: unit06Metadata.authorship.production },
      { label: '版本', value: unit06Metadata.version },
      { label: '正文汉字', value: String(unit06Metadata.metrics.hanCharacterCount) },
      { label: '使用范围', value: '仅限本站内部学习' },
    ],
    previousId: 'systematic-unit-05-single-question-test',
  },
  'learn-by-playing-one-moment': {
    source: learnByPlayingSource,
    kind: 'original',
    status: '本站原创完整学习脚手架',
    note: '正文用一个明确标注为虚构的构造记录示范怎样分开规则事实、可见行动、系统推断、替代解释与未知，不把单次游玩写成普遍结论。',
    facts: [
      { label: '作者', value: learnByPlayingMetadata.authorship.author },
      { label: '形成方式', value: learnByPlayingMetadata.authorship.production },
      { label: '版本', value: learnByPlayingMetadata.version },
      { label: '示例边界', value: learnByPlayingMetadata.exampleBoundary },
      { label: '使用范围', value: '仅限本站内部学习' },
    ],
  },
  'game-design-concepts-level-01': {
    source: level01Source,
    kind: 'translation',
    status: '完整中文译文',
    note: 'Codex 完整翻译并核对文章结构、练习、署名与许可证据。本版本不再等待人工双语复核。',
    facts: [
      { label: '原作者', value: level01Metadata.original.author },
      { label: '原文题名', value: level01Metadata.original.title },
      { label: '许可', value: level01Metadata.license.id },
      { label: '原文地址', value: level01Metadata.original.url },
      { label: '许可地址', value: level01Metadata.license.url },
    ],
    nextId: 'game-design-concepts-level-02',
  },
  'game-design-concepts-level-02': {
    source: level02Source,
    kind: 'translation',
    status: '完整中文译文',
    note: 'Codex 完整翻译并核对文章结构、练习、图片语义、署名与许可证据，可作为当前内部学习主版本。',
    facts: [
      { label: '原作者', value: level02Metadata.original.author },
      { label: '原文题名', value: level02Metadata.original.title },
      { label: '许可', value: level02Metadata.license.id },
      { label: '原文地址', value: level02Metadata.original.url },
      { label: '许可地址', value: level02Metadata.license.url },
    ],
    previousId: 'game-design-concepts-level-01',
    nextId: 'what-makes-a-rulebook-accessible-and-entertaining',
  },
  'what-makes-a-rulebook-accessible-and-entertaining': {
    source: rulebookAccessibilitySource,
    kind: 'translation',
    status: '完整中文译文',
    note: 'Codex 依据官方仓储版本完成全文翻译；66 个编号段落、六张表、三处图示文字替代、注释与书目均已核对。',
    facts: [
      { label: '原作者', value: rulebookAccessibilityMetadata.original.authors.join('、') },
      { label: '原文题名', value: rulebookAccessibilityMetadata.original.title },
      { label: '期刊', value: rulebookAccessibilityMetadata.original.journal },
      { label: '许可', value: rulebookAccessibilityMetadata.license.id },
      { label: '官方来源', value: rulebookAccessibilityMetadata.original.url },
      { label: '许可地址', value: rulebookAccessibilityMetadata.license.url },
    ],
    previousId: 'game-design-concepts-level-02',
  },
  'designer-case-monsoon-market-variables': {
    source: monsoonSource,
    kind: 'original',
    status: '本站原创完整案例',
    note: 'Codex 根据 Daniel Solis 的公开设计日志与项目研究完成原创中文案例综合，不是原文逐段翻译。',
    facts: [
      { label: '本站作者', value: monsoonMetadata.authorship.author },
      { label: '案例来源作者', value: monsoonMetadata.source.author },
      { label: '内容模式', value: monsoonMetadata.contentMode },
      { label: '来源地址', value: monsoonMetadata.source.url },
      { label: '使用范围', value: '仅限本站内部学习，不进入公开构建' },
    ],
    nextId: 'designer-case-dune-imperium-beginnings',
  },
  'designer-case-dune-imperium-beginnings': {
    source: duneSource,
    kind: 'original',
    status: '本站原创完整案例',
    note: 'Codex 根据 Paul Dennen 的官方设计日志与规则资料完成原创中文案例综合，不翻译小说引文，也不复制原文结构或图片。',
    facts: [
      { label: '本站作者', value: duneMetadata.synthesis.creator },
      { label: '案例来源作者', value: duneMetadata.original.author },
      { label: '内容模式', value: duneMetadata.contentMode },
      { label: '来源地址', value: duneMetadata.original.url },
      { label: '使用范围', value: '仅限本站内部学习，不进入公开构建' },
    ],
    previousId: 'designer-case-monsoon-market-variables',
    nextId: 'designer-case-quid-for-your-quo',
  },
  'designer-case-quid-for-your-quo': {
    source: quidSource,
    kind: 'original',
    status: '本站原创完整案例',
    note: 'Codex 根据 Cole Wehrle 的设计日志完成原创中文案例综合，分开作者报告、本站推断与仍未知的部分。',
    facts: [
      { label: '本站作者', value: quidMetadata.authorship.author },
      { label: '案例来源作者', value: quidMetadata.source.author },
      { label: '内容模式', value: quidMetadata.contentMode },
      { label: '来源地址', value: quidMetadata.source.primaryUrl },
      { label: '使用范围', value: '仅限本站内部学习，不进入公开构建' },
    ],
    previousId: 'designer-case-dune-imperium-beginnings',
    nextId: 'designer-case-paul-grogan-rulebook-layout',
  },
  'designer-case-paul-grogan-rulebook-layout': {
    source: rulebookLayoutSource,
    kind: 'original',
    status: '本站原创完整案例',
    note: 'Codex 根据 James Naylor 与 Paul Grogan 的公开长访谈完成原创中文案例综合，重点追踪文字、版面与陌生玩家任务之间的交接。',
    facts: [
      { label: '本站作者', value: rulebookLayoutMetadata.authorship.author },
      { label: '案例来源作者', value: rulebookLayoutMetadata.source.author },
      { label: '内容模式', value: rulebookLayoutMetadata.contentMode },
      { label: '来源地址', value: rulebookLayoutMetadata.source.primaryUrl },
      { label: '使用范围', value: '仅限本站内部学习，不进入公开构建' },
    ],
    previousId: 'designer-case-quid-for-your-quo',
    nextId: 'designer-case-new-bedford-manufacturing-constraint',
  },
  'designer-case-new-bedford-manufacturing-constraint': {
    source: manufacturingSource,
    kind: 'original',
    status: '本站原创完整案例',
    note: 'Codex 根据 Nat Levan 的一手开发日志完成原创中文案例综合，把生产限制、组件工作与版本边界分开记录。',
    facts: [
      { label: '本站作者', value: manufacturingMetadata.authorship.author },
      { label: '案例来源作者', value: manufacturingMetadata.source.author },
      { label: '内容模式', value: manufacturingMetadata.contentMode },
      { label: '来源地址', value: manufacturingMetadata.source.primaryUrl },
      { label: '使用范围', value: '仅限本站内部学习，不进入公开构建' },
    ],
    previousId: 'designer-case-paul-grogan-rulebook-layout',
  },
}

export type CompleteLearningContentPageProps = {
  contentId: LearningContentId
  onBack: () => void
  onNavigate: (contentId: LearningContentId) => void
  onOpenTool: (toolId: GuideToolId) => void
}

export function CompleteLearningContentPage({ contentId, onBack, onNavigate, onOpenTool }: CompleteLearningContentPageProps) {
  const entry = readingEntries[contentId]
  const isDesignerCase = contentId.startsWith('designer-case-')
  const isLearnByPlaying = contentId === 'learn-by-playing-one-moment'
  const outline = extractMarkdownOutline(entry.source).filter(item => item.level === 2 || item.level === 3)
  const scrollToSection = (id: string) => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    document.getElementById(id)?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' })
  }
  const outlineLinks = outline.map(item => <button className={item.level === 3 ? 'is-nested' : ''} key={item.id} type="button" onClick={() => scrollToSection(item.id)}>{item.label}</button>)
  return (
    <main className="complete-reading-page" id="main-content" tabIndex={-1}>
      <button className="resource-start-back" type="button" onClick={onBack}>{isDesignerCase ? '返回设计师案例' : isLearnByPlaying ? '返回边玩边学' : '返回系统性学习'}</button>
      <details className="reading-chapter-disclosure"><summary>查看本页目录</summary><nav aria-label="本页目录">{outlineLinks}</nav></details>
      <div className="complete-reading-shell">
        <aside className="reading-chapter-rail" aria-label="本页目录"><strong>本页目录</strong><nav>{outlineLinks}</nav></aside>
        <div className="complete-reading-main">
          <aside className="complete-reading-status" aria-label="内容状态">
            <strong>{entry.status}</strong>
            <span>{entry.kind === 'translation' ? 'Codex 主译，来源与许可边界已记录' : '本站原创，Codex 综合编写'}</span>
            <p>{entry.note}</p>
          </aside>
          <article className="complete-reading-document">
            <MarkdownReading source={entry.source} />
          </article>
          <ContextualToolLinks links={learningContentToolLinks[contentId]} onOpenTool={onOpenTool} />
          <nav className="complete-reading-neighbors" aria-label="上一篇与下一篇">
            {entry.previousId
              ? <button className="resource-start-secondary" type="button" onClick={() => onNavigate(entry.previousId!)}>上一篇</button>
              : <span />}
            {entry.nextId && <button className="resource-start-secondary" type="button" onClick={() => onNavigate(entry.nextId!)}>下一篇</button>}
          </nav>
          <footer className="complete-reading-source">
            <h2>{entry.kind === 'translation' ? '来源与使用范围' : '内容记录'}</h2>
            <dl>
              {entry.facts.map(fact => <div key={fact.label}><dt>{fact.label}</dt><dd>{fact.value.startsWith('http') ? <code>{fact.value}</code> : fact.value}</dd></div>)}
            </dl>
            <p>正文中的外部来源只显示为站内来源记录，不会在阅读过程中自动跳离本站。</p>
          </footer>
        </div>
      </div>
    </main>
  )
}

export type CompleteTranslationPageProps = Omit<CompleteLearningContentPageProps, 'contentId'>

export function CompleteTranslationPage(props: CompleteTranslationPageProps) {
  return <CompleteLearningContentPage contentId="game-design-concepts-level-01" {...props} />
}
