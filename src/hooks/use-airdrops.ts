import { useState, useEffect, useCallback, useMemo, type SetStateAction } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getAirdropsByUserId, deleteAirdrop as deleteAirdropService } from '@/services/database';
import {
  AIRDROPS_SYNC_EVENT,
  emitAirdropsSync,
  getCachedAirdrops,
  invalidateAirdropsCache,
  isAirdropsCacheFresh,
  setCachedAirdrops,
} from '@/lib/airdrops-store';
import type { Airdrop } from '@/types';

export function useAirdrops() {
  const { session } = useAuth();
  const user = session?.user;
  const [airdrops, setAirdrops] = useState<Airdrop[]>([]);
  const [loading, setLoading] = useState(true);

  const applyAirdrops = useCallback((value: SetStateAction<Airdrop[]>) => {
    setAirdrops((previous) => {
      const next = typeof value === 'function' ? value(previous) : value;

      if (user) {
        setCachedAirdrops(user.id, next);
      }

      return next;
    });
  }, [user]);

  const loadAirdrops = useCallback(async (options: { force?: boolean; background?: boolean } = {}) => {
    if (!user) {
      applyAirdrops([]);
      setLoading(false);
      return;
    }

    const { force = false, background = false } = options;
    const cached = getCachedAirdrops(user.id);
    const cacheIsFresh = isAirdropsCacheFresh(user.id);

    if (!force && cached && cacheIsFresh) {
      applyAirdrops(cached);
      setLoading(false);
      return;
    }

    if (cached && !background) {
      applyAirdrops(cached);
    }

    try {
      if (!background) {
        setLoading(true);
      }

      const data = await getAirdropsByUserId(user.id);
      applyAirdrops(data);
    } catch (error) {
      console.error('Failed to load airdrops:', error);
    } finally {
      if (!background) {
        setLoading(false);
      }
    }
  }, [applyAirdrops, user]);

  useEffect(() => {
    if (!user) {
      applyAirdrops([]);
      setLoading(false);
      return;
    }

    const cached = getCachedAirdrops(user.id);

    if (cached) {
      applyAirdrops(cached);
      setLoading(false);

      if (!isAirdropsCacheFresh(user.id)) {
        void loadAirdrops({ force: true, background: true });
      }

      return;
    }

    void loadAirdrops();
  }, [applyAirdrops, loadAirdrops, user]);

  useEffect(() => {
    if (!user || typeof window === 'undefined') {
      return;
    }

    const handleSync = (event: Event) => {
      const detail = (event as CustomEvent<{ userId?: string }>).detail;

      if (detail?.userId && detail.userId !== user.id) {
        return;
      }

      invalidateAirdropsCache(user.id);
      void loadAirdrops({ force: true, background: true });
    };

    window.addEventListener(AIRDROPS_SYNC_EVENT, handleSync);

    return () => {
      window.removeEventListener(AIRDROPS_SYNC_EVENT, handleSync);
    };
  }, [loadAirdrops]);

  const deleteAirdrop = useCallback(async (id: string) => {
    await deleteAirdropService(id);
    applyAirdrops(prev => prev.filter(a => a.id !== id));
    emitAirdropsSync({ userId: user?.id });
  }, [applyAirdrops, user?.id]);

  const stats = useMemo(() => ({
    total: airdrops.length,
    ongoing: airdrops.filter(a => a.status === 'Ongoing').length,
    completed: airdrops.filter(a => a.status === 'Done').length,
    dropped: airdrops.filter(a => a.status === 'Dropped').length,
    notProcessing: airdrops.filter(a => a.status === 'Planning').length,
  }), [airdrops]);

  return { 
    airdrops, 
    stats, 
    loading, 
    setAirdrops: applyAirdrops,
    refetch: () => loadAirdrops({ force: true }),
    deleteAirdrop
  };
}
