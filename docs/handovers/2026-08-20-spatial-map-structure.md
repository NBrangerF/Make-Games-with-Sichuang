# Phase 1 交接：空间、距离、邻接与地图结构

日期：2026-08-20  
状态：内容包完成；浏览器与真实参与者验证待办  
接续基线：347 resources / 347 assessments / 17 entry points / 185 claims / 22 special guides / 146 glossary terms

## 本轮完成

### 研究

- 新增[空间、距离、邻接与地图结构研究记录](../research/SPATIAL_MAP_STRUCTURE_01.md)；
- 将问题拆成五个子问题：地图功能、邻接/距离/容量、激励—人数—密度、地理/模块/图形、抽象拓扑与真实桌面；
- 来源矩阵共 22 项，覆盖设计师理论、一手商业日志、官方规则、玩家图论分析、记者现场测试、社区症状、实体桌面/HCI 和桌游无障碍研究；
- 深读关键来源包括 Cole Wehrle 的 Oath 地图日志、Bruno Faidutti 的地图分类随笔、Marc Rodrigue 的历史制图日志、Scott 等桌面区域研究、Kosa/Yilmaz 的 12 人领土地图迭代，以及 Spirit Island 模块地图材料；
- 明确反例：地图缩小不必然增加好互动，六角格不自动更深，高度节点不自动更强，模块地图不自动平衡，现实地理更准不自动更可玩，TTS 可缩放不证明实体远座可读。

### 机器内容

- 新增 16 条资源及一一对应的无总分审阅；
- 新增 10 条带反例 Claim；
- 新增 11 个规范术语：`spatial-model`、`adjacency-rule`、`movement-metric`、`graph-degree`、`path-distance`、`bottleneck`、`spatial-density`、`node-capacity`、`modular-layout`、`map-legibility`、`tabletop-territory`；
- 新增第 22 篇专题指南 `special-spatial-relationship-contract`：“别先画世界地图，先写每条空间关系在做什么”；
- 新增第 17 个策展入口 `spatial-map-structure`；
- 更新资源/概念轻量索引、链接健康快照和浏览器回归契约。

### 可执行材料

- 新增[空间关系契约一页模板](../guides/SPATIAL_RELATIONSHIP_CONTRACT.md)；
- 新增[中文新手任务式测试脚本](../product/USABILITY_TEST_SPATIAL_RELATIONSHIP_CONTRACT.md)；
- 模板不生成地图质量、平衡、网格排名或历史精度分，只要求设计者选择一项连接、成本、目标、容量、布局或图形线索并写反驳信号；
- 复用 `decision-trace`、`test-plan`、`feedback`、`playtest-selector`、`balance-pass`、`accessibility-observation`、`redesign`，未新增正式交互工具。

## 关键决定

1. 地图定义为承载状态、地点、连接、距离、容量、信息和所有权的规则空间，不等同世界图像。
2. 邻接按操作分别定义；移动、攻击、传播、支援和计分不预设共用同一关系。
3. 视觉距离、现实距离与规则距离分开；规则距离由路径、边权、行动/资源、阻断与时机恢复。
4. 度数、半径、直径、最短路和瓶颈只作结构描述，不能生成地图质量、平衡或趣味分。
5. 空间密度绑定人数配置、单位、目标、行动范围、占用时间和回应路径，不能用格数/人数单比值替代。
6. 逻辑容量与实体容量分开：规则共存、封锁和溢出，与组件能否放下、读取和拿取分别验证。
7. 模块拼接先声明必须保持、允许变化和无效布局，不把随机变化量当可重玩性或平衡证据。
8. 地理准确、规则可读和可玩视角分轨；无规则作用或误导动作的制图线索必须接受删除/降级测试。
9. 真实桌面按座位、视距、方向、触达、传递、遮挡、保密和个人/群组/储存区测试，数字缩放不替代实体证据。

## 新增资源 ID

```text
oath-map-remembers
faidutti-map-territory
insidegmt-cartography-game-board
byways-map-development
daniel-scaling-map
ticket-to-ride-adjacency-analysis
new-yorker-map-incentive-playtest
spirit-island-thematic-map-rules
spirit-island-jagged-earth-map-diary
dinosaur-world-route-diary
fateforge-map-exploration-diary
scott-tabletop-territoriality
whalen-boardgame-tabletop-interface
kosa-us-territory-map-process
reddit-board-map-design
reddit-table-space-access
```

