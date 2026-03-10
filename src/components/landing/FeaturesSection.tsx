import { ArrowLeftRight, LayoutDashboard, ShieldCheck, Trophy } from 'lucide-react';

const workflowItems = [
  {
    icon: LayoutDashboard,
    title: 'Research',
    description: 'Start from overview, ecosystem coverage, and sources in one place.',
  },
  {
    icon: ShieldCheck,
    title: 'Tracking',
    description: 'Keep screening, eligibility, and wallet follow-up attached to the work.',
  },
  {
    icon: ArrowLeftRight,
    title: 'Execution',
    description: 'Move into tools, deploy, and swap flows without leaving the product.',
  },
  {
    icon: Trophy,
    title: 'Review',
    description: 'Return to reward status and next actions after execution is done.',
  },
];

export function FeaturesSection() {
  return (
    <section id="workflow" className="px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
      <div className="macos-landing-width space-y-8">
        <div className="max-w-[42rem] space-y-4">
          <p className="macos-section-label">Product workflow</p>
          <h2 className="alpha-landing-section-title">
            Alpha Tracker is organized around one loop: research, tracking, execution, and review.
          </h2>
          <p className="alpha-landing-section-copy">
            Each surface has a clear job, so the product stays readable from first signal to follow-up.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {workflowItems.map((item) => (
            <div key={item.title} className="space-y-3" data-stagger>
              <h3 className="alpha-landing-block-title">{item.title}</h3>
              <article className="alpha-landing-minimal-card">
                <div className="alpha-landing-icon-badge">
                  <item.icon className="h-4 w-4" />
                </div>
                <p className="mt-4 text-sm leading-7 text-[var(--alpha-text-muted)]">
                  {item.description}
                </p>
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
