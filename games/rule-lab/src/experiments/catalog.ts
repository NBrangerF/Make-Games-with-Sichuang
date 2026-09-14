import type { AbilityDefinition, RuleDefinition } from '../core/types';

export const experimentKeys = ['declaration','pledge','prediction','information','sites','terrain','push','range','auction','all_pay','workers','draft','queue','script','delayed','speed','modifiers','deck','shuffle','bag','stash','risk','loan','insurance','mission','collection','bounty','rarity','factory','technology','converter','puzzle','forecast','surprise','well','furnace','sharing','trade','promise'] as const;
export type ExperimentKey = typeof experimentKeys[number];
export type ExperimentRuleId = `experiment.${ExperimentKey}`;
export const experimentGroups = ['信息与承诺','位置与空间','争夺与经济','时间与计划','手牌与构筑','风险与收益','动机与奖励','建造与生产','公共环境','交易与信任'] as const;
export type ExperimentGroup = typeof experimentGroups[number];
const entries: [ExperimentKey, string, string, string, ExperimentGroup][] = [
  ['sites','三处据点','随手势秘密选左中右。据点相同时交锋胜者占领，平局保留；不同处各自占领。没有地形也能留下归属。','要争最好的位置，还是避开争抢？','位置与空间'],
  ['terrain','地形收益','取得据点当手：左侧回 1 气，中间得 1 盾，右侧补本手手势 1 张。缺配套的收益休眠，不自动产气或发牌。','同一地点对谁更有价值？','位置与空间'],
  ['push','击退与墙角','交锋胜者将败者向墙角推 1 格，满 4 格后再被推多受 1 伤。没有生命也保留位置，不判出界负。','回血能解除位置危险吗？','位置与空间'],
  ['range','进退与射程','随出手选靠近、停留或后退；共享距离 0—2。距离 0—1 手势命中，1—2 波命中，超距仍判交锋胜但不造成主伤害。','赢了交锋也可能打不到吗？','位置与空间'],
  ['auction','暗标争夺','每手竞拍 1 盾，出价 0—2 气，最高者拿走并付费；同价用交锋胜负，双平流拍。新盾在主伤害后得到。','赢猜拳与拿奖品可以分开吗？','争夺与经济'],
  ['all_pay','落标也付费','拍卖改成所有人都支付自己的出价；仍只有得主拿奖品，没有拍卖时休眠。','失败的投入改变了什么？','争夺与经济'],
  ['workers','同时派工','随手势选气井、锻炉、补给站。去不同处各执行；同处只有交锋胜者执行。分别回 1 气、得 1 盾、补本手牌 1 张。','最好的行动拿得到吗？','争夺与经济'],
  ['draft','公共选牌','同时争选一张公共修饰。争同张由交锋胜者获得，平局落空；不同张各得其选。修饰下手起可用，构筑模式进入弃牌堆。','拿自己需要的，还是抢对方需要的？','争夺与经济'],
  ['modifiers','功能手势牌','每种手势三张改为一张基础牌和两张功能牌；每手只出一张。饮血岩吸血、破甲剪破盾、回响布平局返回。不自动循环。','功能不同，仍是同一种手势吗？','手牌与构筑'],
  ['deck','循环牌库','以九张基础与功能手势牌开局，抽五张。每手只出一张，其余保留；下手补到五张，抽空洗回弃牌。额外抽牌上限七张。','强牌越多，关键牌就越容易到手吗？','手牌与构筑'],
  ['shuffle','手牌调度','有循环牌库时，每手出牌前可免费弃一抽一，只能一次。牌库必须还有未抽牌，不能借调度马上拿回刚弃的牌。','丢掉现在的选择，值得赌下一张吗？','手牌与构筑'],
  ['bag','卡牌工坊','开局两锻材，每个有效手结尾加一，上限六。未结束时可选三份配方之一造牌，或花一锻材移除手牌；每手一次。循环模式新牌进弃牌堆，有限模式进手牌。','该增加一张好牌，还是移除一张普通牌？','手牌与构筑'],
  ['mission','秘密委托','双方各有一项私人委托：出布平局、选右据点或以手势击败手势。首次达成回 1 气并公开；不替代整场胜负。','对方是否另有所图？','动机与奖励'],
  ['collection','战利品套组','收藏击败过的对方手势种类，集齐三种兑换 2 气并清空；不要求连续，不作为胜利目标。','还缺的一枚会暴露意图吗？','动机与奖励'],
  ['bounty','富者悬赏','开手气严格更多的一方被悬赏；击败他额外回 1 气。气相同无悬赏，结算时不重选富者。','领先也会变成负担吗？','动机与奖励'],
  ['rarity','冷门补贴','最近六个有效手双方使用最少的手势，使用后回 1 气；并列同待遇，不改变克制。开手确定名单。','补贴会让冷门变热门吗？','动机与奖励'],
  ['factory','建造小工厂','付 1 气建一座工厂并放弃本手主伤害，最多两座；从下手开头每座产 1 气。一手结束就不会生产。','需要多久才能回本？','建造与生产'],
  ['technology','设备技术分支','有工厂时可付 1 气升级一次：高产使每手总产气 +1；铸盾改为每手得 1 盾而不产气。每场只能选一条分支。','专精放弃了哪些可能？','建造与生产'],
  ['converter','资源转换连线','可选择关掉连线、获得新盾后回 1 气，或结尾付 1 气补本手牌。每手最多触发一次，缺配套保留且休眠。','连接两个效果会产生什么效率？','建造与生产'],
  ['puzzle','战利品拼图','手势获胜得到拼块：石头横两格、剪刀三格 L，其余单格。下一手提交时选 3×3 棋盘位置与旋转，完整行清空并回 1 气；可放弃待放块。','胜利奖励也需要空间吗？','建造与生产'],
  ['sharing','分享或独吞','随手势选分享或独吞：都分享各回 1 气；单方独吞得 2，分享者得 0；都独吞均无。猜拳独立结算。','存在未来会改变承诺吗？','交易与信任'],
  ['trade','同时提出交换','秘密提交给出的牌与想要的牌，双方反向匹配才成交；同手动作牌和交易牌分别预留。交易在伤害后进行，不会改变本手合法动作。','互利一定能成交吗？','交易与信任'],
  ['promise','援助与承诺','宣言阶段可承诺：若对方实际出布，送他 1 气。绑定承诺会预留并执行；口头承诺可选兑现或违约；双方在选真实动作前看到承诺。','能强制执行与只能相信有什么不同？','交易与信任'],
];
export const EXPERIMENT_RULES = entries.map(([key,title,description,question,group]) => ({id:`experiment.${key}` as ExperimentRuleId,key,title,description,question,group,category:'experiment' as const,prerequisites:[]})) satisfies (RuleDefinition & {key:ExperimentKey;group:ExperimentGroup})[];

