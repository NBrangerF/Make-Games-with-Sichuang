import { readFileSync } from 'node:fs'

const document = JSON.parse(readFileSync(new URL('../content/design-materials.json', import.meta.url), 'utf8'))
const errors = []
const assert = (condition, message) => { if (!condition) errors.push(message) }
const unique = values => new Set(values).size === values.length
const nonEmpty = (record, fields, prefix) => {
  for (const field of fields) assert(typeof record[field] === 'string' && record[field].trim(), `${prefix}${field} 不能为空`)
}

assert(document.schemaVersion === 1, 'schemaVersion 必须为 1')
assert(typeof document.principle === 'string' && document.principle.length > 20, '必须说明材料库边界')
assert(Array.isArray(document.mechanics) && document.mechanics.length >= 16, '首批 mechanic 不能少于 16 张')
assert(Array.isArray(document.themes) && document.themes.length >= 12, '首批 theme 不能少于 12 张')

const mechanicIds = new Set(document.mechanics.map(item => item.id))
const themeIds = new Set(document.themes.map(item => item.id))
assert(mechanicIds.size === document.mechanics.length, 'mechanic ID 必须唯一')
assert(themeIds.size === document.themes.length, 'theme ID 必须唯一')

for (const item of document.mechanics) {
  const prefix = `mechanic ${item.id ?? '未知'}：`
  assert(/^[a-z0-9-]+$/.test(item.id), `${prefix}ID 只能使用小写字母、数字和连字符`)
  nonEmpty(item, ['name', 'summary', 'playerVerb', 'tableChange', 'tension', 'watchFor', 'exercise'], prefix)
  for (const field of ['aliases', 'materialTags', 'interactionTags', 'themePromptIds']) assert(Array.isArray(item[field]) && item[field].length > 0, `${prefix}${field} 必须是非空数组`)
  assert(unique([...item.materialTags, ...item.interactionTags]), `${prefix}标签不能重复`)
  for (const themeId of item.themePromptIds ?? []) assert(themeIds.has(themeId), `${prefix}未知 theme 交叉引用 ${themeId}`)
}

for (const item of document.themes) {
  const prefix = `theme ${item.id ?? '未知'}：`
  assert(/^[a-z0-9-]+$/.test(item.id), `${prefix}ID 只能使用小写字母、数字和连字符`)
  nonEmpty(item, ['name', 'premise', 'playerPosition', 'repeatedActions', 'systemPressure', 'systemQuestion', 'care', 'exercise'], prefix)
  for (const field of ['contextTags', 'toneTags', 'mechanicPromptIds']) assert(Array.isArray(item[field]) && item[field].length > 0, `${prefix}${field} 必须是非空数组`)
  assert(unique([...item.contextTags, ...item.toneTags]), `${prefix}标签不能重复`)
  for (const mechanicId of item.mechanicPromptIds ?? []) assert(mechanicIds.has(mechanicId), `${prefix}未知 mechanic 交叉引用 ${mechanicId}`)
}

const learnerCopy = [...document.mechanics, ...document.themes].map(item => JSON.stringify(item)).join('\n')
assert(!/最佳机制|最适合的机制|保证有趣|一定好玩|能力评分|能力等级/.test(learnerCopy), '材料文案不得承诺最佳组合、乐趣或能力评分')

if (errors.length) {
  for (const error of errors) console.error(`FAIL  ${error}`)
  console.error(`\n设计材料校验失败：${errors.length} 项`)
  process.exit(1)
}

console.log(`PASS  ${document.mechanics.length} 张 mechanic 材料结构完整`)
console.log(`PASS  ${document.themes.length} 张 theme 材料结构完整`)
console.log('PASS  mechanic/theme 交叉引用全部存在')
console.log('PASS  材料不承诺最佳组合、乐趣或能力评分')
console.log('\n4/4 design material checks passed.')
