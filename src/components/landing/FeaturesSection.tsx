import type { CSSProperties } from 'react';
import { BarChart3, FileSearch, ShieldCheck } from 'lucide-react';

const featureItems = [
  {
    icon: FileSearch,
    title: 'Research',
    description: 'Discover and analyze opportunities with the project context, signals, and notes that matter.',
  },
  {
    icon: ShieldCheck,
    title: 'Tracking',
    description: 'Monitor funding, tasks, wallets, and execution status without splitting the workflow across tabs.',
  },
  {
    icon: BarChart3,
    title: 'Review',
    description: 'Review outcomes, understand what worked, and improve decision making for the next cycle.',
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
      <div className="macos-landing-width alpha-premium-section-shell">
        <div className="alpha-premium-section-header" data-stagger>
          <div className="space-y-4">
            <p className="macos-section-label">Features</p>
            <h2 className="alpha-landing-section-title">A premium workflow for disciplined crypto operators.</h2>
          </div>

          <p className="alpha-landing-section-copy alpha-premium-section-copy">
            Alpha Tracker keeps the research loop simple: understand the opportunity, track the work, then review the outcome.
          </p>
        </div>

        <div className="alpha-core-feature-grid alpha-core-feature-grid--three">
          {featureItems.map((item, index) => (
            <article
              key={item.title}
              className="alpha-core-feature-card"
              data-stagger
              style={{ '--stagger-delay': `${index * 70}ms` } as CSSProperties}
            >
              <div className="alpha-core-feature-icon">
                <item.icon className="h-5 w-5" />
              </div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
