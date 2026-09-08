import type { DesignToolId } from './data'
import { isLearningContentId, learningContentTitles } from './learning-content-route.ts'
import { toolTitles } from './tool-catalog.ts'
import { PRODUCT_BRAND, PRODUCT_FULL_NAME } from './brand.ts'
import type { IterationStep } from './domain/schema-v3.ts'
import { appendReadingLocation, readReadingLocation, type ReadingLocation } from './reading-navigation.ts'

export type PrimaryView = 'learn' | 'course' | 'workbench' | 'projects' | 'path' | 'resources' | 'tools' | 'method' | 'privacy'
export type MethodSection = 'frameworks' | 'guides' | 'glossary' | 'resource-reading'
export type WorkContext = Readonly<{
  courseId?: string
  enrollmentId?: string
  unitId?: string
  activityId?: string
  projectId?: string
  versionId?: string
  iterationId?: string
  sourceRef?: string
  returnTo?: string
}>
export type WorkContextIssueCode = 'invalid_id' | 'version_without_project' | 'iteration_without_version' | 'enrollment_without_course' | 'unit_without_course' | 'activity_without_unit' | 'invalid_return_route'
export type WorkContextIssue = Readonly<{ code: WorkContextIssueCode; field: keyof WorkContext; message: string }>
export type AppRoute = ReadingLocation & {
  view: PrimaryView
  tool: DesignToolId
  learningNode?: string
  resourceEntry?: string
  resourceId?: string
  readingLanguage?: 'zh-CN' | 'en'
  readingChapter?: string
  courseMode?: 'practice'
  methodSection?: MethodSection
  methodItem?: string
  workbenchAction?: 'new'
  workbenchStep?: IterationStep
  workContext?: WorkContext
  contextIssues?: WorkContextIssue[]
}

export const routableToolIds = [
  'experience-intent', 'core-loop', 'redesign', 'prototype-scope', 'playtest-session', 'issue-to-system',
  'constraint-deck', 'decision-trace', 'shared-decision', 'theme-review', 'production-ledger', 'route-map',
  'balance-pass', 'teaching-path', 'playtest-selector', 'accessibility-observation', 'version-governance', 'feedback', 'evidence-synthesis',
] as const satisfies readonly DesignToolId[]

const viewIds = new Set<PrimaryView>(['learn', 'course', 'workbench', 'projects', 'path', 'resources', 'tools', 'method', 'privacy'])
const toolIds = new Set<DesignToolId>(routableToolIds)
const methodSections = new Set<MethodSection>(['frameworks', 'guides', 'glossary', 'resource-reading'])
const iterationSteps = new Set<IterationStep>(['uncertainty', 'question', 'signals', 'scope', 'session', 'review', 'change', 'version'])
const learningPageIds = new Set(['first-tabletop', 'workshop', 'observe', 'iteration', 'mechanics', 'themes'])
const isLearningPageId = (value: string) => /^node-(0[1-9]|1[0-2])$/.test(value) || learningPageIds.has(value)
const safeId = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/

export const DEFAULT_ROUTE: AppRoute = { view: 'learn', tool: 'redesign' }
const withBrand = (title: string) => `${title} · ${PRODUCT_BRAND}`

function decodeSegment(value: string) {
  try { return decodeURIComponent(value) } catch { return null }
}

function readContext(search: string, pathContext: WorkContext = {}) {
  const params = new URLSearchParams(search)
  const context: Record<string, string> = {}
  const fields: Array<[keyof WorkContext, string]> = [
    ['courseId', 'course'], ['enrollmentId', 'enrollment'], ['unitId', 'unit'], ['activityId', 'activity'],
    ['projectId', 'project'], ['versionId', 'version'], ['iterationId', 'iteration'], ['sourceRef', 'source'], ['returnTo', 'return_to'],
  ]
  for (const [field, parameter] of fields) {
    const value = params.get(parameter)
    if (value) context[field] = value
  }
  return { ...context, ...pathContext } as WorkContext
}

