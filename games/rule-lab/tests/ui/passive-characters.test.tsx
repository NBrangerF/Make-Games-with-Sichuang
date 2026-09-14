// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import * as core from '../../src/core';
import * as content from '../../src/content';
import { App } from '../../src/App';
import { RulesView } from '../../src/ui/RulesView';
import { actionNames } from '../../src/ui/constants';
import { characters } from '../../src/presentation/Character';

vi.mock('../../src/presentation/audio',()=>({audio:{init:vi.fn(async()=>true),play:vi.fn(),setMuted:vi.fn(),setVolume:vi.fn(),prepareReveal:vi.fn(),playResolution:vi.fn(),setTone:vi.fn(),cancelAll:vi.fn(),preview:vi.fn(()=>vi.fn())}}));
beforeAll(()=>{
  Object.defineProperty(window,'matchMedia',{configurable:true,value:(query:string)=>({matches:false,media:query,addListener(){},removeListener(){},addEventListener(){},removeEventListener(){}})});
  HTMLDialogElement.prototype.showModal=function(){this.open=true;};
  HTMLDialogElement.prototype.close=function(){this.open=false;};
});
beforeEach(()=>vi.useFakeTimers({toFake:['setTimeout','clearTimeout']}));
afterEach(()=>{cleanup();vi.useRealTimers();vi.restoreAllMocks();});
const cases=[
  {id:'ability.scissors_ninja',gesture:'scissors',title:'剪刀忍者',name:'绯影',hint:'获胜基础伤害 2'},
  {id:'ability.rock_guardian',gesture:'rock',title:'岩拳卫士',name:'磐岳',hint:'获胜后得 1 盾'},
  {id:'ability.paper_trickster',gesture:'paper',title:'纸影术士',name:'白羽',hint:'与布打平 · 对手受 1 伤'},
] as const;
const click=(name:string|RegExp)=>fireEvent.click(screen.getByRole('button',{name}));
const tick=async(ms:number)=>act(async()=>{await vi.advanceTimersByTimeAsync(ms);});
const fixedSeed=(seed:number)=>vi.spyOn(crypto,'getRandomValues').mockImplementation(<T extends ArrayBufferView|null>(array:T):T=>{if(array instanceof Uint32Array)array.fill(seed);return array;});
const lifeDesign=()=>core.installRule(core.createDesign(),'life.knockout');

async function finishPublicMatch(){
  for(let hand=0;hand<90;hand++){
    if(screen.queryByRole('button',{name:'变化一下'}))return;
    if(screen.queryByRole('button',{name:'下一手'}))click('下一手');
    const gesture=(['rock','scissors','paper'] as const)[hand%3];
    click(`出${actionNames[gesture]}`);await tick(900);
  }
  throw new Error('Fixed public action policy did not finish within the test limit');
}
function targetRealOffer(id:core.AbilityId){
  const draw=content.drawChoices;
  vi.spyOn(content,'drawChoices').mockImplementation((context,input)=>{
    const card=content.getChoice(id);if(!card||!content.evaluateChoice(card,context).eligible)throw new Error(`Real experience has not unlocked ${id}`);
    for(let seed=0;seed<5000;seed++){
      const offer=draw(context,{...input,seed});
      if(offer.cards.some(card=>card.id===id))return offer;
    }
    throw new Error(`No eligible offer for ${id}`);
  });
}

