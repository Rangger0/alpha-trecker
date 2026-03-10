import { Suspense, lazy, startTransition, useEffect, useState, type ReactNode } from 'react';
import { Navbar } from '@/components/landing/Navbar';
import { HeroSection } from '@/components/landing/HeroSection';
import { Footer } from '@/components/landing/Footer';
import { useDeferredVisibility } from '@/hooks/use-deferred-visibility';
import { ArrowUp } from 'lucide-react';

const FeaturesSection = lazy(async () => {
  const module = await import('@/components/landing/FeaturesSection');
  return { default: module.FeaturesSection };
});

const DetailedFeatures = lazy(async () => {
  const module = await import('@/components/landing/DetailedFeatures');
  return { default: module.DetailedFeatures };
});

const ProjectsMarquee = lazy(async () => {
  const module = await import('@/components/landing/ProjectsMarquee');
  return { default: module.ProjectsMarquee };
});

const CTASection = lazy(async () => {
  const module = await import('@/components/landing/CTASection');
  return { default: module.CTASection };
});

function DeferredLandingSection({
  children,
  placeholderHeight,
}: {
  children: ReactNode;
  placeholderHeight: number;
}) {
  const { ref, isVisible } = useDeferredVisibility<HTMLDivElement>({
    minDelay: 0,
    rootMargin: '280px 0px',
    threshold: 0.08,
    once: true,
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

  return (
    <div
      ref={ref}
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
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, []);

  return (
    <div className="macos-root macos-landing-shell min-h-screen alpha-bg">
      <LandingScrollChrome />
      <Navbar />
      <main className="pt-[96px] sm:pt-[104px]">
        <HeroSection />
        <DeferredLandingSection placeholderHeight={720}>
          <FeaturesSection />
        </DeferredLandingSection>
        <DeferredLandingSection placeholderHeight={760}>
          <DetailedFeatures />
        </DeferredLandingSection>
        <DeferredLandingSection placeholderHeight={420}>
          <ProjectsMarquee />
        </DeferredLandingSection>
        <DeferredLandingSection placeholderHeight={320}>
          <CTASection />
        </DeferredLandingSection>
      </main>
      <Footer />
    </div>
  );
}
