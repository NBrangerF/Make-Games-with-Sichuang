import { readFile, readdir } from 'node:fs/promises'

const readJson = async path => JSON.parse(await readFile(new URL(path, import.meta.url), 'utf8'))
const resources = await readJson('../content/resources.json')
const resourceIndex = await readJson('../content/resource-index.json')
const claims = await readJson('../content/claims.json')
const frameworks = await readJson('../content/frameworks.json')
const guides = await readJson('../content/guides.json')
const glossary = await readJson('../content/glossary.json')
const glossaryIndex = await readJson('../content/glossary-index.json')
const resourceAssessments = await readJson('../content/resource-assessments.json')
const resourceEvaluationRubric = await readJson('../content/resource-evaluation-rubric.json')
const specialGuides = await readJson('../content/special-guides.json')
const designConstraints = await readJson('../content/design-constraints.json')
const resourceEntryPoints = await readJson('../content/resource-entry-points.json')
const resourceEntryManifest = await readJson('../content/resource-entry-manifest.json')
const resourceEntryIndex = await readJson('../content/resource-entry-index.json')
const localMaterials = await readJson('../docs/local-materials/manifest.json')
const localPublicationReadiness = await readJson('../docs/local-materials/publication-readiness.json')
const usabilitySession = await readJson('../docs/product/usability-session-template.json')
const resourceHealth = await readJson('../docs/research/resource-health.json')
const errors = []
const ids = new Set()
const claimIds = new Set()
const stages = new Set(['体验意图', '核心系统', '最小原型', '测试与反馈', '规则与信息', '呈现与发布'])
const guideToolIds = new Set(['experience-intent', 'core-loop', 'redesign', 'test-plan', 'playtest-session', 'feedback', 'evidence-synthesis', 'playtest-selector', 'constraint-deck', 'balance-pass', 'decision-trace', 'shared-decision', 'theme-review', 'production-ledger', 'route-map', 'teaching-path', 'accessibility-observation', 'version-governance', 'prototype-scope', 'issue-to-system'])
const requiredResourceFields = ['id', 'title', 'creator', 'href', 'type', 'evidenceType', 'format', 'access', 'language', 'stages', 'useful', 'limitation', 'status', 'lastCheckedAt']
const resourceById = new Map(resources.map(resource => [resource.id, resource]))
const assessmentByResourceId = new Map(resourceAssessments.map(assessment => [assessment.resourceId, assessment]))

for (const [index, resource] of resources.entries()) {
  for (const field of requiredResourceFields) if (resource[field] === undefined || resource[field] === '') errors.push(`resources[${index}] missing ${field}`)
  if (ids.has(resource.id)) errors.push(`duplicate resource id: ${resource.id}`)
  ids.add(resource.id)
  if (!resource.href?.startsWith('https://')) errors.push(`${resource.id}: href must use https`)
  for (const stage of resource.stages || []) if (!stages.has(stage)) errors.push(`${resource.id}: unknown stage ${stage}`)
}

if (resourceIndex.length !== resources.length) errors.push(`resource index: expected ${resources.length} records, got ${resourceIndex.length}`)
for (const [index, resource] of resources.entries()) {
  const reference = resourceIndex[index]
  if (!reference || reference.id !== resource.id || reference.title !== resource.title || reference.href !== resource.href) {
    errors.push(`resource index: stale or reordered record at ${index}; rerun pnpm resources:index`)
  }
  if (reference && Object.keys(reference).some(field => !['id', 'title', 'href'].includes(field))) errors.push(`resource index: ${reference.id || index} contains non-reference fields`)
}

for (const [index, claim] of claims.entries()) {
  for (const field of ['id', 'statement', 'kind', 'sourceIds', 'confidence', 'counterexamples']) if (claim[field] === undefined) errors.push(`claims[${index}] missing ${field}`)
  for (const sourceId of claim.sourceIds || []) if (!ids.has(sourceId)) errors.push(`${claim.id}: unknown source ${sourceId}`)
  if (claimIds.has(claim.id)) errors.push(`duplicate claim id: ${claim.id}`)
  claimIds.add(claim.id)
}

