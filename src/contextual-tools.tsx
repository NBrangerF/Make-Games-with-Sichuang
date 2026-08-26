import type { GuideToolId } from './data'
import type { LearningContentId } from './learning-content-route'
import type { AnalysisQuestionId, LearningStartEntryId } from './resource-start-v2'
import { toolTitles } from './tool-catalog'
import { preloadToolSurface } from './tool-loaders'

export type ContextualToolLink = Readonly<{
  toolId: GuideToolId
  title: string
  reason: string
}>

const link = (toolId: GuideToolId, reason: string): ContextualToolLink => ({
  toolId,
  title: toolTitles[toolId],
  reason,
})

export const learningEntryToolLinks: Record<LearningStartEntryId, readonly ContextualToolLink[]> = {
  systematic: [],
  'designer-thinking': [link('decision-trace', '用同一张记录表拆开问题、选项、证据与结果。')],
  'learn-by-playing': [link('decision-trace', '冻结一局中的一个决定时刻，再开始分析。')],
  'small-exercise': [
    link('redesign', '保留熟悉游戏的大部分规则，只改变一个变量。'),
    link('constraint-deck', '需要一个清楚边界时，用一张约束牌开始。'),
  ],
}

export const learningContentToolLinks: Record<LearningContentId, readonly ContextualToolLink[]> = {
  'systematic-unit-00-question-first': [link('experience-intent', '把大点子缩成玩家动作、行为预测与可反驳信号。')],
  'systematic-unit-01-experience-intent': [link('experience-intent', '把本单元的体验意图整理成可带去测试的一页记录。')],
  'systematic-unit-02-decisions-core-loop': [link('core-loop', '把输入、选择、代价、状态与反馈连成一条短循环。')],
  'systematic-unit-03-mechanisms-information-interaction': [
    link('decision-trace', '冻结一个决定，检查信息怎样让选项进入或退出考虑。'),
    link('shared-decision', '多人共同决定时，继续追踪信息、权限与后果。'),
  ],
  'systematic-unit-04-minimum-prototype': [link('prototype-scope', '只保留当前问题需要被看见和执行的原型部分。')],
  'systematic-unit-05-single-question-test': [link('test-plan', '把预测、反驳信号与观察任务写成一场可执行测试。')],
  'systematic-unit-06-evidence-to-next-version': [
    link('feedback', '把观察、解释和下一版单一改动分开记录。'),
    link('evidence-synthesis', '当同一发现跨越多轮测试时，继续维护证据关系。'),
  ],
  'learn-by-playing-one-moment': [link('decision-trace', '把刚读完的观察方法用于一局里的一个具体决定。')],
  'game-design-concepts-level-01': [link('constraint-deck', '完成十五分钟练习时，用约束缩小空白纸。')],
  'game-design-concepts-level-02': [link('prototype-scope', '把设计风险缩成这轮真正需要制作的可玩切片。')],
  'what-makes-a-rulebook-accessible-and-entertaining': [link('accessibility-observation', '选择一个真实任务，记录障碍、协助与下一次实验。')],
  'designer-case-monsoon-market-variables': [link('balance-pass', '像案例一样一次冻结一种失效风险与一项变化。')],
  'designer-case-dune-imperium-beginnings': [link('core-loop', '画出两套机制怎样通过机会成本接成同一循环。')],
  'designer-case-quid-for-your-quo': [link('core-loop', '删掉一项机制前，先记录它在循环里承担的隐藏工作。')],
  'designer-case-paul-grogan-rulebook-layout': [link('teaching-path', '用一个陌生玩家任务检查教学、查询与恢复入口。')],
  'designer-case-new-bedford-manufacturing-constraint': [link('production-ledger', '把材料限制、组件职责与仍未验证的成本写进同一账本。')],
}

export const analysisToolLinks: Record<AnalysisQuestionId, readonly ContextualToolLink[]> = {
  experience: [link('experience-intent', '把感受追溯到可观察动作、限制与行为预测。')],
  decisions: [link('decision-trace', '区分合法行动、真正考虑过的选项与退出原因。')],
  interaction: [
    link('decision-trace', '冻结一次互动前后的决定，追踪信息、机会与代价怎样改变。'),
    link('shared-decision', '当玩家共同讨论或代办决定时，再检查参与、权限与后果。'),
  ],
  'state-and-feedback': [link('core-loop', '把状态变化与下一轮决定之间的反馈画出来。')],
  'learning-and-execution': [link('teaching-path', '冻结一个学习任务，检查行动、查询与中断恢复。')],
}

