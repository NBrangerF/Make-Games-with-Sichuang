import { describe, expect, it } from 'vitest';
import fc from 'fast-check';
import { ABILITIES, RULES, advanceMatch, chooseComputerAction, commitComputer, commitRuleChange, compareReplay, compileDesign, createDesign, createMatch, exchangeCards, legalActions, makeObservation, mechanicalHash, nextRandom, previewRuleChange, rawOutcome, removeRule, resolveAttempt, installRule, setAbility } from '../../src/core';
import type { Action, ActionKind, Design, MatchState, RuleId } from '../../src/core';

const action = (kind: ActionKind, boost: 0 | 1 = 0, ability = false): Action => ({ kind, boost, ability });
const designWith = (...ids: RuleId[]) => ids.reduce(installRule, createDesign());
const series = () => designWith('match.first_two');
const life = () => designWith('match.first_two', 'life.knockout');
const energy = () => designWith('match.first_two', 'life.knockout', 'energy.gesture_boost');
const waves = () => designWith('match.first_two', 'life.knockout', 'energy.gesture_boost', 'energy.active_charge', 'energy.wave', 'energy.guard');
function fixture(design: Design, cpu = action('rock')): MatchState {
  const state = createMatch(design, 42);
  state.phase = 'awaitingPlayer';
  state.preparationComplete = true;
  state.computerCommitment = cpu;
  return state;
}
function play(state: MatchState, player: Action, cpu: Action): MatchState {
  const ready = advanceMatch(state);
  ready.phase = 'awaitingPlayer';
  ready.preparationComplete = true;
  ready.computerCommitment = cpu;
  return resolveAttempt(ready, player, `test-${ready.attempt}`);
}

