# 资源网站 V2 内容包 02 交接

日期：2026-08-22  
交接状态：内容、接入、权利记录、构建与浏览器 QA 完成  
当前预览：`http://127.0.0.1:8017/?build=resource-v2-03#resources`

## 1. 继续前先记住的产品决定

- 这是中文桌面游戏设计资源站，资源整理和站内阅读优先于工具数量。
- 默认资源首页固定为三个主入口；搜索全部资料是次级入口。
- 不按年龄给读者贴标签。小学生到成年人共享同一入口，通过例子、分段、短任务和“仍不知道”获得脚手架。
- 内容按设计阶段与同阶段的不同 approach 组织，但首页不展示完整分类体系。
- 课程、开放许可来源译文、设计师案例综合是三种不同内容，不得混成一个长排名。
- 无可核验翻译/再发布依据的博客只做原创案例综合；开放许可全文译文必须单独登记许可、改动与版本。
- Codex AI 译文不再等待人工双语复核才能作为内部主版，但不得冒充人工翻译、法律审定或公开发布版本。

## 2. 当前可用基线

| 类型 | 数量 | 内容 |
| --- | ---: | --- |
| `original_complete` | 5 | 系统单元 0–4 |
| `authorized_full_translation` | 3 | GDC 第 1、2 关；规则书无障碍论文 |
| `original_case_synthesis` | 5 | Monsoon、Dune、Quid、Paul Grogan、New Bedford |
| `authoritativeItems` | 13 | 以上三类显式白名单总数 |

UI 计数：首页 3、学习方式 4、系统路线 9、当前完整系统单元 5、完整来源译文 3、设计师案例 5。

## 3. 本轮主要文件

### 新系统单元

- `content/learning-units/systematic-unit-03-mechanisms-information-interaction-zh-CN.md`
- `content/learning-units/systematic-unit-03-mechanisms-information-interaction-zh-CN.metadata.json`
- `content/learning-units/systematic-unit-04-minimum-prototype-zh-CN.md`
- `content/learning-units/systematic-unit-04-minimum-prototype-zh-CN.metadata.json`

### 开放许可全文译文

- `content/translations/what-makes-a-rulebook-accessible-and-entertaining-zh-CN.md`
- `content/translations/what-makes-a-rulebook-accessible-and-entertaining-zh-CN.metadata.json`
- `docs/research/RULEBOOK_ACCESSIBILITY_TRANSLATION_AUDIT_2026-08-22.md`

### 第二批案例

- `content/guides/paul-grogan-rulebook-layout-case-synthesis-zh-CN-internal.md`
- `content/guides/paul-grogan-rulebook-layout-case-synthesis-zh-CN-internal.metadata.json`
- `docs/research/SOURCE_VERIFICATION_PAUL_GROGAN_RULEBOOK_LAYOUT_SYNTHESIS.md`
- `content/guides/new-bedford-manufacturing-constraint-case-synthesis-zh-CN-internal.md`
- `content/guides/new-bedford-manufacturing-constraint-case-synthesis-zh-CN-internal.metadata.json`
- `docs/research/SOURCE_VERIFICATION_NEW_BEDFORD_MANUFACTURING_SYNTHESIS.md`
- `docs/research/DESIGNER_CASES_BATCH_02.md`

### 接入与守卫

- `content/resource-learning-content.json`
- `src/learning-content-route.ts`
- `src/complete-translation-page.tsx`
- `src/resource-v2-detail.tsx`
- `scripts/check-resource-learning-content.mjs`
- `scripts/check-resource-v2.mjs`
- `scripts/qa-resource-v2.cjs`

## 4. 稳定路由

| 内容 | Hash |
| --- | --- |
| 系统性学习 | `#resources/learn/systematic` |
| 单元 3 | `#resources/learn/systematic-unit-03-mechanisms-information-interaction` |
| 单元 4 | `#resources/learn/systematic-unit-04-minimum-prototype` |
| 规则书无障碍论文 | `#resources/learn/what-makes-a-rulebook-accessible-and-entertaining` |
| Paul Grogan 案例 | `#resources/learn/designer-case-paul-grogan-rulebook-layout` |
| New Bedford 案例 | `#resources/learn/designer-case-new-bedford-manufacturing-constraint` |

刷新恢复依赖懒加载内容。浏览器回归在 `page.reload()` 之后必须等待目标精确 H1，再读取 hash、表格或正文计数；不能在 `domcontentloaded` 后立即用 `isVisible()` 判断。

