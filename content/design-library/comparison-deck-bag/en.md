# Does replacing a deck with a bag add randomness? Check when items return

Replacing cards with tokens changes their appearance and handling, but it need not change the chance of drawing a type. Match composition, draw rules, and return timing before attributing a difference to the container.

This comparison isolates a draw phase after a pool has been built. No items are bought or removed during the phase. Every version starts with the same four materials.

## Four materials, two rounds of color matching

One player has red materials R1 and R2, blue materials B1 and B2, and 0 points. Numbers distinguish items of the same color for tracking; they add no effect. Each round requires two consecutive draws, revealing their colors. A red-blue pair scores 3 points; a same-color pair scores 1. Score only after both draws. The player cannot stop or replace an item after seeing the first.

The first round's two items stay on the table and do not return. Round two draws the remaining two, scores them, and places them in the used area. The phase ends with both rounds' points added together and all four items in the used area.

For a deck, thoroughly shuffle the four cards so every labeled order is equally likely. Draw from the top without looking at undrawn cards. For a bag, tokens feel identical, and each blind draw gives every remaining token an equal chance. Drawn tokens cannot participate in the next draw. These are fair-draw assumptions for the model. Whether physical components mix easily or can be distinguished by touch requires separate observation.

## Follow two complete sequences

Suppose the shuffled deck is R1, R2, B1, B2 from top to bottom. The first round's two reds score 1. The second round must produce two blues, scoring another 1: **2 points** in total. A bag can produce the same sequence and result.

Now specify R1, B1, R2, B2. Round one produces a red-blue pair for 3 points. Round two does the same, for **6 points** in total. Either container can produce this sequence too.

These are not the only possible orders, nor do they each have a fifty-fifty chance. They first establish what the rules permit. Next, calculate the chances.

## Why do the containers give the same chances?

The deck has 24 equally likely labeled orders. In the bag, any specified first token has a 1/4 chance, a specified next token 1/3, and a specified third token 1/2. Only one remains for the last draw. Every complete specified order therefore has probability `1/4 × 1/3 × 1/2 = 1/24`, matching the deck.

You can also calculate the chance of different colors in round one directly. Red then blue has probability `2/4 × 2/3 = 1/3`. Blue then red also has probability 1/3, giving 2/3 in total.

| First-round colors | What must remain for round two? | Total points | Probability in either container |
|---|---|---:|---:|
| Same color | Two of the other color | 2 | 1/3 |
| Different colors | One red and one blue | 6 | 2/3 |

Round two is not an independent fresh opportunity. The first round determines the remaining composition. Both containers preserve that relationship.

## Change return timing, and the distribution changes

Apply a new rule to both containers. After scoring each round's two items, immediately return them all and thoroughly shuffle or mix again, independently of the previous round. After round two, return the items before stopping. Keep composition, points, two draws per round, and the number of rounds unchanged.

If round one draws R1 and R2, score 1 and return them. Round two again faces two reds and two blues. It may draw R1 and B1 for 3 points, making **4 points** in total. An item can reappear in the next round. All four end inside the container, with the used area empty.

A total of 4 was impossible under the original rules: two reds in round one left only two blues. Now each round faces the complete four-item composition. Round one's colors no longer determine what remains for round two.

| Total points | No return before the phase ends | Return everything after each round |
|---|---:|---:|
| 2 | 1/3 | 1/9 |
| 4 | 0 | 4/9 |
| 6 | 2/3 | 4/9 |

In the new version, two same-color rounds have probability `1/3 × 1/3 = 1/9`; two different-color rounds have probability `2/3 × 2/3 = 4/9`. The remaining 4/9 produces one round of each kind. Together, the probabilities sum to 1.

Either a deck or a bag can implement this change. What matters is when items rejoin the draw pool, not the word “bag.”

## Which relationship should the design retain?

If drawing an item should affect later composition, specify how long it stays outside the pool. Whether players can see the used area also affects whether they can know what remains. Both versions here reveal the first round's results.

If every round should face the same composition again, specify both returning and randomizing. Returning cards without shuffling differs from the new rule here. It can preserve a known order, so this probability table would no longer apply.

When choosing components, also examine the practical work of shuffling, mixing, grasping, and distinguishing them. These calculations have not measured that work or established which container is easier to use. Observe players' experience separately from calculating probabilities.

## Check: return after every single draw—does the denominator stay the same?

Consider a small variation that examines only the first two draws. After each draw, record its color, immediately return the item, and mix again before the next draw. The first recorded color is red. What is the chance that the second is blue?

**1/2.** The container has returned to two reds and two blues, so blue accounts for 2/4. Do not carry over the original 2/3. The original rule has no return between a round's two draws: removing a red leaves two blues among three items.

“Return used items” is therefore incomplete. Specify whether it means after each draw, after each two-draw round, or after the whole phase.

## Sources and further reading

Geoffrey Engelstein and Isaac Shalev, *Building Blocks of Tabletop Game Design*, second edition, CAR-05, “Deck Building,” discusses deck building within the broader category of pool building, including how different components can preserve an equivalent rule structure.

This site's four-material model, scoring, return comparison, and probability calculations are original. They are not the rules of the book's commercial-game examples. When reading the deck-building and bag-building entries, continue with this question: when does a newly acquired item actually join a future draw?
