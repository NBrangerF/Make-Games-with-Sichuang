# 2026-08-21 概念—专题—工具双向交接

## 本轮完成

- 新增由权威字段生成的 `content/concept-action-index.json`；
- 287 个概念全部接入至少一项可分享正式工具；
- 276 个概念接入实际引用它们的专题，共 382 条专题关系；
- 形成 962 条去重工具关系，每个概念 1–6 项；
- 概念详情可打开专题和工具；核心/专题指南末尾可返回规范概念深链；
- 所有站内交接使用真实 `href`，应用内点击写入历史；
- 行动索引保留在词表动态分片，点击专题时才加载长指南包；
- 新增 12 项专项关系守卫与 C1–C5 新手任务。

## 关键文件

- 数据：`content/concept-action-index.json`
- 生成器：`scripts/generate-concept-action-index.mjs`
- 关系守卫：`scripts/check-concept-action-handoff.mjs`
- UI：`src/App.tsx`、`src/styles.css`
- 类型/加载：`src/data.ts`、`src/glossary-catalog.ts`、`src/method-loader.ts`
- 产品契约：`docs/product/CONCEPT_ACTION_HANDOFF.md`
- 真人任务：`docs/product/USABILITY_TEST_CONCEPT_ACTION_HANDOFF.md`

## 已执行验证

- `node scripts/generate-concept-action-index.mjs --check`：通过；
- `pnpm qa:concept-actions`：12/12；
- `pnpm qa:method-sections`：18/18；
- `pnpm qa:method-deep-links`：10/10；
- `node --check scripts/qa-site.cjs`：通过；
- 独立 TypeScript 应用检查：通过。
- `pnpm content:check`：完整通过；
- `pnpm exec vite build`：89 个模块，2 分 13 秒，通过。

最终构建：CSS 119.14 kB（gzip 18.05）；词表＋行动索引分片 309.01 kB（gzip 80.04）；专题指南分片 245.80 kB（gzip 93.37）；主 JS 494.94 kB（gzip 152.43）。主包保持在 500 kB 以下；803.83 kB 的完整资源目录只在用户明确升级到全目录/资源审阅时加载，并继续触发预期警告。

串行检查末尾曾因环境资源限制以 exit 137 终止 TypeScript；相同检查在独立、640 MB 进程中通过且没有诊断。

## 未通过声明

当前环境没有完成真实浏览器运行。`pnpm preview --host 127.0.0.1 --port 5175` 进入命令后 60 秒仍未绑定端口，`curl` 不可达，进程随后安全终止；Playwright MCP 导航又返回 `Extension connection timeout`，要求安装/连接 Bridge。产品没有被浏览器加载。因此以下均为待验：概念→专题→后退、概念→工具、指南→概念、复制链接、键盘焦点、1440px/375px 排版、目标分片请求时序与控制台。浏览器脚本中的断言只是待执行规范。

本轮没有新增视觉方向。它按 `frontend-app-builder` 的“小型既有设计系统扩展”路径复用现有开放工作纸、细分隔线、文本链接、箭头、宋体标题、钴蓝动作与砖红阶段标记；没有使用 ImageGen，也没有以旧截图冒充最新验收。

## 下一安全工作包

若浏览器环境仍不可用，可继续审计“资源审阅 → 概念/专题/工具”的行动交接，优先从 34 个策展入口和逐条审阅已有字段推导，不建立主观总分。若浏览器可用，应先执行 C1–C5 之前的自动浏览器链路并补桌面/375px 截图。
