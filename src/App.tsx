import { ReadingLoadBoundary } from './reading-load-boundary'
import { ActiveNavigationMark, LanguageSwitch, navigationIcons } from './studio-controls'
import { readLanguagePreference, saveLanguagePreference, switchRouteLanguage } from './interface-language'
import './original-reading.css'
import { FormEvent, lazy, Suspense, type ReactNode, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { designConstraints, glossaryIndex, guides, resourceIndex, stages, stuckPoints, type ConceptActionIndex, type DesignToolId, type Framework, type GlossaryTerm, type Guide, type GuideToolId, type ResourceAudiencePath, type ResourceCatalog, type ResourceDiscoveryCatalog, type ResourceEntryCatalog, type ResourceEntryPoint, type ResourceEntryReference, type ResourceLearningPath, type ResourceLearningStep, type ResourceStageGroup, type Stage } from './data'
import { loadFrameworks, loadGlossary, loadSpecialGuides, preloadFrameworks, preloadGlossary, preloadSpecialGuides } from './method-loader'
import { loadInitialResourceDiscovery, loadResourceEntryCatalog, preloadResourceEntryCatalog } from './resource-entry-loader'
import { loadResourceCatalog } from './resource-loader'
import { CORE_LOOP_STORAGE_KEY, EVIDENCE_SYNTHESIS_STORAGE_KEY, EXPERIENCE_INTENT_STORAGE_KEY, FEEDBACK_REVIEW_STORAGE_KEY, ISSUE_TO_SYSTEM_STORAGE_KEY, PLAYTEST_SESSION_STORAGE_KEY, PRODUCTION_LEDGER_STORAGE_KEY, PROTOTYPE_SCOPE_STORAGE_KEY, TEST_PLAN_STORAGE_KEY, VERSION_GOVERNANCE_STORAGE_KEY } from './storage-keys'
import { parseRouteHash, routeTitle, serializeRoute, type AppRoute, type MethodSection, type PrimaryView } from './url-state'
import { deploymentInfo, isPublicTrialConfigured, LOCAL_STORAGE_PREFIX } from './deployment'
import { guideResourceEntryByStage } from './guide-resource-handoff'
import { ResourceAnalysisStart, ResourceLearningStart, type AnalysisQuestionId, type LearningStartEntryId } from './resource-start-v2'
import { isLearningContentId } from './learning-content-route'
import { isResourceProblemStageId, ResourceProblemsStart } from './resource-problems-v2'
import { ContextualToolLinks, resourceEntryToolLinks } from './contextual-tools'
import { toolActionLabels, toolTitles } from './tool-catalog'
import { loadProductionLedgerTool } from './tool-loaders'
import { brandedDownloadName, PRODUCT_BRAND } from './brand'
import { contextReturnRoute } from './navigation/work-context'
import { attachResource } from './domain/commands-v3'
import type { TypedRef } from './domain/schema-v3'
import { useWorkspaceRuntime } from './workspace-runtime'

const VersionGovernanceWorkbench = lazy(() => import('./version-governance-workbench').then(module => ({ default: module.VersionGovernanceWorkbench })))
const PrototypeScopeCutter = lazy(() => import('./prototype-scope-cutter').then(module => ({ default: module.PrototypeScopeCutter })))
const IssueToSystemWorkbench = lazy(() => import('./issue-to-system-workbench').then(module => ({ default: module.IssueToSystemWorkbench })))
const ExperienceIntentCard = lazy(() => import('./experience-intent-card').then(module => ({ default: module.ExperienceIntentCard })))
const CoreLoopCanvas = lazy(() => import('./core-loop-canvas').then(module => ({ default: module.CoreLoopCanvas })))
const ResourceLearningPathView = lazy(() => import('./resource-learning-path-view').then(module => ({ default: module.ResourceLearningPathView })))
const loadResourceV2Details = () => import('./resource-v2-detail')
const ResourceLearningDetail = lazy(() => loadResourceV2Details().then(module => ({ default: module.ResourceLearningDetail })))
const ResourceAnalysisDetail = lazy(() => loadResourceV2Details().then(module => ({ default: module.ResourceAnalysisDetail })))
const ResourceAdvancedAnalysis = lazy(() => loadResourceV2Details().then(module => ({ default: module.ResourceAdvancedAnalysis })))
const CompleteLearningContentPage = lazy(() => import('./complete-translation-page').then(module => ({ default: module.CompleteLearningContentPage })))
const DesignLibrary = lazy(() => import('./design-library').then(module => ({ default: module.DesignLibrary })))
const DesignCases = lazy(() => import('./design-cases').then(module => ({ default: module.DesignCases })))
const TextLearning = lazy(() => import('./text-learning').then(module => ({ default: module.TextLearning })))
const OriginalReading = lazy(() => import('./original-reading').then(module => ({ default: module.OriginalReading })))
const SingleQuestionTestPlan = lazy(() => import('./single-question-test-plan').then(module => ({ default: module.SingleQuestionTestPlan })))
const PlaytestSessionRecorder = lazy(() => import('./playtest-session-recorder').then(module => ({ default: module.PlaytestSessionRecorder })))
const EvidenceReviewWorkbench = lazy(() => import('./evidence-review-workbench').then(module => ({ default: module.EvidenceReviewWorkbench })))
const EvidenceSynthesisWorkbench = lazy(() => import('./evidence-synthesis-workbench').then(module => ({ default: module.EvidenceSynthesisWorkbench })))
const ProductionLedgerTool = lazy(() => loadProductionLedgerTool().then(module => ({ default: module.ProductionLedgerTool })))
const LearningNodesRoute = lazy(() => import('./learning-nodes-route').then(module => ({ default: module.LearningNodesRoute })))
const WorkbenchV3 = lazy(() => import('./workbench/workbench-v3').then(module => ({ default: module.WorkbenchV3 })))
const CourseV3 = lazy(() => import('./course/course-v3').then(module => ({ default: module.CourseV3 })))

const learningStartEntryIds = new Set<LearningStartEntryId>(['systematic', 'designer-thinking', 'learn-by-playing', 'small-exercise'])
const analysisQuestionIds = new Set<AnalysisQuestionId>(['experience', 'decisions', 'interaction', 'state-and-feedback', 'learning-and-execution'])
const isLearningStartEntryId = (value?: string): value is LearningStartEntryId => Boolean(value && learningStartEntryIds.has(value as LearningStartEntryId))
const isAnalysisQuestionId = (value?: string): value is AnalysisQuestionId => Boolean(value && analysisQuestionIds.has(value as AnalysisQuestionId))

type RedesignAxis = '选择' | '移动' | '信息' | '资源' | '互动' | '主题' | '胜利条件'
type RedesignRecord = {
  id: string
  baseGame: string
  targetExperience: string
  axis: RedesignAxis
  invariant: string
  ruleChange: string
  prediction: string
  prototypeScope: string
  testQuestion: string
  createdAt: string
}
type ConstraintExperiment = {
  id: string
  observationId: string
  moveId: string
  boundaryId: string
  targetExperience: string
  currentRule: string
  ruleChange: string
  prediction: string
  testQuestion: string
  createdAt: string
}
type AccessibilityDimension = '视觉与色觉' | '操作与触达' | '认知与记忆' | '规则与语言' | '沟通与听觉' | '情绪与安全' | '社会与经济'
type ComponentFunction = '公共状态' | '私人状态' | '随机器' | '计数器' | '空间关系' | '规则查询' | '沟通流程' | '其他'
type AccessibilityObservation = {
  id: string
  version: string
  medium: '实体' | '线上' | '混合'
  task: string
  observedAction: string
  dimension: AccessibilityDimension
  componentFunction: ComponentFunction
  barrier: string
  playerStrategy: string
  assistance: string
  assistanceTradeoff: string
  playerVoice: string
  proposedExperiment: string
  successSignal: string
  createdAt: string
}
type BalanceConcern = '选项支配' | '先手/座位优势' | '领先滚雪球' | '追赶过强' | '随机结果主导' | '经济停滞/爆炸' | '时长/节奏' | '非对称差异'
type BalancePass = {
  id: string
  version: string
  concern: BalanceConcern
  targetExperience: string
  question: string
  systemRelation: string
  baseline: string
  modelBoundary: string
  evidencePlan: string
  testContext: string
  disconfirmingSignal: string
  nextChange: string
  createdAt: string
}
type LearningTaskType = '设置' | '第一次决定' | '完整回合' | '规则查询' | '反向教学' | '中断后恢复'
type LearningSurface = '口头讲解' | '规则书' | '玩家辅助' | '组件/桌面' | '交互教程' | '视频' | '混合'
type TeachingPath = {
  id: string
  version: string
  taskType: LearningTaskType
  learnerContext: string
  primarySurface: LearningSurface
  targetAction: string
  knowNow: string
  deferUntilLater: string
  deliveryPath: string
  practiceMoment: string
  recoveryPath: string
  successSignal: string
  firstDivergence: string
  lookupTrace: string
  facilitatorIntervention: string
  nextChange: string
  createdAt: string
}
type DecisionCollapseReason = '显然更差' | '后果相同' | '信息不清' | '不可支付/不可达' | '负担过重' | '被他人行动封锁' | '未进入考虑' | '其他'
type FeedbackVisibility = '立即可见' | '本轮稍后' | '跨轮延后' | '终局才见' | '始终不清楚'
type DecisionTrace = {
  id: string
  version: string
  playerContext: string
  moment: string
  currentGoal: string
  legalOptions: string
  consideredOptions: string
  collapseReason: DecisionCollapseReason
  informationState: string
  opportunityCost: string
  interactionPath: string
  prediction: string
  actualAction: string
  actualConsequence: string
  feedbackVisibility: FeedbackVisibility
  modelUpdate: string
  nextChange: string
  createdAt: string
}
type ParticipationAgreement = '各自决定，可给选项' | '先讨论后由行动者决定' | '共同共识' | '指定指挥/导师' | '允许自由代办' | '未事先确认' | '其他'
type ConsentSignal = '明确接受建议' | '主动请求指导' | '明确拒绝或修正' | '沉默，无法判断' | '事后表示不符合期待' | '未询问'
type SharedDecisionObservation = {
  id: string
  version: string
  playContext: string
  moment: string
  participationAgreement: ParticipationAgreement
  decisionOwner: string
  informationMap: string
  permissionMap: string
  proposalTrace: string
  responseTrace: string
  finalDecision: string
  executionOwner: string
  consequence: string
  consentSignal: ConsentSignal
  consentCheck: string
  accessCondition: string
  firstMismatch: string
  nextChange: string
  createdAt: string
}
type ThemeExposureMode = '阅读/观看' | '管理抽象资源' | '选择并执行' | '扮演/代入' | '对其他玩家施加' | '可能点名现实经历' | '其他'
type CollaborationStage = '不涉及具体在世社群' | '尚未建立协作' | '早期共同设计' | '开发中持续复核' | '仅末期审阅' | '其他'
type ThemeReview = {
  id: string
  version: string
  audienceContext: string
  themePromise: string
  playerPosition: string
  repeatedActions: string
  rewardsAndConsequences: string
  automatedOrAbsent: string
  sourcesAndUncertainty: string
  interpretationAndInvention: string
  representedPeople: string
  collaborationStage: CollaborationStage
  collaborationPlan: string
  exposureMode: ThemeExposureMode
  exposureContent: string
  contentNote: string
  choiceExitRepair: string
  firstMismatch: string
  nextAction: string
  createdAt: string
}
type DeliveryRoute = '投出版社' | '免费 PnP' | '小批/POD' | '自出版大货' | '众筹履约' | '其他'
type ProductionEvidenceState = '未知' | '设计者粗估' | '目录/计算器' | '供应商书面报价' | '样品/发票/实测'
type CostScope = '工厂生产范围' | '落地到仓范围' | '项目全成本范围' | '暂未确定'
type ValidationGate = '早期规格' | '文件/印前' | '组件/材料样' | '产前样 PPC' | '量产样 MPC' | '入库/抽检'
type ProductionComponent = {
  id: string
  name: string
  quantity: string
  specification: string
  playerFunction: string
  alternativeAndRetest: string
  evidenceState: ProductionEvidenceState
}
type ProductionLedger = {
  id: string
  version: string
  route: DeliveryRoute
  decision: string
  regionAndQuantity: string
  components: ProductionComponent[]
  currencyAndAmount: string
  costScope: CostScope
  costEvidenceState: ProductionEvidenceState
  costSourceAndDate: string
  included: string
  excluded: string
  packoutTask: string
  packedMeasurement: string
  validationGate: ValidationGate
  validationTask: string
  expectedResult: string
  actualResult: string
  approverAndUncoveredRisk: string
  accessibilityRetest: string
  environmentalAssumption: string
  biggestUnknown: string
  nextEvidence: string
  createdAt: string
}
type PublishingRoute = '投出版社/授权' | '免费/付费 PnP' | 'POD/平台商店' | '库存自出版' | '众筹后生产' | '比赛/展示' | '混合路线'
type RouteOwner = '我/我的团队' | '共同创作者' | '出版方' | '平台' | '外包/供应商' | '生产方' | '履约/仓储方' | '专业顾问' | '未定'
type RouteEvidence = '尚未核验' | '官网当前要求' | '书面沟通' | '合同/服务条款' | '已完成实测'
type RouteGate = '确认目标' | '核对投稿' | '请求样品' | '审阅合作/合同' | '验证需求' | '冻结众筹前预算' | '核对履约' | '发布入口盲测'
type RouteResponsibility = {
  id: string
  area: string
  scope: string
  owner: RouteOwner
  evidence: RouteEvidence
  sourceAndDate: string
  uncovered: string
}
type PublishingRouteMap = {
  id: string
  version: string
  route: PublishingRoute
  receiverAction: string
  routeReason: string
  nonNegotiable: string
  currentOfferOrCommitment: string
  rightsState: string
  moneyInventoryExposure: string
  currentRequirements: string
  gate: RouteGate
  gateQuestion: string
  nextEvidence: string
  exitCondition: string
  responsibilities: RouteResponsibility[]
  createdAt: string
}
type ProjectCheckpoint = {
  id: string
  version: string
  stage: Stage
  currentQuestion: string
  nextAction: string
  changeSummary: string
  createdAt: string
}
type ProjectWorkspace = {
  schemaVersion: 2
  id: string
  title: string
  audience: string
  playerCount: string
  duration: string
  experienceIntent: string
  designBoundaries: string
  goalAndEnd: string
  turnStructure: string
  componentScope: string
  version: string
  stage: Stage
  currentQuestion: string
  nextAction: string
  checkpoints: ProjectCheckpoint[]
  updatedAt: string
}

const PROJECT_WORKSPACE_STORAGE_KEY = 'tabletop-workshop-project-workspace-v2'
const LEGACY_PROJECT_WORKSPACE_STORAGE_KEY = 'tabletop-workshop-project-workspace-v1'
const REDESIGN_STORAGE_KEY = 'tabletop-workshop-redesign-v1'
const CONSTRAINT_STORAGE_KEY = 'tabletop-workshop-constraint-experiments-v1'
const BALANCE_STORAGE_KEY = 'tabletop-workshop-balance-passes-v1'
const DECISION_TRACE_STORAGE_KEY = 'tabletop-workshop-decision-traces-v1'
const SHARED_DECISION_STORAGE_KEY = 'tabletop-workshop-shared-decisions-v1'
const THEME_REVIEW_STORAGE_KEY = 'tabletop-workshop-theme-reviews-v1'
const PUBLISHING_ROUTE_STORAGE_KEY = 'tabletop-workshop-publishing-route-maps-v1'
const TEACHING_PATH_STORAGE_KEY = 'tabletop-workshop-teaching-paths-v1'
const ACCESSIBILITY_STORAGE_KEY = 'tabletop-workshop-accessibility-observations-v1'

const DEFAULT_PROJECT_WORKSPACE: ProjectWorkspace = {
  schemaVersion: 2,
  id: 'local-project',
  title: '未命名的海上贸易游戏',
  audience: '愿意讨论和比较长期计划的普通桌游玩家',
  playerCount: '2—4 人',
  duration: '30—45 分钟',
  experienceIntent: '玩家在眼前得分与长期航线之间做有后果的取舍。',
  designBoundaries: '首轮只使用卡牌、标记和一张路线纸；不做正式美术与商业发布判断。',
  goalAndEnd: '完成六轮交付后结束；比较已完成订单，同时保留航线承诺的后果。',
  turnStructure: '查看港口需求 → 选择一次装货或交付 → 更新订单与航线 → 下一位玩家。',
  componentScope: '18 张货物与订单卡、12 枚货物标记、4 个玩家标记、1 张路线纸。',
  version: 'v0.3',
  stage: '最小原型',
  currentQuestion: '玩家会为了长期收益放弃眼前得分吗？',
  nextAction: '制作只覆盖三个交付决定的纸面原型，并记录玩家实际考虑的选项。',
  checkpoints: [],
  updatedAt: '',
}

const PROJECT_ARTIFACT_SOURCES = [
  { id: 'experience_intent_records', key: EXPERIENCE_INTENT_STORAGE_KEY, collection: 'records' },
  { id: 'core_loop_records', key: CORE_LOOP_STORAGE_KEY, collection: 'records' },
  { id: 'test_plans', key: TEST_PLAN_STORAGE_KEY, collection: null },
  { id: 'playtest_sessions', key: PLAYTEST_SESSION_STORAGE_KEY, collection: 'records' },
  { id: 'feedback', key: FEEDBACK_REVIEW_STORAGE_KEY, collection: 'records' },
  { id: 'evidence_syntheses', key: EVIDENCE_SYNTHESIS_STORAGE_KEY, collection: 'records' },
  { id: 'redesigns', key: REDESIGN_STORAGE_KEY, collection: null },
  { id: 'constraint_experiments', key: CONSTRAINT_STORAGE_KEY, collection: 'experiments' },
  { id: 'balance_passes', key: BALANCE_STORAGE_KEY, collection: 'passes' },
  { id: 'decision_traces', key: DECISION_TRACE_STORAGE_KEY, collection: 'traces' },
  { id: 'shared_decisions', key: SHARED_DECISION_STORAGE_KEY, collection: 'observations' },
  { id: 'theme_reviews', key: THEME_REVIEW_STORAGE_KEY, collection: 'reviews' },
  { id: 'production_ledgers', key: PRODUCTION_LEDGER_STORAGE_KEY, collection: 'ledgers' },
  { id: 'publishing_route_maps', key: PUBLISHING_ROUTE_STORAGE_KEY, collection: 'maps' },
  { id: 'teaching_paths', key: TEACHING_PATH_STORAGE_KEY, collection: 'paths' },
  { id: 'accessibility_observations', key: ACCESSIBILITY_STORAGE_KEY, collection: 'observations' },
  { id: 'version_governance_records', key: VERSION_GOVERNANCE_STORAGE_KEY, collection: 'records' },
  { id: 'prototype_scope_records', key: PROTOTYPE_SCOPE_STORAGE_KEY, collection: 'records' },
  { id: 'issue_to_system_records', key: ISSUE_TO_SYSTEM_STORAGE_KEY, collection: 'records' },
] as const

function readProjectWorkspace(): ProjectWorkspace {
  try {
    const stored = JSON.parse(localStorage.getItem(PROJECT_WORKSPACE_STORAGE_KEY) || 'null')
    if (stored?.schemaVersion === 2) return { ...DEFAULT_PROJECT_WORKSPACE, ...stored, checkpoints: Array.isArray(stored.checkpoints) ? stored.checkpoints : [] }
    const legacy = JSON.parse(localStorage.getItem(LEGACY_PROJECT_WORKSPACE_STORAGE_KEY) || 'null')
    if (!legacy || legacy.schemaVersion !== 1) return DEFAULT_PROJECT_WORKSPACE
    const migrated = { ...DEFAULT_PROJECT_WORKSPACE, ...legacy, schemaVersion: 2 as const, checkpoints: Array.isArray(legacy.checkpoints) ? legacy.checkpoints : [] }
    return migrated
  } catch { return DEFAULT_PROJECT_WORKSPACE }
}

function readArtifact(source: (typeof PROJECT_ARTIFACT_SOURCES)[number]) {
  try {
    const stored = JSON.parse(localStorage.getItem(source.key) || (source.collection ? '{}' : '[]'))
    if (Array.isArray(stored)) return stored
    if (!source.collection) return []
    const records = stored?.[source.collection]
    return Array.isArray(records) ? records : []
  } catch { return [] }
}

function randomOtherIndex(length: number, current: number) {
  const values = new Uint32Array(1)
  crypto.getRandomValues(values)
  const next = values[0] % length
  return next === current ? (next + 1) % length : next
}

function ArrowIcon({ direction = 'right' }: { direction?: 'right' | 'down' }) {
  return <svg aria-hidden="true" className={`arrow arrow--${direction}`} viewBox="0 0 24 24"><path d="M5 12h13M13 6l6 6-6 6" /></svg>
}

function Header({ route, onNavigate }: { route: AppRoute; onNavigate: (route: AppRoute) => void }) {
  const english = route.readingLanguage === 'en'
  const language = route.readingLanguage || 'zh-CN'
  const twoTaskLinks: { id: keyof typeof navigationIcons; label: string; target: AppRoute; isActive: boolean }[] = [
    { id: 'course', label: english ? 'Learn design' : '系统学习', target: { view: 'course', tool: route.tool, readingLanguage: language }, isActive: route.view === 'course' || route.view === 'learn' || (route.resourceEntry === 'learn' && route.resourceId === 'systematic') },
    { id: 'cases', label: english ? 'Case studies' : '案例研究', target: { view: 'resources', tool: route.tool, resourceEntry: 'cases', resourceId: 'all', readingLanguage: language }, isActive: route.view === 'resources' && route.resourceEntry === 'cases' },
    { id: 'library', label: english ? 'Mechanisms & themes' : '机制与主题', target: { view: 'resources', tool: route.tool, resourceEntry: 'library', resourceId: 'all', readingLanguage: language }, isActive: route.view === 'resources' && route.resourceEntry !== 'cases' && !(route.resourceEntry === 'learn' && route.resourceId === 'systematic') },
    { id: 'workbench', label: english ? 'Workbench' : '设计工作台', target: { view: 'workbench', tool: route.tool, uiLanguage: language }, isActive: route.view === 'workbench' || route.view === 'projects' },
  ]
  const home: AppRoute = { view: 'course', tool: route.tool, readingLanguage: language }
  return <header className="header studio-header" lang={english ? 'en' : 'zh-CN'}>
    <a className="brand studio-brand" href={serializeRoute(home)} aria-label={english ? 'Luozhuo learning home' : `${PRODUCT_BRAND}学习首页`} onClick={event => { event.preventDefault(); onNavigate(home) }}><strong>{PRODUCT_BRAND}<span className="studio-brand__dot" aria-hidden="true">.</span></strong><span className="studio-brand__caption">{english ? 'TABLETOP DESIGN' : '桌游设计学习馆'}</span></a>
    <nav aria-label={english ? 'Main navigation' : '主导航'}>{twoTaskLinks.map(link => { const Icon = navigationIcons[link.id]; return <a key={link.id} href={serializeRoute(link.target)} aria-current={link.isActive ? 'page' : undefined} className={link.isActive ? 'nav-link is-active' : 'nav-link'} onClick={event => { event.preventDefault(); onNavigate(link.target) }}><Icon size={19} weight={link.isActive ? 'duotone' : 'regular'} aria-hidden="true"/><span>{link.label}</span>{link.isActive && <ActiveNavigationMark/>}</a> })}</nav>
    <div className="studio-header__actions"><LanguageSwitch language={language} onChange={next => { saveLanguagePreference(next); onNavigate(switchRouteLanguage(route, next)) }}/><span className="internal-scope">{english ? 'Internal preview' : '内部学习'}</span></div>
  </header>
}

function StageRail({ active, onSelect }: { active: Stage; onSelect: (stage: Stage) => void }) {
  return <div className="stage-scroll" aria-label="设计阶段"><div className="stage-rail">
    {stages.map((stage) => <button key={stage} className={stage === active ? 'stage is-active' : 'stage'} onClick={() => onSelect(stage)} aria-pressed={stage === active}>
      <span className="stage-dot" /><span>{stage}</span>
    </button>)}
  </div></div>
}

function MarginMarker({ number }: { number: number }) {
  return <div className="margin-marker" aria-hidden="true"><span>{number}</span></div>
}

function GuideArticle({ guide, onOpenConcept, onOpenTool, onOpenResource, onOpenResourceEntry, titleId }: { guide: Guide; onOpenConcept?: (conceptId: string) => void; onOpenTool: (toolId: GuideToolId) => void; onOpenResource?: (resourceId: string) => void; onOpenResourceEntry?: (entryId: string) => void; titleId: string }) {
  const sourceRecords = guide.resourceIds.map(id => resourceIndex.find(resource => resource.id === id)).filter((resource): resource is (typeof resourceIndex)[number] => Boolean(resource))
  const concepts = guide.conceptIds.map(id => glossaryIndex.find(term => term.id === id)).filter((term): term is (typeof glossaryIndex)[number] => Boolean(term))
  const resourceEntryId = onOpenResourceEntry ? guideResourceEntryByStage[guide.stage] : undefined
  return <article className="guide-article">
      <header className="guide-header"><div><span className="guide-kicker">{guide.stage} · 核心阅读 {guide.coreMinutes} 分钟</span><h2 id={titleId}>{guide.title}</h2><p className="guide-problem">{guide.problem}</p></div><div className="guide-outcome"><strong>读完带走</strong><p>{guide.outcome}</p></div></header>
      <p className="guide-opening">{guide.opening}</p>
      <ol className="guide-steps">{guide.steps.map((step, index) => <li key={step.label}><span>{String(index + 1).padStart(2, '0')}</span><div><h3>{step.label}</h3><p>{step.prompt}</p><small>贯穿例：{step.example}</small></div></li>)}</ol>
      <div className="guide-columns"><section><h3>常见误区与修复</h3><dl className="mistake-list">{guide.commonMistakes.map(item => <div key={item.mistake}><dt>{item.mistake}</dt><dd>{item.repair}</dd></div>)}</dl></section><section><h3>何时不要照搬</h3><ul className="boundary-list">{guide.whenToBreak.map(item => <li key={item}>{item}</li>)}</ul></section></div>
      <section className="guide-exercise"><span>20 分钟练习</span><h3>{guide.exercise.title}</h3><p>{guide.exercise.prompt}</p><small>示例产出：{guide.exercise.exampleOutput}</small>{guide.toolIds.length > 0 ? <div className="guide-tool-actions">{guide.toolIds.map((toolId, index) => <button key={toolId} className={index === 0 ? 'primary-button' : 'text-action'} onClick={() => onOpenTool(toolId)}>{toolActionLabels[toolId]}{index > 0 && <ArrowIcon />}</button>)}</div> : null}</section>
      <div className="guide-footer"><section><h3>完成信号</h3><ul>{guide.doneWhen.map(item => <li key={item}>{item}</li>)}</ul></section><section><h3>证据边界</h3><p>{guide.evidenceBoundary}</p></section></div>
      <div className="guide-concepts"><strong>本阶段概念</strong>{concepts.map(term => <a key={term.id} href={serializeRoute({ view: 'method', tool: 'redesign', methodSection: 'glossary', methodItem: term.id })} onClick={event => { if (onOpenConcept) { event.preventDefault(); onOpenConcept(term.id) } }}>{term.term}</a>)}</div>
      <footer className="guide-sources"><strong>继续阅读</strong>{resourceEntryId && <a className="guide-resource-entry" href={serializeRoute({ view: 'resources', tool: 'redesign', resourceEntry: resourceEntryId })} onMouseEnter={() => preloadResourceEntryCatalog(resourceEntryId)} onFocus={() => preloadResourceEntryCatalog(resourceEntryId)} onClick={event => { event.preventDefault(); onOpenResourceEntry?.(resourceEntryId) }}>继续阅读本阶段精选资源<ArrowIcon /></a>}{sourceRecords.map(resource => <button key={resource.id} type="button" onClick={() => onOpenResource?.(resource.id)}>查看《{resource.title}》中文导读<ArrowIcon /></button>)}</footer>
    </article>
}

function GuideSheet({ guide, onOpenConcept, onOpenTool, onOpenResource, onOpenResourceEntry }: { guide: Guide; onOpenConcept: (conceptId: string) => void; onOpenTool: (toolId: GuideToolId) => void; onOpenResource: (resourceId: string) => void; onOpenResourceEntry: (entryId: string) => void }) {
  return <section className="stage-guide" id={`guide-${guide.id}`} aria-labelledby={`guide-title-${guide.id}`}>
    <div className="guide-margin" aria-hidden="true"><span>03</span></div>
    <GuideArticle guide={guide} onOpenConcept={onOpenConcept} onOpenTool={onOpenTool} onOpenResource={onOpenResource} onOpenResourceEntry={onOpenResourceEntry} titleId={`guide-title-${guide.id}`} />
  </section>
}

function ProjectPanel({ project, onSave, onOpenTest }: { project: ProjectWorkspace; onSave: (draft: ProjectWorkspace, changeSummary: string) => void; onOpenTest: () => void }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(project)
  const [changeSummary, setChangeSummary] = useState('')
  const [status, setStatus] = useState('')
  const importRef = useRef<HTMLInputElement>(null)
  const artifacts = PROJECT_ARTIFACT_SOURCES.map(source => ({ id: source.id, records: readArtifact(source) }))
  const artifactTotal = artifacts.reduce((sum, item) => sum + item.records.length, 0)

  useEffect(() => { setDraft(project) }, [project])
  const saveProject = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const required = [draft.title, draft.version, draft.audience, draft.playerCount, draft.duration, draft.experienceIntent, draft.designBoundaries, draft.goalAndEnd, draft.turnStructure, draft.componentScope, draft.currentQuestion, draft.nextAction, changeSummary]
    if (!required.every(value => value.trim())) return setStatus('请写完项目简报、游戏骨架、当前问题、下一步和本次版本变化。')
    onSave({ ...draft, title: draft.title.trim(), version: draft.version.trim(), audience: draft.audience.trim(), playerCount: draft.playerCount.trim(), duration: draft.duration.trim(), experienceIntent: draft.experienceIntent.trim(), designBoundaries: draft.designBoundaries.trim(), goalAndEnd: draft.goalAndEnd.trim(), turnStructure: draft.turnStructure.trim(), componentScope: draft.componentScope.trim(), currentQuestion: draft.currentQuestion.trim(), nextAction: draft.nextAction.trim() }, changeSummary.trim())
    setChangeSummary('')
    setStatus('项目护照和版本节点已保存到这台设备。')
    setEditing(false)
  }
  const exportProject = () => {
    const payload = {
      schema_version: 2,
      method: 'local-project-workspace-export',
      local_first: true,
      single_active_project: true,
      project,
      artifacts: Object.fromEntries(artifacts.map(item => [item.id, item.records])),
      exported_at: new Date().toISOString(),
    }
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }); const url = URL.createObjectURL(blob); const anchor = document.createElement('a'); anchor.href = url; anchor.download = `${project.title || '桌游项目'}-完整项目包.json`; anchor.click(); URL.revokeObjectURL(url)
  }
  const importProject = async (file?: File) => {
    if (!file) return
    try {
      const parsed = JSON.parse(await file.text()) as Record<string, unknown>
      const candidate = ('project' in parsed ? parsed.project : parsed) as Partial<ProjectWorkspace> | undefined
      if (!candidate) throw new Error('invalid')
      if (!candidate.title || !candidate.version || !candidate.stage || !stages.includes(candidate.stage as Stage)) throw new Error('invalid')
      const restored: ProjectWorkspace = { ...DEFAULT_PROJECT_WORKSPACE, ...candidate, schemaVersion: 2, stage: candidate.stage as Stage, checkpoints: Array.isArray(candidate.checkpoints) ? candidate.checkpoints : [] }
      onSave(restored, '从导出的项目包恢复项目护照；请重新核对本机工具记录归属。')
      setStatus('项目护照已从文件恢复。工具记录不会从文件自动写回本机；请先核对版本和记录归属。')
      setEditing(false)
    } catch {
      setStatus('没有识别出可用的项目护照。请选择本站导出的完整项目包 JSON。')
    } finally {
      if (importRef.current) importRef.current.value = ''
    }
  }
  return <aside className="project-panel" aria-labelledby="project-panel-title">
    <div className="project-panel-heading"><h2 id="project-panel-title">当前项目</h2><button className="text-action" type="button" onClick={() => { setEditing(current => !current); setStatus('') }}>{editing ? '取消编辑' : '编辑项目护照'}</button></div>
    {editing ? <form className="project-editor" onSubmit={saveProject}>
      <label><span>项目名</span><input value={draft.title} onChange={event => setDraft(current => ({ ...current, title: event.target.value }))} /></label>
      <div className="project-editor-pair"><label><span>当前版本</span><input value={draft.version} onChange={event => setDraft(current => ({ ...current, version: event.target.value }))} /></label><label><span>当前阶段</span><select value={draft.stage} onChange={event => setDraft(current => ({ ...current, stage: event.target.value as Stage }))}>{stages.map(stage => <option key={stage}>{stage}</option>)}</select></label></div>
      <label><span>为谁设计</span><input value={draft.audience} onChange={event => setDraft(current => ({ ...current, audience: event.target.value }))} /></label>
      <div className="project-editor-pair"><label><span>玩家人数</span><input value={draft.playerCount} onChange={event => setDraft(current => ({ ...current, playerCount: event.target.value }))} /></label><label><span>目标时长</span><input value={draft.duration} onChange={event => setDraft(current => ({ ...current, duration: event.target.value }))} /></label></div>
      <label><span>体验意图</span><textarea value={draft.experienceIntent} onChange={event => setDraft(current => ({ ...current, experienceIntent: event.target.value }))} /></label>
      <label><span>设计边界</span><textarea value={draft.designBoundaries} onChange={event => setDraft(current => ({ ...current, designBoundaries: event.target.value }))} /></label>
      <label><span>玩家目标与结束条件</span><textarea value={draft.goalAndEnd} onChange={event => setDraft(current => ({ ...current, goalAndEnd: event.target.value }))} /></label>
      <label><span>主要行动与回合结构</span><textarea value={draft.turnStructure} onChange={event => setDraft(current => ({ ...current, turnStructure: event.target.value }))} /></label>
      <label><span>当前版本组件范围</span><textarea value={draft.componentScope} onChange={event => setDraft(current => ({ ...current, componentScope: event.target.value }))} /></label>
      <label><span>这一版只问什么</span><textarea value={draft.currentQuestion} onChange={event => setDraft(current => ({ ...current, currentQuestion: event.target.value }))} /></label>
      <label><span>下一步可执行动作</span><textarea value={draft.nextAction} onChange={event => setDraft(current => ({ ...current, nextAction: event.target.value }))} /></label>
      <label><span>本次版本变化</span><textarea value={changeSummary} onChange={event => setChangeSummary(event.target.value)} placeholder="例如：只把公开订单从 5 张减到 3 张；核心交付动作不变。" /></label>
      <button className="primary-button" type="submit">保存版本节点</button>
    </form> : <>
      <div className="project-title">{project.title}</div><div className="version">{project.version} · {project.stage}</div>
      <p className="project-brief-line">{project.audience} · {project.playerCount} · {project.duration}</p>
      <div className="project-question"><span>当前问题</span><p>{project.currentQuestion}</p></div>
      <div className="project-next"><span>下一步</span><p>{project.nextAction}</p></div>
    </>}
    <div className="project-evidence" aria-live="polite"><strong>{artifactTotal}</strong><span>条本地工具记录</span><strong>{project.checkpoints.length}</strong><span>个版本节点</span></div>
    <p className="project-boundary">首版只维护一个本地项目；导出前请确认这台设备上的记录都属于它。</p>
    <button className="primary-button" onClick={onOpenTest}>记录一次测试</button>
    <button className="text-action project-export" type="button" onClick={exportProject}>导出完整项目包 <ArrowIcon /></button>
    <input ref={importRef} className="visually-hidden" type="file" accept="application/json,.json" onChange={event => void importProject(event.target.files?.[0])} />
    <button className="text-action project-export" type="button" onClick={() => importRef.current?.click()}>从项目包恢复护照 <ArrowIcon /></button>
    <div className="form-status" aria-live="polite">{status}</div>
  </aside>
}

