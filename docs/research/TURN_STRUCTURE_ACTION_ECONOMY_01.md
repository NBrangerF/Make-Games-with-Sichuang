# 回合结构、行动经济与等待：研究记录 01

更新：2026-08-20  
状态：review；资源、主张、术语、指南、模板与入口已落盘，待中文用户测试

## 为什么要单独研究这一层

站内已经讨论人数配置、局长与终局、实时/同步操作、实体交互和玩家评论中的停机时间，但新手仍缺一条连续路径来回答：

- 游戏、轮、阶段、回合、行动和反应窗口分别在分配什么；
- “每回合两个行动”为什么仍可能产生完全不同的选择压力、节奏与先后手优势；
- 缩短单个回合是否真的减少等待，还是只增加交接、重读和重新规划；
- 同步行动何时能并行决定，何时会把冲突、锁定、泄密和错误恢复转移到别处；
- 维护、结算和查表何时是纯劳动，何时又承担共同注意、教学、表演或社交功能；
- 先手、后手、主动权与反应权怎样改变信息、机会和节奏，而不只是给一个座位补资源；
- 应该怎样在测试里同时记录实际秒数、决定何时开始、预案能否存活，以及玩家等待时在做什么。

这不是“回合越短越好”或“同步行动更现代”的规范，而是把时间、决定权、信息、打断、维护和共同注意放进同一张可测试结构图。

## 站内基础与去重边界

- `claim-downtime-includes-state-volatility` 已指出等待不仅是他人回合秒数，共享状态变化会让预案失效；本专项把它扩成可记录的等待分解。
- `claim-simultaneous-play-is-structural-refactor` 已说明同步行动会改写锁定、冲突、信息和组件提示；本专项不重复证明“同步会更快”。
- `special-player-count-configuration` 已按人数记录自己回合、局外触发、公共阶段和同时动作；本专项深入单一配置内部的时间与权限。
- `special-ending-contract` 已处理最后一轮、等回合和最后行动确定性；本专项只讨论贯穿全局的先后、主动权和交接。
- `special-embodied-digital-evidence` 已处理实时、同步沟通和身体/材料条件；本专项不会把实体操作秒数当纯界面噪声。
- `special-scoring-contract` 已处理得分与激励；本专项只把行动槽、时机和机会成本视为行动经济，不重新做计分平衡。

## 研究拆分

本轮把问题拆成五个可独立核验的子问题：

1. 回合层级怎样分配当前可行动者、可见信息、决定权、打断权与结算责任？
2. 行动经济除了行动数量，还包含哪些可用性、成本、顺序、机会成本、自由动作和维护负担？
3. 等待应怎样分成钟表等待、决定延迟、预案失效、强制监看、交接与恢复？
4. 同步、实时、交错行动和反应窗口分别解决什么，又把哪些协调成本转移到别处？
5. 先后手与主动权如何影响机会、信息、节奏和最后行动，并应怎样分轨测试？

检索顺序为：站内既有材料 → 桌游设计师实践 → 商业项目一手设计日志 → 玩家长评/社区症状 → 桌面互动和会话研究。设计师文章保留作者偏好；商业日志只支持项目内机制—体验链；玩家材料只生成候选症状；数字桌面与会话研究用于扩大观察维度，不直接推出实体桌游配方。

## 明确不做

- 不提供通用最佳回合秒数、每轮行动数、阶段数、反应次数或先手补偿值；
- 不把游戏—轮—阶段—回合—行动规定成唯一命名层级；
- 不把短回合、交错回合、同步选择、实时操作或自由行动排序为高低级；
- 不把所有等待当无聊，也不把聊天、观看和规则协作自动算作参与；
- 不用“同时行动后局长减半”的单一项目结果预测其他游戏；
- 不把固定行动点当行动经济的完整定义；
- 不因玩家能在他人回合反应就宣称互动更强；
- 不以平均回合时长替代尾部超长回合、预案失效、重新扫描或错误恢复；
- 不做自动先手补偿计算器、最佳行动点求解器或分析瘫痪玩家评分。

## 来源矩阵

