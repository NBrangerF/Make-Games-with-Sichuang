# Phase 1 交接：回合结构、行动经济与等待

日期：2026-08-20  
状态：内容包完成；浏览器与真实参与者验证待办  
接续基线：331 resources / 331 assessments / 16 entry points / 175 claims / 21 special guides / 135 glossary terms

## 本轮完成

### 研究

- 新增[回合结构、行动经济与等待研究记录](../research/TURN_STRUCTURE_ACTION_ECONOMY_01.md)；
- 将大问题拆成五个子问题：窗口权限、行动经济、等待分解、同步/反应协调政策、先后手/主动权；
- 来源矩阵共 22 项，覆盖设计师实践、商业一手设计日志、玩家/社区症状、桌游录像研究、会话分析和数字桌面协调短论文；
- 深读关键来源包括 Daniel Piechnick、Orin Bishop、Cole Wehrle 的 Oath/Arcs/Pax Pamir 日志、Xu 等桌游社交录像研究与 Pape/Graham 协调政策论文；
- 明确反例：短回合不必然减少等待，维护不必然只有成本，同步不只是把原规则同时执行，反应窗口也会制造强制监看。

### 机器内容

- 新增 14 条资源及一一对应的无总分审阅；
- 新增 9 条带反例 Claim；
- 新增 10 个规范术语：`turn-structure`、`action-window`、`action-economy`、`action-granularity`、`decision-latency`、`plan-survival`、`mandatory-monitoring`、`handoff-friction`、`initiative-control`、`maintenance-function`；
- 新增第 21 篇专题指南 `special-turn-structure-contract`：“别先加同步行动，先画谁在什么时候决定”；
- 新增第 16 个策展入口 `turn-structure-action-economy`；
- 更新资源与概念轻量索引、链接健康快照和浏览器回归契约。

### 可执行材料

- 新增[回合结构与等待契约一页模板](../guides/TURN_STRUCTURE_CONTRACT.md)；
- 新增[中文新手任务式测试脚本](../product/USABILITY_TEST_TURN_STRUCTURE_CONTRACT.md)；
- 模板不生成等待总分、先手补偿或行动点建议，只要求设计者选择一个窗口、写功能与反驳信号；
- 复用 `decision-trace`、`test-plan`、`feedback`、`playtest-selector`、`balance-pass`，未新增正式交互工具。

## 关键决定

1. 回合结构被定义为权限与信息结构，不规定唯一的 game/round/phase/turn/action 层级命名。
2. 行动经济不只数行动点，还记录动作资格、顺序/组合、机会成本、免费/触发动作、反应储备、维护与未来能力。
3. 一次行动代表意图推进多远被单列为行动粒度；“增加行动”与“改变一次行动的尺度”是不同候选。
4. 等待分成钟表等待、决定延迟、预案存活、强制监看、交接摩擦与错误恢复，不合成单分。
5. 阶段与维护在删减前先写批处理、信息、权限、纠错、学习、共同注意或表演功能。
6. 同步/实时/反应是协调政策变化，必须补锁定、泄密、冲突、最慢者屏障、速度优势、优先通过与修复。
7. 先手、后手和主动权分别检查稀缺机会、行动前信息、行动后响应、节奏和最后行动，不能只看胜率。

## 新增资源 ID

```text
daniel-turn-structure
bishop-game-design-concepts
rogers-turn-hierarchy
ducksauce-card-turn-loop
oath-action-economy-diary
arcs-action-structure-diary
pax-pamir-free-action-diary
elden-ring-action-economy-diary
daniel-who-goes-first
xu-chores-social-play
pape-tabletop-coordination-policies
hofstetter-turn-transition
reddit-downtime-design
brass-action-economy-review
```

复用的关键资源包括 `building-blocks-tabletop-book`、`popcorn-simultaneous-player-count-diary`、`ptt-dadaocheng-downtime`、`captain-sonar-rules`、`captain-sonar-creator-note`、`magic-maze-rules`、`palm-of-your-hand-diary` 与 `takeover-randomness-diary`。

## 新增 Claim ID

```text
claim-turn-structure-allocates-authority-and-information
claim-action-count-is-not-action-economy
claim-action-granularity-is-design-variable
claim-shorter-turns-do-not-guarantee-less-waiting
claim-waiting-needs-multiple-measures
claim-phase-needs-observable-function
claim-reaction-windows-create-monitoring-cost
claim-maintenance-has-cost-and-possible-function
claim-initiative-advantage-has-multiple-surfaces
```

继续复用 `claim-downtime-includes-state-volatility` 与 `claim-simultaneous-play-is-structural-refactor`，避免重复主张。

## 验证证据

执行并通过：

- `pnpm resources:health`：331 `error` / 0 `dead`；当前 shell 网络限制下不解释为内容失效，也没有删除资源；
- `node --check scripts/qa-site.cjs`；
- `pnpm content:indexes`：331 条资源索引、135 条概念索引；
- `pnpm content:check`：331 resources / 16 entry points / 175 claims / 5 frameworks / 6 core guides / 21 special guides / 135 terms / 331 assessments / 22 cards / 50 local files；
- 贡献协议：安全默认、有效候选与 11 个发布拒绝分支通过；
- `pnpm check`；
- `pnpm build`：Vite 8.2.1、33 modules、104 ms；CSS 48.74 kB（gzip 8.30）、method 288.36 kB（gzip 99.97）、resource 468.84 kB（gzip 128.39）、main 441.56 kB（gzip 134.68）。

没有执行或没有通过声明：

- 真实浏览器回归；
- 桌面/375px 视觉、焦点、触控、屏幕阅读器或动态 chunk 网络时序；
- 真实中文参与者任务测试。

浏览器阻塞条件仍见[真实浏览器 QA 环境阻塞](../product/BROWSER_QA_BLOCKER.md)，本轮没有环境变化证据，不得把 QA 脚本语法通过写成浏览器通过。

## 证据限制

- Bishop 是本科论文与形式设计论证，不是受控玩家体验实验；
- Xu 等只有 9 名同校参与者、262 分钟录像和四款游戏；
- Pape/Graham 是两页短论文，替代协调政策未做正式比较；
- Hofstetter 本轮只取得摘要和元数据；
- Daniel、Rogers、Duck Sauce 是设计师实践与偏好；
- Oath、Arcs、Pax Pamir、Popcorn 与 ELDEN RING 是项目特定一手日志，不能隔离所有改动；
- GamesRadar 是单一评者，Reddit 是自选社区；
- 中文第一人称证据仍薄弱，只有既有旧版本玩家长评可交叉。

## 下一步

1. 按形成性脚本招募 4–6 名中文新手，优先验证“决定者/执行者/确认者”、槽位外成本和六类等待是否可理解；
2. 再加入轻策略、重策略、合作/实时作品与混合熟练度玩家，检查字段是否过重或暗示短/同步优越；
3. 在可运行浏览器环境执行更新后的 331/16/135/21 回归契约，并补桌面、窄屏、键盘与屏幕阅读器证据；
4. 补中文设计师完整回合重构日志，以及对暂停、抢动、反应漏触发和同步错误恢复的第一人称材料；
5. 下一内容专项可研究“空间、距离、邻接与地图结构”，与人数密度、行动粒度和互动拓扑交叉，但不要把它直接并入本指南。

