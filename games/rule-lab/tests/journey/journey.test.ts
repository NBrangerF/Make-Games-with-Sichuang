import { describe, expect, it } from 'vitest';
import { advanceMatch, commitComputer, createDesign, createMatch, installRule, removeRule, resolveAttempt, setAbility } from '../../src/core';
import type { Action, ActionKind, DesignDocument, MatchState } from '../../src/core/types';
import { ALL_CHOICES, drawChoices, evaluateChoice, getChoice } from '../../src/content';
import { createJourney, defaultExpression, getUnlockedUI, journeyAtOrigin, observeMatch, recordChoice, respondToInvitation, restoreVersion, shouldInviteAbility, snapshotVersion, validateName } from '../../src/journey';

const action = (kind: ActionKind, boost: 0 | 1 = 0, ability = false): Action => ({ kind, boost, ability });
/** Controlled disclosed pairs exercise the actual engine; no fake experience flags. */
function playPair(match: MatchState, player: Action, computer: Action): MatchState {
  const ready = commitComputer(advanceMatch(match));
  return resolveAttempt({ ...ready, computerCommitment: computer }, player, `test-${match.id}-${ready.attempt}`);
}
function scoreMatch(): MatchState {
  let match = createMatch(installRule(createDesign(), 'match.score_five'), 42);
  for (let i = 0; i < 5; i++) match = playPair(match, action('rock'), action('rock'));
  return match;
}
function context(design: DesignDocument = createDesign(), match = createMatch(design, 42)) {
  return { design, match, journey: createJourney(), expression: { ...defaultExpression } };
}

describe('experience evidence and invitations', () => {
  it('never treats repeated aesthetic choices as mechanical experience', () => {
    let journey = createJourney();
    for (const id of ['U02', 'U02', 'U11', 'U01']) journey = recordChoice(journey, id);
    expect(journey.facts).toEqual([]);
    expect(shouldInviteAbility(journey)).toBe(false);
    const design = installRule(installRule(installRule(createDesign(), 'match.first_two'), 'life.knockout'), 'energy.gesture_boost');
    expect(evaluateChoice(getChoice('energy.active_charge')!, { ...context(design), journey }).checks.E).toBe(false);
  });

  it('offers the first capability invitation after a real series; later and simple suppress repeated prompts', () => {
    const match = scoreMatch();
    const journey = observeMatch(createJourney(), match);
    expect(journey.facts).toEqual(expect.arrayContaining(['handPlayed', 'seriesCompleted', 'reachedCap', 'longSeries', 'repeatedGesture']));
    expect(shouldInviteAbility(journey)).toBe(true);
    for (const response of ['invited', 'later', 'simple', 'accepted'] as const) {
      const answered = respondToInvitation(journey, response);
      expect(shouldInviteAbility(observeMatch(answered, match))).toBe(false);
      expect(evaluateChoice(getChoice('ability.insurance')!, { ...context(installRule(createDesign(), 'life.knockout')), journey: answered }).eligible).toBe(true);
    }
  });

  it('records idempotently without changing the real match or its commitment', () => {
    const match = scoreMatch();
    const before = structuredClone(match);
    const first = observeMatch(createJourney(), match);
    expect(observeMatch(first, match)).toEqual(first);
    expect(first.seenAttemptIds).toHaveLength(5);
    expect(first.completedMatchIds).toEqual([match.id]);
    expect(match).toEqual(before);
  });

  it('lets the simple one-hand route choose reveal tempo after playing multiple separate experiments', () => {
    const first = playPair(createMatch(createDesign(), 71), action('rock'), action('paper'));
    const second = playPair(createMatch(createDesign(), 72), action('paper'), action('rock'));
    const journey = observeMatch(observeMatch(createJourney(), first), second);
    const input = { ...context(second.design, second), journey };
    expect(journey.facts).toContain('multipleReveals');
    expect(evaluateChoice(getChoice('U10')!, input).eligible).toBe(true);
    expect(getChoice('U07')).toBeUndefined();
    expect(journey.facts).not.toContain('seriesCompleted');
  });

  it('does not award spent-energy experience for a voided boosted retry', () => {
    let design = installRule(installRule(createDesign(), 'match.first_two'), 'life.knockout');
    design = setAbility(installRule(design, 'energy.gesture_boost'), 'player', 'ability.retry');
    const match = playPair(createMatch(design, 15), action('rock', 1, true), action('paper'));
    const journey = observeMatch(createJourney(), match);
    expect(journey.facts).toEqual(expect.arrayContaining(['retryObserved', 'abilityDeclared', 'abilityTriggered']));
    expect(journey.facts).not.toContain('energySpent');
    expect(journey.facts).not.toContain('gestureBoostUsed');
    expect(journey.facts).not.toContain('seriesCompleted');
  });

  it('unlocks active charge, then wave, then guard from the real resource sequence', () => {
    let design = installRule(installRule(createDesign(), 'match.first_two'), 'life.knockout');
    let match = playPair(createMatch(design, 101), action('rock'), action('scissors'));
    let journey = observeMatch(createJourney(), match);
    expect(evaluateChoice(getChoice('energy.gesture_boost')!, { ...context(design, match), journey }).eligible).toBe(true);
    design = installRule(design, 'energy.gesture_boost');
    match = playPair(createMatch(design, 102), action('rock', 1), action('rock'));
    journey = observeMatch(journey, match);
    expect(journey.facts).toEqual(expect.arrayContaining(['gestureBoostUsed', 'energySpent', 'gestureDrawEnergy']));
    expect(evaluateChoice(getChoice('energy.active_charge')!, { ...context(design, match), journey }).eligible).toBe(true);
    expect(evaluateChoice(getChoice('energy.wave')!, { ...context(design, match), journey }).eligible).toBe(false);
    design = installRule(design, 'energy.active_charge');
    match = playPair(createMatch(design, 103), action('charge'), action('rock'));
    journey = observeMatch(journey, match);
    expect(evaluateChoice(getChoice('energy.wave')!, { ...context(design, match), journey }).eligible).toBe(true);
    design = installRule(design, 'energy.wave');
    match = playPair(createMatch(design, 104), action('charge'), action('charge'));
    match = playPair(match, action('wave'), action('rock'));
    journey = observeMatch(journey, match);
    expect(evaluateChoice(getChoice('energy.guard')!, { ...context(design, match), journey }).eligible).toBe(true);
  });

  it('requires actual inventory depletion before reducing or exchanging cards', () => {
    const design = installRule(installRule(createDesign(), 'match.score_five'), 'cards.finite');
    let match = createMatch(design, 17);
    let journey = observeMatch(createJourney(), match);
    expect(evaluateChoice(getChoice('cards.two_each')!, { ...context(design, match), journey }).eligible).toBe(false);
    for (let i = 0; i < 3; i++) match = playPair(match, action('rock'), action('rock'));
    journey = observeMatch(journey, match);
    expect(evaluateChoice(getChoice('cards.two_each')!, { ...context(design, match), journey }).eligible).toBe(true);
    expect(evaluateChoice(getChoice('cards.exchange_once')!, { ...context(design, match), journey }).eligible).toBe(true);
  });
});

