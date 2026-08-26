import { readFile } from 'node:fs/promises'

const files = Object.fromEntries(await Promise.all([
  ['component', 'src/prototype-scope-cutter.tsx'],
  ['app', 'src/App.tsx'],
  ['data', 'src/data.ts'],
  ['styles', 'src/styles.css'],
  ['storage', 'src/storage-keys.ts'],
  ['guides', 'content/guides.json'],
  ['research', 'docs/research/PROTOTYPE_SCOPE_FIDELITY_01.md'],
].map(async ([key, path]) => [key, await readFile(path, 'utf8')])))

const guards = [
  ['工具 ID 已进入类型契约', files.data.includes("'prototype-scope'")],
  ['工具已进入导航', files.app.includes('>原型范围裁剪</button>')],
  ['工具已进入完整项目导出', files.app.includes("id: 'prototype_scope_records'")],
  ['核心指南提供直接入口', files.guides.includes('"toolIds": ["prototype-scope", "test-plan"]')],
  ['五步轨道存在', ['验证问题', '证据过滤', '保真度配置', '可玩切片', '开工门槛'].every(label => files.component.includes(label))],
  ['过滤维度最多选择两个', files.component.includes('draft.selectedFilters.length >= 2') && files.component.includes('这一轮最多选择两个主要过滤维度')],
  ['三种保真选择逐维受控', ['替代', '近似', '必须真实'].every(label => files.component.includes(`'${label}'`)) && ['material', 'resolution', 'scope'].every(id => files.component.includes(id))],
  ['代理运转与玩家决定分开', files.component.includes('proxyOperation') && files.component.includes('protectedDecisions')],
  ['可玩切片含重复和停止', files.component.includes('repetition') && files.component.includes('stopTrigger') && files.component.includes('outOfScope')],
  ['保存前检查五步关键字段', ['补齐验证问题', '请选择一至两个过滤维度', '都要写一句选择理由', '可玩切片还缺', '开工前请补齐'].every(text => files.component.includes(text))],
  ['草稿与快照写入版本化本地存储', files.storage.includes('tabletop-workshop-prototype-scope-v1') && files.component.includes('schemaVersion: 1, draft, records')],
  ['导出声明本地优先', files.component.includes("method: 'prototype-scope-cutter'") && files.component.includes('local_first: true')],
  ['导出拒绝保真总分与最少内容推荐', files.component.includes('no_fidelity_score: true') && files.component.includes('no_minimum_content_recommendation: true')],
  ['清空草稿需要二次动作且保留快照', files.component.includes('确认清空草稿') && files.component.includes('已保存快照仍在当前浏览器')],
  ['移动端使用单栏并保留步骤横向滚动', files.styles.includes('.scope-layout { grid-template-columns: 1fr; }') && files.styles.includes('.scope-steps { display: flex; min-width: 0; overflow-x: auto; }')],
  ['新工具按打开意图加载', files.app.includes("lazy(() => import('./prototype-scope-cutter')") && files.app.includes('<PrototypeScopeCutter onContinue={onOpenTest} />')],
  ['完整范围可继续到测试计划', files.component.includes('validateScopeDraft') && files.component.includes('继续到测试计划') && files.component.includes('onContinue?.()')],
  ['研究边界拒绝固定阈值', files.research.includes('不提供最佳组件数、回合数、制作时长') && files.research.includes('不能证明它能提高所有设计的质量')],
]

const failed = guards.filter(([, passed]) => !passed)
for (const [label, passed] of guards) console.log(`${passed ? 'PASS' : 'FAIL'} ${label}`)
console.log(`\n${guards.length - failed.length}/${guards.length} guards passed`)
if (failed.length) process.exitCode = 1
