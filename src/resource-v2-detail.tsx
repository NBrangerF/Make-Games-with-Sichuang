import type { AnalysisQuestionId, LearningStartEntryId } from './resource-start-v2'
import type { LearningContentId } from './learning-content-route'
import type { GuideToolId } from './data'
import { analysisToolLinks, ContextualToolLinks, learningEntryToolLinks } from './contextual-tools'

type LearningDetail = {
  title: string
  intro: string
  firstAction: string
  steps: readonly { title: string; explanation: string }[]
}

const LEARNING_DETAILS: Record<LearningStartEntryId, LearningDetail> = {
  systematic: {
    title: '系统性学习',
    intro: '先建立一套可以反复使用的设计语言，再把每个概念放回原型和测试中。你不需要一次读完全部目录。',
    firstAction: '先完整读第一课，并完成其中的十五分钟快速设计练习。',
    steps: [
      { title: '0 从一个具体问题开始', explanation: '把“我要做一个游戏”缩成一句这轮真正要回答的问题。' },
      { title: '1 玩家体验与设计意图', explanation: '说明希望玩家反复经历什么，而不是先堆出机制清单。' },
      { title: '2 决定与核心循环', explanation: '找出玩家反复看见、选择、承受后果和更新判断的关系。' },
      { title: '3 机制、信息与互动', explanation: '观察规则怎样改变信息，以及一名玩家怎样改变他人的选择。' },
      { title: '4 最小原型', explanation: '只制作当前问题需要被看见的可玩切片。' },
      { title: '5 单问题测试', explanation: '每一场测试只冻结一个预测和一个反驳信号。' },
      { title: '6 从证据到下一版', explanation: '分开观察、解释和下一项单变量改动。' },
      { title: '7 规则、教学与查询', explanation: '让陌生人能开始行动，并在忘记时恢复。' },
      { title: '8 呈现、生产与发布', explanation: '把规格、责任和交付边界变成可核验记录。' },
    ],
  },
  'designer-thinking': {
    title: '看设计师怎样思考',
    intro: '重点不是模仿一个著名设计师的答案，而是看清他在某个版本、某个限制下怎样作出决定。',
    firstAction: '读一个决定时，先写下当时的问题、考虑过的选项、采用的证据和后来发生的结果。',
    steps: [
      { title: '先找决定，不先找金句', explanation: '一篇开发日志里最有价值的部分，通常是一次取舍及其语境。' },
      { title: '把事实和解释分开', explanation: '设计师做了什么是事实，为什么有效往往仍是可争论的解释。' },
      { title: '记录没有选择的路', explanation: '被删除或推迟的方案能显示真正的约束和优先级。' },
      { title: '写清迁移边界', explanation: '把关系带回自己的项目，但不要把别人的结论当成普遍规则。' },
    ],
  },
  'learn-by-playing': {
    title: '边玩边学',
    intro: '不从“好不好玩”开始。抓住一局中的一个具体时刻，再追踪体验、行动和规则之间的关系。',
    firstAction: '从最近玩过的一局里，选择一个让你犹豫、惊讶、等待或改变计划的时刻。',
    steps: [
      { title: '只选一个问题', explanation: '例如“我为什么在这里不愿意拿最高分的行动”，不要分析整款游戏。' },
      { title: '记录看得见的行为', explanation: '先写玩家看见什么、比较什么、最后做了什么。' },
      { title: '再提出系统推断', explanation: '说明哪条规则、信息或资源关系可能产生了这个行为。' },
      { title: '留下仍不知道的部分', explanation: '一次游玩只能支持有限判断，要把不确定性留在记录里。' },
    ],
  },
  'small-exercise': {
    title: '从一个小练习开始',
    intro: '先做出一个可以观察的变化，再决定需要补读什么。每个练习都能在一次短会话内完成。',
    firstAction: '选择一个你已经熟悉的游戏，只改变一条规则，并先写下你预计会出现的行为变化。',
    steps: [
      { title: '改造一条熟悉规则', explanation: '保持其他部分不变，改变一个选择、资源或限制，再预测体验怎样变化。' },
      { title: '画出一次决定', explanation: '写下输入、可选行动、代价、后果和反馈何时回到玩家。' },
      { title: '做一个单问题纸片原型', explanation: '只制作能够回答当前问题的组件，不制作完整游戏。' },
    ],
  },
}

