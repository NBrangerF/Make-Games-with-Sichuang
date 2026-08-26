import { FormEvent, useEffect, useMemo, useRef, useState } from 'react'
import { EVIDENCE_SYNTHESIS_STORAGE_KEY, FEEDBACK_REVIEW_STORAGE_KEY, PLAYTEST_SESSION_STORAGE_KEY, TEST_PLAN_STORAGE_KEY } from './storage-keys'

type SessionStep = 'opening' | 'live' | 'debrief' | 'decision'
type SessionState = 'not_started' | 'live' | 'paused' | 'stopped' | 'completed'
type EventType = '行为观察' | '玩家提问' | '玩家原话' | '系统结果' | '主持介入' | '障碍／协助' | '停止／安全'
type EvidenceRelation = '支持' | '反驳' | '未定' | '语境'
type SessionOutcome = '' | '支持' | '反驳' | '未定'
type CaptureMode = '只记匿名文字' | '录音' | '录像' | '照片' | '混合'

type SourcePlan = {
  id: string
  createdAt: string
  projectId: string
  projectName: string
  version: string
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
  testType: string
  medium: string
  facilitatorAllowed: string
  facilitatorForbidden: string
  captureAndConsent: string
  safetyStop: string
  postQuestions: [string, string, string]
  decisionRule: string
  parkingLot: string
}

type SessionEvent = {
  id: string
  elapsedSeconds: number
  phase: string
  actorAlias: string
  type: EventType
  observation: string
  visibleState: string
  resolution: string
  relation: EvidenceRelation
  interventionImpact: string
  createdAt: string
  revisedAt: string
}

type DebriefAnswer = { question: string; response: string }
type SessionDraft = {
  id: string
  sourcePlanId: string
  sourcePlanCreatedAt: string
  projectName: string
  version: string
  planSnapshot: SourcePlan | null
  state: SessionState
  startedAt: string
  endedAt: string
  accumulatedSeconds: number
  runningSince: string
  participantAliases: string
  actualConfiguration: string
  actualMedium: string
  observerRoles: string
  captureMode: CaptureMode
  consentScope: string
  consentConfirmed: boolean
  events: SessionEvent[]
  actualStopReason: string
  unplannedDeviation: string
  debriefAnswers: DebriefAnswer[]
  consentReminderConfirmed: boolean
  outcome: SessionOutcome
  strongestObservation: string
  alternativeExplanation: string
  keepSame: string
  changedAxis: string
  nextQuestion: string
  createdAt: string
  completedAt: string
}
type SessionRecord = SessionDraft

const steps: { id: SessionStep; number: string; label: string; note: string }[] = [
  { id: 'opening', number: '01', label: '开场与同意', note: '确认实际参与语境和记录范围；勾选不是法律认证。' },
  { id: 'live', number: '02', label: '局中事件', note: '先记可见事件和随后结果，不在现场挑选“重要洞察”。' },
  { id: 'debrief', number: '03', label: '结束与追问', note: '局后回答与局中证据分开；提醒参与者仍可撤回。' },
  { id: 'decision', number: '04', label: '证据与下一版', note: '先判断当前问题，再决定只改变一个轴。' },
]

const blankEvent = (): Omit<SessionEvent, 'id' | 'createdAt' | 'revisedAt'> => ({
  elapsedSeconds: 0, phase: '', actorAlias: '', type: '行为观察', observation: '', visibleState: '', resolution: '', relation: '未定', interventionImpact: '',
})

function readLatestPlan(): SourcePlan | null {
  try {
    const records = JSON.parse(localStorage.getItem(TEST_PLAN_STORAGE_KEY) || '[]')
    const plan = Array.isArray(records) ? records[0] : null
    return plan?.id && plan?.primaryQuestion ? plan as SourcePlan : null
  } catch { return null }
}

