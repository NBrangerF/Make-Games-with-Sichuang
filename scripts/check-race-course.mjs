import assert from 'node:assert/strict'
import fs from 'node:fs'
import { resolveRaceMove } from '../src/race-model.ts'
import { parseRouteHash, serializeRoute } from '../src/url-state.ts'
import { readingHref, readingReturn, readingReturnLanguage } from '../src/reading-navigation.ts'
import { switchRouteLanguage } from '../src/interface-language.ts'
import { caseGameName } from '../src/case-game-name.ts'
import { searchCases } from '../src/case-discovery.ts'
const json = file => JSON.parse(fs.readFileSync(new URL(`../${file}`, import.meta.url), 'utf8'))
const race = json('content/reading-path.json'), river = json('content/reading-path-river.json')
assert.equal(race.chapters.length, 28); assert.equal(river.chapters.length, 28)
for (let i = 0; i < 28; i++) assert.equal(race.chapters[i].id, river.chapters[i].id.replace(/^reading-/, 'race-'))
for (const language of ['zh-CN', 'en']) {
  const alternative = readingHref('course', undefined, language, { readingTrack: 'river' })
  assert.equal(parseRouteHash(alternative).readingTrack, 'river')
  assert.equal(serializeRoute(parseRouteHash(alternative)), alternative)
  assert.equal(readingReturn(alternative), alternative)
  const switched = serializeRoute(switchRouteLanguage(parseRouteHash(alternative), language === 'en' ? 'zh-CN' : 'en'))
  assert.ok(switched.endsWith('?track=river'), 'Changing language retains the alternative directory')
  const related = readingHref('cases', 'cant-stop', language, { readingReturnTo: alternative })
  assert.equal(parseRouteHash(related).readingReturnTo, alternative)
  for (const path of [race, river]) for (const chapter of path.chapters) {
    const href = readingHref('course', chapter.id, language)
    assert.equal(serializeRoute(parseRouteHash(href)), href)
    assert.equal(parseRouteHash(readingReturnLanguage(href, language)).readingChapter, chapter.id)
  }
}
assert.equal(parseRouteHash('#course/reading/all/en?track=unknown').readingTrack, undefined)
const cases = json('content/design-case-ids.json').map(id => json(`content/design-cases/${id}/meta.json`))
for (const entry of cases) {
  const name = caseGameName(entry, 'zh-CN')
  assert.match(name, /\p{Script=Han}/u, `${entry.id}: Chinese game title required`)
  assert.equal(caseGameName(entry, 'en'), entry.game)
  assert.ok(entry.title['zh-CN'].includes(name))
  for (const query of [name, entry.game, ...entry.gameAliases]) assert.ok(searchCases(cases, { query }).some(r => r.entry.id === entry.id), `${entry.id}: searchable name ${query}`)
}
const comparisons = json('content/race-comparisons.json')
assert.equal(comparisons.entries.length, 5)
for (const entry of comparisons.entries) {
  assert.match(entry.name['zh-CN'], /\p{Script=Han}/u)
  assert.ok(race.chapters.some(c => c.id === entry.chapterId && c.number === entry.chapters[0]))
  assert.ok(entry.sources.length > 0)
  for (const source of entry.sources) assert.equal(new URL(source.url).protocol, 'https:')
}
// Independent worked situations from the written rules, including non-triggering passes.
for (const [position, die, landed, destination, won] of [[0,3,3,11,false],[6,2,8,17,false],[6,6,12,12,false],[12,2,14,4,false],[20,2,22,12,false],[20,4,24,24,true],[23,1,24,24,true],[23,2,23,23,false],[8,1,9,9,false],[24,1,24,24,true]]) {
  const move = resolveRaceMove(position,die)
  assert.deepEqual([move.landed,move.destination,move.won],[landed,destination,won])
}
for (let position = 0; position < 24; position++) for (let die = 1; die <= 6; die++) {
  const move = resolveRaceMove(position,die)
  assert.ok(move.destination >= 1 && move.destination <= 24)
  if (position + die > 24) assert.equal(move.destination,position,'Overshoot stays; it never bounces or triggers the current space')
}
for (const invalid of [[-1,1],[25,1],[1,0],[1,7],[1.2,3],[1,2.5]]) assert.throws(()=>resolveRaceMove(...invalid),RangeError)
let success = 0
for(let a=1;a<=6;a++) for(let b=1;b<=6;b++) if(resolveRaceMove(23,a).won || resolveRaceMove(23,b).won) success++
assert.equal(success,11,'At least one 1 in two fair independent dice: 11 of 36 ordered outcomes, not an overall win rate')
assert.ok(resolveRaceMove(6,2).destination > resolveRaceMove(6,6).destination, 'A larger selected result need not advance farther')
console.log('Race course PASS: two complete bilingual paths, alternative-language and return URLs, 18 Chinese titles and aliases, 5 sourced comparisons, 144 moves and 36 ordered dice outcomes. No human playtest claim.')
