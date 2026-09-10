# Scenarios and state across games: what does the previous game leave behind?

Calling stages Chapter One and Chapter Two does not yet explain how their games connect. A scenario can give the same system a different opening and goal. A campaign must also specify which outputs of one scenario become inputs to another. A story can explain that connection, but the rules still need to implement it.

## A complete two-site repair campaign

This is an original solo example from this site, not a simulation of a commercial game. There are six identical parts in total: initially two in hand, four in the supply, and none in the used area. All objects and rules are public. There are no random events or other resources. Two scenarios occur in a fixed order, with exactly two actions in each.

Scenario one repairs an outpost and requires one repair. Scenario two repairs a relay station and requires two repairs. Local progress starts at zero in each scenario. For each action, choose one legal option:

| Action | Requirement and resolution |
|---|---|
| Gather | If the supply has at least one part, move one from the supply into your hand |
| Repair | If you have at least one part and local progress is below this scenario’s goal, move one part from your hand to the used area and increase progress by one |
| Wait | Always legal; move no parts and add no progress |

Each option uses one action. There are no other costs, exchanges, borrowing, or rewards. Even if the first action meets the goal, you must resolve a second action. Once the goal is reached, another repair is illegal, but you may gather legally or wait. Only after the second action resolves do you check the result: meeting the goal succeeds; otherwise the scenario fails.

After scenario one, record success or failure and **advance to scenario two either way, without retrying scenario one**. Keep all parts in the hand, supply, and used area where they are. Reset local progress to zero, reset the action allowance to two, and change the goal to two. After scenario two, the campaign ends. Both scenarios must succeed to meet the campaign goal. Zero or one success does not meet it. Record the number of successful scenarios; equal counts are equal results, with no remaining-parts tiebreaker. There is no other player to compare against.

## Why can the same repaired outpost lead to different results?

**Path A: repair, then gather.** In scenario one, spend one part: hand 1, supply 4, used 1, progress 1. Gather one: hand 2, supply 3, used 1. The outpost succeeds. Reset local progress for scenario two, then repair twice. Finish with hand 0, supply 3, used 3, progress 2. The relay also succeeds, meeting the campaign goal.

**Path B: repair, then wait.** Scenario one ends with hand 1, supply 4, used 1, and the outpost succeeds just as before. In scenario two, use the policy “repair whenever it is legal; otherwise wait.” The first repair leaves hand 0, used 2, progress 1. You cannot afford a second repair, so the policy selects wait. Finish with hand 0, supply 4, used 2. The relay fails. Only one scenario succeeded, so the campaign goal was not met.

This does not mean repair and wait are the only legal actions in scenario two. Path B could gather on its second action, but would have no third action to use that part. Nor may a planned “repair twice” be presented as a completed legal path. The outpost’s second action no longer changes its local success, but the parts it leaves in hand change the feasible paths in the next scenario.

## Change only the between-scenario hand adjustment

Return to the original opening. Replace exactly one transition rule: **instead of retaining the hand unchanged, adjust it to two parts. Take any shortfall from the supply; return any excess to the supply.** Do not recover used parts. Scenario order, goals, two-action allowances, result records, and campaign ending rules remain unchanged.

From this example’s opening, scenario one can use at most one part, so the hand and supply together contain at least five. There are always enough parts for this adjustment. It creates no material and takes nothing from the used area.

Repeat Path B. After repair, wait in scenario one, you still have hand 1, supply 4, used 1. At the transition, move one supply part into your hand: hand 2, supply 3, used 1. In scenario two, retain the policy “repair whenever it is legal; otherwise wait.” This time both repairs are legal. Finish with hand 0, supply 3, used 3. Both scenarios succeed.

| Starting from the same opening | Keep hand unchanged | Adjust hand to two |
|---|---|---|
| A: repair, gather; then repair whenever legal | Both succeed | Both succeed |
| B: repair, wait; then repair whenever legal | Only outpost succeeds | Both succeed |

Path A already has two parts at the transition, so the adjustment changes nothing. Path B differs because of one transition rule, without lowering the relay’s goal or granting more actions. The decision policy stays fixed; different resources change which actions that policy can legally select.

