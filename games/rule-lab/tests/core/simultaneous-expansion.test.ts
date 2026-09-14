import { describe,it,expect } from 'vitest';
import { advanceMatch,compileDesign,commitComputer,createDesign,createMatch,installRule,legalActions,removeRule,resolveAttempt,setAbility,projectPublicView,makeObservation,compareReplay,type Action,type MatchState,type RuleId } from '../../src/core';
import { sealInformation } from '../../src/core/match';
import { EXPERIMENT_RULES,EXPERIMENT_ABILITIES,type ExperimentKey } from '../../src/experiments/catalog';
import { declareExperiment,declarationsNeeded,drawExperimentRisk,publicExperiment } from '../../src/experiments/engine';
const action=(kind:Action['kind']='rock',experiment:Action['experiment']={},ability=false):Action=>({kind,boost:0,ability,experiment});
function start(keys:ExperimentKey[],supported=true){
  const rules:RuleId[]=[...(supported?['life.knockout','energy.active_charge','energy.cap_five','cards.finite'] as RuleId[]:[]),...keys.map(k=>`experiment.${k}` as RuleId)];
  let m=createMatch(rules.reduce(installRule,createDesign()),81);
  if(supported)for(const s of ['player','computer'] as const)m.fighters[s].energy=5;
  return m;
}
function ready(m:MatchState){if(declarationsNeeded(m))m=declareExperiment(m,{kind:'rock',pledge:false,promise:'none'},compileDesign(m.design));return m;}
function play(m:MatchState,p=action(),cpu=action('scissors')){m=ready(structuredClone(m));if(m.experiment)m.experiment.fighters.computer.signal={kind:'scissors',pledge:false,promise:'none'};return resolveAttempt({...m,phase:'awaitingPlayer',preparationComplete:true,computerCommitment:cpu},p,`test-${m.attempt}`);}
const text=(m:MatchState)=>m.history.at(-1)!.events.map(e=>e.text).join('\n');

