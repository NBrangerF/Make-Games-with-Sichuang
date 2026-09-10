# Observe a turn: record the event before explaining why it happened

“They did not understand the game” is an interpretation, not an action record. Preserve events that another person can check before deciding whether someone misread a rule, misjudged a consequence, or deliberately tried another route.

## The shared position

This is this site's original *Book Cart* v1.0, separate from the main course's river-crossing example. A and B share one cart, with A acting first and turns alternating. The cart starts empty at Depot 0. The two-way route is Depot 0—Door 1—Reading Corner 2. Two books start at the depot; the cart holds at most two. All information is public.

There are at most six actions in total. Each turn chooses one legal action: load one book at the depot; move to an adjacent location; unload one book at the reading corner; or wait. Each uses one action. Movement does not automatically load or unload. Books can only be loaded at the depot and unloaded at the corner; delivered books cannot be collected again. An unavailable action must be reselected without spending an action. Discussion is allowed; the active player decides.

After each action, both players immediately win if both books have been unloaded at the corner. Otherwise, both lose after action six. There are no individual points, random events, or extra actions.

[Download the English print-and-play: rules, board, and complete variant comparison](/print-and-play/book-cart/en.pdf). The worked example below is complete without printing.

## Two constructed traces, not human playtest records

Both columns below are invented demonstrations. The first continues loading on action two; the second leaves the depot early. Recording the state after each action reveals where they diverge.

| Action | Fill the cart first | Leave with one book |
|---|---|---|
| 1 | Load: position 0, cargo 1, delivered 0 | Load: position 0, cargo 1, delivered 0 |
| 2 | Load: position 0, cargo 2, delivered 0 | Move to 1: cargo 1, one book still at depot |
| 3 | Move to 1: cargo 2, delivered 0 | Move to 2: cargo 1, delivered 0 |
| 4 | Move to 2: cargo 2, delivered 0 | Unload: position 2, empty, delivered 1 |
| 5 | Unload: cargo 1, delivered 1 | Move to 1: empty, delivered 1 |
| 6 | Unload: delivered 2, shared win | Move to 0: one book at depot, shared loss |

“On action two, the cart moved from 0 to 1 carrying one book, leaving one at the depot” is a checkable event. It does not tell us whether the player forgot capacity, deliberately explored, or expected automatic loading when passing the depot.

## Move from a record to a conditional conclusion

After action two in the early-departure trace, the cart is at 1 with one book, another remains at the depot, and four actions remain. Even turning back immediately requires six more: return to 0, load, move to 1, move to 2, unload, unload. The earliest possible finish from that state is action eight, beyond the six-action deadline.

This supports “the choice made the current objective impossible before the deadline.” It does not support “the player was careless,” or establish from one failure that the game should be easier. Whether they understood the consequence and what they intended require further observation or questions.

## Compare two ways of recording

| Judgment alone | A record that supports further work |
|---|---|
| The player cannot load properly | On action two they moved with spare capacity; one book remained at the depot |
| The first playtest was too hard | This constructed trace ended after action six with one book delivered |
| Add two turns | The shortest recovery needs six actions, with only four available; extending time is a candidate to compare |

In an actual observation, record the rule version, actions, resources, and sequence. Separate the player's words from your interpretation. Mark uncertainty rather than inventing intent. Shortest-path calculation can verify rule consequences, but cannot replace that evidence.

## Check: does turning back immediately rescue the game?

After action two in the early-departure trace, return to the depot on action three. Can both books arrive by action six? **No.** Loading, two moves, and two unloads still remain, producing an earliest finish at action eight. Recognizing a mistake differs from having enough time to recover under the rules.

Optionally play through both columns and write a sentence containing only actions and states. No submitted exercise is required to continue reading.

## Sources and next steps

Kathleen Mercury's [Providing Feedback on Prototypes: the WINQ](https://www.kathleenmercury.com/providing-feedback-on-prototypes-the-winq.html) emphasizes specific problem descriptions. The event/interpretation distinction, routes, and recovery calculations here are our original teaching treatment, not her lesson text or actual student data.

Continue to independent rule reading to check completeness, then to using feedback to choose which explanation to investigate.
