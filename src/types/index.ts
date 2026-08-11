export type AirdropType = 
  | 'Testnet' 
  | 'AI' 
  | 'Quest' 
  | 'Daily' 
  | 'Daily Quest' 
  | 'Retroactive' 
  | 'Waitlist' 
  | 'Node'
  | 'Depin' 
  | 'NFT' 
  | 'Domain Name' 
  | 'Deploy SC' 
  | 'DeFi' 
  | 'Deploy NFT'
  | 'GameFi';

export type ProjectCategory =
  | 'AI'
  | 'DeFi'
  | 'DePIN'
  | 'GameFi'
  | 'SocialFi'
  | 'NFT'
  | 'RWA'
  | 'Infrastructure'
  | 'Layer 1'
  | 'Layer 2'
  | 'ZK'
  | 'Bitcoin Ecosystem'
  | 'Consumer App'
  | 'Identity'
  | 'Storage'
  | 'Oracle'
  | 'Marketplace'
  | 'Wallet'
  | 'Bridge'
  | 'DEX'
  | 'Perpetual DEX'
  | 'Launchpad'
  | 'Other';

export type FarmingStrategy =
  | 'Testnet'
  | 'Mainnet'
  | 'Retroactive'
  | 'Quest'
  | 'Daily Check-in'
  | 'Points Program'
  | 'Waitlist'
  | 'Node'
  | 'Validator'
  | 'Ambassador'
  | 'Staking'
  | 'Liquidity Farming'
  | 'Social Task'
  | 'Bug Bounty'
  | 'Early User'
  | 'Unknown';

export const PROJECT_CATEGORIES: ProjectCategory[] = [
  'AI',
  'DeFi',
  'DePIN',
  'GameFi',
  'SocialFi',
  'NFT',
  'RWA',
  'Infrastructure',
  'Layer 1',
  'Layer 2',
  'ZK',
  'Bitcoin Ecosystem',
  'Consumer App',
  'Identity',
  'Storage',
  'Oracle',
  'Marketplace',
  'Wallet',
  'Bridge',
  'DEX',
  'Perpetual DEX',
  'Launchpad',
  'Other',
];

export const FARMING_STRATEGIES: FarmingStrategy[] = [
  'Testnet',
  'Mainnet',
  'Retroactive',
  'Quest',
  'Daily Check-in',
  'Points Program',
  'Waitlist',
  'Node',
  'Validator',
  'Ambassador',
  'Staking',
  'Liquidity Farming',
  'Social Task',
  'Bug Bounty',
  'Early User',
  'Unknown',
];

export type AirdropStatus = 'Planning' | 'Ongoing' | 'Done' | 'Dropped';
export type PriorityLevel = 'Low' | 'Medium' | 'High';
export type RewardClaimStatus = 'Pending TGE' | 'Claimed' | 'Missed';
export type PortfolioCurrency = 'IDR' | 'USD' | 'USDT' | 'USDC';
export type PortfolioTransactionType = 'income' | 'expense';
export type PortfolioAssetType = 'cash' | 'bank' | 'idr' | 'usd' | 'usdt' | 'usdc' | 'btc' | 'eth' | 'sol';

