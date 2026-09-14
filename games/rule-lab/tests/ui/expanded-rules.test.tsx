// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import * as core from '../../src/core';
import { App } from '../../src/App';
import { MatchProgress } from '../../src/ui/MatchProgress';
import { RulesView } from '../../src/ui/RulesView';

vi.mock('../../src/presentation/audio', () => ({ audio: {
  init: vi.fn(async () => true), play: vi.fn(), setMuted: vi.fn(), setVolume: vi.fn(),
  prepareReveal: vi.fn(), playResolution: vi.fn(), setTone: vi.fn(), cancelAll: vi.fn(), preview: vi.fn(() => vi.fn()),
} }));
beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', { configurable: true, value: (query: string) => ({ matches: false, media: query, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {} }) });
  HTMLDialogElement.prototype.showModal = function () { this.open = true; };
  HTMLDialogElement.prototype.close = function () { this.open = false; };
});
beforeEach(() => vi.useFakeTimers({ toFake: ['setTimeout','clearTimeout'] }));
afterEach(() => { cleanup(); vi.useRealTimers(); vi.restoreAllMocks(); });
const design = (...rules: core.RuleId[]) => rules.reduce((d,r) => core.installRule(d,r), core.createDesign());
const tick = async (ms: number) => act(async () => { await vi.advanceTimersByTimeAsync(ms); });
const click = (name: string) => fireEvent.click(screen.getByRole('button', { name }));