describe('Retained simultaneous mechanics have executable outcomes',()=>{
  it('registers all 39 and preserves one-hand experiments when unsupported',()=>{
    expect(EXPERIMENT_RULES).toHaveLength(23);
    for(const r of EXPERIMENT_RULES){const m=play(start([r.key],false));expect(m.result?.reason,r.id).toBe('single');expect(m.hand).toBe(1);expect(m.fighters.player.energy).toBe(0);expect(m.design.rules).toContain(r.id);}
  });

  it('claims different sites independently, and settles contested sites by RPS',()=>{const m=start(['sites']);expect(play(m,action('rock',{site:0}),action('scissors',{site:2})).experiment!.sites).toEqual(['player',null,'computer']);expect(play(m,action('rock',{site:1}),action('scissors',{site:1})).experiment!.sites[1]).toBe('player');});
  it('awards terrain once and leaves unsupported terrain dormant',()=>{const m=play(start(['sites','terrain']),action('rock',{site:1}),action('scissors',{site:2}));expect(m.fighters.player.shield).toBe(1);expect(m.fighters.computer.cards.scissors).toBe(3);expect(play(start(['terrain'],false)).experiment!.sites).toEqual([null,null,null]);});
  it('pushes at the wall and adds damage, without replacing the goal',()=>{const m=start(['push']);m.experiment!.fighters.computer.position=4;const n=play(m);expect(n.fighters.computer.life).toBe(1);expect(n.design.goal).toBe('knockout');});
  it('resolves shared movement before range; winning can miss damage',()=>{const n=play(start(['range']),action('rock',{move:1}),action('scissors',{move:0}));expect(n.experiment!.distance).toBe(2);expect(n.history[0].outcome).toBe('player');expect(n.fighters.computer.life).toBe(3);});
  it('gives the auction to the high bidder even when that bidder loses combat',()=>{const n=play(start(['auction']),action('rock',{bid:0}),action('scissors',{bid:2}));expect(n.fighters.computer.life).toBe(2);expect(n.fighters.computer.shield).toBe(1);expect(n.fighters.computer.energy).toBe(3);expect(n.history[0].outcome).toBe('player');});
  it('all-pay charges the losing bid too, and draws do not invent a winner',()=>{const n=play(start(['auction','all_pay']),action('rock',{bid:1}),action('scissors',{bid:2}));expect(n.fighters.player.energy).toBe(4);expect(n.fighters.computer.energy).toBe(3);const draw=play(start(['auction','all_pay']),action('rock',{bid:1}),action('rock',{bid:1}));expect(text(draw)).toContain('流拍');expect(draw.fighters.player.shield).toBe(0);});
  it('workers at different stations both act; a contested draw has no output',()=>{const m=start(['workers']);expect(play(m,action('rock',{worker:1}),action('scissors',{worker:2})).fighters.player.shield).toBe(1);expect(play(m,action('rock',{worker:1}),action('rock',{worker:1})).fighters.player.shield).toBe(0);});

  it('completes and reveals a private mission once without replacing victory',()=>{const m=start(['mission']);m.experiment!.fighters.player.mission=0;m.fighters.player.energy=1;const n=play(m,action('paper'),action('paper'));expect(n.experiment!.fighters.player.missionDone).toBe(true);expect(n.fighters.player.energy).toBe(3);expect(n.design.goal).toBe('knockout');});
  it('collects defeated enemy gestures and exchanges sets without ending the battle',()=>{const m=start(['collection']);m.experiment!.fighters.player.trophies=['rock','paper'];m.fighters.player.energy=0;const n=play(m);expect(n.experiment!.fighters.player.trophies).toEqual([]);expect(n.fighters.player.energy).toBe(2);expect(n.result).toBeNull();});
  it('uses opening bounty rather than picking the rich side after spending',()=>{const m=start(['bounty']);m.experiment!.bounty='computer';m.fighters.player.energy=1;expect(play(m).fighters.player.energy).toBe(2);});
  it('rewards tied least-used gestures without changing the outcome matrix',()=>{const m=start(['rarity']);m.fighters.player.energy=1;const n=play(m);expect(n.fighters.player.energy).toBe(2);expect(n.history[0].outcome).toBe('player');});
  it('factory consumes current attack and produces only in the next effective hand',()=>{const m=start(['factory']);m.fighters.player.energy=2;const n=play(m,action('rock',{build:true}));expect(n.fighters.computer.life).toBe(3);expect(n.fighters.player.energy).toBe(1);expect(advanceMatch(n).fighters.player.energy).toBe(2);});
  it('technology chooses one irreversible per-match branch and can stay dormant',()=>{const m=start(['factory','technology']);m.experiment!.fighters.player.factory=1;const n=play(m,action('rock',{upgrade:'shield'}));expect(advanceMatch(n).fighters.player.shield).toBe(1);expect(()=>play(advanceMatch(n),action('rock',{upgrade:'energy'}))).toThrow();expect(play(start(['technology'],false)).design.rules).toContain('experiment.technology');});
  it('converter is bounded to one event and does not fabricate inventory',()=>{const m=start(['converter','auction']);m.fighters.player.energy=1;expect(play(m,action('rock',{converter:'shield_energy'})).fighters.player.energy).toBe(2);const n=play(start(['converter'],false),action('rock',{converter:'shield_energy'}));expect(n.fighters.player.energy).toBe(0);});
  it('places geometric puzzle pieces and clears only complete rows',()=>{const m=start(['puzzle']);m.experiment!.fighters.player.piece='rock';m.experiment!.fighters.player.board[2]=1;m.fighters.player.energy=1;const n=play(m,action('rock',{cell:0,rotation:0}));expect(n.experiment!.fighters.player.board.slice(0,3)).toEqual([0,0,0]);expect(n.fighters.player.energy).toBe(2);expect(()=>play(m,action('rock',{cell:2}))).toThrow(/放不下/);});

  it('sharing payoff depends on both simultaneous commitments',()=>{const m=start(['sharing']);m.fighters.player.energy=m.fighters.computer.energy=0;const n=play(m,action('rock',{sharing:'share'}),action('scissors',{sharing:'take'}));expect(n.fighters.player.energy).toBe(0);expect(n.fighters.computer.energy).toBe(2);});
  it('trade matches offers and separately reserves the played card',()=>{const m=start(['trade']);const n=play(m,action('rock',{give:'paper',want:'scissors'}),action('scissors',{give:'scissors',want:'paper'}));expect(n.fighters.player.cards.paper).toBe(2);expect(n.fighters.player.cards.scissors).toBe(4);m.fighters.player.cards.rock=1;expect(()=>play(m,action('rock',{give:'rock',want:'paper'}))).toThrow(/预留/);});

});

