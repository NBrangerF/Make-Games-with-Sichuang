import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'

import { WORKSPACE_V3_LEGACY_BACKUP_KEY_PREFIX, WORKSPACE_V3_MANIFEST_STORAGE_KEY } from './storage-keys'
import { newEntityId } from './domain/ids'
import { scanLegacyStorage, type LegacyScanReport } from './domain/legacy-scan'
import { migrateLegacyReport } from './domain/migration-v3'
import { createEmptyWorkspace, type LocalWorkspaceV3 } from './domain/schema-v3'
import { exportProjectSharePackage, inspectProjectSharePackage, mergeProjectSharePackage } from './domain/project-package-v3'
import { WorkspaceConflictError, WorkspacePersistenceError, WorkspaceRepository } from './domain/workspace-repository'

type RuntimeState = Readonly<{
  workspace: LocalWorkspaceV3
  legacyReport: LegacyScanReport
  persisted: boolean
  busy: boolean
  notice: string | null
  error: string | null
}>
type WorkspaceRuntimeValue = RuntimeState & Readonly<{
  commit: (update: (draft: LocalWorkspaceV3) => void, notice: string) => LocalWorkspaceV3 | null
  migrateLegacy: () => void
  dismissNotice: () => void
  reload: () => void
  exportBackup: () => string | null
  exportProjectShare: (projectId: string) => string | null
  inspectBackup: (raw: string) => WorkspaceBackupPreview | null
  restoreBackup: (raw: string) => boolean
}>

export type WorkspaceBackupPreview = Readonly<{
  kind: 'full_backup' | 'project_share'
  workspaceId: string
  exportedAt: string
  revision: number
  projectCount: number
  courseAttemptCount: number
  sessionCount: number
  sameWorkspace: boolean
}>

const WorkspaceRuntimeContext = createContext<WorkspaceRuntimeValue | null>(null)

function runtimeError(error: unknown) {
  if (error instanceof WorkspaceConflictError) return '另一个标签页已更新工作区。已停止本次写入，请重新载入后再试。'
  if (error instanceof WorkspacePersistenceError) return `工作区未能保存：${error.message}`
  return `工作区操作失败：${error instanceof Error ? error.message : String(error)}`
}

function initialState(repository: WorkspaceRepository): RuntimeState {
  const legacyReport = scanLegacyStorage(localStorage)
  try {
    const loaded = repository.load()
    return { workspace: loaded ?? createEmptyWorkspace(newEntityId('workspace'), new Date().toISOString()), legacyReport, persisted: Boolean(loaded), busy: false, notice: null, error: null }
  } catch (error) {
    return { workspace: createEmptyWorkspace(newEntityId('workspace'), new Date().toISOString()), legacyReport, persisted: false, busy: false, notice: null, error: runtimeError(error) }
  }
}

