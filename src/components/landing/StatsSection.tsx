import { BarChart3, Database, Globe, Shield } from 'lucide-react';
import { useInView } from '@/hooks/use-in-view';

const stats = [
  {
    label: 'Tracked Funding',
    value: '$1.2B+',
    icon: Database,
  },
  {
    label: 'Projects Indexed',
    value: '8,000+',
    icon: Globe,
  },
  {
    label: 'Ecosystems',
    value: '120+',
    icon: BarChart3,
  },
  {
    label: 'Research Accuracy',
    value: '95%',
    icon: Shield,
  },
];

export function StatsSection() {
  const { ref, isInView } = useInView();

  return (
    <section ref={ref} className="alpha-saas-section px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
      <div className="macos-landing-width">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={`group p-6 rounded-lg border transition-all duration-300 hover:border-opacity-100 scroll-stagger-item ${isInView ? 'in-view' : ''}`}
              style={{
                borderColor: 'var(--alpha-border)',
                backgroundColor: 'color-mix(in srgb, var(--alpha-panel) 50%, transparent)',
                animationDelay: `${index * 100}ms`,
              }}
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300"
                  style={{
                    backgroundColor: 'color-mix(in srgb, var(--alpha-accent) 10%, transparent)',
                    color: 'var(--alpha-accent)',
                  }}
                >
                  <stat.icon className="h-5 w-5" />
                </div>
              </div>

              <p className="text-sm font-medium mb-2" style={{ color: 'var(--alpha-text-muted)' }}>
                {stat.label}
              </p>
              <p className="text-3xl sm:text-4xl font-bold" style={{ color: 'var(--alpha-text)' }}>
                {stat.value}
              </p>
            </div>
          ))}
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

        .group:hover {
          border-color: color-mix(in srgb, var(--alpha-accent) 50%, transparent);
        }
      `}</style>
    </section>
  );
}
