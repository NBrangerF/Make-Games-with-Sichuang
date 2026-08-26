# Phase 1 本地课程发布权利与来源门禁交接

日期：2026-08-21  
状态：本工作包完成；项目总目标继续进行

## 本轮结果

为 57 份本地课程候选文件建立了逐文件、默认拒绝的发布就绪模型。四个资料群全部保持 `internal_reference_only`，只允许另写原创摘要和结构性观察；当前 `publicationCandidates` 为 0。没有复制原课件、学生作品、照片、合同、联系方式、原文或绝对本地路径。

本轮使用文档审阅技能检查现有 DOCX/PDF/Pages 证据边界，并核对中国人大网/政府官方法律文本与 Creative Commons 官方许可说明。结果是内部治理门，不是具体法律意见或发布授权。

## 新增文件

- `docs/local-materials/publication-readiness.json`：57 个文件键、四个资料群 profile、11 道门、问题、0 个候选；
- `docs/local-materials/PUBLICATION_RIGHTS_AUDIT_01.md`：官方依据、资料群结论、元数据局限、允许/禁止工作与取证清单；
- `docs/product/LOCAL_CONTENT_PUBLICATION_GATE.md`：状态机、数据分区、候选字段、构建门与 UI 边界；
- `scripts/check-local-publication-readiness.mjs`：19 项静态守卫。

## 修改文件

- `scripts/validate-content.mjs`：加载发布就绪模型，验证默认内部使用、直接发布关闭、候选为空和 57 个文件一一覆盖；
- `package.json`：新增 `local-publication:check`，并纳入 `content:check` 与生产构建；
- `docs/local-materials/INDEX.md`、`docs/product/CONTENT_DATA_MODEL.md`、`docs/INDEX.md`、`docs/ROADMAP.md`、`README.md`、`docs/product/FIDELITY_LEDGER.md`：记录模型、状态、命令与下一步。

## 当前权威状态

| 项目 | 数量 / 状态 |
|---|---:|
| 本地资料清单 | 57 |
| 逐文件审计覆盖 | 57 / 57 |
| 资料群 profile | 4 |
| 必需证据门 | 11 |
| 发布候选 | 0 |
| 直接公开源文件 | 0 |
| 发布守卫 | 19 / 19 |

四个 profile 当前所有门均为 `unresolved`。这不是说所有文件都有问题，而是现有仓库没有足以把任何门改为 `documented` 或 `not_applicable` 的受控证据。

## 关键设计决定

1. 清单只说明“有什么文件”，发布就绪文件才说明“目前能怎么用”；哈希不充当权利证据。
2. 源文件与公开副本分离。未来候选必须有新的稳定 ID、SHA-256、审阅日期、审阅角色、撤回负责人和 11 项证据定位。
3. 一项未解决就不能升级，不做加权总分或自动许可。
4. 合同、授权、联系人和同意原件未来只放受控证据库；公开仓库只保存非敏感证据 ID/定位。
5. 学生和未成年人材料不因课堂用途、匿名或监护人签字其中任一项而自动可公开；需要专门流程与专业复核。
6. CC 不预选。必须先确认许可权，并明确理解许可不可撤销及覆盖范围。

## 元数据检查结果

- 汉字课程 DOCX 的核心属性为 `dc:creator=DingTalk`、`lastModifiedBy=DingTalk`，创建/修改时间为 1970 占位值；这些字段不能证明作者或授权。包中未列出媒体文件。
- 5 个汉字课程 Pages 包均存在 `Index/Document.iwa`，本轮结构统计未发现媒体条目；没有从 IWA 猜测正文。
- 桌游×社会科学 PDF 的 Creator 为 Keynote、创建/修改时间为 2023-01-04、4 页；生成工具与标题不能证明作者/机构权利。
- 文件名中的 `by cheer21` 仅是待核实线索，不提升门禁状态。

## 验证证据

- `pnpm local-publication:check`：57 materials / 4 profiles / 19 guards，通过；
- `pnpm content:check`：533 resources / 27 entry points / 289 claims / 5 frameworks / 6 core guides / 31 special guides / 287 terms / 533 assessments / 22 cards / 57 local files，通过；
- 贡献包：安全默认、一个有效构造候选与 11 个拒绝分支，通过；
- `pnpm check`：TypeScript 通过；
- `node --check scripts/check-local-publication-readiness.mjs`：通过；
- `pnpm build`：Vite 8.2.1，37 modules，113 ms，通过。

构建产物未因本轮治理数据发生前端变化：CSS 66.48 kB（gzip 10.72）、主 JS 486.46 kB（gzip 148.64）、方法目录 502.36 kB（gzip 166.56）、资源目录 739.62 kB（gzip 195.67）；三个工具仍独立分块。方法与资源目录继续触发超过 500 kB 警告。

本轮没有 UI 改动，因此没有新增浏览器测试范围，也没有重试已记录的环境阻塞。既有浏览器回归仍不能标记通过。

## 官方依据

- [中华人民共和国著作权法](https://www.npc.gov.cn/c2/c30834/202011/t20201119_308796.html)
- [中华人民共和国个人信息保护法](https://www.npc.gov.cn/WZWSREL25wYy9jMi9jMzA4MzQvMjAyMTA4L3QyMDIxMDgyMF8zMTMwODguaHRtbD9yZWY9aW1i)
- [中华人民共和国民法典](https://www.samr.gov.cn/zw/zfxxgk/fdzdgknr/bgt/art/2023/art_60fb3863b7364b759123a42d1df568ca.html)
- [Creative Commons License Chooser](https://creativecommons.org/chooser/)
- [Creative Commons：License Your Work](https://creativecommons.org/cc-license-your-work/)

## 下一工作包

1. 请用户按四个资料群确认自己的角色、已知共同作者、学校/机构/委托关系，以及最希望先公开的 1–3 个结构；
2. 对这 1–3 个结构另写公开副本，不直接改源课件；
3. 建立不含敏感正文的 `evidenceRegister` 规则与受控证据位置约定；
4. 逐项替换或许可第三方图片、字体、商业游戏文字和模板；
5. 若候选涉及学生、课堂照片、声音、笔迹或作品，先暂停内容制作，完成地区化隐私与未成年人保护审查；
6. 只有冻结副本和 11 项证据齐全后，才构造首个 `public_copy_candidate`，并继续由人工发布负责人决定。

不应在没有用户/机构新证据时把当前 `unresolved` 批量改为 `not_applicable`，也不应把机器守卫通过写成“可以公开”。

