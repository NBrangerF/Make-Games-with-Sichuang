import { FormEvent, useEffect, useMemo, useState } from 'react'
import { EXPERIENCE_INTENT_STORAGE_KEY } from './storage-keys'

type IntentStep = 'context' | 'decision' | 'pressure' | 'prediction' | 'boundary'
type IntentDraft = {
  projectName: string
  version: string
  startingPoint: string
  playerContext: string
  repeatedDecision: string
  decisionConsequence: string
  pressure: string
  visibleFeedback: string
  predictedBehavior: string
  disconfirmingSignal: string
  nonGoal: string
  testQuestion: string
}
type IntentRecord = IntentDraft & { id: string; createdAt: string }
type IntentStore = { schemaVersion: 1; draft: IntentDraft; records: IntentRecord[] }

const steps: { id: IntentStep; number: string; label: string; note: string }[] = [
  { id: 'context', number: '01', label: '玩家与语境', note: '先写这一版为谁、在什么条件下存在，不猜一类人的固定偏好。' },
  { id: 'decision', number: '02', label: '重复决定', note: '用动作和后果写玩家反复比较什么，不先列机制名。' },
  { id: 'pressure', number: '03', label: '压力与反馈', note: '决定要付出代价，后果也要能在桌面上被看见。' },
  { id: 'prediction', number: '04', label: '预测与反例', note: '预测必须允许真实玩家做出相反行为。' },
  { id: 'boundary', number: '05', label: '本轮边界', note: '只保留一条测试问题，并明确这轮不验证什么。' },
]

const createEmptyDraft = (): IntentDraft => ({
  projectName: '', version: '', startingPoint: '', playerContext: '', repeatedDecision: '', decisionConsequence: '',
  pressure: '', visibleFeedback: '', predictedBehavior: '', disconfirmingSignal: '', nonGoal: '', testQuestion: '',
})

