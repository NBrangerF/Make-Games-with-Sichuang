# Phase 1 跨维度无障碍与资源维护交接

日期：2026-08-14  
状态：review  
项目总目标：继续建设面向新手桌游设计师的中文资源与交互工具网站；本交接不是项目完成声明。

## 本轮完成

1. 深读并分层收录 9 条无障碍来源：MCD 启发式论文、听障玩家沟通研究、神经多样性成人参与式研究、TEGA 教育工具包、Abletop 四篇从业文章和一本仅完成元数据核验的专著。
2. 新增 [跨维度研究报告](../research/ACCESSIBILITY_BREADTH_02.md)，覆盖操作、沟通、认知、情绪、经济与适配交叉影响，并单列证据缺口。
3. 资源库从 46 增至 55 条，Claim 从 23 增至 28 条；每条新资源都有无总分阅读说明、审阅深度和不能推出的结论。
4. 第三篇专题指南与网站工具扩展到开盒/设置/收纳、沟通节奏与权力、共同设计、额外费用和适配劳动。
5. 任务观察新增必填 `barrier`，导出升级到 `schema_version = 2`；旧本地记录会迁移为空 `barrier` 字段，不丢弃原观察。
6. 新增自动链接巡检与 [维护说明](../research/RESOURCE_MAINTENANCE.md)。自动结果和人工内容审阅是两套信号，任何状态都不会自动删除来源。

## 关键研究判断

- 维度标签用于检索，不代表独立玩家类别，也不是通过标准。
- 身体操作任务从开盒和设置开始，到收纳结束；频率、精度、够取和时间压力都要记录。
- 沟通可访问性包含说话节奏、同时发言、座位/视线、说话者提示、主持与权力关系，不只看音量。
- 玩家原话与任务观察回答不同问题；“觉得简单”不能单独证明自主完成，共同设计的具体变体也不能跨语境推广。
- 专版差价、额外配件、打印加工、寻找帮手和持续适配劳动属于参与代价。
- 情绪安全和经济可访问性证据仍薄弱，本站暂不提供通过标签或普遍阈值。

## 机器状态

- `content/resources.json`：55 条；
- `content/claims.json`：28 条；
- `content/resource-assessments.json`：55 条；
- `docs/research/resource-health.json`：55 条网络快照；2026-08-14 本轮结果为 39 `reachable`、7 `blocked`、0 `dead`、9 `error`；
- `content/special-guides.json`：3 篇；
- 任务观察导出：`schema_version = 2`，保持 `no_aggregate_score = true`。

网络快照会因站点限流、地区、DNS 和服务器状态波动。`blocked` 与 `error` 只代表需要人工打开复核；0 条 `dead` 表示本次没有站点明确返回 404/410，不等于所有内容仍可用。

## 验证证据

- `pnpm resources:health`：完成 55 条巡检并生成快照；
- `pnpm build`：内容校验、TypeScript 与 Vite 生产构建通过；
- 应用内浏览器：页面身份、非空内容、无错误覆盖层、控制台零警告/错误；资源库数量与核验边界可见；任务观察验证分支与保存分支通过；
- `QA_BASE_URL=http://127.0.0.1:5173 pnpm qa`：完整浏览器回归通过，含 55 条资源、导出字段、保存结构和 375px 移动端无页面溢出；
- 同轮 `view_image` 对照接受稿 `design/concepts/workbench-primary.png`、最新应用内截图与 `design/qa/accessibility-observation-mobile.png`；无待修复的视觉偏差。

## 主要文件

- `docs/research/ACCESSIBILITY_BREADTH_02.md`
- `docs/research/RESOURCE_MAINTENANCE.md`
- `docs/research/resource-health.json`
- `scripts/check-resource-links.mjs`
- `content/resources.json`
- `content/resource-assessments.json`
- `content/claims.json`
- `content/special-guides.json`
- `docs/guides/ACCESSIBILITY_TASK_OBSERVATION.md`
- `src/App.tsx`
- `scripts/qa-site.cjs`

## 下一工作包

1. 为中文残障桌游玩家、桌游店/家庭/学校场景建立访谈与共同设计招募协议；先做伦理、同意、退出和数据最小化说明。
2. 找到情绪安全、经济门槛、生产成本和长期使用的更强研究或公开生产案例，避免继续依赖从业清单。
3. 用至少 3–5 名有相关生活经验的玩家试用任务观察字段，重点看 `barrier`、沟通权力和适配劳动是否容易填写、是否遗漏玩家希望表达的内容。
4. 对 `blocked`/`error` 的 16 条链接人工复核，优先处理高时效和核心来源；保留迁移理由，不静默换文。
5. 继续向整站目标推进：真实新手可用性测试、资源提交/审阅工作流、部署与长期维护，而不是继续只扩充链接数量。

## 尚未完成

- 没有真实玩家参与本轮字段验证；
- 没有 Safari、Firefox 或屏幕阅读器人工验收；
- 中文残障玩家来源、情绪安全和地区化经济数据仍不足；
- 整个资源网站长期目标仍在进行中，不能将本轮构建和回归通过解释为项目完成。

