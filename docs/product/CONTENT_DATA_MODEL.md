# 内容与项目数据模型

状态：draft  
依据：第一轮网络研究、实践样本、Kathleen Mercury 教学研究、用户 PDF 笔记

## 目标

同一模型同时支持三件事：策展资源、发布原创指南、让用户记录自己的设计迭代。首版可用 Markdown/YAML 或 JSON 实现，不预设必须有数据库。

## 1. Resource（外部资源）

```yaml
id: resource-slug
title: string
url: https://...
creators: [name]
publisher: string|null
published_at: date|null
last_checked_at: date
language: [zh-CN, zh-TW, en]
format: article|book|paper|podcast|video|course|tool|community
evidence_type: academic|first_party_practice|teaching_curation|community|commercial
access: free|paid|freemium|library|restricted|dead
license: string|unknown
stages: [intent, system, prototype, playtest, rules, presentation, publishing]
topics: [string]
levels: [beginner, intermediate, advanced]
estimated_minutes: number|null
summary_zh: string
why_useful: string
limitations: [string]
commercial_relationship: none|self_promotion|affiliate|sponsored|unknown
status: discovered|read|verified|archived
```

必填最低集：title、url、creators、last_checked_at、format、evidence_type、access、stages、summary_zh、limitations、status。

## 2. Claim（可追溯主张）

```yaml
id: claim-slug
statement: string
kind: finding|author_opinion|community_pattern|project_inference
sources:
  - resource_id: resource-slug
    locator: "p. 3" # 或章节/时间戳
context: string
sample: "n=16"|null
confidence: low|medium|high
counterexamples: [string]
product_implications: [string]
```

所有面向用户的“应该”尽量关联 Claim；若只是本项目判断，标 `project_inference`。

## 3. Guide（原创指南）

```yaml
id: guide-slug
title: string
stage: string
problem: string
outcome: string
core_minutes: 5
concepts: [string]
common_mistakes: [string]
disagreements: [string]
exercise_ids: [string]
tool_ids: [string]
resource_ids: [string]
done_when: [string]
backtracks_to: [guide-slug]
next_options: [guide-slug]
status: draft|review|published
```

## 4. Exercise（练习）

```yaml
id: exercise-slug
title: string
mode: learn|project
minutes: 20
materials: [string]
prompt_steps: [string]
output_schema: object
example_output: object
reflection_questions: [string]
source_inspirations: [resource-slug]
license_notes: string
```

## 5. Project / Version / Hypothesis

```yaml
project:
  id: uuid
  title: string
  target_players: string
  experience_intent: string
  privacy: local

version:
  id: uuid
  project_id: uuid
  label: "0.3"
  created_at: datetime
  summary: string
  changes:
    - level: low|medium|high
      type: add|remove|modify
      description: string
      reason: string

hypothesis:
  id: uuid
  version_id: uuid
  statement: string
  observable_signals: [string]
  disconfirming_signals: [string]
  status: open|supported|not_supported|inconclusive
```

当前浏览器实现先落地单一活动项目：`tabletop-workshop-project-workspace-v1` 保存项目、当前版本/阶段/问题/下一步和版本节点。完整导出使用 `method: local-project-workspace-export`、`local_first: true` 与 `single_active_project: true`，并收集 19 类本地工具记录。旧记录尚无 `project_id`，不得自动猜归属；多项目迁移契约见 [本地项目护照与完整导出](PROJECT_WORKSPACE.md)。

## 6. Playtest / Observation / Feedback / Decision

```yaml
playtest:
  id: uuid
  version_id: uuid
  type: solo|quick|guided|extreme|blind
  medium: physical|online|hybrid
  medium_blind_spots: [string]
  primary_question: string # 每场只有一个主问题
  parking_lot: string|null # 其他好奇不与主问题混算
  predicted_behavior: string
  disconfirming_signal: string
  observation_event: string
  observation_fields: string
  repetition_target: string
  start_state: string
  stop_trigger: string
  invariant: string
  changed_axis: string
  player_context: string
  player_configuration: string
  facilitator_allowed: string
  facilitator_forbidden: string
  consent_notes: string|null
  safety_stop: string
  post_questions: [string]
  decision_rule: string
  started_at: datetime
  duration_minutes: number

observation:
  playtest_id: uuid
  timestamp_or_phase: string
  fact: string
  inferred_state: string|null
  related_hypothesis_ids: [uuid]

feedback:
  playtest_id: uuid
  category: experience|problem|question|idea
  words_or_summary: string
  direct_quote: boolean

decision:
  project_id: uuid
  after_playtest_ids: [uuid]
  action: add|remove|modify|keep|investigate|pause
  rationale: string
  rejected_alternatives: [string]
  next_hypothesis_ids: [uuid]
```

