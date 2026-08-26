import { readFile, writeFile } from 'node:fs/promises'

const inputUrl = new URL('../content/glossary.json', import.meta.url)
const outputUrl = new URL('../content/glossary-index.json', import.meta.url)
const glossary = JSON.parse(await readFile(inputUrl, 'utf8'))
const index = glossary.map(({ id, term }) => ({ id, term }))

await writeFile(outputUrl, `${JSON.stringify(index, null, 2)}\n`, 'utf8')
console.log(`glossary index: ${index.length} references -> content/glossary-index.json`)