describe('v0.6 design compilation and complete change previews', () => {
  it('retains seventy-five shared core rules including legacy fixtures and eighteen one-slot abilities', () => {
    expect(RULES).toHaveLength(75); expect(ABILITIES).toHaveLength(18);
    const d = setAbility(setAbility(series(), 'player', 'ability.retry'), 'player', 'ability.insurance');
    expect(d.abilities).toEqual({ player: 'ability.insurance', computer: null });
  });
  it('baseline means one hand, three gestures, no phantom resources', () => {
    const c = compileDesign(createDesign());
    expect(c.goal).toBe('single'); expect(c.cap).toBe(1);
    expect(c.actions).toEqual(['rock', 'scissors', 'paper']);
    expect(c.ui).toEqual({ rules: false, series: false, score: false, life: false, energy: false, cards: false, exchange: false, abilities: false, fiveGestures: false });
  });
  it('life replaces the win target and keeps the actual cap', () => {
    let d = installRule(series(), 'tempo.extend_cap');
    const preview = previewRuleChange(d, { type: 'install', rule: 'life.knockout' });
    expect(preview.removed).toContain('match.first_two'); expect(preview.cap).toBe(9);
    d = commitRuleChange(d, preview);
    expect(d.goal).toBe('knockout'); expect(d.rules).not.toContain('match.first_two');
  });
  it('score always sets five hands, and extension is five → nine → thirteen', () => {
    let d = installRule(series(), 'tempo.extend_cap'); expect(d.cap).toBe(9);
    d = installRule(d, 'tempo.extend_cap'); expect(d.cap).toBe(13);
    expect(() => installRule(d, 'tempo.extend_cap')).toThrow();
    d = installRule(d, 'match.score_five'); expect(d.cap).toBe(5); expect(d.rules).not.toContain('tempo.extend_cap');
  });
  it('removal preserves experimental modifiers and abilities when leaving a series', () => {
    let d = designWith('match.score_five', 'cards.finite', 'cards.two_each', 'cards.exchange_once');
    let p = previewRuleChange(d, { type: 'remove', rule: 'cards.finite' });
    expect(p.removed).toEqual(['cards.finite']);
    d = setAbility(d, 'computer', 'ability.retry');
    p = previewRuleChange(d, { type: 'remove', rule: 'match.score_five' });
    expect(p.goal).toBe('single'); expect(p.cap).toBe(1);
    expect(p.abilities.computer).toBe('ability.retry'); expect(p.nextDesign.rules).toEqual(['cards.finite', 'cards.two_each', 'cards.exchange_once']);
  });
  it('removing a player ability retains the computer requirement and shared rules entrance', () => {
    const d = setAbility(setAbility(series(), 'player', 'ability.retry'), 'computer', 'ability.insurance');
    const p = previewRuleChange(d, { type: 'ability', side: 'player', ability: null });
    expect(p.ui.abilities).toBe(true); expect(p.ui.rules).toBe(true); expect(p.abilities.computer).toBe('ability.insurance');
  });
  it('keeps gas when waves still consume it after a target replacement', () => {
    const p = previewRuleChange(waves(), { type: 'install', rule: 'match.score_five' });
    expect(p.valid).toBe(true); expect(p.removed).not.toContain('energy.gesture_boost');
    expect(p.nextDesign.rules).toContain('energy.wave'); expect(p.ui.energy).toBe(true); expect(p.ui.life).toBe(false);
  });
  it('retains charge and guard for experiments without a consumer', () => {
    const d = removeRule(removeRule(waves(), 'energy.gesture_boost'), 'energy.wave');
    expect(d.rules).toContain('energy.active_charge'); expect(d.rules).toContain('energy.guard'); expect(compileDesign(d).energy).toBe(true);
  });
  it('allows dormant mechanics without silently installing prerequisites', () => {
    for (const id of ['cards.two_each', 'cards.exchange_once', 'energy.gesture_boost', 'energy.active_charge', 'energy.wave', 'energy.guard'] as RuleId[]) expect(previewRuleChange(series(), { type: 'install', rule: id }).valid).toBe(true);
    expect(setAbility(createDesign(), 'player', 'ability.retry').goal).toBe('single');
  });
  it('supports the planned five-gesture energy combination in either installation order', () => {
    expect(previewRuleChange(energy(), { type: 'install', rule: 'gesture.five' }).valid).toBe(true);
    const d = designWith('match.first_two', 'gesture.five', 'life.knockout', 'energy.gesture_boost');
    expect(compileDesign(d)).toMatchObject({ energy: true, gestures: ['rock', 'scissors', 'paper', 'lizard', 'spock'] });
    expect(legalActions(createMatch(d, 1), 'player')).toContainEqual(action('spock', 1));
  });
  it('rejects stale previews and malformed or contradictory mechanics', () => {
    const d = createDesign(), p = previewRuleChange(d, { type: 'install', rule: 'gesture.five' });
    expect(() => commitRuleChange(installRule(d, 'gesture.reverse'), p)).toThrow('过期');
    expect(() => compileDesign({ ...series(), goal: 'knockout' })).toThrow('主目标');
    expect(() => compileDesign({ ...series(), cap: 999 })).toThrow();
    expect(() => compileDesign({ ...series(), rules: ['unknown'] as unknown as RuleId[] })).toThrow();
    expect(() => compileDesign({ ...series(), rules: ['match.first_two', 'match.score_five'] })).toThrow();
  });
  it('has a mechanical hash independent of revision and rule install order', () => {
    const a = designWith('gesture.five', 'gesture.reverse'), b = designWith('gesture.reverse', 'gesture.five');
    expect(mechanicalHash(a)).toBe(mechanicalHash({ ...b, revision: 99 }));
  });
});

