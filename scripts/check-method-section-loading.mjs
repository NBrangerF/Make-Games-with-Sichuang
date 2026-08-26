import fs from 'node:fs'

const app = fs.readFileSync(new URL('../src/App.tsx', import.meta.url), 'utf8')
const loader = fs.readFileSync(new URL('../src/method-loader.ts', import.meta.url), 'utf8')
const data = fs.readFileSync(new URL('../src/data.ts', import.meta.url), 'utf8')
const packageJson = JSON.parse(fs.readFileSync(new URL('../package.json', import.meta.url), 'utf8'))

const checks = [
  [loader.includes("import('./framework-catalog')"), '框架独立动态导入'],
  [loader.includes("import('./glossary-catalog')"), '词表独立动态导入'],
  [loader.includes("import('./special-guide-catalog')"), '专题指南独立动态导入'],
  [loader.includes('frameworksPromise = undefined'), '框架加载失败可重试'],
  [loader.includes('glossaryPromise = undefined'), '词表加载失败可重试'],
  [loader.includes('specialGuidesPromise = undefined'), '专题指南加载失败可重试'],
  [app.includes('function MethodSectionBoundary<T>'), '方法标签共用加载边界'],
  [app.includes('role="status">{loadingLabel}'), '加载状态向辅助技术公布'],
  [app.includes('role="alert">{error}'), '加载错误向辅助技术公布'],
  [app.includes('onMouseEnter={preloadSpecialGuides}') && app.includes('onFocus={preloadSpecialGuides}'), '专题指南鼠标与键盘意图预取对等'],
  [app.includes('onMouseEnter={preloadGlossary}') && app.includes('onFocus={preloadGlossary}'), '词表鼠标与键盘意图预取对等'],
  [!app.includes('onPreloadMethod=') && app.includes('选择方法与概念入口'), '方法主导航先进入任务入口，不默认预取理论'],
  [app.includes("title: '理解一种分析方法'") && app.includes('preload: preloadFrameworks'), '理论入口只在鼠标或键盘表达意图后预取'],
  [app.includes("section === 'guides' && <MethodSectionBoundary load={loadSpecialGuides}"), '专题标签按需消费指南数据'],
  [app.includes("section === 'glossary' && <MethodSectionBoundary load={loadGlossary}"), '词表标签按需消费词条数据'],
  [!app.includes('MethodCatalogBoundary') && !app.includes('loadMethodCatalog'), '旧的整包方法边界已移除'],
  [!data.includes('type MethodCatalog'), '共享类型不再暗示必须整包加载'],
  [packageJson.scripts['qa:method-sections'] === 'node scripts/check-method-section-loading.mjs', '独立方法分片守卫命令'],
]

const failures = checks.filter(([passed]) => !passed)
for (const [passed, label] of checks) console.log(`${passed ? '✓' : '✗'} ${label}`)
if (failures.length) {
  console.error(`\n方法分片守卫失败：${failures.length}/${checks.length}`)
  process.exit(1)
}
console.log(`\n方法分片守卫通过：${checks.length}/${checks.length}`)
