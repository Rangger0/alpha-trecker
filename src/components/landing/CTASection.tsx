import { ArrowRight } from 'lucide-react';

interface CTASectionProps {
  onOpenAuth: (mode?: 'login' | 'register') => void;
}

export function CTASection({ onOpenAuth }: CTASectionProps) {
  return (
    <section className="alpha-rd-section px-4 sm:px-6 lg:px-8">
      <div className="alpha-rd-width">
        <div className="alpha-rd-cta-panel">
          <div className="alpha-rd-glow" aria-hidden="true" />
          <h2 className="alpha-rd-heading">Ready to hunt smarter?</h2>
          <p className="alpha-rd-subcopy">Everything you need to execute Web3 opportunities.</p>
          <button type="button" onClick={() => onOpenAuth('register')} className="alpha-rd-btn alpha-rd-btn-primary">
            Start Tracking
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
