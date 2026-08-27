import type { JsonObject, JsonValue, LocalWorkspaceV3, WorkspaceCollections } from './schema-v3.ts'

export type ValidationFailure = Readonly<{
  path: string
  code: string
  message: string
}>

export type ValidationResult = Readonly<{
  ok: boolean
  failures: ValidationFailure[]
}>

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export function isJsonValue(value: unknown): value is JsonValue {
  if (value === null || typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') return true
  if (Array.isArray(value)) return value.every(isJsonValue)
  return isObject(value) && Object.values(value).every(isJsonValue)
}

export function asJsonObject(value: unknown): JsonObject | null {
  return isObject(value) && Object.values(value).every(isJsonValue) ? value as JsonObject : null
}

const collectionNames = [
  'courseEnrollments',
  'activityAttempts',
  'artifacts',
  'ideaDrafts',
  'challengeInstances',
  'projects',
  'projectVersions',
  'prototypes',
  'prototypeRuns',
  'iterationCycles',
  'testPlans',
  'playtestSessions',
  'evidenceItems',
  'evidenceReviews',
  'evidenceSyntheses',
  'changeBriefs',
  'resourceAttachments',
  'agentSuggestions',
  'agentRuns',
  'tombstones',
] as const satisfies readonly (keyof WorkspaceCollections)[]

function add(failures: ValidationFailure[], path: string, code: string, message: string) {
  failures.push({ path, code, message })
}

function requireString(value: unknown, path: string, failures: ValidationFailure[]) {
  if (typeof value !== 'string' || value.length === 0) add(failures, path, 'required_string', 'expected a non-empty string')
}

function indexById(items: readonly unknown[], path: string, failures: ValidationFailure[]) {
  const index = new Map<string, Record<string, unknown>>()
  items.forEach((item, itemIndex) => {
    if (!isObject(item)) {
      add(failures, `${path}[${itemIndex}]`, 'object_required', 'expected an object')
      return
    }
    requireString(item.id, `${path}[${itemIndex}].id`, failures)
    if (typeof item.id !== 'string' || item.id.length === 0) return
    if (index.has(item.id)) add(failures, `${path}[${itemIndex}].id`, 'duplicate_id', `duplicate id ${item.id}`)
    index.set(item.id, item)
  })
  return index
}

function belongsTo(item: Record<string, unknown> | undefined, field: string, expected: string) {
  return item?.[field] === expected
}

export function validateWorkspaceV3(value: unknown): ValidationResult {
  const failures: ValidationFailure[] = []
  if (!isObject(value)) return { ok: false, failures: [{ path: '$', code: 'object_required', message: 'workspace must be an object' }] }
  if (value.schemaVersion !== 3) add(failures, '$.schemaVersion', 'schema_version', 'expected schemaVersion 3')
  requireString(value.workspaceId, '$.workspaceId', failures)
  if (!Number.isInteger(value.revision) || Number(value.revision) < 0) add(failures, '$.revision', 'revision', 'expected a non-negative integer')
  if (!isObject(value.collections)) {
    add(failures, '$.collections', 'collections_required', 'expected collections object')
    return { ok: false, failures }
  }

  for (const name of collectionNames) {
    if (!Array.isArray(value.collections[name])) add(failures, `$.collections.${name}`, 'array_required', 'expected an array')
  }
  if (failures.some(item => item.code === 'array_required')) return { ok: false, failures }

  const collections = value.collections as unknown as WorkspaceCollections
  const enrollmentIndex = indexById(collections.courseEnrollments, '$.collections.courseEnrollments', failures)
  const attemptIndex = indexById(collections.activityAttempts, '$.collections.activityAttempts', failures)
  const artifactIndex = indexById(collections.artifacts, '$.collections.artifacts', failures)
  const ideaIndex = indexById(collections.ideaDrafts, '$.collections.ideaDrafts', failures)
  const challengeIndex = indexById(collections.challengeInstances, '$.collections.challengeInstances', failures)
  const projectIndex = indexById(collections.projects, '$.collections.projects', failures)
  const versionIndex = indexById(collections.projectVersions, '$.collections.projectVersions', failures)
  const prototypeIndex = indexById(collections.prototypes, '$.collections.prototypes', failures)
  const runIndex = indexById(collections.prototypeRuns, '$.collections.prototypeRuns', failures)
  const cycleIndex = indexById(collections.iterationCycles, '$.collections.iterationCycles', failures)
  const planIndex = indexById(collections.testPlans, '$.collections.testPlans', failures)
  const sessionIndex = indexById(collections.playtestSessions, '$.collections.playtestSessions', failures)
  const evidenceIndex = indexById(collections.evidenceItems, '$.collections.evidenceItems', failures)
  const reviewIndex = indexById(collections.evidenceReviews, '$.collections.evidenceReviews', failures)
  const synthesisIndex = indexById(collections.evidenceSyntheses, '$.collections.evidenceSyntheses', failures)
  const briefIndex = indexById(collections.changeBriefs, '$.collections.changeBriefs', failures)

  collections.activityAttempts.forEach((attempt, index) => {
    const enrollment = enrollmentIndex.get(attempt.enrollmentId)
    if (!enrollment) add(failures, `$.collections.activityAttempts[${index}].enrollmentId`, 'missing_enrollment', 'activity attempt enrollment does not exist')
    else if (enrollment.courseId !== attempt.courseId || enrollment.courseVersion !== attempt.courseVersion) add(failures, `$.collections.activityAttempts[${index}]`, 'course_scope_mismatch', 'attempt course must match enrollment course')
    for (const ref of attempt.artifactRefs) if (ref.scope === 'workspace' && ref.kind === 'artifact' && !artifactIndex.has(ref.id)) add(failures, `$.collections.activityAttempts[${index}].artifactRefs`, 'missing_artifact', `missing artifact ${ref.id}`)
  })

  collections.challengeInstances.forEach((challenge, index) => {
    if (!ideaIndex.has(challenge.ideaId)) add(failures, `$.collections.challengeInstances[${index}].ideaId`, 'missing_idea', 'challenge idea does not exist')
    if (challenge.prototypeId && !prototypeIndex.has(challenge.prototypeId)) add(failures, `$.collections.challengeInstances[${index}].prototypeId`, 'missing_prototype', 'challenge prototype does not exist')
  })

  const globalIds = new Map<string, string>()
  for (const name of collectionNames.filter(name => name !== 'tombstones')) {
    const items = collections[name] as readonly unknown[]
    items.forEach((item, itemIndex) => {
      if (!isObject(item) || typeof item.id !== 'string') return
      const previous = globalIds.get(item.id)
      if (previous) add(failures, `$.collections.${name}[${itemIndex}].id`, 'global_duplicate_id', `${item.id} already appears in ${previous}`)
      else globalIds.set(item.id, name)
    })
  }

  collections.artifacts.forEach((artifact, index) => {
    if (artifact.artifactType === 'entity_reference' && artifact.payload.entityRef.scope === 'workspace' && !globalIds.has(artifact.payload.entityRef.id)) add(failures, `$.collections.artifacts[${index}].payload.entityRef`, 'missing_entity_reference', 'course entity reference target does not exist')
  })
  collections.resourceAttachments.forEach((attachment, index) => {
    if (attachment.contextRef.scope !== 'workspace' || !globalIds.has(attachment.contextRef.id)) add(failures, `$.collections.resourceAttachments[${index}].contextRef`, 'missing_attachment_context', 'resource attachment context does not exist')
  })

  collections.projects.forEach((project, index) => {
    if (project.activeVersionId && !belongsTo(versionIndex.get(project.activeVersionId), 'projectId', project.id)) {
      add(failures, `$.collections.projects[${index}].activeVersionId`, 'invalid_active_version', 'active version must belong to the project')
    }
  })

  collections.projectVersions.forEach((version, index) => {
    if (!projectIndex.has(version.projectId)) add(failures, `$.collections.projectVersions[${index}].projectId`, 'missing_project', 'version project does not exist')
    if (version.parentVersionId && !belongsTo(versionIndex.get(version.parentVersionId), 'projectId', version.projectId)) {
      add(failures, `$.collections.projectVersions[${index}].parentVersionId`, 'invalid_parent_version', 'parent version must belong to the same project')
    }
    if (version.lifecycle === 'frozen' && !version.frozenDigest) add(failures, `$.collections.projectVersions[${index}].frozenDigest`, 'missing_digest', 'frozen version requires a digest')
  })

  collections.prototypes.forEach((prototype, index) => {
    if (prototype.linkState === 'linked') {
      if (!prototype.projectId || !prototype.versionId) add(failures, `$.collections.prototypes[${index}]`, 'missing_scope', 'linked prototype requires project and version')
      else if (!belongsTo(versionIndex.get(prototype.versionId), 'projectId', prototype.projectId)) add(failures, `$.collections.prototypes[${index}].versionId`, 'scope_mismatch', 'prototype version must belong to its project')
    }
  })

  collections.prototypeRuns.forEach((run, index) => {
    const prototype = prototypeIndex.get(run.prototypeId)
    if (!prototype) add(failures, `$.collections.prototypeRuns[${index}].prototypeId`, 'missing_prototype', 'run prototype does not exist')
    if (!belongsTo(versionIndex.get(run.versionId), 'projectId', run.projectId)) add(failures, `$.collections.prototypeRuns[${index}].versionId`, 'scope_mismatch', 'run version must belong to its project')
    if (prototype && (prototype.projectId !== run.projectId || prototype.versionId !== run.versionId)) add(failures, `$.collections.prototypeRuns[${index}]`, 'prototype_scope_mismatch', 'run scope must match prototype scope')
    if (run.status === 'completed' && !run.endedAt) add(failures, `$.collections.prototypeRuns[${index}].endedAt`, 'missing_end', 'completed run requires endedAt')
  })

  collections.iterationCycles.forEach((cycle, index) => {
    if (!belongsTo(versionIndex.get(cycle.versionId), 'projectId', cycle.projectId)) add(failures, `$.collections.iterationCycles[${index}].versionId`, 'scope_mismatch', 'cycle version must belong to its project')
    const duplicateActive = collections.iterationCycles.some(other => other.id !== cycle.id && other.versionId === cycle.versionId && other.status === 'active' && cycle.status === 'active')
    if (duplicateActive) add(failures, `$.collections.iterationCycles[${index}].status`, 'multiple_active_cycles', 'a version may have only one active cycle')
  })

  collections.testPlans.forEach((plan, index) => {
    if (plan.linkState === 'linked') {
      if (!plan.projectId || !plan.versionId || !plan.iterationId) add(failures, `$.collections.testPlans[${index}]`, 'missing_scope', 'linked test plan requires project, version and iteration')
      else {
        if (!belongsTo(versionIndex.get(plan.versionId), 'projectId', plan.projectId)) add(failures, `$.collections.testPlans[${index}].versionId`, 'scope_mismatch', 'plan version must belong to its project')
        const cycle = cycleIndex.get(plan.iterationId)
        if (!cycle || cycle.projectId !== plan.projectId || cycle.versionId !== plan.versionId) add(failures, `$.collections.testPlans[${index}].iterationId`, 'cycle_scope_mismatch', 'plan cycle must share project and version')
      }
    }
    if (plan.status === 'confirmed' && !plan.versionDigest) add(failures, `$.collections.testPlans[${index}].versionDigest`, 'missing_digest', 'confirmed plan requires frozen version digest')
  })

  collections.playtestSessions.forEach((session, index) => {
    if (session.linkState === 'linked') {
      const plan = session.testPlanId ? planIndex.get(session.testPlanId) : undefined
      if (!session.projectId || !session.versionId || !session.iterationId || !plan) add(failures, `$.collections.playtestSessions[${index}]`, 'missing_scope', 'linked session requires project, version, iteration and plan')
      else if (plan.projectId !== session.projectId || plan.versionId !== session.versionId || plan.iterationId !== session.iterationId) add(failures, `$.collections.playtestSessions[${index}].testPlanId`, 'plan_scope_mismatch', 'session scope must match plan scope')
    }
    if (session.status === 'completed' && (!session.startedAt || !session.endedAt)) add(failures, `$.collections.playtestSessions[${index}]`, 'incomplete_timing', 'completed session requires start and end times')
  })

  collections.evidenceItems.forEach((item, index) => {
    if (!sessionIndex.has(item.sessionId)) add(failures, `$.collections.evidenceItems[${index}].sessionId`, 'missing_session', 'evidence session does not exist')
  })

  collections.evidenceReviews.forEach((review, index) => {
    for (const sessionId of review.sessionIds) if (!sessionIndex.has(sessionId)) add(failures, `$.collections.evidenceReviews[${index}].sessionIds`, 'missing_session', `missing session ${sessionId}`)
    for (const evidenceId of review.evidenceItemIds) if (!evidenceIndex.has(evidenceId)) add(failures, `$.collections.evidenceReviews[${index}].evidenceItemIds`, 'missing_evidence', `missing evidence ${evidenceId}`)
  })

  collections.evidenceSyntheses.forEach((synthesis, index) => {
    if (synthesis.parentSynthesisId && !synthesisIndex.has(synthesis.parentSynthesisId)) add(failures, `$.collections.evidenceSyntheses[${index}].parentSynthesisId`, 'missing_parent', 'parent synthesis does not exist')
    for (const reviewId of synthesis.reviewIds) if (!reviewIndex.has(reviewId)) add(failures, `$.collections.evidenceSyntheses[${index}].reviewIds`, 'missing_review', `missing review ${reviewId}`)
  })

  collections.changeBriefs.forEach((brief, index) => {
    const fromVersion = versionIndex.get(brief.fromVersionId)
    const toVersion = versionIndex.get(brief.toVersionId)
    const cycle = cycleIndex.get(brief.iterationId)
    if (!fromVersion || !toVersion) add(failures, `$.collections.changeBriefs[${index}]`, 'missing_version', 'change brief versions must exist')
    else if (fromVersion.projectId !== brief.projectId || toVersion.projectId !== brief.projectId || toVersion.parentVersionId !== brief.fromVersionId) add(failures, `$.collections.changeBriefs[${index}]`, 'revision_edge_mismatch', 'change brief must connect versions in one project and match target parent')
    if (!cycle || cycle.projectId !== brief.projectId || cycle.versionId !== brief.fromVersionId) add(failures, `$.collections.changeBriefs[${index}].iterationId`, 'cycle_scope_mismatch', 'change brief cycle must target source version')
    for (const reviewId of brief.reviewIds) if (!reviewIndex.has(reviewId)) add(failures, `$.collections.changeBriefs[${index}].reviewIds`, 'missing_review', `missing review ${reviewId}`)
    const duplicateTarget = collections.changeBriefs.some(other => other.id !== brief.id && (other.toVersionId === brief.toVersionId || other.id === brief.id))
    if (duplicateTarget) add(failures, `$.collections.changeBriefs[${index}].toVersionId`, 'duplicate_revision_target', 'one target version may belong to only one change brief')
    const duplicateSource = collections.changeBriefs.some(other => other.id !== brief.id && (other.iterationId === brief.iterationId || other.fromVersionId === brief.fromVersionId))
    if (duplicateSource) add(failures, `$.collections.changeBriefs[${index}].fromVersionId`, 'duplicate_revision_source', 'one iteration and source version may create only one outgoing revision')
  })

  void runIndex
  void briefIndex
  void attemptIndex
  void challengeIndex

  if (isObject(value.active)) {
    const active = value.active
    if (typeof active.projectId === 'string' && !projectIndex.has(active.projectId)) add(failures, '$.active.projectId', 'missing_active_project', 'active project does not exist')
    if (typeof active.versionId === 'string' && !versionIndex.has(active.versionId)) add(failures, '$.active.versionId', 'missing_active_version', 'active version does not exist')
    if (typeof active.iterationId === 'string' && !cycleIndex.has(active.iterationId)) add(failures, '$.active.iterationId', 'missing_active_cycle', 'active cycle does not exist')
    if (typeof active.enrollmentId === 'string' && !enrollmentIndex.has(active.enrollmentId)) add(failures, '$.active.enrollmentId', 'missing_active_enrollment', 'active enrollment does not exist')
  } else add(failures, '$.active', 'active_required', 'expected active object')

  return { ok: failures.length === 0, failures }
}

export function assertWorkspaceV3(value: unknown): asserts value is LocalWorkspaceV3 {
  const result = validateWorkspaceV3(value)
  if (!result.ok) throw new Error(result.failures.map(item => `${item.path} [${item.code}] ${item.message}`).join('\n'))
}
