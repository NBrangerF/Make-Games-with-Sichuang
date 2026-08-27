import { fingerprintJson, newEntityId } from './ids.ts'
import type { JsonObject, LocalWorkspaceV3, TypedRef } from './schema-v3.ts'
import { canCreateChangeBrief, canCreateReview, canCreateSession } from './state-gates.ts'

export type CommandAdapters = Readonly<{ id: (prefix: string) => string; now: () => string }>
const defaultAdapters: CommandAdapters = { id: newEntityId, now: () => new Date().toISOString() }

function adapters(value?: Partial<CommandAdapters>): CommandAdapters {
  return { ...defaultAdapters, ...value }
}

function jsonObject(value: unknown): JsonObject {
  return JSON.parse(JSON.stringify(value)) as JsonObject
}

export function createProject(workspace: LocalWorkspaceV3, input: { title: string; profile?: JsonObject }, options?: Partial<CommandAdapters>) {
  const use = adapters(options)
  const now = use.now()
  const projectId = use.id('prj')
  workspace.collections.projects.push({ id: projectId, title: input.title.trim() || '未命名项目', profile: input.profile ?? {}, activeVersionId: null, archivedAt: null, sourceRefs: [], sample: false, createdAt: now, updatedAt: now })
  workspace.active.projectId = projectId
  delete workspace.active.versionId
  delete workspace.active.iterationId
  return projectId
}

export function createProjectVersion(workspace: LocalWorkspaceV3, input: { projectId: string; label?: string; summary?: string }, options?: Partial<CommandAdapters>) {
  const use = adapters(options)
  const project = workspace.collections.projects.find(item => item.id === input.projectId)
  if (!project) throw new Error('project does not exist')
  const now = use.now()
  const versionId = use.id('ver')
  const existing = workspace.collections.projectVersions.filter(item => item.projectId === project.id)
  const parentVersionId = project.activeVersionId
  workspace.collections.projectVersions.push({ id: versionId, projectId: project.id, label: input.label?.trim() || `v0.${existing.length + 1}`, parentVersionId, lifecycle: 'working', frozenDigest: null, summary: input.summary?.trim() || '建立一个可继续工作的版本。', currentQuestion: '', nextAction: '写下当前最大的不确定。', sourceRefs: [], createdAt: now, updatedAt: now })
  const projectIndex = workspace.collections.projects.findIndex(item => item.id === project.id)
  workspace.collections.projects[projectIndex] = { ...project, activeVersionId: versionId, updatedAt: now }
  workspace.active.projectId = project.id
  workspace.active.versionId = versionId
  delete workspace.active.iterationId
  return versionId
}

export function createIdeaProject(workspace: LocalWorkspaceV3, input: {
  driver: 'experience' | 'mechanic' | 'theme_or_system' | 'component_or_constraint' | 'redesign'
  prompt: string
  directions: JsonObject[]
  selectedDirectionIndex: number
  title: string
  profile: JsonObject
  prototype: JsonObject
}, options?: Partial<CommandAdapters>) {
  const use = adapters(options)
  const now = use.now()
  const ideaId = use.id('idea')
  workspace.collections.ideaDrafts.push({ id: ideaId, startingDriver: input.driver, constraints: { prompt: input.prompt }, directions: input.directions.slice(0, 3), selectedDirectionIndex: input.selectedDirectionIndex, sourceRefs: [], linkState: 'linked', createdAt: now, updatedAt: now })
  const projectId = createProject(workspace, { title: input.title, profile: input.profile }, use)
  const versionId = createProjectVersion(workspace, { projectId, label: 'v0.1', summary: '由新构想建立的第一个微型原型。' }, use)
  const prototypeId = use.id('pro')
  workspace.collections.prototypes.push({ id: prototypeId, projectId, versionId, title: `${input.title}·纸面原型`, design: input.prototype, sourceRefs: [{ scope: 'workspace', kind: 'idea_draft', id: ideaId, relation: 'derived_from' }], linkState: 'linked', createdAt: now, updatedAt: now })
  const challengeId = use.id('chl')
  workspace.collections.challengeInstances.push({ id: challengeId, purpose: 'independent', ideaId, prototypeId, artifactRefs: [], createdAt: now, updatedAt: now })
  return { ideaId, projectId, versionId, prototypeId }
}

