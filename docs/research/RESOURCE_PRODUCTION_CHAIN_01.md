# 资源转换、生产链、维护成本与经济闭环：研究包 01

更新时间：2026-08-20  
状态：可进入内容实现；仍需中文新手与实体桌面任务验证

## 研究问题

1. 一单位资源从哪里进入、在哪些池中保存、经过什么状态，最终到哪里离开？
2. 转换率、执行顺序、批量与容量怎样产生瓶颈、无效产出、套汇或复利？
3. 收入、维护、喂养、工资、腐坏和债务怎样改变引擎的可持续性？
4. 来源与消耗怎样决定短缺、过剩、加速、终局残值与循环边界？
5. 实体组件、换算、图标与维护怎样形成可读性、算术和操作负担？

## 结论摘要

### 1. 先分“存量”与“流量”，再谈资源多寡

生产率、当前持有量和一次性收入不是同一事物。Terraforming Mars 用同一玩家板分别记录六种资源的存量与生产，并在生产阶段把剩余能量自动转成热；Le Havre 的货物在公共 Offer 中逐行动累积，玩家一次取走整个存量；Agricola 的田地每次收获只流出一个作物，而不是把田地库存一次收完。[4][2][1]

相邻 stock–flow 实验显示，即使面对简单的流入、流出和存量，人们也会持续误判累积轨迹。[11] 因而新手指南不能只给“每轮 +3、维护 -2”的表格，还应让设计师分别记录当前池、进入率、离开率、时点和容量。

### 2. 转换不是一个箭头，而是一份协议

Agricola 中未加工谷物/蔬菜可随时按低效率转成食物，改良设施提供更好比率；烤面包却只在特定行动窗口进行。Le Havre 的建筑会把标准货物升级成另一面，可能需要入场费、能量、批量上限、副产品和不利取整。Race for the Galaxy 的消费能力可自行排序，但启动后不能被另一能力打断，且可用时往往必须消费。[1][2][3]

所以“2 木→1 板”至少还缺：谁能执行、何时执行、是否消耗行动、最小/最大批量、能否部分执行、输入是否真的离开、输出放哪里、余数/过付、触发与重复次数。

### 3. 生产能力与产出库存必须分开

引擎升级通常改变未来的生产能力，不等于立刻获得等量资源。Terraforming Mars 明确区分 production parameter 与当前资源；Food Chain Magnate 的员工卡分别提供生产、招聘、训练、营销和工资义务，员工在当轮是否工作也不取消工资。[4][5] 玩家讨论中“产量能否超过 10”“TR 是否计入收入”“能量何时转热”等反复问题，说明组件空间和阶段顺序容易把能力、当前库存与自动转换混在一起。[18]

### 4. 维护成本应该写触发、基数、支付顺序和失败状态

Agricola 的家庭成员在收获时按人数消耗食物，刚出生者本次成本不同，缺口转为固定负分；Le Havre 的喂养需求随轮次表增长，船提供抵扣，支付不足才允许贷款，贷款又在特定 Supply 格触发利息；Food Chain Magnate 按所有需薪员工收费，包括未工作的员工，无法支付时按明确顺序解雇。[1][2][5]

这些规则说明“每轮维护 1”不足以形成契约。维护要写：何时触发、按什么对象计数、先用哪些抵扣、能否过付/找零、能否借贷、缺口怎样记录、欠债是否复利，以及失败是否仍有可玩路径。

### 5. 腐坏、容量和弃置决定生产是否有机会成本

Food Chain Magnate 在清理阶段让未获得特定里程碑的玩家丢弃剩余食物与饮料；Agricola 的动物若无空间会回供应池或在允许时转成食物，刚出生动物若容不下则直接离开；Race for the Galaxy 的生产世界通常只能放一件货物，且消费是把货物牌弃掉。[5][1][3]

因此“生产更多”只有在存放、转换、销售、计分或避免损失之间存在竞争时才形成决定。无限仓储、无腐坏、所有资源都可直接计分，可能让生产升级同时成为保值与得分，放大复利；但这只是结构性风险，不是必然失衡。

### 6. 资源的多用途与多来源要有可读边界

Daniel Thurot 主张让资源形成多用途、多来源的网络，避免一条线性动作反复执行；同时也提醒连接过多会失焦。[7] Quarantine 的设计日志则记录把治愈方块同时作为货币与终局分数，从而制造“花掉还是保留”的张力。[20] Race for the Galaxy 中卡牌同时作为建造对象、支付货币和货物载体，是多用途资源的规则级案例。[3]

可迁移的结论不是“每种资源至少三种用途”，而是每个用途都应连接目标、付出可见机会成本，并让玩家从组件读出当前身份。用途只有名义不同、结果相同，不会自动增加深度。

### 7. 正反馈需要结束窗口与反驳信号

