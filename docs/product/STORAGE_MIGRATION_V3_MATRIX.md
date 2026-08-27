# Workspace schema v3 存储迁移矩阵

状态：implementation contract
日期：2026-08-27
对应蓝图：`plans/luozhuo-learning-workbench-v3-blueprint.md` S1

## 目的

本矩阵是 pre-v3 浏览器数据进入 Workspace v3 的权威清单。迁移实现不得只扫描“看起来常用”的 key，也不得因为某条记录缺少项目关系就猜测归属。

固定规则：

- 23 个活跃 key 和 2 个独立 legacy key 全部进入只读扫描。
- 源 key 永不由自动迁移删除或改写。
- 解析失败保留原始字符串、错误和来源，不写空 fallback 覆盖源数据。
- 有稳定旧 ID 的记录由持久化 `MigrationIdMap` 映射；无 ID 的记录使用 source key、schema、数组位置与规范化内容指纹形成确定性 `LegacyRef`。
- 只有可由已有 ID/source graph 证明的 project/version 关系才自动连接；其余标记 `needs_assignment`。
- 旧的 `tested/revised` 自我申报只进入课程历史说明，不能生成 Session、Review、ChangeBrief 或版本事实。
- 迁移得到的第一次落桌记录不能生成 PrototypeRun；自由文本不能证明实际运行。

## Key 矩阵

| Source key | 状态 / 已知形态 | 草稿与记录 | v3 目标 | 关系与边界 |
| --- | --- | --- | --- | --- |
| `tabletop-workshop-project-workspace-v2` | active；直接 v2 object | project + checkpoints | `Project`、`ProjectVersion[]` | checkpoint 生成版本；重复 label 不合并；默认海上贸易 seed 不自动算用户项目 |
| `tabletop-workshop-project-workspace-v1` | legacy；直接 v1 object | project + checkpoints | 同上 | 仅在没有有效 v2 时作为候选；缺字段保留 unknown，不用示例默认值补成事实 |
| `tabletop-workshop-learning-node-progress-v2` | active；mode/currentNodeId/nodeStates/drafts | 全局学习进度 | `CourseEnrollment`、`ActivityAttempt`、draft `Artifact` | 旧状态带 `legacy_self_reported`；最高只能证明留下草稿 |
| `tabletop-workshop-learning-node-progress-v1` | legacy；completedNodeIds/drafts | 全局学习进度 | 同上 | 仅在没有有效 v2 时读取；completed 迁为 draft attestation |
| `tabletop-workshop-first-tabletop-v1` | active；单一直接 object、无实体 ID | 一个全局草稿 | `IdeaDraft`、`ChallengeInstance`、draft `Prototype` / `Artifact` | 默认 `needs_assignment`；不生成 Project、Version 或 PrototypeRun |
| `tabletop-workshop-experience-intent-v1` | active；`{schemaVersion:1,draft,records}` | draft + records | `Artifact<experience_intent>` | projectName/version 仅作 legacy hint，不当外键 |
| `tabletop-workshop-core-loop-v1` | active；`{schemaVersion:1,draft,records}` | draft + records | `Artifact<core_loop>` | sourceIntentId 可形成 typed ref；不得读取全局 `records[0]` 重新猜来源 |
| `tabletop-workshop-prototype-scope-v1` | active；`{schemaVersion:1,draft,records}` | draft + records | `Artifact<prototype_scope>` | sourceCoreLoopId 可形成 typed ref；不自动生成 Prototype |
| `tabletop-workshop-single-question-test-plan-draft-v1` | active；`{schemaVersion:1,draft}` | 单一 draft | draft `TestPlan` 或 `LegacyArtifact` | 没有稳定 ID 时使用确定性 LegacyRef；不能生成 tested 事实 |
| `tabletop-workshop-project-v1` | active；裸 PlanRecord 数组 | records | `TestPlan[]` | 已有 projectId 可连接 Project；version 字符串只作 hint，缺 versionId 时 `needs_assignment` |
| `tabletop-workshop-playtest-sessions-v1` | active；`{schemaVersion:1,draft,records}` | draft + sessions | `PlaytestSession[]`、`EvidenceItem[]` | planSnapshot 只在计划 ID 能解析时连接；事件/原话获得稳定 EvidenceItem ID |
| `tabletop-workshop-feedback-v1` | active；v2 object；兼容旧裸数组 | draft + reviews | `EvidenceReview[]` | 必须引用存在的 Session/Evidence；缺来源进入 LegacyArtifact，不生成 reviewed 事实 |
| `tabletop-workshop-evidence-syntheses-v1` | active；v2 object；兼容 v1 | draft + lineage records | `EvidenceSynthesis[]` | 保留 lineageId/revision/parentRecordId；不复制为 Review |
| `tabletop-workshop-version-governance-v1` | active；v1 draft/records | draft + records | `Artifact<version_governance>` | stableId 是内容组件身份，不转换为 ProjectVersion |
| `tabletop-workshop-issue-to-system-v1` | active；v1 draft/records | draft + records | `Artifact<issue_to_system>` | 仅显式 project/version ref 可连接 |
| `tabletop-workshop-redesign-v1` | active；裸数组 | records | `Artifact<redesign>[]` | 数组位置只参与 LegacyRef，不作为公开 ID |
| `tabletop-workshop-constraint-experiments-v1` | active；`{schemaVersion:1,experiments}` | records | `Artifact<constraint_experiment>[]` | 不生成课程完成或项目成熟度 |
| `tabletop-workshop-balance-passes-v1` | active；`{schemaVersion:1,passes}` | records | `Artifact<balance_pass>[]` | 不生成“已平衡”事实 |
| `tabletop-workshop-decision-traces-v1` | active；`{schemaVersion:1,traces}` | records | `Artifact<decision_trace>[]` | 不推断玩家能力或决定质量 |
| `tabletop-workshop-shared-decisions-v1` | active；`{schemaVersion:1,observations}` | records | `Artifact<shared_decision>[]` | 不自动变成 Playtest evidence |
| `tabletop-workshop-theme-reviews-v1` | active；`{schemaVersion:1,reviews}` | records | `Artifact<theme_review>[]` | 与 EvidenceReview 类型分开 |
| `tabletop-workshop-production-ledgers-v1` | active；v1 named collection；兼容裸数组 | records | `Artifact<production_ledger>[]` | 不生成制造可行或报价认证 |
| `tabletop-workshop-publishing-route-maps-v1` | active；`{schemaVersion:1,maps}` | records | `Artifact<publishing_route>[]` | 不自动进入商业发布分支 |
| `tabletop-workshop-teaching-paths-v1` | active；`{schemaVersion:1,paths}` | records | `Artifact<teaching_path>[]` | 不生成 blind-test 通过事实 |
| `tabletop-workshop-accessibility-observations-v1` | active；key 名 v1，内部 v2；兼容内部 v1 | records | `Artifact<accessibility_observation>[]` | 保留 schema 来源；不生成无障碍评分或认证 |

