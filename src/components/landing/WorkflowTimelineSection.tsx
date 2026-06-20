import { useInView } from '@/hooks/use-in-view';

const steps = [
  { title: 'Research', description: 'Gather funding, ecosystem, and project intel.' },
  { title: 'Analyze', description: 'Score wallets and surface sybil risk.' },
  { title: 'Execute', description: 'Run tasks across multiple wallets.' },
  { title: 'Track', description: 'Monitor progress and on-chain activity.' },
  { title: 'Claim', description: 'Capture rewards with a clear audit trail.' },
];

export function WorkflowTimelineSection() {
  const { ref, isInView } = useInView<HTMLDivElement>();

  return (
    <section id="workspace" className="alpha-rd-section px-4 sm:px-6 lg:px-8">
      <div className="alpha-rd-width">
        <div className="alpha-rd-section-head">
          <span className="alpha-rd-eyebrow">Workflow</span>
          <h2 className="alpha-rd-heading">From research to rewards.</h2>
        </div>

        <div ref={ref} className={`alpha-rd-flow ${isInView ? 'is-in-view' : ''}`}>
          <div className="alpha-rd-flow-line" aria-hidden="true" />
          {steps.map((step, index) => (
            <article
              key={step.title}
              className="alpha-rd-flow-item"
              style={{ transitionDelay: `${index * 110}ms` }}
            >
              <div className="alpha-rd-flow-node">{String(index + 1).padStart(2, '0')}</div>
              <strong>{step.title}</strong>
              <p>{step.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
