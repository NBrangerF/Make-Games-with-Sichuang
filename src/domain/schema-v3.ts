export type JsonPrimitive = string | number | boolean | null
export type JsonValue = JsonPrimitive | JsonObject | JsonValue[]
export type JsonObject = { [key: string]: JsonValue }

export type EntityKind =
  | 'course_enrollment'
  | 'activity_attempt'
  | 'artifact'
  | 'idea_draft'
  | 'challenge_instance'
  | 'project'
  | 'project_version'
  | 'prototype'
  | 'prototype_run'
  | 'iteration_cycle'
  | 'test_plan'
  | 'playtest_session'
  | 'evidence_item'
  | 'evidence_review'
  | 'evidence_synthesis'
  | 'change_brief'
  | 'resource_attachment'
  | 'agent_suggestion'
  | 'agent_run'

export type RefRelation =
  | 'derived_from'
  | 'applies_to'
  | 'tests'
  | 'evidences'
  | 'supersedes'
  | 'created_by'
  | 'attached_to'

export type TypedRef = Readonly<{
  scope: 'catalog' | 'workspace'
  kind: string
  id: string
  relation: RefRelation
}>

export type LegacyRef = Readonly<{
  sourceKey: string
  sourceSchema: string
  legacyId: string | null
  sourceIndex: number | null
  normalizedFingerprint: string
}>

export type RecordMeta = Readonly<{
  createdAt: string
  updatedAt: string
  legacyRef?: LegacyRef
}>

export type CourseEnrollment = RecordMeta & Readonly<{
  id: string
  courseId: string
  courseVersion: string
  currentUnitId: string
  status: 'active' | 'completed' | 'archived'
}>

export type ActivityAttempt = RecordMeta & Readonly<{
  id: string
  enrollmentId: string
  courseId: string
  courseVersion: string
  unitId: string
  unitRevision: string
  activityId: string
  activityDefinitionRevision: string
  state: 'not_started' | 'learning' | 'exercise_complete' | 'artifact_submitted' | 'reflection_complete' | 'unit_complete'
  artifactRefs: TypedRef[]
  completionAttestation: 'native' | 'legacy_self_reported' | null
  evidenceState: 'available' | 'evidence_unavailable'
}>

export type MigratedToolArtifactType =
  | 'experience_intent'
  | 'core_loop'
  | 'prototype_scope'
  | 'version_governance'
  | 'issue_to_system'
  | 'redesign'
  | 'constraint_experiment'
  | 'balance_pass'
  | 'decision_trace'
  | 'shared_decision'
  | 'theme_review'
  | 'production_ledger'
  | 'publishing_route'
  | 'teaching_path'
  | 'accessibility_observation'

type ArtifactBase = RecordMeta & Readonly<{
  id: string
  projectId: string | null
  versionId: string | null
  status: 'draft' | 'complete' | 'archived'
  sourceRefs: TypedRef[]
}>

export type MigratedToolArtifact = ArtifactBase & Readonly<{
  artifactType: MigratedToolArtifactType
  payload: {
    legacySchemaVersion: number | null
    linkState: 'linked' | 'needs_assignment'
    snapshot: JsonObject
  }
}>

export type CourseOutputArtifact = ArtifactBase & Readonly<{
  artifactType: 'course_output'
  payload: {
    courseId: string
    courseVersion: string
    unitId: string
    activityId: string
    activityDefinitionRevision: string
    value: JsonValue
  }
}>

export type EntityReferenceArtifact = ArtifactBase & Readonly<{
  artifactType: 'entity_reference'
  payload: {
    entityRef: TypedRef
  }
}>

export type LegacyArtifactV1 = ArtifactBase & Readonly<{
  artifactType: 'legacy_artifact_v1'
  payload: {
    sourceShape: string
    reason: string
    raw: JsonValue
  }
}>

export type Artifact = MigratedToolArtifact | CourseOutputArtifact | EntityReferenceArtifact | LegacyArtifactV1

