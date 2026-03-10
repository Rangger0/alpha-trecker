import type { CSSProperties } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, Shield, Sparkles, Users } from 'lucide-react';

const plans = [
  {
    icon: Shield,
    name: 'Explorer',
    availability: 'Free',
    tagline: 'Solo setup for hunters who want a cleaner base.',
    description: 'Start with the main workspace, research surfaces, and product flow that already feels organized.',
    points: [
      'Landing, tools, ecosystem lanes, and core workspace access',
      'A solid base for daily project review and discovery',
      'Best for solo users building a more disciplined setup',
    ],
    cta: 'Start Free',
    href: '/register',
  },
  {
    icon: Sparkles,
    name: 'Operator',
    availability: 'Beta Access',
    tagline: 'For active airdroppers who want the sharpest version first.',
    description: 'This is the premium lane: richer product flow, stronger polish, and the most intentional experience as the app evolves.',
    points: [
      'Everything in Explorer with deeper operating polish',
      'Best fit for users who want one main desk for execution',
      'Good foundation for reward tracking and tighter workflow loops',
    ],
    cta: 'Join Beta',
    href: '/register',
    featured: true,
  },
  {
    icon: Users,
    name: 'Team Stack',
    availability: 'Custom Setup',
    tagline: 'For smaller teams, partners, and shared research loops.',
    description: 'Bring cleaner coordination, shared context, and product structure that can support handoff between people.',
    points: [
      'Shared operating model for multi-person workflows',
      'Useful when research, execution, and review involve more than one user',
      'Best path for evolving Alpha Tracker into a team-facing product',
    ],
    cta: 'Request Access',
    href: '/register',
  },
];

export function PricingSection() {
  return (
    <section id="access" className="px-4 py-24 sm:px-6 lg:px-8">
      <div className="macos-landing-width">
        <div className="mb-14 text-center">
          <span
            className="inline-flex rounded-full px-4 py-2 text-sm font-medium"
            style={{
              background: 'color-mix(in srgb, var(--alpha-surface) 86%, transparent)',
              border: '1px solid color-mix(in srgb, var(--alpha-border) 88%, transparent)',
              color: 'var(--alpha-text-muted)',
            }}
          >
            Access modes
          </span>

          <h2
            className="mt-5 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl lg:text-[3rem]"
            style={{ color: 'var(--alpha-text)' }}
          >
            Access that can grow with your operation.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8" style={{ color: 'var(--alpha-text-muted)' }}>
            Ini bukan harus pricing final. Tapi landing page yang lengkap butuh section access supaya produk terasa matang
            dan user paham jalur masuknya.
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-3">
          {plans.map((plan, index) => (
            <article
              key={plan.name}
              className={`macos-landing-card relative rounded-[2rem] p-6 sm:p-7 ${plan.featured ? 'xl:-translate-y-3' : ''}`}
              data-stagger
              style={{
                '--stagger-delay': `${index * 80}ms`,
                borderColor: plan.featured
                  ? 'color-mix(in srgb, var(--alpha-highlight) 34%, var(--alpha-border))'
                  : 'color-mix(in srgb, var(--alpha-border) 84%, transparent)',
                background: plan.featured
                  ? 'linear-gradient(180deg, color-mix(in srgb, var(--alpha-highlight) 12%, transparent), color-mix(in srgb, var(--alpha-surface) 96%, transparent), color-mix(in srgb, var(--alpha-panel) 90%, transparent))'
                  : 'linear-gradient(180deg, color-mix(in srgb, var(--alpha-surface) 97%, transparent), color-mix(in srgb, var(--alpha-panel) 90%, transparent))',
              } as CSSProperties}
            >
              {plan.featured ? (
                <span
                  className="absolute right-5 top-5 rounded-full border px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em]"
                  style={{
                    borderColor: 'color-mix(in srgb, var(--alpha-highlight) 28%, transparent)',
                    background: 'color-mix(in srgb, var(--alpha-highlight) 10%, transparent)',
                    color: 'var(--alpha-text)',
                  }}
                >
                  Recommended
                </span>
              ) : null}

              <div
                className="flex h-12 w-12 items-center justify-center rounded-[14px] border"
                style={{
                  borderColor: 'color-mix(in srgb, var(--alpha-border) 82%, transparent)',
                  background:
                    'linear-gradient(135deg, color-mix(in srgb, var(--alpha-accent-to) 18%, transparent), color-mix(in srgb, var(--alpha-border) 62%, var(--alpha-surface) 38%))',
                  color: 'var(--alpha-text)',
                }}
              >
                <plan.icon className="h-5 w-5" />
              </div>

              <p className="mt-5 text-sm uppercase tracking-[0.18em]" style={{ color: 'var(--alpha-text-muted)' }}>
                {plan.name}
              </p>

              <h3 className="mt-2 text-[2rem] font-semibold tracking-[-0.05em]" style={{ color: 'var(--alpha-text)' }}>
                {plan.availability}
              </h3>

              <p className="mt-3 text-base font-semibold tracking-[-0.02em]" style={{ color: 'var(--alpha-text)' }}>
                {plan.tagline}
              </p>

              <p className="mt-3 text-sm leading-7" style={{ color: 'var(--alpha-text-muted)' }}>
                {plan.description}
              </p>

              <div
                className="mt-6 border-t pt-5"
                style={{ borderColor: 'color-mix(in srgb, var(--alpha-border) 72%, transparent)' }}
              >
                <div className="space-y-3">
                  {plan.points.map((point) => (
                    <div key={point} className="flex items-start gap-2.5 text-sm leading-6" style={{ color: 'var(--alpha-text-muted)' }}>
                      <Check className="mt-0.5 h-4 w-4 shrink-0" style={{ color: 'var(--alpha-accent-to)' }} />
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Link to={plan.href} className="mt-8 inline-flex">
                <Button
                  variant={plan.featured ? 'default' : 'outline'}
                  className="macos-btn h-11 rounded-full px-6 text-sm font-semibold"
                  style={
                    plan.featured
                      ? {
                          background:
                            'linear-gradient(135deg, var(--alpha-accent-from), color-mix(in srgb, var(--alpha-accent-to) 78%, var(--alpha-accent) 22%))',
                          color: 'var(--alpha-accent-contrast)',
                          boxShadow: '0 16px 34px color-mix(in srgb, var(--alpha-accent-to) 20%, transparent)',
                        }
                      : {
                          borderColor: 'color-mix(in srgb, var(--alpha-border) 88%, transparent)',
                          background: 'color-mix(in srgb, var(--alpha-surface) 86%, transparent)',
                          color: 'var(--alpha-text)',
                        }
                  }
                >
                  {plan.cta}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
