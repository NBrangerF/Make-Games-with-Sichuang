import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { parseRouteHash, serializeRoute } from '../src/url-state.ts'

const [appSource, loaderSource, browserQaSource, frameworks, guides, glossary, resources] = await Promise.all([
  readFile(new URL('../src/App.tsx', import.meta.url), 'utf8'),
  readFile(new URL('../src/method-loader.ts', import.meta.url), 'utf8'),
  readFile(new URL('./qa-site.cjs', import.meta.url), 'utf8'),
  readFile(new URL('../content/frameworks.json', import.meta.url), 'utf8').then(JSON.parse),
  readFile(new URL('../content/special-guides.json', import.meta.url), 'utf8').then(JSON.parse),
  readFile(new URL('../content/glossary.json', import.meta.url), 'utf8').then(JSON.parse),
  readFile(new URL('../content/resources.json', import.meta.url), 'utf8').then(JSON.parse),
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

const catalogs = [
  { section: 'frameworks', records: frameworks, expected: 5 },
  { section: 'guides', records: guides, expected: 32 },
  { section: 'glossary', records: glossary, expected: 287 },
  { section: 'resource-reading', records: resources, expected: 574 },
]

check('all four method sections have authoritative item catalogs', () => {
  for (const catalog of catalogs) assert.equal(catalog.records.length, catalog.expected, `${catalog.section} count drift`)
})

check('every method item has a unique path-safe ID', () => {
  for (const catalog of catalogs) {
    const ids = catalog.records.map(record => record.id)
    assert.equal(new Set(ids).size, ids.length, `${catalog.section} duplicate ID`)
    for (const id of ids) assert.match(id, /^[a-z0-9]+(?:-[a-z0-9]+)*$/, `${catalog.section}/${id}`)
  }
})

check('every authoritative method item round-trips through its URL', () => {
  for (const catalog of catalogs) {
    for (const record of catalog.records) {
      const hash = `#method/${catalog.section}/${record.id}`
      assert.equal(serializeRoute(parseRouteHash(hash)), hash)
    }
  }
})

check('unknown method sections recover to the default method surface', () => {
  assert.equal(serializeRoute(parseRouteHash('#method/not-a-section/example')), '#method')
})

check('method section and item selection are URL-controlled', () => {
  for (const fragment of ['section={route.methodSection}', 'itemId={route.methodItem}', 'onNavigate={navigateMethod}', 'methodSection, ...(methodItem ? { methodItem } : {})']) assert.ok(appSource.includes(fragment), `missing ${fragment}`)
})

check('invalid items recover through one shared canonical selection hook', () => {
  for (const fragment of ['function useCanonicalMethodItem', 'onReplaceItem(items[0].id)', 'onNavigate(section, id, true)']) assert.ok(appSource.includes(fragment), `missing ${fragment}`)
})

check('search result selection replaces URL without adding history noise', () => {
  assert.ok(appSource.match(/selected\.id !== canonicalSelected\.id\) onReplaceItem\(selected\.id\)/))
  assert.ok(appSource.match(/selectedResource\.id !== canonicalSelected\.id\) onReplaceItem\(selectedResource\.id\)/))
})

check('method deep links preserve existing section-level lazy loading', () => {
  for (const fragment of ["import('./framework-catalog')", "import('./glossary-catalog')", "import('./special-guide-catalog')"]) assert.ok(loaderSource.includes(fragment), `missing ${fragment}`)
  assert.ok(appSource.includes("section === 'resource-reading' && <ResourceCatalogBoundary>"))
})

check('visible method controls expose current state while legacy resource reading stays hidden', () => {
  for (const section of ['frameworks', 'guides', 'glossary']) assert.ok(appSource.includes(`aria-pressed={section === '${section}'}`), `missing ${section} pressed state`)
  assert.ok(appSource.includes("section === 'resource-reading' && <ResourceCatalogBoundary>"), 'legacy resource-reading route must still render')
  assert.ok(!appSource.includes("aria-pressed={section === 'resource-reading'}"), 'legacy resource-reading must not return as a visible parallel tab')
})

check('browser regression covers framework, glossary, resource, and guide URLs', () => {
  for (const fragment of ['frameworkRouteHash', 'glossaryRouteHash', 'resourceReadingRouteHash', 'specialGuideRouteHash', 'specialGuideRouteSurvivesReload']) assert.ok(browserQaSource.includes(fragment), `missing ${fragment}`)
})

const failed = checks.filter(result => !result.ok)
for (const result of checks) console.log(`${result.ok ? 'PASS' : 'FAIL'}  ${result.name}${result.error ? `: ${result.error}` : ''}`)
console.log(`\n${checks.length - failed.length}/${checks.length} method deep-link checks passed.`)
if (failed.length) process.exitCode = 1
