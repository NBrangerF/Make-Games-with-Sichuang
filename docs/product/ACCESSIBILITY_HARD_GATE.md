# 键盘、语义与屏幕阅读器硬门

状态：automated_contract_ready; rendered_retest_pending  
日期：2026-08-21  
适用：公开试用前的共享外壳、五个可分享页面与十九项工具

## 结论

网站已有可见焦点、原生按钮/链接/表单、主导航标签、状态区域和减少动态偏好，但不能据此声称符合 WCAG 或“无障碍通过”。本轮建立三道独立证据门：机器门负责发现结构退化，键盘门验证真实顺序与操作，屏幕阅读器门验证中文名称、地标、状态与错误。三者不可互相替代。

第一次真实键盘路径检查发现一项阻断：`#privacy` 上的“跳到主要内容”使用 `#main-content`，与应用 hash router 冲突，激活后跳回 `#path` 且未聚焦当前主内容。修复后链接保留当前规范 hash，并通过事件显式聚焦 `main-content`。同轮源代码扫描又发现工具箱内部四个嵌套 `<main>`，已改为具名 `<section>`；每个路由只保留页面级主地标。

修复已通过 TypeScript、完整生产构建、18/18 无障碍契约和 8/8 URL 导航回归。修后 Browser/IAB 复验尚未签收：本地开发服务在重启/冷编译阶段出现超时，随后 preview/Python 静态服务监听被环境 `EPERM` 拒绝。该环境阻塞只影响渲染证据，不推翻修前复现，也不能让静态检查冒充修后通过。

## 标准依据

