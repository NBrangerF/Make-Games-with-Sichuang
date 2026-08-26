# 交接：证据复盘与变更简报

日期：2026-08-21

## 已完成

- 把既有 `feedback` 从原话分拣器升级为“承接会话 → 选择证据 → 形成发现 → 版本决定”的正式工作台；正式工具总数仍为 18。
- 建立 v2 本地 schema 和 v1 保守迁移；不伪造旧记录的来源、版本、条件或反证。
- 从已完成现场会话导入版本化证据池，人工选择事件/局后回答；不自动聚类、评分或下结论。
- 加入五种处理动作、候选方案、拒绝方案、保持项、单一变化轴、具体改动、回退信号和下一问题。
- 加入显式项目下一步复制、JSON 边界声明、两步新建与来源撤回本地级联。
- 新增 7 个资源、5 条主张和第 31 个资源入口；当前为 556 资源、306 主张、31 入口、556 评估。
- 生成并检查两张概念图；内置 Imagegen 最终提示聚焦暖白纸面、钴蓝网格、砖红证据、高信息密度三栏工作台和版本决定态。

## 关键文件

- 实现：[src/evidence-review-workbench.tsx](/Users/shawn.fsc/Documents/ChatGPT/游戏设计/src/evidence-review-workbench.tsx)
- 样式：[src/styles.css](/Users/shawn.fsc/Documents/ChatGPT/游戏设计/src/styles.css)
- 研究：[PLAYTEST_EVIDENCE_SYNTHESIS_RESEARCH_01.md](/Users/shawn.fsc/Documents/ChatGPT/游戏设计/docs/research/PLAYTEST_EVIDENCE_SYNTHESIS_RESEARCH_01.md)
- 产品契约：[EVIDENCE_REVIEW_CHANGE_BRIEF.md](/Users/shawn.fsc/Documents/ChatGPT/游戏设计/docs/product/EVIDENCE_REVIEW_CHANGE_BRIEF.md)
- 可用性脚本：[USABILITY_TEST_EVIDENCE_REVIEW.md](/Users/shawn.fsc/Documents/ChatGPT/游戏设计/docs/product/USABILITY_TEST_EVIDENCE_REVIEW.md)

## 下一步

1. 在可监听本地端口的环境执行已经更新的端到端脚本，完成桌面/手机浏览器验收与视觉对照。
2. 用中文新手执行形成性任务，重点观察反证、候选方案与显式项目写回是否被正确理解。
3. 下一增量优先研究跨会话、跨版本发现如何人工合并；不要直接做自动聚类或严重度排序。

## 验证结果

- `pnpm qa:evidence-review`：48/48。
- 上游回归：现场会话 42/42，单问题计划 29/29。
- `pnpm check`、`pnpm content:check`、`pnpm build`：通过；Vite 转换 42 个模块，新工作台独立 chunk 18.09 kB（gzip 5.86）。
- `pnpm qa`：未执行到产品，preview 监听 `127.0.0.1:5175` 返回 `EPERM`；不计为浏览器通过。

## 已知边界

- 当前只处理单场会话，不提供跨场聚类。
- 撤回只能清除本站当前浏览器里的关联记录，不能追回导出副本。
- 项目数据仍为浏览器本地存储，无账户、同步、加密或协作保证。
- 概念图是视觉规范，不是实现截图；浏览器未跑通前不得宣称像素级或交互保真。
