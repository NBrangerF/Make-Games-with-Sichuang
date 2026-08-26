import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const productRoot = new URL('../docs/product/', import.meta.url)
const loadProductJson = async name => JSON.parse(await readFile(new URL(name, productRoot), 'utf8'))
const campaignTemplate = await loadProductJson('beginner-usability-campaign-template.json')
const sessionTemplate = await loadProductJson('beginner-usability-session-template.json')
const fictionalExample = await loadProductJson('beginner-usability-session-example.json')
const schema = await loadProductJson('beginner-usability-session-schema.json')
const handbook = await readFile(new URL('BEGINNER_USABILITY_CAMPAIGN.md', productRoot), 'utf8')

const taskIds = ['N1', 'R1', 'W1', 'D1']
const expectedCategories = ['experience_intent_records', 'core_loop_records', 'prototype_scope_records', 'test_plans', 'playtest_sessions']
const taskDataKeys = {
  N1: ['destinationHash', 'stageFound', 'nextStepExplained', 'elapsedSeconds', 'taskHelpCount', 'neutralPromptCount', 'unassisted'],
  R1: ['entryPoint', 'resourceTitle', 'fitExplained', 'boundaryExplained', 'rankingMisread', 'elapsedSeconds', 'taskHelpCount', 'unassisted'],
  W1: ['experienceIntentRecordId', 'coreLoopRecordId', 'prototypeScopeRecordId', 'testPlanRecordId', 'playtestSessionRecordId', 'mainQuestion', 'observablePrediction', 'counterSignal', 'explicitHandoffs', 'scriptedEventLabeledAsDrill', 'elapsedSeconds', 'taskHelpCount', 'unassisted'],
  D1: ['routeRestored', 'recordsRestored', 'projectExportDownloaded', 'expectedCategories', 'localBoundaryExplained', 'recordCountMisreadAsQuality', 'elapsedSeconds', 'taskHelpCount', 'unassisted']
}
const prohibitedKeys = new Set([
  'score', 'rating', 'totalScore', 'participantName', 'realName', 'email', 'phone', 'contact',
  'rawTranscript', 'transcript', 'recordingUrl', 'recordingPath', 'birthDate', 'age', 'gender',
  'school', 'employer'
])

const clone = value => structuredClone(value)
const nonEmpty = value => typeof value === 'string' && value.trim().length > 0

function scanKeys(value, path = '$', errors = []) {
  if (!value || typeof value !== 'object') return errors
  for (const [key, child] of Object.entries(value)) {
    if (prohibitedKeys.has(key)) errors.push(`${path}.${key}: prohibited identity, demographic, transcript, recording, or aggregate-score field`)
    scanKeys(child, `${path}.${key}`, errors)
  }
  return errors
}

function exactKeys(value, expected, path, errors) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    errors.push(`${path}: expected object`)
    return
  }
  for (const key of expected) if (!(key in value)) errors.push(`${path}: missing ${key}`)
  for (const key of Object.keys(value)) if (!expected.includes(key)) errors.push(`${path}.${key}: unexpected field`)
}

