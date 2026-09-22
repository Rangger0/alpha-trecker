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
    color: 'var(--alpha-info)',
    twitterHandle: 'ethereum',
  },
  {
    id: 'sol',
    name: 'Solana',
    icon: 'S',
    logo: ECOSYSTEM_LOGOS.sol,
    color: 'var(--alpha-info)',
    twitterHandle: 'solana',
  },
  {
    id: 'arb',
    name: 'Arbitrum',
    icon: 'A',
    logo: ECOSYSTEM_LOGOS.arb,
    color: 'var(--alpha-info)',
    twitterHandle: 'arbitrum',
  },
  {
    id: 'bnb',
    name: 'BNB Chain',
    icon: 'B',
    logo: ECOSYSTEM_LOGOS.bnb,
    color: 'var(--alpha-highlight)',
    twitterHandle: 'BNBCHAIN',
  },
  {
    id: 'base',
    name: 'Base',
    icon: 'B',
    logo: ECOSYSTEM_LOGOS.base,
    color: 'var(--alpha-info)',
    twitterHandle: 'BuildOnBase',
  },
  {
    id: 'avax',
    name: 'Avalanche',
    icon: 'A',
    logo: ECOSYSTEM_LOGOS.avax,
    color: 'var(--alpha-highlight)',
    twitterHandle: 'avax',
  },
  {
    id: 'poly',
    name: 'Polygon',
    icon: 'P',
    logo: ECOSYSTEM_LOGOS.poly,
    color: 'var(--alpha-highlight)',
    twitterHandle: '0xPolygon',
  },
  {
    id: 'ftm',
    name: 'Fantom',
    icon: 'F',
    logo: ECOSYSTEM_LOGOS.ftm,
    color: 'var(--alpha-info)',
    twitterHandle: 'FantomFDN',
  },
  {
    id: 'sui',
    name: 'Sui',
    icon: 'S',
    logo: ECOSYSTEM_LOGOS.sui,
    color: 'var(--alpha-info)',
    twitterHandle: 'SuiNetwork',
  },
];

export function getEcosystemById(id: string): PredefinedEcosystem | undefined {
  return PREDEFINED_ECOSYSTEMS.find(e => e.id === id);
}

export function getAllEcosystems(): PredefinedEcosystem[] {
  return PREDEFINED_ECOSYSTEMS;
}
