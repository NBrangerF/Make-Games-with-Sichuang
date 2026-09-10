import assert from 'node:assert/strict'
import fs from 'node:fs'
import { searchCases, caseSectionTarget } from '../src/case-discovery.ts'
import { validateCaseSections } from './lib/case-section-validation.mjs'
import { readingHref, readingReturn, readingReturnLanguage, casePerspectives } from '../src/reading-navigation.ts'
import { parseRouteHash, serializeRoute } from '../src/url-state.ts'

const base = new URL('../content/design-cases/', import.meta.url)
const entries = fs.readdirSync(base).filter(id => !id.startsWith('.')).map(id => JSON.parse(fs.readFileSync(new URL(`${id}/meta.json`, base), 'utf8')))
const bodies = Object.fromEntries(entries.map(e => [e.id, Object.fromEntries(['zh-CN', 'en'].map(lang => [lang, fs.readFileSync(new URL(`${e.id}/${lang}.md`, base), 'utf8')]))]))
for (const entry of entries) validateCaseSections(entry, bodies[entry.id])
const byId = id => entries.find(e => e.id === id)
const ids = result => result.map(r => r.entry.id).sort()
assert.equal(searchCases(entries, { query: '' }).length, 18)
assert.deepEqual(ids(searchCases(entries, { query: 'Ｒｏｏｔ 木材' })), ['root'])
assert.deepEqual(searchCases(entries, { query: 'Root 木材' })[0].sections.map(s => s.id), ['connected-wood'])
assert.deepEqual(searchCases(entries, { query: 'ROOT wood', perspective: 'space' })[0].sections.map(s => s.id), ['connected-wood'])
assert.deepEqual(ids(searchCases(entries, { query: 'Hanabi 信息', perspective: 'information' })), ['hanabi'])
assert.equal(searchCases(entries, { query: 'Root', perspective: 'information' }).length, 0, 'Topic filter cannot borrow a label from a different game')
assert.equal(searchCases(entries, { query: 'Radlands', authorOnly: true }).length, 0, 'Designer credit alone is not a development account')
assert.equal(searchCases(entries, { query: 'Root', authorOnly: true }).length, 0, 'Unsigned publisher diary is not a named designer account')
assert.equal(searchCases(entries, { query: 'none-of-these-words' }).length, 0)
assert.equal(searchCases(entries, { query: 'Root', category: 'theme' }).length, 0)
const authors = ['carcassonne','pandemic','dominion','six-nimmt','hanabi','wingspan','agricola','el-grande','ticket-to-ride','the-crew','azul','spirit-island'].sort()
assert.deepEqual(ids(searchCases(entries, { query: '', authorOnly: true })), authors)
assert.deepEqual(ids(searchCases(entries, { query: '', perspective: 'theme', authorOnly: true })), ['el-grande','hanabi','spirit-island','the-crew','wingspan'])
for (const perspective of casePerspectives) assert.ok(searchCases(entries, { query: '', perspective }).length > 0)

const list = readingHref('cases', 'all', 'zh-CN', { readingQuery: 'Root 木材', caseCategory: 'game', casePerspective: 'space', caseAuthorOnly: true })
assert.equal(serializeRoute(parseRouteHash(list)), list)
const detail = readingHref('cases', 'root', 'zh-CN', { caseSection: 'connected-wood', readingReturnTo: list })
assert.equal(serializeRoute(parseRouteHash(detail)), detail)
assert.equal(parseRouteHash(detail).caseSection, 'connected-wood')
const english = readingReturnLanguage(detail, 'en')
assert.equal(parseRouteHash(english).caseSection, 'connected-wood')
assert.equal(readingReturn(detail), readingHref('cases', 'root', 'zh-CN', { caseSection: 'connected-wood' }), 'Drop nested returns but retain section')
for (const query of ['angle=not-real', 'author=0', 'section=bad%23id', 'section='+'a'.repeat(65)]) {
 const route = parseRouteHash('#resources/cases/root/en?'+query)
 assert.ok(!route.casePerspective && !route.caseAuthorOnly && !route.caseSection)
}
const unknown = parseRouteHash('#resources/cases/root/en?section=old-section')
assert.equal(unknown.caseSection, 'old-section', 'Well-formed stale ID reaches the article recovery UI')
assert.equal(byId('root').sections.some(s => s.id === unknown.caseSection), false)
assert.equal(caseSectionTarget('connected-wood'), 'case-section-connected-wood')

const invalid = [
 e => { e.sections[0].privatePath = '/internal/source.pdf' },
 e => { e.sections[0].title.en = 'A heading not in the body' },
 e => { delete e.sections[0].title.en },
 e => { e.sections[1].id = e.sections[0].id },
 e => { e.sections[0].topics = ['not-real'] },
 e => { e.sections[0].topics = [] },
 e => { e.sections.pop() },
 e => { e.designerAccount.sourceUrl = 'https://example.org/not-a-source' },
 e => { e.designerAccount.sectionId = 'does-not-exist' },
 e => { e.designerAccount.privateEvidence = 'internal' },
]
for (const change of invalid) {
 const entry = structuredClone(byId('carcassonne')); change(entry)
 assert.throws(() => validateCaseSections(entry, bodies[entry.id]))
}
console.log(`Case discovery PASS: ${entries.length} cases, ${entries.reduce((n,e)=>n+e.sections.length,0)} bilingual section targets, 8 perspectives, 12 source-linked designer accounts, mixed-language filtering, stable section/return URLs, ${invalid.length} rejected fixtures. Authorship and topic relevance require editorial evidence.`)
