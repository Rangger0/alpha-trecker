import { useEffect, useMemo, useState, type FormEvent } from 'react';
import {
  Archive,
  BadgeCheck,
  Check,
  ChevronDown,
  Copy,
  Edit3,
  Layers3,
  Loader2,
  Network,
  Plus,
  Search,
  Trash2,
  Wallet,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAirdrops } from '@/hooks/use-airdrops';
import { useWallets, type Wallet as StoredWallet } from '@/hooks/use-wallets';
import type { Airdrop } from '@/types';
import { cn } from '@/lib/utils';

type WalletFilter = 'all' | 'active' | 'archived' | 'testnet' | 'mainnet';

type WalletFormState = {
  id?: string;
  projectId: string;
  address: string;
  label: string;
  notes: string;
  network: string;
  archived: boolean;
};

const emptyWalletForm: WalletFormState = {
  projectId: '',
  address: '',
  label: '',
  notes: '',
  network: 'Testnet',
  archived: false,
};

const networkOptions = ['Testnet', 'Mainnet', 'Ethereum', 'Solana', 'Base', 'Arbitrum', 'BSC', 'Polygon'];

const formatCreatedAt = (value?: string) => {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
};

const formatWalletCreatedAt = (value?: string) => {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
};

const normalize = (value?: string) => value?.toLowerCase().trim() ?? '';

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error && error.message) return error.message;
  if (!error || typeof error !== 'object') return '';

  const record = error as { message?: unknown; details?: unknown; hint?: unknown; code?: unknown };
  return [record.message, record.details, record.hint, record.code]
    .filter((value): value is string => typeof value === 'string' && value.trim().length > 0)
    .join(' ');
};

const isTestnetWallet = (wallet: StoredWallet, project?: Airdrop) => {
  const network = normalize(wallet.network);
  const type = normalize(project?.type ?? wallet.projectName);
  return network.includes('testnet') || type.includes('testnet');
};

const isMainnetWallet = (wallet: StoredWallet) => {
  const network = normalize(wallet.network);
  return network.includes('mainnet') || (!network.includes('testnet') && network.length > 0);
};

function ProjectLogo({
  project,
  logoError,
  onLogoError,
}: {
  project: Airdrop;
  logoError: Record<string, boolean>;
  onLogoError: (id: string) => void;
}) {
  return (
    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-[0.95rem] border border-alpha-border bg-[color:var(--alpha-surface)]">
      {project.projectLogo && !logoError[project.id] ? (
        <img
          src={project.projectLogo}
          alt={project.projectName}
          className="h-full w-full object-cover"
          onError={() => onLogoError(project.id)}
        />
      ) : (
        <span className="text-base font-semibold alpha-text">{project.projectName[0]?.toUpperCase() ?? '?'}</span>
      )}
    </div>
  );
}

