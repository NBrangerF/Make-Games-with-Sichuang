# Phase 1 本地项目护照交接

日期：2026-08-18  
状态：本工作包完成；长期 `/goal` 继续

## 为什么做这一包

当前网站已经有 164 条资源、六阶段指南、10 篇专题指南和 12 类记录工具，但首页“当前项目”仍是写死的海上贸易示例。各工具保存到不同浏览器键，用户无法确认它们是否共同推进同一个版本，也无法一次带走完整项目。

本轮把静态面板改为本地项目护照，形成“当前问题—下一步—工具证据—版本节点—完整导出”的连续闭环。

## 完成内容

- 新增项目名、体验意图、当前版本、阶段、当前问题与下一步编辑；
- 每次保存要求写本次版本变化，并新增一个不可混同于工具记录的版本节点；
- 项目阶段保存后同步首页阶段与指南；
- 测试计划自动继承当前项目版本，首次问题自动来自项目当前问题；
- 首页统计测试计划、反馈、改造、约束实验、平衡、决定轨迹、共享决定、主题复核、生产账本、发布路线、教学路径与无障碍观察共 12 类记录；
- 完整项目包一次导出项目、版本节点和全部工具记录；
- 明示首版只维护一个本地项目，旧工具记录没有 `project_id`，导出前需确认归属；
- 回归脚本新增项目编辑、版本继承、12 类记录汇总、完整导出、桌面与移动断言。

## 数据与边界

项目键：`tabletop-workshop-project-workspace-v1`。  
完整导出：`method = local-project-workspace-export`、`local_first = true`、`single_active_project = true`。

这不是多项目管理器。记录数不是进度、质量或成熟度。完整导出不包含纸面原型、规则文件、图片或外部链接内容，也不会上传或备份数据。未来增加多项目时必须先补 `project_id`/`version_id`，再让用户显式归档旧记录；不得按标题或日期猜归属。

## 文档

- [本地项目护照与完整导出](../product/PROJECT_WORKSPACE.md)
- [项目连续性可用性测试](../product/USABILITY_TEST_PROJECT_CONTINUITY.md)
- [内容与项目数据模型](../product/CONTENT_DATA_MODEL.md)
- [MVP 产品规格](../product/MVP_SPEC.md)
- [视觉与功能验收记录](../product/FIDELITY_LEDGER.md)

## 验证

通过：

- `node --check scripts/qa-site.cjs`
- `node --max-old-space-size=1024 node_modules/typescript/bin/tsc -b --pretty false`
- `node node_modules/vite/bin/vite.js build`
- 构建产物：CSS 46.01 kB（gzip 7.86 kB）；JS 721.08 kB（gzip 211.78 kB）

构建仍有主 JS 大于 500 kB 警告；项目连续性功能没有引入新网络依赖。

真实浏览器未通过且不能声明通过：

- `node scripts/qa-site.cjs` 在启动预览时失败；
- 明确错误为 `listen EPERM: operation not permitted 127.0.0.1:5175`；
- 直接用 Playwright/系统 Chrome 打开构建后的 `file://` 页面也在创建页面前 `SIGABRT`，清理进程返回 `kill EPERM`；没有继续加入不安全旁路参数；
- 因此没有本轮桌面/移动渲染截图，没有 `view_image` 双图检查，也没有真实下载、控制台、键盘或屏幕阅读器证据。

## 下一步建议

1. 在允许 localhost 的环境执行完整回归，检查项目面板阅读/编辑态、版本继承、12 类记录、完整下载与 375px 页面。
2. 按 [项目连续性测试](../product/USABILITY_TEST_PROJECT_CONTINUITY.md) 招募 5 名中文新手，重点观察是否混淆当前问题、下一步与版本变化。
3. 若真实测试证明单项目限制是高频阻断，再设计显式多项目与旧记录归档；不要先做自动迁移。
4. 将资源、审阅记录和方法页按路由或数据域拆包，处理 721 kB 主包。
5. 继续完成最初信息架构中尚未实现的“开始设计”和“我卡住了”独立入口，验证新手是否需要它们，而不是直接扩展顶栏。

长期目标尚未完成；本包只证明项目记录从静态示例升级为可保存、可带走的单项目闭环。
