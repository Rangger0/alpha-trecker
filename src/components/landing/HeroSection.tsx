import type { CSSProperties } from 'react';
import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeftRight,
  ArrowRight,
  Layers3,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PREDEFINED_ECOSYSTEMS } from '@/lib/ecosystems';

const heroSignals = ['Signal scan', 'Priority board', 'Execution routes', 'Reward review'];

const heroStats = [
  {
    label: 'Workspace mode',
    value: 'Calm operator UI',
  },
  {
    label: 'Coverage',
    value: `${PREDEFINED_ECOSYSTEMS.length}+ live ecosystems`,
  },
  {
    label: 'Loop',
    value: 'Research to reward',
  },
];

const orbitCards = [
  {
    label: 'Signal desk',
    title: 'Overview, catalysts, and ecosystem scan',
    icon: Layers3,
    className: 'alpha-premium-float-card--one',
  },
  {
    label: 'Execution routes',
    title: 'Deploy, tools, bridge, and swap surfaces',
    icon: ArrowLeftRight,
    className: 'alpha-premium-float-card--two',
  },
  {
    label: 'Follow-up',
    title: 'Eligibility, vault, and next-action review',
    icon: ShieldCheck,
    className: 'alpha-premium-float-card--three',
  },
];

const fallingDots = [
  { top: '7%', left: '8%', delay: '0.4s', duration: '10.5s', distanceX: '140px', distanceY: '250px', size: '3px' },
  { top: '10%', left: '22%', delay: '2.2s', duration: '12.2s', distanceX: '170px', distanceY: '286px', size: '2.5px' },
  { top: '5%', left: '36%', delay: '1.4s', duration: '9.8s', distanceX: '138px', distanceY: '228px', size: '3.5px' },
  { top: '14%', left: '50%', delay: '4.4s', duration: '11.6s', distanceX: '162px', distanceY: '268px', size: '2.5px' },
  { top: '9%', left: '66%', delay: '3.2s', duration: '10.9s', distanceX: '148px', distanceY: '242px', size: '3px' },
  { top: '16%', left: '82%', delay: '5.8s', duration: '12.8s', distanceX: '178px', distanceY: '302px', size: '2px' },
  { top: '26%', left: '14%', delay: '6.8s', duration: '11.8s', distanceX: '156px', distanceY: '260px', size: '3px' },
  { top: '30%', left: '32%', delay: '8.2s', duration: '13.2s', distanceX: '186px', distanceY: '314px', size: '2.5px' },
  { top: '32%', left: '58%', delay: '7.1s', duration: '11.2s', distanceX: '154px', distanceY: '256px', size: '3.5px' },
  { top: '40%', left: '74%', delay: '9.6s', duration: '12.5s', distanceX: '176px', distanceY: '294px', size: '2.5px' },
  { top: '48%', left: '20%', delay: '10.4s', duration: '10.8s', distanceX: '144px', distanceY: '238px', size: '2.5px' },
  { top: '54%', left: '44%', delay: '11.8s', duration: '12.6s', distanceX: '168px', distanceY: '278px', size: '3px' },
  { top: '58%', left: '63%', delay: '12.8s', duration: '11.4s', distanceX: '150px', distanceY: '252px', size: '2px' },
  { top: '62%', left: '84%', delay: '14.1s', duration: '13.4s', distanceX: '188px', distanceY: '320px', size: '2.5px' },
];

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const logoFieldRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frameId = 0;
    const section = sectionRef.current;
    const logoField = logoFieldRef.current;

    if (!section || !logoField) {
      return undefined;
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const applyMotion = () => {
      const scrollProgress = Math.min(window.scrollY / 720, 1);
      const logoOpacity = Math.max(0.84, 1 - scrollProgress * 0.12);
      const logoShift = scrollProgress * 26;
      const logoScale = 1.02 - scrollProgress * 0.04;

      section.style.setProperty('--hero-scroll-progress', scrollProgress.toFixed(4));
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
      section.style.setProperty('--hero-scroll-progress', '0');
      logoField.style.opacity = '1';
      logoField.style.transform = 'translate3d(0, 0, 0) scale(1.02)';
      return undefined;
    }

    applyMotion();
    window.addEventListener('scroll', syncScroll, { passive: true });
    window.addEventListener('resize', syncScroll);

    return () => {
      window.removeEventListener('scroll', syncScroll);
      window.removeEventListener('resize', syncScroll);
      if (frameId !== 0) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="alpha-landing-hero-section alpha-premium-hero relative isolate overflow-hidden px-4 sm:px-6 lg:px-8"
    >
      <div className="alpha-landing-hero-atmosphere" aria-hidden="true">
        {fallingDots.map((dot, index) => (
          <span
            key={`${dot.top}-${dot.left}-${index}`}
            className="alpha-landing-fall-dot"
            style={{
              top: dot.top,
              left: dot.left,
              '--fall-delay': dot.delay,
              '--fall-duration': dot.duration,
              '--fall-distance-x': dot.distanceX,
              '--fall-distance-y': dot.distanceY,
              '--fall-size': dot.size,
            } as CSSProperties}
          />
        ))}

        <span className="alpha-premium-hero-haze alpha-premium-hero-haze--one" />
        <span className="alpha-premium-hero-haze alpha-premium-hero-haze--two" />
        <span className="alpha-premium-hero-gridline" />
      </div>

      <div className="macos-landing-width relative z-20">
        <div className="alpha-premium-hero-grid">
          <div
            className="alpha-landing-hero-copy alpha-premium-copy alpha-premium-copy--header macos-landing-enter"
            style={{ '--enter-delay': '40ms' } as CSSProperties}
          >
            <span className="macos-page-kicker alpha-landing-kicker">
              <Sparkles className="h-7.5 w-7.5" />
              Alpha Tracker
            </span>

            <h1 className="alpha-landing-headline alpha-premium-headline">
              <span className="alpha-landing-headline-line alpha-premium-headline-line">
                A premium workspace for
              </span>
              <span className="alpha-landing-headline-line alpha-landing-headline-accent alpha-premium-headline-line alpha-premium-headline-line--accent">
                disciplined crypto execution
              </span>
            </h1>

            <p className="alpha-landing-lead alpha-premium-lead">
              Alpha Tracker brings research, tracking, execution, and reward follow-up into one sharp, monochrome
              interface that feels focused from first signal to final review.
            </p>
          </div>

          <div
            className="alpha-premium-command-stage macos-landing-enter"
            style={{ '--enter-delay': '140ms' } as CSSProperties}
          >
            <div
              ref={logoFieldRef}
              className="alpha-premium-orbit-shell"
              style={{
                opacity: 1,
                transform: 'translate3d(0, 0, 0) scale(1.02)',
              }}
            >
              <span className="alpha-premium-orbit-track alpha-premium-orbit-track--one" />
              <span className="alpha-premium-orbit-track alpha-premium-orbit-track--two" />
              <span className="alpha-premium-orbit-core-glow" />

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

            {orbitCards.map((item) => (
              <article key={item.label} className={`alpha-premium-float-card ${item.className}`}>
                <div className="alpha-premium-float-card-top">
                  <div className="alpha-premium-float-icon">
                    <item.icon className="h-4 w-4" />
                  </div>
                  <span className="alpha-premium-float-label">{item.label}</span>
                </div>
                <p className="alpha-premium-float-title">{item.title}</p>
              </article>
            ))}
          </div>

          <div
            className="alpha-premium-hero-footer macos-landing-enter"
            style={{ '--enter-delay': '220ms' } as CSSProperties}
          >
            <div className="alpha-landing-hero-actions alpha-premium-actions">
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

              <a href="#preview">
                <Button
                  variant="outline"
                  className="macos-btn h-11 rounded-full px-7 text-sm font-semibold"
                  style={{
                    borderColor: 'color-mix(in srgb, var(--alpha-border) 88%, transparent)',
                    background: 'color-mix(in srgb, var(--alpha-surface) 88%, transparent)',
                    color: 'var(--alpha-text)',
                  }}
                >
                  See The Product
                </Button>
              </a>
            </div>

            <div className="alpha-premium-flow">
              {heroSignals.map((signal) => (
                <span key={signal} className="alpha-premium-flow-pill">
                  {signal}
                </span>
              ))}
            </div>

            <div className="alpha-premium-stat-grid">
              {heroStats.map((item, index) => (
                <article
                  key={item.label}
                  className="alpha-premium-stat-card"
                  style={{ '--stagger-delay': `${index * 80}ms` } as CSSProperties}
                >
                  <p className="alpha-premium-stat-label">{item.label}</p>
                  <p className="alpha-premium-stat-value">{item.value}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
