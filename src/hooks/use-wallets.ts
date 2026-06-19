import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { getWalletBalance } from '@/services/wallet';
import { useAuth } from '@/contexts/AuthContext';

export const WALLETS_SYNC_EVENT = 'alpha-wallets-sync';

export interface Wallet {
  id: string;
  address: string;
  projectId?: string;
  projectName?: string;
  walletAddress: string; // alias untuk compatibility
  label?: string;
  notes?: string;
  network?: string;
  archived?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

type WalletRow = {
  id: string;
  user_id?: string;
  project_id?: string | null;
  project_name?: string | null;
  address?: string | null;
  wallet_address?: string | null;
  label?: string | null;
  wallet_label?: string | null;
  notes?: string | null;
  network?: string | null;
  archived?: boolean | null;
  created_at?: string | null;
  updated_at?: string | null;
};

type WalletPayload = Record<string, string | boolean | undefined>;

const isSchemaCacheError = (error: unknown) => {
  if (!error || typeof error !== 'object') return false;
  const record = error as { code?: unknown; message?: unknown };
  const message = typeof record.message === 'string' ? record.message.toLowerCase() : '';

  return record.code === 'PGRST204' || message.includes('schema cache') || message.includes('column');
};

const compactPayload = (payload: WalletPayload) =>
  Object.fromEntries(Object.entries(payload).filter(([, value]) => value !== undefined));

const getSupabaseErrorMessage = (error: unknown) => {
  if (!error || typeof error !== 'object') return '';
  const record = error as { message?: unknown; details?: unknown; hint?: unknown; code?: unknown };
  return [record.message, record.details, record.hint, record.code]
    .filter((value): value is string => typeof value === 'string' && value.trim().length > 0)
    .join(' ');
};

async function runWalletInsert(payloads: WalletPayload[]) {
  let lastError: unknown = null;

  for (const payload of payloads) {
    const { error } = await supabase.from('wallets').insert([compactPayload(payload)]);

    if (!error) return;

    lastError = error;
    if (!isSchemaCacheError(error)) {
      const message = getSupabaseErrorMessage(error).toLowerCase();
      const canTryFallback =
        message.includes('column') ||
        message.includes('schema cache') ||
        message.includes('wallet_address') ||
        message.includes('address');

      if (!canTryFallback) break;
    }
  }

  throw lastError;
}

async function runWalletUpdate(id: string, userId: string, payloads: WalletPayload[]) {
  let lastError: unknown = null;

  for (const payload of payloads) {
    const { error } = await supabase
      .from('wallets')
      .update(compactPayload(payload))
      .eq('id', id)
      .eq('user_id', userId);

    if (!error) return;

    lastError = error;
    if (!isSchemaCacheError(error)) {
      const message = getSupabaseErrorMessage(error).toLowerCase();
      const canTryFallback =
        message.includes('column') ||
        message.includes('schema cache') ||
        message.includes('wallet_address') ||
        message.includes('address');

      if (!canTryFallback) break;
    }
  }

  throw lastError;
}

export function emitWalletsSync(detail?: { userId?: string }) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(WALLETS_SYNC_EVENT, { detail }));
}

const walletAddressFromRow = (row: WalletRow) => row.address || row.wallet_address || '';

const mapWalletRow = (row: WalletRow): Wallet => ({
  id: row.id,
  address: walletAddressFromRow(row),
  walletAddress: walletAddressFromRow(row),
  projectId: row.project_id ?? undefined,
  projectName: row.project_name ?? undefined,
  label: row.label ?? row.wallet_label ?? undefined,
  notes: row.notes ?? undefined,
  network: row.network ?? undefined,
  archived: Boolean(row.archived),
  createdAt: row.created_at ?? undefined,
  updatedAt: row.updated_at ?? undefined,
});

