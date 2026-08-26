import fs from 'node:fs'

const readJson = path => JSON.parse(fs.readFileSync(new URL(path, import.meta.url), 'utf8'))
const repositoryRoot = new URL('../', import.meta.url)
const readRepositoryText = path => fs.readFileSync(new URL(path, repositoryRoot), 'utf8')

const contract = readJson('../content/resource-learning-content.json')
const learningPaths = readJson('../content/resource-learning-paths.json')
const resources = readJson('../content/resources.json')
const assessments = readJson('../content/resource-assessments.json')
const packageJson = readJson('../package.json')
const quidCaseMetadata = readJson('../content/guides/quid-for-your-quo-case-synthesis-zh-CN-internal.metadata.json')
const unit03Metadata = readJson('../content/learning-units/systematic-unit-03-mechanisms-information-interaction-zh-CN.metadata.json')
const unit04Metadata = readJson('../content/learning-units/systematic-unit-04-minimum-prototype-zh-CN.metadata.json')
const unit05Metadata = readJson('../content/learning-units/systematic-unit-05-single-question-test-zh-CN.metadata.json')
const unit06Metadata = readJson('../content/learning-units/systematic-unit-06-evidence-to-next-version-zh-CN.metadata.json')
const learnByPlayingMetadata = readJson('../content/learning-units/learn-by-playing-one-moment-zh-CN.metadata.json')
const paulGroganCaseMetadata = readJson('../content/guides/paul-grogan-rulebook-layout-case-synthesis-zh-CN-internal.metadata.json')
const newBedfordCaseMetadata = readJson('../content/guides/new-bedford-manufacturing-constraint-case-synthesis-zh-CN-internal.metadata.json')
const rulebookAccessibilityMetadata = readJson('../content/translations/what-makes-a-rulebook-accessible-and-entertaining-zh-CN.metadata.json')
const rulebookAccessibilityBody = readRepositoryText('content/translations/what-makes-a-rulebook-accessible-and-entertaining-zh-CN.md')
const rulebookAccessibilityAudit = readRepositoryText('docs/research/RULEBOOK_ACCESSIBILITY_TRANSLATION_AUDIT_2026-08-22.md')
const unit05Body = readRepositoryText('content/learning-units/systematic-unit-05-single-question-test-zh-CN.md')
const unit06Body = readRepositoryText('content/learning-units/systematic-unit-06-evidence-to-next-version-zh-CN.md')
const learnByPlayingBody = readRepositoryText('content/learning-units/learn-by-playing-one-moment-zh-CN.md')
const unit05Audit = readRepositoryText('docs/research/SYSTEMATIC_UNIT_05_SOURCE_AUDIT_2026-08-22.md')
const unit06Audit = readRepositoryText('docs/research/SYSTEMATIC_UNIT_06_SOURCE_AUDIT_2026-08-22.md')
const learnByPlayingAudit = readRepositoryText('docs/research/LEARN_BY_PLAYING_ONE_MOMENT_SOURCE_AUDIT_2026-08-22.md')

const contentModes = [
  'original_complete',
  'original_case_synthesis',
  'authorized_full_translation',
  'authorized_zh_republication',
  'internal_full_translation',
  'guide_only',
]
const completeModes = new Set([
  'original_complete',
  'original_case_synthesis',
  'authorized_full_translation',
  'authorized_zh_republication',
  'internal_full_translation',
])
const fullTranslationModes = new Set([
  'authorized_full_translation',
  'internal_full_translation',
])
const originalContentModes = new Set([
  'original_complete',
  'original_case_synthesis',
])
const authoritativeContentModes = [
  'original_complete',
  'original_case_synthesis',
  'authorized_full_translation',
]
const completenessValues = new Set(['complete', 'partial', 'guide_only', 'empty'])
const publicationScopes = new Set(['public', 'internal'])
const publicationStatuses = ['draft', 'internal-ready', 'public-candidate', 'published', 'withdrawn']
const humanReviewStatuses = ['not_required', 'pending', 'changes-requested', 'approved']
const translationAuthorities = ['codex_ai_complete', 'human_translator', 'mixed_team']
const internalLearningStatuses = ['not_ready', 'supplementary', 'authoritative']
const legalReviewStatuses = ['not_reviewed', 'reviewed']
const rightsStatuses = new Set([
  'site_owned_original',
  'reusable_license_verified',
  'link_and_summarize',
  'restricted',
])
const licenseKinds = new Set([
  'site_owned',
  'open_license',
  'written_permission',
  'none_verified',
  'unresolved',
])

const nonEmpty = value => typeof value === 'string' && value.trim().length > 0
const nullableString = value => value === null || nonEmpty(value)
const isHttps = value => nonEmpty(value) && value.startsWith('https://')
const isDate = value => nonEmpty(value) && /^\d{4}-\d{2}-\d{2}$/.test(value)
const sameMembers = (left, right) =>
  left.length === right.length && [...left].sort().every((value, index) => value === [...right].sort()[index])
const requiredCaseDimensions = ['语境', '问题', '选项', '决定', '证据', '结果', '仍未知', '迁移动作']
const rulebookAccessibilityParagraphIds = [...rulebookAccessibilityBody.matchAll(/^\*\*\[([0-9]+\.[0-9]+)\]/gm)].map(match => match[1])
const rulebookAccessibilityReferenceSection = (rulebookAccessibilityBody.split('## 参考文献')[1] ?? '').split('## 游戏作品目录')[0]
const rulebookAccessibilityLudographySection = rulebookAccessibilityBody.split('## 游戏作品目录')[1] ?? ''
const rulebookAccessibilityBodyCounts = {
  han: (rulebookAccessibilityBody.match(/[\u4E00-\u9FFF]/g) ?? []).length,
  numberedParagraphs: rulebookAccessibilityParagraphIds.length,
  uniqueNumberedParagraphs: new Set(rulebookAccessibilityParagraphIds).size,
  tables: (rulebookAccessibilityBody.match(/^\|(?:\s*:?-+:?\s*\|)+$/gm) ?? []).length,
  textAlternatives: (rulebookAccessibilityBody.match(/^> \*\*图 [123]（中文文字替代，不加载原(?:图|照片)）：\*\*/gm) ?? []).length,
  references: (rulebookAccessibilityReferenceSection.match(/^\d+\.\s/gm) ?? []).length,
  ludography: (rulebookAccessibilityLudographySection.match(/^\d+\.\s/gm) ?? []).length,
}

const isInternalAuthoritativeOriginal = (item, expected) =>
  item?.resourceId === expected.resourceId &&
  item?.contentMode === expected.contentMode &&
  item?.sourceUrl === expected.sourceUrl &&
  item?.bodyFile === expected.bodyFile &&
  item?.metadataFile === expected.metadataFile &&
  item?.license?.kind === 'site_owned' &&
  item?.rightsStatus === 'site_owned_original' &&
  item?.completeness === 'complete' &&
  item?.publicationScope === 'internal' &&
  item?.publicationStatus === 'internal-ready' &&
  item?.internalLearningStatus === 'authoritative' &&
  item?.legalReviewStatus === 'not_reviewed' &&
  item?.legalApprovalClaimed === false &&
  Array.isArray(item?.sourceReferences) &&
  item.sourceReferences.every(isHttps)

