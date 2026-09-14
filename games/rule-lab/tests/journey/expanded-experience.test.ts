import { describe, expect, it } from 'vitest';
import { advanceMatch, createDesign, createMatch, installRule, removeRule, resolveAttempt } from '../../src/core';
import type { Action, ActionKind, Design, MatchState, RuleId } from '../../src/core';
import { describePreview, evaluateChoice, getChoice } from '../../src/content';
import { createJourney, defaultExpression, observeMatch } from '../../src/journey';
import type { JourneyState } from '../../src/journey';

const action = (kind: ActionKind, boost: 0 | 1 | 2 = 0): Action => ({ kind, boost, ability: false });
const designWith = (...rules: RuleId[]): Design => rules.reduce(installRule, createDesign());
function pair(match: MatchState, player: Action, computer: Action): MatchState {
  const ready = advanceMatch(match);
  ready.phase = 'awaitingPlayer';
  ready.preparationComplete = true;
  ready.computerCommitment = computer;
  return resolveAttempt(ready, player, `experience-${ready.attempt}`);
}
const context = (design: Design, match: MatchState, journey: JourneyState) => ({ design, match, journey, expression: { ...defaultExpression } });
const eligible = (id: string, input: ReturnType<typeof context>) => evaluateChoice(getChoice(id)!, input);

