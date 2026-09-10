# Medical and public-health themes: a time slot is not yet a completed service

This theme can address individual care, service organization, or public cooperation. Here the selected relationship is access: how does a person's appointment align with the support they need? This fictional consultation station examines scheduling and communication requirements, without diagnosis, treatment, urgency rankings, or practical medical scheduling advice.

## Two slots and two waiting people

One coordinator schedules P and Q. Each needs one consultation occupying an entire slot. P needs no additional support. Q requires an interpreter throughout. The interpreter is available only in slot one, not slot two. Neither person has completed a consultation. All conditions are public and deterministic.

Process slots one and two. At the start of each, select one person still waiting or leave it empty. There is no fee. A slot holds only one consultation; slots cannot be combined.

At its end, P completes if scheduled. Q completes only if scheduled with the interpreter available. Without that support the slot is still spent and Q remains waiting. Completed people leave the queue and cannot be scheduled again. Reselect an invalid choice before spending the slot. Interpreter support cannot be stored from an earlier slot.

After slot two, both completed means shared success; otherwise failure. There are no individual points, and a completion count does not measure a person's worth. The coordinator cannot change a need, waive the interpreter requirement, or add slots.

## P first: scheduled but incomplete

Schedule P in slot one: P completes. The interpreter's availability is not used for Q. Schedule Q in slot two: without the interpreter, Q does not complete. Final result: **1 completion, failure**.

Both people appeared on the schedule, but the results differ. Occupying a calendar slot and meeting the completion requirements are separate states. An appointment entry alone is not the modeled outcome.

## Q first: align the slot and support

Reset. Schedule Q in slot one with the interpreter, completing Q. Schedule P in slot two, needing no additional support. Final result: **2 completions, success**.

| Order | Slot one | Slot two | Completions |
|---|---|---|---|
| P first | P completes | Q lacks interpretation, incomplete | 1 |
| Q first | Q completes with support | P completes | 2 |

No additional people, slots, or consultation capacity were introduced. Order changes whether the limited support meets the corresponding need.

## Needs, surroundings, and authority

The coordinator chooses order; P and Q are not resources whose needs can be rewritten. Support availability supplies the pressure. The critical rule matches person, time, and support simultaneously; a free slot is only one requirement.

Change only the interpreter's availability to both slots, and either order completes both consultations. The original difference arises from the model's support arrangement, not Q being inherently less efficient. Letting participants book, reschedule, or express preferences would require corresponding actions.

## Simplifications and the next observation

Consultation content is omitted. Both durations are identical, with no clinical risks, changing needs, privacy procedures, or multiple support types. No diseases or prevention strategies are compared. This selects one organizational relationship without simulating an entire medical system.

Observe whether readers record “scheduled” as “completed.” Further research should address the actual service relationship a future design chooses to portray. These two slots and people are constructed examples, with no real service data.

## Check: can Q occupy another slot after completion?

Q completed in slot one with the interpreter. Can scheduling Q again in slot two count as a second completion?

**No.** Q has left the waiting queue. Reselect P or leave the slot empty. Selecting P completes both people; leaving it empty completes only Q and fails. Repetition does not replace someone else's unmet need.

## Reference doorway

[BGG: Medical (2145)](https://boardgamegeek.com/boardgamecategory/2145/medical) identifies the category. This site selects service organization; its scheduling model and analysis are original and offer no clinical conclusions.
