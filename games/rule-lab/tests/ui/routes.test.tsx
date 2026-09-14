// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import * as core from '../../src/core';
import * as content from '../../src/content';
import { App } from '../../src/App';

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
let wanted: string | null = null;
let chosenInUI: string[] = [];
let ownGestures = 0;
beforeEach(() => {
  wanted = null; chosenInUI = []; ownGestures = 0;
  vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
  let sequence = 702;
  vi.spyOn(crypto, 'getRandomValues').mockImplementation(<T extends ArrayBufferView | null>(array: T): T => {
    if (array instanceof Uint32Array) array.fill(++sequence);
    return array;
  });
  // This suite proves App wiring, not random waiting time. Search only a separate
  // offer seed, using the unmodified draw/eligibility implementation and real facts.
  // No replacement cards, fake facts, rule installation, or CPU input manipulation.
  vi.spyOn(content, 'drawChoices').mockImplementation((context, input) => {
    const target = wanted ? content.getChoice(wanted) : undefined;
    if (!target || !content.evaluateChoice(target, context).eligible) return realDraw(context, input);
    for (let seed = 0; seed < 5000; seed++) {
      const batch = realDraw(context, { ...input, seed });
      if (batch.cards.some(card => card.id === target.id)) return batch;
    }
    throw new Error(`No real offer contains eligible target ${target.id}`);
  });
});
afterEach(() => { cleanup(); vi.useRealTimers(); vi.restoreAllMocks(); });

const button = (name: string | RegExp) => screen.queryByRole('button', { name }) as HTMLButtonElement | null;
const click = (name: string | RegExp) => {
  if(typeof name==='string'&&name.startsWith('出')&&!screen.queryByRole('button',{name})){
    const label=name.slice(1);fireEvent.click(screen.getAllByRole('button',{name:`选择${label}`})[0]!);fireEvent.click(screen.getByRole('button',{name:`打出${label}`}));return;
  }
  fireEvent.click(screen.getByRole('button', { name }));
};
const tick = async (time: number) => { await act(async () => { await vi.advanceTimersByTimeAsync(time); }); };
const reveal = () => tick(1250);
const enabled = (name: string) => { const control = button(name); return !!control && !control.disabled; };
const player = () => within(screen.getByRole('region', { name: '你的状态' }));

type PublicUIPolicy = () => string;
// Strategy sees only rendered legal controls and the player's own earlier choices.
// In particular it never reads a spy of commitComputer or a hidden store.
const gasPolicy: PublicUIPolicy = () => {
  if (enabled('出波')) return '出波';
  if (enabled('出蓄气')) return '出蓄气';
  const boost = button('1 气 · +1 伤');
  if (boost && !boost.disabled && boost.getAttribute('aria-pressed') !== 'true') fireEvent.click(boost);
  const name = ['出石头', '出布', '出剪刀'][ownGestures++ % 3]!;
  return enabled(name) ? name : ['出石头', '出布', '出剪刀'].find(enabled)!;
};
const cardsPolicy: PublicUIPolicy = () => ['出石头', '出剪刀', '出布'].find(name=>enabled(name)||screen.queryAllByRole('button',{name:`选择${name.slice(1)}`}).some(b=>!(b as HTMLButtonElement).disabled))!;

async function finishGame(policy: PublicUIPolicy): Promise<void> {
  for (let turns = 0; turns < 80; turns++) {
    if (button('变化一下')) return;
    if (button('下一手')) { click('下一手'); continue; }
    if (button('再来一次')) { click('再来一次'); continue; }
    if (button('准备好了')) { click('准备好了'); continue; }
    if (button('带着能力，出手')) { click('带着能力，出手'); continue; }
    const action = policy();
    expect(action, 'The UI must expose a legal action or a way to advance').toBeTruthy();
    click(action);
    await reveal();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  }
  throw new Error('Public play did not finish this health encounter within the test safety limit');
}

async function chooseThroughUI(id: string, policy: PublicUIPolicy): Promise<void> {
  wanted = id;
  const title = content.getChoice(id)!.title;
  for (let games = 0; games < 60; games++) {
    await finishGame(policy);
    click('变化一下');
    const dialog = within(screen.getByRole('dialog'));
    const card = dialog.queryByRole('button', { name: title });
    if (card) {
      expect(document.querySelectorAll('.choice-card').length).toBeGreaterThanOrEqual(1);
      expect(document.querySelectorAll('.choice-card').length).toBeLessThanOrEqual(3);
      fireEvent.click(card);
      expect(document.querySelector('.choice-selected')).toHaveAttribute('data-choice-id', id);
      await tick(270);
      if (button('带着能力，出手')) click('带着能力，出手');
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
      chosenInUI.push(id);
      return;
    }
    // The actual experience gate is still closed. Do not inject the target card.
    click('先保持这样'); click('再来一次');
  }
  throw new Error(`Real play never made ${id} available in the App`);
}

