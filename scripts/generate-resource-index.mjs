import { mkdir, readFile, readdir, unlink, writeFile } from 'node:fs/promises'

const inputUrl = new URL('../content/resources.json', import.meta.url)
const outputUrl = new URL('../content/resource-index.json', import.meta.url)
const assessmentUrl = new URL('../content/resource-assessments.json', import.meta.url)
const entryPointUrl = new URL('../content/resource-entry-points.json', import.meta.url)
const entryOutputDir = new URL('../content/resource-entry-catalogs/', import.meta.url)
const entryManifestUrl = new URL('../content/resource-entry-manifest.json', import.meta.url)
const entryIndexUrl = new URL('../content/resource-entry-index.json', import.meta.url)
const resources = JSON.parse(await readFile(inputUrl, 'utf8'))
const assessments = JSON.parse(await readFile(assessmentUrl, 'utf8'))
const entryPointRecord = JSON.parse(await readFile(entryPointUrl, 'utf8'))
const index = resources.map(({ id, title, href }) => ({ id, title, href }))
const resourceById = new Map(resources.map(resource => [resource.id, resource]))
const assessmentById = new Map(assessments.map(assessment => [assessment.resourceId, assessment]))

await writeFile(outputUrl, `${JSON.stringify(index, null, 2)}\n`, 'utf8')
await mkdir(entryOutputDir, { recursive: true })
for (const filename of await readdir(entryOutputDir)) if (filename.endsWith('.json')) await unlink(new URL(filename, entryOutputDir))

for (const entry of entryPointRecord.entryPoints) {
  const entryResources = entry.resourceIds.map(id => resourceById.get(id))
  const entryAssessments = entry.resourceIds.map(id => assessmentById.get(id))
  if (entryResources.some(value => !value) || entryAssessments.some(value => !value)) throw new Error(`resource entry package ${entry.id}: unresolved resource or assessment`)
  const payload = { schemaVersion: 1, entry, resources: entryResources, resourceAssessments: entryAssessments }
  await writeFile(new URL(`${entry.id}.json`, entryOutputDir), `${JSON.stringify(payload, null, 2)}\n`, 'utf8')
}

const entryIds = entryPointRecord.entryPoints.map(entry => entry.id)
const manifest = { schemaVersion: 1, defaultEntryId: entryIds[0], entryIds }
const entryIndex = { schemaVersion: 1, principle: entryPointRecord.principle, entryPoints: entryPointRecord.entryPoints.map(({ id, title }) => ({ id, title })) }
await writeFile(entryManifestUrl, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8')
await writeFile(entryIndexUrl, `${JSON.stringify(entryIndex, null, 2)}\n`, 'utf8')
console.log(`resource index: ${index.length} references + ${entryIds.length} entry packages generated`)
