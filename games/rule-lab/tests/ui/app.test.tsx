// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest';
import * as core from '../../src/core';
import * as content from '../../src/content';
import { App } from '../../src/App';
import { actionNames } from '../../src/ui/constants';

vi.mock('../../src/presentation/audio', () => ({ audio: {
  init: vi.fn(async () => true), play: vi.fn(), setMuted: vi.fn(), setVolume: vi.fn(),
  prepareReveal: vi.fn(), playResolution: vi.fn(), setTone: vi.fn(), cancelAll: vi.fn(), preview: vi.fn(() => vi.fn()),
} }));

beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', { configurable: true, value: (query: string): MediaQueryList => ({
    matches: false, media: query, onchange: null, addListener: () => {}, removeListener: () => {},
    addEventListener: () => {}, removeEventListener: () => {}, dispatchEvent: () => true,
  }) });
  HTMLDialogElement.prototype.showModal = function () { this.open = true; };
  HTMLDialogElement.prototype.close = function () { this.open = false; };
});
const realDraw = content.drawChoices;
const removedChoices = new Set(['gesture.remove_rock', 'match.first_two', 'match.score_five', 'score.draw_point', 'score.combo', 'score.last_double', 'tempo.short_cap', 'tempo.extend_cap', 'tempo.extend_cap_again', 'ending.bounded_overtime', 'goal.collect_three', 'goal.draw_three', 'goal.streak_two', 'goal.first_five_points', 'goal.fewest_points', 'goal.efficient_wins', 'life.survive', 'life.last_hit_double', 'gesture.reverse', 'gesture.public_trump', 'cards.dealer_refill', 'U05', 'U14', 'U16', 'U17']);
let wanted: string[] = [];
beforeEach(() => {
  wanted=[];
  vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
  let seed=26;
  vi.spyOn(crypto, 'getRandomValues').mockImplementation(<T extends ArrayBufferView | null>(array: T): T => {
    if (array instanceof Uint32Array) array.fill(++seed);
    return array;
  });
  // Control only the independent card seed, never eligibility, experience, battle state or returned cards.
  // The route suite separately exercises unsearched seeds and public-information play strategies.
  vi.spyOn(content,'drawChoices').mockImplementation((context,input)=>{
    if(!wanted.length)return realDraw(context,input);
    for(let seed=0;seed<5000;seed++){
      const offer=realDraw(context,{...input,seed});
      if(wanted.every(id=>offer.cards.some(card=>card.id===id)))return offer;
    }
    throw new Error(`No eligible draw for ${wanted.join(',')}`);
  });
});
afterEach(() => { cleanup(); vi.useRealTimers(); vi.restoreAllMocks(); });
const click = (name: string | RegExp) => fireEvent.click(screen.getByRole('button', { name }));
const tick = async (time:number) => { await act(async () => { await vi.advanceTimersByTimeAsync(time); }); };
const finishReveal=()=>tick(1250);
async function firstHand() { click('出石头'); await finishReveal(); }
async function pick(name:string){click(name);await tick(270);}
const cardIDs=()=>[...document.querySelectorAll('.choice-card')].map(card=>card.getAttribute('data-choice-id'));
function latestCommitted(spy: MockInstance<typeof core.commitComputer>) {
  const latest=spy.mock.results.at(-1);
  if(!latest||latest.type!=='return')throw new Error('Expected a real computer commitment');
  return latest.value;
}
async function winHand(spy:MockInstance<typeof core.commitComputer>){
  const pending=latestCommitted(spy);
  // This fixture isolates HUD timing, not opponent strategy or journey reachability.
  const winning=core.legalActions(pending,'player').find(a=>core.rawOutcome(a.kind,pending.computerCommitment!.kind)==='player')!;
  click(`出${actionNames[winning.kind]}`);await finishReveal();
}

