# 专项研究 07：决定空间、玩家互动与可重玩性

状态：review  
最后核验：2026-08-17

## 研究问题

新手常把“更多选项”“更多互动”“更多随机设置”和“更复杂规则”分别当成有意义选择、互动性、可重玩性与策略深度。它们最多是候选输入，不能直接替代玩家在具体局面中的实际决定。本站因此把研究问题改写为：玩家在一个时刻看见什么、真正比较什么、选项为何退出考虑、他人的行动经由哪条规则改变状态、后果何时可见，以及这次反馈是否更新了下一次判断。

## 1. 选项数量不等于决定质量

**来源事实。** Mark Rosewater 在 [Decisions, Decisions, Part I](https://magic.wizards.com/en/news/making-magic/decisions-decisions-part-i-2009-07-27) 中提醒，增加决定不是纯收益；Steve Hoffman 在 [Improving Player Choices](https://www.gamedeveloper.com/design/improving-player-choices) 中用后果、取舍，以及显然、信息不足或空洞的决定讨论选择质量。两者都是设计师实践文章，且分别以 *Magic* 和数字游戏为主要语境，不是普遍效果研究。[Meaningful Choice, Decision, Agency?](https://ualresearchonline.arts.ac.uk/id/eprint/26132/) 的仓储页提出概率/可能性空间与表达性选择问题，但本轮只取得摘要与元数据，不能引用正文模型。

**项目推断。** 资源网站不显示“每回合有 N 个决定”或“分支数越大越好”。工具分开记录规则允许的合法选项和玩家实际考虑的选项，并把第一次缩减标记为显然更差、后果相同、信息不清、不可支付、负担过重、被封锁、未进入考虑或其他。分类是检索入口，不是失败原因的自动诊断。

## 2. 新手可能使用快速而浅的目标导向推演

**来源事实。** 2026 年 Nature 论文 [People Use Fast and Flat Simulation to Reason About New Games](https://pubmed.ncbi.nlm.nih.gov/42457994/) 报告了超过 1000 名参与者、121 款多数对参与者陌生的双人策略棋盘游戏；摘要和图表支持“快速、浅层/扁平、目标导向且带概率性的推演”这一描述。本轮只完成文章级审阅，没有把 PubMed 摘要冒充全文。

**边界。** 研究对象主要是可形式化的双人抽象策略游戏，不能直接代表谈判、合作、隐藏信息、身体操作、长期关系或专家长期学习。

**产品建议。** 新手工具先冻结一个决定时刻和当前目标，再记录当时信息与行动前预测；不要求玩家画完整博弈树，也不把未口述的思考判为不存在。

## 3. 策略深度不是规则复杂度

**来源事实。** Lantz 等人的 [Depth in Strategic Games](https://www.nealen.net/papers/Lantz2017Depth.pdf) 把深度描述为游戏持续吸收问题求解注意、支持长期学习的能力，并明确把论文定位为形式化模型与研究议程。[Going Deep on Depth in Games](https://www.decisionspacepodcast.com/articles/going-deep-on-depth-in-games) 从玩家/实践角度区分规则颗粒感、复杂度与持续深度；[Depth & Replayability in Tabletop Games](https://bumblingthroughdungeons.com/depth-replayability-in-tabletop-games/) 同样反对用规则、组件或行动数量直接代理深度。后两篇是实践/玩家分析，不是学术共识。

**项目推断。** 单条轨迹只能证明一个玩家在一个版本和局面里怎样更新模型，不能计算整款游戏的策略深度。长期深度需要跨多局、不同经验层的学习轨迹与策略变迁证据。

## 4. 互动要能写出“影响路径”

**来源事实。** Gil Hova 的 GDC 幻灯片 [Why Indirect or Zero Player Interaction Can Be Great](https://ubm-twvideo01.s3.amazonaws.com/o1/vault/gdc2019/presentations/Hova_Gil_Why_Indirect_Zero.pdf) 把互动操作化为改变另一玩家游戏状态的能力，并区分个人、全局与邻接尺度；他也明确说明直接/间接不是价值判断。Bruno Faidutti 在 [Indirect Interaction](https://faidutti.com/blog/blog/2022/04/27/indirect-interaction/) 中提出反例：大家共享同一骰子结果可能只是共享随机，而未必构成玩家之间的互动。两者是设计师立场，分歧本身比单一定义更有价值。

**产品建议。** 只问“谁的什么行动，经由哪条规则关系，改变了谁的状态或可行选项”。允许留空：一个决定没有他人影响，不自动意味着设计较差。

## 5. Kingmaking 是关系设计与社交契约的冲突点

**来源事实。** Cole Wehrle 在 GDC 演讲 [King Me](https://www.gdcvault.com/play/1025683/board-game-design-day-king) 中为 kingmaking 的关系性、叙事性价值辩护；[Oath 访谈](https://www.tabletopgaming.co.uk/features/oath-an-interview-with-cole-wehrle/) 展示了正式胜利条件、非正式交易、伤害对手机器和跨局后果怎样组合。[Skeleton Code Machine 的综合](https://www.skeletoncodemachine.com/p/kingmaking) 同时呈现社交契约风险和 Wehrle 的辩护。这些都是立场与项目案例，没有提供玩家群体发生率或偏好比例。

**项目推断。** 站点不把 kingmaking 自动列为缺陷或美德。测试记录必须包含目标体验、玩家预期、关系语境、退出/安全边界，以及被影响玩家是否仍有可理解的行动空间。

## 6. 目标结构改变取舍出现的位置

**来源事实。** Decision Space 的 [Three Types of Objectives](https://www.decisionspacepodcast.com/articles/the-three-types-of-objectives-in-games) 用 solitary、juxtaposed、overlaid 描述目标关系；[Types of Decision Spaces](https://www.decisionspacepodcast.com/articles/types-of-decision-spaces-waxing-waning-static-dynamic) 用 waxing、waning、static、dynamic 描述决定空间随游戏推进的形状。这是一套玩家/实践词汇，不是行业标准量表。

**产品建议。** 把这些词保留在概念词表用于比较案例，不让用户选完类型就得到机制处方。

## 7. 可重玩性不等于变化量

**来源事实。** Daniel Piechnick 在 [Replayability](https://daniel.games/replayability/) 中主张，变化只有在改变策略评价时才有意义；Oliver Kinne 的 [Variable Replayability](https://therewillbe.games/articles-essays/8942-variable-replayability) 从玩家角度明确区分 variability 与 replayability。两篇都是实践启发式。

[On the Harmfulness of Secondary Game Objectives](https://grail.cs.washington.edu/projects/game-abtesting/fdg2011/) 在两款 Flash 游戏、超过 27000 名玩家的 A/B 测试中发现，次要目标可能帮助长期玩家，也可能使许多人更早退出。本轮完成论文页与摘要级审阅；在线教育/益智游戏的时长、进度和返回率不能直接等同实体桌游乐趣、深度或重玩意愿。

**项目推断。** 可重玩性需要问：新局面是否改变玩家要学习、预测或权衡的关系，以及目标玩家是否愿意再次进入。随机地图、卡组数量和可变能力只记作变化来源，不直接计分。

## 8. 网站转译：单轮决定轨迹

工具输出 16 个字段：版本、反馈可见时机、玩家语境、决定时刻、当前目标、合法选项、实际考虑选项、第一次坍缩、信息状态、机会成本、互动路径、行动前预测、实际行动、实际后果、模型更新、下一版单一改动。

输出 JSON 明确包含：

```json
{
  "schema_version": 1,
  "method": "single-decision-trace",
  "no_aggregate_score": true,
  "traces": []
}
```

它不生成决定质量、策略深度、互动强度或可重玩性总分。一次观察只定位下一次实验；跨局综合仍需另建研究协议。

## 9. 尚未回答

- 中文新手能否在不被“为什么”诱导的情况下完成一条轨迹；
- 口述思考会怎样改变真实决定，纯观察、赛后回放与即时追问应如何组合；
- 谈判、合作、隐藏身份、实时、身体操作与长战役分别需要哪些额外字段；
- 怎样纵向记录学习而不把玩家比较变成能力排名；
- variability、重玩意愿和长期策略发现应如何在实体桌游中分开测量。

