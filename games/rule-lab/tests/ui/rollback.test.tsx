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
  Object.defineProperty(window, 'matchMedia', { configurable: true, value: (query: string) => ({
    matches: false, media: query, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {},
  }) });
  HTMLDialogElement.prototype.showModal = function () { this.open = true; };
  HTMLDialogElement.prototype.close = function () { this.open = false; };
});

const realDraw = content.drawChoices;
let wanted: string | null;
let fixedSeed: number | null;
let ownActions: number;
beforeEach(() => {
  wanted = null; fixedSeed = null; ownActions = 0;
  vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
  let seed = 1300;
  vi.spyOn(crypto, 'getRandomValues').mockImplementation(<T extends ArrayBufferView | null>(array: T): T => {
    if (array instanceof Uint32Array) array.fill(fixedSeed ?? ++seed);
    return array;
  });
  // Offer-seed search isolates UI wiring. Eligibility, actual play, committed
  // choices and returned cards are untouched; this is not a waiting-time study.
  vi.spyOn(content, 'drawChoices').mockImplementation((context, input) => {
    const target = wanted ? content.getChoice(wanted) : undefined;
    if (!target || !content.evaluateChoice(target, context).eligible) return realDraw(context, input);
    for (let seed = 0; seed < 5000; seed++) {
      const batch = realDraw(context, { ...input, seed });
      if (batch.cards.some(card => card.id === target.id)) return batch;
    }
    throw new Error(`No eligible real offer for ${target.id}`);
  });
});
afterEach(() => { cleanup(); vi.useRealTimers(); vi.restoreAllMocks(); });

const button = (name: string | RegExp) => screen.queryByRole('button', { name }) as HTMLButtonElement | null;
const click = (name: string | RegExp) => fireEvent.click(screen.getByRole('button', { name }));
const tick = async (ms: number) => { await act(async () => { await vi.advanceTimersByTimeAsync(ms); }); };
const reveal = () => tick(950);
const offerIDs = () => [...document.querySelectorAll('.choice-card')].map(card => card.getAttribute('data-choice-id'));
const isEnabled = (name: string) => !!button(name) && !button(name)!.disabled;

async function publicHand() {
  const names = ['出石头', '出布', '出剪刀', '出蜥蜴', '出瓦肯手'];
  const name = names[ownActions++ % names.length]!;
  click(isEnabled(name) ? name : names.find(isEnabled)!);
  await reveal();
}
async function publicFinish() {
  // Safety bound belongs only to the test. The game has no fixed hand limit.
  for (let i = 0; i < 100; i++) {
    if (button('变化一下')) return;
    if (button('下一手')) { click('下一手'); continue; }
    if (button('再来一次')) { click('再来一次'); continue; }
    if (button('带着能力，出手')) { click('带着能力，出手'); continue; }
    await publicHand();
  }
  throw new Error('Public play exceeded the test safety limit');
}
async function chooseReal(id: string) {
  const target=content.getChoice(id);
  if(!target)throw new Error(`The route requested a retired or unknown card: ${id}`);
  wanted = id;
  for (let games = 0; games < 30; games++) {
    await publicFinish(); click('变化一下');
    const card = within(screen.getByRole('dialog')).queryByRole('button', { name: target.title });
    if (card) {
      fireEvent.click(card); await tick(270);
      if (button('带着能力，出手')) click('带着能力，出手');
      return;
    }
    click('先保持这样'); click('再来一次');
  }
  throw new Error(`Actual play did not unlock ${id}`);
}
function returned<T extends (...args: never[]) => unknown>(spy: MockInstance<T>): ReturnType<T> {
  const last = spy.mock.results.at(-1);
  if (!last || last.type !== 'return') throw new Error('Expected actual returned state');
  return last.value as ReturnType<T>;
}
function fixtureDesign(...rules: core.RuleId[]) {
  return rules.reduce((design, rule) => core.installRule(design, rule), core.createDesign());
}
// Only the explicitly controlled boundary fixtures below read the commitment.
// The two public flow tests never use this helper or hidden CPU actions.
async function controlledDraw(commit: MockInstance<typeof core.commitComputer>) {
  click(`出${actionNames[returned(commit).computerCommitment!.kind]}`);
  await reveal();
}

