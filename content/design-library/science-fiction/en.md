# Science fiction: will the target still be there when the command executes?

An imagined technology can change a player's relationship with the world. A remote probe need not merely rename a worker as a robot: command delay can make today's commitment act on a later state. This original test apparatus represents delay in rounds, without real communication distances or physical parameters.

## Complete rules for four telemetry rounds

One operator controls a remote scanner with 2 energy. There are two scan regions, A and B. A target follows a public program: A in rounds one and two, B in rounds three and four. The schedule is fixed, without randomness or hidden events.

Each round first places the target at its scheduled location, then executes old commands due this round, then allows one new command or a wait. A command is “scan A” or “scan B.” Pay 1 energy when issuing it and mark execution **two rounds later**: issued in round t, executed in round t + 2. Energy never replenishes; without enough, wait.

A due scan scores 1 if its region matches the target that round, otherwise 0. Execution costs no further energy. Successful scans of the same region in different rounds can each score. Commands cannot be canceled, retargeted, or accelerated. Start with an empty queue. At most one command is issued per round, so due commands never conflict.

End after completing the round-four sequence. Later commands never execute and energy is not refunded. Compare recorded points only: more is better, equal totals have equal value. There are no competing players or additional actions.

## Issue commands for the current picture

In round one, see the target in A and issue scan A, leaving 1 energy. In round two it is still in A, so issue scan A again, leaving 0.

The first scan executes in round three, when the target is in B: 0 points. The second also misses in round four. Both commands were legal and executed, yet the total is **0**. They targeted the wrong moment, not a failure to issue instructions.

## Issue commands for their execution times

Reset. Issue scan B in round one and scan B in round two. The target is in A when both are issued, but in B for both executions. Each scores 1, giving **2 points**.

| Issued | Executed | Target when issued | Target when executed | Scan A / scan B result |
|---|---|---|---|---|
| Round 1 | Round 3 | A | B | 0 / 1 |
| Round 2 | Round 4 | A | B | 0 / 1 |

This does not require predicting unknown motion: future positions are public. It checks alignment between information and resolution time. Hidden movement would add a different information problem, invalidating the same guaranteed outcomes.

## Which relationship does the technology change?

The remote operator commits to a future scan region. Limited energy, delay, and the four-round ending create pressure. The key rule separates ordering from effect: payment and commitment occur before the result.

Other themes could use this relationship. Science fiction provides the remote-operation setting here; it neither represents all science nor means only space exploration. Planet artwork with instant commands would not preserve this example's selected delay problem.

## Simplifications and the next observation

The target follows a programmed two-region schedule, not celestial mechanics. Two rounds are not a light-speed calculation, and energy tokens have no real units. Noise, faults, and control permissions are absent. Technological vocabulary does not replace rule definitions.

Observe whether readers score a command as soon as it is issued and whether they can identify every queued command's execution round. If the queue is hard to read, improve state presentation before adding more probes.

## Check: issue scan B in round three

Wait in rounds one and two, then pay 1 energy to issue scan B in round three. Can it score in this game?

**No.** It executes in round five, but the game ends after round four. Spending energy is not a completed scan; pending commands and leftover energy score nothing.

## Reference doorway

[BGG: Science Fiction (1016)](https://boardgamegeek.com/boardgamecategory/1016/science-fiction) identifies the category. The apparatus, timing, and programs are this site's original fictional rules, not a scientific simulation.
