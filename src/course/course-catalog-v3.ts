export const COURSE_V3_ID = 'tabletop-foundations'
export const COURSE_V3_VERSION = '2026.08'

export type CourseUnitV3 = Readonly<{
  id: string
  number: string
  title: string
  question: string
  output: string
  status: 'available' | 'planned'
  activityId: string
  activityRevision: string
  toolLabel: string
  conciseConcept: string
  example: string
  counterexample: string
  rubric: string[]
}>

export const courseUnitsV3: CourseUnitV3[] = [
  { id: 'unit-01', number: '01', title: '从玩家行为看游戏', question: '同一条规则，如何变成玩家在桌上真正做的事？', output: '三款微型游戏的对比观察表', status: 'available', activityId: 'compare-three-microgames', activityRevision: '1', toolLabel: '三款游戏对比表', conciseConcept: '先分开四层：规则写了什么，玩家做了什么，局面如何改变，玩家因此感到什么。', example: '规则说「同时出一张卡」；可观察行为是「玩家看了两次对手已出的卡，再把手从一张卡移到另一张」。', counterexample: '「玩家很纠结」不是完整观察；它还没说纠结时做了什么。', rubric: ['三款游戏都实际运行过至少一轮', '每款都记录一个具体玩家行为', '能指出做决定时可见的信息', '结论没有写成「好玩/不好玩」'] },
  { id: 'unit-02', number: '02', title: '目标、行动与结束', question: '玩家正在追求什么，每轮能做什么，游戏为什么结束？', output: '一页游戏骨架图', status: 'available', activityId: 'game-skeleton', activityRevision: '1', toolLabel: '游戏骨架图', conciseConcept: '用目标、可用行动、状态和结束条件描述一个能运行的结构。', example: '三轮后比较信号标记；每轮选一张卡并移动一枚标记。', counterexample: '「玩家要赢」没有说明追求什么可见状态。', rubric: ['目标可指向桌面状态', '行动可以被真正执行', '结束条件不依赖设计者临时判断'] },
  { id: 'unit-03', number: '03', title: '有意义的选择', question: '选项为什么不会立刻坍缩成唯一答案？', output: '决定与信息表', status: 'available', activityId: 'decision-table', activityRevision: '1', toolLabel: '决定表', conciseConcept: '有意义的选择涉及可考虑的选项、不同后果和玩家在乎的目标；完全公开的信息也可以支持这种选择。', example: '现在得 2 分，或保留卡争取下轮 5 分。', counterexample: '一个选项同时更便宜、得分更高且没有风险。', rubric: ['选项后果不同', '代价在当下可感知', '记录玩家决定时知道什么'] },
  { id: 'unit-04', number: '04', title: '做出第一个最短循环', question: '信息、选择、状态变化和反馈如何连回来？', output: '最短核心循环与微型原型', status: 'available', activityId: 'minimum-loop', activityRevision: '1', toolLabel: '核心循环画布', conciseConcept: '只保留能让玩家连续做三次关键决定的部件。', example: '公开需求→选卡→改变信号→看见对手反应→再选。', counterexample: '先做完所有美术、背景和完整牌库才运行。', rubric: ['可连续运行三轮', '每轮有状态变化', '玩家能看见上次决定的部分后果'] },
  { id: 'unit-05', number: '05', title: '把不确定变成测试', question: '本轮只需要回答哪一个问题？', output: '测试计划与可观察信号', status: 'available', activityId: 'test-question', activityRevision: '1', toolLabel: '单问题测试计划', conciseConcept: '先写不确定，再写问题和证据信号，最后决定原型范围。', example: '玩家会为下轮收益保留卡吗？', counterexample: '「这游戏好玩吗？」无法直接决定下一版。', rubric: ['问题只含一个主要不确定', '信号可被记录', '同时写出反驳当前猜想的信号'] },
  { id: 'unit-06', number: '06', title: '记录现场，不替现场解释', question: '什么真的发生了？', output: 'Session 与 EvidenceItem', status: 'available', activityId: 'evidence-recording', activityRevision: '1', toolLabel: '现场记录器', conciseConcept: '先记行为、状态、原话和主持介入，测试结束后再解释。', example: '玩家在 20 秒内三次查看同一张帮助卡。', counterexample: '「玩家没理解规则」把解释写成了事实。', rubric: ['每条记录可指向时刻或状态', '原话与设计者转述分开', '主持介入被如实记录'] },
  { id: 'unit-07', number: '07', title: '从证据到下一版', question: '哪些是观察，哪些是解释，下一版只先改什么？', output: 'EvidenceReview 与 ChangeBrief', status: 'available', activityId: 'review-and-change', activityRevision: '1', toolLabel: '证据复盘表', conciseConcept: '为当前解释保留替代解释，把改动与一条精确版本边绑定。', example: '观察：3 人中 2 人跳过保留；解释：延迟奖励不可见。', counterexample: '把玩家建议原样当成下一版方案。', rubric: ['观察与解释分开', '至少一个替代解释', '明确写出不改什么'] },
  { id: 'unit-08', number: '08', title: '规则、教学与可及性', question: '陌生人能否学会、执行、查找和恢复？', output: '教学路径与可及性观察', status: 'available', activityId: 'teach-and-access', activityRevision: '1', toolLabel: '教学路径表', conciseConcept: '先做有设计者教学的 Teach test，规则稳定后再做 Blind test。', example: '记录玩家第一次停下查规则的任务与查找路径。', counterexample: '设计者讲完后问「都懂了吗」，把点头算成已学会。', rubric: ['教学介入与规则自学分开', '记录第一个分歧点', '至少检查一种非颜色区分方式'] },
  { id: 'unit-09', number: '09', title: '回顾一个完整项目', question: '哪些决定有证据，哪些仍是假设，接下来走哪条分支？', output: '项目 postmortem 与下一步路线', status: 'available', activityId: 'project-postmortem', activityRevision: '1', toolLabel: '项目回顾', conciseConcept: '回顾过程证据，而不是给作品打一个「好游戏」分数。', example: '保留三条版本决定与它们对应的 Session/Review。', counterexample: '没有外部测试就宣称可以出版。', rubric: ['版本决定可追溯到证据', '未解决问题仍被保留', '下一步是可选分支而非统一发布终点'] },
]

