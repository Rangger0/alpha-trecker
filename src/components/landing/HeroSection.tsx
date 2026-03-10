import type { CSSProperties } from 'react';
import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PREDEFINED_ECOSYSTEMS } from '@/lib/ecosystems';

const workflowRows = [
  {
    label: 'Research',
    value: 'Overview, ecosystems, AI tools',
  },
  {
    label: 'Tracking',
    value: 'Screening, eligibility, reward vault',
  },
  {
    label: 'Execution',
    value: 'Tools, deploy, swap & bridge',
  },
  {
    label: 'Review',
    value: 'Next actions and reward follow-up',
  },
];

const starDots = [
  { top: '14%', left: '16%' },
  { top: '22%', left: '72%' },
  { top: '38%', left: '58%' },
  { top: '62%', left: '82%' },
  { top: '72%', left: '24%' },
];

const shootingStars = [
  { top: '8%', left: '18%', delay: '1.4s', duration: '15s', distanceX: '152px', distanceY: '96px', length: '180px' },
  { top: '16%', left: '52%', delay: '4.8s', duration: '17s', distanceX: '176px', distanceY: '112px', length: '220px' },
  { top: '22%', left: '78%', delay: '7.2s', duration: '19s', distanceX: '132px', distanceY: '86px', length: '168px' },
  { top: '42%', left: '62%', delay: '10.5s', duration: '18s', distanceX: '146px', distanceY: '92px', length: '194px' },
  { top: '54%', left: '28%', delay: '12.8s', duration: '16s', distanceX: '164px', distanceY: '102px', length: '208px' },
  { top: '70%', left: '72%', delay: '15.6s', duration: '18s', distanceX: '118px', distanceY: '74px', length: '156px' },
];

export function HeroSection() {
  const logoFieldRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frameId = 0;
    const logoField = logoFieldRef.current;
    if (!logoField) {
      return undefined;
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const applyMotion = () => {
      const scrollProgress = Math.min(window.scrollY / 720, 1);
      const logoOpacity = Math.max(0.22, 0.58 - scrollProgress * 0.2);
      const logoShift = scrollProgress * 30;
      const logoScale = 1.08 - scrollProgress * 0.05;

      logoField.style.opacity = `${logoOpacity}`;
      logoField.style.transform = `translate3d(0, ${logoShift}px, 0) scale(${logoScale})`;
    };

    const syncScroll = () => {
      if (frameId !== 0) {
        return;
      }

      frameId = window.requestAnimationFrame(() => {
        applyMotion();
        frameId = 0;
      });
    };

    if (prefersReducedMotion) {
      logoField.style.opacity = '0.58';
      logoField.style.transform = 'translate3d(0, 0, 0) scale(1.08)';
      return undefined;
    }

    applyMotion();
    window.addEventListener('scroll', syncScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', syncScroll);
      if (frameId !== 0) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, []);

  return (
    <section className="alpha-landing-hero-section relative isolate overflow-hidden px-4 pb-16 pt-10 sm:px-6 lg:px-8 lg:pb-24 lg:pt-14">
      <div className="alpha-landing-hero-atmosphere" aria-hidden="true">
        {starDots.map((dot) => (
          <span
            key={`${dot.top}-${dot.left}`}
            className="alpha-landing-star-dot"
            style={{ top: dot.top, left: dot.left } as CSSProperties}
          />
        ))}

        {shootingStars.map((star, index) => (
          <span
            key={`${star.top}-${star.left}-${index}`}
            className="alpha-landing-sky-streak"
            style={{
              top: star.top,
              left: star.left,
              '--shoot-delay': star.delay,
              '--shoot-duration': star.duration,
              '--shoot-distance-x': star.distanceX,
              '--shoot-distance-y': star.distanceY,
              '--shoot-length': star.length,
            } as CSSProperties}
          />
        ))}

        <div
          ref={logoFieldRef}
          className="alpha-landing-logo-field"
          style={{
            opacity: 0.58,
            transform: 'translate3d(0, 0, 0) scale(1.08)',
          }}
        >
          <div className="alpha-landing-logo-spin">
            <span className="alpha-landing-logo-sheen" />
            <div className="alpha-landing-jupiter-shell">
              <span className="alpha-landing-jupiter-band alpha-landing-jupiter-band--one" />
              <span className="alpha-landing-jupiter-band alpha-landing-jupiter-band--two" />
              <span className="alpha-landing-jupiter-band alpha-landing-jupiter-band--three" />
              <span className="alpha-landing-jupiter-band alpha-landing-jupiter-band--four" />
              <span className="alpha-landing-jupiter-ring" />
              <span className="alpha-landing-jupiter-ring alpha-landing-jupiter-ring--lower" />

              <div className="alpha-landing-logo-core">
                <img
                  src="/logo/logo.png"
                  alt=""
                  aria-hidden="true"
                  className="alpha-brand-logo alpha-landing-logo-mark relative z-10 h-[44%] w-[44%] object-contain"
                  loading="eager"
                  decoding="async"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="macos-landing-width relative z-20">
        <div className="alpha-landing-hero-stack">
          <div className="alpha-landing-hero-copy alpha-landing-hero-copy--center space-y-6">
            <span className="macos-page-kicker alpha-landing-kicker">
              <Sparkles className="h-7.5 w-7.5" />
              Alpha Tracker
            </span>

            <h1 className="alpha-landing-headline">
              <span className="alpha-landing-headline-line alpha-landing-headline-line--primary">
                Research, track, execute, and review
              </span>
              <span className="alpha-landing-headline-line alpha-landing-headline-line--accent alpha-landing-headline-accent">
                crypto opportunities
              </span>
            </h1>

            <p className="alpha-landing-lead">
              Alpha Tracker keeps research, tracking, execution, and review in one workspace so crypto work stays
              structured.
            </p>

            <div className="alpha-landing-hero-actions">
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

              <a href="#workflow">
                <Button
                  variant="outline"
                  className="macos-btn h-11 rounded-full px-7 text-sm font-semibold"
                  style={{
                    borderColor: 'color-mix(in srgb, var(--alpha-border) 88%, transparent)',
                    background: 'color-mix(in srgb, var(--alpha-surface) 88%, transparent)',
                    color: 'var(--alpha-text)',
                  }}
                >
                  View Workflow
                </Button>
              </a>
            </div>

            <p className="alpha-landing-hero-meta alpha-landing-hero-meta--center">
              Tracks {PREDEFINED_ECOSYSTEMS.length}+ ecosystems inside the same research and execution workflow.
            </p>
          </div>

          <div className="alpha-landing-hero-stage">
            <div className="alpha-landing-hero-stage-glow" aria-hidden="true" />
            <div className="alpha-landing-hero-panel alpha-landing-hero-panel--showcase">
              <div className="alpha-landing-hero-panel-header">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--alpha-text-muted)]">
                  Inside the product
                </p>
                <span className="alpha-landing-status-pill">Core workflow</span>
              </div>

              <div className="mt-5 space-y-3">
                {workflowRows.map((item) => (
                  <div key={item.label} className="alpha-landing-hero-panel-row">
                    <p className="alpha-landing-hero-panel-label">{item.label}</p>
                    <p className="alpha-landing-hero-panel-value">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
