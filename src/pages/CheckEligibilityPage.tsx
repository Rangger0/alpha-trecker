import { startTransition, useDeferredValue, useMemo, useState } from 'react';
import {
  ArrowUpRight,
  BadgeCheck,
  Clock3,
  Link2,
  Newspaper,
  Search,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAirdropNews } from '@/hooks/use-airdrop-news';
import { eligibilityDirectory, type EligibilityStatus } from '@/lib/eligibility-directory';

const statusStyles: Record<EligibilityStatus, string> = {
  Live: 'border-[color:var(--alpha-signal-border)] bg-[color:var(--alpha-signal-soft)] text-[color:var(--alpha-signal)]',
  Portal: 'border-[color:var(--alpha-info-border)] bg-[color:var(--alpha-info-soft)] text-[color:var(--alpha-info)]',
  Claim: 'border-[color:var(--alpha-highlight-border)] bg-[color:var(--alpha-highlight-soft)] text-[color:var(--alpha-highlight)]',
  Archive: 'border-[color:var(--alpha-border)] bg-[color:var(--alpha-hover-soft)] alpha-text-muted',
};

const filters = ['Live'] as const;

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

const formatPublishedAt = (value: string) => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export function CheckEligibilityPage() {
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<(typeof filters)[number]>('Live');
  const [logoError, setLogoError] = useState<Record<string, boolean>>({});
  const deferredQuery = useDeferredValue(query.trim().toLowerCase());
  const { items, loading, error } = useAirdropNews();

  const filteredEntries = useMemo(() => {
    return eligibilityDirectory.filter((entry) => {
      const matchesFilter = entry.status === activeFilter;
      const matchesQuery =
        deferredQuery.length === 0 ||
        entry.name.toLowerCase().includes(deferredQuery) ||
        entry.chain.toLowerCase().includes(deferredQuery) ||
        entry.category.toLowerCase().includes(deferredQuery) ||
        entry.summary.toLowerCase().includes(deferredQuery) ||
        entry.note.toLowerCase().includes(deferredQuery);

      return matchesFilter && matchesQuery;
    });
  }, [activeFilter, deferredQuery]);

  const stats = useMemo(() => {
    const live = eligibilityDirectory.filter((entry) => entry.status === 'Live').length;

    return {
      total: eligibilityDirectory.length,
      live,
      active: live,
    };
  }, []);

  return (
    <DashboardLayout disableMonochrome>
      <div className="macos-root macos-page-shell">
        <div className="macos-page-header macos-animate-up">
          <div className="macos-page-kicker">
            <ShieldCheck className="h-3.5 w-3.5" />
            Live official links
          </div>
          <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-start">
            <div>
              <h1 className="macos-page-title">Check Eligibility</h1>
              <p className="macos-page-subtitle">
                List ini sekarang balik jadi checker resmi live saja, tanpa campur project dari dashboard pribadi kamu.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Directory links', value: stats.total },
                { label: 'Live now', value: stats.live },
                { label: 'Ready to check', value: stats.active },
              ].map((stat, index) => (
                <div
                  key={stat.label}
                  className="macos-card macos-card-entry rounded-[1.4rem] px-4 py-3"
                  style={{ ['--mac-delay' as any]: `${index * 40}ms` }}
                >
                  <p className="text-[10px] uppercase tracking-[0.24em] alpha-text-muted">{stat.label}</p>
                  <p className="mt-2 text-2xl font-bold alpha-text">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={`rounded-full border px-3 py-1.5 text-[11px] font-mono uppercase tracking-[0.22em] transition-colors duration-150 ${
                  activeFilter === filter
                    ? 'border-[color:var(--alpha-highlight-border)] bg-[color:var(--alpha-highlight-soft)] text-[color:var(--alpha-highlight)]'
                    : 'border-[color:var(--alpha-border)] bg-[color:var(--alpha-surface)] alpha-text-muted hover:border-[color:var(--alpha-border-strong)] hover:text-[color:var(--alpha-text)]'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          <label className="flex w-full items-center gap-3 rounded-[1.2rem] border border-[color:var(--alpha-border)] bg-[color:var(--alpha-surface)] px-4 py-3 lg:max-w-[360px]">
            <Search className="h-4 w-4 alpha-text-muted" />
            <input
              value={query}
              onChange={(event) => {
                const value = event.target.value;
                startTransition(() => setQuery(value));
              }}
              placeholder="Cari checker live resmi..."
              className="w-full border-0 bg-transparent p-0 text-sm alpha-text outline-none placeholder:text-[color:var(--alpha-text-muted)]"
            />
          </label>
        </div>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_380px]">
          <section>
            <div className="mb-3 flex items-center gap-2">
              <BadgeCheck className="h-4 w-4 text-gold" />
              <h2 className="text-xs font-mono uppercase tracking-[0.24em] alpha-text-muted">
                Eligibility directory
              </h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
              {filteredEntries.map((entry, index) => {
                const showLogo = !logoError[entry.id];

                return (
                  <article
                    key={entry.id}
                    className="macos-premium-card macos-card-entry group rounded-[1.7rem] p-4"
                    style={{ ['--mac-delay' as any]: `${index * 30}ms` }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-[1rem] border border-[color:var(--alpha-border)] bg-[color:var(--alpha-surface-soft)]"
                          style={{ boxShadow: `inset 0 1px 0 color-mix(in srgb, ${entry.accent} 12%, transparent)` }}
                        >
                          {showLogo ? (
                            <img
                              src={entry.logo}
                              alt={entry.name}
                              loading="lazy"
                              className="h-7 w-7 object-contain"
                              onError={() => setLogoError((current) => ({ ...current, [entry.id]: true }))}
                            />
                          ) : (
                            <span className="text-sm font-bold alpha-text">{entry.name.slice(0, 2).toUpperCase()}</span>
                          )}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-base font-semibold alpha-text">{entry.name}</p>
                          <p className="truncate text-[11px] uppercase tracking-[0.22em] alpha-text-muted">{entry.chain}</p>
                        </div>
                      </div>

                      <span className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-medium ${statusStyles[entry.status]}`}>
                        {entry.status}
                      </span>
                    </div>

                    <div className="mt-4 flex items-center gap-2 text-[11px] alpha-text-muted">
                      <Sparkles className="h-3.5 w-3.5 text-gold" />
                      <span>{entry.category}</span>
                    </div>

                    <p className="mt-3 text-sm leading-6 alpha-text">{entry.summary}</p>
                    <p className="mt-2 line-clamp-2 text-[12px] leading-5 alpha-text-muted">{entry.note}</p>

                    <div className="mt-4 rounded-[1.15rem] border border-[color:var(--alpha-border)] bg-[color:var(--alpha-hover-soft)] px-3 py-2.5 text-[11px] alpha-text-muted">
                      <div className="flex items-center justify-between gap-3">
                        <span className="inline-flex items-center gap-2">
                          <Clock3 className="h-3.5 w-3.5" />
                          Verified {formatDate(entry.verifiedAt)}
                        </span>
                        <span className="rounded-full border border-[color:var(--alpha-signal-border)] bg-[color:var(--alpha-signal-soft)] px-2 py-0.5 text-[10px] text-[color:var(--alpha-signal)]">
                          Free
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center gap-2">
                      <a
                        href={entry.portalUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="macos-btn macos-btn--primary inline-flex flex-1 items-center justify-center gap-2 px-3 py-2 text-sm"
                      >
                        <ArrowUpRight className="h-4 w-4" />
                        Open checker
                      </a>
                      <a
                        href={entry.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="macos-btn macos-btn--ghost inline-flex items-center justify-center gap-2 px-3 py-2 text-sm"
                        title="Open official source"
                      >
                        <Link2 className="h-4 w-4" />
                        Source
                      </a>
                    </div>
                  </article>
                );
              })}

              {filteredEntries.length === 0 ? (
                <div className="macos-empty-state flex min-h-[200px] items-center justify-center p-6 md:col-span-2 2xl:col-span-3">
                  <p className="text-sm alpha-text-muted">Tidak ada checker yang cocok dengan filter atau kata kunci ini.</p>
                </div>
              ) : null}
            </div>
          </section>

          <aside className="space-y-4">
            <section className="macos-card rounded-[1.7rem] p-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--alpha-border)] bg-[color:var(--alpha-hover-soft)] px-3 py-1 text-[10px] uppercase tracking-[0.24em] alpha-text-muted">
                <Sparkles className="h-3.5 w-3.5 text-gold" />
                More live checker
              </div>
              <h3 className="mt-3 text-lg font-semibold alpha-text">Butuh list yang lebih ramai?</h3>
              <p className="mt-2 text-sm leading-6 alpha-text-muted">
                Pakai CryptoRank Drop Hunting untuk browse checker dan campaign yang lebih banyak di luar list resmi halaman ini.
              </p>
              <a
                href="https://cryptorank.io/drophunting"
                target="_blank"
                rel="noreferrer"
                className="macos-btn macos-btn--primary mt-4 inline-flex items-center gap-2 px-4 py-2.5 text-sm"
              >
                <ArrowUpRight className="h-4 w-4" />
                Open CryptoRank
              </a>
            </section>

            <section className="macos-card rounded-[1.7rem] p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--alpha-border)] bg-[color:var(--alpha-hover-soft)] px-3 py-1 text-[10px] uppercase tracking-[0.24em] alpha-text-muted">
                    <Newspaper className="h-3.5 w-3.5 text-gold" />
                    Free updates
                  </div>
                  <h3 className="mt-3 text-lg font-semibold alpha-text">Airdrop update feed</h3>
                  <p className="mt-1 text-xs alpha-text-muted">
                    Update gratis dari feed publik supaya checker page ini ikut hidup saat ada campaign baru.
                  </p>
                </div>

                <span className="rounded-full border border-[color:var(--alpha-signal-border)] bg-[color:var(--alpha-signal-soft)] px-2 py-0.5 text-[10px] text-[color:var(--alpha-signal)]">
                  RSS
                </span>
              </div>

              {loading ? (
                <div className="mt-4 space-y-2.5">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="rounded-[1.2rem] border border-[color:var(--alpha-border)] bg-[color:var(--alpha-hover-soft)] px-3 py-3">
                      <div className="h-3 w-24 rounded-full bg-[color:var(--alpha-border)]" />
                      <div className="mt-3 h-4 w-5/6 rounded-full bg-[color:var(--alpha-border)]" />
                      <div className="mt-2 h-3 w-2/3 rounded-full bg-[color:var(--alpha-border)]" />
                    </div>
                  ))}
                </div>
              ) : error ? (
                <div className="mt-4 rounded-[1.2rem] border border-[color:var(--alpha-danger-border)] bg-[color:var(--alpha-danger-soft)] px-4 py-4 text-sm text-[color:var(--alpha-danger)]">
                  News feed gratis sedang gagal dimuat. Coba lagi beberapa saat lagi.
                </div>
              ) : (
                <div className="mt-4 space-y-2.5">
                  {items.slice(0, 4).map((item, index) => (
                    <a
                      key={item.id}
                      href={item.link}
                      target="_blank"
                      rel="noreferrer"
                      className="macos-card-entry group block rounded-[1.2rem] border border-[color:var(--alpha-border)] bg-[color:var(--alpha-surface)] px-3.5 py-3 transition-colors duration-150 hover:border-[color:var(--alpha-border-strong)] hover:bg-[color:var(--alpha-surface-soft)]"
                      style={{ ['--mac-delay' as any]: `${index * 36}ms` }}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <span className="inline-flex rounded-full border border-[color:var(--alpha-highlight-border)] bg-[color:var(--alpha-highlight-soft)] px-2 py-0.5 text-[10px] text-[color:var(--alpha-highlight)]">
                          {item.tag}
                        </span>
                        <ArrowUpRight className="h-4 w-4 shrink-0 alpha-text-muted transition-colors group-hover:text-gold" />
                      </div>

                      <h4 className="mt-3 line-clamp-2 text-sm font-semibold leading-5 alpha-text">{item.title}</h4>
                      <p className="mt-2 line-clamp-2 text-[12px] leading-5 alpha-text-muted">{item.summary}</p>

                      <div className="mt-3 flex items-center justify-between gap-3 text-[11px] alpha-text-muted">
                        <span>{formatPublishedAt(item.publishedAt)}</span>
                        <span>{item.source}</span>
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </section>

            <section className="macos-card rounded-[1.7rem] p-4">
              <h3 className="text-sm font-semibold alpha-text">Cara pakai cepat</h3>
              <ul className="mt-3 space-y-2 text-[13px] leading-6 alpha-text-muted">
                <li>1. Buka menu `Check Eligibility` dari sidebar.</li>
                <li>2. Klik `Open checker` untuk langsung masuk ke portal resmi.</li>
                <li>3. Kalau status `Archive`, baca dulu source resminya sebelum connect wallet.</li>
              </ul>
            </section>
          </aside>
        </div>
      </div>
    </DashboardLayout>
  );
}
