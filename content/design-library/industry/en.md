# Industry and manufacturing: why can't a spare part become a finished product?

Manufacturing involves more than exchanging one colored piece for another. Processing stages, energy requirements, and time spent modifying equipment can shape decisions. This original five-action episode uses invented quantities rather than a real manufacturing process.

## Specify the whole production chain

One workshop coordinator starts with 2 raw materials and 3 energy, no parts or products, and unmodified equipment. All inventories are public with unlimited storage. There are no orders, markets, random losses, or other players. Take five actions, choosing one legal option each time:

| Action | Pay | Receive or change |
|---|---|---|
| Process | 1 raw material + 1 energy | 1 part |
| Assemble | 1 part + 1 energy | 1 product |
| Modify | 1 energy; once only | Later assembly uses no energy, but still uses 1 part and 1 action |
| Wait | Nothing | Inventories unchanged |

Costs must be available beforehand. Do not borrow future output or allow negative inventory. Reselect an illegal action without spending it. Nothing automatically processes, recharges, or sells between actions; products cannot be dismantled. End after action five. Compare products only: more is better, equal amounts have equal value. Leftover materials, parts, and energy score nothing.

## Direct production: where does it stop?

Action one processes, leaving 1 raw material and 2 energy, with 1 part. Action two assembles, leaving 1 energy and no parts, producing 1 product. Action three processes again, exhausting raw materials and energy while making another part.

Assembly now requires energy that is unavailable. Actions four and five must be waits. Final inventory: **1 product, 1 part, 0 energy**. Completing an earlier stage does not guarantee the next stage can be completed.

## Modify first: change the later cost

Reset to the same starting position.

| Action | Choice | Raw | Energy | Parts | Products |
|---|---|---|---|---|---|
| 1 | Modify | 2 | 2 | 0 | 0 |
| 2 | Process | 1 | 1 | 1 | 0 |
| 3 | Assemble | 1 | 1 | 0 | 1 |
| 4 | Process | 0 | 0 | 1 | 1 |
| 5 | Assemble | 0 | 0 | 0 | 2 |

Modification initially costs 1 energy and an action, then saves 1 energy on each of two assemblies, yielding **2 products**. It does not remove the part or action cost. Only the energy requirement changes.

## An upgrade is not always the best opening

With only two actions, direct processing and assembly already produce 1 product. Modifying then processing leaves only a part. The five-action advantage depends on having time to use the modified equipment; it cannot be transferred unchanged to a shorter episode.

The player coordinates the whole chain. Workers' experience, workload, and safety have no separate actions. Making workers the protagonists would require deciding who controls work and bears its costs. Inventory efficiency is not everything an industrial theme can express.

## Simplifications and the next observation

Energy consists of discrete tokens, without power ratings, equipment life, emissions, or real units. A single permanent cost modification is a chosen fictional rule. Saving tokens does not establish a real-world energy benefit.

Ask readers to identify which inventory decreases and which increases at each step. Watch especially for treating modification as automatic production. The setting names the stages, but payment and output still need explicit rules.

## Check: start with only 2 energy

Keep the five actions and every other rule. Can modifying first still produce 2 products?

**No: only 1.** Modification leaves 1 energy, enough to process one raw material. Assembly is energy-free, but the second raw material cannot be processed. Direct processing and assembly also yield only 1 product. The shortage has shifted to processing; calling an action an upgrade does not remove it.

## Reference doorway

[BGG: Industry / Manufacturing (1088)](https://boardgamegeek.com/boardgamecategory/1088/industry-manufacturing) identifies the theme. The production chain, modification, and deadline comparisons are original to this site, not industrial instructions.
