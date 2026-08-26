import { learningNodeById, learningNodes, type LearningModeId, type LearningNode } from './learning-node-catalog'
import { LearningNodeMap } from './learning-node-map'
import { LearningNodePage } from './learning-node-page'
import { useLearningNodeProgress } from './learning-node-progress'

type LearningNodesRouteProps = {
  nodeId?: string
  onOpenMap: () => void
  onOpenNode: (nodeId: string) => void
  onOpenTool: (toolId: LearningNode['toolId']) => void
  onOpenContent: (contentId: string) => void
  onOpenBranch: (guideId: string) => void
  onOpenResourceEntry: (entryId: string) => void
  onOpenConcept: (conceptId: string) => void
}

export function LearningNodesRoute({ nodeId, onOpenMap, onOpenNode, onOpenTool, onOpenContent, onOpenBranch, onOpenResourceEntry, onOpenConcept }: LearningNodesRouteProps) {
  const { progress, setMode, setCurrentNode, setDraft, completeNode } = useLearningNodeProgress()

  const openNode = (id: string) => {
    setCurrentNode(id)
    onOpenNode(id)
  }

  const chooseMode = (mode: LearningModeId) => setMode(mode)
  const node = nodeId ? learningNodeById.get(nodeId) : undefined

  if (!node) return <LearningNodeMap mode={progress.mode} currentNodeId={learningNodeById.has(progress.currentNodeId) ? progress.currentNodeId : learningNodes[0].id} completedNodeIds={progress.completedNodeIds} onMode={chooseMode} onOpenNode={openNode} />

  return <LearningNodePage
    node={node}
    mode={progress.mode}
    draft={progress.drafts[node.id] ?? ''}
    isCompleted={progress.completedNodeIds.includes(node.id)}
    onBackToMap={onOpenMap}
    onMode={chooseMode}
    onDraft={draft => setDraft(node.id, draft)}
    onComplete={completeNode}
    onOpenNode={openNode}
    onOpenTool={onOpenTool}
    onOpenContent={onOpenContent}
    onOpenBranch={onOpenBranch}
    onOpenResourceEntry={onOpenResourceEntry}
    onOpenConcept={onOpenConcept}
  />
}
