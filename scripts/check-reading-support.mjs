import assert from 'node:assert/strict'
import fs from 'node:fs'
import { parseRouteHash, serializeRoute, routableToolIds } from '../src/url-state.ts'
import { readingHref, readingReturn } from '../src/reading-navigation.ts'
import { sixNimmtComparison, singleTargetDrawChance, bullheads } from '../src/case-experiments.ts'
const read = path => fs.readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
const path = JSON.parse(read('content/reading-path.json'))
const support = JSON.parse(read('content/reading-support.json'))
const examples = JSON.parse(read('content/reading-examples.json'))
assert.equal(examples.schemaVersion, 1)
assert.deepEqual(examples.chapters.map(item => item.chapterId), support.chapters.map(item => item.chapterId))
for (const example of examples.chapters) {
  for (const lang of ['zh-CN','en']) {
    assert.equal(example.values[lang].length, 3)
    assert.ok(example.values[lang].every(value => typeof value === 'string' && value.length > 20 && value.length <= 4000))
  }
}
const ids = ['carcassonne','pandemic','dominion','six-nimmt','hanabi','wingspan']
assert.deepEqual(support.chapters.map(item => item.chapterId), path.chapters.map(item => item.id))
const worksheetIds = ['observe','intent','loop','choices','resources','theme','access','test','review']
for (const item of support.chapters) {
  assert.ok(worksheetIds.includes(item.worksheetId))
  assert.ok(routableToolIds.includes(item.toolId))
  assert.ok(item.caseIds.every(id => ids.includes(id)))
  for (const lang of ['zh-CN','en']) {
    const headings = read(`content/original-articles/${item.chapterId}/${lang}.md`).match(/^## /gm) || []
    assert.ok(Number.isInteger(item.afterSection) && item.afterSection > 0 && item.afterSection < headings.length, `${item.chapterId}: contextual insertion must occur before the end`)
    assert.ok(item.title[lang] && item.reason[lang])
  }
}
const categories = []
for (const id of ids) {
  const meta = JSON.parse(read(`content/design-cases/${id}/meta.json`))
  assert.equal(meta.id,id); categories.push(meta.category)
  assert.ok(meta.chapterIds.every(chapterId => path.chapters.some(item => item.id === chapterId)))
  assert.ok(meta.sources.length >= 2)
  for (const source of meta.sources) {
    assert.ok(new URL(source.url).protocol === 'https:')
    assert.ok(source.edition && source.locator && /^\d{4}-\d{2}-\d{2}$/.test(source.checkedAt))
  }
  for (const lang of ['zh-CN','en']) {
    const body = read(`content/design-cases/${id}/${lang}.md`)
    assert.equal((body.match(/^# /gm) || []).length,1)
    assert.ok(body.length > (lang === 'en' ? 2500 : 1000))
    assert.ok(meta.sources.every(source => body.includes(source.url)))
    const href = readingHref('cases', id, lang, { readingReturnTo: readingHref('course', meta.chapterIds[0],lang) })
    assert.equal(serializeRoute(parseRouteHash(href)),href)
    assert.equal(parseRouteHash(href).resourceEntry,'cases')
  }
}
assert.deepEqual(categories.sort(),['game','game','mechanism','mechanism','theme','theme'])
const list = readingHref('cases', undefined, 'en', { readingQuery: 'hand & cards', caseCategory: 'mechanism' })
assert.equal(serializeRoute(parseRouteHash(list)),list)
assert.equal(readingReturn(list),list)
assert.equal(parseRouteHash('#resources/cases/all/en?type=unknown').caseCategory,undefined)
assert.equal(readingReturn('#resources/cases/all/en#extra'),undefined)
const high = sixNimmtComparison(46,2)
assert.deepEqual(high.rows,[[12,20],[48],[60],[80]])
assert.deepEqual(high.events[1].taken,[30,35,40,44,46]); assert.equal(high.events[1].points,14)
const low = sixNimmtComparison(10,2)
assert.deepEqual(low.rows,[[12,20,48],[10],[60],[80]])
assert.equal(low.events[0].points,13); assert.equal(low.events[1].points,0)
assert.equal(bullheads(55),7)
assert.equal(singleTargetDrawChance(11),5/11); assert.equal(singleTargetDrawChance(12),5/12)
assert.throws(()=>singleTargetDrawChance(4),RangeError)
const ui = read('src/reading-worksheet.tsx')
assert.ok(ui.includes('reading-note-v1-') && ui.includes('basedOnExample'))
assert.ok(ui.includes('chapter.chapterId === sourceId') && ui.includes('[...chapterExample]'))
assert.ok(!ui.includes('useWorkspace') && !ui.includes('useEffect'), 'Exercises do not create workspace evidence or effect-driven storage writes')
console.log('Reading support PASS: 28 contextual placements, 9 worksheet types, 6 bilingual cases, 2 constructed comparisons, bilingual filtered returns; no learning-effectiveness claim')
