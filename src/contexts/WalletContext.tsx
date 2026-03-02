// contexts/WalletContext.tsx
import React, { createContext, useContext, useState, useCallback } from 'react';
import type { EligibilityCriteria, EligibilityResult } from '@/services/eligibility';
import { checkAirdropEligibility } from '@/services/eligibility';

interface Wallet {
  address: string;
  chain: string;
  label?: string;
}

interface WalletContextType {
  wallets: Wallet[];
  addWallet: (wallet: Wallet) => void;
  removeWallet: (address: string) => void;
  checkEligibility: (criteria: EligibilityCriteria) => Promise<EligibilityResult[]>;
  isChecking: boolean;
  results: EligibilityResult[];
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [results, setResults] = useState<EligibilityResult[]>([]);

  const addWallet = useCallback((wallet: Wallet) => {
    setWallets(prev => {
      if (prev.find(w => w.address === wallet.address)) return prev;
      return [...prev, wallet];
    });
  }, []);

  const removeWallet = useCallback((address: string) => {
    setWallets(prev => prev.filter(w => w.address !== address));
  }, []);

  const checkEligibility = useCallback(async (criteria: EligibilityCriteria) => {
    setIsChecking(true);
    try {
      const addresses = wallets.map(w => w.address);
      const results = await Promise.all(
        addresses.map(addr => checkAirdropEligibility(addr, criteria))
      );
      setResults(results);
      return results;
    } finally {
      setIsChecking(false);
    }
  }, [wallets]);

  return (
    <WalletContext.Provider value={{
      wallets,
      addWallet,
      removeWallet,
      checkEligibility,
      isChecking,
      results
    }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWalletContext = () => {
  const context = useContext(WalletContext);
  if (!context) throw new Error('useWalletContext must be used within WalletProvider');
  return context;
};