const hasUnitMetadataBoundary = (metadata, expected) =>
  metadata?.schemaVersion === 1 &&
  metadata?.itemId === expected.itemId &&
  metadata?.contentMode === 'original_complete' &&
  metadata?.language === 'zh-CN' &&
  metadata?.authorship?.humanReviewRequired === false &&
  metadata?.publication?.visibility === 'internal' &&
  metadata?.publication?.status === 'published-internal' &&
  metadata?.file === expected.bodyFile &&
  metadata?.updatedAt === '2026-08-22' &&
  Array.isArray(metadata?.sourceIds) &&
  metadata.sourceIds.length > 0 &&
  Array.isArray(metadata?.sourceUrls) &&
  metadata.sourceUrls.length >= metadata.sourceIds.length &&
  metadata.sourceUrls.every(isHttps)

const hasCaseMetadataBoundary = (metadata, expected) =>
  metadata?.schemaVersion === 1 &&
  metadata?.itemId === expected.itemId &&
  metadata?.resourceId === expected.resourceId &&
  metadata?.contentMode === 'original_case_synthesis' &&
  metadata?.documentType === 'original_case_synthesis' &&
  metadata?.language === 'zh-CN' &&
  metadata?.authorship?.humanReviewRequired === false &&
  metadata?.authorship?.humanReviewStatus === 'not_required' &&
  metadata?.authorship?.fullTranslationClaimed === false &&
  metadata?.authorship?.sourceStructurePreserved === false &&
  metadata?.authorship?.directQuoteWordCount === 0 &&
  metadata?.source?.primaryUrl === expected.sourceUrl &&
  metadata?.source?.translationPermissionVerified === false &&
  metadata?.source?.publicRedistributionPermissionVerified === false &&
  metadata?.license?.kind === 'none_verified' &&
  metadata?.license?.rightsStatus === 'link_and_summarize' &&
  metadata?.license?.openLicenseObserved === false &&
  sameMembers(metadata?.synthesis?.requiredCaseDimensions ?? [], requiredCaseDimensions) &&
  metadata?.synthesis?.requiredCaseDimensionsCovered === 8 &&
  metadata?.synthesis?.standaloneReadable === true &&
  metadata?.synthesis?.authorReportSeparatedFromSiteInference === true &&
  metadata?.synthesis?.sourceBodyTranslated === false &&
  metadata?.synthesis?.hanCharacterCount >= 4000 &&
  metadata?.publication?.visibility === 'internal' &&
  metadata?.publication?.status === 'internal-ready' &&
  metadata?.publication?.publicReleaseEnabled === false &&
  metadata?.publication?.internalLearningStatus === 'authoritative' &&
  metadata?.publication?.legalReviewStatus === 'not_reviewed' &&
  metadata?.publication?.legalApprovalClaimed === false &&
  metadata?.completeness?.requiredDimensions === '8/8' &&
  metadata?.completeness?.sourceTextTreatment === 'summarized_not_translated' &&
  metadata?.completeness?.fullSourceTranslation === 'not_created' &&
  metadata?.file === expected.bodyFile &&
  metadata?.updatedAt === '2026-08-22'

function validatePublicationRecord(record, bodyOverride) {
  const errors = []
  const prefix = nonEmpty(record?.resourceId) ? record.resourceId : 'unknown-resource'
  const fail = message => errors.push(`${prefix}: ${message}`)

  if (!record || typeof record !== 'object' || Array.isArray(record)) {
    return [`${prefix}: 记录必须是对象`]
  }
  if (!nonEmpty(record.resourceId)) fail('resourceId 必填')
  if (!contentModes.includes(record.contentMode)) fail('contentMode 不在契约枚举中')
  if (!isHttps(record.sourceUrl)) fail('sourceUrl 必须是 HTTPS')
  if (!nonEmpty(record.sourceLanguage)) fail('sourceLanguage 必填')
  if (!nonEmpty(record.translatorNote)) fail('translatorNote 必填')
  if (!rightsStatuses.has(record.rightsStatus)) fail('rightsStatus 不在已有评价枚举中')
  if (!completenessValues.has(record.completeness)) fail('completeness 不在契约枚举中')
  if (!publicationScopes.has(record.publicationScope)) fail('publicationScope 不在契约枚举中')
  if (typeof record.body !== 'string' && !nonEmpty(record.bodyFile)) {
    fail('body 必须是字符串，或由 bodyFile 指向权威正文')
  }
  const resolvedBody = typeof bodyOverride === 'string' ? bodyOverride : record.body

  const license = record.license
  if (!license || typeof license !== 'object' || Array.isArray(license)) {
    fail('license 必须是对象')
  } else {
    if (!licenseKinds.has(license.kind)) fail('license.kind 不在契约枚举中')
    if (!nullableString(license.name)) fail('license.name 必须是非空字符串或 null')
    if (!nullableString(license.version)) fail('license.version 必须是非空字符串或 null')
    if (!(license.evidenceUrl === null || isHttps(license.evidenceUrl))) {
      fail('license.evidenceUrl 必须是 HTTPS 或 null')
    }
    if (!(license.evidenceCapturedAt === null || isDate(license.evidenceCapturedAt))) {
      fail('license.evidenceCapturedAt 必须是 YYYY-MM-DD 或 null')
    }
    if (!nullableString(license.permissionEvidenceId)) {
      fail('license.permissionEvidenceId 必须是非空字符串或 null')
    }

    if (license.kind === 'open_license') {
      if (!nonEmpty(license.name) || !nonEmpty(license.version)) {
        fail('开放许可必须保存许可名称与版本')
      }
      if (!isHttps(license.evidenceUrl) || !isDate(license.evidenceCapturedAt)) {
        fail('开放许可必须保存证据 URL 与核验日期')
      }
      if (record.rightsStatus !== 'reusable_license_verified') {
        fail('开放许可必须对应 reusable_license_verified')
      }
    }
    if (license.kind === 'written_permission') {
      if (!nonEmpty(license.permissionEvidenceId)) fail('书面授权必须保存 permissionEvidenceId')
      if (record.rightsStatus !== 'reusable_license_verified') {
        fail('书面授权必须对应 reusable_license_verified')
      }
    }
    if (['none_verified', 'unresolved'].includes(license.kind)) {
      const shouldBeNull = [
        license.name,
        license.version,
        license.evidenceUrl,
        license.evidenceCapturedAt,
        license.permissionEvidenceId,
      ]
      if (shouldBeNull.some(value => value !== null)) {
        fail('未核验或未解决许可不能夹带伪证据字段')
      }
    }
  }

  if (record.contentMode === 'guide_only' && record.completeness !== 'guide_only') {
    fail('guide_only 必须使用 guide_only 完整度')
  }
  if (completeModes.has(record.contentMode)) {
    if (record.completeness !== 'complete') fail('完整内容模式必须使用 complete 完整度')
    if (!nonEmpty(resolvedBody)) fail('完整内容模式不得缺少正文')
  }
  if (fullTranslationModes.has(record.contentMode) && !nonEmpty(resolvedBody)) {
    fail('完整译文不得把空正文标记为完整')
  }
  if (fullTranslationModes.has(record.contentMode)) {
    if (!translationAuthorities.includes(record.translationAuthority)) {
      fail('完整译文必须保存 translationAuthority')
    }
    if (!humanReviewStatuses.includes(record.humanReviewStatus)) {
      fail('完整译文必须保存 humanReviewStatus')
    }
    if (!internalLearningStatuses.includes(record.internalLearningStatus)) {
      fail('完整译文必须保存 internalLearningStatus')
    }
    if (typeof record.humanTranslatorClaimed !== 'boolean') {
      fail('完整译文必须明确 humanTranslatorClaimed')
    }
    if (!legalReviewStatuses.includes(record.legalReviewStatus)) {
      fail('完整译文必须保存 legalReviewStatus')
    }
    if (record.legalApprovalClaimed !== false) {
      fail('本契约不得声称完整译文已经法律审定')
    }
  }
  if (record.translationAuthority === 'codex_ai_complete') {
    if (record.humanTranslatorClaimed !== false) {
      fail('Codex AI 完整翻译不得声称为人工翻译')
    }
    if (record.humanReviewStatus !== 'not_required') {
      fail('Codex AI 内部学习主版不以人工双语复核为前置条件')
    }
  }
  if (originalContentModes.has(record.contentMode) && record.license?.kind !== 'site_owned') {
    fail('本站原创内容必须明确记为 site_owned')
  }
  if (originalContentModes.has(record.contentMode) && record.rightsStatus !== 'site_owned_original') {
    fail('本站原创内容必须使用 site_owned_original 权利状态')
  }
  if (record.contentMode === 'authorized_full_translation') {
    if (!['open_license', 'written_permission'].includes(record.license?.kind)) {
      fail('authorized_full_translation 必须有开放许可或书面授权')
    }
    if (record.rightsStatus !== 'reusable_license_verified') {
      fail('authorized_full_translation 必须已核验可复用权利')
    }
  }
  if (record.contentMode === 'authorized_zh_republication') {
    if (!['open_license', 'written_permission'].includes(record.license?.kind)) {
      fail('authorized_zh_republication 必须有开放许可或书面授权')
    }
    if (record.rightsStatus !== 'reusable_license_verified') {
      fail('authorized_zh_republication 必须已核验可复用权利')
    }
  }
  if (record.contentMode === 'internal_full_translation' && record.publicationScope !== 'internal') {
    fail('internal_full_translation 只能使用 internal 发布范围')
  }
  if (
    record.contentMode === 'internal_full_translation' &&
    ['public-candidate', 'published'].includes(record.publicationStatus)
  ) {
    fail('internal_full_translation 不得进入公开候选或已发布状态')
  }
  if (record.publicationStatus === 'internal-ready' && record.publicationScope !== 'internal') {
    fail('internal-ready 只能使用 internal 发布范围')
  }
  if (['public-candidate', 'published'].includes(record.publicationStatus) && record.publicationScope !== 'public') {
    fail('公开候选或已发布状态必须使用 public 发布范围')
  }

  return errors
}

