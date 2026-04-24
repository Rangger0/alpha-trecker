import type { CSSProperties } from 'react';
import { ArrowLeftRight, LayoutDashboard, ShieldCheck, Trophy } from 'lucide-react';

const workflowItems = [
  {
    step: '01',
    icon: LayoutDashboard,
    title: 'Research',
    description: 'Start with market context, ecosystem coverage, and source discovery before the lane gets busy.',
    tags: ['Overview', 'Ecosystems', 'AI desk'],
  },
  {
    step: '02',
    icon: ShieldCheck,
    title: 'Tracking',
    description: 'Keep screening, eligibility, and wallet follow-up close to the signal instead of splitting it away.',
    tags: ['Screening', 'Eligibility', 'Rewards'],
  },
  {
    step: '03',
    icon: ArrowLeftRight,
    title: 'Execution',
    description: 'Move directly into tools, deploy flows, and bridge routes while the context is still visible.',
    tags: ['Deploy', 'Swap', 'Tools'],
  },
  {
    step: '04',
    icon: Trophy,
    title: 'Review',
    description: 'Close the loop with reward status, next actions, and a clearer read on what is worth repeating.',
    tags: ['Outcomes', 'Priority', 'Next actions'],
  },
];

const workflowNotes = [
  {
    label: 'Readable by default',
    value: 'The layout stays calm so the signal always wins over decoration.',
  },
  {
    label: 'Designed for repetition',
    value: 'Built for daily scanning, not just one impressive first impression.',
  },
  {
    label: 'One operating rhythm',
    value: 'Research, action, and review live inside the same visual language.',
  },
];

export function FeaturesSection() {
  return (
    <section id="workflow" className="px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
      <div className="macos-landing-width alpha-premium-section-shell">
        <div className="alpha-premium-section-header" data-stagger>
          <div className="space-y-4">
            <p className="macos-section-label">Product workflow</p>
            <h2 className="alpha-landing-section-title">
              The product is shaped like a disciplined workflow, not a pile of disconnected pages.
            </h2>
          </div>

          <p className="alpha-landing-section-copy alpha-premium-section-copy">
            Alpha Tracker organizes the full alpha loop into four clear lanes so you can scan, act, and review without losing context.
          </p>
        </div>

        <div className="alpha-premium-workflow-grid">
          {workflowItems.map((item, index) => (
            <article
              key={item.title}
              className="alpha-premium-workflow-card"
              data-stagger
              style={{ '--stagger-delay': `${index * 90}ms` } as CSSProperties}
            >
              <div className="alpha-premium-workflow-card-top">
                <span className="alpha-premium-step-pill">{item.step}</span>
                <div className="alpha-premium-workflow-icon">
                  <item.icon className="h-4 w-4" />
                </div>
              </div>

              <h3 className="alpha-premium-workflow-title">{item.title}</h3>
              <p className="alpha-premium-workflow-copy">{item.description}</p>

              <div className="alpha-premium-chip-row">
                {item.tags.map((tag) => (
                  <span key={tag} className="alpha-premium-chip">
                    {tag}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>

        <div className="alpha-premium-workflow-rail" data-stagger style={{ '--stagger-delay': '220ms' } as CSSProperties}>
          {workflowNotes.map((item) => (
            <article key={item.label} className="alpha-premium-note-card">
              <p className="alpha-premium-note-label">{item.label}</p>
              <p className="alpha-premium-note-value">{item.value}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
