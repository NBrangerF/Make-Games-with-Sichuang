# 单人模式、Automa 与自动对手：研究报告 01

更新：2026-08-19  
状态：review；首轮检索、证据边界与产品转译完成

## 为什么这是独立问题

“一人也能运行”至少可能指五种不同设计工作：

1. 玩家解同一系统的纯单人挑战；
2. 玩家与自动对手竞争；
3. 玩家控制多手、多角色或多阵营；
4. 用计分门槛、场景或谜题替代人类对手；
5. 自动玩家在多人局中填补座位或缺席者。

这些结构保留的决策、信息、互动、维护劳动与随机性不同。自动对手能产生资源、占位或压力，不自动拥有人的意图、承诺、欺骗、谈判、学习和关系历史。因此不能只问“像不像真人”，而要先说它承担什么系统功能。

## 站内已有基础

- `self-play` 仅作为一种低成本测试方式，明确不能冒充外部玩家证据；这与面向玩家的单人模式不同。
- 测试方式选择器把单人自测用于运行、卡死和组件缺口，不评价正式单人体验。
- 战役状态专题引用 Charterstone Automa 作为缺席代班案例，并明确它只保存部分功能。
- 主题伤害复核已有“谁/什么被自动化、资源化或省略”，可用于检查自动对手在表达层承担的角色。
- 资源库目前没有独立的单人桌游设计、Automa 规则、solo 玩家研究或官方设计日志集合。

## 首轮研究问题

1. 玩家为什么选择单人桌游；研究怎样区分独处、挑战、控制、叙事、放松与社交替代？
2. 纯单人目标、计分门槛、模拟对手、多手控制和座位填充各自保留什么？
3. 自动对手如何选择行动、定位目标、处理信息和改变难度，而不需要玩家替它做高判断负担的决定？
4. “维护机器人”何时压过玩家自己的决策？
5. 自动对手的可预测性、随机性、可学性与主题可信度怎样测试？
6. 单人模式与多人模式共享规则到什么程度；差异何时应被视为独立版本？
7. 单人玩家的无障碍、设置、桌面空间、规则查询和保存/暂停有什么不同？
8. 自动对手能否用于设计测试；它能证明哪些系统性质，不能证明哪些人类体验？

## 候选最小记录

- `solo_mode_promise`
- `human_decisions_preserved`
- `automated_functions`
- `interaction_removed_or_transformed`
- `information_model`
- `bot_upkeep_actions`
- `bot_targeting_and_tie_breaks`
- `difficulty_input`
- `failure_or_completion_condition`
- `setup_reset_and_pause_cost`
- `multiplayer_difference`
- `human_validation_needed`

## 明确不做

- 不把单人模式称为多人体验的低配版或必备勾选项。
- 不用“击败某个分数”自动代表平衡、策略深度或真人竞争。
- 不把机器人行动复杂度、规则页数或难度等级数量当质量分。
- 不让设计者自测、AI 对局或 Automa 对局替代目标玩家观察。
- 不假定高随机性更像真人，也不假定完全确定更公平。
- 没有证据前不新增正式 Automa 生成器或评分工具。

## 证据组合

本轮纳入 12 项材料，刻意不让某一种来源单独决定结论：

- 2 项玩家动机研究：Leorke 对 BGG 1 Player Guild 帖子的探索性编码；Nougher 对 220 名 BGG 单人玩家的问卷和一次研究者 Scythe 游玩报告。
- 1 项研究型创作硕士论文：Chola 以 Root 自动玩家进行三轮研究—设计迭代。
- 1 份官方方法声明：Automa Factory 的六项 Automa Approach 原则。
- 6 篇设计师或发行方过程记录：Mike Mullins、Nigel Buckle / Dávid Turczi、Stamp Swap、Wyrmspan、Origin Story、Chroma Mix。
- 1 篇专业设计师访谈：Morten Monrad Pedersen 讨论互动点、简化与外部测试。
- 1 篇玩家长评：从玩家侧描述复杂 bot 的规则记忆与维护负担。

这些材料能支持建立问题清单和测试协议，不能生成“最佳 bot 复杂度”“标准胜率”“必须包含几个难度”等行业常数。

## 主要发现

### 1. “为什么单人玩”不是一个单一需求

Leorke 从 1 Player Guild 的帖子归纳出社会、类型和游玩方式三组动机：缺少同伴只是其中一部分；玩家也会为了沉浸、自己的节奏、减少干扰、解谜、学规则或补充多人游玩而选择单人。Nougher 的便利样本进一步显示，部分参与者重视多人知识迁移，部分重视单人体验本身；在 63 名偏好单人版本的参与者中，57% 提到放松。后一个数字只描述该研究中的特定子样本，不能外推为“57% 单人玩家”。