export type IdeaDriver = 'experience' | 'mechanic' | 'theme_or_system' | 'component_or_constraint' | 'redesign'

export type IdeaDraft = RecordMeta & Readonly<{
  id: string
  startingDriver: IdeaDriver
  constraints: JsonObject
  directions: JsonObject[]
  selectedDirectionIndex: number | null
  sourceRefs: TypedRef[]
  linkState: 'linked' | 'needs_assignment'
}>

export type ChallengeInstance = RecordMeta & Readonly<{
  id: string
  purpose: 'microgame_a' | 'microgame_b' | 'independent'
  ideaId: string
  prototypeId: string | null
  artifactRefs: TypedRef[]
}>

export type Project = RecordMeta & Readonly<{
  id: string
  title: string
  profile: JsonObject
  activeVersionId: string | null
  archivedAt: string | null
  sourceRefs: TypedRef[]
  sample: boolean
}>

export type ProjectVersion = RecordMeta & Readonly<{
  id: string
  projectId: string
  label: string
  parentVersionId: string | null
  lifecycle: 'working' | 'frozen'
  frozenDigest: string | null
  summary: string
  currentQuestion: string
  nextAction: string
  sourceRefs: TypedRef[]
}>

export type Prototype = RecordMeta & Readonly<{
  id: string
  projectId: string | null
  versionId: string | null
  title: string
  design: JsonObject
  sourceRefs: TypedRef[]
  linkState: 'linked' | 'needs_assignment'
}>

export type PrototypeRunEvent = Readonly<{
  id: string
  kind: 'state_change' | 'rule_break' | 'stop' | 'note'
  at: string
  description: string
}>

export type PrototypeRun = RecordMeta & Readonly<{
  id: string
  prototypeId: string
  projectId: string
  versionId: string
  configuration: JsonObject
  startedAt: string
  endedAt: string | null
  status: 'completed' | 'aborted'
  events: PrototypeRunEvent[]
}>

export type IterationStep = 'uncertainty' | 'question' | 'signals' | 'scope' | 'session' | 'review' | 'change' | 'version'

export type IterationCycle = RecordMeta & Readonly<{
  id: string
  projectId: string
  versionId: string
  uncertainty: string
  currentStep: IterationStep
  status: 'active' | 'completed' | 'archived'
}>

export type TestPlan = RecordMeta & Readonly<{
  id: string
  projectId: string | null
  versionId: string | null
  iterationId: string | null
  versionDigest: string | null
  status: 'draft' | 'confirmed' | 'archived'
  plan: JsonObject
  sourceRefs: TypedRef[]
  linkState: 'linked' | 'needs_assignment'
}>

export type PlaytestSession = RecordMeta & Readonly<{
  id: string
  projectId: string | null
  versionId: string | null
  iterationId: string | null
  testPlanId: string | null
  versionDigest: string | null
  kind: 'solo' | 'guided' | 'external' | 'blind' | 'unknown'
  startedAt: string | null
  endedAt: string | null
  status: 'draft' | 'completed' | 'withdrawn'
  context: JsonObject
  sourceRefs: TypedRef[]
  linkState: 'linked' | 'needs_assignment'
}>

export type EvidenceItem = RecordMeta & Readonly<{
  id: string
  sessionId: string
  projectId: string | null
  versionId: string | null
  kind: 'event' | 'quote' | 'observation' | 'facilitator_intervention' | 'debrief'
  at: string | null
  content: string
  sourceRefs: TypedRef[]
}>

export type EvidenceReview = RecordMeta & Readonly<{
  id: string
  projectId: string | null
  versionId: string | null
  iterationId: string | null
  sessionIds: string[]
  evidenceItemIds: string[]
  review: JsonObject
  sourceRefs: TypedRef[]
  linkState: 'linked' | 'needs_assignment'
}>

export type EvidenceSynthesis = RecordMeta & Readonly<{
  id: string
  lineageId: string
  revision: number
  parentSynthesisId: string | null
  projectId: string | null
  reviewIds: string[]
  synthesis: JsonObject
  sourceRefs: TypedRef[]
  linkState: 'linked' | 'needs_assignment'
}>

