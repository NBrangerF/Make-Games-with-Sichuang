import { FormEvent, useEffect, useMemo, useState } from 'react'
import { EVIDENCE_SYNTHESIS_STORAGE_KEY, FEEDBACK_REVIEW_STORAGE_KEY } from './storage-keys'

type SynthesisStep = 'select' | 'boundary' | 'evolution' | 'decision'
type SourceRelation = '支持' | '反驳' | '收窄' | '不可比' | '仅作背景'
type Lifecycle = '暂定' | '保留' | '收窄' | '拆分' | '被反驳' | '退役'

type EvidenceItem = {
  id: string
  label: string
  observation: string
}

type ReviewRecord = {
  id: string
  sourceSessionId: string
  projectName: string
  sourceVersion: string
  sourceQuestion: string
  sourceContext: string
  selectedEvidenceIds: string[]
  evidencePool: EvidenceItem[]
  findingStatement: string
  appliesWhen: string
  counterEvidence: string
  missingEvidence: string
  targetVersion: string
  changedAxis: string
  concreteChange: string
  nextQuestion: string
  completedAt: string
}

type SourceSnapshot = {
  reviewId: string
  sessionId: string
  projectName: string
  sourceVersion: string
  targetVersion: string
  question: string
  context: string
  finding: string
  appliesWhen: string
  counterEvidence: string
  changedAxis: string
  concreteChange: string
  completedAt: string
  evidenceRefs: { id: string; label: string; observation: string }[]
}

type SynthesisDraft = {
  id: string
  lineageId: string
  revision: number
  parentRecordId: string
  revisionReason: string
  selectedReviewIds: string[]
  sources: SourceSnapshot[]
  relations: Record<string, SourceRelation>
  sharedQuestion: string
  heldComparable: string
  materialDifferences: string
  notComparableReason: string
  currentStatement: string
  applicability: string
  negativeCase: string
  rivalExplanation: string
  missingConfiguration: string
  lifecycle: Lifecycle
  rationale: string
  whatNotClaiming: string
  nextComparison: string
  branchAStatement: string
  branchABoundary: string
  branchBStatement: string
  branchBBoundary: string
  projectNextAction: string
  createdAt: string
  completedAt: string
}

type SynthesisStore = { schemaVersion: 2; draft: SynthesisDraft; records: SynthesisDraft[] }

const steps: { id: SynthesisStep; number: string; label: string; note: string }[] = [
  { id: 'select', number: '01', label: '选择复盘', note: '至少选择两份已完成复盘；来源不会自动合并。' },
  { id: 'boundary', number: '02', label: '建立可比边界', note: '先写共同问题与关键差异，再解释哪些材料可以放在一起读。' },
  { id: 'evolution', number: '03', label: '检查演化', note: '逐份标记支持、反驳、收窄、不可比或仅作背景；不按次数表决。' },
  { id: 'decision', number: '04', label: '决定下一步', note: '保留发现如何变化的理由；综合记录不会自动改写项目。' },
]

const relations: SourceRelation[] = ['支持', '反驳', '收窄', '不可比', '仅作背景']
const lifecycles: Lifecycle[] = ['暂定', '保留', '收窄', '拆分', '被反驳', '退役']

function emptyDraft(): SynthesisDraft {
  const id = crypto.randomUUID()
  return {
    id, lineageId: id, revision: 1, parentRecordId: '', revisionReason: '', selectedReviewIds: [], sources: [], relations: {}, sharedQuestion: '', heldComparable: '', materialDifferences: '', notComparableReason: '', currentStatement: '', applicability: '', negativeCase: '', rivalExplanation: '', missingConfiguration: '', lifecycle: '暂定', rationale: '', whatNotClaiming: '', nextComparison: '', branchAStatement: '', branchABoundary: '', branchBStatement: '', branchBBoundary: '', projectNextAction: '', createdAt: new Date().toISOString(), completedAt: '',
  }
}

function readReviews(): ReviewRecord[] {
  try {
    const stored = JSON.parse(localStorage.getItem(FEEDBACK_REVIEW_STORAGE_KEY) || 'null')
    if (stored?.schemaVersion !== 2 || !Array.isArray(stored.records)) return []
    return stored.records.filter((record: ReviewRecord) => record.completedAt && record.sourceSessionId)
  } catch { return [] }
}

