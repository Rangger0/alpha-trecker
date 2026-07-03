import { useInView } from '@/hooks/use-in-view';

export function ProductShowcaseSection() {
  const { ref, isInView } = useInView();

  return (
    <section ref={ref} id="showcase" className="alpha-saas-section px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
      <div className="macos-landing-width">
        <div className="text-center mb-16 max-w-3xl mx-auto animate-fade-in-up">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6" style={{ color: 'var(--alpha-text)' }}>
            See the workspace in action.
          </h2>
          <p className="text-lg sm:text-xl" style={{ color: 'var(--alpha-text-muted)' }}>
            Built for research, execution and tracking.
          </p>
        </div>

        <div
          className={`relative rounded-2xl overflow-hidden shadow-2xl border animate-fade-in-up ${isInView ? 'in-view-scale' : ''}`}
          style={{
            border: '1px solid var(--alpha-border)',
            backgroundColor: 'var(--alpha-panel)',
          }}
        >
          <div
            className="flex items-center gap-2 px-6 py-4 border-b"
            style={{ borderColor: 'var(--alpha-border)' }}
          >
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/60" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
              <div className="w-3 h-3 rounded-full bg-green-500/60" />
            </div>
            <span className="text-sm font-medium flex-1 ml-4" style={{ color: 'var(--alpha-text-muted)' }}>
              alpha-tracker.com/dashboard — Your research workspace
            </span>
          </div>

          <div className="relative w-full h-[600px] sm:h-[700px] overflow-hidden">
            <img
              src="/3.webp"
              alt="Alpha Tracker dashboard full view"
              className="w-full h-full object-cover"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
        }
      `}</style>
    </section>
  );
}