export function validateWorkContext(context: WorkContext | undefined): WorkContextIssue[] {
  if (!context) return []
  const issues: WorkContextIssue[] = []
  const idFields: (keyof WorkContext)[] = ['courseId', 'enrollmentId', 'unitId', 'activityId', 'projectId', 'versionId', 'iterationId', 'sourceRef']
  for (const field of idFields) {
    const value = context[field]
    if (value && !safeId.test(value)) issues.push({ code: 'invalid_id', field, message: `${field} 不是有效的内部 ID。` })
  }
  if (context.versionId && !context.projectId) issues.push({ code: 'version_without_project', field: 'versionId', message: '版本 ID 必须与项目 ID 一起出现。' })
  if (context.iterationId && (!context.projectId || !context.versionId)) issues.push({ code: 'iteration_without_version', field: 'iterationId', message: '迭代轮次必须属于明确项目和版本。' })
  if (context.enrollmentId && !context.courseId) issues.push({ code: 'enrollment_without_course', field: 'enrollmentId', message: '课程记录必须带课程 ID。' })
  if (context.unitId && !context.courseId) issues.push({ code: 'unit_without_course', field: 'unitId', message: '单元必须属于明确课程。' })
  if (context.activityId && (!context.courseId || !context.unitId)) issues.push({ code: 'activity_without_unit', field: 'activityId', message: '活动必须属于明确课程单元。' })
  if (context.returnTo && (!context.returnTo.startsWith('#') || context.returnTo.startsWith('#//'))) issues.push({ code: 'invalid_return_route', field: 'returnTo', message: '返回位置必须是站内 hash route。' })
  return issues
}

function routeWithContext(route: AppRoute, context: WorkContext) {
  const contextIssues = validateWorkContext(context)
  return { ...route, ...(Object.keys(context).length ? { workContext: context } : {}), ...(contextIssues.length ? { contextIssues } : {}) }
}

