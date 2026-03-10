import { startTransition, useDeferredValue, useMemo, useState, type CSSProperties } from 'react';
import {
  ArrowUpRight,
  Compass,
  LibraryBig,
  Radar,
  Search,
  Sparkles,
  WalletCards,
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Input } from '@/components/ui/input';
import {
  researchToolCategories,
  researchToolsDirectory,
  type ResearchToolCategoryId,
  type ResearchToolEntry,
} from '@/lib/research-tools-directory';

type CategoryFilter = 'all' | ResearchToolCategoryId;
type MacDelayStyle = CSSProperties & {
  '--mac-delay': string;
};

const categoryIcons: Record<ResearchToolCategoryId, typeof Compass> = {
  'market-intel': Compass,
  'onchain-intel': Radar,
  'fundraising-unlocks': WalletCards,
  'airdrop-research': Sparkles,
};

const toolMatchesQuery = (tool: ResearchToolEntry, query: string) => {
  if (!query) {
    return true;
  }

  return (
    tool.name.toLowerCase().includes(query) ||
    tool.description.toLowerCase().includes(query) ||
    tool.bestFor.toLowerCase().includes(query) ||
    tool.tags.some((tag) => tag.toLowerCase().includes(query))
  );
};

export function ToolsPage() {
  const [query, setQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const deferredQuery = useDeferredValue(query.trim().toLowerCase());

  const filteredTools = useMemo(() => {
    return researchToolsDirectory.filter((tool) => {
      const matchesCategory = categoryFilter === 'all' || tool.categoryId === categoryFilter;
      return matchesCategory && toolMatchesQuery(tool, deferredQuery);
    });
  }, [categoryFilter, deferredQuery]);

  const featuredTools = useMemo(
    () => filteredTools.filter((tool) => tool.featured).slice(0, 4),
    [filteredTools],
  );
  const spotlightTool = featuredTools[0] ?? filteredTools[0] ?? null;
  const spotlightQueue = (featuredTools.length > 1 ? featuredTools.slice(1, 4) : filteredTools.slice(1, 4));

  const sectionedTools = useMemo(
    () =>
      researchToolCategories
        .map((category) => ({
          ...category,
          tools: filteredTools.filter((tool) => tool.categoryId === category.id),
        }))
        .filter((category) => category.tools.length > 0),
    [filteredTools],
  );

  const stats = useMemo(() => {
    const freeCount = researchToolsDirectory.filter((tool) => tool.availability === 'Free').length;
    const featuredCount = researchToolsDirectory.filter((tool) => tool.featured).length;

    return {
      total: researchToolsDirectory.length,
      free: freeCount,
      featured: featuredCount,
      categories: researchToolCategories.length,
    };
  }, []);

  const renderToolCard = (tool: ResearchToolEntry, index: number, featured = false) => (
    <a
      key={tool.id}
      href={tool.url}
      target="_blank"
      rel="noreferrer"
      className={`group relative overflow-hidden rounded-[1.45rem] border transition-all duration-200 hover:-translate-y-0.5 ${
        featured ? 'macos-premium-card p-5' : 'macos-card-entry p-4'
      }`}
      style={{
        borderColor: 'color-mix(in srgb, var(--alpha-border) 80%, transparent)',
        background: 'linear-gradient(150deg, color-mix(in srgb, var(--alpha-surface) 98%, transparent), color-mix(in srgb, var(--alpha-panel) 94%, transparent))',
        boxShadow: 'var(--alpha-shadow)',
        '--mac-delay': `${index * 24}ms`,
      } as MacDelayStyle}
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-28 opacity-70"
        style={{ background: 'linear-gradient(135deg, color-mix(in srgb, var(--alpha-text) 6%, transparent), transparent 72%)' }}
      />

      <div className="relative z-10">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div
              className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-[1rem] border"
              style={{
                borderColor: 'color-mix(in srgb, var(--alpha-border) 82%, transparent)',
                background: 'color-mix(in srgb, var(--alpha-surface-soft) 92%, transparent)',
              }}
            >
              <img
                src={tool.logo}
                alt={tool.name}
                className="h-7 w-7 object-contain"
                loading="lazy"
                onError={(event) => {
                  event.currentTarget.style.display = 'none';
                }}
              />
              <span className="absolute text-sm font-semibold alpha-text">
                {tool.name.slice(0, 1)}
              </span>
            </div>

            <div className="min-w-0">
              <p className="truncate text-base font-semibold alpha-text">{tool.name}</p>
              <p className="truncate text-[11px] uppercase tracking-[0.22em] alpha-text-muted">
                {tool.bestFor}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <span
              className="rounded-full border px-2 py-0.5 text-[9px] uppercase tracking-[0.18em]"
              style={{
                borderColor: 'color-mix(in srgb, var(--alpha-border) 86%, transparent)',
                background: 'color-mix(in srgb, var(--alpha-hover-soft) 90%, transparent)',
                color: 'var(--alpha-text)',
              }}
            >
              {tool.availability}
            </span>
            <ArrowUpRight className="h-4 w-4 shrink-0 opacity-0 transition-opacity duration-150 group-hover:opacity-100 alpha-text" />
          </div>
        </div>

        <p className={`mt-3 ${featured ? 'text-sm leading-6' : 'line-clamp-2 text-[13px] leading-5'} alpha-text-muted`}>
          {tool.description}
        </p>

        <div className="mt-3 flex flex-wrap gap-2">
          {tool.tags.slice(0, featured ? 3 : 2).map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-[color:var(--alpha-border)] bg-[color:var(--alpha-hover-soft)] px-2 py-0.5 text-[10px] uppercase tracking-[0.16em] alpha-text-muted"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </a>
  );

  return (
    <DashboardLayout disableMonochrome>
      <div className="macos-root macos-page-shell">
        <div className="macos-page-header macos-animate-up">
          <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_420px] xl:items-end">
            <div>
              <div className="macos-page-kicker">
                <Search className="h-3.5 w-3.5" />
                Research deck
              </div>
              <h1 className="macos-page-title">Research Tools</h1>
              <p className="macos-page-subtitle">
                Deck riset yang lebih lengkap untuk market scan, onchain intel, fundraising, unlocks, dan hunting airdrop.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-2">
              {[
                { label: 'Tools', value: stats.total },
                { label: 'Free access', value: stats.free },
                { label: 'Featured', value: stats.featured },
                { label: 'Stacks', value: stats.categories },
              ].map((stat, index) => (
                <div
                  key={stat.label}
                  className="macos-card macos-card-entry rounded-[1.2rem] px-4 py-3"
                  style={{ '--mac-delay': `${index * 40}ms` } as MacDelayStyle}
                >
                  <p className="text-[10px] uppercase tracking-[0.22em] alpha-text-muted">{stat.label}</p>
                  <p className="mt-2 text-2xl font-semibold alpha-text">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-5 macos-card rounded-[1.35rem] p-4">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setCategoryFilter('all')}
                className={`rounded-full border px-3 py-1.5 text-[11px] font-mono uppercase tracking-[0.2em] transition-colors duration-150 ${
                  categoryFilter === 'all'
                    ? 'border-[color:var(--alpha-highlight-border)] bg-[color:var(--alpha-highlight-soft)] text-[color:var(--alpha-highlight)]'
                    : 'border-[color:var(--alpha-border)] bg-[color:var(--alpha-surface)] alpha-text-muted hover:border-[color:var(--alpha-border-strong)] hover:text-[color:var(--alpha-text)]'
                }`}
              >
                All research
              </button>
              {researchToolCategories.map((category) => {
                const Icon = categoryIcons[category.id];
                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => setCategoryFilter(category.id)}
                    className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-mono uppercase tracking-[0.2em] transition-colors duration-150 ${
                      categoryFilter === category.id
                        ? 'border-[color:var(--alpha-highlight-border)] bg-[color:var(--alpha-highlight-soft)] text-[color:var(--alpha-highlight)]'
                        : 'border-[color:var(--alpha-border)] bg-[color:var(--alpha-surface)] alpha-text-muted hover:border-[color:var(--alpha-border-strong)] hover:text-[color:var(--alpha-text)]'
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {category.label}
                  </button>
                );
              })}
            </div>

            <div className="relative w-full xl:max-w-[380px]">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 alpha-text-muted" />
              <Input
                value={query}
                onChange={(event) => {
                  const nextValue = event.target.value;
                  startTransition(() => setQuery(nextValue));
                }}
                placeholder="Cari tool, focus, atau tags..."
                className="h-11 rounded-[1rem] border-[color:var(--alpha-border)] bg-[color:var(--alpha-surface)] pl-10"
              />
            </div>
          </div>
        </div>

        {spotlightTool ? (
      <section
        className="mb-6 overflow-hidden rounded-[1.6rem] border p-5"
        style={{
          borderColor: 'var(--alpha-border)',
          background: 'linear-gradient(135deg, color-mix(in srgb, var(--alpha-surface) 98%, transparent), color-mix(in srgb, var(--alpha-panel) 92%, transparent))',
          boxShadow: 'var(--alpha-shadow)',
        }}
      >
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px] xl:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--alpha-border)] bg-[color:var(--alpha-hover-soft)] px-3 py-1 text-[10px] uppercase tracking-[0.24em] alpha-text-muted">
              <Sparkles className="h-3.5 w-3.5 alpha-text" />
              Spotlight tool
            </div>

            <div className="mt-4 flex items-start gap-4">
              <div
                className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-[1rem] border shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
                style={{
                  borderColor: 'color-mix(in srgb, var(--alpha-border) 82%, transparent)',
                  background: 'color-mix(in srgb, var(--alpha-surface-soft) 92%, transparent)',
                }}
              >
                    <img
                      src={spotlightTool.logo}
                      alt={spotlightTool.name}
                      className="h-8 w-8 object-contain"
                      loading="lazy"
                      onError={(event) => {
                        event.currentTarget.style.display = 'none';
                        const fallback = event.currentTarget.nextElementSibling as HTMLSpanElement | null;
                        if (fallback) fallback.style.display = 'block';
                      }}
                />
                <span className="hidden text-lg font-semibold alpha-text">
                  {spotlightTool.name.slice(0, 1)}
                </span>
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-2xl font-semibold alpha-text">{spotlightTool.name}</h2>
                  <span
                    className="rounded-full border px-2.5 py-1 text-[10px] uppercase tracking-[0.18em]"
                    style={{
                      borderColor: 'color-mix(in srgb, var(--alpha-border) 86%, transparent)',
                      background: 'color-mix(in srgb, var(--alpha-hover-soft) 90%, transparent)',
                      color: 'var(--alpha-text)',
                    }}
                  >
                    {spotlightTool.bestFor}
                  </span>
                </div>
                    <p className="mt-2 max-w-2xl text-sm leading-6 alpha-text-muted">{spotlightTool.description}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {spotlightTool.tags.slice(0, 4).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-[color:var(--alpha-border)] bg-[color:var(--alpha-hover-soft)] px-3 py-1 text-[10px] uppercase tracking-[0.16em] alpha-text-muted"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-3">
                {spotlightQueue.map((tool, index) => (
                  <a
                    key={tool.id}
                    href={tool.url}
                    target="_blank"
                    rel="noreferrer"
                    className="group rounded-[1.05rem] border border-[color:var(--alpha-border)] bg-[color:var(--alpha-hover-soft)] px-4 py-3 transition-all duration-150 hover:-translate-y-0.5"
                    style={{ '--mac-delay': `${index * 30}ms` } as MacDelayStyle}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold alpha-text">{tool.name}</p>
                        <p className="mt-1 truncate text-[10px] uppercase tracking-[0.18em] alpha-text-muted">
                          {tool.bestFor}
                        </p>
                        <p className="mt-2 line-clamp-2 text-[12px] leading-5 alpha-text-muted">{tool.description}</p>
                      </div>
                      <ArrowUpRight className="h-4 w-4 shrink-0 opacity-0 transition-opacity duration-150 group-hover:opacity-100 alpha-text" />
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        <div className="space-y-6">
          {sectionedTools.map((section) => {
            const Icon = categoryIcons[section.id];

            return (
              <section key={section.id}>
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <div
                      className="flex h-8 w-8 items-center justify-center rounded-[0.9rem]"
                      style={{ background: 'color-mix(in srgb, var(--alpha-hover-soft) 80%, transparent)' }}
                    >
                      <Icon className="h-4 w-4 alpha-text-muted" />
                    </div>
                    <div>
                      <h2 className="text-sm font-semibold alpha-text">{section.label}</h2>
                      <p className="text-xs alpha-text-muted">{section.kicker}</p>
                    </div>
                  </div>

                  <span className="rounded-full border border-[color:var(--alpha-border)] bg-[color:var(--alpha-hover-soft)] px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] alpha-text-muted">
                    {section.tools.length} tools
                  </span>
                </div>

                <p className="mb-4 max-w-3xl text-sm alpha-text-muted">{section.description}</p>

                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                  {section.tools.map((tool, index) => renderToolCard(tool, index))}
                </div>
              </section>
            );
          })}

          {sectionedTools.length === 0 ? (
            <div className="macos-empty-state flex min-h-[220px] items-center justify-center p-6">
              <div className="text-center">
                <LibraryBig className="mx-auto h-10 w-10 alpha-text-muted" />
                <p className="mt-4 text-lg font-semibold alpha-text">Tidak ada tool yang cocok</p>
                <p className="mt-2 text-sm alpha-text-muted">Coba ganti kategori atau keyword pencarian.</p>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </DashboardLayout>
  );
}
