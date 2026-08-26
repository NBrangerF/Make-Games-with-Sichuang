# 桌游设计工坊视觉素材登记表 V4

日期：2026-08-23  
对应设计系统：`可玩的桌游档案馆 Playable Tabletop Archive`  
对应产品代次：V5  
当前分发范围：仅限内部学习  
状态：四张构建素材已登记；五张概念图仅作内部设计参考

## 0. 使用结论

本轮正式构建只允许使用下列四张已本地化的 Wikimedia Commons 摄影素材。它们的**摄影作品许可**清楚，但画面中仍包含现代商业桌游的版图、产品美术或标志。因此，本登记中的 `build-approved` 只表示“可以进入当前不公开的内部学习构建”，不表示已经获得公开发布所需的全部权利。

五张 `playable-archive-v5-*.png` 是用图像生成工具制作的页面方向图，只用于校准构图、密度、页面角色与视觉语言。它们不能被切片、直接嵌入正式页面，也不能被视为第三方桌游美术的替代授权。

所有 SHA-256 均基于 2026-08-23 仓库中的实际文件。源 JPEG 与正式 WebP 分离保存：

- 研究源副本：`design/reference-assets/classic-games/`
- 正式构建衍生图：`public/assets/classic-games/`
- 生成概念图：`design/concepts/`

## 1. 状态与风险定义

| 字段 | 含义 |
| --- | --- |
| `build-approved / internal-only` | 可以进入当前内部构建；转为公开访问前必须重新审计被摄产品美术、商标与适用条款。 |
| `internal-reference-only` | 只能进入研究文档与设计讨论，不进入 `public`、`dist` 或用户界面。 |
| 风险低 | 作品及被摄内容的再利用依据较完整。 |
| 风险中 | 摄影许可清楚，但被摄商业游戏美术或商标可能构成第二层权利。 |
| 风险高 | 高表达性第三方美术是主体，或许可链不足，不进入构建。 |

“内部、免费、教育用途”不是自动授权依据。公开发布、对外演示、部署到可被外部访问的地址，均触发重新审核。

## 2. 构建素材

### 2.1 CATAN 六角版图与道路

