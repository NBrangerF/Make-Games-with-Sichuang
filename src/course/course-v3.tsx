import { useState } from 'react'

import { saveCourseActivityDraft, startCourseEnrollment, submitCourseActivity, submitCourseEntityActivity } from '../domain/course-commands-v3'
import type { JsonObject, TypedRef } from '../domain/schema-v3'
import { resolveWorkContext } from '../navigation/work-context'
import { serializeRoute, type AppRoute } from '../url-state'
import { useWorkspaceRuntime } from '../workspace-runtime'
import { COURSE_V3_ID, COURSE_V3_VERSION, courseUnitsV3, getCourseUnit, unit01Games } from './course-catalog-v3'

type CourseProps = { route: AppRoute; onNavigate: (route: AppRoute, replace?: boolean) => void; onOpenProblems: () => void; onOpenWorkbench: (returnTo: string) => void }
type ObservationRow = { played: boolean; action: string; choice: string; information: string; feedback: string }
const emptyRows = () => Object.fromEntries(unit01Games.map(game => [game.id, { played: false, action: '', choice: '', information: '', feedback: '' }])) as Record<string, ObservationRow>

function CourseRuntimeNotice() {
  const runtime = useWorkspaceRuntime()
  if (!runtime.notice && !runtime.error) return null
  return <div className={runtime.error ? 'course-runtime-notice is-error' : 'course-runtime-notice'} role={runtime.error ? 'alert' : 'status'}><span>{runtime.error ?? runtime.notice}</span><button type="button" onClick={runtime.dismissNotice}>关闭</button></div>
}

function courseRoute(enrollmentId: string, unitId?: string, activityId?: string): AppRoute {
  return { view: 'course', courseMode: 'practice', tool: 'redesign', workContext: { courseId: COURSE_V3_ID, enrollmentId, ...(unitId ? { unitId } : {}), ...(activityId ? { activityId } : {}) } }
}

function CourseDashboard({ onNavigate, onOpenProblems }: Pick<CourseProps, 'onNavigate' | 'onOpenProblems'>) {
  const runtime = useWorkspaceRuntime()
  const enrollment = runtime.workspace.collections.courseEnrollments.find(item => item.courseId === COURSE_V3_ID && item.courseVersion === COURSE_V3_VERSION && item.status === 'active')
  const unit = getCourseUnit(enrollment?.currentUnitId)
  const start = () => {
    let enrollmentId = ''
    const saved = runtime.commit(draft => { enrollmentId = startCourseEnrollment(draft, { courseId: COURSE_V3_ID, courseVersion: COURSE_V3_VERSION, firstUnitId: courseUnitsV3[0].id }) }, '设计实践已建立本地记录。')
    if (saved) onNavigate(courseRoute(enrollmentId, unit.id, unit.activityId))
  }
  return <main className="course-page" id="main-content" tabIndex={-1}>
    <CourseRuntimeNotice />
    <p><a href="#course">返回系统阅读</a></p><header className="course-hero"><div><p className="course-kicker">可选设计实践</p><h1>先学会看，<br />再做很多小东西。</h1></div><p>这不是从灵感直到出版的九步法。每个单元只练一种思维、使用一件工具，留下一份可检查的产物。</p></header>
    <section className="course-current" aria-labelledby="course-current-title"><p className="course-kicker">{enrollment ? '继续学习' : '从这里开始'}</p><span>{unit.number}</span><div><h2 id="course-current-title">{unit.title}</h2><p>{unit.question}</p><small>本单元留下：{unit.output}</small></div><button className="primary-button" type="button" onClick={enrollment ? () => onNavigate(courseRoute(enrollment.id, unit.id, unit.activityId)) : start}>{enrollment ? `继续第 ${Number(unit.number)} 单元` : '开始第 1 单元'}</button></section>
    <details className="course-syllabus"><summary>查看 9 个单元的完整路线</summary><ol>{courseUnitsV3.map(item => <li key={item.id}><span>{item.number}</span><div><strong>{item.title}</strong><p>{item.output}</p></div><small>{item.status === 'available' ? '可完成' : '正在接入活动运行时'}</small></li>)}</ol></details>
    <button className="course-problem-link" type="button" onClick={onOpenProblems}>现在只被一个具体问题卡住？打开设计知识库</button>
  </main>
}

