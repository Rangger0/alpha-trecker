import type { PredefinedEcosystem } from '@/types';

export const PREDEFINED_ECOSYSTEMS: PredefinedEcosystem[] = [
  {
    id: 'eth',
    name: 'Ethereum',
    icon: 'E',
    color: '#627EEA',
    twitterHandle: 'ethereum',
  },
  {
    id: 'sol',
    name: 'Solana',
    icon: 'S',
    color: '#14F195',
    twitterHandle: 'solana',
  },
  {
    id: 'arb',
    name: 'Arbitrum',
    icon: 'A',
    color: '#28A0F0',
    twitterHandle: 'arbitrum',
  },
  {
    id: 'bnb',
    name: 'BNB Chain',
    icon: 'B',
    color: '#F3BA2F',
    twitterHandle: 'BNBCHAIN',
  },
  {
    id: 'base',
    name: 'Base',
    icon: 'B',
    color: '#0052FF',
    twitterHandle: 'BuildOnBase',
  },
  {
    id: 'avax',
    name: 'Avalanche',
    icon: 'A',
    color: '#E84142',
    twitterHandle: 'avax',
  },
  {
    id: 'poly',
    name: 'Polygon',
    icon: 'P',
    color: '#8247E5',
    twitterHandle: '0xPolygon',
  },
  {
    id: 'ftm',
    name: 'Fantom',
    icon: 'F',
    color: '#1969FF',
    twitterHandle: 'FantomFDN',
  },
  {
    id: 'sui',
    name: 'Sui',
    icon: 'S',
    color: '#4DA2FF',
    twitterHandle: 'SuiNetwork',
  },
];

export function getEcosystemById(id: string): PredefinedEcosystem | undefined {
  return PREDEFINED_ECOSYSTEMS.find(e => e.id === id);
}

export function getAllEcosystems(): PredefinedEcosystem[] {
  return PREDEFINED_ECOSYSTEMS;
}