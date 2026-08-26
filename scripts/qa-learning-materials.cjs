const { spawn } = require('node:child_process')
const { chromium } = require('playwright')

const baseUrl = process.env.QA_BASE_URL || 'http://127.0.0.1:5177/'
const chromePath = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const wait = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds))

async function waitForServer(url, preview, output) {
  if (!preview) return
  for (let attempt = 0; attempt < 240; attempt += 1) {
    if (preview.exitCode !== null) throw new Error(`preview exited with ${preview.exitCode}: ${output()}`)
    try { if ((await fetch(url)).ok) return } catch {}
    await wait(250)
  }
  throw new Error(`preview did not become ready: ${output()}`)
}

async function run() {
  const preview = process.env.QA_BASE_URL ? null : spawn(process.env.PNPM_BIN || 'pnpm', ['preview', '--host', '127.0.0.1', '--port', '5177'], { stdio: ['ignore', 'pipe', 'pipe'] })
  let previewOutput = ''
  preview?.stdout.on('data', chunk => { previewOutput += chunk.toString() })
  preview?.stderr.on('data', chunk => { previewOutput += chunk.toString() })
  await waitForServer(baseUrl, preview, () => previewOutput)

  const browser = await chromium.launch({ executablePath: chromePath, headless: true })
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } })
  const page = await context.newPage()
  page.setDefaultTimeout(15000)
  const errors = []
  page.on('console', message => { if (message.type() === 'error') errors.push(`console: ${message.text()}`) })
  page.on('pageerror', error => errors.push(`page: ${error.message}`))
  page.on('response', response => { if (response.status() >= 400) errors.push(`http ${response.status()}: ${response.url()}`) })

  await page.goto(`${baseUrl}#learn`, { waitUntil: 'networkidle' })
  await page.getByRole('heading', { name: /你现在/ }).waitFor()
  const navLabels = await page.locator('.header nav .nav-link').allTextContents()
  const entryCount = await page.locator('.learning-home__entry-grid article').count()
  const materialActionCount = await page.locator('.learning-home__material-actions button').count()

  await page.getByRole('button', { name: /浏览 mechanic 设计材料/ }).click()
  await page.waitForFunction(() => window.location.hash === '#learn/mechanics')
  await page.getByRole('heading', { name: /Mechanic 不是名字/ }).waitFor()
  const mechanicCount = await page.locator('.design-material-card').count()
  await page.getByLabel('搜索动作、关系或材料').fill('交换')
  const searchedMechanicCount = await page.locator('.design-material-card').count()
  const firstDetails = page.locator('.design-material-card details').first()
  await firstDetails.locator('summary').click()
  const exerciseVisible = await firstDetails.getByText('10—20 分钟练习', { exact: true }).isVisible()
  await page.locator('.design-material-card').first().getByRole('button', { name: '带这张牌去第一次落桌', exact: true }).click()
  await page.waitForFunction(() => window.location.hash === '#learn/first-tabletop')
  await page.getByRole('heading', { name: '第一次落桌', exact: true }).waitFor()
  const seededMechanic = await page.getByLabel('Mechanic 牌').inputValue()

  await page.getByLabel('Theme 牌').selectOption('archive')
  await page.getByLabel('玩家在追求什么？ *').fill('在三轮内完成两份可查询的记录，同时保留至少一个空位。')
  await page.getByLabel('游戏何时以及为什么结束？ *').fill('第三轮结束；比较可查询记录，并检查是否仍有空位。')
  await page.getByLabel('玩家每回合反复做什么？ *').fill('从两张记录中选择一张保存或公开，并放弃另一张的当前用途。')
  await page.getByLabel('做完以后，玩家立刻看见什么改变？ *').fill('档案空位和公开线索立即变化，下一位玩家能查询的内容随之改变。')
  await page.getByLabel('第一次测试只问什么？ *').fill('玩家会不会为了保留未来查询空间，放弃眼前完整的一组记录？')
  await page.getByRole('button', { name: '已落桌', exact: true }).click()
  const tabletopRecorded = await page.getByText(/已记录为“已落桌”/).isVisible()
  await page.getByRole('button', { name: '已测试', exact: true }).click()
  const testedBlocked = await page.getByText(/“已测试”需要一条真实运行记录/).isVisible()
  await page.getByLabel('真实运行记录').fill('第 2 轮，玩家保留了一张不完整记录；他说想给下一轮查询留位置。')
  await page.getByRole('button', { name: '已测试', exact: true }).click()
  const testedRecorded = await page.getByText(/已记录为“已测试”/).isVisible()
  const storedBeforeReload = await page.evaluate(() => JSON.parse(localStorage.getItem('tabletop-workshop-first-tabletop-v1') || 'null')?.actionState)
  await page.reload({ waitUntil: 'networkidle' })
  const storedAfterReload = await page.evaluate(() => JSON.parse(localStorage.getItem('tabletop-workshop-first-tabletop-v1') || 'null')?.actionState)
  const testedPersists = await page.getByRole('button', { name: '已测试', exact: true }).getAttribute('aria-pressed')

  await page.goto(`${baseUrl}#learn/iteration`, { waitUntil: 'networkidle' })
  await page.getByRole('heading', { name: /从一个不确定性/ }).waitFor()
  const iterationNodeCount = await page.locator('.learning-node-list > li').count()
  const projectGate = await page.getByRole('heading', { name: '先固定这一轮在推进哪个游戏。', exact: true }).isVisible()
  await page.goto(`${baseUrl}#learn/observe`, { waitUntil: 'networkidle' })
  await page.getByRole('heading', { name: /从一局游戏中/ }).waitFor()
  const observationNodeCount = await page.locator('.learning-node-list > li').count()
  await page.goto(`${baseUrl}#learn/node-10`, { waitUntil: 'networkidle' })
  await page.getByRole('heading', { name: '执行一次不泄露答案的测试', exact: true }).waitFor()
  const node10RequiredState = await page.getByText('这一步至少需要：已测试', { exact: true }).isVisible()

  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto(`${baseUrl}#learn`, { waitUntil: 'networkidle' })
  const homeOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1)
  await page.goto(`${baseUrl}#learn/themes`, { waitUntil: 'networkidle' })
  await page.locator('.design-material-card').first().waitFor()
  const themeCount = await page.locator('.design-material-card').count()
  const materialsOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1)
  await page.goto(`${baseUrl}#learn/first-tabletop`, { waitUntil: 'networkidle' })
  await page.getByRole('heading', { name: '第一次落桌', exact: true }).waitFor()
  const challengeOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1)

  const checks = [
    [JSON.stringify(navLabels) === JSON.stringify(['从哪里开始', '按问题找', '资料库']), '新主导航文案与顺序'],
    [entryCount === 4, `四种用户状态入口（实际 ${entryCount}）`],
    [materialActionCount === 2, `mechanic/theme 两个材料入口（实际 ${materialActionCount}）`],
    [mechanicCount === 17, `17 张 mechanic（实际 ${mechanicCount}）`],
    [searchedMechanicCount > 0 && searchedMechanicCount < mechanicCount, `mechanic 搜索收窄结果（实际 ${searchedMechanicCount}）`],
    [exerciseVisible, '材料卡按需展开小练习'],
    [Boolean(seededMechanic), `材料选择带入第一次落桌（${seededMechanic || '空'}）`],
    [tabletopRecorded, '已落桌状态需要明确点击记录'],
    [testedBlocked, '没有现场记录时阻止标记已测试'],
    [testedRecorded && testedPersists === 'true', `真实运行记录与已测试状态刷新后保留（recorded=${testedRecorded}, before=${storedBeforeReload}, after=${storedAfterReload}, aria=${testedPersists}）`],
    [iterationNodeCount === 7 && projectGate, `迭代主线 7 节且有项目门（实际 ${iterationNodeCount}）`],
    [observationNodeCount === 5, `观察实验室 5 节（实际 ${observationNodeCount}）`],
    [node10RequiredState, '执行测试节点明确要求已测试'],
    [themeCount === 12, `12 张 theme（实际 ${themeCount}）`],
    [!homeOverflow && !materialsOverflow && !challengeOverflow, `390px 无横向溢出（home=${homeOverflow}, materials=${materialsOverflow}, challenge=${challengeOverflow}）`],
    [errors.length === 0, `无控制台、页面或 HTTP 错误${errors.length ? `：${errors.join(' | ')}` : ''}`],
  ]

  for (const [passed, label] of checks) console.log(`${passed ? 'PASS' : 'FAIL'}  ${label}`)
  await browser.close()
  preview?.kill('SIGTERM')
  if (checks.some(([passed]) => !passed)) process.exit(1)
  console.log(`\n${checks.length}/${checks.length} learning materials browser checks passed.`)
}

run().catch(error => {
  console.error(error)
  process.exit(1)
})
