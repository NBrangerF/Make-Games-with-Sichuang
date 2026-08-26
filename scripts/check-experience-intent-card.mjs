import { readFile } from 'node:fs/promises'

const read = path => readFile(new URL(path, import.meta.url), 'utf8')
const [tool, app, data, styles, storage, guides, contentValidator, projectWorkspace] = await Promise.all([
  read('../src/experience-intent-card.tsx'),
  read('../src/App.tsx'),
  read('../src/data.ts'),
  read('../src/styles.css'),
  read('../src/storage-keys.ts'),
  read('../content/guides.json'),
  read('./validate-content.mjs'),
  read('../docs/product/PROJECT_WORKSPACE.md'),
])

const guideRecords = JSON.parse(guides)
const intentGuide = guideRecords.find(guide => guide.id === 'guide-experience-intent')
const failures = []
let guards = 0
const assert = (condition, message) => {
  guards += 1
  if (!condition) failures.push(message)
}

assert(storage.includes("tabletop-workshop-experience-intent-v1"), 'versioned experience-intent storage key is missing')
assert(data.includes("'experience-intent'"), 'experience-intent tool id is missing from data types')
assert(contentValidator.includes("'experience-intent'"), 'content validator does not allow the experience-intent tool id')
assert(intentGuide?.toolIds?.[0] === 'experience-intent', 'experience-intent guide must link directly to the new tool')
assert(app.includes("import('./experience-intent-card')"), 'tool must be loaded as an independent lazy chunk')
assert(app.includes("experience_intent_records"), 'complete project export must include experience intent records')
assert(app.includes('体验意图卡正在加载'), 'lazy loading fallback is missing')
assert((tool.match(/number: '0[1-5]'/g) || []).length === 5, 'tool must expose exactly five numbered steps')
assert(['玩家与语境', '重复决定', '压力与反馈', '预测与反例', '本轮边界'].every(label => tool.includes(label)), 'one or more step labels are missing')
assert(['playerContext', 'repeatedDecision', 'pressure', 'visibleFeedback', 'predictedBehavior', 'disconfirmingSignal', 'nonGoal', 'testQuestion'].every(field => tool.includes(field)), 'one or more required intent fields are missing')
assert(tool.includes("method: 'experience-intent-card'"), 'export method is missing')
assert(tool.includes('local_first: true'), 'local-first export boundary is missing')
assert(tool.includes('no_fun_score: true') && tool.includes('no_player_profile_inference: true') && tool.includes('no_mechanic_recommendation: true'), 'export refusal flags are incomplete')
assert(tool.includes('真实桌面行为、玩家语言与不同群体语境'), 'evidence boundary is missing from export')
assert(tool.includes('validateDraft') && ['context', 'decision', 'pressure', 'prediction', 'boundary'].every(step => tool.includes(`step: '${step}'`)) && tool.includes('setStep(problem.step)'), 'validation must route incomplete records to the relevant step')
assert(tool.includes('再次点击“确认清空草稿”') && tool.includes('已保存的体验意图不会删除'), 'two-step clear protection is missing')
assert(styles.includes('.experience-intent-layout {') && styles.includes('grid-template-columns: minmax(0, 1.75fr)'), 'desktop editor/summary layout is missing')
assert(styles.includes('.experience-intent-steps { display: flex; min-width: 0; overflow-x: auto; }'), 'mobile local step scrolling is missing')
assert(styles.includes('.experience-intent-pair { grid-template-columns: 1fr; gap: 0; }'), 'mobile form collapse is missing')
assert(projectWorkspace.includes('experience_intent_records'), 'project workspace contract must include experience intent records')

if (failures.length) {
  console.error(failures.join('\n'))
  process.exit(1)
}

console.log(`experience intent card ok: ${guards}/${guards} guards`)