| 字段 | 记录 |
| --- | --- |
| 状态 | `build-approved / internal-only` |
| 风险 | 中：摄影为 CC0，但 CATAN 版图、卡牌、产品美术与商标未因摄影许可自动清权。 |
| 原文件名 | `Partida Catan.jpg` |
| 创作者 | Pepenic1；自有摄影；拍摄日期 2024-12-19。 |
| 来源页 | [Wikimedia Commons：File:Partida Catan.jpg](https://commons.wikimedia.org/wiki/File:Partida_Catan.jpg) |
| 下载入口 | [Special:Redirect/file/Partida Catan.jpg](https://commons.wikimedia.org/wiki/Special:Redirect/file/Partida_Catan.jpg) |
| 摄影许可 | [CC0 1.0 Universal](https://creativecommons.org/publicdomain/zero/1.0/) |
| 研究源副本 | `design/reference-assets/classic-games/catan-board-cc0-source.jpg`；1280×720；154,365 bytes；SHA-256 `4f2f8e435b91e348ab000502a5cd1b7c46ac87fab643ea748928027848189a7c`。 |
| 构建衍生图 | `public/assets/classic-games/catan-board-cc0.webp`；1200×675；107,004 bytes；SHA-256 `f5f8bcdeb6019b31b02ee51c2948850f5461b48a78e6cf23e13ab9ee721f8f1d`。 |
| 修改 | 等比缩小 1280×720 → 1200×675；转换为有损 WebP。没有把裁切或调色烘焙进文件；编码质量参数未随资产保存，当前文件哈希为权威版本。 |
| 页面裁切 | 使用 `object-fit: cover` 时将焦点放在中央六角地形、道路与木制建筑；尽量排除人物、杯子、盒面和边缘卡牌。不得把整张版图当全页背景。 |
| 推荐用途 | 首页视觉标本；“系统、地形、连接”主题的案例预览。 |
| 中文替代文字 | `一局卡坦岛的六角地形、道路与木制建筑，展示地块连接和玩家路线。` |
| 署名文本 | `《Partida Catan》— Pepenic1；CC0 1.0；本站缩放并转换为 WebP。` |

### 2.2 Azul 花砖与玩家板

| 字段 | 记录 |
| --- | --- |
| 状态 | `build-approved / internal-only` |
| 风险 | 中：摄影为 CC0，但 Azul 玩家板、花砖图案、产品名称与商业美术仍是被摄内容。 |
| 原文件名 | `A four-player game of the board game Azul.jpg` |
| 创作者 | Gábor Zehetmayer；拍摄日期 2019-02-16；原始发布记录来自 BoardGameGeek，Commons 文件页记录 CC0。 |
| 来源页 | [Wikimedia Commons：File:A four-player game of the board game Azul.jpg](https://commons.wikimedia.org/wiki/File:A_four-player_game_of_the_board_game_Azul.jpg) |
| 下载入口 | [Special:Redirect/file/A four-player game of the board game Azul.jpg](https://commons.wikimedia.org/wiki/Special:Redirect/file/A_four-player_game_of_the_board_game_Azul.jpg) |
| 摄影许可 | [CC0 1.0 Universal](https://creativecommons.org/publicdomain/zero/1.0/) |
| 研究源副本 | `design/reference-assets/classic-games/azul-table-cc0-source.jpg`；1920×1440；652,109 bytes；SHA-256 `a6789bc196ecc4e7991766d38ae00c1b0f8f0d1cf9ad35417e7f7a7d9145d0b1`。该文件是 Commons 原始 4032×3024 主文件的 1920px 本地源副本，不冒充无缩放 master。 |
| 构建衍生图 | `public/assets/classic-games/azul-table-cc0.webp`；1200×900；155,182 bytes；SHA-256 `c8e1eb81edf8ad32db7f1dd61786cce4c6241e216e8d0aea5b50ca75b0cfffc6`。 |
| 修改 | 等比缩小 1920×1440 → 1200×900；转换为有损 WebP。没有把裁切或调色烘焙进文件；编码质量参数未随资产保存。 |
| 页面裁切 | 以右下方花砖矩阵和彩色实体块为视觉焦点；避免把完整玩家板反复铺作纹理；必要时减少 `AZUL` 产品名的显著度。 |
| 推荐用途 | 首页高饱和视觉标本；“信息分区、图案重复、计分反馈”主题的案例预览。 |
| 中文替代文字 | `Azul 玩家板上的彩色花砖与方格区域，展示重复图案、分区和计分信息。` |
| 署名文本 | `《A four-player game of the board game Azul》— Gábor Zehetmayer；CC0 1.0；本站缩放并转换为 WebP。` |

> 更正记录：V4 使用的是 Gábor Zehetmayer 的四人局照片，不是素材研究初稿中列作首选的 `Azul board game.jpg`，也不是任何现实铁路票照片。

### 2.3 Ticket to Ride 路线网络

| 字段 | 记录 |
| --- | --- |
| 状态 | `build-approved / internal-only`；署名必需。 |
| 风险 | 中：CC BY 2.0 覆盖摄影作品；地图、城市名、路线槽与列车属于被摄商业产品表达。 |
| 原文件名 | `Ticket to Ride (16298587785).jpg` |
| 创作者 | Billie Grace Ward；原 Flickr 摄影；拍摄日期 2015-01-16；Commons 于 2018-11-05 完成许可复核。 |
| 来源页 | [Wikimedia Commons：File:Ticket to Ride (16298587785).jpg](https://commons.wikimedia.org/wiki/File:Ticket_to_Ride_%2816298587785%29.jpg) |
| 下载入口 | [Special:Redirect/file/Ticket to Ride (16298587785).jpg](https://commons.wikimedia.org/wiki/Special:Redirect/file/Ticket_to_Ride_%2816298587785%29.jpg) |
| 摄影许可 | [CC BY 2.0 Generic](https://creativecommons.org/licenses/by/2.0/) |
| 研究源副本 | `design/reference-assets/classic-games/ticket-to-ride-cc-by-2-source.jpg`；1920×1280；719,546 bytes；SHA-256 `dc876d5d455b6d71b553abde7d5b0e31b425dc242f797f8c485eed520d597c32`。该文件是 Commons 4896×3264 主文件的 1920px 本地源副本。 |
| 构建衍生图 | `public/assets/classic-games/ticket-to-ride-cc-by-2.webp`；1200×800；122,310 bytes；SHA-256 `9000fed45a978dea9f022c63fe96884bb2cbe93626acca13151459e5ff41953e`。 |
| 修改 | 等比缩小 1920×1280 → 1200×800；转换为有损 WebP。没有把裁切或调色烘焙进文件；编码质量参数未随资产保存。 |
| 页面裁切 | 保留彩色短段组成的长路线、节点和少量列车；避免突出单一城市文字；浅景深区域可用于产生前后层次，但文字不得叠图。 |
| 推荐用途 | 首页路径视觉标本；章节关系、路径与网络分析案例。 |
| 中文替代文字 | `Ticket to Ride 版图上的彩色路线与列车组件，展示节点之间的连接关系。` |
| 必需署名 | `《Ticket to Ride (16298587785)》— Billie Grace Ward；CC BY 2.0；本站缩放、转换为 WebP，并在页面中进行非破坏性裁切。` |

### 2.4 Carcassonne 拼接地块

| 字段 | 记录 |
| --- | --- |
| 状态 | `build-approved / internal-only`；署名必需。 |
| 风险 | 中：CC BY 4.0 覆盖摄影作品；地块插画和产品识别仍属于被摄商业产品。 |
| 原文件名 | `Carcassone jogo-game.jpg`（来源页沿用原文件的单 `n` 拼法）。 |
| 创作者 | L'Éclipse；自有摄影；拍摄日期 2021-12-25。 |
| 来源页 | [Wikimedia Commons：File:Carcassone jogo-game.jpg](https://commons.wikimedia.org/wiki/File:Carcassone_jogo-game.jpg) |
| 下载入口 | [Special:Redirect/file/Carcassone jogo-game.jpg](https://commons.wikimedia.org/wiki/Special:Redirect/file/Carcassone_jogo-game.jpg) |
| 摄影许可 | [CC BY 4.0 International](https://creativecommons.org/licenses/by/4.0/) |
| 研究源副本 | `design/reference-assets/classic-games/carcassonne-cc-by-4-source.jpg`；960×1283；258,894 bytes；SHA-256 `31b86ea31c147b3bb3bd411aeaa50adee32760fca4c36aeacd1865f411f957c3`。 |
| 构建衍生图 | `public/assets/classic-games/carcassonne-cc-by-4.webp`；960×1283；155,406 bytes；SHA-256 `6100efe23bbed2bff8a92af4578ce151cbfea5f86107faf2043505581559df29`。 |
| 修改 | 保留 960×1283 尺寸并转换为有损 WebP。没有把裁切或调色烘焙进文件；编码质量参数未随资产保存。 |
| 页面裁切 | 以中上部相连的方形地块、道路、河流与米宝为焦点；裁掉下方大面积空桌与零散黄色组件；不把完整地块美术做成 UI 纹样。 |
| 推荐用途 | 首页拼放视觉标本；“模块、边界匹配、空间拓展”案例预览。 |
| 中文替代文字 | `Carcassonne 的方形地块、道路、河流与米宝彼此拼接，展示模块边缘如何连接。` |
| 必需署名 | `《Carcassone jogo-game》— L'Éclipse；CC BY 4.0；本站转换为 WebP，并在页面中进行非破坏性裁切。` |

## 3. 生成概念图

### 3.1 共同记录

| 字段 | 记录 |
| --- | --- |
| 状态 | `internal-reference-only`；不得进入 `public` 或 `dist`，不得切片复用。 |
| 创作者 / 生成方式 | OpenAI 图像生成工具，经 Codex 按本项目视觉简报指导生成，2026-08-23。 |
| 生成来源 | V4 视觉审查、V5 页面需求、上述四张经典游戏摄影素材，以及“展览桌 / 资料抽屉 / 规则册 / 分析工作台 / 实验板”的页面隐喻。 |
| 权利记录 | 生成结果按项目所适用的 OpenAI 条款管理；仓库中未保存独立的第三方许可证书。由于画面仍可识别被参照游戏的组件和版图，统一按内部设计参考管理。 |
| 裁切与修改 | 文件为生成结果的原始保存尺寸；没有记录生成后的二次裁切、调色或修图。画面内文字、图标与细节均为示意，不是产品文案或可直接复用资产。 |
| 允许用途 | 人工比较版式、提取原创 CSS / SVG 组件规则、设计手册插图。 |
| 禁止用途 | 直接展示给终端用户、作为首页大图、切片成按钮/图标、据此宣称与任何桌游出版方合作。 |

### 3.2 文件明细

| 文件 | 页面角色 | 尺寸 | 大小 | SHA-256 |
| --- | --- | ---: | ---: | --- |
| `design/concepts/playable-archive-v5-home.png` | 展览桌首页；粗黑体标题、四图拼贴、三条行动板件。 | 1504×1046 | 2,756,850 bytes | `58fd75be7c39de206286aee8e76cc33b218acc59b3f67254aaeb1b0cf4b99716` |
| `design/concepts/playable-archive-v5-resource-library.png` | 资料抽屉；阶段轨、当前问题、连续资源记录。 | 1505×1045 | 2,716,629 bytes | `f39292da772193b865a2f6acfbadc17cf29c7b1688e7c5422ec21cc9c74fea57` |
| `design/concepts/playable-archive-v5-reading.png` | 规则册；章节轨、安静正文、单一带回行动。 | 1504×1046 | 1,733,463 bytes | `85183ed0f248f429d42e38f695ce327a63ca741965514e24502e1a9c2cce0455` |
| `design/concepts/playable-archive-v5-methods.png` | 分析工作台；窄索引与宽方法工作面。 | 1504×1046 | 2,255,634 bytes | `9918bae2b1298a84eff0543ea8205106c2197a9283dff55191418400e6311e05` |
| `design/concepts/playable-archive-v5-tool.png` | 实验板；步骤输入区、持续建议与导出行动。 | 1505×1045 | 2,150,305 bytes | `35904d3d0988c5af517a7e3c98d8275c1832b74ec2840ee0fa20f94d799eb603` |

## 4. 页面呈现与署名规则

1. 不热链。界面只加载 `public/assets/classic-games/*.webp`。
2. 第三方图像只能作为 `ClassicSpecimen` 或 `SpecimenCollage` 中有边界的视觉标本，不能成为品牌、导航、按钮或状态控件皮肤。
3. 图片上不叠文字。标签放在本站自己的不透明底板上，并与图片建立可读关联。
4. 首页最多同时出现四张标本；其它页面单一视区最多一张。完整长文只有当图像直接帮助理解时才使用。
5. 有信息价值的图片使用上文登记的中文 `alt`；重复裁切或纯装饰版本使用空 `alt=""`，避免屏幕阅读器重复朗读。
6. 站内视觉来源说明必须至少展示文件名、作者、许可、许可链接、来源页、改动说明。CC BY 素材不得只写游戏名。
7. CSS `object-position` 属于运行时非破坏性裁切；若将裁切烘焙为新文件，必须新增衍生资产记录和 SHA-256。
8. 不把不同游戏图片合成为一张虚构游戏包装；拼贴必须让每张照片保持独立边界与独立来源。

## 5. 公开发布硬门

在任何公开发布之前必须完成以下检查：

- 重新确认每个 Commons 文件页的许可和作者记录没有改变。
- 对四张现代商业游戏摄影中的版图、插画、商标与产品外观进行第二层权利评估；必要时向出版方取得许可或以原创派生语言替换。
- 保留 Billie Grace Ward 与 L'Éclipse 的完整署名、许可链接与修改说明。
- 确认页面没有暗示 CATAN Studio、Next Move Games、Days of Wonder、Hans im Glück 或其他出版方背书。
- 确认概念图没有进入构建产物。
- 为 WebP 转换流程保存可复现的编码参数；当前版本只保存结果哈希，编码质量参数仍是登记缺口。
- 对 `public` 与 `dist` 做文件清单审计，未登记素材不得发布。

## 6. 关联文件

- `docs/research/CLASSIC_BOARD_GAME_WEB_ASSET_AUDIT_V5_2026-08-23.md`
- `docs/product/OPEN_TABLE_V5_VISUAL_REVIEW_2026-08-23.md`
- `docs/product/TABLETOP_VISUAL_DESIGN_MANUAL_V4.md`
- `docs/product/tabletop-visual-tokens-v4.json`

本登记是产品素材治理记录，不是法律意见。
