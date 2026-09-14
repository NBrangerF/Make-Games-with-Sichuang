import { describe, expect, it } from 'vitest';
import { ABILITIES, advanceMatch, chooseComputerAction, compareReplay, compileDesign, createDesign, createMatch, installRule, isPassiveAbility, legalActions, makeObservation, previewRuleChange, removeRule, resolveAttempt, setAbility } from '../../src/core';
import type { AbilityId, Action, ActionKind, MatchState, RuleId } from '../../src/core';

const passiveIds = ['ability.scissors_ninja', 'ability.rock_guardian', 'ability.paper_trickster'] as const;
const a = (kind: ActionKind, boost: 0 | 1 | 2 = 0, ability = false): Action => ({ kind, boost, ability });
const health = (...rules: RuleId[]) => rules.reduce(installRule, installRule(createDesign(), 'life.knockout'));
const role = (ability: AbilityId, ...rules: RuleId[]) => setAbility(health(...rules), 'player', ability);
function pair(match: MatchState, player: Action, computer: Action) {
  const ready = advanceMatch(structuredClone(match));
  ready.phase = 'awaitingPlayer';ready.preparationComplete = true;ready.computerCommitment = computer;
  return resolveAttempt(ready, player, `passive-${ready.attempt}`);
}
const triggers = (m: MatchState) => m.history.at(-1)!.events.filter(e => e.type === 'passive_triggered');

describe('one equipped permanent player role', () => {
  it('declares twelve active powers and six passive roles explicitly', () => {
    expect(ABILITIES.filter(x => x.activation === 'active')).toHaveLength(12);
    expect(ABILITIES.filter(x => x.activation === 'passive')).toHaveLength(6);
    expect(ABILITIES.filter(x => x.activation === 'passive').map(x => x.id)).toEqual(expect.arrayContaining([...passiveIds]));
    for (const id of passiveIds) expect(isPassiveAbility(id)).toBe(true);
    expect(isPassiveAbility('ability.retry')).toBe(false);expect(isPassiveAbility(null)).toBe(false);
  });

  it.each(passiveIds)('%s has no charge, no activation variant and leaves all five gestures available', id => {
    const m = createMatch(role(id, 'gesture.five', 'energy.gesture_boost', 'energy.wager'), 1);
    expect(m.fighters.player.abilityRemaining).toBe(0);expect(m.design.abilities.computer).toBeNull();
    expect(new Set(legalActions(m, 'player').map(x => x.kind))).toEqual(new Set(['rock', 'scissors', 'paper', 'lizard', 'spock']));
    expect(legalActions(m, 'player').every(x => !x.ability)).toBe(true);
    expect(() => pair(m, a('rock', 0, true), a('rock'))).toThrow(/当前不能使用/);
    m.fighters.player.abilityRemaining = 1; // Even stale counters cannot create active variants.
    expect(legalActions(m, 'player').every(x => !x.ability)).toBe(true);
  });

  it('allows experiments without health, rejects CPU equipment and replaces the previous role or active power', () => {
    for (const id of passiveIds) {
      expect(previewRuleChange(createDesign(), { type: 'ability', side: 'player', ability: id }).valid).toBe(true);
      expect(previewRuleChange(installRule(createDesign(), 'match.first_two'), { type: 'ability', side: 'player', ability: id }).valid).toBe(true);
      expect(() => setAbility(health(), 'computer', id)).toThrow(/仅属于玩家/);
      expect(removeRule(role(id), 'life.knockout').abilities.player).toBe(id);
    }
    const passive = setAbility(role('ability.retry'), 'player', 'ability.scissors_ninja');
    expect(passive.abilities.player).toBe('ability.scissors_ninja');
    const active = setAbility(passive, 'player', 'ability.insurance');
    expect(createMatch(active, 2).fighters.player.abilityRemaining).toBe(1);
    expect(legalActions(createMatch(active, 2), 'player').some(x => x.ability)).toBe(true);
  });

  it.each([
    ['ability.scissors_ninja', 'scissors', 'paper'],
    ['ability.rock_guardian', 'rock', 'scissors'],
    ['ability.paper_trickster', 'paper', 'rock'],
  ] as const)('a void CPU retry commits no %s effect', (id, playerKind, cpuKind) => {
    const d = setAbility(role(id, 'cards.finite', 'energy.gesture_boost'), 'computer', 'ability.retry');
    const m = createMatch(d, 3), n = pair(m, a(playerKind, 1), a(cpuKind, 0, true));
    expect(n.hand).toBe(0);expect(n.history.at(-1)?.voided).toBe(true);
    expect(n.fighters.player).toEqual(m.fighters.player);
    expect(n.fighters.computer).toEqual({ ...m.fighters.computer, abilityRemaining: 0 });
    expect(triggers(n)).toEqual([]);
  });
});

