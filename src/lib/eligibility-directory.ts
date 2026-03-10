export type EligibilityStatus = 'Live' | 'Portal' | 'Claim' | 'Archive';

export interface EligibilityEntry {
  id: string;
  name: string;
  chain: string;
  category: string;
  status: EligibilityStatus;
  accent: string;
  logo: string;
  portalUrl: string;
  sourceUrl: string;
  summary: string;
  note: string;
  verifiedAt: string;
}

export const eligibilityDirectory: EligibilityEntry[] = [
  {
    id: 'babylon',
    name: 'Babylon',
    chain: 'Bitcoin',
    category: 'Airdrop Checker',
    status: 'Live',
    accent: '#BE3144',
    logo: '/logos/babylon.png',
    portalUrl: 'https://airdrop.babylon.foundation/',
    sourceUrl: 'https://babylon.foundation/blog/the-baby-airdrop-eligibility-checker-is-now-live',
    summary: 'Official BABY airdrop checker from Babylon Foundation.',
    note: 'Portal resmi untuk cek alokasi dan status klaim wallet yang eligible.',
    verifiedAt: '2026-03-07',
  },
  {
    id: 'sonic',
    name: 'Sonic',
    chain: 'Sonic',
    category: 'Rewards Claim',
    status: 'Live',
    accent: '#DA0037',
    logo: '/logos/sonic.png',
    portalUrl: 'https://mainnet-rewards-claim.sonic.game/',
    sourceUrl: 'https://mainnet-rewards-claim.sonic.game/',
    summary: 'Official Sonic mainnet rewards claim page.',
    note: 'Gratis dipakai untuk cek reward wallet langsung dari portal resmi Sonic.',
    verifiedAt: '2026-03-07',
  },
  {
    id: 'zora',
    name: 'Zora',
    chain: 'Base',
    category: 'Claim Portal',
    status: 'Live',
    accent: '#3A4750',
    logo: '/logos/zerologo.png',
    portalUrl: 'https://claim.zora.co/',
    sourceUrl: 'https://support.zora.co/en/articles/10575158-zora-token-claiming',
    summary: 'Official Zora claim page for eligible wallets.',
    note: 'Halaman support resmi Zora menjelaskan flow klaim token lewat claim portal.',
    verifiedAt: '2026-03-07',
  },
  {
    id: 'walletconnect',
    name: 'WalletConnect',
    chain: 'Multichain',
    category: 'Season Checker',
    status: 'Live',
    accent: '#3A4750',
    logo: '/logos/walletconnect.png',
    portalUrl: 'https://airdrop.walletconnect.network/',
    sourceUrl: 'https://walletconnect.com/blog/wct-airdrop-season-1-check-your-allocation',
    summary: 'Official WCT airdrop checker and campaign reference page.',
    note: 'Season 1 resmi ditutup pada January 3, 2025, tapi page ini tetap berguna buat referensi season resmi.',
    verifiedAt: '2026-03-07',
  },
  {
    id: 'lisk',
    name: 'Lisk',
    chain: 'Ethereum L2',
    category: 'Campaign Portal',
    status: 'Live',
    accent: '#BE3144',
    logo: '/logos/lisk.png',
    portalUrl: 'https://portal.lisk.com/',
    sourceUrl: 'https://lisk.com/blog/posts/lisk-alliance-boost-airdrop',
    summary: 'Official Lisk portal for ecosystem tasks and reward campaigns.',
    note: 'Simpan sebagai portal resmi untuk cek task campaign dan eligibility drop yang dirilis Lisk.',
    verifiedAt: '2026-03-07',
  },
  {
    id: 'plume',
    name: 'Plume',
    chain: 'Plume',
    category: 'Rewards Portal',
    status: 'Live',
    accent: '#BE3144',
    logo: '/logos/plume.png',
    portalUrl: 'https://portal.plume.org/',
    sourceUrl: 'https://docs.plume.org/plume/getting-started/get-started-on-plume',
    summary: 'Official Plume portal for missions, rewards, and future eligibility checks.',
    note: 'Portal resmi Plume cocok dipakai untuk pantau progress points dan mission.',
    verifiedAt: '2026-03-07',
  },
  {
    id: 'etherfi',
    name: 'ether.fi',
    chain: 'Ethereum',
    category: 'Rewards Hub',
    status: 'Live',
    accent: '#3A4750',
    logo: '/logos/ether.fi.png',
    portalUrl: 'https://mainnet.ether.fi/',
    sourceUrl: 'https://www.ether.fi/',
    summary: 'Official ether.fi dashboard for staking activity and rewards tracking.',
    note: 'Dipakai untuk cek activity, points, dan reward hub dari akun yang terhubung.',
    verifiedAt: '2026-03-07',
  },
];