describe('gesture and gas matrix', () => {
  it('five gestures each beat two others, reverse is antisymmetric, self always draws', () => {
    const gs = compileDesign(designWith('gesture.five')).gestures;
    for (const a of gs) {
      expect(gs.filter(b => rawOutcome(a, b) === 'player')).toHaveLength(2);
      expect(gs.filter(b => rawOutcome(a, b) === 'computer')).toHaveLength(2);
      for (const b of gs) expect(rawOutcome(a, b, true)).toBe(rawOutcome(b, a));
      expect(rawOutcome(a, a, true)).toBe('draw');
    }
  });
  it.each([
    ['rock', 'guard', 'player'], ['guard', 'rock', 'computer'], ['rock', 'charge', 'player'], ['charge', 'rock', 'computer'],
    ['wave', 'rock', 'player'], ['rock', 'wave', 'computer'], ['wave', 'charge', 'player'], ['charge', 'wave', 'computer'],
    ['wave', 'guard', 'draw'], ['guard', 'wave', 'draw'], ['wave', 'wave', 'draw'], ['charge', 'charge', 'draw'], ['guard', 'guard', 'draw'], ['charge', 'guard', 'draw'],
  ] as const)('%s vs %s is %s and global reversal does not affect it', (a, b, result) => {
    expect(rawOutcome(a, b)).toBe(result); expect(rawOutcome(a, b, true)).toBe(result);
  });
  it('boosted rock still loses to plain paper and pays its fee', () => {
    const after = resolveAttempt(fixture(energy(), action('paper')), action('rock', 1), 'boost-loss');
    expect(after.history[0]!.outcome).toBe('computer');
    expect(after.fighters.player).toMatchObject({ life: 2, energy: 0, energySpent: 1 });
    expect(after.fighters.computer.life).toBe(3);
  });
  it('a winning boost does two damage; guard loses to boosted gestures', () => {
    const after = resolveAttempt(fixture(waves(), action('guard')), action('rock', 1), 'boost-win');
    expect(after.fighters.computer.life).toBe(1); expect(after.fighters.player.energy).toBe(0);
  });
  it('gesture draws pay first then both gain one, while gas draws do not', () => {
    const gesture = resolveAttempt(fixture(energy()), action('rock', 1), 'draw');
    expect(gesture.fighters.player.energy).toBe(1); expect(gesture.fighters.computer.energy).toBe(2);
    for (const kind of ['guard', 'wave', 'charge'] as const) {
      const m = fixture(waves(), action(kind)); m.fighters.player.energy = 2; m.fighters.computer.energy = 2;
      const after = resolveAttempt(m, action(kind), kind);
      const expected = kind === 'wave' ? 0 : kind === 'charge' ? 3 : 2;
      expect(after.fighters.player.energy).toBe(expected); expect(after.fighters.computer.energy).toBe(expected);
      expect(after.events.some(e => e.type === 'gesture_draw_energy')).toBe(false);
    }
  });
  it('wave pays two even when blocked and only charge adds gas versus guard', () => {
    const m = fixture(waves(), action('guard')); m.fighters.player.energy = 2;
    const blocked = resolveAttempt(m, action('wave'), 'wave');
    expect(blocked.fighters.player.energy).toBe(0); expect(blocked.fighters.computer.energy).toBe(1);
    expect(blocked.fighters.player.life).toBe(3); expect(blocked.events.some(e => e.type === 'guard_blocked')).toBe(true);
    const charged = resolveAttempt(fixture(waves(), action('guard')), action('charge'), 'charge');
    expect(charged.fighters.player.energy).toBe(2); expect(charged.fighters.computer.energy).toBe(1);
  });
  it('charge obtains its gas before taking lethal damage', () => {
    const m = fixture(waves()); m.fighters.player.life = 1;
    const after = resolveAttempt(m, action('charge'), 'lethal');
    expect(after.fighters.player).toMatchObject({ life: 0, energy: 2 }); expect(after.result?.winner).toBe('computer');
    expect(after.events.findIndex(e => e.type === 'charged')).toBeLessThan(after.events.findIndex(e => e.type === 'damage'));
  });
});

