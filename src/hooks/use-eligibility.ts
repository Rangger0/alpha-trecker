// hooks/use-eligibility.ts
import { useState, useCallback } from 'react';
import { checkAirdropEligibility } from '@/services/eligibility';
import type { EligibilityCriteria, EligibilityResult } from '@/services/eligibility';

export const useEligibility = () => {
  const [results, setResults] = useState<EligibilityResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkEligibility = useCallback(async (
    wallets: string[],
    criteria: EligibilityCriteria
  ) => {
    setLoading(true);
    setError(null);
    try {
      const checkPromises = wallets.map(wallet => 
        checkAirdropEligibility(wallet, criteria)
      );
      const results = await Promise.all(checkPromises);
      setResults(results);
      return results;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    results,
    loading,
    error,
    checkEligibility
  };
};