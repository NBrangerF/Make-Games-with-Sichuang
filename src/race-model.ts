/** The course's authored 24-space teaching board, not a publisher's game rules. */
export const raceBoard = {
  finish: 24,
  ladders: { 3: 11, 8: 17 } as Record<number, number>,
  snakes: { 14: 4, 22: 12 } as Record<number, number>,
} as const
export function resolveRaceMove(position: number, die: number) {
  if (!Number.isInteger(position) || position < 0 || position > 24 || !Number.isInteger(die) || die < 1 || die > 6) throw new RangeError('Expected a board position 0–24 and a die result 1–6')
  const overshoot = position + die > raceBoard.finish
  const landed = position === raceBoard.finish || overshoot ? position : position + die
  const destination = position === raceBoard.finish || overshoot ? position : raceBoard.ladders[landed] ?? raceBoard.snakes[landed] ?? landed
  return { position, die, landed, destination, overshoot, won: destination === raceBoard.finish }
}
