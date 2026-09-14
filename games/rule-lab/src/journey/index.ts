import { compileDesign, isGesture } from '../core';
import type { DesignDocument, MatchState } from '../core/types';
import { createJourney, type Expression, type ExperienceFact, type InvitationState, type JourneyState, type VersionSnapshot } from './types';
export * from './types';

/** Only records disclosed attempts and committed outcome events. Appearance is never evidence. */
export function observeMatch(journey: JourneyState, match: MatchState): JourneyState {
  const facts = new Set(journey.facts);
  const compiled = compileDesign(match.design);
  const attempts = new Set(journey.seenAttemptIds);
  let completedHands = journey.completedHands;
  const add = (fact: ExperienceFact) => facts.add(fact);
  for (const record of match.history) {
    const key = `${match.id}:${record.attempt}`;
    if (attempts.has(key)) continue;
    attempts.add(key);
    add('handPlayed');
    if (match.design.rules.includes('gesture.five')) add('fiveGesturesPlayed');
    if (record.player.ability || record.computer.ability) add('abilityDeclared');
    if (record.voided) add('retryObserved');
    for (const event of record.events) {
      if (event.type === 'retry') add('abilityTriggered');
      if (event.type === 'energy_spent' && event.side === 'player' && (event.amount ?? 0) > 0) add('energySpent');
      if (event.type === 'charged' && event.side === 'player') add('chargeUsed');
      if (event.type === 'wave_observed') add('waveObserved');
      if (event.type === 'damage' && (event.amount ?? 0) > 0) { add('damageObserved'); if (event.side === 'computer') add('damageDealt'); }
      if (event.type === 'gesture_draw_energy') add('gestureDrawEnergy');
      if (event.type === 'shield_absorbed' && (event.amount ?? 0) > 0) add('shieldBlocked');
      if (['foresight_granted', 'last_stand_triggered'].includes(event.type)) add('abilityTriggered');
      if (['energy_transferred', 'cards_reforged'].includes(event.type) && (event.amount ?? 0) > 0) add('abilityTriggered');
      if (event.type === 'shield_gained' && event.side === 'player' && event.ability === 'ability.aegis' && (event.amount ?? 0) > 0) add('abilityTriggered');
      if (!record.voided && event.type === 'passive_triggered' && event.side === 'player' && (event.amount ?? 0) > 0) add('abilityTriggered');
    }
    // Resource diffs are independent of event prose and also cover imported older event descriptions.
    if (!record.voided) {
      completedHands++;
      if (record.outcome === 'draw') add('drawObserved');
      const before = record.before.player, after = record.after.player;
      if (record.outcome === 'player') {
        add('playerWin');
        if (record.player.kind === 'rock') add('rockWin');
        if (record.player.kind === 'scissors') add('scissorsWin');
        if (record.player.kind === 'paper') add('paperWin');
      }
      if (record.outcome === 'computer') add('playerLoss');
      if ((before.winStreak > 0 && record.outcome !== 'player') || (record.before.computer.winStreak > 0 && record.outcome !== 'computer')) add('streakBroken');
      if (compiled.life) {
        if (record.outcome === 'draw' && before.life === after.life && record.before.computer.life === record.after.computer.life) add('lifeDrawObserved');
        if (record.outcome === 'player' && before.life < 3) add('woundedWin');
        if ([before.life, after.life, record.before.computer.life, record.after.computer.life].includes(1)) add('lowLifeObserved');
      }
      if (compiled.finiteCards) {
        if (record.outcome === 'draw' && record.events.some(e => e.type === 'cards_spent')) add('cardDrawSpent');
        if (record.events.some(e => e.type === 'cards_spent' && e.side === 'computer')) add('cpuInventorySpent');
        // Spending can emit depletion before a draw refund restores the card.
        // Only a final transition to zero in an active gesture counts as experience.
        if ((['player', 'computer'] as const).some(side => compiled.gestures.some(gesture => record.before[side].cards[gesture] > 0 && record.after[side].cards[gesture] === 0))) add('inventoryDepleted');
      }
      if (compiled.energy) {
        if (before.energy >= 2 || after.energy >= 2) add('twoEnergyObserved');
        if (before.energy >= 3 || after.energy >= 3) add('energyCapReached');
        if (record.hand > 1 && before.energy > 0) add('energyCarried');
        if (before.energy < 2 && record.outcome === 'computer') add('lowEnergyLoss');
        if (after.energySpent > before.energySpent) {
          if (record.player.kind === 'guard') add('paidGuardObserved');
          else add('paidAttackObserved');
          if (record.player.kind === 'wave' && after.energySpent - before.energySpent === 2) add('paidWaveObserved');
        }
        if (record.player.boost > 0 && record.outcome === 'player') add('boostWon');
        if (record.player.boost > 0 && record.outcome === 'computer') add('boostLost');
      }
      if (record.events.some(e => e.type === 'guard_blocked')) add('guardObserved');
      if ((compiled.drawPoint && record.outcome === 'draw') || (compiled.combo && Math.max(after.winStreak, record.after.computer.winStreak) >= 2) || (compiled.lastDouble && record.hand === compiled.cap && record.events.some(e => e.type === 'score_awarded' && (e.amount ?? 0) > 0))) add('scoreModifierExperienced');

      if (record.before.player.energySpent < record.after.player.energySpent) add('energySpent');
      if (record.player.boost > 0) add('gestureBoostUsed');
      if (record.player.kind === 'charge') add('chargeUsed');
      if (['wave', 'piercing_wave'].includes(record.player.kind) || ['wave', 'piercing_wave'].includes(record.computer.kind)) add('waveObserved');
      if (record.before.player.life > record.after.player.life || record.before.computer.life > record.after.computer.life) add('damageObserved');
      if (record.before.computer.life > record.after.computer.life) add('damageDealt');
      if (record.rawOutcome !== record.outcome) add('abilityTriggered');
      if (record.rawOutcome === 'draw' && record.player.ability && record.computer.ability && match.design.abilities.player === 'ability.claim_draw' && match.design.abilities.computer === 'ability.claim_draw') add('abilityTriggered');
    }
  }
  const effective = match.history.filter(record => !record.voided);
  if (effective.some((record, index) => index > 0 && record.outcome !== 'draw' && record.outcome === effective[index - 1].outcome)) add('consecutiveWins');
  if (attempts.size >= 2) add('multipleReveals');
  if (effective.length >= 4 && match.design.cap > 1) add('longSeries');
  if (effective.some((record, index) => index > 0 && record.player.kind === effective[index - 1].player.kind && isGesture(record.player.kind))) add('repeatedGesture');
  if (['rockWin', 'scissorsWin', 'paperWin'].filter(f => facts.has(f as ExperienceFact)).length >= 2) add('twoWinningGestures');
  const completedMatchIds = new Set(journey.completedMatchIds);
  if (match.result) {
    add('experimentCompleted');
    completedMatchIds.add(match.id);
    if (match.design.cap > 1) add('seriesCompleted');
    if (compiled.ui.score) add('scoreSeriesCompleted');
    if (!compiled.healthOnly && match.hand >= match.design.cap && match.design.cap > 1) {
      add('reachedCap');
      if (match.result.winner === 'draw') add('capDraw');
      if (compiled.life && match.fighters.player.life !== match.fighters.computer.life) add('lifeCapUnequal');
    }
  }
  return { ...journey, completedHands, facts: [...facts], completedMatchIds: [...completedMatchIds], seenAttemptIds: [...attempts] };
}

