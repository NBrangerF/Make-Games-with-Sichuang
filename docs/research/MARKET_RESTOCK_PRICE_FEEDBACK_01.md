# 市场补货、动态定价与供需反馈：研究包 01

更新时间：2026-08-20  
状态：可进入内容实现；仍需中文新手和真实桌面任务验证

## 研究问题

1. 市场中的“供给”由哪些独立参数构成：来源、数量、补货时点、位置与淘汰？
2. 买卖怎样改变价格：逐件还是批量、交易前还是交易后、统一价还是边际价？
3. 行动顺序、库存容量与囤积怎样改变后续玩家的可选项？
4. 哪些延迟和反馈会形成短缺、滞销、振荡或失控，哪些机制只是遮住症状？
5. 公开市场在真实桌面上是否可读、可算、可回溯？

## 结论摘要

### 1. 市场是状态转移，不是一条价格轨

正式规则案例共同显示，一次交易至少会读取当前货物、价格、行动者权限和容量，再改变库存、资金、价格、市场位置或下一次补货。Power Grid 把价格绑定到资源格，并让玩家购买量、有限组件、玩家人数和游戏阶段共同影响回合末补货；Clans of Caledonia 则在买卖后按数量移动价格，并让商人停留到下一轮。两者都不能被准确压缩成“买涨卖跌”。[1][2]

因此原型应先写状态字段与事件顺序，再调价格数字。价格是状态的一部分，补货、库存和时点同样是规则。

### 2. 数量与时点必须分开

“每轮补 4 个”仍缺少至少四项信息：在哪个阶段补、按何顺序放、放到哪些价位、组件不足时怎么办。Power Grid 的补货表随人数与阶段变化，并从高价空位开始填；Century 的卡牌市场在取牌后左移补一张，玩家把资源放到跳过的卡上。两种系统都在控制供给，但它们给下一位玩家留下的状态完全不同。[1][3]

设计含义是：补货量、补货节奏、位置拓扑、淘汰/轮换和存量上限要分别记录，不能只用一个“市场规模”参数代表。

### 3. 价格移动的时点本身就是激励

Clans of Caledonia 先按当前价格结算一笔批量交易，再按数量移动价格；同一回合中的港口行动又可先操纵价格。由此可以推断，交易前移动、逐件移动和整批后移动会给大单、抢先、分拆交易和价格操纵不同价值。[2] 这是一项从规则结构得出的设计推论，不是该游戏效果的独立实验结论。

Mars Needs Mechanics 的设计师访谈把近期购买频率当作需求信号、牌库出现频率当作供给信号，并报告不同人数对市场控制感不同；作者同时明确，八张市场牌只是该项目测试出的局部结果。[6] 所以人数适配应验证“每位玩家每次行动前看见多少次市场事件”，而不是线性乘价格幅度。

### 4. 滞销品至少有四类不同修复

设计文章中的常见手段包括：自动淘汰最旧/最左项目、让卡牌随位置降价、把跳过成本留在旧牌上、给项目累积补贴、提供静态保底市场，或接受等待。[7][9] 这些手段改变的并不是同一个变量：

- 自动淘汰改变可见供给与牌库遍历速度；
- 位置降价改变等待的机会成本；
- 累积补贴改变项目的净收益，却不一定解决玩家当下付不起的问题；
- 玩家付费刷新把成本交给当前受限者，并可能让后手受益；
- 静态保底减少无合法选择，却可能稀释动态市场的压力。

因此“市场卡住了”必须先分为无人想要、无人买得起、当前策略无关、刷新成本归属不合理、或信息负担太高。[7][20][22]

### 5. 公开不等于可理解

Through the Ages 的无障碍长评指出，十三张高频轮换的公开卡列需要与本地行动、手牌、资源空间价值和他人状态交叉读取；公开信息仍可产生视觉、记忆和算术负担。[10] Century 的玩家讨论又提供两种具体症状：玩家忘记把资源留在跳过的牌上，或认为付出整次行动刷新会替后手创造价值。[20][21] 这些材料没有发生率，却足以生成可用性任务：玩家能否从真实座位说出当前价格、交易后价格、补货后状态和下一位玩家的合法选项。

### 6. 实验经济学给边界，不给桌游配方

课堂双向拍卖的大样本汇总显示，在标准化实验中价格可接近竞争均衡，同时交易顺序和连续价格变化仍有结构。[11] 边界实验则显示，少数交易者、市场势力、交易制度、冲击来源、报价成本和反馈信息都可能改变收敛速度、价格方差或交易量。[12][13][14][18]

