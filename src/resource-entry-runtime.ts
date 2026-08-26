import resourceEntryManifestRecord from '../content/resource-entry-manifest.json'
import type { ResourceDiscoveryCatalog, ResourceEntryCatalog } from './data'

const entryManifest = resourceEntryManifestRecord as { schemaVersion: number; defaultEntryId: string; entryIds: string[] }
const entryModules = import.meta.glob('../content/resource-entry-catalogs/*.json', { import: 'default' })
const entryPromises = new Map<string, Promise<ResourceEntryCatalog>>()
let discoveryPromise: Promise<ResourceDiscoveryCatalog> | undefined

export function loadResourceDiscoveryCatalog() {
  if (!discoveryPromise) {
    discoveryPromise = import('./resource-discovery-catalog')
      .then(module => module.resourceDiscoveryCatalog)
      .catch(error => {
        discoveryPromise = undefined
        throw error
      })
  }
  return discoveryPromise
}

export function loadResourceEntryCatalog(entryId: string) {
  const existing = entryPromises.get(entryId)
  if (existing) return existing
  if (!entryManifest.entryIds.includes(entryId)) return Promise.reject(new Error(`Unknown resource entry: ${entryId}`))
  const load = entryModules[`../content/resource-entry-catalogs/${entryId}.json`]
  if (!load) return Promise.reject(new Error(`Missing resource entry package: ${entryId}`))
  const request = load()
    .then(value => value as ResourceEntryCatalog)
    .catch(error => {
      entryPromises.delete(entryId)
      throw error
    })
  entryPromises.set(entryId, request)
  return request
}

export function loadInitialResourceDiscovery(requestedEntryId?: string) {
  const entryId = requestedEntryId && entryManifest.entryIds.includes(requestedEntryId) ? requestedEntryId : entryManifest.defaultEntryId
  return Promise.all([
    loadResourceDiscoveryCatalog(),
    loadResourceEntryCatalog(entryId),
  ]).then(([discovery, entryCatalog]) => ({ discovery, entryCatalog, defaultEntryId: entryManifest.defaultEntryId }))
}
