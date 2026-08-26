# 公开试用发布就绪交接

日期：2026-08-21  
状态：platform-neutral package complete; external deployment not started

## 本轮完成

1. 以 Vite、Cloudflare Pages、Vercel 与 GitHub Pages 官方文档为依据，完成平台比较、推荐、构建变量、Go/No-Go、烟测与回滚契约。
2. 新增可分享的 `#privacy` 页面和全站页脚。页面显示本地/公开试用模式、托管方、构建 ID、联系人和本站 localStorage 项目数。
3. 明确当前没有账号、云端上传、分析、广告追踪或广告 Cookie；外部链接、托管日志、下载副本与研究者副本分别说明。
4. 数据清理需要二次点击，只删除 `tabletop-workshop-` 前缀，不调用 `localStorage.clear()`；页面要求先导出并说明外部副本不会随之删除。
5. Vite `base` 改为 `PUBLIC_BASE_PATH` 显式配置；根域使用 `/`，GitHub Pages 项目站点可使用 `/<REPO>/`，非法路径构建失败。
6. 加入试用期 `noindex` meta、`robots.txt`、Cloudflare/静态主机 `_headers`、Vercel headers、严格 CSP 与 hashed asset 缓存策略。
7. 新增 `pnpm qa:release` 的 21 项仓库守卫和 `pnpm qa:release:strict` 的 5 项真实环境门；普通本地构建不会冒充公开试用。

## 决策与边界

- 推荐 Cloudflare Pages，但没有替用户创建项目、连接仓库、绑定域名或公开链接。
- `noindex` 不是保密或访问控制。若参与者链接不可转发，平台选择时必须启用并实测访问保护。
- 本轮没有加入账号、表单投稿、远程参与者数据采集、分析脚本或 Cookie banner，因为这些能力都不在当前 MVP 范围。
- `public/_headers` 适合支持该文件的静态主机；Vercel 使用 `vercel.json`。GitHub Pages 上线后需特别验证响应头，不能从仓库配置推断已经生效。
- 任何正式上线仍需用户给出平台、可见性、隐私联系人和是否绑定域名四项选择。

## 验证结果

- `pnpm qa:release`：21/21 通过。
- `pnpm qa:release:strict`（虚构 `.invalid` 联系人，仅用于门禁演练）：26/26 通过；不构成真实联系人配置。
- `pnpm check`、完整 `pnpm content:check`、根路径 `pnpm build`：通过。
- `/tabletop-design-workshop/` 子路径构建：通过；HTML 资源 URL 使用该前缀，meta、robots 与 `_headers` 进入产物。
- Browser/IAB：1280px 与 390×844 均无页面级横向溢出；`#privacy` 的标题、后退、刷新、页脚与首次删除警告成立；控制台 0 warning/error。
- 最终截图：`design/qa/privacy-page-iab-desktop.png`、`design/qa/privacy-page-iab-mobile-390.png`，均已 `view_image` 人工检查。
- 二次点击会删除本地数据，因测试资料中已有 7 个本站数据项且浏览器动作需要即时确认，本轮没有执行；上线前须在专用空白浏览器资料中补验。

## 下一位执行者

1. 用户醒来后只需确认四个发布选择；若选择 Cloudflare Pages，按 `PUBLIC_TRIAL_RELEASE.md` 的严格变量和 Go/No-Go 执行。
2. 创建专用空白浏览器资料，补验第二次点击只删除 `tabletop-workshop-` 前缀，并记录前后键集合；不要用现有资料实验。
3. 部署后用实际域名核对响应头、访问保护、缓存和回滚入口；仓库文件不能替代线上响应证据。
4. 部署后再招募 Round A 的 2–3 名新手；真实会话仍为 0。

## 关键入口

- [公开试用发布契约](../product/PUBLIC_TRIAL_RELEASE.md)
- [中文新手首轮可用性测试战役](../product/BEGINNER_USABILITY_CAMPAIGN.md)
- [总目标完成度审计 01](../product/GOAL_COMPLETION_AUDIT_01.md)
- `scripts/check-public-trial-release.mjs`
- `.env.example`
- `src/deployment.ts`
- `public/_headers`
- `vercel.json`
