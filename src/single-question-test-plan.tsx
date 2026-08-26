import { FormEvent, useEffect, useMemo, useRef, useState } from 'react'
import { PROTOTYPE_SCOPE_STORAGE_KEY, TEST_PLAN_DRAFT_STORAGE_KEY, TEST_PLAN_STORAGE_KEY } from './storage-keys'

type PlanStep = 'scope' | 'observation' | 'participants' | 'finish'
type TestType = '自测' | '快速测试' | '引导测试' | '极限测试' | '盲测'
type TestMedium = '实体' | '线上' | '混合'
type ProjectContext = { id: string; title: string; version: string; currentQuestion: string }

type PlanDraft = {
  projectId: string
  projectName: string
  version: string
  sourceScopeId: string
  sourceScopeCreatedAt: string
  sourceScopeSummary: string
  primaryQuestion: string
  predictedBehavior: string
  disconfirmingSignal: string
  observationEvent: string
  observationFields: string
  repetitionTarget: string
  startState: string
  stopTrigger: string
  invariant: string
  changedAxis: string
  participantProfile: string
  playerConfiguration: string
  testType: TestType
  medium: TestMedium
  facilitatorAllowed: string
  facilitatorForbidden: string
  captureAndConsent: string
  safetyStop: string
  postQuestions: [string, string, string]
  decisionRule: string
  parkingLot: string
}
type PlanRecord = PlanDraft & { id: string; createdAt: string }

const steps: { id: PlanStep; number: string; label: string; note: string }[] = [
  { id: 'scope', number: '01', label: '承接范围', note: '只保留一个主问题；来源不是自动结论。' },
  { id: 'observation', number: '02', label: '观察协议', note: '先写局中要看见什么，再准备局后追问。' },
  { id: 'participants', number: '03', label: '参与与主持', note: '测试者、媒介和帮助都会改变证据边界。' },
  { id: 'finish', number: '04', label: '结束与追问', note: '反驳、未定和意外都要有下一步，不做通过评分。' },
]

const emptyDraft = (project: ProjectContext): PlanDraft => ({
  projectId: project.id,
  projectName: project.title,
  version: project.version,
  sourceScopeId: '',
  sourceScopeCreatedAt: '',
  sourceScopeSummary: '',
  primaryQuestion: project.currentQuestion,
  predictedBehavior: '',
  disconfirmingSignal: '',
  observationEvent: '',
  observationFields: '阶段/时间点；玩家动作；当时可见状态；系统结果；主持介入',
  repetitionTarget: '',
  startState: '',
  stopTrigger: '',
  invariant: '',
  changedAxis: '',
  participantProfile: '',
  playerConfiguration: '',
  testType: '引导测试',
  medium: '实体',
  facilitatorAllowed: '',
  facilitatorForbidden: '',
  captureAndConsent: '',
  safetyStop: '',
  postQuestions: ['', '', ''],
  decisionRule: '',
  parkingLot: '',
})

function readDraft(project: ProjectContext) {
  const fallback = emptyDraft(project)
  try {
    const stored = JSON.parse(localStorage.getItem(TEST_PLAN_DRAFT_STORAGE_KEY) || 'null')
    if (!stored || stored.schemaVersion !== 1) return fallback
    return {
      ...fallback,
      ...stored.draft,
      projectId: project.id,
      postQuestions: Array.isArray(stored.draft?.postQuestions) ? [stored.draft.postQuestions[0] || '', stored.draft.postQuestions[1] || '', stored.draft.postQuestions[2] || ''] : fallback.postQuestions,
    } as PlanDraft
  } catch { return fallback }
}

function readRecords(): PlanRecord[] {
  try {
    const stored = JSON.parse(localStorage.getItem(TEST_PLAN_STORAGE_KEY) || '[]')
    return Array.isArray(stored) ? stored : []
  } catch { return [] }
}

