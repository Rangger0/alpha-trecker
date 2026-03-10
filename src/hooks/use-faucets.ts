import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import type { Faucet } from '@/types';
import { 
  createFaucet as createFaucetService,
  getFaucetsByUserId,
  updateFaucet as updateFaucetService,
  deleteFaucet as deleteFaucetService,
  type FaucetData 
} from '@/services/faucets';

export function useFaucets() {
  const { session } = useAuth();
  const user = session?.user;
  const [faucets, setFaucets] = useState<Faucet[]>([]);
  const [loading, setLoading] = useState(true);

  const loadFaucets = useCallback(async () => {
    if (!user) {
      setFaucets([]);
      setLoading(false);
      return;
    }
    try {
      const data = await getFaucetsByUserId(user.id);
      setFaucets(data);
    } catch (error) {
      console.error('Failed to load faucets:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadFaucets();
  }, [loadFaucets]);

  const addFaucet = async (data: FaucetData) => {
    if (!user) return;

    try {
      const newFaucet = await createFaucetService(data, user.id);
      setFaucets(prev => [newFaucet, ...prev]);
    } catch (error) {
      console.error('Failed to add faucet:', error);
    }
  };

  const updateFaucet = async (id: string, data: Partial<FaucetData>) => {
    if (!user) return;

    try {
      const updated = await updateFaucetService(id, data);
      setFaucets(prev => prev.map(f => f.id === id ? updated : f));
    } catch (error) {
      console.error('Failed to update faucet:', error);
    }
  };

  const removeFaucet = async (id: string) => {
    if (!user) return;

    try {
      await deleteFaucetService(id);
      setFaucets(prev => prev.filter(f => f.id !== id));
    } catch (error) {
      console.error('Failed to delete faucet:', error);
    }
  };

  return { 
    faucets, 
    loading, 
    addFaucet, 
    updateFaucet, 
    removeFaucet,
    refetch: loadFaucets 
  };
}
