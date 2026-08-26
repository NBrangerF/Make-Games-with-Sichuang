# Phase 1 资源发现与策展入口交接

日期：2026-08-18  
状态：本工作包完成；长期 `/goal` 继续

## 为什么做这一包

网站已有 164 条资源和同数审阅记录，但资源页此前只有阶段与关键词。新手仍面对长列表，而 `audienceLevels`、`useModes`、`reviewDepth`、`bestFor` 和 `doNotUseFor` 只存在于数据与方法页，没有帮助用户在点击前作决定。

本轮把资源库改成任务优先的发现界面：先从四个短入口缩小选择，也可查看全部资源并组合六类条件。没有增加资源数量或建立质量排名。

## 完成内容

- 新增 `content/resource-entry-points.json`；
- 四个入口分别覆盖第一次原型、第一次外部测试、规则/教学、生产/发布；
- 每个入口按人工顺序连接 6 条已审阅资源，并显示问题、产出和证据边界；
- 新增阶段、受众层级、使用方式、语言、访问方式和文本搜索组合；
- 搜索扩展到标题、作者、类型、摘要、限制、最佳用途与误用边界；
- 结果直接显示访问方式、阅读深度、核验日期、“最适合”和“不要用来”；
- 零结果明确是筛选交集为空，并提供回到全部资源的行动；
- 切换策展入口会清空其他筛选，避免残留条件造成误读；
- 构建期验证入口 schema、唯一 ID、每条 4–8 个资源与全部外键；
- 自动回归新增入口、筛选、空状态和移动端覆盖。

## 证据与产品边界

阅读入口不是必读书单、个性化推荐或质量排名。入口可混合论文、教师/设计师博客、玩家/社群资料和商业平台文档，但每条来源的类型、阅读深度与限制继续显示。中文筛选只依据语言元数据，不保证地区适用性；核验日期也不保证链接实时可达。

## 文档

- [资源发现、筛选与策展入口](../product/RESOURCE_DISCOVERY.md)
- [资源发现可用性测试](../product/USABILITY_TEST_RESOURCE_DISCOVERY.md)
- [概念词表与资源评价模型](../product/GLOSSARY_AND_RESOURCE_EVALUATION.md)
- [视觉与功能验收记录](../product/FIDELITY_LEDGER.md)

## 验证

通过：

- `pnpm content:check`：164 resources、4 resource entry points、83 claims、5 frameworks、6 core guides、10 special guides、67 terms、164 assessments、22 design constraint cards、50 local files；
- `node --max-old-space-size=768 node_modules/typescript/bin/tsc -b --pretty false`；
- `node --check scripts/qa-site.cjs`；
- `node node_modules/vite/bin/vite.js build`；
- 构建产物包含新增入口和筛选文案。

构建结果：CSS 48.55 kB（gzip 8.23 kB）；JS 728.41 kB（gzip 214.10 kB），继续存在大于 500 kB 警告。

未通过且不得声称通过：

- `node scripts/qa-site.cjs` 在预览启动时返回 `listen EPERM: operation not permitted 127.0.0.1:5175`；
- 没有本轮真实桌面/移动截图、下载、控制台或键盘证据；
- 没有执行接受稿与最新资源页截图的 `view_image` 双图验收；
- 四个入口顺序与措辞尚未经过真实中文新手验证。

## 下一步建议

1. 在允许 localhost 的环境运行回归并生成最新资源页桌面/移动截图；
2. 按 [资源发现测试](../product/USABILITY_TEST_RESOURCE_DISCOVERY.md) 招募 5 名中文新手，重点检查是否把入口或层级误读成质量排名；
3. 根据真实任务失败调整入口资源和文案，而不是依点击率自动排序；
4. 审核 12 条现有中文资源覆盖缺口，优先补充可公开、作者与语境清楚的中文玩家/设计师长期案例；
5. 将 164 条资源与审阅数据按资源页动态加载，处理不断增长的主包。

长期目标尚未完成；本包只证明资源由长列表升级为可组合、可解释的任务入口。
