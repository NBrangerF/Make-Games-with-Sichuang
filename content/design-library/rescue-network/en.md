# Intermittent communication: can the right supplies leave one round late?

When each node can act only on what it has already received, knowing the need and dispatching in time become connected problems. This develops the rescue-network setting with three players and two transfer rounds. The goal is matching-supply delivery, without casualty scoring.

## Three nodes, separate decisions

A, B, and C are controlled by players at those respective nodes. The one-way route is A→B→C, with no reverse or direct link. A starts with one red package and one blue; B and C have none. C needs red, initially known only to C's player. Everyone knows the need is red or blue; inventories and routes are public.

Before actions, C's player may accurately report the needed color once or remain silent. No communication follows during the two rounds. Each round, every node simultaneously chooses to send one package it **held at the start of that round** to the next node or wait. At most one package per node per round; C has no outgoing link and waits.

All sends settle together at round end. A newly received package cannot be forwarded in that same round. Packages never duplicate, automatically continue, or change color. There are no fees, random losses, or alternative routes. Replace an unavailable send with a legal choice before resolution, without inventing negative inventories.

Receiving red at C completes the need. Resolve any other transfers that round, then end. Otherwise fail jointly after round two. Blue cannot substitute, and extra supplies score nothing. The answer is disclosed below for two specified sequences, without claims about how real players would guess in silence.

## Red leaves only in round two

No report is made. A sends blue in round one while B and C wait. Blue reaches B at round end.

In round two, A sends red and B sends the blue it already holds, while C waits. Simultaneous resolution leaves **red at B and blue at C**. The need fails. Both links operating in one round does not mean red has passed through both.

## Report first and move the needed package first

Reset. C reports red. A sends red in round one while B and C wait, leaving red at B. In round two B sends red while A and C wait. Red reaches C, completing the need successfully.

| Sequence | End of round one | End of round two | C's need |
|---|---|---|---|
| Blue first, red second | Blue at B | Red at B; blue at C | Incomplete |
| Report red, dispatch red first | Red at B | Red at C; blue remains at A | Complete |

The report neither shortens the route nor increases capacity. It gets the required color onto the first link early enough for two rounds to cover two transfers.

## Who knows and controls what?

C knows the need, A selects dispatch order, and B selects forwarding. The right color and timing depend on different decisions. A shortest-path answer from an omniscient coordinator would omit that information distribution.

Limited communication is a stated game condition, not a universal collaboration-teaching requirement. Continuous reporting or immediate forwarding would change the problem and need another comparison. These sequences do not establish real rescue benefits from reporting.

## Check and model boundary

A waits in round one, then sends red in round two. Can B simultaneously forward that red package to C?

**No.** B has no red at the start of round two and must select from its existing inventory. Red arrives at B only at round end, where it remains. This fails regardless of whether C already reported the need.

The route, supplies, and request are fictional, without real disaster-response, priority, or reliability parameters. Observe whether readers list beginning-of-round inventories correctly rather than using incoming goods early.

These original rules develop Luozhuo's rescue-network setting. The related science-fiction article examines delayed individual commands; this episode puts delay into multiplayer handoffs and need information.