function validateAuthoritativeEligibility(record) {
  if (!authoritativeContentModes.includes(record?.contentMode)) {
    return [`${record?.itemId ?? record?.resourceId ?? 'unknown-item'}: 该内容模式不得进入权威学习契约`]
  }
  return []
}

const failures = []
const checks = []
const check = (passed, label, details = []) => {
  checks.push([passed, label])
  if (!passed) failures.push(...(details.length ? details : [label]))
}

const records = Array.isArray(contract.records) ? contract.records : []
const authoritativeItems = Array.isArray(contract.authoritativeItems) ? contract.authoritativeItems : []
const coreResourceIds = [...new Set(learningPaths.paths.flatMap(path => path.steps.map(step => step.resourceId)))]
const recordIds = records.map(record => record.resourceId)
const resourceById = new Map(resources.map(resource => [resource.id, resource]))
const assessmentById = new Map(assessments.map(assessment => [assessment.resourceId, assessment]))

check(contract.schemaVersion === 2, '学习内容契约有显式 schema v2')
check(isDate(contract.updatedAt), '学习内容契约有有效更新日期')
check(nonEmpty(contract.principle), '学习内容契约保存发布原则')
check(
  contract.rightsStatuses && sameMembers(Object.keys(contract.rightsStatuses), [...rightsStatuses]),
  '来源复用状态与本站原创内容权利状态分开',
)
check(
  contract.contentModes && sameMembers(Object.keys(contract.contentModes), contentModes),
  '译文、导读、本站原创单元与原创案例综合模式均有显式定义',
)
check(
  contentModes.every(mode =>
    nonEmpty(contract.contentModes?.[mode]?.label) &&
    nonEmpty(contract.contentModes?.[mode]?.description) &&
    typeof contract.contentModes?.[mode]?.completeBodyRequired === 'boolean' &&
    typeof contract.contentModes?.[mode]?.publicAllowed === 'boolean'),
  '每种模式都有中文定义、正文门与公开范围',
)
check(
  contract.contentModes?.internal_full_translation?.publicAllowed === false,
  '契约明确禁止内部全译文公开',
)
check(
  contract.authoritativeItemPolicy?.registration === 'explicit_allowlist' &&
    sameMembers(contract.authoritativeItemPolicy?.allowedContentModes ?? [], authoritativeContentModes) &&
    nonEmpty(contract.authoritativeItemPolicy?.description),
  '权威学习内容使用显式白名单，不从翻译目录自动收录',
)
check(
  contract.publicationStatuses && sameMembers(Object.keys(contract.publicationStatuses), publicationStatuses),
  '草稿、内部可用、公开候选、已发布与撤回状态彼此分开',
)
check(
  contract.humanReviewStatuses && sameMembers(Object.keys(contract.humanReviewStatuses), humanReviewStatuses),
  '人工复核状态含有不作为前置条件的 not_required',
)
check(
  contract.translationAuthorities && sameMembers(Object.keys(contract.translationAuthorities), translationAuthorities),
  '翻译主体独立记录，Codex AI 不冒充人工译者',
)
check(
  contract.internalLearningStatuses && sameMembers(Object.keys(contract.internalLearningStatuses), internalLearningStatuses),
  '内部学习主版与补充、未就绪状态分开',
)
check(records.length === 18, '18 份核心资料均有内容与权利记录')
check(new Set(recordIds).size === recordIds.length, '核心资料的内容记录不重复')
check(
  sameMembers(recordIds, coreResourceIds),
  '契约记录与六条学习路线的核心资料严格一致',
)

const recordErrors = records.flatMap(record => {
  const errors = validatePublicationRecord(record)
  const resource = resourceById.get(record.resourceId)
  const assessment = assessmentById.get(record.resourceId)
  if (!resource) return [...errors, `${record.resourceId}: resources.json 中不存在`]
  if (record.sourceUrl !== resource.href) errors.push(`${record.resourceId}: sourceUrl 必须与权威资源表一致`)
  if (!resource.language.includes(record.sourceLanguage)) {
    errors.push(`${record.resourceId}: sourceLanguage 必须与权威资源表一致`)
  }
  if (!assessment) errors.push(`${record.resourceId}: 缺少 ResourceAssessment`)
  if (assessment && record.rightsStatus !== assessment.rightsStatus) {
    errors.push(`${record.resourceId}: rightsStatus 必须与权威评审记录一致`)
  }
  return errors
})
check(recordErrors.length === 0, '每份内容记录通过字段、权利和外键校验', recordErrors)

