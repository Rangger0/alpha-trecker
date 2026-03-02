// src/hooks/use-claims.ts
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface Claim {
  id: string;
  name: string;
  logo: string;
  type: 'Airdrop' | 'Points';
  value: string;
  claimable: boolean;
}

const MOCK_CLAIMS: Claim[] = [
  { id: '1', name: 'Mitosis', logo: '', type: 'Airdrop', value: '$ 7.50M', claimable: true },
  { id: '2', name: 'Huma Finance', logo: '', type: 'Airdrop', value: '$ 46.30M', claimable: true },
  { id: '3', name: 'Bitlayer', logo: '', type: 'Airdrop', value: '$ 20.00M', claimable: true },
  { id: '4', name: 'Camp Network', logo: '', type: 'Airdrop', value: '$ 25.00M', claimable: true },
  { id: '5', name: 'Sapien', logo: '', type: 'Points', value: '$ 15.00M', claimable: true },
  { id: '6', name: 'KGeN', logo: '', type: 'Airdrop', value: '$ 30.00M', claimable: true },
  { id: '7', name: 'Succinct', logo: '', type: 'Airdrop', value: '$ 55.00M', claimable: true },
  { id: '8', name: 'Towns', logo: '', type: 'Airdrop', value: '$ 25.00M', claimable: true },
  { id: '9', name: 'Soulbound TV', logo: '', type: 'Points', value: '$ 5.15M', claimable: true },
  { id: '10', name: 'Impossible Cloud Network', logo: '', type: 'Airdrop', value: '-', claimable: false },
  { id: '11', name: 'Cycle Network', logo: '', type: 'Points', value: '-', claimable: true },
  { id: '12', name: 'Unite', logo: '', type: 'Points', value: '-', claimable: true },
];

export function useClaims() {
  const { session } = useAuth();
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data - replace with API call
    setClaims(MOCK_CLAIMS);
    setLoading(false);
  }, [session]);

  return { claims, loading };
}