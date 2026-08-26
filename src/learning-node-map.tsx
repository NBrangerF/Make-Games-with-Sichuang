import { learningModes, learningNodes, type LearningActionState, type LearningModeId } from './learning-node-catalog'

type LearningNodeMapProps = {
  track: 'observe' | 'iteration'
  mode: LearningModeId
  currentNodeId: string
  nodeStates: Record<string, LearningActionState>
  onBack: () => void
  onOpenProject: () => void
  onMode: (mode: LearningModeId) => void
  onOpenNode: (nodeId: string) => void
}

const actionStateLabels: Record<LearningActionState, string> = { 'not-started': '打开节点', drafted: '已起草', tabletop: '已落桌', tested: '已测试', revised: '已修订' }

export function LearningNodeMap({ track, mode, currentNodeId, nodeStates, onBack, onOpenProject, onMode, onOpenNode }: LearningNodeMapProps) {
  const trackNodes = learningNodes.filter(node => node.track === track)
  const currentNode = trackNodes.find(node => node.id === currentNodeId) ?? trackNodes[0]
  const completedInTrack = trackNodes.filter(node => (nodeStates[node.id] ?? 'not-started') !== 'not-started').length
  const isObserve = track === 'observe'

  return <main className="learning-map" id="main-content" tabIndex={-1}>
    <nav className="learning-node-page__top" aria-label={`${isObserve ? '观察实验室' : '原型迭代'}导航`}><button type="button" onClick={onBack}>← 返回学习首页</button><span>{isObserve ? '分析一款实际玩过的游戏' : '适合已经有点子或可玩版本'}</span></nav>
    <section className="learning-map__hero" aria-labelledby="learning-map-title">
      <div className="learning-map__hero-copy">
        <p className="learning-eyebrow">{isObserve ? '分析实验室 · 5 个节点' : '证据化循环 · 7 个节点'}</p>
        <h1 id="learning-map-title">{isObserve ? <>从一局游戏中，<br />看见设计。</> : <>从一个不确定性，<br />推进下一版。</>}</h1>
        <p>{isObserve ? '请选择一款你实际玩过的游戏。沿着行为、选择、循环和信息完成一次分析，再把观察变成一条小改造预测。' : '这不是从零开始的桌游课程，也不要求你一次走到发布。先带来一个点子、设计问题或可玩版本。'}</p>
        <button className="learning-primary-action" type="button" onClick={() => onOpenNode(currentNode.id)}>
          {completedInTrack > 0 ? `继续：${currentNode.title}` : isObserve ? '从一个真实时刻开始' : '从当前最大问题开始'}
        </button>
      </div>
      <picture className="learning-map__hero-image">
        <source media="(max-width: 720px)" srcSet="/assets/brand/luozhuo-home-banner-image2-640.webp" />
        <source media="(max-width: 1200px)" srcSet="/assets/brand/luozhuo-home-banner-image2-960.webp" />
        <img src="/assets/brand/luozhuo-home-banner-image2-1600.webp" alt="纸张、卡片与游戏组件组成的工作桌" />
      </picture>
    </section>

    {!isObserve && <section className="learning-project-gate" aria-labelledby="learning-project-gate-title"><div><p className="learning-eyebrow">进入循环前</p><h2 id="learning-project-gate-title">先固定这一轮在推进哪个游戏。</h2><p>在项目护照中写清玩家、人数、时长、体验、设计边界和当前版本。节点记录才不会从分析别人的游戏突然变成没有对象的“这一版”。</p></div><button className="learning-secondary-action" type="button" onClick={onOpenProject}>打开项目护照</button></section>}

    <section className="learning-mode" aria-labelledby="learning-mode-title">
      <div>
        <p className="learning-eyebrow">三种不同活动</p>
        <h2 id="learning-mode-title">这一次拿什么来做？</h2>
      </div>
      <div className="learning-mode__options">
        {learningModes.map(option => <button
          key={option.id}
          type="button"
          className={option.id === mode ? 'learning-mode__option is-active' : 'learning-mode__option'}
          aria-pressed={option.id === mode}
          onClick={() => onMode(option.id)}
        >
          <span><strong>{option.label}</strong><small>{option.minutes}</small></span>
          <span>{option.description}</span>
        </button>)}
      </div>
    </section>

    <section className="learning-map__route" aria-labelledby="learning-route-title">
      <div className="learning-section-heading">
        <div><p className="learning-eyebrow">{trackNodes.length} 个连续节点</p><h2 id="learning-route-title">{isObserve ? '行为 → 选择 → 循环 → 信息 → 改造预测' : '不确定性 → 问题 → 证据 → 原型 → 测试 → 复盘 → 改版'}</h2></div>
        <p>{completedInTrack} / {trackNodes.length} 已留下结果</p>
      </div>
      <ol className="learning-node-list">
        {trackNodes.map(node => {
          const actionState = nodeStates[node.id] ?? 'not-started'
          const isDone = actionState !== 'not-started'
          const isCurrent = node.id === currentNode.id
          return <li key={node.id} className={isCurrent ? 'is-current' : undefined}>
            <button type="button" onClick={() => onOpenNode(node.id)} aria-label={`${isDone ? `${actionStateLabels[actionState]}，` : ''}第 ${node.trackOrder} 节：${node.title}`}>
              <span className="learning-node-list__number">{String(node.trackOrder).padStart(2, '0')}</span>
              <span className="learning-node-list__copy"><strong>{node.title}</strong><span>{node.thought}</span></span>
              <span className={isDone ? 'learning-node-list__state is-done' : 'learning-node-list__state'}>{isDone ? actionStateLabels[actionState] : isCurrent ? '从这里继续' : '打开节点'}</span>
            </button>
          </li>
        })}
      </ol>
      <p className="learning-map__loop-note">{isObserve ? '观察不是终点。完成后，选择一条规则，预测改变它之后玩家行为会怎样变化，再做一个极小改版。' : '形成下一版决定后，带着新的最大不确定性返回第一个迭代节点。教学测试、盲测、交接与发布在规则和系统稳定后按需打开。'}</p>
    </section>
  </main>
}
