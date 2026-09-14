import { describe, expect, it } from 'vitest';
import { actionCost, advanceMatch, chargeTradeCard, chooseComputerAction, commitComputer, compareReplay, compileDesign, createDesign, createMatch, installRule, legalActions, makeObservation, previewRuleChange, projectPublicView, removeRule, resolveAttempt, setAbility } from '../../src/core';
import type { Action, ActionKind, AbilityId, MatchState, RuleId } from '../../src/core';

const a = (kind: ActionKind, boost: 0 | 1 | 2 = 0, ability = false, wager = false): Action => ({ kind, boost, ability, ...(wager ? { wager } : {}) });
const health = (...rules: RuleId[]) => rules.reduce(installRule, installRule(createDesign(), 'life.knockout'));
const gas = (...rules: RuleId[]) => health('energy.gesture_boost', 'energy.active_charge', 'energy.wave', 'energy.guard', ...rules);
function pair(match: MatchState, player: Action, computer: Action) {
  const ready = advanceMatch(structuredClone(match));
  ready.phase = 'awaitingPlayer';ready.preparationComplete = true;ready.computerCommitment = computer;
  return resolveAttempt(ready, player, `new-mechanics-${ready.attempt}`);
}
const events = (m: MatchState, type: MatchState['events'][number]['type']) => m.history.at(-1)!.events.filter(e => e.type === type);
const equipped = (ability: AbilityId, ...rules: RuleId[]) => setAbility(health(...rules), 'player', ability);

describe('resource conversion and explicit risk', () => {
  it('discards the forecast highest stock, breaks ties by active gesture order, and cannot charge without cards', () => {
    const d = gas('cards.finite', 'cards.charge_trade'), c = compileDesign(d), m = createMatch(d, 1);
    expect(chargeTradeCard(c, m.fighters.player)).toBe('rock');
    m.fighters.player.cards.scissors = 4;
    expect(chargeTradeCard(c, m.fighters.player)).toBe('scissors');
    const n = pair(m, a('charge'), a('guard'));
    expect(n.fighters.player).toMatchObject({ energy: 3, cards: { rock: 3, scissors: 3, paper: 3 } });
    expect(events(n, 'cards_converted')).toMatchObject([{ side: 'player', action: 'scissors', amount: 1 }]);
    expect(events(n, 'cards_spent')).toHaveLength(0);
    for (const g of c.gestures) m.fighters.player.cards[g] = 0;
    expect(chargeTradeCard(c, m.fighters.player)).toBeNull();
    expect(legalActions(m, 'player').some(x => x.kind === 'charge')).toBe(false);
  });

  it('full gas still pays the card and deferred overflow shield cannot block current damage', () => {
    const m = createMatch(gas('cards.finite', 'cards.charge_trade', 'energy.overflow_shield'), 2);
    m.fighters.player.energy = 3;
    const n = pair(m, a('charge'), a('rock'));
    expect(n.fighters.player).toMatchObject({ life: 2, energy: 3, shield: 1, cards: { rock: 2 } });
    expect(events(n, 'energy_overflow')).toMatchObject([{ side: 'player', amount: 2 }]);
    expect(events(n, 'shield_absorbed')).toHaveLength(0);
  });

  it('requires the entire boost plus wager cost and rejects wagers on gas actions', () => {
    const m = createMatch(gas('energy.wager'), 3), c = compileDesign(m.design);
    expect(actionCost(a('rock', 1, false, true), c)).toBe(2);
    expect(legalActions(m, 'player')).not.toContainEqual(a('rock', 1, false, true));
    expect(legalActions(m, 'player')).toContainEqual(a('rock', 0, false, true));
    expect(() => pair(m, a('rock', 1, false, true), a('rock'))).toThrow();
    expect(() => pair(m, a('charge', 0, false, true), a('rock'))).toThrow();
    expect(() => pair(createMatch(gas(), 4), a('rock', 0, false, true), a('rock'))).toThrow();
  });

  it.each([['scissors', 2, 'player'], ['rock', 2, 'draw'], ['paper', 0, 'computer']] as const)('pays upfront and settles wagers after final %s outcome', (cpu, energy, outcome) => {
    const n = pair(createMatch(gas('energy.wager'), 5), a('rock', 0, false, true), a(cpu));
    expect(n.history.at(-1)?.outcome).toBe(outcome);
    expect(n.fighters.player.energy).toBe(energy);
    expect(n.fighters.player.energySpent).toBe(1);
    expect(events(n, 'wager_resolved')[0]?.amount).toBe(outcome === 'player' ? 2 : outcome === 'draw' ? 1 : 0);
  });

  it('uses ability-modified results for wager and restraint; boost changes only damage', () => {
    const d = setAbility(gas('energy.wager', 'energy.restraint'), 'player', 'ability.claim_draw');
    const n = pair(createMatch(d, 6), a('rock', 0, true, true), a('rock'));
    expect(n.history.at(-1)).toMatchObject({ rawOutcome: 'draw', outcome: 'player' });
    expect(n.fighters.player).toMatchObject({ energy: 3, energySpent: 1 });
    expect(n.fighters.computer.life).toBe(2);
    const boosted = pair(createMatch(gas('energy.restraint'), 7), a('rock', 1), a('scissors'));
    expect(events(boosted, 'restraint_charge')).toHaveLength(0);
  });

  it('refunded draw, wager, restraint, and loser gains all feed overflow detection', () => {
    const d = gas('energy.wager', 'energy.restraint', 'energy.loss_charge', 'energy.overflow_shield');
    const tied = createMatch(d, 8);tied.fighters.player.energy = 3;tied.fighters.computer.energy = 3;
    const n = pair(tied, a('rock', 0, false, true), a('rock'));
    expect(n.fighters.player.shield).toBe(1);expect(n.fighters.computer.shield).toBe(1);
    expect(events(n, 'energy_overflow').filter(e => e.side === 'player')).toMatchObject([{ amount: 1 }]);
    const won = pair(tied, a('rock'), a('scissors'));
    expect(won.fighters.player.shield).toBe(1);expect(won.fighters.computer.shield).toBe(1);
    expect(events(won, 'energy_overflow')).toHaveLength(2);
  });
});