describe('precommitted one-use abilities and retry transactions', () => {
  it('insurance reads R0 once, and the opponent cannot claim its newly created draw', () => {
    let d = setAbility(energy(), 'player', 'ability.insurance'); d = setAbility(d, 'computer', 'ability.claim_draw');
    const after = resolveAttempt(fixture(d, action('paper', 0, true)), action('rock', 0, true), 'insurance');
    expect(after.history[0]).toMatchObject({ rawOutcome: 'computer', outcome: 'draw' });
    expect(after.fighters.player.life).toBe(3); expect(after.fighters.player.energy).toBe(2);
    expect(after.fighters.player.abilityRemaining).toBe(0); expect(after.fighters.computer.abilityRemaining).toBe(0);
  });
  it('simultaneous draw claims cancel, both counts still expire', () => {
    let d = setAbility(series(), 'player', 'ability.claim_draw'); d = setAbility(d, 'computer', 'ability.claim_draw');
    const after = resolveAttempt(fixture(d, action('rock', 0, true)), action('rock', 0, true), 'both');
    expect(after.history[0]!.outcome).toBe('draw');
    expect(after.fighters.player.abilityRemaining + after.fighters.computer.abilityRemaining).toBe(0);
  });
  it('retry leaves fees, cards, cooldown and effective-hand count uncommitted', () => {
    let d = installRule(installRule(energy(), 'cards.finite'), 'action.cooldown');
    d = setAbility(setAbility(d, 'player', 'ability.retry'), 'computer', 'ability.claim_draw');
    const m = fixture(d, action('paper', 1, true));
    const after = resolveAttempt(m, action('rock', 1, true), 'retry');
    expect(after.hand).toBe(0); expect(after.history[0]!.voided).toBe(true);
    for (const side of ['player', 'computer'] as const) {
      expect(after.fighters[side]).toEqual({ ...m.fighters[side], abilityRemaining: 0 });
    }
    const next = advanceMatch(after); expect(next.hand).toBe(0); expect(next.attempt).toBe(2); expect(next.preparationComplete).toBe(true);
    expect(legalActions(next, 'player').some(a => a.kind === 'rock')).toBe(true);
    expect(next.events.some(e => ['energy_spent', 'cards_spent', 'damage', 'round_completed'].includes(e.type))).toBe(false);
  });
  it('retry does not activate on a draw that the opponent later claims', () => {
    const d = setAbility(setAbility(series(), 'player', 'ability.retry'), 'computer', 'ability.claim_draw');
    const after = resolveAttempt(fixture(d, action('rock', 0, true)), action('rock', 0, true), 'claim');
    expect(after.history[0]).toMatchObject({ rawOutcome: 'draw', outcome: 'computer', voided: false }); expect(after.hand).toBe(1);
  });
  it.each(['ability.claim_draw', 'ability.insurance', 'ability.retry'] as const)('%s cannot affect a wave, but declared count is consumed', ability => {
    const m = fixture(setAbility(waves(), 'player', ability), action('wave')); m.fighters.computer.energy = 2;
    const after = resolveAttempt(m, action('rock', 0, true), ability);
    expect(after.history[0]).toMatchObject({ outcome: 'computer', voided: false }); expect(after.fighters.player.abilityRemaining).toBe(0);
  });
  it('gas actions never offer gesture abilities or boost variants', () => {
    const m = fixture(setAbility(waves(), 'player', 'ability.retry')); m.fighters.player.energy = 3;
    expect(legalActions(m, 'player').filter(a => ['wave', 'guard', 'charge'].includes(a.kind)).every(a => !a.ability && a.boost === 0)).toBe(true);
  });
  it('both sides can each void once, yielding two retries of the same effective hand', () => {
    const d = setAbility(setAbility(series(), 'player', 'ability.retry'), 'computer', 'ability.retry');
    let m = play(fixture(d), action('rock', 0, true), action('paper'));
    m = play(m, action('paper'), action('rock', 0, true));
    expect(m.hand).toBe(0); expect(m.attempt).toBe(2); expect(m.history.every(r => r.voided)).toBe(true);
    m = play(m, action('rock'), action('rock'));
    expect(m.hand).toBe(1); expect(m.attempt).toBe(3); expect(m.fighters.player.abilityRemaining + m.fighters.computer.abilityRemaining).toBe(0);
  });
  it('real retry advances RNG for a fresh CPU commitment without repeating preparation', () => {
    const d = setAbility(series(), 'player', 'ability.retry');
    const m = commitComputer(createMatch(d, 13));
    const losing = legalActions(m, 'player').find(a => a.ability && rawOutcome(a.kind, m.computerCommitment!.kind) === 'computer')!;
    const retry = resolveAttempt(m, losing, 'fresh');
    const next = commitComputer(advanceMatch(retry));
    expect(retry.history[0]!.voided).toBe(true); expect(next.rng).not.toEqual(m.rng);
    expect(next.events.filter(e => e.type === 'prepared')).toHaveLength(1); expect(next.events.filter(e => e.type === 'committed')).toHaveLength(2);
    expect(next.attempt).toBe(2); expect(next.hand).toBe(0);
  });
});

