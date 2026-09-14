import { EXPERIMENT_RULES } from '../../src/experiments/catalog';
import { writeFileSync } from 'node:fs';
import { afterAll, describe, expect, it } from 'vitest';
import { advanceMatch, createDesign, createMatch, installRule, resolveAttempt, setAbility } from '../../src/core';
import type { Action, ActionKind, MatchState, AbilityId } from '../../src/core';
import { ALL_CHOICES, drawChoices, evaluateChoice, EXPRESSION_OFFER_CHANCE, FIRST_ABILITY_OFFER_CHANCE, LATER_ABILITY_OFFER_CHANCE } from '../../src/content';
import type { ChoiceContext } from '../../src/content';
import { createJourney, defaultExpression, observeMatch, recordChoice } from '../../src/journey';

const action = (kind: ActionKind): Action => ({ kind, boost: 0, ability: false });
function play(match: MatchState, player: ActionKind, computer: ActionKind): MatchState {
  const ready = advanceMatch(match);
  ready.phase = 'awaitingPlayer';
  ready.preparationComplete = true;
  ready.computerCommitment = action(computer);
  return resolveAttempt(ready, action(player), `distribution-${ready.attempt}`);
}

function phases(): Record<string, ChoiceContext> {
  const firstMatch = play(createMatch(createDesign(), 81), 'rock', 'scissors');
  const first = { design: firstMatch.design, match: firstMatch, journey: observeMatch(createJourney(), firstMatch), expression: { ...defaultExpression } };
  const health = installRule(createDesign(), 'life.knockout');
  let middleMatch = createMatch(health, 82);
  for (const [player, computer] of [['rock', 'scissors'], ['paper', 'rock'], ['scissors', 'scissors'], ['rock', 'paper'], ['paper', 'rock']] as const) middleMatch = play(middleMatch, player, computer);
  const middle = { design: health, match: middleMatch, journey: ['life.knockout'].reduce((journey, id) => recordChoice(journey, id), observeMatch(first.journey, middleMatch)), expression: { ...defaultExpression } };
  const finite = installRule(health, 'cards.finite');
  let lateMatch = createMatch(finite, 83);
  for (const kind of ['rock', 'rock', 'rock', 'paper', 'paper', 'paper', 'scissors', 'scissors', 'scissors'] as const) lateMatch = play(lateMatch, kind, kind);
  const late = {
    design: finite, match: lateMatch,
    journey: ['cards.finite', 'U01', 'U02', 'U06', 'U11'].reduce((journey, id) => recordChoice(journey, id), observeMatch(middle.journey, lateMatch)),
    expression: { ...defaultExpression, name: '留一步', style: 'cyanotype' as const, sound: 'electronic' as const, ending: 'stamp' as const },
  };
  return { first, middle, late };
}

interface DistributionReport {
  phase: string;
  seedCount: number;
  draw: number;
  mechanicalPool: string[];
  expressionPool: string[];
  expressionBatches: number;
  expressionBatchRate: number;
  expressionSlotShare: number;
  orderedBatches: number;
  distinctCardSets: number;
  mechanicalCounts: Record<string, number>;
  expressionCounts: Record<string, number>;
  sameSeedNextDrawDifferent: number;
  differentSeedSameDrawDifferent: number;
}
const reports: DistributionReport[] = [];
afterAll(() => {
  if (process.env.CARD_DISTRIBUTION_REPORT) writeFileSync(process.env.CARD_DISTRIBUTION_REPORT, JSON.stringify(reports, null, 2));
});

