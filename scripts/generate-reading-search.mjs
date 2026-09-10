import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { prepareSearchIndex } from '../src/reading-search.ts'

const root = fileURLToPath(new URL('../', import.meta.url))
const read = name => fs.readFileSync(path.join(root, name), 'utf8')
const json = name => JSON.parse(read(name))
const plain = text => text.replace(/!?\[([^\]]*)\]\([^)]+\)/g, '$1').replace(/\*\*([^*]+)\*\*|\*([^*]+)\*|`([^`]+)`/g, (_, a, b, c) => a ?? b ?? c).replace(/\s+/g, ' ').trim()
export function bodyPassages(body, language, sections = []) {
  const lines = body.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '').split(/\r?\n/)
  const passages = []; let block = []; let sectionId
  const flush = () => { const text = plain(block.join(' ')); if (text) passages.push({ language, ...(sectionId ? { sectionId } : {}), text }); block = [] }
  for (const line of lines) {
    const heading = /^(#{1,4})\s+(.+)$/.exec(line)
    if (heading) {
      flush()
      if (heading[1].length <= 2) sectionId = sections.find(s => s.title[language] === heading[2])?.id
      block.push(heading[2]); flush()
    } else if (!line.trim()) flush()
    else if (/^\|(?:\s*:?-+:?\s*\|)+$/.test(line.trim())) flush()
    else if (/^(?:[-*]\s|\d+\.\s|>\s?|\|)/.test(line)) {
      flush(); block.push(line.replace(/^(?:[-*]\s|\d+\.\s|>\s?)/, '').replace(/^\||\|$/g, '').replace(/\s*\|\s*/g, ' · ')); flush()
    } else block.push(line)
  }
  flush(); return passages
}
export function buildReadingIndexes() {
  const entries = {
    library: json('content/design-library/catalog.json').entries,
    articles: json('content/original-articles/catalog.json').articles,
    cases: json('content/design-case-ids.json').map(id => json(`content/design-cases/${id}/meta.json`)),
  }
  return Object.fromEntries(Object.entries(entries).map(([surface, items]) => {
    const directory = { library: 'design-library', cases: 'design-cases', articles: 'original-articles' }[surface]
    const documents = items.map(entry => {
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(entry.id)) throw new Error('Unsafe article ID')
      return { id: entry.id, passages: ['zh-CN', 'en'].flatMap(language => bodyPassages(read(`content/${directory}/${entry.id}/${language}.md`), language, entry.sections)) }
    })
    const result = { version: 1, surface, documents }; prepareSearchIndex(result, surface)
    return [surface, result]
  }))
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  for (const [surface, index] of Object.entries(buildReadingIndexes())) {
    const target = path.join(root, `content/reading-search/${surface}.json`)
    const text = JSON.stringify(index) + '\n'
    if (process.argv.includes('--check')) {
      if (!fs.existsSync(target) || fs.readFileSync(target, 'utf8') !== text) throw new Error(`Stale ${surface} search index; run pnpm search:index`)
    } else { fs.mkdirSync(path.dirname(target), { recursive: true }); if (!fs.existsSync(target) || fs.readFileSync(target, 'utf8') !== text) fs.writeFileSync(target, text) }
    console.log(`${surface}: ${index.documents.length} bilingual articles, ${Buffer.byteLength(text)} bytes`)
  }
}
