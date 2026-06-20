import { Bot, FileSearch, LineChart, ShieldCheck, WalletCards, Wallet } from 'lucide-react';

const featureItems = [
  {
    icon: FileSearch,
    title: 'Research Hub',
    description: 'Funding, ecosystem, and project intel in one place.',
  },
  {
    icon: WalletCards,
    title: 'Wallet Matrix',
    description: 'Manage many wallets grouped by project.',
  },
  {
    icon: LineChart,
    title: 'Reward Tracker',
    description: 'Track rewards, claims, and payouts over time.',
  },
  {
    icon: ShieldCheck,
    title: 'Sybil Detector',
    description: 'Review wallet behavior before farming.',
  },
  {
    icon: Wallet,
    title: 'Funding Analyzer',
    description: 'See who funded a project and how much.',
  },
  {
    icon: Bot,
    title: 'AI Research Agent',
    description: 'Summarize projects and surface signals fast.',
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="alpha-rd-section px-4 sm:px-6 lg:px-8">
      <div className="alpha-rd-width">
        <div className="alpha-rd-section-head">
          <span className="alpha-rd-eyebrow">Features</span>
          <h2 className="alpha-rd-heading">Everything you need. Nothing you don't.</h2>
        </div>

        <div className="alpha-rd-feature-grid">
          {featureItems.map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.title} className="alpha-rd-feature-card">
                <div className="alpha-rd-feature-icon">
                  <Icon className="h-5 w-5" />
                </div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
