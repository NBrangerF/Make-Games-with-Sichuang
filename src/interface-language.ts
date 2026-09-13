import { readingReturnLanguage, type ReadingLanguage } from './reading-navigation.ts'
import type { AppRoute } from './url-state.ts'

const preferenceKey = 'tabletop-workshop-interface-language'

export function readLanguagePreference(): ReadingLanguage {
  try { return localStorage.getItem(preferenceKey) === 'en' ? 'en' : 'zh-CN' } catch { return 'zh-CN' }
}

export function saveLanguagePreference(language: ReadingLanguage) {
  try { localStorage.setItem(preferenceKey, language) } catch { /* The current session still changes language. */ }
}

/** Change the language without dropping the current entry, filters, or work context. */
export function switchRouteLanguage(route: AppRoute, language: ReadingLanguage): AppRoute {
  const readingHome = (route.view === 'learn' && !route.learningNode) || (route.resourceEntry === 'learn' && route.resourceId === 'systematic')
  const readingCourse = route.view === 'course' && !route.courseMode && !route.workContext?.courseId && !route.workContext?.unitId
  const readingResources = route.view === 'resources' && (!route.resourceEntry || ['read', 'cases', 'library'].includes(route.resourceEntry))
  if (readingHome || readingCourse || readingResources || route.view === 'privacy') {
    return {
      ...route,
      ...(readingHome ? { view: 'course', resourceEntry: undefined, resourceId: undefined } : {}),
      ...(readingResources && !route.resourceEntry ? { resourceEntry: 'read', resourceId: 'all' } : {}),
      readingLanguage: language,
      uiLanguage: undefined,
      readingReturnTo: readingReturnLanguage(route.readingReturnTo, language),
    }
  }
  return { ...route, readingLanguage: undefined, uiLanguage: language }
}
