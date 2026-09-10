# Catch-up systems: can helping a trailing player reward scoring less for now?

Helping a trailing player can make a gap harder to widen. Players may also ask whether temporarily trailing is worthwhile. This site treats catch-up systems as a design pattern: extra resources for trailers, restrictions on leaders, and advantages in action order can all contribute. A single subsidy amount does not describe the whole pattern.

## Determine who trails before anyone acts

This is an original two-player local game, not a complete match history. A and B each start with 4 points and 1 coin. The bank holds 18, making 20 coins in total. Scores, coins, and rules are public. There are no random events, hidden goals, loans, or transfers between players.

Play two rounds. At the beginning of each round, check current scores once. The player strictly below the other receives a 1-coin subsidy from the bank. If scores tie, neither receives it. Eligibility depends only on score, not poverty, and the amount does not increase with the size of the gap. Determine eligibility before either player acts, pay immediately, and do not check again that round. Round one starts at 4–4, so nobody receives anything.

A and then B each take one action from the menu. Costs must be paid in full to the bank now. An action cannot be repeated or combined with another in the same turn. Subsidy coins work like existing coins: spend them immediately or retain them. Use this sequence in both rounds, ending immediately after B's action in round two. There is no third subsidy or extra action.

| Action | Cost | Immediate points |
|---|---:|---:|
| Small task | 0 coins | 1 |
| Standard task | 1 coin | 3 |
| Major task | 4 coins | 6 |
| Pass | 0 coins | 0 |

Remaining coins score nothing. Higher score wins; equal scores draw. Becoming the leader does not remove points already earned. The bank pays subsidies and receives task costs; the 20-coin supply is sufficient, and no coins disappear. Even a penniless player can legally score through a small task.

## Earn three points now, or pass temporarily?

Fix A's first action as a small task, moving from 4 to 5 points while retaining 1 coin. Compare two choices for B. In the final round, have both players choose the highest-point action they can afford. The rewards are distinct, so this final-round selection rule has no action tie. It specifies complete routes without restricting other legal choices.

Route one: B immediately pays 1 for a standard task, reaching 7 points with no coins. Round two begins with A's 5 below B's 7. A receives the subsidy and now has 2 coins. A completes a standard task, retaining 1 and reaching 8 points. B cannot pay but completes a small task, also reaching 8. The game draws. Individual coins of 1 / 0 plus the bank's 19 preserve 20.

Route two: B passes in round one, staying at 4 points and 1 coin. At the start of round two, B trails A's 5 and receives 1 coin, now holding 2. A spends the original coin on a standard task to reach 8. B also completes a standard task, retaining 1 and reaching 7. A wins 8–7. Individual coins are 0 / 1, and the bank holds 19.

| Subsidy of 1 coin | Final-round recipient | Final A / B | Result |
|---|---|---|---|
| B takes a standard task first | A | 8 / 8 | Draw |
| B passes first | B | 8 / 7 | A wins |

B receives an extra coin in the second route, but not an extra point. The original coin was already enough to pay for a standard task; increasing the balance to 2 still cannot buy the major task costing 4. Earning 3 points immediately leaves B one final point better than passing. This compares specified routes, not every possible degree of trailing.

## Change only the subsidy, from one coin to three

Reset the start and change only the subsidy amount. Retain the eligibility metric, check timing, action costs, points, and ending. Keep A's first small task and both players' final-round choice of the highest-point affordable action.

If B takes the standard task first, A still trails at the start of round two. A's original coin plus the 3-coin subsidy exactly funds a major task, reaching 11 points with no coins. B still completes a small task for 8. A wins 11–8.

If B passes first, B receives the final-round subsidy. One original coin plus 3 also funds a major task, taking B from 4 to 10. A can only afford a standard task and reaches 8, so B wins 10–8. In both routes, players finish with no coins and the bank holds all 20.

| Subsidy of 3 coins | Final-round A / B actions | Final A / B | Result |
|---|---|---|---|
| B takes a standard task first | Major / small | 11 / 8 | A wins |
| B passes first | Standard / major | 8 / 10 | B wins |

The larger subsidy crosses the major task's cost threshold. With A's first action and the final-round selection rule fixed, B voluntarily passing changes B's result from 8 to 10 and from losing to winning. This is an executable route involving intentional trailing. It is not a guess about actual player motives or a claim that B should pass against every possible choice by A.

## What is being caught up, and why keep reasons to score?

The book's VIC-18 “Catch the Leader” describes multiple implementations and cautions that excessive strength can reward temporarily holding back. This site's fixed round-start subsidy makes that question calculable. Assistance can increase a trailing player's available actions without guaranteeing equal scores, a victory, or a feeling of fairness for everyone.

Here, trailing means only having fewer points now. It is not a complete assessment of strength. Coins, future returns, seating order, and remaining actions can also affect opportunities. A score-only measure might qualify someone who already has many resources. Examine that as a design choice rather than treating the metric's name as a complete fact.

Keeping reasons to score need not require removing assistance. Check what the subsidy purchases and whether that opportunity outweighs scoring now. Here, the smaller subsidy leaves earned points intact, and the free small task lets penniless players advance. The larger variant's issue comes from the combination of forgoing points, qualifying for help, and crossing a spending threshold, rather than merely from transferring a coin.

Catch-up also differs from regular income paid to everyone or a fixed starting allowance for beginners. Eligibility here changes with public scores and does not identify player experience. We have not measured participant feelings, long-term win rates, or engagement; a smaller gap is not automatically a better experience.

## Checks: do not pay at the wrong moment

1. **After A's first small task makes the score 5–4, can B immediately claim a subsidy?** No. That round's check already happened at 4–4. Wait until round two begins.
2. **If A overtakes after the round-two payment, can B receive another subsidy?** No. Check only once per round. Score changes during actions do not trigger another check, and there is no payment after the ending.
3. **In the 1-coin version, can B's extra remaining coin turn passing first into a draw?** No. Coins score zero. The result remains 8–7; money cannot suddenly be treated as points.
4. **With a 3-coin subsidy, what if both take standard tasks in round one?** Both reach 7 points with no coins. Neither qualifies at the start of round two. Only small tasks and passing are affordable. Following the highest-point choice, both take small tasks and draw 8–8. The bank holds 20. A larger subsidy is not fixed income for everybody.

## Sources and scope

Geoffrey Engelstein and Isaac Shalev, [*Building Blocks of Tabletop Game Design*, second edition](https://doi.org/10.1201/9781003179184), VIC-18 “Catch the Leader,” printed pages 250–251, discusses ways to help trailing players or restrict leaders, intentional holding back, and economic snowballing. VIC-09 “Fixed Number of Rounds,” printed pages 232–233, discusses rounds and final-round effects. The subsidy window, task menu, and amounts are original to this site, not commercial-game numerical rules reused from the book.

[BGG: Catch the Leader](https://boardgamegeek.com/boardgamemechanic/2887/catch-the-leader) is a related classification reference. This site retains catch-up systems as a design pattern. Eligibility, assistance, and final outcomes still require separate operating rules.
