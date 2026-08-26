import type { Stage } from './data'

export const guideResourceEntryByStage = {
  '体验意图': 'choose-learning-spine',
  '核心系统': 'core-loop-handoff',
  '最小原型': 'prototype-scope-and-fidelity',
  '测试与反馈': 'first-playtest',
  '规则与信息': 'rules-and-teaching',
  '呈现与发布': 'production-and-publishing',
} as const satisfies Record<Stage, string>
