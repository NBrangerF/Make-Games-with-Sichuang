# Hidden information: after paying to look, who can still act?

A face-down order might be unknown to everyone, or one person may already have seen it. Once revealed, everyone can know the answer while earlier decisions remain locked. Specify the information, its audience, and the decisions still available.

## One order, two sets of tools

This original two-player local phase uses three order cards: Red 1, Red 2, and Blue 1, with indistinguishable backs. Both players know this composition. Shuffle uniformly and draw one face down as the order. Set the other two aside face down; nobody may inspect them. There is no replacement draw.

A and B each start with 1 coin, 0 points, and a red and a blue tool card with indistinguishable backs. The public bank is empty. Coins have no other uses; each coin a player retains at the end scores 1 point.

A first decides whether to pay their coin publicly into the bank, inspect the order privately, and replace it face down. This decision occurs once, with no refund. B has no inspection action. A decides whether to pay before learning the order, so payment itself does not indicate its color in this model.

Both players then secretly commit one tool card face down, keeping the other in hand. Choosing is free. Do not communicate or show the order or tools. Once both choices are committed, reveal the tools and order together; no tool changes are allowed. A matching color scores 4; a mismatch scores 0. Add retained coin points, then end. Played cards stay face up, and money in the bank belongs to neither player. Record each player's phase points, including ties, without imposing a larger game's victory condition.

## The informed player does not always score more

A pays and always chooses a matching tool. B has no information and follows a specified policy: always choose red.

| Order | A's tool and points | B's tool and points | Coins after payment |
|---|---|---|---|
| Red 1 or Red 2 | Red: 4 | Red: 4 + 1 = 5 | A 0, B 1, bank 1 |
| Blue 1 | Blue: 4 | Red: 0 + 1 = 1 | A 0, B 1, bank 1 |

A gains a basis for choosing correctly but spends a coin that could have scored. With a red order, B guesses correctly and retains the coin, scoring 1 more. With blue, A scores 4 while B still scores 1 from the coin. B's total is not 0.

If A declines inspection and always chooses red, the three equally likely orders give an average of **(5 + 5 + 1) ÷ 3 = 11/3**, about 3.67. Always choosing blue gives **(1 + 1 + 5) ÷ 3 = 7/3**. Paying, inspecting, and matching gives 4 in every case: an expected improvement of 1/3 over choosing red without inspection. This calculation depends on the stated pool, price, and scoring. It is not a gain in every individual play, nor an assumption that actual players care only about averages.

## Change only who sees the information

Reset the same pool, coins, and tools. Change the inspection's audience: A still pays 1 coin first, but now reveals the order to both players before either chooses a tool. Keep the price, decision timing, and scoring.

Both can now match the order. Whatever its color, A scores 4 and B scores 4 + 1 = 5. For a blue order, B's result rises from the earlier blind-red policy's 1 to 5. A pays the same coin; the changed relationship is whether the knowledge belongs only to A.

Private inspection has not quietly become free public information. Removing the price would be a second change requiring a separate comparison.

## Map three moments for the same information

| Moment | Who knows the order's color? | What can still change? |
|---|---|---|
| Before private inspection | Neither; both know the pool | A may buy information; neither tool is chosen |
| After A pays and looks privately | A only | Both can still choose their own tool |
| After both commit and everything is revealed | Both | Tools are locked; only scoring remains |

Public knowledge does not necessarily offer an opportunity to use it. The final reveal tells B what went wrong but grants no permission to choose again. To make information support a current decision, connect its arrival to actions that remain available.

For your own position, record what is hidden, who knows its possible range, how someone can learn it, what that costs, and when a decision must be committed. A component can conceal information without defining these rules.

## Check: can B switch after seeing blue?

In the original version, A pays, sees blue, and chooses blue. B has committed red when the order is revealed. Can B switch? **No.** Both choices are locked. A scores 4 and B scores 1.

In the paid public version, do both score 4 when both match? **No.** A has spent the coin and scores 4. B retains a coin and scores 5. Ignoring leftover resources hides the price of information.

## Sources and scope

Geoffrey Engelstein and Isaac Shalev, *Building Blocks of Tabletop Game Design*, second edition, UNC-07 “Unknown Information,” printed pages 286–287, and UNC-08 “Hidden Information,” pages 288–289. The former distinguishes information unknown to all within a known range; the latter discusses information held by only some players and ways of acquiring knowledge. This overview compares those states without treating the entries as synonyms. The order, tools, price, and calculations are original.

No single BGG mechanism is used to label every information arrangement here. Communication limits examines what someone may convey after learning something; the decision-and-reveal comparison follows commitment timing.
