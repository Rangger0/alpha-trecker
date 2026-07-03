import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HeroVisual } from './HeroVisual';

interface HeroSectionProps {
  onOpenAuth: (mode?: 'login' | 'register') => void;
}

export function HeroSection({ onOpenAuth }: HeroSectionProps) {
  return (
    <section className="alpha-landing-hero-section alpha-premium-hero alpha-saas-hero relative isolate px-4 sm:px-6 lg:px-8 py-20 sm:py-24 lg:py-32">
      <div className="macos-landing-width relative z-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left content */}
          <div className="space-y-8 animate-fade-in-up">
            {/* Badge */}
            <div>
              <span className="inline-block px-3 py-1.5 rounded-full text-xs font-semibold tracking-wider" style={{ 
                backgroundColor: 'color-mix(in srgb, var(--alpha-accent) 12%, transparent)',
                color: 'var(--alpha-accent)',
              }}>
                WEB3 RESEARCH OS
              </span>
            </div>

            {/* Sub-headline */}
            <div className="space-y-2">
              <p className="text-lg sm:text-xl font-semibold" style={{ color: 'var(--alpha-accent)' }}>
                Research.
              </p>
              <p className="text-lg sm:text-xl font-semibold" style={{ color: 'var(--alpha-accent)' }}>
                Execute.
              </p>
              <p className="text-lg sm:text-xl font-semibold" style={{ color: 'var(--alpha-accent)' }}>
                Track.
              </p>
              <p className="text-lg sm:text-xl font-semibold" style={{ color: 'var(--alpha-accent)' }}>
                Claim.
              </p>
            </div>

            {/* Main headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight" style={{ color: 'var(--alpha-text)' }}>
              One workspace for serious airdrop hunters.
            </h1>

            {/* Description */}
            <p className="text-lg sm:text-xl leading-relaxed" style={{ color: 'var(--alpha-text-muted)' }}>
              Research projects, monitor rewards, analyze wallets and detect sybil risk from a single workspace.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Button 
                type="button" 
                onClick={() => onOpenAuth('register')} 
                className="h-12 rounded-lg px-8 text-base font-semibold transition-all duration-200 hover:scale-105 active:scale-95" 
                style={{ 
                  backgroundColor: 'var(--alpha-accent)',
                  color: 'white',
                }}
              >
                Start Tracking
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>

              <a href="#showcase" className="flex">
                <Button 
                  variant="outline" 
                  className="h-12 rounded-lg px-8 text-base font-semibold transition-all duration-200 hover:scale-105 active:scale-95" 
                  style={{
                    borderColor: 'var(--alpha-border)',
                    color: 'var(--alpha-text)',
                    backgroundColor: 'transparent',
                  }}
                >
                  View Demo
                </Button>
              </a>
            </div>
          </div>

          {/* Right visual */}
          <div className="hidden lg:block">
            <HeroVisual />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
        }
      `}</style>
    </section>
  );
}
