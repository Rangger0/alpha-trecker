import { chainDirectoryMap, type ChainFamily } from '@/lib/chain-directory';

export type ScreeningEnvironment = 'Mainnet' | 'Testnet';

export interface ScreeningNetwork {
  id: string;
  name: string;
  family: ChainFamily;
  environment: ScreeningEnvironment;
  chainId: keyof typeof chainDirectoryMap;
  rpcUrl: string;
  explorerUrl: string;
  methodLabel: string;
  logo: string;
  accent: string;
}

const makeNetwork = (
  id: string,
  chainId: keyof typeof chainDirectoryMap,
  family: ChainFamily,
  environment: ScreeningEnvironment,
  suffix: string,
  rpcUrl: string,
  explorerUrl: string,
  methodLabel: string,
): ScreeningNetwork => {
  const chain = chainDirectoryMap[chainId];

  return {
    id,
    name: suffix ? `${chain.name} ${suffix}` : chain.name,
    family,
    environment,
    chainId,
    rpcUrl,
    explorerUrl,
    methodLabel,
    logo: chain.logo,
    accent: chain.accent,
  };
};

export const screeningNetworks: ScreeningNetwork[] = [
  makeNetwork(
    'ethereum-mainnet',
    'ethereum',
    'evm',
    'Mainnet',
    'Mainnet',
    'https://ethereum-rpc.publicnode.com',
    'https://etherscan.io/address/',
    'Public RPC',
  ),
  makeNetwork(
    'ethereum-sepolia',
    'ethereum',
    'evm',
    'Testnet',
    'Sepolia',
    'https://ethereum-sepolia-rpc.publicnode.com',
    'https://sepolia.etherscan.io/address/',
    'Public RPC',
  ),
  makeNetwork(
    'base-mainnet',
    'base',
    'evm',
    'Mainnet',
    'Mainnet',
    'https://base-rpc.publicnode.com',
    'https://basescan.org/address/',
    'Public RPC',
  ),
  makeNetwork(
    'base-sepolia',
    'base',
    'evm',
    'Testnet',
    'Sepolia',
    'https://base-sepolia-rpc.publicnode.com',
    'https://sepolia.basescan.org/address/',
    'Public RPC',
  ),
  makeNetwork(
    'arbitrum-mainnet',
    'arbitrum',
    'evm',
    'Mainnet',
    'One',
    'https://arbitrum-one-rpc.publicnode.com',
    'https://arbiscan.io/address/',
    'Public RPC',
  ),
  makeNetwork(
    'arbitrum-sepolia',
    'arbitrum',
    'evm',
    'Testnet',
    'Sepolia',
    'https://arbitrum-sepolia-rpc.publicnode.com',
    'https://sepolia.arbiscan.io/address/',
    'Public RPC',
  ),
  makeNetwork(
    'polygon-mainnet',
    'polygon',
    'evm',
    'Mainnet',
    'Mainnet',
    'https://polygon-bor-rpc.publicnode.com',
    'https://polygonscan.com/address/',
    'Public RPC',
  ),
  makeNetwork(
    'polygon-amoy',
    'polygon',
    'evm',
    'Testnet',
    'Amoy',
    'https://polygon-amoy-bor-rpc.publicnode.com',
    'https://amoy.polygonscan.com/address/',
    'Public RPC',
  ),
  makeNetwork(
    'bnb-mainnet',
    'bnbchain',
    'evm',
    'Mainnet',
    'Mainnet',
    'https://bsc-rpc.publicnode.com',
    'https://bscscan.com/address/',
    'Public RPC',
  ),
  makeNetwork(
    'bnb-testnet',
    'bnbchain',
    'evm',
    'Testnet',
    'Testnet',
    'https://bsc-testnet-rpc.publicnode.com',
    'https://testnet.bscscan.com/address/',
    'Public RPC',
  ),
  makeNetwork(
    'avalanche-mainnet',
    'avalanche',
    'evm',
    'Mainnet',
    'C-Chain',
    'https://avalanche-c-chain-rpc.publicnode.com',
    'https://snowtrace.io/address/',
    'Public RPC',
  ),
  makeNetwork(
    'avalanche-fuji',
    'avalanche',
    'evm',
    'Testnet',
    'Fuji',
    'https://avalanche-fuji-c-chain-rpc.publicnode.com',
    'https://testnet.snowtrace.io/address/',
    'Public RPC',
  ),
  makeNetwork(
    'solana-mainnet',
    'solana',
    'solana',
    'Mainnet',
    'Mainnet',
    'https://solana-rpc.publicnode.com',
    'https://solscan.io/account/',
    'Public RPC',
  ),
  makeNetwork(
    'solana-devnet',
    'solana',
    'solana',
    'Testnet',
    'Devnet',
    'https://api.devnet.solana.com',
    'https://solscan.io/account/',
    'Official RPC',
  ),
  makeNetwork(
    'sui-mainnet',
    'sui',
    'sui',
    'Mainnet',
    'Mainnet',
    'https://sui-rpc.publicnode.com',
    'https://suiscan.xyz/mainnet/account/',
    'Public RPC',
  ),
  makeNetwork(
    'sui-testnet',
    'sui',
    'sui',
    'Testnet',
    'Testnet',
    'https://sui-testnet-rpc.publicnode.com',
    'https://suiscan.xyz/testnet/account/',
    'Public RPC',
  ),
];
