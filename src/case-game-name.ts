import type { ReadingLanguage } from './reading-navigation'
export function caseGameName(entry: { gameTitle: Record<ReadingLanguage, string> }, language: ReadingLanguage): string {
  return entry.gameTitle[language]
}