This adjustment does not make the scenarios entirely independent. The first result still enters the final campaign judgment, and states such as the used area have not all been reset. To make independent scenarios, specify which outputs no longer enter subsequent rules rather than merely replacing the category label.

## When do failure advancement and restarting occur?

The base version also permits this complete path: gather twice in scenario one, reaching hand 4, supply 2, used 0, progress 0. The outpost fails. Advance to the relay anyway. Repair twice there, ending with hand 2, supply 2, used 2. Scenario two succeeds. The campaign ends with one success and its goal unmet. Stockpiling extra material does not erase the outpost’s failure record.

Only after the whole campaign ends may you restart from the beginning. Collect all six parts, including used ones, and restore hand 2, supply 4, used 0. Return to scenario one and clear every progress and result record. Within one campaign, this example permits no undo, retry, or early restart. Carrying state across scenarios and resetting after the campaign are compatible because they occur at different boundaries.

If pauses are allowed only between scenarios, a save needs the next scenario, the hand/supply/used counts, and the results already recorded. Local progress has been cleared. Allowing a pause within a scenario would additionally require local progress and the number of actions already used. These are states the rules must maintain; chapter titles cannot replace them.

## Boundaries between scenarios, campaigns, and legacy

The two scenarios reuse an action system with different repair goals. Their transition makes objects and result records continue to matter. This demonstrates two distinct questions: configuring a scenario and connecting games. See the related action-points entry below for limits within a game, and the races-and-end-triggers entry for ending conditions.

A continuing story, numbered chapters, or an erasable record is not sufficient by itself to establish a legacy structure. This example permanently modifies no components and unlocks no content through progress; it uses a fully resettable campaign record. The book initially emphasizes irreversible lasting changes for legacy, but also discusses unlocks, reusable implementations, and evolving category boundaries. The reverse claim, “anything resettable cannot be legacy,” would therefore be too strong as well. Specify what changes, how long it persists, and how it can be restored.

Calculating two successful scenarios establishes feasible paths under these rules. It does not establish that players will want to continue after a failure or enjoy preparing across games. Nor do we treat the proportion of legal paths as a win probability: players choose actions, and no distribution over random action choices has been specified.

## Check yourself: does a failed outpost still lead to the relay?

1. Can the scenario end immediately when its first repair completes the outpost?
2. Does an outpost failure cause a retry or advancement in the base version?
3. Can the hand-to-two adjustment recover parts from the used area?
4. With one part entering scenario two, is repair, repair legal?
5. After the campaign has ended, what happens to failures and used parts when restarting?

**Answers:** First, no: resolve the second action. Another repair is illegal, but gather or wait is available. Second, advance: each scenario gets one attempt regardless of the result. Third, no: parts move only between hand and supply. Fourth, no: the first repair leaves no part; gathering instead cannot grant a third action. Fifth, clear the results and collect all six parts, restoring hand 2, supply 4, used 0.

## Sources and scope

Geoffrey Engelstein and Isaac Shalev, *Building Blocks of Tabletop Game Design*, second edition: STR-08 “Scenario/Mission/Campaign Games” (printed pages 22–24) discusses applying a system to different starting conditions and goals, and campaign links in which one scenario’s output affects the next. STR-09 “Score-and-Reset Games” (25–26) notes that resetting can retain some state. STR-10 “Legacy Games” (27–29) discusses persistent changes, unlocks, and category boundaries.

“What crosses games, and when is it cleared?” is this site’s way of organizing these concepts. All two-site repair rules, policies, and numbers are original, not adaptations of a campaign in the book or a commercial game. A solo example keeps the state easy to follow. Solo play and automated opponents are not synonyms; continue with the related entry on solo play and automated opponents below.

[BGG 2822: Scenario / Mission / Campaign Game](https://boardgamegeek.com/boardgamemechanic/2822/scenario-mission-campaign-game) is a related classification entry. This page distinguishes scenario configuration from state carried across games; the combined label does not imply that every scenario belongs to a connected campaign.
