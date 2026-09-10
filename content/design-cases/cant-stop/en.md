# Can’t Stop: Why Does the Same Handful of Dice Become Harder to Put Down?

After rolling, you can choose how to pair the dice. After advancing, you can choose to stop. These decisions are connected: the columns chosen earlier determine which numbers remain useful, while this turn’s accumulated progress determines how much a failure would cost. Can’t Stop puts both decisions inside one sequence of actions.

This analysis uses the **Ravensburger 2007 base edition, product number 26 434 6**, excluding its three variants. It supports two to four players; the first to win three columns wins. Both two-player situations below were constructed for this article to trace consequences. They are neither playtest records nor complete instructions. Ravensburger authored the rulebook; the linked mirror states that it hosts the rules with publisher permission. [Rulebook, pages 1 and 4](https://www.brettspiele-report.de/images/cant_stop/Spielanleitung_Can_t_Stop.pdf)

## Angle one: you can change the pairing, but cannot reassign your three runners

Divide four dice into two pairs; each sum identifies a column. Three white runners track temporary progress this turn. Once all are placed, only their columns remain available. Use both pairs when the chosen pairing permits it, but these base rules allow choosing a pairing that advances only one runner. [Rulebook, page 2](https://www.brettspiele-report.de/images/cant_stop/Spielanleitung_Can_t_Stop.pdf)

Consider situation A. Neither player has won a column, so all columns remain open. It is Lan’s turn. Her banked positions are space 1 in column 5, space 2 in column 7, and space 1 in column 9; she has no markers elsewhere. After earlier rolls this turn, the white runners stand at spaces 3, 4, and 2 in those columns. All three runners are in use. Her opponent’s banked positions are space 1 in column 2, space 2 in column 8, and space 1 in column 11, with no other markers.

Count spaces upward from the bottom, starting at 1; absence from a column counts as 0. Lan rolls **1, 2, 4, 6**. Using each die once gives three pairing structures:

| Pairing and sums | What this situation permits | Resulting runner positions in columns 5, 7, 9 |
| --- | --- | --- |
| 1 + 2, 4 + 6 → 3 and 10 | Neither column has a runner, and none is available to enter; this cannot supply a legal move | No legal movement |
| 1 + 4, 2 + 6 → 5 and 8 | Advance column 5 once; no runner can enter column 8 | 4, 4, 2 |
| 1 + 6, 2 + 4 → 7 and 6 | Advance column 7 once; no runner can enter column 6 | 3, 5, 2 |

Lan may choose the second or third row. She cannot transfer the column 9 runner into column 8. Nor can she take the 5 from one pairing and the 7 from another: that would reuse a die. The unused pair is not stored for a future roll.

Both legal choices add just one space, but Lan still chooses where it goes. Her options depend on the occupied runners as well as the dice. This gives a designer a concrete kind of commitment to inspect: a route chosen earlier continues to constrain later actions. Allowing runners to move freely between columns after every roll would let the same dice keep opening new routes, weakening that commitment. That would be a proposed change requiring its own test.

## Angle two: stopping banks this turn’s progress; failure returns to the banked positions

In situation A, Lan advances column 5, leaving runners at 4, 4, and 2. She can now stop or roll again. Licensor franjos’s [official overview](https://www.franjos.de/spiel_cant_stop.htm) also describes this cycle of continuing or ending a turn with positions that can be resumed later. It corroborates the core mechanism; the selected 2007 rulebook governs the detailed resolution here.

If Lan stops now, her banked positions become space 4 in column 5, space 4 in column 7, and space 2 in column 9. The runners come off and pass to her opponent for the next turn. None reached a summit, so neither player has won a column.

If she continues, suppose the next roll is **1, 1, 1, 1**. Every pairing produces 2 and 2. Her runners are in columns 5, 7, and 9, and none is available to enter column 2. No movement is possible, so her turn immediately fails. Remove the runners; her banked positions remain 1, 2, and 1. All opposing markers stay where they are. [Rulebook, page 3](https://www.brettspiele-report.de/images/cant_stop/Spielanleitung_Can_t_Stop.pdf)

Account for the lost progress column by column:

| Column | Banked before this turn | Temporary position before rerolling | This turn’s progress lost on failure |
| --- | --- | --- | --- |
| 5 | 1 | 4 | 3 |
| 7 | 2 | 4 | 2 |
| 9 | 1 | 2 | 1 |
| Total | 4 | 10 | 6 |

Failure does not erase all ten accumulated spaces. It discards the six spaces that remain unbanked. Conversely, stopping cannot bank only column 5 while leaving the other runners in play: the whole turn ends. A precise loss boundary tells us what decision the player is actually making.

Also distinguish “more progress to regret losing” from “a greater chance of failure on the next roll.” While the runners remain in columns 5, 7, and 9 and none has reached the top, another space of progress does not change the distribution of four fair, independent dice, or which numbers can move at least one runner. It changes the unbanked progress at stake. A run of successes does not accumulate a failure that must arrive next.

For an exploration prototype with a retreat decision, mark exactly where each failure would return the player, then compare another step with banking now. If every step were banked immediately, this loss boundary would disappear and the reason to stop would change. Whether participants experience tension still requires observation in play; the table cannot establish that response.

## Angle three: columns of different lengths make a reward change the race

On this edition’s board, column 2 has three spaces and column 7 has thirteen, including their numbered summit spaces. Fewer required steps do not imply a better chance of advancing on the next roll. [Board diagrams, rulebook pages 1–2](https://www.brettspiele-report.de/images/cant_stop/Spielanleitung_Can_t_Stop.pdf)

Our independent enumeration of all 1,296 ordered outcomes of four fair, independent six-sided dice found 171 outcomes containing some pair totaling 2, about 13.19%, and 834 containing some pair totaling 7, about 64.35%. This asks only whether such a pair exists in one roll. It does not check runner availability or closed columns, and is not the probability of completing a whole column. Route length and the opportunity to roll its number are different conditions to compare; these figures do not establish equal column values.


Now consider the separate situation B. Again, two players are playing and nobody has won a column. Lan has banked space 1 in column 5, space 11 in column 7, and space 1 in column 9, with no markers elsewhere. This turn’s runners have reached spaces 2, 12, and 2 in those columns. Her opponent has banked space 1 in column 5, space 10 in column 7, and space 1 in column 9, with no other markers.

Lan rolls **1, 1, 2, 6**. Pairing the two ones gives 2 and 8, neither usable. Pairing them separately with 2 and 6 gives 3 and 7, allowing the column 7 runner to move from space 12 to space 13. Exchanging the two identical ones produces no new numerical choice.

Lan has not yet won column 7. If she continues, that runner cannot advance farther or move to another column; only the runners in 5 and 9 can still move. If she then rolls four ones, the resulting 2 and 2 cause failure. Her banked column 7 marker remains at space 11, and her opponent’s remains at space 10. The summit roll did not bank itself.

If Lan instead stops after reaching the summit, she banks spaces 2, 13, and 2 in columns 5, 7, and 9. She wins column 7, and her opponent’s marker in that column is returned. Neither player may enter it again. Lan has won only one column, so play continues; winning a third ends the game immediately. [Rulebook, page 4](https://www.brettspiele-report.de/images/cant_stop/Spielanleitung_Can_t_Stop.pdf)

To isolate the effect of closure, let her opponent roll **3, 3, 4, 4** at the start of the next turn. The usable choice is now 6 and 8: place one runner on space 1 of each column, leaving the third available. The 7-and-7 pairing is unusable because that column is closed. For comparison, before closure, with the opponent still banked at space 10 in column 7, the same dice would also allow 7 and 7, taking one runner to space 12. An option has disappeared; this roll has not become an automatic failure.

Completing a column therefore has two consequences: it advances the winner’s objective and removes a route from everyone’s future play. Banked progress survives a player’s own failed turn, but not someone else winning that column first. When designing a race objective, inspect both what the winner receives and what others can still do afterward. This is our analysis of how these rules work together, not a claim about Sid Sackson’s personal design intentions.

## Check your understanding

1. In situation A, can 1, 2, 4, 6 advance both columns 5 and 7? **No. Those sums belong to different pairings and would reuse a die.**
2. With runners at 4, 4, 2, does continuing into a roll of four ones erase all Lan’s progress? **No. Her banked positions remain 1, 2, 1; the six spaces gained this turn are lost.**
3. In situation B, does reaching space 13 immediately remove the opponent’s marker at space 10? **No. Removal happens when Lan stops and wins the column. Continuing into failure preserves both players’ original banked positions.**
4. After column 7 closes, must 3, 3, 4, 4 cause her opponent to fail? **No. All three runners are available in this example, so 6 and 8 can each receive a runner on space 1.**

## Rules and publisher sources

- [Ravensburger: Can’t Stop!, 2007, product number 26 434 6](https://www.brettspiele-report.de/images/cant_stop/Spielanleitung_Can_t_Stop.pdf): base rules on pages 1–4; page 4’s variants are excluded. Publisher-authored PDF hosted by brettspiele-report.
- [brettspiele-report: rulebook mirror provenance](https://www.brettspiele-report.de/cant-stop/): the “Spielanleitung” section states permission from Ravensburger; used only to document hosting provenance.
- [franjos: official Can’t Stop overview](https://www.franjos.de/spiel_cant_stop.htm): “Das Spiel” corroborates four-dice pairing, three temporary runners, and banking. Current product photos do not substitute for the 2007 edition’s rules.
