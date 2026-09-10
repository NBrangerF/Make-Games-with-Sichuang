# Player elimination: one fewer piece, or one fewer participant?

Removing a player's piece does not necessarily eliminate the player. Losing subsequent actions or eligibility depends on the particular trigger rules. This entry examines departure from participation, specifying the elimination trigger, material destinations, waiting interval, and return conditions separately.

## Specify what the player leaves

Geoffrey Engelstein and Isaac Shalev's VIC-08, “Player Elimination,” starts with the last remaining player winning. It also discusses waiting after removal and variants that remove eligibility to win only at the end. These arrangements are not interchangeable: continuing to take normal actions but being unable to win at the end differs from losing all actions partway through play.

The original phase below has a three-round limit, but can end sooner with one eligible participant. Losing the last station triggers departure. Station count and eligibility are recorded separately. Waiting is not converted into unmeasured minutes.

## Three rounds of signal competition

Lin, Qiao, and Mu act in that order, with one action slot each per round for three rounds. Their initial station counts are 2, 1, and 2 respectively. Each has 2 batteries and 0 points. Stations are simply pieces in this example. All information is public. Start with an empty removal area and an empty spent-battery area.

An eligible player who still has a station chooses one action: broadcast for 2 points; interfere by first paying 1 battery to the spent area, then removing 1 station belonging to an opponent; or wait without changing anything. An interference target must still be eligible and have at least 1 station. A player cannot target themselves or interfere without paying. Each action removes only one station. There is no other income, trading, borrowing, or station replacement.

Under the original rule, reaching zero stations immediately removes eligibility for this phase. Skip all the player's later slots. They cannot broadcast, interfere, spend resources, or decide for someone else, and receive no final retaliation action. Their earned points remain on the record and unused batteries stay with them, but they cannot win this phase. Removed stations go to their owner's section of the removal area, not to the attacker.

After each action, check eligibility. If only one player remains eligible, end immediately with that player winning; do not finish the three rounds. Otherwise, after three rounds compare points among eligible players. The highest score wins, with tied players sharing the result. Eliminated players do not return during this phase. Once its result is settled, if the group starts another identical trial, everyone rejoins with the initial state. That does not revise the previous result.

## Route one: Qiao leaves on the first action

In round one, Lin interferes with Qiao, spending 1 battery. Qiao's only station is removed, eliminating Qiao immediately. Skip Qiao's first-round slot. Mu broadcasts for 2 points.

In round two, Lin broadcasts for 2 points, Qiao's slot is skipped, and Mu spends 1 battery to interfere with Lin. Lin drops from two stations to one and remains in play. In round three, Lin broadcasts for another 2 points, Qiao is skipped, and Mu broadcasts for another 2 points.

Lin and Mu finish on 4 points each and are eligible joint winners. Qiao has 0 points and is ineligible. Stations remaining are 1/0/2, with one Lin station and one Qiao station removed. Batteries remaining are 1/2/1, with 2 spent. All five station pieces and six batteries are accounted for.

Qiao missed three personal action slots. After Qiao's departure, the others made five actual choices: Mu in round one, Lin and Mu in round two, and Lin and Mu in round three. Five choices are not five minutes. How long choices take and how Qiao experiences waiting require separate observation.

## Route two: Qiao keeps three actions

Reset the initial state, changing only Lin's first choice to broadcast. Lin still broadcasts in rounds two and three. Mu still broadcasts, interferes with Lin, then broadcasts. Whenever Qiao can take a normal action, Qiao broadcasts.

In round one, each gains 2 points. In round two, Lin and Qiao each gain another 2, while Mu pays 1 battery to remove one of Lin's stations. Everyone broadcasts in round three. Final scores are Lin 6, Qiao 6, and Mu 4, with Lin and Qiao joint winners. Stations remaining are 1/1/2, with only one Lin station removed. Batteries remaining are 2/2/1, with 1 spent.

Qiao never reached zero and received three genuine opportunities to choose. This comparison fixes those choices as broadcasts so the route can be fully resolved. It establishes neither that elimination always helps nor that preserving another player is always better. Different targets, point values, or choices can change the result.

## Replace only what happens on the first loss of all stations

Keep route one's action plan, replacing one departure rule: the **first** time each player reaches zero stations, they keep eligibility and wait for their next personal slot. That slot must return 1 of their own stations from the removal area. It costs no battery but includes no broadcast or interference. Reaching zero again later eliminates them permanently under the original rule. Costs, order, the three-round limit, and victory rules remain unchanged. A player awaiting return has no station and cannot be an interference target.

Lin still removes Qiao's only station in round one. Qiao's next slot returns one station, with points still at 0; Mu broadcasts. In round two, Lin broadcasts, Qiao broadcasts for 2 points, and Mu interferes with Lin. All three broadcast in round three.

Lin, Qiao, and Mu finish with 4 points each and all remain eligible, so they are joint winners. Qiao lost only the first normal choice and could decide what to do in rounds two and three. The first zero-station event is now a temporary loss of an action opportunity, not departure for the entire phase.

If a player's first zero occurs after their last personal slot, no return slot is added. At the end of three rounds, they retain eligibility and compare their existing points. Waiting to return does not extend the phase.

| Complete route | Final stations: Lin / Qiao / Mu | Batteries remaining | Recorded points |
| --- | --- | --- | --- |
| Qiao eliminated in round one | 1 / 0 / 2 | 1 / 2 / 1 | 4 / 0 / 4 |
| Lin broadcasts first instead | 1 / 1 / 2 | 2 / 2 / 1 | 6 / 6 / 4 |
| Return after the first zero | 1 / 1 / 2 | 1 / 2 / 1 | 4 / 4 / 4 |

Only Lin's removed station remains out in the return variant. Qiao's station was returned, not created. There are still 2 spent batteries. This rule changes participation after reaching zero and the points available through later slots. The calculation does not establish which arrangement players prefer.

## Check: what can this player still do?

1. **Lin drops from two stations to one. Must later actions be skipped?** No. Lin still has a station and eligibility. Removing a piece is not itself player elimination.
2. **After original-rule elimination, Qiao still has 2 batteries. Can Qiao spend one to help Mu interfere?** No. Retaining material does not preserve action rights. This example has neither transfers nor a final action.
3. **After returning a station in round one, can Qiao immediately broadcast for 2 points?** No. Returning used that slot. Qiao's first broadcast is in round two.
4. **If interference leaves only Mu eligible, must play continue until round three ends?** No. End immediately with Mu winning. Do not count later slots that have been cancelled.

## Sources and scope

The core source is Geoffrey Engelstein and Isaac Shalev, *Building Blocks of Tabletop Game Design: An Encyclopedia of Mechanisms*, second edition, CRC Press, 2022, Chapter 5, VIC-08 “Player Elimination” (EPUB anchor `filepos500251`). Its complete description and discussion were read. The three-round trial, material, points, action plans, and first-return comparison are original to this site. A round limit is this example's choice, not a necessary property of elimination. [Bibliography and DOI](https://doi.org/10.1201/9781003179184)

[BGG 2685: Player Elimination](https://boardgamegeek.com/boardgamemechanic/2685/player-elimination) is a related classification identity reference. The departure and return rules are specified individually here, not inferred from that label. Scripted arithmetic is not a test of the experience of watching.