const SYSTEMATIC_AVAILABLE_UNITS = [
  {
    id: 'systematic-unit-00-question-first',
    number: '00',
    title: '从一个具体问题开始',
    result: '产出一句当前问题、一项最短测试和一个反驳信号。',
  },
  {
    id: 'systematic-unit-01-experience-intent',
    number: '01',
    title: '玩家体验与设计意图',
    result: '产出一段含动作、代价、行为预测和边界的体验意图。',
  },
  {
    id: 'systematic-unit-02-decisions-core-loop',
    number: '02',
    title: '决定与核心循环',
    result: '产出一条输入、选择、代价、状态与反馈组成的短循环。',
  },
  {
    id: 'systematic-unit-03-mechanisms-information-interaction',
    number: '03',
    title: '机制、信息与互动',
    result: '产出一条包含信息权限、他人影响、回应窗口与反馈的因果关系。',
  },
  {
    id: 'systematic-unit-04-minimum-prototype',
    number: '04',
    title: '最小原型',
    result: '产出一份材料最小、信息清楚、可以执行和停止的测试切片。',
  },
  {
    id: 'systematic-unit-05-single-question-test',
    number: '05',
    title: '单问题测试',
    result: '产出一份含预测、反驳、参与范围、无引导任务、观察、停止与移交的测试单。',
  },
  {
    id: 'systematic-unit-06-evidence-to-next-version',
    number: '06',
    title: '从证据到下一版',
    result: '产出一份连接冻结版本、三栏记录、备选原因、单项改动与新预测的版本简报。',
  },
] as const satisfies readonly {
  id: LearningContentId
  number: string
  title: string
  result: string
}[]

const SYSTEMATIC_SOURCE_TRANSLATIONS = [
  {
    id: 'game-design-concepts-level-01',
    title: 'Game Design Concepts 第 1 关',
    result: '从“什么是游戏”开始，并完成十五分钟设计练习。',
  },
  {
    id: 'game-design-concepts-level-02',
    title: 'Game Design Concepts 第 2 关',
    result: '理解游戏设计、迭代、设计风险与快速原型。',
  },
  {
    id: 'what-makes-a-rulebook-accessible-and-entertaining',
    title: '怎样让规则书既无障碍又有趣？',
    result: '用认知负荷与七类无障碍视角检查规则书，并直接查阅六张建议表。',
  },
] as const satisfies readonly {
  id: LearningContentId
  title: string
  result: string
}[]

const DESIGNER_CASES = [
  {
    id: 'designer-case-monsoon-market-variables',
    number: '01',
    title: '一次只测试一种变化',
    result: '看测试前怎样减少噪声，同时承认新版本仍未被证明。',
  },
  {
    id: 'designer-case-dune-imperium-beginnings',
    number: '02',
    title: '好游戏为什么仍要推翻',
    result: '看三个约束怎样把两套机制连接成一个真实机会成本。',
  },
  {
    id: 'designer-case-quid-for-your-quo',
    number: '03',
    title: '删掉旧机制后系统为什么垮了',
    result: '看删除实验怎样暴露一个组件原本承担的隐藏工作。',
  },
  {
    id: 'designer-case-paul-grogan-rulebook-layout',
    number: '04',
    title: '规则文字交给排版以后',
    result: '看标题、图示、分页与分栏怎样重新改变玩家实际读到的规则。',
  },
  {
    id: 'designer-case-new-bedford-manufacturing-constraint',
    number: '05',
    title: '一张纸为什么会决定二十座建筑',
    result: '看生产边界怎样迫使设计者解释每个组件真正承担的工作。',
  },
] as const satisfies readonly {
  id: LearningContentId
  number: string
  title: string
  result: string
}[]