产品转译：先写 `solo_mode_promise`。至少区分：

1. 多人规则练习与策略迁移；
2. 独立的单人挑战或沉浸体验；
3. 无人可约时的对手替代；
4. 多人局的座位或缺席填补。

这些承诺可以并存，但必须分别验证。单人模式与多人规则越不同，迁移价值越需要单独检查；越追求多人感，维护负担与“玩家替 bot 做决定”的风险越高。

### 2. 保留玩家面对的决定，不等于复制对手全部内部状态

Automa Factory 明确要求模拟重要互动、保留胜负条件与玩家决定，同时删去不会直接影响人的对手内部状态。Mullins 的流程也先找多人体验的“crux”，再问哪些部分可删除或随机化。Imperium 的设计日志把玩家为何在意对手、能读到什么信号、哪些内部状态不必保留列成问题，再以图标和行为表实现。

产品转译：建立“互动接口表”，每项多人互动写成玩家可感知的功能，例如：

- 占用行动位；
- 改变公开市场；
- 推进结束计时；
- 施加直接攻击或长期状态；
- 产生可读意图与反制窗口；
- 提供分数或胜负比较。

只有影响目标承诺的接口需要自动化。资源、手牌、引擎或完整行动经济若不改变玩家的决定，可以抽象；不能因为“真人有这块板”就要求 bot 也有。

### 3. dummy、自动对手、计分与场景是不同的功能方案

Mullins 区分 dummy 与更复杂的人工对手：前者通常只替代间接互动，如拿走资源、限制选项或提供时钟；后者增加行为判断与策略表现。Stamp Swap 的开发过程更进一步：最终模式改变了部分多人规则，因此团队没有把它称为 Automa。Chroma Mix 则用“玩家故意替对手做坏选择”解决组件预算问题，这是单个项目的实验方案，不是可直接移植的定律。

产品转译：结构选择应在互动接口与生产限制之后，而不是先决定“我要做一副 Automa 牌”。候选结构包括：

- 删除不必要互动；
- 改变设置或供给；
- 计分、场景、目标或损失条件；
- 无胜负 dummy；
- 有胜负自动对手；
- 多手、多角色或多阵营控制。

名称也应诚实说明玩家要运行什么；“AI”或“Automa”不是质量印章。

### 4. 机器人维护是玩家体验的一部分，不是幕后成本

Automa Factory 把精简列为原则；Stamp Swap 的记录描述了规则来回查询造成的负担，后来把变更集中到独立单人规则中。玩家长评也把需要记忆大量例外、间隔一段时间后难以重启列为不推荐购买单人模式的原因。Chola 的第三轮迭代则出现了明确反例：更动态、更“理性”的 agent 加重了任务和流程，以至熟悉 Root 与既有 bot 的测试者仍觉得繁琐。

产品转译：测试时按一次 bot 回合记录：

- 翻取或掷骰；
- 查表或跳转；
- 目标选择；
- 平手判定；
- 移动和资源维护；
- 记忆持续效果；
- 错误发现与恢复。

这些是动作和查询，不要压成一个“复杂度分”。同一负担对熟练者、首次玩家、疲劳玩家和较长中断后的回归者可能完全不同。

### 5. 信息模型决定玩家是在推理、赌博还是执行脚本

Imperium 让新获得的 bot 牌进入可预期位置，并让文明状态改变行为；Origin Story 的设计日志指出，隐藏的 trick-taking 手牌若完全随机会丢失推断，最终选择可见 bot 手牌，让玩家能看到某花色不会凭空出现。这个方案增加策略与谜题感，同时牺牲部分多人中的猜测和心理战。

产品转译：为 bot 明确写：

- 玩家在行动前能看到什么；
- 哪些信息是稳定信号，哪些是随机扰动；
- 目标与平手规则是否可从桌面推出；
- 玩家能否利用固定循环；
- 利用是学习后的反制、可接受谜题，还是破坏承诺的漏洞。

透明不是天然容易，随机也不是天然像人。两者都要回到单人承诺和可反制性。

### 6. 难度不能只看终局胜负

设计日志常用额外资源、行为牌、条件改变或难度档位，但没有资料支持跨游戏通用的目标胜率。Imperium 的测试发现玩家可用特定策略让 bot 无法适应，于是修改结束条件；这说明需要找“单一利用即可失去挑战”的路径。Chola 的极端动态难度实验又显示，增加适应性可能同时增加维护劳动。

产品转译：每次难度变化要写明改变了什么输入：资源、行动效率、信息、随机性、惩罚、时间、目标或规则例外。测试除输赢外还要观察：

