import { FormEvent, useEffect, useMemo, useState } from 'react'
import { CORE_LOOP_STORAGE_KEY, EXPERIENCE_INTENT_STORAGE_KEY } from './storage-keys'

type CoreLoopStep = 'handoff' | 'input' | 'commitment' | 'state' | 'repeat'
type CoreLoopDraft = {
  projectName: string
  version: string
  sourceIntentId: string
  sourceIntentCreatedAt: string
  sourceHypothesis: string
  sourcePredictedBehavior: string
  sourceDisconfirmingSignal: string
  sourceTestQuestion: string
  playerContext: string
  repeatedDecision: string
  currentInformation: string
  immediateGoal: string
  viableOptions: string
  optionDifference: string
  resolvedAction: string
  cost: string
  commitment: string
  stateChange: string
  visibleTo: string
  feedbackTiming: string
  feedbackToNextInput: string
  effectPath: string
  nextInput: string
  nextDecision: string
  exitCondition: string
  invariant: string
  changedAxis: string
  predictedBehavior: string
  disconfirmingSignal: string
  prototypeQuestion: string
}
type CoreLoopRecord = CoreLoopDraft & { id: string; createdAt: string }
type CoreLoopStore = { schemaVersion: 1; draft: CoreLoopDraft; records: CoreLoopRecord[] }
type IntentSource = {
  id?: string
  createdAt?: string
  projectName?: string
  version?: string
  playerContext?: string
  repeatedDecision?: string
  pressure?: string
  visibleFeedback?: string
  predictedBehavior?: string
  disconfirmingSignal?: string
  testQuestion?: string
}

const steps: { id: CoreLoopStep; number: string; label: string; note: string }[] = [
  { id: 'handoff', number: '01', label: '承接意图', note: '来源只读；是否采用、怎样实现仍由设计者决定。' },
  { id: 'input', number: '02', label: '信息与选择', note: '写玩家当时真正看见且认为可行的选项。' },
  { id: 'commitment', number: '03', label: '代价与承诺', note: '选择要改变可用资源、权限、位置、信息或未来机会。' },
  { id: 'state', number: '04', label: '状态与反馈', note: '反馈要能进入下一次决定，不只是结算动画或情绪词。' },
  { id: 'repeat', number: '05', label: '重复与出口', note: '闭环不是无限循环；写清何时停止、换层或进入终局。' },
]

const createEmptyDraft = (): CoreLoopDraft => ({
  projectName: '', version: '', sourceIntentId: '', sourceIntentCreatedAt: '', sourceHypothesis: '', sourcePredictedBehavior: '', sourceDisconfirmingSignal: '', sourceTestQuestion: '',
  playerContext: '', repeatedDecision: '', currentInformation: '', immediateGoal: '', viableOptions: '', optionDifference: '', resolvedAction: '', cost: '', commitment: '',
  stateChange: '', visibleTo: '', feedbackTiming: '', feedbackToNextInput: '', effectPath: '', nextInput: '', nextDecision: '', exitCondition: '', invariant: '', changedAxis: '',
  predictedBehavior: '', disconfirmingSignal: '', prototypeQuestion: '',
})

function readStore(): CoreLoopStore {
  const fallback: CoreLoopStore = { schemaVersion: 1, draft: createEmptyDraft(), records: [] }
  try {
    const stored = JSON.parse(localStorage.getItem(CORE_LOOP_STORAGE_KEY) || 'null')
    if (!stored || stored.schemaVersion !== 1) return fallback
    return { schemaVersion: 1, draft: { ...fallback.draft, ...stored.draft }, records: Array.isArray(stored.records) ? stored.records : [] }
  } catch { return fallback }
}

function readLatestIntent(): IntentSource | null {
  try {
    const stored = JSON.parse(localStorage.getItem(EXPERIENCE_INTENT_STORAGE_KEY) || 'null')
    if (!stored || stored.schemaVersion !== 1) return null
    const source = (Array.isArray(stored.records) && stored.records[0]) || stored.draft
    if (!source || ![source.playerContext, source.repeatedDecision, source.predictedBehavior].some(value => value?.trim())) return null
    return source
  } catch { return null }
}

function compileIntent(source: IntentSource) {
  if (![source.playerContext, source.repeatedDecision, source.pressure, source.visibleFeedback, source.predictedBehavior].every(value => value?.trim())) return ''
  return `在${source.playerContext}中，玩家反复${source.repeatedDecision}；因为${source.pressure}，系统通过${source.visibleFeedback}显示后果。我预计${source.predictedBehavior}`
}