describe('rollback through public App controls', () => {
  it('stays hidden during hands one through four and unlocks after four disclosed hands across games, including identical seeds', async () => {
    fixedSeed = 42;
    render(<App />);
    for (let hand = 1; hand <= 4; hand++) {
      expect(button('回退')).not.toBeInTheDocument();
      click('出石头');
      await tick(899);
      expect(button('回退')).not.toBeInTheDocument();
      await tick(1);
      if (hand < 4) {
        expect(button('回退')).not.toBeInTheDocument();
        expect(screen.getAllByRole('button').map(item => item.textContent)).toEqual(['再来一次', '变化一下']);
        click('再来一次');
      }
    }
    expect(button('回退')).toBeEnabled();
    expect(button('我的作品')).not.toBeInTheDocument();
    click('回退');
    expect(screen.getByRole('dialog', { name: '回退一条规则' })).toHaveTextContent('还没有可以取消的规则');
    expect(button('确认取消并重开')).not.toBeInTheDocument();
    click('关闭');
    click('再来一次');
    expect(button('回退')).toBeEnabled();
    expect(screen.getAllByRole('button', { name: /^出/ })).toHaveLength(3);
  });

  it('cancels an earlier real choice while retaining its experimental ability, preserves the later gesture choice and consumed pool, and keeps unlocks through restoration', async () => {
    const create = vi.spyOn(core, 'createMatch');
    render(<App />);
    const selected = ['life.knockout', 'gesture.five', 'ability.insurance', 'energy.gesture_boost'];
    for (const id of selected.slice(0,3)) await chooseReal(id);
    // Two real rules plus an ability are still only two rule introductions.
    expect(button('我的作品')).not.toBeInTheDocument();
    await chooseReal(selected[3]);
    expect(button('回退')).toBeEnabled();
    expect(button('我的作品')).toBeEnabled();
    await publicFinish();
    wanted = null; click('变化一下');
    const frozen = offerIDs(), draws = vi.mocked(content.drawChoices).mock.calls.length;
    click('先保持这样');
    const previous = returned(create);
    click('回退'); click('取消三点生命');
    const preview = screen.getByRole('dialog');
    expect(preview).toHaveTextContent('三点生命');
    expect(preview).not.toHaveTextContent('保底');
    expect(preview).not.toHaveTextContent('让手势带上气');
    expect(preview).toHaveTextContent(/重开|重新开始/);
    click('先不取消');
    expect(returned(create).id).toBe(previous.id);
    expect(screen.getByRole('complementary', { name: '你的角色：青垒' })).toBeInTheDocument();
    click('变化一下');
    expect(offerIDs()).toEqual(frozen);
    expect(content.drawChoices).toHaveBeenCalledTimes(draws);
    click('先保持这样');
    click('回退'); click('取消三点生命'); click('确认取消并重开');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    const changed = returned(create);
    expect(changed.id).not.toBe(previous.id);
    expect(changed.design.rules).toEqual(['gesture.five', 'energy.gesture_boost']);
    expect(changed.design.abilities).toEqual({ player: 'ability.insurance', computer: null });
    expect(changed.hand).toBe(0);
    expect(screen.queryByRole('region', { name: '你的状态' })).toBeInTheDocument();
    expect(screen.queryByRole('complementary')).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /^出/ })).toHaveLength(5);
    expect(button('回退')).toBeEnabled();
    expect(button('我的作品')).toBeEnabled();
    expect(button('变化一下')).not.toBeInTheDocument();
    expect(content.drawChoices).toHaveBeenCalledTimes(draws);
    await publicFinish(); click('变化一下');
    const after = vi.mocked(content.drawChoices).mock.calls.at(-1)![0];
    expect(after.journey.choices).toEqual(selected);
    expect(after.journey.introducedRuleIds).toEqual(['life.knockout','gesture.five','energy.gesture_boost']);
    expect(offerIDs().some(id => selected.includes(id!))).toBe(false);
    expect(content.evaluateChoice(content.getChoice('life.knockout')!, after).eligible).toBe(false);
    click('先保持这样');
    click('我的作品');
    // The newest version is the real snapshot immediately before this rollback.
    fireEvent.click(screen.getAllByRole('button', { name: '试回这一版' })[0]!);
    expect(returned(create).design.rules).toEqual(['life.knockout', 'gesture.five', 'energy.gesture_boost']);
    expect(returned(create).design.abilities.player).toBe('ability.insurance');
    expect(button('回退')).toBeEnabled();
    click('我的作品'); click('回到第一手'); click('开始一张白纸');
    expect(button('回退')).not.toBeInTheDocument();
    expect(button('我的作品')).not.toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /^出/ })).toHaveLength(3);
  }, 30000);

  it('does not let rollback interrupt a selected card animation', async () => {
    render(<App />);
    for (let i = 0; i < 4; i++) { await publicHand(); if (i < 3) click('再来一次'); }
    wanted = 'gesture.five'; click('变化一下'); click('加入五手势');
    expect(document.querySelector('.choice-selected')).toHaveAttribute('data-choice-id', 'gesture.five');
    expect(button('回退')).toBeDisabled();
    click('回退');
    expect(screen.getByRole('dialog', { name: '变化一下' })).toBeInTheDocument();
    await tick(270);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(button('回退')).toBeEnabled();
    expect(screen.getAllByRole('button', { name: /^出/ })).toHaveLength(5);
  });
});