## v3 原生对象（没有 legacy 来源）

以下对象不能由旧自由文本或旧完成标记推断生成：

- `PrototypeRun`；
- 可靠的 `ProjectVersion` freeze digest；
- `IterationCycle`；
- 具有完整 from/to version 的 `ChangeBrief` revision edge；
- `ResourceAttachment`；
- `AgentSuggestion` / `AgentRun`。

## 迁移提交顺序

1. 只读扫描并生成 `LegacyScanReport`；
2. 迁移 Project 与 checkpoint versions；
3. 迁移 intent → core loop → prototype scope → TestPlan；
4. 迁移 Session → EvidenceItem → Review → Synthesis；
5. 迁移其他 typed Artifact；
6. 迁移学习进度与第一次落桌；
7. 校验 ID、typed refs、tombstones、计数与 orphan；
8. 写 v3 revision staging，读回同 digest 后原子切换 manifest。

## 必须具备的 fixtures

- 空工作区；
- 仅 v1 project / learning progress；
- v2 project + v2 learning progress；
- 23 个活跃 key 全量样本；
- Feedback 裸数组、Synthesis v1、Production 裸数组、Accessibility 内部 v1；
- 损坏 JSON、未知 schema、错误 collection 类型；
- 重复 label、重复 legacy ID、无 ID 数组记录；
- Session 撤回 + tombstone + 再次迁移；
- 同名同版本的两个项目，证明不会串线。
