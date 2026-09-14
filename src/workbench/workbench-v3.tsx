import { useMemo, useState } from 'react'

import {
  completePlaytest,
  confirmTestPlan,
  createEvidenceReview,
  createIdeaProject,
  createProject,
  createProjectVersion,
  createRevisionFromReviews,
  recordPrototypeRun,
  savePrototype,
  saveTestPlanDraft,
  startIteration,
} from '../domain/commands-v3'
import { getVersionFacts } from '../domain/state-gates'
import { resolveWorkContext } from '../navigation/work-context'
import { serializeRoute, type AppRoute } from '../url-state'
import { useWorkspaceRuntime, type WorkspaceBackupPreview } from '../workspace-runtime'

type WorkbenchProps = { route: AppRoute; onNavigate: (route: AppRoute, replace?: boolean) => void; onOpenKnowledge: () => void }

function RuntimeMessages() {
  const runtime = useWorkspaceRuntime()
  if (!runtime.notice && !runtime.error) return null
  return <div className={runtime.error ? 'workbench-message is-error' : 'workbench-message'} role={runtime.error ? 'alert' : 'status'}>
    <p>{runtime.error ?? runtime.notice}</p><button type="button" onClick={runtime.dismissNotice}>关闭</button>
  </div>
}

function MigrationPreview() {
  const runtime = useWorkspaceRuntime()
  if (runtime.persisted || runtime.legacyReport.presentKeyCount === 0) return null
  const orphanCandidates = runtime.legacyReport.entries.filter(item => item.present && (item.error || item.descriptor.target !== 'project')).reduce((sum, item) => sum + Math.max(item.itemCount, 1), 0)
  return <section className="migration-preview" aria-labelledby="migration-preview-title">
    <p className="workbench-kicker">发现旧版本地记录</p><h2 id="migration-preview-title">先预览，再迁移</h2>
    <p>扫描到 {runtime.legacyReport.presentKeyCount} 类旧数据，其中约 {orphanCandidates} 条需要保守转换或稍后确认归属。迁移会先保存原始备份，不删除任何旧 key。</p>
    <details><summary>查看扫描明细</summary><ul>{runtime.legacyReport.entries.filter(item => item.present).map(item => <li key={item.descriptor.key}><code>{item.descriptor.key}</code><span>{item.error ? '需保留原文' : `${item.itemCount} 条 · ${item.detectedShape}`}</span></li>)}</ul></details>
    <button className="primary-button" type="button" disabled={runtime.busy} onClick={runtime.migrateLegacy}>{runtime.busy ? '正在校验并迁移……' : '确认备份并迁移'}</button>
  </section>
}

