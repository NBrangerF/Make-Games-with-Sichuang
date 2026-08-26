import fs from 'node:fs'

const read = path => fs.readFileSync(new URL(path, import.meta.url), 'utf8')
const pathsRecord = JSON.parse(read('../content/resource-audience-paths.json'))
const entryIndex = JSON.parse(read('../content/resource-entry-index.json'))
const app = read('../src/App.tsx')
const discovery = read('../src/resource-discovery-catalog.ts')
const styles = read('../src/styles.css')
const packageJson = JSON.parse(read('../package.json'))

const paths = pathsRecord.paths ?? []
const entryIds = new Set(entryIndex.entryPoints.map(entry => entry.id))
const pathIds = paths.map(path => path.id)
const forbiddenSegmentation = /年龄|小学生|中学生|大学生|儿童|青少年|成年人|成人/

const checks = [
  [pathsRecord.schemaVersion === 1, '处境入口有显式 schema 版本'],
  [paths.length >= 6, '至少覆盖六种常见学习处境'],
  [new Set(pathIds).size === pathIds.length, '处境入口 ID 不重复'],
  [paths.every(path => ['id', 'title', 'situation', 'entryId', 'why'].every(field => typeof path[field] === 'string' && path[field].trim())), '每个入口都有完整说明'],
  [paths.every(path => entryIds.has(path.entryId)), '每个处境都指向已存在的权威资源入口'],
  [!forbiddenSegmentation.test(JSON.stringify(paths)), '可选择的入口不按年龄或身份阶段分流'],
  [discovery.includes("import resourceAudiencePathRecord from '../content/resource-audience-paths.json'"), '处境入口随轻量资源发现目录加载'],
  [discovery.includes('resourceAudiencePathPrinciple') && discovery.includes('resourceAudiencePaths'), '资源发现目录公开原则与入口数据'],
  [app.includes('<summary>我不知道自己在哪一步</summary>'), '阶段判断困难时有明确的备用入口'],
  [app.includes('aria-label="按当前处境选择资源入口"'), '处境入口有可访问导航名称'],
  [app.includes('readingSupportLabel(assessment.audienceLevels)') && app.includes('readingUseLabels(assessment.useModes)'), '资源列表把审阅元数据翻译成阅读提示'],
  [app.includes('<h2>先看这一句</h2>') && app.includes('<h2>怎么开始读</h2>') && app.includes('<h2>读完先做</h2>'), '站内导读按分层阅读顺序组织'],
  [styles.includes('.resource-audience-helper nav') && styles.includes('.resource-reading-cues'), '处境入口与阅读提示有独立样式'],
  [packageJson.scripts['qa:resource-audience-paths'] === 'node scripts/check-resource-audience-paths.mjs', '独立处境入口守卫命令'],
  [packageJson.scripts['content:check'].includes('qa:resource-audience-paths'), '处境入口守卫进入完整内容门'],
]

const failures = checks.filter(([passed]) => !passed)
for (const [passed, label] of checks) console.log(`${passed ? '✓' : '✗'} ${label}`)
if (failures.length) {
  console.error(`\n资源受众入口守卫失败：${failures.length}/${checks.length}`)
  process.exit(1)
}
console.log(`\n资源受众入口守卫通过：${checks.length}/${checks.length}`)