function PathView({ project, onSaveProject, onOpenConcept, onOpenTest, onOpenTool, onOpenResource, onOpenResourceEntry }: { project: ProjectWorkspace; onSaveProject: (draft: ProjectWorkspace, changeSummary: string) => void; onOpenConcept: (conceptId: string) => void; onOpenTest: () => void; onOpenTool: (toolId: GuideToolId) => void; onOpenResource: (resourceId: string) => void; onOpenResourceEntry: (entryId: string) => void }) {
  const [selected, setSelected] = useState(() => Math.max(0, stuckPoints.findIndex(item => item.stage === project.stage)))
  const [activeStage, setActiveStage] = useState<Stage>(project.stage)
  const activeGuide = guides.find(guide => guide.stage === activeStage)
  useEffect(() => {
    setActiveStage(project.stage)
    const index = stuckPoints.findIndex(item => item.stage === project.stage)
    if (index >= 0) setSelected(index)
  }, [project.stage])
  return <>
    <main className="workbench" id="main-content" tabIndex={-1}>
      <MarginMarker number={1} />
      <section className="decision-area">
        <h1>你的游戏，现在卡在哪里？</h1>
        <p className="lede">选一个最接近的状态，我们只处理下一步。</p>
        <StageRail active={activeStage} onSelect={(stage) => {
          setActiveStage(stage)
          const index = stuckPoints.findIndex(item => item.stage === stage)
          if (index >= 0) setSelected(index)
        }} />
        <div className="stuck-list">
          {stuckPoints.map((item, index) => <button key={item.title} className={selected === index ? 'stuck-row is-selected' : 'stuck-row'} onClick={() => { setSelected(index); setActiveStage(item.stage) }} aria-pressed={selected === index}>
            <span className="row-number">{index + 1}</span><strong>{item.title}</strong><span className="row-next">{item.next}</span><ArrowIcon />
          </button>)}
        </div>
        <button className="text-action" onClick={() => document.getElementById('loop')?.scrollIntoView({ behavior: 'smooth' })}>直接查看完整路径 <ArrowIcon /></button>
        {activeGuide && <button className="text-action guide-jump" onClick={() => document.getElementById(`guide-${activeGuide.id}`)?.scrollIntoView({ behavior: 'smooth' })}>阅读本阶段指南：{activeGuide.title} <ArrowIcon /></button>}
      </section>
      <ProjectPanel project={project} onSave={onSaveProject} onOpenTest={onOpenTest} />
    </main>
    <section className="loop-section" id="loop">
      <MarginMarker number={2} />
      <div><h2>一条能反复走的设计路径</h2><div className="loop-line" aria-label="循环设计路径">{stages.map(stage => <span key={stage}><i />{stage}</span>)}</div></div>
      <p className="hand-note">没有唯一入口，<br />但每一轮都需要证据。</p>
    </section>
    {activeGuide && <GuideSheet guide={activeGuide} onOpenConcept={onOpenConcept} onOpenTool={onOpenTool} onOpenResource={onOpenResource} onOpenResourceEntry={onOpenResourceEntry} />}
  </>
}

type ResourceLevelFilter = '全部' | 'beginner' | 'intermediate' | 'advanced'
type ResourceUseFilter = '全部' | 'learn' | 'diagnose' | 'compare' | 'lookup' | 'case_study'
type ResourceLanguageFilter = '全部' | '中文' | '英文' | '其他语言'
type ResourceAccessFilter = '全部' | '免费' | '付费或受限' | '仅摘要/元数据'

const resourceLevelLabels: Record<ResourceLevelFilter, string> = { 全部: '全部层级', beginner: '新手', intermediate: '进阶', advanced: '深入' }
const resourceUseLabels: Record<ResourceUseFilter, string> = { 全部: '全部用途', learn: '系统学习', diagnose: '诊断问题', compare: '比较观点', lookup: '快速查询', case_study: '阅读案例' }
const reviewDepthLabels: Record<string, string> = { full_text: '全文审阅', article_level: '文章级审阅', metadata_only: '仅摘要/元数据' }

function readingSupportLabel(audienceLevels: string[]) {
  if (audienceLevels.includes('beginner')) return '第一次接触这个主题也可以'
  if (audienceLevels.includes('intermediate')) return '适合已经在做一个项目时阅读'
  return '内容较深入，建议先看本站导读和相关概念'
}

function readingUseLabels(useModes: string[]) {
  return useModes.map(mode => resourceUseLabels[mode as ResourceUseFilter] ?? mode)
}

function ResourceCatalogBoundary({ children, surface = 'panel' }: { children: (catalog: ResourceCatalog) => ReactNode; surface?: 'page' | 'panel' }) {
  const [catalog, setCatalog] = useState<ResourceCatalog | null>(null)
  const [error, setError] = useState('')
  const [attempt, setAttempt] = useState(0)
  useEffect(() => {
    let active = true
    setError('')
    loadResourceCatalog()
      .then(value => { if (active) setCatalog(value) })
      .catch(() => { if (active) setError('资源数据没有加载成功。你可以重试；设计路径和已保存的本地记录没有受到影响。') })
    return () => { active = false }
  }, [attempt])
  const retry = () => { setCatalog(null); setAttempt(current => current + 1) }
  if (!catalog) {
    const status = error ? <><p role="alert">{error}</p><button className="text-action" type="button" onClick={retry}>重新加载资源数据 <ArrowIcon /></button></> : <p role="status">正在加载 {resourceIndex.length} 条资源及逐条审阅记录……</p>
    return surface === 'page'
      ? <main className="content-page resource-page resource-data-state" id="main-content" tabIndex={-1} aria-busy={!error}><h1>资源库</h1>{status}</main>
      : <section className="resource-data-state" aria-busy={!error}>{status}</section>
  }
  return <>{children(catalog)}</>
}

type InitialResourceDiscovery = Awaited<ReturnType<typeof loadInitialResourceDiscovery>>

function ResourceDiscoveryBoundary({ children, requestedEntryId }: { children: (data: InitialResourceDiscovery) => ReactNode; requestedEntryId?: string }) {
  const [data, setData] = useState<InitialResourceDiscovery | null>(null)
  const [error, setError] = useState('')
  const [attempt, setAttempt] = useState(0)
  const initialRequestedEntryId = useRef(requestedEntryId).current
  useEffect(() => {
    let active = true
    setError('')
    loadInitialResourceDiscovery(initialRequestedEntryId)
      .then(value => { if (active) setData(value) })
      .catch(() => { if (active) setError('策展阅读入口没有加载成功。你可以重试；设计路径和本地记录没有受到影响。') })
    return () => { active = false }
  }, [attempt])
  const retry = () => { setData(null); setAttempt(current => current + 1) }
  if (!data) return <main className="content-page resource-page resource-data-state" id="main-content" tabIndex={-1} aria-busy={!error}><h1>资源库</h1>{error ? <><p role="alert">{error}</p><button className="text-action" type="button" onClick={retry}>重新加载阅读入口 <ArrowIcon /></button></> : <p role="status">正在加载任务型阅读入口……</p>}</main>
  return <>{children(data)}</>
}

function ResourceEntryCatalogBoundary({ children, entryId, initialCatalog }: { children: (catalog: ResourceEntryCatalog) => ReactNode; entryId: string; initialCatalog?: ResourceEntryCatalog }) {
  const [catalog, setCatalog] = useState<ResourceEntryCatalog | null>(() => initialCatalog?.entry.id === entryId ? initialCatalog : null)
  const [error, setError] = useState('')
  const [attempt, setAttempt] = useState(0)
  useEffect(() => {
    if (catalog?.entry.id === entryId) return
    let active = true
    setError('')
    loadResourceEntryCatalog(entryId)
      .then(value => { if (active) setCatalog(value) })
      .catch(() => { if (active) setError('这个阅读入口的资源没有加载成功。其他入口和已保存记录仍然可用。') })
    return () => { active = false }
  }, [attempt, catalog, entryId])
  const retry = () => { setCatalog(null); setAttempt(current => current + 1) }
  if (!catalog) return <main className="content-page resource-page resource-data-state" id="main-content" tabIndex={-1} aria-busy={!error}><h1>资源库</h1>{error ? <><p role="alert">{error}</p><button className="text-action" type="button" onClick={retry}>重新加载这个入口 <ArrowIcon /></button></> : <p role="status">正在加载这组策展资源……</p>}</main>
  return <>{children(catalog)}</>
}

function MethodSectionBoundary<T>({ children, load, loadingLabel }: { children: (data: T) => ReactNode; load: () => Promise<T>; loadingLabel: string }) {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState('')
  const [attempt, setAttempt] = useState(0)
  useEffect(() => {
    let active = true
    setError('')
    load()
      .then(value => { if (active) setData(value) })
      .catch(() => { if (active) setError('这部分方法数据没有加载成功。你可以重试；其他方法标签、设计路径和本地记录仍然可用。') })
    return () => { active = false }
  }, [attempt, load])
  const retry = () => { setData(null); setAttempt(current => current + 1) }
  if (!data) return <section className="resource-data-state" aria-busy={!error}>{error ? <><p role="alert">{error}</p><button className="text-action" type="button" onClick={retry}>重新加载这部分 <ArrowIcon /></button></> : <p role="status">{loadingLabel}</p>}</section>
  return <>{children(data)}</>
}

type ResourceViewCatalog = Pick<ResourceCatalog, 'resourceAssessments' | 'resourceEntryPointPrinciple' | 'resourceEntryPoints' | 'resources'>

function stageForEntry(entryId: string, stageGroups: ResourceStageGroup[]) {
  return stageGroups.find(group => group.entryIds.includes(entryId))?.stage ?? '体验意图'
}

function ResourcePreview({ resource, assessment, entry, learningStep, onBack }: { resource: ResourceCatalog['resources'][number]; assessment?: ResourceCatalog['resourceAssessments'][number]; entry?: ResourceEntryPoint; learningStep?: ResourceLearningStep; onBack: () => void }) {
  const originalLanguage = resource.language.some(language => language.startsWith('zh')) ? '中文原生资料' : `原文语言：${resource.language.join(' / ')}`
  return <main className="content-page resource-preview-page" id="main-content" tabIndex={-1}>
    <button className="text-action preview-back" type="button" onClick={onBack}>返回资料列表 <ArrowIcon /></button>
    <article className="resource-preview">
      <header>
        <p className="resource-preview-kicker">本站中文导读</p>
        <h1>{learningStep?.guideTitle ?? (resource.language.some(language => language.startsWith('zh')) ? resource.title : `${resource.type}中文导读`)}</h1>
        <p className="resource-original-title">原始题名：{resource.title}</p>
        <p className="creator">{resource.creator} · {originalLanguage} · 核验 {resource.lastCheckedAt}</p>
      </header>
      <section className="resource-preview-lead"><h2>先看这一句</h2><p>{learningStep?.purpose ?? resource.useful}</p></section>
      {assessment && <section className="resource-preview-support"><h2>怎么开始读</h2><p>{readingSupportLabel(assessment.audienceLevels)}</p><ul aria-label="这份资料的常见用法">{readingUseLabels(assessment.useModes).map(label => <li key={label}>{label}</li>)}</ul></section>}
      {learningStep && <section className="resource-preview-focus"><h2>阅读时看</h2><p>{learningStep.focus}</p></section>}
      {(learningStep || entry) && <section className="resource-preview-action"><h2>读完先做</h2><p>{learningStep?.action ?? entry?.outcome}</p></section>}
      {assessment && <section className="resource-preview-fit"><div><h2>适合谁</h2><p>{assessment.bestFor}</p></div><div><h2>不要把它当成</h2><p>{assessment.doNotUseFor}</p></div></section>}
      <section className="resource-preview-boundary"><h2>阅读时要留心</h2><p>{resource.limitation}</p></section>
      <footer><strong>来源记录</strong><p>{resource.creator} 的《{resource.title}》。本站保留来源、审阅日期和中文导读，不会在阅读过程中跳转到外部网站。</p></footer>
    </article>
  </main>
}

function ResourceTopicPage({ discovery, entryCatalog, requestedResourceId, onBack, onOpenAll, onOpenResource, onOpenTool, onReplaceInvalidResource }: { discovery: ResourceDiscoveryCatalog; entryCatalog: ResourceEntryCatalog; requestedResourceId?: string; onBack: () => void; onOpenAll: () => void; onOpenResource: (entryId: string, resourceId: string) => void; onOpenTool: (toolId: GuideToolId) => void; onReplaceInvalidResource: () => void }) {
  const { entry, resourceAssessments, resources } = entryCatalog
  const learningPath = discovery.resourceLearningPaths.find(path => path.entryId === entry.id)
  const assessmentByResource = new Map(resourceAssessments.map(assessment => [assessment.resourceId, assessment]))
  const learningStepByResource = new Map(learningPath?.steps.map(step => [step.resourceId, step]) ?? [])
  const selectedResource = requestedResourceId ? resources.find(resource => resource.id === requestedResourceId) : undefined
  useEffect(() => {
    if (requestedResourceId && !selectedResource) onReplaceInvalidResource()
  }, [onReplaceInvalidResource, requestedResourceId, selectedResource])
  if (selectedResource) return <ResourcePreview resource={selectedResource} assessment={assessmentByResource.get(selectedResource.id)} entry={entry} learningStep={learningStepByResource.get(selectedResource.id)} onBack={onReplaceInvalidResource} />

  const starters = learningPath?.steps.map(step => ({ step, resource: resources.find(resource => resource.id === step.resourceId) })).filter((item): item is { step: ResourceLearningStep; resource: ResourceCatalog['resources'][number] } => Boolean(item.resource))
    ?? resources.slice(0, 3).map(resource => ({ resource, step: undefined }))
  const stage = stageForEntry(entry.id, discovery.resourceStageGroups)

  return (
    <main className="resource-detail-page resource-topic-page" id="main-content" tabIndex={-1}>
      <button className="resource-start-back" type="button" onClick={onBack}>返回设计问题</button>
      <p className="resource-detail-kicker">{stage}</p>
      <h1>{entry.title}</h1>
      <p className="resource-detail-lede">{entry.question}</p>
      <section className="resource-detail-next" aria-labelledby={`resource-topic-result-${entry.id}`}>
        <span>这组资料会带你</span>
        <h2 id={`resource-topic-result-${entry.id}`}>{entry.outcome}</h2>
      </section>
      <section className="resource-topic-starters" aria-labelledby={`resource-topic-starters-${entry.id}`}>
        <h2 id={`resource-topic-starters-${entry.id}`}>先读这三份中文内容</h2>
        <ol>
          {starters.map(({ resource, step }, index) => (
            <li key={resource.id}>
              <button type="button" onClick={() => onOpenResource(entry.id, resource.id)}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <strong>{step?.guideTitle ?? (resource.language.some(language => language.startsWith('zh')) ? resource.title : `${resource.type}中文导读`)}</strong>
                  <p>{step?.purpose ?? resource.useful}</p>
                  <small>{step ? `读完先做：${step.action}` : readingSupportLabel(assessmentByResource.get(resource.id)?.audienceLevels ?? [])}</small>
                </div>
              </button>
            </li>
          ))}
        </ol>
      </section>
      <ContextualToolLinks links={resourceEntryToolLinks[entry.id] ?? []} onOpenTool={onOpenTool} />
      <details className="resource-course-outline resource-topic-boundary">
        <summary>查看这组资料的适用边界</summary>
        <p>{entry.evidenceBoundary}</p>
      </details>
      <button className="resource-start-secondary" type="button" onClick={onOpenAll}>搜索全部资料</button>
    </main>
  )
}