function downloadJson(filename: string, payload: unknown) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}

function validateDraft(draft: CoreLoopDraft): { step: CoreLoopStep; message: string } | null {
  if (![draft.projectName, draft.version, draft.playerContext, draft.repeatedDecision, draft.predictedBehavior, draft.disconfirmingSignal].every(value => value.trim())) {
    return { step: 'handoff', message: '请补齐项目、版本、玩家语境、重复决定、行为预测与反驳信号。' }
  }
  if (![draft.currentInformation, draft.immediateGoal, draft.viableOptions, draft.optionDifference].every(value => value.trim())) {
    return { step: 'input', message: '请写清当前信息、眼前目标、可行选项与选项为何不同。' }
  }
  if (![draft.resolvedAction, draft.cost, draft.commitment].every(value => value.trim())) {
    return { step: 'commitment', message: '请写清玩家执行什么、支付什么代价，以及何时还能撤回。' }
  }
  if (![draft.stateChange, draft.visibleTo, draft.feedbackTiming, draft.feedbackToNextInput, draft.effectPath].every(value => value.trim())) {
    return { step: 'state', message: '请补齐状态变化、可见对象、反馈时机、下一输入与作用路径。' }
  }
  if (![draft.nextInput, draft.nextDecision, draft.exitCondition, draft.invariant, draft.changedAxis, draft.prototypeQuestion].every(value => value.trim())) {
    return { step: 'repeat', message: '请写清下一输入/决定、循环出口、保持不变、单一改动和原型问题。' }
  }
  return null
}

