# 落桌：系统学习 × 设计工作台 V3 迭代蓝图

状态：implementation-ready（对抗性复审：GO WITH CHANGES；三项 P1 已并入硬合同）
制定日期：2026-08-27
代码基线：`29443703a1a32ed621ce1a569228b7943aa1e84e`（`feat(learning): add design materials and action paths`）
执行环境：本地仓库 `main`，当前没有 Git remote；每个 S 里程碑使用独立本地分支与原子提交，配置远端后一个里程碑对应一个 PR
适用范围：产品定位、信息架构、课程运行、设计工作台、local-first 数据、迁移、上下文交接、内容重编与验收

> 本蓝图吸收 2026-08-27 反馈全文，并以当前代码、内容、产品合同和 QA 脚本为实施基线。它取代“继续优化四状态学习首页”这一前提；现有内容和深链保留，但产品主线改为两个任务。

## 0. 结论先行

下一版不再把“第一次落桌、基础工作室、观察实验室、原型迭代、问题资源、mechanic、theme”并列交给新手选择。

落桌只保留两个主产品：

1. **系统学习**：产品负责排序，学习者依次完成 9 个单元、两个独立微型原型和一个持续项目。
2. **设计工作台**：用户选择“开始新构想”或“继续已有项目”，随后进入真实的构想、原型、测试与改版流程。

所有资料、mechanic、theme、案例、程序性知识和专业工具组成共享支持层，只在当前任务中按需出现。

本轮最重要的工程工作不是再写一批入口文案，而是先建立四个可信基础：

- 清楚的课程主干；
- 稳定且多实例的项目对象；
- 由真实产物 ID 驱动的状态门；
- 刷新后仍能恢复的上下文交接。

LLM Agent 不进入 P0/P1。确定性代码先拥有课程顺序、状态、权限、版本和写入；模型以后只提供可接受或拒绝的建议。

---

## 1. CAPABILITY

### 1.1 用户结果

第一次接触桌游设计的人进入落桌后，不需要先判断自己处于哪个专业阶段，也不需要自己编排课程。他可以：

- 在“系统学习”中看到唯一明确的下一单元，阅读、观察、制作并留下可核对的产物；
- 在“设计工作台”中从一种起点形成构想，做出微型原型，或选择一个已有项目进入下一轮测试；
- 在需要时获得少量相关资料、案例、材料和工具，完成后回到原任务；
- 清楚区分“我完成了一个学习活动”和“这个项目版本实际被落桌、测试、复盘或改版”；
- 导出完整的课程产物、构想、项目、版本、测试、证据与来源关系。

### 1.2 产品定位

落桌是一套**中文桌游设计学习与实践系统**，不是：

- 机制百科的包装；
- 从零到出版的十二步法；
- 只服务已有原型的填表工作流；
- AI 自动生成桌游的聊天工具。

### 1.3 外部命名

- 导航名称：`系统学习`、`设计工作台`。
- 首页第二张卡标题：`开始或推进一个桌游`。
- `Ideation / 构想` 只作为设计工作台中的子流程。
- 前台继续呈现“节点、思维、工具、动作、产物”，不展示能力等级、能力分数或年龄等级。

---

## 2. CONSTRAINTS

### 2.1 固定产品规则

1. 首页 Hero 只有两个主要 CTA；资料库只保留一条次级入口。
2. 系统课程负责顺序，不让初学者从课程地图自行拼路线。
3. 课程 Dashboard 默认只突出“继续当前单元”；完整 syllabus 默认折叠。
4. 设计工作台第二层只问“开始新构想 / 继续已有项目”。
5. 新构想一次只选一个主要驱动力：体验、mechanic、theme/现实系统、组件/限制、规则改造。
6. mechanic 与 theme 不再强制配对；它们是材料和反向检查，不是创作配方。
7. 一次最多形成 3 个结构上不同的构想方向；不生成大量换皮方案。
8. 没有 `project_id + version_id`，不能进入项目迭代 cycle。
9. 文本输入只能形成草稿或 Artifact，不能单独证明落桌、测试、复盘或改版。
10. 项目状态由真实关联记录推导，不由用户直接勾选。
11. 课程状态与项目状态分别存储、分别解释，不相互冒充。
12. 所有主流程页面只有一个主要任务、一个主要 CTA，最多两个次级操作。
13. 现有内容、资源、工具和稳定深链尽量保留；旧路径通过别名和迁移进入新结构。
14. 继续 local-first；P0/P1 不增加账号、云同步、班级管理、排名或自动评分。
15. 任何示例必须显式标为示例。当前海上贸易项目不得继续静默成为用户默认项目。
16. 自动化测试必须执行真实交互和刷新恢复，不能只检查源码里有没有某个字符串。

### 2.2 信任与证据不变量

- `PlaytestSession` 才能使相应版本获得“已测试”事实；测试计划不能。
- `EvidenceReview` 必须引用既有 session；不能从空白页凭空生成证据。
- `ChangeBrief` 必须引用 review；创建下一版本必须明确 `from_version_id` 与 `to_version_id`。
- 玩家原话、现场事件和原始观察不得被建议或总结静默覆盖；修正采用追加更正或新修订。
- 资源附件、示例、设计者解释、Agent 建议和测试证据使用不同类型，不可混存。
- 记录数、完成率、版本数与测试次数都不是作品质量、设计水平或“好玩程度”分数。

### 2.3 内容与权利边界

- 课程正文以本站原创、可合法使用的开放内容和有来源边界的综合为主。
- 三款入门比较游戏优先采用本站原创微型游戏，避免把拥有或熟悉商业桌游作为课程前置条件。
- BGG 只作为未来按需元数据来源；注册、署名、许可、缓存和 API 条款未完成前不接入。
- 视频不承载文本中无法取得的必修信息；必须有字幕和完整文本稿。

### 2.4 技术边界

- 当前栈保持 React + TypeScript + Vite + Playwright。
- 数据仍保存在浏览器本地，但改为单一 schema v3、数组化、多实例、稳定 ID。
- v1/v2 键只读保留到迁移完成并经过真实恢复演练；不得自动删除。
- 不按项目标题、版本字符串或创建日期猜测旧工具记录归属。
- `src/App.tsx` 已过度集中；新能力进入独立 domain、course、workbench 和 navigation 模块，不继续向其中堆积大段业务逻辑。

---

## 3. IMPLEMENTATION CONTRACT

### 3.1 信息架构

```text
落桌
├── 系统学习                         主任务 A
│   ├── Course Dashboard
│   ├── Unit Runner（9 单元）
│   └── syllabus（默认折叠）
├── 设计工作台                       主任务 B
│   ├── 开始新构想
│   └── 继续已有项目
├── 资料库                           共享支持层
│   ├── 怎么做：程序性知识
│   ├── mechanic / pattern
│   ├── theme / 系统关系
│   ├── 案例
│   └── 工具与模板
└── 我的项目                         对象管理与恢复
```

建议全局导航：`落桌 | 系统学习 | 设计工作台 | 资料库 | 我的项目 | 搜索`。

旧 `#learn/*` 深链继续解析；上线新结构时增加明确别名和返回说明，不让旧书签落到空页。

### 3.2 系统课程：9 个单元

| 单元 | 当前要完成的动作 | 必须留下的产物 | 主要复用资产 | 新建/重编重点 |
| --- | --- | --- | --- | --- |
| 1. 从玩家变成设计观察者 | 比较三款短游戏中实际发生的行为 | 三款游戏比较记录 | 观察节点、`learn-by-playing-one-moment` | 三款原创微型游戏；比较工具；示例/反例/量规 |
| 2. 用共同语言拆解游戏 | 用目标、行动、状态、信息、反馈、结束画出结构 | 一页游戏结构图 | 观察节点、概念词表、核心循环内容 | 统一结构图工具；持续案例 |
| 3. 体验意图与设计简报 | 写明哪些玩家通过什么行动经历什么 | 体验意图与设计边界 | systematic unit 01、体验意图卡 | 改为课程活动；完成示例与反例 |
| 4. 决定、信息与互动 | 追踪一个决定的代价、信息和他人影响 | 决定线与信息地图 | systematic units 02/03、决定轨迹、共同决定 | 合并重复术语；标注式案例 |
| 5. 目标、回合、资源与核心循环 | 让一次行动改变状态并返回下一决定 | 游戏骨架与核心循环 | systematic unit 02、核心循环画布及专题指南 | 新增游戏骨架模板；控制字段负担 |
| 6. 第一款微型游戏 | 从一种起点做出可运行数轮的版本 | 微型原型 A | 第一次落桌、材料卡、原型范围工具 | 多实例 Challenge；取消强制配对；创建 v0.1 |
| 7. 测试、证据与改版 | 执行一场真实测试并据此形成改动 | TestPlan、Session、Review、ChangeBrief | systematic units 05/06、现有四类测试工具 | 硬状态门；同一 iteration 关系；不允许虚构跳步 |
| 8. 第二款不同原型 | 换一种起点或系统关系再次完成微型游戏 | 微型原型 B 与迁移反思 | 第一次落桌骨架、材料卡 | A/B 并存；确定性差异检查；比较反思 |
| 9. 发展一个完整项目 | 选择方向，完成多版本迭代、规则快照与回顾 | 版本历史、规则快照、postmortem | 项目护照、版本治理、规则/教学资源 | 不把“单元完成”称作作品完成或可出版 |

