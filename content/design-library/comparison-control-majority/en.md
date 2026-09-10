# Does presence tell you who controls an area?

“This area is mine” might mean you entered it last, have the most pieces there, or constrain enemies passing nearby. A designer must turn those sentences into distinct rules. This page first changes only the beneficiary on a shared board, then uses a separate movement comparison to explain a zone of control.

## Fix the board and placement procedure

This original local phase has three players, A, B, and C, starting at zero points. North Station is worth 3 points and South Station 2. Influence pieces of different colors coexist: they neither fight nor remove pieces, and do not block placement. The initial stations are:

| Station | A's pieces | B's pieces | C's pieces | Registration marker |
|---|---:|---:|---:|---|
| North | 2 | 1 | 0 | A |
| South | 0 | 1 | 1 | B |

Treat the initial markers as records of the last entry before this phase; you need not reconstruct that history. Each player also has one reserve piece. In A–B–C order, each takes exactly one action: place their reserve piece in either station for free, or wait. Placement changes that station's registration marker to the player placing. Waiting does not change it. There are no other actions, and unused reserve pieces score nothing.

Score both stations only after C's action, then end the phase with no further placement. In the base version, a station's registered player receives its entire reward, regardless of piece counts. Each station has at most one registered player; registration does not prohibit coexistence. Record each player's score; equal total scores remain tied, with no further tiebreaker.

## First sequence: the same investment gives different leaders

A places North, B South, and C North. North ends with A3, B1, C1 and C registered. South ends with A0, B2, C1 and B registered.

The base version checks only the markers: C receives North's 3 points and B South's 2. The result is **A0, B2, C3**. C's one piece did not become the largest force at North; C was simply the last player to place there.

Reset to the same initial state. Keep all actions and marker updates unchanged, altering just the reward rule: **A station's points go to the player with uniquely the most influence pieces there. If the highest count is tied, or the station is empty, nobody scores there.** There is no second-place reward or sharing. Continue updating registration markers, but they do not determine rewards in this version.

Repeat A North, B South, C North. A's three pieces are uniquely the most at North, earning 3. B's two earn 2 at South. The result becomes **A3, B2, C0**. Pieces, placement permissions, and turn order are unchanged; only the state used to select the beneficiary differs.

## Second sequence: everyone invests in North

Start again from the initial state, with all three placing North. North ends at 3/2/1 with C registered; South remains 0/1/1 with B registered.

Registration scoring still gives A0, B2, C3. Under count-based scoring, A's three pieces are uniquely the most at North, earning 3. B and C tie at South with one each, so nobody receives its 2 points. The result is A3, B0, C0.

| Fixed action sequence | Final North counts: A/B/C | Final South counts: A/B/C | Registration scores: A/B/C | Count-based scores: A/B/C |
|---|---|---|---|---|
| A North, B South, C North | 3/1/1 | 0/2/1 | 0/2/3 | 3/2/0 |
| Everyone North | 3/2/1 | 0/1/1 | 0/2/3 | 3/0/0 |

In the second sequence, North has six pieces. A holds three, not more than half, but still uniquely the most. This example uses a plurality rather than requiring an absolute majority. Meanwhile, South has pieces and a registered player yet no beneficiary under count-based scoring. Presence, registration, and receiving a reward are different states.

## Occupancy permissions have not changed

The registration system here selects one beneficiary while allowing coexistence. It is a rule designed to isolate reward determination, not a miniature model of every absolute-control game. Some games prohibit enemy coexistence and start combat on entry; some preserve ownership after departure; others change control only at specified times. Each needs its own rules.

If you also change the registration version to prohibit placement in another player's station, the first sequence may no longer be playable. You would be changing legal actions as well as rewards, so could not attribute the score difference entirely to counting pieces. Open the related entries below: Area control for exclusive occupancy, and Area majority for counts and ties.

## A zone of control is a separate movement rule

The following is an independent movement comparison, not a new ability added to the stations. Four spaces have only three two-way connections: West–Bridge, Bridge–East, and Bridge–Post. A courier starts at West. An enemy guard stays at Post and does not act. The courier makes one move, paying one movement point per edge, with a maximum of two points. It may stop early or retrace its path. Entering Post is forbidden. There are no attacks, scores, or other effects.

Under the base movement rule, choosing West→Bridge→East costs two points and ends at East. Add only this zone-of-control rule: **Each time you enter a space adjacent to the enemy guard's space, immediately end this move and forfeit remaining movement points.** Attempting the same route now stops at Bridge. The remaining point cannot be spent, including to return to West during this move.

The guard is not on Bridge but restricts movement there through adjacency. This restriction does not automatically give the guard ownership of Bridge, a station's income, or any majority points. Here the zone only means stopping on entry to an adjacent space. Other games may use extra costs, attacks, or different departure conditions; the name does not specify one universal rule.

## Ask three separate design questions

Who can enter or coexist determines legal actions. Which state allocates a reward determines who receives what. Which nearby spaces a unit affects determines the restrictions it projects beyond its own location. You can connect these questions, but the rules must specify the connections.

Registration rewards the last contributor at North in these two sequences; that does not establish that only the last turn matters on every board. Count-based scoring preserves the effect of earlier investment without automatically being fairer. These examples do not test multiple rounds, different placement costs, or human negotiation. Select the next factor you want to study and keep other conditions fixed.

## Check yourself: what does waiting erase?

1. How do the two versions score if everyone waits?
2. If everyone places North, can C claim its 3 points for placing last under count-based scoring?
3. With the zone-of-control rule active, may the courier stay at West? Does the guard own Bridge?

**Answers:** First, waiting changes neither markers nor counts. Registration gives A3, B2, C0. Under count-based scoring, A leads North while B and C tie South: A3, B0, C0. Second, no: placing last is not part of that scoring rule. Third, the courier may stop before moving and remain at West. No ownership of Bridge is defined, so it cannot be inferred from the zone of control.

## Sources and scope

Geoffrey Engelstein and Isaac Shalev, *Building Blocks of Tabletop Game Design*, second edition: ARC-01, “Absolute Control” (printed pp. 486–487), discusses single ownership, coexistence boundaries, and control records after departure; ARC-02, “Area Majority/Influence” (pp. 488–490), discusses multiple players' presence, benefits, and ties; ARC-07, “Zone of Control” (pp. 501–502), discusses units affecting movement or attacks through nearby spaces. This page separately tests registration, rewards, and movement. The stations, registration procedure, and courier example are original; they neither reproduce the book's games nor prescribe a universal classification.
