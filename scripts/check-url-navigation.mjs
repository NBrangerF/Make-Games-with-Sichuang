import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { DEFAULT_ROUTE, parseRouteHash, routableToolIds, routeTitle, serializeRoute } from '../src/url-state.ts'
import { PRODUCT_BRAND, PRODUCT_FULL_NAME } from '../src/brand.ts'

const [appSource, styleSource, qaSource] = await Promise.all([
  readFile(new URL('../src/App.tsx', import.meta.url), 'utf8'),
  readFile(new URL('../src/styles.css', import.meta.url), 'utf8'),
  readFile(new URL('./qa-site.cjs', import.meta.url), 'utf8'),
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

check('empty and unknown hashes fall back safely', () => {
  assert.deepEqual(parseRouteHash(''), DEFAULT_ROUTE)
  assert.deepEqual(parseRouteHash('#unknown'), DEFAULT_ROUTE)
  assert.deepEqual(parseRouteHash('#%E0%A4%A'), DEFAULT_ROUTE)
})

check('all primary views have canonical hashes', () => {
  assert.equal(serializeRoute(parseRouteHash('#learn')), '#learn')
  assert.equal(serializeRoute(parseRouteHash('#learn/node-07')), '#learn/node-07')
  assert.equal(serializeRoute(parseRouteHash('#learn/not-a-node')), '#learn')
  assert.equal(serializeRoute(parseRouteHash('#path')), '#path')
  assert.equal(serializeRoute(parseRouteHash('#/resources')), '#resources')
  assert.equal(serializeRoute(parseRouteHash('#method')), '#method')
  assert.equal(serializeRoute(parseRouteHash('#tools')), '#tools/redesign')
  assert.equal(serializeRoute(parseRouteHash('#privacy')), '#privacy')
  assert.equal(serializeRoute(parseRouteHash('#course')), '#course')
  assert.equal(serializeRoute(parseRouteHash('#workbench')), '#workbench')
  assert.equal(serializeRoute(parseRouteHash('#projects')), '#projects')
})

check('resource entries round-trip through shareable hashes', () => {
  const route = parseRouteHash('#resources/core-loop-handoff')
  assert.deepEqual(route, { view: 'resources', tool: 'redesign', resourceEntry: 'core-loop-handoff' })
  assert.equal(serializeRoute(route), '#resources/core-loop-handoff')
  assert.equal(serializeRoute(parseRouteHash('#resources/rules%20and%20teaching')), '#resources/rules%20and%20teaching')
})

check('method sections and selected items round-trip through shareable hashes', () => {
  assert.equal(serializeRoute(parseRouteHash('#method/frameworks')), '#method/frameworks')
  assert.deepEqual(parseRouteHash('#method/guides/special-blind-rules-test'), { view: 'method', tool: 'redesign', methodSection: 'guides', methodItem: 'special-blind-rules-test' })
  assert.equal(serializeRoute(parseRouteHash('#method/glossary/core-loop')), '#method/glossary/core-loop')
  assert.equal(serializeRoute(parseRouteHash('#method/resource-reading/mda-framework')), '#method/resource-reading/mda-framework')
  assert.equal(serializeRoute(parseRouteHash('#method/not-a-section')), '#method')
})

check('all formal tools round-trip through a shareable URL', () => {
  assert.equal(routableToolIds.length, 19)
  for (const tool of routableToolIds) {
    const route = parseRouteHash(`#tools/${tool}`)
    assert.deepEqual(route, { view: 'tools', tool })
    assert.equal(serializeRoute(route), `#tools/${tool}`)
    assert.ok(routeTitle(route).endsWith(PRODUCT_BRAND))
  }
})

check('unknown tool remains in toolbox without opening a false surface', () => {
  assert.deepEqual(parseRouteHash('#tools/not-a-tool'), { view: 'tools', tool: 'redesign' })
  assert.equal(serializeRoute(parseRouteHash('#tools/not-a-tool')), '#tools/redesign')
})

check('titles identify the current shareable surface', () => {
  assert.equal(routeTitle(parseRouteHash('#learn')), '系统阅读 · 落桌')
  assert.equal(routeTitle(parseRouteHash('#learn/node-03')), '学习节点 03 · 落桌')
  assert.equal(routeTitle(parseRouteHash('#path')), '设计路径 · 落桌')
  assert.equal(routeTitle(parseRouteHash('#resources')), PRODUCT_FULL_NAME)
  assert.equal(routeTitle(parseRouteHash('#resources/learn/systematic-unit-00-question-first')), '单元 0：从一个具体问题开始 · 落桌')
  assert.equal(routeTitle(parseRouteHash('#method')), '方法与概念 · 落桌')
  assert.equal(routeTitle(parseRouteHash('#method/guides/special-blind-rules-test')), '专题指南 · 落桌')
  assert.equal(routeTitle(parseRouteHash('#tools/core-loop')), '核心循环画布 · 落桌')
  assert.equal(routeTitle(parseRouteHash('#privacy')), '数据与隐私 · 落桌')
})

check('application synchronizes URL, history, title, and primary navigation', () => {
  for (const fragment of ['parseRouteHash(window.location.hash)', "window.addEventListener('hashchange'", "window.addEventListener('popstate'", "replace ? 'replaceState' : 'pushState'", 'window.history.replaceState', 'document.title = routeTitle(route)', 'aria-current=', 'href={serializeRoute(link.target)}']) assert.ok(appSource.includes(fragment), `missing ${fragment}`)
})

check('visible navigation leads with learning while preserving legacy routes', () => {
  const headerLinks = appSource.match(/const twoTaskLinks:[^=]*= \[([\s\S]*?)\n  \]/)?.[1] ?? ''
  assert.equal((headerLinks.match(/id:/g) ?? []).length, 4)
  assert.ok(headerLinks.includes("id: 'course', label: english ? 'Learn design' : '系统学习'"))
  assert.ok(headerLinks.includes("id: 'workbench', label: english ? 'Workbench (Chinese)' : '设计工作台'"))
  assert.ok(headerLinks.includes("id: 'library', label: english ? 'Mechanisms & themes' : '机制与主题'"))
  assert.ok(headerLinks.includes("id: 'cases', label: english ? 'Case studies' : '案例研究'"))
  assert.equal(headerLinks.includes("id: 'path'"), false)
  assert.equal(headerLinks.includes("id: 'tools'"), false)
  assert.ok(appSource.includes("route.view === 'learn'"))
  assert.ok(appSource.includes("route.view === 'path'"))
  assert.ok(appSource.includes("route.view === 'tools'"))
  assert.ok(appSource.includes('LearningNodesRoute') && appSource.includes('ResourceTopicRoute'))
})

check('keyboard users can bypass navigation to one active main landmark', () => {
  assert.ok(appSource.includes('className="skip-link" href={serializeRoute(route)}'))
  assert.ok(appSource.includes("event.preventDefault(); document.getElementById('main-content')?.focus()"))
  assert.ok(appSource.match(/id="main-content"/g)?.length >= 5)
  assert.ok(styleSource.includes('.skip-link:focus'))
})

check('browser regression derives growing catalog counts from authoritative JSON', () => {
  assert.ok(qaSource.includes("require('../content/resources.json')"))
  assert.ok(qaSource.includes("require('../content/resource-entry-points.json')"))
  assert.ok(qaSource.includes('resourceCount === expectedResourceCount'))
  assert.ok(qaSource.includes('resourceEntryPointCount === expectedResourceEntryPointCount'))
  for (const stale of ['查看全部 549 条', 'resourceCount === 556', 'resourceEntryPointCount === 31']) assert.equal(qaSource.includes(stale), false, `stale QA literal: ${stale}`)
})

const failed = checks.filter(result => !result.ok)
for (const result of checks) console.log(`${result.ok ? 'PASS' : 'FAIL'}  ${result.name}${result.error ? `: ${result.error}` : ''}`)
console.log(`\n${checks.length - failed.length}/${checks.length} URL navigation checks passed.`)
if (failed.length) process.exitCode = 1
