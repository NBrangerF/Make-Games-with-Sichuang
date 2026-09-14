import { VISIBLE_EXPERIMENT_RULES, VISIBLE_EXPERIMENT_ABILITIES } from '../experiments/catalog';
import type { AbilityId, RuleId } from '../core/types';
import type { ExperienceFact, Expression, UIUnlock } from '../journey/types';

export type ExpressionChoiceId = 'U01' | 'U02' | 'U06' | 'U08' | 'U10' | 'U11' | 'U18';
export type ChoiceId = RuleId | AbilityId | ExpressionChoiceId;
export interface ChoiceCard {
  id: ChoiceId;
  kind: 'rule' | 'ability' | 'expression';
  title: string;
  description: string;
  question: string;
  experience: ExperienceFact[];
  prerequisiteText: string;
  expressionKey?: keyof Expression;
  /** Separate cards may represent successive stages of the same engine rule. */
  ruleId?: RuleId;
  /** This interface is earned only when the card is successfully committed. */
  unlockUI?: UIUnlock;
  /** Only these fully represented choices enter the recommendation pool. */
  presentationReady: boolean;
}

export const RULE_CARDS: ChoiceCard[] = [
  ...VISIBLE_EXPERIMENT_RULES.map(rule=>({id:rule.id,kind:'rule' as const,title:rule.title,description:rule.description,question:rule.question,experience:['multipleReveals' as const],prerequisiteText:'揭晓过两次后随机遇见；自由组合可在首手后直接加入。',presentationReady:true})),
  { id: 'gesture.five', kind: 'rule', title: '加入五手势', description: '加入蜥蜴和瓦肯手。每种手势胜两种、负两种，出手处标明它能赢谁。', question: '选择更多，会让对手更难猜吗？', experience: ['handPlayed'], prerequisiteText: '完成一手后可选；可与生命和气动作共存。', presentationReady: true },
  { id: 'action.cooldown', kind: 'rule', title: '不能连出', description: '刚用过的手势下一有效手不能再用。蓄气、波、防御不受手势冷却限制。', question: '不能重复时，你暴露了哪些选择？', experience: ['repeatedGesture'], prerequisiteText: '已有生命，并真实连续出过同一手势。', presentationReady: true },
  { id: 'life.knockout', kind: 'rule', title: '三点生命', description: '双方各 3 生命，输一手受到 1 伤害。以击倒对手为目标，不设固定手数。', question: '一手的胜负变成了可累积的伤害。', experience: ['handPlayed'], prerequisiteText: '完成一手即可；开启唯一的多手模式，生命归零结束。', presentationReady: true },
  { id: 'cards.finite', kind: 'rule', title: '有限手牌', description: '每种手势各 3 张，出手消耗 1 张。牌用尽不能再出，无合法动作时明确结算。', question: '现在打出的牌，还值得留到后面吗？', experience: ['repeatedGesture', 'longSeries'], prerequisiteText: '当前已有生命；真实打过至少四手并重复过手势。', presentationReady: true },
  { id: 'cards.two_each', kind: 'rule', title: '缩小初始手牌', description: '将每种手势的初始库存从 3 张改为 2 张。双方按新库存开始实验。', question: '少一张牌，会让你更早珍惜哪一拳？', experience: ['inventoryDepleted'], prerequisiteText: '已有有限手牌，并见过一种牌实际耗尽。', presentationReady: true },
  { id: 'cards.exchange_once', kind: 'rule', title: '两张换一张', description: '每方每场准备时可交换一次：交出两张相同手势，换回另一种合法手势一张。', question: '少一张总库存，能换来有用的余地吗？', experience: ['inventoryDepleted'], prerequisiteText: '已有有限手牌，实际见过缺牌；交换在电脑承诺前完成。', presentationReady: true },
  { id: 'energy.gesture_boost', kind: 'rule', title: '让手势带上气', description: '双方初始 1 气、上限 3 气。花 1 气强化手势，获胜多造成 1 伤害；手势最终平局各回 1 气。', question: '花掉气之前，先想想这一拳能不能赢。', experience: ['damageDealt'], prerequisiteText: '生命路线，已用普通手势造成伤害；不会附送新动作。', presentationReady: true },
  { id: 'energy.active_charge', kind: 'rule', title: '主动蓄气', description: '从波波攒开始：双方初始 1 气，上限 3 气。新增攒气动作，获得 1 气；输给手势和波。仍可一手定胜负。', question: '什么时候值得花一手，为下一手准备？', experience: ['handPlayed'], prerequisiteText: '首手结束即可，不需要生命或强化；波和防御可以随后加入。', presentationReady: true },
  { id: 'energy.wave', kind: 'rule', title: '加入波', description: '花 2 气发波，胜过普通手势和蓄气；生命局获胜造成 1 伤害。', question: '公开的气，会让你的威胁提前被看见吗？', experience: ['chargeUsed'], prerequisiteText: '随机推荐在实际攒气后出现；自由组合可直接加入，不改变一手制。', presentationReady: true },
  { id: 'energy.guard', kind: 'rule', title: '加入防御', description: '免费防御可挡波，双方平局；但会输给普通手势，挡波不会获得手势平局气。', question: '能挡住大招，为什么仍然不能一直防御？', experience: ['waveObserved'], prerequisiteText: '已有波，并见过一次真实波攻击。', presentationReady: true },
  {"id": "life.draw_damage", "kind": "rule", "title": "平局也受伤", "description": "最终平局时双方各受一伤，防御挡波的平局也算。双方同时归零则平局。", "question": "原本安全的结果开始有代价，你会怎样选？", "experience": ["lifeDrawObserved"], "prerequisiteText": "已有生命；经历过一次生命未受伤的平局。", "presentationReady": true},
  {"id": "life.win_heal", "kind": "rule", "title": "胜利回复生命", "description": "交锋胜者回复一点生命，最高三点。先结算败者伤害，再恢复；初始生命保持。", "question": "胜利既能进攻又能恢复，会奖励什么打法？", "experience": ["woundedWin"], "prerequisiteText": "已有生命；带着未满生命实际赢过一手。", "presentationReady": true},
  {"id": "life.desperation", "kind": "rule", "title": "背水一战", "description": "本手开始时只有一点生命的一方，若赢下交锋，基础伤害由一变二；胜后回血不会取消。", "question": "危险时更强，会鼓励翻盘还是主动受伤？", "experience": ["lowLifeObserved"], "prerequisiteText": "已有生命；真实到过一点生命。", "presentationReady": true},
  {"id": "cards.draw_refund", "kind": "rule", "title": "平局退牌", "description": "最终平局后，双方本手实际消耗的手势牌各退回一张。气动作没有牌可退。", "question": "降低平局成本，你会更愿意追求它吗？", "experience": ["cardDrawSpent"], "prerequisiteText": "已有有限手牌；平局实际消耗过手牌。", "presentationReady": true},
  {"id": "energy.guard_paid", "kind": "rule", "title": "防御也要一气", "description": "防御从免费变成花一气；不足气不能出，被普通手势打中也照付费用。", "question": "一次保护，值得放弃多少进攻资源？", "experience": ["guardObserved"], "prerequisiteText": "已有波、防御、气恢复路径；见过防御挡波。", "presentationReady": true},
  {"id": "energy.piercing_wave", "kind": "rule", "title": "加入破防波", "description": "新动作花三气，胜手势、蓄气和防御；与普通波、破防波打平。原来的波仍保留，伤害仍为一。", "question": "多覆盖一种回应，值得再花一气吗？", "experience": ["guardObserved"], "prerequisiteText": "已有波和防御、容量至少三；体验过波被挡住。", "presentationReady": true},
  {"id": "energy.cheap_wave", "kind": "rule", "title": "一气就能发波", "description": "普通波费用从两气降为一气，胜负关系和伤害保持；破防波仍花三气。", "question": "价格变低，其他动作还有什么价值？", "experience": ["paidWaveObserved"], "prerequisiteText": "已有普通波；真实支付过两气发波。", "presentationReady": true},
  {"id": "energy.opening_two", "kind": "rule", "title": "带着两气入场", "description": "下一场双方初始气从一变二，上限和费用保持；只改变开场的准备。", "question": "第一手就有更多资源，会怎样影响判断？", "experience": ["twoEnergyObserved"], "prerequisiteText": "已有气系统；真实存到过两气。", "presentationReady": true},
  {"id": "energy.leak_thirds", "kind": "rule", "title": "气会漏掉", "description": "每第三个有效手结束时，双方各失去一气，最低零。先支付和恢复再漏气，作废不计手数。", "question": "资源会过期，什么时候才值得存起来？", "experience": ["energyCarried"], "prerequisiteText": "当前已有生命与气；把气带入过下一有效手。", "presentationReady": true},
  {"id": "energy.loss_charge", "kind": "rule", "title": "败者蓄力", "description": "最终交锋败者额外获得一气，受上限限制。平局没有奖励，主动蓄气可叠加。", "question": "失败也有收获，会怎样改变你冒险的意愿？", "experience": ["lowEnergyLoss"], "prerequisiteText": "已有气系统；气不足时真实输过一手。", "presentationReady": true},
  {"id": "energy.cap_five", "kind": "rule", "title": "更大的气槽", "description": "气容量从三扩大到五，不赠送新增的两气，初始量与费用保持。", "question": "可以存更多，就一定能创造更多策略吗？", "experience": ["energyCapReached"], "prerequisiteText": "已有气系统；真的到过三气上限。", "presentationReady": true},
  {"id": "energy.double_boost", "kind": "rule", "title": "更重的手势强化", "description": "现在可选不强化、花一气加一伤，或花两气加两伤。只在手势获胜时加伤，失败和平局也付费。", "question": "可以押得更重，什么时候该收手？", "experience": ["boostWon", "boostLost"], "prerequisiteText": "已有生命与手势强化；亲自体验过强化成功和失败。", "presentationReady": true},
  { id: 'cards.charge_trade', kind: 'rule', title: '以牌换气', description: '蓄气时从库存最多的手势弃 1 张牌，改为回复 2 气；无牌可弃时不能蓄气。', question: '把未来的一拳换成眼前的气，值得吗？', experience: ['chargeUsed', 'cpuInventorySpent'], prerequisiteText: '已有有限手牌和主动蓄气；实际蓄过气，也见过电脑消耗手牌。', presentationReady: true },
  { id: 'energy.wager', kind: 'rule', title: '押一气', description: '手势可另外押 1 气。按最终胜负结算：胜返 2 气，平返 1 气，负不返；可与强化叠加。', question: '你有多相信这一拳会赢？', experience: ['energySpent'], prerequisiteText: '已有生命和气；实际支付过气，出手时需付得起押注与强化的总费用。', presentationReady: true },
  { id: 'combo.three_styles', kind: 'rule', title: '三招成势', description: '连续三个互不相同的手势获得 1 盾。重复手势从本手重新计，气动作会打断；盾最多 1 层，下次受伤减 1 后消耗。', question: '奖励换招，会让你的下一拳更好猜吗？', experience: ['repeatedGesture'], prerequisiteText: '已有生命，并真实连续出过相同手势。', presentationReady: true },
  { id: 'cards.capture', kind: 'rule', title: '胜者缴获', description: '双方都出手势时，最终胜者获得败者本手手势的 1 张牌。气动作交锋不缴获。', question: '对手会出的牌，能成为你的补给吗？', experience: ['cpuInventorySpent', 'playerWin'], prerequisiteText: '已有有限手牌；见过电脑耗牌，也亲自赢过一手。', presentationReady: true },
  { id: 'cards.combo_refund', kind: 'rule', title: '换招连胜', description: '连续获胜且本手换了手势，退回自己本手消耗的 1 张牌；平局、失败或气动作会打断。', question: '连续换招进攻，能让有限手牌用得更久吗？', experience: ['consecutiveWins', 'cpuInventorySpent'], prerequisiteText: '已有有限手牌；实际见过连胜与电脑消耗手牌。', presentationReady: true },
  { id: 'shield.guard_store', kind: 'rule', title: '挡波成盾', description: '防御挡住普通波后获得 1 盾，从下一手起可用。盾最多 1 层，下次受伤减 1 后消耗；破防波不会赠盾。', question: '一次成功防御，能为后续进攻留下什么？', experience: ['guardObserved'], prerequisiteText: '已有生命、普通波和防御；实际见过防御挡波。', presentationReady: true },
  { id: 'energy.overflow_shield', kind: 'rule', title: '溢气化盾', description: '本手有回复的气超过容量时，在伤害结算后获得 1 盾。盾最多 1 层，下次受伤减 1 后消耗。', question: '已经装满的气槽，还能怎样产生价值？', experience: ['energyCapReached'], prerequisiteText: '已有生命和气；实际达到过三气。', presentationReady: true },
  { id: 'energy.restraint', kind: 'rule', title: '节制蓄力', description: '不强化的手势最终获胜时回复 1 气，受容量限制。押注不算强化，气动作不触发。', question: '这一拳省下力量，会让下一拳更有威胁吗？', experience: ['boostLost'], prerequisiteText: '已有生命和气；实际经历过强化手势失败。', presentationReady: true },
  { id: 'action.special_cooldown', kind: 'rule', title: '气招不能连用', description: '同一种气动作不能连续两有效手使用；换气招或出手势后可再用，作废尝试不推进冷却。', question: '不能连续依赖同一招，会怎样改变你的节奏？', experience: ['waveObserved', 'chargeUsed'], prerequisiteText: '当前至少有两种气动作；实际蓄过气，也见过波。', presentationReady: true },
  { id: 'shield.piercing_boost', kind: 'rule', title: '强化破盾', description: '强化手势获胜时，本次伤害击破并消耗对手的盾，不减伤；不强化的手势、波与平局伤害仍受盾影响。', question: '对方有盾时，你愿意多花多少力量？', experience: ['shieldBlocked', 'boostWon'], prerequisiteText: '已有手势强化与可产生盾的规则、护身或岩拳卫士能力；实际见过盾抵伤，也用强化赢过。', presentationReady: true },
];