设计上必须保持 observation、feedback、inference、decision 分离。测试者的建议不会自动变成待办。

### 跨轮发现沿革（浏览器实现 schema v2）

```yaml
evidence_synthesis:
  id: uuid                    # 当前修订自己的 ID
  lineage_id: uuid            # 同一发现沿革
  revision: integer           # 沿革内递增，不表示正确性
  parent_record_id: uuid|null # 实际从哪份旧记录创建
  revision_reason: string     # 修订 2+ 必填
  selected_review_ids: [uuid]
  sources: [review_snapshot]
  relations: object           # 人工：支持/反驳/收窄/不可比/仅作背景
  current_statement: string
  applicability: string
  negative_case: string
  rival_explanation: string
  lifecycle: provisional|retain|narrow|split|contradicted|retire
  rationale: string
  project_next_action: string
  created_at: datetime
  completed_at: datetime|null
```

已完成记录不可原地覆盖。历史只读重开，变化创建新 ID 的后继；“最新”只表示顺序。会话撤回在本站本地存储中沿来源与 `parent_record_id` 清除后继，不能保证外部导出副本同步删除。详细契约见 [发现演化与版本证据](CROSS_SESSION_FINDING_EVOLUTION_CONTRACT.md)。

## 7. Accessibility Observation

```yaml
accessibility_observation:
  playtest_id: uuid
  schema_version: 2
  version: string
  medium: physical|online|hybrid
  task: string
  observed_action: string
  dimension: visual|color|motor|cognitive|memory|communication|emotional|social|economic
  barrier: string
  affected_component_function: public_state|private_state|randomizer|counter|spatial_relation|other
  player_strategy_or_assistive_technology: string|null
  assistance_needed: string|null
  assistance_tradeoff: string|null
  player_voice: string|null
  proposed_experiment: string
  same_task_success_signal: string
```

不设置总分。公开指南不得从医学诊断推断个体能力；描述具体任务和测试语境。

## 8. Balance Pass

```yaml
balance_pass:
  schema_version: 1
  version: string
  concern: dominant_option|seat_advantage|runaway_leader|overpowered_catchup|randomness_dominates|economy_stall_or_explosion|pacing|asymmetry
  target_experience: string
  question: string
  system_relation: string
  baseline: string
  model_boundary: string
  evidence_plan: string # 最多三项会改变决定的记录
  test_context: string # 人数/座位、玩家经验、媒介、方式、样本量
  disconfirming_signal: string
  next_single_change: string
```

导出必须带 `method: single-risk-balance-pass` 与 `no_aggregate_score: true`。不提供统一胜率、样本量或“已平衡”字段；一次记录只处理一种失效风险。

## 9. Decision Trace

```yaml
decision_trace:
  schema_version: 1
  version: string
  player_context: string
  moment: string
  current_goal: string
  legal_options: string
  considered_options: string
  collapse_reason: obviously_worse|same_consequence|unclear_information|unaffordable_or_unreachable|excessive_burden|blocked_by_other_player|not_considered|other
  information_state: string
  opportunity_cost: string
  interaction_path: string|null
  prediction: string
  actual_action: string
  actual_consequence: string
  feedback_visibility: immediate|later_this_round|later_round|end_game|unclear
  model_update: string
  next_single_change: string
```

导出必须带 `method: single-decision-trace` 与 `no_aggregate_score: true`。合法选项与实际考虑选项必须分开；互动路径可留空。一次记录不生成决定质量、策略深度、互动强度、玩家能力或可重玩性分数。

## 10. Teaching Path

```yaml
teaching_path:
  schema_version: 1
  version: string
  task_type: setup|first_decision|full_turn|lookup|teach_back|resume_after_interruption
  learner_context: string
  primary_surface: oral|rulebook|player_aid|component_or_table|interactive_tutorial|video|mixed
  target_action: string
  know_now: string
  defer_until_later: string|null
  delivery_path: string
  resettable_practice: string
  recovery_path: string
  success_signal: string
  first_divergence: string
  lookup_trace: string|null
  facilitator_intervention: string|null
  next_single_change: string
```

导出必须带 `method: single-learning-task-path` 与 `no_aggregate_score: true`。任务完成只表示当前版本、玩家语境、媒介与帮助条件下的一次行动证据；不生成玩家理解分、规则质量分或媒介排名。

