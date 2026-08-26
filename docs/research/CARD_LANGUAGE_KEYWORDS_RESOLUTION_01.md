# 卡牌组合、关键词模板与效果结算顺序：专项研究 01

日期：2026-08-20  
状态：review  
研究范围：30 个正式规则、设计师实践、规则工程、学术/计算、无障碍与玩家症状来源；5 个来源完成全文或主体深读  
总体信心：中高。能力结构、触发窗口、同时效果、替代效果和循环终止的规则证据信心高；最佳关键词数量、图标比例、卡文字数、字号与组合长度无通用证据。

## 执行摘要

卡牌文字不是叙述文，而是一套由玩家执行的小型程序。成熟规则系统反复把它拆成相近部件：**时点/触发—限制—费用—目标—动作—结果—持续时间**。Netrunner 用“费用：效果”定义启动能力，并把指令、打断窗口与 checkpoint 分开；Arkham Horror LCG 在启动能力前检查限制、费用与是否可能改变游戏状态；Magic 则要求效果按书写顺序执行，同时用优先权、堆叠、状态动作和触发入栈处理嵌套。[1–3] 本站因此不提供万能句式，而提供一张“能力句法卡”和一条可逐步回放的效果轨迹。

关键词和图标的价值不是单纯省字。Mark Rosewater 把关键词描述为可复用的规则速记与设计空间；Daniel Solis 强调信息层级和简洁；Daniel.games 则提醒只有高频、稳定、能用简单轮廓表达的动作才适合图标，低频变体应回到正文。[7–11] 2026 年 Marvel Champions 规则更新提供了一个重要案例：把关键词、状态和卡牌能力改写为同一种游戏语言后，多个效果可以比较同一触发条件，而不再记额外优先级。[4] 因而本站把关键词视作有版本、有展开文本、有示例和反例的规则模块，不把“做一个图标”当作完成。

结算模型至少要回答五件事：谁创建效果、何时满足、谁选择、能否回应、何时检查结果。Magic 的 APNAP 顺序、Arkham 的“when/after”与 forced/reaction 优先、Netrunner 的 imminent event—interrupt—checkpoint，以及 Root 的“当前玩家裁定不明同时效果”说明，不同游戏可以选择不同模型，但必须选定一个并让卡牌与总规则一致。[1–3][5] “若……则”“然后”“改为”“每次”“至多一次”“不能”也必须具有固定含义，不能依赖自然语言直觉。

组合测试不能只问“两张牌能否联动”。应追踪事件、效果与状态形成的有向图，并区分正常重复、强制无限循环和可选无限循环。Magic 对没有可选动作的无限循环判和；Netrunner 要求强制循环由指定玩家选择有限次数后结束，并对可选跑动循环规定退出责任；Spirit Island 的 action tree 禁止触发动作直接或间接触发自己。[1][3][6] 这些都是具体规则选择，不是所有游戏的唯一答案；可迁移的要求是：循环检测后必须有**责任人、有限次数、可观察终止状态和规则文字**。

最后，简洁不能牺牲可读性与可访问性。Daybreak 的设计日志记录了“一张牌一个效果”和塔罗牌尺寸的远座阅读取舍；Sarah Reed 的访谈、Meeple Like Us 的 Arnak 评测和 2026 年字体访谈分别指出秘密牌代读、信息密度、小型内嵌图标、对比、字形与字距的实际成本。[12][24–27] 因此测试必须从真实座位读取、解释、执行、查询和恢复，而不是只在屏幕放大稿上校对。

## 研究问题

1. 一张牌的费用、条件、目标、动作、结果和持续时间怎样形成可执行语法？
2. 静态、启动、触发、替代与延迟效果怎样进入同一时序模型？
3. 同时发生、嵌套回应、优先权、跳过和“若/然后/改为”怎样裁定？
4. 组合、重复、强制/可选无限循环怎样被检测和安全终止？
5. 关键词、图标、规则查询、翻译、远座阅读和辅助操作怎样降低成本而不制造新歧义？

## 1. 先建立能力语法，再压缩成卡文

### 来源事实

Netrunner 把 paid ability 写作“cost: effect”，并把 static、paid、conditional、play、subroutine、replacement 和 lingering effects 分开；单个指令会成为 imminent event，打开 interrupt 窗口，完成后进入 checkpoint。[3] Arkham 的 ability initiation sequence 要先检查打出/启动限制、费用和效果是否有改变游戏状态的可能，再支付费用并开始结算；constant、forced、revelation、triggered 与 keyword 各有入口。[2]

