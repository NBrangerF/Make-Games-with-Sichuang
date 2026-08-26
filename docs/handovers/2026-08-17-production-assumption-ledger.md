# Phase 1 生产可行性与生产假设账本交接

日期：2026-08-17  
状态：研究、内容、类型检查与生产构建通过；浏览器回归受沙箱端口限制待补

## 本轮完成

- 新增专项研究 `PRODUCTION_COMPONENTS_01.md`，覆盖生产规格、BOM、报价范围、落地成本、PPC/MPC、装盒任务、最终实物复测、履约和环境影响边界。
- 新增 16 条资源及 16 份无总分逐条审阅；总计 144 条资源、144 份审阅。
- 新增 9 条可追溯 Claim；总计 73 条。
- 新增 8 个规范概念；总计 59 个。
- 新增第 9 篇专项指南“别先问一盒多少钱，先冻结一份生产假设”。
- 新增 `production-ledger` 网站工具，支持动态增加/移除组件、本地保存和 JSON 导出。
- 回归脚本加入第 9 篇指南直达、动态组件行、保存、导出固定声明、375px 页面溢出和输入宽度断言。

## 研究结构与证据边界

- 生产来源分为生产商/平台官方材料、行业协会、众筹平台、设计师/专业实践、中文设计师文章、行业观察与研究传播；商业来源保留商业语境，不进行供应商排名。
- 一份可比较的价格证据必须带版本、数量、组件规格、币种、日期、范围和包含/排除项。供应商估算、平台计算器、书面报价、发票与实测是不同证据状态。
- 工厂生产范围、到仓落地范围和项目全成本不能混成一个数字。制造完成不等于玩家已经收到。
- 文件/印前、组件样、PPC、MPC 和入库抽检回答不同风险；任何一门通过都不能证明整批零缺陷或玩家体验通过。
- 最终图形、材料、尺寸和包装会改变读取、识别、抓取、设置与收纳。低保真原型通过后仍需在接近成品的实物上重测相同任务。
- LCA 传播来源只支持在其三个假设盒型中把不必要的重量和纸/纸板用量视为设计变量；不能给单款游戏计算环保分，也不能推出材料善恶排行。
- 精确价格、MOQ、物流、关税、税务、合规与平台规则具有高时效性。本轮不保存通用费率，不提供法律、商业或制造建议。

## 工具数据契约

- 存储键：`tabletop-workshop-production-ledgers-v1`。
- 每个组件记录：名称、每盒数量、尺寸/材料/加工、玩家/系统功能、替代与同任务复测、证据状态。
- 成本记录：币种与金额/范围、成本范围、证据状态、来源/日期/版本、明确包含与排除。
- 包装记录：装盒—开盒—设置—桌上取用—复原任务，以及盒内/外尺寸、整盒重量、牌套与实测状态。
- 验证门：早期规格、文件/印前、组件/材料样、PPC、MPC、入库/抽检；每门保存任务、预期、实际、批准者与未覆盖风险。
- 导出固定字段：

```json
{
  "schema_version": 1,
  "method": "production-assumption-ledger",
  "no_price_prediction": true,
  "not_a_manufacturing_quote": true,
  "not_compliance_advice": true
}
```

- 工具不相加不同范围的数字，不输出售价、利润、供应商分、合规分或可持续认证。

## 验证证据

- `pnpm resources:health`：重建 144 条快照；当前沙箱无外网，结果为 `0 reachable / 0 blocked / 0 dead / 144 error`。这是环境网络错误，不表示 144 个链接失效。
- `pnpm content:check`：通过，输出 `144 resources, 73 claims, 5 frameworks, 6 core guides, 9 special guides, 59 terms, 144 assessments, 22 design constraint cards, 50 local files`。
- `pnpm check`：TypeScript 在独立 1024 MB 命令中通过。
- `pnpm build`：通过。输出 `dist/index.html 0.61 kB`、CSS `44.29 kB`、JS `658.52 kB`（gzip `194.79 kB`），构建用时约 1 分 17 秒。
- Vite 仍提示主 JS chunk 大于 500 kB。它不阻塞构建，但生产假设工具的加入让后续按页面/工具拆包更值得进入性能工作包。
- `node --check scripts/qa-site.cjs`：通过；脚本在预览超时时现在会终止子进程，避免端口失败后遗留等待进程。

## 浏览器与视觉边界

- 沿用已接受概念 `/Users/shawn.fsc/Documents/ChatGPT/游戏设计/design/concepts/workbench-primary.png`。本轮只扩展既有长表单—摘要工具，没有改变页面外壳或视觉方向，因此未生成新概念稿。
- `pnpm qa` 无法连接预览服务；直接运行 `pnpm preview --host 127.0.0.1 --port 5175` 明确返回 `listen EPERM: operation not permitted`。
- 因此本轮没有生成 `production-ledger` 的最新浏览器截图，也没有执行接受稿与最新渲染的双图 `view_image` 验收。生产构建通过不能替代浏览器功能/视觉 QA。
- 回归脚本已准备桌面与 375×812 路径，但只有在允许 localhost 的环境执行后，才能宣称动态组件、下载、移动端和视觉忠实度通过。

## 下一步

1. 在允许 localhost 的环境运行 `pnpm qa`，取得 `design/qa/production-ledger-desktop.png` 与 `design/qa/production-ledger-mobile.png`；用 `view_image` 与接受稿同轮检查。
2. 用 3–5 名中文新手分别试填“投出版社”“小批/POD”“自出版大货”场景，观察 22 个字段和动态组件表是否过重；比较完整模式与快速模式，不先删除证据范围字段。
3. 征集一个可匿名公开的中国大陆项目案例，追踪 BOM v1→v2、同数量正式报价、最终发票、整盒实测与落地差异；不得发布供应商保密报价。
4. 邀请残障玩家使用接近成品的组件与包装完成取出、设置、读取、抓取和复原任务，避免生产降本重新制造无障碍问题。
5. 把 `App.tsx` 中各大型工具拆成独立模块，并按工具惰性加载，处理持续增长的主 chunk。

## 继续工作入口

- 研究：`docs/research/PRODUCTION_COMPONENTS_01.md`
- 指南：`docs/guides/PRODUCTION_ASSUMPTION_LEDGER.md`
- 机器内容：`content/resources.json`、`content/resource-assessments.json`、`content/claims.json`、`content/glossary.json`、`content/special-guides.json`
- 工具：`src/App.tsx` 中的 `ProductionLedgerTool`
- 数据契约：`docs/product/CONTENT_DATA_MODEL.md`
- 回归：`scripts/qa-site.cjs`