type AnalysisDetail = {
  title: string
  lens: string
  moment: string
  prompts: readonly string[]
  output: string
  framework: string
}

const ANALYSIS_DETAILS: Record<AnalysisQuestionId, AnalysisDetail> = {
  experience: {
    title: '为什么会产生这种体验？',
    lens: '从玩家描述的感受出发，反向追踪可观察行为与规则关系。',
    moment: '选择一次明显的紧张、期待、安心、失望或惊讶。',
    prompts: ['玩家在那一刻看见了什么？', '他随后做了什么，而不是说了什么？', '哪条规则、信息或反馈最可能改变了行动？'],
    output: '当玩家看见……并受到……限制时，他更可能……，因此产生……体验。',
    framework: 'MDA 的体验回溯镜头',
  },
  decisions: {
    title: '玩家真正做了什么决定？',
    lens: '不要只数规则允许的行动，要找出玩家真正考虑过的选项和机会成本。',
    moment: '选择一次玩家停下来比较，或立刻作出看似自动选择的时刻。',
    prompts: ['规则允许哪些行动？', '玩家实际上考虑了哪些行动？', '哪些选项因为信息、代价或显然更差而退出考虑？'],
    output: '玩家的有效决定不是……个合法行动，而是在……与……之间承担……代价。',
    framework: '单轮决定轨迹',
  },
  interaction: {
    title: '玩家之间怎样互相影响？',
    lens: '沿着一名玩家的行动，追踪它怎样改变其他人的信息、机会、成本或承诺。',
    moment: '选择一次交易、阻挡、竞价、合作讨论或共享资源变化。',
    prompts: ['谁先改变了公共或私人状态？', '其他玩家因此失去或获得了什么选择？', '这种影响是立即可见，还是稍后才被察觉？'],
    output: '玩家 A 的……通过改变……，使玩家 B 更可能……，其影响在……时变得可见。',
    framework: '互动作用路径',
  },
  'state-and-feedback': {
    title: '游戏怎样随时间和状态运行？',
    lens: '追踪一个状态如何被行动改变，又怎样通过反馈进入下一轮决定。',
    moment: '选择一次资源补充、回合切换、阶段推进、市场变化或终局触发。',
    prompts: ['什么状态在这一刻改变？', '变化由哪个行动或规则触发？', '玩家何时看见变化，并据此更新下一步计划？'],
    output: '当……发生时，状态从……变成……，并在……时反馈给玩家，改变下一轮的……。',
    framework: '五个过程模型的状态镜头',
  },
  'learning-and-execution': {
    title: '玩家怎样看见、学会并执行？',
    lens: '把教学看成一条任务路径，检查玩家怎样发现目标、完成动作并从中断中恢复。',
    moment: '选择第一次设置、第一次决定、一次规则查询或中断后的恢复。',
    prompts: ['玩家此刻需要完成什么可观察动作？', '完成动作前必须知道什么，哪些内容可以稍后再学？', '玩家忘记时，会从哪里找到准确答案？'],
    output: '为了完成……，玩家先从……看见……，再通过……练习；忘记时从……恢复。',
    framework: '单任务学习路径',
  },
}

export type ResourceLearningDetailProps = {
  pathId: LearningStartEntryId
  onBack: () => void
  onOpenContent: (contentId: LearningContentId) => void
  onOpenProblems: () => void
  onOpenTool: (toolId: GuideToolId) => void
}