function ResourceView({ catalog, audiencePathPrinciple, audiencePaths, entryPointTabs = catalog.resourceEntryPoints, initialEntryId = catalog.resourceEntryPoints[0]?.id ?? 'all', learningPathPrinciple, learningPaths, requestedResourceId, stageGroups, onRequestAll, onSelectEntry, onOpenResource, onPreloadEntry, totalResourceCount = catalog.resources.length }: { catalog: ResourceViewCatalog; audiencePathPrinciple: string; audiencePaths: ResourceAudiencePath[]; entryPointTabs?: ResourceEntryReference[]; initialEntryId?: string; learningPathPrinciple: string; learningPaths: ResourceLearningPath[]; requestedResourceId?: string; stageGroups: ResourceStageGroup[]; onRequestAll?: () => void; onSelectEntry?: (entryId: string) => void; onOpenResource?: (entryId: string, resourceId: string) => void; onPreloadEntry?: (entryId: string) => void; totalResourceCount?: number }) {
  const { resourceAssessments, resourceEntryPointPrinciple, resourceEntryPoints, resources } = catalog
  const [entryId, setEntryId] = useState(initialEntryId)
  const [activeStage, setActiveStage] = useState<Stage>(() => stageForEntry(initialEntryId, stageGroups))
  const [stageFilter, setStageFilter] = useState<Stage | '全部'>('全部')
  const [levelFilter, setLevelFilter] = useState<ResourceLevelFilter>('全部')
  const [useFilter, setUseFilter] = useState<ResourceUseFilter>('全部')
  const [languageFilter, setLanguageFilter] = useState<ResourceLanguageFilter>('全部')
  const [accessFilter, setAccessFilter] = useState<ResourceAccessFilter>('全部')
  const [query, setQuery] = useState('')
  const assessmentByResource = useMemo(() => new Map(resourceAssessments.map(assessment => [assessment.resourceId, assessment])), [resourceAssessments])
  const selectedEntry = resourceEntryPoints.find(entry => entry.id === entryId)
  const selectedLearningPath = learningPaths.find(path => path.entryId === entryId)
  const learningStepByResource = useMemo(() => new Map(learningPaths.flatMap(path => path.steps.map(step => [step.resourceId, step] as const))), [learningPaths])
  const selectedResource = requestedResourceId ? resources.find(resource => resource.id === requestedResourceId) : undefined
  const activeStageGroup = stageGroups.find(group => group.stage === activeStage) ?? stageGroups[0]
  const approaches = activeStageGroup.entryIds.map(id => entryPointTabs.find(entry => entry.id === id)).filter((entry): entry is ResourceEntryReference => Boolean(entry))
  const visibleApproaches = approaches.filter((entry, index) => index < 3 || entry.id === entryId)
  const moreApproaches = approaches.filter((entry, index) => index >= 3 && entry.id !== entryId)
  const resetFacets = () => { setStageFilter('全部'); setLevelFilter('全部'); setUseFilter('全部'); setLanguageFilter('全部'); setAccessFilter('全部'); setQuery('') }
  const chooseEntry = (id: string) => { resetFacets(); setActiveStage(stageForEntry(id, stageGroups)); if (onSelectEntry) onSelectEntry(id); else setEntryId(id) }
  const showAll = () => { resetFacets(); if (onRequestAll) onRequestAll(); else setEntryId('all') }
  const filtered = useMemo(() => {
    const entryIds = selectedEntry ? new Set(selectedEntry.resourceIds) : null
    const candidates = selectedEntry ? selectedEntry.resourceIds.map(id => resources.find(resource => resource.id === id)).filter((resource): resource is (typeof resources)[number] => Boolean(resource)) : resources
    return candidates.filter(resource => {
      const assessment = assessmentByResource.get(resource.id)
      const inEntry = !entryIds || entryIds.has(resource.id)
      const inStage = stageFilter === '全部' || resource.stages.includes(stageFilter)
      const inLevel = levelFilter === '全部' || assessment?.audienceLevels.includes(levelFilter)
      const inUse = useFilter === '全部' || assessment?.useModes.includes(useFilter)
      const hasChinese = resource.language.some(language => language.startsWith('zh'))
      const hasEnglish = resource.language.includes('en')
      const inLanguage = languageFilter === '全部' || (languageFilter === '中文' && hasChinese) || (languageFilter === '英文' && hasEnglish) || (languageFilter === '其他语言' && !hasChinese && !hasEnglish)
      const inAccess = accessFilter === '全部' || (accessFilter === '免费' && resource.access === 'free') || (accessFilter === '付费或受限' && ['paid', 'restricted', 'freemium', 'commercial'].includes(resource.access)) || (accessFilter === '仅摘要/元数据' && ['metadata', 'abstract'].includes(resource.access))
      const searchText = `${resource.title} ${resource.creator} ${resource.type} ${resource.useful} ${resource.limitation} ${assessment?.bestFor ?? ''} ${assessment?.doNotUseFor ?? ''}`.toLowerCase()
      return inEntry && inStage && inLevel && inUse && inLanguage && inAccess && searchText.includes(query.trim().toLowerCase())
    })
  }, [accessFilter, assessmentByResource, languageFilter, levelFilter, query, selectedEntry, stageFilter, useFilter])
  const hasActiveFacets = stageFilter !== '全部' || levelFilter !== '全部' || useFilter !== '全部' || languageFilter !== '全部' || accessFilter !== '全部' || query.trim() !== ''
  if (requestedResourceId && selectedResource) return <ResourcePreview resource={selectedResource} assessment={assessmentByResource.get(selectedResource.id)} entry={selectedEntry} learningStep={learningStepByResource.get(selectedResource.id)} onBack={() => onSelectEntry?.(entryId)} />
  return <main className="content-page resource-page" id="main-content" tabIndex={-1}><h1>找资料</h1><p className="lede">先选择你的设计阶段，再选择现在要解决的问题。每份资料都可直接在本站阅读中文导读。</p>
    <section className="resource-entry-guide" aria-labelledby="resource-entry-title">
      <h2 id="resource-entry-title">你现在在哪一步？</h2>
      <nav className="resource-stage-selector" aria-label="选择设计阶段">{stageGroups.map(group => <button key={group.stage} className={group.stage === activeStage ? 'is-active' : ''} aria-pressed={group.stage === activeStage} onClick={() => { setActiveStage(group.stage); chooseEntry(group.entryIds[0]) }}>{group.stage}</button>)}</nav>
      <details className="resource-audience-helper"><summary>我不知道自己在哪一步</summary><div><p>{audiencePathPrinciple}</p><nav aria-label="按当前处境选择资源入口">{audiencePaths.map(path => <button key={path.id} type="button" onMouseEnter={onPreloadEntry ? () => onPreloadEntry(path.entryId) : undefined} onFocus={onPreloadEntry ? () => onPreloadEntry(path.entryId) : undefined} onClick={() => chooseEntry(path.entryId)}><span><strong>{path.title}</strong><small>{path.situation}</small><em>{path.why}</em></span><ArrowIcon /></button>)}</nav></div></details>
      <div className="resource-approach-guide"><p>{activeStageGroup.prompt}</p><h3>选一个现在要解决的问题</h3><div className="resource-approach-list">{visibleApproaches.map(entry => <button key={entry.id} className={entryId === entry.id ? 'is-active' : ''} aria-pressed={entryId === entry.id} onMouseEnter={onPreloadEntry ? () => onPreloadEntry(entry.id) : undefined} onFocus={onPreloadEntry ? () => onPreloadEntry(entry.id) : undefined} onClick={() => chooseEntry(entry.id)}>{entry.title}<ArrowIcon /></button>)}</div>{moreApproaches.length > 0 && <details className="more-approaches"><summary>更多具体问题</summary><div>{moreApproaches.map(entry => <button key={entry.id} onClick={() => chooseEntry(entry.id)}>{entry.title}<ArrowIcon /></button>)}</div></details>}</div>
      {selectedEntry && <div className="resource-entry-detail"><div><span>你可能在问</span><p>{selectedEntry.question}</p></div><div><span>这组资料会带你</span><p>{selectedEntry.outcome}</p></div><small>资料边界：{selectedEntry.evidenceBoundary}</small></div>}
      {selectedLearningPath && <Suspense fallback={<section className="resource-learning-path resource-learning-loading" aria-busy="true"><p>正在准备三份起步资料……</p></section>}><ResourceLearningPathView path={selectedLearningPath} principle={learningPathPrinciple} onOpenResource={onOpenResource} /></Suspense>}
    </section>
    <details className="resource-search-panel"><summary>我想自己筛选资料</summary><div><p>{resourceEntryPointPrinciple}</p><label className="resource-search">搜索标题、作者、类型、用途或限制<input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="例如：第一次测试、规则查询、Wingspan" /></label><div className="filter-row" aria-label="按阶段筛选"><button className={stageFilter === '全部' ? 'filter is-active' : 'filter'} onClick={() => setStageFilter('全部')}>全部阶段</button>{stages.map(stage => <button key={stage} className={stageFilter === stage ? 'filter is-active' : 'filter'} onClick={() => setStageFilter(stage)}>{stage}</button>)}</div><div className="resource-facets"><label><span>适合谁</span><select value={levelFilter} onChange={event => setLevelFilter(event.target.value as ResourceLevelFilter)}>{(Object.keys(resourceLevelLabels) as ResourceLevelFilter[]).map(value => <option key={value} value={value}>{resourceLevelLabels[value]}</option>)}</select></label><label><span>拿来做什么</span><select value={useFilter} onChange={event => setUseFilter(event.target.value as ResourceUseFilter)}>{(Object.keys(resourceUseLabels) as ResourceUseFilter[]).map(value => <option key={value} value={value}>{resourceUseLabels[value]}</option>)}</select></label><label><span>语言</span><select value={languageFilter} onChange={event => setLanguageFilter(event.target.value as ResourceLanguageFilter)}><option>全部</option><option>中文</option><option>英文</option><option>其他语言</option></select></label><label><span>访问方式</span><select value={accessFilter} onChange={event => setAccessFilter(event.target.value as ResourceAccessFilter)}><option>全部</option><option>免费</option><option>付费或受限</option><option>仅摘要/元数据</option></select></label></div></div></details>
    <div className="resource-result-heading"><p className="result-count" aria-live="polite">{selectedEntry ? `“${selectedEntry.title}”中` : '全部资料中'}找到 {filtered.length} 份可在站内预览的中文导读</p>{(hasActiveFacets || entryId !== 'all') && <button className="text-action" type="button" onClick={showAll}>浏览完整资料库 {totalResourceCount} 条</button>}</div>
    {filtered.length === 0 ? <div className="resource-empty"><h2>没有同时满足这些条件的资料</h2><p>先撤掉一个筛选条件。零结果不表示这个主题没有资料。</p><button className="text-action" type="button" onClick={showAll}>浏览全部资料 <ArrowIcon /></button></div> : <div className="resource-list">{filtered.map(resource => {
      const assessment = assessmentByResource.get(resource.id)
      const learningStep = learningStepByResource.get(resource.id)
      return <button className="resource-row" key={resource.id} type="button" onClick={() => onOpenResource?.(entryId, resource.id)}><div className="resource-type">{resource.type}</div><div><h2>{learningStep?.guideTitle ?? (resource.language.some(language => language.startsWith('zh')) ? resource.title : '查看中文导读')}</h2>{learningStep && <p className="resource-curated-note">已收入本阶段最短学习路线</p>}<p className="resource-original-inline">原始题名：{resource.title}</p><p className="creator">{resource.creator} · {reviewDepthLabels[assessment?.reviewDepth ?? ''] ?? assessment?.reviewDepth} · 核验 {resource.lastCheckedAt}</p>{assessment && <div className="resource-reading-cues"><span>{readingSupportLabel(assessment.audienceLevels)}</span>{readingUseLabels(assessment.useModes).slice(0, 2).map(label => <span key={label}>{label}</span>)}</div>}<p>{resource.useful}</p>{assessment && <p className="resource-best-for"><strong>适合：</strong>{assessment.bestFor}</p>}</div><ArrowIcon /></button>
    })}</div>}
  </main>
}

function ResourcePage({ discovery, initialEntryCatalog, defaultEntryId, requestedEntryId, requestedResourceId, onSelectEntry, onOpenResource, onReplaceInvalidEntry }: { discovery: ResourceDiscoveryCatalog; initialEntryCatalog: ResourceEntryCatalog; defaultEntryId: string; requestedEntryId?: string; requestedResourceId?: string; onSelectEntry: (entryId: string) => void; onOpenResource: (entryId: string, resourceId: string) => void; onReplaceInvalidEntry: (entryId: string) => void }) {
  const isFullCatalog = requestedEntryId === 'all'
  const entryIsValid = requestedEntryId ? isFullCatalog || discovery.resourceEntryPoints.some(entry => entry.id === requestedEntryId) : false
  const entryId = isFullCatalog ? 'all' : entryIsValid ? requestedEntryId! : defaultEntryId
  useEffect(() => {
    if (requestedEntryId && !entryIsValid) onReplaceInvalidEntry(defaultEntryId)
  }, [defaultEntryId, entryIsValid, onReplaceInvalidEntry, requestedEntryId])
  if (isFullCatalog) return <ResourceCatalogBoundary surface="page">{catalog => <ResourceView key={`full-resource-catalog-${requestedResourceId ?? 'list'}`} catalog={catalog} audiencePathPrinciple={discovery.resourceAudiencePathPrinciple} audiencePaths={discovery.resourceAudiencePaths} entryPointTabs={discovery.resourceEntryPoints} initialEntryId="all" learningPathPrinciple={discovery.resourceLearningPathPrinciple} learningPaths={discovery.resourceLearningPaths} requestedResourceId={requestedResourceId} stageGroups={discovery.resourceStageGroups} totalResourceCount={resourceIndex.length} onSelectEntry={onSelectEntry} onOpenResource={onOpenResource} onRequestAll={() => onSelectEntry('all')} onPreloadEntry={preloadResourceEntryCatalog} />}</ResourceCatalogBoundary>
  return <ResourceEntryCatalogBoundary key={entryId} entryId={entryId} initialCatalog={entryId === initialEntryCatalog.entry.id ? initialEntryCatalog : undefined}>{entryCatalog => <ResourceView
    key={`${entryId}-${requestedResourceId ?? 'list'}`}
    catalog={{ resourceAssessments: entryCatalog.resourceAssessments, resourceEntryPointPrinciple: discovery.resourceEntryPointPrinciple, resourceEntryPoints: [entryCatalog.entry], resources: entryCatalog.resources }}
    audiencePathPrinciple={discovery.resourceAudiencePathPrinciple}
    audiencePaths={discovery.resourceAudiencePaths}
    learningPathPrinciple={discovery.resourceLearningPathPrinciple}
    learningPaths={discovery.resourceLearningPaths}
    entryPointTabs={discovery.resourceEntryPoints}
    initialEntryId={entryId}
    requestedResourceId={requestedResourceId}
    stageGroups={discovery.resourceStageGroups}
    totalResourceCount={resourceIndex.length}
    onSelectEntry={onSelectEntry}
    onOpenResource={onOpenResource}
    onPreloadEntry={preloadResourceEntryCatalog}
    onRequestAll={() => onSelectEntry('all')}
  />}</ResourceEntryCatalogBoundary>
}

function ResourceTopicRoute({ discovery, initialEntryCatalog, requestedEntryId, requestedResourceId, onBack, onOpenAll, onOpenResource, onOpenTool, onReplaceInvalidEntry, onReplaceInvalidResource }: { discovery: ResourceDiscoveryCatalog; initialEntryCatalog: ResourceEntryCatalog; requestedEntryId: string; requestedResourceId?: string; onBack: () => void; onOpenAll: () => void; onOpenResource: (entryId: string, resourceId: string) => void; onOpenTool: (toolId: GuideToolId) => void; onReplaceInvalidEntry: () => void; onReplaceInvalidResource: () => void }) {
  const entryIsValid = discovery.resourceEntryPoints.some(entry => entry.id === requestedEntryId)
  useEffect(() => {
    if (!entryIsValid) onReplaceInvalidEntry()
  }, [entryIsValid, onReplaceInvalidEntry])
  if (!entryIsValid) return <main className="resource-start-page" id="main-content" tabIndex={-1}><p role="status">正在返回设计问题入口……</p></main>
  return (
    <ResourceEntryCatalogBoundary entryId={requestedEntryId} initialCatalog={initialEntryCatalog.entry.id === requestedEntryId ? initialEntryCatalog : undefined}>
      {entryCatalog => <ResourceTopicPage discovery={discovery} entryCatalog={entryCatalog} requestedResourceId={requestedResourceId} onBack={onBack} onOpenAll={onOpenAll} onOpenResource={onOpenResource} onOpenTool={onOpenTool} onReplaceInvalidResource={onReplaceInvalidResource} />}
    </ResourceEntryCatalogBoundary>
  )
}

function useCanonicalMethodItem<T extends { id: string }>(items: T[], requestedId: string | undefined, onReplaceItem: (id: string) => void) {
  const selected = items.find(item => item.id === requestedId) ?? items[0]
  useEffect(() => {
    if (requestedId && !items.some(item => item.id === requestedId)) onReplaceItem(items[0].id)
  }, [items, onReplaceItem, requestedId])
  return selected
}

function FrameworkWorkbench({ frameworks, requestedId, onOpenResource, onSelectItem, onReplaceItem }: { frameworks: Framework[]; requestedId?: string; onOpenResource: (resourceId: string) => void; onSelectItem: (id: string) => void; onReplaceItem: (id: string) => void }) {
  const selected = useCanonicalMethodItem(frameworks, requestedId, onReplaceItem)
  const source = resourceIndex.find(item => item.id === selected.sourceId)
  const items = ['每条主张回到作者和原始页面', '明确样本、语境、商业关系与限制', '保留互相冲突但在特定条件下成立的建议']
  return <>
    <section className="theory-workbench" aria-label="理论框架工作台">
      <nav className="framework-index" aria-label="选择理论框架">{frameworks.map((framework, index) => <button key={framework.id} className={selected.id === framework.id ? 'framework-tab is-active' : 'framework-tab'} onClick={() => onSelectItem(framework.id)} aria-pressed={selected.id === framework.id}>
        <span>{String(index + 1).padStart(2, '0')}</span><div><strong>{framework.shortName}</strong><small>{framework.question}</small></div><ArrowIcon />
      </button>)}</nav>
      <article className="framework-sheet">
        <div className="framework-heading"><div><span className="framework-status">{selected.status}</span><h2>{selected.name}</h2><p>{selected.question}</p></div>{source && <button className="source-link" type="button" onClick={() => onOpenResource(source.id)}>查看中文导读 <ArrowIcon /></button>}</div>
        <div className="framework-fit"><section><h3>适合回答</h3><p>{selected.bestFor}</p></section><section><h3>不要拿它回答</h3><p>{selected.notFor}</p></section></div>
        <section className="framework-inputs"><h3>开始前准备</h3><ul>{selected.inputs.map(input => <li key={input}>{input}</li>)}</ul></section>
        <ol className="framework-moves">{selected.moves.map((move, index) => <li key={move.label}><span>{index + 1}</span><div><strong>{move.label}</strong><p>{move.prompt}</p></div></li>)}</ol>
        <div className="framework-output"><strong>本轮产出</strong><p>{selected.output}</p></div>
      </article>
    </section>
    <section className="selection-method"><h2>这些卡片怎样形成</h2><ol>{items.map(item => <li key={item}>{item}</li>)}</ol></section>
  </>
}

function GlossaryWorkbench({ actionIndex, glossary, onOpenGuide, onOpenResource, onOpenTool, requestedId, onSelectItem, onReplaceItem }: { actionIndex: ConceptActionIndex; glossary: GlossaryTerm[]; onOpenGuide: (guideId: string) => void; onOpenResource: (resourceId: string) => void; onOpenTool: (toolId: DesignToolId) => void; requestedId?: string; onSelectItem: (id: string) => void; onReplaceItem: (id: string) => void }) {
  const [query, setQuery] = useState('')
  const [stage, setStage] = useState<Stage | '全部'>('全部')
  const canonicalSelected = useCanonicalMethodItem(glossary, requestedId, onReplaceItem)
  const filtered = useMemo(() => glossary.filter(term => {
    const matchesStage = stage === '全部' || term.stages.includes(stage)
    const search = `${term.term} ${term.aliases.join(' ')} ${term.definition} ${term.example}`.toLowerCase()
    return matchesStage && search.includes(query.trim().toLowerCase())
  }), [query, stage])
  const selected = filtered.find(term => term.id === canonicalSelected.id) ?? filtered[0]
  useEffect(() => {
    if (selected && selected.id !== canonicalSelected.id) onReplaceItem(selected.id)
  }, [canonicalSelected.id, onReplaceItem, selected])
  const related = selected ? selected.relatedIds.map(id => glossary.find(term => term.id === id)).filter((term): term is (typeof glossary)[number] => Boolean(term)) : []
  const sourceRecords = selected ? selected.sourceIds.map(id => resourceIndex.find(resource => resource.id === id)).filter((resource): resource is (typeof resourceIndex)[number] => Boolean(resource)) : []
  const guideRecords = selected ? selected.guideIds.map(id => guides.find(guide => guide.id === id)).filter((guide): guide is Guide => Boolean(guide)) : []
  const actionEntry = selected ? actionIndex.entries.find(entry => entry.conceptId === selected.id) : undefined
  const specialGuideRecords = actionEntry?.specialGuideIds.map(id => actionIndex.specialGuides.find(guide => guide.id === id)).filter((guide): guide is (typeof actionIndex.specialGuides)[number] => Boolean(guide)) ?? []
  return <>
    <label className="method-search">搜索概念、别名或例子<input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="例如：保真度、玩家反馈、核心循环" /></label>
    <div className="filter-row" aria-label="按设计阶段筛选概念"><button className={stage === '全部' ? 'filter is-active' : 'filter'} onClick={() => setStage('全部')}>全部</button>{stages.map(item => <button key={item} className={stage === item ? 'filter is-active' : 'filter'} onClick={() => setStage(item)}>{item}</button>)}</div>
    <p className="result-count" aria-live="polite">找到 {filtered.length} 个规范词条</p>
    <section className="glossary-workbench" aria-label="桌游设计概念词表">
      <nav className="glossary-index" aria-label="选择概念">{filtered.map((term, index) => <button key={term.id} className={selected?.id === term.id ? 'glossary-row is-active' : 'glossary-row'} onClick={() => onSelectItem(term.id)} aria-pressed={selected?.id === term.id}><span>{String(index + 1).padStart(2, '0')}</span><div><strong>{term.term}</strong><small>{term.aliases.length ? `也称：${term.aliases.join('、')}` : '规范词条'}</small></div><ArrowIcon /></button>)}</nav>
      {selected ? <article className="glossary-sheet">
        <header><span>{selected.stages.join(' · ')}</span><h2>{selected.term}</h2>{selected.aliases.length > 0 && <p>别名：{selected.aliases.join('、')}</p>}</header>
        <section className="definition-block"><h3>在本站的定义</h3><p>{selected.definition}</p></section>
        <div className="glossary-contrast"><section><h3>不要把它当成</h3><p>{selected.notThis}</p></section><section><h3>贯穿例</h3><p>{selected.example}</p></section></div>
        <section className="concept-links"><h3>相关概念</h3><div>{related.map(term => <button key={term.id} onClick={() => { setQuery(''); setStage('全部'); onSelectItem(term.id) }}>{term.term}</button>)}</div></section>
        <section className="concept-backlinks"><h3>在哪条路径会用到</h3>{guideRecords.map(guide => <span key={guide.id}>{guide.stage} · {guide.title}</span>)}</section>
        <section className="concept-actions" aria-labelledby={`concept-actions-${selected.id}`}><div className="concept-actions-heading"><h3 id={`concept-actions-${selected.id}`}>把概念带回设计</h3><p>{actionIndex.principle}</p></div>
          {specialGuideRecords.length > 0 && <div className="concept-action-group"><strong>在专题里看它怎么用</strong><div>{specialGuideRecords.map(guide => <a className="concept-action-link concept-action-guide" key={guide.id} href={serializeRoute({ view: 'method', tool: 'redesign', methodSection: 'guides', methodItem: guide.id })} onClick={event => { event.preventDefault(); onOpenGuide(guide.id) }}><span>{guide.stage}</span>{guide.title}<ArrowIcon /></a>)}</div></div>}
          {actionEntry && <div className="concept-action-group"><strong>带去一个工作单</strong><div>{actionEntry.toolIds.map(toolId => <a className="concept-action-link concept-action-tool" key={toolId} href={serializeRoute({ view: 'tools', tool: toolId })} onClick={event => { event.preventDefault(); onOpenTool(toolId) }}>{toolActionLabels[toolId]}<ArrowIcon /></a>)}</div></div>}
        </section>
        <footer className="concept-sources"><strong>定义依据</strong>{sourceRecords.map(resource => <button key={resource.id} type="button" onClick={() => onOpenResource(resource.id)}>查看《{resource.title}》中文导读<ArrowIcon /></button>)}</footer>
      </article> : <p className="empty-copy">没有匹配词条。试试更短的关键词或取消阶段筛选。</p>}
    </section>
  </>
}

const assessmentDimensionOrder = ['useModes', 'audienceLevels', 'reviewDepth', 'contextClarity', 'actionability', 'transferability', 'currencyRisk', 'rightsStatus', 'commercialContext'] as const

function ResourceReadingWorkbench({ catalog, requestedId, onOpenResource, onSelectItem, onReplaceItem }: { catalog: ResourceCatalog; requestedId?: string; onOpenResource: (resourceId: string) => void; onSelectItem: (id: string) => void; onReplaceItem: (id: string) => void }) {
  const { resourceAssessments, resourceEvaluationRubric, resources } = catalog
  const [query, setQuery] = useState('')
  const canonicalSelected = useCanonicalMethodItem(resources, requestedId, onReplaceItem)
  const filtered = useMemo(() => resources.filter(resource => `${resource.title} ${resource.creator} ${resource.type}`.toLowerCase().includes(query.trim().toLowerCase())), [query])
  const selectedResource = filtered.find(resource => resource.id === canonicalSelected.id) ?? filtered[0]
  useEffect(() => {
    if (selectedResource && selectedResource.id !== canonicalSelected.id) onReplaceItem(selectedResource.id)
  }, [canonicalSelected.id, onReplaceItem, selectedResource])
  const assessment = selectedResource ? resourceAssessments.find(item => item.resourceId === selectedResource.id) : undefined
  const dimensionById = (id: string) => resourceEvaluationRubric.dimensions.find(dimension => dimension.id === id)
  const labelValue = (id: string, value: string) => dimensionById(id)?.options[value] ?? value
  return <>
    <aside className="evaluation-principle"><strong>不计算总分</strong><p>{resourceEvaluationRubric.principle}</p></aside>
    <section className="rubric-strip" aria-label="资源评价维度">{resourceEvaluationRubric.dimensions.map((dimension, index) => <article key={dimension.id}><span>{String(index + 1).padStart(2, '0')}</span><div><strong>{dimension.label}</strong><p>{dimension.question}</p></div></article>)}</section>
    <label className="method-search">搜索待判断的资源<input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="例如：MDA、规则书、AutoBG" /></label>
    <p className="result-count" aria-live="polite">找到 {filtered.length} 份资源审阅记录</p>
    <section className="assessment-workbench" aria-label="资源阅读说明">
      <nav className="assessment-index" aria-label="选择资源">{filtered.map(resource => <button key={resource.id} className={selectedResource?.id === resource.id ? 'assessment-row is-active' : 'assessment-row'} onClick={() => onSelectItem(resource.id)} aria-pressed={selectedResource?.id === resource.id}><div><strong>{resource.title}</strong><small>{resource.creator}</small></div><ArrowIcon /></button>)}</nav>
      {selectedResource && assessment ? <article className="assessment-sheet">
        <header><span>{selectedResource.type} · 审阅 {assessment.reviewedAt}</span><h2>{selectedResource.title}</h2><p>{selectedResource.creator}</p></header>
        <div className="assessment-boundary"><section><h3>最适合用来</h3><p>{assessment.bestFor}</p></section><section><h3>不要用来</h3><p>{assessment.doNotUseFor}</p></section></div>
        <dl>{assessmentDimensionOrder.map(id => {
          const raw = assessment[id]
          const values = Array.isArray(raw) ? raw : [raw]
          return <div key={id}><dt>{dimensionById(id)?.label}</dt><dd>{values.map(value => labelValue(id, value)).join(' · ')}</dd></div>
        })}</dl>
        <button className="source-link" type="button" onClick={() => onOpenResource(selectedResource.id)}>查看本站中文导读 <ArrowIcon /></button>
      </article> : <p className="empty-copy">没有匹配资源。试试作者、标题或资源类型。</p>}
    </section>
  </>
}

