import type { CSSProperties } from 'react';
import { ArrowRight, BarChart3, CheckCircle2, Database, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

const heroStats = [
  { label: 'Research', value: 'Signal intake' },
  { label: 'Execution', value: 'Action queue' },
  { label: 'Review', value: 'Reward ledger' },
];

const deskItems = [
  { icon: BarChart3, label: 'Priority projects', value: 'Active research lanes' },
  { icon: ShieldCheck, label: 'Eligibility', value: 'Wallet follow-up' },
  { icon: Database, label: 'Source of truth', value: 'One workspace' },
];

export function HeroSection() {
  const scrollToAuth = () => {
    document.getElementById('auth')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section className="alpha-landing-hero-section alpha-premium-hero relative isolate overflow-hidden px-4 sm:px-6 lg:px-8">
      <div className="alpha-landing-hero-atmosphere" aria-hidden="true">
        <span className="alpha-premium-hero-gridline" />
      </div>

      <div className="macos-landing-width relative z-20">
        <div className="alpha-premium-hero-grid alpha-premium-hero-grid--product">
          <div
            className="alpha-landing-hero-copy alpha-premium-copy alpha-premium-copy--header macos-landing-enter"
            style={{ '--enter-delay': '40ms' } as CSSProperties}
          >
            <span className="macos-page-kicker alpha-landing-kicker">
              Disciplined crypto research & execution workspace
            </span>

            <h1 className="alpha-landing-headline alpha-premium-headline">
              Discipline beats luck.
            </h1>

            <p className="alpha-landing-lead alpha-premium-lead">
              Research projects, track funding, manage execution, and review outcomes from a single workspace.
            </p>

            <div className="alpha-landing-hero-actions alpha-premium-actions">
              <Button type="button" onClick={scrollToAuth} className="macos-btn h-11 rounded-full px-7 text-sm font-semibold">
                Start Tracking
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>

              <a href="#features">
                <Button variant="outline" className="macos-btn alpha-btn-secondary h-11 rounded-full px-7 text-sm font-semibold">
                  Explore Features
                </Button>
              </a>
            </div>
          </div>

          <div className="alpha-hero-product-preview macos-landing-enter" style={{ '--enter-delay': '140ms' } as CSSProperties}>
            <div className="alpha-hero-product-toolbar">
              <div className="flex items-center gap-2">
                <span className="alpha-window-dot" />
                <span className="alpha-window-dot" />
                <span className="alpha-window-dot" />
              </div>
              <span>Alpha Tracker Dashboard</span>
              <span className="hidden sm:inline">Live workspace preview</span>
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

            <div className="alpha-hero-desk-grid">
              {deskItems.map((item) => (
                <article key={item.label} className="alpha-hero-desk-card">
                  <item.icon className="h-4 w-4" />
                  <div>
                    <p>{item.label}</p>
                    <span>{item.value}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="alpha-premium-stat-grid alpha-premium-stat-grid--hero macos-landing-enter" style={{ '--enter-delay': '220ms' } as CSSProperties}>
            {heroStats.map((item, index) => (
              <article key={item.label} className="alpha-premium-stat-card" style={{ '--stagger-delay': `${index * 80}ms` } as CSSProperties}>
                <p className="alpha-premium-stat-label">{item.label}</p>
                <p className="alpha-premium-stat-value">
                  <CheckCircle2 className="h-4 w-4" />
                  {item.value}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