export function startIteration(workspace: LocalWorkspaceV3, input: { projectId: string; versionId: string; uncertainty: string }, options?: Partial<CommandAdapters>) {
  const use = adapters(options)
  const version = workspace.collections.projectVersions.find(item => item.id === input.versionId && item.projectId === input.projectId)
  if (!version) throw new Error('version does not belong to project')
  if (workspace.collections.iterationCycles.some(item => item.versionId === version.id && item.status === 'active')) throw new Error('version already has an active iteration')
  const now = use.now()
  const iterationId = use.id('cyc')
  workspace.collections.iterationCycles.push({ id: iterationId, projectId: input.projectId, versionId: input.versionId, uncertainty: input.uncertainty.trim(), currentStep: 'uncertainty', status: 'active', createdAt: now, updatedAt: now })
  workspace.active.projectId = input.projectId
  workspace.active.versionId = input.versionId
  workspace.active.iterationId = iterationId
  return iterationId
}

export function saveTestPlanDraft(workspace: LocalWorkspaceV3, input: { projectId: string; versionId: string; iterationId: string; question: string; signals: string; disconfirmingSignal: string }, options?: Partial<CommandAdapters>) {
  const use = adapters(options)
  const cycle = workspace.collections.iterationCycles.find(item => item.id === input.iterationId && item.projectId === input.projectId && item.versionId === input.versionId)
  if (!cycle || cycle.status !== 'active') throw new Error('active iteration does not exist')
  const now = use.now()
  const existingIndex = workspace.collections.testPlans.findIndex(item => item.iterationId === cycle.id && item.status !== 'archived')
  const plan = {
    id: existingIndex >= 0 ? workspace.collections.testPlans[existingIndex].id : use.id('plan'),
    projectId: input.projectId, versionId: input.versionId, iterationId: input.iterationId, versionDigest: null, status: 'draft' as const,
    plan: { question: input.question.trim(), signals: input.signals.trim(), disconfirmingSignal: input.disconfirmingSignal.trim() },
    sourceRefs: [], linkState: 'linked' as const, createdAt: existingIndex >= 0 ? workspace.collections.testPlans[existingIndex].createdAt : now, updatedAt: now,
  }
  if (existingIndex >= 0) workspace.collections.testPlans[existingIndex] = plan
  else workspace.collections.testPlans.push(plan)
  const cycleIndex = workspace.collections.iterationCycles.findIndex(item => item.id === cycle.id)
  workspace.collections.iterationCycles[cycleIndex] = { ...cycle, currentStep: 'scope', updatedAt: now }
  return plan.id
}

export function savePrototype(workspace: LocalWorkspaceV3, input: { projectId: string; versionId: string; title: string; design: JsonObject }, options?: Partial<CommandAdapters>) {
  const use = adapters(options)
  const version = workspace.collections.projectVersions.find(item => item.id === input.versionId && item.projectId === input.projectId)
  if (!version || version.lifecycle !== 'working') throw new Error('only a working version may change its prototype')
  const now = use.now()
  const existingIndex = workspace.collections.prototypes.findIndex(item => item.projectId === input.projectId && item.versionId === input.versionId && item.linkState === 'linked')
  const prototype = {
    id: existingIndex >= 0 ? workspace.collections.prototypes[existingIndex].id : use.id('pro'), projectId: input.projectId, versionId: input.versionId,
    title: input.title.trim() || '纸面原型', design: input.design, sourceRefs: existingIndex >= 0 ? workspace.collections.prototypes[existingIndex].sourceRefs : [], linkState: 'linked' as const,
    createdAt: existingIndex >= 0 ? workspace.collections.prototypes[existingIndex].createdAt : now, updatedAt: now,
  }
  if (existingIndex >= 0) workspace.collections.prototypes[existingIndex] = prototype
  else workspace.collections.prototypes.push(prototype)
  return prototype.id
}

