# Ascending bidding: which prices remain when your turn arrives?

You are willing to bid 5, but someone has already raised the price to 6 before your turn. Seeing the current price does not grant permission to bid any number at any moment. **Ascending bidding moves valid bids upwards. Who may bid, the minimum increase, and the ending still require a procedure.**

## Separate price direction from speaking order

This page uses “ascending” for the upward direction of bids, rather than treating it as synonymous with public bids, unrestricted calling out, or turn-by-turn bidding. Engelstein and Shalev separately discuss Open Auction, auctioneer-led English Auction, and Turn Order Until Pass Auction. Our original example uses the last procedure. [Book reference](https://doi.org/10.1201/9781003179184)

It provides an identified actor at each step, but different players can face different minimum prices when their turns arrive. Preserve the sequence to understand this; a sorted list of final bids is insufficient.

## A spotlight auction: public money, permanent withdrawal

This is an original local phase for three players. A, B, and C have 9, 8, and 7 coins, respectively, start on 0 points, and have an empty bank. There is one spotlight, worth 11 points to its owner. Budgets and its reward are public. There is no income, borrowing, or later purchase.

A acts first, then seats cycle A, B, C. Before any bid, the acting player may bid any positive integer within their budget, starting at 1, or withdraw. After a bid exists, an active player who is not the current leader chooses on their turn: bid an integer within their budget **at least 1 above the current price**, or withdraw. Larger jumps are allowed; increasing by exactly 1 is not required.

Skip the current leader's seat; they need not bid against themselves. Once outbid, they may choose again when their turn returns. Withdrawn players cannot re-enter this phase and pay nothing. A player may withdraw despite being able to afford a bid. If the minimum legal bid is unaffordable, withdrawal is compulsory.

A bid records a total commitment; money is not repeatedly paid during bidding. Raising to 5 does not mean paying another 5 on top of earlier bids. When only the current leader remains active, they immediately take the spotlight and pay their final bid to the bank. Nobody else pays. If everyone withdraws before the first bid, there is no allocation or payment. The last active player cannot receive it free merely by being alone: a bid of at least 1 is still required.

End after sale or everyone's withdrawal. The owner scores 11; everyone also scores 1 per remaining coin. An unsold spotlight remains public. Equal final scores remain tied, with no larger game's victory decided here.

## Small increases versus opening at 4

For reproducibility, specify personal bidding policies: A is willing to bid up to 5 in this example, B up to 6, and C up to 2. On each turn, bid the legal minimum if it is within that personal ceiling; otherwise withdraw. **These ceilings specify the illustrated choices, not cash limits or measured true valuations.** Players know their own policy, not their opponents' in advance. Readers see all three to check the calculation.

Route one follows this policy throughout:

| Step | Actor and action | Current leader / price |
| --- | --- | --- |
| 1 | A bids 1 | A / 1 |
| 2 | B bids 2 | B / 2 |
| 3 | C faces minimum 3 and withdraws | B / 2 |
| 4 | A bids 3 | A / 3 |
| 5 | B bids 4 | B / 4 |
| 6 | A bids 5 | A / 5 |
| 7 | B bids 6 | B / 6 |
| 8 | A faces minimum 7 and withdraws | B / 6, sold |

B pays only the final 6, retains 2, and scores 11 + 2 = 13. Payment is not 2 + 4 + 6 = 12. A retains 9 and scores 9; C retains 7 and scores 7. Player holdings total 18, plus 6 in the bank, preserving all 24 original coins.

Reset for route two. A changes only the opening choice, jumping to 4. Subsequent choices follow the same ceilings and legal minimums: A bids 4, B bids 5, C faces a minimum of 6 and withdraws, and A also faces 6 and withdraws because its personal ceiling is 5. After four decisions, B wins for 5, keeps 3 coins, and scores 14. A and C still score 9 and 7. Players retain 19 and the bank holds 5, totaling 24.

A loses in both routes. The jump reduces formal decisions from 8 to 4 but lowers B's price from 6 to 5. It does not show that jump bids always increase prices or intimidate opponents: B followed the same policy throughout. The difference is whether 5 is still a valid bid when A acts. Nor does this page convert decision counts into real minutes.

## Change only the minimum increase to 2

Reset route one's budgets and personal ceilings, with A still opening. The minimum first bid remains 1. Change only the minimum increase after a bid exists, from 1 to **2**. Turns, withdrawal, payments, and scoring stay unchanged. Everyone still chooses the lowest acceptable legal bid.

The sequence becomes: A bids 1; B must bid at least 3 and bids 3; C faces 5 and withdraws; A bids 5; B faces 7, exceeding its personal ceiling of 6, and withdraws. A pays 5 for the spotlight, retains 4, and scores 15. B keeps 8 and scores 8; C keeps 7 and scores 7. The bank holds 5 and players 19, totaling 24.

B actually has 8 coins, so bidding 7 would be legal. The specified policy elects not to. Minimum increases change the range of valid bids without directly forcing the wealthier player to withdraw. B cannot instead offer 6, matching neither the required increase nor its minimum. Allowing a match of the current price is another rule decision; neither version permits it.

## Understand the conditions before interpreting withdrawal

Withdrawal is permanent here. Allowing later re-entry would also require revisiting when everyone has finished bidding. An explanation based on each withdrawal shrinking the field would no longer apply. Strict increases with finite budgets also prevent indefinite bidding in this example.

Several players being willing to accept the same price does not create a legal tie. Only one acts at a time, and each bid must strictly exceed the current price, so highest bids cannot tie. Allowing simultaneous responses would require recognition order or another tie rule.

This local process does not prove that staying until a personal ceiling is optimal. A lot could have combination value, an opponent's acquisition could affect later play, and money could have other uses. Without those conditions, budgets and withdrawals cannot directly be interpreted as preferences.

## Check: illegal, or merely beyond the chosen ceiling?

1. B has bid 6. May A also bid 6? **No.** The original minimum is 7; with an increase of 2 it is 8. Neither version accepts matching bids.
2. After withdrawing in route one, may C return because the price still seems low? **No.** Permanent withdrawal removed its eligibility. Retaining coins does not grant re-entry.
3. If all three initially withdraw in order, who gets the spotlight? **Nobody.** The bank stays empty, with coins and scores still 9 / 8 / 7. If A and B withdraw but C instead bids 1, C pays 1 and receives the spotlight, finishing on 17 points.

## Sources and scope

The core source is Geoffrey Engelstein and Isaac Shalev, *Building Blocks of Tabletop Game Design: An Encyclopedia of Mechanisms*, second edition, CRC Press, 2022, chapter 8: AUC-01, “Open Auction” (EPUB anchor `filepos730627`); AUC-02, “English Auction” (`filepos734148`); and AUC-03, “Turn Order Until Pass Auction” (`filepos739569`). All three descriptions and discussions were read in full. The spotlight, budgets, specified ceilings, and routes are original. [Bibliographic reference and DOI](https://doi.org/10.1201/9781003179184)

[BGG 2918: Auction: English](https://boardgamegeek.com/boardgamemechanic/2918/auction-english) is a related reference whose description includes an auctioneer. The turn procedure here is not equated directly with it. Upward prices remain distinct from the specific governance and sequencing rules.
