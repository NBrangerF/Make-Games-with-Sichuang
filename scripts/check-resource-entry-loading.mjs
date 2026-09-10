import fs from 'node:fs'

const read = path => fs.readFileSync(new URL(path, import.meta.url), 'utf8')
const app = read('../src/App.tsx')
const loader = read('../src/resource-entry-loader.ts')
const runtime = read('../src/resource-entry-runtime.ts')
const generator = read('./generate-resource-index.mjs')
const validator = read('./validate-content.mjs')
const packageJson = JSON.parse(read('../package.json'))
const entryPoints = JSON.parse(read('../content/resource-entry-points.json'))
const manifest = JSON.parse(read('../content/resource-entry-manifest.json'))
const entryIndex = JSON.parse(read('../content/resource-entry-index.json'))
const entryFiles = fs.readdirSync(new URL('../content/resource-entry-catalogs/', import.meta.url)).filter(filename => filename.endsWith('.json'))

const checks = [
  [manifest.schemaVersion === 1 && manifest.defaultEntryId === entryPoints.entryPoints[0].id, '入口 manifest 默认值受权威入口驱动'],
  [manifest.entryIds.length === entryPoints.entryPoints.length && entryFiles.length === entryPoints.entryPoints.length, `${entryPoints.entryPoints.length} 个入口都有独立包`],
  [entryIndex.entryPoints.every(entry => Object.keys(entry).sort().join(',') === 'id,title'), '入口导航索引只保留 id/title'],
  [generator.includes("entry.resourceIds.map(id => resourceById.get(id))"), '入口资源从权威资源表机械生成'],
  [generator.includes("entry.resourceIds.map(id => assessmentById.get(id))"), '入口审阅从权威审阅表机械生成'],
  [validator.includes('stale packaged resources') && validator.includes('stale packaged assessments'), '内容门拒绝过期入口资源与审阅'],
  [loader.includes("import('./resource-entry-runtime')"), '入口 manifest 与路由映射不进入首屏主包'],
  [runtime.includes("import.meta.glob('../content/resource-entry-catalogs/*.json'"), '每入口保持独立动态 chunk'],
  [runtime.includes('const entryPromises = new Map'), '入口请求按 ID 去重'],
  [runtime.includes('entryPromises.delete(entryId)'), '入口加载失败后可重试'],
  [runtime.includes('return Promise.all(['), '入口索引与默认包并行加载'],
  [app.includes('function ResourceDiscoveryBoundary'), '策展入口有独立加载边界'],
  [app.includes('function ResourceEntryCatalogBoundary'), '单个入口包有独立加载边界'],
  [app.includes("resourceEntry: 'library', resourceId: 'all', readingLanguage: language") && !app.includes('onPreloadResources={preloadResourceDiscovery}'), '原创机制主题库主导航不预取旧外部资料目录'],
  [app.includes('onMouseEnter={onPreloadEntry ? () => onPreloadEntry(entry.id) : undefined}') && app.includes('onFocus={onPreloadEntry ? () => onPreloadEntry(entry.id) : undefined}'), '入口鼠标与键盘意图预取对等'],
  [app.includes("onRequestAll={() => onSelectEntry('all')}"), '完整目录通过明确的 all 路由升级'],
  [app.includes('if (isFullCatalog) return <ResourceCatalogBoundary surface="page">'), '完整目录仅在 all 路由分支消费'],
  [app.includes("section === 'resource-reading' && <ResourceCatalogBoundary>"), '资源审阅工作台保留完整目录边界'],
  [app.includes('role="alert">{error}') && app.includes('重新加载这个入口'), '入口失败可见且可恢复'],
  [app.includes('totalResourceCount={resourceIndex.length}'), '轻包页面仍显示完整资源总数'],
  [app.includes('entryPointTabs={discovery.resourceEntryPoints}') && app.includes('resourceEntryPoints: [entryCatalog.entry]'), '导航轻索引与当前完整入口语义分开'],
  [packageJson.scripts['qa:resource-entries'] === 'node scripts/check-resource-entry-loading.mjs', '独立资源入口守卫命令'],
  [packageJson.scripts['content:check'].includes('qa:resource-entries'), '资源入口守卫进入完整内容门'],
]

const failures = checks.filter(([passed]) => !passed)
for (const [passed, label] of checks) console.log(`${passed ? '✓' : '✗'} ${label}`)
if (failures.length) {
  console.error(`\n资源入口加载守卫失败：${failures.length}/${checks.length}`)
  process.exit(1)
}
console.log(`\n资源入口加载守卫通过：${checks.length}/${checks.length}`)