function validateCampaign(record) {
  const errors = scanKeys(record)
  exactKeys(record, ['schemaVersion', 'method', 'evidenceClass', 'campaignStatus', 'productVersion', 'objective', 'rounds', 'charterGates', 'sessionFiles', 'revisionLog', 'privacy', 'decision'], '$', errors)
  if (record.schemaVersion !== 1) errors.push('$.schemaVersion: expected 1')
  if (record.method !== 'two-round-beginner-resource-site-usability') errors.push('$.method: unsupported campaign method')
  if (record.evidenceClass !== 'blank_template') errors.push('$.evidenceClass: committed campaign file must remain a blank template until real sessions are collected')
  if (record.campaignStatus !== 'planned') errors.push('$.campaignStatus: template must remain planned')
  if (!Array.isArray(record.rounds) || record.rounds.map(round => round.roundId).join(',') !== 'pilot,confirmation') errors.push('$.rounds: expected ordered pilot and confirmation rounds')
  else {
    for (const [index, round] of record.rounds.entries()) {
      exactKeys(round, ['roundId', 'status', 'participantMin', 'participantMax', 'fullTrackMin', 'newToVersionRequired', 'changePolicy'], `$.rounds[${index}]`, errors)
      if (round.newToVersionRequired !== true) errors.push(`$.rounds[${index}].newToVersionRequired: must be true`)
    }
    const [pilot, confirmation] = record.rounds
    if (pilot.participantMin !== 2 || pilot.participantMax !== 3 || pilot.fullTrackMin !== 2) errors.push('$.rounds[0]: pilot must plan 2–3 people with at least 2 full tracks')
    if (confirmation.participantMin !== 5 || confirmation.participantMax !== 7 || confirmation.fullTrackMin !== 4) errors.push('$.rounds[1]: confirmation must plan 5–7 people with at least 4 full tracks')
    if (confirmation.status !== 'locked_until_repairs') errors.push('$.rounds[1].status: confirmation must remain locked until pilot repairs')
  }

  exactKeys(record.charterGates, ['newcomerContentFindersMin', 'independentFullLoopsMin', 'quickTasks', 'fullTasks', 'quickStartSecondsMax', 'unresolvedCriticalMax', 'unresolvedSeriousMax', 'fictionalEvidenceMayCount'], '$.charterGates', errors)
  if (record.charterGates?.newcomerContentFindersMin !== 5) errors.push('$.charterGates.newcomerContentFindersMin: expected 5')
  if (record.charterGates?.independentFullLoopsMin !== 4) errors.push('$.charterGates.independentFullLoopsMin: expected 4')
  if (record.charterGates?.quickTasks?.join(',') !== 'N1,R1') errors.push('$.charterGates.quickTasks: expected N1,R1')
  if (record.charterGates?.fullTasks?.join(',') !== taskIds.join(',')) errors.push('$.charterGates.fullTasks: expected N1,R1,W1,D1')
  if (record.charterGates?.quickStartSecondsMax !== 900) errors.push('$.charterGates.quickStartSecondsMax: expected 900')
  if (record.charterGates?.fictionalEvidenceMayCount !== false) errors.push('$.charterGates.fictionalEvidenceMayCount: must be false')
  if (!Array.isArray(record.sessionFiles) || record.sessionFiles.length) errors.push('$.sessionFiles: committed template must not claim participant evidence')
  if (!Array.isArray(record.revisionLog) || record.revisionLog.length) errors.push('$.revisionLog: committed template must not claim completed revisions')

  exactKeys(record.privacy, ['realNamesAllowed', 'contactDetailsAllowed', 'rawRecordingAllowed', 'aggregateScoreAllowed', 'withdrawalMustBeTraceableByAlias'], '$.privacy', errors)
  for (const key of ['realNamesAllowed', 'contactDetailsAllowed', 'rawRecordingAllowed', 'aggregateScoreAllowed']) if (record.privacy?.[key] !== false) errors.push(`$.privacy.${key}: must be false`)
  if (record.privacy?.withdrawalMustBeTraceableByAlias !== true) errors.push('$.privacy.withdrawalMustBeTraceableByAlias: must be true')
  exactKeys(record.decision, ['state', 'unassistedNewcomerFinders', 'independentFullLoops', 'unresolvedCriticalIssues', 'unresolvedSeriousIssues', 'nextStep', 'rationale'], '$.decision', errors)
  if (record.decision?.state !== 'not_assessed' || record.decision?.nextStep !== 'run_pilot') errors.push('$.decision: template cannot pre-claim evidence or advancement')
  for (const key of ['unassistedNewcomerFinders', 'independentFullLoops', 'unresolvedCriticalIssues', 'unresolvedSeriousIssues']) if (record.decision?.[key] !== 0) errors.push(`$.decision.${key}: template must start at 0`)
  return errors
}