export function MultipleAccountPage() {
  const { airdrops, loading: projectsLoading } = useAirdrops();
  const { wallets, loading: walletsLoading, addWallet, updateWallet, deleteWallet, refetch } = useWallets();
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<WalletFilter>('all');
  const [expandedProjectIds, setExpandedProjectIds] = useState<Set<string>>(new Set());
  const [logoError, setLogoError] = useState<Record<string, boolean>>({});
  const [walletDialogOpen, setWalletDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [form, setForm] = useState<WalletFormState>(emptyWalletForm);
  const [walletToDelete, setWalletToDelete] = useState<StoredWallet | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const projectById = useMemo(() => new Map(airdrops.map((project) => [project.id, project])), [airdrops]);

  const walletsByProject = useMemo(() => {
    const grouped = new Map<string, StoredWallet[]>();
    wallets.forEach((wallet) => {
      if (!wallet.projectId) return;
      grouped.set(wallet.projectId, [...(grouped.get(wallet.projectId) ?? []), wallet]);
    });
    return grouped;
  }, [wallets]);

  const projects = useMemo(
    () =>
      [...airdrops].sort((left, right) => {
        const leftWallets = walletsByProject.get(left.id)?.length ?? 0;
        const rightWallets = walletsByProject.get(right.id)?.length ?? 0;
        if (rightWallets !== leftWallets) return rightWallets - leftWallets;
        return new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime();
      }),
    [airdrops, walletsByProject]
  );

  useEffect(() => {
    if (wallets.length === 0) return;

    setExpandedProjectIds((previous) => {
      const next = new Set(previous);
      wallets.forEach((wallet) => {
        if (wallet.projectId) next.add(wallet.projectId);
      });
      return next;
    });
  }, [wallets]);

  const stats = useMemo(() => {
    const activeWallets = wallets.filter((wallet) => !wallet.archived);
    const labels = new Set(wallets.map((wallet) => wallet.label?.trim()).filter(Boolean));
    const mainnetWallets = wallets.filter(isMainnetWallet);
    const testnetWallets = wallets.filter((wallet) => isTestnetWallet(wallet, projectById.get(wallet.projectId ?? '')));

    return [
      { label: 'Total Wallet', value: wallets.length, icon: Wallet },
      { label: 'Active Wallet', value: activeWallets.length, icon: BadgeCheck },
      { label: 'Total Projects', value: projects.length, icon: Layers3 },
      { label: 'Labels Used', value: labels.size, icon: Check },
      { label: 'Mainnet Wallet', value: mainnetWallets.length, icon: Network },
      { label: 'Testnet Wallet', value: testnetWallets.length, icon: Archive },
    ];
  }, [projectById, projects.length, wallets]);

  const filteredWallets = useMemo(() => {
    const query = normalize(searchQuery);

    return wallets.filter((wallet) => {
      const project = projectById.get(wallet.projectId ?? '');
      const haystack = [
        wallet.address,
        wallet.label,
        wallet.notes,
        wallet.network,
        project?.projectName,
        project?.projectCategory,
        project?.farmingStrategy,
      ]
        .map(normalize)
        .join(' ');

      const matchesQuery = !query || haystack.includes(query);
      const matchesFilter =
        filter === 'all' ||
        (filter === 'active' && !wallet.archived) ||
        (filter === 'archived' && wallet.archived) ||
        (filter === 'testnet' && isTestnetWallet(wallet, project)) ||
        (filter === 'mainnet' && isMainnetWallet(wallet));

      return matchesQuery && matchesFilter;
    });
  }, [filter, projectById, searchQuery, wallets]);

  const filteredProjectIds = useMemo(
    () => new Set(filteredWallets.map((wallet) => wallet.projectId).filter(Boolean)),
    [filteredWallets]
  );

  const visibleProjects = useMemo(() => {
    const query = normalize(searchQuery);
    if (!query && filter === 'all') return projects;

    return projects.filter((project) => {
      const projectMatches = normalize(project.projectName).includes(query);
      return projectMatches || filteredProjectIds.has(project.id);
    });
  }, [filter, filteredProjectIds, projects, searchQuery]);

  const resetForm = () => setForm(emptyWalletForm);

  const toggleProject = (projectId: string) => {
    setExpandedProjectIds((previous) => {
      const next = new Set(previous);
      if (next.has(projectId)) {
        next.delete(projectId);
      } else {
        next.add(projectId);
      }
      return next;
    });
  };

  const openAddWallet = (projectId = '') => {
    setForm({ ...emptyWalletForm, projectId });
    setWalletDialogOpen(true);
  };

  const openEditWallet = (wallet: StoredWallet) => {
    setForm({
      id: wallet.id,
      projectId: wallet.projectId ?? '',
      address: wallet.address,
      label: wallet.label ?? '',
      notes: wallet.notes ?? '',
      network: wallet.network ?? 'Testnet',
      archived: Boolean(wallet.archived),
    });
    setWalletDialogOpen(true);
  };

  const submitWallet = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const project = projectById.get(form.projectId);
    if (!project) {
      toast.error('Select a project first.');
      return;
    }
    if (!form.address.trim()) {
      toast.error('Wallet address is required.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        projectId: project.id,
        projectName: project.projectName,
        walletAddress: form.address.trim(),
        label: form.label.trim() || undefined,
        notes: form.notes.trim() || undefined,
        network: form.network,
        archived: form.archived,
      };

      if (form.id) {
        await updateWallet(form.id, payload);
        toast.success('Wallet updated.');
      } else {
        await addWallet(payload);
        toast.success('Wallet added.');
      }

      await refetch();
      setExpandedProjectIds((previous) => new Set(previous).add(project.id));
      setWalletDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Failed to save wallet:', error);
      const message = getErrorMessage(error);
      toast.error(message ? `Failed to save wallet: ${message}` : 'Failed to save wallet.');
    } finally {
      setSubmitting(false);
    }
  };

  const requestDeleteWallet = (wallet: StoredWallet) => {
    setWalletToDelete(wallet);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteWallet = async () => {
    if (!walletToDelete) return;
    try {
      await deleteWallet(walletToDelete.id);
      await refetch();
      toast.success('Wallet deleted.');
      setDeleteDialogOpen(false);
      setWalletToDelete(null);
    } catch (error) {
      console.error('Failed to delete wallet:', error);
      toast.error('Failed to delete wallet.');
    }
  };

  const copyWallet = async (wallet: StoredWallet) => {
    try {
      await navigator.clipboard.writeText(wallet.address);
      setCopiedId(wallet.id);
      toast.success('Wallet copied');
      window.setTimeout(() => setCopiedId(null), 1400);
    } catch {
      toast.error('Clipboard is not available.');
    }
  };

  const loading = projectsLoading || walletsLoading;

  return (
    <DashboardLayout disableMonochrome>
      <main className="macos-root macos-page-shell">
        <section className="macos-page-header macos-animate-up">
          <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(380px,0.72fr)] xl:items-end">
            <div>
              <div className="macos-page-kicker">
                <Wallet className="h-3.5 w-3.5" />
                Multi account
              </div>
              <h1 className="macos-page-title">Multi Account Management</h1>
              <p className="macos-page-subtitle">
                Manage project wallets from the same project and wallet data used across Alpha Tracker.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full border border-alpha-border bg-[color:var(--alpha-hover-soft)] px-3 py-1 text-[10px] uppercase tracking-[0.16em] alpha-text-muted">
                  {wallets.length} wallets tracked
                </span>
                <span className="rounded-full border border-alpha-border bg-[color:var(--alpha-hover-soft)] px-3 py-1 text-[10px] uppercase tracking-[0.16em] alpha-text-muted">
                  {projects.length} projects linked
                </span>
              </div>
            </div>

            <Button
              onClick={() => openAddWallet(projects[0]?.id ?? '')}
              className="h-11 justify-self-start rounded-[0.95rem] border border-[color:var(--alpha-signal)] bg-[color:var(--alpha-signal)] px-4 font-mono text-[color:var(--alpha-accent-contrast)] hover:bg-[color:var(--alpha-signal-press)] xl:justify-self-end"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Wallet
            </Button>
          </div>
        </section>

        <section className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {stats.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="macos-card rounded-[1.05rem] p-4 shadow-none">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[10px] uppercase tracking-[0.2em] alpha-text-muted">{item.label}</p>
                  <Icon className="h-4 w-4 alpha-text-muted" />
                </div>
                <p className="mt-2 text-2xl font-semibold alpha-text">{item.value}</p>
              </div>
            );
          })}
        </section>

        <section className="mb-6 macos-card rounded-[1.15rem] p-4 shadow-none">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <label className="flex h-11 min-w-0 flex-1 items-center gap-3 rounded-[1rem] border border-alpha-border bg-[color:var(--alpha-surface)] px-4">
              <Search className="h-4 w-4 shrink-0 alpha-text-muted" />
              <Input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search address, label, or project..."
                className="h-auto min-w-0 border-0 bg-transparent p-0 font-mono shadow-none focus-visible:ring-0"
              />
            </label>

            <Select value={filter} onValueChange={(value) => setFilter(value as WalletFilter)}>
              <SelectTrigger className="h-11 w-full rounded-[1rem] border-alpha-border bg-[color:var(--alpha-surface)] alpha-text lg:w-[190px]">
                <SelectValue placeholder="Filter wallets" />
              </SelectTrigger>
              <SelectContent className="macos-popover border-alpha-border bg-[color:var(--alpha-panel)]">
                <SelectItem value="all">All Wallets</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
                <SelectItem value="testnet">Testnet</SelectItem>
                <SelectItem value="mainnet">Mainnet</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </section>

        {loading ? (
          <div className="flex min-h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-[color:var(--alpha-signal)]" />
          </div>
        ) : visibleProjects.length === 0 ? (
          <section className="macos-empty-state rounded-[1.15rem] border border-dashed border-alpha-border py-16 text-center">
            <Wallet className="mx-auto mb-4 h-12 w-12 alpha-text-muted" />
            <h2 className="text-lg font-semibold alpha-text">No wallet project found</h2>
            <p className="mt-2 text-sm alpha-text-muted">
              Create a project from Dashboard, then add wallets here.
            </p>
          </section>
        ) : (
          <section className="grid grid-cols-1 gap-4 xl:grid-cols-2 2xl:grid-cols-3">
            {visibleProjects.map((project) => {
              const projectWallets = (walletsByProject.get(project.id) ?? []).filter((wallet) =>
                filteredWallets.some((filtered) => filtered.id === wallet.id)
              );
              const allProjectWallets = walletsByProject.get(project.id) ?? [];
              const labelCount = new Set(allProjectWallets.map((wallet) => wallet.label?.trim()).filter(Boolean)).size;
              const activeCount = allProjectWallets.filter((wallet) => !wallet.archived).length;
              const progress = allProjectWallets.length === 0 ? 0 : Math.round((activeCount / allProjectWallets.length) * 100);
              const isExpanded = expandedProjectIds.has(project.id);

              return (
                <article
                  key={project.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => toggleProject(project.id)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      toggleProject(project.id);
                    }
                  }}
                  className="macos-card flex cursor-pointer flex-col rounded-[1.15rem] p-4 shadow-none transition-colors hover:border-[color:var(--alpha-border-strong)]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-start gap-3">
                      <ProjectLogo project={project} logoError={logoError} onLogoError={(id) => setLogoError((prev) => ({ ...prev, [id]: true }))} />
                      <div className="min-w-0">
                        <h2 className="truncate text-lg font-semibold alpha-text">{project.projectName}</h2>
                        <p className="mt-1 text-[11px] uppercase tracking-[0.16em] alpha-text-muted">
                          Status: {project.status}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <span className="rounded-full border border-alpha-border bg-[color:var(--alpha-hover-soft)] px-2.5 py-1 text-[9px] uppercase tracking-[0.14em] alpha-text-muted">
                            Category: {project.projectCategory ?? 'Other'}
                          </span>
                          <span className="rounded-full border border-alpha-border bg-[color:var(--alpha-hover-soft)] px-2.5 py-1 text-[9px] uppercase tracking-[0.14em] alpha-text-muted">
                            Strategy: {project.farmingStrategy ?? 'Unknown'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <span className="inline-flex items-center gap-1 rounded-full border border-alpha-border bg-[color:var(--alpha-surface)] px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] alpha-text-muted">
                        {isExpanded ? 'Collapse' : 'Expand'}
                        <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', isExpanded && 'rotate-180')} />
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={(event) => {
                          event.stopPropagation();
                          openAddWallet(project.id);
                        }}
                        className="h-9 w-9 shrink-0 rounded-[0.85rem] border border-alpha-border bg-[color:var(--alpha-surface)] alpha-text-muted hover:bg-[color:var(--alpha-hover-soft)] hover:text-[color:var(--alpha-text)]"
                        title="Add wallet"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
                    <div className="rounded-[0.9rem] border border-alpha-border bg-[color:var(--alpha-hover-soft)] px-3 py-2.5">
                      <p className="text-[10px] uppercase tracking-[0.18em] alpha-text-muted">Total Wallet</p>
                      <p className="mt-1 text-lg font-semibold alpha-text">{allProjectWallets.length}</p>
                    </div>
                    <div className="rounded-[0.9rem] border border-alpha-border bg-[color:var(--alpha-hover-soft)] px-3 py-2.5">
                      <p className="text-[10px] uppercase tracking-[0.18em] alpha-text-muted">Active Wallet</p>
                      <p className="mt-1 text-lg font-semibold alpha-text">{activeCount}</p>
                    </div>
                    <div className="rounded-[0.9rem] border border-alpha-border bg-[color:var(--alpha-hover-soft)] px-3 py-2.5">
                      <p className="text-[10px] uppercase tracking-[0.18em] alpha-text-muted">Labels Used</p>
                      <p className="mt-1 text-lg font-semibold alpha-text">{labelCount}</p>
                    </div>
                    <div className="rounded-[0.9rem] border border-alpha-border bg-[color:var(--alpha-hover-soft)] px-3 py-2.5">
                      <p className="text-[10px] uppercase tracking-[0.18em] alpha-text-muted">Created</p>
                      <p className="mt-1 text-sm font-semibold alpha-text">{formatCreatedAt(project.createdAt)}</p>
                    </div>
                    <div className="rounded-[0.9rem] border border-alpha-border bg-[color:var(--alpha-hover-soft)] px-3 py-2.5">
                      <p className="text-[10px] uppercase tracking-[0.18em] alpha-text-muted">Progress</p>
                      <p className="mt-1 text-sm font-semibold alpha-text">{progress}% active</p>
                    </div>
                    <div className="rounded-[0.9rem] border border-alpha-border bg-[color:var(--alpha-hover-soft)] px-3 py-2.5">
                      <p className="text-[10px] uppercase tracking-[0.18em] alpha-text-muted">Wallet List</p>
                      <p className="mt-1 flex items-center gap-1 text-sm font-semibold alpha-text">
                        {isExpanded ? 'Expanded' : 'Collapsed'}
                        <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', isExpanded && 'rotate-180')} />
                      </p>
                    </div>
                  </div>

                  <Progress
                    value={progress}
                    className="mt-4 h-2 border border-alpha-border bg-[color:var(--alpha-hover-soft)] [&_[data-slot=progress-indicator]]:bg-[color:var(--alpha-signal)]"
                  />

                  {isExpanded ? (
                  <div className="mt-4 flex-1 overflow-hidden rounded-[1rem] border border-alpha-border bg-[color:var(--alpha-surface)]">
                    <div className="flex items-center justify-between gap-3 border-b border-alpha-border px-3.5 py-3">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] alpha-text-muted">Wallets</p>
                      <span className="rounded-full border border-alpha-border bg-[color:var(--alpha-hover-soft)] px-2 py-0.5 text-[9px] uppercase tracking-[0.14em] alpha-text-muted">
                        {projectWallets.length} visible
                      </span>
                    </div>
                    {projectWallets.length === 0 ? (
                      <div className="px-3 py-8 text-center text-sm alpha-text-muted">
                        No wallet matches this view.
                      </div>
                    ) : (
                      <div className="divide-y divide-[color:var(--alpha-border)]">
                      {projectWallets.map((wallet) => (
                        <div
                          key={wallet.id}
                          className="p-3.5 transition-colors hover:bg-[color:var(--alpha-hover-soft)]"
                        >
                          <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
                            <div className="min-w-0 space-y-2">
                              <p className="truncate text-sm font-semibold alpha-text">
                                {wallet.label || 'Unlabeled wallet'}
                              </p>
                              <p className="break-all font-mono text-xs leading-5 alpha-text" title={wallet.address}>
                                {wallet.address}
                              </p>
                              <div className="flex flex-wrap items-center gap-2">
                                {wallet.network ? (
                                  <span className="rounded-full border border-alpha-border bg-[color:var(--alpha-hover-soft)] px-2.5 py-1 text-[9px] uppercase tracking-[0.14em] alpha-text-muted">
                                    {wallet.network}
                                  </span>
                                ) : (
                                  <span className="rounded-full border border-alpha-border bg-[color:var(--alpha-hover-soft)] px-2.5 py-1 text-[9px] uppercase tracking-[0.14em] alpha-text-muted">
                                    No network
                                  </span>
                                )}
                                <span className="rounded-full border border-alpha-border bg-[color:var(--alpha-hover-soft)] px-2.5 py-1 text-[9px] uppercase tracking-[0.14em] alpha-text-muted">
                                  Created {formatWalletCreatedAt(wallet.createdAt)}
                                </span>
                                <span className="rounded-full border border-alpha-border bg-[color:var(--alpha-hover-soft)] px-2.5 py-1 text-[9px] uppercase tracking-[0.14em] alpha-text-muted">
                                  {wallet.archived ? 'Archived' : 'Active'}
                                </span>
                              </div>
                              {wallet.notes ? (
                                <p className="mt-2 line-clamp-2 text-xs leading-5 alpha-text-muted">{wallet.notes}</p>
                              ) : null}
                            </div>

                            <div className="flex shrink-0 flex-wrap items-center gap-2 lg:justify-end">
                              <Button
                                type="button"
                                variant="ghost"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  copyWallet(wallet);
                                }}
                                className="h-8 rounded-[0.8rem] border border-alpha-border bg-[color:var(--alpha-surface)] px-2.5 text-xs alpha-text-muted hover:bg-[color:var(--alpha-hover-soft)] hover:text-[color:var(--alpha-text)]"
                                title="Copy address"
                              >
                                {copiedId === wallet.id ? <Check className="mr-1.5 h-3.5 w-3.5" /> : <Copy className="mr-1.5 h-3.5 w-3.5" />}
                                Copy
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  openEditWallet(wallet);
                                }}
                                className="h-8 rounded-[0.8rem] border border-alpha-border bg-[color:var(--alpha-surface)] px-2.5 text-xs alpha-text-muted hover:bg-[color:var(--alpha-hover-soft)] hover:text-[color:var(--alpha-text)]"
                                title="Edit wallet"
                              >
                                <Edit3 className="mr-1.5 h-3.5 w-3.5" />
                                Edit
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  requestDeleteWallet(wallet);
                                }}
                                className="h-8 rounded-[0.8rem] border border-alpha-border bg-[color:var(--alpha-surface)] px-2.5 text-xs alpha-text-muted hover:bg-[color:var(--alpha-danger-soft)] hover:text-[color:var(--alpha-danger)]"
                                title="Delete wallet"
                              >
                                <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                                Delete
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                      </div>
                    )}
                  </div>
                  ) : null}
                </article>
              );
            })}
          </section>
        )}
      </main>

      <Dialog open={walletDialogOpen} onOpenChange={(open) => {
        setWalletDialogOpen(open);
        if (!open) resetForm();
      }}>
        <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-[1.2rem] border-alpha-border bg-[color:var(--alpha-panel)] text-[color:var(--alpha-text)] sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{form.id ? 'Edit Wallet' : 'Add Wallet'}</DialogTitle>
            <DialogDescription className="alpha-text-muted">
              Wallet data is stored in the shared wallets table and updates project statistics automatically.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={submitWallet} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 sm:col-span-2">
                <span className="text-xs font-medium uppercase tracking-[0.16em] alpha-text-muted">Project</span>
                <Select value={form.projectId} onValueChange={(projectId) => setForm((prev) => ({ ...prev, projectId }))}>
                  <SelectTrigger className="h-11 w-full rounded-[0.9rem] border-alpha-border bg-[color:var(--alpha-surface)] alpha-text">
                    <SelectValue placeholder="Select project" />
                  </SelectTrigger>
                  <SelectContent className="macos-popover border-alpha-border bg-[color:var(--alpha-panel)]">
                    {projects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.projectName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </label>

              <label className="space-y-2 sm:col-span-2">
                <span className="text-xs font-medium uppercase tracking-[0.16em] alpha-text-muted">Wallet Address</span>
                <Input
                  value={form.address}
                  onChange={(event) => setForm((prev) => ({ ...prev, address: event.target.value }))}
                  placeholder="0x..."
                  className="h-11 rounded-[0.9rem] border-alpha-border bg-[color:var(--alpha-surface)] font-mono"
                  required
                />
              </label>

              <label className="space-y-2">
                <span className="text-xs font-medium uppercase tracking-[0.16em] alpha-text-muted">Label</span>
                <Input
                  value={form.label}
                  onChange={(event) => setForm((prev) => ({ ...prev, label: event.target.value }))}
                  placeholder="Main wallet"
                  className="h-11 rounded-[0.9rem] border-alpha-border bg-[color:var(--alpha-surface)]"
                />
              </label>

              <label className="space-y-2">
                <span className="text-xs font-medium uppercase tracking-[0.16em] alpha-text-muted">Network</span>
                <Select value={form.network} onValueChange={(network) => setForm((prev) => ({ ...prev, network }))}>
                  <SelectTrigger className="h-11 w-full rounded-[0.9rem] border-alpha-border bg-[color:var(--alpha-surface)] alpha-text">
                    <SelectValue placeholder="Select network" />
                  </SelectTrigger>
                  <SelectContent className="macos-popover border-alpha-border bg-[color:var(--alpha-panel)]">
                    {networkOptions.map((network) => (
                      <SelectItem key={network} value={network}>
                        {network}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </label>

              <label className="space-y-2 sm:col-span-2">
                <span className="text-xs font-medium uppercase tracking-[0.16em] alpha-text-muted">Notes</span>
                <Textarea
                  value={form.notes}
                  onChange={(event) => setForm((prev) => ({ ...prev, notes: event.target.value }))}
                  placeholder="Airdrop role, usage plan, or wallet context..."
                  className="min-h-24 rounded-[0.9rem] border-alpha-border bg-[color:var(--alpha-surface)]"
                />
              </label>

              <button
                type="button"
                onClick={() => setForm((prev) => ({ ...prev, archived: !prev.archived }))}
                className={cn(
                  'flex items-center justify-between rounded-[0.9rem] border border-alpha-border bg-[color:var(--alpha-surface)] px-3 py-3 text-left transition-colors sm:col-span-2',
                  form.archived && 'bg-[color:var(--alpha-hover-soft)]'
                )}
              >
                <span>
                  <span className="block text-sm font-semibold alpha-text">Archive wallet</span>
                  <span className="block text-xs alpha-text-muted">Archived wallets stay stored but leave the active count.</span>
                </span>
                <span className={cn('flex h-5 w-5 items-center justify-center rounded border border-alpha-border', form.archived && 'bg-[color:var(--alpha-signal)] text-[color:var(--alpha-accent-contrast)]')}>
                  {form.archived ? <Check className="h-3.5 w-3.5" /> : null}
                </span>
              </button>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setWalletDialogOpen(false)}
                className="rounded-[0.9rem] border-alpha-border"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting || !form.projectId || !form.address.trim()}
                className="rounded-[0.9rem] bg-[color:var(--alpha-signal)] text-[color:var(--alpha-accent-contrast)] hover:bg-[color:var(--alpha-signal-press)]"
              >
                {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                {form.id ? 'Save Wallet' : 'Add Wallet'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="rounded-[1.15rem] border-alpha-border bg-[color:var(--alpha-panel)] text-[color:var(--alpha-text)]">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete wallet?</AlertDialogTitle>
            <AlertDialogDescription className="alpha-text-muted">
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-[0.9rem] border-alpha-border">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteWallet}
              className="rounded-[0.9rem] bg-[color:var(--alpha-danger)] text-white hover:bg-[color:var(--alpha-danger)]"
            >
              <X className="mr-2 h-4 w-4" />
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