export type ChangeBrief = RecordMeta & Readonly<{
  id: string
  projectId: string
  iterationId: string
  reviewIds: string[]
  fromVersionId: string
  toVersionId: string
  primaryChange: string
  unchanged: string[]
  rationale: string
}>

export type ResourceAttachment = RecordMeta & Readonly<{
  id: string
  resourceId: string
  contextRef: TypedRef
  reason: string
}>

export type AgentSuggestion = RecordMeta & Readonly<{
  id: string
  agentType: string
  contextRefs: TypedRef[]
  sourceRefs: TypedRef[]
  suggestion: JsonValue
  status: 'pending' | 'accepted' | 'rejected'
  targetRef: TypedRef | null
}>

export type AgentRun = RecordMeta & Readonly<{
  id: string
  routine: string
  model: string
  contextRefs: TypedRef[]
  suggestionIds: string[]
  status: 'completed' | 'failed' | 'handed_off'
}>

export type Tombstone = Readonly<{
  entityKind: EntityKind
  entityId: string
  deletedAt: string
  deletedRevision: number
  reason: 'withdrawn' | 'deleted' | 'superseded'
}>

export type MigrationIssue = Readonly<{
  sourceKey: string
  level: 'info' | 'warning' | 'error'
  code: string
  message: string
  legacyRef?: LegacyRef
}>

export type MigrationReceipt = Readonly<{
  sourceDigest: string
  startedAt: string
  completedAt: string
  idMap: Readonly<Record<string, string>>
  sourceCounts: Readonly<Record<string, number>>
  targetCounts: Readonly<Record<string, number>>
  issues: MigrationIssue[]
}>

export type WorkspaceCollections = {
  courseEnrollments: CourseEnrollment[]
  activityAttempts: ActivityAttempt[]
  artifacts: Artifact[]
  ideaDrafts: IdeaDraft[]
  challengeInstances: ChallengeInstance[]
  projects: Project[]
  projectVersions: ProjectVersion[]
  prototypes: Prototype[]
  prototypeRuns: PrototypeRun[]
  iterationCycles: IterationCycle[]
  testPlans: TestPlan[]
  playtestSessions: PlaytestSession[]
  evidenceItems: EvidenceItem[]
  evidenceReviews: EvidenceReview[]
  evidenceSyntheses: EvidenceSynthesis[]
  changeBriefs: ChangeBrief[]
  resourceAttachments: ResourceAttachment[]
  agentSuggestions: AgentSuggestion[]
  agentRuns: AgentRun[]
  tombstones: Tombstone[]
}

export type LocalWorkspaceV3 = Readonly<{
  schemaVersion: 3
  workspaceId: string
  revision: number
  collections: WorkspaceCollections
  active: {
    enrollmentId?: string
    projectId?: string
    versionId?: string
    iterationId?: string
  }
  migration: MigrationReceipt | null
  createdAt: string
  updatedAt: string
}>

export const EMPTY_WORKSPACE_COLLECTIONS: WorkspaceCollections = {
  courseEnrollments: [],
  activityAttempts: [],
  artifacts: [],
  ideaDrafts: [],
  challengeInstances: [],
  projects: [],
  projectVersions: [],
  prototypes: [],
  prototypeRuns: [],
  iterationCycles: [],
  testPlans: [],
  playtestSessions: [],
  evidenceItems: [],
  evidenceReviews: [],
  evidenceSyntheses: [],
  changeBriefs: [],
  resourceAttachments: [],
  agentSuggestions: [],
  agentRuns: [],
  tombstones: [],
}

export function createEmptyWorkspace(workspaceId: string, now: string): LocalWorkspaceV3 {
  return {
    schemaVersion: 3,
    workspaceId,
    revision: 0,
    collections: structuredClone(EMPTY_WORKSPACE_COLLECTIONS),
    active: {},
    migration: null,
    createdAt: now,
    updatedAt: now,
  }
}
