import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import type { Ecosystem } from '@/types';
import {
  createEcosystem as createEcosystemService,
  getEcosystemsByUserId,
  updateEcosystem as updateEcosystemService,
  deleteEcosystem as deleteEcosystemService,
  type EcosystemData,
} from '@/services/ecosystems';

export function useEcosystems() {
  const { session } = useAuth();
  const user = session?.user;
  const [ecosystems, setEcosystems] = useState<Ecosystem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadEcosystems = useCallback(async () => {
    if (!user) {
      setEcosystems([]);
      setLoading(false);
      return;
    }
    try {
      const data = await getEcosystemsByUserId(user.id);
      setEcosystems(data);
    } catch (error) {
      console.error('Failed to load ecosystems:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadEcosystems();
  }, [loadEcosystems]);

  const createEcosystem = async (data: EcosystemData) => {
    if (!user) return;
    try {
      const newEcosystem = await createEcosystemService(data, user.id);
      setEcosystems(prev => [newEcosystem, ...prev]);
    } catch (error) {
      console.error('Failed to create ecosystem:', error);
    }
  };

  const updateEcosystem = async (id: string, data: Partial<EcosystemData>) => {
    try {
      const updated = await updateEcosystemService(id, data);
      setEcosystems(prev => prev.map(e => e.id === id ? updated : e));
    } catch (error) {
      console.error('Failed to update ecosystem:', error);
    }
  };

  const deleteEcosystem = async (id: string) => {
    try {
      await deleteEcosystemService(id);
      setEcosystems(prev => prev.filter(e => e.id !== id));
    } catch (error) {
      console.error('Failed to delete ecosystem:', error);
    }
  };

  return {
    ecosystems,
    loading,
    createEcosystem,
    updateEcosystem,
    deleteEcosystem,
    refetch: loadEcosystems,
  };
}