# Phase 1 合作与共享决定观察交接

日期：2026-08-17  
状态：内容、类型检查与生产构建通过；浏览器视觉回归受沙箱端口限制待补

## 本轮完成

- 新增专项研究 `COOPERATION_SHARED_DECISION_01.md`，覆盖合作、谈判、隐藏信息、社交推理、沟通限制和决定代办。
- 新增 14 条资源与 14 份无总分逐条审阅；总计 116 条资源、116 份审阅。
- 新增 6 条可追溯 Claim；总计 56 条。
- 新增 6 个规范概念；总计 44 个。
- 新增第 7 篇专项指南“别数谁说得多，追一次共同决定”。
- 新增 `shared-decision` 工具：本地保存、JSON 导出、`no_aggregate_score: true`，不记录真实姓名。
- 工具字段覆盖参与约定、决定归属、信息/权限、提案/回应、拍板/执行/后果、同意核对、沟通可达条件、第一次错位和单一改动。

## 关键内容决定

- 用“决定代办”作为首选词，把 `quarterbacking` / `alpha gamer problem` 保留为检索别名，避免人格化。
- 不用发言次数判断参与或控制；沉默固定显示为无法判断。
- 把被请求的导师/翻译/辅助操作与非自愿代办分开。
- 不把隐藏信息、角色不对称或禁言作为默认修复；每种做法都要同时检查贡献路径、学习和可达性。
- 谈判测试必须写真实杠杆、拒绝权、承诺后果与收束边界。

## 验证证据

- `pnpm resources:health`：重建 116 条快照；当前沙箱无外网，结果为 `0 reachable / 0 blocked / 0 dead / 116 error`，表示网络环境错误，不表示 116 条链接失效。
- `pnpm content:check`：通过，输出 `116 resources, 56 claims, 5 frameworks, 6 core guides, 7 special guides, 44 terms, 116 assessments, 22 design constraint cards, 50 local files`。
- `pnpm check`：TypeScript 通过。
- `pnpm build`：生产构建通过，`dist/index.html` 已生成。

## 视觉与浏览器边界

- 复用了已接受概念 `/Users/shawn.fsc/Documents/ChatGPT/游戏设计/design/concepts/workbench-primary.png`，本轮开始实现前已用 `view_image` 重新检查。
- 这是现有设计系统内的小工具扩展，没有重新生成视觉概念。
- 当前运行环境禁止 localhost 监听，上一包已用直接 `vite preview` 确认 `listen EPERM`；因此本轮无法取得新的浏览器截图，也不能完成概念与最新截图的双图验收。不要把生产构建通过写成浏览器视觉 QA 通过。

## 下一步

1. 在允许本地端口的环境运行 `pnpm qa`，补充共享决定工具的桌面/375px 截图、保存、导出和移动端横向溢出检查。
2. 用 3–5 场真实合作/谈判测试检查 17 个字段是否过重；优先比较主持版与快速版，不先删掉同意或可达性字段。
3. 补中文合作设计日志、决定代办失败案例、谈判机制回顾，以及真实残障玩家参与的有限沟通研究。
4. 取得信息不对称论文全文，复核十对参与者的研究设计和测量。

## 继续工作入口

- 研究：`docs/research/COOPERATION_SHARED_DECISION_01.md`
- 指南：`docs/guides/SHARED_DECISION_OBSERVATION.md`
- 机器内容：`content/resources.json`、`content/resource-assessments.json`、`content/claims.json`、`content/glossary.json`、`content/special-guides.json`
- 工具：`src/App.tsx` 中的 `SharedDecisionTool`
