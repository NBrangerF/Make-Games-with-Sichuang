import { readFile } from 'node:fs/promises'

const readJson = async path => JSON.parse(await readFile(new URL(path, import.meta.url), 'utf8'))
const schema = await readJson('../docs/product/contribution-package-schema.json')
const template = await readJson('../docs/product/contribution-package-template.json')
const sessionTemplate = await readJson('../docs/product/contribution-protocol-session-template.json')
const errors = []

const isNonEmpty = value => typeof value === 'string' && value.trim().length > 0
const clone = value => JSON.parse(JSON.stringify(value))
const enumHas = (name, value) => schema.allowedValues?.[name]?.includes(value)

if (schema.schemaVersion !== 1 || schema.id !== 'tabletop-resource-contribution-package') errors.push('schema identity must remain stable at v1')
if (schema.publicSubmissionEnabled !== false || schema.noAggregateScore !== true || schema.notLegalOrEthicsApproval !== true) errors.push('schema safety boundaries are incomplete')
if (template.schemaVersion !== schema.schemaVersion || template.method !== 'tabletop-resource-contribution-package') errors.push('template does not match schema identity')
if (template.localFirst !== true || template.publicSubmissionEnabled !== false) errors.push('template must remain local-first with public submission disabled')
if (template.package?.status !== 'draft') errors.push('template must start as draft')
if (template.consent?.participationChoice !== 'not_decided' || template.consent?.storageChoice !== 'not_decided') errors.push('participation and storage consent must not be preselected')
if (template.consent?.publicationMode !== 'review_only' || template.consent?.quoteChoice !== 'no_quotes' || template.consent?.mediaChoice !== 'none') errors.push('publication, quotes and media must default to the narrowest choice')
if (template.rights?.contributorConfirmsAuthority !== false || template.rights?.explicitLicenseApproval !== false) errors.push('rights and public license approval must default to false')
if (template.privacy?.contactDetailsExcludedFromPackage !== true || template.privacy?.rawConsentEvidenceExcludedFromPackage !== true) errors.push('shareable package must exclude contact details and raw consent evidence')
if (template.publication?.published !== false || isNonEmpty(template.publication?.publicUrl)) errors.push('template must not look published')
for (const [key, value] of Object.entries(template.boundaries || {})) if (value !== true) errors.push(`boundary ${key} must default to true`)
if (sessionTemplate.schemaVersion !== 1 || sessionTemplate.method !== 'contribution-protocol-formative-session') errors.push('contribution protocol session template identity is invalid')
if (sessionTemplate.noAggregateScore !== true || sessionTemplate.notLegalOrEthicsValidation !== true) errors.push('session template must preserve no-score and no-approval boundaries')
if (sessionTemplate.session?.consentRecorded !== false || sessionTemplate.session?.recordingMode !== 'anonymous_notes_only') errors.push('session template must default to no consent and anonymous notes only')
if (sessionTemplate.tasks?.map(task => task.id).join(',') !== 'C1,C2,C3,C4,C5') errors.push('session template must preserve C1–C5 tasks')
if (sessionTemplate.safetyAndPrivacy?.sensitiveDetailsOmitted !== true || sessionTemplate.safetyAndPrivacy?.deletionRequested !== false) errors.push('session template privacy defaults are unsafe')

