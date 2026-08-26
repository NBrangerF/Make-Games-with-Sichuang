# Phase 1 交接：谈判、承诺、交易与联盟

日期：2026-08-20  
状态：内容与静态验证完成；浏览器和真人形成性测试未完成。  
接续基线：367 resources / 367 assessments / 18 entry points / 195 claims / 23 special guides / 158 glossary terms

## 本轮目标

把“允许自由谈判”从一句社交许可，改写为新手能执行和测试的结构：谈判对象、外部选项、报价生命周期、约束时机、违约成本、信誉、联盟第三方与退出，以及沟通渠道。

## 完成内容

- 新增研究报告 `docs/research/NEGOTIATION_COMMITMENT_ALLIANCE_01.md`，含 5 个子问题、22 来源矩阵、综合结论和证据边界；
- 新增 20 条资源及逐条评估，覆盖设计师/出版日志、规则书、承诺/联盟实验、在线 Diplomacy 研究、无障碍研究、专家长评和玩家讨论；
- 新增 10 条 Claim：筹码/外部选项、交易生命周期、约束性、预期、违约成本、承诺组件、联盟第三方、联盟退出、谈判渠道和历史轨迹；
- 新增 12 个规范术语：`negotiation-object`、`outside-option`、`deal-lifecycle`、`binding-deal`、`nonbinding-promise`、`conditional-promise`、`settlement-timing`、`breach-cost`、`reputation-state`、`coalition`、`alliance-exit`、`negotiation-channel`；
- 新增第 23 篇专题指南 `special-negotiation-commitment-contract`：“别先写‘可以自由谈判’，先写一句承诺怎样变成结果”；
- 新增第 18 个任务入口 `negotiation-commitment-alliance`；
- 新增简版指南 `docs/guides/NEGOTIATION_COMMITMENT_CONTRACT.md`；
- 新增形成性协议 `docs/product/USABILITY_TEST_NEGOTIATION_COMMITMENT_CONTRACT.md`；
- 更新 README、索引、路线图、来源台账、研究问题、资源维护、产品数据模型、资源发现、MVP、方法按需加载、保真账本与浏览器 QA 契约。

## 核心内容决定

1. 不把“可交易项目数量”当谈判深度，必须同时写差异价值、杠杆和外部选项。
2. 一项交易按报价、反报价、接受、记录、结算、到期、违约与修复描述；未成交和撤回也可以进入观察。
3. 约束性按条款和时机切分；同一报价可以同时包含立即约束与未来非约束部分。
4. 承诺即使不受规则强制也可能改变预期；系统损失、局内信誉和情绪后果分轨。
5. 承诺组件被建模为对象、记忆与转让界面，不自动视为更好。
6. 联盟必须记录非成员外部效应、到期、退出生效与共同资产处理。
7. 公开/私下、顺序/同时、口头/书面与限时渠道是参与接口，需要无障碍观察。
8. kingmaking 与背叛不只看最后一手，要与此前互惠、威胁、救援和违约动作对齐。

## 深读与受限来源

完成全文/文章级深读的关键来源包括 Wehrle《Quid for your Quo》、Crescent Moon/Oath/President 设计日志、TI4 与 King's Struggle 交易规则、《Chinatown》无障碍拆解、Diplomacy 语言背叛研究及形式谈判论文。

受限项：

- `golden-blade-promise-diary` 本轮正文抓取失败，只作元数据案例入口；
- `zoo-vadis-publisher-diary` 返回 403，只作元数据案例入口；
- 多项实验只取得摘要，资源审阅标为 `metadata_only`；
- TI4 页面是规则汇编镜像，应在可联网环境回查官方当前规则；
- 在线英文 Diplomacy、实验室信任任务、四场质性会话和 Reddit 均不代表同桌中文玩家总体。

## 验证证据

- `pnpm resources:health`：367 条全部为 `error`，`dead 0`；这是当前 shell 网络失效，不是来源死亡；
- `pnpm content:indexes`：367 条资源索引、158 条概念索引；
- `pnpm content:check`：367 resources / 18 entry points / 195 claims / 5 frameworks / 6 core guides / 23 special guides / 158 terms / 367 assessments / 22 cards / 50 local files；
- 贡献包：安全默认值、有效候选与 11 个发布守卫通过；
- `node --check scripts/qa-site.cjs` 通过；
- `pnpm check` 通过；
- `pnpm build` 通过：Vite 8.2.1，33 modules，105 ms；CSS 48.74 kB（gzip 8.30）、method 329.38 kB（gzip 113.45）、main 449.46 kB（gzip 137.24）、resource 519.93 kB（gzip 141.98）。资源 chunk 超过 500 kB 并触发警告，未作为浏览器性能结论。

## 未完成与下一步

- 浏览器 QA 未重跑且不声明通过；阻塞仍见 `docs/product/BROWSER_QA_BLOCKER.md`。
- 形成性测试尚未真人执行；需要中文新手、主要人数、不同熟人关系与至少一名不偏好快速口头竞争或需要替代表达的参与者。
- 需要补中文设计师谈判系统迭代、中文第一人称背叛/联盟/排斥经验、听障/言语障碍玩家资料，以及公开/私聊和顺序/同时版本对比。
- 浏览器可用后先取得资源 chunk 的真实网络瀑布与长列表交互证据，再决定是否继续拆分资源目录。
- 下一内容包可继续研究“竞价、拍卖、市场定价与价值发现”，复用本轮对象、外部选项、结算时机与渠道概念，但不要把谈判直接等同拍卖。