describe('scissors ninja base damage', () => {
  it('automatically gives scissors two base damage without changing the winner or other gestures', () => {
    const d = role('ability.scissors_ninja', 'gesture.five');
    const scissors = pair(createMatch(d, 4), a('scissors'), a('paper'));
    expect(scissors.history.at(-1)).toMatchObject({ rawOutcome: 'player', outcome: 'player' });
    expect(scissors.fighters.computer.life).toBe(1);
    expect(triggers(scissors)).toMatchObject([{ side: 'player', ability: 'ability.scissors_ninja', action: 'scissors', amount: 1 }]);
    expect(pair(createMatch(d, 5), a('rock'), a('scissors')).fighters.computer.life).toBe(2);
    expect(pair(createMatch(d, 6), a('scissors'), a('lizard')).fighters.computer.life).toBe(1);
    const loss = pair(createMatch(d, 7), a('scissors'), a('spock'));
    expect(loss.fighters.player.life).toBe(2);expect(triggers(loss)).toEqual([]);
  });

  it('adds boost after base, takes max with desperation, and attributes no duplicate or overkill effect', () => {
    const d = role('ability.scissors_ninja', 'energy.gesture_boost', 'life.desperation');
    const full = pair(createMatch(d, 8), a('scissors', 1), a('paper'));
    expect(full.fighters.computer.life).toBe(0);expect(full.fighters.player.energy).toBe(0);
    expect(triggers(full)[0]?.amount).toBe(1);
    const desperate = createMatch(d, 9);desperate.fighters.player.life = 1;
    const n = pair(desperate, a('scissors'), a('paper'));
    expect(n.fighters.computer.life).toBe(1);expect(triggers(n)).toEqual([]);
    const overkill = createMatch(d, 10);overkill.fighters.computer.life = 1;
    const capped = pair(overkill, a('scissors'), a('paper'));
    expect(capped.fighters.computer.life).toBe(0);expect(triggers(capped)).toEqual([]);
  });

  it('respects the one-damage shield and boosted shield breaking', () => {
    const d = role('ability.scissors_ninja', 'energy.gesture_boost', 'combo.three_styles', 'shield.piercing_boost');
    const m = createMatch(d, 11);m.fighters.computer.shield = 1;
    const absorbed = pair(m, a('scissors'), a('paper'));
    expect(absorbed.fighters.computer).toMatchObject({ life: 2, shield: 0 });
    expect(triggers(absorbed)[0]?.amount).toBe(1);
    const pierced = pair(m, a('scissors', 1), a('paper'));
    expect(pierced.fighters.computer).toMatchObject({ life: 0, shield: 0 });
    expect(pierced.history.at(-1)?.events.some(e => e.type === 'shield_broken')).toBe(true);
    expect(triggers(pierced)[0]?.amount).toBe(1);
  });
});

describe('rock guardian delayed shield', () => {
  it('wins with rock, stores after damage, protects the next hand, and can trigger again', () => {
    let m = pair(createMatch(role('ability.rock_guardian'), 12), a('rock'), a('scissors'));
    expect(m.fighters.player).toMatchObject({ life: 3, shield: 1, abilityRemaining: 0 });
    const handEvents = m.history.at(-1)!.events;
    expect(handEvents.findIndex(e => e.type === 'shield_gained')).toBeGreaterThan(handEvents.findIndex(e => e.type === 'damage'));
    expect(triggers(m)).toMatchObject([{ ability: 'ability.rock_guardian', amount: 1 }]);
    m = pair(m, a('scissors'), a('rock'));
    expect(m.fighters.player).toMatchObject({ life: 3, shield: 0 });expect(triggers(m)).toEqual([]);
    m = pair(m, a('rock'), a('scissors'));
    expect(m.fighters.player.shield).toBe(1);expect(triggers(m)).toHaveLength(1);
  });

  it('does not stack, fire on a draw or other gesture, or double-credit simultaneous shared shielding', () => {
    const d = role('ability.rock_guardian', 'combo.three_styles');
    const m = createMatch(d, 13);m.fighters.player.shield = 1;
    const full = pair(m, a('rock'), a('scissors'));
    expect(full.fighters.player.shield).toBe(1);expect(triggers(full)).toEqual([]);
    expect(triggers(pair(createMatch(d, 14), a('rock'), a('rock')))).toEqual([]);
    expect(pair(createMatch(d, 15), a('paper'), a('rock')).fighters.player.shield).toBe(0);
    const shared = createMatch(d, 16);shared.fighters.player.gestureChain = ['scissors', 'paper'];
    const combined = pair(shared, a('rock'), a('scissors'));
    expect(combined.fighters.player.shield).toBe(1);expect(triggers(combined)).toEqual([]);
    expect(combined.history.at(-1)?.events.filter(e => e.type === 'shield_gained')).toHaveLength(1);
  });

  it('is a valid shield source and replacing the last source preserves dormant shield piercing', () => {
    const d = installRule(role('ability.rock_guardian', 'energy.gesture_boost'), 'shield.piercing_boost');
    expect(compileDesign(d).shield).toBe(true);
    expect(setAbility(d, 'player', 'ability.scissors_ninja').rules).toContain('shield.piercing_boost');
    const withShared = installRule(d, 'combo.three_styles');
    expect(setAbility(withShared, 'player', 'ability.paper_trickster').rules).toContain('shield.piercing_boost');
  });
});