function WorkspaceDataPanel() {
  const runtime = useWorkspaceRuntime()
  const [importRaw, setImportRaw] = useState('')
  const [fileName, setFileName] = useState('')
  const [preview, setPreview] = useState<WorkspaceBackupPreview | null>(null)
  const [confirmed, setConfirmed] = useState(false)
  const pendingAssignments = runtime.workspace.collections.artifacts.filter(item => item.artifactType !== 'course_output' && item.artifactType !== 'entity_reference' && item.artifactType !== 'legacy_artifact_v1' && item.payload.linkState === 'needs_assignment').length
    + runtime.workspace.collections.prototypes.filter(item => item.linkState === 'needs_assignment').length
    + runtime.workspace.collections.testPlans.filter(item => item.linkState === 'needs_assignment').length
    + runtime.workspace.collections.playtestSessions.filter(item => item.linkState === 'needs_assignment').length
    + runtime.workspace.collections.evidenceReviews.filter(item => item.linkState === 'needs_assignment').length
  const download = () => {
    const raw = runtime.exportBackup()
    if (!raw) return
    const url = URL.createObjectURL(new Blob([raw], { type: 'application/json' }))
    const link = document.createElement('a')
    link.href = url
    link.download = `一桌点子-工作区-${new Date().toISOString().slice(0, 10)}.json`
    link.click()
    URL.revokeObjectURL(url)
  }
  const chooseFile = (file?: File) => {
    if (!file) return
    setFileName(file.name)
    setConfirmed(false)
    const reader = new FileReader()
    reader.onload = () => {
      const raw = typeof reader.result === 'string' ? reader.result : ''
      setImportRaw(raw)
      setPreview(runtime.inspectBackup(raw))
    }
    reader.readAsText(file)
  }
  const restore = () => {
    if (!preview || !confirmed || !preview.sameWorkspace) return
    if (runtime.restoreBackup(importRaw)) {
      setPreview(null)
      setImportRaw('')
      setFileName('')
      setConfirmed(false)
    }
  }
  return <details className="workspace-data-panel"><summary>备份、导入与迁移诊断</summary><div className="workspace-data-grid"><section><p className="workbench-kicker">当前工作区</p><h2>项目、版本和证据可以一起带走</h2><dl><div><dt>修订号</dt><dd>{runtime.workspace.revision}</dd></div><div><dt>项目</dt><dd>{runtime.workspace.collections.projects.length}</dd></div><div><dt>测试场次</dt><dd>{runtime.workspace.collections.playtestSessions.length}</dd></div><div><dt>待确认归属</dt><dd>{pendingAssignments}</dd></div></dl><button type="button" disabled={!runtime.persisted} onClick={download}>下载完整 v3 备份</button>{!runtime.persisted && <small>首次保存课程或项目记录后可下载。</small>}</section><section><p className="workbench-kicker">导入预览</p><label className="backup-file"><span>选择完整备份或脱敏项目包</span><input type="file" accept="application/json,.json" onChange={event => chooseFile(event.target.files?.[0])} /></label>{preview && <div className="backup-preview" role="status"><strong>{fileName} · {preview.kind === 'full_backup' ? '完整恢复包' : '脱敏项目包'}</strong><p>导出于 {new Date(preview.exportedAt).toLocaleString()} · 修订 {preview.revision}</p><p>{preview.projectCount} 个项目 · {preview.courseAttemptCount} 份课程任务 · {preview.sessionCount} 场测试</p>{preview.sameWorkspace ? <label className="restore-confirm"><input type="checkbox" checked={confirmed} onChange={event => setConfirmed(event.target.checked)} /><span>我已导出当前数据，确认{preview.kind === 'full_backup' ? '恢复为新修订' : '安全合并这个项目'}。</span></label> : <p className="backup-conflict">这是另一个工作区。严格恢复不会静默覆盖当前数据。</p>}<button className="primary-button" type="button" disabled={!preview.sameWorkspace || !confirmed} onClick={restore}>{preview.kind === 'full_backup' ? '确认恢复' : '确认合并'}</button></div>}</section></div>{runtime.workspace.migration && <section className="migration-diagnostics"><h2>上次迁移回执</h2><p>来源摘要 <code>{runtime.workspace.migration.sourceDigest}</code> · {runtime.workspace.migration.issues.length} 条诊断</p><ul>{runtime.workspace.migration.issues.slice(0, 12).map((issue, index) => <li key={`${issue.code}-${index}`}><strong>{issue.level}</strong> {issue.message}</li>)}</ul></section>}</details>
}

function WorkbenchLanding({ onNavigate, onOpenKnowledge }: Pick<WorkbenchProps, 'onNavigate' | 'onOpenKnowledge'>) {
  const { workspace } = useWorkspaceRuntime()
  const projects = workspace.collections.projects.filter(item => !item.archivedAt)
  return <main className="workbench-page" id="main-content" tabIndex={-1}>
    <RuntimeMessages /><MigrationPreview />
    <header className="workbench-hero"><p className="workbench-kicker">设计工作台</p><h1>你现在要做的，<br />是开始，还是推进？</h1><p>选择一个真实工作对象。项目、版本和当前轮次会一直出现在链接中。</p></header>
    <section className="workbench-choice-grid" aria-label="选择任务">
      <article><span>01</span><h2>开始新构想</h2><p>从一种起点发散出最多三个结构不同的方向，选一个做成 v0.1 纸面原型。</p><button type="button" onClick={() => onNavigate({ view: 'workbench', tool: 'redesign', workbenchAction: 'new' })}>开始新构想</button></article>
      <article><span>02</span><h2>继续已有项目</h2><p>{projects.length ? `当前有 ${projects.length} 个未归档项目。选择后再进入具体版本与迭代轮次。` : '还没有 v3 项目。可以开始新构想，或先建立一个空项目。'}</p><a href="#projects" onClick={event => { event.preventDefault(); onNavigate({ view: 'projects', tool: 'redesign' }) }}>查看项目</a></article>
    </section>
    <button className="workbench-knowledge-link" type="button" onClick={onOpenKnowledge}>只想解决一个问题？打开设计知识库</button>
    <WorkspaceDataPanel />
  </main>
}

