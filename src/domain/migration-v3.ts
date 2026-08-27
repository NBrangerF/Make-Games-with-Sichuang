import {
  ACCESSIBILITY_STORAGE_KEY,
  BALANCE_STORAGE_KEY,
  CONSTRAINT_STORAGE_KEY,
  CORE_LOOP_STORAGE_KEY,
  DECISION_TRACE_STORAGE_KEY,
  EVIDENCE_SYNTHESIS_STORAGE_KEY,
  EXPERIENCE_INTENT_STORAGE_KEY,
  FEEDBACK_REVIEW_STORAGE_KEY,
  FIRST_TABLETOP_STORAGE_KEY,
  ISSUE_TO_SYSTEM_STORAGE_KEY,
  LEARNING_PROGRESS_STORAGE_KEY,
  LEGACY_LEARNING_PROGRESS_STORAGE_KEY,
  LEGACY_PROJECT_WORKSPACE_STORAGE_KEY,
  PLAYTEST_SESSION_STORAGE_KEY,
  PRODUCTION_LEDGER_STORAGE_KEY,
  PROJECT_WORKSPACE_STORAGE_KEY,
  PROTOTYPE_SCOPE_STORAGE_KEY,
  PUBLISHING_ROUTE_STORAGE_KEY,
  REDESIGN_STORAGE_KEY,
  SHARED_DECISION_STORAGE_KEY,
  TEACHING_PATH_STORAGE_KEY,
  TEST_PLAN_DRAFT_STORAGE_KEY,
  TEST_PLAN_STORAGE_KEY,
  THEME_REVIEW_STORAGE_KEY,
  VERSION_GOVERNANCE_STORAGE_KEY,
} from '../storage-keys.ts'
import { deterministicLegacyId, fingerprintJson, legacyMapKey } from './ids.ts'
import type { LegacyScanEntry, LegacyScanReport } from './legacy-scan.ts'
import {
  createEmptyWorkspace,
  type ActivityAttempt,
  type Artifact,
  type CourseEnrollment,
  type EvidenceItem,
  type EvidenceReview,
  type EvidenceSynthesis,
  type IdeaDraft,
  type JsonObject,
  type JsonValue,
  type LegacyRef,
  type LocalWorkspaceV3,
  type MigratedToolArtifactType,
  type MigrationIssue,
  type PlaytestSession,
  type Project,
  type ProjectVersion,
  type Prototype,
  type TestPlan,
  type TypedRef,
} from './schema-v3.ts'
import { asJsonObject } from './validation-v3.ts'

type MutableWorkspace = {
  -readonly [K in keyof LocalWorkspaceV3]: LocalWorkspaceV3[K]
}

const artifactTypeByKey = new Map<string, MigratedToolArtifactType>([
  [EXPERIENCE_INTENT_STORAGE_KEY, 'experience_intent'],
  [CORE_LOOP_STORAGE_KEY, 'core_loop'],
  [PROTOTYPE_SCOPE_STORAGE_KEY, 'prototype_scope'],
  [VERSION_GOVERNANCE_STORAGE_KEY, 'version_governance'],
  [ISSUE_TO_SYSTEM_STORAGE_KEY, 'issue_to_system'],
  [REDESIGN_STORAGE_KEY, 'redesign'],
  [CONSTRAINT_STORAGE_KEY, 'constraint_experiment'],
  [BALANCE_STORAGE_KEY, 'balance_pass'],
  [DECISION_TRACE_STORAGE_KEY, 'decision_trace'],
  [SHARED_DECISION_STORAGE_KEY, 'shared_decision'],
  [THEME_REVIEW_STORAGE_KEY, 'theme_review'],
  [PRODUCTION_LEDGER_STORAGE_KEY, 'production_ledger'],
  [PUBLISHING_ROUTE_STORAGE_KEY, 'publishing_route'],
  [TEACHING_PATH_STORAGE_KEY, 'teaching_path'],
  [ACCESSIBILITY_STORAGE_KEY, 'accessibility_observation'],
])

function stringValue(value: JsonValue | undefined) {
  return typeof value === 'string' ? value : ''
}

function numberValue(value: JsonValue | undefined, fallback = 0) {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback
}

