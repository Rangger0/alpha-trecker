import type { CSSProperties } from 'react';
import { useEffect, useRef, useState } from 'react';
import { ArrowLeftRight, ChevronLeft, ChevronRight, Layers3, MousePointer2, ShieldCheck, Sparkles } from 'lucide-react';

const previewSlides = [
  {
    src: '/2.webp',
    alt: 'Alpha Tracker overview screen',
    label: 'Overview',
    note: 'Keep priorities, ecosystem coverage, and active lanes visible in one frame.',
  },
  {
    src: '/3.webp',
    alt: 'Alpha Tracker dashboard screen',
    label: 'Dashboard',
    note: 'Daily execution starts from a dashboard that still feels calm under load.',
  },
  {
    src: '/4.webp',
    alt: 'Alpha Tracker new airdrop workflow',
    label: 'Add airdrop',
    note: 'Capture new opportunities without breaking the rhythm of the workspace.',
  },
  {
    src: '/5.webp',
    alt: 'Alpha Tracker tools screen',
    label: 'Tools',
    note: 'Action surfaces stay close to the research context that created them.',
  },
  {
    src: '/6.webp',
    alt: 'Alpha Tracker AI tools screen',
    label: 'AI tools',
    note: 'AI workflows feel native to the product instead of bolted on later.',
  },
  {
    src: '/7.webp',
    alt: 'Alpha Tracker swap and bridge screen',
    label: 'Swap & bridge',
    note: 'Execution routes remain inside the same premium visual system.',
  },
];

const previewPoints = [
  'One view for market context, priorities, and execution readiness.',
  'Strong visual hierarchy so users know what matters first.',
  'Calm monochrome styling with motion used only where it improves clarity.',
];

const previewMetrics = [
  {
    icon: Layers3,
    label: 'Command surface',
    value: 'Overview + priorities',
  },
  {
    icon: ShieldCheck,
    label: 'Tracking lane',
    value: 'Eligibility + rewards',
  },
  {
    icon: ArrowLeftRight,
    label: 'Execution lane',
    value: 'Tools + routes',
  },
  {
    icon: Sparkles,
    label: 'Design feel',
    value: 'Clean and premium',
  },
];

