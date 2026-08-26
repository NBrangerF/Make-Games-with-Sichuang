# 资源网站 V2 内容包 03 交接

日期：2026-08-22  
交接状态：内容、接入、权利记录、静态守卫、生产构建与真实浏览器 QA 完成  
当前预览：`http://127.0.0.1:8017/?build=resource-v2-04#resources`

## 1. 产品边界没有改变

- 这是中文桌面游戏设计资源站；资源整理、站内中文阅读和学习脚手架优先于工具数量。
- 默认资源首页固定为三个主入口；“搜索全部资料”是次级入口。
- 学习方式固定为四个：系统学习、设计师思考、边玩边学、小练习。
- 不按年龄给读者贴标签。小学生到成年人共享入口，用短路径、例子、分段、模板、进阶任务和证据边界适配不同背景。
- 内容按设计阶段和同阶段的不同 approach 组织，但不把完整分类体系堆回首页。
- 无可核验翻译或再发布依据的博客只做原创综合；开放许可全文译文单独登记许可、版本、改动和署名。
- Codex AI 译文可直接作为内部学习主版，无需等待人工双语核验；不得冒充人工翻译、法律审定或公开版本。

## 2. 当前可用基线

| 类型 | 数量 | 内容 |
| --- | ---: | --- |
| `original_complete` | 8 | 系统单元 0–6；边玩边学 01 |
| `authorized_full_translation` | 3 | GDC 第 1、2 关；规则书无障碍论文 |
| `original_case_synthesis` | 5 | Monsoon、Dune、Quid、Paul Grogan、New Bedford |
| `authoritativeItems` | 16 | 以上三类显式白名单总数，即 `8 + 3 + 5` |

UI 计数：首页 3、学习方式 4、系统路线 9、当前完整系统单元 7、完整“边玩边学”1、完整来源译文 3、设计师案例 5。

## 3. 本轮新增文件

### 单元 5：单问题测试

- `content/learning-units/systematic-unit-05-single-question-test-zh-CN.md`
- `content/learning-units/systematic-unit-05-single-question-test-zh-CN.metadata.json`
- `docs/research/SYSTEMATIC_UNIT_05_SOURCE_AUDIT_2026-08-22.md`

正文规模：18,651 字符、12,234 个 U+4E00–U+9FFF 汉字、22 个 H2、60 个 H3、7 张表、8 条站内来源记录。完整例子是测试计划和模板，不是已经发生的真实测试。

### 单元 6：从证据到下一版

- `content/learning-units/systematic-unit-06-evidence-to-next-version-zh-CN.md`
- `content/learning-units/systematic-unit-06-evidence-to-next-version-zh-CN.metadata.json`
- `docs/research/SYSTEMATIC_UNIT_06_SOURCE_AUDIT_2026-08-22.md`

正文规模：19,417 字符、12,625 个汉字、19 个 H2、64 个 H3、18 张表、13 条站内来源记录。`DEMO-01` 是教学演算，只复用单元 4 已有的两行样例，不得在后续文案中把它升级为真实测试数据或补写未经记录的结果。

### 边玩边学 01

- `content/learning-units/learn-by-playing-one-moment-zh-CN.md`
- `content/learning-units/learn-by-playing-one-moment-zh-CN.metadata.json`
- `docs/research/LEARN_BY_PLAYING_ONE_MOMENT_SOURCE_AUDIT_2026-08-22.md`

正文规模：10,036 字符、6,680 个汉字、16 个 H2、40 个 H3、4 张表、6 条站内来源记录。《Kingdomino》四人记录是本站构造的虚构教学材料；官方规则只支持游戏人数、年龄、时长、骨牌顺序、预定/下一回合放置、合法放置和计分等规则背景，不支持虚构玩家行为、设计师意图或效果结论。

## 4. 接入文件与稳定路由

### 接入

- `content/resource-learning-content.json`
- `src/learning-content-route.ts`
- `src/complete-translation-page.tsx`
- `src/resource-v2-detail.tsx`
- `src/App.tsx`
- `scripts/check-resource-learning-content.mjs`
- `scripts/check-resource-v2.mjs`
- `scripts/qa-resource-v2.cjs`

`complete-translation-page.tsx` 继续承担所有完整站内阅读页，文件名是历史命名，不表示原创系统单元或案例变成“译文”。单元导航现在为 `4 → 5 → 6`；“边玩边学”正文拥有专属返回动作，不回到系统学习。

### 路由

| 内容 | Hash |
| --- | --- |
| 系统性学习 | `#resources/learn/systematic` |
| 单元 5 | `#resources/learn/systematic-unit-05-single-question-test` |
| 单元 6 | `#resources/learn/systematic-unit-06-evidence-to-next-version` |
| 边玩边学入口 | `#resources/learn/learn-by-playing` |
| 边玩边学完整记录 | `#resources/learn/learn-by-playing-one-moment` |

刷新恢复依赖懒加载内容。浏览器回归在 `page.reload()` 后必须等待目标精确 H1，再读取 hash、正文和边界标记；不能在 `domcontentloaded` 后立刻用同步可见性当最终结果。

## 5. 内容与证据边界

### 单元 5

- 产出是将要执行的计划：问题、行为预测、反驳、版本/参与范围、无引导任务、观察、停止、复盘、移交。
- 不能把模板中“会看见什么”写成已经看见，也不能给一次测试设置通用人数、通过率或普遍结论。
- 完整测试单帮助下一次行动，不是研究有效性证明。

