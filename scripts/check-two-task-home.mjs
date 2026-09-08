import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
// Retained command name for compatibility. The primary home is now reading driven.
const [app, reader, practice] = await Promise.all([
  readFile(new URL('../src/App.tsx', import.meta.url), 'utf8'),
  readFile(new URL('../src/text-learning.tsx', import.meta.url), 'utf8'),
  readFile(new URL('../src/course/course-v3.tsx', import.meta.url), 'utf8'),
])
assert.ok(app.includes("route.view === 'learn' && !route.learningNode"))
assert.ok(app.includes("route.view === 'learn' && route.learningNode && <Suspense"), 'Legacy nodes only handle explicit deep links')
assert.ok(app.includes('<TextLearning chapterId={route.readingChapter} language={interfaceLanguage}'))
assert.ok(reader.includes('从第一章读起') && reader.includes('chapterList()'))
assert.ok(!/useWorkspace|startCourseEnrollment/.test(reader))
assert.ok(reader.includes('#course/practice'), 'Practice remains an optional secondary route')
assert.ok(practice.includes('返回系统阅读'))
for (const label of ['系统学习', '设计工作台', '按问题阅读']) assert.ok(app.includes(`: '${label}'`))
assert.ok(app.includes("resourceEntry: 'read', resourceId: 'all', readingLanguage: language"), 'Primary browsing opens self-contained articles')
console.log('Home: PASS (default reading path; direct chapter access; optional practice preserves existing records)')
