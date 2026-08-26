import type { GuideToolId } from './data'

export const toolTitles: Record<GuideToolId, string> = {
  'experience-intent': '体验意图卡',
  'core-loop': '核心循环画布',
  redesign: '改造熟悉游戏',
  'test-plan': '单问题测试计划',
  'playtest-session': '现场测试记录',
  feedback: '证据复盘与变更简报',
  'evidence-synthesis': '发现演化与版本证据',
  'playtest-selector': '测试方式选择',
  'constraint-deck': '原创设计约束牌',
  'balance-pass': '单风险平衡诊断',
  'decision-trace': '单轮决定轨迹',
  'shared-decision': '共享决定观察',
  'theme-review': '主题承诺与伤害复核',
  'production-ledger': '生产假设账本',
  'route-map': '发布路线责任图',
  'teaching-path': '单任务学习路径',
  'accessibility-observation': '任务无障碍观察',
  'version-governance': '内容版本治理',
  'prototype-scope': '原型范围裁剪器',
  'issue-to-system': '议题到系统工作台',
}

export const toolActionLabels: Record<GuideToolId, string> = Object.fromEntries(
  Object.entries(toolTitles).map(([toolId, title]) => [toolId, `打开${title}`]),
) as Record<GuideToolId, string>
