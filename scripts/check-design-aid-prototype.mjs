import { readFile } from 'node:fs/promises'

const root = new URL('../design/prototypes/', import.meta.url)
const [html, css, js] = await Promise.all([
  readFile(new URL('design-aid-loop.html', root), 'utf8'),
  readFile(new URL('design-aid-loop.css', root), 'utf8'),
  readFile(new URL('design-aid-loop.js', root), 'utf8')
])

const checks = []

function check(name, condition, detail) {
  checks.push({ name, ok: Boolean(condition), detail })
}

function includesAll(source, values) {
  return values.every(value => source.includes(value))
}

const firstScreen = html.match(/<section class="screen" data-step="0"[\s\S]*?<\/section>/)?.[0] || ''
const completionScreen = html.match(/<section class="screen" data-step="7"[\s\S]*?<\/section>/)?.[0] || ''
const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map(match => match[1]))
const staticJsIdReferences = [...js.matchAll(/\$\('([^']+)'\)/g)].map(match => match[1])
const missingIds = [...new Set(staticJsIdReferences.filter(id => !ids.has(id)))]

check('offline assets are relative', includesAll(html, [
  'href="design-aid-loop.css"',
  'src="design-aid-loop.js"'
]), 'HTML can be copied with its sibling CSS and JS files.')

check('T1 chooses output without tool names', includesAll(firstScreen, [
  '两个可比较的方向',
  '一个更具体的问题',
  '一份能运行的短规则',
  '一条来自实际游玩的观察'
]) && !['生成候选', '诊断原型', '缩成原型', '完成练习闭环'].some(label => firstScreen.includes(label)), 'The first screen names desired artifacts, not internal modes.')

check('T2 preserves prompt refusal and authorship', includesAll(html + js, [
  '换一张',
  '我自己写',
  '使用我写的提示',
  '连续换了三次',
  '拒绝不会失分'
]), 'Swap, self-write, and three-swap interruption are present.')

check('T3 requires rule artifact and counter-signal', includesAll(js, [
  'playerAction',
  'directConsequence',
  'experienceLink',
  'supportingSignal',
  'counterSignal',
  '题材或机制名称还不能进入测试'
]), 'Generate mode and prediction validation are explicit.')

check('T4 has a diagnosis-specific path', includesAll(js, [
  'currentSymptom',
  'situation',
  'observableAction',
  'artifactCounterSignal',
  '把评价改写成局面与可观察动作'
]), 'Diagnosis transforms a complaint into observable context and a counter-signal.')

check('T5 separates evidence states', includesAll(html + js, [
  '只完成测试准备',
  '自己走查或自测',
  '与目标参与者实际测试',
  '不能验证目标玩家的体验',
  '不会生成模拟玩家反馈'
]), 'Preparation, self-test, and external evidence are distinct.')

check('T6 keeps reflection private and deletable', includesAll(html + js, [
  '反思默认私有',
  '预览分享摘要',
  '只删除私有反思',
  '已排除：私有反思、拒绝理由',
  "$('privateReflection').value = ''"
]), 'Private reflection is excluded from share preview and can be deleted alone.')

check('completion avoids a quality verdict', completionScreen.includes('这不代表设计已经通过') && !completionScreen.includes('设计已通过') && !completionScreen.includes('得分') && !completionScreen.includes('徽章'), 'Completion records the exercise without a score, badge, or pass verdict.')

check('all static JavaScript ID references resolve', missingIds.length === 0, missingIds.length ? `Missing IDs: ${missingIds.join(', ')}` : `${staticJsIdReferences.length} references resolved.`)

check('mobile and reduced-motion rules exist', includesAll(css, [
  '@media (max-width: 760px)',
  'grid-template-columns: 1fr',
  '@media (prefers-reduced-motion: reduce)'
]), 'The prototype defines a single-column mobile layout and disables motion on request.')

const failed = checks.filter(result => !result.ok)
for (const result of checks) {
  console.log(`${result.ok ? 'PASS' : 'FAIL'}  ${result.name}: ${result.detail}`)
}

console.log(`\n${checks.length - failed.length}/${checks.length} structural checks passed.`)
if (failed.length) process.exitCode = 1

