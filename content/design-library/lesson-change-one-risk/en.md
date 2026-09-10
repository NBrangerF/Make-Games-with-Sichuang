# Change one rule: which mistake does one extra action forgive?

The risk here is a tight deadline, not random probability. A game may allow a planned success without tolerating every detour. One extra action need not rescue every departure from the plan.

## Fix the game and the question

This is this site's original *Book Cart* v1.0, separate from the main course's river-crossing example. A and B share one cart, with A acting first and turns alternating. The cart starts empty at Depot 0. The two-way route is Depot 0—Door 1—Reading Corner 2. Two books start at the depot; the cart holds at most two. All information is public.

There are at most six actions in total. Each turn chooses one legal action: load one book at the depot; move to an adjacent location; unload one book at the reading corner; or wait. Each uses one action. Movement does not automatically load or unload. Books can only be loaded at the depot and unloaded at the corner; delivered books cannot be collected again. An unavailable action must be reselected without spending an action. Discussion is allowed; the active player decides.

After each action, both players immediately win if both books have been unloaded at the corner. Otherwise, both lose after action six. There are no individual points, random events, or extra actions.

[Download the English print-and-play: rules, board, and complete variant comparison](/print-and-play/book-cart/en.pdf). The worked example below is complete without printing.

The shortest successful base route is load, load, move to 1, move to 2, unload, unload: six actions. Ask only whether adding one action can prevent a single wait from causing failure. Do not also change capacity, loading quantities, or the route.

## What happens after waiting once?

Fix the choices to one initial wait followed by that delivery route. Execute them separately under six- and seven-action deadlines. The seven-action version is a declared variant, not a continuation after losing the base game.

| Action | Choice and state | Six-action deadline | Seven-action deadline |
|---|---|---|---|
| 1 | Wait; empty cart at 0 | Continue | Continue |
| 2 | Load; cargo 1 | Continue | Continue |
| 3 | Load; cargo 2 | Continue | Continue |
| 4 | Move to 1; cargo 2 | Continue | Continue |
| 5 | Move to 2; cargo 2 | Continue | Continue |
| 6 | Unload; delivered 1 | Shared loss; end | One action remains |
| 7 | Unload; delivered 2 | Already ended; cannot act | Shared win; end |

Adding only one action makes this trace succeed. The original six-step successful route still ends immediately on action six in the variant. Players need not wait merely to spend the entire budget.

## Why does the same change not rescue early departure?

Load one book on action one and move to the door on action two, leaving another at the depot. The shortest recovery is return to the depot, load, move to 1, move to 2, unload, unload: six further actions, finishing no earlier than action eight. **A seven-action deadline is still insufficient.** This is not one extra wait; it adds travel back and out again.

Express spare capacity as deadline minus the minimum required actions. The base successful route has zero spare actions under six and one under seven. Early departure cannot finish before eight, so a deadline of seven remains one short. One spare action does not forgive every possible choice.

## Changing one number can alter other relationships

If the seven-action version reaches its final turn, A gets four action opportunities and B three. The six-action version gives at most three each. Victory remains shared, but who controls the last action changes. Extra actions might also reduce pressure or add repetition; actual participants would need to describe those experiences.

This example establishes a recovery opportunity for the specified wait. It does not turn counts of successful action sequences into a “player win rate.” No probability distribution over players' choices is assumed and no human playtest has been conducted.

## Check: what remains possible after loading one book?

After loading on action one, the next player can load again, move to the door, or wait. With the fastest continuation from each choice, **loading finishes no earlier than action six; waiting at seven; moving out and recovering at eight.** The seven-action limit therefore permits timely success after the first two choices, but not the third.

Make a similarly small table for your design before deciding which pressure to retain. Eliminating every failure need not be the objective.

## Sources and next steps

The rules, shortest paths, and deadline comparison are original. Our teaching approach draws on Kathleen Mercury's [Prototyping](https://www.kathleenmercury.com/prototyping.html), which advocates early prototypes sufficient to examine an idea. The specific risk diagnosis and calculations are not attributed to her.

Next ask an observable question: does the variant help readers recognize that recovery is possible, beyond adding a mathematically available action? That requires an actual test; this calculation has not answered it.
