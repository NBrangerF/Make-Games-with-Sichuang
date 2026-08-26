# 核心 18 份资料中文全文权利审计 01

日期：2026-08-21  
状态：规划依据，发布前仍需法律复核  
范围：`content/resource-learning-paths.json` 当前六条最短路线中的 18 份资料

## 结论

18 份核心资料中，目前只有 2 份可确认进入“完整中文译文发布候选”：

1. `game-design-concepts`
2. `accessible-rulebook-best-practices`

其余分类为：

- 8 份需要书面授权后才能完整站内发布。
- 6 份当前应制作本站原创中文学习单元或非替代性摘要。
- 2 份权利链不明，需先确认谁能授予中文网络翻译权。

这是一项保守的产品发布审计，不是法律意见。完整译文上线前，仍需结合运营地、服务器所在地、商业模式和来源地区进行专业法律复核。

## 为什么必须先做权利门

[《伯尔尼公约》第 8 条](https://www.wipo.int/wipolex/en/text/283698)将制作和授权翻译列为作者的专有权。[中国现行著作权法第 10 条](https://www.wipo.int/wipolex/zh/legislation/details/21065)也列出翻译权和信息网络传播权，第 13 条要求译作不得侵犯原作著作权，第 26 条要求除法定例外外订立许可使用合同。

[Creative Commons 官方 FAQ](https://creativecommons.org/faq/#what-is-an-adaptation)明确把跨语言翻译视为改编。除 BY-ND 和 BY-NC-ND 外的 CC 许可通常允许在遵守各自条件时分享改编；BY 要求署名，SA 要求相同或兼容许可，NC 限制商业使用。具体判断仍应核对原作所用许可的版本、法域和第三方素材。

“免费阅读”“作者欢迎使用”“课堂可以使用”“能够下载”都不等于允许完整翻译并在公共网站再次发布。

## 分类口径

| 分类 | 含义 | 当前产品动作 |
| --- | --- | --- |
| A 可进入完整译文候选 | 一手许可明确允许分享和改编 | 冻结来源版本，核对第三方素材，完成 Codex AI 全译与来源结构核对 |
| B 需书面授权 | 权利主体或联系路径较清楚，完整翻译值得申请 | 未收到书面授权前不发布译文 |
| C 原创学习单元或摘要 | 来源包含第三方内容、动态目录、访谈、模板，或本身已经是中文 | 写不替代原作的完整中文教学单元 |
| D 权利链不明 | 改编来源或多方权利关系不清楚 | 先查权利人，暂不申请和翻译 |

开放许可不自动覆盖第三方图片、评论、外链教材、商标、人物权利或被引用作品。

## 逐项结果

| 分类 | 资源 | 证据与处理建议 |
| --- | --- | --- |
| A | `game-design-concepts` | [作者许可页](https://gamedesignconcepts.wordpress.com/about/)明确采用 CC BY 3.0 US。可翻译作者课程正文，但应排除或逐项核对必读教材、外链、评论及未明确许可的图片。 |
| A | `accessible-rulebook-best-practices` | [京都大学仓储权利记录](https://repository.kulib.kyoto-u.ac.jp/handle/2433/298016)明确为 CC BY 4.0。当前项目误标为 `link_and_summarize`，下一阶段应修为 `reusable_license_verified`。 |
| B | `kobold-guide-board-game-design-official` | [Kobold Press 商品页](https://koboldpress.com/kpstore/product/kobold-guide-to-board-game-design/)显示它是多作者付费出版物。需取得出版社对中文翻译、全文网络发布、地域、期限、插图和撰稿人内容的明确授权，并核对既有中文发行关系。 |
| B | `joe-slack-getting-to-core` | [原文](https://boardgamedesigncourse.com/getting-to-the-core-of-your-game/)所在网站标明 All rights reserved。适合向 Joe Slack 申请单篇中文翻译和站内发布权。 |
| B | `loops-and-metagames` | [FDG 原论文](https://www.fdg2015.org/papers/fdg2015_paper_22.pdf)的复制声明不包含翻译和公共网站发布。应向 Miguel Angel Sicart 申请。当前项目作者记录有误，下一阶段需修正。 |
| B | `sspai-mvp-prototype` | [原文](https://sspai.com/post/91653)已经是中文，实际需要的是全文转载权。应联系乔淼与少数派确认谁能授予公共网络转载。 |
| B | `daniel-games-prototyping` | [原文](https://daniel.games/prototyping/)没有发现开放许可。适合向 Daniel Piechnick 申请单篇或整套课程的中文授权。 |
| B | `gcores-appraisal-company-diary` | [原文](https://www.gcores.com/articles/153538)已经是中文，需求是转载。优先联系作者新茂，并逐项核对图片和合作素材。 |
| B | `ttgda-playtesting` | [原文](https://www.ttgda.org/in-person-playtesting)标明 All Rights Reserved，并提供协会联系路径。适合申请该页中文翻译和站内全文发布。 |
| B | `break-my-game-code` | [行为准则](https://www.breakmygame.com/codeofconduct)没有开放许可，但组织和联系路径清楚。可申请中文本地化授权。 |
| C | `kathleen-mercury-resources` | [作者首页](https://www.kathleenmercury.com/)欢迎使用资源，但同时禁止自行出版，并说明站内材料混合多种来源。当前应制作原创中文课程路径；若申请授权，只申请她明确拥有权利的具体单元。 |
| C | `bgdl-playtest-like-a-boss` | [原文](https://boardgamedesignlab.com/playtest-like-a-boss/)含多位第三方设计师引语，网站保留权利。当前应制作原创测试方法单元；即使获得网站授权，也要排除或另行处理引语和下载表格。 |
| C | `pratt-rulebook-editors-interview` | [访谈](https://www.meeplemountain.com/interviews/the-exception-and-the-rules-an-interview-with-emanuela-robert-pratt/)涉及网站、采访者、两位受访者、转录文本和多款游戏图片。原创中文规则编辑单元比完整复制访谈更可行。 |
| C | `bgdl-get-published` | [原文](https://boardgamedesignlab.com/how-to-get-your-game-published/)混合第三方引语、外部文档、数据库和商业书籍。当前另写中文出版路径，不复制整篇聚合结构。 |
| C | `panda-manufacturing-tools` | [官方工具页](https://pandagm.com/tools/)允许下载和使用生产工具，但没有授予再次发布或翻译整套指南和模板的许可证。应制作本站原创中文生产清单，并记录核验日期。 |
| C | `ttgda-contract-basics` | [原文](https://www.ttgda.org/contract-basics)保留权利，并嵌入第三方检查表、模型合同和法律性质条款。应另写中文合同问题清单并做律师复核。 |
| D | `zimmerman-core-mechanic` | [原文](https://www.gamedesignworkshop.com/the-core-mechanic)说明正文改编自 MIT Press 出版的更长文章。需确认 Eric Zimmerman、MIT Press 与网站运营者之间谁能授予中文网络翻译权。 |
| D | `dvgiochi-standard-rulebook` | [官方 PDF](https://www.dvgiochi.com/net/dv/dV-How_to_write_a_rulebook.pdf)注明多位编辑和另一来源作品。需先厘清 dV Giochi、作者和 Ravensburger 的权利链。 |

## 两项数据修正（已于 2026-08-21 执行）

以下修正已进入权威内容数据，并由独立契约脚本防止回归：

1. `accessible-rulebook-best-practices` 的 `rightsStatus` 已从 `link_and_summarize` 改为 `reusable_license_verified`，CC BY 4.0 证据 URL、许可版本和核验日期已保存。
2. `loops-and-metagames` 的作者已从 Daniel Cermak-Sassenrath 修正为 Miguel Angel Sicart。

## 当前许可字段不足

`resource-assessments.json` 的粗粒度 `rightsStatus` 可以控制“链接或概述”，但不足以控制完整译文发布。第一步机器可读契约已在 `content/resource-learning-content.json` 落地，并保存内容模式、来源、语言、译者说明、许可、完整度、发布范围与正文。以下更细字段仍是后续授权与版本治理工作的增量：

```yaml
publicationMode: full_translation|authorized_republication|original_chinese_unit|summary_only|blocked
rightsHolder: string|null
licenseName: string|null
licenseVersion: string|null
licenseJurisdiction: string|null
licenseEvidenceUrl: string|null
licenseEvidenceCapturedAt: date|null
sourceSnapshotId: string|null
permissionEvidenceId: string|null
permissionScope:
  translationAndAdaptation: boolean
  fullReproduction: boolean
  publicWebDistribution: boolean
  language: [string]
  territories: [string]
  commercialUse: boolean|null
  downloadAndPrint: boolean|null
  startsAt: date|null
  endsAt: date|null
thirdPartyExclusions: [string]
requiredAttribution: string|null
translator: string|null
translationReviewer: string|null
sourceVersion: string|null
translationVersion: string|null
legalReviewStatus: not_reviewed|reviewed|blocked
takedownContact: string|null
```

当前 18/18 已有机器可读的最小权利与发布记录，资源级基线仍全部是 `guide_only`；其中 `game-design-concepts` 已有 2 份文章级 `authorized_full_translation` 权威内容项，均为 Codex AI 完整翻译的 `internal-ready` / `authoritative` 内部学习主版，人工双语复核不是使用前置条件。它们不声称为人工翻译、法律审定或已公开版本。16/18 没有允许完整译文的开放许可或书面授权。实施边界详见[核心学习内容与权利数据契约 01](../product/RESOURCE_LEARNING_CONTENT_CONTRACT_01.md)。

## 权利工作顺序

### P0：先建立开放许可样板

1. 保存两项 CC 许可页和源页面的带时间戳快照。
2. 完成两项数据修正。
3. 为两项开放许可资料建立来源版本、署名、改动说明和第三方素材排除表。
4. 制作两项 Codex AI 完整中文译文，如实记录翻译主体、`not_required` 人工复核状态、内部/公开边界、版本更新和撤回流程。
5. 上线前做一次专业法律复核。

### P1：低摩擦授权请求

- Joe Slack
- Daniel Piechnick
- Break My Game
- TTGDA
- Miguel Angel Sicart
- 新茂
- 乔淼与少数派

申请必须针对具体文章，并明确：中文、完整翻译、公共网站、免费访问、是否允许下载、地域、期限、署名、修订和撤回。

### P1：战略授权

- Kobold Press：用户价值高，但多作者、商业出版和既有中文发行关系会让谈判较慢。
- Kathleen Mercury：与项目初心高度相关，但只能申请她明确拥有权利的具体单元，不能假定一揽子全站授权。

### P2：多方或动态内容

- Barrett Publishing 的两篇文章
- Panda Game Manufacturing
- Meeple Mountain 及两位受访者

### P3：暂缓

- Eric Zimmerman、Tracy Fullerton 与 MIT Press
- dV Giochi、Tom Werneck 与 Ravensburger

这些权利链复杂，投入相同时间时，产出确定性较低。

## 产品承诺

网站不能在当前证据下承诺把 574 条来源全部翻译并完整托管。推荐把“完整”定义为完整的中文学习体验：

1. 有开放许可或书面授权：发布完整中文译文。
2. 无全文许可但适合教学：发布本站原创、可独立读完的中文学习单元。
3. 已获中文原文转载权：发布已获许可的中文原文。
4. 权利链不明：只保留书目、权利证据和简短非替代性摘要，不进入核心学习路线。

界面必须区分“完整中文译文”“已获许可中文原文”“本站原创完整学习单元”“中文导读”“待授权”。