describe('card economy and effective-hand rhythm', () => {
  it('captures the loser card without another deduction and permits stock above the opening recipe', () => {
    const n = pair(createMatch(health('cards.finite', 'cards.capture'), 9), a('rock'), a('scissors'));
    expect(n.fighters.player.cards).toMatchObject({ rock: 2, scissors: 4, paper: 3 });
    expect(n.fighters.computer.cards.scissors).toBe(2);
    expect(events(n, 'cards_captured')).toMatchObject([{ side: 'player', action: 'scissors', amount: 1 }]);
    const special = pair(createMatch(gas('cards.finite', 'cards.capture'), 10), a('rock'), a('charge'));
    expect(events(special, 'cards_captured')).toHaveLength(0);
  });

  it('refunds only different consecutive winning gestures, coexisting with capture', () => {
    let m = createMatch(health('cards.finite', 'cards.capture', 'cards.combo_refund'), 11);
    m = pair(m, a('rock'), a('scissors'));
    m = pair(m, a('scissors'), a('paper'));
    expect(m.fighters.player.cards).toMatchObject({ rock: 2, scissors: 4, paper: 4 });
    expect(events(m, 'combo_refund')).toMatchObject([{ side: 'player', action: 'scissors', amount: 1 }]);
    const fresh = createMatch(health('cards.finite', 'cards.combo_refund'), 12);
    fresh.fighters.player.winStreak = 1;fresh.fighters.player.lastAction = 'rock';
    expect(events(pair(fresh, a('rock'), a('scissors')), 'combo_refund')).toHaveLength(0);
    fresh.fighters.player.lastAction = 'wave';
    expect(events(pair(fresh, a('rock'), a('scissors')), 'combo_refund')).toHaveLength(0);
  });

  it('builds three distinct gestures, resets repeats and gas actions, and grants shields after damage', () => {
    let m = createMatch(gas('combo.three_styles', 'life.draw_damage'), 13);
    m = pair(m, a('rock'), a('guard'));
    m = pair(m, a('scissors'), a('scissors'));
    const n = pair(m, a('paper'), a('paper'));
    expect(n.fighters.player).toMatchObject({ life: 1, shield: 1, gestureChain: [] });
    expect(events(n, 'style_chain_completed')).toHaveLength(1);
    expect(events(n, 'shield_absorbed')).toHaveLength(0);
    let repeated = createMatch(gas('combo.three_styles'), 14);
    repeated = pair(pair(repeated, a('rock'), a('rock')), a('scissors'), a('scissors'));
    repeated = pair(repeated, a('rock'), a('rock'));
    expect(repeated.fighters.player.gestureChain).toEqual(['rock']);
    repeated = pair(repeated, a('charge'), a('guard'));
    expect(repeated.fighters.player.gestureChain).toEqual([]);
  });

  it('special cooldown only blocks the last effective gas kind and coexists with gesture cooldown', () => {
    let m = createMatch(gas('action.cooldown', 'action.special_cooldown'), 15);
    m = pair(m, a('charge'), a('guard'));
    expect(legalActions(m, 'player').some(x => x.kind === 'charge')).toBe(false);
    expect(legalActions(m, 'player').some(x => x.kind === 'guard')).toBe(true);
    m = pair(m, a('rock'), a('rock'));
    expect(legalActions(m, 'player').some(x => x.kind === 'rock')).toBe(false);
    expect(legalActions(m, 'player').some(x => x.kind === 'charge')).toBe(true);
  });

  it('ends real double exhaustion after the last card is traded and paid gas actions cool down', () => {
    let m = createMatch(gas('cards.finite', 'cards.charge_trade', 'action.special_cooldown', 'energy.guard_paid'), 150);
    for (const side of ['player', 'computer'] as const) m.fighters[side].cards = { rock: 1, scissors: 0, paper: 0, lizard: 0, spock: 0 };
    m = pair(m, a('charge'), a('charge')); // Last card is gone; three gas remain.
    m = pair(m, a('wave'), a('wave')); // One gas remains, only paid guard can follow.
    m = pair(m, a('guard'), a('guard'));
    expect(m.fighters.player.energy).toBe(0);expect(m.fighters.computer.energy).toBe(0);
    expect(legalActions(m, 'player')).toEqual([]);expect(legalActions(m, 'computer')).toEqual([]);
    expect(m.hand).toBe(3);expect(m.result).toBeNull();
    const ended = advanceMatch(m);
    expect(ended.result).toMatchObject({ reason: 'exhaustion', winner: 'draw' });
    expect(ended.fighters.player.life).toBe(3);expect(ended.fighters.computer.life).toBe(3);
    expect(commitComputer(ended)).toBe(ended);
  });

  it('retry leaves all resources, shield, chain, wager, capture and cooldown uncommitted', () => {
    const d = setAbility(gas('cards.finite', 'cards.capture', 'cards.combo_refund', 'energy.wager', 'combo.three_styles', 'energy.overflow_shield', 'action.special_cooldown'), 'player', 'ability.retry');
    const m = createMatch(d, 16);m.fighters.player.shield = 1;m.fighters.player.gestureChain = ['scissors', 'paper'];
    const n = pair(m, a('rock', 0, true, true), a('paper'));
    expect(n.history.at(-1)?.voided).toBe(true);
    expect(n.hand).toBe(0);
    expect(n.fighters.player).toEqual({ ...m.fighters.player, abilityRemaining: 0 });
    expect(n.fighters.computer).toEqual(m.fighters.computer);
    expect(n.history.at(-1)?.events.map(e => e.type)).toEqual(['revealed', 'ability_used', 'retry']);
  });
});

