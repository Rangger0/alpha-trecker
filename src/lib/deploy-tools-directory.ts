export type DeployAssetType = 'Token' | 'NFT' | 'Contract';
export type DeployEnvironment = 'Mainnet' | 'Testnet';
export type DeployMode = 'No-code' | 'Low-code' | 'Builder docs';

export interface DeployToolEntry {
  id: string;
  name: string;
  accent: string;
  badge: string;
  logo?: string;
  description: string;
  mode: DeployMode;
  pricing: 'Free' | 'Free tier';
  assetTypes: DeployAssetType[];
  environments: DeployEnvironment[];
  chainIds: string[];
  url: string;
  sourceUrl: string;
  note: string;
  isCustom?: boolean;
}

export const deployToolsDirectory: DeployToolEntry[] = [
  {
    id: 'thirdweb-dashboard',
    name: 'thirdweb Dashboard',
    accent: '#2563EB',
    badge: 'TW',
    description: 'Deploy ERC-20, ERC-721, ERC-1155, edition contract, dan app contract dari dashboard web.',
    mode: 'No-code',
    pricing: 'Free tier',
    assetTypes: ['Token', 'NFT', 'Contract'],
    environments: ['Mainnet', 'Testnet'],
    chainIds: ['ethereum', 'base', 'arbitrum', 'polygon', 'bnbchain', 'avalanche'],
    url: 'https://thirdweb.com/dashboard',
    sourceUrl: 'https://portal.thirdweb.com/',
    note: 'Paling dekat dengan tool seperti Onchain GM untuk deploy cepat tanpa setup lokal yang berat.',
  },
  {
    id: 'openzeppelin-wizard',
    name: 'OpenZeppelin Wizard',
    accent: '#00A6FF',
    badge: 'OZ',
    description: 'Generator kontrak ERC-20 / ERC-721 / ERC-1155 yang aman untuk dibawa ke Remix atau Foundry.',
    mode: 'Low-code',
    pricing: 'Free',
    assetTypes: ['Token', 'NFT', 'Contract'],
    environments: ['Mainnet', 'Testnet'],
    chainIds: ['ethereum', 'base', 'arbitrum', 'polygon', 'bnbchain', 'avalanche'],
    url: 'https://wizard.openzeppelin.com/',
    sourceUrl: 'https://docs.openzeppelin.com/contracts-wizard',
    note: 'Gratis penuh dan cocok kalau kamu mau output contract yang lebih jelas daripada no-code deployer.',
  },
  {
    id: 'remix-ide',
    name: 'Remix IDE',
    accent: '#F7C948',
    badge: 'RX',
    description: 'IDE browser untuk compile, deploy, dan verify contract langsung dari wallet.',
    mode: 'Low-code',
    pricing: 'Free',
    assetTypes: ['Token', 'NFT', 'Contract'],
    environments: ['Mainnet', 'Testnet'],
    chainIds: ['ethereum', 'base', 'arbitrum', 'polygon', 'bnbchain', 'avalanche'],
    url: 'https://remix.ethereum.org/',
    sourceUrl: 'https://remix-ide.readthedocs.io/en/latest/',
    note: 'Kalau butuh deploy manual lintas banyak chain EVM tanpa install lokal, ini paling universal.',
  },
  {
    id: 'zora-create',
    name: 'Zora Create',
    accent: '#111111',
    badge: 'ZR',
    description: 'Create and mint NFT collection / coin-style launch flow di ekosistem Zora dan Base.',
    mode: 'No-code',
    pricing: 'Free tier',
    assetTypes: ['NFT', 'Token'],
    environments: ['Mainnet'],
    chainIds: ['base', 'ethereum'],
    url: 'https://zora.co/create',
    sourceUrl: 'https://support.zora.co/en/',
    note: 'Bagus untuk deploy NFT atau creator campaign dengan onboarding yang ringan.',
  },
  {
    id: 'base-token-guide',
    name: 'Base Token Guide',
    accent: '#0052FF',
    badge: 'BS',
    description: 'Guide resmi Base untuk deploy ERC-20, contract, dan app ke Base mainnet atau Base Sepolia.',
    mode: 'Builder docs',
    pricing: 'Free',
    assetTypes: ['Token', 'Contract'],
    environments: ['Mainnet', 'Testnet'],
    chainIds: ['base'],
    url: 'https://docs.base.org/learn/token-development/erc-20-token/create-erc-20-token',
    sourceUrl: 'https://docs.base.org/',
    note: 'Saya masukkan karena ini resmi, gratis, dan paling relevan kalau fokus kamu memang Base.',
  },
  {
    id: 'solana-token-docs',
    name: 'Solana Token Guide',
    accent: '#14F195',
    badge: 'SL',
    description: 'Dokumentasi resmi Solana untuk token, metadata, dan flow deploy/testing pada cluster Solana.',
    mode: 'Builder docs',
    pricing: 'Free',
    assetTypes: ['Token', 'NFT', 'Contract'],
    environments: ['Mainnet', 'Testnet'],
    chainIds: ['solana'],
    url: 'https://solana.com/docs/tokens',
    sourceUrl: 'https://solana.com/docs',
    note: 'Bukan no-code, tapi paling aman kalau kamu mau tooling Solana yang jelas dan gratis.',
  },
  {
    id: 'sui-package-guide',
    name: 'Sui Publish Guide',
    accent: '#4DA2FF',
    badge: 'SU',
    description: 'Panduan resmi publish package Move, asset, dan NFT di jaringan Sui.',
    mode: 'Builder docs',
    pricing: 'Free',
    assetTypes: ['NFT', 'Contract'],
    environments: ['Mainnet', 'Testnet'],
    chainIds: ['sui'],
    url: 'https://docs.sui.io/guides/developer/first-app/publish',
    sourceUrl: 'https://docs.sui.io/',
    note: 'Masih developer-heavy, tapi gratis dan langsung mengarah ke flow deploy yang resmi.',
  },
];