export function CoreLoopCanvas({ onContinue }: { onContinue?: () => void }) {
  const [initial] = useState(readStore)
  const [draft, setDraft] = useState(initial.draft)
  const [records, setRecords] = useState(initial.records)
  const [step, setStep] = useState<CoreLoopStep>('handoff')
  const [status, setStatus] = useState('草稿会自动保存在当前浏览器。')
  const [clearArmed, setClearArmed] = useState(false)

  useEffect(() => {
    localStorage.setItem(CORE_LOOP_STORAGE_KEY, JSON.stringify({ schemaVersion: 1, draft, records }))
  }, [draft, records])

  const update = <K extends keyof CoreLoopDraft>(key: K, value: CoreLoopDraft[K]) => {
    setDraft(current => ({ ...current, [key]: value }))
    setStatus('草稿已在当前浏览器更新。')
    setClearArmed(false)
  }

  const importIntent = () => {
    const source = readLatestIntent()
    if (!source) {
      setStatus('没有找到可承接的体验意图；可以先完成体验意图卡，或在本页手动填写。')
      return
    }
    const hypothesis = compileIntent(source)
    setDraft(current => ({
      ...current,
      projectName: source.projectName?.trim() || current.projectName,
      version: source.version?.trim() || current.version,
      sourceIntentId: source.id || 'experience-intent-draft',
      sourceIntentCreatedAt: source.createdAt || '',
      sourceHypothesis: hypothesis,
      sourcePredictedBehavior: source.predictedBehavior?.trim() || '',
      sourceDisconfirmingSignal: source.disconfirmingSignal?.trim() || '',
      sourceTestQuestion: source.testQuestion?.trim() || '',
      playerContext: source.playerContext?.trim() || current.playerContext,
      repeatedDecision: source.repeatedDecision?.trim() || current.repeatedDecision,
      predictedBehavior: source.predictedBehavior?.trim() || current.predictedBehavior,
      disconfirmingSignal: source.disconfirmingSignal?.trim() || current.disconfirmingSignal,
      prototypeQuestion: source.testQuestion?.trim() || current.prototypeQuestion,
    }))
    setStatus('已导入最近体验意图的原字段；尚未替你选择机制或补写循环规则。')
    setClearArmed(false)
  }

  const loopStatement = useMemo(() => {
    if (![draft.currentInformation, draft.viableOptions, draft.cost, draft.stateChange, draft.feedbackToNextInput, draft.nextInput, draft.nextDecision].every(value => value.trim())) return ''
    return `在${draft.currentInformation}下，玩家从${draft.viableOptions}中选择；因为${draft.cost}，系统让${draft.stateChange}，并通过${draft.feedbackToNextInput}把${draft.nextInput}交给下一次“${draft.nextDecision}”。`
  }, [draft])

  const saveRecord = (event: FormEvent) => {
    event.preventDefault()
    const problem = validateDraft(draft)
    if (problem) { setStep(problem.step); setStatus(problem.message); return }
    const record: CoreLoopRecord = { ...draft, id: crypto.randomUUID(), createdAt: new Date().toISOString() }
    setRecords(current => [record, ...current])
    setStatus('核心循环已保存。闭环结构是一条待测试规则假设，不代表循环有趣或有效。')
  }

  const exportPackage = () => {
    downloadJson(`${draft.projectName.trim() || '桌游项目'}-${draft.version.trim() || '核心循环'}-核心循环画布.json`, {
      schema_version: 1,
      method: 'core-loop-canvas',
      local_first: true,
      no_loop_quality_score: true,
      no_optimal_mechanic_recommendation: true,
      no_player_experience_claim: true,
      no_silent_intent_inference: true,
      evidence_boundary: '画布只描述当前版本的一条规则作用链；真实玩家是否看见选项、使用反馈、承担代价并形成目标行为，必须在相应实体与社交语境中测试。',
      draft,
      current_loop_statement: loopStatement,
      saved_records: records,
      exported_at: new Date().toISOString(),
    })
    setStatus('核心循环包已导出；文件不证明循环质量、最佳机制或玩家体验。')
  }

  const continueToPrototype = () => {
    const problem = validateDraft(draft)
    if (problem) { setStep(problem.step); setStatus(`继续裁剪原型前：${problem.message}`); return }
    setStatus('循环字段已齐全；下一步只裁出能重复这条决定并看见后果的原型。')
    onContinue?.()
  }

  const clearDraft = () => {
    if (!clearArmed) {
      setClearArmed(true)
      setStatus('再次点击“确认清空草稿”；已保存的核心循环不会删除。')
      return
    }
    setDraft(createEmptyDraft())
    setStep('handoff')
    setClearArmed(false)
    setStatus('草稿已清空；已保存记录仍在当前浏览器。')
  }

  return <section className="tool-surface core-loop-tool">
    <div className="core-loop-heading"><div><h2>核心循环画布</h2><p className="tool-intro">把体验意图接成一次会改变下一次决定的短循环。</p></div><p className="core-loop-autosave" role="status">草稿自动保存在当前浏览器<br /><small>{records.length} 条核心循环记录</small></p></div>
    <nav className="core-loop-steps" aria-label="核心循环画布步骤">
      {steps.map(item => <button key={item.id} type="button" className={step === item.id ? 'is-active' : ''} aria-pressed={step === item.id} onClick={() => setStep(item.id)}><span>{item.number}</span>{item.label}</button>)}
    </nav>
    <p className="core-loop-note">{steps.find(item => item.id === step)?.note}</p>

    <form className="core-loop-layout" onSubmit={saveRecord}>
      <div className="core-loop-editor">
        {step === 'handoff' && <section aria-labelledby="core-handoff-title"><div className="core-loop-section-heading"><div><h3 id="core-handoff-title">承接的体验意图</h3><p className="section-copy">导入只复制原字段并标记来源，不把预测变成机制结论。</p></div><button className="text-action core-loop-import" type="button" onClick={importIntent}>导入最近体验意图</button></div>
          <div className="core-loop-source" aria-label="承接的只读体验意图"><strong>{draft.sourceHypothesis ? '已承接来源（只读）' : '尚未承接来源'}</strong><p>{draft.sourceHypothesis || '可以导入最近体验意图；没有记录时仍可手动完成本画布。'}</p>{draft.sourcePredictedBehavior && <small>原预测：{draft.sourcePredictedBehavior}</small>}</div>
          <div className="core-loop-pair"><label><span>游戏/项目 *</span><input value={draft.projectName} onChange={event => update('projectName', event.target.value)} /></label><label><span>当前版本 *</span><input value={draft.version} onChange={event => update('version', event.target.value)} placeholder="v0.2" /></label></div>
          <label><span>目标玩家与游玩语境 *</span><textarea value={draft.playerContext} onChange={event => update('playerContext', event.target.value)} /></label>
          <label><span>要接入规则的重复决定 *</span><textarea value={draft.repeatedDecision} onChange={event => update('repeatedDecision', event.target.value)} placeholder="在立即交货与保留货物前往更远港口之间决定" /></label>
          <div className="core-loop-pair"><label><span>预计桌面行为 *</span><textarea value={draft.predictedBehavior} onChange={event => update('predictedBehavior', event.target.value)} /></label><label><span>会反驳预测的现象 *</span><textarea value={draft.disconfirmingSignal} onChange={event => update('disconfirmingSignal', event.target.value)} /></label></div>
          <p className="core-loop-boundary">承接意图不是锁定方案。若规则实现迫使你改变原决定或预测，要保存新版本而不是覆盖来源。</p>
        </section>}

        {step === 'input' && <section aria-labelledby="core-input-title"><h3 id="core-input-title">信息与选择</h3><p className="section-copy">写一个决定时刻，不列设计者事后知道的全部规则树。</p>
          <label><span>做决定时，玩家当前看见/知道什么 *</span><textarea value={draft.currentInformation} onChange={event => update('currentInformation', event.target.value)} placeholder="公开港口需求、自己的三格货舱、对手已占航线" /></label>
          <label><span>玩家眼前想推进或避免什么 *</span><textarea value={draft.immediateGoal} onChange={event => update('immediateGoal', event.target.value)} placeholder="腾出货舱，同时不要放弃下一港口的高需求机会" /></label>
          <label><span>玩家当时认为可行的选项 *</span><textarea value={draft.viableOptions} onChange={event => update('viableOptions', event.target.value)} placeholder="立即交货、保留货物继续航行、丢弃一件低价值货物" /></label>
          <label><span>这些选项为什么会因当前状态而不同 *</span><textarea value={draft.optionDifference} onChange={event => update('optionDifference', event.target.value)} placeholder="交货腾空间但失去未来溢价；保留占空间且航线可能被抢" /></label>
          <p className="core-loop-boundary">选项数量不是选择质量。若某项在所有当前状态都显然更好，先记录这个反例。</p>
        </section>}

        {step === 'commitment' && <section aria-labelledby="core-commitment-title"><h3 id="core-commitment-title">代价与承诺</h3><p className="section-copy">代价不只是不足的资源，也可以是公开信息、位置、权限、关系或未来机会。</p>
          <label><span>玩家选择后具体执行什么 *</span><textarea value={draft.resolvedAction} onChange={event => update('resolvedAction', event.target.value)} placeholder="把选中的货物放入当前港口，或把它留在有限货舱继续航行" /></label>
          <label><span>为这个行动支付/放弃/暴露什么 *</span><textarea value={draft.cost} onChange={event => update('cost', event.target.value)} placeholder="支付行动点；保留货物会占用一格且公开目的地" /></label>
          <label><span>何时锁定，能否撤回或回应 *</span><textarea value={draft.commitment} onChange={event => update('commitment', event.target.value)} placeholder="选定航线并移动标记后锁定；对手可在下一行动抢占港口" /></label>
          <p className="core-loop-boundary">“不能什么都要”只是压力描述；这里要写规则怎样结算失去的机会。</p>
        </section>}

        {step === 'state' && <section aria-labelledby="core-state-title"><h3 id="core-state-title">状态与反馈设计</h3><p className="section-copy">至少写一个可观察状态变化，以及它如何改变下一次可选行动或评价标准。</p>
          <label><span>行动后什么状态改变 *</span><textarea value={draft.stateChange} onChange={event => update('stateChange', event.target.value)} placeholder="货舱占用、港口需求、航线位置与即时得分同时更新" /></label>
          <label><span>谁能看见变化 *</span><textarea value={draft.visibleTo} onChange={event => update('visibleTo', event.target.value)} placeholder="自己的货舱私有；需求、航线和得分对所有玩家公开" /></label>
          <label><span>什么时机/怎样让玩家获得反馈 *</span><textarea value={draft.feedbackTiming} onChange={event => update('feedbackTiming', event.target.value)} placeholder="行动结算后立即移动标记并更新港口牌；不靠主持人口头补充" /></label>
          <label><span>反馈怎样成为下一次决定的输入 *</span><textarea value={draft.feedbackToNextInput} onChange={event => update('feedbackToNextInput', event.target.value)} placeholder="新的可用港口和剩余货舱改变下一次交货/保留的可行性" /></label>
          <label><span>这条作用路径影响谁 *</span><textarea value={draft.effectPath} onChange={event => update('effectPath', event.target.value)} placeholder="当前玩家失去货舱；对手看见航线与需求变化后可改道或抢占" /></label>
          <p className="core-loop-boundary">反馈可见不等于被理解；原型中仍要观察玩家实际读取了什么。</p>
        </section>}

        {step === 'repeat' && <section aria-labelledby="core-repeat-title"><h3 id="core-repeat-title">重复、出口与原型交接</h3><p className="section-copy">让反馈接回下一次决定，同时写出循环何时中断或换层。</p>
          <div className="core-loop-pair"><label><span>反馈产生的下一次输入 *</span><textarea value={draft.nextInput} onChange={event => update('nextInput', event.target.value)} placeholder="更新后的需求、货舱空位与对手航线" /></label><label><span>下一次重复的决定 *</span><textarea value={draft.nextDecision} onChange={event => update('nextDecision', event.target.value)} placeholder="再次选择立即交货、保留或改道" /></label></div>
          <label><span>循环何时停止、换层或进入终局 *</span><textarea value={draft.exitCondition} onChange={event => update('exitCondition', event.target.value)} placeholder="第三次交付后进入终局；港口耗尽时改为返航循环" /></label>
          <div className="core-loop-pair"><label><span>这轮保持不变 *</span><textarea value={draft.invariant} onChange={event => update('invariant', event.target.value)} placeholder="港口布局、交付得分与胜利条件" /></label><label><span>这轮只改变一个轴 *</span><textarea value={draft.changedAxis} onChange={event => update('changedAxis', event.target.value)} placeholder="只改变货舱锁定与反馈时机" /></label></div>
          <label><span>交给原型范围的第一条问题 *</span><textarea value={draft.prototypeQuestion} onChange={event => update('prototypeQuestion', event.target.value)} placeholder="玩家是否会利用公开需求和剩余货舱，主动保留一次货物？" /></label>
          <p className="core-loop-boundary">闭环结构不是质量分；下一步只制作足以重复这条决定、看见一次后果并触发出口的切片。</p>
        </section>}
      </div>

      <aside className="core-loop-summary" aria-label="当前核心循环"><header><span>当前核心循环</span><h3>{loopStatement || '完成信息、选择、代价、状态、反馈与下一输入后，这里会形成一条短循环。'}</h3><p>{draft.projectName || '未写项目'} · {draft.version || '未写版本'}</p></header>
        <div className="core-loop-diagram">
          <svg aria-hidden="true" viewBox="0 0 360 410" preserveAspectRatio="none"><defs><marker id="core-loop-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3 z" /></marker></defs><path d="M221 48 C270 52 300 78 306 104" /><path d="M306 192 L306 248" /><path d="M270 332 C250 362 224 374 215 374" /><path d="M145 374 C112 371 90 350 86 334" /><path d="M54 250 L54 194" /><path d="M63 104 C70 75 105 53 139 48" /></svg>
          <div className="core-loop-node is-info"><strong>当前信息</strong><span>{draft.currentInformation || '玩家此刻看见与知道什么'}</span></div>
          <div className="core-loop-node is-choice"><strong>玩家选择</strong><span>{draft.viableOptions || '玩家认为可行的选项'}</span></div>
          <div className="core-loop-node is-cost"><strong>代价/承诺</strong><span>{draft.cost || '行动支付或放弃什么'}</span></div>
          <div className="core-loop-node is-state"><strong>状态变化</strong><span>{draft.stateChange || '行动导致什么改变'}</span></div>
          <div className="core-loop-node is-feedback"><strong>可见反馈</strong><span>{draft.feedbackToNextInput || '后果怎样被玩家读取'}</span></div>
          <div className="core-loop-next"><strong>下一次输入</strong><span>{draft.nextInput || '反馈怎样改变下一次决定'}</span></div>
        </div>
        <section className="core-loop-exit"><h4>循环出口</h4><p>{draft.exitCondition || '在什么条件下结束当前循环，或进入新的循环/阶段？'}</p></section>
        <p className="core-loop-summary-boundary">不生成循环质量分、最优机制或玩家体验结论。</p>
      </aside>

      <footer className="core-loop-actions"><button className="primary-button" type="submit">保存核心循环</button><button className="text-action" type="button" onClick={exportPackage}>导出 JSON →</button><button className="text-action" type="button" onClick={continueToPrototype}>继续裁剪原型 →</button><button className={clearArmed ? 'core-loop-clear is-armed' : 'core-loop-clear'} type="button" onClick={clearDraft}>{clearArmed ? '确认清空草稿' : '清空草稿'}</button><p>只保存在当前浏览器；闭环记录不是机制处方或体验证明。</p><div className="form-status" aria-live="polite">{status}</div></footer>
    </form>
  </section>
}
