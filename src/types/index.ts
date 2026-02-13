// ALPHA TRECKER - Types

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
