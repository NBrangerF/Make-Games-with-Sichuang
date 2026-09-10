# Route building: why can one connection serve several goals?

Building the first link from a starting point may score nothing. Another link reaches a destination; extending further may reuse the earlier route for another goal. A link's value cannot be read from its length alone.

## A map for three construction actions

This original solo phase has public information and no random draws. Its five locations are Home H, Junction J, West W, East E, and Terminal T. Exactly four two-way connections may be built: **H—J, J—W, J—E, E—T**. No other links or shortcuts exist.

Initially none are built. You have 3 construction markers and 0 points. Take exactly three actions. Each either spends one marker to activate an unbuilt connection or waits. Built links remain; you cannot rebuild them or move their markers. A new link need not already connect to H.

The public goals award 4 points for connecting H to W, 2 for H to E, and 5 for H to T. Score once after the third action. Each goal pays at most once. A built link may serve several goals and is not consumed by scoring. Unspent markers score nothing; the phase then ends. There is no movement, cargo, or toll payment.

## Three links: 6 points or 7?

Build H—J with the first marker: no goal is complete. Build J—E with the second: H now connects to E, but points are not paid yet. Compare two uses for the last marker.

| Third link | Built connections | Completed goals | Final score |
|---|---|---|---:|
| J—W | H—J, J—E, J—W | West 4, East 2 | 6 |
| E—T | H—J, J—E, E—T | East 2, Terminal 5 | 7 |

Both sequences spend all 3 markers. The first branches; the second extends to Terminal. H—J serves both West and East in the branching network. H—J and J—E serve both East and Terminal in the extended network. No physical duplicate of a link is required.

J—E alone cannot complete any goal starting at H. Together with H—J, it completes the East connection. The existing network also changes the next link's contribution: at the stated position, J—W adds 4 points while E—T adds 5.

## Prohibit only sharing links between goals

Reset. Keep the map, construction rules, sequences, and goal values. Change only final scoring: choose which goals to redeem, but **each connection may serve only one redeemed goal**. Specify a complete path for each selected goal; selected paths cannot share links. Markers remain on the map. This restriction concerns only the goal scoring.

The branching network's West and East paths both use H—J, so they cannot both be redeemed. West is the better choice, scoring 4. The extended network's East and Terminal paths share H—J and J—E. Redeeming Terminal scores the higher 5.

The same built networks now score 4 / 5 instead of 6 / 7. Roads did not disappear. The changed relationship is whether several goals may reuse an investment. Identical-looking maps can therefore support different scoring relationships.

## Connection differs from movement and ownership

This phase asks whether a path exists through built links. Nobody travels along it. There are no movement allowances or unloading rules to calculate. Adding delivery would require those rules; they are not supplied automatically by the name “route building.”

There is also only one builder here. A multiplayer network needs additional rules about ownership, shared use, fees, and blocking. Printed candidate routes can still support construction: players activate the predetermined links in this example. Conversely, moving along permanently available routes does not itself change the network.

With these three actions and goal values, extending to T scores 7 against the branch's 6. There is no reason to present them as equally good. Fewer construction opportunities, changed goals, or other players affecting links would require a new calculation.

## Check: what if you can build only two links?

Restore the original shared-link scoring and reduce both actions and markers to 2. Compare H—J plus J—W with H—J plus J—E. **They score 4 and 2 respectively.** Reaching T needs at least three links and is impossible now. The more rewarding direction under a three-link budget need not remain best in a shorter phase.

If you build only J—E and E—T, does connecting E to T award Terminal's 5 points? **No.** The goal requires H to connect to T. H remains disconnected.

## Source and classification

Geoffrey Engelstein and Isaac Shalev, *Building Blocks of Tabletop Game Design*, second edition, SET-04 “Network Building,” printed pages 519–522. It discusses links between nodes, reuse of connections, and implementations involving point-to-point construction, tiles, and existing routes. This map, budget, goals, sharing restriction, and all results are original.

[BGG: Network and Route Building](https://boardgamegeek.com/boardgamemechanic/2081/network-and-route-building) provides a classification identity. The name does not establish ownership, two-way travel, or sharing between goals. Those require specific rules.
