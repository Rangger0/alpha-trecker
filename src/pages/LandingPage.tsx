import { Suspense, lazy, useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Navbar } from '@/components/landing/Navbar';
import { HeroSection } from '@/components/landing/HeroSection';
import { AuthModal, type AuthMode } from '@/components/landing/AuthSection';
import { Footer } from '@/components/landing/Footer';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

const FeaturesSection = lazy(async () => {
  const module = await import('@/components/landing/FeaturesSection');
  return { default: module.FeaturesSection };
});

const WorkflowTimelineSection = lazy(async () => {
  const module = await import('@/components/landing/WorkflowTimelineSection');
  return { default: module.WorkflowTimelineSection };
});

const previewItems = [
  {
    title: 'Dashboard',
    label: 'Project command center',
    image: '/3.webp',
  },
  {
    title: 'Multi Account',
    label: 'Wallets grouped by project',
    image: '/4.webp',
  },
  {
    title: 'Wallet Matrix',
    label: 'Labels, networks, and notes',
    image: '/5.webp',
  },
  {
    title: 'Sybil Detector',
    label: 'Risk review workflow',
    image: '/6.webp',
  },
];

const workflowSteps = ['Research', 'Execute', 'Track', 'Claim', 'Review'];

function WorkspacePreviewSection() {
  return (
    <section id="preview" className="alpha-saas-section alpha-mission-section px-4 sm:px-6 lg:px-8">
      <div className="macos-landing-width">
        <div className="alpha-saas-section-header">
          <p className="macos-section-label">Workspace Preview</p>
          <h2 className="alpha-landing-section-title">See the workspace in action.</h2>
          <p>
            Dashboard, wallets, matrix views, and risk checks are designed to work as one operating layer.
          </p>
        </div>

        <div className="alpha-workspace-preview-grid">
          {previewItems.map((item) => (
            <article key={item.title} className="alpha-workspace-preview-card">
              <div className="alpha-workspace-preview-frame">
                <img src={item.image} alt={`${item.title} public demo preview`} loading="lazy" decoding="async" />
              </div>
              <div>
                <h3>{item.title}</h3>
                <p>{item.label}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function WorkflowSection() {
  return (
    <section id="workspace" className="alpha-saas-section alpha-mission-section px-4 sm:px-6 lg:px-8">
      <div className="macos-landing-width alpha-mission-workflow-panel">
        <div className="alpha-saas-section-header">
          <p className="macos-section-label">Workflow</p>
          <h2 className="alpha-landing-section-title">From research to review, without losing context.</h2>
          <p>
            Alpha Tracker gives serious airdrop hunters a repeatable system instead of scattered tabs, notes, and spreadsheets.
          </p>
        </div>

        <div className="alpha-mission-workflow">
          {workflowSteps.map((step, index) => (
            <div key={step} className="alpha-mission-workflow-item">
              <span>{String(index + 1).padStart(2, '0')}</span>
              <strong>{step}</strong>
              {index < workflowSteps.length - 1 ? <ArrowDown className="alpha-mission-workflow-arrow h-4 w-4" /> : null}
            </div>
          ))}
        </div>
      </div>
    </section>
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
        <Suspense fallback={null}>
          <FeaturesSection />
        </Suspense>
        <WorkspacePreviewSection />
        <Suspense fallback={null}>
          <WorkflowTimelineSection />
        </Suspense>
        <WorkflowSection />
      </main>
      <Footer />
      <AuthModal isOpen={authOpen} initialMode={authMode} onOpenChange={setAuthOpen} />
    </div>
  );
}