check(authoritativeItems.length > 0, '已完成的内部学习主版进入 authoritativeItems')
check(authoritativeItems.length === 16, 'authoritativeItems 精确收录 16 项已完成内部学习主版')
check(
  authoritativeItems.filter(item => item.contentMode === 'original_complete').length === 8 &&
    authoritativeItems.filter(item => item.contentMode === 'authorized_full_translation').length === 3 &&
    authoritativeItems.filter(item => item.contentMode === 'original_case_synthesis').length === 5,
  '权威内容严格保持 8 份原创完整内容、3 份授权全译文与 5 份原创案例综合',
)
check(
  new Set(authoritativeItems.map(item => item.itemId)).size === authoritativeItems.length,
  '权威内容项 itemId 不重复',
)

const authoritativeItemErrors = authoritativeItems.flatMap(item => {
  const errors = []
  const prefix = nonEmpty(item.itemId) ? item.itemId : 'unknown-item'
  const isTranslation = fullTranslationModes.has(item.contentMode)
  let body = ''
  let metadata

  if (!nonEmpty(item.itemId)) errors.push(`${prefix}: itemId 必填`)
  if (!nonEmpty(item.titleZh)) errors.push(`${prefix}: titleZh 必填`)
  if (!publicationStatuses.includes(item.publicationStatus)) {
    errors.push(`${prefix}: publicationStatus 不在契约枚举中`)
  }
  if (isTranslation && !humanReviewStatuses.includes(item.humanReviewStatus)) {
    errors.push(`${prefix}: 完整译文的 humanReviewStatus 不在契约枚举中`)
  }
  if (isTranslation && !translationAuthorities.includes(item.translationAuthority)) {
    errors.push(`${prefix}: 完整译文的 translationAuthority 不在契约枚举中`)
  }
  if (!internalLearningStatuses.includes(item.internalLearningStatus)) {
    errors.push(`${prefix}: internalLearningStatus 不在契约枚举中`)
  }
  if (!legalReviewStatuses.includes(item.legalReviewStatus)) {
    errors.push(`${prefix}: legalReviewStatus 不在契约枚举中`)
  }
  if (!nonEmpty(item.bodyFile) || !item.bodyFile.startsWith('content/') || item.bodyFile.includes('..')) {
    errors.push(`${prefix}: bodyFile 必须位于 content 目录内`)
  }
  if (!nonEmpty(item.metadataFile) || !item.metadataFile.startsWith('content/') || item.metadataFile.includes('..')) {
    errors.push(`${prefix}: metadataFile 必须位于 content 目录内`)
  }
  if (isTranslation && !item.bodyFile?.startsWith('content/translations/')) {
    errors.push(`${prefix}: 完整译文 bodyFile 必须位于 content/translations`)
  }
  if (isTranslation && !item.metadataFile?.startsWith('content/translations/')) {
    errors.push(`${prefix}: 完整译文 metadataFile 必须位于 content/translations`)
  }

  if (nonEmpty(item.bodyFile) && item.bodyFile.startsWith('content/') && !item.bodyFile.includes('..')) {
    try {
      body = readRepositoryText(item.bodyFile)
    } catch {
      errors.push(`${prefix}: bodyFile 不存在或无法读取`)
    }
  }
  if (nonEmpty(item.metadataFile) && item.metadataFile.startsWith('content/') && !item.metadataFile.includes('..')) {
    try {
      metadata = JSON.parse(readRepositoryText(item.metadataFile))
    } catch {
      errors.push(`${prefix}: metadataFile 不存在、无法读取或不是有效 JSON`)
    }
  }

  errors.push(...validatePublicationRecord(item, body))
  errors.push(...validateAuthoritativeEligibility(item))
  const resource = resourceById.get(item.resourceId)
  const assessment = assessmentById.get(item.resourceId)
  if (!resource) errors.push(`${prefix}: resourceId 不存在于权威资源表`)
  if (resource && !resource.language.includes(item.sourceLanguage)) {
    errors.push(`${prefix}: sourceLanguage 必须与所属资源一致`)
  }
  if (assessment && !originalContentModes.has(item.contentMode) && item.rightsStatus !== assessment.rightsStatus) {
    errors.push(`${prefix}: rightsStatus 必须与所属资源评审记录一致`)
  }
  if (metadata && isTranslation) {
    if (metadata.schemaVersion !== 2) errors.push(`${prefix}: metadata 必须使用 schema v2`)
    if (metadata.translationId !== item.itemId) errors.push(`${prefix}: metadata translationId 不一致`)
    if (metadata.resourceId !== item.resourceId) errors.push(`${prefix}: metadata resourceId 不一致`)
    if (metadata.original?.url !== item.sourceUrl) errors.push(`${prefix}: metadata 原文 URL 不一致`)
    if (metadata.file !== item.bodyFile) errors.push(`${prefix}: metadata 正文文件不一致`)
    if (['open_license', 'written_permission'].includes(item.license?.kind)) {
      if (metadata.license?.evidenceUrl !== item.license?.evidenceUrl || metadata.license?.permitsTranslation !== true) {
        errors.push(`${prefix}: metadata 必须保存一致的翻译许可证据`)
      }
    }
    if (item.license?.kind === 'none_verified') {
      if (
        metadata.license?.kind !== 'none_verified' ||
        metadata.license?.openTranslationPermissionVerified !== false ||
        metadata.license?.publicRedistributionPermissionVerified !== false
      ) {
        errors.push(`${prefix}: 未授权内部译文必须如实保存无开放翻译/公开再发布许可`)
      }
    }
    if (metadata.translation?.humanReviewStatus !== item.humanReviewStatus) {
      errors.push(`${prefix}: metadata 人工复核状态不一致`)
    }
    if (metadata.translation?.translationAuthority !== item.translationAuthority) {
      errors.push(`${prefix}: metadata 翻译主体不一致`)
    }
    if (metadata.translation?.humanTranslatorClaimed !== item.humanTranslatorClaimed) {
      errors.push(`${prefix}: metadata 人工译者声明不一致`)
    }
    if (metadata.translation?.internalLearningStatus !== item.internalLearningStatus) {
      errors.push(`${prefix}: metadata 内部学习状态不一致`)
    }
    if (metadata.publication?.visibility !== item.publicationStatus) {
      errors.push(`${prefix}: metadata 发布状态不一致`)
    }
    if (metadata.publication?.internalOnly !== (item.publicationScope === 'internal')) {
      errors.push(`${prefix}: publicationScope 必须与 metadata.internalOnly 一致`)
    }
    if (item.humanReviewStatus === 'not_required') {
      if (metadata.publication?.requiresHumanReviewBeforeInternalUse !== false) {
        errors.push(`${prefix}: not_required 必须明确不把人工复核当作内部使用门`)
      }
      if (metadata.publication?.requiresHumanReviewBeforeRelease !== false) {
        errors.push(`${prefix}: not_required 必须与发布元数据一致`)
      }
    }
    if (metadata.publication?.legalReviewStatus !== item.legalReviewStatus) {
      errors.push(`${prefix}: metadata 法律复核状态不一致`)
    }
    if (metadata.publication?.legalApprovalClaimed !== item.legalApprovalClaimed) {
      errors.push(`${prefix}: metadata 法律审定声明不一致`)
    }
    if (item.publicationStatus === 'internal-ready') {
      if (metadata.publication?.publicReleaseEnabled !== false) {
        errors.push(`${prefix}: internal-ready 不得开启公开发布`)
      }
      if (metadata.publication?.requiresExplicitPublicReleaseDecision !== true) {
        errors.push(`${prefix}: internal-ready 转公开必须要求显式发布决定`)
      }
    }
    if (item.translationAuthority === 'codex_ai_complete') {
      const leadingCopy = body.slice(0, 2400)
      if (metadata.translation?.translator !== 'Codex AI') {
        errors.push(`${prefix}: Codex AI 完整翻译必须如实保存 translator`)
      }
      if (/AI 辅助初译|等待.{0,8}人工复核/.test(leadingCopy)) {
        errors.push(`${prefix}: 正文头部仍保留过期的初译或人工复核前置声明`)
      }
      if (!leadingCopy.includes('不声称为人工翻译或法律审定版')) {
        errors.push(`${prefix}: 正文必须明示非人工翻译与非法律审定边界`)
      }
    }
  }
  if (metadata && originalContentModes.has(item.contentMode)) {
    const metadataItemId = metadata.itemId ?? metadata.artifactId
    if (metadataItemId !== item.itemId) errors.push(`${prefix}: 原创内容 metadata 项目 ID 不一致`)
    if (metadata.contentMode !== item.contentMode) errors.push(`${prefix}: 原创内容 metadata 模式不一致`)
    if (metadata.file !== item.bodyFile) errors.push(`${prefix}: 原创内容 metadata 正文文件不一致`)
    if (item.publicationScope === 'internal' && !['internal', 'internal-ready'].includes(metadata.publication?.visibility)) {
      errors.push(`${prefix}: 原创内容 metadata 必须保存内部发布范围`)
    }
    if (
      metadata.authorship?.fullTranslationClaimed === true ||
      metadata.synthesis?.fullTranslationIncluded === true
    ) {
      errors.push(`${prefix}: 原创内容不得声称包含来源全文翻译`)
    }
  }

  return errors
})
check(
  authoritativeItemErrors.length === 0,
  '权威内容项通过正文、元数据、许可和发布状态校验',
  authoritativeItemErrors,
)