function validateSession(record) {
  const errors = scanKeys(record)
  exactKeys(record, ['schemaVersion', 'method', 'evidenceClass', 'sessionStatus', 'campaignRound', 'productVersion', 'participant', 'consent', 'privacy', 'environment', 'tasks', 'sessionSummary'], '$', errors)
  if (record.schemaVersion !== 1) errors.push('$.schemaVersion: expected 1')
  if (record.method !== 'moderated-beginner-resource-site-usability') errors.push('$.method: unsupported session method')
  if (!['blank_template', 'fictional_example', 'participant_session'].includes(record.evidenceClass)) errors.push('$.evidenceClass: unsupported evidence class')
  if (!['blank', 'recorded'].includes(record.sessionStatus)) errors.push('$.sessionStatus: expected blank or recorded')
  if (!['not_assigned', 'pilot', 'confirmation'].includes(record.campaignRound)) errors.push('$.campaignRound: unsupported round')

  exactKeys(record.participant, ['alias', 'track', 'tabletopDesignExperience', 'usedSiteVersionBefore', 'supportConfiguration'], '$.participant', errors)
  if (!['not_assigned', 'quick', 'full'].includes(record.participant?.track)) errors.push('$.participant.track: unsupported track')
  if (!['not_recorded', 'none', 'one_project', 'two_projects'].includes(record.participant?.tabletopDesignExperience)) errors.push('$.participant.tabletopDesignExperience: unsupported experience band')
  if (!Array.isArray(record.participant?.supportConfiguration)) errors.push('$.participant.supportConfiguration: expected array')

  exactKeys(record.consent, ['participation', 'deidentifiedNotes', 'withdrawalExplained', 'screenRecording', 'audioRecording'], '$.consent', errors)
  if (record.consent?.screenRecording !== false || record.consent?.audioRecording !== false) errors.push('$.consent: raw audio or screen recording is outside this campaign package')
  exactKeys(record.privacy, ['containsRealName', 'containsContactDetails', 'containsRawRecording', 'localOnly', 'deleteBy'], '$.privacy', errors)
  for (const key of ['containsRealName', 'containsContactDetails', 'containsRawRecording']) if (record.privacy?.[key] !== false) errors.push(`$.privacy.${key}: must remain false`)
  if (record.privacy?.localOnly !== true) errors.push('$.privacy.localOnly: must be true')

  exactKeys(record.environment, ['baseUrl', 'buildId', 'device', 'browser', 'viewport', 'inputMode', 'routeAtStart', 'disposableProfileConfirmed'], '$.environment', errors)
  if (record.environment?.routeAtStart !== '#path') errors.push('$.environment.routeAtStart: expected #path')

  if (!Array.isArray(record.tasks) || record.tasks.length !== 4) errors.push('$.tasks: expected exactly N1,R1,W1,D1')
  else if (record.tasks.map(task => task.taskId).join(',') !== taskIds.join(',')) errors.push('$.tasks: tasks must be unique and ordered N1,R1,W1,D1')
  else {
    for (const [index, task] of record.tasks.entries()) {
      const path = `$.tasks[${index}]`
      exactKeys(task, ['taskId', 'status', 'startedAt', 'endedAt', 'observedActions', 'participantWords', 'firstDeviation', 'recovery', 'interventions', 'severity', 'candidateCause', 'candidateRepair', 'retestRequired', 'taskData'], path, errors)
      if (!['not_started', 'completed', 'partial', 'blocked'].includes(task.status)) errors.push(`${path}.status: unsupported status`)
      if (!['none', 'recoverable', 'serious', 'critical'].includes(task.severity)) errors.push(`${path}.severity: unsupported severity`)
      if (!Array.isArray(task.observedActions) || !Array.isArray(task.participantWords) || !Array.isArray(task.interventions)) errors.push(`${path}: actions, words, and interventions must be arrays`)
      if (task.participantWords?.length > 4 || task.participantWords?.some(words => typeof words !== 'string' || words.length > 240)) errors.push(`${path}.participantWords: keep at most four short deidentified excerpts, not a transcript`)
      for (const [interventionIndex, intervention] of (task.interventions || []).entries()) {
        exactKeys(intervention, ['kind', 'at', 'detail'], `${path}.interventions[${interventionIndex}]`, errors)
        if (!['neutral_think_aloud', 'access_setup', 'task_help', 'safety_stop'].includes(intervention.kind)) errors.push(`${path}.interventions[${interventionIndex}].kind: unsupported intervention`)
      }
      exactKeys(task.taskData, taskDataKeys[task.taskId] || [], `${path}.taskData`, errors)
      const helpCount = (task.interventions || []).filter(item => item.kind === 'task_help').length
      if (task.taskData?.taskHelpCount !== helpCount) errors.push(`${path}.taskData.taskHelpCount: must equal recorded task_help interventions`)
      if (task.status === 'not_started' && task.taskData?.unassisted !== false) errors.push(`${path}.taskData.unassisted: not-started tasks cannot be successful evidence`)
      if (task.status !== 'not_started' && task.taskData?.unassisted !== (helpCount === 0)) errors.push(`${path}.taskData.unassisted: must reflect whether task_help occurred`)
      if (!Number.isInteger(task.taskData?.elapsedSeconds) || task.taskData.elapsedSeconds < 0) errors.push(`${path}.taskData.elapsedSeconds: expected non-negative integer`)
      if (['serious', 'critical'].includes(task.severity) && (!nonEmpty(task.candidateCause) || !nonEmpty(task.candidateRepair) || task.retestRequired !== true)) errors.push(`${path}: serious or critical issues require cause, repair, and retest`)
    }
  }

  exactKeys(record.sessionSummary, ['workingCases', 'failureCases', 'criticalIssues', 'seriousIssues', 'isolatedFactor', 'repairBeforeRetest', 'nextResearchStep', 'rationale'], '$.sessionSummary', errors)
  for (const key of ['workingCases', 'failureCases', 'criticalIssues', 'seriousIssues', 'repairBeforeRetest']) if (!Array.isArray(record.sessionSummary?.[key])) errors.push(`$.sessionSummary.${key}: expected array`)
  if (!['hold', 'repair_and_retest', 'add_session', 'ready_for_confirmation'].includes(record.sessionSummary?.nextResearchStep)) errors.push('$.sessionSummary.nextResearchStep: unsupported next step')

  if (record.sessionStatus === 'blank') {
    if (record.evidenceClass !== 'blank_template' || record.campaignRound !== 'not_assigned' || record.participant?.alias !== '' || record.participant?.track !== 'not_assigned') errors.push('$: blank template must remain unassigned and non-evidentiary')
    if (record.tasks?.some(task => task.status !== 'not_started')) errors.push('$.tasks: blank template tasks must be not_started')
    if (Object.values(record.consent || {}).some(Boolean)) errors.push('$.consent: blank template must not claim consent')
  }

  if (record.sessionStatus === 'recorded') {
    if (!['pilot', 'confirmation'].includes(record.campaignRound)) errors.push('$.campaignRound: recorded session needs a real round')
    if (!['quick', 'full'].includes(record.participant?.track)) errors.push('$.participant.track: recorded session needs quick or full')
    if (!nonEmpty(record.productVersion) || !nonEmpty(record.environment?.buildId) || record.productVersion !== record.environment?.buildId) errors.push('$.productVersion: must match a non-empty environment buildId')
    if (!nonEmpty(record.environment?.baseUrl) || !nonEmpty(record.environment?.device) || !nonEmpty(record.environment?.browser) || !nonEmpty(record.environment?.viewport) || !nonEmpty(record.environment?.inputMode)) errors.push('$.environment: recorded session needs a reproducible setting')
    if (record.environment?.disposableProfileConfirmed !== true) errors.push('$.environment.disposableProfileConfirmed: protect personal browser data')

    if (record.evidenceClass === 'participant_session') {
      if (!/^P\d{2,4}$/.test(record.participant?.alias || '')) errors.push('$.participant.alias: use a non-identifying alias such as P01')
      for (const key of ['participation', 'deidentifiedNotes', 'withdrawalExplained']) if (record.consent?.[key] !== true) errors.push(`$.consent.${key}: required for participant evidence`)
      if (!/^\d{4}-\d{2}-\d{2}$/.test(record.privacy?.deleteBy || '')) errors.push('$.privacy.deleteBy: participant evidence needs a YYYY-MM-DD deletion date')
      if (record.campaignRound === 'confirmation' && record.participant?.usedSiteVersionBefore !== false) errors.push('$.participant.usedSiteVersionBefore: confirmation counts require newcomers to the tested version')
    } else if (record.evidenceClass === 'fictional_example') {
      if (!/^FX\d{2,4}$/.test(record.participant?.alias || '')) errors.push('$.participant.alias: fictional example must use FX alias')
    } else errors.push('$.evidenceClass: recorded sessions cannot be blank templates')

    const byId = Object.fromEntries((record.tasks || []).map(task => [task.taskId, task]))
    if (record.participant?.track === 'quick' && (byId.W1?.status !== 'not_started' || byId.D1?.status !== 'not_started')) errors.push('$.tasks: quick track must stop after N1,R1')
    if (record.participant?.track === 'full' && record.tasks?.some(task => task.status === 'not_started')) errors.push('$.tasks: full track must record an outcome for all tasks')

    if (byId.N1?.status === 'completed') {
      const data = byId.N1.taskData
      if (!data.stageFound || !data.nextStepExplained || !nonEmpty(data.destinationHash)) errors.push('N1: completed status requires stage, next step, and destination')
    }
    if (byId.R1?.status === 'completed') {
      const data = byId.R1.taskData
      if (!nonEmpty(data.entryPoint) || !nonEmpty(data.resourceTitle) || !data.fitExplained || !data.boundaryExplained) errors.push('R1: completed status requires entry point, resource, fit, and boundary')
    }
    if (byId.W1?.status === 'completed') {
      const data = byId.W1.taskData
      for (const key of ['experienceIntentRecordId', 'coreLoopRecordId', 'prototypeScopeRecordId', 'testPlanRecordId', 'playtestSessionRecordId', 'mainQuestion', 'observablePrediction', 'counterSignal']) if (!nonEmpty(data[key])) errors.push(`W1.${key}: completed full loop requires value`)
      if (!data.explicitHandoffs || !data.scriptedEventLabeledAsDrill) errors.push('W1: handoffs must be explicit and scripted event must remain a drill')
    }
    if (byId.D1?.status === 'completed') {
      const data = byId.D1.taskData
      if (!data.routeRestored || !data.recordsRestored || !data.projectExportDownloaded || !data.localBoundaryExplained) errors.push('D1: completed status requires route, records, export, and local boundary')
      for (const category of expectedCategories) if (!data.expectedCategories?.includes(category)) errors.push(`D1.expectedCategories: missing ${category}`)
    }

    const serious = (record.tasks || []).filter(task => task.severity === 'serious')
    const critical = (record.tasks || []).filter(task => task.severity === 'critical')
    if (serious.length !== record.sessionSummary?.seriousIssues?.length) errors.push('$.sessionSummary.seriousIssues: must correspond one-to-one with serious task findings')
    if (critical.length !== record.sessionSummary?.criticalIssues?.length) errors.push('$.sessionSummary.criticalIssues: must correspond one-to-one with critical task findings')
    if ((serious.length || critical.length) && record.sessionSummary?.nextResearchStep !== 'repair_and_retest') errors.push('$.sessionSummary.nextResearchStep: serious or critical findings require repair_and_retest')
    if ((serious.length || critical.length) && (!record.sessionSummary?.repairBeforeRetest?.length || !nonEmpty(record.sessionSummary?.isolatedFactor))) errors.push('$.sessionSummary: serious findings require isolated factor and repair plan')
  }
  return errors
}