复用的关键资源包括 `gamesprecipice-player-count-scalability`、`amritsar-player-count-diary`、`root-hirelings-player-count-diary`、`goodman-multiplayer-game-spaces`、`mcd-heuristic-toolkit-paper`、`rubio-history-50-years` 和 `building-blocks-tabletop-book`。

## 新增 Claim ID

```text
claim-map-is-rule-bearing-spatial-model
claim-distance-is-rule-not-visual-scale
claim-adjacency-needs-explicit-operation
claim-topology-metrics-are-descriptions-not-quality
claim-spatial-density-needs-incentive-and-count-context
claim-node-capacity-shapes-interaction
claim-modular-layout-changes-structure-not-just-variety
claim-geographic-fidelity-and-play-fidelity-can-diverge
claim-tabletop-layout-is-access-interface
claim-map-legibility-needs-seat-task-testing
```

继续复用 `claim-player-count-is-configuration-not-scalar`、`claim-player-count-scaling-needs-function`、`claim-interaction-needs-effect-path`、`claim-prototype-fidelity-follows-question` 与历史/无障碍边界，避免重复主张。

## 验证证据

执行并通过：

- `pnpm resources:health`：347 `error` / 0 `dead`；当前 shell 网络限制下不解释为内容失效，也没有删除资源；
- `node --check scripts/qa-site.cjs`；
- `pnpm content:indexes`：347 条资源索引、146 条概念索引；
- `pnpm content:check`：347 resources / 17 entry points / 185 claims / 5 frameworks / 6 core guides / 22 special guides / 146 terms / 347 assessments / 22 cards / 50 local files；
- 贡献协议：安全默认、有效候选与 11 个发布拒绝分支通过；
- `pnpm check`；
- `pnpm build`：Vite 8.2.1、33 modules、116 ms；CSS 48.74 kB（gzip 8.30）、method 308.31 kB（gzip 106.75）、resource 492.95 kB（gzip 135.02）、main 445.12 kB（gzip 135.99）。

没有执行或没有通过声明：

- 真实浏览器回归；
- 桌面/375px 视觉、焦点、触控、屏幕阅读器或动态 chunk 网络时序；
- 真实中文参与者和相反座位任务测试。

浏览器阻塞条件仍见[真实浏览器 QA 环境阻塞](../product/BROWSER_QA_BLOCKER.md)，本轮没有环境变化证据，不得把 QA 脚本语法通过写成浏览器通过。

## 证据限制

- Oath、B&T、Byways、Spirit Island、Dinosaur World 与 Fateforge 是项目特定日志或官方材料，多项变量并行；
- Faidutti 与 Daniel 是设计师理论/偏好，不是效果研究；
- Dan Scott 的 Ticket to Ride 分析没有纳入边权、目标、人数和真人测试；
- New Yorker 只有一次记者参与的非正式测试且同时缩图、加目标和改移动；
- Kosa/Yilmaz 只有 12 名参与者、两人教育原型和质性结果；
- Scott 等的协作任务样本小且目标是数字桌面迁移，Whalen 只有两页；
- Reddit 是自选讨论且同一产品出现相反体验；
- 中文桌游设计师公开的完整地图重构日志仍缺，中文第一人称证据薄弱。

## 下一步

1. 用 4–6 名中文新手执行形成性脚本，至少安排两个相反座位，优先验证“操作特定邻接”“规则距离”“逻辑/实体容量”和“桌面区域”的词汇阻断；
2. 选一个真实地图原型，在两人和主要高人数配置分别记录目标分布、行动范围、占用时间、接触/绕行和远座任务；
3. 在可运行浏览器环境执行更新后的 347/17/146/22 回归契约，并补桌面、窄屏、键盘与屏幕阅读器证据；
4. 补中文设计师地图重构日志，优先寻找从真实地理到规则图、从固定到模块、从线上到实体失败的完整版本链；
5. 下一内容专项可研究“谈判、承诺、交易与联盟的时间结构”，与互动拓扑、计分可见性和空间瓶颈交叉，但不要直接并入空间指南。
