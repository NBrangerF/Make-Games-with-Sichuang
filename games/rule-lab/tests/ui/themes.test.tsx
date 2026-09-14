// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { createDesign, createMatch, compileDesign, commitComputer, resolveAttempt } from '../../src/core';
import { getChoice } from '../../src/content';
import { defaultExpression } from '../../src/journey';
import { ExpressionEditor } from '../../src/ui/ExpressionEditor';
import { AbilityIcon, CreationPreview, Stage } from '../../src/presentation/visuals';
import { generateCoverSVG } from '../../src/presentation/cover';
import { STYLE_OPTIONS, themeCoverPalette, type VisualStyle } from '../../src/presentation/themes';
import { pixelGesturePaths } from '../../src/presentation/theme-art';
import { gesturePaths } from '../../src/presentation/gesture-paths';
import { DuelReveal } from '../../src/presentation/DuelReveal';

beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', { configurable: true, value: (query: string): MediaQueryList => ({
    matches: false, media: query, onchange: null, addListener: () => {}, removeListener: () => {}, addEventListener: () => {}, removeEventListener: () => {}, dispatchEvent: () => true,
  }) });
  HTMLDialogElement.prototype.showModal = function () { this.open = true; };
  HTMLDialogElement.prototype.close = function () { this.open = false; };
});
afterEach(() => { cleanup(); vi.restoreAllMocks(); });

function renderStyleEditor(style: VisualStyle = 'ink') {
  const design = createDesign();
  const expression = { ...defaultExpression, name: '拳外之意', style };
  const onApply = vi.fn(async () => {}), onClose = vi.fn();
  const result = render(<ExpressionEditor choice={getChoice('U02')!} expression={expression} compiled={compileDesign(design)} match={createMatch(design, 7)} busy={false} reduced onClose={onClose} onApply={onApply}/>);
  return { ...result, expression, onApply, onClose };
}

