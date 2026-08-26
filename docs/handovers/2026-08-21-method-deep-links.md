# 2026-08-21 方法分区与条目深链交接

## 结果

方法页的四个分区和当前 898 个条目都可以刷新、收藏和分享。具体范围是 5 个理论框架、32 篇专题指南、287 个概念与 574 份资源审阅。搜索和筛选继续是会话状态。

## 实现

- `src/url-state.ts`：新增 `MethodSection`、`methodSection`、`methodItem`，解析/序列化四类方法地址，并更新页面标题。
- `src/App.tsx`：方法标签和四个工作台改为 URL 受控选择；共用 `useCanonicalMethodItem` 处理无效 ID；搜索过滤造成的条目替换使用 `replaceState`。
- `scripts/check-url-navigation.mjs`：扩展为 10 组路由守卫。
- `scripts/check-method-deep-links.mjs`：10 组专项守卫，遍历 898 个权威 ID，已进入 `content:check`。
- `scripts/qa-site.cjs`：记录框架、概念、资源审阅和专题 URL，并复测专题刷新选中态。

## 验证

- `pnpm qa:method-deep-links`：10/10。
- `pnpm qa:url-navigation`：10/10。
- `pnpm qa:method-sections`：18/18。
- `pnpm content:check`：完整通过；其中无障碍 18/18、资源分片 23/23、主包边界 12/12、指南—资源交接 9/9。
- TypeScript：应用配置在独立 640 MB 进程通过；与其他命令串联时曾被系统以 137 回收，无 TypeScript 诊断。
- `node --check scripts/qa-site.cjs`：通过。
- `pnpm exec vite build`：通过，88 个模块；主 JS 493.25 kB（gzip 151.94），框架 6.51 kB，专题 245.80 kB，词表 257.44 kB，完整资源目录 803.83 kB。

## 视觉与运行边界

这是已有设计系统内的功能状态修复：不增加新可见控件，不改标签、索引、详情或移动轨道的样式，因此没有生成新概念图。最终浏览器断言已写入脚本，但本地端口 `EPERM` / Chrome `SIGABRT` 使它们未实跑；没有新截图或 `view_image` 签收。

## 下一步

1. 在可运行真浏览器的环境执行 `pnpm qa`，重点看直达 chunk、后退/前进、搜索替换与 375px 横向轨道。
2. 使用 `docs/product/USABILITY_TEST_METHOD_DEEP_LINKS.md` 执行 M1–M5，每项先用 3 名新手找阻断。
3. 下一个本地可自主工作包应审计站内“概念 → 对应专题/工具”回链是否只显示文本而无法直达，而不再扩展资源数量。