function qualifiesQuick(record) {
  if (record.evidenceClass !== 'participant_session' || record.campaignRound !== 'confirmation' || record.participant.usedSiteVersionBefore) return false
  const [n1, r1] = record.tasks
  return [n1, r1].every(task => task.status === 'completed' && task.taskData.unassisted) &&
    n1.taskData.stageFound && n1.taskData.nextStepExplained && r1.taskData.fitExplained && r1.taskData.boundaryExplained &&
    !r1.taskData.rankingMisread && n1.taskData.elapsedSeconds + r1.taskData.elapsedSeconds <= 900
}

function qualifiesFull(record) {
  if (!qualifiesQuick(record) || record.participant.track !== 'full') return false
  const [, , w1, d1] = record.tasks
  return [w1, d1].every(task => task.status === 'completed' && task.taskData.unassisted) &&
    w1.taskData.explicitHandoffs && w1.taskData.scriptedEventLabeledAsDrill &&
    d1.taskData.routeRestored && d1.taskData.recordsRestored && d1.taskData.projectExportDownloaded && d1.taskData.localBoundaryExplained &&
    expectedCategories.every(category => d1.taskData.expectedCategories.includes(category))
}

function assessParticipantSessions(records) {
  const errors = []
  const aliases = new Set()
  for (const [index, record] of records.entries()) {
    const recordErrors = validateSession(record)
    for (const error of recordErrors) errors.push(`session[${index}] ${error}`)
    if (record.evidenceClass !== 'participant_session') errors.push(`session[${index}]: fictional/template evidence cannot count`)
    if (aliases.has(record.participant?.alias)) errors.push(`session[${index}]: duplicate participant alias ${record.participant?.alias}`)
    aliases.add(record.participant?.alias)
  }
  const quick = records.filter(qualifiesQuick)
  const full = records.filter(qualifiesFull)
  const severe = records.flatMap(record => record.tasks || []).filter(task => ['serious', 'critical'].includes(task.severity))
  const supportedFull = full.some(record => record.participant.supportConfiguration.length > 0)
  const gatesObserved = errors.length === 0 && quick.length >= 5 && full.length >= 4 && severe.length === 0 && supportedFull
  return { errors, quick: quick.length, full: full.length, severe: severe.length, supportedFull, gatesObserved }
}