export function parseRouteHash(hash: string): AppRoute {
  const withoutHash = hash.replace(/^#\/?/, '')
  const queryIndex = withoutHash.indexOf('?')
  const rawPath = queryIndex >= 0 ? withoutHash.slice(0, queryIndex) : withoutHash
  const search = queryIndex >= 0 ? withoutHash.slice(queryIndex + 1) : ''
  const decoded = rawPath.split('/').filter(Boolean).map(decodeSegment)
  if (decoded.some(value => value === null)) return DEFAULT_ROUTE
  const [view = '', first = '', second = '', third = '', fourth = '', fifth = '', sixth = '', seventh = ''] = decoded as string[]
  if (!viewIds.has(view as PrimaryView)) return DEFAULT_ROUTE

  if (view === 'course') {
    if (first === 'reading') return { view: 'course', tool: DEFAULT_ROUTE.tool, ...(second && second !== 'all' ? { readingChapter: second } : {}), readingLanguage: third === 'en' ? 'en' : 'zh-CN', ...readReadingLocation(search) }
    const pathContext: WorkContext = {
      ...(first === 'units' && second ? { unitId: second } : {}),
      ...(third === 'activities' && fourth ? { activityId: fourth } : {}),
    }
    return routeWithContext({ view: 'course', tool: DEFAULT_ROUTE.tool, ...(first === 'practice' ? { courseMode: 'practice' as const } : {}) }, readContext(search, pathContext))
  }
  if (view === 'workbench') {
    if (first === 'new') return routeWithContext({ view: 'workbench', tool: DEFAULT_ROUTE.tool, workbenchAction: 'new' }, readContext(search))
    const pathContext: WorkContext = first === 'projects' && second ? {
      projectId: second,
      ...(third === 'versions' && fourth ? { versionId: fourth } : {}),
      ...(fifth === 'cycles' && sixth ? { iterationId: sixth } : {}),
    } : {}
    const workbenchStep = seventh && iterationSteps.has(seventh as IterationStep) ? seventh as IterationStep : undefined
    return routeWithContext({ view: 'workbench', tool: DEFAULT_ROUTE.tool, ...(workbenchStep ? { workbenchStep } : {}) }, readContext(search, pathContext))
  }

  const context = readContext(search)
  if (view === 'learn') return routeWithContext({ view: 'learn', tool: DEFAULT_ROUTE.tool, ...(isLearningPageId(first) ? { learningNode: first } : {}) }, context)
  if (view === 'resources') return routeWithContext({ view: 'resources', tool: DEFAULT_ROUTE.tool, ...(first ? { resourceEntry: first } : {}), ...(second ? { resourceId: second } : {}), ...(['read', 'cases'].includes(first) ? { readingLanguage: third === 'en' ? 'en' : 'zh-CN', ...readReadingLocation(search) } : {}) }, context)
  if (view === 'privacy') return { view: 'privacy', tool: DEFAULT_ROUTE.tool, readingLanguage: first === 'en' ? 'en' : 'zh-CN' }
  if (view === 'method') {
    if (!methodSections.has(first as MethodSection)) return routeWithContext({ view: 'method', tool: DEFAULT_ROUTE.tool }, context)
    return routeWithContext({ view: 'method', tool: DEFAULT_ROUTE.tool, methodSection: first as MethodSection, ...(second ? { methodItem: second } : {}) }, context)
  }
  if (view !== 'tools') return routeWithContext({ view: view as PrimaryView, tool: DEFAULT_ROUTE.tool }, context)
  return routeWithContext({ view: 'tools', tool: toolIds.has(first as DesignToolId) ? first as DesignToolId : DEFAULT_ROUTE.tool }, context)
}

function appendContext(path: string, context: WorkContext | undefined, pathFields: readonly (keyof WorkContext)[] = []) {
  if (!context) return path
  const excluded = new Set(pathFields)
  const params = new URLSearchParams()
  const fields: Array<[keyof WorkContext, string]> = [
    ['courseId', 'course'], ['enrollmentId', 'enrollment'], ['unitId', 'unit'], ['activityId', 'activity'],
    ['projectId', 'project'], ['versionId', 'version'], ['iterationId', 'iteration'], ['sourceRef', 'source'], ['returnTo', 'return_to'],
  ]
  for (const [field, parameter] of fields) {
    const value = context[field]
    if (value && !excluded.has(field)) params.set(parameter, value)
  }
  const query = params.toString()
  return query ? `${path}${path.includes('?') ? '&' : '?'}${query}` : path
}

export function serializeRoute(route: AppRoute): string {
  if (route.view === 'course') {
    if (route.readingChapter || route.readingLanguage) return appendReadingLocation(`#course/reading/${encodeURIComponent(route.readingChapter || 'all')}/${route.readingLanguage === 'en' ? 'en' : 'zh-CN'}`, route)
    const context = route.workContext
    const path = context?.unitId ? `#course/units/${encodeURIComponent(context.unitId)}${context.activityId ? `/activities/${encodeURIComponent(context.activityId)}` : ''}` : route.courseMode === 'practice' ? '#course/practice' : '#course'
    return appendContext(path, context, ['unitId', 'activityId'])
  }
  if (route.view === 'workbench') {
    if (route.workbenchAction === 'new') return appendContext('#workbench/new', route.workContext)
    const context = route.workContext
    let path = '#workbench'
    const pathFields: (keyof WorkContext)[] = []
    if (context?.projectId) {
      path += `/projects/${encodeURIComponent(context.projectId)}`
      pathFields.push('projectId')
      if (context.versionId) {
        path += `/versions/${encodeURIComponent(context.versionId)}`
        pathFields.push('versionId')
        if (context.iterationId) {
          path += `/cycles/${encodeURIComponent(context.iterationId)}`
          pathFields.push('iterationId')
          if (route.workbenchStep) path += `/${route.workbenchStep}`
        }
      }
    }
    return appendContext(path, context, pathFields)
  }
  let path: string
  if (route.view === 'learn') path = route.learningNode ? `#learn/${encodeURIComponent(route.learningNode)}` : '#learn'
  else if (route.view === 'tools') path = `#tools/${route.tool}`
  else if (route.view === 'resources' && (route.resourceEntry === 'read' || route.resourceEntry === 'cases')) path = appendReadingLocation(`#resources/${route.resourceEntry}/${encodeURIComponent(route.resourceId || 'all')}/${route.readingLanguage === 'en' ? 'en' : 'zh-CN'}`, route)
  else if (route.view === 'privacy' && route.readingLanguage === 'en') path = '#privacy/en'
  else if (route.view === 'resources' && route.resourceEntry) path = `#resources/${encodeURIComponent(route.resourceEntry)}${route.resourceId ? `/${encodeURIComponent(route.resourceId)}` : ''}`
  else if (route.view === 'method' && route.methodSection) path = `#method/${route.methodSection}${route.methodItem ? `/${encodeURIComponent(route.methodItem)}` : ''}`
  else path = `#${route.view}`
  return appendContext(path, route.workContext)
}

export function routeTitle(route: AppRoute): string {
  if (route.view === 'privacy' && route.readingLanguage === 'en') return withBrand('Data and privacy')
  if (route.view === 'course') return withBrand(route.workContext?.unitId ? `课程单元 ${route.workContext.unitId}` : route.courseMode === 'practice' || route.workContext?.courseId ? '设计实践' : '系统阅读')
  if (route.view === 'workbench') return withBrand(route.workbenchAction === 'new' ? '开始新构想' : '设计工作台')
  if (route.view === 'projects') return withBrand('项目')
  if (route.view === 'learn') {
    const learningTitles: Record<string, string> = { 'first-tabletop': '第一次落桌', workshop: '基础设计工作室', observe: '观察实验室', iteration: '原型迭代主线', mechanics: 'Mechanic 设计材料', themes: 'Theme 设计材料' }
    return withBrand(route.learningNode ? (learningTitles[route.learningNode] ?? `学习节点 ${route.learningNode.slice(-2)}`) : '系统阅读')
  }
  if (route.view === 'tools') return withBrand(toolTitles[route.tool])
  if (route.view === 'resources') {
    if (route.resourceEntry === 'cases') return withBrand(route.readingLanguage === 'en' ? 'Case studies' : '案例研究')
    if (route.resourceEntry === 'read') return withBrand(route.readingLanguage === 'en' ? 'Bilingual reading' : '双语阅读')
    if (route.resourceEntry === 'learn' && isLearningContentId(route.resourceId)) return withBrand(learningContentTitles[route.resourceId])
    if (route.resourceEntry === 'learn') return withBrand('学习桌游设计')
    if (route.resourceEntry === 'analyze') return withBrand('从设计师角度分析游戏')
    if (route.resourceEntry === 'problems') return withBrand('按设计问题找资料')
    if (route.resourceEntry === 'all') return withBrand('搜索全部资料')
    return PRODUCT_FULL_NAME
  }
  if (route.view === 'method' && route.methodSection) {
    const methodTitles: Record<MethodSection, string> = { frameworks: '理论框架', guides: '专题指南', glossary: '概念词表', 'resource-reading': '资源阅读说明' }
    return withBrand(methodTitles[route.methodSection])
  }
  const titles: Record<Exclude<PrimaryView, 'tools' | 'course' | 'workbench' | 'projects'>, string> = {
    learn: '从哪里开始', path: '设计路径', resources: '资源库', method: '方法与概念', privacy: '数据与隐私',
  }
  return withBrand(titles[route.view])
}
