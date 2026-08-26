import { FormEvent, useEffect, useMemo, useState } from 'react'
import { CORE_LOOP_STORAGE_KEY, PROTOTYPE_SCOPE_STORAGE_KEY } from './storage-keys'

type ScopeStep = 'question' | 'filters' | 'fidelity' | 'slice' | 'build'
type FilterDimension = '功能/规则' | '数据/状态' | '互动/决定' | '空间/身体' | '外观/信息'
type FidelityLevel = '替代' | '近似' | '必须真实'
type FidelityDimension = 'material' | 'resolution' | 'scope'

type FidelityChoice = { level: FidelityLevel; reason: string }
type ScopeDraft = {
  projectName: string
  version: string
  sourceCoreLoopId: string
  sourceCoreLoopCreatedAt: string
  sourceCoreLoopStatement: string
  question: string
  targetExperience: string
  currentRisk: string
  disconfirmingSignal: string
  nonGoals: string
  selectedFilters: FilterDimension[]
  filterReasons: Record<FilterDimension, string>
  requiredFunctions: string
  fidelity: Record<FidelityDimension, FidelityChoice>
  proxyOperation: string
  protectedDecisions: string
  playerConfiguration: string
  startState: string
  repetition: string
  stopTrigger: string
  outOfScope: string
  materials: string
  buildTimebox: string
  rebuildSignal: string
  nextPlaytest: string
}
type ScopeRecord = ScopeDraft & { id: string; createdAt: string }
type ScopeStore = { schemaVersion: 1; draft: ScopeDraft; records: ScopeRecord[] }

const filterDimensions: FilterDimension[] = ['功能/规则', '数据/状态', '互动/决定', '空间/身体', '外观/信息']
const fidelityDimensions: { id: FidelityDimension; label: string; prompt: string }[] = [
  { id: 'material', label: '材料', prompt: '纸、方块、真实尺寸组件或数字界面为什么足够？' },
  { id: 'resolution', label: '分辨率', prompt: '数值、文字、图标或反馈要精确到什么程度？' },
  { id: 'scope', label: '范围', prompt: '哪些玩家、规则、内容与状态必须进入这一版？' },
]
const steps: { id: ScopeStep; number: string; label: string; note: string }[] = [
  { id: 'question', number: '01', label: '验证问题', note: '先写它可能怎样被推翻' },
  { id: 'filters', number: '02', label: '证据过滤', note: '这一轮最多盯住两个性质' },
  { id: 'fidelity', number: '03', label: '保真度配置', note: '把注意力留给玩家，而不是原型' },
  { id: 'slice', number: '04', label: '可玩切片', note: '不必完整胜负，但要看见后果' },
  { id: 'build', number: '05', label: '开工门槛', note: '写下何时重做，而不是继续加内容' },
]

const createEmptyDraft = (): ScopeDraft => ({
  projectName: '', version: '', sourceCoreLoopId: '', sourceCoreLoopCreatedAt: '', sourceCoreLoopStatement: '', question: '', targetExperience: '', currentRisk: '', disconfirmingSignal: '', nonGoals: '',
  selectedFilters: [], filterReasons: { '功能/规则': '', '数据/状态': '', '互动/决定': '', '空间/身体': '', '外观/信息': '' },
  requiredFunctions: '',
  fidelity: {
    material: { level: '近似', reason: '' },
    resolution: { level: '替代', reason: '' },
    scope: { level: '必须真实', reason: '' },
  },
  proxyOperation: '', protectedDecisions: '', playerConfiguration: '', startState: '', repetition: '', stopTrigger: '', outOfScope: '',
  materials: '', buildTimebox: '', rebuildSignal: '', nextPlaytest: '',
})