describe('creation choices, exact changes and opportunity', () => {
  it('has 40 mechanics, 14 player capabilities and 7 expression choices', () => {
    expect(ALL_CHOICES.filter(choice => choice.kind === 'rule')).toHaveLength(40);
    expect(new Set(ALL_CHOICES.filter(choice => choice.kind === 'rule').map(choice => choice.ruleId ?? choice.id)).size).toBe(40);
    expect(ALL_CHOICES.filter(choice => choice.kind === 'ability')).toHaveLength(14);
    expect(ALL_CHOICES.filter(choice => choice.kind === 'expression')).toHaveLength(7);
    expect(new Set(ALL_CHOICES.map(choice => choice.id)).size).toBe(61);
  });

  it('offers gameplay-first random creation without changing RNG or honoring obsolete direction filters', () => {
    const match = playPair(createMatch(createDesign(), 99), action('rock'), action('paper'));
    const input = { ...context(match.design, match), journey: observeMatch(createJourney(), match) };
    const before = structuredClone(input);
    const sample = drawChoices(input, { seed: 123, draw: 0 });
    expect(sample.cards).toHaveLength(3);
    expect(sample.cards.some(choice => choice.kind === 'rule')).toBe(true);
    expect(sample.cards.filter(choice => choice.kind === 'expression').length).toBeLessThanOrEqual(1);
    expect(drawChoices(input, { seed: 123, draw: 0 })).toEqual(sample);
    expect(drawChoices({ ...input, journey: { ...input.journey, direction: 'rules' } }, { seed: 123, draw: 0 })).toEqual(sample);
    expect(drawChoices({ ...input, journey: { ...input.journey, direction: 'expression' } }, { seed: 123, draw: 0 })).toEqual(sample);
    expect(input).toEqual(before);
  });

  it('does not recommend empty resources or removed expression and history cards', () => {
    const input = context();
    expect(evaluateChoice(getChoice('U08')!, input).eligible).toBe(false);
    expect(evaluateChoice(getChoice('U06')!, input).eligible).toBe(false);
    expect(getChoice('U07')).toBeUndefined();
    for (const id of ['U05', 'U07', 'U14', 'U16', 'U17']) expect(getChoice(id)).toBeUndefined();
  });

  it('returns full goal replacement and allows five gestures together with the energy system', () => {
    const match = scoreMatch();
    const journey = observeMatch(createJourney(), match);
    const preview = evaluateChoice(getChoice('life.knockout')!, { ...context(match.design, match), journey }).preview!;
    expect(preview.valid).toBe(true);
    expect(preview.removed).toContain('match.score_five');
    expect(preview.goal).toBe('knockout');
    expect(preview.cap).toBe(5);
    const five = installRule(preview.nextDesign, 'gesture.five');
    const result = evaluateChoice(getChoice('energy.gesture_boost')!, { ...context(five), journey });
    expect(result.checks.H).toBe(true);
    expect(result.preview?.valid).toBe(true);
  });

  it('requires a live health system for finite cards even after earlier long-match experience', () => {
    const match = scoreMatch();
    const journey = observeMatch(createJourney(), match);
    expect(evaluateChoice(getChoice('cards.finite')!, { ...context(match.design, match), journey }).checks.O).toBe(false);
    const life = installRule(createDesign(), 'life.knockout');
    expect(evaluateChoice(getChoice('cards.finite')!, { ...context(life), journey }).eligible).toBe(true);
    expect(evaluateChoice(getChoice('cards.finite')!, { ...context(), journey }).eligible).toBe(false);
  });

});

