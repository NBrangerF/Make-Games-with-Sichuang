# 现场测试记录器产品规格

状态：implemented / browser-and-participant-validation-pending  
日期：2026-08-21

## 目标

让新手把已保存的单问题测试计划带到桌边，保留可复核的现场事件，并在结束后形成一个有限、可追踪的下一版决定。工具不替用户评严重度，不从次数推因果，也不提供法律同意认证。

## 来源与快照

- 工具 ID：`playtest-session`
- 计划来源：最近一条 `tabletop-workshop-project-v1` 记录；没有计划时显示空状态并回到计划工具。
- 每场会话嵌入来源计划的 ID、创建时间、版本和完整快照。
- 会话不修改来源计划；从计划页“保存并开始主持”时，未变化的最近计划只复用一次。

## 四步

### 01 开场与同意

必填：参与者别名、实际玩家配置、媒介、观察/记录角色、捕捉方式、同意范围，并确认已按所选方式说明记录、用途、保存和撤回。确认框明确不是法律或伦理认证。

### 02 局中事件

会话状态为未开始、进行中、已暂停、已停止或已完成。计时器支持开始、暂停、继续和停止；刷新时保留累计时间。

事件必填：时间/阶段、玩家别名、类型、观察到的动作/原话、当时可见状态、随后结果、与主问题关系。类型包括行为观察、玩家提问、玩家原话、系统结果、主持介入、障碍/协助、停止/安全。主持介入事件额外要求写介入影响。修正事件保留 `revisedAt`。

### 03 结束与追问

单独记录实际停止原因、与计划的偏离、局后开放回答和撤回提醒。局后回答不自动变成局中证据。

### 04 证据与下一版

按支持、反驳、未定和语境展示事件；数量只是导航。决定必填：结果、最强观察、备择解释、保持不变、只改一个轴、下一主问题，并显示来源计划的结论规则。

## 保存、撤回与导出

- 本地键：`tabletop-workshop-playtest-sessions-v1`
- 项目完整包类别：`playtest_sessions`
- 数据形态：`{ schemaVersion: 1, draft, records }`
- “开始新会话”需二次确认，保留历史。
- “撤回并删除当前会话”需二次确认，删除当前本地草稿和同 ID 历史；界面提醒外部录音、照片、云端或已分享副本需另外删除。

独立导出声明：

```yaml
method: live-playtest-session-recorder
local_first: true
no_fun_score: true
no_automatic_severity: true
no_frequency_threshold: true
no_causal_proof: true
no_sample_representativeness_claim: true
no_legal_consent_certification: true
no_silent_plan_mutation: true
```

## 视觉与响应式

主概念稿：`design/concepts/live-playtest-session-desktop.png`，SHA-256 `a4cec708e072c2d429787ff1789b98f93d4de9298d4b4eb26cab687b74a5b444`。复盘态：`design/concepts/live-playtest-session-debrief.png`，SHA-256 `1260d8edc32f2bf75c4cfe862e4055a3116e2aefaed9f6b6115deb3542a4f3f2`。

实现采用左侧只读计划、中间时间线、右侧快速事件表；复盘时切换为证据组与决定表。窄屏改单列，步骤轨横向滚动。概念图用于布局和信息层级，不作为浏览器实现通过证据。

## 证据边界

一份完整会话记录只证明用户填写了相应字段。它不能证明记录完整、主持中立、参与者同意在当地有效、事件严重、机制导致行为、样本代表玩家总体或下一版一定更好。
