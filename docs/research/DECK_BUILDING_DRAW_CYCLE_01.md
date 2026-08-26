# 牌库构筑、抽牌概率与循环控制：专项研究 01

日期：2026-08-20  
状态：review  
研究范围：26 个正式规则、设计师实践、学术/计算与概率资料、无障碍资料及玩家症状来源；5 个来源完成全文或主体深读  
总体信心：中高。牌张去向、抽取模型和循环协议信心高；最佳牌库规模、压缩率、组合密度、洗牌次数和市场结构无通用证据。

## 执行摘要

牌库构筑不是“买更强的牌”。它是一条带延迟的生产链：卡牌从供应或市场进入取得区，经过手牌、打出区和弃牌区，通常要到下一次循环后才兑现；顶置、入手、检索、保留、放逐和永久区会改变这个延迟。《Dominion》《Star Realms》《Aeon's End》《Imperium》和《Dale of Merchants》用不同的获得位置、洗牌规则和移除终点证明，同一张牌的价值必须连同**进入位置、首次可用时点、预计可用次数和终局去向**一起记录。[1–5]

抽牌概率也不能只写“牌库中有 20% 好牌”。若从一个已知有限牌库不放回抽取，固定手牌中抽到若干目标牌可用超几何分布；等待第一张目标牌则属于不放回等待时间问题。[13][14] 但抽后弃掉再重抽、选择性检索、顶置、牌序可控、中途洗牌和多个牌堆会破坏最简单模型。网站应提供透明的计算工作单，而不是一个隐藏假设的“最佳牌库大小”按钮。

压缩并不天然等于优化。《Star Realms》明确把移除起始牌连接到更频繁抽到好牌；《Dale of Merchants》却把强制从牌库移出卡牌直接做成获胜进度；《Imperium》又把 history、exile 和 Unrest 分成不同的长期去向。[2][4][5] 因此要问的不是“能不能删牌”，而是删掉什么功能、花费哪个窗口、让哪条路线更稳定、是否加速终局，以及落后玩家是否还有恢复渠道。

组合强度也不是单卡强度相加。AIIDE 2023 的 Dominion 研究发现，代理容易学到即时奖励较高的简单金钱策略，却需要特殊训练安排才能学会依赖精确序列的引擎；作者也报告代理会过量购买行动牌，部分晚买的牌甚至来不及抽到。[15] 这不能直接给玩家策略，却支持网站让设计师同时记录**组合部件密度、抽到同手的概率、行动许可、兑现轮数和失败手牌**。

最后，洗牌不是免费的随机化。《Star Realms》无障碍长评指出，小牌堆频繁洗牌可能比大牌堆更难操作；Meeple Centred Design 把高频重复操作与记忆/协同负担列为独立可访问性问题；一名残障玩家的博客还具体描述了不能自行洗牌、检索秘密牌和阅读大量卡文时的支持需求。[19][20][22] 因而每次循环测试都应记录洗牌次数、用时、协助者、卡牌查询、秘密泄露和重新入局时间。

## 研究问题

1. 牌库组成如何把起始牌、行动、支付、污染、得分和终局牌变成不同功能槽？
2. 获得、弃置、顶置、入手、检索、保留、移除与永久区如何改变兑现延迟？
3. 洗牌、固定顺序、已知弃牌和循环触发如何改变概率、记忆与节奏？
4. 压缩、牌库膨胀、组合密度、共享市场和晚期购买怎样制造或削弱路线？
5. 洗牌操作、卡文读取、查询权限、辅助和牌库耗尽怎样影响可访问性与终局？

## 1. 先写功能组成，不先写总张数

### 来源事实

《Dominion》的起始牌库包含 7 张 Copper 与 3 张 Estate；每轮通常抽 5 张，资源、行动和得分都留在同一循环里。设计师 Donald X. Vaccarino 回顾说，把资源留在牌库是为了避免牌库过易缩小，把得分牌留在牌库则让得分时机与当前效率冲突；起始牌库至少 10 张还部分来自“小牌堆难以洗牌”的实体考虑。[1][8]

《Star Realms》同样从 8 张 Scout 和 2 张 Viper 开始，但把持续留场的 Base、正常弃置的 Ship、可永久 scrap 的卡和共享 Trade Row 分开；这使“个人牌库张数”不能完整代表当前引擎。[2] 《Dune: Imperium》再提供一个混合系统反例：一张牌的 Agent 区可以支付工人放置资格，未用于 Agent 的剩余手牌又在 Reveal 回合产生资源；多一个 Agent 会消耗一张本可用于揭示收益的牌。[10]