export const roleKeys = ['storyteller','ronin','clockmaker','scrapper','broker','kite','smith','monk','sheathed','cartographer'] as const;
export type ExperimentAbilityId = `ability.${typeof roleKeys[number]}`;
const roles: [typeof roleKeys[number],string,string,string,string,string][] = [
  ['ronin','浪人追猎者','随手势声明一次：获胜放弃本手主伤害并额外击退一格；需要击退规则。','眼前伤害与墙角压力选哪个？','逐风','claim-draw'],
  ['scrapper','废铁匠','常驻：每场首次在公共选牌中输给对方，得到一张命中回气修饰。','失败能成为怎样的补给？','拾火','reforge'],
  ['broker','街头庄家','随手势声明一次：落标后返还实际竞价支出的至多 1 气。','什么时候值得承担竞争？','千筹','retry'],
  ['kite','纸鸢行者','随手势声明一次：本手移动且获胜时放弃主伤害，解除自己的两格墙角压力。','怎样把胜利换成更好的位置？','鸢','insurance'],
  ['monk','守约僧','常驻：每场首次分享却遇到独吞，在主伤害后获得 1 盾。','一次保护会让你更愿意相信吗？','静岚','aegis'],
  ['sheathed','藏锋者','常驻：每次打出无功能的基础牌积一标记，最多 2；打出功能牌后消耗标记并回复相同气。没有气槽时回气休眠。','忍耐会让意图更明显吗？','未央','scissors-ninja'],
  ['cartographer','绘图师','随手势声明一次：放拼块前清空选定的一格，腾出空间；没有拼图时休眠。','整理空间能改变未来机会吗？','星图','siphon'],
];
export const EXPERIMENT_ABILITIES = roles.map(([key,title,description,question,name,image])=>({id:`ability.${key}` as ExperimentAbilityId,title,description,question,activation:['storyteller','scrapper','monk','sheathed'].includes(key)?'passive' as const:'active' as const,name,image:`showa/${image}.png`})) satisfies (AbilityDefinition & {name:string;image:string})[];
export const modifierLabels = { leech:'命中回气', sidestep:'落败位移', capture:'获胜缴获', power:'重击', shield:'护身符', echo:'平局回气' } as const;
export type Modifier = keyof typeof modifierLabels;

// Keep the complete engine catalog for saved designs and future editions.
// All selection surfaces use this smaller, shared release catalog.
export const visibleExperimentGroups: readonly ExperimentGroup[] = [
  '位置与空间', '手牌与构筑',
];
export const VISIBLE_EXPERIMENT_RULES = EXPERIMENT_RULES.filter(rule => visibleExperimentGroups.includes(rule.group));
const hiddenAbilities = new Set(['ability.scrapper', 'ability.broker', 'ability.monk', 'ability.cartographer']);
export const VISIBLE_EXPERIMENT_ABILITIES = EXPERIMENT_ABILITIES.filter(ability => !hiddenAbilities.has(ability.id));