function SpecialGuideWorkbench({ onOpenConcept, onOpenResource, onOpenTool, onReplaceItem, onSelectItem, requestedId, specialGuides }: { onOpenConcept: (conceptId: string) => void; onOpenResource: (resourceId: string) => void; onOpenTool: (toolId: GuideToolId) => void; onReplaceItem: (id: string) => void; onSelectItem: (id: string) => void; requestedId?: string; specialGuides: Guide[] }) {
  const selected = useCanonicalMethodItem(specialGuides, requestedId, onReplaceItem)
  return <section className="special-guide-workbench" aria-label="专题指南">
    <nav className="special-guide-index" aria-label="选择专题指南">{specialGuides.map((guide, index) => <button key={guide.id} className={selected.id === guide.id ? 'special-guide-row is-active' : 'special-guide-row'} onClick={() => onSelectItem(guide.id)} aria-pressed={selected.id === guide.id}>
      <span>{String(index + 1).padStart(2, '0')}</span><div><strong>{guide.title}</strong><small>{guide.stage} · {guide.coreMinutes} 分钟</small></div><ArrowIcon />
    </button>)}</nav>
    <section className="special-guide-detail" aria-labelledby={`special-guide-title-${selected.id}`}><GuideArticle guide={selected} onOpenConcept={onOpenConcept} onOpenTool={onOpenTool} onOpenResource={onOpenResource} titleId={`special-guide-title-${selected.id}`} /></section>
  </section>
}

function MethodView({ itemId, onBack, onNavigate, onOpenResource, onOpenTool, section }: { itemId?: string; onBack: () => void; onNavigate: (section: MethodSection, itemId?: string, replace?: boolean) => void; onOpenResource: (resourceId: string) => void; onOpenTool: (toolId: GuideToolId) => void; section?: MethodSection }) {
  if (!section) return <main className="resource-start-page method-start-page" id="main-content" tabIndex={-1}>
    <p className="resource-start-kicker">先说你要做什么</p>
    <h1 className="resource-start-title">方法与概念</h1>
    <p className="resource-start-lede">不用从第一条读到最后一条。选择今天要查的内容，再回到自己的游戏。</p>
    <nav className="resource-start-choices" aria-label="选择方法与概念入口">
      <ul className="resource-start-list">
        {[
          { section: 'guides' as const, title: '解决一个具体任务', result: '原型、测试、规则、平衡或发布卡住时，先读一篇能带走工作单的专题。', preload: preloadSpecialGuides },
          { section: 'frameworks' as const, title: '理解一种分析方法', result: '用 MDA、5PM 等框架提出问题，不把框架当成答案。', preload: preloadFrameworks },
          { section: 'glossary' as const, title: '查一个设计词', result: '先对齐核心循环、机制、反馈等词义，再继续讨论。', preload: preloadGlossary },
        ].map((item, index) => <li className="resource-start-list-item" key={item.section}>
          <button className="resource-start-choice" type="button" onMouseEnter={item.preload} onFocus={item.preload} onClick={() => onNavigate(item.section)}>
            <span className="resource-start-choice-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
            <span className="resource-start-choice-copy"><strong className="resource-start-choice-title">{item.title}</strong><span className="resource-start-choice-result">{item.result}</span></span>
            <span className="resource-start-choice-arrow" aria-hidden="true">→</span>
          </button>
        </li>)}
      </ul>
    </nav>
  </main>
  const selectItem = (id: string) => onNavigate(section, id)
  const replaceItem = (id: string) => onNavigate(section, id, true)
  return <main className="content-page theory-page" id="main-content" tabIndex={-1}>
    <button className="resource-start-back" type="button" onClick={onBack}>返回方法与概念</button>
    <h1>方法与概念</h1><p className="lede">按你现在的问题，查一个方法、概念或判断依据。</p>
    <nav className="method-tabs" aria-label="方法内容"><button className={section === 'guides' ? 'is-active' : ''} aria-pressed={section === 'guides'} onMouseEnter={preloadSpecialGuides} onFocus={preloadSpecialGuides} onClick={() => onNavigate('guides')}>专题指南</button><button className={section === 'frameworks' ? 'is-active' : ''} aria-pressed={section === 'frameworks'} onMouseEnter={preloadFrameworks} onFocus={preloadFrameworks} onClick={() => onNavigate('frameworks')}>理论框架</button><button className={section === 'glossary' ? 'is-active' : ''} aria-pressed={section === 'glossary'} onMouseEnter={preloadGlossary} onFocus={preloadGlossary} onClick={() => onNavigate('glossary')}>概念词表</button></nav>
    {section === 'frameworks' && <MethodSectionBoundary load={loadFrameworks} loadingLabel="正在加载理论框架……">{frameworks => <FrameworkWorkbench frameworks={frameworks} requestedId={itemId} onOpenResource={onOpenResource} onSelectItem={selectItem} onReplaceItem={replaceItem} />}</MethodSectionBoundary>}
    {section === 'guides' && <MethodSectionBoundary load={loadSpecialGuides} loadingLabel="正在加载专题指南……">{specialGuides => <SpecialGuideWorkbench onOpenConcept={id => onNavigate('glossary', id)} onOpenResource={onOpenResource} onOpenTool={onOpenTool} requestedId={itemId} onSelectItem={selectItem} onReplaceItem={replaceItem} specialGuides={specialGuides} />}</MethodSectionBoundary>}
    {section === 'glossary' && <MethodSectionBoundary load={loadGlossary} loadingLabel={`正在加载 ${glossaryIndex.length} 个概念……`}>{workspace => <GlossaryWorkbench actionIndex={workspace.conceptActionIndex} glossary={workspace.glossary} onOpenGuide={id => onNavigate('guides', id)} onOpenResource={onOpenResource} onOpenTool={onOpenTool} requestedId={itemId} onSelectItem={selectItem} onReplaceItem={replaceItem} />}</MethodSectionBoundary>}
    {section === 'resource-reading' && <ResourceCatalogBoundary>{catalog => <ResourceReadingWorkbench catalog={catalog} requestedId={itemId} onOpenResource={onOpenResource} onSelectItem={selectItem} onReplaceItem={replaceItem} />}</ResourceCatalogBoundary>}
  </main>
}

function RedesignLab() {
  const [saved, setSaved] = useState<RedesignRecord[]>(() => {
    try { return JSON.parse(localStorage.getItem(REDESIGN_STORAGE_KEY) || '[]') } catch { return [] }
  })
  const [baseGame, setBaseGame] = useState('')
  const [targetExperience, setTargetExperience] = useState('')
  const [axis, setAxis] = useState<RedesignAxis>('选择')
  const [invariant, setInvariant] = useState('')
  const [ruleChange, setRuleChange] = useState('')
  const [prediction, setPrediction] = useState('')
  const [prototypeScope, setPrototypeScope] = useState('只制作能玩 1 到 3 回合的组件')
  const [testQuestion, setTestQuestion] = useState('')
  const [status, setStatus] = useState('')
  useEffect(() => { localStorage.setItem(REDESIGN_STORAGE_KEY, JSON.stringify(saved)) }, [saved])
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (![baseGame, targetExperience, invariant, ruleChange, prediction, prototypeScope, testQuestion].every(value => value.trim())) return setStatus('请完成每一步；尤其不要跳过行为预测和测试问题。')
    const record: RedesignRecord = { id: crypto.randomUUID(), baseGame: baseGame.trim(), targetExperience: targetExperience.trim(), axis, invariant: invariant.trim(), ruleChange: ruleChange.trim(), prediction: prediction.trim(), prototypeScope: prototypeScope.trim(), testQuestion: testQuestion.trim(), createdAt: new Date().toISOString() }
    setSaved(current => [record, ...current]); setStatus('已保存这次改造。现在做原型，只验证这一条预测。')
  }
  const exportData = () => {
    const blob = new Blob([JSON.stringify({ schema_version: 1, exercise: 'redesign-a-familiar-game', redesigns: saved }, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob); const anchor = document.createElement('a'); anchor.href = url; anchor.download = brandedDownloadName('熟悉游戏改造'); anchor.click(); URL.revokeObjectURL(url)
  }
  return <section className="tool-surface redesign-lab"><h2>改造一款熟悉的游戏</h2><p className="tool-intro">先别从空白纸发明完整游戏。保留大部分规则，只改变一个变量，并预测它会怎样改变玩家行为。</p>
    <div className="redesign-layout"><form className="redesign-form" onSubmit={submit}>
      <label><span>01 · 选一个熟悉的简单游戏</span><input value={baseGame} onChange={event => setBaseGame(event.target.value)} placeholder="例如：飞行棋、石头剪刀布" /></label>
      <label><span>02 · 希望玩家多经历什么？</span><textarea value={targetExperience} onChange={event => setTargetExperience(event.target.value)} placeholder="例如：更多有后果的选择，而不是只等待骰子结果。" /></label>
      <label><span>03 · 这一轮只改变</span><select value={axis} onChange={event => setAxis(event.target.value as RedesignAxis)}><option>选择</option><option>移动</option><option>信息</option><option>资源</option><option>互动</option><option>主题</option><option>胜利条件</option></select></label>
      <label><span>04 · 哪些核心保持不变？</span><textarea value={invariant} onChange={event => setInvariant(event.target.value)} placeholder="写下边界，防止变成重做整款游戏。" /></label>
      <label><span>05 · 写成一条可执行规则</span><textarea value={ruleChange} onChange={event => setRuleChange(event.target.value)} placeholder="玩家原来怎么做？现在改成怎样做？" /></label>
      <label><span>06 · 预测桌面上会发生什么</span><textarea value={prediction} onChange={event => setPrediction(event.target.value)} placeholder="玩家将做出什么不同决定、互动或权衡？" /></label>
      <label><span>07 · 最小原型范围</span><input value={prototypeScope} onChange={event => setPrototypeScope(event.target.value)} /></label>
      <label><span>08 · 只问一个测试问题</span><textarea value={testQuestion} onChange={event => setTestQuestion(event.target.value)} placeholder="例如：玩家会为了控制移动距离而保留高点数牌吗？" /></label>
      <button className="primary-button" type="submit">保存这次改造</button><div className="form-status" aria-live="polite">{status}</div>
    </form>
    <aside className="redesign-sheet" aria-label="本轮改造摘要"><div className="sheet-heading"><span>本轮假设</span><strong>{baseGame || '还没有选择基础游戏'}</strong></div>
      <dl><div><dt>目标体验</dt><dd>{targetExperience || '先写玩家应该多经历什么。'}</dd></div><div><dt>变化轴</dt><dd>{axis}</dd></div><div><dt>保持不变</dt><dd>{invariant || '写下不能一起改掉的核心。'}</dd></div><div><dt>规则改动</dt><dd>{ruleChange || '把想法写成玩家可以执行的规则。'}</dd></div><div><dt>行为预测</dt><dd>{prediction || '不要跳过：预计玩家会怎样不同？'}</dd></div><div><dt>原型范围</dt><dd>{prototypeScope}</dd></div></dl>
      <div className="redesign-question"><span>拿到桌上只问</span><p>{testQuestion || '一个能够证伪行为预测的问题。'}</p></div>
      {saved.length > 0 && <div className="redesign-actions"><span>已保存 {saved.length} 次</span><button className="text-action" onClick={exportData}>导出练习 JSON <ArrowIcon /></button></div>}
    </aside></div>
  </section>
}

type TestDecisionGoal = '运行' | '行为' | '外部理解' | '自主设置与查询' | '完整自主使用' | '极端边界'
type TestStability = '可能卡死' | '短片段稳定' | '整局稳定'
type TestAudience = '设计者自己' | '熟悉项目的人' | '未接触项目的玩家' | '目标玩家'
type TestMedium = '实体' | '线上' | '混合'

function PlaytestSelector() {
  const [question, setQuestion] = useState('玩家会为了下一港口优势，主动放弃至少一次眼前得分吗？')
  const [goal, setGoal] = useState<TestDecisionGoal>('行为')
  const [stability, setStability] = useState<TestStability>('短片段稳定')
  const [audience, setAudience] = useState<TestAudience>('未接触项目的玩家')
  const [medium, setMedium] = useState<TestMedium>('实体')
  const recommendation = useMemo(() => {
    if (goal === '运行') return { type: '自测 / 快速测试', why: '当前先排除卡死、无合法行动、组件不足和循环断裂；没有必要消耗外部测试者。', role: '可以同时操作多方、暂停、改规则，并在第一个结构性断点停止。', stop: '核心决定出现 2 到 3 次，或首次无法继续时停止。', boundary: '不能证明多人策略、社交互动、规则书清楚或目标玩家喜欢。' }
    if (goal === '自主设置与查询') return { type: '局部盲测', why: '本轮问题是玩家能否只靠规则与组件完成一个自主任务，不需要承担整局成本。', role: '不解释；只按事先写好的协助协议记录第一次偏离、查找路径与所需提示。', stop: '完成一次设置、反向教学或规则查询任务后停止。', boundary: '不能证明整局体验、平衡或完整交付包成立。' }
    if (goal === '完整自主使用' && stability === '整局稳定') return { type: '整局盲测', why: '系统已经能稳定完成一局，现在可以检验规则、组件、玩家辅助与结算能否脱离设计者共同运行。', role: '不在场，或取得同意后保持沉默观察；任何协助都单独记录。', stop: '完成结算，或出现无法靠交付包恢复的阻断时停止。', boundary: '一次成功不能证明所有玩家都能学会，也不能替代目标受众与可访问性测试。' }
    if (goal === '完整自主使用') return { type: '先做局部盲测', why: '当前版本还没有整局稳定证据；先拆出设置、教学或查询任务，避免把系统断裂与文档断裂混在一起。', role: '不给额外讲解，记录第一次偏离；任务完成后回到自测或引导测试修复系统。', stop: '一个自主任务完成，或出现第一次不可恢复偏离时停止。', boundary: '不能宣称完整规则包已经通过盲测。' }
    if (goal === '极端边界') return { type: '极限测试', why: '本轮主动寻找人数、资源、策略或时长边界，而不是观察常规玩家自然行为。', role: '公开说明要尝试的极端条件，允许暂停检查状态与参数。', stop: '触发目标边界、出现锁死，或确认该策略可重复后停止。', boundary: '极端条件下的问题不等于常规玩家会高频遇到。' }
    if (stability === '可能卡死') return { type: '先回到自测', why: '系统仍可能在几分钟内断裂；先取得最便宜的可运行证据，再邀请别人。', role: '同时操作多方并允许现场修订，只记录结构断点。', stop: '能连续完成两个核心循环，或首次卡死时停止。', boundary: '不能证明真实玩家行为、规则教学或体验质量。' }
    if (goal === '外部理解') return { type: '外部引导测试', why: '需要与项目投入关系更弱的人解释他们怎样理解系统，但当前不把自主阅读当作主要问题。', role: '先给概况和本轮问题；讲解后少提示、不辩护，保留测试者原话与实际行为。', stop: '核心决定出现 2 到 3 次或本轮问题已有明确证据后停止。', boundary: '外部玩家未必等于目标玩家，也不能证明规则书可以独立使用。' }
    return { type: audience === '目标玩家' ? '目标玩家引导测试' : '引导外部测试', why: '当前要观察目标行为；由设计者统一讲解后退到观察角色，能减少规则学习差异对行为证据的干扰。', role: '只讲一次规则；不暗示期望策略，记录行为发生的局面与未发生时的替代选择。', stop: '目标决定出现 2 到 3 次，或反驳信号重复出现后停止。', boundary: '不能证明规则书清楚、完整平衡或更大玩家群体都会采取同样行为。' }
  }, [audience, goal, stability])
  const mediumBlindSpot = medium === '实体' ? '仍需留意桌面视线、触达、操作和群体关系是否与目标场景一致。' : medium === '线上' ? '线上会删掉触感、设置劳动、桌面空间、身体动作与部分社交信号；之后安排实体复核。' : '混合媒介会让不同参与者获得不同信息与操作条件；分别记录两侧盲点。'
  const exportDecision = () => {
    const payload = { schema_version: 1, question, goal, stability, audience, medium, recommendation: { ...recommendation, mediumBlindSpot }, createdAt: new Date().toISOString() }
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }); const url = URL.createObjectURL(blob); const anchor = document.createElement('a'); anchor.href = url; anchor.download = brandedDownloadName('测试方式决定单'); anchor.click(); URL.revokeObjectURL(url)
  }
  return <section className="tool-surface playtest-selector"><h2>这轮应该怎么测试？</h2><p className="tool-intro">先选择要取得的证据，再决定测试方式。结果不是成熟度评分，也不会把盲测放在永远更高的位置。</p>
    <div className="selector-layout"><div className="selector-form">
      <label><span>01 · 本轮只问什么？</span><textarea value={question} onChange={event => setQuestion(event.target.value)} /></label>
      <label><span>02 · 主要想知道</span><select value={goal} onChange={event => setGoal(event.target.value as TestDecisionGoal)}><option>运行</option><option>行为</option><option>外部理解</option><option>自主设置与查询</option><option>完整自主使用</option><option>极端边界</option></select></label>
      <label><span>03 · 当前稳定度</span><select value={stability} onChange={event => setStability(event.target.value as TestStability)}><option>可能卡死</option><option>短片段稳定</option><option>整局稳定</option></select></label>
      <label><span>04 · 最需要谁的证据</span><select value={audience} onChange={event => setAudience(event.target.value as TestAudience)}><option>设计者自己</option><option>熟悉项目的人</option><option>未接触项目的玩家</option><option>目标玩家</option></select></label>
      <label><span>05 · 测试媒介</span><select value={medium} onChange={event => setMedium(event.target.value as TestMedium)}><option>实体</option><option>线上</option><option>混合</option></select></label>
    </div>
    <aside className="decision-sheet" aria-label="测试方式建议"><header><span>本轮建议</span><h2>{recommendation.type}</h2><p>{recommendation.why}</p></header>
      <dl><div><dt>设计者角色</dt><dd>{recommendation.role}</dd></div><div><dt>停止条件</dt><dd>{recommendation.stop}</dd></div><div><dt>媒介盲点</dt><dd>{mediumBlindSpot}</dd></div><div><dt>不能推出</dt><dd>{recommendation.boundary}</dd></div></dl>
      <div className="decision-question"><span>把它带到桌上</span><p>{question.trim() || '先写下一条可观察、可被反驳的问题。'}</p></div>
      <button className="primary-button" type="button" onClick={exportDecision}>导出决定单 JSON</button>
    </aside></div>
  </section>
}

function ConstraintDeck() {
  const [saved, setSaved] = useState<ConstraintExperiment[]>(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(CONSTRAINT_STORAGE_KEY) || '{"schemaVersion":1,"experiments":[]}')
      return Array.isArray(stored) ? stored : stored.experiments ?? []
    } catch { return [] }
  })
  const [observationIndex, setObservationIndex] = useState(0)
  const [moveIndex, setMoveIndex] = useState(0)
  const [boundaryIndex, setBoundaryIndex] = useState(0)
  const [targetExperience, setTargetExperience] = useState('玩家会为了未来位置优势，主动放弃一次眼前得分。')
  const [currentRule, setCurrentRule] = useState('玩家抵达港口时，可以立即交付任意数量的货物得分。')
  const [ruleChange, setRuleChange] = useState('')
  const [prediction, setPrediction] = useState('')
  const [testQuestion, setTestQuestion] = useState('')
  const [status, setStatus] = useState('')
  const observation = designConstraints.observations[observationIndex]
  const move = designConstraints.moves[moveIndex]
  const boundary = designConstraints.boundaries[boundaryIndex]
  const drawAll = () => {
    setObservationIndex(current => randomOtherIndex(designConstraints.observations.length, current))
    setMoveIndex(current => randomOtherIndex(designConstraints.moves.length, current))
    setBoundaryIndex(current => randomOtherIndex(designConstraints.boundaries.length, current))
    setRuleChange(''); setPrediction(''); setTestQuestion(''); setStatus('新组合已经抽出。先决定是否保留每张牌，再写规则。')
  }
  useEffect(() => { localStorage.setItem(CONSTRAINT_STORAGE_KEY, JSON.stringify({ schemaVersion: 1, experiments: saved })) }, [saved])
  const saveExperiment = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (![targetExperience, currentRule, ruleChange, prediction, testQuestion].every(value => value.trim())) return setStatus('请先写完体验意图、当前规则、规则改动、行为预测和测试问题。')
    setSaved(current => [{ id: crypto.randomUUID(), observationId: observation.id, moveId: move.id, boundaryId: boundary.id, targetExperience: targetExperience.trim(), currentRule: currentRule.trim(), ruleChange: ruleChange.trim(), prediction: prediction.trim(), testQuestion: testQuestion.trim(), createdAt: new Date().toISOString() }, ...current])
    setStatus('已保存为设计实验。随机组合仍需要上桌验证。')
  }
  const exportExperiments = () => {
    const payload = { schema_version: 1, principle: designConstraints.principle, experiments: saved }
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }); const url = URL.createObjectURL(blob); const anchor = document.createElement('a'); anchor.href = url; anchor.download = brandedDownloadName('原创设计约束实验'); anchor.click(); URL.revokeObjectURL(url)
  }
  return <section className="tool-surface constraint-deck"><h2>原创设计约束牌</h2><p className="tool-intro">不是随机机制生成器。一次改变一个观察角度，把结果写成规则、行为预测和最短测试。</p>
    <aside className="constraint-principle"><strong>使用原则</strong><p>{designConstraints.principle}</p></aside>
    <div className="constraint-cards" aria-label="本轮设计约束">
      <article><header><span>观察对象</span><button className="text-action" type="button" onClick={() => setObservationIndex(current => randomOtherIndex(designConstraints.observations.length, current))}>换一张</button></header><h3>{observation.label}</h3><p>{observation.prompt}</p></article>
      <article><header><span>变换动作</span><button className="text-action" type="button" onClick={() => setMoveIndex(current => randomOtherIndex(designConstraints.moves.length, current))}>换一张</button></header><h3>{move.label}</h3><p>{move.prompt}</p></article>
      <article><header><span>验证边界</span><button className="text-action" type="button" onClick={() => setBoundaryIndex(current => randomOtherIndex(designConstraints.boundaries.length, current))}>换一张</button></header><h3>{boundary.label}</h3><p>{boundary.prompt}</p></article>
    </div>
    <button className="text-action constraint-draw" type="button" onClick={drawAll}>抽取一组新约束 <ArrowIcon /></button>
    <div className="constraint-layout"><form className="constraint-form" onSubmit={saveExperiment}>
      <label><span>01 · 保留的体验意图</span><textarea value={targetExperience} onChange={event => setTargetExperience(event.target.value)} /></label>
      <label><span>02 · 当前规则或关系</span><textarea value={currentRule} onChange={event => setCurrentRule(event.target.value)} /></label>
      <label><span>03 · 只写一条规则改动</span><textarea value={ruleChange} onChange={event => setRuleChange(event.target.value)} placeholder={`尝试“${move.label}”之后，玩家具体怎样行动？`} /></label>
      <label><span>04 · 行为预测</span><textarea value={prediction} onChange={event => setPrediction(event.target.value)} placeholder="如果这样改，我预计玩家会……" /></label>
      <label><span>05 · 最短测试问题</span><textarea value={testQuestion} onChange={event => setTestQuestion(event.target.value)} placeholder="什么行为会支持或反驳预测？" /></label>
      <button className="primary-button" type="submit">保存为设计实验</button><div className="form-status" aria-live="polite">{status}</div>
    </form>
    <aside className="constraint-sheet" aria-label="设计实验摘要"><header><span>本轮不是答案</span><h2>{observation.label} × {move.label}</h2><p>{boundary.label}：{boundary.prompt}</p></header>
      <dl><div><dt>体验意图</dt><dd>{targetExperience || '先写不能被随机牌替换的体验意图。'}</dd></div><div><dt>当前规则</dt><dd>{currentRule || '写下正在改变的规则或系统关系。'}</dd></div><div><dt>规则改动</dt><dd>{ruleChange || '把提示翻译成玩家可以执行的一条规则。'}</dd></div><div><dt>行为预测</dt><dd>{prediction || '预测桌面上会出现什么不同动作。'}</dd></div></dl>
      <div className="constraint-question"><span>只拿这个问题上桌</span><p>{testQuestion || '写一个能够反驳行为预测的问题。'}</p></div>
      <p className="constraint-boundary">{designConstraints.evidenceBoundary}</p>
      {saved.length > 0 && <div className="constraint-actions"><span>已保存 {saved.length} 次实验</span><button className="text-action" type="button" onClick={exportExperiments}>导出 JSON <ArrowIcon /></button></div>}
    </aside></div>
  </section>
}

