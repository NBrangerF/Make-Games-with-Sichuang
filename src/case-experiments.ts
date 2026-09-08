// Small constructed comparisons; these do not simulate a complete game or a playtest.
export const sixNimmtStart = [[12, 20], [30, 35, 40, 44], [60], [80]]
export const bullheads = (card: number) => card === 55 ? 7 : card % 11 === 0 ? 5 : card % 10 === 0 ? 3 : card % 5 === 0 ? 2 : 1
export function sixNimmtComparison(otherCard: 10 | 46, steps: number) {
  const rows = sixNimmtStart.map(row => [...row])
  const events: { card: number; row: number; taken: number[]; points: number }[] = []
  for (const card of [otherCard, 48].slice(0, Math.max(0, Math.min(2, steps)))) {
    const eligible = rows.map((row, index) => ({ tail: row.at(-1)!, index })).filter(row => row.tail < card).sort((a, b) => b.tail - a.tail)
    // In the low-card branch, the other player explicitly chooses row B.
    const row = eligible[0]?.index ?? 1
    const takes = !eligible.length || rows[row].length === 5
    const taken = takes ? [...rows[row]] : []
    rows[row] = takes ? [card] : [...rows[row], card]
    events.push({ card, row, taken, points: taken.reduce((sum, value) => sum + bullheads(value), 0) })
  }
  return { rows, events }
}
export function singleTargetDrawChance(deckSize: number, handSize = 5) {
  if (!Number.isInteger(deckSize) || !Number.isInteger(handSize) || deckSize < 1 || handSize < 0 || handSize > deckSize) throw new RangeError('Invalid draw comparison')
  return handSize / deckSize
}
