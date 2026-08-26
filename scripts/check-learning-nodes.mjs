import { readFileSync } from 'node:fs'

const readJson = path => JSON.parse(readFileSync(new URL(`../${path}`, import.meta.url), 'utf8'))
const nodesDocument = readJson('content/learning-nodes.json')
const glossary = readJson('content/glossary-index.json')
const resourceEntries = readJson('content/resource-entry-points.json').entryPoints
const coreGuides = readJson('content/guides.json')
const specialGuides = readJson('content/special-guides.json')
const routeSource = readFileSync(new URL('../src/learning-content-route.ts', import.meta.url), 'utf8')
const dataSource = readFileSync(new URL('../src/data.ts', import.meta.url), 'utf8')

const errors = []
const assert = (condition, message) => { if (!condition) errors.push(message) }
const ids = values => new Set(values.map(value => value.id))
const cjkLength = value => (String(value ?? '').match(/[\u3400-\u9fff]/g) ?? []).length

assert(nodesDocument.schemaVersion === 1, 'schemaVersion 必须为 1')
assert(Array.isArray(nodesDocument.modes) && nodesDocument.modes.length === 3, '必须提供带着做、自己做、项目版三种呈现模式')
assert(Array.isArray(nodesDocument.nodes) && nodesDocument.nodes.length === 12, '主线必须严格包含 12 个节点')

const nodeIds = ids(nodesDocument.nodes)
const glossaryIds = ids(glossary)
const resourceEntryIds = ids(resourceEntries)
const guideIds = new Set([...ids(coreGuides), ...ids(specialGuides)])
const toolIds = new Set([...(dataSource.matchAll(/'([^']+)'/g))].map(match => match[1]))

const orders = nodesDocument.nodes.map(node => node.order)
assert(new Set(orders).size === 12 && orders.every((order, index) => order === index + 1), '节点 order 必须从 1 到 12 连续排列')
assert(nodeIds.size === 12, '节点 ID 必须唯一')

for (const node of nodesDocument.nodes) {
  const prefix = `${node.id ?? '未知节点'}：`
  for (const field of ['title', 'question', 'thought', 'example', 'action', 'toolTitle', 'toolPrompt', 'toolPlaceholder', 'output', 'doneWhen', 'limit', 'toolId']) {
    assert(typeof node[field] === 'string' && node[field].trim(), `${prefix}${field} 不能为空`)
  }
  assert(/^node-\d{2}$/.test(node.id), `${prefix}ID 必须使用 node-01 格式`)
  assert(cjkLength(node.thought) <= 42, `${prefix}一句话思维超过 42 个汉字`)
  assert(cjkLength(node.action) <= 74, `${prefix}当前动作超过 74 个汉字`)
  assert(cjkLength(node.doneWhen) <= 55, `${prefix}完成信号超过 55 个汉字`)
  assert(toolIds.has(node.toolId), `${prefix}未知工具 ${node.toolId}`)
  assert(Array.isArray(node.conceptIds) && node.conceptIds.length <= 3, `${prefix}概念入口不能超过 3 个`)
  assert(Array.isArray(node.resourceEntryIds) && node.resourceEntryIds.length <= 3, `${prefix}资料入口不能超过 3 个`)
  assert(Array.isArray(node.branches) && node.branches.length <= 3, `${prefix}问题支线不能超过 3 个`)
  for (const conceptId of node.conceptIds ?? []) assert(glossaryIds.has(conceptId), `${prefix}未知概念 ${conceptId}`)
  for (const resourceId of node.resourceEntryIds ?? []) assert(resourceEntryIds.has(resourceId), `${prefix}未知资料入口 ${resourceId}`)
  for (const guideId of node.sourceGuideIds ?? []) assert(guideIds.has(guideId), `${prefix}未知指南来源 ${guideId}`)
  for (const branch of node.branches ?? []) assert(guideIds.has(branch.id), `${prefix}未知支线 ${branch.id}`)
  for (const contentId of node.sourceContentIds ?? []) assert(routeSource.includes(`'${contentId}'`), `${prefix}未知长文来源 ${contentId}`)
  for (const item of node.cases ?? []) assert(routeSource.includes(`'${item.id}'`), `${prefix}未知案例 ${item.id}`)
  assert(nodeIds.has(node.nextNodeId), `${prefix}下一节点 ${node.nextNodeId} 不存在`)
  const learnerCopy = [node.title, node.question, node.thought, node.action, node.output, node.doneWhen].join('')
  assert(!/能力等级|设计能力|能力地图|掌握能力|能力评分/.test(learnerCopy), `${prefix}前台文案仍在包装学习能力`)
}

const finalNode = nodesDocument.nodes.at(-1)
assert(finalNode?.nextKind === 'loop' && finalNode.nextNodeId === 'node-06', '节点 12 必须明确回到节点 6，开始下一轮')
assert(nodesDocument.nodes.slice(0, -1).every(node => node.nextKind !== 'loop'), '只有节点 12 可以标记循环出口')

if (errors.length) {
  for (const error of errors) console.error(`FAIL  ${error}`)
  console.error(`\n节点内容校验失败：${errors.length} 项`)
  process.exitCode = 1
} else {
  console.log('PASS  12 个主线节点连续且唯一')
  console.log('PASS  每节点一种思维、一个主工具、一个动作与一个完成结果')
  console.log('PASS  概念、资料、支线与来源关系全部可追溯')
  console.log('PASS  主线不使用能力等级或评分包装')
  console.log('PASS  节点 12 明确回到节点 6 开始下一轮')
  console.log('\n5/5 learning node checks passed.')
}
