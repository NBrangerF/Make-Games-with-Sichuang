# Races and end triggers: does reaching the target first mean winning?

“End when someone reaches five” does not fully specify a winner or whether anyone else may still act. Reaching a threshold can press the end button while another rule determines victory. Separate those rules to see whether a sprint earns a reward or closes other players' opportunities.

## Three surveyors: track progress separately from points

This is an original, self-contained local sequence, not a complete match history. A, B, and C start at progress 3, 4, and 3, with scores of 3, 4, and 2. They hold 3, 1, and 1 coins; the bank holds 15, making 20 in total. Each has an independent progress marker. They may share the same number without blocking or occupying a space. All information is public. There are no dice, hands, hidden rewards, or loans.

Play at most two rounds. In each round, A, B, and C each act once in that order. Choose exactly one of three actions: sprint, paying 2 coins to the bank for 2 progress and 3 points; record findings, paying 1 coin for 4 points without progress; or prepare, freely receiving 1 coin from the bank without points or progress. Unaffordable actions are illegal. Receiving a coin does not permit an additional action. At most six actions occur, and the 20-coin supply covers every legal receipt. Coins move only between players and the bank.

Resolve an action's full cost, progress, and points before checking whether anyone has reached or exceeded progress 5. Landing exactly on 5 is unnecessary; overshooting is legal. The first qualifying action marks the current round as the last. Everyone who has not acted in that round still takes one full action in the original order. Anyone who already acted gets no additional action, including the triggering player. Later qualifying actions do not restart a countdown. End after completing that round, without starting another.

If nobody reaches the target, end after all three actions of round two. This two-round cap is an extra condition ensuring the example terminates, not a definition of every race. Compare only points at the end. Highest score wins; tied highest scorers share victory. Progress, remaining coins, and being first to trigger give no additional reward.

## Sprint now, or record findings first?

To compare A's first action, fix B's and C's plans: record findings in round one, then prepare if a second round occurs. These are specified complete routes, not a claim of optimal play in every position.

Route one: A sprints in round one, pays 2, and retains 1 coin. Progress rises from 3 to 5 and points from 3 to 6, triggering the end after this round. B can still record findings, spending the only coin to rise from 4 to 8 points. C does the same, rising from 2 to 6. End at 6 / 8 / 6, with B winning. A reached the threshold first but does not have the highest score. Individual coins of 1 / 0 / 0 plus the bank's 19 preserve 20.

Reset the start for route two. A first records findings, retaining 2 coins and reaching 7 points, with progress still 3. B and C record findings for 8 and 6 points; nobody reaches the target. In round two, A sprints, spends the remaining 2, and reaches progress 5 and score 10, now triggering the end. B and C each prepare for one coin and no points. Final scores are 10 / 8 / 6, so A wins. Individual coins are 0 / 1 / 1, and the bank holds 18.

| Finish the current round | Trigger moment | Final A / B / C | Winner |
|---|---|---|---|
| A sprints immediately | After A's action in round one | 6 / 8 / 6 | B |
| A records, then sprints | After A's action in round two | 10 / 8 / 6 | A |

Recording first costs A another action and earns 4 points, while leaving everyone another round. Here, B and C have no coins left for recording and prepare as specified. Delay is not always beneficial: opponents with more coins or a better reward could instead overtake A in the extra round.

## Change only to ending immediately after the trigger

Keep the initial state, actions, rewards, threshold, and victory rule. Replace finishing the current round with ending immediately after the qualifying action fully resolves. Follow route one: A still sprints and earns 3 points, reaching 6. The target check then stops play. B and C get no action this round and retain scores of 4 and 2. Final scores are 6 / 4 / 2, and A wins.

A still has 1 coin, B and C each retain 1, and the bank holds 17, totaling 20. Do not end early enough to erase the points from A's sprint. Nor should B and C be given compensating actions for an equal number of turns: that would restore the original rule. Changing only the wait before final resolution changes the winner from B to A. It neither adds a trigger bonus nor replaces scoring with “first to arrive wins.”

## How the end button affects choices

The book's VIC-07 “Race” makes the first player to the finish the winner and also discusses reaching a target score as a race. This site starts from that related idea but separates the threshold trigger from the final comparison. It is not a restatement of the book's definition. A track is only a recording tool here: a fixed order determines actions. Progress does not award the next turn, distinguishing this example from a time track.

A controllable ending can invite comparison between building up once more and settling now. The remaining opportunity must be visible. Finishing the current round differs from giving everyone one more action after the trigger; the latter would give A another opportunity too. This example does not use that rule.

Finishing the round here preserves equal completed-round counts, but that alone does not establish fairness. Action order, starting budgets, and available choices still differ. If final scoring also includes hidden objectives or end bonuses, specify those before assessing a sprint. Current visible points alone would be insufficient.

## Checks: whose actions remain?

1. **Can play end before adding A's 3 points when the sprint reaches 5?** No. Complete the action before checking. A has 6 points even in the immediate-ending variant.
2. **In the base rule's second round, can B record findings after preparing and receiving a coin?** No. Preparing used B's only action. Completing the round ends play, so there is no round three.
3. **What if everyone prepares in both rounds?** Nobody advances, but play still ends after round two. Scores remain 3 / 4 / 2, and B wins. Individual coins are 5 / 3 / 3 and the bank has 9, totaling 20. Not reaching 5 does not permit continued play.
4. **Does reaching 6 count, and can arriving first break a score tie?** It counts but does not break ties. In round one, A records and B and C prepare. In round two, A prepares, B sprints to 6, and C records. C completes the action after B's trigger. Scores are 7 / 7 / 6, so A and B share victory. Progress of 3 / 6 / 3 does not break the tie.

## Sources and scope

Geoffrey Engelstein and Isaac Shalev, [*Building Blocks of Tabletop Game Design*, second edition](https://doi.org/10.1201/9781003179184), VIC-07 “Race,” printed pages 227–228, discusses finishes, targets, and winners. VIC-09 “Fixed Number of Rounds,” printed pages 232–233, discusses fixed rounds, tracking the ending, and final-round effects. The survey actions, two-round cap, remaining-turn rules, and numbers are original analysis, not renamed examples from the book.

[BGG: Race](https://boardgamegeek.com/boardgamemechanic/2876/race) is a related classification reference. This page focuses on how reaching a target triggers the end and separately specifies victory. The Race label alone must not be used to infer that the triggering player automatically wins here.