Lostgarden 把投资型来源近似为指数增长，建议从结构上识别早期稀缺与后期丰裕；Fantastic Factories 的设计师回顾称，公开分轨与引擎后期动量让玩家聚焦“领先者”，因此改动了结束触发和分数呈现。[6][9] 这些是设计实践，不是通用实验。

引擎测试应记录“投入何时回本、还能触发几次、是否直接得分、终局何时切断收益”。最危险的不只是高转换率，而是同一升级既提高资源来源、减少维护、扩大容量，又增加得分，且还有足够轮次重复。

### 8. 实体记账是经济系统的一部分

Terraforming Mars 无障碍长评指出，低摩擦方块同时表示不同资源面额，放置位置决定意义，玩家板又同时记录库存和产量；方块移位会直接破坏状态。Race for the Galaxy 长评则指出，小型密集图标、条件性能力、货物藏在世界下方和频繁手牌流动，让生产能力与当前储备难以远距读取。[14][13]

因此应从真实座位测试：玩家能否指出当前存量、生产率、下一次维护、某转换的完整成本，以及执行后每个组件的新位置。用口头提醒维持的经济不是已验证的界面。

## 可执行框架：资源生产链契约

### A. 写目标压力与经济边界

说明资源系统要制造保存/花费、扩产/兑现、效率/韧性、短期生存/终局价值中的哪种取舍。写一种不可接受的断流、一种不可接受的复利和一种参与失败。

### B. 为每种资源画“身份卡”

记录单位、所有者、当前池、容量、来源、保存、转移、转换、维护、消耗、计分与离场。分清当前存量、生产能力和一次性收入。

### C. 把每个转换写成逐步协议

记录资格、窗口、行动成本、输入、批量、转换率、输入去向、输出位置、余数/过付、触发、次数和中断。多步链应逐节点检查单位兼容。

### D. 画维护、腐坏、债务与失败路径

写触发时点、计费基数、抵扣顺序、找零/取整、借贷、缺口记录、复利/固定成本、弃置和恢复。维护增长与生产增长要画在同一时间轴。

### E. 重放三轮并只改一个节点

对早期、回本点和终局前各重放一轮，记录每池前态、流入、转换、流出、后态、动作/维护劳动、错误与下一轮能力。只改一个来源、比率、容量、时点、维护、腐坏、残值或结束窗口，并预写反驳信号。

## 不应越界的结论

- 没有证据给出通用资源种类数、用途数、转换率、生产率、容量、维护成本、腐坏频率、回本轮数或引擎增长曲线。
- 来源等于消耗不保证经济稳定；时点、存量、容量、选择性和玩家差异仍会改变轨迹。
- 正反馈、债务、腐坏和维护可以是目标体验，不应只因它们制造压力就自动删除。
- 学术 stock–flow 研究是理解边界，不证明某种桌游图示必然改善学习。
- 无障碍长评和社区讨论不能代替目标参与者测试或提供发生率。

## 来源矩阵

