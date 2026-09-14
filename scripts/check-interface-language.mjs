import assert from 'node:assert/strict'
import { parseRouteHash, serializeRoute } from '../src/url-state.ts'
import { switchRouteLanguage } from '../src/interface-language.ts'

const cases = [
  ['#play/zh-CN', '#play/en'],
  ['#resources/library/all/zh-CN?q=worker&kind=mechanisms&group=actions', '#resources/library/all/en?q=worker&kind=mechanisms&group=actions'],
  ['#resources/cases/root/zh-CN?angle=economy&section=decisions&author=1', '#resources/cases/root/en?angle=economy&author=1&section=decisions'],
  ['#course/reading/reading-choices-and-agency/zh-CN?from=%23resources%2Fread%2Fall%2Fzh-CN%3Fq%3Dchoices', '#course/reading/reading-choices-and-agency/en?from=%23resources%2Fread%2Fall%2Fen%3Fq%3Dchoices'],
  ['#learn', '#course/reading/all/en'],
  ['#resources', '#resources/read/all/en'],
  ['#privacy', '#privacy/en'],
  ['#course/practice', '#course/practice?lang=en'],
  ['#workbench/projects/example/versions/v1/cycles/c1/question', '#workbench/projects/example/versions/v1/cycles/c1/question?lang=en'],
  ['#tools/core-loop?project=example&version=v1', '#tools/core-loop?project=example&version=v1&lang=en'],
]
for (const [from, expected] of cases) {
  const initial = parseRouteHash(from)
  const changed = switchRouteLanguage(initial, 'en')
  assert.equal(serializeRoute(changed), expected, `Switch keeps the current location: ${from}`)
  assert.equal(serializeRoute(parseRouteHash(expected)), expected, 'Refreshing keeps the selected language and context')
  assert.deepEqual(changed.workContext, initial.workContext, 'Switching never changes a project, version, or return context')
  const chinese = switchRouteLanguage(parseRouteHash(expected), 'zh-CN')
  assert.equal(chinese.readingLanguage || chinese.uiLanguage, 'zh-CN')
}
assert.equal(parseRouteHash('#workbench?lang=invalid').uiLanguage, undefined)
console.log('Interface language: 10 location/refresh/context cases, reverse switching, invalid preference PASS')
