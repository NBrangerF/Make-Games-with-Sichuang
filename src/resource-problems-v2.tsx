import type { ResourceEntryReference, ResourceStageGroup, Stage } from './data'

export const resourceProblemStageIds = [
  'intent',
  'core',
  'prototype',
  'testing',
  'rules',
  'publishing',
] as const

export type ResourceProblemStageId = typeof resourceProblemStageIds[number]

const stageById: Record<ResourceProblemStageId, Stage> = {
  intent: '体验意图',
  core: '核心系统',
  prototype: '最小原型',
  testing: '测试与反馈',
  rules: '规则与信息',
  publishing: '呈现与发布',
}

const stageIdSet = new Set<string>(resourceProblemStageIds)

export function isResourceProblemStageId(value: string | undefined): value is ResourceProblemStageId {
  return typeof value === 'string' && stageIdSet.has(value)
}

type ResourceProblemsStartProps = {
  entries: readonly ResourceEntryReference[]
  stageGroups: readonly ResourceStageGroup[]
  stageId?: ResourceProblemStageId
  onBack: () => void
  onChooseStage: (stageId: ResourceProblemStageId) => void
  onChooseEntry: (entryId: string) => void
}

export function ResourceProblemsStart({ entries, stageGroups, stageId, onBack, onChooseStage, onChooseEntry }: ResourceProblemsStartProps) {
  const entryById = new Map(entries.map(entry => [entry.id, entry]))
  if (!stageId) {
    return (
      <main className="resource-start-page resource-problems-start" id="main-content" tabIndex={-1}>
        <button className="resource-start-back" type="button" onClick={onBack}>返回资源首页</button>
        <h1 className="resource-start-title">你现在做到哪一步？</h1>
        <p className="resource-start-lede">先选一个阶段。下一页只显示这个阶段正在解决的问题。</p>
        <nav className="resource-start-choices" aria-label="选择当前设计阶段">
          <ul className="resource-start-list">
            {resourceProblemStageIds.map((id, index) => {
              const stage = stageById[id]
              const group = stageGroups.find(item => item.stage === stage)
              return (
                <li className="resource-start-list-item" key={id}>
                  <button className="resource-start-choice" type="button" onClick={() => onChooseStage(id)}>
                    <span className="resource-start-choice-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                    <span className="resource-start-choice-copy">
                      <strong className="resource-start-choice-title">{stage}</strong>
                      <span className="resource-start-choice-result">{group?.prompt}</span>
                    </span>
                    <span className="resource-start-choice-arrow" aria-hidden="true">→</span>
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>
      </main>
    )
  }

  const selectedStage = stageById[stageId]
  const group = stageGroups.find(item => item.stage === selectedStage)
  const stageEntries = group?.entryIds.map(id => entryById.get(id)).filter((entry): entry is ResourceEntryReference => Boolean(entry)) ?? []

  return (
    <main className="resource-start-page resource-problems-list" id="main-content" tabIndex={-1}>
      <button className="resource-start-back" type="button" onClick={onBack}>返回阶段选择</button>
      <h1 className="resource-start-title">{selectedStage}</h1>
      <p className="resource-start-lede">{group?.prompt}</p>
      <nav className="resource-start-choices" aria-label={`${selectedStage}的具体设计问题`}>
        <ul className="resource-start-list">
          {stageEntries.map((entry, index) => (
            <li className="resource-start-list-item" key={entry.id}>
              <button className="resource-start-choice" type="button" onClick={() => onChooseEntry(entry.id)}>
                <span className="resource-start-choice-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                <span className="resource-start-choice-copy">
                  <strong className="resource-start-choice-title">{entry.title}</strong>
                </span>
                <span className="resource-start-choice-arrow" aria-hidden="true">→</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </main>
  )
}