export function WorkspaceRuntimeProvider({ children }: { children: ReactNode }) {
  const repositoryRef = useRef<WorkspaceRepository | null>(null)
  if (!repositoryRef.current) repositoryRef.current = new WorkspaceRepository(localStorage)
  const repository = repositoryRef.current
  const [state, setState] = useState<RuntimeState>(() => initialState(repository))

  const reload = useCallback(() => {
    try {
      const loaded = repository.load()
      setState(current => ({ ...current, ...(loaded ? { workspace: loaded, persisted: true } : {}), legacyReport: scanLegacyStorage(localStorage), error: null }))
    } catch (error) { setState(current => ({ ...current, error: runtimeError(error) })) }
  }, [repository])

  useEffect(() => {
    const onStorage = (event: StorageEvent) => { if (event.key === WORKSPACE_V3_MANIFEST_STORAGE_KEY) reload() }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [reload])

  const commit = useCallback((update: (draft: LocalWorkspaceV3) => void, notice: string) => {
    const draft = structuredClone(state.workspace)
    update(draft)
    try {
      const workspace = state.persisted ? repository.commit(state.workspace.revision, draft) : repository.initialize({ ...draft, revision: 0 })
      setState(current => ({ ...current, workspace, persisted: true, notice, error: null }))
      return workspace
    } catch (error) {
      setState(current => ({ ...current, error: runtimeError(error) }))
      return null
    }
  }, [repository, state.persisted, state.workspace])

  const migrateLegacy = useCallback(() => {
    if (state.persisted) {
      setState(current => ({ ...current, error: '当前已有 v3 工作区。为避免覆盖，请先导出备份；合并将在导入预览中处理。' }))
      return
    }
    setState(current => ({ ...current, busy: true, error: null }))
    try {
      const report = scanLegacyStorage(localStorage)
      const rawEntries = Object.fromEntries(report.entries.filter(entry => entry.present).map(entry => [entry.descriptor.key, entry.raw]))
      const backupKey = `${WORKSPACE_V3_LEGACY_BACKUP_KEY_PREFIX}${Date.now()}`
      localStorage.setItem(backupKey, JSON.stringify({ format: 'tabletop-workshop-legacy-raw-backup-v1', createdAt: new Date().toISOString(), sourceDigest: report.sourceDigest, entries: rawEntries }))
      const migrated = migrateLegacyReport(report, { workspaceId: state.workspace.workspaceId })
      const workspace = repository.initialize(migrated)
      setState(current => ({ ...current, workspace, legacyReport: report, persisted: true, busy: false, notice: `已迁移 ${report.presentKeyCount} 类旧记录。源数据与原始备份仍保留。`, error: null }))
    } catch (error) { setState(current => ({ ...current, busy: false, error: runtimeError(error) })) }
  }, [repository, state.persisted, state.workspace])

  const exportBackup = useCallback(() => {
    try { return repository.exportBackup() } catch (error) {
      setState(current => ({ ...current, error: runtimeError(error) }))
      return null
    }
  }, [repository])

  const inspectBackup = useCallback((raw: string) => {
    try {
      try {
        const backup = repository.inspectBackup(raw)
        setState(current => ({ ...current, error: null }))
        return {
          kind: 'full_backup' as const,
          workspaceId: backup.workspace.workspaceId,
          exportedAt: backup.exportedAt,
          revision: backup.workspace.revision,
          projectCount: backup.workspace.collections.projects.length,
          courseAttemptCount: backup.workspace.collections.activityAttempts.length,
          sessionCount: backup.workspace.collections.playtestSessions.length,
          sameWorkspace: !state.persisted || backup.workspace.workspaceId === state.workspace.workspaceId,
        }
      } catch {
        const share = inspectProjectSharePackage(raw)
        mergeProjectSharePackage(state.workspace, raw)
        setState(current => ({ ...current, error: null }))
        return {
          kind: 'project_share' as const,
          workspaceId: state.workspace.workspaceId,
          exportedAt: share.exportedAt,
          revision: state.workspace.revision,
          projectCount: share.collections.projects.length,
          courseAttemptCount: 0,
          sessionCount: share.collections.playtestSessions.length,
          sameWorkspace: true,
        }
      }
    } catch (error) {
      setState(current => ({ ...current, error: runtimeError(error) }))
      return null
    }
  }, [repository, state.persisted, state.workspace.workspaceId])

  const exportProjectShare = useCallback((projectId: string) => {
    try { return exportProjectSharePackage(state.workspace, projectId) } catch (error) {
      setState(current => ({ ...current, error: runtimeError(error) }))
      return null
    }
  }, [state.workspace])

  const restoreBackup = useCallback((raw: string) => {
    try {
      let workspace: LocalWorkspaceV3
      let notice: string
      try {
        repository.inspectBackup(raw)
        workspace = repository.restoreBackupStrict(raw)
        notice = '工作区备份已恢复。'
      } catch (backupError) {
        try {
          const merged = mergeProjectSharePackage(state.workspace, raw)
          workspace = state.persisted ? repository.commit(state.workspace.revision, merged) : repository.initialize({ ...merged, revision: 0 })
          notice = '脱敏项目包已安全合并；重复 ID 保持幂等。'
        } catch { throw backupError }
      }
      setState(current => ({ ...current, workspace, persisted: true, notice, error: null }))
      return true
    } catch (error) {
      setState(current => ({ ...current, error: runtimeError(error) }))
      return false
    }
  }, [repository, state.persisted, state.workspace])

  const value = useMemo<WorkspaceRuntimeValue>(() => ({
    ...state, commit, migrateLegacy, reload, exportBackup, exportProjectShare, inspectBackup, restoreBackup,
    dismissNotice: () => setState(current => ({ ...current, notice: null, error: null })),
  }), [commit, exportBackup, exportProjectShare, inspectBackup, migrateLegacy, reload, restoreBackup, state])
  return <WorkspaceRuntimeContext.Provider value={value}>{children}</WorkspaceRuntimeContext.Provider>
}

export function useWorkspaceRuntime() {
  const context = useContext(WorkspaceRuntimeContext)
  if (!context) throw new Error('useWorkspaceRuntime must be used inside WorkspaceRuntimeProvider')
  return context
}