export function shouldInviteAbility(journey: JourneyState): boolean {
  return journey.facts.includes('seriesCompleted') && journey.invitation === 'unseen';
}

export function respondToInvitation(journey: JourneyState, response: InvitationState): JourneyState {
  return { ...journey, invitation: response };
}

export function recordChoice(journey: JourneyState, choiceId: string, kind?: 'rule' | 'ability' | 'expression'): JourneyState {
  // Called only after a successful commit. The caller supplies the card's kind at introduction time.
  // Never classify past choices through today's catalogue: removing a card must not erase earned tools.
  if (journey.choices.includes(choiceId)) return journey;
  const introducedRuleIds = journey.introducedRuleIds ?? [];
  return {
    ...journey,
    choices: [...journey.choices, choiceId],
    introducedRuleIds: kind === 'rule' && !introducedRuleIds.includes(choiceId)
      ? [...introducedRuleIds, choiceId] : introducedRuleIds,
  };
}

export function snapshotVersion(journey: JourneyState, design: DesignDocument, expression: Expression, label: string, now = new Date().toISOString()): JourneyState {
  const snapshot: VersionSnapshot = {
    id: `version-${now}-${journey.versions.length + 1}`, label, createdAt: now,
    design: structuredClone(design), expression: structuredClone(expression),
  };
  return { ...journey, versions: [...journey.versions, snapshot] };
}

export function restoreVersion(journey: JourneyState, id: string): VersionSnapshot | null {
  const version = journey.versions.find(item => item.id === id);
  return version ? structuredClone(version) : null;
}

/** Starting a new work preserves archived versions; preferences are outside this function. */
export function journeyAtOrigin(journey: JourneyState): JourneyState {
  return { ...createJourney(), versions: structuredClone(journey.versions) };
}
