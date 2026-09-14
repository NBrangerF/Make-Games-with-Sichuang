import { describe, expect, it } from 'vitest';
import fc from 'fast-check';
import { RULES, actionCost, advanceMatch, chooseComputerAction, commitComputer, commitRuleChange, compileDesign, createDesign, createMatch, installRule, legalActions, makeObservation, nextRandom, previewRuleChange, rawOutcome, removeRule, resolveAttempt, setAbility } from '../../src/core';
import type { Action, ActionKind, Design, MatchState, RuleId } from '../../src/core';

const a = (kind: ActionKind, boost: 0 | 1 | 2 = 0, ability = false): Action => ({ kind, boost, ability });
const d = (...ids: RuleId[]) => ids.reduce(installRule, createDesign());
const score = (...ids: RuleId[]) => d('match.score_five', ...ids);
const life = (...ids: RuleId[]) => d('match.first_two', 'life.knockout', ...ids);
const gas = (...ids: RuleId[]) => life('energy.gesture_boost', 'energy.wave', 'energy.active_charge', 'energy.guard', ...ids);
function pair(state: MatchState, player: Action, computer: Action): MatchState {
  const next = advanceMatch(structuredClone(state));
  next.phase = 'awaitingPlayer';next.preparationComplete = true;next.computerCommitment = computer;
  return resolveAttempt(next, player, `expansion-${next.attempt}`);
}
const win = (m: MatchState) => pair(m, a('rock'), a('scissors'));
const lose = (m: MatchState) => pair(m, a('rock'), a('paper'));
const draw = (m: MatchState) => pair(m, a('rock'), a('rock'));
const empty = { rock: 0, scissors: 0, paper: 0, lizard: 0, spock: 0 };

describe('expanded rule contracts and atomic exits', () => {
  it('contains 75 unique core mechanics including the retained historical rules', () => {
    expect(RULES).toHaveLength(75);expect(new Set(RULES.map(r => r.id)).size).toBe(75);
    expect(RULES.some(r => (r.id as string) === 'stars.stake')).toBe(false);
  });
  it('short cap can recover to nine or explicitly thirteen without a workshop prerequisite', () => {
    const short = score('tempo.extend_cap', 'tempo.short_cap');
    const nine = previewRuleChange(short, { type: 'install', rule: 'tempo.extend_cap' });
    expect(nine).toMatchObject({ valid: true, cap: 9, removed: ['tempo.short_cap'] });
    expect(nine.notes.join(' ')).toContain('3 手改为 9 手');
    const thirteen = previewRuleChange(short, { type: 'install', rule: 'tempo.extend_cap', capTarget: 13 });
    expect(thirteen).toMatchObject({ valid: true, cap: 13 });
    expect(compileDesign(commitRuleChange(short, thirteen)).cap).toBe(13);
    expect(previewRuleChange(short, { type: 'install', rule: 'score.combo', capTarget: 13 }).valid).toBe(false);
  });
  it('two and five gestures replace each other explicitly, including dependent exits', () => {
    const five = score('gesture.five', 'gesture.public_trump', 'gesture.reverse', 'action.cooldown', 'cards.finite');
    const removed = previewRuleChange(five, { type: 'install', rule: 'gesture.remove_rock' });
    expect(removed.valid).toBe(true);
    expect(removed.removed).toEqual(expect.arrayContaining(['gesture.five', 'gesture.public_trump', 'gesture.reverse', 'action.cooldown']));
    expect(compileDesign(removed.nextDesign).gestures).toEqual(['scissors', 'paper']);
    expect(createMatch(removed.nextDesign, 1).fighters.player.cards.rock).toBe(0);
    const restored = previewRuleChange(removed.nextDesign, { type: 'install', rule: 'gesture.five' });
    expect(restored.removed).toContain('gesture.remove_rock');expect(compileDesign(restored.nextDesign).gestures).toHaveLength(5);
    expect(previewRuleChange(score('tempo.extend_cap', 'goal.collect_three'), { type: 'install', rule: 'gesture.remove_rock' }).valid).toBe(false);
  });
  it('keeps one goal, readable modifiers, and no silently added prerequisites', () => {
    const source = score('score.combo', 'score.draw_point', 'score.last_double');
    const five = installRule(source, 'goal.first_five_points');
    const fewest = installRule(five, 'goal.fewest_points');
    expect(compileDesign(fewest)).toMatchObject({ score: true, combo: true, drawPoint: true, lastDouble: true });
    expect(fewest.rules).not.toContain('goal.first_five_points');
    const challenge = previewRuleChange(fewest, { type: 'install', rule: 'goal.streak_two' });
    expect(challenge.removed).toEqual(expect.arrayContaining(['goal.fewest_points','score.combo','score.draw_point','score.last_double']));
    expect(previewRuleChange(score('tempo.short_cap'), { type: 'install', rule: 'goal.draw_three' }).valid).toBe(false);
    expect(previewRuleChange(score(), { type: 'install', rule: 'goal.collect_three' }).valid).toBe(false);
    expect(previewRuleChange(life('energy.gesture_boost'), { type: 'install', rule: 'goal.efficient_wins' }).valid).toBe(true);
    expect(previewRuleChange(createDesign(), { type: 'install', rule: 'ending.bounded_overtime' }).valid).toBe(false);
  });
  it('retains experimental modifiers when their original resource or goal is removed', () => {
    const hand = score('cards.finite','cards.draw_refund','cards.dealer_refill');
    expect(removeRule(hand,'cards.finite').rules).toEqual(['match.score_five','cards.draw_refund','cards.dealer_refill']);
    expect(compileDesign(removeRule(hand,'cards.finite'))).toMatchObject({ drawRefund: false, dealerRefill: false });
    const powered = gas('energy.guard_paid','energy.piercing_wave','energy.cheap_wave','energy.double_boost','life.draw_damage','life.win_heal');
    const surviving = installRule(powered,'life.survive');
    expect(compileDesign(surviving)).toMatchObject({ goal: 'survive', life: true, drawDamage: true, winHeal: true, maxBoost: 2 });
    const budget = previewRuleChange(surviving, {type:'install', rule:'goal.efficient_wins'});
    expect(budget.valid).toBe(true);expect(budget.removed).toEqual(['life.survive']);
    expect(compileDesign(budget.nextDesign)).toMatchObject({ life: false, energy: true, maxBoost: 2 });
    expect(previewRuleChange(budget.nextDesign,{type:'remove',rule:'energy.wave'}).valid).toBe(true);
  });
});

