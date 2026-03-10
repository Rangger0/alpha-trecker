import { startTransition, useDeferredValue, useMemo, useState, type CSSProperties } from 'react';
import { ArrowUpRight, Globe, Link2, Plus, Rocket, Search, Sparkles, Trash2 } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { chainDirectoryMap } from '@/lib/chain-directory';
import {
  deployToolsDirectory,
  type DeployAssetType,
  type DeployEnvironment,
  type DeployToolEntry,
} from '@/lib/deploy-tools-directory';
import { normalizeLogoUrl } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { loadFromStorage, saveToStorage } from '@/utils/helpers';

type AssetFilter = 'All' | DeployAssetType;
type EnvironmentFilter = 'All' | DeployEnvironment;
type PricingFilter = DeployToolEntry['pricing'];
type ModeFilter = DeployToolEntry['mode'];
type MacDelayStyle = CSSProperties & {
  '--mac-delay': string;
};
type CustomDeployTool = DeployToolEntry & {
  isCustom: true;
};

const assetFilters: AssetFilter[] = ['All', 'Token', 'NFT', 'Contract'];
const environmentFilters: EnvironmentFilter[] = ['All', 'Mainnet', 'Testnet'];
const deployModes: ModeFilter[] = ['No-code', 'Low-code', 'Builder docs'];
const deployPricing: PricingFilter[] = ['Free', 'Free tier'];
const CUSTOM_DEPLOY_TOOLS_STORAGE_KEY = 'alpha-custom-deploy-tools';

const createToolBadge = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((chunk) => chunk[0] || '')
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'MW';

const defaultManualDeployForm = {
  name: '',
  url: '',
  sourceUrl: '',
  logo: '',
  note: '',
  assetType: 'Token' as DeployAssetType,
  environment: 'Mainnet' as DeployEnvironment,
  chainId: 'ethereum',
  mode: 'No-code' as ModeFilter,
  pricing: 'Free tier' as PricingFilter,
};

