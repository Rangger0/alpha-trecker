import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';

const dashboardImages = [
  { src: '/1.png', alt: 'Register to login flow', label: 'Register to Login' },
  { src: '/2.png', alt: 'Overview page', label: 'Overview' },
  { src: '/3.png', alt: 'Dashboard page', label: 'Dashboard' },
  { src: '/4.png', alt: 'Add new airdrop modal', label: 'Add New Airdrop' },
  { src: '/5.png', alt: 'Tools page', label: 'Tools' },
  { src: '/6.png', alt: 'AI tools page', label: 'AI Tools' },
  { src: '/7.png', alt: 'Swap and bridge page', label: 'Swap & Bridge' },
];

export function HeroSection() {
  const [typedText, setTypedText] = useState('');
  const [showDashboard, setShowDashboard] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const fullText = '$ alpha-tracker --status';

  useEffect(() => {
    let index = 0;
    const timer = window.setInterval(() => {
      if (index <= fullText.length) {
        setTypedText(fullText.slice(0, index));
        index += 1;
      } else {
        window.clearInterval(timer);
        window.setTimeout(() => setShowDashboard(true), 450);
      }
    }, 42);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!isAutoPlaying || !showDashboard) return undefined;

    const interval = window.setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % dashboardImages.length);
    }, 4000);

    return () => window.clearInterval(interval);
  }, [isAutoPlaying, showDashboard]);

  const nextSlide = () => {
    setIsAutoPlaying(false);
    setCurrentSlide((prev) => (prev + 1) % dashboardImages.length);
  };

  const prevSlide = () => {
    setIsAutoPlaying(false);
    setCurrentSlide((prev) => (prev - 1 + dashboardImages.length) % dashboardImages.length);
  };

  return (
    <section className="relative overflow-hidden px-4 pb-24 pt-36 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute left-[10%] top-[8%] h-64 w-64 rounded-full blur-3xl"
          style={{ background: 'radial-gradient(circle, color-mix(in srgb, var(--alpha-border) 22%, transparent), transparent 72%)' }}
        />
        <div
          className="absolute right-[10%] top-[10%] h-64 w-64 rounded-full blur-3xl"
          style={{ background: 'radial-gradient(circle, color-mix(in srgb, var(--alpha-accent-to) 16%, transparent), transparent 72%)' }}
        />
        <div
          className="absolute left-1/2 top-[40%] h-72 w-72 -translate-x-1/2 rounded-full blur-3xl"
          style={{ background: 'radial-gradient(circle, color-mix(in srgb, var(--alpha-accent) 12%, transparent), transparent 72%)' }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl text-center">
        <div
          className="mb-8 inline-flex items-center gap-2 rounded-full px-4 py-2 shadow-sm"
          style={{
            background: 'color-mix(in srgb, var(--alpha-surface) 88%, transparent)',
            border: '1px solid color-mix(in srgb, var(--alpha-border) 88%, transparent)',
            color: 'var(--alpha-text-muted)',
          }}
        >
          <Sparkles className="h-4 w-4" style={{ color: 'var(--alpha-accent-to)' }} />
          <span className="text-sm font-medium">Alpha Tracker 2.0 - Public Beta</span>
        </div>

        <h1
          className="mb-6 text-4xl font-semibold leading-[0.98] tracking-[-0.05em] sm:text-5xl lg:text-6xl"
          style={{ color: 'var(--alpha-text)' }}
        >
          The Project Tool For{' '}
          <span style={{ color: 'var(--alpha-accent-to)' }}>
            Airdroppers
          </span>
        </h1>

        <p className="mx-auto mb-10 max-w-2xl text-lg leading-8 sm:text-xl" style={{ color: 'var(--alpha-text-muted)' }}>
          Explore your data, build your dashboard, and keep your team aligned.
          Stop hunting blindly, start running a cleaner operation.
        </p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link to="/register">
            <Button
              className="macos-btn h-12 rounded-full px-8 text-base font-semibold transition-opacity duration-150 hover:opacity-92"
              style={{
                background:
                  'linear-gradient(135deg, var(--alpha-accent-from), color-mix(in srgb, var(--alpha-accent-to) 78%, var(--alpha-accent) 22%))',
                color: 'var(--alpha-accent-contrast)',
                boxShadow: '0 18px 34px color-mix(in srgb, var(--alpha-accent-to) 22%, transparent)',
              }}
            >
              Get Started - It&apos;s Free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>

          <a href="#features">
            <Button
              variant="outline"
              className="macos-btn h-12 rounded-full px-8 text-base font-semibold transition-opacity duration-150 hover:opacity-85"
              style={{
                borderColor: 'color-mix(in srgb, var(--alpha-border) 88%, transparent)',
                background: 'color-mix(in srgb, var(--alpha-surface) 86%, transparent)',
                color: 'var(--alpha-text)',
              }}
            >
              Learn More
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </a>
        </div>

        <div className="relative mt-16">
          <div
            className="absolute -inset-2 rounded-[2rem] blur-2xl"
            style={{ background: 'linear-gradient(90deg, color-mix(in srgb, var(--alpha-accent-to) 16%, transparent), color-mix(in srgb, var(--alpha-border) 16%, transparent))' }}
          />

          <div
            className="macos-landing-card relative overflow-hidden rounded-[2rem]"
            style={{
              borderColor: 'color-mix(in srgb, var(--alpha-border) 88%, transparent)',
              background:
                'linear-gradient(180deg, color-mix(in srgb, var(--alpha-surface) 96%, transparent), color-mix(in srgb, var(--alpha-panel) 90%, transparent))',
            }}
          >
            <div
              className="flex h-10 items-center border-b px-4"
              style={{ borderColor: 'color-mix(in srgb, var(--alpha-border) 76%, transparent)' }}
            >
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono" style={{ color: 'var(--alpha-text-muted)' }}>
                  alpha-tracker
                </span>
                <span className="text-xs" style={{ color: 'var(--alpha-text-muted)' }}>—</span>
                <span className="text-xs font-mono" style={{ color: 'var(--alpha-text-muted)' }}>
                  bash
                </span>
              </div>
            </div>

            <div className="p-6 text-left font-mono text-sm">
              <div style={{ color: 'var(--alpha-accent-to)' }}>
                {typedText}
                <span className="animate-blink">_</span>
              </div>
              <div className="mt-4 space-y-1" style={{ color: 'var(--alpha-text-muted)' }}>
                <div className="animate-fade-in delay-500">{'>'} Initializing dashboard...</div>
                <div className="animate-fade-in delay-700">{'>'} Loading portfolio data...</div>
                <div className="animate-fade-in delay-900">{'>'} Syncing 12 wallets...</div>
                <div className="animate-fade-in delay-1100" style={{ color: 'var(--alpha-accent)' }}>
                  {'>'} Ready! Found 3 new airdrop opportunities
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className={`relative mt-16 transition-all duration-700 ${
            showDashboard ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-8 opacity-0'
          }`}
        >
          <div
            className="absolute -inset-4 rounded-[2rem] blur-2xl"
            style={{ background: 'linear-gradient(90deg, color-mix(in srgb, var(--alpha-accent) 12%, transparent), color-mix(in srgb, var(--alpha-border) 12%, transparent))' }}
          />

          <div className="group relative">
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full border p-3 opacity-0 transition-all duration-200 group-hover:opacity-100"
              style={{
                borderColor: 'color-mix(in srgb, var(--alpha-border) 86%, transparent)',
                background: 'color-mix(in srgb, var(--alpha-surface) 92%, transparent)',
                color: 'var(--alpha-text)',
              }}
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full border p-3 opacity-0 transition-all duration-200 group-hover:opacity-100"
              style={{
                borderColor: 'color-mix(in srgb, var(--alpha-border) 86%, transparent)',
                background: 'color-mix(in srgb, var(--alpha-surface) 92%, transparent)',
                color: 'var(--alpha-text)',
              }}
              aria-label="Next slide"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            <div
              className="macos-landing-card relative overflow-hidden rounded-[2rem]"
              style={{
                borderColor: 'color-mix(in srgb, var(--alpha-border) 86%, transparent)',
                background:
                  'linear-gradient(180deg, color-mix(in srgb, var(--alpha-surface) 96%, transparent), color-mix(in srgb, var(--alpha-panel) 90%, transparent))',
              }}
            >
              <div
                className="flex transition-transform duration-700 ease-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {dashboardImages.map((image) => (
                  <div key={image.label} className="w-full flex-shrink-0 p-3">
                    <div className="relative overflow-hidden rounded-[1.5rem]">
                      <img
                        src={image.src}
                        alt={image.alt}
                        className="aspect-[16/9] w-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const fallback = target.nextElementSibling as HTMLElement | null;
                          if (fallback) fallback.style.display = 'flex';
                        }}
                      />

                      <div
                        className="hidden aspect-[16/9] w-full items-center justify-center"
                        style={{
                          background: 'color-mix(in srgb, var(--alpha-panel) 92%, transparent)',
                          color: 'var(--alpha-text-muted)',
                        }}
                      >
                        <div className="text-center font-mono">
                          <div className="mb-3 text-5xl">📊</div>
                          <div className="text-sm">{image.label}</div>
                          <div className="mt-1 text-xs">Add {image.src} to the public folder</div>
                        </div>
                      </div>

                      <div
                        className="absolute inset-x-0 bottom-0 p-4"
                        style={{ background: 'linear-gradient(180deg, transparent, rgba(10, 12, 18, 0.42))' }}
                      >
                        <p className="text-left text-base font-semibold tracking-[-0.02em] text-white">
                          {image.label}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
                {dashboardImages.map((image, index) => (
                  <button
                    key={image.label}
                    onClick={() => {
                      setIsAutoPlaying(false);
                      setCurrentSlide(index);
                    }}
                    className="h-2.5 rounded-full transition-all duration-200"
                    style={{
                      width: currentSlide === index ? '30px' : '10px',
                      background:
                        currentSlide === index
                          ? 'linear-gradient(90deg, var(--alpha-accent-from), var(--alpha-accent-to))'
                          : 'color-mix(in srgb, var(--alpha-border) 70%, transparent)',
                    }}
                    aria-label={`Go to ${image.label}`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm" style={{ color: 'var(--alpha-text-muted)' }}>
              Preview of your personalized dashboard. Hover to inspect, use arrows to navigate.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
