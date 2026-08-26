# 落桌 Vercel 首次部署交接

日期：2026-08-24  
状态：已上线，Vercel `READY`

## 线上入口

- 正式地址：<https://luozhuo-tabletop-design.vercel.app/>
- 项目名：`luozhuo-tabletop-design`
- 部署 ID：`dpl_5bVMFXfx4gqycUsyeKH5iRDzJrXz`
- 项目 ID：`prj_upGyXgkPF3HAXbYner7OzHV26XaY`
- 部署目标：`production`

本次命令没有传入 `--prod`。由于这是新项目的第一次部署，Vercel 自动把首次部署指定为 Production，并分配了正式别名。后续不带 `--prod` 的部署将恢复为 Preview；除非用户明确要求，不覆盖正式版本。

## 本次发布边界

- 保持 `VITE_PUBLIC_TRIAL_MODE=false`，站点仍标记为“仅限内部学习”，没有开启公开试用或在线投稿。
- 保持 `noindex, nofollow`，HTML meta 与 `X-Robots-Tag` 双重阻止搜索引擎收录。
- 没有配置或上传隐私联系人、用户数据、课程原件与本地私密资料。
- `.vercel/`、`.env.local` 与 Vercel 生成的本地环境文件均由 `.gitignore` 排除；文档中不记录令牌或临时分享参数。
- 本次构建身份为 `vercel-preview-20260824`，托管标签为 `Vercel Preview`。这是内部预览身份；若以后正式开放公开试用，应在获得隐私联系人并通过公开发布门后，用新的 production 构建身份替换。

## 构建与验收证据

预构建命令：

```bash
PUBLIC_BASE_PATH=/ \
VITE_PUBLIC_TRIAL_MODE=false \
VITE_PUBLIC_HOST_LABEL="Vercel Preview" \
VITE_BUILD_ID=vercel-preview-20260824 \
pnpm dlx vercel@59.5.0 build --yes --scope sichuang-fans-projects
```

结果：

- 完整内容门禁通过：574 条资源，以及本地发布、贡献包、新手路径、阅读到行动、发布、无障碍、方法分区、资源入口、学习内容、主包与工具交接等全部检查。
- Vite production build 成功：144 个模块，耗时约 3 分 30 秒。
- Vercel 部署状态：`READY`，首次上传约 4.0 MB。
- 首页服务端返回 `200 OK`，标题为“落桌 · 桌游设计馆”，描述、中文语言声明与 Banner preload 正确。
- HTML 响应头包含 CSP、HSTS、`nosniff`、`DENY` frame、`no-referrer`、权限限制与 `noindex, nofollow`。
- 抽检 JavaScript、CSS 与 640 px WebP Banner 均返回 `200`，`Content-Type` 正确，且命中 Vercel CDN；指纹资源使用一年 immutable 缓存。
- Vercel 过去一小时运行时错误：0。
- 应用内浏览器能够打开正式地址并显示正确页面标题；更细的 DOM 自动化抽查受当时本机到 `vercel.app` 的网络延迟影响超时，因此交互回归仍以发布前已通过的本地多视口证据为准。

## 后续更新方式

先构建，再发布 Preview：

```bash
pnpm dlx vercel@59.5.0 build --yes --scope sichuang-fans-projects
pnpm dlx vercel@59.5.0 deploy --prebuilt --yes --scope sichuang-fans-projects
```

只有用户明确要求覆盖正式版本时，才对已经验收的预构建产物使用 `--prod`。公开试用还必须先补齐隐私联系人，并重新运行 `PUBLIC_TRIAL_RELEASE` 中的 Go/No-Go 门。

