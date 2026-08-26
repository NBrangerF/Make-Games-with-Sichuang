# 战役、Legacy 与永久状态变化：研究记录 01

更新：2026-08-19  
状态：review；首轮证据综合完成

## 结论先行

战役测试不是把普通测试重复很多次。后续一局同时继承至少四条历史：

1. **规则历史**：本轮使用哪版规则，哪些规则在战役中才解锁、替换或删除；
2. **世界历史**：地图、牌库、剧情分支、资源与永久组件已经改变成什么状态；
3. **角色历史**：角色成长、伤痕、物品、退休或换手；
4. **玩家历史**：谁见过哪些秘密、参加或缺席过哪些局、掌握了什么策略和共同记忆。

这四条历史可能不同步。规则不变时世界仍会推进；同一世界里玩家会缺席或加入；玩家保留剧透记忆时，重置组件也不能恢复第一次揭示。故“v0.8 第三局”不足以识别测试条件。

本轮证据支持建立独立专题指南，但不支持通用战役长度、固定组人数、最低测试局数、完成率或 Legacy 优越性。指南的目标是让状态、迁移、剧透和退出可追溯，不是保证战役一定完成。

## 证据地图

### A. 何谓 Legacy 的不可逆性

- Ivan Mosca 把 Legacy 描述为叙事与材料的双重不可逆：规则、世界和组件留下永久痕迹，已经参与过的玩家也无法恢复第一次未知体验。文章是游戏研究理论论证，不是玩家效果实验或测试协议。
- Courtney Henderson 的硕士研究以反思分析和自我民族方法记录 Legacy 游戏创作，适合补充类型边界与创作过程；单一创作者学位作品不能代表行业标准。
- Matt Leacock 与 Rob Daviau 的 GDC 复盘显示，排序牌库、封装内容、贴纸、书写、撕卡、命名与伤痕共同承担揭示、依恋和跨局节奏；演讲主动提示轻微剧透，是一手设计复盘而非受控研究。
- 《Pandemic Legacy》官方页给出该产品的预计游玩范围与按月份遮蔽的 FAQ。它证明“查询也要按已揭示范围分层”，产品数字不能转成其他战役的设计目标。

**采用边界**：永久组件变化不是 Legacy 的全部；“破坏组件”也不是本站要推广的价值。真正影响测试的是无法简单重现的状态、知识与承诺。

### B. 战役机制必须跨越正确时间窗

- Phil Vecchione 的战役测试日志指出，一次性场景能测试基础机制，但跨故事推进、威胁成长、项目完成与角色退休只能在连续战役中观察；同时会遇到规则中途变化、角色重建、已删除内容和主持负担。这是 TTRPG 设计师实践，不是封闭式桌游实验。
- SeaFall 测试者的同期记录覆盖两年半：固定组有人退出后重招，原型更新要求把旧顾问等状态翻译到新规则，多个组在近似进度比较世界与策略，每局提交长报告。它直接显示“版本迁移”是需要记录的测试事件，但仍是单组第一人称回顾。
- Pretendo Games 的失败复盘显示，边跑朋友战役边大改角色数值，会把设计测试与完成共同故事的关系承诺混在一起；作者最终考虑把新版本交给新组、旧组按原状态继续。这支持允许“保存旧分支”而非强迫迁移。

**采用边界**：只有当目标机制需要多个章节才能出现，才承担完整战役成本。单条数值、行动经济或教学问题应先隔离测试。

### C. 缺席、加入与替补是状态变化，不是噪声

- Charterstone 官方 FAQ 允许战役中加入玩家，并按当前状态给出公平的容量、荣耀和其他资源；“公平”仍需当桌判断，不是公式。
- Charterstone 设计日志明确说同一组完成 12 局是理想但困难，因此支持临时或永久加入/退出，并允许 Automa 为缺席玩家代班。自动玩家保留桌面占位和部分竞争状态，却不是人类关系、记忆与决定权的等价替代。
- 官方设计日志还记录了逐步解锁规则的取舍：完全空白规则书容易漏掉重要基础，后来改成基础规则加逐步贴入的新规则。教学历史也因此属于战役状态。

**采用边界**：补偿、机器人、角色托管、跳过和暂停是不同的接续方法。都必须记录它保存了什么、替代了什么，以及缺席者回来后如何恢复决定权。

