export const VERSION_GOVERNANCE_STORAGE_KEY = 'tabletop-workshop-version-governance-v1'
export const PROTOTYPE_SCOPE_STORAGE_KEY = 'tabletop-workshop-prototype-scope-v1'
export const ISSUE_TO_SYSTEM_STORAGE_KEY = 'tabletop-workshop-issue-to-system-v1'
export const EXPERIENCE_INTENT_STORAGE_KEY = 'tabletop-workshop-experience-intent-v1'
export const CORE_LOOP_STORAGE_KEY = 'tabletop-workshop-core-loop-v1'
export const TEST_PLAN_STORAGE_KEY = 'tabletop-workshop-project-v1'
export const TEST_PLAN_DRAFT_STORAGE_KEY = 'tabletop-workshop-single-question-test-plan-draft-v1'
export const PLAYTEST_SESSION_STORAGE_KEY = 'tabletop-workshop-playtest-sessions-v1'
export const FEEDBACK_REVIEW_STORAGE_KEY = 'tabletop-workshop-feedback-v1'
export const EVIDENCE_SYNTHESIS_STORAGE_KEY = 'tabletop-workshop-evidence-syntheses-v1'
export const PRODUCTION_LEDGER_STORAGE_KEY = 'tabletop-workshop-production-ledgers-v1'

export const PROJECT_WORKSPACE_STORAGE_KEY = 'tabletop-workshop-project-workspace-v2'
export const LEGACY_PROJECT_WORKSPACE_STORAGE_KEY = 'tabletop-workshop-project-workspace-v1'
export const LEARNING_PROGRESS_STORAGE_KEY = 'tabletop-workshop-learning-node-progress-v2'
export const LEGACY_LEARNING_PROGRESS_STORAGE_KEY = 'tabletop-workshop-learning-node-progress-v1'
export const FIRST_TABLETOP_STORAGE_KEY = 'tabletop-workshop-first-tabletop-v1'
export const REDESIGN_STORAGE_KEY = 'tabletop-workshop-redesign-v1'
export const CONSTRAINT_STORAGE_KEY = 'tabletop-workshop-constraint-experiments-v1'
export const BALANCE_STORAGE_KEY = 'tabletop-workshop-balance-passes-v1'
export const DECISION_TRACE_STORAGE_KEY = 'tabletop-workshop-decision-traces-v1'
export const SHARED_DECISION_STORAGE_KEY = 'tabletop-workshop-shared-decisions-v1'
export const THEME_REVIEW_STORAGE_KEY = 'tabletop-workshop-theme-reviews-v1'
export const PUBLISHING_ROUTE_STORAGE_KEY = 'tabletop-workshop-publishing-route-maps-v1'
export const TEACHING_PATH_STORAGE_KEY = 'tabletop-workshop-teaching-paths-v1'
export const ACCESSIBILITY_STORAGE_KEY = 'tabletop-workshop-accessibility-observations-v1'

export const WORKSPACE_V3_MANIFEST_STORAGE_KEY = 'tabletop-workshop-workspace-v3-manifest'
export const WORKSPACE_V3_REVISION_KEY_PREFIX = 'tabletop-workshop-workspace-v3-revision:'
export const WORKSPACE_V3_LEGACY_BACKUP_KEY_PREFIX = 'tabletop-workshop-workspace-v3-legacy-backup:'

export type LegacyStorageTarget =
  | 'project'
  | 'course_progress'
  | 'idea_challenge'
  | 'artifact'
  | 'test_plan'
  | 'playtest_session'
  | 'evidence_review'
  | 'evidence_synthesis'

export type LegacyStorageDescriptor = Readonly<{
  key: string
  status: 'active' | 'legacy'
  shape: string
  target: LegacyStorageTarget
  collection?: string
  legacyVariants?: readonly string[]
}>

