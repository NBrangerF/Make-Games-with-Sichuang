# 卡池稀有度、扩展兼容、勘误与长期内容治理研究 01

日期：2026-08-20  
状态：已完成第一轮深度研究；待真实项目与中文新手任务测试  
范围：实体桌游、可扩展卡牌游戏、LCG/TCG 的稀有度、卡池、扩展、版本、勘误、禁限、轮替与替换组件。数字游戏和软件产品线只作相邻证据。

## 研究问题

1. 稀有度、补充包槽位与实际出现频率怎样同时影响学习、Limited 环境与获取成本？
2. “兼容旧内容”至少要说明哪些基础版、印次、语言、赛制、模块和组件关系？
3. 纸面文字、勘误、FAQ、综合规则、卡牌数据库之间，哪一份是当前单一事实源？
4. 禁限、轮替、试行解禁和回归测试怎样既维护环境，又减少玩家的突袭式损失？
5. 实体替换、本地化、视觉支持、收纳和教学负担怎样进入长期内容预算？

## 结论先行

- **稀有度不是强度等级。** 官方设计实践把稀有度同时用于出现频率、Limited 环境结构、复杂度分配和产品组成；网站应要求设计者分别填写“可得性、出现频率、复杂度、功能角色和强度风险”，不能用一个稀有度字段代替五者。
- **扩展兼容是一个矩阵，不是一句承诺。** 最低维度包括基础版/印次、所需扩展、规则版本、语言、玩家人数、游戏模式、可混用组件、互斥模块与当前已知问题。
- **当前文本必须只有一个权威入口。** 纸面卡牌可以保留历史价值，但网站和发行包必须明确当前规则、当前卡文、变更日志、历史版本与生效日分别在哪里。
- **内容治理是一条有时间的状态迁移。** 发布、合法、观察、试行变更、正式变更、轮替与归档要有各自日期；“无改动”也是一次有价值的状态确认。
- **长期维护成本由玩家共同承担。** 替换卡、勘误贴、跨规则书查询、分拣、收纳、版本识别、本地化滞后和无障碍替代都是真实成本；设计者不能只统计新内容数量。

## 来源矩阵（25 条）

