import { describe, expect, it } from 'vitest';
import { advanceMatch, chooseComputerAction, commitComputer, compileDesign, createDesign, createMatch, exchangeCards, installRule, legalActions, makeObservation, nextRandom, removeRule, resolveAttempt, setAbility } from '../../src/core';
import type { Action, ActionKind, Design, MatchState, RuleId } from '../../src/core';
import { evaluateChoice, getChoice } from '../../src/content';
import { createJourney, defaultExpression, observeMatch, recordChoice, respondToInvitation, shouldInviteAbility } from '../../src/journey';
import type { JourneyState } from '../../src/journey';

const a = (kind: ActionKind, boost: 0 | 1 = 0, ability = false): Action => ({ kind, boost, ability });
type PublicPlayerInput = Pick<MatchState, 'hand' | 'attempt' | 'fighters'>;
type Policy = (publicInput: PublicPlayerInput, options: Action[]) => Action;
const prefer = (...kinds: ActionKind[]): Policy => (_publicInput, options) => kinds.flatMap(kind => options.filter(action => action.kind === kind && !action.boost && !action.ability))[0] ?? options[0]!;
const initialGas = () => ['life.knockout', 'energy.gesture_boost', 'energy.active_charge', 'energy.wave', 'energy.guard'].reduce((d, id) => installRule(d, id as RuleId), createDesign());

/** The player policy receives public facts and legal choices, never the committed CPU action. */
function realGame(design: Design, seed: number, policy: Policy, onPrepared?: (match: MatchState) => MatchState): MatchState {
  let match = createMatch(design, seed);
  while (!match.result) {
    match = advanceMatch(match);
    if (onPrepared && match.phase === 'preparing' && !match.preparationComplete) match = onPrepared(match);
    match = commitComputer(match);
    if (match.result) break;
    const publicInput = structuredClone({ hand: match.hand, attempt: match.attempt, fighters: match.fighters });
    const choice = policy(publicInput, legalActions(match, 'player'));
    match = resolveAttempt(match, choice, { matchId: match.id, attemptId: match.attempt, commandId: `real-${match.attempt}` });
    // A test-run budget detects an accidentally stalled policy; it is never a game rule.
    expect(match.history.length).toBeLessThanOrEqual(200);
  }
  return match;
}
function eligibility(id: string, design: Design, match: MatchState, journey: JourneyState) {
  return evaluateChoice(getChoice(id)!, { design, match, journey, expression: { ...defaultExpression } });
}

