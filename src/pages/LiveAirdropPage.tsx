import { useDeferredValue, useMemo, useState, type ChangeEvent } from 'react';
import { ArrowUpRight, Link2, Radio, Search } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAirdropNews } from '@/hooks/use-airdrop-news';
import type { EligibilityEntry } from '@/lib/eligibility-directory';

const formatPublishedAt = (value: string) => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;

  return parsed.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export function LiveAirdropPage() {
  const [query, setQuery] = useState('');
  const [logoError, setLogoError] = useState<Record<string, boolean>>({});
  const deferredQuery = useDeferredValue(query.trim().toLowerCase());
  const { items, loading, error, sourceUrl } = useAirdropNews();

  const liveAirdrops = useMemo<EligibilityEntry[]>(() => {
    return items.slice(0, 12).map((item, index) => ({
      id: `airdrops-io-${index}-${item.id}`,
      name: item.title.replace(/\s+».*$/, '').replace(/\s+\|\s+.*$/, '').slice(0, 54),
      chain: item.source || 'Airdrops.io',
      category: item.tag || 'Airdrop',
      status: 'Live',
      accent: '#6b7280',
      logo: item.image || '/logos/airdrops.png',
      portalUrl: item.link,
      sourceUrl: item.link,
      summary: item.title,
      note: item.summary || 'Update live dari feed publik Airdrops.io.',
      verifiedAt: item.publishedAt || new Date().toISOString(),
    }));
  }, [items]);

  const filteredAirdrops = useMemo(() => {
    if (!deferredQuery) return liveAirdrops;

    return liveAirdrops.filter((entry) => {
      return (
        entry.name.toLowerCase().includes(deferredQuery) ||
        entry.chain.toLowerCase().includes(deferredQuery) ||
        entry.category.toLowerCase().includes(deferredQuery) ||
        entry.summary.toLowerCase().includes(deferredQuery) ||
        entry.note.toLowerCase().includes(deferredQuery)
      );
    });
  }, [deferredQuery, liveAirdrops]);

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  return (
    <DashboardLayout disableMonochrome>
      <div className="macos-root macos-page-shell">
        <div className="macos-page-header macos-animate-up p-5 sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="macos-page-kicker">
                <Radio className="h-3.5 w-3.5" />
                Live Airdrop
              </div>
              <h1 className="macos-page-title mt-3">Live Airdrop</h1>
              <p className="macos-page-subtitle mt-2">
                Feed peluang airdrop terbaru dari Airdrops.io, dipisah dari halaman check eligibility.
              </p>
            </div>

            <label className="flex h-12 w-full items-center gap-3 rounded-[1rem] border border-[color:var(--alpha-border-strong)] bg-[color:var(--alpha-surface)] px-4 lg:max-w-[360px]">
              <Search className="h-4 w-4 alpha-text-muted" />
              <input
                value={query}
                onChange={handleSearchChange}
                placeholder="Cari airdrop..."
                className="w-full border-0 bg-transparent p-0 text-[15px] alpha-text outline-none placeholder:text-[color:var(--alpha-text-muted)]"
              />
            </label>
          </div>
        </div>

        <section className="mt-5">
          <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-sm font-semibold alpha-text">Airdrop live</h2>
              <p className="text-sm alpha-text-muted">
                Daftar campaign dan guide terbaru. Official checker tetap ada di menu Check Eligibility.
              </p>
            </div>
            <a
              href={sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex text-sm font-medium alpha-text-muted underline-offset-4 hover:text-[color:var(--alpha-text)] hover:underline"
            >
              Source Airdrops.io
            </a>
          </div>

          {loading && liveAirdrops.length === 0 ? (
            <div className="mb-3 grid gap-3 md:grid-cols-2 2xl:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="macos-card rounded-[1.15rem] p-4 shadow-none">
                  <div className="flex gap-4">
                    <div className="h-16 w-16 rounded-[1rem] bg-[color:var(--alpha-hover-soft)]" />
                    <div className="flex-1">
                      <div className="h-4 w-2/3 rounded-full bg-[color:var(--alpha-hover-soft)]" />
                      <div className="mt-3 h-3 w-1/2 rounded-full bg-[color:var(--alpha-hover-soft)]" />
                      <div className="mt-4 h-3 w-full rounded-full bg-[color:var(--alpha-hover-soft)]" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : null}

          {error && liveAirdrops.length === 0 ? (
            <div className="mb-3 rounded-[1rem] border border-[color:var(--alpha-danger-border)] bg-[color:var(--alpha-danger-soft)] px-4 py-3 text-sm text-[color:var(--alpha-danger)]">
              Live airdrop dari Airdrops.io sedang gagal dimuat.
            </div>
          ) : null}

          <div className="grid gap-3 md:grid-cols-2 2xl:grid-cols-3">
            {filteredAirdrops.map((entry) => {
              const showLogo = Boolean(entry.logo) && !logoError[entry.id];

              return (
                <article
                  key={entry.id}
                  className="macos-card group rounded-[1.15rem] p-4 shadow-none"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-[1rem] border border-[color:var(--alpha-border-strong)] bg-[color:var(--alpha-panel)]"
                      style={{ boxShadow: 'none' }}
                    >
                      {showLogo ? (
                        <img
                          src={entry.logo}
                          alt={`${entry.name} logo`}
                          loading="lazy"
                          className="h-11 w-11 object-contain"
                          onError={() => setLogoError((current) => ({ ...current, [entry.id]: true }))}
                        />
                      ) : (
                        <span className="text-lg font-bold alpha-text">
                          {entry.name.slice(0, 2).toUpperCase()}
                        </span>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h2 className="truncate text-lg font-semibold alpha-text">{entry.name}</h2>
                          <p className="mt-1 text-sm alpha-text-muted">{entry.chain} / {entry.category}</p>
                        </div>
                        <span className="rounded-full border border-[color:var(--alpha-border)] bg-[color:var(--alpha-hover-soft)] px-2.5 py-1 text-xs font-medium alpha-text-muted">
                          {entry.category}
                        </span>
                      </div>

                      <p className="mt-3 line-clamp-2 text-sm leading-6 alpha-text-muted">
                        {entry.note || entry.summary}
                      </p>
                      <p className="mt-2 text-xs alpha-text-muted">
                        Update {formatPublishedAt(entry.verifiedAt)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                    <a
                      href={entry.portalUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="macos-btn macos-btn--primary inline-flex flex-1 items-center justify-center gap-2 px-4 py-2.5 text-sm"
                    >
                      <ArrowUpRight className="h-4 w-4" />
                      Open airdrop
                    </a>
                    <a
                      href={entry.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="macos-btn macos-btn--ghost inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm"
                    >
                      <Link2 className="h-4 w-4" />
                      Source
                    </a>
                  </div>
                </article>
              );
            })}
          </div>

          {filteredAirdrops.length === 0 && !loading ? (
            <div className="macos-empty-state mt-4 flex min-h-[180px] items-center justify-center p-6">
              <p className="text-sm alpha-text-muted">Tidak ada airdrop yang cocok dengan kata kunci ini.</p>
            </div>
          ) : null}
        </section>
      </div>
    </DashboardLayout>
  );
}