Magic 规定卡牌文字只在特定情形覆盖一般规则，“不能”优先于“能”；结算时按书写顺序执行，但玩家应先读完整段文字，目标在入栈时选择而不是结算时临时决定。[1] Root 也明确卡牌与总规则冲突时服从卡牌，“cannot”是绝对词，复合动作或持续效果不可被任意插入另一个效果，除非文字明确允许。[5]

CardScript 研究尝试以可记录/回放的布局、牌堆、动作、条件、阶段、事件和状态描述卡牌游戏；作者同时指出纯文本记法会很快变复杂，需要模块化和显示/隐藏结构。[20] 较早的 Card Game Description Language 也用 antecedent、consequent、阶段与 once 修饰描述规则。[21]

### 项目推断

本站采用七槽能力草稿：`窗口/触发 → 限制 → 费用 → 目标 → 动作 → 结果 → 持续/去向`。卡面可省略空槽，但规则数据不省略；只有当同一模板至少稳定复用多次、盲测者能正确展开且翻译保持一致时，才候选为关键词或图标。这是本站综合工具，不是某一来源的原句法。

## 2. 所有效果进入同一张时序表

### 来源事实

Arkham 区分 “when” 与 “after”：前者在事件发生时打断，后者在事件完成后回应；forced ability 在相同触发点先于 reaction，reaction 对每次触发通常只能使用一次。“Then” 要求前半完整结算才能执行后半；“instead/would”属于替代；limit 与 maximum 约束范围不同。[2]

Magic 用优先权和 stack 处理可回应对象：所有玩家连续放弃后才结算顶端对象；状态动作在玩家获得优先权前检查；同时触发的能力按主动玩家—非主动玩家（APNAP）顺序入栈。替代/防止效果修改将要发生的事件，受影响玩家或对象控制者在多个适用效果间选择顺序。[1]

Netrunner 不要求所有效果都进入同一种“堆叠”；它对每条指令建立 impending/imminent event、interrupt window 与 checkpoint，并定义同时效果的选择责任。[3] Root 采用更轻量模型：不明的同时效果或选择由正在进行回合的玩家决定，而且除非明确允许，不能打断动作、能力或持续效果。[5] 这些模型不同，但都把默认时点和选择责任写进总规则。

Marvel Champions 1.8 更新把关键词、状态卡和遭遇图标改写为与卡牌能力相同的游戏语言，使同一触发条件下的效果可以直接比较；设计团队明确把目标描述为减少“必须按什么顺序”的记忆，让玩家更多在同一时点选择顺序。[4]

### 项目推断

原型应先选一种最小结算模型：无响应顺序、固定阶段队列、主动玩家选择、APNAP、或完整优先权/栈。不要从多个游戏各拿一半。每个窗口记录：创建事件、适用效果收集、选择/排序责任、打断/回应权限、逐条结算、状态检查、恢复到哪个窗口。

## 3. 逻辑连接词必须有规则含义

### 来源事实

Arkham 对 “then” 的前件完成、“if”限定、限定词作用范围、instead/would 替代与 once/limit/maximum 作了规则化定义。[2] Magic 规定效果按文字顺序执行，并把 impossible action、illegal target、replacement/prevention 和 self-replacement 分开。[1] Root 的 “cannot” 绝对优先和“尽可能多地执行，但不能避免费用或前提”展示了另一个紧凑的失败处理方案。[5]

Paleo 设计师维护的 FAQ 显示首版“坏措辞”、遗漏规则和跨版次澄清会长期共存；例如工具使用后的去向、资源与伤害必须先支付再拿奖励、“X 被摧毁”究竟是要求还是许可，都需要额外说明。[15] University of Washington 的规则抽取研究也发现，仅凭关键词从规则书提取逻辑结构只有 11% F-measure，策略建议和解释文字会产生大量伪规则。[22] 自然语言“看起来很清楚”并不等于结构可恢复。

### 项目推断

本站维护项目级受控词表：`当/在…时`、`在…之后`、`若`、`然后`、`改为`、`可以`、`必须`、`不能`、`每次`、`每轮一次`、`至多`、`选择`、`目标`、`任意`。每个词写正例、反例、失败时是否继续和翻译对照；原型出现同义改写时先合并词表，不立刻增加新关键词。

## 4. 组合用效果轨迹验证，循环用协议终止

### 来源事实

Magic 规定如果一组强制动作会永远重复且没有可选动作，游戏为平局；可选循环则进入 shortcut/loop 规则，不允许用“我重复无限次”跳过对手可作决定的窗口。[1] Netrunner 对 mandatory infinite loop 要求负责玩家声明一个有限次数后结束；若跑动中的可选循环双方都可维持，则 Runner 必须 jack out 或 Corp 必须让循环结束，规则明确分配退出责任。[3]

