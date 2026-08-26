import { createHash } from 'node:crypto'
import { readFile, stat } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const projectRoot = join(dirname(fileURLToPath(import.meta.url)), '..')
const manifestPath = join(projectRoot, 'content/visual-assets/classic-board-game-assets.json')
const runtimeDataPath = join(projectRoot, 'src/classic-visual-assets.ts')

const fail = (message) => {
  throw new Error(`[classic-assets] ${message}`)
}

const manifest = JSON.parse(await readFile(manifestPath, 'utf8'))
const runtimeData = await readFile(runtimeDataPath, 'utf8')

if (!Array.isArray(manifest.assets) || manifest.assets.length === 0) {
  fail('manifest.assets must contain at least one asset')
}

const requiredFields = [
  'sourcePage',
  'downloadUrl',
  'creator',
  'license',
  'licenseUrl',
  'rightsStatus',
  'useScope',
  'depictedWorkStatus',
  'publicUseAllowed',
  'sha256',
  'cropUse',
  'modified',
]

const seenIds = new Set()
const seenRuntimePaths = new Set()

for (const asset of manifest.assets) {
  if (!asset.id || seenIds.has(asset.id)) fail(`invalid or duplicate id: ${asset.id ?? '(missing)'}`)
  seenIds.add(asset.id)

  for (const field of requiredFields) {
    if (!(field in asset) || asset[field] === '' || asset[field] === null) {
      fail(`${asset.id} is missing required field ${field}`)
    }
  }

  if (asset.rightsStatus !== 'cleared-open') {
    fail(`${asset.id} has forbidden rightsStatus=${asset.rightsStatus}`)
  }
  if (asset.useScope !== 'internal-only') {
    fail(`${asset.id} has unexpected useScope=${asset.useScope}`)
  }
  if (asset.publicUseAllowed !== false) {
    fail(`${asset.id} must remain blocked from a public build until the depicted-work review is complete`)
  }
  if (!asset.depictedWorkStatus.startsWith('open-photo-')) {
    fail(`${asset.id} has an undocumented depictedWorkStatus`)
  }
  if (!/^https:\/\//.test(asset.sourcePage) || !/^https:\/\//.test(asset.downloadUrl)) {
    fail(`${asset.id} must record HTTPS source and download URLs`)
  }
  if (!/^\/assets\/classic-games\/[a-z0-9-]+\.webp$/.test(asset.runtimePath)) {
    fail(`${asset.id} has an invalid runtimePath: ${asset.runtimePath}`)
  }
  if (seenRuntimePaths.has(asset.runtimePath)) fail(`duplicate runtimePath: ${asset.runtimePath}`)
  seenRuntimePaths.add(asset.runtimePath)

  const localPath = join(projectRoot, 'public', asset.runtimePath.replace(/^\//, ''))
  const localStat = await stat(localPath).catch(() => null)
  if (!localStat?.isFile()) fail(`${asset.id} runtime file does not exist: ${localPath}`)

  const digest = createHash('sha256').update(await readFile(localPath)).digest('hex')
  if (digest !== asset.sha256) {
    fail(`${asset.id} sha256 mismatch: expected ${asset.sha256}, received ${digest}`)
  }
}

const referencedRuntimePaths = [
  ...runtimeData.matchAll(/runtimePath:\s*['"]([^'"]+)['"]/g),
].map((match) => match[1])

if (referencedRuntimePaths.length !== manifest.assets.length) {
  fail(`runtime data references ${referencedRuntimePaths.length} assets; manifest records ${manifest.assets.length}`)
}

for (const runtimePath of referencedRuntimePaths) {
  const asset = manifest.assets.find((entry) => entry.runtimePath === runtimePath)
  if (!asset) fail(`runtime references an unregistered asset: ${runtimePath}`)
  if (asset.rightsStatus !== 'cleared-open' || asset.useScope !== 'internal-only') {
    fail(`runtime references a non-cleared asset or an asset outside the internal build scope: ${runtimePath}`)
  }
}

if (process.env.PUBLIC_RELEASE === 'true') {
  const blocked = manifest.assets.filter((asset) => !asset.publicUseAllowed)
  if (blocked.length > 0) fail(`public release blocked by ${blocked.length} internal-only classic assets`)
}

for (const asset of manifest.assets) {
  if (!runtimeData.includes(`sourcePage: '${asset.sourcePage}'`)) {
    fail(`${asset.id} sourcePage differs between manifest and runtime data`)
  }
  if (!runtimeData.includes(`creator: '${asset.creator}'`)) {
    fail(`${asset.id} creator differs between manifest and runtime data`)
  }
  if (!runtimeData.includes(`license: '${asset.license}'`)) {
    fail(`${asset.id} license differs between manifest and runtime data`)
  }
}

console.log(`[classic-assets] ${manifest.assets.length} internally approved assets verified (files, hashes, rights, runtime references).`)