export function recordPrototypeRun(workspace: LocalWorkspaceV3, input: { prototypeId: string; projectId: string; versionId: string; note: string }, options?: Partial<CommandAdapters>) {
  const use = adapters(options)
  const version = workspace.collections.projectVersions.find(item => item.id === input.versionId && item.projectId === input.projectId)
  if (!version || version.lifecycle !== 'working') throw new Error('only a working version may record a pre-freeze prototype run')
  const prototype = workspace.collections.prototypes.find(item => item.id === input.prototypeId && item.projectId === input.projectId && item.versionId === input.versionId && item.linkState === 'linked')
  if (!prototype) throw new Error('linked prototype does not exist')
  const now = use.now()
  const runId = use.id('run')
  workspace.collections.prototypeRuns.push({ id: runId, prototypeId: prototype.id, projectId: input.projectId, versionId: input.versionId, configuration: {}, startedAt: now, endedAt: now, status: 'completed', events: [{ id: use.id('event'), kind: 'note', at: now, description: input.note.trim() }], createdAt: now, updatedAt: now })
  return runId
}

export function confirmTestPlan(workspace: LocalWorkspaceV3, testPlanId: string, options?: Partial<CommandAdapters>) {
  const use = adapters(options)
  const planIndex = workspace.collections.testPlans.findIndex(item => item.id === testPlanId && item.linkState === 'linked' && item.status === 'draft')
  if (planIndex < 0) throw new Error('linked draft plan does not exist')
  const plan = workspace.collections.testPlans[planIndex]
  const versionIndex = workspace.collections.projectVersions.findIndex(item => item.id === plan.versionId && item.projectId === plan.projectId)
  if (versionIndex < 0) throw new Error('plan version does not exist')
  const version = workspace.collections.projectVersions[versionIndex]
  const prototype = workspace.collections.prototypes.find(item => item.versionId === version.id && item.linkState === 'linked')
  if (!prototype) throw new Error('confirming a plan requires a linked prototype')
  const hasCompletedRun = workspace.collections.prototypeRuns.some(item => item.prototypeId === prototype.id && item.versionId === version.id && item.status === 'completed')
  if (!hasCompletedRun) throw new Error('confirming a plan requires a completed tabletop prototype run')
  const digest = fingerprintJson(jsonObject({ version, prototype }))
  const now = use.now()
  workspace.collections.projectVersions[versionIndex] = { ...version, lifecycle: 'frozen', frozenDigest: digest, updatedAt: now }
  workspace.collections.testPlans[planIndex] = { ...plan, status: 'confirmed', versionDigest: digest, updatedAt: now }
  return digest
}

export function completePlaytest(workspace: LocalWorkspaceV3, input: { testPlanId: string; kind: 'solo' | 'guided' | 'external' | 'blind'; observations: string[] }, options?: Partial<CommandAdapters>) {
  const use = adapters(options)
  const gate = canCreateSession(workspace, input.testPlanId)
  if (!gate.allowed) throw new Error(gate.reason)
  const plan = workspace.collections.testPlans.find(item => item.id === input.testPlanId)!
  const now = use.now()
  const sessionId = use.id('ses')
  workspace.collections.playtestSessions.push({ id: sessionId, projectId: plan.projectId, versionId: plan.versionId, iterationId: plan.iterationId, testPlanId: plan.id, versionDigest: plan.versionDigest, kind: input.kind, startedAt: now, endedAt: now, status: 'completed', context: { observationCount: input.observations.length }, sourceRefs: [{ scope: 'workspace', kind: 'test_plan', id: plan.id, relation: 'derived_from' }], linkState: 'linked', createdAt: now, updatedAt: now })
  const evidenceIds = input.observations.filter(Boolean).map(content => {
    const evidenceId = use.id('evd')
    workspace.collections.evidenceItems.push({ id: evidenceId, sessionId, projectId: plan.projectId, versionId: plan.versionId, kind: 'observation', at: now, content: content.trim(), sourceRefs: [], createdAt: now, updatedAt: now })
    return evidenceId
  })
  return { sessionId, evidenceIds }
}

