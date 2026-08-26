# Phase 1 资源库按需加载交接

日期：2026-08-18  
状态：`implemented / browser verification pending`  
前置交接：`2026-08-18-design-aid-practice-loop.md`

## 本轮目标

随着资源库增长到 204 条，避免只看“设计路径”的新手也下载全部资源摘要、逐条审阅、八个入口和九维量表；同时不能删除内容、压缩证据边界或让来源链接失效。

## 产出

1. 新增 [资源库按需加载与轻量来源索引](../product/RESOURCE_LAZY_LOADING.md)，记录加载边界、维护协议、前后产物和未完成门。
2. 新增 `scripts/generate-resource-index.mjs` 与 `pnpm resources:index`，从权威 `resources.json` 生成只含 `id/title/href` 的 `resource-index.json`。
3. 内容校验器逐条验证索引长度、顺序、值和字段范围；过期索引会直接阻断构建。
4. 新增 `src/resource-catalog.ts` 和 `src/resource-loader.ts`：完整目录动态导入、Promise 去重、失败后允许重试。
5. 主导航和“资源怎么读”标签在鼠标悬停或键盘聚焦时预取；进入页面时提供加载、错误和重试状态。
6. 资源长列表使用 `content-visibility: auto` 与固有高度估算，减少屏幕外布局和绘制。
7. QA 契约新增访问意图前后 `resource-catalog` 请求断言，并等待动态目录可用后再执行原有 204 条筛选检查。

## 架构决定

### 轻量来源索引不是第二套内容

核心指南、框架和词表只需要标题与链接。索引必须机械生成并逐条校验，禁止手工添加摘要、评价或独立排序；完整资源表仍是唯一权威来源。

### 预取由用户意图触发

不在首屏 `useEffect` 自动预取，否则只是换了一个 chunk 名称却没有减少初始下载。鼠标悬停与键盘聚焦使用同一入口；用户直接点击时动态导入立即开始。

### 加载失败不是空资源库

网络或 chunk 加载失败会显示明确错误、说明不影响本地项目数据，并允许重新加载。失败 Promise 会清空，重试不会复用永久拒绝状态。

### 不用删内容解决性能

全部 204 条资源、204 份审阅、8 个入口与 9 维量表仍可使用。性能优化改变传输和渲染时机，不改变证据、筛选或阅读深度。

## 构建变化

| 文件 | 拆分前 | 拆分后 |
|---|---:|---:|
| 主 JS | 798.86 kB / gzip 234.25 kB | 554.34 kB / gzip 172.14 kB |
| 条件资源 JS | — | 280.75 kB / gzip 75.50 kB |
| CSS | 48.55 kB / gzip 8.23 kB | 48.74 kB / gzip 8.30 kB |

首屏主 JS 原始大小减少 244.52 kB（30.6%），gzip 减少 62.11 kB（26.5%）。主包仍有大于 500 kB 警告。

## 验证

- `pnpm resources:index`：生成 204 条轻量引用；
- `pnpm content:check`：通过，含索引逐条一致性检查；
- `node --check scripts/qa-site.cjs`：通过；
- `pnpm check`：独立重跑通过；首次运行被系统以 137 终止且无类型诊断输出；
- `pnpm build`：通过，输出独立 `resource-catalog` chunk；
- 构建产物文本检查：只存在于完整资源摘要的句子仅命中 `resource-catalog` chunk；
- `pnpm qa`：preview 因 `listen EPERM: operation not permitted 127.0.0.1:5175` 失败，未进入浏览器断言。

## 限制与下一步

- 真实浏览器尚未验证预取时序、加载状态、失败重试、焦点保持和 204 条长列表滚动。
- `content-visibility` 需要 Chrome、Safari、Firefox 与屏幕阅读器人工检查；不支持时应优雅退化为完整渲染。
- 主包仍为 554.34 kB。下一性能工作包应拆分十二项工具及其表单数据，并在工具导航意图时预取；不要提高警告阈值。
- 若后续新增资源，先运行 `pnpm resources:index`，再运行内容和健康检查。