## 11. Theme Commitment and Harm Review

```yaml
theme_review:
  schema_version: 1
  version: string
  audience_context: string
  theme_promise: string
  player_position: string
  repeated_actions: string
  rewards_and_consequences: string
  automated_or_absent: string
  sources_and_uncertainty: string
  interpretation_and_invention: string
  represented_people_and_team_position: string
  collaboration_stage: not_applicable|not_started|early_codesign|ongoing_review|late_review|other
  collaboration_plan: string
  exposure_mode: read_or_view|manage_abstraction|choose_and_execute|embody|act_on_other_players|may_name_lived_experience|other
  exposure_content: string
  content_note: string
  choice_exit_repair: string
  first_mismatch: string
  next_single_action: string
```

导出必须带 `method: theme-commitment-and-harm-review`、`no_aggregate_score: true` 与 `no_safety_certification: true`。记录作品、受众语境和参与程序，不收集真实姓名、玩家创伤史或要求退出理由。不生成伦理、真实、安全或社群认可分数。

## 12. Production Assumption Ledger

```yaml
production_ledger:
  schema_version: 1
  version: string
  delivery_route: publisher_pitch|print_and_play|small_batch_or_pod|self_publish_bulk|crowdfunding|other
  current_decision: string
  region_and_quantity_scenario: string
  components:
    - name: string
      quantity_per_copy: string
      specification: string
      player_or_system_function: string
      alternative_and_same_task_retest: string
      evidence_state: unknown|designer_estimate|catalog_or_calculator|written_quote|sample_invoice_or_measurement
  currency_and_amount_or_range: string
  cost_scope: factory|landed_to_warehouse|full_project|unknown
  cost_evidence_state: unknown|designer_estimate|catalog_or_calculator|written_quote|sample_invoice_or_measurement
  cost_source_date_and_version: string
  included: string
  excluded_or_unknown: string
  packout_and_player_task: string
  packed_dimensions_weight_and_sleeves: string
  validation_gate: early_spec|prepress|component_sample|ppc|mpc|receiving_inspection
  validation_task: string
  expected_result: string
  actual_result_or_not_run: string
  approver_and_uncovered_risk: string
  accessibility_and_table_retest: string
  material_weight_durability_environment_assumption: string
  biggest_unknown: string
  next_single_evidence_upgrade: string
```

导出必须带 `method: production-assumption-ledger`、`no_price_prediction: true`、`not_a_manufacturing_quote: true` 与 `not_compliance_advice: true`。组件规格先保存玩家/系统功能；成本数字必须带版本、数量、币种、日期、范围和包含/排除项。工具不相加不同范围的数字，不生成利润、供应商、合规或可持续评分。

## 13. Publishing Route Responsibility Map

```yaml
publishing_route_map:
  schema_version: 1
  version: string
  route: publisher_or_license|print_and_play|pod_or_platform_store|inventory_self_publish|crowdfund_then_produce|competition_or_showcase|hybrid
  receiver_action: string
  route_reason: string
  non_negotiable: string
  current_public_offer_or_commitment: string
  rights_state: string
  money_and_inventory_exposure: string
  current_requirements_with_source_and_date: string
  gate: clarify_goal|verify_submission|request_sample|review_agreement|validate_demand|freeze_precampaign_budget|verify_fulfillment|blind_test_release_entry
  gate_question: string
  next_single_evidence: string
  exit_or_reroute_condition: string
  responsibilities:
    - area: string
      scope: string
      owner: self|co_creator|publisher|platform|vendor|manufacturer|fulfillment_or_warehouse|professional_adviser|undecided
      evidence: unverified|current_official_requirement|written_communication|contract_or_terms|completed_test
      source_date_and_version: string
      uncovered_work_or_risk: string
```

固定覆盖设计开发、产品化、权利合同、生产质检、受众销售、预算协调、履约客服、版本更新八类责任。导出必须带 `method: publishing-route-responsibility-map`、`no_route_ranking: true`、`not_legal_or_financial_advice: true` 与 `platform_rules_require_recheck: true`。工具显示未定责任人和未核验证据，不生成路线分数、签约概率、销量、利润或交付预测。

## 14. 最小技术策略

