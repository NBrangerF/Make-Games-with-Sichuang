import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const root = new URL('../', import.meta.url)
const read = path => readFileSync(new URL(path, root), 'utf8')
const nodes = JSON.parse(read('content/learning-nodes.json'))
const app = read('src/App.tsx')
const route = read('src/learning-nodes-route.tsx')
const map = read('src/learning-node-map.tsx')
const page = read('src/learning-node-page.tsx')
const progress = read('src/learning-node-progress.ts')
const urlState = read('src/url-state.ts')
const styles = read('src/styles-learning-nodes.css')

const checks = []
const check = (label, action) => {
  try { action(); checks.push([true, label, '']) }
  catch (error) { checks.push([false, label, error.message]) }
}

check('默认路由进入学习地图，十二个节点都有稳定深链', () => {
  assert.ok(urlState.includes("DEFAULT_ROUTE: AppRoute = { view: 'learn'"))
  assert.ok(urlState.includes("if (view === 'learn')"))
  assert.equal(nodes.nodes.length, 12)
  assert.deepEqual(nodes.nodes.map(node => node.id), Array.from({ length: 12 }, (_, index) => `node-${String(index + 1).padStart(2, '0')}`))
})

check('学习界面通过懒加载进入独立包', () => {
  assert.ok(app.includes("const LearningNodesRoute = lazy(() => import('./learning-nodes-route')"))
  assert.equal(app.includes("from './learning-node-catalog'"), false)
  assert.ok(route.includes('<LearningNodeMap'))
  assert.ok(route.includes('<LearningNodePage'))
})

check('三种做法共用同一节点顺序', () => {
  assert.deepEqual(nodes.modes.map(mode => mode.id), ['guided', 'independent', 'project'])
  assert.ok(map.includes('learningModes.map'))
  assert.ok(page.includes('learningModes.map'))
  assert.equal(nodes.nodes.every(node => node.guidedHint && node.projectHint), true)
})

check('每个节点只显示一种思维、轻量工具、动作与结果', () => {
  for (const token of ['node.thought', 'node.action', 'node.toolTitle', 'node.toolPrompt', 'node.output', 'node.doneWhen', 'node.limit']) assert.ok(page.includes(token), token)
  assert.ok(page.includes('<textarea'))
  assert.ok(page.includes('需要更多字段？打开'))
})

check('进度只保存当前节点、完成状态、草稿和呈现方式', () => {
  assert.ok(progress.includes('tabletop-workshop-learning-node-progress-v1'))
  for (const token of ['mode:', 'currentNodeId:', 'completedNodeIds:', 'drafts:']) assert.ok(progress.includes(token), token)
  for (const forbidden of ['score:', 'ability:', 'level:', 'rating:']) assert.equal(progress.includes(forbidden), false, forbidden)
})

check('案例、支线、资料、长文和概念都按需打开', () => {
  for (const callback of ['onOpenContent', 'onOpenBranch', 'onOpenResourceEntry', 'onOpenConcept', 'onOpenTool']) assert.ok(page.includes(callback), callback)
  assert.ok(page.includes('<details className="learning-node-deeper">'))
})

check('手机布局不依赖横向滚动', () => {
  assert.ok(styles.includes('@media (max-width: 700px)'))
  assert.ok(styles.includes('.learning-node-support__links,'))
  assert.ok(styles.includes('grid-template-columns: 1fr;'))
  assert.equal(styles.includes('overflow-x: scroll'), false)
})

for (const [passed, label, detail] of checks) console.log(`${passed ? 'PASS' : 'FAIL'}  ${label}${detail ? `: ${detail}` : ''}`)
const failures = checks.filter(([passed]) => !passed)
console.log(`\n${checks.length - failures.length}/${checks.length} learning node UI checks passed.`)
if (failures.length) process.exit(1)
