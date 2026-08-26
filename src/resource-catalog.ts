import resourceRecords from '../content/resources.json'
import resourceAssessmentRecords from '../content/resource-assessments.json'
import resourceEntryPointRecord from '../content/resource-entry-points.json'
import resourceEvaluationRubricRecord from '../content/resource-evaluation-rubric.json'
import type { Resource, ResourceAssessment, ResourceCatalog, ResourceEntryPoint, ResourceEvaluationRubric } from './data'

const entryPointRecord = resourceEntryPointRecord as { schemaVersion: number; principle: string; entryPoints: ResourceEntryPoint[] }

export const resourceCatalog: ResourceCatalog = {
  resources: resourceRecords as Resource[],
  resourceAssessments: resourceAssessmentRecords as ResourceAssessment[],
  resourceEntryPoints: entryPointRecord.entryPoints,
  resourceEntryPointPrinciple: entryPointRecord.principle,
  resourceEvaluationRubric: resourceEvaluationRubricRecord as unknown as ResourceEvaluationRubric,
}
