import { describe, expect, it } from 'vitest';
import { advanceMatch, compileDesign, createDesign, createMatch, installRule, previewRuleChange, removeRule, resolveAttempt, setAbility } from '../../src/core';
import type { Action, ActionKind, MatchState } from '../../src/core';
import { evaluateChoice, getChoice } from '../../src/content';
import { canRollbackRules, createJourney, defaultExpression, journeyAtOrigin, observeMatch, recordChoice, restoreVersion, snapshotVersion } from '../../src/journey';

const action = (kind: ActionKind, ability = false): Action => ({ kind, boost: 0, ability });
function pair(match: MatchState, player = action('rock'), computer = action('rock')): MatchState {
  const ready = advanceMatch(structuredClone(match));
  ready.phase = 'awaitingPlayer';ready.preparationComplete = true;ready.computerCommitment = computer;
  return resolveAttempt(ready, player, `rollback-${ready.attempt}`);
}
const health = () => installRule(createDesign(), 'life.knockout');

describe('fifth-hand rule rollback unlock', () => {
  it('counts effective hands across separate single-hand matches, unlocking after exactly four', () => {
    let journey = createJourney();
    expect(journey.completedHands).toBe(0);expect(canRollbackRules(journey)).toBe(false);
    for (let count = 1; count <= 4; count++) {
      journey = observeMatch(journey, pair(createMatch(createDesign(), 100 + count)));
      expect(journey.completedHands).toBe(count);
      expect(canRollbackRules(journey)).toBe(count === 4);
    }
    expect(journey.choices).not.toContain('U17');
  });

  it('counts ongoing health hands without waiting for a match result and never double-counts observation', () => {
    let journey = createJourney();
    let match = createMatch(health(), 200);
    journey = observeMatch(journey, match);expect(journey.completedHands).toBe(0);
    for (let count = 1; count <= 4; count++) {
      match = pair(match);
      journey = observeMatch(journey, match);
      expect(match.result).toBeNull();expect(journey.completedHands).toBe(count);
      journey = observeMatch(journey, advanceMatch(match));
      expect(journey.completedHands).toBe(count);
    }
    expect(canRollbackRules(journey)).toBe(true);
  });

  it('does not count a void retry, then counts its effective replacement exactly once', () => {
    const design = setAbility(health(), 'player', 'ability.retry');
    let match = createMatch(design, 300);
    let journey = createJourney();
    for (let i = 0; i < 3; i++) { match = pair(match);journey = observeMatch(journey, match); }
    match = pair(match, action('rock', true), action('paper'));
    journey = observeMatch(journey, match);
    expect(match.history.at(-1)?.voided).toBe(true);
    expect(journey.completedHands).toBe(3);expect(canRollbackRules(journey)).toBe(false);
    match = pair(match);journey = observeMatch(journey, match);
    expect(journey.completedHands).toBe(4);expect(canRollbackRules(journey)).toBe(true);
    expect(observeMatch(journey, match).completedHands).toBe(4);
  });

  it('keeps count and permanently selected cards through cancellation, new matches and version restoration', () => {
    const design = setAbility(installRule(health(), 'energy.gesture_boost'), 'player', 'ability.insurance');
    let match = createMatch(design, 400);
    let journey = createJourney();
    for (let i = 0; i < 4; i++) { match = pair(match);journey = observeMatch(journey, match); }
    for (const id of ['life.knockout', 'energy.gesture_boost', 'ability.insurance']) journey = recordChoice(journey, id);
    const before = structuredClone(journey);
    journey = snapshotVersion(journey, design, defaultExpression, '取消生命之前', '2026-09-10T10:00:00Z');
    const removed = removeRule(design, 'life.knockout');
    const newMatch = createMatch(removed, 401);
    journey = observeMatch(journey, newMatch);
    expect(journey.completedHands).toBe(4);expect(canRollbackRules(journey)).toBe(true);
    expect(journey.choices).toEqual(before.choices);
    expect(journey.seenAttemptIds).toEqual(before.seenAttemptIds);
    expect(compileDesign(removed)).toMatchObject({ life: false, energy: true, abilities: { player: 'ability.insurance', computer: null } });
    const eligibility = evaluateChoice(getChoice('life.knockout')!, { design: removed, match: newMatch, journey, expression: defaultExpression });
    expect(eligibility.eligible).toBe(false);expect(eligibility.reasons).toContain('这一轮已经留下过这个选择，不会再次进入卡池。');
    const version = restoreVersion(journey, journey.versions[0].id)!;
    journey = observeMatch(journey, createMatch(version.design, 402));
    expect(journey.completedHands).toBe(4);expect(canRollbackRules(journey)).toBe(true);
    expect(journey.choices).toEqual(before.choices);
    expect(match.history).toHaveLength(4);
    expect(match.history.every(record => record.outcome === 'draw' && !record.voided)).toBe(true);
  });

  it('previewing or abandoning cancellation has no progress or mechanical side effects', () => {
    const design = installRule(health(), 'cards.finite');
    const journey = { ...createJourney(), completedHands: 4, choices: ['life.knockout', 'cards.finite'] };
    const before = structuredClone({ design, journey });
    const preview = previewRuleChange(design, { type: 'remove', rule: 'life.knockout' });
    expect(preview.removed).toEqual(['life.knockout']);
    expect({ design, journey }).toEqual(before);
    expect(canRollbackRules(journey)).toBe(true);
  });

  it('stays unlocked across later rules and resets only when starting a new creation', () => {
    let journey = { ...createJourney(), completedHands: 12 };
    journey = recordChoice(journey, 'gesture.five');
    journey = snapshotVersion(journey, createDesign(), defaultExpression, '五手势之前');
    expect(canRollbackRules(journey)).toBe(true);
    expect(createJourney().completedHands).toBe(0);
    const origin = journeyAtOrigin(journey);
    expect(origin.completedHands).toBe(0);expect(canRollbackRules(origin)).toBe(false);
    expect(origin.choices).toEqual([]);
  });
});
