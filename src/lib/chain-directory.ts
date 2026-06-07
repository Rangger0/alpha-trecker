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
    accent: '#2dd4bf',
  },
  {
    id: 'base',
    name: 'Base',
    shortName: 'BASE',
    family: 'evm',
    logo: '/logos/base.png',
    accent: '#2dd4bf',
  },
  {
    id: 'arbitrum',
    name: 'Arbitrum',
    shortName: 'ARB',
    family: 'evm',
    logo: '/logos/arbitrum.png',
    accent: '#2dd4bf',
  },
  {
    id: 'polygon',
    name: 'Polygon',
    shortName: 'POL',
    family: 'evm',
    logo: '/logos/polygon.png',
    accent: '#ffd803',
  },
  {
    id: 'bnbchain',
    name: 'BNB Chain',
    shortName: 'BNB',
    family: 'evm',
    logo: '/logos/bnbchain.png',
    accent: '#ffd803',
  },
  {
    id: 'avalanche',
    name: 'Avalanche',
    shortName: 'AVAX',
    family: 'evm',
    logo: '/logos/avalanche.png',
    accent: '#ffd803',
  },
  {
    id: 'berachain',
    name: 'Berachain',
    shortName: 'BERA',
    family: 'evm',
    logo: '/logos/berachain.png',
    accent: '#2dd4bf',
  },
  {
    id: 'monad',
    name: 'Monad',
    shortName: 'MON',
    family: 'evm',
    logo: '/logos/monad.png',
    accent: '#ffd803',
  },
  {
    id: 'pharos',
    name: 'Pharos',
    shortName: 'PHRS',
    family: 'evm',
    logo: '/logos/pharos.png',
    accent: '#2dd4bf',
  },
  {
    id: 'solana',
    name: 'Solana',
    shortName: 'SOL',
    family: 'solana',
    logo: '/logos/solana.png',
    accent: '#2dd4bf',
  },
  {
    id: 'sui',
    name: 'Sui',
    shortName: 'SUI',
    family: 'sui',
    logo: '/logos/sui.png',
    accent: '#2dd4bf',
  },
];

export const chainDirectoryMap = Object.fromEntries(
  chainDirectory.map((entry) => [entry.id, entry]),
) as Record<string, ChainDirectoryEntry>;
