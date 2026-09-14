import { describe, expect, it } from 'vitest';
import { advanceMatch, createDesign, createMatch, installRule, removeRule, resolveAttempt, setAbility } from '../../src/core';
import type { Action, ActionKind, MatchState, RuleId } from '../../src/core';
import { evaluateChoice, getChoice } from '../../src/content';
import { createJourney, defaultExpression, observeMatch } from '../../src/journey';
import type { JourneyState } from '../../src/journey';

const action = (kind: ActionKind, boost: 0 | 1 = 0, ability = false): Action => ({ kind, boost, ability });
const designWith = (...ids: RuleId[]) => ids.reduce(installRule, createDesign());
function pair(match: MatchState, player: Action, computer: Action): MatchState {
  const ready = advanceMatch(match);
  ready.phase = 'awaitingPlayer';
  ready.preparationComplete = true;
  ready.computerCommitment = computer;
  return resolveAttempt(ready, player, `new-experience-${ready.attempt}`);
}
const context = (match: MatchState, journey = createJourney()) => ({ design: match.design, match, journey, expression: { ...defaultExpression } });
const eligible = (id: string, match: MatchState, journey: JourneyState) => evaluateChoice(getChoice(id)!, context(match, journey));

/** Every fact is earned by effective engine resolution; no installed card is itself experience. */
function priorExperience() {
  let journey = createJourney();
  let match = createMatch(designWith('life.knockout'), 801);
  for (let i = 0; i < 3; i++) match = pair(match, action('rock'), action('scissors'));
  journey = observeMatch(journey, match);
  match = createMatch(designWith('life.knockout', 'cards.finite'), 802);
  for (let i = 0; i < 3; i++) match = pair(match, action('rock'), action('rock'));
  journey = observeMatch(journey, match);
  match = createMatch(designWith('life.knockout', 'energy.gesture_boost', 'energy.active_charge', 'energy.wave', 'energy.guard'), 803);
  for (const [player, computer] of [
    [action('charge'), action('charge')],
    [action('rock', 1), action('rock')],
    [action('rock', 1), action('paper')],
    [action('rock', 1), action('scissors')],
    [action('charge'), action('charge')],
    [action('charge'), action('charge')],
    [action('charge'), action('charge')],
    [action('wave'), action('guard')],
  ]) match = pair(match, player, computer);
  return observeMatch(journey, match);
}

