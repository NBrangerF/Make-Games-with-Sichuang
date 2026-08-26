# Phase 1 交接：中文玩家声音与反例

日期：2026-08-18  
状态：内容与入口已接入，待真实浏览器和目标用户验证

## 本轮产出

本轮把中文资料扩展从“设计师怎样做”推进到“玩家在什么局面中遇到什么”。采用目的性症状抽样，不计算情绪或人气，也不从匿名帖子推断总体玩家偏好。

| 内容 | 前一轮 | 本轮后 |
|---|---:|---:|
| 资源 | 176 | 187 |
| 逐资源审阅 | 176 | 187 |
| 可追溯 Claim | 89 | 95 |
| 任务型阅读入口 | 4 | 5 |
| 中文语言资源 | 24 | 35 |

新增研究报告：[中文玩家声音与反例](../research/CHINESE_PLAYER_VOICES_01.md)。来源台账、资源数据、逐条审阅和维护快照已经同步。

## 新增来源范围

- 聋人组织者／玩家对翻译、读唇视线、同时发言、主持和活动劳动的一手记录；
- 为近乎全盲朋友寻找当前可购买游戏的社区求助；
- 轮椅使用者的历史场地访问任务调查；
- 中文特殊需求学生桌游调整综述；
- 合作决定代办、共享状态与等待、亲子决定、谈判家规、规则查询、教学依赖和谈判社交契约的玩家复盘。

所有社区内容只链接和摘要。2010 场地帖子只保留任务结构，不推荐当前店铺；视障求助帖不生成“适合盲人”清单；一位家庭或玩家的经历不外推到整个群体。

## 新增 Claim

- `claim-player-symptom-needs-situation-chain`
- `claim-downtime-includes-state-volatility`
- `claim-teaching-order-follows-decision-dependency`
- `claim-access-includes-coordination-labor`
- `claim-house-rules-are-testable-hypotheses`
- `claim-child-fit-is-decision-specific`

同时把中文玩家和无障碍来源补入既有合作能动性、信息界面任务测试、沟通／身体／认知无障碍、访问成本和谈判边界 Claim。

## 第 5 个阅读入口

`player-symptom-diagnosis` 面向“玩家说拖、乱、没参与感或规则难找，我不知道改哪里”的新手。入口给出 8 条材料，要求先保留版本、群体、局面、动作和后果，再提出可观察问题。

该入口不是负面评价榜、自动诊断或个性化推荐。家规、适配和教学方案仍是待测版本。

## 维护与验证

- `pnpm resources:health` 已生成 187 条完整快照；受限环境结果为 `reachable 0 / blocked 0 / dead 0 / error 187`，只表示 Node 外网请求不可用，不判定链接死亡；
- `pnpm content:check`：通过，`187 resources / 5 entry points / 95 claims / 5 frameworks / 6 core guides / 10 special guides / 67 terms / 187 assessments / 22 cards / 50 local files`；
- `node --check scripts/qa-site.cjs`：通过；回归契约已更新为 5 个入口与 187 条全部资源；
- `pnpm check`：通过；
- `pnpm build`：通过，CSS 48.55 kB（gzip 8.23 kB），JS 761.49 kB（gzip 222.81 kB）；主包仍有大于 500 kB 的拆包警告；
- `pnpm qa`：preview 启动失败，`listen EPERM: operation not permitted 127.0.0.1:5175`。因此没有本轮浏览器交互、键盘、屏幕阅读器或视觉验收，不把构建通过描述成页面已真实渲染。

## 下一步

1. 用真实中文新手测试第五入口能否把评价改写成观察问题，尤其检查“语境链”是否过重。
2. 邀请相关玩家本人审阅沟通、场地、购买与协助字段；教育者和亲友材料不能代替共同设计。
3. 在现有测试工具中评估是否加入“决定开始时刻”“预案失效”“被代办的决定”“查询恢复路径”和“适配劳动”字段。
4. 继续补足由视障、肢体障碍和神经多样性玩家本人参与分析的中文材料，并降低 PTT 重度爱好者样本偏差。
