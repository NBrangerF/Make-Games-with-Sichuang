# Solo play and automated opponents: how the system competes for something

Having one person operate a game does not require an imitation human opponent. Solo play can ask you to complete a goal, improve a record, or compete with an automated rival. First ask what effect the system needs to produce, and how much extra administration producing it requires.

## Two collection windows

This is a complete, original short game from this site, with one human and one automated rival. The human executes the rival’s instructions without choosing its strategy.

The left and right windows each have two parcels in a queue: a front parcel worth 4 points and a rear parcel worth 1. All four are visible. Only the front parcel may be taken; removing it exposes the rear parcel. You and the rival start with no parcels and 0 points. Two priority cards, one Left and one Right, are shuffled face down into either order with equal probability. No cards are added or reshuffled. Apart from the unrevealed priority cards, there is no secret information.

Play exactly two rounds, resolving these steps in order:

1. You take the front parcel from either nonempty window for free, or wait. A taken parcel moves to your scoring area.
2. Reveal this round’s priority card. The rival takes the front parcel from that window. If it is empty, the rival takes the front parcel from the other window instead. It waits only if both are empty. It does not compare parcel values to make its choice.
3. Discard the card face up. Repeat this procedure in round two. End immediately after the rival’s second-round action has resolved.

Taken parcels are never spent or returned. There are no other costs, actions, or rewards. At the end, each side adds the values of its parcels. You win with the higher total, draw with equal totals, and lose with the lower total. A draw has no extra round. Parcels remaining at the windows score for neither side.

## One policy, two complete results

Fix your decision policy first: **if this round’s priority card is known, choose its window; otherwise choose Left. If the chosen window is empty, choose the other; wait only if both are empty.** In the base version the first-round card is unknown. In round two, however, the first discarded card identifies the remaining card. This uncertainty does not renew every round.

With the order Left, Right: in round one you take Left 4, reveal Left, and the rival takes Left 1. Knowing the next card is Right, in round two you take Right 4 and the rival takes Right 1. All four parcels have been distributed. You **win 8 to 2**.

With the order Right, Left: in round one you still take Left 4, reveal Right, and the rival takes Right 4. Each window now has a 1-point parcel. Knowing the next card is Left, in round two you take Left 1. The rival finds Left empty and uses its fallback to take Right 1. The result is a **5-to-5 draw**.

Both paths use the same opening, policy, and resolution rules. The difference comes from the first unknown priority card. The rival creates pressure by removing something before your next choice; it does not need a complete model of human thought to do so.

## Change only when the priority card is revealed

Restore the entire opening. Change exactly one rule: **reveal each round’s priority card before you choose, then let you take a parcel, and finally let the rival take a parcel and discard the card.** The rival does not act earlier. The deck, parcels, fallback, number of rounds, and scoring remain the same.

Use the same decision policy. Left, Right still produces 8 to 2. Right, Left now proceeds as follows: seeing Right in round one, you take Right 4 and the rival takes Right 1. Seeing Left in round two, you take Left 4 and the rival takes Left 1. This also produces 8 to 2.

| Two equally likely orders | Reveal after your choice | Reveal before your choice |
|---|---:|---:|
| Left, Right | You 8, rival 2: win | You 8, rival 2: win |
| Right, Left | You 5, rival 5: draw | You 8, rival 2: win |

Under this fixed policy, the base version therefore has a one-half win probability, a one-half draw probability, and an average player score of 6.5. Revealing early gives a win probability of 1 and an average player score of 8. These are calculations over two equally likely orders, not win rates measured in human playtests.

Revealing early does not remove the automated opponent: it still takes two parcels. It changes whether you can respond accurately to the first round’s opportunity loss. What stays fixed is the policy for responding to available information, rather than a forced identical sequence of window choices. The comparison concerns how information timing changes the response available to you.

## Separate pressure from administration

Each round, this rival requires one card reveal, a check of the indicated window, a check of the other window if necessary, and one parcel transfer. Its basic procedure needs no die roll, score-gap comparison, or hidden resource tracking. Across two rounds, you process two cards and two rival collections. The base Right, Left path also requires one empty-window fallback.

Predictability and pressure can coexist: even when you know which window the rival will use, its collection changes the following position. Conversely, a face-down card does not guarantee continuing uncertainty. This two-card deck makes round two fully inferable. More card types, priority exceptions, or rival states may create more variation, while also adding things the operator must maintain. Count the administration and test whether people can perform it correctly, as well as considering the rival’s possible strategies.

This example does not establish that an automated rival suits solo play better than a goal challenge, or that revealing cards makes a game more enjoyable. Its claim is narrow: automatic collection creates competition, and reveal timing changes the conditions for responding. The related entry on cooperative structure below considers how goals can be organized without another human opponent; hidden information considers what is and is not known.

## Are four parcels enough to close the rules?

There are always four parcels across the two windows and two scoring areas, with a total printed value of 10. If you wait in both rounds, either card order makes the rival take the two 4-point parcels. You score 0, the rival scores 8, and both 1-point parcels remain at the windows. You lose. Unclaimed parcels are not awarded to either side.

An empty priority window does not mean the rival skips its turn: execute the fallback. Being able to infer a card does not mean executing the rival’s collection first: you still choose first in the base version. Distinguishing available information, action order, and empty-window handling makes the rival an executable procedure rather than a direction to “get in your way.”

## Check yourself: who acts after the card is known?

1. If the first base-version card is Right, is the second-round direction still random?
2. Can the rival take a 4-point parcel elsewhere when its priority window still has a 1-point parcel?
3. Does the early-reveal version let the rival collect first?
4. In the base Right, Left path, can the rival wait in round two because Left is empty?
5. If you wait twice, does the game remain unfinished because nobody collected all four parcels?

**Answers:** First, no: the remaining card must be Left. Second, no: it must use a nonempty priority window. Third, no: you still collect first. Fourth, no: it must take Right 1 instead, producing the 5-to-5 result. Fifth, the game ends normally. The rival scores 8 and you score 0; the unclaimed 2 points go to neither side.

## Sources and scope

Geoffrey Engelstein and Isaac Shalev, *Building Blocks of Tabletop Game Design*, second edition, STR-04 “Solo Games” (printed pages 12–14), treats solo games and modes as a broad structural category and discusses goals, records, and automated players. Its Automa discussion emphasizes representing an opponent’s effects without reproducing every human procedure. We use that design question here without turning a description of one implementation into a universal rule for automated opponents.

The two windows, scoring rival, card orders, and all numerical examples are original to this site. This is not a commercial game’s solo rule set or a reproduction of a particular Automa system. To consider carrying this game’s result into a following game, continue with the related entry on scenarios and state across games below.

[BGG 2819: Solo / Solitaire Game](https://boardgamegeek.com/boardgamemechanic/2819/solo-solitaire-game) is a related classification entry. Automated collection is this site's solo example, not a requirement for all solo games.