export const resourceEntryToolLinks: Record<string, readonly ContextualToolLink[]> = {
  'first-prototype': [link('prototype-scope', '把第一版缩成只回答当前问题的可玩切片。')],
  'first-playtest': [
    link('playtest-selector', '先按这一轮需要的证据，选择合适的测试方式。'),
    link('test-plan', '再写一场只回答一个问题的可执行测试。'),
  ],
  'rules-and-teaching': [link('teaching-path', '选择一个陌生玩家任务，检查怎样开始与怎样恢复。')],
  'production-and-publishing': [
    link('production-ledger', '记录数量、材料、成本与仍未验证的生产假设。'),
    link('route-map', '按接收者任务分清设计、生产、销售与履约责任。'),
  ],
  'player-symptom-diagnosis': [link('decision-trace', '冻结症状出现前的一个决定，先找可观察的退出原因。')],
  'learn-by-playing': [link('decision-trace', '从一局中的一个决定时刻开始记录。')],
  'choose-learning-spine': [link('experience-intent', '先写学习后要能完成的玩家动作与判断。')],
  'choose-design-aid': [link('constraint-deck', '用一个明确限制检查辅助材料是否真的帮助设计。')],
  'accessibility-task-path': [link('accessibility-observation', '围绕一个真实任务记录障碍、协助与代价。')],
  'campaign-state-testing': [link('test-plan', '冻结一段战役状态，写清预测、参与范围与反驳信号。')],
  'solo-automa-design': [link('decision-trace', '检查自动对手怎样改变玩家实际考虑的选项。')],
  'player-count-scaling': [link('test-plan', '只改变人数，写一轮可比较的任务与观察信号。')],
  'game-length-and-endings': [link('decision-trace', '追踪终局临近时哪些决定仍然真实存在。')],
  'randomness-and-uncertainty': [link('balance-pass', '定义一种随机性失效风险，再选择模型与实测证据。')],
  'scoring-goals-incentives': [link('balance-pass', '检查一条得分关系是否持续压倒其他选择。')],
  'turn-structure-action-economy': [link('decision-trace', '冻结一个回合，比较合法行动与有效决定。')],
  'spatial-map-structure': [link('decision-trace', '冻结一次位置决定，检查可达性、信息与机会成本。')],
  'negotiation-commitment-alliance': [link('shared-decision', '记录提案、承诺、权限与后果分别落在谁身上。')],
  'auction-value-discovery': [link('decision-trace', '冻结一次出价，追踪信息、替代项与机会成本。')],
  'market-restock-price-feedback': [link('balance-pass', '把价格、补充与玩家行为写成一条可反驳风险。')],
  'resource-production-chain': [link('balance-pass', '只诊断一种产出链失效，并写清模型边界。')],
  'hidden-information-hand-economy': [link('decision-trace', '检查私人信息怎样改变真实可见的选择集合。')],
  'deck-building-draw-cycle': [link('balance-pass', '冻结一种抽取或循环风险，再决定需要哪些证据。')],
  'card-language-effect-resolution': [link('teaching-path', '用一个效果结算任务检查文字、顺序与查询入口。')],
  'card-pool-version-governance': [link('version-governance', '让卡池、勘误与规则引用都能找到当前有效版本。')],
  'prototype-scope-and-fidelity': [link('prototype-scope', '按问题选择最低足够保真度，并写清本轮不做什么。')],
  'issue-to-system-translation': [
    link('issue-to-system', '把议题承诺翻译成玩家反复执行的规则关系。'),
    link('theme-review', '检查角色、奖励、暴露与退出路径是否兑现主题承诺。'),
  ],
  'core-loop-handoff': [link('core-loop', '把意图交接成可以执行、观察与更新的短循环。')],
  'single-question-playtest': [link('test-plan', '冻结一个预测、一个反驳信号和一项观察任务。')],
  'live-playtest-session': [link('playtest-session', '在测试现场按时间记录行动、状态与决定。')],
  'evidence-review-change-brief': [link('feedback', '把本轮证据收成下一版只改一项的简报。')],
  'cross-session-finding-evolution': [link('evidence-synthesis', '连接多轮会话中的发现、反证与后继修订。')],
  'finding-lineage-successor-revision': [link('evidence-synthesis', '维护发现从出现到修订、撤回或被取代的谱系。')],
  'test-design-aid-before-release': [link('test-plan', '把辅助材料的作用写成可被真人任务反驳的问题。')],
}

export function ContextualToolLinks({ links, onOpenTool }: { links: readonly ContextualToolLink[]; onOpenTool: (toolId: GuideToolId) => void }) {
  if (links.length === 0) return null
  return (
    <section className="contextual-tools" aria-labelledby="contextual-tools-title">
      <header>
        <p>配套工作单</p>
        <h2 id="contextual-tools-title">现在可以动手</h2>
        <span>工具只帮助你完成这一步，不代替阅读、判断或真人测试。</span>
      </header>
      <ol>
        {links.map((item, index) => (
          <li key={item.toolId}>
            <button type="button" onMouseEnter={() => preloadToolSurface(item.toolId)} onFocus={() => preloadToolSurface(item.toolId)} onClick={() => onOpenTool(item.toolId)}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <div><strong>{item.title}</strong><small>{item.reason}</small></div>
              <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M5 12h13M13 6l6 6-6 6" /></svg>
            </button>
          </li>
        ))}
      </ol>
    </section>
  )
}