- 资源与指南：仓库内版本控制的 YAML/Markdown；构建时校验字段和内部链接。
- 用户项目：首版 local-first，浏览器 IndexedDB + JSON/Markdown 导出，不强制账号。
- 引用：页面显示来源链接、定位、证据类型、最后核验日期。
- 失效链接：定期 HTTP 检查只标记状态，不自动删除历史来源。
- 迁移：每份导出带 `schema_version`，避免后续字段变化破坏旧项目。

## 15. GlossaryTerm（规范概念词条）

```yaml
id: concept-slug
term: string
aliases: [string]
definition: string
not_this: string
example: string
stages: [string]
guide_ids: [guide-slug]
related_ids: [concept-slug]
source_ids: [resource-slug]
claim_ids: [claim-slug]
status: draft|review|stable
```

一个概念只维护一个规范词条；指南存 `concept_ids`，不复制定义。`not_this` 是必填边界，避免相邻概念和常见误用被混在一起。

## 16. ResourceAssessment（资源阅读说明）

```yaml
resource_id: resource-slug
use_modes: [learn, diagnose, compare, lookup, case_study]
audience_levels: [beginner, intermediate, advanced]
review_depth: full_text|article_level|metadata_only
context_clarity: explicit|partial|weak
actionability: exercise|procedure|diagnostic|example|directory
transferability: broad|conditional|narrow
currency_risk: low|medium|high
rights_status: reusable_license_verified|link_and_summarize|restricted
commercial_context: none_disclosed|creator_or_product_context|unknown
best_for: string
do_not_use_for: string
reviewed_at: date
status: reviewed
```

评价不设置分数、星级或加权总分。不同维度回答“怎么读、何时用、不能推出什么”，不能压成单一排名。

## 16.1 ResourceLearningContent（核心学习内容与权利契约）

```yaml
resourceId: resource-slug
contentMode: original_complete|original_case_synthesis|authorized_full_translation|authorized_zh_republication|internal_full_translation|guide_only
sourceUrl: https-url
sourceReferences: [https-url]
sourceLanguage: string
translatorNote: string
license:
  kind: site_owned|open_license|written_permission|none_verified|unresolved
  name: string|null
  version: string|null
  evidenceUrl: https-url|null
  evidenceCapturedAt: date|null
  permissionEvidenceId: string|null
rightsStatus: site_owned_original|reusable_license_verified|link_and_summarize|restricted
completeness: complete|partial|guide_only|empty
publicationScope: public|internal
body: string|null
bodyFile: content/**/*.md|null
translationAuthority: codex_ai_complete|human_translator|mixed_team|null
humanTranslatorClaimed: boolean|null
humanReviewStatus: not_required|pending|changes-requested|approved|null
internalLearningStatus: not_ready|supplementary|authoritative
publicationStatus: draft|internal-ready|public-candidate|published|withdrawn
legalReviewStatus: not_reviewed|reviewed
legalApprovalClaimed: boolean
metadataFile: content/**/*.metadata.json|null
```

`contentMode` 说明站内实际有什么，`rightsStatus` 和 `license` 说明来源可以怎样复用，`completeness` 说明覆盖程度，`publicationScope` 单独控制发布面。这四件事不能相互推导。

`internal_full_translation` 不得使用 `public`，也不得进入权威学习白名单；任何完整内容模式都必须有 `complete` 和可读取的非空 `body` 或 `bodyFile`。`authorized_full_translation` 与 `authorized_zh_republication` 还必须有开放许可或书面授权证据。`codex_ai_complete` 使用 `humanReviewStatus: not_required`，且不得声称人工译者或法律审定。`original_complete` 和 `original_case_synthesis` 使用 `site_owned` / `site_owned_original`，但这不改变其外部参考来源的权利状态。当前 18 份资源级基线全部为 `guide_only`；另有 8 份权威内容项：2 份 CC BY `authorized_full_translation`、3 份 `original_complete` 和 3 份 `original_case_synthesis`，全部为 `internal-ready` / `authoritative` 内部学习主版。详见[核心学习内容与权利数据契约](RESOURCE_LEARNING_CONTENT_CONTRACT_01.md)。

## 17. ContributionPackage（离线贡献包）

```yaml
contribution_package:
  schema_version: 1
  method: tabletop-resource-contribution-package
  local_first: true
  public_submission_enabled: false
  package:
    id: string
    status: draft|participation_confirmed|under_review|publication_candidate|published|withdrawn
    contribution_type: player_experience|design_log|course_reflection|resource_correction|accessibility_task_record|production_case
    scope: object
  contributor:
    identity_mode: anonymous|pseudonym|named|collective
    roles: [string]
    contact_mapping_held_separately: boolean
  consent:
    participation_choice: not_decided|declined|agreed
    storage_choice: not_decided|session_only|until_review_complete|until_date
    publication_mode: review_only|link_and_summary|approved_excerpt|cc_by_4_0
    quote_choice: no_quotes|anonymous_approved_quotes_only|attributed_approved_quotes_only
    media_choice: none|approved_still_images_only|approved_audio_only|approved_video_only
  rights: object
  privacy: object
  safeguarding: object
  content: object
  review: object
  publication: object
  withdrawal: object
```