export function ResourceLearningDetail({ pathId, onBack, onOpenContent, onOpenProblems, onOpenTool }: ResourceLearningDetailProps) {
  const detail = LEARNING_DETAILS[pathId]
  if (pathId === 'systematic') {
    return (
      <main className="resource-detail-page resource-systematic-page" id="main-content" tabIndex={-1}>
        <button className="resource-start-back" type="button" onClick={onBack}>返回学习方式</button>
        <p className="resource-detail-kicker">系统性学习</p>
        <h1>{detail.title}</h1>
        <p className="resource-detail-lede">{detail.intro}</p>
        <section className="resource-detail-next" aria-labelledby="resource-learning-next-title">
          <span>现在先做</span>
          <h2 id="resource-learning-next-title">单元 0：把一个点子缩成今天能回答的问题</h2>
          <button className="primary-button" type="button" onClick={() => onOpenContent('systematic-unit-00-question-first')}>阅读单元 0</button>
        </section>
        <section className="resource-reading-index" aria-labelledby="available-systematic-title">
          <h2 id="available-systematic-title">已经可以完整阅读</h2>
          <ol>
            {SYSTEMATIC_AVAILABLE_UNITS.map(unit => (
              <li key={unit.id}>
                <button type="button" onClick={() => onOpenContent(unit.id)}>
                  <span>{unit.number}</span>
                  <div><strong>{unit.title}</strong><small>{unit.result}</small></div>
                </button>
              </li>
            ))}
          </ol>
        </section>
        <details className="resource-course-outline">
          <summary>查看完整九单元路线</summary>
          <ol>{detail.steps.map(step => <li key={step.title}><strong>{step.title}</strong><span>{step.explanation}</span></li>)}</ol>
        </details>
        <section className="resource-source-readings" aria-labelledby="source-translations-title">
          <h2 id="source-translations-title">完整来源译文</h2>
          <p>课程正文与来源译文分开。译文帮助你直接阅读原作者的完整论述，不代替本站的九单元路径。</p>
          <ul>
            {SYSTEMATIC_SOURCE_TRANSLATIONS.map(item => (
              <li key={item.id}><button type="button" onClick={() => onOpenContent(item.id)}><strong>{item.title}</strong><span>{item.result}</span></button></li>
            ))}
          </ul>
        </section>
        <ContextualToolLinks links={learningEntryToolLinks[pathId]} onOpenTool={onOpenTool} />
      </main>
    )
  }
  if (pathId === 'designer-thinking') {
    return (
      <main className="resource-detail-page resource-designer-cases-page" id="main-content" tabIndex={-1}>
        <button className="resource-start-back" type="button" onClick={onBack}>返回学习方式</button>
        <p className="resource-detail-kicker">真实设计决定</p>
        <h1>{detail.title}</h1>
        <p className="resource-detail-lede">从一次小修订到复杂系统替换。每篇都分开设计师报告、本站推断与仍不知道的部分，不要求先玩过原游戏。</p>
        <section className="resource-reading-index resource-designer-case-index" aria-labelledby="designer-case-index-title">
          <h2 id="designer-case-index-title">选择一个决定开始</h2>
          <ol>
            {DESIGNER_CASES.map(item => (
              <li key={item.id}>
                <button type="button" onClick={() => onOpenContent(item.id)}>
                  <span>{item.number}</span>
                  <div><strong>{item.title}</strong><small>{item.result}</small></div>
                </button>
              </li>
            ))}
          </ol>
        </section>
        <p className="resource-detail-boundary">五篇都是本站原创中文案例综合，不是未获许可文章的逐段翻译。原作者、来源和内容边界保留在每篇末尾。</p>
        <ContextualToolLinks links={learningEntryToolLinks[pathId]} onOpenTool={onOpenTool} />
      </main>
    )
  }
  return (
    <main className="resource-detail-page" id="main-content" tabIndex={-1}>
      <button className="resource-start-back" type="button" onClick={onBack}>返回学习方式</button>
      <p className="resource-detail-kicker">学习入口</p>
      <h1>{detail.title}</h1>
      <p className="resource-detail-lede">{detail.intro}</p>
      <section className="resource-detail-next" aria-labelledby="resource-learning-next-title">
        <span>现在先做</span>
        <h2 id="resource-learning-next-title">{detail.firstAction}</h2>
        {pathId === 'learn-by-playing' && <button className="primary-button" type="button" onClick={() => onOpenContent('learn-by-playing-one-moment')}>开始第一份完整记录</button>}
        {pathId === 'small-exercise' && <button className="text-action" type="button" onClick={onOpenProblems}>从具体设计问题选择一个练习</button>}
      </section>
      <section className="resource-detail-sequence" aria-labelledby="resource-learning-sequence-title">
        <h2 id="resource-learning-sequence-title">这条路径怎样走</h2>
        <ol>{detail.steps.map((step, index) => <li key={step.title}><span>{String(index + 1).padStart(2, '0')}</span><div><h3>{step.title}</h3><p>{step.explanation}</p></div></li>)}</ol>
      </section>
      <ContextualToolLinks links={learningEntryToolLinks[pathId]} onOpenTool={onOpenTool} />
    </main>
  )
}

