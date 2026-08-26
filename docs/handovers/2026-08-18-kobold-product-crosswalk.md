# Phase 1 交接：《狗头人》K01–K11 产品映射

日期：2026-08-18  
状态：内容链已补齐，待真实用户与浏览器验证

## 本轮目标

检查《狗头人》预读版的 K01–K11 是否真正进入网站，而不以出现相似关键词冒充产品覆盖。完成映射见 [KOBOLD_CROSSWALK.md](../local-materials/KOBOLD_CROSSWALK.md)。

## 结论

K01、K03、K06–K09、K11 已有完整或接近完整的 Claim—概念—指南—工具链。本轮补齐四项此前只在笔记或局部文案中的洞见：

- K02：发散与评估需要明确模式切换；
- K04：有目的地玩，包括研究自己不喜欢但有人喜欢的游戏；
- K05：每项陌生约定都占用学习预算，但熟悉惯例不天然正确；
- K10：删除必须成为可回退、带功能风险的版本化实验。

## 数据变化

| 内容 | 前一轮 | 本轮后 |
|---|---:|---:|
| 资源与逐资源审阅 | 188 | 190 |
| Claim | 95 | 99 |
| 规范概念 | 67 | 71 |
| 专题指南 | 10 | 11 |
| 任务型阅读入口 | 5 | 6 |
| 可保存工具 | 12 | 12 |

新增两条公开来源：Ishan Manjrekar 的有目的游玩流程、Michael Sellers 的系统分析章节。新增四个概念：`design-mode`、`purposeful-play`、`learning-budget`、`subtractive-test`。

## 产品变化

- 新专题 `special-purposeful-play`：分开自身体验、桌面行为、系统关系与他人语境，再写迁移假设和删减实验；
- 新资源入口 `learn-by-playing`：8 条经审阅来源，回答“玩过很多但不会分析”；
- 专题复用单轮决定轨迹、改造熟悉游戏和原创设计约束牌，没有未经验证就增加第 13 个工具；
- 核心系统与规则信息指南新增“学习预算”概念和 Claim。

## 关键边界

- 本地 55 页预读 PDF 不进入公开资源 JSON，不复制正文；
- 官方 144 页商品页只核验版本，不能承担文章观点证据；
- 个人好恶、单次游玩和公共讨论热度不能证明总体玩家效果；
- 工作单不应吞掉休闲游玩，也不能强迫玩家为完成分析继续不愿意的体验；
- 新概念目前有内容与静态结构证据，没有真实新手学习效果证据。

## 验证

- `pnpm resources:health`：190 条完整快照，当前受限环境全部为 `error`，不自动判死；
- `pnpm content:check`：通过，`190 resources / 6 entry points / 99 claims / 5 frameworks / 6 core guides / 11 special guides / 71 terms / 190 assessments / 22 cards / 50 local files`；
- `node --check scripts/qa-site.cjs`：通过；回归契约已更新为 11 篇专题、71 个概念、6 个入口和 190 条资源；
- `pnpm check`：通过；
- `pnpm build`：通过，CSS 48.55 kB（gzip 8.23 kB），JS 777.54 kB（gzip 228.17 kB）；保留大于 500 kB 拆包警告。本轮构建 33.58 秒，报告主要耗时在 CSS post-render 与 HTML transform 插件钩子；
- `pnpm qa`：失败于 `listen EPERM: operation not permitted 127.0.0.1:5175`；没有浏览器交互、键盘、屏幕阅读器或视觉验收。

## 下一步

1. 让真实中文新手完成一次“局面—行为—系统关系—他人语境—迁移假设”任务。
2. 检查四层记录是否应渐进显示，不能只为减少字段而丢失证据边界。
3. 用一个真实原型比较删除前后版本，确认用户会记录被删除内容原本承担的功能。
4. 只有纸笔／指南验证显示持续记录价值后，再决定是否实现第 13 个“有目的游玩日志”工具。

可直接执行的主持脚本与无总分记录模板已分别写入 `docs/product/USABILITY_TEST_PURPOSEFUL_PLAY.md` 和 `docs/product/purposeful-play-session-template.json`；没有用内部模拟代替真实参与者结果。
