# 核心学习内容与权利数据契约 01

日期：2026-08-22  
状态：已建立机器可读基线、16 项权威内容白名单和构建门禁  
范围：`content/resource-learning-paths.json` 六条路线的 18 份核心资料基线，以及显式白名单收录的已授权完整译文、本站原创学习单元和本站原创案例综合

## 1. 当前契约快照

`content/resource-learning-content.json` 同时管理两层数据：

1. 18 份资源级学习基线。它们当前全部是 `guide_only`，即本站原创中文导读卡；这不会因为某篇文章或某个课程单元已有完整正文，就把整份外部资源误标为“已全部翻译”。
2. 16 项文章级、课程级权威内容。`authoritativeItems` 是显式白名单；文件仅仅出现在 `content/` 下不会自动进入站内主版。

当前 `authoritativeItems` 的精确构成为：

| 内容模式 | 数量 | 当前范围 |
| --- | ---: | --- |
| `original_complete` | 8 | 系统单元 0–6 共 7 项，以及 `learn-by-playing-one-moment-zh-CN` 1 项 |
| `authorized_full_translation` | 3 | *Game Design Concepts* 第 1、2 关，以及无障碍且有趣的规则书完整译文 |
| `original_case_synthesis` | 5 | Monsoon Market、Dune: Imperium、Quid for Your Quo、Paul Grogan 规则书布局、New Bedford 制造约束案例 |
| **合计** | **16** | 均为 `authoritative` / `internal-ready` / `internal` |

这里的 18 份资源基线和 16 项权威正文是两个不同计数，不能相加，也不能相互替代。契约刻意把“来源可读”、“可以摘要”、“可以翻译”、“译文已完整”、“内部可用”和“可以公开发布”拆成不同状态。

## 2. 当前 16 项权威内容

### 2.1 本站原创完整学习内容（8 项）

| 权威项 | 内容位置 | 边界 |
| --- | --- | --- |
| `systematic-unit-00-question-first-zh-CN` | `content/learning-units/systematic-unit-00-question-first-zh-CN.md` | 本站原创综合，非全文翻译 |
| `systematic-unit-01-experience-intent-zh-CN` | `content/learning-units/systematic-unit-01-experience-intent-zh-CN.md` | 本站原创综合，非全文翻译 |
| `systematic-unit-02-decisions-core-loop-zh-CN` | `content/learning-units/systematic-unit-02-decisions-core-loop-zh-CN.md` | 本站原创综合，非全文翻译 |
| `systematic-unit-03-mechanisms-information-interaction-zh-CN` | `content/learning-units/systematic-unit-03-mechanisms-information-interaction-zh-CN.md` | 本站原创综合，非全文翻译 |
| `systematic-unit-04-minimum-prototype-zh-CN` | `content/learning-units/systematic-unit-04-minimum-prototype-zh-CN.md` | 本站原创综合，非全文翻译 |
| `systematic-unit-05-single-question-test-zh-CN` | [正文](../../content/learning-units/systematic-unit-05-single-question-test-zh-CN.md) · [元数据](../../content/learning-units/systematic-unit-05-single-question-test-zh-CN.metadata.json) · [来源审计](../research/SYSTEMATIC_UNIT_05_SOURCE_AUDIT_2026-08-22.md) | 完整的“单问题测试”计划与模板，不是已经发生的测试，也不构成效果证据 |
| `systematic-unit-06-evidence-to-next-version-zh-CN` | [正文](../../content/learning-units/systematic-unit-06-evidence-to-next-version-zh-CN.md) · [元数据](../../content/learning-units/systematic-unit-06-evidence-to-next-version-zh-CN.metadata.json) · [来源审计](../research/SYSTEMATIC_UNIT_06_SOURCE_AUDIT_2026-08-22.md) | `DEMO-01` 只复用单元 4 已写明的两行样例，作为教学演练；没有虚构玩家、测试次数、交换结果或停止结论 |
| `learn-by-playing-one-moment-zh-CN` | [正文](../../content/learning-units/learn-by-playing-one-moment-zh-CN.md) · [元数据](../../content/learning-units/learn-by-playing-one-moment-zh-CN.metadata.json) · [来源审计](../research/LEARN_BY_PLAYING_ONE_MOMENT_SOURCE_AUDIT_2026-08-22.md) | 《Kingdomino》段落是虚构教学记录，不是真实观察、设计师意图或效果证明；规则事实以官方产品页和官方规则书为依据 |

