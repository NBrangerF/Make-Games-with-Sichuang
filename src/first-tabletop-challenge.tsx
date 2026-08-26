import { useMemo, useState } from 'react'
import { brandedDownloadName } from './brand'
import { mechanicMaterialById, mechanicMaterials, themeMaterialById, themeMaterials } from './design-material-catalog'

const STORAGE_KEY = 'tabletop-workshop-first-tabletop-v1'

export type FirstTabletopState = 'not-started' | 'drafted' | 'tabletop' | 'tested' | 'revised'

type FirstTabletopDraft = {
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

const stateOrder: FirstTabletopState[] = ['not-started', 'drafted', 'tabletop', 'tested', 'revised']
const stateLabels: Record<FirstTabletopState, string> = {
  'not-started': '未开始',
  drafted: '已起草',
  tabletop: '已落桌',
  tested: '已测试',
  revised: '已修订',
}

function readDraft(): FirstTabletopDraft {
  try {
    const value = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null') as Partial<FirstTabletopDraft> | null
    if (!value || value.schemaVersion !== 1) return initialDraft
    return { ...initialDraft, ...value, schemaVersion: 1 }
  } catch {
    return initialDraft
  }
}

function writeDraft(draft: FirstTabletopDraft) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(draft)) } catch { /* 本地存储不可用时仍可继续当前会话 */ }
}

export function seedFirstTabletopMaterial(kind: 'mechanic' | 'theme', id: string) {
  const current = readDraft()
  writeDraft({
    ...current,
    [kind === 'mechanic' ? 'mechanicId' : 'themeId']: id,
    actionState: current.actionState === 'not-started' ? 'drafted' : current.actionState,
    updatedAt: new Date().toISOString(),
  })
}

type FirstTabletopChallengeProps = {
  onBack: () => void
  onOpenMaterials: (kind: 'mechanics' | 'themes') => void
  onContinueIteration: () => void
  onOpenProject: () => void
}

