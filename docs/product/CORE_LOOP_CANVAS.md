# 核心循环画布产品规格

状态：implemented / browser-and-participant-validation-pending  
日期：2026-08-21

## 目标

帮助已有体验意图的新手写出一条可由规则执行、会改变下一次决定条件的短循环，并把它显式交给原型范围裁剪器。工具不生成最优机制、循环质量分或玩家体验结论。

## 五步

1. 承接意图：项目、版本、玩家语境、重复决定、行为预测和反驳信号；可显式导入最近体验意图。
2. 信息与选择：当前可见信息、眼前目标、可行选项、选项差异。
3. 代价与承诺：实际行动、支付/放弃/暴露、锁定与回应窗口。
4. 状态与反馈：状态变化、可见对象、反馈时机、反馈如何成为下一输入、作用路径影响谁。
5. 重复与出口：下一输入、下一决定、停止/换层/终局、保持不变、单一改动、交给原型的首个问题。

右侧摘要只在核心链字段齐全时编译一句循环，并用代码内 SVG/CSS 显示六个节点和独立出口。它是检查缺口的工作图，不是自动建模或模拟器。

## 交接契约

- 导入是按钮触发，不在页面打开、保存或继续时自动发生。
- 来源保存 `sourceIntentId`、`sourceIntentCreatedAt` 与原假设/预测/反例/问题；来源区域只读。
- 导入只复制已有原字段，不从主题、压力或预测推断机制。
- 继续到原型范围前复用完整验证；不完整时回到对应步骤。
- 原型范围导入后仍要求用户决定证据过滤、三维保真、材料、非目标和重做信号。

## 保存与导出

浏览器键：`tabletop-workshop-core-loop-v1`。`schemaVersion: 1` 保存当前草稿和带 UUID/ISO 时间的历史记录。清空需要二次确认，只清草稿，不删历史。

独立导出固定包含：

```yaml
schema_version: 1
method: core-loop-canvas
local_first: true
no_loop_quality_score: true
no_optimal_mechanic_recommendation: true
no_player_experience_claim: true
no_silent_intent_inference: true
evidence_boundary: string
draft: object
current_loop_statement: string
saved_records: [object]
exported_at: datetime
```

项目完整包以 `core_loop_records` 收集历史记录。记录数不是进度、成熟度或设计质量。

## 视觉与响应式

接受概念稿为 `design/concepts/core-loop-canvas-desktop.png`，SHA-256 `92d5adb0614cc8c254f0a733dfe47b2fe46da04bbe7d3aebf0782e61b3b4450d`。实现复用暖白点阵纸、钴蓝活动态、砖红边注、低圆角和宋体/楷体层级；桌面为宽编辑器/窄循环图，1000px 以下摘要下移，720px 以下表单单列、步骤轨道局部横向滚动。

概念稿中的书本/设置图标不属于现有导航任务，未实现。真实浏览器未加载成功，因此当前只有结构预检查，没有视觉保真签收。

## 形成性通过门

- 用户能用自己的话区分体验意图、核心循环和原型范围；
- 不把“导入”理解为系统推荐机制；
- 能指出反馈怎样改变下一次决定，而非只描述结算表现；
- 能写出循环出口；
- 原型导入后至少删除一个与本轮问题无关的内容；
- 保存、刷新、导出和来源回溯在真实浏览器成立。
