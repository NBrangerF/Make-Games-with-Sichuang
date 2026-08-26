# 资源网站 V2 首批内容基础交接

日期：2026-08-21  
状态：内容基础完成；当前生产构建与浏览器 QA 通过  
范围：资源入口减法、首批完整中文内容、版权边界与下一内容包

## 1. 本轮目标

在不增加主入口、账号、排名或大型工具的前提下，把 V2 从“有信息架构和译文样板”推进到“第一批内容能够支撑学习入口”：

1. 为系统路线完成最前面的 3 个本站原创单元。
2. 保留 2 篇有 CC BY 依据的 Codex 完整译文。
3. 为“看设计师怎样思考”完成 3 篇本站原创案例综合。
4. 把设计问题入口收缩成二段式，并把具体主题限制为 3 份起步内容。
5. 保留 34 个旧入口与逐条资源深链。
6. 冻结“未获许可的外文来源不做全文翻译”的版权边界。

## 2. 已完成内容

### 2.1 信息架构与减法 UI

- 默认资源首页只有三个任务入口和“搜索全部资料”次级入口。
- 学习入口仍按系统学习、设计师思考、边玩边学和小练习四种方式开始。
- 设计问题入口采用两段：先选六个设计阶段，再看所选阶段的具体问题。
- 具体主题页只显示 3 份起步中文内容；完整目录必须由用户主动进入。
- 旧的 34 个任务入口和逐条资源深链继续兼容。
- 574 条资源仍在数据层，用于发现与策展，不在默认页形成资源墙。

### 2.2 三个本站原创系统单元

| 单元 | 内容文件 | 状态 |
| --- | --- | --- |
| 单元 0：从一个具体问题开始 | [正文](../../content/learning-units/systematic-unit-00-question-first-zh-CN.md) | `original_complete` / `internal-ready` |
| 单元 1：玩家体验与设计意图 | [正文](../../content/learning-units/systematic-unit-01-experience-intent-zh-CN.md) | `original_complete` / `internal-ready` |
| 单元 2：决定与核心循环 | [正文](../../content/learning-units/systematic-unit-02-decisions-core-loop-zh-CN.md) | `original_complete` / `internal-ready` |

三篇都可独立读完，包含桌面例子、核心关系、逐步方法、练习、边界与来源。它们使用本站自己的结构和表达，不是单一来源的替代译文。

### 2.3 两篇 CC BY Codex 完整译文

| 译文 | 内容文件 | 许可与状态 |
| --- | --- | --- |
| *Game Design Concepts*, Level 1 | [正文](../../content/translations/game-design-concepts-level-01-zh-CN.md) | CC BY 3.0 US；`authorized_full_translation` |
| *Game Design Concepts*, Level 2 | [正文](../../content/translations/game-design-concepts-level-02-zh-CN.md) | CC BY 3.0 US；`authorized_full_translation` |

共同记录：

- `translationAuthority: codex_ai_complete`
- `humanReviewStatus: not_required`
- `internalLearningStatus: authoritative`
- `publicationScope: internal`
- `publicationStatus: internal-ready`

人工双语复核不是内部学习的前置门。项目不得把它们称为人工翻译、人工审定、作者认可、法律审定或已经公开发布的版本。

### 2.4 三篇本站原创设计师案例综合

| 设计决定 | 作者与项目 | 内容文件 |
| --- | --- | --- |
| 怎样减少同时变化的测试变量 | Daniel Solis，《Monsoon Market》 | [案例](../../content/guides/monsoon-market-variables-case-synthesis-zh-CN-internal.md) |
| 怎样用一张牌连接牌库构筑与工人放置 | Paul Dennen，《Dune: Imperium》 | [案例](../../content/translations/dune-imperium-beginnings-zh-CN-internal.md) |
| 删除旧组件后怎样发现隐藏工作 | Cole Wehrle，《John Company》 | [案例](../../content/guides/quid-for-your-quo-case-synthesis-zh-CN-internal.md) |

三篇都是 `original_case_synthesis`。每篇使用本站的学习结构，分开作者报告、本站推断、仍未知与迁移动作，不复制来源文章的全文、原有段落结构、图片或评论。

`Dune: Imperium` 案例的历史文件路径仍在 `content/translations/`，但 metadata 和内容声明都明确标为原创案例综合，路径名不改变内容模式。

## 3. 版权与内容边界

本阶段确认以下政策：