参与、保存、引用/公开和公共许可必须分开；默认 `review_only`、`no_quotes`、`none`，不预选 CC。联系人映射、原始同意证据和原始媒体不进入可分享贡献包。发布候选必须有最终公开副本、贡献者针对该副本的批准、范围边界、权利复核和可执行撤回映射；涉及儿童或额外保护需要时，普通模板不得绕过专业安全保障审查。详见[玩家经验与设计案例贡献包](CONTRIBUTION_PACKAGE.md)。

## 18. Content Version Governance（内容版本治理）

```yaml
content_version_governance:
  schema_version: 1
  stable_id: string
  project_name: string
  current_version: string
  component_name: string
  printed_text: string
  current_text: string
  rarity_facts:
    acquisition: string
    as_played_frequency: string
    complexity: string
    system_role: string
    format_risk: string
  configurations:
    - base_edition: string
      expansion: string
      mode: string
      language_or_rules_source: string
      evidence_state: validated|declared_support|unknown|replacement_required
      evidence: string
  authority_sources:
    - title: string
      status: current|supplemental|historical
      date: date|null
      locator: string
  breaking_point: string
  next_verification: string
  evidence_boundary: string
  governance:
    change_type: string
    change_summary: string
    announcement_date: date|null
    effective_date: date|null
    review_date: date|null
    rollback_gate: string
  regression_and_migration: object
```

浏览器键为 `tabletop-workshop-version-governance-v1`，同时保存当前草稿和带 UUID/时间的记录快照。独立导出必须带 `method: content-version-governance-workbench`、`local_first: true`、`no_compatibility_certification: true` 与 `no_rarity_recommendation: true`。同一草稿最多一项事实源为 `current`；兼容证据只约束该行完整配置，不能外推为全部扩展兼容。

## 19. LocalMaterialPublicationReadiness（本地资料发布就绪）

```yaml
local_material_publication_readiness:
  schema_version: 1
  policy:
    default_decision: internal_reference_only
    derived_use: original_summary_only
    source_file_direct_publication_allowed: false
    scores_or_automatic_clearance: false
  required_gates:
    - authorship
    - coCreatorRights
    - institutionalOrCommissioningRights
    - thirdPartyText
    - thirdPartyMedia
    - personalInformation
    - minorSafeguarding
    - publicationCopy
    - attribution
    - licenseOrPermission
    - withdrawalOwner
  profiles: [object]
  materials: [collection-id/relative-path]
  overrides: [object]
  evidence_register: [object]
  publication_candidates: [object]
```

`materials` 与本地清单严格一一对应；资料群 profile 只提供保守默认值，单文件差异必须显式覆盖。源文件、文件元数据和持有事实都不能成为公开许可。任何候选必须冻结独立公开副本，给 11 道门分别记录证据定位、审阅角色和撤回负责人。状态不计算总分，机器字段完整也不等于法律、隐私、机构或未成年人保护批准。详见[本地课程内容发布门禁](LOCAL_CONTENT_PUBLICATION_GATE.md)。

## 20. ExperienceIntentCard（体验意图卡）

```yaml
experience_intent_card:
  schema_version: 1
  method: experience-intent-card
  local_first: true
  no_fun_score: true
  no_player_profile_inference: true
  no_mechanic_recommendation: true
  draft:
    project_name: string
    version: string
    starting_point: string
    player_context: string
    repeated_decision: string
    decision_consequence: string
    pressure: string
    visible_feedback: string
    predicted_behavior: string
    disconfirming_signal: string
    non_goal: string
    test_question: string
  current_hypothesis: string
  saved_records: [object]
  evidence_boundary: string
  exported_at: datetime
```

浏览器键为 `tabletop-workshop-experience-intent-v1`。只有玩家语境、重复决定、压力、可见反馈和行为预测齐全才编译摘要；12 个字段齐全才保存带 UUID/时间的快照。清空只清草稿且必须二次确认，不删除历史记录。项目包以 `experience_intent_records` 收集记录，但不得把记录数解释成进度或质量。详见[体验意图卡产品规格](EXPERIENCE_INTENT_CARD.md)。

