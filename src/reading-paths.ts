import racePath from '../content/reading-path.json'
import riverPath from '../content/reading-path-river.json'
import type { ReadingTrack } from './reading-navigation'

export { racePath, riverPath }
export const allReadingChapters = [...racePath.chapters, ...riverPath.chapters]
export function readingTrackFor(chapterId?: string, requested?: ReadingTrack): ReadingTrack {
  if (riverPath.chapters.some(chapter => chapter.id === chapterId)) return 'river'
  if (racePath.chapters.some(chapter => chapter.id === chapterId)) return 'race'
  return requested === 'river' ? 'river' : 'race'
}
export function pathFor(track: ReadingTrack) {
  return track === 'river' ? riverPath : racePath
}
// The two paths teach corresponding concepts; original river IDs remain valid.
export function chapterForTrack(id: string, track: ReadingTrack = 'race') {
  const chapter = allReadingChapters.find(item => item.id === id)
  return chapter ? pathFor(track).chapters.find(item => item.number === chapter.number)?.id || id : id
}
export function trackFromReturn(from?: string): ReadingTrack {
  const id = from?.match(/^#course\/reading\/([^/]+)\//)?.[1]
  return readingTrackFor(id, from?.includes('track=river') ? 'river' : undefined)
}
