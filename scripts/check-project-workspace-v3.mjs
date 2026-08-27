import assert from 'node:assert/strict'

import {
  completePlaytest,
  confirmTestPlan,
  createEvidenceReview,
  createIdeaProject,
  createProject,
  createProjectVersion,
  createRevisionFromReviews,
  recordPrototypeRun,
  savePrototype,
  saveTestPlanDraft,
  startIteration,
} from '../src/domain/commands-v3.ts'
import { createEmptyWorkspace } from '../src/domain/schema-v3.ts'
import { getVersionFacts } from '../src/domain/state-gates.ts'
import { assertWorkspaceV3 } from '../src/domain/validation-v3.ts'

let counter = 0
const options = { id: prefix => `${prefix}-${++counter}`, now: () => `2026-08-27T00:00:${String(counter).padStart(2, '0')}.000Z` }
const workspace = createEmptyWorkspace('workspace-command-flow', options.now())

const emptyProjectId = createProject(workspace, { title: '无版本项目' }, options)
assert.throws(() => startIteration(workspace, { projectId: emptyProjectId, versionId: 'missing', uncertainty: '不应成功' }, options), /version/)
assert.equal(workspace.collections.iterationCycles.length, 0, 'project without a version must remain blocked')

const created = createIdeaProject(workspace, {
  driver: 'experience', prompt: '在信息不完整时判断',
  directions: [{ title: '稀缺选择' }, { title: '隐藏信息' }, { title: '共享局面' }], selectedDirectionIndex: 1,
  title: '群岛信号', profile: { playerCount: '3–4 人', duration: '10 分钟' }, prototype: { coreAction: '选一张信号卡' },
}, options)
assert.equal(workspace.collections.ideaDrafts.length, 1)
assert.equal(workspace.collections.ideaDrafts[0].directions.length, 3)
assert.equal(workspace.collections.projectVersions.find(item => item.id === created.versionId).label, 'v0.1')
assert.equal(workspace.collections.prototypes[0].sourceRefs[0].id, created.ideaId)

const cycleId = startIteration(workspace, { projectId: created.projectId, versionId: created.versionId, uncertainty: '玩家是否会保留稀有信号' }, options)
assert.throws(() => startIteration(workspace, { projectId: created.projectId, versionId: created.versionId, uncertainty: '第二条活动轮次' }, options), /already has an active iteration/)
const planId = saveTestPlanDraft(workspace, { projectId: created.projectId, versionId: created.versionId, iterationId: cycleId, question: '玩家会保留信号吗？', signals: '玩家在打出前对比延迟收益', disconfirmingSignal: '所有人立即打出' }, options)
const prototypeId = savePrototype(workspace, { projectId: created.projectId, versionId: created.versionId, title: '三轮信号', design: { scope: '只保留三轮选择' } }, options)
assert.equal(workspace.collections.prototypes.find(item => item.id === prototypeId).sourceRefs[0].id, created.ideaId, 'editing a prototype must preserve idea provenance')
assert.throws(() => confirmTestPlan(workspace, planId, options), /completed tabletop prototype run/)
recordPrototypeRun(workspace, { prototypeId, projectId: created.projectId, versionId: created.versionId, note: '完整跑完三轮' }, options)
confirmTestPlan(workspace, planId, options)
assert.throws(() => savePrototype(workspace, { projectId: created.projectId, versionId: created.versionId, title: '不应改写', design: {} }, options), /working version/, 'a frozen tested version must not be edited')
const session = completePlaytest(workspace, { testPlanId: planId, kind: 'external', observations: ['两名玩家停顿后保留卡', '一名玩家说想看下一轮收益'] }, options)
const reviewId = createEvidenceReview(workspace, { sessionIds: [session.sessionId], observation: '三人中两人保留', interpretation: '延迟收益已可见', alternative: '可能只是两人偏好保守' }, options)
const nextVersionId = createRevisionFromReviews(workspace, { reviewIds: [reviewId], primaryChange: '提前公开下轮收益', unchanged: ['三轮结构', '玩家人数'], rationale: '观察显示可见收益会改变选择' }, options)
assert.throws(() => createRevisionFromReviews(workspace, { reviewIds: [reviewId], primaryChange: '第二条边', unchanged: ['无'], rationale: '不应成功' }, options), /iteration_not_active|revision_already_created/, 'one cycle must create only one outgoing version edge')

assertWorkspaceV3(workspace)
assert.deepEqual(getVersionFacts(workspace, created.versionId), { hasPrototype: true, hasTabletopRun: true, hasSoloTest: false, hasExternalTest: true, hasEvidenceReview: true, hasOutgoingRevision: true })
const nextVersion = workspace.collections.projectVersions.find(item => item.id === nextVersionId)
assert.equal(nextVersion.parentVersionId, created.versionId)
assert.equal(workspace.collections.changeBriefs[0].fromVersionId, created.versionId)
assert.equal(workspace.collections.changeBriefs[0].toVersionId, nextVersionId)
assert.equal(workspace.collections.iterationCycles.find(item => item.id === cycleId).status, 'completed')

const manualVersionId = createProjectVersion(workspace, { projectId: emptyProjectId, label: 'v0.1' }, options)
assert.ok(manualVersionId)
assertWorkspaceV3(workspace)

console.log('project workspace v3: PASS (no-version gate, idea provenance, PrototypeRun, frozen test, evidence review and exact revision edge)')
