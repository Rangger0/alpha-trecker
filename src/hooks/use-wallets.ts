import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { getWalletBalance } from '@/services/wallet';
import { useAuth } from '@/contexts/AuthContext';

export interface Wallet {
  id: string;
  address: string;
  projectId?: string;
  projectName?: string;
  walletAddress: string; // alias untuk compatibility
  label?: string;
  createdAt?: string;
  updatedAt?: string;
}

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

      const transformedWallets: Wallet[] = (data || []).map(item => ({
        id: item.id,
        address: item.wallet_address,
        walletAddress: item.wallet_address,
        projectId: item.project_id,
        projectName: item.project_name,
        label: item.label,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
      }));

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

  // Add wallet to database
  const addWallet = useCallback(async (data: { 
    projectId: string; 
    projectName: string; 
    walletAddress: string;
    label?: string;
  }) => {
    if (!user) throw new Error('Not authenticated');

    const { data: result, error } = await supabase
      .from('wallets')
      .insert([
        {
          user_id: user.id,
          project_id: data.projectId,
          project_name: data.projectName,
          wallet_address: data.walletAddress,
          label: data.label,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    const newWallet: Wallet = {
      id: result.id,
      address: result.wallet_address,
      walletAddress: result.wallet_address,
      projectId: result.project_id,
      projectName: result.project_name,
      label: result.label,
      createdAt: result.created_at,
      updatedAt: result.updated_at,
    };

    setWallets(prev => [newWallet, ...prev]);
    return newWallet;
  }, [user]);

  // Update wallet
  const updateWallet = useCallback(async (id: string, data: { 
    walletAddress?: string;
    label?: string;
  }) => {
    if (!user) throw new Error('Not authenticated');

    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    if (data.walletAddress) {
      updateData.wallet_address = data.walletAddress;
    }
    if (data.label !== undefined) {
      updateData.label = data.label;
    }

    const { data: result, error } = await supabase
      .from('wallets')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', user.id) // Security: only update own wallets
      .select()
      .single();

    if (error) throw error;

    setWallets(prev => prev.map(w => 
      w.id === id 
        ? { 
            ...w, 
            address: result.wallet_address,
            walletAddress: result.wallet_address,
            label: result.label,
            updatedAt: result.updated_at,
          }
        : w
    ));

    return result;
  }, [user]);

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