function publicationGate(record) {
  const failures = []
  const add = (condition, message) => { if (!condition) failures.push(message) }
  add(enumHas('status', record.package?.status), 'invalid package status')
  add(enumHas('contributionType', record.package?.contributionType), 'invalid contribution type')
  add(enumHas('identityMode', record.contributor?.identityMode), 'invalid identity mode')
  add((record.contributor?.roles || []).length > 0 && record.contributor.roles.every(role => enumHas('role', role)), 'invalid or missing contributor roles')
  add(enumHas('participationChoice', record.consent?.participationChoice), 'invalid participation choice')
  add(enumHas('storageChoice', record.consent?.storageChoice), 'invalid storage choice')
  add(enumHas('publicationMode', record.consent?.publicationMode), 'invalid publication mode')
  add(enumHas('quoteChoice', record.consent?.quoteChoice), 'invalid quote choice')
  add(enumHas('mediaChoice', record.consent?.mediaChoice), 'invalid media choice')
  add(enumHas('editorialStatus', record.review?.editorialStatus), 'invalid editorial status')
  add(enumHas('evidenceClassification', record.review?.evidenceClassification), 'invalid evidence classification')
  add(record.consent?.participationChoice === 'agreed', 'participation not agreed')
  add(record.consent?.storageChoice !== 'not_decided', 'storage choice missing')
  add(record.consent?.publicationMode !== 'review_only', 'review-only package cannot become publication candidate')
  add(isNonEmpty(record.consent?.informationVersion), 'information version missing')
  add(record.consent?.withdrawalExplained === true && record.consent?.canSkip === true && record.consent?.canStop === true, 'withdrawal, skip or stop rights incomplete')
  add(record.rights?.contributorConfirmsAuthority === true, 'contributor authority not confirmed')
  add(record.review?.finalPublicCopyPresent === true && isNonEmpty(record.review?.finalPublicCopy), 'final public copy missing')
  add(record.review?.contributorApprovalRecorded === true, 'final public copy not approved by contributor')
  add(record.review?.scopeAndLimitsPresent === true, 'scope and limits missing')
  add(record.review?.rolesAndAttributionReviewed === true, 'roles and attribution not reviewed')
  add(record.review?.rightsReviewed === true, 'rights not reviewed')
  add(record.privacy?.publicFieldsReviewed === true, 'public fields not reviewed')
  add(record.privacy?.contactDetailsExcludedFromPackage === true && record.privacy?.rawConsentEvidenceExcludedFromPackage === true, 'private contact or consent evidence may be exposed')
  add(record.withdrawal?.lookupKeyPresent === true, 'withdrawal lookup key missing')
  add(record.boundaries?.noAutomaticPublication === true && record.boundaries?.noGroupGeneralization === true && record.boundaries?.noAggregateScore === true && record.boundaries?.notLegalOrEthicsApproval === true, 'publication boundaries incomplete')

  if (record.consent?.publicationMode === 'cc_by_4_0') {
    add(record.consent?.ccIrrevocabilityExplained === true, 'CC irrevocability not explained')
    add(record.rights?.explicitLicenseApproval === true, 'CC license not explicitly approved')
  }
  if (record.consent?.quoteChoice !== 'no_quotes') add((record.content?.approvedQuotes || []).length > 0, 'quote permission selected without approved quote records')
  if (record.consent?.mediaChoice !== 'none') {
    add((record.content?.mediaItems || []).length > 0, 'media permission selected without media records')
    for (const [index, item] of (record.content?.mediaItems || []).entries()) {
      add(isNonEmpty(item.id) && isNonEmpty(item.rightsBasis) && item.contributorApprovalRecorded === true, `media item ${index} lacks id, rights basis or approval`)
    }
  }
  for (const [index, item] of (record.rights?.thirdPartyMaterials || []).entries()) {
    add(isNonEmpty(item.source) && isNonEmpty(item.publicationBasis), `third-party material ${index} lacks source or publication basis`)
  }
  if (record.privacy?.minorOrAdditionalSafeguardingNeeds === true) {
    add(record.safeguarding?.professionalReviewRecorded === true, 'professional safeguarding review missing')
    add(record.safeguarding?.guardianConsentRecordedWhenApplicable === true, 'guardian consent missing when applicable')
    add(record.safeguarding?.participantAssentRecorded === true, 'participant assent missing')
    add(isNonEmpty(record.safeguarding?.stopAndEscalationPlan), 'stop and escalation plan missing')
  }
  return failures
}

