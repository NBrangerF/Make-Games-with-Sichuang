# Traitor structure: conflicting objectives, incomplete evidence

A secret does not establish a traitor. Teammates can hold private clues while pursuing the same victory. In a traitor structure, people who appear to undertake a shared task actually belong to factions with conflicting objectives, and information about those affiliations affects other players’ decisions.

STR-07 in the second edition of *Building Blocks of Tabletop Game Design* places traitor games at the intersection of team play, cooperation, and social deduction. Its definition requires traitors to begin with hidden identities. The trial-and-final delivery game below is an original teaching example about the difference between failure, suspicious conduct, and evidence sufficient to identify someone. It reproduces neither commercial rules nor a complete play history.

## Starting state: objectives and permissions

There are four players, A, B, C, and D, plus a nonplaying referee who handles confidential resolution and belongs to neither faction. A is a publicly loyal coordinator. Shuffle three role cards, Loyal, Loyal, and Traitor, uniformly and deal them secretly to B, C, and D. Each sees only their own role. Everyone knows the number and distribution of roles, which never change.

The loyal faction comprises A and the two loyal crew members. They win together if the final delivery succeeds. The sole traitor wins if it fails. The trial has no separate victory condition. There are no individual points or draws, and identifying the traitor does not itself end the game.

B, C, and D each hold two trial action cards, Deliver and Sabotage, and a fresh pair of the same cards for the final delivery: 12 action cards in total. Whenever assigned, a player must secretly select one card from the appropriate phase’s pair. Loyal players may legally choose only Deliver; the traitor may choose Deliver or Sabotage. Everyone has the same physical action cards, so card types do not reveal a role. Locked choices cannot change, be withdrawn, or be supplemented.

There is no money or other fee, but each assigned crew member has only this one choice in each phase. They cannot add a second Deliver to cancel Sabotage. Unassigned crew take no action and still share their faction’s outcome.

## The sequence from trial to ending

Except for the public statements specified below, players may not talk, signal, or pass information.

1. B and C are always assigned to the trial. They simultaneously lock one action each, face down in separate named positions. The referee uniformly shuffles two weather cards, Clear and Storm, and secretly draws one. The other remains hidden.
2. The referee privately reads both actions and the weather and announces only Success or Failure. Success requires two Deliver actions and Clear weather; every other combination fails. The referee preserves the named records without showing actions, roles, or weather or providing extra hints.
3. B, C, and D each make one public statement, in that order. They may lie about identity, action, or intention, but may not show role or trial cards or peek at anyone else’s cards. A then publicly locks in exactly two of the three crew for the final delivery. There is no vote, expulsion, or reselection.
4. Those two players secretly and simultaneously lock their fresh final action cards, then reveal them publicly. The final route is sheltered and draws no weather. Two Deliver actions succeed; any Sabotage causes failure.
5. Immediately determine the winners from the final result, then reveal roles, trial records, and weather for verification. No further actions occur.

Actual actions must still obey role permissions: permission to lie does not let a loyal player choose Sabotage. Exactly 2 trial and 2 final action cards are used, leaving 8 unused. Of the two weather cards, only one is drawn. The additional referee and confidentiality work are practical organizational costs of this example’s incomplete reporting.

## Two complete continuations after the same failure

To make the example checkable, here is the actual arrangement that coordinator A does not yet know: C is the traitor; B and D are loyal. During the trial, B chooses Deliver, C chooses Sabotage, and the weather is Clear. The referee reports only Failure. The three public statements are “I delivered,” “I delivered,” and “I can go,” respectively. C’s statement is false but legal. Both continuations fix the same behavior policy: C sabotages if selected; loyal players can only deliver.

| Continuation | Final actions | Final result and winners |
| --- | --- | --- |
| A selects B and D | B delivers; D delivers | Success: A, B, and D win together; C loses |
| A selects B and C | B delivers; C sabotages | Failure: C wins; A, B, and D lose |

Both continuations have identical starting conditions, trial actions, and public statements. Only A’s selection changes. The first is a legal outcome, not proof that A could identify C from the word Failure. In the second, D loses with the loyal faction despite not taking part in the final delivery. Outcomes do not belong only to the selected crew.

