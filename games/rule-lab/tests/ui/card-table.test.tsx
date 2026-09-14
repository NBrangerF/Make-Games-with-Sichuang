// @vitest-environment jsdom
import {act,cleanup,fireEvent,render,screen,within} from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import {afterEach,beforeAll,it,expect,vi} from 'vitest';
import * as core from '../../src/core';
import {App} from '../../src/App';
import {ALL_CHOICES} from '../../src/content';
vi.mock('../../src/presentation/audio',()=>({audio:{init:vi.fn(async()=>true),play:vi.fn(),setMuted:vi.fn(),setVolume:vi.fn(),prepareReveal:vi.fn(),playResolution:vi.fn(),setTone:vi.fn(),cancelAll:vi.fn(),preview:vi.fn(()=>vi.fn())}}));
beforeAll(()=>{Object.defineProperty(window,'matchMedia',{configurable:true,value:(query:string)=>({matches:false,media:query,addListener(){},removeListener(){},addEventListener(){},removeEventListener(){}})});HTMLDialogElement.prototype.showModal=function(){this.open=true;};HTMLDialogElement.prototype.close=function(){this.open=false;};});
afterEach(()=>{cleanup();vi.useRealTimers();vi.restoreAllMocks();});
function fixture(...rules:core.RuleId[]){const d=rules.reduce(core.installRule,core.createDesign());vi.spyOn(core,'createDesign').mockReturnValue(d);render(<App/>);}
it('changes finite inventory into selectable physical cards and requires one confirmation',async()=>{vi.useFakeTimers();fixture('cards.finite');expect(screen.queryByRole('button',{name:'出石头'})).toBeNull();expect(screen.getAllByRole('button',{name:'选择石头'})).toHaveLength(3);fireEvent.click(screen.getAllByRole('button',{name:'选择石头'})[1]!);expect(screen.queryByRole('group',{name:'双方出手'})).toBeNull();fireEvent.click(screen.getByRole('button',{name:'打出石头'}));await act(async()=>vi.advanceTimersByTimeAsync(1000));expect(screen.getAllByRole('button',{name:'选择石头'})).toHaveLength(2);expect(screen.getByRole('button',{name:'再来一次'})).toBeInTheDocument();});
it('offers functional gesture cards directly, with no modifier or old information controls',()=>{fixture('experiment.modifiers');expect(screen.getByRole('button',{name:'选择饮血岩'})).toBeInTheDocument();expect(screen.getByRole('button',{name:'选择破甲剪'})).toBeInTheDocument();expect(screen.queryByRole('combobox')).toBeNull();fireEvent.click(screen.getByRole('button',{name:'选择饮血岩'}));expect(screen.getByRole('button',{name:'打出饮血岩'})).toBeEnabled();expect(screen.getByText(/当前一手决胜/)).toBeInTheDocument();});
it('keeps spatial decisions inside the card arena and never shows hidden opponent intent',()=>{fixture('experiment.deck','experiment.sites','experiment.range');const table=screen.getByRole('region',{name:'手牌战桌'});expect(within(table).getByRole('region',{name:'位置战场'})).toBeInTheDocument();fireEvent.click(screen.getByRole('button',{name:'前往右侧据点'}));expect(screen.getByRole('button',{name:'前往右侧据点'})).toHaveAttribute('aria-pressed','true');expect(table).not.toHaveTextContent('/ 对手');});
it('removes the four groups and their roles from every selectable surface',()=>{for(const id of ['experiment.declaration','experiment.queue','experiment.risk','experiment.forecast','ability.storyteller','ability.clockmaker','ability.smith'])expect(ALL_CHOICES.some(c=>c.id===id)).toBe(false);expect(ALL_CHOICES).toHaveLength(61);});
it('keeps fifteen cards mounted, browses an enlarged card with arrows, and collapses without playing',()=>{
 fixture('cards.finite','gesture.five');
 const hand=screen.getByRole('group',{name:'选择一张手牌'});
 const cards=within(hand).getAllByRole('button');expect(cards).toHaveLength(15);
 fireEvent.click(cards[0]!);
 expect(screen.getByRole('complementary',{name:'卡牌详情'})).toBeInTheDocument();
 expect(screen.queryByRole('group',{name:'双方出手'})).toBeNull();
 fireEvent.keyDown(cards[0]!,{key:'ArrowLeft'});
 expect(cards[14]).toHaveAttribute('aria-pressed','true');
 expect(screen.getByRole('button',{name:'打出瓦肯'})).toBeEnabled();
 fireEvent.click(screen.getByRole('button',{name:'查看下一张手牌'}));
 expect(cards[0]).toHaveAttribute('aria-pressed','true');
 fireEvent.click(screen.getByRole('button',{name:'收起卡牌详情'}));
 expect(screen.queryByRole('complementary',{name:'卡牌详情'})).toBeNull();
 expect(screen.getByRole('button',{name:'打出石头'})).toBeEnabled();
 expect(within(hand).getAllByRole('button')).toHaveLength(15);
});
it('moves detailed outcomes into an explicit overlay and keeps next-hand action on the table',async()=>{
 vi.useFakeTimers();fixture('cards.finite','life.knockout','experiment.sites');
 fireEvent.click(screen.getAllByRole('button',{name:'选择石头'})[0]!);
 fireEvent.click(screen.getByRole('button',{name:'打出石头'}));
 await act(async()=>vi.advanceTimersByTimeAsync(1000));
 expect(within(screen.getByRole('region',{name:'手牌战桌'})).getByRole('button',{name:'下一手'})).toBeInTheDocument();
 expect(screen.queryByRole('region',{name:'位置结算'})).toBeNull();
 fireEvent.click(screen.getByRole('button',{name:'本手效果 ↗'}));
 expect(within(screen.getByRole('dialog',{name:'本手效果'})).getByRole('region',{name:'位置结算'})).toBeInTheDocument();
});
