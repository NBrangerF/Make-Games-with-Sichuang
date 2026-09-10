# Investment: Why Does a Four-Coin Gain Beat Short Jobs by Only Two?

Paying something now to receive a return after later conditions are met can create a useful choice between action sequences. This library treats investment as a broad design pattern. The commitment may involve money, materials, an action, or another opportunity; timing and eligibility for the return also need explicit rules.

This does not assign every commitment to one mechanism of that name. *Building Blocks of Tabletop Game Design*, second edition, Chapter 7, ECO-13 “Investment,” pp.335–337, primarily discusses owning shares of an entity, distributing benefits by holdings or rank, and contributing to share in later rewards. We use the question of how contributions connect to later eligibility to construct a simpler delayed-payment example. This local pattern is not a full restatement of the book or BGG definition. [Publication information](https://doi.org/10.1201/9781003179184)

## When does the preparation certificate pay?

One player takes three rounds, starting with six coins; the bank has thirty-four. One preparation certificate is available in a public reserve. There are no hands, dice, hidden information, or loans. Its price, payout, and timing are all public and deterministic.

Each round choose one action: pay the bank four coins to acquire the certificate, do a short job to receive two coins from the bank, or pass. The certificate can be acquired only once. Insufficient funds prevent purchase; refunds, resale, and buying the redeemed certificate again are unavailable. Short jobs can repeat each round. Payments occur within the action, and buying and working cannot both happen in one round.

After purchase, **two subsequent rounds must finish** before the certificate pays. Buy in round one to receive eight coins after round three's action. The purchase round is not the first waiting round; buying in round two means waiting until the end of round four. Eight is the single total payment, with no additional refund of the four-coin purchase price.

Every round runs its action first, then checks whether the certificate matures. The final round follows the same order, after which the game ends immediately with no extra action. A certificate still awaiting maturity expires with zero value. A redeemed certificate has no residual value either. Each remaining coin scores one point; higher-scoring plans are better and tied plans have equal results.

Player and bank always hold forty coins in total. The single certificate occupies either the reserve, waiting, redeemed, or expired area; it cannot count as two assets at once.

## Commit early or keep taking short jobs

Route A buys in round one and works in the next two rounds. Route B works in all three.

| Round | A: commit and wait | A's coins afterward | B: continuous short jobs | B's coins afterward |
| --- | --- | --- | --- | --- |
| 1 | Pay four for a certificate due at round three's end | 2 | Receive two | 8 |
| 2 | Receive two from a short job; certificate not yet due | 4 | Receive two | 10 |
| 3 | Receive two from a short job, then eight at maturity | 14 | Receive two | 12 |

A finishes with fourteen points, twenty-six bank coins, and a redeemed certificate. B finishes with twelve points, twenty-eight bank coins, and the certificate still in reserve. Each route contains forty coins and one certificate, with no actions remaining.

For the certificate alone, eight minus four looks like a gain of four. But buying it uses the action that could have earned two coins in round one. Relative to B, A gains only two: eight received minus the four-coin price minus the foregone two-coin job equals two. Count both the payment and the action opportunity.

B holds eight coins after round one while A holds only two, which does not identify the eventual winner. A's cash has become a right that has not matured; that right is also not eight immediately spendable coins. A mandatory payment in round two would have to be checked against the four coins then available, without moving a future return into the wallet early.

## Change only the ending to one round earlier

Restart unchanged except that the game ends after round two's action and maturity check. The certificate still needs two subsequent rounds and still pays eight. A shorter game does not accelerate it.

| Route | Round one | Round two and ending | Final score |
| --- | --- | --- | --- |
| Buy first, then work | 6−4=2 coins | Work to reach four; certificate due in round three now expires | 4 |
| Work in both rounds | 6+2=8 coins | Receive two more, reaching ten; certificate never purchased | 10 |

The investment route changes from a two-point lead to a six-point deficit. The scheduled payment of eight coins is not payable at this ending. Having already paid does not authorize an extra round three. Both routes still preserve forty total coins; what differs is who holds them and whether the certificate reached maturity.

This does not prove that every investment should be made as early as possible. Buying in round one happens to mature within the original deadline. Higher costs, different job rewards, or other opportunities lost to buying would require another comparison.

## Waiting costs, ending risk, and uncertainty

Even with three rounds, buying in round two is too late: work in round one to hold eight coins, pay four in round two to hold four, then work in round three to hold six. The certificate is due at the end of round four and expires, giving a final score of six. The sequence is legal but cannot collect its return within the stated horizon.

There is no randomness in the main example. Eight coins is not an expected value, and no success probability is involved. A different design with hidden or random payouts must state possible outcomes, probabilities, disclosure timing, and what happens when no return occurs. This example provides only a conditional threshold: following A's action order, the eventual payout must exceed six coins to beat B's twelve points. The advantage with a known eight-coin payout does not establish an advantage with an unknown return.

This pattern emphasizes a different question from income and production. That topic can start with when resources arrive and how they recur; here the focus is what is paid today to acquire future eligibility, which action is occupied, and whether redemption can occur before the ending. Loans may connect to it, but a project that pays after a debt matures does not automatically solve the earlier cash shortage.

ECO-13 also discusses distributing benefits among several holders. This example has one participant and one nontransferable certificate. It cannot establish the balance of majority shareholders, market prices, or shared returns. Testing those questions requires players who actually participate in the distribution and complete allocation rules.

## Self-checks with answers

1. Why does a round-one purchase not pay at the end of round two? **Two subsequent rounds must finish: rounds two and three. The purchase round does not count.**
2. Can you take another short job after collecting eight in round three? **No. The round's action has ended; the payout is followed directly by the ending.**
3. What if A receives only six coins at maturity? **6−4+2+2+6=12, exactly tying three short jobs. This conditional calculation assigns no probability to a six-coin payout.**
4. Can the certificate still awaiting payment count as four points in the two-round version because that was its purchase price? **No. The rules make it expire with zero residual value.**

## References and classification

- Geoffrey Engelstein and Isaac Shalev, *Building Blocks of Tabletop Game Design: An Encyclopedia of Mechanisms*, Second Edition, CRC Press, 2022: Chapter 7, ECO-13 “Investment,” printed pp.335–337, electronic anchor `filepos692881`. The shares, benefit-distribution, and contribution passages were read. The certificate, waiting period, and amounts above are our original construction. [Publication information](https://doi.org/10.1201/9781003179184)
- [BoardGameGeek: Investment (2910)](https://boardgamegeek.com/boardgamemechanic/2910/investment): a related classification entrance. Identity was verified without establishing equivalent scope from its definition. This library's investment entry remains a broader design pattern, rather than a one-to-one translation of that mechanism.
