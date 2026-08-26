# 资源网站 V2 导航减法与工具入流交接

日期：2026-08-22  
构建标识：`resource-v2-05`  
状态：完成；大项目继续执行

## 1. 本轮任务

用户要求：暂时隐藏“设计路径”，重命名并调整“中文知识”，把辅助工具与“找资料”的不同入口和单元结合起来。

实现原则：资源站仍是第一位。读者先选择学习、分析或具体问题；只有语境明确后，才看到能完成当前一步的工作单。

## 2. 已冻结的产品决定

1. 顶栏严格只有 `找资料 | 方法与概念`。
2. 新名称使用“方法与概念”，不使用“设计参考”。它能覆盖专题、理论框架和概念词表，也不与资源目录混淆。
3. `设计路径`、工具和资源阅读旧路由只是隐藏，不删除。
4. 方法页默认不是理论清单，而是三个任务入口；理论、词表和专题继续按需加载。
5. 工具不再拥有独立货架。一个语境最多出现两个工作单，且每个条目必须写清“为什么此刻用”。
6. 打开工具前先记录来源路由；包括 `test-plan` 这种以抽屉开始的工具，完成或关闭后也能回到正确来源。
7. 工具深链不点亮任何顶栏项。没有来源历史的直接深链使用“返回找资料”兜底。

## 3. 主要实现文件

- `src/App.tsx`
  - 两项顶栏
  - 方法页任务入口与三项详情标签
  - 隐藏旧入口但保留路由
  - 工具来源捕获、精确返回和独立货架移除
- `src/contextual-tools.tsx`
  - 四类语境映射
  - 统一“配套工作单 / 现在可以动手”开放列表
- `src/tool-catalog.ts`
  - 20 种工具标题与动作名的单一来源
- `src/tool-loaders.ts`
  - 语境工具的按意图预取；当前确保生产账本仍保持独立分片
- `src/complete-translation-page.tsx`
  - 完整正文末尾接入语境工作单
- `src/resource-v2-detail.tsx`
  - 学习方式与分析问题接入语境工作单
- `src/url-state.ts`
  - “方法与概念”标题与 `#method/frameworks` 规范地址
- `src/styles.css`
  - 两项桌面/移动导航
  - 方法页移动端纵向索引
  - 开放式语境工具列表
- `scripts/check-resource-v2.mjs`
  - 53 项结构与映射守卫
- `scripts/check-url-navigation.mjs`
  - 11 项可分享路由守卫
- `scripts/check-accessibility-contract.mjs`
  - 两项移动导航和局部滚动契约
- `scripts/check-method-section-loading.mjs`
  - 方法入口按意图预取、详情分片加载
- `scripts/qa-resource-v2.cjs`
  - `resource-v2-05` 桌面、移动、深链、工具往返和截图验收

## 4. 工具映射契约

| 映射 | 数量 | 展示位置 |
| --- | ---: | --- |
| `resourceEntryToolLinks` | 34 | 具体问题主题的三份起步资料之后 |
| `learningContentToolLinks` | 16 | 完整中文正文结束后、相邻阅读导航之前 |
| `analysisToolLinks` | 5 | 四步分析脚手架之后 |
| `learningEntryToolLinks` | 4 | 学习方式页；系统课程目录刻意为空，工具下沉到具体单元 |

静态守卫同时保证：

- 20 种 `GuideToolId` 均至少出现一次。
- 映射只引用已存在的工具 ID。
- 每个语境最多两个工作单。
- 34 个具体问题入口、16 个完整学习正文、5 个分析问题和 4 个学习方式键完全覆盖。
- 工具映射不会在资源首页、方法首页或全局工具货架提前出现。
- 鼠标悬停与键盘聚焦使用同一预取入口，不因移除全局工具标签而破坏分片加载契约。

这些映射是人工编辑判断，不是排名或自动推荐。当前没有逐条 `sourceGuideId` 字段；若以后生成或批量维护映射，应先补来源谱系而不是直接自动改表。

## 5. 路由兼容与返回行为

保留的旧地址：

- `#path`
- `#tools/<tool-id>`
- `#method/resource-reading/<item-id>`

返回标签按来源区分：

