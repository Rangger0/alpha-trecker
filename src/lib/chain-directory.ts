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
    accent: '#b8c1ec',
  },
  {
    id: 'base',
    name: 'Base',
    shortName: 'BASE',
    family: 'evm',
    logo: '/logos/base.png',
    accent: '#b8c1ec',
  },
  {
    id: 'arbitrum',
    name: 'Arbitrum',
    shortName: 'ARB',
    family: 'evm',
    logo: '/logos/arbitrum.png',
    accent: '#b8c1ec',
  },
  {
    id: 'polygon',
    name: 'Polygon',
    shortName: 'POL',
    family: 'evm',
    logo: '/logos/polygon.png',
    accent: '#eebbc3',
  },
  {
    id: 'bnbchain',
    name: 'BNB Chain',
    shortName: 'BNB',
    family: 'evm',
    logo: '/logos/bnbchain.png',
    accent: '#eebbc3',
  },
  {
    id: 'avalanche',
    name: 'Avalanche',
    shortName: 'AVAX',
    family: 'evm',
    logo: '/logos/avalanche.png',
    accent: '#eebbc3',
  },
  {
    id: 'berachain',
    name: 'Berachain',
    shortName: 'BERA',
    family: 'evm',
    logo: '/logos/berachain.png',
    accent: '#b8c1ec',
  },
  {
    id: 'monad',
    name: 'Monad',
    shortName: 'MON',
    family: 'evm',
    logo: '/logos/monad.png',
    accent: '#eebbc3',
  },
  {
    id: 'pharos',
    name: 'Pharos',
    shortName: 'PHRS',
    family: 'evm',
    logo: '/logos/pharos.png',
    accent: '#b8c1ec',
  },
  {
    id: 'solana',
    name: 'Solana',
    shortName: 'SOL',
    family: 'solana',
    logo: '/logos/solana.png',
    accent: '#b8c1ec',
  },
  {
    id: 'sui',
    name: 'Sui',
    shortName: 'SUI',
    family: 'sui',
    logo: '/logos/sui.png',
    accent: '#b8c1ec',
  },
];

export const chainDirectoryMap = Object.fromEntries(
  chainDirectory.map((entry) => [entry.id, entry]),
) as Record<string, ChainDirectoryEntry>;