export function useWallets() {
  const { session } = useAuth();
  const user = session?.user;
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [balances, setBalances] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  // Load wallets from database
  const loadWallets = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('wallets')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const transformedWallets: Wallet[] = ((data || []) as WalletRow[]).map(mapWalletRow);

      setWallets(transformedWallets);
    } catch (error) {
      console.error('Failed to load wallets:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Load on mount
  useEffect(() => {
    loadWallets();
  }, [loadWallets]);

  useEffect(() => {
    if (!user || typeof window === 'undefined') return;

    const handleSync = (event: Event) => {
      const detail = (event as CustomEvent<{ userId?: string }>).detail;
      if (detail?.userId && detail.userId !== user.id) return;
      void loadWallets();
    };

    window.addEventListener(WALLETS_SYNC_EVENT, handleSync);
    return () => window.removeEventListener(WALLETS_SYNC_EVENT, handleSync);
  }, [loadWallets, user]);

  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel(`wallets:${user.id}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'wallets', filter: `user_id=eq.${user.id}` },
        () => {
          void loadWallets();
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [loadWallets, user]);

  // Add wallet to database
  const addWallet = useCallback(async (data: { 
    projectId: string; 
    projectName: string; 
    walletAddress: string;
    label?: string;
    notes?: string;
    network?: string;
    archived?: boolean;
  }) => {
    if (!user) throw new Error('Not authenticated');

    await runWalletInsert([
      {
        user_id: user.id,
        project_id: data.projectId,
        project_name: data.projectName,
        address: data.walletAddress,
        label: data.label,
        notes: data.notes,
        network: data.network,
        archived: Boolean(data.archived),
      },
      {
        user_id: user.id,
        project_id: data.projectId,
        address: data.walletAddress,
        label: data.label,
        notes: data.notes,
        network: data.network,
        archived: Boolean(data.archived),
      },
      {
        user_id: user.id,
        project_id: data.projectId,
        project_name: data.projectName,
        wallet_address: data.walletAddress,
        label: data.label,
      },
      {
        user_id: user.id,
        project_id: data.projectId,
        wallet_address: data.walletAddress,
        label: data.label,
      },
      {
        user_id: user.id,
        project_id: data.projectId,
        project_name: data.projectName,
        wallet_address: data.walletAddress,
        wallet_label: data.label,
      },
      {
        user_id: user.id,
        project_id: data.projectId,
        wallet_address: data.walletAddress,
        wallet_label: data.label,
      },
      {
        user_id: user.id,
        project_id: data.projectId,
        address: data.walletAddress,
      },
      {
        user_id: user.id,
        project_id: data.projectId,
        wallet_address: data.walletAddress,
      },
    ]);

    const newWallet: Wallet = {
      id: typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `${Date.now()}`,
      address: data.walletAddress,
      walletAddress: data.walletAddress,
      projectId: data.projectId,
      projectName: data.projectName,
      label: data.label,
      notes: data.notes,
      network: data.network,
      archived: Boolean(data.archived),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setWallets(prev => [newWallet, ...prev]);
    void loadWallets();
    emitWalletsSync({ userId: user.id });
    return newWallet;
  }, [loadWallets, user]);

  // Update wallet
  const updateWallet = useCallback(async (id: string, data: { 
    walletAddress?: string;
    label?: string;
    notes?: string;
    network?: string;
    archived?: boolean;
  }) => {
    if (!user) throw new Error('Not authenticated');

    const modernUpdateData: {
      updated_at: string;
      address?: string;
      label?: string;
      notes?: string;
      network?: string;
      archived?: boolean;
    } = {
      updated_at: new Date().toISOString(),
    };

    if (data.walletAddress) {
      modernUpdateData.address = data.walletAddress;
    }
    if (data.label !== undefined) {
      modernUpdateData.label = data.label;
    }
    if (data.notes !== undefined) {
      modernUpdateData.notes = data.notes;
    }
    if (data.network !== undefined) {
      modernUpdateData.network = data.network;
    }
    if (data.archived !== undefined) {
      modernUpdateData.archived = data.archived;
    }

    const legacyUpdateData: {
      updated_at: string;
      wallet_address?: string;
      label?: string;
      wallet_label?: string;
    } = {
      updated_at: modernUpdateData.updated_at,
    };

    if (data.walletAddress) {
      legacyUpdateData.wallet_address = data.walletAddress;
    }
    if (data.label !== undefined) {
      legacyUpdateData.label = data.label;
    }

    const walletLabelUpdateData = {
      ...legacyUpdateData,
      label: undefined,
      wallet_label: data.label,
    };

    const minimalAddressUpdateData: {
      updated_at: string;
      address?: string;
    } = {
      updated_at: modernUpdateData.updated_at,
    };

    if (data.walletAddress) {
      minimalAddressUpdateData.address = data.walletAddress;
    }

    const minimalLegacyAddressUpdateData: {
      updated_at: string;
      wallet_address?: string;
    } = {
      updated_at: modernUpdateData.updated_at,
    };

    if (data.walletAddress) {
      minimalLegacyAddressUpdateData.wallet_address = data.walletAddress;
    }

    await runWalletUpdate(id, user.id, [
      modernUpdateData,
      legacyUpdateData,
      walletLabelUpdateData,
      minimalAddressUpdateData,
      minimalLegacyAddressUpdateData,
    ]);

    setWallets(prev => prev.map(w => 
      w.id === id 
        ? { 
            ...w, 
            address: data.walletAddress ?? w.address,
            walletAddress: data.walletAddress ?? w.walletAddress,
            label: data.label ?? w.label,
            notes: data.notes ?? w.notes,
            network: data.network ?? w.network,
            archived: data.archived ?? w.archived,
            updatedAt: modernUpdateData.updated_at,
          }
        : w
    ));

    void loadWallets();
    emitWalletsSync({ userId: user.id });
  }, [loadWallets, user]);

  // Delete wallet
  const deleteWallet = useCallback(async (id: string) => {
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('wallets')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id); // Security: only delete own wallets

    if (error) throw error;

    setWallets(prev => prev.filter(w => w.id !== id));
    emitWalletsSync({ userId: user.id });
  }, [user]);

  // Legacy: remove wallet (local only, for backward compatibility)
  const removeWallet = useCallback((id: string) => {
    setWallets(prev => prev.filter(w => w.id !== id));
  }, []);

  // Get wallets by project
  const getWalletsByProject = useCallback((projectId: string) => {
    return wallets.filter(w => w.projectId === projectId);
  }, [wallets]);

  // Fetch balances
  const fetchBalances = useCallback(async () => {
    setLoading(true);
    try {
      const balancePromises = wallets.map(async (wallet) => {
        const balance = await getWalletBalance(wallet.address);
        return { address: wallet.address, balance };
      });
      
      const results = await Promise.all(balancePromises);
      const balanceMap: Record<string, string> = {};
      results.forEach(({ address, balance }) => {
        balanceMap[address] = balance;
      });
      setBalances(balanceMap);
    } finally {
      setLoading(false);
    }
  }, [wallets]);

  return {
    wallets,
    balances,
    loading,
    addWallet,
    updateWallet,
    deleteWallet,
    removeWallet,
    getWalletsByProject,
    fetchBalances,
    refetch: loadWallets,
  };
}
