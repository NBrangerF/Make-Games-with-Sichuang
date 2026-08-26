# Phase 1 交接：《狗头人》版本与权利复核

日期：2026-08-18  
状态：本地版本范围与官方入口已核验

## 结果

用户提供的 PDF 不是完整中文版，而是 55 页“预读版”。逐页提取确认实际内容为第一章五篇文章，以及第二章第一篇《我是怎样设计游戏的》；目录中其余文章没有正文。

本地文件没有复制进仓库。仓库只保存原创摘要、页码定位和文件指纹：

`SHA-256 59a7d1a9439968ccc96ff0249015f2c3c2849b6cfbf6fc7dcdb4a24a1a5f4ebf`

## 精确内容范围

| PDF 页 | 内容 |
|---:|---|
| 4–10 | James Ernest：游戏不等于规则 |
| 11–15 | Richard Garfield：玩更多的游戏 |
| 16–26 | Jeff Tidball：游戏节奏 |
| 27–33 | Matt Forbeck：游戏背景 vs. 游戏机制 |
| 34–44 | Mike Selinker：游戏究竟属于谁？ |
| 45 | 第二章扉页 |
| 46–55 | Andrew Looney：我是怎样设计游戏的 |

详细 K01–K11 产品转译见 [《狗头人》结构与产品笔记](../local-materials/KOBOLD_GUIDE_NOTES.md)。

## 官方完整版本

2026-08-18 核验 Kobold Press 官方商品页：英文完整版本标为 144 页、15 位贡献者，覆盖构思、设计、开发与呈现。官方页已作为第 188 条资源接入网站，但阅读深度明确为 `metadata_only`、商业语境明确为 `creator_or_product_context`。

官方销售页只核验版本、贡献者、主题范围与购买入口。它不能替代内容评价，也不能用来补写本地预读版缺失文章；价格、库存和格式在行动时重新核验。

## 数据变化

- 资源与逐资源审阅：187 → 188；
- Claim：保持 95；
- 本地中文预读版仍只作为内部、受版权保护的页码化摘要来源；
- `kobold-guide-board-game-design-official` 作为英文商业书目入口进入公开资源库。

## 验证

- 文件：55 页、未加密、带结构标签；PDF 元数据显示 2015-08-18 生成；
- 官方页：2026-08-18 经 Web 检索核验；
- `pnpm resources:health`：生成 188 条完整快照；受限环境为 `reachable 0 / blocked 0 / dead 0 / error 188`，不判定链接死亡；
- `pnpm content:check`：通过，`188 resources / 5 entry points / 95 claims / 5 frameworks / 6 core guides / 10 special guides / 67 terms / 188 assessments / 22 cards / 50 local files`；
- `node --check scripts/qa-site.cjs` 与 `pnpm check`：通过；
- `pnpm build`：通过，CSS 48.55 kB（gzip 8.23 kB），JS 763.04 kB（gzip 223.32 kB）；保留大于 500 kB 拆包警告；
- `pnpm qa`：失败于 `listen EPERM: operation not permitted 127.0.0.1:5175`，没有浏览器交互或视觉验收。

## 下一步

1. 若合法取得完整英文版，再为未提供的设计、开发与呈现文章建立独立审阅；不从目录臆测。
2. 将 K01–K11 与现有 Claim、指南和工具逐项对照，优先发现仍停留在笔记、未进入新手路径的洞见。
3. 网站展示时同时写“本地审阅范围 55 页预读版”和“官方完整版 144 页”，防止范围混淆。
