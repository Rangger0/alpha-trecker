import { chainDirectory, chainDirectoryMap } from '@/lib/chain-directory';
import type { FaucetEnvironment } from '@/lib/faucet-directory';

export interface FaucetManualChainOption {
  id: string;
  name: string;
  shortName: string;
  logo: string;
  accent: string;
}

export interface FaucetNetworkTemplate {
  id: string;
  chainId: string;
  label: string;
  networkName: string;
  environment: FaucetEnvironment;
  token: string;
  providerHint: string;
  logo: string;
  accent: string;
  note: string;
}

export const faucetManualChainOptions: FaucetManualChainOption[] = [
  ...chainDirectory.map((entry) => ({
    id: entry.id,
    name: entry.name,
    shortName: entry.shortName,
    logo: entry.logo,
    accent: entry.accent,
  })),
  {
    id: 'custom',
    name: 'Custom Chain',
    shortName: 'NEW',
    logo: '/logo.png',
    accent: '#F97316',
  },
];

export const faucetManualChainMap = Object.fromEntries(
  faucetManualChainOptions.map((entry) => [entry.id, entry]),
) as Record<string, FaucetManualChainOption>;

const makeTemplate = (
  id: string,
  chainId: string,
  label: string,
  networkName: string,
  environment: FaucetEnvironment,
  token: string,
  providerHint: string,
  note: string,
): FaucetNetworkTemplate => {
  const chain =
    faucetManualChainMap[chainId] ??
    (chainId in chainDirectoryMap
      ? {
          id: chainId,
          name: chainDirectoryMap[chainId].name,
          shortName: chainDirectoryMap[chainId].shortName,
          logo: chainDirectoryMap[chainId].logo,
          accent: chainDirectoryMap[chainId].accent,
        }
      : faucetManualChainMap.custom);

  return {
    id,
    chainId,
    label,
    networkName,
    environment,
    token,
    providerHint,
    logo: chain.logo,
    accent: chain.accent,
    note,
  };
};

export const faucetNetworkTemplates: FaucetNetworkTemplate[] = [
  makeTemplate(
    'ethereum-sepolia',
    'ethereum',
    'Ethereum / Sepolia',
    'Ethereum Sepolia',
    'Testnet',
    'Sepolia ETH',
    'Alchemy Faucet',
    'Default testnet Ethereum untuk deploy, ERC-20, dan ERC-721.',
  ),
  makeTemplate(
    'ethereum-hoodi',
    'ethereum',
    'Ethereum / Hoodi',
    'Ethereum Hoodi',
    'Testnet',
    'Hoodi ETH',
    'Public Faucet',
    'Template buat faucet Ethereum testnet terbaru pengganti Holesky.',
  ),
  makeTemplate(
    'base-sepolia',
    'base',
    'Base / Sepolia',
    'Base Sepolia',
    'Testnet',
    'Base Sepolia ETH',
    'Coinbase CDP Faucet',
    'Paling cocok untuk builder Base dan deploy app di Base testnet.',
  ),
  makeTemplate(
    'arbitrum-sepolia',
    'arbitrum',
    'Arbitrum / Sepolia',
    'Arbitrum Sepolia',
    'Testnet',
    'Arbitrum Sepolia ETH',
    'Alchemy Faucet',
    'Dipakai luas untuk uji smart contract, tx, dan bridge di Arbitrum.',
  ),
  makeTemplate(
    'polygon-amoy',
    'polygon',
    'Polygon / Amoy',
    'Polygon Amoy',
    'Testnet',
    'POL / Amoy gas',
    'Polygon Faucet',
    'Template default buat faucet PoS testnet Polygon yang aktif saat ini.',
  ),
  makeTemplate(
    'bnb-testnet',
    'bnbchain',
    'BNB Chain / Testnet',
    'BNB Chain Testnet',
    'Testnet',
    'tBNB',
    'BNB Chain Faucet',
    'Untuk deploy atau tes transaksi EVM di BNB Chain testnet.',
  ),
  makeTemplate(
    'avalanche-fuji',
    'avalanche',
    'Avalanche / Fuji',
    'Avalanche Fuji',
    'Testnet',
    'Fuji AVAX',
    'Core Faucet',
    'Dipakai untuk test C-Chain dan flow wallet Avalanche.',
  ),
  makeTemplate(
    'berachain-bepolia',
    'berachain',
    'Berachain / Bepolia',
    'Berachain Bepolia',
    'Testnet',
    'BERA',
    'Bera Hub Faucet',
    'Template resmi Berachain testnet yang sekarang aktif untuk builder dan user.',
  ),
  makeTemplate(
    'monad-testnet',
    'monad',
    'Monad / Testnet',
    'Monad Testnet',
    'Testnet',
    'MON',
    'Monad Faucet',
    'Template resmi untuk claim MON di public testnet Monad.',
  ),
  makeTemplate(
    'pharos-testnet',
    'pharos',
    'Pharos / Testnet',
    'Pharos Testnet',
    'Testnet',
    'PHRS',
    'Pharos Faucet',
    'Template buat testnet Pharos yang dipakai untuk interaksi ecosystem dan quest.',
  ),
  makeTemplate(
    'solana-devnet',
    'solana',
    'Solana / Devnet',
    'Solana Devnet',
    'Devnet',
    'Devnet SOL',
    'Solana Faucet',
    'Pilihan paling umum buat test token, NFT, dan tx di Solana.',
  ),
  makeTemplate(
    'solana-testnet',
    'solana',
    'Solana / Testnet',
    'Solana Testnet',
    'Testnet',
    'Testnet SOL',
    'Public Faucet',
    'Bisa dipakai kalau kamu butuh simpan link testnet Solana khusus di luar devnet.',
  ),
  makeTemplate(
    'sui-testnet',
    'sui',
    'Sui / Testnet',
    'Sui Testnet',
    'Testnet',
    'Testnet SUI',
    'Sui Faucet',
    'Template untuk publish package, mint NFT, dan test tx Sui.',
  ),
  makeTemplate(
    'custom-testnet',
    'custom',
    'Custom / Any Testnet',
    '',
    'Testnet',
    'Native token',
    '',
    'Pakai ini kalau ada testnet baru yang belum masuk list. Kamu bisa isi nama network dan logo path sendiri.',
  ),
];

export const faucetNetworkTemplateMap = Object.fromEntries(
  faucetNetworkTemplates.map((entry) => [entry.id, entry]),
) as Record<string, FaucetNetworkTemplate>;
