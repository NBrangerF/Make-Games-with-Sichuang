# Farming: why does a mature crop still yield nothing?

Farming themes can concern land, care, seasons, or labor. This original model preserves one timing relationship: sowing takes time to mature, and harvesting still requires an action. It uses no real crop names or agricultural data.

## Two plots and four actions

One player manages empty plots A and B. Play four rounds. At the start of each, update maturity, then take one action. Everything is public; there is no weather, payment, randomness, or other player.

Choose to sow a quick or slow crop in one empty plot, harvest one mature plot, or wait. Seeds are unlimited and free. A quick crop matures at the start of the next round; a slow crop at the start of the second following round. For example, a slow crop sown in round one matures at the start of round three.

Harvesting a quick crop yields 1 food; harvesting a slow crop yields 3. Harvesting empties the plot, but the same action cannot also sow it. Mature crops may remain without spoiling, but **do not automatically become food**. Sowing an occupied plot or harvesting early is illegal; reselect without spending the action.

End after the round-four action. Compare food actually collected: more is better, equal amounts have equal value. Crops still in plots score nothing. There is no extra harvest or fifth round.

## The same two crops, different endings

Both sequences sow a slow crop in A in round one and in B in round two. A matures in round three; B in round four.

| Round | Keep planting | Harvest in time |
|---|---|---|
| 1 | Sow slow crop in A | Sow slow crop in A |
| 2 | Sow slow crop in B | Sow slow crop in B |
| 3 | Harvest A: 3 food | Harvest A: 3 food |
| 4 | Sow slow crop in A again | Harvest B: 3 more food |
| Final | 3 food; B mature but unharvested | 6 food; both plots empty |

The first sequence did grow crops. It spent the last available action on future growth and left a mature crop uncollected. Under the same maturity rules, the second yields **6 rather than 3**.

## Is the quick crop automatically better in a short game?

Try another complete sequence: sow quick in A in round one, harvest for 1 in round two, sow quick again in round three, then harvest for another 1 in round four. Total: 2 food. The shorter wait comes with a smaller yield, and each harvest still uses an action.

“Ready next round” alone does not establish superiority. The four-round window, two plots, and one action per round jointly determine the comparison. Changing duration, yield, or sowing costs requires another calculation.

## From a farm setting to executable rules

The player schedules labor. They choose when to sow and harvest but cannot command immediate maturity. The pressure concerns whether biological waiting, as represented by the rules, meets an available labor opportunity.

This could combine with worker placement, but there are no contested action spaces or workers here. Calling sowing an action does not make the model worker placement. A farming game might instead concern exchange, care, or land use; this one selects waiting and harvesting.

## Simplifications and the next observation

There are no water or nutrient needs, soil degradation, seed limits, or food spoilage. A round is not a real day or season. The model distinguishes “mature” from “collected”; it does not explain actual agricultural production.

Observe whether a reader automatically counts B's mature crop as food in round four. If so, check whether maturity markers and harvesting instructions clearly distinguish the states before adding weather or more varieties.

## Check: which final crop can be harvested?

Can a slow crop sown in round two be harvested in round four? What about one sown in round three?

**The first can; the second cannot.** They mature at the starts of rounds four and five respectively, and round five never occurs. Reaching maturity still requires choosing a harvesting action; it does not allow harvesting another plot simultaneously.

## Reference doorway

[BGG: Farming (1013)](https://boardgamegeek.com/boardgamecategory/1013/farming) identifies the category. The plots, yields, timing window, and analysis are original to this site, not advice for producing real crops.