check(
  new Set(authoritativeItems.map(item => item.metadataFile)).size === authoritativeItems.length,
  '权威内容项的 metadataFile 不重复',
)
check(
  authoritativeItems.every(item => authoritativeContentModes.includes(item.contentMode)),
  '权威契约只收录已授权译文、本站原创单元或原创案例综合',
)

const firstTranslation = authoritativeItems.find(item => item.itemId === 'game-design-concepts-level-01-zh-CN')
check(
  firstTranslation?.publicationStatus === 'internal-ready' &&
    firstTranslation?.humanReviewStatus === 'not_required' &&
    firstTranslation?.publicationScope === 'internal' &&
    firstTranslation?.translationAuthority === 'codex_ai_complete' &&
    firstTranslation?.internalLearningStatus === 'authoritative' &&
    firstTranslation?.humanTranslatorClaimed === false &&
    firstTranslation?.legalReviewStatus === 'not_reviewed' &&
    firstTranslation?.legalApprovalClaimed === false,
  '首份 Codex AI 完整译文如实作为内部学习主版，不冒充人工或法律审定',
)

const rulebookAccessibilityExpected = {
  itemId: 'what-makes-a-rulebook-accessible-and-entertaining-zh-CN',
  resourceId: 'accessible-rulebook-best-practices',
  sourceUrl: 'https://repository.kulib.kyoto-u.ac.jp/handle/2433/298016',
  bodyFile: 'content/translations/what-makes-a-rulebook-accessible-and-entertaining-zh-CN.md',
  metadataFile: 'content/translations/what-makes-a-rulebook-accessible-and-entertaining-zh-CN.metadata.json',
  auditFile: 'docs/research/RULEBOOK_ACCESSIBILITY_TRANSLATION_AUDIT_2026-08-22.md',
}
const rulebookAccessibilityItem = authoritativeItems.find(item => item.itemId === rulebookAccessibilityExpected.itemId)
check(
  rulebookAccessibilityItem?.resourceId === rulebookAccessibilityExpected.resourceId &&
    rulebookAccessibilityItem?.titleZh === '怎样让规则书既无障碍又有趣？最佳实践建议' &&
    rulebookAccessibilityItem?.contentMode === 'authorized_full_translation' &&
    rulebookAccessibilityItem?.sourceUrl === rulebookAccessibilityExpected.sourceUrl &&
    rulebookAccessibilityItem?.license?.kind === 'open_license' &&
    rulebookAccessibilityItem?.license?.name === 'Creative Commons Attribution' &&
    rulebookAccessibilityItem?.license?.version === '4.0 International' &&
    rulebookAccessibilityItem?.license?.evidenceUrl === rulebookAccessibilityExpected.sourceUrl &&
    rulebookAccessibilityItem?.license?.evidenceCapturedAt === '2026-08-22' &&
    rulebookAccessibilityItem?.rightsStatus === 'reusable_license_verified' &&
    rulebookAccessibilityItem?.completeness === 'complete' &&
    rulebookAccessibilityItem?.translationAuthority === 'codex_ai_complete' &&
    rulebookAccessibilityItem?.humanTranslatorClaimed === false &&
    rulebookAccessibilityItem?.humanReviewStatus === 'not_required' &&
    rulebookAccessibilityItem?.internalLearningStatus === 'authoritative' &&
    rulebookAccessibilityItem?.publicationScope === 'internal' &&
    rulebookAccessibilityItem?.publicationStatus === 'internal-ready' &&
    rulebookAccessibilityItem?.legalReviewStatus === 'not_reviewed' &&
    rulebookAccessibilityItem?.legalApprovalClaimed === false &&
    rulebookAccessibilityItem?.bodyFile === rulebookAccessibilityExpected.bodyFile &&
    rulebookAccessibilityItem?.metadataFile === rulebookAccessibilityExpected.metadataFile,
  '第三篇开放许可译文以 CC BY 4.0、Codex AI、internal-ready 进入权威白名单',
)
check(
  rulebookAccessibilityMetadata.schemaVersion === 2 &&
    rulebookAccessibilityMetadata.translationId === rulebookAccessibilityExpected.itemId &&
    rulebookAccessibilityMetadata.resourceId === rulebookAccessibilityExpected.resourceId &&
    rulebookAccessibilityMetadata.contentMode === 'authorized_full_translation' &&
    rulebookAccessibilityMetadata.original?.url === rulebookAccessibilityExpected.sourceUrl &&
    rulebookAccessibilityMetadata.license?.id === 'CC-BY-4.0' &&
    rulebookAccessibilityMetadata.license?.url === 'https://creativecommons.org/licenses/by/4.0/' &&
    rulebookAccessibilityMetadata.license?.evidenceUrl === rulebookAccessibilityExpected.sourceUrl &&
    rulebookAccessibilityMetadata.license?.permitsTranslation === true &&
    rulebookAccessibilityMetadata.license?.permitsRedistribution === true &&
    rulebookAccessibilityMetadata.rights?.rightsStatus === 'reusable_license_verified' &&
    rulebookAccessibilityMetadata.translation?.translator === 'Codex AI' &&
    rulebookAccessibilityMetadata.translation?.translationAuthority === 'codex_ai_complete' &&
    rulebookAccessibilityMetadata.translation?.humanTranslatorClaimed === false &&
    rulebookAccessibilityMetadata.translation?.humanReviewStatus === 'not_required' &&
    rulebookAccessibilityMetadata.translation?.internalLearningStatus === 'authoritative' &&
    rulebookAccessibilityMetadata.publication?.visibility === 'internal-ready' &&
    rulebookAccessibilityMetadata.publication?.internalOnly === true &&
    rulebookAccessibilityMetadata.publication?.publicReleaseEnabled === false &&
    rulebookAccessibilityMetadata.publication?.legalReviewStatus === 'not_reviewed' &&
    rulebookAccessibilityMetadata.publication?.legalApprovalClaimed === false &&
    rulebookAccessibilityMetadata.file === rulebookAccessibilityExpected.bodyFile &&
    rulebookAccessibilityMetadata.verificationDocument === rulebookAccessibilityExpected.auditFile,
  '第三篇开放许可译文 metadata 固定来源、许可、翻译主体与内部发布边界',
)
check(
  rulebookAccessibilityBodyCounts.han >= 12000 &&
    rulebookAccessibilityBodyCounts.han === rulebookAccessibilityMetadata.translation?.hanCharacterCount &&
    rulebookAccessibilityBodyCounts.numberedParagraphs === 66 &&
    rulebookAccessibilityBodyCounts.uniqueNumberedParagraphs === 66 &&
    rulebookAccessibilityBodyCounts.tables === 6 &&
    rulebookAccessibilityBodyCounts.textAlternatives === 3 &&
    rulebookAccessibilityBodyCounts.references === 31 &&
    rulebookAccessibilityBodyCounts.ludography === 17,
  '第三篇开放许可译文正文满足汉字规模、66 段、六表、三文字替代与完整书目结构',
)
check(
  rulebookAccessibilityAudit.includes(rulebookAccessibilityExpected.bodyFile) &&
    rulebookAccessibilityAudit.includes(rulebookAccessibilityExpected.metadataFile) &&
    rulebookAccessibilityAudit.includes('Creative Commons Attribution 4.0 International（CC BY 4.0）') &&
    rulebookAccessibilityAudit.includes('全部 66 个编号段落') &&
    rulebookAccessibilityAudit.includes('汉字字符数：**12,746**') &&
    rulebookAccessibilityAudit.includes('`contentMode`: `authorized_full_translation`') &&
    rulebookAccessibilityAudit.includes('`translationAuthority`: `codex_ai_complete`') &&
    rulebookAccessibilityAudit.includes('`publication.visibility`: `internal-ready`'),
  '第三篇开放许可译文的 metadata、正文与审计文件相互一致',
)

