import { startTransition, useDeferredValue, useMemo, useState } from 'react';
import {
  ArrowUpRight,
  BadgeCheck,
  Droplets,
  Edit2,
  Link2,
  Plus,
  Search,
  Trash2,
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { faucetDirectory } from '@/lib/faucet-directory';
import {
  faucetManualChainMap,
  faucetManualChainOptions,
  faucetNetworkTemplateMap,
  faucetNetworkTemplates,
} from '@/lib/faucet-network-templates';
import { useFaucets } from '@/hooks/use-faucets';
import type { Faucet } from '@/types';

type EnvironmentFilter = 'All' | 'Testnet' | 'Devnet';

interface EditingManualFaucet {
  id: string;
  projectName: string;
  url: string;
  chainId: string;
}

const environmentFilters: EnvironmentFilter[] = ['All', 'Testnet', 'Devnet'];
const defaultTemplateId = faucetNetworkTemplates[0]?.id ?? 'ethereum-sepolia';

const inferChainId = (logo?: string) =>
  faucetManualChainOptions.find((entry) => entry.logo === logo)?.id ?? 'custom';

export function FaucetPage() {
  const { isAuthenticated } = useAuth();
  const { faucets, loading, addFaucet, updateFaucet, removeFaucet } = useFaucets();

  const [query, setQuery] = useState('');
  const [environmentFilter, setEnvironmentFilter] = useState<EnvironmentFilter>('All');
  const [chainFilter, setChainFilter] = useState('All');
  const [manualTemplateId, setManualTemplateId] = useState(defaultTemplateId);
  const [manualChainId, setManualChainId] = useState(
    faucetNetworkTemplateMap[defaultTemplateId]?.chainId ?? 'ethereum',
  );
  const [manualNetworkName, setManualNetworkName] = useState(
    faucetNetworkTemplateMap[defaultTemplateId]?.networkName ?? 'Ethereum Sepolia',
  );
  const [manualProviderLabel, setManualProviderLabel] = useState(
    faucetNetworkTemplateMap[defaultTemplateId]?.providerHint ?? 'Alchemy Faucet',
  );
  const [manualUrl, setManualUrl] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<EditingManualFaucet | null>(null);
  const [logoError, setLogoError] = useState<Record<string, boolean>>({});
  const deferredQuery = useDeferredValue(query.trim().toLowerCase());

  const applyTemplate = (templateId: string) => {
    const template = faucetNetworkTemplateMap[templateId];
    if (!template) {
      return;
    }

    setManualTemplateId(template.id);
    setManualChainId(template.chainId);
    setManualNetworkName(template.networkName);
    setManualProviderLabel(template.providerHint);
  };

  const resetManualForm = () => {
    applyTemplate(defaultTemplateId);
    setManualUrl('');
  };

  const selectedTemplate = faucetNetworkTemplateMap[manualTemplateId] ?? faucetNetworkTemplateMap[defaultTemplateId];
  const selectedManualChain = faucetManualChainMap[manualChainId] ?? faucetManualChainMap.custom;
  const quickTemplates = faucetNetworkTemplates.filter((entry) => entry.id !== 'custom-testnet');

  const filteredDirectory = useMemo(() => {
    return faucetDirectory.filter((entry) => {
      const matchesEnvironment =
        environmentFilter === 'All' || entry.environment === environmentFilter;
      const matchesChain = chainFilter === 'All' || entry.chainId === chainFilter;
      const matchesQuery =
        deferredQuery.length === 0 ||
        entry.name.toLowerCase().includes(deferredQuery) ||
        entry.networkName.toLowerCase().includes(deferredQuery) ||
        entry.provider.toLowerCase().includes(deferredQuery) ||
        entry.token.toLowerCase().includes(deferredQuery) ||
        entry.summary.toLowerCase().includes(deferredQuery) ||
        entry.note.toLowerCase().includes(deferredQuery);

      return matchesEnvironment && matchesChain && matchesQuery;
    });
  }, [chainFilter, deferredQuery, environmentFilter]);

  const filteredManualFaucets = useMemo(() => {
    return faucets.filter((entry) => {
      const inferredChainId = inferChainId(entry.logo);
      const matchesChain = chainFilter === 'All' || inferredChainId === chainFilter;
      const matchesQuery =
        deferredQuery.length === 0 ||
        entry.projectName.toLowerCase().includes(deferredQuery) ||
        entry.url.toLowerCase().includes(deferredQuery);

      return matchesChain && matchesQuery;
    });
  }, [chainFilter, deferredQuery, faucets]);

  const stats = useMemo(() => {
    const openAccess = faucetDirectory.filter((entry) => entry.access === 'Open').length;

    return {
      curated: faucetDirectory.length,
      templates: faucetNetworkTemplates.length - 1,
      openAccess,
      manual: faucets.length,
    };
  }, [faucets.length]);

  const handleAddManualLink = async () => {
    if (!isAuthenticated || !manualUrl.trim()) {
      return;
    }

    const networkLabel =
      manualNetworkName.trim() ||
      selectedTemplate?.networkName ||
      `${selectedManualChain.name} ${selectedTemplate?.environment ?? 'Testnet'}`;
    const providerLabel = manualProviderLabel.trim();
    const projectName = providerLabel ? `${networkLabel} · ${providerLabel}` : networkLabel;

    await addFaucet({
      projectName,
      url: manualUrl.trim(),
      logo: selectedManualChain.logo,
    });

    resetManualForm();
  };

  const startEdit = (entry: Faucet) => {
    setEditingId(entry.id);
    setEditForm({
      id: entry.id,
      projectName: entry.projectName,
      url: entry.url,
      chainId: inferChainId(entry.logo),
    });
  };

  const saveEdit = async () => {
    if (!isAuthenticated || !editForm?.projectName.trim() || !editForm.url.trim()) {
      return;
    }

    const selectedChain = faucetManualChainMap[editForm.chainId] ?? faucetManualChainMap.custom;
    await updateFaucet(editForm.id, {
      projectName: editForm.projectName.trim(),
      url: editForm.url.trim(),
      logo: selectedChain.logo,
    });

    setEditingId(null);
    setEditForm(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm(null);
  };

  const handleDelete = async (id: string) => {
    if (!isAuthenticated) {
      return;
    }

    if (!window.confirm('Hapus link faucet ini?')) {
      return;
    }

    await removeFaucet(id);
  };

  return (
    <DashboardLayout disableMonochrome>
      <div className="macos-root macos-page-shell">
        <div className="macos-page-header macos-animate-up">
          <div className="macos-page-kicker">
            <Droplets className="h-3.5 w-3.5" />
            Faucet directory
          </div>

          <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-start">
            <div>
              <h1 className="macos-page-title">Faucet Management</h1>
              <p className="macos-page-subtitle">
               Curated faucet sources for supported chains.
Use them to fund wallets for development,
testing, and ecosystem exploration.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-2">
              {[
                { label: 'Curated', value: stats.curated },
                { label: 'Templates', value: stats.templates },
                { label: 'Open access', value: stats.openAccess },
                { label: 'Saved links', value: stats.manual },
              ].map((stat, index) => (
                <div
                  key={stat.label}
                  className="macos-card macos-card-entry rounded-[1.35rem] px-4 py-3"
                  style={{ ['--mac-delay' as any]: `${index * 40}ms` }}
                >
                  <p className="text-[10px] uppercase tracking-[0.24em] alpha-text-muted">{stat.label}</p>
                  <p className="mt-2 text-2xl font-bold alpha-text">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-5 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-wrap gap-2">
            {environmentFilters.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setEnvironmentFilter(filter)}
                className={`rounded-full border px-3 py-1.5 text-[11px] font-mono uppercase tracking-[0.22em] transition-colors duration-150 ${
                  environmentFilter === filter
                    ? 'border-[color:var(--alpha-highlight-border)] bg-[color:var(--alpha-highlight-soft)] text-[color:var(--alpha-highlight)]'
                    : 'border-[color:var(--alpha-border)] bg-[color:var(--alpha-surface)] alpha-text-muted hover:border-[color:var(--alpha-border-strong)] hover:text-[color:var(--alpha-text)]'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="flex w-full flex-col gap-3 sm:flex-row xl:max-w-[600px]">
            <label className="flex flex-1 items-center gap-3 rounded-[1.2rem] border border-[color:var(--alpha-border)] bg-[color:var(--alpha-surface)] px-4 py-3">
              <Search className="h-4 w-4 alpha-text-muted" />
              <input
                value={query}
                onChange={(event) => {
                  const value = event.target.value;
                  startTransition(() => setQuery(value));
                }}
                placeholder="Cari chain, network, provider, token, atau faucet..."
                className="w-full border-0 bg-transparent p-0 text-sm alpha-text outline-none placeholder:text-[color:var(--alpha-text-muted)]"
              />
            </label>

            <select
              value={chainFilter}
              onChange={(event) => setChainFilter(event.target.value)}
              className="rounded-[1.2rem] border border-[color:var(--alpha-border)] bg-[color:var(--alpha-surface)] px-4 py-3 text-sm alpha-text outline-none"
            >
              <option value="All">All chains</option>
              {faucetManualChainOptions.map((entry) => (
                <option key={entry.id} value={entry.id}>
                  {entry.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_380px]">
          <section>
            <div className="mb-3 flex items-center gap-2">
              <BadgeCheck className="h-4 w-4 text-gold" />
              <h2 className="text-xs font-mono uppercase tracking-[0.24em] alpha-text-muted">
                Curated faucet deck
              </h2>
            </div>

            <div className="grid gap-3.5 md:grid-cols-2 2xl:grid-cols-3">
              {filteredDirectory.map((entry, index) => (
                <article
                  key={entry.id}
                  className="macos-premium-card macos-card-entry group rounded-[1.5rem] p-3.5"
                  style={{ ['--mac-delay' as any]: `${index * 26}ms` }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-[1rem] border border-[color:var(--alpha-border)] bg-[color:var(--alpha-surface-soft)]"
                        style={{ boxShadow: `inset 0 1px 0 color-mix(in srgb, ${entry.accent} 16%, transparent)` }}
                      >
                        <img src={entry.logo} alt={entry.name} loading="lazy" className="h-7 w-7 object-contain" />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-base font-semibold alpha-text">{entry.name}</p>
                        <p className="truncate text-[11px] uppercase tracking-[0.22em] alpha-text-muted">
                          {entry.provider}
                        </p>
                      </div>
                    </div>

                    <span
                      className="inline-flex rounded-full border px-2 py-0.5 text-[10px] font-medium"
                      style={{
                        borderColor: `color-mix(in srgb, ${entry.accent} 48%, var(--alpha-border))`,
                        backgroundColor: `color-mix(in srgb, ${entry.accent} 14%, transparent)`,
                        color: entry.accent,
                      }}
                    >
                      {entry.environment}
                    </span>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] alpha-text-muted">
                    <span className="rounded-full border border-[color:var(--alpha-border)] bg-[color:var(--alpha-hover-soft)] px-2 py-0.5">
                      {faucetManualChainMap[entry.chainId]?.name ?? entry.chainId}
                    </span>
                    <span className="rounded-full border border-[color:var(--alpha-border)] bg-[color:var(--alpha-hover-soft)] px-2 py-0.5">
                      {entry.networkName}
                    </span>
                    <span className="rounded-full border border-[color:var(--alpha-border)] bg-[color:var(--alpha-hover-soft)] px-2 py-0.5">
                      {entry.token}
                    </span>
                    <span className="rounded-full border border-[color:var(--alpha-border)] bg-[color:var(--alpha-hover-soft)] px-2 py-0.5">
                      {entry.access}
                    </span>
                  </div>

                  <p className="mt-3 line-clamp-2 text-sm leading-6 alpha-text">{entry.summary}</p>
                  <p className="mt-2 line-clamp-2 text-[12px] leading-5 alpha-text-muted">{entry.note}</p>

                  <div className="mt-4 flex items-center gap-2">
                    <a
                      href={entry.faucetUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="macos-btn macos-btn--primary inline-flex flex-1 items-center justify-center gap-2 px-3 py-2 text-sm"
                    >
                      <ArrowUpRight className="h-4 w-4" />
                      Open faucet
                    </a>
                    <a
                      href={entry.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="macos-btn macos-btn--ghost inline-flex items-center justify-center gap-2 px-3 py-2 text-sm"
                      title="Open source"
                    >
                      <Link2 className="h-4 w-4" />
                      Source
                    </a>
                  </div>
                </article>
              ))}

              {filteredDirectory.length === 0 ? (
                <div className="macos-empty-state flex min-h-[200px] items-center justify-center p-6 md:col-span-2 2xl:col-span-3">
                  <p className="text-sm alpha-text-muted">
                    
                  </p>
                </div>
              ) : null}
            </div>
          </section>

          <aside className="space-y-4">
            <section className="macos-card rounded-[1.55rem] p-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--alpha-border)] bg-[color:var(--alpha-hover-soft)] px-3 py-1 text-[10px] uppercase tracking-[0.24em] alpha-text-muted">
                <Plus className="h-3.5 w-3.5 text-gold" />
                Manual faucet
              </div>

              <div className="mt-3 flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold alpha-text">Tambah faucet manual</h3>
                  <p className="mt-1.5 text-sm leading-6 alpha-text-muted">
                    isi sendiri 
                  </p>
                </div>

                <div className="rounded-[1rem] border border-[color:var(--alpha-border)] bg-[color:var(--alpha-hover-soft)] px-3 py-2">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-[0.75rem] border border-[color:var(--alpha-border)] bg-[color:var(--alpha-surface)]">
                      <img
                        src={selectedManualChain.logo}
                        alt={selectedManualChain.name}
                        className="h-4.5 w-4.5 object-contain"
                      />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.22em] alpha-text-muted">Auto logo</p>
                      <p className="text-xs font-semibold alpha-text">{selectedManualChain.name}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 max-h-[132px] overflow-auto pr-1">
                <div className="flex flex-wrap gap-2">
                  {quickTemplates.map((template) => (
                    <button
                      key={template.id}
                      type="button"
                      onClick={() => applyTemplate(template.id)}
                      className={`rounded-full border px-2.5 py-1 text-[10px] font-mono uppercase tracking-[0.18em] transition-colors duration-150 ${
                        manualTemplateId === template.id
                          ? 'border-[color:var(--alpha-highlight-border)] bg-[color:var(--alpha-highlight-soft)] text-[color:var(--alpha-highlight)]'
                          : 'border-[color:var(--alpha-border)] bg-[color:var(--alpha-hover-soft)] alpha-text-muted hover:border-[color:var(--alpha-border-strong)] hover:text-[color:var(--alpha-text)]'
                      }`}
                    >
                      {template.networkName || template.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <select
                  value={manualTemplateId}
                  onChange={(event) => applyTemplate(event.target.value)}
                  disabled={!isAuthenticated}
                  className="w-full rounded-[0.95rem] border border-[color:var(--alpha-border)] bg-[color:var(--alpha-surface)] px-3.5 py-2.5 text-sm alpha-text outline-none"
                >
                  {faucetNetworkTemplates.map((template) => (
                    <option key={template.id} value={template.id}>
                      {template.label}
                    </option>
                  ))}
                </select>

                <select
                  value={manualChainId}
                  onChange={(event) => {
                    const chainId = event.target.value;
                    setManualChainId(chainId);
                  }}
                  disabled={!isAuthenticated}
                  className="w-full rounded-[0.95rem] border border-[color:var(--alpha-border)] bg-[color:var(--alpha-surface)] px-3.5 py-2.5 text-sm alpha-text outline-none"
                >
                  {faucetManualChainOptions.map((entry) => (
                    <option key={entry.id} value={entry.id}>
                      {entry.name}
                    </option>
                  ))}
                </select>

                <Input
                  value={manualNetworkName}
                  onChange={(event) => setManualNetworkName(event.target.value)}
                  placeholder="Nama chain / network"
                  disabled={!isAuthenticated}
                  className="h-10 rounded-[0.95rem] border-[color:var(--alpha-border)] bg-[color:var(--alpha-surface)]"
                />

                <Input
                  value={manualProviderLabel}
                  onChange={(event) => setManualProviderLabel(event.target.value)}
                  placeholder="Nama provider"
                  disabled={!isAuthenticated}
                  className="h-10 rounded-[0.95rem] border-[color:var(--alpha-border)] bg-[color:var(--alpha-surface)]"
                />

                <div className="sm:col-span-2">
                  <Input
                    value={manualUrl}
                    onChange={(event) => setManualUrl(event.target.value)}
                    placeholder="Link faucet https://..."
                    disabled={!isAuthenticated}
                    className="h-10 rounded-[0.95rem] border-[color:var(--alpha-border)] bg-[color:var(--alpha-surface)]"
                  />
                </div>
              </div>

              <div className="mt-3 rounded-[0.95rem] border border-[color:var(--alpha-border)] bg-[color:var(--alpha-hover-soft)] px-3 py-2.5 text-[11px] leading-5 alpha-text-muted">
                <span className="font-semibold alpha-text">{selectedManualChain.name}</span>
                {' '} {selectedTemplate.note.toLowerCase()}
              </div>

              <div className="mt-3 flex items-center gap-2">
                <Button
                  type="button"
                  onClick={handleAddManualLink}
                  disabled={!isAuthenticated || !manualUrl.trim() || !manualNetworkName.trim()}
                  className="macos-btn macos-btn--primary flex-1 justify-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Simpan link
                </Button>

                <Button
                  type="button"
                  onClick={resetManualForm}
                  disabled={!isAuthenticated}
                  className="macos-btn macos-btn--ghost px-3"
                >
                  Reset
                </Button>
              </div>

              <p className="mt-2 text-xs leading-5 alpha-text-muted">
                {isAuthenticated
                  ? ''
                  : ''}
              </p>
            </section>

            <section className="macos-card rounded-[1.55rem] p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold alpha-text">My faucet links</h3>
                  <p className="text-sm alpha-text-muted">
                    {isAuthenticated
                      ? 'Manual link yang tersimpan di akun kamu.'
                      : 'Login untuk lihat dan simpan manual link faucet dari database Supabase kamu.'}
                  </p>
                </div>
                <span className="rounded-full border border-[color:var(--alpha-border)] bg-[color:var(--alpha-hover-soft)] px-2.5 py-1 text-[10px] uppercase tracking-[0.22em] alpha-text-muted">
                  {faucets.length}
                </span>
              </div>

              <div className="mt-4 space-y-3">
                {loading ? (
                  <div className="macos-empty-state p-4 text-sm alpha-text-muted">Memuat faucet manual...</div>
                ) : null}

                {!loading && filteredManualFaucets.length === 0 ? (
                  <div className="macos-empty-state p-4 text-sm alpha-text-muted">
                    {isAuthenticated
                      ? 'Belum ada link manual yang cocok. Pakai template di atas untuk tambah testnet baru.'
                      : 'Belum ada manual faucet yang ditampilkan. Login dulu untuk sinkron ke database Supabase kamu.'}
                  </div>
                ) : null}

                {!loading
                  ? filteredManualFaucets.map((entry, index) => {
                      const chainId = editForm?.id === entry.id ? editForm.chainId : inferChainId(entry.logo);
                      const chain = faucetManualChainMap[chainId] ?? faucetManualChainMap.custom;
                      const activeEdit = editingId === entry.id && editForm ? editForm : null;
                      const showLogo = !logoError[entry.id];

                      return (
                        <article
                          key={entry.id}
                          className="macos-card-entry rounded-[1.15rem] border border-[color:var(--alpha-border)] bg-[color:var(--alpha-surface)] p-3"
                          style={{ ['--mac-delay' as any]: `${index * 24}ms` }}
                        >
                          {activeEdit ? (
                            <div className="space-y-3">
                              <select
                                value={activeEdit.chainId}
                                onChange={(event) =>
                                  setEditForm((current) =>
                                    current ? { ...current, chainId: event.target.value } : current,
                                  )
                                }
                                className="w-full rounded-[0.9rem] border border-[color:var(--alpha-border)] bg-[color:var(--alpha-surface-soft)] px-3 py-2 text-sm alpha-text outline-none"
                              >
                                {faucetManualChainOptions.map((option) => (
                                  <option key={option.id} value={option.id}>
                                    {option.name}
                                  </option>
                                ))}
                              </select>

                              <Input
                                value={activeEdit.projectName}
                                onChange={(event) =>
                                  setEditForm((current) =>
                                    current ? { ...current, projectName: event.target.value } : current,
                                  )
                                }
                                placeholder="Nama faucet / network"
                                className="rounded-[0.9rem] border-[color:var(--alpha-border)] bg-[color:var(--alpha-surface-soft)]"
                              />

                              <Input
                                value={activeEdit.url}
                                onChange={(event) =>
                                  setEditForm((current) => (current ? { ...current, url: event.target.value } : current))
                                }
                                placeholder="https://..."
                                className="rounded-[0.9rem] border-[color:var(--alpha-border)] bg-[color:var(--alpha-surface-soft)]"
                              />

                              <div className="flex gap-2">
                                <Button
                                  type="button"
                                  onClick={saveEdit}
                                  className="macos-btn macos-btn--primary flex-1 justify-center"
                                >
                                  Save
                                </Button>
                                <Button
                                  type="button"
                                  onClick={cancelEdit}
                                  className="macos-btn macos-btn--ghost flex-1 justify-center"
                                >
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-start gap-3">
                              <div
                                className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-[0.95rem] border border-[color:var(--alpha-border)] bg-[color:var(--alpha-surface-soft)]"
                                style={{ boxShadow: `inset 0 1px 0 color-mix(in srgb, ${chain.accent} 16%, transparent)` }}
                              >
                                {showLogo ? (
                                  <img
                                    src={entry.logo || chain.logo}
                                    alt={entry.projectName}
                                    className="h-6 w-6 object-contain"
                                    onError={() =>
                                      setLogoError((current) => ({ ...current, [entry.id]: true }))
                                    }
                                  />
                                ) : (
                                  <span className="text-xs font-semibold alpha-text">{chain.shortName}</span>
                                )}
                              </div>

                              <div className="min-w-0 flex-1">
                                <div className="flex items-start justify-between gap-3">
                                  <div className="min-w-0">
                                    <p className="truncate text-sm font-semibold alpha-text">{entry.projectName}</p>
                                    <p className="truncate text-[11px] uppercase tracking-[0.22em] alpha-text-muted">
                                      {chain.name}
                                    </p>
                                  </div>

                                  <div className="flex items-center gap-1">
                                    <button
                                      type="button"
                                      onClick={() => startEdit(entry)}
                                      className="rounded-lg p-1.5 transition-colors hover:bg-[color:var(--alpha-hover-soft)]"
                                      aria-label={`Edit ${entry.projectName}`}
                                    >
                                      <Edit2 className="h-3.5 w-3.5 alpha-text-muted" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleDelete(entry.id)}
                                      className="rounded-lg p-1.5 transition-colors hover:bg-[color:var(--alpha-danger-soft)]"
                                      aria-label={`Delete ${entry.projectName}`}
                                    >
                                      <Trash2 className="h-3.5 w-3.5 text-[var(--alpha-danger)]" />
                                    </button>
                                  </div>
                                </div>

                                <p className="mt-2 truncate text-xs alpha-text-muted">{entry.url}</p>

                                <div className="mt-2 flex items-center gap-2">
                                  <span className="rounded-full border border-[color:var(--alpha-border)] bg-[color:var(--alpha-hover-soft)] px-2 py-0.5 text-[10px] uppercase tracking-[0.16em] alpha-text-muted">
                                    {chain.name}
                                  </span>
                                  <a
                                    href={entry.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="macos-btn macos-btn--ghost inline-flex items-center gap-2 px-3 py-1.5 text-xs"
                                  >
                                    <ArrowUpRight className="h-3.5 w-3.5" />
                                    Open
                                  </a>
                                </div>
                              </div>
                            </div>
                          )}
                        </article>
                      );
                    })
                  : null}
              </div>
            </section>
          </aside>
        </div>
      </div>
    </DashboardLayout>
  );
}