describe('targets, inventory, preparation and command invariants', () => {
  it('first two ends after two wins but three life does not', () => {
    let a = play(fixture(series()), action('paper'), action('rock')); a = play(a, action('paper'), action('rock'));
    expect(a.result).toMatchObject({ winner: 'player', reason: 'first_two' });
    let b = play(fixture(life()), action('paper'), action('rock')); b = play(b, action('paper'), action('rock'));
    expect(b.fighters.computer.life).toBe(1); expect(b.result).toBeNull();
    b = play(b, action('paper'), action('rock')); expect(b.result?.reason).toBe('knockout');
  });
  it('score runs all five hands despite a decisive lead; all draws terminate too', () => {
    let m = fixture(designWith('match.score_five'));
    for (let n = 1; n <= 5; n++) { m = play(m, action('paper'), action('rock')); expect(m.result !== null).toBe(n === 5); }
    expect(m.fighters.player.score).toBe(5);
    m = fixture(series()); for (let n = 0; n < 5; n++) m = play(m, action('rock'), action('rock'));
    expect(m.result).toMatchObject({ winner: 'draw', reason: 'cap' });
  });
  it('finite cards consume on draws; two each exhausts at six hands under a long cap', () => {
    const d = designWith('match.score_five', 'tempo.extend_cap', 'cards.finite', 'cards.two_each');
    let m = fixture(d);
    for (const kind of ['rock', 'rock', 'paper', 'paper', 'scissors', 'scissors'] as const) m = play(m, action(kind), action(kind));
    expect(m.fighters.player.cards).toEqual({ rock: 0, paper: 0, scissors: 0, lizard: 0, spock: 0 });
    m = advanceMatch(m); expect(m.result).toMatchObject({ winner: 'draw', reason: 'exhaustion' });
  });
  it('exchange uses two matching cards for one different card once per match, before commitment', () => {
    const d = designWith('match.score_five', 'cards.finite', 'cards.exchange_once');
    const m = createMatch(d, 2), exchanged = exchangeCards(m, 'player', 'rock', 'paper');
    expect(exchanged.fighters.player.cards).toMatchObject({ rock: 1, paper: 4 }); expect(exchanged.hand).toBe(0);
    expect(exchanged.fighters.player.exchangeRemaining).toBe(0); expect(m.fighters.player.cards.rock).toBe(3);
    expect(() => exchangeCards(exchanged, 'player', 'scissors', 'paper')).toThrow();
    expect(() => exchangeCards(commitComputer(m), 'player', 'rock', 'paper')).toThrow('准备阶段');
  });
  it('retry preserves a preparation exchange without reopening it', () => {
    const d = setAbility(designWith('match.score_five', 'cards.finite', 'cards.exchange_once'), 'player', 'ability.retry');
    let m = exchangeCards(createMatch(d, 1), 'player', 'rock', 'paper');
    m.phase = 'awaitingPlayer'; m.preparationComplete = true; m.computerCommitment = action('paper');
    const next = advanceMatch(resolveAttempt(m, action('rock', 0, true), 'once'));
    expect(next.fighters.player.cards.rock).toBe(1); expect(next.fighters.player.cards.paper).toBe(4);
    expect(() => exchangeCards(next, 'player', 'paper', 'rock')).toThrow('重打');
  });
  it('cooldown is symmetric, and a gas action clears it', () => {
    const d = installRule(waves(), 'action.cooldown'); let m = play(fixture(d), action('rock'), action('rock'));
    expect(legalActions(m, 'player').some(a => a.kind === 'rock')).toBe(false); expect(legalActions(m, 'computer').some(a => a.kind === 'rock')).toBe(false);
    m = play(m, action('guard'), action('guard')); expect(legalActions(m, 'player').some(a => a.kind === 'rock')).toBe(true);
  });
  it('one-sided exhaustion loses and card/cooldown deadlock ends explicitly', () => {
    const d = designWith('match.score_five', 'cards.finite', 'action.cooldown');
    const m = createMatch(d, 1); m.fighters.player.cards = { rock: 1, paper: 0, scissors: 0, lizard: 0, spock: 0 }; m.fighters.player.lastAction = 'rock';
    expect(commitComputer(m).result).toMatchObject({ winner: 'computer', reason: 'exhaustion' });
  });
  it('invalid actions reject atomically; repeated command IDs never resolve again', () => {
    const m = fixture(energy()), snapshot = structuredClone(m);
    expect(() => resolveAttempt(m, action('wave'), 'invalid')).toThrow(); expect(m).toEqual(snapshot);
    const after = resolveAttempt(m, action('rock'), 'one'); expect(resolveAttempt(after, action('paper'), 'one')).toBe(after);
    const next = commitComputer(advanceMatch(after)); expect(resolveAttempt(next, action('paper'), 'one')).toBe(next);
    expect(next.history).toHaveLength(1); expect(m).toEqual(snapshot);
  });
  it('a structured command binds the action to its match and attempt', () => {
    const m = fixture(series());
    expect(() => resolveAttempt(m, action('rock'), { matchId: 'another-match', attemptId: 1, commandId: 'a' })).toThrow('另一场');
    expect(() => resolveAttempt(m, action('rock'), { matchId: m.id, attemptId: 2, commandId: 'a' })).toThrow('过期');
    const command = { matchId: m.id, attemptId: 1, commandId: 'a' };
    const after = resolveAttempt(m, action('rock'), command), next = commitComputer(advanceMatch(after));
    expect(resolveAttempt(next, action('paper'), command)).toBe(next);
  });
});