function readStore(): IntentStore {
  const fallback: IntentStore = { schemaVersion: 1, draft: createEmptyDraft(), records: [] }
  try {
    const stored = JSON.parse(localStorage.getItem(EXPERIENCE_INTENT_STORAGE_KEY) || 'null')
    if (!stored || stored.schemaVersion !== 1) return fallback
    return {
      schemaVersion: 1,
      draft: { ...fallback.draft, ...stored.draft },
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

function validateDraft(draft: IntentDraft): { step: IntentStep; message: string } | null {
  if (![draft.projectName, draft.version, draft.startingPoint, draft.playerContext].every(value => value.trim())) return { step: 'context', message: '请补齐项目、版本、点子起点与目标玩家/语境。' }
  if (![draft.repeatedDecision, draft.decisionConsequence].every(value => value.trim())) return { step: 'decision', message: '请写清玩家反复比较的行动，以及不同选择改变什么。' }
  if (![draft.pressure, draft.visibleFeedback].every(value => value.trim())) return { step: 'pressure', message: '请写清决定为什么有代价，以及后果怎样在桌面上可见。' }
  if (![draft.predictedBehavior, draft.disconfirmingSignal].every(value => value.trim())) return { step: 'prediction', message: '行为预测和能反驳它的相反现象都必须写清。' }
  if (![draft.nonGoal, draft.testQuestion].every(value => value.trim())) return { step: 'boundary', message: '请写清本轮不验证什么，并留下第一条可观察测试问题。' }
  return null
}

export function ExperienceIntentCard({ onContinue }: { onContinue?: () => void }) {
  const [initial] = useState(readStore)
  const [draft, setDraft] = useState(initial.draft)
  const [records, setRecords] = useState(initial.records)
  const [step, setStep] = useState<IntentStep>('context')
  const [status, setStatus] = useState('草稿会自动保存在当前浏览器。')
  const [clearArmed, setClearArmed] = useState(false)

  useEffect(() => {
    localStorage.setItem(EXPERIENCE_INTENT_STORAGE_KEY, JSON.stringify({ schemaVersion: 1, draft, records }))
  }, [draft, records])

  const update = <K extends keyof IntentDraft>(key: K, value: IntentDraft[K]) => {
    setDraft(current => ({ ...current, [key]: value }))
    setStatus('草稿已在当前浏览器更新。')
    setClearArmed(false)
  }

  const hypothesis = useMemo(() => {
    if (![draft.playerContext, draft.repeatedDecision, draft.pressure, draft.visibleFeedback, draft.predictedBehavior].every(value => value.trim())) return ''
    return `在${draft.playerContext}中，玩家反复${draft.repeatedDecision}；因为${draft.pressure}，系统通过${draft.visibleFeedback}显示后果。我预计${draft.predictedBehavior}`
  }, [draft.playerContext, draft.predictedBehavior, draft.pressure, draft.repeatedDecision, draft.visibleFeedback])

  const saveRecord = (event: FormEvent) => {
    event.preventDefault()
    const problem = validateDraft(draft)
    if (problem) { setStep(problem.step); setStatus(`保存前${problem.message}`); return }
    const record: IntentRecord = { ...draft, id: crypto.randomUUID(), createdAt: new Date().toISOString() }
    setRecords(current => [record, ...current])
    setStatus('体验意图已保存。它是一条待检验假设，不代表目标体验已经出现。')
  }

  const exportPackage = () => {
    downloadJson(`${draft.projectName.trim() || '桌游项目'}-${draft.version.trim() || '体验意图'}-体验意图卡.json`, {
      schema_version: 1,
      method: 'experience-intent-card',
      local_first: true,
      no_fun_score: true,
      no_player_profile_inference: true,
      no_mechanic_recommendation: true,
      evidence_boundary: '体验意图只把当前设计方向变成可反驳假设；真实桌面行为、玩家语言与不同群体语境决定它是否成立。',
      draft,
      current_hypothesis: hypothesis,
      saved_records: records,
      exported_at: new Date().toISOString(),
    })
    setStatus('体验意图包已导出；文件不证明有趣、适合所有玩家或已经选到最佳机制。')
  }

  const clearDraft = () => {
    if (!clearArmed) {
      setClearArmed(true)
      setStatus('再次点击“确认清空草稿”；已保存的体验意图不会删除。')
      return
    }
    setDraft(createEmptyDraft())
    setStep('context')
    setClearArmed(false)
    setStatus('草稿已清空；已保存记录仍在当前浏览器。')
  }

  const continueToCoreLoop = () => {
    const problem = validateDraft(draft)
    if (problem) { setStep(problem.step); setStatus(`继续到核心循环前${problem.message}`); return }
    setStatus('体验意图字段已齐全；下一步显式导入原字段，再决定怎样实现规则循环。')
    onContinue?.()
  }

  return <section className="tool-surface experience-intent-tool">
    <div className="experience-intent-heading"><div><h2>体验意图卡</h2><p className="tool-intro">把模糊点子变成一条能被桌面行为反驳的假设。</p></div><p className="experience-intent-autosave" role="status">草稿自动保存在当前浏览器<br /><small>{records.length} 条体验意图记录</small></p></div>
    <nav className="experience-intent-steps" aria-label="体验意图卡步骤">
      {steps.map(item => <button key={item.id} type="button" className={step === item.id ? 'is-active' : ''} aria-pressed={step === item.id} onClick={() => setStep(item.id)}><span>{item.number}</span>{item.label}</button>)}
    </nav>
    <p className="experience-intent-note">{steps.find(item => item.id === step)?.note}</p>

    <form className="experience-intent-layout" onSubmit={saveRecord}>
      <div className="experience-intent-editor">
        {step === 'context' && <section aria-labelledby="intent-context-title"><h3 id="intent-context-title">玩家与游玩语境</h3><p className="section-copy">题材、机制、触感或一句情绪都可以是起点；先把它放进一个具体玩家与游玩条件中。</p>
          <div className="experience-intent-pair"><label><span>游戏/项目 *</span><input value={draft.projectName} onChange={event => update('projectName', event.target.value)} placeholder="未命名的海上贸易游戏" /></label><label><span>当前版本 *</span><input value={draft.version} onChange={event => update('version', event.target.value)} placeholder="v0.1" /></label></div>
          <label><span>最初的题材、机制、触感或问题 *</span><textarea value={draft.startingPoint} onChange={event => update('startingPoint', event.target.value)} placeholder="我想做一款让货物空间和航线位置互相拉扯的贸易游戏。" /></label>
          <label><span>目标玩家与游玩语境 *</span><textarea value={draft.playerContext} onChange={event => update('playerContext', event.target.value)} placeholder="3 到 4 名熟悉轻中策桌游的玩家，单局约 60 分钟" /></label>
          <p className="experience-intent-boundary">这里描述当前设计对象，不从年龄、身份或游戏经历猜测一类人的固定喜好。</p>
        </section>}

        {step === 'decision' && <section aria-labelledby="intent-decision-title"><h3 id="intent-decision-title">重复决定与后果</h3><p className="section-copy">不要只写“管理资源”或“做有意义的选择”。写玩家实际比较的动作，以及选择之后什么会不同。</p>
          <label><span>玩家反复在什么之间决定 *</span><textarea value={draft.repeatedDecision} onChange={event => update('repeatedDecision', event.target.value)} placeholder="在立刻交货得分，与保留货物前往更远港口之间选择" /></label>
          <label><span>不同选择会改变什么 *</span><textarea value={draft.decisionConsequence} onChange={event => update('decisionConsequence', event.target.value)} placeholder="交货会腾出货舱但放弃未来回报；保留会占用空间并承担航线被抢的风险。" /></label>
          <p className="experience-intent-boundary">此处不需要先决定“用手牌管理还是工人放置”。机制是下一阶段待比较的实现假设。</p>
        </section>}

        {step === 'pressure' && <section aria-labelledby="intent-pressure-title"><h3 id="intent-pressure-title">压力与可见反馈</h3><p className="section-copy">压力解释为什么不能同时得到所有好处；反馈解释玩家怎样看见行动与后果的关系。</p>
          <label><span>为什么这个决定有代价 *</span><textarea value={draft.pressure} onChange={event => update('pressure', event.target.value)} placeholder="货舱只有三格，而且对手可能先占用高需求港口" /></label>
          <label><span>系统怎样让后果可见 *</span><textarea value={draft.visibleFeedback} onChange={event => update('visibleFeedback', event.target.value)} placeholder="港口需求与对手航线公开；交货后立即更新分数、货舱与可用港口" /></label>
          <p className="experience-intent-boundary">“紧张”“沉浸”不是反馈。优先写玩家能读取、比较、执行或在下一次决定中使用的状态。</p>
        </section>}

        {step === 'prediction' && <section aria-labelledby="intent-prediction-title"><h3 id="intent-prediction-title">行为预测与反驳信号</h3><p className="section-copy">预测写桌面上可能发生什么；反例让你知道当前系统关系可能没有产生预期压力。</p>
          <label><span>预计看见的桌面行为 *</span><textarea value={draft.predictedBehavior} onChange={event => update('predictedBehavior', event.target.value)} placeholder="至少一名玩家会主动放弃一次立即可得的 1 分，保留货物争取更远港口" /></label>
          <label><span>什么现象会反驳这条预测 *</span><textarea value={draft.disconfirmingSignal} onChange={event => update('disconfirmingSignal', event.target.value)} placeholder="所有玩家整局都立即交货，或保留货物只是因为漏看当前得分" /></label>
          <p className="experience-intent-boundary">没有出现预测行为，不等于玩家“不会玩”。先检查规则关系、信息、代价和测试语境。</p>
        </section>}

        {step === 'boundary' && <section aria-labelledby="intent-boundary-title"><h3 id="intent-boundary-title">本轮边界与第一条问题</h3><p className="section-copy">边界防止一次测试同时承担主题、平衡、规则、历史准确性与市场价值。问题只观察当前预测。</p>
          <label><span>本轮明确不验证什么 *</span><textarea value={draft.nonGoal} onChange={event => update('nonGoal', event.target.value)} placeholder="不验证历史模拟准确性、美术吸引力或完整经济平衡" /></label>
          <label><span>第一条测试问题 *</span><textarea value={draft.testQuestion} onChange={event => update('testQuestion', event.target.value)} placeholder="在给定当前需求与已知航线时，玩家是否会为更远港口主动放弃一次立即得分？" /></label>
          <p className="experience-intent-boundary">不要问“好玩吗”“够不够策略”。测试后保留原话、实际动作和相反行为，再决定是否改规则。</p>
        </section>}
      </div>

      <aside className="experience-intent-summary" aria-label="当前体验意图摘要"><header><span>当前体验假设</span><h3>{hypothesis || '完成玩家、决定、压力、反馈与预测后，这里会形成一条可反驳假设。'}</h3><p>{draft.projectName || '未写项目'} · {draft.version || '未写版本'}</p></header>
        <dl><div><dt>玩家</dt><dd>{draft.playerContext || '尚未写目标玩家与语境。'}</dd></div><div><dt>决定</dt><dd>{draft.repeatedDecision || '尚未写重复决定。'}</dd></div><div><dt>压力</dt><dd>{draft.pressure || '尚未写决定为什么困难。'}</dd></div><div><dt>可见反馈</dt><dd>{draft.visibleFeedback || '尚未写后果怎样可见。'}</dd></div><div><dt>预测</dt><dd>{draft.predictedBehavior || '尚未写可观察行为。'}</dd></div><div><dt>反例</dt><dd>{draft.disconfirmingSignal || '尚未写反驳信号。'}</dd></div><div><dt>边界</dt><dd>{draft.nonGoal || '尚未写本轮非目标。'}</dd></div></dl>
        <section><h4>第一条测试问题</h4><p>{draft.testQuestion || '尚未写可以被桌面行为回答的问题。'}</p></section>
        <p className="experience-intent-summary-boundary">不生成乐趣分、玩家画像或最佳机制推荐。</p>
      </aside>

      <footer className="experience-intent-actions"><button className="primary-button" type="submit">保存体验意图</button><button className="text-action" type="button" onClick={exportPackage}>导出 JSON →</button><button className="text-action" type="button" onClick={continueToCoreLoop}>继续到核心循环 →</button><button className={clearArmed ? 'experience-intent-clear is-armed' : 'experience-intent-clear'} type="button" onClick={clearDraft}>{clearArmed ? '确认清空草稿' : '清空草稿'}</button><p>只保存在当前浏览器；记录不是玩家偏好结论或机制处方。</p><div className="form-status" aria-live="polite">{status}</div></footer>
    </form>
  </section>
}
