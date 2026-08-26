import { useState } from 'react'
import glossaryDocument from '../content/glossary-index.json'
import resourceEntryDocument from '../content/resource-entry-points.json'
import { learningContentTitles } from './learning-content-route'
import { learningModes, learningNodeById, learningNodes, previousLearningNode, type LearningModeId, type LearningNode } from './learning-node-catalog'
import { toolTitles } from './tool-catalog'

type GlossaryItem = { id: string; term: string }
type GlossaryDocument = GlossaryItem[] | { entries?: GlossaryItem[]; terms?: GlossaryItem[] }
type ResourceEntryDocument = { entryPoints: Array<{ id: string; title: string }> }

const glossaryItems = Array.isArray(glossaryDocument)
  ? glossaryDocument as GlossaryItem[]
  : ((glossaryDocument as Exclude<GlossaryDocument, GlossaryItem[]>).entries ?? (glossaryDocument as Exclude<GlossaryDocument, GlossaryItem[]>).terms ?? [])
const conceptLabels = new Map(glossaryItems.map(item => [item.id, item.term]))
const resourceEntryLabels = new Map((resourceEntryDocument as ResourceEntryDocument).entryPoints.map(item => [item.id, item.title]))

type LearningNodePageProps = {
  node: LearningNode
  mode: LearningModeId
  draft: string
  isCompleted: boolean
  onBackToMap: () => void
  onMode: (mode: LearningModeId) => void
  onDraft: (draft: string) => void
  onComplete: (nodeId: string, nextNodeId: string) => void
  onOpenNode: (nodeId: string) => void
  onOpenTool: (toolId: LearningNode['toolId']) => void
  onOpenContent: (contentId: string) => void
  onOpenBranch: (guideId: string) => void
  onOpenResourceEntry: (entryId: string) => void
  onOpenConcept: (conceptId: string) => void
}

