import { Coins, ClipboardCheck, LineChart, Rocket, Search } from 'lucide-react';
import { useInView } from '@/hooks/use-in-view';

const steps = [
  {
    icon: Search,
    title: 'Research',
    description: 'Collect funding, ecosystem, and project data in one workspace.',
  },
  {
    icon: Rocket,
    title: 'Execute',
    description: 'Run tasks across multiple wallets without losing context.',
  },
  {
    icon: LineChart,
    title: 'Track',
    description: 'Monitor progress, rewards, and on-chain activity over time.',
  },
  {
    icon: Coins,
    title: 'Claim',
    description: 'Capture every claim and payout with a clear audit trail.',
  },
  {
    icon: ClipboardCheck,
    title: 'Review',
    description: 'Review sybil risk and outcomes before the next cycle.',
  },
];

export function WorkflowTimelineSection() {
  const { ref, isInView } = useInView<HTMLDivElement>();

  return (
    <section id="workflow" className="alpha-saas-section alpha-mission-section px-4 sm:px-6 lg:px-8">
      <div className="macos-landing-width">
        <div className="alpha-saas-section-header">
          <p className="macos-section-label">Workflow Timeline</p>
          <h2 className="alpha-landing-section-title">A repeatable system, step by step.</h2>
          <p>
            Move from research to review on a single timeline instead of scattered tabs, notes, and spreadsheets.
          </p>
        </div>

        <div
          ref={ref}
          className={`alpha-workflow-timeline ${isInView ? 'is-in-view' : ''}`}
        >
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <article
                key={step.title}
                className="alpha-workflow-timeline-item"
                style={{ transitionDelay: `${index * 90}ms` }}
              >
                <div className="alpha-workflow-timeline-marker">
                  <Icon className="h-4 w-4" />
                </div>
                <span className="alpha-workflow-timeline-index">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <strong>{step.title}</strong>
                <p>{step.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
