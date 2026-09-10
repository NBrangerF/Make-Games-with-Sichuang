# Time track: how far you move decides who acts next

“This action costs 4 time” can mean subtracting from a budget, or letting someone else act several times. **A time track converts action costs into forward movement, then gives the next action to the player furthest back.** Positions are checked after every action, so one player may act repeatedly. The track must determine action order: merely recording the current round is outside this page's scope.

## A cost also changes access to the next action

Read the action's effect, move your marker forward by its cost, then check who is furthest back. “Back” means a lower numbered space, not a lower score. A tie rule is also necessary when markers share a space; without it, the next action cannot be assigned.

In chapter 2, TRN-13, “Time Track,” Engelstein and Shalev discuss pricing actions by duration, while noting that a long action may leave a player waiting through other actions before participating again. They also examine ways to resolve shared spaces. This page reduces that question to three public job cards, calculating how short actions, long actions, and ties jointly determine allocation. [Book reference](https://doi.org/10.1201/9781003179184)

## Theater maintenance: three jobs and a six-space deadline

This is an original local phase for two players. The time track has integer spaces 0–6. Lin starts at 0, Jo at 2, and both have 0 points. Jo is already at 2: Lin moving there later counts as the later arrival. Starting positions are given conditions of this phase; earlier activities are not calculated. Everything is public, with no random results or hidden plans.

| Public job | Copies | Time cost | Immediate points |
| --- | --- | --- | --- |
| Large repair | 1 | 4 | 7 |
| Small calibration | 2 | 2 | 3 |

Jobs have no other costs. On your action, choose a job still in the public area whose full time cost you can afford. Move its card to your completed area, score immediately, and advance your marker by its cost. Each card can be completed only once and no jobs refill. Jobs resolve immediately here; rewards are not delayed until other markers catch up.

You may instead **rest**: advance 1 space for 0 points without taking a card. Rest can be repeated. No action may move beyond 6, and partial payment is forbidden. There is no free wait that leaves your marker still.

After each action, the player at the lowest position among those still short of 6 acts. On a shared space, **the last player to arrive there acts first**. A player at 6 leaves the phase and cannot gain another action through a tie. End when both reach 6 and record their scores. Remaining jobs award nothing; arriving at 6 first does not determine victory. There are no other end bonuses in this local phase.

## Start with the large job or a small one?

Reset the initial state for each of Lin's opening choices. To make the continuation reproducible, fix both players' subsequent choices: take the large job if available and legal, otherwise a small job if available and legal, otherwise rest. The small cards are identical, so either may be taken. This specifies routes without removing other legal choices or claiming optimal play.

Route A: Lin starts with the large repair. Positions and cumulative points are always “Lin / Jo.”

| Step | Action | Positions | Points | Why this player acts next |
| --- | --- | --- | --- | --- |
| 1 | Lin repairs large; cost 4 | 4 / 2 | 7 / 0 | Jo is lower, at 2 |
| 2 | Jo calibrates small; cost 2 | 4 / 4 | 7 / 3 | Jo arrived at 4 last, so Jo acts again |
| 3 | Jo takes the other small job; cost 2 | 4 / 6 | 7 / 6 | Jo leaves; Lin acts |
| 4 | Lin rests; cost 1 | 5 / 6 | 7 / 6 | Only Lin remains active |
| 5 | Lin rests; cost 1 | 6 / 6 | 7 / 6 | Both have left; end |

Route B: Lin starts with a small job; all subsequent choice instructions stay the same.

| Step | Action | Positions | Points | Why this player acts next |
| --- | --- | --- | --- | --- |
| 1 | Lin calibrates small; cost 2 | 2 / 2 | 3 / 0 | Lin arrived at 2 last, so Lin acts again |
| 2 | Lin repairs large; cost 4 | 6 / 2 | 10 / 0 | Lin leaves; Jo acts |
| 3 | Jo takes the other small job; cost 2 | 6 / 4 | 10 / 3 | Only Jo remains active |
| 4 | Jo rests; cost 1 | 6 / 5 | 10 / 3 | Jo acts again |
| 5 | Jo rests; cost 1 | 6 / 6 | 10 / 3 | Both have left; end |

Both routes complete all three jobs. In A, Lin completes the large job and Jo both small jobs. In B, Lin completes one large and one small job, while Jo completes one small. Total points remain 13, but their distribution changes from 7 / 6 to 10 / 3.

Lin can advance 6 spaces and Jo 4, for 10 in total. Each route spends 4 + 2 + 2 = 8 on jobs and 2 on two rests. All three cards move from the public area into completed areas; no time or job card appears from nowhere. Starting small still secures the large job in B because the tie rule gives Lin the next action upon landing on Jo's space.

## Change only who acts first on a shared space

Reset route B's initial state. Lin still starts small and subsequent choices stay the same. Change only the tie rule: **the earlier arrival at a space acts first**.

1. Lin spends 2 time on a small job. Positions are 2 / 2 and points 3 / 0. Jo was at 2 earlier, so Jo now acts.
2. Jo spends 4 on the large repair. Positions are 2 / 6 and points 3 / 7; Jo leaves the phase.
3. Lin spends 2 on the remaining small job. Positions are 4 / 6 and points 6 / 7.
4. Lin rests twice, reaching 5 and then 6. Final positions are 6 / 6 and points remain 6 / 7.

Lin finishes with both small cards, Jo with the large card, and the public area is empty. Jobs still cost 8, rests still cost 2, and total points remain 13. Changing only the tie rule changes route B's distribution from 10 / 3 to 6 / 7. A short action alone does not guarantee another action immediately; current distances, destinations, and tie handling matter together.

## Which conditions support these conclusions?

Here, time positions determine order and action effects resolve immediately. Under fixed alternating turns with time used only as a personal budget, the consecutive actions would no longer come from a time track. A real sand timer limiting seconds of thought would introduce real-time pressure, which this example does not use.

Do not convert “wait through two other actions” directly into real minutes: this page measures no thinking time. Nor does a large job's 7 points versus a small job's 3 establish that it is the better choice. Taking the large job may hand over the next action, changing who obtains the remaining cards.

Changing starting distances, costs, rewards, supply, or ties requires recalculating the whole sequence. Advancing at least 1 each action, with a cap at 6, guarantees this phase ends within at most 10 actions. Free waiting without movement would remove that termination guarantee.

## Check: who can still act?

1. Why does Lin act again after route B's first step? **Lin has just arrived at Jo's space, 2, and the original rule gives priority to the later arrival.** With earlier-arrival priority, Jo acts instead.
2. At 5 with a small job still available, can you take it? **No.** Its full cost of 2 exceeds the endpoint. You must rest for 1 here; the job's cost cannot be clipped to 1.
3. Can Jo, already at 6, use a tie to take another job? **No.** Reaching 6 means leaving the phase; ties are considered only among active players. Arriving first also awards no extra points.

## Sources and scope

The core source is Geoffrey Engelstein and Isaac Shalev, *Building Blocks of Tabletop Game Design: An Encyclopedia of Mechanisms*, second edition, CRC Press, 2022, chapter 2, “Turn Order and Structure,” TRN-13, “Time Track” (EPUB anchor `filepos187159`). Its description and discussion were read, including costs, consecutive actions, and tie variants. All theater jobs, values, routes, and the one-rule comparison are original analysis. [Bibliographic reference and DOI](https://doi.org/10.1201/9781003179184)

The Description of [BGG 2663: Turn Order: Time Track](https://boardgamegeek.com/boardgamemechanic/2663/turn-order-time-track) was checked. This page uses a same-scope mapping: the furthest-back player acts, advances by the selected action's cost, and order is checked again. That description explicitly excludes time trackers that do not determine turn order. Ending at 6 and prioritizing later arrivals are this example's implementation choices, not mandatory features of the category.
