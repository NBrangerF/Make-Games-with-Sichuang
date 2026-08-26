# 议题到系统工作台

状态：implemented / static-validation-passed / browser-validation-blocked  
更新：2026-08-21

## 产品任务

把第 31 篇专题指南从阅读材料变成一个可保存、可导出、可进入项目包的形成性工具。它帮助新手把社会、文化或教育议题翻译成可被原型反驳的系统关系；不替用户判断正确立场，也不生成伦理、学习或社会影响分。

这是“落桌”既有功能中的扩展，不是视觉重设计。实现沿用现有宋体标题、钴蓝活动态、砖红边注、细规则线、低圆角、宽编辑器/窄摘要和移动端横向步骤轨道，因此没有另做 Image Gen 概念稿。

## 五步与产物

| 步骤 | 必须留下 | 防止的捷径 |
|---|---|---|
| 01 系统主张 | 议题、目标玩家、可反驳关系、设计者位置、直接受影响者、修改/停止权 | 把“让玩家了解”当成可测试目标 |
| 02 六字段翻译 | 角色、权限、资源、约束、反馈、时间尺度 | 只写机制名或背景故事 |
| 03 遗漏账本 | 删除内容、当前理由、误读风险、复核责任；可增加多项 | 把抽象当成中立删减 |
| 04 重复决策 | 出现情境、玩家选择、系统回应、反馈可见性、更名检查、外挂内容处理 | 用问答卡和结论卡替系统表达 |
| 05 三层验证 | 系统行为、玩家解释、受影响者/领域审阅、复盘边界、反驳信号、单字段下一版 | 用一种证据替另一种背书 |

## 本地数据契约

浏览器键：`tabletop-workshop-issue-to-system-v1`。

```yaml
schemaVersion: 1
draft:
  projectName: string
  version: string
  issue: string
  audience: string
  systemThesis: string
  designerPosition: string
  affectedStakeholders: string
  reviewAndChangeRights: string
  system:
    actors: string
    permissions: string
    resources: string
    constraints: string
    feedback: string
    timescale: string
  omissions:
    - id: uuid
      omitted: string
      reason: string
      misreadingRisk: string
      reviewOwner: string
  repeatedSituation: string
  playerChoice: string
  systemResponse: string
  feedbackVisibility: string
  renameCheck: string
  detachedContent: string
  systemEvidence: string
  playerInterpretation: string
  stakeholderReview: string
  debriefRole: string
  disconfirmingSignal: string
  nextChange: string
records: IssueRecord[]
```

草稿和记录每次更新都写入版本化 localStorage。读取失败或版本不支持时回到安全空数据；不会上传、同步或自动合并其他设备的数据。清空草稿需要连续两次动作，且不删除已保存记录。

## 保存形成门

保存不是质量通过，只证明草稿已经可测试。必须满足：

1. 主张、位置、受影响者和修改权都有文字；
2. 六字段全部对应系统内容；
3. 每项遗漏都有理由、误读风险和责任人；
4. 行动—反馈链与更名检查完整；
5. 三层证据、复盘边界、反驳信号和单字段下一版完整。

形成门没有总分、百分比、最佳字段长度或固定遗漏数量。至少保留一项遗漏，是为了强制记录当前不知道什么，不是准确性认证。

## 导出契约

独立 JSON 导出固定包含：

```yaml
schema_version: 1
method: issue-to-system-workbench
local_first: true
no_social_impact_score: true
no_learning_outcome_claim: true
no_representativeness_certification: true
evidence_boundary: string
draft: IssueDraft
saved_records: IssueRecord[]
exported_at: datetime
```

完整项目包把记录放在 `artifacts.issue_to_system_records`。旧记录没有 `project_id`，因此仍由用户在导出前确认归属。

## 响应式与加载边界

- 1000px 以下摘要移到编辑器下方，取消 sticky；
- 720px 以下表单和六字段改单栏，步骤轨道在自身容器横向滚动；
- 工具作为独立动态 chunk，只在指南直达或工具导航打开时加载；
- 草稿初始化使用惰性 state，摘要只对行动链和完整遗漏数做派生计算。

## 验证

- `pnpm qa:issue-to-system`：18/18 个结构守卫通过；
- `node --check scripts/qa-site.cjs`：浏览器脚本语法通过，并已包含完整填写、保存、导出、项目汇总与 375px 断言；
- `pnpm check`：TypeScript 通过；
- `pnpm build`：工具生成独立 17.70 kB（gzip 5.70）动态 chunk；主 JS 486.46 kB（gzip 148.64），没有把工作台并入首屏；
- 真实浏览器仍被既有端口、文件 URL 与浏览器进程策略阻塞，因此没有最新桌面/移动截图、焦点、下载或屏幕阅读器证据；
- 形成性参与者测试尚未运行，不能声称工具帮助用户做出更准确或更安全的表达。
