import fs from 'node:fs'

const read = path => fs.readFileSync(new URL(path, import.meta.url), 'utf8')
const app = read('../src/App.tsx')
const contextualTools = read('../src/contextual-tools.tsx')
const tool = read('../src/production-ledger-tool.tsx')
const toolLoaders = read('../src/tool-loaders.ts')
const storageKeys = read('../src/storage-keys.ts')
const packageJson = JSON.parse(read('../package.json'))

const checks = [
  [toolLoaders.includes("loadProductionLedgerTool = () => import('./production-ledger-tool')"), '生产账本使用独立动态导入'],
  [app.includes('const ProductionLedgerTool = lazy('), '生产账本通过 React lazy 消费'],
  [app.includes("const LearningNodesRoute = lazy(() => import('./learning-nodes-route')"), '学习节点界面通过 React lazy 进入独立包'],
  [!app.includes("from './learning-node-catalog'"), '主应用不直接加载节点内容目录'],
  [!app.includes('function ProductionLedgerTool()'), '生产账本实现不再进入主包'],
  [tool.includes('export function ProductionLedgerTool()'), '独立工具保留可测试导出'],
  [app.includes('role="status">生产假设账本正在加载……'), '工具加载状态向辅助技术公布'],
  [contextualTools.includes('onMouseEnter={() => preloadToolSurface(item.toolId)}') && contextualTools.includes('onFocus={() => preloadToolSurface(item.toolId)}'), '语境工具鼠标与键盘意图预取对等'],
  [tool.includes('no_price_prediction: true') && tool.includes('not_a_manufacturing_quote: true') && tool.includes('not_compliance_advice: true'), '拆分后保留安全导出边界'],
  [tool.includes("localStorage.getItem(PRODUCTION_LEDGER_STORAGE_KEY)") && tool.includes("localStorage.setItem(PRODUCTION_LEDGER_STORAGE_KEY"), '拆分后保留本地读写'],
  [storageKeys.includes("PRODUCTION_LEDGER_STORAGE_KEY = 'tabletop-workshop-production-ledgers-v1'"), '存储 key 在项目汇总与工具间共享'],
  [app.includes("{ id: 'production_ledgers', key: PRODUCTION_LEDGER_STORAGE_KEY, collection: 'ledgers' }"), '完整项目包仍汇总生产记录'],
  [packageJson.scripts['qa:main-boundaries'] === 'node scripts/check-main-bundle-boundaries.mjs', '独立主包边界守卫命令'],
  [packageJson.scripts['content:check'].includes('qa:main-boundaries'), '主包边界守卫进入完整内容门'],
]

const failures = checks.filter(([passed]) => !passed)
for (const [passed, label] of checks) console.log(`${passed ? '✓' : '✗'} ${label}`)
if (failures.length) {
  console.error(`\n主包边界守卫失败：${failures.length}/${checks.length}`)
  process.exit(1)
}
console.log(`\n主包边界守卫通过：${checks.length}/${checks.length}`)
