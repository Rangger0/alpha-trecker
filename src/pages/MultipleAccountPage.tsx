// MultipleAccountPage.tsx
import { useState, useEffect, useMemo, useCallback, type CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import { useTheme } from '@/contexts/ThemeContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  ArrowUpRight,
  BadgeCheck,
  Layers3,
  Search, 
  Users, 
  Plus, 
  Trash2, 
  X,
  ChevronDown,
  Wallet,
  Loader2
} from 'lucide-react';
import { useAirdrops } from '@/hooks/use-airdrops';
import { supabase } from '@/lib/supabase';
import type { Airdrop } from '@/types';

interface WalletEntry {
  id: string;
  address: string;
  label?: string;
}

interface AccountEntry {
  id: string;
  projectId: string;
  projectName: string;
  projectLogo?: string;
  type: string;
  status: string;
  wallets: WalletEntry[];
  createdAt: string;
}

interface MultiAccountRow {
  id: string;
  project_id: string;
  project_name: string;
  project_logo?: string | null;
  type: string;
  status: string;
  wallet_address: string;
  wallet_label?: string | null;
  created_at: string;
}

type MacDelayStyle = CSSProperties & {
  '--mac-delay': string;
};

const formatWallet = (address: string) => {
  if (!address) return '';
  if (address.length <= 12) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

const getAccentColor = (index: number) => {
  const colors = [
    'var(--alpha-signal)',
    'var(--alpha-warning)',
    'var(--alpha-danger)',
    'var(--alpha-info)',
    'var(--alpha-signal)',
    'var(--alpha-warning)',
    'var(--alpha-danger)',
    'var(--alpha-info)',
  ];
  return colors[index % colors.length];
};

const formatCreatedAt = (value: string) =>
  new Date(value).toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

export function MultipleAccountPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { airdrops } = useAirdrops();
  const [searchQuery, setSearchQuery] = useState('');
  const [logoError, setLogoError] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [accounts, setAccounts] = useState<AccountEntry[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Airdrop | null>(null);
  const [showProjectDropdown, setShowProjectDropdown] = useState(false);
  const [walletEntries, setWalletEntries] = useState<{ address: string; label: string }[]>([{ address: '', label: '' }]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setCurrentUserId(user.id);
    };
    getUser();
  }, []);

  const fetchAccounts = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('multi_accounts')
        .select('*')
        .eq('user_id', currentUserId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const rows = (data ?? []) as MultiAccountRow[];
      const grouped = rows.reduce((acc: Record<string, AccountEntry>, item) => {
        if (!acc[item.project_id]) {
          acc[item.project_id] = {
            id: item.project_id,
            projectId: item.project_id,
            projectName: item.project_name,
            projectLogo: item.project_logo ?? undefined,
            type: item.type,
            status: item.status,
            wallets: [],
            createdAt: item.created_at };
        }
        acc[item.project_id].wallets.push({
          id: item.id,
          address: item.wallet_address,
          label: item.wallet_label ?? undefined });
        return acc;
      }, {});

      setAccounts(Object.values(grouped));
    } catch (error) {
      console.error('Error fetching accounts:', error);
    } finally {
      setIsLoading(false);
    }
  }, [currentUserId]);

  useEffect(() => {
    if (currentUserId) {
      fetchAccounts();
    }
  }, [currentUserId, fetchAccounts]);

  const handleLogoError = (id: string) => {
    setLogoError(prev => ({ ...prev, [id]: true }));
  };

  const filteredAccounts = accounts.filter((account) =>
    account.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    account.wallets.some(w => 
      w.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.label?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );
  const totalWallets = useMemo(
    () => accounts.reduce((acc, account) => acc + account.wallets.length, 0),
    [accounts]
  );
  const labeledWallets = useMemo(
    () => accounts.reduce((acc, account) => acc + account.wallets.filter((wallet) => Boolean(wallet.label)).length, 0),
    [accounts]
  );
  const activeTypes = useMemo(
    () => new Set(accounts.map((account) => account.type).filter(Boolean)).size,
    [accounts]
  );
  const focusAccount = useMemo(() => {
    return [...filteredAccounts].sort((left, right) => {
      if (right.wallets.length !== left.wallets.length) {
        return right.wallets.length - left.wallets.length;
      }
      return new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime();
    })[0] ?? null;
  }, [filteredAccounts]);

  const addWalletField = () => setWalletEntries([...walletEntries, { address: '', label: '' }]);
  
  const removeWalletField = (index: number) => {
    if (walletEntries.length > 1) setWalletEntries(walletEntries.filter((_, i) => i !== index));
  };

  const updateWalletField = (index: number, field: 'address' | 'label', value: string) => {
    const newEntries = [...walletEntries];
    newEntries[index][field] = value;
    setWalletEntries(newEntries);
  };

  const handleAdd = async () => {
    if (!selectedProject || !currentUserId) return;
    const validWallets = walletEntries.filter(w => w.address.trim() !== '');
    if (validWallets.length === 0) return;

    setIsSubmitting(true);
    try {
      const inserts = validWallets.map(wallet => ({
        user_id: currentUserId,
        project_id: selectedProject.id,
        project_name: selectedProject.projectName,
        project_logo: selectedProject.projectLogo,
        type: selectedProject.type,
        status: selectedProject.status,
        wallet_address: wallet.address.trim(),
        wallet_label: wallet.label.trim() || null }));

      const { error } = await supabase.from('multi_accounts').insert(inserts);
      if (error) throw error;

      await fetchAccounts();
      setIsAddModalOpen(false);
      setSelectedProject(null);
      setWalletEntries([{ address: '', label: '' }]);
    } catch (error) {
      console.error('Error adding accounts:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (walletId: string) => {
    if (!confirm('Delete this wallet?')) return;
    try {
      const { error } = await supabase
        .from('multi_accounts')
        .delete()
        .eq('id', walletId)
        .eq('user_id', currentUserId);
      if (error) throw error;
      await fetchAccounts();
    } catch (error) {
      console.error('Error deleting wallet:', error);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm('Delete all wallets for this project?')) return;
    try {
      const { error } = await supabase
        .from('multi_accounts')
        .delete()
        .eq('project_id', projectId)
        .eq('user_id', currentUserId);
      if (error) throw error;
      await fetchAccounts();
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout disableMonochrome>
        <div className="flex items-center justify-center h-64">
          <Loader2 className={`w-8 h-8 animate-spin ${isDark ? 'text-[var(--alpha-signal)]' : 'text-[var(--alpha-signal)]'}`} />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout disableMonochrome>
      <div className="macos-root macos-page-shell">
        <div className="macos-page-header macos-animate-up">
          <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_420px] xl:items-end">
            <div>
              <div className="macos-page-kicker">
                <Users className="h-3.5 w-3.5" />
                Wallet Matrix
              </div>
              <h1 className="macos-page-title">Multiple Account Management</h1>
              <p className="macos-page-subtitle">
               
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full border border-alpha-border bg-[color:var(--alpha-hover-soft)] px-3 py-1 text-[10px] uppercase tracking-[0.16em] alpha-text-muted">
                  {totalWallets} wallets managed
                </span>
                <span className="rounded-full border border-alpha-border bg-[color:var(--alpha-hover-soft)] px-3 py-1 text-[10px] uppercase tracking-[0.16em] alpha-text-muted">
                  {accounts.length} active projects
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Wallets tracked', value: totalWallets, icon: Wallet },
                { label: 'Projects linked', value: accounts.length, icon: Layers3 },
                { label: 'Labeled wallets', value: labeledWallets, icon: BadgeCheck },
                { label: 'Project types', value: activeTypes, icon: Users },
              ].map((card, index) => {
                const Icon = card.icon;
                return (
                  <div
                    key={card.label}
                    className="macos-card macos-card-entry rounded-[1.2rem] px-4 py-3"
                    style={{ '--mac-delay': `${index * 40}ms` } as MacDelayStyle}
                  >
                    <div className="flex items-center justify-between gap-3">
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

        {focusAccount ? (
          <section
            className="mb-5 overflow-hidden rounded-[1.55rem] border p-5"
            style={{
              borderColor: 'var(--alpha-border)',
              background: `linear-gradient(135deg, color-mix(in srgb, ${getAccentColor(0)} 12%, var(--alpha-surface)), var(--alpha-surface))`,
              boxShadow: `0 20px 40px color-mix(in srgb, ${getAccentColor(0)} 10%, transparent)`,
            }}
          >
            <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px] xl:items-end">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-alpha-border bg-[color:var(--alpha-hover-soft)] px-3 py-1 text-[10px] uppercase tracking-[0.2em] alpha-text-muted">
                  <BadgeCheck className="h-3.5 w-3.5 text-gold" />
                  Focus wallet desk
                </div>

                <div className="mt-4 flex items-start gap-4">
                  <div
                    className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-[1rem] border shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
                    style={{
                      borderColor: 'var(--alpha-border)',
                      background: 'color-mix(in srgb, var(--alpha-surface-soft) 92%, transparent)',
                    }}
                  >
                    {focusAccount.projectLogo && !logoError[focusAccount.projectId] ? (
                      <img
                        src={focusAccount.projectLogo}
                        alt={focusAccount.projectName}
                        className="h-9 w-9 object-cover"
                        onError={() => handleLogoError(focusAccount.projectId)}
                      />
                    ) : (
                      <span className="text-lg font-semibold" style={{ color: getAccentColor(0) }}>
                        {focusAccount.projectName[0]?.toUpperCase()}
                      </span>
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-2xl font-semibold alpha-text">{focusAccount.projectName}</h2>
                      <span
                        className="rounded-full border px-2.5 py-1 text-[10px] uppercase tracking-[0.18em]"
                        style={{
                          color: getAccentColor(0),
                          borderColor: `color-mix(in srgb, ${getAccentColor(0)} 38%, var(--alpha-border))`,
                          background: `color-mix(in srgb, ${getAccentColor(0)} 14%, transparent)`,
                        }}
                      >
                        {focusAccount.type}
                      </span>
                    </div>
                    <p className="mt-1.5 max-w-2xl text-sm leading-6 alpha-text-muted">
                     
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {focusAccount.wallets.slice(0, 4).map((wallet) => (
                        <span
                          key={wallet.id}
                          className="rounded-full border border-alpha-border bg-[color:var(--alpha-hover-soft)] px-3 py-1 text-[10px] uppercase tracking-[0.16em] alpha-text-muted"
                        >
                          {wallet.label || formatWallet(wallet.address)}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Wallets', value: focusAccount.wallets.length },
                  { label: 'Labeled', value: focusAccount.wallets.filter((wallet) => Boolean(wallet.label)).length },
                  { label: 'Status', value: focusAccount.status || 'Tracked' },
                  { label: 'Added', value: formatCreatedAt(focusAccount.createdAt) },
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
        ) : null}

        <div className="mb-6 macos-card rounded-[1.35rem] p-4">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <label className="relative group flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 alpha-text-muted transition-colors group-focus-within:text-[var(--alpha-signal)]" />
              <Input 
                placeholder="Search projects or wallets..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-11 rounded-[1rem] border-[color:var(--alpha-border)] bg-[color:var(--alpha-surface)] pl-10 font-mono"
              />
            </label>

            <div className="flex items-center gap-3 xl:min-w-[280px] xl:justify-end">
              <div className="rounded-full border border-alpha-border bg-[color:var(--alpha-hover-soft)] px-3 py-1 text-[10px] uppercase tracking-[0.18em] alpha-text-muted">
                {filteredAccounts.length} project cards
              </div>
              <Button
                onClick={() => setIsAddModalOpen(true)}
                className={`rounded-[0.95rem] font-mono border-2 transition-all duration-200 ${
                  isDark 
                    ? 'bg-[var(--alpha-signal)] text-[var(--alpha-accent-contrast)] border-[var(--alpha-signal)] hover:bg-[var(--alpha-signal-press)]' 
                    : 'bg-[var(--alpha-signal)] text-[var(--alpha-accent-contrast)] border-[var(--alpha-signal)] hover:bg-[var(--alpha-signal-press)]'
                }`}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Account
              </Button>
            </div>
          </div>
        </div>

        {filteredAccounts.length === 0 ? (
          <div className="macos-empty-state py-16 text-center">
            <Users className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-[var(--alpha-text)]' : 'text-[var(--alpha-text)]'}`} />
            <h3 className={`font-mono font-bold mb-2 ${isDark ? 'text-[var(--alpha-text)]' : 'text-[var(--alpha-text)]'}`}>
              No accounts found
            </h3>
            <p className={`font-mono text-sm mb-4 ${isDark ? 'text-[var(--alpha-text-muted)]' : 'text-[var(--alpha-text-muted)]'}`}>
              Add your first account to track multiple entries.
            </p>
            <Button
              onClick={() => setIsAddModalOpen(true)}
              className={`font-mono border-2 ${
                isDark 
                  ? 'bg-[var(--alpha-signal)] text-[var(--alpha-accent-contrast)] border-[var(--alpha-signal)]' 
                  : 'bg-[var(--alpha-signal)] text-[var(--alpha-accent-contrast)] border-[var(--alpha-signal)]'
              }`}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Account
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2 2xl:grid-cols-3">
            {filteredAccounts.map((account, index) => {
              const accent = getAccentColor(index);
              
              return (
                <div
                  key={account.projectId}
                  className="group relative overflow-hidden rounded-[1.45rem] border p-5 transition-all duration-200 hover:-translate-y-0.5"
                  style={{
                    borderColor: 'var(--alpha-border)',
                    background: `linear-gradient(160deg, color-mix(in srgb, ${accent} 11%, var(--alpha-surface)), var(--alpha-surface))`,
                    boxShadow: `0 18px 34px color-mix(in srgb, ${accent} 10%, transparent)`,
                    '--mac-delay': `${index * 24}ms`,
                  } as MacDelayStyle}
                >
                  <div
                    className="pointer-events-none absolute inset-x-0 top-0 h-24 opacity-70"
                    style={{
                      background: `linear-gradient(135deg, color-mix(in srgb, ${accent} 22%, transparent), transparent 74%)`
                    }}
                  />

                  <div className="relative z-10">
                    <div className="flex items-start gap-4">
                      <div 
                        className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-[1rem] border transition-transform duration-300 group-hover:scale-[1.05]"
                        style={{
                          background: 'color-mix(in srgb, var(--alpha-surface-soft) 92%, transparent)',
                          borderColor: 'var(--alpha-border)',
                        }}
                      >
                        {account.projectLogo && !logoError[account.projectId] ? (
                          <img 
                            src={account.projectLogo} 
                            alt={account.projectName}
                            className="w-full h-full object-cover"
                            onError={() => handleLogoError(account.projectId)}
                          />
                        ) : (
                          <div 
                            className="w-full h-full flex items-center justify-center font-bold text-xl"
                            style={{ color: accent }}
                          >
                            {account.projectName[0].toUpperCase()}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-xl font-semibold alpha-text">{account.projectName}</h3>
                          <ArrowUpRight className="h-4 w-4 opacity-0 transition-opacity duration-150 group-hover:opacity-100" style={{ color: accent }} />
                          <span 
                            className="rounded-full border px-2.5 py-1 text-[10px] uppercase tracking-[0.18em]"
                            style={{
                              color: accent,
                              borderColor: `color-mix(in srgb, ${accent} 40%, var(--alpha-border))`,
                              background: `color-mix(in srgb, ${accent} 14%, transparent)`,
                            }}
                          >
                            {account.type}
                          </span>
                          <span className="rounded-full border border-alpha-border bg-[color:var(--alpha-hover-soft)] px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] alpha-text-muted">
                            {account.wallets.length} wallets
                          </span>
                        </div>

                        <p className="mt-1 text-[11px] uppercase tracking-[0.18em] alpha-text-muted">
                          {account.status || 'Tracked'} • added {formatCreatedAt(account.createdAt)}
                        </p>
                      </div>

                      <button
                        onClick={() => handleDeleteProject(account.projectId)}
                        className={`p-2 rounded-lg transition-colors opacity-0 group-hover:opacity-100 ${
                          isDark 
                            ? 'text-[var(--alpha-text-muted)] hover:text-[var(--alpha-danger)] hover:bg-[var(--alpha-danger-soft)]' 
                            : 'text-[var(--alpha-text-muted)] hover:text-[var(--alpha-danger)] hover:bg-[var(--alpha-danger-soft)]'
                        }`}
                        title="Delete all wallets"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div className="rounded-[1rem] border border-alpha-border bg-[color:var(--alpha-hover-soft)] px-3 py-3">
                        <p className="text-[10px] uppercase tracking-[0.18em] alpha-text-muted">Wallet slots</p>
                        <p className="mt-2 text-lg font-semibold alpha-text">{account.wallets.length}</p>
                      </div>
                      <div className="rounded-[1rem] border border-alpha-border bg-[color:var(--alpha-hover-soft)] px-3 py-3">
                        <p className="text-[10px] uppercase tracking-[0.18em] alpha-text-muted">Labels active</p>
                        <p className="mt-2 text-lg font-semibold alpha-text">
                          {account.wallets.filter((wallet) => Boolean(wallet.label)).length}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {account.wallets.map((wallet, idx) => (
                        <div 
                          key={wallet.id}
                          className="group/wallet flex items-center justify-between rounded-[1rem] border border-alpha-border bg-[color:var(--alpha-hover-soft)] px-3 py-3 transition-colors duration-150 hover:border-[color:var(--alpha-border-strong)]"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <div 
                              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[0.7rem] text-[10px] font-mono font-bold"
                              style={{
                                background: `color-mix(in srgb, ${accent} 16%, transparent)`,
                                color: accent,
                              }}
                            >
                              #{idx + 1}
                            </div>
                            <div className="min-w-0">
                              {wallet.label && (
                                <p className="text-[10px] uppercase tracking-[0.16em]" style={{ color: accent }}>
                                  {wallet.label}
                                </p>
                              )}
                              <p className="font-mono text-sm alpha-text truncate">
                                {formatWallet(wallet.address)}
                              </p>
                            </div>
                          </div>
                          
                          <button
                            onClick={() => handleDelete(wallet.id)}
                            className={`p-1.5 rounded-lg transition-colors opacity-0 group-hover/wallet:opacity-100 ${
                              isDark 
                                ? 'text-[var(--alpha-text-muted)] hover:text-[var(--alpha-danger)] hover:bg-[var(--alpha-danger-soft)]' 
                                : 'text-[var(--alpha-text-muted)] hover:text-[var(--alpha-danger)] hover:bg-[var(--alpha-danger-soft)]'
                            }`}
                            title="Delete wallet"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-3 text-[11px] alpha-text-muted">
                      <span>{account.wallets.length > 1 ? 'Split wallet setup' : 'Single wallet setup'}</span>
                      <span style={{ color: accent }}>Project cluster</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Account Modal */}
      {isAddModalOpen && typeof document !== 'undefined' &&
        createPortal(
          <div
            className="fixed inset-0 z-[140] overflow-y-auto bg-black/45 px-4 py-5 sm:px-6 sm:py-8"
            onClick={() => setIsAddModalOpen(false)}
          >
            <div className="flex min-h-full items-start justify-center sm:items-center">
              <div
                className={`flex w-full max-w-lg flex-col overflow-hidden rounded-[2rem] border shadow-2xl ${
                  isDark
                    ? 'bg-[color:color-mix(in_srgb,var(--alpha-panel)_96%,transparent)] border-[var(--alpha-signal-border)]'
                    : 'bg-[color:color-mix(in_srgb,var(--alpha-panel)_96%,transparent)] border-[var(--alpha-border)]'
                } max-h-[calc(100dvh-2.5rem)] sm:max-h-[calc(100dvh-4rem)]`}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex flex-shrink-0 items-center justify-between border-b px-6 py-5"
                  style={{ borderColor: 'var(--alpha-border)' }}
                >
                  <h2 className="text-xl font-mono font-bold text-[var(--alpha-signal)]">
                    Add Account
                  </h2>
                  <button
                    onClick={() => setIsAddModalOpen(false)}
                    className="rounded p-1 text-[var(--alpha-text-muted)] hover:text-[var(--alpha-signal)]"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
                  {/* Project Selector */}
                  <div className="space-y-2">
                    <label className="font-mono text-sm text-[var(--alpha-signal)]">
                      Select Project *
                    </label>
                    <div className="relative">
                      <button
                        onClick={() => setShowProjectDropdown(!showProjectDropdown)}
                        className={`w-full flex items-center justify-between p-3 rounded border-2 font-mono ${
                          isDark 
                            ? 'bg-[var(--alpha-surface)] border-[var(--alpha-signal-border)] text-[var(--alpha-signal)]' 
                            : 'bg-[var(--alpha-surface)] border-[var(--alpha-border)] text-[var(--alpha-text)]'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {selectedProject ? (
                            <>
                              {selectedProject.projectLogo ? (
                                <img src={selectedProject.projectLogo} alt="" className="w-6 h-6 rounded object-cover" />
                              ) : (
                                <div className="w-6 h-6 rounded bg-[var(--alpha-surface-strong)]" />
                              )}
                              <span>{selectedProject.projectName}</span>
                            </>
                          ) : (
                            <span className="text-[var(--alpha-text-muted)]">Choose a project...</span>
                          )}
                        </div>
                        <ChevronDown className={`w-4 h-4 transition-transform ${showProjectDropdown ? 'rotate-180' : ''}`} />
                      </button>

                      {showProjectDropdown && (
                        <div className={`absolute top-full left-0 right-0 mt-1 max-h-60 overflow-y-auto rounded border-2 z-50 ${
                          isDark
                            ? 'bg-[var(--alpha-surface)] border-[var(--alpha-signal-border)]'
                            : 'bg-[var(--alpha-panel)] border-[var(--alpha-border)]'
                        }`}>
                          {airdrops.length === 0 ? (
                            <div className="p-3 text-center font-mono text-sm text-[var(--alpha-text-muted)]">
                              No projects available
                            </div>
                          ) : (
                            airdrops.map(project => (
                              <button
                                key={project.id}
                                onClick={() => {
                                  setSelectedProject(project);
                                  setShowProjectDropdown(false);
                                }}
                                className={`w-full flex items-center gap-3 p-3 text-left transition-colors ${
                                  isDark 
                                    ? 'hover:bg-[var(--alpha-signal-soft)] text-[var(--alpha-signal)]' 
                                    : 'hover:bg-[var(--alpha-hover-soft)] text-[var(--alpha-text)]'
                                }`}
                              >
                                {project.projectLogo ? (
                                  <img src={project.projectLogo} alt="" className="w-8 h-8 rounded object-cover" />
                                ) : (
                                  <div className="w-8 h-8 rounded bg-[var(--alpha-surface-strong)]" />
                                )}
                                <div>
                                  <p className="font-mono font-bold text-sm">{project.projectName}</p>
                                  <p className="font-mono text-xs text-[var(--alpha-text-muted)]">{project.type}</p>
                                </div>
                              </button>
                            ))
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Multiple  Entries */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="font-mono text-sm text-[var(--alpha-signal)]">
                         Addresses *
                      </label>
                      <span className="text-xs font-mono text-[var(--alpha-text-muted)]">
                        {walletEntries.length} wallet(s)
                      </span>
                    </div>

                    <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                      {walletEntries.map((entry, index) => (
                        <div 
                          key={index} 
                          className={`p-4 rounded-lg border-2 space-y-3 relative ${
                            isDark 
                              ? 'bg-[var(--alpha-surface)] border-[var(--alpha-border)]' 
                              : 'bg-[var(--alpha-surface)] border-[var(--alpha-border)]'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className={`text-xs font-mono font-bold ${isDark ? 'text-[var(--alpha-signal)]' : 'text-[var(--alpha-signal)]'}`}>
                               #{index + 1}
                            </span>
                            {walletEntries.length > 1 && (
                              <button
                                onClick={() => removeWalletField(index)}
                                className={`p-1 rounded transition-colors ${
                                  isDark 
                                    ? 'text-[var(--alpha-text-muted)] hover:text-[var(--alpha-danger)]' 
                                    : 'text-[var(--alpha-text-muted)] hover:text-[var(--alpha-danger)]'
                                }`}
                              >
                                <X className="w-4 h-4" />
                              </button>
                            )}
                          </div>

                          <div>
                            <label className="block text-xs font-mono mb-1 text-[var(--alpha-text-muted)]">
                              Label (Optional)
                            </label>
                            <Input
                              placeholder="e.g., Main Account, Backup, etc."
                              value={entry.label}
                              onChange={(e) => updateWalletField(index, 'label', e.target.value)}
                              className={`font-mono text-sm border-2 ${
                                isDark 
                                  ? 'bg-[var(--alpha-surface)] border-[var(--alpha-signal-border)] text-[var(--alpha-signal)] placeholder:text-[var(--alpha-text-muted)]' 
                                  : 'bg-[var(--alpha-surface)] border-[var(--alpha-border)] text-[var(--alpha-text)] placeholder:text-[var(--alpha-text-muted)]'
                              }`}
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-mono mb-1 text-[var(--alpha-text-muted)]">
                              Address *
                            </label>
                            <Input
                              placeholder="0x..."
                              value={entry.address}
                              onChange={(e) => updateWalletField(index, 'address', e.target.value)}
                              className={`font-mono text-sm border-2 ${
                                isDark 
                                  ? 'bg-[var(--alpha-surface)] border-[var(--alpha-signal-border)] text-[var(--alpha-signal)] placeholder:text-[var(--alpha-text-muted)]' 
                                  : 'bg-[var(--alpha-surface)] border-[var(--alpha-border)] text-[var(--alpha-text)] placeholder:text-[var(--alpha-text-muted)]'
                              }`}
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    <Button
                      type="button"
                      onClick={addWalletField}
                      variant="outline"
                      className={`w-full font-mono border-2 border-dashed ${
                        isDark 
                          ? 'border-[var(--alpha-signal-border)] text-[var(--alpha-signal)] hover:bg-[var(--alpha-signal-soft)] hover:border-[var(--alpha-signal)]' 
                          : 'border-[var(--alpha-border)] text-[var(--alpha-text-muted)] hover:bg-[var(--alpha-hover-soft)] hover:border-[var(--alpha-border-strong)]'
                      }`}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Another 
                    </Button>
                  </div>
                </div>

                <div
                  className="flex flex-shrink-0 justify-end gap-3 border-t border-dashed px-6 py-4"
                  style={{ borderColor: isDark ? 'var(--alpha-border)' : 'rgba(156, 163, 175, 0.45)' }}
                >
                  <Button 
                    variant="outline" 
                    onClick={() => setIsAddModalOpen(false)}
                    disabled={isSubmitting}
                  className={`font-mono border-2 ${
                    isDark 
                      ? 'border-[var(--alpha-signal)] text-[var(--alpha-signal)] hover:bg-[var(--alpha-signal-soft)]' 
                      : 'border-[var(--alpha-border)] text-[var(--alpha-text)] hover:bg-[var(--alpha-hover-soft)]'
                    }`}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleAdd}
                    disabled={!selectedProject || walletEntries.every(w => !w.address.trim()) || isSubmitting}
                  className={`font-mono border-2 ${
                    isDark 
                        ? 'bg-[var(--alpha-signal)] text-[var(--alpha-accent-contrast)] border-[var(--alpha-signal)] hover:bg-[var(--alpha-signal-press)]' 
                        : 'bg-[var(--alpha-signal)] text-[var(--alpha-accent-contrast)] border-[var(--alpha-signal)] hover:bg-[var(--alpha-signal-press)]'
                    }`}
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Plus className="w-4 h-4 mr-2" />
                    )}
                    Add {walletEntries.filter(w => w.address.trim()).length} Account(s)
                  </Button>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </DashboardLayout>
  );
}