| # | 来源 | 类型与深读 | 支持什么 | 不能推出什么 |
|---:|---|---|---|---|
| 1 | [New World Order](https://magic.wizards.com/en/news/making-magic/new-world-order-2011-12-05) | 官方设计师长文；全文深读 | 稀有度可重新分配理解/桌面复杂度；common 的复杂度是组合预算 | 不能推出所有游戏都应把复杂牌放高稀有度，或高稀有度应更强 |
| 2 | [Nuts & Bolts #16: Play Boosters](https://magic.wizards.com/en/news/making-magic/nuts-and-bolts-16-play-boosters) | 官方设计师结构说明；全文深读 | 槽位、稀有度张数和 as-fan 会改变整个环境骨架 | 不能把万智牌的具体张数移植到固定套装桌游 |
| 3 | [Banned and Restricted — 2026-08-10](https://magic.wizards.com/en/news/announcements/banned-and-restricted-august-10-2026) | 当前官方公告；全文核准 | 按赛制分别变更、即日生效、解释数据/反事实风险、预告下次日期 | 不能把竞技环境结论当成休闲桌的普遍体验结论 |
| 4 | [Pauper trial unban — 2026-05-18](https://magic.wizards.com/en/news/announcements/pauper-format-check-in-may-18-2026) | 官方试行政策；关键段深读 | 试行解禁要有复查日期、紧急回退门与观察窗口 | 单次成功试行不能证明所有禁限都应先解禁测试 |
| 5 | [Arkham Horror LCG FAQ v2.5](https://images-cdn.fantasyflightgames.com/filer_public/c1/d0/c1d0fab6-7fa6-4ce2-af6a-16416381a19b/ahc_faq_v25_february_2026-web.pdf) | 当前官方 30 页 PDF；全文/关键章节深读 | 最新补充文件、红色变更、勘误/FAQ/Taboo、Current/Legacy/Limited 环境 | 可选 Taboo 不是纸面卡牌全部失效，也不是强制竞技禁限 |
| 6 | [Guided by the Unseen](https://www.fantasyflightgames.com/en/news/2021/6/28/guided-by-the-unseen/) | 官方设计师说明 | 解释每项勘误/Taboo 的理由，并给出约半年维护节奏和紧急例外 | 2021 年计划不保证今天仍严格按同一频率更新 |
| 7 | [Championing New Rules](https://www.fantasyflightgames.com/en/news/2025/12/17/championing-new-rules/) | 当前官方规则团队说明 | Current/Legacy/Limited 分流；新内容主要按 Current 设计，同时声明跨年代兼容 | “兼容”不等于所有组合平衡、简单或适合新手 |
| 8 | [Netrunner Comprehensive Rules Hub](https://nullsignal.games/rules/comp-rules/) | 当前官方规则入口；全文深读 | 最新 PDF、变更高亮、网页当前版、历史归档；卡牌数据库接替旧更新文档成为当前卡文源 | 单一事实源迁移不等于旧文档应被删除 |
| 9 | [Everything You Need to Know About Elevation](https://nullsignal.games/blog/everything-you-need-to-know-about-elevation/) | 官方产品/轮替说明；全文深读 | 产品上线与赛事合法分开；列出完整合法套装；重印可维持单卡合法；多语言有滞后 | 该合法表只描述当时赛制，不能永久缓存 |
| 10 | [A New Approach to Standard Ban Lists](https://nullsignal.games/blog/a-new-approach-to-standard-ban-lists/) | 官方平衡团队政策 | 不确定的禁限时间会扰乱备赛与办赛；建立发布、赛季与紧急列表 | 固定窗口不能消除紧急变更需要 |
| 11 | [Measured Response development](https://nullsignal.games/blog/measured-response-a-tale-from-elevation-development/) | 一手开发日志 | 单卡判断依赖周围卡池；大轮替要求稳定角色、分版本和增量测试 | 一个成功开发故事不能给出通用测试局数 |
| 12 | [Liberation Part 2 and Rotation](https://nullsignal.games/blog/liberation-part-2-upcoming-products-and-rotation/) | 官方产品路线 | 实体稀缺和社区分裂也可成为轮替理由；路线图将产品与轮替对应 | 计划日期可能变化，不能替代当前合法表 |
| 13 | [Spirit Island Errata Pack 1](https://shop.greaterthangames.com/products/spirit-island-errata-pack-1) | 官方实体替换包 | 精确限定第 4/5 印基础版与第 3 印扩展；第 6 印起已修；包并非覆盖全部勘误 | 有替换包不证明所有玩家都能买到或愿意替换 |
| 14 | [Root Upgrade Kit](https://ledergames.com/products/root-upgrade-kit) | 官方实体升级包 | 用盒背条码识别印次；免费 PDF 与付费替换板并存；覆盖基础版和特定扩展 | 轻微平衡修订不自动等于新版本所有组件兼容 |
| 15 | [Dominion 2nd Edition Update Pack](https://www.riograndegames.com/games/dominion-update-pack/) | 官方产品页 | 为第一版提供到第二版的实体迁移路径 | 简短产品页未列出完整替换清单或兼容边界 |
| 16 | [Euphoria Essential Update Pack](https://store.stonemaiergames.com/products/euphoria-essential-board-pack) | 官方产品页 | 明确前置基础版与扩展、包含/不包含、组件尺寸和无需购买的人群 | 购买可用性和价格会变化，不能当长期保证 |
| 17 | [Wingspan: European Expansion](https://store.stonemaiergames.com/products/wingspan-european-expansion) | 官方扩展页 | 声明可混入原版和未来扩展；同时提供收纳与 vision-friendly 卡牌路径 | 商品承诺不证明所有扩展组合的平衡与学习成本 |
| 18 | [Congress of Vienna, 2nd Printing](https://www.gmtgames.com/p-1167-congress-of-vienna-2nd-printing.aspx) | 官方产品/规则入口 | Living Rulebook 替代旧版，变更高亮；卡牌勘误独立；新版印刷修已知勘误 | living rules 不能自动更新玩家手中纸本 |
| 19 | [Disney Lorcana Resources](https://www.disneylorcana.com/en-US/resources) | 当前官方资源中心 | 规则、FAQ、set notes、赛事文件分层并带更新时间和多语言版本 | 页面聚合不保证各语言同日同步或完全等价 |
| 20 | [BGG: when to make a new entry](https://boardgamegeek.com/wiki/page/when_to_make_a_new_entry) | 社区数据库治理规则 | 区分游戏、版本、印次、大盒与核心机制变化；勘误和内容交换通常仍属版本 | BGG 收录规则不是出版商的版本命名标准 |
| 21 | [A Conservative Metric of Power Creep](https://doi.org/10.1177/15554120211050812) | 同行评审论文；全文深读 | “严格更优”可作为可计算下限；力量依赖环境和赛制；作者明确列出指标盲区 | 1.56/年不是玩家感知的全部 power creep，也不能直接用于其他游戏 |
| 22 | [NIST: Combinatorial Testing](https://www.nist.gov/publications/combinatorial-testing) | 官方软件工程参考；全文摘要/论文方法核对 | 当配置太多无法穷举时，用 covering array/组合覆盖安排高价值交互测试 | 软件缺陷经验不能直接声称桌游问题也多由少数参数交互造成 |
| 23 | [Software product line testing: SLR](https://link.springer.com/article/10.1007/s10664-024-10516-x) | 2024 系统综述；关键章节深读 | 先约束有效/无效配置，再抽样覆盖；全组合通常不必要且不可行 | 软件 feature model 不是桌游扩展质量模型 |
| 24 | [玩家讨论：never-ending expansions](https://www.reddit.com/r/boardgames/comments/1uv29g1/debate_what_are_your_thoughts_on_neverending/) | 非代表性玩家症状 | 发现收纳、分拣、教学、FOMO、必须购买和相互不兼容等候选问题 | 不能代表桌游玩家总体，也不能给扩展数量上限 |
| 25 | [玩家讨论：what makes an expansion great](https://www.reddit.com/r/boardgames/comments/1u9161y/what_makes_an_expansion_truly_great/) | 非代表性玩家症状 | 发现“更多同类/修复/模块/复杂度膨胀/跨规则书查询”等相互冲突期待 | 不能生成最佳扩展类型或市场结论 |

## 深读综合

### 1. 稀有度要拆成五个字段

**来源事实。** New World Order 把低稀有度的理解与桌面复杂度视为有限预算，并把一部分复杂度移到 uncommon 以上；它同时指出战略复杂度可能对新手暂时不可见。Play Booster 结构说明则显示，即使总卡数不变，只要 common/uncommon 张数与每包 rare 的出现频率变化，Limited 的威胁密度、解牌槽位、法术/生物比例和设计骨架都会改变。

**本站推断。** 原型不应只给卡标“普通/稀有”。每个内容单元至少记录：

1. `availability`：玩家是否一定获得、随机获得、单独购买或依赖旧产品；
2. `as-played frequency`：一局/一包/一套配置中实际出现多少；
3. `complexity role`：理解、桌面与战略复杂度分别在哪；
4. `system role`：基础动作、答案、构筑支点、惊喜或收藏；
5. `power risk`：在当前格式与旧格式中的上限、替代性和组合风险。

反例是固定盒装游戏：它可能没有商业稀有度，但仍有“首次教学是否出现”“模块加入频率”和“牌堆中的 as-fan”。因此字段仍有意义，只是不需要收集概率。

### 2. 兼容矩阵必须可执行

**来源事实。** Spirit Island、Root、Dominion 与 Euphoria 的升级包都把对象限定到具体印次、前置产品和组件；Wingspan 明确卡牌可混入原版及未来扩展，但这仍只是产品级承诺。FFG 的 Current/Legacy/Limited 环境把“所有年代仍可混用”和“主要按较小当前卡池设计”并列。Netrunner 则列出每个赛制的完整合法套装，并说明重印可以维持单卡合法。

**本站推断。** 扩展兼容表至少要有以下行/列：

- 基础版与印次；
- 必需/可选扩展；
- 规则与卡文版本；
- 模式、人数、场景与组织赛制；
- 可混入、替换、移除、互斥和顺序依赖；
- 语言与组件背面/尺寸；
- 已验证、声明支持、未知和明确不支持；
- 设置、教学、收纳、时长与无障碍新增成本。

“没有已知问题”与“测试过”不能混用。声明支持来自设计契约，已验证来自具体版本和配置的测试记录。

### 3. 当前文本和历史文本要分层

**来源事实。** Netrunner 规则中心提供当前 PDF、变更高亮版、持续更新网页和历史归档，并明确从 25.04 起由 NetrunnerDB 作为当前卡文权威。Arkham v2.5 声明最新 FAQ 是规则参考的补充且新改动标红。GMT 的 Living Rulebook 直接替换前一版，同时另列卡牌澄清/勘误。Lorcana 资源页把快速规则、综合规则、FAQ、set notes 和赛事文件分层并标日期。

**本站推断。** 对每个可变规则对象，网站应保存：稳定 ID、印刷文字、当前规范文字、变更类型、理由、影响范围、生效日、来源、替代材料、撤回/复原状态。用户默认看到当前版，但必须能回答“我手里这张为什么不同”。

勘误至少分成：错字/排版、澄清、不改变意图的技术修复、平衡改动、功能重做。前三者可以被统称勘误；后两者若伪装成“只是勘误”，会让玩家无法评估收藏和策略损失。

### 4. 禁限与轮替是带日期的实验

**来源事实。** Magic 2026-08-10 公告按赛制分别列出变更、立即生效并预告 10 月 12 日下次公告；理由包含胜率/使用率、环境速度和“只移除一张后另一个现有牌组接管”的反事实风险。Pauper 试行解禁预先给出 8 月 10 日结论日和 6 月 29 日紧急回退门，最终在 8 月确认保留。Netrunner 的禁限政策指出不确定时间会影响办赛和备赛，因而区分发布、赛季、紧急三类窗口；轮替文章还把实体稀缺和社区分裂作为治理理由。

**本站推断。** 一次治理变更需要：触发证据、目标格式、候选动作、替代方案、预告/生效/复查日期、回退门、受影响组件与补偿路径。回归测试不能只重测被改卡；应覆盖直接邻接组合、关键赛制骨架、旧扩展代表配置和最脆弱的教学/无障碍路径。

相邻软件证据只支持测试编排：先排除规则上无效的配置，再用 pairwise/covering array 覆盖组合，最后为高风险多项交互增加定向测试。它不证明两两覆盖足以发现桌游体验问题。

### 5. 玩家承担的维护劳动必须进入预算

**来源事实。** 实体勘误包要求玩家先识别印次、购买或打印、替换对应组件；产品页显示不同方案可能只覆盖部分勘误。Netrunner 把发售、不同地区获取、免费 PnP、其他语言上线与竞技合法分开。Wingspan 同时售卖扩展与 vision-friendly 卡牌，并提供额外收纳。玩家讨论反复出现分拣、跨规则书查询、教学、收纳、FOMO 与“买全才完整”等症状，但意见相互冲突。

**本站推断。** 每次扩展/勘误发布要记录玩家迁移任务：识别版本、获取修订、替换/套牌、重分拣、重新学习、教新人、更新存档/牌表、处理旧文本、恢复无障碍适配。不能用“免费 PDF”把打印、裁切、识别、语言和辅助劳动归零。

## 12 条可反驳综合主张

1. 稀有度必须与强度、复杂度、出现频率和获取方式分开记录。
2. 实际出现频率改变环境骨架，不能只看套装中各稀有度的张数。
3. 扩展兼容必须绑定基础版/印次/规则/模式/语言/组件，而不是布尔值。
4. “声明支持”与“已在此配置验证”是不同证据状态。
5. 当前卡文需要单一事实源，历史印刷文本仍需可追溯。
6. 勘误应区分错字、澄清、技术修复、平衡改动与功能重做。
7. 发布、赛事合法、生效、复查和归档是不同时间点。
8. 禁限或轮替要公开目标格式、理由、反事实风险、复查与回退条件。
9. 单卡强度必须放回具体卡池、格式与可得性中判断。
10. 回归测试先约束有效配置，再覆盖高风险交互；两两覆盖不是体验充分性证明。
11. 实体修订必须提供印次识别、替换清单与仍未覆盖事项。
12. 扩展价值评估必须计入设置、教学、查询、分拣、收纳、本地化与无障碍迁移成本。

## 产品落地方向

本站新增“卡池与版本治理契约”专题，要求用户产出：

1. 一张内容护照：稳定 ID、印刷版、当前版、稀有度五字段；
2. 一张兼容矩阵：基础版 × 扩展/模块 × 模式/人数 × 规则/语言/组件；
3. 一条事实源链：当前规则、当前卡文、变更日志、历史归档与替换材料；
4. 一张治理时间线：发布、合法、观察、试行、生效、复查、撤回/归档；
5. 一个最小回归包：核心路径、邻接组合、旧版、最高风险配置、教学与无障碍任务；
6. 一张迁移成本清单：获取、识别、替换、分拣、学习、教学、收纳、本地化和适配。

## 证据边界

这组来源证明多种长期维护模式真实存在，并给出可操作字段；它不证明哪种商业模式、稀有度结构、轮替周期、禁限频率、扩展数量或版本号方案普遍最佳。Magic、Arkham、Marvel Champions、Netrunner 与 Lorcana 都是持续扩展卡牌游戏，不能代表所有固定盒装桌游；实体升级包是具体产品案例；软件测试只提供组合抽样思路；两篇 Reddit 讨论只用于发现症状。本站五步契约仍需用中文新手、不同收藏规模、旧版持有者、不同语言和不同支持需求进行任务测试。

