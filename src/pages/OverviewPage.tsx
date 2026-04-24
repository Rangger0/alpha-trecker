import { useMemo, useState, type CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { useAirdrops } from '@/hooks/use-airdrops';
import { useUsageLimits } from '@/hooks/use-usage-limits';
import type { Airdrop, AirdropType } from '@/types';
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Bot,
  CheckCircle2,
  Clock3,
  Droplets,
  Layers3,
  Repeat,
  Sparkles,
  Star,
  Users,
  Wallet,
  Wrench,
} from 'lucide-react';

type MacDelayStyle = CSSProperties & {
  '--mac-delay': string;
};

type AccentCard = {
  id: string;
  label: string;
  value: string | number;
  meta: string;
  accent: string;
  icon: typeof Activity;
};

const formatProjectDate = (value?: string) => {
  if (!value) return '--';

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;

  return parsed.toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const getProgressRatio = (used: number, limit: number) => {
  if (limit <= 0) return 0;
  return Math.min((used / limit) * 100, 100);
};

const getFocusProject = (airdrops: Airdrop[]) => {
  return (
    [...airdrops].sort((left, right) => {
      const leftPriority = Number(Boolean(left.isPriority || left.is_priority));
      const rightPriority = Number(Boolean(right.isPriority || right.is_priority));
      if (rightPriority !== leftPriority) {
        return rightPriority - leftPriority;
      }

      const leftOngoing = Number(left.status === 'Ongoing');
      const rightOngoing = Number(right.status === 'Ongoing');
      if (rightOngoing !== leftOngoing) {
        return rightOngoing - leftOngoing;
      }

      return new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime();
    })[0] ?? null
  );
};

export function OverviewPage() {
  const { airdrops } = useAirdrops();
  const { limits } = useUsageLimits();
  const navigate = useNavigate();
  const [logoError, setLogoError] = useState<Record<string, boolean>>({});

  const totalProjects = airdrops.length;
  const ongoing = airdrops.filter((airdrop) => airdrop.status === 'Ongoing').length;
  const planning = airdrops.filter((airdrop) => airdrop.status === 'Planning').length;
  const completed = airdrops.filter((airdrop) => airdrop.status === 'Done').length;
  const priorityCount = airdrops.filter((airdrop) => Boolean(airdrop.isPriority || airdrop.is_priority)).length;
  const successRate = totalProjects > 0 ? Math.round((completed / totalProjects) * 100) : 0;
  const focusProject = useMemo(() => getFocusProject(airdrops), [airdrops]);

  const commandStats: AccentCard[] = [
    {
      id: 'tracked',
      label: 'Tracked',
      value: totalProjects,
      meta: `${ongoing} ongoing lane`,
      accent: 'var(--alpha-signal)',
      icon: Layers3,
    },
    {
      id: 'priority',
      label: 'Priority',
      value: priorityCount,
      meta: priorityCount > 0 ? 'Pinned opportunities' : 'No pinned lane',
      accent: 'var(--alpha-violet)',
      icon: Sparkles,
    },
    {
      id: 'done',
      label: 'Completed',
      value: completed,
      meta: `${successRate}% success rate`,
      accent: 'var(--alpha-info)',
      icon: CheckCircle2,
    },
    {
      id: 'planning',
      label: 'Planning',
      value: planning,
      meta: 'Waiting to activate',
      accent: 'var(--alpha-warning)',
      icon: Clock3,
    },
  ];

  const commandLinks = [
    {
      id: 'dashboard',
      title: 'Open dashboard',
      subtitle: 'Monitor active lanes, gas fee, and reward flow.',
      path: '/dashboard',
      accent: 'var(--alpha-signal)',
      icon: BarChart3,
    },
    {
      id: 'priority',
      title: 'Priority board',
      subtitle: 'Jump langsung ke project yang paling layak dikejar.',
      path: '/priority-projects',
      accent: 'var(--alpha-violet)',
      icon: Star,
    },
    {
      id: 'ecosystem',
      title: 'Ecosystem atlas',
      subtitle: 'Lihat cluster chain dan progress setup yang aktif.',
      path: '/ecosystem',
      accent: 'var(--alpha-info)',
      icon: Wallet,
    },
    {
      id: 'screening',
      title: 'Screening desk',
      subtitle: 'Cek wallet, eligibility, dan project signal lebih cepat.',
      path: '/screening',
      accent: 'var(--alpha-warning)',
      icon: Activity,
    },
  ];

  const utilityDeck = [
    {
      id: 'faucet',
      title: 'Faucet',
      subtitle: 'Get testnet tokens',
      path: '/faucet',
      accent: 'var(--alpha-signal)',
      icon: Droplets,
    },
    {
      id: 'multi',
      title: 'Multi Account',
      subtitle: 'Track many wallets in one board',
      path: '/multiple-account',
      accent: 'var(--alpha-warning)',
      icon: Users,
    },
    {
      id: 'ai',
      title: 'AI Stack',
      subtitle: 'Coding, research, dan workflow agentic',
      path: '/ai-tools',
      accent: 'var(--alpha-info)',
      icon: Bot,
    },
    {
      id: 'research',
      title: 'Research Tools',
      subtitle: 'Deck market intel dan onchain scan',
      path: '/tools',
      accent: 'var(--alpha-violet)',
      icon: Wrench,
    },
    {
      id: 'swap',
      title: 'Swap & Bridge',
      subtitle: 'Cross-chain route and venue desk',
      path: '/swap-bridge',
      accent: 'var(--alpha-signal)',
      icon: Repeat,
    },
  ];

  const trackingModes: AirdropType[] = ['Retroactive', 'Daily', 'Daily Quest', 'Quest', 'Waitlist', 'DeFi'];
  const modeSummary = trackingModes.map((mode) => ({
    mode,
    count: airdrops.filter((airdrop) => airdrop.type === mode).length,
  }));

  const usageCards = [
    {
      title: 'Documents',
      ...limits.documents,
      accent: 'var(--alpha-signal)',
    },
    {
      title: 'Ecosystem',
      ...limits.ecosystem,
      accent: 'var(--alpha-info)',
    },
    {
      title: 'Priorities',
      ...limits.priorities,
      accent: 'var(--alpha-violet)',
    },
    {
      title: 'Tasks',
      ...limits.tasksPerDoc,
      accent: 'var(--alpha-warning)',
    },
  ];

  return (
    <DashboardLayout disableMonochrome>
      <div className="macos-root macos-page-shell">
        <section className="macos-page-header macos-animate-up">
          <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_420px] xl:items-end">
            <div>
              <div className="macos-page-kicker">
                <Sparkles className="h-3.5 w-3.5" />
                Mission control
              </div>
              <h1 className="macos-page-title">Overview</h1>
              <p className="macos-page-subtitle">
                A quick view of your current workspace state,
including active signals, priorities, and execution surfaces.     
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full border border-alpha-border bg-[color:var(--alpha-hover-soft)] px-3 py-1 text-[10px] uppercase tracking-[0.18em] alpha-text-muted">
                  {totalProjects} tracked projects
                </span>
                <span className="rounded-full border border-alpha-border bg-[color:var(--alpha-hover-soft)] px-3 py-1 text-[10px] uppercase tracking-[0.18em] alpha-text-muted">
                  {modeSummary.filter((item) => item.count > 0).length} active modes
                </span>
                <span className="rounded-full border border-alpha-border bg-[color:var(--alpha-hover-soft)] px-3 py-1 text-[10px] uppercase tracking-[0.18em] alpha-text-muted">
                  {successRate}% completion rhythm
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {commandStats.map((stat, index) => {
                const Icon = stat.icon;

                return (
                  <div
                    key={stat.id}
                    className="macos-card macos-card-entry rounded-[1.2rem] px-4 py-3"
                    style={{ '--mac-delay': `${index * 40}ms` } as MacDelayStyle}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-[10px] uppercase tracking-[0.22em] alpha-text-muted">{stat.label}</p>
                      <Icon className="h-4 w-4" style={{ color: stat.accent }} />
                    </div>
                    <p className="mt-2 text-2xl font-semibold alpha-text">{stat.value}</p>
                    <p className="mt-1 text-[11px] alpha-text-muted">{stat.meta}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section
          className="mb-5 overflow-hidden rounded-[1.6rem] border p-5"
          style={{
            borderColor: 'var(--alpha-border)',
            background: 'linear-gradient(135deg, color-mix(in srgb, var(--alpha-signal) 12%, var(--alpha-surface)), var(--alpha-surface))',
            boxShadow: '0 20px 42px color-mix(in srgb, var(--alpha-signal) 8%, transparent)',
          }}
        >
          <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px] xl:items-end">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-alpha-border bg-[color:var(--alpha-hover-soft)] px-3 py-1 text-[10px] uppercase tracking-[0.24em] alpha-text-muted">
                <Sparkles className="h-3.5 w-3.5 text-gold" />
                Command brief
              </div>

              <div className="mt-4 flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-[1rem] border border-alpha-border bg-[color:var(--alpha-hover-soft)]">
                  {focusProject?.projectLogo && !logoError[focusProject.id] ? (
                    <img
                      src={focusProject.projectLogo}
                      alt={focusProject.projectName}
                      className="h-full w-full object-contain bg-[color:var(--alpha-surface)] p-2"
                      loading="lazy"
                      onError={() =>
                        setLogoError((prev) => ({ ...prev, [focusProject.id]: true }))
                      }
                    />
                  ) : focusProject ? (
                    <span className="text-lg font-semibold alpha-text">
                      {focusProject.projectName[0]?.toUpperCase()}
                    </span>
                  ) : (
                    <Layers3 className="h-6 w-6 text-gold" />
                  )}
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-2xl font-semibold alpha-text">
                      {focusProject?.projectName ?? 'Workspace ready'}
                    </h2>
                    <span className="rounded-full border border-alpha-border bg-[color:var(--alpha-hover-soft)] px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] alpha-text-muted">
                      {focusProject?.status ?? 'Idle'}
                    </span>
                  </div>

                  <p className="mt-2 max-w-2xl text-sm leading-6 alpha-text-muted">
                    {focusProject
                      ? `${focusProject.projectName} sekarang paling layak dijadikan pintu masuk. Kamu bisa lompat ke dashboard, priority, atau ecosystem tanpa harus scan semua menu dulu.`
                      : 'Belum ada project aktif. Mulai dari dashboard lalu isi workspace dengan project yang mau dipantau.'}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {focusProject ? (
                      <>
                        <span className="rounded-full border border-alpha-border bg-[color:var(--alpha-hover-soft)] px-3 py-1 text-[10px] uppercase tracking-[0.16em] alpha-text-muted">
                          {focusProject.type}
                        </span>
                        <span className="rounded-full border border-alpha-border bg-[color:var(--alpha-hover-soft)] px-3 py-1 text-[10px] uppercase tracking-[0.16em] alpha-text-muted">
                          Created {formatProjectDate(focusProject.createdAt)}
                        </span>
                      </>
                    ) : null}
                  </div>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <Button
                      onClick={() => navigate('/dashboard')}
                      className="rounded-[0.95rem] border border-[var(--alpha-signal)] bg-[var(--alpha-signal)] text-[var(--alpha-accent-contrast)] hover:bg-[var(--alpha-signal-press)]"
                    >
                      Open dashboard
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => navigate('/priority-projects')}
                      className="rounded-[0.95rem] border-alpha-border bg-[color:var(--alpha-surface)]"
                    >
                      View priority
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Focus lane', value: focusProject?.type ?? 'Standby' },
                { label: 'Ongoing', value: ongoing },
                { label: 'Not started', value: planning },
                { label: 'Success rate', value: `${successRate}%` },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-[1rem] border border-alpha-border bg-[color:var(--alpha-hover-soft)] px-3.5 py-3"
                >
                  <p className="text-[10px] uppercase tracking-[0.18em] alpha-text-muted">{item.label}</p>
                  <p className="mt-2 text-lg font-semibold alpha-text">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <section className="macos-card rounded-[1.45rem] p-4">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <div className="macos-section-label">
                  <ArrowRight className="h-3.5 w-3.5" />
                  Command routes
                </div>
                <p className="mt-2 text-sm alpha-text-muted">
                 
                </p>
              </div>

              <span className="rounded-full border border-alpha-border bg-[color:var(--alpha-hover-soft)] px-3 py-1 text-[10px] uppercase tracking-[0.18em] alpha-text-muted">
                {commandLinks.length} routes
              </span>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {commandLinks.map((item, index) => {
                const Icon = item.icon;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => navigate(item.path)}
                    className="group rounded-[1.2rem] border p-4 text-left transition-all duration-200 hover:-translate-y-0.5"
                    style={{
                      borderColor: 'var(--alpha-border)',
                      background: `linear-gradient(160deg, color-mix(in srgb, ${item.accent} 10%, var(--alpha-surface)), var(--alpha-surface))`,
                      boxShadow: `0 18px 34px color-mix(in srgb, ${item.accent} 9%, transparent)`,
                      '--mac-delay': `${index * 24}ms`,
                    } as MacDelayStyle}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-start gap-3">
                        <div
                          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[0.95rem] border"
                          style={{
                            borderColor: `color-mix(in srgb, ${item.accent} 34%, var(--alpha-border))`,
                            background: `color-mix(in srgb, ${item.accent} 12%, transparent)`,
                          }}
                        >
                          <Icon className="h-4 w-4" style={{ color: item.accent }} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-base font-semibold alpha-text">{item.title}</p>
                          <p className="mt-1 text-[12px] leading-5 alpha-text-muted">{item.subtitle}</p>
                        </div>
                      </div>
                      <ArrowUpRight className="h-4 w-4 shrink-0 opacity-0 transition-opacity duration-150 group-hover:opacity-100" style={{ color: item.accent }} />
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="macos-card rounded-[1.45rem] p-4">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <div className="macos-section-label">
                  <Activity className="h-3.5 w-3.5" />
                  Tracking signals
                </div>
                <p className="mt-2 text-sm alpha-text-muted">
                  
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {modeSummary.map((item, index) => (
                <div
                  key={item.mode}
                  className="rounded-[1rem] border border-alpha-border bg-[color:var(--alpha-hover-soft)] px-3 py-3"
                  style={{ '--mac-delay': `${index * 18}ms` } as MacDelayStyle}
                >
                  <p className="text-[10px] uppercase tracking-[0.18em] alpha-text-muted">{item.mode}</p>
                  <p className="mt-2 text-[1.35rem] font-semibold alpha-text">
                    {String(item.count).padStart(2, '0')}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-[1rem] border border-alpha-border bg-[color:var(--alpha-hover-soft)] px-4 py-3">
              <p className="text-[10px] uppercase tracking-[0.18em] alpha-text-muted">Signal note</p>
              <p className="mt-2 text-sm leading-6 alpha-text-muted">
                Mode yang paling dominan sekarang adalah{' '}
                <span className="font-semibold alpha-text">
                  {modeSummary.sort((left, right) => right.count - left.count)[0]?.mode ?? 'standby'}
                </span>
                . 
              </p>
            </div>
          </section>
        </div>

        <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)]">
          <section className="macos-card rounded-[1.45rem] p-4">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <div className="macos-section-label">
                  <BarChart3 className="h-3.5 w-3.5" />
                  Capacity lane
                </div>
                <p className="mt-2 text-sm alpha-text-muted">
                  Ringkasan kapasitas workspace yang masih tersedia untuk dokumen, ecosystem, priority, dan task.
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {usageCards.map((item, index) => {
                const ratio = getProgressRatio(item.used, item.limit);
                const remaining = item.limit - item.used;

                return (
                  <div
                    key={item.title}
                    className="rounded-[1.2rem] border p-4"
                    style={{
                      borderColor: 'var(--alpha-border)',
                      background: `linear-gradient(160deg, color-mix(in srgb, ${item.accent} 8%, var(--alpha-surface)), var(--alpha-surface))`,
                      '--mac-delay': `${index * 20}ms`,
                    } as MacDelayStyle}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-[10px] uppercase tracking-[0.18em] alpha-text-muted">{item.title}</p>
                      <span className="text-[10px] alpha-text-muted">{remaining} left</span>
                    </div>
                    <p className="mt-2 text-lg font-semibold alpha-text">
                      {item.used} / {item.limit}
                    </p>
                    <div className="mt-3 h-2 rounded-full bg-[color:var(--alpha-hover-soft)]">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${ratio}%`, backgroundColor: item.accent }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="macos-card rounded-[1.45rem] p-4">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <div className="macos-section-label">
                  <Wrench className="h-3.5 w-3.5" />
                  Utility deck
                </div>
                <p className="mt-2 text-sm alpha-text-muted">
                  Shortcut yang paling berguna buat execution sehari-hari tanpa harus muter sidebar.
                </p>
              </div>
            </div>

            <div className="grid gap-3">
              {utilityDeck.map((item, index) => {
                const Icon = item.icon;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => navigate(item.path)}
                    className="group rounded-[1.05rem] border p-4 text-left transition-all duration-150 hover:-translate-y-0.5"
                    style={{
                      borderColor: 'var(--alpha-border)',
                      background: `linear-gradient(160deg, color-mix(in srgb, ${item.accent} 10%, var(--alpha-surface)), var(--alpha-surface))`,
                      '--mac-delay': `${index * 18}ms`,
                    } as MacDelayStyle}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-start gap-3">
                        <div
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[0.9rem] border"
                          style={{
                            borderColor: `color-mix(in srgb, ${item.accent} 34%, var(--alpha-border))`,
                            background: `color-mix(in srgb, ${item.accent} 12%, transparent)`,
                          }}
                        >
                          <Icon className="h-4 w-4" style={{ color: item.accent }} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold alpha-text">{item.title}</p>
                          <p className="mt-1 text-[12px] leading-5 alpha-text-muted">{item.subtitle}</p>
                        </div>
                      </div>
                      <ArrowUpRight className="h-4 w-4 shrink-0 opacity-0 transition-opacity duration-150 group-hover:opacity-100" style={{ color: item.accent }} />
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
}
