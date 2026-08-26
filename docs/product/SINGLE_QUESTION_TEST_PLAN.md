# 单问题测试计划产品规格

状态：implemented / browser-and-participant-validation-pending  
日期：2026-08-21

## 目标

把一个已裁剪原型变成可主持、可观察、可反驳、能产生下一版决定的形成性测试。工具不生成乐趣分、样本代表性、因果证明或发行认证。

## 四步与必填门

1. 承接范围：项目、版本、唯一主问题、行为预测、反驳信号。
2. 观察协议：具体事件、每条记录字段、重复目标、开始、停止、保持不变、只改变一个轴。
3. 参与与主持：参与者经验、玩家配置/关系、测试类型、媒介、主持允许/禁止行为、记录与同意、安全停止。
4. 结束与追问：至少一个开放追问、支持/反驳/未定后的处理；停车区可选。

保存会将用户带回第一个缺失字段所属步骤。四节点证据链只表示字段是否存在，不评价质量。

## 来源交接

原型范围页在完整校验后可打开测试计划。抽屉内导入仍需用户显式触发，来源保留 `sourceScopeId`、`sourceScopeCreatedAt` 与只读摘要。

导入只映射原字段：项目、版本、问题、目标体验、反驳信号、必需功能、重复、开始、停止、玩家配置、非目标。系统不推断参与者、主持方式、同意方式或结论规则。

## 保存与导出

- 草稿键：`tabletop-workshop-single-question-test-plan-draft-v1`
- 历史记录键：`tabletop-workshop-project-v1`
- 项目完整包类别：`test_plans`
- 清空需要二次确认，只清草稿，不删历史。

独立导出固定包含：

```yaml
schema_version: 2
method: single-question-playtest-plan
local_first: true
no_fun_score: true
no_sample_representativeness_claim: true
no_causal_proof: true
no_release_readiness_claim: true
no_silent_scope_inference: true
evidence_boundary: string
project: object
draft: object
saved_records: [object]
exported_at: datetime
```

## 视觉与响应式

主概念稿：`design/concepts/single-question-test-plan-drawer.png`，SHA-256 `4d321ff0c80aa996ea8722218ba05615ceaf3d82d527a1ad794f8c89244f8241`。主持态参考：`design/concepts/single-question-test-plan-hosting.png`，SHA-256 `9911e1168d2cd8481af6bd10df854413f39740042330201bde80920bc4d19fad`。

实现采用全高右侧纸张抽屉、钴蓝装订线、打孔纸边、四步轨道、砖红手写边注和底部证据链。720px 以下占满宽度、步骤局部横向滚动、双栏字段改单栏。真实浏览器未加载成功，当前没有视觉保真签收。

## 证据边界

一份完整计划只说明观察协议可以被描述。它不能证明问题问得好、参与者合适、记录可靠、预测为真、机制造成行为、游戏好玩或可以发行。