describe('controlled rollback timing fixtures, not journey reachability', () => {
  it('does not count a voided retry toward the fifth-hand unlock', async () => {
    const design = core.setAbility(fixtureDesign('life.knockout'), 'player', 'ability.retry');
    vi.spyOn(core, 'createDesign').mockReturnValue(design);
    const commit = vi.spyOn(core, 'commitComputer');
    const resolve = vi.spyOn(core, 'resolveAttempt');
    render(<App />);
    for (let hand = 0; hand < 3; hand++) { await controlledDraw(commit); click('下一手'); }
    expect(button('回退')).not.toBeInTheDocument();
    const state = returned(commit);
    const lose = core.legalActions(state, 'player').find(action => !action.boost && !action.ability && core.rawOutcome(action.kind, state.computerCommitment!.kind) === 'computer')!;
    click(/^再搏.*这手先留着/); click(`出${actionNames[lose.kind]}`); await reveal();
    expect(returned(resolve).history.at(-1)?.voided).toBe(true);
    expect(returned(resolve).hand).toBe(3);
    expect(button('回退')).not.toBeInTheDocument();
    click('重新出这一手'); await controlledDraw(commit);
    expect(returned(resolve).history.at(-1)?.voided).toBe(false);
    expect(returned(resolve).hand).toBe(4);
    expect(button('回退')).toBeEnabled();
  });

  it('blocks rollback during a shared reveal, then removes only a chosen player ability and resets the active encounter', async () => {
    const design = core.setAbility(fixtureDesign('life.knockout', 'gesture.five'), 'player', 'ability.insurance');
    vi.spyOn(core, 'createDesign').mockReturnValue(design);
    const commit = vi.spyOn(core, 'commitComputer');
    const create = vi.spyOn(core, 'createMatch');
    render(<App />);
    for (let hand = 0; hand < 4; hand++) { await controlledDraw(commit); click('下一手'); }
    const active = returned(commit);
    const winning = core.legalActions(active, 'player').find(action => !action.boost && !action.ability && core.rawOutcome(action.kind, active.computerCommitment!.kind) === 'player')!;
    click(`出${actionNames[winning.kind]}`);
    expect(button('回退')).toBeDisabled();
    click('回退');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await reveal();
    expect(within(screen.getByRole('region', { name: '对手的状态' })).getByLabelText('生命 2 / 3')).toBeInTheDocument();
    expect(button('回退')).toBeEnabled();
    click('回退'); click('取消你的保底能力');
    click('换一条');
    expect(button('取消三点生命')).toBeInTheDocument();
    click('取消你的保底能力'); click('确认取消并重开');
    expect(returned(create).id).not.toBe(active.id);
    expect(returned(create).design.rules).toEqual(['life.knockout', 'gesture.five']);
    expect(returned(create).design.abilities.player).toBeNull();
    expect(screen.getByText('第 1 次交锋')).toBeInTheDocument();
    expect(screen.queryByRole('complementary')).not.toBeInTheDocument();
    for (const side of ['你的状态', '对手的状态']) expect(within(screen.getByRole('region', { name: side })).getByLabelText('生命 3 / 3')).toBeInTheDocument();
    expect(button('回退')).toBeEnabled();
  });
});
