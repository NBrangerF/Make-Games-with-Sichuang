import designMaterialDocument from '../content/design-materials.json' with { type: 'json' }

export type MechanicMaterial = Readonly<{
  id: string
  name: string
  aliases: string[]
  summary: string
  playerVerb: string
  tableChange: string
  tension: string
  watchFor: string
  exercise: string
  materialTags: string[]
  interactionTags: string[]
  themePromptIds: string[]
}>

export type ThemeMaterial = Readonly<{
  id: string
  name: string
  premise: string
  playerPosition: string
  repeatedActions: string
  systemPressure: string
  systemQuestion: string
  care: string
  exercise: string
  contextTags: string[]
  toneTags: string[]
  mechanicPromptIds: string[]
}>

type DesignMaterialDocument = Readonly<{
  schemaVersion: number
  principle: string
  mechanics: MechanicMaterial[]
  themes: ThemeMaterial[]
}>

const document = designMaterialDocument as DesignMaterialDocument

export const designMaterialPrinciple = document.principle
export const mechanicMaterials = [...document.mechanics]
export const themeMaterials = [...document.themes]
export const mechanicMaterialById = new Map(mechanicMaterials.map(item => [item.id, item]))
export const themeMaterialById = new Map(themeMaterials.map(item => [item.id, item]))

export const mechanicMaterialTags = [...new Set(mechanicMaterials.flatMap(item => [...item.materialTags, ...item.interactionTags]))].sort((a, b) => a.localeCompare(b, 'zh-CN'))
export const themeMaterialTags = [...new Set(themeMaterials.flatMap(item => [...item.contextTags, ...item.toneTags]))].sort((a, b) => a.localeCompare(b, 'zh-CN'))

export function mechanicSearchText(item: MechanicMaterial) {
  return [item.name, ...item.aliases, item.summary, item.playerVerb, item.tableChange, item.tension, ...item.materialTags, ...item.interactionTags].join(' ').toLocaleLowerCase('zh-CN')
}

export function themeSearchText(item: ThemeMaterial) {
  return [item.name, item.premise, item.playerPosition, item.repeatedActions, item.systemPressure, ...item.contextTags, ...item.toneTags].join(' ').toLocaleLowerCase('zh-CN')
}