const frameworkIds = new Set()
for (const [index, framework] of frameworks.entries()) {
  for (const field of ['id', 'name', 'shortName', 'sourceId', 'question', 'bestFor', 'notFor', 'status', 'inputs', 'moves', 'output', 'stages']) if (framework[field] === undefined || framework[field] === '') errors.push(`frameworks[${index}] missing ${field}`)
  if (frameworkIds.has(framework.id)) errors.push(`duplicate framework id: ${framework.id}`)
  frameworkIds.add(framework.id)
  if (!ids.has(framework.sourceId)) errors.push(`${framework.id}: unknown source ${framework.sourceId}`)
  if (!Array.isArray(framework.inputs) || framework.inputs.length < 2) errors.push(`${framework.id}: expected at least 2 inputs`)
  if (!Array.isArray(framework.moves) || framework.moves.length < 3) errors.push(`${framework.id}: expected at least 3 moves`)
  for (const [moveIndex, move] of (framework.moves || []).entries()) if (!move.label || !move.prompt) errors.push(`${framework.id}.moves[${moveIndex}] requires label and prompt`)
  for (const stage of framework.stages || []) if (!stages.has(stage)) errors.push(`${framework.id}: unknown stage ${stage}`)
}

const guideIds = new Set()
for (const [index, guide] of guides.entries()) {
  for (const field of ['id', 'title', 'stage', 'problem', 'outcome', 'coreMinutes', 'opening', 'steps', 'commonMistakes', 'whenToBreak', 'exercise', 'evidenceBoundary', 'resourceIds', 'claimIds', 'conceptIds', 'doneWhen', 'backtracksTo', 'nextOptions', 'toolIds', 'status']) {
    if (guide[field] === undefined || guide[field] === '') errors.push(`guides[${index}] missing ${field}`)
  }
  if (guideIds.has(guide.id)) errors.push(`duplicate guide id: ${guide.id}`)
  guideIds.add(guide.id)
  if (!stages.has(guide.stage)) errors.push(`${guide.id}: unknown stage ${guide.stage}`)
  if (!Number.isInteger(guide.coreMinutes) || guide.coreMinutes < 1) errors.push(`${guide.id}: coreMinutes must be a positive integer`)
  if (!Array.isArray(guide.steps) || guide.steps.length < 3 || guide.steps.length > 6) errors.push(`${guide.id}: expected 3–6 steps`)
  for (const [stepIndex, step] of (guide.steps || []).entries()) if (!step.label || !step.prompt || !step.example) errors.push(`${guide.id}.steps[${stepIndex}] requires label, prompt and example`)
  if (!Array.isArray(guide.commonMistakes) || guide.commonMistakes.length < 2) errors.push(`${guide.id}: expected at least 2 common mistakes`)
  for (const [mistakeIndex, item] of (guide.commonMistakes || []).entries()) if (!item.mistake || !item.repair) errors.push(`${guide.id}.commonMistakes[${mistakeIndex}] requires mistake and repair`)
  if (!guide.exercise?.title || !guide.exercise?.prompt || !guide.exercise?.exampleOutput) errors.push(`${guide.id}: incomplete exercise`)
  for (const resourceId of guide.resourceIds || []) if (!ids.has(resourceId)) errors.push(`${guide.id}: unknown resource ${resourceId}`)
  for (const claimId of guide.claimIds || []) if (!claimIds.has(claimId)) errors.push(`${guide.id}: unknown claim ${claimId}`)
  if (!Array.isArray(guide.toolIds)) errors.push(`${guide.id}: toolIds must be an array`)
  for (const toolId of guide.toolIds || []) if (!guideToolIds.has(toolId)) errors.push(`${guide.id}: unknown tool ${toolId}`)
  if (!Array.isArray(guide.doneWhen) || guide.doneWhen.length < 3) errors.push(`${guide.id}: expected at least 3 doneWhen signals`)
}
for (const guide of guides) {
  for (const linkedId of [...(guide.backtracksTo || []), ...(guide.nextOptions || [])]) if (!guideIds.has(linkedId)) errors.push(`${guide.id}: unknown linked guide ${linkedId}`)
}