describe('App connections across the refined rule journeys', () => {
  it('plays the full gas route through real offers, public controls and simultaneous reveals', async () => {
    const resolved = vi.spyOn(core, 'resolveAttempt');
    render(<App />);
    const route = ['life.knockout', 'ability.insurance', 'energy.gesture_boost', 'energy.active_charge', 'energy.wave', 'energy.guard'];
    for (const id of route) {
      await chooseThroughUI(id, gasPolicy);
      if (id === 'life.knockout') {
        expect(player().getByLabelText('生命 3 / 3')).toBeInTheDocument();
        expect(screen.getByText('第 1 次交锋')).toBeInTheDocument();
      }
      if (id === 'ability.insurance') expect(screen.getByRole('complementary',{name:'你的角色：青垒'})).toBeInTheDocument();
      if (id === 'energy.gesture_boost') {
        expect(player().getByLabelText('气 1 / 3')).toBeInTheDocument();
        expect(button('1 气 · +1 伤')).toBeEnabled();
        expect(button('出蓄气')).not.toBeInTheDocument();
      }
      if (id === 'energy.active_charge') expect(button('出蓄气')).toBeEnabled();
      if (id === 'energy.wave') expect(button('出波')).toBeDisabled(); // New game starts at 1 gas.
    }
    expect(chosenInUI).toEqual(route);
    expect(button('出防御')).toBeEnabled();
    click('出防御');
    expect(screen.getByRole('status')).toHaveTextContent('同时揭晓');
    expect(document.querySelectorAll('.duel-hand-caption strong')).toHaveLength(0);
    await reveal();
    expect(document.querySelector('.duel-hand--player .duel-hand-caption')).toHaveTextContent('防御');
    // Inspect only already resolved and displayed records as outcome evidence.
    const records = resolved.mock.results.flatMap(result => result.type === 'return' ? result.value.history.slice(-1) : []);
    expect(records.some(record => record.player.boost === 1)).toBe(true);
    expect(records.some(record => record.player.kind === 'charge')).toBe(true);
    expect(records.some(record => record.player.kind === 'wave' || record.computer.kind === 'wave')).toBe(true);
    expect(records.at(-1)?.player.kind).toBe('guard');
    expect(screen.getByRole('button', { name: '我的作品' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: '设置' })).not.toBeInTheDocument();
  }, 30000);

  it('plays into finite cards, sees depletion, shrinks inventory and exchanges before CPU lock', async () => {
    const commit = vi.spyOn(core, 'commitComputer');
    const exchanged = vi.spyOn(core, 'exchangeCards');
    render(<App />);
    for (const id of ['life.knockout', 'cards.finite']) await chooseThroughUI(id, cardsPolicy);
    expect(player().getByLabelText('石头 3 张')).toBeInTheDocument();
    for (let hand = 0; hand < 3; hand++) {
      click('出石头'); await reveal();
      expect(player().getByLabelText(`石头 ${2 - hand} 张`)).toBeInTheDocument();
      if (hand<2 || button('下一手')) click('下一手');
    }
    // Three real plays may also finish a three-life encounter. The depleted final
    // inventory remains visible; when play continues its action is disabled.
    if(button('出石头')){
      expect(button('出石头')).toBeDisabled();
      expect(button('出剪刀')).toBeEnabled();
    }
    await chooseThroughUI('cards.two_each', cardsPolicy);
    for (const label of ['石头', '剪刀', '布']) expect(player().getByLabelText(`${label} 2 张`)).toBeInTheDocument();
    await chooseThroughUI('cards.exchange_once', cardsPolicy);
    expect(chosenInUI).toEqual(['life.knockout', 'cards.finite', 'cards.two_each', 'cards.exchange_once']);
    expect(screen.getByRole('heading', { name: '要换一张牌吗？' })).toBeInTheDocument();
    const beforeExchangeCommitCount = commit.mock.calls.length;
    click('换牌 ↗');
    click('交出两张石头');
    click('换回布');
    click('交换');
    expect(exchanged).toHaveBeenCalledTimes(1);
    expect(commit).toHaveBeenCalledTimes(beforeExchangeCommitCount);
    expect(player().getByLabelText('石头 0 张')).toBeInTheDocument();
    expect(player().getByLabelText('剪刀 2 张')).toBeInTheDocument();
    expect(player().getByLabelText('布 3 张')).toBeInTheDocument();
    expect(button('本场已交换')).toBeDisabled();
    click('关闭');
    click('准备好了');
    expect(commit).toHaveBeenCalledTimes(beforeExchangeCommitCount + 1);
    expect(screen.queryByRole('button',{name:'选择石头'})).toBeNull();
    expect(screen.getAllByRole('button',{name:'选择布'})[0]).toBeEnabled();
    click('出布'); await reveal();
    expect(player().getByLabelText('布 2 张')).toBeInTheDocument();
    expect(document.querySelector('.duel-hand--player .duel-hand-caption')).toHaveTextContent('布');
  }, 30000);
});
