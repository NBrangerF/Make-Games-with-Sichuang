# 竞价、拍卖、市场定价与价值发现：研究包 01

- 状态：可进入内容实现（仍需中文新手可用性验证）
- 完成日期：2026-08-20
- 研究目标：把“选一种拍卖形式”改写成新手能执行、能比较、能被测试推翻的拍卖协议。
- 证据边界：本报告组合正式规则、设计师/出版实践、玩家长评与讨论、拍卖理论和实验研究。经济实验不等同桌游；单一作品与玩家讨论不能提供通用最佳参数。

## 1. 研究问题

1. 拍卖品为何有价值：私人价值、共同价值、相互依赖价值、转售、阻断、计分与时机会怎样改变估值？
2. 竞价渠道怎样揭示或隐藏信息，并把时间、算术、记忆、表达与社交压力分配给不同玩家？
3. 分配规则、支付规则、落败成本、资金去向、储备价、并列与流拍怎样改变激励？
4. 预算、出价工具、库存、回合和终局怎样抑制失控升级，并让拍卖服务于更大的游戏？
5. 反馈、经验、人数与沟通怎样影响学习、赢家诅咒、合谋和参与可达性？

## 2. 先给设计者的结论

### 2.1 拍卖不是“英式 / 暗标 / 一口价”的单选题

一场可执行的拍卖至少要同时写清：拍卖标的、价值来源、已知信息、竞价协议、分配规则、支付规则、资金去向、退出/流拍、并列、结果反馈，以及它怎样接回整局经济。只换公开升价与暗标，不能隔离这些变量。

