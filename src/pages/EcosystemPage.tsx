import { useState, type ChangeEvent, type MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowUpRight,
  BarChart3,
  Layers,
  Search,
  Sparkles,
  Twitter as TwitterIcon,
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Input } from '@/components/ui/input';
import { useAirdrops } from '@/hooks/use-airdrops';
import { PREDEFINED_ECOSYSTEMS } from '@/lib/ecosystems';

const ecosystemDescriptions: Record<string, string> = {
  eth: 'Settlement layer for DeFi, infrastructure, and core onchain campaigns.',
  sol: 'Fast-moving consumer ecosystem with active quests, mints, and trading flows.',
  arb: 'L2 ecosystem focused on DeFi routing, liquidity, and incentive programs.',
  bnb: 'High-volume retail chain with launch campaigns and broad project rotation.',
  base: 'Builder-heavy network with fresh apps, socials, and onchain growth loops.',
  avax: 'Subnet and DeFi ecosystem with a mix of infra and reward-driven projects.',
  poly: 'Multi-chain expansion lane with gaming, staking, and liquidity experiments.',
  ftm: 'Lean ecosystem for DeFi monitoring, wallet farming, and niche alpha plays.',
  sui: 'New generation chain with wallet onboarding, campaigns, and ecosystem grants.',
};

