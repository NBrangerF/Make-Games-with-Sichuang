import { describe, expect, it } from 'vitest';
import { advanceMatch, chooseComputerAction, commitComputer, compileDesign, createDesign, createMatch, installRule, legalActions, makeObservation, mechanicalHash, previewRuleChange, removeRule, resolveAttempt, setAbility } from '../../src/core';
import type { Action, ActionKind, MatchState, RuleId } from '../../src/core';

const action = (kind: ActionKind, boost: 0 | 1 | 2 = 0, ability = false): Action => ({ kind, boost, ability });
const health = (...rules: RuleId[]) => rules.reduce(installRule, installRule(createDesign(), 'life.knockout'));
function pair(match: MatchState, player: Action, computer: Action): MatchState {
  const ready = advanceMatch(structuredClone(match));
  ready.phase = 'awaitingPlayer';ready.preparationComplete = true;ready.computerCommitment = computer;
  return resolveAttempt(ready, player, `health-${ready.attempt}`);
}
const draw = (match: MatchState) => pair(match, action('rock'), action('rock'));
const win = (match: MatchState) => pair(match, action('rock'), action('scissors'));

describe('current health route without a hand deadline', () => {
  it('keeps the first experiment single-hand, then installs health directly', () => {
    const single = createDesign();
    expect(draw(createMatch(single, 1)).result).toMatchObject({ winner: 'draw', reason: 'single' });
    const preview = previewRuleChange(single, { type: 'install', rule: 'life.knockout' });
    expect(preview.valid).toBe(true);
    expect(preview.nextDesign).toMatchObject({ goal: 'knockout', healthOnly: true });
    expect(preview.notes.join(' ')).toContain('没有固定手数上限');
    expect(compileDesign(preview.nextDesign)).toMatchObject({ healthOnly: true, life: true, score: false, boundedOvertime: false });
    const fighters = createMatch(preview.nextDesign, 2).fighters;
    expect(fighters.player.life).toBe(3);expect(fighters.computer.life).toBe(3);
  });

  it('plays through hand 5, 9, 13, and 20 without cap endings or hidden overtime', () => {
    let match = createMatch(health(), 3);
    for (let hand = 1; hand <= 20; hand++) {
      match = draw(match);
      expect(match.hand).toBe(hand);
      expect(match.result, `after effective hand ${hand}`).toBeNull();
      expect(match.overtimeActive).toBe(false);
      expect(match.fighters.player.life).toBe(3);expect(match.fighters.computer.life).toBe(3);
    }
    expect(match.events.some(event => event.type === 'overtime_started')).toBe(false);
    match = win(win(win(match)));
    expect(match.hand).toBe(23);
    expect(match.result).toMatchObject({ winner: 'player', reason: 'knockout' });
  });

  it('ends on either life total reaching zero, including simultaneous zero', () => {
    const playerWin = win(win(win(createMatch(health(), 4))));
    expect(playerWin.result).toMatchObject({ winner: 'player', reason: 'knockout' });
    let computerWin = createMatch(health(), 5);
    for (let i = 0; i < 3; i++) computerWin = pair(computerWin, action('rock'), action('paper'));
    expect(computerWin.result).toMatchObject({ winner: 'computer', reason: 'knockout' });
    const both = draw(draw(draw(createMatch(health('life.draw_damage'), 6))));
    expect(both.fighters.player.life).toBe(0);expect(both.fighters.computer.life).toBe(0);
    expect(both.result).toMatchObject({ winner: 'draw', reason: 'knockout' });
  });

  it('keeps all gestures, energy and finite cards compatible with a long health battle', () => {
    const design = health('gesture.five', 'cards.finite', 'cards.draw_refund', 'energy.gesture_boost', 'energy.active_charge', 'energy.wave', 'energy.guard');
    let match = createMatch(design, 7);
    for (let i = 0; i < 16; i++) match = pair(match, action('spock'), action('spock'));
    expect(match.result).toBeNull();expect(match.hand).toBe(16);
    expect(match.fighters.player.cards.spock).toBe(3);expect(match.fighters.player.energy).toBe(3);
    expect(compileDesign(design).gestures).toHaveLength(5);
    expect(legalActions(match, 'player')).toContainEqual(action('wave'));
    match = pair(match, action('wave'), action('rock'));
    expect(match.fighters.computer.life).toBe(2);expect(match.fighters.player.energy).toBe(1);
    expect(match.result).toBeNull();
  });

  it('still resolves real action exhaustion without a turn-count shortcut', () => {
    let match = createMatch(health('cards.finite'), 8);
    for (const kind of ['rock', 'scissors', 'paper'] as const) {
      for (let i = 0; i < 3; i++) match = pair(match, action(kind), action(kind));
    }
    expect(match.hand).toBe(9);expect(match.result).toBeNull();
    match = advanceMatch(match);
    expect(match.result).toMatchObject({ winner: 'draw', reason: 'exhaustion' });
    expect(match.fighters.player.life).toBe(3);expect(match.fighters.computer.life).toBe(3);
  });

  it('late retry voids fees, damage, and the effective hand without reintroducing a cap', () => {
    const design = setAbility(health('energy.gesture_boost'), 'player', 'ability.retry');
    let match = createMatch(design, 9);
    for (let i = 0; i < 14; i++) match = draw(match);
    const before = structuredClone(match.fighters);
    match = pair(match, action('rock', 1, true), action('paper'));
    expect(match.hand).toBe(14);expect(match.history.at(-1)?.voided).toBe(true);
    expect(match.fighters.player).toEqual({ ...before.player, abilityRemaining: 0 });
    expect(match.fighters.computer).toEqual(before.computer);expect(match.result).toBeNull();
    match = win(match);
    expect(match.hand).toBe(15);expect(match.fighters.computer.life).toBe(2);expect(match.result).toBeNull();
  });

  it('rejects every retired hand-limit, goal, score and gesture-reduction change', () => {
    const retired: RuleId[] = ['match.first_two', 'match.score_five', 'tempo.extend_cap', 'tempo.short_cap', 'ending.bounded_overtime', 'score.draw_point', 'score.combo', 'score.last_double', 'goal.collect_three', 'goal.draw_three', 'goal.streak_two', 'goal.first_five_points', 'goal.fewest_points', 'goal.efficient_wins', 'life.survive', 'life.last_hit_double', 'gesture.remove_rock'];
    const design = health();
    for (const rule of retired) expect(previewRuleChange(design, { type: 'install', rule }).valid, rule).toBe(false);
    expect(() => compileDesign({ ...design, rules: [...design.rules, 'gesture.remove_rock'] })).toThrow(/减少手势/);
  });

  it('removing health returns to a single hand while preserving the experimental systems', () => {
    const design = setAbility(health('gesture.five', 'gesture.reverse', 'cards.finite', 'cards.draw_refund', 'energy.gesture_boost', 'energy.active_charge', 'energy.wave', 'life.win_heal'), 'player', 'ability.insurance');
    const removed = removeRule(design, 'life.knockout');
    expect(removed.healthOnly).toBeUndefined();
    expect(removed.rules).toEqual(design.rules.filter(id => id !== 'life.knockout'));
    expect(compileDesign(removed)).toMatchObject({ goal: 'single', cap: 1, healthOnly: false, life: false, energy: true, finiteCards: true, abilities: { player: 'ability.insurance', computer: null } });
    expect(draw(createMatch(removed, 10)).result?.reason).toBe('single');
    expect(installRule(removed, 'life.knockout').healthOnly).toBe(true);
  });

  it('AI treats equal public situations equally before and after the historical cap', () => {
    // Bilateral abilities exercise the common resolver's time-horizon valuation; App equips only the player.
    const design = setAbility(setAbility(health('energy.gesture_boost'), 'player', 'ability.insurance'), 'computer', 'ability.retry');
    const early = makeObservation(createMatch(design, 11));
    const late = { ...structuredClone(early), hand: 20, attempt: 21 };
    for (let seed = 0; seed < 64; seed++) {
      const rng = { algorithm: 'mulberry32-v1' as const, state: seed };
      expect(chooseComputerAction(late, rng)).toEqual(chooseComputerAction(early, rng));
    }
    const lateMatch = createMatch(design, 12);lateMatch.hand = 20;lateMatch.attempt = 21;
    expect(commitComputer(lateMatch)).toMatchObject({ phase: 'awaitingPlayer', result: null });
  });

  it('distinguishes the current route from historical finite health experiments', () => {
    const current = health();
    const historical = installRule(installRule(createDesign(), 'match.first_two'), 'life.knockout');
    expect(compileDesign(historical).healthOnly).toBe(false);
    expect(mechanicalHash(current)).not.toBe(mechanicalHash(historical));
    let match = createMatch(historical, 13);for (let i = 0; i < 5; i++) match = draw(match);
    expect(match.result).toMatchObject({ winner: 'draw', reason: 'cap' });
  });
});