资产审计结论：Unit 7 的现有内容最完整，Units 3/4/6 也有足够强的正文和工具基础；主要不是“再写一门课”，而是建立运行与产物关系。真正需要净新增的是 Unit 1 的三游戏比较活动（现有《小动物过河》材料可整理为三款原创样例之一）、Unit 2 的完整示范与统一结构图、Unit 5 的目标/回合/资源桥接、Unit 8 的第二原型与迁移反思、Unit 9 的 capstone/postmortem。Unit 3 还需把体验意图卡与设计简报合为一次正式检查点；Unit 4 需要统一的“决定—信息—互动”因果图；Unit 6 需要把原型/简报/首测收入同一项目档案。

### 3.3 标准 Unit Runner

每个单元使用同一页面语法：

1. `本单元你要完成什么`：一个可观察动作，不用“了解/掌握某能力”。
2. `核心文本`：8—15 分钟，术语首次定义，包含边界与反例。
3. `桌面演示`：可选 3—6 分钟视频或等价可访问演示；有字幕和全文稿。
4. `标注案例`：玩家看见什么 → 比较什么 → 做了什么 → 改变什么 → 何时收到反馈。
5. `小练习`：要求比较、操作或制作，不是态度问卷。
6. `嵌入工具`：基础字段直接在单元内；高级模式才打开完整工具。
7. `产物`：保存为 `Artifact`，显示写入位置。
8. `核对`：完成示例、反例、3—5 项诊断量规；P0/P1 不需要 LLM。
9. `主要按钮`：只显示“进入下一单元”或当前未满足的唯一下一动作。
10. `进一步学习`：资料、案例、概念放在折叠区，不与主 CTA 竞争。

### 3.4 两套状态机

#### 课程状态

```text
not_started
  → learning
  → exercise_complete
  → artifact_submitted
  → reflection_complete
  → unit_complete
```

课程状态回答“这个学习活动是否完成”。它可以引用项目 Artifact，但不能改写项目事实。

#### 项目/版本事实集合（不是线性状态机）

同一项目的不同版本可以同时拥有不同事实；旧版本被测试后仍可继续保留，solo test 也不会被 external test “升级并覆盖”。`revised` 不是单个版本的属性，而是 `source_version --ChangeBrief--> target_version` 的有向边。

项目页面只为当前版本计算以下事实集合：

```text
has_prototype
has_tabletop_run
has_solo_test
has_external_test
has_evidence_review
has_outgoing_revision
```

事实由记录和关系推导：

| 前台表述 | 必要证据 |
| --- | --- |
| 已起草 | `artifact_id` |
| 已落桌 | `prototype_id` + 同版本、`completed`、未 tombstone 的 `prototype_run_id` |
| 已自测 | 指向该版本的 `playtest_session_id`，且 `kind = solo` |
| 已外部测试 | 指向该版本的 `playtest_session_id`，且 `kind = external/guided/blind` |
| 已复盘 | 指向有效 session 的 `evidence_review_id` |
| 已修订 | 当前 source version 存在 `change_brief_id`，且该 brief 已创建有效 `target_version_id` |

UI 不提供直接切换这些事实的下拉框。状态展示由 selector 计算；若记录缺失，按钮应引导创建缺失对象。每个 selector 都必须有关系真值表和负向 fixture。

`ProjectVersion` 具有 `working | frozen` 生命周期：确认第一份 TestPlan 时冻结内容摘要和 digest；Session 必须引用该 digest。冻结后修改设计内容只能由 ChangeBrief 创建新版本。P0 默认一个 version 同时只有一个 active cycle；需要并行实验时先显式创建分支版本。

每个 `ActivityDefinition` 自带版本化 completion predicate，明确需要哪些 typed refs。若其引用的 Session 后来撤回，课程保留“曾完成”的历史，但 ActivityAttempt 标记 `evidence_unavailable`；它不能继续满足项目事实或 Unit 9 capstone 门，页面必须引导重新提供证据。

### 3.5 local-first schema v3

单一工作区信封：

```ts
type LocalWorkspaceV3 = {
  schemaVersion: 3
  workspaceId: string
  revision: number
  collections: {
    courseEnrollments: CourseEnrollment[]
    activityAttempts: ActivityAttempt[]
    artifacts: Artifact[]
    ideaDrafts: IdeaDraft[]
    challengeInstances: ChallengeInstance[]
    projects: Project[]
    projectVersions: ProjectVersion[]
    prototypes: Prototype[]
    prototypeRuns: PrototypeRun[]
    iterationCycles: IterationCycle[]
    testPlans: TestPlan[]
    playtestSessions: PlaytestSession[]
    evidenceItems: EvidenceItem[]
    evidenceReviews: EvidenceReview[]
    evidenceSyntheses: EvidenceSynthesis[]
    changeBriefs: ChangeBrief[]
    resourceAttachments: ResourceAttachment[]
    agentSuggestions: AgentSuggestion[]
    agentRuns: AgentRun[]
    tombstones: Tombstone[]
  }
  active: {
    enrollmentId?: string
    projectId?: string
    versionId?: string
    iterationId?: string
  }
  migration: MigrationReport
  updatedAt: string
}
```

内容拥有、不是用户记录的 `CourseUnit` 与 `ActivityDefinition` 放在版本化目录中；用户侧保存 `course_version`、`unit_revision`、`activity_definition_revision`、attempt、artifact 引用和定义摘要。课程升级不静默重解释旧 Attempt：旧 enrollment 默认冻结，用户显式升级时创建新的 enrollment 并记录迁移映射。

#### 最低关系要求

| 对象 | 必要关系/字段 |
| --- | --- |
| `CourseEnrollment` | `course_id`、`course_version`、当前单元、开始/更新时间 |
| `ActivityAttempt` | course/unit/activity IDs 与定义 revision、`attempt_id`、状态、typed artifact refs、completion attestation |
| `Artifact` | `artifact_id`、版本化判别类型、来源 activity/idea/project、创建/更新时间；专业实体只存 `entity_ref`，不复制 payload |
| `IdeaDraft` | `idea_id`、单一 `starting_driver`、约束、候选方向、已选方向 |
| `ChallengeInstance` | `challenge_instance_id`、用途 A/B/独立练习、idea/artifact/prototype 关系 |
| `Project` | `project_id`、名称、来源、创建/更新时间；不保存虚假的整体成熟度 |
| `ProjectVersion` | `version_id`、`project_id`、标签、冻结摘要、`from_version_id`、创建原因 |
| `Prototype` | `prototype_id`、`version_id`、材料/规则骨架；不以内嵌自由文本证明运行 |
| `PrototypeRun` | `run_id`、prototype/version refs、实际配置、开始/结束时间、`completed|aborted`、结构化事件、tombstone 状态 |
| `IterationCycle` | `iteration_id`、`project_id`、`version_id`、最大不确定性、当前步骤 |
| `TestPlan` | `test_plan_id`、`iteration_id`、问题、支持/反驳信号、范围、停止条件 |
| `PlaytestSession` | `playtest_session_id`、`test_plan_id`、`version_id`、类型、事件/原话、时间 |
| `EvidenceItem` | 稳定 event/quote/observation ID、session 关系、类型、时间点；复盘引用而不复制 |
| `EvidenceReview` | `evidence_review_id`、session IDs、观察/解释/竞争解释/缺失证据 |
| `EvidenceSynthesis` | `synthesis_id`、lineage/revision/parent、review/evidence refs、适用边界与生命周期 |
| `ChangeBrief` | `change_brief_id`、project/iteration/review IDs、`from_version_id`、`to_version_id`、单一主要改动、不改什么 |
| `ResourceAttachment` | resource ID、绑定的 course/activity 或 project/version/iteration、用途说明 |
| `AgentSuggestion` | Agent 类型、输入上下文 IDs、来源 IDs、建议、接受状态、目标字段 |
| `AgentRun` | routine、模型、时间、输入/输出引用、失败/人工接管记录；不保存为证据 |

