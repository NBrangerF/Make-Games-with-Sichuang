# Phase 1 决定空间与单轮决定轨迹交接

日期：2026-08-17  
状态：代码、内容与生产构建通过；浏览器硬门槛待允许本地服务的环境补验

## 本轮目标

把“有意义的选择、决定空间、玩家互动、策略深度与可重玩性”从模糊质量词转成可追溯研究、中文专项指南、机器内容关系和一个不打分的桌面测试工具。

## 已完成

### 研究

- 新增 [专项研究 07](../research/DECISION_SPACE_INTERACTION_01.md)，区分来源事实、项目推断与产品建议。
- 深读/审阅 17 条新来源：2 条研究页/论文、4 条设计师文章或演讲、3 条 kingmaking/Oath 案例、3 条 Decision Space 玩家/实践文章、3 条可重玩性/深度玩家文章，以及 2 条大样本研究入口。
- 对审阅深度保持保守：Nature/PubMed 与 UW 次要目标研究标 `article_level`；David King 仓储条目标 `metadata_only`；没有把摘要冒充全文。
- 更新来源台账和研究问题地图。核心边界：陌生双人抽象策略研究不能代表谈判/合作/隐藏信息/身体操作/专家学习；数字游戏的留存和进度不等于实体桌游乐趣、深度或重玩意愿。

### 内容模型

- 资源：85 → 102。
- Claim：42 → 50。
- 专项指南：5 → 6。
- 规范术语：32 → 38。
- 逐资源无总分审阅：85 → 102。
- 核心系统指南现连接 18 条来源、17 条 Claim、14 个概念和 4 个工具。
- 新增专项指南 [别数选项，追一轮真实决定](../guides/DECISION_TRACE.md)。

机器内容外键和一对一审阅均由 `scripts/validate-content.mjs` 校验。

### 交互工具

新增“单轮决定轨迹”，字段包括：

1. 版本与反馈可见时机；
2. 玩家语境和一个决定时刻；
3. 当前目标；
4. 合法选项与实际考虑选项；
5. 第一次选项坍缩；
6. 信息状态与机会成本；
7. 可选互动影响路径；
8. 行动前预测、实际行动与实际后果；
9. 玩家模型更新；
10. 下一版单一改动。

本地键：`tabletop-workshop-decision-traces-v1`。

导出协议：

```json
{
  "schema_version": 1,
  "method": "single-decision-trace",
  "no_aggregate_score": true,
  "traces": []
}
```

工具不计算决定质量、玩家能力、互动强度、策略深度或可重玩性。互动路径允许留空；一条轨迹只定位下一次实验。

### 界面与回归覆盖

- 工具复用既有已接受工作台视觉系统，没有引入新卡片网格或评分徽章。
- 桌面保持表单—摘要双栏；375px 断点改成单栏；工具标签维持内部横向滚动。
- `scripts/qa-site.cjs` 已加入第六篇专项指南、指南直达工具、滚动归零、保存、本地结构、真实下载 JSON、无总分、桌面截图、375px 宽度/输入宽度和移动截图断言。
- 回归断言已从不可维护的单行表达迁成带标签的检查列表，失败时可直接看到对应表面。

## 验证结果

已通过：

```text
pnpm resources:health
pnpm content:check
pnpm exec tsc -b --pretty false
pnpm build
node --check scripts/qa-site.cjs
```

内容校验输出：

```text
102 resources, 50 claims, 5 frameworks, 6 core guides,
6 special guides, 38 terms, 102 assessments,
22 design constraint cards, 50 local files
```

生产构建成功。Vite 仍报告单个 JS chunk 超过 500 kB；这是性能待办，不是构建失败。

资源健康快照覆盖 102 条资源，当前为 `reachable 0 / blocked 0 / dead 0 / error 102`。运行环境无法访问外网；`error` 只表示本次网络检查失败，不表示链接已死，也不会触发自动删除。

## 未通过/未宣称通过

`pnpm qa` 依赖本地预览服务。本轮实际运行等待 60 秒后报告 `preview server did not become ready`；随后直接运行 `pnpm preview --host 127.0.0.1 --port 5175`，确认根因是 `listen EPERM: operation not permitted 127.0.0.1:5175`。应用内浏览器此前又按 URL 安全策略拒绝 `file://`，并明确禁止切换旁路规避。因此：

- 没有把浏览器回归标记通过；
- 没有新建或接受 `decision-trace` 桌面/移动截图；
- 没有用旧截图冒充本轮证据；
- 最新实际截图与 `design/concepts/workbench-primary.png` 的 `view_image` 对照硬门槛仍待补。

## 下一步

1. 在允许绑定本地端口的环境运行 `pnpm qa`，修复任何实际失败。
2. 用应用内浏览器检查第六篇专项指南直达、保存态、下载、滚动归零、控制台和桌面/移动布局；用 `view_image` 对照最新截图。
3. 招募真实中文新手，以纯观察、赛后回放和有限即时追问比较字段负担及记录偏差。
4. 为谈判、合作、隐藏身份、实时/身体操作与战役式长期学习分别研究附加字段，不直接扩张当前通用表单。
5. 在有外网环境刷新资源健康快照；人工复核 `blocked`/`dead`，不根据自动结果批量删除。
6. 另开性能包处理 Vite 500 kB chunk 警告；不要把它与内容研究或决定轨迹可用性混为一项。
