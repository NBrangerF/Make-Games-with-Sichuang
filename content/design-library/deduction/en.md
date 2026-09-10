# Deduction: which possibilities does this clue rule out?

“I do not know the order yet” describes an information state. “These programs cannot occur in that order” starts to describe reasoning. **Deduction uses known rules and reliable facts to eliminate incompatible candidates.** One remaining possibility permits a definite conclusion. Several require retaining uncertainty; choosing an answer does not mean it has been proved.

## Specify what can be true first

In UNC-12, “Deduction,” Geoffrey Engelstein and Isaac Shalev describe the mechanism through elimination. They discuss ways to record reasoning and designs with different degrees of evidential certainty. This page uses finite candidates, a fixed answer, and explicit replies. Tone of voice and loose associations are not treated as necessarily reliable evidence. [Book reference](https://doi.org/10.1201/9781003179184)

Checkable elimination needs at least three things: the original allowed candidates, the rule that produces a clue, and the candidates that conflict with it. Receiving another message does not guarantee that possibilities decrease.

## Broadcast scheduling: six orders, two inquiries

This is an original local investigation for two people. One is the investigator; the other is a recorder who receives no score. There are only three segments: announcement A, interview B, and music C. Each plays exactly once, with no simultaneous segments. Letters are names, not a prescribed order. There is one card for each of six orders: **ABC, ACB, BAC, BCA, CAB, CBA**. BAC, for example, means B first, then A, then C.

The recorder uniformly shuffles the six identical-backed cards and secretly draws one as this phase's fixed order. The others remain face down aside. Only the recorder sees the answer; nobody may replace it. The investigator knows all six candidates, starts with 2 inquiry tokens and an empty spent area, and lists all candidates on paper. No other information source exists.

Three different query cards are public, each usable at most once this phase:

| Query card | The only question it permits |
| --- | --- |
| I | Does B come before A? |
| II | Does A come before C? |
| III | Does B come before C? |

At each decision, stop investigating or spend 1 token to choose an unused query card. Move the token to the spent area and turn the card face down. The recorder must immediately and publicly answer “yes” or “no” according to the fixed answer: no lies, ambiguity, or extra hints. Record the reply and remove candidates incompatible with all recorded replies before deciding whether to continue. Used cards cannot be queried again, and tokens cannot be borrowed.

When the investigator stops or both tokens are spent, announce the remaining candidates and “determined” or “undetermined,” then reveal the answer card to check. Only one remaining candidate means determined. This local phase awards no points, requires no guess when undetermined, and does not turn the final revelation into knowledge supposedly held earlier. Unused tokens and cards remain as they are, with no later use.

## Two inquiries can lead to different conclusions

Fix the drawn answer as **BAC** and reset the initial state for each route below. The answer is shown to readers for checking; the investigator does not see it before asking.

| Route | Query and truthful reply | Previous candidates | Elimination and remaining candidates |
| --- | --- | --- | --- |
| One, query 1 | I: B before A, yes | All six | Remove ABC, ACB, CAB, where A is before B. Keep BAC, BCA, CBA. |
| One, query 2 | II: A before C, yes | BAC, BCA, CBA | BCA and CBA put C before A. Only BAC remains. |
| Two, query 1 | II: A before C, yes | All six | Remove BCA, CAB, CBA, where C is before A. Keep ABC, ACB, BAC. |
| Two, query 2 | III: B before C, yes | ABC, ACB, BAC | ACB puts C before B. Keep ABC, BAC. |

Route one narrows 6 candidates to 3, then 1. B before A and A before C connect all three positions into a single order. Route two narrows 6 to 3, then 2. It establishes only that A and B both precede C, leaving their order unresolved. Both remaining candidates fit the truthful replies. The actual answer being BAC does not justify removing ABC.

Both routes finish with no tokens held, 2 in the spent area, two used query cards, and one unused card. Route one announces “BAC, determined”; route two announces “ABC or BAC, undetermined.” The answer is then checked. Although route two's unused card I could distinguish its remaining candidates, no tokens remain to ask it for free.

These are two processes for one fixed answer, not proof that route one solves every answer in two inquiries. For example, asking I then II and receiving “yes, no” leaves BCA and CBA. Filter according to the actual replies instead of copying this particular elimination pattern.

## Change only whether replies are guaranteed truthful

Reset the same answer BAC, two tokens, and route one's query order. Change only the recorder's reply permission: **at most one of the two replies may reverse the correct yes/no answer; both may also be truthful.** The investigator knows this rule but not which reply, if any, is reversed. Costs, sequence, and ending stay unchanged.

Suppose the replies are still “yes, yes.” Neither reply can now simply be assumed a fact. For each candidate, ask how many reversals would be needed to produce this record if that candidate were true.

| Candidate | Truthful replies to “B before A / A before C” | Mismatches with “yes / yes” | Still possible? |
| --- | --- | --- | --- |
| ABC | No / yes | 1 | Yes |
| ACB | No / yes | 1 | Yes |
| BAC | Yes / yes | 0 | Yes |
| BCA | Yes / no | 1 | Yes |
| CAB | No / no | 2 | No |
| CBA | Yes / no | 1 | Yes |

Both tokens are still spent, but only CAB can be removed. Five candidates remain and the conclusion is “undetermined.” The fixed answer BAC allows two truthful replies, so this record is legal. No rule specifies how the recorder chooses reversals, so the five surviving candidates cannot be declared equally likely on that basis.

## Keep the reasoning visible

A candidate list lets others inspect each deletion: did a rule exclude it, or did the player merely find it unlikely? In the base version, truthful replies permit taking the intersection of conditions. With a possible reversal, the test becomes “no more than one mismatch with the whole record.” Reliability changes valid reasoning, not just confidence in a guess.

Hidden information describes who can see the answer; deduction describes reaching conclusions through constraints. Remembering replies is necessary here, but merely recalling a “yes” does not explain what it excludes. This page's ordering and reply rules are public; there is no need to guess an unknown rule from a few samples.

## Check: can this candidate be crossed out?

1. Can route two in the base version remove ABC? **No.** A and B both precede C, satisfying both truthful replies. Their relative order remains unresolved.
2. Does an unused query card permit a third inquiry? **No.** Card availability and sufficient tokens are separate requirements. Both tokens have already been paid.
3. With at most one reversed reply, why can CAB still be removed? **It requires two reversals to produce “yes, yes,” exceeding the permission.** Each other candidate requires zero or one; this record cannot eliminate any of those five.

## Sources and scope

The core source is Geoffrey Engelstein and Isaac Shalev, *Building Blocks of Tabletop Game Design: An Encyclopedia of Mechanisms*, second edition, CRC Press, 2022, chapter 6, “Uncertainty,” UNC-12, “Deduction” (EPUB anchor `filepos624123`). Its description and discussion were read. The broadcasts, candidate cards, queries, costs, and all elimination sequences are original analysis, not commercial-game rules or measured learning outcomes. [Bibliographic reference and DOI](https://doi.org/10.1201/9781003179184)

[BGG 3002: Deduction](https://boardgamegeek.com/boardgamemechanic/3002/deduction) is a checked mechanism identity link with a related mapping. Neither the similarly named theme category nor an unread web definition is used as evidence.
