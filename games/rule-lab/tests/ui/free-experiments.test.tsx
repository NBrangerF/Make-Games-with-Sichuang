// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { App } from '../../src/App';
vi.mock('../../src/presentation/audio', () => ({ audio: { init:vi.fn(async()=>true), play:vi.fn(), setMuted:vi.fn(), setVolume:vi.fn(), prepareReveal:vi.fn(), playResolution:vi.fn(), setTone:vi.fn(), cancelAll:vi.fn(), preview:vi.fn(()=>vi.fn()) } }));
beforeAll(() => {
  Object.defineProperty(window,'matchMedia',{configurable:true,value:(query:string)=>({matches:false,media:query,addListener(){},removeListener(){},addEventListener(){},removeEventListener(){}})});
  HTMLDialogElement.prototype.showModal=function(){this.open=true;};
  HTMLDialogElement.prototype.close=function(){this.open=false;};
});
beforeEach(()=>vi.useFakeTimers({toFake:['setTimeout','clearTimeout']}));
afterEach(()=>{cleanup();vi.useRealTimers();vi.restoreAllMocks();});
const click=(name:string)=>fireEvent.click(screen.getByRole('button',{name}));
const tick=async()=>act(async()=>{await vi.advanceTimersByTimeAsync(1000);});
async function library(){click('出石头');await tick();click('变化一下');click('自由组合');}

describe('author-controlled experiments and contextual portraits',()=>{
  it('keeps the original first screen and lets the first library choice create gas without health',async()=>{
    const {container}=render(<App/>);
    expect(screen.getAllByRole('button')).toHaveLength(3);
    expect(container.querySelector('.character-ribbon')).toBeNull();
    await library();
    click('试试主动蓄气');
    expect(screen.getByRole('button',{name:'出蓄气'})).toBeEnabled();
    expect(screen.getAllByLabelText('气 1 / 3')).toHaveLength(2);
    expect(screen.queryByLabelText(/生命/)).toBeNull();
    click('出蓄气');await tick();
    expect(screen.getByRole('button',{name:'再来一次'})).toBeInTheDocument();
    expect(screen.queryByRole('button',{name:'下一手'})).toBeNull();
  });
  it('allows a role without health, then uses a compact, reopenable portrait without changing gameplay',async()=>{
    const {container}=render(<App/>);await library();click('角色能力');click('试试剪刀忍者');
    const intro=screen.getByRole('dialog',{name:'你的角色，加入了'});
    expect(within(intro).getByRole('img')).toHaveAttribute('src',expect.stringContaining('scissors-ninja.png'));
    expect(intro).toHaveTextContent('当前没有生命');click('带着特性，出手');
    expect(container.querySelector('.has-character,.character-stand')).toBeNull();
    expect(screen.getByRole('complementary',{name:'你的角色：绯影'})).toBeInTheDocument();
    expect(container.querySelector('.arena>.character-ribbon')).not.toBeNull();
    click('查看角色：绯影');
    expect(screen.getByRole('dialog',{name:'你的角色'})).toHaveTextContent('剪刀');
    click('关闭');expect(screen.getByRole('button',{name:'出剪刀'})).toBeEnabled();
    expect(screen.queryAllByLabelText('气 1 / 3')).toHaveLength(0);
  });
  it('can install a dormant modifier, while selected cards stay unavailable and cancelled searches do not consume a choice',async()=>{
    render(<App/>);await library();
    const search=screen.getByRole('searchbox',{name:'查找变化'});
    fireEvent.change(search,{target:{value:'平局退牌'}});click('试试平局退牌');
    expect(screen.getByRole('button',{name:'出石头'})).toBeEnabled();
    await library();
    expect(screen.getByRole('button',{name:'试试平局退牌'})).toBeDisabled();
    click('关闭');expect(screen.getByRole('dialog',{name:'变化一下'})).toBeInTheDocument();
  });
});