`Artifact` 是版本化判别联合，不允许无约束的 `payload: any`。轻量课程产物可内联类型化内容；TestPlan、Session、Review、Synthesis、ChangeBrief 等专业实体只由 Artifact 引用，避免两份真相。无法安全映射的旧记录进入显式 `LegacyArtifactV1` subtype，保留原始快照、来源和不可恢复字段报告，仍不可冒充新实体。

新记录使用带类型前缀的随机 UUID。legacy 迁移使用 `LegacyRef(sourceKey, sourceSchema, legacyId/index, normalizedFingerprint)` 和持久化 `MigrationIdMap`：有稳定旧 ID 时映射该 ID；无 ID 时用规范化内容指纹生成确定性目标 ID。所有引用使用可校验 typed ref 并保留 legacy source。`revision` 配合 compare-and-swap 检测多标签冲突；撤回用含实体类型、删除 revision 和时间的 tombstone 表达，避免旧导入或重迁让材料复活。

只有 `completed` 且未 tombstone、prototype/version 关系有效的 PrototypeRun 才产生 `has_tabletop_run`。ChangeBrief 必须保证 source/target 属于同一项目、`target.from_version_id` 与 brief 一致、一个 brief 只创建一个 target；幂等重复 command 返回既有 target，而不是再建版本。

`LocalWorkspaceV3` 是逻辑信封，不强制把全部长文本写成一个巨大 JSON。repository 可使用分段 collection + revision manifest；每次写入采用 staging、校验、commit pointer 和 last-good snapshot。若 S1 容量 fixture 达到浏览器可用配额的 60%，或 P95 写入超过 250ms，则在开放任何真实 Session 写入前切换 IndexedDB adapter；上层 domain contract 不变。

### 3.6 上下文交接合同

| 起点 → 目标 | 必须带入 | 保存后必须发生 |
| --- | --- | --- |
| 课程 → 工具 | `course_id/unit_id/activity_id/attempt_id` | 创建/更新 Artifact，返回同一单元并显示写入位置 |
| 新构想 → 材料 | `idea_id/starting_driver` | 选择材料后回到同一构想；材料只成为引用 |
| 微型原型 → 项目 | prototype/idea/challenge/artifact IDs | 原子创建 Project + ProjectVersion v0.1，并保留 lineage |
| 项目 → 资料 | `project_id/version_id/iteration_id/current_step` | 生成 ResourceAttachment，回到原步骤 |
| 测试计划 → 现场 | `test_plan_id/version_id` | 创建真实 PlaytestSession |
| 现场 → 复盘 | session ID、事件、原话 | 只允许复盘已存在且同版本的 session |
| 复盘 → ChangeBrief | `evidence_review_id` | 用户确认后创建 ChangeBrief |
| ChangeBrief → 新版本 | `from_version_id/change_brief_id` | 创建唯一 `to_version_id` 并开启下一轮 |

上下文采用一条硬规则：**所有决定工作对象身份的 ID 都进入规范 URL**。`WorkContext` 是 URL parser 产出的类型化值，不使用全局 active selection 替代 project/version/iteration/source IDs；`return_to` 也使用可验证的规范内部 route。active selection 只用于用户打开裸 landing 时提供便利默认值。

权威优先级固定为：显式 URL IDs > 可选的非权威 UI context > active fallback。只要 URL 中的 project/version/iteration 不属于同一关系图，就进入恢复页；不得“修正”为最近记录。刷新、后退和新标签返回后不得丢失来源；双标签分别操作不同项目时不得互相覆盖。

### 3.7 失败与恢复

- 首次进入 v3 前生成迁移预览；旧数据只读，迁移过程幂等。
- 任何 v3 写入开放前必须具备：原始 v3 全量备份、严格校验后整包替换恢复、只读 workspace inspector、last-good snapshot 和下载恢复说明。S11 再补友好预览、合并与分享包。
- 迁移失败时继续打开 legacy 只读视图，提供错误报告和完整旧数据导出，不写半成品 v3。
- 旧完成节点最多迁为课程草稿/Artifact；绝不迁为测试或改版事实。
- 无归属的旧工具记录进入“待归档记录”，由用户选择项目和版本；不自动猜测。
- localStorage 空间不足时保留当前内存状态，阻止假成功提示，并引导导出；是否切 IndexedDB 由容量测试决定。
- 每次写入先做容量预检和 compare-and-swap；revision 冲突显示差异与“重新载入 / 另存副本”，不执行最后写入者静默覆盖。
- v3 导入先校验、预览新增/冲突/跳过数量，再提交；ID 冲突不得静默覆盖。
- Project v0.1 创建使用幂等 command；重复点击不能创建多个同源项目。
- 全量备份可包含隐私记录和 tombstone，用于精确恢复，并在下载前明确提醒；可分享导出默认脱敏参与者标识、排除同意备注、私密反思与已撤回证据。已导出的外部文件无法被本站追回，撤回页面必须明确这一边界。

### 3.8 可观察性

P0/P1 不引入用户行为追踪。诊断证据来自：

- 本地可下载的迁移报告；
- domain command 的开发模式 trace；
- 浏览器 E2E 的对象数量与关系断言；
- 人工可用性测试记录；
- 导出包一致性校验。

这些记录用于判断流程和数据完整性，不生成用户等级或作品分数。

---

## 4. NON-GOALS

以下内容不进入本蓝图的 P0/P1 实施：

- 账号、云同步、多人协作、教师后台、班级管理；
- 社区互评、公开作品广场、活动报名；
- 自动评分、设计师等级、学习能力画像；
- 自动认定游戏好玩、平衡、无障碍、可出版；
- BGG 评论/论坛抓取、训练语料或排行榜推荐；
- 制造、合同、众筹、物流的完整业务系统；
- 全站万能聊天机器人或复杂多 Agent 网络；
- 删除现有资源馆、指南、长文、工具或用户旧数据；
- 一次性重写 87 个内容文件。课程主线和高频交接文案优先，支持性长文按风险分批编辑。

---

## 5. 当前差距矩阵

| 维度 | 当前实现证据 | 目标状态 | 优先级 |
| --- | --- | --- | --- |
| 首页决策 | `learning-home.tsx` 同时展示 4 个任务入口、材料入口和观察入口 | Hero 只有系统学习/设计工作台两个 CTA；资料为次级 | P0 |
| 课程运行 | `learning-workshop-map.tsx` 是完整目录，没有 enrollment、current unit 或 runner | Dashboard + Unit Runner；syllabus 折叠；唯一继续动作 | P0 |
| 课程内容 | 已有观察节点和 systematic units 00—06，但没有统一 activity/artifact/rubric 运行层 | 重编为 9 单元，先交付 1—3 垂直切片 | P1 |
| 课程/项目状态 | `learning-node-progress.ts` 把行动状态当节点进度 | 两套状态机；课程完成不改变项目事实 | P0 |
| 完成逻辑 | generic node 的非空 textarea 可推进 required state | 状态由 Artifact/Prototype/Session/Review/ChangeBrief ID 推导 | P0 |
| 项目对象 | `PROJECT_WORKSPACE_STORAGE_KEY v2` 只支持一个活动项目 | 多项目、多版本、稳定 ID、显式 active selection | P0 |
| 示例边界 | 海上贸易示例静默预填 | 显式“载入课程示例”，新用户默认空工作区 | P0 |
| 第一次落桌 | 单一 v1 存储槽；强制 mechanic + theme；用百分比表现状态 | 多 ChallengeInstance；单一起点；A/B 并存；无虚假进度条 | P0 |
| 新构想交接 | “整理进项目护照”主要是页面跳转 | Idea → Prototype → Project → Version v0.1 原子写入并留 lineage | P0 |
| 已有项目迭代 | 节点顺序已接近正确，但表现为 01/07 线性任务 | 以项目、版本、轮次和当前步骤呈现循环 | P0 |
| 上下文 | 深链较完整，但 `url-state.ts` 只表达页面/工具，不表达工作对象 | 类型化 WorkContext；刷新后恢复；保存后明确返回来源 | P0 |
| 工具数据 | 多个组件直接维护各自 localStorage key，普遍缺项目/版本关系 | domain repository + v3 collections；旧记录进入待归档 | P0 |
| 导出/导入 | v2 可导出许多工具记录，但单项目且导入不恢复全部对象 | v3 全量/项目导出、校验预览、关系完整、冲突处理 | P1 |
| 共享知识层 | 资料、mechanic/theme、工具在首页与主流程争夺注意力 | 当前步骤最多推荐 3 项；使用后附着并返回 | P1 |
| 文案 | 机器审计有 299 个高摩擦候选；主线短节点掩盖了长文问题 | 主线逐句人工编辑；示例、反例、术语与边界清楚 | P1 |
| QA | 多数检查擅长结构/字符串存在；真实状态链覆盖不足 | Playwright 执行创建、刷新、迁移、硬门和完整导出 | P0/P1 |
| Agent | 尚未形成统一 runtime，这反而避免了错误耦合 | 数据/权限稳定后，按上下文逐个加入 suggestion-only routine | P2 |

