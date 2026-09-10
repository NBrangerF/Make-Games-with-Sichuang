import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
import { validateLibrary } from './design-library-contract.mjs'
import { parseRouteHash, serializeRoute } from '../src/url-state.ts'
import { readingHref, readingReturn } from '../src/reading-navigation.ts'
import { readingSourceHref } from '../src/reading-links.ts'
import { libraryLearningStages, libraryLessonOrder } from '../src/library-learning-path.ts'

const root = new URL('../', import.meta.url)
const read = path => readFileSync(new URL(path, root), 'utf8')
const catalog = JSON.parse(read('content/design-library/catalog.json'))
const bodies = new Map()
for (const item of catalog.entries) for (const lang of ['zh-CN', 'en']) {
  try { bodies.set(`${item.id}/${lang}`, read(`content/design-library/${item.id}/${lang}.md`)) } catch { /* The contract reports missing bodies. */ }
}
const context = { bodies, chapterIds: new Set(JSON.parse(read('content/reading-path.json')).chapters.map(item => item.id)), caseIds: new Set(readdirSync(new URL('content/design-cases/', root)).filter(id => !id.startsWith('.'))) }
assert.deepEqual(validateLibrary(catalog, context), [])
assert.equal(libraryLessonOrder.length, 12)
assert.equal(new Set(libraryLessonOrder).size, 12)
assert.deepEqual([...libraryLessonOrder].sort(), catalog.entries.filter(entry => entry.kind === 'lesson').map(entry => entry.id).sort(), 'The optional path includes every published lesson exactly once')
assert.ok(libraryLearningStages.every(stage => stage.title.en && stage.title['zh-CN'] && stage.purpose.en && stage.purpose['zh-CN']))
for (const lang of ['zh-CN', 'en']) {
  const path = `/print-and-play/book-cart/${lang}.pdf`
  assert.equal(readingSourceHref(path, '/', true), path)
  assert.equal(readingSourceHref(path, '/preview/', true), `/preview${path}`)
  assert.equal(readingSourceHref(path, '/preview', true), `/preview${path}`)
  assert.equal(readingSourceHref(path, '/', false), null)
  assert.equal(readFileSync(new URL(`public${path}`, root)).subarray(0, 5).toString(), '%PDF-')
}
for (const href of ['javascript:alert(1)', '//example.com/file.pdf', '/Users/private/book.pdf', '/print-and-play/book-cart/../en.pdf', '/print-and-play/book-cart/%65n.pdf', '/print-and-play/book-cart/en.pdf?redirect=1', '/print-and-play/unknown/en.pdf']) {
  assert.equal(readingSourceHref(href, '/', true), null)
}
assert.equal(readingSourceHref('https://example.com/source', '/', true), 'https://example.com/source')
assert.equal(readingSourceHref('https://example.com/source', '/', false), null)
for (const body of bodies.values()) for (const match of body.matchAll(/\]\((\/print-and-play\/[^)]+)\)/g)) {
  assert.ok(readingSourceHref(match[1], '/', true), `Unsupported printable link: ${match[1]}`)
  assert.equal(readFileSync(new URL(`public${match[1]}`, root)).subarray(0, 5).toString(), '%PDF-')
}
assert.ok(catalog.entries.length > 0, 'No empty public catalog')
for (const [name, corrupt] of [
  ['missing language', c => { delete c.entries[0].title.en }],
  ['private field', c => { c.entries[0].evidence = 'not public' }],
  ['unknown relationship', c => { c.entries[0].relations = [{ targetId: 'unwritten', type: 'see-also' }] }],
  ['duplicate identity', c => { c.entries.push(c.entries[0]) }],
  ['invalid BGG identity', c => { c.entries[0].bggReferences[0].id = 1 }],
  ['private path', c => { c.entries[0].summary.en = '/Users/private/research' }],
  ['unknown chapter', c => { c.entries[0].chapterIds = ['unwritten'] }],
  ['unknown case', c => { c.entries[0].caseIds = ['unwritten'] }],
]) {
  const copy = structuredClone(catalog); corrupt(copy)
  assert.ok(validateLibrary(copy, context).length > 0, `Reject ${name}`)
}
const missingBody = new Map(bodies); missingBody.delete(`${catalog.entries[0].id}/en`)
assert.ok(validateLibrary(catalog, { ...context, bodies: missingBody }).some(error => error.includes('/en')))

const list = readingHref('library', undefined, 'en', { readingQuery: '工放 worker', libraryKind: 'mechanisms', libraryQuestion: 'actions' })
assert.equal(serializeRoute(parseRouteHash(list)), list)
const detail = readingHref('library', 'worker-placement', 'en', { readingReturnTo: list })
assert.equal(parseRouteHash(detail).readingReturnTo, list)
assert.equal(serializeRoute(parseRouteHash(detail)), detail)
assert.equal(readingReturn('#resources/library/all/en?kind=bad&group=bad'), '#resources/library/all/en')
assert.equal(readingReturn('#resources/library/all/en?from=https://example.org'), '#resources/library/all/en')
assert.equal(serializeRoute(parseRouteHash('#resources/library/unknown/en')), '#resources/library/unknown/en')
assert.equal(parseRouteHash('#resources/library/all').readingLanguage, 'zh-CN')
assert.equal(readingReturn(readingHref('course', 'reading-time-and-interaction', 'en', { readingReturnTo: detail })), '#course/reading/reading-time-and-interaction/en')
console.log(`Design library PASS: ${catalog.entries.length} bilingual entries; public allowlist, 9 rejection cases, IDs, sources, and filtered return routes. Editorial quality and rendered behavior require separate review.`)
