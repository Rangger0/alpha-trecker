import { Suspense, lazy, startTransition, useEffect, useRef, useState, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { Navbar } from '@/components/landing/Navbar';
import { HeroSection } from '@/components/landing/HeroSection';
import { AuthSection } from '@/components/landing/AuthSection';
import { Footer } from '@/components/landing/Footer';
import { useDeferredVisibility } from '@/hooks/use-deferred-visibility';
import { ArrowUp, BarChart3, Layers3, ShieldCheck } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

const FeaturesSection = lazy(async () => {
  const module = await import('@/components/landing/FeaturesSection');
  return { default: module.FeaturesSection };
});

const benefitItems = [
  {
    icon: Layers3,
    label: 'Single workspace',
    value: 'Keep project notes, funding context, and execution status inside one operating layer.',
  },
  {
    icon: ShieldCheck,
    label: 'Cleaner decisions',
    value: 'Review outcomes and reduce noise before repeating the next workflow.',
  },
  {
    icon: BarChart3,
    label: 'Execution rhythm',
    value: 'Move from discovery to tracking to action without rebuilding context every time.',
  },
];

function WorkspaceBenefitsSection() {
  return (
    <section id="benefits" className="alpha-workspace-benefits px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
      <div className="macos-landing-width">
        <div className="alpha-benefit-header">
          <p className="macos-section-label">Workspace benefits</p>
          <h2>Built for research discipline, not lucky clicking.</h2>
          <p>
            Alpha Tracker helps you slow down the noisy parts of crypto and keep the important decisions visible,
            repeatable, and reviewable.
          </p>
        </div>

        <div className="alpha-benefit-grid">
          {benefitItems.map((item) => (
            <article key={item.label} className="alpha-benefit-card">
              <div>
                <item.icon className="h-5 w-5" />
              </div>
              <h3>{item.label}</h3>
              <p>{item.value}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function DeferredLandingSection({
  children,
  placeholderHeight,
}: {
  children: ReactNode;
  placeholderHeight: number;
}) {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const { isVisible } = useDeferredVisibility<HTMLDivElement>({
    minDelay: 0,
    rootMargin: '280px 0px',
    threshold: 0.08,
    once: false,
    targetRef: sectionRef,
  });
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (!isVisible || shouldRender) {
      return;
    }

    startTransition(() => {
      setShouldRender(true);
    });
  }, [isVisible, shouldRender]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) {
      return undefined;
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      section.style.setProperty('--section-scroll-shift', '0px');
      section.style.setProperty('--section-scroll-scale', '1');
      return undefined;
    }

    let frameId = 0;

    const applyScrollMotion = () => {
      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight || 1;
      const sectionCenter = rect.top + rect.height / 2;
      const viewportCenter = viewportHeight / 2;
      const normalizedOffset = (sectionCenter - viewportCenter) / viewportHeight;
      const clampedOffset = Math.max(-1, Math.min(1, normalizedOffset));
      const shift = clampedOffset * -28;
      const scale = 1 - Math.min(Math.abs(clampedOffset) * 0.04, 0.04);

      section.style.setProperty('--section-scroll-shift', `${shift.toFixed(2)}px`);
      section.style.setProperty('--section-scroll-scale', scale.toFixed(4));
    };

    const syncScrollMotion = () => {
      if (frameId !== 0) {
        return;
      }

      frameId = window.requestAnimationFrame(() => {
        applyScrollMotion();
        frameId = 0;
      });
    };

    applyScrollMotion();
    window.addEventListener('scroll', syncScrollMotion, { passive: true });
    window.addEventListener('resize', syncScrollMotion);

    return () => {
      window.removeEventListener('scroll', syncScrollMotion);
      window.removeEventListener('resize', syncScrollMotion);

      if (frameId !== 0) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, []);

  return (
    <div
      ref={sectionRef}
      className="macos-scroll-section"
      data-visible={shouldRender ? 'true' : 'false'}
    >
      {shouldRender ? (
        <Suspense fallback={<div aria-hidden="true" style={{ minHeight: `${placeholderHeight}px` }} />}>
          {children}
        </Suspense>
      ) : (
        <div aria-hidden="true" style={{ minHeight: `${placeholderHeight}px` }} />
      )}
    </div>
  );
}

function LandingScrollChrome() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const syncScrollState = () => {
      const top = window.scrollY;
      setShowScrollTop(top > 360);
    };

    syncScrollState();
    window.addEventListener('scroll', syncScrollState, { passive: true });

    return () => {
      window.removeEventListener('scroll', syncScrollState);
    };
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`fixed bottom-6 left-6 z-[65] flex h-11 w-11 items-center justify-center rounded-full border transition-all duration-300 ${
          showScrollTop ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0'
        }`}
        style={{
          borderColor: 'color-mix(in srgb, var(--alpha-border) 88%, transparent)',
          background: 'color-mix(in srgb, var(--alpha-panel) 88%, transparent)',
          color: 'var(--alpha-text)',
        }}
        aria-label="Scroll to top"
      >
        <ArrowUp className="h-4 w-4" />
      </button>
    </>
  );
}

export function LandingPage() {
  const { theme } = useTheme();
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      return;
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [location.hash]);

  return (
    <div className={`alpha-theme ${theme} macos-root macos-landing-shell min-h-screen alpha-bg`}>
      <LandingScrollChrome />
      <Navbar />
      <main>
        <HeroSection />
        <DeferredLandingSection placeholderHeight={760}>
          <FeaturesSection />
        </DeferredLandingSection>
        <WorkspaceBenefitsSection />
        <AuthSection />
      </main>
      <Footer />
    </div>
  );
}
