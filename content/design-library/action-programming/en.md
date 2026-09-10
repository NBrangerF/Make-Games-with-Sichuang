# Action programming: a planned sequence does not guarantee successful steps

You have committed to “assemble a large piece, collect materials, assemble a small piece.” By the time you collect, someone else has emptied the shared supply. Whether you can change actions depends on whether the rules still allow a choice. **Action programming moves the choice of sequence ahead of execution: players submit a plan, then process its actions in order.** Track what is known at commitment, what is checked at execution, and what follows a failure.

## Committing to actions does not necessarily secure their results

This page focuses on players arranging several future actions before executing them in order. Programming might allow an action that is currently unaffordable, because earlier actions could provide resources. Alternatively, rules could require its conditions to be met when programmed. These are different rules; readers should not have to guess.

In chapter 3, ACT-06, “Action Queue,” Engelstein and Shalev identify advance commitment to an execution sequence as central. They distinguish programming a batch from executing the queue's head while adding to its tail. Revelation and resolution can also vary. Our example uses personal queues, batch submission, and interleaved execution, with its rules specified below. [Book reference](https://doi.org/10.1201/9781003179184)

## Fastener workshop: three slots each

This is an original local phase for two players. Lin and Jo each start with 1 fastener token and 0 points. A shared reserve holds 2 fasteners, and the consumed area is empty: only 4 fasteners exist. Everything except unrevealed plans is public. There are no random events, refills, or loans. Each player has their own copy of three different action cards:

| Action card | Conditions and effects at execution |
| --- | --- |
| Collect | If at least 2 fasteners remain in reserve, take exactly 2 as your own. Otherwise fail; taking just 1 is not allowed. |
| Assemble large | If you hold at least 2 fasteners, pay 2 into the consumed area and immediately score 5 points. |
| Assemble small | If you hold at least 1 fastener, pay 1 into the consumed area and immediately score 2 points. |

Both players simultaneously and secretly order their three cards, using each exactly once in slots 1, 2, and 3. Cards cannot be duplicated and slots cannot be empty. Programming neither checks affordability nor prepays costs. Once both have committed, reveal every card at once. Cards cannot be replaced or reordered, and no substitute action may be chosen.

Process Lin's slot 1, then Jo's slot 1; Lin's slot 2, then Jo's slot 2; and finally Lin's slot 3, then Jo's slot 3. Lin always goes first within a slot. Each action resolves completely, so there is no simultaneous claim to break. Check fasteners only when each card is reached. **Failure costs no fasteners and scores nothing, but uses that slot; the player's later slots still proceed.** End after all six slots have been processed and record both scores. Leftover material scores nothing, and neither cards nor fasteners recover. No other game's victory condition is assumed.

## The same three cards: assemble first or collect first?

To compare sequences, fix Jo's plan as “collect, assemble small, assemble large” and run each of Lin's plans from the initial state. Jo's plan is shown to the reader for checking; Lin does not know it when committing.

Lin's plan A is “assemble large, collect, assemble small.” Holdings and cumulative scores below are always “Lin / Jo.”

| Resolution order | What happens | Fasteners held | Points |
| --- | --- | --- | --- |
| 1: Lin assembles large | Only 1 held; fails | 1 / 1 | 0 / 0 |
| 2: Jo collects | Takes 2 from reserve, emptying it | 1 / 3 | 0 / 0 |
| 3: Lin collects | Reserve empty; fails | 1 / 3 | 0 / 0 |
| 4: Jo assembles small | Pays 1 | 1 / 2 | 0 / 2 |
| 5: Lin assembles small | Pays 1 | 0 / 2 | 2 / 2 |
| 6: Jo assembles large | Pays 2 | 0 / 0 | 2 / 7 |

Lin's plan B is “collect, assemble large, assemble small.” Jo keeps the same plan.