describe('fair deterministic computer and replay', () => {
  it('creates a filtered, detached observation without pending commitment or RNG', () => {
    const m = commitComputer(createMatch(waves(), 4));
    const o = makeObservation(m);
    expect(Object.keys(o).sort()).toEqual(['design', 'hand', 'attempt', 'publicTrump', 'overtimeActive', 'effectiveCap', 'self', 'opponent', 'history', 'legal', 'opponentLegal'].sort());
    o.self.energy = 0; expect(m.fighters.computer.energy).toBe(1);
  });
  it('persists a complete choice in state; repeated commitment does not advance RNG', () => {
    const m = createMatch(waves(), 123), committed = commitComputer(m);
    expect(m.computerCommitment).toBeNull(); expect(committed.phase).toBe('awaitingPlayer');
    expect(legalActions(committed, 'computer')).toContainEqual(committed.computerCommitment);
    expect(commitComputer(committed)).toBe(committed);
    const restored = JSON.parse(JSON.stringify(committed)) as MatchState;
    expect(commitComputer(restored)).toEqual(committed);
  });
  it('single-hand RPS uses uniform families and a stable RNG sequence', () => {
    const observation = makeObservation(createMatch(createDesign(), 0));
    let rng = { algorithm: 'mulberry32-v1' as const, state: 129 };
    const counts: Record<string, number> = {};
    for (let i = 0; i < 1500; i++) { const result = chooseComputerAction(observation, rng); rng = result.rng; counts[result.action.kind] = (counts[result.action.kind] ?? 0) + 1; }
    for (const count of Object.values(counts)) expect(count).toBeGreaterThan(420);
    for (const count of Object.values(counts)) expect(count).toBeLessThan(580);
    expect(nextRandom({ algorithm: 'mulberry32-v1', state: 123 })).toEqual(nextRandom({ algorithm: 'mulberry32-v1', state: 123 }));
  });
  it('all new action families remain reachable to the computer despite gesture variants', () => {
    const m = createMatch(setAbility(waves(), 'computer', 'ability.insurance'), 0);
    m.fighters.computer.energy = 3; m.fighters.player.energy = 2;
    const o = makeObservation(m), seen = new Set<ActionKind>();
    for (let seed = 0; seed < 180; seed++) seen.add(chooseComputerAction(o, { algorithm: 'mulberry32-v1', state: seed }).action.kind);
    expect([...seen].sort()).toEqual(['charge', 'guard', 'paper', 'rock', 'scissors', 'wave']);
  });
  it('same design, seed, and commands produce identical complete match records', () => {
    function run() { let m = createMatch(setAbility(series(), 'computer', 'ability.retry'), 881); while (!m.result) { m = commitComputer(advanceMatch(m)); if (!m.result) m = resolveAttempt(m, legalActions(m, 'player')[m.hand % legalActions(m, 'player').length]!, `a-${m.attempt}`); } return m; }
    expect(run()).toEqual(run());
  });
  it('same-action rule comparison shows a reversal and stops at illegal actions', () => {
    const original = resolveAttempt(fixture(series(), action('scissors')), action('rock'), 'compare');
    const replay = compareReplay(original, installRule(series(), 'gesture.reverse'));
    expect(replay.rows[0]).toMatchObject({ original: 'player', compared: 'computer' });
    const originalFive = resolveAttempt(fixture(designWith('gesture.five'), action('paper')), action('lizard'), 'five');
    expect(compareReplay(originalFive, createDesign())).toMatchObject({ stopped: true, rows: [{ attempt: 1, hand: 1, original: 'player', compared: null, originalVoided: false, comparedVoided: null, note: expect.any(String) }] });
  });
  it('same-rule replay preserves public exchanges and outcomes', () => {
    const d = designWith('match.score_five', 'cards.finite', 'cards.exchange_once');
    let m = exchangeCards(createMatch(d, 9), 'player', 'rock', 'paper');
    m = play(m, action('paper'), action('rock'));
    const replay = compareReplay(m, d);
    expect(replay.stopped).toBe(false); expect(replay.match.fighters).toEqual(m.fighters);
  });
});

