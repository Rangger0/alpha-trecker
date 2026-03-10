import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export function CTASection() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
      <div className="macos-landing-width alpha-landing-cta-shell" data-stagger>
        <div className="max-w-[38rem] space-y-4">
          <p className="macos-section-label">Start</p>
          <h2 className="alpha-landing-section-title">
            Use one workspace for research, tracking, execution, and review.
          </h2>
          <p className="alpha-landing-section-copy">
            Alpha Tracker keeps the workflow in one product from first signal to reward follow-up.
          </p>
        </div>

        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <Link to="/register">
            <Button
              className="macos-btn h-11 rounded-full px-7 text-sm font-semibold"
              style={{
                background: 'var(--alpha-accent-to)',
                color: 'var(--alpha-accent-contrast)',
                border: '1px solid color-mix(in srgb, var(--alpha-accent-to) 72%, transparent)',
              }}
            >
              Create Account
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
      </div>
    </section>
  );
}
