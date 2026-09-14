import type { Action, ActionKind, Gesture, Side } from '../core/types';
import type { Modifier } from './catalog';
export interface ExperimentInput {
  prediction?: ActionKind; site?: number; worker?: number; move?: -1|0|1; bid?: number; draft?: number;
  next?: ActionKind|'conditional'; delay?: boolean; speed?: 'quick'|'normal'|'heavy'; modifier?: number;
  buy?: Modifier; shuffle?: boolean; bag?: number; bagBuy?: 'red'|'blue'|'white'; bank?: boolean; borrow?: boolean;
  insurance?: 'none'|'wave'|'gesture'; build?: boolean; upgrade?: 'none'|'energy'|'shield';
  converter?: 'none'|'shield_energy'|'energy_card'; cell?: number; rotation?: number; discardPiece?: boolean;
  sharing?: 'share'|'take'; give?: Gesture; want?: Gesture; honor?: boolean; exchangeInfo?: boolean;
}
export interface Signal { kind: Gesture; pledge: boolean; promise: 'none'|'bound'|'word' }
export interface ExperimentFighter {
  queue: ActionKind|'conditional'|null; delayed: number; position: number; factory: number; factoryOverflow: boolean; upgrade: 'none'|'energy'|'shield';
  stash: number; debt: number; modifiers: Modifier[]; deck: Modifier[]; discard: Modifier[];
  bag: ('red'|'blue'|'white')[]; drawn: ('red'|'blue'|'white')[];
  risk: ('safe'|'danger')[]; riskDrawn: ('safe'|'danger')[];
  mission: number; missionDone: boolean; trophies: Gesture[]; board: number[]; piece: Gesture|null;
  roleUsed: boolean; focus: number; signal: Signal|null;
}
export interface ExperimentState {
  preparedHand: number; rng: number; fighters: Record<Side,ExperimentFighter>;
  sites: (Side|null)[]; distance: number; heat: number; well: number;
  forecast: number; surprise: number; offer: Modifier[]; bounty: Side|null; rare: Gesture[];
  signalsReady: boolean; sealedPlayer: Action|null;
}
