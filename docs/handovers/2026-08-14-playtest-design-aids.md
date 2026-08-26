# Phase 1 交接：测试方式、规则盲测与设计辅助工具

日期：2026-08-14  
状态：review  
前置交接：`2026-08-14-glossary-resource-evaluation.md`

## 本轮目标

把“应该怎样测试”“规则盲测究竟测什么”“设计辅助桌游/卡组能怎样进入本站”从零散资源变成可追溯研究、可执行指南和一个能直接产出决定单的交互工具。

## 已完成

### 1. 专项研究

- 新建 `docs/research/PLAYTEST_AND_DESIGN_AIDS_01.md`；
- 对 TTGDA、Break My Game、Protospiel、Unpub、Greg In Play、Schell Games、Deck of Ideas、Rapid Prototyping Game、Panda OMNIDECK 与 p20 等公开页面做来源级比较；
- 分开标注来源事实、项目综合推断与产品建议；
- 明确活动日期、价格和平台支持是高时效信息；商业产品用途不等于教育效果证据；
- 决定不复制商业卡面、题目或分类体系，后续只做来源于本站词表和 Claim 的原创约束牌。

### 2. 机器内容基线

- `content/resources.json` 从 26 条增至 35 条；
- `content/resource-assessments.json` 为 35 条资源保持一一对应的无总分审阅记录；
- `content/claims.json` 从 14 条增至 17 条，新增测试方式、完整交付盲测与辅助工具证据闭环三条主张；
- `content/glossary.json` 为测试类型、规则书和玩家辅助补充来源与 Claim 回链；
- `content/guides.json` 把新增证据和工具接入“测试与反馈”“规则与信息”两篇核心指南；
- `scripts/validate-content.mjs` 把最低基线提升为 35 条资源和 17 条 Claim。

### 3. 两篇专项指南

- `docs/guides/TEST_TYPE_SELECTION.md`：从问题、失败成本、设计者影响、测试者与媒介选择最低成本的足够方式；
- `docs/guides/BLIND_RULES_TEST.md`：把盲测拆成设置、反向教学、规则查询和整局自主使用四种任务；
- 两篇都包含具体例子、五步操作、误区修复、20 分钟练习、完成信号与证据边界。

### 4. 测试方式选择器

- 工具箱新增“测试方式选择”；
- 输入本轮问题、证据目标、稳定度、测试者和媒介；
- 输出建议方式、理由、设计者角色、停止条件、媒介盲点和不能推出的结论；
- “完整自主使用 + 整局稳定”才建议整局盲测，避免把盲测写成固定升级阶梯；
- 支持导出 `桌游设计工坊-测试方式决定单.json`；
- 375px 响应式规则与自动化断言已写入。

## 验证结果

- `node scripts/validate-content.mjs`：通过；35 resources / 17 claims / 5 frameworks / 6 guides / 24 terms / 35 assessments / 50 local files；
- `node --check scripts/qa-site.cjs`：通过；
- `pnpm check`：通过；
- `pnpm build`：通过；生产 JS 326.37 kB（gzip 101.33 kB），CSS 28.93 kB（gzip 5.99 kB）；
- 回归脚本已更新为 35 条资源、两篇核心指南的新来源数、测试方式切换、JSON 导出与移动端宽度断言；
- 应用内浏览器再次被 URL 安全策略拦截本地地址，遵守规范没有切换到外部 Chrome 绕过，因此本轮没有执行更新后的完整浏览器回归；
- 已重新目检既有概念稿，确认实现继续使用开放双栏、细分隔线、暖白纸面、宋体层级、钴蓝动作和砖红证据标注；缺少本轮实际渲染截图。

## 证据与权利边界

- 设计师博客、协会和社群规则支撑的是实践启发式，不提供普遍效果量；
- Panda p20 的规则书要求只代表 2026–2027 特定项目，不得写成行业统一标准；
- Deck of Ideas 官方页面明确限制复制；Deck of Lenses 等商业卡组也只链接与摘要；
- 本轮没有购入或实测实体辅助卡组，因此无法评价真实操作摩擦、语言门槛和重玩价值；
- 选择器是本站的综合推断，尚未经过真实新手任务测试，不能被称为经过验证的诊断模型。

## 下一工作包

优先顺序：

1. 在浏览器安全策略允许后，执行更新后的完整回归并补桌面/375px 截图、控制台和 JSON 下载证据；
2. 用 3–5 名新手完成“选择本轮测试方式”任务，记录他们是否理解稳定度、局部盲测和“不能推出”；
3. 根据误选原因修订选择器文案与分支，而不是先增加更多选项；
4. 设计第一版原创约束牌：观察对象、约束动作、行为预测、测试问题四字段；
5. 继续专项研究规则书信息架构、无障碍测试与不同玩家人数下的招募策略。

## 恢复入口

- 项目入口：`README.md` 与 `docs/INDEX.md`；
- 专项研究：`docs/research/PLAYTEST_AND_DESIGN_AIDS_01.md`；
- 指南：`docs/guides/TEST_TYPE_SELECTION.md`、`docs/guides/BLIND_RULES_TEST.md`；
- 工具实现：`src/App.tsx`、`src/styles.css`；
- 机器内容：`content/resources.json`、`content/resource-assessments.json`、`content/claims.json`、`content/guides.json`、`content/glossary.json`；
- 回归脚本：`scripts/qa-site.cjs`。
