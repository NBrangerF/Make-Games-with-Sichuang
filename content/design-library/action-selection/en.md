# Action selection: why is an action available now but unavailable later?

A list of “move, produce, upgrade” does not yet tell us what a player can do at this moment. An action may still be printed in front of them but be unavailable because of its cost, a prerequisite, another player's choice, or their own previous use. Designing an action system means specifying both an action's effect and access to that action.

## An overview, not one fixed mechanism

Here, **action selection** names a design question: how are actions offered and restricted? Different mechanisms can answer this question, and they can work together.

| How actions are offered | What must be checked before choosing? | What changes afterwards? |
| --- | --- | --- |
| An action-point budget | Can the remaining points pay the cost, and are other conditions met? | The budget decreases; some actions may become unaffordable. |
| A limited shared action pool | Is the required opportunity still available? | A taken opportunity is unavailable to other players. |
| Personal action cards with retrieval | Is the card available, and are its conditions met? | Used cards become unavailable until retrieved under the rules. |

“Broadcast a program segment” describes an action's content. “Retrieve the broadcast card before using it again” describes how the action is offered. Avoid collapsing these into a vague “broadcast mechanism,” or treating every game with choices as one classification.

## Four actions at a pocket radio station

This is an original single-player local phase. Start with 1 material token and 0 points. A reserve holds 4 more material tokens; the consumed area is empty and the station is not tuned. Three personal action cards begin face up:

- **Record:** take 2 material tokens from the reserve. This is unavailable if fewer than 2 remain there.
- **Broadcast:** move 1 of your material tokens to the consumed area and immediately score 3 points. You need a token to do this.
- **Tune:** spend no material and mark the station as tuned. Every subsequent broadcast scores 5 points; previously earned points do not change. You may tune only once this phase.

All information is public, with no random outcomes. For each action, choose a face-up card whose conditions you meet, resolve it completely, and turn it face down. Face-down cards cannot be chosen. Two choices require no card: **retrieve**, turning all face-down cards face up, provided at least one is face down; and **wait**, changing nothing. Each takes one whole action. Retrieving does not let you immediately play another card.

The phase ends after exactly four actions. Record earned points; leftover material scores nothing. Material never refills or returns automatically, and used cards do not automatically recover. No larger game's victory condition is assumed.

## Broadcast first, or tune first?

Run each route from the initial state. Numbers below mean “material held / cumulative points.”

| Action number | Route A | Result | Route B | Result |
| --- | --- | --- | --- | --- |
| 1 | Broadcast | 0 / 3 | Tune | 1 / 0 |
| 2 | Retrieve | 0 / 3 | Record | 3 / 0 |
| 3 | Record | 2 / 3 | Broadcast | 2 / 5 |
| 4 | Broadcast | 1 / 6 | Retrieve | 2 / 5 |

Route A ends with Record and Broadcast face down and Tune face up. The reserve holds 2 tokens and the consumed area holds 2. Route B ends with all cards retrieved, 2 tokens in reserve, and 1 consumed. The station remains tuned: retrieving Tune does not permit another tune. Both routes account for all 5 original material tokens.

Tuning improves each broadcast's value without improving this route's total. Starting with only 1 material, tuning and broadcasting twice also require recording and retrieval: five actions, exceeding the four available. Under the original rules, the phase's maximum is 6 points. Routes that include tuning can score at most 5.

## Change only whether a used card turns face down

Reset the starting state. Change one rule: cards now stay face up after use. Costs, effects, the four-action limit, and tuning only once remain unchanged. Record, tune, broadcast, broadcast is now legal. Material held progresses through 3, 3, 2, 1, while points progress through 0, 0, 5, 10. All cards finish face up; the reserve holds 2 tokens and the consumed area holds 2.

Under the original rules, the same first three actions—record, tune, broadcast—also leave 2 material tokens. However, Broadcast is face down. You can retrieve on action four, but cannot broadcast again, finishing on only 5 points. The difference is not additional material. It is whether an action remains available when its cost is affordable.

This single-player phase contains no competition for shared opportunities. It cannot establish that restricting actions increases interaction between players. A shared action pool would additionally need rules for selection order, available copies, and what remains after someone else chooses.

## Which conditions change the tradeoff?

Restore the face-down rule and change only the initial material from 1 token to 2. Tune, broadcast, retrieve, broadcast is now legal. It ends on 10 points, with no material held, 4 tokens still in reserve, 2 consumed, and Broadcast face down. Omitting Record makes the plan fit into four actions.

“Upgrade first” is therefore neither always right nor always wrong. The relevant comparison is whether preparation, resupply, restored access, and scoring fit within the available actions. Comparing only the 3-point and 5-point broadcasts misses the opportunities consumed by other actions.

An action system can make opportunities visible, but it can also require repeated checks of cards, resources, and conditions. More action names do not guarantee more worthwhile decisions. If an action is consistently worse under the current objective, acknowledge that before deciding whether to change the conditions.

## Check: does being able to pay guarantee access?

Use the original rules and start with 1 material token. Your first three actions are record, tune, broadcast. Can your fourth action spend another token to broadcast? Can you retrieve and immediately broadcast?

**Neither is legal.** You hold 2 material tokens, but Broadcast is face down. Retrieval itself uses the last action. If you retrieve, you finish on 5 points with 2 material tokens, all cards face up, and the station still tuned. Restoring an action's availability does not automatically perform it.

## Bring the question to your design

Choose an action for which a player says, “I want to, but I cannot.” Check separately whether it is offered, affordable, permitted by its prerequisites, and still possible within the remaining opportunities. This distinguishes changing the action from changing access or explaining conditions more clearly. During observation, record where players actually pause. These calculations do not report difficulties experienced by real players.

## Sources and scope

Conceptual research draws on Geoffrey Engelstein and Isaac Shalev, *Building Blocks of Tabletop Game Design: An Encyclopedia of Mechanisms*, second edition, CRC Press, 2022, chapter 3, “Actions”: ACT-01, “Action Points”; ACT-02, “Action Drafting”; and ACT-03, “Action Retrieval.” These sections distinguish action content from how actions are offered and discuss budgets, shared opportunities, and personal action recovery. The radio rules, values, routes, and conditional comparisons are original analysis.

This overview spans mechanisms and is not assigned a single BGG category. Continue to the action-points entry for budgets, or compare the worker-placement entry for access to public spaces.
