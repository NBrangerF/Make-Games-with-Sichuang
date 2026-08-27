import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

import { COURSE_V3_ID, COURSE_V3_VERSION, courseUnitsV3, unit01Games } from '../src/course/course-catalog-v3.ts'
import { saveCourseActivityDraft, startCourseEnrollment, submitCourseActivity, submitCourseEntityActivity } from '../src/domain/course-commands-v3.ts'
import { createProject, createProjectVersion, recordPrototypeRun, savePrototype } from '../src/domain/commands-v3.ts'
import { createEmptyWorkspace } from '../src/domain/schema-v3.ts'
import { assertWorkspaceV3 } from '../src/domain/validation-v3.ts'
import { parseRouteHash, serializeRoute } from '../src/url-state.ts'

let counter = 0
const options = { id: prefix => `${prefix}-course-${++counter}`, now: () => `2026-08-27T01:00:${String(counter).padStart(2, '0')}.000Z` }

assert.equal(courseUnitsV3.length, 9)
assert.equal(new Set(courseUnitsV3.map(item => item.id)).size, 9)
assert.deepEqual(courseUnitsV3.map(item => item.number), ['01', '02', '03', '04', '05', '06', '07', '08', '09'])
for (const unit of courseUnitsV3) {
  for (const field of ['title', 'question', 'output', 'activityId', 'activityRevision', 'toolLabel', 'conciseConcept', 'example', 'counterexample']) assert.ok(unit[field], `${unit.id}.${field} is empty`)
  assert.ok(unit.rubric.length >= 3 && unit.rubric.length <= 5, `${unit.id} rubric must contain 3–5 checks`)
}
assert.ok(courseUnitsV3.every(item => item.status === 'available'), 'all nine units must be runnable')
assert.equal(unit01Games.length, 3)
assert.equal(new Set(unit01Games.map(item => item.id)).size, 3)
for (const game of unit01Games) {
  assert.ok(game.materials && game.setup && game.watch)
  assert.ok(game.rules.length >= 3)
}
assert.equal(JSON.stringify(unit01Games).includes('购买'), false)

const workspace = createEmptyWorkspace('workspace-course', options.now())
const enrollmentId = startCourseEnrollment(workspace, { courseId: COURSE_V3_ID, courseVersion: COURSE_V3_VERSION, firstUnitId: 'unit-01' }, options)
assert.equal(startCourseEnrollment(workspace, { courseId: COURSE_V3_ID, courseVersion: COURSE_V3_VERSION, firstUnitId: 'unit-01' }, options), enrollmentId, 'starting the same active course must be idempotent')
assert.throws(() => submitCourseActivity(workspace, { enrollmentId, unitId: 'unit-02', unitRevision: '1', activityId: 'game-skeleton', activityRevision: '1', value: {}, nextUnitId: 'unit-03' }, options), /not the current unit/, 'deep links must not skip course prerequisites')
const value = {
  rows: Object.fromEntries(unit01Games.map(game => [game.id, { played: true, action: '玩家移动了手', choice: '两个选项', information: '看见上轮结果', feedback: '立即看见状态变化' }])),
  reflection: '隐藏石头最容易看见玩家如何把一次提问转化成选择依据。',
}
const draft = saveCourseActivityDraft(workspace, { enrollmentId, unitId: 'unit-01', unitRevision: '1', activityId: 'compare-three-microgames', activityRevision: '1', value }, options)
assert.equal(workspace.collections.artifacts.find(item => item.id === draft.artifactId).status, 'draft')
assert.equal(workspace.collections.activityAttempts[0].state, 'artifact_submitted')
assert.equal(workspace.collections.courseEnrollments[0].currentUnitId, 'unit-01', 'saving a draft must not advance course progress')
const submitted = submitCourseActivity(workspace, { enrollmentId, unitId: 'unit-01', unitRevision: '1', activityId: 'compare-three-microgames', activityRevision: '1', value, nextUnitId: 'unit-02' }, options)
assert.equal(submitted.artifactId, draft.artifactId, 'submit must revise the draft artifact rather than duplicate it')
assert.equal(workspace.collections.artifacts.find(item => item.id === draft.artifactId).status, 'complete')
assert.equal(workspace.collections.activityAttempts[0].state, 'unit_complete')
assert.equal(workspace.collections.activityAttempts[0].completionAttestation, 'native')
assert.equal(workspace.collections.courseEnrollments[0].currentUnitId, 'unit-02')

submitCourseActivity(workspace, { enrollmentId, unitId: 'unit-02', unitRevision: '1', activityId: 'game-skeleton', activityRevision: '1', value: { goal: '三轮后信号标记最多', actions: '选一张卡并改变一枚标记', ending: '第三轮结束后比较标记' }, nextUnitId: 'unit-03' }, options)
submitCourseActivity(workspace, { enrollmentId, unitId: 'unit-03', unitRevision: '1', activityId: 'decision-table', activityRevision: '1', value: { options: '现在得两分或保留卡', tradeoffs: '立即得分或下轮更高收益', information: '看见已出卡但不知对手下一张' }, nextUnitId: 'unit-04' }, options)
const projectId = createProject(workspace, { title: '课程微型原型' }, options)
const versionId = createProjectVersion(workspace, { projectId, label: 'v0.1' }, options)
const prototypeId = savePrototype(workspace, { projectId, versionId, title: '三轮原型', design: { scope: '三张卡与两枚标记' } }, options)
const prototypeRunId = recordPrototypeRun(workspace, { prototypeId, projectId, versionId, note: '完整运行三轮并观察了状态变化' }, options)
const unit4 = submitCourseEntityActivity(workspace, { enrollmentId, unitId: 'unit-04', unitRevision: '1', activityId: 'minimum-loop', activityRevision: '1', entityRef: { scope: 'workspace', kind: 'prototype_run', id: prototypeRunId, relation: 'evidences' }, nextUnitId: 'unit-05' }, options)
const unit4Artifact = workspace.collections.artifacts.find(item => item.id === unit4.artifactId)
assert.equal(unit4Artifact.artifactType, 'entity_reference')
assert.equal(unit4Artifact.payload.entityRef.id, prototypeRunId)
assert.equal(workspace.collections.prototypeRuns.length, 1, 'course referencing must not duplicate or rewrite project evidence')
assert.equal(workspace.collections.courseEnrollments[0].currentUnitId, 'unit-05')
assertWorkspaceV3(workspace)

const activityUrl = `#course/units/unit-01/activities/compare-three-microgames?course=${COURSE_V3_ID}&enrollment=${enrollmentId}`
assert.equal(serializeRoute(parseRouteHash(activityUrl)), activityUrl)

const [source, style] = await Promise.all([
  readFile(new URL('../src/course/course-v3.tsx', import.meta.url), 'utf8'),
  readFile(new URL('../src/styles-course-v3.css', import.meta.url), 'utf8'),
])
for (const contract of ['保存草稿', '提交产物并完成 Unit 1', '我已经用上述材料实际运行至少一轮', '规则 ≠ 行为 ≠ 体验', '不用文本声明「我做过了」', '课程进度与项目进度分开']) assert.ok(source.includes(contract), `course UI missing ${contract}`)
assert.ok(style.includes('@media (max-width: 760px)'))

console.log('course v3: PASS (all 9 units runnable; structured drafts and project-entity evidence stay separate)')
