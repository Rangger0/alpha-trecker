import { startTransition, useDeferredValue, useMemo, useState, type CSSProperties, type ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Activity,
  ArrowUpRight,
  ChevronRight,
  Layers3,
  Search,
  Sparkles,
  Target,
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Input } from '@/components/ui/input';
import { useAirdrops } from '@/hooks/use-airdrops';
import { PREDEFINED_ECOSYSTEMS } from '@/lib/ecosystems';

type EcosystemStatusFilter = 'all' | 'active' | 'watchlist' | 'strong' | 'building';
type MacDelayStyle = CSSProperties & {
  '--mac-delay': string;
};

const ecosystemDescriptions: Record<string, string> = {
  eth: 'Settlement layer untuk DeFi, infra, dan campaign onchain yang panjang.',
  sol: 'Ecosystem cepat untuk consumer apps, quest, trading, dan NFT traffic.',
  arb: 'L2 fokus DeFi routing, bridge, liquidity, dan reward incentive.',
  bnb: 'Retail-heavy chain dengan rotasi campaign, listing, dan aktivitas wallet besar.',
  base: 'Builder-friendly network untuk social, DeFi, dan app growth baru.',
  avax: 'Mix antara subnet, DeFi, dan ecosystem growth yang masih menarik dipantau.',
  poly: 'Jalur multichain dengan gaming, staking, dan experiment consumer crypto.',
  ftm: 'Lean ecosystem buat monitor DeFi niche, wallet farming, dan rotation kecil.',
  sui: 'Chain baru dengan onboarding cepat, campaigns, grants, dan wallet growth.',
};

