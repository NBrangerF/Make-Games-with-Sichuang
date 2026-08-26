# 证据复盘与变更简报：产品契约

更新：2026-08-21  
工具 ID：`feedback`  
本地存储：`tabletop-workshop-feedback-v1`，schema v2

## 用户结果

把一场已完成测试中的原事件和局后回答，整理成可回查、有适用边界的发现；再由设计者明确决定保护、修改、继续调查、暂存或不改，并生成下一版本可复测的变更简报。

## 四步状态机

1. **承接会话**：选择已完成会话，冻结 ID、完成时间、来源计划、项目、版本、主问题、实际语境和证据池。
2. **选择证据**：人工选择事件或局后回答；显示关系计数，但不排序、不自动选择、不下结论。
3. **形成发现**：必填发现陈述、适用条件、反证/其他解释和仍缺证据。
4. **版本决定**：必填处理动作、理由、保持项、目标版本、回退信号和下一问题；选择“修改”时还必填至少两个候选方案、拒绝方案、单一变化轴和具体改动。

## 数据契约

```text
Store v2
├── schemaVersion: 2
├── draft: ReviewDraft | null
└── records: ReviewRecord[]

ReviewRecord
├── sourceSessionId / sourceSessionCompletedAt / sourcePlanId
├── projectName / sourceVersion / sourceQuestion / sourceContext
├── evidencePool[] / selectedEvidenceIds[]
├── findingStatement / appliesWhen / counterEvidence / missingEvidence
├── disposition / rationale / keepSame
├── candidateSolutions / rejectedOption
├── targetVersion / changedAxis / concreteChange
└── rollbackSignal / nextQuestion / completedAt
```

旧版数组读取时迁移为历史记录，使用 `schemaMigratedFrom: 1`；原话和摘要保留，来源、版本、条件、反证与缺失均标为未记录。迁移记录不能因此被视为完整证据复盘。

## 不变量

- 只导入 `state === completed` 的现场会话。
- 原会话导入后不被复盘修改。
- 数量只用于回到原始记录，不生成严重度。
- 玩家建议不自动成为候选或待办。
- 保存复盘不会写回项目。
- 完整保存后才能显式复制为项目下一步。
- 撤回来源会话时，按 `sourceSessionId` 清除本地派生复盘和关联草稿。
- 两步确认新建草稿，历史记录不被覆盖。

## 导出声明

JSON 方法名为 `evidence-review-and-change-brief`，显式包含：本地优先、无自动洞察、无自动严重度、无频次优先级、不从建议自动生成方案、无因果证明、无静默项目写回、来源撤回只级联本站本地副本。

## 视觉规范

- [桌面工作台概念图](/Users/shawn.fsc/Documents/ChatGPT/游戏设计/design/concepts/evidence-review-workbench-desktop.png)，SHA-256 `082959cfcf76730c7f25614e6047a1b6f0015a0eb0c57af2578078d5cf8afa28`
- [版本决定概念图](/Users/shawn.fsc/Documents/ChatGPT/游戏设计/design/concepts/evidence-review-workbench-decision.png)，SHA-256 `44c2fcc5b0a09abfef961db7923bd8ba2d7f8edf3c6a85e980add2f140e799e1`

两图由内置 Imagegen 生成并人工检查，作为结构/色彩规范而非实现截图：暖白纸面、钴蓝结构线、砖红证据标记、宋/明体标题、低圆角、无评分仪表盘。