const checks = []
function expect(name, record, validator, shouldPass, expectedFragment = '') {
  const errors = validator(record)
  const ok = shouldPass ? errors.length === 0 : errors.some(error => error.includes(expectedFragment))
  checks.push({ name, ok, detail: errors.length ? errors.join(' | ') : 'valid' })
}

expect('safe campaign template', campaignTemplate, validateCampaign, true)
expect('safe blank session template', sessionTemplate, validateSession, true)
expect('clearly fictional diagnostic example', fictionalExample, validateSession, true)
checks.push({ name: 'schema metadata', ok: schema.$schema === 'https://json-schema.org/draft/2020-12/schema' && schema.properties?.schemaVersion?.const === 1 && schema.properties?.evidenceClass?.enum?.includes('participant_session'), detail: 'draft 2020-12, version 1, evidence classes declared' })
checks.push({ name: 'handbook covers campaign tasks and non-claim boundary', ok: taskIds.every(id => handbook.includes(`### ${id}`)) && handbook.includes('虚构示例、内部走查或浏览器脚本补足人数') && handbook.includes('单变量诊断与修订日志'), detail: 'N1/R1/W1/D1 + evidence boundary + single-factor repair' })

const sessionCases = [
  ['reject real names', record => { record.privacy.containsRealName = true }, 'containsRealName'],
  ['reject contact fields', record => { record.email = 'person@example.invalid' }, 'prohibited'],
  ['reject recordings', record => { record.consent.audioRecording = true }, 'recording'],
  ['reject aggregate scores', record => { record.sessionSummary.totalScore = 4 }, 'prohibited'],
  ['reject missing task coverage', record => { record.tasks.pop() }, 'exactly N1,R1,W1,D1'],
  ['reject identifying participant alias', record => { record.evidenceClass = 'participant_session'; record.participant.alias = 'Designer Zhang'; record.consent.participation = true; record.consent.deidentifiedNotes = true; record.consent.withdrawalExplained = true; record.privacy.deleteBy = '2026-09-30' }, 'non-identifying alias'],
  ['reject help mislabeled unassisted', record => { record.tasks[1].taskData.unassisted = true }, 'must reflect'],
  ['reject unresolved serious finding', record => { record.tasks[1].candidateRepair = '' }, 'require cause, repair, and retest'],
  ['reject false completed handoff', record => { record.tasks[2].taskData.scriptedEventLabeledAsDrill = false }, 'scripted event'],
  ['reject missing export category', record => { record.tasks[3].taskData.expectedCategories.pop() }, 'missing playtest_sessions'],
  ['reject confirmation repeat user', record => { record.evidenceClass = 'participant_session'; record.campaignRound = 'confirmation'; record.participant.alias = 'P01'; record.participant.usedSiteVersionBefore = true; record.consent.participation = true; record.consent.deidentifiedNotes = true; record.consent.withdrawalExplained = true; record.privacy.deleteBy = '2026-09-30' }, 'newcomers to the tested version']
]
for (const [name, mutate, fragment] of sessionCases) {
  const record = clone(fictionalExample)
  mutate(record)
  expect(name, record, validateSession, false, fragment)
}