describe('complete creator paths with ordinary seeded computer commitments', () => {
  it('minimal expression path stays a complete single-hand game without inviting abilities', () => {
    const design = createDesign();
    const match = realGame(design, 11, prefer('paper'));
    let journey = observeMatch(createJourney(), match);
    for (const id of ['U01', 'U02', 'U11', 'U06', 'U18']) {
      expect(eligibility(id, design, match, journey).eligible).toBe(true);
      journey = recordChoice(journey, id, getChoice(id)?.kind);
    }
    expect(shouldInviteAbility(journey)).toBe(false);
    expect(compileDesign(design).actions).toHaveLength(3);
    expect(realGame(design, 11, prefer('paper'))).toEqual(match);
  });

  it('five gestures, health battle, invitation refusal/revisit, all three abilities and retreat remain reachable', () => {
    let design = createDesign();
    let match = realGame(design, 21, prefer('rock'));
    let journey = observeMatch(createJourney(), match);
    expect(eligibility('gesture.five', design, match, journey).eligible).toBe(true);
    design = installRule(design, 'gesture.five');
    match = realGame(design, 22, prefer('lizard')); journey = observeMatch(journey, match);
    expect(match.history[0]!.player.kind).toBe('lizard');
    expect(eligibility('life.knockout', design, match, journey).eligible).toBe(true);
    design = installRule(design, 'life.knockout');
    match = realGame(design, 23, prefer('spock')); journey = observeMatch(journey, match);
    expect(shouldInviteAbility(journey)).toBe(true);
    journey = respondToInvitation(journey, 'simple');
    expect(shouldInviteAbility(journey)).toBe(false);
    for (const ability of ['ability.claim_draw', 'ability.insurance', 'ability.retry'] as const) {
      expect(eligibility(ability, design, match, journey).eligible).toBe(true);
      design = setAbility(design, 'player', ability);
      design = setAbility(design, 'computer', 'ability.claim_draw');
      match = realGame(design, 24, (_public, options) => options.find(action => action.kind === 'spock' && action.ability) ?? options[0]!);
      journey = observeMatch(journey, match);
      expect(match.history.some(record => record.player.ability)).toBe(true);
    }
    design = setAbility(design, 'player', null);
    expect(compileDesign(design).ui.abilities).toBe(true);
    expect(design.abilities.computer).toBe('ability.claim_draw');
    design = removeRule(design, 'gesture.five');
    expect(compileDesign(design).actions).toEqual(['rock', 'scissors', 'paper']);
  });

  it('gas route earns each gate through resolved gameplay, including the wait for a gesture draw', () => {
    let design = createDesign();
    let match = realGame(design, 100, prefer('rock'));
    let journey = observeMatch(createJourney(), match);
    const trace: { installed: string; lastSeed: number; hands: number }[] = [];
    function installEligible(id: RuleId) {
      expect(eligibility(id, design, match, journey).eligible, `eligibility for ${id}`).toBe(true);
      design = installRule(design, id);
      journey = recordChoice(journey, id, getChoice(id)?.kind);
    }
    installEligible('life.knockout');
    match = realGame(design, 101, prefer('rock')); journey = observeMatch(journey, match);
    design = setAbility(setAbility(design, 'player', 'ability.insurance'), 'computer', 'ability.claim_draw');
    for (let seed = 102; seed < 118 && !journey.facts.includes('damageDealt'); seed++) {
      match = realGame(design, seed, prefer('paper')); journey = observeMatch(journey, match);
    }
    installEligible('energy.gesture_boost');
    for (let seed = 120; seed < 152 && !journey.facts.includes('gestureDrawEnergy'); seed++) {
      match = realGame(design, seed, (publicInput, options) => options.find(action => action.kind === 'rock' && action.boost === (publicInput.fighters.player.energy > 0 ? 1 : 0) && !action.ability) ?? options[0]!);
      journey = observeMatch(journey, match);
      trace.push({ installed: 'energy.gesture_boost', lastSeed: seed, hands: match.hand });
    }
    expect(journey.facts).toEqual(expect.arrayContaining(['energySpent', 'gestureBoostUsed', 'gestureDrawEnergy']));
    installEligible('energy.active_charge');
    match = realGame(design, 160, (publicInput, options) => (publicInput.hand === 0 ? options.find(action => action.kind === 'charge') : options.find(action => action.kind === 'paper' && !action.ability && !action.boost)) ?? options[0]!);
    journey = observeMatch(journey, match);
    installEligible('energy.wave');
    match = realGame(design, 161, (publicInput, options) => options.find(action => action.kind === (publicInput.fighters.player.energy >= 2 ? 'wave' : 'charge')) ?? options[0]!);
    journey = observeMatch(journey, match);
    expect(match.history.some(record => record.player.kind === 'wave')).toBe(true);
    installEligible('energy.guard');
    match = realGame(design, 162, prefer('guard')); journey = observeMatch(journey, match);
    expect(match.history.some(record => record.player.kind === 'guard')).toBe(true);
    expect(compileDesign(design).actions).toEqual(['rock', 'scissors', 'paper', 'charge', 'wave', 'guard']);
    console.log(`REAL_GAS_ROUTE ${JSON.stringify({ trace, finalFacts: journey.facts })}`);
  });

  it('health cards route observes depletion, shrinks inventory, then exchanges once', () => {
    let design = installRule(createDesign(), 'life.knockout');
    let match = realGame(design, 210, prefer('rock'));
    let journey = observeMatch(createJourney(), match);
    for (let seed = 211; seed < 240 && !journey.facts.includes('longSeries'); seed++) {
      match = realGame(design, seed, prefer('rock')); journey = observeMatch(journey, match);
    }
    expect(eligibility('cards.finite', design, match, journey).eligible).toBe(true);
    design = installRule(design, 'cards.finite');
    match = realGame(design, 212, prefer('rock', 'paper')); journey = observeMatch(journey, match);
    expect(journey.facts).toContain('inventoryDepleted');
    expect(eligibility('cards.two_each', design, match, journey).eligible).toBe(true);
    design = installRule(design, 'cards.two_each');
    expect(eligibility('cards.exchange_once', design, match, journey).eligible).toBe(true);
    design = installRule(design, 'cards.exchange_once');
    match = realGame(design, 213, prefer('paper', 'scissors', 'rock'), prepared => prepared.fighters.player.exchangeRemaining ? exchangeCards(prepared, 'player', 'rock', 'paper') : prepared);
    expect(match.events.filter(e => e.type === 'exchange' && e.side === 'player')).toHaveLength(1);
    expect(match.fighters.player.exchangeRemaining).toBe(0);
    expect(match.result).not.toBeNull();
  });
});

