# Phase 1 发布路线与责任图交接

日期：2026-08-17  
状态：本工作包完成；长期 `/goal` 继续  
范围：授权投稿、PnP/POD、库存自出版、众筹责任、中文一手案例、专题指南与交互责任图

## 本轮解决了什么

上一轮已能记录“如何把实体游戏做出来”，但网站仍把发布留在通用发布包层：新手无法看见投稿、签约、开发、生产和履约是不同状态，也容易把出版方或平台想象成会自动接管所有工作。

本轮将发布路线重构为责任分配问题。网站不回答哪条路线最好，而要求用户先写下一位接收者要完成的动作，再为八类工作指定责任人、证据、来源日期和未覆盖项，同时记录公开承诺、权利、资金/库存暴露、当前关卡、下一条证据与退出条件。

## 研究产物

- [发布路线、投稿匹配与履约责任研究](../research/PUBLISHING_ROUTES_01.md)：20 条新增来源的比较、综合结论、反例、产品转译和待补证据。
- [发布路线责任图指南](../guides/PUBLISHING_ROUTE_RESPONSIBILITY_MAP.md)：六步操作、五个常见误区、四条中止/例外边界和练习。
- [来源台账](../research/SOURCE_LEDGER.md)：新增协会合同教育、设计师/玩家博客、具体出版方、比赛、POD/PnP 与众筹平台一手文档。
- [研究问题地图](../research/RESEARCH_QUESTIONS.md)：新增 5.2 发布路线与责任分配的初答。

关键判断：

1. 发布路线首先是工作与责任的分配，不是渠道名或收益排行榜。
2. 投稿、评估、合同、开发、生产、销售与履约必须保留独立状态。
3. 出版方、赛事与平台要求属于高时效证据，行动前必须按当前官方页面重查。
4. PnP 移除实体制造，不移除文件质量、权利、版本与支持；POD 降低库存暴露，不自动带来需求。
5. 众筹将需求信号转换为预算、沟通、生产和履约义务；已收款或公开承诺会提高改路成本。
6. 中文一手案例能展示劳动、库存与责任回流，但个案金额和结果不能外推为市场平均。

## 机器可读内容变化

- `content/resources.json`：144 → 164；新增 20 条资源。
- `content/resource-assessments.json`：144 → 164；每条新增资源都有一份无总分审阅记录。
- `content/claims.json`：73 → 83；新增 10 条可追溯 Claim。
- `content/glossary.json`：59 → 67；新增发布路线、路线责任、投稿匹配、授权协议、公开承诺、奖励履约、库存暴露与平台依赖。
- `content/special-guides.json`：9 → 10；新增 `special-publishing-route-responsibility-map`。
- `docs/research/resource-health.json`：重建为 164 条完整快照。

三条来源仅按较浅层级使用：Cardboard Edison 目录、WODC 2026 与摩点指南没有被标为完整正文深读。具体赛事资格、开放状态、费用、条款和平台能力不得从本轮摘要直接执行。

## 网站功能变化

工具箱新增“发布路线责任图”：

- 固定八类责任，不能通过删除类别掩盖工作；
- 责任人包括自己、共同创作者、出版方、平台、供应商、生产方、履约方、专业顾问与未定；
- 证据分为尚未核验、当前官网、书面沟通、合同/服务条款与已完成实测；
- 摘要实时显示未定责任人和未核验证据数量；
- 记录当前主路线、接收者动作、路线理由、不可谈条件、公开承诺、权利、资金/库存、当前官方要求、决策关卡、下一证据与退出条件；
- 本地保存键为 `tabletop-workshop-publishing-route-maps-v1`；
- JSON 导出固定包含 `no_route_ranking`、`not_legal_or_financial_advice` 和 `platform_rules_require_recheck`。

专题指南可直接打开责任图；工具标签、类型白名单、构建校验和未来浏览器回归均已接入 `route-map`。

## 验证记录

已通过：

- `pnpm resources:health`：生成 164 条快照；当前无外网环境结果为 `error 164`，没有来源被自动判死。
- `pnpm content:check`：`content ok: 164 resources, 83 claims, 5 frameworks, 6 core guides, 10 special guides, 67 terms, 164 assessments, 22 design constraint cards, 50 local files`。
- `node --max-old-space-size=1024 node_modules/typescript/bin/tsc -b --pretty false`：通过。
- `node --check scripts/qa-site.cjs`：通过。
- `node node_modules/vite/bin/vite.js build`：通过；主 JS 715.26 kB，gzip 210.19 kB。

补充说明：一次 `pnpm check` 在 Corepack 读取项目规格时以 `ETIMEDOUT` 失败；直接运行 package script 中完全相同的 TypeScript 命令通过，因此记录为启动器/文件读取故障，而不是类型错误。

未通过且不得表述为已验收：

- `node scripts/qa-site.cjs`：预览进程退出；直接预览确认 `listen EPERM: operation not permitted 127.0.0.1:5175`。
- 没有本轮真实桌面或移动截图；未执行接受稿与最新实现截图的双图 `view_image` 检查。
- 没有真实 Chrome 交互、下载、控制台、键盘、屏幕阅读器或跨浏览器证据。

## 有意边界

- 工具不排名发布路线，也不预测签约、销量、利润、现金流或交付成功。
- 工具不生成合同公平分，也不提供法律、税务、金融、产品安全、平台合规或跨境结论。
- 未定可以保存并高亮；平台名称、口头预期或行业惯例不能自动成为责任证据。
- 当前页面、比赛、出版方和平台字段必须保留核验日期。
- 本轮没有复刻或转载商业目录、书籍、文章或平台文档正文，只保存原创摘要、评价和指路链接。

## 下一工作包建议

优先顺序：

1. 在允许 localhost 的环境运行 `pnpm qa`，生成并检查 `design/qa/publishing-route-desktop.png` 与 `design/qa/publishing-route-mobile.png`；与 [接受概念稿](../../design/concepts/workbench-primary.png) 同轮使用 `view_image`。
2. 用 3–5 名中文新手分别填写“投出版社”“PnP/POD”“众筹”路线，测量完成时间、无法理解字段、未定责任是否被诚实保留，以及工具是否导向一条可执行证据。
3. 邀请至少一名出版编辑、一名完成过自出版/众筹的设计者和相关专业人员审阅责任类别与措辞；不要请求其为整条路线背书。
4. 补一个获得公开许可或充分匿名的中国大陆项目案例，连接 BOM、报价、实付、库存、渠道与履约差异；当前中文文章不足以替代结构化项目数据。
5. 评估资源/审阅 JSON 的按页面拆包，处理 715 kB 主 JS 性能警告。

长期目标仍未完成。后续工作应继续沿“研究—机器内容—原创指南—交互工具—真实用户验证—交接”循环推进，而不是把本工作包当作网站完工。
