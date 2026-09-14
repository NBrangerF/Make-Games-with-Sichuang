import { prepareComputerForge, prepareCards, cardActions, normalizeCardAction, combatCards, reconcileCards, cardMode } from '../cards/engine';
import { prepareExperiments, declarationsNeeded, enforcePlan, computerExperiment, validateExperiment, loanCredit, resolveExperiments, ensureSealedAction, publicExperiment, sealExperimentAction } from '../experiments/engine';
import { ACTION_LABELS, compileDesign, isChallengeGoal, isLifeGoal, isPassiveAbility, isScoreGoal, RuleError } from './design';
import type { AbilityId, Action, ActionKind, AttemptRecord, CommandIdentity, CompiledDesign, Design, FighterState, GameEvent, Gesture, MatchState, Outcome, PublicObservation, ReplayComparison, RngState, Side } from './types';

const SIDES: Side[] = ['player', 'computer'];
const silentResolutions = new WeakSet<MatchState>();
const GESTURES: Gesture[] = ['rock', 'scissors', 'paper', 'lizard', 'spock'];
const BEATS: Record<Gesture, Gesture[]> = { rock: ['scissors', 'lizard'], scissors: ['paper', 'lizard'], paper: ['rock', 'spock'], lizard: ['paper', 'spock'], spock: ['rock', 'scissors'] };
export const isGesture = (kind: ActionKind): kind is Gesture => GESTURES.includes(kind as Gesture);
const clone = <T,>(value: T): T => structuredClone(value);
const other = (side: Side): Side => side === 'player' ? 'computer' : 'player';
const winner = (number: number): Outcome => number > 0 ? 'player' : number < 0 ? 'computer' : 'draw';
export function nextRandom(rng: RngState): { value: number; rng: RngState } {
  const state = (rng.state + 0x6d2b79f5) >>> 0;
  let t = state;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return { value: ((t ^ (t >>> 14)) >>> 0) / 4294967296, rng: { algorithm: 'mulberry32-v1', state } };
}
/** Full prepayment, including an optional gesture wager. Legality is checked separately. */
export const actionCost = (action: Action, compiled?: CompiledDesign): number => action.kind === 'piercing_wave' ? 3 : action.kind === 'wave' ? compiled?.waveCost ?? 2 : action.kind === 'guard' ? compiled?.guardCost ?? 0 : action.boost + (isGesture(action.kind) && action.wager ? 1 : 0);
/** Deterministic discard forecast for charge trade, also used by the actual transaction. */
export function chargeTradeCard(compiled: CompiledDesign, fighter: FighterState): Gesture | null {
  if (!compiled.chargeTrade) return null;
  let selected: Gesture | null = null;
  for (const gesture of compiled.gestures) if (fighter.cards[gesture] > 0 && (selected === null || fighter.cards[gesture] > fighter.cards[selected])) selected = gesture;
  return selected;
}
export function createMatch(design: Design, seed: number): MatchState {
  const c = compileDesign(design);
  if (!Number.isInteger(seed) || seed < 0 || seed > 0xffffffff) throw new RuleError('种子需要是 0 到 4294967295 之间的整数。');
  const fighter = (): FighterState => ({ life: c.life ? 3 : 0, energy: c.initialEnergy, wins: 0, score: 0, draws: 0, collected: [], winStreak: 0, abilityRemaining: 0, cards: Object.fromEntries(GESTURES.map(g => [g, c.finiteCards && c.gestures.includes(g) ? c.cardsPerGesture : 0])) as Record<Gesture, number>, exchangeRemaining: c.exchange ? 1 : 0, lastAction: null, energySpent: 0, shield: 0, gestureChain: [] });
  const fighters = { player: fighter(), computer: fighter() };
  for (const side of SIDES) fighters[side].abilityRemaining = c.abilities[side] && !isPassiveAbility(c.abilities[side]) ? 1 : 0;
  const match: MatchState = { schemaVersion: 1, id: `match-${c.hash}-${seed}`, design: clone(design), designHash: c.hash, strategyVersion: 'public-mix-v2', seed, rng: { algorithm: 'mulberry32-v1', state: seed >>> 0 }, phase: 'preparing', hand: 0, attempt: 1, preparationComplete: false, publicTrump: null, foreseenHand: null, publicComputerIntent: null, overtimeActive: false, effectiveCap: c.cap, fighters, computerCommitment: null, history: [], events: [], processedCommands: [], result: null };
  preparePublic(match);return match;
}
function availableActions(c: CompiledDesign, fighter: FighterState, side: Side): Action[] {
  const result: Action[] = [];
  const activeAbility = c.abilities[side] && !isPassiveAbility(c.abilities[side]) && fighter.abilityRemaining > 0;
  for (const kind of c.actions) {
    if (isGesture(kind)) {
      if (c.finiteCards && fighter.cards[kind] <= 0) continue;
      if (c.cooldown && fighter.lastAction === kind) continue;
      const boosts = ([0, 1, 2] as const).filter(boost => boost <= c.maxBoost && boost <= fighter.energy);
      for (const boost of boosts) {
        result.push({ kind, boost, ability: false });
        if (activeAbility) result.push({ kind, boost, ability: true });
        if (c.wager && fighter.energy >= boost + 1) {
          result.push({ kind, boost, ability: false, wager: true });
          if (activeAbility) result.push({ kind, boost, ability: true, wager: true });
        }
      }
    } else {
      if (c.specialCooldown && fighter.lastAction === kind) continue;
      if (kind === 'charge' && c.chargeTrade && chargeTradeCard(c, fighter) === null) continue;
      const action: Action = { kind, boost: 0, ability: false };
      if (fighter.energy >= actionCost(action, c)) result.push(action);
    }
  }
  return result;
}
export function legalActions(match: MatchState, side: Side, credit = 0): Action[] {
  if (match.result) return [];
  const c=compileDesign(match.design);
  const signal=match.experiment?.fighters[side].signal;
  const reserve=Number(!!signal?.pledge&&match.design.rules.includes('experiment.pledge'))+Number(signal?.promise==='bound'&&match.design.rules.includes('experiment.promise'));
  return enforcePlan(match,side,cardActions(match.fighters[side],availableActions(c,{...match.fighters[side],energy:Math.max(0,match.fighters[side].energy+credit-reserve)},side)),c);
}
const actionEqual = (a: Action, b: Action): boolean => a.kind === b.kind && a.boost === b.boost && a.ability === b.ability && (a.wager ?? false) === (b.wager ?? false) && (!b.cardId || a.cardId === b.cardId);
function ensureAction(match: MatchState, side: Side, action: Action): void {
  const c=compileDesign(match.design);
  validateExperiment(match,side,action,c,actionCost(action,c));
  const credit=loanCredit(match,side,action,c);
  const valid=legalActions(match,side,credit);
  if (!valid.some(candidate => actionEqual(candidate, action))) throw new RuleError(`${side === 'player' ? '你' : '电脑'}当前不能使用这项行动：请检查库存、冷却、气与能力次数。`);
}
export function rawOutcome(player: ActionKind, computer: ActionKind, reverse = false, publicTrump: Gesture | null = null): Outcome {
  if (player === computer) return 'draw';
  if (isGesture(player) && isGesture(computer)) {
    if (player === publicTrump) return 'player';
    if (computer === publicTrump) return 'computer';
    const won = BEATS[player].includes(computer);
    return (reverse ? !won : won) ? 'player' : 'computer';
  }
  const playerWave = player === 'wave' || player === 'piercing_wave';
  const computerWave = computer === 'wave' || computer === 'piercing_wave';
  if (playerWave && computerWave) return 'draw';
  if (player === 'piercing_wave') return 'player';
  if (computer === 'piercing_wave') return 'computer';
  if (player === 'wave') return computer === 'guard' ? 'draw' : 'player';
  if (computer === 'wave') return player === 'guard' ? 'draw' : 'computer';
  if (isGesture(player)) return 'player';
  if (isGesture(computer)) return 'computer';
  return 'draw';
}
function event(match: MatchState, type: GameEvent['type'], text: string, extra: Partial<GameEvent> = {}): void {
  // Hypothetical AI transactions need the same state reducer, but no presentation log.
  if (silentResolutions.has(match)) return;
  match.events.push({ id: `${match.id}:e${match.events.length + 1}`, type, attempt: match.attempt, hand: match.hand + 1, text, ...extra });
}
/** Public, deterministic preparation happens before either side commits, never on a void retry. */
function preparePublic(match: MatchState): void {
  if (match.preparationComplete || match.result) return;
  const c = compileDesign(match.design);
  prepareCards(match,c);
  prepareExperiments(match,c);
  if (c.publicTrump) {
    const trump = c.gestures[match.hand % c.gestures.length]!;
    if (match.publicTrump !== trump) {
      match.publicTrump = trump;
      event(match, 'trump_announced', `本手公开王牌：${ACTION_LABELS[trump]}。`, { action: trump });
    }
  }
  if (c.dealerRefill && !availableActions(c, match.fighters.computer, 'computer').some(action => isGesture(action.kind))) {
    for (const gesture of c.gestures) match.fighters.computer.cards[gesture] = c.cardsPerGesture;
    event(match, 'dealer_refill', `电脑没有可用手势，公开补回每种 ${c.cardsPerGesture} 张；你的库存不变。`, { side: 'computer', amount: c.cardsPerGesture });
  }
}
function challengeAtLimit(match: MatchState): Outcome {
  const p = match.fighters.player;
  const success = match.design.goal === 'draw_three' ? p.draws >= 3
    : match.design.goal === 'streak_two' ? p.winStreak >= 2
    : match.design.goal === 'efficient_wins' ? p.wins >= 2 && p.energySpent <= 3
    : match.design.goal === 'survive' && p.life > 0;
  return success ? 'player' : 'computer';
}
function comparison(match: MatchState): Outcome {
  const { player: p, computer: cpu } = match.fighters;
  const goal = match.design.goal;
  if (isChallengeGoal(goal)) return challengeAtLimit(match);
  if (goal === 'knockout') return winner(p.life - cpu.life);
  if (goal === 'fewest_points') return winner(cpu.score - p.score);
  if (isScoreGoal(goal)) return winner(p.score - cpu.score);
  if (goal === 'collect_three') return winner(p.collected.length - cpu.collected.length);
  return winner(p.wins - cpu.wins);
}
function finish(match: MatchState, outcome: Outcome, reason: NonNullable<MatchState['result']>['reason']): void {
  const reasonText = { single: '这一手已完成', first_two: '先获得两次胜利', knockout: '生命归零', cap: '到达手数上限', exhaustion: '没有可用行动', goal: '目标条件已触发', budget: '累计实际气费超过三气', overtime: '有界加时结束' }[reason];
  const resultText = isChallengeGoal(match.design.goal) ? outcome === 'player' ? '挑战达成' : '挑战未达成' : outcome === 'draw' ? '本局平局' : outcome === 'player' ? '你赢得本局' : '电脑赢得本局';
  match.result = { winner: outcome, reason, text: `${reasonText}，${resultText}。` };
  match.phase = 'finished';
  if(match.experiment){
    const pending=SIDES.some(side=>match.experiment!.fighters[side].queue||match.experiment!.fighters[side].delayed);
    for(const side of SIDES){match.experiment.fighters[side].queue=null;match.experiment.fighters[side].delayed=0;}
    match.experiment.sealedPlayer=null;
    if(pending)event(match,'experiment','本场结束，尚未执行的封存计划与预告攻击清空，不额外增加交锋。',{hand:match.hand});
  }
  event(match, 'match_finished', match.result.text, { hand: match.hand });
}
function checkTerminal(match: MatchState, c = compileDesign(match.design)): void {
  if (match.result) return;
  const { goal, cap } = c;
  const { player: p, computer: cpu } = match.fighters;
  if (isLifeGoal(goal) && (p.life === 0 || cpu.life === 0)) { finish(match, comparison(match), 'knockout'); return; }
  // Current health battles have no hidden turn limit. Exhaustion is checked at preparation.
  if (c.healthOnly) return;
  if (goal === 'efficient_wins' && p.energySpent > 3) { finish(match, 'computer', 'budget'); return; }
  if (goal === 'draw_three' && p.draws >= 3 || goal === 'streak_two' && p.winStreak >= 2) { finish(match, 'player', 'goal'); return; }
  if (goal === 'collect_three' && (p.collected.length >= 3 || cpu.collected.length >= 3)) { finish(match, comparison(match), 'goal'); return; }
  if (goal === 'first_five_points' && (p.score >= 5 || cpu.score >= 5)) { finish(match, comparison(match), 'goal'); return; }
  if (match.overtimeActive) {
    if (comparison(match) !== 'draw' || match.hand >= match.effectiveCap) finish(match, comparison(match), 'overtime');
    return;
  }
  if (goal === 'first_two' && (p.wins >= 2 || cpu.wins >= 2)) { finish(match, comparison(match), 'first_two'); return; }
  if (match.hand >= cap) {
    if (c.boundedOvertime && comparison(match) === 'draw') {
      match.overtimeActive = true;match.effectiveCap = cap + 3;
      event(match, 'overtime_started', `基础 ${cap} 手仍同分，最多再打三手；领先立即结束。`, { hand: match.hand, amount: 3 });
    } else finish(match, comparison(match), goal === 'single' ? 'single' : 'cap');
  }
}
function canExchangeToUnlock(match: MatchState, side: Side): boolean {
  const c = compileDesign(match.design), f = match.fighters[side];
  return c.exchange && f.exchangeRemaining > 0 && !match.preparationComplete && c.gestures.some(g => f.cards[g] >= 2) && c.gestures.some(g => !c.cooldown || g !== f.lastAction);
}
function checkExhaustion(match: MatchState, allowExchange = false): void {
  const p = legalActions(match, 'player').length > 0 || (allowExchange && canExchangeToUnlock(match, 'player'));
  const cpu = legalActions(match, 'computer').length > 0 || (allowExchange && canExchangeToUnlock(match, 'computer'));
  if (!p && !cpu) finish(match, comparison(match), 'exhaustion');
  else if (!p) finish(match, 'computer', 'exhaustion');
  else if (!cpu) finish(match, isChallengeGoal(match.design.goal) ? challengeAtLimit(match) : 'player', 'exhaustion');
}
export function exchangeCards(match: MatchState, side: Side, from: Gesture, to: Gesture): MatchState {
  const c = compileDesign(match.design), f = match.fighters[side];
  if (match.phase !== 'preparing' || match.preparationComplete || match.result) throw new RuleError('交换只在新有效手的公开准备阶段进行；重打不再开放。');
  if (!c.exchange || f.exchangeRemaining < 1 || from === to || !c.gestures.includes(from) || !c.gestures.includes(to) || f.cards[from] < 2) throw new RuleError('交换需要两张相同手牌，以及一次剩余交换机会，目标必须是另一种现有手势。');
  const next = clone(match);
  next.fighters[side].cards[from] -= 2;
  next.fighters[side].cards[to]++;
  next.fighters[side].exchangeRemaining--;
  reconcileCards(next.fighters[side]);
  event(next, 'exchange', `${side === 'player' ? '你' : '电脑'}用两张${ACTION_LABELS[from]}换一张${ACTION_LABELS[to]}。`, { side, from, action: to, amount: 1 });
  return next;
}
function observationAction(action: Action): Action {
  const visible = clone(action);
  if (visible.experiment) delete visible.experiment.next;
  return visible;
}
/** Creates an allowlisted observation. No function here can inspect UI choice state. */
export function makeObservation(match: MatchState): PublicObservation {
  const visibleOpponent = match.experiment ? { ...match, experiment: { ...match.experiment, fighters: { ...match.experiment.fighters, player: { ...match.experiment.fighters.player, queue: null } } } } : match;
  return clone({ design: match.design, hand: match.hand, attempt: match.attempt, publicTrump: match.publicTrump, overtimeActive: match.overtimeActive, effectiveCap: match.effectiveCap, self: match.fighters.computer, opponent: {...match.fighters.player,cardZone:undefined,...(cardMode(match)?{cards:Object.fromEntries(GESTURES.map(g=>[g,0])) as FighterState['cards']}:{})}, history: match.history.map(({ player, computer, rawOutcome: raw, outcome, voided }) => ({ player: observationAction(player), computer: observationAction(computer), rawOutcome: raw, outcome, voided })), legal: legalActions(match, 'computer'), opponentLegal: cardMode(match) ? availableActions(compileDesign(match.design),{...match.fighters.player,cards:Object.fromEntries(GESTURES.map(g=>[g,1])) as FighterState['cards']},'player') : legalActions(visibleOpponent, 'player') });
}
function resolvePair(match: MatchState, player: Action, computer: Action, c = compileDesign(match.design), recordAttempt = true): MatchState {
  const next: MatchState = recordAttempt ? clone(match) : { ...match, fighters: clone(match.fighters), events: [], history: [] };
  if (!recordAttempt) silentResolutions.add(next);
  if(next.experiment)next.experiment=clone(next.experiment);
  const experimentBefore=recordAttempt&&next.experiment?clone(next.experiment):undefined;
  const eventStart = next.events.length;
  const before = recordAttempt ? clone(next.fighters) : match.fighters;
  const raw = rawOutcome(player.kind, computer.kind, c.reverse, next.publicTrump);
  let outcome = raw;
  const gestures = isGesture(player.kind) && isGesture(computer.kind);
  const actions = { player, computer };
  const declared = (side: Side, ability: NonNullable<CompiledDesign['abilities']['player']>) => actions[side].ability && c.abilities[side] === ability;
  const retry = gestures && SIDES.some(side => declared(side, 'ability.retry') && raw === other(side));
  event(next, 'revealed', `你出${ACTION_LABELS[player.kind]}，电脑出${ACTION_LABELS[computer.kind]}。`);
  for (const side of SIDES) {
    const action = side === 'player' ? player : computer;
    if (action.ability && c.abilities[side] && !isPassiveAbility(c.abilities[side]) && !(retry && declared(side, 'ability.foresight'))) {
      next.fighters[side].abilityRemaining--;
      event(next, 'ability_used', `${side === 'player' ? '你' : '电脑'}发动了能力，本局次数已消耗。`, { side, ability: c.abilities[side]! });
    }
  }
  if (retry) {
    event(next, 'retry', '再搏触发：这次尝试作废；费用、库存与有效手数不提交。');
  } else {
    const pendingShields: Record<Side, string[]> = { player: [], computer: [] };
    const gainShield = (side: Side, reason: string, ability?: GameEvent['ability']) => {
      const f = next.fighters[side], gained = f.shield === 0 ? 1 : 0;
      f.shield = 1;
      event(next, 'shield_gained', `${side === 'player' ? '你' : '电脑'}${reason}，获得 ${gained} 层盾（最多一层）。`, { side, amount: gained, ...(ability ? { ability } : {}) });
    };
    const gainEnergy = (side: Side, requested: number, type: GameEvent['type'], reason: string) => {
      const f = next.fighters[side], gained = Math.min(c.energyCap - f.energy, requested);
      f.energy += gained;
      event(next, type, `${side === 'player' ? '你' : '电脑'}${reason}，获得 ${gained} 气。`, { side, amount: gained });
      if (c.overflowShield && requested > gained) {
        pendingShields[side].push('溢气化盾');
        event(next, 'energy_overflow', `${side === 'player' ? '你' : '电脑'}的 ${requested - gained} 气超过容量，本手伤害后化盾。`, { side, amount: requested - gained });
      }
    };
    const applyDamage = (side: Side, requested: number, breakShield = false, passive?: { ability: AbilityId; extra: number }) => {
      const f = next.fighters[side];
      // Attribute only additional life actually lost. Use the same starting shield,
      // life cap and lethal protection without the passive's extra damage.
      let baseline = Math.max(0, requested - (passive?.extra ?? 0) - (f.shield && !breakShield ? 1 : 0));
      if (baseline > 0 && baseline >= f.life && f.life > 0 && declared(side, 'ability.last_stand')) baseline = Math.max(0, f.life - 1);
      const baselineActual = Math.min(f.life, baseline);
      let damage = requested;
      if (f.shield && damage > 0) {
        f.shield = 0;
        if (breakShield) event(next, 'shield_broken', `${side === 'player' ? '你' : '电脑'}的护盾被强化手势击碎，不能减免本次伤害。`, { side, amount: 1 });
        else { damage--;event(next, 'shield_absorbed', `${side === 'player' ? '你' : '电脑'}的护盾吸收一伤后消耗。`, { side, amount: 1 }); }
      }
      if (damage > 0 && damage >= f.life && f.life > 0 && declared(side, 'ability.last_stand')) {
        const prevented = Math.min(f.life, damage) - Math.max(0, f.life - 1);
        damage = Math.max(0, f.life - 1);
        event(next, 'last_stand_triggered', `${side === 'player' ? '你' : '电脑'}以续命挡住致命伤害，保留一生命。`, { side, amount: prevented, ability: 'ability.last_stand' });
      }
      const actual = Math.min(f.life, damage);f.life -= actual;
      event(next, 'damage', `${side === 'player' ? '你' : '电脑'}${outcome === 'draw' ? '因最终平局' : ''}失去 ${actual} 生命。`, { side, amount: actual });
      if (passive && actual > baselineActual) event(next, 'passive_triggered', `${passive.ability === 'ability.scissors_ninja' ? '剪刀忍者' : '纸影术士'}常驻能力生效，对手实际多失去 ${actual - baselineActual} 生命。`, { side: 'player', ability: passive.ability, action: player.kind, amount: actual - baselineActual });
    };
    for (const side of SIDES) if (declared(side, 'ability.aegis')) gainShield(side, '发动护身', 'ability.aegis');
    if (gestures) {
      if (raw === 'draw') {
        const pClaim = player.ability && c.abilities.player === 'ability.claim_draw';
        const cClaim = computer.ability && c.abilities.computer === 'ability.claim_draw';
        if (pClaim !== cClaim) outcome = pClaim ? 'player' : 'computer';
      } else {
        const loser = other(raw);
        if ((loser === 'player' ? player : computer).ability && c.abilities[loser] === 'ability.insurance') outcome = 'draw';
      }
    }
    const expansion=resolveExperiments(next,c,actions,outcome,{energy:(s,n,reason)=>gainEnergy(s,n,'experiment',reason),shield:(s,reason)=>gainShield(s,reason),damage:(s,n)=>applyDamage(s,n)},eventStart);
    const cardResolution=combatCards(next,c,actions,outcome,{shield:(s,reason)=>gainShield(s,reason),energy:(s,n)=>gainEnergy(s,n,'card_effect','卡牌效果')});
    for (const side of SIDES) {
      const action = side === 'player' ? player : computer, f = next.fighters[side], cost = actionCost(action, c);
      f.energy -= cost;
      f.energySpent += cost;
      if (cost) event(next, 'energy_spent', `${side === 'player' ? '你' : '电脑'}支付 ${cost} 气。`, { side, amount: cost, action: action.kind });
      if (isGesture(action.kind) && c.finiteCards) {
        f.cards[action.kind]--;
        event(next, 'cards_spent', `${ACTION_LABELS[action.kind]}库存减少一张。`, { side, action: action.kind, amount: 1 });
      }
      if (action.kind === 'charge') {
        if (c.chargeTrade) {
          const discarded = chargeTradeCard(c, f);
          if (!discarded) throw new RuleError('以牌换气需要至少一张可弃的手势牌。');
          f.cards[discarded]--;
          event(next, 'cards_converted', `${side === 'player' ? '你' : '电脑'}弃一张${ACTION_LABELS[discarded]}用于蓄气。`, { side, action: discarded, amount: 1 });
        }
        gainEnergy(side, expansion.charge(side,c.chargeTrade ? 2 : 1), 'charged', c.chargeTrade ? '以牌换气' : '主动蓄气');
      }
      if (action.kind === 'wave' || action.kind === 'piercing_wave') event(next, 'wave_observed', `${side === 'player' ? '你' : '电脑'}发出了${ACTION_LABELS[action.kind]}。`, { side, action: action.kind });
      f.lastAction = action.kind;
      f.winStreak = outcome === side ? f.winStreak + 1 : 0;
    }
    if ((player.kind === 'wave' && computer.kind === 'guard') || (computer.kind === 'wave' && player.kind === 'guard')) {
      const side = player.kind === 'guard' ? 'player' : 'computer';
      event(next, 'guard_blocked', '防御挡住了波；波仍支付费用，双方不产平局气。', { side });
      if (c.guardStore) pendingShields[side].push('挡波成盾');
    }
    const lastDamageMultiplier = c.lastHitDouble && next.hand + 1 === c.cap ? 2 : 1;
    if (outcome !== 'draw') {
      const loser = other(outcome), action = outcome === 'player' ? player : computer, f = next.fighters[outcome];
      f.wins++;
      if (['rock', 'scissors', 'paper'].includes(action.kind) && !f.collected.includes(action.kind as Gesture)) f.collected.push(action.kind as Gesture);
      if (c.life) {
        const ordinaryBase = c.desperation && before[outcome].life === 1 ? 2 : 1;
        const ninja = outcome === 'player' && c.abilities.player === 'ability.scissors_ninja' && action.kind === 'scissors';
        const base = Math.max(ordinaryBase, ninja ? 2 : 1);
        const damage = expansion.damage(outcome,cardResolution.damage(outcome,(base + (isGesture(action.kind) ? action.boost : 0)) * lastDamageMultiplier));
        const lifeBeforeHit=next.fighters[loser].life;
        applyDamage(loser, damage, cardResolution.piercing(outcome) || c.piercingBoost && isGesture(action.kind) && action.boost > 0,
          ninja && base > ordinaryBase ? { ability: 'ability.scissors_ninja', extra: (base - ordinaryBase) * lastDamageMultiplier } : undefined);
        if(next.fighters[loser].life<lifeBeforeHit)cardResolution.hit(outcome);
      }
    } else {
      for (const side of SIDES) {
        const f = next.fighters[side];f.draws++;
        const paperBonus = side === 'computer' && c.abilities.player === 'ability.paper_trickster' && player.kind === 'paper' && computer.kind === 'paper' ? 1 : 0;
        if (c.life && (c.drawDamage || paperBonus)) {
          applyDamage(side, (c.drawDamage ? lastDamageMultiplier : 0) + paperBonus, false,
            paperBonus ? { ability: 'ability.paper_trickster', extra: paperBonus } : undefined);
        }
      }
    }
    if (c.winHeal && outcome !== 'draw' && next.fighters[outcome].life > 0) {
      const f = next.fighters[outcome], gain = Math.min(3 - f.life, 1);f.life += gain;
      if (gain) event(next, 'healed', `${outcome === 'player' ? '你' : '电脑'}获胜后恢复 ${gain} 生命。`, { side: outcome, amount: gain });
    }
    if (c.score) for (const side of SIDES) {
      const f = next.fighters[side];
      const comboBonus = c.combo && outcome === side && f.winStreak >= 2 ? 1 : 0;
      const base = outcome === side ? 1 + comboBonus : outcome === 'draw' && c.drawPoint ? 1 : 0;
      const lastHand = c.lastDouble && next.hand + 1 === c.cap;
      const points = base * (lastHand ? 2 : 1);
      if (points > 0) {
        f.score += points;
        const explanation = [outcome === 'draw' ? '平局各加分' : '获胜', ...(comboBonus ? ['连胜加分'] : []), ...(lastHand ? ['末手翻倍'] : [])].join('、');
        event(next, 'score_awarded', `${side === 'player' ? '你' : '电脑'}获得 ${points} 分（${explanation}）。`, { side, amount: points });
      }
    }
    if (gestures && outcome === 'draw' && c.energy) for (const side of SIDES) {
      gainEnergy(side, 1, 'gesture_draw_energy', '在双方手势最终平局后回气');
    }
    if (c.drawRefund && outcome === 'draw') for (const side of SIDES) {
      const action = side === 'player' ? player : computer;
      if (isGesture(action.kind)) {
        next.fighters[side].cards[action.kind]++;
        event(next, 'cards_refunded', `最终平局，退回${side === 'player' ? '你' : '电脑'}实际打出的一张${ACTION_LABELS[action.kind]}。`, { side, action: action.kind, amount: 1 });
      }
    }
    if (outcome !== 'draw') {
      const action = actions[outcome], f = next.fighters[outcome], previous = before[outcome];
      if (c.comboRefund && isGesture(action.kind) && previous.winStreak >= 1 && previous.lastAction && isGesture(previous.lastAction) && previous.lastAction !== action.kind) {
        f.cards[action.kind]++;
        event(next, 'combo_refund', `${outcome === 'player' ? '你' : '电脑'}换招连胜，退回本手${ACTION_LABELS[action.kind]}。`, { side: outcome, action: action.kind, amount: 1 });
      }
      const captured = actions[other(outcome)].kind;
      if (c.capture && gestures && isGesture(captured)) {
        f.cards[captured]++;
        event(next, 'cards_captured', `${outcome === 'player' ? '你' : '电脑'}缴获对方本手的${ACTION_LABELS[captured]}。`, { side: outcome, action: captured, amount: 1 });
      }
    }
    if (c.wager) for (const side of SIDES) if (actions[side].wager) gainEnergy(side, outcome === side ? 2 : outcome === 'draw' ? 1 : 0, 'wager_resolved', '结算押注');
    if (c.restraint && outcome !== 'draw' && isGesture(actions[outcome].kind) && actions[outcome].boost === 0) gainEnergy(outcome, 1, 'restraint_charge', '以未强化手势获胜');
    if (c.lossCharge && outcome !== 'draw') {
      gainEnergy(other(outcome), 1, 'loss_charge', '最终落败后蓄力');
    }
    for (const side of SIDES) if (declared(side, 'ability.siphon')) {
      const f = next.fighters[side], opponent = next.fighters[other(side)], amount = Math.min(2, opponent.energy, c.energyCap - f.energy);
      opponent.energy -= amount;f.energy += amount;
      event(next, 'energy_transferred', `${side === 'player' ? '你' : '电脑'}将对方 ${amount} 气转入自己的气槽。`, { side, amount, ability: 'ability.siphon' });
    }
    if (c.leakThirds && (next.hand + 1) % 3 === 0) for (const side of SIDES) {
      const f = next.fighters[side], lost = Math.min(f.energy, 1);f.energy -= lost;
      event(next, 'energy_leaked', `第三手结尾，${side === 'player' ? '你' : '电脑'}流失 ${lost} 气；不计为行动费用。`, { side, amount: lost });
    }
    for (const side of SIDES) {
      const f = next.fighters[side], action = actions[side];
      if (c.finiteCards && declared(side, 'ability.reforge')) for (const gesture of c.gestures) if (f.cards[gesture] === 0) {
        f.cards[gesture] = 1;
        event(next, 'cards_reforged', `${side === 'player' ? '你' : '电脑'}重铸一张已耗尽的${ACTION_LABELS[gesture]}。`, { side, action: gesture, amount: 1, ability: 'ability.reforge' });
      }
      if (c.threeStyles) {
        f.gestureChain = !isGesture(action.kind) ? [] : f.gestureChain.includes(action.kind) ? [action.kind] : [...f.gestureChain, action.kind];
        if (f.gestureChain.length === 3) {
          f.gestureChain = [];pendingShields[side].push('三招成势');
          event(next, 'style_chain_completed', `${side === 'player' ? '你' : '电脑'}连续使用三种不同手势，本手伤害后成盾。`, { side, amount: 3 });
        }
      }
      if (pendingShields[side].length) {gainShield(side, [...new Set(pendingShields[side])].join('、'));pendingShields[side]=[];}
      if (side === 'player' && c.abilities.player === 'ability.rock_guardian' && outcome === 'player' && player.kind === 'rock' && f.shield === 0) {
        gainShield(side, '以石头获胜，岩拳卫士为下一手成盾', 'ability.rock_guardian');
        event(next, 'passive_triggered', '岩拳卫士常驻能力生效，获得一层盾，保护之后的交锋。', { side, ability: 'ability.rock_guardian', action: 'rock', amount: 1 });
      }
    }
    expansion.finish();
    cardResolution.finish();
    if (c.finiteCards) for (const side of SIDES) for (const gesture of c.gestures) if (before[side].cards[gesture] > 0 && next.fighters[side].cards[gesture] === 0) event(next, 'inventory_depleted', `${side === 'player' ? '你' : '电脑'}的${ACTION_LABELS[gesture]}结算后已耗尽。`, { side, action: gesture });
    for(const side of SIDES)if(pendingShields[side].length)gainShield(side,[...new Set(pendingShields[side])].join('、'));
    // Only a completed effective hand consumes the previous reveal window.
    if (next.foreseenHand !== null && next.foreseenHand <= next.hand + 1) next.foreseenHand = null;
    if (declared('player', 'ability.foresight')) {
      next.foreseenHand = next.hand + 2;
      event(next, 'foresight_granted', '先见生效：下一有效手电脑锁定后，公开其动作种类。', { side: 'player', ability: 'ability.foresight', amount: next.foreseenHand });
    }
    if (c.goal === 'collect_three') for (const side of SIDES) event(next, 'goal_progress', `${side === 'player' ? '你' : '电脑'}已用 ${next.fighters[side].collected.length}/3 种基础手势赢过。`, { side, amount: next.fighters[side].collected.length });
    if (c.goal === 'draw_three') event(next, 'goal_progress', `你的累计最终平局：${next.fighters.player.draws}/3。`, { side: 'player', amount: next.fighters.player.draws });
    if (c.goal === 'streak_two') event(next, 'goal_progress', `你的当前连胜：${next.fighters.player.winStreak}/2。`, { side: 'player', amount: next.fighters.player.winStreak });
    if (c.goal === 'efficient_wins') event(next, 'goal_progress', `你的胜场：${next.fighters.player.wins}/2；累计实际费用：${next.fighters.player.energySpent}/3 气。`, { side: 'player', amount: next.fighters.player.energySpent });
    next.hand++;
    event(next, 'round_completed', outcome === 'draw' ? '这一手平局。' : outcome === 'player' ? '你赢下这一手。' : '电脑赢下这一手。', { hand: next.hand });
  }
  next.phase = 'presenting';
  if (!retry) checkTerminal(next, c);
  if (!recordAttempt) return next;
  const record: AttemptRecord = { attempt: next.attempt, hand: retry ? next.hand + 1 : next.hand, player: clone(player), computer: clone(computer), rawOutcome: raw, outcome, voided: retry, before, after: clone(next.fighters), events: next.events.slice(eventStart),...(experimentBefore?{experimentBefore,experimentAfter:clone(next.experiment)}:{}) };
  next.history.push(record);
  return next;
}
/** Evaluate choices with the same transaction rules; simulation never reads or advances real RNG. */
function actionUtility(observation: PublicObservation, cpu: Action, p: Action, compiled: CompiledDesign): number {
  // No public preparation or random draw is repeated by a hypothetical resolution.
  const simulated: MatchState = {
    schemaVersion: 1, id: 'simulation', design: observation.design, designHash: compiled.hash,
    strategyVersion: 'public-mix-v2', seed: 0, rng: { algorithm: 'mulberry32-v1', state: 0 },
    phase: 'awaitingPlayer', hand: observation.hand, attempt: observation.attempt, preparationComplete: true,
    publicTrump: observation.publicTrump, foreseenHand: null, publicComputerIntent: null, overtimeActive: observation.overtimeActive, effectiveCap: observation.effectiveCap,
    fighters: { player: observation.opponent, computer: observation.self }, computerCommitment: cpu,
    history: [], events: [], processedCommands: [], result: null,
  };
  const after = resolvePair(simulated, p, cpu, compiled, false);
  const f = after.fighters;
  let value = 0;
  if (after.result) value += after.result.winner === 'computer' ? 14 : after.result.winner === 'player' ? -14 : 0;
  const goal = observation.design.goal;
  if (goal === 'knockout') value += (f.computer.life - f.player.life) * 1.8;
  else if (goal === 'fewest_points') value += (f.player.score - f.computer.score) * 2;
  else if (isScoreGoal(goal)) value += (f.computer.score - f.player.score) * 2;
  else if (goal === 'collect_three') value += (f.computer.collected.length - f.player.collected.length) * 3;
  else if (goal === 'draw_three') value += -f.player.draws * 3 + (f.computer.wins - f.player.wins) * 0.4;
  else if (goal === 'streak_two') value += -f.player.winStreak * 4 + (f.computer.wins - f.player.wins) * 0.4;
  else if (goal === 'efficient_wins') value += -f.player.wins * 2 + f.player.energySpent;
  else if (goal === 'survive') value += -f.player.life * 2.5 + f.computer.life * 0.4;
  else value += (f.computer.wins - f.player.wins) * 2;
  value += (f.computer.energy - f.player.energy) * 0.42;
  value += (f.computer.shield - f.player.shield) * 1.2;
  if (compiled.threeStyles) value += (f.computer.gestureChain.length - f.player.gestureChain.length) * 0.12;
  const futureHandsRemain = compiled.healthOnly || observation.design.cap - observation.hand > 1;
  value += (f.computer.abilityRemaining - f.player.abilityRemaining) * (futureHandsRemain ? 0.48 : 0.03);
  if (observation.design.rules.includes('cards.finite')) value += (Object.values(f.computer.cards).reduce((a, b) => a + b, 0) - Object.values(f.player.cards).reduce((a, b) => a + b, 0)) * 0.1;
  return value;
}
function weightedIndex(weights: number[], sample: number): number {
  let target = sample * weights.reduce((sum, weight) => sum + weight, 0);
  for (let i = 0; i < weights.length; i++) { target -= weights[i]!; if (target <= 0) return i; }
  return weights.length - 1;
}
export function chooseComputerAction(observation: PublicObservation, rng: RngState): { action: Action; rng: RngState } {
  if (!observation.legal.length) throw new RuleError('电脑没有合法动作。');
  const families = [...new Set(observation.legal.map(a => a.kind))];
  const first = nextRandom(rng), second = nextRandom(first.rng);
  if (cardMode(observation)) {
    // Select from the CPU's own hand and public history; never inspect the player's hidden cards.
    const candidates=observation.legal.filter(a=>!a.ability&&!a.boost&&!a.wager);
    return {action:clone(candidates[Math.floor(first.value*candidates.length)]??observation.legal[0]!),rng:second.rng};
  }
  if (observation.design.goal === 'single') {
    const family = families[Math.floor(first.value * families.length)]!;
    return { action: clone(observation.legal.find(a => a.kind === family)!), rng: second.rng };
  }
  const compiled = compileDesign(observation.design);
  const opponentFamilies = [...new Set(observation.opponentLegal.map(a => a.kind))];
  const recent = observation.history.slice(-8);
  const familyWeights = opponentFamilies.map(kind => 2 + recent.filter(record => record.player.kind === kind).length);
  const scores = observation.legal.map(cpu => {
    let sum = 0;
    for (let i = 0; i < opponentFamilies.length; i++) {
      const candidates = observation.opponentLegal.filter(a => a.kind === opponentFamilies[i]);
      let local = 0, weights = 0;
      for (const p of candidates) {
        const weight = (p.ability ? 0.25 : 1) * (p.boost ? 0.65 : 1) * (p.wager ? 0.65 : 1);
        local += actionUtility(observation, cpu, p, compiled) * weight;
        weights += weight;
      }
      sum += (local / Math.max(1, weights)) * familyWeights[i]!;
    }
    return sum / Math.max(1, familyWeights.reduce((a, b) => a + b, 0));
  });
  const best = families.map(kind => Math.max(...scores.filter((_, i) => observation.legal[i]!.kind === kind)));
  const max = Math.max(...best);
  const exploitation = best.map(score => Math.exp((score - max) * 1.15));
  const total = exploitation.reduce((a, b) => a + b, 0);
  const family = families[weightedIndex(exploitation.map(weight => 0.1 / families.length + 0.9 * weight / total), first.value)]!;
  const indices = observation.legal.map((a, i) => a.kind === family ? i : -1).filter(i => i >= 0);
  const familyMax = Math.max(...indices.map(i => scores[i]!));
  const selected = indices[weightedIndex(indices.map(i => Math.exp((scores[i]! - familyMax) * 2)), second.value)]!;
  return { action: clone(observation.legal[selected]!), rng: second.rng };
}
export function commitComputer(match: MatchState): MatchState {
  if (match.phase === 'awaitingPlayer' || match.result) return match;
  if (match.phase !== 'preparing') throw new RuleError('当前不在准备阶段。');
  let next = clone(match);
  if(declarationsNeeded(next))return next;
  if (!next.preparationComplete) {
    preparePublic(next);
    const c = compileDesign(next.design), f = next.fighters.computer;
    if (c.exchange && f.exchangeRemaining > 0) {
      const scarce = c.gestures.find(g => f.cards[g] === 0 && (!c.cooldown || f.lastAction !== g));
      const stock = [...c.gestures].sort((a, b) => f.cards[b] - f.cards[a]).find(g => f.cards[g] >= 2 && g !== scarce);
      if (scarce && stock) next = exchangeCards(next, 'computer', stock, scarce);
    }
    next.preparationComplete = true;
    event(next, 'prepared', '双方公开准备完成。');
  }
  checkExhaustion(next);
  if (next.result) return next;
  const choice = chooseComputerAction(makeObservation(next), next.rng);
  next.rng = choice.rng;
  next.computerCommitment = computerExperiment(next,choice.action,compileDesign(next.design),a=>actionCost(a,compileDesign(next.design)),legalActions(next,'computer'));
  next.phase = 'awaitingPlayer';
  event(next, 'committed', '电脑已锁定完整行动，等待你的承诺。');
  if (next.foreseenHand === next.hand + 1) {
    next.publicComputerIntent = next.computerCommitment.kind;
    event(next, 'foresight_revealed', `先见：电脑已锁定${ACTION_LABELS[next.computerCommitment.kind]}；强化与押注仍未公开。`, { side: 'player', action: choice.action.kind, ability: 'ability.foresight' });
  }
  return next;
}
export function sealInformation(match:MatchState, action:Action):MatchState {
  if(match.phase!=='awaitingPlayer'||!match.computerCommitment)throw new RuleError('当前不能封存动作。');
  ensureAction(match,'player',action);return sealExperimentAction(match,action);
}
export function resolveAttempt(match: MatchState, action: Action, command: string | CommandIdentity): MatchState {
  const commandId = typeof command === 'string' ? command : command.commandId;
  if (!commandId || commandId.length > 200) throw new RuleError('需要有效的动作命令编号。');
  if (typeof command !== 'string' && command.matchId !== match.id) throw new RuleError('此命令属于另一场实验。');
  if (match.processedCommands.includes(commandId)) return match;
  if (typeof command !== 'string' && command.attemptId !== match.attempt) throw new RuleError('此命令的动作窗口已过期。');
  if (match.phase !== 'awaitingPlayer' || !match.computerCommitment || match.result) throw new RuleError('当前没有等待提交的有效动作窗口。');
  ensureSealedAction(match,action);
  ensureAction(match, 'player', action);
  ensureAction(match, 'computer', match.computerCommitment);
  const next = resolvePair(match, normalizeCardAction(match.fighters.player,action), normalizeCardAction(match.fighters.computer,match.computerCommitment));
  next.processedCommands.push(commandId);
  return next;
}
export function advanceMatch(match: MatchState): MatchState {
  if (match.result || match.phase === 'preparing' || match.phase === 'awaitingPlayer') return match;
  const next = clone(prepareComputerForge(match)), previous = next.history.at(-1);
  next.attempt++;
  next.phase = 'preparing';
  next.computerCommitment = null;
  next.publicComputerIntent = null;
  next.preparationComplete = previous?.voided ?? false;
  preparePublic(next);
  checkExhaustion(next, !next.preparationComplete);
  return next;
}
/** Reapply the disclosed actions, stopping at a genuinely illegal or unalignable attempt. */
export function compareReplay(original: MatchState, design: Design): ReplayComparison {
  let match = createMatch(design, original.seed);
  const rows: ReplayComparison['rows'] = [];
  let reason: string | null = null;
  if (original.history.some(record => record.experimentBefore) || match.experiment) {
    return { rows, stopped: true, reason: '实验机制包含独立的宣言、摸取与封存步骤，不能只凭旧出手还原。请用新规则另开一场实测。', match };
  }
  for (const record of original.history) {
    if (match.result) { reason = '对照版本已经结束，后续行动不再发生。'; break; }
    match = advanceMatch(match);
    // Replay preparation transactions from the original record's public event stream.
    const preparation = original.events.filter(e => e.type === 'exchange' && e.attempt === record.attempt);
    for (const e of preparation) {
      if (!e.side || !e.from || !e.action || !isGesture(e.action)) { reason = '换牌记录不完整，已停止对照。'; break; }
      try { match = exchangeCards(match, e.side, e.from, e.action); }
      catch { reason = '原有公开换牌在对照版本中不合法，已停止对照。'; break; }
    }
    if (reason) break;
    if (!legalActions(match, 'player').some(a => actionEqual(a, record.player)) || !legalActions(match, 'computer').some(a => actionEqual(a, record.computer))) {
      reason = `第 ${record.attempt} 次尝试的行动在对照版本中不合法，未伪造结算。`;
      rows.push({ attempt: record.attempt, hand: record.hand, original: record.outcome, compared: null, originalVoided: record.voided, comparedVoided: null, note: reason });
      break;
    }
    match.phase = 'awaitingPlayer';
    match.preparationComplete = true;
    match.computerCommitment = clone(record.computer);
    match = resolveAttempt(match, record.player, `replay-${record.attempt}`);
    const compared = match.history.at(-1)!;
    const alignment = compared.voided === record.voided;
    rows.push({ attempt: record.attempt, hand: record.hand, original: record.outcome, compared: compared.outcome, originalVoided: record.voided, comparedVoided: compared.voided, note: alignment ? compared.outcome === record.outcome ? '相同行动，交锋结果相同。' : '相同行动，规则改变了交锋结果。' : '再搏使有效手数分岔；本次之后停止逐手对照。' });
    if (!alignment) { reason = '再搏使尝试与有效手数的对应关系改变。'; break; }
  }
  return { rows, stopped: reason !== null, reason, match };
}
/** Public view for rendering/export: the pending CPU action is excluded until reveal. */
export function projectPublicView(match: MatchState): Omit<MatchState, 'computerCommitment' | 'rng'> {
  const { computerCommitment: _commitment, rng: _rng, ...view } = clone(match);
  const hideHand=(f:FighterState)=>{if(f.cardZone){delete f.cardZone;f.cards=Object.fromEntries(GESTURES.map(g=>[g,0])) as FighterState['cards'];}};
  hideHand(view.fighters.computer);
  for(const record of view.history){hideHand(record.before.computer);hideHand(record.after.computer);}
  if(view.experiment)view.experiment=publicExperiment(match,match.phase==='presenting'||match.phase==='finished');
  for(const record of view.history){
    if(record.computer.experiment)delete record.computer.experiment.next;
    if(record.experimentBefore)record.experimentBefore=publicExperiment({...match,experiment:record.experimentBefore});
    if(record.experimentAfter)record.experimentAfter=publicExperiment({...match,experiment:record.experimentAfter},true);
  }
  return view;
}
