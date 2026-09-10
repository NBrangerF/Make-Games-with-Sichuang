# Zones of control: how can a piece block a space it does not occupy?

An opposing piece occupying a space and making nearby empty spaces consequential are different constraints. A zone of control (ZOC) concerns the second relationship: spaces around a unit affect opposing movement or attacks. That does not automatically confer ownership or award points.

## Specify the range, then the consequence

“Next to an enemy” is not yet a complete rule. Does adjacency include diagonals? Must an entering unit stop, or pay extra movement points? Can a unit that starts inside the zone leave? Do multiple units' effects stack? Each needs a decision.

*Building Blocks* discusses forced stops, additional movement costs, departure rules, and which units project a zone in the same entry. The comparison below selects stopping and additional cost, using this site's own map and rules. There are no attacks or combat.

## One guard and a corridor

This is an original local movement phase within a two-player game. Red's guard is already at C2 and does not act this phase. Blue's courier starts at A2 and must reach E2 during this phase. All positions and rules are public, with no dice or hidden information.

The map has five columns and three rows of square spaces. Columns run A through E from left to right; rows run 1 through 3 from top to bottom. Every space exists and is usable except occupied C2.

| Row | Column A | Column B | Column C | Column D | Column E |
|---|---|---|---|---|---|
| 1 | Empty | Empty | Zone | Empty | Empty |
| 2 | Courier start | Zone | Guard | Zone | Destination |
| 3 | Empty | Empty | Zone | Empty | Empty |

The guard's zone consists only of its four orthogonal neighbors: B2, C1, D2, and C3. Diagonals do not count, and no ownership changes. The courier has 7 movement points. Each step enters an orthogonally adjacent space for 1 point. No diagonal moves, jumps, leaving the map, or entry to C2. The full price must be affordable before each move; an unaffordable step changes neither position nor budget.

**Original rule: entering a zone space immediately ends this movement phase.** Pay the entry cost and forfeit any remaining points. Otherwise, the courier may continue or stop voluntarily; running out of points also ends the phase. Reaching E2 immediately succeeds and ends the phase. Any other ending means delivery was not completed this phase. The courier stays at its final position rather than returning to the start. There is only one courier, so no arrival-order tie. The guard cannot be removed or attacked.

If a separate movement phase starts inside the zone, departure is allowed: only entry into a zone triggers the stop. All comparisons below reset to A2 and use no points from a later phase.

## Try the direct approach and a detour

First, move right from A2 to B2. Pay 1, leaving 6. B2 is empty but inside the guard's zone, so the courier stops there immediately, forfeiting the unused 6 points without delivering. Neither an exhausted budget nor an occupant of B2 caused the stop.

Second, take the upper edge: A2—A1—B1—C1. After three steps, 4 points remain. C1 is also inside the zone, so movement ends and the unused 4 points are forfeited. The planned continuation D1—E1—E2 cannot be executed.

The lower route similarly stops at C3. Any path from column A to column E must pass through column C. C2 is occupied, while C1 and C3 both trigger a stop. Therefore, no amount of movement budget allows passage in this single phase under the original rule. This follows from the connections and stopping rule, not merely from guessing after two unsuccessful attempts.

## Replace stopping with an entry surcharge

Reset the guard to C2, the courier to A2, and the budget to 7. Replace only the consequence of entry: **entering a zone no longer ends the phase but costs one additional point, for a total of 2.** Range, adjacency, the ban on entering C2, success conditions, and all other rules remain the same. With fewer than 2 points, the courier cannot enter a zone space.

Follow the upper edge to E2:

| Space entered | Step cost | Points remaining |
|---|---|---|
| A1 | 1 | 6 |
| B1 | 1 | 5 |
| C1 | 2 | 3 |
| D1 | 1 | 2 |
| E1 | 1 | 1 |
| E2 | 1 | 0 |

The courier reaches E2 and succeeds. The original stops this route at C1; the variant can afford six basic steps plus one zone surcharge, exactly spending 7. With a budget of only 6, this route instead exhausts its points at E1 and fails to deliver.

Moving A2—B2 first does not open C2. In the variant, entry to B2 costs 2 and leaves 5 points, but the guard still occupies C2. The courier must find a legal route around it. The surcharge changes the consequence of entering an empty space, not the occupation restriction.

## Obstruction is different from ownership

One guard affects both empty detours through neighboring spaces. That is the important relationship in this example. The original splits a traversable route across at least two movement phases. The variant turns it into an additional price that can potentially fit within one phase. Both make position matter, but they constrain different things.

A zone can suit designs in which a few units need to influence one another across empty spaces, or approaching and bypassing a unit should have explicit costs. Its burden is that players must keep reading which empty spaces are affected. Place range markers in a prototype to locate ambiguity in the range, payment timing, or stopping timing. This check alone does not establish greater enjoyment.

Do not treat “zone of control” as a complete combat system. Mandatory attacks, retreat restrictions, and friendly units canceling a zone are all outside this example. Adding any of them requires checking departure, neighboring units, and resolution order again. Details of hard and soft zones can also differ between works; labels do not replace rules.

## Distinguish control, majority, and movement budget

The area-control overview also includes neighboring influence. Here we compare its **ownership example**, which needs rules for who receives a location's rights or benefits and how they lose them. There are no ownership markers here, and Red does not score B2 just by influencing it. **Area majority** compares players' quantities or influence to allocate an outcome. This example makes no majority comparison. **Movement points** limit what can be paid; the original shows that a separate rule can force a stop despite points remaining.

If a design combines these mechanisms, ask separately: who occupies this space, who influences it, and who scores from it? The answers may differ. One word, “control,” should not conceal three different states.

## Check your understanding

1. In the original, may the courier spend one of its 4 unspent points to leave C1 for D1? **No.** Entry already ended this phase. A remaining balance is not permission to continue.
2. Does the guard at C2 affect B1? **No.** B1 is diagonally adjacent; this example uses orthogonal neighbors only.
3. In a separate original-rule phase starting at C1 with 3 points, can the courier take C1—D1—E1—E2? **Yes.** Departure from a zone is allowed, and none of the three entered spaces is in the guard's zone. Delivery costs 3. That does not change the first comparison's single-phase failure.
4. In the variant, can a courier with 1 point enter a zone and pay the missing point afterward? **No.** The full entry price of 2 must be paid first, so it remains in its previous space.
5. Does success in the variant prove every zone should charge extra instead of stopping movement? **No.** It establishes passage under this map and budget. Whole-game pacing, other units, and player experience remain untested.

## Sources and further reading

Geoffrey Engelstein and Isaac Shalev, *Building Blocks of Tabletop Game Design*, second edition, chapter 11, ARC-07 “Zone of Control,” printed pages 501–502. The authors discuss influence through neighboring spaces and implementations involving stops, extra costs, and departure restrictions. The grid corridor, 7-point budget, delivery condition, and comparison are original to this site; no combat rules from the book's example games are reproduced.

[BGG: Zone of Control (2974)](https://boardgamegeek.com/boardgamemechanic/2974/zone-of-control) is a classification identity link whose name and number were checked. Its definition page could not be read directly and does not support additional rule attributions here. Area control, area majority, and movement points explore the separate questions of ownership, relative quantities, and budgets.