《Imperium》把国家牌、市场牌、Unrest、history、exile、pinned tableau 和发展牌分开；每次循环还可能把国家牌加入弃牌堆并推动文明状态改变。[4] 因而“牌库质量”至少应拆为当前可抽组成、循环外持续能力、未来注入、污染增长和终局价值，而不是单一平均卡值。

### 项目推断

本站采用“功能槽清单”：每种牌标记为行动许可、支付、抽取、筛选、检索、压缩、污染、得分、终局触发、持续区或多用途，并写数量、进入时点和离开方式。这是项目综合工具，不是上述作者共同提出的分类。

## 2. 获得位置决定首次兑现时间

### 来源事实

《Dominion》和《Star Realms》的常规购买都先进入弃牌堆，不能立即使用；当抽牌堆不足并需要继续抽时，弃牌堆才会洗成新牌库。[1][2] 《Star Realms》又用顶置、直接入手和 scrap 等例外改变这条路径。[2] 因而同样成本的牌，若进入弃牌、牌顶或手牌，其首次兑现时点不同。

《Aeon's End》采用“不洗个人牌库”的规则：牌库耗尽后翻转弃牌堆，出牌和弃置顺序因此会影响未来手牌；设计师访谈把目标描述为在避免任意堆叠导致过慢的同时，给玩家受约束的额外控制。[3][11] 玩家讨论显示，习惯其他构筑游戏的人会把购买牌和已打出牌的弃置顺序弄反，说明固定顺序把原本可忽略的清理细节变成核心规则。[25]

《Dale of Merchants》让玩家为市场购买、技巧、建摊和整理手牌四类行动择一；建成的摊位牌不再回到循环，并直接推动八摊位终局。[5] 《The Quest for El Dorado》的规则转录又区分正常弃置和带移除符号的一次性使用；玩家讨论显示不同版次文字与“作为能力使用/作为半金币或通行支付”的去向曾引发混淆。[6][26]

### 项目推断

对每张可获得牌记录：购买/取得窗口、进入区域、当前循环能否使用、预计首次抽到轮次、预计剩余循环数、是否可检索或顶置、终局是否仍能兑现。测试“买牌很爽但没见到”时，先查兑现延迟，不直接提高卡面强度。

## 3. 概率模型必须写明区域与抽取协议

### 来源事实

Penn State 与 NIST 的概率资料都把超几何分布用于有限总体中的不放回抽样；标准案例就是从 52 张牌抽 5 张并计数 A。[13][14] 对一个已充分随机、当前未知、抽后暂不放回的 N 张牌库，其中 K 张满足目标，抽 n 张得到恰好 k 张目标牌，可用：

`P(X=k) = C(K,k) × C(N-K,n-k) / C(N,n)`。[13]

至少抽到一张目标牌可用补事件：

`P(X≥1) = 1 - C(N-K,n) / C(N,n)`。

这些公式计算的是满足假设的抽取结果，不是“玩家会觉得公平”或“这手牌有好决定”。《Dominion》的抽牌可能跨越洗牌边界，Cellar 等效果会先把弃牌放入将要洗的新牌库；《Aeon's End》的牌序又不是随机未知；《Star Realms》允许查看弃牌堆并可能把牌顶置。[1–3] 每个例外都会改变样本空间或已知信息。

Nealen 对《Ascension》的分析把 cycling 定义为牌库反复重洗，使已购牌可能在一局中多次摊销成本；同时指出动态中心列会在每次购买后立刻改变可用选择。[12] 这说明还要分开两种随机性：**个人牌库抽取**和**公共市场到达**。

### 项目推断

概率工作单至少要求：牌库/弃牌/手牌/持续区各有多少牌、目标定义、抽取张数、是否不放回、是否跨洗牌、已知牌、顶置/检索/弃后重抽、多个部件是否必须同手，以及计算时点。若任一项不满足简单超几何模型，改用枚举或模拟，并公开模型假设。

## 4. 压缩、膨胀与组合必须连接到终局时钟

### 来源事实

