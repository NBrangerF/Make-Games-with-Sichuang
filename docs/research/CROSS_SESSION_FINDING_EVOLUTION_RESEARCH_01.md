# 跨轮次发现演化研究 01

日期：2026-08-21  
阶段：测试与反馈  
产出：资源入口 `cross-session-finding-evolution`、正式工具 `evidence-synthesis`

## 研究问题

当桌游设计师已经完成多场测试与单轮复盘，怎样比较不同版本、玩家经验、配置、媒介与主持条件中的发现，同时避免：

- 把出现次数当严重度或优先级；
- 把不同版本当成重复验证；
- 让熟练测试组替代新玩家首次局；
- 用多数支持材料吞掉反例；
- 从前后版本差异直接推出因果；
- 让综合结论静默改写项目待办。

## 检索记录

本轮围绕四组问题检索并逐篇核验：

1. qualitative framework matrix / within-case and across-case comparison / provenance；
2. longitudinal qualitative matrix / trajectory vs recurrent cross-sectional analysis；
3. negative case analysis / contradictory evidence / rival explanation；
4. board game designer diary / version log / familiar vs fresh playtesters。

检索覆盖学术全文、政府用户研究指南、软件团队一手仓库实践、桌游设计师博客与 BoardGameGeek 设计日志。PMC 直接打开曾触发 reCAPTCHA，后续通过搜索索引、期刊页与 DOI/全文入口交叉核对。Firecrawl 与 Exa 在当前环境中不可用，因此没有声称完成全网穷尽式抓取。

## 关键来源与能支持的动作

### 1. 矩阵必须保留个案与原始资料入口

[Framework Method](https://bmcmedresmethodol.biomedcentral.com/articles/10.1186/1471-2288-13-117) 用个案×代码矩阵支持个案内和个案间阅读，并要求摘要可回到原始资料。它支持本站把每份已完成复盘作为一行、保存版本/语境与直接证据引用；不支持自动聚类、票数阈值或严重度。

[纵向矩阵案例](https://pmc.ncbi.nlm.nih.gov/articles/PMC9442150/) 用主题×时间点查看变化轨迹，并在代码本变化时重编早期材料、保留备忘和审计轨迹。本站采用“按时间排序、记录判断变更理由”，不采用代码密度作为桌游发现的重要性。

[纵向分析方法比较](https://pmc.ncbi.nlm.nih.gov/articles/PMC4776420/) 区分重复横截面比较与同一对象轨迹分析：研究问题、样本连续性和时间点关系决定读法。桌游版本、玩家组和任务经常同时变化，所以工具要求显式写可比边界，禁止把跨版本材料称作复现。

### 2. 反例需要改变概念，而不是被投票覆盖

[Negative Case Analysis](https://journals.sagepub.com/doi/10.1177/16094069211045473) 将与当前概念矛盾的材料视作继续发现、扩展、收窄或推翻概念的入口，并强调未被代表的观点。本站因此提供“支持 / 反驳 / 收窄 / 不可比 / 仅作背景”关系，以及“暂定 / 保留 / 收窄 / 拆分 / 被反驳 / 退役”生命周期；不生成支持率或置信分。

### 3. 发现可以保存，但不必立即成为任务

[GitLab UXR Insights Repository](https://about.gitlab.com/blog/building-a-ux-research-insights-repository/) 把单项发现与支持证据、研究背景和行动分开；旧报告可与新研究三角互证，有些发现需要更多证据而不立即可行动。本站据此使用独立综合存储，并要求设计师另行点击“复制为项目下一步”。这是一家公司的一手流程回顾，不是桌游研究成熟度标准。

### 4. 桌游版本变化暴露局部适应与多重效果

- [MIND MGMT 设计日志](https://boardgamegeek.com/thread/2384661/wip-mind-mgmt-designer-diary)：反复使用大致相同的两组熟悉玩家，建议逐渐造成内容与复杂度增长；公开的新鲜测试者无法获得相同体验。它支持“熟练组不是首次局复现”。
- [Daybreak 设计日志](https://boardgamegeek.com/blog/1/blogpost/163737/designer-diary-daybreak)：危机预告经历无、三张、两张到一张，改动同时改变可预测性、信息负担和紧张感。它支持记录一个改动的收益与损失，不支持最佳预告数量。
- [Hegemony 设计日志](https://boardgamegeek.com/blog/1/blogpost/145459/designer-diary-hegemony-lead-your-class-to-victory)：熟练测试让实际时长问题被逐渐习惯，新玩家重新暴露它；减少轮数或行动又影响政策效果和不同角色。它支持新手/熟练语境分开与竞争解释。
- [Playtesting with Purpose](https://www.tricorngames.com/designer-blog/2017/8/26/playtesting-with-purpose)：要求记录游戏、版本、参与者、目的，把问题与方案连接，并尽量缩小每版改动范围。它支持版本化来源和改动轴，不提供因果认证。

## 产品综合

### 比较单位

比较单位是“已完成的单轮复盘”，不是原始事件数量。每份来源快照冻结：

- 复盘与会话 ID；
- 来源版本、目标版本、日期；
- 本场问题、玩家/配置/媒介语境；
- 单轮发现、适用条件、反证；
- 改动轴与具体改动；
- 已选直接证据引用。

### 四步工作流

1. **选择复盘**：设计师显式选择至少两份已完成复盘。
2. **建立可比边界**：写共同问题、可比较条件、关键差异与明确不可比部分。
3. **检查演化**：逐份人工标记关系，时间排序并回查直接证据。
4. **决定下一步**：保留生命周期、处理理由、没有声称什么、下一轮唯一比较与可选拆分分支。

### 禁止自动化

工具不得：

- 自动选择、聚类、合并或命名发现；
- 用支持数量、事件数或人数自动投票；
- 生成严重度、置信度或优先级；
- 把不同版本、玩家组或媒介称为重复验证；
- 从版本前后差异推出改动因果；
- 自动退休旧发现或静默改写项目。

## 仍缺证据

- 中文独立桌游设计师怎样跨月维护测试日志与发现沿革；
- 单人设计师在低记录负担下能否稳定完成可比边界；
- 同一组长期战役玩家与新玩家材料怎样并列而不混同；
- 反例、不可比与“来源质量不足”的中文标签是否容易理解；
- 来源撤回后，外部导出、协作副本与机构保留政策的处理。

这些缺口进入可用性脚本与后续访谈，不由当前界面自动补全。