export function EcosystemPage() {
  const navigate = useNavigate();
  const { airdrops } = useAirdrops();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<EcosystemStatusFilter>('all');
  const [logoError, setLogoError] = useState<Record<string, boolean>>({});
  const deferredSearchQuery = useDeferredValue(searchQuery.trim().toLowerCase());

  const ecosystemStatsById = useMemo(() => {
    return airdrops.reduce<Record<string, { count: number; totalTasks: number; completedTasks: number; projectNames: string[] }>>((acc, airdrop) => {
      const ecosystemId = airdrop.ecosystemId;

      if (!ecosystemId) {
        return acc;
      }

      if (!acc[ecosystemId]) {
        acc[ecosystemId] = { count: 0, totalTasks: 0, completedTasks: 0, projectNames: [] };
      }

      acc[ecosystemId].count += 1;
      acc[ecosystemId].totalTasks += airdrop.tasks?.length || 0;
      acc[ecosystemId].completedTasks += airdrop.tasks?.filter((task) => task.completed).length || 0;
      acc[ecosystemId].projectNames.push(airdrop.projectName);

      return acc;
    }, {});
  }, [airdrops]);

  const ecosystemCards = useMemo(() => {
    return PREDEFINED_ECOSYSTEMS.map((ecosystem) => {
      const stats = ecosystemStatsById[ecosystem.id] ?? {
        count: 0,
        totalTasks: 0,
        completedTasks: 0,
        projectNames: [],
      };
      const progress = stats.totalTasks > 0 ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0;
      const statusLabel = stats.count === 0 ? 'Watchlist' : progress >= 100 ? 'Strong' : 'Building';
      const heat = stats.count === 0 ? 'Idle' : progress >= 80 ? 'High focus' : 'Active';
      const leadLane = stats.projectNames[0] ?? 'Watchlist lane';
      const pulseNote =
        stats.count === 0
          ? 'High activity detected. Strong farming potential.'
          : progress >= 80
            ? 'Fully prepared ecosystem. Ready for execution.'
            : progress >= 40
              ? 'Emerging activity. Worth monitoring.'
              : 'Early stage ecosystem. Low signal, good for scanning.';

      return {
        ...ecosystem,
        description: ecosystemDescriptions[ecosystem.id] ?? 'Track projects, progress, dan signals di ecosystem ini.',
        stats: {
          count: stats.count,
          totalTasks: stats.totalTasks,
          completedTasks: stats.completedTasks,
          progress,
        },
        projectNames: stats.projectNames.slice(0, 4),
        statusLabel,
        heat,
        leadLane,
        pulseNote,
      };
    }).sort((left, right) => {
      const leftScore = left.stats.count * 100 + left.stats.progress;
      const rightScore = right.stats.count * 100 + right.stats.progress;
      return rightScore - leftScore;
    });
  }, [ecosystemStatsById]);

  const filteredEcosystems = useMemo(() => {
    return ecosystemCards.filter((ecosystem) => {
      const matchesQuery =
        !deferredSearchQuery ||
        ecosystem.name.toLowerCase().includes(deferredSearchQuery) ||
        ecosystem.description.toLowerCase().includes(deferredSearchQuery) ||
        ecosystem.projectNames.some((project) => project.toLowerCase().includes(deferredSearchQuery));

      if (!matchesQuery) {
        return false;
      }

      if (statusFilter === 'all') return true;
      if (statusFilter === 'active') return ecosystem.stats.count > 0;
      if (statusFilter === 'watchlist') return ecosystem.statusLabel === 'Watchlist';
      if (statusFilter === 'strong') return ecosystem.statusLabel === 'Strong';
      return ecosystem.statusLabel === 'Building';
    });
  }, [deferredSearchQuery, ecosystemCards, statusFilter]);

  const trackedProjects = useMemo(
    () => ecosystemCards.reduce((sum, ecosystem) => sum + ecosystem.stats.count, 0),
    [ecosystemCards],
  );
  const activeEcosystems = useMemo(
    () => ecosystemCards.filter((ecosystem) => ecosystem.stats.count > 0).length,
    [ecosystemCards],
  );
  const strongEcosystems = useMemo(
    () => ecosystemCards.filter((ecosystem) => ecosystem.statusLabel === 'Strong').length,
    [ecosystemCards],
  );
  const averageProgress = useMemo(
    () => ecosystemCards.length
      ? Math.round(ecosystemCards.reduce((sum, ecosystem) => sum + ecosystem.stats.progress, 0) / ecosystemCards.length)
      : 0,
    [ecosystemCards],
  );

  const featuredEcosystem = filteredEcosystems[0] ?? ecosystemCards[0];

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextValue = event.target.value;
    startTransition(() => setSearchQuery(nextValue));
  };

  const filters: Array<{ id: EcosystemStatusFilter; label: string }> = [
    { id: 'all', label: 'All' },
    { id: 'active', label: 'Active' },
    { id: 'building', label: 'Building' },
    { id: 'strong', label: 'Strong' },
    { id: 'watchlist', label: 'Watchlist' },
  ];

  return (
    <DashboardLayout disableMonochrome>
      <div className="macos-root macos-page-shell">
        <div className="macos-page-header macos-animate-up">
          <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_440px] xl:items-end">
            <div>
              <div className="macos-page-kicker">
                <ArrowUpRight className="h-3.5 w-3.5" />
                Ecosystem atlas
              </div>
              <h1 className="macos-page-title">Ecosystems</h1>
              <p className="macos-page-subtitle">
                Overview of blockchain ecosystems and the projects you are actively monitoring.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-2">
              {[
                { label: 'Tracked projects', value: trackedProjects, icon: Layers3 },
                { label: 'Active ecosystems', value: activeEcosystems, icon: Sparkles },
                { label: 'Strong setups', value: strongEcosystems, icon: Target },
                { label: 'Avg progress', value: `${averageProgress}%`, icon: Activity },
              ].map((card, index) => {
                const Icon = card.icon;
                return (
                  <div
                    key={card.label}
                    className="macos-card macos-card-entry rounded-[1.25rem] px-4 py-3"
                    style={{ '--mac-delay': `${index * 40}ms` } as MacDelayStyle}
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] uppercase tracking-[0.22em] alpha-text-muted">{card.label}</p>
                      <Icon className="h-4 w-4 alpha-text-muted" />
                    </div>
                    <p className="mt-2 text-2xl font-semibold alpha-text">{card.value}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {featuredEcosystem ? (
          <section className="eco-hero">
            <div className="grid gap-5 xl:grid-cols-[minmax(0,1.15fr)_380px] xl:items-stretch">
              <div>
                <div className="eco-chip">
                  <Sparkles className="h-3.5 w-3.5 text-[color:var(--alpha-text-muted)]" />
                  Focus ecosystem
                </div>
                <div className="mt-4 flex items-start gap-4">
                  <div className="eco-logo-lg">
                    {featuredEcosystem.logo && !logoError[featuredEcosystem.id] ? (
                      <img
                        src={featuredEcosystem.logo}
                        alt={featuredEcosystem.name}
                        className="h-8 w-8 object-contain"
                        loading="lazy"
                        onError={() =>
                          setLogoError((prev) => ({ ...prev, [featuredEcosystem.id]: true }))
                        }
                      />
                    ) : (
                      <span className="text-lg font-semibold alpha-text">
                        {featuredEcosystem.icon || featuredEcosystem.name[0]?.toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-2xl font-semibold alpha-text">{featuredEcosystem.name}</h2>
                      <span className="eco-pill">
                        @{featuredEcosystem.twitterHandle}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-6 alpha-text-muted">{featuredEcosystem.description}</p>
                    <p className="mt-3 max-w-2xl text-sm leading-6 alpha-text">
                      {featuredEcosystem.pulseNote}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {featuredEcosystem.projectNames.length > 0 ? (
                        featuredEcosystem.projectNames.map((project) => (
                          <span
                            key={project}
                            className="rounded-full border border-[color:var(--alpha-border)] bg-[color:var(--alpha-hover-soft)] px-3 py-1 text-[10px] uppercase tracking-[0.14em] alpha-text-muted"
                          >
                            {project}
                          </span>
                        ))
                      ) : (
                        <span className="rounded-full border border-[color:var(--alpha-border)] bg-[color:var(--alpha-hover-soft)] px-3 py-1 text-[10px] uppercase tracking-[0.14em] alpha-text-muted">
                          Watchlist lane
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="eco-block sm:col-span-2">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.18em] alpha-text-muted">Completion rhythm</p>
                      <div className="mt-2 flex items-end gap-3">
                        <p className="text-[2.45rem] font-semibold leading-none alpha-text">
                          {featuredEcosystem.stats.progress}%
                        </p>
                        <p className="pb-1 text-sm alpha-text-muted">{featuredEcosystem.heat}</p>
                      </div>
                    </div>

                    <span className="eco-pill">
                      {featuredEcosystem.statusLabel}
                    </span>
                  </div>

                  <div className="eco-progress">
                    <div className="eco-progress__bar" style={{ width: `${featuredEcosystem.stats.progress}%` } as CSSProperties} />
                  </div>

                  <p className="mt-4 text-sm leading-6 alpha-text-muted">
                    {featuredEcosystem.stats.count > 0
                      ? `${featuredEcosystem.stats.completedTasks} dari ${featuredEcosystem.stats.totalTasks} task sudah aktif di chain ini.`
                      : 'Belum ada task yang aktif, jadi chain ini masih aman buat mode watchlist.'}
                  </p>
                </div>

                {[
                  { label: 'Projects', value: featuredEcosystem.stats.count },
                  { label: 'Tasks', value: `${featuredEcosystem.stats.completedTasks}/${featuredEcosystem.stats.totalTasks}` },
                  { label: 'Lead lane', value: featuredEcosystem.leadLane },
                  { label: 'Mode', value: featuredEcosystem.statusLabel },
                ].map((item) => (
                  <div key={item.label} className="eco-mini">
                    <p className="text-[9px] uppercase tracking-[0.18em] alpha-text-muted">{item.label}</p>
                    <p className="mt-2 text-base font-semibold alpha-text">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        <div className="mb-5 macos-card rounded-[1.35rem] p-4">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-wrap gap-2">
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() => setStatusFilter(filter.id)}
                  className={`rounded-full border px-3 py-1.5 text-[11px] font-mono uppercase tracking-[0.2em] transition-colors duration-150 ${
                    statusFilter === filter.id
                      ? 'border-[color:var(--alpha-highlight-border)] bg-[color:var(--alpha-highlight-soft)] text-[color:var(--alpha-highlight)]'
                      : 'border-[color:var(--alpha-border)] bg-[color:var(--alpha-surface)] alpha-text-muted hover:border-[color:var(--alpha-border-strong)] hover:text-[color:var(--alpha-text)]'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            <label className="flex h-12 w-full items-center gap-3 rounded-[1.1rem] border border-[color:var(--alpha-border)] bg-[color:var(--alpha-surface)] px-4 xl:max-w-[360px]">
              <Search className="h-4 w-4 shrink-0 alpha-text-muted" />
              <Input
                placeholder="Cari ecosystem atau project..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="h-auto border-0 bg-transparent p-0 shadow-none focus-visible:ring-0"
              />
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 2xl:grid-cols-3">
          {filteredEcosystems.map((ecosystem, index) => (
            <button
              key={ecosystem.id}
              type="button"
              onClick={() => navigate(`/ecosystem/${ecosystem.id}`)}
              className="eco-card"
              style={{ '--mac-delay': `${index * 24}ms` } as CSSProperties}
            >
              <div className="eco-card__halo" />

              <div className="eco-card__header">
                <div className="flex min-w-0 items-start gap-3">
                  <div className="eco-logo">
                    {ecosystem.logo && !logoError[ecosystem.id] ? (
                      <img
                        src={ecosystem.logo}
                        alt={ecosystem.name}
                        className="h-7 w-7 object-contain"
                        loading="lazy"
                        onError={() =>
                          setLogoError((prev) => ({ ...prev, [ecosystem.id]: true }))
                        }
                      />
                    ) : (
                      <span className="text-sm font-semibold alpha-text">
                        {ecosystem.icon || ecosystem.name[0]?.toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="truncate text-xl font-semibold alpha-text">{ecosystem.name}</h3>
                      <ArrowUpRight className="h-4 w-4 shrink-0 opacity-0 transition-opacity duration-150 group-hover:opacity-100 alpha-text" />
                    </div>
                    <p className="mt-0.5 text-[10px] font-mono uppercase tracking-[0.2em] alpha-text-muted">
                      @{ecosystem.twitterHandle}
                    </p>
                  </div>
                </div>

                <span className="eco-pill">
                  {ecosystem.statusLabel}
                </span>
              </div>

              <p className="mt-3 line-clamp-2 text-sm leading-6 alpha-text-muted">{ecosystem.description}</p>

              <div className="eco-metrics">
                <div>
                  <p className="eco-label">Completion rhythm</p>
                  <div className="mt-1 flex items-end gap-3">
                    <p className="text-[2.25rem] font-semibold leading-none alpha-text">
                      {ecosystem.stats.progress}%
                    </p>
                    <p className="pb-1 text-sm alpha-text-muted">{ecosystem.heat}</p>
                  </div>
                  <div className="eco-progress mt-3">
                    <div className="eco-progress__bar" style={{ width: `${ecosystem.stats.progress}%` } as CSSProperties} />
                  </div>
                </div>

                <div className="eco-metric-pill">
                  <p className="eco-label">Projects linked</p>
                  <p className="text-xl font-semibold alpha-text">
                    {ecosystem.stats.count}
                  </p>
                </div>
              </div>

              <p className="mt-3 text-sm leading-6 alpha-text-muted">{ecosystem.pulseNote}</p>

              <div className="mt-3 grid grid-cols-2 gap-2.5">
                {[
                  { label: 'Tasks', value: `${ecosystem.stats.completedTasks}/${ecosystem.stats.totalTasks}` },
                  { label: 'Lead lane', value: ecosystem.leadLane },
                ].map((item) => (
                  <div key={item.label} className="eco-mini">
                    <p className="eco-label">{item.label}</p>
                    <p className="mt-1 truncate text-sm font-semibold alpha-text">{item.value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {ecosystem.projectNames.length > 0 ? (
                  ecosystem.projectNames.map((project) => (
                    <span
                      key={project}
                      className="eco-chip subtle"
                    >
                      {project}
                    </span>
                  ))
                ) : (
                  <span className="eco-chip subtle">
                    No linked projects yet
                  </span>
                )}
              </div>

              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="alpha-text-muted">
                  {ecosystem.stats.count > 0 ? `${ecosystem.statusLabel} cluster` : ecosystem.heat}
                </span>
                <span className="inline-flex items-center gap-1 font-medium alpha-text">
                  Open ecosystem
                  <ChevronRight className="h-4 w-4" />
                </span>
              </div>
            </button>
          ))}
        </div>

        {filteredEcosystems.length === 0 ? (
          <div className="macos-empty-state mt-5 flex min-h-[220px] items-center justify-center p-6">
            <div className="text-center">
              <Layers3 className="mx-auto h-10 w-10 text-[color:var(--alpha-text-muted)]" />
              <p className="mt-4 text-lg font-semibold alpha-text">Tidak ada ecosystem yang cocok</p>
              <p className="mt-2 text-sm alpha-text-muted">Coba ganti status filter atau keyword pencarian.</p>
            </div>
          </div>
        ) : null}
      </div>
    </DashboardLayout>
  );
}
