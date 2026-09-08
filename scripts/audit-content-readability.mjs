import { createHash } from 'node:crypto'
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'

const contentRoot = new URL('../content/', import.meta.url)
const reportUrl = new URL('../docs/revision/CONTENT_READABILITY_AUDIT.md', import.meta.url)
const shouldWrite = process.argv.includes('--write')
const shouldCheck = process.argv.includes('--check')

const walk = directory => readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
  const url = new URL(entry.name + (entry.isDirectory() ? '/' : ''), directory)
  return entry.isDirectory() ? walk(url) : [url]
})
const files = walk(contentRoot).filter(url => /\.(json|md)$/.test(url.pathname)).sort((a, b) => a.pathname.localeCompare(b.pathname))
const relative = url => decodeURIComponent(url.pathname.slice(contentRoot.pathname.length))
const hanCount = text => (text.match(/[\u3400-\u9fff]/g) ?? []).length
const jargon = ['证据边界', '参与者语境', '运行证据', '迁移假设', '验证配置', '行动窗口', '信息结构', '治理时间线', '作用路径', '设计命题']

function policyFor(path) {
  if (path.startsWith('original-articles/')) return '原创双语阅读：直接打开，不以项目或练习提交为前提'
  if (path.startsWith('translations/')) return '授权或来源正文：保留，不做自动改写'
  if (path === 'learning-nodes.json') return '主线权威文案：已按短句规则修订'
  if (['resource-entry-points.json', 'resource-learning-paths.json', 'resource-audience-paths.json', 'guides.json', 'special-guides.json'].includes(path)) return '入口与支线：前台按需出现'
  if (path.startsWith('learning-units/')) return '完整课程：保留为深入阅读'
  if (path.startsWith('guides/')) return '案例正文：保留为按需案例'
  if (/metadata|audit|index|assessment|claims/.test(path)) return '内部元数据：不作为新手首屏文案'
  return '支持资料：通过节点或资料库按需进入'
}

function jsonStrings(value, path = '$', output = []) {
  if (typeof value === 'string') {
    if (hanCount(value) >= 4) output.push({ location: path, text: value })
  } else if (Array.isArray(value)) {
    value.forEach((item, index) => jsonStrings(item, `${path}[${index}]`, output))
  } else if (value && typeof value === 'object') {
    Object.entries(value).forEach(([key, item]) => jsonStrings(item, `${path}.${key}`, output))
  }
  return output
}