// Controlled existing-work fixtures, with real commitment and resolution. Independent seed
// search only selects a repeatable outcome; the player always uses the specified fixed gesture.
describe('passive roles in the real App',()=>{
  it.each(cases)('$title needs no declaration and discloses its actual effect only on the shared deadline',async({id,gesture,name,hint})=>{
    const d=core.setAbility(lifeDesign(),'player',id);
    const seed=Array.from({length:80},(_,i)=>i).find(seed=>{
      const record=core.resolveAttempt(core.commitComputer(core.createMatch(d,seed)),{kind:gesture,boost:0,ability:false},'passive-visibility').history.at(-1)!;
      return record.events.some(e=>e.type==='passive_triggered'&&e.ability===id&&(e.amount??0)>0);
    });
    if(seed===undefined)throw new Error(`Missing effective passive fixture for ${id}`);
    vi.spyOn(core,'createDesign').mockReturnValue(d);fixedSeed(seed);
    const resolved=vi.spyOn(core,'resolveAttempt');
    const {container}=render(<App/>);
    const own=within(screen.getByRole('region',{name:'你的状态'}));
    if(id==='ability.rock_guardian'){
      expect(own.getByLabelText('护盾 0 / 1')).toBeInTheDocument();
      expect(within(screen.getByRole('region',{name:'对手的状态'})).queryByLabelText(/护盾/)).not.toBeInTheDocument();
    }
    expect(own.getByText('常驻')).toBeInTheDocument();
    expect(container.querySelector('.player .player-identity')).not.toHaveTextContent('0 / 1');
    expect(container.querySelector('.ability-toggle,.is-spent')).toBeNull();
    expect(screen.queryByText(/本场已用尽|本场已使用/)).not.toBeInTheDocument();
    expect(container.querySelectorAll('.action-passive-hint')).toHaveLength(1);
    expect(screen.getByRole('button',{name:`出${actionNames[gesture]}`})).toHaveTextContent(hint);
    expect(screen.getByRole('complementary',{name:`你的角色：${name}`})).not.toHaveClass('is-triggered');
    click(`出${actionNames[gesture]}`);
    const result=resolved.mock.results[0];if(result.type!=='return')throw new Error('Expected real resolution');
    const record=result.value.history.at(-1)!;
    expect(record.player.ability).toBe(false);expect(record.after.player.abilityRemaining).toBe(0);
    expect(container.querySelector('.mechanic-outcomes,.is-triggered')).toBeNull();
    expect(own.getByLabelText('生命 3 / 3')).toBeInTheDocument();
    expect(within(screen.getByRole('region',{name:'对手的状态'})).getByLabelText('生命 3 / 3')).toBeInTheDocument();
    await tick(899);expect(container.querySelector('.mechanic-outcomes,.is-triggered')).toBeNull();
    await tick(1);
    const effect=record.events.find(e=>e.type==='passive_triggered'&&e.ability===id)!;
    expect(effect.amount).toBeGreaterThan(0);
    expect(container.querySelector('.mechanic-outcomes')).toHaveTextContent(effect.text);
    expect(screen.getByRole('complementary',{name:`你的角色：${name}`})).toHaveClass('is-triggered');
    expect(container.querySelector('.is-spent,.ability-toggle')).toBeNull();
    if(id==='ability.rock_guardian'){
      expect(own.getByLabelText('护盾 1 / 1')).toBeInTheDocument();
      expect(within(screen.getByRole('region',{name:'对手的状态'})).queryByLabelText(/护盾/)).not.toBeInTheDocument();
      const shield=record.events.find(e=>e.type==='shield_gained'&&e.ability===id)!;
      const shown=[...container.querySelectorAll('.mechanic-outcomes>span')].map(node=>node.textContent);
      expect(shown).toContain(effect.text);expect(shown).not.toContain(shield.text);
    }
    if(id==='ability.scissors_ninja')expect(record.after.computer.life).toBe(1);
    if(id==='ability.paper_trickster'){expect(record.outcome).toBe('draw');expect(record.after.computer.life).toBe(2);expect(record.after.player.life).toBe(3);}
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  // These offers are drawn through actual eligibility after a complete life match. Seed search
  // isolates the card-to-introduction wiring; it does not measure random waiting time.
  it.each(cases)('introduces $title from a real offer as an automatic, unspent role',async({id,title,name})=>{
    const d=lifeDesign();vi.spyOn(core,'createDesign').mockReturnValue(d);fixedSeed(17);targetRealOffer(id);
    const {container}=render(<App/>);await finishPublicMatch();click('变化一下');click(title);await tick(270);
    const introduction=screen.getByRole('dialog',{name:'你的角色，加入了'});
    expect(introduction).toHaveTextContent('常驻特性');expect(introduction).toHaveTextContent('无需点击发动');
    expect(introduction).not.toHaveTextContent('先点击能力');
    expect(within(introduction).getByRole('img')).toHaveAttribute('src',expect.stringContaining(characters[id].image));
    click('带着特性，出手');
    expect(screen.getByRole('complementary',{name:`你的角色：${name}`})).toHaveClass('is-passive');
    expect(container.querySelector('.ability-toggle,.is-spent')).toBeNull();
  });

  it('keeps active and passive instructions separate in the rule panel',()=>{
    const passive=core.compileDesign(core.setAbility(lifeDesign(),'player','ability.paper_trickster'));
    const {rerender}=render(<RulesView compiled={passive} view="list"/>);
    expect(screen.getByText(/常驻角色特性/)).toHaveTextContent('不消耗每场次数');
    expect(screen.queryByText(/你的能力每场可用一次/)).not.toBeInTheDocument();
    const active=core.compileDesign(core.setAbility(lifeDesign(),'player','ability.insurance'));
    rerender(<RulesView compiled={active} view="list"/>);
    expect(screen.getByText(/你的能力每场可用一次/)).toBeInTheDocument();
    expect(screen.queryByText(/常驻角色特性/)).not.toBeInTheDocument();
  });

  it.each(['combo.three_styles','shield.guard_store','energy.overflow_shield'] as const)('shows both shield meters when %s is a shared source',rule=>{
    const rules:core.RuleId[]=rule==='combo.three_styles'?[rule]:rule==='energy.overflow_shield'?['energy.gesture_boost',rule]:['energy.gesture_boost','energy.active_charge','energy.wave','energy.guard',rule];
    const d=core.setAbility(rules.reduce((d,id)=>core.installRule(d,id),lifeDesign()),'player','ability.rock_guardian');
    vi.spyOn(core,'createDesign').mockReturnValue(d);fixedSeed(7);
    render(<App/>);
    for(const side of ['你的状态','对手的状态'])expect(within(screen.getByRole('region',{name:side})).getByLabelText('护盾 0 / 1')).toBeInTheDocument();
  });

  it('replaces a passive role with an active role in the same slot and restores its one-use control',async()=>{
    const d=core.setAbility(lifeDesign(),'player','ability.paper_trickster');
    vi.spyOn(core,'createDesign').mockReturnValue(d);fixedSeed(17);targetRealOffer('ability.insurance');
    const {container}=render(<App/>);
    expect(container.querySelector('.ability-toggle')).toBeNull();
    await finishPublicMatch();click('变化一下');click('保底');await tick(270);
    expect(screen.getByRole('dialog',{name:'你的能力，觉醒了'})).toHaveTextContent('每场一次 · 主动能力');
    click('带着能力，出手');
    expect(screen.getByRole('button',{name:/保底.*这手先留着/})).toBeEnabled();
    expect(container.querySelector('.player .player-identity')).toHaveTextContent('1 / 1');
    expect(container.querySelector('.is-passive,.passive-state-note,.action-passive-hint')).toBeNull();
    expect(screen.queryByRole('complementary',{name:'你的角色：白羽'})).not.toBeInTheDocument();
    expect(screen.getByRole('complementary',{name:'你的角色：青垒'})).not.toHaveClass('is-spent');
  });
});
