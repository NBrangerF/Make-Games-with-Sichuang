# Action points: a sufficient budget still needs the right order

Being able to do four things does not mean every plan fits. Actions may have different costs, and each step can change your position, resources, or access to the next one. Action points put these actions into a shared budget, making their order something to calculate.

## Spend points on opportunities to act

**Action points** give a player a budget to spend on actions. Actions might all cost 1 point or have different costs. Points can be tracked with markers or expressed as a number of permitted actions. They need not represent money or final score.

Complete rules also specify when the budget arrives, whether actions may repeat, whether costs must be paid in full, when another player acts, and whether unused points carry over or expire. Our example grants 4 new points per turn and discards leftovers. This is one implementation, not a universal requirement.

## Two turns at an observatory

This original single-player local phase has public information and no random outcomes. Three locations form a line: **workbench—window—roof**. Movement is only between adjacent locations. Start at the window with 1 filter and 0 points. The workbench reserve holds 2 filters; the consumed area is empty. Neither the near target at the window nor the far target on the roof has been recorded.

There are exactly two turns. Gain 4 action points at the start of each. Within a turn, perform actions in any legal order, paying their full point cost before resolving their effects:

| Action | Cost and conditions | Effect |
| --- | --- | --- |
| Move | 1 point | Move to an adjacent location; repeatable. |
| Collect a filter | 1 point; at the workbench with a nonempty reserve | Take 1 filter from the reserve; repeatable. |
| Record the near target | 2 points; at the window, with a filter, and near target not yet recorded | Move 1 filter to the consumed area, mark the near target recorded, and score 4. |
| Record the far target | 2 points; on the roof, with a filter, and far target not yet recorded | Move 1 filter to the consumed area, mark the far target recorded, and score 7. |

Each target may be recorded only once this phase. You may end a turn voluntarily; spending all its points also ends it. Unused points immediately expire. You cannot partially pay now and complete payment next turn. Position, filters, recorded targets, and earned score persist. The phase ends after turn two; leftover filters and action points score nothing. Filter consumption and rewards are rules of this example.

## Taking 4 points first leaves room to record twice

On turn one, record at the window: spend 2 action points and 1 filter to score 4. Spend 1 point moving to the workbench and 1 collecting a filter. All 4 points are spent. You finish at the workbench holding 1 filter, with 1 left in reserve.

Turn two supplies 4 new points. Spend 1 moving to the window, 1 moving to the roof, and 2 plus a filter recording the far target. The phase ends on the roof with a score of 11, no filters held, 1 in reserve, and 2 consumed. Both targets are recorded.

What if you take the immediate 7-point target first? On turn one, spend 1 to reach the roof, 2 to record, and the last 1 returning to the window. On turn two, moving to the workbench, collecting a filter, and returning to the window each cost 1. Only 1 point remains, insufficient for the 2-point near recording. End there: a score of 7, at the window holding 1 filter, with 1 each in reserve and consumed. The near target remains unrecorded.

The near-first route requires three moves, one collection, and two recordings: `3 + 1 + 4 = 8` points. Recording far first and returning to complete near needs at least four moves, totaling 9 points against an eight-point budget. The higher immediate reward is not inherently bad. With only one turn remaining, the far target's 7 beats the near target's 4. Remaining time and route change the judgment.

## Change only whether unused points carry over

Reset the initial state and try another preparation route. On turn one, move to the workbench, collect a filter, and return to the window. This costs 3 points, leaving you with 2 filters and no score. Under the original rules, the unused point expires and turn two supplies only 4 points.

The intended second-turn plan—record near, move to the roof, record far—costs `2 + 1 + 2 = 5`. Its last step is illegal under the original rules. After the first two steps, only 1 point remains, so this plan ends with a score of 4. You could instead choose to record only far, scoring 7.

Now change just one rule: unused turn-one points carry over and add to the next turn's 4 new points. The preparation route leaves 5 points for turn two, allowing all three planned actions. Finish on the roof with a score of 11, no filters held, 1 in reserve, 2 consumed, both targets recorded, and no action points left.

The preparation route has become feasible. The phase's overall maximum has not risen from 4 to 11: the original near-first route already scores 11, and the two targets cap both versions at 11. Saving a budget can change feasible plans without increasing the highest reward.

## What does this mechanism offer and cost?

Action points let different actions compete for one budget. Moving and using a location's effect cannot be considered separately here. Different costs distinguish investment, but ask players to consider routes, prerequisites, and remaining points together. Addition and subtraction alone are insufficient: where you go first changes how many moves you need.

A larger budget might finally permit a combination, or merely add more sequences to consider during one turn. If extra actions offer no benefit, or one route is better under every relevant condition, additional points do not automatically create richer strategy. Observe which plans players compare, where they discover an unaffordable step, and how long others wait. A single-player calculation cannot answer that last question.

Distinguish action points from other resources. Filters persist between turns here; action points normally do not. Both affect whether recording is possible. Calling points “energy” does not determine whether they can be saved: the rule must specify it. Nor does one fixed action with several automatic steps become budget allocation merely because it contains many steps.

## Check: where should the final four points go?

Use the original rules. At the start of the final turn, you are at the workbench with 2 filters, 4 action points, and a score of 0. The reserve holds 1 filter and neither target is recorded. Compare “move to window, record near, move to roof” with “move to window, move to roof, record far.” Can you record both?

**Answer:** the first route costs `1 + 2 + 1 = 4` and scores 4. The second costs `1 + 1 + 2 = 4` and scores 7. Both finish on the roof holding 1 filter, with 1 in reserve and 1 consumed, but different targets recorded. Completing both requires at least two moves and two recordings, costing 6 points, which you cannot afford. For this phase's score alone, choose the second route. Do not present 4 and 7 as equally good merely to claim that every decision is a tradeoff.

## Source and classification

Conceptual research draws on Geoffrey Engelstein and Isaac Shalev, *Building Blocks of Tabletop Game Design: An Encyclopedia of Mechanisms*, second edition, CRC Press, 2022, chapter 3, ACT-01, “Action Points.” It discusses budgets, different costs, repetition limits, and unused points, and notes that larger budgets can expand the decision space. The observatory rules and all route calculations are original.

[BGG: Action Points](https://boardgamegeek.com/boardgamemechanic/2001/action-points) supplies a classification identity. The name does not determine particular action costs, repetition limits, or point-carryover rules.