function CourseRecovery({ issues, onNavigate }: { issues: readonly { message: string }[]; onNavigate: CourseProps['onNavigate'] }) {
  return <main className="course-page" id="main-content" tabIndex={-1}><header className="course-subhead"><p className="course-kicker">需要恢复学习上下文</p><h1>这个活动链接不属于当前课程记录。</h1></header><ul>{issues.map((item, index) => <li key={index}>{item.message}</li>)}</ul><button type="button" onClick={() => onNavigate({ view: 'course', tool: 'redesign' })}>返回课程总览</button></main>
}

function CourseUnitBoundary({ enrollmentId, currentUnitId, completed, onNavigate }: { enrollmentId: string; currentUnitId: string; completed: boolean; onNavigate: CourseProps['onNavigate'] }) {
  const current = getCourseUnit(currentUnitId)
  return <main className="course-page" id="main-content" tabIndex={-1}><CourseRuntimeNotice /><header className="course-subhead"><p className="course-kicker">{completed ? '已完成单元' : '递进门槛'}</p><h1>{completed ? '这个单元的产物已保留。' : '先完成当前这一步。'}</h1><p>{completed ? '课程不会因重新打开旧链接而倒退进度。' : `当前是 Unit ${Number(current.number)}。深链会保留，但不能跳过前置产物直接完成后续单元。`}</p></header><button className="primary-button" type="button" onClick={() => onNavigate(courseRoute(enrollmentId, current.id, current.activityId))}>打开当前 Unit {Number(current.number)}</button></main>
}

