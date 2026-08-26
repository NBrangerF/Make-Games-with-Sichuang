import { readFile } from 'node:fs/promises'

const root = new URL('../docs/product/', import.meta.url)
const template = JSON.parse(await readFile(new URL('design-aid-loop-session-template.json', root), 'utf8'))
const example = JSON.parse(await readFile(new URL('design-aid-loop-session-example.json', root), 'utf8'))
const schema = JSON.parse(await readFile(new URL('design-aid-loop-session-schema.json', root), 'utf8'))

const taskIds = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6']
const taskDataKeys = {
  T1: ['desiredArtifact', 'chosenMode', 'modeChangedAfterPreview'],
  T2: ['promptAction', 'refusalAvailable', 'authoredPromptUsed'],
  T3: ['ruleArtifactProduced', 'supportingSignalWritten', 'counterSignalWritten'],
  T4: ['symptomRewrittenAsSituation', 'observedActionWritten', 'counterSignalWritten'],
  T5: ['evidenceState', 'actualTargetParticipantsPresent', 'selfTestLabeledAsExternal'],
  T6: ['sharePreviewOpened', 'privateReflectionIncluded', 'privateReflectionDeleted']
}
const prohibitedKeys = new Set([
  'score', 'rating', 'totalScore', 'participantName', 'realName', 'email', 'phone',
  'contact', 'recordingUrl', 'recordingPath', 'rawTranscript', 'birthDate'
])

function clone(value) {
  return structuredClone(value)
}

function scanKeys(value, path = '$', errors = []) {
  if (!value || typeof value !== 'object') return errors
  for (const [key, child] of Object.entries(value)) {
    if (prohibitedKeys.has(key)) errors.push(`${path}.${key}: prohibited identity, recording, transcript, or aggregate-score field`)
    scanKeys(child, `${path}.${key}`, errors)
  }
  return errors
}

function exactKeys(value, expected, path, errors) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    errors.push(`${path}: expected object`)
    return
  }
  const actual = Object.keys(value)
  for (const key of expected) if (!(key in value)) errors.push(`${path}: missing ${key}`)
  for (const key of actual) if (!expected.includes(key)) errors.push(`${path}.${key}: unexpected field`)
}

