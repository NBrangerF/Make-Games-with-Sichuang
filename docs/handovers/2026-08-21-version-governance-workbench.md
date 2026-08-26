# Phase 1 内容版本治理工作台交接

日期：2026-08-21  
状态：implementation complete / browser and participant validation pending

## 本轮交付

- 新增第 13 个正式工具“内容版本治理”，把内容护照、兼容矩阵、当前事实源、治理时间线、回归与旧版迁移放入一个本地优先工作流。
- 第 30 篇专题指南新增直接工具入口；内容校验器接受该稳定工具 ID。
- 新增版本化草稿与快照存储、唯一当前事实源、动态配置/来源、保存前必填门、二次确认清空、独立治理包导出。
- 完整项目包新增 `version_governance_records`，从 12 类增加为 13 类记录。
- 生成并保存完整桌面概念稿；新增桌面/移动端样式与浏览器回归步骤。
- 新增 16 项机器结构守卫、产品规格和 T1–T6 形成性测试协议；新工作台按打开意图加载。

## 关键文件

- `src/version-governance-workbench.tsx`
- `src/App.tsx`
- `src/data.ts`
- `src/styles.css`
- `content/special-guides.json`
- `scripts/check-version-governance-workbench.mjs`
- `scripts/qa-site.cjs`
- `design/concepts/version-governance-workbench.png`
- `docs/product/VERSION_GOVERNANCE_WORKBENCH.md`
- `docs/product/USABILITY_TEST_VERSION_GOVERNANCE_WORKBENCH.md`

## 关键决定

1. 兼容性以完整配置行记录，不设置“支持全部扩展”总开关。
2. “声明支持”和“已验证”是不同证据状态；导出固定声明不构成兼容认证。
3. 当前事实源保持唯一，历史与补充来源不删除。
4. 公告、生效、复查分别保存；回退门必须单独写。
5. 草稿自动保存，显式保存才创建快照；清草稿不删快照。
6. 稀有度只记录五个事实字段，不给推荐、等级或强度分。

## 验证证据

- `pnpm qa:version-governance`：16/16 通过。
- `node --check scripts/qa-site.cjs`：语法通过。
- `pnpm content:check`：519 资源、25 入口、279 Claim、5 框架、6 核心指南、30 专题指南、275 术语、519 审阅、22 约束牌与 50 本地文件通过；贡献包 11 个发布守卫通过。
- `pnpm check`：通过。
- `pnpm build`：Vite 8.2.1，35 个模块；CSS 55.21 kB（gzip 9.44）、版本治理按需 chunk 18.21 kB（gzip 5.09）、主 JS 480.86 kB（gzip 147.05）、方法目录 484.43 kB（gzip 160.46）、资源目录 718.35 kB（gzip 189.54）。资源目录继续触发 500 kB 警告。
- 浏览器脚本已加入指南直达、保存、导出、边界字段、项目包第 13 类记录、375px 页面宽度/输入宽度/步骤滚动检查。

## 仍未完成

- 2026-08-21 重试仍在本地监听返回 `EPERM`；应用内浏览器的 `file://` 入口被安全策略拒绝。既有应用内地址超时和 Chrome `SIGABRT` 也无解除证据；没有生成或宣称新的真实渲染截图、控制台、焦点、下载或响应式通过。
- 概念图已经审阅，实现代码尚不能在阻塞环境中与真实渲染逐项视觉比较；[视觉账本](../product/FIDELITY_LEDGER.md)必须保留这一缺口。
- T1–T6 尚未由中文新手、旧版持有者和支持条件参与者执行。
- 当前只支持本地单机记录，不抓取 FAQ、不做多项目归属、不做同步与多人审批。

## 下一步

1. 环境可用后先跑 `pnpm qa`，查看 `design/qa/version-governance-desktop.png` 与 `version-governance-mobile.png`，再用 `view_image` 对照概念稿。
2. 执行 4–6 人形成性测试，优先观察“声明支持/已验证”、公告/生效、草稿/快照和迁移劳动误读。
3. 若用户确实需要多项目，在所有工具记录增加显式 `project_id` 后再迁移；不得按标题或版本字符串猜归属。
