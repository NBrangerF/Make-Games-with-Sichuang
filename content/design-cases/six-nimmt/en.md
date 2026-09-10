# 6 nimmt!: Why Did Your Safe Space Disappear?

You see a row with four cards. Yours would be the fifth, which looks safe. But after everyone reveals their choices, another player’s smaller card enters that row first. Yours becomes the sixth, forcing you to collect the previous five. Your decision has stayed the same while the situation it faces has changed.

6 nimmt! offers a clear design question: **when players choose simultaneously but resolve their choices in sequence, how can one decision affect another?** This analysis uses the ordinary base rules, without anniversary special cards.

## Angle one: choose together, resolve by number

Each player has ten cards, and the table has four rows. Everyone secretly chooses one card. Once all have chosen, reveal them together and place them in ascending numerical order. Resolving first depends on the number chosen, rather than where someone sits. [AMIGO’s official overview](https://www.amigo-spiele.de/6-nimmt_4910_1124)

A card must follow a lower row-ending card, using the row with the smallest numerical difference. A sixth card makes its owner collect the preceding five and start a new row with their played card. Collected bullheads are penalty points; the lowest total wins. A card below every row ending instead makes its owner choose a row to collect and replace. [AMIGO’s English base rules](https://blog.amigo-spiele.de/content/ap/rule/04910-GB-AmigoRule.pdf)

Choosing a card and determining its destination are therefore separate. You usually control the first, while the second follows the rules after everyone reveals. You cannot move to a roomier row simply because the required row has become inconvenient.

## A constructed situation: one 48, two destinations

The following two-player situation is constructed for this analysis, not taken from a playtest. The four rows currently contain:

| Row | Cards, from left to right |
| --- | --- |
| A | 12, 20 |
| B | 30, 35, 40, 44 |
| C | 60 |
| D | 80 |

Lan secretly chooses 48. On the current table, it belongs after 44 as the fifth card in row B. She does not know her opponent’s choice.

Suppose the opponent chooses 46. It resolves first, making row B contain 30, 35, 40, 44, and 46. When 48 resolves, B is still its required row, but now it triggers collection. Lan takes those five cards for 3 + 2 + 3 + 5 + 1 = 14 penalty points. Her 48 stays on the table and is not part of that penalty. The apparently safe fifth space was never reserved for her.

Reset to the original table for another comparison. Suppose the opponent plays 10, which is below all four row endings, and chooses to collect row B. The 10 becomes its new starting card. The opponent pays the old row’s 3 + 2 + 3 + 5 = 13 penalty points; this is a possible choice, not a claim about optimal play. The row endings are now 20, 10, 60, and 80. Lan’s 48 must follow 20, becoming the third card in row A. This time, the opponent has changed which row receives her card.

Lan chose 48 in both branches. The difference comes from smaller cards resolving first and each resolution immediately updating the table used by later cards. If everyone placed cards against the old, pre-reveal table, these consequences would not unfold in the same way.

## Angle two: a shorter row can cost more to collect

Set up another two-player situation: row A holds only 55; B holds 12, 13, and 14; C holds 60; D holds 80. The revealed cards are your 10 and your opponent’s 90. Your 10 resolves first and is below every row ending, so you must choose a row to collect. Compare these two legal choices, stopping after 90 resolves without deciding the whole game’s winner.

| Row restarted with your 10 | Your collection and penalty | Where 90 then goes |
| --- | --- | --- |
| A | One card, 55: 7 points | After D’s 80; no collection by the opponent |
| B | 12, 13, 14: 1 + 1 + 1 = 3 points | After D’s 80; no collection by the opponent |

The unchosen row and row C stay unchanged. The special value of 55 combines its repeated digits and ending in 5; bullhead values are on [rulebook page 2](https://blog.amigo-spiele.de/content/ap/rule/04910-GB-AmigoRule.pdf). Counting cards gives one versus three. Counting the cost gives seven versus three. Taking fewer cards can mean a larger penalty.

You may choose the row because 10 is below all four endings. A card that can follow a row still obeys the lowest-difference rule; a cheaper alternative does not authorize a change of destination. A penalty system has separate questions about what triggers a loss, how large it is, and who chooses it. Choosing B saves four points in this batch; that does not establish its value in every later situation.

## Angle three: an unseen card may be held—or absent from the round

The base game deals ten of its 104 cards to each player and four more to start rows, setting the remainder aside for the entire round. A two-player deal leaves 80 unused; a ten-player deal leaves zero. That is 104 − 10 × players − 4, not a difficulty rating. Never having seen 46 does not establish that an opponent holds it. [Base rules, page 1](https://blog.amigo-spiele.de/content/ap/rule/04910-GB-AmigoRule.pdf)



Row endings and lengths are public. Players can examine which numbers might enter ahead of them and which rows are close to full. But “it fits safely now” is not equivalent to “it will still fit safely when mine resolves.” With more players, more revealed cards may resolve before yours. That changes the possible interference; it does not establish a fixed probability of failure.

A low card is not always safe either. A card below every row ending still forces collection. Nor is a higher card always dangerous: after a smaller card clears a full row, a higher one may enter the new, short row. The judgment depends on the table and others’ choices, rather than a permanent safe-or-dangerous label attached to a number.

For a design comparison, imagine letting each player choose only after seeing cards already placed by earlier players. The same 48 would no longer need to be committed against an old table; its owner would gain an opportunity to adjust. This change could still create competition, but would ask for a different judgment from simultaneous choice. It is not a base-game rule.

The transferable design idea is the process: commit to an action, then let successive updates to a shared situation determine its consequences. In a design about parking spaces, flight schedules, or market stalls, ask: what can players see before committing? Can they understand the resolution order? How does an earlier action change later legal destinations? After an unwanted result, can they follow the updates and understand why it happened?

Simultaneous choice still needs a clear resolution procedure. Here, that procedure itself creates interaction.

## The designer’s account: remove the passing, keep the consequence

In AMIGO’s 25th-anniversary interview, Kramer recalls an early design involving suitcases passed between players, carrying unwanted goods. The person adding a sixth item kept the case. The cases later became rows, passing was removed, and a sixth card still triggered collection and penalties. [Kramer’s interview](https://blog.amigo-spiele.de/wolfgang-kramer/)

This records an actual structural revision. Our design question is whether removing an action can leave its consequence working through another process. In the published game, shared rows and ascending resolution still transmit consequences between players. That is our reading of the current rules. The interview neither proves simultaneous choice superior to passing suitcases nor supplies a complete earlier ruleset to reproduce.

## Check your understanding

1. After 46 enters the first example, does 48 itself contribute to the 14-point penalty it triggers? **No. It starts the new row; the previous five cards supply the penalty.**
2. Is collecting only 55 cheaper than collecting 12, 13, and 14? **No: seven points is four more than three. Count bullheads.**
3. In a two-player base game, can you treat an unseen 46 as necessarily available to the opponent and assign a fixed play probability? **No. Eighty cards were left out, and both the actual hand and the opponent’s choice policy remain unknown.**

## Rules and designer sources

- [AMIGO: English base rules, Version 2.10](https://blog.amigo-spiele.de/content/ap/rule/04910-GB-AmigoRule.pdf): pages 1–2, choosing, placing, collecting, and bullhead penalties.
- [AMIGO: 6 nimmt! product and gameplay overview](https://www.amigo-spiele.de/6-nimmt_4910_1124): basic sequence; promotional statements are not treated as evidence of player experience.
- [AMIGO: Wolfgang Kramer’s 25th-anniversary interview](https://blog.amigo-spiele.de/wolfgang-kramer/): his answer about the origin of 6 nimmt!, suitcases, removing passing, and sixth-card collection. Anniversary special cards are excluded.
