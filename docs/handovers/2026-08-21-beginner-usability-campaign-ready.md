# 中文新手首轮可用性测试战役就绪交接

日期：2026-08-21  
状态：campaign-ready / participant-sessions-not-run

## 本轮目标

总目标完成度审计指出，项目最大的证据缺口不是资源或工具数量，而是章程中的真实用户指标：5 名新手无口头指导找到符合阶段的内容，以及至少 4 名用户完成“体验目标 → 假设 → 原型 → 测试记录”闭环。仓库已有大量专项测试协议，但没有一套战役级主持与计数契约。

## 新增产物

- `docs/product/BEGINNER_USABILITY_CAMPAIGN.md`：两轮结构、招募边界、主持话术、N1/R1/W1/D1、严重度、单变量诊断和章程形成门。
- `docs/product/beginner-usability-campaign-template.json`：Round A 2–3 人诊断、Round B 5–7 人确认与 5/4 门槛。
- `docs/product/beginner-usability-session-template.json`：安全空白会话记录。
- `docs/product/beginner-usability-session-example.json`：明确不可计数的虚构失败案例与修订示例。
- `docs/product/beginner-usability-session-schema.json`：schema v1、证据类别、四任务与隐私结构。
- `scripts/validate-beginner-usability-campaign.mjs`：结构、防越界与参与者会话门槛计算。
- `pnpm qa:beginner-campaign`：25 项包守卫，并已接入 `content:check`。

## 关键决定

1. 两轮分开：先用 2–3 人找阻断并隔离根因，修订后再用 5–7 名新用户确认；不能边测边改却仍把样本放在一起。
2. 全部确认参与者完成定位与资源任务；至少 4 人完成意图、循环、范围、计划、主持演练记录、刷新与完整项目包。
3. W1 使用明确标为主持演练的虚构事件，只验证记录路径，不伪装成游戏的外部玩家证据。
4. `task_help` 与中性 think-aloud 提醒分开；有任务帮助就不计独立完成。
5. 不保存真实姓名、联系方式、人口画像、原始录音或逐字稿；虚构示例使用 `FX` 别名并被校验器拒绝计数。
6. 不计算满意度/理解总分。严重问题必须保留工作/失败案例、隔离因素、单一修订与复测任务。

## 验证

`pnpm qa:beginner-campaign`：25/25。守卫覆盖安全模板、虚构示例、schema 元数据、四任务、同意/退出、身份/录音/总分拒绝、任务顺序、帮助与独立完成一致、严重问题修复、演练证据边界、五类导出、确认轮新用户、5/4 门槛、支持配置覆盖、完整轨道不足与重复别名。

`node --check scripts/validate-beginner-usability-campaign.mjs`、`pnpm check`、`pnpm content:check` 与 `pnpm build` 均通过。内容权威计数保持 574 条资源、34 个入口、322 条 Claim、31 篇专题指南、287 个术语与 57 份本地资料；本轮没有修改前端产物，构建仍转换 44 个模块。资源/方法大 chunk 警告仍是既有性能待办。

校验器的内存合格样本只证明门槛计算能识别 5 人定位/4 人闭环；它不会写入仓库，也不属于参与者证据。当前真实会话数仍为 0，章程指标没有更新为通过。

## 下一步

1. 用户选择公开试用托管目标，或准备一台参与者能直接操作的本地测试设备；冻结 `baseUrl` 与 `buildId`。
2. 复制空白战役/会话模板，不修改已提交的模板文件。
3. Round A 招募 2–3 名第一次使用本站的新手，至少 2 名完整轨道。
4. 对每个严重故障只改一个已隔离因素，并保留修订日志。
5. Round B 使用 5–7 名未参加试跑的新手；将真实会话文件交给校验器做结构与形成门检查，再人工复核原始观察。

部署、招募、联络参与者和保存同意资料会产生外部状态，仍需用户确认。没有这些外部输入时，可以继续准备静态托管方案比较与主持者检查清单，但不能伪造会话结果。