describe('refined webpage flow', () => {
  it('starts with three hands; conceals both choices until one shared deadline and reveals only two result actions', async () => {
    const resolve=vi.spyOn(core,'resolveAttempt');
    render(<App/>);
    expect(screen.getAllByRole('button').map(b=>b.getAttribute('aria-label'))).toEqual(['出石头','出剪刀','出布']);
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
    click('出剪刀');
    fireEvent.keyDown(window,{key:'1'});
    expect(resolve).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('status')).toHaveTextContent('同时揭晓');
    expect(document.querySelectorAll('.duel-hand-caption strong')).toHaveLength(0);
    expect(screen.queryAllByRole('button')).toHaveLength(0);
    await tick(899);
    expect(document.querySelectorAll('.duel-hand-caption strong')).toHaveLength(0);
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
    await tick(1);
    expect(document.querySelectorAll('.duel-hand-caption strong')).toHaveLength(2);
    expect(screen.getAllByRole('button').map(b=>b.textContent)).toEqual(['再来一次','变化一下']);
    expect(document.querySelector('header,footer,details,kbd')).toBeNull();
    expect(screen.queryByText(/回顾/)).not.toBeInTheDocument();
    expect(screen.getByRole('heading',{level:2})).toBeInTheDocument();
  });

  it('keeps the simple page simple over several full games with no automatic invitation', async()=>{
    render(<App/>);
    for(let i=0;i<3;i++){
      await firstHand();
      expect(screen.getAllByRole('button').map(b=>b.textContent)).toEqual(['再来一次','变化一下']);
      if(i<2){click('再来一次');expect(screen.getAllByRole('button')).toHaveLength(3);}
    }
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
    expect(document.querySelector('details,kbd,footer')).toBeNull();
  });

  it('freezes the three cards across rerender, closing, escape and cancelled/invalid naming; only a committed choice is consumed',async()=>{
    wanted=['U01','life.knockout','gesture.five'];
    const commit=vi.spyOn(core,'commitComputer');
    const {rerender}=render(<App/>);
    await firstHand();click('变化一下');
    const original=cardIDs();expect(original).toHaveLength(3);
    expect(screen.queryByRole('button',{name:'继续改规则'})).not.toBeInTheDocument();
    expect(screen.queryByRole('button',{name:'看看其他可能'})).not.toBeInTheDocument();
    rerender(<App/>);expect(cardIDs()).toEqual(original);
    click('先保持这样');click('变化一下');expect(cardIDs()).toEqual(original);
    fireEvent(screen.getByRole('dialog'),new Event('cancel',{cancelable:true}));
    click('变化一下');expect(cardIDs()).toEqual(original);
    expect(content.drawChoices).toHaveBeenCalledTimes(1);
    await pick('给它起个名字');
    const input=screen.getByRole('textbox',{name:'作品名称'});
    fireEvent.change(input,{target:{value:'中'.repeat(25)}});click('留下这个选择');
    expect(screen.getByRole('alert')).toHaveTextContent('24');
    click('先不改');expect(cardIDs()).toEqual(original);
    await pick('给它起个名字');
    fireEvent.change(screen.getByRole('textbox',{name:'作品名称'}),{target:{value:'留一拍'}});
    click('留下这个选择');
    expect(screen.getByRole('heading',{level:1})).toHaveTextContent('留一拍');
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
    expect(screen.queryByRole('button',{name:'变化一下'})).not.toBeInTheDocument();
    expect(commit).toHaveBeenCalledTimes(1);
    wanted=['U18'];click('再来一次');await firstHand();click('变化一下');
    expect(cardIDs()).not.toContain('U01');
    expect(content.drawChoices).toHaveBeenCalledTimes(2);
  });

  it('introduces card-earned UI only after selection, with no default works or rules controls, and honours the motion setting',async()=>{
    wanted=['U18'];render(<App/>);await firstHand();click('变化一下');
    await pick('放上声音与动效开关');
    expect(screen.getByRole('button',{name:'设置'})).toBeInTheDocument();
    expect(screen.queryByRole('button',{name:'我的作品'})).not.toBeInTheDocument();
    expect(screen.queryByRole('button',{name:'规则'})).not.toBeInTheDocument();
    click('设置');fireEvent.click(screen.getByRole('checkbox',{name:'减少动态效果'}));click('关闭');
    click('再来一次');click('出布');
    expect(document.querySelector('.duel-reveal--reduced')).toBeInTheDocument();
    await tick(79);expect(document.querySelectorAll('.duel-hand-caption strong')).toHaveLength(0);
    await tick(1);expect(document.querySelectorAll('.duel-hand-caption strong')).toHaveLength(2);
  });

  it('offers direct life after the first hand, excludes removed cards, and reveals damage only at the shared deadline',async()=>{
    wanted=['life.knockout'];
    const commit=vi.spyOn(core,'commitComputer');render(<App/>);await firstHand();click('变化一下');
    expect(content.ALL_CHOICES).toHaveLength(61);
    expect(content.ALL_CHOICES.some(card=>removedChoices.has(card.id))).toBe(false);
    expect(cardIDs().some(id=>removedChoices.has(id!))).toBe(false);
    click('三点生命');expect(document.querySelector('.choice-selected')).toBeInTheDocument();
    expect(commit).toHaveBeenCalledTimes(1);
    await tick(270);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();expect(commit).toHaveBeenCalledTimes(2);
    const life=latestCommitted(commit);
    expect(core.compileDesign(life.design).healthOnly).toBe(true);
    expect(screen.getByText('第 1 次交锋')).toBeInTheDocument();
    expect(document.querySelector('.match-score,.score-rules')).toBeNull();
    const damaging=core.legalActions(life,'player').find(a=>core.rawOutcome(a.kind,life.computerCommitment!.kind)==='player')!;
    click(`出${actionNames[damaging.kind]}`);
    expect(within(screen.getByRole('region',{name:'对手的状态'})).getByLabelText('生命 3 / 3')).toBeInTheDocument();
    expect(screen.queryByLabelText('生命 2 / 3')).not.toBeInTheDocument();
    await finishReveal();expect(within(screen.getByRole('region',{name:'对手的状态'})).getByLabelText('生命 2 / 3')).toBeInTheDocument();
    expect(screen.queryByRole('button',{name:'设置'})).not.toBeInTheDocument();
  });

  it('keeps first-round failures recoverable and cancels a selected card before committing',async()=>{
    wanted=['life.knockout'];const commit=vi.spyOn(core,'commitComputer');render(<App/>);await firstHand();click('变化一下');
    const original=cardIDs();click('三点生命');click('关闭');await tick(400);
    expect(commit).toHaveBeenCalledTimes(1);expect(screen.queryByRole('region',{name:'你的状态'})).not.toBeInTheDocument();
    click('变化一下');expect(cardIDs()).toEqual(original);
  });
  it.each([
    ['ability.claim_draw', '抢平', '绛刃', 'draw'],
    ['ability.insurance', '保底', '青垒', 'computer'],
    ['ability.retry', '再搏一次', '逐光', 'computer'],
  ] as const)('gives %s only to the player, introduces its portrait and resolves its actual effect', async (id, title, character, raw) => {
    const committed=vi.spyOn(core,'commitComputer');
    const resolved=vi.spyOn(core,'resolveAttempt');
    render(<App/>);
    await firstHand();
    wanted=['life.knockout']; click('变化一下'); await pick('三点生命');
    for(let hand=0;hand<3;hand++){await winHand(committed);if(hand<2)click('下一手');}
    wanted=[id]; click('变化一下');
    const card=screen.getByRole('button',{name:title});
    expect(within(card).getByRole('img')).toHaveAttribute('src',expect.stringContaining('/art/characters/'));
    await pick(title);
    expect(screen.getByRole('heading',{name:'你的能力，觉醒了'})).toBeInTheDocument();
    expect(screen.getByRole('heading',{name:character,level:3})).toBeInTheDocument();
    expect(latestCommitted(committed).design.abilities).toEqual({player:id,computer:null});
    click('带着能力，出手');
    expect(screen.getByRole('complementary',{name:`你的角色：${character}`})).toBeInTheDocument();
    const pending=latestCommitted(committed);
    const kind=core.legalActions(pending,'player').find(action=>core.rawOutcome(action.kind,pending.computerCommitment!.kind)===raw)!.kind;
    const shortTitle=id==='ability.retry'?'再搏':title;
    click(new RegExp(`^${shortTitle}.*这手先留着`));
    click(`出${actionNames[kind]}`);
    expect(screen.queryByText(/生效 ·/)).not.toBeInTheDocument();
    await finishReveal();
    const result=resolved.mock.results.at(-1)!;
    if(result.type!=='return')throw new Error('Missing result');
    const record=result.value.history.at(-1)!;
    expect(record.computer.ability).toBe(false);
    expect(record.player.ability).toBe(true);
    expect(result.value.fighters.player.abilityRemaining).toBe(0);
    if(id==='ability.retry')expect(record.voided).toBe(true);
    else expect(record.outcome).toBe(id==='ability.claim_draw'?'player':'draw');
    expect(screen.getByText(/生效 ·/)).toBeInTheDocument();
    expect(screen.queryByText(/对手获得|双方同时抢平|回顾/)).not.toBeInTheDocument();
  });

  it('continues healthy players beyond the former cap without a score, countdown or overtime', async()=>{
    const committed=vi.spyOn(core,'commitComputer');
    render(<App/>);await firstHand();
    wanted=['life.knockout'];click('变化一下');await pick('三点生命');
    // Controlled draws isolate the old-cap UI boundary, not route skill or AI behaviour.
    for(let hand=1;hand<=6;hand++){
      const pending=latestCommitted(committed);
      click(`出${actionNames[pending.computerCommitment!.kind]}`);
      await finishReveal();
      expect(screen.queryByRole('button',{name:'再来一次'})).not.toBeInTheDocument();
      expect(screen.getByRole('button',{name:'下一手'})).toBeInTheDocument();
      expect(screen.getByText(`第 ${hand} 次交锋`)).toBeInTheDocument();
      expect(document.querySelector('.match-score,.score-rules,.challenge-progress')).toBeNull();
      expect(document.body.textContent).not.toMatch(/加时|积分赛|第\s*\d+\s*\/\s*(5|9|13)\s*手/);
      for(const side of ['你的状态','对手的状态']) expect(within(screen.getByRole('region',{name:side})).getByLabelText('生命 3 / 3')).toBeInTheDocument();
      if(hand<6)click('下一手');
    }
  });

});
