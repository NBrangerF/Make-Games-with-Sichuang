# 机制、主题与案例内容维护

适用于 `49e9317` 之后的阅读实现。2026-09-11：96 篇库文章与 18 篇案例已发布；全范围最终验收仍在进行。正文审核记录保存在仓库之外，维护者需要同时取得内部研究交接包。只有 Git 仓库时可以运行、检查和改进页面，不能据此声称已读原书或完成新归因的回源核查。

## 冷启动

先读[现行扩展计划](../../plans/luozhuo-concrete-library-program-2026-09-10.md)，再检查本地与远端状态。保留现有未提交改动；不要通过重置或清空浏览器数据制造一个“通过”的环境。

```bash
git status --short --branch
git log -3 --oneline
node --version
pnpm --version
pnpm install --frozen-lockfile
pnpm dev
```

已验证的运行环境为 Node.js 24。部分检查直接运行含类型的 TypeScript，并使用 JSON import attributes；不要沿用早期文档的 Node.js 20 最低要求。使用现有 pnpm 与锁文件，不为研究另建计费 API 或服务。

本地打开以下 hash 路径。两语使用同一内容版本，语言代码为 `zh-CN`、`en`；练习是可选的。

| 入口 | 路径 |
|---|---|
| 机制、主题、教学、比较 | `#resources/library/all/zh-CN` |
| 第一教学单元 | `#resources/library/lesson-see-a-mechanism/zh-CN` |
| 游戏案例 | `#resources/cases/all/zh-CN` |
| 指定案例段落 | `#resources/cases/root/en?section=connected-wood` |
| 旧材料带入练习的接收页 | `#learn/first-tabletop` |

