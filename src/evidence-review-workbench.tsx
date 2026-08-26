import { FormEvent, useEffect, useMemo, useState } from 'react'
import { FEEDBACK_REVIEW_STORAGE_KEY, PLAYTEST_SESSION_STORAGE_KEY } from './storage-keys'

type ReviewStep = 'source' | 'evidence' | 'finding' | 'decision'
type Relation = '支持' | '反驳' | '未定' | '语境'
type Disposition = '保护' | '修改' | '继续调查' | '暂存' | '不改'
type EvidenceKind = '局中事件' | '局后回答'

type SessionEvent = {
  id: string
  elapsedSeconds: number
  phase: string
  actorAlias: string
  type: string
  observation: string
  visibleState: string
  resolution: string
  relation: Relation
  interventionImpact: string
}
type CompletedSession = {
  id: string
  projectName: string
  version: string
  state: string
  sourcePlanId: string
  planSnapshot: { primaryQuestion?: string; decisionRule?: string } | null
  participantAliases: string
  actualConfiguration: string
  actualMedium: string
  events: SessionEvent[]
  debriefAnswers: { question: string; response: string }[]
  outcome: string
  strongestObservation: string
  alternativeExplanation: string
  keepSame: string
  changedAxis: string
  nextQuestion: string
  completedAt: string
}
type EvidenceItem = {
  id: string
  kind: EvidenceKind
  actorAlias: string
  label: string
  observation: string
  visibleState: string
  resolution: string
  relation: Relation
}
type ReviewDraft = {
  id: string
  sourceSessionId: string
  sourceSessionCompletedAt: string
  sourcePlanId: string
  projectName: string
  sourceVersion: string
  sourceQuestion: string
  sourceContext: string
  evidencePool: EvidenceItem[]
  selectedEvidenceIds: string[]
  findingStatement: string
  appliesWhen: string
  counterEvidence: string
  missingEvidence: string
  disposition: Disposition
  rationale: string
  keepSame: string
  candidateSolutions: string
  rejectedOption: string
  targetVersion: string
  changedAxis: string
  concreteChange: string
  rollbackSignal: string
  nextQuestion: string
  createdAt: string
  completedAt: string
  schemaMigratedFrom?: number
}
type ReviewRecord = ReviewDraft
type ReviewStore = { draft: ReviewDraft; records: ReviewRecord[] }

const steps: { id: ReviewStep; number: string; label: string; note: string }[] = [
  { id: 'source', number: '01', label: '承接会话', note: '来源必须显式选择；导入不会修改原会话。' },
  { id: 'evidence', number: '02', label: '选择证据', note: '先回到原事件和原回答，不按数量自动排序。' },
  { id: 'finding', number: '03', label: '形成发现', note: '发现要写适用条件、其他解释和仍缺的证据。' },
  { id: 'decision', number: '04', label: '版本决定', note: '建议不是待办；选中的改动仍是假设。' },
]

function emptyDraft(): ReviewDraft {
  return {
    id: crypto.randomUUID(), sourceSessionId: '', sourceSessionCompletedAt: '', sourcePlanId: '', projectName: '', sourceVersion: '', sourceQuestion: '', sourceContext: '', evidencePool: [], selectedEvidenceIds: [],
    findingStatement: '', appliesWhen: '', counterEvidence: '', missingEvidence: '', disposition: '继续调查', rationale: '', keepSame: '', candidateSolutions: '', rejectedOption: '', targetVersion: '', changedAxis: '', concreteChange: '', rollbackSignal: '', nextQuestion: '', createdAt: new Date().toISOString(), completedAt: '',
  }
}

function readSessions(): CompletedSession[] {
  try {
    const stored = JSON.parse(localStorage.getItem(PLAYTEST_SESSION_STORAGE_KEY) || 'null')
    return Array.isArray(stored?.records) ? stored.records.filter((record: CompletedSession) => record.state === 'completed') : []
  } catch { return [] }
}