const campaignCases = [
  ['reject smaller confirmation sample', record => { record.rounds[1].participantMin = 4 }, '5–7'],
  ['reject fictional evidence counting', record => { record.charterGates.fictionalEvidenceMayCount = true }, 'must be false'],
  ['reject preclaimed campaign decision', record => { record.decision.state = 'charter_gates_met' }, 'cannot pre-claim'],
  ['reject raw recording policy', record => { record.privacy.rawRecordingAllowed = true }, 'must be false']
]
for (const [name, mutate, fragment] of campaignCases) {
  const record = clone(campaignTemplate)
  mutate(record)
  expect(name, record, validateCampaign, false, fragment)
}

const fictionalAssessment = assessParticipantSessions([fictionalExample])
checks.push({ name: 'fictional example never counts as participant evidence', ok: !fictionalAssessment.gatesObserved && fictionalAssessment.errors.some(error => error.includes('cannot count')), detail: fictionalAssessment.errors.join(' | ') })

function syntheticParticipant(alias, track, supportConfiguration = []) {
  const record = clone(fictionalExample)
  record.evidenceClass = 'participant_session'
  record.campaignRound = 'confirmation'
  record.productVersion = 'synthetic-validator-build'
  record.participant = {
    alias,
    track,
    tabletopDesignExperience: 'none',
    usedSiteVersionBefore: false,
    supportConfiguration
  }
  record.consent = {
    participation: true,
    deidentifiedNotes: true,
    withdrawalExplained: true,
    screenRecording: false,
    audioRecording: false
  }
  record.privacy.deleteBy = '2026-09-30'
  record.environment.buildId = 'synthetic-validator-build'
  record.tasks[1].status = 'completed'
  record.tasks[1].interventions = []
  record.tasks[1].severity = 'none'
  record.tasks[1].candidateCause = ''
  record.tasks[1].candidateRepair = ''
  record.tasks[1].retestRequired = false
  record.tasks[1].taskData.rankingMisread = false
  record.tasks[1].taskData.taskHelpCount = 0
  record.tasks[1].taskData.unassisted = true
  record.sessionSummary = {
    workingCases: ['synthetic validator fixture'],
    failureCases: [],
    criticalIssues: [],
    seriousIssues: [],
    isolatedFactor: '',
    repairBeforeRetest: [],
    nextResearchStep: 'add_session',
    rationale: 'Synthetic in-memory fixture; never written as participant evidence.'
  }
  if (track === 'quick') {
    for (const task of record.tasks.slice(2)) {
      task.status = 'not_started'
      task.taskData.unassisted = false
      task.taskData.elapsedSeconds = 0
    }
  }
  return record
}

