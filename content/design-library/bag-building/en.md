# Bag Building: Does Adding a Specialist Make the Next Round Better?

Adding a Painter makes drawing a Painter more likely. But do you want to paint this round, or build a shelf requiring two Carpenters? Drawn people still need to form a usable crew. Adding someone does not automatically produce another action.

Bag building lets players change a pool they will draw from repeatedly: adding, permanently removing, or temporarily withholding pieces under specified rules. Random draws from a pool that never changes do not themselves demonstrate building it. Follow the contents, draw count, use of the pieces, and return timing together.

## Resolve two workshop rounds

This original solo phase is independent of the crossing game. Prepare personnel pieces of identical size and feel: three Carpenters, two Assemblers, and one Painter. Mix them in an opaque bag. The player knows the composition but cannot look inside. One additional Painter is outside the bag. Before starting, either add this candidate for free or leave it outside. No other personnel are gained during the phase.

Record “shelves 0, painting jobs 0.” Each round, draw four pieces one at a time, leaving them face up outside the bag without replacement. After drawing, perform at most one of these jobs, or do neither:

- **Build a shelf:** assign two Carpenters and one Assembler; increase the shelf count by one.
- **Paint a panel:** assign one Carpenter, one Assembler, and one Painter; increase the painting-job count by one.

Put the three assigned pieces beside the job; other drawn pieces are idle. Each physical piece may be assigned only once this round. If neither crew is available, do neither job. At round end, return every drawn piece, assigned or idle, and mix thoroughly. Run two rounds and end after the second cleanup. Record the two completion counts without converting them into a common score.

First leave the candidate outside. Suppose round 1 draws Carpenter, Assembler, Painter, Carpenter in that order. Both jobs are available, but only one may be done. Choose the shelf: one shelf, zero painting jobs. The Painter is idle. Cleanup restores three Carpenters, two Assemblers, and one Painter to the bag.

Suppose round 2 draws the same crew. Choose painting this time, finishing with one shelf and one painting job. All personnel return and the phase ends. If you had added the candidate at the start, this same sequence and result could still occur. The difference is that each cleanup restores three Carpenters, two Assemblers, and two Painters. One identical outcome does not establish that changing the pool had no effect.

## Adding a piece changes the denominators too

Assume each remaining physical piece is equally likely to be drawn. Follow a Carpenter-then-Assembler prefix in both versions.

| Draw point | Original: 3 Carpenters, 2 Assemblers, 1 Painter | Added Painter: 3 Carpenters, 2 Assemblers, 2 Painters |
|---|---|---|
| First piece is a Carpenter | 3/6 | 3/7 |
| After a Carpenter, second is an Assembler | 2/5 | 2/6 |
| After those two draws, remaining contents | 2 Carpenters, 1 Assembler, 1 Painter: 4 pieces | 2 Carpenters, 1 Assembler, 2 Painters: 5 pieces |
| Third piece is a Painter now | 1/4 | 2/5 |
| If the third is not a Painter, fourth is a Painter | 1/3 | 2/4 |

Why does the Painter count stay unchanged in the last row? That row specifies that another type was removed. If the third piece was a Painter instead, the original bag has no Painter left for the fourth draw. The enlarged bag still has one among four remaining pieces, giving 1/4. What was drawn determines the next numerator and denominator.

Once Carpenter and Assembler have been drawn, at least one Painter in the last two draws makes painting available. In the original bag, the chance of missing both times is `3/4 × 2/3 = 1/2`, so the chance of at least one Painter is also 1/2. After adding a Painter, missing both times has chance `3/5 × 2/4 = 3/10`, leaving 7/10 for at least one.

A shelf instead needs one more Carpenter. Under the same prefix, the chance of at least one Carpenter in the last two draws is `1 − 2/4 × 1/3 = 5/6` originally, and `1 − 3/5 × 2/4 = 7/10` after the addition. One crew becomes easier to assemble while the other becomes harder.

These figures all condition on the first two pieces already being Carpenter and Assembler. They are not the chance of painting across an entire round; the table shows that the prefix itself changed in probability. Both jobs can be available together, so their probabilities cannot simply be added to obtain the chance of having a job.

## Returning pieces differs from removing them

Assigning personnel temporarily takes them out of the bag. The original rules return everyone at round end. Do not calculate the next round as though two Carpenters have been permanently used up.

Now specify a different rule. In the enlarged-bag version, expose all personnel during round-1 cleanup and permanently remove one Carpenter to the box. Return and mix only the others. Round 2 starts with two Carpenters, two Assemblers, and two Painters: six pieces. The removed Carpenter will not return. This removal happens once and has no additional fee in this phase.

If round 2 again draws Carpenter, Assembler, Painter, Carpenter, painting remains available. The final counts can still be one shelf and one painting job, but the bag has only six pieces after cleanup. The removal did not happen merely because someone had drawn that piece; it was a separate rule changing the pool.

Likewise, returning and mixing each piece immediately after drawing would restore the original composition for the next draw, allowing the same physical piece to appear repeatedly. That differs from drawing four physical people to assign here. The table's denominators would no longer apply.

## The container does not determine assignment or circulation

Personnel do not produce rewards by themselves in this example. They form a crew for a selected job. The idle fourth piece does not automatically provide another action. When a job is available and more completions are the only aim, passing offers no advantage here. If only shelves mattered to the full game's objective, painting should not be presented as an equally tempting alternative. The two results need purposes within that larger game.

This example also returns all drawn pieces every round, even while undrawn pieces remain in the bag. That differs from exhausting a deck before shuffling its discard pile. It is not an inevitable property of every bag, or a contrast with every possible deck. Cards could implement these same crew rules. Compare drawing, use, and return explicitly instead of treating a different container as proof of identical systems.

## Check your understanding—with answers

**In the enlarged bag, the first two pieces are Carpenter and Assembler, and the third is already a Painter. What is the chance of another Painter fourth?** 1/4. One of the original two Painters has left the bag, leaving one among four pieces. Do not keep using 2/5.

**After permanently removing a Carpenter at enlarged-bag cleanup, what is the chance of a Carpenter on round 2's first draw?** 2/6, or 1/3. Other drawn personnel have returned; only the explicitly removed piece is missing.

## Reference and classification

Geoffrey Engelstein and Isaac Shalev, *Building Blocks of Tabletop Game Design: An Encyclopedia of Mechanisms*, second edition, CRC Press, 2022: chapter 13, CAR-05 “Deck Building,” printed pages 539–542, discusses pool building and assigning drawn pieces to actions; chapter 6, UNC-09 “Probability Management,” pages 290–292, distinguishes influencing chances from determining outcomes. The personnel, jobs, values, and comparisons here are original constructions.

[BGG: Deck, Bag, and Pool Building (2664)](https://boardgamegeek.com/boardgamemechanic/2664/deck-bag-and-pool-building) is a classification reference. This entry addresses the narrower bag-building scope; the category name is not an operating rule set.