正式地址为 [落桌](https://luozhuo-tabletop-design.vercel.app/)。网址可用不等于新提交已部署；发布时另外核对提交、Production 部署与域名绑定。

## 数据放在哪里

| 文件 | 维护内容 |
|---|---|
| `content/design-library/catalog.json` | 96 项轻量公开目录：48 设计主题、24 题材/情境、12 教学、12 比较 |
| `content/design-library/<id>/{zh-CN,en}.md` | 同一个语义版本的两份原创正文 |
| `content/design-case-ids.json` | 案例公开 ID 清单 |
| `content/design-cases/<id>/meta.json` | 案例书目信息、两语段落标题、角度与具名开发回顾 |
| `content/design-cases/<id>/{zh-CN,en}.md` | 18 款游戏的双语分析 |
| `content/reading-path.json`、`content/original-articles/` | 原有 28 章主线、13 篇选读及过河案例 |
| `src/library-learning-path.ts` | 12 个教学单元的可选顺序与四个阶段 |
| `content/reading-search/{library,cases,articles}.json` | 从正文生成的全文索引；不手改 |
| `public/print-and-play/book-cart/{zh-CN,en}.pdf` | 原创《小书车》1.0.0，每语 3 页，含完整规则与单规则对照 |

目录中的 `mechanism`、`overview`、`pattern`、`structure` 不互换；题材 `theme` 与具体情境 `setting` 分开。BGG 的 `same-scope`、`local-narrower`、`local-broader`、`related` 是有方向的范围关系，不是搜索别名。`area-control` 总览与 `area-majority` 不能合并身份；BGG 的 Deck, Bag, and Pool Building 也不能把本站牌库和袋库两个 ID 合成一个。

## 新增或修订一篇

1. 在内部执行清单登记读者问题、稳定 ID、内容版本和受影响关系。按主张寻找已有证据；只有新主张或来源变化需要补读。候选清单不代表正文完成。
2. 记录来源版本、原文件 SHA-256、解析配置/缓存键、章节或原生锚点、实际阅读范围及证据类型。图像影响结论才查看原图。页码无法确认就留空。原文、缓存、摘录和待证主张留在内部目录。
3. 写原创自足过程：初始状态、可知信息、合法行动、成本、时序、冲突或平手、结束和新状态。比较明确固定什么、改什么；虚构例子不能推出真实玩家胜率、医学结论或普遍最优策略。
4. 核算所有数值与相关边界，再逐项校对两语的数字、否定、条件、行动权和结束规则。记录完整正文指纹。编辑审核与数值核算分开存证；自动格式门禁不能代替这一步。
5. 仅把已审内容和允许字段放入公开目录。案例段落标题须与两语正文的二级标题一致；段落 ID 保持稳定。开发回顾须有具名设计者的原始记录；游戏署名或出版商宣传不等于作者过程证据。
6. 更新关系、课程入口、必要的检索词和索引。旧稿复核结果只覆盖旧指纹；改动后做对应范围复核。纯导航措辞修改可以用精确差异复核，规则、数字、归因变化需要重算或回源。

公开目录允许的字段由 `scripts/design-library-contract.mjs` 定义。它会拒绝未知字段、缺失语言、未知关系或私人路径，但不会判断论证是否准确。已发布正文末尾可用简短书目或官方规则链接；正文应让读者不离站也能理解分析。网站不发布原书译文、整章精缩或复制练习。

## 验证与发布

正文改变后先重建索引；`pnpm build` 也会自动执行此步。

```bash
pnpm search:index
pnpm check
pnpm build
pnpm preview --host 127.0.0.1 --port 4192
```

完整构建会运行内容门禁、库目录和关系检查、案例角度检查、索引一致性、路由及阅读隔离检查。定点排错可使用 `pnpm qa:design-library`、`pnpm qa:case-discovery`、`pnpm qa:reading-search`、`pnpm qa:design-materials`、`pnpm qa:reading-support`。添加案例或教学单元会影响数量与顺序断言；先记录新范围，再调整断言，不能仅为通过测试删除门禁。

对于页面或行为改动，用真实浏览器检查两语、桌面和 390/320 宽度、中文/英文/混合查询、无结果、筛选、目录、刷新、前进后退、语言切换、课程进入并返回，以及未知文章/段落 ID 的恢复。预置空、现行、旧、损坏存储必须在页面脚本运行前完成；读取前后比较全部键和值。只在隔离测试站注入网络故障。加载失败时正文与页面模块均有恢复入口；完整断网或首页入口脚本下载失败不由应用内边界保证恢复。

旧 17 个机制与 12 个主题材料仍使用原有 ID。`src/first-tabletop-draft.ts` 只接收真实存在的材料 ID，未知值保留原数据并提示修复；新库 ID 不能未经映射直接带入实践。阅读不写实践记录，明确进入实践页则可能初始化既有学习状态。这两种行为分别验证，不把实践初始化误报为阅读写入。

发布只提交这一批审定文件。先核对远端分支，再按会话授权推送与部署。Production 就绪后检查部署元数据中的提交、两个既有域名指向及首页入口文件；有正文/PDF变化时核对对应资源的状态和字节指纹。不要因单次超时重复部署，也不要把 Preview 成功当作正式域名已更新。构建警告、实际测试范围、部署 ID 和线上核查结果写入该批记录。

回退使用已验证版本的部署或明确的反向提交；不要清除用户 localStorage。撤下文章时同时修订目录、关联、课程入口与搜索索引。保留历史 ID/版本记录，未知旧链接应进入可恢复的缺失页。

## 证据与成本怎么延续

内部交接包中的当前入口为 `执行清单.json`、`核查/C09-final/当前正文与证据核对.json`、`核查/C09-final/历史审核标记解释.json`、`索引/BuildingBlocks-203-使用与覆盖.json` 和每批 `发布结果.md`。文件名用于内部交接定位；不要将这些文件复制到仓库。

当前正文核对脚本覆盖 114 篇新增文章的 228 份正文，检查现稿到审核/发布记录的指纹连续性。它没有重新审阅全部论证。203 项书内索引区分历史精读、完整范围记录、部分阅读、仅索引；“来源阅读上下文”不代表自动采纳书内全部主张。历史的待审标记保留，后续审核以适用范围和最终指纹覆盖它，而不是批量改成 `true`。

每批记录缓存复用、实际补读、重算、构建和浏览器工作量。脚本运行秒数、文件数可以实测；无法观察的模型 token、账单记 `unknown`。不把工具脚本的秒数当作整个编辑过程耗时。当前没有真人学习效果测试或实体打印测试；这不由模型校读、PDF预览或自动测试替代。
