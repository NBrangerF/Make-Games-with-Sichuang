# 主包与生产假设账本分片交接

日期：2026-08-21  
状态：implemented / production build verified / browser intent pending

## 完成内容

- 量化 `App.tsx` 中每个静态函数面，确认生产假设账本是最大的未拆工具，源函数约 14.5 kB。
- 将工具完整移入 `src/production-ledger-tool.tsx`，实现、安全边界、本地数据和导出格式不变。
- 主应用用 React lazy/Suspense 加载，工具按钮支持悬停和聚焦预取。
- 生产记录 storage key 改为共享导出，项目护照仍能汇总 `production_ledgers`。
- 浏览器 QA 增加独立 chunk 意图前/后断言；新增 12/12 主包边界守卫。

## 验证证据

- TypeScript：通过。
- `pnpm qa:main-boundaries`：12/12 通过。
- `node --check scripts/qa-site.cjs`：通过。
- Vite 生产构建：87 个模块转换，通过。
- 主 JS：506.47 → 490.54 kB，gzip 154.85 → 151.12 kB。
- 新生产账本 chunk：16.66 kB，gzip 5.80 kB。
- CSS：118.08 kB，gzip 17.89 kB，未变。

## 待验项

当前环境未能服务本地端口，所以没有实际点击“生产假设账本”重跑完整保存/导出、网络请求断言、焦点预取、加载公告、移动布局和项目包导出。既有浏览器回归覆盖这些功能，但更新后尚未执行；不声称端到端验收已完成。

详细决定、守卫和体积见[主包与工具加载边界](../product/MAIN_BUNDLE_BOUNDARIES.md)。
