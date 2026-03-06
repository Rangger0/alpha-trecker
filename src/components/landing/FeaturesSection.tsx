import { LayoutDashboard, Zap, Users, Shield } from 'lucide-react';

const features = [
  {
    icon: LayoutDashboard,
    title: 'Multi-Account Dashboard',
    description: 'Manage multiple wallets and projects in one place.',
  },
  {
    icon: Zap,
    title: 'Realtime Airdrop Checker',
    description: 'Check airdrop tasks, status, and follow-up actions in seconds.',
  },
  {
    icon: Users,
    title: 'Team Collaboration',
    description: 'Invite your team, track progress, and keep execution aligned.',
  },
  {
    icon: Shield,
    title: 'Data Privacy & Security',
    description: 'Protected storage, cleaner permissions, and safer daily workflow.',
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <span
            className="mb-4 inline-flex rounded-full px-4 py-2 text-sm font-medium"
            style={{
              background: 'color-mix(in srgb, var(--alpha-surface) 86%, transparent)',
              border: '1px solid color-mix(in srgb, var(--alpha-border) 88%, transparent)',
              color: 'var(--alpha-text-muted)',
            }}
          >
            Features
          </span>
          <h2
            className="mb-4 text-3xl font-semibold tracking-[-0.03em] sm:text-4xl"
            style={{ color: 'var(--alpha-text)' }}
          >
            Why Use Alpha Tracker?
          </h2>
          <p className="mx-auto max-w-2xl text-lg" style={{ color: 'var(--alpha-text-muted)' }}>
            Everything you need for efficient airdrop hunting and project management.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="macos-landing-card rounded-[2rem] p-6 transition-all duration-200 hover:-translate-y-1"
              style={{
                borderColor: 'color-mix(in srgb, var(--alpha-border) 86%, transparent)',
                background:
                  'linear-gradient(180deg, color-mix(in srgb, var(--alpha-surface) 95%, transparent), color-mix(in srgb, var(--alpha-panel) 88%, transparent))',
              }}
            >
              <div
                className="mb-4 flex h-12 w-12 items-center justify-center rounded-[14px]"
                style={{
                  background:
                    'linear-gradient(135deg, color-mix(in srgb, var(--alpha-accent) 24%, transparent), color-mix(in srgb, var(--alpha-border) 58%, var(--alpha-surface) 42%))',
                  color: 'var(--alpha-text)',
                  border: '1px solid color-mix(in srgb, var(--alpha-border) 84%, transparent)',
                }}
              >
                <feature.icon className="h-5 w-5" />
              </div>

              <h3 className="mb-2 text-lg font-semibold tracking-[-0.02em]" style={{ color: 'var(--alpha-text)' }}>
                {feature.title}
              </h3>
              <p className="text-sm leading-6" style={{ color: 'var(--alpha-text-muted)' }}>
                {feature.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
