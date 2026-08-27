import { newEntityId } from './ids.ts'
import type { JsonValue, LocalWorkspaceV3, TypedRef } from './schema-v3.ts'

type Options = { id?: (prefix: string) => string; now?: () => string }
const useOptions = (value?: Options) => ({ id: value?.id ?? newEntityId, now: value?.now ?? (() => new Date().toISOString()) })

export function startCourseEnrollment(workspace: LocalWorkspaceV3, input: { courseId: string; courseVersion: string; firstUnitId: string }, options?: Options) {
  const use = useOptions(options)
  const existing = workspace.collections.courseEnrollments.find(item => item.courseId === input.courseId && item.courseVersion === input.courseVersion && item.status === 'active')
  if (existing) return existing.id
  const now = use.now()
  const enrollmentId = use.id('lrn')
  workspace.collections.courseEnrollments.push({ id: enrollmentId, courseId: input.courseId, courseVersion: input.courseVersion, currentUnitId: input.firstUnitId, status: 'active', createdAt: now, updatedAt: now })
  workspace.active.enrollmentId = enrollmentId
  return enrollmentId
}

export function saveCourseActivityDraft(workspace: LocalWorkspaceV3, input: {
  enrollmentId: string
  unitId: string
  unitRevision: string
  activityId: string
  activityRevision: string
  value: JsonValue
}, options?: Options) {
  const use = useOptions(options)
  const enrollment = workspace.collections.courseEnrollments.find(item => item.id === input.enrollmentId && item.status === 'active')
  if (!enrollment) throw new Error('active enrollment does not exist')
  if (enrollment.currentUnitId !== input.unitId) throw new Error('course activity is not the current unit')
  const now = use.now()
  const attemptIndex = workspace.collections.activityAttempts.findIndex(item => item.enrollmentId === enrollment.id && item.unitId === input.unitId && item.activityId === input.activityId)
  const existingAttempt = attemptIndex >= 0 ? workspace.collections.activityAttempts[attemptIndex] : null
  const artifactId = existingAttempt?.artifactRefs.find(ref => ref.kind === 'artifact')?.id ?? use.id('art')
  const artifactIndex = workspace.collections.artifacts.findIndex(item => item.id === artifactId)
  const artifact = {
    id: artifactId, artifactType: 'course_output' as const, projectId: null, versionId: null, status: 'draft' as const, sourceRefs: [],
    payload: { courseId: enrollment.courseId, courseVersion: enrollment.courseVersion, unitId: input.unitId, activityId: input.activityId, activityDefinitionRevision: input.activityRevision, value: input.value },
    createdAt: artifactIndex >= 0 ? workspace.collections.artifacts[artifactIndex].createdAt : now, updatedAt: now,
  }
  if (artifactIndex >= 0) workspace.collections.artifacts[artifactIndex] = artifact
  else workspace.collections.artifacts.push(artifact)
  const attempt = {
    id: existingAttempt?.id ?? use.id('att'), enrollmentId: enrollment.id, courseId: enrollment.courseId, courseVersion: enrollment.courseVersion,
    unitId: input.unitId, unitRevision: input.unitRevision, activityId: input.activityId, activityDefinitionRevision: input.activityRevision,
    state: 'artifact_submitted' as const, artifactRefs: [{ scope: 'workspace' as const, kind: 'artifact', id: artifactId, relation: 'created_by' as const }], completionAttestation: null, evidenceState: 'available' as const,
    createdAt: existingAttempt?.createdAt ?? now, updatedAt: now,
  }
  if (attemptIndex >= 0) workspace.collections.activityAttempts[attemptIndex] = attempt
  else workspace.collections.activityAttempts.push(attempt)
  return { artifactId, attemptId: attempt.id }
}

export function submitCourseActivity(workspace: LocalWorkspaceV3, input: {
  enrollmentId: string
  unitId: string
  unitRevision: string
  activityId: string
  activityRevision: string
  value: JsonValue
  nextUnitId: string | null
}, options?: Options) {
  const use = useOptions(options)
  const enrollmentIndex = workspace.collections.courseEnrollments.findIndex(item => item.id === input.enrollmentId && item.status === 'active')
  if (enrollmentIndex < 0) throw new Error('active enrollment does not exist')
  const enrollment = workspace.collections.courseEnrollments[enrollmentIndex]
  if (enrollment.currentUnitId !== input.unitId) throw new Error('course activity is not the current unit')
  const now = use.now()
  const attemptIndex = workspace.collections.activityAttempts.findIndex(item => item.enrollmentId === enrollment.id && item.unitId === input.unitId && item.activityId === input.activityId)
  const existingAttempt = attemptIndex >= 0 ? workspace.collections.activityAttempts[attemptIndex] : null
  const existingArtifactId = existingAttempt?.artifactRefs.find(ref => ref.kind === 'artifact')?.id
  const artifactId = existingArtifactId ?? use.id('art')
  const artifactIndex = workspace.collections.artifacts.findIndex(item => item.id === artifactId)
  const artifact = {
    id: artifactId, artifactType: 'course_output' as const, projectId: null, versionId: null, status: 'complete' as const, sourceRefs: [],
    payload: { courseId: enrollment.courseId, courseVersion: enrollment.courseVersion, unitId: input.unitId, activityId: input.activityId, activityDefinitionRevision: input.activityRevision, value: input.value },
    createdAt: artifactIndex >= 0 ? workspace.collections.artifacts[artifactIndex].createdAt : now, updatedAt: now,
  }
  if (artifactIndex >= 0) workspace.collections.artifacts[artifactIndex] = artifact
  else workspace.collections.artifacts.push(artifact)
  const attempt = {
    id: existingAttempt?.id ?? use.id('att'), enrollmentId: enrollment.id, courseId: enrollment.courseId, courseVersion: enrollment.courseVersion,
    unitId: input.unitId, unitRevision: input.unitRevision, activityId: input.activityId, activityDefinitionRevision: input.activityRevision,
    state: 'unit_complete' as const, artifactRefs: [{ scope: 'workspace' as const, kind: 'artifact', id: artifactId, relation: 'created_by' as const }], completionAttestation: 'native' as const, evidenceState: 'available' as const,
    createdAt: existingAttempt?.createdAt ?? now, updatedAt: now,
  }
  if (attemptIndex >= 0) workspace.collections.activityAttempts[attemptIndex] = attempt
  else workspace.collections.activityAttempts.push(attempt)
  workspace.collections.courseEnrollments[enrollmentIndex] = { ...enrollment, currentUnitId: input.nextUnitId ?? input.unitId, status: input.nextUnitId ? 'active' : 'completed', updatedAt: now }
  workspace.active.enrollmentId = enrollment.id
  return { artifactId, attemptId: attempt.id }
}

