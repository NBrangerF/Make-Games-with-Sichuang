import { readFile } from 'node:fs/promises'

const read = path => readFile(new URL(path, import.meta.url), 'utf8')
const [tool, experience, prototypeScope, app, data, styles, storage, guides, contentValidator, projectWorkspace] = await Promise.all([
  read('../src/core-loop-canvas.tsx'),
  read('../src/experience-intent-card.tsx'),
  read('../src/prototype-scope-cutter.tsx'),
  read('../src/App.tsx'),
  read('../src/data.ts'),
  read('../src/styles.css'),
  read('../src/storage-keys.ts'),
  read('../content/guides.json'),
  read('./validate-content.mjs'),
  read('../docs/product/PROJECT_WORKSPACE.md'),
])

const guideRecords = JSON.parse(guides)
const coreGuide = guideRecords.find(guide => guide.id === 'guide-core-system')
const failures = []
let guards = 0
const assert = (condition, message) => {
  guards += 1
  if (!condition) failures.push(message)
}

assert(storage.includes("tabletop-workshop-core-loop-v1"), 'versioned core-loop storage key is missing')
assert(data.includes("'core-loop'"), 'core-loop tool id is missing from data types')
assert(contentValidator.includes("'core-loop'"), 'content validator does not allow the core-loop tool id')
assert(coreGuide?.toolIds?.[0] === 'core-loop', 'core-system guide must link directly to the core-loop canvas')
assert(app.includes("import('./core-loop-canvas')"), 'tool must be loaded as an independent lazy chunk')
assert(app.includes('core_loop_records'), 'complete project export must include core-loop records')
assert(app.includes('核心循环画布正在加载'), 'lazy loading fallback is missing')
assert((tool.match(/number: '0[1-5]'/g) || []).length === 5, 'tool must expose exactly five numbered steps')
assert(['承接意图', '信息与选择', '代价与承诺', '状态与反馈', '重复与出口'].every(label => tool.includes(label)), 'one or more core-loop step labels are missing')
assert(['currentInformation', 'viableOptions', 'cost', 'commitment', 'stateChange', 'feedbackToNextInput', 'nextInput', 'nextDecision', 'exitCondition', 'prototypeQuestion'].every(field => tool.includes(field)), 'one or more required loop fields are missing')
assert(tool.includes('导入最近体验意图') && tool.includes('readLatestIntent'), 'explicit experience-intent import is missing')
assert(tool.includes('尚未替你选择机制或补写循环规则'), 'import must state that it does not infer a mechanism')
assert(tool.includes("method: 'core-loop-canvas'"), 'export method is missing')
assert(tool.includes('local_first: true'), 'local-first export boundary is missing')
assert(tool.includes('no_loop_quality_score: true') && tool.includes('no_optimal_mechanic_recommendation: true') && tool.includes('no_player_experience_claim: true') && tool.includes('no_silent_intent_inference: true'), 'export refusal flags are incomplete')
assert(tool.includes('真实玩家是否看见选项、使用反馈、承担代价并形成目标行为'), 'evidence boundary is missing from export')
assert(tool.includes('validateDraft') && ['handoff', 'input', 'commitment', 'state', 'repeat'].every(step => tool.includes(`step: '${step}'`)), 'validation must route incomplete records to the relevant step')
assert(tool.includes('再次点击“确认清空草稿”') && tool.includes('已保存的核心循环不会删除'), 'two-step clear protection is missing')
assert(tool.includes('继续裁剪原型 →') && tool.includes('onContinue?.()'), 'explicit continuation to prototype scope is missing')
assert(experience.includes("onContinue={() =>") || app.includes("onContinue={() => onTool('core-loop')}"), 'experience intent must explicitly continue to core loop')
assert(prototypeScope.includes('导入最近核心循环') && prototypeScope.includes('readLatestCoreLoop'), 'prototype scope must explicitly import the latest core loop')
assert(prototypeScope.includes('材料、范围和保真度仍需按本轮问题选择'), 'prototype import must preserve designer judgment')
assert(styles.includes('.core-loop-layout {') && styles.includes('grid-template-columns: minmax(0, 1.74fr)'), 'desktop editor/diagram layout is missing')
assert(styles.includes('.core-loop-steps { display: flex; min-width: 0; overflow-x: auto; }'), 'mobile local step scrolling is missing')
assert(styles.includes('.core-loop-pair { grid-template-columns: 1fr; gap: 0; }'), 'mobile form collapse is missing')
assert(projectWorkspace.includes('core_loop_records'), 'project workspace contract must include core-loop records')

if (failures.length) {
  console.error(failures.join('\n'))
  process.exit(1)
}

console.log(`core loop canvas ok: ${guards}/${guards} guards`)
