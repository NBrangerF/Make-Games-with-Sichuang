import { EXPERIMENT_RULES } from '../experiments/catalog';
import { ABILITIES, compileDesign, GOAL_LABELS, nextRandom, previewRuleChange } from '../core';
import type { AbilityId, ChangePreview, DesignDocument, MatchState, RngState, RuleId } from '../core/types';
import type { Expression, JourneyState } from '../journey/types';
import { ALL_CHOICES, type ChoiceCard } from './catalog';
export * from './catalog';
export { getUnlockedUI } from '../journey/types';

export interface ChoiceContext {
  design: DesignDocument;
  match: MatchState;
  journey: JourneyState;
  expression: Expression;
  forSave?: boolean;
}
export interface ChoiceEligibility {
  eligible: boolean;
  checks: { H: boolean; E: boolean; O: boolean; P: boolean };
  reasons: string[];
  preview?: ChangePreview;
}

export function evaluateChoice(choice: ChoiceCard, context: ChoiceContext, options: { free?: boolean } = {}): ChoiceEligibility {
  const { design, journey } = context;
  const compiled = compileDesign(design);
  const hasAction = (action: string) => compiled.actions.some(candidate => candidate === action);
  const hasRule = (rule: string) => design.rules.some(candidate => candidate === rule);
  const facts = new Set(journey.facts);
  const reasons: string[] = [];
  const checks = { H: true, E: choice.experience.every(fact => facts.has(fact)), O: true, P: choice.presentationReady };
  let preview: ChangePreview | undefined;
  if (choice.kind === 'rule') {
    const rule = choice.ruleId ?? choice.id as RuleId;
    if (design.rules.includes(rule)) {
      checks.H = false;
      reasons.push('当前已包含这项规则，可在作品工具中撤回。');
    }
    preview = previewRuleChange(design, { type: 'install', rule });
    checks.H = checks.H && preview.valid;
    if (!preview.valid) reasons.push(...preview.errors);
    if(choice.id.startsWith('experiment.')){
      const dependencies:Record<string,string[]>={pledge:['experiment.declaration'],terrain:['experiment.sites'],all_pay:['experiment.auction'],script:['experiment.queue'],shuffle:['experiment.deck'],technology:['experiment.factory']};
      checks.O=(dependencies[choice.id.slice(11)]??[]).every(hasRule);
    }
    if (choice.id === 'energy.wave') checks.O = compiled.energy;
    if (choice.id === 'energy.active_charge') checks.O = true;
    if (choice.id === 'cards.finite' || choice.id === 'action.cooldown') checks.O = compiled.life;
    if (choice.id.startsWith('life.') && choice.id !== 'life.knockout') checks.O = compiled.life;
    if (choice.id === 'cards.draw_refund') checks.O = compiled.life && compiled.finiteCards;
    if (choice.id === 'energy.guard_paid') checks.O = compiled.energy && hasAction('wave') && hasAction('guard') && (hasAction('charge') || compiled.gestures.length > 0);
    if (choice.id === 'energy.piercing_wave') checks.O = compiled.energy && compiled.energyCap >= 3 && hasAction('wave') && hasAction('guard');
    if (choice.id === 'energy.cheap_wave') checks.O = compiled.energy && hasAction('wave');
    if (choice.id === 'energy.opening_two') checks.O = compiled.energy && compiled.energyCap >= 2;
    if (choice.id === 'energy.leak_thirds') checks.O = compiled.life && compiled.energy;
    if (choice.id === 'energy.loss_charge') checks.O = compiled.energy;
    if (choice.id === 'energy.cap_five') checks.O = compiled.energy && compiled.energyCap === 3;
    if (choice.id === 'energy.double_boost') checks.O = compiled.life && compiled.energyCap >= 2 && hasRule('energy.gesture_boost');
    if (choice.id === 'cards.charge_trade') checks.O = compiled.life && compiled.finiteCards && compiled.energy && hasAction('charge');
    if (choice.id === 'cards.capture' || choice.id === 'cards.combo_refund') checks.O = compiled.life && compiled.finiteCards;
    if (choice.id === 'combo.three_styles') checks.O = compiled.life && compiled.gestures.length >= 3;
    if (choice.id === 'energy.wager' || choice.id === 'energy.overflow_shield' || choice.id === 'energy.restraint') checks.O = compiled.life && compiled.energy;
    if (choice.id === 'shield.guard_store') checks.O = compiled.life && hasAction('guard') && hasAction('wave');
    if (choice.id === 'action.special_cooldown') checks.O = compiled.life && compiled.actions.filter(action => ['charge', 'wave', 'guard', 'piercing_wave'].includes(action)).length >= 2;
    if (choice.id === 'shield.piercing_boost') checks.O = compiled.life && hasRule('energy.gesture_boost') && (
      ['combo.three_styles', 'shield.guard_store', 'energy.overflow_shield'].some(hasRule) || ['ability.aegis', 'ability.rock_guardian'].some(id => id === design.abilities.player)
    );
  } else if (choice.kind === 'ability') {
    preview = previewRuleChange(design, { type: 'ability', side: 'player', ability: choice.id as AbilityId });
    checks.H = preview.valid && design.abilities.player !== choice.id;
    if (!preview.valid) reasons.push(...preview.errors);
    checks.O = true;
    const roleSupport:Record<string,string[]>={storyteller:['experiment.pledge'],ronin:['experiment.push'],clockmaker:['experiment.queue'],scrapper:['experiment.draft'],broker:['experiment.auction'],kite:['experiment.range'],smith:['experiment.furnace'],monk:['experiment.sharing'],sheathed:['experiment.modifiers','experiment.deck'],cartographer:['experiment.puzzle']};
    const support=roleSupport[choice.id.slice(8)];if(support)checks.O=support.some(hasRule);
    if (choice.id === 'ability.siphon') checks.O = compiled.life && compiled.energy;
    if (choice.id === 'ability.reforge') checks.O = compiled.life && compiled.finiteCards;
    if (design.abilities.player === choice.id) reasons.push('你已经装备这个能力。');
  } else {
    if (choice.id === 'U08') checks.H = compiled.life || compiled.energy || compiled.finiteCards;
  }
  // The library permits unhelpful experiments. Experience gates curate random
  // suggestions only; schema/duplicate checks still protect valid transactions.
  if (options.free && choice.kind !== 'expression') { checks.E = facts.has('handPlayed'); checks.O = true; }
  // Selection is permanent for this journey, even if its effect is later replaced or undone.
  if (journey.choices.includes(choice.id)) {
    checks.H = false;
    reasons.push('这一轮已经留下过这个选择，不会再次进入卡池。');
  }
  if (!checks.H && reasons.length === 0) reasons.push(choice.prerequisiteText);
  if (!checks.E) reasons.push(`再体验一步：${choice.prerequisiteText}`);
  if (!checks.O) reasons.push('当前缺少适用的生命、资源或动作；先体验对应的规则。');
  if (!checks.P) reasons.push('这项内容还没有完整的界面与声音支持。');
  return { eligible: Object.values(checks).every(Boolean), checks, reasons, preview };
}

