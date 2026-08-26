# Phase 1 交接：概念词表与资源评价

日期：2026-08-14  
状态：review  
前置交接：`2026-08-14-six-stage-guides.md`

## 本轮目标

把“指南中出现的术语”和“资源库中的链接”提升为可维护的知识结构：同一概念只定义一次；每份资源明确怎么读、什么时候用和不能推出什么；不通过星级或总分制造虚假排序。

## 已完成

### 1. 规范概念词表

- `content/glossary.json` 收录 24 个词条。
- 每个词条包含规范名称、别名、定义、反例边界、贯穿例、阶段、相关概念、指南、资源与 Claim 关系。
- `content/guides.json` 的六篇指南新增 `conceptIds`，每篇连接 5–8 个词条。
- 设计路径页面显示“本阶段概念”，方法页提供搜索、阶段筛选、相关概念跳转、指南回链和来源链接。

### 2. 无总分资源评价

- `content/resource-evaluation-rubric.json` 定义九个阅读维度：阅读方式、适合阶段、审阅深度、语境清晰度、可采取动作、迁移范围、时效风险、引用与复用、商业语境。
- `content/resource-assessments.json` 为全部 26 条资源各建立一份审阅记录。
- 每份记录另有 `bestFor` 与 `doNotUseFor`，把使用价值和外推边界放在枚举之前。
- 不存储 `score`、`rating` 或 `totalScore`；构建校验器会拒绝这些字段。
- 方法页的“资源怎么读”显示量表原则、九维说明、资源搜索和逐条详情。

### 3. 构建期约束

`scripts/validate-content.mjs` 现在检查：

- 词条 ID 唯一，阶段、指南、相关词条、资源和 Claim 外键均可解析；
- 每篇指南至少连接四个存在的词条；
- 26 条资源恰好各有一份审阅记录，枚举值合法；
- 评价量表覆盖所有机器字段；
- 资源审阅记录不得包含聚合分数字段。

### 4. 文档与回归脚本

- `docs/product/GLOSSARY_AND_RESOURCE_EVALUATION.md` 记录模型、维护规则和产品表达。
- `docs/product/CONTENT_DATA_MODEL.md` 已加入 GlossaryTerm 与 ResourceAssessment。
- `scripts/qa-site.cjs` 已加入 24 词条、保真度搜索、九维量表、AutoBG 边界的回归断言。

## 验证证据

- `node scripts/validate-content.mjs`：通过；26 resources / 14 claims / 5 frameworks / 6 guides / 24 terms / 26 assessments / 50 local files。
- `pnpm check`：一次独立运行通过；资源紧张时另两次进程在输出阶段被系统以 137 终止，未出现新的 TypeScript 诊断。
- `pnpm exec vite build`：通过；JS 307.21 kB（gzip 96.10 kB），CSS 27.24 kB（gzip 5.82 kB）。
- 应用内浏览器：页面标题、首屏内容、框架错误覆盖层、控制台警告/错误检查通过；“方法 → 概念词表 → 搜索保真度”得到唯一词条“原型精度”，并显示“不是统一的粗糙—精美单轴”边界。
- 桌面截图目检：顶部导航、宋体层级、暖白纸面、钴蓝选中态、砖红批注、开放式左右栏均延续既有视觉系统。

## 未完成与验证限制

- 应用内浏览器在尝试点击“资源怎么读”时触发 URL 安全策略，后续浏览器动作也被拒绝。没有绕过，也没有切换到另一浏览器复现同一动作。
- 因此新增的“资源怎么读”真实点击路径与本轮新增移动端布局尚未获得浏览器运行证据；它们已经通过 TypeScript、生产打包、JSON 外键和数量校验。
- 回归脚本已写入对应断言，但本轮没有在安全策略触发后运行。下一轮浏览器环境允许时，应先运行完整 `pnpm qa`，再检查 390px 移动视口。
- 所有资源评价均为当前项目组的审阅判断，不是对作者或资源质量的排名；后续需要第二位编辑复核，尤其是 `metadata_only`、商业语境与权利状态。

## 下一工作包

1. 先执行新增浏览器回归，补齐“资源怎么读”和移动端证据。
2. 用 3–5 名新手做概念查找任务：解释“机制/动态”“观察/反馈”“原型/原型精度”的区别。
3. 用 3 个真实设计问题测试资源评价：用户能否在两分钟内选到合适资源，并说出为什么不能外推。
4. 根据误解记录修订词条，不先扩充数量。
5. 进入专项指南：优先“测试类型怎么选”“规则盲测”“可访问性任务”，继续引用现有词条 ID。

## 下一位维护者从这里开始

1. 阅读 `docs/product/GLOSSARY_AND_RESOURCE_EVALUATION.md`。
2. 运行 `node scripts/validate-content.mjs`。
3. 启动网站，优先验证“方法 → 资源怎么读 → AutoBG”。
4. 任何词义改动只改 `content/glossary.json`；指南继续引用 ID。
5. 新增资源时，同一提交必须新增 `resource-assessments.json` 记录，否则构建会失败。