const glossaryIds = new Set()
for (const [index, term] of glossary.entries()) {
  for (const field of ['id', 'term', 'aliases', 'definition', 'notThis', 'example', 'stages', 'guideIds', 'relatedIds', 'sourceIds', 'claimIds', 'status']) {
    if (term[field] === undefined || term[field] === '') errors.push(`glossary[${index}] missing ${field}`)
  }
  if (glossaryIds.has(term.id)) errors.push(`duplicate glossary id: ${term.id}`)
  glossaryIds.add(term.id)
  if (!Array.isArray(term.aliases)) errors.push(`${term.id}: aliases must be an array`)
  for (const stage of term.stages || []) if (!stages.has(stage)) errors.push(`${term.id}: unknown stage ${stage}`)
  for (const guideId of term.guideIds || []) if (!guideIds.has(guideId)) errors.push(`${term.id}: unknown guide ${guideId}`)
  for (const sourceId of term.sourceIds || []) if (!ids.has(sourceId)) errors.push(`${term.id}: unknown source ${sourceId}`)
  for (const claimId of term.claimIds || []) if (!claimIds.has(claimId)) errors.push(`${term.id}: unknown claim ${claimId}`)
}
for (const term of glossary) {
  for (const relatedId of term.relatedIds || []) if (!glossaryIds.has(relatedId)) errors.push(`${term.id}: unknown related concept ${relatedId}`)
}
if (glossaryIndex.length !== glossary.length) errors.push(`glossary index: expected ${glossary.length} records, got ${glossaryIndex.length}`)
for (const [index, term] of glossary.entries()) {
  const reference = glossaryIndex[index]
  if (!reference || reference.id !== term.id || reference.term !== term.term) errors.push(`glossary index: stale or reordered record at ${index}; rerun pnpm glossary:index`)
  if (reference && Object.keys(reference).some(field => !['id', 'term'].includes(field))) errors.push(`glossary index: ${reference.id || index} contains non-reference fields`)
}
for (const guide of guides) {
  if (!Array.isArray(guide.conceptIds) || guide.conceptIds.length < 4) errors.push(`${guide.id}: expected at least 4 linked concepts`)
  for (const conceptId of guide.conceptIds || []) if (!glossaryIds.has(conceptId)) errors.push(`${guide.id}: unknown concept ${conceptId}`)
}

