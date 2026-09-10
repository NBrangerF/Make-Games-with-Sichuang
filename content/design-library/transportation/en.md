# Transportation: Why Can the Shorter Trip Earn Fewer On-Time Points?

Transportation involves more than moving a vehicle between spaces. What is carried, who needs it, and when delivery counts determine why the journey matters. Players might drive, schedule services, or dispatch vehicles. Those perspectives need different action permissions.

This original delivery episode uses fixed roads, handling actions, and two deadlines to compare earlier completion with a higher punctuality score. Its locations, durations, and rewards are fictional.

## One vehicle, two different commitments

One player dispatches a truck with capacity for two parcels. It starts empty at warehouse W, where red and blue parcels await collection. Everything is public; there are no random events or other vehicles. Every road below works in both directions:

**North shop N — Junction J — Warehouse W — South shop S**

Red goes to North and earns 3 points if delivered by the end of action 4. Blue goes to South and earns 2 points if delivered by the end of action 3. Delivery on the deadline action counts as punctual. Late delivery remains legal but earns 0 for that parcel.

There are at most eight actions. Each does exactly one thing: at W, load one or two waiting parcels without exceeding capacity; move along one connection; deliver one carried parcel at its correct destination; or wait. Each choice costs one action, with no other payment. Arrival is not delivery: movement never unloads automatically.

Parcels cannot be transferred or stored elsewhere en route. Delivery moves a parcel from the truck to its shop, and it cannot score again. Stop when both parcels are delivered or action eight ends, whichever happens first. Compare final punctuality points. The delivered count describes completion but earns no extra points. There is one player; plans with equal points have equal value under this scoring rule.

## Sequence one: serve the nearer South shop first

Load both parcels, then follow this sequence:

| Action | Move or task | Cargo and delivery result |
|---|---|---|
| 1 | Load both at W | Red and blue aboard |
| 2 | W to S | At South; nothing delivered yet |
| 3 | Deliver blue | On time: 2 points; red remains aboard |
| 4 | S to W | Return carrying red |
| 5 | W to J | Red remains aboard |
| 6 | J to N | At North; red not delivered yet |
| 7 | Deliver red | After action 4: 0 points; both delivered, stop |

This takes seven actions and traverses four road connections. Both parcels arrive, with a punctuality score of **2**.

## Sequence two: honor North's commitment first

Keep the parcels, roads, capacity, deadlines, and rewards identical. Change only delivery order.

Action 1 still loads both at W. Action 2 moves W to J; action 3 moves J to N. Action 4 delivers red exactly on time for 3 points. Action 5 moves N to J, action 6 J to W, and action 7 W to S. Action 8 delivers blue late for 0. Both are delivered, so stop.

This takes eight actions and five road connections—one more connection than the first sequence—but scores **3**. If the goal were simply to finish sooner, the first sequence would be preferable. Under the current punctuality rewards, the second scores higher. You must know what the game values before deciding which journey is worth arranging.

## Which relationships create the pressure?

The player is a dispatcher. Actions include loading, moving, and delivering. Limited actions and different deadlines create pressure. The critical connection is this: **cargo must reach the correct place and use a delivery action before punctuality is checked.** A map position now connects to a commitment on the scoring schedule.

Without a carrying limit, what to bring might cease to matter. Without handling time, completion times would change. Here, loading both parcels costs no extra action, so both sequences hold that decision constant and compare which shop to visit first. This does not establish that a full load is always best in every transportation game.

This is not route building, either. The roads already exist, and the player has no construction action. They schedule movement over fixed connections. Adding bridges or stops later would require rules for how construction changes journeys and what it costs.

## A small truck need not contain every real-world issue

The model does not calculate fuel, traffic conditions, loading equipment, or vehicle wear. An action is not converted into real minutes. The rewards of 3 and 2 points are this model's treatment of two commitments, not real transportation prices.

What it preserves is a relationship among cargo, destinations, and deadlines. Changing the theme to passenger services would introduce waiting, boarding, and human needs that this model does not represent. Renaming parcels as passengers would not automatically represent those relationships.

## Check: does arriving early secure the points?

The truck reaches North on action 3, waits on action 4, then delivers red on action 5. What does red score? Separately, can both parcels be delivered on time?

**Red scores 0.** The deadline checks delivery, not arrival.

Both cannot be punctual under these starting conditions and action costs. Delivering blue first takes at least three actions. Traveling S, W, J, N and delivering red then finishes no earlier than action 7. Delivering red first finishes no earlier than action 4, after blue's action-3 deadline has already passed. This conflict is deliberately present in the model; more careful arithmetic cannot remove it.

## Bring it back to your transportation game

Observe whether players distinguish the vehicle arriving, the cargo being delivered, and a commitment being fulfilled. When a player chooses an itinerary, ask whether they are comparing road connections, completion time, or rewards. If two people mean different things by “efficiency,” clarify goals and scoring before adding congestion or more vehicles.

## Reference leads

Kathleen Mercury, [Board Game Mechanics 2020, slide 54, “Pickup & Deliver”](https://docs.google.com/presentation/d/1VBetaCF7Tps85ZRc439ki-Q9t52K1l15/htmlpresent).

Pat Harrigan and Noah Wardrip-Fruin, “Twilight Struggle and Card-Driven Historicity,” in *Tabletop: Analog Game Design*, edited by Drew Davidson and Greg Costikyan, ETC Press, 2011, pp. 160–161, 165, on the boundary between game relationships and real-world relationships.

[BGG category lookup: Transportation (1011)](https://boardgamegeek.com/boardgamecategory/1011/transportation). This identifies the category. The delivery model and analysis are original to this site, not a BGG definition or real-world dispatching advice.
