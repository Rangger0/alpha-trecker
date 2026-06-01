import type { CSSProperties } from 'react';
import { ArrowRight, Layers3, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const promises = [
  {
    icon: Layers3,
    label: 'One operating layer',
    value: 'Research, tracking, and execution stay connected.',
  },
  {
    icon: ShieldCheck,
    label: 'Built for follow-through',
    value: 'The workflow ends in review, not in a lost note.',
  },
];

export function CTASection() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
      <div className="macos-landing-width alpha-premium-cta-shell" data-stagger>
        <div className="alpha-premium-cta-grid">
          <div className="space-y-4">
            <p className="macos-section-label">Start</p>
            <h2 className="alpha-landing-section-title">
              One Workspace. One Workflow. One Source of Truth.
            </h2>
            <p className="alpha-landing-section-copy">
              Alpha Tracker gives disciplined operators a single place to research, track, execute, and review.
            </p>
          </div>

          <div className="alpha-premium-cta-side">
            <div className="alpha-premium-cta-actions">
              <Link to="/register">
                <Button
                  className="macos-btn h-11 rounded-full px-7 text-sm font-semibold"
                  style={{
                    background: 'var(--alpha-accent-to)',
                    color: 'var(--alpha-accent-contrast)',
                    border: '1px solid color-mix(in srgb, var(--alpha-accent-to) 72%, transparent)',
                  }}
                >
                  Start Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>

              <Link to="/login">
                <Button
                  variant="outline"
                  className="macos-btn h-11 rounded-full px-7 text-sm font-semibold"
                  style={{
                    borderColor: 'color-mix(in srgb, var(--alpha-border) 88%, transparent)',
                    background: 'color-mix(in srgb, var(--alpha-surface) 88%, transparent)',
                    color: 'var(--alpha-text)',
                  }}
                >
                  Sign In
                </Button>
              </Link>
            </div>

            <div className="alpha-premium-cta-promises">
              {promises.map((item, index) => (
                <article
                  key={item.label}
                  className="alpha-premium-cta-promise"
                  data-stagger
                  style={{ '--stagger-delay': `${index * 80}ms` } as CSSProperties}
                >
                  <div className="alpha-premium-mini-metric-icon">
                    <item.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="alpha-premium-note-label">{item.label}</p>
                    <p className="alpha-premium-note-value">{item.value}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
