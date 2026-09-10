# Trick-Taking: Why Can Winning a Trick Cost You Points?

“The biggest card” is not enough to identify a winner. First determine the led suit, whether there are trumps, and whether others must follow suit. Even after establishing who takes the trick, another rule must determine what those captured cards contribute to the result.

Below we separate playing, winning a trick, and scoring through an original nine-card game. Three players compete for individual scores; this is not a cooperative mission. *Building Blocks of Tabletop Game Design*, second edition, Chapter 13, CAR-01 “Trick-Taking,” pp.529–531, discusses these rules and their variations. We set the example's rules independently, without reproducing a book example or a task from *The Crew*. [Publication information](https://doi.org/10.1201/9781003179184)

## Nine cards, ending after three tricks

The entire deck has three suits—red, blue, and green—each numbered 1, 2, and 3, with one copy of each card. A, B, and C sit in that cyclic order; A leads the opening trick. Here are all hands, fully public. There is no draw pile, replenishment, exchange, bidding, or extra money.

| Player | Complete three-card hand |
| --- | --- |
| A | Red 1, blue 3, green 1 |
| B | Red 2, red 3, blue 1 |
| C | Blue 2, green 2, green 3 |

Each player must play one card per trick, with no passing. The leader may choose any card. The other two must play the led suit if they hold it; otherwise they may play any card. Following suit does not require beating an earlier card. Green is trump, but holding a trump does not allow a player to ignore a led suit still in hand.

After all three have played, the highest green wins if any greens were played. Otherwise, the highest card of the led suit wins, with other suits excluded. The winner takes all three cards and leads the next trick, continuing clockwise in the cyclic A→B→C seating order. When green is led, green must also be followed.

Winning a trick earns one point, but every captured red card costs two points. Record both contributions after each trick. After trick three, total the scores; the highest wins. Negative scores are allowed, and players tied for highest share victory. There is no early exit or further tiebreaker. Everyone plays all three cards, and all nine finish in players' captured areas.

No suit contains repeated ranks, so no trick has an unresolved tie. Cards from different suits can share a printed number without sharing eligibility to win. Final scores, however, can tie.

## Should C take the opening trick or let it go?

Fix A's lead at red 1 and B's reply at red 2. B could legally play red 3, but we hold that choice fixed; blue 1 is currently illegal. C has no reds, so blue 2, green 2, and green 3 are all legal. First compare complete routes beginning with green 2 and blue 2. The other players' later choices are specified too, without claiming that they are optimal.

Route A: C takes the opening trick with green 2.

| Trick | Actual play order | Capturing player | Score change for this trick |
| --- | --- | --- | --- |
| 1 | A red 1→B red 2→C green 2 | C | 1−2×2=−3 |
| 2 | C blue 2→A blue 3→B blue 1 | A | +1 |
| 3 | A green 1→B red 3→C green 3 | C | 1−2×1=−1 |

Final scores are A: 1, B: 0, C: −4: A wins. A captures three cards, C six, and B none; all hands are empty. C wins two tricks yet finishes below B, who wins none.

Route B: C plays blue 2 in the opening trick.

| Trick | Actual play order | Capturing player | Score change for this trick |
| --- | --- | --- | --- |
| 1 | A red 1→B red 2→C blue 2 | B | −3 |
| 2 | B blue 1→C green 2→A blue 3 | C | +1 |
| 3 | C green 3→A green 1→B red 3 | C | −1 |

Final scores are A: 0, B: −3, C: 0: A and C share victory. B captures three cards and C six, with all hands again empty. C still wins two tricks but captures one red instead of three, reducing the penalty by four points. In trick two, A holds blue 3 and must follow blue, so cannot play green 1 instead. C has no blue left and may win with green 2.

C's third opening option, green 3, also has a complete route: A red 1→B red 2→C green 3; then C blue 2→A blue 3→B blue 1; then A green 1→B red 3→C green 2. The winners remain C, A, C, and the final scores remain 1/0/−4.

All three routes resolve three tricks and capture three reds: three reward points minus six penalty points give a table-wide total of −3. Choices reassign the penalties without making red cards disappear. The scoring rule establishes the relationship between tricks won and final performance.

## Remove only green's trump status

Redeal exactly the same hands and change one rule: there are no trumps, so the highest card of the led suit always wins. Keep following suit, scoring, and the opening leader unchanged. Preserve the order in which each player uses their cards from route A. Actual turn order changes as a consequence of different trick winners.

| Trick | Actual play order | Capturing player | Score change for this trick |
| --- | --- | --- | --- |
| 1 | A red 1→B red 2→C green 2 | B | −3 |
| 2 | B blue 1→C blue 2→A blue 3 | A | +1 |
| 3 | A green 1→B red 3→C green 3 | C | −1 |

A finishes with 1, B with −3, and C with −1; A wins. Everyone captures three cards and holds none, and scores still total −3. Green 2 and red 2 do not tie in trick one: green is neither the led suit nor a trump, so green 2 is ineligible to win. Green 3 wins trick three because green was led in that trick.

This change affects both the current recipient and the next leader. Changing the first row's winner while keeping C as the second trick's leader would silently change another rule.

## When it helps, and where the boundaries lie

Trick-taking can make the same hand's value depend on the led suit, remaining suits, and scoring objective. Restrictions also reveal information: when someone legally plays off suit in this example, they have no cards of the led suit at that moment. All hands are public here to support calculation. If hands become hidden, a route found by inspecting the entire table is not necessarily one players could identify with certainty at the time.

CAR-01 discusses variations in following suit, trumps, and scoring. A trick-taking label therefore does not by itself guarantee mandatory following, a fixed trump suit, points per trick, or cooperation. Our inference from this small game is to check legal plays, trick resolution, transfer of the lead, and final rewards separately, rather than using one generic “compare values” rule for everything.

Do not automatically equate it with ladder climbing. The neighboring CAR-02, pp.532–533, discusses successive plays constrained by combination and rank, alongside goals such as shedding a hand. Here, each trick contains exactly one card from each of three players before it resolves. Everyone uses their last card during trick three; being first to empty a hand is not the objective. Whether players have partners is another structural choice, separate from these procedures.

## Self-checks with answers

1. May B play blue 1 in the opening trick? **No. B holds red 2 and red 3 and must follow red.**
2. Must C play a trump when holding no reds? **No. Blue 2, green 2, and green 3 are all legal.**
3. Why does C score −4 after winning two tricks in route A? **Two tricks add two points, while three reds subtract six.**
4. Do red 2 and green 2 tie in the no-trump opening trick? **No. Only cards of the led red suit are eligible to win.**

## References and classification

- Geoffrey Engelstein and Isaac Shalev, *Building Blocks of Tabletop Game Design: An Encyclopedia of Mechanisms*, Second Edition, CRC Press, 2022: Chapter 13, CAR-01 “Trick-Taking,” printed pp.529–531, electronic anchor `filepos1030389`; neighboring CAR-02 “Ladder Climbing,” pp.532–533, anchor `filepos1036675`. The contiguous entry texts were read. The nine cards, penalties, and routes in this article are our original construction. [Publication information](https://doi.org/10.1201/9781003179184)
- [BoardGameGeek: Trick-taking (2009)](https://boardgamegeek.com/boardgamemechanic/2009/trick-taking): a classification identity and discovery link. A category label is not a universal rulebook, and one cooperative game's objective is not applied to every trick-taking game here.
