import { FormEvent, useEffect, useMemo, useState } from 'react'
import { ISSUE_TO_SYSTEM_STORAGE_KEY } from './storage-keys'

type WorkbenchStep = 'thesis' | 'translation' | 'omissions' | 'loop' | 'verification'
type SystemField = 'actors' | 'permissions' | 'resources' | 'constraints' | 'feedback' | 'timescale'
type Omission = { id: string; omitted: string; reason: string; misreadingRisk: string; reviewOwner: string }
type IssueDraft = {
  projectName: string
  version: string
  issue: string
  audience: string
  systemThesis: string
  designerPosition: string
  affectedStakeholders: string
  reviewAndChangeRights: string
  system: Record<SystemField, string>
  omissions: Omission[]
  repeatedSituation: string
  playerChoice: string
  systemResponse: string
  feedbackVisibility: string
  renameCheck: string
  detachedContent: string
  systemEvidence: string
  playerInterpretation: string
  stakeholderReview: string
  debriefRole: string
  disconfirmingSignal: string
  nextChange: string
}
type IssueRecord = IssueDraft & { id: string; createdAt: string }
type IssueStore = { schemaVersion: 1; draft: IssueDraft; records: IssueRecord[] }

const systemFields: { id: SystemField; label: string; prompt: string }[] = [
  { id: 'actors', label: '角色', prompt: '谁能行动，谁承受后果，谁只被系统表示？' },
  { id: 'permissions', label: '权限', prompt: '每个角色可以决定、看见、拒绝或质疑什么？' },
  { id: 'resources', label: '资源', prompt: '什么被积累、交换、消耗、隐藏或欠下？' },
  { id: 'constraints', label: '约束', prompt: '行动受到容量、规则、信息、他人或时间怎样限制？' },
  { id: 'feedback', label: '反馈', prompt: '系统怎样让行动后果变得可见、可比较或可追责？' },
  { id: 'timescale', label: '时间尺度', prompt: '哪些后果立即出现，哪些跨轮延迟或被转移？' },
]

const steps: { id: WorkbenchStep; number: string; label: string; note: string }[] = [
  { id: 'thesis', number: '01', label: '系统主张', note: '先写关系，再决定它需要什么机制' },
  { id: 'translation', number: '02', label: '六字段翻译', note: '每个名词都要落到动作、权限或反馈' },
  { id: 'omissions', number: '03', label: '遗漏账本', note: '抽象不是中立删除，要留下误读与责任' },
  { id: 'loop', number: '04', label: '重复决策', note: '让议题在桌上发生，不靠题卡宣布' },
  { id: 'verification', number: '05', label: '三层验证', note: '系统、解释与审阅互不替代' },
]

const createOmission = (): Omission => ({ id: crypto.randomUUID(), omitted: '', reason: '', misreadingRisk: '', reviewOwner: '' })

const createEmptyDraft = (): IssueDraft => ({
  projectName: '', version: '', issue: '', audience: '', systemThesis: '', designerPosition: '', affectedStakeholders: '', reviewAndChangeRights: '',
  system: { actors: '', permissions: '', resources: '', constraints: '', feedback: '', timescale: '' },
  omissions: [createOmission()],
  repeatedSituation: '', playerChoice: '', systemResponse: '', feedbackVisibility: '', renameCheck: '', detachedContent: '',
  systemEvidence: '', playerInterpretation: '', stakeholderReview: '', debriefRole: '', disconfirmingSignal: '', nextChange: '',
})

