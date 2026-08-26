import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const outputDir = path.join(root, 'docs/qa/screenshots/playable-archive-v5-1')
const baseUrl = 'http://127.0.0.1:8017/?build=playable-archive-v5-1'
const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

await mkdir(outputDir, { recursive: true })

const browser = await chromium.launch({ headless: true, executablePath: chromePath })
const checks = []

async function capture(name, hash, viewport, options = {}) {
  const context = await browser.newContext({ viewport, deviceScaleFactor: 1 })
  const page = await context.newPage()
  const consoleErrors = []
  page.on('console', message => {
    if (message.type() === 'error') consoleErrors.push(message.text())
  })
  page.on('pageerror', error => consoleErrors.push(error.message))

  await page.goto(`${baseUrl}${hash}`, { waitUntil: 'networkidle' })
  await page.locator('main').waitFor({ state: 'visible' })
  await page.evaluate(async () => {
    await Promise.all([...document.images].map(image => image.decode().catch(() => undefined)))
    await document.fonts?.ready
  })

  const metrics = await page.evaluate(() => {
    const rootElement = document.documentElement
    const main = document.querySelector('main')
    const header = document.querySelector('.header')
    const h1 = main?.querySelector('h1')
    const firstSpecimen = document.querySelector('.classic-visual-board__specimen')
    const bodyStyle = getComputedStyle(document.body)
    const headerStyle = header ? getComputedStyle(header) : undefined
    const h1Style = h1 ? getComputedStyle(h1) : undefined
    const specimenStyle = firstSpecimen ? getComputedStyle(firstSpecimen) : undefined
    const images = [...document.images]
    const targetElements = [...document.querySelectorAll('button, a, input, select, textarea, summary')]

    return {
      href: location.href,
      title: document.title,
      h1Count: main?.querySelectorAll('h1').length ?? 0,
      mainWidth: main?.getBoundingClientRect().width ?? 0,
      viewportWidth: innerWidth,
      viewportHeight: innerHeight,
      documentWidth: rootElement.scrollWidth,
      horizontalOverflow: rootElement.scrollWidth > rootElement.clientWidth + 1,
      bodyBackground: bodyStyle.backgroundColor,
      headerHeight: headerStyle?.height,
      h1FontSize: h1Style?.fontSize,
      h1FontWeight: h1Style?.fontWeight,
      specimenTransform: specimenStyle?.transform,
      specimenShadow: specimenStyle?.boxShadow,
      smallInteractiveTargets: targetElements
        .map(element => {
          const rect = element.getBoundingClientRect()
          return { text: element.textContent?.trim().slice(0, 48), width: rect.width, height: rect.height }
        })
        .filter(target => target.width > 0 && target.height > 0 && (target.width < 24 || target.height < 24)),
      images: images.map(image => ({
        src: image.getAttribute('src'),
        complete: image.complete,
        naturalWidth: image.naturalWidth,
        naturalHeight: image.naturalHeight,
      })),
    }
  })

  const screenshotPath = path.join(outputDir, `${name}.png`)
  await page.screenshot({ path: screenshotPath, fullPage: options.fullPage ?? false })
  checks.push({ name, hash, viewport, screenshotPath, consoleErrors, ...metrics })
  await context.close()
}

await capture('home-native-1504x1046', '#resources', { width: 1504, height: 1046 })
await capture('resource-native-1487x1058', '#resources/all', { width: 1487, height: 1058 })
await capture('reading-native-1487x1058', '#resources/learn/game-design-concepts-level-01', { width: 1487, height: 1058 })
await capture('methods-native-1487x1058', '#method/frameworks', { width: 1487, height: 1058 })
await capture('tool-native-1487x1058', '#tools/prototype-scope', { width: 1487, height: 1058 })
await capture('home-laptop-1024x768', '#resources', { width: 1024, height: 768 })
await capture('home-tablet-768x900', '#resources', { width: 768, height: 900 })
await capture('home-mobile-390x844', '#resources', { width: 390, height: 844 }, { fullPage: true })
await capture('home-mobile-320x800', '#resources', { width: 320, height: 800 }, { fullPage: true })

const interactionContext = await browser.newContext({ viewport: { width: 1280, height: 800 } })
const page = await interactionContext.newPage()
const interactionErrors = []
page.on('console', message => {
  if (message.type() === 'error') interactionErrors.push(message.text())
})
page.on('pageerror', error => interactionErrors.push(error.message))

await page.goto(`${baseUrl}#resources`, { waitUntil: 'networkidle' })
const aboveFoldCopy = await page.locator('main').innerText()
await page.locator('.resource-start-choice').first().click()
const learningHash = await page.evaluate(() => location.hash)

await page.goto(`${baseUrl}#resources/all`, { waitUntil: 'networkidle' })
await page.locator('.resource-search-panel > summary').click()
const search = page.locator('input[type="search"]').first()
await search.fill('Kathleen')
await page.waitForTimeout(150)
const searchResult = await page.locator('.result-count').innerText()

await page.goto(`${baseUrl}#method/frameworks`, { waitUntil: 'networkidle' })
const frameworkTabs = page.locator('.framework-tab')
await frameworkTabs.first().waitFor({ state: 'visible' })
const frameworkCount = await frameworkTabs.count()
if (frameworkCount > 1) await frameworkTabs.nth(1).click()
const selectedFramework = await page.locator('.framework-sheet h2').first().innerText()

await page.goto(`${baseUrl}#tools/prototype-scope`, { waitUntil: 'networkidle' })
const toolHeading = await page.locator('main h1').innerText()
const stepButtons = page.locator('.scope-steps button')
await stepButtons.first().waitFor({ state: 'visible' })
const stepCount = await stepButtons.count()
if (stepCount > 1) await stepButtons.nth(1).click()
const pressedSteps = await page.locator('main nav button[aria-pressed="true"]').count()

checks.push({
  name: 'core-interactions',
  learningHash,
  searchResult,
  selectedFramework,
  frameworkCount,
  toolHeading,
  stepCount,
  pressedSteps,
  aboveFoldCopy,
  consoleErrors: interactionErrors,
})

await interactionContext.close()
await browser.close()

const metricsPath = path.join(root, 'docs/qa/playable-archive-v5-1-browser-metrics.json')
await writeFile(metricsPath, `${JSON.stringify(checks, null, 2)}\n`)
console.log(`captured ${checks.length - 1} visual states and interaction evidence`)
console.log(path.relative(root, metricsPath))