function markdownStrings(source) {
  const paragraphs = []
  let buffer = []
  let line = 0
  const flush = () => {
    const text = buffer.map(item => item.text).join(' ').replace(/^#{1,6}\s+/, '').trim()
    if (hanCount(text) >= 4) paragraphs.push({ location: `line ${buffer[0]?.line ?? 1}`, text })
    buffer = []
  }
  for (const raw of source.split(/\r?\n/)) {
    line += 1
    const text = raw.trim()
    if (!text || /^```/.test(text) || /^\|?\s*:?-{3,}/.test(text)) { flush(); continue }
    const standalone = /^#{1,6}\s+/.test(text) || /^[-*+]\s+/.test(text) || /^\d+\.\s+/.test(text)
    if (standalone) flush()
    buffer.push({ line, text: text.replace(/^[-*+]\s+/, '').replace(/^\d+\.\s+/, '') })
    if (standalone) flush()
  }
  flush()
  return paragraphs
}

function friction(item) {
  const sentences = item.text.split(/[。！？；\n]/).filter(Boolean)
  const longest = Math.max(0, ...sentences.map(hanCount))
  const enumeration = (item.text.match(/[、，]/g) ?? []).length
  const usedJargon = jargon.filter(term => item.text.includes(term))
  const reasons = []
  if (longest > 72) reasons.push(`单句 ${longest} 个汉字`)
  if (hanCount(item.text) > 170) reasons.push(`单段 ${hanCount(item.text)} 个汉字`)
  if (enumeration >= 8) reasons.push(`并列项较多（${enumeration}）`)
  if (usedJargon.length >= 2) reasons.push(`抽象词集中（${usedJargon.join('、')}）`)
  return { reasons, score: Math.max(0, longest - 72) + Math.max(0, hanCount(item.text) - 170) / 2 + enumeration + usedJargon.length * 8 }
}

const hash = createHash('sha256')
const records = files.map(url => {
  const path = relative(url)
  const source = readFileSync(url, 'utf8')
  hash.update(path).update('\0').update(source).update('\0')
  let items
  try { items = path.endsWith('.json') ? jsonStrings(JSON.parse(source)) : markdownStrings(source) }
  catch (error) { throw new Error(`${path} 无法进入文本审计：${error.message}`) }
  const flagged = items.map(item => ({ ...item, ...friction(item) })).filter(item => item.reasons.length > 0)
  return { path, items, flagged, han: items.reduce((sum, item) => sum + hanCount(item.text), 0), policy: policyFor(path) }
})

const fingerprint = hash.digest('hex')
const totalItems = records.reduce((sum, record) => sum + record.items.length, 0)
const totalHan = records.reduce((sum, record) => sum + record.han, 0)
const totalFlagged = records.reduce((sum, record) => sum + record.flagged.length, 0)
const priority = records.flatMap(record => record.flagged.map(item => ({ ...item, path: record.path }))).sort((a, b) => b.score - a.score).slice(0, 60)
const escapeCell = value => String(value).replaceAll('|', '｜').replaceAll('\n', ' ')
const excerpt = text => escapeCell(text.replace(/\s+/g, ' ').slice(0, 120) + (text.length > 120 ? '…' : ''))

const report = `<!-- content-fingerprint: ${fingerprint} -->
# 全站资料文本可读性审计

审计日期：${new Date().toISOString().slice(0, 10)}  
范围：\`content/\` 下全部 ${files.length} 个 JSON 与 Markdown 文件，不抽样。  
覆盖：${totalItems.toLocaleString('zh-CN')} 个含中文的字段或段落，约 ${totalHan.toLocaleString('zh-CN')} 个汉字。

## 结论

- 本报告审计文字长度与抽象词信号，不据此判断网站首页或学习路径是否有效。
- 机器规则标出了 ${totalFlagged.toLocaleString('zh-CN')} 个可能需要分段或渐进披露的长句、长段与抽象词密集处。这是编辑优先级，不是内容质量评分。
- 授权译文和来源正文保留原有使用范围；原创双语文章提供独立阅读入口，课程、案例与工具维持各自路径。
- 汉字阈值只评估含中文的字段或段落。英文正文参与文件指纹与解析检查，但不能因此声称其可读性已被这些阈值验证。

## 当前内容组织

1. 原创双语文章位于 \`content/original-articles/\`；一个文章身份对应中文和英文，来源摘录与研究证据留在网站外的内部研究目录。
2. 十二个观察与迭代节点保留独立长度、断链与禁用“能力等级”的校验，不将这份机器审计当作学习效果证据。
3. 系统课程、设计工作台、案例、专题与资料目录分别提供已有入口；本文不把它们描述为同一条强制阅读流程。
4. 原创文章的双语对应、出处和独立例子需要单独编辑复核，不能由下方长句统计替代。
5. 新增阅读内容不改变已有项目记录或来源的使用权限。

## 全量文件台账

| 文件 | 中文字段/段落 | 汉字数 | 高摩擦候选 | 前台处理 |
| --- | ---: | ---: | ---: | --- |
${records.map(record => `| \`${record.path}\` | ${record.items.length} | ${record.han} | ${record.flagged.length} | ${record.policy} |`).join('\n')}

## 优先复核片段

以下最多列出 60 个机器信号最强的片段。它们不会自动进入新手主线；编辑时需保留原意、证据和许可边界。

| 文件与位置 | 信号 | 片段 |
| --- | --- | --- |
${priority.map(item => `| \`${item.path}\` ${escapeCell(item.location)} | ${escapeCell(item.reasons.join('；'))} | ${excerpt(item.text)} |`).join('\n')}

## 持续规则

- 内容文件增删或文字改变后，运行 \`pnpm copy:audit\` 更新本报告。
- \`pnpm qa:copy-readability\` 检查报告是否覆盖当前全部内容文件。
- 长句信号不直接阻止支持材料发布；主线节点使用更严格的独立发布门。
- 真人是否看得懂仍需参与者验证，机器审计不得替代真实阅读与操作观察。
`

if (shouldWrite) writeFileSync(reportUrl, report)

if (shouldCheck) {
  if (!existsSync(reportUrl)) throw new Error('缺少 docs/revision/CONTENT_READABILITY_AUDIT.md；请运行 pnpm copy:audit')
  const current = readFileSync(reportUrl, 'utf8')
  if (!current.includes(`<!-- content-fingerprint: ${fingerprint} -->`)) throw new Error('文本审计报告与当前 content/ 不一致；请运行 pnpm copy:audit')
  if (files.length < 80) throw new Error(`审计范围异常：只发现 ${files.length} 个内容文件`)
  const nodeRecord = records.find(record => record.path === 'learning-nodes.json')
  if (!nodeRecord || nodeRecord.items.length < 100) throw new Error('十二节点权威文本未完整进入审计')
}

console.log(`PASS  全量扫描 ${files.length} 个内容文件、${totalItems} 个中文字段或段落`)
console.log(`PASS  记录 ${totalFlagged} 个渐进披露候选，不自动改写授权正文`)
console.log(`PASS  内容指纹 ${fingerprint.slice(0, 12)}`)
if (shouldWrite) console.log('PASS  已更新 docs/revision/CONTENT_READABILITY_AUDIT.md')
if (shouldCheck) console.log('PASS  文本审计报告与当前内容一致')
