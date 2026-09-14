// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import * as core from '../../src/core';
import { App } from '../../src/App';
import { actionNames } from '../../src/ui/constants';

vi.mock('../../src/presentation/audio', () => ({ audio: {
  init: vi.fn(async () => true), play: vi.fn(), setMuted: vi.fn(), setVolume: vi.fn(),
  prepareReveal: vi.fn(), playResolution: vi.fn(), setTone: vi.fn(), cancelAll: vi.fn(), preview: vi.fn(() => vi.fn()),
} }));
beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', { configurable: true, value: (query: string) => ({ matches: false, media: query, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {} }) });
  HTMLDialogElement.prototype.showModal = function () { this.open = true; };
  HTMLDialogElement.prototype.close = function () { this.open = false; };
});
beforeEach(()=>vi.useFakeTimers({toFake:['setTimeout','clearTimeout']}));
afterEach(() => { cleanup(); vi.useRealTimers(); vi.restoreAllMocks(); });
const design = (...rules: core.RuleId[]) => rules.reduce((d,r)=>core.installRule(d,r),core.createDesign());
const withAbility=(d:core.Design,id:core.AbilityId)=>core.commitRuleChange(d,core.previewRuleChange(d,{type:'ability',side:'player',ability:id}));
const tick=async(ms:number)=>act(async()=>{await vi.advanceTimersByTimeAsync(ms);});
const fixedSeed=(seed:number)=>vi.spyOn(crypto,'getRandomValues').mockImplementation(<T extends ArrayBufferView|null>(array:T):T=>{if(array instanceof Uint32Array)array.fill(seed);return array;});