function Unit01Runner({ route, onNavigate }: Pick<CourseProps, 'route' | 'onNavigate'>) {
  const runtime = useWorkspaceRuntime()
  const context = route.workContext!
  const existingAttempt = runtime.workspace.collections.activityAttempts.find(item => item.enrollmentId === context.enrollmentId && item.unitId === 'unit-01' && item.activityId === 'compare-three-microgames')
  const artifactId = existingAttempt?.artifactRefs.find(ref => ref.kind === 'artifact')?.id
  const artifact = runtime.workspace.collections.artifacts.find(item => item.id === artifactId && item.artifactType === 'course_output')
  const prior = artifact?.artifactType === 'course_output' && typeof artifact.payload.value === 'object' && artifact.payload.value && !Array.isArray(artifact.payload.value) ? artifact.payload.value as JsonObject : null
  const [rows, setRows] = useState<Record<string, ObservationRow>>(() => {
    const base = emptyRows()
    const priorRows = prior?.rows
    if (!priorRows || typeof priorRows !== 'object' || Array.isArray(priorRows)) return base
    for (const game of unit01Games) {
      const value = priorRows[game.id]
      if (value && typeof value === 'object' && !Array.isArray(value)) base[game.id] = { ...base[game.id], ...value } as ObservationRow
    }
    return base
  })
  const [reflection, setReflection] = useState(typeof prior?.reflection === 'string' ? prior.reflection : '')
  const value = () => ({ rows, reflection }) as unknown as JsonObject
  const valid = unit01Games.every(game => { const row = rows[game.id]; return row.played && row.action.trim() && row.choice.trim() && row.information.trim() && row.feedback.trim() }) && reflection.trim().length >= 20
  const update = (gameId: string, field: keyof ObservationRow, next: string | boolean) => setRows(current => ({ ...current, [gameId]: { ...current[gameId], [field]: next } }))
  const saveDraft = () => runtime.commit(draft => saveCourseActivityDraft(draft, { enrollmentId: context.enrollmentId!, unitId: 'unit-01', unitRevision: '1', activityId: 'compare-three-microgames', activityRevision: '1', value: value() }), '对比表草稿已写入 Unit 1 Artifact，刷新后可继续。')
  const complete = () => {
    const saved = runtime.commit(draft => submitCourseActivity(draft, { enrollmentId: context.enrollmentId!, unitId: 'unit-01', unitRevision: '1', activityId: 'compare-three-microgames', activityRevision: '1', value: value(), nextUnitId: 'unit-02' }), 'Unit 1 已完成：三款微型游戏对比表已保存。')
    if (saved) onNavigate({ view: 'course', tool: 'redesign', workContext: { courseId: COURSE_V3_ID, enrollmentId: context.enrollmentId! } })
  }
  return <main className="course-page unit-runner" id="main-content" tabIndex={-1}>
    <CourseRuntimeNotice />
    <a className="course-back" href="#course" onClick={event => { event.preventDefault(); onNavigate({ view: 'course', tool: 'redesign', workContext: { courseId: COURSE_V3_ID, enrollmentId: context.enrollmentId! } }) }}>返回课程总览</a>
    <header className="course-subhead"><p className="course-kicker">单元 01 · 工具：三款游戏对比表</p><h1>从玩家行为看游戏</h1><p>不需要购买商业游戏。下面三款短游戏只用纸片、标记或小物件，每款运行约 5 分钟。</p></header>
    <section className="unit-concept"><p className="course-kicker">一种思维</p><h2>规则 ≠ 行为 ≠ 体验</h2><p>{courseUnitsV3[0].conciseConcept}</p><div><p><strong>例子</strong>{courseUnitsV3[0].example}</p><p><strong>反例</strong>{courseUnitsV3[0].counterexample}</p></div></section>
    <section className="microgame-grid" aria-label="三款原创微型游戏">{unit01Games.map(game => <article key={game.id}><p className="course-kicker">5 分钟微型游戏</p><h2>{game.title}</h2><dl><div><dt>材料</dt><dd>{game.materials}</dd></div><div><dt>设置</dt><dd>{game.setup}</dd></div></dl><ol>{game.rules.map(rule => <li key={rule}>{rule}</li>)}</ol><p className="watch-note"><strong>只观察这件事</strong>{game.watch}</p></article>)}</section>
    <section className="comparison-tool"><p className="course-kicker">一件工具</p><h2>运行后再填对比表</h2>{unit01Games.map(game => { const row = rows[game.id]; return <fieldset key={game.id}><legend>{game.title}</legend><label className="played-check"><input type="checkbox" checked={row.played} onChange={event => update(game.id, 'played', event.target.checked)} /><span>我已经用上述材料实际运行至少一轮</span></label><label><span>一个可观察的玩家行为</span><textarea value={row.action} onChange={event => update(game.id, 'action', event.target.value)} /></label><label><span>当时在哪些选项之间决定</span><textarea value={row.choice} onChange={event => update(game.id, 'choice', event.target.value)} /></label><div className="form-pair"><label><span>做决定时知道什么</span><textarea value={row.information} onChange={event => update(game.id, 'information', event.target.value)} /></label><label><span>行动后立刻看见什么</span><textarea value={row.feedback} onChange={event => update(game.id, 'feedback', event.target.value)} /></label></div></fieldset>})}<label><span>最后比较：哪一款让你最容易看见「玩家如何决定」？用至少 20 个字说明。</span><textarea value={reflection} onChange={event => setReflection(event.target.value)} /></label><div className="course-save-actions"><button type="button" onClick={saveDraft}>保存草稿</button><button className="primary-button" type="button" disabled={!valid} onClick={complete}>提交产物并完成 Unit 1</button></div></section>
    <section className="unit-rubric"><h2>完成前自查</h2><ul>{courseUnitsV3[0].rubric.map(item => <li key={item}>{item}</li>)}</ul><p>完成这一单元只证明你留下了一份对比观察产物，不代表你已掌握了所有游戏分析。</p></section>
  </main>
}