const specialGuideIds = new Set()
for (const [index, guide] of specialGuides.entries()) {
  for (const field of ['id', 'title', 'stage', 'problem', 'outcome', 'coreMinutes', 'opening', 'steps', 'commonMistakes', 'whenToBreak', 'exercise', 'evidenceBoundary', 'resourceIds', 'claimIds', 'conceptIds', 'doneWhen', 'backtracksTo', 'nextOptions', 'toolIds', 'status']) {
    if (guide[field] === undefined || guide[field] === '') errors.push(`specialGuides[${index}] missing ${field}`)
  }
  if (guideIds.has(guide.id) || specialGuideIds.has(guide.id)) errors.push(`duplicate guide id: ${guide.id}`)
  specialGuideIds.add(guide.id)
  if (!stages.has(guide.stage)) errors.push(`${guide.id}: unknown stage ${guide.stage}`)
  if (!Number.isInteger(guide.coreMinutes) || guide.coreMinutes < 1) errors.push(`${guide.id}: coreMinutes must be a positive integer`)
  if (!Array.isArray(guide.steps) || guide.steps.length < 3 || guide.steps.length > 6) errors.push(`${guide.id}: expected 3–6 steps`)
  for (const [stepIndex, step] of (guide.steps || []).entries()) if (!step.label || !step.prompt || !step.example) errors.push(`${guide.id}.steps[${stepIndex}] requires label, prompt and example`)
  if (!Array.isArray(guide.commonMistakes) || guide.commonMistakes.length < 2) errors.push(`${guide.id}: expected at least 2 common mistakes`)
  for (const [mistakeIndex, item] of (guide.commonMistakes || []).entries()) if (!item.mistake || !item.repair) errors.push(`${guide.id}.commonMistakes[${mistakeIndex}] requires mistake and repair`)
  if (!guide.exercise?.title || !guide.exercise?.prompt || !guide.exercise?.exampleOutput) errors.push(`${guide.id}: incomplete exercise`)
  for (const resourceId of guide.resourceIds || []) if (!ids.has(resourceId)) errors.push(`${guide.id}: unknown resource ${resourceId}`)
  for (const claimId of guide.claimIds || []) if (!claimIds.has(claimId)) errors.push(`${guide.id}: unknown claim ${claimId}`)
  if (!Array.isArray(guide.conceptIds) || guide.conceptIds.length < 4) errors.push(`${guide.id}: expected at least 4 linked concepts`)
  for (const conceptId of guide.conceptIds || []) if (!glossaryIds.has(conceptId)) errors.push(`${guide.id}: unknown concept ${conceptId}`)
  if (!Array.isArray(guide.doneWhen) || guide.doneWhen.length < 3) errors.push(`${guide.id}: expected at least 3 doneWhen signals`)
  if (!Array.isArray(guide.toolIds)) errors.push(`${guide.id}: toolIds must be an array`)
  for (const toolId of guide.toolIds || []) if (!guideToolIds.has(toolId)) errors.push(`${guide.id}: unknown tool ${toolId}`)
}
const allGuideIds = new Set([...guideIds, ...specialGuideIds])
for (const guide of specialGuides) {
  for (const linkedId of [...(guide.backtracksTo || []), ...(guide.nextOptions || [])]) if (!allGuideIds.has(linkedId)) errors.push(`${guide.id}: unknown linked guide ${linkedId}`)
}

if (designConstraints.schemaVersion !== 1) errors.push('design constraints: unsupported schemaVersion')
if (!designConstraints.principle || !designConstraints.evidenceBoundary) errors.push('design constraints: principle and evidenceBoundary are required')
const designConstraintIds = new Set()
for (const groupName of ['observations', 'moves', 'boundaries']) {
  const group = designConstraints[groupName]
  if (!Array.isArray(group) || group.length < 6) errors.push(`design constraints: ${groupName} requires at least 6 cards`)
  for (const [index, card] of (group || []).entries()) {
    for (const field of ['id', 'label', 'prompt', 'conceptIds']) if (card[field] === undefined || card[field] === '') errors.push(`design constraints ${groupName}[${index}] missing ${field}`)
    if (designConstraintIds.has(card.id)) errors.push(`duplicate design constraint id: ${card.id}`)
    designConstraintIds.add(card.id)
    if (!Array.isArray(card.conceptIds) || card.conceptIds.length < 1) errors.push(`${card.id}: expected at least one linked concept`)
    for (const conceptId of card.conceptIds || []) if (!glossaryIds.has(conceptId)) errors.push(`${card.id}: unknown concept ${conceptId}`)
  }
}