export function DeployToolsPage() {
  const [query, setQuery] = useState('');
  const [assetFilter, setAssetFilter] = useState<AssetFilter>('All');
  const [environmentFilter, setEnvironmentFilter] = useState<EnvironmentFilter>('All');
  const [chainFilter, setChainFilter] = useState('All');
  const [logoError, setLogoError] = useState<Record<string, boolean>>({});
  const [customTools, setCustomTools] = useState<CustomDeployTool[]>(() =>
    typeof window === 'undefined'
      ? []
      : loadFromStorage<CustomDeployTool[]>(CUSTOM_DEPLOY_TOOLS_STORAGE_KEY, [])
  );
  const [manualForm, setManualForm] = useState(defaultManualDeployForm);
  const deferredQuery = useDeferredValue(query.trim().toLowerCase());
  const allTools = useMemo(() => [...customTools, ...deployToolsDirectory], [customTools]);
  const manualLogoPreview = normalizeLogoUrl(manualForm.logo);
  const manualChainLogo = chainDirectoryMap[manualForm.chainId]?.logo;
  const manualPreviewLogo = manualLogoPreview || manualChainLogo;

  const updateManualForm = <K extends keyof typeof defaultManualDeployForm>(
    key: K,
    value: (typeof defaultManualDeployForm)[K]
  ) => {
    setManualForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const persistCustomTools = (nextTools: CustomDeployTool[]) => {
    setCustomTools(nextTools);
    saveToStorage(CUSTOM_DEPLOY_TOOLS_STORAGE_KEY, nextTools);
  };

  const handleAddManualTool = () => {
    const trimmedName = manualForm.name.trim();
    const trimmedUrl = manualForm.url.trim();

    if (!trimmedName || !trimmedUrl) {
      return;
    }

    const selectedChain = chainDirectoryMap[manualForm.chainId];
    const normalizedLogo = normalizeLogoUrl(manualForm.logo);
    const customEntry: CustomDeployTool = {
      id: `manual-${Date.now()}`,
      name: trimmedName,
      accent: selectedChain?.accent ?? '#F97316',
      badge: createToolBadge(trimmedName),
      logo: normalizedLogo || selectedChain?.logo,
      description: `${trimmedName} ditambah manual untuk flow deploy ${manualForm.assetType.toLowerCase()} yang belum ada di directory utama.`,
      mode: manualForm.mode,
      pricing: manualForm.pricing,
      assetTypes: [manualForm.assetType],
      environments: [manualForm.environment],
      chainIds: [manualForm.chainId],
      url: trimmedUrl,
      sourceUrl: manualForm.sourceUrl.trim() || trimmedUrl,
      note:
        manualForm.note.trim() ||
        `Manual entry untuk ${selectedChain?.name ?? 'custom chain'} supaya kamu bisa simpan tool deploy tambahan di workspace ini.`,
      isCustom: true,
    };

    persistCustomTools([customEntry, ...customTools]);
    setManualForm(defaultManualDeployForm);
  };

  const handleRemoveManualTool = (toolId: string) => {
    if (!window.confirm('Hapus manual deploy tool ini?')) {
      return;
    }

    const nextTools = customTools.filter((entry) => entry.id !== toolId);
    persistCustomTools(nextTools);
  };

  const filteredTools = useMemo(() => {
    return allTools.filter((entry) => {
      const matchesAsset = assetFilter === 'All' || entry.assetTypes.includes(assetFilter);
      const matchesEnvironment =
        environmentFilter === 'All' || entry.environments.includes(environmentFilter);
      const matchesChain = chainFilter === 'All' || entry.chainIds.includes(chainFilter);
      const matchesQuery =
        deferredQuery.length === 0 ||
        entry.name.toLowerCase().includes(deferredQuery) ||
        entry.description.toLowerCase().includes(deferredQuery) ||
        entry.note.toLowerCase().includes(deferredQuery);

      return matchesAsset && matchesEnvironment && matchesChain && matchesQuery;
    });
  }, [allTools, assetFilter, chainFilter, deferredQuery, environmentFilter]);

  const stats = useMemo(() => {
    const chainCoverage = new Set(allTools.flatMap((entry) => entry.chainIds)).size;
    const freeOnly = allTools.filter((entry) => entry.pricing === 'Free').length;
    const manualCount = allTools.filter((entry) => entry.isCustom).length;

    return {
      total: allTools.length,
      freeOnly,
      freeTier: allTools.length - freeOnly,
      chainCoverage,
      manualCount,
    };
  }, [allTools]);

  return (
    <DashboardLayout disableMonochrome>
      <div className="macos-root macos-page-shell">
        <div className="macos-page-header macos-animate-up">
          <div className="macos-page-kicker">
            <Rocket className="h-3.5 w-3.5" />
            Deploy deck
          </div>

          <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-start">
            <div>
              <h1 className="macos-page-title">Deploy Token / NFT</h1>
              <p className="macos-page-subtitle">
                Halaman internal untuk kumpulan tool deploy token, NFT, dan contract yang gratis atau punya free tier,
                lengkap dengan cakupan chain dan mode no-code sampai builder docs.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-2">
              {[
                { label: 'Tools', value: stats.total },
                { label: 'Free only', value: stats.freeOnly },
                { label: 'Manual', value: stats.manualCount },
                { label: 'Chain cover', value: stats.chainCoverage },
              ].map((stat, index) => (
                <div
                  key={stat.label}
                  className="macos-card macos-card-entry rounded-[1.35rem] px-4 py-3"
                  style={{ '--mac-delay': `${index * 40}ms` } as MacDelayStyle}
                >
                  <p className="text-[10px] uppercase tracking-[0.24em] alpha-text-muted">{stat.label}</p>
                  <p className="mt-2 text-2xl font-bold alpha-text">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-5 flex flex-col gap-3">
          <div className="flex flex-wrap gap-2">
            {assetFilters.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setAssetFilter(filter)}
                className={`rounded-full border px-3 py-1.5 text-[11px] font-mono uppercase tracking-[0.22em] transition-colors duration-150 ${
                  assetFilter === filter
                    ? 'border-[color:var(--alpha-highlight-border)] bg-[color:var(--alpha-highlight-soft)] text-[color:var(--alpha-highlight)]'
                    : 'border-[color:var(--alpha-border)] bg-[color:var(--alpha-surface)] alpha-text-muted hover:border-[color:var(--alpha-border-strong)] hover:text-[color:var(--alpha-text)]'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-wrap gap-2">
              {environmentFilters.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setEnvironmentFilter(filter)}
                  className={`rounded-full border px-3 py-1.5 text-[11px] font-mono uppercase tracking-[0.22em] transition-colors duration-150 ${
                    environmentFilter === filter
                      ? 'border-[color:var(--alpha-signal-border)] bg-[color:var(--alpha-signal-soft)] text-[color:var(--alpha-signal)]'
                      : 'border-[color:var(--alpha-border)] bg-[color:var(--alpha-surface)] alpha-text-muted hover:border-[color:var(--alpha-border-strong)] hover:text-[color:var(--alpha-text)]'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            <div className="flex w-full flex-col gap-3 sm:flex-row xl:max-w-[620px]">
              <label className="flex flex-1 items-center gap-3 rounded-[1.2rem] border border-[color:var(--alpha-border)] bg-[color:var(--alpha-surface)] px-4 py-3">
                <Search className="h-4 w-4 alpha-text-muted" />
                <input
                  value={query}
                  onChange={(event) => {
                    const value = event.target.value;
                    startTransition(() => setQuery(value));
                  }}
                  placeholder="Cari tool deploy, docs, atau flow token/NFT..."
                  className="w-full border-0 bg-transparent p-0 text-sm alpha-text outline-none placeholder:text-[color:var(--alpha-text-muted)]"
                />
              </label>

              <select
                value={chainFilter}
                onChange={(event) => setChainFilter(event.target.value)}
                className="rounded-[1.2rem] border border-[color:var(--alpha-border)] bg-[color:var(--alpha-surface)] px-4 py-3 text-sm alpha-text outline-none"
              >
                <option value="All">All chains</option>
                {Object.values(chainDirectoryMap).map((entry) => (
                  <option key={entry.id} value={entry.id}>
                    {entry.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
          <section>
            <div className="mb-3 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-gold" />
              <h2 className="text-xs font-mono uppercase tracking-[0.24em] alpha-text-muted">Deploy tools</h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
              {filteredTools.map((entry, index) => {
                const primaryChainLogo = chainDirectoryMap[entry.chainIds[0]]?.logo;
                const logoSrc = entry.logo || primaryChainLogo;
                const showLogo = logoSrc && !logoError[entry.id];

                return (
                  <article
                    key={entry.id}
                    className="macos-premium-card macos-card-entry group rounded-[1.7rem] p-4"
                    style={{ '--mac-delay': `${index * 26}ms` } as MacDelayStyle}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-[1rem] border border-[color:var(--alpha-border)] bg-[color:var(--alpha-surface-soft)] text-sm font-semibold"
                          style={{
                            boxShadow: `inset 0 1px 0 color-mix(in srgb, ${entry.accent} 16%, transparent)`,
                            color: entry.accent,
                          }}
                        >
                          {showLogo ? (
                            <img
                              src={logoSrc}
                              alt={entry.name}
                              className="h-full w-full object-cover"
                              loading="lazy"
                              onError={() => setLogoError((prev) => ({ ...prev, [entry.id]: true }))}
                            />
                          ) : (
                            entry.badge
                          )}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-base font-semibold alpha-text">{entry.name}</p>
                          <p className="truncate text-[11px] uppercase tracking-[0.22em] alpha-text-muted">
                            {entry.mode}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {entry.isCustom ? (
                          <span className="inline-flex rounded-full border border-[color:var(--alpha-highlight-border)] bg-[color:var(--alpha-highlight-soft)] px-2 py-0.5 text-[10px] font-medium text-[color:var(--alpha-highlight)]">
                            Manual
                          </span>
                        ) : null}
                        <span
                          className="inline-flex rounded-full border px-2 py-0.5 text-[10px] font-medium"
                          style={{
                            borderColor: `color-mix(in srgb, ${entry.accent} 48%, var(--alpha-border))`,
                            backgroundColor: `color-mix(in srgb, ${entry.accent} 14%, transparent)`,
                            color: entry.accent,
                          }}
                        >
                          {entry.pricing}
                        </span>
                      </div>
                    </div>

                    <p className="mt-4 text-sm leading-6 alpha-text">{entry.description}</p>

                    <div className="mt-4 flex flex-wrap gap-2 text-[11px] alpha-text-muted">
                      {entry.assetTypes.map((type) => (
                        <span
                          key={type}
                          className="rounded-full border border-[color:var(--alpha-border)] bg-[color:var(--alpha-hover-soft)] px-2 py-0.5"
                        >
                          {type}
                        </span>
                      ))}
                      {entry.environments.map((type) => (
                        <span
                          key={type}
                          className="rounded-full border border-[color:var(--alpha-border)] bg-[color:var(--alpha-hover-soft)] px-2 py-0.5"
                        >
                          {type}
                        </span>
                      ))}
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {entry.chainIds.map((chainId) => {
                        const chain = chainDirectoryMap[chainId];
                        if (!chain) {
                          return null;
                        }

                        return (
                          <span
                            key={`${entry.id}-${chainId}`}
                            className="inline-flex items-center gap-2 rounded-full border border-[color:var(--alpha-border)] bg-[color:var(--alpha-hover-soft)] px-2.5 py-1 text-[11px] alpha-text-muted"
                          >
                            <img src={chain.logo} alt={chain.name} className="h-3.5 w-3.5 object-contain" />
                            {chain.name}
                          </span>
                        );
                      })}
                    </div>

                    <p className="mt-4 text-[12px] leading-5 alpha-text-muted">{entry.note}</p>

                    <div className="mt-4 flex items-center gap-2">
                      <a
                        href={entry.url}
                        target="_blank"
                        rel="noreferrer"
                        className="macos-btn macos-btn--primary inline-flex flex-1 items-center justify-center gap-2 px-3 py-2 text-sm"
                      >
                        <ArrowUpRight className="h-4 w-4" />
                        Open tool
                      </a>
                      <a
                        href={entry.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="macos-btn macos-btn--ghost inline-flex items-center justify-center gap-2 px-3 py-2 text-sm"
                      >
                        <Link2 className="h-4 w-4" />
                        Source
                      </a>
                      {entry.isCustom ? (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveManualTool(entry.id)}
                          className="macos-btn macos-btn--ghost h-10 w-10 shrink-0"
                          aria-label={`Delete ${entry.name}`}
                        >
                          <Trash2 className="h-4 w-4 text-[color:var(--alpha-danger)]" />
                        </Button>
                      ) : null}
                    </div>
                  </article>
                );
              })}

              {filteredTools.length === 0 ? (
                <div className="macos-empty-state flex min-h-[200px] items-center justify-center p-6 md:col-span-2 2xl:col-span-3">
                  <p className="text-sm alpha-text-muted">
                    Tidak ada tool deploy yang cocok. Coba ubah chain, asset type, atau keyword.
                  </p>
                </div>
              ) : null}
            </div>
          </section>

          <aside className="space-y-4">
            <section className="macos-card rounded-[1.7rem] p-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--alpha-border)] bg-[color:var(--alpha-hover-soft)] px-3 py-1 text-[10px] uppercase tracking-[0.24em] alpha-text-muted">
                <Plus className="h-3.5 w-3.5 text-gold" />
                Manual entry
              </div>

              <h3 className="mt-3 text-lg font-semibold alpha-text">Tambah deploy tool manual</h3>
              <p className="mt-2 text-sm leading-6 alpha-text-muted">
                Simpan tool deploy tambahan dengan nama web, link, dan logo sendiri. Data ini disimpan lokal di browser kamu.
              </p>

              <div className="mt-4 space-y-3">
                <div className="space-y-1.5">
                  <p className="text-[10px] uppercase tracking-[0.2em] alpha-text-muted">Nama web</p>
                  <Input
                    value={manualForm.name}
                    onChange={(event) => updateManualForm('name', event.target.value)}
                    placeholder="Contoh: Mintlify Studio"
                    className="macos-input"
                  />
                </div>

                <div className="space-y-1.5">
                  <p className="text-[10px] uppercase tracking-[0.2em] alpha-text-muted">Link tool</p>
                  <Input
                    value={manualForm.url}
                    onChange={(event) => updateManualForm('url', event.target.value)}
                    placeholder="https://..."
                    className="macos-input"
                  />
                </div>

                <div className="space-y-1.5">
                  <p className="text-[10px] uppercase tracking-[0.2em] alpha-text-muted">Link source / docs</p>
                  <Input
                    value={manualForm.sourceUrl}
                    onChange={(event) => updateManualForm('sourceUrl', event.target.value)}
                    placeholder="Optional. Kalau kosong, pakai link tool."
                    className="macos-input"
                  />
                </div>

                <div className="space-y-1.5">
                  <p className="text-[10px] uppercase tracking-[0.2em] alpha-text-muted">Logo web</p>
                  <Input
                    value={manualForm.logo}
                    onChange={(event) => updateManualForm('logo', event.target.value)}
                    placeholder="/logos/custom.png atau https://..."
                    className="macos-input"
                  />
                </div>

                    <div className="rounded-[1rem] border border-[color:var(--alpha-border)] bg-[color:var(--alpha-hover-soft)] px-3 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-[0.9rem] border border-[color:var(--alpha-border)] bg-[color:var(--alpha-surface)]">
                      {manualPreviewLogo ? (
                        <img
                          src={manualPreviewLogo}
                          alt={manualForm.name || 'Manual logo preview'}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <Globe className="h-4 w-4 alpha-text-muted" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold alpha-text">
                        {manualForm.name.trim() || 'Preview deploy tool'}
                      </p>
                      <p className="truncate text-[11px] alpha-text-muted">
                        {manualForm.url.trim() || 'Link tool akan tampil di sini'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <p className="text-[10px] uppercase tracking-[0.2em] alpha-text-muted">Asset</p>
                    <select
                      value={manualForm.assetType}
                      onChange={(event) => updateManualForm('assetType', event.target.value as DeployAssetType)}
                      className="macos-input w-full text-sm alpha-text outline-none"
                    >
                      {assetFilters.filter((filter): filter is DeployAssetType => filter !== 'All').map((filter) => (
                        <option key={filter} value={filter}>{filter}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <p className="text-[10px] uppercase tracking-[0.2em] alpha-text-muted">Chain</p>
                    <select
                      value={manualForm.chainId}
                      onChange={(event) => updateManualForm('chainId', event.target.value)}
                      className="macos-input w-full text-sm alpha-text outline-none"
                    >
                      {Object.values(chainDirectoryMap).map((entry) => (
                        <option key={entry.id} value={entry.id}>{entry.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <p className="text-[10px] uppercase tracking-[0.2em] alpha-text-muted">Environment</p>
                    <select
                      value={manualForm.environment}
                      onChange={(event) => updateManualForm('environment', event.target.value as DeployEnvironment)}
                      className="macos-input w-full text-sm alpha-text outline-none"
                    >
                      {environmentFilters.filter((filter): filter is DeployEnvironment => filter !== 'All').map((filter) => (
                        <option key={filter} value={filter}>{filter}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <p className="text-[10px] uppercase tracking-[0.2em] alpha-text-muted">Pricing</p>
                    <select
                      value={manualForm.pricing}
                      onChange={(event) => updateManualForm('pricing', event.target.value as PricingFilter)}
                      className="macos-input w-full text-sm alpha-text outline-none"
                    >
                      {deployPricing.map((entry) => (
                        <option key={entry} value={entry}>{entry}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <p className="text-[10px] uppercase tracking-[0.2em] alpha-text-muted">Mode</p>
                  <div className="flex flex-wrap gap-2">
                    {deployModes.map((mode) => (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => updateManualForm('mode', mode)}
                        className={cn(
                          'rounded-full border px-3 py-1.5 text-[11px] font-mono transition-colors duration-150',
                          manualForm.mode === mode
                            ? 'border-[color:var(--alpha-highlight-border)] bg-[color:var(--alpha-highlight-soft)] text-[color:var(--alpha-highlight)]'
                            : 'border-[color:var(--alpha-border)] bg-[color:var(--alpha-surface)] alpha-text-muted hover:border-[color:var(--alpha-border-strong)] hover:text-[color:var(--alpha-text)]'
                        )}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <p className="text-[10px] uppercase tracking-[0.2em] alpha-text-muted">Catatan</p>
                  <Textarea
                    value={manualForm.note}
                    onChange={(event) => updateManualForm('note', event.target.value)}
                    placeholder="Opsional. Misal: deploy token cepat tanpa wallet extension tertentu."
                    className="macos-input min-h-[96px]"
                  />
                </div>

                <Button
                  type="button"
                  onClick={handleAddManualTool}
                  disabled={!manualForm.name.trim() || !manualForm.url.trim()}
                  className="macos-btn macos-btn--primary w-full justify-center"
                >
                  <Plus className="h-4 w-4" />
                  Simpan manual tool
                </Button>
              </div>
            </section>

            <section className="macos-card rounded-[1.7rem] p-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--alpha-border)] bg-[color:var(--alpha-hover-soft)] px-3 py-1 text-[10px] uppercase tracking-[0.24em] alpha-text-muted">
                <Rocket className="h-3.5 w-3.5 text-gold" />
                Suggested flow
              </div>

              <h3 className="mt-3 text-lg font-semibold alpha-text">Stack yang paling praktis</h3>
              <div className="mt-4 space-y-3">
                <div className="rounded-[1rem] border border-[color:var(--alpha-border)] bg-[color:var(--alpha-hover-soft)] px-3 py-3">
                  <p className="text-[10px] uppercase tracking-[0.22em] alpha-text-muted">Fast no-code</p>
                  <p className="mt-2 text-sm alpha-text">thirdweb Dashboard untuk deploy cepat di banyak chain EVM.</p>
                </div>
                <div className="rounded-[1rem] border border-[color:var(--alpha-border)] bg-[color:var(--alpha-hover-soft)] px-3 py-3">
                  <p className="text-[10px] uppercase tracking-[0.22em] alpha-text-muted">Safer contract template</p>
                  <p className="mt-2 text-sm alpha-text">
                    OpenZeppelin Wizard + Remix buat generate dan deploy contract yang lebih jelas.
                  </p>
                </div>
                <div className="rounded-[1rem] border border-[color:var(--alpha-border)] bg-[color:var(--alpha-hover-soft)] px-3 py-3">
                  <p className="text-[10px] uppercase tracking-[0.22em] alpha-text-muted">Chain-specific</p>
                  <p className="mt-2 text-sm alpha-text">
                    Kalau target kamu Solana atau Sui, langsung mulai dari docs resmi supaya flow deploy-nya tidak salah.
                  </p>
                </div>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </DashboardLayout>
  );
}