单元 5、单元 6 和“边玩边学 01”都使用 `site_owned` / `site_owned_original`。这只描述本站对原创中文组织与表达的状态，不会把其参考的外部文章、论文、课程、规则书、游戏名称或第三方素材变成本站所有。

### 2.2 已授权完整译文（3 项）

| 权威项 | 内容位置 | 许可边界 |
| --- | --- | --- |
| `game-design-concepts-level-01-zh-CN` | `content/translations/game-design-concepts-level-01-zh-CN.md` | CC BY 3.0 US；仅代表这一关已完整翻译 |
| `game-design-concepts-level-02-zh-CN` | `content/translations/game-design-concepts-level-02-zh-CN.md` | CC BY 3.0 US；仅代表这一关已完整翻译 |
| `what-makes-a-rulebook-accessible-and-entertaining-zh-CN` | `content/translations/what-makes-a-rulebook-accessible-and-entertaining-zh-CN.md` | 依记录的开放许可与第三方素材排除边界使用 |

三份译文均以 `translationAuthority: codex_ai_complete`、`humanTranslatorClaimed: false` 和 `humanReviewStatus: not_required` 作为内部学习主版。项目已决定不把人工双语核验作为内部使用的前置条件；这不等于已经完成人工审定，也不降低许可、署名、第三方素材、发布范围和法律审查要求。

两关 *Game Design Concepts* 译文不能让整套课程被误标为“已全部翻译”。Monsoon Market 旧的外部文章全文译文不在权威契约中；当前收录的是不复制原文结构的本站原创案例综合。

### 2.3 本站原创案例综合（5 项）

| 权威项 | 内容位置 | 边界 |
| --- | --- | --- |
| `monsoon-market-variables-case-synthesis-zh-CN-internal` | `content/guides/monsoon-market-variables-case-synthesis-zh-CN-internal.md` | 非全文翻译，不复制单一来源结构 |
| `dune-imperium-beginnings-zh-CN-internal` | `content/translations/dune-imperium-beginnings-zh-CN-internal.md` | 非全文翻译，不含第三方 IP 素材 |
| `quid-for-your-quo-case-synthesis-zh-CN-internal` | `content/guides/quid-for-your-quo-case-synthesis-zh-CN-internal.md` | 非全文翻译，不复制来源结构与图片 |
| `paul-grogan-rulebook-layout-case-synthesis-zh-CN-internal` | `content/guides/paul-grogan-rulebook-layout-case-synthesis-zh-CN-internal.md` | 围绕规则书布局问题独立重组 |
| `new-bedford-manufacturing-constraint-case-synthesis-zh-CN-internal` | `content/guides/new-bedford-manufacturing-constraint-case-synthesis-zh-CN-internal.md` | 围绕制造约束问题独立重组 |

## 3. 内容模式

| 模式 | 是否要求完整正文 | 公开边界 |
| --- | --- | --- |
| `original_complete` | 是 | 本站原创或委托创作的完整中文单元；`license.kind` 必须为 `site_owned` |
| `original_case_synthesis` | 是 | 本站基于列明来源独立重组的完整中文案例；不得复制单一来源的结构或长段表达 |
| `authorized_full_translation` | 是 | 必须有开放许可或书面授权，权利状态必须已核验可复用 |
| `authorized_zh_republication` | 是 | 为已是中文的来源保留；同样必须有开放许可或书面授权 |
| `internal_full_translation` | 是 | 只能用于内部研究、校对和授权评估；`publicationScope` 必须为 `internal` |
| `guide_only` | 否 | 本站原创的非替代性导读、摘要或阅读任务，不得冒充全文 |