const validCandidate = clone(template)
validCandidate.package.id = 'CONTRIB-TEST-001'
validCandidate.package.createdAt = '2026-08-19T00:00:00Z'
validCandidate.package.status = 'publication_candidate'
validCandidate.package.title = '测试贡献包'
validCandidate.contributor.roles = ['lived_experience', 'validation', 'review_editing']
validCandidate.consent.informationVersion = 'info-v1'
validCandidate.consent.informationFormatChosenByContributor = 'plain_text'
validCandidate.consent.participationChoice = 'agreed'
validCandidate.consent.storageChoice = 'until_review_complete'
validCandidate.consent.publicationMode = 'approved_excerpt'
validCandidate.consent.withdrawalExplained = true
validCandidate.rights.contributorConfirmsAuthority = true
validCandidate.privacy.publicFieldsReviewed = true
validCandidate.review.editorialStatus = 'approved'
validCandidate.review.evidenceClassification = 'co_analyzed_first_person'
validCandidate.review.finalPublicCopy = '经贡献者审阅的公开副本，包含范围与限制。'
validCandidate.review.finalPublicCopyPresent = true
validCandidate.review.contributorApprovalRecorded = true
validCandidate.review.scopeAndLimitsPresent = true
validCandidate.review.rolesAndAttributionReviewed = true
validCandidate.review.rightsReviewed = true
validCandidate.withdrawal.lookupKeyPresent = true

const unexpectedCandidateFailures = publicationGate(validCandidate)
if (unexpectedCandidateFailures.length) errors.push(`valid publication candidate rejected: ${unexpectedCandidateFailures.join('; ')}`)

const guardCases = [
  ['participation consent', candidate => { candidate.consent.participationChoice = 'not_decided' }, 'participation not agreed'],
  ['review-only boundary', candidate => { candidate.consent.publicationMode = 'review_only' }, 'review-only package'],
  ['final copy approval', candidate => { candidate.review.contributorApprovalRecorded = false }, 'not approved'],
  ['withdrawal mapping', candidate => { candidate.withdrawal.lookupKeyPresent = false }, 'lookup key'],
  ['private data separation', candidate => { candidate.privacy.contactDetailsExcludedFromPackage = false }, 'private contact'],
  ['CC irrevocability', candidate => { candidate.consent.publicationMode = 'cc_by_4_0'; candidate.consent.ccIrrevocabilityExplained = false; candidate.rights.explicitLicenseApproval = true }, 'irrevocability'],
  ['CC explicit approval', candidate => { candidate.consent.publicationMode = 'cc_by_4_0'; candidate.consent.ccIrrevocabilityExplained = true; candidate.rights.explicitLicenseApproval = false }, 'explicitly approved'],
  ['third-party rights', candidate => { candidate.rights.thirdPartyMaterials = [{ source: '', publicationBasis: '' }] }, 'third-party material'],
  ['quote-specific approval', candidate => { candidate.consent.quoteChoice = 'anonymous_approved_quotes_only'; candidate.content.approvedQuotes = [] }, 'approved quote'],
  ['media-specific approval', candidate => { candidate.consent.mediaChoice = 'approved_still_images_only'; candidate.content.mediaItems = [] }, 'media records'],
  ['safeguarding review', candidate => { candidate.privacy.minorOrAdditionalSafeguardingNeeds = true }, 'safeguarding review'],
]

for (const [label, mutate, expected] of guardCases) {
  const candidate = clone(validCandidate)
  mutate(candidate)
  const failures = publicationGate(candidate)
  if (!failures.some(message => message.includes(expected))) errors.push(`${label} guard did not fail as expected: ${failures.join('; ')}`)
}

if (errors.length) {
  console.error(errors.join('\n'))
  process.exit(1)
}

console.log(`contribution package ok: safe defaults + valid candidate + ${guardCases.length} publication guards`)
