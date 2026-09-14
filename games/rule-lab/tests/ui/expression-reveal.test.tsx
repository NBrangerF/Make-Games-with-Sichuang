// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { createDesign, createMatch, commitComputer, compileDesign, resolveAttempt } from '../../src/core';
import { getChoice } from '../../src/content';
import { defaultExpression } from '../../src/journey';
import { ExpressionEditor } from '../../src/ui/ExpressionEditor';
import { CreationPreview } from '../../src/presentation/visuals';

beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', { configurable: true, value: (query: string): MediaQueryList => ({
    matches: false, media: query, onchange: null, addListener: () => {}, removeListener: () => {}, addEventListener: () => {}, removeEventListener: () => {}, dispatchEvent: () => true,
  }) });
  HTMLDialogElement.prototype.showModal = function () { this.open = true; };
  HTMLDialogElement.prototype.close = function () { this.open = false; };
});
beforeEach(() => { vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] }); });
afterEach(() => { cleanup();vi.useRealTimers();vi.restoreAllMocks(); });

function editor(reduced = false) {
  const design = createDesign();
  const pending = commitComputer(createMatch(design, 24));
  const match = resolveAttempt(pending, { kind: 'scissors', boost: 0, ability: false }, 'preview-fixture');
  const original = structuredClone(match);
  const result = render(<ExpressionEditor choice={getChoice('U10')!} expression={defaultExpression} compiled={compileDesign(design)} match={match} reduced={reduced} busy={false} onClose={()=>{}} onApply={async()=>{}}/>);
  return { ...result, match, original };
}
const tick = async (ms: number) => act(async () => { await vi.advanceTimersByTimeAsync(ms); });
const captions = () => [...document.querySelectorAll('.duel-hand-caption strong')].map(node=>node.textContent);

describe('reveal expression previews use the real duel', () => {
  it('replays actual disclosed actions on both 900ms and 1200ms deadlines without mutating the match', async () => {
    const { match, original } = editor();
    const actual = captions();expect(actual).toHaveLength(2);
    // The alternate rhythm is proposed initially; it uses the same two hand nodes as the live game.
    fireEvent.click(screen.getByRole('button', { name: '预览节奏' }));
    expect(captions()).toHaveLength(0);
    expect(screen.getByRole('button', { name: '正在预览' })).toBeDisabled();
    await tick(1199);expect(captions()).toHaveLength(0);
    await tick(1);expect(captions()).toEqual(actual);
    fireEvent.click(screen.getByRole('button', { name: /^轻快/ }));
    fireEvent.click(screen.getByRole('button', { name: '预览节奏' }));
    await tick(899);expect(captions()).toHaveLength(0);
    await tick(1);expect(captions()).toEqual(actual);
    expect(match).toEqual(original);
  });

  it('uses the short simultaneous deadline for the user motion preference and cancels on unmount', async () => {
    const { unmount } = editor(true);
    const actual = captions();
    fireEvent.click(screen.getByRole('button', { name: '预览节奏' }));
    expect(document.querySelector('.duel-reveal--reduced')).toBeInTheDocument();
    await tick(79);expect(captions()).toHaveLength(0);
    await tick(1);expect(captions()).toEqual(actual);
    fireEvent.click(screen.getByRole('button', { name: '预览节奏' }));
    unmount();expect(vi.getTimerCount()).toBe(0);
  });

  it('cancels an old preview when switching pace so its pending deadline cannot interrupt the next preview', async () => {
    editor();
    const actual = captions();
    fireEvent.click(screen.getByRole('button', { name: '预览节奏' }));
    await tick(600);
    fireEvent.click(screen.getByRole('button', { name: /^轻快/ }));
    expect(captions()).toEqual(actual);
    fireEvent.click(screen.getByRole('button', { name: '预览节奏' }));
    await tick(600);expect(captions()).toHaveLength(0);
    await tick(300);expect(captions()).toEqual(actual);
  });
});

describe('new interface card previews', () => {
  it('distinguishes the works/version controls and settings from gesture expansion', () => {
    const { container, rerender } = render(<CreationPreview kind="U17"/>);
    expect(container.querySelector('.icon-rules')).toBeInTheDocument();
    expect(container.querySelector('.icon-undo')).toBeInTheDocument();
    expect(container.querySelector('.gesture-icon')).toBeNull();
    rerender(<CreationPreview kind="U18"/>);
    expect(container.querySelector('.icon-settings')).toBeInTheDocument();
    expect(container.querySelector('.gesture-icon')).toBeNull();
  });
});
