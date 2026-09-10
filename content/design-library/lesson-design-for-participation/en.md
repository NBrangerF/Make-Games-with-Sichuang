# Design for participation: recognizing options is only part of making a decision

Seeing an action card does not ensure that it can be distinguished from others. Distinguishing it does not ensure easy handling or control over the decision. Check these separately to understand what a change supports.

## Establish what the player can choose

This is this site's original *Book Cart* v1.0, separate from the main course's river-crossing example. A and B share one cart, with A acting first and turns alternating. The cart starts empty at Depot 0. The two-way route is Depot 0—Door 1—Reading Corner 2. Two books start at the depot; the cart holds at most two. All information is public.

There are at most six actions in total. Each turn chooses one legal action: load one book at the depot; move to an adjacent location; unload one book at the reading corner; or wait. Each uses one action. Movement does not automatically load or unload. Books can only be loaded at the depot and unloaded at the corner; delivered books cannot be collected again. An unavailable action must be reselected without spending an action. Discussion is allowed; the active player decides.

After each action, both players immediately win if both books have been unloaded at the corner. Otherwise, both lose after action six. There are no individual points, random events, or extra actions.

[Download the English print-and-play: rules, board, and complete variant comparison](/print-and-play/book-cart/en.pdf). The worked example below is complete without printing.

After loading on action one, the cart is at the depot with one book aboard and one still waiting. The next player has three legal choices: load again, move to the door, or wait. Unloading is unavailable at this location.

## What information do two prompt designs preserve?

Consider a constructed printing problem. Three old prompts are identically shaped squares, each labeled only “Action.” Color is their sole difference and position has no fixed meaning. Assume a black-and-white copy makes their grays indistinguishable. The prompts no longer identify load, move, and wait: there are six possible assignments of those three names to the three squares.

The revision adds distinct wording: “Load 1 book,” “Move 1 space,” and “Wait 1 action,” plus relevant location or capacity conditions. Losing color still leaves a one-to-one correspondence through the names, without guessing a color key.

This establishes only that text preserves information under the stated loss-of-color assumption. It does not establish suitable font size, wording, paper, or actual understanding. Readers unfamiliar with the text may need other representations checked as well.

## The choices differ beyond their icons

From that position, the earliest possible completion differs by choice:

| Action two | New state | Earliest finish | Can still win by action six? |
|---|---|---:|---|
| Load another book | Position 0, cargo 2, depot 0 | 6 | Yes |
| Move to the door | Position 1, cargo 1, depot 1 | 8 | No |
| Wait | Position 0, cargo 1, depot 1 | 7 | No |

A prompt should identify actions and conditions rather than silently select the only route that finishes in time. Removing the other two options changes action permissions. That differs from communicating the existing options more clearly.

## Check seeing, handling, expressing, and deciding separately

First ask a reader to identify “Load 1 book,” then explain when loading is legal, then observe execution. With actual materials, examine whether tokens cover text, reaching disturbs other pieces, and components remain distinguishable. These are questions to investigate, not invented success rates.

When help with placement is needed, the active player can point to or state an action, the helper can repeat it and move the pieces, and the active player can confirm. For example, if the player chooses loading, the helper puts the remaining book in the second cargo space. The result is cargo 2 and depot 0. Greater familiarity does not automatically authorize the helper to substitute their own preferred action.

Assisted placement can address some handling demands without solving identification. Text can preserve information without making distant components reachable.

## Check: is enlarging identical gray squares enough?

Under this page's assumption, does enlarging all three identically shaped, identically worded, identical-gray squares identify load, move, and wait? **No; six assignments remain possible.** Size and distinguishing information are separate issues.

Suppose the player chooses waiting but a helper replaces it with loading, leading to success. Does that establish better participation support? **No.** Record the game outcome separately from whose decision was preserved.

## Sources and next steps

Gordon Calleja, *Unboxed: Board Game Experience and Design*, chapter 7, book pages 184–187, discusses relationships among materials, visuals, and mechanisms, including Heiko Günther's account of communicating game information through graphic design. The grayscale assumption, option table, and assisted-placement process are original. The book's interview perspectives are not treated as proven universal usability results.

Next observe actual use with specific materials and questions, rather than assuming one uniform set of beginner needs.