function readStore(): ScopeStore {
  const fallback: ScopeStore = { schemaVersion: 1, draft: createEmptyDraft(), records: [] }
  try {
    const stored = JSON.parse(localStorage.getItem(PROTOTYPE_SCOPE_STORAGE_KEY) || 'null')
    if (!stored || stored.schemaVersion !== 1) return fallback
    return {
      schemaVersion: 1,
      draft: {
        ...fallback.draft,
        ...stored.draft,
        filterReasons: { ...fallback.draft.filterReasons, ...stored.draft?.filterReasons },
        fidelity: { ...fallback.draft.fidelity, ...stored.draft?.fidelity },
        selectedFilters: Array.isArray(stored.draft?.selectedFilters) ? stored.draft.selectedFilters.filter((item: string) => filterDimensions.includes(item as FilterDimension)).slice(0, 2) : [],
      },
      records: Array.isArray(stored.records) ? stored.records : [],
    }
  } catch { return fallback }
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

function readLatestCoreLoop() {
  try {
    const stored = JSON.parse(localStorage.getItem(CORE_LOOP_STORAGE_KEY) || 'null')
    if (!stored || stored.schemaVersion !== 1) return null
    const source = (Array.isArray(stored.records) && stored.records[0]) || stored.draft
    if (!source || ![source.prototypeQuestion, source.repeatedDecision, source.stateChange].some((value: string) => value?.trim())) return null
    return source
  } catch { return null }
}

function validateScopeDraft(draft: ScopeDraft): { step: ScopeStep; message: string } | null {
  if (!draft.question.trim() || !draft.disconfirmingSignal.trim() || !draft.nonGoals.trim()) return { step: 'question', message: '请补齐验证问题、推翻信号和本轮非目标。' }
  if (!draft.selectedFilters.length || draft.selectedFilters.some(item => !draft.filterReasons[item].trim()) || !draft.requiredFunctions.trim()) return { step: 'filters', message: '请选择一至两个过滤维度，分别写理由，并列出原型必须承担的功能。' }
  if (fidelityDimensions.some(item => !draft.fidelity[item.id].reason.trim())) return { step: 'fidelity', message: '材料、分辨率和范围都要写一句选择理由。' }
  if (![draft.playerConfiguration, draft.startState, draft.repetition, draft.stopTrigger, draft.outOfScope].every(value => value.trim())) return { step: 'slice', message: '可玩切片还缺玩家配置、起始状态、重复条件、停止触发或明确不做。' }
  if (![draft.materials, draft.rebuildSignal, draft.nextPlaytest].every(value => value.trim())) return { step: 'build', message: '开工前请补齐材料清单、重做信号和下一次测试。' }
  return null
}

function SegmentedChoice({ value, onChange, label }: { value: FidelityLevel; onChange: (value: FidelityLevel) => void; label: string }) {
  const values: FidelityLevel[] = ['替代', '近似', '必须真实']
  return <div className="scope-segmented" role="group" aria-label={`${label}保真度`}>
    {values.map(item => <button key={item} type="button" aria-pressed={value === item} className={value === item ? 'is-active' : ''} onClick={() => onChange(item)}>{item}</button>)}
  </div>
}

export function PrototypeScopeCutter({ onContinue }: { onContinue?: () => void }) {
  const [initial] = useState(readStore)
  const [draft, setDraft] = useState(initial.draft)
  const [records, setRecords] = useState(initial.records)
  const [step, setStep] = useState<ScopeStep>('question')
  const [status, setStatus] = useState('草稿会自动保存在当前浏览器。')
  const [clearArmed, setClearArmed] = useState(false)

  useEffect(() => {
    localStorage.setItem(PROTOTYPE_SCOPE_STORAGE_KEY, JSON.stringify({ schemaVersion: 1, draft, records }))
  }, [draft, records])

  const update = <K extends keyof ScopeDraft>(key: K, value: ScopeDraft[K]) => {
    setDraft(current => ({ ...current, [key]: value }))
    setStatus('草稿已在当前浏览器更新。')
    setClearArmed(false)
  }

  const toggleFilter = (dimension: FilterDimension) => {
    if (draft.selectedFilters.includes(dimension)) {
      update('selectedFilters', draft.selectedFilters.filter(item => item !== dimension))
      return
    }
    if (draft.selectedFilters.length >= 2) {
      setStatus('这一轮最多选择两个主要过滤维度；先移除一个，或把它写进非目标。')
      return
    }
    update('selectedFilters', [...draft.selectedFilters, dimension])
  }

  const importCoreLoop = () => {
    const source = readLatestCoreLoop()
    if (!source) {
      setStatus('没有找到可承接的核心循环；可以先完成核心循环画布，或在本页手动填写。')
      return
    }
    const statement = `在${source.currentInformation || '当前信息'}下，玩家从${source.viableOptions || '可行选项'}中选择；系统改变${source.stateChange || '状态'}，并让${source.feedbackToNextInput || '反馈'}成为下一次决定的输入。`
    setDraft(current => ({
      ...current,
      projectName: source.projectName?.trim() || current.projectName,
      version: source.version?.trim() || current.version,
      sourceCoreLoopId: source.id || 'core-loop-draft',
      sourceCoreLoopCreatedAt: source.createdAt || '',
      sourceCoreLoopStatement: statement,
      question: source.prototypeQuestion?.trim() || current.question,
      targetExperience: source.predictedBehavior?.trim() || current.targetExperience,
      disconfirmingSignal: source.disconfirmingSignal?.trim() || current.disconfirmingSignal,
      requiredFunctions: [source.viableOptions, source.stateChange, source.feedbackToNextInput].filter(Boolean).join('；') || current.requiredFunctions,
      protectedDecisions: source.repeatedDecision?.trim() || current.protectedDecisions,
      startState: source.currentInformation?.trim() || current.startState,
      repetition: source.nextDecision?.trim() || current.repetition,
      stopTrigger: source.exitCondition?.trim() || current.stopTrigger,
    }))
    setStatus('已导入最近核心循环的原字段；材料、范围和保真度仍需按本轮问题选择。')
    setClearArmed(false)
  }

  const updateFilterReason = (dimension: FilterDimension, reason: string) => {
    update('filterReasons', { ...draft.filterReasons, [dimension]: reason })
  }

  const updateFidelity = (dimension: FidelityDimension, patch: Partial<FidelityChoice>) => {
    update('fidelity', { ...draft.fidelity, [dimension]: { ...draft.fidelity[dimension], ...patch } })
  }

  const requiredAuthenticity = useMemo(() => fidelityDimensions
    .filter(item => draft.fidelity[item.id].level === '必须真实')
    .map(item => `${item.label}：${draft.fidelity[item.id].reason || '尚未写理由'}`), [draft.fidelity])
  const replaceable = useMemo(() => fidelityDimensions
    .filter(item => draft.fidelity[item.id].level !== '必须真实')
    .map(item => `${item.label}（${draft.fidelity[item.id].level}）：${draft.fidelity[item.id].reason || '尚未写理由'}`), [draft.fidelity])

  const saveSnapshot = (event: FormEvent) => {
    event.preventDefault()
    const problem = validateScopeDraft(draft)
    if (problem) { setStep(problem.step); setStatus(`保存快照前${problem.message}`); return }
    const record: ScopeRecord = { ...draft, id: crypto.randomUUID(), createdAt: new Date().toISOString() }
    setRecords(current => [record, ...current])
    setStatus('原型范围快照已保存。它记录的是计划边界，不代表本轮已经验证。')
  }

  const exportPackage = () => {
    downloadJson(`${draft.projectName.trim() || '桌游项目'}-${draft.version.trim() || '原型范围'}-裁剪单.json`, {
      schema_version: 1,
      method: 'prototype-scope-cutter',
      local_first: true,
      no_fidelity_score: true,
      no_minimum_content_recommendation: true,
      evidence_boundary: '记录只适用于当前版本、问题、玩家配置、媒介与可玩切片；跨媒介或完整局结论需要另行验证。',
      draft,
      saved_records: records,
      exported_at: new Date().toISOString(),
    })
    setStatus('范围包已导出；文件不代表保真度、成熟度或验证认证。')
  }

  const clearDraft = () => {
    if (!clearArmed) {
      setClearArmed(true)
      setStatus('再次点击“确认清空草稿”；已保存的范围快照不会删除。')
      return
    }
    setDraft(createEmptyDraft())
    setStep('question')
    setClearArmed(false)
    setStatus('草稿已清空；已保存快照仍在当前浏览器。')
  }

  const continueToTestPlan = () => {
    const problem = validateScopeDraft(draft)
    if (problem) { setStep(problem.step); setStatus(`继续到测试计划前${problem.message}`); return }
    setStatus('原型范围字段已齐全；下一步把一个主问题接到观察、主持与停止条件。')
    onContinue?.()
  }

  return <section className="tool-surface prototype-scope-tool">
    <div className="scope-heading-row"><div><h2>只做这一轮问题需要的原型</h2><p className="tool-intro">保留要观察的性质，明确哪些先用替代物。</p></div><p className="scope-autosave" role="status">草稿自动保存在当前浏览器<br /><small>{records.length} 条范围快照</small></p></div>
    <nav className="scope-steps" aria-label="原型范围裁剪步骤">
      {steps.map(item => <button key={item.id} type="button" className={step === item.id ? 'is-active' : ''} aria-pressed={step === item.id} onClick={() => setStep(item.id)}><span>{item.number}</span>{item.label}</button>)}
    </nav>
    <p className="scope-hand-note">{steps.find(item => item.id === step)?.note}</p>

    <form className="scope-layout" onSubmit={saveSnapshot}>
      <div className="scope-editor">
        {step === 'question' && <section aria-labelledby="scope-question-title"><div className="scope-question-heading"><div><h3 id="scope-question-title">验证问题</h3><p className="section-copy">问题描述要让一次观察能够支持、反驳或迫使你缩小说法；同时写下这轮明确不回答什么。</p></div><button className="text-action" type="button" onClick={importCoreLoop}>导入最近核心循环</button></div>
          {draft.sourceCoreLoopStatement && <div className="scope-source-loop"><strong>承接的核心循环（只读）</strong><p>{draft.sourceCoreLoopStatement}</p></div>}
          <div className="scope-pair"><label><span>游戏/项目</span><input value={draft.projectName} onChange={event => update('projectName', event.target.value)} /></label><label><span>当前版本</span><input value={draft.version} onChange={event => update('version', event.target.value)} placeholder="例如 v0.3" /></label></div>
          <label><span>这一轮要回答的问题 *</span><textarea value={draft.question} onChange={event => update('question', event.target.value)} placeholder="玩家会为了下一港口主动保留货物吗？" /></label>
          <div className="scope-pair"><label><span>目标体验或行为</span><textarea value={draft.targetExperience} onChange={event => update('targetExperience', event.target.value)} /></label><label><span>当前最大风险</span><textarea value={draft.currentRisk} onChange={event => update('currentRisk', event.target.value)} /></label></div>
          <label><span>什么观察会推翻当前想法？ *</span><textarea value={draft.disconfirmingSignal} onChange={event => update('disconfirmingSignal', event.target.value)} placeholder="即使看见下一港口需求，玩家仍从不保留货物。" /></label>
          <label><span>本轮明确不回答 *</span><textarea value={draft.nonGoals} onChange={event => update('nonGoals', event.target.value)} placeholder="不判断四人平衡、最终美术、完整时长或终局分数。" /></label>
        </section>}

        {step === 'filters' && <section aria-labelledby="scope-filter-title"><h3 id="scope-filter-title">证据过滤</h3><p className="section-copy">选择最多两个必须让测试者看见或操作的性质。其余维度可以存在，但不应抢走本轮解释权。</p>
          <fieldset className="scope-filter-choices"><legend>这一轮主要观察什么？ *</legend>{filterDimensions.map(dimension => <button key={dimension} type="button" aria-pressed={draft.selectedFilters.includes(dimension)} className={draft.selectedFilters.includes(dimension) ? 'is-active' : ''} onClick={() => toggleFilter(dimension)}>{dimension}</button>)}</fieldset>
          <div className="scope-filter-reasons">{draft.selectedFilters.map((dimension, index) => <label key={dimension}><span>{String(index + 1).padStart(2, '0')} · {dimension}为什么必须出现？</span><textarea value={draft.filterReasons[dimension]} onChange={event => updateFilterReason(dimension, event.target.value)} /></label>)}</div>
          <label><span>原型必须承担的功能 *</span><textarea value={draft.requiredFunctions} onChange={event => update('requiredFunctions', event.target.value)} placeholder="公开港口需求、私人货物、有限货舱、两次可比较的交付反馈。" /></label>
          <p className="scope-inline-boundary">不是本轮证据的系统可以由主持人代运转；但玩家的目标输入、决定和反馈不能被代做。</p>
        </section>}

        {step === 'fidelity' && <section aria-labelledby="scope-fidelity-title"><h3 id="scope-fidelity-title">保真度配置</h3><p className="section-copy">分别配置材料、分辨率和范围。这里没有总分；“必须真实”只说明它与本轮证据直接相关。</p>
          <div className="scope-fidelity-table"><div className="scope-fidelity-head"><span>维度</span><span>选择</span><span>理由（本轮只需一句话）</span></div>{fidelityDimensions.map(item => <div className="scope-fidelity-row" key={item.id}><strong>{item.label}</strong><SegmentedChoice label={item.label} value={draft.fidelity[item.id].level} onChange={level => updateFidelity(item.id, { level })} /><textarea aria-label={`${item.label}选择理由`} value={draft.fidelity[item.id].reason} onChange={event => updateFidelity(item.id, { reason: event.target.value })} placeholder={item.prompt} /></div>)}</div>
          <p className="scope-inline-boundary">如果这不是本轮证据，可以让主持人代为运转；必须记录代理是否给出提示、改变节奏或看见秘密。</p>
          <div className="scope-pair"><label><span>由谁代运转什么？</span><textarea value={draft.proxyOperation} onChange={event => update('proxyOperation', event.target.value)} placeholder="主持人用表格结算供需，不解释策略。" /></label><label><span>绝不能替玩家做的决定</span><textarea value={draft.protectedDecisions} onChange={event => update('protectedDecisions', event.target.value)} placeholder="装什么货、走哪条航线、何时交付。" /></label></div>
        </section>}

        {step === 'slice' && <section aria-labelledby="scope-slice-title"><h3 id="scope-slice-title">可玩切片</h3><p className="section-copy">切片要让目标决定出现并看见一次后果。不要为了完整胜负，把与本轮问题无关的系统重新带回来。</p>
          <div className="scope-pair"><label><span>玩家配置 *</span><input value={draft.playerConfiguration} onChange={event => update('playerConfiguration', event.target.value)} placeholder="2 人；各有 3 个货舱格" /></label><label><span>起始状态 *</span><input value={draft.startState} onChange={event => update('startState', event.target.value)} placeholder="第 1 回合交货前" /></label></div>
          <div className="scope-pair"><label><span>关键决定怎样重复？ *</span><textarea value={draft.repetition} onChange={event => update('repetition', event.target.value)} placeholder="每人至少做两次装货/保留决定。" /></label><label><span>停止触发 *</span><textarea value={draft.stopTrigger} onChange={event => update('stopTrigger', event.target.value)} placeholder="第二次交货结算完成后停止。" /></label></div>
          <label><span>明确不做 *</span><textarea value={draft.outOfScope} onChange={event => update('outOfScope', event.target.value)} placeholder="事件牌、最终计分、四人模式、正式插画、完整规则书。" /></label>
        </section>}

        {step === 'build' && <section aria-labelledby="scope-build-title"><h3 id="scope-build-title">开工门槛</h3><p className="section-copy">把范围翻译成今天能制作的材料和下一次测试。时间盒由团队自己设定，不是本站推荐值。</p>
          <label><span>材料与数量 *</span><textarea value={draft.materials} onChange={event => update('materials', event.target.value)} placeholder="6 张便签港口、12 个方块货物、2 条纸质货舱、1 张供需结算表。" /></label>
          <label><span>制作时间盒（可选）</span><input value={draft.buildTimebox} onChange={event => update('buildTimebox', event.target.value)} placeholder="例如：今天 45 分钟；这是团队约束，不是建议。" /></label>
          <label><span>何时重做表示或缩小问题？ *</span><textarea value={draft.rebuildSignal} onChange={event => update('rebuildSignal', event.target.value)} placeholder="若主持结算占据多数时间，或玩家因代理物误认而改变选择，就先重做状态表示。" /></label>
          <label><span>下一次测试 *</span><textarea value={draft.nextPlaytest} onChange={event => update('nextPlaytest', event.target.value)} placeholder="用 2 人引导测试记录两次保留决定；随后安排实体空间复核。" /></label>
        </section>}
      </div>

      <aside className="scope-summary" aria-label="本轮原型边界"><header><span>本轮原型边界</span><h3>{draft.question || '尚未写验证问题'}</h3><p>{draft.projectName || '未写项目'} · {draft.version || '未写版本'}</p></header>
        <dl><div><dt>证据过滤</dt><dd>{draft.selectedFilters.length ? draft.selectedFilters.join('、') : '尚未选择一至两个主要维度。'}</dd></div><div><dt>必须保留</dt><dd>{requiredAuthenticity.length ? requiredAuthenticity.join('；') : '尚未把任何表现维度标为必须真实。'}</dd></div><div><dt>可以替代</dt><dd>{replaceable.join('；')}</dd></div><div><dt>停止条件</dt><dd>{draft.stopTrigger || '尚未写可观察的停止触发。'}</dd></div><div><dt>重做信号</dt><dd>{draft.rebuildSignal || '尚未写代理或表示何时开始遮蔽证据。'}</dd></div></dl>
        <section><h4>可玩切片</h4><p>{draft.playerConfiguration || '未写玩家配置'} · {draft.startState || '未写起始状态'}</p><small>{draft.repetition || '尚未写关键决定怎样重复。'}</small></section>
        <section><h4>代理边界</h4><p>{draft.proxyOperation || '尚未记录代理运转。'}</p><small>保留决定：{draft.protectedDecisions || '尚未写不可代做的玩家决定。'}</small></section>
        <p className="scope-summary-boundary">不生成保真度总分，也不推荐最少内容量。证据只适用于当前版本、问题、媒介和切片。</p>
      </aside>

      <footer className="scope-actions"><button className="primary-button" type="submit">保存范围快照</button><button className="text-action" type="button" onClick={exportPackage}>导出 JSON →</button><button className="text-action" type="button" onClick={continueToTestPlan}>继续到测试计划 →</button><button className={clearArmed ? 'scope-clear is-armed' : 'scope-clear'} type="button" onClick={clearDraft}>{clearArmed ? '确认清空草稿' : '清空草稿'}</button><p>数据只保存在当前浏览器；快照与导出都不代表已验证。</p><div className="form-status" aria-live="polite">{status}</div></footer>
    </form>
  </section>
}