function objectValue(value: JsonValue | null | undefined): JsonObject | null {
  return value ? asJsonObject(value) : null
}

function arrayValue(value: JsonValue | undefined) {
  return Array.isArray(value) ? value : []
}

function snapshot(value: JsonValue): JsonObject {
  return objectValue(value) ?? (Array.isArray(value) ? { items: value } : { value })
}

function timestamp(record: JsonObject, fallback: string) {
  return stringValue(record.updatedAt) || stringValue(record.completedAt) || stringValue(record.createdAt) || fallback
}

function legacyRef(entry: LegacyScanEntry, value: JsonValue, index: number | null): LegacyRef {
  const object = objectValue(value)
  const rawId = object ? stringValue(object.id) : ''
  return {
    sourceKey: entry.descriptor.key,
    sourceSchema: entry.sourceSchema,
    legacyId: rawId || null,
    sourceIndex: index,
    normalizedFingerprint: fingerprintJson(value),
  }
}

function addId(idMap: Record<string, string>, prefix: string, ref: LegacyRef) {
  const key = legacyMapKey(ref)
  const existing = idMap[key]
  if (existing) return existing
  const id = deterministicLegacyId(prefix, ref)
  idMap[key] = id
  return id
}

function recordItems(entry: LegacyScanEntry) {
  if (!entry.value) return []
  if (Array.isArray(entry.value)) return entry.value.map((value, index) => ({ value, index, draft: false }))
  const object = objectValue(entry.value)
  if (!object) return [{ value: entry.value, index: null, draft: false }]
  const items: { value: JsonValue; index: number | null; draft: boolean }[] = []
  if ('draft' in object && object.draft !== null) items.push({ value: object.draft, index: -1, draft: true })
  const collectionName = entry.descriptor.collection
  const collection = collectionName ? object[collectionName] : undefined
  if (Array.isArray(collection)) collection.forEach((value, index) => items.push({ value, index, draft: false }))
  else if (!('draft' in object) && !collectionName) items.push({ value: entry.value, index: null, draft: false })
  return items
}

function catalogRef(kind: string, id: string, relation: TypedRef['relation']): TypedRef {
  return { scope: 'catalog', kind, id, relation }
}

