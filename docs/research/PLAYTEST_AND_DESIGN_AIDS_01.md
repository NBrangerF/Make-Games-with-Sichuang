# 专项研究 01：测试类型、规则盲测与设计辅助桌游

日期：2026-08-14  
状态：review  
问题类型：多来源比较与产品转译  
深读来源：10 个主要页面；另以现有研究台账中的 BGDL、daniel.games 与规则书文章交叉核对

## 本轮问题

1. 新手如何根据当前问题选择测试方式，而不是把测试类型当成固定升级阶梯？
2. 规则盲测什么时候做、具体观察什么，怎样避免把规则、组件和系统问题混为一谈？
3. 现有“辅助设计的桌游、卡组与组件盒”解决哪些任务？本站可以借鉴什么而不复制受保护内容？

## 结论摘要

- **来源事实**：行业协会常把自测、熟人测试、外部测试和盲测分别描述，但也明确设计者会在这些方式之间循环，而非一次性按顺序通关。[TTGDA](https://www.ttgda.org/in-person-playtesting)
- **综合推断**：测试类型更适合表示“证据取得方式”，不是成熟度等级。选择器应先问当前问题、系统稳定度、是否测试自主学习、是否需要目标玩家，再建议最低成本的方式。
- **来源事实**：规则盲测不只测文字。玩家的设置动作、第一次停顿、查找路径、组件摆放和误玩的规则共同构成证据。[Board Game Design Lab](https://boardgamedesignlab.com/playtest-like-a-boss/)、[Greg In Play](https://greginplay.com/posts/blind-playtesting.html)
- **来源事实**：现有实体辅助工具大致分成三种：诊断视角卡、随机约束/反思卡、可立即拼出系统的通用组件。[Schell Games](https://schellgames.com/art-of-game-design)、[Deck of Ideas](https://www.gateongames.com/en/deck-of-ideas/)、[Rapid Prototyping Game](https://www.gamedeveloper.com/design/the-rapid-prototyping-game)、[OMNIDECK](https://pandagm.com/omnideck/)
- **产品建议**：本站不复制商业卡牌问题或卡面；先实现原创的“测试方式选择器”，随后制作基于本项目词表和 Claim 的约束牌。每次抽牌都必须导向假设、原型变化和测试问题，避免沦为随机点子生成器。

## 1. 测试类型不是一条只能前进的楼梯

### 来源事实

[TTGDA 的测试资源页](https://www.ttgda.org/in-person-playtesting)分别说明：

- 自测用于先确认规则和流程能否运行，不负责证明多人策略或平衡；
- 熟人测试让设计者尽早看到困惑、拖延和不可运行处，但关系可能影响反馈坦率度；
- 外部测试把游戏交给与项目关系更弱的人，更接近目标玩家的独立反应；
- 盲测让玩家只靠规则与组件设置、学习和游玩，用来检查作品能否脱离设计者运行；
- 页面同时明确这些方式会反复循环。外部测试发现问题后，常回到自测先验证修复。

[Break My Game 的社群规范](https://www.breakmygame.com/codeofconduct)补充了测试方式之外的运行条件：设计者应说明游戏概况和本轮需要的反馈；社群活动有时间边界；无引导测试和录音录像要提前与主持者协商；测试者可以停止参与；设计者不应争辩，也不必执行每条建议。

[Protospiel Online](https://protospiel.online/)展示了外部远程测试的实际基础设施：Discord 组织、找桌流程、虚拟桌面、主持支持和时间互惠。其当前页面明确列出 2D/3D 原型平台，也把“给予多少测试时间，就回馈多少测试时间”写入设计者预期。具体平台支持和活动价格属于高时效信息，不能固化为长期指南。

[daniel.games 的测试文章](https://daniel.games/playtesting/)代表一位职业设计师的个人工作流：尽量缩短测试片段、在早期主动主持、问具体问题、照顾测试者时间并更换测试者。文章中的“两人、半小时、轻中量”等是作者项目选择，不是普遍定律。

### 综合推断

对新手最有用的不是问“我到哪一阶段了”，而是依次回答：

1. 这轮要知道规则能否运行、玩家行为是否出现，还是陌生人能否自主学习？
2. 系统是否稳定到值得让人花时间理解？
3. 设计者能否在场？在场会不会污染正在观察的对象？
4. 是否需要接近目标受众的经验、年龄、语言或可访问性条件？
5. 哪种最低成本方式能取得足够证据？

因此本站把测试方式设计为可回退、可组合的建议，不给“当前等级”或完成百分比。

## 2. 盲测应拆成规则、设置、查询与整局四种任务

### 来源事实

[Greg In Play](https://greginplay.com/posts/blind-playtesting.html)认为很早期的原型通常更适合由设计者在场处理断裂；当玩家不再频繁依赖设计者、能形成局内目标、能从规则书快速查到答案时，盲测才更容易暴露自主使用问题。文章是 2026 年设计师博客，不是对照研究，应作为准备度启发式使用。

[Board Game Design Lab](https://boardgamedesignlab.com/playtest-like-a-boss/)提出了一个比“完整盲玩一局”成本更低的做法：只让陌生玩家根据规则完成设置并向设计者反向教学。这样可以单独观察设置顺序、术语、图示和规则书导航，而不必等系统完全稳定。

[Panda Game Manufacturing 2026–2027 的设计师项目页面](https://pandagm.com/p20/)把“新读者无需额外指导即可学习和游玩”的已盲测规则书列为提交材料。这证明自主可用的规则书是出版/生产准备中的现实门槛，但该活动要求不能被误写成整个行业的统一合同标准。

[Cardboard Edison 的规则书启发式摘录](https://cardboardedison.com/blog/2021/12/28/46p4n5pk3mtpar6l20ujyx34ipxa6j)把文字、图片和版式视为同一教学系统，并建议用不同游戏经验的读者反复盲测。它是策展的设计师经验，不提供效果量。

### 综合推断

“盲测通过了吗”过于粗糙。本站应记录四类任务：

- **设置测试**：玩家能否找到正确组件，并把桌面摆成可开始状态；
- **反向教学**：玩家读完后怎样向别人解释目标、回合与关键例外；
- **查询测试**：给出一个真实局面，玩家能否在规则书或玩家辅助中找到答案；
- **整局盲测**：陌生玩家只靠交付包完成从开箱到结算的完整使用。

每项记录版本、第一次偏离、停顿位置、查找路径、实际误玩和需要的协助。设计者不要只记“问了几个问题”，因为沉默的猜测同样可能导致错误。

## 3. 设计辅助桌游与卡组的三种产品模式

### A. 诊断视角

[The Deck of Lenses](https://schellgames.com/art-of-game-design)把不同设计视角转成可抽取的问题卡，用于团队在卡点时切换观察角度。它覆盖广义游戏设计，不专为桌游；卡组和书受到版权保护。本站可以借鉴“一个问题一个视角”的交互结构，但不能复制卡牌问题、命名体系或完整分类。

### B. 随机约束与反思

[Deck of Ideas](https://www.gateongames.com/en/deck-of-ideas/)使用元素、连接条件和提案提示三套牌，目标是突破空白页并迫使设计者离开舒适区。官方页面明确禁止未经授权的复制。

[Rapid Prototyping Game](https://www.gamedeveloper.com/design/the-rapid-prototyping-game)来自课堂实践：先随机决定媒介、形式和目标，再抽机制、主题、胜利条件和顺序，之后用反思牌和迭代牌强迫团队修改。该文章提供教学设计的一手叙述，但没有正式学习效果比较。

这类工具的核心价值不是“组合出好点子”，而是通过限制减少空白页压力，并让学习者看到改变一个变量怎样引发动态变化。

### C. 通用组件与快速拼装

[Panda OMNIDECK](https://pandagm.com/omnideck/)在 108 张卡上叠加花色、数值、字母、骰子和资源等标记，可替代多种组件来做原型。[Panda Game Design Toolkit](https://pandagm.com/shop/)则提供木件、骰子、标记、卡牌和贴纸，主要降低从规则到实体原型的材料成本。

这类工具不负责诊断设计。它们减少制作时间，但不能证明机制平衡、规则清楚或目标体验成立。

## 4. 本站的产品转译

### 立即实现：测试方式选择器

输入：当前问题、系统稳定度、是否测试自主学习、测试者关系、媒介。  
输出：建议方式、为什么、主持者应做什么、这轮不能推出什么、下一步记录清单。

选择器使用项目自己的 Claim 与词表，不复刻外部文章流程。它应允许用户得到“先自测十分钟”“引导外部测试”“只做设置盲测”等混合结果，而不是只输出四个大类之一。

### 后续实现：原创设计约束牌

每张牌由四个字段构成：

```text
观察对象：选择 / 信息 / 资源 / 节奏 / 互动 / 主题
约束动作：删除 / 交换 / 隐藏 / 延迟 / 共享 / 反转
行为预测：预计玩家将……
测试问题：在一个短片段里怎样观察？
```

牌的词汇来自 `content/glossary.json`，行为预测与测试问题是必填。这样可把随机刺激接回项目证据链，也避免复制商业卡组内容。

## 证据边界

- 行业协会、社群和厂商页面能证明当前公开做法、服务或提交要求，不能证明所有设计项目都应采用同一顺序。
- 设计师博客是一手经验，适合生成启发式和反例，不提供普遍效果量。
- 商业产品页面能核验组件与官方用途，但营销文案不能单独支撑教育成效或设计质量主张。
- 本轮没有购买或实测实体卡组；关于实际使用摩擦、语言门槛和重玩价值仍需实物测试。
- 2026 年活动日期、价格、平台支持和服务状态属于高时效信息，网站应显示核验日期并定期巡检。

## 来源清单

1. [TTGDA — Playtesting Resources](https://www.ttgda.org/in-person-playtesting)
2. [Break My Game — Playtesting Code of Conduct](https://www.breakmygame.com/codeofconduct)
3. [Protospiel Online](https://protospiel.online/)
4. [Unpub — The Unpublished Games Network](https://www.unpub.org/)
5. [daniel.games — Playtesting](https://daniel.games/playtesting/)
6. [Board Game Design Lab — How to Playtest like a Boss](https://boardgamedesignlab.com/playtest-like-a-boss/)
7. [Greg In Play — The Importance of Blind Playtesting](https://greginplay.com/posts/blind-playtesting.html)
8. [Panda p20 submission requirements](https://pandagm.com/p20/)
9. [Schell Games — The Art of Game Design / Deck of Lenses](https://schellgames.com/art-of-game-design)
10. [GateOnGames — Deck of Ideas](https://www.gateongames.com/en/deck-of-ideas/)
11. [The Rapid Prototyping Game](https://www.gamedeveloper.com/design/the-rapid-prototyping-game)
12. [Panda OMNIDECK](https://pandagm.com/omnideck/)

## 方法

围绕三组研究问题进行多轮英文检索，优先打开作者、协会、社群、厂商和出版方原始页面；对 10 个关键页面做正文级阅读，并用现有台账中的 BGDL、daniel.games、TTGDA、Oath 与规则书样本交叉核对。事实、综合推断和产品建议在正文中分别标注。