Beer Distribution Game 相关研究强调：局部信息、订货延迟、库存/欠单成本和界面反馈共同塑造振荡与决策难度。[16] 这些都是相邻领域证据。它们支持设计师测试延迟、反馈和角色信息，却不能证明娱乐桌游必须追求均衡、效率或稳定价格。

## 可执行框架：市场状态转移契约

### A. 写目标压力与失败边界

先说明市场要制造的取舍：现在买还是等、囤货还是使用、帮助市场流动还是阻断他人。再写不可接受结果，例如“首轮短缺后连续三轮没有合法购买”或“玩家无法从组件读出本次成交价”。

### B. 画市场对象和补货协议

记录市场槽位、每槽容量、供给来源、进入顺序、补货时点、轮换/淘汰、组件耗尽、人数与阶段调整。静态保底和动态市场应分别标注。

### C. 写一笔交易的精确顺序

按步骤写资格、选择商品、选择数量、检查容量、确定价格、支付/收款、移动库存、移动价格、触发效果、补货、交接。注明批量按统一价还是逐件边际价。

### D. 追踪一个单位和三个异常状态

追踪一单位从来源到市场、玩家库存、使用/转售、消耗池或计分区。至少演一次短缺、过剩和滞销；再观察囤积、容量与后手可选项。

### E. 用事件记录只改一个变量

每次市场事件记录交易前状态、行动者、买卖/跳过数量、成交价、价格移动时点、剩余存量、持有量、补货、下一位选项、滞销年龄和理解错误。下一版只改补货量、时点、价格步幅、容量、轮换、补贴或信息呈现中的一项。

## 不应越界的结论

- 没有证据给出通用的市场槽位数、补货量、价格步幅、容量、刷新频率或可接受波动率。
- 价格稳定、接近均衡或交易效率高，不等于游戏更有趣、更公平或更符合主题。
- 自动刷新、补贴和位置降价不是可互换修复；它们改变不同成本与受益者。
- 玩家人数不能只映射到补货数量；行动顺序、事件密度、市场控制感和读表负担都需单独验证。
- 社区症状没有代表性；无障碍长评不能替代目标参与者测试。

## 来源矩阵