export function submitCourseEntityActivity(workspace: LocalWorkspaceV3, input: {
  enrollmentId: string
  unitId: string
  unitRevision: string
  activityId: string
  activityRevision: string
  entityRef: TypedRef
  nextUnitId: string | null
}, options?: Options) {
  const use = useOptions(options)
  const enrollmentIndex = workspace.collections.courseEnrollments.findIndex(item => item.id === input.enrollmentId && item.status === 'active')
  if (enrollmentIndex < 0) throw new Error('active enrollment does not exist')
  if (input.entityRef.scope !== 'workspace') throw new Error('course evidence must reference a workspace entity')
  const enrollment = workspace.collections.courseEnrollments[enrollmentIndex]
  if (enrollment.currentUnitId !== input.unitId) throw new Error('course activity is not the current unit')
  const now = use.now()
  const attemptIndex = workspace.collections.activityAttempts.findIndex(item => item.enrollmentId === enrollment.id && item.unitId === input.unitId && item.activityId === input.activityId)
  const existingAttempt = attemptIndex >= 0 ? workspace.collections.activityAttempts[attemptIndex] : null
  const existingArtifactId = existingAttempt?.artifactRefs.find(ref => ref.kind === 'artifact')?.id
  const artifactId = existingArtifactId ?? use.id('art')
  const artifactIndex = workspace.collections.artifacts.findIndex(item => item.id === artifactId)
  const target = workspace.collections.projects.find(item => input.entityRef.kind === 'project' && item.id === input.entityRef.id)
    ?? workspace.collections.prototypeRuns.find(item => input.entityRef.kind === 'prototype_run' && item.id === input.entityRef.id)
    ?? workspace.collections.testPlans.find(item => input.entityRef.kind === 'test_plan' && item.id === input.entityRef.id)
    ?? workspace.collections.playtestSessions.find(item => input.entityRef.kind === 'playtest_session' && item.id === input.entityRef.id)
    ?? workspace.collections.changeBriefs.find(item => input.entityRef.kind === 'change_brief' && item.id === input.entityRef.id)
  if (!target) throw new Error('referenced workspace evidence does not exist')
  const artifact = {
    id: artifactId, artifactType: 'entity_reference' as const,
    projectId: 'projectId' in target ? target.projectId : target.id,
    versionId: 'versionId' in target && typeof target.versionId === 'string' ? target.versionId : null,
    status: 'complete' as const,
    sourceRefs: [input.entityRef], payload: { entityRef: input.entityRef },
    createdAt: artifactIndex >= 0 ? workspace.collections.artifacts[artifactIndex].createdAt : now, updatedAt: now,
  }
  if (artifactIndex >= 0) workspace.collections.artifacts[artifactIndex] = artifact
  else workspace.collections.artifacts.push(artifact)
  const attempt = {
    id: existingAttempt?.id ?? use.id('att'), enrollmentId: enrollment.id, courseId: enrollment.courseId, courseVersion: enrollment.courseVersion,
    unitId: input.unitId, unitRevision: input.unitRevision, activityId: input.activityId, activityDefinitionRevision: input.activityRevision,
    state: 'unit_complete' as const, artifactRefs: [{ scope: 'workspace' as const, kind: 'artifact', id: artifactId, relation: 'created_by' as const }], completionAttestation: 'native' as const, evidenceState: 'available' as const,
    createdAt: existingAttempt?.createdAt ?? now, updatedAt: now,
  }
  if (attemptIndex >= 0) workspace.collections.activityAttempts[attemptIndex] = attempt
  else workspace.collections.activityAttempts.push(attempt)
  workspace.collections.courseEnrollments[enrollmentIndex] = { ...enrollment, currentUnitId: input.nextUnitId ?? input.unitId, status: input.nextUnitId ? 'active' : 'completed', updatedAt: now }
  workspace.active.enrollmentId = enrollment.id
  return { artifactId, attemptId: attempt.id }
}
