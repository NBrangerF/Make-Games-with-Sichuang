# 方法内容深链契约

状态：implemented / static-and-build-verified / browser-pending  
日期：2026-08-21

## 问题

方法页已经把理论框架、专题指南、概念词表和资源审阅拆成四个意图加载边界，但分区和条目选择只存在于 React 本地状态。读者无法把某一篇专题、某一个概念或某一份资源审阅发给同伴；刷新也会回到第一张框架。

本契约让方法“目的地”可分享，不把搜索词、阶段筛选或阅读进度放入 URL。

## 规范地址

| 目的地 | URL | 当前条目数 |
| --- | --- | ---: |
| 默认理论框架 | `#method` | 5 |
| 指定理论框架 | `#method/frameworks/<id>` | 5 |
| 专题指南 | `#method/guides/<id>` | 32 |
| 概念词条 | `#method/glossary/<id>` | 287 |
| 资源阅读说明 | `#method/resource-reading/<id>` | 574 |

`#method/frameworks` 会规范化为更短的 `#method`。未知分区回到 `#method`；已知分区中的未知条目在数据加载后回到该分区第一项，并用 `replaceState` 改写地址。

## 状态与历史

- 切换方法标签会写入对应分区地址，并清除上一分区的条目 ID。
- 选择框架、专题、概念或资源审阅会使用 `pushState`，支持后退/前进。
- 搜索或阶段筛选让当前条目不再可见时，页面选择当前结果的第一项，并用 `replaceState` 同步 URL，不为输入的每个字符制造历史节点。
- 搜索词、阶段筛选、滚动位置和外部阅读进度不进入 URL。
- URL 不包含项目、工具草稿或参与者数据。

## 按需加载边界

深链只改变“进入哪个方法分区”，不合并数据 chunk：

- `#method` 只消费 6.51 kB 框架 chunk；
- 专题深链才加载 245.80 kB 专题 chunk；
- 概念深链才加载 257.44 kB 词表 chunk；
- 资源审阅深链是明确的全量阅读意图，因此才加载 803.83 kB 完整资源目录。

本轮生产构建主 JS 为 493.25 kB（gzip 151.94），仍低于 500 kB 默认警告线。

## 可访问性与视觉边界

标签和索引仍使用原有按钮、`aria-pressed`、蓝色选中线和横向移动轨道；没有增加分享图标、卡片、标签或新布局。这是已接受设计系统中的状态修复，不需要新的 ImageGen 概念。

## 验证

- `pnpm qa:method-deep-links`：10/10，逐项检查 898 个权威 ID、URL 往返、回退、受控选择、搜索替换和浏览器覆盖。
- `pnpm qa:url-navigation`：10/10。
- `pnpm qa:method-sections`：18/18，方法分片不回退。
- `pnpm content:check`：完整通过。
- TypeScript 应用配置：独立低内存进程通过。
- `pnpm exec vite build`：通过，88 个模块。

`scripts/qa-site.cjs` 已增加框架、概念、资源审阅和专题地址，以及专题刷新保持断言。由于当前端口 `EPERM` / Chrome `SIGABRT` 阻塞，该脚本未在本轮真浏览器执行；不得据此声称刷新、后退、键盘或移动端已签收。

## 后续：概念与行动的双向交接

同日增量让指南末尾的概念标签进入 `#method/glossary/<concept-id>`，概念详情再进入真实引用它的 `#method/guides/<guide-id>` 与 `#tools/<tool-id>`。这些链接复用本契约，不新增路由格式；浏览历史应能返回原概念。关系推导与非推荐边界见[概念—专题—工具双向交接](CONCEPT_ACTION_HANDOFF.md)。该增量后的词表分片为 309.01 kB（gzip 80.04），主 JS 为 494.94 kB（gzip 152.43）。