| # | 来源 | 角色 | 本报告用途 | 边界 |
|---|---|---|---|---|
| 1 | [Agricola Rulebook](https://www.lookout-spiele.de/upload/en_agricola.html_Rules_Agricola_EN.pdf) | 出版者规则 | 收获、喂养、转换窗口、繁殖、容量与失败 | 旧版完整规则，多变量系统 |
| 2 | [Le Havre Rulebook](https://cdn.1j1ju.com/medias/98/d1/2f-le-havre-rulebook.pdf) | 规则级镜像 | Offer 累积、升级、入场费、喂养、过付、贷款与利息 | 镜像；多变量系统 |
| 3 | [Race for the Galaxy 2e Rules](https://www.riograndegames.com/wp-content/uploads/2013/02/RFTG_2e_rules.pdf) | 出版者规则 | 卡牌多用途、生产/消费、强制与顺序 | 图标密集完整系统 |
| 4 | [Terraforming Mars Rules](https://fryxgames.se/wp-content/uploads/2023/04/TMRULESFINAL.pdf) | 出版者规则 | 存量/产量、自动能量转热、面额与位置身份 | 不隔离组件或增长效果 |
| 5 | [Food Chain Magnate Rules](https://goblins.net/files/downloads/FCM_Rules_English.pdf) | 规则级文件 | 生产员工、工资、未工作员工、腐坏、里程碑 | 重策略多变量案例 |
| 6 | [Value Chains](https://lostgarden.com/2021/12/12/value-chains/) | 设计师方法 | source/pool/transform/sink、投资型来源与链断裂 | 主要面向数字长期经济 |
| 7 | [Engines](https://daniel.games/engines/) | 桌游设计师文章 | 资源网络、多用途/多来源、延长循环 | 规范性个人方法 |
| 8 | [Machinations](https://www.gamedeveloper.com/design/the-designer-s-notebook-machinations-a-new-way-to-design-game-mechanics) | 方法/书摘 | source、pool、converter、drain、trader 与条件节点 | 数字建模工具，不是桌游成效实验 |
| 9 | [Fantastic Factories runaway-leader diary](https://fantastic-factories.medium.com/catch-me-if-you-can-the-runaway-leader-and-catch-up-mechanics-53f0356c440d) | 设计师日志 | 引擎动量、分数呈现与结束触发迭代 | 本轮正文 403，仅文章级 |
| 10 | [Resources Loop](https://deliberategamedesign.com/resources-loop/) | 设计方法博客 | 用 +/- 资源标记来源与消耗 | 跨数字游戏，规范性 |
| 11 | [Why Don't Well-Educated Adults Understand Accumulation?](https://web.mit.edu/jsterman/www/Why_Adults_Accumulation.html) | 实验研究 | stock–flow failure 理解边界 | 非桌游任务，不能给界面处方 |
| 12 | [System Dynamics Learning Guide](https://pressbooks.lib.jmu.edu/sdlearningguide/chapter/systems-thinking-a-new-way-to-tackle-problems/) | 开放教材 | stock、flow、source、sink、单位兼容与反馈图 | 教材，不是设计效果实验 |
| 13 | [Race for the Galaxy Accessibility Teardown](https://www.meeplelikeus.co.uk/race-for-the-galaxy-2007-accessibility-teardown/) | 无障碍长评 | 图标、货物可见性、卡牌多身份、操作与计算负担 | 单一评者/第一版 |
| 14 | [Terraforming Mars Accessibility Teardown](https://www.meeplelikeus.co.uk/terraforming-mars-2016-accessibility-teardown/) | 无障碍长评 | 方块移位、位置身份、库存/产量与大 tableau | 单一评者/版本 |
| 15 | [Outcome Feedback for Dynamic Decision Making](https://proceedings.systemdynamics.org/1999/PAPERS/PARA98.PDF) | 相邻动态决策研究 | 局部信息、延迟、库存/欠单与反馈 | 旧研究、电脑化 Beer Game |
| 16 | [History of the Beer Game](https://onlinelibrary.wiley.com/doi/full/10.1002/sdr.1767) | 学术史与规则谱系 | 库存/欠单成本、订单与运输延迟 | 教学模拟，不是娱乐桌游 |
| 17 | [Race for the Galaxy consume-order question](https://www.reddit.com/r/boardgames/comments/1illcy8) | 玩家讨论 | Trade 与 Consume 顺序理解症状 | 单帖、无发生率 |
| 18 | [Terraforming Mars beginner rules errors](https://www.reddit.com/r/TerraformingMarsGame/comments/hbb5ff) | 玩家讨论 | TR/收入、行动与产量混淆症状 | 社区纠错，无代表性 |
| 19 | [Le Havre high-count feeding discussion](https://www.reddit.com/r/boardgames/comments/1rhxga4/is_le_havre_realy_that_bad_at_4_players/) | 玩家讨论 | 人数、行动次数与喂养窗口的时间压力 | 偏好讨论，无因果 |
| 20 | [Resource growth repetition discussion](https://www.reddit.com/r/tabletopgamedesign/comments/1i0bbnu) | 设计社区 | 单一来源循环造成重复的原型症状 | 自选帖子，无代表性 |
| 21 | [Game Elements: Resources](https://www.leagueofgamemakers.com/game-elements-resources/) | 桌游设计师博客 | 资源是否服务核心乐趣、互动与受众复杂度 | 经验文章 |
| 22 | [Quarantine designer diary](https://boardgamegeek.com/blog/1/blogpost/16096/designer-diary-quarantine-a-hospital-game-from-con) | 设计师日志 | 同一方块兼作货币和分数的改版案例 | 回顾性单项目 |
| 23 | [Fantastic Factories Rules](https://cs.uwaterloo.ca/~dtompkin/dtlib/base/Fantastic%20Factories.pdf) | 规则级镜像 | 同步生产、骰子工人、资源与成品 | 镜像，未隔离单机制效果 |

## 深读记录

- Agricola：逐页核对收获三阶段、转换时机、喂养缺口、繁殖与容量。
- Le Havre：逐页核对 Offer 供给、建筑升级、入场费、喂养、过付、取整与贷款。
- Race for the Galaxy：逐页核对多用途卡牌、消费顺序/强制、生产容量和结束池。
- Lostgarden Value Chains：完整读取内部经济节点、链断裂、投资型来源与适用边界。
- Stock–flow failure 与 JMU 教材：核对存量/流量理解证据、单位兼容和教学用途。
- 两篇无障碍长评：深读资源组件、远距读取、卡牌/方块身份与操作任务。

## 下一步

1. 把本研究落为资源生产链专题指南、术语、Claim 与阅读入口。
2. 制作一张可打印的“资源身份卡 + 三轮流量账本”。
3. 让中文新手重放一个生产—维护—转换窗口，并从真实座位解释每个组件的新位置。
4. 后续把本契约与“市场状态转移契约”连接，研究生产进入公共市场后的完整闭环。
