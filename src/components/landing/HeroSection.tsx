import { ArrowRight, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HeroVisual } from './HeroVisual';

interface HeroSectionProps {
  onOpenAuth: (mode?: 'login' | 'register') => void;
}

export function HeroSection({ onOpenAuth }: HeroSectionProps) {
  return (
    <section className="alpha-v2-hero relative isolate overflow-hidden px-4 pb-14 pt-28 sm:px-6 sm:pb-20 sm:pt-32 lg:px-8 lg:pb-24 lg:pt-36">
      <div className="alpha-v2-city-bg" aria-hidden="true" />
      <div className="alpha-v2-grid-bg" aria-hidden="true" />
      <div className="macos-landing-width relative z-20">
        <div className="grid items-center gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-10 xl:gap-16">
          <div className="alpha-v2-hero-copy space-y-8">
            <span className="alpha-v2-kicker">AI-powered Web3 research platform</span>

            <div className="space-y-5">
              <h1 className="alpha-v2-headline">
                <span>Discover.</span>
                <span>Analyze.</span>
                <span>Track.</span>
              </h1>
              <h2 className="alpha-v2-subheadline">
                Web3 Opportunities
                <br />
                Powered by AI.
              </h2>
            </div>

            <p className="alpha-v2-lead">
              Alpha Tracker helps researchers discover high-potential Web3 projects using AI, on-chain analytics,
              funding intelligence, and wallet analysis.
            </p>

            <div className="flex flex-col gap-4 pt-2 sm:flex-row">
              <Button 
                type="button" 
                onClick={() => onOpenAuth('register')} 
                className="alpha-v2-primary-btn h-13 rounded-lg px-8 py-6 text-base font-semibold"
              >
                Start Research
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>

              <a href="/dashboard" className="flex">
                <Button 
                  variant="outline" 
                  className="alpha-v2-secondary-btn h-13 rounded-lg px-8 py-6 text-base font-semibold"
                >
                  Open Dashboard
                  <LayoutDashboard className="ml-2 h-4 w-4" />
                </Button>
              </a>
            </div>

            <div className="alpha-v2-hero-strip">
              {['Funding Analysis', 'Wallet Scanner', 'AI Research', 'Opportunity Score'].map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </div>

          <div className="min-w-0">
            <HeroVisual />
          </div>
        </div>
      </div>
    </section>
  );
}
