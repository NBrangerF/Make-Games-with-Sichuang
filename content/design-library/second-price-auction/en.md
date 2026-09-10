# Second-price auctions: can you still afford to use what you win?

A second-price auction separates two numbers: the highest bid determines the recipient, while other bids determine payment. It does not award the item to the second bidder, nor find the second-largest number after removing duplicates. Resolve the price, then check whether the item can actually be used.

## Three players, one device, one later action

This is an original, complete local sequence, not commercial game rules or a complete match history. A has 8 coins, B has 7, C has 6, and the bank has 9: 30 coins in total. Everyone starts at 0 points. There is one device. Budgets, rewards, and rules are public; only the current bids are temporarily hidden. There are no loans, transfers between players, or later auctions.

Each player secretly writes one integer bid, then all reveal together. Zero means not participating. A participating bid must be at least 2 and cannot exceed its player's current coins. The reserve price of 2 is an explicit addition in this example. A bid of 1, a negative bid, or an unaffordable bid is illegal and must be corrected before submission; it cannot produce a sale.

The highest positive bidder receives the device. Ties at the highest bid favor A, then B, then C. The winner pays the bank the larger of the reserve price of 2 and the highest bid from another participating player. A sole participant pays 2. With no participants, remove the device and charge nobody. Losers pay nothing. Equal bids occupy separate places in the ordering: with 6, 6, and 2, the winner pays 6.

Within this example's legal bid range, every participant meets the reserve, and the winner bids at least as much as each opponent. Payment therefore cannot exceed the winner's own bid or budget. Affording the auction payment does not reserve any money for using the device.

After payment, A, B, and C each take exactly one action in that order. The device holder may pay 2 coins to activate it for 9 points. Anyone may pay 5 coins to complete a commission for 7 points. Passing is also allowed. Unaffordable actions are illegal; payment cannot be deferred. Activating and completing a commission are mutually exclusive. Activation consumes the device; an unused device is discarded at the end. Neither has residual value. Each player may complete at most one commission, with three available. All costs go to the bank. End immediately after the three actions. Each player's result is earned points plus remaining coins. Record individual results, treating equal totals as ties; there is no extra ranking reward.

## Two complete routes: a different recipient, the same personal score

Route one uses bids A 7, B 5, C 2. A wins and pays 5, retaining 3. A pays 2 to activate, retaining 1 and earning 9 points, for a final 10. B completes a commission, retaining 2 and earning 7, for 9. C completes a commission, retaining 1 and earning 7, for 8. The bank ends with 26 coins and the players with 4, preserving 30.

Reset the start. Route two uses bids A 4, B 5, C 2. B receives the device and pays 4, retaining 3; activation leaves 1 coin and 9 points, for 10. A completes a commission, retaining 3 and earning 7, also finishing at 10. C still finishes at 8. The bank's 25 plus the players' 3, 1, and 1 coins totals 30.

| Second-price rule | Device recipient / payment | Final A / B / C |
|---|---|---|
| Bids 7 / 5 / 2 | A / 5 coins | 10 / 9 / 8 |
| Bids 4 / 5 / 2 | B / 4 coins | 10 / 10 / 8 |

These routes fix B's and C's bids and specify the later choices to compare executable results. They do not give A advance knowledge of hidden bids. A loses the auction in the second route but reaches the same 10 points through a commission. Winning an auction and increasing a score are separate events.

## Change only payment: the winner pays their own bid

Return to bids of 7 / 5 / 2. Keep all other rules and sequencing, but charge the winner their own bid. A still gets the device, pays 7, and has only 1 coin left. Neither activation nor a commission is affordable. A must pass, discard the device at the end, and finish at 1. B and C still complete commissions for 9 and 8. The bank holds 26, while the players retain 1, 2, and 1 coins.

The same final distribution of coins can accompany different device use and points. The reward did not shrink: payment crossed the threshold needed to afford the 2-coin activation. Holding bids fixed also does not mean players would still bid 7 after learning the new payment rule.

## Before bidding “true value,” specify what value means

The book discusses second-price auctions and truthful valuation. Add the assumptions of one item with a fixed personal value, players caring only about their own item value minus payment, each coin lost costing exactly one point, and no later costs, combinations, effects from an opponent obtaining the item, or budget obstacles, and require that the value can be expressed as a legal bid. Under those assumptions, bidding one's value avoids losing an affordable favorable deal through a lower bid and avoids paying above that value through an excessive bid. A value below the reserve can instead be expressed by not participating. This is a conditional strategic explanation, not advice to copy an item's printed points in every game.

Here, A's device shows 9 points but requires another 2 coins and one action. Without winning, a commission gives A 8 − 5 + 7 = 10. Winning and affording activation yields 8 − payment − 2 + 9, or 15 minus payment. Paying 5 merely ties the commission; paying 6 yields 9 points. Paying 7 prevents activation altogether. Nine is not a bid to copy directly and exceeds A's budget of 8 anyway.

Combinations, a later auction, or a ranking objective would require another comparison of the opportunities forgone. We assign no probabilities to opposing bids and establish no claim that one auction is fairer, faster, or more popular.

## Checks: resolve the boundaries

1. **With bids 6 / 6 / 2, does A pay only 2?** No. A wins by priority, but the other 6 remains, so A pays 6. A activates with the remaining 2, ending with 9 points and no coins. B and C complete commissions for 9 and 8. A and B tie at 9.
2. **What about 0 / 0 / 0 or 0 / 0 / 2?** All zero means no sale; commissions produce 10 / 9 / 8. If only C bids 2, C pays 2 and retains 4, then activates and retains 2, finishing at 11. A and B still finish at 10 and 9. The reserve does not charge an auction with no participants.
3. **Must A pay 8 after bidding 8?** No. Against B 5 and C 2, A still pays 5. But possibly paying less does not make a bid of 9 legal or ensure that activation will always be affordable.
4. **Does increasing your bid always increase your payment?** While you remain the unique winner and other bids stay fixed, payment here stays unchanged. A bid change can instead change the recipient or create a tie at the highest bid, requiring the full rules to be applied again.

## Sources and classification scope

Geoffrey Engelstein and Isaac Shalev, [*Building Blocks of Tabletop Game Design*, second edition](https://doi.org/10.1201/9781003179184), AUC-09 “Second-Bid Auction,” printed pages 379–381, discusses payment from the second-highest bid, valuation strategy, and information and timing in digital bidding. The reserve, device uses, routes, and analysis of strategic assumptions are original to this site. This page covers one item; it does not treat a uniform-price auction for multiple items as the same rules.

[BGG: Auction / Bidding](https://boardgamegeek.com/boardgamemechanic/2012/auction-bidding) is a verified broad classification identity, mapped here only as related. The payment rules and scope specified above apply; the broad label cannot replace them.
