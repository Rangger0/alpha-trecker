export type AirdropType = 
  | 'Testnet' 
  | 'AI' 
  | 'Quest' 
  | 'Daily' 
  | 'Daily Quest' 
  | 'Retro' 
  | 'Waitlist' 
  | 'Depin' 
  | 'NFT' 
  | 'Domain Name' 
  | 'Deploy SC' 
  | 'DeFi' 
  | 'Deploy NFT';

export type AirdropStatus = 'Planning' | 'Ongoing' | 'Done' | 'Dropped';
export type PriorityLevel = 'Low' | 'Medium' | 'High';
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
  type: AirdropType;
  status: AirdropStatus;
  notes: string;
  tasks: Task[];
  createdAt: string;
  updatedAt: string;
  priority?: PriorityLevel;      
  deadline?: string;            
  is_priority?: boolean;        
  isPriority?: boolean;          
  ecosystemId?: string;
}

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