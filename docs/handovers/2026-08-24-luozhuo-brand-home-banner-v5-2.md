# 落桌品牌与首页横幅 V5.2 交接

日期：2026-08-24  
状态：完成并通过生产构建与浏览器验收  
当前预览：`http://127.0.0.1:8017/?build=playable-archive-v5-2#resources`

## 本阶段完成

- 网站品牌从“桌游设计工坊”调整为“落桌”，用“桌游设计馆”解释网站类别。
- 首页 H1 改为“落桌”，新增一句明确承诺和一块解释网站用途的功能横幅。
- 使用 Image 2 生成原创桌游原型工作桌主视觉；图片不含文字、Logo、商标或可识别商业游戏。
- 生成 1600、960、640 三个 WebP 运行时版本并建立资产元数据。
- 横幅文字全部使用 HTML；图片提供过程型替代文字。
- 首页右栏重组为“原创功能横幅 → 经典桌游标本”，经典案例降为二级证据层。
- 统一页头、动态页面标题、下载文件名与本站原创作者署名。
- 本地存储键、schema ID、资源 ID 保持不变，已有学习记录无需迁移。

## 主要实现文件

- `src/brand.ts`
- `src/resource-home-banner.tsx`
- `src/resource-start-v2.tsx`
- `src/classic-visual-board.tsx`
- `src/styles-v5-2-brand.css`
- `index.html` 与 `scripts/generate_index.py`
- `design/assets/brand/luozhuo-home-banner-image2.png`
- `public/assets/brand/luozhuo-home-banner-image2-{1600,960,640}.webp`

## 文档证据

- 品牌规范：`docs/product/LUOZHUO_BRAND_AND_HOME_BANNER_V5_2.md`。
- 资产记录：`design/assets/brand/luozhuo-home-banner-image2.metadata.json`。
- 接受概念：`design/concepts/luozhuo-home-brand-banner-v5-2.png`。
- 保真账本：`docs/qa/LUOZHUO_BRAND_BANNER_V5_2_FIDELITY_LEDGER_2026-08-24.md`。
- 正式截图：`docs/qa/screenshots/luozhuo-v5-2/`。

## 验证结果

- `pnpm check`：通过。
- `pnpm qa:url-navigation`：11/11。
- `pnpm qa:resource-v2`：53/53。
- `pnpm qa:classic-assets`：4 份资产文件、哈希、权利与运行时引用通过。
- `pnpm qa:visual-tokens`：同步。
- `pnpm build`：完整内容门与生产构建通过。
- 最终 CSS 微调后的 Vite 生产构建：通过。
- 应用内浏览器：1504×1046、390×844、320×844 无横向溢出；最终控制台 0 错误 / 0 警告。
- 核心交互：资源首页 → 学习入口 → 品牌返回首页通过。

Vite 仍报告既有的少数大分片提示；本阶段没有新增内容数据或首屏目录包，提示不阻断当前内部构建。

## 下一步边界

- 若网站未来公开，需要单独完成“落桌”的商标、域名、社交账号与近似品牌检索；本阶段没有作公开可用性声明。
- 当前名称与横幅应先进入真人跨年龄首印象测试，观察读者能否在 10 秒内回答“这是什么网站”和“我该从哪里开始”。
- 下一阶段不要继续增加首页功能；优先观察品牌理解、三个入口选择和横幅说明是否足够。