### D. 状态保管、远程接续与数字辅助

- Yuan 等人的 CHI 多方法研究记录，一名参与者借助实体棋盘和远程视频继续既有 Legacy 战役，以免转移状态或重开；这提示实体副本的保管位置会决定谁能继续。它是定性研究中的一个案例，不能外推为最佳方案。
- Rogerson、Sparrow 与 Gibbs 对 237 名玩家、18 名行业人员、关键游玩和 44 人卡片分类的混合方法研究，把桌游数字辅助拆成多个功能，包括内容、教学、计算和桌面管理。该模型能帮助说明数字存档承担什么工作，但不证明应用比纸张或实体改造更好。

**采用边界**：数字存档、重置包、第二副本或可移除贴纸都可能改变揭示、触感、所有权与恢复成本。只能声明功能替代，不能自动声明体验等价。

### E. 剧透、设置错误与知识不可回退

- WIRED 对 Betrayal Legacy 的报道记录，作者在读规则前把有序房间板块洗乱，使副本无法继续，并由设计师亲自恢复。这是一个记者的设置事故，却足以提示不可逆系统必须把“打开前不要做什么”、检测和修复前置。
- GDC 演讲与 Matt Leacock 官方 FAQ 都采用显式剧透边界：演讲先提示，FAQ 按月份展开。测试资料也应只暴露参与者已经到达的章节，避免用完整答案修复局部问题。
- Mosca 的“玩家不可逆”论证提醒：即使重建物理状态，玩家已经知道的揭示、风险和分支也不能被重置。

**采用边界**：单个严重设置事故不能证明所有玩家都会犯错。它适合生成首开盲测与修复路径问题，不适合估计发生率。

### F. 邻近但不能直接迁移的研究

- 2025 年合作桌游教育综述筛选 65 篇、细读 24 篇，并讨论渐进规则、教程场景、可伸缩模式、复杂度与时长。其目标是教育适配，且混入 BGG 与评论资料；不能据此主张 Legacy 的教育效果或市场比例。
- 远程桌游与混合数字桌游研究能支持共享状态、共同信息和数字功能的设计问题，但没有直接验证本站提出的战役测试表。

## 可执行的最小状态包

每次战役测试保存一张“状态护照”，至少包含：

| 字段 | 记录什么 | 为什么不能合并 |
|---|---|---|
| `rules_version` | 当前原型/规则版及本局新旧规则 | 规则更新不等于世界推进 |
| `campaign_state_id` | 当前世界快照的唯一标识 | 同版规则可有不同分支 |
| `scenario_or_chapter` | 本局实际到达位置 | 只写第几局无法说明内容 |
| `revealed_content_scope` | 逐人已知的章节、包或秘密范围 | 玩家知识不可物理重置 |
| `permanent_component_changes` | 贴、写、撕、移除、排序、封装变化 | 需要复核、迁移或停止 |
| `player_history` | 参与、缺席、剧透与熟练史 | 不等于角色等级 |
| `character_history` | 成长、伤痕、物品、退休、换手 | 可由不同玩家继承 |
| `attendance_change` | 缺席、加入、替补、回归 | 改变关系与信息流 |
| `handoff_or_catchup_method` | 补偿、摘要、托管、机器人、暂停 | 各自保存/牺牲不同信号 |
| `branch_and_retry_status` | 首次、重试、回滚、并行分支 | 重试者已失去未知性 |
| `spoiler_and_recording_consent` | 可看、可记、可共享范围与撤回 | 保护体验与参与权 |
| `exit_reset_transfer_decision` | 退出后副本、记录、角色和群体安排 | 所有权不是默认答案 |

快照只记录状态变化和内部编号；公开资料不得复制未获许可的隐藏卡文、贴纸、谜题答案或分支全文。

## 测试序列

1. **先选跨局机制**：只追一个必须经过多个章节才会出现的循环，如资源结转、角色退休或分支后果；若一局能回答，退回定向测试。
2. **冻结起点**：建立规则版、世界状态、逐人知识范围和组件快照；写清哪些状态允许迁移、哪些改变后必须新分支。
3. **逐局记差异**：不重抄全局，只记本局揭示、永久改造、角色变化、缺席/加入和未预期状态。
4. **版本变更先做迁移决定**：继续旧分支、把状态映射到新版、复制为并行分支，或由新组从头测试；不把迁移后的局次接在原熟练曲线上。
5. **回访接续成本**：下一局开始前观察谁能重建状态、谁拥有解释权、缺席者如何恢复选择，以及错误能否被发现和修复。
6. **允许安全结束**：玩家可退出、跳过永久改造或停止记录；明确副本、角色、资料和未揭示内容如何保留、转让、重置或删除。