export const ABILITY_CARDS: ChoiceCard[] = [
  ...VISIBLE_EXPERIMENT_ABILITIES.map(ability=>({id:ability.id,kind:'ability' as const,title:ability.title,description:ability.description,question:ability.question,experience:['multipleReveals' as const],prerequisiteText:'揭晓过两次后随机遇见；自由组合可直接选入，替换你的角色。',presentationReady:true})),
  { id: 'ability.scissors_ninja', kind: 'ability', title: '剪刀忍者', description: '常驻能力。剪刀获胜时造成 2 点基础伤害，再加手势强化；与背水一战取较高基础值，不重复增加。', question: '剪刀更有威胁后，对手会不会开始等你的剪刀？', experience: ['seriesCompleted'], prerequisiteText: '完成首场生命实验；替换当前玩家角色，装备后自动生效，对手没有此能力。', presentationReady: true },
  { id: 'ability.rock_guardian', kind: 'ability', title: '岩拳卫士', description: '常驻能力。石头获胜后获得 1 盾，从下一手起抵挡 1 伤害；盾最多 1 层。', question: '用进攻换来保护，下一拳还要坚持石头吗？', experience: ['seriesCompleted'], prerequisiteText: '完成首场生命实验；替换当前玩家角色，装备后自动生效。', presentationReady: true },
  { id: 'ability.paper_trickster', kind: 'ability', title: '纸影术士', description: '常驻能力。布与布打平时，对手受到 1 伤害；交锋仍为平局。可与平局伤害叠加，护盾照常减伤。', question: '猜到相同的手势，也能成为进攻的机会吗？', experience: ['seriesCompleted'], prerequisiteText: '完成首场生命实验；替换当前玩家角色，装备后自动生效。', presentationReady: true },
  { id: 'ability.claim_draw', kind: 'ability', title: '抢平', description: '你的专属能力，每场 1 次。出手前声明，手势对手势原始平局改为自己胜。', question: '你愿意把一次机会押在平局上吗？', experience: ['seriesCompleted'], prerequisiteText: '完成首场生命实验；替换当前玩家能力，对手不会获得能力。', presentationReady: true },
  { id: 'ability.insurance', kind: 'ability', title: '保底', description: '每场 1 次，出手前声明。手势对手势原始失败改为平局；不能挡波。', question: '保住这一手，会怎样改变你愿意承担的风险？', experience: ['seriesCompleted'], prerequisiteText: '完成首场生命实验；替换当前玩家能力。', presentationReady: true },
  { id: 'ability.retry', kind: 'ability', title: '再搏一次', description: '每场 1 次，出手前声明。原始失败时作废这次尝试，只耗声明的能力，重新猜这一手。', question: '多一次尝试，不等于回到相同的答案。', experience: ['seriesCompleted'], prerequisiteText: '完成首场生命实验；原准备保留，费用、牌、伤害和手数不提交。', presentationReady: true },
  { id: 'ability.aegis', kind: 'ability', title: '护身', description: '你的专属能力，每场 1 次。随手势提前声明，立即获得 1 盾，本手即可抵挡 1 伤害；已有盾不叠加。', question: '要把一次保护留给哪一拳？', experience: ['seriesCompleted', 'damageObserved'], prerequisiteText: '完成生命实验并实际见过伤害；替换当前玩家能力，对手不会获得能力。', presentationReady: true },
  { id: 'ability.foresight', kind: 'ability', title: '先见', description: '每场 1 次，随手势提前声明。下一手准备完成后公开电脑已锁定的动作种类，再由你选择；不会重抽电脑动作。', question: '知道下一步，会怎样改变这一手的选择？', experience: ['seriesCompleted'], prerequisiteText: '完成首场生命实验；替换当前玩家能力。', presentationReady: true },
  { id: 'ability.siphon', kind: 'ability', title: '夺气', description: '每场 1 次，随手势提前声明。本手回复气之后，将对手至多 2 气转入自己的气槽，受剩余容量限制。', question: '夺走对手的准备，能打开怎样的机会？', experience: ['seriesCompleted', 'energySpent'], prerequisiteText: '当前有生命和气；完成生命实验并实际支付过气。', presentationReady: true },
  { id: 'ability.reforge', kind: 'ability', title: '重铸', description: '每场 1 次，随手势提前声明。结算后把自己每种零库存手势补到 1 张；尚有库存的牌保持不变。', question: '让耗尽的选择回来，会改变哪一次冒险？', experience: ['seriesCompleted', 'inventoryDepleted'], prerequisiteText: '当前有生命和有限手牌；完成生命实验并见过实际耗尽的牌。', presentationReady: true },
  { id: 'ability.last_stand', kind: 'ability', title: '续命', description: '每场 1 次，随手势提前声明。本手若遭受致死伤害，改为留下 1 生命；未遇致死伤害仍消耗声明。', question: '你能判断哪一拳必须留下退路吗？', experience: ['seriesCompleted', 'lowLifeObserved'], prerequisiteText: '完成生命实验，并实际见过一点生命；替换当前玩家能力。', presentationReady: true },
];

