import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const [home, app, styles, env] = await Promise.all([
  readFile(new URL('../src/learning-home.tsx', import.meta.url), 'utf8'),
  readFile(new URL('../src/App.tsx', import.meta.url), 'utf8'),
  readFile(new URL('../src/styles-learning-nodes.css', import.meta.url), 'utf8'),
  readFile(new URL('../.env.example', import.meta.url), 'utf8'),
])

const v3Home = home.match(/function TwoTaskLearningHome[\s\S]*?\n}\n\nexport function LearningHome/)?.[0] ?? ''
assert.ok(v3Home)
assert.equal((v3Home.match(/<article>/g) ?? []).length, 2, 'V3 hero must contain exactly two primary task cards')
for (const text of ['系统学习', '开始或继续', '打开设计知识库', 'onOpenCourse', 'onOpenWorkbench']) assert.ok(v3Home.includes(text), `missing ${text}`)
assert.equal(v3Home.includes('mechanic 设计材料'), false)
assert.equal(v3Home.includes('观察实验室'), false)
assert.ok(home.includes("VITE_V3_HOME_ENABLED === 'true' || !deploymentInfo.publicTrial"))
assert.ok(env.includes('VITE_V3_HOME_ENABLED=false'))

const nav = app.match(/const twoTaskLinks:[^=]*= \[([\s\S]*?)\n  \]/)?.[1] ?? ''
assert.equal((nav.match(/id:/g) ?? []).length, 3)
for (const label of ['系统学习', '设计工作台', '设计知识库']) assert.ok(nav.includes(`label: '${label}'`))
assert.ok(app.includes('legacyLinks'), 'public-trial rollback navigation must remain available')
assert.ok(styles.includes('.two-task-home__choices'))
assert.ok(styles.includes('@media (max-width: 700px)'))

console.log('two-task home: PASS (two primary CTAs, one knowledge link, enrollment/project-aware copy and controlled public rollout)')
