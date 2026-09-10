# A small urban space: a resting place added, but whose journey becomes longer?

One place can support both movement and rest. Making one use easier may hinder another, which requires checking actual paths. This develops the existing shared urban-space setting through two users' requirements. Its distance limits are fictional, not real planning or accessibility standards.

## Map and two requirements

Draw a 3×3 grid. The x coordinates run 0, 1, 2 from left to right; y runs 0, 1, 2 from top to bottom. The entrance is (0,1); the service point is (2,1). Move only orthogonally, one step per neighboring edge, without diagonals. There are initially no obstacles. The candidate labels below are not obstacles; each plan places only one bench.

| y / x | 0 | 1 | 2 |
|---|---|---|---|
| 0 | Empty | Upper-middle candidate | Empty |
| 1 | Entrance | Center candidate | Service point |
| 2 | Empty | Empty | Empty |

A represents passage: the shortest walk from entrance to service must be at most 3 steps. B represents rest: a shortest walk from the entrance to any walkable square orthogonally adjacent to the bench must be at most 1 step. Reaching such a square allows bench use. Both requirements are public before choosing a location.

Place exactly one bench. Its square is impassable. It cannot occupy the entrance or service point; other squares are allowed. A and B jointly select one location, calculate each requirement, then end. Passing both means shared success. There are no costs, randomness, other obstacles, later bench moves, or unstated voting and forced-consent rules. These are two independent plan comparisons, not a real participatory-planning experiment.

## Center placement: rest is near, passage detours

Place the bench at (1,1). The entrance is already adjacent, so B's distance is 0 and passes. A cannot cross the bench. A shortest route is (0,1)→(0,0)→(1,0)→(2,0)→(2,1), taking 4 steps and failing.

The bench does create nearby rest, but **only one requirement passes**. A useful facility does not remove the need to check which route it occupies.

## Upper-middle placement: check the two paths separately

Place the bench at (1,0) instead. A can walk (0,1)→(1,1)→(2,1) in 2 steps. B can reach (0,0) or (1,1) in 1 step, becoming adjacent to the bench. Both pass.

| Bench location | A's shortest passage | B's access distance | Result |
|---|---|---|---|
| Center (1,1) | 4 steps, exceeding 3 | 0 | Only B passes |
| Upper-middle (1,0) | 2 steps | 1 | Both pass |

The second succeeds without more space or another bench. Rest access increases from 0 to 1 step but remains within B's requirement, while A's short passage survives.

## Whose conditions enter the judgment?

The two represented needs retain separate pass results, rather than a total concealing an unmet condition. The impassable bench square and adjacent-use rule connect one facility to two paths.

This differs from the general city-building article's house-adjacency scoring. It checks blocked passage alongside rest access. It still omits who establishes thresholds, who may revise them, and whose needs are absent from discussion. A fuller situation would need those relationships in its process.

## Check and model boundary

With the bench at the center, can A walk diagonally to (1,0), then diagonally to the service point, and claim a two-step pass?

**No.** Both steps would be diagonal, which is illegal. Crossing the center bench is also forbidden. Changing either restriction requires recalculating both users' conditions as a variant.

The grid, blocked bench square, and limits serve this example rather than summarizing real people's capabilities. Observe whether readers can trace each claimed path and identify both helped and hindered uses.

This original map develops Luozhuo's shared urban-space setting. Related route-building and city-building articles distinguish changing connections, placing buildings, and altering movement opportunities on existing space.
