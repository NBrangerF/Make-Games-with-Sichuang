# Quacks: Why Can a Safe Chip Make the Next Draw More Dangerous?

Before reaching into the bag, a player faces more than an unchanging level of luck. What has already come out, what remains, which reward they can afford to lose, and how ingredients follow one another all change the next decision. Separating those relationships reveals more of *The Quacks of Quedlinburg* than the repeated question, “Shall I draw again?”

This article uses Schmidt product 88220, its English base rules in the official file named 2024, the pot side without test tubes, and ingredient Set 1. The [publisher’s product page](https://www.schmidtspiele.de/detail/product/the-quacks-of-quedlinburg.html) identifies Wolfgang Warsch and the rules source. The situations below are our own local thought experiments, not designer interviews, observed playtests, or proofs of optimal play. Fortune Teller effects have been resolved and do not alter the stated bag contents, positions, threshold, or settlement. Expansions, other ingredient sets, and final-round conversion rules are outside the examples.

## Angle one: Risk follows the remaining bag; losses need separate accounts

Start with the original nine chips: four white 1s, two white 2s, one white 3, one orange 1, and one green 1. The pot explodes only when its white total exceeds 7; exactly 7 still allows a safe stop. Chip values also move ingredients along the pot, but colored chips do not increase the white total. [Rules, pp.3–4](https://www.schmidtspiele.de/files/Retail/72dpi_PNG/88220_Quack_rules_english_2024.pdf)

Lin’s droplet is at 0, with no rat-tail starting advantage and an unused flask. Lin has drawn white 2, white 2, white 1, white 1, in that order. The white total is 6 and the last chip occupies the sixth space. Five chips remain: white 3, white 1, white 1, orange 1, green 1. We calculate only the chance that the **next ordinary blind draw immediately explodes**. Assume thorough mixing and equal chances for each remaining chip, with no flask use or other effect.

| Current situation | Chips that would immediately explode the pot | Probability |
| --- | --- | --- |
| White total 6; the five chips listed above remain | Only white 3 | 1/5 = 20% |
| Orange 1 comes out first; white total remains 6, four chips remain | Still only white 3 | 1/4 = 25% |
| Instead, a white 1 comes out from the original situation; white total becomes 7, four chips remain | White 3 and the other white 1 | 2/4 = 50% |

The third row has only one white 1 left, not two: the one just drawn is already in the pot. Both the numerator and denominator need updating before counting dangerous outcomes. Drawing white and exploding are not interchangeable events.

The second row is particularly useful for checking design intuition. The orange chip did no immediate harm, but removed a safe possibility from the bag. Without any threshold change, the next draw became more dangerous. Increasing risk can follow a good outcome because that safe result has been consumed. Conversely, buying a colored chip changes a future bag without guaranteeing that it will appear next round.

Failure also needs a more precise description than “lose the round.” Consider a separate situation using the same original nine-chip bag. Lin draws white 2, white 2, white 1, white 1, white 1, orange 1, green 1, then white 3. The white total reaches 10. The white 3 still goes on the twelfth space and drawing ends. The following scoring space displays 13 coins, 2 points, and a ruby. The green chip is the second-last chip placed, so Set 1 supplies another ruby. Lin receives both rubies despite the explosion but cannot compete for the Bonus Die. The flask cannot return the white 3 that caused the explosion. [Rules, pp.5–6](https://www.schmidtspiele.de/files/Retail/72dpi_PNG/88220_Quack_rules_english_2024.pdf); [green Set 1, Almanac p.3](https://c.tabletopia.com/games/the-quacks-of-quedlinburg/rules/88220-quacksalber-quacks-almanac-gb/en)

Lin must then choose between the space’s 2 points and its 13-coin buying allowance. Buying only a blue 2 for 10, for example, loses the unused three-coin allowance and forfeits those 2 points. Taking the points rules out buying as well. Coins here are a current-round allowance, not saved cash. The two rubies are separate, and previously earned points are not erased.

When designing a risk system, list what failure preserves, removes, and still lets the player choose. Here, the choice between ingredients and points connects an explosion to the quality of future bags. Without specifying the remaining rounds, opponents’ scores, and intended purchases, however, we cannot conclude that drawing again or choosing shopping is always correct.

## Angle two: A blue chip buys a choice, not immunity

Now consider round 2 of another game. Lin’s bag contains the original nine chips plus one blue 2, legally purchased for 10 coins in the previous round, with no other additions or removals. The droplet remains at 0 and no rat-tail advantage applies. Lin places white 3, white 2, white 1, white 1, reaching a white total of 7, then draws blue 2 and puts it on the ninth space. White 2, white 1, white 1, orange 1, and green 1 remain in the bag.

Set 1’s blue 2 allows Lin to inspect two chips and place at most one, returning the others. Returning both is also allowed. The blue chip’s own two-space advance has already happened. Choosing after seeing the possibilities differs from making two successive blind draws. [Almanac p.1, Crow skull / Set 1](https://c.tabletopia.com/games/the-quacks-of-quedlinburg/rules/88220-quacksalber-quacks-almanac-gb/en)

Temporarily label the identical white 1s separately. There are 10 equally likely two-chip combinations. Three contain only white chips, six contain one white and one colored chip, and one contains orange and green. Lin therefore has a 7/10, or 70%, chance of seeing at least one colored chip that will not increase the white total. In the other 3/10 of offers, Lin may return both, leaving blue on the ninth space and the white total at 7.

**This is not a 30% chance of a forced explosion.** Inspecting does not require placing an unsafe chip. Returning both and stopping avoids an explosion from that offer. Returning both and resuming ordinary blind draws leaves the original three-white, two-colored bag, with a 3/5 chance of exploding on the next draw.

If the offer is white 2 and green 1, Lin can place green and return white. The pot advances one space and the green chip may produce an evaluation reward. But the bag now contains white 2, white 1, white 1, and orange 1: the next ordinary blind draw explodes with probability 3/4. Blue helped Lin choose one safe advance. It neither destroyed the returned white chip nor protected all later draws.

For a designer, these are distinct abilities: adding a visible option, allowing all options to be rejected, and removing a dangerous object. Calling all three “risk reduction” hides where each acts and how long its benefit lasts. With the same remaining bag, a prototype experiment could compare a blind draw, inspecting two and placing at most one, and permanently removing a white chip. Record which decision each changes; invented experiment rules must not be mistaken for rules of the published game.

## Angle three: Why does progress remain after an ingredient is removed?

The third situation begins in round 3 of a separate game. Lin’s bag has only one addition to the starting contents: yellow 1. Lin bought nothing in round 1 and paid 8 coins for yellow in round 2. Yellow becomes available in round 2, so that acquisition timing is legal. The droplet is at 0, with no rat-tail advantage or other relevant effects.

Lin draws white 2, white 2, white 1. They occupy the second, fourth, and fifth spaces, with a white total of 5. Yellow 1 comes next and first goes on the sixth space. Because yellow directly follows white, Lin may return that preceding white 1 to the bag. The fifth space becomes empty, yellow stays on the sixth, and the white total falls to 4. [Almanac p.2, Mandrake / Set 1](https://c.tabletopia.com/games/the-quacks-of-quedlinburg/rules/88220-quacksalber-quacks-almanac-gb/en)

| Resolving yellow | White total | Last chip’s position | Remaining bag | Immediate explosion on the next ordinary draw |
| --- | --- | --- | --- | --- |
| Decline the optional ability | 5 | Sixth space | White 3; three white 1s; orange 1; green 1 | 1/6 |
| Return the preceding white 1 | 4 | Sixth space | White 3; four white 1s; orange 1; green 1 | 0/7 |

Now let both branches draw white 3. Both advance to the ninth space. Without the return, the white total becomes 8 and the pot explodes. With the return, it becomes 7 and remains safe. That safe branch is not safe forever: four white 1s, orange 1, and green 1 remain, so another ordinary draw explodes with probability 4/6 = 2/3. The returned chip can appear again.

Three records must stay distinct: the white total in the pot, the last chip’s track position, and the bag’s remaining contents. Returning white changes the first and adds to the bag, without pulling the last chip backward. Treating the pot as simply the sum of currently present chip values cannot explain the empty fifth space and yellow still on the sixth. Physical placement preserves a trace of the earlier effect, helping distinguish distance already gained from the current white total.

Similarly, permanent droplet movement and a round’s rat-tail advantage change where drawing starts without changing the bag. Droplet progress persists, while the rat stone comes out at round end and its next placement is recalculated from rat-tails between scores. [Rules, pp.3 and 7](https://www.schmidtspiele.de/files/Retail/72dpi_PNG/88220_Quack_rules_english_2024.pdf) These are separate design variables, requiring more precision than “help the trailing player” or “make ingredients stronger.” Whether particular players experience them as fair remains a playtesting question; this article provides no such measurement.

## Self-checks with answers

1. Why does drawing orange first increase the first table’s risk from 20% to 25%? **The dangerous white 3 remains while a safe chip leaves; the numerator stays one and the denominator falls from five to four.**
2. Must a blue 2 offer containing two white chips force an explosion? **No. Both can be returned and the player can stop. The 30% figure describes offers without a safe chip.**
3. After exploding, can Lin spend 10 of the 13-coin allowance on blue 2 and also take the space’s 2 points? **No, but the green-chip and scoring-space rubies in this example are still received.**
4. Why is the final position still six after yellow returns the preceding white 1? **Yellow is already placed and its ability preserves that position. The white total falls, while the returned chip becomes a possible later draw again.**

## Edition and sources

- [Schmidt’s official product page](https://www.schmidtspiele.de/detail/product/the-quacks-of-quedlinburg.html): product 88220, designer, and current English base-rules link.
- [Schmidt English base rules, file named 2024](https://www.schmidtspiele.de/files/Retail/72dpi_PNG/88220_Quack_rules_english_2024.pdf): eight PDF pages. Page 3 covers starting contents and rats; pp.4–5 cover drawing, explosions, and flasks; pp.5–7 cover evaluation and buying; p.7 introduces yellow. PDF and printed page numbers agree.
- [Schmidt’s English Almanac of Ingredients, hosted by Tabletopia](https://c.tabletopia.com/games/the-quacks-of-quedlinburg/rules/88220-quacksalber-quacks-almanac-gb/en): four PDF pages, cited by PDF page order. Blue is on p.1, yellow on p.2, and green on p.3; only Set 1 is applied. The file does not establish a printing year matching the 2024 rules filename. It is used as the base-edition ingredient explanation, not claimed to have been published in the same year.
