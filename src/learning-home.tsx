import { COURSE_V3_ID, COURSE_V3_VERSION, getCourseUnit } from './course/course-catalog-v3'
import { deploymentInfo } from './deployment'
import { useWorkspaceRuntime } from './workspace-runtime'

type LearningHomeProps = {
  onNavigate: (destination: string) => void
  onOpenProblems: () => void
  onOpenCourse: () => void
  onOpenWorkbench: () => void
}

const entryCards = [
  {
    id: 'first-tabletop',
    number: '01',
    eyebrow: '我从来没设计过桌游',
    title: '第一次落桌',
    copy: '从一张 mechanic 牌和一张 theme 牌开始，用有限材料做出能跑三轮的微型游戏。',
    output: '留下：一份 5—10 分钟微型原型简报',
    action: '开始第一次落桌',
  },
  {
    id: 'workshop',
    number: '02',
    eyebrow: '我想系统学习桌游设计',
    title: '基础设计工作室',
    copy: '先比较游戏，再完成三个受限小挑战，最后选择一个项目反复制作和测试。',
    output: '留下：多个小原型和一个持续迭代的项目',
    action: '查看工作室地图',
  },
  {
    id: 'iteration',
    number: '03',
    eyebrow: '我已经有点子或原型',
    title: '原型迭代主线',
    copy: '从当前最大的不确定性出发，写问题、裁原型、执行测试，再用桌面证据决定下一版。',
    output: '留下：一次测试记录和下一版本决定',
    action: '进入原型迭代',
  },
] as const

function LegacyLearningHome({ onNavigate, onOpenProblems }: LearningHomeProps) {
  return <main className="learning-map learning-home" id="main-content" tabIndex={-1}>
    <section className="learning-home__hero" aria-labelledby="learning-home-title">
      <div>
        <p className="learning-eyebrow">一桌点子 · 游戏设计学习与工作系统</p>
        <h1 id="learning-home-title">你现在，<br />从哪里开始？</h1>
        <p>桌游设计不是一条从灵感直达出版的直线。先选你眼前的状态，我们只给这一刻需要的下一步。</p>
      </div>
      <aside aria-label="学习方式说明">
        <strong>这里没有能力等级</strong>
        <p>你会遇到的是一个个节点、一种思维、一件工具和一次动作。年龄、软件和游戏类型不会替你决定固定顺序。</p>
      </aside>
    </section>

    <section className="learning-home__entries" aria-labelledby="learning-entry-title">
      <div className="learning-section-heading">
        <div><p className="learning-eyebrow">按真实状态进入</p><h2 id="learning-entry-title">先处理你眼前的任务</h2></div>
        <p>不需要从第一个入口依次走完。</p>
      </div>
      <div className="learning-home__entry-grid">
        {entryCards.map(entry => <article key={entry.id}>
          <span className="learning-home__entry-number">{entry.number}</span>
          <p className="learning-eyebrow">{entry.eyebrow}</p>
          <h3>{entry.title}</h3>
          <p>{entry.copy}</p>
          <small>{entry.output}</small>
          <button type="button" onClick={() => onNavigate(entry.id)}>{entry.action}<span aria-hidden="true"> →</span></button>
        </article>)}
        <article className="learning-home__entry-problems">
          <span className="learning-home__entry-number">04</span>
          <p className="learning-eyebrow">我被一个具体问题卡住</p>
          <h3>按问题找资料</h3>
          <p>从原型、测试、规则、随机性、人数、时长、机制或发布问题直接进入资源馆。</p>
          <small>留下：针对当前问题的阅读与行动入口</small>
          <button type="button" onClick={onOpenProblems}>打开问题型资源馆<span aria-hidden="true"> →</span></button>
        </article>
      </div>
    </section>

    <section className="learning-home__materials" aria-labelledby="learning-materials-title">
      <div>
        <p className="learning-eyebrow">创作材料，不是答案</p>
        <h2 id="learning-materials-title">先看玩家会做什么，<br />再看游戏在谈什么。</h2>
        <p>Mechanic 牌帮助你观察动作、状态和取舍；Theme 牌帮助你确定玩家位置、重复行动与系统压力。两者都需要做成原型再判断。</p>
      </div>
      <div className="learning-home__material-actions">
        <button type="button" onClick={() => onNavigate('mechanics')}><span>17 张</span><strong>浏览 mechanic 设计材料</strong><small>动作 · 状态 · 取舍 · 小练习</small></button>
        <button type="button" onClick={() => onNavigate('themes')}><span>12 张</span><strong>浏览 theme 设计材料</strong><small>位置 · 关系 · 压力 · 注意事项</small></button>
      </div>
    </section>

    <section className="learning-home__observe" aria-labelledby="learning-observe-title">
      <div><p className="learning-eyebrow">还没有想做游戏？</p><h2 id="learning-observe-title">先从一局真实游戏学会看。</h2></div>
      <p>选择一款你实际玩过的游戏，沿着行为、选择、循环和信息完成五个短节点，再把一条观察改成小实验。</p>
      <button className="learning-secondary-action" type="button" onClick={() => onNavigate('observe')}>进入观察实验室</button>
    </section>
  </main>
}

