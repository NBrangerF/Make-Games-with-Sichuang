# 交接：牌库构筑、抽牌概率与循环控制

日期：2026-08-20

## 已完成研究产物

- 以 5 个研究问题审查 26 个正式规则、设计师实践、概率/计算与洗牌研究、无障碍资料和玩家症状来源。
- 形成 `docs/research/DECK_BUILDING_DRAW_CYCLE_01.md`。
- 形成 `docs/guides/DECK_BUILDING_DRAW_CYCLE_CONTRACT.md`。
- 形成 `docs/product/USABILITY_TEST_DECK_BUILDING_DRAW_CYCLE.md`。
- 核心结论：牌库应按功能与区域计数；获得必须连到首次兑现；概率模型要公开假设；压缩/膨胀/组合必须连接终局时钟；洗牌、查询与代操作是机制成本。

## 已完成集成

- 新增 23 条资源和 23 份逐条评估；与既有 `undaunted-diary`、`mcd-heuristic-toolkit-paper`、`geeky-gimp-accessibility-hacks` 一起构成 26 来源专题矩阵。
- 新增 12 条 Claim、18 个术语、第 28 篇专题指南 `special-deck-building-draw-cycle-contract` 与第 23 个阅读入口 `deck-building-draw-cycle`。
- 更新 README、文档索引、路线图、资源发现、方法按需加载、保真度台账和浏览器回归契约。
- 重建资源/术语索引和 469 条链接健康快照；当前 shell 网络条件把全部链接记为 `error`、0 条 `dead`，没有自动删除来源。

## 验证结果

- `pnpm content:check`：469 条资源、23 个入口、255 条 Claim、5 个框架、6 篇核心指南、28 篇专题指南、239 个术语、469 份审阅、22 张约束牌、50 个本地文件全部通过。
- `pnpm contribution:check`：安全默认、有效候选和 11 个发布守卫通过。
- `node --check scripts/qa-site.cjs` 与独立 TypeScript 检查通过。
- `pnpm qa:design-aid-prototype`：10/10 结构守卫通过。
- `pnpm build`：Vite 8.2.1、33 个模块、109 毫秒；主 JS 470.02 kB、方法目录 439.06 kB、资源目录 654.32 kB、CSS 48.74 kB。资源目录继续触发大于 500 kB 警告。
- 浏览器 QA 未重跑、未标记通过；阻塞边界保持不变。

## 当前限制

- 简单超几何模型不覆盖顶置、检索、固定顺序、弃后重抽和跨洗牌例外。
- Dominion/数字代理研究不能直接转成实体新手策略、偏好或平衡结论。
- 中文残障玩家对高频洗牌、牌堆检索与代操作的一手任务证据仍不足。
- 浏览器 QA 仍受 `docs/product/BROWSER_QA_BLOCKER.md` 所述环境阻塞；真人形成性测试尚未运行。

## 下一包候选

优先研究“卡牌组合、关键词模板与效果结算顺序”，把牌库层继续延伸到单卡语言、触发窗口、组合解析、无限循环和规则查询。