- 玩家是否仍有多个有意义候选；
- 是否理解为何局面改变；
- 是否能形成并修正模型；
- bot 是否卡死、循环或需要临场裁决；
- 难度是否只靠增加维护与例外；
- 不同策略是否被不成比例地删除。

### 7. 自测机器人与面向玩家的单人模式必须分开

Imperium 的早期 BOT 是设计者反复测试非对称牌组的内部工具，后来才被重新设计为完整单人体验。这正好支持本站既有边界：设计者多手自测或自动运行可找卡死、循环与组件问题，但不能证明新玩家能独立执行、享受体验或认为对手可信。

产品转译：任何正式单人模式都要安排至少三类测试：

1. 设计者诊断：运行、边界、循环、显著利用；
2. 熟练单人玩家：策略、可学性、长期维护与模式比较；
3. 新玩家盲测：设置、规则查询、目标选择、错误恢复与暂停后恢复。

这里的“三类”是角色区分，不是固定样本量。

## 证据边界

- Leorke 分析的是自选 BGG 帖子，适合发现动机类别，不代表总体比例。
- Nougher 的 220 人样本来自 BGG 1 Player Guild，研究在疫情期间进行，且问卷中的“score sheet”曾被参与者不同理解；作者本人把这些列为限制。
- Chola 是以 Root 为材料的研究型创作硕士论文；少量测试与特定 agent 迭代可产生设计命题，不足以验证所有桌游。
- Automa Factory、Stonemaier、Osprey、Cardboard Edison 与个人设计日志来自设计者或销售相关方，实践价值高，但包含商业与作品语境。
- 玩家长评提供真实维护体验，不是代表性用户研究。
- 本轮英文资料占绝大多数；中文单人玩家、中文规则翻译、不同桌游消费情境与无障碍需求仍是缺口。

## 产品决定

1. 新增资源入口“设计单人模式、Automa 与自动对手”。
2. 新增专项指南“先写单人承诺，再决定是否造机器人”。
3. 新增术语：单人模式承诺、互动接口、dummy 玩家、自动对手、bot 维护、bot 信息模型。
4. 新增主张：承诺先于结构、保留决定不等于复制状态、维护是玩家成本、透明度是可测试变量、自测 bot 不等于正式模式、难度应记录输入。
5. 暂不新增 Automa 生成器、质量评分或推荐胜率；先用现有测试计划、决策追踪、盲测和反馈工具承载。

## 来源清单

- Dale Leorke, [Solo Board Gaming: An Analysis of Player Motivations](https://analoggamestudies.org/2018/12/solo-board-gaming-an-analysis-of-player-motivations/), 2018.
- Liam Nougher, [If Only I Had Someone to Play With: Sociality in Single Player Board Games](https://press-start.gla.ac.uk/press-start/article/view/301), 2024.
- Saili Chola, [A Happier Life Through Sad Mode — Designing Automated Players for Single Player Games](https://wiredspace.wits.ac.za/items/a87857a3-e4f8-4507-a4dc-109d32a6cbf4), 2023.
- Automa Factory, [The Automa Approach](https://automafactory.com/about/).
- Mike Mullins, [The Basic Elements of Solo Variant Design](https://cardboardedison.com/blog/guest-post-the-basic-elements-of-solo-variant-design), 2016.
- Nigel Buckle, [Imperium Blog — Solo Modes](https://www.ospreypublishing.com/ca/osprey-blog/2021/imperium-blog-solo-modes/), 2021.
- Automa Factory / Stonemaier Games, [Stamp Swap Design Diary](https://stonemaiergames.com/games/stamp-swap/design-diary/).
- Automa Factory / Stonemaier Games, [Wyrmspan Design Diary](https://stonemaiergames.com/games/wyrmspan/design-diary/).
- Automa Factory / Stonemaier Games, [Origin Story Design Diary](https://stonemaiergames.com/games/origin-story/design-diary/).
- Jorge Zhang, [A Weird Approach to a Solo Mode](https://www.jorgezhang.com/2023/5/solo/index.html), 2023.
- Morten Monrad Pedersen, [Q&A with Morten Monrad Pedersen](https://zatu.com/blogs/interviews/qa-with-morten-monrad-pedersen), 2025.
- BoardGameShots, [Galactic Cruise Board Game Review](https://boardgameshots.com/2025/06/03/galactic-cruise-board-game-review/), 2025.

## 后续研究

- 定向征集中文单人玩家：偏好、设置与收纳、规则切换、暂停恢复、独自处理主题伤害与内容提示。
- 比较完整官方规则书，而非只读设计日志；记录目标选择、平手、卡死、重置和错误恢复的具体表达。
- 用真实新手测试专项指南，先验证“单人承诺”和“互动接口”是否比 Automa 术语更易懂。
- 若指南反复暴露信息模型或维护记录困难，再评估是否需要独立工具。
