# Dice allocation: use the highest value alone, or save it for a combination?

The results are 1, 3, and 5. Five looks attractive as a single reward, but combining it with 1 reaches another action's requirement of 6. Where to use the results remains a decision after rolling.

## Three dice, three work areas

This original solo local phase starts with three dice already showing 1, 3, and 5. All values are public and your score is 0. No further rolling or changing faces is allowed. Dice remain distinct physical objects even when values match.

Three public work areas may each be used at most once this phase.

| Work area | Dice required together | Immediate points |
|---|---|---:|
| Inspect | One die showing exactly 1 | 4 |
| Deliver | Two dice totaling exactly 6 | 8 |
| Store | Any one die | That die's value |

Allocate in any legal order. Put all dice required for an action into one unused area, then receive its effect. Placed dice cannot be retrieved, moved, or reused elsewhere. You may stop. Stopping or using every die ends the phase; record accumulated points. Unused dice score nothing. You need not fill every work area.

## What remains after storing the 5?

Store the 5 for 5 points. The remaining 1 and 3 cannot total the required 6 for delivery. Inspect with the 1 for another 4. Store has already been used, so the 3 remains outside. Total: 9. You cannot retrieve the stored 5 to deliver with the 1.

Alternatively, deliver with 1 and 5 for 8 points, then store the 3 for 3 more. All dice are used, scoring 11. Inspect stays unused because delivery consumed access to the required 1.

The tradeoff is each die having only one use. Delivery's 8 points are not a free addition to the earlier 9. It takes the 1 needed for inspection and changes what remains for storage.

## Change only the delivery total to 8

Reset the dice to 1, 3, and 5 and empty the work areas. Change delivery's requirement from exactly 6 to exactly 8. Now 1 plus 5 is invalid, while 3 plus 5 qualifies.

Deliver with 3 and 5 for 8, then inspect with the remaining 1 for 4. Total: 12, with Store unused.

| Delivery requirement | Delivery combination | Best use of the remaining die | Total |
|---|---|---|---:|
| Exactly 6 | 1 + 5 | Store the 3 for 3 points | 11 |
| Exactly 8 | 3 + 5 | Inspect with the 1 for 4 points | 12 |

For these known results, the larger required total leaves a more useful die. This does not establish that raising a requirement always improves rewards. Without a qualifying combination, delivery would be unavailable. Comparing every possible roll would require specifying the dice's faces and sampling assumptions, then calculating those cases separately.

## Values can perform different jobs

Store interprets a value as reward. Inspect uses it as an entry condition. Deliver uses several values as a combination requirement. All use dice but ask different questions. Before valuing a high roll, ask what it means at the relevant work area.

There is no rerolling, value adjustment, shared workspace, or opponent blocking here. Adding any of these requires reconsidering the combinations. Allocation also differs from a roll that forces one automatic action: this phase reveals results before you choose their destinations.

Additional dice and areas can expand feasible combinations and the number players need to examine. Whether actual players become more engaged or wait longer requires observing their decisions. No human playtest is reported here.

## Check: can two 1s do separate jobs?

Restore delivery's requirement of exactly 6 and consider dice already showing 1, 1, and 5. Can one 1 deliver with the 5 while the other performs inspection? **Yes, for 12 points.** Delivery uses two physical dice; inspection uses the third.

Can the same physical 1 support both delivery and inspection? **No.** Equal values do not duplicate objects. When two results both say “1,” identify which die goes where.

## Source and classification

Geoffrey Engelstein and Isaac Shalev, *Building Blocks of Tabletop Game Design*, second edition, WPL-04 “Workers-As-Dice,” printed pages 415–416. It discusses values affecting worker qualifications, combinations, or effectiveness, and different ways dice faces change. These work areas, requirements, values, and allocations are original.

[BGG: Worker Placement with Dice Workers](https://boardgamegeek.com/boardgamemechanic/2935/worker-placement-with-dice-workers) provides a related classification identity. This page focuses on allocating known results; it does not require competition over shared spaces or treat the category name as a complete rule set.