type FieldDefinition = Readonly<{ key: string; label: string; hint: string }>
const structuredUnitFields: Record<string, readonly FieldDefinition[]> = {
  'unit-02': [
    { key: 'goal', label: '玩家在追求哪个可见状态？', hint: '不写「获胜」，写桌面上会发生什么。' },
    { key: 'actions', label: '轮到玩家时能执行哪些动作？', hint: '每行一个真正能操作的动作。' },
    { key: 'ending', label: '什么可观察条件会让游戏结束？', hint: '写清触发时刻与结果比较。' },
  ],
  'unit-03': [
    { key: 'options', label: '一个关键时刻有哪两个以上可考虑选项？', hint: '写具体动作，不写「采取最佳策略」。' },
    { key: 'tradeoffs', label: '每个选项得到什么、放弃什么？', hint: '检查是否有一个选项在所有方面都更好。' },
    { key: 'information', label: '做决定时哪些信息可见，哪些还不知道？', hint: '分开公开、隐藏与随机信息。' },
  ],
  'unit-08': [
    { key: 'teachingPath', label: '玩家从设置到第一个决定，依次在哪里学什么？', hint: '写出口头教学、组件、玩家帮助和规则书的分工。' },
    { key: 'firstDivergence', label: '玩家第一次停下、查找或做错的具体时刻是什么？', hint: '只记可观察动作，不写「没理解」。' },
    { key: 'accessibility', label: '哪个关键信息不仅依赖颜色或记忆？', hint: '写出形状、文字、位置或查找路径。' },
  ],
}

function UnitHeader({ unitId }: { unitId: string }) {
  const unit = getCourseUnit(unitId)
  return <><header className="course-subhead"><p className="course-kicker">单元 {unit.number} · 工具：{unit.toolLabel}</p><h1>{unit.title}</h1><p>{unit.question}</p></header><section className="unit-concept"><p className="course-kicker">一种思维</p><h2>{unit.toolLabel}</h2><p>{unit.conciseConcept}</p><div><p><strong>例子</strong>{unit.example}</p><p><strong>反例</strong>{unit.counterexample}</p></div></section></>
}

function backToCourse(onNavigate: CourseProps['onNavigate'], enrollmentId: string) {
  onNavigate({ view: 'course', tool: 'redesign', workContext: { courseId: COURSE_V3_ID, enrollmentId } })
}

function StructuredUnitRunner({ route, onNavigate }: Pick<CourseProps, 'route' | 'onNavigate'>) {
  const runtime = useWorkspaceRuntime()
  const context = route.workContext!
  const unit = getCourseUnit(context.unitId)
  const fields = structuredUnitFields[unit.id]
  const attempt = runtime.workspace.collections.activityAttempts.find(item => item.enrollmentId === context.enrollmentId && item.unitId === unit.id && item.activityId === unit.activityId)
  const artifactId = attempt?.artifactRefs.find(ref => ref.kind === 'artifact')?.id
  const artifact = runtime.workspace.collections.artifacts.find(item => item.id === artifactId && item.artifactType === 'course_output')
  const priorValue = artifact?.artifactType === 'course_output' && typeof artifact.payload.value === 'object' && artifact.payload.value && !Array.isArray(artifact.payload.value) ? artifact.payload.value as JsonObject : {}
  const [values, setValues] = useState<Record<string, string>>(() => Object.fromEntries(fields.map(field => {
    const priorField = priorValue[field.key]
    return [field.key, typeof priorField === 'string' ? priorField : '']
  })))
  const valid = fields.every(field => values[field.key]?.trim().length >= 12)
  const nextUnit = courseUnitsV3[courseUnitsV3.findIndex(item => item.id === unit.id) + 1]?.id ?? null
  const save = (complete: boolean) => {
    const saved = runtime.commit(draft => complete
      ? submitCourseActivity(draft, { enrollmentId: context.enrollmentId!, unitId: unit.id, unitRevision: '1', activityId: unit.activityId, activityRevision: unit.activityRevision, value: values, nextUnitId: nextUnit })
      : saveCourseActivityDraft(draft, { enrollmentId: context.enrollmentId!, unitId: unit.id, unitRevision: '1', activityId: unit.activityId, activityRevision: unit.activityRevision, value: values }),
    complete ? `Unit ${Number(unit.number)} 已完成：${unit.output}已保存。` : `${unit.toolLabel}草稿已保存，刷新后可继续。`)
    if (complete && saved) backToCourse(onNavigate, context.enrollmentId!)
  }
  return <main className="course-page unit-runner" id="main-content" tabIndex={-1}><CourseRuntimeNotice /><button className="course-back" type="button" onClick={() => backToCourse(onNavigate, context.enrollmentId!)}>返回课程总览</button><UnitHeader unitId={unit.id} /><section className="comparison-tool structured-course-tool"><p className="course-kicker">一件工具</p><h2>{unit.output}</h2>{fields.map(field => <label key={field.key}><span>{field.label}</span><small>{field.hint}</small><textarea value={values[field.key]} onChange={event => setValues(current => ({ ...current, [field.key]: event.target.value }))} /></label>)}<div className="course-save-actions"><button type="button" onClick={() => save(false)}>保存草稿</button><button className="primary-button" type="button" disabled={!valid} onClick={() => save(true)}>提交产物并完成 Unit {Number(unit.number)}</button></div></section><section className="unit-rubric"><h2>完成前自查</h2><ul>{unit.rubric.map(item => <li key={item}>{item}</li>)}</ul></section></main>
}

