import type { ResourceStageGroup } from './data'

// 资源入口不按“质量高低”排列。这里的顺序只表达一名新手在该阶段
// 最容易开始的脚手架，再把更具体的问题收在后面。
export const resourceStageGroups: ResourceStageGroup[] = [
  {
    stage: '体验意图',
    prompt: '先说清你想让玩家经历什么，再决定要读哪一种资料。',
    entryIds: [
      'choose-learning-spine',
      'learn-by-playing',
      'issue-to-system-translation',
    ],
  },
  {
    stage: '核心系统',
    prompt: '从重复出现的决定开始，再处理机制、互动和不同配置。',
    entryIds: [
      'core-loop-handoff',
      'turn-structure-action-economy',
      'spatial-map-structure',
      'negotiation-commitment-alliance',
      'auction-value-discovery',
      'market-restock-price-feedback',
      'resource-production-chain',
      'hidden-information-hand-economy',
      'deck-building-draw-cycle',
      'card-language-effect-resolution',
      'scoring-goals-incentives',
      'randomness-and-uncertainty',
      'game-length-and-endings',
      'player-count-scaling',
      'solo-automa-design',
    ],
  },
  {
    stage: '最小原型',
    prompt: '这一轮只做能回答当前问题的部分，不先做完整游戏。',
    entryIds: [
      'first-prototype',
      'prototype-scope-and-fidelity',
      'choose-design-aid',
    ],
  },
  {
    stage: '测试与反馈',
    prompt: '先选一个问题和一场测试，再用证据决定下一版。',
    entryIds: [
      'first-playtest',
      'single-question-playtest',
      'live-playtest-session',
      'evidence-review-change-brief',
      'cross-session-finding-evolution',
      'finding-lineage-successor-revision',
      'player-symptom-diagnosis',
      'accessibility-task-path',
      'campaign-state-testing',
      'test-design-aid-before-release',
    ],
  },
  {
    stage: '规则与信息',
    prompt: '检查陌生玩家能否学会、查到并一致地执行规则。',
    entryIds: [
      'rules-and-teaching',
      'card-language-effect-resolution',
      'card-pool-version-governance',
    ],
  },
  {
    stage: '呈现与发布',
    prompt: '先冻结版本与责任范围，再准备生产、投稿或发布。',
    entryIds: ['production-and-publishing'],
  },
]