describe('names and in-memory version restoration', () => {
  it('counts visible graphemes instead of code units and never creates a title when cancelled/empty', () => {
    expect(validateName('')).toEqual({ ok: true, name: null });
    expect(validateName('  一拳  ')).toEqual({ ok: true, name: '一拳' });
    expect(validateName('👨‍👩‍👧‍👦'.repeat(24)).ok).toBe(true);
    expect(validateName('中'.repeat(25)).ok).toBe(false);
    expect(validateName('两行\n名字').ok).toBe(false);
    expect(defaultExpression.name).toBeNull();
  });

  it('restores independent snapshots and preserves previous works when returning to the origin', () => {
    const design = createDesign(), expression = { ...defaultExpression, name: '只此一拳' };
    const journey = snapshotVersion(createJourney(), design, expression, '命名', '2026-09-09T00:00:00.000Z');
    expression.name = '修改当前输入';
    const old = restoreVersion(journey, journey.versions[0].id)!;
    expect(old.expression.name).toBe('只此一拳');
    old.expression.name = '修改取回的副本';
    expect(journey.versions[0].expression.name).toBe('只此一拳');
    expect(journeyAtOrigin(journey).versions).toEqual(journey.versions);
    expect(restoreVersion(journey, 'unknown')).toBeNull();
  });
});

