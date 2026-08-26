# 空间、距离、邻接与地图结构：研究记录 01

更新：2026-08-20  
状态：review；资源、主张、术语、指南、模板与入口已落盘，待中文用户测试

## 为什么要单独研究这一层

站内已经有玩家人数配置、互动拓扑、历史抽象、实体交互和地图密度的零散材料，但新手仍容易把地图设计误缩成三个问题：地图画多大、用方格还是六角格、怎样画得像真实世界。实际原型中的空间至少同时控制：

- 哪些位置存在、哪些状态附着在位置上；
- 哪些操作认定两个位置相邻；
- 玩家用多少行动、资源、时间、权限或风险跨过关系；
- 位置能容纳什么、占满后怎样封锁或共存；
- 目标和奖励怎样把玩家引向相遇、分离、绕行或重复路线；
- 人数、单位数、行动范围和占用时间怎样改变有效密度；
- 地理和美术线索是否支持规则，还是暗示不存在的移动；
- 围桌后的方向、视距、触达、传递、遮挡和保密是否让不同座位面对不同游戏。

因此本专项不排名地图形式，而是把地图还原成一份可测试的空间关系契约。

## 站内基础与去重边界

- `interaction-topology` 已描述谁能影响谁；本专项只深入这种关系如何由地点、边、距离和容量产生。
- `special-player-count-configuration` 已要求比较地图/市场密度；本专项补足“密度由目标、范围、占用和时间共同形成”。
- `historical-abstraction` 已处理历史删选与视角；本专项只处理地理准确、规则可读与行动空间可能分离。
- `special-embodied-time-window` 与无障碍专题已处理身体—时间任务；本专项把真实座位、桌面区域和地图读取作为空间接口。
- `special-turn-structure-contract` 已处理行动粒度和等待；本专项只记录移动成本、位置作用和空间导致的监看/恢复。
- `claim-prototype-fidelity-follows-question` 已说明原型精度随问题变化；本专项不要求早期原型拥有最终美术，但邻接、容量或远座读取一旦成为问题，就必须实体化相关部分。

## 研究拆分

本轮拆成五个可独立核验的子问题：

1. 一张游戏地图究竟承载哪些状态、权限、信息、叙事与实体摆放功能？
2. 邻接、距离、边权、方向、容量、中心、角落、瓶颈和回环怎样改变合法行动？
3. 地点与路线怎样结合目标、奖励、人数、行动范围和占用时间形成实际互动密度？
4. 现实/历史地理、模块拼接和图形线索怎样支持或干扰空间规则？
5. 抽象拓扑与真实桌面如何分轨测试，避免数字缩放或设计稿视图掩盖远座、触达和遮挡问题？

检索顺序为：站内既有内容 → 桌游设计师理论与一手日志 → 官方规则和商业项目案例 → 玩家分析/社区症状 → 实体桌面与无障碍研究。设计师文章保留作者偏好；商业日志只支持项目内机制—体验链；官方规则证明产品怎样声明而不证明效果；玩家材料只生成候选症状；HCI 研究用于扩大真实桌面观察维度，不提供桌游尺寸标准。

## 明确不做

- 不提供通用最佳棋盘尺寸、格数、地点数、路线数、平均度数、直径或瓶颈比例；
- 不排名方格、六角格、区域、点对点、无格测距、模块板或卡牌地图；
- 不把连通、对称、中心性高或路线多自动解释为平衡、深度或乐趣；
- 不把地图缩小写成提高互动的通用修复；
- 不把随机/模块地图自动解释为更可重玩；
- 不把历史地理准确等同历史体验或伦理充分；
- 不把 TTS 缩放、旋转和自动堆叠当实体桌面证据；
- 不从一名玩家、记者现场或社区投票估计总体可读性和偏好；
- 不做自动地图平衡分、最佳路线生成器、历史精度评分或人数缩放公式。

## 来源矩阵

