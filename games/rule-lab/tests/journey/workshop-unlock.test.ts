import { describe, expect, it } from 'vitest';
import { createDesign, installRule, removeRule } from '../../src/core';
import { canRollbackRules, createJourney, defaultExpression, getUnlockedUI, journeyAtOrigin, recordChoice, restoreVersion, snapshotVersion } from '../../src/journey';

const addRule = (journey: ReturnType<typeof createJourney>, id: string) => recordChoice(journey, id, 'rule');

describe('workshop unlocks after three distinct rule introductions', () => {
  it('unlocks immediately on the third successful rule, excluding abilities and expression', () => {
    let journey = createJourney();
    for (const id of ['U01', 'U02', 'U06']) journey = recordChoice(journey, id, 'expression');
    for (const id of ['ability.claim_draw', 'ability.insurance']) journey = recordChoice(journey, id, 'ability');
    expect(journey.introducedRuleIds).toEqual([]);
    expect(getUnlockedUI(journey).workshop).toBe(false);
    journey = addRule(journey, 'life.knockout');
    journey = addRule(journey, 'gesture.five');
    expect(getUnlockedUI(journey).workshop).toBe(false);
    journey = addRule(journey, 'energy.gesture_boost');
    expect(getUnlockedUI(journey).workshop).toBe(true);
    expect(journey.introducedRuleIds).toEqual(['life.knockout', 'gesture.five', 'energy.gesture_boost']);
    expect(journey.choices).not.toContain('U17');
  });

  it('does not count duplicate selection, a restored installation, or merely recording an unclassified choice', () => {
    let journey = addRule(createJourney(), 'life.knockout');
    expect(addRule(journey, 'life.knockout')).toBe(journey);
    journey = recordChoice(journey, 'gesture.five');
    expect(journey.introducedRuleIds).toEqual(['life.knockout']);
    // A later reclassification is not another successful choice.
    expect(addRule(journey, 'gesture.five')).toBe(journey);
    const design = installRule(createDesign(), 'life.knockout');
    journey = snapshotVersion(journey, design, defaultExpression, '原生命配置');
    const restored = restoreVersion(journey, journey.versions[0].id)!;
    expect(restored.design.rules).toEqual(['life.knockout']);
    expect(journey.introducedRuleIds).toEqual(['life.knockout']);
    expect(getUnlockedUI(journey).workshop).toBe(false);
  });

  it('retains earned access through rule removal and old-version restoration, resetting only for a new creation', () => {
    const design = installRule(installRule(installRule(createDesign(), 'life.knockout'), 'gesture.five'), 'energy.gesture_boost');
    let journey = ['life.knockout', 'gesture.five', 'energy.gesture_boost'].reduce(addRule, createJourney());
    journey = snapshotVersion(journey, design, defaultExpression, '第三条规则之后');
    const reduced = removeRule(design, 'life.knockout');
    expect(reduced.rules).toEqual(['gesture.five', 'energy.gesture_boost']);
    expect(getUnlockedUI(journey).workshop).toBe(true);
    const original = restoreVersion(journey, journey.versions[0].id)!;
    expect(original.design.rules).toHaveLength(3);
    expect(journey.introducedRuleIds).toHaveLength(3);
    expect(getUnlockedUI(journey).workshop).toBe(true);
    const blank = journeyAtOrigin(journey);
    expect(blank.introducedRuleIds).toEqual([]);
    expect(getUnlockedUI(blank).workshop).toBe(false);
  });

  it('does not reclassify historical introductions using a later catalogue', () => {
    // This rule existed when the player selected it. Removing its catalogue entry
    // later must not revoke an interface that was already earned.
    const journey = ['life.knockout', 'gesture.five', 'gesture.reverse'].reduce(addRule, createJourney());
    expect(getUnlockedUI(journey).workshop).toBe(true);
    expect(getUnlockedUI({ choices: journey.choices, introducedRuleIds: ['life.knockout', 'life.knockout', 'life.knockout'] }).workshop).toBe(false);
  });

  it('does not preserve retired U17/U05/U16 unlocks and stays independent of fifth-hand rollback', () => {
    const old = { choices: ['U17', 'U05', 'U16'] };
    expect(getUnlockedUI(old)).toMatchObject({ workshop: false, outcome: false, cover: false });
    const onlyExperience = { ...createJourney(), completedHands: 4 };
    expect(canRollbackRules(onlyExperience)).toBe(true);
    expect(getUnlockedUI(onlyExperience).workshop).toBe(false);
    const ruleBased = ['life.knockout', 'gesture.five', 'energy.gesture_boost'].reduce(addRule, createJourney());
    expect(canRollbackRules(ruleBased)).toBe(false);
    expect(getUnlockedUI(ruleBased).workshop).toBe(true);
  });
});