## 21. CoreLoopCanvas（核心循环画布）

```yaml
core_loop_canvas:
  schema_version: 1
  method: core-loop-canvas
  local_first: true
  no_loop_quality_score: true
  no_optimal_mechanic_recommendation: true
  no_player_experience_claim: true
  no_silent_intent_inference: true
  source_intent_id: string|null
  source_intent_created_at: datetime|null
  current_information: string
  viable_options: string
  cost: string
  commitment: string
  state_change: string
  feedback_to_next_input: string
  next_input: string
  next_decision: string
  exit_condition: string
  prototype_question: string
  saved_records: [object]
```

浏览器键为 `tabletop-workshop-core-loop-v1`。来源只在用户点击时导入，复制体验意图原字段，不自动选择机制；完整字段可继续到原型范围，后者也必须显式导入。项目包以 `core_loop_records` 收集记录。详见[核心循环画布产品规格](CORE_LOOP_CANVAS.md)。

## 22. SingleQuestionTestPlan（单问题测试计划）

```yaml
single_question_test_plan:
  schema_version: 2
  method: single-question-playtest-plan
  local_first: true
  no_fun_score: true
  no_sample_representativeness_claim: true
  no_causal_proof: true
  no_release_readiness_claim: true
  no_silent_scope_inference: true
  source_scope_id: string|null
  source_scope_created_at: datetime|null
  primary_question: string
  predicted_behavior: string
  disconfirming_signal: string
  observation_event: string
  observation_fields: string
  repetition_target: string
  start_state: string
  stop_trigger: string
  invariant: string
  changed_axis: string
  participant_profile: string
  player_configuration: string
  test_type: solo|quick|guided|extreme|blind
  medium: physical|online|hybrid
  facilitator_allowed: string
  facilitator_forbidden: string
  capture_and_consent: string
  safety_stop: string
  post_questions: [string]
  decision_rule: string
  parking_lot: string|null
  saved_records: [object]
```

草稿键为 `tabletop-workshop-single-question-test-plan-draft-v1`，历史继续使用 `tabletop-workshop-project-v1` 并进入项目包既有 `test_plans` 类别。原型范围来源只在用户点击时导入，不推断参与者、主持、记录或结论。详见[单问题测试计划产品规格](SINGLE_QUESTION_TEST_PLAN.md)。

## 23. PlaytestSession（现场测试会话）

```yaml
playtest_session:
  id: uuid
  source_plan_id: uuid
  source_plan_created_at: datetime
  plan_snapshot: object
  state: not_started|live|paused|stopped|completed
  participant_aliases: string
  actual_configuration: string
  actual_medium: string
  observer_roles: string
  capture_mode: text|audio|video|photo|mixed
  consent_scope: string
  consent_confirmed: boolean
  events:
    - elapsed_seconds: integer
      phase: string
      actor_alias: string
      type: behavior|question|quote|system|intervention|barrier|stop
      observation: string
      visible_state: string
      resolution: string
      relation: support|disconfirm|inconclusive|context
      intervention_impact: string|null
      revised_at: datetime|null
  actual_stop_reason: string
  unplanned_deviation: string
  debrief_answers: [object]
  consent_reminder_confirmed: boolean
  outcome: support|disconfirm|inconclusive
  strongest_observation: string
  alternative_explanation: string
  keep_same: string
  changed_axis: string
  next_question: string
```

浏览器键为 `tabletop-workshop-playtest-sessions-v1`，数据形态为 `{ schemaVersion: 1, draft, records }`，项目包进入 `playtest_sessions`。会话嵌入来源计划快照但不回写；事件数量不生成严重度，勾选不构成法律认证。详见[现场测试记录器产品规格](LIVE_PLAYTEST_SESSION_RECORDER.md)。

## 24. EvidenceReview（证据复盘与变更简报）

浏览器键沿用 `tabletop-workshop-feedback-v1`，但数据升级为 `{ schemaVersion: 2, draft, records }`。记录保存来源会话/计划/版本/问题/语境、原始证据池与人工选择、发现陈述/适用条件/反证/缺失、五态处理决定，以及候选方案/保持项/拒绝方案/目标版本/单一变化轴/具体改动/回退信号/下一问题。

