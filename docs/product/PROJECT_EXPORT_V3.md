# 落桌 V3 导出、导入与分享合同

## 完整恢复包

`tabletop-workshop-workspace-backup-v3` 包含完整 Workspace、导出时间与规范化 digest。导入先预览对象数量，再由用户确认。严格恢复只接受同一 `workspaceId`，并写成新 revision；不同工作区不会静默覆盖。

## 脱敏项目包

`tabletop-workshop-project-share-v3` 只包含一个项目的版本链、原型、运行、迭代、测试、证据、复盘、变更边和资料附着。

默认处理：

- 排除 `withdrawn` Session；
- Session `context` 改为 `{ "redacted": true }`；
- 排除项目 profile 中的 `privateNotes`、`contact`、`email`；
- 不包含课程进度、Agent 记录和其他项目；
- 使用 digest 检查内容未被改写。

导入采用 ID 合并：不存在的对象加入；完全相同的对象幂等跳过；同 ID 不同内容作为冲突停止，不根据标题猜测归属。合并后必须通过 Workspace 全关系校验。

## 旧数据迁移

迁移前保存原始 key 备份，源 key 不删除。无法确定 project/version 的记录保持 `needs_assignment`；旧文本完成状态不升级为测试事实。