function ProjectsPage({ onNavigate }: Pick<WorkbenchProps, 'onNavigate'>) {
  const runtime = useWorkspaceRuntime()
  const [title, setTitle] = useState('')
  const create = () => {
    let projectId = ''
    const saved = runtime.commit(draft => { projectId = createProject(draft, { title }) }, '空项目已建立，下一步创建第一个版本。')
    if (saved && projectId) onNavigate({ view: 'workbench', tool: 'redesign', workContext: { projectId } })
  }
  return <main className="workbench-page" id="main-content" tabIndex={-1}><RuntimeMessages />
    <header className="workbench-subhead"><p className="workbench-kicker">项目</p><h1>选择一个工作对象</h1><p>同名项目也使用不同 ID；系统不会根据标题猜测归属。</p></header>
    <div className="project-list">{runtime.workspace.collections.projects.filter(item => !item.archivedAt).map(project => {
      const version = runtime.workspace.collections.projectVersions.find(item => item.id === project.activeVersionId)
      return <article key={project.id}><div><small>{project.id}</small><h2>{project.title}</h2><p>{version ? `当前 ${version.label} · ${version.nextAction || '待定义下一步'}` : '尚未建立版本'}</p></div><button type="button" onClick={() => onNavigate({ view: 'workbench', tool: 'redesign', workContext: { projectId: project.id, ...(version ? { versionId: version.id } : {}) } })}>打开</button></article>
    })}</div>
    <section className="quick-project"><h2>或先建一个空项目</h2><label><span>项目名</span><input value={title} onChange={event => setTitle(event.target.value)} placeholder="例如：岛屿信号" /></label><button className="primary-button" type="button" disabled={!title.trim()} onClick={create}>建立空项目</button></section><WorkspaceDataPanel />
  </main>
}

function NewIdeaFlow({ onNavigate }: Pick<WorkbenchProps, 'onNavigate'>) {
  const runtime = useWorkspaceRuntime()
  const [driver, setDriver] = useState<'experience' | 'mechanic' | 'theme_or_system' | 'component_or_constraint' | 'redesign'>('experience')
  const [prompt, setPrompt] = useState('')
  const [directions, setDirections] = useState<Array<{ title: string; structure: string; risk: string }>>([])
  const [selected, setSelected] = useState(0)
  const [title, setTitle] = useState('')
  const [experience, setExperience] = useState('')
  const [players, setPlayers] = useState('2–4 人')
  const [duration, setDuration] = useState('10 分钟')
  const [action, setAction] = useState('')
  const [end, setEnd] = useState('')
  const makeDirections = () => setDirections([
    { title: '稀缺选择', structure: `把「${prompt}」变成每轮只能做一次的稀缺选择。`, risk: '可能太早收敛成数值题。' },
    { title: '不完整信息', structure: `让玩家只看见「${prompt}」的一部分，必须根据他人行为判断。`, risk: '需要确认猜测不会变成纯随机。' },
    { title: '共享局面', structure: `每次处理「${prompt}」都会改变所有人的公共状态。`, risk: '可能出现责任不清或搭便车。' },
  ])
  const create = () => {
    let result = { projectId: '', versionId: '' }
    const saved = runtime.commit(draft => {
      result = createIdeaProject(draft, { driver, prompt, directions, selectedDirectionIndex: selected, title, profile: { experienceIntent: experience, playerCount: players, duration, goalAndEnd: end, turnStructure: action }, prototype: { direction: directions[selected], coreAction: action, endCondition: end, componentScope: '只用纸片、笔和通用标记，先跑三轮。' } })
    }, '新构想已变成项目 v0.1 和一份微型原型草稿。')
    if (saved && result.projectId) onNavigate({ view: 'workbench', tool: 'redesign', workContext: { projectId: result.projectId, versionId: result.versionId } })
  }
  return <main className="workbench-page" id="main-content" tabIndex={-1}><RuntimeMessages />
    <header className="workbench-subhead"><p className="workbench-kicker">开始新构想</p><h1>先选起点，不先选机制答案。</h1><p>这一步只展开三个可以真正做成纸面原型的方向。</p></header>
    <section className="idea-form"><label><span>起点</span><select value={driver} onChange={event => setDriver(event.target.value as typeof driver)}><option value="experience">想让玩家感到什么</option><option value="mechanic">想练一种动作结构</option><option value="theme_or_system">想观察一个主题或系统</option><option value="component_or_constraint">手上只有某些材料</option><option value="redesign">想改造一个已有游戏</option></select></label><label><span>用一句具体的话写下它</span><textarea value={prompt} onChange={event => setPrompt(event.target.value)} placeholder="例如：在信息不完整时判断要不要相信对方" /></label><button type="button" disabled={!prompt.trim()} onClick={makeDirections}>展开三个结构方向</button></section>
    {directions.length > 0 && <><section className="direction-grid" aria-label="三个构想方向">{directions.map((direction, index) => <label className={selected === index ? 'is-selected' : ''} key={direction.title}><input type="radio" name="direction" checked={selected === index} onChange={() => setSelected(index)} /><strong>{direction.title}</strong><p>{direction.structure}</p><small>先验证：{direction.risk}</small></label>)}</section>
      <section className="prototype-brief"><h2>把选中方向缩成 v0.1</h2><div className="form-pair"><label><span>项目名</span><input value={title} onChange={event => setTitle(event.target.value)} /></label><label><span>想留下的体验</span><input value={experience} onChange={event => setExperience(event.target.value)} /></label></div><div className="form-pair"><label><span>人数</span><input value={players} onChange={event => setPlayers(event.target.value)} /></label><label><span>时长</span><input value={duration} onChange={event => setDuration(event.target.value)} /></label></div><label><span>每轮最重要的一个动作</span><textarea value={action} onChange={event => setAction(event.target.value)} /></label><label><span>三轮后如何结束或比较结果</span><textarea value={end} onChange={event => setEnd(event.target.value)} /></label><button className="primary-button" type="button" disabled={!title.trim() || !experience.trim() || !action.trim() || !end.trim()} onClick={create}>创建项目 v0.1 与原型草稿</button></section></>}
  </main>
}

