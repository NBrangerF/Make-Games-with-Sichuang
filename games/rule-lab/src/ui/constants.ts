import { RULES, ABILITIES } from '../core/design';
import type { AbilityId, ActionKind, Design, RuleId } from '../core/types';

export const actionNames: Record<ActionKind, string> = { rock: '石头', scissors: '剪刀', paper: '布', lizard: '蜥蜴', spock: '瓦肯手', charge: '蓄气', wave: '波', guard: '防御', piercing_wave: '破防波' };
export const abilityNames = Object.fromEntries(ABILITIES.map(ability=>[ability.id,ability.title])) as Record<AbilityId, string>;
export const ruleNames = Object.fromEntries(RULES.map(rule => [rule.id, rule.title])) as Record<RuleId, string>;
export function goalText(design: Design): string {
  if (design.healthOnly && design.goal === 'knockout') return '三点生命 · 击倒对手获胜';
  const cap = design.cap;
  switch (design.goal) {
    case 'single': return '一手定胜负';
    case 'first_two': return `先得两胜 · 最多 ${cap} 手`;
    case 'score': return `${cap} 手积分 · 高分获胜`;
    case 'knockout': return `三点生命 · 最多 ${cap} 手`;
    case 'collect_three': return `三招都要赢 · 最多 ${cap} 手`;
    case 'draw_three': return `你的挑战：累计三次平局 · ${cap} 手内`;
    case 'streak_two': return `你的挑战：连续赢两手 · ${cap} 手内`;
    case 'first_five_points': return `先得五分 · 最多 ${cap} 手`;
    case 'fewest_points': return `${cap} 手积分 · 低分获胜`;
    case 'efficient_wins': return `你的挑战：三气预算 · 打满 ${cap} 手`;
    case 'survive': return `你的挑战：活到第 ${cap} 手`;
  }
}
