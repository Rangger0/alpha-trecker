// src/utils/helpers.ts - ALPHA TRACKER UTILITIES

// ==================== DATE & TIME ====================

export const formatDate = (date: Date | string): string => {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit'
  });
};

// ==================== NUMBER FORMATTING ====================

export const formatNumber = (num: number): string => {
  return num.toLocaleString('en-US');
};

export const parseTokenAmount = (amount: string, decimals: number = 18): string => {
  const parsed = parseFloat(amount) / Math.pow(10, decimals);
  return parsed.toLocaleString('en-US', { maximumFractionDigits: 6 });
};

export const calculateAirdropValue = (
  tokenAmount: string,
  tokenPrice: number,
  decimals: number = 18
): number => {
  const amount = parseFloat(tokenAmount) / Math.pow(10, decimals);
  return amount * tokenPrice;
};

// ==================== TEXT UTILITIES ====================

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
};

// ==================== WALLET UTILITIES ====================

export const formatWalletAddress = (address: string): string => {
  if (!address || address.length < 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const validateWalletAddress = (address: string): boolean => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};

export const getChainExplorerUrl = (chain: string, address: string): string => {
  const explorers: Record<string, string> = {
    eth: 'https://etherscan.io/address/',
    bsc: 'https://bscscan.com/address/',
    polygon: 'https://polygonscan.com/address/',
    arbitrum: 'https://arbiscan.io/address/',
    optimism: 'https://optimistic.etherscan.io/address/',
    base: 'https://basescan.org/address/',
    avalanche: 'https://snowtrace.io/address/',
    fantom: 'https://ftmscan.com/address/',
    cronos: 'https://cronoscan.com/address/',
    linea: 'https://lineascan.build/address/',
    scroll: 'https://scrollscan.com/address/',
    zksync: 'https://explorer.zksync.io/address/'
  };
  
  const baseUrl = explorers[chain.toLowerCase()] || explorers.eth;
  return `${baseUrl}${address}`;
};

// ==================== GENERAL UTILITIES ====================

export const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// ==================== AIRDROP SPECIFIC ====================

export const calculateProgress = (completed: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
};

export const getStatusColor = (status: string, isDark: boolean = true): string => {
  const colors: Record<string, { dark: string; light: string }> = {
    'Planning': { dark: 'text-gray-400', light: 'text-gray-600' },
    'Ongoing': { dark: 'text-blue-400', light: 'text-blue-600' },
    'Done': { dark: 'text-[var(--alpha-signal)]', light: 'text-green-600' },
    'Dropped': { dark: 'text-red-400', light: 'text-red-600' }
  };
  return colors[status]?.[isDark ? 'dark' : 'light'] || colors['Planning'][isDark ? 'dark' : 'light'];
};

export const getTypeColor = (type: string, isDark: boolean = true): string => {
  const colors: Record<string, { dark: string; light: string }> = {
    'Testnet': { dark: 'text-purple-400', light: 'text-purple-600' },
    'AI': { dark: 'text-cyan-400', light: 'text-cyan-600' },
    'Quest': { dark: 'text-yellow-400', light: 'text-yellow-600' },
    'Daily': { dark: 'text-pink-400', light: 'text-pink-600' },
    'Daily Quest': { dark: 'text-pink-400', light: 'text-pink-600' },
    'Retro': { dark: 'text-indigo-400', light: 'text-indigo-600' },
    'Waitlist': { dark: 'text-blue-400', light: 'text-blue-600' },
    'Depin': { dark: 'text-green-400', light: 'text-green-600' },
    'NFT': { dark: 'text-red-400', light: 'text-red-600' },
    'Domain Name': { dark: 'text-orange-400', light: 'text-orange-600' },
    'Deploy SC': { dark: 'text-amber-400', light: 'text-amber-600' },
    'DeFi': { dark: 'text-emerald-400', light: 'text-emerald-600' },
    'Deploy NFT': { dark: 'text-rose-400', light: 'text-rose-600' }
  };
  return colors[type]?.[isDark ? 'dark' : 'light'] || colors['Quest'][isDark ? 'dark' : 'light'];
};

// ==================== SORTING & FILTERING ====================

export const sortAirdropsByDate = (airdrops: any[], order: 'asc' | 'desc' = 'desc'): any[] => {
  return [...airdrops].sort((a, b) => {
    const dateA = new Date(a.createdAt || 0).getTime();
    const dateB = new Date(b.createdAt || 0).getTime();
    return order === 'desc' ? dateB - dateA : dateA - dateB;
  });
};

export const sortAirdropsByProgress = (airdrops: any[], order: 'asc' | 'desc' = 'desc'): any[] => {
  return [...airdrops].sort((a, b) => {
    const progressA = a.tasks?.length ? (a.tasks.filter((t: any) => t.completed).length / a.tasks.length) : 0;
    const progressB = b.tasks?.length ? (b.tasks.filter((t: any) => t.completed).length / b.tasks.length) : 0;
    return order === 'desc' ? progressB - progressA : progressA - progressB;
  });
};

export const filterAirdrops = (
  airdrops: any[],
  filters: {
    search?: string;
    type?: string;
    status?: string;
  }
): any[] => {
  return airdrops.filter((airdrop) => {
    // Search filter
    if (filters.search) {
      const query = filters.search.toLowerCase();
      const matchName = airdrop.projectName?.toLowerCase().includes(query);
      const matchTwitter = airdrop.twitterUsername?.toLowerCase().includes(query);
      const matchWallet = airdrop.walletAddress?.toLowerCase().includes(query);
      if (!matchName && !matchTwitter && !matchWallet) return false;
    }
    
    // Type filter
    if (filters.type && filters.type !== 'all' && airdrop.type !== filters.type) {
      return false;
    }
    
    // Status filter
    if (filters.status && filters.status !== 'all' && airdrop.status !== filters.status) {
      return false;
    }
    
    return true;
  });
};

// ==================== LOCAL STORAGE ====================

export const saveToStorage = <T,>(key: string, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('Error saving to localStorage:', e);
  }
};

export const loadFromStorage = <T,>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    console.error('Error loading from localStorage:', e);
    return defaultValue;
  }
};

// ==================== EXPORT DEFAULT ====================

export default {
  formatDate,
  formatNumber,
  parseTokenAmount,
  calculateAirdropValue,
  truncateText,
  formatWalletAddress,
  validateWalletAddress,
  getChainExplorerUrl,
  sleep,
  generateId,
  calculateProgress,
  getStatusColor,
  getTypeColor,
  sortAirdropsByDate,
  sortAirdropsByProgress,
  filterAirdrops,
  saveToStorage,
  loadFromStorage
};