function BalancePassTool() {
  const [saved, setSaved] = useState<BalancePass[]>(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(BALANCE_STORAGE_KEY) || '{"schemaVersion":1,"passes":[]}')
      return Array.isArray(stored) ? stored : stored.passes ?? []
    } catch { return [] }
  })
  const [version, setVersion] = useState('v0.8')
  const [concern, setConcern] = useState<BalanceConcern>('先手/座位优势')
  const [targetExperience, setTargetExperience] = useState('两名熟悉规则的轻中策玩家，应在 45 分钟内都能通过市场选择影响收入。')
  const [question, setQuestion] = useState('先手的第一轮市场选择是否会持续扩大收入差距？')
  const [systemRelation, setSystemRelation] = useState('先手先买港口 → 港口每轮产 1 金 → 更早购买第二港口 → 收入差距继续扩大。')
  const [baseline, setBaseline] = useState('港口若平均存活四轮，基础产出为 4 金；先不包含封锁和交易。')
  const [modelBoundary, setModelBoundary] = useState('这只能描述规则的理论关系，不能证明玩家感到公平，也没有覆盖不同熟练度。')
  const [evidencePlan, setEvidencePlan] = useState('记录第一轮市场选择、每轮收入和终局分差；最多这三项。')
  const [testContext, setTestContext] = useState('两人实体局；同一对玩家交换先后手；记录玩家经验、座位和每局使用的版本。')
  const [disconfirmingSignal, setDisconfirmingSignal] = useState('如果优势跟随玩家而不是座位移动，先手复利不是当前主要解释。')
  const [nextChange, setNextChange] = useState('只给后手 1 枚第一轮可用的一次性折扣，其余规则不变。')
  const [status, setStatus] = useState('')
  useEffect(() => { localStorage.setItem(BALANCE_STORAGE_KEY, JSON.stringify({ schemaVersion: 1, passes: saved })) }, [saved])
  const savePass = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const required = [version, targetExperience, question, systemRelation, baseline, modelBoundary, evidencePlan, testContext, disconfirmingSignal, nextChange]
    if (!required.every(value => value.trim())) return setStatus('请先写完版本、目标、问题、系统关系、基线与边界、证据语境、反驳信号和单一改动。')
    const record: BalancePass = {
      id: crypto.randomUUID(), version: version.trim(), concern, targetExperience: targetExperience.trim(), question: question.trim(), systemRelation: systemRelation.trim(),
      baseline: baseline.trim(), modelBoundary: modelBoundary.trim(), evidencePlan: evidencePlan.trim(), testContext: testContext.trim(),
      disconfirmingSignal: disconfirmingSignal.trim(), nextChange: nextChange.trim(), createdAt: new Date().toISOString(),
    }
    setSaved(current => [record, ...current])
    setStatus('诊断单已保存。它定义下一次实验，不判定整款游戏“已经平衡”。')
  }
  const exportPasses = () => {
    const payload = { schema_version: 1, method: 'single-risk-balance-pass', no_aggregate_score: true, passes: saved }
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }); const url = URL.createObjectURL(blob); const anchor = document.createElement('a'); anchor.href = url; anchor.download = brandedDownloadName('单风险平衡诊断'); anchor.click(); URL.revokeObjectURL(url)
  }
  return <section className="tool-surface balance-tool"><h2>单风险平衡诊断</h2><p className="tool-intro">不计算“平衡分”。先定义一种失效风险，把模型、实测证据和下一版单一改动连在一起。</p>
    <aside className="balance-principle"><strong>诊断原则</strong><p>期望值、胜率和分差都是针对问题的证据，不是答案。每一条记录必须回到版本、人数与座位、玩家经验和测试情境。</p></aside>
    <div className="balance-layout"><form className="balance-form" onSubmit={savePass}>
      <div className="form-pair"><label><span>01 · 版本</span><input value={version} onChange={event => setVersion(event.target.value)} /></label><label><span>02 · 本轮只查一种风险</span><select value={concern} onChange={event => setConcern(event.target.value as BalanceConcern)}><option>选项支配</option><option>先手/座位优势</option><option>领先滚雪球</option><option>追赶过强</option><option>随机结果主导</option><option>经济停滞/爆炸</option><option>时长/节奏</option><option>非对称差异</option></select></label></div>
      <label><span>03 · 要保护的目标体验</span><textarea value={targetExperience} onChange={event => setTargetExperience(event.target.value)} placeholder="写目标玩家、人数、时长，以及什么张力必须保留。" /></label>
      <label><span>04 · 可被反驳的平衡问题</span><textarea value={question} onChange={event => setQuestion(event.target.value)} placeholder="谁在什么状态下，哪种差距或行为可能发生？" /></label>
      <label><span>05 · 产生差距的系统关系</span><textarea value={systemRelation} onChange={event => setSystemRelation(event.target.value)} placeholder="用来源、转换、消耗、计分，或成本、收益与反馈画一条链。" /></label>
      <label><span>06 · 当前模型或数学基线</span><textarea value={baseline} onChange={event => setBaseline(event.target.value)} placeholder="只计算当前问题需要的期望值、成本换算、分布或理论上限。" /></label>
      <label><span>07 · 这个模型不能证明什么</span><textarea value={modelBoundary} onChange={event => setModelBoundary(event.target.value)} /></label>
      <label><span>08 · 最多三项会改变决定的证据</span><textarea value={evidencePlan} onChange={event => setEvidencePlan(event.target.value)} placeholder="例如：首选、每轮收入、终局分差；不要收集用不上的数字。" /></label>
      <label><span>09 · 测试语境</span><textarea value={testContext} onChange={event => setTestContext(event.target.value)} placeholder="写人数/座位、玩家经验、媒介、方式和样本量；不要内置万能阈值。" /></label>
      <label><span>10 · 什么结果会反驳当前解释</span><textarea value={disconfirmingSignal} onChange={event => setDisconfirmingSignal(event.target.value)} /></label>
      <label><span>11 · 下一版只改变一个条件</span><textarea value={nextChange} onChange={event => setNextChange(event.target.value)} /></label>
      <button className="primary-button" type="submit">保存平衡诊断单</button><div className="form-status" aria-live="polite">{status}</div>
    </form>
    <aside className="balance-sheet" aria-label="单风险平衡诊断摘要"><header><span>不生成总分</span><h2>{question || '先写一个平衡问题'}</h2><p>{version || '未写版本'} · {concern}</p></header>
      <dl><div><dt>目标体验</dt><dd>{targetExperience || '先写要保护的玩家体验。'}</dd></div><div><dt>系统关系</dt><dd>{systemRelation || '画出差距从哪里产生。'}</dd></div><div><dt>当前基线</dt><dd>{baseline || '只计算当前问题需要的基线。'}</dd></div><div><dt>模型边界</dt><dd>{modelBoundary || '写它不能证明什么。'}</dd></div><div><dt>证据计划</dt><dd>{evidencePlan || '选择最多三项会改变决定的记录。'}</dd></div><div><dt>测试语境</dt><dd>{testContext || '让每条数据回到版本与玩家语境。'}</dd></div></dl>
      <div className="balance-experiment"><span>先尝试反驳</span><p>{disconfirmingSignal || '在看结果前写下反驳信号。'}</p><small>若仍保留当前解释，下一版只改：{nextChange || '一个上游条件。'}</small></div>
      <p className="balance-boundary">这张诊断单只处理当前版本的一种风险。它不能给出适用于所有游戏的胜率、样本量或“已平衡”结论。</p>
      {saved.length > 0 && <div className="balance-actions"><span>已保存 {saved.length} 次诊断</span><button className="text-action" type="button" onClick={exportPasses}>导出 JSON <ArrowIcon /></button></div>}
    </aside></div>
  </section>
}

function DecisionTraceTool() {
  const [saved, setSaved] = useState<DecisionTrace[]>(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(DECISION_TRACE_STORAGE_KEY) || '{"schemaVersion":1,"traces":[]}')
      return Array.isArray(stored) ? stored : stored.traces ?? []
    } catch { return [] }
  })
  const [version, setVersion] = useState('v0.8')
  const [playerContext, setPlayerContext] = useState('两名熟悉规则的轻中策玩家；实体同桌；当前玩家是后手。')
  const [moment, setMoment] = useState('第 2 轮行动阶段，市场刚补充完，当前玩家拥有 4 金和 2 件货物。')
  const [currentGoal, setCurrentGoal] = useState('保留下一轮进入北港的机会，同时避免本轮完全没有收入。')
  const [legalOptions, setLegalOptions] = useState('购买东港；购买北港；交付 1 件货物；保留金币并移动。')
  const [consideredOptions, setConsideredOptions] = useState('玩家在购买北港与交付 1 件货物之间来回比较；没有提到东港或保留金币。')
  const [collapseReason, setCollapseReason] = useState<DecisionCollapseReason>('未进入考虑')
  const [informationState, setInformationState] = useState('看见市场价格、自己的金币和货物；没有检查对手下一轮可以封锁北港的位置。')
  const [opportunityCost, setOpportunityCost] = useState('现在交付会得到 3 金，但会失去下轮北港套装奖励需要的唯一蓝货。')
  const [interactionPath, setInteractionPath] = useState('对手若先进入北港，会占用唯一泊位，使当前玩家的下一轮路线失效。')
  const [prediction, setPrediction] = useState('玩家预计对手会优先购买东港，因此选择保留北港路线。')
  const [actualAction, setActualAction] = useState('交付 1 件蓝货，获得 3 金。')
  const [actualConsequence, setActualConsequence] = useState('对手进入北港并占用泊位；当前玩家下一轮无法完成原计划。')
  const [feedbackVisibility, setFeedbackVisibility] = useState<FeedbackVisibility>('本轮稍后')
  const [modelUpdate, setModelUpdate] = useState('玩家看到泊位被占后说自己没有把对手位置算进去；下一次会先检查封锁路径。')
  const [nextChange, setNextChange] = useState('只在市场板旁增加“对手下一步可影响哪里”的公开位置提示，其余规则不变。')
  const [status, setStatus] = useState('')
  useEffect(() => { localStorage.setItem(DECISION_TRACE_STORAGE_KEY, JSON.stringify({ schemaVersion: 1, traces: saved })) }, [saved])
  const saveTrace = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const required = [version, playerContext, moment, currentGoal, legalOptions, consideredOptions, informationState, opportunityCost, prediction, actualAction, actualConsequence, modelUpdate, nextChange]
    if (!required.every(value => value.trim())) return setStatus('请先写完版本、玩家语境、决定时刻、目标、合法与实际考虑选项、信息、机会成本、预测、行动、后果、模型更新和下一改动。')
    const record: DecisionTrace = {
      id: crypto.randomUUID(), version: version.trim(), playerContext: playerContext.trim(), moment: moment.trim(), currentGoal: currentGoal.trim(),
      legalOptions: legalOptions.trim(), consideredOptions: consideredOptions.trim(), collapseReason, informationState: informationState.trim(),
      opportunityCost: opportunityCost.trim(), interactionPath: interactionPath.trim(), prediction: prediction.trim(), actualAction: actualAction.trim(),
      actualConsequence: actualConsequence.trim(), feedbackVisibility, modelUpdate: modelUpdate.trim(), nextChange: nextChange.trim(), createdAt: new Date().toISOString(),
    }
    setSaved(current => [record, ...current])
    setStatus('决定轨迹已保存。它记录玩家当时的模型，不给决定、玩家或游戏打分。')
  }
  const exportTraces = () => {
    const payload = { schema_version: 1, method: 'single-decision-trace', no_aggregate_score: true, traces: saved }
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }); const url = URL.createObjectURL(blob); const anchor = document.createElement('a'); anchor.href = url; anchor.download = brandedDownloadName('单轮决定轨迹'); anchor.click(); URL.revokeObjectURL(url)
  }
  return <section className="tool-surface decision-trace-tool"><h2>单轮决定轨迹</h2><p className="tool-intro">不评价决定好坏，也不计算策略深度。冻结一个决定时刻，分开记录规则允许什么、玩家真正考虑什么，以及行动怎样更新了玩家模型。</p>
    <aside className="decision-trace-principle"><strong>记录原则</strong><p>选项数量不是选择质量。先找合法选项第一次缩成玩家实际决定空间的位置，再判断要改信息、成本、互动路径、反馈时机，还是根本不该改。</p></aside>
    <div className="decision-trace-layout"><form className="decision-trace-form" onSubmit={saveTrace}>
      <div className="form-pair"><label><span>01 · 版本</span><input value={version} onChange={event => setVersion(event.target.value)} /></label><label><span>02 · 反馈何时可见</span><select value={feedbackVisibility} onChange={event => setFeedbackVisibility(event.target.value as FeedbackVisibility)}><option>立即可见</option><option>本轮稍后</option><option>跨轮延后</option><option>终局才见</option><option>始终不清楚</option></select></label></div>
      <label><span>03 · 玩家与测试语境</span><textarea value={playerContext} onChange={event => setPlayerContext(event.target.value)} /></label>
      <label><span>04 · 一个决定时刻</span><textarea value={moment} onChange={event => setMoment(event.target.value)} placeholder="写轮次、阶段、资源、位置与刚发生的事件。" /></label>
      <label><span>05 · 玩家当时的目标</span><textarea value={currentGoal} onChange={event => setCurrentGoal(event.target.value)} placeholder="记录玩家表达或行动显示的当前目标，不替玩家写最佳目标。" /></label>
      <label><span>06 · 规则允许的合法选项</span><textarea value={legalOptions} onChange={event => setLegalOptions(event.target.value)} /></label>
      <label><span>07 · 玩家实际考虑的选项</span><textarea value={consideredOptions} onChange={event => setConsideredOptions(event.target.value)} placeholder="记录指向、比较、询问、停顿或口述；未被提及不等于不可见。" /></label>
      <label><span>08 · 第一类选项坍缩</span><select value={collapseReason} onChange={event => setCollapseReason(event.target.value as DecisionCollapseReason)}><option>显然更差</option><option>后果相同</option><option>信息不清</option><option>不可支付/不可达</option><option>负担过重</option><option>被他人行动封锁</option><option>未进入考虑</option><option>其他</option></select></label>
      <label><span>09 · 当时看见与缺失的信息</span><textarea value={informationState} onChange={event => setInformationState(event.target.value)} /></label>
      <label><span>10 · 选择一种行动放弃了什么</span><textarea value={opportunityCost} onChange={event => setOpportunityCost(event.target.value)} /></label>
      <label><span>11 · 其他玩家怎样影响这条路径（可选）</span><textarea value={interactionPath} onChange={event => setInteractionPath(event.target.value)} placeholder="写谁的什么行动，经由哪条规则关系，改变了谁的状态或可行选项。" /></label>
      <label><span>12 · 行动前的预测</span><textarea value={prediction} onChange={event => setPrediction(event.target.value)} /></label>
      <label><span>13 · 实际行动</span><textarea value={actualAction} onChange={event => setActualAction(event.target.value)} /></label>
      <label><span>14 · 实际后果</span><textarea value={actualConsequence} onChange={event => setActualConsequence(event.target.value)} /></label>
      <label><span>15 · 玩家怎样更新了自己的模型</span><textarea value={modelUpdate} onChange={event => setModelUpdate(event.target.value)} placeholder="记录下一次会注意、预测或比较什么；没有更新也照实写。" /></label>
      <label><span>16 · 下一版只改变一处</span><textarea value={nextChange} onChange={event => setNextChange(event.target.value)} /></label>
      <button className="primary-button" type="submit">保存决定轨迹</button><div className="form-status" aria-live="polite">{status}</div>
    </form>
    <aside className="decision-trace-sheet" aria-label="单轮决定轨迹摘要"><header><span>不计算决定质量</span><h2>{currentGoal || '先记录玩家当时的目标'}</h2><p>{version || '未写版本'} · {playerContext || '未写玩家语境'}<br />{moment || '未写决定时刻'}</p></header>
      <dl><div><dt>合法选项</dt><dd>{legalOptions || '先列规则允许的行动。'}</dd></div><div><dt>实际考虑</dt><dd>{consideredOptions || '记录玩家真正比较的行动。'}</dd></div><div><dt>首次坍缩</dt><dd>{collapseReason}</dd></div><div><dt>信息状态</dt><dd>{informationState || '写当时可见与缺失的信息。'}</dd></div><div><dt>机会成本</dt><dd>{opportunityCost || '写选择一种行动放弃了什么。'}</dd></div><div><dt>互动路径</dt><dd>{interactionPath || '本次尚未记录其他玩家改变这条路径。'}</dd></div><div><dt>行动前预测</dt><dd>{prediction || '记录行动前的因果预期。'}</dd></div><div><dt>实际行动</dt><dd>{actualAction || '记录玩家做了什么。'}</dd></div><div><dt>实际后果</dt><dd>{actualConsequence || '记录规则与他人行动造成的后果。'} · {feedbackVisibility}</dd></div><div><dt>模型更新</dt><dd>{modelUpdate || '观察玩家下一次会怎样改变注意或预测。'}</dd></div></dl>
      <div className="decision-trace-experiment"><span>先修决定第一次坍缩的位置</span><p>{collapseReason}：比较规则允许的选项与玩家实际考虑的选项。</p><small>下一版只改：{nextChange || '一处信息、成本、互动或反馈条件。'}</small></div>
      <p className="decision-trace-boundary">一条轨迹只描述当前玩家、版本和局面。它不能证明策略深度、可重玩性、最佳玩法或群体偏好，也不能把未被口述的思考当作不存在。</p>
      {saved.length > 0 && <div className="decision-trace-actions"><span>已保存 {saved.length} 条决定轨迹</span><button className="text-action" type="button" onClick={exportTraces}>导出 JSON <ArrowIcon /></button></div>}
    </aside></div>
  </section>
}

function SharedDecisionTool() {
  const [saved, setSaved] = useState<SharedDecisionObservation[]>(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(SHARED_DECISION_STORAGE_KEY) || '{"schemaVersion":1,"observations":[]}')
      return Array.isArray(stored) ? stored : stored.observations ?? []
    } catch { return [] }
  })
  const [version, setVersion] = useState('v0.7')
  const [playContext, setPlayContext] = useState('四人第一次合作局；实体同桌；使用角色名和颜色代号，不记录真实姓名。')
  const [moment, setMoment] = useState('第 3 轮选择下一条航线，团队剩余 2 点燃料，北线有未知风暴风险。')
  const [participationAgreement, setParticipationAgreement] = useState<ParticipationAgreement>('先讨论后由行动者决定')
  const [decisionOwner, setDecisionOwner] = useState('当前驾驶员（蓝）应听取提案后拍板；其他人可提问和给出选项。')
  const [informationMap, setInformationMap] = useState('侦察员（绿）知道一张风暴牌，只能口述；全桌看见燃料与航线成本；驾驶员不知道北线风暴强度。')
  const [permissionMap, setPermissionMap] = useState('所有人可提案和质疑；驾驶员可修改、拒绝并拍板；记录员只执行棋子移动。')
  const [proposalTrace, setProposalTrace] = useState('红提出北线并说明可节省燃料；绿提示北线有风险；黄提出南线但没有展开成本。')
  const [responseTrace, setResponseTrace] = useState('蓝追问北线风险；红在绿回答前给出结论并要求记录员移动；蓝没有再次回应。沉默原因无法判断。')
  const [finalDecision, setFinalDecision] = useState('红说“就走北线”，记录员随后开始移动；蓝没有明确拍板。')
  const [executionOwner, setExecutionOwner] = useState('记录员（黄）移动蓝的船，并从团队燃料轨扣除 1 点。')
  const [consequence, setConsequence] = useState('北线翻出风暴，蓝失去一次角色行动；团队仍成功抵达，但后果主要落在蓝的角色。')
  const [consentSignal, setConsentSignal] = useState<ConsentSignal>('事后表示不符合期待')
  const [consentCheck, setConsentCheck] = useState('局后蓝说愿意听两个选项，但希望自己拍板；下次不希望别人直接要求执行。')
  const [accessCondition, setAccessCondition] = useState('红语速快且两次重叠绿的发言；座位较远的蓝看不清风暴牌图标；没有提供文字通道。')
  const [firstMismatch, setFirstMismatch] = useState('参与约定要求驾驶员拍板，但红在蓝回应前把提案变成了执行指令。')
  const [nextChange, setNextChange] = useState('只加入“行动者复述两个选项并确认后拍板”的回合提示；不改变信息分配。')
  const [status, setStatus] = useState('')
  useEffect(() => { localStorage.setItem(SHARED_DECISION_STORAGE_KEY, JSON.stringify({ schemaVersion: 1, observations: saved })) }, [saved])
  const saveObservation = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const required = [version, playContext, moment, decisionOwner, informationMap, permissionMap, proposalTrace, responseTrace, finalDecision, executionOwner, consequence, consentCheck, accessCondition, firstMismatch, nextChange]
    if (!required.every(value => value.trim())) return setStatus('请先写完版本、语境、决定时刻、归属、信息与权限、提案与回应、最终决定、执行、后果、同意核对、沟通条件、第一次错位和下一改动。')
    const record: SharedDecisionObservation = {
      id: crypto.randomUUID(), version: version.trim(), playContext: playContext.trim(), moment: moment.trim(), participationAgreement,
      decisionOwner: decisionOwner.trim(), informationMap: informationMap.trim(), permissionMap: permissionMap.trim(), proposalTrace: proposalTrace.trim(),
      responseTrace: responseTrace.trim(), finalDecision: finalDecision.trim(), executionOwner: executionOwner.trim(), consequence: consequence.trim(),
      consentSignal, consentCheck: consentCheck.trim(), accessCondition: accessCondition.trim(), firstMismatch: firstMismatch.trim(),
      nextChange: nextChange.trim(), createdAt: new Date().toISOString(),
    }
    setSaved(current => [record, ...current])
    setStatus('共享决定观察已保存。它记录当前桌面关系，不给玩家的发言、领导或合作能力打分。')
  }
  const exportObservations = () => {
    const payload = { schema_version: 1, method: 'shared-decision-observation', no_aggregate_score: true, observations: saved }
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }); const url = URL.createObjectURL(blob); const anchor = document.createElement('a'); anchor.href = url; anchor.download = brandedDownloadName('共享决定观察'); anchor.click(); URL.revokeObjectURL(url)
  }
  return <section className="tool-surface shared-decision-tool"><h2>共享决定观察</h2><p className="tool-intro">不数谁说得多，也不评价谁更会合作。冻结一次共同决定，比较参与约定与实际的信息、权限、提案、拍板、执行和后果。</p>
    <aside className="decision-trace-principle shared-decision-principle"><strong>记录原则</strong><p>发言多不等于决定代办，沉默也不等于同意。使用角色或代号，先确认希望怎样参与，再找决定权第一次偏离约定的位置。</p></aside>
    <div className="decision-trace-layout shared-decision-layout"><form className="decision-trace-form shared-decision-form" onSubmit={saveObservation}>
      <div className="form-pair"><label><span>01 · 版本</span><input value={version} onChange={event => setVersion(event.target.value)} /></label><label><span>02 · 参与约定</span><select value={participationAgreement} onChange={event => setParticipationAgreement(event.target.value as ParticipationAgreement)}><option>各自决定，可给选项</option><option>先讨论后由行动者决定</option><option>共同共识</option><option>指定指挥/导师</option><option>允许自由代办</option><option>未事先确认</option><option>其他</option></select></label></div>
      <label><span>03 · 桌面与玩家语境</span><textarea value={playContext} onChange={event => setPlayContext(event.target.value)} placeholder="用角色、颜色或代号；不要记录真实姓名。" /></label>
      <label><span>04 · 一个共同决定时刻</span><textarea value={moment} onChange={event => setMoment(event.target.value)} /></label>
      <label><span>05 · 约定的决定归属</span><textarea value={decisionOwner} onChange={event => setDecisionOwner(event.target.value)} placeholder="谁可提案、否决、拍板或执行？" /></label>
      <label><span>06 · 谁知道什么，能否分享</span><textarea value={informationMap} onChange={event => setInformationMap(event.target.value)} /></label>
      <label><span>07 · 提案、修改、否决、拍板与执行权限</span><textarea value={permissionMap} onChange={event => setPermissionMap(event.target.value)} /></label>
      <label><span>08 · 提案顺序</span><textarea value={proposalTrace} onChange={event => setProposalTrace(event.target.value)} /></label>
      <label><span>09 · 回应、反提案、中断与沉默</span><textarea value={responseTrace} onChange={event => setResponseTrace(event.target.value)} placeholder="沉默只写无法判断，不推断同意或没有想法。" /></label>
      <label><span>10 · 最终是谁怎样决定</span><textarea value={finalDecision} onChange={event => setFinalDecision(event.target.value)} /></label>
      <label><span>11 · 谁实际执行</span><textarea value={executionOwner} onChange={event => setExecutionOwner(event.target.value)} /></label>
      <label><span>12 · 后果落在哪里</span><textarea value={consequence} onChange={event => setConsequence(event.target.value)} /></label>
      <label><span>13 · 已观察到的同意信号</span><select value={consentSignal} onChange={event => setConsentSignal(event.target.value as ConsentSignal)}><option>明确接受建议</option><option>主动请求指导</option><option>明确拒绝或修正</option><option>沉默，无法判断</option><option>事后表示不符合期待</option><option>未询问</option></select></label>
      <label><span>14 · 中性核对后的玩家原话或意愿</span><textarea value={consentCheck} onChange={event => setConsentCheck(event.target.value)} placeholder="例如：下次希望先听选项，再自己拍板。" /></label>
      <label><span>15 · 沟通与可达条件</span><textarea value={accessCondition} onChange={event => setAccessCondition(event.target.value)} placeholder="记录语速、重叠、座位、可见性、语言、文字或辅助沟通条件。" /></label>
      <label><span>16 · 第一次权力或参与错位</span><textarea value={firstMismatch} onChange={event => setFirstMismatch(event.target.value)} /></label>
      <label><span>17 · 下一版只改变一处</span><textarea value={nextChange} onChange={event => setNextChange(event.target.value)} /></label>
      <button className="primary-button" type="submit">保存共享决定观察</button><div className="form-status" aria-live="polite">{status}</div>
    </form>
    <aside className="decision-trace-sheet shared-decision-sheet" aria-label="共享决定观察摘要"><header><span>不计算参与度</span><h2>{moment || '先冻结一个共同决定'}</h2><p>{version || '未写版本'} · {participationAgreement}<br />{playContext || '未写桌面语境'}</p></header>
      <dl><div><dt>决定归属</dt><dd>{decisionOwner || '先写本桌约定的权力分配。'}</dd></div><div><dt>信息分布</dt><dd>{informationMap || '写谁知道什么以及能否分享。'}</dd></div><div><dt>权限分布</dt><dd>{permissionMap || '分开提案、修改、否决、拍板与执行。'}</dd></div><div><dt>提案顺序</dt><dd>{proposalTrace || '按顺序记录提案。'}</dd></div><div><dt>回应轨迹</dt><dd>{responseTrace || '记录回应，不解释沉默。'}</dd></div><div><dt>最终决定</dt><dd>{finalDecision || '记录谁怎样拍板。'}</dd></div><div><dt>执行与后果</dt><dd>{executionOwner || '写谁执行。'}<br />{consequence || '写后果落在哪里。'}</dd></div><div><dt>同意核对</dt><dd>{consentSignal}：{consentCheck || '尚未中性核对。'}</dd></div><div><dt>沟通条件</dt><dd>{accessCondition || '记录节奏、位置与渠道。'}</dd></div></dl>
      <div className="decision-trace-experiment shared-decision-experiment"><span>先修权力第一次错位的位置</span><p>{firstMismatch || '比较约定与实际决定轨迹。'}</p><small>下一版只改：{nextChange || '一处信息、权限、轮次或沟通条件。'}</small></div>
      <p className="decision-trace-boundary shared-decision-boundary">一条观察只描述当前版本、玩家语境和决定。它不能诊断人格、推断沉默、证明同意，也不能把发言、领导或合作能力换算成总分。</p>
      {saved.length > 0 && <div className="decision-trace-actions shared-decision-actions"><span>已保存 {saved.length} 条共同决定观察</span><button className="text-action" type="button" onClick={exportObservations}>导出 JSON <ArrowIcon /></button></div>}
    </aside></div>
  </section>
}

