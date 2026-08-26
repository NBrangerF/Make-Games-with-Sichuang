# Playable Archive V5 视觉保真度账本

日期：2026-08-23  
状态：生产构建、浏览器验证与概念图对照完成  
构建标识：`playable-archive-v5`  
预览：`http://127.0.0.1:8017/?build=playable-archive-v5#resources`

## 1. 验收对象

接受的方向不是某一张网页皮肤，而是五个页面角色概念：

- `design/concepts/playable-archive-v5-home.png`
- `design/concepts/playable-archive-v5-resource-library.png`
- `design/concepts/playable-archive-v5-reading.png`
- `design/concepts/playable-archive-v5-methods.png`
- `design/concepts/playable-archive-v5-tool.png`

概念图的信息架构和示例文案不是需求真源。正式实现以现有中文内容、路由、资源优先和设计手册 V4 为上位合同。

## 2. 截图方法

1. 首先用 Codex 内置浏览器打开正式本地构建，读取 DOM、查看首屏、验证图片固有尺寸并点击“开始学习桌游设计”。路由正确到达 `#resources/learn`。
2. 内置浏览器当前不暴露可编程视口缩放能力，因此响应式截图使用本地 Playwright Chromium 作后备。理由是 IAB 无法稳定设置 320–1504px 视口，不是替代首先的真实浏览器检查。
3. 原生概念图尺寸 `1504×1046` 已被用作首页截图视口，不进行缩放对照。
4. 最终实现截图与接受概念图在同一次 QA 中通过 `view_image` 以原尺寸查看。

截图与数据：

- `docs/qa/screenshots/playable-archive-v5/home-native-1504x1046.png`
- `docs/qa/screenshots/playable-archive-v5/home-desktop-1440x1024.png`
- `docs/qa/screenshots/playable-archive-v5/home-laptop-1024x768.png`
- `docs/qa/screenshots/playable-archive-v5/home-tablet-768x900.png`
- `docs/qa/screenshots/playable-archive-v5/home-mobile-390x844.png`
- `docs/qa/screenshots/playable-archive-v5/home-mobile-320x800.png`
- `docs/qa/screenshots/playable-archive-v5/resource-library-1440x1024.png`
- `docs/qa/screenshots/playable-archive-v5/reading-1440x1024.png`
- `docs/qa/screenshots/playable-archive-v5/methods-1440x1024.png`
- `docs/qa/screenshots/playable-archive-v5/tool-1440x1024.png`
- `docs/qa/playable-archive-v5-browser-metrics.json`
- `scripts/capture-playable-archive-v5.mjs`

## 3. 保真度对照

| 对照点 | 概念证据 | 实现证据 | 结果 |
| --- | --- | --- | --- |
| 首屏构图 | 左侧超大标题与三条行动板，右侧四幅摄影标本 | `home-native-1504x1046.png` 保留同样的双栏重心、三个主入口和 2×2 标本板 | 保真 |
| 文字层级 | 深墨黑体 Display、小尺寸说明与独立标签 | 首页 H1 使用粗黑中文 UI 字体，选项标题、结果和编号有明确比例差 | 保真；未复制概念图的做旧字形 |
| 色板 | 深墨顶栏、暖纸底、钴蓝/番茄红/藏红黄/叶绿 | 所有正式色值来自 `tabletop-visual-tokens-v4.json`，未使用装饰渐变 | 保真 |
| 图片处理 | 四张照片各自有边界、胶带、彩色脊和标签 | 四个 `figure` 使用本地 WebP、中文 alt、独立署名和硬阴影，文字不叠在照片上 | 保真 |
| 资源库角色 | 阶段轨道、当前问题和连续资料抽屉 | 正式站保留“阶段→当前问题→资料”的两次决定，资料行使用彩色脊与连续边界 | 语义保真；首屏不跳过问题直接铺满资料 |
| 长文阅读角色 | 左侧章节轨、安静正文、少量高强调板件 | 阅读页使用窄章节轨、720–760px 正文、编号 H2 与就地来源记录 | 保真 |
| 方法页角色 | 窄索引向单一分析板供给内容 | 五个框架使用左索引和右工作面，适合/不适合/准备/步骤/产出保持在一个板内 | 保真 |
| 工具页角色 | 五步输入与当前建议并置 | 原型范围裁剪器使用纵向步骤、工作区、持续摘要与本地保存状态 | 保真；保留标准 HTML 控件 |
| 响应式 | 概念图为桌面视图 | 960px 以下改为单栏，720px 以下标本板改为横向可滑动带；320/390/768/1024/1440 无根级溢出 | 原创的响应续写 |
| 动效与状态 | 板件可拿取，选中状态明显 | 悬停仅 3–5px 位移与硬阴影；`prefers-reduced-motion` 取消位移；选中不只依赖颜色 | 保真 |

## 4. 首屏文案差异

正式实现保留已经冻结的产品文案：

- `桌游设计学习资源站`
- `从学习、分析或正在解决的问题开始。核心内容可直接在站内阅读中文版本。`
- `开始学习桌游设计`
- `从设计师角度分析一款游戏`
- `按正在解决的设计问题找资料`
- `搜索全部资料`

概念图中底部“为不同学习阶段提供结构化支持”的四项模块没有进入正式首屏。这是有意减法：它会在用户选择三个入口之前新增第二层分类，与“一次只做一个主决定”冲突。

## 5. 这次修正的实质差异

1. V4 在 960px 以下隐藏首页主视觉。V5 显式恢复，并把它缩为不压过任务的横向标本带。
2. 320px 首轮截图时，异步图片在完成解码前留下空白标本。正式组件改为四张首屏标本均立即加载，QA 也等待 `img.decode()` 后取图。最终 320px 截图无空白标本。
3. 方法索引选中时，编号和次级说明曾继承红色/深灰文字，在蓝底上对比不足。最终选中项的编号、标题、说明和箭头统一为浅色。
4. 工具左侧选中步骤的 `01` 曾与蓝底融在一起。最终编号和圆形边界为白色，不再只靠板件背景识别当前步骤。

## 6. 有意差异

- 未复制概念图中的虚线路线、细小装饰图标和大量做旧纹理。这些图形不提供新信息，会增加年幼读者的竞争线索。
- 资源库概念图在首屏直接显示多份资料；正式产品继续先问设计阶段和当前问题。这是产品逻辑，不是视觉缺失。
- 完整阅读只在已有上下文工作单时出现右侧行动；不为了对称而虚构一个工具。
- 概念图中的图标不进入 UI；正式站使用标准 HTML 控件、文字标签和原创 CSS 品牌记号。

## 7. 最终证据

- 10 个页面/视口状态均为唯一 H1、无根级横向溢出、无图片失败、无控制台错误。
- 响应式宽度：320、390、768、1024、1440；另以 1504×1046 对照概念原尺寸。
- 互动证据：首页进入 `#resources/learn`；“Kathleen”搜索返回 3 份中文导读；框架索引含 5 项并可选中 `5PM`；原型工具含 5 个步骤且选中状态唯一。
- 内置浏览器最终控制台 error 日志为空，正式预览标签已标记为交付结果。

## 8. 结论

最终实现已经按接受的设计方向忠实验证。没有遗留会改变品牌、首屏决定、页面角色或核心互动的实质性不匹配。上述差异均是为了保留资源优先、不虚构功能和跨年龄可理解性的有意决定。

