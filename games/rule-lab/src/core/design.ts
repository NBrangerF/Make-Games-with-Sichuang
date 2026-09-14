import { cardMode } from '../cards/engine';
import { EXPERIMENT_RULES, EXPERIMENT_ABILITIES } from '../experiments/catalog';
import type { AbilityDefinition, AbilityId, ChangePreview, CompiledDesign, Design, Goal, RuleChange, RuleDefinition, RuleId, Side } from './types';

export class RuleError extends Error { constructor(message: string) { super(message); this.name = 'RuleError'; } }
export const RULES: RuleDefinition[] = [
  ...EXPERIMENT_RULES,
  { id: 'match.first_two', title: '先赢两手', description: '最多五手，先获得两次胜利者胜；到期比较胜场，平局占一手。', question: '从赢一手变成赢一场，你会怎样安排机会？', category: 'match', prerequisites: [] },
  { id: 'match.score_five', title: '五手积分赛', description: '固定打满五手，胜者得一分，平局不加分；最后比较积分。', question: '领先也不能提前结束，会改变你怎么出手吗？', category: 'match', prerequisites: [] },
  { id: 'tempo.extend_cap', title: '给策略更多时间', description: '把三或五手延长到九手；进阶卡可直接改为十三手，提前结束条件保留。', question: '更多时间带来准备，还是重复？', category: 'match', prerequisites: [] },
  { id: 'tempo.short_cap', title: '三手短赛', description: '将当前赛程缩为三手，替换原有延长；目标不变。不与有限手牌并存。', question: '只剩三手，哪一次试探还值得？', category: 'match', prerequisites: [] },
  { id: 'score.draw_point', title: '平局各得一分', description: '最终平局时双方各得一分；分数增加，但分差不变。', question: '都加一分，真的改变了胜负吗？', category: 'match', prerequisites: [] },
  { id: 'score.combo', title: '连胜加分', description: '第二次连续获胜起，每手多得一分；平局或失败中断连胜，作废尝试不影响。', question: '保住一段连胜，会让你变得大胆还是谨慎？', category: 'match', prerequisites: [] },
  { id: 'score.last_double', title: '末手积分翻倍', description: '基础上限那一手的全部得分翻倍，包含平局分与连胜加分；加时不再次翻倍。', question: '最后一手更重，你会把能力留到那时吗？', category: 'match', prerequisites: [] },
  { id: 'gesture.five', title: '五种手势', description: '加入蜥蜴与瓦肯手，每种手势都胜两种、负两种；赛程不变。', question: '选项更多，是否等于决策更深？', category: 'gesture', prerequisites: [] },
  { id: 'gesture.reverse', title: '克制反转', description: '所有手势的克制方向倒转，同手势仍平；气动作不反转。', question: '熟悉的约定变了，直觉还可靠吗？', category: 'gesture', prerequisites: [] },
  { id: 'action.cooldown', title: '不能连出', description: '上一有效手使用的手势，下一手不能再用；换招或气动作后恢复。', question: '限制你的选择，也会告诉对手什么？', category: 'gesture', prerequisites: [] },
  { id: 'life.knockout', title: '三点生命', description: '双方三生命，交锋败者受一伤；生命归零结束，没有固定手数上限。', question: '当失败成为资源的减少，玩法多了什么空间？', category: 'life', prerequisites: [] },
  { id: 'cards.finite', title: '有限手牌', description: '每种手势各三张，出手即耗一张，平局也消耗。你无动作则负；电脑无动作时普通目标你胜，玩家挑战按实际条件检查。', question: '想出什么与手里有什么，什么时候开始不同？', category: 'cards', prerequisites: [] },
  { id: 'cards.two_each', title: '每种只留两张', description: '下一局每种手势从三张改为两张。', question: '稀缺一点，选择会更珍贵吗？', category: 'cards', prerequisites: ['cards.finite'] },
  { id: 'cards.exchange_once', title: '两张换一张', description: '每局一次，准备阶段用两张相同手牌换一张不同手势；不推进手数。', question: '为合适的资源，愿意牺牲多少数量？', category: 'cards', prerequisites: ['cards.finite'] },
  { id: 'energy.gesture_boost', title: '让手势带上气', description: '双方初始一气、上限三；花一气强化手势，获胜多造成一伤，负平仍付费。双方手势最终平局各得一气。', question: '你愿意为一次不确定的胜利预先付费吗？', category: 'energy', prerequisites: [] },
  { id: 'energy.active_charge', title: '主动蓄气', description: '新增蓄气动作，先获得一气；输给手势与波，不消耗手牌。', question: '主动放弃一次交锋，值得吗？', category: 'energy', prerequisites: [] },
  { id: 'energy.wave', title: '加入波', description: '花两气发波，胜所有手势与蓄气，同波平；基础伤害一。', question: '气用来压制，还是下注手势伤害？', category: 'energy', prerequisites: [] },
  { id: 'energy.guard', title: '加入防御', description: '零气防御挡波为平，输给任何手势；与蓄气、防御平，防御本身不产气。', question: '手势、波与防御形成了怎样的新循环？', category: 'energy', prerequisites: ['energy.wave'] },
  { id: 'ending.bounded_overtime', title: '给平分一次机会', description: '上限同分时最多加三手，首次拉开差距即结束；仍平则平局。', question: '拒绝平局增加了什么？', category: 'match', prerequisites: [] },
  { id: 'goal.collect_three', title: '三招都要赢', description: '双方竞赛集齐石头、剪刀、布的胜利；到期比较种数。', question: '已经赢过的手势还值多少？', category: 'match', prerequisites: [] },
  { id: 'goal.draw_three', title: '握手三次', description: '玩家累计三次最终平局即成功；到期不足则失败。', question: '平局何时成为你想要的结果？', category: 'match', prerequisites: [] },
  { id: 'goal.streak_two', title: '连赢两手', description: '玩家连续两胜成功；平负中断，到期未成则失败。', question: '会清零的进度怎样改变风险？', category: 'match', prerequisites: [] },
  { id: 'goal.first_five_points', title: '先得五分', description: '任一方至少五分即比较积分；同手同分平，到期也比积分。', question: '奖励什么时候兑现最重要？', category: 'match', prerequisites: [] },
  { id: 'goal.fewest_points', title: '少得分者胜', description: '交锋仍奖励胜者，到期分数较低的一方赢。', question: '赢一手和赢一场还是一回事吗？', category: 'match', prerequisites: [] },
  { id: 'goal.efficient_wins', title: '三气预算', description: '玩家到期至少两胜且实际气费不超过三；超过预算立即失败。', question: '剩余资源与使用效率有什么不同？', category: 'match', prerequisites: [] },
  { id: 'gesture.remove_rock', title: '少一个选项', description: '双方移除石头，保留剪刀与布；明确存在优势手势。', question: '删去选项会使游戏更平衡吗？', category: 'gesture', prerequisites: [] },
  { id: 'gesture.public_trump', title: '每手一张王牌', description: '按手势顺序轮换公开王牌，胜其余手势；仍不改变波和防御。', question: '公开优势需要怎样的代价？', category: 'gesture', prerequisites: [] },
  { id: 'life.draw_damage', title: '平局也受伤', description: '所有最终平局双方各受一伤，包括格挡平局。', question: '安全结果开始有了什么成本？', category: 'life', prerequisites: [] },
  { id: 'life.win_heal', title: '胜利回复生命', description: '每次交锋胜者恢复一生命，最多三；伤害先于恢复。', question: '进攻与恢复同向时会怎样？', category: 'life', prerequisites: [] },
  { id: 'life.survive', title: '活着就算成功', description: '玩家到期存活或先击倒对手即成功；玩家零生命，包括同归零，失败。', question: '失去进攻压力后会怎样选择？', category: 'life', prerequisites: [] },
  { id: 'life.last_hit_double', title: '末手伤害翻倍', description: '仅基础上限那一手的伤害翻倍，包括平局伤害；恢复不翻倍。', question: '最后的威胁会改变早先的行为吗？', category: 'life', prerequisites: [] },
  { id: 'life.desperation', title: '背水一战', description: '本手开始只有一生命时，获胜基础伤害为二；之后再加强化和末手乘数。', question: '危险的力量会鼓励翻盘还是自伤？', category: 'life', prerequisites: [] },
  { id: 'cards.draw_refund', title: '平局退牌', description: '最终平局时退回本手实际消耗的手势牌；特殊动作没有牌可退。', question: '降低结果的成本会改变追求吗？', category: 'cards', prerequisites: ['cards.finite'] },
  { id: 'cards.dealer_refill', title: '对面换成庄家', description: '电脑无合法手势时在下一手承诺前按初始配方补满；玩家不补。', question: '不对称限制会怎样影响体验？', category: 'cards', prerequisites: ['cards.finite'] },
  { id: 'energy.guard_paid', title: '防御也要一气', description: '防御费用改为一气，受击或平局都支付。', question: '保护自己的机会值多少？', category: 'energy', prerequisites: ['energy.guard'] },
  { id: 'energy.piercing_wave', title: '加入破防波', description: '新增三气破防波，胜手势、蓄气、防御；与任一种波平。', question: '覆盖更多回应值得更高代价吗？', category: 'energy', prerequisites: ['energy.wave', 'energy.guard'] },
  { id: 'energy.cheap_wave', title: '一气就能发波', description: '普通波降至一气，破防波仍三气。', question: '降低费用怎样改变动作价值？', category: 'energy', prerequisites: ['energy.wave'] },
  { id: 'energy.opening_two', title: '带着两气入场', description: '双方初始气改为二，容量和费用不变。', question: '开局资源怎样影响第一手？', category: 'energy', prerequisites: [] },
  { id: 'energy.leak_thirds', title: '气会漏掉', description: '每第三有效手在费用、蓄气与回气之后双方各漏一气，最低零。', question: '资源会过期时何时使用？', category: 'energy', prerequisites: [] },
  { id: 'energy.loss_charge', title: '败者蓄力', description: '最终败者额外获得一气至上限；平局不触发。', question: '失败也有收益会怎样？', category: 'energy', prerequisites: [] },
  { id: 'energy.cap_five', title: '更大的气槽', description: '气容量从三改五，不额外发气。', question: '存得更多就一定更有策略吗？', category: 'energy', prerequisites: [] },
  { id: 'energy.double_boost', title: '更重的手势强化', description: '新增花二气、获胜多二伤的手势档位；平负仍付费。', question: '能下注更多时何时收手？', category: 'energy', prerequisites: ['energy.gesture_boost'] },
  { id: 'cards.charge_trade', title: '以牌换气', description: '蓄气改为弃一张当前库存最多的手势牌，获得至多二气；同库存按手势顺序，无牌不能蓄气。', question: '未来的选择能换取眼前的力量吗？', category: 'cards', prerequisites: ['cards.finite', 'energy.active_charge'] },
  { id: 'energy.wager', title: '押一气', description: '手势可另押一气，与强化一起预付；最终胜返二气、平返一气、负不返，受容量限制。', question: '你对这一手判断有多大把握？', category: 'energy', prerequisites: [] },
  { id: 'combo.three_styles', title: '三招成势', description: '连续三次使用不同手势，结算伤害后获得一层盾并清空连段；重复从当前手势重计，气动作打断。', question: '换招如何积累下一步的保护？', category: 'life', prerequisites: [] },
  { id: 'cards.capture', title: '胜者缴获', description: '双方出手势且最终有胜者时，胜者获得败者本手打出的手势牌一张；双方原牌仍先消耗。', question: '对方的选择能成为你的资源吗？', category: 'cards', prerequisites: ['cards.finite'] },
  { id: 'cards.combo_refund', title: '换招连胜', description: '连续两手获胜且使用不同手势，退回本手自己打出的牌；气动作胜利不构成换招连胜。', question: '延续优势是否还需要变化？', category: 'cards', prerequisites: ['cards.finite'] },
  { id: 'shield.guard_store', title: '挡波成盾', description: '防御挡住普通波后，结算本手伤害再获得一层盾；其他防御平局与破防波不触发。', question: '防守怎样为之后创造机会？', category: 'life', prerequisites: ['energy.guard'] },
  { id: 'energy.overflow_shield', title: '溢气化盾', description: '本手任意回气超过容量时，结算伤害与资源后获得一层盾；盾最多一层。', question: '存不下的资源能转化成什么？', category: 'energy', prerequisites: [] },
  { id: 'energy.restraint', title: '节制蓄力', description: '最终获胜时若使用未强化手势，结算后获得至多一气；押注不算强化。', question: '保留力量也应有回报吗？', category: 'energy', prerequisites: [] },
  { id: 'action.special_cooldown', title: '气招不能连用', description: '上一有效手的气动作，下一有效手不能重复；换成任何其他动作后恢复。', question: '强动作需要怎样的节奏？', category: 'energy', prerequisites: [] },
  { id: 'shield.piercing_boost', title: '强化破盾', description: '强化手势最终获胜时先击碎对方现有护盾，伤害不被盾减免；不增加伤害。', question: '明确的保护需要怎样的破解办法？', category: 'life', prerequisites: ['energy.gesture_boost'] },
];
export const ABILITIES: AbilityDefinition[] = [
  ...EXPERIMENT_ABILITIES,
  { id: 'ability.claim_draw', activation: 'active', title: '抢平', description: '你的专属能力，每局一次，随手势提前发动。手势的原始平局变为你胜。', question: '何时花掉一次把平局变胜利的机会？' },
  { id: 'ability.insurance', activation: 'active', title: '保底', description: '每局一次，随手势提前发动。原始手势失败变平；不能挡波，不再触发对方抢平。', question: '领先时的一次保险，和落后时一样值钱吗？' },
  { id: 'ability.retry', activation: 'active', title: '再搏', description: '每局一次，随手势提前发动。原始手势失败则作废重打；只扣你声明的能力次数，其余费用与有效手数不提交。', question: '保住平局，还是给自己重新争胜的机会？' },
  { id: 'ability.aegis', activation: 'active', title: '护身', description: '每局一次，随手势提前发动；本手伤害前获得一层盾，减免一伤后消耗，最多一层。', question: '把一次保护用在什么时候？' },
  { id: 'ability.foresight', activation: 'active', title: '先见', description: '每局一次，随手势提前发动；下一有效手电脑锁定后公开动作种类，不公开强化或押注；作废重打保留该手的先见。', question: '提前知道一种回应会怎样影响选择？' },
  { id: 'ability.siphon', activation: 'active', title: '夺气', description: '每局一次，随手势提前发动；普通回气后、漏气前，将对方至多二气转入自己的剩余容量。', question: '拿走对方资源和自己产气有什么不同？' },
  { id: 'ability.reforge', activation: 'active', title: '重铸', description: '每局一次，随手势提前发动；本手结算后把自己已耗尽的每种现有手势各补到一张，其余库存不变。', question: '什么时候重开选择最值得？' },
  { id: 'ability.last_stand', activation: 'active', title: '续命', description: '每局一次，随手势提前发动；本手护盾结算后若仍会受到致命伤害，改为保留一生命，不改变交锋结果。', question: '最后的一次机会能创造什么？' },
  { id: 'ability.scissors_ninja', activation: 'passive', title: '剪刀忍者', description: '常驻：剪刀最终获胜的基础伤害为二，再加手势强化；与背水一战取更高基础值，不叠加。', question: '偏爱一招的优势，会怎样改变你的出手？' },
  { id: 'ability.rock_guardian', activation: 'passive', title: '岩拳卫士', description: '常驻：石头最终获胜后，在本手伤害结算后获得一层盾，最多一层，保护之后的交锋。', question: '赢下一手如何为下一手留下保护？' },
  { id: 'ability.paper_trickster', activation: 'passive', title: '纸影术士', description: '常驻：布与布最终打平时，对手额外受一伤，交锋仍为平局；与平局伤害合并后统一减盾。', question: '平局也能形成自己的优势吗？' },
];
export function isPassiveAbility(ability: AbilityId | null): boolean { return ABILITIES.some(item => item.id === ability && item.activation === 'passive'); }
export const GESTURE_LABELS = { rock: '石头', scissors: '剪刀', paper: '布', lizard: '蜥蜴', spock: '瓦肯手' } as const;
export const ACTION_LABELS = { ...GESTURE_LABELS, charge: '蓄气', wave: '波', guard: '防御', piercing_wave: '破防波' } as const;
export const GOAL_LABELS: Record<Goal, string> = {
  single: '一手定胜负', first_two: '先赢两手', score: '到期比积分', knockout: '击倒或到期比生命',
  collect_three: '石剪布各赢一次', draw_three: '玩家累计三次平局', streak_two: '玩家连续两胜',
  first_five_points: '先得五分', fewest_points: '到期少得分者胜', efficient_wins: '到期两胜且支出不超三气', survive: '玩家活到上限',
};
export const isScoreGoal = (goal: Goal): boolean => ['score', 'first_five_points', 'fewest_points'].includes(goal);
export const isLifeGoal = (goal: Goal): boolean => goal === 'knockout' || goal === 'survive';
export const isChallengeGoal = (goal: Goal): boolean => ['draw_three', 'streak_two', 'efficient_wins', 'survive'].includes(goal);
const supportsOvertime = (goal: Goal) => goal === 'first_two' || isScoreGoal(goal);
const ALL_IDS = RULES.map(rule => rule.id);
const GOAL_IDS: Partial<Record<RuleId, Goal>> = {
  'match.first_two': 'first_two', 'match.score_five': 'score', 'life.knockout': 'knockout',
  'goal.collect_three': 'collect_three', 'goal.draw_three': 'draw_three', 'goal.streak_two': 'streak_two',
  'goal.first_five_points': 'first_five_points', 'goal.fewest_points': 'fewest_points', 'goal.efficient_wins': 'efficient_wins', 'life.survive': 'survive',
};
const SCORE_RULES: RuleId[] = ['score.draw_point', 'score.combo', 'score.last_double'];
const LIFE_RULES: RuleId[] = ['life.draw_damage', 'life.win_heal', 'life.last_hit_double', 'life.desperation', 'energy.gesture_boost', 'energy.double_boost', 'combo.three_styles', 'shield.guard_store', 'energy.overflow_shield', 'shield.piercing_boost'];
// Only historical duration/score goals require a series. Experimental mechanics
// may be installed without the resource or time horizon that makes them useful.
const SERIES_RULES = ALL_IDS.filter(id => id.startsWith('tempo.') || id.startsWith('score.') || id.startsWith('goal.') || id.startsWith('ending.') || ['life.survive', 'life.last_hit_double'].includes(id));
/** Retained in the resolver only to validate historical experiments; unavailable in the current health route. */
const RETIRED_HEALTH_RULES = ALL_IDS.filter(id => id === 'gesture.remove_rock' || id === 'life.last_hit_double' || id.startsWith('tempo.') || id.startsWith('score.') || id.startsWith('ending.') || !!GOAL_IDS[id] && id !== 'life.knockout');
const isEnergy = (design: Design) => design.rules.some(id => id.startsWith('energy.'));
const hasShieldSource = (design: Design) => design.rules.some(id => ['combo.three_styles', 'shield.guard_store', 'energy.overflow_shield'].includes(id)) || Object.values(design.abilities).some(ability => ability === 'ability.aegis' || ability === 'ability.rock_guardian');
export function createDesign(): Design { return { schemaVersion: 1, contentVersion: '0.6-demo-1', revision: 0, rules: [], goal: 'single', cap: 1, abilities: { player: null, computer: null } }; }
export function mechanicalHash(design: Design): string {
  const value = JSON.stringify({ rules: [...design.rules].sort(), goal: design.goal, cap: design.cap, healthOnly: design.healthOnly || undefined, abilities: { player: design.abilities.player, computer: design.abilities.computer }, version: design.contentVersion });
  let hash = 2166136261;
  for (let i = 0; i < value.length; i++) hash = Math.imul(hash ^ value.charCodeAt(i), 16777619);
  return `m-${(hash >>> 0).toString(16).padStart(8, '0')}`;
}
export function compileDesign(design: Design): CompiledDesign {
  if (design.schemaVersion !== 1 || design.contentVersion !== '0.6-demo-1') throw new RuleError('作品规则版本不受支持。');
  if (!Number.isInteger(design.revision) || design.revision < 0) throw new RuleError('作品版本号无效。');
  if (design.rules.some(id => !ALL_IDS.includes(id)) || new Set(design.rules).size !== design.rules.length) throw new RuleError('存在未知或重复的规则。');
  if (!(design.goal in GOAL_LABELS)) throw new RuleError('未知的主目标。');
  if (design.healthOnly !== undefined && typeof design.healthOnly !== 'boolean') throw new RuleError('生命对战模式无效。');
  if (design.healthOnly && (design.goal !== 'knockout' || design.rules.some(id => RETIRED_HEALTH_RULES.includes(id)))) throw new RuleError('生命对战只以生命归零或无可用行动结束，不再加入手数、积分、其他目标或减少手势。');
  const has = (id: RuleId) => design.rules.includes(id);
  const goalRules = design.rules.filter(id => GOAL_IDS[id]);
  if ((design.goal === 'single' && goalRules.length > 0) || (design.goal !== 'single' && (goalRules.length !== 1 || GOAL_IDS[goalRules[0]!] !== design.goal))) throw new RuleError('作品必须恰好有一个有效主目标。');
  if ((design.goal === 'single' && design.cap !== 1) || (design.goal !== 'single' && ![3, 5, 9, 13].includes(design.cap))) throw new RuleError('赛程上限与目标不兼容。');
  if (has('tempo.extend_cap') !== (design.cap >= 9)) throw new RuleError('延长规则与实际手数上限不一致。');
  if (has('tempo.short_cap') && design.cap !== 3) throw new RuleError('短赛程必须恰好为三手。');
  if (design.goal === 'single' && SERIES_RULES.some(has)) throw new RuleError('此规则或能力需要先建立多手赛程。');
  const score = isScoreGoal(design.goal), life = isLifeGoal(design.goal), energy = isEnergy(design);
  if (SCORE_RULES.some(has) && !score) throw new RuleError('积分修饰需要当前目标实际读取积分。');
  if (has('ending.bounded_overtime') && !supportsOvertime(design.goal)) throw new RuleError('加时仅支持比较胜场或积分的目标。');
  for (const side of ['player', 'computer'] as const) if (design.abilities[side] !== null && !ABILITIES.some(a => a.id === design.abilities[side])) throw new RuleError('未知能力。');
  if (design.abilities.computer && !['ability.claim_draw', 'ability.insurance', 'ability.retry'].includes(design.abilities.computer)) throw new RuleError('新增能力仅属于玩家，电脑不能装备。');
  if (has('gesture.five') && has('gesture.remove_rock')) throw new RuleError('五手势需要恢复石头。');
  const gestures = has('gesture.five') ? ['rock', 'scissors', 'paper', 'lizard', 'spock'] as const : has('gesture.remove_rock') ? ['scissors', 'paper'] as const : ['rock', 'scissors', 'paper'] as const;
  if (gestures.length < 3 && (has('action.cooldown') || has('gesture.public_trump') || has('gesture.reverse'))) throw new RuleError('冷却、王牌与反转需要至少三种手势。');
  if (design.goal === 'collect_three' && (design.cap < 9 || has('gesture.remove_rock'))) throw new RuleError('三招收集需要至少九手，并保留石头、剪刀、布。');
  if (['draw_three', 'streak_two', 'efficient_wins', 'survive', 'first_five_points'].includes(design.goal) && design.cap < 5) throw new RuleError('当前目标需要至少五手的赛程。');
  if (design.goal === 'efficient_wins' && !energy) throw new RuleError('三气预算需要目标替换后仍有实际气消费出口。');
  if (EXPERIMENT_ABILITIES.some(a=>a.id===design.abilities.computer)) throw new RuleError('新角色只能由玩家装备。');
  const compiled: CompiledDesign = {
    design: structuredClone(design), hash: mechanicalHash(design), goal: design.goal, healthOnly: !!design.healthOnly, cap: design.cap,
    gestures: [...gestures], actions: [...gestures], reverse: has('gesture.reverse'), cooldown: has('action.cooldown'),
    score, challenge: isChallengeGoal(design.goal), boundedOvertime: has('ending.bounded_overtime'), publicTrump: has('gesture.public_trump'),
    life, drawDamage: has('life.draw_damage'), winHeal: has('life.win_heal'), lastHitDouble: has('life.last_hit_double'), desperation: has('life.desperation'),
    energy, initialEnergy: energy ? has('energy.opening_two') ? 2 : 1 : 0, energyCap: energy ? has('energy.cap_five') ? 5 : 3 : 0,
    maxBoost: has('energy.gesture_boost') ? has('energy.double_boost') ? 2 : 1 : 0,
    waveCost: has('energy.cheap_wave') ? 1 : 2, guardCost: has('energy.guard_paid') ? 1 : 0,
    leakThirds: has('energy.leak_thirds'), lossCharge: has('energy.loss_charge'),
    drawPoint: has('score.draw_point'), combo: has('score.combo'), lastDouble: has('score.last_double'),
    finiteCards: cardMode({design}), cardsPerGesture: has('cards.two_each') ? 2 : 3, exchange: cardMode({design}) && has('cards.exchange_once'),
    drawRefund: cardMode({design}) && has('cards.draw_refund'), dealerRefill: cardMode({design}) && has('cards.dealer_refill'), abilities: { ...design.abilities },
    chargeTrade: cardMode({design}) && has('cards.charge_trade'), wager: has('energy.wager'), threeStyles: has('combo.three_styles'), capture: cardMode({design}) && has('cards.capture'), comboRefund: cardMode({design}) && has('cards.combo_refund'),
    guardStore: has('shield.guard_store'), overflowShield: has('energy.overflow_shield'), restraint: has('energy.restraint'), specialCooldown: has('action.special_cooldown'), piercingBoost: has('shield.piercing_boost'), shield: hasShieldSource(design),
    ui: { rules: design.rules.length > 0 || !!design.abilities.player || !!design.abilities.computer, series: design.cap > 1, score, life, energy, cards: cardMode({design}), exchange: cardMode({design}) && has('cards.exchange_once'), abilities: !!design.abilities.player || !!design.abilities.computer, fiveGestures: has('gesture.five') },
  };
  if (has('energy.active_charge')) compiled.actions.push('charge');
  if (has('energy.wave')) compiled.actions.push('wave');
  if (has('energy.guard')) compiled.actions.push('guard');
  if (has('energy.piercing_wave')) compiled.actions.push('piercing_wave');
  return compiled;
}
function prune(design: Design): void {
  const remove = (ids: RuleId[]) => { design.rules = design.rules.filter(id => !ids.includes(id)); };
  if (design.goal === 'single') { remove(SERIES_RULES); design.cap = 1; delete design.healthOnly; }
  if (!isScoreGoal(design.goal)) remove(SCORE_RULES);
  if (!supportsOvertime(design.goal)) remove(['ending.bounded_overtime']);
  // Missing support makes an experimental modifier dormant, not uninstalled.
}
function requireInstall(original: CompiledDesign, rule: RuleId): void {
  const require = (condition: boolean, text: string) => { if (!condition) throw new RuleError(text); };
  if (original.healthOnly) require(!RETIRED_HEALTH_RULES.includes(rule), '生命对战不再加入手数、积分、其他目标或减少手势。');
  if (SERIES_RULES.includes(rule) && rule !== 'life.knockout') require(original.cap > 1, '先加入生命对战。');
  if (SCORE_RULES.includes(rule) || rule === 'goal.first_five_points' || rule === 'goal.fewest_points') require(original.score, '先建立当前目标读取的积分系统。');
  if (rule === 'ending.bounded_overtime') require(supportsOvertime(original.goal), '加时仅支持比较胜场或积分的目标。');
  if (rule === 'gesture.reverse' || rule === 'action.cooldown' || rule === 'gesture.public_trump') require(original.gestures.length >= 3, '这项规则需要至少三种手势。');
}
export function previewRuleChange(design: Design, change: RuleChange): ChangePreview {
  const original = compileDesign(design), next = structuredClone(design), notes: string[] = [], errors: string[] = [];
  try {
    if (change.type === 'ability') {
      next.abilities[change.side] = change.ability;
    } else if (change.type === 'install') {
      const rule = change.rule;
      if (!ALL_IDS.includes(rule)) throw new RuleError('未知规则。');
      if (next.rules.includes(rule) && rule !== 'tempo.extend_cap') throw new RuleError('这条规则已安装。');
      if (change.capTarget !== undefined && rule !== 'tempo.extend_cap') throw new RuleError('只有延长赛程可以指定目标手数。');
      requireInstall(original, rule);
      if (GOAL_IDS[rule]) {
        next.rules = next.rules.filter(id => !GOAL_IDS[id]);next.goal = GOAL_IDS[rule]!;
        if (rule === 'life.knockout' && original.goal === 'single') {
          // Five is retained solely for compatibility with the historical Design schema.
          // healthOnly removes it from terminal checks and AI time-horizon estimates.
          next.cap = 5;next.healthOnly = true;
          notes.push('双方从三生命开始，生命归零结束；没有固定手数上限。');
        } else if (rule === 'match.first_two' || rule === 'match.score_five') {
          next.cap = 5;next.rules = next.rules.filter(id => id !== 'tempo.extend_cap' && id !== 'tempo.short_cap');
        } else notes.push(`主目标替换为${GOAL_LABELS[next.goal]}；保留基础上限 ${next.cap} 手，不再读取旧目标。`);
      }
      if (rule === 'tempo.extend_cap') {
        if (next.cap >= 13) throw new RuleError('已经达到十三手上限。');
        const target = change.capTarget ?? (next.cap >= 9 ? 13 : 9);
        if (![3,5,9].includes(next.cap) || ![9,13].includes(target) || target <= next.cap) throw new RuleError('延长赛程只能从三、五或九手改为更长的九或十三手。');
        notes.push(`基础上限从 ${next.cap} 手改为 ${target} 手；原有短赛程同时退出。`);
        next.cap = target;next.rules = next.rules.filter(id => id !== 'tempo.short_cap');
        if (next.goal !== 'score' && next.goal !== 'fewest_points') notes.push('提前结束条件保留，可能用不到新增的手数。');
      }
      if (rule === 'tempo.short_cap') {
        next.cap = 3;next.rules = next.rules.filter(id => id !== 'tempo.extend_cap');
        notes.push('赛程缩为三手；只保留仍适用的目标与规则。');
      }
      if (rule === 'gesture.remove_rock') {
        if (original.goal === 'collect_three') throw new RuleError('三招收集必须保留石头，请先替换主目标。');
        next.rules = next.rules.filter(id => !['gesture.five','gesture.public_trump','action.cooldown','gesture.reverse'].includes(id));
        notes.push('石头退出可用手势与库存；若原有五手势，同时退出蜥蜴与瓦肯手，只保留剪刀与布。两手势存在明显优势招。');
      }
      if (rule === 'gesture.five' && next.rules.includes('gesture.remove_rock')) {
        next.rules=next.rules.filter(id=>id!=='gesture.remove_rock');notes.push('先恢复石头，再加入蜥蜴与瓦肯手；重新按五手势发放库存。');
      }
      if (!next.rules.includes(rule)) next.rules.push(rule);
    } else {
      if (!next.rules.includes(change.rule)) throw new RuleError('这条规则尚未安装。');
      next.rules = next.rules.filter(id => id !== change.rule);
      if (GOAL_IDS[change.rule]) { next.goal = 'single';next.cap = 1; }
      if (change.rule === 'tempo.extend_cap' || change.rule === 'tempo.short_cap') next.cap = 5;
    }
    prune(next);next.revision++;
    const compiled = compileDesign(next);
    if (change.type === 'install' && !next.rules.includes(change.rule)) throw new RuleError('这项规则在当前目标下没有作用，未安装。');
    if (compiled.finiteCards && !original.finiteCards) notes.push(design.rules.includes('experiment.deck')?`双方以 ${compiled.gestures.length*compiled.cardsPerGesture} 张牌建库，开局抽五张；每手只出一张。`:`新实验双方每种手势各 ${compiled.cardsPerGesture} 张；无合法动作时按当前目标结算。`);
    if (compiled.gestures.length > original.gestures.length && compiled.finiteCards) notes.push(`新增手势各发 ${compiled.cardsPerGesture} 张，总库存为 ${compiled.gestures.length * compiled.cardsPerGesture} 张。`);
    notes.push(...experimentNotes(next));
    if (compiled.challenge) notes.push('这是玩家专属挑战；电脑阻止你达标，不拥有对称挑战。电脑无动作时也按实际挑战条件检查。');
    if (compiled.boundedOvertime) notes.push(`仅到第 ${compiled.cap} 手仍同分才最多加三手；末手奖励只作用于第 ${compiled.cap} 手。`);
  } catch (error) { errors.push(error instanceof Error ? error.message : '改动无效。'); }
  const before = [...design.rules, ...(['player','computer'] as const).flatMap(side=>design.abilities[side]?[`${side}:${design.abilities[side]}`]:[])];
  const after = [...next.rules, ...(['player','computer'] as const).flatMap(side=>next.abilities[side]?[`${side}:${next.abilities[side]}`]:[])];
  return { valid: errors.length === 0, baseRevision: design.revision, nextDesign: next, added: after.filter(id=>!before.includes(id)), removed: before.filter(id=>!after.includes(id)), retained: before.filter(id=>after.includes(id)), goal: next.goal, cap: next.cap, abilities: {...next.abilities}, ui: errors.length?original.ui:compileDesign(next).ui, notes, errors };
}
export function commitRuleChange(design: Design, preview: ChangePreview): Design {
  if (preview.baseRevision !== design.revision) throw new RuleError('预览已过期，请重新查看本次改动。');
  if (!preview.valid) throw new RuleError(preview.errors.join(' '));
  compileDesign(preview.nextDesign);return structuredClone(preview.nextDesign);
}
export const installRule = (design: Design, rule: RuleId): Design => commitRuleChange(design, previewRuleChange(design,{type:'install',rule}));
export const removeRule = (design: Design, rule: RuleId): Design => commitRuleChange(design, previewRuleChange(design,{type:'remove',rule}));
export const setAbility = (design: Design, side: Side, ability: AbilityId | null): Design => commitRuleChange(design, previewRuleChange(design,{type:'ability',side,ability}));
/** App policy remains player-only; bilateral fixtures may still exercise the common resolver. */
export function normalizePlayerOnlyDesign(design: Design): Design {
  compileDesign(design);return design.abilities.computer === null ? design : setAbility(design,'computer',null);
}

/** Describe observable consequences; these are never installation blockers. */
export function experimentNotes(design: Design): string[] {
  const notes: string[] = [];
  const life = isLifeGoal(design.goal), energy = isEnergy(design);
  if (design.goal === 'single' && (energy || cardMode({design}) || design.abilities.player)) notes.push('仍然一手定胜负；这手结算后就结束。再来一次会重置气、手牌和能力次数。');
  if (!life && (LIFE_RULES.some(id => design.rules.includes(id)) || ['ability.aegis', 'ability.last_stand', 'ability.scissors_ninja', 'ability.rock_guardian', 'ability.paper_trickster'].includes(design.abilities.player ?? ''))) notes.push(`当前没有生命：伤害与护盾不会改变这一手的胜负。${design.rules.includes('energy.gesture_boost') ? '强化仍会花气。' : ''}`);
  const missing = RULES.filter(rule => design.rules.includes(rule.id) && rule.prerequisites.some(id => !design.rules.includes(id) && !(id==='cards.finite' && cardMode({design}))));
  if (missing.length) notes.push(`暂缺配套规则：${missing.map(rule => rule.title).join('、')}。规则仍保留，相关效果可能不会发生。`);
  return notes;
}
