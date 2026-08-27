import { WORKSPACE_V3_MANIFEST_STORAGE_KEY, WORKSPACE_V3_REVISION_KEY_PREFIX } from '../storage-keys.ts'
import { fingerprintJson } from './ids.ts'
import type { JsonValue, LocalWorkspaceV3 } from './schema-v3.ts'
import type { KeyValueStorage } from './storage-adapter.ts'
import { assertWorkspaceV3, isJsonValue } from './validation-v3.ts'

export type WorkspaceManifestV3 = Readonly<{
  schemaVersion: 3
  workspaceId: string
  activeRevision: number
  activeKey: string
  activeDigest: string
  lastGoodKey: string | null
  updatedAt: string
}>

export type WorkspaceBackupV3 = Readonly<{
  format: 'tabletop-workshop-workspace-backup-v3'
  exportedAt: string
  digest: string
  workspace: LocalWorkspaceV3
}>

export class WorkspaceConflictError extends Error {
  readonly expectedRevision: number
  readonly actualRevision: number

  constructor(expectedRevision: number, actualRevision: number) {
    super(`workspace revision conflict: expected ${expectedRevision}, found ${actualRevision}`)
    this.name = 'WorkspaceConflictError'
    this.expectedRevision = expectedRevision
    this.actualRevision = actualRevision
  }
}

export class WorkspacePersistenceError extends Error {
  readonly causeValue?: unknown

  constructor(message: string, causeValue?: unknown) {
    super(message)
    this.name = 'WorkspacePersistenceError'
    this.causeValue = causeValue
  }
}

function workspaceJson(workspace: LocalWorkspaceV3): JsonValue {
  return JSON.parse(JSON.stringify(workspace)) as JsonValue
}

function revisionKey(workspaceId: string, revision: number) {
  return `${WORKSPACE_V3_REVISION_KEY_PREFIX}${workspaceId}:${revision}`
}

function parseManifest(raw: string | null): WorkspaceManifestV3 | null {
  if (!raw) return null
  const parsed: unknown = JSON.parse(raw)
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new WorkspacePersistenceError('workspace manifest is not an object')
  const manifest = parsed as Partial<WorkspaceManifestV3>
  if (manifest.schemaVersion !== 3 || typeof manifest.workspaceId !== 'string' || !Number.isInteger(manifest.activeRevision) || typeof manifest.activeKey !== 'string' || typeof manifest.activeDigest !== 'string' || typeof manifest.updatedAt !== 'string' || !(manifest.lastGoodKey === null || typeof manifest.lastGoodKey === 'string')) {
    throw new WorkspacePersistenceError('workspace manifest is invalid')
  }
  return manifest as WorkspaceManifestV3
}

function parseWorkspace(raw: string | null, expectedDigest?: string) {
  if (!raw) throw new WorkspacePersistenceError('workspace revision is missing')
  const parsed: unknown = JSON.parse(raw)
  assertWorkspaceV3(parsed)
  const digest = fingerprintJson(workspaceJson(parsed))
  if (expectedDigest && digest !== expectedDigest) throw new WorkspacePersistenceError('workspace revision digest does not match manifest')
  return { workspace: parsed, digest }
}

export function estimateStorageBytes(entries: Readonly<Record<string, string>>) {
  const encoder = new TextEncoder()
  return Object.entries(entries).reduce((total, [key, value]) => total + encoder.encode(key).byteLength + encoder.encode(value).byteLength, 0)
}

export function storageBackendDecision(input: { fixtureBytes: number; availableQuotaBytes: number; p95WriteMs: number }) {
  const quotaRatio = input.availableQuotaBytes > 0 ? input.fixtureBytes / input.availableQuotaBytes : 1
  return {
    quotaRatio,
    useIndexedDb: quotaRatio >= 0.6 || input.p95WriteMs >= 250,
    reasons: [
      ...(quotaRatio >= 0.6 ? ['fixture_uses_at_least_60_percent_of_quota'] : []),
      ...(input.p95WriteMs >= 250 ? ['p95_write_at_least_250ms'] : []),
    ],
  }
}

export class WorkspaceRepository {
  private readonly storage: KeyValueStorage
  private readonly now: () => string

  constructor(storage: KeyValueStorage, now: () => string = () => new Date().toISOString()) {
    this.storage = storage
    this.now = now
  }

  getManifest() {
    try {
      return parseManifest(this.storage.getItem(WORKSPACE_V3_MANIFEST_STORAGE_KEY))
    } catch (error) {
      if (error instanceof WorkspacePersistenceError) throw error
      throw new WorkspacePersistenceError('failed to parse workspace manifest', error)
    }
  }

  load() {
    const manifest = this.getManifest()
    if (!manifest) return null
    try {
      const loaded = parseWorkspace(this.storage.getItem(manifest.activeKey), manifest.activeDigest)
      if (loaded.workspace.workspaceId !== manifest.workspaceId || loaded.workspace.revision !== manifest.activeRevision) throw new WorkspacePersistenceError('workspace revision does not match manifest identity')
      return loaded.workspace
    } catch (error) {
      if (error instanceof WorkspacePersistenceError) throw error
      throw new WorkspacePersistenceError('failed to load active workspace revision', error)
    }
  }

