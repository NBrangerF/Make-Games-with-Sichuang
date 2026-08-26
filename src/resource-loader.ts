import type { ResourceCatalog } from './data'

let catalogPromise: Promise<ResourceCatalog> | undefined

export function loadResourceCatalog() {
  if (!catalogPromise) {
    catalogPromise = import('./resource-catalog')
      .then(module => module.resourceCatalog)
      .catch(error => {
        catalogPromise = undefined
        throw error
      })
  }
  return catalogPromise
}

export function preloadResourceCatalog() {
  if (typeof window !== 'undefined') void loadResourceCatalog()
}