describe('shield timing and five player abilities', () => {
  it('guard stores a shield only against ordinary wave, after draw damage', () => {
    const d = gas('shield.guard_store', 'life.draw_damage', 'energy.piercing_wave'), m = createMatch(d, 17);
    m.fighters.computer.energy = 3;
    const n = pair(m, a('guard'), a('wave'));
    expect(n.fighters.player).toMatchObject({ life: 2, shield: 1 });
    expect(pair(m, a('guard'), a('charge')).fighters.player.shield).toBe(0);
    expect(pair(m, a('guard'), a('piercing_wave')).fighters.player.shield).toBe(0);
  });

  it('aegis blocks this hand including wave, while existing shields never stack above one', () => {
    const m = createMatch(setAbility(gas(), 'player', 'ability.aegis'), 18);m.fighters.computer.energy = 2;
    const n = pair(m, a('rock', 0, true), a('wave'));
    expect(n.fighters.player).toMatchObject({ life: 3, shield: 0, abilityRemaining: 0 });
    expect(n.history.at(-1)?.outcome).toBe('computer');
    expect(events(n, 'shield_gained')[0]).toMatchObject({ ability: 'ability.aegis', amount: 1 });
    m.fighters.player.shield = 1;
    const stacked = pair(m, a('rock', 0, true), a('rock'));
    expect(stacked.fighters.player.shield).toBe(1);
    expect(events(stacked, 'shield_gained')[0]?.amount).toBe(0);
  });

  it('shields absorb exactly one damage; winning boosted gestures break and consume them', () => {
    const d = gas('combo.three_styles', 'shield.piercing_boost'), m = createMatch(d, 19);m.fighters.computer.shield = 1;
    const n = pair(m, a('rock', 1), a('scissors'));
    expect(n.fighters.computer).toMatchObject({ life: 1, shield: 0 });
    expect(events(n, 'shield_broken')).toHaveLength(1);expect(events(n, 'shield_absorbed')).toHaveLength(0);
    const ordinary = pair(m, a('rock'), a('scissors'));
    expect(ordinary.fighters.computer).toMatchObject({ life: 3, shield: 0 });
    const noPierce = createMatch(gas('combo.three_styles'), 20);noPierce.fighters.computer.shield = 1;
    expect(pair(noPierce, a('rock', 1), a('scissors')).fighters.computer.life).toBe(2);
  });

  it('siphon transfers only what fits, after payouts and before leaks, even on a loss', () => {
    const d = setAbility(gas('energy.loss_charge', 'energy.leak_thirds'), 'player', 'ability.siphon');
    const m = createMatch(d, 21);m.hand = 2;m.fighters.player.energy = 1;m.fighters.computer.energy = 3;
    const n = pair(m, a('rock', 0, true), a('paper'));
    expect(events(n, 'energy_transferred')).toMatchObject([{ side: 'player', amount: 1, ability: 'ability.siphon' }]);
    expect(n.fighters.player.energy).toBe(2);expect(n.fighters.computer.energy).toBe(1);
    const full = createMatch(d, 22);full.fighters.player.energy = 3;full.fighters.computer.energy = 2;
    const untouched = pair(full, a('rock', 0, true), a('scissors'));
    expect(events(untouched, 'energy_transferred')[0]?.amount).toBe(0);
    expect(untouched.fighters.computer.energy).toBe(3); // the loser gained one, none was destroyed
  });

  it('reforge restores only exhausted active stocks after spending the last card, before exhaustion', () => {
    const m = createMatch(equipped('ability.reforge', 'gesture.five', 'cards.finite'), 23);
    m.fighters.player.cards = { rock: 1, scissors: 0, paper: 4, lizard: 0, spock: 0 };
    const n = pair(m, a('rock', 0, true), a('rock'));
    expect(n.fighters.player.cards).toEqual({ rock: 1, scissors: 1, paper: 4, lizard: 1, spock: 1 });
    expect(events(n, 'cards_reforged')).toHaveLength(4);
    expect(events(n, 'inventory_depleted').filter(e => e.side === 'player')).toHaveLength(0);
    expect(advanceMatch(n).result).toBeNull();
  });

  it('last stand protects only actual lethal incoming damage after shield and never heals', () => {
    const m = createMatch(setAbility(gas('combo.three_styles', 'shield.piercing_boost'), 'player', 'ability.last_stand'), 24);
    m.fighters.player.life = 1;m.fighters.player.shield = 1;
    const absorbed = pair(m, a('rock', 0, true), a('paper'));
    expect(absorbed.fighters.player.life).toBe(1);expect(events(absorbed, 'last_stand_triggered')).toHaveLength(0);
    const pierced = pair(m, a('rock', 0, true), a('paper', 1));
    expect(pierced.fighters.player).toMatchObject({ life: 1, shield: 0, abilityRemaining: 0 });
    expect(pierced.history.at(-1)?.outcome).toBe('computer');
    expect(events(pierced, 'last_stand_triggered')).toHaveLength(1);expect(pierced.result).toBeNull();
    m.fighters.player.life = 3;m.fighters.player.shield = 0;
    const mild = pair(m, a('rock', 0, true), a('paper'));
    expect(mild.fighters.player.life).toBe(2);expect(events(mild, 'last_stand_triggered')).toHaveLength(0);
  });

  it('last stand covers simultaneous final-draw damage and terminal uses resulting life totals', () => {
    const m = createMatch(equipped('ability.last_stand', 'life.draw_damage'), 25);
    m.fighters.player.life = 1;m.fighters.computer.life = 1;
    const n = pair(m, a('rock', 0, true), a('rock'));
    expect(n.fighters.player.life).toBe(1);expect(n.fighters.computer.life).toBe(0);
    expect(n.history.at(-1)?.outcome).toBe('draw');expect(n.result).toMatchObject({ reason: 'knockout', winner: 'player' });
  });

  it('foresight reveals only the committed kind on the next effective hand, and expires afterward', () => {
    const m = createMatch(equipped('ability.foresight', 'energy.gesture_boost', 'energy.wager'), 26);
    const used = pair(m, a('rock', 0, true), a('rock'));
    expect(used.foreseenHand).toBe(2);expect(used.publicComputerIntent).toBeNull();
    const preparing = advanceMatch(used);expect(preparing.publicComputerIntent).toBeNull();
    const locked = commitComputer(preparing), publicView = projectPublicView(locked);
    expect(publicView.publicComputerIntent).toBe(locked.computerCommitment!.kind);
    expect(publicView).not.toHaveProperty('computerCommitment');expect(publicView).not.toHaveProperty('rng');
    expect(locked.events.at(-1)).toMatchObject({ type: 'foresight_revealed', action: locked.computerCommitment!.kind });
    const done = resolveAttempt(locked, a('rock'), 'foresight-effective');
    expect(done.foreseenHand).toBeNull();
    const next = commitComputer(advanceMatch(done));expect(next.publicComputerIntent).toBeNull();
    expect(createMatch(m.design, 26).foreseenHand).toBeNull();
  });

  it('void retries preserve an active foresight window and do not waste a just-declared foresight', () => {
    const d = setAbility(equipped('ability.foresight'), 'computer', 'ability.retry');
    const m = createMatch(d, 27);
    const voidedDeclaration = pair(m, a('rock', 0, true), a('scissors', 0, true));
    expect(voidedDeclaration.history.at(-1)?.voided).toBe(true);
    expect(voidedDeclaration.fighters.player.abilityRemaining).toBe(1);expect(voidedDeclaration.foreseenHand).toBeNull();
    const activated = pair(m, a('rock', 0, true), a('rock'));
    const voidedNext = pair(activated, a('rock'), a('scissors', 0, true));
    expect(voidedNext.hand).toBe(1);expect(voidedNext.foreseenHand).toBe(2);
    const recommitted = commitComputer(advanceMatch(voidedNext));
    expect(recommitted.publicComputerIntent).toBe(recommitted.computerCommitment!.kind);
  });
});

