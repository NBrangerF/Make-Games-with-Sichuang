import { FormEvent, useEffect, useState } from 'react'
import { VERSION_GOVERNANCE_STORAGE_KEY } from './storage-keys'

type GovernanceStep = 'passport' | 'matrix' | 'sources' | 'timeline' | 'migration'
type CompatibilityStatus = '已验证' | '声明支持' | '未知' | '需替换'
type SourceStatus = '当前' | '补充' | '历史'

type CompatibilityConfiguration = {
  id: string
  baseEdition: string
  expansion: string
  mode: string
  language: string
  status: CompatibilityStatus
  evidence: string
}

type AuthoritySource = {
  id: string
  title: string
  status: SourceStatus
  date: string
  locator: string
}

type GovernanceDraft = {
  projectName: string
  currentVersion: string
  stableId: string
  componentName: string
  printedText: string
  currentText: string
  acquisition: string
  frequency: string
  complexity: string
  systemRole: string
  formatRisk: string
  breakingPoint: string
  nextVerification: string
  evidenceBoundary: string
  configurations: CompatibilityConfiguration[]
  sources: AuthoritySource[]
  changeType: string
  changeSummary: string
  announcementDate: string
  effectiveDate: string
  reviewDate: string
  rollbackGate: string
  validConfigurations: string
  regressionTask: string
  regressionSignal: string
  migrationAudience: string
  migrationMaterial: string
  migrationTask: string
  migrationOwner: string
}

type GovernanceRecord = GovernanceDraft & { id: string; createdAt: string }
type GovernanceStore = { schemaVersion: 1; draft: GovernanceDraft; records: GovernanceRecord[] }

const makeConfiguration = (): CompatibilityConfiguration => ({
  id: crypto.randomUUID(), baseEdition: '', expansion: '', mode: '', language: '', status: '未知', evidence: '',
})

const makeSource = (): AuthoritySource => ({
  id: crypto.randomUUID(), title: '', status: '补充', date: '', locator: '',
})

const createEmptyDraft = (): GovernanceDraft => ({
  projectName: '', currentVersion: '', stableId: '', componentName: '', printedText: '', currentText: '',
  acquisition: '', frequency: '', complexity: '', systemRole: '', formatRisk: '', breakingPoint: '',
  nextVerification: '', evidenceBoundary: '', configurations: [makeConfiguration()], sources: [makeSource()],
  changeType: '文字澄清', changeSummary: '', announcementDate: '', effectiveDate: '', reviewDate: '', rollbackGate: '',
  validConfigurations: '', regressionTask: '', regressionSignal: '', migrationAudience: '', migrationMaterial: '',
  migrationTask: '', migrationOwner: '',
})