describe('five art styles share an editor, stage and export contract', () => {
  it.each(STYLE_OPTIONS)('chooses $label without changing rules or other expression fields', ({id,label}) => {
    const { expression, onApply } = renderStyleEditor(id==='ink'?'cyanotype':'ink');
    expect(document.querySelectorAll('.style-variants>.variant-card')).toHaveLength(5);
    fireEvent.click(screen.getByRole('button', { name: new RegExp(`^${label}`) }));
    expect(screen.getByRole('button', { name: new RegExp(`^${label}`) })).toHaveAttribute('aria-pressed','true');
    fireEvent.click(screen.getByRole('button', { name: '留下这个选择' }));
    expect(onApply).toHaveBeenCalledExactlyOnceWith({ ...expression, style: id });
  });

  it('keeps the selected draft local when dismissed, and rejects an unchanged choice', () => {
    const { onApply, onClose } = renderStyleEditor('manga');
    fireEvent.click(screen.getByRole('button', { name: /^黑白漫画/ }));
    expect(screen.getByRole('button', { name: '留下这个选择' })).toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: /^街机像素/ }));
    fireEvent.click(screen.getByRole('button', { name: '先不改' }));
    expect(onClose).toHaveBeenCalledOnce(); expect(onApply).not.toHaveBeenCalled();
  });

  it.each(['cel','manga','arcade'] as const)('keeps %s artwork consistent in the stage, preview and standalone SVG', style => {
    const { container } = render(<><Stage style={style}><button>真实行动</button></Stage><CreationPreview kind="style" style={style}/></>);
    const stage = container.querySelector('.stage')!;
    const preview = container.querySelector('.creation-preview')!;
    expect(stage).toHaveAttribute('data-style',style);
    const paths=(node: Element)=>[...node.querySelectorAll('[data-theme-motif]')].map(path=>path.getAttribute('d'));
    expect(paths(stage).length).toBeGreaterThan(2);
    expect(paths(preview)).toEqual(paths(stage));
    const cover = new DOMParser().parseFromString(generateCoverSVG({style,name:'<拳>&选择',gestures:['rock','scissors','paper','lizard','spock']}),'image/svg+xml');
    expect(cover.querySelector('parsererror')).toBeNull();
    expect(cover.querySelectorAll('script,image,foreignObject')).toHaveLength(0);
    expect(cover.documentElement.getAttribute('aria-label')).toBe('<拳>&选择');
    expect(cover.querySelector('rect')?.getAttribute('fill')).toBe(themeCoverPalette(style).paper);
    expect(paths(cover.documentElement)).toEqual(paths(stage));
    for (const gesture of ['rock','scissors','paper','lizard','spock'] as const) {
      const outline = (style==='arcade'?pixelGesturePaths:gesturePaths)[gesture].outline;
      expect([...cover.querySelectorAll('path')].some(path=>path.getAttribute('d')===outline)).toBe(true);
    }
    expect(cover.querySelectorAll('text[y="190"]')[0]?.textContent).toBe('<拳>&选择');
  });

  it('advertises all five art families on U02 without rendering controls or invented combat state', () => {
    const { container } = render(<CreationPreview kind="U02" style="arcade"/>);
    expect(container.querySelectorAll('.style-sample')).toHaveLength(5);
    for(const {id} of STYLE_OPTIONS) expect(container.querySelector(`.style-sample.theme-${id}`)).not.toBeNull();
    expect(container.querySelectorAll('button,[role="status"],.resource-meter')).toHaveLength(0);
  });

  it('keeps the alternate pixel hands neutral too until the same shared reveal', () => {
    const match=resolveAttempt(commitComputer(createMatch(createDesign(),7)),{kind:'scissors',boost:0,ability:false},'pixel-privacy');
    const record=match.history.at(-1)!;
    const {container,rerender}=render(<DuelReveal record={record} revealed={false} reduced/>);
    const outlines=[...container.querySelectorAll('.gesture-pixel-outline')];
    expect(outlines).toHaveLength(2);
    for(const outline of outlines)expect(outline).toHaveAttribute('d',pixelGesturePaths.rock.outline);
    expect(container.querySelectorAll('.duel-hand-caption strong')).toHaveLength(0);
    rerender(<DuelReveal record={record} revealed reduced/>);
    expect(container.querySelector('.duel-hand--player .gesture-pixel-outline')).toHaveAttribute('d',pixelGesturePaths.scissors.outline);
    expect(container.querySelectorAll('.duel-hand-caption strong')).toHaveLength(2);
  });

  it.each(['cards.charge_trade','energy.wager','combo.three_styles','cards.capture','cards.combo_refund','shield.guard_store','energy.overflow_shield','energy.restraint','action.special_cooldown','shield.piercing_boost'])('gives %s its own resource diagram instead of the default three hands', kind => {
    const { container } = render(<CreationPreview kind={kind} style="manga"/>);
    expect(container.querySelector('.mechanic-preview')).toHaveAttribute('data-mechanic',kind);
    expect(container.querySelector('.mechanic-preview-caption')?.textContent?.length).toBeGreaterThan(8);
    expect(container.querySelector('.preview-gestures')).toBeNull();
  });
});

describe('new abilities have separate visible symbols', () => {
  it('distinguishes all eleven active and passive character symbols', () => {
    const ids=['ability.claim_draw','ability.insurance','ability.retry','ability.aegis','ability.foresight','ability.siphon','ability.reforge','ability.last_stand','ability.scissors_ninja','ability.rock_guardian','ability.paper_trickster'];
    const { container, rerender } = render(<AbilityIcon ability={ids[0]}/>);
    const outlines: string[]=[];
    for (const id of ids) {
      rerender(<AbilityIcon ability={id}/>);
      expect(container.querySelector('svg')).toHaveAttribute('data-ability-icon',id);
      outlines.push([...container.querySelectorAll('path,circle')].map(path=>path.outerHTML).join(''));
    }
    expect(new Set(outlines).size).toBe(11);
    for(const id of ids.slice(3)){
      rerender(<CreationPreview kind={id}/>);
      expect(container.querySelector('svg[data-ability-icon]')).toHaveAttribute('data-ability-icon',id);
      expect(container.querySelectorAll('.gesture-icon')).toHaveLength(0);
    }
  });
});
