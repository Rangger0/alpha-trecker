import { useInView } from '@/hooks/use-in-view';

const TRUSTED_LOGOS = [
  { name: 'Ethereum', logo: '/logos/ethereum.png' },
  { name: 'Solana', logo: '/logos/solana.png' },
  { name: 'BNB Chain', logo: '/logos/bnbchain.png' },
  { name: 'Base', logo: '/logos/base.png' },
  { name: 'Arbitrum', logo: '/logos/arbitrum.png' },
  { name: 'Optimism', logo: '/logos/optimism.png' },
  { name: 'Avalanche', logo: '/logos/avalanche.png' },
  { name: 'Polygon', logo: '/logos/polygon.png' },
  { name: 'Hyperliquid', logo: '/logos/hyperliquid.png' },
  { name: 'Monad', logo: '/logos/monad.png' },
  { name: 'Sui', logo: '/logos/sui.png' },
  { name: 'Aptos', logo: '/logos/aptos.png' },
];

export function SocialProofSection() {
  const { ref } = useInView();

  return (
    <section
      ref={ref}
      className="alpha-saas-section px-4 sm:px-6 lg:px-8 py-12 sm:py-16 border-b"
      style={{
        borderColor: 'var(--alpha-border)',
        backgroundColor: 'color-mix(in srgb, var(--alpha-panel) 30%, transparent)',
      }}
    >
      <div className="macos-landing-width">
        <p className="text-center text-sm font-medium mb-10" style={{ color: 'var(--alpha-text-muted)' }}>
          Trusted by Web3 researchers
        </p>

        <div className="alpha-logo-marquee-wrapper rounded-3xl border border-[color:var(--alpha-border)] bg-[color:var(--alpha-surface)] p-4 shadow-[var(--alpha-shadow)]">
          <div className="alpha-logo-marquee" aria-label="Trusted by logos">
            <div className="alpha-logo-marquee-track">
              {TRUSTED_LOGOS.concat(TRUSTED_LOGOS).map((partner, index) => (
                <div key={`${partner.name}-${index}`} className="alpha-logo-marquee-item">
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    loading="lazy"
                    decoding="async"
                    className="alpha-logo-marquee-image"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .alpha-logo-marquee-wrapper {
          overflow: hidden;
          position: relative;
        }

        .alpha-logo-marquee {
          overflow: hidden;
          position: relative;
        }

        .alpha-logo-marquee::before,
        .alpha-logo-marquee::after {
          content: '';
          position: absolute;
          top: 0;
          bottom: 0;
          width: 4rem;
          pointer-events: none;
          background: linear-gradient(90deg, var(--alpha-bg) 0%, transparent 100%);
          z-index: 1;
        }

        .alpha-logo-marquee::after {
          right: 0;
          transform: rotate(180deg);
        }

        .alpha-logo-marquee-track {
          display: flex;
          align-items: center;
          gap: 2rem;
          white-space: nowrap;
          animation: alpha-marquee 36s linear infinite;
          padding: 0.25rem 0;
        }

        .alpha-logo-marquee-wrapper:hover .alpha-logo-marquee-track {
          animation-play-state: paused;
        }

        .alpha-logo-marquee-item {
          flex: 0 0 auto;
          width: 9rem;
          height: 3.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0.7;
          transition: opacity 200ms ease, transform 200ms ease;
        }

        .alpha-logo-marquee-item:hover {
          opacity: 1;
          transform: translateY(-1px);
        }

        .alpha-logo-marquee-image {
          max-height: 2rem;
          max-width: 100%;
          filter: grayscale(100%) brightness(1.1) contrast(1.1) opacity(0.75);
          transition: filter 200ms ease, opacity 200ms ease;
        }

        .alpha-logo-marquee-item:hover .alpha-logo-marquee-image {
          filter: grayscale(0%) brightness(1.05) contrast(1.05) opacity(1);
        }

        @keyframes alpha-marquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </section>
  );
}
