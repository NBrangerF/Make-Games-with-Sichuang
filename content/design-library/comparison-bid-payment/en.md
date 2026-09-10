# Who wins the lot, and who pays? The loser's next move can change too

Bids determine who receives the item. Payment rules determine everyone's remaining money. Two versions can produce the same auction winner while leaving the loser with very different next actions.

## One sealed bid, then one shopping opportunity

This original two-player mini-round gives A and B 6 coins and 0 points each. There is one auction lot, worth 8 points immediately to its recipient. Afterward, badges cost 4 coins and award 5 points each. Two badges supply one for each player. All rewards and budgets are public.

Each player secretly writes an integer bid from 0 to 6, then both reveal simultaneously. Zero means not participating. The highest positive bidder receives the lot; A wins ties at the highest positive bid. If both bid zero, remove the lot with no points awarded.

Under the base payment rule, only the recipient pays their own bid to the supply. The other player pays nothing. A and then B each get one opportunity to buy one badge for 4 coins or decline. An unaffordable purchase is illegal. There are no loans, additional bids, or other income. End after both shopping opportunities: add 1 point per remaining coin to earned points. Higher score wins; equal scores draw.

## Fix bids at 4 and 3, then follow through

A bids 4 and B bids 3. A receives the lot for 8 points, pays 4, and keeps 2 coins. A cannot afford a badge and finishes at 8 + 2 = 10. B loses the lot but keeps 6 coins, buys a badge for 4, and retains 2. B finishes with 5 + 2 = 7 points.

Recording only “A wins the auction” misses B's ability to redirect the budget. Here, a badge exchanges 4 coins for 5 points, improving on keeping those coins by 1 point. Following the phase to its end reveals that later benefit.

## Change only to everyone paying their bid

Reset the start and keep bids of 4 and 3. Change only payment: both players pay their own bids, while only the highest positive bidder receives the lot. A zero bid pays zero. Equal positive bids still award the lot to A, but both players pay their respective bids.

A still receives the lot, pays 4, keeps 2, and finishes with 10 points. B now pays 3 and keeps 3, unable to afford the 4-coin badge. B retains those coins and finishes with 3 points.

| Payment rule | Auction winner | A's coins before shopping | B's coins before shopping | Can B buy a badge? | Final A / B |
|---|---|---:|---:|---|---|
| Winner only | A | 2 | 6 | Yes | 10 / 7 |
| Everyone pays | A | 2 | 3 | No | 10 / 3 |

B pays 3 but loses 4 final points, also missing the badge's 1-point improvement over keeping cash. A losing bid's cost can include later actions that become unaffordable, not just the immediate deduction.

## Comparing fixed bids does not solve bidding strategy

Holding bids at 4 and 3 isolates the payment rule. Players who know the rule changed may submit different bids, so actual play need not reproduce this trace.

For example, hold A at 4 but let B bid zero. B does not participate or pay, keeps 6 coins, and buys a badge to finish at 7. This retrospective comparison does not establish that B should always bid zero without knowing A's bid. Winning the lot also awards 8 points. Finding a best strategy requires assumptions about opponents and objectives; one pair of bids is not a complete answer.

Sealed bidding also needs rules for ties, zero bids, payment timing, and bid ranges. This page fixes those boundaries before comparing whether the loser pays.

## Check: what if B bids 2 in the all-pay version?

Keep A's bid at 4 and change B's to 2. B pays 2, retains exactly 4, and buys a badge. B ends with 5 points and no coins; A still ends with 10. **B's final score is neither the remaining pre-shopping budget of 4 nor zero for losing the auction.** Continue through shopping and final scoring.

## Sources and classification

Geoffrey Engelstein and Isaac Shalev, *Building Blocks of Tabletop Game Design*, second edition, AUC-04 “Sealed-Bid Auction,” printed pages 365–367, discusses hidden bids, simultaneous revelation, ties, and all-pay variants where losing bidders also pay. These budgets, lot, badges, and results are original. We do not treat the authors' experience-based judgments about player reactions as measured results.

See the classification reference [BGG: Auction/Bidding](https://boardgamegeek.com/boardgamemechanic/2012/auction-bidding), also used in our auction entry. The broad auction label does not specify whether losing bidders pay; the resolution rule must do that.
