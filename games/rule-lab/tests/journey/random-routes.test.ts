import { describe, expect, it } from 'vitest';
import {
  advanceMatch, commitComputer, commitRuleChange, compileDesign, createDesign,
  createMatch, exchangeCards, legalActions, resolveAttempt,
} from '../../src/core';
import type { Action, AttemptRecord, Design, MatchState } from '../../src/core';
import { drawChoices, evaluateChoice, type ChoiceCard, type ChoiceContext } from '../../src/content';
import { createJourney, defaultExpression, getUnlockedUI, observeMatch, recordChoice } from '../../src/journey';
import type { Expression, JourneyState } from '../../src/journey';

interface PublicTurn {
  hand: number;
  playerEnergy: number;
  options: readonly Action[];
}
type Policy = (turn: PublicTurn) => Action;

// This function cannot inspect the computer's current commitment. It only receives
// the player's public energy, turn number and legal choices, copied by the harness.
const gasPolicy: Policy = ({ hand, playerEnergy, options }) => {
  const plain = options.filter(option => !option.ability);
  const guard = plain.find(option => option.kind === 'guard');
  if (guard) return guard;
  const wave = plain.find(option => option.kind === 'wave');
  const charge = plain.find(option => option.kind === 'charge');
  if (wave && playerEnergy >= 2) return wave;
  if (charge && (hand === 0 || !wave)) return charge;
  const preferred = ['rock', 'paper', 'scissors'][hand % 3];
  return plain.find(option => option.kind === preferred && option.boost === (playerEnergy > 0 ? 1 : 0))
    ?? plain.find(option => option.kind === preferred && option.boost === 0)
    ?? charge ?? plain[0]!;
};

// Repeating rock creates the actual repeated-gesture and inventory-depletion
// experiences. A spent card is unavailable, so the next legal family takes over.
const cardsPolicy: Policy = ({ options }) => {
  for (const kind of ['rock', 'paper', 'scissors']) {
    const option = options.find(item => item.kind === kind && !item.boost && !item.ability);
    if (option) return option;
  }
  return options[0]!;
};

function applyExpression(expression: Expression, card: ChoiceCard): Expression {
  const choices: Expression = {
    name: '一步一步', style: 'cyanotype', sound: 'electronic', rulesView: 'list',
    ending: 'stamp', cover: 'diagonal', outcome: 'detailed',
    resources: 'numbers', reveal: 'rhythm',
  };
  if (!card.expressionKey) return expression; // Entry cards such as U18 unlock their real UI directly.
  return { ...expression, [card.expressionKey]: choices[card.expressionKey] };
}

interface TraceEntry { game: number; draw: number; offer: string[]; selected: string | null }
interface CompletedGame { game: number; match: MatchState }

/** In-memory integration harness for the actual public APIs, not a replacement UI. */
class RandomJourney {
  design: Design = createDesign();
  journey: JourneyState = createJourney();
  expression: Expression = { ...defaultExpression };
  match: MatchState;
  games = 0;
  draw = 0;
  trace: TraceEntry[] = [];
  completed: CompletedGame[] = [];

  constructor(readonly seed: number, readonly policy: Policy) {
    this.match = createMatch(this.design, seed);
  }

  context(): ChoiceContext {
    return { design: this.design, match: this.match, journey: this.journey, expression: this.expression };
  }

  playGame(): void {
    this.games++;
    // Replaying is an ordinary new game. Its seed does not use the card draw RNG.
    let match = createMatch(this.design, (this.seed + Math.imul(this.games, 2654435761)) >>> 0);
    const compiled = compileDesign(this.design);
    while (!match.result) {
      match = advanceMatch(match);
      if (compiled.exchange && match.phase === 'preparing' && !match.preparationComplete
        && match.fighters.player.exchangeRemaining > 0) {
        // Public preparation only: make the two-for-one exchange before CPU lock.
        expect(match.computerCommitment).toBeNull();
        const from = compiled.gestures.find(gesture => match.fighters.player.cards[gesture] >= 2);
        const to = compiled.gestures.find(gesture => gesture !== from);
        if (from && to) match = exchangeCards(match, 'player', from, to);
      }
      match = commitComputer(match);
      if (match.result) break;
      const action = this.policy(structuredClone({
        hand: match.hand,
        playerEnergy: match.fighters.player.energy,
        options: legalActions(match, 'player'),
      }));
      match = resolveAttempt(match, action, {
        matchId: match.id, attemptId: match.attempt, commandId: `route:${match.id}:${match.attempt}`,
      });
      // All experience is obtained from real resolved attempts, never assigned facts.
      this.journey = observeMatch(this.journey, match);
      // A test timeout guard, not a game rule: health matches continue past five hands.
      expect(match.history.length).toBeLessThan(1000);
    }
    this.match = match;
    this.journey = observeMatch(this.journey, match);
    this.completed.push({ game: this.games, match });
    expect(match.result).not.toBeNull();
  }

