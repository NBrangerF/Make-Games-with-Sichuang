import { readFileSync } from 'node:fs'

const root = new URL('../', import.meta.url)
const read = path => readFileSync(new URL(path, root), 'utf8')
const app = read('src/App.tsx')
const data = read('src/data.ts')
const starts = read('src/resource-start-v2.tsx')
const details = read('src/resource-v2-detail.tsx')
const reading = read('src/complete-translation-page.tsx')
const markdownReading = read('src/markdown-reading.tsx')
const learningRoutes = read('src/learning-content-route.ts')
const problems = read('src/resource-problems-v2.tsx')
const contextualTools = read('src/contextual-tools.tsx')
const styles = read('src/styles.css')
const html = read('index.html')
const translation = read('content/translations/game-design-concepts-level-01-zh-CN.md')
const metadata = JSON.parse(read('content/translations/game-design-concepts-level-01-zh-CN.metadata.json'))
const translation02 = read('content/translations/game-design-concepts-level-02-zh-CN.md')
const metadata02 = JSON.parse(read('content/translations/game-design-concepts-level-02-zh-CN.metadata.json'))
const rulebookAccessibilityTranslation = read('content/translations/what-makes-a-rulebook-accessible-and-entertaining-zh-CN.md')
const rulebookAccessibilityMetadata = JSON.parse(read('content/translations/what-makes-a-rulebook-accessible-and-entertaining-zh-CN.metadata.json'))
const rulebookAccessibilityAudit = read('docs/research/RULEBOOK_ACCESSIBILITY_TRANSLATION_AUDIT_2026-08-22.md')
const systematicUnits = [
  'systematic-unit-00-question-first-zh-CN',
  'systematic-unit-01-experience-intent-zh-CN',
  'systematic-unit-02-decisions-core-loop-zh-CN',
  'systematic-unit-03-mechanisms-information-interaction-zh-CN',
  'systematic-unit-04-minimum-prototype-zh-CN',
  'systematic-unit-05-single-question-test-zh-CN',
  'systematic-unit-06-evidence-to-next-version-zh-CN',
].map(id => ({
  id,
  body: read(`content/learning-units/${id}.md`),
  metadata: JSON.parse(read(`content/learning-units/${id}.metadata.json`)),
}))
const learnByPlaying = read('content/learning-units/learn-by-playing-one-moment-zh-CN.md')
const learnByPlayingMetadata = JSON.parse(read('content/learning-units/learn-by-playing-one-moment-zh-CN.metadata.json'))
const learnByPlayingAudit = read('docs/research/LEARN_BY_PLAYING_ONE_MOMENT_SOURCE_AUDIT_2026-08-22.md')
const monsoonCase = read('content/guides/monsoon-market-variables-case-synthesis-zh-CN-internal.md')
const monsoonMetadata = JSON.parse(read('content/guides/monsoon-market-variables-case-synthesis-zh-CN-internal.metadata.json'))
const duneCase = read('content/translations/dune-imperium-beginnings-zh-CN-internal.md')
const duneMetadata = JSON.parse(read('content/translations/dune-imperium-beginnings-zh-CN-internal.metadata.json'))
const quidCase = read('content/guides/quid-for-your-quo-case-synthesis-zh-CN-internal.md')
const quidMetadata = JSON.parse(read('content/guides/quid-for-your-quo-case-synthesis-zh-CN-internal.metadata.json'))
const paulGroganCase = read('content/guides/paul-grogan-rulebook-layout-case-synthesis-zh-CN-internal.md')
const paulGroganMetadata = JSON.parse(read('content/guides/paul-grogan-rulebook-layout-case-synthesis-zh-CN-internal.metadata.json'))
const newBedfordCase = read('content/guides/new-bedford-manufacturing-constraint-case-synthesis-zh-CN-internal.md')
const newBedfordMetadata = JSON.parse(read('content/guides/new-bedford-manufacturing-constraint-case-synthesis-zh-CN-internal.metadata.json'))
const visualSpec = read('docs/product/RESOURCE_V2_VISUAL_SPEC.md')
const resourceEntryIndex = JSON.parse(read('content/resource-entry-index.json'))
const learningNodes = JSON.parse(read('content/learning-nodes.json'))
const learningHome = read('src/learning-home.tsx')