export function LearningNodePage({ node, mode, draft, isCompleted, onBackToMap, onMode, onDraft, onComplete, onOpenNode, onOpenTool, onOpenContent, onOpenBranch, onOpenResourceEntry, onOpenConcept }: LearningNodePageProps) {
  const [status, setStatus] = useState('')
  const modeOption = learningModes.find(item => item.id === mode) ?? learningModes[1]
  const previous = previousLearningNode(node.id)
  const next = learningNodeById.get(node.nextNodeId)
  const progress = Math.round((node.order / learningNodes.length) * 100)

  const finish = () => {
    if (!draft.trim() && !isCompleted) {
      setStatus(`先在“${node.toolTitle}”里留下一样结果。短短一句也可以。`)
      return
    }
    onComplete(node.id, node.nextNodeId)
    onOpenNode(node.nextNodeId)
  }

  return <main className="learning-node-page" id="main-content" tabIndex={-1}>
    <nav className="learning-node-page__top" aria-label="学习节点导航">
      <button type="button" onClick={onBackToMap}>← 返回学习地图</button>
      <span>节点 {String(node.order).padStart(2, '0')} / {learningNodes.length}</span>
    </nav>
    <div className="learning-node-page__progress" aria-label={`当前进度 ${progress}%`}><span style={{ width: `${progress}%` }} /></div>

    <article className="learning-node-article">
      <header className="learning-node-article__header">
        <p className="learning-eyebrow">节点 {String(node.order).padStart(2, '0')} · {modeOption.label} · {modeOption.minutes}</p>
        <h1>{node.title}</h1>
        <p className="learning-node-article__question">{node.question}</p>
      </header>

      <section className="learning-node-thought" aria-labelledby="node-thought-title">
        <p className="learning-section-label" id="node-thought-title">这一步只记住</p>
        <blockquote>{node.thought}</blockquote>
      </section>

      <section className="learning-node-example" aria-labelledby="node-example-title">
        <p className="learning-section-label" id="node-example-title">看一个例子</p>
        <p>{node.example}</p>
      </section>

      <section className="learning-node-action" aria-labelledby="node-action-title">
        <div>
          <p className="learning-section-label" id="node-action-title">现在动手</p>
          <h2>{node.action}</h2>
        </div>
        <p className="learning-node-action__hint">{mode === 'guided' ? node.guidedHint : mode === 'project' ? node.projectHint : '先照着例子做一次；不需要把整个游戏解释清楚。'}</p>
      </section>

      <section className="learning-node-tool" aria-labelledby="node-tool-title">
        <div className="learning-node-tool__heading">
          <div><p className="learning-section-label">这一步的工具</p><h2 id="node-tool-title">{node.toolTitle}</h2></div>
          <span>只保存在这台设备</span>
        </div>
        <label htmlFor={`learning-draft-${node.id}`}>{node.toolPrompt}</label>
        <textarea id={`learning-draft-${node.id}`} value={draft} onChange={event => { onDraft(event.target.value); setStatus('') }} placeholder={node.toolPlaceholder} rows={5} />
        <div className="learning-node-tool__result"><div><strong>这一步会留下</strong><p>{node.output}</p></div><div><strong>做到这里就够了</strong><p>{node.doneWhen}</p></div></div>
        <div className="learning-node-tool__actions">
          <button className="learning-primary-action" type="button" onClick={finish}>{isCompleted ? '继续下一步' : '留下结果，继续'}</button>
          <button className="learning-secondary-action" type="button" onClick={() => onOpenTool(node.toolId)}>需要更多字段？打开{toolTitles[node.toolId]}</button>
        </div>
        {status && <p className="learning-node-tool__status" role="status">{status}</p>}
      </section>

      <aside className="learning-node-limit" aria-labelledby="node-limit-title">
        <strong id="node-limit-title">先不要从这一步推出</strong>
        <p>{node.limit}</p>
      </aside>

      {(node.cases.length > 0 || node.branches.length > 0) && <section className="learning-node-support" aria-labelledby="node-support-title">
        <div><p className="learning-section-label">需要时再打开</p><h2 id="node-support-title">例子与支线</h2></div>
        <div className="learning-node-support__links">
          {node.cases.map(item => <button key={item.id} type="button" onClick={() => onOpenContent(item.id)}><span>案例</span><strong>{item.title}</strong></button>)}
          {node.branches.map(item => <button key={item.id} type="button" onClick={() => onOpenBranch(item.id)}><span>遇到这个问题</span><strong>{item.title}</strong></button>)}
        </div>
      </section>}

      <details className="learning-node-deeper">
        <summary>查看相关长文、资料与概念</summary>
        <div className="learning-node-deeper__groups">
          {node.sourceContentIds.length > 0 && <section><h3>完整内容</h3>{node.sourceContentIds.map(id => <button key={id} type="button" onClick={() => onOpenContent(id)}>{learningContentTitles[id]}</button>)}</section>}
          {node.resourceEntryIds.length > 0 && <section><h3>策展资料</h3>{node.resourceEntryIds.map(id => <button key={id} type="button" onClick={() => onOpenResourceEntry(id)}>{resourceEntryLabels.get(id) ?? '打开这组资料'}</button>)}</section>}
          {node.conceptIds.length > 0 && <section><h3>相关概念</h3>{node.conceptIds.map(id => <button key={id} type="button" onClick={() => onOpenConcept(id)}>{conceptLabels.get(id) ?? id}</button>)}</section>}
        </div>
      </details>
    </article>

    <nav className="learning-node-page__next" aria-label="前后节点">
      {previous ? <button type="button" onClick={() => onOpenNode(previous.id)}><span>上一步</span><strong>{previous.title}</strong></button> : <button type="button" onClick={onBackToMap}><span>上一步</span><strong>查看完整地图</strong></button>}
      {next && <button type="button" onClick={() => onOpenNode(next.id)}><span>{node.nextKind === 'loop' ? '开始下一轮' : '下一步'}</span><strong>{next.title}</strong></button>}
    </nav>

    <section className="learning-node-mode-switch" aria-labelledby="node-mode-switch-title">
      <h2 id="node-mode-switch-title">这一步想换一种做法？</h2>
      <div>{learningModes.map(option => <button key={option.id} type="button" aria-pressed={option.id === mode} onClick={() => onMode(option.id)}>{option.label}<small>{option.minutes}</small></button>)}</div>
    </section>
  </main>
}