export function migrateLegacyReport(report: LegacyScanReport, input: { workspaceId: string; now?: string }): LocalWorkspaceV3 {
  const now = input.now ?? new Date().toISOString()
  const base = createEmptyWorkspace(input.workspaceId, now)
  const workspace = base as MutableWorkspace
  const collections = workspace.collections
  const idMap: Record<string, string> = {}
  const issues: MigrationIssue[] = []
  const entries = new Map(report.entries.map(entry => [entry.descriptor.key, entry]))
  const legacyEntityIds = new Map<string, string>()
  const versionByLabel = new Map<string, string[]>()

  const issue = (entry: LegacyScanEntry, level: MigrationIssue['level'], code: string, message: string, ref?: LegacyRef) => {
    issues.push({ sourceKey: entry.descriptor.key, level, code, message, ...(ref ? { legacyRef: ref } : {}) })
  }

  const registerLegacyId = (entry: LegacyScanEntry, rawId: string, targetId: string) => {
    if (rawId) legacyEntityIds.set(`${entry.descriptor.key}|${rawId}`, targetId)
  }

  const projectEntry = [entries.get(PROJECT_WORKSPACE_STORAGE_KEY), entries.get(LEGACY_PROJECT_WORKSPACE_STORAGE_KEY)].find(entry => entry?.present && objectValue(entry.value))
  if (projectEntry?.value) {
    const source = objectValue(projectEntry.value)!
    const isUntouchedSample = stringValue(source.id) === 'local-project' && stringValue(source.title) === '未命名的海上贸易游戏' && !stringValue(source.updatedAt)
    if (isUntouchedSample) issue(projectEntry, 'info', 'sample_project_skipped', 'untouched sea-trade sample was not migrated as a user project')
    else {
      const ref = legacyRef(projectEntry, source, null)
      const projectId = addId(idMap, 'prj', ref)
      registerLegacyId(projectEntry, stringValue(source.id), projectId)
      const checkpoints = arrayValue(source.checkpoints)
      const versionSources = [...checkpoints, {
        id: `${stringValue(source.id) || 'project'}:current`,
        version: source.version ?? 'legacy-current',
        currentQuestion: source.currentQuestion ?? '',
        nextAction: source.nextAction ?? '',
        changeSummary: '由旧项目护照当前状态迁移。',
        createdAt: source.updatedAt ?? now,
      } as JsonObject]
      let parentVersionId: string | null = null
      versionSources.forEach((value, index) => {
        const versionSource = objectValue(value) ?? { value }
        const versionRef = legacyRef(projectEntry, versionSource, index)
        const versionId = addId(idMap, 'ver', versionRef)
        const label = stringValue(versionSource.version) || `legacy-${index + 1}`
        const version: ProjectVersion = {
          id: versionId,
          projectId,
          label,
          parentVersionId,
          lifecycle: 'working',
          frozenDigest: null,
          summary: stringValue(versionSource.changeSummary),
          currentQuestion: stringValue(versionSource.currentQuestion),
          nextAction: stringValue(versionSource.nextAction),
          sourceRefs: [],
          createdAt: timestamp(versionSource, now),
          updatedAt: timestamp(versionSource, now),
          legacyRef: versionRef,
        }
        collections.projectVersions.push(version)
        const labels = versionByLabel.get(label) ?? []
        labels.push(versionId)
        versionByLabel.set(label, labels)
        parentVersionId = versionId
      })
      const project: Project = {
        id: projectId,
        title: stringValue(source.title) || '未命名项目',
        profile: {
          audience: source.audience ?? '',
          playerCount: source.playerCount ?? '',
          duration: source.duration ?? '',
          experienceIntent: source.experienceIntent ?? '',
          designBoundaries: source.designBoundaries ?? '',
          goalAndEnd: source.goalAndEnd ?? '',
          turnStructure: source.turnStructure ?? '',
          componentScope: source.componentScope ?? '',
        },
        activeVersionId: parentVersionId,
        archivedAt: null,
        sourceRefs: [],
        sample: false,
        createdAt: timestamp(source, now),
        updatedAt: timestamp(source, now),
        legacyRef: ref,
      }
      collections.projects.push(project)
      workspace.active = { projectId, ...(parentVersionId ? { versionId: parentVersionId } : {}) }
    }
  }

  const findProjectVersion = (record: JsonObject, sourceKey: string) => {
    const legacyProjectId = stringValue(record.projectId) || stringValue(record.id && sourceKey === PROJECT_WORKSPACE_STORAGE_KEY ? record.id : '')
    const projectId = legacyProjectId ? legacyEntityIds.get(`${PROJECT_WORKSPACE_STORAGE_KEY}|${legacyProjectId}`) ?? legacyEntityIds.get(`${LEGACY_PROJECT_WORKSPACE_STORAGE_KEY}|${legacyProjectId}`) ?? null : null
    if (!projectId) return { projectId: null, versionId: null, linkState: 'needs_assignment' as const }
    const versionLabel = stringValue(record.version) || stringValue(record.sourceVersion)
    const matches = (versionByLabel.get(versionLabel) ?? []).filter(versionId => collections.projectVersions.some(version => version.id === versionId && version.projectId === projectId))
    if (matches.length !== 1) return { projectId, versionId: null, linkState: 'needs_assignment' as const }
    return { projectId, versionId: matches[0], linkState: 'linked' as const }
  }

  const migrateLearning = (entry: LegacyScanEntry | undefined) => {
    if (!entry?.value) return
    const source = objectValue(entry.value)
    if (!source) return issue(entry, 'warning', 'invalid_learning_progress', 'learning progress is not an object')
    const enrollmentRef = legacyRef(entry, source, null)
    const enrollmentId = addId(idMap, 'lrn', enrollmentRef)
    const enrollment: CourseEnrollment = {
      id: enrollmentId,
      courseId: 'legacy-learning-nodes',
      courseVersion: entry.descriptor.key === LEARNING_PROGRESS_STORAGE_KEY ? 'v2' : 'v1',
      currentUnitId: stringValue(source.currentNodeId) || 'node-01',
      status: 'active',
      createdAt: now,
      updatedAt: now,
      legacyRef: enrollmentRef,
    }
    collections.courseEnrollments.push(enrollment)
    if (!workspace.active.enrollmentId) workspace.active = { ...workspace.active, enrollmentId }
    const drafts = objectValue(source.drafts) ?? {}
    const states = objectValue(source.nodeStates) ?? {}
    const completed = new Set(arrayValue(source.completedNodeIds).filter((value): value is string => typeof value === 'string'))
    const nodeIds = new Set([...Object.keys(drafts), ...Object.keys(states), ...completed])
    let nodeIndex = 0
    nodeIds.forEach(nodeId => {
      const draft = stringValue(drafts[nodeId])
      const attemptRef = legacyRef(entry, { nodeId, draft, state: states[nodeId] ?? (completed.has(nodeId) ? 'completed' : 'not-started') }, nodeIndex)
      nodeIndex += 1
      const artifactRefs: TypedRef[] = []
      if (draft) {
        const artifactId = addId(idMap, 'art', { ...attemptRef, normalizedFingerprint: fingerprintJson({ nodeId, draft }) })
        collections.artifacts.push({
          id: artifactId,
          artifactType: 'course_output',
          projectId: null,
          versionId: null,
          status: 'draft',
          sourceRefs: [catalogRef('learning_node', nodeId, 'derived_from')],
          payload: { courseId: 'legacy-learning-nodes', courseVersion: enrollment.courseVersion, unitId: nodeId, activityId: nodeId, activityDefinitionRevision: 'legacy', value: draft },
          createdAt: now,
          updatedAt: now,
          legacyRef: attemptRef,
        })
        artifactRefs.push({ scope: 'workspace', kind: 'artifact', id: artifactId, relation: 'created_by' })
      }
      const attempt: ActivityAttempt = {
        id: addId(idMap, 'att', attemptRef),
        enrollmentId,
        courseId: enrollment.courseId,
        courseVersion: enrollment.courseVersion,
        unitId: nodeId,
        unitRevision: 'legacy',
        activityId: nodeId,
        activityDefinitionRevision: 'legacy',
        state: draft ? 'artifact_submitted' : 'learning',
        artifactRefs,
        completionAttestation: 'legacy_self_reported',
        evidenceState: 'evidence_unavailable',
        createdAt: now,
        updatedAt: now,
        legacyRef: attemptRef,
      }
      collections.activityAttempts.push(attempt)
    })
  }

  migrateLearning(entries.get(LEARNING_PROGRESS_STORAGE_KEY)?.present ? entries.get(LEARNING_PROGRESS_STORAGE_KEY) : entries.get(LEGACY_LEARNING_PROGRESS_STORAGE_KEY))

  const firstTabletop = entries.get(FIRST_TABLETOP_STORAGE_KEY)
  if (firstTabletop?.value) {
    const source = snapshot(firstTabletop.value)
    const ref = legacyRef(firstTabletop, source, null)
    const ideaId = addId(idMap, 'idea', ref)
    const challengeId = addId(idMap, 'chl', { ...ref, normalizedFingerprint: fingerprintJson({ ...source, entity: 'challenge' }) })
    const prototypeId = addId(idMap, 'pro', { ...ref, normalizedFingerprint: fingerprintJson({ ...source, entity: 'prototype' }) })
    const mechanicId = stringValue(source.mechanicId)
    const themeId = stringValue(source.themeId)
    const idea: IdeaDraft = {
      id: ideaId,
      startingDriver: mechanicId ? 'mechanic' : themeId ? 'theme_or_system' : 'component_or_constraint',
      constraints: source,
      directions: [],
      selectedDirectionIndex: null,
      sourceRefs: [],
      linkState: 'needs_assignment',
      createdAt: now,
      updatedAt: now,
      legacyRef: ref,
    }
    const prototype: Prototype = {
      id: prototypeId,
      projectId: null,
      versionId: null,
      title: stringValue(source.title) || '旧版第一次落桌草稿',
      design: source,
      sourceRefs: [{ scope: 'workspace', kind: 'idea_draft', id: ideaId, relation: 'derived_from' }],
      linkState: 'needs_assignment',
      createdAt: now,
      updatedAt: now,
      legacyRef: ref,
    }
    collections.ideaDrafts.push(idea)
    collections.prototypes.push(prototype)
    collections.challengeInstances.push({ id: challengeId, purpose: 'independent', ideaId, prototypeId, artifactRefs: [], createdAt: now, updatedAt: now, legacyRef: ref })
    issue(firstTabletop, 'info', 'prototype_run_not_inferred', 'legacy first-tabletop text was migrated without creating a PrototypeRun', ref)
  }

  for (const entry of report.entries) {
    if (!entry.present) continue
    if (entry.error || !entry.value) {
      const ref: LegacyRef = { sourceKey: entry.descriptor.key, sourceSchema: entry.sourceSchema, legacyId: null, sourceIndex: null, normalizedFingerprint: entry.fingerprint ?? 'unavailable' }
      collections.artifacts.push({
        id: addId(idMap, 'art', ref),
        artifactType: 'legacy_artifact_v1',
        projectId: null,
        versionId: null,
        status: 'archived',
        sourceRefs: [],
        payload: { sourceShape: entry.detectedShape, reason: entry.error ?? 'missing parsed value', raw: entry.raw ?? '' },
        createdAt: now,
        updatedAt: now,
        legacyRef: ref,
      })
      issue(entry, 'error', 'source_parse_failed', entry.error ?? 'source could not be parsed', ref)
      continue
    }
    if ([PROJECT_WORKSPACE_STORAGE_KEY, LEGACY_PROJECT_WORKSPACE_STORAGE_KEY, LEARNING_PROGRESS_STORAGE_KEY, LEGACY_LEARNING_PROGRESS_STORAGE_KEY, FIRST_TABLETOP_STORAGE_KEY].includes(entry.descriptor.key)) continue

    if (artifactTypeByKey.has(entry.descriptor.key)) {
      const artifactType = artifactTypeByKey.get(entry.descriptor.key)!
      for (const item of recordItems(entry)) {
        const record = snapshot(item.value)
        const ref = legacyRef(entry, item.value, item.index)
        const scope = findProjectVersion(record, entry.descriptor.key)
        const sourceSchemaVersion = objectValue(entry.value)?.schemaVersion
        const sourceRefs: TypedRef[] = []
        if (artifactType === 'core_loop') {
          const sourceIntentId = stringValue(record.sourceIntentId)
          const mappedId = sourceIntentId ? legacyEntityIds.get(`${EXPERIENCE_INTENT_STORAGE_KEY}|${sourceIntentId}`) : null
          if (mappedId) sourceRefs.push({ scope: 'workspace', kind: 'artifact', id: mappedId, relation: 'derived_from' })
        }
        if (artifactType === 'prototype_scope') {
          const sourceCoreLoopId = stringValue(record.sourceCoreLoopId)
          const mappedId = sourceCoreLoopId ? legacyEntityIds.get(`${CORE_LOOP_STORAGE_KEY}|${sourceCoreLoopId}`) : null
          if (mappedId) sourceRefs.push({ scope: 'workspace', kind: 'artifact', id: mappedId, relation: 'derived_from' })
        }
        const artifact: Artifact = {
          id: addId(idMap, 'art', ref),
          artifactType,
          projectId: scope.projectId,
          versionId: scope.versionId,
          status: item.draft ? 'draft' : 'complete',
          sourceRefs,
          payload: { legacySchemaVersion: typeof sourceSchemaVersion === 'number' ? sourceSchemaVersion : null, linkState: scope.linkState, snapshot: record },
          createdAt: timestamp(record, now),
          updatedAt: timestamp(record, now),
          legacyRef: ref,
        }
        collections.artifacts.push(artifact)
        registerLegacyId(entry, stringValue(record.id), artifact.id)
      }
      continue
    }

    if (entry.descriptor.key === TEST_PLAN_DRAFT_STORAGE_KEY || entry.descriptor.key === TEST_PLAN_STORAGE_KEY) {
      for (const item of recordItems(entry)) {
        const record = snapshot(item.value)
        const ref = legacyRef(entry, item.value, item.index)
        const scope = findProjectVersion(record, entry.descriptor.key)
        const plan: TestPlan = {
          id: addId(idMap, 'plan', ref),
          projectId: scope.projectId,
          versionId: scope.versionId,
          iterationId: null,
          versionDigest: null,
          status: 'draft',
          plan: record,
          sourceRefs: [],
          linkState: 'needs_assignment',
          createdAt: timestamp(record, now),
          updatedAt: timestamp(record, now),
          legacyRef: ref,
        }
        collections.testPlans.push(plan)
        registerLegacyId(entry, stringValue(record.id), plan.id)
      }
      continue
    }

    if (entry.descriptor.key === PLAYTEST_SESSION_STORAGE_KEY) {
      for (const item of recordItems(entry)) {
        const record = snapshot(item.value)
        const ref = legacyRef(entry, item.value, item.index)
        const oldPlanId = stringValue(record.sourcePlanId)
        const planId = oldPlanId ? legacyEntityIds.get(`${TEST_PLAN_STORAGE_KEY}|${oldPlanId}`) ?? null : null
        const plan = planId ? collections.testPlans.find(candidate => candidate.id === planId) : undefined
        const sessionId = addId(idMap, 'ses', ref)
        const status = stringValue(record.state) === 'completed' && stringValue(record.startedAt) && (stringValue(record.endedAt) || stringValue(record.completedAt)) ? 'completed' : stringValue(record.state) === 'withdrawn' ? 'withdrawn' : 'draft'
        const session: PlaytestSession = {
          id: sessionId,
          projectId: plan?.projectId ?? null,
          versionId: plan?.versionId ?? null,
          iterationId: null,
          testPlanId: planId,
          versionDigest: null,
          kind: stringValue(record.planSnapshot && objectValue(record.planSnapshot)?.testType) === '自测' ? 'solo' : 'unknown',
          startedAt: stringValue(record.startedAt) || null,
          endedAt: stringValue(record.endedAt) || stringValue(record.completedAt) || null,
          status,
          context: record,
          sourceRefs: planId ? [{ scope: 'workspace', kind: 'test_plan', id: planId, relation: 'derived_from' }] : [],
          linkState: 'needs_assignment',
          createdAt: timestamp(record, now),
          updatedAt: timestamp(record, now),
          legacyRef: ref,
        }
        collections.playtestSessions.push(session)
        registerLegacyId(entry, stringValue(record.id), sessionId)
        const events = arrayValue(record.events)
        events.forEach((eventValue, eventIndex) => {
          const event = snapshot(eventValue)
          const eventRef = legacyRef(entry, eventValue, eventIndex)
          const evidence: EvidenceItem = {
            id: addId(idMap, 'evd', eventRef),
            sessionId,
            projectId: session.projectId,
            versionId: session.versionId,
            kind: stringValue(event.type) === '玩家原话' ? 'quote' : stringValue(event.type) === '主持介入' ? 'facilitator_intervention' : 'event',
            at: stringValue(event.createdAt) || null,
            content: stringValue(event.observation) || stringValue(event.resolution) || JSON.stringify(event),
            sourceRefs: [],
            createdAt: timestamp(event, now),
            updatedAt: timestamp(event, now),
            legacyRef: eventRef,
          }
          collections.evidenceItems.push(evidence)
        })
        arrayValue(record.debriefAnswers).forEach((answerValue, answerIndex) => {
          const answer = snapshot(answerValue)
          const answerRef = legacyRef(entry, answerValue, events.length + answerIndex)
          collections.evidenceItems.push({
            id: addId(idMap, 'evd', answerRef),
            sessionId,
            projectId: session.projectId,
            versionId: session.versionId,
            kind: 'debrief',
            at: stringValue(record.completedAt) || null,
            content: stringValue(answer.response),
            sourceRefs: [],
            createdAt: timestamp(record, now),
            updatedAt: timestamp(record, now),
            legacyRef: answerRef,
          })
        })
      }
      continue
    }

    if (entry.descriptor.key === FEEDBACK_REVIEW_STORAGE_KEY) {
      for (const item of recordItems(entry)) {
        const record = snapshot(item.value)
        const ref = legacyRef(entry, item.value, item.index)
        const oldSessionId = stringValue(record.sourceSessionId)
        const sessionId = oldSessionId ? legacyEntityIds.get(`${PLAYTEST_SESSION_STORAGE_KEY}|${oldSessionId}`) ?? null : null
        const session = sessionId ? collections.playtestSessions.find(candidate => candidate.id === sessionId) : undefined
        if (!session) {
          collections.artifacts.push({
            id: addId(idMap, 'art', ref),
            artifactType: 'legacy_artifact_v1',
            projectId: null,
            versionId: null,
            status: 'archived',
            sourceRefs: [],
            payload: { sourceShape: entry.detectedShape, reason: 'feedback source session could not be resolved', raw: record },
            createdAt: timestamp(record, now),
            updatedAt: timestamp(record, now),
            legacyRef: ref,
          })
          issue(entry, 'warning', 'orphan_feedback_preserved', 'feedback was preserved as a legacy artifact because its source session could not be resolved', ref)
          continue
        }
        const selectedOldIds = new Set(arrayValue(record.selectedEvidenceIds).filter((value): value is string => typeof value === 'string'))
        const evidenceIds = collections.evidenceItems.filter(evidence => evidence.sessionId === sessionId && (!selectedOldIds.size || selectedOldIds.has(evidence.legacyRef?.legacyId ?? '') || selectedOldIds.has(`event:${evidence.legacyRef?.legacyId ?? ''}`))).map(evidence => evidence.id)
        const review: EvidenceReview = {
          id: addId(idMap, 'rev', ref),
          projectId: session?.projectId ?? null,
          versionId: session?.versionId ?? null,
          iterationId: null,
          sessionIds: sessionId ? [sessionId] : [],
          evidenceItemIds: evidenceIds,
          review: record,
          sourceRefs: sessionId ? [{ scope: 'workspace', kind: 'playtest_session', id: sessionId, relation: 'derived_from' }] : [],
          linkState: 'needs_assignment',
          createdAt: timestamp(record, now),
          updatedAt: timestamp(record, now),
          legacyRef: ref,
        }
        collections.evidenceReviews.push(review)
        registerLegacyId(entry, stringValue(record.id), review.id)
      }
      continue
    }

    if (entry.descriptor.key === EVIDENCE_SYNTHESIS_STORAGE_KEY) {
      for (const item of recordItems(entry)) {
        const record = snapshot(item.value)
        const ref = legacyRef(entry, item.value, item.index)
        const oldReviewIds = arrayValue(record.selectedReviewIds).filter((value): value is string => typeof value === 'string')
        const reviewIds = oldReviewIds.map(id => legacyEntityIds.get(`${FEEDBACK_REVIEW_STORAGE_KEY}|${id}`)).filter((value): value is string => Boolean(value))
        const synthesisId = addId(idMap, 'syn', ref)
        const oldParentId = stringValue(record.parentRecordId)
        const parentSynthesisId = oldParentId ? legacyEntityIds.get(`${EVIDENCE_SYNTHESIS_STORAGE_KEY}|${oldParentId}`) ?? null : null
        const synthesis: EvidenceSynthesis = {
          id: synthesisId,
          lineageId: stringValue(record.lineageId) || synthesisId,
          revision: Math.max(1, numberValue(record.revision, 1)),
          parentSynthesisId,
          projectId: null,
          reviewIds,
          synthesis: record,
          sourceRefs: reviewIds.map(id => ({ scope: 'workspace', kind: 'evidence_review', id, relation: 'derived_from' })),
          linkState: 'needs_assignment',
          createdAt: timestamp(record, now),
          updatedAt: timestamp(record, now),
          legacyRef: ref,
        }
        collections.evidenceSyntheses.push(synthesis)
        registerLegacyId(entry, stringValue(record.id), synthesis.id)
      }
    }
  }

  const targetCounts = Object.fromEntries(Object.entries(collections).map(([name, values]) => [name, values.length]))
  workspace.migration = {
    sourceDigest: report.sourceDigest,
    startedAt: report.scannedAt,
    completedAt: now,
    idMap,
    sourceCounts: Object.fromEntries(report.entries.map(entry => [entry.descriptor.key, entry.itemCount])),
    targetCounts,
    issues,
  }
  workspace.updatedAt = now
  return workspace
}
