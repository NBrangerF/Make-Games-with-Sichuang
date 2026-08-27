export interface KeyValueStorage {
  readonly length: number
  key(index: number): string | null
  getItem(key: string): string | null
  setItem(key: string, value: string): void
  removeItem(key: string): void
}

export class MemoryStorage implements KeyValueStorage {
  private readonly values = new Map<string, string>()
  private readonly quotaBytes: number

  constructor(initial: Readonly<Record<string, string>> = {}, quotaBytes = Number.POSITIVE_INFINITY) {
    this.quotaBytes = quotaBytes
    for (const [key, value] of Object.entries(initial)) this.values.set(key, value)
  }

  get length() {
    return this.values.size
  }

  key(index: number) {
    return [...this.values.keys()][index] ?? null
  }

  getItem(key: string) {
    return this.values.get(key) ?? null
  }

  setItem(key: string, value: string) {
    const next = new Map(this.values)
    next.set(key, value)
    const size = [...next.entries()].reduce((total, [entryKey, entryValue]) => total + new TextEncoder().encode(entryKey + entryValue).byteLength, 0)
    if (size > this.quotaBytes) throw new DOMException('Storage quota exceeded', 'QuotaExceededError')
    this.values.set(key, value)
  }

  removeItem(key: string) {
    this.values.delete(key)
  }

  dump() {
    return Object.fromEntries(this.values)
  }
}