describe('new mechanic and capability experience gates', () => {
  it('opens the three passive characters from a completed health experiment without needing declarations or resource systems', () => {
    const journey = priorExperience();
    const health = createMatch(designWith('life.knockout'), 8001);
    const single = createMatch(createDesign(), 8002);
    for (const id of ['ability.scissors_ninja', 'ability.rock_guardian', 'ability.paper_trickster']) {
      expect(eligible(id, health, createJourney()).checks.E).toBe(false);
      expect(eligible(id, health, journey).eligible).toBe(true);
      expect(eligible(id, single, journey).eligible).toBe(true);
    }
  });

  it('observes actual effects of all three passive characters without inventing a declaration', () => {
    const health = designWith('life.knockout');
    const examples = [
      ['ability.scissors_ninja', 'scissors', 'paper'],
      ['ability.rock_guardian', 'rock', 'scissors'],
      ['ability.paper_trickster', 'paper', 'paper'],
    ] as const;
    for (const [index, [ability, player, computer]] of examples.entries()) {
      const match = pair(createMatch(setAbility(health, 'player', ability), 8200 + index), action(player), action(computer));
      expect(match.history[0].events).toContainEqual(expect.objectContaining({ type: 'passive_triggered', side: 'player', ability, amount: 1 }));
      const observed = observeMatch(createJourney(), match);
      expect(observed.facts, ability).toContain('abilityTriggered');
      expect(observed.facts, ability).not.toContain('abilityDeclared');
      expect(observeMatch(observed, match)).toEqual(observed);
    }
  });

  it('does not award passive experience for unmet conditions or paper damage completely absorbed by a shield', () => {
    const health = designWith('life.knockout');
    const misses = [
      ['ability.scissors_ninja', 'rock', 'scissors'],
      ['ability.rock_guardian', 'paper', 'rock'],
      ['ability.paper_trickster', 'rock', 'rock'],
    ] as const;
    for (const [index, [ability, player, computer]] of misses.entries()) {
      const match = pair(createMatch(setAbility(health, 'player', ability), 8210 + index), action(player), action(computer));
      const observed = observeMatch(createJourney(), match);
      expect(observed.facts, ability).not.toContain('abilityTriggered');
      expect(observed.facts, ability).not.toContain('abilityDeclared');
    }
    const shieldDesign = setAbility(designWith('life.knockout', 'gesture.five', 'combo.three_styles'), 'player', 'ability.paper_trickster');
    let match = createMatch(shieldDesign, 8220);
    for (const kind of ['rock', 'scissors', 'lizard'] as const) match = pair(match, action(kind), action(kind));
    expect(match.fighters.computer.shield).toBe(1);
    match = pair(match, action('paper'), action('paper'));
    const last = match.history.at(-1)!;
    expect(last.events).toContainEqual(expect.objectContaining({ type: 'shield_absorbed', side: 'computer', amount: 1 }));
    expect(last.after.computer.life).toBe(last.before.computer.life);
    const observed = observeMatch(createJourney(), match);
    expect(observed.facts).toContain('shieldBlocked');
    expect(observed.facts).not.toContain('abilityTriggered');
    expect(observed.facts).not.toContain('abilityDeclared');
  });

  it('opens nine shared rules and five capabilities from prior real resource play without circular requirements', () => {
    const journey = priorExperience();
    const match = createMatch(designWith('life.knockout', 'cards.finite', 'energy.gesture_boost', 'energy.active_charge', 'energy.wave', 'energy.guard'), 804);
    const ids = ['cards.charge_trade', 'energy.wager', 'combo.three_styles', 'cards.capture', 'cards.combo_refund', 'shield.guard_store', 'energy.overflow_shield', 'energy.restraint', 'action.special_cooldown', 'ability.aegis', 'ability.foresight', 'ability.siphon', 'ability.reforge', 'ability.last_stand'];
    for (const id of ids) {
      expect(eligible(id, match, createJourney()).checks.E, id).toBe(false);
      expect(eligible(id, match, journey).eligible, id).toBe(true);
    }
    expect(eligible('shield.piercing_boost', match, journey).eligible).toBe(false);
    expect(journey.facts).not.toContain('shieldBlocked');
  });

  it('requires the current resource or action after experience has already been earned', () => {
    const journey = priorExperience();
    const plain = createMatch(designWith('life.knockout'), 805);
    for (const id of ['cards.charge_trade', 'cards.capture', 'cards.combo_refund', 'energy.wager', 'shield.guard_store', 'energy.overflow_shield', 'energy.restraint', 'action.special_cooldown', 'ability.siphon', 'ability.reforge']) {
      expect(eligible(id, plain, journey).checks.E, id).toBe(true);
      expect(eligible(id, plain, journey).eligible, id).toBe(false);
    }
    expect(eligible('combo.three_styles', plain, journey).eligible).toBe(true);
    expect(eligible('ability.aegis', plain, journey).eligible).toBe(true);
    const oneSpecial = createMatch(designWith('life.knockout', 'energy.gesture_boost', 'energy.active_charge'), 806);
    expect(eligible('action.special_cooldown', oneSpecial, journey).checks.O).toBe(false);
  });

  it('earns shield experience only when a shield actually absorbs damage, then requires a live shield source', () => {
    const design = designWith('life.knockout', 'energy.gesture_boost', 'combo.three_styles');
    let match = createMatch(design, 807);
    let journey = priorExperience();
    for (const kind of ['rock', 'paper', 'scissors'] as const) match = pair(match, action(kind), action(kind));
    journey = observeMatch(journey, match);
    expect(match.fighters.computer.shield).toBe(1);
    expect(journey.facts).not.toContain('shieldBlocked');
    expect(eligible('shield.piercing_boost', match, journey).checks.E).toBe(false);
    match = pair(match, action('rock'), action('scissors'));
    journey = observeMatch(journey, match);
    expect(match.history.at(-1)?.events).toContainEqual(expect.objectContaining({ type: 'shield_absorbed', amount: 1 }));
    expect(journey.facts).toContain('shieldBlocked');
    expect(eligible('shield.piercing_boost', match, journey).eligible).toBe(true);
    expect(observeMatch(journey, match)).toEqual(journey);
    const noSource = createMatch(removeRule(design, 'combo.three_styles'), 808);
    expect(eligible('shield.piercing_boost', noSource, journey).eligible).toBe(false);
    const aegisSource = createMatch(setAbility(noSource.design, 'player', 'ability.aegis'), 809);
    expect(eligible('shield.piercing_boost', aegisSource, journey).eligible).toBe(true);
    const guardianSource = createMatch(setAbility(noSource.design, 'player', 'ability.rock_guardian'), 8091);
    expect(eligible('shield.piercing_boost', guardianSource, journey).eligible).toBe(true);
  });

  it('observes effects of new capabilities that do not change the outcome label', () => {
    const health = designWith('life.knockout');
    const aegis = pair(createMatch(setAbility(health, 'player', 'ability.aegis'), 810), action('rock', 0, true), action('paper'));
    expect(aegis.history[0].outcome).toBe('computer');
    expect(observeMatch(createJourney(), aegis).facts).toEqual(expect.arrayContaining(['abilityDeclared', 'abilityTriggered', 'shieldBlocked']));
    expect(observeMatch(createJourney(), aegis).facts).not.toContain('damageObserved');
    const foresight = pair(createMatch(setAbility(health, 'player', 'ability.foresight'), 811), action('rock', 0, true), action('rock'));
    expect(observeMatch(createJourney(), foresight).facts).toContain('abilityTriggered');
    const gas = installRule(health, 'energy.gesture_boost');
    const siphon = pair(createMatch(setAbility(gas, 'player', 'ability.siphon'), 812), action('rock', 0, true), action('rock'));
    expect(observeMatch(createJourney(), siphon).facts).toContain('abilityTriggered');
    let reforge = createMatch(setAbility(installRule(health, 'cards.finite'), 'player', 'ability.reforge'), 813);
    reforge = pair(reforge, action('rock'), action('rock'));
    reforge = pair(reforge, action('rock'), action('rock'));
    reforge = pair(reforge, action('rock', 0, true), action('rock'));
    expect(observeMatch(createJourney(), reforge).facts).toContain('abilityTriggered');
    let lastStand = createMatch(setAbility(health, 'player', 'ability.last_stand'), 814);
    lastStand = pair(lastStand, action('rock'), action('paper'));
    lastStand = pair(lastStand, action('rock'), action('paper'));
    lastStand = pair(lastStand, action('rock', 0, true), action('paper'));
    expect(lastStand.fighters.player.life).toBe(1);
    expect(observeMatch(createJourney(), lastStand).facts).toContain('abilityTriggered');
  });
});
