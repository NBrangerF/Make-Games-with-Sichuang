# 设计辅助闭环真人测试数据契约

状态：可执行测试包，未完成真人测试  
日期：2026-08-21  
对应协议：`USABILITY_TEST_DESIGN_AID_LOOP.md`

## 目的

这套数据文件只帮助主持者一致地记录 T1–T6 的可用性证据。它不保存设计辅助练习本身，不评价参与者的创意，也不证明原型提高设计质量。

## 文件

- `design-aid-loop-session-schema.json`：机器可读字段边界；
- `design-aid-loop-session-template.json`：安全空白模板，默认未同意、无身份、无录音、仅本地；
- `design-aid-loop-session-example.json`：虚构记录，演示严重问题如何触发修订和复测；
- `scripts/validate-design-aid-loop-session.mjs`：条件语义、隐私与拒绝分支守卫；
- `pnpm qa:design-aid-session`：运行全部检查。

## 会话流程

1. 复制空白模板，为本轮保留原文件不变。
2. 用 `P01` 这类不指向身份的别名；姓名、联系方式和招募映射不进入仓库。
3. 先解释参与、笔记与退出，取得同意后才把 `sessionStatus` 改为 `completed`。
4. 逐一完成 T1–T6，记录实际动作、第一次偏离、简短原话和主持介入。
5. 严重或 critical 问题必须有候选修订、`retestRequired: true` 和复测计划。
6. 运行 `pnpm qa:design-aid-session`；校验通过只证明记录结构满足契约。
7. 参与者撤回时删除其本地会话文件；本包没有远程同步或站外删除能力。

## 证据分区

| 字段组 | 回答的问题 | 不能推出 |
|---|---|---|
| `observedActions` / `firstDeviation` | 人在具体界面状态下做了什么 | 原因、群体比例、普遍效果 |
| `participantWords` | 当时怎样解释任务 | 隐性动机或所有玩家观点 |
| `facilitatorIntervention` | 主持何时改变了任务条件 | 无提示使用也会成功 |
| `taskData` | T1–T6 的关键边界是否出现 | 设计质量或学习成效 |
| `severity` / `candidateRepair` | 本版本下一步优先处理什么 | 唯一修法或统计显著性 |

## 隐私边界

允许：非识别别名、简短任务原话、实际动作、主持介入、候选修订、删除日期。  
禁止：真实姓名、联系方式、出生日期、录音路径、原始录音、完整逐字稿、招募映射。`screenRecording` 必须保持 `false`。

私有反思只记录“是否被保存、是否被分享排除、是否被删除”三个状态，不把反思正文复制进测试文件。分享预览包含私有反思会被校验器拒绝。

## 不计算总分

校验器递归拒绝 `score`、`rating` 和 `totalScore`。原因不是排斥量化，而是首轮的严重问题不能被其他任务的顺利完成平均掉。模式误选、自测冒充外部证据和私有反思泄露必须按任务修复与复测。

## T5 的硬边界

- `preparation`：只完成测试计划或招募条件；
- `self_test`：由设计者自己走查；
- `external_test`：目标参与者实际在场。

若 `actualTargetParticipantsPresent` 不是 `true`，记录不能使用 `external_test`。`selfTestLabeledAsExternal` 永远必须是 `false`。

## 发布边界

`nextResearchStep` 只有 `hold / repair_and_retest / add_session`，没有 `publish`。即使单份记录没有严重问题，也不能单独打开产品发布门；仍需完成协议规定的样本与跨会话判断。

当前校验覆盖 15 项：2 个有效样本与 12 个拒绝分支，加 1 项 schema 元数据检查。它不替代 JSON Schema 通用实现、伦理/法律审阅、浏览器测试或参与者验证。

