import { ClassicVisualBoard } from './classic-visual-board'
import { PRODUCT_BRAND, PRODUCT_DESCRIPTOR } from './brand'
import { ResourceHomeBanner } from './resource-home-banner'

export type ResourceStartEntryId = 'learn' | 'analyze' | 'problems'
export type ResourceStartDestination = ResourceStartEntryId | 'all'

export type LearningStartEntryId =
  | 'systematic'
  | 'designer-thinking'
  | 'learn-by-playing'
  | 'small-exercise'

export type AnalysisQuestionId =
  | 'experience'
  | 'decisions'
  | 'interaction'
  | 'state-and-feedback'
  | 'learning-and-execution'

export type ResourceStartEntry<Id extends string> = Readonly<{
  id: Id
  title: string
  result: string
}>

export const RESOURCE_START_ENTRIES = [
  {
    id: 'learn',
    title: '开始学习桌游设计',
    result: '按适合自己的方式，走进完整的基础学习内容。',
  },
  {
    id: 'analyze',
    title: '从设计师角度分析一款游戏',
    result: '用清楚的问题拆解体验、决定、互动与系统。',
  },
  {
    id: 'problems',
    title: '按正在解决的设计问题找资料',
    result: '从原型、测试、规则、平衡等具体困惑进入。',
  },
] as const satisfies readonly ResourceStartEntry<ResourceStartEntryId>[]

export const LEARNING_START_ENTRIES = [
  {
    id: 'systematic',
    title: '系统性学习',
    result: '从设计意图到发布，按完整中文学习单元逐步建立整体路径。',
  },
  {
    id: 'designer-thinking',
    title: '看设计师怎样思考',
    result: '通过具体的取舍、证据和结果，理解设计决定是怎样形成的。',
  },
  {
    id: 'learn-by-playing',
    title: '边玩边学',
    result: '从一局里的具体时刻出发，把感受转成可以检验的设计关系。',
  },
  {
    id: 'small-exercise',
    title: '从一个小练习开始',
    result: '不先读完整课程，马上用一次短练习做出可以观察的改变。',
  },
] as const satisfies readonly ResourceStartEntry<LearningStartEntryId>[]

export const ANALYSIS_QUESTIONS = [
  {
    id: 'experience',
    title: '为什么会产生这种体验？',
    result: '追踪规则怎样塑造玩家的感受与行动。',
  },
  {
    id: 'decisions',
    title: '玩家真正做了什么决定？',
    result: '找出玩家看见什么、能选什么，以及后果怎样返回。',
  },
  {
    id: 'interaction',
    title: '玩家之间怎样互相影响？',
    result: '观察一名玩家的行动怎样改变其他人的选择。',
  },
  {
    id: 'state-and-feedback',
    title: '游戏怎样随时间和状态运行？',
    result: '跟随资源、位置、回合和反馈怎样随时间变化。',
  },
  {
    id: 'learning-and-execution',
    title: '玩家怎样看见、学会并执行？',
    result: '检查玩家怎样发现目标、学会操作，并在忘记时恢复。',
  },
] as const satisfies readonly ResourceStartEntry<AnalysisQuestionId>[]

type ResourceChoiceListProps<Id extends string> = {
  items: readonly ResourceStartEntry<Id>[]
  label: string
  onChoose: (id: Id) => void
  showEntryShapes?: boolean
}