export interface ChoiceDrawInput { seed: number; draw: number; limit?: number }
export const EXPRESSION_OFFER_CHANCE = 0.22;
export const FIRST_ABILITY_OFFER_CHANCE = 0.45;
export const LATER_ABILITY_OFFER_CHANCE = 0.15;
export type ChoicePoolState = 'gameplay' | 'short_gameplay' | 'expression_only' | 'awaiting_experience' | 'complete';
export interface ChoiceDraw {
  cards: ChoiceCard[];
  availableCount: number;
  mechanicalAvailableCount: number;
  expressionAvailableCount: number;
  /** Unchosen cards that need another state or experience before becoming eligible. */
  lockedCount: number;
  poolState: ChoicePoolState;
  expressionAvailable: boolean;
  visualAvailable: boolean;
  /** No eligible unseen card remains. A short offer is not necessarily exhausted. */
  exhausted: boolean;
}

// Eligibility depends only on the design and earned/selected IDs. Keep a small
// value-keyed cache: in-place changes also invalidate it, and no RNG result is cached.
const eligibilityCache = new Map<string, ChoiceCard[]>();
function eligibleForDraw(context: ChoiceContext): ChoiceCard[] {
  const key = JSON.stringify([context.design, context.journey.facts, context.journey.choices]);
  const cached = eligibilityCache.get(key);
  if (cached) return cached;
  const eligible = ALL_CHOICES.filter(choice => evaluateChoice(choice, context).eligible);
  if (eligibilityCache.size >= 16) eligibilityCache.delete(eligibilityCache.keys().next().value!);
  eligibilityCache.set(key, eligible);
  return eligible;
}

/**
 * Explicit event-time draw: no clock, global randomness, preference inference, or match RNG.
 * The UI keeps the returned batch while cancelling/reopening an editor. Re-rendering is not a draw.
 */
