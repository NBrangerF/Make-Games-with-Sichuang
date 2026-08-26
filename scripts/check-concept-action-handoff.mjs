import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { routableToolIds, serializeRoute } from '../src/url-state.ts'

const [appSource, browserQaSource, catalogSource, generatorSource, glossary, coreGuides, specialGuides, actionIndex] = await Promise.all([
  readFile(new URL('../src/App.tsx', import.meta.url), 'utf8'),
  readFile(new URL('./qa-site.cjs', import.meta.url), 'utf8'),
  readFile(new URL('../src/glossary-catalog.ts', import.meta.url), 'utf8'),
  readFile(new URL('./generate-concept-action-index.mjs', import.meta.url), 'utf8'),
  readFile(new URL('../content/glossary.json', import.meta.url), 'utf8').then(JSON.parse),
  readFile(new URL('../content/guides.json', import.meta.url), 'utf8').then(JSON.parse),
  readFile(new URL('../content/special-guides.json', import.meta.url), 'utf8').then(JSON.parse),
  readFile(new URL('../content/concept-action-index.json', import.meta.url), 'utf8').then(JSON.parse),
])

const checks = []
function check(name, action) {
  try {
    action()
    checks.push({ name, ok: true })
  } catch (error) {
    checks.push({ name, ok: false, error: error.message })
  }
}

const glossaryIds = new Set(glossary.map(term => term.id))
const coreGuideById = new Map(coreGuides.map(guide => [guide.id, guide]))
const specialGuideById = new Map(specialGuides.map(guide => [guide.id, guide]))
const routableTools = new Set(routableToolIds)
const actionByConcept = new Map(actionIndex.entries.map(entry => [entry.conceptId, entry]))
const firstShareableTool = guide => guide?.toolIds.find(toolId => toolId !== 'test-plan')

check('authoritative concept and guide catalogs keep expected scope', () => {
  assert.equal(glossary.length, 287)
  assert.equal(coreGuides.length, 6)
  assert.equal(specialGuides.length, 32)
})

check('action index has exactly one row for every concept', () => {
  assert.equal(actionIndex.entries.length, glossary.length)
  assert.equal(actionByConcept.size, glossary.length)
  for (const conceptId of glossaryIds) assert.ok(actionByConcept.has(conceptId), `missing ${conceptId}`)
})

check('all special-guide concept references resolve', () => {
  for (const guide of specialGuides) for (const conceptId of guide.conceptIds) assert.ok(glossaryIds.has(conceptId), `${guide.id} -> ${conceptId}`)
})

check('reverse special-guide links are complete and not invented', () => {
  for (const term of glossary) {
    const expected = specialGuides.filter(guide => guide.conceptIds.includes(term.id)).map(guide => guide.id)
    assert.deepEqual(actionByConcept.get(term.id).specialGuideIds, expected, term.id)
  }
})

check('tool handoffs are derived from explicit guide relationships', () => {
  for (const term of glossary) {
    const entry = actionByConcept.get(term.id)
    const coreTools = term.guideIds.map(id => firstShareableTool(coreGuideById.get(id)))
    const specialTools = entry.specialGuideIds.map(id => firstShareableTool(specialGuideById.get(id)))
    const expected = [...new Set([...coreTools, ...specialTools].filter(Boolean))]
    assert.deepEqual(entry.toolIds, expected, term.id)
  }
})

check('every concept reaches at least one shareable formal tool', () => {
  for (const entry of actionIndex.entries) {
    assert.ok(entry.toolIds.length > 0, entry.conceptId)
    for (const toolId of entry.toolIds) {
      assert.notEqual(toolId, 'test-plan')
      assert.ok(routableTools.has(toolId), `${entry.conceptId} -> ${toolId}`)
      assert.equal(serializeRoute({ view: 'tools', tool: toolId }), `#tools/${toolId}`)
    }
  }
})

check('special-guide reference catalog is exact and shareable', () => {
  assert.deepEqual(actionIndex.specialGuides, specialGuides.map(({ id, title, stage }) => ({ id, title, stage })))
  for (const guide of actionIndex.specialGuides) assert.equal(serializeRoute({ view: 'method', tool: 'redesign', methodSection: 'guides', methodItem: guide.id }), `#method/guides/${guide.id}`)
})

check('index states the derivation and non-ranking boundary', () => {
  for (const phrase of ['显式维护', '不是自动推荐', '质量排名', '不是', '固定顺序']) assert.ok(actionIndex.principle.includes(phrase), phrase)
  assert.ok(generatorSource.includes("toolId !== 'test-plan'"))
  assert.ok(generatorSource.includes('specialGuidesByConcept'))
})

check('concept actions stay inside the glossary lazy chunk', () => {
  assert.ok(catalogSource.includes("import conceptActionIndexRecord from '../content/concept-action-index.json'"))
  assert.ok(catalogSource.includes('export const conceptActionIndex'))
  assert.ok(!appSource.includes("from '../content/concept-action-index.json'"))
})

check('concept details expose real guide and tool links', () => {
  for (const fragment of ['className="concept-action-link concept-action-guide"', 'className="concept-action-link concept-action-tool"', "onOpenGuide={id => onNavigate('guides', id)}", 'href={serializeRoute({ view: \'tools\', tool: toolId })}']) assert.ok(appSource.includes(fragment), fragment)
})

check('core and special guides link back to glossary deep links', () => {
  assert.ok(appSource.includes("methodSection: 'glossary', methodItem: term.id"))
  assert.ok(appSource.includes("onOpenConcept={id => onNavigate('glossary', id)}"))
  assert.ok(appSource.includes("onOpenConcept={id => navigateMethod('glossary', id)}"))
})

check('browser regression covers both directions and tool handoff', () => {
  for (const fragment of ['conceptGuideHandoffHash', 'conceptToolHandoffHash', 'guideConceptHandoffHash', 'conceptHandoffBackHash']) assert.ok(browserQaSource.includes(fragment), fragment)
})

const failed = checks.filter(result => !result.ok)
for (const result of checks) console.log(`${result.ok ? 'PASS' : 'FAIL'}  ${result.name}${result.error ? `: ${result.error}` : ''}`)
console.log(`\n${checks.length - failed.length}/${checks.length} concept action handoff checks passed.`)
if (failed.length) process.exitCode = 1
