# WorkContext 与规范路由合同

状态：implementation contract
日期：2026-08-27
对应蓝图：`plans/luozhuo-learning-workbench-v3-blueprint.md` S2

## 一条权威规则

决定工作对象身份的 ID 必须出现在规范 URL 中。`WorkContext` 由 URL parser 产生，而不是从工具的全局 `records[0]`、项目标题、版本文字或最近打开时间猜测。

权威顺序固定为：

1. 显式 URL ID；
2. 只在裸 landing 页使用 workspace active fallback；
3. 没有可证明的对象时显示空状态。

显式 URL 与当前 workspace 关系不符时，页面进入 recovery state，不自动改成最近项目。

## 规范路由

| 工作面 | 规范路由 |
| --- | --- |
| 课程总览 | `#course?course={courseId}&enrollment={enrollmentId}` |
| 课程活动 | `#course/units/{unitId}/activities/{activityId}?course={courseId}&enrollment={enrollmentId}` |
| 设计工作台 | `#workbench` |
| 开始新构想 | `#workbench/new` |
| 项目版本 | `#workbench/projects/{projectId}/versions/{versionId}` |
| 迭代步骤 | `#workbench/projects/{projectId}/versions/{versionId}/cycles/{iterationId}/{step}` |
| 上下文工具 | `#tools/{toolId}?project=...&version=...&iteration=...&return_to=...` |

`return_to` 只允许站内 `#` 路由。课程、项目、版本、迭代、活动和来源均使用 ID，不使用可重名标题。

## 合法组合

- `versionId` 必须与 `projectId` 同时存在，且版本属于项目。
- `iterationId` 必须与 project/version 同时存在，且轮次属于该版本。
- `enrollmentId` 必须属于 `courseId`。
- `activityId` 必须与 course/unit 同时存在。
- 路由 parser 只检查语法组合；resolver 使用 workspace 检查实体与关系。

## Legacy URL manifest

| 旧入口 | 保留落点 |
| --- | --- |
| `#learn/workshop` | 旧基础工作室地图；后续在页内引导到 `#course` |
| `#learn/iteration` | 旧原型迭代入口；后续在页内引导到 `#workbench` |
| `#learn/node-01`–`#learn/node-12` | 保留原节点阅读面 |
| `#tools/{19 个 tool id}` | 保留无上下文工具；不猜项目 |
| `#path` | 保留旧项目护照，不自动写入 v3 |
| `#resources/*` / `#method/*` | 原资源与方法深链原位保留 |

## 隔离与恢复

- 两个标签页分别打开不同 project/version URL 时，上下文不从 active selection 相互覆盖。
- 刷新和历史后退都重新 parse URL。
- 无效 ID 显示原因，允许返回来源或选择已有对象；不新建假对象。
- 工具保存的返回位置由 `return_to` 决定，不依赖 React 内存中的临时返回栈。