const assessmentFields = ['resourceId', 'useModes', 'audienceLevels', 'reviewDepth', 'contextClarity', 'actionability', 'transferability', 'currencyRisk', 'rightsStatus', 'commercialContext', 'bestFor', 'doNotUseFor', 'reviewedAt', 'status']
const assessmentEnums = {
  useModes: new Set(['learn', 'diagnose', 'compare', 'lookup', 'case_study']),
  audienceLevels: new Set(['beginner', 'intermediate', 'advanced']),
  reviewDepth: new Set(['full_text', 'article_level', 'metadata_only']),
  contextClarity: new Set(['explicit', 'partial', 'weak']),
  actionability: new Set(['exercise', 'procedure', 'diagnostic', 'example', 'directory']),
  transferability: new Set(['broad', 'conditional', 'narrow']),
  currencyRisk: new Set(['low', 'medium', 'high']),
  rightsStatus: new Set(['reusable_license_verified', 'link_and_summarize', 'restricted']),
  commercialContext: new Set(['none_disclosed', 'creator_or_product_context', 'unknown'])
}
const assessedResourceIds = new Set()
for (const [index, assessment] of resourceAssessments.entries()) {
  for (const field of assessmentFields) if (assessment[field] === undefined || assessment[field] === '') errors.push(`resourceAssessments[${index}] missing ${field}`)
  if (!ids.has(assessment.resourceId)) errors.push(`resourceAssessments[${index}]: unknown resource ${assessment.resourceId}`)
  if (assessedResourceIds.has(assessment.resourceId)) errors.push(`duplicate resource assessment: ${assessment.resourceId}`)
  assessedResourceIds.add(assessment.resourceId)
  for (const field of ['useModes', 'audienceLevels']) {
    if (!Array.isArray(assessment[field]) || assessment[field].length === 0) errors.push(`${assessment.resourceId}: ${field} must be a non-empty array`)
    for (const value of assessment[field] || []) if (!assessmentEnums[field].has(value)) errors.push(`${assessment.resourceId}: invalid ${field} value ${value}`)
  }
  for (const field of ['reviewDepth', 'contextClarity', 'actionability', 'transferability', 'currencyRisk', 'rightsStatus', 'commercialContext']) {
    if (!assessmentEnums[field].has(assessment[field])) errors.push(`${assessment.resourceId}: invalid ${field} value ${assessment[field]}`)
  }
  if ('score' in assessment || 'rating' in assessment || 'totalScore' in assessment) errors.push(`${assessment.resourceId}: assessments must not contain aggregate scores`)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(assessment.reviewedAt || '')) errors.push(`${assessment.resourceId}: reviewedAt must be YYYY-MM-DD`)
}
for (const resourceId of ids) if (!assessedResourceIds.has(resourceId)) errors.push(`missing resource assessment: ${resourceId}`)

if (resourceEntryPoints.schemaVersion !== 1) errors.push('resource entry points: unsupported schemaVersion')
if (!resourceEntryPoints.principle) errors.push('resource entry points: missing principle')
const resourceEntryPointIds = new Set()
for (const [index, entry] of (resourceEntryPoints.entryPoints || []).entries()) {
  for (const field of ['id', 'title', 'question', 'outcome', 'resourceIds', 'evidenceBoundary']) if (entry[field] === undefined || entry[field] === '') errors.push(`resourceEntryPoints[${index}] missing ${field}`)
  if (resourceEntryPointIds.has(entry.id)) errors.push(`duplicate resource entry point: ${entry.id}`)
  resourceEntryPointIds.add(entry.id)
  if (!Array.isArray(entry.resourceIds) || entry.resourceIds.length < 4 || entry.resourceIds.length > 8) errors.push(`${entry.id}: expected 4–8 resources`)
  if (new Set(entry.resourceIds || []).size !== (entry.resourceIds || []).length) errors.push(`${entry.id}: duplicate resource id`)
  for (const resourceId of entry.resourceIds || []) if (!ids.has(resourceId)) errors.push(`${entry.id}: unknown resource ${resourceId}`)
}

