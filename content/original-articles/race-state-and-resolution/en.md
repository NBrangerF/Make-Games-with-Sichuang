# The pawn can stay still while the game changes

In C, a pawn is at 23 and the dice show 2 and 6. The player selects 2, which would overshoot 24, so the pawn stays at 23. The table seems unchanged. Letting the player roll again for that reason would silently change the rules.

The turn has been used. The other person now acts. A game state includes more than pawn positions: it also includes whose opportunity it is and which part of resolution has been reached.

## What do you need to remember besides position?

C needs at least the two pawn positions, the active player, this turn’s dice results, whether a result has been selected, and whether the game has ended. Before selection, both results are available. Once selection and resolution are complete, the player cannot return to choose differently.

Results are temporary information within a turn. They do not become owned resources, and an unused die is not saved for later. Separating temporary information from persistent state prevents accidentally inventing storage.

Not every item needs a physical marker. Clear spoken turn-taking may be enough. But when confusion occurs, identifying the missing information is more useful than saying only that the rules are unclear.

## Check the landing before resolving its effect

Use an ordered procedure. Remember the turn-start position, select a result, and check whether it would pass 24. If so, stay at the start position, trigger no space effect, and end the turn. Otherwise move to the calculated landing, resolve its connection if any, then check for arrival at 24.

From 12, using 2 lands at 14 and slides to 4. Using 3 passes 14 and stops at 15 without sliding. A connection entrance must be the final landing of the numbered movement. Merely crossing the drawing cannot determine its effect.

From 21, results of 1 and 3 offer another comparison. Selecting 1 lands at 22 and slides to 12. Selecting 3 reaches 24 and ends the game immediately. The other die is never applied. Players cannot try one movement and then switch because the other outcome looks preferable.

## Endings also require an order

Check the four connections: 3→11, 8→17, 14→4, and 22→12. None of the exits is another entrance, so one transfer completes the move on this board. Check again if you redraw the connections later.

Reaching exactly 24 wins immediately, even if ordinary turn-taking would otherwise give the opponent another opportunity. This differs from completing the current round after someone arrives and then comparing finishers. A later experiment can test that alternative; it should not be introduced during a dispute.

Shared occupancy matters too. Moving to an ordinary space occupied by the other pawn changes only your own position. It does not send the opponent back. Importing capture habits from another familiar race would change both the resulting state and the relationship between players.

## Test boundaries as well as smooth sequences

Prepare four constructed tasks: use 2 from 6; use 3 from 12; use 2 from 23; use 3 from 21. These examine a ladder, passing a snake, overshooting, and immediate victory. Ask the person resolving each task to identify the final positions and the next player. The last task has no next player.

When two people get different results, follow the order—check for an overshoot, move, resolve the connection—and find the first disagreement. You can often clarify that step before changing a die or moving a snake.

Cover the answers and try the four tasks again another day. Clear rules should leave you with a definite position and next player each time. Those results give you something reliable to compare when you examine choices.