  seek(target: string): void {
    for (let wait = 0; wait < 100; wait++) {
      this.playGame();
      const before = structuredClone(this.context());
      const batch = drawChoices(this.context(), { seed: this.seed ^ 0x41424344, draw: this.draw++ });
      expect(this.context()).toEqual(before); // Drawing cannot mutate the match RNG or state.
      const ids = batch.cards.map(card => card.id);
      expect(new Set(ids).size).toBe(ids.length);
      expect(batch.cards.every(card => !this.journey.choices.includes(card.id))).toBe(true);
      expect(batch.cards.every(card => evaluateChoice(card, this.context()).eligible)).toBe(true);
      expect(batch.cards.filter(card => card.kind === 'expression').length).toBeLessThanOrEqual(1);
      if (batch.mechanicalAvailableCount >= 3) expect(batch.cards.filter(card => card.kind !== 'expression').length).toBeGreaterThanOrEqual(2);
      this.assertNoEarlyCard(ids);
      const selected = batch.cards.find(card => card.id === target)
        ?? batch.cards.find(card => card.kind === 'expression');
      this.trace.push({ game: this.games, draw: this.draw - 1, offer: ids, selected: selected?.id ?? null });
      if (!selected) continue; // Keep the current game and play again; no reroll on close.

      const eligibility = evaluateChoice(selected, this.context());
      expect(eligibility.eligible).toBe(true);
      if (selected.kind === 'expression') {
        const previous = this.expression;
        this.expression = applyExpression(this.expression, selected);
        this.journey = recordChoice(this.journey, selected.id, selected.kind);
        if (selected.unlockUI) expect(getUnlockedUI(this.journey)[selected.unlockUI]).toBe(true);
        else expect(this.expression).not.toEqual(previous);
        expect(this.design).toEqual(before.design);
        expect(this.match).toEqual(before.match);
      } else {
        expect(selected.kind).toBe('rule');
        expect(eligibility.preview?.valid).toBe(true);
        this.design = commitRuleChange(this.design, eligibility.preview!);
        this.journey = recordChoice(this.journey, selected.id, selected.kind);
      }
      expect(evaluateChoice(selected, this.context()).eligible).toBe(false);
      if (selected.id === target) return;
    }
    throw new Error(`Target ${target} was not drawn after 100 completed games: ${JSON.stringify(this.trace)}`);
  }

  assertNoEarlyCard(ids: string[]): void {
    const has = (fact: JourneyState['facts'][number]) => this.journey.facts.includes(fact);
    if (!has('handPlayed')) expect(ids).not.toContain('life.knockout');
    if (!has('handPlayed')) expect(ids).not.toContain('energy.active_charge');
    if (!has('chargeUsed')) expect(ids).not.toContain('energy.wave');
    if (!has('waveObserved')) expect(ids).not.toContain('energy.guard');
    if (!has('inventoryDepleted')) {
      expect(ids).not.toContain('cards.two_each');
      expect(ids).not.toContain('cards.exchange_once');
    }
    for (const id of ['gesture.remove_rock', 'match.first_two', 'match.score_five', 'tempo.short_cap', 'tempo.extend_cap', 'tempo.extend_cap_again', 'ending.bounded_overtime', 'life.survive', 'life.last_hit_double']) expect(ids).not.toContain(id);
    expect(ids.some(id => id.startsWith('score.') || id.startsWith('goal.'))).toBe(false);
  }

  recordsBeforeChoice(choice: string): AttemptRecord[] {
    const selection = this.trace.find(entry => entry.selected === choice);
    expect(selection, `selection trace for ${choice}`).toBeDefined();
    return this.completed.filter(item => item.game <= selection!.game).flatMap(item => item.match.history);
  }

  report(route: string): void {
    console.log(`RANDOM_ROUTE ${JSON.stringify({
      route, seed: this.seed, games: this.games,
      attempts: this.completed.reduce((total, item) => total + item.match.history.length, 0),
      keptWithoutChoice: this.trace.filter(entry => !entry.selected).length,
      selected: this.journey.choices,
      targetDraws: this.trace.filter(entry => entry.selected && !entry.selected.startsWith('U')),
    })}`);
  }
}