describe('generated legal game sequences', () => {
  it('bounded completion, nonnegative resources, one target, symmetric legal CPU and immutable inputs', () => {
    fc.assert(fc.property(fc.integer({ min: 0, max: 0xffffffff }), fc.integer({ min: 0, max: 4 }), (seed, preset) => {
      const presets = [series(), designWith('match.score_five', 'tempo.extend_cap', 'gesture.five', 'action.cooldown'), waves(), designWith('match.score_five', 'tempo.extend_cap', 'cards.finite', 'cards.two_each', 'action.cooldown'), installRule(waves(), 'cards.finite')];
      let d = setAbility(setAbility(presets[preset]!, 'player', 'ability.retry'), 'computer', 'ability.retry');
      let m = createMatch(d, seed), decisionRng = { algorithm: 'mulberry32-v1' as const, state: seed ^ 0x27d4eb2f };
      let steps = 0;
      while (!m.result && steps < d.cap + 3) {
        m = commitComputer(advanceMatch(m));
        if (m.result) break;
        expect(legalActions(m, 'computer')).toContainEqual(m.computerCommitment);
        const random = nextRandom(decisionRng); decisionRng = random.rng;
        const options = legalActions(m, 'player'); const selected = options[Math.floor(random.value * options.length)]!;
        const before = structuredClone(m), after = resolveAttempt(m, selected, `generated-${m.attempt}`);
        expect(m).toEqual(before); m = after; steps++;
        for (const f of Object.values(m.fighters)) {
          expect(f.life).toBeGreaterThanOrEqual(0); expect(f.energy).toBeGreaterThanOrEqual(0); expect(f.energy).toBeLessThanOrEqual(3); expect(f.abilityRemaining).toBeGreaterThanOrEqual(0);
          for (const count of Object.values(f.cards)) expect(count).toBeGreaterThanOrEqual(0);
        }
        expect(m.hand).toBe(m.history.filter(r => !r.voided).length);
        expect(m.history.filter(r => r.voided).length).toBeLessThanOrEqual(2);
      }
      expect(m.result).not.toBeNull(); expect(m.history.length).toBeLessThanOrEqual(d.cap + 2);
    }), { numRuns: 24 });
  }, 30000);
});
