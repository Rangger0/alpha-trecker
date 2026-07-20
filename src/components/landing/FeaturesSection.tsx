import type { CSSProperties } from 'react';
import { BarChart3, BrainCircuit, Fingerprint, Radar, ShieldCheck, WalletCards } from 'lucide-react';

const featureItems = [
  {
    icon: BrainCircuit,
    title: 'AI Research',
    description: 'Turn funding, protocol, and social signals into structured project briefs.',
  },
  {
    icon: BarChart3,
    title: 'Funding Intelligence',
    description: 'Track backers, rounds, valuation signals, and capital flow before narratives peak.',
  },
  {
    icon: WalletCards,
    title: 'Wallet Scanner',
    description: 'Analyze wallet activity, chain coverage, balances, and historical interaction depth.',
  },
  {
    icon: ShieldCheck,
    title: 'Sybil Detection',
    description: 'Surface risky wallet patterns before they damage your eligibility strategy.',
  },
  {
    icon: Radar,
    title: 'Opportunity Score',
    description: 'Prioritize projects with a clean AI score built for research velocity.',
  },
  {
    icon: Fingerprint,
    title: 'Portfolio Tracker',
    description: 'Keep airdrops, research notes, claims, and active wallets in one command layer.',
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
          <p className="alpha-v2-kicker">Research Stack</p>
          <h2>Premium intelligence for Web3 operators.</h2>
          <span>
            Minimal, fast, and built around the workflows that serious researchers repeat every day.
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
