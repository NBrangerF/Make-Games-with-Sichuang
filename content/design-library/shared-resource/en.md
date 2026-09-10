# Shared resources: who owns a material after taking it?

A pile of timber in the middle of the table may be available to everyone. Timber taken from it does not necessarily belong to a team. Specify access, ownership after collection, and replenishment before deciding what players compete over.

## Two players and four collection actions

This original two-player mini-round uses 3 timber in a common pool and 1 in reserve. A and B each start with none. Everything is public. There is no trading or returning privately held timber to the pool.

Play two rounds, with A taking one action followed by B taking one action in each. An action takes 0–2 timber from the pool, limited by its current contents. Collected timber immediately belongs to that player. After round one, add the single reserve timber to the pool; replenish only then. End after B's action in round two. Each privately held timber scores 1; uncollected timber scores nothing. Higher score wins, with a draw on equal scores.

## Follow “take as much as possible”

The following trace fixes both players' choices to track the resources. It is not a recommendation for every possible position.

| Moment | Collected now | Common pool left | A's total | B's total |
|---|---:|---:|---:|---:|
| A, round one | 2 | 1 | 2 | 0 |
| B, round one | 1 | 0 | 2 | 1 |
| Add reserve timber | — | 1 | 2 | 1 |
| A, round two | 1 | 0 | 3 | 1 |
| B, round two | 0 | 0 | 3 | 1 |

A finishes with 3 points and B with 1. They access the same supply but score separately. Common access does not establish a shared victory condition.

Suppose instead A takes 0 first, then B takes 2. The uncollected timber remains and combines with the replenishment to make 2. A can then take both, leaving B none, for a 2–2 draw. Uncollected resources can accumulate, but waiting does not guarantee that the waiting player will eventually receive them.

## Change only the collection limit to 1

Reset the materials, order, and scoring. Change only the maximum per action from 2 to 1. Both players again take as much as possible. In round one, each takes 1, leaving 1. Replenishment makes 2, and each takes 1 in round two. Both finish with 2 points.

The total supply and player order stay fixed. The difference comes from the share that one action can remove. This single equal result does not establish that collection limits eliminate first-player advantage. Recheck after changing the starting supply, player count, or number of rounds.

## Separate three design questions

**Who may take resources?** Both players may collect here, but neither may take the other's private timber. **When is supply added?** Once between rounds; an empty pool does not trigger a refill. **Who scores it?** Only private holdings score. There is no team score in the middle of the table.

Shared resources are a useful design pattern for describing these relationships in either competitive or cooperative structures. To make everyone build something together, specify a common objective, payment permissions, and an ending. A central pile alone does not supply those rules.

## Check: does a larger starting supply still split evenly?

Restore the limit of 2, start with 5 timber in the pool, and keep everything else unchanged. Both players still take as much as possible. Each takes 2 in round one, leaving 1. Replenishment makes 2; A takes both and B takes none. **A scores 4 and B scores 2.** All 6 timber are collected, but order still affects distribution.

## Sources and classification

Geoffrey Engelstein and Isaac Shalev, *Building Blocks of Tabletop Game Design*, second edition, ECO-17 “Increase Value of Unchosen Resources,” printed pages 345–347, discusses increasing the value of unchosen options, including resources accumulating on unclaimed action spaces. This collection round, its limits, and its scoring are original to this site.

“Shared resources” is this site's pattern label, not a claimed equivalent of a BGG mechanism with that name. For a further distinction between common supply and shared victory, see our cooperative-structure entry and its BGG reference.
