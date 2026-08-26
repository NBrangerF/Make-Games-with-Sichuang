# Phase 1 交接：中文实践资料扩展 01

日期：2026-08-18  
项目状态：长期目标仍在进行；本交接只完成中文实践资料的一轮扩展，不代表网站或研究总体完成。

## 本轮目标

在既有英文学术、设计师与平台资料之外，补充能直接服务中文新手的设计日志、公开测试记录、设计辅助产品与编辑/行业角色材料；同时避免把个人经验、商业宣传与旧行业数字包装成通用理论。

## 完成内容

### 1. 检索与深读

- 用简体/繁体组合检索大陆、台湾与香港来源；
- 深读机核、少数派、奶牛关、Taiwan Boardgame Design、香港青年空间和澎湃号原页面；
- 筛除课程宣传、来源不明转载、只有摘要且无法复核的页面，以及无可审阅内容的自动生成播客；
- 明确记录用户投稿、禁止转载、商业产品、回顾性成功叙述与旧行业数据的边界。

研究产物见 [中文桌游设计实践资料扩展 01](../research/CHINESE_PRACTICE_01.md)。

### 2. 机器内容增长

| 内容 | 本轮前 | 本轮后 |
|---|---:|---:|
| 资源 | 164 | 176 |
| 逐资源审阅 | 164 | 176 |
| 可追溯 Claim | 83 | 89 |
| 任务型阅读入口 | 4（每条 6） | 4（7/8/8/8） |
| 理论框架 | 5 | 5 |
| 概念词条 | 67 | 67 |

中文资源由 12 条增至 24 条；这只是覆盖增长，不代表地区、玩家或作者已经具有代表性。没有把本轮作者方法升级为理论框架，也没有因增加来源而创造新术语。新增 12 条来源分别覆盖：

- 机制/配件设计辅助产品；
- 胜利条件、规格限制与测试演变；
- 配件—机制—流程结构拆解；
- 规则设计与产品编辑职责；
- 两篇进行中的独立设计日志；
- 台湾每周/每月公开测试记录；
- 重度战棋的测试、TTS、规则、版本和打样维护；
- 香港设计师与出版社编辑访谈；
- 日常情境到机制表示与主题迁移；
- 2021 年中国设计师角色行业快照。

### 3. 新增综合边界

六条新 Claim 明确：

1. 设计日志保存目标与决定链，不自动证明因果或普遍效果；
2. 公开测试活动记录能建立时间线，但支持改动需要版本与测试语境；
3. 设计辅助牌组生成候选，不证明创意或测试效果；
4. 结构拆解产生比较空间，不由描述直接推出最优体验；
5. 游戏能运行与玩家能使用是两种完成状态；
6. 中文行业访谈是历史语境，市场数字与费率要按行动日期重查一手资料。

### 4. 产品入口调整

四条任务型阅读入口补入中文来源：

- 第一次做原型：增加《鉴定公司》开发回溯；
- 第一次外部测试：增加 TBD 公开测试记录与重度战棋测试复盘；
- 规则与教学：增加桌游编辑角色与规则/TTS/版本同步案例；
- 生产与发布：增加香港投稿访谈与中国设计师角色快照。

默认第一入口现在展示 7 条，其余展示 8 条；网站“查看全部”动态显示 176 条。回归脚本和可用性测试契约已同步。

## 修改文件

- `content/resources.json`
- `content/resource-assessments.json`
- `content/claims.json`
- `content/resource-entry-points.json`
- `docs/research/CHINESE_PRACTICE_01.md`
- `docs/research/SOURCE_LEDGER.md`
- `docs/research/RESEARCH_QUESTIONS.md`
- `docs/research/RESOURCE_MAINTENANCE.md`
- `docs/research/resource-health.json`
- `docs/product/CONTENT_DATA_MODEL.md`
- `docs/product/GLOSSARY_AND_RESOURCE_EVALUATION.md`
- `docs/product/RESOURCE_DISCOVERY.md`
- `docs/product/MVP_SPEC.md`
- `docs/product/FIDELITY_LEDGER.md`
- `docs/product/USABILITY_TEST_RESOURCE_DISCOVERY.md`
- `docs/ROADMAP.md`
- `docs/INDEX.md`
- `scripts/qa-site.cjs`
- `README.md`

## 验证证据

通过：

- `pnpm resources:health`：生成覆盖 176 条来源的完整快照；受限环境结果为 `reachable 0 / blocked 0 / dead 0 / error 176`，不自动删除来源；
- `pnpm content:check`：`176 resources / 4 entry points / 89 claims / 5 frameworks / 6 core guides / 10 special guides / 67 terms / 176 assessments / 22 cards / 50 local files`；
- `node --check scripts/qa-site.cjs`：通过；
- `pnpm check`：TypeScript 通过；第一次与语法检查并行运行时进程被系统以 137 终止，随后独立重试通过；
- `pnpm build`：通过；CSS 48.55 kB（gzip 8.23 kB），JS 744.81 kB（gzip 217.94 kB）。

未完成：

- `pnpm qa` 无法启动 Vite preview：`listen EPERM 127.0.0.1:5175`；因此本轮没有真实浏览器点击、控制台或新截图证据；
- 系统限制不允许把链接快照的网络错误解释成来源失效；本轮网页内容核验来自检索与深读，而不是本地巡检脚本；
- 新增摘要尚未由第二位中文编辑复核。

## 权利与证据边界

- 机核明确禁止转载的文章与奶牛关两篇文章标为 `restricted`，本站只保留链接与原创摘要；
- 商业设计辅助牌组不复制牌面、52 项清单或作者私有模型；
- 众筹、销量、测试局数、市场额、版税和运费均不作为通用事实；
- 台湾测试会人数、频率与活动持续时间不是测试充分性标准；
- 香港访谈和大陆行业报道不能代表各地区全部设计师或玩家。

## 下一步建议

优先进行“玩家声音与中文反例”研究包，而不是继续增加同类教程：

1. 搜索中文玩家长评，把具体困惑、情绪与行为症状映射到设计问题；
2. 补合作、谈判、隐藏信息的中文失败复盘；
3. 寻找残障玩家参与桌游、规则与组件测试的一手中文材料；
4. 补香港与台湾独立设计师的纵向版本链；
5. 根据本轮设计辅助产品研究，为原创约束牌评估“状态载体/组件功能”轴，但先写研究规格并做用户测试；
6. 在允许绑定 localhost 的环境补资源库真实浏览器回归与桌面/移动截图；
7. 资源与审阅数据已使主包达到 744.81 kB，应按页面或数据域拆包。

## 恢复入口

下一位执行者先读：

1. [本轮研究报告](../research/CHINESE_PRACTICE_01.md)
2. [来源台账](../research/SOURCE_LEDGER.md)
3. [资源发现契约](../product/RESOURCE_DISCOVERY.md)
4. [维护流程](../research/RESOURCE_MAINTENANCE.md)
5. `content/resources.json` 与 `content/resource-assessments.json`

然后执行：

```bash
pnpm content:check
pnpm check
pnpm build
```

若环境允许端口监听，再执行：

```bash
pnpm qa
```