export const EXPRESSION_CHOICES: ChoiceCard[] = [
  { id: 'U01', kind: 'expression', title: '给它起个名字', description: '规则不变，让你提交的名字第一次出现在左上角。', question: '你想让人记住这个游戏的哪一点？', experience: ['handPlayed'], prerequisiteText: '首手结束后；取消输入不命名。', expressionKey: 'name', presentationReady: true },
  { id: 'U02', kind: 'expression', title: '挑一种画风', description: '选择不同的画风。手势、角色舞台和资源一起换绘制语言。', question: '同一套规则，在另一种材质里是什么感觉？', experience: ['handPlayed'], prerequisiteText: '首手结束后即可；不需要能力。', expressionKey: 'style', presentationReady: true },
  { id: 'U06', kind: 'expression', title: '把关系画给自己看', description: '让规则入口出现。先看关系图，或先看“我赢谁、输谁”列表，由你决定。', question: '哪一种读法更容易找到下一拳？', experience: ['handPlayed'], prerequisiteText: '实际揭晓过一手；基础猜拳也有可查的关系。', expressionKey: 'rulesView', unlockUI: 'rules', presentationReady: true },
  { id: 'U08', kind: 'expression', title: '让资源更有手感', description: '把现有生命、气和库存显示为小格，或清楚的数字与刻度。', question: '同样一个数值，哪种表示让你更在意？', experience: [], prerequisiteText: '当前有真实生命、气或库存，零值也保留。', expressionKey: 'resources', presentationReady: true },
  { id: 'U10', kind: 'expression', title: '决定这一拳怎样揭晓', description: '双方已经锁定后，快速同时揭开，或经过一个短暂共同节拍。', question: '留一点等待，会让揭晓产生什么变化？', experience: ['multipleReveals'], prerequisiteText: '已经看过几次揭晓；不改变电脑承诺。', expressionKey: 'reveal', presentationReady: true },
  { id: 'U11', kind: 'expression', title: '给出手挑一种声音', description: '比较纸木短音和电子短音，并留下一个静音开关。试听由你点击，音量保持。', question: '哪种声音更像你想做的游戏？', experience: ['handPlayed'], prerequisiteText: '任何结果后即可；静音不阻碍选择。', expressionKey: 'sound', unlockUI: 'sound', presentationReady: true },
  { id: 'U18', kind: 'expression', title: '放上声音与动效开关', description: '让设置入口出现，随时调整音量、静音，以及减少动态效果。', question: '把控制权留给玩家，会怎样改变体验？', experience: ['handPlayed'], prerequisiteText: '看过一次实际出手；系统减少动态效果偏好始终有效。', unlockUI: 'settings', presentationReady: true },
];

export const ALL_CHOICES = [...RULE_CARDS, ...ABILITY_CARDS, ...EXPRESSION_CHOICES];
export function getChoice(id: string): ChoiceCard | undefined { return ALL_CHOICES.find(choice => choice.id === id); }
