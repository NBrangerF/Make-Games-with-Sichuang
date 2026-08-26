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
const home = read('src/learning-home.tsx')
const materials = read('src/design-materials-library.tsx')
const firstTabletop = read('src/first-tabletop-challenge.tsx')
const urlState = read('src/url-state.ts')
const styles = read('src/styles-learning-nodes.css')

const checks = []
const check = (label, action) => {
  try { action(); checks.push([true, label, '']) }
  catch (error) { checks.push([false, label, error.message]) }
}

check('默认路由进入四状态学习首页，节点与新活动都有稳定深链', () => {
  assert.ok(urlState.includes("DEFAULT_ROUTE: AppRoute = { view: 'learn'"))
  assert.ok(urlState.includes("if (view === 'learn')"))
  for (const id of ['first-tabletop', 'workshop', 'observe', 'iteration', 'mechanics', 'themes']) assert.ok(urlState.includes(`'${id}'`), id)
  assert.equal(nodes.nodes.length, 12)
  assert.deepEqual(nodes.nodes.map(node => node.id), Array.from({ length: 12 }, (_, index) => `node-${String(index + 1).padStart(2, '0')}`))
  for (const id of ['first-tabletop', 'workshop', 'iteration']) assert.ok(home.includes(`id: '${id}'`), id)
  assert.ok(home.includes('onOpenProblems'))
})

check('学习界面及较重材料页通过分层懒加载进入独立包', () => {
  assert.ok(app.includes("const LearningNodesRoute = lazy(() => import('./learning-nodes-route')"))
  assert.equal(app.includes("from './learning-node-catalog'"), false)
  assert.ok(route.includes('<LearningNodeMap'))
  assert.ok(route.includes('<LearningNodePage'))
  assert.ok(route.includes("lazy(() => import('./design-materials-library')"))
  assert.ok(route.includes("lazy(() => import('./first-tabletop-challenge')"))
})

check('三种活动语境提供案例、受限挑战和真实项目输入', () => {
  assert.deepEqual(nodes.modes.map(mode => mode.id), ['guided', 'independent', 'project'])
  assert.ok(map.includes('learningModes.map'))
  assert.ok(page.includes('learningModes.map'))
  assert.equal(nodes.nodes.every(node => node.guidedHint && node.challengeHint && node.projectHint), true)
  assert.ok(page.includes('node.challengeHint'))
})

check('每个节点只显示一种思维、轻量工具、动作与结果', () => {
  for (const token of ['node.thought', 'node.action', 'node.toolTitle', 'node.toolPrompt', 'node.output', 'node.doneWhen', 'node.limit']) assert.ok(page.includes(token), token)
  assert.ok(page.includes('<textarea'))
  assert.ok(page.includes('需要更多字段？打开'))
})

check('进度保存真实行动状态，旧完成记录只迁为已起草', () => {
  assert.ok(progress.includes('tabletop-workshop-learning-node-progress-v2'))
  assert.ok(progress.includes('tabletop-workshop-learning-node-progress-v1'))
  for (const token of ['mode:', 'currentNodeId:', 'nodeStates:', 'drafts:']) assert.ok(progress.includes(token), token)
  assert.ok(progress.includes("[nodeId, 'drafted' as const]"))
  for (const state of ['drafted', 'tabletop', 'tested', 'revised']) assert.ok(page.includes(state), state)
  for (const forbidden of ['score:', 'ability:', 'level:', 'rating:']) assert.equal(progress.includes(forbidden), false, forbidden)
})

check('mechanic/theme 材料支持搜索、筛选、展开练习并进入第一次落桌', () => {
  assert.ok(materials.includes('useDeferredValue'))
  assert.ok(materials.includes('type="search"'))
  assert.ok(materials.includes('<details>'))
  assert.ok(materials.includes('seedFirstTabletopMaterial'))
  assert.ok(firstTabletop.includes('no_best_mechanic_claim: true'))
  assert.ok(firstTabletop.includes("actionState: 'not-started'"))
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
console.log(`\n${checks.length - failures.length}/${checks.length} learning entry and node UI checks passed.`)
if (failures.length) process.exit(1)
