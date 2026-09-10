# Reveal first or commit first: does resolving later mean choosing later?

Two players commit cards together, then score A before B. That does not let B choose after seeing A's card. Deciding, revealing, and resolving effects are separate moments. Moving one can change available information without changing the outcome of a fixed pair of choices.

## Two event venues

This original two-player local phase gives each player a Market M card and a Gallery G card with indistinguishable backs. Both start at 0 points. There are no coins, action resources, or other costs. Venues and rewards are public.

Each secretly commits one card face down, keeping the other in hand. No communication, signaling, or looking at the other player's card. Reveal together only after both have committed; no card changes are allowed.

Choosing the same venue creates a double booking: both events are canceled and both score 0. Different venues award these points.

| Player | Market M | Gallery G |
|---|---:|---:|
| A | 4 | 3 |
| B | 5 | 2 |

After revealing, resolve A and then B. **Check conflicts against both revealed cards, regardless of resolution order.** The first player resolved does not claim a venue before the other. End after both players resolve. Played cards remain face up and the unused cards stay in hand. Compare only these phase points, retaining ties.

## Four commitments, four results

| A committed | B committed | Resolve A first | Resolve B next | Final A / B |
|---|---|---|---|---|
| M | M | Conflict: 0 | Conflict: 0 | 0 / 0 |
| M | G | Market: 4 | Gallery: 2 | 4 / 2 |
| G | M | Gallery: 3 | Market: 5 | 3 / 5 |
| G | G | Conflict: 0 | Conflict: 0 | 0 / 0 |

Suppose both seek their higher Market reward and choose M. Revealing causes a conflict. B cannot switch to G merely because B's effect has not resolved yet. B's choice was used at commitment; resolution order does not reopen it.

This is a specified sequence. It assumes neither that both must choose M nor that real people select each venue with probability one half. Simultaneous choices can still select different venues.

## Let B see A's card before committing

Reset. Change one timing relationship: **A commits and reveals before B commits.** A cannot change cards. Having seen A's choice, B remains free to choose either M or G. Reveal B's committed card, then resolve A and B using the same conflicts and rewards. No effects resolve before both commitments.

After A reveals M, B can choose G, producing 4 / 2. After A reveals G, B can choose M, producing 3 / 5. If B seeks only their own phase points, these responses each beat a conflict's 0. B is not required to follow them, and nothing here predicts A's choice.

Fix the pair at A choosing M and B choosing G: both timing versions score 4 / 2. The changed relationship is **what B can base a decision on**, not how the same pair is scored. If B sees A's M and still chooses M, both still score 0.

## What if only resolution order reverses?

Separately reset to the original rules: both commit secretly and reveal together. Change only resolution to B before A. Every fixed pair keeps its score. With A choosing G and B choosing M, B scores 5 first and A scores 3 later. The result remains A 3, B 5. Both choosing M still gives 0 / 0.

The conflict check uses the entire revealed pair. There is no first-come inventory, immediate occupation, or earlier effect changing a later effect. This establishes order independence only for this example. It does not make resolution order generally irrelevant. The simultaneous-choice entry's limited parcels require their own collection-order analysis.

## Give each moment its own sentence

Write when a choice can still change, then who sees what and when, then which states effects use and in what order they resolve. “Act in order” alone can blur these questions.

To investigate earlier information, hold rewards and conflict resolution fixed as in the first variation. To examine priority, separately construct effects that consume or change shared state. A changed second-player score is not enough to identify a general advantage without tracing knowledge and commitment.

## Check: can B switch before their effect resolves?

Both cards are committed and revealed under the original rules: A chose G, B chose M. Reverse resolution to B first. May B switch M to G? **No.** Resolution order does not alter commitment. B scores 5 and A scores 3.

In the early-reveal version, A reveals M and B also chooses M. Does choosing later automatically give B an empty venue? **No.** Later choice provides information without making the choice for B. The conflict still gives both 0.

## Source and comparison limits

Geoffrey Engelstein and Isaac Shalev, *Building Blocks of Tabletop Game Design*, second edition, TRN-09 “Simultaneous Action Selection,” printed pages 55–56. It separates simultaneous action selection from subsequent ordered resolution and describes different ordering implementations. These venues, asymmetric rewards, conflict table, and timing variations are original.

This comparison does not assume that simultaneous selection reduces waiting or increases enjoyment. It establishes the relationship between commitment, information, and resolution. Real players' predictions, delays, and misunderstandings require observation.
