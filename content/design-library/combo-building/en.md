# Combo building: how does one resource trigger the next device?

Having three cards in front of you does not establish a combo. Look for one effect changing another effect's conditions, cost, or output. This library treats combo building as a design pattern: it describes abilities working together, implemented through particular payment, trigger, usage-limit, and action rules.

## Find effects that actually connect

In SET-05, “Combo Abilities,” Geoffrey Engelstein and Isaac Shalev discuss separately acquired abilities that work together. CAR-09, “Tags,” explains how identifiers can connect an event with an effect defined elsewhere. Matching icons do not automatically grant a reward; the rules must establish the connection.

The example below uses installed and uninstalled devices to follow “gain a part → gain energy → gain another part.” It has no bonus for collecting a prescribed set of types, and it does not reuse the lesson's red-blue card acquisition and delivery example.

## A workshop with three actions

This is an original local phase for one player. Lin begins with 2 energy, 6 ore, 2 coins, and 0 parts. All information is public. The Press and Assembler are already installed; the Recycler is beside them, uninstalled. The supply contains 20 energy and 6 part tokens. The coin bank and spent-ore area are empty. There is no drawing, trading, or other income.

Lin takes exactly three actions. Each action is one of: pay 2 coins to the bank to install the Recycler; run the Press; or wait. Installation is possible only once. Waiting also uses an action. Running the Press also requires at least 1 part in supply: pay 1 energy and 1 ore first, then take 1 part from supply. Insufficient payment or supply makes the action illegal; a later refund cannot pay its initial cost.

Paid energy returns to supply, and gained energy comes from there. Paid ore goes to the spent area and does not return. Resources held at setup are not “gain” events. Installing a device produces neither a part nor energy.

| Device | When it responds | Effect |
| --- | --- | --- |
| Press | You spend an action to run it | Pay 1 energy and 1 ore; gain 1 part |
| Recycler | It is installed and you just gained 1 part | Gain 1 energy at no cost |
| Assembler | You just gained 1 energy | Pay 1 energy and 1 ore; gain 1 part |

The Recycler and Assembler may each respond **at most once per action**. A response is mandatory when the device is installed, has a use available, can pay, and has sufficient supply. Mark its use before paying and producing its effect. Immediately check the resulting event, continuing until nothing can respond; only then does the action finish. Skip a response that lacks a use, payment, or supply. It does not wait in a queue for later. Each event in this example has only one possible responding device, so there is no simultaneous-effect ordering dispute.

Reset response uses only at the start of the next action. After the third action and all its effects finish, the phase ends: each part scores 3 points, and remaining materials and coins score nothing. Triggers do not award additional points. This records a phase result, not a complete game's winner; equal scores remain equal.

## Install first, then connect two production actions

The first action installs the Recycler, reducing coins from 2 to 0 without changing materials. On the second action, run the Press: pay from 2 energy and 6 ore to 1 energy and 5 ore, then gain the first part. The Recycler responds, returning energy to 2. The Assembler responds, pays 1 energy and 1 ore, and gains the second part.

That new part does meet the Recycler's event condition, but its use for this action is already spent. Stop here. The second action ends with 1 energy, 4 ore, and 2 parts.

On the third action, reset the uses and run the Press again, gaining two more parts. Finish with 0 energy, 2 ore, and 4 parts, worth 12 points. Supply holds 22 energy and 2 part tokens; the spent area holds 4 ore, and the bank holds 2 coins. Energy has not vanished: both production payments and recovery were accounted for in supply.

## Produce first, then install: what is missing?

Reset the initial state. This time, run the Press first, gaining 1 part and retaining 1 energy and 5 ore. With no Recycler installed, there is no new energy-gain event. The already installed Assembler does not activate on its own.

Spend the second action and 2 coins to install the Recycler. It does not react retrospectively to the first action's part. The third action runs the Press and its subsequent responses, adding 2 parts. Finish with 0 energy, 3 ore, and 3 parts, worth 9 points. Supply holds 22 energy and 3 part tokens; the spent area holds 3 ore, and the bank still holds 2 coins.

| Action order | After first: energy / ore / parts | After second | After third | Score |
| --- | --- | --- | --- | --- |
| Install, run, run | 2 / 6 / 0 | 1 / 4 / 2 | 0 / 2 / 4 | 12 |
| Run, install, run | 1 / 5 / 1 | 1 / 5 / 1 | 0 / 3 / 3 | 9 |

Both routes spend 2 coins, use all three actions, and end with the same devices. The difference is whether the Recycler could respond when the first part appeared. Counting devices at the end cannot explain the output by itself.

## Change only the response limit from one to two

Keep “install, run, run,” changing only the common per-action response limit for the Recycler and Assembler from 1 to 2. Costs, mandatory responses, three actions, and starting materials remain unchanged.

The first production action now proceeds: Press gains a part; Recycler gains energy for the first time; Assembler gains a part for the first time; Recycler gains energy for the second time; Assembler gains a part for the second time. The Recycler has now reached its limit. The state is 1 energy, 3 ore, and 3 parts.

The last action produces another 3 parts. Finish with 0 energy, 0 ore, and 6 parts, worth 18 points. All 6 ore are in the spent area, part supply is empty, energy supply still holds 22, and the bank still holds 2 coins. Raising the limit let this budget support two additional assemblies. That does not establish a general reason to raise every combo's limit.

There is a feedback path here, but removing a use limit would not necessarily make it infinite: each assembly still consumes ore, and this phase has only 6 ore. When checking a loop, track permission to repeat, net resource changes, and exhaustible supplies together, instead of merely drawing a returning arrow.

## Check: are the condition, payment, and use all available?

1. **With the Recycler installed but only 0 energy and 2 ore at the start of an action, can Lin run the Press and pay using its refund?** No. The initial 1 energy must be paid first. The refund follows successfully gaining a part.
2. **Can installing the Recycler after producing a part grant the missed energy?** No. This rule responds to a new event. It neither replays history nor reacts merely because a part is already present.
3. **When a run produces its second part under the original rules, can the Recycler's use reset immediately?** No. Uses reset at the start of the next action. That second part is a subsequent effect within the same action.

## Sources and scope

The core source is Geoffrey Engelstein and Isaac Shalev, *Building Blocks of Tabletop Game Design: An Encyclopedia of Mechanisms*, second edition, CRC Press, 2022: Chapter 12, SET-05 “Combo Abilities” (EPUB anchor `filepos1020293`), and Chapter 13, CAR-09 “Tags” (`filepos1085495`). Both complete descriptions and discussions were read. The devices, costs, trigger procedure, two orders, and usage-limit comparison are original to this site. [Bibliography and DOI](https://doi.org/10.1201/9781003179184)

[BGG 2956: Chaining](https://boardgamegeek.com/boardgamemechanic/2956/chaining) is a related identity reference only. This retrieval established its name and address, without definition text. Neither this site's pattern classification nor the local response rules follow automatically from that name. Arithmetic checking is not human playtesting and establishes no particular learning effect.
