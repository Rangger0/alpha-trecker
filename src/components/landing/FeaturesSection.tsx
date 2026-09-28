import type { CSSProperties } from 'react';
import { BarChart3, BrainCircuit, Fingerprint, Radar, ShieldCheck, WalletCards } from 'lucide-react';

const featureItems = [
  {
    icon: BrainCircuit,
    title: 'Research',
    description: 'Turn market signals into structured insight without the noise.',
  },
  {
    icon: WalletCards,
    title: 'Wallet tracking',
    description: 'Monitor wallets, balances, and project activity on the same view.',
  },
  {
    icon: BarChart3,
    title: 'Opportunity score',
    description: 'Prioritize the projects that deserve attention and follow-up.',
  },
  {
    icon: ShieldCheck,
    title: 'Risk review',
    description: 'Keep eligibility and project health checks easier to compare.',
  },
  {
    icon: Radar,
    title: 'Project signals',
    description: 'Combine funding, status, and momentum in one clean workflow.',
  },
  {
    icon: Fingerprint,
    title: 'Portfolio view',
    description: 'Keep airdrops, claims, and project notes in one place.',
  },
];

const networks = [
  { name: 'Ethereum', logo: '/logos/ethereum.png' },
  { name: 'Solana', logo: '/logos/solana.png' },
  { name: 'Base', logo: '/logos/base.png' },
  { name: 'Arbitrum', logo: '/logos/arbitrum.png' },
  { name: 'Optimism' },
  { name: 'Polygon', logo: '/logos/polygon.png' },
];

export function FeaturesSection() {
  return (
    <section id="features" className="alpha-v2-section px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="macos-landing-width">
        <div className="alpha-v2-section-header">
          <p className="alpha-v2-kicker">Research stack</p>
          <h2>Built for focused Web3 tracking.</h2>
          <span>
            Keep project discovery, funding signals, wallet activity, and opportunity review in one clean workflow.
          </span>
        </div>

        <div className="alpha-v2-feature-grid">
          {featureItems.map((item, index) => (
            <article
              key={item.title}
              className="alpha-v2-feature-card"
              style={{ '--stagger-delay': `${index * 70}ms` } as CSSProperties}
            >
              <div className="alpha-v2-feature-icon">
                <item.icon className="h-5 w-5" />
              </div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>

        <div id="projects" className="alpha-v2-networks">
          <p>Supported Networks</p>
          <div>
            {networks.map((network) => (
              <span key={network.name} className="alpha-v2-network-chip">
                {'logo' in network ? (
                  <img src={network.logo} alt="" className="h-7 w-7 rounded-full object-contain" />
                ) : (
                  <i aria-hidden="true">OP</i>
                )}
                {network.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