function migrateLegacy(record: Record<string, string>): ReviewRecord {
  const draft = emptyDraft()
  const actionMap: Record<string, Disposition> = { '继续观察': '继续调查', '形成假设': '继续调查', '现在不改': '不改' }
  return {
    ...draft, id: record.id || crypto.randomUUID(),
    evidencePool: [{ id: `legacy:${record.id || crypto.randomUUID()}`, kind: '局后回答', actorAlias: '旧版未记录', label: record.category || '旧版反馈', observation: record.raw || '', visibleState: '旧版反馈分拣未记录来源会话与状态。', resolution: record.evidence || '', relation: '未定' }],
    selectedEvidenceIds: [], findingStatement: record.evidence || record.raw || '旧版反馈', appliesWhen: '旧版未记录适用条件。', counterEvidence: '旧版未记录反证。', missingEvidence: '缺少来源会话、版本、玩家语境与事件状态。', disposition: actionMap[record.action] || '继续调查', rationale: '由旧版反馈分拣记录迁移；需要重新连接来源后再形成变更。', createdAt: record.createdAt || draft.createdAt, completedAt: record.createdAt || draft.createdAt, schemaMigratedFrom: 1,
  }
}

function readStore(): ReviewStore {
  const fallback: ReviewStore = { draft: emptyDraft(), records: [] }
  try {
    const stored = JSON.parse(localStorage.getItem(FEEDBACK_REVIEW_STORAGE_KEY) || 'null')
    if (Array.isArray(stored)) return { draft: fallback.draft, records: stored.map((record: Record<string, string>) => migrateLegacy(record)) }
    if (!stored || stored.schemaVersion !== 2) return fallback
    return {
      draft: { ...emptyDraft(), ...(stored.draft || {}) } as ReviewDraft,
      records: Array.isArray(stored.records) ? stored.records as ReviewRecord[] : [],
    }
  } catch { return fallback }
}

function evidenceFromSession(session: CompletedSession): EvidenceItem[] {
  const events = (session.events || []).map(event => ({
    id: `event:${event.id}`, kind: '局中事件' as const, actorAlias: event.actorAlias, label: `${formatTime(event.elapsedSeconds)} · ${event.phase} · ${event.type}`, observation: event.observation, visibleState: event.visibleState, resolution: `${event.resolution}${event.interventionImpact ? `；介入影响：${event.interventionImpact}` : ''}`, relation: event.relation,
  }))
  const answers = (session.debriefAnswers || []).filter(answer => answer.response?.trim()).map((answer, index) => ({
    id: `debrief:${index}`, kind: '局后回答' as const, actorAlias: '局后', label: answer.question, observation: answer.response, visibleState: '局后自我报告，不覆盖局中行为。', resolution: '没有局中后续结果。', relation: '语境' as Relation,
  }))
  return [...events, ...answers]
}

function formatTime(seconds: number) {
  const value = Math.max(0, Math.floor(seconds || 0))
  return [Math.floor(value / 3600), Math.floor((value % 3600) / 60), value % 60].map(part => String(part).padStart(2, '0')).join(':')
}

function downloadJson(filename: string, payload: unknown) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob); const anchor = document.createElement('a'); anchor.href = url; anchor.download = filename; anchor.click(); URL.revokeObjectURL(url)
}