describe('random three-card choice contract', () => {
  function firstResult() {
    const match = playPair(createMatch(createDesign(), 99), action('rock'), action('paper'));
    return { ...context(match.design, match), journey: observeMatch(createJourney(), match) };
  }

  it('reaches every initially eligible card across draws, while preserving valid gameplay-first offers', () => {
    const input = firstResult();
    const original = structuredClone(input);
    const seen = new Set<string>();
    const batches = new Set<string>();
    for (let draw = 0; draw < 256; draw++) {
      const offer = drawChoices(input, { seed: 75, draw });
      expect(offer.cards).toHaveLength(3);
      expect(new Set(offer.cards.map(card => card.id)).size).toBe(offer.cards.length);
      expect(offer.cards.some(card => card.kind !== 'expression')).toBe(true);
      expect(offer.cards.filter(card => card.kind === 'expression').length).toBeLessThanOrEqual(1);
      for (const card of offer.cards) {
        expect(evaluateChoice(card, input).eligible).toBe(true);
        seen.add(card.id);
      }
      batches.add(offer.cards.map(card => card.id).join('|'));
    }
    expect(seen).toEqual(new Set(ALL_CHOICES.filter(card => evaluateChoice(card, input).eligible).map(card => card.id)));
    // Three starting mechanics also permit different pairs when an expression is offered.
    expect(batches.size).toBeGreaterThan(20);
    expect(input).toEqual(original);
    expect(seen.has('energy.wave')).toBe(false);
    expect(seen.has('cards.two_each')).toBe(false);
    expect(seen.has('tempo.extend_cap_again')).toBe(false);
  });

  it('varies with its independent seed but not with mechanical RNG, style, or obsolete direction', () => {
    const input = firstResult();
    const batches = new Set(Array.from({ length: 128 }, (_, seed) => drawChoices(input, { seed, draw: 0 }).cards.map(card => card.id).join('|')));
    expect(batches.size).toBeGreaterThan(10);
    const differentPresentation = { ...input, expression: { ...input.expression, style: 'cyanotype' as const }, journey: { ...input.journey, direction: 'rules' as const }, match: { ...input.match, rng: { ...input.match.rng, state: 9999 } } };
    expect(drawChoices(differentPresentation, { seed: 15, draw: 2 })).toEqual(drawChoices(input, { seed: 15, draw: 2 }));
  });

  it('never returns selected cards even after many later choices or mechanical removal', () => {
    let input = firstResult();
    const design = removeRule(installRule(input.design, 'gesture.five'), 'gesture.five');
    const chosen = ['gesture.five', 'U02', 'U11', 'U01', 'U06', 'U18'];
    input = { ...input, design, journey: chosen.reduce((journey, id) => recordChoice(journey, id), input.journey) };
    for (let draw = 0; draw < 64; draw++) {
      expect(drawChoices(input, { seed: 1, draw }).cards.every(card => !chosen.includes(card.id))).toBe(true);
    }
    for (const id of chosen) expect(evaluateChoice(getChoice(id)!, input).eligible).toBe(false);
    expect(recordChoice(input.journey, 'U02')).toBe(input.journey);
  });

  it('keeps the same card eligible when its editor was only opened or cancelled', () => {
    const input = firstResult();
    let seed = 0;
    while (seed < 100 && !drawChoices(input, { seed, draw: 0 }).cards.some(card => card.kind === 'expression')) seed++;
    expect(seed).toBeLessThan(100);
    const before = drawChoices(input, { seed, draw: 0 });
    // Pure preview/reopening does not record a committed choice.
    for (const card of before.cards) evaluateChoice(card, input);
    expect(drawChoices(input, { seed, draw: 0 })).toEqual(before);
    expect(input.journey.choices).toEqual([]);
    const chosen = before.cards.find(card => card.kind === 'expression')!;
    const committed = { ...input, journey: recordChoice(input.journey, chosen.id) };
    expect(evaluateChoice(chosen, committed).eligible).toBe(false);
  });

  it('removes gesture reduction and every alternative duration or goal from the live catalogue', () => {
    const cancelled = [
      'gesture.reverse', 'gesture.public_trump', 'cards.dealer_refill', 'U05', 'U14', 'U16', 'U17',
      'gesture.remove_rock', 'match.first_two', 'match.score_five',
      'score.draw_point', 'score.combo', 'score.last_double',
      'tempo.short_cap', 'tempo.extend_cap', 'tempo.extend_cap_again', 'ending.bounded_overtime',
      'goal.collect_three', 'goal.draw_three', 'goal.streak_two', 'goal.first_five_points',
      'goal.fewest_points', 'goal.efficient_wins', 'life.survive', 'life.last_hit_double',
    ];
    for (const id of cancelled) expect(getChoice(id)).toBeUndefined();
    const input = firstResult();
    const mechanics = ALL_CHOICES.filter(card => card.kind !== 'expression' && evaluateChoice(card, input).eligible).map(card => card.id);
    expect(new Set(mechanics)).toEqual(new Set(['life.knockout', 'gesture.five', 'energy.active_charge']));
    for (let seed = 0; seed < 256; seed++) {
      const offer = drawChoices(input, { seed, draw: 0 });
      expect(offer.cards.every(card => !cancelled.includes(card.id))).toBe(true);
      const plain = offer.cards.filter(card => card.kind !== 'expression');
      if (plain.length === 3) expect(new Set(plain.map(card => card.id))).toEqual(new Set(mechanics));
    }
  });

  it('returns only the real remaining cards when a pool is short or empty', () => {
    const first = firstResult();
    const consumed = ALL_CHOICES.filter(card => !['U11', 'U18'].includes(card.id)).map(card => card.id);
    const input = { ...first, journey: consumed.reduce((journey, id) => recordChoice(journey, id), first.journey) };
    const two = drawChoices(input, { seed: 22, draw: 2 });
    expect(two.cards).toHaveLength(1);
    expect(['U11', 'U18']).toContain(two.cards[0].id);
    expect(two.poolState).toBe('expression_only');
    expect(two.availableCount).toBe(2);
    expect(two.exhausted).toBe(false);
    const last = { ...input, journey: recordChoice(input.journey, 'U18') };
    expect(drawChoices(last, { seed: 22, draw: 3 })).toMatchObject({ cards: [getChoice('U11')], expressionAvailable: true, visualAvailable: false, availableCount: 1 });
    const empty = { ...last, journey: recordChoice(last.journey, 'U11') };
    expect(drawChoices(empty, { seed: 22, draw: 4 })).toMatchObject({ cards: [], availableCount: 0, expressionAvailable: false, visualAvailable: false, exhausted: true, poolState: 'complete' });
  });

  it('continues mechanical choices honestly after all expression cards were selected', () => {
    const first = firstResult();
    const input = { ...first, journey: ALL_CHOICES.filter(card => card.kind === 'expression').map(card => card.id).reduce((journey, id) => recordChoice(journey, id), first.journey) };
    const draw = drawChoices(input, { seed: 7, draw: 15 });
    expect(draw.cards).toHaveLength(3);
    expect(draw.cards.every(card => card.kind === 'rule')).toBe(true);
    expect(draw.visualAvailable).toBe(false);
    expect(draw.expressionAvailable).toBe(false);
  });

  it('rejects invalid random inputs rather than silently repeating a default batch', () => {
    const input = firstResult();
    for (const seed of [-1, NaN, Infinity, 0x100000000, 0.5]) expect(() => drawChoices(input, { seed, draw: 0 })).toThrow(RangeError);
    for (const draw of [-1, NaN, Infinity, 0.1]) expect(() => drawChoices(input, { seed: 1, draw })).toThrow(RangeError);
    expect(() => drawChoices(input, { seed: 1, draw: 0, limit: 0 })).toThrow(RangeError);
  });
});

