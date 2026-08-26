# 公开试用发布契约

状态：ready_for_platform_choice  
日期：2026-08-21  
范围：只读内容、local-first 工具、中文新手形成性测试；不开放投稿、账号或云端同步

## 决策结论

当前代码已经具备平台无关的公开试用包，但尚未部署，也不应开始招募。建议首选 **Cloudflare Pages**：它的每次提交预览、默认预览 `noindex`、可选 Access 保护、静态响应头和生产回滚最贴合这一轮小规模研究。Vercel 是可行的第二选择；GitHub Pages 最简单，但项目站点需要显式子路径 `base`，而且本项目仍需另行建立预览与响应头方案。

选择平台和创建外部项目会改变用户账号、仓库集成、域名与公开状态，必须由用户确认后执行。本文件不把“准备完成”写成“已经上线”。

## 官方依据

- Vite 的[静态部署指南](https://vite.dev/guide/static-deploy.html)说明根域使用 `/`，GitHub Pages 项目站点使用 `/<REPO>/`，并给出 Pages、Cloudflare Pages 与 Vercel 的部署入口。
- Cloudflare Pages 的[Vite 指南](https://developers.cloudflare.com/pages/framework-guides/deploy-a-vite3-project/)使用 `npm run build` 与 `dist`；[预览部署](https://developers.cloudflare.com/pages/configuration/preview-deployments/)提供唯一 URL、分支别名、默认 `X-Robots-Tag: noindex` 和可选 Access；[自定义响应头](https://developers.cloudflare.com/pages/configuration/headers/)读取静态资产目录中的 `_headers`；[回滚](https://developers.cloudflare.com/pages/configuration/rollbacks/)可恢复到以前成功的生产部署。
- Vercel 的[Vite 文档](https://vercel.com/docs/frameworks/frontend/vite)与[部署环境说明](https://vercel.com/docs/deployments/overview)区分 Local、Preview、Production；[响应头](https://vercel.com/docs/headers/response-headers)说明预览的索引保护；[即时回滚](https://vercel.com/docs/instant-rollback)说明生产别名的回退边界。
- GitHub Pages 的[自定义 Actions 工作流](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)使用配置、上传与部署三步；[HTTPS 说明](https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https)同时提醒 Pages 站点公开可访问；[自定义域](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/about-custom-domains-and-github-pages)与[域名验证](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/verifying-your-custom-domain-for-github-pages)需要单独配置。

## 平台比较

| 条件 | Cloudflare Pages | Vercel | GitHub Pages |
| --- | --- | --- | --- |
| Vite 产物 | `pnpm build` → `dist` | `pnpm build` → `dist` | Actions 上传 `dist` |
| PR/分支预览 | 原生唯一 URL与分支别名 | 原生 Preview URL | 需另行设计工作流；不作为本轮默认假设 |
| 试用不收录 | 预览默认 `noindex`；本仓库另有 meta、robots、`_headers` | 预览有索引保护；本仓库另有 meta、robots、`vercel.json` | 本仓库 meta 与 robots；响应头需部署后另行验证 |
| 小范围访问 | 可为预览启用 Access | 可用平台保护能力，具体套餐上线前复核 | Pages 站点按公开可访问处理 |
| 回滚 | 选择以前成功的生产部署 | 回退符合条件的生产部署；套餐边界上线前复核 | 通过 Git/Actions 重新部署已知良好提交 |
| 本项目额外工作 | 选账号/仓库、设置变量、首轮烟测 | 选账号/仓库、设置变量、首轮烟测 | 设置 `PUBLIC_BASE_PATH=/仓库名/`、编写工作流、补响应头验证 |

## 构建契约

公开试用构建必须显式设置：

```bash
PUBLIC_BASE_PATH=/
VITE_PUBLIC_TRIAL_MODE=true
VITE_PUBLIC_HOST_LABEL="实际托管服务与项目名"
VITE_PRIVACY_CONTACT="可实际响应的邮箱或联系入口"
VITE_BUILD_ID="git提交或发布编号"
```

GitHub Pages 项目站点把第一项改为 `/<REPO>/`。根域、Cloudflare Pages 默认域和 Vercel 默认域保持 `/`。变量缺失时应用会显示“当前构建不用于公开招募”，`pnpm qa:release:strict` 也会失败。

发布候选应依次运行：

```bash
pnpm install --frozen-lockfile
pnpm check
pnpm content:check
pnpm qa:url-navigation
pnpm qa:release:strict
pnpm build
```

## 数据与隐私边界

- 当前站点不提供账号、云端上传、访问分析、广告追踪或广告 Cookie。
- 项目与工具数据只存于当前浏览器 `localStorage`；用户必须主动导出 JSON 才能跨设备或抵抗浏览器清理。
- `#privacy` 会显示托管方、构建 ID、联系人和当前本地数据项数量；清除动作需要两次点击，且只删除 `tabletop-workshop-` 前缀。
- 清除本地数据不删除下载文件、研究者另存记录、已经发出的副本或托管方可能保存的标准 HTTP 日志。
- 公开试用保持 `noindex, nofollow`。这不是访问控制；若招募链接不能公开转发，必须选择并验证真正的访问保护。
- 试用参与数据仍按 `BEGINNER_USABILITY_CAMPAIGN.md` 在网站之外保存；本轮不加入网页投稿或远程采集。

## Go / No-Go

只有下列项目全部有证据时才 Go：

- [ ] 用户确认托管平台、账号/仓库与是否需要访问保护。
- [ ] 实际隐私联系人同意承担响应；招募说明写清数据保存、退出与撤回边界。
- [ ] 严格环境变量与 `pnpm qa:release:strict` 通过。
- [ ] `pnpm check`、`pnpm content:check`、`pnpm qa:url-navigation`、`pnpm build` 通过。
- [ ] 预览地址完成桌面与 390×844 烟测，无控制台错误或横向溢出。
- [ ] 预览响应实际包含 CSP、`noindex`、`nosniff`、frame、referrer 与 permissions headers。
- [ ] `#privacy` 可直达，内容与实际托管方一致；二次删除仅影响本站前缀。
- [ ] 导出 JSON 后可打开且包含预期项目记录；清理测试使用专门的空白浏览器配置。
- [ ] 已记录当前良好部署 ID 和平台回滚入口。

任一项失败即 No-Go。不得用“URL 能打开”替代隐私、响应头、导出、移动端和回滚证据。

## 发布后烟测

1. 打开 `#path`，刷新后仍停留在设计路径。
2. 依次打开 `#resources`、`#method`、`#tools/experience-intent`、`#tools/playtest-session`、`#privacy`；核对标题、后退/前进与刷新。
3. 新建最小项目记录，刷新确认仍在；导出 JSON 并检查文件不是空壳。
4. 在空白测试浏览器中进入隐私页：第一次点击只进入警告态，第二次才清理；重新加载后本地项恢复为初始状态。
5. 以 390×844 检查主导航、资源入口、体验意图、测试记录、页脚与隐私删除区，无横向溢出和被遮挡按钮。
6. 检查控制台、网络失败、缓存头和上述安全头；从另一个网络/设备验证访问保护（若启用）。
7. 用搜索引擎收录检查只能作为延迟证据；响应头与 meta 才是本次即时发布证据，且 `noindex` 仍不等同保密。

## 回滚

发布前记录 `previous_good_deployment`、`candidate_deployment`、构建 ID、操作者和时间。出现数据删除范围错误、页面空白、导出损坏、隐私信息不符、访问保护失效或核心路径阻断时立即停招募：

1. 在 Cloudflare/Vercel 选择上一成功生产部署回退；GitHub Pages 则恢复已知良好提交并重新运行 Pages 工作流。
2. 验证公开域已指向上一版本，而不只检查预览 URL。
3. 重跑 `#path`、一个工具深链、`#privacy`、导出和移动端最短烟测。
4. 记录故障时间窗、可能受影响参与者、是否需要通知，以及新候选修复证据。

回滚只恢复静态代码和配置，不会自动恢复或删除参与者浏览器中的 localStorage，也不会撤回已经下载或另存的数据。

## 上线时只需用户决定的事项

1. 托管：Cloudflare Pages（推荐）、Vercel 或 GitHub Pages。
2. 可见性：不可索引的公开链接，还是带访问保护的小范围预览。
3. 实际隐私联系人与可公开显示的联系入口。
4. 是否现在绑定自定义域；形成性测试可先用平台域，避免把域名配置变成招募阻塞。
