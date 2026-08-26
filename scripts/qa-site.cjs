const fs = require('node:fs/promises')
const { spawn } = require('node:child_process')
const { chromium } = require('playwright')
const resources = require('../content/resources.json')
const resourceEntryPoints = require('../content/resource-entry-points.json')

const expectedResourceCount = resources.length
const expectedResourceEntryPointCount = resourceEntryPoints.entryPoints.length

const baseUrl = process.env.QA_BASE_URL || 'http://127.0.0.1:5175/'
const chromePath = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

const wait = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds))
async function waitForServer(url, preview, readPreviewOutput = () => '') {
  if (!preview) return
  for (let attempt = 0; attempt < 240; attempt += 1) {
    if (preview && preview.exitCode !== null) {
      const details = readPreviewOutput().trim()
      throw new Error(`preview server exited with code ${preview.exitCode}${details ? `\n${details}` : ''}`)
    }
    if (readPreviewOutput().includes('Local:')) return
    try {
      const response = await fetch(url)
      if (response.ok) return
    } catch {}
    await wait(250)
  }
  const details = readPreviewOutput().trim()
  preview?.kill('SIGTERM')
  throw new Error(`preview server did not become ready within 60 seconds: ${url}${details ? `\n${details}` : ''}`)
}

async function run() {
  const preview = process.env.QA_BASE_URL ? null : spawn(process.env.PNPM_BIN || 'pnpm', ['preview', '--host', '127.0.0.1', '--port', '5175'], { stdio: ['ignore', 'pipe', 'pipe'] })
  let previewOutput = ''
  preview?.stdout.on('data', chunk => { previewOutput += chunk.toString() })
  preview?.stderr.on('data', chunk => { previewOutput += chunk.toString() })
  await waitForServer(baseUrl, preview, () => previewOutput)
  const browser = await chromium.launch({ executablePath: chromePath, headless: true })
  const context = await browser.newContext({ acceptDownloads: true, viewport: { width: 1440, height: 1000 } })
  const page = await context.newPage()
  page.setDefaultTimeout(5000)
  const errors = []
  page.on('console', message => { if (message.type() === 'error') errors.push(`console: ${message.text()}`) })
  page.on('pageerror', error => errors.push(`page: ${error.message}`))
  page.on('response', response => { if (response.status() >= 400) errors.push(`http ${response.status()}: ${response.url()}`) })

  await page.goto(baseUrl, { waitUntil: 'networkidle' })
  console.log('loaded')
  const initialRouteHash = await page.evaluate(() => window.location.hash)
  const pathNavHref = await page.getByRole('link', { name: '设计路径', exact: true }).getAttribute('href')
  const resourceNavHref = await page.getByRole('link', { name: '资源库', exact: true }).getAttribute('href')
  const toolNavHref = await page.getByRole('link', { name: '工具箱', exact: true }).getAttribute('href')
  const methodNavHref = await page.getByRole('link', { name: '方法', exact: true }).getAttribute('href')
  const skipLinkHref = await page.getByRole('link', { name: '跳到主要内容', exact: true }).getAttribute('href')
  const unfragmentedBaseUrl = baseUrl.split('#')[0]
  await page.goto(`${unfragmentedBaseUrl}#tools/core-loop`, { waitUntil: 'networkidle' })
  const deepLinkedToolPressed = await page.getByRole('button', { name: '核心循环画布', exact: true }).getAttribute('aria-pressed')
  const deepLinkedToolTitle = await page.title()
  await page.reload({ waitUntil: 'networkidle' })
  const deepLinkSurvivesReload = await page.getByRole('button', { name: '核心循环画布', exact: true }).getAttribute('aria-pressed')
  await page.goto(`${unfragmentedBaseUrl}#path`, { waitUntil: 'networkidle' })
  await page.screenshot({ path: 'design/qa/workbench-desktop.png', fullPage: true })

  await page.getByRole('button', { name: '编辑项目护照', exact: true }).click()
  await page.getByLabel('当前版本').fill('v0.4')
  await page.getByLabel('这一版只问什么').fill('公开订单减少后，玩家会更早比较长期航线吗？')
  await page.getByLabel('下一步可执行动作').fill('只把公开订单从 5 张减到 3 张，进行三个交付决定的快速测试。')
  await page.getByLabel('本次版本变化').fill('公开订单从 5 张减到 3 张；其他规则不变。')
  await page.getByRole('button', { name: '保存版本节点', exact: true }).click()
  const projectSaved = await page.getByText('项目护照和版本节点已保存到这台设备。').isVisible()
  const projectVersionText = await page.locator('.project-panel .version').innerText()

  await page.getByRole('button', { name: '核心系统', exact: true }).click()
  const coreActive = await page.getByRole('button', { name: '核心系统', exact: true }).getAttribute('aria-pressed')
  const coreGuideTitle = await page.getByRole('heading', { name: '找到第一条值得反复测试的核心系统' }).innerText()
  const coreGuideSteps = await page.locator('.guide-steps li').count()
  const coreGuideSources = await page.locator('.guide-sources a').count()
  const coreGuideToolCount = await page.locator('.guide-tool-actions button').count()
  const coreToolButton = await page.getByRole('button', { name: '打开核心循环画布' }).isVisible()
  const coreGuideResourceHref = await page.getByRole('link', { name: '继续阅读本阶段精选资源', exact: true }).getAttribute('href')
  await page.getByRole('link', { name: '继续阅读本阶段精选资源', exact: true }).click()
  await page.getByRole('button', { name: '把体验意图接成可重复的核心循环', exact: true }).waitFor()
  const guideResourceHandoffHash = await page.evaluate(() => window.location.hash)
  await page.reload({ waitUntil: 'networkidle' })
  const guideResourceHandoffSurvivesReload = await page.getByRole('button', { name: '把体验意图接成可重复的核心循环', exact: true }).getAttribute('aria-pressed')
  await page.goto(`${unfragmentedBaseUrl}#path`, { waitUntil: 'networkidle' })
  await page.locator('.stuck-row').first().click()
  const firstSelected = await page.locator('.stuck-row').first().getAttribute('aria-pressed')
  const intentGuideTitle = await page.getByRole('heading', { name: '把题材变成可测试的体验意图' }).innerText()
  const intentGuideSteps = await page.locator('.guide-steps li').count()
  const intentGuideToolButton = await page.getByRole('button', { name: '打开体验意图卡', exact: true }).isVisible()
  await page.screenshot({ path: 'design/qa/guide-intent-desktop.png', fullPage: true })

  await page.getByRole('button', { name: '最小原型', exact: true }).click()
  const prototypeGuideTitle = await page.getByRole('heading', { name: '只做这一轮问题需要的原型' }).innerText()
  const prototypeGuideSteps = await page.locator('.guide-steps li').count()
  await page.getByRole('button', { name: '打开原型范围裁剪器', exact: true }).click()
  await page.waitForTimeout(100)
  const prototypeScopeGuideOpened = await page.getByRole('heading', { name: '只做这一轮问题需要的原型', exact: true }).isVisible()
  const prototypeScopeGuideScrollTop = await page.evaluate(() => window.scrollY)
  await page.getByRole('link', { name: '设计路径', exact: true }).click()
  await page.getByRole('button', { name: '最小原型', exact: true }).click()
  await page.getByRole('button', { name: '打开测试计划', exact: true }).click()
  const prototypeTestPlanOpened = await page.getByRole('dialog').isVisible()
  await page.getByRole('button', { name: '关闭' }).click()

  await page.getByRole('button', { name: '测试与反馈', exact: true }).click()
  const feedbackGuideTitle = await page.getByRole('heading', { name: '让一次测试只回答该回答的问题' }).innerText()
  const feedbackGuideSteps = await page.locator('.guide-steps li').count()
  const feedbackGuideToolCount = await page.locator('.guide-tool-actions button').count()
  await page.getByRole('button', { name: '打开反馈分拣', exact: true }).click()
  const feedbackToolOpened = await page.getByRole('heading', { name: '反馈分拣台', exact: true }).isVisible()
  const feedbackToolPressed = await page.getByRole('button', { name: '反馈分拣', exact: true }).getAttribute('aria-pressed')
  await page.getByRole('link', { name: '设计路径', exact: true }).click()

  await page.getByRole('button', { name: '规则与信息', exact: true }).click()
  const rulesGuideTitle = await page.getByRole('heading', { name: '让陌生人靠规则与组件完成第一局' }).innerText()
  const rulesGuideSteps = await page.locator('.guide-steps li').count()
  const rulesGuideSources = await page.locator('.guide-sources a').count()
  const rulesGuideToolCount = await page.locator('.guide-tool-actions button').count()
  const rulesAccessibilityToolButton = await page.getByRole('button', { name: '打开任务无障碍观察', exact: true }).isVisible()
  await page.getByRole('button', { name: '打开测试计划', exact: true }).click()
  const rulesTestPlanOpened = await page.getByRole('dialog').isVisible()
  await page.getByRole('button', { name: '关闭' }).click()

  await page.getByRole('button', { name: '呈现与发布', exact: true }).click()
  const releaseGuideTitle = await page.getByRole('heading', { name: '把可玩的版本整理成可交付的发布包' }).innerText()
  const releaseGuideSteps = await page.locator('.guide-steps li').count()
  const releaseGuideSources = await page.locator('.guide-sources a').count()
  const releaseToolButton = await page.getByRole('button', { name: '打开测试计划', exact: true }).isVisible()
  await page.screenshot({ path: 'design/qa/guide-release-desktop.png', fullPage: true })
  console.log('path interactions')

  const testPlanOpener = page.getByRole('button', { name: '记录一次测试' })
  await testPlanOpener.click()
  const focusedClose = await page.getByRole('button', { name: '关闭' }).evaluate(element => element === document.activeElement)
  await page.keyboard.press('Escape')
  const testPlanFocusRestored = await testPlanOpener.evaluate(element => element === document.activeElement)
  const resourceCatalogLoadedBeforeIntent = await page.evaluate(() => performance.getEntriesByType('resource').some(entry => entry.name.includes('resource-catalog')))
  await page.getByRole('link', { name: '资源库' }).click()
  await page.getByRole('button', { name: `查看全部 ${expectedResourceCount} 条` }).waitFor()
  const resourceCatalogLoadedForCuratedEntry = await page.evaluate(() => performance.getEntriesByType('resource').some(entry => entry.name.includes('resource-catalog')))
  const defaultEntryPackageLoaded = await page.evaluate(() => performance.getEntriesByType('resource').some(entry => entry.name.includes('first-prototype')))
  const resourceEntryPointCount = await page.locator('.resource-entry-tabs button').count()
  const curatedResourceCount = await page.locator('.resource-row').count()
  const curatedEntryText = await page.locator('.resource-entry-detail').innerText()
  const curatedAssessmentText = await page.locator('.resource-row').first().innerText()
  await page.getByRole('button', { name: `查看全部 ${expectedResourceCount} 条` }).click()
  await page.locator('.resource-row').nth(expectedResourceCount - 1).waitFor()
  const resourceCatalogLoadedAfterFullIntent = await page.evaluate(() => performance.getEntriesByType('resource').some(entry => entry.name.includes('resource-catalog')))
  const resourceCount = await page.locator('.resource-row').count()
  await page.getByLabel('搜索标题、作者、类型、用途或限制').fill('Wingspan')
  const searchedResourceCount = await page.locator('.resource-row').count()
  const searchedResourceTitle = await page.locator('.resource-row h2').first().innerText()
  await page.getByLabel('搜索标题、作者、类型、用途或限制').fill('')
  await page.getByRole('button', { name: '最小原型', exact: true }).click()
  const filteredResourceCount = await page.locator('.resource-row').count()
  await page.getByRole('button', { name: '全部阶段', exact: true }).click()
  await page.getByLabel('适合谁').selectOption('beginner')
  const beginnerResourceCount = await page.locator('.resource-row').count()
  await page.getByLabel('语言').selectOption('中文')
  const beginnerChineseCount = await page.locator('.resource-row').count()
  await page.getByLabel('搜索标题、作者、类型、用途或限制').fill('绝对不存在的资源关键词')
  const resourceEmptyState = await page.getByRole('heading', { name: '没有同时满足这些条件的资源' }).isVisible()
  await page.getByRole('button', { name: '查看全部资源', exact: false }).click()
  await page.screenshot({ path: 'design/qa/resources-desktop.png', fullPage: true })
  console.log('resources filtered')

  const frameworkCatalogLoadedBeforeIntent = await page.evaluate(() => performance.getEntriesByType('resource').some(entry => entry.name.includes('framework-catalog')))
  await page.getByRole('link', { name: '方法' }).click()
  await page.locator('.framework-tab').first().waitFor()
  const frameworkCatalogLoadedAfterIntent = await page.evaluate(() => performance.getEntriesByType('resource').some(entry => entry.name.includes('framework-catalog')))
  const frameworkCount = await page.locator('.framework-tab').count()
  await page.locator('.framework-tab').filter({ hasText: 'AutoBG' }).click()
  const frameworkRouteHash = await page.evaluate(() => window.location.hash)
  const frameworkHeading = await page.locator('.framework-sheet h2').innerText()
  const frameworkMoves = await page.locator('.framework-moves li').count()
  const frameworkSource = await page.locator('.source-link').getAttribute('href')
  await page.screenshot({ path: 'design/qa/theory-desktop.png', fullPage: true })
  console.log('theory framework switched')

  const glossaryCatalogLoadedBeforeIntent = await page.evaluate(() => performance.getEntriesByType('resource').some(entry => entry.name.includes('glossary-catalog')))
  await page.getByRole('button', { name: '概念词表', exact: true }).click()
  await page.locator('.glossary-row').first().waitFor()
  const glossaryCatalogLoadedAfterIntent = await page.evaluate(() => performance.getEntriesByType('resource').some(entry => entry.name.includes('glossary-catalog')))
  const glossaryCount = await page.locator('.glossary-row').count()
  await page.getByLabel('搜索概念、别名或例子').fill('保真度')
  await page.waitForFunction(() => window.location.hash === '#method/glossary/prototype-fidelity')
  const glossaryRouteHash = await page.evaluate(() => window.location.hash)
  const glossarySearchCount = await page.locator('.glossary-row').count()
  const glossaryHeading = await page.locator('.glossary-sheet h2').innerText()
  const glossaryBoundary = await page.locator('.glossary-sheet').innerText()
  const specialGuideCatalogLoadedBeforeConceptHandoff = await page.evaluate(() => performance.getEntriesByType('resource').some(entry => entry.name.includes('special-guide-catalog')))
  const conceptGuideHandoffHref = await page.getByRole('link', { name: /这轮应该怎么测试/ }).getAttribute('href')
  const conceptToolHandoffHref = await page.getByRole('link', { name: '打开原型范围裁剪器', exact: true }).getAttribute('href')
  await page.screenshot({ path: 'design/qa/glossary-desktop.png', fullPage: true })
  await page.getByRole('link', { name: /这轮应该怎么测试/ }).click()
  await page.getByRole('heading', { name: '这轮应该怎么测试', exact: true }).waitFor()
  const conceptGuideHandoffHash = await page.evaluate(() => window.location.hash)
  const specialGuideCatalogLoadedAfterConceptHandoff = await page.evaluate(() => performance.getEntriesByType('resource').some(entry => entry.name.includes('special-guide-catalog')))
  await page.goBack({ waitUntil: 'networkidle' })
  await page.getByRole('heading', { name: '原型精度', exact: true }).waitFor()
  const conceptHandoffBackHash = await page.evaluate(() => window.location.hash)
  await page.getByRole('link', { name: '打开原型范围裁剪器', exact: true }).click()
  await page.locator('.prototype-scope-tool').waitFor()
  const conceptToolHandoffHash = await page.evaluate(() => window.location.hash)
  await page.goBack({ waitUntil: 'networkidle' })
  await page.getByRole('link', { name: /这轮应该怎么测试/ }).click()
  await page.getByRole('link', { name: '原型精度', exact: true }).click()
  await page.getByRole('heading', { name: '原型精度', exact: true }).waitFor()
  const guideConceptHandoffHash = await page.evaluate(() => window.location.hash)

  await page.getByRole('button', { name: '资源怎么读', exact: true }).click()
  const rubricCount = await page.locator('.rubric-strip article').count()
  await page.getByLabel('搜索待判断的资源').fill('AutoBG')
  await page.waitForFunction(() => window.location.hash.includes('#method/resource-reading/'))
  const resourceReadingRouteHash = await page.evaluate(() => window.location.hash)
  const assessmentSearchCount = await page.locator('.assessment-row').count()
  const assessmentDimensionCount = await page.locator('.assessment-sheet dl > div').count()
  const assessmentText = await page.locator('.assessment-sheet').innerText()
  await page.screenshot({ path: 'design/qa/resource-reading-desktop.png', fullPage: true })
  console.log('glossary and resource-reading checked')

  await page.getByRole('button', { name: '专题指南', exact: true }).click()
  await page.locator('.special-guide-row').first().waitFor()
  const specialGuideCatalogLoadedAfterIntent = await page.evaluate(() => performance.getEntriesByType('resource').some(entry => entry.name.includes('special-guide-catalog')))
  const specialGuideCount = await page.locator('.special-guide-row').count()
  const specialGuideFirstTitle = await page.locator('.special-guide-detail h2').first().innerText()
  const specialGuideFirstSteps = await page.locator('.special-guide-detail .guide-steps li').count()
  await page.locator('.special-guide-row').nth(1).click()
  const specialGuideSecondTitle = await page.locator('.special-guide-detail h2').first().innerText()
  const specialGuideSecondSteps = await page.locator('.special-guide-detail .guide-steps li').count()
  const specialGuideRouteHash = await page.evaluate(() => window.location.hash)
  await page.reload({ waitUntil: 'networkidle' })
  const specialGuideRouteSurvivesReload = await page.locator('.special-guide-row').nth(1).getAttribute('aria-pressed')
  await page.locator('.special-guide-row').nth(2).click()
  const specialGuideThirdTitle = await page.locator('.special-guide-detail h2').first().innerText()
  const specialGuideThirdSteps = await page.locator('.special-guide-detail .guide-steps li').count()
  const specialGuideThirdBoundary = await page.locator('.special-guide-detail .guide-footer section').nth(1).innerText()
  await page.locator('.special-guide-row').nth(3).click()
  const specialGuideFourthTitle = await page.locator('.special-guide-detail h2').first().innerText()
  const specialGuideFourthSteps = await page.locator('.special-guide-detail .guide-steps li').count()
  const specialGuideFourthBoundary = await page.locator('.special-guide-detail .guide-footer section').nth(1).innerText()
  await page.locator('.special-guide-row').nth(4).click()
  const specialGuideFifthTitle = await page.locator('.special-guide-detail h2').first().innerText()
  const specialGuideFifthSteps = await page.locator('.special-guide-detail .guide-steps li').count()
  const specialGuideFifthBoundary = await page.locator('.special-guide-detail .guide-footer section').nth(1).innerText()
  await page.locator('.special-guide-row').nth(5).click()
  const specialGuideSixthTitle = await page.locator('.special-guide-detail h2').first().innerText()
  const specialGuideSixthSteps = await page.locator('.special-guide-detail .guide-steps li').count()
  const specialGuideSixthBoundary = await page.locator('.special-guide-detail .guide-footer section').nth(1).innerText()
  await page.locator('.special-guide-row').nth(6).click()
  const specialGuideSeventhTitle = await page.locator('.special-guide-detail h2').first().innerText()
  const specialGuideSeventhSteps = await page.locator('.special-guide-detail .guide-steps li').count()
  const specialGuideSeventhBoundary = await page.locator('.special-guide-detail .guide-footer section').nth(1).innerText()
  await page.locator('.special-guide-row').nth(7).click()
  const specialGuideEighthTitle = await page.locator('.special-guide-detail h2').first().innerText()
  const specialGuideEighthSteps = await page.locator('.special-guide-detail .guide-steps li').count()
  const specialGuideEighthBoundary = await page.locator('.special-guide-detail .guide-footer section').nth(1).innerText()
  await page.locator('.special-guide-row').nth(8).click()
  const specialGuideNinthTitle = await page.locator('.special-guide-detail h2').first().innerText()
  const specialGuideNinthSteps = await page.locator('.special-guide-detail .guide-steps li').count()
  const specialGuideNinthBoundary = await page.locator('.special-guide-detail .guide-footer section').nth(1).innerText()
  await page.locator('.special-guide-row').nth(9).click()
  const specialGuideTenthTitle = await page.locator('.special-guide-detail h2').first().innerText()
  const specialGuideTenthSteps = await page.locator('.special-guide-detail .guide-steps li').count()
  const specialGuideTenthBoundary = await page.locator('.special-guide-detail .guide-footer section').nth(1).innerText()
  await page.locator('.special-guide-row').nth(10).click()
  const specialGuideEleventhTitle = await page.locator('.special-guide-detail h2').first().innerText()
  const specialGuideEleventhSteps = await page.locator('.special-guide-detail .guide-steps li').count()
  const specialGuideEleventhBoundary = await page.locator('.special-guide-detail .guide-footer section').nth(1).innerText()
  await page.locator('.special-guide-row').nth(11).click()
  const specialGuideTwelfthTitle = await page.locator('.special-guide-detail h2').first().innerText()
  const specialGuideTwelfthSteps = await page.locator('.special-guide-detail .guide-steps li').count()
  const specialGuideTwelfthBoundary = await page.locator('.special-guide-detail .guide-footer section').nth(1).innerText()
  await page.locator('.special-guide-row').nth(12).click()
  const specialGuideThirteenthTitle = await page.locator('.special-guide-detail h2').first().innerText()
  const specialGuideThirteenthSteps = await page.locator('.special-guide-detail .guide-steps li').count()
  const specialGuideThirteenthBoundary = await page.locator('.special-guide-detail .guide-footer section').nth(1).innerText()
  await page.locator('.special-guide-row').nth(13).click()
  const specialGuideFourteenthTitle = await page.locator('.special-guide-detail h2').first().innerText()
  const specialGuideFourteenthSteps = await page.locator('.special-guide-detail .guide-steps li').count()
  const specialGuideFourteenthBoundary = await page.locator('.special-guide-detail .guide-footer section').nth(1).innerText()
  await page.locator('.special-guide-row').nth(14).click()
  const specialGuideFifteenthTitle = await page.locator('.special-guide-detail h2').first().innerText()
  const specialGuideFifteenthSteps = await page.locator('.special-guide-detail .guide-steps li').count()
  const specialGuideFifteenthBoundary = await page.locator('.special-guide-detail .guide-footer section').nth(1).innerText()
  await page.locator('.special-guide-row').nth(15).click()
  const specialGuideSixteenthTitle = await page.locator('.special-guide-detail h2').first().innerText()
  const specialGuideSixteenthSteps = await page.locator('.special-guide-detail .guide-steps li').count()
  const specialGuideSixteenthBoundary = await page.locator('.special-guide-detail .guide-footer section').nth(1).innerText()
  await page.locator('.special-guide-row').nth(16).click()
  const specialGuideSeventeenthTitle = await page.locator('.special-guide-detail h2').first().innerText()
  const specialGuideSeventeenthSteps = await page.locator('.special-guide-detail .guide-steps li').count()
  const specialGuideSeventeenthBoundary = await page.locator('.special-guide-detail .guide-footer section').nth(1).innerText()
  await page.locator('.special-guide-row').nth(17).click()
  const specialGuideEighteenthTitle = await page.locator('.special-guide-detail h2').first().innerText()
  const specialGuideEighteenthSteps = await page.locator('.special-guide-detail .guide-steps li').count()
  const specialGuideEighteenthBoundary = await page.locator('.special-guide-detail .guide-footer section').nth(1).innerText()
  await page.locator('.special-guide-row').nth(18).click()
  const specialGuideNineteenthTitle = await page.locator('.special-guide-detail h2').first().innerText()
  const specialGuideNineteenthSteps = await page.locator('.special-guide-detail .guide-steps li').count()
  const specialGuideNineteenthBoundary = await page.locator('.special-guide-detail .guide-footer section').nth(1).innerText()
  await page.locator('.special-guide-row').nth(19).click()
  const specialGuideTwentiethTitle = await page.locator('.special-guide-detail h2').first().innerText()
  const specialGuideTwentiethSteps = await page.locator('.special-guide-detail .guide-steps li').count()
  const specialGuideTwentiethBoundary = await page.locator('.special-guide-detail .guide-footer section').nth(1).innerText()
  await page.locator('.special-guide-row').nth(20).click()
  const specialGuideTwentyFirstTitle = await page.locator('.special-guide-detail h2').first().innerText()
  const specialGuideTwentyFirstSteps = await page.locator('.special-guide-detail .guide-steps li').count()
  const specialGuideTwentyFirstBoundary = await page.locator('.special-guide-detail .guide-footer section').nth(1).innerText()
  await page.locator('.special-guide-row').nth(21).click()
  const specialGuideTwentySecondTitle = await page.locator('.special-guide-detail h2').first().innerText()
  const specialGuideTwentySecondSteps = await page.locator('.special-guide-detail .guide-steps li').count()
  const specialGuideTwentySecondBoundary = await page.locator('.special-guide-detail .guide-footer section').nth(1).innerText()
  await page.locator('.special-guide-row').nth(22).click()
  const specialGuideTwentyThirdTitle = await page.locator('.special-guide-detail h2').first().innerText()
  const specialGuideTwentyThirdSteps = await page.locator('.special-guide-detail .guide-steps li').count()
  const specialGuideTwentyThirdBoundary = await page.locator('.special-guide-detail .guide-footer section').nth(1).innerText()
  await page.locator('.special-guide-row').nth(23).click()
  const specialGuideTwentyFourthTitle = await page.locator('.special-guide-detail h2').first().innerText()
  const specialGuideTwentyFourthSteps = await page.locator('.special-guide-detail .guide-steps li').count()
  const specialGuideTwentyFourthBoundary = await page.locator('.special-guide-detail .guide-footer section').nth(1).innerText()
  await page.locator('.special-guide-row').nth(24).click()
  const specialGuideTwentyFifthTitle = await page.locator('.special-guide-detail h2').first().innerText()
  const specialGuideTwentyFifthSteps = await page.locator('.special-guide-detail .guide-steps li').count()
  const specialGuideTwentyFifthBoundary = await page.locator('.special-guide-detail .guide-footer section').nth(1).innerText()
  await page.locator('.special-guide-row').nth(25).click()
  const specialGuideTwentySixthTitle = await page.locator('.special-guide-detail h2').first().innerText()
  const specialGuideTwentySixthSteps = await page.locator('.special-guide-detail .guide-steps li').count()
  const specialGuideTwentySixthBoundary = await page.locator('.special-guide-detail .guide-footer section').nth(1).innerText()
  await page.locator('.special-guide-row').nth(26).click()
  const specialGuideTwentySeventhTitle = await page.locator('.special-guide-detail h2').first().innerText()
  const specialGuideTwentySeventhSteps = await page.locator('.special-guide-detail .guide-steps li').count()
  const specialGuideTwentySeventhBoundary = await page.locator('.special-guide-detail .guide-footer section').nth(1).innerText()
  await page.locator('.special-guide-row').nth(27).click()
  const specialGuideTwentyEighthTitle = await page.locator('.special-guide-detail h2').first().innerText()
  const specialGuideTwentyEighthSteps = await page.locator('.special-guide-detail .guide-steps li').count()
  const specialGuideTwentyEighthBoundary = await page.locator('.special-guide-detail .guide-footer section').nth(1).innerText()
  await page.locator('.special-guide-row').nth(28).click()
  const specialGuideTwentyNinthTitle = await page.locator('.special-guide-detail h2').first().innerText()
  const specialGuideTwentyNinthSteps = await page.locator('.special-guide-detail .guide-steps li').count()
  const specialGuideTwentyNinthBoundary = await page.locator('.special-guide-detail .guide-footer section').nth(1).innerText()
  await page.locator('.special-guide-row').nth(29).click()
  const specialGuideThirtiethTitle = await page.locator('.special-guide-detail h2').first().innerText()
  const specialGuideThirtiethSteps = await page.locator('.special-guide-detail .guide-steps li').count()
  const specialGuideThirtiethBoundary = await page.locator('.special-guide-detail .guide-footer section').nth(1).innerText()
  await page.locator('.special-guide-row').nth(30).click()
  const specialGuideThirtyFirstTitle = await page.locator('.special-guide-detail h2').first().innerText()
  const specialGuideThirtyFirstSteps = await page.locator('.special-guide-detail .guide-steps li').count()
  const specialGuideThirtyFirstBoundary = await page.locator('.special-guide-detail .guide-footer section').nth(1).innerText()
  await page.locator('.special-guide-row').nth(9).click()
  await page.getByRole('button', { name: '打开发布路线责任图', exact: true }).click()
  await page.waitForTimeout(100)
  const routeGuideToolOpened = await page.getByRole('heading', { name: '发布路线责任图', exact: true }).isVisible()
  const routeGuideScrollTop = await page.evaluate(() => window.scrollY)
  await page.getByRole('link', { name: '方法', exact: true }).click()
  await page.getByRole('button', { name: '专题指南', exact: true }).click()
  await page.locator('.special-guide-row').nth(8).click()
  const productionLedgerLoadedBeforeIntent = await page.evaluate(() => performance.getEntriesByType('resource').some(entry => entry.name.includes('production-ledger-tool')))
  await page.getByRole('button', { name: '打开生产假设账本', exact: true }).click()
  await page.waitForTimeout(100)
  const productionGuideToolOpened = await page.getByRole('heading', { name: '生产假设账本', exact: true }).isVisible()
  const productionLedgerLoadedAfterIntent = await page.evaluate(() => performance.getEntriesByType('resource').some(entry => entry.name.includes('production-ledger-tool')))
  const productionGuideScrollTop = await page.evaluate(() => window.scrollY)
  await page.getByRole('link', { name: '方法', exact: true }).click()
  await page.getByRole('button', { name: '专题指南', exact: true }).click()
  await page.locator('.special-guide-row').nth(7).click()
  await page.getByRole('button', { name: '打开主题承诺与伤害复核', exact: true }).click()
  await page.waitForTimeout(100)
  const themeReviewGuideToolOpened = await page.getByRole('heading', { name: '主题承诺与伤害复核', exact: true }).isVisible()
  const themeReviewGuideScrollTop = await page.evaluate(() => window.scrollY)
  await page.getByRole('link', { name: '方法', exact: true }).click()
  await page.getByRole('button', { name: '专题指南', exact: true }).click()
  await page.locator('.special-guide-row').nth(6).click()
  await page.getByRole('button', { name: '打开共享决定观察', exact: true }).click()
  await page.waitForTimeout(100)
  const sharedDecisionGuideToolOpened = await page.getByRole('heading', { name: '共享决定观察', exact: true }).isVisible()
  const sharedDecisionGuideScrollTop = await page.evaluate(() => window.scrollY)
  await page.getByRole('link', { name: '方法', exact: true }).click()
  await page.getByRole('button', { name: '专题指南', exact: true }).click()
  await page.locator('.special-guide-row').nth(5).click()
  await page.getByRole('button', { name: '打开单轮决定轨迹', exact: true }).click()
  await page.waitForTimeout(100)
  const decisionGuideToolOpened = await page.getByRole('heading', { name: '单轮决定轨迹', exact: true }).isVisible()
  const decisionGuideScrollTop = await page.evaluate(() => window.scrollY)
  await page.getByRole('link', { name: '方法', exact: true }).click()
  await page.getByRole('button', { name: '专题指南', exact: true }).click()
  await page.locator('.special-guide-row').nth(4).click()
  await page.getByRole('button', { name: '打开单任务学习路径', exact: true }).click()
  await page.waitForTimeout(100)
  const teachingGuideToolOpened = await page.getByRole('heading', { name: '单任务学习路径', exact: true }).isVisible()
  const teachingGuideScrollTop = await page.evaluate(() => window.scrollY)
  await page.getByRole('link', { name: '方法', exact: true }).click()
  await page.getByRole('button', { name: '专题指南', exact: true }).click()
  await page.locator('.special-guide-row').first().click()
  await page.screenshot({ path: 'design/qa/special-guides-desktop.png', fullPage: true })
  await page.getByRole('button', { name: '选择这轮测试方式', exact: true }).click()
  await page.waitForTimeout(100)
  const specialGuideToolOpened = await page.getByRole('heading', { name: '这轮应该怎么测试？', exact: true }).isVisible()
  const specialGuideScrollTop = await page.evaluate(() => window.scrollY)
  await page.getByRole('link', { name: '方法', exact: true }).click()
  await page.getByRole('button', { name: '专题指南', exact: true }).click()
  await page.locator('.special-guide-row').nth(2).click()
  await page.getByRole('button', { name: '打开任务无障碍观察', exact: true }).click()
  await page.waitForTimeout(100)
  const accessibilityGuideToolOpened = await page.getByRole('heading', { name: '任务无障碍观察', exact: true }).isVisible()
  const accessibilityGuideScrollTop = await page.evaluate(() => window.scrollY)
  await page.getByRole('link', { name: '方法', exact: true }).click()
  await page.getByRole('button', { name: '专题指南', exact: true }).click()
  await page.locator('.special-guide-row').nth(29).click()
  await page.getByRole('button', { name: '打开内容版本治理工作台', exact: true }).click()
  await page.waitForTimeout(100)
  const governanceGuideToolOpened = await page.getByRole('heading', { name: '让旧版玩家找到今天该用哪一份文字', exact: true }).isVisible()
  const governanceGuideScrollTop = await page.evaluate(() => window.scrollY)
  console.log('special guides switched and opened tool')

  await page.getByRole('link', { name: '工具箱' }).click()
  await page.getByRole('button', { name: '改造熟悉游戏', exact: true }).click()
  await page.getByLabel('01 · 选一个熟悉的简单游戏').fill('飞行棋')
  await page.getByLabel('02 · 希望玩家多经历什么？').fill('更多有后果的选择')
  await page.getByLabel('03 · 这一轮只改变').selectOption('移动')
  await page.getByLabel('04 · 哪些核心保持不变？').fill('保留棋盘、终点和先到终点获胜')
  await page.getByLabel('05 · 写成一条可执行规则').fill('每回合从两张移动牌中选择一张决定移动距离')
  await page.getByLabel('06 · 预测桌面上会发生什么').fill('玩家会保留高点数牌等待关键时机')
  await page.getByLabel('08 · 只问一个测试问题').fill('玩家会为了关键时机保留高点数牌吗？')
  await page.getByRole('button', { name: '保存这次改造' }).click()
  const redesignSaved = await page.getByText('已保存这次改造。现在做原型，只验证这一条预测。').isVisible()
  const redesignSummary = await page.locator('.redesign-sheet').innerText()
  const redesignDownloadPromise = page.waitForEvent('download')
  await page.getByRole('button', { name: /导出练习 JSON/ }).click()
  const redesignDownload = await redesignDownloadPromise
  const exportedRedesign = JSON.parse(await fs.readFile(await redesignDownload.path(), 'utf8'))
  await page.screenshot({ path: 'design/qa/redesign-lab-desktop.png', fullPage: true })
  console.log('redesign exercise saved and exported')

  await page.getByRole('button', { name: '设计约束牌', exact: true }).click()
  const constraintCardCount = await page.locator('.constraint-cards article').count()
  const constraintBefore = await page.locator('.constraint-sheet h2').innerText()
  await page.getByLabel('03 · 只写一条规则改动').fill('玩家抵达港口后必须留下一枚货物，直到下一座港口才能交付。')
  await page.getByLabel('04 · 行为预测').fill('玩家会提前比较两个港口，并至少一次为了未来港口保留高价值货物。')
  await page.getByLabel('05 · 最短测试问题').fill('三个交付决定内，玩家会主动保留至少一次货物吗？')
  await page.getByRole('button', { name: '保存为设计实验' }).click()
  const constraintSaved = await page.getByText('已保存为设计实验。随机组合仍需要上桌验证。').isVisible()
  const constraintSummary = await page.locator('.constraint-sheet').innerText()
  const constraintDownloadPromise = page.waitForEvent('download')
  await page.getByRole('button', { name: /导出 JSON/ }).click()
  const constraintDownload = await constraintDownloadPromise
  const exportedConstraint = JSON.parse(await fs.readFile(await constraintDownload.path(), 'utf8'))
  await page.getByRole('button', { name: '抽取一组新约束' }).click()
  const constraintAfter = await page.locator('.constraint-sheet h2').innerText()
  await page.screenshot({ path: 'design/qa/constraint-deck-desktop.png', fullPage: true })
  console.log('constraint experiment saved, exported and redrawn')

  await page.getByRole('button', { name: '单风险平衡诊断', exact: true }).click()
  await page.getByLabel('10 · 什么结果会反驳当前解释').fill('如果交换座位后优势始终跟随玩家而不是座位，先手复利假设被反驳。')
  await page.getByRole('button', { name: '保存平衡诊断单' }).click()
  const balanceSaved = await page.getByText('诊断单已保存。它定义下一次实验，不判定整款游戏“已经平衡”。').isVisible()
  const balanceSummary = await page.locator('.balance-sheet').innerText()
  const balanceDownloadPromise = page.waitForEvent('download')
  await page.getByRole('button', { name: /导出 JSON/ }).click()
  const balanceDownload = await balanceDownloadPromise
  const exportedBalance = JSON.parse(await fs.readFile(await balanceDownload.path(), 'utf8'))
  const balanceStored = await page.evaluate(() => JSON.parse(localStorage.getItem('tabletop-workshop-balance-passes-v1') || '{}'))
  await page.screenshot({ path: 'design/qa/balance-pass-desktop.png', fullPage: true })
  console.log('balance pass saved and exported without aggregate score')

  await page.getByRole('button', { name: '单轮决定轨迹', exact: true }).click()
  await page.getByLabel('07 · 玩家实际考虑的选项').fill('玩家只比较购买北港与交付蓝货，没有提到东港或保留金币。')
  await page.getByLabel('11 · 其他玩家怎样影响这条路径（可选）').fill('对手占用北港唯一泊位，封锁当前玩家下一轮路线。')
  await page.getByLabel('14 · 实际后果').fill('对手进入北港并占用泊位；当前玩家下一轮无法完成原计划。')
  await page.getByLabel('15 · 玩家怎样更新了自己的模型').fill('玩家说下一次会先检查对手位置与可封锁的泊位。')
  await page.getByRole('button', { name: '保存决定轨迹' }).click()
  const decisionTraceSaved = await page.getByText('决定轨迹已保存。它记录玩家当时的模型，不给决定、玩家或游戏打分。').isVisible()
  const decisionTraceSummary = await page.locator('.decision-trace-sheet').innerText()
  const decisionTraceDownloadPromise = page.waitForEvent('download')
  await page.getByRole('button', { name: /导出 JSON/ }).click()
  const decisionTraceDownload = await decisionTraceDownloadPromise
  const exportedDecisionTrace = JSON.parse(await fs.readFile(await decisionTraceDownload.path(), 'utf8'))
  const decisionTraceStored = await page.evaluate(() => JSON.parse(localStorage.getItem('tabletop-workshop-decision-traces-v1') || '{}'))
  await page.screenshot({ path: 'design/qa/decision-trace-desktop.png', fullPage: true })
  console.log('decision trace saved and exported without aggregate score')

  await page.getByRole('button', { name: '共享决定观察', exact: true }).click()
  await page.getByLabel('09 · 回应、反提案、中断与沉默').fill('蓝追问风险；红在绿回答前要求执行；蓝没有再次回应，原因无法判断。')
  await page.getByLabel('14 · 中性核对后的玩家原话或意愿').fill('蓝说愿意听两个选项，但希望由自己拍板。')
  await page.getByLabel('16 · 第一次权力或参与错位').fill('参与约定要求驾驶员拍板，但红在蓝回应前把提案变成执行指令。')
  await page.getByRole('button', { name: '保存共享决定观察' }).click()
  const sharedDecisionSaved = await page.getByText('共享决定观察已保存。它记录当前桌面关系，不给玩家的发言、领导或合作能力打分。').isVisible()
  const sharedDecisionSummary = await page.locator('.shared-decision-sheet').innerText()
  const sharedDecisionDownloadPromise = page.waitForEvent('download')
  await page.getByRole('button', { name: /导出 JSON/ }).click()
  const sharedDecisionDownload = await sharedDecisionDownloadPromise
  const exportedSharedDecision = JSON.parse(await fs.readFile(await sharedDecisionDownload.path(), 'utf8'))
  const sharedDecisionStored = await page.evaluate(() => JSON.parse(localStorage.getItem('tabletop-workshop-shared-decisions-v1') || '{}'))
  await page.screenshot({ path: 'design/qa/shared-decision-desktop.png', fullPage: true })
  console.log('shared decision observation saved and exported without aggregate score')

  await page.getByRole('button', { name: '主题与伤害复核', exact: true }).click()
  await page.getByLabel('15 · 购买/组局前的具体内容提示').fill('玩家会扮演政策决策者，选择削减医疗或教育；该模块可开局前移除。')
  await page.getByLabel('17 · 承诺与系统的第一处不匹配').fill('承诺关于社群自治，但终局仍只奖励债务清零。')
  await page.getByLabel('18 · 下一版只改或只补一件事').fill('下版只改终局：债务、公共品与自治同时达到下限。')
  await page.getByRole('button', { name: '保存复核' }).click()
  const themeReviewSaved = await page.getByText('复核已保存。它不证明作品安全、无害、真实或被某个社群认可。').isVisible()
  const themeReviewSummary = await page.locator('.theme-review-sheet').innerText()
  const themeReviewDownloadPromise = page.waitForEvent('download')
  await page.getByRole('button', { name: /\u5bfc\u51fa JSON/ }).click()
  const themeReviewDownload = await themeReviewDownloadPromise
  const exportedThemeReview = JSON.parse(await fs.readFile(await themeReviewDownload.path(), 'utf8'))
  const themeReviewStored = await page.evaluate(() => JSON.parse(localStorage.getItem('tabletop-workshop-theme-reviews-v1') || '{}'))
  await page.screenshot({ path: 'design/qa/theme-review-desktop.png', fullPage: true })
  console.log('theme review saved and exported without aggregate score or safety certification')

  await page.getByRole('button', { name: '生产假设账本', exact: true }).click()
  await page.getByRole('button', { name: '增加一个组件', exact: false }).click()
  await page.getByLabel('名称', { exact: true }).last().fill('规则书')
  await page.getByLabel('每盒数量', { exact: true }).last().fill('1 本/盒')
  await page.getByLabel('尺寸 / 材料 / 印刷或加工', { exact: true }).last().fill('148×210mm；24 页；骑马钉；全彩。')
  await page.getByLabel('玩家或系统功能', { exact: true }).last().fill('支持独立设置、首局学习和局中查询。')
  await page.getByLabel('备选方案与同任务复测', { exact: true }).last().fill('若改折页，复测设置、第一次决定和三个高频查询。')
  await page.getByLabel('规格证据状态', { exact: true }).last().selectOption('设计者粗估')
  const productionComponentCount = await page.locator('.production-component-row').count()
  await page.getByRole('button', { name: '保存生产假设', exact: true }).click()
  const productionSaved = await page.getByText('生产假设已保存。它不是报价、价格预测、合规意见或可持续认证。').isVisible()
  const productionSummary = await page.locator('.production-ledger-sheet').innerText()
  const productionDownloadPromise = page.waitForEvent('download')
  await page.getByRole('button', { name: /导出 JSON/ }).click()
  const productionDownload = await productionDownloadPromise
  const exportedProduction = JSON.parse(await fs.readFile(await productionDownload.path(), 'utf8'))
  const productionStored = await page.evaluate(() => JSON.parse(localStorage.getItem('tabletop-workshop-production-ledgers-v1') || '{}'))
  await page.screenshot({ path: 'design/qa/production-ledger-desktop.png', fullPage: true })
  console.log('production assumptions saved and exported without price prediction or compliance claim')

  await page.getByRole('button', { name: '发布路线责任图', exact: true }).click()
  const productizationRow = page.locator('.route-responsibility-row').nth(1)
  await productizationRow.getByLabel('当前责任人').selectOption('出版方')
  await productizationRow.getByLabel('责任证据').selectOption('书面沟通')
  await page.getByLabel('13 · 下一条最小证据').fill('核验一家目标出版方的当前投稿页，并保存链接、日期、第一轮材料和是否允许主动寄样。')
  await page.getByRole('button', { name: '保存责任图', exact: true }).click()
  const routeMapSaved = await page.getByText('发布路线责任图已保存。它不排名路线，也不预测签约、销量、利润或交付成功。').isVisible()
  const routeMapSummary = await page.locator('.route-map-sheet').innerText()
  const routeMapDownloadPromise = page.waitForEvent('download')
  await page.getByRole('button', { name: /导出 JSON/ }).click()
  const routeMapDownload = await routeMapDownloadPromise
  const exportedRouteMap = JSON.parse(await fs.readFile(await routeMapDownload.path(), 'utf8'))
  const routeMapStored = await page.evaluate(() => JSON.parse(localStorage.getItem('tabletop-workshop-publishing-route-maps-v1') || '{}'))
  await page.screenshot({ path: 'design/qa/publishing-route-desktop.png', fullPage: true })
  console.log('publishing responsibility map saved and exported without ranking or revenue prediction')

  await page.getByRole('button', { name: '单任务学习路径', exact: true }).click()
  await page.getByLabel('12 · 第一次偏离').fill('玩家先翻到终局计分页，并把订单牌当成可交付的货物。')
  await page.getByLabel('13 · 实际查看与恢复路径（可选）').fill('先看终局页，再用“订单”查组件表，最后回到个人辅助完成交货。')
  await page.getByLabel('14 · 主持人介入（可选）').fill('03:10 主持人指向组件表；本次不记为独立恢复。')
  await page.getByRole('button', { name: '保存学习路径' }).click()
  const teachingSaved = await page.getByText('学习路径已保存。它记录当前任务，不给玩家或规则打理解分。').isVisible()
  const teachingSummary = await page.locator('.teaching-sheet').innerText()
  const teachingDownloadPromise = page.waitForEvent('download')
  await page.getByRole('button', { name: /导出 JSON/ }).click()
  const teachingDownload = await teachingDownloadPromise
  const exportedTeaching = JSON.parse(await fs.readFile(await teachingDownload.path(), 'utf8'))
  const teachingStored = await page.evaluate(() => JSON.parse(localStorage.getItem('tabletop-workshop-teaching-paths-v1') || '{}'))
  await page.screenshot({ path: 'design/qa/teaching-path-desktop.png', fullPage: true })
  console.log('teaching path saved and exported without aggregate score')

  await page.getByRole('button', { name: '测试方式选择', exact: true }).click()
  const selectorInitial = await page.locator('.decision-sheet h2').innerText()
  await page.getByLabel('02 · 主要想知道').selectOption('完整自主使用')
  await page.getByLabel('03 · 当前稳定度').selectOption('整局稳定')
  await page.getByLabel('05 · 测试媒介').selectOption('线上')
  const selectorRecommendation = await page.locator('.decision-sheet h2').innerText()
  const selectorText = await page.locator('.decision-sheet').innerText()
  const selectorDownloadPromise = page.waitForEvent('download')
  await page.getByRole('button', { name: '导出决定单 JSON' }).click()
  const selectorDownload = await selectorDownloadPromise
  const exportedSelector = JSON.parse(await fs.readFile(await selectorDownload.path(), 'utf8'))
  await page.screenshot({ path: 'design/qa/playtest-selector-desktop.png', fullPage: true })
  console.log('playtest selector decided and exported')

  await page.getByRole('button', { name: '任务无障碍观察', exact: true }).click()
  await page.getByLabel('04 · 实际发生的动作').fill('玩家两次把港口板转向自己，仍把蓝色需求读成绿色。')
  await page.getByLabel('07 · 暂定的障碍描述').fill('公共状态只用相近颜色表达，且必须从长边远距离读取。')
  await page.getByLabel('09 · 他人提供的协助（可选）').fill('同伴代读三座港口的需求。')
  await page.getByLabel('12 · 下一版只改变一个条件').fill('在港口颜色旁增加可从任意方向识别的形状。')
  await page.getByLabel('13 · 用同一任务复测的成功信号').fill('玩家无需转板或代读即可选择，且私人货物保持隐藏。')
  await page.getByRole('button', { name: '保存任务观察' }).click()
  const accessibilityTradeoffValidation = await page.getByText('记录了外部协助时，也要写它是否暴露信息、代替决定、增加时间或改变体验。').isVisible()
  await page.getByLabel('10 · 协助与适配代价').fill('代读者同时看到了玩家准备保留的私人货物，谈判信息被改变。')
  await page.getByRole('button', { name: '保存任务观察' }).click()
  const accessibilitySaved = await page.getByText('任务观察已保存。它是当前语境的证据，不是整款游戏的无障碍分数。').isVisible()
  const accessibilitySummary = await page.locator('.accessibility-sheet').innerText()
  const accessibilityDownloadPromise = page.waitForEvent('download')
  await page.getByRole('button', { name: /\u5bfc\u51fa JSON/ }).click()
  const accessibilityDownload = await accessibilityDownloadPromise
  const exportedAccessibility = JSON.parse(await fs.readFile(await accessibilityDownload.path(), 'utf8'))
  const accessibilityStored = await page.evaluate(() => JSON.parse(localStorage.getItem('tabletop-workshop-accessibility-observations-v1') || '{}'))
  await page.screenshot({ path: 'design/qa/accessibility-observation-desktop.png', fullPage: true })
  console.log('accessibility observation validated, saved and exported')

  await page.getByRole('button', { name: '体验意图卡', exact: true }).click()
  await page.getByLabel(/游戏\/项目 \*/).fill('港湾议会')
  await page.getByLabel(/当前版本 \*/).fill('v0.1')
  await page.getByLabel(/最初的题材、机制、触感或问题/).fill('让货物空间和航线位置互相拉扯的贸易游戏。')
  await page.getByLabel(/目标玩家与游玩语境/).fill('3–4 名熟悉轻中策桌游的玩家，单局约 60 分钟')
  await page.getByRole('button', { name: '重复决定', exact: true }).click()
  await page.getByLabel(/玩家反复在什么之间决定/).fill('在立刻交货得分，与保留货物前往更远港口之间选择')
  await page.getByLabel(/不同选择会改变什么/).fill('交货腾出货舱；保留会占用空间并承担航线被抢的风险。')
  await page.getByRole('button', { name: '压力与反馈', exact: true }).click()
  await page.getByLabel(/为什么这个决定有代价/).fill('货舱只有三格，而且对手可能先占用高需求港口')
  await page.getByLabel(/系统怎样让后果可见/).fill('港口需求与对手航线公开；交货后立即更新分数、货舱与可用港口')
  await page.getByRole('button', { name: '预测与反例', exact: true }).click()
  await page.getByLabel(/预计看见的桌面行为/).fill('至少一名玩家会主动放弃一次立即可得的 1 分，保留货物争取更远港口')
  await page.getByLabel(/什么现象会反驳这条预测/).fill('所有玩家整局都立即交货，或保留货物只是因为漏看当前得分')
  await page.getByRole('button', { name: '本轮边界', exact: true }).click()
  await page.getByLabel(/本轮明确不验证什么/).fill('不验证历史模拟准确性、美术吸引力或完整经济平衡')
  await page.getByLabel(/第一条测试问题/).fill('在给定当前需求与已知航线时，玩家是否会为更远港口主动放弃一次立即得分？')
  await page.getByRole('button', { name: '保存体验意图', exact: true }).click()
  const experienceIntentSaved = await page.getByText(/体验意图已保存/).isVisible()
  const experienceIntentSummary = await page.getByLabel('当前体验意图摘要').innerText()
  const experienceIntentDownloadPromise = page.waitForEvent('download')
  await page.getByRole('button', { name: '导出 JSON →', exact: true }).click()
  const experienceIntentDownload = await experienceIntentDownloadPromise
  const exportedExperienceIntent = JSON.parse(await fs.readFile(await experienceIntentDownload.path(), 'utf8'))
  const experienceIntentStored = await page.evaluate(() => JSON.parse(localStorage.getItem('tabletop-workshop-experience-intent-v1') || '{}'))
  await page.screenshot({ path: 'design/qa/experience-intent-card-desktop.png', fullPage: true })
  console.log('experience intent saved and exported without score, profile inference, or mechanic recommendation')

  await page.getByRole('button', { name: '核心循环画布', exact: true }).click()
  await page.getByRole('button', { name: '导入最近体验意图', exact: true }).click()
  const coreLoopImportStatus = await page.getByText(/已导入最近体验意图的原字段/).isVisible()
  await page.getByRole('button', { name: '信息与选择', exact: true }).click()
  await page.getByLabel(/做决定时，玩家当前看见/).fill('公开港口需求、自己的三格货舱、对手已占航线。')
  await page.getByLabel(/玩家眼前想推进/).fill('腾出货舱，同时保留下一港口的高需求机会。')
  await page.getByLabel(/玩家当时认为可行/).fill('立即交货、保留货物继续航行、丢弃低价值货物。')
  await page.getByLabel(/这些选项为什么/).fill('交货腾空间但失去未来溢价；保留会占空间且航线可能被抢。')
  await page.getByRole('button', { name: '代价与承诺', exact: true }).click()
  await page.getByLabel(/玩家选择后具体执行/).fill('把货物放入当前港口，或留在有限货舱继续航行。')
  await page.getByLabel(/为这个行动支付/).fill('支付行动点；保留货物会占用一格且公开目的地。')
  await page.getByLabel(/何时锁定/).fill('移动航线标记后锁定；对手可在下一行动抢占港口。')
  await page.getByRole('button', { name: '状态与反馈', exact: true }).click()
  await page.getByLabel(/行动后什么状态改变/).fill('货舱占用、港口需求、航线位置与即时得分更新。')
  await page.getByLabel(/谁能看见变化/).fill('自己的货舱私有；需求、航线和得分公开。')
  await page.getByLabel(/什么时机\/怎样/).fill('行动结算后立即移动标记并更新港口牌。')
  await page.getByLabel(/反馈怎样成为下一次决定/).fill('新的可用港口和剩余货舱改变下一次选择的可行性。')
  await page.getByLabel(/这条作用路径影响谁/).fill('当前玩家失去货舱；对手看见变化后可改道或抢占。')
  await page.getByRole('button', { name: '重复与出口', exact: true }).click()
  await page.getByLabel(/反馈产生的下一次输入/).fill('更新后的需求、货舱空位与对手航线。')
  await page.getByLabel(/下一次重复的决定/).fill('再次选择立即交货、保留或改道。')
  await page.getByLabel(/循环何时停止/).fill('第三次交付后进入终局。')
  await page.getByLabel(/这轮保持不变/).fill('港口布局、交付得分与胜利条件。')
  await page.getByLabel(/这轮只改变一个轴/).fill('只改变货舱锁定与反馈时机。')
  await page.getByLabel(/交给原型范围的第一条问题/).fill('玩家是否会利用公开需求和剩余货舱，主动保留一次货物？')
  await page.getByRole('button', { name: '保存核心循环', exact: true }).click()
  const coreLoopSaved = await page.getByText(/核心循环已保存/).isVisible()
  const coreLoopSummary = await page.getByLabel('当前核心循环').innerText()
  const coreLoopDownloadPromise = page.waitForEvent('download')
  await page.getByRole('button', { name: '导出 JSON →', exact: true }).click()
  const coreLoopDownload = await coreLoopDownloadPromise
  const exportedCoreLoop = JSON.parse(await fs.readFile(await coreLoopDownload.path(), 'utf8'))
  const coreLoopStored = await page.evaluate(() => JSON.parse(localStorage.getItem('tabletop-workshop-core-loop-v1') || '{}'))
  await page.screenshot({ path: 'design/qa/core-loop-canvas-desktop.png', fullPage: true })
  console.log('core loop imported, saved and exported without mechanism inference or quality score')

  await page.getByRole('button', { name: '原型范围裁剪', exact: true }).click()
  await page.getByRole('button', { name: '导入最近核心循环', exact: true }).click()
  const prototypeScopeImportStatus = await page.getByText(/已导入最近核心循环的原字段/).isVisible()
  await page.getByLabel('当前版本').fill('v0.3')
  await page.getByLabel(/这一轮要回答的问题/).fill('玩家会为了下一港口主动保留货物吗？')
  await page.getByLabel(/什么观察会推翻当前想法/).fill('看见下一港口需求后，玩家仍从不保留货物。')
  await page.getByLabel(/本轮明确不回答/).fill('不判断四人平衡、最终美术、完整时长或终局分数。')
  await page.getByRole('button', { name: '证据过滤', exact: true }).click()
  await page.getByRole('button', { name: '互动/决定', exact: true }).click()
  await page.getByRole('button', { name: '空间/身体', exact: true }).click()
  await page.getByRole('button', { name: '外观/信息', exact: true }).click()
  const prototypeScopeFilterLimit = await page.getByText(/这一轮最多选择两个主要过滤维度/).isVisible()
  await page.getByLabel(/01 · 互动\/决定为什么必须出现/).fill('要观察玩家如何在航线与货物之间取舍。')
  await page.getByLabel(/02 · 空间\/身体为什么必须出现/).fill('货舱格与公开港口的空间关系会影响取用。')
  await page.getByLabel(/原型必须承担的功能/).fill('公开港口需求、私人货物、有限货舱与两次可比较的交付反馈。')
  await page.getByRole('button', { name: '保真度配置', exact: true }).click()
  await page.getByRole('group', { name: '材料保真度' }).getByRole('button', { name: '近似', exact: true }).click()
  await page.getByRole('group', { name: '分辨率保真度' }).getByRole('button', { name: '替代', exact: true }).click()
  await page.getByRole('group', { name: '范围保真度' }).getByRole('button', { name: '必须真实', exact: true }).click()
  await page.getByLabel('材料选择理由').fill('纸条与方块足以呈现占位与移动。')
  await page.getByLabel('分辨率选择理由').fill('本轮只需要三档需求，不需最终数值。')
  await page.getByLabel('范围选择理由').fill('两次交付决定必须完整发生并看见后果。')
  await page.getByLabel('由谁代运转什么？').fill('主持人用表格结算供需，不解释策略。')
  await page.getByLabel('绝不能替玩家做的决定').fill('装什么货、走哪条航线、何时交付。')
  await page.getByRole('button', { name: '可玩切片', exact: true }).click()
  await page.getByLabel(/玩家配置/).fill('2 人；各有 3 个货舱格')
  await page.getByLabel(/起始状态/).fill('第 1 回合交货前')
  await page.getByLabel(/关键决定怎样重复/).fill('每人至少做两次装货或保留决定。')
  await page.getByLabel(/停止触发/).fill('第二次交货结算完成后停止。')
  await page.getByLabel(/明确不做/).fill('事件牌、最终计分、四人模式、正式插画与完整规则书。')
  await page.getByRole('button', { name: '开工门槛', exact: true }).click()
  await page.getByLabel(/材料与数量/).fill('6 张便签港口、12 个方块货物、2 条纸质货舱与 1 张结算表。')
  await page.getByLabel(/何时重做表示或缩小问题/).fill('主持结算占据多数时间，或玩家因代理物误认而改变选择时。')
  await page.getByLabel(/下一次测试/).fill('用 2 人引导测试记录两次保留决定，随后安排实体空间复核。')
  await page.getByRole('button', { name: '保存范围快照', exact: true }).click()
  const prototypeScopeSaved = await page.getByText(/原型范围快照已保存/).isVisible()
  const prototypeScopeSummary = await page.getByLabel('本轮原型边界').innerText()
  const prototypeScopeDownloadPromise = page.waitForEvent('download')
  await page.getByRole('button', { name: '导出 JSON →', exact: true }).click()
  const prototypeScopeDownload = await prototypeScopeDownloadPromise
  const exportedPrototypeScope = JSON.parse(await fs.readFile(await prototypeScopeDownload.path(), 'utf8'))
  const prototypeScopeStored = await page.evaluate(() => JSON.parse(localStorage.getItem('tabletop-workshop-prototype-scope-v1') || '{}'))
  await page.screenshot({ path: 'design/qa/prototype-scope-desktop.png', fullPage: true })
  console.log('prototype scope limited, saved and exported without fidelity score')

  await page.getByRole('button', { name: '继续到测试计划 →', exact: true }).click()
  const planDialog = page.getByRole('dialog')
  await planDialog.getByRole('button', { name: '导入最近原型范围', exact: true }).click()
  const testPlanImportStatus = await planDialog.getByText(/已导入最近原型范围的原字段/).isVisible()
  await planDialog.getByLabel(/预计看见的桌面行为/).fill('看见下一港口需求后，玩家至少一次主动保留当前可交付货物。')
  await planDialog.getByRole('button', { name: /02.*观察协议/ }).click()
  await planDialog.getByLabel(/具体记录哪类事件/).fill('每次装货、保留或交货决定，以及结算后的公开港口需求。')
  await planDialog.getByLabel(/目标重复次数或观察单位/).fill('每名玩家至少两次装货或保留决定。')
  await planDialog.getByLabel(/这轮保持不变/).fill('港口需求、货舱容量、回合顺序和主持结算表。')
  await planDialog.getByLabel(/这轮只改变一个轴/).fill('是否提前公开下一港口需求。')
  await planDialog.getByRole('button', { name: /03.*参与与主持/ }).click()
  await planDialog.getByLabel(/目标测试者与经验/).fill('玩过轻中策但第一次接触本原型的成人。')
  await planDialog.getByLabel(/玩家配置与关系/).fill('2 人；彼此认识；各有 3 个货舱格。')
  await planDialog.getByLabel('测试类型').selectOption('极限测试')
  await planDialog.getByLabel('测试媒介').selectOption('线上')
  const onlineWarning = await planDialog.getByText(/线上或混合测试可能看不到触感/).isVisible()
  await planDialog.getByLabel(/主持人可以做什么/).fill('只读出已写规则，并在玩家提问后指出可查询位置；逐次记录帮助。')
  await planDialog.getByLabel(/主持人绝不能替玩家做什么/).fill('不能建议装什么货、走哪条航线或何时交付。')
  await planDialog.getByLabel(/记录方式与同意/).fill('仅做匿名事件笔记；开始前确认两人同意，不录音录像。')
  await planDialog.getByLabel(/安全／主动停止条件/).fill('任一参与者要求停止，或出现持续争执与不适时立即停止。')
  await planDialog.getByRole('button', { name: /04.*结束与追问/ }).click()
  await planDialog.getByLabel('局后追问 1').fill('哪一次装货或保留决定最难？你当时看见了什么？')
  await planDialog.getByLabel(/出现支持、反驳或未定证据后怎样处理/).fill('支持则换一组玩家复测；反驳则只检查需求可见时机；未定则保持规则、改进表示后复测。')
  await page.screenshot({ path: 'design/qa/single-question-test-plan-desktop.png', fullPage: true })
  await planDialog.getByRole('button', { name: '保存测试计划', exact: true }).click()
  const testPlanSaved = await planDialog.getByText(/单问题测试计划已保存/).isVisible()
  const testPlanDownloadPromise = page.waitForEvent('download')
  await planDialog.getByRole('button', { name: '导出 JSON →', exact: true }).click()
  const testPlanDownload = await testPlanDownloadPromise
  const exportedTestPlan = JSON.parse(await fs.readFile(await testPlanDownload.path(), 'utf8'))
  const testPlanStored = await page.evaluate(() => JSON.parse(localStorage.getItem('tabletop-workshop-project-v1') || '[]'))
  await planDialog.getByRole('button', { name: '保存并开始主持 →', exact: true }).click()
  await page.getByRole('heading', { name: '现场测试记录', exact: true }).waitFor()
  await page.getByLabel(/参与者别名与必要经验/).fill('P1：第一次接触；P2：玩过一次轻策。')
  await page.getByLabel(/实际玩家配置与关系/).fill('2 人；彼此认识；各有 3 个货舱格。')
  await page.getByLabel(/实际媒介/).fill('实体桌面')
  await page.getByLabel(/主持、观察与记录分别由谁承担/).fill('D 主持；O1 记录；无远程观察者。')
  await page.getByLabel(/记录方式/).selectOption('只记匿名文字')
  await page.getByLabel(/确认的记录与使用范围/).fill('仅在本地保存匿名文字，用于本版本复盘；参与者可随时停止并撤回。')
  await page.getByLabel(/我已用参与者能理解和使用的方式说明目的/).check()
  await page.getByRole('button', { name: '开始本场并计时', exact: true }).click()
  await page.getByLabel(/时间／阶段/).fill('第 1 轮装货')
  await page.getByLabel(/玩家别名/).fill('P1')
  await page.getByLabel(/发生了什么/).fill('P1 看向下一港口需求后，把可立即交付的蓝色货物留在货舱。')
  await page.getByLabel(/当时可见状态/).fill('下一港口需要蓝色货物；当前港口也可立即交付蓝色。')
  await page.getByLabel(/随后怎样结束/).fill('P1 未询问主持，完成保留并进入下一玩家回合。')
  await page.getByLabel(/与主问题关系/).selectOption('支持')
  await page.getByRole('button', { name: '加入时间线', exact: true }).click()
  await page.getByLabel(/时间／阶段/).fill('第 2 轮结算前')
  await page.getByLabel(/玩家别名/).fill('主持')
  await page.getByLabel(/事件类型/).selectOption('主持介入')
  await page.getByLabel(/发生了什么/).fill('主持指出规则表中的下一港口需求位置。')
  await page.getByLabel(/当时可见状态/).fill('P2 正在查看货舱，但没有翻到规则表背面。')
  await page.getByLabel(/随后怎样结束/).fill('P2 找到需求后改变了装货选择。')
  await page.getByLabel(/与主问题关系/).selectOption('语境')
  await page.getByRole('button', { name: '加入时间线', exact: true }).click()
  const interventionImpactValidation = await page.getByText(/主持介入必须写清/).isVisible()
  await page.getByLabel(/介入改变了什么/).fill('增加了可见信息，并直接改变 P2 的选择范围。')
  await page.getByRole('button', { name: '加入时间线', exact: true }).click()
  await page.getByRole('button', { name: '暂停计时', exact: true }).click()
  await page.getByRole('button', { name: '继续计时', exact: true }).click()
  await page.getByRole('button', { name: '结束本场', exact: true }).click()
  await page.getByLabel(/实际停止原因/).fill('第二次交货结算完成，按计划停止。')
  await page.getByLabel(/计划外变化或中途改规则/).fill('主持在第 2 轮指出规则表位置；未改规则。')
  await page.locator('.session-debrief fieldset textarea').first().fill('第一次保留最难；我依据下一港口公开需求做决定。')
  await page.getByLabel(/结束时已提醒本场记录了什么/).check()
  await page.getByRole('button', { name: '整理证据与下一版 →', exact: true }).click()
  await page.getByLabel('支持', { exact: true }).check()
  await page.getByLabel(/最有解释力的观察/).fill('P1 在没有主持帮助时依据公开需求主动保留货物。')
  await page.getByLabel(/仍可能成立的其他解释/).fill('P1 可能只是熟悉轻策中的目标规划，而非需求可见性本身。')
  await page.getByLabel(/下一版保持不变/).fill('货舱容量、需求序列与回合顺序。')
  await page.getByLabel(/下一版只改变一个轴/).fill('只改变下一港口需求的展示位置。')
  await page.getByLabel(/下一场唯一问题/).fill('展示位置改变后，第一次查询是否仍需主持指出？')
  await page.getByRole('button', { name: '保存会话与下一版', exact: true }).click()
  const playtestSessionSaved = await page.getByText(/会话与下一版决定已保存/).isVisible()
  const playtestSessionDownloadPromise = page.waitForEvent('download')
  await page.getByRole('button', { name: '导出 JSON →', exact: true }).click()
  const playtestSessionDownload = await playtestSessionDownloadPromise
  const exportedPlaytestSession = JSON.parse(await fs.readFile(await playtestSessionDownload.path(), 'utf8'))
  const playtestSessionStored = await page.evaluate(() => JSON.parse(localStorage.getItem('tabletop-workshop-playtest-sessions-v1') || '{}'))
  await page.screenshot({ path: 'design/qa/live-playtest-session-desktop.png', fullPage: true })
  console.log('single-question plan handed to a live session, saved and exported with observation/debrief/decision boundaries')

  await page.getByRole('button', { name: '交给证据复盘 →', exact: true }).click()
  await page.getByRole('heading', { name: '证据复盘与变更简报', exact: true }).waitFor()
  await page.getByRole('button', { name: '导入最近已完成会话', exact: true }).click()
  await page.locator('.review-evidence-row input').nth(0).check()
  await page.locator('.review-evidence-row input').nth(1).check()
  await page.getByRole('button', { name: '用所选证据形成发现 →', exact: true }).click()
  await page.getByLabel(/发现陈述/).fill('在 v0.3 双人实体局中，公开需求支持 P1 自主保留，但 P2 的同类决定仍受到主持指引影响。')
  await page.getByLabel(/适用条件/).fill('只适用于 v0.3、双人熟人局、实体桌面和当前需求展示位置。')
  await page.getByLabel(/反证／其他解释/).fill('P1 的轻策经验可能解释自主保留；P2 的主持介入使第二个事件不能证明自主使用。')
  await page.getByLabel(/仍缺什么证据/).fill('缺少首次接触者在没有主持指引时对同一展示位置的第二次使用。')
  await page.getByRole('button', { name: '继续到版本决定 →', exact: true }).click()
  await page.getByLabel('修改', { exact: true }).check()
  await page.getByLabel(/为什么现在这样处理/).fill('来源位置可能影响第一次查询，但需要保持其他规则不变后复测。')
  await page.getByLabel(/下一版必须保持/).fill('货舱容量、需求序列、回合顺序和结算不变。')
  await page.getByLabel(/候选方案/).fill('把下一港口需求移到个人货舱旁')
  await page.getByLabel(/暂不采用的方案与理由/).fill('暂不增加主持提示，因为它会继续改变自主使用证据。')
  await page.getByLabel(/目标版本/).fill('v0.4')
  await page.getByLabel(/只改变一个轴/).fill('下一港口需求的展示位置')
  await page.getByLabel(/具体规则／组件改动/).fill('把下一港口需求条从规则表背面移到两名玩家货舱之间。')
  await page.getByLabel(/回退或停止信号/).fill('若展示位置遮挡货舱或让保留变成自动选择，则回退。')
  await page.getByLabel(/下一场唯一问题/).fill('首次接触者能否在没有主持指出位置时找到需求并完成第一次保留？')
  await page.getByRole('button', { name: '保存变更简报', exact: true }).click()
  const evidenceReviewCandidateValidation = await page.getByText(/至少写两个候选方案/).isVisible()
  await page.getByLabel(/候选方案/).fill('把下一港口需求移到个人货舱旁\n在中央港口旁增加同文需求条')
  await page.getByRole('button', { name: '保存变更简报', exact: true }).click()
  const evidenceReviewSaved = await page.getByText(/证据复盘与变更简报已保存/).isVisible()
  const evidenceReviewDownloadPromise = page.waitForEvent('download')
  await page.getByRole('button', { name: '导出 JSON →', exact: true }).click()
  const evidenceReviewDownload = await evidenceReviewDownloadPromise
  const exportedEvidenceReview = JSON.parse(await fs.readFile(await evidenceReviewDownload.path(), 'utf8'))
  await page.getByRole('button', { name: '复制为项目下一步 →', exact: true }).click()
  const evidenceReviewCopied = await page.getByText(/已显式复制为项目下一步/).isVisible()
  const evidenceReviewStored = await page.evaluate(() => JSON.parse(localStorage.getItem('tabletop-workshop-feedback-v1') || '{}'))
  await page.screenshot({ path: 'design/qa/evidence-review-workbench-desktop.png', fullPage: true })
  console.log('live session handed to evidence review, saved and explicitly copied without automatic severity or silent project mutation')

  await page.getByRole('button', { name: '议题到系统', exact: true }).click()
  await page.getByLabel('游戏/项目').fill('可见度工坊')
  await page.getByLabel('当前版本').fill('v0.2')
  await page.getByLabel(/议题 \*/).fill('平台怎样分配可见度与审核劳动？')
  await page.getByLabel(/目标玩家与使用语境/).fill('高中课堂；熟悉社交平台但未学过排序系统。')
  await page.getByLabel(/可被反驳的系统主张/).fill('平台奖励持续制造互动的人，同时把审核成本转移给创作者。')
  await page.getByLabel(/设计者位置与不知道什么/).fill('设计者是平台用户，不从事内容审核；不了解不同地区劳动条件。')
  await page.getByLabel(/谁直接承受或了解这个议题/).fill('内容审核者、创作者与被错误处理内容影响的人。')
  await page.getByLabel(/谁能质疑、修改或停止表达/).fill('受影响者审阅者可要求改写、删除案例或停止公开。')
  await page.getByRole('button', { name: '六字段翻译', exact: true }).click()
  await page.getByLabel(/01 · 角色/).fill('创作者、平台、审核者与观看者。')
  await page.getByLabel(/02 · 权限/).fill('创作者可发布但看不到完整排序；平台分配曝光。')
  await page.getByLabel(/03 · 资源/).fill('注意力、精力、审核队列与可信度。')
  await page.getByLabel(/04 · 约束/).fill('创作者受精力和不透明排序限制；审核者受队列限制。')
  await page.getByLabel(/05 · 反馈/).fill('互动提高下一轮曝光，审核债务延迟降低可用行动。')
  await page.getByLabel(/06 · 时间尺度/).fill('曝光立即变化，审核劳动与错误处理延迟两轮出现。')
  await page.getByRole('button', { name: '遗漏账本', exact: true }).click()
  await page.getByLabel(/删掉了谁、什么关系或哪段历史/).fill('广告主的议价权与地区劳动法规。')
  await page.getByLabel(/为什么当前原型先删/).fill('本轮只测试曝光与审核债务的连接。')
  await page.getByLabel(/可能造成什么误读/).fill('玩家可能以为平台只优化参与度，不受收入结构影响。')
  await page.getByLabel(/谁负责发现、复核或补查/).fill('领域研究者与一名内容审核经验者。')
  await page.getByRole('button', { name: '重复决策', exact: true }).click()
  await page.getByLabel(/核心关系在什么情境反复出现/).fill('每轮创作者都要决定是否继续追逐曝光。')
  await page.getByLabel(/玩家实际选择什么/).fill('在高互动内容和低风险内容之间选择。')
  await page.getByLabel(/系统怎样回应/).fill('高互动增加曝光，同时把更多内容送入审核队列。')
  await page.getByLabel(/玩家何时、从哪里看见后果/).fill('曝光下一轮可见，审核债务两轮后从行动预算扣除。')
  await page.getByLabel(/移除故事并改名后/).fill('短期收益把延迟成本转移给不可见角色的关系仍成立。')
  await page.getByLabel(/哪些题卡、事实或结论与系统脱节/).fill('删除平台术语问答卡；事实只用于复盘比较替代模型。')
  await page.getByRole('button', { name: '三层验证', exact: true }).click()
  await page.getByLabel(/系统行为证据/).fill('记录曝光、审核队列和行动预算的逐轮变化。')
  await page.getByLabel(/玩家解释证据/).fill('测试后先让玩家用自己的话说明谁承担了什么成本。')
  await page.getByLabel(/直接受影响者\/领域审阅/).fill('记录审阅者位置、异议、修改要求和不可代表性。')
  await page.getByLabel(/复盘只承担什么/).fill('复盘比较游戏模型与现实替代解释，不能补讲游戏里不存在的审核因果。')
  await page.getByLabel(/什么结果会推翻当前系统主张/).fill('系统日志显示高互动没有产生审核债务，或玩家只把结果解释为随机惩罚。')
  await page.getByLabel(/下一版只改变哪一个关系字段/).fill('只提高审核债务反馈的可见性，不改资源量。')
  await page.getByRole('button', { name: '保存议题—系统记录', exact: true }).click()
  const issueSystemSaved = await page.getByText(/议题—系统记录已保存/).isVisible()
  const issueSystemSummary = await page.getByLabel('议题到系统当前摘要').innerText()
  const issueSystemDownloadPromise = page.waitForEvent('download')
  await page.getByRole('button', { name: '导出 JSON →', exact: true }).click()
  const issueSystemDownload = await issueSystemDownloadPromise
  const exportedIssueSystem = JSON.parse(await fs.readFile(await issueSystemDownload.path(), 'utf8'))
  const issueSystemStored = await page.evaluate(() => JSON.parse(localStorage.getItem('tabletop-workshop-issue-to-system-v1') || '{}'))
  await page.screenshot({ path: 'design/qa/issue-to-system-desktop.png', fullPage: true })
  console.log('issue-to-system relation saved and exported without impact score or certification')

  await page.getByRole('button', { name: '内容版本治理', exact: true }).click()
  await page.getByLabel(/游戏名称/).fill('港湾议会')
  await page.getByLabel(/当前工作版本/).fill('2.1')
  await page.getByLabel(/稳定 ID/).fill('CARD-ACTION-017')
  await page.getByLabel(/组件名称/).fill('临时通行证')
  await page.getByRole('button', { name: /兼容矩阵/ }).click()
  await page.getByRole('button', { name: '＋ 添加配置', exact: true }).click()
  const governanceConfigurationCount = await page.locator('.governance-table tbody tr').count()
  await page.getByRole('button', { name: /当前事实源/ }).click()
  await page.getByLabel('标题/版本').fill('规则书 2.1')
  await page.getByLabel('地位').selectOption('当前')
  await page.getByLabel(/当前断点/).fill('基础版首印卡牌与 2.1 规则冲突。')
  await page.getByLabel(/下一次只验证/).fill('额外行动是否绕过港口上限。')
  await page.getByLabel(/证据边界/).fill('只验证基础版首印＋港口扩展＋4 人中文规则。')
  await page.getByRole('button', { name: '保存本地记录', exact: true }).click()
  const governanceSaved = await page.getByText('治理记录已保存到当前浏览器。').isVisible()
  const governanceSummary = await page.locator('.governance-summary').innerText()
  const governanceDownloadPromise = page.waitForEvent('download')
  await page.getByRole('button', { name: /导出治理包 JSON/ }).click()
  const governanceDownload = await governanceDownloadPromise
  const exportedGovernance = JSON.parse(await fs.readFile(await governanceDownload.path(), 'utf8'))
  const governanceStored = await page.evaluate(() => JSON.parse(localStorage.getItem('tabletop-workshop-version-governance-v1') || '{}'))
  await page.screenshot({ path: 'design/qa/version-governance-desktop.png', fullPage: true })
  console.log('version governance record saved and exported without compatibility certification')

  await page.getByRole('link', { name: '设计路径', exact: true }).click()
  const projectEvidenceText = await page.locator('.project-evidence').innerText()
  const projectPackageDownloadPromise = page.waitForEvent('download')
  await page.getByRole('button', { name: '导出完整项目包', exact: false }).click()
  const projectPackageDownload = await projectPackageDownloadPromise
  const exportedProjectPackage = JSON.parse(await fs.readFile(await projectPackageDownload.path(), 'utf8'))
  const projectWorkspaceStored = await page.evaluate(() => JSON.parse(localStorage.getItem('tabletop-workshop-project-workspace-v1') || '{}'))
  await page.screenshot({ path: 'design/qa/project-workspace-desktop.png', fullPage: true })
  await page.getByRole('link', { name: '工具箱', exact: true }).click()
  await page.getByRole('button', { name: '证据复盘', exact: true }).click()

  await page.setViewportSize({ width: 375, height: 812 })
  const bodyWidth = await page.evaluate(() => ({ scroll: document.body.scrollWidth, client: document.documentElement.clientWidth }))
  const evidenceReviewStepLayout = await page.locator('.review-steps').evaluate(element => ({ scroll: element.scrollWidth, client: element.clientWidth, wrap: getComputedStyle(element).flexWrap }))
  const evidenceReviewMainWidth = await page.locator('.review-main').evaluate(element => Math.round(element.getBoundingClientRect().width))
  await page.screenshot({ path: 'design/qa/evidence-review-workbench-mobile.png', fullPage: true })

  await page.getByRole('link', { name: '设计路径', exact: true }).click()
  const projectBodyWidth = await page.evaluate(() => ({ scroll: document.body.scrollWidth, client: document.documentElement.clientWidth }))
  await page.getByRole('button', { name: '编辑项目护照', exact: true }).click()
  const projectInputWidth = await page.getByLabel('项目名').evaluate(element => Math.round(element.getBoundingClientRect().width))
  await page.screenshot({ path: 'design/qa/project-workspace-mobile.png', fullPage: true })
  await page.getByRole('link', { name: '资源库', exact: true }).click()
  const resourceBodyWidth = await page.evaluate(() => ({ scroll: document.body.scrollWidth, client: document.documentElement.clientWidth }))
  const resourceFacetWidth = await page.getByLabel('适合谁').evaluate(element => Math.round(element.getBoundingClientRect().width))
  const resourceEntryTabsLayout = await page.locator('.resource-entry-tabs').evaluate(element => ({ scroll: element.scrollWidth, client: element.clientWidth, wrap: getComputedStyle(element).flexWrap }))
  await page.screenshot({ path: 'design/qa/resources-mobile.png', fullPage: true })
  await page.getByRole('link', { name: '工具箱', exact: true }).click()

  await page.getByRole('button', { name: '改造熟悉游戏' }).click()
  const redesignBodyWidth = await page.evaluate(() => ({ scroll: document.body.scrollWidth, client: document.documentElement.clientWidth }))
  const redesignInputWidth = await page.getByLabel('01 · 选一个熟悉的简单游戏').evaluate(element => Math.round(element.getBoundingClientRect().width))
  await page.screenshot({ path: 'design/qa/redesign-lab-mobile.png', fullPage: true })

  await page.getByRole('button', { name: '测试方式选择', exact: true }).click()
  const selectorBodyWidth = await page.evaluate(() => ({ scroll: document.body.scrollWidth, client: document.documentElement.clientWidth }))
  const selectorInputWidth = await page.getByLabel('01 · 本轮只问什么？').evaluate(element => Math.round(element.getBoundingClientRect().width))
  await page.screenshot({ path: 'design/qa/playtest-selector-mobile.png', fullPage: true })

  await page.getByRole('button', { name: '设计约束牌', exact: true }).click()
  const constraintBodyWidth = await page.evaluate(() => ({ scroll: document.body.scrollWidth, client: document.documentElement.clientWidth }))
  const constraintInputWidth = await page.getByLabel('03 · 只写一条规则改动').evaluate(element => Math.round(element.getBoundingClientRect().width))
  await page.screenshot({ path: 'design/qa/constraint-deck-mobile.png', fullPage: true })

  await page.getByRole('button', { name: '单风险平衡诊断', exact: true }).click()
  const balanceBodyWidth = await page.evaluate(() => ({ scroll: document.body.scrollWidth, client: document.documentElement.clientWidth }))
  const balanceInputWidth = await page.getByLabel('04 · 可被反驳的平衡问题').evaluate(element => Math.round(element.getBoundingClientRect().width))
  await page.screenshot({ path: 'design/qa/balance-pass-mobile.png', fullPage: true })

  await page.getByRole('button', { name: '单轮决定轨迹', exact: true }).click()
  const decisionTraceBodyWidth = await page.evaluate(() => ({ scroll: document.body.scrollWidth, client: document.documentElement.clientWidth }))
  const decisionTraceInputWidth = await page.getByLabel('07 · 玩家实际考虑的选项').evaluate(element => Math.round(element.getBoundingClientRect().width))
  await page.screenshot({ path: 'design/qa/decision-trace-mobile.png', fullPage: true })

  await page.getByRole('button', { name: '共享决定观察', exact: true }).click()
  const sharedDecisionBodyWidth = await page.evaluate(() => ({ scroll: document.body.scrollWidth, client: document.documentElement.clientWidth }))
  const sharedDecisionInputWidth = await page.getByLabel('09 · 回应、反提案、中断与沉默').evaluate(element => Math.round(element.getBoundingClientRect().width))
  await page.screenshot({ path: 'design/qa/shared-decision-mobile.png', fullPage: true })

  await page.getByRole('button', { name: '主题与伤害复核', exact: true }).click()
  const themeReviewBodyWidth = await page.evaluate(() => ({ scroll: document.body.scrollWidth, client: document.documentElement.clientWidth }))
  const themeReviewInputWidth = await page.getByLabel('17 · 承诺与系统的第一处不匹配').evaluate(element => Math.round(element.getBoundingClientRect().width))
  await page.screenshot({ path: 'design/qa/theme-review-mobile.png', fullPage: true })

  await page.getByRole('button', { name: '生产假设账本', exact: true }).click()
  const productionBodyWidth = await page.evaluate(() => ({ scroll: document.body.scrollWidth, client: document.documentElement.clientWidth }))
  const productionInputWidth = await page.getByLabel('03 · 这轮只作什么决定').evaluate(element => Math.round(element.getBoundingClientRect().width))
  const productionComponentWidth = await page.locator('.production-component-row').first().evaluate(element => Math.round(element.getBoundingClientRect().width))
  await page.screenshot({ path: 'design/qa/production-ledger-mobile.png', fullPage: true })

  await page.getByRole('button', { name: '发布路线责任图', exact: true }).click()
  const routeMapBodyWidth = await page.evaluate(() => ({ scroll: document.body.scrollWidth, client: document.documentElement.clientWidth }))
  const routeMapInputWidth = await page.getByLabel('03 · 下一位接收者要完成什么动作').evaluate(element => Math.round(element.getBoundingClientRect().width))
  const routeResponsibilityWidth = await page.locator('.route-responsibility-row').first().evaluate(element => Math.round(element.getBoundingClientRect().width))
  await page.screenshot({ path: 'design/qa/publishing-route-mobile.png', fullPage: true })

  await page.getByRole('button', { name: '任务无障碍观察', exact: true }).click()
  const accessibilityBodyWidth = await page.evaluate(() => ({ scroll: document.body.scrollWidth, client: document.documentElement.clientWidth }))
  const accessibilityInputWidth = await page.getByLabel('04 · 实际发生的动作').evaluate(element => Math.round(element.getBoundingClientRect().width))
  const toolTabsLayout = await page.locator('.tool-tabs').evaluate(element => ({ scroll: element.scrollWidth, client: element.clientWidth, wrap: getComputedStyle(element).flexWrap }))
  await page.screenshot({ path: 'design/qa/accessibility-observation-mobile.png', fullPage: true })

  await page.getByRole('button', { name: '体验意图卡', exact: true }).click()
  const experienceIntentBodyWidth = await page.evaluate(() => ({ scroll: document.body.scrollWidth, client: document.documentElement.clientWidth }))
  await page.getByRole('button', { name: '本轮边界', exact: true }).click()
  const experienceIntentInputWidth = await page.getByLabel(/第一条测试问题/).evaluate(element => Math.round(element.getBoundingClientRect().width))
  const experienceIntentStepLayout = await page.locator('.experience-intent-steps').evaluate(element => ({ scroll: element.scrollWidth, client: element.clientWidth, wrap: getComputedStyle(element).flexWrap }))
  await page.screenshot({ path: 'design/qa/experience-intent-card-mobile.png', fullPage: true })

  await page.getByRole('button', { name: '核心循环画布', exact: true }).click()
  const coreLoopBodyWidth = await page.evaluate(() => ({ scroll: document.body.scrollWidth, client: document.documentElement.clientWidth }))
  await page.getByRole('button', { name: '状态与反馈', exact: true }).click()
  const coreLoopInputWidth = await page.getByLabel(/反馈怎样成为下一次决定/).evaluate(element => Math.round(element.getBoundingClientRect().width))
  const coreLoopStepLayout = await page.locator('.core-loop-steps').evaluate(element => ({ scroll: element.scrollWidth, client: element.clientWidth, wrap: getComputedStyle(element).flexWrap }))
  await page.screenshot({ path: 'design/qa/core-loop-canvas-mobile.png', fullPage: true })

  await page.getByRole('button', { name: '原型范围裁剪', exact: true }).click()
  const prototypeScopeBodyWidth = await page.evaluate(() => ({ scroll: document.body.scrollWidth, client: document.documentElement.clientWidth }))
  const prototypeScopeInputWidth = await page.getByLabel('游戏/项目').evaluate(element => Math.round(element.getBoundingClientRect().width))
  const prototypeScopeStepLayout = await page.locator('.scope-steps').evaluate(element => ({ scroll: element.scrollWidth, client: element.clientWidth, wrap: getComputedStyle(element).flexWrap }))
  await page.screenshot({ path: 'design/qa/prototype-scope-mobile.png', fullPage: true })
  await page.getByRole('button', { name: '继续到测试计划 →', exact: true }).click()
  const mobilePlanDialog = page.getByRole('dialog')
  const testPlanBodyWidth = await page.evaluate(() => ({ scroll: document.body.scrollWidth, client: document.documentElement.clientWidth }))
  const testPlanDialogWidth = await mobilePlanDialog.evaluate(element => Math.round(element.getBoundingClientRect().width))
  const testPlanInputWidth = await mobilePlanDialog.getByLabel(/本轮唯一主问题/).evaluate(element => Math.round(element.getBoundingClientRect().width))
  const testPlanStepLayout = await mobilePlanDialog.locator('.plan-steps').evaluate(element => ({ scroll: element.scrollWidth, client: element.clientWidth, wrap: getComputedStyle(element).flexWrap }))
  await page.screenshot({ path: 'design/qa/single-question-test-plan-mobile.png', fullPage: true })
  await mobilePlanDialog.getByRole('button', { name: '关闭' }).click()

  await page.getByRole('button', { name: '现场测试记录', exact: true }).click()
  await page.getByRole('button', { name: /02.*局中事件/ }).click()
  const playtestSessionBodyWidth = await page.evaluate(() => ({ scroll: document.body.scrollWidth, client: document.documentElement.clientWidth }))
  const playtestSessionMainWidth = await page.locator('.session-main').evaluate(element => Math.round(element.getBoundingClientRect().width))
  const playtestSessionStepLayout = await page.locator('.session-steps').evaluate(element => ({ scroll: element.scrollWidth, client: element.clientWidth, wrap: getComputedStyle(element).flexWrap }))
  await page.screenshot({ path: 'design/qa/live-playtest-session-mobile.png', fullPage: true })

  await page.getByRole('button', { name: '议题到系统', exact: true }).click()
  const issueSystemBodyWidth = await page.evaluate(() => ({ scroll: document.body.scrollWidth, client: document.documentElement.clientWidth }))
  const issueSystemInputWidth = await page.getByLabel('游戏/项目').evaluate(element => Math.round(element.getBoundingClientRect().width))
  const issueSystemStepLayout = await page.locator('.issue-system-steps').evaluate(element => ({ scroll: element.scrollWidth, client: element.clientWidth, wrap: getComputedStyle(element).flexWrap }))
  await page.screenshot({ path: 'design/qa/issue-to-system-mobile.png', fullPage: true })

  await page.getByRole('button', { name: '内容版本治理', exact: true }).click()
  const governanceBodyWidth = await page.evaluate(() => ({ scroll: document.body.scrollWidth, client: document.documentElement.clientWidth }))
  const governanceInputWidth = await page.getByLabel(/游戏名称/).evaluate(element => Math.round(element.getBoundingClientRect().width))
  const governanceStepLayout = await page.locator('.governance-steps').evaluate(element => ({ scroll: element.scrollWidth, client: element.clientWidth }))
  await page.screenshot({ path: 'design/qa/version-governance-mobile.png', fullPage: true })

  await page.getByRole('button', { name: '单任务学习路径', exact: true }).click()
  const teachingBodyWidth = await page.evaluate(() => ({ scroll: document.body.scrollWidth, client: document.documentElement.clientWidth }))
  const teachingInputWidth = await page.getByLabel('12 · 第一次偏离').evaluate(element => Math.round(element.getBoundingClientRect().width))
  await page.screenshot({ path: 'design/qa/teaching-path-mobile.png', fullPage: true })

  await page.getByRole('link', { name: '方法' }).click()
  const theoryBodyWidth = await page.evaluate(() => ({ scroll: document.body.scrollWidth, client: document.documentElement.clientWidth }))
  const theoryStepWidth = await page.locator('.framework-moves li > div').first().evaluate(element => Math.round(element.getBoundingClientRect().width))
  await page.screenshot({ path: 'design/qa/theory-mobile-375.png', fullPage: true })

  await page.getByRole('link', { name: '设计路径' }).click()
  await page.getByRole('button', { name: '核心系统', exact: true }).click()
  const guideBodyWidth = await page.evaluate(() => ({ scroll: document.body.scrollWidth, client: document.documentElement.clientWidth }))
  const guideContentWidth = await page.locator('.guide-steps li > div').first().evaluate(element => Math.round(element.getBoundingClientRect().width))
  await page.screenshot({ path: 'design/qa/guide-core-mobile.png', fullPage: true })

  await page.evaluate(() => localStorage.setItem('tabletop-workshop-accessibility-observations-v1', JSON.stringify({ schemaVersion: 1, observations: [{ id: 'legacy-observation', version: 'v0.6' }] })))
  await page.reload()
  await page.getByRole('link', { name: '工具箱' }).click()
  await page.getByRole('button', { name: '任务无障碍观察', exact: true }).click()
  const migratedAccessibility = await page.evaluate(() => JSON.parse(localStorage.getItem('tabletop-workshop-accessibility-observations-v1') || '{}'))

  await browser.close()
  preview?.kill('SIGTERM')
  const result = {
    initialRouteHash,
    pathNavHref,
    resourceNavHref,
    toolNavHref,
    methodNavHref,
    skipLinkHref,
    deepLinkedToolPressed,
    deepLinkedToolTitle,
    deepLinkSurvivesReload,
    projectSaved,
    projectVersionText,
    coreActive,
    coreGuideTitle,
    coreGuideSteps,
    coreGuideSources,
    coreGuideToolCount,
    coreToolButton,
    firstSelected,
    intentGuideTitle,
    intentGuideSteps,
    prototypeGuideTitle,
    prototypeGuideSteps,
    prototypeScopeGuideOpened,
    prototypeScopeGuideScrollTop,
    prototypeTestPlanOpened,
    feedbackGuideTitle,
    feedbackGuideSteps,
    feedbackGuideToolCount,
    feedbackToolOpened,
    feedbackToolPressed,
    rulesGuideTitle,
    rulesGuideSteps,
    rulesGuideSources,
    rulesGuideToolCount,
    rulesAccessibilityToolButton,
    rulesTestPlanOpened,
    releaseGuideTitle,
    releaseGuideSteps,
    releaseGuideSources,
    releaseToolButton,
    focusedClose,
    testPlanFocusRestored,
    testPlanImportStatus,
    onlineWarning,
    testPlanSaved,
    exportedTestPlanMethod: exportedTestPlan.method,
    exportedTestPlanMedium: exportedTestPlan.draft?.medium,
    exportedTestPlanVersion: exportedTestPlan.draft?.version,
    exportedTestPlanCount: exportedTestPlan.saved_records?.length,
    testPlanStoredCount: testPlanStored.length,
    resourceEntryPointCount,
    curatedResourceCount,
    curatedEntryText,
    curatedAssessmentText,
    resourceCount,
    searchedResourceCount,
    searchedResourceTitle,
    filteredResourceCount,
    beginnerResourceCount,
    beginnerChineseCount,
    resourceEmptyState,
    frameworkCount,
    frameworkHeading,
    frameworkMoves,
    frameworkSource,
    glossaryCount,
    glossarySearchCount,
    glossaryHeading,
    glossaryBoundary,
    rubricCount,
    assessmentSearchCount,
    assessmentDimensionCount,
    assessmentText,
    specialGuideCount,
    specialGuideFirstTitle,
    specialGuideFirstSteps,
    specialGuideSecondTitle,
    specialGuideSecondSteps,
    specialGuideThirdTitle,
    specialGuideThirdSteps,
    specialGuideThirdBoundary,
    specialGuideFourthTitle,
    specialGuideFourthSteps,
    specialGuideFourthBoundary,
    specialGuideFifthTitle,
    specialGuideFifthSteps,
    specialGuideFifthBoundary,
    specialGuideSixthTitle,
    specialGuideSixthSteps,
    specialGuideSixthBoundary,
    specialGuideSeventhTitle,
    specialGuideSeventhSteps,
    specialGuideSeventhBoundary,
    specialGuideEighthTitle,
    specialGuideEighthSteps,
    specialGuideEighthBoundary,
    specialGuideNinthTitle,
    specialGuideNinthSteps,
    specialGuideNinthBoundary,
    specialGuideTenthTitle,
    specialGuideTenthSteps,
    specialGuideTenthBoundary,
    specialGuideEleventhTitle,
    specialGuideEleventhSteps,
    specialGuideEleventhBoundary,
    specialGuideTwelfthTitle,
    specialGuideTwelfthSteps,
    specialGuideTwelfthBoundary,
    specialGuideThirteenthTitle,
    specialGuideThirteenthSteps,
    specialGuideThirteenthBoundary,
    specialGuideTwentyFirstTitle,
    specialGuideTwentyFirstSteps,
    specialGuideTwentyFirstBoundary,
    specialGuideTwentySecondTitle,
    specialGuideTwentySecondSteps,
    specialGuideTwentySecondBoundary,
    specialGuideTwentyThirdTitle,
    specialGuideTwentyThirdSteps,
    specialGuideTwentyThirdBoundary,
    specialGuideTwentyFourthTitle,
    specialGuideTwentyFourthSteps,
    specialGuideTwentyFourthBoundary,
    specialGuideThirtiethTitle,
    specialGuideThirtiethSteps,
    specialGuideThirtiethBoundary,
    specialGuideThirtyFirstTitle,
    specialGuideThirtyFirstSteps,
    specialGuideThirtyFirstBoundary,
    routeGuideToolOpened,
    routeGuideScrollTop,
    productionGuideToolOpened,
    productionGuideScrollTop,
    themeReviewGuideToolOpened,
    themeReviewGuideScrollTop,
    decisionGuideToolOpened,
    decisionGuideScrollTop,
    teachingGuideToolOpened,
    teachingGuideScrollTop,
    specialGuideToolOpened,
    specialGuideScrollTop,
    accessibilityGuideToolOpened,
    accessibilityGuideScrollTop,
    governanceGuideToolOpened,
    governanceGuideScrollTop,
    redesignSaved,
    redesignSummary,
    exportedRedesignAxis: exportedRedesign.redesigns[0]?.axis,
    exportedRedesignQuestion: exportedRedesign.redesigns[0]?.testQuestion,
    constraintCardCount,
    constraintBefore,
    constraintAfter,
    constraintSaved,
    constraintSummary,
    exportedConstraintCount: exportedConstraint.experiments?.length,
    exportedConstraintQuestion: exportedConstraint.experiments?.[0]?.testQuestion,
    balanceSaved,
    balanceSummary,
    exportedBalanceNoScore: exportedBalance.no_aggregate_score,
    exportedBalanceCount: exportedBalance.passes?.length,
    exportedBalanceConcern: exportedBalance.passes?.[0]?.concern,
    exportedBalanceDisconfirmingSignal: exportedBalance.passes?.[0]?.disconfirmingSignal,
    balanceStorageVersion: balanceStored.schemaVersion,
    decisionTraceSaved,
    decisionTraceSummary,
    exportedDecisionTraceSchemaVersion: exportedDecisionTrace.schema_version,
    exportedDecisionTraceMethod: exportedDecisionTrace.method,
    exportedDecisionTraceNoScore: exportedDecisionTrace.no_aggregate_score,
    exportedDecisionTraceCount: exportedDecisionTrace.traces?.length,
    exportedDecisionTraceModelUpdate: exportedDecisionTrace.traces?.[0]?.modelUpdate,
    decisionTraceStorageVersion: decisionTraceStored.schemaVersion,
    themeReviewSaved,
    themeReviewSummary,
    exportedThemeReviewSchemaVersion: exportedThemeReview.schema_version,
    exportedThemeReviewMethod: exportedThemeReview.method,
    exportedThemeReviewNoScore: exportedThemeReview.no_aggregate_score,
    exportedThemeReviewNoCertification: exportedThemeReview.no_safety_certification,
    exportedThemeReviewCount: exportedThemeReview.reviews?.length,
    themeReviewStorageVersion: themeReviewStored.schemaVersion,
    productionSaved,
    productionSummary,
    productionComponentCount,
    exportedProductionSchemaVersion: exportedProduction.schema_version,
    exportedProductionMethod: exportedProduction.method,
    exportedProductionNoPricePrediction: exportedProduction.no_price_prediction,
    exportedProductionNotQuote: exportedProduction.not_a_manufacturing_quote,
    exportedProductionNotComplianceAdvice: exportedProduction.not_compliance_advice,
    exportedProductionCount: exportedProduction.ledgers?.length,
    productionStorageVersion: productionStored.schemaVersion,
    routeMapSaved,
    routeMapSummary,
    exportedRouteMapSchemaVersion: exportedRouteMap.schema_version,
    exportedRouteMapMethod: exportedRouteMap.method,
    exportedRouteMapNoRanking: exportedRouteMap.no_route_ranking,
    exportedRouteMapNotAdvice: exportedRouteMap.not_legal_or_financial_advice,
    exportedRouteMapRecheck: exportedRouteMap.platform_rules_require_recheck,
    exportedRouteMapCount: exportedRouteMap.maps?.length,
    routeMapStorageVersion: routeMapStored.schemaVersion,
    teachingSaved,
    teachingSummary,
    exportedTeachingSchemaVersion: exportedTeaching.schema_version,
    exportedTeachingMethod: exportedTeaching.method,
    exportedTeachingNoScore: exportedTeaching.no_aggregate_score,
    exportedTeachingCount: exportedTeaching.paths?.length,
    exportedTeachingDivergence: exportedTeaching.paths?.[0]?.firstDivergence,
    teachingStorageVersion: teachingStored.schemaVersion,
    selectorInitial,
    selectorRecommendation,
    selectorText,
    exportedSelectorType: exportedSelector.recommendation?.type,
    exportedSelectorMedium: exportedSelector.medium,
    accessibilityTradeoffValidation,
    accessibilitySaved,
    accessibilitySummary,
    exportedAccessibilityNoScore: exportedAccessibility.no_aggregate_score,
    exportedAccessibilityCount: exportedAccessibility.observations?.length,
    exportedAccessibilityDimension: exportedAccessibility.observations?.[0]?.dimension,
    exportedAccessibilityFunction: exportedAccessibility.observations?.[0]?.componentFunction,
    exportedAccessibilitySuccess: exportedAccessibility.observations?.[0]?.successSignal,
    accessibilityStorageVersion: accessibilityStored.schemaVersion,
    accessibilityMigrationVersion: migratedAccessibility.schemaVersion,
    accessibilityMigrationBarrier: migratedAccessibility.observations?.[0]?.barrier,
    experienceIntentSaved,
    experienceIntentSummary,
    exportedExperienceIntentMethod: exportedExperienceIntent.method,
    exportedExperienceIntentNoScore: exportedExperienceIntent.no_fun_score,
    exportedExperienceIntentNoProfile: exportedExperienceIntent.no_player_profile_inference,
    exportedExperienceIntentNoRecommendation: exportedExperienceIntent.no_mechanic_recommendation,
    exportedExperienceIntentCount: exportedExperienceIntent.saved_records?.length,
    experienceIntentStorageVersion: experienceIntentStored.schemaVersion,
    experienceIntentStoredRecordCount: experienceIntentStored.records?.length,
    coreLoopImportStatus,
    coreLoopSaved,
    coreLoopSummary,
    exportedCoreLoopMethod: exportedCoreLoop.method,
    exportedCoreLoopNoScore: exportedCoreLoop.no_loop_quality_score,
    exportedCoreLoopNoRecommendation: exportedCoreLoop.no_optimal_mechanic_recommendation,
    exportedCoreLoopNoExperienceClaim: exportedCoreLoop.no_player_experience_claim,
    exportedCoreLoopNoSilentInference: exportedCoreLoop.no_silent_intent_inference,
    exportedCoreLoopCount: exportedCoreLoop.saved_records?.length,
    coreLoopStorageVersion: coreLoopStored.schemaVersion,
    coreLoopStoredRecordCount: coreLoopStored.records?.length,
    prototypeScopeImportStatus,
    prototypeScopeFilterLimit,
    prototypeScopeSaved,
    prototypeScopeSummary,
    exportedPrototypeScopeMethod: exportedPrototypeScope.method,
    exportedPrototypeScopeNoScore: exportedPrototypeScope.no_fidelity_score,
    exportedPrototypeScopeNoMinimum: exportedPrototypeScope.no_minimum_content_recommendation,
    exportedPrototypeScopeCount: exportedPrototypeScope.saved_records?.length,
    prototypeScopeStorageVersion: prototypeScopeStored.schemaVersion,
    prototypeScopeStoredRecordCount: prototypeScopeStored.records?.length,
    interventionImpactValidation,
    playtestSessionSaved,
    exportedPlaytestSessionMethod: exportedPlaytestSession.method,
    exportedPlaytestSessionNoSeverity: exportedPlaytestSession.no_automatic_severity,
    exportedPlaytestSessionNoThreshold: exportedPlaytestSession.no_frequency_threshold,
    exportedPlaytestSessionNoConsentCertification: exportedPlaytestSession.no_legal_consent_certification,
    playtestSessionStorageVersion: playtestSessionStored.schemaVersion,
    playtestSessionStoredRecordCount: playtestSessionStored.records?.length,
    issueSystemSaved,
    issueSystemSummary,
    exportedIssueSystemMethod: exportedIssueSystem.method,
    exportedIssueSystemNoImpactScore: exportedIssueSystem.no_social_impact_score,
    exportedIssueSystemNoLearningClaim: exportedIssueSystem.no_learning_outcome_claim,
    exportedIssueSystemNoCertification: exportedIssueSystem.no_representativeness_certification,
    exportedIssueSystemCount: exportedIssueSystem.saved_records?.length,
    issueSystemStorageVersion: issueSystemStored.schemaVersion,
    issueSystemStoredRecordCount: issueSystemStored.records?.length,
    governanceConfigurationCount,
    governanceSaved,
    governanceSummary,
    exportedGovernanceMethod: exportedGovernance.method,
    exportedGovernanceNoCertification: exportedGovernance.no_compatibility_certification,
    exportedGovernanceNoRarityRecommendation: exportedGovernance.no_rarity_recommendation,
    governanceStorageVersion: governanceStored.schemaVersion,
    governanceStoredRecordCount: governanceStored.records?.length,
    evidenceReviewCandidateValidation,
    evidenceReviewSaved,
    evidenceReviewCopied,
    exportedEvidenceReviewMethod: exportedEvidenceReview.method,
    exportedEvidenceReviewNoSeverity: exportedEvidenceReview.no_automatic_severity,
    exportedEvidenceReviewNoFrequencyPriority: exportedEvidenceReview.no_frequency_priority,
    exportedEvidenceReviewNoSilentMutation: exportedEvidenceReview.no_silent_project_mutation,
    evidenceReviewStorageVersion: evidenceReviewStored.schemaVersion,
    evidenceReviewStoredRecordCount: evidenceReviewStored.records?.length,
    projectEvidenceText,
    exportedProjectMethod: exportedProjectPackage.method,
    exportedProjectLocalFirst: exportedProjectPackage.local_first,
    exportedProjectVersion: exportedProjectPackage.project?.version,
    exportedProjectArtifactCount: Object.values(exportedProjectPackage.artifacts || {}).reduce((sum, records) => sum + (Array.isArray(records) ? records.length : 0), 0),
    projectWorkspaceCheckpointCount: projectWorkspaceStored.checkpoints?.length,
    bodyWidth,
    projectBodyWidth,
    projectInputWidth,
    resourceBodyWidth,
    resourceFacetWidth,
    resourceEntryTabsLayout,
    experienceIntentBodyWidth,
    experienceIntentInputWidth,
    experienceIntentStepLayout,
    coreLoopBodyWidth,
    coreLoopInputWidth,
    coreLoopStepLayout,
    playtestSessionBodyWidth,
    playtestSessionMainWidth,
    playtestSessionStepLayout,
    evidenceReviewStepLayout,
    evidenceReviewMainWidth,
    issueSystemBodyWidth,
    issueSystemInputWidth,
    issueSystemStepLayout,
    redesignBodyWidth,
    redesignInputWidth,
    selectorBodyWidth,
    selectorInputWidth,
    constraintBodyWidth,
    constraintInputWidth,
    balanceBodyWidth,
    balanceInputWidth,
    decisionTraceBodyWidth,
    decisionTraceInputWidth,
    sharedDecisionBodyWidth,
    sharedDecisionInputWidth,
    themeReviewBodyWidth,
    themeReviewInputWidth,
    productionBodyWidth,
    productionInputWidth,
    productionComponentWidth,
    routeMapBodyWidth,
    routeMapInputWidth,
    routeResponsibilityWidth,
    accessibilityBodyWidth,
    accessibilityInputWidth,
    prototypeScopeBodyWidth,
    prototypeScopeInputWidth,
    prototypeScopeStepLayout,
    testPlanBodyWidth,
    testPlanDialogWidth,
    testPlanInputWidth,
    testPlanStepLayout,
    governanceBodyWidth,
    governanceInputWidth,
    governanceStepLayout,
    teachingBodyWidth,
    teachingInputWidth,
    toolTabsLayout,
    theoryBodyWidth,
    theoryStepWidth,
    guideBodyWidth,
    guideContentWidth,
    errors,
  }
  console.log(JSON.stringify(result, null, 2))
  const checks = [
    [errors.length === 0, 'browser/console/http errors'],
    [initialRouteHash === '#path' && pathNavHref === '#path' && resourceNavHref === '#resources' && toolNavHref === '#tools/redesign' && methodNavHref === '#method' && skipLinkHref === '#main-content', 'canonical navigation links and skip link'],
    [deepLinkedToolPressed === 'true' && deepLinkSurvivesReload === 'true' && deepLinkedToolTitle.includes('核心循环画布'), 'tool deep link and reload continuity'],
    [projectSaved && projectVersionText.includes('v0.4'), 'project workspace save'],
    [coreActive === 'true' && coreGuideTitle.includes('核心系统') && coreGuideSteps === 5 && coreGuideSources === 23 && coreGuideToolCount === 5 && coreToolButton, 'core guide'],
    [coreGuideResourceHref === '#resources/core-loop-handoff' && guideResourceHandoffHash === '#resources/core-loop-handoff' && guideResourceHandoffSurvivesReload === 'true', 'core guide to curated resource handoff survives reload'],
    [firstSelected === 'true' && intentGuideTitle.includes('体验意图') && intentGuideSteps === 5 && intentGuideToolButton, 'intent guide'],
    [prototypeGuideTitle.includes('原型') && prototypeGuideSteps === 5 && prototypeScopeGuideOpened && prototypeScopeGuideScrollTop === 0 && prototypeTestPlanOpened, 'prototype guide'],
    [feedbackGuideTitle.includes('测试') && feedbackGuideSteps === 5 && feedbackGuideToolCount === 4 && feedbackToolOpened && feedbackToolPressed === 'true', 'feedback guide'],
    [rulesGuideTitle.includes('陌生人') && rulesGuideSteps === 5 && rulesGuideSources === 19 && rulesGuideToolCount === 4 && rulesAccessibilityToolButton && rulesTestPlanOpened, 'rules guide'],
    [releaseGuideTitle.includes('发布包') && releaseGuideSteps === 5 && releaseGuideSources === 6 && releaseToolButton, 'release guide'],
    [focusedClose && testPlanFocusRestored && testPlanImportStatus && onlineWarning && testPlanSaved && exportedTestPlan.method === 'single-question-playtest-plan' && exportedTestPlan.schema_version === 2 && exportedTestPlan.no_fun_score === true && exportedTestPlan.no_sample_representativeness_claim === true && exportedTestPlan.no_causal_proof === true && exportedTestPlan.no_release_readiness_claim === true && exportedTestPlan.no_silent_scope_inference === true && exportedTestPlan.draft?.medium === '线上' && exportedTestPlan.draft?.sourceScopeId === prototypeScopeStored.records?.[0]?.id && exportedTestPlan.saved_records?.length === 1 && testPlanStored.length === 1, 'single-question test plan'],
    [interventionImpactValidation && playtestSessionSaved && exportedPlaytestSession.method === 'live-playtest-session-recorder' && exportedPlaytestSession.no_automatic_severity === true && exportedPlaytestSession.no_frequency_threshold === true && exportedPlaytestSession.no_causal_proof === true && exportedPlaytestSession.no_sample_representativeness_claim === true && exportedPlaytestSession.no_legal_consent_certification === true && exportedPlaytestSession.no_silent_plan_mutation === true && playtestSessionStored.schemaVersion === 1 && playtestSessionStored.records?.length === 1 && playtestSessionStored.records?.[0]?.events?.length === 2, 'live playtest session'],
    [!resourceCatalogLoadedBeforeIntent && !resourceCatalogLoadedForCuratedEntry && defaultEntryPackageLoaded && resourceCatalogLoadedAfterFullIntent, 'curated resource entry loads before full catalog escalation'],
    [resourceEntryPointCount === expectedResourceEntryPointCount && curatedResourceCount === 7 && curatedEntryText.includes('证据边界') && curatedAssessmentText.includes('最适合') && curatedAssessmentText.includes('不要用来'), 'resource entry points'],
    [resourceCount === expectedResourceCount && searchedResourceCount === 2 && searchedResourceTitle.includes('Wingspan') && filteredResourceCount > 0 && filteredResourceCount < resourceCount && beginnerResourceCount > 0 && beginnerResourceCount < resourceCount && beginnerChineseCount > 0 && beginnerChineseCount < beginnerResourceCount && resourceEmptyState, 'resource facets and empty state'],
    [!frameworkCatalogLoadedBeforeIntent && frameworkCatalogLoadedAfterIntent, 'framework catalog loads on method navigation intent'],
    [!glossaryCatalogLoadedBeforeIntent && glossaryCatalogLoadedAfterIntent, 'glossary catalog loads on tab intent'],
    [!specialGuideCatalogLoadedBeforeConceptHandoff && specialGuideCatalogLoadedAfterConceptHandoff && specialGuideCatalogLoadedAfterIntent, 'special guide catalog loads on concept handoff intent'],
    [frameworkCount === 5 && frameworkHeading.includes('AutoBG') && frameworkMoves === 5 && frameworkSource.includes('2606.01976'), 'frameworks'],
    [frameworkRouteHash === '#method/frameworks/autobg' && glossaryRouteHash === '#method/glossary/prototype-fidelity' && resourceReadingRouteHash.includes('#method/resource-reading/') && specialGuideRouteHash === '#method/guides/special-blind-rules-test' && specialGuideRouteSurvivesReload === 'true', 'method section and item routes survive selection and reload'],
    [glossaryCount === 287 && glossarySearchCount === 1 && glossaryHeading === '原型精度' && glossaryBoundary.includes('不是统一的“粗糙—精美”单轴'), 'glossary'],
    [conceptGuideHandoffHref === '#method/guides/special-test-type-selection' && conceptGuideHandoffHash === '#method/guides/special-test-type-selection' && conceptToolHandoffHref === '#tools/prototype-scope' && conceptToolHandoffHash === '#tools/prototype-scope' && guideConceptHandoffHash === '#method/glossary/prototype-fidelity' && conceptHandoffBackHash === '#method/glossary/prototype-fidelity', 'concept guide and tool handoffs preserve shareable routes and history'],
    [rubricCount === 9 && assessmentSearchCount === 1 && assessmentDimensionCount === 9 && assessmentText.includes('不要让代理替代真实玩家') && assessmentText.includes('时效风险'), 'resource assessment'],
    [specialGuideCount === 32 && specialGuideFirstSteps === 5 && specialGuideSecondSteps === 5 && specialGuideThirdSteps === 5 && specialGuideFourthSteps === 5 && specialGuideFifthSteps === 5 && specialGuideSixthSteps === 5 && specialGuideSeventhSteps === 5 && specialGuideEighthSteps === 5 && specialGuideNinthSteps === 6 && specialGuideTenthSteps === 6 && specialGuideEleventhSteps === 5 && specialGuideTwelfthSteps === 5 && specialGuideThirteenthSteps === 5 && specialGuideFourteenthSteps === 5 && specialGuideFifteenthSteps === 5 && specialGuideSixteenthSteps === 5 && specialGuideSeventeenthSteps === 5 && specialGuideEighteenthSteps === 5 && specialGuideNineteenthSteps === 5 && specialGuideTwentiethSteps === 5 && specialGuideTwentyFirstSteps === 5 && specialGuideTwentySecondSteps === 5 && specialGuideTwentyThirdSteps === 5 && specialGuideTwentyFourthSteps === 5 && specialGuideTwentyFifthSteps === 5 && specialGuideTwentySixthSteps === 5 && specialGuideTwentySeventhSteps === 5 && specialGuideTwentyEighthSteps === 5 && specialGuideTwentyNinthSteps === 5 && specialGuideThirtiethSteps === 5 && specialGuideThirtyFirstSteps === 5, 'special guide counts'],
    [specialGuideFirstTitle.includes('这轮应该怎么测试') && specialGuideSecondTitle.includes('盲测拆成四个') && specialGuideThirdTitle.includes('无障碍障碍') && specialGuideFourthTitle.includes('到底在平衡什么') && specialGuideFifthTitle.includes('让玩家先做对第一件事') && specialGuideSixthTitle.includes('别数选项') && specialGuideSeventhTitle.includes('别数谁说得多') && specialGuideEighthTitle.includes('主题够不够浓') && specialGuideNinthTitle.includes('一盒多少钱') && specialGuideTenthTitle.includes('谁要把游戏交到谁手里') && specialGuideEleventhTitle.includes('别急着评价') && specialGuideTwelfthTitle.includes('别只计秒') && specialGuideThirteenthTitle.includes('追一个判断怎样迁移') && specialGuideFourteenthTitle.includes('追下一局什么真的变了') && specialGuideFifteenthTitle.includes('先保存四条历史') && specialGuideSixteenthTitle.includes('先写单人承诺') && specialGuideSeventeenthTitle.includes('拆成可测试的人数配置') && specialGuideEighteenthTitle.includes('先写结束体验') && specialGuideNineteenthTitle.includes('先画随机事件前后的决定') && specialGuideTwentiethTitle.includes('先写分数奖励的行为') && specialGuideTwentyFirstTitle.includes('谁在什么时候决定') && specialGuideTwentySecondTitle.includes('每条空间关系在做什么') && specialGuideTwentyThirdTitle.includes('一句承诺怎样变成结果') && specialGuideTwentyFourthTitle.includes('赢家为什么会后悔') && specialGuideTwentyFifthTitle.includes('市场记住了什么') && specialGuideTwentySixthTitle.includes('追一件资源去了哪里') && specialGuideTwentySeventhTitle.includes('谁在什么时候知道什么') && specialGuideTwentyEighthTitle.includes('什么时候第一次出现') && specialGuideTwentyNinthTitle.includes('把这段效果完整走一遍') && specialGuideThirtiethTitle.includes('旧版玩家找到今天该用哪份文字') && specialGuideThirtyFirstTitle.includes('别把观点贴在棋盘上'), 'special guide titles'],
    [specialGuideThirdBoundary.includes('不能代表全部残障经验') && specialGuideFourthBoundary.includes('78 名大学生') && specialGuideFifthBoundary.includes('20 人') && specialGuideFifthBoundary.includes('12 人') && specialGuideSixthBoundary.includes('1000') && specialGuideSixthBoundary.includes('27000') && specialGuideSeventhBoundary.includes('不计算领导力') && specialGuideEighthBoundary.includes('不证明作品安全') && specialGuideNinthBoundary.includes('不提供报价') && specialGuideTenthBoundary.includes('不提供路线排名') && specialGuideEleventhBoundary.includes('不证明完成工作单会提高设计质量') && specialGuideTwelfthBoundary.includes('不提供普遍秒数') && specialGuideTwelfthBoundary.includes('中文第一人称') && specialGuideThirteenthBoundary.includes('不提供桌游设计师的通用等级') && specialGuideThirteenthBoundary.includes('仍需用户测试') && specialGuideFourteenthBoundary.includes('不提供桌游通用局数') && specialGuideFourteenthBoundary.includes('仍需新手与真实测试者验证') && specialGuideFifteenthBoundary.includes('不提供通用战役局数') && specialGuideFifteenthBoundary.includes('仍需中文新手') && specialGuideSixteenthBoundary.includes('不提供通用胜率') && specialGuideSixteenthBoundary.includes('仍需中文新手') && specialGuideSeventeenthBoundary.includes('不提供通用最佳人数') && specialGuideSeventeenthBoundary.includes('仍需中文新手') && specialGuideEighteenthBoundary.includes('不提供最佳分钟数') && specialGuideEighteenthBoundary.includes('仍需中文新手') && specialGuideNineteenthBoundary.includes('不提供最佳随机度') && specialGuideNineteenthBoundary.includes('仍需中文新手') && specialGuideTwentiethBoundary.includes('不提供最佳计分制') && specialGuideTwentiethBoundary.includes('仍需中文新手') && specialGuideTwentyFirstBoundary.includes('不提供最佳回合秒数') && specialGuideTwentyFirstBoundary.includes('仍需中文新手') && specialGuideTwentySecondBoundary.includes('不提供最佳地图大小') && specialGuideTwentySecondBoundary.includes('仍需中文新手') && specialGuideTwentyThirdBoundary.includes('不提供最佳交易对象数') && specialGuideTwentyThirdBoundary.includes('仍需中文新手'), 'special guide boundaries'],
    [specialGuideTwentyFourthBoundary.includes('不提供最佳拍卖形式') && specialGuideTwentyFourthBoundary.includes('仍需中文新手'), 'auction guide boundary'],
    [specialGuideTwentyFifthBoundary.includes('不提供最佳槽位') && specialGuideTwentySixthBoundary.includes('不提供最佳资源数量') && specialGuideTwentySeventhBoundary.includes('不提供最佳手牌上限') && specialGuideTwentyEighthBoundary.includes('不提供最佳起始牌数') && specialGuideTwentyNinthBoundary.includes('不提供最佳关键词数') && specialGuideTwentyNinthBoundary.includes('仍需中文新手') && specialGuideThirtiethBoundary.includes('不提供最佳稀有度') && specialGuideThirtiethBoundary.includes('仍需中文新手') && specialGuideThirtyFirstBoundary.includes('本地教学案例') && specialGuideThirtyFirstBoundary.includes('不证明任何机制会自动带来学习'), 'latest special guide boundaries'],
    [routeGuideToolOpened && routeGuideScrollTop === 0 && productionGuideToolOpened && productionGuideScrollTop === 0 && themeReviewGuideToolOpened && themeReviewGuideScrollTop === 0 && decisionGuideToolOpened && decisionGuideScrollTop === 0 && sharedDecisionGuideToolOpened && sharedDecisionGuideScrollTop === 0 && teachingGuideToolOpened && teachingGuideScrollTop === 0 && specialGuideToolOpened && specialGuideScrollTop === 0 && accessibilityGuideToolOpened && accessibilityGuideScrollTop === 0 && governanceGuideToolOpened && governanceGuideScrollTop === 0, 'special guide tool links'],
    [!productionLedgerLoadedBeforeIntent && productionLedgerLoadedAfterIntent, 'production ledger loads on tool intent'],
    [redesignSaved && redesignSummary.includes('玩家会保留高点数牌') && exportedRedesign.redesigns[0]?.axis === '移动' && exportedRedesign.redesigns[0]?.testQuestion.includes('关键时机'), 'redesign tool'],
    [constraintCardCount === 3 && constraintSaved && constraintSummary.includes('随机组合') && exportedConstraint.experiments?.length === 1 && exportedConstraint.experiments?.[0]?.testQuestion.includes('主动保留') && constraintBefore !== constraintAfter, 'constraint tool'],
    [balanceSaved && balanceSummary.includes('不生成总分') && exportedBalance.no_aggregate_score === true && exportedBalance.passes?.length === 1 && balanceStored.schemaVersion === 1, 'balance tool'],
    [decisionTraceSaved && decisionTraceSummary.includes('不计算决定质量') && decisionTraceSummary.includes('先修决定第一次坍缩的位置') && exportedDecisionTrace.schema_version === 1 && exportedDecisionTrace.method === 'single-decision-trace' && exportedDecisionTrace.no_aggregate_score === true && exportedDecisionTrace.traces?.length === 1 && exportedDecisionTrace.traces?.[0]?.modelUpdate.includes('检查对手位置') && decisionTraceStored.schemaVersion === 1, 'decision trace tool'],
    [sharedDecisionSaved && sharedDecisionSummary.includes('不计算参与度') && sharedDecisionSummary.includes('先修权力第一次错位的位置') && exportedSharedDecision.schema_version === 1 && exportedSharedDecision.method === 'shared-decision-observation' && exportedSharedDecision.no_aggregate_score === true && exportedSharedDecision.observations?.length === 1 && exportedSharedDecision.observations?.[0]?.consentCheck.includes('自己拍板') && sharedDecisionStored.schemaVersion === 1, 'shared decision tool'],
    [themeReviewSaved && themeReviewSummary.includes('不计算伦理或安全分') && exportedThemeReview.schema_version === 1 && exportedThemeReview.method === 'theme-commitment-and-harm-review' && exportedThemeReview.no_aggregate_score === true && exportedThemeReview.no_safety_certification === true && exportedThemeReview.reviews?.length === 1 && themeReviewStored.schemaVersion === 1, 'theme review tool'],
    [productionSaved && productionSummary.includes('不是报价或价格预测') && productionSummary.includes('先升级最可能改变决定的一项未知') && productionSummary.includes('4 项') && productionComponentCount === 4 && exportedProduction.schema_version === 1 && exportedProduction.method === 'production-assumption-ledger' && exportedProduction.no_price_prediction === true && exportedProduction.not_a_manufacturing_quote === true && exportedProduction.not_compliance_advice === true && exportedProduction.ledgers?.length === 1 && productionStored.schemaVersion === 1, 'production ledger tool'],
    [routeMapSaved && routeMapSummary.includes('不排名，不预测收益') && routeMapSummary.includes('当前有') && exportedRouteMap.schema_version === 1 && exportedRouteMap.method === 'publishing-route-responsibility-map' && exportedRouteMap.no_route_ranking === true && exportedRouteMap.not_legal_or_financial_advice === true && exportedRouteMap.platform_rules_require_recheck === true && exportedRouteMap.maps?.length === 1 && routeMapStored.schemaVersion === 1, 'publishing route map tool'],
    [teachingSaved && teachingSummary.includes('不生成理解分') && exportedTeaching.method === 'single-learning-task-path' && exportedTeaching.no_aggregate_score === true && exportedTeaching.paths?.length === 1 && teachingStored.schemaVersion === 1, 'teaching tool'],
    [selectorRecommendation === '整局盲测' && selectorText.includes('线上会删掉触感') && exportedSelector.recommendation?.type === '整局盲测', 'test selector'],
    [accessibilityTradeoffValidation && accessibilitySaved && accessibilitySummary.includes('不生成总分') && exportedAccessibility.no_aggregate_score === true && accessibilityStored.schemaVersion === 2 && migratedAccessibility.schemaVersion === 2, 'accessibility tool'],
    [experienceIntentSaved && experienceIntentSummary.includes('不生成乐趣分、玩家画像或最佳机制推荐') && experienceIntentSummary.includes('主动放弃一次立即可得') && exportedExperienceIntent.method === 'experience-intent-card' && exportedExperienceIntent.no_fun_score === true && exportedExperienceIntent.no_player_profile_inference === true && exportedExperienceIntent.no_mechanic_recommendation === true && exportedExperienceIntent.saved_records?.length === 1 && experienceIntentStored.schemaVersion === 1 && experienceIntentStored.records?.length === 1, 'experience intent card'],
    [coreLoopImportStatus && coreLoopSaved && coreLoopSummary.includes('不生成循环质量分、最优机制或玩家体验结论') && exportedCoreLoop.method === 'core-loop-canvas' && exportedCoreLoop.no_loop_quality_score === true && exportedCoreLoop.no_optimal_mechanic_recommendation === true && exportedCoreLoop.no_player_experience_claim === true && exportedCoreLoop.no_silent_intent_inference === true && exportedCoreLoop.saved_records?.length === 1 && coreLoopStored.schemaVersion === 1 && coreLoopStored.records?.length === 1, 'core loop canvas'],
    [prototypeScopeImportStatus && prototypeScopeFilterLimit && prototypeScopeSaved && prototypeScopeSummary.includes('不生成保真度总分') && exportedPrototypeScope.method === 'prototype-scope-cutter' && exportedPrototypeScope.no_fidelity_score === true && exportedPrototypeScope.no_minimum_content_recommendation === true && exportedPrototypeScope.saved_records?.length === 1 && prototypeScopeStored.schemaVersion === 1 && prototypeScopeStored.records?.length === 1, 'prototype scope tool'],
    [issueSystemSaved && issueSystemSummary.includes('不生成伦理、学习或社会影响分') && issueSystemSummary.includes('6 / 6 已填写') && exportedIssueSystem.method === 'issue-to-system-workbench' && exportedIssueSystem.no_social_impact_score === true && exportedIssueSystem.no_learning_outcome_claim === true && exportedIssueSystem.no_representativeness_certification === true && exportedIssueSystem.saved_records?.length === 1 && issueSystemStored.schemaVersion === 1 && issueSystemStored.records?.length === 1, 'issue-to-system tool'],
    [governanceConfigurationCount === 2 && governanceSaved && governanceSummary.includes('基础版首印卡牌') && exportedGovernance.method === 'content-version-governance-workbench' && exportedGovernance.no_compatibility_certification === true && exportedGovernance.no_rarity_recommendation === true && governanceStored.schemaVersion === 1 && governanceStored.records?.length === 1, 'version governance tool'],
    [evidenceReviewCandidateValidation && evidenceReviewSaved && evidenceReviewCopied && exportedEvidenceReview.method === 'evidence-review-and-change-brief' && exportedEvidenceReview.no_automatic_insight === true && exportedEvidenceReview.no_automatic_severity === true && exportedEvidenceReview.no_frequency_priority === true && exportedEvidenceReview.no_solution_from_suggestion === true && exportedEvidenceReview.no_causal_proof === true && exportedEvidenceReview.no_silent_project_mutation === true && evidenceReviewStored.schemaVersion === 2 && evidenceReviewStored.records?.length === 1, 'evidence review workbench'],
    [projectEvidenceText.includes('18') && exportedProjectPackage.method === 'local-project-workspace-export' && exportedProjectPackage.local_first === true && exportedProjectPackage.single_active_project === true && exportedProjectPackage.project?.version === 'v0.4' && Object.values(exportedProjectPackage.artifacts || {}).reduce((sum, records) => sum + (Array.isArray(records) ? records.length : 0), 0) === 18 && exportedProjectPackage.artifacts?.experience_intent_records?.length === 1 && exportedProjectPackage.artifacts?.core_loop_records?.length === 1 && exportedProjectPackage.artifacts?.prototype_scope_records?.length === 1 && exportedProjectPackage.artifacts?.playtest_sessions?.length === 1 && exportedProjectPackage.artifacts?.version_governance_records?.length === 1 && exportedProjectPackage.artifacts?.issue_to_system_records?.length === 1 && projectWorkspaceStored.checkpoints?.length === 1, 'complete project export'],
    [bodyWidth.scroll === bodyWidth.client && projectBodyWidth.scroll === projectBodyWidth.client && resourceBodyWidth.scroll === resourceBodyWidth.client && experienceIntentBodyWidth.scroll === experienceIntentBodyWidth.client && coreLoopBodyWidth.scroll === coreLoopBodyWidth.client && playtestSessionBodyWidth.scroll === playtestSessionBodyWidth.client && redesignBodyWidth.scroll === redesignBodyWidth.client && selectorBodyWidth.scroll === selectorBodyWidth.client && constraintBodyWidth.scroll === constraintBodyWidth.client && balanceBodyWidth.scroll === balanceBodyWidth.client && decisionTraceBodyWidth.scroll === decisionTraceBodyWidth.client && sharedDecisionBodyWidth.scroll === sharedDecisionBodyWidth.client && themeReviewBodyWidth.scroll === themeReviewBodyWidth.client && productionBodyWidth.scroll === productionBodyWidth.client && routeMapBodyWidth.scroll === routeMapBodyWidth.client && accessibilityBodyWidth.scroll === accessibilityBodyWidth.client && prototypeScopeBodyWidth.scroll === prototypeScopeBodyWidth.client && testPlanBodyWidth.scroll === testPlanBodyWidth.client && issueSystemBodyWidth.scroll === issueSystemBodyWidth.client && governanceBodyWidth.scroll === governanceBodyWidth.client && teachingBodyWidth.scroll === teachingBodyWidth.client, 'mobile overflow'],
    [projectInputWidth >= 300 && resourceFacetWidth >= 150 && experienceIntentInputWidth >= 300 && coreLoopInputWidth >= 300 && playtestSessionMainWidth >= 300 && evidenceReviewMainWidth >= 300 && redesignInputWidth >= 300 && selectorInputWidth >= 300 && constraintInputWidth >= 300 && balanceInputWidth >= 300 && decisionTraceInputWidth >= 300 && sharedDecisionInputWidth >= 300 && themeReviewInputWidth >= 300 && productionInputWidth >= 300 && productionComponentWidth >= 300 && routeMapInputWidth >= 300 && routeResponsibilityWidth >= 300 && accessibilityInputWidth >= 300 && prototypeScopeInputWidth >= 300 && testPlanDialogWidth === 375 && testPlanInputWidth >= 270 && issueSystemInputWidth >= 300 && governanceInputWidth >= 300 && teachingInputWidth >= 300, 'mobile input widths'],
    [resourceEntryTabsLayout.wrap === 'nowrap' && resourceEntryTabsLayout.scroll > resourceEntryTabsLayout.client, 'mobile resource entry navigation'],
    [toolTabsLayout.wrap === 'nowrap' && toolTabsLayout.scroll > toolTabsLayout.client && experienceIntentStepLayout.wrap === 'nowrap' && experienceIntentStepLayout.scroll > experienceIntentStepLayout.client && coreLoopStepLayout.wrap === 'nowrap' && coreLoopStepLayout.scroll > coreLoopStepLayout.client && playtestSessionStepLayout.wrap === 'nowrap' && playtestSessionStepLayout.scroll > playtestSessionStepLayout.client && evidenceReviewStepLayout.wrap === 'nowrap' && evidenceReviewStepLayout.scroll > evidenceReviewStepLayout.client && prototypeScopeStepLayout.wrap === 'nowrap' && prototypeScopeStepLayout.scroll > prototypeScopeStepLayout.client && testPlanStepLayout.wrap === 'nowrap' && testPlanStepLayout.scroll > testPlanStepLayout.client && issueSystemStepLayout.wrap === 'nowrap' && issueSystemStepLayout.scroll > issueSystemStepLayout.client && governanceStepLayout.scroll > governanceStepLayout.client && theoryBodyWidth.scroll === theoryBodyWidth.client && theoryStepWidth >= 280 && guideBodyWidth.scroll === guideBodyWidth.client && guideContentWidth >= 270, 'mobile navigation and content'],
  ]
  const failedChecks = checks.filter(([passed]) => !passed).map(([, label]) => label)
  if (failedChecks.length) { console.error(`QA failed: ${failedChecks.join(', ')}`); process.exitCode = 1 }
}

run().catch(error => { console.error(error); process.exitCode = 1 })
