# Phase 1 主题承诺、历史表达与伤害复核交接

日期：2026-08-17  
状态：研究、内容、类型检查与生产构建通过；浏览器视觉回归受沙箱端口限制待补

## 本轮完成

- 新增专项研究 `THEME_REPRESENTATION_SAFETY_01.md`，覆盖主题—机制整合、历史抽象、可玩视角、文化顾问/共创、内容提示、暴露路径、退出与修复。
- 新增 12 条资源与 12 份无总分逐条审阅；总计 128 条资源、128 份审阅。
- 新增 8 条可追溯 Claim；总计 64 条。
- 新增 7 个规范概念；总计 51 个。
- 新增第 8 篇专项指南“别问主题够不够浓，追它让玩家做了什么”。
- 新增 `theme-review` 工具：本地保存与 JSON 导出，不收集创伤史或诊断信息。
- 工具把主题承诺、玩家位置、重复行动、奖励/后果、自动化/省略、史料与不确定性、文化协作、接触方式、内容提示、选择/退出/修复和第一次错位放在同一次复核中。

## 研究与证据边界

- “先有主题还是先有机制”不能替代整合检查；本轮把主题视为系统对玩家行动、奖励、代价与省略作出的承诺。
- 历史抽象不是中性的缩写。它决定谁可操作、谁被自动化、哪些代价可见；语料统计可以显示行业分布与偏差，但不能单独裁定某个作品。
- 文化协作应尽早影响可玩视角、规则与制作流程，而不只是成品后的事实核对；现有材料以方法、项目记录和从业者经验为主，不把它们冒充受控效果研究。
- 设计者意图与玩家实际影响必须分别记录。圆桌、博客和案例能揭示冲突与拒绝边界，但不能代表全部玩家。
- 内容提示研究的元分析没有发现其平均上能显著降低接触后的负面情绪、回避或理解负担，并发现它会增加预期焦虑；这不等于透明告知、知情选择或退出安排没有伦理与产品价值。
- “情绪安全”在相关角色扮演研究中是一组与语境、支持、风险和责任有关的程序，不是产品标签或效果保证；这些结论不能无条件外推到所有封闭式桌游。

## 工具与数据契约

- 存储键：`tabletop-workshop-theme-reviews-v1`。
- 导出字段：`schema_version: 1`、`method: theme-commitment-and-harm-review`。
- 导出固定声明：`no_aggregate_score: true`、`no_safety_certification: true`。
- 不计算“伦理分”“安全分”或综合分，不输出安全认证。
- 不要求记录真实姓名、族群身份、创伤史、诊断或其他敏感经历；必要信息应以作品位置、协作角色和可执行安排表达。
- 内容提示负责告知；选择、退出、暂停、替代参与和事后修复另设字段，避免把一个提示框包装成完整安全措施。

## 验证证据

- `pnpm resources:health`：重建 128 条快照；当前沙箱无外网，结果为 `0 reachable / 0 blocked / 0 dead / 128 error`。这表示网络环境错误，不表示 128 条链接失效。
- `pnpm content:check`：通过，输出 `128 resources, 64 claims, 5 frameworks, 6 core guides, 8 special guides, 51 terms, 128 assessments, 22 design constraint cards, 50 local files`。
- `pnpm check`：TypeScript 通过。
- `pnpm build`：内容校验与 Vite 生产构建通过，`dist/index.html` 已生成；构建保留了大于 500 kB 的主 JS chunk 警告，属于后续性能拆包项，不是构建失败。
- `node --check scripts/qa-site.cjs`：通过，新增主题复核工具的保存、导出、无总分/无认证与移动端断言已进入回归脚本。

## 构建脚本说明

- 本轮曾把内容校验、TypeScript 与 Vite 串在同一个 `pnpm build` 进程链中；在此环境反复触发操作系统 `exit 137`，即使提高 Node 堆上限也不能稳定通过。
- 现改为 `pnpm check` 独立执行 TypeScript，`pnpm build` 执行内容校验与 Vite 构建。两条命令均已分别通过；检查是拆分而非删除。
- README 已同步真实命令，后续 CI 应显式连续运行 `pnpm check` 与 `pnpm build`。

## 视觉与浏览器边界

- 本轮沿用已接受概念 `/Users/shawn.fsc/Documents/ChatGPT/游戏设计/design/concepts/workbench-primary.png`，没有重新生成视觉方向。
- 当前运行环境禁止 localhost 监听，已知错误为 `listen EPERM`；因此没有取得这一工具的新浏览器截图，不能把生产构建通过写成浏览器视觉 QA 通过。
- 回归脚本已准备桌面与 375px 路径，待在允许本地端口的环境执行 `pnpm qa`。

## 下一步

1. 在允许本地端口的环境运行 `pnpm qa`，补桌面/375px 截图、保存、JSON 导出和横向溢出检查。
2. 用 3–5 个真实原型试填，比较“研究/编辑完整复核”与“测试前快速复核”的字段负担，不先删除退出、修复或不确定性字段。
3. 补充中文设计师的历史表达、文化协作和内容提示实践；优先寻找具体版本变化与失败案例。
4. 邀请有被呈现社群经验的协作者审阅工具语言与参与权，而不是让工具替代实际关系和付费协作。
5. 后续增加“主题承诺随版本变化”的差异比较，并研究是否需要把大型工具组件按路由拆包。

## 继续工作入口

- 研究：`docs/research/THEME_REPRESENTATION_SAFETY_01.md`
- 指南：`docs/guides/THEME_COMMITMENT_HARM_REVIEW.md`
- 机器内容：`content/resources.json`、`content/resource-assessments.json`、`content/claims.json`、`content/glossary.json`、`content/special-guides.json`
- 工具：`src/App.tsx` 中的 `ThemeReviewTool`
- 回归：`scripts/qa-site.cjs`
