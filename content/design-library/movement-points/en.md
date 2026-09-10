# Movement points: why can the shorter route leave you stranded?

The number of steps between two locations need not equal the price of reaching them. Movement points give a piece a movement budget. The map and the piece's abilities determine how much each move costs. To understand the mechanism, inspect the budget, the connections, and the prices together.

## What do the points pay for?

One implementation charges one point to enter each space. Another charges more for mountains or less for particular units using roads. Rules must specify whether payment happens when entering a space, crossing an edge, or completing an entire route. “Move 4” alone does not tell a player which destinations are legal.

The example below charges on entry. Its points belong to one piece and pay only for movement. They cannot buy, build, or attack. If a shared pool pays for those actions too, examine it under the broader action-points concept, including the competition between those actions.

## Four points for Ridge Station

This is an original one-player local phase for comparing movement and sample collection, not a complete game. All connections, prices, and samples are public. There are no dice or other players' actions.

A sampling cart begins at S with 4 movement points and 0 score. The following two routes contain every connection, all usable in either direction. Locations without a listed connection are not adjacent.

- Short route: S—H—G, two steps. H is Ridge Station and G is the destination station.
- Detour: S—A—B—C—G, four steps. A, B, and C are ordinary stations.

Entering H costs 4 points. Entering any other location, including returning to S, costs 1. Move only to an adjacent location; no skipping stations. Before a move, the cart must have enough points to pay the full cost. An unaffordable step cannot be made and changes neither position nor budget. The player may stop voluntarily. Running out of points also ends the phase. Unspent points do not carry into another phase.

H holds one sample worth 3 score; G holds one worth 5. On first entry, automatically remove that location's sample and score it immediately, without an additional point cost. Passing through counts as entry. Returning to a location cannot score its removed sample again. Reaching G does not force the phase to end: the same movement and stopping rules apply. At the end, report position, score, remaining points, and uncollected samples. There is no additional whole-game victory condition; equal scores are tied for this phase.

## Calculate both routes

| Route | Points remaining after each entry | Collection and final state |
|---|---|---|
| S to H | 4−4 = 0 | Collect H's sample for 3 score; stop at H; G's sample remains |
| S to A to B to C to G | 3, 2, 1, 0 | Collect G's sample for 5 score; stop at G; H's sample remains |

The short route takes only two steps, but the cart cannot finish it this phase. Entering H exhausts the budget. It cannot borrow the next point and enter G anyway. The detour visits more locations, yet costs exactly 4 points and reaches G.

Moving S—A and voluntarily stopping is also legal: position A, score 0, 3 points left, both samples still on the map. The budget is a maximum expenditure, not a requirement to take a certain number of steps.

Under these fixed rules, considering only this phase's score, the detour's 5 beats the 3 available by stopping at H. That does not make detours universally better. Future position value, opponents, and new tasks are outside this local model.

## Change only H's entry cost to 3

Reset the cart, its 4-point budget and 0 score, and both samples. Change one rule: entering H costs 3 rather than 4. Connections, sample values, collection timing, and stopping rules remain the same.

Now take the short route. S to H costs 3, leaving 1 point and collecting 3 score. H to G costs the final point and collects 5 more score. The cart ends at G with 8 score and neither sample left. The detour still costs 4, scores 5, and ends at G.

The difference is more than a slightly faster cart. The same budget previously supported either the ridge sample or the destination sample; now the short route can combine both rewards. A price has crossed a reachability threshold. Comparing location values without recalculating which rewards fit into one budget would miss that change.

## Inspect routes and the rewards they connect

Movement prices turn the map's connections into connections with different costs. Check a change at three levels: whether a location is reachable; how much budget remains on arrival; and what else the piece can accomplish along the way. In this example, the third question decides whether the rewards of 3 and 5 can be added together.

This mechanism can support route and terrain choices or different movement ranges for different units. Its cost is step-by-step accounting, especially when terrain, facing, unit type, and temporary conditions all affect payment. Mark payment locations and amounts clearly in a prototype so you can distinguish a useful decision from table lookup or missed arithmetic.

More budget does not always mean a different reward this phase. In the original, increasing the budget from 4 to 5 first makes both samples reachable along the short route. Whether further points enable any additional reward depends on the map and the once-only collection rule. One extra point need not produce one extra score.

## Distinguish the nearby concepts

**Action points** can make movement compete with other actions. Collection here happens automatically; do not silently add an action cost. **Route building** changes which connections exist or who can use them. These connections are fixed: choosing the detour builds no road. A **zone of control** can add costs or force a stop because an opposing piece is nearby. Points remaining would then not guarantee permission to continue. This example has no such restriction.

A rule saying a piece must move in a particular shape primarily constrains its movement pattern. It does not automatically let players split distance into successive payments from a remaining budget. Distinguish related names by the state a player actually pays, updates, and checks.

## Check your understanding

1. In the original, can the cart use G's 5 score to pay for the next step after reaching H? **No.** Score is not movement currency, and G's sample is collected only on entry. The budget at H is already 0.
2. After S—H—G in the variant, can the cart return to H and collect another 3? **No.** All 4 points are spent, and H's sample is gone. These are separate restrictions.
3. With an original-rule budget of 3, can the cart pay 3 to enter H and pay the missing point later? **No.** Entry requires full payment, so that attempted move leaves it at S. It could instead take the first three detour steps to C, ending with 0 points and 0 score.
4. The variant's short route scores 3 more than the detour. Does that prove players prefer it? **No.** The calculation establishes the result in this state, not player preference or whole-game strategy.

## Sources and further reading

Geoffrey Engelstein and Isaac Shalev, *Building Blocks of Tabletop Game Design*, second edition, chapter 10, MOV-04 “Movement Points,” printed pages 440–441; adjacent MOV-03 “Pattern Movement,” pages 437–439. The former discusses budgets, terrain costs, and extensions to action points; the latter helps distinguish movement-pattern restrictions. The Ridge Station map, values, collection rules, and comparison are original to this site.

[BGG: Movement Points (2947)](https://boardgamegeek.com/boardgamemechanic/2947/movement-points) is a classification identity link. Its name and number were checked; an inaccessible BGG definition was not used as evidence. Action points, route building, and zones of control offer further comparisons of budgets, connections, and neighboring influence.