export type ResourceAnalysisDetailProps = {
  questionId: AnalysisQuestionId
  onBack: () => void
  onChooseAnother: () => void
  onOpenTool: (toolId: GuideToolId) => void
}

export function ResourceAnalysisDetail({ questionId, onBack, onChooseAnother, onOpenTool }: ResourceAnalysisDetailProps) {
  const detail = ANALYSIS_DETAILS[questionId]
  return (
    <main className="resource-detail-page resource-analysis-detail" id="main-content" tabIndex={-1}>
      <button className="resource-start-back" type="button" onClick={onBack}>返回分析入口</button>
      <p className="resource-detail-kicker">一次只分析一个问题</p>
      <h1>{detail.title}</h1>
      <p className="resource-detail-lede">{detail.lens}</p>
      <section className="resource-analysis-method" aria-labelledby="resource-analysis-method-title">
        <h2 id="resource-analysis-method-title">四步完成一次分析</h2>
        <ol>
          <li><span>01</span><div><h3>冻结一个具体时刻</h3><p>{detail.moment}</p></div></li>
          <li><span>02</span><div><h3>只追三个问题</h3><ul>{detail.prompts.map(prompt => <li key={prompt}>{prompt}</li>)}</ul></div></li>
          <li><span>03</span><div><h3>分开观察与推断</h3><p>先写看得见的行动和状态，再写你认为哪条规则产生了它。不要把推断写成事实。</p></div></li>
          <li><span>04</span><div><h3>写成可反驳的关系</h3><p>{detail.output}</p></div></li>
        </ol>
      </section>
      <aside className="resource-analysis-lens"><strong>本页使用的起步镜头</strong><p>{detail.framework}</p><small>镜头帮助你提出问题，不会替你证明结论。</small></aside>
      <ContextualToolLinks links={analysisToolLinks[questionId]} onOpenTool={onOpenTool} />
      <button className="resource-start-secondary" type="button" onClick={onChooseAnother}>换一个分析问题</button>
    </main>
  )
}

export type ResourceAdvancedAnalysisProps = {
  onBack: () => void
}

export function ResourceAdvancedAnalysis({ onBack }: ResourceAdvancedAnalysisProps) {
  return (
    <main className="resource-detail-page" id="main-content" tabIndex={-1}>
      <button className="resource-start-back" type="button" onClick={onBack}>返回分析入口</button>
      <p className="resource-detail-kicker">进阶入口</p>
      <h1>形式化分析什么时候有帮助？</h1>
      <p className="resource-detail-lede">当研究问题已经明确，并且需要比较状态、规则结构或大量可运行案例时，再进入形式化表示。它不是普通游戏分析的必经步骤。</p>
      <section className="resource-detail-sequence" aria-labelledby="advanced-analysis-title">
        <h2 id="advanced-analysis-title">先检查三个前提</h2>
        <ol>
          <li><span>01</span><div><h3>问题能够被准确写出</h3><p>例如比较两种回合结构是否产生相同的可达状态，而不是泛泛问哪款游戏更好。</p></div></li>
          <li><span>02</span><div><h3>表示方式不会抹掉关键体验</h3><p>规则图、状态机或游戏描述语言只能表示被明确编码的部分。</p></div></li>
          <li><span>03</span><div><h3>结果仍会回到人工解释</h3><p>计算差异是证据，不是设计价值的自动结论。</p></div></li>
        </ol>
      </section>
      <p className="resource-detail-boundary">后续资料将把 TAG、Ludii 与其他形式化方法放在这里，并逐篇说明表示能力、适用问题和证据边界。</p>
    </main>
  )
}
