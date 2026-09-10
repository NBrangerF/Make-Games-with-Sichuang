# Four covered boxes: does seeing a marker give you grounds for deduction?

There is a correct answer on the table, and the player cannot see it yet. That creates uncertainty, but it does not tell us which rules let the player eliminate wrong answers. Keep the boxes, target, number of choices, and reward fixed. Change only the relationship between one marker and the target.

## Four candidates, one box to open

This is an original local challenge for one player. The information about all four boxes remains public. Shapes also have written labels, so distinguishing them does not depend on color.

| Box | Shape on its door | Level |
|---|---|---|
| 1 | Circle | Lower |
| 2 | Square | Lower |
| 3 | Circle | Upper |
| 4 | Square | Upper |

Shuffle four target cards numbered 1–4 uniformly and draw one face down to determine the correct box. Set the other three aside face down; nobody may inspect them. The target is now fixed and stays covered until the choice is resolved. The player knows the candidate table, the drawing procedure, and the marker rule used in this challenge. Start at 0 points.

One public marker appears, labeled either Circle or Square. The player may record it, then must choose exactly one of the four boxes. Choosing is free. There is no switching, extra inspection, or additional question. Reveal the target card: a correct choice earns 6 points; a wrong choice earns 0. The challenge ends immediately. There are no speed bonuses or points for remaining resources. This is a local information experiment, not a complete multiplayer board game.

In the base version, the marker comes from a separate pair of cards: one Circle and one Square. Draw uniformly from that pair, independently of the target. The two sets are shuffled and drawn separately; nobody selects a marker to convey a hint. The rule explicitly makes no promise that the marker matches the correct box's shape.

## First sequence: why does a Square marker not rule out circles?

For the comparison, fix an executable choice method: **choose box 1 after Circle and box 2 after Square.** This demonstrates the rule difference; it does not predict how every reader will choose.

Suppose the covered target is 1 and the independent marker happens to be Square. The player follows the method and chooses 2. Reveal target 1: score 0 and end. Both the marker and target are now public, but the player cannot go back and choose 1.

Before the choice, seeing Square leaves all four candidates: 1, 2, 3, and 4. Each target can occur together with an independently drawn Square. Crossing out 1 and 3 would rely on a relationship the rules never promised. A later lucky success or failure cannot retrospectively justify that elimination.

## Change only how the marker is produced

Reset the same four targets, candidate table, choice limit, and scoring. Make just one change: instead of being independent and random, the marker **must show the shape on the correct box's door**. A person preparing the challenge can place it by following the target card; they cannot freely choose the marker or lie. This preparer is not a competing player. The solver still cannot see the target card.

Keep actual target 1 and the same choice method. The marker must now be Circle. The player eliminates square boxes 2 and 4, then follows the method to choose 1 from the remaining 1 and 3. Reveal the target and score 6. The comparison has not added a question or exposed the target. Only the rule governing the marker has changed.

If the target is 3, however, the marker is also Circle. The method still chooses 1 and scores 0. **A reliable clue reduces four candidates to two; it does not yet establish which of those two is correct.** Partial knowledge and complete knowledge need separate representations.

## List every case

The base version has four equally likely targets and two independent, equally likely markers: eight equally likely combinations. In the guaranteed-shape version, each target produces exactly one marker: four equally likely cases.

| Actual target | Base: Circle leads to box 1 | Base: Square leads to box 2 | Guaranteed shape: marker / choice / points |
|---|---:|---:|---|
| 1 | 6 points | 0 points | Circle / 1 / 6 points |
| 2 | 0 points | 6 points | Square / 2 / 6 points |
| 3 | 0 points | 0 points | Circle / 1 / 0 points |
| 4 | 0 points | 0 points | Square / 2 / 0 points |

The fixed method succeeds in 2/8 = 1/4 of base cases, for an expected score of 6 × 1/4 = 1.5. It succeeds in 2/4 = 1/2 of guaranteed-shape cases, for an expected score of 3. Neither version awards its average score on every attempt: an actual result is either 0 or 6.

With uniform targets and no other clues, any method that selects one box using only the independent marker succeeds with probability 1/4 in the base version. With a guaranteed shape, selecting either compatible box succeeds with probability 1/2. Randomizing between the two compatible boxes cannot exceed 1/2 either. Unequal target probabilities, glimpsed cards, or additional clues would require new calculations.

## Ask why a candidate can be crossed out

This separates three design decisions. Concealment determines what the player does not yet know. The marker rule determines the relationship between an observation and the answer. The one-box limit determines when the player must commit while some uncertainty remains.

To make elimination checkable, write the complete candidate set, then identify which candidates each observation rules out and why. Here, Circle rules out 2 and 4 through the rules, but cannot rule out 3. A checklist can keep that distinction on the table instead of requiring the player to hold everything in memory.

If a reliable marker becomes a hint that an opponent may say freely, a new judgment enters: why did they say it, and how often may they mislead? The certain elimination process on this page no longer applies. That may produce another interesting game, but it requires explicit rules about who may give hints and how reliable the evidence is.

## Checks with answers

**In the base version, does Circle eliminate box 2?** No. Target 2 and an independently drawn Circle can occur together.

**In the guaranteed-shape version, does Square prove that the answer is 2?** No. Both 2 and 4 fit. Only 1 and 3 can be eliminated.

**What information might distinguish 2 from 4?** Reliable information about the level: Lower identifies 2, Upper identifies 4. This challenge does not provide a second clue, so it cannot be inserted into the current resolution.

**If both versions fail on target 3, was the rule change useless?** That does not follow. One failure is not the whole distribution. The fixed method's success rate rises from 1/4 to 1/2 while some failures remain.

## Sources and scope

Geoffrey Engelstein and Isaac Shalev, *Building Blocks of Tabletop Game Design*, second edition: UNC-07, “Unknown Information,” printed pp. 286–287; UNC-08, “Hidden Information,” pp. 288–289; UNC-12, “Deduction,” pp. 298–300. These discuss information known to no players, information known to some players, discovery through elimination, and tools for recording reasoning.

This site's hidden-information overview includes several forms of uncertainty. Initially no player solving this challenge knows the target, so the example should not be forced into the book's narrower situation where some players already know. The boxes, marker rules, choice method, and probability comparison are original to this site. The contrast between a reliable clue and an independent marker neither describes a published game's rules nor reports measured learning outcomes.