### 单元 6

- 单元 5 的计划不等于现场证据；单元 6 明确从冻结记录开始。
- `DEMO-01` 只复用单元 4 两行现成样例，所有缺失身份、人数、原话、交换结果和停止结果都保持未知。
- 观察、玩家原话、设计者解释必须分栏；解释要保留备选原因和反驳信号。
- 下一版一次只承诺一项可追踪改动，其余想法放停车区。

### 边玩边学

- 《Kingdomino》示范中的 A/B/C/D、停顿、指向和话语全部是虚构教学记录，不是实际观察。
- 当前动作是把国王放到新骨牌上进行预定；这张骨牌到下一回合才尝试放进王国。不要把王冠收益写成当前已经结算。
- 骨牌合法放置同时检查至少一个同地形相邻边，并保持整个王国在 5×5 边界内。
- 一次游玩只能提出受范围限制的问题，不证明所有玩家体验、设计师意图或机制效果。

三份正文中的外部来源在阅读页只显示为站内来源记录，不生成 `<a>`。这满足“不跳离网站阅读”，但不是隐藏来源：原始 URL、来源用途和权利状态继续保存在 metadata 与审计文件中。

## 6. 验证命令与结果

```text
node scripts/check-resource-learning-content.mjs
node scripts/check-resource-v2.mjs
pnpm exec tsc -b --pretty false
pnpm content:check
pnpm exec vite build
QA_BASE_URL=http://127.0.0.1:8017/ pnpm qa:resource-v2:browser
```

结果：

- 学习内容专项守卫 59/59。
- 资源入口 V2 专项守卫 43/43。
- TypeScript 通过。
- 完整内容门通过；574 份资源、34 个任务入口基线未被改写。
- Vite 生产构建通过，131 个模块，约 1 分 18 秒。
- 浏览器 QA 通过：首页 3、学习方式 4、系统完整单元 7、完整路线 9、来源译文 3、案例 5。
- 单元 5、单元 6、边玩边学三条新增深链刷新恢复为 `true`；单元 5 的“下一篇”正确进入单元 6。
- 三份新正文均为 0 个可点击外部链接；边玩边学入口只有 1 个主行动。
- 移动首页和边玩边学正文横向溢出为 `false`；控制台和页面错误为 `[]`。
- Codex 内置浏览器对核心路径复核通过，页面日志为 `[]`。

当前用户预览端口是 8017，`scripts/qa-resource-v2.cjs` 的独立默认端口可能不同，因此运行回归时显式传入 `QA_BASE_URL`。Vite 的部分分片仍超过 500 kB；这是独立性能待办，不是本内容包失败。

## 7. 视觉证据

- 接受基准：`design/concepts/resource-v2-home-concept.png`
- 本轮截图：`design/qa/resource-v2-04-*.png`
- 逐项对照：`docs/product/RESOURCE_V2_VISUAL_SPEC.md`

实际对照确认首页三个决定、学习方式四个决定、单列阅读宽度、红色序号、蓝色行动、细分隔线和大量留白都继续成立。二级列表与长文变长是站内补全内容的必要变化；没有新增首页板块、筛选器或卡片墙。

## 8. 下一包的原子任务

### A. 单元 7：规则、教学与查询

目标产物：读者能把第一次学习、局中查询、玩家辅助和规则恢复拆成不同任务，并做出一份可盲用的最小规则交接包。

### B. 单元 8：呈现、生产与发布

目标产物：读者能把组件规格、可制造性、成本范围、包装、发布路线与版本承诺放入一份有边界的交接简报。

### C. 分析游戏的完整起步内容

为“从设计师角度分析一款游戏”写一份可独立读完的导论，再用同一款游戏演示至少两个分析镜头如何提出不同问题；必须继续区分规则事实、玩家/作者报告、本站推断和未知。

### D. 同步接入

每份新正文同时需要 metadata、来源审计、`authoritativeItems`、稳定深链、站内阅读、无外链/外图断言、桌面与移动深链刷新回归。

## 9. 不要在下一包做

- 不新增首页或一级入口。
- 不增加筛选器、标签墙、年龄分流、账号、等级、评分、完成度或推荐系统。
- 不把资源目录的导读记录批量标成完整译文。
- 不把未获许可的博客制作成来源替代性全文。
- 不在完成核心内容前启动大型交互工具。
- 不把大分片性能问题混入内容包；若处理，单独立项并保持入口结构不变。

## 10. 继续工作时先读

- `docs/PROGRESS_SNAPSHOT_RESOURCE_V2_2026-08-22_CONTENT_03.md`
- `docs/product/RESOURCE_SITE_V2_MASTER_PLAN.md`
- `docs/product/RESOURCE_LEARNING_CONTENT_CONTRACT_01.md`
- `docs/product/RESOURCE_V2_VISUAL_SPEC.md`
- `docs/research/SYSTEMATIC_UNIT_05_SOURCE_AUDIT_2026-08-22.md`
- `docs/research/SYSTEMATIC_UNIT_06_SOURCE_AUDIT_2026-08-22.md`
- `docs/research/LEARN_BY_PLAYING_ONE_MOMENT_SOURCE_AUDIT_2026-08-22.md`
- `docs/handovers/2026-08-22-resource-v2-content-package-02.md`（历史包，不是当前状态）