### 5.1 已知 QA 基线

审计时 `pnpm content:check` 可通过，但额外抽查的 12 项相关专项中有 6 项失败：URL navigation、live session、evidence review、evidence synthesis、version governance、prototype scope。主要原因是导航/工具箱字符串守卫已经落后于当前 UI，并不等同于六项运行时功能全部损坏；但它证明“主构建为绿”尚不能代表关键链可信。

因此 S1 前先保存这份基线，不把历史红项误算为新回归；S2/S7 必须分别修订相应专项，并把关键行为检查纳入最终 build/release gate。

---

## 6. 发布阶段与退出门

| 发布段 | 包含步骤 | 用户可见结果 | 必须满足的退出门 |
| --- | --- | --- | --- |
| R1 数据与导航地基 | S1—S2 | 暂不改变主入口；内部具备 v3 与可恢复上下文 | 迁移幂等、无旧数据删除、路由别名通过 |
| R2 内部产品壳 | S3—S4 | 直接深链可完成 Unit 1、建立/选择项目；首页尚不切换 | 无占位 Unit 1；项目/版本门有效；legacy 仍是公开入口 |
| R3 设计工作台闭环 | S6—S7 | 新构想可建 v0.1；已有项目可完成一次证据化改版 | 硬状态门全部由真实 ID 验证；刷新恢复 |
| R4 两任务候选入口与课程起步段 | S5、S8 | 仅在 staging/feature-flag cohort 启用两 CTA；补齐 Units 2—3 | 两个 CTA 都有完整落点；三单元有示例、反例、量规和 E2E；Production 默认仍旧入口 |
| R5 完整课程主干 | S9—S10 | A/B 微型原型与完整项目学习路线 | A/B 独立；Unit 7 使用真实 session；Unit 9 不冒充出版完成 |
| R6 支持层与可信发布 | S11—S12 | 情境资料、完整导出/导入、人工可读性和发布门 | 全链路、迁移、a11y、移动端、导出一致性与真人任务通过 |

R1 可以隐藏部署；R2 只有在课程壳和工作台壳都可用后才切换首页。每个发布段都保留关闭新入口、继续读取 legacy 数据的回退能力。

---

## 7. 依赖图

```text
S1  schema v3 + migration
 └── S2  route + WorkContext
      ├── S3  multi-project workbench shell ──┬── S6  new-idea / v0.1
      │                                      └── S7  iteration hard gates
      └── S4  course runner + Unit 1 ───────────── S8  units 2–3

S3 + S4 + S6 + S7 ── S5  two-task home/navigation
S6 + S7 + S8 ── S9  units 4–7 ── S10  units 8–9
S2 + S6 + S7 + S10 ── S11  contextual knowledge + export/import
S5 + S7 + S10 + S11 ── S12  release evidence and human validation
```

可并行边界：S3 与 S4 可在 S1/S2 后并行；S6、S7、S8 可分别在自己的上游完成后并行。它们不得同时大改 `src/App.tsx`；先在独立目录完成模块，再由一个集成提交接线。

推荐实际执行顺序：`S1 → S2 → (S3 ∥ S4) → (S6 ∥ S7 ∥ S8) → S5 → S9 → S10 → S11 → S12`。编号表示方案模块，不表示可以忽略依赖按数字机械施工。

---

## 8. 施工步骤

每个 S 是一个可独立评审、可用 feature flag 回退的里程碑/PR，不是一个巨型提交。每个里程碑由下表中的原子提交组成；direct mode 下使用一条本地 `codex/v3-sN-*` 分支和多次小提交，有远端后整组形成一个 PR。实施者开始某步前必须读取本步骤的“上下文简报”，不依赖聊天记录。

| 里程碑 | 必须分开的原子提交 |
| --- | --- |
| S1 | storage inventory + fixtures；schema + validators；repository + CAS；shadow migration + raw export/cutover |
| S2 | route grammar；context recovery/priority；legacy manifest + tests |
| S3 | 抽离 ProjectWorkspace；多项目/版本 commands；project/version gates + UI |
| S4 | course definitions/state；Dashboard/Runner；Unit 1 内容与活动；真实交接 E2E |
| S5 | 两任务 Hero；全局导航/legacy redirects；响应式/a11y QA |
| S6 | Idea/Challenge domain；单 driver 与方向比较 UI；Prototype→v0.1 transaction；E2E |
| S7 | cycle/gate selectors；Plan/Session adapters；Review/Change/version adapters；全链 E2E |
| S8 | Unit 2；Unit 3；前三单元编辑/可用性证据 |
| S9 | Units 4—5；Unit 6/A；Unit 7/真实证据链 |
| S10 | Unit 8/B；Unit 9/capstone；课程总一致性检查 |
| S11 | contextual knowledge；恢复包/分享包；preview import/merge；round-trip/privacy E2E |
| S12 | automated release gate；human evidence；contract/index/handoff freeze |

同一里程碑内任一原子提交失败，不得把后续提交压上去掩盖；回退优先 revert 最小原子提交，只有跨提交不变量已经发布时才关闭整个里程碑 flag。

### S1 — 建立 schema v3、domain repository 与保守迁移

**结果**：所有新功能共享同一数据模型；旧 v1/v2 数据可预览、迁移和回退。

**依赖**：无。

**上下文简报**：当前约有 23 个活跃 localStorage key 和 2 个独立 legacy key，没有共享 repository。项目护照只有一个活动项目；学习进度、第一次落桌和各工具分别保存。多段工具交接读取全局 `records[0]`，多项目后会串线；当前“完整项目包”导入只恢复 project，还会额外生成 checkpoint，并非可恢复备份。旧完成状态不能证明真实测试。迁移不得猜记录归属，不得删除旧 key，不得把海上贸易示例当用户项目。

**工作项**：

- 新建 `src/domain/`：schema、repository、commands、selectors、state gates、ID/time adapters。
- 建立 `LocalWorkspaceV3` 和上述 collections；内容定义与用户记录分开。
- 建立集中 storage registry，完整覆盖 23 个活跃 key、2 个 legacy key 以及同 key 内的旧 schema 变体。
- 在编码迁移前完成逐 key 矩阵：source key/schema 变体、draft/record、目标判别类型、ID recipe、关系、不可迁字段、tombstone 规则、导出覆盖和 fixture。
- 为 legacy learning progress、first tabletop、project workspace v1/v2 和各工具记录建立只读 adapter；禁止读取失败后由 `useEffect` 把空 fallback 自动写回源 key。
- 先做只读扫描与 migration preview，再写 staging/shadow key、读回校验，最后切读；失败不写半包。
- 按关系拓扑迁移：Project/Version → Intent/CoreLoop/PrototypeScope/TestPlan → Session/EvidenceItem → Review/Synthesis → 独立工具记录 → 学习与第一次落桌。
- 旧节点完成只迁为 Artifact/课程草稿；无归属工具记录进入 pending assignment。
- 把示例项目放入显式 sample fixture，不进入新工作区默认值。
- 为每个 domain command 添加关系、不变量、compare-and-swap、revision 冲突、tombstone 和重复提交校验；监听 `storage` 事件并提供冲突恢复。
- 实现最小 v3 全量备份、严格整包恢复、只读 inspector、last-good snapshot 和恢复文档，作为任何 v3 写入开关的前置门。
- 运行容量 fixture：5 个项目 × 10 个版本、共 50 场 session、每场 100 条 EvidenceItem，并记录配额占比和 P95 写入；达到 60% 配额或 250ms 阈值时切 IndexedDB adapter。

**预计文件面**：`src/domain/*`、`src/storage-keys.ts`、`scripts/check-domain-v3.mjs`、`scripts/check-migration-v3.mjs`、`scripts/check-storage-capacity-v3.mjs`、`tests/fixtures/legacy-*`、`package.json`、`docs/product/CONTENT_DATA_MODEL.md`、`docs/product/STORAGE_MIGRATION_V3_MATRIX.md`。

**验证**：

```bash
pnpm check
pnpm qa:domain-v3          # 本步新增
pnpm qa:migration-v3       # 本步新增：v1/v2、空数据、重复迁移、损坏数据
pnpm qa:storage-capacity-v3 # 本步新增：容量、CAS、双标签、last-good
pnpm qa:export-v3-raw      # 本步新增：早期恢复备份与严格整包恢复
pnpm build
```

