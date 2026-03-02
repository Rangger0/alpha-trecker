// src/hooks/use-airdrops.ts
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getAirdropsByUserId, deleteAirdrop as deleteAirdropService } from '@/services/database';
import type { Airdrop } from '@/types';

export function useAirdrops() {
  const { session } = useAuth();
  const user = session?.user;
  const [airdrops, setAirdrops] = useState<Airdrop[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAirdrops = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    try {
      const data = await getAirdropsByUserId(user.id);
      setAirdrops(data);
    } catch (error) {
      console.error('Failed to load airdrops:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadAirdrops();
  }, [loadAirdrops]);

  const deleteAirdrop = useCallback(async (id: string) => {
    await deleteAirdropService(id);
    setAirdrops(prev => prev.filter(a => a.id !== id));
  }, []);

  const stats = {
    total: airdrops.length,
    ongoing: airdrops.filter(a => a.status === 'Ongoing').length,
    completed: airdrops.filter(a => a.status === 'Done').length,
    dropped: airdrops.filter(a => a.status === 'Dropped').length,
    notProcessing: airdrops.filter(a => a.status === 'Planning').length,
  };

  return { 
    airdrops, 
    stats, 
    loading, 
    setAirdrops,
    refetch: loadAirdrops,
    deleteAirdrop
  };
}