describe('measured gameplay-first random offers', () => {
  for (const [phase, context] of Object.entries(phases())) {
    it(`${phase}: measures 10,000 independent seeds through the real draw API`, () => {
      const eligible = ALL_CHOICES.filter(card => evaluateChoice(card, context).eligible);
      const mechanicalPool = eligible.filter(card => card.kind !== 'expression').map(card => card.id);
      const rulePool = eligible.filter(card => card.kind === 'rule').map(card => card.id);
      const abilityPool = eligible.filter(card => card.kind === 'ability').map(card => card.id);
      const expressionPool = eligible.filter(card => card.kind === 'expression').map(card => card.id);
      expect(mechanicalPool.length).toBeGreaterThanOrEqual(1);
      expect(expressionPool.length).toBeGreaterThan(0);
      const eligibleIds = new Set(eligible.map(card => card.id));
      const mechanicalCounts = Object.fromEntries(mechanicalPool.map(id => [id, 0]));
      const expressionCounts = Object.fromEntries(expressionPool.map(id => [id, 0]));
      const ordered = new Set<string>();
      const sets = new Set<string>();
      let expressionBatches = 0;
      let ruleSlots = 0;
      let abilitySlots = 0;
      let totalSlots = 0;
      let sameSeedNextDrawDifferent = 0;
      let differentSeedSameDrawDifferent = 0;
      const draw = phase === 'first' ? 0 : phase === 'middle' ? 7 : 19;
      const before = structuredClone(context);
      for (let seed = 0; seed < 10_000; seed++) {
        const offer = drawChoices(context, { seed, draw });
        const ids = offer.cards.map(card => card.id);
        // Direct invariant checks keep the large real-API sample inexpensive.
        const expressions = offer.cards.filter(card => card.kind === 'expression');
        const abilities = offer.cards.filter(card => card.kind === 'ability');
        const expectedSize = Math.min(3 - expressions.length - abilities.length, rulePool.length) + expressions.length + abilities.length;
        if (ids.length !== expectedSize || new Set(ids).size !== ids.length || !ids.every(id => eligibleIds.has(id))) throw new Error(`Invalid ${phase} batch for seed ${seed}: ${ids}`);
        totalSlots += ids.length;
        if (abilities.length > 1) throw new Error(`Multiple characters in ${phase}/${seed}`);
        if (expressions.length > 1) throw new Error(`Expression quota exceeded for ${phase}/${seed}`);
        if (expressions.length) expressionBatches++;
        for (const card of offer.cards) {
          if (card.kind === 'expression') expressionCounts[card.id]++;
          else { mechanicalCounts[card.id]++; if (card.kind === 'ability') abilitySlots++; else ruleSlots++; }
        }
        const orderKey = ids.join('|');
        ordered.add(orderKey);
        sets.add([...ids].sort().join('|'));
        // Recheck stability and neighboring inputs for 100 representative independent seeds.
        if (seed % 100 === 0) {
          expect(drawChoices(context, { seed, draw })).toEqual(offer);
          if (drawChoices(context, { seed, draw: draw + 1 }).cards.map(card => card.id).join('|') !== orderKey) sameSeedNextDrawDifferent++;
          if (drawChoices(context, { seed: seed + 1, draw }).cards.map(card => card.id).join('|') !== orderKey) differentSeedSameDrawDifferent++;
        }
      }
      // Familiar routes stay uniform; novel mechanisms are sampled by family,
      // then uniformly within that family. Adding content cannot drown gas/wave.
      const familiarPool=rulePool.filter(id=>!id.startsWith('experiment.'));
      const novelPool=rulePool.filter(id=>id.startsWith('experiment.'));
      const families=[...new Set(novelPool.map(id=>EXPERIMENT_RULES.find(r=>r.id===id)!.group))];
      const pools=[familiarPool,abilityPool,...families.map(group=>novelPool.filter(id=>EXPERIMENT_RULES.find(r=>r.id===id)!.group===group))];
      for(const pool of pools){
        if(!pool.length)continue;
        const expected=pool.reduce((sum,id)=>sum+mechanicalCounts[id]!,0)/pool.length;
        const tolerance=6*Math.sqrt(expected*(1-expected/10_000))+5;
        for(const id of pool){expect(mechanicalCounts[id]).toBeGreaterThan(0);expect(Math.abs(mechanicalCounts[id]!-expected)).toBeLessThan(tolerance);}
      }
      if(familiarPool.length>=2&&novelPool.length){
        const counts=families.map(group=>novelPool.filter(id=>EXPERIMENT_RULES.find(r=>r.id===id)!.group===group).reduce((sum,id)=>sum+mechanicalCounts[id]!,0));
        const expected=counts.reduce((a,b)=>a+b,0)/counts.length;
        for(const count of counts)expect(Math.abs(count-expected)).toBeLessThan(6*Math.sqrt(expected)+5);
        const familiarSlots=familiarPool.reduce((sum,id)=>sum+mechanicalCounts[id]!,0);
        expect(familiarSlots/ruleSlots).toBeGreaterThan(.4);
      }
      if (abilityPool.length) expect(abilitySlots / 10_000).toBeCloseTo(FIRST_ABILITY_OFFER_CHANCE, 1);
      const expectedPerExpression = expressionBatches / expressionPool.length;
      for (const count of Object.values(expressionCounts)) {
        expect(count).toBeGreaterThan(0);
        expect(Math.abs(count - expectedPerExpression)).toBeLessThan(6 * Math.sqrt(expectedPerExpression) + 5);
      }
      expect(expressionBatches / 10_000).toBeGreaterThan(0.20);
      expect(expressionBatches / 10_000).toBeLessThan(0.24);
      const maxCardShare = mechanicalPool.length >= 3 ? 0.08 : mechanicalPool.length === 2 ? 0.11 : 0.20;
      expect(expressionBatches / totalSlots).toBeLessThan(maxCardShare);
      expect(ordered.size).toBeGreaterThan(mechanicalPool.length >= 3 ? 20 : expressionPool.length);
      expect(sets.size).toBeGreaterThan(mechanicalPool.length >= 3 ? 10 : expressionPool.length);
      // A pool of only two mechanics has two pure-gameplay orders, so adjacent
      // random inputs naturally repeat more often than a large pool.
      const variationMinimum = mechanicalPool.length >= 3 ? 70 : mechanicalPool.length === 2 ? 35 : 15;
      expect(sameSeedNextDrawDifferent).toBeGreaterThan(variationMinimum);
      expect(differentSeedSameDrawDifferent).toBeGreaterThan(variationMinimum);
      expect(context).toEqual(before);
      reports.push({ phase, seedCount: 10_000, draw, mechanicalPool, expressionPool, expressionBatches,
        expressionBatchRate: expressionBatches / 10_000, expressionSlotShare: expressionBatches / totalSlots,
        orderedBatches: ordered.size, distinctCardSets: sets.size, mechanicalCounts, expressionCounts,
        sameSeedNextDrawDifferent, differentSeedSameDrawDifferent });
    }, 120_000);
  }

  it('invalidates eligibility when facts, selected IDs or a design change in place',()=>{
    const context=phases().first;
    const check=()=>expect(drawChoices(context,{seed:19,draw:0}).availableCount).toBe(ALL_CHOICES.filter(card=>evaluateChoice(card,context).eligible).length);
    check();context.journey.facts.push('multipleReveals');check();
    context.journey.choices.push(...EXPERIMENT_RULES.map(r=>r.id));check();
    Object.assign(context.design,installRule(context.design,'life.knockout'));check();
  });

  it('declares a sparse random probability, independent from presentation preferences and battle RNG', () => {
    expect(EXPRESSION_OFFER_CHANCE).toBe(0.22);
    const context = phases().middle;
    const alternative = { ...context, expression: { ...context.expression, style: 'cyanotype' as const, sound: 'electronic' as const, name: '另一种外观' }, journey: { ...context.journey, direction: 'expression' as const }, match: { ...context.match, rng: { ...context.match.rng, state: 901 }, computerCommitment: action('paper') } };
    for (let draw = 0; draw < 25; draw++) expect(drawChoices(alternative, { seed: 16, draw })).toEqual(drawChoices(context, { seed: 16, draw }));
  });

  it('never backfills a thin gameplay pool with multiple expression cards', () => {
    const context = phases().first;
    const mechanics = ALL_CHOICES.filter(card => card.kind !== 'expression' && evaluateChoice(card, context).eligible);
    for (const remaining of [1, 2]) {
      const consumed = mechanics.slice(remaining).map(card => card.id);
      const short = { ...context, journey: consumed.reduce((journey, id) => recordChoice(journey, id), context.journey) };
      let withExpression = 0;
      for (let seed = 0; seed < 500; seed++) {
        const offer = drawChoices(short, { seed, draw: 0 });
        expect(offer.poolState).toBe('short_gameplay');
        expect(offer.mechanicalAvailableCount).toBe(remaining);
        expect(offer.cards.filter(card => card.kind !== 'expression')).toHaveLength(remaining);
        const ui = offer.cards.filter(card => card.kind === 'expression').length;
        expect(ui).toBeLessThanOrEqual(1);
        expect(offer.cards.length).toBe(remaining + ui);
        withExpression += ui;
      }
      expect(withExpression).toBeGreaterThan(75);
      expect(withExpression).toBeLessThan(150);
    }
  });

  it('shows one honest expression-only option and distinguishes locked from fully consumed pools', () => {
    const context = phases().first;
    const allMechanics = ALL_CHOICES.filter(card => card.kind !== 'expression').map(card => card.id);
    const onlyExpression = { ...context, journey: allMechanics.reduce((journey, id) => recordChoice(journey, id), context.journey) };
    const offer = drawChoices(onlyExpression, { seed: 88, draw: 3 });
    expect(offer.poolState).toBe('expression_only');
    expect(offer.cards).toHaveLength(1);
    expect(offer.cards[0].kind).toBe('expression');
    expect(offer.mechanicalAvailableCount).toBe(0);
    const selected = { ...onlyExpression, journey: recordChoice(onlyExpression.journey, offer.cards[0].id) };
    for (let seed = 0; seed < 20; seed++) expect(drawChoices(selected, { seed, draw: 4 }).cards.map(card => card.id)).not.toContain(offer.cards[0].id);
    const emptyContext = { design: createDesign(), match: createMatch(createDesign(), 91), journey: createJourney(), expression: { ...defaultExpression } };
    expect(drawChoices(emptyContext, { seed: 0, draw: 0 })).toMatchObject({ cards: [], poolState: 'awaiting_experience', exhausted: true });
    const allConsumed = { ...context, journey: ALL_CHOICES.map(card => card.id).reduce((journey, id) => recordChoice(journey, id), context.journey) };
    expect(drawChoices(allConsumed, { seed: 0, draw: 0 })).toMatchObject({ cards: [], poolState: 'complete', exhausted: true, lockedCount: 0 });
  });

  it('preserves gameplay when a caller asks for one slot and keeps cancelled draws reproducible', () => {
    const context = phases().first;
    for (let seed = 0; seed < 64; seed++) {
      const offer = drawChoices(context, { seed, draw: 0, limit: 1 });
      expect(offer.cards).toHaveLength(1);
      expect(offer.cards[0].kind).not.toBe('expression');
      expect(drawChoices(context, { seed, draw: 0, limit: 1 })).toEqual(offer);
    }
  });
});

