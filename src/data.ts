import resourceIndexRecord from '../content/resource-index.json'
import guideRecords from '../content/guides.json'
import glossaryIndexRecord from '../content/glossary-index.json'
import designConstraintRecord from '../content/design-constraints.json'

export const stages = ['体验意图', '核心系统', '最小原型', '测试与反馈', '规则与信息', '呈现与发布'] as const
export type Stage = (typeof stages)[number]

export type StuckPoint = { title: string; next: string; stage: Stage; principle: string }
export const stuckPoints: StuckPoint[] = [
  { title: '我只有一个模糊的点子', next: '把题材变成可测试的体验目标', stage: '体验意图', principle: '先描述玩家要做出的决定和你希望观察到的反应，不急着寻找一套“最合适”的机制。' },
  { title: '规则很多，但还没有真正玩过', next: '裁出一份今天就能上桌的原型', stage: '最小原型', principle: '这一版只需要回答一个问题。保留核心体验的宽度，删掉暂时不会影响答案的内容和美术。' },
  { title: '测试意见互相矛盾', next: '分开观察、感受、建议与设计决定', stage: '测试与反馈', principle: '玩家负责描述经历，设计师负责诊断。先寻找反复出现的症状，再决定是否、以及如何改变。' },
  { title: '陌生人看不懂规则', next: '准备一次规则与组件的盲测', stage: '规则与信息', principle: '盲测同时检验规则、设置、桌面信息和玩家辅助。记录他们第一次偏离预期的具体时刻。' },
]

export type Resource = { id: string; title: string; creator: string; href: string; type: string; evidenceType: string; format: string; access: string; language: string[]; stages: Stage[]; useful: string; limitation: string; status: string; lastCheckedAt: string }
export type ResourceReference = Pick<Resource, 'id' | 'title' | 'href'>
export const resourceIndex = resourceIndexRecord as ResourceReference[]

export type ResourceEntryPoint = {
  id: string
  title: string
  question: string
  outcome: string
  resourceIds: string[]
  evidenceBoundary: string
}
export type ResourceEntryReference = Pick<ResourceEntryPoint, 'id' | 'title'>
export type ResourceStageGroup = { stage: Stage; prompt: string; entryIds: string[] }
export type ResourceAudiencePath = {
  id: string
  title: string
  situation: string
  entryId: string
  why: string
}
export type ResourceLearningStep = {
  resourceId: string
  guideTitle: string
  purpose: string
  focus: string
  action: string
}
export type ResourceLearningPath = {
  entryId: string
  title: string
  intro: string
  steps: ResourceLearningStep[]
}
export type ResourceAssessment = {
  resourceId: string
  useModes: string[]
  audienceLevels: string[]
  reviewDepth: string
  contextClarity: string
  actionability: string
  transferability: string
  currencyRisk: string
  rightsStatus: string
  commercialContext: string
  bestFor: string
  doNotUseFor: string
  reviewedAt: string
  status: string
}

export type RubricDimension = { id: string; label: string; question: string; options: Record<string, string> }
export type ResourceEvaluationRubric = { schemaVersion: number; principle: string; dimensions: RubricDimension[] }
export type ResourceDiscoveryCatalog = {
  resourceEntryPoints: ResourceEntryReference[]
  resourceEntryPointPrinciple: string
  resourceStageGroups: ResourceStageGroup[]
  resourceAudiencePathPrinciple: string
  resourceAudiencePaths: ResourceAudiencePath[]
  resourceLearningPathPrinciple: string
  resourceLearningPaths: ResourceLearningPath[]
}
export type ResourceEntryCatalog = {
  schemaVersion: number
  entry: ResourceEntryPoint
  resources: Resource[]
  resourceAssessments: ResourceAssessment[]
}
export type ResourceCatalog = {
  resources: Resource[]
  resourceAssessments: ResourceAssessment[]
  resourceEntryPoints: ResourceEntryPoint[]
  resourceEntryPointPrinciple: string
  resourceEvaluationRubric: ResourceEvaluationRubric
}

export type GlossaryTerm = {
  id: string
  term: string
  aliases: string[]
  definition: string
  notThis: string
  example: string
  stages: Stage[]
  guideIds: string[]
  relatedIds: string[]
  sourceIds: string[]
  claimIds: string[]
  status: string
}
export type GlossaryReference = Pick<GlossaryTerm, 'id' | 'term'>
export const glossaryIndex = glossaryIndexRecord as GlossaryReference[]

export type FrameworkMove = { label: string; prompt: string }
export type Framework = {
  id: string
  name: string
  shortName: string
  sourceId: string
  question: string
  bestFor: string
  notFor: string
  status: string
  inputs: string[]
  moves: FrameworkMove[]
  output: string
  stages: Stage[]
}

export type GuideStep = { label: string; prompt: string; example: string }
export type GuideMistake = { mistake: string; repair: string }
export type GuideToolId = 'experience-intent' | 'core-loop' | 'redesign' | 'test-plan' | 'playtest-session' | 'feedback' | 'evidence-synthesis' | 'playtest-selector' | 'constraint-deck' | 'balance-pass' | 'decision-trace' | 'shared-decision' | 'theme-review' | 'production-ledger' | 'route-map' | 'teaching-path' | 'accessibility-observation' | 'version-governance' | 'prototype-scope' | 'issue-to-system'
export type DesignToolId = Exclude<GuideToolId, 'test-plan'>
export type Guide = {
  id: string
  title: string
  stage: Stage
  problem: string
  outcome: string
  coreMinutes: number
  opening: string
  steps: GuideStep[]
  commonMistakes: GuideMistake[]
  whenToBreak: string[]
  exercise: { title: string; prompt: string; exampleOutput: string }
  evidenceBoundary: string
  resourceIds: string[]
  claimIds: string[]
  conceptIds: string[]
  doneWhen: string[]
  backtracksTo: string[]
  nextOptions: string[]
  toolIds: GuideToolId[]
  status: string
}
export const guides = guideRecords as Guide[]
export type ConceptActionGuideReference = Pick<Guide, 'id' | 'title' | 'stage'>
export type ConceptActionEntry = {
  conceptId: string
  specialGuideIds: string[]
  toolIds: DesignToolId[]
}
export type ConceptActionIndex = {
  schemaVersion: number
  principle: string
  specialGuides: ConceptActionGuideReference[]
  entries: ConceptActionEntry[]
}
export type DesignConstraintCard = {
  id: string
  label: string
  prompt: string
  conceptIds: string[]
}
export type DesignConstraints = {
  schemaVersion: number
  principle: string
  evidenceBoundary: string
  observations: DesignConstraintCard[]
  moves: DesignConstraintCard[]
  boundaries: DesignConstraintCard[]
}
export const designConstraints = designConstraintRecord as DesignConstraints