function readLatestScope() {
  try {
    const stored = JSON.parse(localStorage.getItem(PROTOTYPE_SCOPE_STORAGE_KEY) || 'null')
    if (!stored || stored.schemaVersion !== 1) return null
    const source = (Array.isArray(stored.records) && stored.records[0]) || stored.draft
    if (!source || ![source.question, source.requiredFunctions, source.stopTrigger].some((value: string) => value?.trim())) return null
    return source
  } catch { return null }
}

function validate(draft: PlanDraft): { step: PlanStep; message: string } | null {
  if (![draft.projectName, draft.version, draft.primaryQuestion, draft.predictedBehavior, draft.disconfirmingSignal].every(value => value.trim())) {
    return { step: 'scope', message: '请补齐项目、版本、唯一主问题、行为预测和反驳信号。' }
  }
  if (![draft.observationEvent, draft.observationFields, draft.repetitionTarget, draft.startState, draft.stopTrigger, draft.invariant, draft.changedAxis].every(value => value.trim())) {
    return { step: 'observation', message: '请补齐观察事件、记录字段、重复目标、起止条件和单一版本变化。' }
  }
  if (![draft.participantProfile, draft.playerConfiguration, draft.facilitatorAllowed, draft.facilitatorForbidden, draft.captureAndConsent, draft.safetyStop].every(value => value.trim())) {
    return { step: 'participants', message: '请补齐参与者、玩家配置、主持边界、记录同意和主动停止条件。' }
  }
  if (!draft.postQuestions[0].trim() || !draft.decisionRule.trim()) {
    return { step: 'finish', message: '至少准备一个开放追问，并写明得到反驳或未定证据后怎样处理。' }
  }
  return null
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

function samePlan(left: PlanRecord | undefined, right: PlanDraft) {
  if (!left) return false
  const { id: _id, createdAt: _createdAt, ...saved } = left
  return JSON.stringify(saved) === JSON.stringify(right)
}

export function SingleQuestionTestPlan({ project, onClose, onStartSession }: { project: ProjectContext; onClose: () => void; onStartSession?: () => void }) {
  const [draft, setDraft] = useState(() => readDraft(project))
  const [records, setRecords] = useState(readRecords)
  const [step, setStep] = useState<PlanStep>('scope')
  const [status, setStatus] = useState('草稿自动保存在当前浏览器。')
  const [clearArmed, setClearArmed] = useState(false)
  const closeButton = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null
    closeButton.current?.focus()
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose() }
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', closeOnEscape)
      previouslyFocused?.focus()
    }
  }, [])
  useEffect(() => {
    localStorage.setItem(TEST_PLAN_DRAFT_STORAGE_KEY, JSON.stringify({ schemaVersion: 1, draft }))
  }, [draft])
  useEffect(() => { localStorage.setItem(TEST_PLAN_STORAGE_KEY, JSON.stringify(records)) }, [records])

  const update = <K extends keyof PlanDraft>(key: K, value: PlanDraft[K]) => {
    setDraft(current => ({ ...current, [key]: value }))
    setStatus('草稿已在当前浏览器更新。')
    setClearArmed(false)
  }

  const importScope = () => {
    const source = readLatestScope()
    if (!source) {
      setStatus('没有找到可承接的原型范围；可以先完成原型范围裁剪器，或在这里手动填写。')
      return
    }
    const summary = `问题：${source.question || '未写'}；切片：${source.playerConfiguration || '未写玩家配置'}，从${source.startState || '未写起点'}开始，${source.stopTrigger || '未写停止条件'}。`
    setDraft(current => ({
      ...current,
      projectName: source.projectName?.trim() || current.projectName,
      version: source.version?.trim() || current.version,
      sourceScopeId: source.id || 'prototype-scope-draft',
      sourceScopeCreatedAt: source.createdAt || '',
      sourceScopeSummary: summary,
      primaryQuestion: source.question?.trim() || current.primaryQuestion,
      predictedBehavior: source.targetExperience?.trim() || current.predictedBehavior,
      disconfirmingSignal: source.disconfirmingSignal?.trim() || current.disconfirmingSignal,
      observationEvent: source.requiredFunctions?.trim() || current.observationEvent,
      repetitionTarget: source.repetition?.trim() || current.repetitionTarget,
      startState: source.startState?.trim() || current.startState,
      stopTrigger: source.stopTrigger?.trim() || current.stopTrigger,
      playerConfiguration: source.playerConfiguration?.trim() || current.playerConfiguration,
      parkingLot: source.outOfScope?.trim() || current.parkingLot,
    }))
    setStatus('已导入最近原型范围的原字段；参与者、主持、记录与结论规则仍需你决定。')
    setClearArmed(false)
  }

  const evidenceChain = useMemo(() => [
    { label: '问题', ready: !!draft.primaryQuestion.trim() },
    { label: '预测', ready: !!draft.predictedBehavior.trim() },
    { label: '观察', ready: !!draft.observationEvent.trim() },
    { label: '反驳/未定', ready: !!draft.disconfirmingSignal.trim() && !!draft.decisionRule.trim() },
  ], [draft])

  const savePlan = (event: FormEvent) => {
    event.preventDefault()
    const problem = validate(draft)
    if (problem) { setStep(problem.step); setStatus(problem.message); return }
    const record: PlanRecord = { ...draft, id: crypto.randomUUID(), createdAt: new Date().toISOString() }
    setRecords(current => [record, ...current])
    setStatus('单问题测试计划已保存。它记录证据边界，不代表游戏通过测试。')
  }

  const saveAndStartSession = () => {
    const problem = validate(draft)
    if (problem) { setStep(problem.step); setStatus(`开始主持前${problem.message}`); return }
    const nextRecords = samePlan(records[0], draft)
      ? records
      : [{ ...draft, id: crypto.randomUUID(), createdAt: new Date().toISOString() }, ...records]
    setRecords(nextRecords)
    localStorage.setItem(TEST_PLAN_STORAGE_KEY, JSON.stringify(nextRecords))
    setStatus(samePlan(records[0], draft) ? '已复用刚保存的同一份计划快照，正在进入现场记录。' : '已冻结一份本场计划快照，正在进入现场记录。')
    onStartSession?.()
  }

  const exportPlans = () => {
    downloadJson(`${draft.projectName.trim() || '桌游项目'}-${draft.version.trim() || '测试计划'}-单问题测试计划.json`, {
      schema_version: 2,
      method: 'single-question-playtest-plan',
      local_first: true,
      no_fun_score: true,
      no_sample_representativeness_claim: true,
      no_causal_proof: true,
      no_release_readiness_claim: true,
      no_silent_scope_inference: true,
      evidence_boundary: '计划只适用于所列版本、原型切片、玩家配置、参与者语境、媒介与主持条件；观察到预测行为不等于证明因果、总体偏好、游戏质量或发行就绪。',
      project: { id: project.id, title: draft.projectName, version: draft.version },
      draft,
      saved_records: records,
      exported_at: new Date().toISOString(),
    })
    setStatus('测试计划包已导出；文件不包含乐趣分、代表性或发行认证。')
  }

  const clearDraft = () => {
    if (!clearArmed) {
      setClearArmed(true)
      setStatus('再次点击“确认清空草稿”；已保存的测试计划不会删除。')
      return
    }
    setDraft(emptyDraft(project))
    setStep('scope')
    setClearArmed(false)
    setStatus('草稿已清空；已保存的计划仍在当前浏览器。')
  }

  return <div className="drawer-backdrop test-plan-backdrop" onMouseDown={event => { if (event.currentTarget === event.target) onClose() }}>
    <aside className="test-drawer single-question-plan" role="dialog" aria-modal="true" aria-labelledby="test-title">
      <button ref={closeButton} className="close-button" onClick={onClose} aria-label="关闭">×</button>
      <div className="plan-heading"><div><h2 id="test-title">单问题测试计划</h2><p>把一个主问题接到观察、反驳信号与停止条件。</p></div><p className="plan-autosave" role="status">草稿自动保存在当前浏览器<br /><small>{records.length} 条计划</small></p></div>
      <nav className="plan-steps" aria-label="单问题测试计划步骤">{steps.map(item => <button key={item.id} type="button" className={step === item.id ? 'is-active' : ''} aria-pressed={step === item.id} onClick={() => setStep(item.id)}><span>{item.number}</span>{item.label}</button>)}</nav>
      <p className="plan-step-note">{steps.find(item => item.id === step)?.note}</p>

      <form onSubmit={savePlan}>
        <div className="plan-editor">
          {step === 'scope' && <section aria-labelledby="plan-scope-title"><div className="plan-section-heading"><h3 id="plan-scope-title">承接的原型范围</h3><button type="button" className="text-action" onClick={importScope}>导入最近原型范围</button></div>
            <div className="plan-source" aria-label="承接的只读原型范围"><strong>{draft.sourceScopeSummary ? `${draft.projectName || '未命名项目'} · ${draft.version || '未写版本'}` : '尚未承接来源'}</strong><p>{draft.sourceScopeSummary || '导入只复制原型范围字段；不会替你选择参与者、主持方式或结论。'}</p></div>
            <div className="plan-pair"><label><span>游戏/项目 *</span><input value={draft.projectName} onChange={event => update('projectName', event.target.value)} /></label><label><span>当前版本 *</span><input value={draft.version} onChange={event => update('version', event.target.value)} /></label></div>
            <label><span>本轮唯一主问题 *</span><textarea className="plan-primary-question" value={draft.primaryQuestion} onChange={event => update('primaryQuestion', event.target.value)} /></label>
            <p className="plan-margin-note">其他好奇先放停车区，不和主问题混算。</p>
            <label><span>预计看见的桌面行为 *</span><textarea value={draft.predictedBehavior} onChange={event => update('predictedBehavior', event.target.value)} /></label>
            <label><span>什么现象会反驳当前预测 *</span><textarea value={draft.disconfirmingSignal} onChange={event => update('disconfirmingSignal', event.target.value)} /></label>
          </section>}

          {step === 'observation' && <section aria-labelledby="plan-observation-title"><h3 id="plan-observation-title">局中观察协议</h3><p className="section-copy">写事件和可见状态，不用“觉得”“应该”代替发生的动作。</p>
            <label><span>具体记录哪类事件 *</span><textarea value={draft.observationEvent} onChange={event => update('observationEvent', event.target.value)} placeholder="每次交货/保留决定，以及结算后下一次可用信息" /></label>
            <label><span>每条事件必须写什么 *</span><textarea value={draft.observationFields} onChange={event => update('observationFields', event.target.value)} /></label>
            <label><span>目标重复次数或观察单位 *</span><input value={draft.repetitionTarget} onChange={event => update('repetitionTarget', event.target.value)} placeholder="每名玩家至少两次交货/保留决定" /></label>
            <div className="plan-pair"><label><span>开始状态 *</span><textarea value={draft.startState} onChange={event => update('startState', event.target.value)} /></label><label><span>停止触发 *</span><textarea value={draft.stopTrigger} onChange={event => update('stopTrigger', event.target.value)} /></label></div>
            <div className="plan-pair"><label><span>这轮保持不变 *</span><textarea value={draft.invariant} onChange={event => update('invariant', event.target.value)} /></label><label><span>这轮只改变一个轴 *</span><textarea value={draft.changedAxis} onChange={event => update('changedAxis', event.target.value)} /></label></div>
          </section>}

          {step === 'participants' && <section aria-labelledby="plan-participants-title"><h3 id="plan-participants-title">参与者与主持边界</h3>
            <label><span>目标测试者与经验 *</span><input value={draft.participantProfile} onChange={event => update('participantProfile', event.target.value)} /></label>
            <label><span>玩家配置与关系 *</span><input value={draft.playerConfiguration} onChange={event => update('playerConfiguration', event.target.value)} /></label>
            <div className="plan-pair"><label><span>测试类型</span><select value={draft.testType} onChange={event => update('testType', event.target.value as TestType)}><option>自测</option><option>快速测试</option><option>引导测试</option><option>极限测试</option><option>盲测</option></select></label><label><span>测试媒介</span><select value={draft.medium} onChange={event => update('medium', event.target.value as TestMedium)}><option>实体</option><option>线上</option><option>混合</option></select></label></div>
            {draft.medium !== '实体' && <div className="medium-warning">线上或混合测试可能看不到触感、触达、桌面距离、身体动作和细微社交线索；在证据边界中保留实体复核。</div>}
            <label><span>主持人可以做什么 *</span><textarea value={draft.facilitatorAllowed} onChange={event => update('facilitatorAllowed', event.target.value)} /></label>
            <label><span>主持人绝不能替玩家做什么 *</span><textarea value={draft.facilitatorForbidden} onChange={event => update('facilitatorForbidden', event.target.value)} /></label>
            <p className="plan-margin-note">帮助不是噪音：发生时要记时间与影响。</p>
            <label><span>记录方式与同意 *</span><textarea value={draft.captureAndConsent} onChange={event => update('captureAndConsent', event.target.value)} /></label>
            <label><span>安全／主动停止条件 *</span><textarea value={draft.safetyStop} onChange={event => update('safetyStop', event.target.value)} /></label>
          </section>}

          {step === 'finish' && <section aria-labelledby="plan-finish-title"><h3 id="plan-finish-title">结束、追问与下一步</h3><p className="section-copy">局后追问使用玩家自己的语言，不把机制名和设计意图塞进问题。</p>
            <fieldset><legend>局后开放追问</legend>{draft.postQuestions.map((question, index) => <label key={index}><span>{index + 1}{index ? '（可选）' : ' *'}</span><input aria-label={`局后追问 ${index + 1}`} value={question} onChange={event => update('postQuestions', draft.postQuestions.map((value, qIndex) => qIndex === index ? event.target.value : value) as [string, string, string])} placeholder={index === 0 ? '刚才哪一次决定最难？你当时看见了什么？' : '使用玩家说过的词继续追问'} /></label>)}</fieldset>
            <label><span>出现支持、反驳或未定证据后怎样处理 *</span><textarea value={draft.decisionRule} onChange={event => update('decisionRule', event.target.value)} placeholder="支持：换一组玩家复测；反驳：只检查反馈时机；未定：重做表示后保持规则不变" /></label>
            <label><span>其他好奇／意外停车区</span><textarea value={draft.parkingLot} onChange={event => update('parkingLot', event.target.value)} placeholder="记录但不在本轮一起下结论" /></label>
            <p className="plan-boundary">“出现预测行为”不是通过；先检查玩家是否看见了目标信息、主持是否介入，以及其他解释是否仍成立。</p>
          </section>}
        </div>

        <section className="plan-evidence" aria-label="本轮证据链"><h3>本轮证据链</h3><div>{evidenceChain.map((item, index) => <span key={item.label}><strong className={item.ready ? 'is-ready' : ''}>{item.label}</strong>{index < evidenceChain.length - 1 && <b aria-hidden="true">→</b>}</span>)}</div></section>
        <footer className="plan-actions"><button className="primary-button" type="submit">保存测试计划</button><button className="text-action" type="button" onClick={saveAndStartSession}>保存并开始主持 →</button><button className="text-action" type="button" onClick={exportPlans}>导出 JSON →</button><button className={clearArmed ? 'plan-clear is-armed' : 'plan-clear'} type="button" onClick={clearDraft}>{clearArmed ? '确认清空草稿' : '清空草稿'}</button><p>开始主持会冻结一份计划快照；不证明游戏有效或好玩。</p><div className="form-status" aria-live="polite">{status}</div></footer>
      </form>
    </aside>
  </div>
}
