import type { CSSProperties } from 'react';
import { BarChart3, FileSearch, ShieldCheck, WalletCards } from 'lucide-react';

const featureItems = [
  {
    icon: FileSearch,
    title: 'Research Hub',
    description: 'Collect funding, ecosystem, and project data.',
  },
  {
    icon: WalletCards,
    title: 'Wallet Matrix',
    description: 'Manage multiple wallets across projects.',
  },
  {
    icon: BarChart3,
    title: 'Reward Ledger',
    description: 'Track rewards, claims, and payouts.',
  },
  {
    icon: ShieldCheck,
    title: 'Detect Sybil Risks',
    description: 'Review wallet behavior before farming.',
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="alpha-saas-section alpha-mission-section px-4 sm:px-6 lg:px-8">
      <div className="macos-landing-width alpha-premium-section-shell">
        <div className="alpha-premium-section-header" data-stagger>
          <div className="space-y-4">
            <p className="macos-section-label">Features</p>
            <h2 className="alpha-landing-section-title">The core tools, without the noise.</h2>
          </div>

          <p className="alpha-landing-section-copy alpha-premium-section-copy">
            Alpha Tracker replaces scattered spreadsheets and notes with a focused workflow for airdrop execution.
          </p>
        </div>

        <div className="alpha-core-feature-grid alpha-core-feature-grid--four">
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