const expectedEntryIds = (resourceEntryPoints.entryPoints || []).map(entry => entry.id)
const expectedEntryFiles = expectedEntryIds.map(id => `${id}.json`).sort()
const actualEntryFiles = (await readdir(new URL('../content/resource-entry-catalogs/', import.meta.url))).filter(filename => filename.endsWith('.json')).sort()
if (resourceEntryManifest.schemaVersion !== 1) errors.push('resource entry manifest: unsupported schemaVersion')
if (resourceEntryManifest.defaultEntryId !== expectedEntryIds[0]) errors.push('resource entry manifest: stale defaultEntryId; rerun pnpm resources:index')
if (JSON.stringify(resourceEntryManifest.entryIds) !== JSON.stringify(expectedEntryIds)) errors.push('resource entry manifest: stale or reordered entryIds; rerun pnpm resources:index')
const expectedEntryIndex = { schemaVersion: 1, principle: resourceEntryPoints.principle, entryPoints: resourceEntryPoints.entryPoints.map(({ id, title }) => ({ id, title })) }
if (JSON.stringify(resourceEntryIndex) !== JSON.stringify(expectedEntryIndex)) errors.push('resource entry index: stale or contains non-reference fields; rerun pnpm resources:index')
if (JSON.stringify(actualEntryFiles) !== JSON.stringify(expectedEntryFiles)) errors.push('resource entry packages: missing or stale files; rerun pnpm resources:index')
for (const entry of resourceEntryPoints.entryPoints || []) {
  const entryPackage = await readJson(`../content/resource-entry-catalogs/${entry.id}.json`)
  const expectedResources = entry.resourceIds.map(id => resourceById.get(id))
  const expectedAssessments = entry.resourceIds.map(id => assessmentByResourceId.get(id))
  if (entryPackage.schemaVersion !== 1) errors.push(`${entry.id}: entry package unsupported schemaVersion`)
  if (JSON.stringify(entryPackage.entry) !== JSON.stringify(entry)) errors.push(`${entry.id}: stale entry metadata; rerun pnpm resources:index`)
  if (JSON.stringify(entryPackage.resources) !== JSON.stringify(expectedResources)) errors.push(`${entry.id}: stale packaged resources; rerun pnpm resources:index`)
  if (JSON.stringify(entryPackage.resourceAssessments) !== JSON.stringify(expectedAssessments)) errors.push(`${entry.id}: stale packaged assessments; rerun pnpm resources:index`)
}

if (resourceEvaluationRubric.schemaVersion !== 1) errors.push('resource evaluation rubric: unsupported schemaVersion')
if (!resourceEvaluationRubric.principle) errors.push('resource evaluation rubric: missing principle')
const rubricDimensionIds = new Set((resourceEvaluationRubric.dimensions || []).map(dimension => dimension.id))
for (const field of Object.keys(assessmentEnums)) if (!rubricDimensionIds.has(field)) errors.push(`resource evaluation rubric: missing dimension ${field}`)
for (const [index, dimension] of (resourceEvaluationRubric.dimensions || []).entries()) {
  if (!dimension.id || !dimension.label || !dimension.question || !dimension.options) errors.push(`resource evaluation rubric dimensions[${index}] is incomplete`)
}

if (localMaterials.schemaVersion !== 1) errors.push('local materials manifest: unsupported schemaVersion')
if (localMaterials.count !== localMaterials.records?.length) errors.push('local materials manifest: count does not match records')
if (localMaterials.policy?.originalFilesCopiedToRepository !== false) errors.push('local materials manifest: original files must not be copied')
for (const [index, record] of (localMaterials.records || []).entries()) {
  for (const field of ['collectionId', 'relativePath', 'format', 'bytes', 'modifiedAt', 'sha256', 'privacy', 'publication']) {
    if (record[field] === undefined || record[field] === '') errors.push(`localMaterials.records[${index}] missing ${field}`)
  }
  if (record.relativePath?.startsWith('/') || record.relativePath?.includes('../')) errors.push(`localMaterials.records[${index}]: path must stay relative`)
  if (!/^[a-f0-9]{64}$/.test(record.sha256 || '')) errors.push(`localMaterials.records[${index}]: invalid sha256`)
  if (record.privacy !== 'internal_course_material') errors.push(`localMaterials.records[${index}]: unexpected privacy class`)
  if (record.publication !== 'summary_only_until_rights_reviewed') errors.push(`localMaterials.records[${index}]: unexpected publication class`)
}