describe('seven goals and bounded ending', () => {
  it('collects only winning rock scissors paper, lets either side race, and compares collection at cap', () => {
    const design = score('tempo.extend_cap','gesture.five','goal.collect_three');
    let m = createMatch(design,1);
    m = pair(m,a('lizard'),a('paper'));expect(m.fighters.player.collected).toEqual([]);
    m = win(m);m = pair(m,a('scissors'),a('paper'));m = pair(m,a('paper'),a('rock'));
    expect(m.result).toMatchObject({winner:'player',reason:'goal'});expect(m.fighters.player.collected).toHaveLength(3);
    let cpu = createMatch(design,2);
    cpu = pair(cpu,a('scissors'),a('rock'));cpu = pair(cpu,a('paper'),a('scissors'));cpu = pair(cpu,a('rock'),a('paper'));
    expect(cpu.result?.winner).toBe('computer');
    let limit = createMatch(design,3);limit = win(limit);for(let i=1;i<9;i++) limit=draw(limit);
    expect(limit.result).toMatchObject({winner:'player',reason:'cap'});
  });
  it('three draws accumulates final results, including insurance and special-action draws', () => {
    const design = setAbility(installRule(gas(),'goal.draw_three'),'player','ability.insurance');
    let m = createMatch(design,1);m = pair(m,a('rock',0,true),a('paper'));m = pair(m,a('guard'),a('guard'));m=draw(m);
    expect(m.result?.winner).toBe('player');expect(m.fighters.player.draws).toBe(3);
    let miss=createMatch(installRule(score(),'goal.draw_three'),2);for(let i=0;i<5;i++) miss=win(miss);
    expect(miss.result?.winner).toBe('computer');
  });
  it('CPU consecutive wins never complete the player streak challenge, and draws reset it', () => {
    let m=createMatch(score('goal.streak_two'),1);m=lose(lose(m));expect(m.result).toBeNull();
    m=win(m);m=draw(m);m=win(m);expect(m.result?.winner).toBe('computer');
    const achieved=win(win(createMatch(score('goal.streak_two'),2)));expect(achieved.result?.winner).toBe('player');
  });
  it('first-five retains scoring modifiers and terminates when the threshold is reached', () => {
    let m=createMatch(score('score.combo','goal.first_five_points'),1);m=win(win(win(m)));
    expect(m.fighters.player.score).toBe(5);expect(m.result).toMatchObject({winner:'player',reason:'goal'});expect(m.hand).toBe(3);
  });
  it('first-five resolves simultaneous threshold ties at C or during overtime immediately', () => {
    const design=score('score.draw_point','goal.first_five_points','ending.bounded_overtime');
    let atCap=createMatch(design,1);for(let i=0;i<5;i++) atCap=draw(atCap);
    expect(atCap.result).toMatchObject({winner:'draw',reason:'goal'});expect(atCap.overtimeActive).toBe(false);
    let overtime=createMatch(design,2);overtime=lose(win(overtime));overtime=draw(draw(draw(overtime)));
    expect(overtime).toMatchObject({overtimeActive:true,result:null});expect(overtime.fighters.player.score).toBe(4);
    overtime=draw(overtime);expect(overtime.result).toMatchObject({winner:'draw',reason:'goal'});expect(overtime.hand).toBe(6);
  });
  it('fewest points reverses the comparator and runs to the cap', () => {
    let m=createMatch(score('goal.fewest_points'),1);for(let i=0;i<5;i++) m=win(m);
    expect(m.result).toMatchObject({winner:'computer',reason:'cap'});expect(m.fighters.player.score).toBe(5);
  });
  it('efficient wins checks at cap, counts actual paid guard/wave costs, and fails over budget immediately', () => {
    const design=installRule(gas('tempo.extend_cap','energy.guard_paid','energy.cheap_wave','energy.opening_two'),'goal.efficient_wins');
    let m=createMatch(design,1);m=win(win(m));expect(m.result).toBeNull();for(let i=2;i<9;i++) m=draw(m);
    expect(m.result?.winner).toBe('player');expect(m.fighters.player.energySpent).toBe(0);
    let overspend=createMatch(design,2);overspend.fighters.player.energy=3;
    overspend=pair(overspend,a('guard'),a('rock'));overspend=pair(overspend,a('wave'),a('rock'));overspend=pair(overspend,a('charge'),a('rock'));
    overspend=pair(overspend,a('wave'),a('rock'));expect(overspend.result).toBeNull();
    overspend=pair(overspend,a('guard'),a('rock'));expect(overspend.result).toMatchObject({winner:'computer',reason:'budget'});expect(overspend.fighters.player.energySpent).toBe(4);
  });
  it('survival succeeds alive at cap or on knockout, but simultaneous zero fails', () => {
    let alive=createMatch(life('life.survive'),1);for(let i=0;i<5;i++) alive=draw(alive);
    expect(alive.result?.winner).toBe('player');expect(win(win(win(createMatch(life('life.survive'),2)))).result?.winner).toBe('player');
    let dead=createMatch(life('life.draw_damage','life.survive'),3);dead=draw(draw(draw(dead)));
    expect(dead.fighters.player.life).toBe(0);expect(dead.fighters.computer.life).toBe(0);expect(dead.result?.winner).toBe('computer');
  });
  it('opens overtime only on a tied original cap and ends on first comparator lead or third extra hand', () => {
    const design=score('tempo.short_cap','ending.bounded_overtime');
    let m=createMatch(design,1);m=draw(draw(draw(m)));
    expect(m.result).toBeNull();expect(m).toMatchObject({hand:3,overtimeActive:true,effectiveCap:6});
    expect(m.history.at(-1)?.events.some(e=>e.type==='overtime_started')).toBe(true);
    m=win(m);expect(m.result).toMatchObject({winner:'player',reason:'overtime'});expect(m.hand).toBe(4);
    let tied=createMatch(design,2);for(let i=0;i<6;i++) tied=draw(tied);
    expect(tied.result).toMatchObject({winner:'draw',reason:'overtime'});
  });
  it('last score multiplier stays on original C, not the last overtime hand', () => {
    let m=createMatch(score('tempo.short_cap','score.draw_point','score.last_double','ending.bounded_overtime'),1);
    for(let i=0;i<6;i++) m=draw(m);
    expect(m.history.map(r=>r.events.find(e=>e.type==='score_awarded'&&e.side==='player')?.amount)).toEqual([1,1,2,1,1,1]);
    expect(m.fighters.player.score).toBe(7);
  });
});