Spirit Island 的 action tree 把 basic、nested、triggered action 分开；触发动作可以多次发生，但不能直接或间接触发自己，以避免无限循环。[6] Magic 被证明在特定构造中图灵完备，甚至可让决定赢家的问题不可判定；这只说明对开放、可扩展系统，不能期待一个通用求解器穷尽所有组合，不说明普通原型必然复杂或不可测试。[23]

Challengers! 设计师日志报告，用“Ball loss”和“From the bench”这类时点短语替代散乱表述后，相关提问几乎消失；设计团队也因双方板凳区互动产生时序和抽取混淆而删除了部分效果。[13] 这是创作者回顾，不能证明关键词单独造成改善，但提供了“从真实问题反推时点模板”的案例。

### 项目推断

组合审查采用效果轨迹：为每一步记录事件编号、来源、触发、控制者、目标、支付、状态前后、生成的新事件、是否再次经过同一状态。出现重复状态时分三类：有限资源自然终止、强制循环、至少一方可选循环。每一类都必须写最大执行次数或退出责任，而不是交给桌上争论。

## 5. 关键词、图标、版式和查询共同承担理解成本

### 来源事实

Rosewater 的两篇设计文章把关键词视为规则速记、共同词汇和可持续扩展的设计空间，同时提醒它们需要一致使用和玩家学习。[7][8] 他在设计文件流程中还建议尽早加入 reminder text 和粗略规则模板，以便看到机制真正印在牌上的样子。[9]

Daniel Solis 提出 visibility、hierarchy、brevity：先决定最重要信息及位置，再用关键词或图标压缩高频长句；更多内容常迫使字号更小或字面更窄。[10] Daniel.games 建议为图标设较高使用门槛、保持微缩后仍简单，并记录了“关闭任意地点/关闭此地点”两个相似图标持续被误读、最终改回图标加正文的案例。[11]

Daybreak 的团队把卡牌收敛到单一效果，并使用较大牌面让对桌玩家更容易阅读；这项改动与其他系统、美术和主题迭代同时发生，不能单独归因。[12] Sarah Reed 访谈指出隐藏手牌会使代读泄露信息，简单大图标、对比、开放信息和远座可读性可能降低支持成本，但这是特定家庭的一手经验。[24] Arnak 无障碍评测则观察到信息密集的秘密牌、小型图标和文字内嵌图标会给低视力玩家带来查询负担。[25]

Meeple Centred Design 的启发式把视觉、认知、动作与协助成本分开。[26] 2026 年字体访谈强调高 x-height、较大 counter、足够字宽/字距、稳定背景与对比，并提醒小字号斜体和细笔画在打印与弱光条件下更脆弱。[27] Unfair 的公开开发词表与 dV Giochi 规则书指南说明稳定术语、样例文本和查询结构可以作为跨组件与编辑协作的基础。[16][17]

### 项目推断

每个关键词和图标都维护四件套：展开规则、卡面短形、图标/文字双编码、查询位置。形成性测试从目标座位、真实尺寸、常见光线和手持/桌面状态完成“找触发—说限制—执行—查询—返回”，并记录谁代读、是否泄露秘密、是否替玩家判断。

## 形成性测试协议摘要

用 3–5 名中文新手完成五项任务：

1. 把三张卡拆成七槽能力语法，并找出缺失或重复槽；
2. 用事件—打断—回应—结算—状态检查时间线执行一次嵌套效果；
3. 对同一触发点的强制/可选/替代效果确定排序者并逐条回放；
4. 运行一组有限组合和一组循环，识别终止资源、重复状态与退出责任；
5. 从真实座位读取关键词和图标，查规则后恢复到原窗口，再用大字/双编码/代读支持重做。

成功不是记住所有术语，而是陌生玩家无需设计师补话即可恢复触发点、责任人、顺序和状态；对无法确定的局面能定位查询条目。完整脚本见 `docs/product/USABILITY_TEST_CARD_LANGUAGE_EFFECT_RESOLUTION.md`。

## 来源矩阵

