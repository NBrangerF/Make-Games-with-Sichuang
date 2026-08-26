import { createHash } from 'node:crypto'
import { readFile } from 'node:fs/promises'

const paths = {
  component: 'src/evidence-review-workbench.tsx', session: 'src/playtest-session-recorder.tsx', app: 'src/App.tsx', storage: 'src/storage-keys.ts', styles: 'src/styles.css', guides: 'content/guides.json', claims: 'content/claims.json', entries: 'content/resource-entry-points.json', resources: 'content/resources.json', research: 'docs/research/PLAYTEST_EVIDENCE_SYNTHESIS_RESEARCH_01.md', audit: 'docs/research/BEGINNER_EVIDENCE_REVIEW_HANDOFF_AUDIT_01.md', product: 'docs/product/EVIDENCE_REVIEW_CHANGE_BRIEF.md', usability: 'docs/product/USABILITY_TEST_EVIDENCE_REVIEW.md', desktopConcept: 'design/concepts/evidence-review-workbench-desktop.png', decisionConcept: 'design/concepts/evidence-review-workbench-decision.png',
}
const buffers = Object.fromEntries(await Promise.all(Object.entries(paths).map(async ([key, path]) => [key, await readFile(path)])))
const files = Object.fromEntries(Object.entries(buffers).map(([key, value]) => [key, value.toString('utf8')]))
const sha = key => createHash('sha256').update(buffers[key]).digest('hex')

