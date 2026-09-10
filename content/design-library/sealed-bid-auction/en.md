# Sealed bidding: how do two bids share one budget?

You write 6 for a red relay and 2 for a blue sensor. At revelation, competition for the relay looks modest, but someone has bid 6 for the sensor. Can you immediately move your bid across? **Sealed bidding commits players before they see each other's current bids, then reveals them together.** Any right to revise afterwards needs a separate rule; this page grants no additional bid.

## Sealing specifies information, not the payment rule

In AUC-04, “Sealed-Bid Auction,” Geoffrey Engelstein and Isaac Shalev discuss secret bids, simultaneous revelation, ties, and different payment arrangements. Awarding a lot to the highest bidder does not automatically mean only that player pays. Nor does “sealed” determine whether money goes to a bank or another player. [Book reference](https://doi.org/10.1201/9781003179184)

The example uses winners paying their own bids, with two items auctioned in one batch. Parallel lots are an additional implementation choice: a sealed auction can have just one. Here, the point is that players cannot wait for the first item's outcome before deciding how much to bid on the second.

## Two devices, one submission

This is an original local phase for three players. A, B, and C hold 8, 7, and 6 coins, respectively, start on 0 points, and have an empty bank. The public area holds exactly one red relay and one blue sensor. The relay scores 9 and the sensor 8 for any owner. Budgets, devices, and points are public. There is no other income, combination bonus, or later purchase.

Each player secretly writes two integer bids in the fixed order “red / blue.” Each can be 0 or greater, but **their sum cannot exceed the player's coins**. A 0 opts out of that lot; it does not permit a free acquisition. Players may focus their budget on one item, divide it, or bid 0 on both. Writing a bid does not yet spend money.

Once all three submit, reveal all six numbers at once. No revising, adding money, changing items, or withdrawing. Each device goes to its highest positive bidder. Ties for highest bid use fixed priority A, then B, then C. If every bid on an item is 0, it remains in the public area, with no owner or payment.

Determine both owners first, then each winner pays their own bid for the item to the bank. Losing bids pay nothing. One player may win both devices and must pay both bids. The combined submission limit ensures that winning both is affordable. There is no intervening refund-and-top-up step.

After allocation and payment, score owned devices plus 1 point per remaining coin and end the phase. Unallocated devices score nothing, and banked money belongs to no player. Equal final scores remain tied; this local phase does not determine a larger game's victory.

## The same budget: focus on red or blue?

Fix B's bids at 5 / 2 and C's at 0 / 6. Reset the start to compare two legal A submissions. These opposing bids are conditions for readers to check; A cannot see them when submitting.

In route one, A bids **6 / 2**, totaling exactly 8. A's 6 beats B's 5 for red, while C's 6 wins blue. C's red 0 does not participate. The two blue bids of 2 are not highest, so their tie does not need resolution.

| Player | Devices received | Paid | Coins left | Device points + coin points |
| --- | --- | --- | --- | --- |
| A | Red | 6 | 2 | 9 + 2 = 11 |
| B | None | 0 | 7 | 0 + 7 = 7 |
| C | Blue | 6 | 0 | 8 + 0 = 8 |

In route two, A bids **2 / 6**, again using exactly 8 of commitment capacity. B's 5 wins red. A and C both bid 6 for blue, which A wins through priority.

| Player | Devices received | Paid | Coins left | Device points + coin points |
| --- | --- | --- | --- | --- |
| A | Blue | 6 | 2 | 8 + 2 = 10 |
| B | Red | 5 | 2 | 9 + 2 = 11 |
| C | None | 0 | 6 | 0 + 6 = 6 |

Route one puts 12 coins in the bank and leaves 9 with players. Route two banks 11 and leaves 10. Both account for the original 21 coins. Each device has exactly one owner and scores once. A pays 6 in both routes but receives devices with different point values, finishing on 11 or 10.

A does not pay the losing red bid of 2 in route two. That does not create a revision stage after revelation. Commitment capacity limits all payments that a submission might require; actual payment depends on the items ultimately won. Unspent money is not permission to move a submitted bid whenever desired.

## Reverse only the priority for tied highest bids

Reset route two's starting state and all bids. Change only tie priority to C, then B, then A. Bid limits, sealed revelation, and payment remain unchanged.

B still wins red for 5, retains 2 coins, and scores 11. C now wins the blue tie at 6, retains no coins, and scores 8. A loses both, pays nothing, retains 8 coins, and scores 8. The bank still receives 11; player holdings are 8 / 2 / 0, totaling 10, so the combined total remains 21.

A changes from owning blue and scoring 10 to owning nothing and scoring 8. C changes from 6 to 8 points. Neither bids nor the number of bidding rounds change. A and C finish tied on 8. Tie handling is therefore something players need to know before committing, rather than an administrative detail supplied at revelation.

## What does this situation establish?

Bidding for two items together allocates one budget across several possible payments. Auctioning red first and blue afterwards would let players remake the second decision using the first result. That is a different information process. Resolving this example as two successive auctions would change its commitment conditions.

Sealed bidding is also more specific than any secret choice: these numbers allocate devices and carry stated payment consequences. Compared with public ascending bidding, the difference includes whether players may respond after seeing another current bid, not just whether they use paper.

The two specified routes do not prove A should always pursue red. Opposing bids, points, budgets, or priority changes require recalculation. Parallel submission may reduce bidding rounds, but this page measures neither real play time nor comprehension, and bids cannot directly reveal players' true preferences.

## Check: does paying less permit an immediate revision?

1. May A bid 6 / 6 intending to win only one device? **No.** The sum of 12 exceeds the budget of 8. Expecting to lose does not waive the submission limit.
2. In original route two, does C pay the losing blue bid of 6? **No.** This example charges only winners; sealing did not determine that rule for us.
3. What if everyone bids 0 on both items? **Both devices remain public and nobody pays.** Coins and coin-based scores remain 8 / 7 / 6, and the bank holds 0. Priority does not allocate unbid items for free.

## Sources and scope

The core source is Geoffrey Engelstein and Isaac Shalev, *Building Blocks of Tabletop Game Design: An Encyclopedia of Mechanisms*, second edition, CRC Press, 2022, chapter 8: AUC-04, “Sealed-Bid Auction” (EPUB anchor `filepos745304`), and AUC-11, “Multiple-Lot Auction” (`filepos784439`). Both descriptions and discussions were read in full. Devices, budgets, submissions, and the tie comparison are original. [Bibliographic reference and DOI](https://doi.org/10.1201/9781003179184)

[BGG 2920: Auction: Sealed Bid](https://boardgamegeek.com/boardgamemechanic/2920/auction-sealed-bid) is a related classification reference. Parallel lots, combined bid limits, priority, and winners paying their own bids are this page's specified implementation; a classification name does not supply them automatically.
