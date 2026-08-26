# 键盘、语义与屏幕阅读器硬门交接

日期：2026-08-21  
状态：automated contract passed; rendered skip-link retest blocked; AT testing not started

## 本轮完成

1. 以 W3C WCAG 2.2 的 Bypass Blocks、Keyboard、Focus Order、Focus Visible/Not Obscured、Name Role Value、Labels 与 Target Size 为一手基线，建立机器、键盘、屏幕阅读器三道独立门。
2. Browser/IAB 真实复现 skip-link 阻断：`#privacy` 激活 `#main-content` 后被 hash router 规范化成 `#path`，焦点留在 body。
3. 修复为保留当前规范 hash，并在激活时阻止默认导航、显式聚焦当前 `main#main-content`。
4. 源码语义扫描发现四个工具内部嵌套 `<main>`；现场记录、证据复盘、发现演化当前/历史主工作区均改为具名 `<section>`。
5. 新增 `ACCESSIBILITY_HARD_GATE.md`：K1–K8 键盘任务、S1–S8 屏幕阅读器任务、浏览器/AT 组合、抽样范围、证据模板和 No-Go 条件。
6. 新增 `pnpm qa:a11y-contract` 并进入 `content:check`：18 项守卫覆盖页面主地标、skip link、可见焦点、减少动态、导航状态、dialog、live/alert、SVG、tabindex 和伪控件等退化。

## 验证证据

- 修前 Browser/IAB：`#privacy` → 跳到主要内容 → `#path`，H1 变为“你的游戏，现在卡在哪里？”，焦点为 body；阻断成立。
- `pnpm qa:a11y-contract`：18/18 通过。
- TypeScript 直接检查：在 512 MB Node 上限下通过。
- `pnpm build`：完整内容门、发布门、无障碍门与生产打包通过；45 模块，主 JS 502.95 kB（gzip 153.93），CSS 118.08 kB（gzip 17.89）。
- `pnpm qa:url-navigation`：8/8 通过；回归规则已改为同时要求保留当前路由和聚焦主内容，并补入 `#privacy` 的 hash/标题往返。
- 修后 Browser/IAB：未签收。Vite 冷启动/模块加载在当前回合异常缓慢，后续 preview 与 Python 静态服务器监听返回 `EPERM`；不能把静态代码推断成真实焦点证据。

## 仍未完成

- K1 修后真实 Enter/焦点/不遮挡复验。
- K2–K8 的全键盘路径，尤其抽屉焦点圈定与关闭后恢复。
- VoiceOver + Safari 和 NVDA + Firefox/Chrome 的 S1–S8。
- 375px、Safari、Firefox、目标尺寸/对比度和屏幕放大组合。
- 真实残障玩家任务；自动守卫和内部走查都不能替代。

## 下一位执行者

1. 本地端口恢复后第一件事只复测 K1：五个路由分别激活 skip link，记录 hash、title、activeElement 和焦点截图。
2. 若 K1 通过，再执行 K2/K6；抽屉焦点没有被圈定或没有恢复时立即修，不继续积累假通过。
3. 在可用的 macOS Safari/VoiceOver 先跑 S1/S2/S3/S6；Windows NVDA 必须作为另一组独立证据。
4. 把逐任务结果写入新会话文档，不在本交接中覆盖历史失败。
5. 在所有阻断清零前保持 Phase 3 未完成、公开试用 No-Go。

## 入口

- [键盘、语义与屏幕阅读器硬门](../product/ACCESSIBILITY_HARD_GATE.md)
- [公开试用发布契约](../product/PUBLIC_TRIAL_RELEASE.md)
- `scripts/check-accessibility-contract.mjs`
- `src/App.tsx`
- `src/playtest-session-recorder.tsx`
- `src/evidence-review-workbench.tsx`
- `src/evidence-synthesis-workbench.tsx`
