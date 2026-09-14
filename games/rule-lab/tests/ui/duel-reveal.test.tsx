// @vitest-environment jsdom
import { cleanup, render, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { afterEach, describe, expect, it } from 'vitest';
import { createDesign, createMatch, commitComputer, resolveAttempt, isGesture, type AttemptRecord, type ActionKind } from '../../src/core';
import { DuelReveal } from '../../src/presentation/DuelReveal';
import { gesturePaths } from '../../src/presentation/gesture-paths';
import { actionNames } from '../../src/ui/constants';

afterEach(cleanup);

function record(player: ActionKind = 'scissors', computer: ActionKind = 'paper'): AttemptRecord {
  const initial = commitComputer(createMatch(createDesign(), 19));
  const resolved = resolveAttempt(initial, { kind: 'scissors', boost: 0, ability: false }, 'duel-fixture');
  return { ...resolved.history[0], player: { kind: player, boost: isGesture(player) ? 1 : 0, ability: isGesture(player) }, computer: { kind: computer, boost: 0, ability: isGesture(computer) } };
}

describe('simultaneous duel reveal', () => {
  it('renders only two closed fists before reveal, including for concealed special actions', () => {
    const { container } = render(<DuelReveal record={record('wave', 'guard')} revealed={false} playerAbility="ability.insurance" computerAbility="ability.retry"/>);
    expect(screen.getByRole('status')).toHaveTextContent('即将同时揭晓');
    expect(container.querySelectorAll('.gesture-outline')).toHaveLength(2);
    for (const outline of container.querySelectorAll('.gesture-outline')) expect(outline).toHaveAttribute('d', gesturePaths.rock.outline);
    expect(container.querySelector('.icon-attack, .icon-guard')).toBeNull();
    expect(screen.queryByText('波')).not.toBeInTheDocument();
    expect(screen.queryByText('防御')).not.toBeInTheDocument();
    expect(container.textContent).not.toMatch(/强化|保底|再搏/);
    expect(container.querySelector('.duel-impact, .duel-collision, .duel-hand--winner, .duel-hand--ability')).toBeNull();
    expect(container.innerHTML).not.toMatch(/duel-result--|duel-impact--wave|duel-impact--guard/);
  });

  it('reveals both real gestures in one update and preserves the hand containers', () => {
    const attempt = record();
    const props = { record: attempt, playerAbility: 'ability.insurance' as const, computerAbility: 'ability.retry' as const };
    const { container, rerender } = render(<DuelReveal {...props} revealed={false}/>);
    const hands = [...container.querySelectorAll('.duel-hand-motion')];
    expect(container.querySelectorAll('.gesture-outline')[0]).toHaveAttribute('d', gesturePaths.rock.outline);
    rerender(<DuelReveal {...props} revealed/>);
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect([...container.querySelectorAll('.duel-hand-motion')]).toEqual(hands);
    const player = container.querySelector('.duel-hand--player')!;
    const computer = container.querySelector('.duel-hand--computer')!;
    expect(player.querySelector('.gesture-outline')).toHaveAttribute('d', gesturePaths.scissors.outline);
    expect(computer.querySelector('.gesture-outline')).toHaveAttribute('d', gesturePaths.paper.outline);
    expect(within(player as HTMLElement).getByText('剪刀 · 强化')).toBeInTheDocument();
    expect(within(computer as HTMLElement).getByText('布')).toBeInTheDocument();
    expect(screen.getByText('保底已声明')).toBeInTheDocument();
    expect(screen.queryByText('再搏已声明')).not.toBeInTheDocument();
    expect(player.querySelector('.duel-impact--scissors')).toBeInTheDocument();
    expect(computer.querySelector('.duel-impact--paper')).toBeInTheDocument();
  });

  it.each(['charge', 'wave', 'guard', 'piercing_wave', 'lizard', 'spock'] as const)('reveals %s clearly with reduced motion as well', kind => {
    const attempt = record(kind, 'rock');
    const { container, rerender } = render(<DuelReveal record={attempt} revealed={false} reduced/>);
    expect(container.querySelector('.duel-hand--player .gesture-outline')).toHaveAttribute('d', gesturePaths.rock.outline);
    expect(container.textContent).not.toContain(actionNames[kind]);
    rerender(<DuelReveal record={attempt} revealed reduced/>);
    expect(screen.getByText(`${actionNames[kind]}${isGesture(kind) ? ' · 强化' : ''}`)).toBeInTheDocument();
    const player = container.querySelector('.duel-hand--player')!;
    if (kind === 'lizard' || kind === 'spock') expect(player.querySelector('.gesture-outline')).toHaveAttribute('d', gesturePaths[kind].outline);
    else expect(player.querySelector('.resource-icon')).toBeInTheDocument();
  });

  it('keeps piercing-wave and two-level enhancement hidden, then reveals their distinct signatures together', () => {
    const attempt = record('piercing_wave', 'rock');
    attempt.computer.boost = 2;
    const { container, rerender } = render(<DuelReveal record={attempt} revealed={false} reduced/>);
    expect(container.innerHTML).not.toMatch(/piercing|破防|强化二档|impact-shattered/);
    expect(container.querySelectorAll('.gesture-outline')).toHaveLength(2);
    rerender(<DuelReveal record={attempt} revealed reduced/>);
    expect(screen.getByText('破防波')).toBeInTheDocument();
    expect(screen.getByText('石头 · 强化二档')).toBeInTheDocument();
    expect(container.querySelector('.duel-hand--player .icon-piercing')).toBeInTheDocument();
    expect(container.querySelector('.duel-hand--player .impact-shattered')).toBeInTheDocument();
    expect(container.querySelector('.duel-hand--player .icon-guard')).toBeNull();
    expect(container.querySelector('.duel-hand--computer .impact-boost-ring')).toBeInTheDocument();
  });
});
