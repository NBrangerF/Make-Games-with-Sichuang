import { useEffect, useState } from 'react'
import type { LearningActionState, LearningModeId } from './learning-node-catalog'

const STORAGE_KEY = 'tabletop-workshop-learning-node-progress-v2'
const LEGACY_STORAGE_KEY = 'tabletop-workshop-learning-node-progress-v1'

export type LearningNodeProgress = Readonly<{
  schemaVersion: 2
  mode: LearningModeId
  currentNodeId: string
  nodeStates: Record<string, LearningActionState>
  drafts: Record<string, string>
}>

const initialState: LearningNodeProgress = {
  schemaVersion: 2,
  mode: 'independent',
  currentNodeId: 'node-06',
  nodeStates: {},
  drafts: {},
}

function readProgress(): LearningNodeProgress {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null') as Partial<LearningNodeProgress> | null
    if (stored?.schemaVersion === 2) return { ...initialState, ...stored, nodeStates: stored.nodeStates && typeof stored.nodeStates === 'object' ? stored.nodeStates : {}, drafts: stored.drafts && typeof stored.drafts === 'object' ? stored.drafts : {} }

    const legacy = JSON.parse(localStorage.getItem(LEGACY_STORAGE_KEY) ?? 'null') as { mode?: LearningModeId; currentNodeId?: string; completedNodeIds?: string[]; drafts?: Record<string, string> } | null
    if (!legacy) return initialState
    const nodeStates = Object.fromEntries((legacy.completedNodeIds ?? []).map(nodeId => [nodeId, 'drafted' as const]))
    const migrated = { ...initialState, mode: legacy.mode ?? initialState.mode, currentNodeId: legacy.currentNodeId ?? initialState.currentNodeId, nodeStates, drafts: legacy.drafts ?? {} }
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated)) } catch { /* 当前会话仍可使用迁移结果 */ }
    return migrated
  } catch {
    return initialState
  }
}

export function useLearningNodeProgress() {
  const [progress, setProgress] = useState<LearningNodeProgress>(readProgress)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
  }, [progress])

  const setMode = (mode: LearningModeId) => setProgress(current => ({ ...current, mode }))
  const setCurrentNode = (currentNodeId: string) => setProgress(current => ({ ...current, currentNodeId }))
  const setDraft = (nodeId: string, draft: string) => setProgress(current => ({
    ...current,
    drafts: { ...current.drafts, [nodeId]: draft },
    nodeStates: draft.trim() && !current.nodeStates[nodeId]
      ? { ...current.nodeStates, [nodeId]: 'drafted' }
      : current.nodeStates,
  }))
  const setActionState = (nodeId: string, actionState: LearningActionState) => setProgress(current => ({
    ...current,
    nodeStates: { ...current.nodeStates, [nodeId]: actionState },
  }))

  return { progress, setMode, setCurrentNode, setDraft, setActionState }
}