describe('transaction boundaries and experimental roles',()=>{

  it('keeps all new rules after removing health',()=>{let d=EXPERIMENT_RULES.reduce((d,r)=>installRule(d,r.id),installRule(createDesign(),'life.knockout'));d=removeRule(d,'life.knockout');expect(d.rules).toHaveLength(23);expect(d.goal).toBe('single');});
  it.each(EXPERIMENT_ABILITIES)('$title has a legal player-only installation and never adds a CPU ability',role=>{const d=setAbility(createDesign(),'player',role.id);expect(compileDesign(d).abilities.player).toBe(role.id);expect(()=>setAbility(createDesign(),'computer',role.id)).toThrow();expect(play(createMatch(d,1),{kind:'rock',boost:0,ability:role.activation==='active'}).hand).toBe(1);});

  it('ronin trades main damage for an extra step and only consumes one activation',()=>{let m=start(['push']);m.design=setAbility(m.design,'player','ability.ronin');m=createMatch(m.design,8);const n=play(m,action('rock',{},true));expect(n.fighters.computer.life).toBe(3);expect(n.experiment!.fighters.computer.position).toBe(2);expect(n.fighters.player.abilityRemaining).toBe(0);});

  it('broker refunds a paid losing bid, but never creates a refund in winner-pay',()=>{let m=start(['auction','all_pay']);m.design=setAbility(m.design,'player','ability.broker');m=createMatch(m.design,8);m.fighters.player.energy=m.fighters.computer.energy=3;const n=play(m,action('rock',{bid:1},true),action('scissors',{bid:2}));expect(n.fighters.player.energy).toBe(3);m.design=removeRule(m.design,'experiment.all_pay');expect(play(m,action('rock',{bid:1},true),action('scissors',{bid:2})).fighters.player.energy).toBe(3);});
  it('kite trades moving victory for relief from wall pressure',()=>{let m=start(['range','push']);m.design=setAbility(m.design,'player','ability.kite');m=createMatch(m.design,8);m.experiment!.fighters.player.position=4;const n=play(m,action('rock',{move:1},true));expect(n.experiment!.fighters.player.position).toBe(2);expect(n.fighters.computer.life).toBe(3);});

  it('monk gives the first betrayed share a shield after, not before, damage',()=>{let m=start(['sharing']);m.design=setAbility(m.design,'player','ability.monk');m=createMatch(m.design,8);m=play(m,action('scissors',{sharing:'share'}),action('rock',{sharing:'take'}));expect(m.fighters.player.life).toBe(2);expect(m.fighters.player.shield).toBe(1);m=play(advanceMatch(m),action('scissors',{sharing:'share'}),action('rock',{sharing:'take'}));expect(m.fighters.player.shield).toBe(0);});

  it('cartographer clears one occupied cell before a legal piece placement',()=>{let m=start(['puzzle']);m.design=setAbility(m.design,'player','ability.cartographer');m=createMatch(m.design,8);m.experiment!.fighters.player.piece='rock';m.experiment!.fighters.player.board[0]=1;expect(()=>play(m,action('rock',{cell:0}))).toThrow();const n=play(m,action('rock',{cell:0},true));expect(n.experiment!.fighters.player.board.slice(0,2)).toEqual([1,1]);expect(n.fighters.player.abilityRemaining).toBe(0);});

  it('a spent old shield can be replaced and count as a new conversion',()=>{const m=start(['workers','converter']);m.fighters.player.shield=1;m.fighters.player.energy=1;const n=play(m,action('scissors',{worker:1,converter:'shield_energy'}),action('rock',{worker:0}));expect(n.fighters.player.life).toBe(3);expect(n.fighters.player.shield).toBe(1);expect(n.fighters.player.energy).toBe(2);});

  it('shield conversion includes the existing aegis ability even if that shield was consumed',()=>{let m=start(['converter']);m.design=setAbility(m.design,'player','ability.aegis');m=createMatch(m.design,8);m.fighters.player.energy=1;const n=play(m,action('scissors',{converter:'shield_energy'},true),action('rock'));expect(n.fighters.player.energy).toBe(2);expect(n.fighters.player.shield).toBe(0);});

  it('moving away from wall pressure occurs before being pushed back',()=>{const m=start(['range','push']);m.experiment!.fighters.player.position=4;const n=play(m,action('scissors',{move:-1}),action('rock'));expect(n.experiment!.fighters.player.position).toBe(4);expect(n.fighters.player.life).toBe(2);});

  it('all mechanics can coexist with bounded resources and legal computer commitments',()=>{
    for(let seed=0;seed<12;seed++){
      let d=['life.knockout','energy.active_charge','energy.wave','energy.gesture_boost','energy.cap_five','cards.finite'].reduce((d,id)=>installRule(d,id as RuleId),createDesign());
      for(const rule of EXPERIMENT_RULES)d=installRule(d,rule.id);
      d=setAbility(d,'player',EXPERIMENT_ABILITIES[seed%EXPERIMENT_ABILITIES.length]!.id);let m=createMatch(d,seed);
      for(let step=0;step<5&&!m.result;step++){
        m=ready(advanceMatch(m));m=commitComputer(m);if(m.result)break;
        const a=legalActions(m,'player').find(a=>!a.boost&&!a.wager&&!a.ability)??legalActions(m,'player')[0]!;
        m=resolveAttempt(m,a,`mixed-${step}`);
        for(const f of Object.values(m.fighters)){expect(f.energy).toBeGreaterThanOrEqual(0);expect(f.energy).toBeLessThanOrEqual(5);expect(f.life).toBeGreaterThanOrEqual(0);expect(Object.values(f.cards).every(n=>n>=0)).toBe(true);}
      }
    }
  });
});