## 可追溯主张候选

1. 战役测试条件至少要分开规则、世界、角色和玩家历史。
2. 玩家已知内容不能靠重置组件恢复；首次揭示与重试证据不可混用。
3. 原型版本迁移本身是设计事件，必须声明映射、损失和分支。
4. 缺席接续方法只能说明保存了哪些功能，不能把机器人、补偿或托管称为人类参与等价物。
5. 不可逆系统需要首开前的预防提示、错误检测与可说明的修复/停止路径。
6. 跨局机制要在能触发它的时间窗测试，但完整战役不是所有问题的默认方法。

## 明确不做

- 不把玩完整个战役当质量、忠诚或能力证明。
- 不规定所有组必须固定、不得缺席或必须用某种补偿。
- 不为研究完整性要求玩家继续不愿接触的剧情、永久改造或记录。
- 不在公开文档复制隐藏内容、贴纸文本、卡牌、谜题或分支答案。
- 不把重置包、数字模拟、第二副本、机器人或可移除贴纸与第一次实体体验称为自动等价。
- 不把缺席、换角、补位、暂停或退出自动解释成游戏失败。
- 不从单款游戏的 12、18 或更多局数推导通用战役长度。

## 本轮来源

1. Ivan Mosca, *Legacy’s Legacy: Irreversibility and Permadeath in Legacy Games* — https://analoggamestudies.org/2017/01/legacys-legacy-irreversibility-and-permadeath-in-legacy-games/
2. Courtney Henderson, *Ludicrous Legacies and Legacy Ludology* — https://openrepository.aut.ac.nz/items/82b45cf6-5cd7-4924-9097-4ce988e5e95d
3. Matt Leacock & Rob Daviau, *The Making of Pandemic Legacy* — https://www.gdcvault.com/play/1024300/Board-Game-Design-Day-The
4. Matt Leacock, *Pandemic Legacy: Season 1* — https://www.leacock.com/pandemic-legacy
5. Jamey Stegmaier / Stonemaier Games, *Charterstone Design Diary* — https://stonemaiergames.com/games/charterstone/design-diary/
6. Stonemaier Games, *Charterstone FAQ* — https://stonemaiergames.com/games/charterstone/faq/
7. Board Game Fight Club, *The Seafall Playtester Experience* — https://www.boardgamefightclub.com/articles/The-Seafall-Playtester-Experience/
8. Phil Vecchione, *Design Flow: Campaign Playtesting* — https://gnomestew.com/design-flow-campaign-playtesting/
9. Pretendo Games, *Playtesting Perils* — https://pretendo.games/2018/12/23/playtesting-perils/
10. Pia Ceres, *How the Betrayal Legacy Board Game Tells a Story Over 13 Games* — https://www.wired.com/story/board-game-design-betrayal-legacy-rob-daviau/
11. Ye Yuan, Jan Cao, Ruotong Wang & Svetlana Yarosh, *Tabletop Games in the Age of Remote Collaboration* — https://dl.acm.org/doi/fullHtml/10.1145/3411764.3445512
12. Melissa J. Rogerson, Lucy A. Sparrow & Martin Gibbs, *Unpacking Boardgames with Apps* — https://dl.acm.org/doi/fullHtml/10.1145/3411764.3445077
13. Menelaos N. Katsantonis, *From Pandemic Legacy to Serious Games* — https://onlinelibrary.wiley.com/doi/10.1111/ejed.70048

## 后续验证

- 用 5–7 名中文新手检查能否区分四条历史，而不是把表格理解为完整战役日志。
- 至少加入一名真实缺席后回归者与一名战役主持者走读“接续方法”字段。
- 用无剧透虚构样例验证参与者能否在 12 分钟内完成状态护照。
- 浏览器可运行后验证专题方法页在手机上不会因状态表述过长而失去层级。
- 继续寻找中文 Legacy/战役测试的同期设计日志、退出经验和状态迁移案例；目前中文证据仍明显不足。
