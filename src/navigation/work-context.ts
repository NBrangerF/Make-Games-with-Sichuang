import type { LocalWorkspaceV3 } from '../domain/schema-v3.ts'
import type { AppRoute, WorkContext, WorkContextIssue } from '../url-state.ts'
import { validateWorkContext } from '../url-state.ts'

export type WorkContextRecoveryCode =
  | WorkContextIssue['code']
  | 'missing_project'
  | 'missing_version'
  | 'version_project_mismatch'
  | 'missing_iteration'
  | 'iteration_scope_mismatch'
  | 'missing_enrollment'
  | 'enrollment_course_mismatch'

export type WorkContextRecoveryIssue = Readonly<{
  code: WorkContextRecoveryCode
  message: string
}>

export type ResolvedWorkContext = Readonly<{
  authority: 'explicit_url' | 'active_fallback' | 'none'
  context: WorkContext
  status: 'resolved' | 'recovery_required' | 'empty'
  issues: WorkContextRecoveryIssue[]
}>

function allowsActiveFallback(route: AppRoute) {
  return (route.view === 'course' && !route.workContext?.unitId)
    || (route.view === 'workbench' && !route.workbenchAction && !route.workContext?.projectId)
    || route.view === 'projects'
}

export function resolveWorkContext(workspace: LocalWorkspaceV3, route: AppRoute): ResolvedWorkContext {
  const explicit = route.workContext
  const authority = explicit ? 'explicit_url' : allowsActiveFallback(route) ? 'active_fallback' : 'none'
  const context: WorkContext = explicit ?? (authority === 'active_fallback' ? {
    ...(workspace.active.enrollmentId ? { enrollmentId: workspace.active.enrollmentId } : {}),
    ...(workspace.active.projectId ? { projectId: workspace.active.projectId } : {}),
    ...(workspace.active.versionId ? { versionId: workspace.active.versionId } : {}),
    ...(workspace.active.iterationId ? { iterationId: workspace.active.iterationId } : {}),
  } : {})
  const issues: WorkContextRecoveryIssue[] = validateWorkContext(context).map(item => ({ code: item.code, message: item.message }))

  const project = context.projectId ? workspace.collections.projects.find(item => item.id === context.projectId) : undefined
  if (context.projectId && !project) issues.push({ code: 'missing_project', message: '链接中的项目在当前工作区不存在。' })
  const version = context.versionId ? workspace.collections.projectVersions.find(item => item.id === context.versionId) : undefined
  if (context.versionId && !version) issues.push({ code: 'missing_version', message: '链接中的版本在当前工作区不存在。' })
  else if (version && context.projectId && version.projectId !== context.projectId) issues.push({ code: 'version_project_mismatch', message: '该版本不属于链接中的项目。' })
  const iteration = context.iterationId ? workspace.collections.iterationCycles.find(item => item.id === context.iterationId) : undefined
  if (context.iterationId && !iteration) issues.push({ code: 'missing_iteration', message: '链接中的迭代轮次在当前工作区不存在。' })
  else if (iteration && (iteration.projectId !== context.projectId || iteration.versionId !== context.versionId)) issues.push({ code: 'iteration_scope_mismatch', message: '该迭代轮次不属于链接中的项目版本。' })
  const enrollment = context.enrollmentId ? workspace.collections.courseEnrollments.find(item => item.id === context.enrollmentId) : undefined
  if (context.enrollmentId && !enrollment) issues.push({ code: 'missing_enrollment', message: '链接中的课程记录在当前工作区不存在。' })
  else if (enrollment && context.courseId && enrollment.courseId !== context.courseId) issues.push({ code: 'enrollment_course_mismatch', message: '该学习记录不属于链接中的课程。' })

  return {
    authority,
    context,
    status: issues.length ? 'recovery_required' : Object.keys(context).length ? 'resolved' : 'empty',
    issues,
  }
}

export function contextReturnRoute(route: AppRoute) {
  const value = route.workContext?.returnTo
  if (!value || validateWorkContext({ returnTo: value }).length) return null
  return value
}

export function contextLabel(workspace: LocalWorkspaceV3, context: WorkContext | undefined) {
  if (!context) return '未绑定工作对象'
  const project = context.projectId ? workspace.collections.projects.find(item => item.id === context.projectId) : undefined
  const version = context.versionId ? workspace.collections.projectVersions.find(item => item.id === context.versionId) : undefined
  const parts = [project?.title, version?.label, context.iterationId ? '当前迭代' : null, context.unitId ? `单元 ${context.unitId}` : null].filter(Boolean)
  return parts.length ? parts.join(' · ') : '未绑定工作对象'
}
