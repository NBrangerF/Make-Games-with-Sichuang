# Compare Two Games: What Does the Player Know Before Playing?

When a card fits successfully on the table, you might conclude that the player judged correctly. Rewind to the decision. What did that player know then? What was still undecided? Success can follow sufficient information, or simply a favorable outcome.

We will use **6 nimmt!** and **Hanabi** to examine one question: **How much can a player determine about the consequences before committing a card?** Both use cards, but their goals differ. In the first, players try to collect fewer bullheads as penalties; in the second, they cooperate to complete five colored fireworks. We will compare information within a decision, without ranking whole-game scores or difficulty.

The following situations are original constructions under the specified base rules. They do not change those rules or add anything to the crossing game. Each observation stops at a stated point; the actual games would continue.

## 6 nimmt!: You know your card. What is missing?

Two players each have eight cards in hand and no collected cards. Hold A's choice at 25 and compare B selecting 23 or 35 from the same hand, without A knowing which. Both choose one card face down, reveal together, and resolve the cards from lowest to highest. Numbers are unique, so there is no equal-number tie here.

The four rows are shown below. Parentheses give each card's bullhead count.

| Row | Left to right |
|---|---|
| A | 5 (2), 8 (1) |
| B | 12 (1), 15 (2), 18 (1), 20 (3) |
| C | 40 (3) |
| D | 70 (3) |

A card must follow the row-end card that is lower than it and closest in value. If that row already has five cards, the player collects those five and leaves the played card to begin the row again. Collected cards enter the player's bull pile, never their hand; their bullheads become penalties when the round is scored. A card lower than every row end requires collecting a chosen row instead. Neither sequence here triggers that rule.

**Sequence one: B plays 23.** It follows 20 first, making row B five cards long. A's 25 is next. The closest lower row end is now 23, so A must use row B. A collects 12, 15, 18, 20, and 23, adding `1 + 2 + 1 + 3 + 1 = 8` bullheads. The 25 stays on the table; its own two bullheads are not collected.

**Sequence two: reset the table and have B play 35 instead.** The 25 follows 20 first as the fifth card, so A collects nothing. The 35 must then follow 25. B now collects 12, 15, 18, 20, and 25, adding `1 + 2 + 1 + 3 + 2 = 9` bullheads. The 35 becomes the new start of row B.

Stop observing after both cards resolve. Each hand falls from eight cards to seven, without drawing replacements; rows A, C, and D remain unchanged. In sequence one, row B contains only 25 and A has added eight bullheads. In sequence two it contains only 35; A has added zero and B has added nine.

A knows the chosen 25 and sees the same starting table in both sequences. The missing information is B's unrevealed action and when it will update the table. One currently empty slot does not reserve that slot for A. These sequences assign no probabilities to B choosing 23 or 35, so they do not establish a fifty-fifty chance of A collecting a row.

## Hanabi: What does a successful play leave unproven?

Again there are two players: Mia acts, followed by Leo. Each color must follow the sequence 1, 2, 3, 4, 5, without skipping or repeating a value. Each holds five cards facing outward, seeing their own card backs. The red firework contains only a red 1; the other colors have not started. Three clue tokens are available, no mistake tokens have been used, 39 cards remain in the deck, and the discard pile is empty.

For us to inspect the situation, here is Leo's hand from left to right: **red 2, green 1, yellow 4, white 5, red 4**. Leo cannot see those faces. He remembers an earlier complete number clue: only his first card is a 2. His hand has not changed since then. Its color remains unknown to him; other public information has not ruled out a blue 2, for example.

Giving a clue takes Mia's entire action and spends one clue token. She names one color or one number, indicating every matching card together. Leo still makes his own decision afterward. This example uses only the literal information in clues, without extra codes, emphasis, or an agreement that her choice of clue means he should play a particular card.

**Sequence one: Mia clues red.** She must indicate the first and fifth cards. Available tokens fall from three to two; the fireworks do not change. Leo combines “my first card is a 2” with “my first card is red.” It fits after the red 1. He plays it, advancing the red firework to 2.

**Sequence two: reset the situation and have Mia clue 4 instead.** She must indicate the third and fifth cards, again spending one token. Leo still knows only that the first card is a 2; its color remains unresolved. If he nevertheless plays that first card, it really is the red 2, so red again advances to 2. Success does not establish that he knew the card would fit. A blue 2, still consistent with his information, would not fit because the blue firework has no 1 yet.

A card that does not fit is discarded and adds a mistake; the third mistake ends the game immediately. Both actual sequences here succeed, leaving zero mistakes. Leo then draws without looking at the new face. To keep the comparison fixed, the replacement is a yellow 1 in both sequences. The deck falls from 39 to 38 cards and his hand returns to five. Stop observing after this draw: red is at 2, two clues remain, and there are no mistakes in either sequence, but the information supporting the plays differed.

The second sequence is not a recommended move, and we have assigned no probability of guessing correctly. It demonstrates that **the same successful outcome does not establish the same information before the decision**. Here the clue leaves the fireworks unchanged and its recipient acts next. This does not mean Hanabi's table remains unchanged across all turns.

## Turn the comparison into a claim you can check

Now place the two situations alongside each other.

| What to examine | This 6 nimmt! situation | This Hanabi situation |
|---|---|---|
| What does the decision-maker know? | The chosen 25 and the current four rows | The target card is a 2, plus the public fireworks |
| What is missing? | The opponent's choice and its effect during resolution | The target card's color |
| What can complete the picture? | Reveal and update the rows, after commitment | Receive a complete color clue before playing |
| What would the outcome alone conceal? | A's choice can stay fixed while the opponent changes its cost | Successful plays can have different informational support |

First locate the decision in time. Then list the information available to that player, and finally resolve the outcome. This produces a chain you can check. Competition and cooperation give background, but do not by themselves explain this decision. Eight bullheads and one step of fireworks are different kinds of results; their size cannot establish which game is fairer or more enjoyable.

These situations support rule analysis, without proving why their designers chose the rules. To compare people's understanding, also observe how they explain possible consequences before committing. The final success or failure is insufficient.

## Check your understanding—with answers

**B replaces 23 with 24 while A still plays 25. What happens?** The 24 fills the fifth position first, so A still collects five cards. The 24 has one bullhead, leaving the added total at eight. The relevant relationship is a lower card filling the row first; the number need not be exactly 23.

**Leo knows only that his first card is a 2. Does successfully playing it prove that the clues were sufficient?** No. The second sequence is a counterexample: the actual red 2 succeeds, while his information still allows an unplayable blue 2. Evaluate information by returning to what could be ruled out before the play.

## Official rules and scope

- [AMIGO: 6 nimmt! English base rules, Version 2.10](https://blog.amigo-spiele.de/content/ap/rule/04910-GB-AmigoRule.pdf): page 1 covers selection, ascending order, lowest difference, and full rows; page 2 covers low cards, bullheads, and round-end scoring. This lesson does not use the Pro Variant.
- [Cocktail Games: Hanabi French base rules, 2019](https://www.cocktailgames.com/wp-content/uploads/2016/03/Hanabi_regles_0519_BD.pdf): pages 2–5 cover hand orientation, clues, play, and sequences; page 6 covers ending; page 8 permits groups to set their communication conventions. This lesson uses the literal-clue approach specified above, without calling it the only permitted convention for every group.
