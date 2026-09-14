import { motion } from 'motion/react';
import { isGesture, type AbilityId, type Action, type ActionKind, type AttemptRecord } from '../core';
import { actionNames, abilityNames } from '../ui/constants';
import { GestureIcon, ResourceIcon } from './visuals';
import { revealDurationMs, type RevealTempo } from './reveal-timing';
import './duel-reveal.css';
export { revealDurationMs, type RevealTempo } from './reveal-timing';

interface DuelRevealProps {
  record: AttemptRecord;
  revealed: boolean;
  reduced?: boolean;
  tempo?: RevealTempo;
  playerAbility?: AbilityId | null;
  /** Accepted for old callers; opponents never display a player-only ability. */
  computerAbility?: AbilityId | null;
}

/** Keep this mounted across the reveal; only the parent owns the reveal timer. */
export function DuelReveal({ record, revealed, reduced = false, tempo = 'quick', playerAbility }: DuelRevealProps) {
  const duration = revealDurationMs(tempo, reduced) / 1000;
  const outcome = revealed ? record.voided ? 'retry' : record.outcome : null;
  return <div className={`duel-reveal ${revealed ? 'duel-reveal--open' : 'duel-reveal--ready'} ${reduced ? 'duel-reveal--reduced' : ''} ${outcome ? `duel-result--${outcome}` : ''}`} aria-label="双方出手" role="group">
    {revealed && <div className="duel-collision" aria-hidden="true"><svg viewBox="0 0 300 180" fill="none"><ellipse cx="150" cy="95" rx="118" ry="25"/><path d="M21 95H115M185 95H279M150 43V70M150 120V145"/></svg></div>}
    <DuelHand side="player" action={revealed ? record.player : null} ability={revealed ? playerAbility : null} outcome={outcome} revealed={revealed} reduced={reduced} duration={duration}/>
    <DuelHand side="computer" action={revealed ? record.computer : null} outcome={outcome} revealed={revealed} reduced={reduced} duration={duration}/>
    {!revealed && <span className="duel-reveal-status" role="status">双方已出手，即将同时揭晓。</span>}
  </div>;
}

function DuelHand({ side, action, ability, outcome, revealed, reduced, duration }: {
  side: 'player' | 'computer'; action: Action | null; ability?: AbilityId | null;
  outcome: 'player' | 'computer' | 'draw' | 'retry' | null;
  revealed: boolean; reduced: boolean; duration: number;
}) {
  const direction = side === 'player' ? 1 : -1;
  const label = side === 'player' ? '你' : '对手';
  // No concealed action, enhancement or ability is rendered before the shared reveal.
  const kind = action?.kind ?? 'rock';
  const won = outcome === side;
  const lost = outcome && outcome !== 'draw' && outcome !== 'retry' && !won;
  return <div className={`duel-hand duel-hand--${side} ${won ? 'duel-hand--winner' : lost ? 'duel-hand--loser' : ''} ${revealed && action?.ability && side === 'player' ? 'duel-hand--ability' : ''}`}>
    <span className="duel-hand-owner">{label}</span>
    <div className="duel-hand-visual">
    <div className="duel-hand-aura" aria-hidden="true"/>
    {revealed && action && <ImpactArt kind={action.kind} boosted={!!action.boost}/>}
    <motion.div className="duel-hand-motion" aria-hidden="true"
      initial={reduced ? false : { y: 4, rotate: direction * 24, scale: .96 }}
      animate={reduced ? { y: 0, rotate: 0, scale: 1 } : revealed
        ? { y: [0, won ? -7 : 5, 0], x: [0, (lost ? -10 : 5) * direction, 0], rotate: [direction * 24, direction * (lost ? -7 : -3), 0], scale: [1, won ? 1.10 : 1.03, 1] }
        : { y: [4, -15, 4, -21, 4, -28, 0], rotate: [24, 15, 24, 13, 24, 10, 24].map(value => value * direction), scale: [.96, 1, .96, 1, .96, 1, 1] }}
      transition={reduced ? { duration: 0 } : revealed
        ? { type: 'tween', duration: .30, times: [0, .35, 1], ease: 'easeOut' }
        : { type: 'tween', duration, times: [0, .14, .3, .46, .62, .8, 1], ease: 'easeInOut' }}>
      <div className="duel-hand-grip">
        {isGesture(kind) ? <GestureIcon gesture={kind} size={148}/> : <ResourceIcon kind={kind === 'piercing_wave' ? 'piercing' : kind === 'wave' ? 'attack' : kind === 'charge' ? 'charge' : 'guard'} size={112}/>}
      </div>
    </motion.div>
    </div>
    <div className="duel-hand-caption">
      {revealed && action && <>
        <strong>{actionNames[action.kind]}{action.boost === 2 ? ' · 强化二档' : action.boost ? ' · 强化' : ''}</strong>
        {action.wager && <small>押 1 气</small>}
        {action.ability && ability && <small>{abilityNames[ability]}已声明</small>}
      </>}
    </div>
  </div>;
}