export interface PortfolioTransaction {
  id: string;
  ownerId: string;
  type: PortfolioTransactionType;
  transactionDate: string;
  category: string;
  currency: PortfolioCurrency;
  amount: number;
  wallet: string;
  source?: string | null;
  note?: string | null;
  attachmentUrl?: string | null;
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export type PortfolioTransactionInput = Omit<
  PortfolioTransaction,
  'id' | 'ownerId' | 'deletedAt' | 'createdAt' | 'updatedAt'
>;

export interface PortfolioAsset {
  id: string;
  ownerId: string;
  assetType: PortfolioAssetType;
  label: string;
  currency: PortfolioCurrency;
  balance: number;
  note?: string | null;
  createdAt: string;
  updatedAt: string;
}

export type PortfolioAssetInput = Omit<PortfolioAsset, 'id' | 'ownerId' | 'createdAt' | 'updatedAt'>;

export interface Task {
  id: string;
  airdropId: string;
  title: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Airdrop {
  id: string;
  userId: string;
  projectName: string;
  projectLogo: string;
  platformLink: string;
  twitterUsername: string;
  walletAddress: string;
  email?: string;
  type: AirdropType;
  projectCategory?: ProjectCategory;
  farmingStrategy?: FarmingStrategy;
  status: AirdropStatus;
  notes: string;
  tasks: Task[];
  createdAt: string;
  updatedAt: string;
  priority?: PriorityLevel;      
  deadline?: string;            
  waitlistCount?: number;
  funding?: string;
  potential?: PriorityLevel;
  airdropConfirmed?: boolean;
  is_priority?: boolean;        
  isPriority?: boolean;          
  ecosystemId?: string;
}

export interface AirdropReward {
  id: string;
  userId: string;
  airdropId: string;
  claimStatus: RewardClaimStatus;
  amountUsd: number;
  capitalUsd: number;
  feeUsd: number;
  tokenAmount?: number | null;
  tokenSymbol?: string | null;
  tgeDate?: string | null;
  claimedAt?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
  storageMode?: 'modern' | 'legacy_notes';
}

export interface AirdropRewardInput {
  airdropId: string;
  claimStatus: RewardClaimStatus;
  amountUsd: number;
  capitalUsd: number;
  feeUsd: number;
  tokenAmount?: number | null;
  tokenSymbol?: string | null;
  tgeDate?: string | null;
  claimedAt?: string | null;
  notes?: string | null;
}

export type TradingDirection = 'Long' | 'Short';
export type TradingPlanStatus = 'Pending' | 'Running' | 'Closed';
export type TradingPlanResult = 'Win' | 'Loss' | 'Break Even' | 'Pending';

export interface TradingPlan {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  tradeDate: string;
  tradeTime: string;
  coin: string;
  customCoin?: string | null;
  exchange: string;
  tradingType: string;
  direction: TradingDirection;
  timeframe: string;
  reason: string;
  additionalNotes?: string | null;
  marketTrend: string;
  marketStructure: string;
  volume: string;
  liquidity: string;
  bias: string;
  confluences: string[];
  entryPrice: number;
  stopLoss: number;
  takeProfit1: number;
  takeProfit2: number;
  takeProfit3: number;
  invalidation: number;
  expectedWinRate: number;
  confidence: number;
  riskReward: number;
  capital: number;
  riskPercent: number;
  riskAmount: number;
  positionSize: number;
  leverage: number;
  marginUsed: number;
  potentialProfit: number;
  potentialLoss: number;
  breakEvenPrice: number;
  liquidationPrice: number;
  emotion: string;
  psychologyChecklist: string[];
  news?: string | null;
  newsImpact: string;
  tradeChecklist: string[];
  aiSummary: string;
  tradeStatus: TradingPlanStatus;
  tradeResult: TradingPlanResult;
  pnl: number;
  profitPercent: number;
  lossPercent: number;
  lessonsLearned?: string | null;
  mistakes?: string | null;
  beforeScreenshot?: string | null;
  afterScreenshot?: string | null;
  tags: string[];
  notes?: string | null;
}

export type TradingPlanInput = Omit<TradingPlan, 'id' | 'userId' | 'createdAt' | 'updatedAt'>;

export interface User {
  id: string;
  username: string;
  passwordHash: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface ThemeState {
  theme: 'dark' | 'light';
}

export interface FilterState {
  type: AirdropType | 'all';
  status: AirdropStatus | 'all';
  sortBy: 'newest' | 'progress';
  searchQuery: string;
}

export interface Faucet {
  id: string;
  userId: string;
  projectName: string;
  url: string;
  logo?: string;  // NEW: Tambah field logo
  createdAt: string;
  updatedAt: string;
}

export interface PredefinedEcosystem {
  id: string;           // 'eth', 'sol', 'arb', 'bnb', 'base', 'avax', 'poly', 'ftm', 'sui'
  name: string;         // 'Ethereum', 'Solana', 'Arbitrum', 'Sui'
  icon: string;         // 'E', 'S', 'A', 'Sui'
  logo?: string;        // URL logo default
  color: string;        // Brand color hex
  twitterHandle: string;
}

// NEW: User-created Ecosystem type
export interface Ecosystem {
  id: string;
  userId: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  createdAt: string;
  updatedAt: string;
}

// Data type for creating/updating ecosystem
export interface EcosystemData {
  name: string;
  description?: string;
  icon?: string;
  color?: string;
}
