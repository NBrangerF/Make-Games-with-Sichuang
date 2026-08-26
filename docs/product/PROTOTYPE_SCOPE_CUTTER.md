# 原型范围裁剪器

状态：implemented / browser QA pending  
日期：2026-08-21  
研究依据：[原型范围与保真度研究](../research/PROTOTYPE_SCOPE_FIDELITY_01.md)  
指南契约：[原型范围裁剪器契约](../guides/PROTOTYPE_SCOPE_CUTTER_CONTRACT.md)

## 产品结果

核心“最小原型”指南现在有一个专用交互工具。用户可以从本轮问题开始，选择最多两个要观察的性质，分别配置材料、分辨率和范围，记录主持人代理边界，裁出带重复与停止条件的可玩片段，再冻结一份可制作、可复测的范围快照。

工具不计算保真度、成熟度或质量总分，也不推荐最少组件数、回合数、玩家数或制作时长。

## 视觉规格

概念稿：[完整桌面概念](../../design/concepts/prototype-scope-cutter.png)，原生尺寸 1435×1096。

设计系统从概念稿与现有站点共同提取：

- 页面语言：编辑工坊，不做营销首屏；完整任务从标题直接进入五步轨道。
- 背景与表面：站点既有暖白点纹背景；编辑器用接近白纸的开放表面。概念稿是真白，本轮为保持全站一致保留既有根背景，这是明确的系统级偏差。
- 字体：宋体家族承担标题、步骤、字段名；系统中文无衬线承担正文与控件；楷体只用于一条红色边注。
- 颜色：`--blue: #0b48c6` 为活动态与主要动作，`--red: #b9382f` 为边界与手写注记，`--line: #d7d3cc` 为细规则线。
- 容器：一个宽编辑器加一个窄摘要，不使用卡片网格或嵌套大圆角；控件 0–2px 圆角、无装饰阴影。
- 交互：五步活动下划线；过滤项最多选两项；三维分段控件统一；摘要随草稿更新；1000px 以下摘要下移，720px 以下单栏且步骤自身横向滚动。
- 图标：概念中的时钟/保存/相机/删除图标未进入实现；它们不增加任务语义，现有产品动作也主要使用文字。该删除是有意偏差，不用近似图标替代。

## 五步工作流

1. **验证问题**：项目、版本、本轮问题、目标体验/风险、推翻信号和明确非目标。
2. **证据过滤**：从功能/规则、数据/状态、互动/决定、空间/身体、外观/信息中最多选两个，并为每个写必要理由；另列必须承担的功能。
3. **保真度配置**：材料、分辨率、范围分别选择替代、近似或必须真实，并写理由；主持代运转与不可代做的玩家决定分开。
4. **可玩切片**：玩家配置、起始状态、关键决定怎样重复、停止触发与明确不做。
5. **开工门槛**：材料和数量、团队自定时间盒、重做/缩题信号与下一次测试。

## 保存与导出

浏览器键：`tabletop-workshop-prototype-scope-v1`。

```yaml
store:
  schemaVersion: 1
  draft: scope_draft
  records: [scope_record]

scope_record:
  id: uuid
  createdAt: datetime
  projectName: string
  version: string
  question: string
  targetExperience: string
  currentRisk: string
  disconfirmingSignal: string
  nonGoals: string
  selectedFilters: [filter_dimension] # 1–2
  filterReasons: {filter_dimension: string}
  requiredFunctions: string
  fidelity:
    material: {level: 替代|近似|必须真实, reason: string}
    resolution: {level: 替代|近似|必须真实, reason: string}
    scope: {level: 替代|近似|必须真实, reason: string}
  proxyOperation: string
  protectedDecisions: string
  playerConfiguration: string
  startState: string
  repetition: string
  stopTrigger: string
  outOfScope: string
  materials: string
  buildTimebox: string
  rebuildSignal: string
  nextPlaytest: string
```

独立范围包固定包含：

```yaml
schema_version: 1
method: prototype-scope-cutter
local_first: true
no_fidelity_score: true
no_minimum_content_recommendation: true
evidence_boundary: string
draft: scope_draft
saved_records: [scope_record]
exported_at: datetime
```

完整项目包新增 `artifacts.prototype_scope_records`；该增量当时汇总 14 类工具记录，加入议题到系统工作台后现为 15 类。旧记录仍不自动猜测项目归属。

## 失败处理与边界

- 草稿每次修改后写入当前浏览器；“保存范围快照”冻结一条历史记录。
- 选第三个过滤维度时不静默替换，提示先移除或写入非目标。
- 快照保存按五步定位缺失字段；草稿本身可以不完整。
- 清空草稿需要连续两次显式动作，只清草稿，不删除已保存快照。
- 导出不代表原型已制作、已测试或适合完整局；实体/线上/主持代理的证据不可无条件互认。
- 代理运转若提供策略、改变节奏、看见秘密或代替决定，必须进入下一轮风险，而不是被当作免费自动化。

## 验证状态

- `pnpm qa:prototype-scope`：17/17 结构守卫通过。
- `pnpm content:check`：527 资源、26 入口、285 Claim、281 术语及相关一对一契约通过。
- TypeScript 和生产构建通过；工具是独立惰性 chunk。
- Browser/IAB 仍受既有本地文件 URL 与端口策略阻塞，未取得当前实现截图、原生尺寸对照、控制台、焦点、移动端或下载行为证据。不得写成视觉验收或浏览器回归通过；阻塞见 [浏览器 QA 阻塞记录](BROWSER_QA_BLOCKER.md)。
- 真人形成性测试见[原型范围裁剪器可用性测试](USABILITY_TEST_PROTOTYPE_SCOPE_CUTTER.md)。