// Already-created work fixtures use the real App, commit and resolution. They establish
// rendering/input boundaries, not card eligibility, natural draw frequency or browser layout.
describe('new public controls remain within their declared information and resource budgets', () => {
  it('reserves a shared energy budget for wager and boost, can cancel, and pays the combined fee through real resolution', async () => {
    const d=design('life.knockout','energy.gesture_boost','energy.opening_two','energy.double_boost','energy.wager');
    vi.spyOn(core,'createDesign').mockReturnValue(d);
    const resolved=vi.spyOn(core,'resolveAttempt');fixedSeed(7);
    render(<App/>);
    const boost=within(screen.getByRole('group',{name:'强化手势'}));
    const wager=screen.getByRole('button',{name:/押一气/});
    expect(screen.getByRole('region',{name:'你的状态'})).toHaveTextContent('气');
    fireEvent.click(boost.getByRole('button',{name:'2 气 · +2 伤'}));
    expect(wager).toBeDisabled();
    fireEvent.click(boost.getByRole('button',{name:'1 气 · +1 伤'}));
    expect(wager).toBeEnabled();fireEvent.click(wager);
    expect(wager).toHaveAttribute('aria-pressed','true');
    expect(boost.getByRole('button',{name:'2 气 · +2 伤'})).toBeDisabled();
    expect(screen.getByRole('button',{name:'出石头'})).toBeEnabled();
    expect(screen.getByRole('button',{name:'出石头'})).toHaveTextContent('1 气 · 胜时 +1 伤 · 押 1 气');
    expect(wager).toBeEnabled();fireEvent.click(wager);
    expect(wager).toHaveAttribute('aria-pressed','false');
    expect(boost.getByRole('button',{name:'2 气 · +2 伤'})).toBeEnabled();
    fireEvent.click(wager);fireEvent.click(screen.getByRole('button',{name:'出石头'}));
    expect(resolved).toHaveBeenCalledOnce();
    const result=resolved.mock.results[0];if(result.type!=='return')throw new Error('Expected real resolution');
    const record=result.value.history.at(-1)!;
    expect(record.player).toMatchObject({kind:'rock',boost:1,wager:true,ability:false});
    expect(record.after.player.energySpent-record.before.player.energySpent).toBe(2);
    const own=within(screen.getByRole('region',{name:'你的状态'}));
    expect(own.getByLabelText('气 2 / 3')).toBeInTheDocument();
    await tick(900);
    expect(own.getByLabelText(`气 ${record.after.player.energy} / 3`)).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('earns foresight through real play, then exposes only the next committed action kind', async () => {
    const d=withAbility(design('life.knockout','energy.gesture_boost','energy.opening_two','energy.wager'),'ability.foresight');
    vi.spyOn(core,'createDesign').mockReturnValue(d);fixedSeed(7);
    const committed=vi.spyOn(core,'commitComputer');
    const {container}=render(<App/>);
    expect(container.querySelector('.foreseen-intent')).toBeNull();
    fireEvent.click(screen.getByRole('button',{name:/先见.*这手先留着/}));
    fireEvent.click(screen.getByRole('button',{name:'出石头'}));
    expect(container.querySelector('.foreseen-intent')).toBeNull();
    expect(container.querySelectorAll('.duel-hand-caption strong')).toHaveLength(0);
    await tick(900);fireEvent.click(screen.getByRole('button',{name:'下一手'}));
    const latest=committed.mock.results.at(-1)!;
    if(latest.type!=='return'||!latest.value.publicComputerIntent)throw new Error('Real next-hand commitment should expose foresight');
    const publicKind=latest.value.publicComputerIntent;
    // Assertions read the public field only; player actions are fixed rock, not counter-picks.
    expect(container.querySelector('.foreseen-intent')?.textContent).toBe(`先见 · 对手已锁定${actionNames[publicKind]}仅动作种类，强化与押注未知`);
    expect(container.querySelectorAll('.duel-hand-caption strong,[data-boost],[data-wager]')).toHaveLength(0);
    fireEvent.click(screen.getByRole('button',{name:'出石头'}));
    expect(container.querySelectorAll('.duel-hand-caption strong')).toHaveLength(0);
    await tick(899);expect(container.querySelectorAll('.duel-hand-caption strong')).toHaveLength(0);
    await tick(1);expect(container.querySelectorAll('.duel-hand-caption strong')).toHaveLength(2);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('keeps a newly granted shield concealed in the HUD until the shared reveal deadline', async () => {
    const d=withAbility(design('life.knockout'),'ability.aegis');
    // Pick a repeatable already-created-work fixture where a fixed rock survives with its shield.
    // No player decision reads a commitment; this is a visibility test, not a play policy.
    const seed=Array.from({length:32},(_,i)=>i).find(seed=>core.resolveAttempt(core.commitComputer(core.createMatch(d,seed)),{kind:'rock',boost:0,ability:true},'shield-fixture').fighters.player.shield===1);
    if(seed===undefined)throw new Error('Expected a shield-retaining fixture');
    vi.spyOn(core,'createDesign').mockReturnValue(d);fixedSeed(seed);
    const resolved=vi.spyOn(core,'resolveAttempt');
    const {container}=render(<App/>);
    const own=within(screen.getByRole('region',{name:'你的状态'}));
    expect(own.getByLabelText('护盾 0 / 1')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button',{name:/护身.*这手先留着/}));
    fireEvent.click(screen.getByRole('button',{name:'出石头'}));
    const result=resolved.mock.results[0];if(result.type!=='return')throw new Error('Expected real resolution');
    const record=result.value.history.at(-1)!;
    expect(record.before.player.shield).toBe(0);expect(record.after.player.shield).toBe(1);
    expect(own.getByLabelText('护盾 0 / 1')).toBeInTheDocument();
    expect(container.querySelector('.mechanic-outcomes')).toBeNull();
    await tick(899);expect(own.getByLabelText('护盾 0 / 1')).toBeInTheDocument();
    await tick(1);expect(own.getByLabelText('护盾 1 / 1')).toBeInTheDocument();
    expect(container.querySelector('.mechanic-outcomes')).toHaveTextContent('护身');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
