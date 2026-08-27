import { LEGACY_STORAGE_REGISTRY, type LegacyStorageDescriptor } from '../storage-keys.ts'
import { fingerprintText } from './ids.ts'
import type { JsonValue } from './schema-v3.ts'
import type { KeyValueStorage } from './storage-adapter.ts'
import { isJsonValue } from './validation-v3.ts'

export type LegacyScanEntry = Readonly<{
  descriptor: LegacyStorageDescriptor
  present: boolean
  raw: string | null
  value: JsonValue | null
  detectedShape: string
  sourceSchema: string
  itemCount: number
  byteLength: number
  fingerprint: string | null
  error: string | null
}>

export type LegacyScanReport = Readonly<{
  scannedAt: string
  sourceDigest: string
  activeKeyCount: number
  legacyKeyCount: number
  presentKeyCount: number
  entries: LegacyScanEntry[]
}>

function detectShape(value: JsonValue, descriptor: LegacyStorageDescriptor) {
  if (Array.isArray(value)) return { shape: 'record-array-v1', schema: 'array', count: value.length }
  if (value === null || typeof value !== 'object') return { shape: 'invalid-scalar', schema: 'unknown', count: 0 }
  const schema = typeof value.schemaVersion === 'number' ? `v${value.schemaVersion}` : 'unversioned'
  if (descriptor.collection) {
    const collection = value[descriptor.collection]
    if (Array.isArray(collection)) return { shape: `named:${descriptor.collection}`, schema, count: collection.length }
  }
  if ('records' in value && Array.isArray(value.records)) return { shape: 'draft-records', schema, count: value.records.length }
  if ('draft' in value) return { shape: 'draft-only', schema, count: 1 }
  return { shape: 'direct-object', schema, count: 1 }
}

export function scanLegacyStorage(storage: KeyValueStorage, now = new Date().toISOString()): LegacyScanReport {
  const entries = LEGACY_STORAGE_REGISTRY.map(descriptor => {
    const raw = storage.getItem(descriptor.key)
    if (raw === null) return {
      descriptor,
      present: false,
      raw: null,
      value: null,
      detectedShape: 'missing',
      sourceSchema: 'missing',
      itemCount: 0,
      byteLength: 0,
      fingerprint: null,
      error: null,
    } satisfies LegacyScanEntry

    try {
      const parsed: unknown = JSON.parse(raw)
      if (!isJsonValue(parsed)) throw new Error('parsed value is not JSON-compatible')
      const detected = detectShape(parsed, descriptor)
      return {
        descriptor,
        present: true,
        raw,
        value: parsed,
        detectedShape: detected.shape,
        sourceSchema: detected.schema,
        itemCount: detected.count,
        byteLength: new TextEncoder().encode(raw).byteLength,
        fingerprint: fingerprintText(raw),
        error: null,
      } satisfies LegacyScanEntry
    } catch (error) {
      return {
        descriptor,
        present: true,
        raw,
        value: null,
        detectedShape: 'corrupt-json',
        sourceSchema: 'unknown',
        itemCount: 0,
        byteLength: new TextEncoder().encode(raw).byteLength,
        fingerprint: fingerprintText(raw),
        error: error instanceof Error ? error.message : String(error),
      } satisfies LegacyScanEntry
    }
  })

  const digestSource = entries.map(entry => `${entry.descriptor.key}:${entry.fingerprint ?? 'missing'}:${entry.error ?? ''}`).join('\n')
  return {
    scannedAt: now,
    sourceDigest: fingerprintText(digestSource),
    activeKeyCount: LEGACY_STORAGE_REGISTRY.filter(item => item.status === 'active').length,
    legacyKeyCount: LEGACY_STORAGE_REGISTRY.filter(item => item.status === 'legacy').length,
    presentKeyCount: entries.filter(item => item.present).length,
    entries,
  }
}