function validate(record) {
  const errors = scanKeys(record)
  exactKeys(record, ['schemaVersion', 'method', 'sessionStatus', 'prototypeVersion', 'participantAlias', 'consent', 'privacy', 'tasks', 'sessionSummary'], '$', errors)
  if (record.schemaVersion !== 1) errors.push('$.schemaVersion: expected 1')
  if (record.method !== 'moderated-design-aid-loop-usability') errors.push('$.method: unsupported method')
  if (!['blank', 'completed'].includes(record.sessionStatus)) errors.push('$.sessionStatus: expected blank or completed')

  exactKeys(record.consent, ['participation', 'notes', 'withdrawalExplained', 'screenRecording'], '$.consent', errors)
  exactKeys(record.privacy, ['containsRealName', 'containsContactDetails', 'containsRawRecording', 'localOnly', 'privateReflectionRecorded', 'privateReflectionExcludedFromShare', 'deleteBy'], '$.privacy', errors)
  if (record.consent?.screenRecording !== false) errors.push('$.consent.screenRecording: raw recording is outside this package')
  for (const key of ['containsRealName', 'containsContactDetails', 'containsRawRecording']) if (record.privacy?.[key] !== false) errors.push(`$.privacy.${key}: must remain false`)
  if (record.privacy?.localOnly !== true) errors.push('$.privacy.localOnly: must remain true')
  if (record.privacy?.privateReflectionExcludedFromShare !== true) errors.push('$.privacy.privateReflectionExcludedFromShare: must remain true')

  if (!Array.isArray(record.tasks) || record.tasks.length !== 6) {
    errors.push('$.tasks: expected exactly T1–T6')
  } else {
    const actualIds = record.tasks.map(task => task.taskId)
    if (actualIds.join(',') !== taskIds.join(',')) errors.push('$.tasks: tasks must be unique and ordered T1–T6')
    for (const [index, task] of record.tasks.entries()) {
      const path = `$.tasks[${index}]`
      exactKeys(task, ['taskId', 'status', 'observedActions', 'participantWords', 'firstDeviation', 'facilitatorIntervention', 'severity', 'candidateRepair', 'retestRequired', 'taskData'], path, errors)
      if (!['not_started', 'completed'].includes(task.status)) errors.push(`${path}.status: unsupported status`)
      if (!Array.isArray(task.observedActions) || !Array.isArray(task.participantWords)) errors.push(`${path}: actions and words must be arrays`)
      if (!['none', 'minor', 'serious', 'critical'].includes(task.severity)) errors.push(`${path}.severity: unsupported severity`)
      exactKeys(task.taskData, taskDataKeys[task.taskId] || [], `${path}.taskData`, errors)
      if (['serious', 'critical'].includes(task.severity) && (!task.candidateRepair?.trim() || task.retestRequired !== true)) errors.push(`${path}: serious or critical issue requires a repair and retest`)
    }
  }

  exactKeys(record.sessionSummary, ['criticalIssues', 'seriousIssues', 'repairsBeforeRetest', 'nextResearchStep', 'rationale'], '$.sessionSummary', errors)
  if (!['hold', 'repair_and_retest', 'add_session'].includes(record.sessionSummary?.nextResearchStep)) errors.push('$.sessionSummary.nextResearchStep: unsupported next step')
  for (const key of ['criticalIssues', 'seriousIssues', 'repairsBeforeRetest']) if (!Array.isArray(record.sessionSummary?.[key])) errors.push(`$.sessionSummary.${key}: expected array`)

  if (record.sessionStatus === 'blank') {
    if (record.participantAlias !== '') errors.push('$.participantAlias: blank template must not contain an alias')
    if (record.consent && Object.values(record.consent).some(Boolean)) errors.push('$.consent: blank template must be unconsented')
    if (record.tasks?.some(task => task.status !== 'not_started')) errors.push('$.tasks: blank template tasks must be not_started')
  }

  if (record.sessionStatus === 'completed') {
    if (!/^P\d{2,4}$/.test(record.participantAlias || '')) errors.push('$.participantAlias: use a non-identifying alias such as P01')
    for (const key of ['participation', 'notes', 'withdrawalExplained']) if (record.consent?.[key] !== true) errors.push(`$.consent.${key}: required before a completed session`)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(record.privacy?.deleteBy || '')) errors.push('$.privacy.deleteBy: completed records need a YYYY-MM-DD deletion date')
    if (record.tasks?.some(task => task.status !== 'completed')) errors.push('$.tasks: a completed session must cover all T1–T6 tasks')

    const byId = Object.fromEntries((record.tasks || []).map(task => [task.taskId, task]))
    const t1 = byId.T1?.taskData
    if (!t1?.desiredArtifact?.trim() || !['generate', 'diagnose', 'prototype', 'practice_loop'].includes(t1?.chosenMode)) errors.push('T1: record desired artifact and one tested mode')
    const t2 = byId.T2?.taskData
    if (!['accept', 'swap', 'self_write'].includes(t2?.promptAction) || t2?.refusalAvailable !== true) errors.push('T2: record an action and confirm refusal was available')
    const t3 = byId.T3?.taskData
    if (![t3?.ruleArtifactProduced, t3?.supportingSignalWritten, t3?.counterSignalWritten].every(Boolean)) errors.push('T3: rule artifact and both evidence signals are required')
    const t4 = byId.T4?.taskData
    if (![t4?.symptomRewrittenAsSituation, t4?.observedActionWritten, t4?.counterSignalWritten].every(Boolean)) errors.push('T4: diagnosis must reach situation, action, and counter-signal')
    const t5 = byId.T5?.taskData
    if (!['preparation', 'self_test', 'external_test'].includes(t5?.evidenceState)) errors.push('T5: evidence state must be explicit')
    if (t5?.selfTestLabeledAsExternal !== false) errors.push('T5: self-test must never be relabeled as external evidence')
    if (t5?.evidenceState === 'external_test' && t5?.actualTargetParticipantsPresent !== true) errors.push('T5: external evidence requires actual target participants')
    const t6 = byId.T6?.taskData
    if (t6?.sharePreviewOpened !== true || t6?.privateReflectionIncluded !== false) errors.push('T6: inspect share preview and exclude private reflection')

    const seriousTasks = (record.tasks || []).filter(task => task.severity === 'serious')
    const criticalTasks = (record.tasks || []).filter(task => task.severity === 'critical')
    if (seriousTasks.length !== record.sessionSummary?.seriousIssues?.length) errors.push('$.sessionSummary.seriousIssues: must correspond one-to-one with serious task findings')
    if (criticalTasks.length !== record.sessionSummary?.criticalIssues?.length) errors.push('$.sessionSummary.criticalIssues: must correspond one-to-one with critical task findings')
    if ((seriousTasks.length || criticalTasks.length) && record.sessionSummary?.nextResearchStep !== 'repair_and_retest') errors.push('$.sessionSummary.nextResearchStep: serious or critical issues require repair_and_retest')
    if ((seriousTasks.length || criticalTasks.length) && !record.sessionSummary?.repairsBeforeRetest?.length) errors.push('$.sessionSummary.repairsBeforeRetest: unresolved serious issues require planned repairs')
  }

  return errors
}