**退出条件**：所有已知 key/旧形态在迁移矩阵中都有目标或显式 LegacyArtifact；同一 fixture 连续迁移两次 ID 映射、计数和关系一致；“迁移→新增 v3→撤回→再次迁移”不复活记录；旧键仍在；孤立记录数量可见；任何缺失 session 的记录都不能产生 tested 状态；raw export 可在空工作区严格恢复 last-good 包并得到相同 digest。

**回退**：关闭 `workspaceV3` 开关，恢复 legacy repository 读取；保留已生成 v3 包供导出，不反向覆盖旧键。

### S2 — 建立结构化路由与 WorkContext 交接

**结果**：工具、资料、课程和项目之间的任务上下文随跳转、刷新、后退保留。

**依赖**：S1。

**上下文简报**：当前 `url-state.ts` 主要识别 view/tool/learning node，能到页面但不能表达 course/activity/project/version/iteration。完成工具后常只能泛化地返回首页。

**工作项**：

- 扩展类型化路由：course dashboard/unit、workbench/new、project/version/cycle/step、library、projects。
- 定义由规范 URL 解析的 `WorkContext` 和允许的 ID 组合；生成具体返回文案；active selection 只服务裸 landing。
- 对旧 `#learn/workshop`、`#learn/iteration`、`#learn/node-*` 和工具深链建立别名。
- 无效/缺失 ID 进入恢复态，可选择项目或返回来源；不得新建假对象。
- 保存后返回原活动，并用 toast/inline notice 显示 Artifact 写到哪里。
- 本步用 route fixture 建立 parse/serialize round-trip、关系不一致恢复、刷新、后退、直接打开旧链接和双标签隔离测试。课程→工具的真实保存回写在 S4 验收；计划→现场在 S7；项目→资料在 S11。

**预计文件面**：`src/url-state.ts`、`src/navigation/*`、`src/main.tsx`、`src/App.tsx`（只接线）、`scripts/check-url-navigation.mjs`、`tests/work-context.spec.ts`、`docs/product/WORK_CONTEXT_CONTRACT.md`。

**验证**：

```bash
pnpm check
pnpm qa:url-navigation
pnpm qa:work-context      # 本步新增，Playwright
pnpm build
```

**退出条件**：route fixture 的 parse/serialize 完全 round-trip；显式 URL 优先级和关系恢复页通过；两个标签页的不同 project/version context 不互相覆盖；legacy URL manifest 中每条旧公开深链都有明确落点。真实业务交接留给其实现步骤验收。

**回退**：保留旧 parser 分支和 route alias；关闭 contextual routing 后新记录仍在 v3，不丢数据。

### S3 — 建立多项目设计工作台壳与项目/版本硬门

**结果**：用户可以明确开始新构想或选择已有项目；项目、版本和当前轮次成为稳定对象。

**依赖**：S1、S2。

**上下文简报**：当前 `ProjectWorkspace` v2 是单一全局对象，版本主要是文字标签，海上贸易示例预填。新工作台不能靠标题或日期推断归属。

**工作项**：

- 新建设计工作台 landing，只显示“开始新构想 / 继续已有项目”。
- 建立项目列表、创建空项目、选择 active project/version、归档与显式载入课程示例。
- 把项目护照从 `App.tsx` 抽成独立 workbench 模块和 domain commands。
- 没有 ProjectVersion 时只允许创建/导入版本，不展示 iteration steps。
- 顶部状态改为“项目名 · 版本 · 第几轮 · 当前步骤”，移除百分比和阶段成绩感。
- 为 legacy 单项目迁移提供确认页；旧工具记录显示待归档队列。

**预计文件面**：`src/workbench/*`、`src/App.tsx`、`src/styles*.css`、`scripts/check-project-workspace-v3.mjs`、`tests/project-gates.spec.ts`、`docs/product/PROJECT_WORKSPACE.md`。

**验证**：

```bash
pnpm check
pnpm qa:project-workspace-v3   # 本步新增
pnpm qa:project-gates          # 本步新增，Playwright
pnpm build
```

**退出条件**：可创建并切换两个项目；无版本时 iteration route 被阻止；示例必须点击后才出现；刷新后 active selection 恢复。

**回退**：关闭 `workbenchV3`，旧项目护照以只读/legacy 方式打开；不删除 v3 项目。

### S4 — 建立 Course Dashboard、Unit Runner、独立课程状态与可完成的 Unit 1

**结果**：系统学习成为可运行课程，不再是一张要求用户自行选择的地图；首页切换前，Unit 1 已能从阅读走到真实 Artifact。

**依赖**：S1、S2。

**上下文简报**：当前基础设计工作室只展示“先看—多做—深做”目录；没有 enrollment、当前单元、attempt 或 Artifact 关系。generic node 的行动状态不能再兼任课程进度。

**工作项**：

- 建立版本化 9 单元 catalog、activity definitions、completion predicates 和内容校验；Enrollment/Attempt 固定 definition revision。
- Dashboard 只突出当前单元、预期产物和一个继续按钮；syllabus 默认折叠。
- Unit Runner 实现统一十段结构、一个主 CTA、进一步学习折叠区。
- 建立 CourseEnrollment、ActivityAttempt 与 Artifact 保存/恢复。
- 课程状态只由活动动作推进；引用项目 Artifact 时不改变项目事实。
- 未制作完成的单元显示明确发布状态，不允许用空壳完成。
- 交付 Unit 1 垂直切片：三款原创、可用常见材料运行的短游戏（现有《小动物过河》整理为其中之一）、比较表、核心文本、标注案例、示例、反例和 3—5 项量规。
- 从 Unit 1 打开比较工具、保存、刷新并返回同一 activity；这是第一条真实课程交接验收。

**预计文件面**：`src/course/*`、`content/course-v3/*`、原创短游戏/打印资产、`src/learning-workshop-map.tsx`（转为 legacy/redirect）、`scripts/check-course-v3.mjs`、`tests/course-runner.spec.ts`、`tests/course-unit-01.spec.ts`、`docs/product/COURSE_RUNTIME_CONTRACT.md`。

**验证**：

```bash
pnpm check
pnpm qa:course-v3          # 本步新增
pnpm qa:course-runner      # 本步新增，Playwright
pnpm qa:course-unit-01     # 本步新增
pnpm content:check
pnpm build
```

**退出条件**：首次访问可完整完成 Unit 1，而非进入占位页；没有商业游戏也能运行三款样例；保存、刷新后显示继续当前 activity；课程→工具→保存→返回的 URL context 正确；展开 syllabus 不改变当前单元；项目状态保持不变。

**回退**：关闭 `courseRunnerV3`，旧 workshop map 保留；Enrollment/Artifact 不丢失。

### S5 — 切换为两个主任务的首页与导航

**结果**：新手不再为七个入口排序；两个 CTA 都进入可工作的产品壳。此步先作为 staging/受控 cohort 候选入口，不直接全量切换 Production 默认值。

**依赖**：S3、S4、S6、S7。公开切换不能早于“新构想”和“已有项目迭代”都可真实完成。

**上下文简报**：当前 `learning-home.tsx` 有 4 张入口卡、材料双入口和观察入口。它们各自合理，但不在同一层级。首页切换必须等课程和工作台都有有效落点。

**工作项**：

- Hero 改为“系统学习桌游设计 / 开始或推进一个桌游”两张主卡。
- 系统学习 CTA 根据 enrollment 显示“开始第 1 单元”或“继续第 N 单元”。
- Hero 下只保留“只想查一个问题？打开设计知识库”次级链接。
- mechanic/theme、观察实验室、第一次落桌进入课程或工作台内部，不再是 Hero 主入口。
- 更新全局导航、标题、空状态、移动端顺序和焦点管理。
- 标记旧能力合同中“四状态首页”为已被本蓝图取代。
- 新首页由集中 feature flag 控制；S5 只在 staging/cohort 开启，S12 通过 AC 与 Round A/B 后才改 Production 默认值。

**预计文件面**：`src/learning-home.tsx`、导航所在组件、`src/brand.ts`、`src/url-state.ts`、相关样式、`scripts/check-two-task-home.mjs`、`tests/two-task-home.spec.ts`、`docs/product/LEARNING_PATH_AND_DESIGN_MATERIALS_CAPABILITY.md`。

**验证**：

```bash
pnpm check
pnpm qa:two-task-home      # 本步新增
pnpm qa:a11y-contract
pnpm qa:url-navigation
pnpm build
```

**退出条件**：staging/cohort 的桌面和手机 Hero 都只有两个主 CTA；首次/续学按钮正确；资料入口不是同级卡；旧链接仍可达；Production 默认尚未切换。

**回退**：切回旧 `LearningHome`；新 course/workbench routes 保持可直接访问。

