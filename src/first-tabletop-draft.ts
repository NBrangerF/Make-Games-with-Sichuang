import { mechanicMaterialById, themeMaterialById } from './design-material-catalog.ts'

const STORAGE_KEY = 'tabletop-workshop-first-tabletop-v1'

export type FirstTabletopState = 'not-started' | 'drafted' | 'tabletop' | 'tested' | 'revised'

export type FirstTabletopDraft = {
  schemaVersion: 1
  mechanicId: string
  themeId: string
  players: string
  minutes: string
  materials: string
  playerGoal: string
  endCondition: string
  repeatedAction: string
  feedback: string
  testQuestion: string
  runNote: string
  revisionNote: string
  actionState: FirstTabletopState
  updatedAt: string
}

const initialDraft: FirstTabletopDraft = {
  schemaVersion: 1,
  mechanicId: '',
  themeId: '',
  players: '2—3 人',
  minutes: '5—10 分钟',
  materials: '18 张空白卡、12 枚标记、1 张 A4 纸；不用正式美术。',
  playerGoal: '',
  endCondition: '',
  repeatedAction: '',
  feedback: '',
  testQuestion: '',
  runNote: '',
  revisionNote: '',
  actionState: 'not-started',
  updatedAt: '',
}

export function readFirstTabletopDraft(): FirstTabletopDraft {
  try {
    const value = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null') as Partial<FirstTabletopDraft> | null
    if (!value || value.schemaVersion !== 1) return initialDraft
    return { ...initialDraft, ...value, schemaVersion: 1 }
  } catch {
    return initialDraft
  }
}

export function writeFirstTabletopDraft(draft: FirstTabletopDraft) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(draft)) } catch { /* 本地存储不可用时仍可继续当前会话 */ }
}

export function seedFirstTabletopMaterial(kind: 'mechanic' | 'theme', id: string) {
  const catalog = kind === 'mechanic' ? mechanicMaterialById : kind === 'theme' ? themeMaterialById : undefined
  if (!catalog?.has(id)) return false
  const current = readFirstTabletopDraft()
  writeFirstTabletopDraft({
    ...current,
    [kind === 'mechanic' ? 'mechanicId' : 'themeId']: id,
    actionState: current.actionState === 'not-started' ? 'drafted' : current.actionState,
    updatedAt: new Date().toISOString(),
  })
  return true
}

export function firstTabletopMissingCore(draft: FirstTabletopDraft): string[] {
  return [
    !mechanicMaterialById.has(draft.mechanicId) && '一张 mechanic 牌',
    !themeMaterialById.has(draft.themeId) && '一张 theme 牌',
    !draft.playerGoal.trim() && '玩家目标',
    !draft.endCondition.trim() && '结束条件',
    !draft.repeatedAction.trim() && '玩家反复行动',
    !draft.feedback.trim() && '行动后的可见反馈',
    !draft.testQuestion.trim() && '第一次测试问题',
  ].filter(Boolean) as string[]
}
