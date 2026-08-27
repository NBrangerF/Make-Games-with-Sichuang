import type { JsonValue, LegacyRef } from './schema-v3.ts'

const FNV_OFFSET = 14695981039346656037n
const FNV_PRIME = 1099511628211n
const FNV_MASK = 0xffffffffffffffffn

export function canonicalizeJson(value: JsonValue): string {
  if (value === null || typeof value !== 'object') return JSON.stringify(value)
  if (Array.isArray(value)) return `[${value.map(canonicalizeJson).join(',')}]`
  return `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${canonicalizeJson(value[key])}`).join(',')}}`
}

export function fingerprintText(value: string): string {
  let hash = FNV_OFFSET
  for (const byte of new TextEncoder().encode(value)) {
    hash ^= BigInt(byte)
    hash = (hash * FNV_PRIME) & FNV_MASK
  }
  return hash.toString(16).padStart(16, '0')
}

export function fingerprintJson(value: JsonValue): string {
  return fingerprintText(canonicalizeJson(value))
}

export function newEntityId(prefix: string): string {
  return `${prefix}_${crypto.randomUUID()}`
}

export function legacyMapKey(ref: LegacyRef): string {
  return [ref.sourceKey, ref.sourceSchema, ref.legacyId ?? '', ref.sourceIndex ?? '', ref.normalizedFingerprint].join('|')
}

export function deterministicLegacyId(prefix: string, ref: LegacyRef): string {
  return `${prefix}_legacy_${fingerprintText(legacyMapKey(ref))}`
}