export const LEGACY_STORAGE_REGISTRY = [
  { key: PROJECT_WORKSPACE_STORAGE_KEY, status: 'active', shape: 'project-workspace-v2-object', target: 'project' },
  { key: LEGACY_PROJECT_WORKSPACE_STORAGE_KEY, status: 'legacy', shape: 'project-workspace-v1-object', target: 'project' },
  { key: LEARNING_PROGRESS_STORAGE_KEY, status: 'active', shape: 'learning-progress-v2-object', target: 'course_progress' },
  { key: LEGACY_LEARNING_PROGRESS_STORAGE_KEY, status: 'legacy', shape: 'learning-progress-v1-object', target: 'course_progress' },
  { key: FIRST_TABLETOP_STORAGE_KEY, status: 'active', shape: 'first-tabletop-v1-object', target: 'idea_challenge' },
  { key: EXPERIENCE_INTENT_STORAGE_KEY, status: 'active', shape: 'draft-records-v1', target: 'artifact', collection: 'records' },
  { key: CORE_LOOP_STORAGE_KEY, status: 'active', shape: 'draft-records-v1', target: 'artifact', collection: 'records' },
  { key: PROTOTYPE_SCOPE_STORAGE_KEY, status: 'active', shape: 'draft-records-v1', target: 'artifact', collection: 'records' },
  { key: TEST_PLAN_DRAFT_STORAGE_KEY, status: 'active', shape: 'draft-v1', target: 'test_plan' },
  { key: TEST_PLAN_STORAGE_KEY, status: 'active', shape: 'record-array-v1', target: 'test_plan' },
  { key: PLAYTEST_SESSION_STORAGE_KEY, status: 'active', shape: 'draft-records-v1', target: 'playtest_session', collection: 'records' },
  { key: FEEDBACK_REVIEW_STORAGE_KEY, status: 'active', shape: 'draft-records-v2', target: 'evidence_review', collection: 'records', legacyVariants: ['record-array-v1'] },
  { key: EVIDENCE_SYNTHESIS_STORAGE_KEY, status: 'active', shape: 'draft-records-v2', target: 'evidence_synthesis', collection: 'records', legacyVariants: ['draft-records-v1'] },
  { key: VERSION_GOVERNANCE_STORAGE_KEY, status: 'active', shape: 'draft-records-v1', target: 'artifact', collection: 'records' },
  { key: ISSUE_TO_SYSTEM_STORAGE_KEY, status: 'active', shape: 'draft-records-v1', target: 'artifact', collection: 'records' },
  { key: REDESIGN_STORAGE_KEY, status: 'active', shape: 'record-array-v1', target: 'artifact' },
  { key: CONSTRAINT_STORAGE_KEY, status: 'active', shape: 'named-collection-v1', target: 'artifact', collection: 'experiments' },
  { key: BALANCE_STORAGE_KEY, status: 'active', shape: 'named-collection-v1', target: 'artifact', collection: 'passes' },
  { key: DECISION_TRACE_STORAGE_KEY, status: 'active', shape: 'named-collection-v1', target: 'artifact', collection: 'traces' },
  { key: SHARED_DECISION_STORAGE_KEY, status: 'active', shape: 'named-collection-v1', target: 'artifact', collection: 'observations' },
  { key: THEME_REVIEW_STORAGE_KEY, status: 'active', shape: 'named-collection-v1', target: 'artifact', collection: 'reviews' },
  { key: PRODUCTION_LEDGER_STORAGE_KEY, status: 'active', shape: 'named-collection-v1', target: 'artifact', collection: 'ledgers', legacyVariants: ['record-array-v1'] },
  { key: PUBLISHING_ROUTE_STORAGE_KEY, status: 'active', shape: 'named-collection-v1', target: 'artifact', collection: 'maps' },
  { key: TEACHING_PATH_STORAGE_KEY, status: 'active', shape: 'named-collection-v1', target: 'artifact', collection: 'paths' },
  { key: ACCESSIBILITY_STORAGE_KEY, status: 'active', shape: 'named-collection-v2', target: 'artifact', collection: 'observations', legacyVariants: ['named-collection-v1'] },
] as const satisfies readonly LegacyStorageDescriptor[]

export const ACTIVE_LEGACY_STORAGE_KEYS = LEGACY_STORAGE_REGISTRY.filter(item => item.status === 'active').map(item => item.key)
export const SUPERSEDED_LEGACY_STORAGE_KEYS = LEGACY_STORAGE_REGISTRY.filter(item => item.status === 'legacy').map(item => item.key)