### S6 — 重建“新构想 → 微型原型 → Project v0.1”

**结果**：用户从一种起点形成最多三个结构不同的方向，选择后做原型，并真正创建有来源链的项目 v0.1。

**依赖**：S3；复用 S2。

**上下文简报**：当前第一次落桌只有一个存储槽，强制 mechanic + theme，用百分比表示状态，最后主要跳转到项目护照。新流程先不使用 Agent。

**工作项**：

- 新建多实例 IdeaDraft 与 ChallengeInstance。
- 第一步只选一个 driver；材料库是可选 drawer，选择后回到同一 idea。
- 用确定性模板支持最多三个方向；要求核心决定、信息、互动、反馈或玩家位置至少一项不同。
- 方向卡固定为：体验承诺、反复行动、核心取舍、状态改变、最小测试、主要失效风险。
- 选择方向后填写人数、时长、材料、目标、结束、反复行动、反馈和首个问题。
- 创建 Prototype 后引导实际运行并记录 PrototypeRun；只有完成的结构化 run 才显示“已落桌”。
- 以幂等 command 原子创建 Project 与 ProjectVersion v0.1，保留 idea/challenge/material/activity lineage。
- A、B 和自由挑战可并存、复制、归档；移除虚假进度百分比。

**预计文件面**：`src/workbench/idea/*`、`src/first-tabletop-challenge.tsx`（拆解/legacy adapter）、`src/design-materials-library.tsx`、domain commands、`tests/idea-to-project.spec.ts`、`scripts/check-challenge-v3.mjs`。

**验证**：

```bash
pnpm check
pnpm qa:challenge-v3       # 本步新增
pnpm qa:idea-to-project    # 本步新增，Playwright
pnpm qa:design-materials
pnpm build
```

**退出条件**：只选体验也能完成；不选 mechanic/theme 不报错；两个挑战互不覆盖；自由文本 run note 不产生“已落桌”；有效 PrototypeRun 才产生该事实；重复点击只创建一个 v0.1；来源链可从项目反查。

**回退**：关闭 `ideaFlowV3`；v3 Idea/Prototype/Project 可导出，旧 first-tabletop 仍只读打开。

### S7 — 把原型迭代改成有硬门的真实循环

**结果**：已有项目从最大未知出发，完成计划、现场、复盘、ChangeBrief 和新版本；没有证据不能跳状态。

**依赖**：S3、S2；使用 S1 domain commands。

**上下文简报**：当前 6—10 节点已包含专业方法，但 UI 仍像 01/07 课程；generic node 能靠非空文字推进。现有 `single-question-test-plan`、`playtest-session-recorder`、`evidence-review-workbench`、`version-governance-workbench` 应接到同一个 IterationCycle。

**工作项**：

- Cycle 顺序固定为：未知 → 测试问题 → 证据信号 → 原型/改单范围 → 现场测试 → 证据复盘 → ChangeBrief → 新版本。
- 顶部只显示项目、版本、轮次和当前步骤；循环完成后询问“下一轮最大的未知是什么”。
- 将四类关键工具适配为 context-aware、v3 repository-backed；高级字段仍可展开。
- 没有 TestPlan 不能创建对应 Session；没有 Session 不能 Review；没有 Review 不能 ChangeBrief；没有 ChangeBrief 不能生成 target version。
- 确认 TestPlan 时冻结 source version 与 digest；Session 引用该 digest。ChangeBrief 建立 source→target revision edge；旧版本事实不被覆盖。
- 为 `has_prototype/has_tabletop_run/has_solo_test/has_external_test/has_evidence_review/has_outgoing_revision` 建立关系真值表；撤回、跨项目引用、错误 digest 和 tombstone 都有负向测试。
- 区分 solo、guided/external、blind；它们不是不可逆等级。
- 原始 session 只读保留；Review 明确分开观察、原话、解释、竞争解释和缺失证据。
- 将旧节点保留为独立方法练习/legacy 深链，不再决定项目状态。

**预计文件面**：`src/workbench/iteration/*`、四个现有工具组件、`src/learning-node-page.tsx`、`src/learning-node-progress.ts`、domain gates、`tests/iteration-chain.spec.ts`、`scripts/check-evidence-gates.mjs`。

**验证**：

```bash
pnpm check
pnpm qa:single-question-test-plan
pnpm qa:live-playtest-session
pnpm qa:evidence-review
pnpm qa:version-governance
pnpm qa:evidence-gates       # 本步新增
pnpm qa:iteration-chain      # 本步新增，Playwright
pnpm build
```

**退出条件**：所有越级 URL/按钮都被硬门阻止且给出下一动作；计划→现场的真实 URL 交接在刷新后成立；一条完整链创建 v0.2 revision edge；返回 v0.1 可看到冻结历史；撤回 session 后项目事实失效但课程历史按合同标记；无百分比毕业暗示。

**回退**：关闭 `iterationV3` 后旧节点仍可查看；已创建的 session/review/version 不删除，legacy 页面不获得修改它们的权限。

### S8 — 补齐课程 2—3，完成 1—3 起步段

**结果**：在已可运行的 Unit 1 之后，学习者继续完成结构图和体验设计简报；前三单元形成完整起步段。

**依赖**：S4；Artifact 关系来自 S1。

**上下文简报**：Unit 1 已在 S4 交付。现有观察内容和体验意图材料质量较高；Unit 2 缺完整示范与统一结构图，Unit 3 缺把体验意图卡和项目简报合为一次正式检查点。

**工作项**：

- 为 Unit 2 创建完整初学者示范和结构图；为 Unit 3 嵌入体验意图卡并形成设计简报检查点。
- Units 2—3 按统一模板重编 8—15 分钟核心文本和持续案例。
- Units 2—3 交付完成示例、反例、3—5 项诊断量规和边界说明，并复核 Unit 1 的术语连续性。
- 可选桌面演示只有在字幕、全文稿和替代文本齐备时显示；视频缺失不形成空占位。
- 完成逐句人工编辑和至少一轮无主持阅读任务。

**预计文件面**：`content/course-v3/units/02-*`、`03-*`、`content/course-v3/examples/*`、`src/course/activities/*`、内容校验、`tests/course-units-01-03.spec.ts`。

**验证**：

```bash
pnpm content:check
pnpm copy:audit
pnpm qa:course-units-01-03    # 本步新增
pnpm qa:a11y-contract
pnpm check
pnpm build
```

**退出条件**：没有商业游戏也能完成 Unit 1；三个 Artifact 可保存/刷新/继续；示例与反例不会被误认成标准答案；真人能指出每单元唯一动作。

**回退**：只关闭相应 unit publication flag；Enrollment 和已保存 Artifact 保留，旧观察实验室仍可访问。

### S9 — 完成课程 4—7，并把微型原型 A 接入真实测试链

**结果**：课程从决定和循环进入第一款微型游戏，并通过一场真实 session 形成改版。

**依赖**：S6、S7、S8。

**上下文简报**：systematic units 02—06、决定轨迹、核心循环、最小原型、单问题测试和证据复盘可大量复用；主要工作是删重、降低语言摩擦并把产物关系接通。

**工作项**：

- Unit 4：决定线与信息地图；复用决定轨迹但默认显示最少字段。
- Unit 5：游戏骨架与核心循环；合并目标、回合、资源和反馈关系。
- Unit 6：创建 `ChallengeInstance A`，从一种 driver 形成 Prototype/ProjectVersion。
- Unit 7：为 A 创建真实 TestPlan 和 PlaytestSession，再 Review、ChangeBrief、target version。
- 课程完成门只检查本单元活动；项目 external-tested 仅在对应 session 类型存在时推导。
- 为每单元补示例、反例、量规、折叠延伸资料并人工编辑。

**预计文件面**：`content/course-v3/units/04-*` 至 `07-*`、`src/course/activities/*`、相关工具嵌入 adapter、`tests/course-units-04-07.spec.ts`。

**验证**：

```bash
pnpm content:check
pnpm qa:course-units-04-07    # 本步新增
pnpm qa:iteration-chain
pnpm qa:idea-to-project
pnpm check
pnpm build
```

**退出条件**：Unit 6 真正创建 A 和 v0.1；没有 Session 时 Unit 7 不可伪造完成；完成 Unit 7 后课程与项目分别显示正确状态。

**回退**：关闭 Units 4—7 publication flag；项目链记录仍可在设计工作台继续使用。

### S10 — 完成课程 8—9：第二原型与完整项目

**结果**：学习者证明方法可以迁移，并把一个选择出的方向发展成有版本历史和回顾的项目。

**依赖**：S9。

**上下文简报**：第二原型不是 A 的覆盖或换皮；完整项目单元完成也不等于作品完成、平衡或可出版。

