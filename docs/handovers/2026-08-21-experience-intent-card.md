# Phase 1 新手首段闭环与体验意图卡交接

日期：2026-08-21  
状态：本工作包实现与静态验证完成；浏览器和参与者验证待完成；项目总目标继续进行

## 本轮结果

完成“从模糊点子到第一条可测试假设”的新手路径审计，并补上六篇核心指南中唯一缺失的工具出口。第 16 项正式工具“体验意图卡”把题材、机制、触感或问题起点，转换为玩家语境、重复决定、后果、压力、可见反馈、行为预测、反驳信号、本轮非目标和第一条测试问题。

工具采用本地优先草稿、带 UUID/时间的记录快照、独立 JSON 导出和完整项目包汇总。它不生成乐趣分、玩家画像、最佳机制推荐或“体验已经成立”的结论。

## 为什么先做这一项

首页第一类卡点是“我只有一个模糊的点子”，信息架构也从 2026-08-13 起把体验目标卡列为第一候选，但 `guide-experience-intent.toolIds` 一直为空。核心系统、原型范围和测试等下游已经有工具，首段仍只能阅读文章和填自由文本，因此新手闭环在第一步中断。

本轮没有增加第 32 篇专题或继续扩大资源数，而是先修复这一条可观察的路径断点。完整判断见[新手路径完成度审计](../research/BEGINNER_PATH_COMPLETION_AUDIT_01.md)。

## 视觉与交互决定

使用前端应用构建技能先定义桌面概念，再在既有站点视觉语言内实现；使用 Image Gen 生成并检查 1536×1024 概念稿：

- 文件：`design/concepts/experience-intent-card-desktop.png`；
- SHA-256：`c4da721bb8ee257edf2fad8cb046c546e95578404dad2aaf65c40f3ec1019881`；
- 锁定元素：暖白纸面、钴蓝活动态、砖红边注、五步横向轨道、宽编辑器/窄活页摘要、细线与低圆角；
- 有意偏差：不实现概念中的书本/设置图标、“复制为文本”和逐字计数；这些不属于现有任务，字符阈值也没有证据支持。

桌面 CSS 在 1000px 以下将摘要下移，720px 以下将字段改为单列，并把五步滚动限制在步骤容器内。由于真实浏览器没有加载产品，这些只是代码预检查，不是视觉签收。

## 新增文件

- `src/experience-intent-card.tsx`：五步字段、实时编译摘要、校验、保存、二次清空与导出；
- `scripts/check-experience-intent-card.mjs`：20 项结构守卫；
- `docs/research/BEGINNER_PATH_COMPLETION_AUDIT_01.md`：首段路径证据、断点和选择理由；
- `docs/product/EXPERIENCE_INTENT_CARD.md`：工具、数据、视觉、路由与边界规格；
- `docs/product/USABILITY_TEST_EXPERIENCE_INTENT_CARD.md`：三类简报、T1–T6、支持条件与形成性门；
- `design/concepts/experience-intent-card-desktop.png`：接受概念稿。

## 修改范围

- 核心指南 `guide-experience-intent` 第一顺位直达 `experience-intent`；
- 工具箱第一项加入体验意图卡并使用 React `lazy()` 按意图加载；
- 项目包增加 `experience_intent_records`，权威汇总口径由 15 类增至 16 类；
- 存储键、工具 ID 联合类型、内容校验、浏览器 QA 路径、响应式 CSS、README、路线图、MVP、数据模型、项目护照、索引、视觉账本和阻塞记录同步更新。

## 数据边界

独立导出固定包含：

- `method: experience-intent-card`；
- `local_first: true`；
- `no_fun_score: true`；
- `no_player_profile_inference: true`；
- `no_mechanic_recommendation: true`；
- 明示证据边界。

只有玩家语境、重复决定、压力、可见反馈和行为预测齐全才编译假设；12 个字段全部齐全才保存记录。清空只清草稿，不删除历史记录。

## 验证证据

- `pnpm qa:experience-intent`：20 / 20 守卫通过；
- `node --check scripts/qa-site.cjs`：通过；
- `pnpm content:check`：533 resources / 27 entry points / 289 claims / 5 frameworks / 6 core guides / 31 special guides / 287 terms / 533 assessments / 22 cards / 57 local files，通过；
- `pnpm check`：TypeScript 通过；
- `pnpm build`：Vite 8.2.1，38 modules，114 ms，通过。

构建产物：CSS 72.22 kB（gzip 11.30）、体验意图卡独立 chunk 13.45 kB（gzip 4.81）、原型范围 17.16 kB（gzip 5.81）、议题到系统 17.70 kB（gzip 5.70）、内容版本治理 18.21 kB（gzip 5.09）、主 JS 487.23 kB（gzip 148.76）、方法目录 502.36 kB（gzip 166.56）、资源目录 739.62 kB（gzip 195.67）。方法与资源目录继续触发构建警告；这些大小不是浏览器性能证据。

## 未通过的验证

`pnpm qa` 在 Vite 监听 `127.0.0.1:5175` 时返回：

```text
listen EPERM: operation not permitted 127.0.0.1:5175
```

失败发生在产品加载之前。没有执行指南直达、填写、保存/恢复、下载、项目包汇总、键盘、控制台或 375px 断言；也没有生成实现截图来与概念稿并排检查。因此不能声称视觉 10/10、核心交互或响应式浏览器验收通过。详见[浏览器 QA 阻塞记录](../product/BROWSER_QA_BLOCKER.md)。

4–6 名中文新手的 T1–T6 形成性测试也尚未执行，不能声称字段易懂、工具能改善设计质量或预测能代表玩家体验。

## 下一工作包

1. 在允许本地端口或可启动浏览器的环境运行 `pnpm qa`，生成桌面与 375px 实现截图；
2. 将两张实现截图与接受概念稿同轮检查，记录真实偏差、控制台、焦点、步骤滚动和下载结果；
3. 用 4–6 名中文新手执行 T1–T6，优先观察压力/反馈、预测/反例和玩家语境的误读；
4. 根据第一次偏离只修一轮字段文案、顺序或交互，再复测；
5. 新手首段通过后，再审计“体验意图 → 核心循环 → 原型范围 → 测试计划”之间的跨工具交接，避免继续孤立增加工具。
