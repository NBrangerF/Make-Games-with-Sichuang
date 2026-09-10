# Prototype for a question: which details must remain this time?

Paper pieces and coins can support careful rule checks, yet still omit information essential to a different question. A prototype's adequacy depends on the relationships it preserves, as well as its level of finish.

## A small game you can run independently

This is this site's original *Book Cart* v1.0, separate from the main course's river-crossing example. A and B share one cart, with A acting first and turns alternating. The cart starts empty at Depot 0. The two-way route is Depot 0—Door 1—Reading Corner 2. Two books start at the depot; the cart holds at most two. All information is public.

There are at most six actions in total. Each turn chooses one legal action: load one book at the depot; move to an adjacent location; unload one book at the reading corner; or wait. Each uses one action. Movement does not automatically load or unload. Books can only be loaded at the depot and unloaded at the corner; delivered books cannot be collected again. An unavailable action must be reselected without spending an action. Discussion is allowed; the active player decides.

After each action, both players immediately win if both books have been unloaded at the corner. Otherwise, both lose after action six. There are no individual points, random events, or extra actions.

[Download the English print-and-play: rules, board, and complete variant comparison](/print-and-play/book-cart/en.pdf). The worked example below is complete without printing.

The printable contains three pages: complete rules; route, cargo spaces, cut-out markers, and a record sheet; and a complete comparison with unloading all books at once. Alternatively, draw 0—1—2, use one coin for the cart and two paper pieces for books, and record actions used. Marker numbers identify pieces; they do not give books different powers.

## Check only unloading quantity and action requirements

State the question: “How many actions are needed at minimum if unloading one book becomes unloading all books?” Retain two books, capacity two, two route segments, loading one per action, moving one segment per action, and checking the ending after each action. Change only unloading quantity.

| Action | Base: unload one book | Variant: unload all cargo |
|---|---|---|
| 1 | Load one book | Load one book |
| 2 | Load the second | Load the second |
| 3 | Move to Door 1 | Move to Door 1 |
| 4 | Move to Reading Corner 2 | Move to Reading Corner 2 |
| 5 | Unload one; one remains aboard | Unload both; immediate win |
| 6 | Unload the other; immediate win | Already ended; no further action |

The base requires at least two loads, two moves, and two unloads: six actions. Combining unloading into one action lowers that bound to five. The traces achieve both bounds. Two book markers, a route with an intermediate state, and an action record suffice to verify this, without artwork or a complete event deck.

## Do not simplify away the relationship being tested

Compare two paper prototypes. A retains locations 0, 1, and 2 with two segments. B draws only the depot and reading corner, directly adjacent, while still allowing movement across one segment per action.

A's shortest results are six and five actions. B's one-segment route gives five and four. **B also changes travel distance, so it cannot stand in for checking only the original unloading variant.** Omitting a decorative icon is harmless to this question; removing a required movement changes the model.

A drawing with only two large destinations can still preserve the original relationship if it explicitly tracks two movement actions and represents the intermediate state. The issue is expressible rules and states, not a requirement for three illustrations.

## Another question can require different materials

To ask whether book markers cover the capacity label when placed in cargo spaces, a list of numbers is insufficient. Use spaces and markers close to their intended dimensions and observe them on a table. To ask whether another player knows when it is their turn, also present the turn sequence and decision authority, then observe their use.

The monochrome printable labels actions, locations, and markers with words or numbers to support examination. It does not establish effortless reading or handling for everyone. Rule reasoning and physical-material checks can inform each other without becoming the same kind of evidence.

## Check: why are five action boxes insufficient with two books?

Suppose you test the complete base game but provide only five usable action boxes. You would truncate a legal success that requires six actions. **The missing element is a way to record action six, not a third book or a prettier cart.** Add a clearly labeled sixth box rather than rebuilding every component.

If trying this yourself, state one question and list the states and rules it depends on. Follow the trace, then limit the conclusion to what was actually examined.

## Sources and next steps

Kathleen Mercury's [Prototyping](https://www.kathleenmercury.com/prototyping.html) advocates early materials sufficient to test main ideas. We apply that relationship to prototype fidelity. The cart game, printable, route comparisons, and calculations are original, not copied exercises from books or teaching materials.

Continue to independent rule reading to check written completeness, or to designing for participation to examine actual materials.