/** One short signature per move. This subtree does not exist before the public reveal. */
function ImpactArt({ kind, boosted }: { kind: ActionKind; boosted: boolean }) {
  return <svg className={`duel-impact duel-impact--${kind} ${boosted ? 'duel-impact--boosted' : ''}`} viewBox="0 0 200 200" fill="none" aria-hidden="true" focusable="false">
    {kind === 'rock' && <g className="impact-burst"><path d="M74 48L65 26M126 48L139 20M150 78L178 63M157 118L183 133M124 153L137 177M78 151L64 177M48 119L24 135M45 77L21 61"/><path className="impact-thin" d="M52 50L39 36M155 46L172 29M177 101H191M111 175L114 189M25 101H11"/></g>}
    {kind === 'scissors' && <g className="impact-slash"><path d="M29 159C87 93 130 56 172 34"/><path d="M41 27C81 56 126 112 170 173"/><path className="impact-thin" d="M20 151C78 85 121 48 163 26"/></g>}
    {kind === 'paper' && <g className="impact-sweep"><path d="M26 134C-3 61 157 16 174 78C192 143 43 173 26 112"/><path className="impact-thin" d="M16 124C0 53 164 6 187 75M45 167C125 186 203 112 178 66"/></g>}
    {kind === 'lizard' && <g className="impact-slash"><path d="M20 113L69 80L118 92L176 48M136 36L180 45L164 85"/><path className="impact-thin" d="M31 140L78 107L121 118L166 90"/></g>}
    {kind === 'spock' && <g className="impact-burst"><ellipse cx="100" cy="100" rx="83" ry="35" transform="rotate(-36 100 100)"/><ellipse className="impact-thin" cx="100" cy="100" rx="83" ry="35" transform="rotate(36 100 100)"/><path d="M100 18V34M100 166V182"/></g>}
    {kind === 'wave' && <g className="impact-wave"><path d="M46 39C118 54 118 144 46 161"/><path d="M73 23C166 45 166 156 73 178"/><path className="impact-thin" d="M102 15C201 51 201 149 102 185"/><path d="M44 100H166M148 84L168 100L148 116"/></g>}
    {kind === 'piercing_wave' && <g className="impact-piercing"><path d="M14 100H188M158 72L189 100L158 128"/><path d="M28 78H111M28 122H111"/><path className="impact-shattered" d="M104 23L150 45L145 73M141 132L111 167L74 137L61 52L87 39"/><path className="impact-thin" d="M99 67L111 79L101 92M115 113L126 123L115 143M157 44L175 28M154 149L178 174M62 29L50 13"/></g>}
    {kind === 'charge' && <g className="impact-charge"><circle cx="100" cy="106" r="72"/><path d="M67 74L99 37L133 74M68 122L99 85L132 122"/><path className="impact-thin" d="M35 62L24 37M166 62L177 37M100 22V8"/></g>}
    {kind === 'guard' && <g className="impact-guard"><path d="M100 16L172 50L160 127L100 181L40 127L28 50Z"/><path className="impact-thin" d="M100 30L157 57L147 122L100 165L53 122L43 57Z"/><path d="M79 102L95 120L126 80"/></g>}
    {boosted && <circle className="impact-boost-ring" cx="100" cy="100" r="91"/>}
  </svg>;
}