- W3C 对 [WCAG 2.2 SC 2.4.1 Bypass Blocks](https://www.w3.org/WAI/WCAG22/Understanding/bypass-blocks.html) 的说明要求提供绕过重复内容的机制；主内容地标和真正可工作的跳过链接都属于本项目范围。
- [SC 2.1.1 Keyboard](https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html)要求除自由路径动作外的功能可由键盘操作；本项目没有必须依赖自由手势的核心功能。
- [SC 2.4.3 Focus Order](https://www.w3.org/WAI/WCAG22/Understanding/focus-order.html)要求顺序导航保持意义与可操作性；横向步骤轨道、抽屉和长表单必须实际走查。
- [SC 2.4.7 Focus Visible](https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html)与 [SC 2.4.11 Focus Not Obscured](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html)分别约束焦点可见和不被完全遮挡；有 CSS 不等于所有状态都已满足。
- [SC 4.1.2 Name, Role, Value](https://www.w3.org/WAI/WCAG22/Understanding/name-role-value.html)要求控件名称、角色和状态可由辅助技术确定；优先原生 HTML，并对选中、对话框与状态变化提供程序化信息。
- [SC 3.3.2 Labels or Instructions](https://www.w3.org/WAI/WCAG22/Understanding/labels-or-instructions.html)用于表单标签与必填说明；[SC 2.5.8 Target Size (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)进入移动端指针检查，但不替代键盘门。

这些 Understanding 页面是解释材料；最终合规判断必须回到规范、测试范围与真实辅助技术组合。本项目当前不作合规声明。

## 三层硬门

### 机器门

`pnpm qa:a11y-contract` 必须全部通过，至少覆盖：

- `zh-CN` 文档语言；
- 所有路由变体的唯一页面级 `main#main-content[tabindex=-1]`；
- 工具内部不得嵌套 `<main>`；
- skip link 保留当前路由并显式聚焦 main；
- 可见 `:focus-visible`、减少动态、主导航名称与 `aria-current`；
- pressed 状态、dialog 名称/模态、live status/alert；
- 装饰 SVG 隐藏、无正数 tabindex、无静态 div/span 冒充点击控件；
- 横向导航只在自己的容器滚动。

机器门能拒绝已知结构退化，不能证明焦点顺序合理、控件真的可操作、可见焦点没有被遮挡、中文朗读自然、错误信息被宣布或任务能独立完成。

### 键盘门

使用真实浏览器，只用 Tab、Shift+Tab、Enter、Space、方向键（原生控件需要时）与 Escape。每项记录 URL、视口、浏览器、构建 ID、起始状态、按键序列、焦点结果、阻断与截图。

| ID | 路径 | 必须观察的通过信号 |
| --- | --- | --- |
| K1 | 每个路由首个焦点 → 跳到主要内容 | 链接可见；激活后 hash/标题不变，焦点在当前唯一 main，正文未被 sticky header 完全遮挡 |
| K2 | 主导航前进/后退 | 顺序与视觉一致；活动页有当前状态；移动端“方法”仍可到达，不形成横向滚动陷阱 |
| K3 | `#path` 卡点 → 核心指南 → 工具 | 所有动作可由 Enter/Space 完成，焦点不会跳到页面开头或丢失 |
| K4 | `#resources` 搜索、六维筛选、清除 | 标签可读，改变后结果/空状态明确，横向入口轨道可进入也可离开 |
| K5 | `#tools/experience-intent` → `core-loop` → `prototype-scope` | 步骤状态可知；输入、选择、保存、继续与返回顺序合理 |
| K6 | 测试计划抽屉 | 打开后焦点进入对话框；Tab 不逃到背景；Escape/关闭后回到触发点 |
| K7 | 现场记录 → 证据复盘 → 发现演化 | 长表单、单选/复选、时间线修正、历史只读与后继按钮都可操作，无嵌套 main |
| K8 | `#privacy` 二次删除 | 第一次只出现 alert；第二次 destructive 动作只在专用空白资料中验证，不能用真实项目记录 |

K1–K8 任一任务出现键盘陷阱、路由错跳、焦点丢失、背景可操作或核心动作不可达，即阻断公开试用。

### 屏幕阅读器门

至少覆盖 macOS VoiceOver + Safari，以及 Windows NVDA + Firefox 或 Chrome；若只能完成一组，状态必须写为“部分”，不能外推。使用网站中文内容语言，记录实际播报而非只抄 DOM。

| ID | 任务 | 必须听到/确认 |
| --- | --- | --- |
| S1 | 地标与标题导航 | 每页一个主地标；导航、补充区域、页脚和 H1 顺序有意义 |
| S2 | 路由变化 | 页面标题与当前页面/工具身份可发现，不把旧页内容留在虚拟光标中 |
| S3 | 表单读取 | 可见标签、必填提示、输入类型、选择状态和帮助文字可关联 |
| S4 | 状态与错误 | autosave、加载失败、保存失败、二次确认与成功状态在合适时机宣布，不重复轰炸 |
| S5 | 选中与步骤 | `aria-pressed`、radio/checkbox、展开/折叠和当前导航状态与视觉一致 |
| S6 | 抽屉与焦点恢复 | 对话框名称、模态边界、关闭和回到触发点成立 |
| S7 | 数据表/矩阵 | 发现演化矩阵的行、列和关系可理解；若 role table 不足，必须改用原生 table 或补齐语义 |
| S8 | 删除与隐私 | 风险、范围和不可撤销性在按钮前可读；状态不会暗示已删除外部副本 |

## 抽样与发布规则

共享外壳和 K1/K2 必须在全部五个路由运行。十九工具中，意图—循环—范围—计划—现场—复盘—综合七工具全流程必测；其余十二工具至少完成标题/步骤/首表单/保存或导出的键盘与名称角色状态烟测。移动端至少 390×844，另补 375px；桌面至少 1280px。Safari/VoiceOver 与 NVDA 组合未完成前，Phase 3 的“无阻断级无障碍问题”保持未达成。

## 证据记录模板

```text
build_id:
route / tool:
browser + assistive technology:
viewport:
task_id:
starting state:
keystrokes / commands:
expected focus or announcement:
observed focus or announcement:
pass / fail / blocked:
severity if failed:
repair and file:
retest evidence:
```

不得记录参与者真实姓名、联系方式、完整语音或原始屏幕录制到仓库。真实残障玩家测试是产品证据，不等于替参与者做诊断，也不能被自动扫描或非残障内部走查替代。
