# 2026-08-21 核心指南到精选资源交接

## 本轮结果

新手从六阶段核心指南中可以直接进入与当前任务对应的精选阅读入口。资源入口现在是正式 URL 状态，可刷新、复制、分享和用浏览器历史恢复。

## 实现范围

- `src/guide-resource-handoff.ts`：六阶段到已有阅读入口的唯一映射。
- `src/url-state.ts`：新增 `#resources/<entry-id>` 解析与序列化。
- `src/resource-entry-loader.ts` 与 `src/resource-entry-runtime.ts`：深链初次直接加载目标入口包，未知 ID 回退默认入口。
- `src/App.tsx`：核心指南新增真实链接、预取和路由化入口选择；无效地址用 `replaceState` 恢复。
- `scripts/check-guide-resource-handoff.mjs`：9 组专项守卫，已加入 `content:check`。
- `scripts/check-url-navigation.mjs`：扩展为 9 组路由守卫。
- `scripts/qa-site.cjs`：增加指南点击、目标入口和刷新保持断言；同步核心指南来源链接计数。

## 验证证据

- `pnpm qa:guide-resource-handoff`：9/9 通过。
- `pnpm qa:url-navigation`：9/9 通过。
- `node --check scripts/qa-site.cjs`：通过。
- `pnpm content:check`：完整通过；包含资源 23/23、主包 12/12、无障碍 18/18 和新增交接 9/9。
- TypeScript：首次并合 `pnpm check` 在无诊断前被系统以 137 回收；随后将 `tsconfig.app.json` 与 `tsconfig.node.json` 分成低内存进程后均通过，最终 App 修订也再次单独通过。这是“分步类型检查通过”，不伪写为最后一次 `pnpm check` 命令通过。
- `pnpm exec vite build`：最终生产构建通过，88 个模块；主 JS 491.82 kB（gzip 151.52），入口 runtime 6.83 kB（gzip 1.56），六个交接目标仍是 10.93–11.57 kB 独立 chunk，完整资源目录仍为显式意图后的 803.83 kB chunk。
- 真浏览器脚本未在本轮执行；现有端口 `EPERM` / Chrome `SIGABRT` 阻塞仍然适用。

## 产品与研究边界

这次修订是现有设计系统内的小型功能交接：复用指南来源样式，没有为一条链接创建新视觉概念或图像。六个映射是任务适配而不是资源排名；它们不证明资源有学习效果。

## 下一个安全步骤

1. 在可启动真实浏览器的环境运行 `pnpm qa`，确认深链首次请求只命中目标入口包。
2. 用 `docs/product/USABILITY_TEST_GUIDE_RESOURCE_HANDOFF.md` 对 3–5 名新手做 H1–H4 形成性测试。
3. 若参与者把“精选”误读为排名，先修订交接文案和证据边界可见性，不更改资源顺序来迁就误读。
