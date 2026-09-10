# Communication limits: with one question, what does “not here” tell you?

Knowing an answer does not necessarily permit stating it. Limits on questions, frequency, or expression change what someone else can eliminate and what remains a guess. Follow one destination card through a question, an answer, and a delivery.

## The scout knows; the courier decides

This original cooperative phase has two players. Three cards with identical backs show destinations A, B, and C. Shuffle uniformly and draw one for the scout alone to inspect. Set the other two aside face down; neither player may inspect them. The courier knows the pool but cannot see the drawn card.

Start at 0 shared points with exactly one final delivery. The courier must first ask one question, choosing only “Is it A?” or “Is it B?” The scout must truthfully write “yes” or “no,” without a destination, explanation, or other hint. Do not show the card, add speech or gestures, or use codes. This model treats only the prescribed exchange as information; it does not establish that real players never give unintended cues.

After the answer, the courier writes one destination, A, B, or C, and delivers there for free. A choice is required even if uncertainty remains and cannot change once written. Reveal the card: a correct delivery scores 1 shared point, an incorrect one 0. Then end. There is no second parcel, individual scoring, or other cost. Leave the card face up.

## “Not A” leaves two possibilities

Suppose the actual card is C. The courier asks “Is it A?” and receives “no.” This eliminates A while leaving B and C possible. Delivering to B scores 0; delivering to C would score 1, but that success would not prove the answer had uniquely identified C.

Fix a policy: ask about A, deliver to A after yes, and deliver to B after no. Resolve all three cards.

| Actual card | Answer to “Is it A?” | Delivery | Shared points |
|---|---|---|---:|
| A | Yes | A | 1 |
| B | No | B | 1 |
| C | No | B | 0 |

The cards are equally likely, so this policy succeeds 2/3 of the time. After no, B and C each have probability 1/2: each had one card, the draw was uniform, and no additional hint was given.

Asking about B instead cannot guarantee all three either. A permitted question has two possible answers, one of which leaves two destinations. There are 2 questions × 3 destinations after yes × 3 destinations after no: 18 fixed policies. The best covers only two of the three cards.

## Change only the question allowance

Reset. Raise the maximum from one question to two, still requiring at least one. Keep the permitted questions, truthful answers, single delivery, and scoring. The courier may decide whether to continue after the first answer; repeating a question also uses an opportunity.

Ask about A first. After yes, deliver to A. After no, ask about B: yes means deliver to B, and no means deliver to C. With actual destination C, the sequence becomes not A → not B → deliver to C → 1 point.

This policy succeeds for every destination provided the scout reads and answers correctly and the courier follows the specified questions and reasoning. The extra question removes this model's remaining uncertainty. There is no information price or other task preserving a tradeoff here, so this does not establish that the two-question version is more enjoyable.

## Specify content, method, participants, and frequency

The example limits question content and fixes the response method: written yes or no. It also separates roles. The scout knows, but the courier controls the final choice. The allowance determines whether clarification can continue.

“You may talk, but cannot give the answer” still leaves rules undecided. May players show cards, confirm an interpretation, repeat questions, or use agreed codes? How are mistaken hints handled? Groups can otherwise operate under different information conditions, making their results difficult to compare.

This differs from merely hiding information. The scout knows the destination from the start; transmission rules prevent the courier from directly receiving the answer. In a prototype, record the actual question, the candidates each answer eliminates, and who makes the final choice. Then observe whether unintended cues occur. One successful delivery does not prove shared understanding.

## Check: does “not B” necessarily mean C?

If the first question concerns B and receives no, which destinations remain? **A and C.** “Not B” identifies C only when A has already been excluded.

Can a scout legally answer yes to both “Is it A?” and “Is it B?” for the same unchanged card? **No.** Every card has one destination. Check for a reading or answering error instead of inferring two destinations.

## Source and classification

Geoffrey Engelstein and Isaac Shalev, *Building Blocks of Tabletop Game Design*, second edition, UNC-06 “Communication Limits,” printed pages 283–285. It distinguishes limits on content, communication method, roles, and frequency, and discusses differing group interpretations of permitted communication. The three destination cards, exchanges, and both versions' outcomes are original.

[BGG: Communication Limits](https://boardgamegeek.com/boardgamemechanic/2893/communication-limits) supplies a classification identity, not evidence for this example's rules or learning effects.