export function DetailedFeatures() {
  const [previewState, setPreviewState] = useState({
    index: 0,
    direction: 1,
  });
  const viewportRef = useRef<HTMLDivElement>(null);
  const [isCarouselActive, setIsCarouselActive] = useState(false);
  const [dragState, setDragState] = useState({
    isDragging: false,
    startX: 0,
    deltaX: 0,
  });

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) {
      return undefined;
    }

    if (typeof IntersectionObserver === 'undefined') {
      setIsCarouselActive(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsCarouselActive(Boolean(entry?.isIntersecting));
      },
      {
        rootMargin: '180px 0px',
        threshold: 0.18,
      }
    );

    observer.observe(viewport);

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!isCarouselActive) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setPreviewState((current) => {
        const lastIndex = previewSlides.length - 1;

        if (current.index >= lastIndex) {
          return {
            index: Math.max(lastIndex - 1, 0),
            direction: -1,
          };
        }

        if (current.index <= 0 && current.direction < 0) {
          return {
            index: Math.min(1, lastIndex),
            direction: 1,
          };
        }

        return {
          index: current.index + current.direction,
          direction: current.direction,
        };
      });
    }, 4200);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [isCarouselActive]);

  const lastIndex = previewSlides.length - 1;
  const activeSlide = previewSlides[previewState.index];

  const setSlide = (nextIndex: number) => {
    setPreviewState((current) => ({
      index: nextIndex,
      direction: nextIndex >= current.index ? 1 : -1,
    }));
    setIsCarouselActive(false);
    window.setTimeout(() => setIsCarouselActive(true), 50);
  };

  const changeSlide = (step: number) => {
    const nextIndex = Math.min(Math.max(previewState.index + step, 0), lastIndex);
    setSlide(nextIndex);
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!viewportRef.current) return;
    viewportRef.current.setPointerCapture(event.pointerId);
    setIsCarouselActive(false);
    setDragState({
      isDragging: true,
      startX: event.clientX,
      deltaX: 0,
    });
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    setDragState((state) => {
      if (!state.isDragging) return state;
      return {
        ...state,
        deltaX: event.clientX - state.startX,
      };
    });
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!viewportRef.current) return;
    viewportRef.current.releasePointerCapture(event.pointerId);

    setDragState((state) => {
      if (!state.isDragging) {
        setIsCarouselActive(true);
        return state;
      }

      const width = viewportRef.current?.clientWidth ?? 1;
      const threshold = width * 0.15;
      let nextIndex = previewState.index;

      if (Math.abs(state.deltaX) > threshold) {
        if (state.deltaX < 0) {
          nextIndex = Math.min(previewState.index + 1, lastIndex);
        } else {
          nextIndex = Math.max(previewState.index - 1, 0);
        }
      }

      setPreviewState((current) => ({
        index: nextIndex,
        direction: nextIndex >= current.index ? 1 : -1,
      }));
      setIsCarouselActive(true);

      return { isDragging: false, startX: 0, deltaX: 0 };
    });
  };

  const viewportWidth = viewportRef.current?.clientWidth ?? 1;
  const dragOffsetPercent = dragState.isDragging
    ? (dragState.deltaX / viewportWidth) * 100
    : 0;

  return (
    <section id="preview" className="px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
      <div className="macos-landing-width alpha-premium-preview-board">
        <div className="space-y-6">
          <div className="space-y-4" data-stagger>
            <p className="macos-section-label">Interface preview</p>
            <h2 className="alpha-landing-section-title">
              The landing experience previews a product that feels intentional, refined, and ready for daily use.
            </h2>
            <p className="alpha-landing-section-copy">
              Instead of shouting for attention, the interface keeps the right surfaces visible and lets the important moments breathe.
            </p>
          </div>

          <div className="space-y-3" data-stagger style={{ '--stagger-delay': '80ms' } as CSSProperties}>
            {previewPoints.map((item) => (
              <div key={item} className="alpha-landing-list-row">
                <span className="alpha-landing-list-dot" />
                <p className="text-sm leading-7 text-[var(--alpha-text-muted)]">{item}</p>
              </div>
            ))}
          </div>

          <div className="alpha-premium-preview-metrics">
            {previewMetrics.map((item, index) => (
              <article
                key={item.label}
                className="alpha-premium-mini-metric"
                data-stagger
                style={{ '--stagger-delay': `${140 + index * 70}ms` } as CSSProperties}
              >
                <div className="alpha-premium-mini-metric-icon">
                  <item.icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="alpha-premium-mini-metric-label">{item.label}</p>
                  <p className="alpha-premium-mini-metric-value">{item.value}</p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="alpha-premium-preview-shell" data-stagger style={{ '--stagger-delay': '120ms' } as CSSProperties}>
          <div className="alpha-premium-preview-frame">
            <div className="alpha-premium-preview-frame-head">
              <div>
                <p className="alpha-premium-preview-eyebrow">Live product canvas</p>
                <h3 className="alpha-premium-preview-title">{activeSlide.label}</h3>
              </div>
              <p className="alpha-premium-preview-frame-copy">{activeSlide.note}</p>
            </div>

            <div className="alpha-landing-preview-shell alpha-landing-preview-shell--large">
              <div
                ref={viewportRef}
                className={`alpha-landing-preview-viewport ${dragState.isDragging ? 'is-dragging' : ''}`}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerUp}
              >
                <div className="alpha-landing-preview-toolbar">
                  <span className="alpha-landing-preview-toolbar-title">Dashboard preview</span>
                  <span className="alpha-landing-preview-toolbar-meta">
                    {previewState.index + 1} / {previewSlides.length}
                  </span>
                </div>

                <div className="alpha-landing-drag-hint">
                  <MousePointer2 className="h-4 w-4" />
                  <span>Drag to explore</span>
                </div>

                <div className="alpha-landing-preview-nav">
                  <button
                    type="button"
                    aria-label="Previous preview"
                    onClick={() => changeSlide(-1)}
                    className="alpha-landing-preview-nav-btn"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    aria-label="Next preview"
                    onClick={() => changeSlide(1)}
                    className="alpha-landing-preview-nav-btn"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>

                <div
                  className="alpha-landing-preview-track"
                  style={{
                    transform: `translate3d(calc(-${previewState.index * 100}% + ${dragOffsetPercent}%), 0, 0)`,
                    transition: dragState.isDragging ? 'none' : undefined,
                  }}
                >
                  {previewSlides.map((slide) => (
                    <figure key={slide.src} className="alpha-landing-preview-slide">
                      <img
                        src={slide.src}
                        alt={slide.alt}
                        className="alpha-landing-preview-image"
                        loading="lazy"
                        decoding="async"
                      />
                      <figcaption className="alpha-landing-preview-caption">{slide.label}</figcaption>
                    </figure>
                  ))}
                </div>
              </div>
            </div>

            <div className="alpha-premium-preview-indicators">
              {previewSlides.map((slide, index) => (
                <button
                  key={slide.src}
                  type="button"
                  onClick={() => setSlide(index)}
                  className={`alpha-premium-preview-indicator ${index === previewState.index ? 'is-active' : ''}`}
                >
                  <span className="alpha-premium-preview-indicator-index">{String(index + 1).padStart(2, '0')}</span>
                  <span className="alpha-premium-preview-indicator-label">{slide.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
