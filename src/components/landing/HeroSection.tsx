import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeroSectionProps {
  onOpenAuth: (mode?: 'login' | 'register') => void;
}

export function HeroSection({ onOpenAuth }: HeroSectionProps) {
  return (
    <section className="alpha-landing-hero-section alpha-premium-hero alpha-saas-hero relative isolate px-4 sm:px-6 lg:px-8">
      <div className="macos-landing-width relative z-20">
        <div className="alpha-premium-hero-grid alpha-premium-hero-grid--product alpha-mission-hero-grid">
          <div className="alpha-landing-hero-copy alpha-premium-copy alpha-premium-copy--header">
            <span className="macos-page-kicker alpha-landing-kicker">
              Web3 Research Mission Control
            </span>

            <h1 className="alpha-landing-headline alpha-premium-headline">
              <span>One workspace</span>
              <span>for serious airdrop hunters.</span>
            </h1>

            <p className="alpha-landing-lead alpha-premium-lead">
              Track projects, manage wallets, review eligibility, and monitor rewards from a single workspace.
            </p>

            <div className="alpha-landing-hero-actions alpha-premium-actions">
              <Button type="button" onClick={() => onOpenAuth('register')} className="macos-btn h-11 rounded-full px-7 text-sm font-semibold">
                Start Tracking
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>

              <a href="#preview">
                <Button variant="outline" className="macos-btn alpha-btn-secondary h-11 rounded-full px-7 text-sm font-semibold">
                  Explore Workspace
                </Button>
              </a>
            </div>
          </div>

          <div className="alpha-hero-product-preview alpha-mission-dashboard-preview">
            <div className="alpha-hero-product-toolbar">
              <div className="flex items-center gap-2">
                <span className="alpha-window-dot" />
                <span className="alpha-window-dot" />
                <span className="alpha-window-dot" />
              </div>
              <span>Alpha Tracker Dashboard</span>
              <span className="hidden sm:inline">Public demo preview</span>
            </div>

            <div className="alpha-hero-product-image-wrap">
              <img
                src="/3.webp"
                alt="Alpha Tracker dashboard preview"
                className="alpha-hero-product-image"
                loading="eager"
                decoding="async"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