describe('dependency closure and deterministic public planning', () => {
  it('allows unsupported player abilities but never adds any new ability to the CPU', () => {
    for (const id of ['ability.aegis', 'ability.foresight', 'ability.siphon', 'ability.reforge', 'ability.last_stand'] as const) {
      const d = gas('cards.finite');
      expect(() => setAbility(d, 'computer', id), id).toThrow(/仅属于玩家/);
      expect(setAbility(d, 'player', id).abilities.computer).toBeNull();
      expect(previewRuleChange(createDesign(), { type: 'ability', side: 'player', ability: id }).valid).toBe(true);
    }
    expect(previewRuleChange(health(), { type: 'ability', side: 'player', ability: 'ability.siphon' }).valid).toBe(true);
    expect(previewRuleChange(health(), { type: 'ability', side: 'player', ability: 'ability.reforge' }).valid).toBe(true);
  });

  it('keeps dependent abilities and dormant modifiers when a source leaves', () => {
    const d = setAbility(gas('cards.finite', 'cards.charge_trade'), 'player', 'ability.reforge');
    const noCards = removeRule(d, 'cards.finite');
    expect(noCards.rules).toContain('cards.charge_trade');expect(noCards.abilities.player).toBe('ability.reforge');expect(compileDesign(noCards).chargeTrade).toBe(false);
    const shield = installRule(setAbility(health('energy.gesture_boost'), 'player', 'ability.aegis'), 'shield.piercing_boost');
    expect(setAbility(shield, 'player', 'ability.insurance').rules).toContain('shield.piercing_boost');
    const retained = installRule(shield, 'combo.three_styles');
    expect(setAbility(retained, 'player', 'ability.insurance').rules).toContain('shield.piercing_boost');
    const gasless = removeRule(setAbility(health('energy.gesture_boost', 'energy.wager'), 'player', 'ability.siphon'), 'energy.gesture_boost');
    expect(gasless.abilities.player).toBe('ability.siphon');expect(gasless.rules).toContain('energy.wager');
    const allGone = removeRule(retained, 'life.knockout');expect(allGone.rules).toEqual(retained.rules.filter(id=>id!=='life.knockout'));expect(allGone.abilities.player).toBe('ability.aegis');
  });

  it('compares disclosed wager transactions exactly and computes deterministic legal AI from public resources', () => {
    const d = gas('cards.finite', 'cards.capture', 'energy.wager', 'energy.restraint', 'combo.three_styles', 'shield.piercing_boost');
    let m = pair(createMatch(d, 28), a('rock', 0, false, true), a('rock'));
    m = pair(m, a('scissors'), a('scissors'));
    const compared = compareReplay(m, d);
    expect(compared.stopped).toBe(false);expect(compared.match.fighters).toEqual(m.fighters);
    const observation = makeObservation(m), saved = structuredClone(observation), rng = { algorithm: 'mulberry32-v1' as const, state: 42 };
    const one = chooseComputerAction(observation, rng), two = chooseComputerAction(observation, rng);
    expect(one).toEqual(two);expect(observation.legal).toContainEqual(one.action);expect(observation).toEqual(saved);expect(rng.state).toBe(42);
  });
});
