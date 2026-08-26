import { useEffect, useState } from 'react'
import type { LearningModeId } from './learning-node-catalog'

const STORAGE_KEY = 'tabletop-workshop-learning-node-progress-v1'

export type LearningNodeProgress = Readonly<{
  schemaVersion: 1
  mode: LearningModeId
  currentNodeId: string
  completedNodeIds: string[]
  drafts: Record<string, string>
}>

const initialState: LearningNodeProgress = {
  schemaVersion: 1,
  mode: 'independent',
  currentNodeId: 'node-01',
  completedNodeIds: [],
  drafts: {},
}

function readProgress(): LearningNodeProgress {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null') as Partial<LearningNodeProgress> | null
    if (!stored || stored.schemaVersion !== 1) return initialState
    return {
      ...initialState,
      ...stored,
      completedNodeIds: Array.isArray(stored.completedNodeIds) ? [...new Set(stored.completedNodeIds)] : [],
      drafts: stored.drafts && typeof stored.drafts === 'object' ? stored.drafts : {},
    }
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
  }))
  const completeNode = (nodeId: string, nextNodeId: string) => setProgress(current => ({
    ...current,
    currentNodeId: nextNodeId,
    completedNodeIds: current.completedNodeIds.includes(nodeId)
      ? current.completedNodeIds
      : [...current.completedNodeIds, nodeId],
  }))

  return { progress, setMode, setCurrentNode, setDraft, completeNode }
}
