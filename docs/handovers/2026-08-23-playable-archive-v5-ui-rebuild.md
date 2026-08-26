# 2026-08-23 Playable Archive V5 全站视觉重构交接

状态：正式站点已迁移，生产构建与浏览器回归完成  
构建标识：`playable-archive-v5`  
产品品牌：桌游设计工坊  
设计系统：可玩的桌游档案馆 Playable Tabletop Archive 4.0

最终本地预览：`http://127.0.0.1:8017/?build=playable-archive-v5#resources`

## 1. 本阶段结果

本轮解决 V4 “清楚但平淡”的问题，把经典现代桌游摄影标本和可迁移的视觉语法真正带入站点。信息架构、中文内容、574 条资源、34 个入口、方法深链、工具本地数据与资源优先次序保持不变。

新视觉不依赖通用卡片墙。它使用四种不同的页面对象：

- 首页：展览桌。
- 资源索引：资料抽屉。
- 完整阅读：规则册。
- 方法与工具：分析板与实验板。

视觉强度来自超大中文黑体、深墨稳定外框、暖纸底、四个记忆色、硬边界、硬阴影、剪角板件和有来源的经典桌游照片，不是新增导航、筛选器或助手功能。

## 2. 正式设计文档

| 文件 | 作用 |
| --- | --- |
| `docs/product/TABLETOP_VISUAL_DESIGN_MANUAL_V4.md` | 实施权威；页面角色、三旋钮、色板、排版、组件、响应式、动效、无障碍与禁止项 |
| `docs/product/tabletop-visual-tokens-v4.json` | V5 色彩、字体、间距、边界、阴影、布局和素材政策数值真源 |
| `docs/product/VISUAL_ASSET_REGISTER_V4.md` | 四张构建照片和五张概念图的来源、许可、哈希、改动与风险 |
| `docs/product/OPEN_TABLE_V5_VISUAL_REVIEW_2026-08-23.md` | V4 平淡原因和 V5 页面调节判断 |
| `docs/research/CLASSIC_BOARD_GAME_WEB_ASSET_AUDIT_V5_2026-08-23.md` | 经典桌游网络素材与二层权利审计 |
| `docs/qa/PLAYABLE_ARCHIVE_V5_FIDELITY_LEDGER_2026-08-23.md` | 概念图到最终浏览器截图的差异、修正与证据 |

## 3. 实现文件

| 文件 | 作用 |
| --- | --- |
| `src/styles-v5.css` | V4 之后加载的全站 Playable Archive 视觉实施层 |
| `src/classic-visual-assets.ts` | 四张正式摄影标本的类型、路径、中文 alt、许可与使用范围 |
| `src/classic-visual-board.tsx` | 首页 2×2/移动横向标本板 |
| `src/resource-start-v2.tsx` | 用 `ClassicVisualBoard` 替换 V4 原创单图 |
| `src/main.tsx` | 在令牌、基础与 V4 之后加载 V5 实施层 |
| `src/complete-translation-page.tsx` | 为章节定位尊重 reduced-motion |
| `scripts/generate-visual-tokens.mjs` | 改为从 V4 JSON 生成运行时 CSS，并输出新语义变量 |
| `content/visual-assets/classic-board-game-assets.json` | 来源、哈希、许可、被摄作品风险和内部使用范围的机器可读清单 |
| `scripts/check-classic-visual-assets.mjs` | 检查文件、SHA-256、许可字段、运行时引用与公开发布阻断 |
| `scripts/capture-playable-archive-v5.mjs` | 固定视口截图、图片解码、溢出/H1/日志和核心互动验证 |

## 4. 经典桌游素材

正式首页使用下列本地 WebP：

| 视觉语法 | 摄影来源 | 许可 | 当前范围 |
| --- | --- | --- | --- |
| 六角地形与道路 | `Partida Catan.jpg`，Pepenic1 | CC0 1.0 | 内部学习 |
| 花砖阵列与方格 | `A four-player game of the board game Azul.jpg`，Gábor Zehetmayer | CC0 1.0 | 内部学习 |
| 路线网络 | `Ticket to Ride (16298587785).jpg`，Billie Grace Ward | CC BY 2.0 | 内部学习，必须署名 |
| 拼接版图 | `Carcassone jogo-game.jpg`，L’Éclipse | CC BY 4.0 | 内部学习，必须署名 |

每张照片的摄影许可明确，但画面仍包含商业桌游版图、产品美术或商标。因此当前构建全部记为 `internal-only`，`publicUseAllowed=false`。“不公开、不盈利”是产品范围，不是自动获得第三方美术授权的根据。

## 5. 跨年龄减法合同

- 可见一级导航仍只有“找资料 / 方法与概念”。
- 首页仍只有学习、分析、按问题找资料三个主入口。
- 标本照片是领域识别与视觉语法，不是可点击的第四组入口。
- 完整中文继续站内阅读；外部链接不替代正文。
- 工具继续贴着已选资料、单元或方法出现，不恢复独立货架。
- 不建立小学生模式与成人模式；使用明确动词、结果文案、形状、颜色和层次支持不同背景。

## 6. 自动与浏览器证据

通过：

- `pnpm check`
- `pnpm visual:tokens`
- `pnpm qa:visual-tokens`
- `pnpm qa:classic-assets`
- `pnpm qa:resource-v2` 53/53
- `pnpm qa:a11y-contract` 18/18
- `pnpm qa:url-navigation` 11/11
- `pnpm qa:method-deep-links` 10/10
- `pnpm qa:main-boundaries` 12/12
- `VITE_BUILD_ID=playable-archive-v5 pnpm build`，包含全部内容门

浏览器证据：

- IAB 首页 DOM、实际截图、四张图片固有尺寸、首页学习入口点击与最终 error 日志均已检查。
- 响应式使用 Chromium 后备截图：320、390、768、1024、1440 与概念原尺寸 1504×1046。
- 10 个状态均无根级横向溢出，唯一 H1，图片 0 失败，控制台 0 错误。
- 核心互动：首页学习入口、Kathleen 资料搜索、5PM 框架切换、原型范围步骤切换。

生产构建继续提示三个较大的既有懒加载数据分片：主应用、完整资源目录和完整阅读集合。它们是后续性能计划，不是本轮视觉失败。

## 7. 已知边界

- 未完成 Safari/VoiceOver、Windows/NVDA 和真人键盘签收。
- 未用真实小学生、青少年和成人初学者验证新视觉是否不幼稚且易扫描。
- 现有 `styles.css` 与 V4 仍是兼容基础；V5 是最后加载的实施层，不应在没有逐组件回归时删除旧层。
- 公开发布硬门仍关闭：四张现代桌游照片需要重新审查被摄作品和商标。

## 8. 下一阶段

下一阶段不应继续加视觉元素。建议顺序：

1. 完成一轮跨背景真人任务测试，聚焦“首页选一条路→找到一份资料→站内阅读→带回一个工作单”。
2. 只根据真实观察删减说明、改行长或调整就近脚手架，不增加首页入口。
3. 对公开版执行独立权利审查，或用原创低风险图形替换商业桌游照片。
4. 将巨大既有数据分片优化与内容继续扩张分开成独立工作包。

