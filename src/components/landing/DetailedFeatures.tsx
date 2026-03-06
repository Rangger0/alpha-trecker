import { Star, TrendingUp, Brain, DollarSign, Bell, Monitor } from 'lucide-react';

const detailedFeatures = [
  {
    icon: Star,
    title: 'Priority Projects',
    description: 'Manage your most important airdrop projects with countdowns, progress tracking, and reminders.',
    points: ['Real-time countdown timers', 'Task management with progress', 'Smart reset intervals'],
  },
  {
    icon: TrendingUp,
    title: 'Real-time Market Data',
    description: 'Track live market prices, trends, and chart context without leaving your workspace.',
    points: ['Live price updates', 'TradingView integration', 'Market heatmap overview'],
  },
  {
    icon: Brain,
    title: 'AI-Powered Tools',
    description: 'Use AI assistants to brainstorm, search faster, and identify new opportunities.',
    points: ['AI airdrop generator', 'Smart search and suggestions', 'Trending opportunity detection'],
  },
  {
    icon: DollarSign,
    title: 'Advanced Financial Tools',
    description: 'Calculate profit, manage multiple accounts, and review portfolio performance cleanly.',
    points: ['Profit and loss tracking', 'Multiple account management', 'Portfolio performance snapshots'],
  },
  {
    icon: Bell,
    title: 'Smart Notifications',
    description: 'Stay on top of deadlines with reminders, alerts, and collaboration-driven follow-ups.',
    points: ['Global priority reminders', 'Push notifications support', 'Live community follow-up'],
  },
  {
    icon: Monitor,
    title: 'Modern Experience',
    description: 'Use the same workspace comfortably across desktop and mobile with consistent layout behavior.',
    points: ['Responsive interface', 'Dark and light mode support', 'Installable app flow'],
  },
];

export function DetailedFeatures() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <h2
            className="mb-4 text-3xl font-semibold tracking-[-0.03em] sm:text-4xl"
            style={{ color: 'var(--alpha-text)' }}
          >
            Powerful Features for Web3 Teams
          </h2>
          <p className="mx-auto max-w-2xl text-lg" style={{ color: 'var(--alpha-text-muted)' }}>
            Everything you need to manage projects, track market context, and keep execution consistent.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {detailedFeatures.map((feature) => (
            <article
              key={feature.title}
              className="macos-landing-card rounded-[1.75rem] p-6 transition-all duration-200 hover:-translate-y-1"
              style={{
                borderColor: 'color-mix(in srgb, var(--alpha-border) 84%, transparent)',
                background:
                  'linear-gradient(180deg, color-mix(in srgb, var(--alpha-surface) 96%, transparent), color-mix(in srgb, var(--alpha-panel) 89%, transparent))',
              }}
            >
              <div
                className="mb-4 flex h-12 w-12 items-center justify-center rounded-[14px]"
                style={{
                  background:
                    'linear-gradient(135deg, color-mix(in srgb, var(--alpha-accent-to) 18%, transparent), color-mix(in srgb, var(--alpha-border) 62%, var(--alpha-surface) 38%))',
                  color: 'var(--alpha-text)',
                  border: '1px solid color-mix(in srgb, var(--alpha-border) 84%, transparent)',
                }}
              >
                <feature.icon className="h-5 w-5" />
              </div>

              <h3 className="mb-2 text-lg font-semibold tracking-[-0.02em]" style={{ color: 'var(--alpha-text)' }}>
                {feature.title}
              </h3>
              <p className="mb-4 text-sm leading-6" style={{ color: 'var(--alpha-text-muted)' }}>
                {feature.description}
              </p>

              <ul className="space-y-2">
                {feature.points.map((point) => (
                  <li key={point} className="flex items-center gap-2 text-sm" style={{ color: 'var(--alpha-text-muted)' }}>
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ background: 'var(--alpha-accent-to)' }}
                    />
                    {point}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
