import fs from 'node:fs'

const read = path => fs.readFileSync(new URL(path, import.meta.url), 'utf8')
const learningRecord = JSON.parse(read('../content/resource-learning-paths.json'))
const entryRecord = JSON.parse(read('../content/resource-entry-points.json'))
const resources = JSON.parse(read('../content/resources.json'))
const discovery = read('../src/resource-discovery-catalog.ts')
const app = read('../src/App.tsx')
const view = read('../src/resource-learning-path-view.tsx')
const styles = read('../src/styles.css')
const packageJson = JSON.parse(read('../package.json'))

const paths = learningRecord.paths ?? []
const expectedEntries = [
  'choose-learning-spine',
  'core-loop-handoff',
  'first-prototype',
  'first-playtest',
  'rules-and-teaching',
  'production-and-publishing',
]
const entryById = new Map(entryRecord.entryPoints.map(entry => [entry.id, entry]))
const resourceIds = new Set(resources.map(resource => resource.id))
const visibleCopy = paths.flatMap(path => [path.title, path.intro, ...path.steps.flatMap(step => [step.guideTitle, step.purpose, step.focus, step.action])]).join('\n')

const checks = [
  [learningRecord.schemaVersion === 1, '最短学习路线有显式 schema 版本'],
  [paths.length === expectedEntries.length, '六个设计阶段各有一条最短路线'],
  [expectedEntries.every(entryId => paths.some(path => path.entryId === entryId)), '六个阶段首要入口全部覆盖'],
  [new Set(paths.map(path => path.entryId)).size === paths.length, '每个入口只定义一条路线'],
  [paths.every(path => typeof path.title === 'string' && path.title.trim() && typeof path.intro === 'string' && path.intro.trim()), '每条路线有中文标题与说明'],
  [paths.every(path => path.steps.length === 3), '每条路线严格限制为三份起步资料'],
  [paths.every(path => new Set(path.steps.map(step => step.resourceId)).size === path.steps.length), '同一路线不重复资源'],
  [paths.every(path => path.steps.every(step => resourceIds.has(step.resourceId))), '路线中的资源全部存在'],
  [paths.every(path => path.steps.every(step => entryById.get(path.entryId)?.resourceIds.includes(step.resourceId))), '路线资源属于对应权威入口'],
  [paths.every(path => path.steps.every(step => ['guideTitle', 'purpose', 'focus', 'action'].every(field => typeof step[field] === 'string' && step[field].trim()))), '每份起步资料都有标题、用途、重点与动作'],
  [!/—|–/.test(visibleCopy), '新增页面文案不使用长破折号'],
  [discovery.includes("import resourceLearningPathRecord from '../content/resource-learning-paths.json'"), '学习路线随轻量资源发现目录加载'],
  [app.includes("import('./resource-learning-path-view')") && view.includes('className="resource-learning-path"'), '最短路线只在资源入口按需加载'],
  [view.includes('<b>阅读时看</b>') && view.includes('<b>读完就做</b>'), '资源入口呈现顺序、阅读重点与行动'],
  [app.includes('learningStep?.guideTitle') && app.includes('learningStep?.action'), '列表和站内导读复用权威中文学习卡'],
  [styles.includes('.resource-learning-detail') && styles.includes('@media (max-width: 720px)'), '学习路线有明确窄屏布局'],
  [packageJson.scripts['qa:resource-learning-paths'] === 'node scripts/check-resource-learning-paths.mjs', '独立最短学习路线守卫命令'],
  [packageJson.scripts['content:check'].includes('qa:resource-learning-paths'), '最短学习路线守卫进入完整内容门'],
]

const failures = checks.filter(([passed]) => !passed)
for (const [passed, label] of checks) console.log(`${passed ? '✓' : '✗'} ${label}`)
if (failures.length) {
  console.error(`\n资源最短学习路线守卫失败：${failures.length}/${checks.length}`)
  process.exit(1)
}
console.log(`\n资源最短学习路线守卫通过：${checks.length}/${checks.length}`)
