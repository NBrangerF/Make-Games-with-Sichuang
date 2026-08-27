# 落桌 V3 验收矩阵

状态：随实现更新
建立日期：2026-08-27
对应蓝图：`plans/luozhuo-learning-workbench-v3-blueprint.md`

## 验收规则

- 每个结论必须有可重复运行的自动证据，或记录了环境与操作的人工证据。
- 编译通过不等于用户任务通过；涉及界面的里程碑必须补浏览器证据。
- 未完成项保留为 `PENDING`，不用文案宣称代替产品状态。

## S1 — Workspace v3 地基

| ID | 验收条件 | 证据 | 状态 |
| --- | --- | --- | --- |
| S1-01 | 23 个 active key 与 2 个 legacy key 只读扫描，无重复 | `pnpm qa:storage-registry-v3` | PASS |
| S1-02 | 扫描和迁移不改写、不删除任何源 key | 全量夹具前后 dump 深度比较 | PASS |
| S1-03 | 同一报告生成相同 ID map 和相同 workspace | `pnpm qa:migration-v3` 规范 JSON 比较 | PASS |
| S1-04 | 旧自由文本不生成 `PrototypeRun` / `ChangeBrief` / 测试事实 | 全量迁移后的 collection 与 `getVersionFacts` 断言 | PASS |
| S1-05 | 损坏 JSON 保留原文与错误，孤立 Feedback 不伪造 Review | 损坏/变体夹具 | PASS |
| S1-06 | v3 引用、唯一 ID、版本链、单 active cycle 和 ChangeBrief 边受硬校验 | `pnpm qa:domain-v3` | PASS |
| S1-07 | CAS 冲突可见，active revision 损坏时可从 last-good 恢复 | `pnpm qa:workspace-repository-v3` | PASS |
| S1-08 | 导出带 digest，导入先检查且 strict restore 不跨 workspace 覆盖 | repository backup/restore 断言 | PASS |
| S1-09 | 大数据夹具与 localStorage → IndexedDB 阈值可重复计算 | 260KB / 400 evidence fixture；60% quota 或 p95 250ms 触发 | PASS |
| S1-10 | TypeScript、存储地基 QA、全站 content/build gate 通过 | `pnpm check`; `pnpm content:check`; `pnpm build` | PASS |

## 后续里程碑

| 里程碑 | 核心人工门 | 状态 |
| --- | --- | --- |
| S2 | 刷新/后退/深链不丢 WorkContext，歧义时不自动选项目 | `pnpm qa:work-context`；浏览器验证 project/version/cycle 刷新与后退 | PASS |
| S3–S7 | 从创意到一次证据化版本迭代，硬门不能靠填文字跳过 | `pnpm qa:project-workspace-v3`；浏览器完成 v0.1 → PrototypeRun → Session → Review → v0.2 | PASS |
| S4–S10 | 首页只给两个主任务；9 单元产生结构化产物或引用真实项目事实 | `pnpm qa:two-task-home`; `pnpm qa:course-v3`；深链跳级门浏览器验收 | PASS |
| S11 | 最多三项情境资料、ResourceAttachment、返回任务、完整备份、脱敏项目包与导入预览 | `pnpm qa:workspace-support-v3`；浏览器验证附着刷新恢复与移动端预览 | PASS |
| S12 自动门 | TypeScript、全量内容、a11y 合同、移动端溢出、容量与 production build | `pnpm check`; `pnpm content:check`; `pnpm build`；390px/1280px 浏览器烟测 | PASS |
| S12 真人发布门 | 两轮中文新手任务、键盘/读屏人工证据、staged migration 样本 | 受控两任务首页仍由 `VITE_V3_HOME_ENABLED` 关闭公开默认 | EXTERNAL PENDING |
