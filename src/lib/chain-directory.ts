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
    accent: 'var(--alpha-info)',
  },
  {
    id: 'base',
    name: 'Base',
    shortName: 'BASE',
    family: 'evm',
    logo: '/logos/base.png',
    accent: 'var(--alpha-info)',
  },
  {
    id: 'arbitrum',
    name: 'Arbitrum',
    shortName: 'ARB',
    family: 'evm',
    logo: '/logos/arbitrum.png',
    accent: 'var(--alpha-info)',
  },
  {
    id: 'polygon',
    name: 'Polygon',
    shortName: 'POL',
    family: 'evm',
    logo: '/logos/polygon.png',
    accent: 'var(--alpha-highlight)',
  },
  {
    id: 'bnbchain',
    name: 'BNB Chain',
    shortName: 'BNB',
    family: 'evm',
    logo: '/logos/bnbchain.png',
    accent: 'var(--alpha-highlight)',
  },
  {
    id: 'avalanche',
    name: 'Avalanche',
    shortName: 'AVAX',
    family: 'evm',
    logo: '/logos/avalanche.png',
    accent: 'var(--alpha-highlight)',
  },
  {
    id: 'berachain',
    name: 'Berachain',
    shortName: 'BERA',
    family: 'evm',
    logo: '/logos/berachain.png',
    accent: 'var(--alpha-info)',
  },
  {
    id: 'monad',
    name: 'Monad',
    shortName: 'MON',
    family: 'evm',
    logo: '/logos/monad.png',
    accent: 'var(--alpha-highlight)',
  },
  {
    id: 'pharos',
    name: 'Pharos',
    shortName: 'PHRS',
    family: 'evm',
    logo: '/logos/pharos.png',
    accent: 'var(--alpha-info)',
  },
  {
    id: 'solana',
    name: 'Solana',
    shortName: 'SOL',
    family: 'solana',
    logo: '/logos/solana.png',
    accent: 'var(--alpha-info)',
  },
  {
    id: 'sui',
    name: 'Sui',
    shortName: 'SUI',
    family: 'sui',
    logo: '/logos/sui.png',
    accent: 'var(--alpha-info)',
  },
];

export const chainDirectoryMap = Object.fromEntries(
  chainDirectory.map((entry) => [entry.id, entry]),
) as Record<string, ChainDirectoryEntry>;
