import fs from 'node:fs/promises'
import path from 'node:path'
import { createHash } from 'node:crypto'
import writeGood from 'write-good'

// Advisory only: rules, quotations, and mathematical qualifications need editorial judgment.
// Custom language checks use write-good's documented checks extension API.
const args = process.argv.slice(2)
const options = {}
for (let i = 0; i < args.length; i += 2) {
  if (!['--root', '--output'].includes(args[i]) || !args[i + 1]) throw new Error('Usage: node scripts/audit-editorial-flow.mjs [--root DIR] [--output FILE]')
  options[args[i]] = args[i + 1]
}
const root = path.resolve(options['--root'] || '.')
const matchCheck = (pattern, explanation) => ({
  explanation,
  fn: text => [...text.matchAll(pattern)].map(match => ({ index: match.index, offset: match[0].length })),
})
const zhChecks = {
  stockTransition: matchCheck(/(?:值得注意的是|综上所述|总而言之|不难发现|毋庸置疑|通过以上分析|这并不意味着)/gu, '可检查是否删去过渡词，直接承接上段'),
  abstractProcedure: matchCheck(/(?:可执行性|可理解性|形成闭环|赋能|进行深入分析|这一维度|证据边界|状态变化链)/gu, '可检查是否用具体动作或例子解释'),
  automaticPreview: matchCheck(/(?:下一章(?:将|会)|接下来我们将)/gu, '可检查是否已有导航，正文是否需要这句预告'),
}
const enChecks = {
  stockTransition: matchCheck(/\b(?:it is worth noting|in conclusion|in summary|delve into|a rich tapestry|unlock the potential|the next chapter will|next we will)\b/giu, 'review this stock transition in context'),
  abstractProcedure: matchCheck(/\b(?:constructed (?:position|fragment)|bounded (?:question|claim|next step)|executable|provisional observations|establish universal|certif(?:y|ies) success)\b/giu, 'consider a concrete action or a direct explanation'),
}
async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  const groups = await Promise.all(entries.map(entry => entry.isDirectory() ? walk(path.join(dir, entry.name)) : /^(?:en|zh-CN)\.md$/.test(entry.name) ? [path.join(dir, entry.name)] : []))
  return groups.flat().sort()
}
// Preserve offsets and line numbers while ignoring code and Markdown link destinations.
function proseOnly(source) {
  return source.replace(/```[\s\S]*?```|`[^`\n]*`|\]\([^\n)]*\)/g, value => value.replace(/[^\n]/g, ' '))
}
const files = (await Promise.all(['original-articles', 'design-cases', 'design-library'].map(folder => walk(path.join(root, 'content', folder))))).flat().sort()
const reports = []
for (const file of files) {
  const source = await fs.readFile(file, 'utf8')
  const prose = proseOnly(source)
  const language = path.basename(file, '.md')
  const suggestions = [
    ...writeGood(prose, { checks: language === 'en' ? enChecks : zhChecks }),
    ...(language === 'en' ? writeGood(prose, { passive: false, weasel: false, adverb: false, so: false, thereIs: false, eprime: false }) : []),
  ]
  reports.push({
    file: path.relative(root, file), language,
    sha256: createHash('sha256').update(source).digest('hex'),
    paragraphs: source.trim().split(/\n\s*\n/).length,
    headings: (source.match(/^## /gm) || []).length,
    suggestions: suggestions.map(item => ({ line: source.slice(0, item.index).split('\n').length, text: source.slice(item.index, item.index + item.offset), reason: item.reason })),
  })
}
const report = {
  tool: 'write-good 1.0.8 with Luozhuo bilingual editorial checks',
  purpose: 'A review queue, not an AI detector, quality score, or automatic rewrite. Preserve necessary rule limits and evidence qualifications.',
  scope: 'Published article bodies: both course paths, optional essays, design cases, and library entries. UI and metadata are reviewed separately.',
  totals: { files: reports.length, suggestions: reports.reduce((sum, item) => sum + item.suggestions.length, 0) },
  files: reports,
}
if (options['--output']) {
  const output = path.resolve(options['--output'])
  await fs.mkdir(path.dirname(output), { recursive: true })
  await fs.writeFile(output, JSON.stringify(report, null, 2) + '\n')
}
console.log(JSON.stringify({ ...report.totals, advisory: true, output: options['--output'] || null }))
if (!options['--output']) console.log('Use --output FILE to save the per-file review queue. No text was changed.')
