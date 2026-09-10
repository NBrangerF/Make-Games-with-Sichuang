import assert from 'node:assert/strict'
import { mechanicMaterials, themeMaterials } from '../src/design-material-catalog.ts'
import { firstTabletopMissingCore, readFirstTabletopDraft, seedFirstTabletopMaterial } from '../src/first-tabletop-draft.ts'

const key = 'tabletop-workshop-first-tabletop-v1'
const storage = new Map()
let reads = 0
const writes = []
const original = Object.getOwnPropertyDescriptor(globalThis, 'localStorage')
Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: {
  getItem(name) { reads++; return storage.get(name) ?? null },
  setItem(name, value) { writes.push({ name, value }); storage.set(name, value) },
} })
const reset = value => {
  storage.clear()
  storage.set('unrelated-project', 'preserve this project')
  if (value !== undefined) storage.set(key, value)
  reads = 0
  writes.length = 0
}
try {
  // Reading alone never migrates, repairs, or creates practice records.
  for (const value of [undefined, '{broken', 'null', JSON.stringify({ schemaVersion: 2 })]) {
    reset(value)
    const before = [...storage]
    assert.equal(readFirstTabletopDraft().actionState, 'not-started')
    assert.deepEqual([...storage], before)
    assert.equal(writes.length, 0)
  }
  reset()
  const initial = readFirstTabletopDraft()
  const complete = { ...initial, mechanicId: mechanicMaterials[0].id, themeId: themeMaterials[0].id,
    playerGoal: 'Deliver two books', endCondition: 'End after six actions', repeatedAction: 'Move one space',
    feedback: 'Move the cart', testQuestion: 'Can two books arrive?', runNote: 'Observed three rounds',
    revisionNote: 'Change only the deadline', actionState: 'tested', updatedAt: '2026-09-01T00:00:00.000Z' }

  // All existing IDs remain valid. Seeding one field preserves the other fields and unrelated keys.
  assert.equal(mechanicMaterials.length, 17)
  assert.equal(themeMaterials.length, 12)
  for (const [kind, items, field] of [['mechanic', mechanicMaterials, 'mechanicId'], ['theme', themeMaterials, 'themeId']]) {
    for (const item of items) {
      reset(JSON.stringify(complete))
      assert.equal(seedFirstTabletopMaterial(kind, item.id), true)
      assert.equal(writes.length, 1)
      assert.equal(writes[0].name, key)
      const saved = JSON.parse(storage.get(key))
      assert.deepEqual({ ...saved, updatedAt: complete.updatedAt }, { ...complete, [field]: item.id })
      assert.equal(firstTabletopMissingCore(saved).length, 0)
      assert.equal(storage.get('unrelated-project'), 'preserve this project')
    }
  }

  // Unknown, wrong-kind, and new-library-only IDs cannot cause a read or write, even from empty storage.
  const invalid = [['mechanic', ''], ['mechanic', 'missing-material'], ['theme', 'missing-theme'],
    ['mechanic', 'area-majority'], ['mechanic', ' worker-placement '], ['mechanic', 'constructor'],
    ['mechanic', themeMaterials[0].id], ['theme', mechanicMaterials[0].id], ['unexpected', mechanicMaterials[0].id]]
  for (const value of [undefined, JSON.stringify(complete)]) for (const [kind, id] of invalid) {
    reset(value)
    const before = [...storage]
    assert.equal(seedFirstTabletopMaterial(kind, id), false)
    assert.equal(reads, 0)
    assert.equal(writes.length, 0)
    assert.deepEqual([...storage], before)
  }
  reset()
  assert.equal(seedFirstTabletopMaterial('mechanic', mechanicMaterials[0].id), true)
  assert.equal(JSON.parse(storage.get(key)).actionState, 'drafted')
  assert.equal(writes.length, 1)

  // Receiving a saved unknown ID cannot satisfy the requirements for tabletop/test/revision states.
  for (const [field, missing] of [['mechanicId', '一张 mechanic 牌'], ['themeId', '一张 theme 牌']]) {
    reset(JSON.stringify({ ...complete, [field]: 'missing-material' }))
    const before = [...storage]
    const received = readFirstTabletopDraft()
    assert.deepEqual(firstTabletopMissingCore(received), [missing])
    assert.equal(received.actionState, 'tested', 'Reading preserves recorded history; it does not invent or erase an action')
    assert.equal(received.runNote, complete.runNote)
    assert.deepEqual([...storage], before)
    assert.equal(writes.length, 0)
  }
  assert.deepEqual(firstTabletopMissingCore({ ...complete, playerGoal: '   ' }), ['玩家目标'])
  console.log('PASS first-tabletop: all 29 legacy IDs, invalid seed no-I/O, saved unknown-ID recovery requirements, existing notes/state preserved')
} finally {
  if (original) Object.defineProperty(globalThis, 'localStorage', original)
  else delete globalThis.localStorage
}