describe('whole-batch character probability', () => {
  // These cover both category outcomes and uint32 boundaries. Frequency is already
  // measured over 30,000 seeds per context; sparse-pool cases only need semantics.
  const semanticSeeds = [0, 1, 2, 3, 4, 5, 7, 11, 15, 23, 31, 42, 63, 99, 127, 255, 256, 1024, 65535, 0xffffffff];
  function contexts() {
    const before = phases().middle;
    const selected = ALL_CHOICES.find(card => card.kind === 'ability' && evaluateChoice(card, before).eligible)!;
    const equippedDesign = setAbility(before.design, 'player', selected.id as AbilityId);
    const journey = recordChoice(before.journey, selected.id, selected.kind);
    const removedDesign = setAbility(equippedDesign, 'player', null);
    return {
      selectedId: selected.id,
      before,
      equipped: { ...before, design: equippedDesign, journey },
      removed: { ...before, design: removedDesign, journey },
    };
  }

  it('keeps reduced invitations after a previously chosen role is hidden by the release catalog', () => {
    const { before, removed } = contexts();
    const hidden = { ...before, journey: recordChoice(before.journey, 'ability.broker', 'ability') };
    for (let seed = 0; seed < 512; seed++) {
      const role = (context: ChoiceContext) => drawChoices(context, { seed, draw: 12 }).cards.some(card => card.kind === 'ability');
      expect(role(hidden)).toBe(role(removed));
    }
  });

  it('measures at least 30,000 seeds before and after a character was selected and removed', () => {
    const { before, equipped, removed, selectedId } = contexts();
    expect(FIRST_ABILITY_OFFER_CHANCE).toBe(0.45);
    expect(LATER_ABILITY_OFFER_CHANCE).toBe(0.15);
    expect(removed.design.abilities.player).toBeNull();
    expect(removed.journey.choices).toContain(selectedId);
    const untouched = structuredClone({ before, equipped, removed });
    const samples = 30_000;
    const counts = { before: 0, removed: 0, expressionsBefore: 0, expressionsRemoved: 0 };
    for (let seed = 0; seed < samples; seed++) {
      const early = drawChoices(before, { seed, draw: 7 });
      const later = drawChoices(removed, { seed, draw: 7 });
      const firstAbilities = early.cards.filter(card => card.kind === 'ability');
      const laterAbilities = later.cards.filter(card => card.kind === 'ability');
      const firstExpressions = early.cards.filter(card => card.kind === 'expression');
      const laterExpressions = later.cards.filter(card => card.kind === 'expression');
      if (firstAbilities.length > 1 || laterAbilities.length > 1 || firstExpressions.length > 1 || laterExpressions.length > 1) throw new Error(`Category exceeded at seed ${seed}`);
      if (early.cards.length !== 3 || later.cards.length !== 3) throw new Error(`Rules did not fill available slots at seed ${seed}`);
      if (new Set(early.cards.map(card => card.id)).size !== 3 || new Set(later.cards.map(card => card.id)).size !== 3) throw new Error(`Duplicated card at seed ${seed}`);
      if (later.cards.some(card => card.id === selectedId)) throw new Error('Previously selected character returned');
      if (laterAbilities.length && !firstAbilities.length) throw new Error('The lower threshold is not a subset of the same batch roll');
      counts.before += firstAbilities.length;
      counts.removed += laterAbilities.length;
      counts.expressionsBefore += firstExpressions.length;
      counts.expressionsRemoved += laterExpressions.length;
      if (seed % 300 === 0) {
        expect(drawChoices(equipped, { seed, draw: 7 })).toEqual(later);
        expect(drawChoices(before, { seed, draw: 7 })).toEqual(early);
      }
    }
    expect(counts.before / samples).toBeGreaterThan(0.435);
    expect(counts.before / samples).toBeLessThan(0.465);
    expect(counts.removed / samples).toBeGreaterThan(0.135);
    expect(counts.removed / samples).toBeLessThan(0.165);
    expect(counts.expressionsBefore / samples).toBeGreaterThan(0.21);
    expect(counts.expressionsBefore / samples).toBeLessThan(0.23);
    expect(counts.expressionsRemoved).toBe(counts.expressionsBefore);
    expect({ before, equipped, removed }).toEqual(untouched);
    if (process.env.ABILITY_DISTRIBUTION_REPORT) writeFileSync(process.env.ABILITY_DISTRIBUTION_REPORT, JSON.stringify({ samplesPerContext: samples, counts, rates: { before: counts.before / samples, afterSelectionAndRemoval: counts.removed / samples, expression: counts.expressionsBefore / samples } }, null, 2));
  }, 120_000);

  it('keeps one category roll when many or just one character remain eligible', () => {
    const { removed } = contexts();
    const abilities = ALL_CHOICES.filter(card => card.kind === 'ability' && evaluateChoice(card, removed).eligible);
    expect(abilities.length).toBeGreaterThan(1);
    const one = { ...removed, journey: abilities.slice(1).reduce((journey, card) => recordChoice(journey, card.id, card.kind), removed.journey) };
    for (let seed = 0; seed < 256; seed++) {
      const broad = drawChoices(removed, { seed, draw: 9 });
      const narrow = drawChoices(one, { seed, draw: 9 });
      expect(narrow.cards.some(card => card.kind === 'ability')).toBe(broad.cards.some(card => card.kind === 'ability'));
      expect(narrow.cards.filter(card => card.kind === 'expression').length).toBe(broad.cards.filter(card => card.kind === 'expression').length);
    }
  });

  it('uses successful choice history rather than equipment or the number of previous expression choices', () => {
    const { before, equipped } = contexts();
    const equippedWithoutHistory = { ...equipped, journey: before.journey };
    const expressionHistory = { ...before, journey: ALL_CHOICES.filter(card => card.kind === 'expression').reduce((journey, card) => recordChoice(journey, card.id, card.kind), before.journey) };
    for (let seed = 0; seed < 256; seed++) {
      const roleShown = drawChoices(before, { seed, draw: 12 }).cards.some(card => card.kind === 'ability');
      expect(drawChoices(equippedWithoutHistory, { seed, draw: 12 }).cards.some(card => card.kind === 'ability')).toBe(roleShown);
      expect(drawChoices(expressionHistory, { seed, draw: 12 }).cards.some(card => card.kind === 'ability')).toBe(roleShown);
    }
  });

  it('uses one explicit character fallback only when no eligible rule can fill, with honest short-pool counts', () => {
    for (const original of [contexts().before, contexts().removed]) {
      const rules = ALL_CHOICES.filter(card => card.kind === 'rule' && evaluateChoice(card, original).eligible);
      const short = { ...original, journey: rules.reduce((journey, card) => recordChoice(journey, card.id, card.kind), original.journey) };
      const eligible = ALL_CHOICES.filter(card => evaluateChoice(card, short).eligible);
      const abilities = eligible.filter(card => card.kind === 'ability');
      expect(abilities.length).toBeGreaterThan(1);
      const expressionOutcomes = new Set<boolean>();
      for (const seed of semanticSeeds) {
        const offer = drawChoices(short, { seed, draw: 3 });
        expect(offer.cards.filter(card => card.kind === 'ability')).toHaveLength(1);
        expect(offer.cards.filter(card => card.kind === 'rule')).toHaveLength(0);
        const expressionCount = offer.cards.filter(card => card.kind === 'expression').length;
        expect(expressionCount).toBeLessThanOrEqual(1);
        expect(offer.cards).toHaveLength(1 + expressionCount);
        expect(offer.poolState).toBe('short_gameplay');
        expect(offer.exhausted).toBe(false);
        expect(offer.availableCount).toBe(eligible.length);
        expect(offer.mechanicalAvailableCount).toBe(abilities.length);
        expressionOutcomes.add(expressionCount > 0);
        expect(drawChoices(short, { seed, draw: 3, limit: 1 }).cards[0].kind).toBe('ability');
      }
      expect(expressionOutcomes).toEqual(new Set([false, true]));
    }
  });

  it('does not use the sparse fallback while one rule remains, and respects character probability for a single slot', () => {
    const { removed } = contexts();
    const rules = ALL_CHOICES.filter(card => card.kind === 'rule' && evaluateChoice(card, removed).eligible);
    const oneRule = { ...removed, journey: rules.slice(1).reduce((journey, card) => recordChoice(journey, card.id, card.kind), removed.journey) };
    const characterOutcomes = new Set<boolean>();
    for (const seed of semanticSeeds) {
      const offer = drawChoices(oneRule, { seed, draw: 4 });
      const single = drawChoices(oneRule, { seed, draw: 4, limit: 1 });
      expect(offer.cards.filter(card => card.kind === 'rule')).toHaveLength(1);
      expect(offer.cards.filter(card => card.kind === 'ability').length).toBeLessThanOrEqual(1);
      expect(offer.poolState).toBe('short_gameplay');
      expect(offer.exhausted).toBe(false);
      expect(single.cards).toHaveLength(1);
      expect(single.cards[0].kind).not.toBe('expression');
      const hasCharacter = offer.cards.some(card => card.kind === 'ability');
      characterOutcomes.add(hasCharacter);
      expect(single.cards[0].kind === 'ability').toBe(hasCharacter);
    }
    expect(characterOutcomes).toEqual(new Set([false, true]));
  });
});