function ThemeReviewTool() {
  const [saved, setSaved] = useState<ThemeReview[]>(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(THEME_REVIEW_STORAGE_KEY) || '{"schemaVersion":1,"reviews":[]}')
      return Array.isArray(stored) ? stored : stored.reviews ?? []
    } catch { return [] }
  })
  const [version, setVersion] = useState('v0.4')
  const [audienceContext, setAudienceContext] = useState('预期家庭与公共活动玩家；四人合作局；不记录个人创伤史或要求玩家解释退出原因。')
  const [themePromise, setThemePromise] = useState('让玩家看见岛屿债务、公共品与社群自治之间的冲突，并把合作不是单一最优化的体验做成可见后果。')
  const [playerPosition, setPlayerPosition] = useState('玩家扮演不同社群组织，可提案、否决与共同投资；不扮演外部债权管理者。')
  const [repeatedActions, setRepeatedActions] = useState('每轮分配公共资源、谈判政策优先级、选择接受或拒绝附带条件的债务。')
  const [rewardsAndConsequences, setRewardsAndConsequences] = useState('公共品、自治和债务是三条可冲突轨道；不设单一增长分。决定会改变后续权限，不只加减分数。')
  const [automatedOrAbsent, setAutomatedOrAbsent] = useState('债权方和自然灾害由事件自动化；移民、侨民和岛内不同地区尚未进入角色或规则，需要说明范围。')
  const [sourcesAndUncertainty, setSourcesAndUncertainty] = useState('法律权限来自官方文件；债务与公共服务数据已记日期。居民对自治的立场不可被归为单一共识，标注为多方观点。')
  const [interpretationAndInvention, setInterpretationAndInvention] = useState('“债务木筏”是设计隐喻，不是史实；三条轨道是聚焦主题的解读；角色能力为可玩性虚构。')
  const [representedPeople, setRepresentedPeople] = useState('表达当代波多黎各的多种社群组织；团队尚不能代表岛内所有政治立场。')
  const [collaborationStage, setCollaborationStage] = useState<CollaborationStage>('尚未建立协作')
  const [collaborationPlan, setCollaborationPlan] = useState('原型定型前邀请当地公共史学者与社群组织者共同复核角色、目标和奖励；付费、署名，保留分歧，不要求一次性认可。')
  const [exposureMode, setExposureMode] = useState<ThemeExposureMode>('选择并执行')
  const [exposureContent, setExposureContent] = useState('玩家会选择是否削减医疗或教育以偿付债务，并执行对公共服务轨道的后果；无写实伤亡图像。')
  const [contentNote, setContentNote] = useState('盒背、招募页与规则首页说明：玩家会扮演政策决策者，选择削减医疗/教育与应对灾后债务；内容不是情绪安全保证。')
  const [choiceExitRepair, setChoiceExitRepair] = useState('组局前可不加入“公共服务削减”模块；桌中任何人可无需解释地暂停、换牌或结束。出现伤害后先停止内容，再由当事人选择是否复盘。')
  const [firstMismatch, setFirstMismatch] = useState('主题承诺要让社群自治可玩，但当前胜利仍只由债务清零决定，公共品与自治只是过程成本。')
  const [nextAction, setNextAction] = useState('下版只改终局：债务、公共品与自治必须同时达到桌面预先选定的下限；不改事件牌。')
  const [status, setStatus] = useState('')
  useEffect(() => { localStorage.setItem(THEME_REVIEW_STORAGE_KEY, JSON.stringify({ schemaVersion: 1, reviews: saved })) }, [saved])
  const saveReview = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const required = [version, audienceContext, themePromise, playerPosition, repeatedActions, rewardsAndConsequences, automatedOrAbsent, sourcesAndUncertainty, interpretationAndInvention, representedPeople, collaborationPlan, exposureContent, contentNote, choiceExitRepair, firstMismatch, nextAction]
    if (!required.every(value => value.trim())) return setStatus('请先写完版本/语境、承诺、视角、行动/奖励/省略、来源边界、协作、暴露、告知、退出/修复、第一处不匹配与下一行动。')
    const record: ThemeReview = {
      id: crypto.randomUUID(), version: version.trim(), audienceContext: audienceContext.trim(), themePromise: themePromise.trim(), playerPosition: playerPosition.trim(),
      repeatedActions: repeatedActions.trim(), rewardsAndConsequences: rewardsAndConsequences.trim(), automatedOrAbsent: automatedOrAbsent.trim(), sourcesAndUncertainty: sourcesAndUncertainty.trim(),
      interpretationAndInvention: interpretationAndInvention.trim(), representedPeople: representedPeople.trim(), collaborationStage, collaborationPlan: collaborationPlan.trim(), exposureMode,
      exposureContent: exposureContent.trim(), contentNote: contentNote.trim(), choiceExitRepair: choiceExitRepair.trim(), firstMismatch: firstMismatch.trim(), nextAction: nextAction.trim(), createdAt: new Date().toISOString(),
    }
    setSaved(current => [record, ...current])
    setStatus('复核已保存。它不证明作品安全、无害、真实或被某个社群认可。')
  }
  const exportReviews = () => {
    const payload = { schema_version: 1, method: 'theme-commitment-and-harm-review', no_aggregate_score: true, no_safety_certification: true, reviews: saved }
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }); const url = URL.createObjectURL(blob); const anchor = document.createElement('a'); anchor.href = url; anchor.download = brandedDownloadName('主题承诺与伤害复核'); anchor.click(); URL.revokeObjectURL(url)
  }
  return <section className="tool-surface theme-review-tool"><h2>主题承诺与伤害复核</h2><p className="tool-intro">不计算伦理分或安全分。把作品声称的承诺与玩家真正扮演、重复执行、被奖励、需要暴露和可以退出的路径并排。</p>
    <aside className="decision-trace-principle theme-review-principle"><strong>记录原则</strong><p>复核作品和参与条件，不收集玩家创伤史。内容提示用于透明告知，不是安全保证；一位顾问也不代表整个文化。</p></aside>
    <div className="decision-trace-layout theme-review-layout"><form className="decision-trace-form theme-review-form" onSubmit={saveReview}>
      <div className="form-pair"><label><span>01 · 版本</span><input value={version} onChange={event => setVersion(event.target.value)} /></label><label><span>02 · 主要暴露方式</span><select value={exposureMode} onChange={event => setExposureMode(event.target.value as ThemeExposureMode)}><option>阅读/观看</option><option>管理抽象资源</option><option>选择并执行</option><option>扮演/代入</option><option>对其他玩家施加</option><option>可能点名现实经历</option><option>其他</option></select></label></div>
      <label><span>03 · 预期受众与游玩语境</span><textarea value={audienceContext} onChange={event => setAudienceContext(event.target.value)} placeholder="写受众与桌面语境；不记录真实姓名或创伤经历。" /></label>
      <label><span>04 · 一句主题承诺</span><textarea value={themePromise} onChange={event => setThemePromise(event.target.value)} placeholder="希望谁透过哪个位置看见哪种关系？" /></label>
      <label><span>05 · 玩家的可玩位置</span><textarea value={playerPosition} onChange={event => setPlayerPosition(event.target.value)} /></label>
      <label><span>06 · 每轮重复行动</span><textarea value={repeatedActions} onChange={event => setRepeatedActions(event.target.value)} /></label>
      <label><span>07 · 被奖励的结果与可见后果</span><textarea value={rewardsAndConsequences} onChange={event => setRewardsAndConsequences(event.target.value)} /></label>
      <label><span>08 · 谁/什么被自动化、资源化或省略</span><textarea value={automatedOrAbsent} onChange={event => setAutomatedOrAbsent(event.target.value)} /></label>
      <label><span>09 · 关键史料、来源与不确定性</span><textarea value={sourcesAndUncertainty} onChange={event => setSourcesAndUncertainty(event.target.value)} /></label>
      <label><span>10 · 设计解读、隐喻与虚构</span><textarea value={interpretationAndInvention} onChange={event => setInterpretationAndInvention(event.target.value)} /></label>
      <label><span>11 · 涉及的人与团队的关系</span><textarea value={representedPeople} onChange={event => setRepresentedPeople(event.target.value)} placeholder="说明具体位置，不声称代表整个社群。" /></label>
      <label><span>12 · 文化协作阶段</span><select value={collaborationStage} onChange={event => setCollaborationStage(event.target.value as CollaborationStage)}><option>不涉及具体在世社群</option><option>尚未建立协作</option><option>早期共同设计</option><option>开发中持续复核</option><option>仅末期审阅</option><option>其他</option></select></label>
      <label><span>13 · 协作对象、权限、付费、署名与分歧</span><textarea value={collaborationPlan} onChange={event => setCollaborationPlan(event.target.value)} /></label>
      <label><span>14 · 玩家具体会暴露于什么</span><textarea value={exposureContent} onChange={event => setExposureContent(event.target.value)} /></label>
      <label><span>15 · 购买/组局前的具体内容提示</span><textarea value={contentNote} onChange={event => setContentNote(event.target.value)} /></label>
      <label><span>16 · 选择、跳过、退出与修复路径</span><textarea value={choiceExitRepair} onChange={event => setChoiceExitRepair(event.target.value)} placeholder="不要求玩家解释创伤或为退出辩护。" /></label>
      <label><span>17 · 承诺与系统的第一处不匹配</span><textarea value={firstMismatch} onChange={event => setFirstMismatch(event.target.value)} /></label>
      <label><span>18 · 下一版只改或只补一件事</span><textarea value={nextAction} onChange={event => setNextAction(event.target.value)} /></label>
      <button className="primary-button" type="submit">保存复核</button><div className="form-status" aria-live="polite">{status}</div>
    </form>
    <aside className="decision-trace-sheet theme-review-sheet" aria-label="主题承诺与伤害复核摘要"><header><span>不计算伦理或安全分</span><h2>{themePromise || '先写一句主题承诺'}</h2><p>{version || '未写版本'} · {exposureMode}<br />{audienceContext || '未写受众与语境'}</p></header>
      <dl><div><dt>可玩位置</dt><dd>{playerPosition || '写玩家实际拥有的角色与权限。'}</dd></div><div><dt>行动与奖励</dt><dd>{repeatedActions || '写重复行动。'}<br />{rewardsAndConsequences || '写奖励与后果。'}</dd></div><div><dt>自动/省略</dt><dd>{automatedOrAbsent || '写谁与什么不可玩。'}</dd></div><div><dt>来源边界</dt><dd>{sourcesAndUncertainty || '分开来源和不确定性。'}<br />{interpretationAndInvention || '另列解读与虚构。'}</dd></div><div><dt>文化协作</dt><dd>{collaborationStage}：{collaborationPlan || '写谁能何时改变什么。'}</dd></div><div><dt>暴露与告知</dt><dd>{exposureContent || '写玩家会遇到什么。'}<br />{contentNote || '写透明内容提示。'}</dd></div><div><dt>选择/退出/修复</dt><dd>{choiceExitRepair || '写不需披露隐私的路径。'}</dd></div></dl>
      <div className="decision-trace-experiment theme-review-experiment"><span>先修承诺第一次脱离行动的位置</span><p>{firstMismatch || '比较承诺与可玩角色、奖励和省略。'}</p><small>下一步：{nextAction || '一处系统改动、研究或协作行动。'}</small></div>
      <p className="decision-trace-boundary theme-review-boundary">本记录不证明作品安全、无害、准确或被某个社群认可。它不收集玩家创伤经历，也不将顾问意见变成一次性背书。</p>
      {saved.length > 0 && <div className="decision-trace-actions theme-review-actions"><span>已保存 {saved.length} 条复核</span><button className="text-action" type="button" onClick={exportReviews}>导出 JSON <ArrowIcon /></button></div>}
    </aside></div>
  </section>
}

function defaultRouteResponsibilities(): RouteResponsibility[] {
  const rows: Array<Omit<RouteResponsibility, 'id'>> = [
    { area: '游戏设计与开发', scope: '完成规则、原型、测试与开发记录；说明交给下一方的版本。', owner: '我/我的团队', evidence: '已完成实测', sourceAndDate: '当前原型与测试记录；待补版本日期。', uncovered: '尚未确认何时视为可投稿或可发布。' },
    { area: '美术、图形、规则编辑与产品化', scope: '确认插画、图形设计、编辑、排版与可交付文件分别由谁完成。', owner: '未定', evidence: '尚未核验', sourceAndDate: '待查目标路线的文件要求与交付清单。', uncovered: '预算、授权范围、修改轮次和最终文件所有权未定。' },
    { area: '权利、合同、署名与许可', scope: '列出原创、共同创作、字体、图片、IP 与合同中的授权或转让范围。', owner: '我/我的团队', evidence: '尚未核验', sourceAndDate: '待建立权利来源表，并在签署前取得专业审阅。', uncovered: '地域、语言、期限、续作、回转与终止条件未定。' },
    { area: '生产、样品、质检与安全', scope: '决定是否有实体产品，以及谁负责规格、样品门、量产、抽检和适用要求。', owner: '未定', evidence: '尚未核验', sourceAndDate: '本路线尚未取得书面生产范围。', uncovered: '样品批准权、缺陷标准、替换责任和地区要求未定。' },
    { area: '受众、营销、展示与销售', scope: '说明谁找到受众、维护页面、参加活动、处理渠道与对外承诺。', owner: '我/我的团队', evidence: '尚未核验', sourceAndDate: '待验证受众与目标入口，不把平台上架等同于需求。', uncovered: '现有受众、素材、档期、渠道折扣与持续劳动未定。' },
    { area: '预算、收款、税务与合规协调', scope: '标明谁编制全项目预算、收款、留存记录，并协调税务和合规专业意见。', owner: '我/我的团队', evidence: '尚未核验', sourceAndDate: '待按当前地区、主体与路线向专业人员核对。', uncovered: '平台费用、退款、税费、汇率、现金时点和误差储备未定。' },
    { area: '货运、仓储、履约、替换与客服', scope: '从完成生产或生成文件开始，写到接收者真正收到并能使用为止。', owner: '未定', evidence: '尚未核验', sourceAndDate: '待取得仓储、包材、运费、地址、追踪和异常处理范围。', uncovered: '延误、丢失、破损、退件、替换、隐私和客服工时未定。' },
    { area: '版本、勘误、更新与撤回', scope: '说明发布后谁维护规则、数字文件、勘误、旧链接、通知与必要撤回。', owner: '我/我的团队', evidence: '尚未核验', sourceAndDate: '待核对平台更新能力、合同控制权与玩家联系入口。', uncovered: '更新时限、多语言同步、历史版本和停止支持条件未定。' },
  ]
  return rows.map(row => ({ id: crypto.randomUUID(), ...row }))
}

function PublishingRouteMapTool() {
  const [saved, setSaved] = useState<PublishingRouteMap[]>(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(PUBLISHING_ROUTE_STORAGE_KEY) || '{"schemaVersion":1,"maps":[]}')
      return Array.isArray(stored) ? stored : stored.maps ?? []
    } catch { return [] }
  })
  const [version, setVersion] = useState('v0.9')
  const [route, setRoute] = useState<PublishingRoute>('投出版社/授权')
  const [receiverAction, setReceiverAction] = useState('目标出版方能在 8 分钟内判断游戏是否符合其产品线，并决定是否请求进一步材料或原型。')
  const [routeReason, setRouteReason] = useState('希望保留设计与开发工作，把生产、渠道和履约交给具备对应能力的合作方；先验证匹配，不假定一定签约。')
  const [nonNegotiable, setNonNegotiable] = useState('保留设计者署名；任何主题与核心玩家位置的重大改变都需共同确认。')
  const [currentOfferOrCommitment, setCurrentOfferOrCommitment] = useState('尚未公开承诺发售、价格、内容物或日期；当前只进行定向投稿准备。')
  const [rightsState, setRightsState] = useState('核心设计为单人原创；临时美术仅用于内部原型，未取得商业使用许可，不随投稿包传播。')
  const [moneyInventoryExposure, setMoneyInventoryExposure] = useState('本阶段只承担样机和展示材料成本；未收款、未下量产单、未形成库存。')
  const [currentRequirements, setCurrentRequirements] = useState('待选择 3 家当前仍接收此类游戏的出版方；逐家记录官网链接、核验日期、类型匹配、所需材料和是否允许主动寄样。')
  const [gate, setGate] = useState<RouteGate>('核对投稿')
  const [gateQuestion, setGateQuestion] = useState('这家出版方当前是否接收本游戏的人数、年龄、时长、主题与复杂度，并允许以其指定格式投稿？')
  const [nextEvidence, setNextEvidence] = useState('先核验一家目标出版方的当前官网投稿页，保存链接、日期与格式要求；未被请求前不寄原型。')
  const [exitCondition, setExitCondition] = useState('若连续 6 个经过匹配核验的投稿均被拒，或要求触碰不可谈条件，则回到目标与责任表，比较 POD 或小批路线，不直接下量产单。')
  const [responsibilities, setResponsibilities] = useState<RouteResponsibility[]>(defaultRouteResponsibilities)
  const [status, setStatus] = useState('')
  useEffect(() => { localStorage.setItem(PUBLISHING_ROUTE_STORAGE_KEY, JSON.stringify({ schemaVersion: 1, maps: saved })) }, [saved])

  const updateResponsibility = <K extends keyof Omit<RouteResponsibility, 'id'>>(id: string, field: K, value: RouteResponsibility[K]) => {
    setResponsibilities(current => current.map(item => item.id === id ? { ...item, [field]: value } : item))
  }
  const saveMap = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const required = [version, receiverAction, routeReason, nonNegotiable, currentOfferOrCommitment, rightsState, moneyInventoryExposure, currentRequirements, gateQuestion, nextEvidence, exitCondition]
    const rowsComplete = responsibilities.every(item => [item.area, item.scope, item.sourceAndDate, item.uncovered].every(value => value.trim()))
    if (!required.every(value => value.trim()) || !rowsComplete) return setStatus('请先写完路线目标、承诺、权利、暴露、当前要求、关卡问题、退出条件，以及八类责任的范围、来源和未覆盖项。')
    const record: PublishingRouteMap = {
      id: crypto.randomUUID(), version: version.trim(), route, receiverAction: receiverAction.trim(), routeReason: routeReason.trim(), nonNegotiable: nonNegotiable.trim(),
      currentOfferOrCommitment: currentOfferOrCommitment.trim(), rightsState: rightsState.trim(), moneyInventoryExposure: moneyInventoryExposure.trim(), currentRequirements: currentRequirements.trim(),
      gate, gateQuestion: gateQuestion.trim(), nextEvidence: nextEvidence.trim(), exitCondition: exitCondition.trim(),
      responsibilities: responsibilities.map(item => ({ ...item, area: item.area.trim(), scope: item.scope.trim(), sourceAndDate: item.sourceAndDate.trim(), uncovered: item.uncovered.trim() })),
      createdAt: new Date().toISOString(),
    }
    setSaved(current => [record, ...current])
    setStatus('发布路线责任图已保存。它不排名路线，也不预测签约、销量、利润或交付成功。')
  }
  const exportMaps = () => {
    const payload = { schema_version: 1, method: 'publishing-route-responsibility-map', no_route_ranking: true, not_legal_or_financial_advice: true, platform_rules_require_recheck: true, maps: saved }
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }); const url = URL.createObjectURL(blob); const anchor = document.createElement('a'); anchor.href = url; anchor.download = brandedDownloadName('发布路线责任图'); anchor.click(); URL.revokeObjectURL(url)
  }
  const unknownOwners = responsibilities.filter(item => item.owner === '未定').length
  const unknownEvidence = responsibilities.filter(item => item.evidence === '尚未核验').length
  return <section className="tool-surface route-map-tool"><h2>发布路线责任图</h2><p className="tool-intro">不问哪条路线“最好”。先写接收者要完成的动作，再看设计、权利、生产、销售、资金与履约究竟由谁承担。</p>
    <aside className="decision-trace-principle route-map-principle"><strong>记录原则</strong><p>平台、出版方或供应商不是自动的责任接收者。只有当前官网要求、书面沟通、合同条款或已完成实测，才能把“应该会负责”升级为证据。</p></aside>
    <div className="decision-trace-layout route-map-layout"><form className="decision-trace-form route-map-form" onSubmit={saveMap}>
      <div className="form-pair"><label><span>01 · 版本</span><input value={version} onChange={event => setVersion(event.target.value)} /></label><label><span>02 · 当前路线</span><select value={route} onChange={event => setRoute(event.target.value as PublishingRoute)}><option>投出版社/授权</option><option>免费/付费 PnP</option><option>POD/平台商店</option><option>库存自出版</option><option>众筹后生产</option><option>比赛/展示</option><option>混合路线</option></select></label></div>
      <label><span>03 · 下一位接收者要完成什么动作</span><textarea value={receiverAction} onChange={event => setReceiverAction(event.target.value)} /></label>
      <label><span>04 · 为什么选择这组工作与责任</span><textarea value={routeReason} onChange={event => setRouteReason(event.target.value)} /></label>
      <label><span>05 · 不可谈条件</span><textarea value={nonNegotiable} onChange={event => setNonNegotiable(event.target.value)} /></label>
      <label><span>06 · 已经对公众或合作方承诺了什么</span><textarea value={currentOfferOrCommitment} onChange={event => setCurrentOfferOrCommitment(event.target.value)} placeholder="区分愿望、页面文案、已收款承诺与合同义务。" /></label>
      <label><span>07 · 权利与许可当前状态</span><textarea value={rightsState} onChange={event => setRightsState(event.target.value)} /></label>
      <label><span>08 · 资金与库存暴露</span><textarea value={moneyInventoryExposure} onChange={event => setMoneyInventoryExposure(event.target.value)} placeholder="写已经支付、收取、订购或承诺的状态，不写销量预测。" /></label>
      <label><span>09 · 当前官方要求、链接与核验日期</span><textarea value={currentRequirements} onChange={event => setCurrentRequirements(event.target.value)} /></label>
      <fieldset className="production-components route-responsibilities"><legend>10 · 八类责任逐项落主</legend>
        <div className="production-component-list route-responsibility-list">{responsibilities.map((item, index) => <section className="production-component-row route-responsibility-row" key={item.id} aria-label={`责任 ${index + 1}`}>
          <div className="production-row-head"><strong>{String(index + 1).padStart(2, '0')} · {item.area}</strong><span className={item.owner === '未定' || item.evidence === '尚未核验' ? 'route-status is-unknown' : 'route-status'}>{item.owner} · {item.evidence}</span></div>
          <label><span>这条路线中的具体范围</span><textarea value={item.scope} onChange={event => updateResponsibility(item.id, 'scope', event.target.value)} /></label>
          <div className="form-pair"><label><span>当前责任人</span><select value={item.owner} onChange={event => updateResponsibility(item.id, 'owner', event.target.value as RouteOwner)}><option>我/我的团队</option><option>共同创作者</option><option>出版方</option><option>平台</option><option>外包/供应商</option><option>生产方</option><option>履约/仓储方</option><option>专业顾问</option><option>未定</option></select></label><label><span>责任证据</span><select value={item.evidence} onChange={event => updateResponsibility(item.id, 'evidence', event.target.value as RouteEvidence)}><option>尚未核验</option><option>官网当前要求</option><option>书面沟通</option><option>合同/服务条款</option><option>已完成实测</option></select></label></div>
          <label><span>来源、链接/文件、日期与对应版本</span><textarea value={item.sourceAndDate} onChange={event => updateResponsibility(item.id, 'sourceAndDate', event.target.value)} /></label>
          <label><span>仍未覆盖的工作、例外或风险</span><textarea value={item.uncovered} onChange={event => updateResponsibility(item.id, 'uncovered', event.target.value)} /></label>
        </section>)}</div>
      </fieldset>
      <div className="form-pair"><label><span>11 · 当前决策关卡</span><select value={gate} onChange={event => setGate(event.target.value as RouteGate)}><option>确认目标</option><option>核对投稿</option><option>请求样品</option><option>审阅合作/合同</option><option>验证需求</option><option>冻结众筹前预算</option><option>核对履约</option><option>发布入口盲测</option></select></label><label><span>12 · 通过关卡前只回答什么</span><textarea value={gateQuestion} onChange={event => setGateQuestion(event.target.value)} /></label></div>
      <label><span>13 · 下一条最小证据</span><textarea value={nextEvidence} onChange={event => setNextEvidence(event.target.value)} /></label>
      <label><span>14 · 何时停下、改路或重新分配责任</span><textarea value={exitCondition} onChange={event => setExitCondition(event.target.value)} /></label>
      <button className="primary-button" type="submit">保存责任图</button><div className="form-status" aria-live="polite">{status}</div>
    </form>
    <aside className="decision-trace-sheet route-map-sheet" aria-label="发布路线责任摘要"><header><span>不排名，不预测收益</span><h2>{receiverAction || '先写下一位接收者要完成的动作'}</h2><p>{version || '未写版本'} · {route}<br />当前有 {unknownOwners} 类责任人未定，{unknownEvidence} 类责任尚未核验。</p></header>
      <dl><div><dt>路线理由</dt><dd>{routeReason || '写你愿意承担哪一组工作。'}</dd></div><div><dt>不可谈条件</dt><dd>{nonNegotiable || '把偏好与真正不可谈条件分开。'}</dd></div><div><dt>公开承诺</dt><dd>{currentOfferOrCommitment || '写已经说出、收款或签署的承诺。'}</dd></div><div><dt>权利状态</dt><dd>{rightsState || '列出原创、共同创作和第三方素材。'}</dd></div><div><dt>资金/库存</dt><dd>{moneyInventoryExposure || '写已经发生的暴露。'}</dd></div><div><dt>当前要求</dt><dd>{currentRequirements || '用当前官方页面和核验日期记录。'}</dd></div><div><dt>责任覆盖</dt><dd>{responsibilities.map(item => <span className="production-component-summary route-responsibility-summary" key={item.id}><strong>{item.area}</strong>：{item.owner} · {item.evidence}<br />未覆盖：{item.uncovered || '尚未写。'}</span>)}</dd></div></dl>
      <div className="decision-trace-experiment route-map-experiment"><span>{gate} · 先回答一件事</span><p>{gateQuestion || '写通过当前关卡前必须回答的问题。'}</p><small>下一条证据：{nextEvidence || '回到当前官方要求、书面范围、合同或实测。'}<br />退出条件：{exitCondition || '先写何时停下或换路。'}</small></div>
      <p className="decision-trace-boundary route-map-boundary">这张责任图不判断哪条路线更好，不预测签约、销量、利润或履约成功，也不提供合同、法律、税务、金融或合规结论。平台规则、投稿状态与服务范围必须按行动日期重新核验。</p>
      {saved.length > 0 && <div className="decision-trace-actions route-map-actions"><span>已保存 {saved.length} 份责任图</span><button className="text-action" type="button" onClick={exportMaps}>导出 JSON <ArrowIcon /></button></div>}
    </aside></div>
  </section>
}

