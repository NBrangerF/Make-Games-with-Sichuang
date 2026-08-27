import type { EntityKind, LocalWorkspaceV3, Tombstone } from './schema-v3.ts'

export type VersionFacts = Readonly<{
  hasPrototype: boolean
  hasTabletopRun: boolean
  hasSoloTest: boolean
  hasExternalTest: boolean
  hasEvidenceReview: boolean
  hasOutgoingRevision: boolean
}>

export function tombstoneKey(entityKind: EntityKind, entityId: string) {
  return `${entityKind}:${entityId}`
}

function tombstoneSet(tombstones: readonly Tombstone[]) {
  return new Set(tombstones.map(item => tombstoneKey(item.entityKind, item.entityId)))
}

export function getVersionFacts(workspace: LocalWorkspaceV3, versionId: string): VersionFacts {
  const tombstones = tombstoneSet(workspace.collections.tombstones)
  const version = workspace.collections.projectVersions.find(item => item.id === versionId)
  const hasFrozenVersion = Boolean(version?.lifecycle === 'frozen' && version.frozenDigest)
  const prototypes = workspace.collections.prototypes.filter(item => item.versionId === versionId && item.linkState === 'linked' && !tombstones.has(tombstoneKey('prototype', item.id)))
  const prototypeIds = new Set(prototypes.map(item => item.id))
  const sessions = workspace.collections.playtestSessions.filter(item => item.versionId === versionId && item.linkState === 'linked' && item.status === 'completed' && hasFrozenVersion && item.versionDigest === version?.frozenDigest && !tombstones.has(tombstoneKey('playtest_session', item.id)))
  const sessionIds = new Set(sessions.map(item => item.id))
  const reviews = workspace.collections.evidenceReviews.filter(item => item.versionId === versionId && !tombstones.has(tombstoneKey('evidence_review', item.id)) && item.sessionIds.some(id => sessionIds.has(id)))
  const outgoing = workspace.collections.changeBriefs.filter(item => item.fromVersionId === versionId && !tombstones.has(tombstoneKey('change_brief', item.id)))

  return {
    hasPrototype: prototypes.length > 0,
    hasTabletopRun: workspace.collections.prototypeRuns.some(item => item.versionId === versionId && prototypeIds.has(item.prototypeId) && item.status === 'completed' && !tombstones.has(tombstoneKey('prototype_run', item.id))),
    hasSoloTest: sessions.some(item => item.kind === 'solo'),
    hasExternalTest: sessions.some(item => item.kind === 'guided' || item.kind === 'external' || item.kind === 'blind'),
    hasEvidenceReview: reviews.length > 0,
    hasOutgoingRevision: outgoing.some(item => workspace.collections.projectVersions.some(version => version.id === item.toVersionId && version.parentVersionId === versionId)),
  }
}

export function canCreateSession(workspace: LocalWorkspaceV3, testPlanId: string) {
  const plan = workspace.collections.testPlans.find(item => item.id === testPlanId)
  if (!plan) return { allowed: false, reason: 'missing_test_plan' } as const
  if (plan.status !== 'confirmed') return { allowed: false, reason: 'unconfirmed_test_plan' } as const
  if (!plan.projectId || !plan.versionId || !plan.iterationId || !plan.versionDigest) return { allowed: false, reason: 'incomplete_test_plan_scope' } as const
  const version = workspace.collections.projectVersions.find(item => item.id === plan.versionId)
  if (!version || version.projectId !== plan.projectId || version.lifecycle !== 'frozen' || version.frozenDigest !== plan.versionDigest) return { allowed: false, reason: 'version_digest_mismatch' } as const
  return { allowed: true, reason: null } as const
}

export function canCreateReview(workspace: LocalWorkspaceV3, sessionIds: readonly string[]) {
  if (sessionIds.length === 0) return { allowed: false, reason: 'missing_session' } as const
  const tombstones = tombstoneSet(workspace.collections.tombstones)
  const sessions = sessionIds.map(id => workspace.collections.playtestSessions.find(item => item.id === id))
  if (sessions.some(item => !item || item.linkState !== 'linked' || item.status !== 'completed' || tombstones.has(tombstoneKey('playtest_session', item.id)))) return { allowed: false, reason: 'invalid_session' } as const
  const scope = sessions[0]
  if (!scope || sessions.some(item => item?.projectId !== scope.projectId || item?.versionId !== scope.versionId || item?.iterationId !== scope.iterationId)) return { allowed: false, reason: 'session_scope_mismatch' } as const
  const version = workspace.collections.projectVersions.find(item => item.id === scope.versionId)
  if (!version || version.lifecycle !== 'frozen' || !version.frozenDigest || scope.versionDigest !== version.frozenDigest || sessions.some(item => item?.versionDigest !== version.frozenDigest)) return { allowed: false, reason: 'version_digest_mismatch' } as const
  return { allowed: true, reason: null } as const
}

export function canCreateChangeBrief(workspace: LocalWorkspaceV3, reviewIds: readonly string[]) {
  if (reviewIds.length === 0) return { allowed: false, reason: 'missing_review' } as const
  const tombstones = tombstoneSet(workspace.collections.tombstones)
  const reviews = reviewIds.map(id => workspace.collections.evidenceReviews.find(item => item.id === id))
  if (reviews.some(item => !item || item.linkState !== 'linked' || tombstones.has(tombstoneKey('evidence_review', item.id)))) return { allowed: false, reason: 'invalid_review' } as const
  const scope = reviews[0]
  if (!scope || !scope.projectId || !scope.versionId || !scope.iterationId || reviews.some(item => item?.projectId !== scope.projectId || item?.versionId !== scope.versionId || item?.iterationId !== scope.iterationId)) return { allowed: false, reason: 'review_scope_mismatch' } as const
  const cycle = workspace.collections.iterationCycles.find(item => item.id === scope.iterationId && item.projectId === scope.projectId && item.versionId === scope.versionId)
  if (!cycle || cycle.status !== 'active') return { allowed: false, reason: 'iteration_not_active' } as const
  if (workspace.collections.changeBriefs.some(item => item.iterationId === scope.iterationId || item.fromVersionId === scope.versionId)) return { allowed: false, reason: 'revision_already_created' } as const
  return { allowed: true, reason: null, projectId: scope.projectId, versionId: scope.versionId, iterationId: scope.iterationId } as const
}
