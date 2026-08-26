import { readFile } from 'node:fs/promises'

const files = Object.fromEntries(await Promise.all([
  ['component', 'src/version-governance-workbench.tsx'],
  ['app', 'src/App.tsx'],
  ['data', 'src/data.ts'],
  ['styles', 'src/styles.css'],
  ['storage', 'src/storage-keys.ts'],
  ['guides', 'content/special-guides.json'],
].map(async ([key, path]) => [key, await readFile(path, 'utf8')])))

const guards = [
  ['工具 ID 已进入类型契约', files.data.includes("'version-governance'")],
  ['工具已进入导航', files.app.includes('>内容版本治理</button>')],
  ['工具已进入完整项目导出', files.app.includes("id: 'version_governance_records'")],
  ['专题指南提供直接入口', files.guides.includes('"toolIds": ["version-governance", "decision-trace"')],
  ['五步轨道存在', ['内容护照', '兼容矩阵', '当前事实源', '治理时间线', '回归与迁移'].every(label => files.component.includes(label))],
  ['兼容证据状态受控', ['已验证', '声明支持', '未知', '需替换'].every(label => files.component.includes(`<option>${label}</option>`))],
  ['兼容配置可增删', files.component.includes('＋ 添加配置') && files.component.includes('删除配置')],
  ['事实源可增删并区分地位', files.component.includes('＋ 添加事实源') && ['当前', '补充', '历史'].every(label => files.component.includes(`<option>${label}</option>`))],
  ['公告生效复查日期分开', ['公告日', '生效日', '复查日'].every(label => files.component.includes(label))],
  ['草稿与记录写入版本化本地存储', files.storage.includes("tabletop-workshop-version-governance-v1") && files.component.includes('schemaVersion: 1, draft, records')],
  ['保存前检查身份与证据边界', files.component.includes('保存前请补齐游戏名称') && files.component.includes('补齐断点、下一次验证和证据边界')],
  ['导出声明本地优先', files.component.includes("method: 'content-version-governance-workbench'") && files.component.includes('local_first: true')],
  ['导出拒绝兼容认证与稀有度推荐', files.component.includes('no_compatibility_certification: true') && files.component.includes('no_rarity_recommendation: true')],
  ['清空草稿需要二次动作且保留记录', files.component.includes('确认清空草稿') && files.component.includes('已保存记录仍在当前浏览器')],
  ['移动端使用单栏并保留步骤横向滚动', files.styles.includes('.governance-layout { grid-template-columns: 1fr; }') && files.styles.includes('.governance-steps { display: flex; min-width: 0; overflow-x: auto; }')],
  ['新工具按打开意图加载', files.app.includes("lazy(() => import('./version-governance-workbench')") && files.app.includes('<Suspense fallback=')],
]

const failed = guards.filter(([, passed]) => !passed)
for (const [label, passed] of guards) console.log(`${passed ? 'PASS' : 'FAIL'} ${label}`)
console.log(`\n${guards.length - failed.length}/${guards.length} guards passed`)
if (failed.length) process.exitCode = 1
