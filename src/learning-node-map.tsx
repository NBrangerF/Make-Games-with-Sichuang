import { learningModes, learningNodes, type LearningModeId } from './learning-node-catalog'

type LearningNodeMapProps = {
  mode: LearningModeId
  currentNodeId: string
  completedNodeIds: string[]
  onMode: (mode: LearningModeId) => void
  onOpenNode: (nodeId: string) => void
}

export function LearningNodeMap({ mode, currentNodeId, completedNodeIds, onMode, onOpenNode }: LearningNodeMapProps) {
  const currentNode = learningNodes.find(node => node.id === currentNodeId) ?? learningNodes[0]
  const completed = new Set(completedNodeIds)

  return <main className="learning-map" id="main-content" tabIndex={-1}>
    <section className="learning-map__hero" aria-labelledby="learning-map-title">
      <div className="learning-map__hero-copy">
        <p className="learning-eyebrow">从一个真实时刻开始</p>
        <h1 id="learning-map-title">学习设计一款游戏，<br />一次只走一个节点。</h1>
        <p>不需要先学完术语，也不需要选年龄等级。每一步只留下一样能继续使用的东西。</p>
        <button className="learning-primary-action" type="button" onClick={() => onOpenNode(currentNode.id)}>
          {completed.size > 0 ? `继续：${currentNode.title}` : '从第一个节点开始'}
        </button>
      </div>
      <picture className="learning-map__hero-image">
        <source media="(max-width: 720px)" srcSet="/assets/brand/luozhuo-home-banner-image2-640.webp" />
        <source media="(max-width: 1200px)" srcSet="/assets/brand/luozhuo-home-banner-image2-960.webp" />
        <img src="/assets/brand/luozhuo-home-banner-image2-1600.webp" alt="纸张、卡片与游戏组件组成的工作桌" />
      </picture>
    </section>

    <section className="learning-mode" aria-labelledby="learning-mode-title">
      <div>
        <p className="learning-eyebrow">同一条路，三种做法</p>
        <h2 id="learning-mode-title">今天准备怎样走？</h2>
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
        <div><p className="learning-eyebrow">12 个连续节点</p><h2 id="learning-route-title">从观察一刻，到交出一个版本</h2></div>
        <p>{completed.size} / {learningNodes.length} 已留下结果</p>
      </div>
      <ol className="learning-node-list">
        {learningNodes.map(node => {
          const isDone = completed.has(node.id)
          const isCurrent = node.id === currentNode.id
          return <li key={node.id} className={isCurrent ? 'is-current' : undefined}>
            <button type="button" onClick={() => onOpenNode(node.id)} aria-label={`${isDone ? '已完成，' : ''}第 ${node.order} 节：${node.title}`}>
              <span className="learning-node-list__number">{String(node.order).padStart(2, '0')}</span>
              <span className="learning-node-list__copy"><strong>{node.title}</strong><span>{node.thought}</span></span>
              <span className={isDone ? 'learning-node-list__state is-done' : 'learning-node-list__state'}>{isDone ? '已留下结果' : isCurrent ? '从这里继续' : '打开节点'}</span>
            </button>
          </li>
        })}
      </ol>
      <p className="learning-map__loop-note">第 12 节不是终点。交出一个版本后，回到第 6 节，带着新问题开始下一轮。</p>
    </section>
  </main>
}
