import resourceEntryIndexRecord from '../content/resource-entry-index.json'
import resourceAudiencePathRecord from '../content/resource-audience-paths.json'
import resourceLearningPathRecord from '../content/resource-learning-paths.json'
import type { ResourceAudiencePath, ResourceDiscoveryCatalog, ResourceEntryReference, ResourceLearningPath } from './data'
import { resourceStageGroups } from './resource-stage-navigation'

const record = resourceEntryIndexRecord as { schemaVersion: number; principle: string; entryPoints: ResourceEntryReference[] }
const audienceRecord = resourceAudiencePathRecord as { schemaVersion: number; principle: string; paths: ResourceAudiencePath[] }
const learningRecord = resourceLearningPathRecord as { schemaVersion: number; principle: string; paths: ResourceLearningPath[] }

export const resourceDiscoveryCatalog: ResourceDiscoveryCatalog = {
  resourceEntryPoints: record.entryPoints,
  resourceEntryPointPrinciple: record.principle,
  resourceStageGroups,
  resourceAudiencePathPrinciple: audienceRecord.principle,
  resourceAudiencePaths: audienceRecord.paths,
  resourceLearningPathPrinciple: learningRecord.principle,
  resourceLearningPaths: learningRecord.paths,
}