function TeachingPathTool() {
  const [saved, setSaved] = useState<TeachingPath[]>(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(TEACHING_PATH_STORAGE_KEY) || '{"schemaVersion":1,"paths":[]}')
      return Array.isArray(stored) ? stored : stored.paths ?? []
    } catch { return [] }
  })
  const [version, setVersion] = useState('v0.9')
  const [taskType, setTaskType] = useState<LearningTaskType>('第一次决定')
  const [learnerContext, setLearnerContext] = useState('两名第一次接触项目、熟悉轻中策桌游的中文玩家；实体同桌。')
  const [primarySurface, setPrimarySurface] = useState<LearningSurface>('混合')
  const [targetAction, setTargetAction] = useState('玩家能看懂一座港口的需求，选择一件货物并完成一次合法交货。')
  const [knowNow, setKnowNow] = useState('交货目标、港口需求、货舱里的货物，以及交货后立即获得的金币。')
  const [deferUntilLater, setDeferUntilLater] = useState('套装分在首轮结算时再引入；货舱溢出在第一次装满时指向查询入口。')
  const [deliveryPath, setDeliveryPath] = useState('一句目标 → 指出港口需求 → 演示交货动作 → 玩家自己完成一次 → 在个人辅助确认收入。')
  const [practiceMoment, setPracticeMoment] = useState('使用可重置的公开局面，让玩家移动一枚货物并自己更新金币。')
  const [recoveryPath, setRecoveryPath] = useState('玩家问“船装满怎么办”时，从个人辅助的容量图标进入，再按“货舱已满”找到弃置规则。')
  const [successSignal, setSuccessSignal] = useState('玩家不经提示指出一个合法港口、移动正确货物并更新金币；卡住时能从辅助找到容量处理。')
  const [firstDivergence, setFirstDivergence] = useState('')
  const [lookupTrace, setLookupTrace] = useState('')
  const [facilitatorIntervention, setFacilitatorIntervention] = useState('')
  const [nextChange, setNextChange] = useState('只给订单背面增加与组件表一致的“订单”标签，其余教学和规则不变。')
  const [status, setStatus] = useState('')
  useEffect(() => { localStorage.setItem(TEACHING_PATH_STORAGE_KEY, JSON.stringify({ schemaVersion: 1, paths: saved })) }, [saved])
  const savePath = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (![version, learnerContext, targetAction, knowNow, deliveryPath, practiceMoment, recoveryPath, successSignal, firstDivergence, nextChange].every(value => value.trim())) return setStatus('请先写完版本、玩家语境、目标动作、现在要知道、教学路径、实践、恢复入口、成功动作、第一次偏离和下一改动。')
    const record: TeachingPath = {
      id: crypto.randomUUID(), version: version.trim(), taskType, learnerContext: learnerContext.trim(), primarySurface,
      targetAction: targetAction.trim(), knowNow: knowNow.trim(), deferUntilLater: deferUntilLater.trim(), deliveryPath: deliveryPath.trim(),
      practiceMoment: practiceMoment.trim(), recoveryPath: recoveryPath.trim(), successSignal: successSignal.trim(), firstDivergence: firstDivergence.trim(),
      lookupTrace: lookupTrace.trim(), facilitatorIntervention: facilitatorIntervention.trim(), nextChange: nextChange.trim(), createdAt: new Date().toISOString(),
    }
    setSaved(current => [record, ...current])
    setStatus('学习路径已保存。它记录当前任务，不给玩家或规则打理解分。')
  }
  const exportPaths = () => {
    const payload = { schema_version: 1, method: 'single-learning-task-path', no_aggregate_score: true, paths: saved }
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }); const url = URL.createObjectURL(blob); const anchor = document.createElement('a'); anchor.href = url; anchor.download = brandedDownloadName('单任务学习路径'); anchor.click(); URL.revokeObjectURL(url)
  }
  return <section className="tool-surface teaching-tool"><h2>单任务学习路径</h2><p className="tool-intro">不问“玩家懂了吗”。冻结一个学习任务，把现在要知道、立即行动、卡住时的恢复入口和第一次偏离连成一条路径。</p>
    <aside className="teaching-principle"><strong>诊断原则</strong><p>教学是让玩家开始行动，查询是让玩家从卡点恢复。两者可以共用规则源，但要分别记录入口；本工具不生成理解分或媒介排名。</p></aside>
    <div className="teaching-layout"><form className="teaching-form" onSubmit={savePath}>
      <div className="form-pair"><label><span>01 · 版本</span><input value={version} onChange={event => setVersion(event.target.value)} /></label><label><span>02 · 一个学习任务</span><select value={taskType} onChange={event => setTaskType(event.target.value as LearningTaskType)}><option>设置</option><option>第一次决定</option><option>完整回合</option><option>规则查询</option><option>反向教学</option><option>中断后恢复</option></select></label></div>
      <label><span>03 · 玩家与使用语境</span><textarea value={learnerContext} onChange={event => setLearnerContext(event.target.value)} placeholder="写桌游经验、语言、人数、媒介与必要的可访问性语境。" /></label>
      <label><span>04 · 主要教学媒介</span><select value={primarySurface} onChange={event => setPrimarySurface(event.target.value as LearningSurface)}><option>口头讲解</option><option>规则书</option><option>玩家辅助</option><option>组件/桌面</option><option>交互教程</option><option>视频</option><option>混合</option></select></label>
      <label><span>05 · 玩家要完成的可观察动作</span><textarea value={targetAction} onChange={event => setTargetAction(event.target.value)} /></label>
      <label><span>06 · 现在必须知道</span><textarea value={knowNow} onChange={event => setKnowNow(event.target.value)} placeholder="只写完成当前动作所需的目标、对象、步骤和反馈。" /></label>
      <label><span>07 · 可以延后到何时</span><textarea value={deferUntilLater} onChange={event => setDeferUntilLater(event.target.value)} placeholder="写少见例外、完整计分或策略建议在哪个真实时刻再出现。" /></label>
      <label><span>08 · 从解释到行动的路径</span><textarea value={deliveryPath} onChange={event => setDeliveryPath(event.target.value)} /></label>
      <label><span>09 · 一次可重置的桌面实践</span><textarea value={practiceMoment} onChange={event => setPracticeMoment(event.target.value)} /></label>
      <label><span>10 · 卡住时的查询与恢复入口</span><textarea value={recoveryPath} onChange={event => setRecoveryPath(event.target.value)} /></label>
      <label><span>11 · 可观察的成功动作</span><textarea value={successSignal} onChange={event => setSuccessSignal(event.target.value)} placeholder="不要写‘理解’或‘清楚’，写实际执行和恢复。" /></label>
      <label><span>12 · 第一次偏离</span><textarea value={firstDivergence} onChange={event => setFirstDivergence(event.target.value)} placeholder="记录最早的错误动作、停顿、猜测或换词，不先解释原因。" /></label>
      <label><span>13 · 实际查看与恢复路径（可选）</span><textarea value={lookupTrace} onChange={event => setLookupTrace(event.target.value)} placeholder="先看哪里、用什么词、误入哪里、最后是否找到并执行答案？" /></label>
      <label><span>14 · 主持人介入（可选）</span><textarea value={facilitatorIntervention} onChange={event => setFacilitatorIntervention(event.target.value)} placeholder="何时提供了什么提示？介入后的完成不能称为独立完成。" /></label>
      <label><span>15 · 下一版只改变一处</span><textarea value={nextChange} onChange={event => setNextChange(event.target.value)} /></label>
      <button className="primary-button" type="submit">保存学习路径</button><div className="form-status" aria-live="polite">{status}</div>
    </form>
    <aside className="teaching-sheet" aria-label="单任务学习路径摘要"><header><span>不生成理解分</span><h2>{targetAction || '先写一个可观察动作'}</h2><p>{version || '未写版本'} · {taskType} · {primarySurface}</p></header>
      <dl><div><dt>玩家语境</dt><dd>{learnerContext || '先写谁在什么条件下学习。'}</dd></div><div><dt>现在要知道</dt><dd>{knowNow || '只保留完成当前动作需要的信息。'}</dd></div><div><dt>延后信息</dt><dd>{deferUntilLater || '说明剩余信息何时再出现。'}</dd></div><div><dt>教学路径</dt><dd>{deliveryPath || '把解释、演示和行动连起来。'}</dd></div><div><dt>桌面实践</dt><dd>{practiceMoment || '安排一次可重置动作。'}</dd></div><div><dt>恢复入口</dt><dd>{recoveryPath || '写玩家卡住时从哪里开始查。'}</dd></div><div><dt>成功动作</dt><dd>{successSignal || '写执行和恢复，不写总体理解。'}</dd></div></dl>
      <div className="teaching-experiment"><span>先修最早的偏离</span><p>{firstDivergence || '测试后记录第一次偏离。'}</p><small>{lookupTrace ? `实际路径：${lookupTrace}` : '尚未记录实际查询路径。'}{facilitatorIntervention ? ` 主持人介入：${facilitatorIntervention}` : ''}<br />下一版只改：{nextChange || '一处上游信息。'}</small></div>
      <p className="teaching-boundary">这张路径只能描述当前版本、玩家语境、学习任务和媒介组合。它不能证明所有玩家都会学会，也不能把纸质、视频或数字教程排成通用优先级。</p>
      {saved.length > 0 && <div className="teaching-actions"><span>已保存 {saved.length} 条学习路径</span><button className="text-action" type="button" onClick={exportPaths}>导出 JSON <ArrowIcon /></button></div>}
    </aside></div>
  </section>
}

function AccessibilityObservationTool() {
  const [saved, setSaved] = useState<AccessibilityObservation[]>(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(ACCESSIBILITY_STORAGE_KEY) || '{"schemaVersion":1,"observations":[]}')
      const observations = Array.isArray(stored) ? stored : stored.observations ?? []
      return observations.map((observation: AccessibilityObservation) => ({ ...observation, barrier: typeof observation.barrier === 'string' ? observation.barrier : '' }))
    } catch { return [] }
  })
  const [version, setVersion] = useState('v0.7')
  const [medium, setMedium] = useState<AccessibilityObservation['medium']>('实体')
  const [task, setTask] = useState('玩家坐在长边，从自己的位置读取三座港口需求，并选择一座交货。')
  const [observedAction, setObservedAction] = useState('')
  const [dimension, setDimension] = useState<AccessibilityDimension>('视觉与色觉')
  const [componentFunction, setComponentFunction] = useState<ComponentFunction>('公共状态')
  const [barrier, setBarrier] = useState('')
  const [playerStrategy, setPlayerStrategy] = useState('')
  const [assistance, setAssistance] = useState('')
  const [assistanceTradeoff, setAssistanceTradeoff] = useState('')
  const [playerVoice, setPlayerVoice] = useState('')
  const [proposedExperiment, setProposedExperiment] = useState('')
  const [successSignal, setSuccessSignal] = useState('')
  const [status, setStatus] = useState('')
  useEffect(() => { localStorage.setItem(ACCESSIBILITY_STORAGE_KEY, JSON.stringify({ schemaVersion: 2, observations: saved })) }, [saved])
  const saveObservation = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (![version, task, observedAction, barrier, proposedExperiment, successSignal].every(value => value.trim())) return setStatus('请先写完版本、具体任务、实际动作、暂定障碍、下一次实验和成功信号。')
    if (assistance.trim() && !assistanceTradeoff.trim()) return setStatus('记录了外部协助时，也要写它是否暴露信息、代替决定、增加时间或改变体验。')
    const record: AccessibilityObservation = {
      id: crypto.randomUUID(), version: version.trim(), medium, task: task.trim(), observedAction: observedAction.trim(), dimension, componentFunction,
      barrier: barrier.trim(), playerStrategy: playerStrategy.trim(), assistance: assistance.trim(), assistanceTradeoff: assistanceTradeoff.trim(), playerVoice: playerVoice.trim(),
      proposedExperiment: proposedExperiment.trim(), successSignal: successSignal.trim(), createdAt: new Date().toISOString(),
    }
    setSaved(current => [record, ...current])
    setStatus('任务观察已保存。它是当前语境的证据，不是整款游戏的无障碍分数。')
  }
  const exportObservations = () => {
    const payload = { schema_version: 2, method: 'task-based-accessibility-observation', no_aggregate_score: true, observations: saved }
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }); const url = URL.createObjectURL(blob); const anchor = document.createElement('a'); anchor.href = url; anchor.download = brandedDownloadName('任务无障碍观察'); anchor.click(); URL.revokeObjectURL(url)
  }
  return <section className="tool-surface accessibility-tool"><h2>任务无障碍观察</h2><p className="tool-intro">不从诊断猜需求，也不给游戏打总分。记录一个玩家在一个任务中的实际动作、协助与代价，再复测一个改变。</p>
    <aside className="accessibility-principle"><strong>观察原则</strong><p>能在帮助下完成，不等于能够自主完成。维度只是检索入口；一个适配也可能制造新的操作、沟通、认知、隐私、时间或成本障碍。</p></aside>
    <div className="accessibility-layout"><form className="accessibility-form" onSubmit={saveObservation}>
      <div className="form-pair"><label><span>01 · 版本</span><input value={version} onChange={event => setVersion(event.target.value)} /></label><label><span>02 · 测试媒介</span><select value={medium} onChange={event => setMedium(event.target.value as AccessibilityObservation['medium'])}><option>实体</option><option>线上</option><option>混合</option></select></label></div>
      <label><span>03 · 一个具体任务</span><textarea value={task} onChange={event => setTask(event.target.value)} placeholder="谁在什么位置，要识别、设置、操作、查询或沟通什么？" /></label>
      <label><span>04 · 实际发生的动作</span><textarea value={observedAction} onChange={event => setObservedAction(event.target.value)} placeholder="记录停顿、靠近、旋转、误拿、询问、跳过或使用辅助技术，不先写原因。" /></label>
      <div className="form-pair"><label><span>05 · 障碍观察维度</span><select value={dimension} onChange={event => setDimension(event.target.value as AccessibilityDimension)}><option>视觉与色觉</option><option>操作与触达</option><option>认知与记忆</option><option>规则与语言</option><option>沟通与听觉</option><option>情绪与安全</option><option>社会与经济</option></select></label><label><span>06 · 受影响的功能</span><select value={componentFunction} onChange={event => setComponentFunction(event.target.value as ComponentFunction)}><option>公共状态</option><option>私人状态</option><option>随机器</option><option>计数器</option><option>空间关系</option><option>规则查询</option><option>沟通流程</option><option>其他</option></select></label></div>
      <label><span>07 · 暂定的障碍描述</span><textarea value={barrier} onChange={event => setBarrier(event.target.value)} placeholder="描述任务要求与当前设计的错配，不写诊断或人格解释。" /></label>
      <label><span>08 · 玩家自己的策略或辅助技术（可选）</span><textarea value={playerStrategy} onChange={event => setPlayerStrategy(event.target.value)} placeholder="例如：转动板块、使用放大镜、读屏、记忆位置。" /></label>
      <label><span>09 · 他人提供的协助（可选）</span><textarea value={assistance} onChange={event => setAssistance(event.target.value)} placeholder="谁替玩家读取、移动、提醒或决定了什么？" /></label>
      <label><span>10 · 协助与适配代价</span><textarea value={assistanceTradeoff} onChange={event => setAssistanceTradeoff(event.target.value)} placeholder="是否暴露信息、代替决定、增加时间/费用，或把制作与寻找帮助的劳动推给玩家？" /></label>
      <label><span>11 · 玩家原话（可选）</span><textarea value={playerVoice} onChange={event => setPlayerVoice(event.target.value)} placeholder="只在获得同意且确有价值时记录简短原话。" /></label>
      <label><span>12 · 下一版只改变一个条件</span><textarea value={proposedExperiment} onChange={event => setProposedExperiment(event.target.value)} placeholder="例如：颜色旁增加可从任意方向识别的形状，其余规则不变。" /></label>
      <label><span>13 · 用同一任务复测的成功信号</span><textarea value={successSignal} onChange={event => setSuccessSignal(event.target.value)} placeholder="写可观察动作，不写‘更无障碍’。" /></label>
      <button className="primary-button" type="submit">保存任务观察</button><div className="form-status" aria-live="polite">{status}</div>
    </form>
    <aside className="accessibility-sheet" aria-label="任务无障碍观察摘要"><header><span>不生成总分</span><h2>{task || '先写一个具体任务'}</h2><p>{version || '未写版本'} · {medium} · {dimension}</p></header>
      <dl><div><dt>实际动作</dt><dd>{observedAction || '先记录可观察动作，不先解释原因。'}</dd></div><div><dt>受影响功能</dt><dd>{componentFunction}</dd></div><div><dt>暂定障碍</dt><dd>{barrier || '把任务要求与当前设计的错配写在这里。'}</dd></div><div><dt>玩家策略</dt><dd>{playerStrategy || '尚未记录；不要默认玩家没有自己的适配方式。'}</dd></div><div><dt>外部协助</dt><dd>{assistance || '本次尚未记录外部协助。'}</dd></div><div><dt>协助与适配代价</dt><dd>{assistanceTradeoff || (assistance ? '有协助时必须补写代价。' : '没有外部协助，仍可记录时间、疲劳、费用或适配劳动。')}</dd></div>{playerVoice && <div><dt>玩家原话</dt><dd>{playerVoice}</dd></div>}</dl>
      <div className="accessibility-experiment"><span>下一次只验证</span><p>{proposedExperiment || '写一个单一改变。'}</p><small>成功信号：{successSignal || '用同一任务写可观察的成功信号。'}</small></div>
      <p className="accessibility-boundary">这张观察单只能描述当前玩家、版本、媒介与任务。它不能替代共同设计、真实残障玩家测试，也不能推出整款游戏或全部玩家的无障碍结论。</p>
      {saved.length > 0 && <div className="accessibility-actions"><span>已保存 {saved.length} 条任务观察</span><button className="text-action" type="button" onClick={exportObservations}>导出 JSON <ArrowIcon /></button></div>}
    </aside></div>
  </section>
}

function ActiveTool({ tool, onTool, onOpenTest, onCopyProjectNextAction }: { tool: DesignToolId; onTool: (tool: DesignToolId) => void; onOpenTest: () => void; onCopyProjectNextAction: (nextAction: string) => void }) {
  if (tool === 'experience-intent') return <Suspense fallback={<section className="tool-surface"><h2>体验意图卡</h2><p className="tool-intro" role="status">体验意图卡正在加载……</p></section>}><ExperienceIntentCard onContinue={() => onTool('core-loop')} /></Suspense>
  if (tool === 'core-loop') return <Suspense fallback={<section className="tool-surface"><h2>核心循环画布</h2><p className="tool-intro" role="status">核心循环画布正在加载……</p></section>}><CoreLoopCanvas onContinue={() => onTool('prototype-scope')} /></Suspense>
  if (tool === 'redesign') return <RedesignLab />
  if (tool === 'constraint-deck') return <ConstraintDeck />
  if (tool === 'balance-pass') return <BalancePassTool />
  if (tool === 'decision-trace') return <DecisionTraceTool />
  if (tool === 'shared-decision') return <SharedDecisionTool />
  if (tool === 'theme-review') return <ThemeReviewTool />
  if (tool === 'production-ledger') return <Suspense fallback={<section className="tool-surface"><h2>生产假设账本</h2><p className="tool-intro" role="status">生产假设账本正在加载……</p></section>}><ProductionLedgerTool /></Suspense>
  if (tool === 'route-map') return <PublishingRouteMapTool />
  if (tool === 'teaching-path') return <TeachingPathTool />
  if (tool === 'playtest-selector') return <PlaytestSelector />
  if (tool === 'accessibility-observation') return <AccessibilityObservationTool />
  if (tool === 'version-governance') return <Suspense fallback={<section className="tool-surface"><h2>让旧版玩家找到今天该用哪一份文字</h2><p className="tool-intro" role="status">内容版本治理工作台正在加载……</p></section>}><VersionGovernanceWorkbench /></Suspense>
  if (tool === 'prototype-scope') return <Suspense fallback={<section className="tool-surface"><h2>只做这一轮问题需要的原型</h2><p className="tool-intro" role="status">原型范围裁剪器正在加载……</p></section>}><PrototypeScopeCutter onContinue={onOpenTest} /></Suspense>
  if (tool === 'playtest-session') return <Suspense fallback={<section className="tool-surface"><h2>现场测试记录</h2><p className="tool-intro" role="status">会话记录正在加载……</p></section>}><PlaytestSessionRecorder onOpenPlan={onOpenTest} onReview={() => onTool('feedback')} /></Suspense>
  if (tool === 'evidence-synthesis') return <Suspense fallback={<section className="tool-surface"><h2>发现演化与版本证据</h2><p className="tool-intro" role="status">跨轮证据正在加载……</p></section>}><EvidenceSynthesisWorkbench onOpenReview={() => onTool('feedback')} onCopyProjectNextAction={onCopyProjectNextAction} /></Suspense>
  if (tool === 'issue-to-system') return <Suspense fallback={<section className="tool-surface"><h2>让玩家在系统里碰到议题</h2><p className="tool-intro" role="status">议题到系统工作台正在加载……</p></section>}><IssueToSystemWorkbench /></Suspense>
  return <Suspense fallback={<section className="tool-surface"><h2>证据复盘与变更简报</h2><p className="tool-intro" role="status">复盘工作台正在加载……</p></section>}><EvidenceReviewWorkbench onOpenSession={() => onTool('playtest-session')} onCopyProjectNextAction={onCopyProjectNextAction} onSynthesize={() => onTool('evidence-synthesis')} /></Suspense>
}

function ToolsView({ tool, onTool, onBack, backLabel, onOpenTest, onCopyProjectNextAction }: { tool: DesignToolId; onTool: (tool: DesignToolId) => void; onBack: () => void; backLabel: string; onOpenTest: () => void; onCopyProjectNextAction: (nextAction: string) => void }) {
  return <main className="content-page tool-page" id="main-content" tabIndex={-1}>
    <button className="resource-start-back" type="button" onClick={onBack}>{backLabel}</button>
    <p className="tool-context-kicker">配套工作单</p>
    <h1>{toolTitles[tool]}</h1>
    <p className="lede">只完成当前资料需要的这一份产出。完成后回到原来的阅读位置继续。</p>
    <ActiveTool tool={tool} onTool={onTool} onOpenTest={onOpenTest} onCopyProjectNextAction={onCopyProjectNextAction} />
  </main>
}

function PrivacyView({ onView, language = 'zh-CN' }: { onView: (view: PrimaryView) => void; language?: 'zh-CN' | 'en' }) {
  const en = language === 'en'
  const t = (zh: string, english: string) => en ? english : zh
  const [clearArmed, setClearArmed] = useState(false)
  const [localRecordCount] = useState(() => Object.keys(localStorage).filter(key => key.startsWith(LOCAL_STORAGE_PREFIX)).length)
  const clearLocalData = () => {
    if (!clearArmed) {
      setClearArmed(true)
      return
    }
    Object.keys(localStorage).filter(key => key.startsWith(LOCAL_STORAGE_PREFIX)).forEach(key => localStorage.removeItem(key))
    window.location.reload()
  }
  return <main className="content-page privacy-page" id="main-content" tabIndex={-1} lang={language}>
    <nav className="original-reading__bar" aria-label={t('隐私页面导航', 'Privacy navigation')}><a href={`#course/reading/all/${language}`}>{t('返回阅读目录', 'Back to the course')}</a><div className="original-reading__languages"><a href="#privacy" lang="zh-CN" aria-current={!en ? 'page' : undefined}>中文</a><a href="#privacy/en" lang="en" aria-current={en ? 'page' : undefined}>English</a></div></nav>
    <h1>{t('数据与隐私', 'Data and privacy')}</h1>
    <p className="lede">{t('你可以直接阅读，无需账号。设计记录默认留在当前浏览器；需要保留的内容，请主动导出备份。', 'Read without an account. Design records stay in this browser by default. Export a backup of anything you want to keep.')}</p>
    {!isPublicTrialConfigured && <section className="privacy-release-warning" role="status"><strong>{t('当前为本地/内部预览', 'Local / internal preview')}</strong><p>{t('公开试用标记、实际托管方或隐私联系人尚未配置完整；当前构建不用于公开招募。', 'The public-trial flag, hosting provider, or privacy contact is not fully configured. This build is not for public participant recruitment.')}</p></section>}
    <div className="privacy-grid">
      <section><h2>{t('本站会保存什么', 'What is saved')}</h2><p>{t('点击保存的阅读练习、设计工作台的项目、工具草稿与测试记录使用这个浏览器的', 'Reading exercises you explicitly save, workbench projects, tool drafts, and playtest records use this browser’s')} <code>localStorage</code>{t('。当前检测到', '. Currently, there are')} {localRecordCount} {t('个本站本地数据项。', 'local data entries for this site.')}</p><p>{t('本站当前没有账号、云端上传、访问分析、广告追踪或广告 Cookie。清理浏览器数据、结束无痕窗口或更换设备，可能使本地记录不再可用。', 'The site currently has no accounts, cloud uploads, analytics, advertising trackers, or advertising cookies. Clearing browser data, closing a private window, or changing devices may make local records unavailable.')}</p></section>
      <section><h2>{t('保留自己的副本', 'Keep your own copy')}</h2><p>{t('完成一轮设计后，使用工作台的导出功能保存 JSON 项目包。重要工具记录也可单独导出；本地记录不会自动跨设备同步。', 'After a design session, use the workbench export to save a JSON project package. Important tool records can also be exported separately. Local records do not automatically sync across devices.')}</p><a className="text-action" href="#workbench" onClick={event => { event.preventDefault(); onView('workbench') }}>{t('打开设计工作台', 'Open the workbench (Chinese)')} <ArrowIcon /></a></section>
      <section><h2>{t('来源与托管日志', 'Sources and hosting logs')}</h2><p>{t('原创阅读在本站提供完整解释。旧资料保留来源与使用范围，原始资料自身的访问、权利和隐私条件仍适用。', 'Original readings provide complete explanations on this site. Older resource records retain their sources and usage scope. The original sources have their own access, rights, and privacy conditions.')}</p><p>{t('上线后的托管服务可能处理 IP 地址、时间和浏览器信息等 HTTP 日志。范围与保留时间取决于托管方的政策。清除本地数据不会删除托管日志、已下载 JSON、研究者另存的测试记录或已经分享的副本。', 'Once hosted, the provider may process HTTP logs such as IP addresses, timestamps, and browser information. Scope and retention depend on that provider’s policy. Clearing local data does not remove hosting logs, downloaded JSON files, separately saved playtest records, or copies already shared.')}</p></section>
      <section><h2>{t('当前构建', 'This build')}</h2><dl className="deployment-facts"><div><dt>{t('模式', 'Mode')}</dt><dd>{deploymentInfo.publicTrial ? t('公开试用', 'Public trial') : t('本地/内部', 'Local / internal')}</dd></div><div><dt>{t('托管方', 'Host')}</dt><dd>{deploymentInfo.hostLabel === '本地预览' ? t('本地预览', 'Local preview') : deploymentInfo.hostLabel}</dd></div><div><dt>{t('构建版本', 'Build')}</dt><dd>{deploymentInfo.buildId}</dd></div><div><dt>{t('隐私联系人', 'Privacy contact')}</dt><dd>{deploymentInfo.privacyContact || t('尚未配置', 'Not configured')}</dd></div></dl></section>
    </div>
    <section className="privacy-delete-zone" aria-labelledby="privacy-delete-title"><h2 id="privacy-delete-title">{t('清除这台设备上的本站数据', 'Clear this site’s data on this device')}</h2><p>{t('只删除键名以', 'Only keys starting with')} <code>{LOCAL_STORAGE_PREFIX}</code> {t('开头的本站本地数据，不会清空同一域名下其他应用的数据。此操作不可撤销，请先导出。', 'are removed. Other applications’ keys on this origin are left untouched. This cannot be undone; export a backup first.')}</p><button className={clearArmed ? 'danger-button is-armed' : 'danger-button'} type="button" onClick={clearLocalData}>{clearArmed ? t('再次点击，永久清除本站本地数据', 'Click again to permanently clear this site’s local data') : t('清除本站全部本地数据', 'Clear this site’s local data')}</button>{clearArmed && <><p className="form-status" role="alert">{t('再次点击将删除并重新加载。', 'Clicking again deletes the data and reloads the page.')}</p><button type="button" className="text-action" onClick={() => setClearArmed(false)}>{t('取消', 'Cancel')}</button></>}</section>
  </main>
}

