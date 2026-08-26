# 本地项目护照与完整导出

状态：implemented-v2
日期：2026-08-26

## 要解决的问题

网站已有六阶段指南和多种记录工具，但原“当前项目”只是写死的演示文本。每种工具独立写入浏览器存储，用户看不见这些产出是否正在推进同一版本，也无法一次带走完整项目。

本地项目护照将“我正在设计什么、这一版只问什么、下一步做什么”固定在首页，并把分散工具记录汇入一次导出。它不是项目管理后台，也不自动评价进度。

## 核心任务

1. 写项目名、目标玩家、人数、时长和一句体验意图；
2. 固定本轮设计边界、玩家目标与结束、主要行动、回合结构和组件范围；
3. 标记当前版本与六阶段之一；
4. 每个版本只保留一个当前问题和一个下一步动作；
5. 保存版本节点，记录这次具体改变了什么；
6. 查看本机已有的工具记录数与版本节点数；
7. 导出项目护照、全部版本节点和工具记录；
8. 从本站项目包恢复项目护照，但不自动把外部工具记录写回本机。

## 数据契约

```yaml
project_workspace:
  schema_version: 2
  id: string
  title: string
  audience: string
  player_count: string
  duration: string
  experience_intent: string
  design_boundaries: string
  goal_and_end: string
  turn_structure: string
  component_scope: string
  version: string
  stage: experience_intent|core_system|minimum_prototype|playtest_feedback|rules_information|presentation_release
  current_question: string
  next_action: string
  checkpoints:
    - id: uuid
      version: string
      stage: string
      current_question: string
      next_action: string
      change_summary: string
      created_at: datetime
  updated_at: datetime
```

浏览器键：`tabletop-workshop-project-workspace-v2`。读取旧 `v1` 时保留已有项目、版本与检查点，并只用明确的 v2 默认字段补齐新结构；不会根据项目名或日期猜测缺失内容。

完整导出固定包含：

```yaml
schema_version: 2
method: local-project-workspace-export
local_first: true
single_active_project: true
project: project_workspace
artifacts:
  test_plans: []
  playtest_sessions: []
  feedback: []
  redesigns: []
  constraint_experiments: []
  balance_passes: []
  decision_traces: []
  shared_decisions: []
  theme_reviews: []
  production_ledgers: []
  publishing_route_maps: []
  teaching_paths: []
  accessibility_observations: []
  experience_intent_records: []
  core_loop_records: []
  version_governance_records: []
  prototype_scope_records: []
  issue_to_system_records: []
exported_at: datetime
```

## 有意边界

- 首版只支持一个活动项目；不能建立多个项目、切换项目或自动判断记录归属。
- 现有工具记录没有 `project_id`，因此导出前必须由用户确认本机记录都属于当前项目。
- “记录数”不是进度、质量或成熟度分数；零记录也可能是尚未使用本站工具。
- 版本标签是用户文字，不自动排序，也不假定语义版本规则。
- 保存版本节点不复制原型文件、图片、规则书或外部链接；这些仍需用户自行管理。
- 本地优先不等于备份；清除浏览器数据会丢失记录，重要项目必须定期导出。
- 完整导出不上传、发送或同步数据；文件由用户自行保管。
- 导入只恢复项目护照和其中已有的版本节点，不把导出包里的工具记录自动写回浏览器；页面必须提示用户重新核对本机工具记录归属。
- 内容版本治理记录固定声明不构成兼容认证或稀有度推荐；项目包汇总不会改变该证据边界。
- 体验意图记录固定声明不生成乐趣分、玩家画像或最佳机制推荐；核心循环记录固定声明不生成循环质量分、最优机制、玩家体验结论或静默意图推断；原型范围记录固定声明不生成保真度总分或最少内容推荐；议题到系统记录固定声明不生成社会影响分、学习结论或代表性认证。
- `test_plans` 保存单问题测试计划历史；它固定声明不生成乐趣分、样本代表性、因果证明、发行认证或静默范围推断。记录数和证据链齐全都不是测试通过。
- `playtest_sessions` 保存与计划快照绑定的现场会话；事件数量不是严重度，关系标签不是自动结论，同意确认不是法律认证，本地撤回也不会自动删除外部副本。
- `feedback` 读取证据复盘 schema v2 的 `records`；旧版数组仍可在首次迁移前被项目包读取。保存复盘不会自动改变项目，只有用户显式复制下一问题/变更后才更新 `nextAction`；来源会话撤回会清除本站本地关联复盘，但无法追回导出副本。

## 迁移方向

若未来支持多项目，先给所有工具记录补可选 `project_id` 和 `version_id`，再提供显式迁移界面。不得按标题、版本字符串或创建日期猜归属。旧记录应进入“尚未归档”队列，由用户逐项确认。

## 完成信号

- 刷新后项目护照和版本节点仍在；
- 打开测试计划时版本与当前项目一致；
- 从工具页返回首页后记录数更新；
- 完整导出包含页面显示的项目和全部本地工具记录；
- 用户能说出“当前问题”和“下一步”不同；
- 用户知道当前只维护一个项目且本地数据需要自行备份。