| # | 来源 | 层级 | 本轮用途 | 不能证明 |
|---|---|---|---|---|
| 1 | [Magic Comprehensive Rules, 2026-08-07](https://media.wizards.com/2026/downloads/MagicCompRules%2020260807.pdf) | 当前官方完整规则 | 优先权、堆叠、APNAP、状态动作、替代与循环 | 模型适合所有复杂度 |
| 2 | [Arkham Horror LCG Rules Reference](https://images-cdn.fantasyflightgames.com/filer_public/50/be/50bed4be-034c-4ed5-9ce6-8509ce8d3352/ahc60_rules_reference_eng-compressed.pdf) | 官方规则参考 | 能力类型、when/after、forced/reaction、then、limit 与启动序列 | 最佳术语或玩家理解率 |
| 3 | [Netrunner Comprehensive Rules v26.03](https://rules.nullsignal.games/) | 当前官方完整规则 | 费用：效果、指令/打断/checkpoint、同时效果与无限循环 | 完整优先权是通用方案 |
| 4 | [Marvel Champions Rules Reference 1.8 update](https://www.fantasyflightgames.com/en/news/2026/7/23/mission-updates/) | 官方规则团队说明 | 统一关键词/状态/能力语言与时序简化 | 改动独立提高理解或平衡 |
| 5 | [Law of Root, Oct 2025](https://cdn.shopify.com/s/files/1/0106/0162/7706/files/Root_Base_Law_Oct_2025.pdf) | 当前官方规则 | 规则优先、cannot、同时选择责任与不可任意打断 | 轻量模型适合所有卡牌游戏 |
| 6 | [Spirit Island Actions](https://spiritislandwiki.com/index.php?title=Actions) | 社群维护规则汇编 | action tree、嵌套/触发动作与自触发禁止 | 当前官方全文或唯一循环规则 |
| 7 | [Keyword to the Wise](https://magic.wizards.com/en/news/making-magic/keyword-wise-2003-05-19) | 设计师专栏 | 关键词作为规则速记与设计空间 | 关键词数量或因果效果 |
| 8 | [Keyword Play](https://magic.wizards.com/en/news/making-magic/keyword-play-2007-06-18) | 设计师专栏 | 共同词汇、一致性与预期 | 所有游戏应复制 Magic 体系 |
| 9 | [Common Knowledge](https://magic.wizards.com/en/news/making-magic/common-knowledge-2011-04-18) | 设计师专栏 | reminder text 与早期卡面模板 | 最佳提示文字比例 |
| 10 | [Three Principles of Card Design](https://danielsolisblog.blogspot.com/2024/02/three-principles-of-card-design.html) | 卡牌设计/美术指导实践 | 可见性、层级、简洁 | 三原则充分保证可用性 |
| 11 | [Daniel.games: Icons](https://daniel.games/icons/) | 设计师实践 | 图标门槛、微缩、相似图标失败与文字修饰 | 图标普遍优于文字 |
| 12 | [Daybreak designer diary](https://boardgamegeek.com/blog/1/blogpost/163737/designer-diary-daybreak) | 一手设计日志 | 单效果、大牌面与远座阅读取舍 | 单项改动独立效果 |
| 13 | [Challengers! designer diary](https://boardgamegeek.com/blog/1/blogpost/152306/designer-diary-challengers) | 一手设计日志 | 时点短语与删除混淆交互案例 | 问题发生率或关键词因果 |
| 14 | [Paleo FAQ / Clarifications](https://boardgamegeek.com/blog/10659/blogpost/126860/faq-clarifications) | 设计师维护 FAQ | 坏措辞、遗漏、版次与翻译澄清 | 所有 FAQ 问题来自卡文 |
| 15 | [Jason Begy 18xx Rules Template and Style Guide](https://www.jasonbegy.com/18xx-games.html) | 规则编辑实践 | 可复用规则模板、术语与技术写作 | 18xx 文体适合所有品类 |
| 16 | [dV Giochi: How to Write a Rulebook](https://www.dvgiochi.com/net/dv/dV-How_to_write_a_rulebook.pdf) | 出版方指南 | 规则组织、例子与术语一致性 | 一份模板保证规则可学 |
| 17 | [Unfair development glossary](https://www.unfair-game.com/dev-glossary) | 公开开发词表 | 项目术语、组件与编辑协作 | 词表适合直接复用 |
| 18 | [Towards a Unified Language for Card Game Design](https://ir.cwi.nl/pub/32967/32967.pdf) | 研究论文 | CardScript、状态/事件/动作、记录回放与模块化 | 已验证的新手创作界面 |
| 19 | [A Card Game Description Language](https://citeseerx.ist.psu.edu/document?doi=f6ce44ef8bc394abf2730131e6c9c7f9a9876852&repid=rep1&type=pdf) | 研究论文 | antecedent/consequent、阶段与 once | 语言覆盖现代复杂卡牌游戏 |
| 20 | [Learning Board Game Rules from an Instruction Manual](https://digital.lib.washington.edu/researchworks/items/80e44865-480d-420e-a196-f58acb93bbfe) | 硕士论文 | 自然语言规则抽取的歧义与 11% F-measure | 人类理解率或当前 NLP 上限 |
| 21 | [Automatic Generation of Board Game Manuals](https://arxiv.org/abs/2109.09507) | 研究论文 | 从形式规则生成更直观手册与示例 | 自动手册已解决教学问题 |
| 22 | [Magic: The Gathering is Turing Complete](https://arxiv.org/abs/1904.09828) | 计算理论论文 | 开放组合系统的通用求解边界 | 普通原型不可分析 |
| 23 | [Meeple Centred Design toolkit](https://d-nb.info/116389902X/34) | 无障碍启发式研究 | 视觉、认知、操作、协助与重复任务 | 单个玩家的适配结论 |
| 24 | [Sarah Reed: Visually Accessible Games](https://weirdgiraffegames.com/carla/2020/02/14/interview-with-sarah-reed-visually-accessible-games/) | 设计师家庭一手访谈 | 隐藏牌代读、图标、对比、开放信息和远座阅读 | 所有低视力/盲人玩家经验 |
| 25 | [Lost Ruins of Arnak accessibility teardown](https://www.meeplelikeus.co.uk/lost-ruins-of-arnak-2020-accessibility-teardown/) | 无障碍长评 | 信息密集秘密牌、小图标与文字嵌图成本 | 所有玩家或单项因果 |
| 26 | [Race for the Galaxy accessibility teardown](https://www.meeplelikeus.co.uk/race-for-the-galaxy-2007-accessibility-teardown/) | 无障碍长评 | 图标语言、学习与查询负担 | 图标系统普遍不可访问 |
| 27 | [Readability and Typography with Matt Paquette](https://colorblindgames.com/2026/03/22/readability-and-typography-with-matt-paquette/) | 无障碍作者/视觉设计师访谈 | 对比、背景、x-height、counter 与 tracking | 固定字号或字体排名 |
| 28 | [Marvel Champions repeated response discussion](https://www.reddit.com/r/marvelchampionslcg/comments/1en9ymx) | 玩家症状 | 同一触发、每次一次与重复响应误读 | 当前官方裁定或发生率 |
| 29 | [Spirit Island infinite loop discussion](https://www.reddit.com/r/spiritisland/comments/qyqh3d) | 玩家症状 | action tree、自触发与循环查询 | 规则设计的唯一修复 |
| 30 | [Text-based powers and reactive icons](https://www.reddit.com/r/BoardgameDesign/comments/1r7dhj7) | 设计社区症状 | 条件/反应能力难以图标化与查询深度 | 玩家总体偏好或最佳符号量 |

## 深读记录

- **Magic Comprehensive Rules 2026-08-07**：深读优先权、状态动作、触发能力、结算、替代/防止、shortcut 与 loop 条款；核对“所有人连续放弃才结算”“主动—非主动顺序”和强制无限循环判和。
- **Arkham Horror LCG Rules Reference**：深读能力类型、ability initiation sequence、when/after、forced/reaction、then、instead/would、limit/maximum、同时选择与 timing chart。
- **Netrunner Comprehensive Rules v26.03**：深读 paid ability、imminent event、interrupt、checkpoint、效果类型、同时效果与 mandatory/optional infinite loop；核对退出责任不是模糊的“双方同意”。
- **Towards a Unified Language for Card Game Design**：全文深读 4 页，核对布局、牌堆、动作、条件、阶段、事件/状态记录、what-if 与文本复杂度限制。
- **Sarah Reed 访谈**：阅读全文，核对隐藏牌代读、信息过载、简单大图标、对比、开放信息、远座阅读与小牌尺寸的取舍；保留个人/家庭语境。

## 方法与缺口

围绕五个问题分别使用“official comprehensive rules / timing / priority”“designer diary / keyword / card templating”“formal card language / rule extraction”“infinite loop / simultaneous trigger”“accessible card text / icons / low vision”等 2–3 组英文检索，并反查当前官方版本。30 个来源进入综合，5 个完成全文或主体深读；官方规则、创作者回顾、形式研究、无障碍证据、社区症状与项目推断分开书写。

当前缺口：缺少中文设计师公开的卡牌模板版本史与勘误日志；缺少中文新手对“当/在之后/然后/改为”的任务测试；缺少中国大陆低视力、盲人、阅读障碍和上肢操作玩家在隐藏手牌、规则查询与代读中的一手资料；缺少比较关键词数量、图标/文字双编码、卡文层级、远座距离和不同结算模型的对照研究。因此本报告不提供最佳关键词数、图标比例、触发窗口数、栈深、组合长度、循环次数、每牌效果数、卡文字数、字号、字距、对比阈值或 FAQ 数量。
