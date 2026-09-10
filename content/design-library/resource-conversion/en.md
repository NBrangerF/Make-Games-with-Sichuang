# Resource conversion: what does making a plank give up?

Timber can be sold directly or processed before building a boat. A conversion formula specifies its output. Evaluating the route also requires counting its actions and the other uses of its inputs.

## Three timber, one stone, three actions

This original solo phase starts with 3 timber, 1 stone, no planks, and 0 points. Everything is public. Take at most three actions, choosing one row below each time. Actions may repeat whenever their costs can be paid. You may stop early. Paid materials return to the supply and no longer belong to you. Planks and points have sufficient supply; neither runs out.

| Action | Pay | Receive |
|---|---|---|
| Process | 2 timber | 1 plank |
| Build a boat | 1 plank + 1 stone | 5 points |
| Sell | 1 timber | 2 points |

End after the third action or when you stop, recording accumulated points. Leftover materials score nothing. There are no reverse conversions, loans, or additional income.

## Why the 7-point route is not a free bonus

Process first, leaving 1 timber, 1 stone, and 1 plank. Build a boat for 5 points, leaving 1 timber. Sell that timber for 2 more points. The total is 7, using all three actions and all materials.

Alternatively, sell one timber on each action for 6 points. The remaining stone scores nothing. Processing improves the result by only 1 point: the boat's 5 points consume two timber that could have sold for 4, require a stone, and occupy both a processing and a building action. The 5 points are not added for free to the selling route.

Enumerating legal action sequences in this position gives a maximum of 7. Selling first, then processing and building, also reaches 7. The route does not require a unique action order.

## Change only processing to cost 3 timber

Reset the starting materials and change only the processing cost from 2 timber to 3. Processing leaves no timber to sell. The boat scores 5, with nothing affordable on the third action. Selling three times still scores 6 and is now the better route.

| Processing cost | Process-and-build route | Sell three times | Maximum here |
|---|---:|---:|---:|
| 2 timber | 7 | 6 | 7 |
| 3 timber | 5 | 6 | 6 |

This does not mean processing is always worse than selling. The result depends on three actions, these materials, and no points for leftovers. An order bonus or another use for a remaining plank could change the comparison.

## Separate formulas from value judgments

“2 timber become 1 plank” is a rule relationship. A plank's value also depends on its later uses, access to complementary materials, and remaining actions. Here, a plank cannot score directly. Without stone, the boat route cannot continue.

All conversions on this page settle with the supply. Players cannot negotiate prices. That differs from players agreeing terms with one another. If you add reverse conversions, check for a repeatable cycle that generates resources without a cost or limit. This example has no reverse conversion.

## Check: what if there are only two actions?

Restore the processing cost of 2 timber but allow only two actions. Processing and building score 5; selling twice scores 4. The processing route leaves 1 timber without a third action to sell it. **The maximum is 5, not 7.** Sufficient materials do not imply sufficient actions.

## Sources and classification

Geoffrey Engelstein and Isaac Shalev, *Building Blocks of Tabletop Game Design*, second edition, ECO-01 “Exchanging,” printed pages 308–309, discusses exchanges with the supply, fixed conversion relationships, and changing uses for resources over a game. All recipes, quantities, action limits, and results here are original to this site.

Our “resource conversion” label focuses on inputs becoming outputs. We do not force an equivalent BGG category or treat the book's taxonomy as a general theory of prices.
