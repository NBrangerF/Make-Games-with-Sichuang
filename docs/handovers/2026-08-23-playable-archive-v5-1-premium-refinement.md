# 2026-08-23 Playable Archive V5.1 高级化精修交接

状态：设计手册、令牌、全站实施与浏览器证据完成  
构建标识：`playable-archive-v5-1`  
产品品牌：桌游设计工坊  
设计系统：当代桌游设计馆 Contemporary Tabletop Design Museum 5.1

最终本地预览：`http://127.0.0.1:8017/?build=playable-archive-v5-1#resources`

## 1. 本阶段结果

V5 的“经典桌游档案馆”方向被保留，视觉从硬边、暖纸、强装饰进一步升级为“当代设计博物馆 × 高级桌游出版物”。高级感来自比例、排版、留白、图片策展、细规则线、冷白纸面和克制深度，不来自增加卡片、装饰或功能。

信息架构、中文内容、资源优先次序和核心功能保持不变：

- 可见一级导航仍只有“找资料 / 方法与概念”。
- 首页仍只有学习、设计师分析、按问题找资料三个主入口。
- 资源仍按阶段和当前问题组织。
- 中文内容继续站内完整阅读。
- 工具仍和已选资料、方法或单元结合，不恢复独立工具货架。
- 不按年龄分站，而用清楚动词、结果提示、合理字号和逐步决定支持不同背景。

## 2. 设计权威

| 文件 | 作用 |
| --- | --- |
| `docs/product/TABLETOP_VISUAL_DESIGN_MANUAL_V5_1_PREMIUM.md` | V5.1 正式设计手册；设计原则、三旋钮、色彩纪律、页面模板、素材、响应式、无障碍与禁止项 |
| `docs/product/tabletop-visual-tokens-v5-1.json` | V5.1 数值真源；冷白画布、深墨、钴蓝、语义色、字体、间距、边界和深度 |
| `src/visual-tokens.css` | 由 V5.1 JSON 机械生成的运行时令牌 |
| `docs/qa/PLAYABLE_ARCHIVE_V5_1_FIDELITY_LEDGER_2026-08-23.md` | 概念、最终截图、文案差异、修复、有意差异与签收 |

冻结设计旋钮为 `7 / 4 / 3`。主要色值：画布 `#F7F8FA`、顶栏 `#031A2B`、主行动 `#0B55C9`、危险 `#B73730`、提醒 `#E5B323`、完成 `#176A47`。红黄绿不得用作普通栏目分类。

## 3. 主要实现文件

| 文件 | 作用 |
| --- | --- |
| `src/styles-v5-1.css` | 最后加载的全站高级化实施层 |
| `src/classic-visual-board-v5-1.css` | 首页经典桌游策展图录及响应式布局 |
| `src/classic-visual-board.tsx` | 四张图片、中文图注、摄影者与许可的语义组件 |
| `src/resource-start-v2.tsx` | 首页固定两行标题与现有三个任务入口 |
| `src/App.tsx` | 页脚隐藏技术构建号，保留隐私页中的完整构建信息 |
| `scripts/generate-visual-tokens.mjs` | 从 V5.1 JSON 映射运行时变量 |
| `scripts/capture-playable-archive-v5-1.mjs` | 9 个视觉状态、图片、溢出、H1、目标尺寸和核心互动证据 |
| `package.json` | 新增 `qa:visual-v5-1` |

## 4. 概念与正式截图

五张接受概念：

- `design/concepts/playable-archive-v5-1-home-premium.png`
- `design/concepts/playable-archive-v5-1-resource-premium.png`
- `design/concepts/playable-archive-v5-1-reading-premium.png`
- `design/concepts/playable-archive-v5-1-methods-premium.png`
- `design/concepts/playable-archive-v5-1-tool-premium.png`

正式截图位于 `docs/qa/screenshots/playable-archive-v5-1/`，覆盖首页、资源、完整阅读、方法、工具，以及 1024、768、390、320 宽度。

## 5. 经典桌游素材边界

首页继续使用四张已下载到站内的 Wikimedia Commons 摄影标本：Azul、Catan、Carcassonne、Ticket to Ride。每张图片的中文标题、摄影者和摄影许可直接出现在对应图注，320px 也不截断。

这些图片仍保持 `internal-only` 与 `publicUseAllowed=false`。摄影文件的开放许可不自动清除画面中商业桌游版图美术、产品外观和商标的二层权利风险。公开版本必须重新审查或替换为原创低风险视觉。

## 6. 验证证据

通过：

- `pnpm check`
- `pnpm visual:tokens`
- `pnpm qa:visual-tokens`
- `pnpm qa:classic-assets`
- `VITE_BUILD_ID=playable-archive-v5-1 pnpm build`
- `pnpm qa:visual-v5-1`

完整构建包含资源、权利、V2 信息架构、无障碍、按需加载、深链和工具交接门禁。最终 9 个浏览器状态无控制台错误、无横向溢出、均为唯一 H1，图片全部成功解码，320px 至 1504px 均有证据。

内置浏览器先被尝试，但首次服务器断开后停留在受限错误数据页，Browser Use URL 策略拒绝重新导航。本轮响应式与本地互动 QA 因此使用 Playwright Chromium 后备；原因和证据已写入保真度账本。

## 7. 已知边界

- 未完成 Safari/VoiceOver、Windows/NVDA 和真人键盘签收。
- 未由真实小学生、青少年和成年初学者验证“高级但不难懂”的感受。
- 生产构建仍提示主应用、完整资源目录和完整阅读集合中的既有大分片；当前功能与视觉不受影响。
- V5.1 是最后加载的兼容实施层。没有逐组件回归前，不要直接删除 `styles.css`、V4 或 V5 基础层。
- 公开发布图片权利硬门仍关闭。

## 8. 下一阶段建议

下一阶段不再增加新的视觉语法。建议只做两件事：

1. 用不同背景的真实学习者测试“首页选路 → 找到资料 → 站内阅读 → 使用一个就地工作单”，记录在哪里犹豫、误解或找不到返回路径。
2. 把样式兼容层清理和大分片优化拆成独立工程工作包，不能与内容扩张混在一起。

若真人测试没有指出结构性问题，V5.1 应作为后续内容页面的视觉基线。