export const unit01Games = [
  { id: 'signal-three', title: '三张信号', materials: '6 张纸片，分别写 1、2、3，两人各一组', setup: '每人拿 1、2、3 三张。', rules: ['同时背面选一张，再同时翻开。', '数字较小者得 1 分；相同都不得分。', '已出的卡保持公开，三轮后结束。'], watch: '玩家如何根据对手剩余卡改变选择。' },
  { id: 'shared-river', title: '共享河道', materials: '1 张画有 7 格的纸，2 枚标记，6 枚硬币', setup: '两枚标记放在第 1 格，硬币放旁边。', rules: ['轮到你时选择：自己前进 2 格，或两人都前进 1 格并拿 1 枚硬币。', '任何标记到第 7 格立即结束。', '到达者得 3 分，每枚硬币 1 分。'], watch: '玩家如何在个人速度与共享收益之间权衡。' },
  { id: 'hidden-stones', title: '暗袋石头', materials: '10 个小物件，不透明杯子或纸袋', setup: '一人秘密放入 1–5 个物件。', rules: ['另一人可先问一个只能回答「是/否」的问题。', '然后猜是单数还是双数。', '猜中得 1 分，交换角色，四轮后结束。'], watch: '玩家如何把一次提问变成可用信息。' },
] as const

export function getCourseUnit(unitId?: string) {
  return courseUnitsV3.find(item => item.id === unitId) ?? courseUnitsV3[0]
}
