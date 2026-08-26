import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const app = readFileSync(new URL('../src/App.tsx', import.meta.url), 'utf8')
const checks = []
const check = (label, action) => {
  try { action(); checks.push([true, label, '']) }
  catch (error) { checks.push([false, label, error.message]) }
}

check('项目护照 v2 固定玩家、人数、时长、边界、骨架和组件范围', () => {
  for (const field of ['audience:', 'playerCount:', 'duration:', 'designBoundaries:', 'goalAndEnd:', 'turnStructure:', 'componentScope:']) assert.ok(app.includes(field), field)
  assert.ok(app.includes("PROJECT_WORKSPACE_STORAGE_KEY = 'tabletop-workshop-project-workspace-v2'"))
})

check('旧项目护照保守迁移，不猜测缺失字段', () => {
  assert.ok(app.includes("LEGACY_PROJECT_WORKSPACE_STORAGE_KEY = 'tabletop-workshop-project-workspace-v1'"))
  assert.ok(app.includes('schemaVersion: 2 as const'))
  assert.ok(app.includes('...DEFAULT_PROJECT_WORKSPACE, ...legacy'))
})

check('完整项目包可以导出并恢复项目护照', () => {
  assert.ok(app.includes("method: 'local-project-workspace-export'"))
  assert.ok(app.includes('schema_version: 2'))
  assert.ok(app.includes('从项目包恢复护照'))
  assert.ok(app.includes("accept=\"application/json,.json\""))
})

check('导入不会冒充工具记录已同步', () => {
  assert.ok(app.includes('工具记录不会从文件自动写回本机'))
  assert.ok(app.includes('请重新核对本机工具记录归属'))
})

for (const [passed, label, detail] of checks) console.log(`${passed ? 'PASS' : 'FAIL'}  ${label}${detail ? `: ${detail}` : ''}`)
const failures = checks.filter(([passed]) => !passed)
console.log(`\n${checks.length - failures.length}/${checks.length} project workspace v2 checks passed.`)
if (failures.length) process.exit(1)