《Star Realms》规则直接说明：移除起始牌可使好牌更常被抽到；但使用牌自身的 Scrap Ability 也会永久失去那张牌，必须比较当前收益与未来循环。[2] 《Imperium》中的 history 会离开牌库但保留终局计分，exile 通常离开游戏却仍可能被少数效果找回，Unrest 则会污染牌库并在供应耗尽时触发 collapse。[4]

《Dale of Merchants》把牌库压缩与胜利进度绑定，强牌进入摊位后不再提供效果；压缩因此不是无损优化，而是把引擎转为终局状态。[5] 《Undaunted》又把单位伤亡与牌库卡牌损失连接，让“删牌”可能同时削弱地图上的单位行动与命令概率。[7]

AIIDE 2023 的 Dominion 代理在 26 张基础王国牌、两人设置和特定奖励塑形下学习 Big Money、Rush 与 Engine。作者发现 Engine 依赖精确的行动序列，简单即时收益策略更容易被学到；代理还会过量购买行动牌，晚买的牌有时整局未抽到。[15] 另一项 Markov 链研究只优化 Big Money Terminal Draw 的窄策略并给出特定回合启发式，不能转成所有王国或所有构筑游戏的通则。[17]

2024 年 Dominion benchmark 论文发布超过 200 万局熟练玩家线上对局资料，说明牌库构筑可支持大规模行为分析；它仍是数字实现、熟练玩家和 Dominion 特定规则的资料，不等于新手实体桌面体验。[16] 玩家设计社区则反复提出牌库膨胀、新牌在终局前来不及出现、频繁洗牌、组合长回合和共享市场过载等症状；这些自选讨论只能生成测试假设，不能估计发生率。[23][24]

### 项目推断

每次获得或移除都记录四个量：牌库净变化、目标部件密度、下一次洗牌距离、预计剩余循环。组合测试必须同时记录“抽到部件”“同手出现”“拥有合法行动/资源”“在终局前兑现”四层失败，不能把所有失败都归为概率低。

## 5. 洗牌、查询和代操作属于机制成本

### 来源事实

Meeple Centred Design 把卡牌尺寸、重复操作频率、记忆、规则协同、游戏流程变化和代操作指令分别列入启发式；它特别指出，偶尔能完成的操作在每分钟重复多次时可能成为障碍。[19] 《Star Realms》长评观察到，早期个人牌库很小，标准洗牌更难；牌库增大后虽然好洗，却增加协同与牌组构成的认知负担。[20]

Accessible Games 的 Dominion 评论同样把频繁洗牌列为可能的操作障碍，但本轮只取得文章级内容，不能替代完整任务观察。[21] Geeky Gimp 的第一人称文章描述了自己需要他人协助洗牌、无法自行私密读取大量卡文，并建议使用卡架、图标、玩家辅助或屏风；作者明确说明这些办法来自个人经验，不适用于所有人。[22]

关于“洗几次才随机”的数学不能直接给桌游通用次数。重复牌洗牌研究指出，所需混合程度取决于采用的距离度量、牌是否可区分，以及游戏真正关心的是完整顺序、颜色、牌型还是发到手里的集合。[18] 更重要的是，部分游戏像《Aeon's End》有意不随机个人牌序；把所有牌强制充分混合会破坏机制。[3]

### 项目推断

循环测试新增五个实体字段：每局洗牌次数、每次用时、方法/协助者、卡牌掉落或翻面、恢复时间。查询字段记录可否数牌、查看弃牌、查看已知顺序和使用记录工具；辅助字段记录是否替代构筑判断、泄露秘密或改变其他玩家等待。

## 形成性测试协议摘要

用 3–5 名中文新手完成五项任务：

1. 把一个 10–20 张微型牌库按功能槽和区域分类；
2. 追踪一次购买从供应到首次可用，再估计终局前可用次数；
3. 在明确假设下计算或用卡牌实抽“至少一张目标牌”，再加入顶置/检索例外；
4. 对一次压缩或新增写出密度、循环距离、路线与终局副作用；
5. 以自行选择的洗牌、卡架、代操作或公开记录方式重放，记录时间、泄密和决定权。

成功不等于构筑出“最强牌库”，而是陌生玩家能准确重建牌张去向、解释计算假设、区分未抽到/不能打/来不及兑现，并只改一个字段。完整脚本见 `docs/product/USABILITY_TEST_DECK_BUILDING_DRAW_CYCLE.md`。

## 来源矩阵