describe('actual computer action coverage and desktop execution measurements', () => {
  it('ordinary completed seeded games really select every new action and both gesture modifiers', () => {
    const design = setAbility(setAbility(initialGas(), 'player', 'ability.insurance'), 'computer', 'ability.retry');
    const actions: Record<string, number> = {};
    let boostCount = 0, abilityCount = 0, effectiveHands = 0, voided = 0;
    const results = { player: 0, computer: 0, draw: 0 };
    for (let seed = 1000; seed < 1256; seed++) {
      let playerRng = { algorithm: 'mulberry32-v1' as const, state: seed ^ 0x27d4eb2f };
      const match = realGame(design, seed, (_public, options) => {
        const first = nextRandom(playerRng), second = nextRandom(first.rng); playerRng = second.rng;
        const families = [...new Set(options.map(action => action.kind))];
        const selected = options.filter(action => action.kind === families[Math.floor(first.value * families.length)]);
        return selected[Math.floor(second.value * selected.length)]!;
      });
      for (const record of match.history) {
        actions[record.computer.kind] = (actions[record.computer.kind] ?? 0) + 1;
        boostCount += record.computer.boost; abilityCount += Number(record.computer.ability); voided += Number(record.voided);
      }
      effectiveHands += match.hand;
      results[match.result!.winner]++;
    }
    for (const kind of ['rock', 'scissors', 'paper', 'charge', 'wave', 'guard']) expect(actions[kind] ?? 0, `actual computer use: ${kind}`).toBeGreaterThan(5);
    expect(boostCount).toBeGreaterThan(5); expect(abilityCount).toBeGreaterThan(5);
    console.log(`ACTUAL_AI_COVERAGE ${JSON.stringify({ seeds: [1000, 1255], games: 256, effectiveHands, attempts: effectiveHands + voided, actions, boostCount, abilityCount, voided, results })}`);
  }, 30000);

  it('records cold and warmed CPU decision timings without pretending to measure rendering or phones', () => {
    let design = initialGas();
    for (const rule of ['cards.finite', 'cards.two_each', 'cards.exchange_once', 'action.cooldown', 'gesture.reverse'] as RuleId[]) design = installRule(design, rule);
    design = setAbility(setAbility(design, 'player', 'ability.retry'), 'computer', 'ability.insurance');
    const match = createMatch(design, 2000);
    match.fighters.player.energy = 3; match.fighters.computer.energy = 3;
    const observation = makeObservation(match);
    const start = performance.now(); chooseComputerAction(observation, match.rng); const cold = performance.now() - start;
    const timings: number[] = [];
    for (let i = 0; i < 120; i++) {
      const now = performance.now();
      chooseComputerAction(observation, { algorithm: 'mulberry32-v1', state: i + 2000 });
      timings.push(performance.now() - now);
    }
    timings.sort((a, b) => a - b);
    const measurements = { samples: timings.length, playerVariants: observation.opponentLegal.length, computerVariants: observation.legal.length, coldMs: cold, p50Ms: timings[Math.floor(timings.length * .5)]!, p95Ms: timings[Math.floor(timings.length * .95)]!, maxMs: timings.at(-1)! };
    expect(measurements.p95Ms).toBeLessThan(1000); // Severe regression guard, not a frame-rate acceptance claim.
    console.log(`DESKTOP_AI_TIMING ${JSON.stringify(measurements)}`);
  });
});
