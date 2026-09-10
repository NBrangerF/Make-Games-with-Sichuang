# Market pricing: do both items cost the starting price?

If purchases raise prices, specify whether the rise happens after the transaction or after each item sold. That timing alone can change how much the next player can afford.

## Four goods and two buyers

This original two-player mini-round has 4 identical goods in a public market, priced at 1 coin each. A and B each start with 6 coins and no goods. Everything is public. A makes one purchase, then B makes one purchase, and the round ends. A purchase may contain 0, 1, or 2 goods, limited by stock. Its full cost must be affordable; otherwise that quantity is not a legal option. Buying zero costs nothing and does not change the price.

The first version quotes a whole transaction at its starting price: quantity multiplied by the current unit price. Payment returns to the supply and goods enter the buyer's private holdings. After the transaction, increase the unit price by the number sold. There is no restocking, selling back, or borrowing. The price track covers 1–5.

At the end, each privately held good scores 3 and each remaining coin scores 1. Unsold goods score nothing. Higher score wins; equal scores draw.

## Fix both players to buy up to two

Use this specified choice sequence to track the rules: buy 2 if affordable; otherwise buy as many as affordable. This is not a universal optimal strategy.

A buys 2 at price 1, paying 2 and keeping 4 coins and 2 goods. The price becomes 3 and 2 goods remain. B buys 2 at price 3, pays 6, and keeps no coins. The price becomes 5 and the market empties.

A scores 6 for goods plus 4 for coins, totaling 10; B scores 6. Here the price changes after the entire transaction. Charging A 2 coins for the second item would apply a different rule.

## Change only to repricing after each item

Reset the start. Now pay the current price for an item, increase the price by 1, and only then calculate the next item's cost. A purchase still contains at most two items. Calculate its complete incremental cost before choosing a quantity; it must be affordable.

A pays 1 + 2 = 3 for two goods, keeping 3 coins. Two goods remain at unit price 3. B would need 3 + 4 = 7 for both but has only 6, making quantity two illegal. Following the specified sequence, B buys one for 3 and keeps 3 coins. One good remains at unit price 4.

| Pricing rule | A's cost / goods | B's cost / goods | A's score | B's score | Unsold goods |
|---|---|---|---:|---:|---:|
| Starting price for whole transaction | 2 / 2 | 6 / 2 | 10 | 6 | 0 |
| Reprice after each item | 3 / 2 | 3 / 1 | 9 | 6 | 1 |

B happens to score 6 in both versions with different holdings: two goods originally, versus one good and three coins. Final scores alone conceal changes in affordability and stock. In the revised version, B could also buy nothing and keep 6 coins for the same 6 points.

## Prices need information and boundary rules

All prices here are calculable. There is no negotiation or random fluctuation; completed purchases cause the change. Adding selling back requires a sale price, track boundaries, and a rule on buying and selling in one action. Do not assume the purchase price is also the sale price.

The book's Market category emphasizes changing prices. An everyday “shop” may instead have fixed prices. This example teaches variable-price resolution without requiring every facility called a market to use it.

## Check: what if B starts with one extra coin?

Give B 7 starting coins, keep incremental pricing, and let A buy two as before. B can now pay 3 + 4 = 7 for two goods, keeping no coins and scoring 6. **The extra coin makes quantity two legal without necessarily adding a point to the final score.** Under whole-transaction pricing, two goods would cost B 6, leaving 1 coin for 7 points.

## Sources and classification

Geoffrey Engelstein and Isaac Shalev, *Building Blocks of Tabletop Game Design*, second edition, ECO-03 “Market,” printed pages 312–314, discusses variable prices and explicitly distinguishes adjusting prices after a batch from adjusting after each unit. All goods, prices, budgets, scoring, and traces here are original to this site.

“Market pricing” is our teaching label for this mechanism. This page does not claim an exact scope match with a BGG category.