| 来源 | 类型 | 本轮使用 | 不能推出 |
|---|---|---|---|
| [Daniel Piechnick, *Turn Structure*](https://daniel.games/turn-structure/) | 桌游设计师实践文 | 单一 consequential action、选择集中、维护合并和忘记步骤作为删减候选 | 每回合只能一个决定；阶段与轮天然有害 |
| [Orin Bishop, *Game Design Concepts*](https://dspacemainprd01.lib.uwaterloo.ca/server/api/core/bitstreams/de73cdfc-77ed-4fff-9fb1-c2b2bf601fa4/content) | 2009 本科学位论文 | 短回合的交接摩擦、长回合的状态波动、回合前公开信息与重新规划循环 | 作者建议是受控体验实验；示例等于通用阈值 |
| [Engelstein & Shalev, *Turn Order and Structure*](https://www.taylorfrancis.com/chapters/mono/10.1201/9780429430701-2/turn-order-structure-geoffrey-engelstein-isaac-shalev) | 桌游机制百科章节 | 回合层级、阶段位置、pass order、实时与同时选择是不同结构家族 | 章节摘要是效果比较；分类穷尽所有结构 |
| [Scott Rogers, *Game > Round > Phase > Turn > Action*](https://mrbossdesign.blogspot.com/2019/09/game-round-turn-phase-action.html) | 设计师术语实践 | 命名层级服务于玩家和作者理解，不应脱离具体循环 | 该层级是行业标准；phase 必然位于 turn 内或外 |
| [Duck Sauce Games, *How to Design a Card Game*](https://www.ducksauce.games/blog/how-to-design-a-card-game) | 卡牌设计实践文 | 反应窗口、堆叠、短回合与轮内多次交替怎样改变学习和节奏 | 无反应普遍更好；数字卡牌例可直接移植所有桌游 |
| [Cole Wehrle, *Oath Designer Diary 9*](https://ledergames.com/blogs/news/oath-designer-diary-9-the-long-march-to-oaths-combat-system) | 商业桌游一手日志 | 行动粒度不足以承载后期多地点战役时，增加行动可能不如重定义一次行动的规模 | campaign action 是其他战争游戏的正确答案 |
| [Cole Wehrle, *Arcs Designer Diary 3*](https://ledergames.com/blogs/news/arcs-designer-diary-3-the-trick-s-the-thing) | 商业桌游一手日志 | 行动权限、主动权和行动数量可互相兑换；额外 draft 会复制行动轮并打断流动 | trick-taking 行动框架普遍优越；当前数值可移植 |
| [Cole Wehrle, *No Such Thing as a Free Action*](https://wehrlegig.com/blogs/essays/no-such-thing-as-a-free-action) | 商业桌游一手日志 | “免费”不代表无系统成本；动作可用性变化会级联到节奏、战场与先手 | 免费动作必然破坏平衡；Pax Pamir 的气候系统可泛化 |
| [Steamforged, *ELDEN RING Combat, Initiative & Deck Building*](https://steamforged.com/blogs/brands/combat-part-two-elden-ring-board-game) | 商业桌游一手日志 | 固定三行动与手牌攻防共同构成 stamina：行动槽、跨窗口资源和反应能力需一起看 | 三行动是最佳数量；宣传期日志证明最终体验效果 |
| [Daniel Piechnick, *Who Goes First?*](https://daniel.games/who-goes-first/) | 桌游设计师实践文 | 先后手影响随回合数量和价值变化；补偿也会改变座位策略和记忆负担 | 其“半个回合”估算是测量公式；固定轮转总是最好 |
| [*Popcorn* Designer Diary](https://iellogames.com/victor-saumonts-designer-diary-for-popcorn/) | 商业桌游一手日志 | 同步化迫使建房移出行动、增加广告板来预告跨轮影响，并重做先后依赖 | 局长近减半可预测其他项目；同步只改变时间 |
| [*Peacemakers: Horrors of War* Designer Diary](https://boardgamegeek.com/blog/1/blogpost/161842/designer-diary-peacemakers-horrors-of-war) | 商业桌游一手日志 | 合作游戏移除个人回合后，也需把动作改成一次做一件、允许共同计划和中途改序 | 无固定回合普遍减少四分卫或等待；缓存内容等于稳定全文 |
| [Reddit, *Downtime in board games & what to do about it*](https://www.reddit.com/r/tabletopgamedesign/comments/1k57ffj) | 非代表性设计社区 | 玩家会计划、监看、聊天或节能退出；分阶段与反应也可能改变“感知等待” | 玩家类型比例、可接受分钟数或任何改法的因果效果 |
| [Yan Xu 等, *Chores Are Fun*](https://dl.digra.org/index.php/dl/article/download/591/591/588) | 262 分钟录像、9 人、4 款游戏的质性研究 | 等待、计分、规则执行和物件操作可支持共同注意、学习、表演与社交节奏 | 所有维护都有价值；9 名同校参与者代表桌游玩家 |
| [Pape & Graham, *Coordination Policies for Tabletop Gaming*](https://equis.cs.queensu.ca/~equis/pubs/2010/pape-gi-10.pdf) | 数字桌面短论文与初步观察 | 把协调政策拆成回合、自由行动、屏障同步、定时动作与涓滴行动点；同步可被最慢者限制 | 初步数字实现证明实体桌游效果；分类已充分验证 |
| [Emily Hofstetter, *Achieving Preallocation*](https://doi.org/10.1080/0163853X.2020.1816401) | 21 款桌游会话分析 | 回合交接是玩家共同完成的互动工作，延迟和重叠会被参与者解释 | 摘要提供完整编码结果；会话顺畅等于游戏平衡或乐趣 |
| [*Brass: Birmingham* review](https://www.gamesradar.com/games/board-games/brass-birmingham-review/) | 玩家/评者长评 | 两行动中贷款同时消耗机会、降低收入；行动槽价值取决于系统依赖和时机 | 评者的“tight”证明客观平衡；两行动适合所有经济游戏 |
| `ptt-dadaocheng-downtime` | 中文玩家长评 | 等待秒数、计划起点、状态变化和预案失效的具体玩家症状 | 旧版少量局次代表当前作品、所有人数或玩家 |
| `captain-sonar-rules`、`captain-sonar-creator-note` | 官方规则与创作者说明 | 实时角色把听、说、决定、操作和确认分给不同玩家；另有回合制配置 | 规则证明实时更有趣或更易访问；两模式体验等价 |
| `magic-maze-rules` | 官方规则 | 同步权限、禁言、有限沟通和暂停/翻计时器形成协调结构 | 官方规则证明特定社交效果或适合所有群体 |
| `palm-of-your-hand-diary` | 商业桌游设计日志 | 同步/速度问题可来自角色分工与组件操作，而非只来自行动数量 | 单项目角色等待修订可直接泛化 |
| `takeover-randomness-diary` | 商业桌游设计日志 | 把 pass 改成 deploy/plan，使整回合本身成为 tempo 与风险取舍 | 玩家不再 pass 就证明等待或挫折已解决 |

## 第一轮发现

### 1. 回合结构首先是权限结构，其次才是时间表

最低不要只写“顺时针，每人两行动”，而应画出：

```text
window_or_layer
who_can_observe
who_must_decide
who_may_act_or_react
what_is_locked_and_when
who_resolves_and_confirms
how_the_window_ends
what_information_changes
```

回合、阶段、行动和反应窗口没有唯一必须采用的嵌套名称，但每层都应说明它重新分配了什么。*Arcs* 把行动类型、数量与主动权绑定到同一张牌；*Captain Sonar* 把决定、表达和操作拆给不同角色；*Magic Maze* 则以禁言和有限提示改变协调权。三者都说明回合结构不是“现在轮到谁移动棋子”的别名。

Hofstetter 对 21 款游戏的会话分析进一步提醒：回合边界还要由玩家共同识别和交接。谁完成了、谁接手、一次延迟算思考还是掉线、重叠算帮助还是越权，都是桌上实际完成的互动工作。本站据此把“交接摩擦”列为观察项，而不只数规则步骤。

### 2. 行动数量不是行动经济

至少同时记录：

```text
action_slots_or_budget
eligible_actions_now
cost_and_opportunity_cost
ordering_and_combinations
free_or_triggered_actions
reaction_reserve
maintenance_and_resolution
future_action_capacity
```

*Brass: Birmingham* 的玩家案例显示，贷款虽然只是两行动中的一个，却同时放弃本轮其他机会并降低收入；其意义来自整个依赖网。ELDEN RING 的三行动又与手牌的攻击、防御和恢复共同表现 stamina，固定行动数并不能描述玩家下一窗口还剩多少响应能力。

*Oath* 的关键迭代则证明行动粒度也属于经济。项目后期不是简单“行动太少”，而是一次 battle 太小，无法表达一个跨地点 campaign；直接增加行动让系统变成追打循环，改写一次行动所代表的操作尺度才接近目标。行动经济因此既问“能做几次”，也问“一次行动能把意图推进到哪里”。

“免费动作”同样不免费。Pax Pamir 日志中，免费军事动作绕过紧张的两行动预算，导致棋盘、先手和气候系统级联变化。它没有花行动槽，但仍消耗时间、注意、状态空间、规则检查和对手响应预算。

### 3. 等待至少有六种，不应只取平均回合秒数

候选分解：

```text
clock_wait             自己不能推进决定或动作的真实时间
decision_latency       窗口开始到玩家实际开始/完成关键决定
plan_survival          回合外形成的预案到自己行动时仍可用的比例
mandatory_monitoring   为避免错过触发、反应或状态变化必须持续注意
handoff_friction       宣告结束、确认、找下一位、恢复上下文的时间与错误
recovery_work          预案失效、漏触发或中断后重新扫描/查询的劳动
```

Orin Bishop 的论证把两端都保留下来：更短的回合可以提高参与频率，但会增加开始/结束的 friction；更长的回合允许组合行动，却让等待者下一回合前经历更多状态变化，并可能迫使其重新处理信息。`ptt-dadaocheng-downtime` 提供了相同症状的中文玩家案例，因此“平均每回合 45 秒”仍无法说明玩家的计划是否活到轮到自己。

Reddit 讨论只能作为非代表性症状，但补充了行为差异：有人在别人回合规划，有人为了节省精力退出注意，轮到自己才开始；也有人因为必须随时响应而感到整段等待都被占用。测试不能把看向桌面等同投入，也不能把聊天等同离开游戏。

### 4. 阶段的价值来自批处理、可见边界或权限变化，而不是流程美观

阶段可能有四类可检验功能：

- 批处理：把补充、收入、清理等重复劳动集中一次完成；
- 信息边界：所有人先计划、再锁定、后揭示，避免过程中泄密或反悔；
- 权限边界：在此窗口改变可行动者、可反应者或冲突优先级；
- 注意边界：明确共同聚焦、同步、教学或结算的时刻。

Daniel Piechnick 的偏好是尽量删阶段和维护；这是一条有价值的删减压力，不是定律。Xu 等的录像研究给出反例：手工计分、移动物件和规则执行有时会重新形成共同注意并支持学习或表演。正确问题不是“能否自动化”，而是“这项劳动承担的必要功能是什么，能否以更低成本保留”。

因此新增阶段前应写：它批处理了什么、改变了什么权限或信息、每轮转场成本是多少；删阶段前也要写：被删劳动是否是目标社交节奏、共同状态理解或错误发现的载体。

### 5. 同步行动是协调政策替换，不是压缩按钮

Pape 与 Graham 将协调政策区分为回合制、自由行动、屏障同步、定时动作和涓滴行动点。即使多人可并行，屏障同步仍把整体速度绑定到最慢者；自由行动又需要清楚处理允许动作和冲突。该论文只有两个数字实现与初步观察，不能证明哪种更好，但分类迫使设计者写清“并行了什么”。

*Popcorn* 是更具体的一手迭代：同步化后，建房仍有先后依赖，因此被移到轮间；word-of-mouth 则新增广告板，提前声明下一周获取。这不是把原规则同时执行，而是重写了动作位置和未来信息。其局长接近减半只属于该项目，不能作为比例承诺。

同步设计最低需要补：

```text
decision_parallelism
physical_operation_parallelism
commit_and_reveal_rule
conflict_resolution
speed_advantage
information_leakage
slowest_player_barrier
error_detection_and_repair
accessibility_alternative
```

### 6. 反应窗口增加的是监看义务，不只是互动机会

Duck Sauce 的卡牌设计文指出，每个可反应位置都会新增“何时可以回应、回应另一个回应怎么办、何时结算”的结构。反应能让非主动玩家做决定，也可能让所有人每个动作后都必须检查手牌、保持优先权或说“没有回应”。

因此应把反应拆成：

```text
trigger_visibility
eligible_responders
decision_deadline
priority_and_pass
nested_response_rule
reserved_resource
missed_trigger_repair
```

如果绝大多数窗口无人响应，设计者仍要记录全桌为确认“无人响应”付出的监看与交接成本。反之，移除反应也可能削弱防守、心理战、共同注意或对手行动的可读后果，不能只按秒数裁决。

### 7. 先后手与主动权必须绑定机会和信息，而非只看胜率

先手可能先占稀缺位，后手可能获得更多信息，最后行动者可能掌握不可回应的收尾机会；这些不是同一种优势。最低记录：

```text
seat_or_initiative_rule
scarce_opportunity_access
information_before_action
response_after_action
tempo_control
last_action_certainty
compensation_and_its_side_effects
result_by_version_and_experience
```

Daniel Piechnick 建议用低复杂度补偿，并提醒补偿本身可能让不同座位采用不同策略；他的“半个回合”是经验估算，不是本站公式。*Arcs* 则把高牌持主动权、低牌得更多行动和牺牲一张牌夺主动权做成明确交换，说明主动权可以是核心资源，而非应被抹平的偏差。

测试要同时看胜率/分差、稀缺机会、信息、玩家是否理解主动权价值，以及补偿是否形成新的支配开局。平均胜率接近 50% 也不证明每个座位面对同等有意义的决定。

### 8. 维护和等待要按功能删减，不能一刀切

维护动作至少可分：

- 状态必要：没有它系统无法继续；
- 信息必要：让所有人看见状态变化或验证结果；
- 决定必要：执行过程本身包含目标取舍；
- 社交/表演必要：目标体验需要共同揭晓、操演或注意轮换；
- 历史遗留：不再支持任何当前功能。

Daniel 的“把十次每回合放 token 合并成一次每轮放十个”适合作为低成本候选；Xu 等的结果则要求再问合并后是否失去共同状态更新或社交时刻。两者并不矛盾：前者是系统删减压力，后者是体验反例。网站工具应要求设计者先写功能，再尝试删除、批处理、自动化、委托、可视化或保留。

## 候选最小记录

```text
version / player_count_configuration / seat / experience
target_rhythm_and_attention_contract
layer_or_window / active_owner / observers / responders
available_actions / slots / costs / ordering / free_actions
lock / reveal / conflict / resolution / confirmation
turn_start / decision_start / commitment / resolution / handoff
clock_wait / decision_latency / plan_survival
mandatory_monitoring / recovery_work / missed_trigger
maintenance_task / function / owner / frequency / error
initiative_rule / opportunity / information / compensation
observed_behavior / player_interpretation / experience_report
one_change / predicted_gain / predicted_loss / counterevidence
```

## 候选产品方向

专题指南：`special-turn-structure-contract` / “别先加同步行动，先画谁在什么时候决定”。

候选五步：

1. 写目标节奏与共同注意，画游戏—轮—阶段—回合—行动/反应窗口；
2. 对一个关键窗口标谁看、谁决定、谁行动/回应、何时锁定和谁确认；
3. 画行动经济：槽位、可用动作、顺序、机会成本、免费/触发动作与维护；
4. 分解等待：计时、决定起点、预案存活、强制监看、交接与恢复；
5. 只改一个窗口或粒度，同时记录节省的成本与失去的功能。

可复用：`decision-trace`、`test-plan`、`feedback`、`playtest-selector`、`balance-pass`。不新增先手补偿或行动点自动计算器。

## 证据边界与下一步

- Bishop 是 2009 本科学位论文，其 downtime 段落是设计论证与案例，不是受控玩家实验；
- Xu 等只有 9 名同校参与者、8 个 session 与四款游戏，能发现社会互动机制，不能估计普遍偏好；
- Pape 与 Graham 只有两个数字桌面原型和初步非正式观察，替代协调政策仍是未来工作；
- Hofstetter 本轮只取得论文摘要和元数据，不用其未见全文细节建立字段；
- Daniel、Rogers 与 Duck Sauce 都是作者实践/偏好，不能把简化或层级术语写成规范；
- *Oath*、*Arcs*、Pax Pamir、*Popcorn* 与 ELDEN RING 都是项目特定日志，且同时存在多项迭代；
- GamesRadar 与 Reddit 只提供玩家/社区症状，前者是单一评者，后者是自选讨论；
- 现有英文证据占多数，中文仅有旧版本玩家长评，仍缺中文设计师完整回合重构日志；
- 还没有用中文新手验证记录字段负担，也没有实体测试比较串行/交错/同步版本；
- 后续需用至少一款轻策、一款重策、一款合作/实时作品，在首局与熟练局分别执行任务测试。

## 本轮落地

- 新增 14 条设计师实践、一手日志、玩家案例和桌面互动研究的逐条审阅资源；
- 新增 9 条带反例的回合结构、行动经济、等待、阶段、反应与主动权 Claim；
- 新增 10 个双向术语，不规定唯一层级命名；
- 新增第 21 篇专题指南 `special-turn-structure-contract`；
- 新增第 16 个资源入口 `turn-structure-action-economy`；
- 新增[回合结构与等待一页模板](../guides/TURN_STRUCTURE_CONTRACT.md)与[新手任务式测试脚本](../product/USABILITY_TEST_TURN_STRUCTURE_CONTRACT.md)；
- 复用既有测试与决定工具，不新增自动补偿或最优回合求解器。
