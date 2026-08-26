# 经典桌游视觉与信息设计参考

日期：2026-08-23  
状态：research-complete  
用途：为桌游设计资源站 V3 视觉系统提供可迁移原则，不提供任何现成美术素材

## 研究问题

这次研究不问“哪款游戏最好看”，而问三个更适合网站设计的问题：

1. 桌游如何让规则、状态和下一步在桌面上保持可见？
2. 桌游如何同时照顾第一次接触的人与有经验的玩家？
3. 哪些方法可以被抽象成网站界面，哪些视觉表达必须留在原作中？

以下结论依据出版商产品页、规则书和设计日志。每条“可迁移做法”都是本站根据材料作出的设计推导，不代表原作者明示的方法论。

## 十一个参考案例

| 案例 | 官方材料显示了什么 | 本站可迁移的原则 | 不复制的表达 |
| --- | --- | --- | --- |
| Ticket to Ride | 地图同时承担关系索引、目标端点和已完成路线的公共状态。 | 用稳定的关系图帮助读者理解“从哪里到哪里”，目标说明只写起点、终点和产出。 | 地图、美术、城市与路线组合、车票、列车造型、名称和品牌色。 |
| Pandemic | 公共棋盘显示风险与回合顺序，角色卡显示个人能力，参考卡承载高频动作。 | 把信息分成全局状态、当前任务和就近速查三层，高频规则放在动作发生处。 | 世界地图、角色、疾病符号、规则文字和整套颜色体系。 |
| Carcassonne | 地块边缘决定能否连接，棋子方向表达状态，较难的农夫规则延后加入。 | 让位置和形状承担部分规则；第一次体验只暴露完成当前任务所需的复杂度。 | 具体地块组合、棋子外形、数量、计分和美术。 |
| Azul | 共享工厂与桌面中央提供输入；玩家板承载暂存、铺墙转化、计分与溢出惩罚，二者共同形成连续流程。 | 工具页按认知顺序排列，并给“尚未处理”和“无法容纳”明确位置。 | 瓷砖纹样、固定色组、玩家板网格、数量比例和布局。 |
| Splendor | 市场用空间层级表达等级，累计奖励即使叠放也保持露出，每回合只做一个动作。 | 详情可折叠，累计影响必须一直可见；一个步骤只提供一个主行动。 | 宝石经济、数值、卡框、图标、贵族和插画。 |
| Codenames | 公共词网格与秘密控制卡分层，完成状态通过覆盖而非删除表达。 | 把共享对象与教师、主持人或引导者信息分开；保留完成痕迹。 | 词库、密钥分布、角色命名、美术和 5×5 的标志性复刻。 |
| 7 Wonders | 每一种颜色都有对应符号，主规则、效果说明、依赖清单和计分纸按查询任务拆开。 | 分类必须使用颜色加形状或文字；首次学习、精确规则、速查和记录应是不同资料层。 | 原符号、颜色对应、卡框、插画、连锁、文字和数值。 |
| Wingspan | 基础版包含 Swift-Start 引导包；另售的视觉友好卡在机制不变的前提下使用高对比、大字和更少装饰，基础版原卡格式并未因此改变。 | 用真实的第一轮操作教学；允许“标准阅读”和“高可读阅读”共享同一份内容数据。 | 鸟牌框架、插画、图标、首局脚本、栖息地布局和组件外观。 |
| Root | 同一复杂系统提供带着做、概念教学、精确规则、阵营速查和可检索规则库。 | 为复杂知识指定唯一规范源，再按使用场景提供不同入口，避免多份教程互相冲突。 | 阵营、动物美术、专有阶段名、阵营板、规则文字和卡牌数据库。 |
| Turing Machine | 打孔卡叠放后直接执行检查，对位符号防错；玩家辅助板兼具说明与遮挡，独立记录纸承担记录与推理。 | 组件可以执行检查而不只显示信息；关键操作需要防错、对位和单一输出。 | 打孔算法、孔位、验证数据、题库和独特硬件实现。 |
| MicroMacro: Crime City | 一张稳定大图承载跨时间信息，案件卡用连续问题控制注意力。 | 保留可缩放总览，再用问题逐步引导观察；观看距离和缩放也是界面设计。 | 城市地图、人物、案件、叙事、线索和线描风格。 |

