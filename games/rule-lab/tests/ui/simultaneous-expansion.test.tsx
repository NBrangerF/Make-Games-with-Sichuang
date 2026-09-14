// @vitest-environment jsdom
import { act,cleanup,fireEvent,render,screen,within } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { afterEach,beforeAll,beforeEach,describe,expect,it,vi } from 'vitest';
import * as core from '../../src/core';
import { App } from '../../src/App';
import { PositionBoard, PositionOutcomes } from '../../src/experiments/PositionBoard';
import { ALL_CHOICES } from '../../src/content';
import { EXPERIMENT_RULES, visibleExperimentGroups } from '../../src/experiments/catalog';
import { ExperimentWorld } from '../../src/experiments/Interface';
vi.mock('../../src/presentation/audio',()=>({audio:{init:vi.fn(async()=>true),play:vi.fn(),setMuted:vi.fn(),setVolume:vi.fn(),prepareReveal:vi.fn(),playResolution:vi.fn(),setTone:vi.fn(),cancelAll:vi.fn(),preview:vi.fn(()=>vi.fn())}}));
beforeAll(()=>{Object.defineProperty(window,'matchMedia',{configurable:true,value:(query:string)=>({matches:false,media:query,addListener(){},removeListener(){},addEventListener(){},removeEventListener(){}})});HTMLDialogElement.prototype.showModal=function(){this.open=true;};HTMLDialogElement.prototype.close=function(){this.open=false;};});
beforeEach(()=>vi.useFakeTimers({toFake:['setTimeout','clearTimeout']}));
afterEach(()=>{cleanup();vi.useRealTimers();vi.restoreAllMocks();});
const click=(name:string)=>fireEvent.click(screen.getByRole('button',{name}));
const select=(name:string,value:string)=>fireEvent.change(screen.getByRole('combobox',{name}),{target:{value}});
const tick=()=>act(async()=>{await vi.advanceTimersByTimeAsync(1000);});
function fixture(...rules:core.RuleId[]){const d=rules.reduce(core.installRule,core.createDesign());vi.spyOn(core,'createDesign').mockReturnValue(d);return d;}

describe('simultaneous experiments in the real App',()=>{

  it('the free library filters new groups and installs a new role in the one player slot',async()=>{
    const {container}=render(<App/>);click('出石头');await tick();click('变化一下');click('自由组合');click('位置与空间');
    expect(screen.getByRole('button',{name:'试试三处据点'})).toBeInTheDocument();expect(screen.queryByRole('button',{name:'试试暗标争夺'})).toBeNull();
    click('角色能力');click('试试浪人追猎者');const intro=screen.getByRole('dialog',{name:'你的能力，觉醒了'});
    expect(within(intro).getByRole('img')).toHaveAttribute('src',expect.stringContaining('showa/claim-draw.png'));
    click('带着能力，出手');expect(screen.getByRole('complementary',{name:'你的角色：逐风'})).toBeInTheDocument();
    expect(container.querySelector('.character-stand')).toBeNull();expect(screen.getByRole('button',{name:'出石头'})).toBeEnabled();
  });
});

describe('focused release and readable position play', () => {
  it('keeps only spatial and physical-card groups in every selection catalog while retaining hidden engine rules', () => {
    expect(visibleExperimentGroups).toEqual(['位置与空间','手牌与构筑']);
    const visible = ALL_CHOICES.filter(c => c.id.startsWith('experiment.')).map(c => c.id);
    expect(visible).toHaveLength(8);
    for (const rule of EXPERIMENT_RULES) expect(visible.includes(rule.id)).toBe(visibleExperimentGroups.includes(rule.group));
    for (const id of ['ability.scrapper','ability.broker','ability.monk','ability.cartographer']) expect(ALL_CHOICES.some(c => c.id === id)).toBe(false);
    expect(core.installRule(core.createDesign(),'experiment.factory').rules).toContain('experiment.factory');
  });

  it('explains independent capture after losing and an out-of-range winner without inventing damage', () => {
    const design = ['life.knockout','experiment.sites','experiment.range','experiment.push'].reduce((d,r) => core.installRule(d,r as core.RuleId),core.createDesign());
    const base = core.createMatch(design,2);
    const match = core.resolveAttempt({...base,phase:'awaitingPlayer',preparationComplete:true,computerCommitment:{kind:'rock',boost:0,ability:false,experiment:{site:2,move:1}}},{kind:'scissors',boost:0,ability:false,experiment:{site:0,move:1}},'position-test');
    const {container} = render(<PositionOutcomes match={match}/>);
    expect(container).toHaveTextContent('错开争夺，各自占领');
    expect(container).toHaveTextContent('对手的获胜攻击超出射程，本手主伤害为 0');
    expect(match.experiment!.sites).toEqual(['player',null,'computer']);
    expect(match.fighters.player.life).toBe(base.fighters.player.life);
  });

});