export function createEvidenceReview(workspace: LocalWorkspaceV3, input: { sessionIds: string[]; observation: string; interpretation: string; alternative: string }, options?: Partial<CommandAdapters>) {
  const use = adapters(options)
  const gate = canCreateReview(workspace, input.sessionIds)
  if (!gate.allowed) throw new Error(gate.reason)
  const session = workspace.collections.playtestSessions.find(item => item.id === input.sessionIds[0])!
  const now = use.now()
  const reviewId = use.id('rev')
  workspace.collections.evidenceReviews.push({ id: reviewId, projectId: session.projectId, versionId: session.versionId, iterationId: session.iterationId, sessionIds: input.sessionIds, evidenceItemIds: workspace.collections.evidenceItems.filter(item => input.sessionIds.includes(item.sessionId)).map(item => item.id), review: { observation: input.observation.trim(), interpretation: input.interpretation.trim(), alternative: input.alternative.trim() }, sourceRefs: input.sessionIds.map(id => ({ scope: 'workspace', kind: 'playtest_session', id, relation: 'derived_from' })), linkState: 'linked', createdAt: now, updatedAt: now })
  return reviewId
}

export function createRevisionFromReviews(workspace: LocalWorkspaceV3, input: { reviewIds: string[]; primaryChange: string; unchanged: string[]; rationale: string }, options?: Partial<CommandAdapters>) {
  const use = adapters(options)
  const gate = canCreateChangeBrief(workspace, input.reviewIds)
  if (!gate.allowed) throw new Error(gate.reason)
  const now = use.now()
  const source = workspace.collections.projectVersions.find(item => item.id === gate.versionId)!
  const project = workspace.collections.projects.find(item => item.id === gate.projectId)!
  const versionId = use.id('ver')
  const sequence = workspace.collections.projectVersions.filter(item => item.projectId === project.id).length + 1
  workspace.collections.projectVersions.push({ id: versionId, projectId: project.id, label: `v0.${sequence}`, parentVersionId: source.id, lifecycle: 'working', frozenDigest: null, summary: input.primaryChange.trim(), currentQuestion: '', nextAction: '写下新版本最大的不确定。', sourceRefs: [], createdAt: now, updatedAt: now })
  workspace.collections.changeBriefs.push({ id: use.id('chg'), projectId: project.id, iterationId: gate.iterationId, reviewIds: input.reviewIds, fromVersionId: source.id, toVersionId: versionId, primaryChange: input.primaryChange.trim(), unchanged: input.unchanged.filter(Boolean).map(item => item.trim()), rationale: input.rationale.trim(), createdAt: now, updatedAt: now })
  const projectIndex = workspace.collections.projects.findIndex(item => item.id === project.id)
  workspace.collections.projects[projectIndex] = { ...project, activeVersionId: versionId, updatedAt: now }
  const cycleIndex = workspace.collections.iterationCycles.findIndex(item => item.id === gate.iterationId)
  workspace.collections.iterationCycles[cycleIndex] = { ...workspace.collections.iterationCycles[cycleIndex], status: 'completed', currentStep: 'version', updatedAt: now }
  workspace.active.projectId = project.id
  workspace.active.versionId = versionId
  delete workspace.active.iterationId
  return versionId
}

export function attachResource(workspace: LocalWorkspaceV3, input: { resourceId: string; contextRef: TypedRef; reason: string }, options?: Partial<CommandAdapters>) {
  const use = adapters(options)
  const existing = workspace.collections.resourceAttachments.find(item => item.resourceId === input.resourceId && item.contextRef.scope === input.contextRef.scope && item.contextRef.kind === input.contextRef.kind && item.contextRef.id === input.contextRef.id)
  if (existing) return existing.id
  const now = use.now()
  const id = use.id('res')
  workspace.collections.resourceAttachments.push({ id, resourceId: input.resourceId, contextRef: input.contextRef, reason: input.reason.trim(), createdAt: now, updatedAt: now })
  return id
}
