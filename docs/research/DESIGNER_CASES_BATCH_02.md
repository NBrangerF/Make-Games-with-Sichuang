# 设计师怎样思考：第二批案例来源审计 02

日期：2026-08-22  
状态：两篇原创中文案例综合已完成，并已接入 V2 学习入口  
范围：补齐首批未覆盖的“规则书作为使用界面”与“生产限制进入机制”两类决定

## 结论先行

第二批只增加两篇，不继续扩张列表：

1. James Naylor / Paul Grogan：《Producing Fun #4: Paul Grogan — Rulebook Editor & Content Creator》
2. Nat Levan / Oakleaf Games：《Manufacturing as a Design Tool》及两页《New Bedford》一手补充记录

它们进入本站的方式均为 `original_case_synthesis`，不是来源全译。两项来源都能免费读取完整正文，但没有发现文章级开放翻译或再发布许可。本站只重新组织必要事实、从业者观点、未知项和可执行迁移动作；不复制访谈逐字稿顺序、图片、评论、音频或长段表达。

## 为什么不是继续找“成功机制故事”

首批三篇已经覆盖：

- 减少同时变化的变量；
- 用一张牌连接两套机制；
- 删除旧组件后识别隐藏依赖。

如果第二批仍然加入牌组构筑、资源平衡或机制组合案例，阅读数量会上升，但课程阶段没有变宽。主计划已经冻结第二批优先补单元 7“规则、教学与查询”和单元 8“呈现、生产与发布”。因此本批以工作阶段而不是设计师知名度筛选。

## 选择矩阵

| 候选 | 决定是否具体 | 与首批差异 | 新手能否独立读 | 一手性 | 结果 |
| --- | --- | --- | --- | --- | --- |
| Paul Grogan 长访谈 | 有：编辑何时介入、文本交接后是否继续复核 | 补规则结构与排版交接 | 需要术语脚手架，但不要求玩过游戏 | 主持人与受访者完整逐字稿 | 采用 |
| Nat Levan 制造文章 | 有：二十建筑、移动组件、删除重复资源 | 补生产约束与状态编码 | 桌面物件具体，适合新手 | 设计师本人日志 | 采用 |
| Jack Neal 塑料盒日志 | 有：小批包装成本与作品气质取舍 | 也补生产阶段，但范围较窄 | 易读 | 设计师本人日志 | 保留为后续对照，不与本批同时加入 |
| Garret Rempel 规则书文章 | 过程建议丰富，但不是一条单项目决定轨迹 | 补教学与查询 | 易读 | 设计师本人观点 | 作为规则案例补充来源，不单列案例 |
| 规则编辑学术/访谈资源 | 能补研究或职业经验 | 与无障碍论文全译部分重叠 | 负担较高 | 混合 | 暂不增加 |

## 案例 04：排版后的规则回归

- 站内资源 ID：`naylor-paul-grogan-rulebook`
- 站内案例 ID：`paul-grogan-rulebook-layout-case-synthesis-zh-CN-internal`
- 来源：<https://naylorgames.com/blogs/blog/producing-fun-4-paul-grogan-rulebook-editor-content-creator>
- 补充来源：<https://www.tricorngames.com/designer-blog/2017/7/4/ruling-the-roost>
- 核心决定：规则编辑不能在纯文本交付时自动结束；最终页面还需要检查信息时机、标题层级、例图位置、箭头、分栏和查询路径。
- 主要学习动作：用教学任务与查询任务建立基线，排版后做一次规则回归，再让陌生玩家完成设置、首回合和争议查询。
- 证据边界：职业访谈提供大量实践报告，却没有排版前后对照实验、任务成功率或统一成本数据。

成品：

- `content/guides/paul-grogan-rulebook-layout-case-synthesis-zh-CN-internal.md`
- `content/guides/paul-grogan-rulebook-layout-case-synthesis-zh-CN-internal.metadata.json`
- `docs/research/SOURCE_VERIFICATION_PAUL_GROGAN_RULEBOOK_LAYOUT_SYNTHESIS.md`

## 案例 05：生产限制作为设计输入

- 站内资源 ID：`oakleaf-manufacturing-design-tool`
- 站内案例 ID：`new-bedford-manufacturing-constraint-case-synthesis-zh-CN-internal`
- 主要来源：<https://oakleafgames.wordpress.com/2014/03/24/manufacturing-as-a-design-tool/>
- 补充来源：<https://oakleafgames.wordpress.com/2013/10/13/notes-from-new-bedford-part-5-goods-and-money/> 与 <https://oakleafgames.wordpress.com/games/new-bedford/>
- 核心决定：用一张纸容纳的二十座建筑冻结早期内容范围，让建筑移动代替额外所有权标记；铁因与砖功能重复被删除，加工木材则同时涉及复杂度反应与独立组件成本。
- 主要学习动作：为每个组件写出工作，制作“专用件／复用版／删除版”三个比较版本，同时记录误读、查找、误碰和状态恢复。
- 证据边界：二十是早期版本与打印条件，不是普遍平衡常数；文章没有测试样本、生产报价或各项改动的独立效果。

成品：

- `content/guides/new-bedford-manufacturing-constraint-case-synthesis-zh-CN-internal.md`
- `content/guides/new-bedford-manufacturing-constraint-case-synthesis-zh-CN-internal.metadata.json`
- `docs/research/SOURCE_VERIFICATION_NEW_BEDFORD_MANUFACTURING_SYNTHESIS.md`

## 权利与完整性决定

两篇都遵守同一边界：

- 来源完整可读，不等于获得完整翻译与再发布权。
- 本站案例完整覆盖八个学习维度，不声称完整覆盖来源全部表达。
- Codex 是原创综合生产主体；`humanReviewRequired` 与 `humanReviewStatus` 均不设置人工前置门。
- `publicationStatus` 为 `internal-ready`，`publicReleaseEnabled` 为 `false`。
- 原作者、来源、未授权全译边界与直接引语数量写入 metadata。
- 当前读者可以在站内完成完整学习动作，不必跳到外部页面才能理解案例。

## 接入顺序

案例列表由三篇扩展为五篇，但不增加新筛选器、标签行或二级入口：

1. 变量控制
2. 机制连接
3. 隐藏依赖
4. 规则交接
5. 生产约束

排序仍表达认知梯度，不表达作品或作者排名。列表文案只显示问题标题与一句结果；来源、权利和详细边界留在正文末尾。

## 下一批暂不执行

- Jack Neal 的小批塑料盒案例可在需要比较“系统生产”和“包装渠道”时加入，但本轮不扩到第六篇。
- 不因无障碍规则书论文已全译就再制作同内容案例；论文放在“完整来源译文”，实践案例保持不同任务。
- 在五篇的真实阅读路径完成测试前，不增加作者筛选、阶段徽章、游戏封面或案例评分。