export function EvidenceReviewWorkbench({ onOpenSession, onCopyProjectNextAction, onSynthesize }: { onOpenSession: () => void; onCopyProjectNextAction: (nextAction: string) => void; onSynthesize: () => void }) {
  const sessions = useMemo(readSessions, [])
  const initial = useMemo(readStore, [])
  const [draft, setDraft] = useState(initial.draft)
  const [records, setRecords] = useState(initial.records)
  const [step, setStep] = useState<ReviewStep>(draft.sourceSessionId ? 'evidence' : 'source')
  const [selectedSessionId, setSelectedSessionId] = useState(sessions[0]?.id || '')
  const [status, setStatus] = useState(sessions.length ? '选择并显式导入一场已完成会话。' : '尚未找到已完成的现场会话。')
  const [newArmed, setNewArmed] = useState(false)

  useEffect(() => { localStorage.setItem(FEEDBACK_REVIEW_STORAGE_KEY, JSON.stringify({ schemaVersion: 2, draft, records })) }, [draft, records])
  const update = <K extends keyof ReviewDraft>(key: K, value: ReviewDraft[K]) => { setDraft(current => ({ ...current, [key]: value })); setStatus('复盘草稿已在当前浏览器更新。'); setNewArmed(false) }
  const sourceSession = sessions.find(session => session.id === draft.sourceSessionId)
  const counts = useMemo(() => (['支持', '反驳', '未定', '语境'] as Relation[]).map(relation => ({ relation, count: draft.evidencePool.filter(item => draft.selectedEvidenceIds.includes(item.id) && item.relation === relation).length })), [draft.evidencePool, draft.selectedEvidenceIds])

  const importSession = () => {
    const session = sessions.find(item => item.id === selectedSessionId)
    if (!session) return setStatus('请先选择一场已完成会话。')
    setDraft(current => ({
      ...emptyDraft(), id: current.sourceSessionId === session.id ? current.id : crypto.randomUUID(), sourceSessionId: session.id, sourceSessionCompletedAt: session.completedAt, sourcePlanId: session.sourcePlanId, projectName: session.projectName, sourceVersion: session.version, sourceQuestion: session.planSnapshot?.primaryQuestion || '', sourceContext: `${session.participantAliases}；${session.actualConfiguration}；${session.actualMedium}`, evidencePool: evidenceFromSession(session), findingStatement: session.strongestObservation || '', counterEvidence: session.alternativeExplanation || '', keepSame: session.keepSame || '', changedAxis: session.changedAxis || '', nextQuestion: session.nextQuestion || '', createdAt: new Date().toISOString(),
    }))
    setStep('evidence'); setStatus('已冻结来源会话引用并载入原始证据；尚未自动选择、分组或下结论。')
  }
  const toggleEvidence = (id: string) => update('selectedEvidenceIds', draft.selectedEvidenceIds.includes(id) ? draft.selectedEvidenceIds.filter(item => item !== id) : [...draft.selectedEvidenceIds, id])
  const continueToFinding = () => {
    if (!draft.selectedEvidenceIds.length) return setStatus('请至少选择一条原始证据；数量不会自动生成严重度。')
    setStep('finding'); setStatus('证据已选。现在写发现、适用条件、反证和缺失，不先写解决方案。')
  }
  const continueToDecision = () => {
    if (![draft.findingStatement, draft.appliesWhen, draft.counterEvidence, draft.missingEvidence].every(value => value.trim())) return setStatus('请补齐发现陈述、适用条件、反证／其他解释和仍缺的证据。')
    setStep('decision'); setStatus('发现边界已写清。版本决定仍需你明确选择。')
  }
  const saveReview = (event: FormEvent) => {
    event.preventDefault()
    if (!draft.sourceSessionId || !draft.selectedEvidenceIds.length) { setStep('evidence'); return setStatus('保存前请承接一场会话并选择证据。') }
    const required = [draft.findingStatement, draft.appliesWhen, draft.counterEvidence, draft.missingEvidence, draft.rationale, draft.keepSame, draft.targetVersion, draft.rollbackSignal, draft.nextQuestion]
    if (!required.every(value => value.trim())) return setStatus('请补齐发现边界、处理理由、保持项、目标版本、回退信号和下一问题。')
    if (draft.disposition === '修改') {
      if (![draft.changedAxis, draft.concreteChange, draft.rejectedOption].every(value => value.trim())) return setStatus('选择“修改”时，请写单一变化轴、具体改动和暂不采用的方案。')
      if (draft.candidateSolutions.split('\n').filter(line => line.trim()).length < 2) return setStatus('选择“修改”时，至少写两个候选方案，每行一个，再说明为什么暂不采用其中之一。')
    }
    const completed = { ...draft, completedAt: new Date().toISOString() }
    setDraft(completed); setRecords(current => [completed, ...current.filter(record => record.id !== completed.id)]); setStatus('证据复盘与变更简报已保存。改动仍需下一场测试验证。')
  }
  const exportReviews = () => {
    downloadJson(`${draft.projectName || '桌游项目'}-${draft.targetVersion || draft.sourceVersion || '版本'}-证据复盘与变更简报.json`, {
      schema_version: 2, method: 'evidence-review-and-change-brief', local_first: true, no_automatic_insight: true, no_automatic_severity: true, no_frequency_priority: true, no_solution_from_suggestion: true, no_causal_proof: true, no_silent_project_mutation: true, source_withdrawal_cascades_locally: true,
      evidence_boundary: '发现只适用于所列来源会话、版本、玩家配置、媒介和主持条件；选择、分组、次数与处理动作都不证明严重度、因果、群体偏好或改动有效。', draft, saved_records: records, exported_at: new Date().toISOString(),
    }); setStatus('复盘包已导出；没有自动洞察、严重度、次数优先级或项目静默写回。')
  }
  const copyToProject = () => {
    if (!draft.completedAt || !draft.nextQuestion.trim()) return setStatus('先保存完整变更简报，再显式复制为项目下一步。')
    const action = draft.disposition === '修改' ? `${draft.targetVersion}：${draft.concreteChange}；随后测试“${draft.nextQuestion}”` : `${draft.targetVersion || draft.sourceVersion}：${draft.disposition}；下一步验证“${draft.nextQuestion}”`
    onCopyProjectNextAction(action); setStatus('已显式复制为项目下一步；来源会话和复盘记录没有被修改。')
  }
  const newDraftAction = () => {
    if (!newArmed) { setNewArmed(true); return setStatus('再次点击确认新建复盘草稿；已保存的复盘不会删除。') }
    setDraft(emptyDraft()); setStep('source'); setNewArmed(false); setStatus('已新建复盘草稿；历史记录仍在当前浏览器。')
  }

  if (!sessions.length && !draft.sourceSessionId) return <section className="tool-surface evidence-review-tool is-empty"><h2>证据复盘与变更简报</h2><p className="tool-intro">先保留证据，再决定下一版。</p><div className="review-empty"><h3>还没有已完成的现场会话</h3><p>先完成并保存一场现场测试。旧版反馈记录会迁移为历史，但不会伪造缺失的版本和来源。</p><button className="primary-button" onClick={onOpenSession}>打开现场测试记录</button></div></section>

  return <section className="tool-surface evidence-review-tool">
    <header className="review-heading"><div><h2>证据复盘与变更简报</h2><p className="tool-intro">先保留证据，再决定下一版。</p></div><p>草稿自动保存在当前浏览器<br /><small>{records.length} 份已保存复盘</small></p></header>
    <nav className="review-steps" aria-label="证据复盘步骤">{steps.map(item => <button key={item.id} type="button" className={step === item.id ? 'is-active' : ''} aria-pressed={step === item.id} onClick={() => setStep(item.id)}><span>{item.number}</span>{item.label}</button>)}</nav>
    <p className="review-step-note">{steps.find(item => item.id === step)?.note}</p>

    <div className="review-grid">
      <aside className="review-source"><h3>{step === 'decision' ? '发现快照' : '来源会话'}</h3>{draft.sourceSessionId ? <><strong>{draft.projectName} · {draft.sourceVersion}</strong><p>本场问题：<br />{draft.sourceQuestion}</p><dl>{counts.map(item => <div key={item.relation}><dt>{item.relation}</dt><dd>{item.count}</dd></div>)}</dl><small>数量只用于回到原记录。<br />会话 {draft.sourceSessionId.slice(0, 8)}</small></> : <><label><span>选择已完成会话</span><select value={selectedSessionId} onChange={event => setSelectedSessionId(event.target.value)}>{sessions.map(session => <option key={session.id} value={session.id}>{session.projectName} · {session.version} · {session.completedAt.slice(0, 10)}</option>)}</select></label><button className="primary-button" type="button" onClick={importSession}>导入最近已完成会话</button></>}{draft.sourceSessionId && step === 'source' && <button className="text-action" type="button" onClick={importSession}>重新承接所选会话 →</button>}</aside>

      <section className="review-main" aria-label="复盘主工作区">
        {step === 'source' && <section className="review-source-summary"><h3>承接边界</h3><p>导入只复制本场的版本、问题、语境和原始事件引用。它不会把会话判断当成最终发现，也不会改写原会话。</p>{sourceSession ? <dl><div><dt>实际语境</dt><dd>{draft.sourceContext}</dd></div><div><dt>本场判断</dt><dd>{sourceSession.outcome}</dd></div><div><dt>来自主持人的最强观察</dt><dd>{sourceSession.strongestObservation}</dd></div></dl> : <p>来源会话已不在本站存储；请撤回这份草稿或重新承接。</p>}</section>}
        {step === 'evidence' && <section className="review-evidence"><header><h3>原始证据</h3><p>选择会改变本轮判断的证据；未选不等于无效。</p></header>{draft.evidencePool.map(item => <label key={item.id} className={draft.selectedEvidenceIds.includes(item.id) ? 'review-evidence-row is-selected' : 'review-evidence-row'}><input type="checkbox" checked={draft.selectedEvidenceIds.includes(item.id)} onChange={() => toggleEvidence(item.id)} /><span className="review-evidence-meta"><strong>{item.label}</strong><small>{item.actorAlias} · {item.kind} · {item.relation}</small></span><span><strong>{item.observation}</strong><small>可见状态：{item.visibleState}<br />随后结果：{item.resolution}</small></span></label>)}<button className="primary-button" type="button" onClick={continueToFinding}>用所选证据形成发现 →</button></section>}
        {step === 'finding' && <section className="review-finding"><h3>本轮发现</h3><label><span>发现陈述 *</span><textarea value={draft.findingStatement} onChange={event => update('findingStatement', event.target.value)} placeholder="描述证据共同说明了什么，不写解决方案。" /></label><label><span>适用条件 *</span><textarea value={draft.appliesWhen} onChange={event => update('appliesWhen', event.target.value)} placeholder="它适用于哪个版本、玩家配置、阶段或媒介？" /></label><label><span>反证／其他解释 *</span><textarea value={draft.counterEvidence} onChange={event => update('counterEvidence', event.target.value)} /></label><label><span>仍缺什么证据 *</span><textarea value={draft.missingEvidence} onChange={event => update('missingEvidence', event.target.value)} /></label><p className="review-margin-note">事件数量不是严重度；分组不是自动结论。</p><button className="primary-button" type="button" onClick={continueToDecision}>继续到版本决定 →</button></section>}
        {step === 'decision' && <form className="review-decision" onSubmit={saveReview}><h3>决定理由</h3><fieldset><legend>这份发现现在怎样处理 *</legend>{(['保护', '修改', '继续调查', '暂存', '不改'] as Disposition[]).map(value => <label key={value}><input type="radio" name="disposition" checked={draft.disposition === value} onChange={() => update('disposition', value)} /><span>{value}</span></label>)}</fieldset><label><span>为什么现在这样处理 *</span><textarea value={draft.rationale} onChange={event => update('rationale', event.target.value)} /></label><label><span>下一版必须保持 *</span><textarea value={draft.keepSame} onChange={event => update('keepSame', event.target.value)} /></label><label><span>候选方案（选择修改时至少两个，每行一个）</span><textarea value={draft.candidateSolutions} onChange={event => update('candidateSolutions', event.target.value)} /></label><label><span>暂不采用的方案与理由</span><textarea value={draft.rejectedOption} onChange={event => update('rejectedOption', event.target.value)} /></label><p className="review-margin-note">建议不是待办；选中的改动仍是假设。</p></form>}
      </section>

      <aside className="review-inspector">{step === 'decision' ? <form onSubmit={saveReview}><h3>变更简报</h3><label><span>目标版本 *</span><input value={draft.targetVersion} onChange={event => update('targetVersion', event.target.value)} placeholder="v0.5" /></label><label><span>只改变一个轴</span><input value={draft.changedAxis} onChange={event => update('changedAxis', event.target.value)} /></label><label><span>具体规则／组件改动</span><textarea value={draft.concreteChange} onChange={event => update('concreteChange', event.target.value)} /></label><label><span>回退或停止信号 *</span><textarea value={draft.rollbackSignal} onChange={event => update('rollbackSignal', event.target.value)} /></label><label><span>下一场唯一问题 *</span><textarea value={draft.nextQuestion} onChange={event => update('nextQuestion', event.target.value)} /></label><dl><div><dt>来源会话 ID</dt><dd>{draft.sourceSessionId}</dd></div><div><dt>来源计划 ID</dt><dd>{draft.sourcePlanId}</dd></div></dl><button className="primary-button" type="submit">保存变更简报</button><button className="text-action" type="button" onClick={exportReviews}>导出 JSON →</button><button className="text-action" type="button" onClick={copyToProject}>复制为项目下一步 →</button>{draft.completedAt && <button className="text-action" type="button" onClick={onSynthesize}>用多轮复盘检查发现演化 →</button>}</form> : <section><h3>本轮发现</h3><dl><div><dt>发现陈述</dt><dd>{draft.findingStatement || '尚未形成发现。'}</dd></div><div><dt>适用条件</dt><dd>{draft.appliesWhen || '尚未写适用条件。'}</dd></div><div><dt>反证／其他解释</dt><dd>{draft.counterEvidence || '尚未记录。'}</dd></div><div><dt>仍缺什么证据</dt><dd>{draft.missingEvidence || '尚未记录。'}</dd></div></dl><p className="review-boundary">事件数量不是严重度；分组不是自动结论。</p></section>}</aside>
    </div>

    <footer className="review-footer"><p>来源{draft.sourceSessionId ? '已冻结' : '未选择'} · {draft.selectedEvidenceIds.length} 条证据已选 · 决定未自动写回项目</p><button type="button" className={newArmed ? 'review-new is-armed' : 'review-new'} onClick={newDraftAction}>{newArmed ? '确认新建复盘草稿' : '新建复盘草稿'}</button><div className="form-status" aria-live="polite">{status}</div></footer>
  </section>
}
