# Phase 1 原型范围与保真度交接

日期：2026-08-21  
状态：研究、内容、工具、静态守卫与构建完成；浏览器与真人任务待验

## 本轮完成

- 新增 8 条逐条审阅来源：桌游教师/设计师博客、原型目录、HCI 论文、MIT 教学材料、低保真重构单案例与商业流程反例。
- 新增 6 条可反驳 Claim、6 个规范术语和第 26 个任务型阅读入口；核心“最小原型”指南连接新证据与专用工具。
- 新增第 14 个正式工具“原型范围裁剪器”：验证问题、最多两个过滤维度、材料/分辨率/范围三维配置、代理边界、可玩切片、开工/重做门。
- 新增版本化本地草稿与快照、二次清空确认、独立 JSON；完整项目包新增 `prototype_scope_records`。
- 生成并保存完整桌面概念：[prototype-scope-cutter.png](../../design/concepts/prototype-scope-cutter.png)。

## 权威计数

- 527 resources / 527 assessments / 527 health snapshots；
- 26 resource entry points；
- 285 claims；
- 281 glossary terms；
- 5 frameworks / 6 core guides / 30 special guides；
- 22 design constraint cards / 50 local files；
- 14 formal tool artifact categories。

## 验证证据

- `pnpm qa:prototype-scope`：17/17 结构守卫。
- `pnpm check`：TypeScript 通过。
- `pnpm content:check`：全部内容外键、索引、一对一审阅与健康快照、贡献包 11 个发布守卫通过。
- `pnpm build`：Vite 8.2.1、36 modules；新工具 17.16 kB（gzip 5.81），主 JS 484.08 kB（gzip 147.94），CSS 61.03 kB（gzip 10.22），method 488.98 kB（gzip 161.60），resource 729.87 kB（gzip 192.79）。resource chunk 的 >500 kB 警告保留，不将构建体积冒充浏览器性能。
- `pnpm resources:health`：当前 shell 网络受限，527 条全部记录为 `error`、0 `dead`；没有自动删除或判定死链。

## 尚未完成

- Browser/IAB 仍受既有文件 URL 与本地端口策略阻塞；没有当前实现截图、1435×1096 概念对照、原生尺寸、焦点、下载、375px、触控或屏幕阅读器证据。
- 没有运行 4–6 人形成性任务；不能声称工具减少制作时间、提高设计质量或找到了最小内容量。
- Houde & Hill 原始 PDF 本轮页面解析失败，资源记录保持 `metadata_only`，不可升级为全文深读。

## 下一步建议

1. 在允许本地站点的浏览器环境运行 `pnpm qa`，补原型指南直达、五步状态、第三过滤项拒绝、保存/恢复/导出/清空和 375px 断言。
2. 用概念原生尺寸取得实现截图，至少核对标题/五步轨道、宽窄栏比例、宋体层级、蓝/红/细线、分段控件、移动堆叠，并更新视觉差异账本。
3. 按形成性协议测试纯规则、空间/触感和长局三个简报；优先观察“必须真实=更好”和“短片段=完整结论”两类误读。
4. 若真实测试显示五步切换增加遗忘，再评估跨步缺失摘要；不要先引入总分、进度百分比或推荐内容量。