Another actual arrangement fits the same report: D is the traitor, B and C are loyal and both choose Deliver, but the trial draws Storm. The report is again Failure, and all three statements remain possible. If A treats this as proof against C and selects B and D, D can sabotage the final delivery and win. Failure establishes that the task’s conditions were not met. It does not establish who sabotaged—or even that any sabotage occurred.

## Change one rule: reveal named trial actions

The variant changes only the trial disclosure. After the report and before the three statements, reveal B’s and C’s trial action cards with their names attached. Weather remains hidden. Factions, action permissions, selection authority, and final victory conditions stay the same.

Give A a fixed decision policy: “If the public record shows someone sabotaging, choose the other two crew; otherwise choose B and C.” Return to the actual arrangement where C is the traitor, B delivers, C sabotages, and the weather is Clear. The base version supplies no named record, so this policy chooses B and C. C sabotages again and wins. In the variant, C’s Sabotage is visible. Since loyal players cannot legally sabotage and there is exactly one traitor, A chooses B and D. Both deliver, so the loyal faction wins.

The inference depends jointly on explicit action permissions, the role count, and named evidence. Previous failure alone cannot support it. If both revealed actions are Deliver, even a failed trial establishes only that the weather was Storm. The traitor may have been absent or may have participated cooperatively. From A’s perspective, one cooperative action does not clear a role.

Nor does the variant guarantee that the traitor will repeat the same behavior. They can cooperate in the trial to conceal their identity. Even when C is exposed, the rules do not automatically exclude C. If A still selects B and C, C can sabotage and win. Identifying a role and satisfying a victory condition remain separate achievements.

## Uses and boundaries

This structure can make faction objectives affect promises of cooperation while giving consequences to observations, statements, and crew selection. Our design inference is to list the legal causes of each failure before deciding which evidence players can observe. Deduction needs information that can distinguish possibilities. If arbitrary hidden causes can explain every result, suspicion may be difficult to turn into a checkable judgment.

Other designs may allow loyal players to take actions that harm a task, or give traitors a separate positive objective. Either choice would change this example’s conditions for identifying a traitor from visible sabotage. A traitor is also different from a semi-cooperative player seeking individual recognition: the possibility of shared failure, individual rankings, and opposing factions need separate definitions. STR-07’s requirement for initially hidden identities does not cover every design in which betrayal develops later. Related entries on teams, hidden information, and deduction are available below.

## Self-checks and answers

- **Does a failed trial in the base version confirm C as the traitor?** No. B sabotaging, C sabotaging, or both delivering during Storm can all cause failure. The traitor may also be D, who did not take part.
- **What does a named record of B delivering and C sabotaging establish?** Assuming legal play and exactly one traitor, C is the traitor, while B and D are loyal. Selecting B and D for the final delivery succeeds. The disclosure itself has not yet awarded victory.
- **If both players visibly deliver and the trial succeeds, can B or C be ruled out?** No. The weather must be Clear, but a traitor among B and C could choose to cooperate. D could also be the traitor. From publicly loyal coordinator A’s perspective, all three identities remain possible; each crew member additionally knows their own role.
- **Are two named Sabotage cards another legal failure sequence?** No. Exactly one traitor and the restriction on loyal actions allow at most one Sabotage. Check rule execution first; an illegal state is not ordinary deduction evidence.

## Sources and further reading

The core source is Geoffrey Engelstein and Isaac Shalev’s [*Building Blocks of Tabletop Game Design*, second edition](https://doi.org/10.1201/9781003179184) (2022), STR-07, “Traitor Games,” printed pages 20–21, on initially hidden traitors, action clues, and play after identities are exposed. STR-02, “Cooperative Games,” printed pages 4–7, and STR-05, “Semi-Cooperative Games,” printed pages 15–17, support the distinctions between shared objectives, individual competition, and faction differences. The rules, possible sequences, and evidential judgments here are our original analysis.

[BGG 2814: Traitor Game](https://boardgamegeek.com/boardgamemechanic/2814/traitor-game) is a related classification entry. The specific role permissions, information, and victory scope are defined above.
