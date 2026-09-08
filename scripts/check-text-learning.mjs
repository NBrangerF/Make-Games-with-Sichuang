import assert from 'node:assert/strict'
import fs from 'node:fs'
import { parseRouteHash, serializeRoute } from '../src/url-state.ts'
const read = p => fs.readFileSync(new URL(`../${p}`, import.meta.url), 'utf8')
const path = JSON.parse(read('content/reading-path.json'))
const articles = JSON.parse(read('content/original-articles/catalog.json')).articles
// Version 3 course contract. These counts describe the reviewed curriculum, not learning effectiveness.
assert.equal(path.contentVersion, '3.0.0')
assert.equal(path.parts.length, 7)
assert.equal(path.chapters.length, 28)
assert.equal(new Set(path.chapters.map(c => c.id)).size, 28)
assert.deepEqual(path.chapters.map(c => c.number), Array.from({ length: 28 }, (_, i) => i + 1))
const originalMain = ['reading-rules-and-play', 'reading-choices-and-agency', 'reading-information-and-randomness', 'reading-resources-and-endings', 'reading-space-and-opportunity', 'reading-time-and-interaction', 'reading-theme-and-emotion', 'reading-stories-and-models', 'reading-rules-and-components', 'reading-access-and-participation', 'reading-prototypes-and-evidence', 'reading-design-judgment']
assert.deepEqual(path.chapters.filter(c => originalMain.includes(c.id)).map(c => c.id), originalMain, 'Preserve original main IDs and relative sequence')
for (const part of path.parts) {
  assert.ok(path.chapters.some(c => c.part === part.id))
  for (const lang of ['zh-CN', 'en']) assert.ok(part.title[lang] && part.introduction[lang].trim())
}
for (const [index, chapter] of path.chapters.entries()) {
  assert.ok(articles.some(a => a.id === chapter.id), `${chapter.id}: full article exists`)
  assert.ok(path.parts.some(p => p.id === chapter.part))
  assert.ok(chapter.related.every(id => articles.some(a => a.id === id)))
  assert.ok(Array.isArray(chapter.prerequisites))
  assert.equal(new Set(chapter.prerequisites).size, chapter.prerequisites.length)
  for (const id of chapter.prerequisites) assert.ok(path.chapters.slice(0, index).some(c => c.id === id), `${chapter.id}: prerequisite ${id} is explained earlier`)
  for (const lang of ['zh-CN', 'en']) {
    const hash = `#course/reading/${chapter.id}/${lang}`
    const route = parseRouteHash(hash)
    assert.equal(route.readingChapter, chapter.id)
    assert.equal(route.readingLanguage, lang)
    assert.equal(route.workContext, undefined, 'Reading requires no enrollment or project')
    assert.equal(serializeRoute(route), hash)
    const text = read(`content/original-articles/${chapter.id}/${lang}.md`)
    // Missing-body guards only; editorial and bilingual reviews live outside the site.
    assert.ok(text.length > (lang === 'en' ? 1800 : 700), `${chapter.id}/${lang}: body missing or unexpectedly truncated`)
    assert.ok((text.match(/^## /gm) || []).length >= 3)
  }
}
const optional = articles.filter(a => !path.chapters.some(c => c.id === a.id)).map(a => a.id)
assert.equal(optional.length, 13)
assert.deepEqual([...new Set(path.chapters.flatMap(c => c.related))].sort(), optional.sort(), 'Every optional essay has a place')
assert.equal(serializeRoute(parseRouteHash('#course/practice')), '#course/practice')
const legacy = '#course/units/unit-01/activities/compare-three-microgames?course=tabletop-foundations&enrollment=demo'
assert.equal(serializeRoute(parseRouteHash(legacy)), legacy)
assert.equal(parseRouteHash('#course/reading/missing/en').readingChapter, 'missing')
assert.equal(serializeRoute(parseRouteHash('#course/reading/all/en')), '#course/reading/all/en')
const ui = read('src/text-learning.tsx')
assert.ok(!/ChapterSources|reading-resource-guide|sourcesIntro/.test(ui), 'Course explains its content without a raw-source guide')
assert.ok(!/useWorkspace|localStorage|sessionStorage|enrollment|<form|<textarea|type="checkbox"/.test(ui), 'Reader has no practice gate or completion writes')
assert.ok(ui.includes('ArticleBody') && ui.includes('previous') && ui.includes('next'))
assert.ok(ui.includes('chapterHref(chapterId, lang)'), 'Language switching keeps the chapter')
const app = read('src/App.tsx')
assert.ok(app.includes("route.view === 'learn' && !route.learningNode"))
assert.ok(app.includes("route.resourceId === 'systematic'"))
assert.ok(app.includes('<TextLearning chapterId={route.readingChapter}'))
console.log('Text learning: 28 bilingual chapters, 13 optional essays, prerequisite order, source-independent reader and practice compatibility PASS; no comprehension claim')