| 来源 | 类型 | 本轮使用 | 不能推出 |
|---|---|---|---|
| [Cole Wehrle, *Oath: A Map That Remembers*](https://ledergames.com/blogs/news/oath-designer-diary-4-a-map-that-remembers) | 商业桌游一手日志 | 先问地图承载什么；中心—边缘相对距离、地点卡容量、重心迁移与跨局保存 | 区域模型优于网格；Oath 数值和存储结构可移植 |
| [Bruno Faidutti, *The Map and The Territory*](https://faidutti.com/blog/blog/2012/12/11/la-carte-et-le-territoire-the-map-and-the-territory/) | 设计师地图随笔 | 区域拼图、网格、点线网络和游戏中生成地图的行动差异 | 完整分类；六角格或历史风格的普遍质量 |
| [Marc Rodrigue, *From Bellin's Map to B&T's Game Board*](https://insidegmt.com/bt-biweekly-issue-5-from-bellins-map-to-bts-game-board-how-i-use-cartography-in-game-design/) | 历史兵棋一手日志 | 无规则作用的水路颜色诱发错误移动；视觉比例、相对位置和摆放空间分离 | 历史点对点兵棋处理适合所有地图；单项改动因果 |
| [Brandon Rollins, *Birth of Byways*](https://brandonthegamedev.com/birth-of-byways-peek-into-my-early-board-game-development-process/) | 个人项目设计日志 | 先验证连通、卡死、路线类别与过密节点，再进入目标和互动 | 连通即好玩；自测能替代真人任务 |
| [Daniel Piechnick, *Scaling*](https://daniel.games/scaling/) | 设计师短文 | 低人数地图可能过大；人数变化同时影响资源和合作目标 | 任何地图增删公式或阈值 |
| [Dan Scott, *Ticket to Ride's Adjacency Matrix*](https://danbscott.ghost.io/ticket-to-rides-adjacency-matrix/) | 玩家图论分析 | 邻接矩阵、度数、半径、直径和候选瓶颈作为描述 | 静态指标等于策略、平衡或趣味；忽略边权/人数仍能下结论 |
| [Matthew Hutson, *The Personal, Political Art of Board-Game Design*](https://www.newyorker.com/culture/annals-of-inquiry/the-personal-political-art-of-board-game-design) | 记者现场测试与设计师引语 | 三人地图过大、接触稀少；缩图与高价值位置共同改变路线 | 一次多变量测试建立密度或激励因果 |
| [*Spirit Island* rulebook: Thematic Map](https://gamers-hq.de/media/pdf/de/e2/8e/Spirit_island_Rulebook.pdf) | 官方规则 | 平衡面与主题面的地形聚类、扫视、难度和人数拼接声明 | 产品声明独立证明平衡、主题或可读性 |
| [*Jagged Earth* alternate island layouts](https://spirit-island-jagged-earth.backerkit.com/hosted_preorders/project_updates?page=10) | 商业扩展开发日志 | 紧凑/拉长、多中心、角落与瓶颈改变覆盖和支援 | 模块拼法的通用难度公式 |
| [*Dinosaur World* designer diary](https://boardgamegeek.com/blog/1/blogpost/108734/designer-diary-dinosaur-world-or-life-uh-finds-a-w) | 商业桌游一手日志 | 邻接组合、重复高价值路线与递减激活候选 | 所有重复路线都需衰减；最佳邻接奖励 |
| [*Fateforge* map exploration diary](https://boardgamegeek.com/blog/1/blogpost/171531/designer-diary-fateforge-chronicles-of-kaan-or-bac) | 商业桌游一手日志 | 以实体找地标、导航与熟悉城市替代部分文字描述 | 地图普遍减少文字或提高沉浸 |
| [Scott, Carpendale & Inkpen, *Territoriality in Collaborative Tabletop Workspaces*](https://cspages.ucalgary.ca/~sheelagh/wiki/uploads/Main/Publications/scott_cscw2004.pdf) | 自然观察与三组实验 | 个人、群组、储存区；取、传、保留、监看与桌面位置 | 协作任务样本规定竞争桌游座位、尺寸或所有权 |
| [Tara Whalen, *Playing Well with Others*](https://uist.acm.org/archive/adjunct/2003/pdf/posters/p4-whalen.pdf) | 数字桌面海报短文 | 多座位观看方向、视线、触达和共享/私人区作为观察维度 | 两页短文构成现代桌游无障碍标准 |
| [Kosa & Yilmaz, *The Design Process of a Board Game for Exploring the Territories of the United States*](https://scispace.com/pdf/the-design-process-of-a-board-game-for-exploring-the-5eaya6v566.pdf) | 12 人教育原型质性迭代 | 领土数、邻接、距离和对称；角落卡死、定位与信息过载 | 学习改善、平衡或地图质量已得到定量证明 |
| [Reddit, *Designing Interesting Board Game Maps*](https://www.reddit.com/r/BoardgameDesign/comments/104q0bq) | 非代表性设计社区 | 中心、边缘、瓶颈、替代路线、回环和激励的竞争假设 | 某拓扑更有趣或社区偏好比例 |
| [Reddit, *Experience Ruined by Game's Table Space*](https://www.reddit.com/r/boardgames/comments/1sktdpw/experience_ruined_by_games_table_space_does_this/) | 非代表性玩家讨论 | 远座读卡、传递、站立、保密、代理操作和忽略远端选项 | 发生率；单一桌型/视力/版本代表目标玩家 |
| `gamesprecipice-player-count-scalability` | 既有人数缩放实践综述 | 地图区域是缩放维度候选 | 最佳人数或地图比例 |
| `amritsar-player-count-diary` | 既有商业一手日志 | 人数改变区域完成度与局外触发；功能性第三方修补 | 跨游戏的非线性公式 |
| `root-hirelings-player-count-diary` | 既有商业一手日志 | 两人生态过空、第三方缺失和击倒风险 | 第三方单位普遍自平衡 |
| `goodman-multiplayer-game-spaces` | 既有计算游戏空间研究 | 人数效应不跨游戏一致，需按具体特征和配置比较 | 人类社交、乐趣、身体空间或最佳人数 |
| `mcd-heuristic-toolkit-paper` | 既有桌游无障碍启发式论文 | 视觉、身体、认知和代理操作需绑定任务与交叉条件 | 启发式替代残障玩家测试或生成总分 |
| `rubio-history-50-years` | 既有历史桌游分析 | 地图抽象和可玩视角具有政治/历史选择 | 单项地理精确度决定伦理充分 |

## 第一轮发现

### 1. 地图首先是规则空间，其次才是世界图像

最低记录：

```text
spatial_promise
locations_or_regions
state_attached_to_place
operation_specific_connections
distance_and_cost
capacity_and_occupancy
visibility_or_information
ownership_and_change
physical_layout_function
```

Faidutti 的案例把区域拼图、规则网格、点线网络和游戏中生成地图放在同一问题下：玩家会在这张表面上移动、交易、建路和争夺。`Oath` 日志更直接展示了设计转折——地图不是先画世界，再把规则贴上去；作者先追问地图要保存相对距离、发展、卡牌和跨局历史中的哪一部分，最终甚至把二维心理地理压成可堆叠的一维卡牌序列。

因此“像地图”不能证明它承担了游戏功能。相反，一张没有地图美术的节点—边图，只要清楚表达合法操作，已经足够验证许多核心空间问题。

### 2. 邻接必须按操作定义，距离必须按规则恢复

同一对地点可能：可支援但不可移动、可攻击但不传播、河流相隔却由航线连接、角接但规则不算相邻。最低不要只写“相邻地点”，而应写：

```text
operation
from / to
connection_type
direction
cost_or_weight
temporary_modifier
block_or_capacity
how_player_recovers_relation
```

视觉距离和规则距离也应分开。`Oath` 用中心—边缘区域让同区位置具有相同旅行类别；B&T 则弯曲视觉比例以给关键走廊放置单位，同时保留相对位置和整体距离。两者方向不同，却共同说明纸面厘米不是行动成本。

### 3. 图论指标是描述词，不是地图评分

邻接矩阵可暴露孤立、低连接节点、中心、半径、直径和候选瓶颈。Dan Scott 的 Ticket to Ride 分析也主动承认没有计入路线长度，策略推断尚未实测。本站因此只把指标用于窄问题：

```text
connectivity: 是否存在不可达或单点断裂
degree: 哪些地点拥有多少直接连接
path distance: 当前规则下两点的最小成本
diameter/radius: 网络跨度和候选中心
bottleneck: 限制后会显著减少哪些路径
```

指标必须再与边权、目标票、资源、路线占用、人数和时机相连。高度节点可能安全、拥挤、昂贵或根本无价值；瓶颈可能创造谈判，也可能让先手锁死。结构不是价值判断。

### 4. 地图密度由人数、激励、范围和时间共同形成

“12 格 / 3 人 = 每人 4 格”没有解释力。最低同时记录：

```text
player_count_configuration
units_or_presence
effective_locations
movement_or_effect_range
target_and_reward_distribution
occupancy_duration
response_window
observed_contact_or_avoidance
```

New Yorker 现场案例中，三人原型地图过大导致玩家很少相遇；第二次测试同时缩小地图并加入重要位置，玩家才围绕目标形成路线。这个案例不能隔离“缩图”的因果，反而说明激励设计是密度的一部分。

人数缩放同理。Amritsar 和 Root 日志都说明低人数问题可能不是空格数量，而是第三方触发、区域完成度、地图生态与击倒路径改变。每个增删地点、dummy 或中立单位都要写要恢复的具体功能。

### 5. 地点容量同时是互动规则和实体接口

容量至少有两层：

```text
logical_capacity   规则允许多少单位/卡牌/建筑/玩家共存
physical_capacity  当前位置能否清楚放下、读取、拿取和维护这些状态
```

逻辑容量影响封锁、拥挤、共存和争夺；实体容量影响遮挡、堆叠错误、所有权读取和桌面蔓延。`Oath` 在选地图结构时明确考虑地点要承载卡牌；B&T 则为了关键走廊的单位摆放弯曲地图。容量不应等到美术完成或组件挤不下才成为问题。

### 6. 模块布局改变拓扑，不只是换皮和可重玩性

Spirit Island 的开发材料对比紧凑、拉长、星形和双中心布局：地点数不变，跨板支援、内陆安全区、角落风险和中心瓶颈仍会改变。模块地图最低要写：

```text
must_preserve: 连通、起点距离、目标可达、最低支援路径……
may_vary: 中心数量、边缘长度、地形聚类、路线冗余……
invalid_layout: 不可达、无解、座位锁死、信息不可读……
```

随机拼接只增加变化量；它不自动产生有意义的不同决定，也不自动平衡。

### 7. 地理准确、规则准确和体验视角可能分离

B&T 的蓝色水路在历史和制图上合理，却诱使玩家执行规则不允许的移动；删去无规则作用的地貌反而改善操作。该项目又有意采用时代地图的有限知识与不精确，试图让玩家面对特定历史视角。

这支持三个分轨问题：

```text
geographic_fidelity  与现实地点、距离、地形对应到什么程度
rule_legibility      玩家能否从图形恢复合法行动和状态
perspective_fidelity 地图让玩家看见、忽略和控制什么历史/主题关系
```

三者可以一致，也可能冲突。删、压缩、弯曲或重心迁移都要公开理由和损失，不应以“真实地图”终止讨论。

### 8. 真实桌面会重写抽象空间的可用性

Scott 等观察到围桌协作自然形成个人、群组和储存区域；远处物品常需请求传递，中央群组区更易被共同监看。Reddit 讨论中的玩家则描述了远座无法读公共卡、必须传递、站立、暴露隐藏信息、让邻座代理操作或干脆忽略远端选项，也有人在相同作品上报告没有困难。

相反陈述恰好说明不能从单张俯视图下结论。地图任务应绑定：

```text
seat / table / lighting / player_support
locate target
recover adjacency
compare route cost
read occupancy and ownership
reach or request operation
restore component and secrecy
update after state change
```

数字平台的缩放、旋转、复制视图和自动堆叠可能隐藏这些摩擦。线上原型仍有价值，但只能回答媒介实际保留的问题。

## 候选最小记录

```text
version / player_count_configuration / seat / experience
target_spatial_promise / unacceptable_result
location / state / reward / occupancy_duration
operation / adjacency / direction / edge_weight / block
path_distance / alternative_route / bottleneck
logical_capacity / physical_capacity / overflow
effective_density / contact / avoidance / lockout
cartographic_cue / rule_function / common_misread
view_distance / orientation / reach / transfer / concealment
observed_action / player_interpretation / recovery
one_change / predicted_gain / predicted_loss / counterevidence
```

## 候选产品方向

专题指南：`special-spatial-relationship-contract` / “别先画世界地图，先写每条空间关系在做什么”。

候选五步：

1. 写目标空间体验和地图承担的功能；
2. 去美术画节点、连接、规则距离和逻辑/实体容量；
3. 把地点与激励、人数、行动范围和时间连起来；
4. 叠加地理、图形和真实桌面座位任务；
5. 只改一项连接、边权、目标、容量、布局或图形线索，预先写反驳信号。

可复用：`decision-trace`、`test-plan`、`feedback`、`playtest-selector`、`balance-pass`、`accessibility-observation`、`redesign`。不新增地图评分器或路线自动生成器。

## 证据边界与下一步

- Oath、B&T、Byways、Spirit Island、Dinosaur World 与 Fateforge 都是项目特定日志或官方材料，多项变量并行；
- Faidutti 与 Daniel 是设计师理论/偏好，不是效果研究；
- Dan Scott 的图论分析没有纳入边权、目标、人数和真人测试，不能转成质量指标；
- New Yorker 只有一次记者参与的非正式原型测试且同时缩图、加目标和改移动；
- Kosa/Yilmaz 只有 12 名参与者、两人教育原型和主观/质性结论；作者明确承认学习和平衡缺乏定量证据；
- Scott 等的任务以协作拼图和布局为主，样本小且研究目标是数字桌面设计；
- Whalen 是两页海报短文；
- Reddit 是自选讨论，同一作品出现相反体验，不能估计发生率；
- 本轮仍缺中文桌游设计师公开的完整地图重构日志，现有中文第一人称材料不足；
- 下一步应以真实中文原型、至少两个相反座位和主要人数执行任务式测试，再决定字段是否过重；
- 浏览器、375px、键盘、触控和屏幕阅读器验证仍受既有环境阻塞，本轮不能声称通过。

## 本轮落盘

- 16 条新资源及一一对应的审阅记录；
- 10 条带反例 Claim；
- 11 个规范术语；
- 第 22 篇专题指南；
- 第 17 个任务型阅读入口；
- 空间关系一页模板、中文新手任务脚本与交接文档。
