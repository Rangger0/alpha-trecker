import type { CSSProperties } from 'react';

const ecosystems = [
  { name: 'Ethereum', logo: '/logos/ethereum.png' },
  { name: 'Arbitrum', logo: '/logos/arbitrum.png' },
  { name: 'Base', logo: '/logos/base.png' },
  { name: 'Optimism', logo: '' },
  { name: 'Polygon', logo: '/logos/polygon.png' },
  { name: 'BNB Chain', logo: '/logos/bnbchain.png' },
  { name: 'Sui', logo: '/logos/sui.png' },
  { name: 'Monad', logo: '/logos/monad.png' },
  { name: 'Berachain', logo: '/logos/berachain.png' },
];

export function ProjectsMarquee() {
  return (
    <section id="ecosystems" className="px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
      <div className="macos-landing-width alpha-premium-section-shell">
        <div className="alpha-premium-section-header" data-stagger>
          <div className="space-y-4">
            <p className="macos-section-label">Supported ecosystems</p>
            <h2 className="alpha-landing-section-title">Built for the chains where serious users spend time.</h2>
          </div>

          <p className="alpha-landing-section-copy alpha-premium-section-copy">
            Ethereum mainnet, L2s, emerging ecosystems, and reward-heavy networks can live inside one operating workflow.
          </p>
        </div>

        <div className="alpha-ecosystem-grid">
          {ecosystems.map((ecosystem, index) => (
            <article
              key={ecosystem.name}
              className="alpha-ecosystem-tile"
              data-stagger
              style={{ '--stagger-delay': `${index * 55}ms` } as CSSProperties}
            >
              <div className="alpha-ecosystem-logo">
                {ecosystem.logo ? (
                  <img src={ecosystem.logo} alt={ecosystem.name} loading="lazy" decoding="async" />
                ) : (
                  <span>{ecosystem.name.slice(0, 2).toUpperCase()}</span>
                )}
              </div>
              <p>{ecosystem.name}</p>
              <span>Supported lane</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