function readStore(): SynthesisStore {
  const fallback: SynthesisStore = { schemaVersion: 2, draft: emptyDraft(), records: [] }
  try {
    const stored = JSON.parse(localStorage.getItem(EVIDENCE_SYNTHESIS_STORAGE_KEY) || 'null')
    if (![1, 2].includes(stored?.schemaVersion)) return fallback
    const migrateRecord = (record: Partial<SynthesisDraft>): SynthesisDraft => {
      const base = emptyDraft()
      const id = record.id || base.id
      return { ...base, ...record, id, lineageId: record.lineageId || id, revision: Number.isInteger(record.revision) && Number(record.revision) > 0 ? Number(record.revision) : 1, parentRecordId: record.parentRecordId || '', revisionReason: record.revisionReason || '' }
    }
    const records = Array.isArray(stored.records) ? stored.records.map(migrateRecord) : []
    const migratedDraft = stored.draft ? migrateRecord(stored.draft) : emptyDraft()
    return { schemaVersion: 2, draft: migratedDraft.completedAt ? emptyDraft() : migratedDraft, records }
  } catch { return fallback }
}

function snapshotReview(review: ReviewRecord): SourceSnapshot {
  const selected = new Set(review.selectedEvidenceIds || [])
  return {
    reviewId: review.id, sessionId: review.sourceSessionId, projectName: review.projectName, sourceVersion: review.sourceVersion, targetVersion: review.targetVersion, question: review.sourceQuestion, context: review.sourceContext, finding: review.findingStatement, appliesWhen: review.appliesWhen, counterEvidence: review.counterEvidence, changedAxis: review.changedAxis, concreteChange: review.concreteChange, completedAt: review.completedAt,
    evidenceRefs: (review.evidencePool || []).filter(item => selected.has(item.id)).map(item => ({ id: item.id, label: item.label, observation: item.observation })),
  }
}

function downloadJson(filename: string, payload: unknown) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob); const anchor = document.createElement('a'); anchor.href = url; anchor.download = filename; anchor.click(); URL.revokeObjectURL(url)
}

