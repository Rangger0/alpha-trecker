import { useInView } from '@/hooks/use-in-view';

export function WorkflowTimelineSection() {
  const { ref, isInView } = useInView();

  const steps = [
    { number: '01', label: 'Research' },
    { number: '02', label: 'Analyze' },
    { number: '03', label: 'Execute' },
    { number: '04', label: 'Track' },
    { number: '05', label: 'Claim' },
  ];

  return (
    <section ref={ref} className="alpha-saas-section px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
      <div className="macos-landing-width max-w-4xl mx-auto">
        <div className={`text-center mb-16 scroll-reveal ${isInView ? 'in-view-blur' : ''}`}>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold" style={{ color: 'var(--alpha-text)' }}>
            From research to rewards.
          </h2>
        </div>

        <div className="relative">
          <div
            className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 rounded-full -translate-y-1/2"
            style={{
              background: 'linear-gradient(to right, var(--alpha-border) 0%, var(--alpha-accent) 50%, var(--alpha-border) 100%)',
              opacity: 0.3,
            }}
          />

          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-0 relative z-10">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className={`flex flex-col items-center animate-fade-in-up scroll-stagger-item ${isInView ? 'in-view' : ''}`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center font-bold text-lg sm:text-xl mb-4 transition-all duration-300 hover:scale-110"
                  style={{
                    backgroundColor: 'color-mix(in srgb, var(--alpha-accent) 12%, transparent)',
                    color: 'var(--alpha-accent)',
                    border: '2px solid var(--alpha-border)',
                  }}
                >
                  {step.number}
                </div>

                <p className="text-center font-semibold" style={{ color: 'var(--alpha-text)' }}>
                  {step.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
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
