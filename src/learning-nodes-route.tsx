import { lazy, Suspense } from 'react'
import { learningNodeById, learningNodes, type LearningModeId, type LearningNode } from './learning-node-catalog'
import { LearningHome } from './learning-home'
import { LearningNodeMap } from './learning-node-map'
import { LearningNodePage } from './learning-node-page'
import { LearningWorkshopMap } from './learning-workshop-map'
import { useLearningNodeProgress } from './learning-node-progress'

const DesignMaterialsLibrary = lazy(() => import('./design-materials-library').then(module => ({ default: module.DesignMaterialsLibrary })))
const FirstTabletopChallenge = lazy(() => import('./first-tabletop-challenge').then(module => ({ default: module.FirstTabletopChallenge })))

type LearningNodesRouteProps = {
  nodeId?: string
  onOpenMap: () => void
  onOpenNode: (nodeId: string) => void
  onOpenTool: (toolId: LearningNode['toolId']) => void
  onOpenContent: (contentId: string) => void
  onOpenBranch: (guideId: string) => void
  onOpenResourceEntry: (entryId: string) => void
  onOpenConcept: (conceptId: string) => void
  onOpenProblems: () => void
  onOpenProject: () => void
  onOpenCourse: () => void
  onOpenWorkbench: () => void
}

export function LearningNodesRoute({ nodeId, onOpenMap, onOpenNode, onOpenTool, onOpenContent, onOpenBranch, onOpenResourceEntry, onOpenConcept, onOpenProblems, onOpenProject, onOpenCourse, onOpenWorkbench }: LearningNodesRouteProps) {
  const { progress, setMode, setCurrentNode, setDraft, setActionState } = useLearningNodeProgress()

  const openNode = (id: string) => {
    if (learningNodeById.has(id)) setCurrentNode(id)
    onOpenNode(id)
  }

  const chooseMode = (mode: LearningModeId) => setMode(mode)
  const node = nodeId ? learningNodeById.get(nodeId) : undefined

  if (!nodeId) return <LearningHome onNavigate={openNode} onOpenProblems={onOpenProblems} onOpenCourse={onOpenCourse} onOpenWorkbench={onOpenWorkbench} />

  if (nodeId === 'workshop') return <LearningWorkshopMap onBack={onOpenMap} onNavigate={openNode} onOpenTool={toolId => onOpenTool(toolId)} />

  if (nodeId === 'observe' || nodeId === 'iteration') return <LearningNodeMap
    track={nodeId}
    mode={progress.mode}
    currentNodeId={learningNodeById.has(progress.currentNodeId) ? progress.currentNodeId : learningNodes[0].id}
    nodeStates={progress.nodeStates}
    onBack={onOpenMap}
    onOpenProject={onOpenProject}
    onMode={chooseMode}
    onOpenNode={openNode}
  />

  if (nodeId === 'mechanics' || nodeId === 'themes') return <Suspense fallback={<main className="learning-map design-materials-page" id="main-content" tabIndex={-1}><p role="status">正在准备设计材料……</p></main>}><DesignMaterialsLibrary kind={nodeId} onBack={onOpenMap} onOpenKind={kind => openNode(kind)} onStartChallenge={() => openNode('first-tabletop')} /></Suspense>

  if (nodeId === 'first-tabletop') return <Suspense fallback={<main className="learning-map first-tabletop-page" id="main-content" tabIndex={-1}><p role="status">正在准备第一次落桌……</p></main>}><FirstTabletopChallenge onBack={onOpenMap} onOpenMaterials={kind => openNode(kind)} onContinueIteration={() => openNode('iteration')} onOpenProject={onOpenProject} /></Suspense>

  if (!node) return <LearningHome onNavigate={openNode} onOpenProblems={onOpenProblems} onOpenCourse={onOpenCourse} onOpenWorkbench={onOpenWorkbench} />

  return <LearningNodePage
    node={node}
    mode={progress.mode}
    draft={progress.drafts[node.id] ?? ''}
    actionState={progress.nodeStates[node.id] ?? 'not-started'}
    onBackToMap={() => openNode(node.track)}
    onMode={chooseMode}
    onDraft={draft => setDraft(node.id, draft)}
    onActionState={setActionState}
    onOpenNode={openNode}
    onOpenTool={onOpenTool}
    onOpenContent={onOpenContent}
    onOpenBranch={onOpenBranch}
    onOpenResourceEntry={onOpenResourceEntry}
    onOpenConcept={onOpenConcept}
  />
}
