export type ChainFamily = 'evm' | 'solana' | 'sui';

export interface ChainDirectoryEntry {
  id: string;
  name: string;
  shortName: string;
  family: ChainFamily;
  logo: string;
  accent: string;
}

export const chainDirectory: ChainDirectoryEntry[] = [
  {
    id: 'ethereum',
    name: 'Ethereum',
    shortName: 'ETH',
    family: 'evm',
    logo: '/logos/ethereum.png',
    accent: '#627EEA',
  },
  {
    id: 'base',
    name: 'Base',
    shortName: 'BASE',
    family: 'evm',
    logo: '/logos/base.png',
    accent: '#0052FF',
  },
  {
    id: 'arbitrum',
    name: 'Arbitrum',
    shortName: 'ARB',
    family: 'evm',
    logo: '/logos/arbitrum.png',
    accent: '#28A0F0',
  },
  {
    id: 'polygon',
    name: 'Polygon',
    shortName: 'POL',
    family: 'evm',
    logo: '/logos/polygon.png',
    accent: '#8247E5',
  },
  {
    id: 'bnbchain',
    name: 'BNB Chain',
    shortName: 'BNB',
    family: 'evm',
    logo: '/logos/bnbchain.png',
    accent: '#F3BA2F',
  },
  {
    id: 'avalanche',
    name: 'Avalanche',
    shortName: 'AVAX',
    family: 'evm',
    logo: '/logos/avalanche.png',
    accent: '#E84142',
  },
  {
    id: 'berachain',
    name: 'Berachain',
    shortName: 'BERA',
    family: 'evm',
    logo: '/logos/berachain.png',
    accent: '#8BCF50',
  },
  {
    id: 'monad',
    name: 'Monad',
    shortName: 'MON',
    family: 'evm',
    logo: '/logos/monad.png',
    accent: '#8B5CF6',
  },
  {
    id: 'pharos',
    name: 'Pharos',
    shortName: 'PHRS',
    family: 'evm',
    logo: '/logos/pharos.png',
    accent: '#2563EB',
  },
  {
    id: 'solana',
    name: 'Solana',
    shortName: 'SOL',
    family: 'solana',
    logo: '/logos/solana.png',
    accent: '#14F195',
  },
  {
    id: 'sui',
    name: 'Sui',
    shortName: 'SUI',
    family: 'sui',
    logo: '/logos/sui.png',
    accent: '#4DA2FF',
  },
];

export const chainDirectoryMap = Object.fromEntries(
  chainDirectory.map((entry) => [entry.id, entry]),
) as Record<string, ChainDirectoryEntry>;