旧版数组通过 `schemaMigratedFrom: 1` 保守迁移：保留旧原话和摘要，同时明确标记缺少来源、版本、条件和反证。工具不自动选择、聚类、评分、归因或写回项目；保存完整记录后，用户必须另行显式复制为项目下一步。来源会话撤回按 `sourceSessionId` 清除本站本地派生记录。详见[证据复盘与变更简报产品契约](EVIDENCE_REVIEW_CHANGE_BRIEF.md)。

## 25. EvidenceSynthesis（跨轮发现沿革）

浏览器键为 `tabletop-workshop-evidence-syntheses-v1`，内部结构升级为 `{ schemaVersion: 2, draft, records }`。完成记录不可原地覆盖；历史只读重开，变化创建带新 `id`、相同 `lineageId`、递增 `revision`、直接 `parentRecordId`、必填 `revisionReason` 和新时间的后继。v1 记录保守迁移为各自独立的修订 1，不猜测父子关系。

来源会话撤回时，本站先清除直接引用记录，再沿 `parentRecordId` 清除所有后继与未完成后继草稿。项目下一步只能从只读打开的已保存记录显式复制；“最新”只表示顺序。详见[发现演化与版本证据产品契约](CROSS_SESSION_FINDING_EVOLUTION_CONTRACT.md)。

## 26. 当前机器可读实现