type EvidenceOption = Readonly<{ id: string; kind: TypedRef['kind']; title: string; detail: string }>

function evidenceOptions(unitId: string, workspace: ReturnType<typeof useWorkspaceRuntime>['workspace']): EvidenceOption[] {
  if (unitId === 'unit-04') return workspace.collections.prototypeRuns.filter(item => item.status === 'completed').map(item => ({ id: item.id, kind: 'prototype_run', title: workspace.collections.projects.find(project => project.id === item.projectId)?.title ?? '未命名项目', detail: `已完成原型运行 · ${new Date(item.endedAt ?? item.updatedAt).toLocaleDateString()}` }))
  if (unitId === 'unit-05') return workspace.collections.testPlans.filter(item => item.status === 'confirmed' && item.linkState === 'linked').map(item => ({ id: item.id, kind: 'test_plan', title: String(item.plan.question ?? '已确认测试计划'), detail: '已绑定冻结版本与证据信号' }))
  if (unitId === 'unit-06') return workspace.collections.playtestSessions.filter(item => item.status === 'completed' && item.linkState === 'linked' && workspace.collections.evidenceItems.some(evidence => evidence.sessionId === item.id)).map(item => ({ id: item.id, kind: 'playtest_session', title: `${item.kind} 测试场次`, detail: `${workspace.collections.evidenceItems.filter(evidence => evidence.sessionId === item.id).length} 条现场证据` }))
  if (unitId === 'unit-07') return workspace.collections.changeBriefs.map(item => ({ id: item.id, kind: 'change_brief', title: item.primaryChange, detail: `从 ${workspace.collections.projectVersions.find(version => version.id === item.fromVersionId)?.label ?? '旧版'} 到 ${workspace.collections.projectVersions.find(version => version.id === item.toVersionId)?.label ?? '新版'}` }))
  if (unitId === 'unit-09') return workspace.collections.projects.filter(project => {
    const versionIds = new Set(workspace.collections.projectVersions.filter(version => version.projectId === project.id).map(version => version.id))
    return workspace.collections.changeBriefs.some(brief => brief.projectId === project.id) && workspace.collections.playtestSessions.some(session => Boolean(session.versionId && versionIds.has(session.versionId) && session.status === 'completed'))
  }).map(project => ({ id: project.id, kind: 'project', title: project.title, detail: `${workspace.collections.projectVersions.filter(version => version.projectId === project.id).length} 个版本 · 有测试与变更边` }))
  return []
}

const evidenceInstructions: Record<string, string> = {
  'unit-04': '请在项目工作台真正运行一次能连续三轮的纸面原型。',
  'unit-05': '请先写一个主问题、正向与反驳信号，运行原型后再确认计划。',
  'unit-06': '请执行一场真实测试，并留下至少一条行为、状态、原话或主持介入记录。',
  'unit-07': '请用 Session 形成 EvidenceReview，再建立一条从旧版到新版的 ChangeBrief。',
  'unit-09': '请选择一个已经历真实测试、证据复盘与版本变更的项目。',
}