`authorized_zh_republication` 不是额外的 UI 分支。它是为中文来源保留的数据语义，避免把转载错记为翻译或本站原创。

## 4. 记录字段

```yaml
resourceId: string
contentMode: original_complete|original_case_synthesis|authorized_full_translation|authorized_zh_republication|internal_full_translation|guide_only
sourceUrl: https-url
sourceLanguage: string
translatorNote: string
license:
  kind: site_owned|open_license|written_permission|none_verified|unresolved
  name: string|null
  version: string|null
  evidenceUrl: https-url|null
  evidenceCapturedAt: date|null
  permissionEvidenceId: string|null
rightsStatus: site_owned_original|reusable_license_verified|link_and_summarize|restricted
completeness: complete|partial|guide_only|empty
publicationScope: public|internal
body: string
```

已有独立正文文件的权威内容项增加：

```yaml
itemId: string
titleZh: string
translationAuthority: codex_ai_complete|human_translator|mixed_team
humanTranslatorClaimed: boolean
humanReviewStatus: not_required|pending|changes-requested|approved
internalLearningStatus: not_ready|supplementary|authoritative
publicationStatus: draft|internal-ready|public-candidate|published|withdrawn
legalReviewStatus: not_reviewed|reviewed
legalApprovalClaimed: boolean
metadataFile: content/**/*.metadata.json
bodyFile: content/**/*.md
```

字段职责分开：

- `sourceUrl` 和 `sourceLanguage` 保存来源身份，并必须与 `resources.json` 一致。
- `translatorNote` 说明当前是导读、翻译还是转载，以及未覆盖什么。
- `license` 保存具体许可依据；`rightsStatus` 与现有资源评审表保持一致。
- `completeness` 只表示内容覆盖状态，不代表取得发布权。
- `publicationScope` 是独立的发布面边界。
- `translationAuthority` 说明译文由 Codex AI、人类译者还是混合团队完成；`codex_ai_complete` 不得同时声称人工翻译。
- `site_owned_original` 只描述本站原创正文，不改变外部参考来源的权利归属。
- `internalLearningStatus: authoritative` 只表示本项目内部当前选用的主版，不表示原作者认可、人工审定或法律审定。
- `humanReviewStatus: not_required` 只取消人工双语复核作为内部使用前置条件，不伪造人工复核记录，也不解除权利核验。
- 资源基线可直接使用 `body`；权威内容项用 `bodyFile` 指向唯一正文，避免复制。任何完整内容模式都必须有可读取的非空正文。

## 5. 已实施构建门

`scripts/check-resource-learning-content.mjs` 当前执行 59 项检查，主要边界包括：

1. 18 份核心资料逐一覆盖，不能重复或引入隐形记录。
2. 来源 URL、语言和权利状态必须与权威资源表、评审表一致。
3. `authoritativeItems` 必须精确为 16 项，模式分布必须精确为 8 项 `original_complete`、3 项 `authorized_full_translation` 和 5 项 `original_case_synthesis`。
4. `internal_full_translation` 被标为 `public` 时构建直接失败；它即使位于仓库也不得自动进入权威白名单。
5. 任一完整模式的 `bodyFile` 不存在、为空或内容状态不完整时，构建直接失败。
6. 两种原创模式必须使用 `site_owned` / `site_owned_original`；完整译文必须有可复用许可证据。
7. 只校验 `authoritativeItems` 显式引用的元数据和正文，不从目录自动收录。
8. `internal-ready` 必须使用 `internal`；转入 `public-candidate` 或 `published` 需另行记录显式公开发布决定。
9. `codex_ai_complete` 必须使用 `humanReviewStatus: not_required` 且 `humanTranslatorClaimed: false`，拒绝冒充人工翻译。
10. 完整译文必须保存 `legalReviewStatus`，但当前 `legalApprovalClaimed` 必须为 `false`，不能自行生成法律审定。
11. 单元 5 必须明确自身是测试计划而非真实证据；单元 6 的 `DEMO-01` 必须保持为复用单元 4 两行样例的教学演练，不能凭空扩写成真实测试。
12. “边玩边学 01”必须明确《Kingdomino》示例是虚构教学记录，并保持官方规则中的“先预定骨牌、下一轮再放置”等时序事实。
13. 脚本含合成拒绝用例，确保内部译文公开、完整译文空正文、AI 译文冒充人工、伪称法律审定以及事实/推断越界等失败分支会实际失败。