function SiteFooter({ route, onView }: { route: AppRoute; onView: (view: PrimaryView) => void }) {
  const privacyRoute: AppRoute = { view: 'privacy', tool: route.tool, readingLanguage: route.readingLanguage }
  const reading = (route.view === 'course' && !route.courseMode && !route.workContext?.courseId && !route.workContext?.unitId) || (route.view === 'learn' && !route.learningNode) || (route.view === 'resources' && (!route.resourceEntry || route.resourceEntry === 'read' || route.resourceEntry === 'cases' || route.resourceEntry === 'library' || (route.resourceEntry === 'learn' && route.resourceId === 'systematic')))
  const english = route.readingLanguage === 'en'
  return <footer className="site-footer" lang={english ? 'en' : 'zh-CN'}><p>{reading ? (english ? 'Original lessons and essays in Chinese and English.' : '原创课程与选读，同一内容提供中文和英文。') : (english ? 'Legacy resources retain their authors, sources, and usage scope.' : '所有译文保留原作者、原文链接、授权或内部使用范围。')}</p><div>{!reading && <><span>{english ? 'Internal learning preview' : '仅限内部学习'}</span><span>{english && deploymentInfo.hostLabel === '本地预览' ? 'Local preview' : deploymentInfo.hostLabel}</span><span className="site-footer__build">{deploymentInfo.buildId}</span></>}<a href={serializeRoute(privacyRoute)} aria-current={route.view === 'privacy' ? 'page' : undefined} onClick={event => { event.preventDefault(); onView('privacy') }}>{english ? 'Data and privacy' : '数据与隐私'}</a></div></footer>
}

export function App() {
  const workspaceRuntime = useWorkspaceRuntime()
  const [route, setRoute] = useState<AppRoute>(() => parseRouteHash(window.location.hash))
  const [lastReadingLanguage, setLastReadingLanguage] = useState<'zh-CN' | 'en'>(() => route.readingLanguage || route.uiLanguage || readLanguagePreference())
  const interfaceLanguage = route.readingLanguage || route.uiLanguage || (route.workContext?.returnTo ? parseRouteHash(route.workContext.returnTo).readingLanguage : undefined) || lastReadingLanguage
  const readingSurface = (route.view === 'course' && !route.courseMode && !route.workContext?.courseId && !route.workContext?.unitId) || (route.view === 'learn' && !route.learningNode) || (route.view === 'resources' && (!route.resourceEntry || route.resourceEntry === 'read' || route.resourceEntry === 'cases' || route.resourceEntry === 'library' || (route.resourceEntry === 'learn' && route.resourceId === 'systematic')))
  useEffect(() => { setLastReadingLanguage(interfaceLanguage); saveLanguagePreference(interfaceLanguage) }, [interfaceLanguage])
  useEffect(() => { document.documentElement.lang = readingSurface || route.view === 'privacy' ? interfaceLanguage : 'zh-CN'; document.body.dataset.readingStudio = readingSurface ? 'true' : 'false' }, [readingSurface, route.view, interfaceLanguage])
  const [drawer, setDrawer] = useState(false)
  const [project, setProject] = useState<ProjectWorkspace>(readProjectWorkspace)
  const [toolReturnRoute, setToolReturnRoute] = useState<AppRoute | null>(null)
  const navigate = (next: AppRoute, replace = false) => {
    const href = serializeRoute(next)
    if (window.location.hash !== href) window.history[replace ? 'replaceState' : 'pushState'](null, '', href)
    setRoute(next)
  }
  const navigateView = (view: PrimaryView) => navigate({ view, tool: route.tool, ...(view === 'privacy' ? { readingLanguage: interfaceLanguage } : {}) })
  const navigateLearningNode = (learningNode?: string) => navigate({ view: 'learn', tool: route.tool, ...(learningNode ? { learningNode } : {}) })
  const navigateTool = (tool: DesignToolId) => navigate({ view: 'tools', tool, ...(route.workContext ? { workContext: route.workContext } : {}) })
  const navigateResourceEntry = (resourceEntry: string, replace = false) => navigate({ view: 'resources', tool: route.tool, resourceEntry, ...(route.workContext ? { workContext: route.workContext } : {}) }, replace)
  const navigateResourcePreview = (resourceEntry: string, resourceId: string) => navigate({ view: 'resources', tool: route.tool, resourceEntry, resourceId, ...(route.workContext ? { workContext: route.workContext } : {}) })
  const openContextualResource = (resourceEntry: string, resourceId: string) => {
    const context = route.workContext
    let contextRef: TypedRef | null = null
    if (context?.iterationId) contextRef = { scope: 'workspace', kind: 'iteration_cycle', id: context.iterationId, relation: 'attached_to' }
    else if (context?.versionId) contextRef = { scope: 'workspace', kind: 'project_version', id: context.versionId, relation: 'attached_to' }
    else if (context?.projectId) contextRef = { scope: 'workspace', kind: 'project', id: context.projectId, relation: 'attached_to' }
    else if (context?.enrollmentId && context.activityId) {
      const attempt = workspaceRuntime.workspace.collections.activityAttempts.find(item => item.enrollmentId === context.enrollmentId && item.activityId === context.activityId)
      if (attempt) contextRef = { scope: 'workspace', kind: 'activity_attempt', id: attempt.id, relation: 'attached_to' }
    }
    if (contextRef) workspaceRuntime.commit(draft => attachResource(draft, { resourceId, contextRef: contextRef!, reason: '从当前课程或迭代任务中选用。' }), '这份资料已附着到当前工作对象，返回后仍可追溯。')
    navigateResourcePreview(resourceEntry, resourceId)
  }
  const navigateResourceSubpage = (resourceEntry: 'learn' | 'analyze' | 'problems', resourceId: string) => navigateResourcePreview(resourceEntry, resourceId)
  const navigateMethod = (methodSection: MethodSection, methodItem?: string, replace = false) => navigate({ view: 'method', tool: route.tool, methodSection, ...(methodItem ? { methodItem } : {}), ...(route.workContext ? { workContext: route.workContext } : {}) }, replace)
  const savedProjectRef = useRef(project)
  useEffect(() => {
    if (savedProjectRef.current === project) return
    try { localStorage.setItem(PROJECT_WORKSPACE_STORAGE_KEY, JSON.stringify(project)); savedProjectRef.current = project } catch { /* 保留当前会话中的用户修改 */ }
  }, [project])
  useEffect(() => {
    const syncFromLocation = () => {
      const next = parseRouteHash(window.location.hash)
      const canonical = serializeRoute(next)
      if (window.location.hash !== canonical) window.history.replaceState(null, '', canonical)
      setRoute(next)
    }
    syncFromLocation()
    window.addEventListener('hashchange', syncFromLocation)
    window.addEventListener('popstate', syncFromLocation)
    return () => {
      window.removeEventListener('hashchange', syncFromLocation)
      window.removeEventListener('popstate', syncFromLocation)
    }
  }, [])
  useEffect(() => { if (!(route.view === 'resources' && !route.resourceEntry) && route.resourceEntry !== 'read' && route.resourceEntry !== 'cases' && route.resourceEntry !== 'library' && !route.readingChapter && !(route.view === 'course' && !route.courseMode && !route.workContext?.courseId) && !(route.view === 'learn' && !route.learningNode) && !(route.resourceEntry === 'learn' && route.resourceId === 'systematic')) document.title = routeTitle(route) }, [route])
  useEffect(() => {
    if (route.view !== 'resources' || !route.resourceId) return
    if (route.resourceEntry === 'learn' && !isLearningContentId(route.resourceId) && !isLearningStartEntryId(route.resourceId)) {
      navigate({ view: 'resources', tool: route.tool, resourceEntry: 'learn' }, true)
    }
    if (route.resourceEntry === 'analyze' && route.resourceId !== 'advanced' && !isAnalysisQuestionId(route.resourceId)) {
      navigate({ view: 'resources', tool: route.tool, resourceEntry: 'analyze' }, true)
    }
    if (route.resourceEntry === 'problems' && !isResourceProblemStageId(route.resourceId)) {
      navigate({ view: 'resources', tool: route.tool, resourceEntry: 'problems' }, true)
    }
  }, [route.resourceEntry, route.resourceId, route.tool, route.view])
  const readingScrollPositions = useRef(new Map<string, number>())
  useEffect(() => {
    const key = serializeRoute(route)
    const rememberScroll = () => readingScrollPositions.current.set(key, window.scrollY)
    window.addEventListener('scroll', rememberScroll, { passive: true })
    return () => window.removeEventListener('scroll', rememberScroll)
  }, [route])
  useLayoutEffect(() => {
    const root = document.documentElement
    const previousScrollBehavior = root.style.scrollBehavior
    const isReadingList = readingSurface && !route.readingChapter && (!route.resourceId || route.resourceId === 'all')
    const hasCaseSection = route.resourceEntry === 'cases' && route.resourceId && route.resourceId !== 'all' && route.caseSection
    const targetScroll = isReadingList ? readingScrollPositions.current.get(serializeRoute(route)) || 0 : 0
    const resetScroll = () => {
      root.style.scrollBehavior = 'auto'
      window.scrollTo(0, targetScroll)
    }
    resetScroll()
    const frame = window.requestAnimationFrame(() => {
      // A loaded case section owns the final position; a later top reset would undo its focus target.
      if (!hasCaseSection) resetScroll()
      root.style.scrollBehavior = previousScrollBehavior
    })
    return () => {
      window.cancelAnimationFrame(frame)
      root.style.scrollBehavior = previousScrollBehavior
    }
  }, [route.readingChapter, route.courseMode, route.learningNode, route.methodSection, route.resourceEntry, route.resourceId, route.readingLanguage, route.readingTrack, route.view, route.tool])
  useEffect(() => { const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setDrawer(false) }; window.addEventListener('keydown', handler); return () => window.removeEventListener('keydown', handler) }, [])
  const openGuideTool = (toolId: GuideToolId) => {
    setToolReturnRoute(route)
    if (toolId === 'test-plan') return setDrawer(true)
    navigate({ view: 'tools', tool: toolId, workContext: { ...route.workContext, returnTo: serializeRoute(route) } })
  }
  const saveProject = (draft: ProjectWorkspace, changeSummary: string) => {
    const createdAt = new Date().toISOString()
    const checkpoint: ProjectCheckpoint = { id: crypto.randomUUID(), version: draft.version, stage: draft.stage, currentQuestion: draft.currentQuestion, nextAction: draft.nextAction, changeSummary, createdAt }
    setProject({ ...draft, schemaVersion: 2, checkpoints: [checkpoint, ...draft.checkpoints], updatedAt: createdAt })
  }
  return <>
    <a className="skip-link" href={serializeRoute(route)} onClick={event => { event.preventDefault(); document.getElementById('main-content')?.focus() }}>{interfaceLanguage === 'en' ? 'Skip to main content' : '跳到主要内容'}</a>
    <Header route={{ ...route, readingLanguage: interfaceLanguage }} onNavigate={navigate} />
    {!readingSurface && route.view !== 'privacy' && interfaceLanguage === 'en' && <aside className="studio-language-note" lang="en">This practice area currently uses Chinese. Your reading language remains English.</aside>}
    {route.view === 'resources' && contextReturnRoute(route) && <aside className="context-return-bar" aria-label="当前工作上下文"><span>资料库没有替换你的工作对象。</span><button type="button" onClick={() => { const returnHash = contextReturnRoute(route); if (returnHash) navigate(parseRouteHash(returnHash)) }}>返回当前任务</button></aside>}
    {((route.view === 'course' && !route.courseMode && !route.workContext?.courseId && !route.workContext?.unitId) || (route.view === 'learn' && !route.learningNode) || (route.view === 'resources' && route.resourceEntry === 'learn' && route.resourceId === 'systematic')) && <ReadingLoadBoundary key={`${route.readingChapter || route.resourceId || "all"}/${interfaceLanguage}`} language={interfaceLanguage}><Suspense fallback={<main id="main-content" tabIndex={-1} className="text-learning"><p role="status">{route.readingLanguage === 'en' ? 'Opening the reading path…' : '正在打开系统阅读……'}</p></main>}><TextLearning chapterId={route.readingChapter} language={interfaceLanguage} returnTo={route.readingReturnTo} readingTrack={route.readingTrack} onOpenTool={openGuideTool} /></Suspense></ReadingLoadBoundary>}
    {route.view === 'course' && (route.courseMode === 'practice' || route.workContext?.courseId || route.workContext?.unitId) && <Suspense fallback={<main className="course-page" id="main-content" tabIndex={-1}><p role="status">正在准备系统课程……</p></main>}><CourseV3 route={route} onNavigate={navigate} onOpenProblems={() => navigate({ view: 'resources', tool: route.tool, resourceEntry: 'problems', workContext: { ...route.workContext, returnTo: serializeRoute(route) } })} onOpenWorkbench={returnTo => navigate({ view: 'workbench', tool: route.tool, workContext: { returnTo } })} /></Suspense>}
    {(route.view === 'workbench' || route.view === 'projects') && <Suspense fallback={<main className="workbench-page" id="main-content" tabIndex={-1}><p role="status">正在准备设计工作台……</p></main>}><WorkbenchV3 route={route} onNavigate={navigate} onOpenKnowledge={() => navigate({ view: 'resources', tool: route.tool, resourceEntry: 'problems', workContext: { ...route.workContext, returnTo: serializeRoute(route) } })} /></Suspense>}
    {route.view === 'learn' && route.learningNode && <Suspense fallback={<main className="learning-map" id="main-content" tabIndex={-1}><p role="status">正在准备学习入口……</p></main>}><LearningNodesRoute nodeId={route.learningNode} onOpenMap={() => navigateLearningNode()} onOpenNode={navigateLearningNode} onOpenTool={openGuideTool} onOpenContent={contentId => navigateResourceSubpage('learn', contentId)} onOpenBranch={guideId => navigateMethod('guides', guideId)} onOpenResourceEntry={navigateResourceEntry} onOpenConcept={conceptId => navigateMethod('glossary', conceptId)} onOpenProblems={() => navigateResourceEntry('problems')} onOpenProject={() => navigateView('path')} onOpenCourse={() => navigate({ view: 'course', tool: route.tool })} onOpenWorkbench={() => navigate({ view: 'workbench', tool: route.tool })} /></Suspense>}
    {route.view === 'path' && <PathView project={project} onSaveProject={saveProject} onOpenConcept={id => navigateMethod('glossary', id)} onOpenTest={() => setDrawer(true)} onOpenTool={openGuideTool} onOpenResource={id => navigateResourcePreview('all', id)} onOpenResourceEntry={navigateResourceEntry} />}
    {route.view === 'resources' && !route.resourceEntry && <ReadingLoadBoundary key={`${route.readingChapter || route.resourceId || "all"}/${interfaceLanguage}`} language={interfaceLanguage}><Suspense fallback={<main id="main-content" tabIndex={-1}><p role="status">正在打开阅读目录……</p></main>}><OriginalReading language={interfaceLanguage} onFilterChange={(query, scope) => navigate({ ...route, resourceEntry: 'read', resourceId: 'all', readingLanguage: interfaceLanguage, readingQuery: query, readingScope: scope }, true)} /></Suspense></ReadingLoadBoundary>}
    {route.view === 'resources' && route.resourceEntry === 'library' && <ReadingLoadBoundary key={`${route.readingChapter || route.resourceId || "all"}/${interfaceLanguage}`} language={interfaceLanguage}><Suspense fallback={<main id="main-content" tabIndex={-1} className="original-reading"><p role="status">{interfaceLanguage === 'en' ? 'Opening the design library…' : '正在打开机制与主题库……'}</p></main>}><DesignLibrary entryId={route.resourceId} language={interfaceLanguage} query={route.readingQuery} kind={route.libraryKind} question={route.libraryQuestion} returnTo={route.readingReturnTo} onFilterChange={(query, kind, question) => navigate({ ...route, readingQuery: query, libraryKind: kind, libraryQuestion: question }, true)} /></Suspense></ReadingLoadBoundary>}
    {route.view === 'resources' && route.resourceEntry === 'cases' && <ReadingLoadBoundary key={`${route.readingChapter || route.resourceId || "all"}/${interfaceLanguage}`} language={interfaceLanguage}><Suspense fallback={<main id="main-content" tabIndex={-1}><p role="status">{interfaceLanguage === 'en' ? 'Opening case studies…' : '正在打开案例……'}</p></main>}><DesignCases caseId={route.resourceId} language={interfaceLanguage} query={route.readingQuery || ''} category={route.caseCategory} perspective={route.casePerspective} authorOnly={route.caseAuthorOnly} sectionId={route.caseSection} returnTo={route.readingReturnTo} onFilterChange={({ query, category, perspective, authorOnly }) => navigate({ ...route, readingQuery: query, caseCategory: category, casePerspective: perspective, caseAuthorOnly: authorOnly }, true)} onOpenTool={openGuideTool} /></Suspense></ReadingLoadBoundary>}
    {route.view === 'resources' && route.resourceEntry === 'read' && <ReadingLoadBoundary key={`${route.readingChapter || route.resourceId || "all"}/${interfaceLanguage}`} language={interfaceLanguage}><Suspense fallback={<main id="main-content" tabIndex={-1} className="original-reading"><p role="status">{route.readingLanguage === 'en' ? 'Opening the reading library…' : '正在打开阅读目录……'}</p></main>}><OriginalReading articleId={route.resourceId} language={interfaceLanguage} query={route.readingQuery} scope={route.readingScope} returnTo={route.readingReturnTo} onFilterChange={(query, scope) => navigate({ ...route, readingQuery: query, readingScope: scope }, true)} /></Suspense></ReadingLoadBoundary>}
    {route.view === 'resources' && route.resourceEntry === 'learn' && !route.resourceId && <ResourceLearningStart onBack={() => navigateView('resources')} onChooseLearningPath={id => navigateResourceSubpage('learn', id)} />}
    {route.view === 'resources' && route.resourceEntry === 'learn' && isLearningContentId(route.resourceId) && <Suspense fallback={<main className="resource-start-page" id="main-content" tabIndex={-1}><p role="status">正在准备完整中文内容……</p></main>}><CompleteLearningContentPage contentId={route.resourceId} onBack={() => navigateResourceSubpage('learn', route.resourceId === 'learn-by-playing-one-moment' ? 'learn-by-playing' : route.resourceId!.startsWith('designer-case-') ? 'designer-thinking' : 'systematic')} onNavigate={contentId => navigateResourceSubpage('learn', contentId)} onOpenTool={openGuideTool} /></Suspense>}
    {route.view === 'resources' && route.resourceEntry === 'learn' && isLearningStartEntryId(route.resourceId) && route.resourceId !== 'systematic' && <Suspense fallback={<main className="resource-start-page" id="main-content" tabIndex={-1}><p role="status">正在准备这条学习路径……</p></main>}><ResourceLearningDetail pathId={route.resourceId} onBack={() => navigateResourceEntry('learn')} onOpenContent={contentId => navigateResourceSubpage('learn', contentId)} onOpenProblems={() => navigateResourceEntry('problems')} onOpenTool={openGuideTool} /></Suspense>}
    {route.view === 'resources' && route.resourceEntry === 'analyze' && !route.resourceId && <ResourceAnalysisStart onBack={() => navigateView('resources')} onChooseQuestion={id => navigateResourceSubpage('analyze', id)} onOpenAdvanced={() => navigateResourceSubpage('analyze', 'advanced')} />}
    {route.view === 'resources' && route.resourceEntry === 'analyze' && isAnalysisQuestionId(route.resourceId) && <Suspense fallback={<main className="resource-start-page" id="main-content" tabIndex={-1}><p role="status">正在准备分析步骤……</p></main>}><ResourceAnalysisDetail questionId={route.resourceId} onBack={() => navigateResourceEntry('analyze')} onChooseAnother={() => navigateResourceEntry('analyze')} onOpenTool={openGuideTool} /></Suspense>}
    {route.view === 'resources' && route.resourceEntry === 'analyze' && route.resourceId === 'advanced' && <Suspense fallback={<main className="resource-start-page" id="main-content" tabIndex={-1}><p role="status">正在准备进阶分析入口……</p></main>}><ResourceAdvancedAnalysis onBack={() => navigateResourceEntry('analyze')} /></Suspense>}
    {route.view === 'resources' && route.resourceEntry === 'problems' && <ResourceDiscoveryBoundary>{({ discovery }) => <ResourceProblemsStart entries={discovery.resourceEntryPoints} stageGroups={discovery.resourceStageGroups} stageId={isResourceProblemStageId(route.resourceId) ? route.resourceId : undefined} onBack={() => route.resourceId ? navigateResourceEntry('problems') : navigateView('resources')} onChooseStage={stageId => navigateResourceSubpage('problems', stageId)} onChooseEntry={navigateResourceEntry} />}</ResourceDiscoveryBoundary>}
    {route.view === 'resources' && route.resourceEntry === 'all' && <ResourceDiscoveryBoundary>{({ discovery, entryCatalog, defaultEntryId }) => <ResourcePage discovery={discovery} initialEntryCatalog={entryCatalog} defaultEntryId={defaultEntryId} requestedEntryId="all" requestedResourceId={route.resourceId} onSelectEntry={navigateResourceEntry} onOpenResource={openContextualResource} onReplaceInvalidEntry={entryId => navigateResourceEntry(entryId, true)} />}</ResourceDiscoveryBoundary>}
    {route.view === 'resources' && route.resourceEntry && !['learn', 'analyze', 'problems', 'all', 'read', 'cases', 'library'].includes(route.resourceEntry) && <ResourceDiscoveryBoundary requestedEntryId={route.resourceEntry}>{({ discovery, entryCatalog }) => <ResourceTopicRoute discovery={discovery} initialEntryCatalog={entryCatalog} requestedEntryId={route.resourceEntry!} requestedResourceId={route.resourceId} onBack={() => navigateResourceEntry('problems')} onOpenAll={() => navigateResourceEntry('all')} onOpenResource={openContextualResource} onOpenTool={openGuideTool} onReplaceInvalidEntry={() => navigateResourceEntry('problems', true)} onReplaceInvalidResource={() => navigateResourceEntry(route.resourceEntry!, true)} />}</ResourceDiscoveryBoundary>}
    {route.view === 'tools' && <ToolsView tool={route.tool} onTool={navigateTool} onBack={() => { const returnHash = contextReturnRoute(route); navigate(returnHash ? parseRouteHash(returnHash) : toolReturnRoute ?? { view: 'learn', tool: route.tool }); setToolReturnRoute(null) }} backLabel={route.workContext?.returnTo ? (interfaceLanguage === 'en' ? 'Back to the reading' : '返回刚才的阅读') : toolReturnRoute?.view === 'learn' ? '返回学习节点' : toolReturnRoute?.view === 'method' ? '返回方法与概念' : toolReturnRoute?.view === 'path' ? '返回设计路径' : toolReturnRoute?.resourceEntry === 'learn' ? '返回学习内容' : toolReturnRoute?.resourceEntry === 'analyze' ? '返回游戏分析' : toolReturnRoute?.view === 'resources' ? '返回这组资料' : '返回学习地图'} onOpenTest={() => setDrawer(true)} onCopyProjectNextAction={nextAction => setProject(current => ({ ...current, nextAction, updatedAt: new Date().toISOString() }))} />}
    {route.view === 'method' && <MethodView section={route.methodSection} itemId={route.methodItem} onBack={() => navigateView('method')} onNavigate={navigateMethod} onOpenResource={id => navigateResourcePreview('all', id)} onOpenTool={openGuideTool} />}
    {route.view === 'privacy' && <PrivacyView onView={navigateView} language={interfaceLanguage} />}
    <SiteFooter route={{ ...route, readingLanguage: interfaceLanguage }} onView={navigateView} />
    {drawer && <Suspense fallback={<div className="drawer-backdrop"><aside className="test-drawer" role="dialog" aria-modal="true" aria-label="测试计划正在加载"><p role="status">单问题测试计划正在加载……</p></aside></div>}><SingleQuestionTestPlan project={{ id: project.id, title: project.title, version: project.version, currentQuestion: project.currentQuestion }} onClose={() => setDrawer(false)} onStartSession={() => { setDrawer(false); navigateTool('playtest-session') }} /></Suspense>}
  </>
}
