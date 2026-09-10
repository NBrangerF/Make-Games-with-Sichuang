# Tile placement: this tile fits, but what about the next one?

A legal placement need not help complete your goal. Orientation, touching edges, and remaining spaces together determine what the next tile can do. Two road tiles will make that distinction concrete.

## A map for two road tiles

This original solo phase uses only the five usable cells below. The bottom-left cell is unavailable. Letters show the fixed locations' road openings: N, E, S, and W mean north, east, south, and west.

|  | Column 0 | Column 1 | Column 2 |
|---|---|---|---|
| Row 0 | Start, opening E | Empty | Empty |
| Row 1 | Unavailable | Empty | Finish, opening N |

You have one straight tile I and one corner tile L. I has opposite openings: E/W horizontally or N/S vertically. L has adjacent openings and may be rotated to N/E, E/S, S/W, or W/N. Other edges have no road. Each tile's two openings connect internally. Start and Finish cannot rotate.

Take exactly two actions. Each may freely place one unused tile in an empty usable cell or wait. No covering, moving, or retrieving placed tiles. A placement must connect at least one road to an adjacent existing tile or fixed location. Every touching edge must also match: road to road, blank to blank. Diagonals do not count. Roads facing empty cells, outside the map, or the unavailable cell may remain unfinished, but cannot jump across them.

After action two, score 8 if a continuous road connects Start to Finish; otherwise score 0. Then end. Unused tiles score nothing and placed tiles remain. Nobody moves along the road, and laying a tile earns no separate points.

## The same two tiles, two outcomes

**Go around the top:** place I horizontally at column 1, row 0, connecting to Start. Place L at column 2, row 0 with W/S openings. Its west connects to I and its south to Finish. Start→I→L→Finish is continuous, scoring 8. Both tiles are used.

**Turn down early:** place L at column 1, row 0 with W/S openings, then I vertically at column 1, row 1. Both placements are legal. But I has no eastern road and Finish has no western road. Those edges match as blank edges without establishing a road connection. The road turns down from Start and ends unfinished, scoring 0.

The second sequence did not violate placement rules. It matched the edges but failed to connect the goal. Check **legal adjacency** separately from **road connectivity**.

## Change only Finish's opening

Reset the map and both tiles. Change Finish's opening from N to W. The upper route can no longer enter Finish: its northern edge now has no road.

Entering from the west requires passing through column 1, row 1. From Start, that route turns east-to-south and then south-to-east: two corners requiring two L tiles. You have only one L and one I. Connection is impossible within two actions. Rotating a straight tile cannot turn it into a corner, so this version's maximum is 0.

This is not unlucky drawing. Both tiles are known and nothing is drawn. Changing one interface can make the available materials insufficient. A design that promises completion needs compatible supplies and constraints. A design allowing failure should make its cause understandable.

## Adjacency may govern permission or reward

This example uses edge matching to permit placement and connectivity to determine reward. Other placement rules may value neighboring motifs, completed areas, or a whole layout. Those relationships require rules; square pieces do not supply them automatically.

Tiles also change the boundaries available for later placement. Check every neighbor of an empty cell. One matching connection does not excuse a mismatch on another side. A prototype can label openings with direction letters to test the relationship before evaluating whether illustrations make it easier to read.

## Check: would changing one tile be enough?

Keep the modified west-facing Finish, but replace I with a second L. Can two placements connect the route? **Yes.** Place the first L at column 1, row 0 with W/S openings; put the second at column 1, row 1 with N/E openings. It enters Finish from the west and scores 8. Available materials changed; the original straight tile could not do this.

In the original downward sequence, does I's blank east edge matching Finish's blank west edge automatically create a road? **No.** Matching permits placement. A connection requires roads on both sides.

## Sources and classification

Geoffrey Engelstein and Isaac Shalev, *Building Blocks of Tabletop Game Design*, second edition, SET-02 “Tile-Laying,” printed pages 513–515, and SET-04 “Network Building,” pages 519–522. The former connects spatial relationships to set validity and value; the latter discusses tiles as a way to create links. This map, tile supply, sequences, and interface changes are original.

[BGG: Tile Placement](https://boardgamegeek.com/boardgamemechanic/2002/tile-placement) supplies a classification identity. Merely assembling an initial board from tiles does not automatically give players placement decisions that change spatial relationships during play.