function newDraft(plan: SourcePlan | null): SessionDraft {
  return {
    id: crypto.randomUUID(), sourcePlanId: plan?.id || '', sourcePlanCreatedAt: plan?.createdAt || '', projectName: plan?.projectName || '', version: plan?.version || '', planSnapshot: plan,
    state: 'not_started', startedAt: '', endedAt: '', accumulatedSeconds: 0, runningSince: '', participantAliases: '', actualConfiguration: plan?.playerConfiguration || '', actualMedium: plan?.medium || '实体', observerRoles: '', captureMode: '只记匿名文字', consentScope: plan?.captureAndConsent || '', consentConfirmed: false,
    events: [], actualStopReason: '', unplannedDeviation: '', debriefAnswers: (plan?.postQuestions || ['', '', '']).filter(Boolean).map(question => ({ question, response: '' })), consentReminderConfirmed: false,
    outcome: '', strongestObservation: '', alternativeExplanation: '', keepSame: plan?.invariant || '', changedAxis: plan?.changedAxis || '', nextQuestion: '', createdAt: new Date().toISOString(), completedAt: '',
  }
}

function readSessionStore(plan: SourcePlan | null): { draft: SessionDraft; records: SessionRecord[] } {
  try {
    const stored = JSON.parse(localStorage.getItem(PLAYTEST_SESSION_STORAGE_KEY) || 'null')
    if (!stored || stored.schemaVersion !== 1) return { draft: newDraft(plan), records: [] }
    return { draft: { ...newDraft(plan), ...stored.draft, events: Array.isArray(stored.draft?.events) ? stored.draft.events : [], debriefAnswers: Array.isArray(stored.draft?.debriefAnswers) ? stored.draft.debriefAnswers : [] }, records: Array.isArray(stored.records) ? stored.records : [] }
  } catch { return { draft: newDraft(plan), records: [] } }
}

function formatTime(totalSeconds: number) {
  const seconds = Math.max(0, Math.floor(totalSeconds))
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  return [hours, minutes, seconds % 60].map(value => String(value).padStart(2, '0')).join(':')
}

function downloadJson(filename: string, payload: unknown) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a'); anchor.href = url; anchor.download = filename; anchor.click(); URL.revokeObjectURL(url)
}