export function drawChoices(context: ChoiceContext, input: ChoiceDrawInput): ChoiceDraw {
  const limit = input.limit ?? 3;
  if (!Number.isInteger(input.seed) || input.seed < 0 || input.seed > 0xffffffff) throw new RangeError('抽卡种子必须是无符号 32 位整数。');
  if (!Number.isSafeInteger(input.draw) || input.draw < 0) throw new RangeError('抽卡序号必须是非负安全整数。');
  if (!Number.isSafeInteger(limit) || limit < 1) throw new RangeError('每批张数必须是正整数。');
  const eligible = eligibleForDraw(context);
  const expression = eligible.filter(choice => choice.kind === 'expression');
  const visual = expression.filter(choice => choice.expressionKey !== 'sound');
  const mechanical = eligible.filter(choice => choice.kind !== 'expression');
  const rules = eligible.filter(choice => choice.kind === 'rule');
  const abilities = eligible.filter(choice => choice.kind === 'ability');
  const selectedIds = new Set(context.journey.choices);
  const hasChosenAbility = ABILITIES.some(ability => selectedIds.has(ability.id));
  // Reuse the existing pure PRNG algorithm with a distinct local state/domain.
  const drawLow = input.draw >>> 0;
  const drawHigh = Math.floor(input.draw / 0x100000000);
  let rng: RngState = { algorithm: 'mulberry32-v1', state: (input.seed ^ Math.imul(drawLow + 1, 0x9e3779b1) ^ Math.imul(drawHigh, 0x85ebca6b) ^ 0x63617264) >>> 0 };
  const random = () => { const next = nextRandom(rng); rng = next.rng; return next.value; };
  const shuffle = <T,>(items: readonly T[]): T[] => {
    const result = [...items];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [result[i], result[j]] = [result[j]!, result[i]!];
    }
    return result;
  };
  // Decide whole-batch categories before choosing individual cards. More characters
  // never increase their category's probability; removing an equipped one never resets it.
  const expressionRoll = random(), abilityRoll = random();
  const includeExpression = expression.length > 0 && (
    mechanical.length === 0 || (limit > 1 && expressionRoll < EXPRESSION_OFFER_CHANCE)
  );
  // With no eligible rule there is no gameplay replacement: one character is the
  // explicit fallback, even after a previous character. Never fill with multiple abilities.
  const includeAbility = abilities.length > 0 && (
    rules.length === 0 || abilityRoll < (hasChosenAbility ? LATER_ABILITY_OFFER_CHANCE : FIRST_ABILITY_OFFER_CHANCE)
  );
  const slots=limit-Number(includeExpression)-Number(includeAbility);
  const familiar=rules.filter(card=>!card.id.startsWith('experiment.'));
  const novel=rules.filter(card=>card.id.startsWith('experiment.'));
  const selected:ChoiceCard[]=[];
  // Reserve room for the established routes. New-card volume must not drown them.
  if(familiar.length&&novel.length&&slots>0){
    const useNovel=slots>=2||random()<.4;
    if(useNovel){
      const groups=[...new Set(novel.map(card=>EXPERIMENT_RULES.find(r=>r.id===card.id)!.group))];
      const group=groups[Math.floor(random()*groups.length)];
      const options=novel.filter(card=>EXPERIMENT_RULES.find(r=>r.id===card.id)!.group===group);
      selected.push(options[Math.floor(random()*options.length)]!);
    }
    selected.push(...shuffle(familiar).slice(0,slots-selected.length));
    if(selected.length<slots)selected.push(...shuffle(novel.filter(card=>!selected.includes(card))).slice(0,slots-selected.length));
  }else selected.push(...shuffle(rules).slice(0,slots));
  if (includeAbility) selected.push(abilities[Math.floor(random() * abilities.length)]!);
  if (includeExpression) selected.push(expression[Math.floor(random() * expression.length)]!);
  const lockedCount = ALL_CHOICES.filter(choice => !selectedIds.has(choice.id)).length - eligible.length;
  // Availability counts remain eligibility counts; category limits only reduce the
  // number of gameplay slots the pool can actually supply in one batch.
  const gameplayCapacity = rules.length + Number(abilities.length > 0);
  const poolState: ChoicePoolState = gameplayCapacity >= limit ? 'gameplay'
    : gameplayCapacity > 0 ? 'short_gameplay'
      : expression.length > 0 ? 'expression_only'
        : lockedCount > 0 ? 'awaiting_experience' : 'complete';
  return {
    cards: shuffle(selected), availableCount: eligible.length,
    mechanicalAvailableCount: mechanical.length, expressionAvailableCount: expression.length, lockedCount, poolState,
    expressionAvailable: expression.length > 0, visualAvailable: visual.length > 0, exhausted: eligible.length === 0,
  };
}

export function describePreview(preview: ChangePreview): string[] {
  const title = (id: string) => {
    const owner = id.startsWith('player:') ? '玩家' : id.startsWith('computer:') ? '电脑' : '';
    const bare = owner ? id.slice(id.indexOf(':') + 1) : id;
    return owner + (ALL_CHOICES.find(choice => choice.id === bare)?.title ?? bare);
  };
  const duration = preview.nextDesign.healthOnly
    ? '生命归零结束，不设固定手数'
    : preview.nextDesign.rules.includes('ending.bounded_overtime')
    ? `基础 ${preview.cap} 手，同分时最多 ${preview.cap + 3} 手`
    : `最多 ${preview.cap} 手`;
  return [
    ...preview.added.map(id => `加入：${title(id)}`),
    ...preview.removed.map(id => `退出：${title(id)}`),
    `主目标：${preview.nextDesign.healthOnly ? '击倒对手' : GOAL_LABELS[preview.goal]}；${duration}。`,
    `你的专属能力：${preview.abilities.player ? title(preview.abilities.player) : '无'}。`,
    ...preview.notes,
  ];
}
