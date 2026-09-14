import type { ExperimentRuleId, ExperimentAbilityId } from '../experiments/catalog';
import type { ExperimentInput, ExperimentState } from '../experiments/types';
export type Side = 'player' | 'computer';
export type Gesture = 'rock' | 'scissors' | 'paper' | 'lizard' | 'spock';
export type ActionKind = Gesture | 'charge' | 'wave' | 'guard' | 'piercing_wave';
export type AbilityId = ExperimentAbilityId | 'ability.claim_draw' | 'ability.insurance' | 'ability.retry' | 'ability.aegis' | 'ability.foresight' | 'ability.siphon' | 'ability.reforge' | 'ability.last_stand'
  | 'ability.scissors_ninja' | 'ability.rock_guardian' | 'ability.paper_trickster';
export type RuleId = ExperimentRuleId | 'match.first_two' | 'match.score_five' | 'tempo.extend_cap' | 'tempo.short_cap' | 'score.draw_point' | 'score.combo' | 'score.last_double' | 'gesture.five' | 'gesture.reverse' | 'action.cooldown' | 'life.knockout' | 'cards.finite' | 'cards.two_each' | 'cards.exchange_once' | 'energy.gesture_boost' | 'energy.active_charge' | 'energy.wave' | 'energy.guard'
  | 'ending.bounded_overtime' | 'goal.collect_three' | 'goal.draw_three' | 'goal.streak_two' | 'goal.first_five_points' | 'goal.fewest_points' | 'goal.efficient_wins'
  | 'gesture.remove_rock' | 'gesture.public_trump' | 'life.draw_damage' | 'life.win_heal' | 'life.survive' | 'life.last_hit_double' | 'life.desperation'
  | 'cards.draw_refund' | 'cards.dealer_refill' | 'energy.guard_paid' | 'energy.piercing_wave' | 'energy.cheap_wave' | 'energy.opening_two' | 'energy.leak_thirds' | 'energy.loss_charge' | 'energy.cap_five' | 'energy.double_boost'
  | 'cards.charge_trade' | 'energy.wager' | 'combo.three_styles' | 'cards.capture' | 'cards.combo_refund' | 'shield.guard_store' | 'energy.overflow_shield' | 'energy.restraint' | 'action.special_cooldown' | 'shield.piercing_boost';
export type Goal = 'single' | 'first_two' | 'score' | 'knockout' | 'collect_three' | 'draw_three' | 'streak_two' | 'first_five_points' | 'fewest_points' | 'efficient_wins' | 'survive';
export type Outcome = 'player' | 'computer' | 'draw';