// These fixtures isolate rendering/action wiring for already-created works. They do not claim
// to prove unlock reachability; that is exercised by journey and unmodified random-route tests.
describe('expanded rules in the actual App', () => {
  it('renders nine compatible actions, true costs and the two-gas boost without revealing spent resources early', async () => {
    const d=design('life.knockout','energy.gesture_boost','energy.active_charge','energy.wave','energy.guard','energy.piercing_wave','energy.guard_paid','energy.cheap_wave','energy.opening_two','energy.cap_five','energy.double_boost','gesture.five');
    vi.spyOn(core,'createDesign').mockReturnValue(d);
    const resolved=vi.spyOn(core,'resolveAttempt');
    render(<App/>);
    expect(core.compileDesign(d).healthOnly).toBe(true);
    expect(screen.getByText('第 1 次交锋')).toBeInTheDocument();
    expect(document.querySelector('.match-score,.score-rules')).toBeNull();
    expect(screen.getAllByRole('button', { name:/^出/ })).toHaveLength(9);
    expect(screen.getByRole('button', { name:'出波' })).toBeEnabled();
    expect(screen.getByRole('button', { name:'出波' })).toHaveTextContent('1 气');
    expect(screen.getByRole('button', { name:'出防御' })).toHaveTextContent('1 气');
    expect(screen.getByRole('button', { name:'出破防波' })).toBeDisabled();
    expect(screen.getByRole('button', { name:'出破防波' })).toHaveTextContent('需要 3 气');
    const own=within(screen.getByRole('region',{name:'你的状态'}));
    expect(own.getByLabelText('气 2 / 5')).toBeInTheDocument();
    click('2 气 · +2 伤'); click('出蜥蜴');
    expect(own.getByLabelText('气 2 / 5')).toBeInTheDocument();
    expect(document.querySelectorAll('.duel-hand-caption strong')).toHaveLength(0);
    await tick(900);
    const result=resolved.mock.results.at(-1)!;
    if(result.type!=='return') throw new Error('Real resolution failed');
    const record=result.value.history.at(-1)!;
    expect(record.player).toMatchObject({kind:'lizard',boost:2,ability:false});
    expect(record.after.player.energySpent-record.before.player.energySpent).toBe(2);
    expect(own.getByLabelText(`气 ${record.after.player.energy} / 5`)).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(screen.queryByText(/回顾/)).not.toBeInTheDocument();
  });

  it('shows the rotating trump before selection and matches its visible winning edges', async () => {
    const d=design('life.knockout','gesture.public_trump');
    vi.spyOn(core,'createDesign').mockReturnValue(d);
    render(<App/>);
    expect(screen.getByText('本手王牌 · 石头')).toBeInTheDocument();
    expect(screen.getByRole('button',{name:'出石头'})).toHaveTextContent('胜 剪刀、布');
    click('出石头');await tick(900);click('下一手');
    expect(screen.getByText('本手王牌 · 剪刀')).toBeInTheDocument();
    expect(screen.getByRole('button',{name:'出剪刀'})).toHaveTextContent('胜 石头、布');
  });

  it('retains readable legacy challenge fixtures without making them normal selectable routes', () => {
    const d=design('match.score_five','goal.draw_three');
    vi.spyOn(core,'createDesign').mockReturnValue(d);
    render(<App/>);
    expect(screen.getByText('你的挑战：累计三次平局 · 5 手内')).toBeInTheDocument();
    expect(document.querySelector('.challenge-progress')).toHaveTextContent('平局 0 / 3');
    cleanup();render(<RulesView compiled={core.compileDesign(d)} view="list"/>);
    expect(screen.getByText(/电脑没有对称的挑战目标|电脑不以自己的平局数达标|电脑不拥有同样目标/)).toBeInTheDocument();
  });

  it('retains the shared reveal deadline for a legacy controlled overtime fixture', async () => {
    const d=design('match.score_five','ending.bounded_overtime');
    vi.spyOn(core,'createDesign').mockReturnValue(d);
    const commitment=vi.spyOn(core,'commitComputer');
    render(<App/>);
    for(let hand=1;hand<=5;hand++) {
      // Deliberately force a draw fixture to isolate the visibility boundary, not an AI policy.
      const latest=commitment.mock.results.at(-1)!;
      if(latest.type!=='return') throw new Error('No commitment');
      const kind=latest.value.computerCommitment!.kind;
      const names={rock:'石头',scissors:'剪刀',paper:'布'};
      click(`出${names[kind as keyof typeof names]}`);
      if(hand===5) {
        expect(screen.queryByText('正在加时')).not.toBeInTheDocument();
        await tick(899);
        expect(screen.queryByText('正在加时')).not.toBeInTheDocument();
        await tick(1);
        expect(screen.getByText('正在加时')).toBeInTheDocument();
      } else { await tick(900);click('下一手'); }
    }
  });

  it('distinguishes the independent public counters of legacy budget/overtime fixtures', () => {
    const d=design('match.score_five','life.knockout','energy.gesture_boost','energy.active_charge','energy.wave','energy.guard','energy.guard_paid','goal.efficient_wins');
    const match=core.createMatch(d,24);
    // Public, disclosed state fixture: these independent counters must never be conflated.
    match.fighters.player.energy=2;match.fighters.player.energySpent=3;match.fighters.player.wins=2;
    const view=render(<MatchProgress match={match} compiled={core.compileDesign(d)} settled={false}/>);
    expect(document.querySelector('.budget-progress')).toHaveTextContent('获胜 2 / 2累计花气 3 / 3');
    expect(screen.getByText(/打到期末才结算/)).toBeInTheDocument();
    const overtimeDesign=design('match.score_five','ending.bounded_overtime','score.last_double');
    const overtime=core.createMatch(overtimeDesign,25);
    overtime.hand=5;overtime.overtimeActive=true;overtime.effectiveCap=8;
    view.rerender(<MatchProgress match={overtime} compiled={core.compileDesign(overtimeDesign)} settled={false}/>);
    expect(screen.getByText('加时 1 / 3 手')).toBeInTheDocument();
    expect(screen.getByText('第 5 手积分 ×2')).toBeInTheDocument();
  });

  it('describes health-only rules and arbitrarily late disclosed encounters without a hidden deadline', () => {
    const d=design('life.knockout','cards.finite','energy.gesture_boost','energy.active_charge','energy.wave','energy.guard');
    const match=core.createMatch(d,24);
    // This is a presentation fixture, not a claimed natural 40-hand route.
    match.hand=40;
    const compiled=core.compileDesign(d);
    const view=render(<MatchProgress match={match} compiled={compiled} settled={false}/>);
    expect(screen.getByText('第 41 次交锋')).toBeInTheDocument();
    expect(document.querySelector('.match-score,.score-rules,.challenge-progress,.budget-progress')).toBeNull();
    expect(document.body.textContent).not.toMatch(/到期|上限|积分|加时|\/\s*(5|9|13)/);
    view.rerender(<RulesView compiled={compiled} view="list"/>);
    expect(screen.getByText(/生命归零|生命降至.?0|生命降为.?0/)).toBeInTheDocument();
    expect(document.body.textContent).not.toMatch(/到期比较|五手|九手|十三手|最多\s*(5|9|13)\s*手|到期比生命/);
  });
});
