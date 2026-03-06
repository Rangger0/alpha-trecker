import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export function CTASection() {
  return (
    <section className="px-4 py-24 sm:px-6 lg:px-8">
      <div
        className="macos-landing-card mx-auto max-w-4xl rounded-[2rem] px-8 py-12 text-center sm:px-12"
        style={{
          borderColor: 'color-mix(in srgb, var(--alpha-border) 86%, transparent)',
          background:
            'linear-gradient(180deg, color-mix(in srgb, var(--alpha-surface) 96%, transparent), color-mix(in srgb, var(--alpha-panel) 90%, transparent))',
        }}
      >
        <h2
          className="mb-4 text-3xl font-semibold tracking-[-0.03em] sm:text-4xl"
          style={{ color: 'var(--alpha-text)' }}
        >
          Ready to Supercharge Your Web3 Journey?
        </h2>
        <p className="mb-8 text-lg leading-8" style={{ color: 'var(--alpha-text-muted)' }}>
          Join thousands of enthusiasts who are already using Alpha Tracker to manage their projects and maximize opportunities.
        </p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link to="/register">
            <Button
              className="macos-btn h-12 rounded-full px-8 text-base font-semibold transition-opacity duration-150 hover:opacity-92"
              style={{
                background:
                  'linear-gradient(135deg, var(--alpha-accent-from), color-mix(in srgb, var(--alpha-accent-to) 78%, var(--alpha-accent) 22%))',
                color: 'var(--alpha-accent-contrast)',
              }}
            >
              Get Started Free
            </Button>
          </Link>

          <a href="#features">
            <Button
              variant="outline"
              className="macos-btn h-12 rounded-full px-8 text-base font-semibold transition-opacity duration-150 hover:opacity-85"
              style={{
                borderColor: 'color-mix(in srgb, var(--alpha-border) 88%, transparent)',
                background: 'color-mix(in srgb, var(--alpha-surface) 86%, transparent)',
                color: 'var(--alpha-text)',
              }}
            >
              Learn More <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}
