import type { ConceptActionIndex, Framework, GlossaryTerm, Guide } from './data'

let frameworksPromise: Promise<Framework[]> | undefined
let glossaryPromise: Promise<{ glossary: GlossaryTerm[]; conceptActionIndex: ConceptActionIndex }> | undefined
let specialGuidesPromise: Promise<Guide[]> | undefined

export function loadFrameworks() {
  if (!frameworksPromise) {
    frameworksPromise = import('./framework-catalog')
      .then(module => module.frameworks)
      .catch(error => {
        frameworksPromise = undefined
        throw error
      })
  }
  return frameworksPromise
}

export function loadGlossary() {
  if (!glossaryPromise) {
    glossaryPromise = import('./glossary-catalog')
      .then(module => ({ glossary: module.glossary, conceptActionIndex: module.conceptActionIndex }))
      .catch(error => {
        glossaryPromise = undefined
        throw error
      })
  }
  return glossaryPromise
}

export function loadSpecialGuides() {
  if (!specialGuidesPromise) {
    specialGuidesPromise = import('./special-guide-catalog')
      .then(module => module.specialGuides)
      .catch(error => {
        specialGuidesPromise = undefined
        throw error
      })
  }
  return specialGuidesPromise
}

export function preloadFrameworks() {
  if (typeof window !== 'undefined') void loadFrameworks()
}

export function preloadGlossary() {
  if (typeof window !== 'undefined') void loadGlossary()
}

export function preloadSpecialGuides() {
  if (typeof window !== 'undefined') void loadSpecialGuides()
}