| # | 来源 | 层级 | 本轮用途 | 不能证明 |
|---|---|---|---|---|
| 1 | [Dominion official rules](https://www.riograndegames.com/wp-content/uploads/2020/03/Dominion-gameRules.pdf) | 官方规则 | 起始牌、获得进弃牌、跨洗牌抽取、查询与移除 | 最佳购买、牌库大小或压缩率 |
| 2 | [Star Realms official rulebook](https://files.wisewizardgames.com/starrealms/SRROE_Rulebook_2023-01-30.pdf) | 官方规则 | 共享市场、个人牌库、scrap、持续基地与查询 | 该规则组合的单项因果 |
| 3 | [Aeon's End rules](https://aeonsend.wiki.gg/wiki/Rules) | 规则汇编 | 不洗个人牌库、翻转弃牌与顺序控制 | 官方全文版本或最佳固定顺序 |
| 4 | [Imperium mechanisms overview](https://www.ospreypublishing.com/us/osprey-blog/2021/imperium-blog-mechanisms-overview/) | 出版方机制说明 | 循环注入、history/exile、Unrest 与 collapse | 历史模拟准确性或最佳污染率 |
| 5 | [Dale of Merchants Collection rules](https://snowdaledesign.fi/wp-content/uploads/2018/09/Dale_of_Merchants_C_Rules_EN_6.pdf) | 出版方规则 | 建摊移出、整理手牌、递增终局 | 最佳摊位结构或牌组大小 |
| 6 | [The Quest for El Dorado rules transcription](https://www.rulespal.com/the-quest-for-el-dorado/rulebook) | 规则转录 | 一次性移除、正常弃置与保留 | 当前官方版全部边界 |
| 7 | [Undaunted: Normandy designer diary](https://www.ospreypublishing.com/uk/osprey-blog/2019/designer-diary-creating-undaunted-normandy/) | 一手设计日志 | 牌库构筑、地图单位、伤亡删牌与盲测 | 伤亡删牌的独立效果 |
| 8 | [Cardboard Edison: Donald X. Vaccarino](https://cardboardedison.com/blog/meaningful-decisions-donald-x-vaccarino-dominion) | 设计师访谈 | 五张手牌、资源留牌库、市场形式与起始牌数取舍 | 设计选择普遍最优 |
| 9 | [Imperium: Horizons design diary](https://www.ospreypublishing.com/uk/osprey-blog/2024/imperium-horizons-design-diary/) | 一手设计日志 | 私人市场、非对称牌库、700+ 测试与规则重写 | 具体改动的因果或跨游戏参数 |
| 10 | [Dune: Imperium designer diary](https://news.direwolfdigital.com/dune-imperium-designer-diary-1-beginnings/) | 一手设计日志 | 手牌在 Agent/Reveal 间的机会成本 | 混合机制普遍更好 |
| 11 | [Kevin Riley interview on Aeon's End](https://www.goblins.net/articoli/aeon-s-end-intervista-kevin-riley-goblin-magnifico) | 设计师访谈 | 不洗牌的受约束控制意图 | 记忆负担或最佳牌序 |
| 12 | [Nealen et al., Towards Minimalist Game Design](https://www.nealen.net/ascension.pdf) | 设计分析论文 | cycling、成本摊销、动态中心列与终局时钟 | Ascension 参数可直接移植 |
| 13 | [Penn State STAT 414: Discrete Random Variables](https://online.stat.psu.edu/stat414/Lesson07) | 大学概率课程 | 不放回抽样与超几何分布 | 玩家体验、公平感或策略价值 |
| 14 | [NIST hypergeometric glossary](https://www.itl.nist.gov/div898/handbook/glossary.htm) | 官方统计参考 | 有限总体、不放回与整数参数边界 | 复杂牌序和检索模型 |
| 15 | [Gerigk & Engels, Playing Various Strategies in Dominion](https://ojs.aaai.org/index.php/AIIDE/article/download/27518/27291/31569) | AIIDE 2023 论文 | 多集合状态、压缩、组合序列与晚买牌 | 人类新手策略或通用胜率 |
| 16 | [Dominion: A New Frontier for AI Research](https://arxiv.org/abs/2405.06846) | 计算研究预印本 | 200 万局熟练玩家数字对局资料 | 实体新手体验或机制因果 |
| 17 | [Optimizing Buying Strategies in Dominion](https://scholar.rose-hulman.edu/rhumj/vol25/iss1/2/) | 数学建模论文 | Markov 链与窄策略时点 | 所有王国或构筑游戏最佳购买 |
| 18 | [Riffle shuffles of decks with repeated cards](https://arxiv.org/abs/math/0503233) | 洗牌数学研究 | 重复牌、度量与所需随机程度边界 | 任意桌游必须洗固定次数 |
| 19 | [Meeple Centred Design toolkit](https://d-nb.info/116389902X/34) | 桌游无障碍启发式论文 | 重复洗牌、记忆、协同与代操作 | 对单个玩家的适配结论 |
| 20 | [Star Realms accessibility teardown](https://www.meeplelikeus.co.uk/star-realms-2014-accessibility-teardown/) | 无障碍长评 | 小牌堆洗牌、卡牌协同、查询与支持 | 所有残障玩家体验 |
| 21 | [Dominion accessibility review](https://www.accessiblegames.biz/dominion-review/) | 无障碍评论 | 频繁洗牌玩家症状 | 完整障碍分类或效果量 |
| 22 | [Geeky Gimp accessibility hacks](https://geekygimp.com/six-board-game-accessibility-fails-and-how-to-hack-them/) | 残障玩家一手博客 | 洗牌、秘密卡文、卡架、屏风与协助 | 所有人的唯一解决方案 |
| 23 | [What would you improve in deckbuilders?](https://www.reddit.com/r/tabletopgamedesign/comments/16e927n) | 设计社区症状 | 牌库压缩、循环速度、洗牌等待与移牌终局 | 症状发生率或共识 |
| 24 | [Share your problems with deckbuilding](https://www.reddit.com/r/BoardgameDesign/comments/1juh2h0) | 设计社区症状 | 牌库膨胀、唯一牌过多与不能洗牌 | 通用修复或代表性 |
| 25 | [Played Aeon's End wrong](https://www.reddit.com/r/boardgames/comments/dd19y7) | 玩家规则症状 | 购买牌与已打出牌弃置顺序误读 | 规则总体难度或发生率 |
| 26 | [Quest for El Dorado rule clarification](https://www.reddit.com/r/boardgames/comments/1ca70bg) | 玩家规则症状 | 版次、一次性能力与半金币去向混淆 | 当前官方统一裁决 |

## 深读记录

- **Dominion 官方规则**：深读 16 页，核对起始牌库、获得进弃牌、跨洗牌抽取、弃牌/Trash/Reveal/Set Aside、清理、查询权限与供应耗尽终局；重点是“需要抽牌时才洗”，不是回合固定洗牌。
- **Star Realms 官方规则**：深读 16 页主体规则，核对个人牌库、共享 Trade Row、五张补牌、基地持续区、scrap 永久移除、弃牌可查询和购买不能立即使用。
- **Donald X. Vaccarino 访谈**：阅读全文，核对资源/得分留牌库、五张抽取、十类公开市场、起始牌数、单 Action/Buy 与牌堆耗尽终局的设计理由；这些是作者回顾，不是受控因果。
- **AIIDE 2023 Dominion 论文**：深读模型、26 张王国牌范围、两人设置、奖励塑形、训练、结果与限制；重点保留 Engine 需要序列、过量购买和非人类水平边界。
- **Star Realms accessibility teardown**：阅读全文主体，核对卡牌协同记忆、小牌堆频繁洗牌、持续区、可查询弃牌、代操作与作者的启发式/主观限制。

## 方法与缺口

围绕五个问题进行了多轮英文检索，优先官方规则、设计师原站、出版方日志、大学课程、同行评审或开放论文、残障玩家一手博客和含具体局面的社区讨论。26 个来源进入综合，5 个完成全文或主体深读；正式规则、作者意见、计算研究、无障碍证据、玩家症状和项目推断分开书写。

当前缺口：缺少中文设计师公开的构筑原型长周期日志；缺少中国大陆残障玩家对频繁洗牌、牌堆检索、卡架和代操作的一手任务资料；缺少比较不同牌库规模、压缩成本、组合密度、洗牌协议和市场刷新策略的桌游对照研究；多数计算研究局限于 Dominion 或数字实现。故本报告不提供最佳牌库张数、起始牌比例、手牌数、压缩率、目标牌密度、循环次数、洗牌次数、市场槽位、组合长度或疲劳阈值。