function readStore(): GovernanceStore {
  const fallback = { schemaVersion: 1 as const, draft: createEmptyDraft(), records: [] }
  try {
    const stored = JSON.parse(localStorage.getItem(VERSION_GOVERNANCE_STORAGE_KEY) || 'null')
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

const steps: { id: GovernanceStep; number: string; label: string }[] = [
  { id: 'passport', number: '01', label: '内容护照' },
  { id: 'matrix', number: '02', label: '兼容矩阵' },
  { id: 'sources', number: '03', label: '当前事实源' },
  { id: 'timeline', number: '04', label: '治理时间线' },
  { id: 'migration', number: '05', label: '回归与迁移' },
]

export function VersionGovernanceWorkbench() {
  const [initial] = useState(readStore)
  const [draft, setDraft] = useState(initial.draft)
  const [records, setRecords] = useState(initial.records)
  const [step, setStep] = useState<GovernanceStep>('passport')
  const [status, setStatus] = useState('草稿会自动保存在当前浏览器。')
  const [clearArmed, setClearArmed] = useState(false)

  useEffect(() => {
    localStorage.setItem(VERSION_GOVERNANCE_STORAGE_KEY, JSON.stringify({ schemaVersion: 1, draft, records }))
  }, [draft, records])

  const update = <K extends keyof GovernanceDraft>(key: K, value: GovernanceDraft[K]) => {
    setDraft(current => ({ ...current, [key]: value }))
    setStatus('草稿已在当前浏览器更新。')
    setClearArmed(false)
  }

  const updateConfiguration = (id: string, patch: Partial<CompatibilityConfiguration>) => {
    update('configurations', draft.configurations.map(row => row.id === id ? { ...row, ...patch } : row))
  }

  const updateSource = (id: string, patch: Partial<AuthoritySource>) => {
    const sources = draft.sources.map(source => {
      if (source.id === id) return { ...source, ...patch }
      if (patch.status === '当前' && source.status === '当前') return { ...source, status: '补充' as const }
      return source
    })
    update('sources', sources)
  }

  const save = (event: FormEvent) => {
    event.preventDefault()
    if (!draft.projectName.trim() || !draft.currentVersion.trim() || !draft.stableId.trim() || !draft.componentName.trim()) {
      setStep('passport')
      setStatus('保存前请补齐游戏名称、工作版本、稳定 ID 和组件名称。')
      return
    }
    if (!draft.breakingPoint.trim() || !draft.nextVerification.trim() || !draft.evidenceBoundary.trim()) {
      setStatus('保存前请在“当前事实源”补齐断点、下一次验证和证据边界。')
      setStep('sources')
      return
    }
    const record = { ...draft, id: crypto.randomUUID(), createdAt: new Date().toISOString() }
    setRecords(current => [record, ...current])
    setStatus('治理记录已保存到当前浏览器。')
  }

  const exportPackage = () => {
    const filename = `${draft.projectName.trim() || '桌游项目'}-${draft.stableId.trim() || '内容版本'}-治理包.json`
    downloadJson(filename, {
      schema_version: 1,
      method: 'content-version-governance-workbench',
      local_first: true,
      no_compatibility_certification: true,
      no_rarity_recommendation: true,
      draft,
      saved_records: records,
      exported_at: new Date().toISOString(),
    })
    setStatus('治理包已导出；文件不代表兼容性认证。')
  }

  const clearDraft = () => {
    if (!clearArmed) {
      setClearArmed(true)
      setStatus('再次点击“确认清空草稿”；已保存记录不会删除。')
      return
    }
    setDraft(createEmptyDraft())
    setStep('passport')
    setClearArmed(false)
    setStatus('草稿已清空；已保存记录仍在当前浏览器。')
  }

  const activeSource = draft.sources.find(source => source.status === '当前')

  return <section className="tool-surface governance-tool">
    <h2>让旧版玩家找到今天该用哪一份文字</h2>
    <p className="tool-intro">把内容、兼容、变更和迁移锁在同一份本地记录里。</p>
    <nav className="governance-steps" aria-label="版本治理步骤">
      {steps.map(item => <button key={item.id} type="button" className={step === item.id ? 'is-active' : ''} aria-pressed={step === item.id} onClick={() => setStep(item.id)}><span>{item.number}</span>{item.label}</button>)}
    </nav>
    <p className="governance-hand-note">{step === 'passport' ? '先认出它，再谈改了什么' : step === 'matrix' ? '一行只代表一个完整配置' : step === 'sources' ? '“当前”只能指向此刻的事实源' : step === 'timeline' ? '公告日 ≠ 生效日' : '旧盒子也需要一条可执行路径'}</p>

    <form className="governance-layout" onSubmit={save}>
      <div className="governance-editor">
        {step === 'passport' && <section aria-labelledby="governance-passport-title">
          <h3 id="governance-passport-title">内容护照</h3>
          <div className="governance-pair"><label><span>游戏名称 *</span><input value={draft.projectName} onChange={event => update('projectName', event.target.value)} /></label><label><span>当前工作版本 *</span><input value={draft.currentVersion} onChange={event => update('currentVersion', event.target.value)} placeholder="例如 2.1" /></label></div>
          <div className="governance-pair"><label><span>稳定 ID *</span><input value={draft.stableId} onChange={event => update('stableId', event.target.value)} placeholder="例如 CARD-ACTION-017" /></label><label><span>组件名称 *</span><input value={draft.componentName} onChange={event => update('componentName', event.target.value)} /></label></div>
          <label><span>印刷文字</span><textarea value={draft.printedText} onChange={event => update('printedText', event.target.value)} /></label>
          <label><span>当前文字</span><textarea value={draft.currentText} onChange={event => update('currentText', event.target.value)} /></label>
          <fieldset className="governance-rarity"><legend>稀有度与内容分布的五个事实字段</legend><div className="governance-pair"><label><span>获取方式</span><input value={draft.acquisition} onChange={event => update('acquisition', event.target.value)} /></label><label><span>实际出现频率</span><input value={draft.frequency} onChange={event => update('frequency', event.target.value)} /></label></div><div className="governance-pair"><label><span>复杂度</span><input value={draft.complexity} onChange={event => update('complexity', event.target.value)} /></label><label><span>系统角色</span><input value={draft.systemRole} onChange={event => update('systemRole', event.target.value)} /></label></div><label><span>格式风险</span><input value={draft.formatRisk} onChange={event => update('formatRisk', event.target.value)} /></label></fieldset>
        </section>}

        {step === 'matrix' && <section aria-labelledby="governance-matrix-title">
          <h3 id="governance-matrix-title">兼容矩阵</h3><p className="section-copy">不要写“支持全部扩展”。每一行固定基础版、扩展、人数/模式、语言/规则源和证据。</p>
          <div className="governance-table-scroll"><table className="governance-table"><thead><tr><th>基础版/印次</th><th>扩展</th><th>人数/模式</th><th>语言/规则源</th><th>证据状态</th><th>证据</th><th><span className="sr-only">操作</span></th></tr></thead><tbody>{draft.configurations.map((row, index) => <tr key={row.id}><td><input aria-label={`配置 ${index + 1} 基础版或印次`} value={row.baseEdition} onChange={event => updateConfiguration(row.id, { baseEdition: event.target.value })} /></td><td><input aria-label={`配置 ${index + 1} 扩展`} value={row.expansion} onChange={event => updateConfiguration(row.id, { expansion: event.target.value })} /></td><td><input aria-label={`配置 ${index + 1} 人数或模式`} value={row.mode} onChange={event => updateConfiguration(row.id, { mode: event.target.value })} /></td><td><input aria-label={`配置 ${index + 1} 语言或规则源`} value={row.language} onChange={event => updateConfiguration(row.id, { language: event.target.value })} /></td><td><select aria-label={`配置 ${index + 1} 证据状态`} value={row.status} onChange={event => updateConfiguration(row.id, { status: event.target.value as CompatibilityStatus })}><option>已验证</option><option>声明支持</option><option>未知</option><option>需替换</option></select></td><td><input aria-label={`配置 ${index + 1} 证据`} value={row.evidence} onChange={event => updateConfiguration(row.id, { evidence: event.target.value })} /></td><td><button type="button" className="governance-remove" disabled={draft.configurations.length === 1} aria-label={`删除配置 ${index + 1}`} onClick={() => update('configurations', draft.configurations.filter(item => item.id !== row.id))}>×</button></td></tr>)}</tbody></table></div>
          <button type="button" className="text-action" onClick={() => update('configurations', [...draft.configurations, makeConfiguration()])}>＋ 添加配置</button>
          <p className="governance-boundary">“声明支持”表示来源这么说；“已验证”只表示你写下的这一个配置和任务已经测过。两者都不是普遍兼容认证。</p>
        </section>}

        {step === 'sources' && <section aria-labelledby="governance-source-title">
          <h3 id="governance-source-title">当前事实源</h3><p className="section-copy">同一内容可以有规则书、FAQ、卡牌数据库和公告，但此刻只能明确一份“当前”来源。</p>
          <div className="governance-source-list">{draft.sources.map((source, index) => <div className="governance-source-row" key={source.id}><div className="governance-row-heading"><strong>来源 {index + 1}</strong><button type="button" className="text-action" disabled={draft.sources.length === 1} onClick={() => update('sources', draft.sources.filter(item => item.id !== source.id))}>移除</button></div><div className="governance-pair"><label><span>标题/版本</span><input value={source.title} onChange={event => updateSource(source.id, { title: event.target.value })} /></label><label><span>地位</span><select value={source.status} onChange={event => updateSource(source.id, { status: event.target.value as SourceStatus })}><option>当前</option><option>补充</option><option>历史</option></select></label></div><div className="governance-pair"><label><span>发布日期</span><input type="date" value={source.date} onChange={event => updateSource(source.id, { date: event.target.value })} /></label><label><span>链接/页码/定位</span><input value={source.locator} onChange={event => updateSource(source.id, { locator: event.target.value })} /></label></div></div>)}</div>
          <button type="button" className="text-action" onClick={() => update('sources', [...draft.sources, makeSource()])}>＋ 添加事实源</button>
          <div className="governance-divider" />
          <label><span>当前断点 *</span><textarea value={draft.breakingPoint} onChange={event => update('breakingPoint', event.target.value)} placeholder="哪一个旧组件、规则或配置与当前文字冲突？" /></label>
          <label><span>下一次只验证 *</span><textarea value={draft.nextVerification} onChange={event => update('nextVerification', event.target.value)} /></label>
          <label><span>证据边界 *</span><textarea value={draft.evidenceBoundary} onChange={event => update('evidenceBoundary', event.target.value)} placeholder="写明印次、扩展、模式、语言与任务。" /></label>
        </section>}

        {step === 'timeline' && <section aria-labelledby="governance-timeline-title">
          <h3 id="governance-timeline-title">治理时间线</h3><p className="section-copy">分别记录对外说了什么、什么时候开始适用、什么时候必须复查或回退。</p>
          <div className="governance-pair"><label><span>变更分类</span><select value={draft.changeType} onChange={event => update('changeType', event.target.value)}><option>文字澄清</option><option>功能性勘误</option><option>数值调整</option><option>禁限/轮替</option><option>兼容声明变化</option><option>其他</option></select></label><label><span>变更摘要</span><input value={draft.changeSummary} onChange={event => update('changeSummary', event.target.value)} /></label></div>
          <div className="governance-date-grid"><label><span>公告日</span><input type="date" value={draft.announcementDate} onChange={event => update('announcementDate', event.target.value)} /></label><label><span>生效日</span><input type="date" value={draft.effectiveDate} onChange={event => update('effectiveDate', event.target.value)} /></label><label><span>复查日</span><input type="date" value={draft.reviewDate} onChange={event => update('reviewDate', event.target.value)} /></label></div>
          <label><span>回退门</span><textarea value={draft.rollbackGate} onChange={event => update('rollbackGate', event.target.value)} placeholder="出现什么可观察信号时暂停、回退或追加说明？" /></label>
          <div className="governance-timeline" aria-label="治理日期预览"><span><i />{draft.announcementDate || '未定'}<small>公告</small></span><span><i />{draft.effectiveDate || '未定'}<small>生效</small></span><span><i />{draft.reviewDate || '未定'}<small>复查</small></span></div>
        </section>}

        {step === 'migration' && <section aria-labelledby="governance-migration-title">
          <h3 id="governance-migration-title">回归与迁移</h3><p className="section-copy">先写仍然有效的配置，再给旧版持有者一条可执行迁移路径；不要让勘误只停在公告页。</p>
          <label><span>有效配置集合</span><textarea value={draft.validConfigurations} onChange={event => update('validConfigurations', event.target.value)} placeholder="列出这轮需要继续成立的配置。" /></label>
          <label><span>回归任务</span><textarea value={draft.regressionTask} onChange={event => update('regressionTask', event.target.value)} /></label>
          <label><span>通过/反驳信号</span><textarea value={draft.regressionSignal} onChange={event => update('regressionSignal', event.target.value)} /></label>
          <div className="governance-pair"><label><span>迁移对象</span><input value={draft.migrationAudience} onChange={event => update('migrationAudience', event.target.value)} placeholder="例如基础版首印持有者" /></label><label><span>迁移材料</span><input value={draft.migrationMaterial} onChange={event => update('migrationMaterial', event.target.value)} placeholder="贴纸、替换牌、勘误表……" /></label></div>
          <label><span>迁移动作</span><textarea value={draft.migrationTask} onChange={event => update('migrationTask', event.target.value)} /></label>
          <label><span>负责人/复核者</span><input value={draft.migrationOwner} onChange={event => update('migrationOwner', event.target.value)} /></label>
        </section>}
      </div>

      <aside className="governance-summary" aria-label="当前治理摘要">
        <header><span>当前治理摘要</span><h3>{draft.componentName || '尚未命名的内容'}</h3><p>{draft.projectName || '未写游戏名称'} · {draft.currentVersion || '未写版本'} · {draft.stableId || '未写稳定 ID'}</p></header>
        <dl><div><dt>当前断点</dt><dd>{draft.breakingPoint || '尚未记录旧版与当前规则的冲突。'}</dd></div><div><dt>下一次只验证</dt><dd>{draft.nextVerification || '尚未写单一验证任务。'}</dd></div><div><dt>证据边界</dt><dd>{draft.evidenceBoundary || '尚未限定印次、扩展、模式和语言。'}</dd></div></dl>
        <section><h4>当前事实源</h4><p>{activeSource?.title || '尚未指定“当前”来源'}</p><small>{activeSource ? `${activeSource.date || '未写日期'} · ${activeSource.locator || '未写定位'}` : '在第 03 步把一项来源设为“当前”。'}</small></section>
        <section><h4>治理状态</h4><p>{draft.configurations.length} 个配置 · {records.length} 条已保存记录</p><small>数量不是成熟度、质量或兼容范围。</small></section>
        <p className="governance-summary-boundary">此工具不推荐稀有度，不生成版本质量分，也不授予扩展兼容认证。</p>
      </aside>

      <footer className="governance-actions"><button className="primary-button" type="submit">保存本地记录</button><button className="text-action" type="button" onClick={exportPackage}>导出治理包 JSON →</button><button className={clearArmed ? 'governance-clear is-armed' : 'governance-clear'} type="button" onClick={clearDraft}>{clearArmed ? '确认清空草稿' : '清空草稿'}</button><p>数据只保存在当前浏览器；导出包不代表兼容性认证。</p><div className="form-status" aria-live="polite">{status}</div></footer>
    </form>
  </section>
}