const syntheticPassingSet = [
  syntheticParticipant('P01', 'full', ['keyboard']),
  syntheticParticipant('P02', 'full'),
  syntheticParticipant('P03', 'full'),
  syntheticParticipant('P04', 'full'),
  syntheticParticipant('P05', 'quick')
]
const passingAssessment = assessParticipantSessions(syntheticPassingSet)
checks.push({ name: 'assessor recognizes the exact 5 finder / 4 full-loop working fixture', ok: passingAssessment.gatesObserved && passingAssessment.quick === 5 && passingAssessment.full === 4, detail: JSON.stringify(passingAssessment) })

const noSupportSet = syntheticPassingSet.map(record => clone(record))
for (const record of noSupportSet) record.participant.supportConfiguration = []
const noSupportAssessment = assessParticipantSessions(noSupportSet)
checks.push({ name: 'assessor rejects missing support-configuration coverage', ok: !noSupportAssessment.gatesObserved && !noSupportAssessment.supportedFull, detail: JSON.stringify(noSupportAssessment) })

const tooFewFullAssessment = assessParticipantSessions(syntheticPassingSet.map((record, index) => index === 3 ? syntheticParticipant('P04', 'quick') : clone(record)))
checks.push({ name: 'assessor rejects fewer than four independent full loops', ok: !tooFewFullAssessment.gatesObserved && tooFewFullAssessment.full === 3, detail: JSON.stringify(tooFewFullAssessment) })

