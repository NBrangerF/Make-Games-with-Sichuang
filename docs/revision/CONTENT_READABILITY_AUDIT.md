<!-- content-fingerprint: e3b6e4581afe0a1485ea891e305288d88a4f5bf37c846116f4c6fe393053d83b -->
# 全站资料文本可读性审计

审计日期：2026-09-10
范围：`content/` 下全部 361 个 JSON 与 Markdown 文件，不抽样。
覆盖：19,479 个含中文的字段或段落，约 586,959 个汉字。

## 结论

- 本报告审计文字长度与抽象词信号，不据此判断网站首页或学习路径是否有效。
- 机器规则标出了 511 个可能需要分段或渐进披露的长句、长段与抽象词密集处。这是编辑优先级，不是内容质量评分。
- 授权译文和来源正文保留原有使用范围；原创双语文章提供独立阅读入口，课程、案例与工具维持各自路径。
- 汉字阈值只评估含中文的字段或段落。英文正文参与文件指纹与解析检查，但不能因此声称其可读性已被这些阈值验证。

## 当前内容组织

1. 原创双语文章位于 `content/original-articles/`；一个文章身份对应中文和英文，来源摘录与研究证据留在网站外的内部研究目录。
2. 十二个观察与迭代节点保留独立长度、断链与禁用“能力等级”的校验，不将这份机器审计当作学习效果证据。
3. 系统课程、设计工作台、案例、专题与资料目录分别提供已有入口；本文不把它们描述为同一条强制阅读流程。
4. 原创文章的双语对应、出处和独立例子需要单独编辑复核，不能由下方长句统计替代。
5. 新增阅读内容不改变已有项目记录或来源的使用权限。

## 全量文件台账