export function EcosystemPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const navigate = useNavigate();
  const { airdrops } = useAirdrops();
  const [searchQuery, setSearchQuery] = useState('');

  const ecosystemCards = PREDEFINED_ECOSYSTEMS.map((ecosystem) => {
    const assigned = airdrops.filter((airdrop) => airdrop.ecosystemId === ecosystem.id);
    const totalTasks = assigned.reduce((sum, airdrop) => sum + (airdrop.tasks?.length || 0), 0);
    const completedTasks = assigned.reduce(
      (sum, airdrop) => sum + (airdrop.tasks?.filter((task) => task.completed).length || 0),
      0,
    );
    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    const statusLabel = assigned.length === 0 ? 'Watchlist' : progress >= 100 ? 'Strong' : 'Building';

    return {
      ...ecosystem,
      description: ecosystemDescriptions[ecosystem.id] ?? 'Track projects, progress, and related ecosystem activity.',
      stats: {
        count: assigned.length,
        totalTasks,
        completedTasks,
        progress,
      },
      statusLabel,
    };
  });

  const filteredEcosystems = ecosystemCards.filter((ecosystem) =>
    ecosystem.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const trackedProjects = ecosystemCards.reduce((sum, ecosystem) => sum + ecosystem.stats.count, 0);
  const activeEcosystems = ecosystemCards.filter((ecosystem) => ecosystem.stats.count > 0).length;
  const averageProgress = ecosystemCards.length
    ? Math.round(ecosystemCards.reduce((sum, ecosystem) => sum + ecosystem.stats.progress, 0) / ecosystemCards.length)
    : 0;

  const summaryCards = [
    {
      label: 'Tracked Projects',
      value: trackedProjects,
      icon: Layers,
    },
    {
      label: 'Active Ecosystems',
      value: activeEcosystems,
      icon: Sparkles,
    },
    {
      label: 'Average Progress',
      value: `${averageProgress}%`,
      icon: BarChart3,
    },
  ];

  return (
    <DashboardLayout>
      <div className="macos-root macos-page-shell">
        <div className="macos-page-header">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-3xl">
              <div className="macos-page-kicker">
                <ArrowUpRight className="h-3.5 w-3.5" />
                Ecosystem Atlas
              </div>
              <h1 className="macos-page-title">Ecosystems</h1>
              <p className="macos-page-subtitle">
                Kelola semua chain yang Anda pantau dalam kartu yang lebih rapi, lebih jelas, dan lebih enak dipakai buat melihat progress project.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {summaryCards.map((card) => {
                const Icon = card.icon;
                return (
                  <div
                    key={card.label}
                    className="rounded-[1.25rem] border px-4 py-4"
                    style={{
                      borderColor: 'var(--alpha-border)',
                      background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.75)',
                    }}
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-[11px] font-mono uppercase tracking-[0.16em] alpha-text-muted">{card.label}</span>
                      <Icon className="h-4 w-4 alpha-text-muted" />
                    </div>
                    <p className="text-2xl font-semibold alpha-text">{card.value}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <div
              className="rounded-full border px-4 py-2 text-xs font-mono uppercase tracking-[0.18em]"
              style={{
                borderColor: 'var(--alpha-border)',
                background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.72)',
                color: 'var(--alpha-text-muted)',
              }}
            >
              {filteredEcosystems.length} ecosystems shown
            </div>
            <div
              className="rounded-full border px-4 py-2 text-xs font-mono uppercase tracking-[0.18em]"
              style={{
                borderColor: 'var(--alpha-border)',
                background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.72)',
                color: 'var(--alpha-text-muted)',
              }}
            >
              Clean cards, faster scan
            </div>
          </div>

          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 alpha-text-muted" />
            <Input
              placeholder="Search ecosystems..."
              value={searchQuery}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              className="h-12 rounded-2xl border-[color:var(--alpha-border)] bg-white/70 pl-10 font-mono shadow-none dark:bg-white/[0.04]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          {filteredEcosystems.map((ecosystem) => (
            <div
              key={ecosystem.id}
              onClick={() => navigate(`/ecosystem/${ecosystem.id}`)}
              className="group relative cursor-pointer overflow-hidden rounded-[1.8rem] border p-5 transition-[transform,box-shadow,border-color] duration-200 ease-out hover:-translate-y-1"
              style={{
                borderColor: 'var(--alpha-border)',
                background: isDark
                  ? 'linear-gradient(180deg, rgba(255,255,255,0.035), rgba(255,255,255,0.015))'
                  : 'linear-gradient(180deg, rgba(255,255,255,0.96), rgba(239,231,219,0.86))',
                boxShadow: isDark
                  ? '0 20px 48px rgba(20,22,33,0.18)'
                  : '0 20px 42px rgba(78,85,71,0.12)',
              }}
            >
              <div
                className="pointer-events-none absolute inset-x-0 top-0 h-28 opacity-90"
                style={{ background: `linear-gradient(135deg, ${ecosystem.color}2a 0%, transparent 72%)` }}
              />
              <div
                className="pointer-events-none absolute -right-8 top-5 h-28 w-28 rounded-full blur-2xl"
                style={{ backgroundColor: `${ecosystem.color}22` }}
              />

              <div className="relative z-10 flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div
                    className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-[1.15rem] border"
                    style={{
                      borderColor: `${ecosystem.color}55`,
                      background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.78)',
                      boxShadow: `0 14px 30px ${ecosystem.color}18`,
                    }}
                  >
                    <span className="absolute text-lg font-bold" style={{ color: ecosystem.color }}>
                      {ecosystem.icon}
                    </span>
                    <img
                      src={ecosystem.logo}
                      alt={ecosystem.name}
                      className="relative z-10 h-8 w-8 object-contain"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-[1.45rem] font-semibold alpha-text">{ecosystem.name}</h3>
                      <ArrowUpRight className="h-4 w-4 opacity-0 transition-opacity duration-150 group-hover:opacity-100" style={{ color: ecosystem.color }} />
                    </div>
                    <p className="mt-1 text-xs font-mono uppercase tracking-[0.18em]" style={{ color: ecosystem.color }}>
                      @{ecosystem.twitterHandle}
                    </p>
                    <p className="mt-3 max-w-[27rem] text-sm leading-6 alpha-text-muted">
                      {ecosystem.description}
                    </p>
                  </div>
                </div>

                <div
                  className="rounded-full border px-3 py-1 text-[11px] font-mono uppercase tracking-[0.16em]"
                  style={{
                    borderColor: `${ecosystem.color}55`,
                    background: `${ecosystem.color}14`,
                    color: ecosystem.color,
                  }}
                >
                  {ecosystem.statusLabel}
                </div>
              </div>

              <div className="relative z-10 mt-6 grid grid-cols-3 gap-3">
                <div
                  className="rounded-[1.15rem] border px-4 py-3"
                  style={{
                    borderColor: 'var(--alpha-border)',
                    background: isDark ? 'rgba(8,10,17,0.16)' : 'rgba(255,255,255,0.72)',
                  }}
                >
                  <p className="text-[11px] font-mono uppercase tracking-[0.16em] alpha-text-muted">Projects</p>
                  <p className="mt-2 text-2xl font-semibold" style={{ color: ecosystem.color }}>
                    {ecosystem.stats.count}
                  </p>
                </div>
                <div
                  className="rounded-[1.15rem] border px-4 py-3"
                  style={{
                    borderColor: 'var(--alpha-border)',
                    background: isDark ? 'rgba(8,10,17,0.16)' : 'rgba(255,255,255,0.72)',
                  }}
                >
                  <p className="text-[11px] font-mono uppercase tracking-[0.16em] alpha-text-muted">Tasks</p>
                  <p className="mt-2 text-2xl font-semibold" style={{ color: ecosystem.color }}>
                    {ecosystem.stats.completedTasks}/{ecosystem.stats.totalTasks}
                  </p>
                </div>
                <div
                  className="rounded-[1.15rem] border px-4 py-3"
                  style={{
                    borderColor: 'var(--alpha-border)',
                    background: isDark ? 'rgba(8,10,17,0.16)' : 'rgba(255,255,255,0.72)',
                  }}
                >
                  <p className="text-[11px] font-mono uppercase tracking-[0.16em] alpha-text-muted">Progress</p>
                  <p className="mt-2 text-2xl font-semibold" style={{ color: ecosystem.color }}>
                    {ecosystem.stats.progress}%
                  </p>
                </div>
              </div>

              <div
                className="relative z-10 mt-5 rounded-[1.25rem] border p-4"
                style={{
                  borderColor: `${ecosystem.color}33`,
                  background: isDark ? 'rgba(255,255,255,0.035)' : 'rgba(255,255,255,0.84)',
                }}
              >
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="alpha-text-muted">Completion Track</span>
                  <span style={{ color: ecosystem.color }}>{ecosystem.stats.progress}%</span>
                </div>

                <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-black/10 dark:bg-white/8">
                  <div
                    className="h-full rounded-full transition-[width] duration-300"
                    style={{
                      width: `${ecosystem.stats.progress}%`,
                      background: `linear-gradient(90deg, ${ecosystem.color}, ${ecosystem.color}cc)`,
                    }}
                  />
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <a
                    href={`https://twitter.com/${ecosystem.twitterHandle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e: MouseEvent<HTMLAnchorElement>) => e.stopPropagation()}
                    className="inline-flex items-center gap-2 text-sm font-medium alpha-text-muted transition-colors duration-150 hover:text-[color:var(--alpha-text)]"
                  >
                    <TwitterIcon className="h-4 w-4" />
                    Open profile
                  </a>

                  <div className="inline-flex items-center gap-2 text-sm font-semibold" style={{ color: ecosystem.color }}>
                    Open ecosystem
                    <ArrowUpRight className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredEcosystems.length === 0 && (
          <div className="macos-empty-state py-16 text-center">
            <ArrowUpRight className="mx-auto mb-4 h-16 w-16 alpha-text-muted" />
            <h3 className="mb-2 font-mono text-lg font-bold alpha-text">No ecosystems found</h3>
            <p className="font-mono text-sm alpha-text-muted">Try a different keyword or clear the search field.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