const checks = []
function expect(name, record, shouldPass, expectedFragment = '') {
  const errors = validate(record)
  const ok = shouldPass ? errors.length === 0 : errors.some(error => error.includes(expectedFragment))
  checks.push({ name, ok, detail: errors.length ? errors.join(' | ') : 'valid' })
}

expect('safe blank template', template, true)
expect('fictional completed example', example, true)

const cases = [
  ['reject real names', record => { record.privacy.containsRealName = true }, 'containsRealName'],
  ['reject contact details', record => { record.email = 'person@example.invalid' }, 'prohibited'],
  ['reject recordings', record => { record.consent.screenRecording = true }, 'screenRecording'],
  ['reject aggregate scores', record => { record.sessionSummary.totalScore = 6 }, 'prohibited'],
  ['reject incomplete T1–T6 coverage', record => { record.tasks.pop() }, 'exactly T1–T6'],
  ['reject unresolved serious issue', record => { record.tasks[3].candidateRepair = '' }, 'requires a repair and retest'],
  ['reject false external evidence', record => { record.tasks[4].taskData.evidenceState = 'external_test' }, 'actual target participants'],
  ['reject self-test relabeling', record => { record.tasks[4].taskData.selfTestLabeledAsExternal = true }, 'never be relabeled'],
  ['reject private reflection sharing', record => { record.tasks[5].taskData.privateReflectionIncluded = true }, 'exclude private reflection'],
  ['reject missing withdrawal explanation', record => { record.consent.withdrawalExplained = false }, 'required before a completed session'],
  ['reject identifying alias', record => { record.participantAlias = 'Shawn' }, 'non-identifying alias'],
  ['reject publish-like advance after serious issue', record => { record.sessionSummary.nextResearchStep = 'add_session' }, 'repair_and_retest']
]
for (const [name, mutate, fragment] of cases) {
  const record = clone(example)
  mutate(record)
  expect(name, record, false, fragment)
}

if (schema.$schema !== 'https://json-schema.org/draft/2020-12/schema' || schema.properties?.schemaVersion?.const !== 1) checks.push({ name: 'schema metadata', ok: false, detail: 'schema draft or version mismatch' })
else checks.push({ name: 'schema metadata', ok: true, detail: 'draft 2020-12, schemaVersion 1' })

const failed = checks.filter(check => !check.ok)
for (const check of checks) console.log(`${check.ok ? 'PASS' : 'FAIL'}  ${check.name}: ${check.detail}`)
console.log(`\n${checks.length - failed.length}/${checks.length} design-aid session checks passed.`)
if (failed.length) process.exitCode = 1
