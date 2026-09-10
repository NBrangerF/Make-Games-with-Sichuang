# After completing a set: connecting points and effects

Collecting the required symbols can score at the end or immediately change what you can do next. Both relationships can exist in the same design. To compare them, specify what forms a set, what it is worth, and whether completing it triggers another effect.

## Two actions at the stamp window

This original example is a single-player local phase with all information public. You start with one red stamp, one ticket, and zero points. The supply holds one blue stamp and three tickets. Stamps and tickets are different objects. Take exactly two actions, each chosen from the legal options below. You may repeat an action if it remains legal.

| Action | Requirement and result |
|---|---|
| Take the blue stamp | If it remains in the supply, take it for free; there is only one in this phase |
| Take a ticket | If the supply has at least one ticket, take one for free |
| Deliver a parcel | If you hold at least two tickets and have not delivered in this phase, return two tickets to the supply and immediately score 5 points |
| Wait | Always legal; changes no objects or points |

There are no other actions, trades, discards, or sources of objects. End the phase after resolving the second action and all its effects. Holding one red and one blue stamp scores 4 points once; a lone stamp scores nothing. Keep the stamps rather than returning them. Each remaining ticket scores 1 additional point. With one player, simply record the final score; there is no separate win condition or next round.

In the base version, completing the stamp set has no immediate effect. The total of four tickets stays constant, split between you and the supply.

## Resolve the base version first

**Blue stamp, then ticket:** The first action completes the red-blue set, but you still have only one ticket. The second action takes a ticket, leaving you with two. At the end, score 4 for the set and 2 for the tickets: **6 points**.

**Ticket, then delivery:** After the first action you hold two tickets. Return both for the second action and score 5 points. You finish with only the red stamp, no set bonus, and no tickets: **5 points**.

“Blue stamp, then delivery” is illegal in the base version: taking the stamp did not give you another ticket. The set's future 4 points cannot pay a cost that currently requires tickets.

## Add only an effect for the first completion

Reset to the initial state. Add just this rule: **When your red-blue set first becomes complete, immediately take one ticket from the supply without spending an action. Mark this effect as used for the phase; it cannot trigger again.** If the supply is empty, take nothing but still mark the effect used. All other actions, the two-action length, the set's 4 points, and remaining-ticket scoring stay unchanged.

With this initial state and two-action limit, the supply always has a ticket when the set first completes. The empty-supply clause defines the effect's boundary; it does not introduce a third action or an extra starting state.

Repeat “blue stamp, then ticket.” Taking blue triggers a ticket, increasing your holding from one to two. Your second action takes another, leaving three. Score 4 for the set plus 3 for tickets: **7 points**. With the same action sequence, the added effect increases the score by 1.

Another sequence is now legal: “blue stamp, then delivery.” The completion effect brings your tickets to two, enough to pay for delivery. Return both and score 5 immediately. You did not spend the stamps, so the completed set still scores 4 at the end: **9 points**. The added effect supplies a resource and lets a later action meet its cost threshold.

| Same initial state | Without a completion effect | With the first-completion effect |
|---|---:|---:|
| Blue stamp → ticket | 6 points | 7 points |
| Ticket → delivery | 5 points | 5 points |
| Blue stamp → delivery | Second action is illegal | 9 points |

Neither version replaces “score 4 for the set” with “gain a ticket for the set.” The ticket is an additional effect; the points remain. Changing the reward type, timing, and consumption of the set together would obscure which rule produced the difference.

## Separate valuation, triggering, and the next action

The valuation relationship is that red and blue together are worth 4 points. The trigger grants a ticket on first completion. The next connection is that tickets can pay for delivery. Delivery is not part of the automatic effect: you must still choose it as your second action. You can instead wait and let the extra ticket score 1 at the end.

This is a short, explicitly prescribed effect chain. It does not demonstrate players discovering and separately acquiring many abilities to assemble a complex combo, or a complete engine that can keep running. It establishes the narrower point that set rewards and connections between actions can coexist. For a fuller ability combination, open the related Combo building entry below.

Set valuation need not mean end-game points: a set can provide resources, immediate points, or other benefits. This example fixes it at 4 end-of-phase points to make the added trigger's effect visible. For different valuation curves, open the related Set Collection entry below.

## Where the chain stops

Taking blue uses an action. The automatic ticket does not, but happens only once. Delivery still uses an action and is allowed only once. The phase ends after the second action resolves. Final scoring checks the set; it does not create another “first completion.” Spending tickets neither removes stamps nor completes the set again.

There is no infinite loop here because the specified object movements and trigger limits prevent repetition. If later abilities return stamps, reacquire them, or grant new actions after delivery, you must trace the triggers and stopping conditions again.

Nine exceeding six is a calculation for this fixed phase. It does not establish that the new effect makes a whole game more enjoyable or balanced, or always broadens choices. A stronger route may make other routes less appealing. In a real test, first record whether readers distinguish automatic effects from chosen actions, then observe whether they still have reasons to consider other routes.

## Check yourself: what if you take a ticket first?

1. What scores result from “ticket, then blue stamp” in the two versions?
2. In the effect version, can “blue stamp, then wait” grant another ticket at final scoring?
3. Does the set still score 4 after delivery in the effect version?

**Answers:** For the first question, the base version ends with two tickets plus the set: 6 points. The effect version gains another ticket when blue arrives: 7 points. For the second, the effect cannot trigger again; score 4 for the set plus 2 for tickets, totaling 6. For the third, yes: the cost spends only tickets. “Blue stamp, then delivery” totals 9.

## Sources and scope

Geoffrey Engelstein and Isaac Shalev, *Building Blocks of Tabletop Game Design*, second edition: SET-01, “Set Valuation” (printed pp. 509–512), discusses benefits and valuation curves; SET-05, “Combo Abilities” (pp. 523–525), discusses synergy, acquisition, and operation of abilities, distinguishing broad collecting patterns from specific mechanisms. The valuation–trigger–next-action comparison is our organization of this example. All stamp rules and numbers are original, not an exercise from the book; a single prescribed trigger chain does not represent the full range of combo play discussed by the authors.
