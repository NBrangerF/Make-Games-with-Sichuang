# 内容版本治理工作台

状态：implemented / browser QA pending  
日期：2026-08-21  
研究依据：[卡池与版本治理契约](../guides/CARD_POOL_VERSION_GOVERNANCE_CONTRACT.md)

## 产品结果

第 30 篇专题指南不再只提供静态工作单。用户现在可以在工具箱内完成内容护照、兼容配置、事实源、治理日期、回归与迁移记录，并把记录保存在当前浏览器或导出为 JSON。工具帮助用户回答“旧版玩家今天该用哪份文字”，不提供稀有度推荐、版本质量分或兼容认证。

概念稿：[完整桌面概念](../../design/concepts/version-governance-workbench.png)。实现保留暖白纸面、宋体标题、钴蓝行动、砖红手写注记、细分隔线和开放表格；没有增加营销首屏、徽章、总分或卡片墙。

## 五步工作流

1. **内容护照**：稳定 ID、组件名、印刷/当前文字，以及获取方式、实际出现频率、复杂度、系统角色、格式风险五个事实字段。
2. **兼容矩阵**：每行固定基础版/印次、扩展、人数/模式、语言/规则源、证据状态与证据定位；可动态增删。
3. **当前事实源**：来源分为当前、补充、历史；把另一项设为“当前”时，原当前项自动降为“补充”。同时记录当前断点、下一次单一验证和证据边界。
4. **治理时间线**：变更分类、摘要、公告日、生效日、复查日和回退门分别保存。
5. **回归与迁移**：有效配置、回归任务、反驳信号、迁移对象、材料、动作与负责人保持在同一版本。

## 保存与导出契约

浏览器键：`tabletop-workshop-version-governance-v1`。

```yaml
store:
  schemaVersion: 1
  draft: governance_draft
  records: [governance_record]

governance_record:
  id: uuid
  createdAt: datetime
  projectName: string
  currentVersion: string
  stableId: string
  componentName: string
  printedText: string
  currentText: string
  acquisition: string
  frequency: string
  complexity: string
  systemRole: string
  formatRisk: string
  configurations: [compatibility_configuration]
  sources: [authority_source]
  breakingPoint: string
  nextVerification: string
  evidenceBoundary: string
  changeType: string
  changeSummary: string
  announcementDate: date|null
  effectiveDate: date|null
  reviewDate: date|null
  rollbackGate: string
  validConfigurations: string
  regressionTask: string
  regressionSignal: string
  migrationAudience: string
  migrationMaterial: string
  migrationTask: string
  migrationOwner: string
```

独立治理包固定包含：

```yaml
schema_version: 1
method: content-version-governance-workbench
local_first: true
no_compatibility_certification: true
no_rarity_recommendation: true
draft: governance_draft
saved_records: [governance_record]
exported_at: datetime
```

完整项目包新增 `artifacts.version_governance_records`，因此现在汇总 13 类工具记录。旧记录不自动猜测项目归属。

## 交互与失败处理

- 草稿每次修改后自动写入当前浏览器；“保存本地记录”创建带时间的不可变快照。
- 保存快照至少要求游戏名称、工作版本、稳定 ID、组件名称、当前断点、下一次验证与证据边界。
- 清空草稿需要连续两次显式动作，只清草稿，不删除已保存快照。
- 兼容状态只有“已验证、声明支持、未知、需替换”。“已验证”仍只适用于该行配置与记录的任务。
- 没有当前事实源时，摘要明确提示；不会静默选择第一项。
- 1000px 以下摘要转到编辑器下方；720px 以下表单单栏、步骤轨道和矩阵表格各自横向滚动，不应扩张页面宽度。

## 有意边界

- 不计算最佳稀有度、卡池强度、力量膨胀、版本质量或迁移成本。
- 不把“声明支持”升级为“已验证”，也不把单个已验证配置外推到全部组合。
- 不抓取或自动合并外部 FAQ、规则书和数据库；用户必须写来源与定位。
- 不保证本地数据备份、跨设备同步或多人协作；重要记录需要导出。
- JSON 包是设计与维护记录，不是赛事合法性、产品兼容、法律、翻译或无障碍认证。

## 验证状态

- `pnpm qa:version-governance`：16/16 结构守卫通过；新增守卫确认工作台只在用户打开该工具后加载。
- `pnpm content:check`、`pnpm check` 与生产构建必须在交接前通过。
- `scripts/qa-site.cjs` 已覆盖指南直达、动态配置、必填保存、导出边界、项目包汇总和 375px 布局，但当前环境的本地端口/Chrome 阻塞尚未解除；因此不能把脚本存在写成真实浏览器通过。
- 真人形成性任务见[版本治理工作台可用性测试](USABILITY_TEST_VERSION_GOVERNANCE_WORKBENCH.md)。
