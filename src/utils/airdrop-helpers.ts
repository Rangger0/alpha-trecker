export const calculateAirdropValue = (
  tokenAmount: string,
  tokenPrice: number,
  decimals: number = 18
): number => {
  const amount = parseFloat(tokenAmount) / Math.pow(10, decimals);
  return amount * tokenPrice;
};

export const formatWalletAddress = (address: string): string => {
  if (!address || address.length < 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const getChainExplorerUrl = (chain: string, address: string): string => {
  const explorers: Record<string, string> = {
    eth: 'https://etherscan.io/address/',
    bsc: 'https://bscscan.com/address/',
    polygon: 'https://polygonscan.com/address/',
    arbitrum: 'https://arbiscan.io/address/',
    optimism: 'https://optimistic.etherscan.io/address/'
  };
  return `${explorers[chain] || explorers.eth}${address}`;
};

export const validateWalletAddress = (address: string): boolean => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};

export const parseTokenAmount = (amount: string, decimals: number): string => {
  const parsed = parseFloat(amount) / Math.pow(10, decimals);
  return parsed.toLocaleString('en-US', { maximumFractionDigits: 6 });
};