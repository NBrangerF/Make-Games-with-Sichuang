# Stop now or roll one more? You still have to place the dice afterward

Pressing your luck decides whether to risk a loss before an unknown result. Allocating dice decides how to use available results after seeing them. Both can occur in one phase; using dice does not make them the same decision.

## Collect first, then allocate

This original solo phase starts with two dice already showing 2 and 5, one spare fair six-sided die, and 0 points. Existing faces and all work areas below are public. Existing dice cannot be turned or rerolled.

First, choose to stop collecting and retain the 2 and 5, or roll the spare exactly once. On a spare result of 1, this version removes all dice. On 2–6, keep the existing dice and the new one. Every outcome proceeds to allocation, with no further rolls.

| Work area | Requirement | Points |
|---|---|---:|
| High | One die showing at least 5 | 6 |
| Exact | One die showing exactly 2 | 3 |
| Store | Any one die | Its face value |

Each area can be used once and each physical die can be used once. Place eligible dice into unused areas in any order and score them. Placements cannot be undone or moved. You may stop allocating. End when you stop or use all dice; unused dice score nothing. There are no other costs or rewards.

## Stopping collection does not automatically score 9

Keeping 2 and 5 allows 5 in High for 6 points and 2 in Exact for 3, totaling 9. That is the best allocation after stopping collection.

Putting 5 in Store instead scores 5, followed by 2 in Exact for 3, totaling 8. The stored 5 cannot also occupy High. Stopping collection secures available dice; it does not choose their uses.

Rolling an extra 4 allows 5 in High, 2 in Exact, and 4 in Store for 6 + 3 + 4 = 13. But storing 5 first and using 2 in Exact leaves 4 ineligible for High, ending at only 8. More dice do not perform the allocation for the player.

## What can one more roll produce?

Each branch below assumes the highest-scoring legal allocation after seeing that result. Enumerating placements for each physical die verifies the maxima.

| Spare result | Dice available in this version | Best allocation score |
|---:|---|---:|
| 1 | None | 0 |
| 2 | 2, 5, 2 | 11 |
| 3 | 2, 5, 3 | 12 |
| 4 | 2, 5, 4 | 13 |
| 5 | 2, 5, 5 | 14 |
| 6 | 2, 5, 6 | 15 |

With an extra 6, put 5 in High for 6, 2 in Exact for 3, and 6 in Store for 6, totaling 15. Putting 6 in High and storing 5 totals only 14.

For a fair die, continuing has mean score (0 + 11 + 12 + 13 + 14 + 15) / 6 = 65/6, about 10.83. That exceeds stopping's best 9 but includes a 1/6 chance of losing every available die. A higher mean does not decide whether a particular player wants to risk a zero.

## Change only which dice failure removes

Reset the start. Replace “remove all dice on a spare result of 1” with “remove only the spare, retaining the original 2 and 5.” Keep every other rule. The failure branch now permits 9 points; the five success branches remain 11–15.

Continuing's mean becomes (9 + 11 + 12 + 13 + 14 + 15) / 6 = 74/6, about 12.33. Comparing only phase points, with no extra costs and optimal allocation in each branch, no result from continuing is worse than stopping, and five are better.

This variant removes the risk of losing existing dice while retaining the allocation decision. The two decisions can therefore be adjusted separately. The conclusion does not extend automatically to games with extra time costs, fees, or other objectives.

## Check: can both dice showing 5 be used?

If the spare shows 5, the available dice are 2, 5, and 5. Put one 5 in High, the other in Store, and 2 in Exact for **14 points**. They are distinct physical dice. The prohibition is on using one die twice, not on placing equal values in different areas.

## Sources and classification

Geoffrey Engelstein and Isaac Shalev, *Building Blocks of Tabletop Game Design*, second edition, UNC-02 “Push-Your-Luck,” printed pages 267–270, discusses securing gains versus risking them for further rewards; WPL-04 “Workers-As-Dice,” printed pages 415–416, discusses values affecting uses, combinations, and effects. This phase, work areas, loss rule, and probability calculations are original to this site.

Related classification identities are [BGG: Push Your Luck](https://boardgamegeek.com/boardgamemechanic/2661/push-your-luck) and [BGG: Worker Placement with Dice Workers](https://boardgamegeek.com/boardgamemechanic/2935/worker-placement-with-dice-workers). They do not imply that this example includes opponents occupying spaces or the complete rules of a commercial game.