| 文件 | 中文字段/段落 | 汉字数 | 高摩擦候选 | 前台处理 |
| --- | ---: | ---: | ---: | --- |
| `claims.json` | 644 | 32881 | 22 | 内部元数据：不作为新手首屏文案 |
| `concept-action-index.json` | 65 | 721 | 0 | 内部元数据：不作为新手首屏文案 |
| `design-cases/agricola/en.md` | 0 | 0 | 0 | 支持资料：通过节点或资料库按需进入 |
| `design-cases/agricola/meta.json` | 6 | 140 | 0 | 支持资料：通过节点或资料库按需进入 |
| `design-cases/agricola/zh-CN.md` | 37 | 2348 | 1 | 支持资料：通过节点或资料库按需进入 |
| `design-cases/azul/en.md` | 0 | 0 | 0 | 支持资料：通过节点或资料库按需进入 |
| `design-cases/azul/meta.json` | 6 | 125 | 0 | 支持资料：通过节点或资料库按需进入 |
| `design-cases/azul/zh-CN.md` | 42 | 2343 | 8 | 支持资料：通过节点或资料库按需进入 |
| `design-cases/cant-stop/en.md` | 0 | 0 | 0 | 支持资料：通过节点或资料库按需进入 |
| `design-cases/cant-stop/meta.json` | 5 | 111 | 0 | 支持资料：通过节点或资料库按需进入 |
| `design-cases/cant-stop/zh-CN.md` | 38 | 2352 | 7 | 支持资料：通过节点或资料库按需进入 |
| `design-cases/carcassonne/en.md` | 0 | 0 | 0 | 支持资料：通过节点或资料库按需进入 |
| `design-cases/carcassonne/meta.json` | 5 | 112 | 0 | 支持资料：通过节点或资料库按需进入 |
| `design-cases/carcassonne/zh-CN.md` | 38 | 2380 | 1 | 支持资料：通过节点或资料库按需进入 |
| `design-cases/dominion/en.md` | 0 | 0 | 0 | 支持资料：通过节点或资料库按需进入 |
| `design-cases/dominion/meta.json` | 6 | 117 | 0 | 支持资料：通过节点或资料库按需进入 |
| `design-cases/dominion/zh-CN.md` | 38 | 2468 | 1 | 支持资料：通过节点或资料库按需进入 |
| `design-cases/el-grande/en.md` | 0 | 0 | 0 | 支持资料：通过节点或资料库按需进入 |
| `design-cases/el-grande/meta.json` | 6 | 145 | 0 | 支持资料：通过节点或资料库按需进入 |
| `design-cases/el-grande/zh-CN.md` | 44 | 2582 | 6 | 支持资料：通过节点或资料库按需进入 |
| `design-cases/for-sale/en.md` | 0 | 0 | 0 | 支持资料：通过节点或资料库按需进入 |
| `design-cases/for-sale/meta.json` | 5 | 128 | 0 | 支持资料：通过节点或资料库按需进入 |
| `design-cases/for-sale/zh-CN.md` | 43 | 2239 | 6 | 支持资料：通过节点或资料库按需进入 |
| `design-cases/hanabi/en.md` | 0 | 0 | 0 | 支持资料：通过节点或资料库按需进入 |
| `design-cases/hanabi/meta.json` | 6 | 131 | 0 | 支持资料：通过节点或资料库按需进入 |
| `design-cases/hanabi/zh-CN.md` | 39 | 2489 | 2 | 支持资料：通过节点或资料库按需进入 |
| `design-cases/modern-art/en.md` | 0 | 0 | 0 | 支持资料：通过节点或资料库按需进入 |
| `design-cases/modern-art/meta.json` | 5 | 102 | 0 | 支持资料：通过节点或资料库按需进入 |
| `design-cases/modern-art/zh-CN.md` | 43 | 2096 | 4 | 支持资料：通过节点或资料库按需进入 |
| `design-cases/pandemic/en.md` | 0 | 0 | 0 | 支持资料：通过节点或资料库按需进入 |
| `design-cases/pandemic/meta.json` | 6 | 125 | 0 | 支持资料：通过节点或资料库按需进入 |
| `design-cases/pandemic/zh-CN.md` | 35 | 2306 | 0 | 支持资料：通过节点或资料库按需进入 |
| `design-cases/quacks/en.md` | 0 | 0 | 0 | 支持资料：通过节点或资料库按需进入 |
| `design-cases/quacks/meta.json` | 5 | 121 | 0 | 支持资料：通过节点或资料库按需进入 |
| `design-cases/quacks/zh-CN.md` | 37 | 2549 | 8 | 支持资料：通过节点或资料库按需进入 |
| `design-cases/radlands/en.md` | 0 | 0 | 0 | 支持资料：通过节点或资料库按需进入 |
| `design-cases/radlands/meta.json` | 5 | 120 | 0 | 支持资料：通过节点或资料库按需进入 |
| `design-cases/radlands/zh-CN.md` | 37 | 2231 | 3 | 支持资料：通过节点或资料库按需进入 |
| `design-cases/root/en.md` | 0 | 0 | 0 | 支持资料：通过节点或资料库按需进入 |
| `design-cases/root/meta.json` | 5 | 111 | 0 | 支持资料：通过节点或资料库按需进入 |
| `design-cases/root/zh-CN.md` | 47 | 2494 | 2 | 支持资料：通过节点或资料库按需进入 |
| `design-cases/six-nimmt/en.md` | 0 | 0 | 0 | 支持资料：通过节点或资料库按需进入 |
| `design-cases/six-nimmt/meta.json` | 6 | 122 | 0 | 支持资料：通过节点或资料库按需进入 |
| `design-cases/six-nimmt/zh-CN.md` | 38 | 2047 | 2 | 支持资料：通过节点或资料库按需进入 |
| `design-cases/spirit-island/en.md` | 0 | 0 | 0 | 支持资料：通过节点或资料库按需进入 |
| `design-cases/spirit-island/meta.json` | 6 | 123 | 0 | 支持资料：通过节点或资料库按需进入 |
| `design-cases/spirit-island/zh-CN.md` | 39 | 2651 | 6 | 支持资料：通过节点或资料库按需进入 |
| `design-cases/the-crew/en.md` | 0 | 0 | 0 | 支持资料：通过节点或资料库按需进入 |
| `design-cases/the-crew/meta.json` | 6 | 119 | 0 | 支持资料：通过节点或资料库按需进入 |
| `design-cases/the-crew/zh-CN.md` | 46 | 2304 | 8 | 支持资料：通过节点或资料库按需进入 |
| `design-cases/ticket-to-ride/en.md` | 0 | 0 | 0 | 支持资料：通过节点或资料库按需进入 |
| `design-cases/ticket-to-ride/meta.json` | 6 | 143 | 0 | 支持资料：通过节点或资料库按需进入 |
| `design-cases/ticket-to-ride/zh-CN.md` | 48 | 2919 | 6 | 支持资料：通过节点或资料库按需进入 |
| `design-cases/wingspan/en.md` | 0 | 0 | 0 | 支持资料：通过节点或资料库按需进入 |
| `design-cases/wingspan/meta.json` | 7 | 148 | 0 | 支持资料：通过节点或资料库按需进入 |
| `design-cases/wingspan/zh-CN.md` | 41 | 2672 | 4 | 支持资料：通过节点或资料库按需进入 |
| `design-constraints.json` | 37 | 830 | 0 | 支持资料：通过节点或资料库按需进入 |
| `design-library/action-points/en.md` | 0 | 0 | 0 | 支持资料：通过节点或资料库按需进入 |
| `design-library/action-points/zh-CN.md` | 31 | 1823 | 6 | 支持资料：通过节点或资料库按需进入 |
| `design-library/action-selection/en.md` | 0 | 0 | 0 | 支持资料：通过节点或资料库按需进入 |
| `design-library/action-selection/zh-CN.md` | 36 | 1749 | 6 | 支持资料：通过节点或资料库按需进入 |
| `design-library/animals/en.md` | 0 | 0 | 0 | 支持资料：通过节点或资料库按需进入 |
| `design-library/animals/zh-CN.md` | 35 | 1596 | 1 | 支持资料：通过节点或资料库按需进入 |
| `design-library/apprenticeship/en.md` | 0 | 0 | 0 | 支持资料：通过节点或资料库按需进入 |
| `design-library/apprenticeship/zh-CN.md` | 23 | 1031 | 0 | 支持资料：通过节点或资料库按需进入 |
| `design-library/archive/en.md` | 0 | 0 | 0 | 支持资料：通过节点或资料库按需进入 |
| `design-library/archive/zh-CN.md` | 23 | 1031 | 0 | 支持资料：通过节点或资料库按需进入 |
| `design-library/area-control/en.md` | 0 | 0 | 0 | 支持资料：通过节点或资料库按需进入 |
| `design-library/area-control/zh-CN.md` | 29 | 1377 | 2 | 支持资料：通过节点或资料库按需进入 |
| `design-library/area-majority/en.md` | 0 | 0 | 0 | 支持资料：通过节点或资料库按需进入 |
| `design-library/area-majority/zh-CN.md` | 30 | 1436 | 4 | 支持资料：通过节点或资料库按需进入 |
| `design-library/auction/en.md` | 0 | 0 | 0 | 支持资料：通过节点或资料库按需进入 |
| `design-library/auction/zh-CN.md` | 33 | 1559 | 1 | 支持资料：通过节点或资料库按需进入 |
| `design-library/bag-building/en.md` | 0 | 0 | 0 | 支持资料：通过节点或资料库按需进入 |
| `design-library/bag-building/zh-CN.md` | 33 | 1736 | 4 | 支持资料：通过节点或资料库按需进入 |
| `design-library/care-schedule/en.md` | 0 | 0 | 0 | 支持资料：通过节点或资料库按需进入 |
| `design-library/care-schedule/zh-CN.md` | 23 | 1017 | 3 | 支持资料：通过节点或资料库按需进入 |
| `design-library/catalog.json` | 364 | 4155 | 0 | 支持资料：通过节点或资料库按需进入 |
| `design-library/city-building/en.md` | 0 | 0 | 0 | 支持资料：通过节点或资料库按需进入 |
| `design-library/city-building/zh-CN.md` | 26 | 1095 | 1 | 支持资料：通过节点或资料库按需进入 |
| `design-library/city-planning/en.md` | 0 | 0 | 0 | 支持资料：通过节点或资料库按需进入 |
| `design-library/city-planning/zh-CN.md` | 23 | 983 | 2 | 支持资料：通过节点或资料库按需进入 |
| `design-library/communication-limits/en.md` | 0 | 0 | 0 | 支持资料：通过节点或资料库按需进入 |
| `design-library/communication-limits/zh-CN.md` | 26 | 1264 | 2 | 支持资料：通过节点或资料库按需进入 |
| `design-library/community-kitchen/en.md` | 0 | 0 | 0 | 支持资料：通过节点或资料库按需进入 |
| `design-library/community-kitchen/zh-CN.md` | 22 | 968 | 0 | 支持资料：通过节点或资料库按需进入 |
| `design-library/comparison-area-network/en.md` | 0 | 0 | 0 | 支持资料：通过节点或资料库按需进入 |
| `design-library/comparison-area-network/zh-CN.md` | 29 | 1234 | 2 | 支持资料：通过节点或资料库按需进入 |
| `design-library/comparison-bid-payment/en.md` | 0 | 0 | 0 | 支持资料：通过节点或资料库按需进入 |
| `design-library/comparison-bid-payment/zh-CN.md` | 24 | 999 | 1 | 支持资料：通过节点或资料库按需进入 |
| `design-library/comparison-deck-bag/en.md` | 0 | 0 | 0 | 支持资料：通过节点或资料库按需进入 |
| `design-library/comparison-deck-bag/zh-CN.md` | 35 | 1528 | 3 | 支持资料：通过节点或资料库按需进入 |
| `design-library/comparison-occupy-price/en.md` | 0 | 0 | 0 | 支持资料：通过节点或资料库按需进入 |
| `design-library/comparison-occupy-price/zh-CN.md` | 35 | 1400 | 0 | 支持资料：通过节点或资料库按需进入 |
| `design-library/comparison-reveal-order/en.md` | 0 | 0 | 0 | 支持资料：通过节点或资料库按需进入 |
| `design-library/comparison-reveal-order/zh-CN.md` | 29 | 1278 | 1 | 支持资料：通过节点或资料库按需进入 |
| `design-library/comparison-stop-allocate/en.md` | 0 | 0 | 0 | 支持资料：通过节点或资料库按需进入 |
| `design-library/comparison-stop-allocate/zh-CN.md` | 26 | 1008 | 1 | 支持资料：通过节点或资料库按需进入 |
| `design-library/cooperative-structure/en.md` | 0 | 0 | 0 | 支持资料：通过节点或资料库按需进入 |
| `design-library/cooperative-structure/zh-CN.md` | 25 | 1058 | 1 | 支持资料：通过节点或资料库按需进入 |
| `design-library/deck-building/en.md` | 0 | 0 | 0 | 支持资料：通过节点或资料库按需进入 |
| `design-library/deck-building/zh-CN.md` | 29 | 1514 | 2 | 支持资料：通过节点或资料库按需进入 |
| `design-library/dice-allocation/en.md` | 0 | 0 | 0 | 支持资料：通过节点或资料库按需进入 |
| `design-library/dice-allocation/zh-CN.md` | 28 | 1095 | 1 | 支持资料：通过节点或资料库按需进入 |
| `design-library/drafting/en.md` | 0 | 0 | 0 | 支持资料：通过节点或资料库按需进入 |
| `design-library/drafting/zh-CN.md` | 31 | 1496 | 2 | 支持资料：通过节点或资料库按需进入 |
| `design-library/ecosystem/en.md` | 0 | 0 | 0 | 支持资料：通过节点或资料库按需进入 |
| `design-library/ecosystem/zh-CN.md` | 23 | 1007 | 0 | 支持资料：通过节点或资料库按需进入 |
| `design-library/environment/en.md` | 0 | 0 | 0 | 支持资料：通过节点或资料库按需进入 |
| `design-library/environment/zh-CN.md` | 26 | 1019 | 0 | 支持资料：通过节点或资料库按需进入 |
| `design-library/expedition/en.md` | 0 | 0 | 0 | 支持资料：通过节点或资料库按需进入 |
| `design-library/expedition/zh-CN.md` | 22 | 1007 | 2 | 支持资料：通过节点或资料库按需进入 |
| `design-library/exploration/en.md` | 0 | 0 | 0 | 支持资料：通过节点或资料库按需进入 |
| `design-library/exploration/zh-CN.md` | 25 | 1115 | 1 | 支持资料：通过节点或资料库按需进入 |
| `design-library/fantasy/en.md` | 0 | 0 | 0 | 支持资料：通过节点或资料库按需进入 |
| `design-library/fantasy/zh-CN.md` | 27 | 1049 | 0 | 支持资料：通过节点或资料库按需进入 |
| `design-library/farming/en.md` | 0 | 0 | 0 | 支持资料：通过节点或资料库按需进入 |
| `design-library/farming/zh-CN.md` | 26 | 1068 | 0 | 支持资料：通过节点或资料库按需进入 |
| `design-library/festival/en.md` | 0 | 0 | 0 | 支持资料：通过节点或资料库按需进入 |
| `design-library/festival/zh-CN.md` | 22 | 968 | 0 | 支持资料：通过节点或资料库按需进入 |
| `design-library/hand-management/en.md` | 0 | 0 | 0 | 支持资料：通过节点或资料库按需进入 |
| `design-library/hand-management/zh-CN.md` | 31 | 1514 | 0 | 支持资料：通过节点或资料库按需进入 |
| `design-library/hidden-information/en.md` | 0 | 0 | 0 | 支持资料：通过节点或资料库按需进入 |
| `design-library/hidden-information/zh-CN.md` | 28 | 1357 | 4 | 支持资料：通过节点或资料库按需进入 |
| `design-library/income-production/en.md` | 0 | 0 | 0 | 支持资料：通过节点或资料库按需进入 |
| `design-library/income-production/zh-CN.md` | 23 | 943 | 2 | 支持资料：通过节点或资料库按需进入 |
| `design-library/industry/en.md` | 0 | 0 | 0 | 支持资料：通过节点或资料库按需进入 |
| `design-library/industry/zh-CN.md` | 26 | 959 | 1 | 支持资料：通过节点或资料库按需进入 |
| `design-library/lesson-build-a-combination/en.md` | 0 | 0 | 0 | 支持资料：通过节点或资料库按需进入 |
| `design-library/lesson-build-a-combination/zh-CN.md` | 29 | 1386 | 0 | 支持资料：通过节点或资料库按需进入 |
| `design-library/lesson-change-one-risk/en.md` | 0 | 0 | 0 | 支持资料：通过节点或资料库按需进入 |
| `design-library/lesson-change-one-risk/zh-CN.md` | 25 | 1148 | 4 | 支持资料：通过节点或资料库按需进入 |
| `design-library/lesson-choose-a-mechanism/en.md` | 0 | 0 | 0 | 支持资料：通过节点或资料库按需进入 |
| `design-library/lesson-choose-a-mechanism/zh-CN.md` | 26 | 1372 | 1 | 支持资料：通过节点或资料库按需进入 |
| `design-library/lesson-compare-two-games/en.md` | 0 | 0 | 0 | 支持资料：通过节点或资料库按需进入 |
| `design-library/lesson-compare-two-games/zh-CN.md` | 33 | 1927 | 5 | 支持资料：通过节点或资料库按需进入 |
| `design-library/lesson-design-for-participation/en.md` | 0 | 0 | 0 | 支持资料：通过节点或资料库按需进入 |
| `design-library/lesson-design-for-participation/zh-CN.md` | 27 | 1251 | 1 | 支持资料：通过节点或资料库按需进入 |
| `design-library/lesson-observe-a-turn/en.md` | 0 | 0 | 0 | 支持资料：通过节点或资料库按需进入 |
| `design-library/lesson-observe-a-turn/zh-CN.md` | 25 | 1073 | 3 | 支持资料：通过节点或资料库按需进入 |
| `design-library/lesson-prototype-a-question/en.md` | 0 | 0 | 0 | 支持资料：通过节点或资料库按需进入 |
| `design-library/lesson-prototype-a-question/zh-CN.md` | 26 | 1262 | 1 | 支持资料：通过节点或资料库按需进入 |
| `design-library/lesson-see-a-mechanism/en.md` | 0 | 0 | 0 | 支持资料：通过节点或资料库按需进入 |
| `design-library/lesson-see-a-mechanism/zh-CN.md` | 29 | 1438 | 1 | 支持资料：通过节点或资料库按需进入 |
| `design-library/lesson-test-rules/en.md` | 0 | 0 | 0 | 支持资料：通过节点或资料库按需进入 |
| `design-library/lesson-test-rules/zh-CN.md` | 26 | 1145 | 1 | 支持资料：通过节点或资料库按需进入 |
| `design-library/lesson-theme-promises/en.md` | 0 | 0 | 0 | 支持资料：通过节点或资料库按需进入 |
| `design-library/lesson-theme-promises/zh-CN.md` | 33 | 1470 | 0 | 支持资料：通过节点或资料库按需进入 |
| `design-library/lesson-theme-to-rule/en.md` | 0 | 0 | 0 | 支持资料：通过节点或资料库按需进入 |
| `design-library/lesson-theme-to-rule/zh-CN.md` | 35 | 1481 | 2 | 支持资料：通过节点或资料库按需进入 |
| `design-library/lesson-use-feedback/en.md` | 0 | 0 | 0 | 支持资料：通过节点或资料库按需进入 |
| `design-library/lesson-use-feedback/zh-CN.md` | 27 | 1314 | 3 | 支持资料：通过节点或资料库按需进入 |
| `design-library/market-pricing/en.md` | 0 | 0 | 0 | 支持资料：通过节点或资料库按需进入 |
| `design-library/market-pricing/zh-CN.md` | 24 | 927 | 3 | 支持资料：通过节点或资料库按需进入 |
| `design-library/medical/en.md` | 0 | 0 | 0 | 支持资料：通过节点或资料库按需进入 |
| `design-library/medical/zh-CN.md` | 26 | 1057 | 0 | 支持资料：通过节点或资料库按需进入 |
| `design-library/medieval/en.md` | 0 | 0 | 0 | 支持资料：通过节点或资料库按需进入 |
| `design-library/medieval/zh-CN.md` | 26 | 1072 | 0 | 支持资料：通过节点或资料库按需进入 |
| `design-library/mystery/en.md` | 0 | 0 | 0 | 支持资料：通过节点或资料库按需进入 |
| `design-library/mystery/zh-CN.md` | 28 | 1063 | 0 | 支持资料：通过节点或资料库按需进入 |
| `design-library/push-your-luck/en.md` | 0 | 0 | 0 | 支持资料：通过节点或资料库按需进入 |
| `design-library/push-your-luck/zh-CN.md` | 35 | 1542 | 0 | 支持资料：通过节点或资料库按需进入 |
| `design-library/repair-cafe/en.md` | 0 | 0 | 0 | 支持资料：通过节点或资料库按需进入 |
| `design-library/repair-cafe/zh-CN.md` | 23 | 946 | 1 | 支持资料：通过节点或资料库按需进入 |
| `design-library/rescue-network/en.md` | 0 | 0 | 0 | 支持资料：通过节点或资料库按需进入 |
| `design-library/rescue-network/zh-CN.md` | 23 | 1015 | 1 | 支持资料：通过节点或资料库按需进入 |
| `design-library/resource-conversion/en.md` | 0 | 0 | 0 | 支持资料：通过节点或资料库按需进入 |
| `design-library/resource-conversion/zh-CN.md` | 24 | 899 | 1 | 支持资料：通过节点或资料库按需进入 |
| `design-library/restoration/en.md` | 0 | 0 | 0 | 支持资料：通过节点或资料库按需进入 |
| `design-library/restoration/zh-CN.md` | 23 | 963 | 1 | 支持资料：通过节点或资料库按需进入 |
| `design-library/route-building/en.md` | 0 | 0 | 0 | 支持资料：通过节点或资料库按需进入 |
| `design-library/route-building/zh-CN.md` | 26 | 1180 | 2 | 支持资料：通过节点或资料库按需进入 |
| `design-library/science-fiction/en.md` | 0 | 0 | 0 | 支持资料：通过节点或资料库按需进入 |
| `design-library/science-fiction/zh-CN.md` | 25 | 1046 | 0 | 支持资料：通过节点或资料库按需进入 |
| `design-library/set-collection/en.md` | 0 | 0 | 0 | 支持资料：通过节点或资料库按需进入 |
| `design-library/set-collection/zh-CN.md` | 32 | 1522 | 3 | 支持资料：通过节点或资料库按需进入 |
| `design-library/shared-resource/en.md` | 0 | 0 | 0 | 支持资料：通过节点或资料库按需进入 |
| `design-library/shared-resource/zh-CN.md` | 22 | 900 | 0 | 支持资料：通过节点或资料库按需进入 |
| `design-library/simultaneous-choice/en.md` | 0 | 0 | 0 | 支持资料：通过节点或资料库按需进入 |
| `design-library/simultaneous-choice/zh-CN.md` | 30 | 1459 | 2 | 支持资料：通过节点或资料库按需进入 |
| `design-library/tile-placement/en.md` | 0 | 0 | 0 | 支持资料：通过节点或资料库按需进入 |
| `design-library/tile-placement/zh-CN.md` | 26 | 1249 | 1 | 支持资料：通过节点或资料库按需进入 |
| `design-library/trading/en.md` | 0 | 0 | 0 | 支持资料：通过节点或资料库按需进入 |
| `design-library/trading/zh-CN.md` | 24 | 998 | 2 | 支持资料：通过节点或资料库按需进入 |
| `design-library/transportation/en.md` | 0 | 0 | 0 | 支持资料：通过节点或资料库按需进入 |
| `design-library/transportation/zh-CN.md` | 34 | 1494 | 1 | 支持资料：通过节点或资料库按需进入 |
| `design-library/water-governance/en.md` | 0 | 0 | 0 | 支持资料：通过节点或资料库按需进入 |
| `design-library/water-governance/zh-CN.md` | 25 | 932 | 2 | 支持资料：通过节点或资料库按需进入 |
| `design-library/worker-placement/en.md` | 0 | 0 | 0 | 支持资料：通过节点或资料库按需进入 |
| `design-library/worker-placement/zh-CN.md` | 33 | 1649 | 2 | 支持资料：通过节点或资料库按需进入 |
| `design-materials.json` | 285 | 6179 | 0 | 支持资料：通过节点或资料库按需进入 |
| `frameworks.json` | 81 | 1504 | 0 | 支持资料：通过节点或资料库按需进入 |
| `glossary-index.json` | 258 | 1155 | 0 | 内部元数据：不作为新手首屏文案 |
| `glossary.json` | 2150 | 34801 | 9 | 支持资料：通过节点或资料库按需进入 |
| `guides.json` | 240 | 6601 | 2 | 入口与支线：前台按需出现 |
| `guides/monsoon-market-variables-case-synthesis-zh-CN-internal.md` | 57 | 1625 | 0 | 案例正文：保留为按需案例 |
| `guides/monsoon-market-variables-case-synthesis-zh-CN-internal.metadata.json` | 3 | 61 | 0 | 案例正文：保留为按需案例 |
| `guides/new-bedford-manufacturing-constraint-case-synthesis-zh-CN-internal.md` | 124 | 4616 | 4 | 案例正文：保留为按需案例 |
| `guides/new-bedford-manufacturing-constraint-case-synthesis-zh-CN-internal.metadata.json` | 12 | 151 | 0 | 案例正文：保留为按需案例 |
| `guides/paul-grogan-rulebook-layout-case-synthesis-zh-CN-internal.md` | 110 | 4110 | 2 | 案例正文：保留为按需案例 |
| `guides/paul-grogan-rulebook-layout-case-synthesis-zh-CN-internal.metadata.json` | 11 | 138 | 0 | 案例正文：保留为按需案例 |
| `guides/quid-for-your-quo-case-synthesis-zh-CN-internal.md` | 116 | 4189 | 2 | 案例正文：保留为按需案例 |
| `guides/quid-for-your-quo-case-synthesis-zh-CN-internal.metadata.json` | 11 | 136 | 0 | 案例正文：保留为按需案例 |
| `learning-nodes.json` | 200 | 4326 | 0 | 主线权威文案：已按短句规则修订 |
| `learning-units/learn-by-playing-one-moment-zh-CN.md` | 272 | 6675 | 5 | 完整课程：保留为深入阅读 |
| `learning-units/learn-by-playing-one-moment-zh-CN.metadata.json` | 5 | 162 | 0 | 完整课程：保留为深入阅读 |
| `learning-units/systematic-unit-00-question-first-zh-CN.md` | 94 | 2103 | 0 | 完整课程：保留为深入阅读 |
| `learning-units/systematic-unit-00-question-first-zh-CN.metadata.json` | 4 | 73 | 0 | 完整课程：保留为深入阅读 |
| `learning-units/systematic-unit-01-experience-intent-zh-CN.md` | 95 | 2229 | 1 | 完整课程：保留为深入阅读 |
| `learning-units/systematic-unit-01-experience-intent-zh-CN.metadata.json` | 4 | 72 | 0 | 完整课程：保留为深入阅读 |
| `learning-units/systematic-unit-02-decisions-core-loop-zh-CN.md` | 110 | 2481 | 1 | 完整课程：保留为深入阅读 |
| `learning-units/systematic-unit-02-decisions-core-loop-zh-CN.metadata.json` | 4 | 75 | 0 | 完整课程：保留为深入阅读 |
| `learning-units/systematic-unit-03-mechanisms-information-interaction-zh-CN.md` | 219 | 7467 | 7 | 完整课程：保留为深入阅读 |
| `learning-units/systematic-unit-03-mechanisms-information-interaction-zh-CN.metadata.json` | 4 | 86 | 0 | 完整课程：保留为深入阅读 |
| `learning-units/systematic-unit-04-minimum-prototype-zh-CN.md` | 283 | 7613 | 5 | 完整课程：保留为深入阅读 |
| `learning-units/systematic-unit-04-minimum-prototype-zh-CN.metadata.json` | 4 | 87 | 0 | 完整课程：保留为深入阅读 |
| `learning-units/systematic-unit-05-single-question-test-zh-CN.md` | 388 | 12211 | 13 | 完整课程：保留为深入阅读 |
| `learning-units/systematic-unit-05-single-question-test-zh-CN.metadata.json` | 4 | 111 | 0 | 完整课程：保留为深入阅读 |
| `learning-units/systematic-unit-06-evidence-to-next-version-zh-CN.md` | 410 | 12604 | 14 | 完整课程：保留为深入阅读 |
| `learning-units/systematic-unit-06-evidence-to-next-version-zh-CN.metadata.json` | 4 | 125 | 1 | 完整课程：保留为深入阅读 |
| `original-articles/before-the-first-rule/en.md` | 0 | 0 | 0 | 原创双语阅读：直接打开，不以项目或练习提交为前提 |
| `original-articles/before-the-first-rule/zh-CN.md` | 22 | 1350 | 0 | 原创双语阅读：直接打开，不以项目或练习提交为前提 |
| `original-articles/between-your-turns/en.md` | 0 | 0 | 0 | 原创双语阅读：直接打开，不以项目或练习提交为前提 |
| `original-articles/between-your-turns/zh-CN.md` | 22 | 1397 | 1 | 原创双语阅读：直接打开，不以项目或练习提交为前提 |
| `original-articles/beyond-game-labels/en.md` | 0 | 0 | 0 | 原创双语阅读：直接打开，不以项目或练习提交为前提 |
| `original-articles/beyond-game-labels/zh-CN.md` | 21 | 1259 | 0 | 原创双语阅读：直接打开，不以项目或练习提交为前提 |
| `original-articles/catalog.json` | 82 | 1777 | 0 | 原创双语阅读：直接打开，不以项目或练习提交为前提 |
| `original-articles/constraints-that-open-possibilities/en.md` | 0 | 0 | 0 | 原创双语阅读：直接打开，不以项目或练习提交为前提 |
| `original-articles/constraints-that-open-possibilities/zh-CN.md` | 16 | 1096 | 1 | 原创双语阅读：直接打开，不以项目或练习提交为前提 |
| `original-articles/emotion-through-action/en.md` | 0 | 0 | 0 | 原创双语阅读：直接打开，不以项目或练习提交为前提 |
| `original-articles/emotion-through-action/zh-CN.md` | 21 | 1231 | 0 | 原创双语阅读：直接打开，不以项目或练习提交为前提 |
| `original-articles/play-beyond-the-rules/en.md` | 0 | 0 | 0 | 原创双语阅读：直接打开，不以项目或练习提交为前提 |
| `original-articles/play-beyond-the-rules/zh-CN.md` | 22 | 1362 | 0 | 原创双语阅读：直接打开，不以项目或练习提交为前提 |
| `original-articles/reading-access-and-participation/en.md` | 0 | 0 | 0 | 原创双语阅读：直接打开，不以项目或练习提交为前提 |
| `original-articles/reading-access-and-participation/zh-CN.md` | 22 | 1340 | 0 | 原创双语阅读：直接打开，不以项目或练习提交为前提 |
| `original-articles/reading-balance-and-player-count/en.md` | 0 | 0 | 0 | 原创双语阅读：直接打开，不以项目或练习提交为前提 |
| `original-articles/reading-balance-and-player-count/zh-CN.md` | 23 | 1747 | 5 | 原创双语阅读：直接打开，不以项目或练习提交为前提 |
| `original-articles/reading-choices-and-agency/en.md` | 0 | 0 | 0 | 原创双语阅读：直接打开，不以项目或练习提交为前提 |
| `original-articles/reading-choices-and-agency/zh-CN.md` | 22 | 1447 | 1 | 原创双语阅读：直接打开，不以项目或练习提交为前提 |
| `original-articles/reading-combine-mechanisms/en.md` | 0 | 0 | 0 | 原创双语阅读：直接打开，不以项目或练习提交为前提 |
| `original-articles/reading-combine-mechanisms/zh-CN.md` | 26 | 1640 | 2 | 原创双语阅读：直接打开，不以项目或练习提交为前提 |
| `original-articles/reading-cooperation-and-conflict/en.md` | 0 | 0 | 0 | 原创双语阅读：直接打开，不以项目或练习提交为前提 |
| `original-articles/reading-cooperation-and-conflict/zh-CN.md` | 22 | 1532 | 2 | 原创双语阅读：直接打开，不以项目或练习提交为前提 |
| `original-articles/reading-core-actions/en.md` | 0 | 0 | 0 | 原创双语阅读：直接打开，不以项目或练习提交为前提 |
| `original-articles/reading-core-actions/zh-CN.md` | 19 | 1144 | 2 | 原创双语阅读：直接打开，不以项目或练习提交为前提 |
| `original-articles/reading-design-an-economy/en.md` | 0 | 0 | 0 | 原创双语阅读：直接打开，不以项目或练习提交为前提 |
| `original-articles/reading-design-an-economy/zh-CN.md` | 23 | 1560 | 1 | 原创双语阅读：直接打开，不以项目或练习提交为前提 |
| `original-articles/reading-design-judgment/en.md` | 0 | 0 | 0 | 原创双语阅读：直接打开，不以项目或练习提交为前提 |
| `original-articles/reading-design-judgment/zh-CN.md` | 16 | 1153 | 0 | 原创双语阅读：直接打开，不以项目或练习提交为前提 |
| `original-articles/reading-diagnose-feedback/en.md` | 0 | 0 | 0 | 原创双语阅读：直接打开，不以项目或练习提交为前提 |
| `original-articles/reading-diagnose-feedback/zh-CN.md` | 25 | 1818 | 1 | 原创双语阅读：直接打开，不以项目或练习提交为前提 |
| `original-articles/reading-first-design-brief/en.md` | 0 | 0 | 0 | 原创双语阅读：直接打开，不以项目或练习提交为前提 |
| `original-articles/reading-first-design-brief/zh-CN.md` | 15 | 1058 | 0 | 原创双语阅读：直接打开，不以项目或练习提交为前提 |
| `original-articles/reading-goals-and-pacing/en.md` | 0 | 0 | 0 | 原创双语阅读：直接打开，不以项目或练习提交为前提 |
| `original-articles/reading-goals-and-pacing/zh-CN.md` | 21 | 1471 | 1 | 原创双语阅读：直接打开，不以项目或练习提交为前提 |
| `original-articles/reading-ideas-under-constraints/en.md` | 0 | 0 | 0 | 原创双语阅读：直接打开，不以项目或练习提交为前提 |
| `original-articles/reading-ideas-under-constraints/zh-CN.md` | 16 | 1102 | 1 | 原创双语阅读：直接打开，不以项目或练习提交为前提 |
| `original-articles/reading-independent-rules-test/en.md` | 0 | 0 | 0 | 原创双语阅读：直接打开，不以项目或练习提交为前提 |
| `original-articles/reading-independent-rules-test/zh-CN.md` | 18 | 1272 | 1 | 原创双语阅读：直接打开，不以项目或练习提交为前提 |
| `original-articles/reading-information-and-randomness/en.md` | 0 | 0 | 0 | 原创双语阅读：直接打开，不以项目或练习提交为前提 |
| `original-articles/reading-information-and-randomness/zh-CN.md` | 24 | 1494 | 2 | 原创双语阅读：直接打开，不以项目或练习提交为前提 |
| `original-articles/reading-observe-a-game/en.md` | 0 | 0 | 0 | 原创双语阅读：直接打开，不以项目或练习提交为前提 |
| `original-articles/reading-observe-a-game/zh-CN.md` | 16 | 1123 | 2 | 原创双语阅读：直接打开，不以项目或练习提交为前提 |
| `original-articles/reading-plan-a-playtest/en.md` | 0 | 0 | 0 | 原创双语阅读：直接打开，不以项目或练习提交为前提 |
| `original-articles/reading-plan-a-playtest/zh-CN.md` | 16 | 1113 | 1 | 原创双语阅读：直接打开，不以项目或练习提交为前提 |
| `original-articles/reading-players-and-context/en.md` | 0 | 0 | 0 | 原创双语阅读：直接打开，不以项目或练习提交为前提 |
| `original-articles/reading-players-and-context/zh-CN.md` | 19 | 1232 | 0 | 原创双语阅读：直接打开，不以项目或练习提交为前提 |
| `original-articles/reading-prototype-for-a-question/en.md` | 0 | 0 | 0 | 原创双语阅读：直接打开，不以项目或练习提交为前提 |
| `original-articles/reading-prototype-for-a-question/zh-CN.md` | 15 | 1113 | 1 | 原创双语阅读：直接打开，不以项目或练习提交为前提 |
| `original-articles/reading-prototypes-and-evidence/en.md` | 0 | 0 | 0 | 原创双语阅读：直接打开，不以项目或练习提交为前提 |
| `original-articles/reading-prototypes-and-evidence/zh-CN.md` | 19 | 1154 | 0 | 原创双语阅读：直接打开，不以项目或练习提交为前提 |
| `original-articles/reading-resources-and-endings/en.md` | 0 | 0 | 0 | 原创双语阅读：直接打开，不以项目或练习提交为前提 |
| `original-articles/reading-resources-and-endings/zh-CN.md` | 24 | 1607 | 0 | 原创双语阅读：直接打开，不以项目或练习提交为前提 |
| `original-articles/reading-rules-and-components/en.md` | 0 | 0 | 0 | 原创双语阅读：直接打开，不以项目或练习提交为前提 |
| `original-articles/reading-rules-and-components/zh-CN.md` | 22 | 1361 | 2 | 原创双语阅读：直接打开，不以项目或练习提交为前提 |
| `original-articles/reading-rules-and-play/en.md` | 0 | 0 | 0 | 原创双语阅读：直接打开，不以项目或练习提交为前提 |
| `original-articles/reading-rules-and-play/zh-CN.md` | 24 | 1536 | 0 | 原创双语阅读：直接打开，不以项目或练习提交为前提 |
| `original-articles/reading-share-a-playable-version/en.md` | 0 | 0 | 0 | 原创双语阅读：直接打开，不以项目或练习提交为前提 |
| `original-articles/reading-share-a-playable-version/zh-CN.md` | 19 | 1340 | 3 | 原创双语阅读：直接打开，不以项目或练习提交为前提 |
| `original-articles/reading-space-and-opportunity/en.md` | 0 | 0 | 0 | 原创双语阅读：直接打开，不以项目或练习提交为前提 |
| `original-articles/reading-space-and-opportunity/zh-CN.md` | 22 | 1262 | 1 | 原创双语阅读：直接打开，不以项目或练习提交为前提 |
| `original-articles/reading-state-and-resolution/en.md` | 0 | 0 | 0 | 原创双语阅读：直接打开，不以项目或练习提交为前提 |
| `original-articles/reading-state-and-resolution/zh-CN.md` | 17 | 1140 | 1 | 原创双语阅读：直接打开，不以项目或练习提交为前提 |
| `original-articles/reading-stories-and-models/en.md` | 0 | 0 | 0 | 原创双语阅读：直接打开，不以项目或练习提交为前提 |
| `original-articles/reading-stories-and-models/zh-CN.md` | 21 | 1330 | 1 | 原创双语阅读：直接打开，不以项目或练习提交为前提 |
| `original-articles/reading-theme-and-emotion/en.md` | 0 | 0 | 0 | 原创双语阅读：直接打开，不以项目或练习提交为前提 |
| `original-articles/reading-theme-and-emotion/zh-CN.md` | 19 | 1263 | 0 | 原创双语阅读：直接打开，不以项目或练习提交为前提 |
| `original-articles/reading-time-and-interaction/en.md` | 0 | 0 | 0 | 原创双语阅读：直接打开，不以项目或练习提交为前提 |
| `original-articles/reading-time-and-interaction/zh-CN.md` | 21 | 1381 | 0 | 原创双语阅读：直接打开，不以项目或练习提交为前提 |
| `original-articles/rewards-and-reasons/en.md` | 0 | 0 | 0 | 原创双语阅读：直接打开，不以项目或练习提交为前提 |
| `original-articles/rewards-and-reasons/zh-CN.md` | 22 | 1287 | 1 | 原创双语阅读：直接打开，不以项目或练习提交为前提 |
| `original-articles/when-feedback-disagrees/en.md` | 0 | 0 | 0 | 原创双语阅读：直接打开，不以项目或练习提交为前提 |
| `original-articles/when-feedback-disagrees/zh-CN.md` | 19 | 1159 | 0 | 原创双语阅读：直接打开，不以项目或练习提交为前提 |
| `original-articles/when-options-matter/en.md` | 0 | 0 | 0 | 原创双语阅读：直接打开，不以项目或练习提交为前提 |
| `original-articles/when-options-matter/zh-CN.md` | 21 | 1213 | 0 | 原创双语阅读：直接打开，不以项目或练习提交为前提 |
| `original-articles/when-players-cannot-meet/en.md` | 0 | 0 | 0 | 原创双语阅读：直接打开，不以项目或练习提交为前提 |
| `original-articles/when-players-cannot-meet/zh-CN.md` | 22 | 1295 | 1 | 原创双语阅读：直接打开，不以项目或练习提交为前提 |
| `original-articles/when-players-run-the-system/en.md` | 0 | 0 | 0 | 原创双语阅读：直接打开，不以项目或练习提交为前提 |
| `original-articles/when-players-run-the-system/zh-CN.md` | 22 | 1324 | 0 | 原创双语阅读：直接打开，不以项目或练习提交为前提 |
| `original-articles/when-randomness-helps/en.md` | 0 | 0 | 0 | 原创双语阅读：直接打开，不以项目或练习提交为前提 |
| `original-articles/when-randomness-helps/zh-CN.md` | 21 | 1233 | 1 | 原创双语阅读：直接打开，不以项目或练习提交为前提 |
| `original-articles/where-resources-go/en.md` | 0 | 0 | 0 | 原创双语阅读：直接打开，不以项目或练习提交为前提 |
| `original-articles/where-resources-go/zh-CN.md` | 22 | 1329 | 1 | 原创双语阅读：直接打开，不以项目或练习提交为前提 |
| `print-and-play/book-cart.json` | 45 | 862 | 0 | 支持资料：通过节点或资料库按需进入 |
| `reading-examples.json` | 84 | 3289 | 0 | 支持资料：通过节点或资料库按需进入 |
| `reading-path.json` | 25 | 644 | 0 | 支持资料：通过节点或资料库按需进入 |
| `reading-support.json` | 56 | 1749 | 0 | 支持资料：通过节点或资料库按需进入 |
| `resource-assessments.json` | 1148 | 33197 | 0 | 内部元数据：不作为新手首屏文案 |
| `resource-audience-paths.json` | 19 | 340 | 0 | 入口与支线：前台按需出现 |
| `resource-entry-catalogs/accessibility-task-path.json` | 77 | 1866 | 1 | 支持资料：通过节点或资料库按需进入 |
| `resource-entry-catalogs/auction-value-discovery.json` | 66 | 1443 | 2 | 支持资料：通过节点或资料库按需进入 |
| `resource-entry-catalogs/campaign-state-testing.json` | 70 | 1567 | 1 | 支持资料：通过节点或资料库按需进入 |
| `resource-entry-catalogs/card-language-effect-resolution.json` | 68 | 1352 | 1 | 支持资料：通过节点或资料库按需进入 |
| `resource-entry-catalogs/card-pool-version-governance.json` | 62 | 1199 | 1 | 支持资料：通过节点或资料库按需进入 |
| `resource-entry-catalogs/choose-design-aid.json` | 73 | 1538 | 0 | 支持资料：通过节点或资料库按需进入 |
| `resource-entry-catalogs/choose-learning-spine.json` | 83 | 1478 | 0 | 支持资料：通过节点或资料库按需进入 |
| `resource-entry-catalogs/core-loop-handoff.json` | 67 | 1457 | 0 | 支持资料：通过节点或资料库按需进入 |
| `resource-entry-catalogs/cross-session-finding-evolution.json` | 52 | 1565 | 1 | 支持资料：通过节点或资料库按需进入 |
| `resource-entry-catalogs/deck-building-draw-cycle.json` | 64 | 1473 | 1 | 支持资料：通过节点或资料库按需进入 |
| `resource-entry-catalogs/evidence-review-change-brief.json` | 52 | 1461 | 1 | 支持资料：通过节点或资料库按需进入 |
| `resource-entry-catalogs/finding-lineage-successor-revision.json` | 52 | 1593 | 2 | 支持资料：通过节点或资料库按需进入 |
| `resource-entry-catalogs/first-playtest.json` | 65 | 1310 | 0 | 支持资料：通过节点或资料库按需进入 |
| `resource-entry-catalogs/first-prototype.json` | 69 | 1207 | 0 | 支持资料：通过节点或资料库按需进入 |
| `resource-entry-catalogs/game-length-and-endings.json` | 70 | 1676 | 1 | 支持资料：通过节点或资料库按需进入 |
| `resource-entry-catalogs/hidden-information-hand-economy.json` | 67 | 1409 | 1 | 支持资料：通过节点或资料库按需进入 |
| `resource-entry-catalogs/issue-to-system-translation.json` | 68 | 1535 | 1 | 支持资料：通过节点或资料库按需进入 |
| `resource-entry-catalogs/learn-by-playing.json` | 79 | 1650 | 0 | 支持资料：通过节点或资料库按需进入 |
| `resource-entry-catalogs/live-playtest-session.json` | 54 | 1516 | 1 | 支持资料：通过节点或资料库按需进入 |
| `resource-entry-catalogs/market-restock-price-feedback.json` | 67 | 1243 | 1 | 支持资料：通过节点或资料库按需进入 |
| `resource-entry-catalogs/negotiation-commitment-alliance.json` | 67 | 1449 | 1 | 支持资料：通过节点或资料库按需进入 |
| `resource-entry-catalogs/player-count-scaling.json` | 66 | 1628 | 1 | 支持资料：通过节点或资料库按需进入 |
| `resource-entry-catalogs/player-symptom-diagnosis.json` | 83 | 1796 | 1 | 支持资料：通过节点或资料库按需进入 |
| `resource-entry-catalogs/production-and-publishing.json` | 69 | 1423 | 0 | 支持资料：通过节点或资料库按需进入 |
| `resource-entry-catalogs/prototype-scope-and-fidelity.json` | 63 | 1383 | 1 | 支持资料：通过节点或资料库按需进入 |
| `resource-entry-catalogs/randomness-and-uncertainty.json` | 66 | 1767 | 1 | 支持资料：通过节点或资料库按需进入 |
| `resource-entry-catalogs/resource-production-chain.json` | 69 | 1298 | 1 | 支持资料：通过节点或资料库按需进入 |
| `resource-entry-catalogs/rules-and-teaching.json` | 65 | 1449 | 0 | 支持资料：通过节点或资料库按需进入 |
| `resource-entry-catalogs/scoring-goals-incentives.json` | 63 | 1617 | 1 | 支持资料：通过节点或资料库按需进入 |
| `resource-entry-catalogs/single-question-playtest.json` | 62 | 1417 | 1 | 支持资料：通过节点或资料库按需进入 |
| `resource-entry-catalogs/solo-automa-design.json` | 61 | 1386 | 1 | 支持资料：通过节点或资料库按需进入 |
| `resource-entry-catalogs/spatial-map-structure.json` | 73 | 1717 | 1 | 支持资料：通过节点或资料库按需进入 |
| `resource-entry-catalogs/test-design-aid-before-release.json` | 70 | 1775 | 0 | 支持资料：通过节点或资料库按需进入 |
| `resource-entry-catalogs/turn-structure-action-economy.json` | 66 | 1527 | 1 | 支持资料：通过节点或资料库按需进入 |
| `resource-entry-index.json` | 35 | 482 | 0 | 内部元数据：不作为新手首屏文案 |
| `resource-entry-manifest.json` | 0 | 0 | 0 | 支持资料：通过节点或资料库按需进入 |
| `resource-entry-points.json` | 137 | 6523 | 26 | 入口与支线：前台按需出现 |
| `resource-evaluation-rubric.json` | 46 | 359 | 0 | 支持资料：通过节点或资料库按需进入 |
| `resource-index.json` | 43 | 579 | 0 | 内部元数据：不作为新手首屏文案 |
| `resource-learning-content.json` | 83 | 2496 | 0 | 支持资料：通过节点或资料库按需进入 |
| `resource-learning-paths.json` | 85 | 1900 | 0 | 入口与支线：前台按需出现 |
| `resources.json` | 3277 | 57804 | 1 | 支持资料：通过节点或资料库按需进入 |
| `special-guides.json` | 1414 | 52654 | 105 | 入口与支线：前台按需出现 |
| `translations/dune-imperium-beginnings-zh-CN-internal.md` | 118 | 4015 | 1 | 授权或来源正文：保留，不做自动改写 |
| `translations/dune-imperium-beginnings-zh-CN-internal.metadata.json` | 7 | 118 | 0 | 授权或来源正文：保留，不做自动改写 |
| `translations/game-design-concepts-level-01-zh-CN.md` | 100 | 5726 | 5 | 授权或来源正文：保留，不做自动改写 |
| `translations/game-design-concepts-level-01-zh-CN.metadata.json` | 1 | 39 | 0 | 授权或来源正文：保留，不做自动改写 |
| `translations/game-design-concepts-level-02-zh-CN.md` | 74 | 4555 | 8 | 授权或来源正文：保留，不做自动改写 |
| `translations/game-design-concepts-level-02-zh-CN.metadata.json` | 1 | 38 | 0 | 授权或来源正文：保留，不做自动改写 |
| `translations/what-makes-a-rulebook-accessible-and-entertaining-zh-CN.md` | 161 | 12714 | 38 | 授权或来源正文：保留，不做自动改写 |
| `translations/what-makes-a-rulebook-accessible-and-entertaining-zh-CN.metadata.json` | 0 | 0 | 0 | 授权或来源正文：保留，不做自动改写 |
| `visual-assets/classic-board-game-assets.json` | 14 | 134 | 0 | 支持资料：通过节点或资料库按需进入 |

