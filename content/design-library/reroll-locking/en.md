# Rerolling and locking: can a result you kept still change?

Three dice show 4, 2, and 1. You want to try the 2 again, but the rules say the 1 is locked. “I am keeping this for now” and “the rules forbid rerolling this” grant different permissions. **Rerolling offers another sample; locking removes certain results from later reroll choices.** The value of that opportunity depends on costs, scoring, and remaining attempts.

## The old result is not automatically insurance

In RES-21, “Rerolling and Locking,” Geoffrey Engelstein and Isaac Shalev discuss accepting a new result, choosing dice again across attempts, and implementations that lock particular faces. They also note that a new result can be worse. This page separates those permissions; “roll again” does not automatically mean keeping the better of two results. [Book reference](https://doi.org/10.1201/9781003179184)

## Three calibration dice, two operation tokens

This is an original single-player local phase. Three distinguishable ordinary six-sided dice are named A, B, and C, each numbered 1–6. On every actual throw, each face has probability 1/6. Dice and successive throws are independent. Start from the known results **A = 4, B = 2, C = 1**; do not roll these starting results again. The player holds 2 operation tokens, the spent area is empty, and the initial score is 0.

At each decision, stop or spend 1 token to reroll a nonempty set of eligible dice. One die or several may be selected, and the whole operation costs just 1 token. Move it to the spent area, then roll all selected dice together. Accept the new results; old faces cannot be restored. There are at most two operations, with no free rerolls or refills.

**Any die showing 1 becomes locked until this phase ends.** Thus C is already ineligible at the start. Other dice may be kept temporarily and selected again next time: keeping is not permanent locking. A locked die cannot be selected, and paying for an empty selection is forbidden.

Stopping, spending both tokens, or locking all three dice immediately ends the phase. Score once: each die finally showing 4, 5, or 6 is worth 3 points; every other die is worth 0. Each unspent token held is worth another point. There are no other bonuses or whole-game victory conditions. Stopping immediately therefore scores 3 for one qualifying die plus 2 for the tokens, totaling 5.

## Two actual routes: keep the 4 or try both again?

Reset the same start for each route. For comparison, use one set of recorded samples: A's first reroll, if taken, is 1; B's first reroll is 3 and its second is 6. These are retrospective examples, not results known in advance to the player, and do not change the fairness or independence assumptions.

| Route and operation | Selection and result | A / B / C afterwards | Tokens left |
| --- | --- | --- | --- |
| One, operation 1 | Reroll only B: 2 becomes 3 | 4 / 3 / 1 | 1 |
| One, operation 2 | Reroll only B: 3 becomes 6 | 4 / 6 / 1 | 0 |
| Two, operation 1 | Reroll A and B: results 1 and 3 | 1 / 3 / 1 | 1 |
| Two, operation 2 | Reroll only B: 3 becomes 6 | 1 / 6 / 1 | 0 |

Both routes end because both tokens are spent. The spent area holds 2 tokens and all three dice remain present. Route one has two qualifying dice and scores 6. Route two has only B qualifying and scores 3. In route two, A is locked and cannot join the second reroll. This sample shows how rerolling can lose a qualifying result; it does not establish that one choice is better under every random outcome.

## Fix a continuation policy before calculating probabilities

Reset the start and specify this policy: **reroll only B; stop if B qualifies; otherwise continue if B remains eligible, and stop if B locks or attempts run out.** A and C are always kept. All probabilities below are conditional on already seeing 4, 2, 1, not probabilities for a phase whose initial throw is also random.

B qualifies on 3 faces, probability 1/2. It locks on 1, probability 1/6. It remains eligible after 2 or 3, probability 1/3. Therefore:

| Terminal branch under this policy | Probability | Final total score |
| --- | --- | --- |
| First reroll qualifies; stop | 1/2 | Two qualifying dice: 6, plus 1 unspent token = 7 |
| First reroll is 1; stop after locking | 1/6 | A scores 3, plus 1 unspent token = 4 |
| First reroll is 2 or 3; second qualifies | 1/3 × 1/2 = 1/6 | 6 |
| First reroll is 2 or 3; second fails to qualify | 1/3 × 1/2 = 1/6 | 3 |

The four probabilities sum to 1. B's final chance of qualifying is **1/2 + 1/6 = 2/3**. Expected total score is **7/2 + 4/6 + 6/6 + 3/6 = 17/3**, approximately 5.67. This exceeds the immediate-stop score of 5, but a final score of just 4 or 3 still has probability 1/3. A higher average does not mean a better result every time, nor does this prove the policy best among all legal choices.

Do not simply calculate “two half-chances give 3/4 success”: a first reroll of 1 makes B ineligible for a second. Independent rolls do not give every branch permission to take both rolls.

## Remove only the lock on face 1

Reset the start and change only this rule: **1 may also be rerolled**. Tokens, cost per operation, scoring, and the two-operation limit stay unchanged. Keep the same B-only policy. Although C is now eligible too, this specified route still does not choose it.

Consider another complete sample: B first rerolls to 1. Under the original rule it locks, the policy stops, and the final dice are 4, 1, 1 with 1 token left, scoring 4. Under the new rule B may reroll again. Spend the last token and suppose it becomes 6. Final dice are 4, 6, 1 with no tokens left, scoring 6. Both endings retain three dice; held and spent areas always account for exactly two tokens.

With the new rule, every nonqualifying first result permits another attempt. Qualifying on the first reroll, qualifying only on the second, and failing on both have probabilities **1/2, 1/4, 1/4**, respectively, scoring **7, 6, 3**. Qualification probability becomes **3/4**, and expected total is **7/2 + 6/4 + 3/4 = 23/4**, or 5.75: an increase of **1/12** point over the original policy. This small difference already accounts for spending additional tokens. Comparing only success rates would omit the unspent-token points.

## Check: does an attempt remaining guarantee permission?

1. Under the original rule, B first rerolls to 1 and a token remains. May B reroll again? **No.** Attempts and payment remain, but B is locked. Unlocked A could still be chosen; the specified policy simply does not do that.
2. If A's 4 was kept during the first operation, may A be rerolled during the second? **Yes.** A 4 does not trigger locking. Rerolling means accepting the new result; the old 4 cannot serve as insurance.
3. Suppose the player takes another legal route, rerolling B to 5 and then rerolling it again to 2. What is the score after both operations? **3 points.** Only A qualifies; B and C score 0, and both tokens are spent. B's earlier 5 was replaced and cannot score again.

## Sources and scope

The core source is Geoffrey Engelstein and Isaac Shalev, *Building Blocks of Tabletop Game Design: An Encyclopedia of Mechanisms*, second edition, CRC Press, 2022, chapter 4, “Resolution,” RES-21, “Rerolling and Locking” (EPUB anchor `filepos419605`). Its description and discussion were read. The calibration dice, costs, scoring, samples, and all conditional probabilities are original. The book's specific numerical-average example is not reused, and no human preferences are reported. [Bibliographic reference and DOI](https://doi.org/10.1201/9781003179184)

[BGG 2870: Re-rolling and Locking](https://boardgamegeek.com/boardgamemechanic/2870/re-rolling-and-locking) is a checked classification identity link with a related mapping. This example differs from allocating existing dice results. Permission to reroll alone also does not imply a push-your-luck rule that loses all gains on failure.
