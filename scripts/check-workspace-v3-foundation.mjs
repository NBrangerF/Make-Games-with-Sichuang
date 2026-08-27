import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

import {
  ACTIVE_LEGACY_STORAGE_KEYS,
  LEGACY_STORAGE_REGISTRY,
  SUPERSEDED_LEGACY_STORAGE_KEYS,
  WORKSPACE_V3_MANIFEST_STORAGE_KEY,
} from '../src/storage-keys.ts'
import { canonicalizeJson } from '../src/domain/ids.ts'
import { scanLegacyStorage } from '../src/domain/legacy-scan.ts'
import { migrateLegacyReport } from '../src/domain/migration-v3.ts'
import { createEmptyWorkspace } from '../src/domain/schema-v3.ts'
import { getVersionFacts, canCreateChangeBrief, canCreateReview, canCreateSession } from '../src/domain/state-gates.ts'
import { MemoryStorage } from '../src/domain/storage-adapter.ts'
import { assertWorkspaceV3 } from '../src/domain/validation-v3.ts'
import {
  estimateStorageBytes,
  storageBackendDecision,
  WorkspaceConflictError,
  WorkspacePersistenceError,
  WorkspaceRepository,
} from '../src/domain/workspace-repository.ts'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const NOW = '2026-08-27T00:00:00.000Z'
const LATER = '2026-08-27T00:00:01.000Z'

function readJson(path) {
  return JSON.parse(readFileSync(`${ROOT}/${path}`, 'utf8'))
}

function storageFromFixture(path) {
  const fixture = readJson(path)
  return new MemoryStorage(Object.fromEntries(Object.entries(fixture).map(([key, value]) => [key, JSON.stringify(value)])))
}

function makeNativeWorkspace() {
  const workspace = createEmptyWorkspace('workspace-native', NOW)
  const collections = workspace.collections
  collections.projects.push({
    id: 'project-1', title: '原生项目', profile: {}, activeVersionId: 'version-2', archivedAt: null, sourceRefs: [], sample: false, createdAt: NOW, updatedAt: NOW,
  })
  collections.projectVersions.push(
    { id: 'version-1', projectId: 'project-1', label: 'v0.1', parentVersionId: null, lifecycle: 'frozen', frozenDigest: 'digest-v0.1', summary: '可测试版本', currentQuestion: '选择是否成立', nextAction: '进行测试', sourceRefs: [], createdAt: NOW, updatedAt: NOW },
    { id: 'version-2', projectId: 'project-1', label: 'v0.2', parentVersionId: 'version-1', lifecycle: 'working', frozenDigest: null, summary: '根据证据创建', currentQuestion: '待下一轮定义', nextAction: '启动新循环', sourceRefs: [], createdAt: LATER, updatedAt: LATER },
  )
  collections.prototypes.push({ id: 'prototype-1', projectId: 'project-1', versionId: 'version-1', title: '纸面原型', design: {}, sourceRefs: [], linkState: 'linked', createdAt: NOW, updatedAt: NOW })
  collections.prototypeRuns.push({ id: 'run-1', prototypeId: 'prototype-1', projectId: 'project-1', versionId: 'version-1', configuration: {}, startedAt: NOW, endedAt: LATER, status: 'completed', events: [], createdAt: NOW, updatedAt: LATER })
  collections.iterationCycles.push({ id: 'cycle-1', projectId: 'project-1', versionId: 'version-1', uncertainty: '玩家是否会权衡', currentStep: 'version', status: 'completed', createdAt: NOW, updatedAt: LATER })
  collections.testPlans.push({ id: 'plan-1', projectId: 'project-1', versionId: 'version-1', iterationId: 'cycle-1', versionDigest: 'digest-v0.1', status: 'confirmed', plan: { question: '玩家是否会权衡？' }, sourceRefs: [], linkState: 'linked', createdAt: NOW, updatedAt: NOW })
  collections.playtestSessions.push({ id: 'session-1', projectId: 'project-1', versionId: 'version-1', iterationId: 'cycle-1', testPlanId: 'plan-1', versionDigest: 'digest-v0.1', kind: 'external', startedAt: NOW, endedAt: LATER, status: 'completed', context: {}, sourceRefs: [], linkState: 'linked', createdAt: NOW, updatedAt: LATER })
  collections.evidenceItems.push({ id: 'evidence-1', sessionId: 'session-1', projectId: 'project-1', versionId: 'version-1', kind: 'observation', at: NOW, content: '玩家停顿后改变了选择', sourceRefs: [], createdAt: NOW, updatedAt: NOW })
  collections.evidenceReviews.push({ id: 'review-1', projectId: 'project-1', versionId: 'version-1', iterationId: 'cycle-1', sessionIds: ['session-1'], evidenceItemIds: ['evidence-1'], review: { interpretation: '信息会改变权衡' }, sourceRefs: [], linkState: 'linked', createdAt: NOW, updatedAt: LATER })
  collections.changeBriefs.push({ id: 'brief-1', projectId: 'project-1', iterationId: 'cycle-1', reviewIds: ['review-1'], fromVersionId: 'version-1', toVersionId: 'version-2', primaryChange: '提前一条信息', unchanged: ['回合数'], rationale: '证据显示信息时机影响选择', createdAt: LATER, updatedAt: LATER })
  workspace.active.projectId = 'project-1'
  workspace.active.versionId = 'version-2'
  assertWorkspaceV3(workspace)
  return workspace
}