## 5. 权利与内容边界

### 规则书论文

- 规范来源：京都大学学术信息库 `https://repository.kulib.kyoto-u.ac.jp/handle/2433/298016`
- 许可证据：CC BY 4.0
- 官方 PDF：15 页；SHA-256 `6096274c1683201a911ce4ff3b3e786621eeaf846fed64981a545ef5a3589a14`
- PDF `Tagged: no`，不能据此声称源 PDF 对辅助技术无障碍。
- 图 1 为作者依据 Sweller 绘制；图 2、3 是作者照片但含第三方游戏产品与商标元素。
- 当前译文不复载三图二进制，只保留中文文字替代与译后图注。
- `tmp/pdfs` 仅为本地核验材料，不应纳入内容资产或提交。

### 两篇案例

- Paul Grogan 与 New Bedford 来源未观察到文章级开放翻译许可。
- 站内正文是原创案例综合，不是来源全译。
- Paul 案例必须保留 “I guess yes” 与现实中不控制字体、仍需参与复核的双层语境。
- New Bedford 必须分开铁与砖重复，以及加工木材本来独特但多数接触者认为复杂、两类组件增加制造成本。
- 来源没有提供正式测试样本、参与者身份或独立效果数据；不要升级为“测试者普遍证明”。

## 6. 验证命令与结果

```text
pnpm content:check
node scripts/check-resource-learning-content.mjs
node scripts/check-resource-v2.mjs
pnpm check
pnpm exec vite build
QA_BASE_URL=http://127.0.0.1:8017/ pnpm qa:resource-v2:browser
```

已得到：

- 完整内容门通过。
- 学习内容专项守卫 49/49。
- 资源入口 V2 专项守卫 40/40。
- TypeScript 通过。
- Vite 生产构建通过，125 个模块。
- 桌面和移动浏览器 QA 通过；三条新增深链刷新为 `true`。
- 论文 6 表、3 图文字替代、0 正文外链。
- New Bedford 14 个二级章节、3 处站内来源、0 正文外链。
- 移动横向溢出 `false`；控制台、页面、HTTP 错误 `[]`。

`scripts/qa-resource-v2.cjs` 默认端口为 8020；当前用户预览端口是 8017，因此运行时使用 `QA_BASE_URL`。构建在本机 CSS 转换阶段约耗时 2 分 38 秒，并报告大于 500 kB 的分片警告；不要把等待误判为挂死，也不要把性能警告当作内容失败。

## 7. 下一包的原子任务

### A. 单元 5：单问题测试

目标产物：读者能从一个原型问题写出预测、反驳信号、测试任务、观察表与停止条件。继续使用单一具体例子贯穿全文，避免列出一堆测试类型。

### B. 单元 6：从证据到下一版

目标产物：读者能分开原始观察、解释、备选原因、版本边界和下一项单变量改动。必须明确“玩家说了什么”不是行为事实的替代。

### C. 第一份“边玩边学”完整脚手架

选择同一局中的一个具体时刻，依次完成：冻结时刻、记录可见行为、提出系统推断、留下仍未知、写一个可迁移问题。它应能被小学生理解，同时不降低成年读者的证据边界。

### D. 同步接入

每份新正文同时需要：metadata、`authoritativeItems`、稳定路由、二级入口、正文站内阅读、无外链/外图断言、桌面和移动深链刷新回归。

## 8. 不要在下一包做

- 不新增首页或一级入口。
- 不增加筛选器、标签墙、年龄分流、帐号、等级、评分、完成度或推荐系统。
- 不把资源目录的导读记录批量标为完整译文。
- 不把未获许可博客制作成来源替代性全文。
- 不在完成内容前启动大型交互工具。
- 不把大分片性能问题混入内容包；若处理，应开独立性能任务并保持 UI 不变。

## 9. 先读文档

- `docs/PROGRESS_SNAPSHOT_RESOURCE_V2_2026-08-22.md`
- `docs/product/RESOURCE_SITE_V2_MASTER_PLAN.md`
- `docs/product/RESOURCE_V2_VISUAL_SPEC.md`
- `docs/product/RESOURCE_LEARNING_CONTENT_CONTRACT_01.md`
- `docs/research/RULEBOOK_ACCESSIBILITY_TRANSLATION_AUDIT_2026-08-22.md`
- `docs/research/DESIGNER_CASES_BATCH_02.md`
