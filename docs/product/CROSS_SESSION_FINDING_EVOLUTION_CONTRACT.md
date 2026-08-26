# 发现演化与版本证据：产品契约

日期：2026-08-21  
状态：实现基线 v2

## 目的

在“现场测试记录 → 单轮证据复盘”之后，帮助设计师人工比较至少两份已完成复盘，形成可回查的发现沿革。工具负责组织判断，不负责替设计师下结论。

## 入口与存储

- 正式工具 ID：`evidence-synthesis`
- 存储键：`tabletop-workshop-evidence-syntheses-v1`
- 存储结构：`{ schemaVersion: 2, draft, records }`
- 迁移：读取 `schemaVersion: 1` 时保守补入沿革字段；已完成草稿不会重新成为可编辑草稿
- 项目完整包工件：`evidence_syntheses`
- 来源：`tabletop-workshop-feedback-v1` 中 `schemaVersion: 2` 的已完成 `records`

## 不变量

1. 至少两份已完成复盘才能冻结来源。
2. 来源快照保留 review/session ID、版本、问题、语境、发现、边界、反证、改动轴和直接证据引用。
3. 关系必须由用户逐份选择：支持、反驳、收窄、不可比、仅作背景。
4. 生命周期必须由用户选择：暂定、保留、收窄、拆分、被反驳、退役。
5. “拆分”要求两个分支各有发现表述与适用边界。
6. 保存综合不会修改来源复盘，也不会修改项目。
7. 项目下一步只通过单独的显式复制动作写回。
8. 已保存记录不可原地覆盖；只读重开后，内容变化必须创建新 ID 的后继修订。
9. 后继修订必须保存相同 `lineageId`、新的 `revision`、直接 `parentRecordId`、`revisionReason` 与新时间。
10. “最新”只表示该沿革中的最大修订号或较晚保存时间，不表示更正确、已批准或证据更强。
11. 项目写回只接受当前只读打开的已保存记录，避免把未完成草稿复制成项目决定。
12. 会话撤回会在当前站点存储中级联删除引用该会话的复盘、直接综合与所有后继综合；导出副本不受本站控制。

## schema v2 核心字段

```text
SynthesisDraft
├── id / lineageId / revision / parentRecordId
├── revisionReason / createdAt / completedAt
├── selectedReviewIds[]
├── sources[]
│   ├── reviewId / sessionId
│   ├── sourceVersion / targetVersion / completedAt
│   ├── question / context
│   ├── finding / appliesWhen / counterEvidence
│   ├── changedAxis / concreteChange
│   └── evidenceRefs[]
├── relations{reviewId: relation}
├── sharedQuestion / heldComparable / materialDifferences / notComparableReason
├── currentStatement / applicability
├── negativeCase / rivalExplanation / missingConfiguration
├── lifecycle / rationale / whatNotClaiming / nextComparison
├── branchAStatement / branchABoundary
├── branchBStatement / branchBBoundary
└── projectNextAction
```

## 导出边界

导出声明必须包含：`schema_version: 2`、不可变完成记录、显式后继修订、人工来源选择、人工关系判断、无自动发现、无自动聚类、无多数表决、无自动生命周期、无严重度、无频次优先级、无跨版本假复现、无因果证明、无静默项目写回与本地撤回级联。

## 修订状态转换

```text
未完成草稿 ──保存──> 不可变记录 r1
不可变记录 rN ──只读重开──> 不改变任何内容
不可变记录 rN ──创建后继──> 可编辑草稿 r(max+1)
后继草稿 ──写明理由并保存──> 新不可变记录
来源会话撤回 ──沿派生关系──> 清除直接记录与全部后继
```

允许从较早修订创建分支，但修订号仍取该沿革当前最大值加一，父记录保持为用户实际选择的旧修订。这样既保留分支来源，也避免重复修订号。

## 视觉基线

- `design/concepts/evidence-synthesis-evolution-matrix.png`  
  SHA-256: `7a8e95501a3235117affaa5910e3d7bb4b68d2308a25c85ac00b236f044815b8`
- `design/concepts/evidence-synthesis-lineage-decision.png`  
  SHA-256: `2c0a4d347a12b40be3a296a82da65ffbe271be83504eec647a1599e911efc20e`

概念图用于校准信息层级，不是像素级验收。代码保留本站纸张、蓝色结构线、红色反例标记与低圆角编辑工作台语言。