| Resolution order | What happens | Fasteners held | Points |
| --- | --- | --- | --- |
| 1: Lin collects | Takes 2 from reserve, emptying it | 3 / 1 | 0 / 0 |
| 2: Jo collects | Reserve empty; fails | 3 / 1 | 0 / 0 |
| 3: Lin assembles large | Pays 2 | 1 / 1 | 5 / 0 |
| 4: Jo assembles small | Pays 1 | 1 / 0 | 5 / 2 |
| 5: Lin assembles small | Pays 1 | 0 / 0 | 7 / 2 |
| 6: Jo assembles large | No fasteners held; fails | 0 / 0 | 7 / 2 |

Both routes finish with nothing in reserve or either player's hand, and all 4 fasteners consumed. Lin changes from 2 points to 7, while Jo changes from 7 to 2; the total is 9 in both routes. The difference is who can still obtain material when Collect executes. In A, Lin cannot spend a possible future collection on slot 1 or reorder after seeing Jo empty the reserve.

## Change only whether execution continues after failure

Reset the initial state and retain both queues from plan A. Change just the failure rule: **a player's first failed card cancels all of that player's remaining slots in this batch.** The failed action still costs nothing and scores nothing. The opponent proceeds normally, and canceled cards have no effect.

Lin fails to assemble large in slot 1, canceling both Collect and Assemble small. Jo collects, assembles small, and assembles large. Jo's fasteners progress through 3, 2, 0, with cumulative points of 0, 2, 7. End when both players' third slots have been processed. Lin has 0 points and still holds 1 fastener; Jo has 7 points and holds none. The reserve is empty and 3 fasteners are consumed, accounting for all 4.

Compared with the original plan A, Lin loses the small assembly that could still have succeeded, and its 2 points. There is no additional material penalty. Whether failure cuts off later actions is a separate rule decision; advance commitment does not itself impose that punishment.

## Boundaries with nearby mechanisms

Simultaneous selection may concern only the next action, without committing to several later ones. This example combines simultaneous selection with programming, and imposes no real-world countdown for arranging cards. Its actions are not movement: a program needs neither a map nor facing directions.

The players share fasteners but each has a separate queue. A shared resource is different from a shared action queue executed by everyone. Allowing players to pay for revisions would require further rules: before revelation or before a particular step, how many cards may change, and whether a failed card can be rescued. This example grants no such permission.

The two routes compare outcomes against one specified Jo plan. They do not search all opposing plans or prove that Lin should always collect first. Supply, priority, or revision rights could change the result. These calculations also cannot establish which failure rule real players prefer.

## Check: which moment matters?

1. Can Lin put Assemble large in slot 2 while holding only 1 fastener during programming? **Yes.** Affordability is not checked during programming. In plan B, Lin holds 3 when slot 2 executes and retains 1 after paying 2.
2. Can Collect take the last fastener when only 1 remains in reserve? **No.** It requires taking the full 2. The remaining fastener stays in reserve after failure.
3. After Lin fails in slot 1 of plan A, does the final small assembly still execute under the original rule? **Yes, scoring 2 points.** It is canceled only under the “first failure cancels remaining slots” variant. Neither rule charges material for failure.

## Sources and scope

The core source is Geoffrey Engelstein and Isaac Shalev, *Building Blocks of Tabletop Game Design: An Encyclopedia of Mechanisms*, second edition, CRC Press, 2022: chapter 3, ACT-06, “Action Queue” (EPUB anchor `filepos237689`), and ACT-07, “Shared Action Queue” (`filepos244790`); chapter 10, MOV-10, “Programmed Movement” (`filepos893645`). Their descriptions and discussions were read. The workshop's rules, values, sequences, and one-rule comparison are original analysis. [Bibliographic reference and DOI](https://doi.org/10.1201/9781003179184)

The Description of [BGG 2689: Action Queue](https://boardgamegeek.com/boardgamemechanic/2689/action-queue) was checked. It also covers rolling, shared, and fixed printed queues, and gives movement-only queues a separate entry. This page focuses on the narrower design question of players committing to the order of several actions. The mapping remains “related”; BGG's Action Queue and this library's action programming are not treated as interchangeable names.
