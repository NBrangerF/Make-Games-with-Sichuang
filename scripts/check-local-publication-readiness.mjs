import { readFile } from 'node:fs/promises'

const readJson = async path => JSON.parse(await readFile(new URL(path, import.meta.url), 'utf8'))
const manifest = await readJson('../docs/local-materials/manifest.json')
const readiness = await readJson('../docs/local-materials/publication-readiness.json')

const failures = []
let guards = 0
const assert = (condition, message) => {
  guards += 1
  if (!condition) failures.push(message)
}

const manifestKeys = (manifest.records || []).map(record => `${record.collectionId}/${record.relativePath}`)
const manifestKeySet = new Set(manifestKeys)
const materialKeys = readiness.materials || []
const materialKeySet = new Set(materialKeys)
const requiredGates = readiness.requiredGates || []
const gateStates = new Set(readiness.allowedValues?.gateState || [])
const decisions = new Set(readiness.allowedValues?.decision || [])
const profiles = readiness.profiles || []
const profileCollections = new Set(profiles.map(profile => profile.collectionId))
const manifestCollections = new Set((manifest.scope || []).map(collection => collection.id))

assert(readiness.schemaVersion === 1, 'schemaVersion must be 1')
assert(/^\d{4}-\d{2}-\d{2}$/.test(readiness.reviewedAt || ''), 'reviewedAt must be YYYY-MM-DD')
assert(readiness.policy?.defaultDecision === 'internal_reference_only', 'default decision must remain internal_reference_only')
assert(readiness.policy?.derivedUse === 'original_summary_only', 'derived use must remain original_summary_only')
assert(readiness.policy?.sourceFileDirectPublicationAllowed === false, 'source files must not be directly publishable')
assert(readiness.policy?.originalFilesCopiedToRepository === false, 'original files must not be copied into the repository')
assert(readiness.policy?.scoresOrAutomaticClearance === false, 'scores and automatic clearance must stay disabled')
assert(materialKeys.length === manifestKeys.length && materialKeySet.size === manifestKeySet.size && manifestKeys.every(key => materialKeySet.has(key)), 'readiness materials must match the manifest one-to-one')
assert(profileCollections.size === manifestCollections.size && [...manifestCollections].every(id => profileCollections.has(id)), 'every manifest collection must have exactly one review profile')
assert(profiles.every(profile => decisions.has(profile.decision) && profile.decision === 'internal_reference_only'), 'all current profiles must remain internal reference only')
assert(profiles.every(profile => requiredGates.every(gate => gate in (profile.gates || {}) && gateStates.has(profile.gates[gate]))), 'every profile must contain every required gate with an allowed state')
assert(profiles.every(profile => Object.values(profile.gates || {}).includes('unresolved')), 'no profile may be silently cleared without resolving its gates')

const serialized = JSON.stringify(readiness)
assert(!/\/Users\/|file:\/\/|[A-Za-z]:\\/.test(serialized), 'readiness data must not expose absolute local paths')
assert(!/(rawText|extractedText|transcript|originalContent)"\s*:/.test(serialized), 'readiness data must not contain copied source content fields')

const candidateErrors = candidate => {
  const errors = []
  if (!manifestKeySet.has(candidate.materialKey)) errors.push('unknown material')
  if (candidate.decision !== 'approved_for_publication') errors.push('not approved')
  if (!candidate.publicCopyId || !/^[a-f0-9]{64}$/.test(candidate.publicCopySha256 || '')) errors.push('missing frozen public copy')
  if (!/^\d{4}-\d{2}-\d{2}$/.test(candidate.reviewedAt || '')) errors.push('missing review date')
  if (!candidate.reviewerRole || !candidate.withdrawalOwner) errors.push('missing accountable roles')
  for (const gate of requiredGates) if (!candidate.gateEvidence?.[gate]) errors.push(`missing gate evidence: ${gate}`)
  return errors
}

const exampleCandidate = {
  materialKey: manifestKeys[0],
  decision: 'approved_for_publication',
  publicCopyId: 'public-copy-example',
  publicCopySha256: 'a'.repeat(64),
  reviewedAt: readiness.reviewedAt,
  reviewerRole: 'rights-reviewer',
  withdrawalOwner: 'publication-owner',
  gateEvidence: Object.fromEntries(requiredGates.map(gate => [gate, `evidence-${gate}`])),
}
assert(candidateErrors(exampleCandidate).length === 0, 'a structurally complete candidate should pass the gate function')
const missingGateCandidate = structuredClone(exampleCandidate)
delete missingGateCandidate.gateEvidence.minorSafeguarding
assert(candidateErrors(missingGateCandidate).some(error => error.includes('minorSafeguarding')), 'minor safeguarding evidence must be required')
const missingCopyCandidate = { ...exampleCandidate, publicCopyId: '', publicCopySha256: '' }
assert(candidateErrors(missingCopyCandidate).includes('missing frozen public copy'), 'a frozen public copy and hash must be required')
assert((readiness.publicationCandidates || []).every(candidate => candidateErrors(candidate).length === 0), 'all recorded publication candidates must pass every gate')
assert((readiness.publicationCandidates || []).length === 0, 'this audit must not silently approve any current source file')

if (failures.length) {
  console.error(failures.join('\n'))
  process.exit(1)
}

console.log(`local publication readiness ok: ${materialKeys.length} materials, ${profiles.length} profiles, ${guards} guards`)
