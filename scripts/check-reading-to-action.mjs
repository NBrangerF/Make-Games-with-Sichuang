import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const readJson = async path => JSON.parse(await readFile(new URL(path, import.meta.url), 'utf8'))
const [guides, resources, assessments, entryPoints, research, handover, validator] = await Promise.all([
  readJson('../content/special-guides.json'),
  readJson('../content/resources.json'),
  readJson('../content/resource-assessments.json'),
  readJson('../content/resource-entry-points.json'),
  readFile(new URL('../docs/research/READING_TO_ACTION_PATH_01.md', import.meta.url), 'utf8'),
  readFile(new URL('../docs/handovers/2026-08-21-reading-to-action-path.md', import.meta.url), 'utf8'),
  readFile(new URL('./validate-content.mjs', import.meta.url), 'utf8'),
])

const guide = guides.find(item => item.id === 'special-reading-to-action')
const kathleen = resources.find(item => item.id === 'kathleen-mercury-resources')
const kobold = resources.find(item => item.id === 'kobold-guide-board-game-design-official')
const koboldAssessment = assessments.find(item => item.resourceId === kobold?.id)
const entry = entryPoints.entryPoints.find(item => item.id === 'choose-learning-spine')
const checks = []

function check(name, action) {
  try {
    action()
    checks.push({ name, ok: true })
  } catch (error) {
    checks.push({ name, ok: false, error: error.message })
  }
}

check('guide exists as an action path rather than a ranked list', () => {
  assert.ok(guide)
  assert.equal(guide.stage, '体验意图')
  assert.match(guide.title, /上桌行动/)
  assert.match(guide.outcome, /阅读—行动合同/)
  assert.doesNotMatch(guide.outcome, /排名|总分/)
})

check('five steps run from a versioned question to evidence write-back', () => {
  assert.equal(guide.steps.length, 5)
  const labels = guide.steps.map(step => step.label).join(' ')
  for (const phrase of ['问题', '主线', '声音', '最小行动', '回写']) assert.match(labels, new RegExp(phrase))
})

check('review depth is explicit and metadata cannot impersonate full review', () => {
  const copy = JSON.stringify(guide)
  assert.match(copy, /审阅深度/)
  assert.match(copy, /metadata_only|元数据/)
  assert.match(copy, /不把书目简介写成深读/)
})

check('designer reading is crossed with dissent or player context', () => {
  const copy = JSON.stringify(guide)
  assert.match(copy, /玩家语境/)
  assert.match(copy, /反例|反对解释|异议/)
  assert.ok(guide.doneWhen.some(item => /没有只有设计者声音/.test(item)))
})

check('reading ends in one change, behavior prediction, and rebuttal signal', () => {
  const copy = JSON.stringify(guide)
  assert.match(copy, /只改一个/)
  assert.match(copy, /行为预测/)
  assert.match(copy, /反驳信号/)
})

check('write-back preserves alternative explanations and transfer context', () => {
  const finalStep = guide.steps.at(-1)
  assert.match(finalStep.prompt, /其他解释/)
  assert.match(finalStep.prompt, /新情境再测/)
  assert.ok(guide.claimIds.includes('claim-design-practice-needs-learning-extraction'))
  assert.ok(guide.claimIds.includes('claim-transfer-needs-changed-context'))
})

check('copyright and incomplete-PDF boundaries remain visible', () => {
  assert.match(guide.evidenceBoundary, /55 页中文预读版/)
  assert.match(guide.evidenceBoundary, /不完整/)
  assert.match(guide.evidenceBoundary, /可用不等于可再出版/)
})

check('Kathleen entry records current rights boundary', () => {
  assert.equal(kathleen.lastCheckedAt, '2026-08-21')
  assert.match(kathleen.limitation, /禁止将材料自行出版/)
})

check('Kobold entry separates current metadata from local partial review', () => {
  assert.equal(kobold.lastCheckedAt, '2026-08-21')
  assert.match(kobold.useful, /144 页/)
  assert.match(kobold.limitation, /55 页预读/)
  assert.equal(koboldAssessment.reviewDepth, 'metadata_only')
  assert.equal(koboldAssessment.reviewedAt, '2026-08-21')
})

check('resource entry promises an action and falsifiable output', () => {
  assert.match(entry.title, /产出行动/)
  assert.match(entry.outcome, /上桌动作/)
  assert.match(entry.outcome, /行为预测/)
  assert.match(entry.outcome, /反驳信号/)
})

check('guide reuses the existing design-to-test chain', () => {
  for (const tool of ['experience-intent', 'redesign', 'decision-trace', 'prototype-scope', 'test-plan', 'feedback', 'playtest-selector']) assert.ok(guide.toolIds.includes(tool), tool)
  assert.equal(guide.toolIds.length, 7)
})

check('core and special guides share one formal tool allowlist', () => {
  assert.equal(validator.match(/const guideToolIds = new Set/g)?.length, 1)
  assert.equal(validator.match(/!guideToolIds\.has\(toolId\)/g)?.length, 2)
})

check('research and handover preserve evidence and rendered-test limits', () => {
  for (const phrase of ['59a7d1a9439968ccc96ff0249015f2c3c2849b6cfbf6fc7dcdb4a24a1a5f4ebf', '不发布 PDF', '未验证问题']) assert.match(research, new RegExp(phrase))
  assert.match(handover, /content contract passed/)
  assert.match(handover, /真实方法页渲染.*没有签收/)
})

const failed = checks.filter(result => !result.ok)
for (const result of checks) console.log(`${result.ok ? 'PASS' : 'FAIL'}  ${result.name}${result.error ? `: ${result.error}` : ''}`)
console.log(`\n${checks.length - failed.length}/${checks.length} reading-to-action contract guards passed.`)
if (failed.length) process.exitCode = 1
