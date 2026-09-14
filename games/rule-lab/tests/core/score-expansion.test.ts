import { describe, expect, it } from 'vitest';
import fc from 'fast-check';
import {
  advanceMatch, compileDesign, createDesign, createMatch, installRule, legalActions,
  mechanicalHash, normalizePlayerOnlyDesign, previewRuleChange, removeRule, resolveAttempt, setAbility,
} from '../../src/core';
import type { Action, ActionKind, Design, MatchState, RuleId } from '../../src/core';

const action = (kind: ActionKind, ability = false): Action => ({ kind, boost: 0, ability });
const scoreDesign = (...ids: RuleId[]): Design => ids.reduce(installRule, installRule(createDesign(), 'match.score_five'));
function pair(state: MatchState, player: Action, computer: Action): MatchState {
  const next = advanceMatch(state);
  next.phase = 'awaitingPlayer';
  next.preparationComplete = true;
  next.computerCommitment = computer;
  return resolveAttempt(next, player, `scoring-${next.attempt}`);
}
const win = (state: MatchState, ability = false) => pair(state, action('rock', ability), action('scissors'));
const draw = (state: MatchState) => pair(state, action('rock'), action('rock'));

describe('four complete score-route rules', () => {
  it('adds equal draw points without pretending to change score margins or winners', () => {
    let normal = createMatch(scoreDesign(), 1);
    let withDrawPoints = createMatch(scoreDesign('score.draw_point'), 1);
    const pairs: [ActionKind, ActionKind][] = [['rock', 'scissors'], ['rock', 'rock'], ['rock', 'paper'], ['paper', 'rock'], ['paper', 'paper']];
    for (const [player, computer] of pairs) {
      normal = pair(normal, action(player), action(computer));
      withDrawPoints = pair(withDrawPoints, action(player), action(computer));
    }
    expect([normal.fighters.player.score, normal.fighters.computer.score]).toEqual([2, 1]);
    expect([withDrawPoints.fighters.player.score, withDrawPoints.fighters.computer.score]).toEqual([4, 3]);
    expect(withDrawPoints.result?.winner).toBe(normal.result?.winner);
    expect(withDrawPoints.history[1].events.filter(event => event.type === 'score_awarded').map(event => event.amount)).toEqual([1, 1]);
  });

  it('rewards consecutive effective wins and lets a draw break the sequence', () => {
    let match = createMatch(scoreDesign('score.combo'), 2);
    match = win(win(match));
    expect(match.fighters.player).toMatchObject({ score: 3, winStreak: 2 });
    match = draw(match);
    expect(match.fighters.player).toMatchObject({ score: 3, winStreak: 0 });
    match = win(win(match));
    expect(match.fighters.player).toMatchObject({ score: 6, winStreak: 2 });
    expect(match.result).toMatchObject({ winner: 'player', reason: 'cap' });
  });

  it('doubles the whole final-hand score only at the actual cap, including a combo bonus', () => {
    let match = createMatch(scoreDesign('score.combo', 'score.last_double', 'tempo.short_cap'), 3);
    match = win(win(match));
    expect(match.fighters.player.score).toBe(3);
    expect(match.result).toBeNull();
    match = win(match);
    expect(match.fighters.player.score).toBe(7);
    expect(match.hand).toBe(3);
    expect(match.history.at(-1)?.events).toEqual(expect.arrayContaining([expect.objectContaining({ type: 'score_awarded', side: 'player', amount: 4, text: expect.stringContaining('末手翻倍') })]));
  });

  it('also doubles final draw points without breaking finite termination', () => {
    let match = createMatch(scoreDesign('score.draw_point', 'score.last_double', 'tempo.short_cap'), 4);
    match = draw(draw(draw(match)));
    expect(match.fighters.player.score).toBe(4);
    expect(match.fighters.computer.score).toBe(4);
    expect(match.result).toMatchObject({ winner: 'draw', reason: 'cap' });
  });

  it('does not score, break a streak, or use the final-hand multiplier on a void retry', () => {
    const design = setAbility(scoreDesign('score.combo', 'score.last_double', 'tempo.short_cap'), 'player', 'ability.retry');
    let match = win(win(createMatch(design, 5)));
    match = pair(match, action('rock', true), action('paper'));
    expect(match.hand).toBe(2);
    expect(match.fighters.player).toMatchObject({ score: 3, winStreak: 2, abilityRemaining: 0 });
    expect(match.fighters.computer).toMatchObject({ score: 0, winStreak: 0 });
    expect(match.history.at(-1)?.events.some(event => event.type === 'score_awarded')).toBe(false);
    match = win(match);
    expect(match.fighters.player.score).toBe(7);
    expect(match.history).toHaveLength(4);
    expect(match.result?.winner).toBe('player');
  });

  it('scores the final ability-adjusted outcome and resets a streak when insurance produces a draw', () => {
    const design = setAbility(scoreDesign('score.draw_point', 'score.combo'), 'player', 'ability.insurance');
    let match = win(win(createMatch(design, 6)));
    match = pair(match, action('rock', true), action('paper'));
    expect(match.history.at(-1)).toMatchObject({ rawOutcome: 'computer', outcome: 'draw' });
    expect(match.fighters.player).toMatchObject({ score: 4, winStreak: 0 });
    expect(match.fighters.computer).toMatchObject({ score: 1, winStreak: 0 });
    const claim = setAbility(scoreDesign('score.draw_point'), 'player', 'ability.claim_draw');
    const claimed = pair(createMatch(claim, 7), action('rock', true), action('rock'));
    expect(claimed.fighters.player.score).toBe(1);
    expect(claimed.fighters.computer.score).toBe(0);
  });

  it('does not apply a final-hand bonus when cards run out before the planned cap', () => {
    let match = createMatch(scoreDesign('score.draw_point', 'score.last_double', 'tempo.extend_cap', 'cards.finite', 'cards.two_each'), 8);
    for (const kind of ['rock', 'rock', 'paper', 'paper', 'scissors', 'scissors'] as const) match = pair(match, action(kind), action(kind));
    match = advanceMatch(match);
    expect(match.result).toMatchObject({ reason: 'exhaustion', winner: 'draw' });
    expect(match.hand).toBe(6);
    expect(match.fighters.player.score).toBe(6);
    expect(match.history.flatMap(record => record.events).filter(event => event.type === 'score_awarded').every(event => event.amount === 1)).toBe(true);
  });

  it('replaces duration rules coherently and allows short finite-card experiments in either installation order', () => {
    const long = scoreDesign('tempo.extend_cap', 'score.combo');
    const short = previewRuleChange(long, { type: 'install', rule: 'tempo.short_cap' });
    expect(short).toMatchObject({ valid: true, cap: 3 });
    expect(short.removed).toContain('tempo.extend_cap');
    expect(short.nextDesign.rules).toContain('score.combo');
    expect(installRule(short.nextDesign, 'tempo.extend_cap').rules).not.toContain('tempo.short_cap');
    expect(removeRule(short.nextDesign, 'tempo.short_cap').cap).toBe(5);
    expect(previewRuleChange(scoreDesign('cards.finite'), { type: 'install', rule: 'tempo.short_cap' }).valid).toBe(true);
    expect(previewRuleChange(scoreDesign('tempo.short_cap'), { type: 'install', rule: 'cards.finite' }).valid).toBe(true);
  });

  it('requires a score objective and removes score modifiers when switching goals', () => {
    for (const rule of ['score.draw_point', 'score.combo', 'score.last_double'] as const) {
      expect(previewRuleChange(createDesign(), { type: 'install', rule }).valid).toBe(false);
      expect(previewRuleChange(installRule(createDesign(), 'match.first_two'), { type: 'install', rule }).valid).toBe(false);
    }
    const design = scoreDesign('score.draw_point', 'score.combo', 'score.last_double');
    const life = previewRuleChange(design, { type: 'install', rule: 'life.knockout' });
    expect(life.valid).toBe(true);
    expect(life.removed).toEqual(expect.arrayContaining(['match.score_five', 'score.draw_point', 'score.combo', 'score.last_double']));
    expect(compileDesign(life.nextDesign)).toMatchObject({ drawPoint: false, combo: false, lastDouble: false });
  });
});