| # | 来源 | 角色 | 本报告用途 | 边界 |
|---|---|---|---|---|
| 1 | [Power Grid: Recharged Rulebook](https://meepletron-storage.s3.us-east-2.amazonaws.com/resources/power-grid-recharged-rulebook.pdf) | 规则级镜像 | 价格格、有限资源、容量、人数/阶段补货 | 多变量商业系统；镜像而非出版者站点 |
| 2 | [Clans of Caledonia Rulebook](https://cdn.1j1ju.com/medias/17/ed/42-clans-of-caledonia-rulebook.pdf) | 规则级镜像 | 买卖后移价、批量结算、商人占用、价格操纵 | 不证明设计效果因果 |
| 3 | [Century: Spice Road Rules](https://papmajor.dk/wp-content/uploads/EN-Century-Spice-Road-Rules-2017-08-02.pdf) | 规则级镜像 | 卡列左移、跳过成本、容量 | 本轮以可检索规则摘录复核 |
| 4 | [Container](https://store.asmodee.com/products/container) | 出版者概览 | 玩家生产、定价、谈判和多段转售 | 无逐步规则细节 |
| 5 | [Brass: Birmingham Rulebook](https://fgbradleys.com/wp-content/uploads/Brass-Birmingham-Rulebook.pdf) | 规则级镜像 | 外部煤铁市场与资源移动案例 | 本轮页面受保护，文章级 |
| 6 | [Meaningful Decisions: Ben Rosset](https://cardboardedison.com/blog/meaningful-decisions-ben-rosset) | 设计师访谈 | 购买频率/牌库频率信号、人数控制感、局部甜点值 | 单项目多变量实践 |
| 7 | [Design Discussion: Stale Markets](https://chrisbeckdesign.com/2021/11/20/design-discussion-stale-markets/) | 设计师博客 | 自动刷新、玩家刷新、补贴、等待的成本归属 | 规范性实践文章 |
| 8 | [Monsoon Market variables](https://danielsolisblog.blogspot.com/2014/05/revising-constants-and-variables-in.html) | 设计师原型日志 | 分开稀有度、需求、供给；避免同时测试过多变量 | 单次原型迭代 |
| 9 | [Dynamic markets and Dutch auctions](https://www.skeletoncodemachine.com/p/dutch-auctions) | 机制分析博客 | 静态/动态、淘汰、补贴、刷新时点案例 | 二手机制比较 |
| 10 | [Through the Ages Accessibility Teardown](https://www.meeplelikeus.co.uk/ages-new-story-civilization-2015-accessibility-teardown/) | 专家长评 | 高频卡列、空间价值与交叉读取负担 | 单一评者/版本 |
| 11 | [2,000 classroom experiments](https://authors.library.caltech.edu/records/1ytq0-24n12) | 实验汇总 | 双向拍卖的重复性、价格与交易顺序 | 课堂经济实验；作者披露商业关系 |
| 12 | [Double Auction: Complete Information and Market Power](https://epublications.marquette.edu/econ_fac/580/) | 实验论文摘要 | 市场势力边界 | 摘要级；非娱乐桌游 |
| 13 | [Nonstationary supply and demand](https://www.sciencedirect.com/science/article/pii/0167268193900049) | 实验论文摘要 | 制度与冲击来源影响价格跟踪 | 摘要级 |
| 14 | [Transaction and offering costs](https://authors.library.caltech.edu/records/fnhzb-n0e58) | 实验论文摘要 | 报价摩擦减慢价格发现 | 相邻经济实验 |
| 15 | [A Double Auction Market](https://elischolar.library.yale.edu/cowles-discussion-paper-series/1719/) | 教学/讨论论文 | 用卡片构造市场过程模型 | 教学目的，不是设计成效试验 |
| 16 | [Outcome Feedback for Dynamic Decision Making](https://proceedings.systemdynamics.org/1999/PAPERS/PARA98.PDF) | 相邻动态决策研究 | 延迟、局部信息、反馈界面和振荡 | 旧研究且含电脑化模拟 |
| 17 | [Dynamic Pricing under Capacity Constraints](https://ideas.repec.org/a/gam/jgames/v9y2018i1p10-d132752.html) | 实验论文摘要 | 稀缺容量、连续定价与买卖响应 | 摘要级经济实验 |
| 18 | [Competition with indivisibilities and few traders](https://www.cambridge.org/core/journals/experimental-economics/article/competition-with-indivisibilities-and-few-traders/F0BA414399820BDC102B3FA31B189253) | 实验论文 | 少数交易者、市场势力、交易顺序和学习 | 制度化实验，不给桌游阈值 |
| 19 | [Economy balancing](https://www.gamedeveloper.com/design/the-trials-and-tribulations-of-balancing-your-in-game-economy) | 从业文章 | Power Grid 库存与战术、自由市场过剩症状 | 二手设计文章 |
| 20 | [Century stale market discussion](https://www.reddit.com/r/boardgames/comments/bmf5sp) | 玩家讨论 | 玩家刷新成本与后手获益症状 | 自选社区，无代表性 |
| 21 | [Century skipped-card cube error](https://www.reddit.com/r/boardgames/comments/wmmqk9) | 玩家讨论 | 跳过资源留置的理解错误 | 单一帖子 |
| 22 | [Stale trade row disagreement](https://boardgamegeek.com/thread/3125219/idea-of-how-to-unclog-the-trade-row) | 玩家讨论 | “系统堵塞”与“策略/牌组适配”相反解释 | 无共识和发生率 |

## 深读记录

- Power Grid：逐页核对资源购买、存量上限、回合末补货表、组件不足与阶段转换。
- Clans of Caledonia：逐页核对商人占用、批量交易、结算后移价、人数差异与先操纵后交易。
- Stale Markets：完整读取四类处理及其成本归属，不把作者偏好写成效果证明。
- Dynamic markets and Dutch auctions：完整读取静态/动态区分、淘汰、补贴和按回合/按行动刷新案例。
- Through the Ages accessibility teardown：深读卡列轮换、视觉、记忆、空间数值与算术任务段落。

## 下一步

1. 把本研究落为站内专题指南、术语、Claim 与资源入口。
2. 用中文新手完成一次纸面任务：交易前读表、执行一笔交易、补货、说出下一位合法选择。
3. 分别测试 2 人与 4 人的“市场事件密度”，不只比较最终价格。
4. 把浏览器 QA 继续保持为独立阻塞项，机器验证不能替代真实浏览器交互。
