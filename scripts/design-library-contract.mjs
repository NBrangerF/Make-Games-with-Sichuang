const languages = ['zh-CN', 'en']
const kinds = ['mechanism', 'overview', 'pattern', 'structure', 'theme', 'setting', 'lesson', 'comparison']
const questions = ['actions', 'cards', 'uncertainty', 'space', 'economy', 'interaction', 'theme', 'process']
const allowed = ['id', 'kind', 'contentVersion', 'title', 'summary', 'aliases', 'searchTerms', 'question', 'chapterIds', 'caseIds', 'relations', 'bggReferences']
const safeId = value => typeof value === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)
const pair = (value, arrays = false) => value && Object.keys(value).length === 2 && languages.every(lang => arrays ? Array.isArray(value[lang]) && value[lang].every(x => typeof x === 'string' && x.trim()) : typeof value[lang] === 'string' && value[lang].trim())

// The catalog is a public allowlist. Research records never pass through this boundary.
export function validateLibrary(catalog, { chapterIds, caseIds, bodies }) {
  const errors = []
  const fail = message => errors.push(message)
  if (!catalog || catalog.schemaVersion !== 1 || !Array.isArray(catalog.entries)) return ['Invalid catalog schema']
  if (Object.keys(catalog).some(key => !['schemaVersion', 'entries'].includes(key))) fail('Unexpected catalog field')
  const ids = new Set(catalog.entries.map(item => item.id))
  if (ids.size !== catalog.entries.length) fail('Duplicate entry ID')
  for (const item of catalog.entries) {
    const id = item.id
    if (!safeId(id)) fail(`Invalid ID: ${id}`)
    if (Object.keys(item).some(key => !allowed.includes(key)) || allowed.some(key => !(key in item))) fail(`${id}: public fields must match allowlist`)
    if (!kinds.includes(item.kind) || !questions.includes(item.question)) fail(`${id}: invalid classification`)
    if (!/^\d+\.\d+\.\d+$/.test(item.contentVersion)) fail(`${id}: invalid content version`)
    if (!pair(item.title) || !pair(item.summary) || !pair(item.aliases, true) || !pair(item.searchTerms, true)) fail(`${id}: missing or invalid bilingual text`)
    for (const [key, targets] of [['chapterIds', chapterIds], ['caseIds', caseIds]]) {
      if (!Array.isArray(item[key]) || item[key].some(target => !targets.has(target)) || new Set(item[key]).size !== item[key].length) fail(`${id}: invalid ${key}`)
    }
    if (!Array.isArray(item.relations) || item.relations.some(ref => !ids.has(ref.targetId) || ref.targetId === id || !['contrast-with', 'variant-of', 'combines-with', 'see-also'].includes(ref.type) || Object.keys(ref).some(key => !['targetId', 'type'].includes(key)))) fail(`${id}: invalid relation`)
    if (!Array.isArray(item.bggReferences) || item.bggReferences.some(ref => !Number.isInteger(ref.id) || ref.id <= 0 || typeof ref.name !== 'string' || !ref.name.trim() || !['same-scope', 'local-narrower', 'local-broader', 'related'].includes(ref.relation) || !new RegExp(`^https://boardgamegeek\\.com/boardgame(?:mechanic|category)/${ref.id}/[a-z0-9-]+$`).test(ref.url) || Object.keys(ref).some(key => !['id', 'name', 'url', 'relation'].includes(key)))) fail(`${id}: invalid BGG identity reference`)
    for (const lang of languages) {
      const body = bodies.get(`${id}/${lang}`)
      if (typeof body !== 'string' || !/^# .+/m.test(body) || (body.match(/^# /gm) || []).length !== 1 || (body.match(/^## /gm) || []).length < 4) fail(`${id}/${lang}: missing structured article`)
      if (typeof body === 'string' && /\/Users\/|落桌内部研究|file:\/\//.test(body)) fail(`${id}/${lang}: private path in public body`)
    }
  }
  if (/\/Users\/|落桌内部研究|file:\/\//.test(JSON.stringify(catalog))) fail('Private path in public catalog')
  return errors
}
