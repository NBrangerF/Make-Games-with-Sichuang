export type RevealTempo = 'quick' | 'rhythm';
/** Shared by the visual deadline, editor preview and sound preparation. */
export function revealDurationMs(tempo: RevealTempo = 'quick', reduced = false): number {
  return reduced ? 80 : tempo === 'rhythm' ? 1200 : 900;
}
