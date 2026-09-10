// This optional reading order reuses the published lessons; it does not gate reading.
export const libraryLearningStages = [
  {
    title: { 'zh-CN': '看懂一次选择', en: 'Understand a choice' },
    purpose: { 'zh-CN': '从包裹领取开始，比较分配办法，再把取得与交付接起来。', en: 'Start with a parcel pick, compare ways to allocate it, then connect acquiring and delivering.' },
    ids: ['lesson-see-a-mechanism', 'lesson-choose-a-mechanism', 'lesson-build-a-combination'],
  },
  {
    title: { 'zh-CN': '让题材成为规则', en: 'Turn a theme into rules' },
    purpose: { 'zh-CN': '写清动作的条件，检查题材预期，再用同一个问题比较真实游戏。', en: 'Specify action conditions, examine thematic expectations, then compare real games through one question.' },
    ids: ['lesson-theme-to-rule', 'lesson-theme-promises', 'lesson-compare-two-games'],
  },
  {
    title: { 'zh-CN': '做出可用的原型', en: 'Make a usable prototype' },
    purpose: { 'zh-CN': '用“小车送书”确定所需材料，检查参与方式，再找出说明中缺失的决定。', en: 'Use Book Cart to choose materials, examine participation, and find decisions missing from the rules.' },
    ids: ['lesson-prototype-a-question', 'lesson-design-for-participation', 'lesson-test-rules'],
  },
  {
    title: { 'zh-CN': '根据证据修订', en: 'Revise from evidence' },
    purpose: { 'zh-CN': '沿用小车游戏，分开事件与解释、反馈与建议，再核算一条改动的影响。', en: 'Stay with Book Cart: separate events from interpretations and feedback from suggestions, then calculate a rule change.' },
    ids: ['lesson-observe-a-turn', 'lesson-use-feedback', 'lesson-change-one-risk'],
  },
] as const

export const libraryLessonOrder = libraryLearningStages.flatMap(stage => [...stage.ids])