const guards = [
  ['反馈工具按打开意图延迟加载新工作台', files.app.includes("lazy(() => import('./evidence-review-workbench')") && files.app.includes('EvidenceReviewWorkbench')],
  ['旧 FeedbackSorter 已移除', !files.app.includes('function FeedbackSorter') && !files.app.includes('保存这条证据')],
  ['反馈工具 ID 保持兼容并更名', files.app.includes("tool === 'feedback'") && files.app.includes('>证据复盘</button>')],
  ['存储键仍兼容旧版地址', files.storage.includes("tabletop-workshop-feedback-v1")],
  ['v2 存储包含草稿与历史', files.component.includes('schemaVersion: 2, draft, records')],
  ['v1 数组执行保守迁移', files.component.includes('Array.isArray(stored)') && files.component.includes('migrateLegacy') && files.component.includes('schemaMigratedFrom: 1')],
  ['迁移不伪造来源版本和条件', files.component.includes('旧版未记录适用条件') && files.component.includes('缺少来源会话、版本、玩家语境与事件状态')],
  ['只读取 completed 会话', files.component.includes("record.state === 'completed'")],
  ['来源 ID 完成时间与计划 ID 齐全', ['sourceSessionId', 'sourceSessionCompletedAt', 'sourcePlanId'].every(field => files.component.includes(field))],
  ['来源项目版本问题语境齐全', ['projectName', 'sourceVersion', 'sourceQuestion', 'sourceContext'].every(field => files.component.includes(field))],
  ['证据池同时含局中事件与局后回答', files.component.includes("kind: '局中事件'") && files.component.includes("kind: '局后回答'")],
  ['导入明确不自动选择或下结论', files.component.includes('尚未自动选择、分组或下结论')],
  ['四步轨道完整', ['承接会话', '选择证据', '形成发现', '版本决定'].every(label => files.component.includes(`label: '${label}'`))],
  ['选择保留原证据引用', files.component.includes('selectedEvidenceIds') && files.component.includes('event:${event.id}')],
  ['关系计数四态齐全', ['支持', '反驳', '未定', '语境'].every(value => files.component.includes(value))],
  ['计数不生成严重度', files.component.includes('数量只用于回到原记录') && files.component.includes('事件数量不是严重度')],
  ['发现包含陈述和适用条件', files.component.includes('findingStatement') && files.component.includes('appliesWhen')],
  ['发现包含反证和缺失证据', files.component.includes('counterEvidence') && files.component.includes('missingEvidence')],
  ['形成发现前至少选择一条证据', files.component.includes('请至少选择一条原始证据')],
  ['版本决定五态齐全', ['保护', '修改', '继续调查', '暂存', '不改'].every(value => files.component.includes(value))],
  ['修改要求至少两个候选方案', files.component.includes("draft.candidateSolutions.split('\\n')") && files.component.includes('至少写两个候选方案')],
  ['保持项变化轴具体改动齐全', ['keepSame', 'changedAxis', 'concreteChange'].every(field => files.component.includes(field))],
  ['拒绝方案回退信号下一问题齐全', ['rejectedOption', 'rollbackSignal', 'nextQuestion'].every(field => files.component.includes(field))],
  ['保存仍声明改动需要复测', files.component.includes('改动仍需下一场测试验证')],
  ['导出方法与 schema 正确', files.component.includes("method: 'evidence-review-and-change-brief'") && files.component.includes('schema_version: 2')],
  ['导出拒绝自动洞察和严重度', files.component.includes('no_automatic_insight: true') && files.component.includes('no_automatic_severity: true')],
  ['导出拒绝频次优先和建议自动方案', files.component.includes('no_frequency_priority: true') && files.component.includes('no_solution_from_suggestion: true')],
  ['导出拒绝因果和静默写回', files.component.includes('no_causal_proof: true') && files.component.includes('no_silent_project_mutation: true')],
  ['项目下一步必须显式复制', files.component.includes('复制为项目下一步') && files.component.includes('onCopyProjectNextAction(action)')],
  ['复制前必须完成保存', files.component.includes('先保存完整变更简报')],
  ['现场会话完成后交给证据复盘', files.session.includes('交给证据复盘 →') && files.app.includes("onReview={() => onTool('feedback')}")],
  ['撤回会话级联本地派生复盘', files.session.includes('FEEDBACK_REVIEW_STORAGE_KEY') && files.session.includes('record.sourceSessionId !== draft.id')],
  ['撤回明确外部副本边界', files.session.includes('外部录音、照片或副本仍需在各自位置删除')],
  ['项目完整包读取 records 且保留旧数组', files.app.includes("collection: 'records'") && files.app.includes('if (Array.isArray(stored)) return stored')],
  ['新建草稿二次确认且保留历史', files.component.includes('确认新建复盘草稿') && files.component.includes('历史记录仍在当前浏览器')],
  ['桌面三栏结构存在', files.styles.includes('.review-grid') && files.styles.includes('grid-template-columns: minmax(235px, .7fr) minmax(520px, 1.8fr) minmax(300px, .9fr)')],
  ['窄桌面检查器改全宽', files.styles.includes('grid-column: 1 / -1') && files.styles.includes('.review-inspector form { grid-template-columns: 1fr 1fr; }')],
  ['移动端单栏且步骤可滚动', files.styles.includes('.review-grid { grid-template-columns: 1fr; }') && files.styles.includes('.review-steps { display: flex; overflow-x: auto; }')],
  ['研究明确观察发现行动分层', files.research.includes('四层资料必须分开') && files.research.includes('计数只用于回到证据')],
  ['研究记录检索与工具限制', files.research.includes('15 个以上组合') && files.research.includes('Firecrawl 与 Exa')],
  ['审计覆盖六个新手断点', (files.audit.match(/^\| .* \|/gm) || []).length >= 7],
  ['产品契约登记迁移与不变量', files.product.includes('schemaMigratedFrom: 1') && files.product.includes('不变量')],
  ['可用性脚本覆盖错误门和移动端', files.usability.includes('先只写一个候选方案') && files.usability.includes('390×844')],
  ['指南连接新资源与五条主张', files.guides.includes('games-user-research-analysis') && files.guides.includes('claim-solution-choice-needs-alternatives-and-retest')],
  ['资源入口存在且拒绝自动优先级', files.entries.includes('evidence-review-change-brief') && files.entries.includes('频次优先级')],
  ['七项新资源均已登记', ['games-user-research-analysis', 'woodard-effective-playtest', 'govuk-analyse-research-session', 'govuk-rainbow-spreadsheet', 'ixdf-affinity-diagram', 'boardssey-review-results', 'measuringu-severity-ratings'].every(id => files.resources.includes(`\"id\": \"${id}\"`))],
  ['两张概念图哈希与产品契约一致', sha('desktopConcept') === '082959cfcf76730c7f25614e6047a1b6f0015a0eb0c57af2578078d5cf8afa28' && sha('decisionConcept') === '44c2fcc5b0a09abfef961db7923bd8ba2d7f8edf3c6a85e980add2f140e799e1' && files.product.includes(sha('desktopConcept')) && files.product.includes(sha('decisionConcept'))],
  ['五条综合主张均已登记', ['claim-review-keeps-observation-finding-action-distinct', 'claim-findings-need-source-evidence-and-boundaries', 'claim-note-volume-is-not-priority', 'claim-solution-choice-needs-alternatives-and-retest', 'claim-withdrawal-must-reach-derived-review'].every(id => files.claims.includes(id))],
]

const failed = guards.filter(([, passed]) => !passed)
for (const [label, passed] of guards) console.log(`${passed ? 'PASS' : 'FAIL'} ${label}`)
console.log(`\n${guards.length - failed.length}/${guards.length} guards passed`)
if (failed.length) process.exitCode = 1
