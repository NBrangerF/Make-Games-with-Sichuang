import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

import { createEmptyWorkspace } from '../src/domain/schema-v3.ts'
import { contextReturnRoute, resolveWorkContext } from '../src/navigation/work-context.ts'
import { parseRouteHash, serializeRoute, validateWorkContext } from '../src/url-state.ts'

const NOW = '2026-08-27T00:00:00.000Z'

function fixtureWorkspace() {
  const workspace = createEmptyWorkspace('context-fixture', NOW)
  workspace.collections.projects.push(
    { id: 'project-a', title: '项目 A', profile: {}, activeVersionId: 'version-a', archivedAt: null, sourceRefs: [], sample: false, createdAt: NOW, updatedAt: NOW },
    { id: 'project-b', title: '项目 B', profile: {}, activeVersionId: 'version-b', archivedAt: null, sourceRefs: [], sample: false, createdAt: NOW, updatedAt: NOW },
  )
  workspace.collections.projectVersions.push(
    { id: 'version-a', projectId: 'project-a', label: 'v0.1', parentVersionId: null, lifecycle: 'working', frozenDigest: null, summary: '', currentQuestion: '', nextAction: '', sourceRefs: [], createdAt: NOW, updatedAt: NOW },
    { id: 'version-b', projectId: 'project-b', label: 'v0.1', parentVersionId: null, lifecycle: 'working', frozenDigest: null, summary: '', currentQuestion: '', nextAction: '', sourceRefs: [], createdAt: NOW, updatedAt: NOW },
  )
  workspace.collections.iterationCycles.push(
    { id: 'cycle-a', projectId: 'project-a', versionId: 'version-a', uncertainty: '', currentStep: 'uncertainty', status: 'active', createdAt: NOW, updatedAt: NOW },
    { id: 'cycle-b', projectId: 'project-b', versionId: 'version-b', uncertainty: '', currentStep: 'uncertainty', status: 'active', createdAt: NOW, updatedAt: NOW },
  )
  workspace.collections.courseEnrollments.push({ id: 'enrollment-a', courseId: 'tabletop-foundations', courseVersion: 'v3', currentUnitId: 'unit-01', status: 'active', createdAt: NOW, updatedAt: NOW })
  workspace.active = { projectId: 'project-a', versionId: 'version-a', iterationId: 'cycle-a', enrollmentId: 'enrollment-a' }
  return workspace
}

const routeFixtures = [
  '#course?course=tabletop-foundations&enrollment=enrollment-a',
  '#course/units/unit-01/activities/compare?course=tabletop-foundations&enrollment=enrollment-a',
  '#workbench/new',
  '#workbench/projects/project-a/versions/version-a',
  '#workbench/projects/project-a/versions/version-a/cycles/cycle-a/question',
  '#tools/prototype-scope?project=project-a&version=version-a&iteration=cycle-a&source=activity-1&return_to=%23course%2Funits%2Funit-01%2Factivities%2Fcompare%3Fcourse%3Dtabletop-foundations',
]

for (const fixture of routeFixtures) assert.equal(serializeRoute(parseRouteHash(fixture)), fixture, `route did not round-trip: ${fixture}`)

assert.deepEqual(validateWorkContext({ versionId: 'version-a' }).map(item => item.code), ['version_without_project'])
assert.deepEqual(validateWorkContext({ projectId: 'project-a', iterationId: 'cycle-a' }).map(item => item.code), ['iteration_without_version'])
assert.deepEqual(validateWorkContext({ courseId: 'course-a', activityId: 'activity-a' }).map(item => item.code), ['activity_without_unit'])
assert.deepEqual(validateWorkContext({ returnTo: 'https://example.com' }).map(item => item.code), ['invalid_return_route'])

const workspace = fixtureWorkspace()
const explicitA = resolveWorkContext(workspace, parseRouteHash('#workbench/projects/project-a/versions/version-a/cycles/cycle-a/question'))
assert.equal(explicitA.status, 'resolved')
assert.equal(explicitA.authority, 'explicit_url')
assert.equal(explicitA.context.projectId, 'project-a')

const tabB = resolveWorkContext(workspace, parseRouteHash('#workbench/projects/project-b/versions/version-b/cycles/cycle-b/review'))
assert.equal(tabB.context.projectId, 'project-b', 'tab B must not inherit active project A')
assert.equal(explicitA.context.projectId, 'project-a', 'tab A context must remain isolated')

const mismatched = resolveWorkContext(workspace, parseRouteHash('#workbench/projects/project-a/versions/version-b'))
assert.equal(mismatched.status, 'recovery_required')
assert.ok(mismatched.issues.some(item => item.code === 'version_project_mismatch'))
assert.equal(mismatched.context.versionId, 'version-b', 'resolver must not silently replace an invalid explicit version')

const missing = resolveWorkContext(workspace, parseRouteHash('#workbench/projects/missing-project'))
assert.equal(missing.status, 'recovery_required')
assert.ok(missing.issues.some(item => item.code === 'missing_project'))

const landing = resolveWorkContext(workspace, parseRouteHash('#workbench'))
assert.equal(landing.authority, 'active_fallback')
assert.equal(landing.context.projectId, 'project-a')
const unrelated = resolveWorkContext(workspace, parseRouteHash('#resources/all'))
assert.equal(unrelated.authority, 'none')
assert.deepEqual(unrelated.context, {})

const toolRoute = parseRouteHash('#tools/core-loop?project=project-a&version=version-a&return_to=%23workbench%2Fprojects%2Fproject-a%2Fversions%2Fversion-a')
assert.equal(contextReturnRoute(toolRoute), '#workbench/projects/project-a/versions/version-a')

const [contract, appSource] = await Promise.all([
  readFile(new URL('../docs/product/WORK_CONTEXT_CONTRACT.md', import.meta.url), 'utf8'),
  readFile(new URL('../src/App.tsx', import.meta.url), 'utf8'),
])
for (const legacy of ['#learn/workshop', '#learn/iteration', '#learn/node-01', '#tools/{19 个 tool id}', '#path', '#resources/*']) assert.ok(contract.includes(legacy), `legacy URL manifest missing ${legacy}`)
for (const browserContract of ["window.addEventListener('hashchange'", "window.addEventListener('popstate'", 'parseRouteHash(window.location.hash)']) assert.ok(appSource.includes(browserContract))

console.log(`work context: PASS (${routeFixtures.length} canonical routes, explicit URL authority, recovery and tab isolation)`)