export function EvidenceSynthesisWorkbench({ onOpenReview, onCopyProjectNextAction }: { onOpenReview: () => void; onCopyProjectNextAction: (nextAction: string) => void }) {
  const reviews = useMemo(readReviews, [])
  const initial = useMemo(readStore, [])
  const [draft, setDraft] = useState(initial.draft)
  const [records, setRecords] = useState(initial.records)
  const [step, setStep] = useState<SynthesisStep>(draft.sources.length >= 2 ? 'boundary' : 'select')
  const [status, setStatus] = useState(reviews.length >= 2 ? '请选择至少两份已完成复盘。' : '还需要至少两份已完成复盘。')
  const [newArmed, setNewArmed] = useState(false)
  const [historyOpen, setHistoryOpen] = useState(false)
  const [viewingRecordId, setViewingRecordId] = useState('')

  useEffect(() => { localStorage.setItem(EVIDENCE_SYNTHESIS_STORAGE_KEY, JSON.stringify({ schemaVersion: 2, draft, records })) }, [draft, records])
  const update = <K extends keyof SynthesisDraft>(key: K, value: SynthesisDraft[K]) => { setDraft(current => ({ ...current, [key]: value })); setStatus('综合草稿已在当前浏览器更新。'); setNewArmed(false) }
  const viewingRecord = records.find(record => record.id === viewingRecordId)
  const sortedRecords = useMemo(() => [...records].sort((a, b) => b.completedAt.localeCompare(a.completedAt)), [records])
  const latestRevision = (record: SynthesisDraft) => Math.max(...records.filter(item => item.lineageId === record.lineageId).map(item => item.revision), record.revision)

  const toggleReview = (reviewId: string) => {
    const selected = draft.selectedReviewIds.includes(reviewId) ? draft.selectedReviewIds.filter(id => id !== reviewId) : [...draft.selectedReviewIds, reviewId]
    update('selectedReviewIds', selected)
  }

  const freezeSources = () => {
    if (draft.selectedReviewIds.length < 2) return setStatus('请至少选择两份已完成复盘。')
    const selectedReviews = reviews.filter(review => draft.selectedReviewIds.includes(review.id)).sort((a, b) => a.completedAt.localeCompare(b.completedAt))
    const sources = selectedReviews.map(snapshotReview)
    const nextRelations = Object.fromEntries(Object.entries(draft.relations).filter(([reviewId]) => sources.some(source => source.reviewId === reviewId))) as Record<string, SourceRelation>
    setDraft(current => ({ ...current, sources, relations: nextRelations }))
    setStep('boundary'); setStatus('已冻结所选复盘的版本、语境、发现与直接证据引用；原记录没有被修改。')
  }

  const continueToEvolution = () => {
    if (![draft.sharedQuestion, draft.heldComparable, draft.materialDifferences].every(value => value.trim())) return setStatus('请写共同问题、可比较依据与关键差异。')
    setStep('evolution'); setStatus('可比边界已写明。现在逐份判断它与当前发现的关系。')
  }

  const continueToDecision = () => {
    if (!draft.sources.every(source => draft.relations[source.reviewId])) return setStatus('请为每份来源复盘标记关系。')
    if (![draft.currentStatement, draft.applicability, draft.negativeCase, draft.rivalExplanation, draft.missingConfiguration].every(value => value.trim())) return setStatus('请补齐当前表述、适用边界、反例、竞争解释与缺失配置。')
    setStep('decision'); setStatus('发现演化已经写明；请选择保留、收窄、拆分、反驳或退役等处理方式。')
  }

  const saveSynthesis = (event: FormEvent) => {
    event.preventDefault()
    if (records.some(record => record.id === draft.id) || draft.completedAt) return setStatus('已保存记录不可原地覆盖；请从历史记录创建后继修订。')
    const required = [draft.rationale, draft.whatNotClaiming, draft.nextComparison, draft.projectNextAction]
    if (!required.every(value => value.trim())) return setStatus('请补齐处理理由、没有声称什么、下一轮只比较什么与建议的项目下一步。')
    if (draft.revision > 1 && !draft.revisionReason.trim()) return setStatus('后继修订必须说明为什么需要改变上一份判断。')
    if (draft.lifecycle === '拆分' && ![draft.branchAStatement, draft.branchABoundary, draft.branchBStatement, draft.branchBBoundary].every(value => value.trim())) return setStatus('选择“拆分”时，请补齐两个分支的表述与适用边界。')
    const completed = { ...draft, completedAt: new Date().toISOString() }
    setRecords(current => [completed, ...current]); setDraft(emptyDraft()); setViewingRecordId(completed.id); setHistoryOpen(true); setStatus('不可变发现修订已保存；后续变化需要从这份记录创建后继。')
  }

  const exportSyntheses = () => {
    const activeRecord = viewingRecord || draft
    downloadJson(`${activeRecord.sources[0]?.projectName || '桌游项目'}-发现演化与版本证据.json`, {
      schema_version: 2, method: 'cross-session-evidence-synthesis', local_first: true, immutable_completed_records: true, explicit_successor_revision: true, manual_source_selection: true, manual_relation_assignment: true, no_automatic_insight: true, no_automatic_clustering: true, no_majority_vote: true, no_automatic_lifecycle: true, no_automatic_severity: true, no_frequency_priority: true, no_false_replication_across_versions: true, no_causal_proof: true, no_silent_project_mutation: true, source_withdrawal_cascades_locally: true,
      evidence_boundary: '综合只适用于列明的问题、版本、玩家配置、媒介、主持与改动轴；支持、反驳或出现次数都不证明严重度、优先级、因果、代表性或改动有效。', active_record: activeRecord, draft, saved_records: records, exported_at: new Date().toISOString(),
    }); setStatus('综合包已导出；没有自动聚类、表决、严重度、因果或项目静默写回。')
  }

  const copyToProject = () => {
    const record = viewingRecord
    if (!record?.completedAt || !record.projectNextAction.trim()) return setStatus('先打开一份已保存发现沿革，再显式复制为项目下一步。')
    onCopyProjectNextAction(record.projectNextAction); setStatus(`已显式复制修订 ${record.revision} 为项目下一步；历史记录没有被修改。`)
  }

  const openRecord = (recordId: string) => { setViewingRecordId(recordId); setHistoryOpen(true); setStatus('已以只读方式打开历史修订；创建后继才能修改判断。') }
  const openHistory = () => { const first = sortedRecords[0]; if (first) openRecord(first.id); else setStatus('还没有已保存的发现沿革。') }
  const createSuccessor = (record: SynthesisDraft) => {
    const id = crypto.randomUUID()
    const revision = latestRevision(record) + 1
    setDraft({ ...record, id, lineageId: record.lineageId || record.id, revision, parentRecordId: record.id, revisionReason: '', createdAt: new Date().toISOString(), completedAt: '', projectNextAction: '' })
    setViewingRecordId(''); setHistoryOpen(false); setStep('boundary'); setNewArmed(false); setStatus(`已从修订 ${record.revision} 创建后继修订 ${revision}；原记录保持只读。`)
  }

  const newDraftAction = () => {
    if (!newArmed) { setNewArmed(true); return setStatus('再次点击确认新建综合草稿；已保存的发现沿革不会删除。') }
    setDraft(emptyDraft()); setViewingRecordId(''); setHistoryOpen(false); setStep('select'); setNewArmed(false); setStatus('已新建独立沿革草稿；历史记录仍在当前浏览器。')
  }

  if (reviews.length < 2 && draft.sources.length < 2 && records.length === 0) return <section className="tool-surface evidence-synthesis-tool is-empty"><h2>发现演化与版本证据</h2><p className="tool-intro">把不同轮次放回各自语境，再决定发现如何变化。</p><div className="synthesis-empty"><h3>还需要至少两份已完成复盘</h3><p>先分别完成两场会话的证据复盘。跨轮综合不会从原始会话自动聚类，也不会把一场里的多条事件当成多次验证。</p><button className="primary-button" onClick={onOpenReview}>打开证据复盘</button></div></section>

  if (historyOpen && records.length) {
    const record = viewingRecord || sortedRecords[0]
    const parent = record ? records.find(item => item.id === record.parentRecordId) : undefined
    const currentLatestRevision = record ? latestRevision(record) : 0
    return <section className="tool-surface evidence-synthesis-tool synthesis-history-tool">
      <header className="synthesis-heading"><div><h2>发现演化与版本证据</h2><p className="tool-intro">已保存记录保持只读；变化通过后继修订表达。</p></div><button className="text-action" type="button" onClick={() => { setHistoryOpen(false); setViewingRecordId('') }}>返回当前草稿 →</button></header>
      <div className="synthesis-history-banner"><strong>发现沿革</strong><span>旧修订不会被覆盖；“最新”只表示保存顺序，不表示更正确。</span></div>
      <div className="synthesis-history-grid">
        <aside className="synthesis-history-list"><h3>已保存修订</h3>{sortedRecords.map(item => <button type="button" key={item.id} className={record?.id === item.id ? 'is-active' : ''} onClick={() => openRecord(item.id)}><span>修订 {item.revision} · {item.lifecycle}</span><strong>{item.currentStatement}</strong><small>{item.completedAt.slice(0, 10)} · 沿革 {item.lineageId.slice(0, 8)}</small></button>)}</aside>
        <section className="synthesis-record-view" aria-label="只读发现修订">
          <header><div><span>修订 {record.revision} · {record.lifecycle}</span><h3>{record.currentStatement}</h3></div>{record.revision < currentLatestRevision && <p>此沿革另有较新的修订 {currentLatestRevision}</p>}</header>
          <dl>
            <div><dt>共同问题</dt><dd>{record.sharedQuestion}</dd></div>
            <div><dt>适用边界</dt><dd>{record.applicability}</dd></div>
            <div><dt>本次修订理由</dt><dd>{record.revisionReason || '第一份记录，没有父修订。'}</dd></div>
            <div><dt>处理理由</dt><dd>{record.rationale}</dd></div>
            <div><dt>反例</dt><dd>{record.negativeCase}</dd></div>
            <div><dt>竞争解释</dt><dd>{record.rivalExplanation}</dd></div>
            <div><dt>仍缺配置</dt><dd>{record.missingConfiguration}</dd></div>
            <div><dt>没有声称什么</dt><dd>{record.whatNotClaiming}</dd></div>
            <div><dt>下一轮只比较</dt><dd>{record.nextComparison}</dd></div>
            <div><dt>当时建议下一步</dt><dd>{record.projectNextAction}</dd></div>
          </dl>
          {record.lifecycle === '拆分' && <section className="synthesis-history-split"><h4>拆分分支</h4><div><article><strong>分支 A</strong><p>{record.branchAStatement}</p><small>{record.branchABoundary}</small></article><article><strong>分支 B</strong><p>{record.branchBStatement}</p><small>{record.branchBBoundary}</small></article></div></section>}
          <section className="synthesis-record-sources"><h4>来源复盘与关系</h4>{record.sources.map(source => <div key={source.reviewId}><span><strong>{source.sourceVersion || '版本未写'} · {record.relations[source.reviewId]}</strong><small>{source.context}</small></span><button type="button" className="text-action" onClick={onOpenReview}>查看单轮证据 →</button></div>)}</section>
        </section>
        <aside className="synthesis-history-inspector"><h3>沿革关系</h3><dl><div><dt>沿革 ID</dt><dd>{record.lineageId}</dd></div><div><dt>修订</dt><dd>{record.revision}</dd></div><div><dt>父记录</dt><dd>{parent ? <button type="button" className="inline-link" onClick={() => openRecord(parent.id)}>修订 {parent.revision}</button> : '无'}</dd></div><div><dt>创建时间</dt><dd>{record.createdAt}</dd></div><div><dt>保存时间</dt><dd>{record.completedAt}</dd></div></dl><p className="synthesis-warning">只读重开不会把旧判断变成当前真相，也不会改写项目。</p><button className="primary-button" type="button" onClick={() => createSuccessor(record)}>从这份记录创建后继修订</button><button className="text-action" type="button" onClick={exportSyntheses}>导出含沿革的 JSON →</button><button className="text-action" type="button" onClick={copyToProject}>复制这份记录为项目下一步 →</button></aside>
      </div>
      <footer className="synthesis-footer"><p>只读查看 · 沿革关系显式 · 保存记录不可原地覆盖</p><button type="button" className={newArmed ? 'synthesis-new is-armed' : 'synthesis-new'} onClick={newDraftAction}>{newArmed ? '确认新建独立沿革' : '新建独立沿革'}</button><div className="form-status" aria-live="polite">{status}</div></footer>
    </section>
  }

  const selectedSources = draft.sources.filter(source => draft.selectedReviewIds.includes(source.reviewId))
  return <section className="tool-surface evidence-synthesis-tool">
    <header className="synthesis-heading"><div><h2>发现演化与版本证据</h2><p className="tool-intro">把不同轮次放回各自语境，再决定发现如何变化。</p></div><div className="synthesis-heading-actions"><p>草稿自动保存在当前浏览器<br /><small>{records.length} 份已保存发现沿革</small></p>{records.length > 0 && <button className="text-action" type="button" onClick={openHistory}>查看已保存沿革 →</button>}</div></header>
    <nav className="synthesis-steps" aria-label="发现演化步骤">{steps.map(item => <button key={item.id} type="button" className={step === item.id ? 'is-active' : ''} aria-pressed={step === item.id} onClick={() => setStep(item.id)}><span>{item.number}</span>{item.label}</button>)}</nav>
    <p className="synthesis-step-note">{steps.find(item => item.id === step)?.note}</p>

    <div className="synthesis-grid">
      <aside className="synthesis-sources"><h3>{step === 'decision' ? '发现沿革' : '已选复盘'}</h3>{step === 'select' ? reviews.map(review => <label key={review.id} className={draft.selectedReviewIds.includes(review.id) ? 'synthesis-source is-selected' : 'synthesis-source'}><input type="checkbox" checked={draft.selectedReviewIds.includes(review.id)} onChange={() => toggleReview(review.id)} /><span><strong>{review.sourceVersion || '版本未写'} · {review.projectName}</strong><small>{review.completedAt.slice(0, 10)}<br />{review.sourceContext || '语境未写'}</small></span></label>) : selectedSources.map(source => <div key={source.reviewId} className="synthesis-lineage"><span>{source.sourceVersion || '版本未写'}</span><strong>{draft.relations[source.reviewId] || '未标记'}</strong><small>{source.completedAt.slice(0, 10)}<br />{source.context}</small><button type="button" className="text-action" onClick={onOpenReview}>查看单轮证据 →</button></div>)}</aside>

      <section className="synthesis-main" aria-label="综合主工作区">
        {step === 'select' && <section className="synthesis-select"><h3>选择同一设计问题的复盘</h3><p>选择不是认定它们可比。下一步仍要说明共同问题、保持相近的条件，以及版本与玩家语境发生了什么变化。</p><button className="primary-button" type="button" onClick={freezeSources}>冻结所选来源 →</button></section>}
        {step === 'boundary' && <section className="synthesis-boundary"><h3>可比边界</h3>{draft.revision > 1 && <label className="synthesis-revision-reason"><span>为什么创建后继修订 {draft.revision}？ *</span><textarea value={draft.revisionReason} onChange={event => update('revisionReason', event.target.value)} placeholder="写哪份新证据或哪项边界变化让上一份判断需要修订。" /></label>}<label><span>这些复盘共同回答什么问题？ *</span><textarea value={draft.sharedQuestion} onChange={event => update('sharedQuestion', event.target.value)} /></label><label><span>哪些条件足够接近，可以放在一起读？ *</span><textarea value={draft.heldComparable} onChange={event => update('heldComparable', event.target.value)} placeholder="例如：同一核心任务、同一胜利条件、都为四人完整局。" /></label><label><span>版本、玩家、媒介或主持有哪些关键差异？ *</span><textarea value={draft.materialDifferences} onChange={event => update('materialDifferences', event.target.value)} /></label><label><span>哪些部分明确不能比较？</span><textarea value={draft.notComparableReason} onChange={event => update('notComparableReason', event.target.value)} /></label><p className="synthesis-warning">同样措辞不等于同一构念；版本不同也不是重复验证。</p><button className="primary-button" type="button" onClick={continueToEvolution}>建立时间顺序矩阵 →</button></section>}
        {step === 'evolution' && <section className="synthesis-evolution"><header><h3>时间顺序证据矩阵</h3><p>每行仍链接到一份单轮复盘及其直接证据。</p></header><div className="synthesis-matrix" role="table"><div className="synthesis-matrix-head" role="row"><span>版本与语境</span><span>本轮发现</span><span>与当前判断的关系</span><span>直接证据</span></div>{selectedSources.map(source => <div className={draft.relations[source.reviewId] === '反驳' ? 'synthesis-matrix-row is-contrary' : 'synthesis-matrix-row'} role="row" key={source.reviewId}><span><strong>{source.sourceVersion}</strong><small>{source.context}<br />改动轴：{source.changedAxis || '未写'}</small></span><span><strong>{source.finding}</strong><small>{source.appliesWhen}</small></span><span className="synthesis-relations">{relations.map(relation => <button type="button" key={relation} className={draft.relations[source.reviewId] === relation ? 'is-active' : ''} onClick={() => update('relations', { ...draft.relations, [source.reviewId]: relation })}>{relation}</button>)}</span><span><strong>{source.evidenceRefs[0]?.observation || '来源复盘未保留可显示证据'}</strong><small>{source.evidenceRefs.length} 条已选证据 · <button type="button" className="inline-link" onClick={onOpenReview}>查看证据链</button></small></span></div>)}</div><p className="synthesis-warning">出现次数不是优先级；反例不会被多数票吞掉。</p></section>}
        {step === 'decision' && <form className="synthesis-decision" onSubmit={saveSynthesis}><h3>这次怎样处理发现</h3>{draft.revision > 1 && <p className="synthesis-successor-note">后继修订 {draft.revision} · 源于记录 {draft.parentRecordId.slice(0, 8)} · {draft.revisionReason || '尚未说明修订理由'}</p>}<blockquote>{draft.currentStatement}</blockquote><fieldset><legend>发现生命周期 *</legend>{lifecycles.map(value => <label key={value}><input type="radio" name="lifecycle" checked={draft.lifecycle === value} onChange={() => update('lifecycle', value)} /><span>{value}</span></label>)}</fieldset>{draft.lifecycle === '拆分' && <div className="synthesis-split"><section><h4>分支 A</h4><label><span>发现表述 *</span><textarea value={draft.branchAStatement} onChange={event => update('branchAStatement', event.target.value)} /></label><label><span>适用边界 *</span><textarea value={draft.branchABoundary} onChange={event => update('branchABoundary', event.target.value)} /></label></section><section><h4>分支 B</h4><label><span>发现表述 *</span><textarea value={draft.branchBStatement} onChange={event => update('branchBStatement', event.target.value)} /></label><label><span>适用边界 *</span><textarea value={draft.branchBBoundary} onChange={event => update('branchBBoundary', event.target.value)} /></label></section></div>}<label><span>为什么这样处理，而不是多数表决？ *</span><textarea value={draft.rationale} onChange={event => update('rationale', event.target.value)} /></label><label><span>没有声称什么？ *</span><textarea value={draft.whatNotClaiming} onChange={event => update('whatNotClaiming', event.target.value)} placeholder="例如：没有证明改动造成结果，也没有代表全部玩家。" /></label><label><span>下一轮只比较什么？ *</span><textarea value={draft.nextComparison} onChange={event => update('nextComparison', event.target.value)} /></label></form>}
      </section>

      <aside className="synthesis-inspector"><h3>{step === 'decision' ? '版本决定简报' : '跨轮发现'}</h3>{step !== 'decision' ? <><label><span>当前表述 *</span><textarea value={draft.currentStatement} onChange={event => update('currentStatement', event.target.value)} /></label><label><span>适用边界 *</span><textarea value={draft.applicability} onChange={event => update('applicability', event.target.value)} /></label><label><span>哪个反例改变判断？ *</span><textarea value={draft.negativeCase} onChange={event => update('negativeCase', event.target.value)} /></label><label><span>竞争解释 *</span><textarea value={draft.rivalExplanation} onChange={event => update('rivalExplanation', event.target.value)} /></label><label><span>仍缺哪种玩家／局面？ *</span><textarea value={draft.missingConfiguration} onChange={event => update('missingConfiguration', event.target.value)} /></label>{step === 'evolution' && <button className="primary-button" type="button" onClick={continueToDecision}>决定发现怎样变化 →</button>}</> : <form onSubmit={saveSynthesis}><dl><div><dt>本次处理</dt><dd>{draft.lifecycle}</dd></div><div><dt>依据版本</dt><dd>{selectedSources.map(source => source.sourceVersion).join(' → ')}</dd></div><div><dt>当前边界</dt><dd>{draft.applicability}</dd></div><div><dt>仍缺配置</dt><dd>{draft.missingConfiguration}</dd></div></dl><p className="synthesis-warning">这不是因果证明，也不会自动设定严重度或优先级。</p><label><span>建议的项目下一步 *</span><textarea value={draft.projectNextAction} onChange={event => update('projectNextAction', event.target.value)} /></label><button className="primary-button" type="submit">保存发现沿革</button><button className="text-action" type="button" onClick={exportSyntheses}>导出 JSON →</button><p className="synthesis-step-note">保存后会自动打开只读记录，再由你显式复制为项目下一步。</p></form>}</aside>
    </div>
    <footer className="synthesis-footer"><p>来源{draft.sources.length >= 2 ? '已冻结' : '未冻结'} · 关系由设计师逐份判断 · 综合不会自动写回项目</p><button type="button" className={newArmed ? 'synthesis-new is-armed' : 'synthesis-new'} onClick={newDraftAction}>{newArmed ? '确认新建综合草稿' : '新建综合草稿'}</button><div className="form-status" aria-live="polite">{status}</div></footer>
  </section>
}
