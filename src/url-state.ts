import type { DesignToolId } from './data'
import { isLearningContentId, learningContentTitles } from './learning-content-route.ts'
import { toolTitles } from './tool-catalog.ts'
import { PRODUCT_BRAND, PRODUCT_FULL_NAME } from './brand.ts'

export type PrimaryView = 'learn' | 'path' | 'resources' | 'tools' | 'method' | 'privacy'
export type MethodSection = 'frameworks' | 'guides' | 'glossary' | 'resource-reading'
export type AppRoute = { view: PrimaryView; tool: DesignToolId; learningNode?: string; resourceEntry?: string; resourceId?: string; methodSection?: MethodSection; methodItem?: string }

export const routableToolIds = [
  'experience-intent',
  'core-loop',
  'redesign',
  'prototype-scope',
  'playtest-session',
  'issue-to-system',
  'constraint-deck',
  'decision-trace',
  'shared-decision',
  'theme-review',
  'production-ledger',
  'route-map',
  'balance-pass',
  'teaching-path',
  'playtest-selector',
  'accessibility-observation',
  'version-governance',
  'feedback',
  'evidence-synthesis',
] as const satisfies readonly DesignToolId[]

const viewIds = new Set<PrimaryView>(['learn', 'path', 'resources', 'tools', 'method', 'privacy'])
const toolIds = new Set<DesignToolId>(routableToolIds)
const methodSections = new Set<MethodSection>(['frameworks', 'guides', 'glossary', 'resource-reading'])
const isLearningNodeId = (value: string) => /^node-(0[1-9]|1[0-2])$/.test(value)

export const DEFAULT_ROUTE: AppRoute = { view: 'learn', tool: 'redesign' }

const withBrand = (title: string) => `${title} · ${PRODUCT_BRAND}`

export function parseRouteHash(hash: string): AppRoute {
  const raw = hash.replace(/^#\/?/, '')
  const [rawView = '', rawTool = '', rawItem = ''] = raw.split('/')
  let view = rawView
  let tool = rawTool
  let item = rawItem
  try {
    view = decodeURIComponent(rawView)
    tool = decodeURIComponent(rawTool)
    item = decodeURIComponent(rawItem)
  } catch {
    return DEFAULT_ROUTE
  }
  if (!viewIds.has(view as PrimaryView)) return DEFAULT_ROUTE
  if (view === 'learn') return { view: 'learn', tool: DEFAULT_ROUTE.tool, ...(isLearningNodeId(tool) ? { learningNode: tool } : {}) }
  if (view === 'resources') return { view: 'resources', tool: DEFAULT_ROUTE.tool, ...(tool ? { resourceEntry: tool } : {}), ...(item ? { resourceId: item } : {}) }
  if (view === 'method') {
    if (!methodSections.has(tool as MethodSection)) return { view: 'method', tool: DEFAULT_ROUTE.tool }
    return { view: 'method', tool: DEFAULT_ROUTE.tool, methodSection: tool as MethodSection, ...(item ? { methodItem: item } : {}) }
  }
  if (view !== 'tools') return { view: view as PrimaryView, tool: DEFAULT_ROUTE.tool }
  return { view: 'tools', tool: toolIds.has(tool as DesignToolId) ? tool as DesignToolId : DEFAULT_ROUTE.tool }
}

export function serializeRoute(route: AppRoute): string {
  if (route.view === 'learn') return route.learningNode ? `#learn/${encodeURIComponent(route.learningNode)}` : '#learn'
  if (route.view === 'tools') return `#tools/${route.tool}`
  if (route.view === 'resources' && route.resourceEntry) return `#resources/${encodeURIComponent(route.resourceEntry)}${route.resourceId ? `/${encodeURIComponent(route.resourceId)}` : ''}`
  if (route.view === 'method' && route.methodSection) {
    const sectionPath = `#method/${route.methodSection}`
    return route.methodItem ? `${sectionPath}/${encodeURIComponent(route.methodItem)}` : sectionPath
  }
  return `#${route.view}`
}

export function routeTitle(route: AppRoute): string {
  if (route.view === 'learn') return withBrand(route.learningNode ? `学习节点 ${route.learningNode.slice(-2)}` : '游戏设计学习地图')
  if (route.view === 'tools') return withBrand(toolTitles[route.tool])
  if (route.view === 'resources') {
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
  const titles: Record<Exclude<PrimaryView, 'tools'>, string> = {
    learn: '游戏设计学习地图',
    path: '设计路径',
    resources: '资源库',
    method: '方法与概念',
    privacy: '数据与隐私',
  }
  return withBrand(titles[route.view])
}