if (localPublicationReadiness.schemaVersion !== 1) errors.push('local publication readiness: unsupported schemaVersion')
if (localPublicationReadiness.policy?.defaultDecision !== 'internal_reference_only') errors.push('local publication readiness: default must remain internal_reference_only')
if (localPublicationReadiness.policy?.sourceFileDirectPublicationAllowed !== false) errors.push('local publication readiness: direct source publication must remain disabled')
if ((localPublicationReadiness.publicationCandidates || []).length !== 0) errors.push('local publication readiness: source files must not be silently approved')
const localMaterialKeys = new Set((localMaterials.records || []).map(record => `${record.collectionId}/${record.relativePath}`))
const readinessMaterialKeys = new Set(localPublicationReadiness.materials || [])
if (readinessMaterialKeys.size !== localMaterialKeys.size || [...localMaterialKeys].some(key => !readinessMaterialKeys.has(key))) errors.push('local publication readiness: materials must match manifest one-to-one')

if (usabilitySession.schemaVersion !== 1) errors.push('usability session template: unsupported schemaVersion')
if (usabilitySession.tasks?.map(task => task.id).join(',') !== 'T1,T2,T3,T4') errors.push('usability session template: expected T1–T4')
if (usabilitySession.privacy?.consentRecorded !== false) errors.push('usability session template: consent must default to false')

if (resourceHealth.schemaVersion !== 1) errors.push('resource health: unsupported schemaVersion')
if (!/^\d{4}-\d{2}-\d{2}T/.test(resourceHealth.generatedAt || '')) errors.push('resource health: generatedAt must be an ISO datetime')
if (resourceHealth.policy?.automatedDeletion !== false) errors.push('resource health: automated deletion must remain disabled')
const healthResourceIds = new Set()
const healthOutcomes = new Set(['reachable', 'blocked', 'dead', 'error'])
for (const [index, result] of (resourceHealth.results || []).entries()) {
  for (const field of ['resourceId', 'url', 'finalUrl', 'status', 'outcome', 'checkedAt', 'note']) if (!(field in result)) errors.push(`resource health results[${index}] missing ${field}`)
  if (!ids.has(result.resourceId)) errors.push(`resource health: unknown resource ${result.resourceId}`)
  if (healthResourceIds.has(result.resourceId)) errors.push(`resource health: duplicate resource ${result.resourceId}`)
  healthResourceIds.add(result.resourceId)
  if (!healthOutcomes.has(result.outcome)) errors.push(`resource health: invalid outcome ${result.outcome}`)
}
for (const resourceId of ids) if (!healthResourceIds.has(resourceId)) errors.push(`resource health: missing result for ${resourceId}; rerun pnpm resources:health`)
for (const outcome of healthOutcomes) {
  const actual = (resourceHealth.results || []).filter(result => result.outcome === outcome).length
  if (resourceHealth.counts?.[outcome] !== actual) errors.push(`resource health: ${outcome} count does not match results`)
}

if (resources.length < 116) errors.push(`expected at least 116 curated resources, got ${resources.length}`)
if (claims.length < 56) errors.push(`expected at least 56 traceable claims, got ${claims.length}`)
if (frameworks.length < 5) errors.push(`expected at least 5 theory frameworks, got ${frameworks.length}`)
if (guides.length < 6) errors.push(`expected at least 6 core guides, got ${guides.length}`)
if (specialGuides.length < 7) errors.push(`expected at least 7 special guides, got ${specialGuides.length}`)
if (glossary.length < 44) errors.push(`expected at least 44 glossary terms, got ${glossary.length}`)
if (resourceAssessments.length !== resources.length) errors.push(`expected exactly one assessment per resource, got ${resourceAssessments.length} assessments for ${resources.length} resources`)
for (const stage of stages) if (guides.filter(guide => guide.stage === stage).length !== 1) errors.push(`expected exactly one core guide for stage ${stage}`)
if (localMaterials.records?.length < 50) errors.push(`expected at least 50 local material records, got ${localMaterials.records?.length || 0}`)
if (errors.length) {
  console.error(errors.join('\n'))
  process.exit(1)
}

console.log(`content ok: ${resources.length} resources, ${resourceEntryPointIds.size} resource entry points, ${claims.length} claims, ${frameworks.length} frameworks, ${guides.length} core guides, ${specialGuides.length} special guides, ${glossary.length} terms, ${resourceAssessments.length} assessments, ${designConstraintIds.size} design constraint cards, ${localMaterials.records.length} local files`)