《Modern Art》在同一经济里使用公开升价、一次报价、暗标、固定价和双件拍卖；钱有时流向卖家，有时由卖家自己买入而流向银行；拍品又会改变当轮艺术家排名及以后轮次的价值。[官方规则](https://www.cmon.com/wp-content/uploads/2023/06/MA_Rulebbok_Artbook_v18-low.pdf) 因此“拍卖方式”必须和价值形成、卖方权限、支付目的地及后续市场一起记录。

### 2.2 先写价值来自哪里，再谈玩家是否“理性”

私人价值是拍品对各人的效用可不同且主要由自己知道；共同价值是未知真实价值对所有人相同；现实与桌游常混合为相互依赖价值：自己的路线、套装与能力影响价值，同时他人持有、未来供给和市场结果也影响它。[Yale ECON 159 Lecture 24](https://oyc.yale.edu/economics/econ-159/lecture-24)

《Modern Art》的画作价值由本轮被推出的艺术家数量共同生成，且历史排名会累积；《The Estates》拍品的价值依赖玩家拥有的公司、即时放置和未来建筑是否完成；《For Sale》先买房、再把房产同时匹配到支票，买入价值来自下一阶段而非卡面。[Modern Art 规则](https://www.cmon.com/wp-content/uploads/2023/06/MA_Rulebbok_Artbook_v18-low.pdf)、[The Estates 规则](https://www.ultraboardgames.com/the-estates/game-rules.php)、[For Sale 出版页](https://www.eagle-gryphon.com/products/for-sale)

项目推论：测试表不能只记录“愿意出多少钱”，还要让玩家标注价值构成——直接得分、组合、位置、阻断、转售、节省行动、信息或情绪目标。否则同一个高价可能是准确估值、战略加价、预算约束、报复或误解。

### 2.3 出价不是估值的直接读数

在独立私人价值、二价密封拍卖等强假设下，真实报价才有弱占优性质；一价拍卖通常要求压价（bid shading），公开升价又会在共同价值环境中揭示他人信息。收入等价也依赖风险中性、独立同分布等假设，不能当桌游拍卖可互换的证明。[Yale ECON 159 Lecture 24](https://oyc.yale.edu/economics/econ-159/lecture-24)

项目推论：原型记录至少分开“玩家给拍品的最高主观价值”“实际出价”“支付”“后来兑现价值/得分”“当时解释”。不要把成交价直接当作品的客观价值。

### 2.4 赢家诅咒有边界，不是“买贵了”的漂亮说法

赢家诅咒首先是共同价值且估值含噪声时的选择问题：最乐观的估计者最容易赢，条件于获胜后，估计往往偏高。Thaler 用罐中硬币等例子梳理了这一现象。[The Winner's Curse](https://www.aeaweb.org/articles?id=10.1257%2Fjep.2.1.191&page=604)

私人价值场景里，付得比后来“看起来划算”更多，可能是预算错误、策略压价失败、否认价值、节奏收益或情绪升级，不能自动归为赢家诅咒。《Cash》的 eBay 田野设计还观察到超出经典赢家诅咒解释的高报价，提醒我们保留多种机制解释。[The Bidder's Curse](https://eml.berkeley.edu/~ulrike/Papers/bidderscurse19.pdf)

### 2.5 支付对象会改写整局经济

钱付给银行会销毁购买力；付给卖家会把购买力转移给另一竞争者；付给最高出价者作为补偿则会使卖方“保留拍品”和“放给别人”成为二次决策。《The Estates》中拍卖师可以把物品卖给最高出价者并收钱，也可保留物品并向最高出价者支付同额；全员不出价时可免费取得。[规则](https://www.ultraboardgames.com/the-estates/game-rules.php)

项目推论：拍卖测试要做资金流账本，不只记录赢家。至少记录付款者、收款者/银行、落败者成本、拍卖后每人的可用预算与下一次竞价能力。

### 2.6 落败者是否付费，是升级与参与的主变量

赢家支付、全支付、部分补偿和不可撤回的筹码，会产生不同的虚张声势、抬价风险与未来选择。《High Society》中在正面拍品拍卖里，落败者收回钱，赢家弃掉出价；但负面牌竞价一旦有人退出，该玩家拿负面牌，其他人的已出资金全部弃掉。[官方规则](https://www.ospreypublishing.com/media/1fohbutt/hisoc_rulebook_for_web.pdf)

同一作品也显示“出价工具”不等于普通数字：玩家只能继续加新的固定面额牌，已经放下的牌不能替换，赢后这些面额永久消失。其可访问性长评指出，这会把算术、组合规划、隐藏记忆和未来最小加价绑定在一个动作上。[Meeple Like Us 长评](https://www.meeplelikeus.co.uk/high-society-1995-accessibility-teardown/)

### 2.7 储备价、并列、全员不出价与流拍都是策略状态

《High Society》全员不出价时，最后留在竞价中的玩家免费拿牌；《Modern Art》某些形式下拍卖师可免费拿走无人出价的画；《QE》并列会重拍，三次仍并列后让最高非并列报价获胜，三人最后一轮并列则无人取得。[High Society 规则](https://www.ospreypublishing.com/media/1fohbutt/hisoc_rulebook_for_web.pdf)、[Modern Art 规则](https://www.cmon.com/wp-content/uploads/2023/06/MA_Rulebbok_Artbook_v18-low.pdf)、[QE 规则](https://cdn.1j1ju.com/medias/d8/60/b3-qe-rulebook.pdf)

实验研究显示，储备价在允许拍前贿赂退出的一价密封实验中降低了平均贿赂和成功率，但同时改变效率与剩余分配；这只能支持“储备价可同时影响合谋与分配”的诊断，不能给桌游一个最佳储备价。[Deterring collusion with a reserve price](https://www.cambridge.org/core/journals/experimental-economics/article/abs/deterring-collusion-with-a-reserve-price-an-auction-experiment/DCA85B34E8B60950078E61C584CC736E)

### 2.8 限制预算和竞价工具可以稳定升级，也会创造时间经济

Reiner Knizia 以《Medici》说明拍卖容易因滚雪球与过价失稳，而有限货舱让玩家不能无条件继续收货，并迫使玩家比较当前批次与未来机会。[设计师访谈](https://www.wargamer.com/medici/reiner-knizia-auction-board-games) 《Ra》的固定太阳圆盘既是公开、不可细分的报价工具，赢家又会把自己的圆盘换到桌面中央供未来竞拍者取得，形成跨轮可见的竞价库存。[官方规则 PDF](https://images.zmangames.com/filer_public/1c/f1/1cf1f19e-70bb-413f-8756-13e1e5239b8a/kn27_ra_rulebook_eng.pdf)

项目推论：预算上限不只是“平衡用钱”，还决定最小加价、可表达价格、谁能威胁抬价、何时退出，以及今天花掉一种面额后明天还能否参与。

### 2.9 结果反馈比“多玩几局”更值得单独设计

赢家诅咒学习研究指出，重复经验本身未必带来明显改进，相关反馈与经验类型会影响学习。[Learning to Avoid the Winner's Curse](https://www.sciencedirect.com/science/article/pii/S0749597896900722) 共同价值拍卖实验也区分选择、亲身经验和观察学习。[Learning in common value auctions](https://www.sciencedirect.com/science/article/pii/0167268194901058)

《QE》大部分玩家只知道自己是否获胜而看不到赢家报价，五人局每人整局仅有一次查看权；这种信息制度本身就是学习速度与推断内容的一部分。[QE 规则](https://cdn.1j1ju.com/medias/d8/60/b3-qe-rulebook.pdf)

项目推论：测试中预先决定反馈级别：只公布赢家、公布成交价、公布所有报价、公布拍品实现价值、或保留到回合末。改变反馈时不要同时改变支付规则。

### 2.10 拍卖也会分配无障碍负担

公开口头升价偏向能快速计算、插话和承受社交压力的人；暗标减少插话竞争，却可能增加书写、隐藏操作、同时提交和结果比较负担。《Modern Art》的无障碍长评指出，其隐藏现金、卡牌识别与握拳同时揭示均可成为障碍，而同时揭示本身可用信封或容器替代，不必把动作表演误认作核心机制。[Meeple Like Us 长评](https://www.meeplelikeus.co.uk/modern-art-1992-accessibility-teardown/)

项目推论：把竞价当任务链测试：识别拍品 → 读取自己预算 → 形成估值 → 选择合法出价 → 提交/撤回 → 读取结果 → 更新未来预算。记录谁需要口算、记忆他人资金、抢话、精细拿取、隐藏书写或同时动作；必要时提供等价的报价牌、计算辅助、公开弃牌、容器或顺序提交。

## 3. 拍卖协议契约

每个原型版本用一页写清以下字段：

1. **目标压力**：希望玩家在当前收益、未来预算、阻断、信息或风险之间做什么取舍？一种不可接受的失败是什么？
2. **标的与价值**：竞拍什么；谁拥有；直接/组合/位置/转售/阻断价值；私人、共同或相互依赖；玩家知道哪些信号。
3. **竞价协议**：谁开拍；顺序或同时；公开或隐藏；最小加价；可以加价几次；能否撤回；能否出零；谁可旁观/沟通。
4. **分配与支付**：谁获得标的；付多少（自己的出价、第二价、固定价等）；钱给谁；落败者付什么；预算和出价工具何时返回或销毁。
5. **边界状态**：并列、全员不出价、未达储备、流拍、非法出价、玩家暂离、无法同时动作分别怎样处理。
6. **反馈与接回整局**：公开哪些报价和兑现价值；拍卖怎样改变下一轮预算、库存、先手、市场、结束与胜负。

## 4. 测试记录：不要只记成交价

每场至少记录：

- 拍品、可见信号、每人主观最高价值及构成；
- 每轮报价、退出点、支付、资金接收者、落败成本；
- 赢家后来实现的价值/得分，以及是否出现不可逆的未来预算损失；
- 并列、零报价、流拍、储备未达、非法报价和规则争议；
- 玩家为何偏离自己的估值：压价、阻断、试探、抬价、报复、忘记预算、误解或社交压力；
- 各玩家完成任务链的时间、帮助、算术、记忆、表达与动作负担；
- 下一版只改一个变量，并预写支持信号与反驳信号。

## 5. 来源矩阵（22 项）

| 来源 | 类型 / 阅读深度 | 支持的用途 | 不能推出 |
|---|---|---|---|
| [Modern Art 官方规则](https://www.cmon.com/wp-content/uploads/2023/06/MA_Rulebbok_Artbook_v18-low.pdf) | 正式规则 / 全文 | 五种竞价、卖方、资金流、内生市场、历史价值 | 哪种形式普遍最好 |
| [High Society 官方规则](https://www.ospreypublishing.com/media/1fohbutt/hisoc_rulebook_for_web.pdf) | 正式规则 / 全文 | 不可撤回面额、赢家付费、负面全支付、贫者淘汰 | 玩家偏好或公平阈值 |
| [Ra 官方规则](https://images.zmangames.com/filer_public/1c/f1/1cf1f19e-70bb-413f-8756-13e1e5239b8a/kn27_ra_rulebook_eng.pdf) | 正式规则 / 规则级 | 固定竞价工具、一次绕行、太阳圆盘跨轮交换 | 固定筹码必然更平衡 |
| [The Estates 规则](https://www.ultraboardgames.com/the-estates/game-rules.php) | 规则转录 / 全文 | 拍卖师保留或出售、补偿支付、即时放置 | 出版商官方措辞或体验质量 |
| [QE 规则](https://cdn.1j1ju.com/medias/d8/60/b3-qe-rulebook.pdf) | 规则 PDF / 全文 | 无上限暗标、有限价格反馈、并列重拍与无人取得 | 无上限出价对所有群体有效 |
| [For Sale 出版页](https://www.eagle-gryphon.com/products/for-sale) | 出版介绍 / 页面级 | 买入和卖出两阶段、价值兑现延迟 | 完整竞价细则或效果因果 |
| [Medici 设计师访谈](https://www.wargamer.com/medici/reiner-knizia-auction-board-games) | 设计师访谈 / 全文 | 失控风险、货舱约束、拍卖互动 | 约束变量的独立因果 |
| [Trinket Trove 设计日志](https://boardgamegeek.com/blog/1/blogpost/175683/designer-diary-trinket-trove) | 设计日志 / 全文 | 用同时竞价减少等待、卡牌既出价又影响选取顺序 | 同时行动一定更快或更易达 |
| [High Society 无障碍长评](https://www.meeplelikeus.co.uk/high-society-1995-accessibility-teardown/) | 专家长评 / 全文 | 面额组合、隐藏记忆、情绪与身体任务 | 残障群体发生率或普遍偏好 |
| [Modern Art 无障碍长评](https://www.meeplelikeus.co.uk/modern-art-1992-accessibility-teardown/) | 专家长评 / 全文 | 隐藏现金、卡牌识别、同时揭示的替代操作 | 单一替代方案适合所有人 |
| [Yale ECON 159 Lecture 24](https://oyc.yale.edu/economics/econ-159/lecture-24) | 公开课程 / 全文 | 价值类型、公开/密封、一价/二价、压价与假设 | 直接给桌游趣味或参数 |
| [Thaler: The Winner's Curse](https://www.aeaweb.org/articles?id=10.1257%2Fjep.2.1.191&page=604) | 学术综述 / 全文 | 共同价值选择效应与边界 | 所有买贵现象都叫赢家诅咒 |
| [Learning to Avoid the Winner's Curse](https://www.sciencedirect.com/science/article/pii/S0749597896900722) | 实验论文 / 摘要级 | 相关反馈与经验类型值得分开 | 桌游最佳反馈量 |
| [Learning in common value auctions](https://www.sciencedirect.com/science/article/pii/0167268194901058) | 实验论文 / 摘要级 | 选择、亲身和观察学习 | 熟人桌游的学习速度 |
| [Deterring collusion with a reserve price](https://www.cambridge.org/core/journals/experimental-economics/article/abs/deterring-collusion-with-a-reserve-price-an-auction-experiment/DCA85B34E8B60950078E61C584CC736E) | 实验论文 / 摘要级 | 储备价可同时改变合谋、效率与剩余 | 通用储备价公式 |
| [The Bidder's Curse](https://eml.berkeley.edu/~ulrike/Papers/bidderscurse19.pdf) | 田野实验 / 论文级 | 超越经典赢家诅咒的过价机制 | eBay 行为等同同桌竞价 |
| [自然市场中的赢家诅咒](https://www.nber.org/papers/w13072) | 田野研究 / 摘要级 | 熟悉角色的经验可改变结果 | 经验一定消除桌游误价 |
| [BGG：How to Design Auction Games](https://boardgamegeek.com/blog/17011/blogpost/183257/how-to-design-auction-games-a-strategic-analysis-o) | 玩家/设计博客 / 摘要级 | 拍品、货币、方式三类检查入口 | 新近单篇博客代表共识 |
| [Reddit：如何判断拍卖价值](https://www.reddit.com/r/boardgames/comments/eyut2i) | 玩家讨论 / 讨论级 | 估值困难、赢家诅咒、落败成本症状 | 机制效果比例或共识 |
| [Reddit：拍卖机制讨论日](https://www.reddit.com/r/boardgames/comments/1r18h2a/lets_talk_mechanisms_day_3_auctions/) | 玩家讨论 / 讨论级 | 多种形式与不同偏好反例 | 代表性排名 |
| [Reddit：拍卖会不会吞掉整款游戏](https://www.reddit.com/r/BoardgameDesign/comments/ufsuzo) | 设计社区讨论 / 讨论级 | 拍卖主导小体量游戏的症状 | 机制必然失衡 |
| [Reddit：QE 的估值与失控体验](https://www.reddit.com/r/boardgames/comments/erz2jy) | 玩家症状 / 讨论级 | 缺少估值锚点、极端报价的体验假设 | QE 玩家总体意见 |

## 6. 主张台账

| Claim ID | 置信度 | 主张 | 关键反例 |
|---|---|---|---|
| `claim-auction-needs-complete-protocol` | 高 | 拍卖由价值、信息、竞价、分配、支付、边界与反馈共同定义。 | 纯粹比较两种按钮时可冻结其余字段。 |
| `claim-value-model-precedes-format` | 高 | 先区分私人、共同与相互依赖价值。 | 纯固定收益仍需记录阻断与预算价值。 |
| `claim-bid-is-not-direct-valuation` | 高 | 报价受格式、预算、压价、信息和社交策略影响。 | 强假设下二价私人价值拍卖可接近诚实报价。 |
| `claim-winners-curse-has-common-value-boundary` | 高 | 赢家诅咒需要共同/相关价值与估值噪声边界。 | 私人价值的后悔可来自其他机制。 |
| `claim-payment-destination-reshapes-economy` | 高 | 付款给银行、卖家或对手会改变后续购买力。 | 一次性终局拍卖可弱化跨轮影响。 |
| `claim-loser-cost-shapes-escalation` | 高 | 落败是否付费改变抬价、退出与未来参与。 | 无预算延续的单轮仪式效果较小。 |
| `claim-auction-boundary-states-are-strategic` | 高 | 储备、并列、流拍和零报价不是边角条款。 | 数学保证不会发生的状态可省略。 |
| `claim-bid-instruments-create-temporal-economy` | 中 | 固定面额、库存和容量既稳定升级，也限制未来表达。 | 可无限兑换的同质货币削弱此效应。 |
| `claim-auction-feedback-shapes-learning` | 中 | 重复不保证学习；可见反馈和经验类型需单独设计。 | 经验玩家可凭外部模型学习。 |
| `claim-auction-integration-needs-functional-link` | 中 | 拍卖应改变整局中的预算、库存、位置、时机或胜负，而非自转。 | 纯拍卖作品本身就是核心系统。 |
| `claim-bidder-count-and-communication-affect-collusion` | 中 | 人数、旁观与沟通会改变压价/合谋机会。 | 实验合谋不能直接预测朋友桌。 |
| `claim-bid-channel-allocates-access-burdens` | 高 | 公开/隐藏、顺序/同时把算术、记忆、表达、动作与压力分配不同。 | 目标群体明确同意快速表演时可保留。 |

## 7. 下一步

1. 将 20 项来源与逐项评估录入内容层。
2. 将 12 条 Claim、15 个规范词条、专题指南与策展入口接入网站。
3. 用三种原型做中文新手任务测试：公开升价、暗标、固定筹码一次报价；每轮只改变一个协议字段。
4. 浏览器运行时恢复后补做桌面/移动端、键盘、筛选与详情联动 QA；在此之前只声称机器校验与构建通过。
