import { declarationsNeeded, declareExperiment } from '../../src/experiments/engine';
import { describe, expect, it } from 'vitest';
import { compileDesign, createDesign, createMatch, installRule, removeRule, setAbility, resolveAttempt, advanceMatch, commitComputer, legalActions, nextRandom, experimentNotes, type ActionKind, type Design, type RuleId } from '../../src/core';
import { ALL_CHOICES, evaluateChoice, getChoice } from '../../src/content';
import { createJourney, defaultExpression, observeMatch } from '../../src/journey';

const designWith = (...rules: RuleId[]) => rules.reduce(installRule, createDesign());
function play(design: Design, player: ActionKind, cpu: ActionKind, boost: 0 | 1 = 0) {
  const match = createMatch(design, 42);
  return resolveAttempt({ ...match, phase: 'awaitingPlayer', preparationComplete: true, computerCommitment: { kind: cpu, boost: 0, ability: false } }, { kind: player, boost, ability: false }, 'experiment');
}
const first = play(createDesign(), 'rock', 'paper');
const context = (design = first.design) => ({ design, match: createMatch(design, 1), journey: observeMatch(createJourney(), first), expression: { ...defaultExpression } });

describe('experiments can be valid even when their mechanics are unhelpful', () => {
  it('offers the gas route immediately without health or damage experience', () => {
    expect(evaluateChoice(getChoice('energy.active_charge')!, context()).eligible).toBe(true);
    const design = designWith('energy.active_charge');
    expect(compileDesign(design)).toMatchObject({ goal: 'single', cap: 1, life: false, energy: true, initialEnergy: 1 });
    const match = play(design, 'charge', 'rock');
    expect(match.result?.winner).toBe('computer');
    expect(match.hand).toBe(1);
    expect(match.fighters.player.energy).toBe(2);
    expect(createMatch(design, 8).fighters.player.energy).toBe(1);
  });
  it('allows wave and guard in a one-hand match with an independently chosen initial resource', () => {
    const design = designWith('energy.wave', 'energy.guard', 'energy.opening_two');
    expect(play(design, 'wave', 'rock').result?.winner).toBe('player');
    expect(play(design, 'guard', 'wave').result?.winner).toBe('draw');
    expect(play(design, 'guard', 'rock').result?.winner).toBe('computer');
    expect(compileDesign(design).life).toBe(false);
  });
  it('charges for a boost without inventing damage or changing single-hand victory', () => {
    const design = designWith('energy.gesture_boost');
    const match = play(design, 'rock', 'scissors', 1);
    expect(match.result?.winner).toBe('player');
    expect(match.fighters.player.energy).toBe(0);
    expect(match.history[0].events.some(event => event.type === 'damage')).toBe(false);
    expect(experimentNotes(design).join(' ')).toContain('不会改变');
  });
  it('keeps cards, gas, dormant damage and the player role when health is withdrawn', () => {
    const original = setAbility(designWith('life.knockout', 'energy.active_charge', 'cards.finite', 'life.draw_damage'), 'player', 'ability.scissors_ninja');
    const design = removeRule(original, 'life.knockout');
    expect(design.rules).toEqual(['energy.active_charge', 'cards.finite', 'life.draw_damage']);
    expect(design.abilities.player).toBe('ability.scissors_ninja');
    expect(compileDesign(design)).toMatchObject({ life: false, energy: true, finiteCards: true, cap: 1 });
    expect(play(design, 'rock', 'rock').result?.winner).toBe('draw');
  });
  it('retains a dormant inventory modifier and activates it when cards are introduced later', () => {
    const bare = designWith('cards.capture');
    expect(compileDesign(bare).capture).toBe(false);
    expect(play(bare, 'rock', 'scissors').fighters.player.cards.scissors).toBe(0);
    const supported = installRule(bare, 'cards.finite');
    expect(compileDesign(supported).capture).toBe(true);
    expect(play(supported, 'rock', 'scissors').fighters.player.cards.scissors).toBe(4);
    expect(removeRule(supported, 'cards.finite').rules).toEqual(['cards.capture']);
  });
  it('allows every live mechanic and character through free combination after one disclosed hand', () => {
    for (const card of ALL_CHOICES.filter(card => card.kind !== 'expression')) {
      const candidate = evaluateChoice(card, context(), { free: true });
      expect(candidate.eligible, `${card.id}: ${candidate.reasons}`).toBe(true);
      const compiled = compileDesign(candidate.preview!.nextDesign);
      expect(compiled.abilities.computer).toBeNull();
      const match = play(candidate.preview!.nextDesign, 'rock', 'paper');
      expect(match.history).toHaveLength(1);
    }
  });
  it('resolves varied live-rule combinations without negative resources or invented CPU roles', () => {
    const rules = ALL_CHOICES.filter(card => card.kind === 'rule');
    const roles = ALL_CHOICES.filter(card => card.kind === 'ability');
    for (let seed = 0; seed < 40; seed++) {
      let rng = { algorithm: 'mulberry32-v1' as const, state: seed };
      let design = createDesign();
      for (const rule of rules) {
        const draw = nextRandom(rng); rng = draw.rng;
        if (draw.value < .35) design = installRule(design, rule.id as RuleId);
      }
      design = setAbility(design, 'player', roles[seed % roles.length].id as NonNullable<Design['abilities']['player']>);
      const compiled = compileDesign(design);
      let match = createMatch(design, seed);
      for (let step = 0; step < 6 && !match.result; step++) {
        match = advanceMatch(match);
        if(declarationsNeeded(match))match=declareExperiment(match,{kind:'rock',pledge:false,promise:'none'},compileDesign(match.design));
        match = commitComputer(match);
        if (match.result) break;
        const actions = legalActions(match, 'player');
        match = resolveAttempt(match, actions[(seed + step) % actions.length], `mixed-${step}`);
        for (const fighter of Object.values(match.fighters)) {
          expect(fighter.energy).toBeGreaterThanOrEqual(0);
          expect(fighter.energy).toBeLessThanOrEqual(compiled.energyCap);
          expect(fighter.life).toBeGreaterThanOrEqual(0);
          for (const amount of Object.values(fighter.cards)) expect(amount).toBeGreaterThanOrEqual(0);
        }
        expect(match.design.abilities.computer).toBeNull();
      }
    }
  });
  it('never admits unknown or duplicate rule data as an experiment', () => {
    const design = designWith('energy.active_charge');
    expect(() => installRule(design, 'energy.active_charge')).toThrow();
    expect(() => compileDesign({ ...design, rules: ['unknown' as RuleId] })).toThrow();
  });
});
