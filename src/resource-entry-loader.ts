import type { ResourceEntryCatalog } from './data'

let runtimePromise: Promise<typeof import('./resource-entry-runtime')> | undefined

function loadRuntime() {
  if (!runtimePromise) {
    runtimePromise = import('./resource-entry-runtime').catch(error => {
      runtimePromise = undefined
      throw error
    })
  }
  return runtimePromise
}

export async function loadInitialResourceDiscovery(entryId?: string) {
  const runtime = await loadRuntime()
  return runtime.loadInitialResourceDiscovery(entryId)
}

export async function loadResourceEntryCatalog(entryId: string): Promise<ResourceEntryCatalog> {
  const runtime = await loadRuntime()
  return runtime.loadResourceEntryCatalog(entryId)
}

export function preloadResourceDiscovery() {
  if (typeof window !== 'undefined') void loadInitialResourceDiscovery()
}

export function preloadResourceEntryCatalog(entryId: string) {
  if (typeof window !== 'undefined') void loadResourceEntryCatalog(entryId)
}