export function PlaytestSessionRecorder({ onOpenPlan, onReview }: { onOpenPlan: () => void; onReview?: () => void }) {
  const planAtLoad = useMemo(readLatestPlan, [])
  const initial = useMemo(() => readSessionStore(planAtLoad), [planAtLoad])
  const [draft, setDraft] = useState(initial.draft)
  const [records, setRecords] = useState(initial.records)
  const [step, setStep] = useState<SessionStep>(draft.state === 'not_started' ? 'opening' : draft.state === 'completed' ? 'decision' : 'live')
  const [eventDraft, setEventDraft] = useState(blankEvent)
  const [editingEventId, setEditingEventId] = useState('')
  const [status, setStatus] = useState(planAtLoad ? '会话草稿自动保存在当前浏览器。' : '尚未找到已保存的测试计划。')
  const [clearArmed, setClearArmed] = useState(false)
  const [withdrawArmed, setWithdrawArmed] = useState(false)
  const [now, setNow] = useState(Date.now())
  const eventObservationRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    localStorage.setItem(PLAYTEST_SESSION_STORAGE_KEY, JSON.stringify({ schemaVersion: 1, draft, records }))
  }, [draft, records])
  useEffect(() => {
    if (draft.state !== 'live') return
    const timer = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(timer)
  }, [draft.state])

  const elapsed = draft.accumulatedSeconds + (draft.state === 'live' && draft.runningSince ? Math.max(0, (now - new Date(draft.runningSince).getTime()) / 1000) : 0)
  const interventionCount = draft.events.filter(event => event.type === '主持介入').length
  const update = <K extends keyof SessionDraft>(key: K, value: SessionDraft[K]) => {
    setDraft(current => ({ ...current, [key]: value })); setStatus('会话草稿已在当前浏览器更新。'); setClearArmed(false); setWithdrawArmed(false)
  }
  const updateEvent = <K extends keyof typeof eventDraft>(key: K, value: (typeof eventDraft)[K]) => setEventDraft(current => ({ ...current, [key]: value }))

  const startSession = () => {
    if (!draft.planSnapshot) return setStatus('请先保存一份单问题测试计划。')
    if (![draft.participantAliases, draft.actualConfiguration, draft.actualMedium, draft.observerRoles, draft.consentScope].every(value => value.trim()) || !draft.consentConfirmed) return setStatus('开始前请补齐玩家别名、实际配置、媒介、记录角色、同意范围并确认已获得同意。')
    const startedAt = new Date().toISOString()
    setDraft(current => ({ ...current, state: 'live', startedAt: current.startedAt || startedAt, runningSince: startedAt }))
    setStep('live'); setNow(Date.now()); setStatus('本场已开始。记录可见事件、当时状态、随后结果和所有主持介入。')
  }
  const pauseOrResume = () => {
    if (draft.state === 'live') {
      setDraft(current => ({ ...current, state: 'paused', accumulatedSeconds: Math.floor(elapsed), runningSince: '' })); setStatus('计时已暂停；草稿仍会保存。')
    } else if (draft.state === 'paused') {
      const runningSince = new Date().toISOString(); setDraft(current => ({ ...current, state: 'live', runningSince })); setNow(Date.now()); setStatus('计时已继续。')
    }
  }
  const stopSession = () => {
    if (!['live', 'paused'].includes(draft.state)) return
    setDraft(current => ({ ...current, state: 'stopped', accumulatedSeconds: Math.floor(elapsed), runningSince: '', endedAt: new Date().toISOString() }))
    setStep('debrief'); setStatus('计时已结束。请记录实际停止原因、局后回答和任何计划外变化。')
  }

  const saveEvent = (event: FormEvent) => {
    event.preventDefault()
    if (!['live', 'paused'].includes(draft.state)) return setStatus('请先开始本场，再记录局中事件。')
    if (![eventDraft.phase, eventDraft.actorAlias, eventDraft.observation, eventDraft.visibleState, eventDraft.resolution].every(value => String(value).trim())) return setStatus('每条事件都要写阶段、玩家别名、发生了什么、当时可见状态和随后怎样结束。')
    if (eventDraft.type === '主持介入' && !eventDraft.interventionImpact.trim()) return setStatus('主持介入必须写清它改变了什么信息、决定或节奏。')
    const stamp = Math.floor(elapsed)
    if (editingEventId) {
      setDraft(current => ({ ...current, events: current.events.map(item => item.id === editingEventId ? { ...item, ...eventDraft, elapsedSeconds: eventDraft.elapsedSeconds || stamp, revisedAt: new Date().toISOString() } : item) }))
      setStatus('事件修正已保存；原始创建时间仍保留。')
    } else {
      const record: SessionEvent = { ...eventDraft, elapsedSeconds: stamp, id: crypto.randomUUID(), createdAt: new Date().toISOString(), revisedAt: '' }
      setDraft(current => ({ ...current, events: [...current.events, record] }))
      setStatus('事件已加入时间线。')
    }
    setEventDraft(blankEvent()); setEditingEventId(''); eventObservationRef.current?.focus()
  }
  const editEvent = (record: SessionEvent) => {
    const { id, createdAt, revisedAt, ...editable } = record
    void id; void createdAt; void revisedAt
    setEventDraft(editable); setEditingEventId(record.id); eventObservationRef.current?.focus(); setStatus('正在修正一条事件；保存后会留下修正时间。')
  }

  const saveSession = (event: FormEvent) => {
    event.preventDefault()
    if (!draft.endedAt || !draft.events.length) { setStep('live'); return setStatus('保存前请结束本场，并至少记录一条局中事件。') }
    if (!draft.actualStopReason.trim() || !draft.debriefAnswers[0]?.response.trim() || !draft.consentReminderConfirmed) { setStep('debrief'); return setStatus('请补齐实际停止原因、至少一个局后回答，并确认已提醒撤回方式。') }
    if (![draft.outcome, draft.strongestObservation, draft.alternativeExplanation, draft.keepSame, draft.changedAxis, draft.nextQuestion].every(value => value.trim())) { setStep('decision'); return setStatus('请补齐本场判断、关键观察、其他解释、保持不变、单一改动和下一场唯一问题。') }
    const completed: SessionRecord = { ...draft, state: 'completed', completedAt: new Date().toISOString() }
    setDraft(completed); setRecords(current => [completed, ...current.filter(record => record.id !== completed.id)]); setStatus('会话与下一版决定已保存。它仍是当前语境的形成性证据。')
  }
  const exportSessions = () => {
    downloadJson(`${draft.projectName || '桌游项目'}-${draft.version || '版本'}-现场测试会话.json`, {
      schema_version: 1, method: 'live-playtest-session-recorder', local_first: true, no_fun_score: true, no_automatic_severity: true, no_frequency_threshold: true, no_causal_proof: true, no_sample_representativeness_claim: true, no_legal_consent_certification: true, no_silent_plan_mutation: true,
      evidence_boundary: '会话记录只保存当前版本、玩家配置、媒介、主持与同意范围中的事件；事件数量和关系标签不自动形成严重度、因果、代表性、质量或发行结论。', draft, saved_records: records, exported_at: new Date().toISOString(),
    }); setStatus('会话包已导出；不包含自动洞察、严重度、代表性或同意认证。')
  }
  const clearDraft = () => {
    if (!clearArmed) { setClearArmed(true); setStatus('再次点击“确认新建空白会话”；已完成记录不会删除。'); return }
    setDraft(newDraft(readLatestPlan())); setEventDraft(blankEvent()); setEditingEventId(''); setStep('opening'); setClearArmed(false); setStatus('已新建会话草稿；历史记录仍在当前浏览器。')
  }
  const withdrawAndDelete = () => {
    if (!withdrawArmed) { setWithdrawArmed(true); setStatus('再次点击确认：将清除本场草稿，并删除同一会话 ID 的已保存记录。此操作不可在本站恢复。'); return }
    const nextRecords = records.filter(record => record.id !== draft.id)
    const nextDraft = newDraft(readLatestPlan())
    setRecords(nextRecords); setDraft(nextDraft); setEventDraft(blankEvent()); setEditingEventId(''); setStep('opening'); setWithdrawArmed(false)
    localStorage.setItem(PLAYTEST_SESSION_STORAGE_KEY, JSON.stringify({ schemaVersion: 1, draft: nextDraft, records: nextRecords }))
    try {
      const reviewStore = JSON.parse(localStorage.getItem(FEEDBACK_REVIEW_STORAGE_KEY) || 'null')
      if (reviewStore?.schemaVersion === 2) {
        const linkedRecords = Array.isArray(reviewStore.records) ? reviewStore.records.filter((record: { sourceSessionId?: string }) => record.sourceSessionId !== draft.id) : []
        const linkedDraft = reviewStore.draft?.sourceSessionId === draft.id ? null : reviewStore.draft
        localStorage.setItem(FEEDBACK_REVIEW_STORAGE_KEY, JSON.stringify({ ...reviewStore, draft: linkedDraft, records: linkedRecords }))
      }
    } catch { /* session withdrawal still succeeds if no linked review store exists */ }
    try {
      const synthesisStore = JSON.parse(localStorage.getItem(EVIDENCE_SYNTHESIS_STORAGE_KEY) || 'null')
      if ([1, 2].includes(synthesisStore?.schemaVersion)) {
        type LinkedSynthesis = { id?: string; parentRecordId?: string; sources?: { sessionId?: string }[] }
        const hasSession = (record?: LinkedSynthesis | null) => Array.isArray(record?.sources) && record.sources.some(source => source.sessionId === draft.id)
        const synthesisRecords: LinkedSynthesis[] = Array.isArray(synthesisStore.records) ? synthesisStore.records : []
        const withdrawnRecordIds = new Set(synthesisRecords.filter(hasSession).flatMap(record => record.id ? [record.id] : []))
        let foundDescendant = true
        while (foundDescendant) {
          foundDescendant = false
          synthesisRecords.forEach(record => {
            if (record.id && record.parentRecordId && withdrawnRecordIds.has(record.parentRecordId) && !withdrawnRecordIds.has(record.id)) {
              withdrawnRecordIds.add(record.id)
              foundDescendant = true
            }
          })
        }
        const linkedRecords = synthesisRecords.filter(record => !record.id || !withdrawnRecordIds.has(record.id))
        const linkedDraft = hasSession(synthesisStore.draft) || withdrawnRecordIds.has(synthesisStore.draft?.parentRecordId) ? null : synthesisStore.draft
        localStorage.setItem(EVIDENCE_SYNTHESIS_STORAGE_KEY, JSON.stringify({ ...synthesisStore, schemaVersion: 2, draft: linkedDraft, records: linkedRecords }))
      }
    } catch { /* session withdrawal still succeeds if no linked synthesis store exists */ }
    setStatus('本场数据及本站中关联的派生复盘与跨轮综合已清除；外部录音、照片或副本仍需在各自位置删除。')
  }

  const evidenceGroups = useMemo(() => (['支持', '反驳', '未定', '语境'] as EvidenceRelation[]).map(relation => ({ relation, events: draft.events.filter(event => event.relation === relation) })), [draft.events])

  if (!draft.planSnapshot) return <section className="tool-surface live-session-tool is-empty"><h2>现场测试记录</h2><p className="tool-intro">先记发生了什么，再判断它意味着什么。</p><div className="session-empty"><h3>还没有可主持的测试计划</h3><p>先保存一份单问题测试计划。现场记录只承接计划快照，不会从项目标题推断问题或主持方式。</p><button className="primary-button" onClick={onOpenPlan}>打开测试计划</button></div></section>
  const plan = draft.planSnapshot

  return <section className="tool-surface live-session-tool">
    <header className="session-heading"><div><h2>现场测试记录</h2><p className="tool-intro">先记发生了什么，再判断它意味着什么。</p></div><p className="session-autosave" role="status">草稿自动保存在当前浏览器<br /><small>{records.length} 场已完成会话</small></p></header>
    <nav className="session-steps" aria-label="现场测试记录步骤">{steps.map(item => <button key={item.id} type="button" className={step === item.id ? 'is-active' : ''} aria-pressed={step === item.id} onClick={() => setStep(item.id)}><span>{item.number}</span>{item.label}</button>)}</nav>
    <p className="session-step-note">{steps.find(item => item.id === step)?.note}</p>

    <div className="session-grid">
      <aside className="session-plan" aria-label="本场只回答"><h3>本场只回答</h3><blockquote>{plan.primaryQuestion}</blockquote><dl><div><dt>预测</dt><dd>{plan.predictedBehavior}</dd></div><div><dt>反驳</dt><dd>{plan.disconfirmingSignal}</dd></div><div><dt>目标事件</dt><dd>{plan.observationEvent}</dd></div><div><dt>主持可做</dt><dd>{plan.facilitatorAllowed}</dd></div><div><dt>主持禁做</dt><dd>{plan.facilitatorForbidden}</dd></div><div><dt>停止条件</dt><dd>{plan.stopTrigger}<br />{plan.safetyStop}</dd></div></dl><p>来源计划 {plan.version} · {draft.sourcePlanId.slice(0, 8)}</p></aside>

      <section className="session-main" aria-label="会话主工作区">
        {step === 'opening' && <section className="session-opening"><h3>开场与实际语境</h3><p>只记录别名；不要把姓名、联系方式或未同意的影像放进本站。</p>
          <label><span>参与者别名与必要经验 *</span><textarea value={draft.participantAliases} onChange={event => update('participantAliases', event.target.value)} placeholder="P1：第一次接触本原型；P2：玩过两次轻中策" /></label>
          <div className="session-pair"><label><span>实际玩家配置与关系 *</span><input value={draft.actualConfiguration} onChange={event => update('actualConfiguration', event.target.value)} /></label><label><span>实际媒介 *</span><input value={draft.actualMedium} onChange={event => update('actualMedium', event.target.value)} /></label></div>
          <label><span>主持、观察与记录分别由谁承担 *</span><textarea value={draft.observerRoles} onChange={event => update('observerRoles', event.target.value)} placeholder="主持：D；记录：O1；无远程观察者" /></label>
          <div className="session-pair"><label><span>记录方式 *</span><select value={draft.captureMode} onChange={event => update('captureMode', event.target.value as CaptureMode)}><option>只记匿名文字</option><option>录音</option><option>录像</option><option>照片</option><option>混合</option></select></label><label><span>确认的记录与使用范围 *</span><textarea value={draft.consentScope} onChange={event => update('consentScope', event.target.value)} /></label></div>
          <label className="session-check"><input type="checkbox" checked={draft.consentConfirmed} onChange={event => update('consentConfirmed', event.target.checked)} /><span>我已用参与者能理解和使用的方式说明目的、活动、记录、使用/分享范围、保留方式、观察者和随时停止/撤回；并获得本场明确同意。此勾选不是法律或伦理认证。</span></label>
          <button className="primary-button" type="button" onClick={startSession}>开始本场并计时</button>
        </section>}

        {step === 'live' && <section className="session-live"><header className="session-clock"><strong>{formatTime(elapsed)}</strong><span>{draft.state === 'live' ? '正在记录' : draft.state === 'paused' ? '计时暂停' : draft.state === 'stopped' || draft.state === 'completed' ? '本场已结束' : '尚未开始'}</span><div>{['live', 'paused'].includes(draft.state) && <><button type="button" className="text-action" onClick={pauseOrResume}>{draft.state === 'live' ? '暂停计时' : '继续计时'}</button><button type="button" className="session-stop" onClick={stopSession}>结束本场</button></>}</div></header>
          <div className="session-timeline" aria-label="局中事件时间线">{draft.events.length ? draft.events.map(record => <article key={record.id}><header><time>{formatTime(record.elapsedSeconds)}</time><strong>{record.actorAlias}</strong><span>{record.type}</span><button type="button" onClick={() => editEvent(record)}>修正</button></header><dl><div><dt>发生了什么</dt><dd>{record.observation}</dd></div><div><dt>当时可见状态</dt><dd>{record.visibleState}</dd></div><div><dt>随后怎样结束</dt><dd>{record.resolution}</dd></div>{record.interventionImpact && <div><dt>介入影响</dt><dd>{record.interventionImpact}</dd></div>}</dl><footer><span>{record.relation}</span><small>{record.phase}{record.revisedAt ? ' · 已修正' : ''}</small></footer></article>) : <p className="session-no-events">还没有事件。记录第一条可见动作、当时状态和随后结果。</p>}</div>
        </section>}

        {step === 'debrief' && <section className="session-debrief"><h3>结束、偏离与开放追问</h3><label><span>实际停止原因／触发 *</span><textarea value={draft.actualStopReason} onChange={event => update('actualStopReason', event.target.value)} placeholder="按计划停止、参与者要求停止、时间到或安全停止；写实际发生的原因" /></label><label><span>计划外变化或中途改规则</span><textarea value={draft.unplannedDeviation} onChange={event => update('unplannedDeviation', event.target.value)} placeholder="没有则写“无”；若发生，写时间点和影响" /></label>
          <fieldset><legend>局后开放问题（与局中证据分开）</legend>{draft.debriefAnswers.map((answer, index) => <label key={`${answer.question}-${index}`}><span>{answer.question}</span><textarea value={answer.response} onChange={event => update('debriefAnswers', draft.debriefAnswers.map((item, itemIndex) => itemIndex === index ? { ...item, response: event.target.value } : item))} placeholder="按玩家别名记录回答，不替玩家归纳" /></label>)}</fieldset>
          <label className="session-check"><input type="checkbox" checked={draft.consentReminderConfirmed} onChange={event => update('consentReminderConfirmed', event.target.checked)} /><span>结束时已提醒本场记录了什么，以及参与者怎样停止使用或撤回本站中的本场数据。</span></label>
          <button className="primary-button" type="button" onClick={() => setStep('decision')}>整理证据与下一版 →</button>
        </section>}

        {step === 'decision' && <section className="session-evidence"><h3>本场证据</h3>{evidenceGroups.map(group => <details key={group.relation} open={group.relation !== '语境'}><summary>{group.relation}{group.relation === '未定' ? '／其他解释' : ''} <span>{group.events.length} 条事件</span></summary>{group.events.length ? group.events.map(record => <p key={record.id}><time>{formatTime(record.elapsedSeconds)}</time> <strong>{record.actorAlias}</strong> · {record.observation} <small>{record.resolution}</small></p>) : <p>本场没有标记为这一关系的事件。</p>}</details>)}
          <section className="session-post-evidence"><h4>局后开放回答</h4>{draft.debriefAnswers.map((answer, index) => <div key={index}><strong>{answer.question}</strong><p>{answer.response || '尚未记录回答。'}</p></div>)}</section>
          <p className="session-boundary">事件数量只帮助定位原始记录，不自动形成频率门槛、严重度或本场结论。</p>
        </section>}
      </section>

      {step === 'live' ? <aside className="session-entry"><h3>记一条发生的事</h3><p>主持帮助也要记。</p><form onSubmit={saveEvent}>
        <div className="session-pair"><label><span>时间／阶段 *</span><input value={eventDraft.phase} onChange={event => updateEvent('phase', event.target.value)} placeholder="第 2 轮／交货前" /></label><label><span>玩家别名 *</span><input value={eventDraft.actorAlias} onChange={event => updateEvent('actorAlias', event.target.value)} placeholder="P1／主持" /></label></div>
        <label><span>事件类型 *</span><select value={eventDraft.type} onChange={event => updateEvent('type', event.target.value as EventType)}><option>行为观察</option><option>玩家提问</option><option>玩家原话</option><option>系统结果</option><option>主持介入</option><option>障碍／协助</option><option>停止／安全</option></select></label>
        <label><span>发生了什么 *</span><textarea ref={eventObservationRef} value={eventDraft.observation} onChange={event => updateEvent('observation', event.target.value)} placeholder="客观描述可见行为或逐字短语" /></label>
        <label><span>当时可见状态 *</span><textarea value={eventDraft.visibleState} onChange={event => updateEvent('visibleState', event.target.value)} placeholder="当时已知的信息、资源、局面" /></label>
        <label><span>随后怎样结束 *</span><textarea value={eventDraft.resolution} onChange={event => updateEvent('resolution', event.target.value)} placeholder="自行恢复、继续卡住、系统结算或停止" /></label>
        {eventDraft.type === '主持介入' && <label><span>介入改变了什么 *</span><textarea value={eventDraft.interventionImpact} onChange={event => updateEvent('interventionImpact', event.target.value)} placeholder="改变了可见信息、决定范围、时间或互动吗？" /></label>}
        <label><span>与主问题关系 *</span><select value={eventDraft.relation} onChange={event => updateEvent('relation', event.target.value as EvidenceRelation)}><option>支持</option><option>反驳</option><option>未定</option><option>语境</option></select></label>
        <button className="primary-button" type="submit">{editingEventId ? '保存事件修正' : '加入时间线'}</button>{editingEventId && <button className="text-action" type="button" onClick={() => { setEventDraft(blankEvent()); setEditingEventId('') }}>取消修正</button>}
      </form></aside> : step === 'decision' ? <aside className="session-decision"><h3>下一版决定</h3><form onSubmit={saveSession}>
        <fieldset><legend>本场判断 *</legend>{(['支持', '反驳', '未定'] as const).map(value => <label key={value}><input type="radio" name="outcome" checked={draft.outcome === value} onChange={() => update('outcome', value)} />{value}</label>)}</fieldset>
        <label><span>最有解释力的观察 *</span><textarea value={draft.strongestObservation} onChange={event => update('strongestObservation', event.target.value)} /></label>
        <label><span>仍可能成立的其他解释 *</span><textarea value={draft.alternativeExplanation} onChange={event => update('alternativeExplanation', event.target.value)} /></label>
        <label><span>下一版保持不变 *</span><textarea value={draft.keepSame} onChange={event => update('keepSame', event.target.value)} /></label>
        <label><span>下一版只改变一个轴 *</span><textarea value={draft.changedAxis} onChange={event => update('changedAxis', event.target.value)} /></label>
        <label><span>下一场唯一问题 *</span><textarea value={draft.nextQuestion} onChange={event => update('nextQuestion', event.target.value)} /></label>
        <div className="session-plan-rule"><strong>来自计划的改动准则</strong><p>{plan.decisionRule}</p></div><p className="session-margin-note">先选问题，再想解法。</p>
        <button className="primary-button" type="submit">保存会话与下一版</button><button className="text-action" type="button" onClick={exportSessions}>导出 JSON →</button>
        {draft.state === 'completed' && onReview && <button className="text-action" type="button" onClick={onReview}>交给证据复盘 →</button>}
      </form></aside> : <aside className="session-context"><h3>本场状态</h3><dl><div><dt>版本</dt><dd>{draft.version}</dd></div><div><dt>状态</dt><dd>{draft.state}</dd></div><div><dt>事件</dt><dd>{draft.events.length}</dd></div><div><dt>主持介入</dt><dd>{interventionCount}</dd></div></dl><p>局后回答不能覆盖局中行为；没有回答也要保留缺失状态。</p></aside>}
    </div>

    <footer className="session-footer"><p><strong>{draft.events.length}</strong> 条事件 · <strong>{interventionCount}</strong> 次主持介入 · {draft.endedAt ? '已结束' : '尚未结束'}</p><p>只按已确认的同意范围记录；参与者可随时停止。</p><button type="button" className={clearArmed ? 'session-clear is-armed' : 'session-clear'} onClick={clearDraft}>{clearArmed ? '确认新建空白会话' : '新建会话草稿'}</button><button type="button" className={withdrawArmed ? 'session-withdraw is-armed' : 'session-withdraw'} onClick={withdrawAndDelete}>{withdrawArmed ? '确认撤回并清除本场' : '撤回并清除本场'}</button><div className="form-status" aria-live="polite">{status}</div></footer>
  </section>
}
