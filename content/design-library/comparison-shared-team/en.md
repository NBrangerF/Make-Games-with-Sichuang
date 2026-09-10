# One signal station: what changes between cooperation, teams, and a traitor?

Four people sitting together and using the same actions do not necessarily win together. This page makes two separate changes: first to one player's victory condition, then to when team identities are public. That lets us distinguish how the signal changes, who wants it to change, and who knows the others' goals.

## Fix eight actions

This is an original four-player teaching situation. A, B, C, and D each have 2 batteries. The signal starts at 0. Batteries and the signal are public; batteries cannot be transferred or used for joint payment. Play two rounds, each in A–B–C–D order, with one action per player per round. On a turn, choose exactly one:

- **Tune:** pay 1 of your own batteries and increase the signal by 2.
- **Interfere:** available only when the current signal is at least 1; pay 1 of your own batteries and reduce the signal by 1.
- **Wait:** pay nothing and leave the signal unchanged.

Pay the full cost first. Paid batteries leave the game and are not replenished. A player without a battery cannot tune or interfere; nobody can interfere at signal 0. The signal has no upper limit and changes only through these actions. All actions are public, and the active player has the final decision. Public discussion is allowed, but advice cannot force another player's action.

End immediately after D's second-round action. Check **only then** whether the signal is at least 6; reaching 6 earlier does not end play. In the cooperative baseline, all four win if the target is met and all four lose otherwise. There are no individual points or additional tie rules.

## First sequence: reach the target, then fall below it

Whenever we compare versions, restore the same starting position and repeat these choices.

| Turn | Action | Signal afterward |
|---|---|---:|
| Round 1, A | Tune | 2 |
| Round 1, B | Tune | 4 |
| Round 1, C | Wait | 4 |
| Round 1, D | Tune | 6 |
| Round 2, A | Wait | 6 |
| Round 2, B | Wait | 6 |
| Round 2, C | Wait | 6 |
| Round 2, D | Interfere | 5 |

A, B, C, and D finish with 1, 1, 2, and 0 batteries: 4 remain and 4 were spent. The final signal is 5, so everyone loses in the cooperative version. D genuinely helped increase the signal in round 1, and D's final action genuinely brought it below the target. Both statements can be true.

An action can be legal without serving the cooperative goal. We deliberately retain the same action menu in every version to separate permission from desired outcomes. These local rules let us analyze permissions and incentives; they are not a balanced cooperative challenge.

## Change only D's victory condition: public team opposition

Restore the starting position and change only who wins at the end. A, B, and C still win together when the signal is at least 6. D now wins alone when it is below 6. The conditions are opposed: one side wins and the other loses; exactly 6 is a win for A, B, and C. Announce this three-against-one arrangement at the start. Keep permissions, supplies, actions, timing, and the end of play unchanged.

Repeat the table. The signal is still 5 and the batteries are still 1/1/2/0. Now A, B, and C lose while D wins. The number has not changed; D's interest in that number has.

For a second sequence, follow the table but replace D's final interference with tuning. Both actions cost 1 battery, so the remaining batteries are unchanged. The signal rises from 6 to 8 instead.

| Fixed sequence | Final signal | Cooperative result | Public-team result |
|---|---:|---|---|
| D tunes first, then interferes | 5 | All four lose | D wins; A, B, C lose |
| D tunes twice | 8 | All four win | A, B, C win; D loses |

Across a row, change only the victory condition. Between rows, change only D's last action. Mixing those comparisons would not justify saying that a team structure automatically raises the signal from 5 to 8. Players might choose differently when their goals change, but that is behavior to investigate next; it has not been simulated in this table.

## Change only visibility next: conceal the same teams

Keep every rule and victory condition from the three-against-one version. Make three Maintainer identity cards and one Interferer card. In the public version, cards are face up. In the hidden version, each player sees only their own card; reveal all cards at the end. Everyone knows the card composition, both sides' victory conditions, and the identical action menu. Players may discuss or claim identities, but cannot show their card or inspect anyone else's before the end. A claim is not proof. Identities never change; there is no inspection action, vote, expulsion, or extra identity power.

To isolate visibility, use the **same actual assignment in both versions: A, B, and C are Maintainers; D is the Interferer**. This is a fixed-assignment comparison, not a claim about win rates under random dealing. Players in the hidden version receive only the information allowed by its rules; they cannot use the complete assignment known to the reader.

Repeat the first sequence: both versions end at 5 and D wins when identities are revealed. Repeat the second: both end at 8 and D loses. Hidden identities change what players know beforehand, not the resolution of these fixed actions.

A knows they are a Maintainer and initially cannot rule out B, C, or D as the Interferer. Looking only at the action record, and excluding the identity cards revealed at the end, D's final interference may look suspicious, but **the rules do not make that action an identity inspection**. A Maintainer may legally interfere, and the Interferer may legally tune. Without an extra assumption that players always act correctly and pursue victory, the same public sequence remains compatible with all three assignments. That does not mean the three players are equally suspicious, nor does it assign probabilities to their identities. After the actual end-of-game reveal, A knows the true teams; this analysis asks what the action record alone establishes.

## Why discuss a traitor without claiming a finished traitor game?

In the hidden version, one person works within the shared operation of the station while secretly wanting the others to fail. That demonstrates a basic conflict in a traitor structure. The hidden version is still team opposition, with team information concealed. These labels therefore need not be mutually exclusive.

This miniature does not provide anonymous contributions, costly inspections, or new actions after exposure. Nor does it demonstrate that hidden identities alone create enough suspense. If players correctly suspect D, play still continues through the eight actions, and D retains the same legal choices. Correct suspicion is not a victory condition here. Developing a full game requires examining evidence before exposure, choices after exposure, and whether learning the rules forces players to reveal their identities.

Competition within a shared task does not necessarily imply a traitor. If everyone faces a common loss but also competes for individual recognition after success, the rules must separately explain the relationship between collective success and individual victory. Selfish behavior alone does not establish the secret opposing faction used here.

## Check yourself: resources, signal, and identity

1. Can the Maintainers declare victory as soon as the signal reaches 6 in round 1?
2. Does D become a Maintainer by tuning twice in the hidden version?
3. If everyone tunes in both rounds, what are the final signal and the results under the two victory rules?
4. If the active player has no batteries, does being the Interferer allow them to reduce the signal for free?

**Answers:** First, no: check only after D's second-round action. Second, no: actions do not change identity. Third, eight tunes produce 16 and everyone spends both batteries. All four win cooperatively; A, B, and C win and D loses under team rules. Public or hidden identities do not alter that result. Fourth, no: every identity uses the same payment rule, so that player can only wait.

## Sources and further reading

Geoffrey Engelstein and Isaac Shalev, *Building Blocks of Tabletop Game Design*, second edition: STR-02, “Cooperative Games” (printed pp. 4–7), discusses collective victory separately from individual authority over actions; STR-03, “Team-Based Games” (pp. 8–11), includes teams, one-against-many, and secret assignments. STR-07, “Traitor Games” (pp. 20–21), uses initially hidden traitor identities as its working definition and discusses choices before and after exposure and learning difficulties. STR-05, “Semi-Cooperative Games” (pp. 15–17), considers tension between a shared loss condition and an individual victor. That is the book's classification scope, not a label for every instance of temporary cooperation.

The station, supplies, actions, paired comparisons, and identity-compatibility analysis are original to this site. Open the related cooperation, team, and traitor entries below for more specific treatment of resource permissions, team decisions, and identity evidence.