function checkRegistry() {
  assert.equal(LEGACY_STORAGE_REGISTRY.length, 25)
  assert.equal(ACTIVE_LEGACY_STORAGE_KEYS.length, 23)
  assert.equal(SUPERSEDED_LEGACY_STORAGE_KEYS.length, 2)
  assert.equal(new Set(LEGACY_STORAGE_REGISTRY.map(item => item.key)).size, 25)
  const matrix = readFileSync(`${ROOT}/docs/product/STORAGE_MIGRATION_V3_MATRIX.md`, 'utf8')
  for (const item of LEGACY_STORAGE_REGISTRY) assert.match(matrix, new RegExp(item.key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')))

  const storage = storageFromFixture('tests/fixtures/legacy-storage-all-active.json')
  const before = storage.dump()
  const report = scanLegacyStorage(storage, NOW)
  assert.equal(report.activeKeyCount, 23)
  assert.equal(report.legacyKeyCount, 2)
  assert.equal(report.presentKeyCount, 23)
  assert.deepEqual(storage.dump(), before, 'read-only scan changed source storage')
}

function checkMigration() {
  const storage = storageFromFixture('tests/fixtures/legacy-storage-all-active.json')
  const before = storage.dump()
  const report = scanLegacyStorage(storage, NOW)
  const first = migrateLegacyReport(report, { workspaceId: 'workspace-migrated', now: LATER })
  const second = migrateLegacyReport(report, { workspaceId: 'workspace-migrated', now: LATER })
  assertWorkspaceV3(first)
  assert.equal(canonicalizeJson(first), canonicalizeJson(second), 'migration must be deterministic')
  assert.deepEqual(storage.dump(), before, 'migration changed a legacy source key')
  assert.equal(first.collections.prototypeRuns.length, 0, 'legacy text must not imply a PrototypeRun')
  assert.equal(first.collections.changeBriefs.length, 0, 'legacy completion labels must not imply a ChangeBrief')
  assert.equal(first.migration.sourceDigest, report.sourceDigest)
  assert.equal(Object.keys(first.migration.idMap).length > 0, true)
  const migratedVersionId = first.collections.projects[0].activeVersionId
  assert.ok(migratedVersionId)
  assert.deepEqual(getVersionFacts(first, migratedVersionId), {
    hasPrototype: false,
    hasTabletopRun: false,
    hasSoloTest: false,
    hasExternalTest: false,
    hasEvidenceReview: false,
    hasOutgoingRevision: false,
  })
  assert.equal(canCreateReview(first, [first.collections.playtestSessions.find(item => item.status === 'completed').id]).allowed, false)

  const oldStorage = storageFromFixture('tests/fixtures/legacy-storage-superseded.json')
  const oldWorkspace = migrateLegacyReport(scanLegacyStorage(oldStorage, NOW), { workspaceId: 'workspace-old', now: LATER })
  assertWorkspaceV3(oldWorkspace)
  assert.equal(oldWorkspace.collections.projects.length, 1)
  assert.equal(oldWorkspace.collections.courseEnrollments[0].courseVersion, 'v1')

  const variantStorage = storageFromFixture('tests/fixtures/legacy-storage-shape-variants.json')
  const variantWorkspace = migrateLegacyReport(scanLegacyStorage(variantStorage, NOW), { workspaceId: 'workspace-variants', now: LATER })
  assertWorkspaceV3(variantWorkspace)
  assert.ok(variantWorkspace.collections.artifacts.some(item => item.artifactType === 'legacy_artifact_v1' && item.payload.reason.includes('source session')))

  const corruptStorage = new MemoryStorage({
    'tabletop-workshop-feedback-v1': '{broken',
    'tabletop-workshop-accessibility-observations-v1': JSON.stringify({ schemaVersion: 99, observations: [{ id: 'unknown-schema', note: '保留' }] }),
  })
  const corruptBefore = corruptStorage.dump()
  const corruptWorkspace = migrateLegacyReport(scanLegacyStorage(corruptStorage, NOW), { workspaceId: 'workspace-corrupt', now: LATER })
  assertWorkspaceV3(corruptWorkspace)
  assert.deepEqual(corruptStorage.dump(), corruptBefore)
  assert.ok(corruptWorkspace.collections.artifacts.some(item => item.artifactType === 'legacy_artifact_v1' && item.payload.raw === '{broken'))
}

function checkDomainGates() {
  const workspace = makeNativeWorkspace()
  assert.deepEqual(getVersionFacts(workspace, 'version-1'), {
    hasPrototype: true,
    hasTabletopRun: true,
    hasSoloTest: false,
    hasExternalTest: true,
    hasEvidenceReview: true,
    hasOutgoingRevision: true,
  })
  assert.equal(canCreateSession(workspace, 'plan-1').allowed, true)
  assert.equal(canCreateReview(workspace, ['session-1']).allowed, true)
  assert.equal(canCreateChangeBrief(workspace, ['review-1']).allowed, false, 'a completed cycle with an outgoing revision must not create another edge')
  const beforeRevision = structuredClone(workspace)
  beforeRevision.collections.changeBriefs = []
  beforeRevision.collections.iterationCycles[0].status = 'active'
  assert.equal(canCreateChangeBrief(beforeRevision, ['review-1']).allowed, true)

  const tombstoned = structuredClone(workspace)
  tombstoned.collections.tombstones.push({ entityKind: 'prototype_run', entityId: 'run-1', deletedAt: LATER, deletedRevision: 1, reason: 'withdrawn' })
  tombstoned.collections.tombstones.push({ entityKind: 'change_brief', entityId: 'brief-1', deletedAt: LATER, deletedRevision: 1, reason: 'withdrawn' })
  const facts = getVersionFacts(tombstoned, 'version-1')
  assert.equal(facts.hasTabletopRun, false)
  assert.equal(facts.hasOutgoingRevision, false)

  const invalid = structuredClone(workspace)
  invalid.collections.changeBriefs[0].fromVersionId = 'version-2'
  assert.throws(() => assertWorkspaceV3(invalid), /revision_edge_mismatch/)
}

function checkRepository() {
  let clock = 0
  const now = () => `2026-08-27T00:00:0${clock++}.000Z`
  const legacySentinel = { 'tabletop-workshop-first-tabletop-v1': '{"title":"do not change"}' }
  const storage = new MemoryStorage(legacySentinel)
  const repository = new WorkspaceRepository(storage, now)
  const initial = makeNativeWorkspace()
  const revision0 = repository.initialize(initial)
  assert.equal(revision0.revision, 0)
  const revision1 = repository.commit(0, structuredClone(revision0))
  assert.equal(revision1.revision, 1)
  assert.throws(() => repository.commit(0, revision0), WorkspaceConflictError)
  const backup = repository.exportBackup()
  assert.equal(repository.inspectBackup(backup).workspace.revision, 1)
  const manifest = repository.getManifest()
  storage.setItem(manifest.activeKey, '{corrupt')
  assert.throws(() => repository.load(), WorkspacePersistenceError)
  const recovered = repository.recoverLastGood()
  assert.equal(recovered.revision, 2)
  assert.equal(repository.load().revision, 2)
  assert.equal(storage.getItem('tabletop-workshop-first-tabletop-v1'), legacySentinel['tabletop-workshop-first-tabletop-v1'])
  assert.equal(repository.restoreBackupStrict(backup).revision, 3)

  const tooSmall = new MemoryStorage({}, 128)
  const failedRepository = new WorkspaceRepository(tooSmall, () => NOW)
  assert.throws(() => failedRepository.initialize(initial), WorkspacePersistenceError)
  assert.equal(tooSmall.getItem(WORKSPACE_V3_MANIFEST_STORAGE_KEY), null)
}

function checkCapacityContract() {
  const workspace = makeNativeWorkspace()
  const fixture = structuredClone(workspace)
  for (let index = 0; index < 400; index += 1) {
    fixture.collections.evidenceItems.push({
      id: `capacity-evidence-${index}`,
      sessionId: 'session-1',
      projectId: 'project-1',
      versionId: 'version-1',
      kind: 'observation',
      at: NOW,
      content: `第 ${index + 1} 条观察：${'玩家在做决定前对比了两个选项。'.repeat(8)}`,
      sourceRefs: [], createdAt: NOW, updatedAt: NOW,
    })
  }
  assertWorkspaceV3(fixture)
  const fixtureBytes = estimateStorageBytes({ fixture: JSON.stringify(fixture) })
  assert.ok(fixtureBytes > 100_000)
  assert.equal(storageBackendDecision({ fixtureBytes, availableQuotaBytes: fixtureBytes * 3, p95WriteMs: 20 }).useIndexedDb, false)
  assert.equal(storageBackendDecision({ fixtureBytes, availableQuotaBytes: fixtureBytes, p95WriteMs: 20 }).useIndexedDb, true)
  assert.equal(storageBackendDecision({ fixtureBytes, availableQuotaBytes: fixtureBytes * 10, p95WriteMs: 250 }).useIndexedDb, true)
  return fixtureBytes
}

checkRegistry()
checkMigration()
checkDomainGates()
checkRepository()
const fixtureBytes = checkCapacityContract()

console.log(`workspace v3 foundation: PASS (25 legacy keys, capacity fixture ${fixtureBytes} bytes)`)
