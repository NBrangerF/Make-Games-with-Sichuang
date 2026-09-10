# Owning three locations: count an area majority, or a connected group?

Three locations you own can form a majority within an area without being connected. Both rules examine space, but value different relationships. Keep one map and two placements fixed, replacing only the final scoring.

## Fix the map and every action

This original two-player ending phase has public information. Five locations form a line: **a—b—c—d—e**, with only the shown adjacent links. West contains a, b, c; East contains d, e.

Initially A owns a and c, B owns b, and d and e are empty. Each player has one unused ownership marker and 0 points. A goes first, then B. Each must place their marker in an empty location for free. No waiting, moving, or covering markers. A location has one owner, so B must take the remaining empty location.

A printed link counts as part of a player's network only when that player owns both adjacent endpoints. Links between different owners belong to neither network. There is no movement or link-building cost. Both scoring versions retain this connection condition.

Score once after B's placement, leave the markers in place, and end. Majority and network scoring below are alternatives, not rewards to add together. Compare these phase results without imposing a larger game's victory condition.

## Majority: count ownership within each district

Compare owned locations separately in each district. The strictly larger count receives the district's entire reward: 3 points for West, 2 for East. Ties award neither player anything. Individual locations are not each worth 3 or 2 points.

A has two legal choices.

| Sequence | Final owners of a / b / c / d / e | West | East | Final A / B |
|---|---|---|---|---|
| A claims d; B claims e | A / B / A / A / B | A leads 2–1 and scores 3 | One each: both score 0 | 3 / 0 |
| A claims e; B claims d | A / B / A / B / A | A leads 2–1 and scores 3 | One each: both score 0 | 3 / 0 |

B's b lies between A's a and c. This does not affect the majority count: both belong to West and enter A's total. East is tied either way. In this ending position, d and e give A identical majority scores.

## Change only scoring to the largest connected component

Reset the same ownership and markers. Replace final scoring: each player finds their largest connected component and scores 1 per location in it. An isolated owned location is a component of size 1. Separate components do not add together. This version no longer awards district points.

When A claims d and B claims e, A connects c—d, while B's b separates a. A's largest component has 2 locations and scores 2. B's b and e remain separate, so B scores 1.

When A claims e and B claims d, A's a, c, and e are separated by B's locations. Each component has size 1, so A scores 1. B's b and d are also separate, scoring 1.

| A's final choice | Majority: A / B | Network: A / B |
|---|---|---|
| d | 3 / 0 | 2 / 1 |
| e | 3 / 0 | 1 / 1 |

The two locations now do different jobs for A. Location d extends the component containing c. Location e increases total ownership without joining another A location. The scoring relationship changed; the map, resulting ownership, legal choices, and connection conditions did not.

## Which relationship is being valued?

Majority aggregates **counts within a shared district**. This network score requires **reachability along your adjacent links**, then selects the largest component. District boundaries, connectivity, and ownership perform separate roles. One spatial label cannot supply every scoring rule.

There is no third action for building a bridge, and A cannot connect a to c through B's b. Adding bridges, shared links, different districts, or ownership transfers would change actions or connection conditions and require another complete resolution.

This example fixes prior ownership and leaves B only the unclaimed location so that the final choice's changed valuation is clear. It does not model a whole contest over territory. These results do not establish general interaction intensity or whole-game balance for either mechanism.

## Check: do three owned locations mean three points?

Under network scoring, A chooses e and owns a, c, and e. Does A score 3? **No.** They are disconnected. The largest component has size 1, scoring 1.

Under majority scoring, can A lose West's 3 points because a and c are disconnected? **No.** That version compares district counts, where A leads 2–1. Connectivity is a scoring requirement of the other version.

## Sources and comparison limits

Geoffrey Engelstein and Isaac Shalev, *Building Blocks of Tabletop Game Design*, second edition, ARC-02 “Area Majority/Influence,” printed pages 488–490, and SET-04 “Network Building,” pages 519–522. These respectively support examining multiple players' presence and comparison within areas, and connections between nodes. This five-location map, starting ownership, two placements, and both scoring systems are original.

This is not a complete comparison of two game genres. Network games do not universally score their largest component. The area-majority, area-control, and route-building entries provide further concrete rule examples.