- `content/resources.json`：574 条逐条审阅资源，直接驱动网站资源库。
- `content/resource-index.json`：由权威资源表生成的 574 条轻量来源引用，只含 `id`、`title`、`href`，供首屏指南、框架和词表链接使用。
- `content/claims.json`：322 条带来源、置信度和反例的综合主张。
- `content/frameworks.json`：5 张带适用范围和证据边界的理论框架卡。
- `content/guides.json`：6 篇 Phase 1 核心指南，覆盖全部设计阶段并连接步骤、误区、练习、资源、Claim、路径关系与配套工具。
- `content/special-guides.json`：31 篇机器可读专题指南，在网站方法页提供完整步骤、误区、练习、证据边界与工具回链。
- `content/design-constraints.json`：22 张原创观察对象、变换动作与验证边界牌；所有牌面连接规范概念，不包含商业卡组正文。
- `content/glossary.json`：287 个规范词条，连接阶段、指南、相关概念、资源与 Claim。
- `content/glossary-index.json`：由完整词表生成的 287 条轻量概念引用，只含 `id` 与 `term`，供首屏核心指南显示概念名称。
- `content/resource-assessments.json`：574 份逐资源审阅记录。
- `content/resource-entry-points.json`：34 条任务型策展阅读入口；每条连接稳定资源 ID 并保存问题、产出和证据边界。
- `content/resource-learning-paths.json`：六个设计阶段的三份资料起步路线，引用 18 份不重复核心资料。
- `content/resource-learning-content.json`：18 份核心资料的资源级基线和文章级 `authoritativeItems`，保存内容模式、来源、语言、译者说明、许可、权利状态、完整度、发布范围、复核状态和正文引用。
- `docs/local-materials/manifest.json`：57 份本地资料的相对路径、元数据、哈希与公开边界；不复制原件或正文。
- `docs/local-materials/publication-readiness.json`：57 份资料一一覆盖、四组保守 profile、11 道证据门与 0 个当前发布候选；不含绝对路径或原文。
- `content/resource-evaluation-rubric.json`：九个评价维度的机器可读标签和选项。
- `docs/product/contribution-package-schema.json`：离线贡献包允许值、发布门与默认拒绝规则；不是法律或伦理审查。
- `docs/product/contribution-package-template.json`：默认私有、未同意、未选择公共许可的空白贡献包。
- `docs/product/contribution-protocol-session-template.json`：走读参与/保存/公开/许可、署名和撤回边界的形成性测试记录。
- `docs/product/design-aid-loop-session-schema.json`：设计辅助闭环 T1–T6 会话字段与禁止额外字段的 JSON Schema 边界。
- `docs/product/design-aid-loop-session-template.json`：默认未同意、无身份、无录音、仅本地的安全空白会话。
- `docs/product/design-aid-loop-session-example.json`：虚构完成示例，演示严重问题怎样触发修订和复测；不是实际参与者资料。
- `scripts/validate-design-aid-loop-session.mjs`：验证 T1–T6 覆盖、证据状态、私有反思排除、严重问题复测和 12 个拒绝分支。
- `scripts/validate-contribution-package.mjs`：验证安全默认值、一个完整候选和 11 个必须拒绝的发布分支。
- `scripts/check-local-publication-readiness.mjs`：验证逐文件覆盖、资料群门禁、禁入字段、完整候选结构与拒绝分支；不能作法律批准。
- `src/version-governance-workbench.tsx`：第 13 项正式工具的五步本地交互、版本化存储与治理包导出。
- `src/prototype-scope-cutter.tsx`：第 14 项正式工具的问题、过滤、三维保真、切片与开工门本地交互。
- `src/issue-to-system-workbench.tsx`：第 15 项正式工具的系统主张、六字段、遗漏账本、重复决策与三层验证本地交互。
- `src/experience-intent-card.tsx`：第 16 项正式工具的玩家语境、重复决定、压力/反馈、预测/反例与本轮边界本地交互。
- `src/core-loop-canvas.tsx`：第 17 项正式工具的显式来源承接、输入/选择、代价/承诺、状态/反馈、重复/出口与原型交接。
- `src/single-question-test-plan.tsx`：把原型范围显式承接为唯一主问题、观察协议、参与/主持边界与结论规则的测试计划 v2。
- `src/playtest-session-recorder.tsx`：第 18 项正式工具的计划快照、开场同意、现场计时/事件、局后回答、撤回与下一版决定。
- `src/evidence-review-workbench.tsx`：升级既有反馈工具，显式承接完成会话、人工选择证据、形成有边界发现与版本变更简报。
- `src/evidence-synthesis-workbench.tsx`：第 19 项正式工具，显式选择至少两份复盘、建立可比边界、逐份判断关系，保存不可覆盖发现沿革，并以只读历史与显式后继表达变化。
- `scripts/check-version-governance-workbench.mjs`：验证工具 ID、指南直达、五步、证据状态、本地保存、导出边界、移动端与按需加载契约的 16 项守卫。
- `scripts/check-experience-intent-card.mjs`：验证稳定 ID、指南直达、五步字段、本地保存、拒绝声明、项目汇总、响应式与按需加载契约的 20 项守卫。
- `scripts/check-core-loop-canvas.mjs`：验证五步、两次显式交接、拒绝静默推断、项目汇总、响应式与按需加载契约。
- `scripts/check-single-question-test-plan.mjs`：验证四步、单问题证据链、显式范围导入、主持/安全、拒绝声明、项目汇总与响应式契约。
- `docs/product/BEGINNER_USABILITY_CAMPAIGN.md`：把资源发现、意图→循环→范围→计划→现场记录和项目导出收束为两轮中文新手形成性战役。
- `docs/product/beginner-usability-campaign-template.json`：固定 Round A 2–3 人、Round B 5–7 人与章程 5 人定位/4 人完整闭环门。
- `docs/product/beginner-usability-session-template.json`、`beginner-usability-session-example.json` 与 `beginner-usability-session-schema.json`：安全空白会话、不可计数虚构示例和 schema v1。
- `scripts/validate-beginner-usability-campaign.mjs`：拒绝身份/录音/总分/伪外部证据，验证四任务、单变量修订与参与者会话形成门；没有真实输入时不声明章程通过。
- `scripts/check-live-playtest-session.mjs`：验证 42 条现场会话、计划快照、计时、事件语境、同意/撤回、复盘边界、项目汇总与响应式契约。
- `scripts/check-evidence-review-workbench.mjs`：验证 48 条迁移、来源、证据、发现、决定、撤回级联、项目写回、响应式与概念图契约。
- `scripts/check-resource-links.mjs`：生成全资源网络健康快照；区分可达、被拦截、明确失效与网络错误，不自动删除来源。
- `scripts/check-resource-learning-content.mjs`：校验 18 份核心记录、显式白名单权威内容、元数据与资源外键，并拒绝自动收录未授权外部全文译文、公开内部译文、空正文完整译文、Codex AI 译文冒充人工翻译或契约冒充法律审定。
- `scripts/generate-resource-index.mjs`：重建轻量来源索引；生成物由内容校验逐条比对，不能成为第二套手工资源表。
- `scripts/generate-glossary-index.mjs`：重建轻量概念索引；完整定义、别名和关系仍只维护在 `glossary.json`。
- `scripts/validate-content.mjs` 与贡献包守卫：在生产构建前验证必填字段、唯一 ID、阶段值、HTTPS 链接、跨内容外键、每资源唯一审阅记录、健康快照完整性、禁用总分、本地资料隐私边界、测试模板和贡献协议安全默认值。

当前 JSON 采用上面模型的 TypeScript 友好命名；后续迁移到数据库或静态内容系统时需要保留稳定 `id`，不根据标题重新生成。
