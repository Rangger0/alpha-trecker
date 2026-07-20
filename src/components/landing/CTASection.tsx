import { useState } from 'react';
import { ArrowRight, BrainCircuit, ScanLine } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const mascotSources = ['/alpha-mascot-cta-transparent.png', '/alpha-mascot-cta.webp', '/alpha-default.webp', '/alpha-thinking.webp', '/alpha-mascot.webp', '/mascot.webp', '/mascot.png'];

export function CTASection() {
  const [mascotIndex, setMascotIndex] = useState(0);
  const mascotSrc = mascotSources[mascotIndex];

  return (
    <section id="docs" className="alpha-v2-cta-section px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="macos-landing-width">
        <div className="alpha-v2-cta">
          <div className="alpha-v2-cta-copy">
            <p className="alpha-v2-kicker">Command Center Online</p>
            <h2>Ready to Find Your Next Alpha?</h2>
            <p>
              Join the research layer built for AI-assisted discovery, wallet analysis, and funding intelligence.
            </p>
            <Link to="/register">
              <Button className="alpha-v2-primary-btn h-13 rounded-lg px-8 py-6 text-base font-semibold">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="alpha-v2-cta-visual">
            {mascotSrc ? (
              <img
                src={mascotSrc}
                alt="Alpha Tracker official mascot"
                onError={() => setMascotIndex((current) => current + 1)}
              />
            ) : (
              <div className="alpha-v2-cta-placeholder">
                <img src="/logo/logo.png" alt="" className="h-14 w-14 object-contain" />
              </div>
            )}
            <div className="alpha-v2-cta-chip alpha-v2-cta-chip--one">
              <BrainCircuit className="h-4 w-4" />
              AI Research
            </div>
            <div className="alpha-v2-cta-chip alpha-v2-cta-chip--two">
              <ScanLine className="h-4 w-4" />
              Wallet Scanner
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
