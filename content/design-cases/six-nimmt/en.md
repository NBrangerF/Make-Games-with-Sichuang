# 6 nimmt!: Why Did Your Safe Space Disappear?

You see a row with four cards. Yours would be the fifth, which looks safe. But after everyone reveals their choices, another player’s smaller card enters that row first. Yours becomes the sixth, forcing you to collect the previous five. Your decision has stayed the same while the situation it faces has changed.

6 nimmt! offers a clear design question: **when players choose simultaneously but resolve their choices in sequence, how can one decision affect another?** This analysis uses the ordinary base rules, without anniversary special cards.

## Choose together, resolve by number

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

Reset to the original table for another comparison. Suppose the opponent plays 10, which is below all four row endings, and chooses to collect row B. The 10 becomes its new starting card. The opponent pays the old row’s penalty; this is a possible choice, not a claim about optimal play. The row endings are now 20, 10, 60, and 80. Lan’s 48 must follow 20, becoming the third card in row A. This time, the opponent has changed which row receives her card.

Lan chose 48 in both branches. The difference comes from smaller cards resolving first and each resolution immediately updating the table used by later cards. If everyone placed cards against the old, pre-reveal table, these consequences would not unfold in the same way.

## Uncertainty still leaves room for judgment

Row endings and lengths are public. Players can examine which numbers might enter ahead of them and which rows are close to full. But “it fits safely now” is not equivalent to “it will still fit safely when mine resolves.” With more players, more revealed cards may resolve before yours. That changes the possible interference; it does not establish a fixed probability of failure.

A low card is not always safe either. A card below every row ending still forces collection. Nor is a higher card always dangerous: after a smaller card clears a full row, a higher one may enter the new, short row. The judgment depends on the table and others’ choices, rather than a permanent safe-or-dangerous label attached to a number.

For a design comparison, imagine letting each player choose only after seeing cards already placed by earlier players. The same 48 would no longer need to be committed against an old table; its owner would gain an opportunity to adjust. This change could still create competition, but would ask for a different judgment from simultaneous choice. It is not a base-game rule.

The transferable design idea is the process: commit to an action, then let successive updates to a shared situation determine its consequences. In a design about parking spaces, flight schedules, or market stalls, ask: what can players see before committing? Can they understand the resolution order? How does an earlier action change later legal destinations? After an unwanted result, can they follow the updates and understand why it happened?

Simultaneous choice still needs a clear resolution procedure. Here, that procedure itself creates interaction.

## Official sources

- [AMIGO: English base rules, Version 2.10](https://blog.amigo-spiele.de/content/ap/rule/04910-GB-AmigoRule.pdf): pages 1–2, choosing, placing, collecting, and bullhead penalties.
- [AMIGO: 6 nimmt! product and gameplay overview](https://www.amigo-spiele.de/6-nimmt_4910_1124): basic sequence; promotional statements are not treated as evidence of player experience.
