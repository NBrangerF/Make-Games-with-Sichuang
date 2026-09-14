import type { DesignDocument } from '../core/types';

export interface Expression {
  name: string | null;
  style: 'ink' | 'cyanotype' | 'cel' | 'manga' | 'arcade';
  sound: 'paper' | 'electronic';
  rulesView: 'graph' | 'list';
  ending: 'quiet' | 'stamp';
  cover: 'centered' | 'diagonal';
  outcome: 'compact' | 'detailed';
  resources: 'blocks' | 'numbers';
  reveal: 'quick' | 'rhythm';
}

export interface Preferences {
  muted: boolean;
  volume: number;
  reducedMotion: boolean;
}

export type ExperienceFact =
  | 'handPlayed' | 'experimentCompleted' | 'seriesCompleted'
  | 'fiveGesturesPlayed' | 'abilityDeclared' | 'abilityTriggered'
  | 'damageObserved' | 'energySpent' | 'chargeUsed' | 'waveObserved' | 'shieldBlocked'
  | 'inventoryDepleted' | 'retryObserved' | 'multipleReveals'
  | 'reachedCap' | 'repeatedGesture' | 'longSeries' | 'damageDealt' | 'gestureDrawEnergy' | 'gestureBoostUsed'
  | 'drawObserved' | 'consecutiveWins' | 'scoreSeriesCompleted'
  | 'capDraw' | 'twoWinningGestures' | 'playerWin' | 'playerLoss' | 'streakBroken' | 'scoreModifierExperienced' | 'paidAttackObserved' | 'paidGuardObserved' | 'lifeDrawObserved' | 'woundedWin' | 'lifeCapUnequal' | 'lowLifeObserved' | 'cardDrawSpent' | 'cpuInventorySpent' | 'guardObserved' | 'paidWaveObserved' | 'twoEnergyObserved' | 'energyCarried' | 'lowEnergyLoss' | 'energyCapReached' | 'boostWon' | 'boostLost' | 'rockWin' | 'scissorsWin' | 'paperWin';
export type JourneyDirection = 'mixed' | 'rules' | 'expression';
export type InvitationState = 'unseen' | 'invited' | 'later' | 'simple' | 'accepted';
export type UIUnlock = 'rules' | 'workshop' | 'settings' | 'cover' | 'outcome' | 'sound';

/** Card-earned interfaces and the third-rule workshop remain unlocked after rollback. */
export function getUnlockedUI(journey: Pick<JourneyState, 'choices'> & Partial<Pick<JourneyState, 'introducedRuleIds'>>): Record<UIUnlock, boolean> {
  const selected = new Set(journey.choices);
  return {
    rules: selected.has('U06'), workshop: new Set(journey.introducedRuleIds ?? []).size >= 3, settings: selected.has('U18'),
    cover: false, outcome: false, sound: selected.has('U11'),
  };
}

export interface VersionSnapshot {
  id: string;
  label: string;
  createdAt: string;
  design: DesignDocument;
  expression: Expression;
}

export interface JourneyState {
  /** Effective hands across every match in this creation; void retries do not count. */
  completedHands: number;
  facts: ExperienceFact[];
  invitation: InvitationState;
  direction: JourneyDirection;
  choices: string[];
  /** Distinct rule cards successfully introduced in this creation, independent of current installation or catalogue. */
  introducedRuleIds: string[];
  completedMatchIds: string[];
  seenAttemptIds: string[];
  versions: VersionSnapshot[];
}

export const defaultExpression: Expression = {
  name: null, style: 'ink', sound: 'paper', rulesView: 'graph',
  ending: 'quiet', cover: 'centered', outcome: 'compact',
  resources: 'blocks', reveal: 'quick',
};

export const defaultPreferences: Preferences = { muted: false, volume: 0.45, reducedMotion: false };

export function createJourney(): JourneyState {
  return { completedHands: 0, facts: [], invitation: 'unseen', direction: 'mixed', choices: [], introducedRuleIds: [], completedMatchIds: [], seenAttemptIds: [], versions: [] };
}

/** Four completed hands mean the creator has reached their fifth hand. */
export function canRollbackRules(journey: Pick<JourneyState, 'completedHands'>): boolean {
  return journey.completedHands >= 4;
}

export function graphemeLength(text: string): number {
  return [...new Intl.Segmenter('zh', { granularity: 'grapheme' }).segment(text)].length;
}

export function validateName(text: string): { ok: true; name: string | null } | { ok: false; error: string } {
  const name = text.trim();
  if (!name) return { ok: true, name: null };
  if (/[\r\n\u0000-\u001f\u007f]/u.test(name)) return { ok: false, error: '请使用单行名称。' };
  if (graphemeLength(name) > 24) return { ok: false, error: '名称最多 24 个可见字符，中文和 emoji 都按一个字形计数。' };
  return { ok: true, name };
}