**工作项**：

- Unit 8 创建独立 `ChallengeInstance B`；要求 driver、核心决定、信息结构、互动方式或反馈循环至少一项与 A 不同。
- 保存 A/B 比较反思，允许用户指出方法不适用之处；不计算创意差异分。
- Unit 9 选择 A、B 或独立项目继续；形成至少一个有证据来源的新版本。
- Unit 9 最低产物：版本历史、规则快照、一次 evidence-linked change、postmortem。
- 盲测、交接、出版显示为后期可选分支，不是 Unit 9 必经终点。
- 完成全 9 单元的示例、反例、量规和人工编辑一致性审查。

**预计文件面**：`content/course-v3/units/08-*`、`09-*`、`src/course/activities/*`、规则快照/postmortem 组件、`tests/course-units-08-09.spec.ts`。

**验证**：

```bash
pnpm content:check
pnpm qa:course-units-08-09    # 本步新增
pnpm qa:challenge-v3
pnpm qa:evidence-gates
pnpm check
pnpm build
```

**退出条件**：A/B 可同时导览、编辑和恢复；B 有独立来源；Unit 9 产物链完整；UI 明确说明课程完成不代表作品已完成。

**回退**：关闭 Units 8—9；A/B 和项目记录仍在工作台，不因课程隐藏而删除。

### S11 — 把资料、材料和工具接成共享支持层，并完成可用的 v3 导入/分享

**结果**：用户在当前任务中获得最多三项有理由的支持，使用后能附着并返回；S1 的原始恢复包升级为可预览导入和安全分享体验。

**依赖**：S2、S6、S7、S10。

**上下文简报**：现有资源馆、17 张 mechanic、12 张 theme、指南和工具是优势；问题是它们与主旅程争入口，且当前导出仍是单项目 v2、导入不恢复全部对象。

**工作项**：

- 将资源入口组织为程序性知识、mechanic/pattern、theme/关系、案例、工具/模板五类；保留现有深链。
- 课程/构想/迭代侧栏默认最多展示三项，每项说明“为什么相关 / 看什么 / 如何带回 / 类比边界”。
- 选择资源后创建 ResourceAttachment，绑定 activity 或 project/version/iteration。
- 在 S1 原始全量备份之上建立两种明确模式：完整恢复包，以及默认脱敏、排除撤回证据的可分享项目包。
- 建立校验预览式导入、ID 冲突、恶意/超大文件、重复导入和 merge/replace 策略；导入不得调用会额外创建 checkpoint 的普通保存路径。
- 完整恢复包包含课程定义 manifest/摘要、课程产物、Idea、Challenge、Project、Version、Prototype、PrototypeRun、Cycle、Test、Evidence、Synthesis、Change、ResourceAttachment、tombstones 和未来 Agent lineage 字段。
- 将旧无归属工具记录纳入待归档流程；用户确认后才写 project/version IDs。
- BGG 只保留 provider interface 和权利备注，不在本步联网接入。

**预计文件面**：`src/knowledge/*`、现有 resource/material catalogs、`src/domain/export-import.ts`、数据与隐私页面、`tests/contextual-knowledge.spec.ts`、`tests/export-import-v3.spec.ts`、`docs/product/PROJECT_EXPORT_V3.md`。

**验证**：

```bash
pnpm content:check
pnpm qa:contextual-knowledge   # 本步新增
pnpm qa:export-v3              # 本步新增
pnpm qa:import-v3              # 本步新增
pnpm qa:resource-v2:browser
pnpm check
pnpm build
```

**退出条件**：项目中选资料后刷新仍附着于同一 version/cycle；完整恢复包 round-trip 后对象数、ID、关系、tombstone 和规范化 digest 一致；分享包不含已撤回证据和私密字段；冲突有预览；无旧记录被自动错归。

**回退**：关闭 contextual sidebar 和 v3 import 写入；v3 export 始终保留。资源馆旧入口不受影响。

### S12 — 建立可信发布门、真人任务与 Agent-ready 冻结点

**结果**：发布证据来自真实行为；P0/P1 完成后才允许启动任何 LLM 辅助工作。

**依赖**：S5、S7、S10、S11。

**上下文简报**：现有 QA 很丰富，但部分检查偏源码结构。最终发布必须覆盖真实浏览器交互、刷新恢复、迁移、数据关系、移动端、无障碍和人类理解。

**工作项**：

- 建立一条 production-like Playwright 场景：首次访问 → Unit 1 → Artifact → 新构想 → v0.1 → TestPlan → Session → Review → ChangeBrief → v0.2 → 资源附件 → 全量导出。
- 建立负向场景：无项目、无版本、无 session、损坏 legacy、存储失败、导入冲突、无效 context ID、双标签 revision 冲突、撤回后导出、恶意/超大导入。
- 用真实操作替换仅检查源码字符串的关键断言；保留静态检查作为快速门。
- 桌面和手机完成键盘、焦点、屏幕阅读名称、对比度、横向滚动和打印原型检查。
- 执行主线文案人工逐句复核；把机器审计的高摩擦项按“主线/交接/支持长文”分层处理。
- 按 §9 的 Round A/B 进行真人任务，使用明确 P0/P1 finding 量规。记录误读，不记录能力评分。
- 冻结 Agent suggestion schema、权限矩阵和 eval fixture；不接模型。
- 更新 INDEX、ROADMAP、产品合同和 handoff，标明 legacy 与已知边界。
- 只有 AC matrix、Round A/B 和所有 P0 finding 关闭后，才把两任务首页的 Production feature flag 默认打开；否则继续 cohort 并记录阻塞。

**预计文件面**：`tests/product-v3-e2e.spec.ts`、`tests/product-v3-negative.spec.ts`、QA scripts、`docs/qa/V3_ACCEPTANCE_MATRIX.md`、`docs/qa/LEGACY_URL_MANIFEST.md`、`docs/revision/*`、`docs/product/*`、`docs/ROADMAP.md`、`docs/INDEX.md`、新 handoff。

**验证**：

```bash
pnpm check
pnpm content:check
pnpm qa:product-v3:browser    # 本步新增
pnpm qa:migration-v3
pnpm qa:export-v3
pnpm qa:a11y-contract
pnpm build
```

**退出条件**：下一节全部 E2E 条件通过；Round A/B 没有未关闭 P0 finding；所有遗留 P1/P2 有负责人/证据/回退；Agent 数据和权限已定义但无模型调用；满足前述条件后才完成 Production 默认入口切换。

**回退**：整体切回 legacy 首页/课程/工作台路由；v3 数据可导出且旧键可读。Production 回退不得执行任何清理脚本。

---

## 9. 下一版必须通过的行为验收

- `AC-01`：首页 Hero 只有两个主要 CTA。
- `AC-02`：首次进入系统学习只看到开始 Unit 1；已有进度只看到继续当前单元。
- `AC-03`：syllabus 默认折叠，不承担课程决策中心。
- `AC-04`：课程完成状态和项目事实分别显示，互不自动推进。
- `AC-05`：用户能保存两个彼此独立的微型原型 A/B，刷新后不覆盖。
- `AC-06`：新构想只选择一种起点也能完成；mechanic/theme 不再强制配对。
- `AC-07`：第一次落桌简报能真正创建 Project + ProjectVersion v0.1，并保留来源链。
- `AC-08`：没有 project/version 不能进入 iteration cycle。
- `AC-09`：没有 PlaytestSession 不能出现“已测试”。
- `AC-10`：没有 EvidenceReview 不能进入 ChangeBrief；没有 ChangeBrief 不能出现“已修订”或创建目标版本。
- `AC-11`：完成一轮后显示已形成的新版本和下一轮未知，不显示 100% 毕业。
- `AC-12`：课程打开工具、保存并刷新后仍能返回原 activity。
- `AC-13`：项目打开资料后，该资料附着于当前 version/cycle，返回文案具体。
- `AC-14`：海上贸易示例只有在用户显式载入时才进入工作区。
- `AC-15`：legacy v1/v2 数据迁移失败时不丢失、不半迁移、不被错误归属。
- `AC-16`：完整恢复包包含所有用户对象、定义 manifest、tombstone 和关系；导入有校验预览，冲突不静默覆盖。
- `AC-17`：可分享项目包默认脱敏并排除撤回/私密证据；恶意或超大导入不能改变现有 workspace。
- `AC-18`：键盘和手机可完成同一主流程；不依赖横向滚动或颜色表达状态。
- `AC-19`：两个标签页操作不同项目时不串 context；revision 冲突不会静默覆盖。
- `AC-20`：主线文本经过人工复核；用户能复述当前要做的动作和完成后留下的产物。
- `AC-21`：P0/P1 不出现 Agent 生成的测试者、测试记录、状态或版本决定。
- `AC-22`：后续 Agent 的任何输出默认只是 suggestion，只有用户确认后才能写入指定 Artifact；原始证据始终只读。

