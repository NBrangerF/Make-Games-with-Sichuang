import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { guideResourceEntryByStage } from '../src/guide-resource-handoff.ts'
import { parseRouteHash, serializeRoute } from '../src/url-state.ts'

const [guideSource, appSource, runtimeSource, browserQaSource, guideRecords, entryPointRecord] = await Promise.all([
  readFile(new URL('../src/guide-resource-handoff.ts', import.meta.url), 'utf8'),
  readFile(new URL('../src/App.tsx', import.meta.url), 'utf8'),
  readFile(new URL('../src/resource-entry-runtime.ts', import.meta.url), 'utf8'),
  readFile(new URL('./qa-site.cjs', import.meta.url), 'utf8'),
  readFile(new URL('../content/guides.json', import.meta.url), 'utf8').then(JSON.parse),
  readFile(new URL('../content/resource-entry-points.json', import.meta.url), 'utf8').then(JSON.parse),
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

const stages = ['体验意图', '核心系统', '最小原型', '测试与反馈', '规则与信息', '呈现与发布']
const entryIds = new Set(entryPointRecord.entryPoints.map(entry => entry.id))

check('all six core stages have one explicit resource handoff', () => {
  assert.deepEqual(Object.keys(guideResourceEntryByStage), stages)
  assert.equal(Object.values(guideResourceEntryByStage).length, 6)
})

check('every handoff target exists in the curated entry catalog', () => {
  for (const [stage, entryId] of Object.entries(guideResourceEntryByStage)) assert.ok(entryIds.has(entryId), `${stage} points to missing ${entryId}`)
})

check('every core guide stage resolves to a handoff', () => {
  assert.equal(guideRecords.length, 6)
  for (const guide of guideRecords) assert.ok(guideResourceEntryByStage[guide.stage], `missing handoff for ${guide.id}`)
})

check('handoff targets round-trip through canonical URLs', () => {
  for (const entryId of Object.values(guideResourceEntryByStage)) {
    const hash = `#resources/${entryId}`
    assert.equal(serializeRoute(parseRouteHash(hash)), hash)
  }
})

check('core guides expose a real, preloadable resource link', () => {
  for (const fragment of ['继续阅读本阶段精选资源', 'className="guide-resource-entry"', 'preloadResourceEntryCatalog(resourceEntryId)', 'onOpenResourceEntry={navigateResourceEntry}']) assert.ok(appSource.includes(fragment), `missing ${fragment}`)
})

check('resource selection is URL-controlled and invalid IDs recover', () => {
  for (const fragment of ["route.resourceEntry && !['learn', 'analyze', 'problems', 'all'].includes(route.resourceEntry)", '<ResourceTopicRoute', 'requestedEntryId={route.resourceEntry!}', "onReplaceInvalidEntry={() => navigateResourceEntry('problems', true)}", 'requestedEntryId={route.resourceEntry}']) assert.ok(appSource.includes(fragment), `missing ${fragment}`)
})

check('deep links request their entry package instead of the default package first', () => {
  assert.ok(runtimeSource.includes('requestedEntryId && entryManifest.entryIds.includes(requestedEntryId)'))
  assert.ok(runtimeSource.includes('loadResourceEntryCatalog(entryId)'))
  assert.ok(runtimeSource.includes('defaultEntryId: entryManifest.defaultEntryId'))
})

check('browser regression covers guide handoff and reload persistence', () => {
  for (const fragment of ['coreGuideResourceHref', 'guideResourceHandoffHash', 'guideResourceHandoffSurvivesReload']) assert.ok(browserQaSource.includes(fragment), `missing ${fragment}`)
})

check('mapping remains a small typed boundary', () => {
  assert.ok(guideSource.includes('satisfies Record<Stage, string>'))
  assert.equal(guideSource.includes('resource-entry-points.json'), false)
})

const failed = checks.filter(result => !result.ok)
for (const result of checks) console.log(`${result.ok ? 'PASS' : 'FAIL'}  ${result.name}${result.error ? `: ${result.error}` : ''}`)
console.log(`\n${checks.length - failed.length}/${checks.length} guide-to-resource handoff checks passed.`)
if (failed.length) process.exitCode = 1
