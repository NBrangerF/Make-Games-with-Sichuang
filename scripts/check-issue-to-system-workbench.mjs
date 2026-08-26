import { readFile } from 'node:fs/promises'

const files = Object.fromEntries(await Promise.all([
  ['component', 'src/issue-to-system-workbench.tsx'],
  ['app', 'src/App.tsx'],
  ['toolCatalog', 'src/tool-catalog.ts'],
  ['data', 'src/data.ts'],
  ['styles', 'src/styles.css'],
  ['visualStyles', 'src/styles-v4.css'],
  ['storage', 'src/storage-keys.ts'],
  ['guides', 'content/special-guides.json'],
  ['research', 'docs/research/ISSUE_TO_SYSTEM_TRANSLATION_01.md'],
  ['contract', 'docs/guides/ISSUE_TO_SYSTEM_TRANSLATION_CONTRACT.md'],
].map(async ([key, path]) => [key, await readFile(path, 'utf8')])))

const guards = [
  ['工具 ID 已进入类型契约', files.data.includes("'issue-to-system'")],
  ['工具有稳定名称与深链分派', files.toolCatalog.includes("'issue-to-system': '议题到系统工作台'") && files.app.includes("tool === 'issue-to-system'")],
  ['工具已进入完整项目导出', files.app.includes("id: 'issue_to_system_records'")],
  ['专题指南提供第一顺位入口', files.guides.includes('"toolIds": ["issue-to-system", "theme-review"')],
  ['五步轨道存在', ['系统主张', '六字段翻译', '遗漏账本', '重复决策', '三层验证'].every(label => files.component.includes(label))],
  ['位置与修改权不是可选装饰', ['designerPosition', 'affectedStakeholders', 'reviewAndChangeRights'].every(field => files.component.includes(field))],
  ['六个系统字段逐项保存', ['actors', 'permissions', 'resources', 'constraints', 'feedback', 'timescale'].every(field => files.component.includes(`id: '${field}'`))],
  ['遗漏含删除、理由、误读与责任', ['omitted', 'reason', 'misreadingRisk', 'reviewOwner'].every(field => files.component.includes(field)) && files.component.includes('增加一项遗漏')],
  ['行动反馈链与更名检查分开', ['repeatedSituation', 'playerChoice', 'systemResponse', 'feedbackVisibility', 'renameCheck', 'detachedContent'].every(field => files.component.includes(field))],
  ['三层证据互不替代', ['systemEvidence', 'playerInterpretation', 'stakeholderReview'].every(field => files.component.includes(field)) && files.component.includes('任何一层都不能替另一层背书')],
  ['保存前检查五步关键字段', ['保存前请补齐议题', '角色、权限、资源、约束、反馈和时间尺度', '每项遗漏都要写', '重复决策还缺', '三层验证、复盘边界'].every(text => files.component.includes(text))],
  ['草稿与记录写入版本化本地存储', files.storage.includes('tabletop-workshop-issue-to-system-v1') && files.component.includes('schemaVersion: 1, draft, records')],
  ['导出声明本地优先', files.component.includes("method: 'issue-to-system-workbench'") && files.component.includes('local_first: true')],
  ['导出拒绝影响分、学习结论与代表性认证', files.component.includes('no_social_impact_score: true') && files.component.includes('no_learning_outcome_claim: true') && files.component.includes('no_representativeness_certification: true')],
  ['清空草稿需要二次动作且保留记录', files.component.includes('确认清空草稿') && files.component.includes('已保存记录仍在当前浏览器')],
  ['移动端使用单栏且步骤不依赖横向滚动', files.styles.includes('.issue-system-layout { grid-template-columns: 1fr; }') && files.visualStyles.includes('.issue-system-steps,') && files.visualStyles.includes('overflow: visible;') && files.visualStyles.includes('grid-template-columns: 1fr;')],
  ['新工具按打开意图加载', files.app.includes("lazy(() => import('./issue-to-system-workbench')") && files.app.includes('<IssueToSystemWorkbench />')],
  ['研究与契约拒绝自动社会效果', files.research.includes('不能证明学习、态度或行为改变') && files.contract.includes('不生成社会影响分数')],
]

const failed = guards.filter(([, passed]) => !passed)
for (const [label, passed] of guards) console.log(`${passed ? 'PASS' : 'FAIL'} ${label}`)
console.log(`\n${guards.length - failed.length}/${guards.length} guards passed`)
if (failed.length) process.exitCode = 1