S1 建立 `docs/qa/V3_ACCEPTANCE_MATRIX.md`，每条 AC 必须登记：前置 fixture、逐步操作、机器断言或人工量规、预期证据文件、执行步骤和负责人。自动化以对象 ID、计数、外键、tombstone 和规范化 digest 断言；“页面出现某字符串”不能单独关闭 AC。`legacy URL manifest` 与 `legacy storage matrix` 分别是 AC-12/15 的完整测试输入。

真人门使用两个既有研究轨道：Round A 至少 5 名第一次学习桌游设计者，完成首页→Unit 1→保存/继续；Round B 至少 4 名带有点子或原型的用户，完成选择项目→计划→Session→Review→新版本。P0 finding 定义为数据丢失/串项目、产生虚假项目事实、核心任务无主持无法继续、或用户把课程完成误认成项目已测试/可发布。R6 要求零个未关闭 P0；P1 必须修复或在 Decision Record 中显式接受，不把小样本写成总体可用性证明。

---

## 10. P2：Agent 后续队列（不在本轮施工范围）

只有 S12 全部退出条件满足后，才逐个启动；每个 Agent 单独立项、单独 eval、单独权限审查：

1. **设计资料员**：从已策展资料中返回 3—5 项，解释相关性和类比边界。
2. **证据整理员**：只读真实 session，分开观察、原话、解释、竞争解释和缺失证据。
3. **学习教练**：只读当前单元和量规，解释、举反例、提问；不代做或标完成。
4. **原型裁剪员**：从测试问题反推必须真实/可代理的材料与停止条件。
5. **测试计划教练**：收紧问题、支持/反驳信号和主持任务；不生成测试事实。
6. **构想教练**：最多三个结构不同方向；不写完整规则、不宣称原创、不替用户选择。
7. **规则与教学检查员**：后期检查术语、设置、时序和查询入口；不宣称通过盲测或无障碍。

统一权限：只读当前上下文、输出 `AgentSuggestion`、显式“采用并写入”、记录来源与目标字段、不得改变项目状态、不得覆盖原始证据、不得静默创建版本。

---

## 11. 风险与应对

| 风险 | 早期信号 | 应对 |
| --- | --- | --- |
| v3 迁移造成隐性数据损失 | 对象数减少、旧键被改、重复迁移结果不同 | preview + fixture + 幂等 + 旧键只读保留 + 全量导出 |
| 新首页先上线但产品壳不可用 | CTA 到空页/占位页 | S5 硬依赖 S3/S4；R2 一起发布 |
| 课程再次变成文档目录 | 首屏多个并列按钮、用户需要先看完整地图 | Dashboard 唯一继续动作；syllabus 折叠；单元一个主 CTA |
| 项目状态再次变成自我申报 | 组件直接写 status 字符串 | selector 从实体关系推导；domain command 是唯一写入入口 |
| `App.tsx` 冲突和回归扩大 | 多步骤同时修改巨型文件 | 先建独立模块；指定单一集成人；设置 bundle/route 边界测试 |
| 课程内容工作量被低估 | 只有正文，没有案例/反例/量规/产物 | 先 Units 1—3 垂直切片，模板验收后再扩展 |
| 原创示例仍要求过多材料 | 新手无法在家运行 Unit 1 | 常见纸笔/硬币材料；提供打印版和无打印替代 |
| localStorage 容量和写入失败 | QuotaExceeded、刷新丢最新输入 | 原子写、错误提示、导出；容量压测后决定 IndexedDB ADR |
| 自动化继续过度乐观 | 字符串检查通过但用户仍可跳状态 | 关键门使用 Playwright 真实行为与关系断言 |
| 支持层再次抢夺主任务 | 当前步骤出现大量资源卡 | 默认最多三项；完整库折叠/独立打开；返回上下文明确 |
| “完整项目”被理解成可出版 | Unit 9 完成页出现质量或成熟度承诺 | 固定边界文案；盲测/交接/出版为可选分支 |

---

## 12. OPEN QUESTIONS 与建议默认值

这些问题不阻塞 S1；若未另行决定，采用建议默认值。

1. **第二主产品外部名称**
   建议：导航用“设计工作台”，首页卡用“开始或推进一个桌游”。不使用 Ideation 作为总入口。

2. **Unit 7 是否必须外部玩家**
   建议：课程活动至少需要一个真实 `PlaytestSession`；solo 与 external 明确区分。只有 external/guided/blind 才产生“已外部测试”项目事实。

3. **Unit 9 的最低项目门**
   建议：至少两个版本、一场真实 session、一个 EvidenceReview、一个 ChangeBrief、当前规则快照和 postmortem；明确不等于作品完成。

4. **视频是否作为 R4/R5 发布阻塞项**
   建议：不是。文本、静态标注和练习是完整权威路径；视频准备好字幕/全文稿后才显示，不发布空占位。

5. **localStorage 还是 IndexedDB**
   建议：S1 先通过 repository 隔离存储；使用规定容量 fixture。达到可用配额 60% 或 P95 写入 250ms 即在 R3 前切 IndexedDB，并写 ADR；UI 不感知底层切换。

6. **BGG 接入时间**
   建议：P2 之后另立能力合同；完成应用注册、署名、商业使用与缓存边界前只保留 provider interface。

7. **真人测试规模**
   建议：沿用项目既有小轮次方法，不把人数当统计代表性。Round A 至少 5 名新手，Round B 至少 4 名已有项目用户；R6 要求没有未关闭 P0 finding。

---

## 13. HANDOFF

下一位实施者只启动 S1，不同时改首页、课程文案或工作台 UI。

冷启动阅读顺序：

1. 本蓝图的 §2、§3.4—3.7、§6—9；
2. `docs/product/PROJECT_WORKSPACE.md` 与 `docs/product/CONTENT_DATA_MODEL.md`；
3. `src/storage-keys.ts`、`src/App.tsx` 中 ProjectWorkspace/导出导入、所有直接 localStorage 调用；
4. schema 审计指出的主链组件和现有专项 QA。

S1 第一个原子提交只交付 storage inventory、legacy fixtures、迁移矩阵骨架和当前红/绿 QA 基线，不写 v3 用户数据。只有 source key/schema 变体全部有目标或显式 LegacyArtifact，才进入 schema/repository 提交。

建议首个本地分支：`codex/v3-s1-foundation`。S1 完成前不启用任何 Production feature flag，不删除旧键，不执行自动迁移。若发现未知 key、无法解释的 schema 变体、容量 fixture 超门或无法形成确定性 ID，按 §15 写 Decision Record 并暂停 cutover，不自行猜测。

## 14. 版本控制、交付与回退纪律

当前仓库没有 remote，因此使用 direct mode：

- 每个 S 里程碑使用独立本地 `codex/v3-sN-*` 分支；按 §8 的原子提交表拆分，建议格式：`feat(v3): ...`、`test(v3): ...`、`docs(v3): ...`。
- 不把两个有独立回退面的工作包压在一个提交；一个里程碑可以包含多次原子提交。
- 每个 Release 段结束后创建带日期的 handoff 和可恢复数据 fixture。
- 配置远端后，一个 S 里程碑对应一个 PR；PR 描述复制该步骤的结果、依赖、验证、退出条件、原子提交和回退。
- Production 切换只发生在相应 Release 退出门通过后；不得用部署来验证迁移是否安全。

---

## 15. 计划变更协议

实施中发现新事实时，不静默偏离本蓝图：

1. 在本文件末尾追加一条 `Decision Record`：日期、触发证据、原假设、新决定、影响步骤。
2. 同步更新依赖图、相应步骤的文件面/验证/退出/回退。
3. 若改变固定产品规则、数据不变量或 P0/P1 范围，暂停该步骤并请求产品确认。
4. 若只是文件移动或等价实现细节，可继续，但在提交说明中记录映射。
5. 任何“先临时绕过硬状态门”的方案都视为范围改变，不允许作为实现捷径。

### Decision Records

- **2026-08-27 · 对抗性蓝图审阅**
  初审判定 NO-GO，指出依赖提前验收、迁移类型/ID 不闭合、早期无恢复包、WorkContext 权威不清、状态真值表不足、步骤过大、课程定义无版本、存储并发/容量及验收/隐私不可执行。蓝图已逐项修订。复审判定 GO WITH CHANGES，并留下 PrototypeRun、ChangeBrief revision edge、Production 开关三项 P1；三项均已加入 §3.5、S6/S7、R4/S5/S12 的硬合同。S1 可启动，后续步骤仍必须按各自退出门施工。
