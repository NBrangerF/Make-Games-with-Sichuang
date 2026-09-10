# Choose a mechanism: compare how it solves the same problem

Valley Post has one urgent parcel that either player could take. You could let the first player choose, or ask players to bid. Before choosing an appealing label, calculate what each method allocates and what it costs.

## Fix what needs allocating

This is a new original local experiment. No points carry over from the previous lesson. Lin and Qiao each have 2 time tokens and 0 points; holdings are public. An urgent parcel is worth 2 points and an ordinary parcel 1. Each player ultimately receives one parcel, with no exchanges. Parcels score immediately. After both are allocated, the phase ends and each remaining time token gives its holder 1 additional point. There are no further rounds. We compare phase totals without declaring a winner of an unspecified larger game.

“Time token” is a fictional resource name here, not a claim about actual delivery times. Both proposals use the same resources, parcels, and end scoring. They differ in how players acquire parcels.

## Proposal one: choose in order, for free

Lin acts first, then Qiao. Each must take a parcel card still on the table. Taking it costs no time tokens. Lin selects the urgent parcel for 2 points; Qiao takes the remaining ordinary parcel for 1. Both retain 2 time tokens, adding 2 points each at the end. Totals: Lin 4, Qiao 3.

Lin could instead take the ordinary parcel, producing Lin 3, Qiao 4. With no other objectives or reward differences, Lin should choose the urgent parcel to maximize this phase's own score. This proposal gives priority through turn order.

## Proposal two: bid secretly for the urgent parcel

Each secretly writes an integer of 0, 1, or 2. Choices become fixed when written, then are revealed together. The higher bidder receives the urgent parcel and pays that many time tokens to a shared spent-token area. The other player pays nothing and receives the ordinary parcel. On a tie, Lin receives the urgent parcel and pays Lin's own bid. This includes two bids of 0, so both parcels are always allocated. These are explicit rules for this experiment, not universal auction rules.

Suppose Lin bids 1 and Qiao bids 0. Lin receives 2 parcel points, pays 1 token, and retains 1. Qiao receives 1 parcel point and retains both tokens. Final totals are Lin 2 + 1 = 3 and Qiao 1 + 2 = 3. Receiving the higher reward does not guarantee the higher total.

| Specified sequence | Urgent parcel recipient | Tokens remaining, Lin / Qiao | Phase totals, Lin / Qiao |
| --- | --- | --- | --- |
| Free selection; Lin takes urgent first | Lin | 2 / 2 | 4 / 3 |
| Lin bids 1; Qiao bids 0 | Lin | 1 / 2 | 3 / 3 |
| Lin bids 2; Qiao bids 0 | Lin | 0 / 2 | 2 / 3 |

The third row shows a cost changing the final result. It does not recommend bidding 2. Rather, accounting for the remaining resource's use reveals what the bid gives up.

## Now give a reason for choosing

If the design question is “How can allocation be easy to explain without adding payment rules?”, free selection is worth trying. Its cost is that a later player may have only one option. Turn order and option values still need attention.

If the question is “How can players spend a known resource to compete for a particular item?”, bidding supplies that action. You also need to explain secret commitment, reveal, payment, ties, and the use of leftover resources. Turn order is no longer the only allocation condition, but ties still favor Lin here. Bidding has not automatically removed priority advantages.

The current values do not yet create a strong reason to raise a bid. If each player only maximizes their own phase score, Lin scores at least as much by bidding 0 as by bidding 1 or 2. For Qiao, bids of 0 and 1 give the same score against every opposing bid, and bidding 2 never improves it. This example demonstrates allocation and payment without creating an incentive to raise a bid for a higher net score. To examine that tradeoff, change the reward gap, resource uses, or other explicit conditions, then calculate again.

This compares design proposals rather than changing only one variable. The second proposal changes information, allocation, and cost together. Its table establishes specified outcomes, not which change would make real players more engaged. No participant test has taken place.

## Check: the payment rule is part of the answer

In the bidding proposal, both players bid 1. Who gets the urgent parcel, who pays, and what are the final totals? Compare this with both bidding 0.

At 1 / 1, the tie rule gives Lin the urgent parcel. Lin pays 1; Qiao pays nothing. Totals are Lin 2 + 1 = 3 and Qiao 1 + 2 = 3. At 0 / 0, Lin still receives the urgent parcel, but nobody pays. Totals are Lin 4, Qiao 3. Do not import the “no allocation when all bids are zero” rule from a different auction example.

## Make only enough to compare

Two parcel cards and four tokens suffice to replay these sequences. For your design, write what you want allocation to change, then list the decisions each proposal adds. Your conclusion may be that more evidence is needed or that one proposal is easier to run now. You do not need to choose a mechanism first and then find a purpose for it.

## Sources and scope

In [Choosing Your Mechanics](https://www.kathleenmercury.com/choosing-your-mechanics.html), Kathleen Mercury describes trying a theme with different mechanisms, comparing through sketches, and moving to prototypes. The allocation rules, resource values, and calculations here are original. We do not reproduce her exercises or treat a classroom arrangement as a fixed process suitable for everyone.