describe('paper trickster final-draw damage', () => {
  it('repeats automatically on paper-paper, retains the draw and can knock out the opponent', () => {
    let m = createMatch(role('ability.paper_trickster', 'energy.gesture_boost', 'cards.finite', 'cards.draw_refund'), 17);
    for (let i = 0; i < 3; i++) {
      m = pair(m, a('paper'), a('paper'));
      expect(m.history.at(-1)).toMatchObject({ rawOutcome: 'draw', outcome: 'draw' });
      expect(triggers(m)).toMatchObject([{ side: 'player', ability: 'ability.paper_trickster', amount: 1 }]);
    }
    expect(m.fighters.player).toMatchObject({ life: 3, energy: 3, abilityRemaining: 0, cards: { paper: 3 } });
    expect(m.fighters.computer.life).toBe(0);expect(m.result).toMatchObject({ reason: 'knockout', winner: 'player' });
  });

  it('does not fire for other draws, ordinary paper wins or a claim that changes the final result', () => {
    const d = role('ability.paper_trickster');
    expect(triggers(pair(createMatch(d, 18), a('rock'), a('rock')))).toEqual([]);
    const won = pair(createMatch(d, 19), a('paper'), a('rock'));
    expect(won.fighters.computer.life).toBe(2);expect(triggers(won)).toEqual([]);
    const claimed = setAbility(d, 'computer', 'ability.claim_draw');
    const n = pair(createMatch(claimed, 20), a('paper'), a('paper', 0, true));
    expect(n.history.at(-1)?.outcome).toBe('computer');expect(n.fighters.computer.life).toBe(3);expect(triggers(n)).toEqual([]);
  });

  it('merges with draw damage before each side absorbs one shield', () => {
    const m = createMatch(role('ability.paper_trickster', 'life.draw_damage', 'combo.three_styles'), 21);
    m.fighters.player.shield = 1;m.fighters.computer.shield = 1;
    const n = pair(m, a('paper'), a('paper'));
    expect(n.fighters.player).toMatchObject({ life: 3, shield: 0 });
    expect(n.fighters.computer).toMatchObject({ life: 2, shield: 0 });
    expect(n.history.at(-1)?.events.filter(e => e.type === 'damage' && e.side === 'computer')).toMatchObject([{ amount: 1 }]);
    expect(n.history.at(-1)?.events.filter(e => e.type === 'shield_absorbed')).toHaveLength(2);
    expect(triggers(n)[0]?.amount).toBe(1);
    const blocked = createMatch(role('ability.paper_trickster', 'combo.three_styles'), 22);blocked.fighters.computer.shield = 1;
    const noLoss = pair(blocked, a('paper'), a('paper'));
    expect(noLoss.fighters.computer.life).toBe(3);expect(noLoss.fighters.computer.shield).toBe(0);expect(triggers(noLoss)).toEqual([]);
  });

  it('uses final life for simultaneous knockout and does not credit excess damage beyond zero', () => {
    const m = createMatch(role('ability.paper_trickster', 'life.draw_damage'), 23);
    m.fighters.player.life = 1;m.fighters.computer.life = 2;
    const n = pair(m, a('paper'), a('paper'));
    expect(n.fighters.player.life).toBe(0);expect(n.fighters.computer.life).toBe(0);
    expect(n.result).toMatchObject({ reason: 'knockout', winner: 'draw' });expect(triggers(n)[0]?.amount).toBe(1);
    m.fighters.computer.life = 1;
    const excess = pair(m, a('paper'), a('paper'));
    expect(excess.result?.winner).toBe('draw');expect(triggers(excess)).toEqual([]);
  });
});

describe('public AI and replay share passive resolution', () => {
  it.each(passiveIds)('%s simulates legal public actions and replays its actual state exactly', id => {
    const d = role(id, 'gesture.five', 'energy.gesture_boost', 'cards.finite');
    const m = pair(createMatch(d, 24), a(id === 'ability.scissors_ninja' ? 'scissors' : id === 'ability.rock_guardian' ? 'rock' : 'paper'), a(id === 'ability.scissors_ninja' ? 'paper' : id === 'ability.rock_guardian' ? 'scissors' : 'paper'));
    const replay = compareReplay(m, d);
    expect(replay.stopped).toBe(false);expect(replay.match.fighters).toEqual(m.fighters);
    const obs = makeObservation(m), original = structuredClone(obs), rng = { algorithm: 'mulberry32-v1' as const, state: 100 };
    const choice = chooseComputerAction(obs, rng);
    expect(choice).toEqual(chooseComputerAction(obs, rng));expect(obs.legal).toContainEqual(choice.action);
    expect(choice.action.ability).toBe(false);expect(obs).toEqual(original);expect(rng.state).toBe(100);
  });
});
