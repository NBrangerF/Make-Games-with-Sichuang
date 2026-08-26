# Phase 1 设计辅助产品谱系与练习闭环交接

日期：2026-08-18  
状态：`review`  
前置交接：`2026-08-18-comprehensive-guides.md`

## 本轮目标

回到用户原始目标中的“也有很多桌面游戏是辅助设计师进行设计的”，把已有的卡组与组件资源扩展成可用于网站决策的产品谱系，并判断哪些交互值得实现、哪些游戏化结构会改变原本的设计任务。

## 产出

1. 新增 [《桌游设计辅助产品谱系 02》](../research/DESIGN_AID_PRODUCTS_02.md)：把产品分为词汇参考、随机约束、诊断反思、协作脚手架、闭环练习与原型组件六类，逐类写明产出和失效方式。
2. 新增 [设计辅助练习闭环产品规格](../product/DESIGN_AID_PRACTICE_LOOP.md)：编排现有约束牌、改造实验室、决定轨迹、测试选择器与项目护照；不计分、不复制商业卡牌、不生成模拟玩家反馈。
3. 新增 [设计辅助闭环可用性测试协议](../product/USABILITY_TEST_DESIGN_AID_LOOP.md)：6 项任务覆盖模式选择、拒绝提示、规则产物、诊断、自测证据和反思隐私。
4. 新增 8 条逐条审阅资源：`series-interesting-choices`、`gamespace-idea-generation-games`、`weapon-of-criticism-design-game`、`goventure-game-maker-kit`、`what-the-deck`、`martha-game-mechanic-cards`、`polyu-game-kit-2`、`league-ideation-toolkit`。
5. 新增第 8 条资源入口 `choose-design-aid`，先问辅助工具要承担什么工作，而不是给卡组或组件盒排名。
6. 扩展 `claim-design-aid-must-return-to-evidence`，新增 `claim-gamefulness-can-redirect-design-work`。

## 关键决定

### 设计辅助不是“灵感卡”同义词

词汇卡解决不知道有哪些结构，约束牌解决空白页，诊断牌解决视角固化，协作套件解决多人行动顺序，练习游戏解决完整技能循环，组件盒解决材料摩擦。只有先确定本轮希望留下的产物，资源和交互才可比较。

### 不把更多游戏性当成更好的工作流

GameSpace 论文直接报告了计分与创造目标冲突、规则复杂和概念堆叠；Weapon of Criticism 论文的失败原型显示，玩法复杂度可以削弱原本要支持的反思。因此候选闭环默认无计分、提示可跳过、一次只承担一项工作，并要求把提示转成规则、预测与测试。

### 先写规格和测试协议，不抢先做第 13 个工具

现有网站已经有构成闭环的零件，但尚无真实新手证据证明其组合顺序可理解。先测试模式误选、提示被当命令、自测被当外部证据和私有反思意外导出，再决定界面实现，避免把新表单数量当项目进展。

### 商业产品只链接和抽象结构

不复制 A Series of Interesting Choices、What The Deck、Deck of Ideas、Deck of Lenses 或其他商业产品的卡面、问题、图像和计分。作者博客的开放邀请也不自动覆盖其引用的第三方描述或案例。

## 数据变化

| 项目 | 上一基线 | 当前 |
|---|---:|---:|
| 资源 | 196 | 204 |
| 逐资源审阅 | 196 | 204 |
| 任务型阅读入口 | 7 | 8 |
| Claim | 99 | 100 |
| 专题指南 | 11 | 11 |
| 概念词条 | 71 | 71 |
| 已实现专用工具 | 12 | 12 |

## 验证

- `pnpm resources:health`：生成 204 条完整快照；当前受限环境为 `reachable 0 / blocked 0 / dead 0 / error 204`，不判定链接死亡；
- `node scripts/validate-content.mjs`：通过，`204 resources / 8 entry points / 100 claims / 5 frameworks / 6 core guides / 11 special guides / 71 terms / 204 assessments / 22 cards / 50 local files`；
- `node --check scripts/qa-site.cjs`：通过；契约已更新为 204 条资源和 8 个入口；
- `pnpm check`：单独运行通过。与内容和脚本检查并行时曾被系统以 137 终止，没有输出类型错误；
- `pnpm build`：通过，CSS 48.55 kB（gzip 8.23 kB），JS 798.86 kB（gzip 234.25 kB）；仍有大于 500 kB 拆包警告，构建器报告 63% 时间在插件钩子，其中 CSS post-render 53%、HTML transform 10%；
- `pnpm qa`：未进入浏览器检查，preview 继续因 `listen EPERM: operation not permitted 127.0.0.1:5175` 失败。

## 限制

- 商业产品没有做购买、长期使用或可访问性实测；价格和可得性没有固化到资源数据。
- GameSpace、LEAGUE 和 Weapon of Criticism 的证据来自工作坊、小样本、特定学生/从业者语境，不能证明最终设计质量。
- 第 8 个横向入口还没有在真实 375px 浏览器和屏幕阅读器中验证可发现性。
- 练习闭环尚未进入 UI、存储 schema 或迁移代码；产品规格中的 JSON 只是候选结构。
- 反思模式的同意、退出、删除和导出边界需要真实用户测试，不能仅靠文档视为安全。

## 下一工作包建议

优先执行 `USABILITY_TEST_DESIGN_AID_LOOP.md` 的低保真测试，先验证任务选择与证据边界，再决定是否实现闭环。若暂时无法招募，可继续研究本地课程中已经出现的设计练习、教师主持脚本与学生产物，做一次“现有课程活动—六类辅助产品—网站交互”的交叉映射，但仍不得以文档审阅替代真实使用测试。