> 没有开放许可或明确书面授权的外文来源，不制作、保存或接入全文翻译，内部学习也不作为例外。

执行含义：

- 免费访问不构成翻译或再发布许可。
- 未授权设计师博客可以用于事实核验、链接与本站原创案例综合。
- 原创综合不沿用来源全文结构，不复制长段表达、图片、评论、头像或页面外壳。
- 取得明确许可后，应另建带版本、来源冻结和第三方素材记录的完整译文。
- 当前只有两篇 *Game Design Concepts* 文章以 CC BY 为依据进入完整译文；三篇设计师案例都不是完整翻译。

## 4. 本轮文档改动

- [V2 执行进度快照](../PROGRESS_SNAPSHOT_RESOURCE_V2_2026-08-21.md)
- [V2 总方案](../product/RESOURCE_SITE_V2_MASTER_PLAN.md)
- [文档索引](../INDEX.md)
- 本交接文件

本轮没有修改 `App.tsx`、`styles.css`、`package.json`、内容契约、研究报告或其他代码。

## 5. 数据与来源证据

- 3 个系统单元各有正文与 metadata。
- 2 篇 CC BY 完整译文各有正文、metadata、许可依据与来源核验。
- 3 篇设计师案例各有正文与 metadata；来源边界分别由 Monsoon Market、Dune: Imperium 和 Quid for your Quo 核验文档记录。
- 资源规模仍为 574 条，任务型入口仍为 34 个。
- 二段式入口证据位于 `src/resource-problems-v2.tsx`；具体主题 3 项限制与旧路由回接位于 `src/App.tsx`。本轮只读取这些实现作为文档依据，没有修改代码。

## 6. 自动检查与浏览器状态

### 自动检查

已完成：

- 4 份本轮文档共检查 294 个本地链接，缺失 0 个。
- `content/resource-learning-content.json` 解析通过；权威内容计数为 `original_complete=3`、`authorized_full_translation=2`、`original_case_synthesis=3`。
- `pnpm content:check` 通过：574 条资源、34 个任务入口的总内容门通过。
- 资源学习内容契约守卫 `36/36` 通过。
- 资源 V2 守卫 `28/28` 通过，其中包括系统单元 0–2、三篇设计师案例、二段式问题入口、具体问题页 3 份起步内容和旧深链规则。

这些是静态与契约证据，不替代真实浏览器 QA。

### 浏览器 QA

状态：`passed`。

主线已对当前生产构建执行 Playwright + Google Chrome 回归，使用桌面 `1440×1000` 与移动 `390×844` 视口，完成以下核验：

1. 桌面与移动视口的三入口首页。
2. 问题入口的阶段选择与具体问题两段。
3. 具体主题只显示 3 份起步内容。
4. 旧入口和逐条资源深链刷新恢复。
5. 键盘焦点、横向溢出、控制台与 HTTP 错误。

所有断言通过：移动端横向溢出为 `false`，键盘跳转可聚焦，控制台、页面与 HTTP 错误为 0。证据位于 `design/qa/resource-v2-02-*.png`。

## 7. 未完成与不得声称完成的事项

- 系统路线只完成单元 0、1、2，不能称九单元课程已完成。
- 边玩边学主文与三个小练习尚未补齐。
- 分析入口的三篇导论与三镜头案例尚未补齐。
- 开放许可无障碍规则书资料尚未完成全文译文。
- 设计师案例只有首批三篇，尚未覆盖所有设计阶段与决定类型。
- 真人读者测试尚未开始，不能声称路径提高了学习效率或设计质量。
- 站点仍是内部学习范围，不能部署或公开。

## 8. 下一工作包的唯一推荐起点

下一包从内容生产开始，不新增入口或工具：

1. 完成单元 3“机制、信息与互动”。
2. 完成单元 4“最小原型”。
3. 翻译 CC BY 4.0 的 *What Makes a Rulebook Accessible and Entertaining?*，先冻结来源、许可与第三方素材，再由 Codex 完成正文和结构核对。
4. 继续增加原创设计师案例综合，选择与测试变量、机制连接、隐藏依赖不同的决定类型。
5. 每次新增内容深链后，复用本轮桌面、移动、键盘与无外链的浏览器基线。

继续工作前先读[执行进度快照](../PROGRESS_SNAPSHOT_RESOURCE_V2_2026-08-21.md)与[V2 总方案](../product/RESOURCE_SITE_V2_MASTER_PLAN.md)。
