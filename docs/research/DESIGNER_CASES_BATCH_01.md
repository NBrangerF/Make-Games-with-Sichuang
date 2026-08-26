# 设计师怎样思考：首批三个案例来源审计 01

日期：2026-08-21  
状态：首批三个原创中文案例综合已经落地；本文同步当前内容与信息架构依据，未修改产品代码  
范围：现有 574 条资源中的设计师本人日志、V2“看设计师怎样思考”入口、系统学习 9 单元与内部原创中文案例综合

## 核心结论

首批案例建议直接使用现有目录中的三篇文章，不再增加新资源：

1. Daniel Solis：《Revising the Constants and Variables in Monsoon Market》
2. Paul Dennen：《Dune: Imperium Designer Diary 1: Beginnings》
3. Cole Wehrle：《Quid for your Quo》

这不是设计师排名，也不是三种“正确设计法”。排序只表达阅读负担：先看一次很小的原型修订，再看两套机制怎样被连接，最后看删除旧机制后怎样辨认它原本承担的隐藏功能。

三篇文章都由设计师本人以第一人称写作，正文可以免费、无需登录地完整读取；三者也都没有发现文章级开放翻译许可。当前三项成品因此统一采用 `original_case_synthesis`：由 Codex 重新组织必要事实、本站分析、未知项与迁移动作，不逐段翻译来源，也不复现原文结构、图片或长段表达。三项均为项目内部学习主版本，无需人工双语复核或人工签核才能使用；这项内部版本决定不等于获得原文翻译或公开再发布权。公开发布仍保持关闭。[《伯尔尼公约》第 8 条](https://www.wipo.int/wipolex/en/text/283698)与[中国著作权法](https://www.wipo.int/wipolex/zh/legislation/details/21065)仍把翻译列为受控制的权利。

## 1. 为什么选择这三篇

### 1.1 筛选条件

本轮先从 [574 条资源目录](../../content/resources.json)中筛选“设计日志、设计师文章、开发日志”类来源，再检查以下条件：

1. 作者是实际参与该游戏设计或开发的人，而不是转载者或评论者。
2. 单篇文章包含可追踪的“语境、问题、选项、决定、证据、结果或未知”。
3. 正文仍能完整读取，不要求购买、注册或进入外部社群。
4. 三篇合起来形成不同认知负担，而不是三篇同类成功故事。
5. 可以明确区分原文可得性、案例综合完整性、项目历史完整性与翻译权利。

深读候选还包括 Cole Wehrle 的 [Oath Suit Spotlight](https://ledergames.com/blogs/news/oath-designer-diary-14-suit-spotlight-order-and-beasts)、Jack Neal 的 [The Case for the Plastic Case](https://jacknealgames.itch.io/get-rust-and-revenue/devlog/1092453/designer-diary-the-case-for-the-plastic-case)与 Jo Kelly 的 [The Zenobia Award](https://wehrlegig.com/blogs/essays/the-zenobia-award)。它们都值得进入后续批次，但首批优先复用已经收录且能形成清楚难度梯度的三项资源。

### 1.2 三篇的互补关系

| 顺序 | 读者要追的决定 | 主要设计阶段 | 对应系统学习单元 | 认知支持 |
| --- | --- | --- | --- | --- |
| 01 | 为什么要减少同时变化的变量 | 最小原型、测试与反馈 | 4、5、6 | 篇幅短，不需要玩过原游戏，适合作为第一篇 |
| 02 | 为什么“不错”的纯牌库构筑仍被推翻 | 体验意图、核心系统 | 1、2、3 | 先给三个约束，再看双用途卡的因果关系 |
| 03 | 为什么删除旧组件会让别的系统垮掉 | 核心系统、测试与反馈 | 2、3、6 | 规则关系密集，需要术语预读和简化状态图 |

首批没有覆盖系统单元 7“规则、教学与查询”或单元 8“呈现、生产与发布”。不能把三篇案例宣传为完整课程。第二批应优先补一篇规则编辑案例和一篇生产约束案例；Jack Neal 的包装文章可作为单元 8 的候选，但需要再确认作者与平台权利边界。

## 2. 案例一：一次只测试一种变化

### 2.1 来源记录

- 站内资源 ID：`monsoon-market-variables`
- 建议中文案例标题：**一次只测试一种变化：《Monsoon Market》怎样收缩变量**
- 原文：[Revising the Constants and Variables in Monsoon Market](https://danielsolisblog.blogspot.com/2014/05/revising-constants-and-variables-in.html)
- 作者：Daniel Solis
- 日期：2014-05-19
- 来源性质：作者个人博客中的第一人称原型日志
- 当前目录阶段：最小原型、测试与反馈

页面将 Daniel Solis 标为桌游与卡牌项目的美术指导和图形设计师，正文由他以第一人称记录自己的 Unpub 原型修订。文章本身很短，包含完整正文与原型照片，不要求登录。[原文页面](https://danielsolisblog.blogspot.com/2014/05/revising-constants-and-variables-in.html)

### 2.2 设计决定轨迹

| 字段 | 本案例内容 |
| --- | --- |
| 版本语境 | 作者在一次周末原型制作与此前测试之后，手工重做 `Monsoon Market`。 |
| 当前问题 | 稀有度、订单需求和玩家供给同时随机变化，测试结果难以解释。 |
| 考虑的方向 | 保留两套随机牌堆与特殊分布，或先简化货物和订单分布以减少噪声。 |
| 实际决定 | 重写货物数量与订单结构，保留较少的随机来源，并把下一次测试的终局暂定为 7 分。 |
| 使用的证据 | 作者对先前测试的回顾，以及游玩 `Splendor` 后对随机来源和分布复杂度的比较。 |
| 当时结果 | 文章写到的是下一次测试前的假设；新分布是否平衡尚未得到证明。 |
| 迁移边界 | “减少变量”不是要求游戏变简单，而是让这一轮测试的因果解释更清楚。文章中的具体卡牌数量不能直接移植。 |

这篇最适合作为第一篇，因为它公开展示了设计过程里的一个重要状态：设计师可以作出有理由的修订，同时仍不知道修订是否有效。当前资源评估也明确记录“一次原型日志不证明新分布已平衡”。证据见[资源评估](../../content/resource-assessments.json)。

### 2.3 原创案例综合与内部边界

完整性判断：**单篇正文完整可得，项目历史不完整。** 页面提供该篇文章全部正文，但它只是一次迭代快照；相关测试前后还有其他博客文章。

许可判断：页面页脚标示 `© 2010 Daniel Solis (unless otherwise noted)`，本篇没有单独标出 Creative Commons 许可。作者在其他文章中对特定图标、字体或素材使用过 CC 许可，不能据此推定本篇正文也开放授权。

已落地内容采用：

- `contentMode`: `original_case_synthesis`
- `publication.visibility`: `internal`
- Codex 原创整理八段学习关系，不逐段翻译标题与正文。
- 不复制评论、热门文章、侧栏、页面主题图片和原型照片。
- 原型照片如教学确实需要，以本站原创状态示意图替代。
- 页面中的外链只作为来源记录，不把被链接文章并入案例。
- Codex 版本是当前内部学习主版本，`humanReviewRequired: false`、`publicReleaseEnabled: false`。

成品与核验：[案例综合](../../content/guides/monsoon-market-variables-case-synthesis-zh-CN-internal.md)、[metadata](../../content/guides/monsoon-market-variables-case-synthesis-zh-CN-internal.metadata.json)、[来源与内容边界核验](SOURCE_VERIFICATION_MONSOON_MARKET_VARIABLES.md)。

### 2.4 四步阅读脚手架

1. **先看一个很小的桌面例子。** 不先解释所有卡牌数量。用三种颜色的纸片表示“稀有度、需求、供给”，让读者看见三项同时变化时为什么难以判断原因。
2. **用一句话读懂关系。** “如果一次改三件事，即使结果变化，也不知道是哪一件造成的。”不熟悉概率或市场机制的读者到这里已经能得到完整关系。
3. **再读作者真正改了什么。** 对照旧版与新版，只圈出被固定、被简化和留到下一轮测试的变量。有原型经验的读者再看具体牌张分布。
4. **带回自己的项目。** 写四行：这轮问题、保持不变的部分、只改变的一项、什么结果会反驳预期。最后明确“新版本尚未被证明有效”。

## 3. 案例二：好游戏为什么仍要推翻

### 3.1 来源记录

- 站内资源 ID：`dune-imperium-deck-worker-diary`
- 建议中文案例标题：**好游戏为什么仍要推翻：《Dune: Imperium》的核心结合点**
- 原文：[Dune: Imperium Designer Diary 1: Beginnings](https://news.direwolfdigital.com/dune-imperium-designer-diary-1-beginnings/)
- 作者：Paul Dennen
- 日期：2020-09-23
- 来源性质：Dire Wolf 官方网站上的设计师第一人称日志
- 当前目录阶段：体验意图、核心系统

文章结尾由 Paul Dennen 署名，完整 HTML 正文无需登录即可读取。Dire Wolf 的正式规则书也把 Paul Dennen 列为游戏设计者。[原文页面](https://news.direwolfdigital.com/dune-imperium-designer-diary-1-beginnings/)与[官方规则书](https://d19y2ttatozxjp.cloudfront.net/pdfs/DUNE_IMPERIUM_Rules_2020_10_26.pdf)

### 3.2 设计决定轨迹

| 字段 | 本案例内容 |
| --- | --- |
| 版本语境 | 团队希望制作一款新的 `Dune` 牌库构筑游戏，但已有一款广受喜爱的 1979 年桌游。 |
| 当前问题 | 早期纯牌库构筑版本“不错”，却没有充分拉开差异，也没有承载团队想要的更大范围。 |
| 主要约束 | 新作要适合更少玩家、保留政治谋划感，又不能重复旧作的体验。 |
| 考虑的方向 | 保留以影响力标记和小版图为主的纯牌库构筑，或增加更有空间竞争的版图系统。 |
| 实际决定 | 引入工人放置，并让同一张牌在“派遣 Agent”和回合末 `Reveal` 资源之间二选一。 |
| 使用的证据 | 团队过往制作 `Clank!` 的经验、题材与机制适配判断，以及文章中概述的开发观察。 |
| 作者报告的结果 | 双用途卡把额外工人的优势与少一张结算牌的机会成本连接起来，并形成交替的小回合结构。 |
| 迁移边界 | 文章是官方产品日志，没有公开测试数据，无法分离双用途卡、版图、战斗和题材各自的效果。 |

这篇的学习价值不在“把牌库构筑和工人放置混起来”，而在于设计师先写清约束，再寻找一个让两套系统互相付出代价的连接点。单纯并列两个机制不会自动产生同样结果。

### 3.3 原创案例综合与内部边界

完整性判断：**第一篇设计日志正文完整可得，整套开发史不完整。** 页面同时链接后续四篇日志，因此这一篇不能被包装成整个项目的完整历史。

许可判断：页面页脚标示 Dire Wolf Digital `All Rights Reserved`。`Dune` 还涉及 Legendary、Herbert Properties 与发行许可方等多方知识产权，正式规则书列出了这些权利关系。Dire Wolf 的粉丝内容政策允许一定范围的讨论内容，但没有授予把该文章完整翻译并再发布的许可。[Dire Wolf 粉丝内容政策](https://direwolfdigital.com/fan-art-policy/)

已落地内容采用：

- `contentMode`: `original_case_synthesis`
- `publicationScope`: `internal`
- 重新围绕“同一张牌怎样连接两套系统”组织案例，不镜像来源篇章。
- 不复制卡图、角色图、电影素材、商标、标志或页面图片。
- 不收录或翻译开篇 Frank Herbert 小说引文；第三方题材只作事实性识别。
- Agent、Reveal 等术语先用普通中文动作解释，再保留必要原词。
- Codex 版本是当前内部学习主版本，`humanReviewRequired: false`、`publicReleaseEnabled: false`。

成品与核验：[案例综合](../../content/translations/dune-imperium-beginnings-zh-CN-internal.md)、[metadata](../../content/translations/dune-imperium-beginnings-zh-CN-internal.metadata.json)、[来源、权利与内容核验](SOURCE_VERIFICATION_DUNE_IMPERIUM_BEGINNINGS_SYNTHESIS.md)。

由于存在多方授权 IP，这篇即使内部学习价值很高，也不应成为首个对外授权申请样板。

### 3.4 四步阅读脚手架

1. **先给三个约束，不先讲世界观。** 读者只需知道：已有一款经典旧作、新作要服务较少玩家、团队想保留政治谋划感。没有读过小说或玩过游戏也能开始。
2. **找到“不错但不够”的时刻。** 对照早期纯牌库构筑和后来版本，写出设计师不满意的不是可玩性，而是差异与体验范围。
3. **画出一张牌的两条路。** `一张手牌 → 派遣工人` 或 `保留到 Reveal → 获得资源`。有经验读者再追“额外工人为什么不再是纯收益”。
4. **带回自己的项目。** 如果要结合两个机制，分别写它们带来什么，以及连接处制造什么机会成本。若只能写出“内容更多”，说明连接还没有形成。

## 4. 案例三：删掉旧机制后系统为什么垮了

### 4.1 来源记录

- 站内资源 ID：`wehrle-quid-for-quo`
- 建议中文案例标题：**删掉旧机制后系统为什么垮了：《John Company》的承诺机制重做**
- 原文：[Quid for your Quo](https://wehrlegig.com/blogs/essays/quid-for-your-quo)
- 原始发布记录：[BoardGameGeek Designer Diary](https://boardgamegeek.com/thread/2641352/designer-diary-3-quid-for-your-quo)
- 作者：Cole Wehrle
- 日期：2021-04-15
- 来源性质：设计师本人长文，现由 Wehrlegig Games 官方网站完整托管
- 当前目录阶段：核心系统、测试与反馈

Wehrlegig 页面说明文章原先发布在 `John Company: Second Edition` 的 BoardGameGeek 设计日志中。BoardGameGeek 原始帖子显示发布者为 Cole Wehrle；Wehrlegig 官方简介也确认 Cole Wehrle 是公司的共同创办者与相关游戏设计者。[作者与原始帖子](https://boardgamegeek.com/thread/2641352/designer-diary-3-quid-for-your-quo)与[Wehrlegig 简介](https://wehrlegig.com/pages/about)

### 4.2 设计决定轨迹

| 字段 | 本案例内容 |
| --- | --- |
| 版本语境 | 作者先回顾 `Pax Pamir` 的谈判规则问题，再解释 `John Company` 一版到二版的承诺系统。 |
| 当前问题 | 承诺方块在一版中太昂贵、越来越少被使用；二版经济变化又让它显得像遗留物。 |
| 第一次决定 | 作者删除承诺方块，希望清理旧版遗留元素。 |
| 反证 | 删除后多个系统立即失效，说明方块还承担着对裙带任命施加高成本的隐藏工作。 |
| 重新定义问题 | 不再问“怎样修好这个组件”，而是问“这个组件原本做了哪两件工作”。 |
| 新方案 | 用候选人的一致同意形成裙带任命否决，再用承诺卡给弱势玩家提供杠杆与可交易提醒。 |
| 使用的证据 | 不同玩家群体对旧谈判规则的使用方式、熟练玩家对方块的弃用、删除组件后的系统崩塌与后续测试争议。 |
| 作者报告的结果 | 新同意规则让游戏重新运转；具体承诺卡仍受到测试者争论。 |
| 迁移边界 | 这些限制服务于特定的现金流、任命池、谈判参与人数和终局结构，不能变成所有谈判游戏的处方。 |

这篇最适合放在第三位。它不是“旧机制不好，所以换新机制”的直线故事，而是展示一个组件同时承担显性与隐性功能。删除实验本身成为诊断证据。

### 4.3 原创案例综合与内部边界

完整性判断：**单篇正文完整可得，并有两个一手托管面；它仍不是整个二版开发史。** Wehrlegig 页面提供完整文章，BoardGameGeek 还保存原始发布与后续讨论。评论不是作者正文，不能合并为“完整文章”。

许可判断：Wehrlegig 页面页脚为 `© 2026 Wehrlegig Games`，没有发现本篇文章的开放许可。页面说明它来自 BoardGameGeek，这增加了来源链，但不产生中文再发布许可。

已落地内容采用：

- `contentMode`: `original_case_synthesis`
- `publication.visibility`: `internal`
- 以 Wehrlegig 官方镜像核验主要事实，BoardGameGeek 只核验作者、日期与原始发布。
- 不翻译或复制 BoardGameGeek 评论、头像、图片和用户讨论。
- 不复制游戏图片；关系说明由本站重新组织为“旧组件工作 → 删除实验 → 依赖暴露 → 功能拆分”。
- 提供按需术语、八段案例框架与迁移动作，但不复现原文章节顺序。
- Codex 版本是当前内部学习主版本，`humanReviewRequired: false`、`publicReleaseEnabled: false`。

成品与核验：[案例综合](../../content/guides/quid-for-your-quo-case-synthesis-zh-CN-internal.md)、[metadata](../../content/guides/quid-for-your-quo-case-synthesis-zh-CN-internal.metadata.json)、[来源与完整性核验](SOURCE_VERIFICATION_QUID_FOR_YOUR_QUO_SYNTHESIS.md)。

### 4.4 四步阅读脚手架

1. **先看一张四格关系图。** 只展示“旧方块承担成本 → 删除方块 → 裙带任命失去约束 → 拆成否决与承诺卡”。不要求先学会整款游戏。
2. **分开组件和工作。** 列两栏：承诺方块是什么，承诺方块实际上做了什么。对复杂规则不熟悉的读者只完成这一层。
3. **把删除当作证据。** 追踪“删除后哪里先坏”，再比较一致同意与承诺卡分别接回哪项功能。有设计经验的读者补上现金流、参与人数与终局关系。
4. **带回自己的项目。** 选择一个想删除的组件，先写它的显性用途和隐藏用途，再做一次删除测试。结果只能支持下一轮假设，不能证明作者的新方案普遍正确。

## 5. 入口信息架构建议

### 5.1 案例列表页

`#resources/learn/designer-thinking` 默认只显示三条开放式列表，不显示作者头像、游戏封面、阶段胶囊、资源数量或权利徽章。

每条只保留：

1. 一个普通语言问题标题
2. 一句这次决定改变了什么
3. 一句阅读支持，例如“不需要玩过原游戏”或“先看五个术语”

推荐顺序：

```text
01 一次只测试一种变化
   看测试前怎样减少噪声，结果仍然未知。

02 好游戏为什么仍要推翻
   看约束怎样把两套机制连接成一个机会成本。

03 删掉旧机制后系统为什么垮了
   看删除实验怎样暴露组件的隐藏工作。
```

来源、原题名、日期、许可与内部范围全部留到案例正文末尾的来源记录，不在入口页争夺注意力。

### 5.2 案例正文页

每篇使用同一阅读结构：

1. 一句案例问题
2. 一个无需先玩原游戏的桌面例子或原创关系图
3. 3 到 4 步阅读脚手架
4. 可独立读完的原创中文案例综合
5. “作者观察、本站推断、仍不知道”三项收束
6. 一个迁移动作
7. 可折叠来源与内部使用范围

脚手架不应成为正文之前的另一门课程。它只在相应段落旁提示读者现在要看什么；熟悉主题的读者可以连续阅读完整案例综合。

### 5.3 建议内容记录

三项内容已经作为独立内部内容记录落地，不改变公开资源目录的 `rightsStatus: link_and_summarize`，本轮也不修改共享内容契约。

| itemId / artifactId | resourceId | contentMode | publicationScope | 已落地内容 |
| --- | --- | --- | --- | --- |
| `monsoon-market-variables-case-synthesis-zh-CN-internal` | `monsoon-market-variables` | `original_case_synthesis` | `internal` | [正文](../../content/guides/monsoon-market-variables-case-synthesis-zh-CN-internal.md) · [metadata](../../content/guides/monsoon-market-variables-case-synthesis-zh-CN-internal.metadata.json) · [核验](SOURCE_VERIFICATION_MONSOON_MARKET_VARIABLES.md) |
| `dune-imperium-beginnings-zh-CN-internal` | `dune-imperium-deck-worker-diary` | `original_case_synthesis` | `internal` | [正文](../../content/translations/dune-imperium-beginnings-zh-CN-internal.md) · [metadata](../../content/translations/dune-imperium-beginnings-zh-CN-internal.metadata.json) · [核验](SOURCE_VERIFICATION_DUNE_IMPERIUM_BEGINNINGS_SYNTHESIS.md) |
| `quid-for-your-quo-case-synthesis-zh-CN-internal` | `wehrle-quid-for-quo` | `original_case_synthesis` | `internal` | [正文](../../content/guides/quid-for-your-quo-case-synthesis-zh-CN-internal.md) · [metadata](../../content/guides/quid-for-your-quo-case-synthesis-zh-CN-internal.metadata.json) · [核验](SOURCE_VERIFICATION_QUID_FOR_YOUR_QUO_SYNTHESIS.md) |

三项都记录来源身份、综合范围、事实与推断边界、排除组件、内部权威状态和公开开关。Codex 产物可直接作为内部学习主版本，无需等待人工双语复核；后续反馈通过版本修订吸收。数据语义继续参考[核心学习内容与权利契约](../product/RESOURCE_LEARNING_CONTENT_CONTRACT_01.md)，但本轮不改动该契约。

## 6. 当前 V2 还能删除或折叠的三个负担

### 6.1 折叠系统学习的九单元墙

当前“系统性学习”已经在“现在先做”后无条件渲染九个单元。[resource-v2-detail.tsx](../../src/resource-v2-detail.tsx)中的 `systematic.steps` 与统一序列渲染会让读者刚选择路线就再次面对完整课程墙。

建议默认只显示：

- 当前单元
- 一句完成结果
- “阅读这一单元”
- “查看完整九单元目录”文字入口

九单元目录放入第二层展开，且展开后仍只用短目录，不显示每课资源和元数据。这也重新满足已冻结视觉规格中“默认不同时展示九单元课程目录”的要求。

### 6.2 删除案例入口前的第二套通用课程

当前“看设计师怎样思考”页面先显示“现在先做”，再显示四条通用阅读原则，最后才有一段未来案例说明。[resource-v2-detail.tsx](../../src/resource-v2-detail.tsx)第 27 至 36 行与第 129 至 140 行共同形成了案例前的第二套微型课程。

首批三篇完成后，应直接用三条案例替换整个“现在先做 + 四步序列 + 边界段落”。四步脚手架进入每篇案例相应段落，不在入口页重复讲一次。入口页只负责选择案例。

### 6.3 拆掉“按问题找资料”入口复用的旧七层页面

当前 `problems` 仍由 [App.tsx](../../src/App.tsx)中的旧 `ResourcePage` 承接。旧页面同时渲染阶段、处境帮助、具体问题、入口说明、三份路线、筛选器、结果数量和资源列表，代码集中在 `ResourceView` 的 684 至 699 行。

建议把它拆成两次决定：

1. 先选六个阶段之一。
2. 再选该阶段的一个具体问题。

只有选择问题后才显示三份起步内容；完整筛选与 574 条目录继续只属于“搜索全部资料”。这个负担比调整字号或间距更优先，因为它会让第三主入口重新变成旧资源首页。

## 7. 实施顺序与完成门

### 7.1 已完成顺序与下一步

1. Daniel Solis 案例综合已落地，跑通短案例脚手架与事实／推断分层。
2. Paul Dennen 案例综合已落地，验证第三方 IP 排除、普通语言解释与双用途卡关系。
3. Cole Wehrle 案例综合已落地，补齐谈判术语、复杂系统关系和删除实验迁移法。
4. 下一步可以一次性接入三条案例列表，避免出现三个入口只有一个能读的状态。

### 7.2 内容完成门

- 三篇中文案例综合都能连续读完；外部链接只承担来源核验，不是理解案例的前置条件。
- 每篇明确显示“原创案例综合”，不显示“完整译文”或“已授权译文”。
- 每篇覆盖所承诺的案例维度；被排除的原文表达、图像、评论和第三方内容逐项记录。
- 每篇都分开作者报告、本站推断和仍不知道。
- 每篇都有一个可在自己项目中完成的小动作。
- Codex 版本即当前内部学习主版本，`humanReviewRequired: false`；人工反馈可以触发后续修订，但不是内部使用或接入前置门。

### 7.3 入口完成门

- 案例入口只显示三条选择，默认不展示通用四步课程、来源元数据或阶段标签。
- 不熟悉三款游戏的读者无需先读规则书，也能说出每篇案例在处理什么决定。
- 三篇从短到长、从单变量到系统替换，不按名气或商业成功排序。
- 选择案例后一次操作即可进入完整中文原创案例综合。
- 公开构建与导出包不包含这三份内部案例内容，除非另行完成权利与发布决策。

## 8. 方法与来源

本轮完成了四项工作：

1. 从 574 条目录与资源评估中筛选设计师本人日志。
2. 深读六篇候选设计日志，并核验选中三篇的作者、原始发布与当前可得性。
3. 对照系统学习九单元与当前 V2 路由，建立案例顺序和 UI 减法建议。
4. 对照现有内部内容模式，区分原文可读、案例综合完整性、翻译许可和公开授权。

关键一手来源：

- [Daniel Solis: Revising the Constants and Variables in Monsoon Market](https://danielsolisblog.blogspot.com/2014/05/revising-constants-and-variables-in.html)
- [Paul Dennen: Dune: Imperium Designer Diary 1: Beginnings](https://news.direwolfdigital.com/dune-imperium-designer-diary-1-beginnings/)
- [Cole Wehrle: Quid for your Quo](https://wehrlegig.com/blogs/essays/quid-for-your-quo)
- [Cole Wehrle 的 BoardGameGeek 原始发布](https://boardgamegeek.com/thread/2641352/designer-diary-3-quid-for-your-quo)
- [Dire Wolf Dune: Imperium 正式规则书](https://d19y2ttatozxjp.cloudfront.net/pdfs/DUNE_IMPERIUM_Rules_2020_10_26.pdf)
- [Wehrlegig Games About](https://wehrlegig.com/pages/about)
- [Dire Wolf Fan Art Policy](https://direwolfdigital.com/fan-art-policy/)

项目证据：

- [资源目录](../../content/resources.json)
- [资源评估](../../content/resource-assessments.json)
- [系统学习与分析详情](../../src/resource-v2-detail.tsx)
- [资源 V2 主方案](../product/RESOURCE_SITE_V2_MASTER_PLAN.md)
- [资源 V2 视觉规格](../product/RESOURCE_V2_VISUAL_SPEC.md)
- [核心学习内容与权利契约](../product/RESOURCE_LEARNING_CONTENT_CONTRACT_01.md)

本报告只给出研究、内容队列与信息架构建议，没有改动 `App.tsx`、`styles.css`、`package.json` 或任何运行时代码。