  initialize(workspace: LocalWorkspaceV3) {
    if (this.getManifest()) throw new WorkspacePersistenceError('workspace is already initialized')
    if (workspace.revision !== 0) throw new WorkspacePersistenceError('initial workspace must use revision 0')
    assertWorkspaceV3(workspace)
    return this.writeRevision(workspace, null)
  }

  commit(baseRevision: number, candidate: LocalWorkspaceV3) {
    const manifest = this.getManifest()
    if (!manifest) throw new WorkspacePersistenceError('workspace is not initialized')
    if (manifest.activeRevision !== baseRevision) throw new WorkspaceConflictError(baseRevision, manifest.activeRevision)
    if (candidate.workspaceId !== manifest.workspaceId) throw new WorkspacePersistenceError('candidate workspaceId does not match active workspace')
    const committed: LocalWorkspaceV3 = {
      ...candidate,
      revision: baseRevision + 1,
      updatedAt: this.now(),
    }
    assertWorkspaceV3(committed)
    return this.writeRevision(committed, manifest)
  }

  private writeRevision(workspace: LocalWorkspaceV3, previous: WorkspaceManifestV3 | null) {
    const key = revisionKey(workspace.workspaceId, workspace.revision)
    const raw = JSON.stringify(workspace)
    const digest = fingerprintJson(workspaceJson(workspace))
    try {
      this.storage.setItem(key, raw)
      const staged = parseWorkspace(this.storage.getItem(key), digest).workspace
      if (staged.workspaceId !== workspace.workspaceId || staged.revision !== workspace.revision) throw new WorkspacePersistenceError('staged workspace identity mismatch')
      const manifest: WorkspaceManifestV3 = {
        schemaVersion: 3,
        workspaceId: workspace.workspaceId,
        activeRevision: workspace.revision,
        activeKey: key,
        activeDigest: digest,
        lastGoodKey: previous?.activeKey ?? null,
        updatedAt: this.now(),
      }
      this.storage.setItem(WORKSPACE_V3_MANIFEST_STORAGE_KEY, JSON.stringify(manifest))
      this.pruneRevisions(manifest)
      return staged
    } catch (error) {
      if (this.storage.getItem(WORKSPACE_V3_MANIFEST_STORAGE_KEY) !== null && previous === null) this.storage.removeItem(WORKSPACE_V3_MANIFEST_STORAGE_KEY)
      if (error instanceof WorkspacePersistenceError || error instanceof WorkspaceConflictError) throw error
      throw new WorkspacePersistenceError('failed to persist workspace revision', error)
    }
  }

  private pruneRevisions(manifest: WorkspaceManifestV3) {
    const keep = new Set([manifest.activeKey, manifest.lastGoodKey].filter((value): value is string => Boolean(value)))
    const prefix = `${WORKSPACE_V3_REVISION_KEY_PREFIX}${manifest.workspaceId}:`
    const removals: string[] = []
    for (let index = 0; index < this.storage.length; index += 1) {
      const key = this.storage.key(index)
      if (key?.startsWith(prefix) && !keep.has(key)) removals.push(key)
    }
    for (const key of removals) this.storage.removeItem(key)
  }

  inspectLastGood() {
    const manifest = this.getManifest()
    if (!manifest?.lastGoodKey) return null
    return parseWorkspace(this.storage.getItem(manifest.lastGoodKey)).workspace
  }

  recoverLastGood() {
    const manifest = this.getManifest()
    const lastGood = this.inspectLastGood()
    if (!manifest || !lastGood) throw new WorkspacePersistenceError('no last-good workspace revision is available')
    return this.commit(manifest.activeRevision, { ...lastGood, revision: manifest.activeRevision })
  }

  exportBackup() {
    const workspace = this.load()
    if (!workspace) throw new WorkspacePersistenceError('workspace is not initialized')
    const backup: WorkspaceBackupV3 = {
      format: 'tabletop-workshop-workspace-backup-v3',
      exportedAt: this.now(),
      digest: fingerprintJson(workspaceJson(workspace)),
      workspace,
    }
    return JSON.stringify(backup, null, 2)
  }

  inspectBackup(raw: string) {
    const parsed: unknown = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new WorkspacePersistenceError('backup is not an object')
    const candidate = parsed as Partial<WorkspaceBackupV3>
    if (candidate.format !== 'tabletop-workshop-workspace-backup-v3' || typeof candidate.exportedAt !== 'string' || typeof candidate.digest !== 'string' || !candidate.workspace) throw new WorkspacePersistenceError('backup envelope is invalid')
    assertWorkspaceV3(candidate.workspace)
    const digest = fingerprintJson(workspaceJson(candidate.workspace))
    if (digest !== candidate.digest) throw new WorkspacePersistenceError('backup digest is invalid')
    return candidate as WorkspaceBackupV3
  }

  restoreBackupStrict(raw: string) {
    const backup = this.inspectBackup(raw)
    const current = this.load()
    if (!current) return this.initialize({ ...backup.workspace, revision: 0, updatedAt: this.now() })
    if (backup.workspace.workspaceId !== current.workspaceId) throw new WorkspacePersistenceError('strict restore cannot replace a different workspaceId')
    return this.commit(current.revision, { ...backup.workspace, revision: current.revision })
  }
}

export function validateRawBackupJson(raw: string) {
  const parsed: unknown = JSON.parse(raw)
  return isJsonValue(parsed)
}
