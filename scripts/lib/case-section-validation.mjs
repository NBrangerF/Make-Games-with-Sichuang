import assert from 'node:assert/strict'
import { casePerspectives } from '../../src/reading-navigation.ts'

export function validateCaseSections(meta, bodies) {
  const ids = new Set()
  const titleSets = { 'zh-CN': new Set(), en: new Set() }
  assert.ok(Array.isArray(meta.sections) && meta.sections.length >= 3, `${meta.id}: section index required`)
  assert.equal(meta.sections.filter(s => s.kind === 'angle').length, 3, `${meta.id}: index all three angles`)
  for (const section of meta.sections) {
    assert.deepEqual(Object.keys(section).sort(), ['id', 'kind', 'title', 'topics'], 'Only public section fields')
    assert.match(section.id, /^[a-z][a-z0-9-]{0,63}$/)
    assert.ok(!ids.has(section.id), 'Section IDs must be unique within a case'); ids.add(section.id)
    assert.ok(['angle', 'context', 'designer'].includes(section.kind))
    assert.ok(Array.isArray(section.topics) && section.topics.length > 0)
    assert.equal(new Set(section.topics).size, section.topics.length)
    assert.ok(section.topics.every(topic => casePerspectives.includes(topic)), 'Known design questions only')
    assert.deepEqual(Object.keys(section.title).sort(), ['en', 'zh-CN'])
    for (const lang of ['zh-CN', 'en']) {
      const title = section.title[lang]
      assert.ok(typeof title === 'string' && title.length > 5)
      assert.ok(!titleSets[lang].has(title), 'A heading is indexed only once'); titleSets[lang].add(title)
      const headings = [...bodies[lang].matchAll(/^## (.+)$/gm)].map(m => m[1])
      assert.equal(headings.filter(h => h === title).length, 1, `${meta.id}/${lang}: exact unique source heading required`)
      assert.equal(/^(角度[一二三]：|Angle (one|two|three):)/.test(title), section.kind === 'angle')
    }
  }
  if (meta.designerAccount) {
    const account = meta.designerAccount
    assert.deepEqual(Object.keys(account).sort(), ['author', 'sectionId', 'sourceUrl'])
    assert.ok(typeof account.author === 'string' && account.author.trim().length > 2)
    assert.ok(meta.sources.some(source => source.url === account.sourceUrl), 'Account must use an existing public source')
    const section = meta.sections.find(s => s.id === account.sectionId)
    assert.ok(section, 'Account must point to an indexed section')
    assert.ok(section.topics.includes('process'))
    for (const lang of ['zh-CN', 'en']) {
      const body = bodies[lang].split(`## ${section.title[lang]}\n`)[1]?.split(/^## /m)[0]
      assert.ok(body?.includes(account.sourceUrl), 'Source link must occur in the account section itself')
    }
  }
}