export function FirstTabletopChallenge({ onBack, onOpenMaterials, onContinueIteration, onOpenProject }: FirstTabletopChallengeProps) {
  const [draft, setDraft] = useState<FirstTabletopDraft>(readDraft)
  const [status, setStatus] = useState('')
  const mechanic = mechanicMaterialById.get(draft.mechanicId)
  const theme = themeMaterialById.get(draft.themeId)
  const progress = Math.round((stateOrder.indexOf(draft.actionState) / (stateOrder.length - 1)) * 100)

  const update = <Key extends keyof FirstTabletopDraft>(key: Key, value: FirstTabletopDraft[Key]) => {
    const nextDraft: FirstTabletopDraft = {
      ...draft,
      [key]: value,
      actionState: draft.actionState === 'not-started' ? 'drafted' : draft.actionState,
      updatedAt: new Date().toISOString(),
    }
    setDraft(nextDraft)
    writeDraft(nextDraft)
    setStatus('')
  }

  const missingCore = useMemo(() => [
    !draft.mechanicId && '一张 mechanic 牌',
    !draft.themeId && '一张 theme 牌',
    !draft.playerGoal.trim() && '玩家目标',
    !draft.endCondition.trim() && '结束条件',
    !draft.repeatedAction.trim() && '玩家反复行动',
    !draft.feedback.trim() && '行动后的可见反馈',
    !draft.testQuestion.trim() && '第一次测试问题',
  ].filter(Boolean) as string[], [draft])

  const markState = (next: FirstTabletopState) => {
    if (next !== 'not-started' && next !== 'drafted' && missingCore.length > 0) {
      setStatus(`先补上：${missingCore.join('、')}。这些是让原型能够落桌的最低边界。`)
      return
    }
    if ((next === 'tested' || next === 'revised') && !draft.runNote.trim()) {
      setStatus('“已测试”需要一条真实运行记录：谁做了什么、哪里停住，或者哪个结果与你预测不同。')
      return
    }
    if (next === 'revised' && !draft.revisionNote.trim()) {
      setStatus('“已修订”需要写清下一版只改什么，以及暂时保持什么不变。')
      return
    }
    const nextDraft = { ...draft, actionState: next, updatedAt: new Date().toISOString() }
    setDraft(nextDraft)
    writeDraft(nextDraft)
    setStatus(`已记录为“${stateLabels[next]}”。这只描述发生过的行动，不评价游戏质量。`)
  }

  const exportBrief = () => {
    const payload = {
      schema_version: 1,
      method: 'first-tabletop-microgame-brief',
      state: draft.actionState,
      no_quality_score: true,
      no_best_mechanic_claim: true,
      mechanic: mechanic ? { id: mechanic.id, name: mechanic.name, player_verb: mechanic.playerVerb, table_change: mechanic.tableChange } : null,
      theme: theme ? { id: theme.id, name: theme.name, player_position: theme.playerPosition, repeated_actions: theme.repeatedActions } : null,
      brief: draft,
      exported_at: new Date().toISOString(),
    }
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = brandedDownloadName('第一次落桌-微型原型简报')
    anchor.click()
    URL.revokeObjectURL(url)
  }

  return <main className="learning-map first-tabletop-page" id="main-content" tabIndex={-1}>
    <nav className="learning-node-page__top" aria-label="第一次落桌导航"><button type="button" onClick={onBack}>← 返回学习首页</button><span>{stateLabels[draft.actionState]}</span></nav>
    <div className="learning-node-page__progress" aria-label={`当前行动状态 ${progress}%`}><span style={{ width: `${progress}%` }} /></div>

    <header className="first-tabletop-page__hero">
      <div><p className="learning-eyebrow">60—90 分钟受限挑战</p><h1>第一次落桌</h1><p>目标不是想出完整作品，而是让一个动作在桌面上发生、产生后果，并真实运行三轮。</p></div>
      <aside><strong>今天不做</strong><p>完整世界观、全部卡牌、正式美术、平衡证明、盲测、出版计划。</p></aside>
    </header>

    <div className="first-tabletop-layout">
      <form className="first-tabletop-form" onSubmit={event => { event.preventDefault(); markState('drafted') }}>
        <section aria-labelledby="first-tabletop-materials">
          <div className="first-tabletop-section-heading"><span>01</span><div><p>选择起点</p><h2 id="first-tabletop-materials">一张 mechanic，加一张 theme</h2></div></div>
          <p className="section-copy">mechanic 决定先观察什么动作；theme 决定玩家处在哪种关系。它们是候选，不是配方。</p>
          <div className="first-tabletop-pair">
            <label><span>Mechanic 牌</span><select value={draft.mechanicId} onChange={event => update('mechanicId', event.target.value)}><option value="">先选择一张</option>{mechanicMaterials.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}</select><button type="button" onClick={() => onOpenMaterials('mechanics')}>先浏览全部 mechanic</button></label>
            <label><span>Theme 牌</span><select value={draft.themeId} onChange={event => update('themeId', event.target.value)}><option value="">先选择一张</option>{themeMaterials.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}</select><button type="button" onClick={() => onOpenMaterials('themes')}>先浏览全部 theme</button></label>
          </div>
          {(mechanic || theme) && <div className="first-tabletop-material-summary">
            {mechanic && <article><strong>{mechanic.name}</strong><p>玩家反复做：{mechanic.playerVerb}</p><p>桌面会改变：{mechanic.tableChange}</p></article>}
            {theme && <article><strong>{theme.name}</strong><p>玩家处在：{theme.playerPosition}</p><p>系统压力：{theme.systemPressure}</p></article>}
          </div>}
        </section>

        <section aria-labelledby="first-tabletop-boundary">
          <div className="first-tabletop-section-heading"><span>02</span><div><p>收紧边界</p><h2 id="first-tabletop-boundary">先限制时间、人数和材料</h2></div></div>
          <div className="first-tabletop-pair"><label><span>几个人玩</span><input value={draft.players} onChange={event => update('players', event.target.value)} /></label><label><span>一局多久</span><input value={draft.minutes} onChange={event => update('minutes', event.target.value)} /></label></div>
          <label><span>今天能用的材料</span><textarea rows={3} value={draft.materials} onChange={event => update('materials', event.target.value)} /></label>
        </section>

        <section aria-labelledby="first-tabletop-skeleton">
          <div className="first-tabletop-section-heading"><span>03</span><div><p>写出骨架</p><h2 id="first-tabletop-skeleton">目标、结束、行动与反馈</h2></div></div>
          <label><span>玩家在追求什么？ *</span><textarea rows={3} value={draft.playerGoal} onChange={event => update('playerGoal', event.target.value)} placeholder="例如：在公共补给耗尽前，让自己的两条考察路线都带回一份有效记录。" /></label>
          <label><span>游戏何时以及为什么结束？ *</span><textarea rows={3} value={draft.endCondition} onChange={event => update('endCondition', event.target.value)} placeholder="例如：完成三轮后结束；比较带回的记录，也检查公共补给是否保持在安全线以上。" /></label>
          <label><span>玩家每回合反复做什么？ *</span><textarea rows={3} value={draft.repeatedAction} onChange={event => update('repeatedAction', event.target.value)} placeholder={mechanic ? mechanic.playerVerb : '写一个玩家可以实际执行的动作，不只写“制定策略”。'} /></label>
          <label><span>做完以后，玩家立刻看见什么改变？ *</span><textarea rows={3} value={draft.feedback} onChange={event => update('feedback', event.target.value)} placeholder={mechanic ? mechanic.tableChange : '例如：公共池减少、路线打开、手牌变少，下一位玩家的可用选择随之改变。'} /></label>
        </section>

        <section aria-labelledby="first-tabletop-run">
          <div className="first-tabletop-section-heading"><span>04</span><div><p>真的跑一次</p><h2 id="first-tabletop-run">只问一个问题，运行三轮</h2></div></div>
          <label><span>第一次测试只问什么？ *</span><textarea rows={3} value={draft.testQuestion} onChange={event => update('testQuestion', event.target.value)} placeholder="例如：玩家会因为公共补给的未来变化，主动放弃一次眼前收益吗？" /></label>
          <label><span>真实运行记录</span><textarea rows={4} value={draft.runNote} onChange={event => update('runNote', event.target.value)} placeholder="运行后再写：第几轮，谁做了什么；哪里停住；哪一条结果与你预测不同。没有运行时请保持为空。" /></label>
          <label><span>下一版只改什么</span><textarea rows={3} value={draft.revisionNote} onChange={event => update('revisionNote', event.target.value)} placeholder="测试后再写：保持什么不变；下一版只改变哪一处；预计会看见什么不同。" /></label>
        </section>

        <section className="first-tabletop-state" aria-labelledby="first-tabletop-state-title">
          <div><p className="learning-eyebrow">行动状态</p><h2 id="first-tabletop-state-title">只记录真正发生过的事</h2></div>
          <div>{stateOrder.slice(1).map(item => <button key={item} className={draft.actionState === item ? 'is-active' : undefined} type="button" onClick={() => markState(item)} aria-pressed={draft.actionState === item}>{stateLabels[item]}</button>)}</div>
          <p><strong>已起草</strong>有一份简报；<strong>已落桌</strong>材料实际摆上桌并跑得动；<strong>已测试</strong>完成了一次真实运行记录；<strong>已修订</strong>写清下一版决定。</p>
          {status && <p className="learning-node-tool__status" role="status">{status}</p>}
        </section>
      </form>

      <aside className="first-tabletop-brief" aria-label="微型原型简报">
        <p className="learning-eyebrow">当前简报</p>
        <h2>{theme?.name ?? '先选择一个主题位置'}</h2>
        <p className="first-tabletop-brief__mechanic">使用 {mechanic?.name ?? '一张 mechanic 牌'} 作为第一条结构假设</p>
        <dl><div><dt>边界</dt><dd>{draft.players} · {draft.minutes}</dd></div><div><dt>目标</dt><dd>{draft.playerGoal || '尚未写'}</dd></div><div><dt>结束</dt><dd>{draft.endCondition || '尚未写'}</dd></div><div><dt>反复行动</dt><dd>{draft.repeatedAction || '尚未写'}</dd></div><div><dt>可见反馈</dt><dd>{draft.feedback || '尚未写'}</dd></div><div><dt>第一次只问</dt><dd>{draft.testQuestion || '尚未写'}</dd></div></dl>
        <p className="first-tabletop-brief__boundary">这份简报不证明组合合适、游戏有趣、平衡或适合某类玩家。只有实际运行会提供下一步证据。</p>
        <button className="learning-primary-action" type="button" onClick={exportBrief}>导出微型原型简报</button>
        <button className="learning-secondary-action" type="button" onClick={onOpenProject}>把简报整理进项目护照</button>
        <button className="learning-secondary-action" type="button" onClick={onContinueIteration}>带着问题进入原型迭代</button>
      </aside>
    </div>
  </main>
}