const requiredCaseDimensions = ['语境', '问题', '选项', '决定', '证据', '结果', '仍未知', '迁移动作']
const newDesignerCases = [
  {
    body: paulGroganCase,
    metadata: paulGroganMetadata,
    routeId: 'designer-case-paul-grogan-rulebook-layout',
    bodyFile: 'paul-grogan-rulebook-layout-case-synthesis-zh-CN-internal.md',
  },
  {
    body: newBedfordCase,
    metadata: newBedfordMetadata,
    routeId: 'designer-case-new-bedford-manufacturing-constraint',
    bodyFile: 'new-bedford-manufacturing-constraint-case-synthesis-zh-CN-internal.md',
  },
]
const designerCaseRouteIds = [
  'designer-case-monsoon-market-variables',
  'designer-case-dune-imperium-beginnings',
  'designer-case-quid-for-your-quo',
  ...newDesignerCases.map(item => item.routeId),
]
const rulebookAccessibilityRouteId = 'what-makes-a-rulebook-accessible-and-entertaining'
const rulebookAccessibilityParagraphIds = [...rulebookAccessibilityTranslation.matchAll(/^\*\*\[([0-9]+\.[0-9]+)\]/gm)].map(match => match[1])
const rulebookAccessibilityTableCount = (rulebookAccessibilityTranslation.match(/^\|(?:\s*:?-+:?\s*\|)+$/gm) ?? []).length
const rulebookAccessibilityTextAlternativeCount = (rulebookAccessibilityTranslation.match(/^> \*\*图 [123]（中文文字替代，不加载原(?:图|照片)）：\*\*/gm) ?? []).length
const rulebookAccessibilityReferenceSection = (rulebookAccessibilityTranslation.split('## 参考文献')[1] ?? '').split('## 游戏作品目录')[0]
const rulebookAccessibilityLudographySection = rulebookAccessibilityTranslation.split('## 游戏作品目录')[1] ?? ''
const rulebookAccessibilityReferenceCount = (rulebookAccessibilityReferenceSection.match(/^\d+\.\s/gm) ?? []).length
const rulebookAccessibilityLudographyCount = (rulebookAccessibilityLudographySection.match(/^\d+\.\s/gm) ?? []).length
const rulebookAccessibilityHanCount = (rulebookAccessibilityTranslation.match(/[\u4E00-\u9FFF]/g) ?? []).length
const sourceTranslationBlock = details.match(/const SYSTEMATIC_SOURCE_TRANSLATIONS = \[([\s\S]*?)\] as const/)?.[1] ?? ''
const sourceTranslationIds = [...sourceTranslationBlock.matchAll(/id: '([^']+)'/g)].map(match => match[1])
const mappingEntries = name => {
  const block = contextualTools.match(new RegExp(`export const ${name}:[\\s\\S]*?= \\{([\\s\\S]*?)\\n\\}`))?.[1] ?? ''
  const starts = [...block.matchAll(/^  ('[^']+'|[a-z][\w-]*): \[/gm)]
  return starts.map((match, index) => {
    const segment = block.slice(match.index, starts[index + 1]?.index ?? block.length)
    return {
      id: match[1].replaceAll("'", ''),
      toolIds: [...segment.matchAll(/link\('([^']+)'/g)].map(toolMatch => toolMatch[1]),
    }
  })
}
const resourceToolEntries = mappingEntries('resourceEntryToolLinks')
const learningToolContents = mappingEntries('learningContentToolLinks')
const analysisToolQuestions = mappingEntries('analysisToolLinks')
const learningEntryTools = mappingEntries('learningEntryToolLinks')
const resourceToolEntryIds = resourceToolEntries.map(entry => entry.id)
const learningToolContentIds = learningToolContents.map(entry => entry.id)
const analysisToolQuestionIds = analysisToolQuestions.map(entry => entry.id)
const learningEntryToolIds = learningEntryTools.map(entry => entry.id)
const allContextualMappings = [...resourceToolEntries, ...learningToolContents, ...analysisToolQuestions, ...learningEntryTools]
const contextualToolIds = [...new Set(allContextualMappings.flatMap(entry => entry.toolIds))]
const guideToolIds = [...(data.match(/export type GuideToolId = ([^\n]+)/)?.[1] ?? '').matchAll(/'([^']+)'/g)].map(match => match[1])
const headerLinksBlock = app.match(/const twoTaskLinks:[^=]*= \[([\s\S]*?)\n  \]/)?.[1] ?? ''

const checks = []
const check = (pass, label) => checks.push([Boolean(pass), label])

check((starts.match(/id: 'learn'|id: 'analyze'|id: 'problems'/g) ?? []).length === 3, '首页严格限制为三个主入口')
check(
  (headerLinksBlock.match(/id:/g) ?? []).length === 5 &&
  headerLinksBlock.includes("id: 'play'") && headerLinksBlock.includes("view: 'play'") &&
  headerLinksBlock.includes("id: 'course'") && headerLinksBlock.includes("'系统学习'") &&
  headerLinksBlock.includes("id: 'workbench'") && headerLinksBlock.includes("'设计工作台'") &&
  headerLinksBlock.includes("id: 'library'") && headerLinksBlock.includes("resourceEntry: 'library'") &&
  headerLinksBlock.includes("id: 'cases'") && headerLinksBlock.includes("resourceEntry: 'cases'") &&
  !headerLinksBlock.includes("id: 'path'") &&
  !headerLinksBlock.includes("id: 'tools'"),
  '顶栏提供系统学习、玩着学、案例研究、机制主题库与设计工作台',
)
check(
  learningNodes.nodes?.filter(node => node.track === 'observe').length === 5 &&
  learningNodes.nodes?.filter(node => node.track === 'iteration').length === 7 &&
  app.includes("route.view === 'learn'") && app.includes("route.view === 'course'") && app.includes("route.view === 'workbench'") &&
  learningHome.includes('two-task-home__choices') && learningHome.includes('onOpenCourse') && learningHome.includes('onOpenWorkbench') && learningHome.includes('onOpenProblems') &&
  learningHome.includes("VITE_V3_HOME_ENABLED === 'true'") && learningHome.includes('!deploymentInfo.publicTrial'),
  '受控 V3 首页只给系统学习与设计工作台两个主任务，公开试用仍保留回退',
)
check(app.includes("route.view === 'path'") && app.includes("route.view === 'tools'"), '隐藏入口不删除设计路径与工具旧深链')
check(
  app.includes('className="resource-start-page method-start-page"') &&
  ['解决一个具体任务', '理解一种分析方法', '查一个设计词'].every(label => app.includes(label)) &&
  app.includes('<h1>方法与概念</h1>') &&
  app.includes('按你现在的问题，查一个方法、概念或判断依据。') &&
  !app.includes('>资源怎么读</button>'),
  '方法页先显示三个任务入口，详情保持稳定名称且隐藏平行资源目录',
)
check(['systematic', 'designer-thinking', 'learn-by-playing', 'small-exercise'].every(id => starts.includes(`id: '${id}'`)), '学习入口覆盖四种起步方式')
check(['experience', 'decisions', 'interaction', 'state-and-feedback', 'learning-and-execution'].every(id => starts.includes(`id: '${id}'`)), '分析入口覆盖五个普通问题')
check(starts.includes('从一个问题开始') && starts.includes('搜索全部资料'), '首页保留一个眉题和一个次级搜索入口')
check(app.includes("route.view === 'resources' && !route.resourceEntry") && app.includes('<OriginalReading language={interfaceLanguage}'), '旧资源首页地址进入自足原创文章，资料详情深链另行保留')
check(app.includes("route.resourceEntry === 'learn'") && app.includes("route.resourceEntry === 'analyze'"), '学习与分析使用独立深链')
check(app.includes("route.resourceEntry === 'problems'") && app.includes('<ResourceProblemsStart') && app.includes('<ResourceTopicRoute'), '具体设计问题复用既有六阶段与任务入口')
check(details.includes('四步完成一次分析') && details.includes('分开观察与推断'), '分析正文提供四步脚手架')
check(details.includes('0 从一个具体问题开始') && details.includes('8 呈现、生产与发布'), '系统学习路线保留九单元骨架')
check(details.includes('<details className="resource-course-outline">') && details.includes('已经可以完整阅读'), '九单元路线默认折叠且先显示已完成内容')
check(reading.includes("game-design-concepts-level-01-zh-CN.md?raw") && reading.includes('<MarkdownReading'), '完整中文译文在站内按需读取')
check(metadata.license?.permitsTranslation === true && metadata.translation?.scope && metadata.original?.url, '译文元数据含许可、范围与原文记录')
check(translation.includes('# 第 1 关：概览 / 什么是游戏？') && translation.includes('## 来做一款游戏') && translation.includes('## Homeplay'), '首份译文保留完整课程结构与练习')
check(translation.length > 9000, '首份译文达到完整正文规模')
check(systematicUnits.length === 7 && systematicUnits.every(unit => unit.body.length > 3000 && unit.metadata.contentMode === 'original_complete' && unit.metadata.authorship?.humanReviewRequired === false), '系统课程单元 0 至 6 均为完整原创中文正文')
check(systematicUnits.every(unit => {
  const routeId = unit.metadata.itemId.replace(/-zh-CN$/, '')
  return learningRoutes.includes(routeId) && details.includes(routeId) && reading.includes(`${unit.id}.md?raw`)
}), '系统课程单元 0 至 6 均有可见入口、站内正文与稳定深链')
check(
  systematicUnits.slice(-2).every(unit => {
    const hanCount = (unit.body.match(/[\u4E00-\u9FFF]/g) ?? []).length
    return hanCount >= 7000 && hanCount === unit.metadata.metrics?.hanCharacterCount
  }) &&
  systematicUnits[5].body.includes('下面不是一份虚构的测试结果，而是一份可直接执行的测试计划') &&
  systematicUnits[6].body.includes('DEMO-01') &&
  systematicUnits[6].body.includes('不是项目真实测试'),
  '单元 5、6 达到完整规模，并把测试计划、教学演练与真人证据分开',
)
check(
  (learnByPlaying.match(/[\u4E00-\u9FFF]/g) ?? []).length >= 6500 &&
  (learnByPlaying.match(/[\u4E00-\u9FFF]/g) ?? []).length === learnByPlayingMetadata.metrics?.hanCharacterCount &&
  learnByPlayingMetadata.contentMode === 'original_complete' &&
  learnByPlayingMetadata.exampleBoundary?.includes('虚构教学记录') &&
  learnByPlaying.includes('下一回合才会尝试放入王国') &&
  learnByPlayingAudit.includes('正文达到 6,680 个 U+4E00–U+9FFF 汉字'),
  '首份边玩边学脚手架完整、构造边界明确且规则时序已经核对',
)
check(
  learningRoutes.includes('learn-by-playing-one-moment') &&
  reading.includes('learn-by-playing-one-moment-zh-CN.md?raw') &&
  reading.includes("isLearnByPlaying ? '返回边玩边学'") &&
  details.includes('开始第一份完整记录') &&
  app.includes("route.resourceId === 'learn-by-playing-one-moment' ? 'learn-by-playing'"),
  '边玩边学沿用既有二级入口，站内正文、返回路径与稳定深链完整',
)
check(translation02.length > 7000 && metadata02.translation?.humanReviewStatus === 'not_required' && metadata02.license?.permitsTranslation === true, '第二课完整译文以 Codex 主译进入内部学习')
check(
  rulebookAccessibilityMetadata.contentMode === 'authorized_full_translation' &&
  rulebookAccessibilityMetadata.license?.id === 'CC-BY-4.0' &&
  rulebookAccessibilityMetadata.license?.permitsTranslation === true &&
  rulebookAccessibilityMetadata.license?.permitsRedistribution === true &&
  rulebookAccessibilityMetadata.translation?.translator === 'Codex AI' &&
  rulebookAccessibilityMetadata.translation?.translationAuthority === 'codex_ai_complete' &&
  rulebookAccessibilityMetadata.translation?.humanReviewStatus === 'not_required' &&
  rulebookAccessibilityMetadata.publication?.visibility === 'internal-ready' &&
  rulebookAccessibilityMetadata.publication?.publicReleaseEnabled === false,
  '规则书无障碍论文以 CC BY 4.0、Codex AI 内部完整译文入站',
)
check(
  rulebookAccessibilityHanCount >= 12000 &&
  rulebookAccessibilityHanCount === rulebookAccessibilityMetadata.translation?.hanCharacterCount &&
  rulebookAccessibilityAudit.includes('汉字字符数：**12,746**'),
  '规则书无障碍论文正文达到 12000 汉字且与 metadata、审计记录一致',
)
check(
  rulebookAccessibilityParagraphIds.length === 66 &&
  new Set(rulebookAccessibilityParagraphIds).size === 66 &&
  rulebookAccessibilityParagraphIds[0] === '0.1' &&
  rulebookAccessibilityParagraphIds.at(-1) === '10.1' &&
  rulebookAccessibilityAudit.includes('全部 66 个编号段落'),
  '规则书无障碍论文保留 66 个唯一编号段落',
)
check(
  rulebookAccessibilityTableCount === 6 &&
  rulebookAccessibilityTextAlternativeCount === 3 &&
  rulebookAccessibilityAudit.includes('| 表格 | 6 | 6 |') &&
  rulebookAccessibilityAudit.includes('| 图与图注 | 3 | 3 |'),
  '规则书无障碍论文保留六张表与三处中文文字替代',
)
check(
  rulebookAccessibilityReferenceCount === 31 &&
  rulebookAccessibilityLudographyCount === 17 &&
  rulebookAccessibilityAudit.includes('| 参考文献 | 31 | 31 |') &&
  rulebookAccessibilityAudit.includes('| 游戏作品目录 | 17 | 17 |'),
  '规则书无障碍论文保留 31 条参考文献与 17 条游戏作品目录',
)
check(
  sourceTranslationIds.length === 3 &&
  ['game-design-concepts-level-01', 'game-design-concepts-level-02', rulebookAccessibilityRouteId].every(id => sourceTranslationIds.includes(id)),
  '系统学习入口严格显示三份完整来源译文',
)
check(
  learningRoutes.includes(rulebookAccessibilityRouteId) &&
  details.includes(`id: '${rulebookAccessibilityRouteId}'`) &&
  reading.includes(`'${rulebookAccessibilityRouteId}':`) &&
  reading.includes('what-makes-a-rulebook-accessible-and-entertaining-zh-CN.md?raw') &&
  reading.includes('source: rulebookAccessibilitySource'),
  '第三篇开放许可译文有可见入口、稳定深链与站内正文',
)
check(
  !/!\[[^\]]*\]\([^)]+\)/.test(rulebookAccessibilityTranslation) &&
  !/<img\b/i.test(rulebookAccessibilityTranslation) &&
  rulebookAccessibilityTextAlternativeCount === 3 &&
  !markdownReading.includes('<img') &&
  markdownReading.includes('allowSourceLinks = false') &&
  !reading.includes('allowSourceLinks') &&
  markdownReading.includes('<span className="reading-source-reference"') &&
  markdownReading.includes('<span className="reading-image-reference"'),
  '第三篇译文不嵌入图片二进制，默认阅读仍不生成外链或外部图片',
)
check(!reading.includes('等待双语人工复核') && reading.includes('本版本不再等待人工双语复核'), '站内内容状态不再设置人工双语复核前置门')
check(monsoonCase.length > 2000 && monsoonMetadata.contentMode === 'original_case_synthesis' && monsoonMetadata.authorship?.fullTranslationClaimed === false, '未开放许可的设计师文章使用完整原创案例综合')
check(duneCase.length > 4000 && duneMetadata.contentMode === 'original_case_synthesis' && duneMetadata.synthesis?.fullTranslationIncluded === false, '《Dune: Imperium》设计日志以原创案例综合入站')
check(quidCase.length > 4000 && quidMetadata.synthesis?.requiredCaseDimensionsCovered === 8 && quidMetadata.authorship?.fullTranslationClaimed === false, '《Quid for your Quo》案例完整覆盖八个学习维度')
check(newDesignerCases.every(item => item.body.length > 5000 && item.metadata.synthesis?.hanCharacterCount >= 4000), 'Paul Grogan 与 New Bedford 案例达到可独立阅读的正文规模')
check(newDesignerCases.every(item =>
  item.metadata.synthesis?.requiredCaseDimensionsCovered === 8 &&
  requiredCaseDimensions.every(dimension => item.metadata.synthesis?.requiredCaseDimensions?.includes(dimension))
), '两篇新增案例完整覆盖语境到迁移动作八个学习维度')
check(newDesignerCases.every(item =>
  item.metadata.authorship?.fullTranslationClaimed === false &&
  item.metadata.synthesis?.sourceBodyTranslated === false &&
  item.metadata.completeness?.fullSourceTranslation === 'not_created' &&
  /不是.{0,12}(?:全文|原文)翻译/.test(item.body)
), '两篇新增案例在正文与 metadata 中均明确不是来源全文翻译')
check(designerCaseRouteIds.every(id => details.includes(id) && learningRoutes.includes(id)) &&
  newDesignerCases.every(item => reading.includes(`${item.bodyFile}?raw`)) &&
  details.includes('五篇都是本站原创中文案例综合'), '五篇设计师案例都有可见入口、站内正文和稳定深链')
check(problems.includes('你现在做到哪一步？') && problems.includes('下一页只显示这个阶段正在解决的问题'), '具体问题入口拆成阶段与问题两次决定')
check(app.includes('<ResourceTopicPage') && app.includes('先读这三份中文内容'), '具体问题页只先显示三份起步内容')
check(
  resourceToolEntryIds.length === resourceEntryIndex.entryPoints.length &&
  resourceEntryIndex.entryPoints.every(entry => resourceToolEntryIds.includes(entry.id)),
  '全部具体问题入口各自关联一至两个配套工作单',
)
check(
  learningToolContentIds.length === 16 &&
  analysisToolQuestionIds.length === 5 &&
  learningEntryToolIds.length === 4,
  '完整学习内容、分析问题与学习入口均有情境工具映射',
)
check(
  contextualToolIds.length === guideToolIds.length &&
  guideToolIds.every(toolId => contextualToolIds.includes(toolId)) &&
  allContextualMappings.every(entry => entry.toolIds.every(toolId => guideToolIds.includes(toolId))),
  '二十种工作单都至少出现在一个明确语境且没有未知工具 ID',
)
check(
  allContextualMappings.every(entry => entry.toolIds.length <= 2) &&
  resourceToolEntries.every(entry => entry.toolIds.length >= 1) &&
  learningToolContents.every(entry => entry.toolIds.length >= 1) &&
  analysisToolQuestions.every(entry => entry.toolIds.length >= 1) &&
  learningEntryTools.every(entry => entry.id === 'systematic' || entry.toolIds.length >= 1),
  '每个语境最多两个动作，系统课程目录把工具留到具体单元',
)
check(
  app.includes('resourceEntryToolLinks[entry.id]') &&
  reading.includes('learningContentToolLinks[contentId]') &&
  details.includes('analysisToolLinks[questionId]') &&
  details.includes('learningEntryToolLinks[pathId]'),
  '工具映射只在读者选定资源、单元或分析问题后出现',
)
check(
  !app.includes('className="tool-tabs"') &&
  /import \{[^}]*toolTitles[^}]*\} from '\.\/tool-catalog'/.test(app) &&
  app.includes('<h1>{toolTitles[tool]}</h1>') &&
  !app.includes('<h1>这一步的练习工具</h1>'),
  '独立工具货架已移除，具体工具深链以真实工具名作为唯一主标题',
)
check(styles.includes('.contextual-tools') && styles.includes('grid-template-columns: 46px minmax(0, 1fr) 28px'), '配套工作单沿用开放列表而非新增卡片货架')
check(html.includes('noindex, nofollow'), '内部学习构建保持禁止搜索引擎索引')
check(styles.includes('.resource-start-page') && styles.includes('.complete-reading-document'), '入口页与长文阅读有独立原生 CSS')
check(markdownReading.includes('reading-image-reference') && styles.includes('.reading-image-reference'), '来源配图以站内文字说明呈现，不加载外部图片')
check(visualSpec.includes('首屏没有阶段选择、受众选择、筛选器、结果统计或资源列表'), '视觉规格冻结首屏减法边界')
check(!/[—–]/.test([starts, details, reading].join('\n')), '新增可见界面文案不使用长破折号')

const failures = checks.filter(([pass]) => !pass)
for (const [pass, label] of checks) console.log(`${pass ? '✓' : '✗'} ${label}`)
if (failures.length) {
  console.error(`\n资源入口 V2 守卫失败：${failures.length}/${checks.length}`)
  process.exit(1)
}
console.log(`\n资源入口 V2 守卫通过：${checks.length}/${checks.length}`)