describe('complete random-offer journeys from the untouched first hand', () => {
  it.each([3101, 3102])('reaches health consequences through genuine offered cards (seed %i)', seed => {
    const run = new RandomJourney(seed, cardsPolicy);
    const route = ['life.knockout', 'life.draw_damage', 'life.desperation'];
    for (const id of route) run.seek(id);
    expect(run.journey.choices.filter(id => !id.startsWith('U'))).toEqual(route);
    const beforeDraw = run.recordsBeforeChoice('life.draw_damage');
    expect(beforeDraw.some(record => !record.voided && record.outcome === 'draw'
      && record.before.player.life === record.after.player.life && record.before.computer.life === record.after.computer.life)).toBe(true);
    const beforeDesperation = run.recordsBeforeChoice('life.desperation');
    expect(beforeDesperation.some(record => record.before.player.life === 1 || record.after.player.life === 1
      || record.before.computer.life === 1 || record.after.computer.life === 1)).toBe(true);
    run.playGame();
    expect(compileDesign(run.design)).toMatchObject({ healthOnly: true, life: true, drawDamage: true, desperation: true });
    expect(run.match.result?.reason).toBe('knockout');
    expect(run.match.fighters.computer.abilityRemaining).toBe(0);
    run.report('health');
  }, 30000);

  it.each([1101, 1102, 1103])('reaches charge, wave and guard through real offered cards (seed %i)', seed => {
    const run = new RandomJourney(seed, gasPolicy);
    const route = ['life.knockout', 'energy.gesture_boost', 'energy.active_charge', 'energy.wave', 'energy.guard'];
    for (const id of route) run.seek(id);
    expect(run.journey.choices.filter(id => !id.startsWith('U'))).toEqual(route);
    const preCharge = run.recordsBeforeChoice('energy.active_charge');
    expect(preCharge.some(record => !record.voided && record.player.boost === 1)).toBe(true);
    expect(preCharge.some(record => record.events.some(event => event.type === 'energy_spent' && event.side === 'player'))).toBe(true);
    expect(preCharge.some(record => record.events.some(event => event.type === 'gesture_draw_energy'))).toBe(true);
    const preWave = run.recordsBeforeChoice('energy.wave');
    expect(preWave.some(record => !record.voided && record.player.kind === 'charge')).toBe(true);
    const preGuard = run.recordsBeforeChoice('energy.guard');
    expect(preGuard.some(record => !record.voided && (record.player.kind === 'wave' || record.computer.kind === 'wave'))).toBe(true);
    run.playGame();
    expect(run.match.history.some(record => record.player.kind === 'guard')).toBe(true);
    expect(compileDesign(run.design).actions).toEqual(['rock', 'scissors', 'paper', 'charge', 'wave', 'guard']);
    run.report('gas');
  }, 30000);

  it.each([2101, 2102, 2103])('reaches depleted cards, smaller inventory and exchange via offered cards (seed %i)', seed => {
    const run = new RandomJourney(seed, cardsPolicy);
    const route = ['life.knockout', 'cards.finite', 'cards.two_each', 'cards.exchange_once'];
    for (const id of route) run.seek(id);
    expect(run.journey.choices.filter(id => !id.startsWith('U'))).toEqual(route);
    const finiteSelection = run.trace.find(entry => entry.selected === 'cards.finite')!;
    const preFinite = run.completed.filter(item => item.game <= finiteSelection.game);
    expect(preFinite.some(({ match }) => match.history.filter(record => !record.voided).length >= 4)).toBe(true);
    expect(preFinite.some(({ match }) => match.history.some((record, index) => index > 0
      && !record.voided && record.player.kind === match.history[index - 1]!.player.kind))).toBe(true);
    for (const choice of ['cards.two_each', 'cards.exchange_once']) {
      const records = run.recordsBeforeChoice(choice);
      expect(records.some(record => record.events.some(event => event.type === 'inventory_depleted'))).toBe(true);
      expect(records.some(record => record.before.player.cards.rock > 0 && record.after.player.cards.rock === 0)).toBe(true);
    }
    run.playGame();
    expect(compileDesign(run.design).cardsPerGesture).toBe(2);
    expect(run.match.events.filter(event => event.type === 'exchange' && event.side === 'player')).toHaveLength(1);
    expect(run.match.fighters.player.exchangeRemaining).toBe(0);
    expect(run.match.result).not.toBeNull();
    run.report('cards');
  }, 30000);
});
