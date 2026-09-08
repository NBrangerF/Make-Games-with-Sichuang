import assert from 'node:assert/strict'
import { parseRouteHash, serializeRoute } from '../src/url-state.ts'
import { readingHref, readingReturn, readingReturnLanguage } from '../src/reading-navigation.ts'

const list = '#resources/read/all/en?q=choices&scope=essays'
const chapter = readingHref('course', 'reading-choices-and-agency', 'en', { readingReturnTo: list })
const route = parseRouteHash(chapter)
assert.equal(route.readingChapter, 'reading-choices-and-agency')
assert.equal(route.readingReturnTo, list)
assert.equal(serializeRoute(route), chapter)
assert.equal(serializeRoute(parseRouteHash(list)), list)
assert.equal(readingReturnLanguage(list, 'zh-CN'), '#resources/read/all/zh-CN?q=choices&scope=essays')
assert.equal(serializeRoute(parseRouteHash('#privacy/en')), '#privacy/en')
assert.equal(parseRouteHash('#privacy/en').readingLanguage, 'en')
assert.equal(parseRouteHash('#privacy').readingLanguage, 'zh-CN')

for (const from of ['https://example.org/', 'javascript:alert(1)', '#tools/feedback', '#course/reading/a/en#bad']) {
  assert.equal(readingReturn(from), undefined, 'Reading return cannot open an external or unrelated surface')
}
const nested = readingHref('articles', 'when-options-matter', 'en', { readingReturnTo: chapter })
assert.equal(parseRouteHash(nested).readingReturnTo, '#course/reading/reading-choices-and-agency/en', 'Nested return contexts are not accumulated')
const complex = readingHref('articles', undefined, 'zh-CN', { readingQuery: '规则 & costs?', readingScope: 'course' })
assert.equal(parseRouteHash(complex).readingQuery, '规则 & costs?')
assert.equal(serializeRoute(parseRouteHash(complex)), complex)
assert.equal(parseRouteHash('#resources/read/all/en?scope=unknown').readingScope, undefined)
assert.equal(parseRouteHash('#resources/read/all/en?q=' + 'a'.repeat(1000)).readingQuery.length, 200)
const contextual = '#resources/read/all/en?q=rules&project=demo'
assert.equal(serializeRoute(parseRouteHash(contextual)), contextual, 'Reading filters and legacy work context share one query string')
assert.equal(serializeRoute(parseRouteHash('#course/practice')), '#course/practice')
console.log('Reading navigation: filtered return, bilingual location, safe return targets, bounded queries and legacy context PASS')