## 官方来源

访问日期：2026-08-23。出版商可能更新文件，实施引用前需要再次核验版本。

- [Ticket to Ride 官方产品页](https://www.daysofwonder.com/game/ticket-to-ride/)与[英文规则书](https://ncdn0.daysofwonder.com/tickettoride/en/img/tt_rules_2015_en.pdf)
- [Pandemic 官方产品页](https://www.zmangames.com/game/pandemic/)与[规则书](https://cdn.svc.asmodee.net/production-zman/uploads/2024/09/Pandemic_Rulebook.pdf)
- [Carcassonne 官方产品页](https://www.zmangames.com/game/carcassonne/)、[当前基础规则](https://cdn.svc.asmodee.net/production-zman/uploads/2024/09/carcassonne_v3_rulesheet_en-1.pdf)与[当前补充规则](https://cdn.svc.asmodee.net/production-zman/uploads/2024/09/carcassonne_v3_supplement_en.pdf)
- [Azul 官方产品页](https://www.nextmove-games.com/en/azul/azul-game/)与[规则书](https://cdn.svc.asmodee.net/production-nextmove/uploads/sites/4/2024/06/EN-Azul-Rules-Next-Move-web.pdf)
- [Splendor 官方产品页](https://www.spacecowboys-games.com/game/splendor/)与[规则书](https://cdn.svc.asmodee.net/production-spacecowboys/uploads/2025/10/SCSPL01EN_SPLENDOR_RULES_LIGHT.pdf)
- [Codenames 官方资料页](https://www.czechgames.com/for-press-games/codenames)
- [7 Wonders 官方产品页](https://www.rprod.com/en/games/7-wonders)与[效果说明](https://cdn.svc.asmodee.net/production-rprod/storage/downloads/games/7wonders/en/sev-en02-effects-description-1716388911mLqDj.pdf)
- [Wingspan 官方产品页](https://store.stonemaiergames.com/products/wingspan)、[规则与 FAQ](https://stonemaiergames.com/games/wingspan/rules/)与[视觉友好卡说明](https://store.stonemaiergames.com/products/wingspan-vision-friendly-cards-core-game)
- [Root 官方产品页](https://ledergames.com/products/root-a-game-of-woodland-might-and-right)、[资源中心](https://ledergames.com/pages/resources/)与[Leder Rules Library](https://rules.ledergames.com/?product=root)
- [Ahoy 设计日志：玩家辅助与易用性测试](https://ledergames.com/blogs/news/ahoy-design-diary-3-trimming-the-sails)
- [Turing Machine 官方产品页](https://www.scorpionmasque.com/en/turingmachine)与[规则书](https://www.scorpionmasque.com/sites/scorpionmasque.com/files/tm_rules_en_11nov2022.pdf)
- [MicroMacro: Crime City 官方游戏页](https://micromacro-game.com/crimecity/en/index.html)与[Pegasus 官方介绍](https://news.pegasus.de/micromacro-crime-city/)

## 跨案例提炼出的六条设计原则

### 1. 高频信息必须在动作发生处

读者不应在长文、工具和词表之间往返寻找当前步骤。页面需要在操作附近提供最短说明，并保留进入完整资料的入口。

### 2. 位置、方向和覆盖可以表达状态

已读、当前、待处理和被排除的内容，除了文字外还应通过稳定位置、形状或覆盖关系区分。位置关系不能因响应式重排而改变含义。

### 3. 颜色永远需要第二编码

类别色必须同时拥有文字、形状、图案或图标。W3C 的 [WCAG 2.2 Use of Color](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html) 也要求颜色不能成为传达信息或操作状态的唯一方式。

### 4. 规则应按使用时机分层

本站采用五层资料模型：

1. 先做一步
2. 带着做的例子
3. 概念解释
4. 完整精确资料
5. 随时可查的词条与速查

五层共享同一个规范来源，不相互复制成五套可能冲突的正文。

### 5. 工作区顺序要贴合认知流程

输入、整理、转化、产出和边界要有固定位置。错误不能只弹出一句话，而要说明它发生在哪一步、现有内容去了哪里、接下来能做什么。

### 6. 材质必须承担功能

纸纹、组件形状、托盘、线路与切边只在帮助分组、抓取、对齐、记录或导航时出现。纯装饰的木纹、骰子、棋子散景和拟物桌布不进入界面。

## 本站采用的抽象视觉词汇

| 桌游中的通用做法 | 网站中的原创表达 |
| --- | --- |
| 玩家辅助板 | 当前页面的任务摘要与高频速查 |
| 组件托盘 | 一组资源的稳定分区，不做立体拟物 |
| 路径与轨道 | 文章章节、局部学习关系与当前步骤 |
| 方形、圆形、六边形组件 | 颜色之外的类别冗余编码 |
| 覆盖与翻面 | 完成、排除和查看不同阅读层 |
| 对位点与切线 | 连接相关资源，提示内容属于同一组 |

这些词汇必须重新绘制并使用本站自己的比例、配色、命名和交互行为。

## 版权、商标与素材边界

这不是法律意见，不同司法辖区的判断会不同。即使网站不盈利、不公开、只供内部学习，也不能把“内部使用”理解为自动获得复制许可。下列边界是本站采取的保守设计政策，不是逐项法律结论，也不是“列为可迁移就一定合法”的白名单。

美国版权局的[游戏登记说明](https://www.copyright.gov/register/tx-games.html)区分了玩法想法与具体表达：游戏想法和玩法方法通常不是版权保护对象，但规则文字、棋盘和包装美术等具体文学或图形表达可能受保护。[美国版权法 §101 与 §106](https://www.copyright.gov/title17/92chap1.html)把 translation 列为 derivative work，并赋予权利人制作演绎作品的专有权；完整翻译不能只因换成中文就被视为独立原创。美国版权局也说明，[非营利教育用途只是合理使用综合判断的一部分](https://www.copyright.gov/fair-use/more-info.html)，不会自动让完整复制或翻译成为合理使用。

产品名称、标志或整体来源识别外观还可能涉及商标与 trade dress，可参见 [USPTO Trademark Basics](https://www.uspto.gov/trademarks/basics) 和 [TMEP 1202.02](https://tmep.uspto.gov/RDMS/TMEP/print?href=TMEP-1200d1e835.html&version=current)。玩法方法不受版权保护也不等于独特硬件或功能实现可以自由复制；还需要按实现与司法辖区核验实用专利、外观设计和其他权利，可参见 [USPTO Patent Essentials](https://www.uspto.gov/patents/basics/essentials) 与 [WIPO Industrial Designs](https://www.wipo.int/en/web/designs/index)。这里不对任何具体游戏是否存在专利作出断言。

因此 V3 执行以下硬规则：

- 可以研究并抽象迁移信息层级、状态外显、分层教学、形状冗余和防错等方法，但仍需检查最终表达是否过度接近原作。
- 案例中可以为识别来源而必要、准确地提及游戏名称；不得把第三方名称、标志或整体外观用于本站品牌，或造成授权、合作与来源混淆。
- 不复制任何原作的插画、地图、卡框、规则文本、角色、标志、图标系统或标志性组件组合。
- 不把出版商网站、规则书截图或搜索图片作为站点装饰素材。
- 案例分析如果必须展示第三方图像，需要单独记录来源、许可、用途、裁切、替代文字和获取日期。署名、来源记录或裁切本身不构成许可，使用前必须保存可验证的授权或其他权利依据。
- 站点默认使用原创图形、原创插画和 CSS 生成的基础几何元素。
- 无法确认授权的素材不进入构建，即使构建当前仅在本地访问。

## 对 V3 视觉方向的直接影响

研究最终没有导向“像某一款桌游”，而导向“像一张已经被测试过的桌面”：

- 页面是开放桌面，不是卡片商店。
- 资源入口像可选择的行动，不像商品目录。
- 长文像规则书加玩家辅助，不像无限网页。
- 工具像有输入、处理和产出的玩家板，不像独立 SaaS 产品。
- 章节、状态与类别由文字、位置和形状共同表达。
- 视觉趣味来自结构和触感，不来自挪用原作美术。