function Recovery({ route, onNavigate }: { route: AppRoute; onNavigate: WorkbenchProps['onNavigate'] }) {
  const { workspace } = useWorkspaceRuntime()
  const resolved = resolveWorkContext(workspace, route)
  return <main className="workbench-page" id="main-content" tabIndex={-1}><header className="workbench-subhead"><p className="workbench-kicker">需要重新选择工作对象</p><h1>这个链接不能在当前工作区中完整恢复。</h1></header><ul className="recovery-list">{resolved.issues.map((item, index) => <li key={`${item.code}-${index}`}>{item.message}</li>)}</ul><p>系统保留了链接中的原 ID，没有自动换成最近项目。</p><div className="workbench-actions"><button type="button" onClick={() => onNavigate({ view: 'projects', tool: 'redesign' })}>选择已有项目</button>{route.workContext?.returnTo && <a href={route.workContext.returnTo}>返回来源</a>}</div></main>
}

function ProjectWorkbench({ route, onNavigate }: { route: AppRoute; onNavigate: WorkbenchProps['onNavigate'] }) {
  const runtime = useWorkspaceRuntime()
  const resolved = resolveWorkContext(runtime.workspace, route)
  const project = runtime.workspace.collections.projects.find(item => item.id === resolved.context.projectId)
  const version = runtime.workspace.collections.projectVersions.find(item => item.id === resolved.context.versionId)
  const cycle = runtime.workspace.collections.iterationCycles.find(item => item.id === resolved.context.iterationId) ?? runtime.workspace.collections.iterationCycles.find(item => item.versionId === version?.id && item.status === 'active')
  const [versionLabel, setVersionLabel] = useState('v0.1')
  const [uncertainty, setUncertainty] = useState('')
  const [question, setQuestion] = useState('')
  const [signals, setSignals] = useState('')
  const [disconfirming, setDisconfirming] = useState('')
  const [prototypeTitle, setPrototypeTitle] = useState('本轮最小原型')
  const [prototypeScope, setPrototypeScope] = useState('')
  const [runNote, setRunNote] = useState('')
  const [sessionKind, setSessionKind] = useState<'solo' | 'guided' | 'external' | 'blind'>('solo')
  const [observations, setObservations] = useState('')
  const [reviewObservation, setReviewObservation] = useState('')
  const [interpretation, setInterpretation] = useState('')
  const [alternative, setAlternative] = useState('')
  const [change, setChange] = useState('')
  const [unchanged, setUnchanged] = useState('')
  const [rationale, setRationale] = useState('')
  if (resolved.status === 'recovery_required' || !project) return <Recovery route={route} onNavigate={onNavigate} />
  if (!version) {
    const createVersion = () => {
      let versionId = ''
      const saved = runtime.commit(draft => { versionId = createProjectVersion(draft, { projectId: project.id, label: versionLabel }) }, '第一个项目版本已建立。')
      if (saved) onNavigate({ view: 'workbench', tool: 'redesign', workContext: { projectId: project.id, versionId } }, true)
    }
    return <main className="workbench-page" id="main-content" tabIndex={-1}><RuntimeMessages /><header className="workbench-subhead"><p className="workbench-kicker">{project.title}</p><h1>这个项目还没有版本。</h1><p>在建立第一个版本前，迭代步骤不会开放。</p></header><section className="quick-project"><label><span>版本标签</span><input value={versionLabel} onChange={event => setVersionLabel(event.target.value)} /></label><button className="primary-button" type="button" onClick={createVersion}>创建第一个版本</button></section></main>
  }
  const facts = getVersionFacts(runtime.workspace, version.id)
  const plan = runtime.workspace.collections.testPlans.find(item => item.iterationId === cycle?.id && item.status !== 'archived')
  const prototype = runtime.workspace.collections.prototypes.find(item => item.versionId === version.id && item.linkState === 'linked')
  const sessions = runtime.workspace.collections.playtestSessions.filter(item => item.iterationId === cycle?.id && item.status === 'completed' && item.linkState === 'linked')
  const reviews = runtime.workspace.collections.evidenceReviews.filter(item => item.iterationId === cycle?.id && item.linkState === 'linked')
  const cycleCompleted = cycle?.status === 'completed'
  const attachments = runtime.workspace.collections.resourceAttachments.filter(item => item.contextRef.id === cycle?.id || item.contextRef.id === version.id || item.contextRef.id === project.id)
  const supportItems = [
    !facts.hasTabletopRun
      ? { entry: 'first-prototype', title: '第一个可运行原型', why: '当前还没有 PrototypeRun。', watch: '如何只保留能回答问题的组件。', bring: '带回一个今天能跑三轮的范围。' }
      : { entry: 'player-symptom-diagnosis', title: '把玩家评价改成现场问题', why: '你已有可运行的版本。', watch: '行为、局面与评价如何分开。', bring: '带回一个可观察、可反驳的问题。' },
    { entry: 'first-playtest', title: '第一次外部测试', why: facts.hasExternalTest ? '可以对照当前场次检查证据边界。' : '当前还没有外部玩家 Session。', watch: '找谁、问什么、何时停止。', bring: '带回一份单问题测试计划。' },
    { entry: 'rules-and-teaching', title: '规则、教学与查找恢复', why: version.lifecycle === 'frozen' ? '被测版本已冻结，可以观察教学表面。' : '先知道 Teach test 与 Blind test 不是同一阶段。', watch: '第一个偏离点与查找路径。', bring: '只带回一个待复测的教学修改。' },
  ]
  const downloadProjectShare = () => {
    const raw = runtime.exportProjectShare(project.id)
    if (!raw) return
    const url = URL.createObjectURL(new Blob([raw], { type: 'application/json' }))
    const link = document.createElement('a')
    link.href = url
    link.download = `一桌点子-${project.title.replace(/[^\p{L}\p{N}-]+/gu, '-')}-脱敏项目包.json`
    link.click()
    URL.revokeObjectURL(url)
  }
  const go = (step: NonNullable<AppRoute['workbenchStep']>, iterationId = cycle?.id) => onNavigate({ view: 'workbench', tool: 'redesign', workbenchStep: step, workContext: { projectId: project.id, versionId: version.id, ...(iterationId ? { iterationId } : {}) } }, true)
  const begin = () => {
    let iterationId = ''
    const saved = runtime.commit(draft => { iterationId = startIteration(draft, { projectId: project.id, versionId: version.id, uncertainty }) }, '本轮迭代已建立。')
    if (saved) go('question', iterationId)
  }
  const savePlan = () => { runtime.commit(draft => saveTestPlanDraft(draft, { projectId: project.id, versionId: version.id, iterationId: cycle!.id, question, signals, disconfirmingSignal: disconfirming }), '测试问题和可观察信号已保存。'); go('scope') }
  const savePrototypeDraft = () => { runtime.commit(draft => savePrototype(draft, { projectId: project.id, versionId: version.id, title: prototypeTitle, design: { scope: prototypeScope } }), '最小原型已保存，但还不算已落桌。') }
  const recordRun = () => { runtime.commit(draft => recordPrototypeRun(draft, { prototypeId: prototype!.id, projectId: project.id, versionId: version.id, note: runNote }), '已记录一次真实的原型运行。'); go('session') }
  const confirm = () => runtime.commit(draft => confirmTestPlan(draft, plan!.id), '版本已冻结，测试计划已确认。')
  const complete = () => { runtime.commit(draft => completePlaytest(draft, { testPlanId: plan!.id, kind: sessionKind, observations: observations.split('\n').filter(Boolean) }), '真实测试场次与观察证据已保存。'); go('review') }
  const review = () => { runtime.commit(draft => createEvidenceReview(draft, { sessionIds: sessions.map(item => item.id), observation: reviewObservation, interpretation, alternative }), '观察、解释与替代解释已分开保存。'); go('change') }
  const revise = () => {
    let nextVersionId = ''
    const saved = runtime.commit(draft => { nextVersionId = createRevisionFromReviews(draft, { reviewIds: reviews.map(item => item.id), primaryChange: change, unchanged: unchanged.split('\n'), rationale }) }, '变更简报已生成精确版本边，新版本已建立。')
    if (saved) onNavigate({ view: 'workbench', tool: 'redesign', workContext: { projectId: project.id, versionId: nextVersionId } })
  }
  return <main className="workbench-page" id="main-content" tabIndex={-1}><RuntimeMessages />
    <header className="project-context-head"><div><p className="workbench-kicker">当前工作对象</p><h1>{project.title}</h1><p>{version.label}{cycle ? ` · 本轮：${cycle.uncertainty || '待写不确定'}` : ' · 尚未开始迭代'}</p><button className="project-share-button" type="button" onClick={downloadProjectShare}>下载脱敏项目包</button></div><code>{serializeRoute(route)}</code></header>
    <section className="fact-strip" aria-label="当前已发生的事实">{[['原型草稿', facts.hasPrototype], ['已落桌运行', facts.hasTabletopRun], ['已完成自测', facts.hasSoloTest], ['已完成外测', facts.hasExternalTest], ['已复盘证据', facts.hasEvidenceReview], ['已建立下一版', facts.hasOutgoingRevision]].map(([label, done]) => <span className={done ? 'is-done' : ''} key={String(label)}>{done ? '已发生' : '未发生'} · {label}</span>)}</section>
    <details className="context-support"><summary>当前任务的支持资料（{supportItems.length} 项）{attachments.length ? ` · 已附着 ${attachments.length} 项` : ''}</summary><div>{supportItems.map(item => <article key={item.entry}><h2>{item.title}</h2><dl><dt>为什么相关</dt><dd>{item.why}</dd><dt>看什么</dt><dd>{item.watch}</dd><dt>如何带回</dt><dd>{item.bring}</dd><dt>类比边界</dt><dd>资料只提供问题和反例，不证明它适合你的游戏。</dd></dl><button type="button" onClick={() => onNavigate({ view: 'resources', tool: route.tool, resourceEntry: item.entry, workContext: { ...route.workContext, returnTo: serializeRoute(route) } })}>打开这组资料</button></article>)}</div></details>
    {!cycle && version.lifecycle === 'working' && <section className="iteration-card"><span>01</span><h2>当前最大的不确定是什么？</h2><p>不写「好不好玩」，写一个现在确实不知道、且会改变下一版决定的事。</p><textarea value={uncertainty} onChange={event => setUncertainty(event.target.value)} /><button type="button" disabled={!uncertainty.trim()} onClick={begin}>开始这一轮</button></section>}
    {cycleCompleted && <section className="completed-cycle-note" role="status"><strong>这轮迭代已建立下一版。</strong><p>以下是可追溯的历史记录，不能从同一轮再创建第二条版本边。</p></section>}
    {cycle && <fieldset className={cycleCompleted ? 'iteration-stack is-readonly' : 'iteration-stack'} disabled={cycleCompleted}>
      <section className="iteration-card"><span>02</span><h2>只回答一个测试问题</h2><label><b>主问题</b><textarea value={question || String(plan?.plan.question ?? '')} onChange={event => setQuestion(event.target.value)} /></label><label><b>什么现象算信号</b><textarea value={signals || String(plan?.plan.signals ?? '')} onChange={event => setSignals(event.target.value)} /></label><label><b>什么现象会反驳当前猜想</b><textarea value={disconfirming || String(plan?.plan.disconfirmingSignal ?? '')} onChange={event => setDisconfirming(event.target.value)} /></label><button type="button" disabled={!question.trim() || !signals.trim()} onClick={savePlan}>保存问题与证据信号</button></section>
      <section className="iteration-card"><span>03</span><h2>把原型裁到刚好能回答问题</h2><label><b>原型名</b><input value={prototypeTitle} onChange={event => setPrototypeTitle(event.target.value)} /></label><label><b>本轮保留什么，删掉什么</b><textarea value={prototypeScope || String(prototype?.design.scope ?? '')} onChange={event => setPrototypeScope(event.target.value)} /></label><button type="button" disabled={!plan || !prototypeScope.trim()} onClick={savePrototypeDraft}>保存原型草稿</button>{prototype && !facts.hasTabletopRun && <div className="actual-action"><strong>草稿不等于已落桌</strong><label><b>真正跑起来时发生了什么</b><textarea value={runNote} onChange={event => setRunNote(event.target.value)} /></label><button type="button" disabled={!runNote.trim()} onClick={recordRun}>记录一次已完成的原型运行</button></div>}</section>
      <section className="iteration-card"><span>04</span><h2>冻结被测版本，再执行测试</h2>{plan?.status !== 'confirmed' ? <><p>只有已记录真实原型运行，才能确认计划并冻结版本。</p><button type="button" disabled={!facts.hasTabletopRun || !plan} onClick={confirm}>冻结版本并确认计划</button></> : <><label><b>测试类型</b><select value={sessionKind} onChange={event => setSessionKind(event.target.value as typeof sessionKind)}><option value="solo">设计者自测</option><option value="guided">设计者带领</option><option value="external">外部玩家</option><option value="blind">盲测</option></select></label><label><b>现场观察，每行一条</b><textarea value={observations} onChange={event => setObservations(event.target.value)} placeholder="只写行为、状态、原话或介入时刻" /></label><button type="button" disabled={!observations.trim()} onClick={complete}>保存已完成的真实测试</button></>}</section>
      <section className="iteration-card"><span>05</span><h2>分开观察、解释和替代解释</h2><label><b>可直接指向记录的观察</b><textarea value={reviewObservation} onChange={event => setReviewObservation(event.target.value)} /></label><label><b>当前解释</b><textarea value={interpretation} onChange={event => setInterpretation(event.target.value)} /></label><label><b>至少一个替代解释</b><textarea value={alternative} onChange={event => setAlternative(event.target.value)} /></label><button type="button" disabled={!sessions.length || !reviewObservation.trim() || !interpretation.trim() || !alternative.trim()} onClick={review}>形成证据复盘</button></section>
      <section className="iteration-card"><span>06</span><h2>让证据变成一条精确的版本边</h2><label><b>下一版优先改什么</b><textarea value={change} onChange={event => setChange(event.target.value)} /></label><label><b>明确不改什么，每行一条</b><textarea value={unchanged} onChange={event => setUnchanged(event.target.value)} /></label><label><b>哪些证据支持这个改动</b><textarea value={rationale} onChange={event => setRationale(event.target.value)} /></label><button className="primary-button" type="button" disabled={!reviews.length || !change.trim() || !unchanged.trim() || !rationale.trim()} onClick={revise}>建立下一版并完成本轮</button></section>
    </fieldset>}
  </main>
}

export function WorkbenchV3(props: WorkbenchProps) {
  if (props.route.view === 'projects') return <ProjectsPage onNavigate={props.onNavigate} />
  if (props.route.workbenchAction === 'new') return <NewIdeaFlow onNavigate={props.onNavigate} />
  if (props.route.workContext?.projectId) return <ProjectWorkbench route={props.route} onNavigate={props.onNavigate} />
  return <WorkbenchLanding onNavigate={props.onNavigate} onOpenKnowledge={props.onOpenKnowledge} />
}
