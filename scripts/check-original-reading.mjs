import assert from 'node:assert/strict'
import { readFile, readdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const directory = path.join(root, 'content/original-articles')
const catalog = JSON.parse(await readFile(path.join(directory, 'catalog.json'), 'utf8'))
assert.equal(catalog.schemaVersion, 1)
assert.equal(catalog.publicationStatus, 'local-candidate')
assert.equal(catalog.articles.length, 69)
const ids = new Set()
for (const article of catalog.articles) {
  assert.deepEqual(Object.keys(article).sort(), ['contentVersion', 'id', 'summary', 'title'], 'Public catalog contains reader-facing article fields only')
  assert.match(article.id, /^[a-z][a-z0-9-]*$/)
  assert.ok(!ids.has(article.id), `Duplicate article: ${article.id}`)
  ids.add(article.id)
  assert.equal(article.contentVersion, article.id.startsWith('race-') ? '4.0.0' : '3.0.0')
  const files = await readdir(path.join(directory, article.id))
  assert.deepEqual(files.sort(), ['en.md', 'zh-CN.md'], 'Export only original bilingual bodies')
  for (const language of ['zh-CN', 'en']) {
    assert.ok(article.title[language] && article.summary[language])
    const body = await readFile(path.join(directory, article.id, `${language}.md`), 'utf8')
    assert.equal(body.split('\n')[0], `# ${article.title[language]}`)
    assert.ok(body.trim().split('\n').length > 5, `${article.id}/${language}: missing body`)
    assert.ok(!body.includes('/Users/'), 'No internal paths')
    assert.ok(!/\[(?:GDW|YT|UB|BB|KOB|PM|HMU|TVD|GM|GP|RWB|GG|EU|TA|DP|EXP|SYS)-[\w-]+\]/.test(body), 'Evidence IDs remain private')
    assert.ok(!/^##\s+(?:继续查阅|Reading Further|Further Reading|参考资料|Sources)\s*$/mi.test(body), 'Body ends with its own explanation')
    assert.ok(!/https?:\/\//.test(body), 'Reading does not depend on external source links')
    assert.ok(!/Game Design Workshop|Building Blocks of Tabletop|Kobold Guide|Tabletop Game Design for Video|How Games Move Us|Play Matters|The Rules We Break|Game Play: Paratextuality/.test(body), 'Book attributions remain in private research')
  }
}
const entries = await readdir(directory, { withFileTypes: true })
assert.deepEqual(entries.filter(e => e.isDirectory()).map(e => e.name).sort(), [...ids].sort(), 'No uncatalogued bodies')
assert.deepEqual(entries.filter(e => e.isFile()).map(e => e.name), ['catalog.json'], 'No research files exported')
const reader = await readFile(path.join(root, 'src/original-reading.tsx'), 'utf8')
assert.ok(!reader.includes('sourceTitles'), 'Original article navigation does not display source prompts')
assert.ok(reader.includes('allowSourceLinks = false'), 'Shared reader keeps source links disabled by default')
assert.ok(!reader.slice(reader.indexOf('export function OriginalReading')).includes('allowSourceLinks'), 'Original articles do not opt into source links')
console.log(`Original reading: ${ids.size} articles × 2 languages; complete public catalog and internal-research boundary pass.`)
