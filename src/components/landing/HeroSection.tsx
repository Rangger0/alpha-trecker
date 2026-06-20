import { ArrowRight, Coins, Network, ShieldCheck, Wallet } from 'lucide-react';

interface HeroSectionProps {
  onOpenAuth: (mode?: 'login' | 'register') => void;
}

const flowWords = ['Research', 'Execute', 'Track', 'Claim'];

export function HeroSection({ onOpenAuth }: HeroSectionProps) {
  return (
    <section className="alpha-rd-section alpha-rd-hero px-4 sm:px-6 lg:px-8">
      <div className="alpha-rd-glow" aria-hidden="true" />
      <div className="alpha-rd-width">
        <div className="alpha-rd-hero-grid">
          <div className="alpha-rd-hero-copy">
            <span className="alpha-rd-badge">
              <span className="alpha-rd-badge-dot" />
              Web3 Research OS
            </span>

            <div className="alpha-rd-hero-words" aria-hidden="true">
              {flowWords.map((word) => (
                <span key={word}>{word}</span>
              ))}
            </div>

            <h1 className="alpha-rd-hero-title">
              One workspace for serious <em>airdrop hunters.</em>
            </h1>

            <p className="alpha-rd-hero-lead">
              Research projects, monitor rewards, analyze wallets and detect sybil risk from a single workspace.
            </p>

            <div className="alpha-rd-actions">
              <button type="button" onClick={() => onOpenAuth('register')} className="alpha-rd-btn alpha-rd-btn-primary">
                Start Tracking
                <ArrowRight className="h-4 w-4" />
              </button>
              <a href="#preview" className="alpha-rd-btn alpha-rd-btn-ghost">
                View Demo
              </a>
            </div>
          </div>

          <div className="alpha-rd-visual" aria-hidden="true">
            <div className="alpha-rd-globe-wrap">
              <div className="alpha-rd-globe">
                <svg viewBox="0 0 200 200" fill="none">
                  <circle cx="100" cy="100" r="98" stroke="currentColor" strokeWidth="0.6" />
                  <ellipse cx="100" cy="100" rx="98" ry="34" stroke="currentColor" strokeWidth="0.6" />
                  <ellipse cx="100" cy="100" rx="98" ry="66" stroke="currentColor" strokeWidth="0.5" />
                  <ellipse cx="100" cy="100" rx="34" ry="98" stroke="currentColor" strokeWidth="0.6" />
                  <ellipse cx="100" cy="100" rx="66" ry="98" stroke="currentColor" strokeWidth="0.5" />
                  <line x1="2" y1="100" x2="198" y2="100" stroke="currentColor" strokeWidth="0.5" />
                  <line x1="100" y1="2" x2="100" y2="198" stroke="currentColor" strokeWidth="0.5" />
                  <circle cx="62" cy="58" r="2.4" fill="currentColor" />
                  <circle cx="140" cy="78" r="2.4" fill="currentColor" />
                  <circle cx="118" cy="140" r="2.4" fill="currentColor" />
                  <circle cx="74" cy="128" r="2.4" fill="currentColor" />
                  <path d="M62 58 L140 78 L118 140 L74 128 Z" stroke="currentColor" strokeWidth="0.5" opacity="0.6" />
                </svg>
              </div>

              <div className="alpha-rd-float-card alpha-rd-fc--funding">
                <div className="alpha-rd-fc-head"><Coins /> Funding</div>
                <div className="alpha-rd-fc-value">$1.2B+</div>
                <div className="alpha-rd-fc-sub">Tracked across 8,000+ projects</div>
              </div>

              <div className="alpha-rd-float-card alpha-rd-fc--wallet">
                <div className="alpha-rd-fc-head"><Wallet /> Wallet Intel</div>
                <div className="alpha-rd-fc-value">248 wallets</div>
                <div className="alpha-rd-bars">
                  {[40, 70, 55, 90, 65, 80, 50].map((h, i) => (
                    <span key={i} style={{ height: `${h}%` }} />
                  ))}
                </div>
              </div>

              <div className="alpha-rd-float-card alpha-rd-fc--sybil">
                <div className="alpha-rd-fc-head"><ShieldCheck /> Sybil Detector</div>
                <div className="alpha-rd-fc-value">Low risk</div>
                <span className="alpha-rd-chip">Score 12 / 100</span>
              </div>

              <div className="alpha-rd-float-card alpha-rd-fc--analytics">
                <div className="alpha-rd-fc-head"><Network /> Analytics</div>
                <div className="alpha-rd-fc-value">+38.4%</div>
                <div className="alpha-rd-fc-sub">Reward velocity (30d)</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