const duplicateAliasSet = syntheticPassingSet.map(record => clone(record))
duplicateAliasSet[4].participant.alias = 'P04'
const duplicateAliasAssessment = assessParticipantSessions(duplicateAliasSet)
checks.push({ name: 'assessor rejects duplicate participant aliases', ok: !duplicateAliasAssessment.gatesObserved && duplicateAliasAssessment.errors.some(error => error.includes('duplicate participant alias')), detail: duplicateAliasAssessment.errors.join(' | ') })

const failed = checks.filter(check => !check.ok)
for (const check of checks) console.log(`${check.ok ? 'PASS' : 'FAIL'}  ${check.name}: ${check.detail}`)
console.log(`\n${checks.length - failed.length}/${checks.length} beginner campaign package checks passed.`)

const sessionPaths = process.argv.slice(2)
if (sessionPaths.length) {
  const participantRecords = []
  for (const path of sessionPaths) participantRecords.push(JSON.parse(await readFile(resolve(path), 'utf8')))
  const assessment = assessParticipantSessions(participantRecords)
  console.log(`\nParticipant assessment: ${assessment.quick} unassisted quick-start, ${assessment.full} independent full-loop, ${assessment.severe} serious/critical findings, support-covered full loop=${assessment.supportedFull}.`)
  if (assessment.errors.length) for (const error of assessment.errors) console.error(`ERROR  ${error}`)
  console.log(assessment.gatesObserved
    ? 'PROVISIONAL  Confirmation-session gates observed. Pilot repair log and manual evidence review are still required before updating the charter.'
    : 'PENDING  Charter gates are not evidenced by the supplied participant sessions.')
  if (!assessment.gatesObserved) process.exitCode = 1
}
if (failed.length) process.exitCode = 1