describe('damage, cards, public preparation and expanded energy', () => {
  it('damage uses locked low life + paid double boost, then last-hand multiplier; healing follows damage', () => {
    const design=gas('energy.double_boost','life.desperation','life.last_hit_double','life.win_heal');
    let m=createMatch(design,1);m.hand=4;m.fighters.player.life=1;m.fighters.player.energy=2;
    m=pair(m,a('rock',2),a('scissors'));
    expect(m.fighters.player).toMatchObject({life:2,energy:0,energySpent:2});expect(m.fighters.computer.life).toBe(0);
    const events=m.history[0].events;expect(events.findIndex(e=>e.type==='energy_spent')).toBeLessThan(events.findIndex(e=>e.type==='damage'));expect(events.findIndex(e=>e.type==='damage')).toBeLessThan(events.findIndex(e=>e.type==='healed'));
  });
  it('low-life damage applies without boost and heals only final winners up to three', () => {
    let m=createMatch(life('life.desperation','life.win_heal'),1);m.fighters.player.life=1;m=win(m);
    expect(m.fighters.computer.life).toBe(1);expect(m.fighters.player.life).toBe(2);
    m=win(m);expect(m.fighters.player.life).toBe(3);
  });
  it('final draw damage affects special draws and doubles only damage at C', () => {
    let m=createMatch(gas('life.draw_damage','life.last_hit_double'),1);m.hand=4;
    m=pair(m,a('guard'),a('guard'));expect(m.fighters.player.life).toBe(1);expect(m.fighters.computer.life).toBe(1);
    const insured=setAbility(life('life.draw_damage','life.win_heal'),'player','ability.insurance');
    const result=pair(createMatch(insured,2),a('rock',0,true),a('paper'));expect(result.fighters.player.life).toBe(2);expect(result.fighters.computer.life).toBe(2);
  });
  it('draw refunds only actually spent gesture cards using the final ability result', () => {
    const design=setAbility(score('cards.finite','cards.draw_refund'),'player','ability.insurance');
    const m=pair(createMatch(design,1),a('rock',0,true),a('paper'));
    expect(m.fighters.player.cards.rock).toBe(3);expect(m.fighters.computer.cards.paper).toBe(3);expect(m.history[0].events.filter(e=>e.type==='cards_refunded')).toHaveLength(2);
    const last=createMatch(design,4);last.fighters.player.cards.rock=1;
    const refundedLast=pair(last,a('rock',0,true),a('paper'));expect(refundedLast.fighters.player.cards.rock).toBe(1);expect(refundedLast.history[0].events.some(e=>e.type==='inventory_depleted'&&e.side==='player')).toBe(false);
    const claimed=setAbility(score('cards.finite','cards.draw_refund'),'player','ability.claim_draw');
    const used=pair(createMatch(claimed,2),a('rock',0,true),a('rock'));expect(used.fighters.player.cards.rock).toBe(2);
    const specials=pair(createMatch(gas('cards.finite','cards.draw_refund'),3),a('guard'),a('charge'));
    expect(specials.history[0].events.some(e=>e.type==='cards_refunded')).toBe(false);
  });
  it('dealer replenishes only the CPU before commitment when it has no legal gesture even with gas available', () => {
    const design=gas('cards.finite','cards.two_each','cards.dealer_refill','action.cooldown');
    let m=createMatch(design,1);m.fighters.computer.cards={...empty,rock:1};m.fighters.computer.lastAction='rock';m.fighters.player.cards.paper=1;
    m=commitComputer(m);expect(m.events.filter(e=>e.type==='dealer_refill')).toHaveLength(1);
    expect(m.fighters.computer.cards).toMatchObject({rock:2,paper:2,scissors:2});expect(m.fighters.player.cards.paper).toBe(1);
    expect(m.events.findIndex(e=>e.type==='dealer_refill')).toBeLessThan(m.events.findIndex(e=>e.type==='committed'));
    expect(legalActions(m,'computer')).toContainEqual(m.computerCommitment);
  });
  it('public trump rotates display order before commitment, survives retries, and does not change wave or guard relationships', () => {
    const design=setAbility(score('gesture.five','gesture.public_trump'),'player','ability.retry');
    let m=createMatch(design,1);expect(m.publicTrump).toBe('rock');expect(m.computerCommitment).toBeNull();
    m=pair(m,a('scissors',0,true),a('rock'));const retry=advanceMatch(m);expect(retry.publicTrump).toBe('rock');expect(retry.events.filter(e=>e.type==='trump_announced')).toHaveLength(1);
    m=pair(retry,a('paper'),a('paper'));m=advanceMatch(m);expect(m.publicTrump).toBe('scissors');
    expect(rawOutcome('scissors','rock',true,'scissors')).toBe('player');expect(rawOutcome('rock','scissors',false,'scissors')).toBe('computer');
    expect(rawOutcome('rock','wave',false,'rock')).toBe('computer');expect(rawOutcome('rock','guard',false,'rock')).toBe('player');
    expect(makeObservation(m)).toMatchObject({publicTrump:'scissors'});
  });
  it.each(['rock','scissors','paper','lizard','spock','charge','guard'] as const)('piercing wave beats %s but draws other waves, without reversal changing special relations',kind=>{
    expect(rawOutcome('piercing_wave',kind,true,kind==='rock'?'rock':null)).toBe('player');expect(rawOutcome(kind,'piercing_wave')).toBe('computer');
    expect(rawOutcome('piercing_wave','wave')).toBe('draw');expect(rawOutcome('piercing_wave','piercing_wave')).toBe('draw');
  });
  it('paid guard, cheap wave and piercing wave have distinct actual legal costs', () => {
    const design=gas('energy.guard_paid','energy.cheap_wave','energy.piercing_wave','energy.opening_two');const c=compileDesign(design);
    expect([actionCost(a('guard'),c),actionCost(a('wave'),c),actionCost(a('piercing_wave'),c)]).toEqual([1,1,3]);
    const m=createMatch(design,1);expect(m.fighters.player.energy).toBe(2);expect(legalActions(m,'player').some(a=>a.kind==='piercing_wave')).toBe(false);
    m.fighters.player.energy=3;const hit=pair(m,a('piercing_wave'),a('guard'));expect(hit.fighters.player.energySpent).toBe(3);expect(hit.fighters.computer.energySpent).toBe(1);expect(hit.fighters.computer.life).toBe(2);
    m.fighters.player.energy=0;expect(legalActions(m,'player').some(a=>a.kind==='guard'||a.kind==='wave')).toBe(false);
  });
  it('larger energy cap starts at one or two and never grants a free fill', () => {
    expect(createMatch(gas('energy.cap_five'),1).fighters.player.energy).toBe(1);
    let m=createMatch(gas('energy.cap_five','energy.opening_two'),2);expect(m.fighters.player.energy).toBe(2);
    for(let i=0;i<5;i++) m=pair(m,a('charge'),a('charge'));
    expect(m.fighters.player.energy).toBe(5);expect(m.fighters.player.energySpent).toBe(0);
  });
  it('losing charge recovers twice, then third-hand leak happens after all recovery without becoming a fee', () => {
    let m=createMatch(gas('energy.loss_charge','energy.leak_thirds','energy.cap_five'),1);m.hand=2;
    m=pair(m,a('charge'),a('rock'));expect(m.fighters.player.energy).toBe(2);expect(m.fighters.player.energySpent).toBe(0);expect(m.fighters.computer.energy).toBe(0);
    const types=m.history[0].events.map(e=>e.type);expect(types.indexOf('charged')).toBeLessThan(types.indexOf('loss_charge'));expect(types.indexOf('loss_charge')).toBeLessThan(types.indexOf('energy_leaked'));
    const insured=setAbility(gas('energy.loss_charge'),'player','ability.insurance');
    const insuredResult=pair(createMatch(insured,2),a('rock',0,true),a('paper'));expect(insuredResult.history[0].events.some(e=>e.type==='loss_charge')).toBe(false);
  });
  it('double boost pays two on losses and draws, and adds two damage only on a win', () => {
    const design=gas('energy.double_boost','energy.opening_two');
    const lost=pair(createMatch(design,1),a('rock',2),a('paper'));expect(lost.fighters.player).toMatchObject({energy:0,energySpent:2,life:2});
    const tied=pair(createMatch(design,2),a('rock',2),a('rock'));expect(tied.fighters.player).toMatchObject({energy:1,energySpent:2,life:3});
    const won=pair(createMatch(design,3),a('rock',2),a('scissors'));expect(won.fighters.computer.life).toBe(0);
  });
  it('void retries never submit any resource/progress or repeat public trump and dealer preparation', () => {
    const design=setAbility(gas('cards.finite','cards.draw_refund','cards.dealer_refill','energy.double_boost','energy.leak_thirds','energy.loss_charge','gesture.public_trump','life.desperation','life.win_heal','life.draw_damage'),'player','ability.retry');
    let m=createMatch(design,1);m.hand=2;m.publicTrump='paper';m.fighters.player.energy=2;
    const before=structuredClone(m.fighters);m=pair(m,a('rock',2,true),a('paper'));expect(m.history[0].voided).toBe(true);
    expect(m.fighters).toEqual({...before,player:{...before.player,abilityRemaining:0}});expect(m.hand).toBe(2);
    expect(m.history[0].events.map(e=>e.type)).toEqual(['revealed','ability_used','retry']);
    const count=m.events.length;m=advanceMatch(m);expect(m.publicTrump).toBe('paper');expect(m.preparationComplete).toBe(true);expect(m.events).toHaveLength(count);
  });
  it('CPU exhaustion evaluates player challenge progress, while player exhaustion always fails', () => {
    const design=score('cards.finite','goal.streak_two');const m=createMatch(design,1);m.fighters.computer.cards={...empty};
    expect(commitComputer(m).result?.winner).toBe('computer');
    const achieved=structuredClone(m);achieved.fighters.player.winStreak=2;expect(commitComputer(achieved).result?.winner).toBe('player');
    achieved.fighters.player.cards={...empty};achieved.fighters.computer.cards.rock=1;expect(commitComputer(achieved).result?.winner).toBe('computer');
  });
});