| 来源 | 返回标签 |
| --- | --- |
| 具体资料主题 | 返回这组资料 |
| 完整学习正文 | 返回学习内容 |
| 游戏分析问题 | 返回游戏分析 |
| 方法页 | 返回方法与概念 |
| 旧设计路径 | 返回设计路径 |
| 无来源的直接工具深链 | 返回找资料 |

工具页没有一级导航当前态，也不显示其他 19 个工具标签。

## 6. 浏览器验收路径

主闭环：

`#resources` → `#resources/problems` → `#resources/first-prototype` → 打开“原型范围裁剪器” → `#tools/prototype-scope` → “返回这组资料” → `#resources/first-prototype`

学习闭环：

`#resources/learn/systematic-unit-04-minimum-prototype` → 页面末尾一个“原型范围裁剪器” → `#tools/prototype-scope` → “返回学习内容” → 原单元

方法闭环：

`#method` → 三个任务入口 → “理解一种分析方法” → `#method/frameworks`

旧路由：直接刷新 `#path` 和 `#tools/core-loop` 均可恢复；两者都不产生错误顶栏当前态。

## 7. 最终验证

| 验证 | 结果 |
| --- | --- |
| `node --check scripts/qa-resource-v2.cjs` | 通过 |
| `pnpm qa:resource-v2` | 53 / 53 |
| `pnpm qa:a11y-contract` | 18 / 18 |
| `pnpm qa:method-sections` | 18 / 18 |
| `pnpm qa:url-navigation` | 11 / 11 |
| `pnpm qa:resource-learning-content` | 59 / 59 |
| `pnpm qa:main-boundaries` | 12 / 12 |
| `pnpm qa:method-deep-links` | 10 / 10 |
| `pnpm qa:concept-actions` | 12 / 12 |
| `pnpm check` | 通过 |
| `pnpm build` | 完整内容门通过；134 个模块；Vite 1 分 40 秒完成 |
| `QA_BASE_URL=http://127.0.0.1:8017/ pnpm qa:resource-v2:browser` | 通过，`errors: []` |
| 应用内浏览器控制台 | 0 warning / 0 error |
| 390 × 844 | 无横向溢出；两个导航目标均为 47px |
| 320 × 760 | 无横向溢出；品牌与内部状态不重叠 |

最终生产产物：主入口 JS 524.32 kB（gzip 160.44 kB）、资源全集分片 803.83 kB（gzip 213.92 kB）、生产账本独立分片 16.66 kB（gzip 5.80 kB）。构建只有既有的 500 kB 分片体积提示，没有失败。

## 8. 视觉证据与对照结论

- [接受的首页概念图](../../design/concepts/resource-v2-home-concept.png)
- [本轮桌面资源首页](../../design/qa/resource-v2-05-home-desktop.png)
- [本轮桌面方法入口](../../design/qa/resource-v2-05-method-desktop.png)
- [本轮桌面语境工具页](../../design/qa/resource-v2-05-contextual-tool-desktop.png)
- [本轮移动资源首页](../../design/qa/resource-v2-05-home-mobile.png)

保真点：纸张背景、宋体主标题、红色斜体编号、蓝色操作、细分隔线、无卡片首屏、移动端纵向完整阅读均保留。顶栏四项改两项、中文知识改名、工具从全局改为语境出现，是本轮有意的信息架构偏离。

## 9. 已知维护边界

- `scripts/qa-site.cjs` 仍是旧全站浏览器脚本，依赖可见“设计路径”；本轮不要用它替代 `qa:resource-v2:browser`，也不要声称它已适配新导航。
- 旧路由仍存在，所以本轮不涉及本地工具数据迁移或删除。
- iCloud 工作目录读取大分片可能需要 10–15 秒；浏览器 QA 等待真实内容出现，不用固定短等待判断失败。
- 全站大项目未完成。本交接只标记导航减法与工具入流阶段完成。

## 10. 下一原子工作包

内容包 04：完成系统单元 7、单元 8，以及第一份完整站内游戏分析。沿用当前入口，不新增顶栏、首页入口或独立工具入口；每份新正文末尾只配置一至两个确实能完成下一步的工作单，并同步补内容、路由、无障碍和浏览器守卫。
