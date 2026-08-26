import type { ResourceLearningPath } from './data'

export function ResourceLearningPathView({ path, principle, onOpenResource }: { path: ResourceLearningPath; principle: string; onOpenResource?: (entryId: string, resourceId: string) => void }) {
  return <section className="resource-learning-path" aria-labelledby="resource-learning-path-title">
    <header><h3 id="resource-learning-path-title">{path.title}</h3><p>{path.intro}</p><small>{principle}</small></header>
    <ol>{path.steps.map((step, index) => <li key={step.resourceId}><button type="button" onClick={() => onOpenResource?.(path.entryId, step.resourceId)}><span className="resource-learning-order" aria-hidden="true">{index + 1}</span><span className="resource-learning-copy"><strong>{step.guideTitle}</strong><span>{step.purpose}</span><span className="resource-learning-detail"><span><b>阅读时看</b>{step.focus}</span><span><b>读完就做</b>{step.action}</span></span></span><span className="resource-learning-arrow" aria-hidden="true">→</span></button></li>)}</ol>
  </section>
}