function TwoTaskLearningHome({ onOpenCourse, onOpenWorkbench, onOpenProblems }: LearningHomeProps) {
  const { workspace } = useWorkspaceRuntime()
  const enrollment = workspace.collections.courseEnrollments.find(item => item.courseId === COURSE_V3_ID && item.courseVersion === COURSE_V3_VERSION && item.status === 'active')
  const currentUnit = getCourseUnit(enrollment?.currentUnitId)
  const projectCount = workspace.collections.projects.filter(item => !item.archivedAt).length
  return <main className="learning-map two-task-home" id="main-content" tabIndex={-1}>
    <section className="two-task-home__hero" aria-labelledby="two-task-home-title">
      <p className="learning-eyebrow">一桌点子 · 游戏设计学习与工作系统</p>
      <h1 id="two-task-home-title">你现在只需要<br />选择一件事。</h1>
      <p>一条路线帮你系统学习；另一条路线帮你把真实构想做成原型，或继续推进已有项目。</p>
    </section>
    <section className="two-task-home__choices" aria-label="两个主要任务">
      <article><span>01</span><p className="learning-eyebrow">我想建立基本功</p><h2>系统学习<br />桌游设计</h2><p>从三款不需购买的微型游戏开始，通过案例、受限练习和一个完整项目继续。</p><small>{enrollment ? `当前：单元 ${currentUnit.number} · ${currentUnit.title}` : '从单元 1 开始，留下三款游戏的对比观察表'}</small><button type="button" onClick={onOpenCourse}>{enrollment ? `继续单元 ${Number(currentUnit.number)}` : '开始第 1 单元'}</button></article>
      <article><span>02</span><p className="learning-eyebrow">我想做或推进一个游戏</p><h2>开始或继续<br />一个桌游</h2><p>从新构想展开三个方向，或选择已有项目，沿着不确定、问题、证据、测试和下一版继续。</p><small>{projectCount ? `当前有 ${projectCount} 个未归档项目` : '可以从一个空项目或一个新构想开始'}</small><button type="button" onClick={onOpenWorkbench}>{projectCount ? '选择项目继续' : '开始新构想'}</button></article>
    </section>
    <button className="two-task-home__knowledge" type="button" onClick={onOpenProblems}>只想查一个问题？打开设计知识库</button>
  </main>
}

export function LearningHome(props: LearningHomeProps) {
  const twoTaskHomeEnabled = import.meta.env.VITE_V3_HOME_ENABLED === 'true' || !deploymentInfo.publicTrial
  return twoTaskHomeEnabled ? <TwoTaskLearningHome {...props} /> : <LegacyLearningHome {...props} />
}