describe('expanded cards use real experience and actual opportunities', () => {
  it('unlocks paid defense, piercing and cheaper waves after their actual interactions', () => {
    let design = designWith('life.knockout', 'energy.gesture_boost', 'energy.active_charge', 'energy.wave', 'energy.guard');
    let match = createMatch(design, 6101);
    let journey = createJourney();
    for (const id of ['energy.guard_paid', 'energy.piercing_wave', 'energy.cheap_wave']) expect(eligible(id, context(design, match, journey)).checks.E).toBe(false);
    match = pair(match, action('charge'), action('charge'));
    match = pair(match, action('wave'), action('guard'));
    journey = observeMatch(journey, match);
    expect(journey.facts).toEqual(expect.arrayContaining(['paidAttackObserved', 'paidWaveObserved', 'guardObserved']));
    expect(journey.facts).not.toContain('paidGuardObserved');
    for (const id of ['energy.guard_paid', 'energy.piercing_wave', 'energy.cheap_wave']) expect(eligible(id, context(design, match, journey)).eligible).toBe(true);
    design = installRule(design, 'energy.guard_paid');
    match = pair(createMatch(design, 6102), action('guard'), action('rock'));
    expect(match.history[0].after.player.energySpent - match.history[0].before.player.energySpent).toBe(1);
    journey = observeMatch(journey, match);
    expect(journey.facts).toContain('paidGuardObserved');
    expect(getChoice('goal.efficient_wins')).toBeUndefined();
  });

  it('opens health directly after the first hand with no fixed-duration prerequisite', () => {
    const design = createDesign();
    const match = pair(createMatch(design, 6201), action('rock'), action('scissors'));
    const journey = observeMatch(createJourney(), match);
    const choice = eligible('life.knockout', context(design, match, journey));
    expect(choice.eligible).toBe(true);
    expect(choice.preview?.nextDesign).toMatchObject({ healthOnly: true, goal: 'knockout' });
    expect(choice.preview?.nextDesign.rules).toEqual(['life.knockout']);
    expect(describePreview(choice.preview!).join(' ')).toContain('生命归零结束，不设固定手数');
    expect(describePreview(choice.preview!).join(' ')).not.toMatch(/最多|五手|5 手/);
    expect(journey.facts).not.toContain('seriesCompleted');
  });

  it('unlocks finite cards after real repetition and four health hands, without any cap fact', () => {
    const design = designWith('life.knockout');
    let match = createMatch(design, 6501);
    let journey = createJourney();
    for (let hand = 0; hand < 3; hand++) match = pair(match, action('rock'), action('rock'));
    journey = observeMatch(journey, match);
    expect(eligible('cards.finite', context(design, match, journey))).toMatchObject({ eligible: false, checks: { E: false, O: true } });
    match = pair(match, action('rock'), action('rock'));
    journey = observeMatch(journey, match);
    expect(eligible('cards.finite', context(design, match, journey)).eligible).toBe(true);
    expect(journey.facts).not.toContain('reachedCap');
    expect(match.result).toBeNull();
    const withoutHealth = removeRule(design, 'life.knockout');
    expect(eligible('cards.finite', context(withoutHealth, match, journey)).eligible).toBe(false);
  });

  it('requires health for cooldown and removes public trump from the catalogue', () => {
    const design = designWith('life.knockout');
    let match = createMatch(design, 6601);
    for (let hand = 0; hand < 3; hand++) match = pair(match, action('rock'), action('scissors'));
    const journey = observeMatch(createJourney(), match);
    expect(journey.facts).toEqual(expect.arrayContaining(['seriesCompleted', 'repeatedGesture']));
    for (const id of ['action.cooldown']) {
      expect(eligible(id, context(design, match, journey)).eligible).toBe(true);
      expect(eligible(id, context(createDesign(), match, journey)).eligible).toBe(false);
    }
  });

  it('earns health modifications from harmless draws, wounds and wounded victories without a fifth-hand ending', () => {
    const design = designWith('life.knockout');
    let match = createMatch(design, 6801);
    let journey = createJourney();
    for (const id of ['life.draw_damage', 'life.win_heal', 'life.desperation']) expect(eligible(id, context(design, match, journey)).checks.E).toBe(false);
    match = pair(match, action('rock'), action('rock'));
    journey = observeMatch(journey, match);
    expect(eligible('life.draw_damage', context(design, match, journey)).eligible).toBe(true);
    match = pair(match, action('rock'), action('paper'));
    match = pair(match, action('rock'), action('paper'));
    journey = observeMatch(journey, match);
    expect(match.fighters.player.life).toBe(1);
    expect(eligible('life.desperation', context(design, match, journey)).eligible).toBe(true);
    expect(eligible('life.win_heal', context(design, match, journey)).checks.E).toBe(false);
    match = pair(match, action('rock'), action('scissors'));
    journey = observeMatch(journey, match);
    expect(eligible('life.win_heal', context(design, match, journey)).eligible).toBe(true);
    match = pair(match, action('rock'), action('rock'));
    journey = observeMatch(journey, match);
    expect(match.hand).toBe(5);
    expect(match.result).toBeNull();
    expect(journey.facts).not.toContain('reachedCap');
    expect(getChoice('life.survive')).toBeUndefined();
    expect(getChoice('life.last_hit_double')).toBeUndefined();
  });

  it('requires actual spent inventory for refund, with dealer removed', () => {
    const design = designWith('life.knockout', 'cards.finite');
    let match = createMatch(design, 6901);
    const empty = createJourney();
    expect(eligible('cards.draw_refund', context(design, match, empty)).checks.E).toBe(false);
    expect(getChoice('cards.dealer_refill')).toBeUndefined();
    match = pair(match, action('rock'), action('rock'));
    expect(match.history[0].after.player.cards.rock).toBe(match.history[0].before.player.cards.rock - 1);
    const observed = observeMatch(empty, match);
    expect(eligible('cards.draw_refund', context(design, match, observed)).eligible).toBe(true);
    expect(observed.facts).toContain('cpuInventorySpent');
  });

  it('does not count temporary depletion when a draw refunds the last card', () => {
    const design = designWith('life.knockout', 'cards.finite', 'cards.draw_refund');
    let match = createMatch(design, 6902);
    let journey = createJourney();
    for (const computer of ['scissors', 'paper', 'rock'] as const) {
      match = pair(match, action('rock'), action(computer));
      journey = observeMatch(journey, match);
    }
    const refunded = match.history.at(-1)!;
    expect(refunded.events).toEqual(expect.arrayContaining([
      expect.objectContaining({ type: 'cards_spent', side: 'player', action: 'rock', amount: 1 }),
      expect.objectContaining({ type: 'cards_refunded', side: 'player', action: 'rock', amount: 1 }),
    ]));
    expect(refunded.events.some(event => event.type === 'inventory_depleted')).toBe(false);
    expect(refunded.before.player.cards.rock).toBe(1);
    expect(refunded.after.player.cards.rock).toBe(1);
    expect(journey.facts).not.toContain('inventoryDepleted');
    for (const id of ['cards.two_each', 'cards.exchange_once']) {
      expect(eligible(id, context(design, match, journey))).toMatchObject({ eligible: false, checks: { E: false } });
    }

    match = pair(match, action('rock'), action('scissors'));
    journey = observeMatch(journey, match);
    expect(match.history.at(-1)?.before.player.cards.rock).toBe(1);
    expect(match.history.at(-1)?.after.player.cards.rock).toBe(0);
    expect(journey.facts).toContain('inventoryDepleted');
    for (const id of ['cards.two_each', 'cards.exchange_once']) expect(eligible(id, context(design, match, journey)).eligible).toBe(true);
  });

  it('also counts actual computer inventory depletion without requiring player depletion', () => {
    const design = designWith('life.knockout', 'cards.finite', 'cards.draw_refund');
    let match = createMatch(design, 6903);
    let journey = createJourney();
    for (const player of ['scissors', 'paper'] as const) {
      match = pair(match, action(player), action('rock'));
      journey = observeMatch(journey, match);
    }
    expect(journey.facts).not.toContain('inventoryDepleted');
    match = pair(match, action('scissors'), action('rock'));
    journey = observeMatch(journey, match);
    expect(match.history.at(-1)?.before.computer.cards.rock).toBe(1);
    expect(match.history.at(-1)?.after.computer.cards.rock).toBe(0);
    expect((['rock', 'scissors', 'paper'] as const).every(gesture => match.fighters.player.cards[gesture] > 0)).toBe(true);
    expect(journey.facts).toContain('inventoryDepleted');
    for (const id of ['cards.two_each', 'cards.exchange_once']) expect(eligible(id, context(design, match, journey)).eligible).toBe(true);
  });

  it('earns capacity and reinforcement cards through carrying real gas, low-gas loss and both boost outcomes', () => {
    const design = designWith('life.knockout', 'energy.gesture_boost', 'energy.active_charge');
    let match = createMatch(design, 7001);
    let journey = createJourney();
    for (const id of ['energy.opening_two', 'energy.cap_five', 'energy.leak_thirds', 'energy.loss_charge', 'energy.double_boost']) expect(eligible(id, context(design, match, journey)).checks.E).toBe(false);
    match = pair(match, action('charge'), action('charge'));
    journey = observeMatch(journey, match);
    expect(eligible('energy.opening_two', context(design, match, journey)).eligible).toBe(true);
    expect(eligible('energy.cap_five', context(design, match, journey)).checks.E).toBe(false);
    match = pair(match, action('charge'), action('charge'));
    journey = observeMatch(journey, match);
    expect(match.fighters.player.energy).toBe(3);
    expect(eligible('energy.cap_five', context(design, match, journey)).eligible).toBe(true);
    expect(eligible('energy.leak_thirds', context(design, match, journey)).eligible).toBe(true);

    match = pair(createMatch(design, 7002), action('rock'), action('paper'));
    journey = observeMatch(journey, match);
    expect(eligible('energy.loss_charge', context(design, match, journey)).eligible).toBe(true);
    match = pair(createMatch(design, 7003), action('rock', 1), action('scissors'));
    journey = observeMatch(journey, match);
    expect(eligible('energy.double_boost', context(design, match, journey)).checks.E).toBe(false);
    match = pair(match, action('charge'), action('charge'));
    match = pair(match, action('rock', 1), action('paper'));
    journey = observeMatch(journey, match);
    expect(journey.facts).toEqual(expect.arrayContaining(['boostWon', 'boostLost']));
    expect(eligible('energy.double_boost', context(design, match, journey)).eligible).toBe(true);
  });
});