独立运行：

```bash
pnpm qa:resource-learning-content
```

该命令已进入 `pnpm content:check`，因此生产构建会执行同一契约。

## 6. 关键权利与事实边界

1. `accessible-rulebook-best-practices` 的 `rightsStatus` 为 `reusable_license_verified`；依据是[京都大学机构知识库的 CC BY 4.0 记录](https://repository.kulib.kyoto-u.ac.jp/handle/2433/298016)。
2. `loops-and-metagames` 的作者为 Miguel Angel Sicart，来源为 [FDG 2015 论文 PDF](https://www.fdg2015.org/papers/fdg2015_paper_22.pdf)。
3. `game-design-concepts` 的[作者许可页](https://gamedesignconcepts.wordpress.com/about/)标明 CC BY 3.0 US；目前只有第 1 关和第 2 关译文进入权威项。
4. Dune 案例 metadata 的 `resourceId` 与权威资源表统一为 `dune-imperium-deck-worker-diary`。
5. 《Kingdomino》的游戏名称、规则与官方材料不因本站写成原创教学记录而变成站点资产；这里只保留必要的规则事实、来源归属和原创分析结构。

来源许可不自动覆盖第三方图片、引文、附件、评论、商标、游戏 IP 或人物权利。`internal-ready` 不等于公开授权；AI 译文无需人工核验的产品决定也不改变这一点。

## 7. 状态迁移规则

### 导读到内部学习主版

`guide_only` 只有在完整正文已录入、来源版本已冻结、译者说明和许可记录已补齐时，才能建立完整译文权威内容项。由 Codex AI 完成时，使用 `translationAuthority: codex_ai_complete`、`humanReviewStatus: not_required`、`internalLearningStatus: authoritative`、`publicationStatus: internal-ready`。

### 导读到已授权完整译文

开放许可或书面授权证据、完整正文、第三方素材边界与署名说明必须齐全。人工双语复核不再是内部使用的门。公开发布仍是另一次独立状态迁移：必须将 `publicationScope` 显式改为 `public`，记录公开发布决定，并重新核对当时的权利与第三方内容范围。

### 中文原文到已授权转载

中文来源不进入翻译状态。只有书面转载权或可复用开放许可、完整正文和第三方素材边界齐备时，才能进入 `authorized_zh_republication`。

## 8. 下一个内容工作包

1. 系统单元 7：“规则、教学与查询”。
2. 系统单元 8：“呈现、生产与发布”。
3. 第一份完整“从设计师角度分析游戏”学习入口与案例路径。
4. 保持 16 项权威内容的权利、事实、推断与教学样例边界，不为增加正文而扩张一级 UI。

## 9. 权利边界

这份契约是产品与编辑门禁，不是法律意见或最终授权结论。`legalReviewStatus: not_reviewed` 和 `legalApprovalClaimed: false` 必须如实保留。将内部主版改为公开发布是另一个产品与权利决定；是否需要专业法律复核应在那次决定中单独确定，不由本契约自动声称完成。

## 10. 当前验证证据

| 命令 | 结果 | 覆盖范围 |
| --- | --- | --- |
| `pnpm qa:resource-learning-content` | **59/59 通过** | 18 份资源基线、16 项权威白名单、8/3/5 精确分布、新增三份正文、元数据、审计与事实/推断/权利边界 |
| `pnpm exec tsc -b --pretty false` | 通过 | 当前 TypeScript 项目检查 |
| `pnpm content:check` | 通过 | 完整内容门与现有派生数据、入口、权利、发布边界检查 |

因此，当前可以声明“学习内容与权利契约通过”：资源级基线仍为 18 份 `guide_only`，站内权威正文为 16 项，精确构成为 8 项原创完整学习内容、3 项已授权完整译文和 5 项原创案例综合。
