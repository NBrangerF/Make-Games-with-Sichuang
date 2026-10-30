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

export type RaceEnding = 'exact' | 'reach'

/** The same move under the relaxed ending (draft E in chapter 5): reaching or passing 24 wins. */
export function resolveRaceMoveWith(position: number, die: number, ending: RaceEnding = 'exact') {
  const base = resolveRaceMove(position, die)
  if (ending === 'exact' || position === raceBoard.finish || position + die < raceBoard.finish) return base
  return { position, die, landed: raceBoard.finish, destination: raceBoard.finish, overshoot: false, won: true }
}

/**
 * Choice version C's stated policy when a program has to choose: take a die that finishes;
 * otherwise the one that ends farther along; on a tie, the smaller die.
 */
export function chooseDie(position: number, a: number, b: number) {
  const ra = resolveRaceMove(position, a)
  const rb = resolveRaceMove(position, b)
  if (ra.won !== rb.won) return ra.won ? a : b
  if (ra.destination !== rb.destination) return ra.destination > rb.destination ? a : b
  return Math.min(a, b)
}

export type RaceRule = 'B' | 'C' | 'E'

function outcomes(position: number, rule: RaceRule): Array<{ destination: number; weight: number }> {
  if (rule === 'C') {
    const list: Array<{ destination: number; weight: number }> = []
    for (let a = 1; a <= 6; a++) for (let b = 1; b <= 6; b++) list.push({ destination: resolveRaceMove(position, chooseDie(position, a, b)).destination, weight: 1 / 36 })
    return list
  }
  return Array.from({ length: 6 }, (_, i) => ({ destination: resolveRaceMoveWith(position, i + 1, rule === 'E' ? 'reach' : 'exact').destination, weight: 1 / 6 }))
}

/**
 * Exactly how many of your own turns it takes to finish from `start`, ignoring the other player.
 * Fair, independent dice; C follows chooseDie. Computed from the board's transition table, not simulated.
 */
export function turnsToFinish(start: number, rule: RaceRule, maxTurns = 40) {
  if (!Number.isInteger(start) || start < 0 || start >= raceBoard.finish) throw new RangeError('Expected a start position 0–23')
  let dist = Array<number>(raceBoard.finish + 1).fill(0)
  dist[start] = 1
  const byTurn: number[] = []
  for (let k = 0; k < maxTurns; k++) {
    const next = Array<number>(raceBoard.finish + 1).fill(0)
    dist.forEach((p, from) => {
      if (!p || from === raceBoard.finish) return
      for (const o of outcomes(from, rule)) next[o.destination] += p * o.weight
    })
    byTurn.push(next[raceBoard.finish])
    next[raceBoard.finish] = 0
    dist = next
  }
  // expected turns: E[p] = 1 + Σ P(p→q) E[q], E[24] = 0, solved by iteration
  let expected = Array<number>(raceBoard.finish + 1).fill(0)
  for (let i = 0; i < 4000; i++) {
    const updated = expected.map((_, p) => (p === raceBoard.finish ? 0 : 1 + outcomes(p, rule).reduce((sum, o) => sum + o.weight * expected[o.destination], 0)))
    expected = updated
  }
  const first = outcomes(start, rule)
  return {
    byTurn,
    later: Math.max(0, 1 - byTurn.reduce((a, b) => a + b, 0)),
    mean: expected[start],
    firstTurn: { hits: first.filter(o => o.destination === raceBoard.finish).length, of: first.length },
  }
}
