import assert from 'node:assert/strict'
import fs from 'node:fs'
import { bodyPassages, buildReadingIndexes } from './generate-reading-search.mjs'
import { prepareSearchIndex, matchesSearch, searchSnippets, searchTerms } from '../src/reading-search.ts'
import { searchCases } from '../src/case-discovery.ts'

const data = buildReadingIndexes()
const indexes = Object.fromEntries(Object.entries(data).map(([s, d]) => [s, prepareSearchIndex(d, s)]))
const read = file => JSON.parse(fs.readFileSync(new URL('../'+file, import.meta.url), 'utf8'))
const cases = read('content/design-case-ids.json').map(id => read(`content/design-cases/${id}/meta.json`))
assert.deepEqual(Object.fromEntries(Object.entries(data).map(([s,d])=>[s,d.documents.length])), { library:96, articles:41, cases:18 })
assert.equal(Object.values(data).reduce((n,d)=>n+d.documents.length*2,0),310)
for (const [surface,id,query] of [['library','worker-placement','later retrieval'],['library','cooperative-structure','必须一次全额支付'],['library','public-private-scoring','unexamined'],['articles','reading-rules-and-play','spare planks'],['articles','reading-rules-and-play','十六块'],['articles','reading-rules-and-play','十六块 stepping stone']]) {
  const document = indexes[surface].get(id)
  assert.ok(matchesSearch('',query,document), `${surface}/${id}: ${query}`)
  assert.ok(searchSnippets(document,query,'zh-CN').length)
}
assert.equal(matchesSearch('', 'later retrieval 锯木厂', indexes.library.get('worker-placement')), false, 'Terms must belong to one article')
assert.deepEqual(searchTerms('Ｒｏｏｔ ROOT　木材'), ['root','木材'])
assert.deepEqual(searchCases(cases,{query:'Root 锯木厂'},indexes.cases).map(r=>r.entry.id), ['root'])
assert.deepEqual(searchCases(cases,{query:'Root 锯木厂'},indexes.cases)[0].sections.map(s=>s.id), ['connected-wood'])
assert.equal(searchCases(cases,{query:'Root 锯木厂',perspective:'actions'},indexes.cases).length,0, 'Do not borrow body text from another perspective')
assert.equal(searchCases(cases,{query:'Root 锯木厂',authorOnly:true},indexes.cases).length,0)
const intro = searchCases(cases,{query:'all-seeing tables'},indexes.cases)
assert.deepEqual(intro.map(r=>r.entry.id),['the-crew'])
assert.deepEqual(intro[0].sections,[], 'Introduction has no invented angle target')
assert.equal(searchCases(cases,{query:'all-seeing tables',perspective:'information'},indexes.cases).length,0)
assert.deepEqual(searchSnippets(indexes.cases.get('the-crew'),'all-seeing tables','zh-CN').map(p=>p.language),['en'])
assert.ok(!searchSnippets(indexes.cases.get('the-crew'),'all-seeing tables','zh-CN')[0].sectionId)
const mixed = searchSnippets(indexes.library.get('worker-placement'),'later retrieval 工人','zh-CN')
assert.deepEqual(new Set(mixed.map(p=>p.language)),new Set(['zh-CN','en']))
for (const [surface,index] of Object.entries(indexes)) for (const document of index.values()) {
  assert.ok(!/\/Users\/|落桌内部研究|extracted\/|sourceSha256/.test(JSON.stringify(document)), 'Only public text, no private trace fields')
  for (const p of document.passages) if (p.sectionId) {
    const entry = cases.find(e=>e.id===document.id)
    assert.equal(surface,'cases');assert.ok(entry.sections.some(s=>s.id===p.sectionId))
  }
}
const parsed = bodyPassages('---\nprivate: excluded\n---\n# Title\n\nAn **actual** [label](https://never-index-this-url.invalid) and `value`.\n\n## Named\nText.\n\n## Sources\nOther text.', 'en', [{id:'named',title:{en:'Named'}}])
assert.deepEqual(parsed.map(p=>p.text),['Title','An actual label and value.','Named','Text.','Sources','Other text.'])
assert.equal(parsed[3].sectionId,'named');assert.equal(parsed[5].sectionId,undefined)
for (const mutate of [d=>d.version=2,d=>d.surface='cases',d=>d.documents.push(d.documents[0]),d=>d.documents[0].passages=d.documents[0].passages.filter(p=>p.language!=='en'),d=>d.documents[0].passages[0].text=null,d=>d.documents[0].id='../private']) {
  const invalid=structuredClone(data.library);mutate(invalid);assert.throws(()=>prepareSearchIndex(invalid,'library'))
}
// Literal punctuation is data; no regex syntax or HTML execution is needed to match.
const fixture=prepareSearchIndex({version:1,surface:'articles',documents:[{id:'literal',passages:[{language:'en',text:'A [x] <script> & (a+b)? literal.'},{language:'zh-CN',text:'原样字符。'}]}]},'articles').get('literal')
assert.ok(matchesSearch('', '[x] (a+b)?',fixture));assert.equal(matchesSearch('', '.*',fixture),false)
console.log('Full-text search PASS:310 language bodies; original body-only and bilingual queries; perspective isolation, introduction fallback, real section IDs, exact excerpts, literal punctuation, malformed index rejection.')