function readStore(): IssueStore {
  const fallback: IssueStore = { schemaVersion: 1, draft: createEmptyDraft(), records: [] }
  try {
    const stored = JSON.parse(localStorage.getItem(ISSUE_TO_SYSTEM_STORAGE_KEY) || 'null')
    if (!stored || stored.schemaVersion !== 1) return fallback
    return {
      schemaVersion: 1,
      draft: {
        ...fallback.draft,
        ...stored.draft,
        system: { ...fallback.draft.system, ...stored.draft?.system },
        omissions: Array.isArray(stored.draft?.omissions) && stored.draft.omissions.length ? stored.draft.omissions : fallback.draft.omissions,
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

export function IssueToSystemWorkbench() {
  const [initial] = useState(readStore)
  const [draft, setDraft] = useState(initial.draft)
  const [records, setRecords] = useState(initial.records)
  const [step, setStep] = useState<WorkbenchStep>('thesis')
  const [status, setStatus] = useState('草稿会自动保存在当前浏览器。')
  const [clearArmed, setClearArmed] = useState(false)

  useEffect(() => {
    localStorage.setItem(ISSUE_TO_SYSTEM_STORAGE_KEY, JSON.stringify({ schemaVersion: 1, draft, records }))
  }, [draft, records])

  const update = <K extends keyof IssueDraft>(key: K, value: IssueDraft[K]) => {
    setDraft(current => ({ ...current, [key]: value }))
    setStatus('草稿已在当前浏览器更新。')
    setClearArmed(false)
  }

  const updateSystemField = (field: SystemField, value: string) => {
    setDraft(current => ({ ...current, system: { ...current.system, [field]: value } }))
    setStatus('六字段翻译已在当前浏览器更新。')
    setClearArmed(false)
  }

  const updateOmission = (id: string, field: Exclude<keyof Omission, 'id'>, value: string) => {
    setDraft(current => ({ ...current, omissions: current.omissions.map(item => item.id === id ? { ...item, [field]: value } : item) }))
    setStatus('遗漏账本已在当前浏览器更新。')
    setClearArmed(false)
  }

  const addOmission = () => update('omissions', [...draft.omissions, createOmission()])
  const removeOmission = (id: string) => {
    if (draft.omissions.length === 1) return setStatus('至少保留一项遗漏；如果目前不知道，写清待查内容和责任人。')
    update('omissions', draft.omissions.filter(item => item.id !== id))
  }

  const actionFeedbackChain = useMemo(() => [draft.repeatedSituation, draft.playerChoice, draft.systemResponse, draft.feedbackVisibility].filter(value => value.trim()).join(' → '), [draft.repeatedSituation, draft.playerChoice, draft.systemResponse, draft.feedbackVisibility])
  const completeOmissions = useMemo(() => draft.omissions.filter(item => [item.omitted, item.reason, item.misreadingRisk, item.reviewOwner].every(value => value.trim())).length, [draft.omissions])

  const saveRecord = (event: FormEvent) => {
    event.preventDefault()
    if (![draft.issue, draft.audience, draft.systemThesis, draft.designerPosition, draft.affectedStakeholders, draft.reviewAndChangeRights].every(value => value.trim())) {
      setStep('thesis'); setStatus('保存前请补齐议题、目标玩家、系统主张、设计者位置、直接受影响者与修改权。'); return
    }
    if (systemFields.some(item => !draft.system[item.id].trim())) {
      setStep('translation'); setStatus('角色、权限、资源、约束、反馈和时间尺度都要对应可观察的系统内容。'); return
    }
    if (!draft.omissions.length || draft.omissions.some(item => ![item.omitted, item.reason, item.misreadingRisk, item.reviewOwner].every(value => value.trim()))) {
      setStep('omissions'); setStatus('每项遗漏都要写删除内容、当前理由、误读风险与复核责任。'); return
    }
    if (![draft.repeatedSituation, draft.playerChoice, draft.systemResponse, draft.feedbackVisibility, draft.renameCheck, draft.detachedContent].every(value => value.trim())) {
      setStep('loop'); setStatus('重复决策还缺出现情境、玩家选择、系统回应、反馈可见性、更名检查或外挂内容处理。'); return
    }
    if (![draft.systemEvidence, draft.playerInterpretation, draft.stakeholderReview, draft.debriefRole, draft.disconfirmingSignal, draft.nextChange].every(value => value.trim())) {
      setStep('verification'); setStatus('三层验证、复盘边界、反驳信号和单字段下一版都必须写清。'); return
    }
    const record: IssueRecord = { ...draft, id: crypto.randomUUID(), createdAt: new Date().toISOString() }
    setRecords(current => [record, ...current])
    setStatus('议题与系统记录已保存。它只说明计划可测试，不代表表达、学习或社会影响已经成立。')
  }

  const exportPackage = () => {
    downloadJson(`${draft.projectName.trim() || '桌游项目'}-${draft.version.trim() || '议题到系统'}-翻译包.json`, {
      schema_version: 1,
      method: 'issue-to-system-workbench',
      local_first: true,
      no_social_impact_score: true,
      no_learning_outcome_claim: true,
      no_representativeness_certification: true,
      evidence_boundary: '记录只证明当前草稿形成了可测试关系；系统行为、玩家解释和直接受影响者审阅必须分别收集，单次测试不能证明长期学习、态度或社会改变。',
      draft,
      saved_records: records,
      exported_at: new Date().toISOString(),
    })
    setStatus('翻译包已导出；文件不是伦理、代表性、学习或社会影响认证。')
  }

  const clearDraft = () => {
    if (!clearArmed) {
      setClearArmed(true)
      setStatus('再次点击“确认清空草稿”；已保存的议题与系统记录不会删除。')
      return
    }
    setDraft(createEmptyDraft())
    setStep('thesis')
    setClearArmed(false)
    setStatus('草稿已清空；已保存记录仍在当前浏览器。')
  }

  return <section className="tool-surface issue-system-tool">
    <div className="issue-system-heading"><div><h2>让玩家在系统里碰到议题</h2><p className="tool-intro">把观点翻译成行动、权限、资源与后果，再决定证据够不够。</p></div><p className="issue-system-autosave" role="status">草稿自动保存在当前浏览器<br /><small>{records.length} 条议题与系统记录</small></p></div>
    <nav className="issue-system-steps" aria-label="议题到系统工作台步骤">
      {steps.map(item => <button key={item.id} type="button" className={step === item.id ? 'is-active' : ''} aria-pressed={step === item.id} onClick={() => setStep(item.id)}><span>{item.number}</span>{item.label}</button>)}
    </nav>
    <p className="issue-system-note">{steps.find(item => item.id === step)?.note}</p>

    <form className="issue-system-layout" onSubmit={saveRecord}>
      <div className="issue-system-editor">
        {step === 'thesis' && <section aria-labelledby="issue-thesis-title"><h3 id="issue-thesis-title">系统主张与位置</h3><p className="section-copy">系统主张要描述一种可被原型支持或反驳的关系，不写“让玩家了解……”这类无法观察的目标。</p>
          <div className="issue-system-pair"><label><span>游戏/项目</span><input value={draft.projectName} onChange={event => update('projectName', event.target.value)} /></label><label><span>当前版本</span><input value={draft.version} onChange={event => update('version', event.target.value)} placeholder="例如 v0.2" /></label></div>
          <div className="issue-system-pair"><label><span>议题 *</span><textarea value={draft.issue} onChange={event => update('issue', event.target.value)} placeholder="平台怎样分配可见度与审核劳动？" /></label><label><span>目标玩家与使用语境 *</span><textarea value={draft.audience} onChange={event => update('audience', event.target.value)} placeholder="高中课堂；熟悉社交平台但未学过排序系统。" /></label></div>
          <label><span>可被反驳的系统主张 *</span><textarea value={draft.systemThesis} onChange={event => update('systemThesis', event.target.value)} placeholder="平台奖励持续制造互动的人，同时把审核成本转移给创作者。" /></label>
          <label><span>设计者位置与不知道什么 *</span><textarea value={draft.designerPosition} onChange={event => update('designerPosition', event.target.value)} /></label>
          <div className="issue-system-pair"><label><span>谁直接承受或了解这个议题？ *</span><textarea value={draft.affectedStakeholders} onChange={event => update('affectedStakeholders', event.target.value)} /></label><label><span>谁能质疑、修改或停止表达？ *</span><textarea value={draft.reviewAndChangeRights} onChange={event => update('reviewAndChangeRights', event.target.value)} /></label></div>
        </section>}

        {step === 'translation' && <section aria-labelledby="issue-translation-title"><h3 id="issue-translation-title">六字段翻译</h3><p className="section-copy">每个字段都要对应玩家动作、可见状态或系统回应。只有背景文字能看见的关系还没有进入系统。</p>
          <div className="issue-system-fields">{systemFields.map((item, index) => <label key={item.id}><span>{String(index + 1).padStart(2, '0')} · {item.label} *</span><textarea value={draft.system[item.id]} onChange={event => updateSystemField(item.id, event.target.value)} placeholder={item.prompt} /></label>)}</div>
          <p className="issue-system-boundary">不要用“机制名称”代替关系。写清谁在什么时候能做什么、付出什么、看见什么。</p>
        </section>}

        {step === 'omissions' && <section aria-labelledby="issue-omissions-title"><h3 id="issue-omissions-title">遗漏账本</h3><p className="section-copy">原型不需要模拟全部现实，但每次删除都要留下可能改变责任、能动性或因果解释的风险。</p>
          <div className="issue-omission-list">{draft.omissions.map((item, index) => <article key={item.id}><div className="issue-omission-heading"><h4>{String(index + 1).padStart(2, '0')} · 本轮遗漏</h4><button type="button" onClick={() => removeOmission(item.id)}>移除</button></div><label><span>删掉了谁、什么关系或哪段历史？ *</span><textarea value={item.omitted} onChange={event => updateOmission(item.id, 'omitted', event.target.value)} /></label><div className="issue-system-pair"><label><span>为什么当前原型先删？ *</span><textarea value={item.reason} onChange={event => updateOmission(item.id, 'reason', event.target.value)} /></label><label><span>可能造成什么误读？ *</span><textarea value={item.misreadingRisk} onChange={event => updateOmission(item.id, 'misreadingRisk', event.target.value)} /></label></div><label><span>谁负责发现、复核或补查？ *</span><input value={item.reviewOwner} onChange={event => updateOmission(item.id, 'reviewOwner', event.target.value)} /></label></article>)}</div>
          <button className="text-action issue-add-omission" type="button" onClick={addOmission}>增加一项遗漏 →</button>
        </section>}

        {step === 'loop' && <section aria-labelledby="issue-loop-title"><h3 id="issue-loop-title">重复决策与后果</h3><p className="section-copy">让系统主张在一局中被反复选择、承受或观察。复述知识和抽一张结论卡不能替代行动反馈链。</p>
          <label><span>核心关系在什么情境反复出现？ *</span><textarea value={draft.repeatedSituation} onChange={event => update('repeatedSituation', event.target.value)} /></label>
          <div className="issue-system-pair"><label><span>玩家实际选择什么？ *</span><textarea value={draft.playerChoice} onChange={event => update('playerChoice', event.target.value)} /></label><label><span>系统怎样回应？ *</span><textarea value={draft.systemResponse} onChange={event => update('systemResponse', event.target.value)} /></label></div>
          <label><span>玩家何时、从哪里看见后果？ *</span><textarea value={draft.feedbackVisibility} onChange={event => update('feedbackVisibility', event.target.value)} /></label>
          <div className="issue-system-pair"><label><span>移除故事并改名后，哪条关系仍成立？ *</span><textarea value={draft.renameCheck} onChange={event => update('renameCheck', event.target.value)} /></label><label><span>哪些题卡、事实或结论与系统脱节；怎样处理？ *</span><textarea value={draft.detachedContent} onChange={event => update('detachedContent', event.target.value)} /></label></div>
        </section>}

        {step === 'verification' && <section aria-labelledby="issue-verification-title"><h3 id="issue-verification-title">三层验证与下一版</h3><p className="section-copy">三层证据分别回答“系统有没有运行”“玩家怎样解释”“表达影响了谁”。任何一层都不能替另一层背书。</p>
          <label><span>系统行为证据 *</span><textarea value={draft.systemEvidence} onChange={event => update('systemEvidence', event.target.value)} placeholder="记录资源流、权限差异、反馈延迟与反例。" /></label>
          <label><span>玩家解释证据 *</span><textarea value={draft.playerInterpretation} onChange={event => update('playerInterpretation', event.target.value)} placeholder="先让玩家用自己的话说明因果，不提示结论。" /></label>
          <label><span>直接受影响者/领域审阅 *</span><textarea value={draft.stakeholderReview} onChange={event => update('stakeholderReview', event.target.value)} placeholder="记录审阅者位置、修改权、分歧与不可代表性。" /></label>
          <label><span>复盘只承担什么；不能替系统补什么？ *</span><textarea value={draft.debriefRole} onChange={event => update('debriefRole', event.target.value)} /></label>
          <div className="issue-system-pair"><label><span>什么结果会推翻当前系统主张？ *</span><textarea value={draft.disconfirmingSignal} onChange={event => update('disconfirmingSignal', event.target.value)} /></label><label><span>下一版只改变哪一个关系字段？ *</span><textarea value={draft.nextChange} onChange={event => update('nextChange', event.target.value)} /></label></div>
        </section>}
      </div>

      <aside className="issue-system-summary" aria-label="议题到系统当前摘要"><header><span>当前系统主张</span><h3>{draft.systemThesis || '尚未写可被反驳的关系'}</h3><p>{draft.projectName || '未写项目'} · {draft.version || '未写版本'}</p></header>
        <dl><div><dt>议题与玩家</dt><dd>{draft.issue || '尚未写议题'}；{draft.audience || '尚未写目标玩家'}</dd></div><div><dt>受影响者与修改权</dt><dd>{draft.affectedStakeholders || '尚未写直接受影响者'}；{draft.reviewAndChangeRights || '尚未写修改或停止权'}</dd></div><div><dt>六字段</dt><dd>{systemFields.filter(item => draft.system[item.id].trim()).length} / 6 已填写</dd></div><div><dt>遗漏账本</dt><dd>{completeOmissions} / {draft.omissions.length} 项责任完整</dd></div></dl>
        <section><h4>行动反馈链</h4><p>{actionFeedbackChain || '尚未把出现情境、选择、回应与反馈连起来。'}</p></section>
        <section><h4>三层证据</h4><p>系统：{draft.systemEvidence || '未写'}</p><p>解释：{draft.playerInterpretation || '未写'}</p><p>审阅：{draft.stakeholderReview || '未写'}</p></section>
        <section><h4>单字段下一版</h4><p>{draft.nextChange || '尚未写下一版只改变什么。'}</p></section>
        <p className="issue-system-summary-boundary">不生成伦理、学习或社会影响分，也不认证任何人代表一个群体。</p>
      </aside>

      <footer className="issue-system-actions"><button className="primary-button" type="submit">保存议题与系统记录</button><button className="text-action" type="button" onClick={exportPackage}>导出 JSON →</button><button className={clearArmed ? 'issue-system-clear is-armed' : 'issue-system-clear'} type="button" onClick={clearDraft}>{clearArmed ? '确认清空草稿' : '清空草稿'}</button><p>数据只保存在当前浏览器；记录与导出都不代表表达已经验证。</p><div className="form-status" aria-live="polite">{status}</div></footer>
    </form>
  </section>
}