function ResourceChoiceList<Id extends string>({ items, label, onChoose, showEntryShapes = false }: ResourceChoiceListProps<Id>) {
  return (
    <nav className={showEntryShapes ? 'resource-start-choices has-entry-shapes' : 'resource-start-choices'} aria-label={label}>
      <ul className="resource-start-list">
        {items.map((item, index) => (
          <li className="resource-start-list-item" data-entry={item.id} key={item.id}>
            <button className="resource-start-choice" type="button" onClick={() => onChoose(item.id)}>
              <span className="resource-start-choice-number" aria-hidden="true">
                {showEntryShapes ? '' : String(index + 1).padStart(2, '0')}
              </span>
              <span className="resource-start-choice-copy">
                <strong className="resource-start-choice-title">{item.title}</strong>
                <span className="resource-start-choice-result">{item.result}</span>
              </span>
              <span className="resource-start-choice-arrow" aria-hidden="true">→</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export type ResourceStartHomeProps = {
  onNavigate: (destination: ResourceStartDestination) => void
}

export function ResourceStartHome({ onNavigate }: ResourceStartHomeProps) {
  return (
    <main className="resource-start-page resource-start-home" id="main-content" tabIndex={-1}>
      <div className="resource-home-layout">
        <section className="resource-home-copy" aria-labelledby="resource-home-title">
          <p className="resource-start-kicker">{PRODUCT_DESCRIPTOR}</p>
          <h1 className="resource-start-title" id="resource-home-title">{PRODUCT_BRAND}</h1>
          <p className="resource-start-lede">把桌游设计的知识，变成下一步能做的事。核心内容可直接在站内阅读中文版本。</p>
          <h2 className="resource-home-choice-title">从一个问题开始</h2>
          <ResourceChoiceList
            items={RESOURCE_START_ENTRIES}
            label="选择今天要完成的事"
            onChoose={onNavigate}
            showEntryShapes
          />
          <button className="resource-start-secondary" type="button" onClick={() => onNavigate('all')}>
            搜索全部资料
          </button>
        </section>
        <div className="resource-home-media">
          <ResourceHomeBanner />
          <ClassicVisualBoard compact />
        </div>
      </div>
    </main>
  )
}

export type ResourceLearningStartProps = {
  onBack: () => void
  onChooseLearningPath: (id: LearningStartEntryId) => void
}

export function ResourceLearningStart({ onBack, onChooseLearningPath }: ResourceLearningStartProps) {
  return (
    <main className="resource-start-page resource-start-learning" id="main-content" tabIndex={-1}>
      <button className="resource-start-back" type="button" onClick={onBack}>
        返回资源首页
      </button>
      <h1 className="resource-start-title">你想用哪种方式开始？</h1>
      <p className="resource-start-lede">选择现在最容易开始的一种方式。之后随时可以换一条路径。</p>
      <ResourceChoiceList
        items={LEARNING_START_ENTRIES}
        label="选择学习桌游设计的方式"
        onChoose={onChooseLearningPath}
      />
    </main>
  )
}

export type ResourceAnalysisStartProps = {
  onBack: () => void
  onChooseQuestion: (id: AnalysisQuestionId) => void
  onOpenAdvanced: () => void
}

export function ResourceAnalysisStart({ onBack, onChooseQuestion, onOpenAdvanced }: ResourceAnalysisStartProps) {
  return (
    <main className="resource-start-page resource-start-analysis" id="main-content" tabIndex={-1}>
      <button className="resource-start-back" type="button" onClick={onBack}>
        返回资源首页
      </button>
      <h1 className="resource-start-title">这一局，你想弄懂什么？</h1>
      <p className="resource-start-lede">先选一个具体问题。下一步只会提供一个适合起步的分析方法。</p>
      <ResourceChoiceList
        items={ANALYSIS_QUESTIONS}
        label="选择这次要分析的问题"
        onChoose={onChooseQuestion}
      />
      <section className="resource-start-advanced" aria-labelledby="resource-analysis-advanced-title">
        <h2 className="resource-start-advanced-title" id="resource-analysis-advanced-title">需要更精确地比较规则结构？</h2>
        <p className="resource-start-advanced-copy">形式化方法适合已经明确研究问题，并需要结构化表示或计算比较的读者。</p>
        <button className="resource-start-secondary" type="button" onClick={onOpenAdvanced}>
          进入进阶形式化分析
        </button>
      </section>
    </main>
  )
}
