import { Suspense, lazy, useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Navbar } from '@/components/landing/Navbar';
import { HeroSection } from '@/components/landing/HeroSection';
import { SocialProofSection } from '@/components/landing/SocialProofSection';
import { StatsSection } from '@/components/landing/StatsSection';
import { AuthModal, type AuthMode } from '@/components/landing/AuthSection';
import { Footer } from '@/components/landing/Footer';
import { ArrowUp } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

const FeaturesSection = lazy(async () => {
  const module = await import('@/components/landing/FeaturesSection');
  return { default: module.FeaturesSection };
});

const ProductShowcaseSection = lazy(async () => {
  const module = await import('@/components/landing/ProductShowcaseSection');
  return { default: module.ProductShowcaseSection };
});

const WorkflowTimelineSection = lazy(async () => {
  const module = await import('@/components/landing/WorkflowTimelineSection');
  return { default: module.WorkflowTimelineSection };
});

const CTASection = lazy(async () => {
  const module = await import('@/components/landing/CTASection');
  return { default: module.CTASection };
});

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
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>('login');

  const openAuthModal = useCallback((mode: AuthMode = 'login') => {
    setAuthMode(mode);
    setAuthOpen(true);
  }, []);

  useEffect(() => {
    if (location.hash === '#auth') {
      const params = new URLSearchParams(location.search);
      openAuthModal(params.get('mode') === 'register' ? 'register' : 'login');
      return;
    }

    if (location.hash) {
      return;
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [location.hash, openAuthModal]);

  return (
    <div className={`alpha-theme ${theme} macos-root macos-landing-shell min-h-screen alpha-bg`}>
      <LandingScrollChrome />
      <Navbar onOpenAuth={openAuthModal} />
      <main>
        <HeroSection onOpenAuth={openAuthModal} />
        <SocialProofSection />
        <StatsSection />
        <Suspense fallback={null}>
          <FeaturesSection />
        </Suspense>
        <Suspense fallback={null}>
          <ProductShowcaseSection />
        </Suspense>
        <Suspense fallback={null}>
          <WorkflowTimelineSection />
        </Suspense>
        <Suspense fallback={null}>
          <CTASection onOpenAuth={openAuthModal} />
        </Suspense>
      </main>
      <Footer />
      <AuthModal isOpen={authOpen} initialMode={authMode} onOpenChange={setAuthOpen} />
    </div>
  );
}
