# 《Game Design Concepts》第 2 关翻译与来源说明

日期：2026-08-21  
状态：Codex 来源、结构、术语与授权核验完成  
内部版本属性：`internal-learning-authoritative`  
译文：`content/translations/game-design-concepts-level-02-zh-CN.md`

## 1. 原文身份

- 准确标题：*Level 2: Game Design / Iteration and Rapid Prototyping*
- 作者：Ian Schreiber
- 原文发布日期：2009-07-02
- 官方页面：https://gamedesignconcepts.wordpress.com/2009/07/02/level-2-game-design-iteration-and-rapid-prototyping/
- WordPress 官方 API 文章 ID：31
- 本轮取回日期：2026-08-21

原文页面、课程 About 页面与 Creative Commons 官方许可证页面本轮均返回 HTTP 200。

## 2. 授权依据

课程 About 页面明确声明 *Game Design Concepts* by Ian Schreiber 使用 Creative Commons Attribution 3.0 United States License，并允许分享、复制、传播和改编，前提是为 *Game Design Concepts* 与 Ian Schreiber 署名。

- 课程授权证据：https://gamedesignconcepts.wordpress.com/about/
- 许可证说明：https://creativecommons.org/licenses/by/3.0/us/

CC BY 3.0 US 允许复制和改编，因此允许制作中文翻译。译文已在标题区和页尾：

1. 标出原作者与课程名；
2. 链接原始文章；
3. 链接许可证；
4. 说明中文翻译、Markdown 转换和图片替代文字属于改编；
5. 说明不构成原作者或第三方背书。

## 3. 完整翻译范围

本轮翻译 WordPress API 返回的文章正文，包含：

1. 与 Level 1 的衔接；
2. 三条课程公告；
3. 游戏设计与游戏开发的区分；
4. 六类设计任务与系统设计范围；
5. 设置、进行、结束三类规则；
6. 游戏设计师的七种跨领域比喻；
7. 瀑布式方法；
8. 迭代式方法；
9. 五步科学方法类比；
10. 快速原型；
11. 设计、实现和市场风险；
12. 课程选择非数字游戏的理由；
13. “改一处再重玩”的完整练习；
14. 两条课程结论；
15. Homeplay 阅读。

不在翻译范围内：读者评论、WordPress 导航、侧栏、订阅组件和页脚。这些不是文章正文。

## 4. 图像与外部来源

原文包含三张课程流程图：瀑布式、迭代式、迭代与快速原型。Markdown 译文保留官方图像 URL，并为每张图增加简短中文替代文字。没有重新绘制图中关系，也没有把替代文字写成超出原图的新理论。

原文提到的 *Challenges for Game Designers*、*A Theory of Fun*、Costikyan 与 Doug Church 文章只保留 Ian Schreiber 在本课中的介绍、书名、作者和原链接，没有复制这些外部作品正文。末尾 *Formal Abstract Design Tools* 的链接语义保持为后续阅读，而不是本站转载。

## 5. 术语决策

| 原文 | 当前内部译法 | 边界 |
|---|---|---|
| game design | 游戏设计 | 在本文中指创造规则与内容，不扩成全部开发工作 |
| game development | 游戏开发 | 本课对制作全流程的总称 |
| system design | 系统设计 | 保留 systems design / core systems design 别名 |
| rules for setup | 设置规则 | 对应初始状态与开始方式 |
| rules for progression of play | 游戏进行规则 | 不缩为回合规则，因为游戏可能没有回合 |
| rules for resolution | 结束规则 | 包含结束触发与结果决定，不只等于计分 |
| waterfall method | 瀑布式方法 | 保留单向流程含义 |
| iterative approach | 迭代式方法 | 指设计、实现、评估和返回修改的循环 |
| rapid prototyping | 快速原型 | 保留“尽快形成可测试实现”的课程语义 |
| design risk | 设计风险 | 与实现风险、市场风险分开 |
| playtest | 试玩 | 当前课尚未进入本站更细的测试类型分类 |

## 6. 历史判断边界

本文写于 2009 年。以下内容作为原作者的课程立场完整保留，但内部使用时不能脱离来源升级为当前普遍事实：

- 对游戏设计与开发职业边界的定义；
- 对瀑布式方法历史与适用性的概括；
- “迭代越多，游戏越好”的强表达；
- 对电子游戏技术、美术、音频与玩法关系的判断；
- 对桌面角色扮演游戏和协作叙事的概括；
- 对首次原型时长和游戏长度的教学建议。

“内部学习权威版本”只代表项目采用这份中文文本作为 Level 2 的规范译本，不代表上述历史判断是本站自己的无条件结论。

## 7. Codex 核验契约

本版本不把人工双语复核设为内部使用前提。Codex 已执行：

- 通过课程官方页面和 WordPress API 核对标题、作者、日期与完整正文；
- 通过课程 About 页面与 CC 官方页面核对翻译授权；
- 按原文顺序逐节核对 15 个正文部分；
- 确认三个流程图、科学方法五步、三类风险和迭代练习均存在；
- 确认署名、原文 URL、许可证 URL、改编说明和不背书声明均存在；
- 确认元数据 JSON 可解析；
- 运行 Markdown 差异空白检查。

后续如发现原文版本变化、事实错误或更好的术语选择，可直接创建新译本版本并记录修订理由，不需要等待预设的人工签字门槛。
