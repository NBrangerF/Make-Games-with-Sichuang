import { readFile } from 'node:fs/promises'

const files = Object.fromEntries(await Promise.all([
  ['component', 'src/single-question-test-plan.tsx'],
  ['prototype', 'src/prototype-scope-cutter.tsx'],
  ['app', 'src/App.tsx'],
  ['styles', 'src/styles.css'],
  ['storage', 'src/storage-keys.ts'],
  ['guides', 'content/guides.json'],
  ['research', 'docs/research/SINGLE_QUESTION_PLAYTEST_RESEARCH_01.md'],
  ['audit', 'docs/research/BEGINNER_PLAYTEST_HANDOFF_AUDIT_01.md'],
  ['product', 'docs/product/SINGLE_QUESTION_TEST_PLAN.md'],
  ['usability', 'docs/product/USABILITY_TEST_SINGLE_QUESTION_PLAN.md'],
].map(async ([key, path]) => [key, await readFile(path, 'utf8')])))

const guards = [
  ['测试计划按打开意图加载', files.app.includes("lazy(() => import('./single-question-test-plan')")],
  ['旧测试抽屉实现已移除', !files.app.includes('function TestDrawer')],
  ['四步轨道存在且只有四步定义', ['承接范围', '观察协议', '参与与主持', '结束与追问'].every(label => files.component.includes(`label: '${label}'`)) && (files.component.match(/id: '(scope|observation|participants|finish)', number: '/g) || []).length === 4],
  ['唯一主问题与停车区分开', files.component.includes('primaryQuestion') && files.component.includes('parkingLot') && files.component.includes('本轮唯一主问题')],
  ['预测和反驳都是保存门', files.component.includes('predictedBehavior') && files.component.includes('disconfirmingSignal') && files.component.includes('唯一主问题、行为预测和反驳信号')],
  ['观察事件与局后追问分轨', files.component.includes('observationEvent') && files.component.includes('postQuestions') && files.component.includes('先写局中要看见什么')],
  ['重复、起止和版本单改动齐全', ['repetitionTarget', 'startState', 'stopTrigger', 'invariant', 'changedAxis'].every(field => files.component.includes(field))],
  ['参与者、配置、类型和媒介齐全', ['participantProfile', 'playerConfiguration', 'testType', 'medium'].every(field => files.component.includes(field))],
  ['主持允许与禁止边界分开', files.component.includes('facilitatorAllowed') && files.component.includes('facilitatorForbidden')],
  ['记录同意与安全停止必填', files.component.includes('captureAndConsent') && files.component.includes('safetyStop') && files.component.includes('记录同意和主动停止条件')],
  ['支持反驳未定进入结论规则', files.component.includes('decisionRule') && files.component.includes('支持、反驳或未定证据')],
  ['原型来源需显式导入', files.component.includes('导入最近原型范围') && files.component.includes('no_silent_scope_inference: true')],
  ['来源保存 ID 时间和摘要', ['sourceScopeId', 'sourceScopeCreatedAt', 'sourceScopeSummary'].every(field => files.component.includes(field))],
  ['导入不推断参与主持记录结论', files.component.includes('参与者、主持、记录与结论规则仍需你决定')],
  ['原型范围提供完整校验后继续', files.prototype.includes('validateScopeDraft') && files.prototype.includes('继续到测试计划') && files.prototype.includes('onContinue?.()')],
  ['草稿与历史使用版本化键', files.storage.includes('tabletop-workshop-single-question-test-plan-draft-v1') && files.storage.includes('tabletop-workshop-project-v1')],
  ['完整项目仍收集 test_plans', files.app.includes("id: 'test_plans'") && files.component.includes('TEST_PLAN_STORAGE_KEY')],
  ['导出协议为单问题计划 v2', files.component.includes('schema_version: 2') && files.component.includes("method: 'single-question-playtest-plan'")],
  ['导出拒绝四种过度结论', ['no_fun_score: true', 'no_sample_representativeness_claim: true', 'no_causal_proof: true', 'no_release_readiness_claim: true'].every(flag => files.component.includes(flag))],
  ['证据边界限定版本配置参与媒介主持', ['版本', '玩家配置', '参与者语境', '媒介', '主持条件'].every(text => files.component.includes(text))],
  ['清空需要二次动作且保留历史', files.component.includes('确认清空草稿') && files.component.includes('已保存的计划仍在当前浏览器')],
  ['抽屉支持 Escape 并恢复打开者焦点', files.component.includes("event.key === 'Escape'") && files.component.includes('previouslyFocused?.focus()')],
  ['桌面抽屉具有纸张与证据链层级', files.styles.includes('.single-question-plan::before') && files.styles.includes('.plan-evidence') && files.styles.includes('width: min(650px, 100%)')],
  ['移动端全宽单栏且步骤局部滚动', files.styles.includes('.single-question-plan { padding: 25px 18px 24px 42px; width: 100%; }') && files.styles.includes('.plan-steps { display: flex; overflow-x: auto; }') && files.styles.includes('.plan-pair { grid-template-columns: 1fr; }')],
  ['最小原型和测试指南连接新证据', files.guides.includes('claim-test-plan-needs-one-evidence-chain') && files.guides.includes('claim-moderator-help-changes-playtest-evidence')],
  ['研究明确局中与局后不同证据', files.research.includes('局中观察和局后追问是不同证据')],
  ['研究拒绝样本量和通过分', files.research.includes('不提供通用样本量、通过分、乐趣分或发行门槛')],
  ['审计记录旧抽屉断点', files.audit.includes('旧测试抽屉只有项目版本、测试类型、媒介和最多三个自由问题')],
  ['产品规格和形成性协议均存在', files.product.includes('schema_version: 2') && files.usability.includes('T5 从证据到下一步')],
]

const failed = guards.filter(([, passed]) => !passed)
for (const [label, passed] of guards) console.log(`${passed ? 'PASS' : 'FAIL'} ${label}`)
console.log(`\n${guards.length - failed.length}/${guards.length} guards passed`)
if (failed.length) process.exitCode = 1