## 优先复核片段

以下最多列出 60 个机器信号最强的片段。它们不会自动进入新手主线；编辑时需保留原意、证据和许可边界。

| 文件与位置 | 信号 | 片段 |
| --- | --- | --- |
| `guides/paul-grogan-rulebook-layout-case-synthesis-zh-CN-internal.md` line 113 | 单句 281 个汉字；单段 281 个汉字 | ｜ 受访者参与过工作量差异很大的多份规则书 ｜ “编辑”可能从校对到重构，项目应先定义工作范围 ｜ 参与数量自动证明每项建议都适合所有游戏 ｜ ｜ 有版面完整的 PDF 仍缺少移动等执行条件 ｜ 接近成品的外观不能证明陌生人可以执行规则 ｜… |
| `guides/new-bedford-manufacturing-constraint-case-synthesis-zh-CN-internal.md` line 120 | 单句 276 个汉字；单段 276 个汉字 | ｜ 二十座建筑来自单张纸容量 ｜ 原型制作条件确实进入了数量决定 ｜ 二十是平衡或出版的普遍最佳值 ｜ ｜ 游戏围绕该建筑数继续开发 ｜ 暂时固定数量能建立可比较版本 ｜ 数量限制单独造成了游戏质量 ｜ ｜ 建筑移动而不增加所有权小件 ｜ … |
| `translations/what-makes-a-rulebook-accessible-and-entertaining-zh-CN.md` line 177 | 单段 536 个汉字；并列项较多（25） | **[7.4]** 不过，要到达这种理解，玩家首先必须处理一些具体规则。即使场景很简单，这些规则对新手也未必立刻直观。《Dixit》［Roubira（2008）；复杂度 1.19/5］是一款异想天开的卡牌游戏，玩家通过艺术图像讲故事，任何人… |
| `translations/what-makes-a-rulebook-accessible-and-entertaining-zh-CN.md` line 147 | 单段 468 个汉字；并列项较多（27） | **[5.2]** 除非加入作弊码或模组，否则电子游戏会替你强制执行系统逻辑。角色扮演游戏中，玩家和规则之间的关系更松散；裁判的一句话就可能让整个系统失去效力（Sturdee, Gamboa, and Heron 2023）。“什么算规则”… |
| `learning-units/systematic-unit-06-evidence-to-next-version-zh-CN.md` line 561 | 单句 216 个汉字；单段 216 个汉字 | ｜ 取消或降低交换行动代价 ｜ 玩家可能认为交换不值得 ｜ 会同时改变价值判断，盖住可见性问题 ｜ 玩家已看见并讨论，却持续明确因行动损失拒绝交换 ｜ ｜ 改变水位速度 ｜ 加强共同时间压力 ｜ 当前没有水位状态或压力原话 ｜ 多场记录显示… |
| `guides/quid-for-your-quo-case-synthesis-zh-CN-internal.md` line 113 | 单句 217 个汉字；单段 217 个汉字 | ｜ 《Pax Pamir》不同群体忽略或过度利用谈判规则 ｜ 谈判规则可能因缺少支撑而无效，也可能改变终局节奏 ｜ 所有开放谈判都会拖长游戏 ｜ ｜ 熟练玩家越来越少使用高成本承诺方块 ｜ 代价可能压低工具的实际使用率 ｜ 降低 1 分就能… |
| `learning-units/systematic-unit-04-minimum-prototype-zh-CN.md` line 116 | 单句 203 个汉字；单段 203 个汉字；并列项较多（19） | ｜ 表示位置和相邻关系 ｜ 白纸、方格纸、便利贴拼成的区域 ｜ 移动距离、控制区域和站位会影响决定 ｜ ｜ 表示可拿取或可交换的信息 ｜ 索引卡、裁开的废纸、卡套加纸条 ｜ 手牌、工具、任务和所有权会变化 ｜ ｜ 表示数量或可移动状态 ｜ … |
| `learning-units/systematic-unit-06-evidence-to-next-version-zh-CN.md` line 501 | 单句 174 个汉字；单段 259 个汉字；并列项较多（10） | ｜ A. 工具归属与可交接性在开局不够醒目 ｜ 开局未查看工具；原话把工具理解为只能自己使用 ｜ 后来水獭能指向绳索并提出交换，说明信息并非永远不可见 ｜ 卡牌实际位置、字号、提示条是否被读、第一次注意工具的准确时点 ｜ ｜ B. 玩家看见… |
| `translations/what-makes-a-rulebook-accessible-and-entertaining-zh-CN.md` line 161 | 单段 438 个汉字；并列项较多（17） | **[6.2]** 不过，也必须留意一个事实：规则书经常体现一种“违背的时候比遵守的时候更多”的惯例。如前所述，在一桌玩家中，真正以不止于匆匆浏览的方式读过这两类规则书中任何一本的人，只占很小一部分。许多桌游通过非正式方式教学，由一个“会玩… |
| `translations/what-makes-a-rulebook-accessible-and-entertaining-zh-CN.md` line 175 | 单段 424 个汉字；并列项较多（14） | **[7.3]** 具备游戏系统经验以后，人们会对一条规则“为什么存在”形成直觉。规则书说一张牌必须“面朝下”打出，或每个人必须按先攻顺序行动时，经验会进一步提供对后果的理解。面朝下的牌在翻开前是秘密。既然是秘密，就意味着游戏需要不让其他玩… |
| `learning-units/systematic-unit-06-evidence-to-next-version-zh-CN.md` line 41 | 单句 195 个汉字；单段 195 个汉字 | ｜ 冻结版本 ｜ 当时玩家实际面对什么 ｜ 玩家为什么这样做 ｜ ｜ 原始观察 ｜ 桌面上发生了什么 ｜ 玩家心里在想什么 ｜ ｜ 玩家原话 ｜ 玩家怎样描述当时体验 ｜ 这段描述是否就是唯一原因 ｜ ｜ 设计者解释 ｜ 哪些原因目前看来可… |
| `translations/what-makes-a-rulebook-accessible-and-entertaining-zh-CN.md` line 58 | 单段 359 个汉字；并列项较多（22） | **[0.3]** 玩桌游或角色扮演游戏时，最先要做的事情之一就是阅读规则。这里有一个前提：桌边至少得有一个人会阅读。规则带给玩家的认知负荷可能相当大；它不只影响理解规则的行为，也可能影响游玩体验。学习一款游戏需要专门的素养。玩家无法通过规… |
| `learning-units/systematic-unit-03-mechanisms-information-interaction-zh-CN.md` line 260 | 单句 180 个汉字；单段 180 个汉字 | ｜ 原型版本与日期 ｜ ｜ ｜ 被观察的决定窗口 ｜ ｜ ｜ 决定者 ｜ ｜ ｜ 触发条件 ｜ ｜ ｜ 规则允许／要求的行动 ｜ ｜ ｜ 玩家当时能直接看见的信息 ｜ ｜ ｜ 玩家知道、推测或误解的信息 ｜ ｜ ｜ 规则上的合法行动 ｜ ｜… |
| `translations/what-makes-a-rulebook-accessible-and-entertaining-zh-CN.md` line 52 | 单段 352 个汉字；并列项较多（21） | **[0.1]** 玩桌游或角色扮演游戏时，最先要做的事情之一就是阅读规则。这里隐含着一个前提：桌边至少得有一个人会阅读。规则可能给玩家带来相当大的认知负荷；它既会影响理解规则这件事，也会影响游玩体验。学习一款游戏需要专门的素养。玩家无法通… |
| `special-guides.json` $[22].evidenceBoundary | 单句 99 个汉字；单段 287 个汉字；并列项较多（24） | 本指南综合五篇设计师/出版实践、三份正式或准正式规则材料、五项承诺与联盟实验研究、两项在线 Diplomacy 消息/关系研究、一项四场社交桌游沟通质性研究、一篇无障碍长评和一项非代表性玩家讨论，并复用站内互动、计分、回合、人数与伤害检查材… |
| `special-guides.json` $[20].evidenceBoundary | 单句 104 个汉字；单段 263 个汉字；并列项较多（21） | 本指南综合三篇桌游设计师理论/实践、五篇商业项目一手日志、一篇玩家长评、一项非代表性设计社区讨论、一项 262 分钟/9 人的桌游录像质性研究、一篇 21 款游戏的会话分析摘要、一篇数字桌面协调政策短论文，以及官方实时/合作规则和站内人数、… |
| `translations/what-makes-a-rulebook-accessible-and-entertaining-zh-CN.md` line 260 | 单段 345 个汉字；并列项较多（16） | ｜ 拆除污名 ｜ 无障碍支持经常伴随污名，而手册的一些常见做法会强化负面观感。例如，把规则称为“新手版”和“普通版”，可能带有把人当小孩的意味；称作“标准版”和“进阶版”就没有这个问题。许多桌游玩家严格坚持规则原文，不愿作出规则没有明确支持… |
| `special-guides.json` $[29].evidenceBoundary | 单句 96 个汉字；单段 271 个汉字；并列项较多（25） | 本指南综合 25 个新来源：Magic 的稀有度/补充包骨架与当前禁限、Arkham/Marvel Champions 的 FAQ 与卡池环境、Netrunner 的规则事实源/轮替/禁限节奏/开发日志、五个实体扩展或升级包、GMT 与 L… |
| `special-guides.json` $[21].evidenceBoundary | 单句 97 个汉字；单段 267 个汉字；并列项较多（25） | 本指南综合四篇桌游设计师地图文章/日志、六个商业项目或官方规则案例、两项实体桌面/HCI 研究、一项 12 人教育型领土游戏迭代、一篇玩家图论分析、一篇记者现场测试和两项非代表性社区讨论，并复用站内人数、互动、历史抽象和无障碍研究。证据支持… |
| `learning-units/systematic-unit-03-mechanisms-information-interaction-zh-CN.md` line 186 | 单句 146 个汉字；并列项较多（23） | ｜ 转移 ｜ 给、换、偷走资源或权限 ｜ 接受、拒绝、回赠、改计划 ｜ ｜ 占用 ｜ 先拿公共位置、骰子或卡槽 ｜ 改走其他路线、提高出价、等待 ｜ ｜ 改写共同状态 ｜ 推高水位、移动公共标记 ｜ 补救、加速、放弃某目标 ｜ ｜ 改变信息… |
| `special-guides.json` $[28].evidenceBoundary | 单句 75 个汉字；单段 285 个汉字；并列项较多（32） | 本指南综合五套正式规则或更新、一套规则汇编、九项设计师与编辑实践、五项形式/计算研究、五项无障碍资料和三项非代表性玩家症状，并复用 Daybreak 设计日志、dV Giochi 规则指南、Unfair 词表、Meeple Centred … |
| `translations/what-makes-a-rulebook-accessible-and-entertaining-zh-CN.md` line 211 | 单段 325 个汉字；并列项较多（15） | ｜ 易懂语言 ｜ 如前所述，在规则书中使用易懂语言，有潜力降低文本的认知负荷。为此，应当遵循易懂语言的一般规则和书面文本规则。 ｜ ｜ 流程 ｜ 编写游戏规则和指示时，必须确保内容组织良好、结构清楚。应当：说明玩家角色所处的情境；以有顺序、… |
| `translations/what-makes-a-rulebook-accessible-and-entertaining-zh-CN.md` line 248 | 单段 328 个汉字；并列项较多（13） | ｜ 再现 ｜ 手册怎样再现玩家及其角色，可能产生问题。例如，示例回合如果只使用西方男性名字（Bill、Bob 和 Jim），而不是体现更包容的视角（Bill、Emily 和 Mohammad），就会形成偏差。允许玩家担任的角色也可能反映异性… |
| `learning-units/systematic-unit-06-evidence-to-next-version-zh-CN.md` line 200 | 单句 159 个汉字 | ｜ 线索 ｜ 一条清楚观察或一句相关原话 ｜ “这提示我们检查……” ｜ “原因已经找到” ｜ ｜ 相互支持 ｜ 行为、原话或桌面状态从不同角度指向同一解释 ｜ “这个解释比以前更可信” ｜ “其他原因已排除” ｜ ｜ 重复信号 ｜ 同一冻… |
| `learning-units/systematic-unit-05-single-question-test-zh-CN.md` line 453 | 单句 150 个汉字；并列项较多（9） | ｜ 来源版本 ｜ 完整版本名与日期 ｜ ｜ 单问题 ｜ 原句，不在结束后改写 ｜ ｜ 范围 ｜ 参与人数、是否首次接触、关系/经验/语言中与解释有关的部分、媒介 ｜ ｜ 关键行为 ｜ 带时间或回合的两至四条记录 ｜ ｜ 关键原话 ｜ 逐字或… |
| `special-guides.json` $[27].evidenceBoundary | 单句 85 个汉字；单段 265 个汉字；并列项较多（23） | 本指南综合六份正式规则或规则参考、五项设计师实践、六项数学与计算研究、两篇无障碍评测和四项非代表性玩家症状，并复用 Undaunted 设计日记、Meeple Centred Design 与第一人称无障碍实践。证据支持按功能和区域描述牌库… |
| `special-guides.json` $[12].evidenceBoundary | 单句 99 个汉字；单段 230 个汉字；并列项较多（14） | 本指南综合跨设计领域的专长综述、一名工业设计学生三年自评的探索模型、11 位职业游戏设计师与 22 位教育电子游戏设计师访谈、单门桌游课程日志研究、25 篇 Game Jam 学习研究的系统综述、一日教育桌游 Jam 试点，以及商业设计师、… |
| `special-guides.json` $[17].evidenceBoundary | 单句 90 个汉字；单段 234 个汉字；并列项较多（21） | 本指南综合三篇实体桌游设计师实践/日志、一篇实践分类、一篇数字 4X 相邻设计日志、一篇桌游淘汰研究短文、一项数字游戏退出研究、一篇玩家长评、一组多人投降讨论，以及站内已有的反馈回路、停机时间和人数配置材料。证据支持拆开局长口径、节奏形状、… |
| `translations/what-makes-a-rulebook-accessible-and-entertaining-zh-CN.md` line 155 | 单段 285 个汉字；并列项较多（12） | **[6.1]** 制作规则书时存在一种张力：它必须同时服务两个彼此矛盾的大目标。第一个目标是作为教学材料，教玩家理解游戏的机制与游玩意义。传统上，人们预期玩家线性阅读这类材料，而内容顺序最好能反映最理想的学习体验。第二个目标是作为参考材料… |
| `learning-units/systematic-unit-04-minimum-prototype-zh-CN.md` line 129 | 单句 138 个汉字 | ｜ A4 河道纸 ｜ 两人的位置、相邻列和障碍 ｜ 这次问题包含空间与交接时机 ｜ ｜ 两枚纸棋子 ｜ 谁在哪里 ｜ 玩家要比较自己与同伴的位置 ｜ ｜ 两张工具卡 ｜ 当前由谁持有哪件工具 ｜ 实体交换是目标行动的一部分 ｜ ｜ 水位代币… |
| `special-guides.json` $[13].evidenceBoundary | 单句 103 个汉字；单段 208 个汉字；并列项较多（17） | 本指南综合数字游戏的三个月日记、自然情境玩家日记、日记/录像回看/焦点小组三角验证、三周学习与投入多案例、纵向 HCI 分类、片段式移动日记、日记反应性实验、包容性教育桌游测试、抽象策略桌游体验采样协议、游戏用户研究实践和两篇桌游设计日志。… |
| `special-guides.json` $[19].evidenceBoundary | 单句 85 个汉字；单段 237 个汉字；并列项较多（20） | 本指南综合三篇桌游设计师理论/实践、四篇商业项目一手日志、一项 200 人 Boggle 奖励实验、一篇含 126 人分数可见性实验的数字游戏博士论文、两篇玩家长评、一项非代表性社区讨论，以及站内多目标、终局、平衡与主题材料。证据支持拆开结… |
| `learning-units/systematic-unit-04-minimum-prototype-zh-CN.md` line 90 | 单句 131 个汉字 | ｜ 开始状态 ｜ 组件最初在哪里 ｜ 两只动物在起点，各拿着同伴需要的工具 ｜ ｜ 可见信息 ｜ 玩家能看到什么 ｜ 两条河道、两个障碍、工具归属和水位 ｜ ｜ 目标行动 ｜ 哪个选择必须能够发生 ｜ 前进，或放弃前进来交换工具 ｜ ｜ 状… |
| `learning-units/systematic-unit-06-evidence-to-next-version-zh-CN.md` line 526 | 单句 130 个汉字 | ｜ 河道、障碍、初始工具分配 ｜ 保留 ｜ 它们让目标关系快速出现；本轮没有证据要求改变 ｜ ｜ 工具归属与可交接性的可见表达 ｜ 修复并检验 ｜ 原因 A 有行为与原话样例共同指向，而且可用低成本信息改动检验 ｜ ｜ 交换的行动代价 ｜ … |
| `translations/what-makes-a-rulebook-accessible-and-entertaining-zh-CN.md` line 199 | 单段 266 个汉字；并列项较多（17） | ｜ 色觉辨识障碍 ｜ 制作规则书时，必须认识到有些玩家可能无法区分某些颜色。因此，指称特定标记物时，建议根据它们的角色（或可识别特征）来称呼，而不是按颜色称呼。例如写“农夫可以交易水果”，不要写“黄色玩家可以交易水果”。 ｜ ｜ 对比度 ｜… |
| `learning-units/systematic-unit-03-mechanisms-information-interaction-zh-CN.md` line 129 | 单句 125 个汉字；单段 184 个汉字 | ｜ 真实状态 ｜ 此刻真实内容 ｜ 挡水工具，可用一次 ｜ ｜ 谁直接看见 ｜ 无需推理就能读取的人 ｜ 阿鹿本人 ｜ ｜ 谁可能知道 ｜ 从旧信息或规则能确定的人 ｜ 暂时只有阿鹿 ｜ ｜ 何时更新 ｜ 信息在什么窗口变化 ｜ 工具被使用… |
| `learning-units/systematic-unit-04-minimum-prototype-zh-CN.md` line 217 | 单句 125 个汉字；并列项较多（10） | ｜ 外观与触感 ｜ 大小、形状、重量会影响拿取或理解吗 ｜ 工具卡要能被单独拿起；插画可省略 ｜ ｜ 信息 ｜ 名称、公开与隐藏信息是否足以作决定 ｜ 障碍需求和工具归属都公开可见 ｜ ｜ 功能 ｜ 目标行动是否真的能完成 ｜ 前进、交接、… |
| `translations/what-makes-a-rulebook-accessible-and-entertaining-zh-CN.md` line 179 | 单段 272 个汉字；并列项较多（12） | **[7.5]** 手册也经常编码对玩家性别的假设。例如，游戏很常把“he”当作“he/she/they”的默认形式；有些手册甚至会用很长的脚注解释为什么这样没有问题，而不是直接改用更包容的语言。《Tales of the Arabian … |
| `learning-units/systematic-unit-05-single-question-test-zh-CN.md` line 124 | 单句 134 个汉字 | ｜ 版本与局面 ｜ v0.1 的开局切片 ｜ 防止把后来改过的牌混进来 ｜ ｜ 关键条件 ｜ 交接占用发起者本回合前进机会 ｜ 指出本轮关心的机会代价 ｜ ｜ 参与者 ｜ 第一次接触此版本的两名玩家 ｜ 限定这次证据来自谁 ｜ ｜ 时间边界… |
| `special-guides.json` $[18].evidenceBoundary | 单句 81 个汉字；单段 241 个汉字；并列项较多（16） | 本指南综合两项桌游/卡牌随机性计算与体验研究、两项纯机会或技能—随机归因的相邻心理学研究、四篇设计师理论/讲义、两篇商业项目一手日志、一篇玩家长评，以及站内既有概率与桌游体验材料。证据支持把不确定性来源、随机时点循环、风险暴露、缓解操作、结… |
| `special-guides.json` $[26].evidenceBoundary | 单句 74 个汉字；单段 246 个汉字；并列项较多（20） | 本指南综合六份正式规则或官方设计资料、五项设计师实践、五项学术或相邻研究、两篇无障碍长评和三项非代表性玩家症状，并复用合作信息不对称与公开信息资料。证据支持把信息写成带角色和时点的状态、把手牌写成生命周期、补全沟通与宣称—质疑—验证协议、保… |
| `learning-units/systematic-unit-03-mechanisms-information-interaction-zh-CN.md` line 55 | 单句 124 个汉字 | ｜ **规则事实** ｜ 正式规则或来源明确写出的做法 ｜ 某游戏规定玩家每项任务只能通信一次 ｜ ｜ **作者观点或报告** ｜ 设计师怎样理解自己的设计，或报告某个版本出现了什么 ｜ 作者认为某种共享资源未必构成有意义的互动 ｜ ｜ *… |
| `design-library/lesson-compare-two-games/zh-CN.md` line 54 | 单句 121 个汉字 | ｜ 决定者已经知道什么 ｜ 自己的25与当前四行 ｜ 目标牌是2与公开烟花 ｜ ｜ 还缺哪部分 ｜ 对手本次选牌及其结算影响 ｜ 自己目标牌的颜色 ｜ ｜ 什么能补足判断 ｜ 揭示并逐张更新桌面，但承诺已经作出 ｜ 在出牌前取得完整颜色提示… |
| `learning-units/systematic-unit-06-evidence-to-next-version-zh-CN.md` line 166 | 单句 116 个汉字；并列项较多（8） | ｜ 看见 ｜ 玩家有没有注意到相关信息 ｜ 是否查看同伴工具、障碍需求和水位 ｜ ｜ 理解 ｜ 看见以后怎样理解规则 ｜ 是否知道同列可换、发起者耗行动、双方卡片互换 ｜ ｜ 取舍 ｜ 理解以后是否认为值得 ｜ 是否比较先移动、先交换与水位… |
| `special-guides.json` $[16].evidenceBoundary | 单句 74 个汉字；单段 228 个汉字；并列项较多（17） | 本指南综合一项 8 款已实现桌游的计算研究、三篇商业产品一手设计日志、一篇设计师实践、一篇实践综述、Dixit/Codenames/Captain Sonar 官方规则、一个角色等待设计日志、中文玩家停机时间长评和 BGG 平台数据结构。证… |
| `special-guides.json` $[6].evidenceBoundary | 单段 244 个汉字；并列项较多（10） | 关于决定代办的同意分类来自 Analog Game Studies 的文献回顾与案例论证，不是发生率量表。DiGRA 匿名合作桌游研究是小型探索性焦点小组与原型。信息不对称研究目前只取得十对数字原型参与者的摘要；社交推理研究为三十三名不同玩… |
| `special-guides.json` $[23].evidenceBoundary | 单段 222 个汉字；并列项较多（20） | 本指南综合六份正式或规则级案例、两项设计师实践、五项拍卖课程/综述/实验与田野研究、两篇无障碍长评、一篇社区设计博客和两项非代表性玩家/设计讨论。证据支持先写价值类型、把报价与估值分开、界定赢家诅咒、明确分配/支付/资金去向/落败成本、把并… |
| `learning-units/systematic-unit-01-experience-intent-zh-CN.md` line 70 | 单句 110 个汉字 | ｜ 紧张 ｜ 玩家在截止前反复比较两个有代价的行动，或改变原计划 ｜ ｜ 合作 ｜ 玩家交换信息、提出分工、为他人保留资源 ｜ ｜ 发现 ｜ 玩家根据新线索修正对系统的解释 ｜ ｜ 掌控感 ｜ 玩家能够说出行动为何导致当前结果，并据此计划下… |
| `special-guides.json` $[25].evidenceBoundary | 单段 217 个汉字；并列项较多（19） | 本指南综合六份规则案例、五项设计师或从业方法、三项系统动力学与相邻研究、两篇无障碍长评和四项非代表性玩家症状，并复用价值链与 Beer Game 资料。证据支持分开存量和变化率、把经济写成来源/池/转换/消耗节点、补全转换与维护时序、记录容… |
| `translations/what-makes-a-rulebook-accessible-and-entertaining-zh-CN.md` line 285 | 单段 241 个汉字 | **[9.6]** 关于怎样制作既无障碍又有趣的规则书，仍有一些问题没有答案。我们还没有把技术写作的最佳实践整合到教学材料这个特定框架中；没有考察其他教学形式，例如“学习游玩”视频——这个主题本身就值得深入拆解；也没有提到当代桌游设计已经改… |
| `translations/what-makes-a-rulebook-accessible-and-entertaining-zh-CN.md` line 64 | 单段 223 个汉字；并列项较多（12） | **[1.1]** 玩桌游或角色扮演游戏时，玩家会体验到一种很特别的参与程度，而电子游戏无法产生完全相同的体验。主要原因在于，玩家必须亲自“启动”游戏里的各种组件（Sousa et al. 2022）。这种启动要求给玩家加上了某种期待，而它… |
| `design-library/action-selection/zh-CN.md` line 11 | 单句 106 个汉字 | ｜ 行动点预算 ｜ 剩余点数能否支付费用，其他条件是否满足 ｜ 剩余预算改变，某些动作可能付不起 ｜ ｜ 有限的公共行动池 ｜ 需要的行动机会是否还在 ｜ 取走的机会不再供其他人选择 ｜ ｜ 个人行动卡与收回 ｜ 卡是否可用，执行条件是否满… |
| `learning-units/systematic-unit-05-single-question-test-zh-CN.md` line 312 | 单段 228 个汉字；并列项较多（9） | ｜ 00:18，第一轮松鼠行动前 ｜ 松鼠看自己的木板，再看水獭面前的绳索；手指停在两张卡之间 ｜ “你的才是我过急流要的。” ｜ 无 ｜ 工具需求与归属在第一次行动前被看见 ｜ ｜ 00:31，第一轮讨论 ｜ 水獭指向水位轨；两人轮流指河… |
| `special-guides.json` $[14].evidenceBoundary | 单句 74 个汉字；单段 201 个汉字；并列项较多（20） | 本指南综合 Legacy 不可逆性理论、一项 Legacy 创作硕士研究、Pandemic Legacy 一手设计演讲与官方 FAQ、Charterstone 官方设计日志和 FAQ、SeaFall 长期测试者记录、两篇战役测试实践复盘、B… |
| `special-guides.json` $[7].evidenceBoundary | 单段 224 个汉字；并列项较多（10） | Values at Play 是数字教育游戏方法论和案例；主题/机制双向流程为设计师个人实践。殖民叙事研究包含三款游戏的文档比较、单一批评案例和基于 BGG 的 8786 款语料分析：能支持‘省略也是选择’，不能给单款游戏算伦理分。文化协作… |
| `special-guides.json` $[30].evidenceBoundary | 单段 208 个汉字；并列项较多（17） | 本指南把汉字桌游课程与桌游×社会科学课程作为本地教学案例，并与 Values at Play、Grow-A-Game、Design Justice、社会议题游戏设计、教育游戏评估、纸板算法素养、公民教育工作坊和欧式桌游抽象批评交叉核对。证据… |
| `special-guides.json` $[15].evidenceBoundary | 单句 77 个汉字；单段 201 个汉字；并列项较多（15） | 本指南综合两项单人玩家研究、一篇 Root 自动玩家研究型创作硕士论文、Automa Factory 官方六项原则、Mike Mullins 的单人变体方法、Imperium 与三个 Stonemaier 项目的一手日志、一个生产限制下的个… |
| `learning-units/learn-by-playing-one-moment-zh-CN.md` line 51 | 单句 102 个汉字 | ｜ 人 ｜ 谁正在做决定或回应 ｜ 玩家 A 正在选择一张骨牌，B、C、D 已经等待 ｜ ｜ 开始 ｜ 从哪个可见信号开始 ｜ 四张新骨牌翻开，轮到 A 选择 ｜ ｜ 结束 ｜ 到哪个可见结果停止 ｜ A 把国王放上选择的骨牌，下一位开始行… |
| `learning-units/systematic-unit-05-single-question-test-zh-CN.md` line 179 | 单句 103 个汉字 | ｜ 触发以前 ｜ 任一只动物被障碍挡住以前 ｜ ｜ 第一件可见事 ｜ 至少一人查看、拿起或指向同伴的工具 ｜ ｜ 第二件可见事 ｜ 两人用自己的话比较前进与交接 ｜ ｜ 可能的行动 ｜ 发起交接，或明确说出暂不交接的理由 ｜ ｜ 不预测什么… |
| `learning-units/systematic-unit-06-evidence-to-next-version-zh-CN.md` line 553 | 单句 102 个汉字 | > 如果玩家能正确指出双方工具归属与交接权限，却仍然到障碍前都不比较交接时机，那么“没有看见工具关系”作为主要原因会变弱，下一步应检查他们是否认为提前交换没有收益、机会代价怎样进入判断，以及到障碍前再换是否本来就是合理路径。 |

## 持续规则

- 内容文件增删或文字改变后，运行 `pnpm copy:audit` 更新本报告。
- `pnpm qa:copy-readability` 检查报告是否覆盖当前全部内容文件。
- 长句信号不直接阻止支持材料发布；主线节点使用更严格的独立发布门。
- 真人是否看得懂仍需参与者验证，机器审计不得替代真实阅读与操作观察。