/** Mechanics only. Expression and preferences never enter a match or its RNG. */
export interface Design {
  schemaVersion: 1;
  contentVersion: '0.6-demo-1';
  revision: number;
  rules: RuleId[];
  goal: Goal;
  /** Current health route: defeat or action exhaustion ends the match, never a hand limit.
   * Omitted in historical finite-match fixtures. The numeric cap remains their schema field. */
  healthOnly?: boolean;
  cap: number;
  abilities: Record<Side, AbilityId | null>;
}
export type DesignDocument = Design;
export interface CompiledDesign {
  design: Design;
  hash: string;
  goal: Goal;
  healthOnly: boolean;
  /** Historical finite-match limit. Not a deadline when healthOnly is true. */
  cap: number;
  gestures: Gesture[];
  actions: ActionKind[];
  reverse: boolean;
  cooldown: boolean;
  drawPoint: boolean;
  combo: boolean;
  lastDouble: boolean;
  score: boolean;
  challenge: boolean;
  boundedOvertime: boolean;
  publicTrump: boolean;
  life: boolean;
  drawDamage: boolean;
  winHeal: boolean;
  lastHitDouble: boolean;
  desperation: boolean;
  energy: boolean;
  initialEnergy: number;
  energyCap: number;
  maxBoost: 0 | 1 | 2;
  waveCost: 1 | 2;
  guardCost: 0 | 1;
  leakThirds: boolean;
  lossCharge: boolean;
  finiteCards: boolean;
  cardsPerGesture: number;
  exchange: boolean;
  drawRefund: boolean;
  dealerRefill: boolean;
  chargeTrade: boolean;
  wager: boolean;
  threeStyles: boolean;
  capture: boolean;
  comboRefund: boolean;
  guardStore: boolean;
  overflowShield: boolean;
  restraint: boolean;
  specialCooldown: boolean;
  piercingBoost: boolean;
  /** At least one shared or equipped source can create a shield. */
  shield: boolean;
  abilities: Record<Side, AbilityId | null>;
  ui: UIRequirements;
}
export interface UIRequirements {
  rules: boolean;
  series: boolean;
  score: boolean;
  life: boolean;
  energy: boolean;
  cards: boolean;
  exchange: boolean;
  abilities: boolean;
  fiveGestures: boolean;
}
export type RuleChange = { type: 'install'; rule: RuleId; capTarget?: 9 | 13 } | { type: 'remove'; rule: RuleId } | { type: 'ability'; side: Side; ability: AbilityId | null };
export interface ChangePreview {
  valid: boolean;
  baseRevision: number;
  nextDesign: Design;
  added: string[];
  removed: string[];
  retained: string[];
  goal: Goal;
  cap: number;
  abilities: Record<Side, AbilityId | null>;
  ui: UIRequirements;
  notes: string[];
  errors: string[];
}
export interface Action {
  cardId?: string;
  experiment?: ExperimentInput;
  kind: ActionKind;
  boost: 0 | 1 | 2;
  /** Declare the equipped ability before reveal. Never a post-result reaction. */
  ability: boolean;
  /** Optional one-energy stake, paid together with boost; legal on gestures only. */
  wager?: boolean;
}
export interface CommandIdentity { matchId: string; attemptId: number; commandId: string }
export interface FighterState {
  cardZone?: import('../cards/catalog').CardZone;
  life: number;
  energy: number;
  wins: number;
  score: number;
  /** Effective final draws, including special-action draws; void attempts do not count. */
  draws: number;
  /** Unique base gestures used to win an effective hand. Extra gestures never count. */
  collected: Gesture[];
  /** Consecutive effective wins; a final draw/loss resets it, a void retry preserves it. */
  winStreak: number;
  abilityRemaining: number;
  cards: Record<Gesture, number>;
  exchangeRemaining: number;
  lastAction: ActionKind | null;
  energySpent: number;
  /** One shield absorbs one incoming damage, then is consumed. */
  shield: 0 | 1;
  /** Distinct consecutive effective gestures; specials break, retry preserves it. */
  gestureChain: Gesture[];
}
export interface RngState { algorithm: 'mulberry32-v1'; state: number }
export interface GameEvent {
  id: string;
  type: 'card_effect' | 'experiment' | 'prepared' | 'committed' | 'revealed' | 'ability_used' | 'retry' | 'energy_spent' | 'charged' | 'cards_spent' | 'inventory_depleted' | 'damage' | 'score_awarded' | 'gesture_draw_energy' | 'wave_observed' | 'guard_blocked' | 'exchange' | 'round_completed' | 'match_finished'
    | 'cards_refunded' | 'dealer_refill' | 'healed' | 'energy_leaked' | 'loss_charge' | 'goal_progress' | 'trump_announced' | 'overtime_started'
    | 'cards_converted' | 'wager_resolved' | 'style_chain_completed' | 'cards_captured' | 'combo_refund' | 'shield_gained' | 'shield_absorbed' | 'shield_broken' | 'energy_overflow' | 'restraint_charge' | 'foresight_granted' | 'foresight_revealed' | 'energy_transferred' | 'cards_reforged' | 'last_stand_triggered' | 'passive_triggered';
  attempt: number;
  hand: number;
  side?: Side;
  amount?: number;
  action?: ActionKind;
  from?: Gesture;
  ability?: AbilityId;
  text: string;
}
export interface AttemptRecord {
  experimentBefore?: ExperimentState;
  experimentAfter?: ExperimentState;
  attempt: number;
  hand: number;
  player: Action;
  computer: Action;
  rawOutcome: Outcome;
  outcome: Outcome;
  voided: boolean;
  before: Record<Side, FighterState>;
  after: Record<Side, FighterState>;
  events: GameEvent[];
}
export interface MatchResult { winner: Outcome; reason: 'single' | 'first_two' | 'knockout' | 'cap' | 'exhaustion' | 'goal' | 'budget' | 'overtime'; text: string }
export interface MatchState {
  experiment?: ExperimentState;
  schemaVersion: 1;
  id: string;
  design: Design;
  designHash: string;
  strategyVersion: 'public-mix-v2';
  seed: number;
  rng: RngState;
  phase: 'preparing' | 'awaitingPlayer' | 'presenting' | 'finished';
  /** Completed effective hands; a void retry does not increment this. */
  hand: number;
  /** The current / last attempt, one based. */
  attempt: number;
  preparationComplete: boolean;
  /** Rotates by effective hand, is public before either commitment, and persists on retry. */
  publicTrump: Gesture | null;
  /** One-based effective hand whose committed CPU kind is revealed; retry preserves it. */
  foreseenHand: number | null;
  /** Intent is public only after CPU commitment and only for the foreseen hand. */
  publicComputerIntent: ActionKind | null;
  overtimeActive: boolean;
  effectiveCap: number;
  fighters: Record<Side, FighterState>;
  computerCommitment: Action | null;
  history: AttemptRecord[];
  events: GameEvent[];
  processedCommands: string[];
  result: MatchResult | null;
}
/** Only disclosed facts, never a pending player action or hidden commitment. */
export interface PublicObservation {
  design: Design;
  hand: number;
  attempt: number;
  publicTrump: Gesture | null;
  overtimeActive: boolean;
  effectiveCap: number;
  self: FighterState;
  opponent: FighterState;
  history: Pick<AttemptRecord, 'player' | 'computer' | 'rawOutcome' | 'outcome' | 'voided'>[];
  legal: Action[];
  opponentLegal: Action[];
}
export interface ReplayComparisonRow {
  attempt: number;
  hand: number;
  original: Outcome;
  compared: Outcome | null;
  originalVoided: boolean;
  comparedVoided: boolean | null;
  note: string;
}
export interface ReplayComparison { rows: ReplayComparisonRow[]; stopped: boolean; reason: string | null; match: MatchState }
export interface RuleDefinition { id: RuleId; title: string; description: string; question: string; category: 'experiment' | 'match' | 'gesture' | 'life' | 'cards' | 'energy'; prerequisites: RuleId[] }
export interface AbilityDefinition { id: AbilityId; activation: 'active' | 'passive'; title: string; description: string; question: string }