describe('goal-aware fair AI and generated combinations', () => {
  function mostChosen(design:Design, player:Action, adjust:(m:MatchState)=>void=()=>{}) {
    const m=createMatch(design,1);adjust(m);const o=makeObservation(m);o.opponentLegal=[player];
    const counts:Record<string,number>={};let rng={algorithm:'mulberry32-v1' as const,state:17};
    for(let i=0;i<100;i++){const choice=chooseComputerAction(o,rng);rng=choice.rng;counts[choice.action.kind]=(counts[choice.action.kind]??0)+1;}
    return Object.entries(counts).sort((a,b)=>b[1]-a[1])[0][0];
  }
  it('minimizes CPU points for fewest-points and blocks an imminent player streak/draw goal',()=>{
    expect(mostChosen(score('goal.fewest_points'),a('rock'))).toBe('scissors');
    expect(mostChosen(score('goal.streak_two'),a('rock'),m=>{m.fighters.player.winStreak=1;})).toBe('paper');
    expect(mostChosen(score('goal.draw_three'),a('rock'),m=>{m.fighters.player.draws=2;})).not.toBe('rock');
  });
  it('completes random legal installed combinations with immutable input, bounded resources and at most C+3+2 attempts',()=>{
    fc.assert(fc.property(fc.array(fc.nat(41),{minLength:12,maxLength:50}),fc.nat(0xffffffff),(choices,seed)=>{
      let design=score();
      for(const index of choices){const preview=previewRuleChange(design,{type:'install',rule:RULES[index].id});if(preview.valid) design=commitRuleChange(design,preview);}
      if(design.cap>1) design=setAbility(setAbility(design,'player','ability.retry'),'computer','ability.retry');
      const compiled=compileDesign(design);let m=createMatch(design,seed);let rng={algorithm:'mulberry32-v1' as const,state:seed};let count=0;
      while(!m.result && count<design.cap+6){
        m=advanceMatch(m);if(m.result)break;
        const player=legalActions(m,'player'),cpu=legalActions(m,'computer');expect(player.length).toBeGreaterThan(0);expect(cpu.length).toBeGreaterThan(0);
        const pr=nextRandom(rng),cr=nextRandom(pr.rng);rng=cr.rng;
        const before=structuredClone(m);const after=pair(m,player[Math.floor(pr.value*player.length)],cpu[Math.floor(cr.value*cpu.length)]);expect(m).toEqual(before);m=after;count++;
        for(const f of Object.values(m.fighters)){expect(f.energy).toBeGreaterThanOrEqual(0);expect(f.energy).toBeLessThanOrEqual(compiled.energyCap);expect(f.life).toBeGreaterThanOrEqual(0);expect(f.life).toBeLessThanOrEqual(3);expect(f.energySpent).toBeGreaterThanOrEqual(0);expect(Object.values(f.cards).every(v=>v>=0)).toBe(true);expect(new Set(f.collected).size).toBe(f.collected.length);}
        expect(m.hand).toBe(m.history.filter(r=>!r.voided).length);
      }
      expect(m.result).not.toBeNull();expect(count).toBeLessThanOrEqual(design.cap+5);expect(m.hand).toBeLessThanOrEqual(design.cap+3);expect(m.history.filter(r=>r.voided)).toHaveLength(m.history.length-m.hand);
    }),{numRuns:240,seed:884411});
  },30000);
});