describe('earned interfaces and minimal journey evidence', () => {
  it('keeps card-earned interfaces separate from automatic workshop and retired UI', () => {
    const journey = createJourney();
    expect(Object.values(getUnlockedUI(journey)).every(value => value === false)).toBe(true);
    const selected = recordChoice(journey, 'U06', 'expression');
    expect(getUnlockedUI(selected)).toEqual({ rules: true, workshop: false, settings: false, cover: false, outcome: false, sound: false });
    const all = ['U18', 'U11'].reduce((state, id) => recordChoice(state, id, 'expression'), selected);
    expect(getUnlockedUI(all)).toEqual({ rules: true, workshop: false, settings: true, cover: false, outcome: false, sound: true });
    expect(Object.values(getUnlockedUI(journeyAtOrigin(all))).every(value => value === false)).toBe(true);
  });

  it('opens rule inspection after one hand without adding workshop, cover, outcome or ending cards', () => {
    const match = playPair(createMatch(createDesign(), 77), action('rock'), action('paper'));
    const input = { ...context(match.design, match), journey: observeMatch(createJourney(), match) };
    expect(evaluateChoice(getChoice('U06')!, input).eligible).toBe(true);
    expect(evaluateChoice(getChoice('U18')!, input).eligible).toBe(true);
    for (const id of ['U05', 'U14', 'U16', 'U17']) expect(getChoice(id)).toBeUndefined();
  });

  it('retains true repeated-reveal counts without storing cross-match round records or hidden commitments', () => {
    const hidden = commitComputer(createMatch(createDesign(), 81));
    expect(hidden.computerCommitment).not.toBeNull();
    const untouched = observeMatch(createJourney(), hidden);
    expect(untouched.seenAttemptIds).toEqual([]);
    const first = playPair(createMatch(createDesign(), 82), action('rock'), action('paper'));
    const second = playPair(createMatch(createDesign(), 83), action('scissors'), action('paper'));
    const observed = observeMatch(observeMatch(untouched, first), second);
    expect(observed.seenAttemptIds).toHaveLength(2);
    expect(observeMatch(observed, second).seenAttemptIds).toEqual(observed.seenAttemptIds);
    expect(observed.facts).toContain('multipleReveals');
    expect(observed).not.toHaveProperty('revealedHistory');
    expect(defaultExpression).not.toHaveProperty('history');
    expect(getUnlockedUI(observed)).not.toHaveProperty('history');
  });
});
