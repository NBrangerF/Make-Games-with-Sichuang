import glossaryRecords from '../content/glossary.json'
import conceptActionIndexRecord from '../content/concept-action-index.json'
import type { ConceptActionIndex, GlossaryTerm } from './data'

export const glossary = glossaryRecords as GlossaryTerm[]
export const conceptActionIndex = conceptActionIndexRecord as ConceptActionIndex
