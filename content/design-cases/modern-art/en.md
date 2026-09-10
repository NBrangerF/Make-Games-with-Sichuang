# Modern Art: Why Is a Painting’s Price Not Its Value?

Lin has just sold a painting for 18. The number looks precise, but it does not tell us who gained how much. Where did the money go? Who acquired the painting? Where will its artist rank when the round ends? *Modern Art* helps us separate those questions before reconnecting them.

We use CMON’s currently linked English base rules, with four players and no Mystery Player variant. Reiner Knizia is the designer; see the [publisher’s page](https://www.cmon.com/products/modern-art/). Amounts use this edition’s game units: 1 represents a thousand dollars. The three independent comparisons below are our constructions. Cash is disclosed for calculation, although players hide it during play. These are neither complete games, optimal strategies, nor accounts of the designer’s development process.

To keep tables readable, M, S, D, R and F stand for Manuel Carvalho, Sigrid Thaler, Daniel Melim, Ramon Martins and Rafael Silveira, in the board’s left-to-right order.

## Angle one: Paying 18 to a rival is different from paying 18 to the bank

Start with one transaction. Lin, Jo, Mei and Bo each have 100 and sit in that clockwise order. Lin offers a fixed-price painting for 18. Assume this play does not end the round. Compare Jo accepting immediately with Jo, Mei and Bo all declining. Under the [payment and fixed-price rules, PDF p.3](https://www.cmon.com/wp-content/uploads/2023/06/MA_Rulebbok_Artbook_v18-low.pdf), Jo pays Lin in the first branch; Lin pays the bank in the second. Lin must be able to cover the announced price.

| Response | Lin’s cash after purchase | Jo’s cash after purchase | Painting acquired by | Their combined cash |
| --- | --- | --- | --- | --- |
| Jo buys | 118 | 82 | Jo | 200 |
| All three decline; Lin buys | 82 | 100 | Lin | 182 |

Now impose one later condition: the painting pays 30 at settlement. Count only this transaction and this painting’s payout. Branch one leaves Lin with 118 and Jo with 112; branch two leaves Lin with 112 and Jo with 100. Mei and Bo are unchanged in this calculation; other transactions are excluded.

Jo genuinely gains 12 in the first branch, but Lin gains 18. A profitable purchase is not automatically a larger gain than the seller’s. Buying it personally gives Lin a gain of 12 instead, and temporarily removes 18 from the cash held by players. An identical price has produced a different distribution of spending power.

The later 30 is a condition, not something Lin is guaranteed when naming a price. If the payout is actually zero, Jo loses 18 in the first branch and Lin bears that loss in the second. Naming a price therefore combines a prediction about acceptance with responsibility for rejection. For an original auction design, draw the payment arrows before calculating asset returns. “The highest bidder wins” leaves too much unexplained.

Also keep a card offered from a hand separate from an asset already purchased. Entering Lin’s offered card in the ledger as “Lin’s collection, already worth 30” confuses two states and corrupts the comparison from its first line.

## Angle two: Forgoing a sale can protect paintings already purchased

Move to an independent first-round snapshot. Lin is about to act, followed by Jo, Mei and Bo. Purchased paintings and cash are shown below. The table contains M4, S4, D3, R1 and F0. Everyone still has cards; Lin’s hand includes an M and a fixed-price D, and Jo has an S. No double auction is pending.

| Player | Paintings purchased | Current cash |
| --- | --- | --- |
| Lin | Two M, one R | 97 |
| Jo | Two S, one D | 97 |
| Mei | Two M, two S | 96 |
| Bo | Two D | 99 |

The relevant rule: an artist’s fifth appearance ends the round. That card is unbought but counts in the ranking. First-round payouts are 30, 20 and 10 per painting for the top three artists, zero otherwise; ties favor the artist further left on the board. [PDF p.4](https://www.cmon.com/wp-content/uploads/2023/06/MA_Rulebbok_Artbook_v18-low.pdf)

Lin compares two paths. A: play M now and end the round. B: offer the fixed-price D for 8; stipulate that Jo and Mei pass and Bo buys; Jo then plays S to end the round. Those responses are fixed for comparison, not predictions that the other players must behave this way.

| Path | Final appearances: M / S / D / R / F | Top three | New sale proceeds for Lin | Lin’s settlement income |
| --- | --- | --- | --- | --- |
| A: M reaches five first | 5 / 4 / 3 / 1 / 0 | M, S, D | 0 | 2 × 30 + 0 = 60 |
| B: D sells; S then reaches five | 4 / 5 / 4 / 1 / 0 | S, M, D | 8 | 2 × 20 + 0 = 40 |

In B, M and D both have four appearances; M is further left and therefore ranks second. The resulting cash can be settled completely for this segment:

| Player | Cash after A | Cash after B | B minus A |
| --- | --- | --- | --- |
| Lin | 97 + 60 = 157 | 97 + 8 + 40 = 145 | −12 |
| Jo | 97 + 50 = 147 | 97 + 70 = 167 | +20 |
| Mei | 96 + 100 = 196 | 96 + 100 = 196 | 0 |
| Bo | 99 + 20 = 119 | 99 − 8 + 30 = 121 | +2 |

Lin receives an extra 8 in B, but the two M paintings each lose 10 of payout, leaving Lin down 12. Jo does not buy Lin’s D yet gains 20 from the two S paintings. Bo’s purchase leaves Bo up 2. Choosing when to stop the market redistributes returns on assets already sitting on the table.

“Sell one more painting” is therefore an incomplete description of a good action. A designer can ask what an ending trigger does to resources committed earlier, alongside the transaction it prevents. Changing the fifth card to sell before ending the round would add both a payment and a payable asset. That is another rule requiring another comparison; it cannot silently enter A’s ledger.

The table starts from a specified snapshot and checks the actions and settlement shown. It does not enumerate a full physical deal or earlier auctions, nor identify the winner after four rounds. Later rounds will continue changing cash.

## Angle three: History can remain while current eligibility disappears

Consider a separate three-round market record. Each row includes the unbought card that triggered the ending. We track D’s payout conditions, not a player’s complete auction income.

| Round | Appearances: M / S / D / R / F | D’s rank this round | New value added for D | Payout per purchased D this round |
| --- | --- | --- | --- | --- |
| 1 | 4 / 5 / 3 / 2 / 0 | Third | 10 | 10 |
| 2 | 2 / 3 / 1 / 5 / 4 | Fifth | 0 | 0 |
| 3 | 4 / 2 / 5 / 1 / 3 | First | 30 | 40 |

The earlier 10 survives round two but cannot pay out in that round. Returning to the top three in round three makes it contribute alongside the new 30. [Value across rounds and clearing purchased paintings, PDF p.4](https://www.cmon.com/wp-content/uploads/2023/06/MA_Rulebbok_Artbook_v18-low.pdf)

An easy mistake is to read this as “hold the same D while its value moves from 10 to zero to 40.” No such continuously held painting exists here: purchased paintings leave after each settlement. The artist’s value record and cards not yet offered from hands persist instead. If Lin buys one D each round, the receipts can be 10, zero and 40, but they come from three different paintings, with purchase costs still to deduct.

This offers two independently adjustable design questions: does past achievement persist, and must players qualify again to redeem it? Suppose an original game makes historical rewards payable forever. That removes the second condition. Early accumulation might become more reliable, while later competition might find it harder to affect the leader. These are questions to test, not conclusions that this example proves one system superior.

The art setting invites words such as “popular” and “valuable,” but a player still needs to know exactly which count activates a rule. Separate appearances, purchases and historical value before explaining the next action. “The market likes D” conceals those distinctions. Nor should this constructed market be treated as evidence about real art markets.

## Check your understanding

1. Can Lin withdraw the price of 18 after everyone declines? Not here: Lin must cover that price. Check available cash before announcing it.
2. Does A’s fifth M become another source of income for Lin? No. It changes the ranking without becoming a purchased painting.
3. Why is Lin down 12 in B despite receiving 8? The two earlier M paintings lose 20 of combined payout; the extra 8 offsets only part of it.
4. Can a discarded round-two D return for another payment when D pays 40 in round three? No. Historical value persists; the old asset has left.
5. Does the second comparison prove that Lin should always end a round immediately? No. Its holdings, responses and first-round conditions are fixed; it supports that segment alone.

## Edition and sources

- [CMON: Modern Art product and rules entry](https://www.cmon.com/products/modern-art/): designer, base product and card quantities. Artist names from other editions are not substituted.
- [CMON English Rulebook / Artbook, file v18](https://www.cmon.com/wp-content/uploads/2023/06/MA_Rulebbok_Artbook_v18-low.pdf): PDF p.2 for initial state, units and components; p.3 for payment and fixed pricing; p.4 for endings, ties, clearing and cumulative value; p.5 for board order and the four-round outcome. Locators are PDF page positions; the upload-path year is not asserted as a printing date. All three examples and their design analysis are our own, not reproductions of rulebook examples.
