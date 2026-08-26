# 交接：卡牌语言、关键词与效果结算顺序

日期：2026-08-20

## 已完成研究产物

- 以 5 个研究问题审查 30 个正式规则、设计师/编辑实践、形式研究、无障碍资料与玩家症状来源。
- 形成 `docs/research/CARD_LANGUAGE_KEYWORDS_RESOLUTION_01.md`。
- 形成 `docs/guides/CARD_LANGUAGE_EFFECT_RESOLUTION_CONTRACT.md`。
- 形成 `docs/product/USABILITY_TEST_CARD_LANGUAGE_EFFECT_RESOLUTION.md`。
- 核心结论：卡牌文字应先拆成可执行能力语法；效果类型进入统一时序模型；逻辑词具有项目级含义；组合以状态轨迹验证；循环必须有终止责任；关键词、图标、版式、查询和代读共同承担理解成本。

## 已完成集成

- 新增 25 条资源和 25 份逐条评估；与既有 Daybreak 日志、dV Giochi 规则指南、Unfair 词表、Meeple Centred Design 和 Race for the Galaxy 无障碍长评一起构成 30 来源专题矩阵。
- 新增 12 条 Claim、18 个术语、第 29 篇专题指南 `special-card-language-effect-resolution-contract` 与第 24 个阅读入口 `card-language-effect-resolution`。
- 更新 README、文档索引、路线图、资源发现、方法按需加载、保真度台账和浏览器回归契约。
- 重建资源/术语索引和 494 条链接健康快照；当前 shell 网络条件把全部链接记为 `error`、0 条 `dead`，没有自动删除来源。

## 验证结果

- `pnpm content:check`：494 条资源、24 个入口、267 条 Claim、5 个框架、6 篇核心指南、29 篇专题指南、257 个术语、494 份审阅、22 张约束牌、50 个本地文件全部通过。
- `pnpm contribution:check`：安全默认、有效候选和 11 个发布守卫通过。
- `node --check scripts/qa-site.cjs` 与独立 TypeScript 检查通过。
- `pnpm qa:design-aid-prototype`：10/10 结构守卫通过。
- `pnpm build`：Vite 8.2.1、33 个模块、127 毫秒；主 JS 474.97 kB、方法目录 461.90 kB、资源目录 686.92 kB、CSS 48.74 kB。资源目录继续触发大于 500 kB 警告。
- 浏览器 QA 未重跑、未标记通过；阻塞边界保持不变。

## 当前限制

- 不同正式规则采用不同优先权与同时效果模型，本站只提供选择和验证方法，不排名。
- Magic 图灵完备只说明开放组合系统的通用求解边界，不代表普通原型不可分析。
- 设计师日志与 FAQ 是一手过程证据，但不能把单项改动与理解改善作因果归因。
- 中文卡文、翻译和不同读写/视觉/操作条件下的真人形成性测试尚未运行。
- 浏览器 QA 仍受 `docs/product/BROWSER_QA_BLOCKER.md` 所述环境阻塞，完成静态验证也不得标记浏览器通过。

## 下一包候选

完成本包数据集成和验证后，优先研究“卡牌稀有度、扩展集兼容、版本勘误与长期内容治理”，把单卡语言继续延伸到可扩展卡池的维护协议。
