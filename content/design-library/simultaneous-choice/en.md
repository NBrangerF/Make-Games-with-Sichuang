# Simultaneous Choice: Why Can an Opportunity Change After You Commit?

Three players can all see packages at the north counter, yet the last player receives nothing. Did that player fail to read the table? The following original miniature game shows the gap between making a decision and carrying it out.

## Three decisions, resolved in order

Lin, Yu, and Qiao each send one courier to collect a package. The north counter holds two packages, each worth 2 points. The south counter holds one package worth 1 point. Everyone starts with 0 points and has two choice cards, North and South. There are no other resources or costs.

The supplies, values, and collection order are public. Players hold their cards with the faces hidden from others and do not discuss destinations. Each selects a card and places it face down; that card can no longer be changed. There is no timer. Once all three cards are down, everyone reveals together.

The couriers collect in the fixed order Lin, Yu, Qiao. If a package remains at the chosen counter, the player takes one and scores its value. If that counter is empty, the player scores 0 and cannot switch counters. Several players may legally choose the same counter.

After all three couriers have been processed, this single-round model ends immediately. Supplies are not replenished. The highest score wins; players tied for the highest score share the win.

This time, all three choose North. Lin takes one package for 2 points, leaving one. Yu takes the last package for 2 points. Qiao's choice is still North, but nothing remains there: 0 points. The south package is untouched. Lin and Yu share the win.

There really were packages at North when Qiao chose. The other choices and the collection order changed the result. Qiao cannot wait until the packages disappear and then exchange the chosen card for South.

## Naming the relationship

This is a form of **simultaneous action selection**. Players commit without knowing the others' choices for this decision, then reveal together. Their decision phases overlap. They need not put down their cards at precisely the same second, and their actions need not resolve simultaneously.

Here, everyone sees the same public position but must consider where the others might go. No dice are rolled, and no cards are randomly drawn. The uncertainty comes from decisions that have not yet been revealed. Cards simply provide a way to preserve those decisions.

Choosing, revealing, and resolving are therefore three moments that rules must distinguish. “Everyone plays a card at once” does not explain what happens when several players want the same opportunity.

## Change one rule: decide just before collecting

Change only when each player chooses. Instead of everyone committing in advance, a player publicly chooses North or South when their collection turn arrives, then immediately collects. Keep the packages, values, collection order, ending, and victory rules unchanged.

Suppose Lin still chooses North and Yu still chooses North. When Qiao's turn arrives, North is empty and South still has one package. Qiao can choose South based on that current position and score 1 point. The result becomes 2, 2, 1. Lin and Yu still share the highest score.

| Version | What Qiao sees when required to decide | Qiao's score in this sequence |
|---|---|---|
| Everyone commits secretly in advance | Two packages at North, one at South; others' choices unknown | Choosing North yields 0 |
| Choose publicly just before collecting | North is empty; one package remains at South | Choosing South yields 1 |

Qiao received no extra package or action. The difference is permission to decide after other players have acted. This comparison shows how information and the moment of commitment affect a choice. It does not establish that the second version is generally fairer or more enjoyable.

## Opportunities and costs

In the first version, players can think about their own choices at the same time. Waiting does not automatically disappear: everyone must still wait for the last commitment, then resolve collection. Lengthy plans can also make the decision phase slow.

The fixed collection order gives Lin priority. Secret choices do not remove that advantage. They make later players anticipate what earlier players might do. In a longer game, a designer would also need to decide whether priority changes. That would be another rule to investigate.

If a cooperative game allows free discussion, players may coordinate their destinations. Simultaneous selection alone does not guarantee uncertainty about others or a feeling of tension. Conversely, when one mistaken prediction causes a large loss and players have few useful clues, the outcome may feel difficult to influence.

This mechanism is also different from real-time action. Our model has no race to act: placing a card first does not let you collect first. Nor does it require programming a long sequence. Here, each player commits to just one destination. Adding more planned actions would change the memory and reasoning demands.

## Check your understanding

Return to the first version. Lin chooses North, Yu chooses South, and Qiao chooses North. What does each score? Can Qiao switch to South after the reveal?

The scores are **2, 1, 2**, so Lin and Qiao share the win. Yu collects from South and does not consume North's second package. That package remains for Qiao. Qiao cannot switch: receiving new information does not mean the rules permit a new decision.

## Bring it back to your design

When trying this mechanism, observe one thing first: can players identify when their decision becomes fixed and explain why the action might still fail afterward? Record where they actually try to change a choice. Then investigate whether the explanation is unclear, resolution is hard to follow, or advance commitment does not suit your intended experience. Make one sequence understandable before adding more hidden decisions.

## Entry reference

Geoffrey Engelstein and Isaac Shalev. *Building Blocks of Tabletop Game Design: An Encyclopedia of Mechanisms*. 2nd ed., CRC Press, 2022. TRN-09, “Simultaneous Action Selection.” [Book DOI](https://doi.org/10.1201/9781003179184).

[BGG category lookup: Simultaneous Action Selection (2020)](https://boardgamegeek.com/boardgamemechanic/2020/simultaneous-action-selection). This link identifies the category. The package model and comparison above are original examples.
