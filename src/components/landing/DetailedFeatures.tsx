import { useEffect, useRef, useState } from 'react';
import { MousePointer2, ChevronLeft, ChevronRight } from 'lucide-react';

const previewSlides = [
  {
    src: '/2.webp',
    alt: 'Alpha Tracker overview screen',
    label: 'Overview',
  },
  {
    src: '/3.webp',
    alt: 'Alpha Tracker dashboard screen',
    label: 'Dashboard',
  },
  {
    src: '/4.webp',
    alt: 'Alpha Tracker new airdrop workflow',
    label: 'Add airdrop',
  },
  {
    src: '/5.webp',
    alt: 'Alpha Tracker tools screen',
    label: 'Tools',
  },
  {
    src: '/6.webp',
    alt: 'Alpha Tracker AI tools screen',
    label: 'AI tools',
  },
  {
    src: '/7.webp',
    alt: 'Alpha Tracker swap and bridge screen',
    label: 'Swap & bridge',
  },
];

const previewPoints = [
  'Overview keeps active work and priorities visible.',
  'Tracking panels stay close to the market context.',
  'Execution routes remain inside the same workspace.',
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

  const changeSlide = (step: number) => {
    setPreviewState((current) => {
      const nextIndex = Math.min(Math.max(current.index + step, 0), lastIndex);
      const nextDirection = step >= 0 ? 1 : -1;
      return { index: nextIndex, direction: nextDirection };
    });
    setIsCarouselActive(false);
    window.setTimeout(() => setIsCarouselActive(true), 50);
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
      let nextDirection = previewState.direction;

      if (Math.abs(state.deltaX) > threshold) {
        if (state.deltaX < 0) {
          nextIndex = Math.min(previewState.index + 1, lastIndex);
          nextDirection = 1;
        } else {
          nextIndex = Math.max(previewState.index - 1, 0);
          nextDirection = -1;
        }
      }

      setPreviewState({ index: nextIndex, direction: nextDirection });
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
      <div className="macos-landing-width grid gap-10 lg:grid-cols-[minmax(0,0.84fr)_minmax(0,1.16fr)] lg:items-center">
        <div className="space-y-4">
          <p className="macos-section-label">Dashboard preview</p>
          <h2 className="alpha-landing-section-title">
            One screen for priorities, tracking, and execution routes.
          </h2>
          <p className="alpha-landing-section-copy">
            The dashboard is the entry point for daily work, so research and action stay connected.
          </p>

          <div className="space-y-3 pt-2">
            {previewPoints.map((item) => (
              <div key={item} className="alpha-landing-list-row">
                <span className="alpha-landing-list-dot" />
                <p className="text-sm leading-7 text-[var(--alpha-text-muted)]">{item}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="alpha-landing-preview-shell alpha-landing-preview-shell--large" data-stagger>
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
      </div>
    </section>
  );
}
