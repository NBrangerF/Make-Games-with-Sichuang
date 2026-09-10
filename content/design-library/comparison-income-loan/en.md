# Receiving three coins now: do income and a loan leave the same result?

Three extra coins can make an otherwise unaffordable project available under either rule. The difference may emerge only at settlement: does the money carry an obligation, and can the points you earn satisfy it?

This page compares scheduled income with no repayment obligation against a single loan. That narrows the question; it does not claim that all income and loans in board games form mutually exclusive categories.

## One funding step, one project, one settlement

This is an original local phase for one player, using fictional game coins. Start with 3 coins and 0 points; the shared bank holds 30 coins. All rules, projects, and returns are public, with no random events. Track coins separately from points. Points cannot pay any cost.

First comes funding: accept 3 coins from the bank or decline them. Decide once. This does not consume the project opportunity, and accepting only part of the amount is not allowed. Acceptance leaves 6 coins in hand; declining leaves 3.

Next choose one project from the table, or do nothing. Each project can be completed at most once, and this phase provides only one project opportunity in total. Immediately pay the full cost to the bank. There is no credit purchase: an unaffordable project cannot be chosen.

| Project | Pay immediately | Coins received from the bank at settlement | Points earned at settlement |
|---|---:|---:|---:|
| Large project | 6 coins | 2 coins | 7 points |
| Small project | 3 coins | 4 coins | 1 point |
| Do nothing | 0 | 0 | 0 |

After choosing, settle in this order: receive the project's coins and points, process any repayment required by this version, then add 1 point per remaining coin and end. There is no second project, advance payment of returns, conversion between points and coins, or other income. Bank coins do not score for the player. The bank can fund every route listed here.

In the base version, the three coins are scheduled income. Accepting them creates no repayment or point penalty. The loan version changes only the obligation attached to this funding; the amount and arrival time remain the same.

## Income version: nine points for the large project, eight for the small

Accept 3 coins, leaving 6. Pay all 6 for the large project, leaving 0. At settlement receive 2 coins and 7 points. There is no repayment deduction, so finish with 7 + 2 = 9 points. The bank moves from 30 to 27, then 33, then 31 coins. The player's final 2 plus the bank's 31 preserve the initial total of 33.

Reset and accept the same 3 coins, but choose the small project. Pay 3 and retain 3. Receive 4 coins and 1 point at settlement, leaving 7 coins. Finish with 1 + 7 = 8 points. Comparing complete routes, the large project gains one point, not the six-point difference between project rewards alone.

If funding is declined, only the small project or doing nothing is available. The small project consumes the initial 3 coins and returns 4 coins plus 1 point, for a final score of 5. The large project cannot start. Its later two-coin return cannot be spent in advance.

## Attach a four-coin settlement obligation to those same three coins

Reset the opening state for the loan version. Funding still offers 3 coins or the option to decline. Change only this: acceptance creates an obligation to repay 4 coins after the project's return arrives. Three are the borrowed amount; the other one is a fixed fee in this example. There is no per-round compounding or other loan.

If sufficient coins are available, repay 4. Otherwise give the bank every coin in hand and lose 2 points for each unpaid coin. Points may fall below zero. After repayment and shortfall penalties, still add 1 point per remaining coin as specified in the settlement sequence, then end the phase. No shortfall carries into another phase. The project's seven-point reward cannot settle a cash obligation. Deliberately underpaying to retain coins is not allowed.

Again accept 3 coins and take the large project. Pay all 6. Settlement delivers only 2 coins and 7 points. Four coins are due, but only two are available: repay 2, leave a shortfall of 2, and deduct 4 points. Retain no coins and finish with 7 − 4 = 3 points.

Accept 3 coins and instead take the small project. After paying 3, retain 3. Settlement adds 4 coins and 1 point, bringing cash to 7. Repay 4, retain 3, and finish with 1 + 3 = 4 points, with no shortfall. **The large project's former 9-to-8 advantage has become a 3-to-4 disadvantage.** Borrowing makes it possible to start the large project; it does not guarantee a better final result.

| Fixed route | After project return: coins / points | Income version: final score | Loan version: repayment and shortfall | Loan version: final score |
|---|---|---:|---|---:|
| Accept 3, large project | 2 coins / 7 points | 9 | Repay 2; shortfall 2 costs 4 points | 3 |
| Accept 3, small project | 7 coins / 1 point | 8 | Repay 4; no shortfall | 4 |
| Accept 3, no project | 6 coins / 0 points | 6 | Repay 4; no shortfall | 2 |
| Decline 3, small project | 4 coins / 1 point | 5 | No loan obligation | 5 |
| Decline 3, no project | 3 coins / 0 points | 3 | No loan obligation | 3 |

These five routes cover every legal funding-and-project combination in this example. The income version's maximum is 9; the loan version's maximum is 5, achieved by declining the loan and taking the small project. An optimum can be calculated here because no return or opponent action is hidden. It is specific to this state.

## Check payment capacity and the way obligations are resolved

Accepting funding increases cash from 3 to 6 in both versions and makes the same projects available. The difference comes from the later obligation, especially this example's shortfall penalty. Most of the large project's return is points, which cannot pay a cash debt. The small project earns fewer points but provides enough cash to repay.

A loan settled through a fixed final point penalty, or through reduced future income, would produce another comparison. Those rules would need their own experiment; they cannot silently replace the rules used here. Requiring repayment before project returns arrive would also alter the sequence. This page explicitly repays after receipt.

When designing, keep three records together: cash available now, obligations still to be resolved, and final scoring. Cash alone can overstate the benefit of receiving funds. Final score alone can conceal a payment shortfall along the way. Borrowing may provide emergency support or acceleration, but its value depends on the actual timing, returns, and shortfall procedure.

## Checks with answers

**The large project returns “2 coins + 7 points.” Can the player simply repay 4 in the loan version?** No. Points are not coins. Repay only 2, deduct 4 points for the shortfall, and finish with 3 points.

**After borrowing and doing no project, can the player just return the original 3?** No. The obligation is 4. Pay that from the six coins in hand and finish with 2 points.

**Does declining the loan and taking the small project still incur a loan fee?** No. Declining creates no obligation. The final score is 5.

**Why does the large loan-funded project not score 9 − 4 = 5?** Only two coins are available to repay. The other two become a shortfall charged at two points per coin. The rule does not simply convert the entire obligation into a four-point deduction.

## Sources and scope

Geoffrey Engelstein and Isaac Shalev, *Building Blocks of Tabletop Game Design*, second edition: ECO-05, “Income,” printed pp. 318–319, discusses timing and includes loans within its broad treatment of resource inflows. ECO-07, “Loans,” pp. 322–323, discusses borrowing's uses and arrangements involving repayment, ongoing charges, reduced income, or final point deductions.

Scheduled income without repayment is therefore a specific comparison rule on this page, not the whole scope of the book's Income entry. The projects, values, fixed fee, shortfall penalty, and calculations are original to this site. They explain a fictional game state, not real-world financial decisions or a reconstruction of the book's example games.