const unit03Expected = {
  itemId: 'systematic-unit-03-mechanisms-information-interaction-zh-CN',
  resourceId: 'game-design-concepts',
  contentMode: 'original_complete',
  sourceUrl: 'https://gamedesignconcepts.wordpress.com/2009/07/06/level-3-formal-elements-of-games/',
  bodyFile: 'content/learning-units/systematic-unit-03-mechanisms-information-interaction-zh-CN.md',
  metadataFile: 'content/learning-units/systematic-unit-03-mechanisms-information-interaction-zh-CN.metadata.json',
}
const unit03 = authoritativeItems.find(item => item.itemId === unit03Expected.itemId)
check(
  isInternalAuthoritativeOriginal(unit03, unit03Expected) &&
    unit03?.sourceReferences?.includes('https://aaai.org/papers/ws04-04-001-mda-a-formal-approach-to-game-design-and-game-research/') &&
    unit03?.sourceReferences?.includes('https://www.thamesandkosmos.com/manuals/full/691868_Crew_Manual.pdf'),
  '系统课程单元 3 已以本站原创完整正文进入内部权威白名单',
)
check(
  hasUnitMetadataBoundary(unit03Metadata, unit03Expected),
  '系统课程单元 3 metadata 保留原创模式、内部范围、来源与无需人工复核边界',
)

const unit04Expected = {
  itemId: 'systematic-unit-04-minimum-prototype-zh-CN',
  resourceId: 'kathleen-mercury-prototyping',
  contentMode: 'original_complete',
  sourceUrl: 'https://www.kathleenmercury.com/prototyping.html',
  bodyFile: 'content/learning-units/systematic-unit-04-minimum-prototype-zh-CN.md',
  metadataFile: 'content/learning-units/systematic-unit-04-minimum-prototype-zh-CN.metadata.json',
}
const unit04 = authoritativeItems.find(item => item.itemId === unit04Expected.itemId)
check(
  isInternalAuthoritativeOriginal(unit04, unit04Expected) &&
    unit04?.sourceReferences?.includes('https://www.kathleenmercury.com/recommended-materials.html') &&
    unit04?.sourceReferences?.includes('https://gamedesignconcepts.wordpress.com/2009/07/02/level-2-game-design-iteration-and-rapid-prototyping/'),
  '系统课程单元 4 已以本站原创完整正文进入内部权威白名单',
)
check(
  hasUnitMetadataBoundary(unit04Metadata, unit04Expected),
  '系统课程单元 4 metadata 保留原创模式、内部范围、来源与无需人工复核边界',
)

const unit05Expected = {
  itemId: 'systematic-unit-05-single-question-test-zh-CN',
  resourceId: 'ttgda-playtesting',
  contentMode: 'original_complete',
  sourceUrl: 'https://www.ttgda.org/in-person-playtesting',
  bodyFile: 'content/learning-units/systematic-unit-05-single-question-test-zh-CN.md',
  metadataFile: 'content/learning-units/systematic-unit-05-single-question-test-zh-CN.metadata.json',
}
const unit05 = authoritativeItems.find(item => item.itemId === unit05Expected.itemId)
const unit05HanCount = (unit05Body.match(/[\u4E00-\u9FFF]/g) ?? []).length
check(
  isInternalAuthoritativeOriginal(unit05, unit05Expected) &&
    unit05?.sourceReferences?.includes('https://www.kathleenmercury.com/providing-feedback-on-prototypes-the-winq.html') &&
    unit05?.sourceReferences?.includes('https://gamesuserresearch.com/running-a-games-user-research-study/'),
  '系统课程单元 5 已以本站原创完整正文进入内部权威白名单',
)
check(
  hasUnitMetadataBoundary(unit05Metadata, unit05Expected) &&
    unit05Metadata.metrics?.hanCharacterCount === unit05HanCount &&
    unit05HanCount >= 7000,
  '系统课程单元 5 metadata、正文汉字规模、来源与内部范围一致',
)
check(
  ['行为预测', '反驳信号', '版本与参与范围', '无引导测试任务', '分层观察表', '停止条件', '简短复盘', '下一步移交'].every(label => unit05Body.includes(label)) &&
    unit05Body.includes('下面不是一份虚构的测试结果，而是一份可直接执行的测试计划') &&
    unit05Audit.includes(unit05Expected.bodyFile) &&
    unit05Audit.includes('本站原创中文教学综合，不是外部文章或课程的翻译'),
  '系统课程单元 5 覆盖九项测试产物，并把计划、示范与真实结果分开',
)

