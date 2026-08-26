import { readFile, writeFile } from 'node:fs/promises'

const glossaryUrl = new URL('../content/glossary.json', import.meta.url)
const coreGuidesUrl = new URL('../content/guides.json', import.meta.url)
const specialGuidesUrl = new URL('../content/special-guides.json', import.meta.url)
const outputUrl = new URL('../content/concept-action-index.json', import.meta.url)
const checkOnly = process.argv.includes('--check')

const [glossary, coreGuides, specialGuides] = await Promise.all([
  readFile(glossaryUrl, 'utf8').then(JSON.parse),
  readFile(coreGuidesUrl, 'utf8').then(JSON.parse),
  readFile(specialGuidesUrl, 'utf8').then(JSON.parse),
])

const coreGuideById = new Map(coreGuides.map(guide => [guide.id, guide]))
const specialGuidesByConcept = new Map()

for (const guide of specialGuides) {
  for (const conceptId of guide.conceptIds) {
    const guideIds = specialGuidesByConcept.get(conceptId) ?? []
    guideIds.push(guide.id)
    specialGuidesByConcept.set(conceptId, guideIds)
  }
}

const firstShareableTool = guide => guide.toolIds.find(toolId => toolId !== 'test-plan')
const unique = values => [...new Set(values.filter(Boolean))]

const index = {
  schemaVersion: 1,
  principle: '这些入口来自词条与核心/专题指南中显式维护的关系，用来继续阅读或打开工作单；它们不是自动推荐、质量排名或适用于所有项目的固定顺序。',
  specialGuides: specialGuides.map(({ id, title, stage }) => ({ id, title, stage })),
  entries: glossary.map(term => {
    const relatedSpecialGuideIds = specialGuidesByConcept.get(term.id) ?? []
    const coreTools = term.guideIds.map(guideId => firstShareableTool(coreGuideById.get(guideId) ?? { toolIds: [] }))
    const specialTools = relatedSpecialGuideIds.map(guideId => firstShareableTool(specialGuides.find(guide => guide.id === guideId)))
    return {
      conceptId: term.id,
      specialGuideIds: relatedSpecialGuideIds,
      toolIds: unique([...coreTools, ...specialTools]),
    }
  }),
}

const serialized = `${JSON.stringify(index, null, 2)}\n`

if (checkOnly) {
  const current = await readFile(outputUrl, 'utf8').catch(() => '')
  if (current !== serialized) throw new Error('content/concept-action-index.json 已过期；请运行 pnpm concept-actions:index')
  console.log(`concept action index current: ${index.entries.length} concepts, ${index.specialGuides.length} special guides`)
} else {
  await writeFile(outputUrl, serialized, 'utf8')
  console.log(`concept action index: ${index.entries.length} concepts, ${index.specialGuides.length} special guides -> content/concept-action-index.json`)
}
