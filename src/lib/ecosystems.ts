import type { PredefinedEcosystem } from '@/types';

const ECOSYSTEM_LOGOS: Record<string, string> = {
  eth: '/logos/ethereum.png',
  sol: '/logos/solana.png',
  arb: '/logos/arbitrum.png',
  bnb: '/logos/bnbchain.png',
  base: '/logos/base.png',
  avax: '/logos/avalanche.png',
  poly: '/logos/polygon.png',
  ftm: '/logos/fantom.png',
  sui: '/logos/sui.png',
};

export const PREDEFINED_ECOSYSTEMS: PredefinedEcosystem[] = [
  {
    id: 'eth',
    name: 'Ethereum',
    icon: 'E',
    logo: ECOSYSTEM_LOGOS.eth,
    color: '#2dd4bf',
    twitterHandle: 'ethereum',
  },
  {
    id: 'sol',
    name: 'Solana',
    icon: 'S',
    logo: ECOSYSTEM_LOGOS.sol,
    color: '#2dd4bf',
    twitterHandle: 'solana',
  },
  {
    id: 'arb',
    name: 'Arbitrum',
    icon: 'A',
    logo: ECOSYSTEM_LOGOS.arb,
    color: '#2dd4bf',
    twitterHandle: 'arbitrum',
  },
  {
    id: 'bnb',
    name: 'BNB Chain',
    icon: 'B',
    logo: ECOSYSTEM_LOGOS.bnb,
    color: '#ffd803',
    twitterHandle: 'BNBCHAIN',
  },
  {
    id: 'base',
    name: 'Base',
    icon: 'B',
    logo: ECOSYSTEM_LOGOS.base,
    color: '#2dd4bf',
    twitterHandle: 'BuildOnBase',
  },
  {
    id: 'avax',
    name: 'Avalanche',
    icon: 'A',
    logo: ECOSYSTEM_LOGOS.avax,
    color: '#ffd803',
    twitterHandle: 'avax',
  },
  {
    id: 'poly',
    name: 'Polygon',
    icon: 'P',
    logo: ECOSYSTEM_LOGOS.poly,
    color: '#ffd803',
    twitterHandle: '0xPolygon',
  },
  {
    id: 'ftm',
    name: 'Fantom',
    icon: 'F',
    logo: ECOSYSTEM_LOGOS.ftm,
    color: '#2dd4bf',
    twitterHandle: 'FantomFDN',
  },
  {
    id: 'sui',
    name: 'Sui',
    icon: 'S',
    logo: ECOSYSTEM_LOGOS.sui,
    color: '#2dd4bf',
    twitterHandle: 'SuiNetwork',
  },
];

export function getEcosystemById(id: string): PredefinedEcosystem | undefined {
  return PREDEFINED_ECOSYSTEMS.find(e => e.id === id);
}

export function getAllEcosystems(): PredefinedEcosystem[] {
  return PREDEFINED_ECOSYSTEMS;
}
