import learningNodeDocument from '../content/learning-nodes.json'
import type { GuideToolId } from './data'
import type { LearningContentId } from './learning-content-route'

export type LearningModeId = 'guided' | 'independent' | 'project'
export type LearningTrackId = 'observe' | 'iteration'
export type LearningActionState = 'not-started' | 'drafted' | 'tabletop' | 'tested' | 'revised'

export type LearningMode = Readonly<{
  id: LearningModeId
  label: string
  minutes: string
  description: string
}>

export type LearningNodeLink = Readonly<{
  id: string
  title: string
}>

export type LearningNode = Readonly<{
  id: string
  order: number
  track: LearningTrackId
  trackOrder: number
  requiredState: Exclude<LearningActionState, 'not-started'>
  title: string
  question: string
  thought: string
  example: string
  action: string
  guidedHint: string
  challengeHint: string
  projectHint: string
  toolTitle: string
  toolPrompt: string
  toolPlaceholder: string
  output: string
  doneWhen: string
  limit: string
  toolId: GuideToolId
  conceptIds: string[]
  resourceEntryIds: string[]
  sourceContentIds: LearningContentId[]
  sourceGuideIds: string[]
  cases: LearningNodeLink[]
  branches: LearningNodeLink[]
  nextNodeId: string
  nextKind?: 'loop' | 'handoff'
}>

type LearningNodeDocument = Readonly<{
  schemaVersion: number
  principle: string
  modes: LearningMode[]
  nodes: LearningNode[]
}>

const document = learningNodeDocument as LearningNodeDocument

export const learningNodePrinciple = document.principle
export const learningModes = document.modes
export const learningNodes: LearningNode[] = [...document.nodes].sort((a, b) => a.order - b.order)
export const learningNodeIds = new Set(learningNodes.map(node => node.id))
export const learningNodeById = new Map<string, LearningNode>(learningNodes.map(node => [node.id, node]))
export const learningDestinationTitles = new Map([
  ['first-tabletop', '把观察带进第一次落桌'],
  ['workshop', '返回基础设计工作室'],
  ['observe', '进入观察实验室'],
  ['iteration', '进入原型迭代主线'],
])

export function isLearningNodeId(value: string | undefined): value is string {
  return typeof value === 'string' && learningNodeIds.has(value)
}

export function previousLearningNode(nodeId: string) {
  const node = learningNodeById.get(nodeId)
  if (!node) return undefined
  return learningNodes.find(candidate => candidate.track === node.track && candidate.trackOrder === node.trackOrder - 1)
}