function EntityGateUnitRunner({ route, onNavigate, onOpenWorkbench }: Pick<CourseProps, 'route' | 'onNavigate' | 'onOpenWorkbench'>) {
  const runtime = useWorkspaceRuntime()
  const context = route.workContext!
  const unit = getCourseUnit(context.unitId)
  const options = evidenceOptions(unit.id, runtime.workspace)
  const [selectedId, setSelectedId] = useState(options[0]?.id ?? '')
  const selected = options.find(item => item.id === selectedId)
  const nextUnit = courseUnitsV3[courseUnitsV3.findIndex(item => item.id === unit.id) + 1]?.id ?? null
  const complete = () => {
    if (!selected) return
    const ref: TypedRef = { scope: 'workspace', kind: selected.kind, id: selected.id, relation: 'evidences' }
    const saved = runtime.commit(draft => submitCourseEntityActivity(draft, { enrollmentId: context.enrollmentId!, unitId: unit.id, unitRevision: '1', activityId: unit.activityId, activityRevision: unit.activityRevision, entityRef: ref, nextUnitId: nextUnit }), `Unit ${Number(unit.number)} 已完成：课程只引用了项目事实，没有改写项目记录。`)
    if (saved) backToCourse(onNavigate, context.enrollmentId!)
  }
  return <main className="course-page unit-runner" id="main-content" tabIndex={-1}><CourseRuntimeNotice /><button className="course-back" type="button" onClick={() => backToCourse(onNavigate, context.enrollmentId!)}>返回课程总览</button><UnitHeader unitId={unit.id} /><section className="entity-gate-tool"><p className="course-kicker">真实行动门槛</p><h2>不用文本声明「我做过了」</h2><p>{evidenceInstructions[unit.id]}</p>{options.length ? <fieldset><legend>选择一条已发生的项目记录</legend>{options.map(option => <label className="entity-option" key={option.id}><input type="radio" name="course-evidence" checked={selectedId === option.id} onChange={() => setSelectedId(option.id)} /><span><strong>{option.title}</strong><small>{option.detail}</small></span></label>)}</fieldset> : <div className="course-empty-evidence" role="status"><strong>当前还没有符合条件的记录。</strong><p>去工作台执行上面的任务，完成后回到这个链接。</p><button className="primary-button" type="button" onClick={() => onOpenWorkbench(serializeRoute(route))}>打开项目工作台</button></div>}<div className="course-save-actions"><button className="primary-button" type="button" disabled={!selected} onClick={complete}>引用这条记录并完成 Unit {Number(unit.number)}</button></div></section><section className="unit-rubric"><h2>完成前自查</h2><ul>{unit.rubric.map(item => <li key={item}>{item}</li>)}</ul><p>课程进度与项目进度分开：这里只建立引用，不会为项目伪造事实。</p></section></main>
}

export function CourseV3({ route, onNavigate, onOpenProblems, onOpenWorkbench }: CourseProps) {
  const runtime = useWorkspaceRuntime()
  if (!route.workContext?.unitId) return <CourseDashboard onNavigate={onNavigate} onOpenProblems={onOpenProblems} />
  const resolved = resolveWorkContext(runtime.workspace, route)
  const unit = courseUnitsV3.find(item => item.id === route.workContext?.unitId)
  if (resolved.status === 'recovery_required' || !unit) return <CourseRecovery issues={resolved.issues.length ? resolved.issues : [{ message: '课程单元不存在。' }]} onNavigate={onNavigate} />
  const enrollment = runtime.workspace.collections.courseEnrollments.find(item => item.id === route.workContext?.enrollmentId)
  const attempt = runtime.workspace.collections.activityAttempts.find(item => item.enrollmentId === enrollment?.id && item.unitId === unit.id && item.activityId === unit.activityId)
  if (enrollment && enrollment.currentUnitId !== unit.id) return <CourseUnitBoundary enrollmentId={enrollment.id} currentUnitId={enrollment.currentUnitId} completed={attempt?.state === 'unit_complete'} onNavigate={onNavigate} />
  if (unit.id === 'unit-01') return <Unit01Runner route={route} onNavigate={onNavigate} />
  if (structuredUnitFields[unit.id]) return <StructuredUnitRunner route={route} onNavigate={onNavigate} />
  return <EntityGateUnitRunner route={route} onNavigate={onNavigate} onOpenWorkbench={onOpenWorkbench} />
}