describe('player-only app boundary and bounded mixed rules', () => {
  it('preserves identity/hash when already normalized and removes only an imported computer power', () => {
    const clean = setAbility(scoreDesign(), 'player', 'ability.insurance');
    expect(normalizePlayerOnlyDesign(clean)).toBe(clean);
    const bilateral = setAbility(clean, 'computer', 'ability.retry');
    const original = structuredClone(bilateral);
    const normalized = normalizePlayerOnlyDesign(bilateral);
    expect(normalized.abilities).toEqual({ player: 'ability.insurance', computer: null });
    expect(normalized.revision).toBe(bilateral.revision + 1);
    expect(mechanicalHash(normalized)).toBe(mechanicalHash(clean));
    expect(bilateral).toEqual(original);
    for (const rule of ['score.draw_point', 'score.combo', 'score.last_double', 'tempo.short_cap'] as const) {
      const changed = normalizePlayerOnlyDesign(installRule(normalized, rule));
      const match = createMatch(changed, 9);
      expect(changed.abilities.computer).toBeNull();
      expect(match.fighters.computer.abilityRemaining).toBe(0);
      expect(legalActions(match, 'computer').some(candidate => candidate.ability)).toBe(false);
      expect(legalActions(match, 'player').some(candidate => candidate.ability)).toBe(true);
    }
  });

  it('terminates legal combinations within cap plus one player retry, without invalid scores or dead turns', () => {
    fc.assert(fc.property(
      fc.record({ seed: fc.nat(0xffffffff), draw: fc.boolean(), combo: fc.boolean(), last: fc.boolean(), short: fc.boolean(), cards: fc.boolean(), cooldown: fc.boolean(), five: fc.boolean(), long: fc.boolean() }),
      options => {
        let design = scoreDesign();
        for (const [enabled, rule] of [[options.draw, 'score.draw_point'], [options.combo, 'score.combo'], [options.last, 'score.last_double'], [options.cooldown, 'action.cooldown'], [options.five, 'gesture.five']] as [boolean, RuleId][]) if (enabled) design = installRule(design, rule);
        if (options.short) design = installRule(design, 'tempo.short_cap');
        else {
          if (options.long) design = installRule(design, 'tempo.extend_cap');
          if (options.cards) design = installRule(installRule(design, 'cards.finite'), 'cards.two_each');
        }
        design = setAbility(design, 'player', 'ability.retry');
        let match = createMatch(design, options.seed);
        let attempts = 0;
        while (!match.result && attempts <= design.cap + 1) {
          match = advanceMatch(match);
          if (match.result) break;
          const player = legalActions(match, 'player'), computer = legalActions(match, 'computer');
          expect(player.length).toBeGreaterThan(0);
          expect(computer.length).toBeGreaterThan(0);
          match = pair(match, player[(options.seed + attempts * 7) % player.length], computer[(options.seed + attempts * 3) % computer.length]);
          attempts++;
        }
        expect(match.result).not.toBeNull();
        expect(attempts).toBeLessThanOrEqual(design.cap + 1);
        expect(match.hand).toBeLessThanOrEqual(design.cap);
        for (const fighter of Object.values(match.fighters)) {
          expect(Number.isInteger(fighter.score)).toBe(true);
          expect(fighter.score).toBeGreaterThanOrEqual(0);
          expect(fighter.score).toBeLessThanOrEqual((design.cap + 1) * 2);
          expect(fighter.winStreak).toBeLessThanOrEqual(match.hand);
          expect(Object.values(fighter.cards).every(count => count >= 0)).toBe(true);
        }
      },
    ), { numRuns: 160, seed: 440012 });
  });
});
