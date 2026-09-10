# Auctions: design bidding, allocation, and payment separately

“Players bid for an item” is not yet an executable rule. What they bid, who receives the item, and who actually pays how much are separate decisions. Distinguishing them reveals how an auction changes later opportunities.

## Resolve one complete auction

This is an original local phase, not a rule from a commercial game. A and B each have five coins and compete for one item. Their budgets are public; their bids are initially hidden. Each writes a whole-number bid from zero up to their current budget, then they reveal together. Zero means passing. The highest positive bid wins, with A winning ties. If both pass, nobody receives the item and nobody pays. Only the winner pays, sending their own bid to the bank. The loser keeps their entire budget. Allocation and payment end the phase.

A bids four and B bids three. A receives the item, pays four to the bank, and retains one coin. B retains five. The players hold six coins and the bank holds four, preserving the initial ten. The example specifies neither the item's later use nor final victory.

The bid limit is an affordability rule: bidding six with a budget of five is illegal. Players should be able to check their budgets before revealing, rather than discover afterward that a declared bid cannot be paid.

## Name the three decisions

**Sealed bidding** describes information and commitment: players first hide their bids, then reveal them. It does not itself specify whether losers pay.

**The highest bidder wins** is an allocation rule. Budgets, the number of items, and ties still need their own conditions.

**The winner pays their own bid** is this example's payment rule. Paying the bank is also specified. Paying another player instead would change the distribution of later budgets. Knowing who wins does not tell us where the money goes.

## Keep the bids and change the payment

Keep budgets, hidden bids, revealing, allocation, and ties unchanged. Change only the winner's payment: pay the other bid, with a minimum of one coin. If nobody participates, nobody pays.

Use the same bids of four and three. A still receives the item, but pays three and retains two coins. B still has five. The bank receives three. Seven held by the players plus three held by the bank still totals ten.

| With bids of 4 and 3 | Pay your own bid | Pay the other bid, minimum 1 |
|---|---|---|
| Item recipient | A | A |
| A's payment | 4 | 3 |
| A's remaining budget | 1 | 2 |
| B's remaining budget | 5 | 5 |

With two bidders and one item, the other bid is the second-highest bid. **The one-coin minimum is an explicit additional rule of this constructed variant.** It is not part of every second-price auction's definition.

If a later auction again limits bids to current budgets, A could then bid at most one or two, respectively. That legal limit follows from the example. A's later choice, the next item's value, and the next winner do not.

## Why this does not identify the best auction

The comparison holds bids fixed to isolate the payment rule's effect. Players may change their bids when the actual rules change. A paying one coin less here does not establish that this variant always saves players money or is necessarily fairer.

We also have not specified an item value, so we cannot judge whether bidding four was wise. An item might combine with something already owned, prevent an opponent completing a goal, or compete with other demands on the same budget. Its uses and opportunity costs then matter. State those conditions before applying a strategic conclusion that depends on particular economic assumptions.

An auction can also take time at the table. Writing one bid and revealing removes repeated raising steps, but may require bidding components, explanations of ties, or the correction of invalid bids. Fewer written steps do not establish faster understanding by players.

## Costs and common confusions

Bidding can let players express how many resources they are willing to give up. A bid is not a direct measurement of how much someone truly likes an item. Limited money, future purchases, or a wish to make an opponent pay more may affect it.

Allowing players to raise public bids changes the information available during the process. Requiring everyone to pay changes the loser's cost. These are different modifications, not a single “more intense” version. Examining one relationship at a time makes resulting differences easier to explain.

Secretly writing a price is also different from secretly choosing any action. For this page's bidding analysis to have a clear object, bids must participate in allocating an item, opportunity, or priority.

## Check passing and ties

Retain the five-coin budgets and A's tie priority. Under the second payment rule, what does A pay after bidding four against B's zero? What if both bid three? What if both bid zero?

**Answers:** Against zero, A pays one and retains four; B keeps five. The minimum payment applies. With both bidding three, A wins the tie, pays three, and retains two; B keeps five. With both bidding zero, nobody receives the item or pays. Do not apply the one-coin minimum to an auction with no participating bidder.

## Bring the question to your design

Write four lines beside the prototype: what is being allocated, how bids are made, how the recipient is chosen, and who pays whom how much. Resolve one concrete set of bids, then a tie and an all-pass result. Observe whether players can identify their possible costs before bidding. If those costs only become clear afterward, examine the explanation and information display before replacing the whole auction system.

## Sources and scope

Conceptual research draws on Geoffrey Engelstein and Isaac Shalev, *Building Blocks of Tabletop Game Design*, second edition, chapter 8: AUC-04, “Sealed-Bid Auction,” and AUC-09, “Second-Bid Auction.” This page uses the distinction between the bidding process and changes to payment. Its situations, minimum payment, and comparisons are original constructions, not reproductions of game rules in the book.

[BGG: Auction / Bidding](https://boardgamegeek.com/boardgamemechanic/2012/auction-bidding) is an overview classification reference. It does not replace a particular auction variant's complete operating conditions.
