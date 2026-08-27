import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

import {
  attachResource, completePlaytest, confirmTestPlan, createEvidenceReview, createIdeaProject, createRevisionFromReviews,
  recordPrototypeRun, savePrototype, saveTestPlanDraft, startIteration,
} from '../src/domain/commands-v3.ts'
import { exportProjectSharePackage, inspectProjectSharePackage, mergeProjectSharePackage } from '../src/domain/project-package-v3.ts'
import { createEmptyWorkspace } from '../src/domain/schema-v3.ts'
import { assertWorkspaceV3 } from '../src/domain/validation-v3.ts'

let counter = 0
const options = { id: prefix => `${prefix}-support-${++counter}`, now: () => `2026-08-27T03:00:${String(counter).padStart(2, '0')}.000Z` }
const source = createEmptyWorkspace('workspace-support-source', options.now())
const created = createIdeaProject(source, {
  driver: 'experience', prompt: '让玩家根据不完整信号决定', directions: [{ title: '信号' }], selectedDirectionIndex: 0,
  title: '脱敏群岛', profile: { playerCount: '3 人', privateNotes: '不应分享', email: 'private@example.com' }, prototype: { coreAction: '选卡' },
}, options)
const cycleId = startIteration(source, { projectId: created.projectId, versionId: created.versionId, uncertainty: '玩家会保留信号吗' }, options)
const planId = saveTestPlanDraft(source, { projectId: created.projectId, versionId: created.versionId, iterationId: cycleId, question: '玩家会保留信号吗？', signals: '停顿后保留', disconfirmingSignal: '全部立即打出' }, options)
const prototypeId = savePrototype(source, { projectId: created.projectId, versionId: created.versionId, title: '三轮原型', design: { scope: '三轮' } }, options)
recordPrototypeRun(source, { prototypeId, projectId: created.projectId, versionId: created.versionId, note: '完整运行三轮' }, options)
confirmTestPlan(source, planId, options)
const session = completePlaytest(source, { testPlanId: planId, kind: 'external', observations: ['两人停顿后保留'] }, options)
source.collections.playtestSessions.find(item => item.id === session.sessionId).context = { participantNames: '应被脱敏' }
const withdrawn = { ...source.collections.playtestSessions.find(item => item.id === session.sessionId), id: 'ses-withdrawn', status: 'withdrawn', context: { participantNames: '撤回' } }
source.collections.playtestSessions.push(withdrawn)
const reviewId = createEvidenceReview(source, { sessionIds: [session.sessionId], observation: '两人保留', interpretation: '延迟收益可见', alternative: '偏好保守' }, options)
createRevisionFromReviews(source, { reviewIds: [reviewId], primaryChange: '提前公开下轮收益', unchanged: ['三轮'], rationale: '现场证据' }, options)
const attachmentId = attachResource(source, { resourceId: 'ttgda-playtesting', contextRef: { scope: 'workspace', kind: 'iteration_cycle', id: cycleId, relation: 'attached_to' }, reason: '用于当前测试' }, options)
assert.equal(attachResource(source, { resourceId: 'ttgda-playtesting', contextRef: { scope: 'workspace', kind: 'iteration_cycle', id: cycleId, relation: 'attached_to' }, reason: '重复' }, options), attachmentId, 'resource attachment must be idempotent')

const raw = exportProjectSharePackage(source, created.projectId, options.now())
const inspected = inspectProjectSharePackage(raw)
assert.equal(inspected.collections.projects.length, 1)
assert.equal(inspected.collections.projects[0].profile.privateNotes, undefined)
assert.equal(inspected.collections.projects[0].profile.email, undefined)
assert.equal(inspected.collections.playtestSessions.some(item => item.status === 'withdrawn'), false)
assert.deepEqual(inspected.collections.playtestSessions[0].context, { redacted: true })
assert.equal(inspected.collections.resourceAttachments[0].id, attachmentId)

const target = createEmptyWorkspace('workspace-support-target', options.now())
const merged = mergeProjectSharePackage(target, raw)
assertWorkspaceV3(merged)
assert.equal(merged.collections.projects[0].id, created.projectId)
assert.equal(merged.collections.changeBriefs.length, 1)
assert.equal(merged.collections.resourceAttachments.length, 1)
const mergedAgain = mergeProjectSharePackage(merged, raw)
assert.equal(mergedAgain.collections.projects.length, 1, 'repeated import must be idempotent')

const conflicting = structuredClone(merged)
conflicting.collections.projects[0] = { ...conflicting.collections.projects[0], title: '冲突标题' }
assert.throws(() => mergeProjectSharePackage(conflicting, raw), /conflicting IDs/)
const tampered = raw.replace('提前公开下轮收益', '恶意替换')
assert.throws(() => inspectProjectSharePackage(tampered), /digest/)

const [appSource, workbenchSource] = await Promise.all([
  readFile(new URL('../src/App.tsx', import.meta.url), 'utf8'),
  readFile(new URL('../src/workbench/workbench-v3.tsx', import.meta.url), 'utf8'),
])
for (const contract of ['attachResource', 'openContextualResource', '返回当前任务']) assert.ok(appSource.includes(contract))
for (const contract of ['为什么相关', '看什么', '如何带回', '类比边界', '导入预览', '脱敏项目包']) assert.ok(workbenchSource.includes(contract), `support UI missing ${contract}`)

console.log('workspace support v3: PASS (3-item contextual support, durable attachment, redacted share, preview/merge/idempotency/conflict)')