const unit06Expected = {
  itemId: 'systematic-unit-06-evidence-to-next-version-zh-CN',
  resourceId: 'game-design-concepts',
  contentMode: 'original_complete',
  sourceUrl: 'https://gamedesignconcepts.wordpress.com/2009/07/02/level-2-game-design-iteration-and-rapid-prototyping/',
  bodyFile: 'content/learning-units/systematic-unit-06-evidence-to-next-version-zh-CN.md',
  metadataFile: 'content/learning-units/systematic-unit-06-evidence-to-next-version-zh-CN.metadata.json',
}
const unit06 = authoritativeItems.find(item => item.itemId === unit06Expected.itemId)
const unit06HanCount = (unit06Body.match(/[\u4E00-\u9FFF]/g) ?? []).length
check(
  isInternalAuthoritativeOriginal(unit06, unit06Expected) &&
    unit06?.sourceReferences?.includes('https://www.gov.uk/service-manual/user-research/taking-notes-and-recording-user-research-sessions') &&
    unit06?.sourceReferences?.includes('https://doi.org/10.1037/h0031322'),
  '系统课程单元 6 已以本站原创完整正文进入内部权威白名单',
)
check(
  hasUnitMetadataBoundary(unit06Metadata, unit06Expected) &&
    unit06Metadata.metrics?.hanCharacterCount === unit06HanCount &&
    unit06HanCount >= 7000,
  '系统课程单元 6 metadata、正文汉字规模、来源与内部范围一致',
)
check(
  ['冻结版本', '原始观察', '玩家原话', '设计者解释', '备选原因', '继续观察', '主要改动', '行为预测', '反驳信号', '停车区', '下一版简报'].every(label => unit06Body.includes(label)) &&
    unit06Body.includes('DEMO-01') &&
    unit06Body.includes('不是项目真实测试') &&
    unit06Audit.includes('CC BY 3.0 US'),
  '系统课程单元 6 覆盖证据到版本链，并把教学演练与真人场次分开',
)

const learnByPlayingExpected = {
  itemId: 'learn-by-playing-one-moment-zh-CN',
  resourceId: 'game-design-concepts',
  contentMode: 'original_complete',
  sourceUrl: 'https://gamedesignconcepts.wordpress.com/2009/07/06/level-3-formal-elements-of-games/',
  bodyFile: 'content/learning-units/learn-by-playing-one-moment-zh-CN.md',
  metadataFile: 'content/learning-units/learn-by-playing-one-moment-zh-CN.metadata.json',
}
const learnByPlaying = authoritativeItems.find(item => item.itemId === learnByPlayingExpected.itemId)
const learnByPlayingHanCount = (learnByPlayingBody.match(/[\u4E00-\u9FFF]/g) ?? []).length
check(
  isInternalAuthoritativeOriginal(learnByPlaying, learnByPlayingExpected) &&
    learnByPlaying?.sourceReferences?.includes('https://www.blueorangegames.com/games/king-domino') &&
    learnByPlaying?.sourceReferences?.includes('https://www.clei.org/cleiej/index.php/cleiej/article/view/473'),
  '第一份边玩边学脚手架已以本站原创完整正文进入内部权威白名单',
)
check(
  hasUnitMetadataBoundary(learnByPlayingMetadata, learnByPlayingExpected) &&
    learnByPlayingMetadata.metrics?.hanCharacterCount === learnByPlayingHanCount &&
    learnByPlayingHanCount >= 6500 &&
    learnByPlayingMetadata.exampleBoundary?.includes('虚构教学记录'),
  '边玩边学 metadata、正文汉字规模、构造示例与内部范围一致',
)
check(
  ['冻结一个时刻', '摄像机记录', '暂时系统推断', '替代解释与未知', '只带一个问题去下一局', '把关系迁移到自己的设计'].every(label => learnByPlayingBody.includes(label)) &&
    learnByPlayingBody.includes('下一回合才会尝试放入王国') &&
    learnByPlayingBody.includes('6,680 个 U+4E00') === false &&
    learnByPlayingAudit.includes('正文达到 6,680 个 U+4E00–U+9FFF 汉字'),
  '边玩边学正文覆盖一时刻分析链，修正 Kingdomino 预定与下回合摆放时序',
)

const paulGroganExpected = {
  itemId: 'paul-grogan-rulebook-layout-case-synthesis-zh-CN-internal',
  resourceId: 'naylor-paul-grogan-rulebook',
  contentMode: 'original_case_synthesis',
  sourceUrl: 'https://naylorgames.com/blogs/blog/producing-fun-4-paul-grogan-rulebook-editor-content-creator',
  bodyFile: 'content/guides/paul-grogan-rulebook-layout-case-synthesis-zh-CN-internal.md',
  metadataFile: 'content/guides/paul-grogan-rulebook-layout-case-synthesis-zh-CN-internal.metadata.json',
}
const paulGroganCase = authoritativeItems.find(item => item.itemId === paulGroganExpected.itemId)
check(
  isInternalAuthoritativeOriginal(paulGroganCase, paulGroganExpected) &&
    paulGroganCase?.sourceReferences?.includes('https://www.tricorngames.com/designer-blog/2017/7/4/ruling-the-roost'),
  'Paul Grogan 规则书案例综合已进入内部权威白名单',
)
check(
  hasCaseMetadataBoundary(paulGroganCaseMetadata, paulGroganExpected),
  'Paul Grogan 案例 metadata 保留八维、非全译、未获来源翻译许可与关闭公开发布边界',
)

const newBedfordExpected = {
  itemId: 'new-bedford-manufacturing-constraint-case-synthesis-zh-CN-internal',
  resourceId: 'oakleaf-manufacturing-design-tool',
  contentMode: 'original_case_synthesis',
  sourceUrl: 'https://oakleafgames.wordpress.com/2014/03/24/manufacturing-as-a-design-tool/',
  bodyFile: 'content/guides/new-bedford-manufacturing-constraint-case-synthesis-zh-CN-internal.md',
  metadataFile: 'content/guides/new-bedford-manufacturing-constraint-case-synthesis-zh-CN-internal.metadata.json',
}
const newBedfordCase = authoritativeItems.find(item => item.itemId === newBedfordExpected.itemId)
check(
  isInternalAuthoritativeOriginal(newBedfordCase, newBedfordExpected) &&
    newBedfordCase?.sourceReferences?.includes('https://oakleafgames.wordpress.com/2013/10/13/notes-from-new-bedford-part-5-goods-and-money/') &&
    newBedfordCase?.sourceReferences?.includes('https://oakleafgames.wordpress.com/games/new-bedford/'),
  'New Bedford 生产约束案例综合已进入内部权威白名单',
)
check(
  hasCaseMetadataBoundary(newBedfordCaseMetadata, newBedfordExpected),
  'New Bedford 案例 metadata 保留八维、非全译、未获来源翻译许可与关闭公开发布边界',
)

