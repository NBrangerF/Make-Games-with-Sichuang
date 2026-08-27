import { fingerprintJson } from './ids.ts'
import type { JsonValue, LocalWorkspaceV3, WorkspaceCollections } from './schema-v3.ts'
import { assertWorkspaceV3 } from './validation-v3.ts'

const packageCollectionKeys = [
  'artifacts', 'ideaDrafts', 'challengeInstances', 'projects', 'projectVersions', 'prototypes', 'prototypeRuns',
  'iterationCycles', 'testPlans', 'playtestSessions', 'evidenceItems', 'evidenceReviews', 'evidenceSyntheses',
  'changeBriefs', 'resourceAttachments',
] as const satisfies readonly (keyof WorkspaceCollections)[]

type PackageCollectionKey = typeof packageCollectionKeys[number]
type ProjectPackageCollections = Pick<WorkspaceCollections, PackageCollectionKey>

export type ProjectSharePackageV3 = Readonly<{
  format: 'tabletop-workshop-project-share-v3'
  exportedAt: string
  privacy: 'redacted-default'
  digest: string
  projectId: string
  collections: ProjectSharePackageV3Collections
}>

type ProjectSharePackageV3Collections = { [K in PackageCollectionKey]: WorkspaceCollections[K] }

function json(value: unknown): JsonValue {
  return JSON.parse(JSON.stringify(value)) as JsonValue
}

function packagePayload(value: Omit<ProjectSharePackageV3, 'digest'>) {
  return json(value)
}

export function exportProjectSharePackage(workspace: LocalWorkspaceV3, projectId: string, now = new Date().toISOString()) {
  const project = workspace.collections.projects.find(item => item.id === projectId)
  if (!project) throw new Error('project does not exist')
  const versions = workspace.collections.projectVersions.filter(item => item.projectId === projectId)
  const versionIds = new Set(versions.map(item => item.id))
  const prototypes = workspace.collections.prototypes.filter(item => item.projectId === projectId && item.linkState === 'linked')
  const prototypeIds = new Set(prototypes.map(item => item.id))
  const runs = workspace.collections.prototypeRuns.filter(item => item.projectId === projectId && prototypeIds.has(item.prototypeId))
  const cycles = workspace.collections.iterationCycles.filter(item => item.projectId === projectId)
  const cycleIds = new Set(cycles.map(item => item.id))
  const plans = workspace.collections.testPlans.filter(item => item.projectId === projectId && item.linkState === 'linked')
  const planIds = new Set(plans.map(item => item.id))
  const sessions = workspace.collections.playtestSessions.filter(item => item.projectId === projectId && item.status !== 'withdrawn' && item.linkState === 'linked' && (!item.testPlanId || planIds.has(item.testPlanId))).map(item => ({ ...item, context: { redacted: true } }))
  const sessionIds = new Set(sessions.map(item => item.id))
  const evidence = workspace.collections.evidenceItems.filter(item => item.projectId === projectId && sessionIds.has(item.sessionId))
  const evidenceIds = new Set(evidence.map(item => item.id))
  const reviews = workspace.collections.evidenceReviews.filter(item => item.projectId === projectId && item.linkState === 'linked' && item.sessionIds.every(id => sessionIds.has(id)) && item.evidenceItemIds.every(id => evidenceIds.has(id)))
  const reviewIds = new Set(reviews.map(item => item.id))
  const syntheses = workspace.collections.evidenceSyntheses.filter(item => item.projectId === projectId && item.linkState === 'linked' && item.reviewIds.every(id => reviewIds.has(id)))
  const briefs = workspace.collections.changeBriefs.filter(item => item.projectId === projectId && item.reviewIds.every(id => reviewIds.has(id)))
  const ideaIds = new Set(prototypes.flatMap(item => item.sourceRefs.filter(ref => ref.kind === 'idea_draft').map(ref => ref.id)))
  const ideas = workspace.collections.ideaDrafts.filter(item => ideaIds.has(item.id))
  const challenges = workspace.collections.challengeInstances.filter(item => ideaIds.has(item.ideaId) || Boolean(item.prototypeId && prototypeIds.has(item.prototypeId)))
  const contextIds = new Set([projectId, ...versionIds, ...cycleIds])
  const publicProfile = Object.fromEntries(Object.entries(project.profile).filter(([key]) => !['privateNotes', 'contact', 'email'].includes(key)))
  const base: Omit<ProjectSharePackageV3, 'digest'> = {
    format: 'tabletop-workshop-project-share-v3', exportedAt: now, privacy: 'redacted-default', projectId,
    collections: {
      artifacts: workspace.collections.artifacts.filter(item => item.projectId === projectId),
      ideaDrafts: ideas, challengeInstances: challenges, projects: [{ ...project, profile: publicProfile }],
      projectVersions: versions, prototypes, prototypeRuns: runs, iterationCycles: cycles, testPlans: plans,
      playtestSessions: sessions, evidenceItems: evidence, evidenceReviews: reviews, evidenceSyntheses: syntheses,
      changeBriefs: briefs, resourceAttachments: workspace.collections.resourceAttachments.filter(item => contextIds.has(item.contextRef.id)),
    },
  }
  return JSON.stringify({ ...base, digest: fingerprintJson(packagePayload(base)) }, null, 2)
}

export function inspectProjectSharePackage(raw: string) {
  const parsed: unknown = JSON.parse(raw)
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('project package is not an object')
  const candidate = parsed as Partial<ProjectSharePackageV3>
  if (candidate.format !== 'tabletop-workshop-project-share-v3' || candidate.privacy !== 'redacted-default' || typeof candidate.exportedAt !== 'string' || typeof candidate.projectId !== 'string' || typeof candidate.digest !== 'string' || !candidate.collections) throw new Error('project package envelope is invalid')
  for (const key of packageCollectionKeys) if (!Array.isArray(candidate.collections[key])) throw new Error(`project package collection ${key} is invalid`)
  const { digest, ...base } = candidate as ProjectSharePackageV3
  if (fingerprintJson(packagePayload(base)) !== digest) throw new Error('project package digest is invalid')
  if (!base.collections.projects.some(item => item.id === base.projectId)) throw new Error('project package root project is missing')
  return candidate as ProjectSharePackageV3
}

export function mergeProjectSharePackage(workspace: LocalWorkspaceV3, raw: string) {
  const share = inspectProjectSharePackage(raw)
  const merged = structuredClone(workspace)
  const conflicts: string[] = []
  for (const key of packageCollectionKeys) {
    const target = merged.collections[key] as Array<{ id: string }>
    const incoming = share.collections[key] as Array<{ id: string }>
    for (const record of incoming) {
      const existing = target.find(item => item.id === record.id)
      if (!existing) target.push(record)
      else if (JSON.stringify(existing) !== JSON.stringify(record)) conflicts.push(`${key}:${record.id}`)
    }
  }
  if (conflicts.length) throw new Error(`project package has ${conflicts.length} conflicting IDs: ${conflicts.slice(0, 3).join(', ')}`)
  assertWorkspaceV3(merged)
  return merged
}
