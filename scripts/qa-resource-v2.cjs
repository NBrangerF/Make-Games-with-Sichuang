const path = require('node:path')
const { chromium } = require('playwright')

const baseUrl = process.env.QA_BASE_URL || 'http://127.0.0.1:8020/'
const chromePath = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const workspace = path.resolve(__dirname, '..')
const screenshotPath = name => path.join(workspace, 'design', 'qa', name)
const buildId = 'resource-v2-05'
const qaUrl = hash => `${baseUrl}?build=${buildId}${hash}`
const qaScreenshotPath = name => screenshotPath(`${buildId}-${name}`)
const rulebookAccessibilityContentId = 'what-makes-a-rulebook-accessible-and-entertaining'
const rulebookAccessibilityTitle = '怎样让规则书既无障碍又有趣？最佳实践建议'
const unit05ContentId = 'systematic-unit-05-single-question-test'
const unit05Title = '单元 5：单问题测试'
const unit06ContentId = 'systematic-unit-06-evidence-to-next-version'
const unit06Title = '单元 6：从证据到下一版'
const learnByPlayingContentId = 'learn-by-playing-one-moment'
const learnByPlayingTitle = '边玩边学 01：只分析一局里的一个时刻'

async function run() {
  const browser = await chromium.launch({ executablePath: chromePath, headless: true })
  const errors = []
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } })
  const page = await context.newPage()
  page.setDefaultTimeout(120000)
  page.on('console', message => { if (message.type() === 'error') errors.push(`console: ${message.text()}`) })
  page.on('pageerror', error => errors.push(`page: ${error.message}`))
  page.on('response', response => { if (response.status() >= 400) errors.push(`http ${response.status()}: ${response.url()}`) })

  await page.goto(qaUrl('#resources'), { waitUntil: 'domcontentloaded', timeout: 120000 })
  await page.getByRole('heading', { name: '落桌', exact: true }).waitFor()
  const homeChoices = await page.locator('.resource-start-choice').count()
  const oldDefaultBlocks = await page.locator('.resource-stage-selector, .resource-audience-helper, .resource-search-panel, .resource-result-heading, .resource-list').count()
  const internalScope = await page.getByText('仅限内部学习', { exact: true }).first().isVisible()
  const desktopNavLabels = await page.locator('.header nav .nav-link').allTextContents()
  const hiddenGlobalDestinations = await page.getByRole('link', { name: /设计路径|辅助工具|中文知识/, exact: true }).count()
  await page.screenshot({ path: qaScreenshotPath('home-desktop.png'), fullPage: true })

  await page.getByRole('button', { name: /开始学习桌游设计/ }).click()
  await page.waitForFunction(() => window.location.hash === '#resources/learn')
  const learningChoices = await page.locator('.resource-start-choice').count()
  await page.getByRole('button', { name: /系统性学习/ }).click()
  await page.waitForFunction(() => window.location.hash === '#resources/learn/systematic')
  await page.getByRole('heading', { name: '系统性学习', exact: true }).waitFor()
  const availableUnitCount = await page.locator('.resource-reading-index > ol > li').count()
  const outlineUnitCount = await page.locator('.resource-course-outline > ol > li').count()
  const sourceReadingCount = await page.locator('.resource-source-readings > ul > li').count()
  await page.screenshot({ path: qaScreenshotPath('systematic-desktop.png'), fullPage: true })

  await page.getByRole('button', { name: /Game Design Concepts 第 2 关/ }).click()
  await page.getByRole('heading', { name: '第 2 关：游戏设计 / 迭代与快速原型', exact: true }).waitFor()
  const level02ImageReferences = await page.locator('.complete-reading-document .reading-image-reference').count()
  const level02ExternalLinks = await page.locator('.complete-reading-document a').count()
  await page.screenshot({ path: qaScreenshotPath('level-02-desktop.png'), fullPage: false })
  await page.getByRole('button', { name: '返回系统性学习', exact: true }).click()
  await page.getByRole('heading', { name: '系统性学习', exact: true }).waitFor()

  await page.getByRole('button', { name: '阅读单元 0', exact: true }).click()
  await page.waitForFunction(() => window.location.hash === '#resources/learn/systematic-unit-00-question-first')
  await page.getByRole('heading', { name: '单元 0：从一个具体问题开始', exact: true }).waitFor()
  const unitSections = await page.locator('.complete-reading-document h2').count()
  const unitParagraphs = await page.locator('.complete-reading-document p').count()
  const unitExternalLinks = await page.locator('.complete-reading-document a').count()
  const unitSourceReferences = await page.locator('.complete-reading-document .reading-source-reference').count()
  await page.screenshot({ path: qaScreenshotPath('unit-00-desktop.png'), fullPage: false })
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight))
  await page.getByRole('button', { name: '下一篇', exact: true }).click()
  await page.getByRole('heading', { name: '单元 1：玩家体验与设计意图', exact: true }).waitFor()
  const readingNavigationStartsAtTop = await page.evaluate(() => window.scrollY < 20)

  const unit04Hash = '#resources/learn/systematic-unit-04-minimum-prototype'
  await page.goto(qaUrl(unit04Hash), { waitUntil: 'domcontentloaded', timeout: 120000 })
  await page.getByRole('heading', { name: '单元 4：最小原型', exact: true }).waitFor()
  await page.reload({ waitUntil: 'domcontentloaded', timeout: 120000 })
  await page.getByRole('heading', { name: '单元 4：最小原型', exact: true }).waitFor()
  const unit04DeepLinkSurvivesReload = await page.getByRole('heading', { name: '单元 4：最小原型', exact: true }).isVisible()
    && await page.evaluate(expectedHash => window.location.hash === expectedHash, unit04Hash)
  const unit04ExternalLinks = await page.locator('.complete-reading-document a').count()
  await page.screenshot({ path: qaScreenshotPath('unit-04-deep-link.png'), fullPage: false })
  const unit04ContextualToolCount = await page.locator('.contextual-tools li').count()
  await page.getByRole('button', { name: /原型范围裁剪器/ }).click()
  await page.waitForFunction(() => window.location.hash === '#tools/prototype-scope')
  await page.locator('.prototype-scope-tool').waitFor()
  const toolShelfCount = await page.locator('.tool-tabs').count()
  const toolRouteActiveNavCount = await page.locator('.header nav [aria-current="page"]').count()
  const toolReturnLabel = await page.getByRole('button', { name: '返回学习内容', exact: true }).isVisible()
  await page.screenshot({ path: qaScreenshotPath('contextual-tool-desktop.png'), fullPage: false })
  await page.getByRole('button', { name: '返回学习内容', exact: true }).click()
  await page.getByRole('heading', { name: '单元 4：最小原型', exact: true }).waitFor()
  const contextualToolReturnsToUnit = await page.evaluate(expectedHash => window.location.hash === expectedHash, unit04Hash)

  const unit05Hash = `#resources/learn/${unit05ContentId}`
  await page.goto(qaUrl(unit05Hash), { waitUntil: 'domcontentloaded', timeout: 120000 })
  await page.getByRole('heading', { name: unit05Title, exact: true }).waitFor()
  await page.reload({ waitUntil: 'domcontentloaded', timeout: 120000 })
  await page.getByRole('heading', { name: unit05Title, exact: true }).waitFor()
  const unit05DeepLinkSurvivesReload = await page.getByRole('heading', { name: unit05Title, exact: true }).isVisible()
    && await page.evaluate(expectedHash => window.location.hash === expectedHash, unit05Hash)
  const unit05ExternalLinks = await page.locator('.complete-reading-document a').count()
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight))
  await page.getByRole('button', { name: '下一篇', exact: true }).click()
  await page.getByRole('heading', { name: unit06Title, exact: true }).waitFor()
  const unit05NextOpensUnit06 = await page.evaluate(expectedHash => window.location.hash === expectedHash, `#resources/learn/${unit06ContentId}`)
  const unit06ExternalLinks = await page.locator('.complete-reading-document a').count()
  const unit06DemoBoundary = (await page.locator('.complete-reading-document').innerText()).includes('DEMO-01')
    && (await page.locator('.complete-reading-document').innerText()).includes('不是项目真实测试')
  await page.screenshot({ path: qaScreenshotPath('unit-06-desktop.png'), fullPage: false })
  await page.reload({ waitUntil: 'domcontentloaded', timeout: 120000 })
  await page.getByRole('heading', { name: unit06Title, exact: true }).waitFor()
  const unit06DeepLinkSurvivesReload = await page.evaluate(expectedHash => window.location.hash === expectedHash, `#resources/learn/${unit06ContentId}`)

  const rulebookAccessibilityHash = `#resources/learn/${rulebookAccessibilityContentId}`
  await page.goto(qaUrl(rulebookAccessibilityHash), { waitUntil: 'domcontentloaded', timeout: 120000 })
  await page.getByRole('heading', { name: rulebookAccessibilityTitle, exact: true }).waitFor()
  await page.reload({ waitUntil: 'domcontentloaded', timeout: 120000 })
  await page.getByRole('heading', { name: rulebookAccessibilityTitle, exact: true }).waitFor()
  const rulebookAccessibilityDeepLinkSurvivesReload = await page.getByRole('heading', { name: rulebookAccessibilityTitle, exact: true }).isVisible()
    && await page.evaluate(expectedHash => window.location.hash === expectedHash, rulebookAccessibilityHash)
  const rulebookAccessibilityTableCount = await page.locator('.complete-reading-document table').count()
  const rulebookAccessibilityTableVisible = await page.locator('.complete-reading-document table').first().isVisible()
  const rulebookAccessibilityFigureAlternatives = await Promise.all(
    ['图 1（中文文字替代', '图 2（中文文字替代', '图 3（中文文字替代'].map(label => (
      page.locator('.complete-reading-document blockquote').filter({ hasText: label }).isVisible()
    )),
  )
  const rulebookAccessibilityFigureAlternativeCount = rulebookAccessibilityFigureAlternatives.filter(Boolean).length
  const rulebookAccessibilityExternalLinks = await page.locator('.complete-reading-document a').count()
  await page.screenshot({ path: qaScreenshotPath('rulebook-accessibility-paper.png'), fullPage: false })

  await page.getByRole('link', { name: '找资料', exact: true }).click()
  await page.getByRole('button', { name: /开始学习桌游设计/ }).click()
  await page.getByRole('button', { name: /边玩边学/ }).click()
  await page.getByRole('heading', { name: '边玩边学', exact: true }).waitFor()
  const learnByPlayingEntryActionCount = await page.getByRole('button', { name: '开始第一份完整记录', exact: true }).count()
  await page.getByRole('button', { name: '开始第一份完整记录', exact: true }).click()
  await page.getByRole('heading', { name: learnByPlayingTitle, exact: true }).waitFor()
  const learnByPlayingHash = `#resources/learn/${learnByPlayingContentId}`
  const learnByPlayingDeepLink = await page.evaluate(expectedHash => window.location.hash === expectedHash, learnByPlayingHash)
  const learnByPlayingExternalLinks = await page.locator('.complete-reading-document a').count()
  const learnByPlayingSourceReferences = await page.locator('.complete-reading-document .reading-source-reference').count()
  const learnByPlayingText = await page.locator('.complete-reading-document').innerText()
  const learnByPlayingBoundariesVisible = learnByPlayingText.includes('虚构教学记录')
    && learnByPlayingText.includes('下一回合才会尝试放入王国')
    && learnByPlayingText.includes('我看见')
    && learnByPlayingText.includes('我猜')
  const learnByPlayingBackLabelVisible = await page.getByRole('button', { name: '返回边玩边学', exact: true }).isVisible()
  await page.screenshot({ path: qaScreenshotPath('learn-by-playing-desktop.png'), fullPage: false })
  await page.reload({ waitUntil: 'domcontentloaded', timeout: 120000 })
  await page.getByRole('heading', { name: learnByPlayingTitle, exact: true }).waitFor()
  const learnByPlayingDeepLinkSurvivesReload = await page.evaluate(expectedHash => window.location.hash === expectedHash, learnByPlayingHash)
  await page.getByRole('button', { name: '返回边玩边学', exact: true }).click()
  await page.getByRole('heading', { name: '边玩边学', exact: true }).waitFor()
  const learnByPlayingBackReturnsToEntry = await page.evaluate(() => window.location.hash === '#resources/learn/learn-by-playing')

  await page.getByRole('link', { name: '找资料', exact: true }).click()
  await page.getByRole('button', { name: /开始学习桌游设计/ }).click()
  await page.getByRole('button', { name: /看设计师怎样思考/ }).click()
  await page.getByRole('heading', { name: '看设计师怎样思考', exact: true }).waitFor()
  const designerCaseCount = await page.locator('.resource-designer-case-index > ol > li').count()
  await page.screenshot({ path: qaScreenshotPath('designer-cases-desktop.png'), fullPage: true })
  await page.getByRole('button', { name: /一次只测试一种变化/ }).click()
  await page.getByRole('heading', { name: /一次只测试一种变化/ }).waitFor()
  const caseSections = await page.locator('.complete-reading-document h2').count()
  const caseExternalLinks = await page.locator('.complete-reading-document a').count()
  const caseSourceReferences = await page.locator('.complete-reading-document .reading-source-reference').count()
  const caseBackLabelVisible = await page.getByRole('button', { name: '返回设计师案例', exact: true }).isVisible()
  await page.screenshot({ path: qaScreenshotPath('designer-case-desktop.png'), fullPage: false })

  const newBedfordHash = '#resources/learn/designer-case-new-bedford-manufacturing-constraint'
  await page.goto(qaUrl(newBedfordHash), { waitUntil: 'domcontentloaded', timeout: 120000 })
  await page.getByRole('heading', { name: '一张纸为什么会决定二十座建筑：《New Bedford》把生产限制带回机制', exact: true }).waitFor()
  await page.reload({ waitUntil: 'domcontentloaded', timeout: 120000 })
  await page.getByRole('heading', { name: '一张纸为什么会决定二十座建筑：《New Bedford》把生产限制带回机制', exact: true }).waitFor()
  const newBedfordDeepLinkSurvivesReload = await page.getByRole('heading', { name: '一张纸为什么会决定二十座建筑：《New Bedford》把生产限制带回机制', exact: true }).isVisible()
    && await page.evaluate(expectedHash => window.location.hash === expectedHash, newBedfordHash)
  const newBedfordCaseSections = await page.locator('.complete-reading-document h2').count()
  const newBedfordExternalLinks = await page.locator('.complete-reading-document a').count()
  const newBedfordSourceReferences = await page.locator('.complete-reading-document .reading-source-reference').count()
  await page.screenshot({ path: qaScreenshotPath('new-bedford-case.png'), fullPage: false })

  await page.getByRole('link', { name: '找资料', exact: true }).click()
  await page.getByRole('button', { name: /按正在解决的设计问题找资料/ }).click()
  await page.getByRole('heading', { name: '你现在做到哪一步？', exact: true }).waitFor()
  const problemStageCount = await page.locator('.resource-start-choice').count()
  await page.screenshot({ path: qaScreenshotPath('problem-stages-desktop.png'), fullPage: true })
  await page.getByRole('button', { name: /最小原型/ }).click()
  await page.waitForFunction(() => window.location.hash === '#resources/problems/prototype')
  const stageProblemCount = await page.locator('.resource-start-choice').count()
  await page.getByRole('button', { name: /第一次把点子做上桌/ }).click()
  await page.waitForFunction(() => window.location.hash === '#resources/first-prototype')
  await page.getByRole('heading', { name: '第一次把点子做上桌', exact: true }).waitFor()
  const topicStarterCount = await page.locator('.resource-topic-starters > ol > li').count()
  const topicOldCatalogBlocks = await page.locator('.resource-stage-selector, .resource-search-panel, .resource-result-heading, .resource-list').count()
  await page.reload({ waitUntil: 'domcontentloaded', timeout: 120000 })
  const topicDeepLinkSurvivesReload = await page.getByRole('heading', { name: '第一次把点子做上桌', exact: true }).isVisible()
  const topicContextualToolCount = await page.locator('.contextual-tools li').count()
  await page.screenshot({ path: qaScreenshotPath('topic-desktop.png'), fullPage: true })
  await page.getByRole('button', { name: /原型范围裁剪器/ }).click()
  await page.locator('.prototype-scope-tool').waitFor()
  const topicToolReturnLabel = await page.getByRole('button', { name: '返回这组资料', exact: true }).isVisible()
  await page.getByRole('button', { name: '返回这组资料', exact: true }).click()
  await page.getByRole('heading', { name: '第一次把点子做上桌', exact: true }).waitFor()
  const topicToolReturnsToEntry = await page.evaluate(() => window.location.hash === '#resources/first-prototype')

  await page.getByRole('link', { name: '找资料', exact: true }).click()
  await page.getByRole('button', { name: /从设计师角度分析一款游戏/ }).click()
  await page.getByRole('button', { name: /为什么会产生这种体验/ }).click()
  await page.getByRole('heading', { name: '四步完成一次分析', exact: true }).waitFor()
  const analysisSteps = await page.locator('.resource-analysis-method > ol > li').count()
  const analysisLens = await page.locator('.resource-analysis-lens').innerText()
  const analysisContextualToolCount = await page.locator('.contextual-tools li').count()
  await page.screenshot({ path: qaScreenshotPath('analysis-desktop.png'), fullPage: true })
  await page.getByRole('button', { name: /体验意图卡/ }).click()
  await page.locator('.experience-intent-tool').waitFor()
  const analysisToolReturnLabel = await page.getByRole('button', { name: '返回游戏分析', exact: true }).isVisible()
  await page.getByRole('button', { name: '返回游戏分析', exact: true }).click()
  await page.getByRole('heading', { name: '为什么会产生这种体验？', exact: true }).waitFor()
  const analysisToolReturnsToQuestion = await page.evaluate(() => window.location.hash === '#resources/analyze/experience')

  await page.getByRole('link', { name: '方法与概念', exact: true }).click()
  await page.getByRole('heading', { name: '方法与概念', exact: true }).waitFor()
  const methodLandingChoices = await page.locator('.method-start-page .resource-start-choice').count()
  const methodLandingLede = await page.getByText('不用从第一条读到最后一条。选择今天要查的内容，再回到自己的游戏。', { exact: true }).isVisible()
  const methodActiveNavCount = await page.locator('.header nav [aria-current="page"]').count()
  await page.screenshot({ path: qaScreenshotPath('method-desktop.png'), fullPage: false })
  await page.getByRole('button', { name: /理解一种分析方法/ }).click()
  await page.waitForFunction(() => window.location.hash === '#method/frameworks')
  const methodStableTitle = await page.getByText('按你现在的问题，查一个方法、概念或判断依据。', { exact: true }).isVisible()
  const methodVisibleTabs = await page.locator('.method-tabs button').allTextContents()
  const hiddenResourceReadingTab = await page.getByRole('button', { name: '资源怎么读', exact: true }).count()

  await page.goto(qaUrl('#path'), { waitUntil: 'domcontentloaded', timeout: 120000 })
  await page.getByRole('heading', { name: '你的游戏，现在卡在哪里？', exact: true }).waitFor()
  const legacyPathDeepLink = await page.evaluate(() => window.location.hash === '#path')
  const legacyPathActiveNavCount = await page.locator('.header nav [aria-current="page"]').count()

  await page.goto(qaUrl('#tools/core-loop'), { waitUntil: 'domcontentloaded', timeout: 120000 })
  await page.locator('.core-loop-tool').waitFor()
  await page.reload({ waitUntil: 'domcontentloaded', timeout: 120000 })
  await page.locator('.core-loop-tool').waitFor()
  const legacyToolDeepLink = await page.evaluate(() => window.location.hash === '#tools/core-loop')
  const legacyToolShelfCount = await page.locator('.tool-tabs').count()
  const legacyToolActiveNavCount = await page.locator('.header nav [aria-current="page"]').count()

  const mobileContext = await browser.newContext({ viewport: { width: 390, height: 844 } })
  const mobilePage = await mobileContext.newPage()
  mobilePage.setDefaultTimeout(120000)
  mobilePage.on('console', message => { if (message.type() === 'error') errors.push(`mobile console: ${message.text()}`) })
  mobilePage.on('pageerror', error => errors.push(`mobile page: ${error.message}`))
  await mobilePage.goto(qaUrl('#resources'), { waitUntil: 'domcontentloaded', timeout: 120000 })
  const mobileOverflow = await mobilePage.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1)
  const mobileNavLabels = await mobilePage.locator('.header nav .nav-link').allTextContents()
  const mobileNavTargetHeights = await mobilePage.locator('.header nav .nav-link').evaluateAll(links => links.map(link => link.getBoundingClientRect().height))
  await mobilePage.screenshot({ path: qaScreenshotPath('home-mobile.png'), fullPage: true })
  await mobilePage.keyboard.press('Tab')
  const skipLinkFocused = await mobilePage.getByRole('link', { name: '跳到主要内容', exact: true }).evaluate(element => element === document.activeElement)
  await mobilePage.screenshot({ path: qaScreenshotPath('keyboard-focus.png'), fullPage: false })
  await mobilePage.goto(qaUrl(`#resources/learn/${learnByPlayingContentId}`), { waitUntil: 'domcontentloaded', timeout: 120000 })
  await mobilePage.getByRole('heading', { name: learnByPlayingTitle, exact: true }).waitFor()
  await mobilePage.evaluate(() => {
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur()
  })
  await mobilePage.waitForTimeout(200)
  const mobileLearnByPlayingOverflow = await mobilePage.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1)
  const mobileLearnByPlayingExternalLinks = await mobilePage.locator('.complete-reading-document a').count()
  await mobilePage.screenshot({ path: qaScreenshotPath('learn-by-playing-mobile.png'), fullPage: false })
  await mobilePage.goto(qaUrl(unit04Hash), { waitUntil: 'domcontentloaded', timeout: 120000 })
  await mobilePage.getByRole('heading', { name: '单元 4：最小原型', exact: true }).waitFor()
  const mobileContextualToolCount = await mobilePage.locator('.contextual-tools li').count()
  const mobileContextualOverflow = await mobilePage.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1)
  await mobilePage.screenshot({ path: qaScreenshotPath('contextual-tools-mobile.png'), fullPage: false })

  await mobilePage.setViewportSize({ width: 320, height: 760 })
  await mobilePage.goto(qaUrl('#resources'), { waitUntil: 'domcontentloaded', timeout: 120000 })
  const narrowOverflow = await mobilePage.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1)
  const narrowHeaderOverlap = await mobilePage.evaluate(() => {
    const brand = document.querySelector('.brand')?.getBoundingClientRect()
    const scope = document.querySelector('.internal-scope')?.getBoundingClientRect()
    if (!brand || !scope) return true
    return brand.left < scope.right && brand.right > scope.left && brand.top < scope.bottom && brand.bottom > scope.top
  })

  await mobileContext.close()
  await context.close()
  await browser.close()

  const result = {
    homeChoices,
    oldDefaultBlocks,
    internalScope,
    desktopNavLabels,
    hiddenGlobalDestinations,
    learningChoices,
    availableUnitCount,
    outlineUnitCount,
    sourceReadingCount,
    level02ImageReferences,
    level02ExternalLinks,
    unitSections,
    unitParagraphs,
    unitExternalLinks,
    unitSourceReferences,
    readingNavigationStartsAtTop,
    unit04DeepLinkSurvivesReload,
    unit04ExternalLinks,
    unit04ContextualToolCount,
    toolShelfCount,
    toolRouteActiveNavCount,
    toolReturnLabel,
    contextualToolReturnsToUnit,
    unit05DeepLinkSurvivesReload,
    unit05ExternalLinks,
    unit05NextOpensUnit06,
    unit06DeepLinkSurvivesReload,
    unit06ExternalLinks,
    unit06DemoBoundary,
    rulebookAccessibilityDeepLinkSurvivesReload,
    rulebookAccessibilityTableCount,
    rulebookAccessibilityTableVisible,
    rulebookAccessibilityFigureAlternativeCount,
    rulebookAccessibilityExternalLinks,
    learnByPlayingEntryActionCount,
    learnByPlayingDeepLink,
    learnByPlayingExternalLinks,
    learnByPlayingSourceReferences,
    learnByPlayingBoundariesVisible,
    learnByPlayingBackLabelVisible,
    learnByPlayingDeepLinkSurvivesReload,
    learnByPlayingBackReturnsToEntry,
    designerCaseCount,
    caseSections,
    caseExternalLinks,
    caseSourceReferences,
    caseBackLabelVisible,
    newBedfordDeepLinkSurvivesReload,
    newBedfordCaseSections,
    newBedfordExternalLinks,
    newBedfordSourceReferences,
    problemStageCount,
    stageProblemCount,
    topicStarterCount,
    topicOldCatalogBlocks,
    topicDeepLinkSurvivesReload,
    topicContextualToolCount,
    topicToolReturnLabel,
    topicToolReturnsToEntry,
    analysisSteps,
    analysisLens,
    analysisContextualToolCount,
    analysisToolReturnLabel,
    analysisToolReturnsToQuestion,
    methodLandingChoices,
    methodLandingLede,
    methodStableTitle,
    methodVisibleTabs,
    hiddenResourceReadingTab,
    methodActiveNavCount,
    legacyPathDeepLink,
    legacyPathActiveNavCount,
    legacyToolDeepLink,
    legacyToolShelfCount,
    legacyToolActiveNavCount,
    mobileOverflow,
    mobileNavLabels,
    mobileNavTargetHeights,
    mobileLearnByPlayingOverflow,
    mobileLearnByPlayingExternalLinks,
    mobileContextualToolCount,
    mobileContextualOverflow,
    narrowOverflow,
    narrowHeaderOverlap,
    skipLinkFocused,
    errors,
  }
  console.log(JSON.stringify(result, null, 2))

  const passed = homeChoices === 3
    && oldDefaultBlocks === 0
    && internalScope
    && JSON.stringify(desktopNavLabels) === JSON.stringify(['找资料', '方法与概念'])
    && hiddenGlobalDestinations === 0
    && learningChoices === 4
    && availableUnitCount === 7
    && outlineUnitCount === 9
    && sourceReadingCount === 3
    && level02ImageReferences === 3
    && level02ExternalLinks === 0
    && unitSections >= 8
    && unitParagraphs >= 15
    && unitExternalLinks === 0
    && unitSourceReferences >= 3
    && readingNavigationStartsAtTop
    && unit04DeepLinkSurvivesReload
    && unit04ExternalLinks === 0
    && unit04ContextualToolCount === 1
    && toolShelfCount === 0
    && toolRouteActiveNavCount === 0
    && toolReturnLabel
    && contextualToolReturnsToUnit
    && unit05DeepLinkSurvivesReload
    && unit05ExternalLinks === 0
    && unit05NextOpensUnit06
    && unit06DeepLinkSurvivesReload
    && unit06ExternalLinks === 0
    && unit06DemoBoundary
    && rulebookAccessibilityDeepLinkSurvivesReload
    && rulebookAccessibilityTableCount === 6
    && rulebookAccessibilityTableVisible
    && rulebookAccessibilityFigureAlternativeCount === 3
    && rulebookAccessibilityExternalLinks === 0
    && learnByPlayingEntryActionCount === 1
    && learnByPlayingDeepLink
    && learnByPlayingExternalLinks === 0
    && learnByPlayingSourceReferences >= 5
    && learnByPlayingBoundariesVisible
    && learnByPlayingBackLabelVisible
    && learnByPlayingDeepLinkSurvivesReload
    && learnByPlayingBackReturnsToEntry
    && designerCaseCount === 5
    && caseSections >= 8
    && caseExternalLinks === 0
    && caseSourceReferences >= 1
    && caseBackLabelVisible
    && newBedfordDeepLinkSurvivesReload
    && newBedfordCaseSections >= 8
    && newBedfordExternalLinks === 0
    && newBedfordSourceReferences >= 3
    && problemStageCount === 6
    && stageProblemCount === 3
    && topicStarterCount === 3
    && topicOldCatalogBlocks === 0
    && topicDeepLinkSurvivesReload
    && topicContextualToolCount === 1
    && topicToolReturnLabel
    && topicToolReturnsToEntry
    && analysisSteps === 4
    && analysisLens.includes('MDA')
    && analysisContextualToolCount === 1
    && analysisToolReturnLabel
    && analysisToolReturnsToQuestion
    && methodLandingChoices === 3
    && methodLandingLede
    && methodStableTitle
    && JSON.stringify(methodVisibleTabs) === JSON.stringify(['专题指南', '理论框架', '概念词表'])
    && hiddenResourceReadingTab === 0
    && methodActiveNavCount === 1
    && legacyPathDeepLink
    && legacyPathActiveNavCount === 0
    && legacyToolDeepLink
    && legacyToolShelfCount === 0
    && legacyToolActiveNavCount === 0
    && !mobileOverflow
    && JSON.stringify(mobileNavLabels) === JSON.stringify(['找资料', '方法与概念'])
    && mobileNavTargetHeights.every(height => height >= 44)
    && !mobileLearnByPlayingOverflow
    && mobileLearnByPlayingExternalLinks === 0
    && mobileContextualToolCount === 1
    && !mobileContextualOverflow
    && !narrowOverflow
    && !narrowHeaderOverlap
    && skipLinkFocused
    && errors.length === 0

  if (!passed) process.exit(1)
}

run().catch(error => {
  console.error(error)
  process.exit(1)
})