const quidCase = authoritativeItems.find(item => item.itemId === 'quid-for-your-quo-case-synthesis-zh-CN-internal')
check(
  quidCase?.resourceId === 'wehrle-quid-for-quo' &&
    quidCase?.contentMode === 'original_case_synthesis' &&
    quidCase?.sourceUrl === 'https://wehrlegig.com/blogs/essays/quid-for-your-quo' &&
    quidCase?.sourceReferences?.includes('https://boardgamegeek.com/thread/2641352/designer-diary-3-quid-for-your-quo') &&
    quidCase?.license?.kind === 'site_owned' &&
    quidCase?.rightsStatus === 'site_owned_original' &&
    quidCase?.publicationScope === 'internal' &&
    quidCase?.publicationStatus === 'internal-ready' &&
    quidCase?.internalLearningStatus === 'authoritative' &&
    quidCase?.legalApprovalClaimed === false,
  'Quid for your Quo 原创案例综合已进入内部权威白名单',
)
check(
  quidCaseMetadata.authorship?.fullTranslationClaimed === false &&
    quidCaseMetadata.authorship?.humanReviewStatus === 'not_required' &&
    quidCaseMetadata.source?.translationPermissionVerified === false &&
    quidCaseMetadata.source?.publicRedistributionPermissionVerified === false &&
    quidCaseMetadata.synthesis?.requiredCaseDimensionsCovered === 8 &&
    quidCaseMetadata.publication?.legalApprovalClaimed === false,
  'Quid for your Quo metadata 保留非全译、未授权外部来源与非法律审定边界',
)

check(
  resourceById.get('loops-and-metagames')?.creator === 'Miguel Angel Sicart',
  'Loops and Metagames 作者修正已进入权威资源表',
)
check(
  assessmentById.get('accessible-rulebook-best-practices')?.rightsStatus === 'reusable_license_verified',
  '无障碍规则书论文的 CC BY 4.0 复用状态已修正',
)

const internalFixture = {
  resourceId: 'fixture-internal-translation',
  contentMode: 'internal_full_translation',
  sourceUrl: 'https://example.org/source',
  sourceLanguage: 'en',
  translatorNote: '仅内部研究与授权评估。',
  license: {
    kind: 'none_verified',
    name: null,
    version: null,
    evidenceUrl: null,
    evidenceCapturedAt: null,
    permissionEvidenceId: null,
  },
  rightsStatus: 'link_and_summarize',
  completeness: 'complete',
  translationAuthority: 'codex_ai_complete',
  humanTranslatorClaimed: false,
  humanReviewStatus: 'not_required',
  internalLearningStatus: 'authoritative',
  publicationScope: 'internal',
  publicationStatus: 'internal-ready',
  legalReviewStatus: 'not_reviewed',
  legalApprovalClaimed: false,
  body: '用于验证的完整内部正文。',
}
check(
  validatePublicationRecord(internalFixture).length === 0,
  '未授权内部完整译文只能通过底层隔离契约',
)
check(
  validateAuthoritativeEligibility(internalFixture).some(error => error.includes('不得进入权威学习契约')),
  '拒绝将未核验开放许可的外部全文译文收录为权威学习主版',
)
const publicInternalErrors = validatePublicationRecord({
  ...internalFixture,
  publicationScope: 'public',
})
check(
  publicInternalErrors.some(error => error.includes('只能使用 internal')),
  '拒绝把 internal_full_translation 标成 public',
  publicInternalErrors.length ? [] : ['合成拒绝分支未命中：internal_full_translation 公开发布'],
)
const emptyInternalErrors = validatePublicationRecord({
  ...internalFixture,
  body: '   ',
})
check(
  emptyInternalErrors.some(error => error.includes('完整译文不得')),
  '拒绝把空正文标成内部完整译文',
  emptyInternalErrors.length ? [] : ['合成拒绝分支未命中：内部译文正文为空'],
)
const authorizedFixture = {
  ...internalFixture,
  resourceId: 'fixture-authorized-translation',
  contentMode: 'authorized_full_translation',
  publicationScope: 'public',
  publicationStatus: 'public-candidate',
  rightsStatus: 'reusable_license_verified',
  body: '',
  license: {
    kind: 'open_license',
    name: 'Creative Commons Attribution',
    version: '4.0 International',
    evidenceUrl: 'https://creativecommons.org/licenses/by/4.0/',
    evidenceCapturedAt: '2026-08-21',
    permissionEvidenceId: null,
  },
}
const emptyAuthorizedErrors = validatePublicationRecord(authorizedFixture)
check(
  emptyAuthorizedErrors.some(error => error.includes('完整译文不得')),
  '拒绝把空正文标成已授权完整译文',
  emptyAuthorizedErrors.length ? [] : ['合成拒绝分支未命中：已授权译文正文为空'],
)
const falseHumanClaimErrors = validatePublicationRecord({
  ...internalFixture,
  humanTranslatorClaimed: true,
})
check(
  falseHumanClaimErrors.some(error => error.includes('不得声称为人工翻译')),
  '拒绝把 Codex AI 完整翻译标成人工翻译',
  falseHumanClaimErrors.length ? [] : ['合成拒绝分支未命中：AI 译文冒充人工翻译'],
)
const falseLegalClaimErrors = validatePublicationRecord({
  ...internalFixture,
  legalApprovalClaimed: true,
})
check(
  falseLegalClaimErrors.some(error => error.includes('不得声称完整译文已经法律审定')),
  '拒绝把内容契约标成法律审定',
  falseLegalClaimErrors.length ? [] : ['合成拒绝分支未命中：译文冒充法律审定'],
)
const originalCaseFixture = {
  resourceId: 'fixture-original-case-synthesis',
  contentMode: 'original_case_synthesis',
  sourceUrl: 'https://example.org/source-index',
  sourceLanguage: 'zh-CN',
  translatorNote: '本站原创案例综合，外部来源只作为已标注的证据。',
  license: {
    kind: 'site_owned',
    name: null,
    version: null,
    evidenceUrl: null,
    evidenceCapturedAt: null,
    permissionEvidenceId: null,
  },
  rightsStatus: 'site_owned_original',
  completeness: 'complete',
  publicationScope: 'internal',
  publicationStatus: 'internal-ready',
  body: '这是一份可独立读完、不复制单一原作结构的本站原创案例综合。',
}
check(
  validatePublicationRecord(originalCaseFixture).length === 0 &&
    validateAuthoritativeEligibility(originalCaseFixture).length === 0,
  'original_case_synthesis 可作为完整的本站原创权威内容',
)

check(
  packageJson.scripts['qa:resource-learning-content'] === 'node scripts/check-resource-learning-content.mjs',
  '独立学习内容契约守卫命令已注册',
)
check(
  packageJson.scripts['content:check'].includes('qa:resource-learning-content'),
  '学习内容契约守卫已进入完整内容门',
)

for (const [passed, label] of checks) console.log(`${passed ? '✓' : '✗'} ${label}`)
if (failures.length) {
  console.error(`\n资源学习内容契约守卫失败：${failures.length} 项`)
  for (const failure of failures) console.error(`- ${failure}`)
  process.exit(1)
}

const counts = Object.fromEntries(contentModes.map(mode => [mode, records.filter(record => record.contentMode === mode).length]))
const itemCounts = Object.fromEntries(contentModes.map(mode => [mode, authoritativeItems.filter(item => item.contentMode === mode).length]))
console.log(`\n资源学习内容契约守卫通过：${checks.length}/${checks.length}`)
console.log(`资源基线：${contentModes.map(mode => `${mode}=${counts[mode]}`).join('，')}`)
console.log(`权威内容项：${contentModes.map(mode => `${mode}=${itemCounts[mode]}`).join('，')}`)
