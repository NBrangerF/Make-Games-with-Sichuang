# What Should the Table Look Like After an Action?

Lin has moved Rabbit to the first stepping stone but forgotten to spend a plank. The table still shows four available planks when there should be three. However carefully Yu now plans, she will be planning from the wrong starting point.

A playable action needs two things to work together: players know what they may choose, and everyone knows how to produce the correct situation afterward. We are using the complete paper draft from the previous chapter: two animals, four spaces, four available planks, sixteen spare pieces, and an empty spent area. Lin goes before Yu in each round, for up to four rounds. We are adding no rules here, only examining how to carry them out.

## Check permission, then complete the changes

On Lin’s turn, he first checks Rabbit’s position. On the far bank, Rabbit can only wait. Elsewhere on the route, he can move if at least one available plank remains. After choosing to move, Lin puts one available plank in the spent area and moves Rabbit to the next adjacent space toward the far bank. Together, these changes complete the action.

With no available planks, Lin cannot move now and promise to pay later. The base game has no borrowing rule. He must choose another action currently allowed: collect if Rabbit is still on the starting bank, or wait if Rabbit has left it. The next player should not have to guess whether an animal’s position is waiting for a payment.

Collecting also has a definite result. The animal must be on the starting bank. Take two new planks from the spare area, add them to the center, leave the animal where it is, and end the turn. Taking pieces from the spent area would change the rule that spent planks cannot be reused. Three distinct areas help players handle pieces that otherwise look the same.

The information that currently matters—animal positions, available planks, whose turn it is, and the round—is the game’s “state.” Keeping spare and spent pieces in their proper places helps maintain it. State includes more than the space a piece occupies.

## Waiting still passes the turn

Suppose Rabbit moves and Hedgehog collects in round 1. After Lin’s action, three planks remain, Rabbit is on the first stepping stone, and the turn reminder points to Yu. It is still round 1. After Yu’s action, five planks are available and Hedgehog remains on the starting bank. Only now have both players acted. Move the round marker to round 2 and the turn reminder back to Lin.

Waiting leaves animals and planks unchanged, but it still ends the turn. Otherwise, someone could claim to be waiting indefinitely while their partner never gets a turn. The same applies to an animal that has already arrived: it waits on later turns, then passes the opportunity to act to its partner.

Pieces and markers make these updates visible. If a program eventually moves the round marker for us, we must still specify turn order and when a round changes. Automation can replace manual work; it cannot decide a missing rule for the designer.

## At the deadline, do we check success or failure first?

Consider this successful plan. In round 1, Rabbit moves and Hedgehog collects. Both move in round 2 and again in round 3. Rabbit has now arrived, Hedgehog is on the second stepping stone, and one plank remains. In round 4, Rabbit waits and Hedgehog spends the last plank to move.

Both animals have arrived, so the players win immediately. Round 4 has also just ended, but reaching the deadline must not erase the success just completed. After each action, first check whether both animals have arrived. If they have not, check for failure only after both turns of round 4. Not having both animals across in round 2 or 3 is not yet a reason to declare failure.

This order belongs in the rules. It prevents the same situation producing opposite results because different people remember different sentences first. Once the order is clear, we can walk the draft from round 1 to the finish and check that each moment has a next step.

We now have a draft that can run and reach a definite ending. Next comes another question: when players have two permitted actions, are both worth considering, or is there never a reason to choose one of them?
