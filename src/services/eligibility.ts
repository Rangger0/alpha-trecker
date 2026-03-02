// services/eligibility.ts
import { getTokenBalances, getWalletNFTs, getNormalTransactions } from './wallet';

export interface EligibilityCriteria {
  minTokenBalance?: number;
  tokenContract?: string;
  requiredNFT?: string;
  minTransactions?: number;
  snapshotBlock?: number;
  protocols?: string[];
}

export interface EligibilityResult {
  isEligible: boolean;
  wallet: string;
  checks: {
    tokenBalance: boolean;
    nftHoldings: boolean;
    transactionCount: boolean;
    protocolInteractions: boolean;
  };
  details: {
    balance: string;
    nftCount: number;
    txCount: number;
    estimatedValue: number;
  };
}

interface TokenBalance {
  token_address: string;
  balance: string;
  decimals: string;
}

interface NFTItem {
  token_address: string;
}

interface Transaction {
  hash: string;
}

export const checkAirdropEligibility = async (
  walletAddress: string,
  criteria: EligibilityCriteria
): Promise<EligibilityResult> => {
  const checks = {
    tokenBalance: false,
    nftHoldings: false,
    transactionCount: false,
    protocolInteractions: false
  };

  const details = {
    balance: '0',
    nftCount: 0,
    txCount: 0,
    estimatedValue: 0
  };

  try {
    // Check 1: Token Balance
    if (criteria.tokenContract) {
      const balances = await getTokenBalances(walletAddress) as TokenBalance[];
      const targetToken = balances.find((t) => 
        t.token_address.toLowerCase() === criteria.tokenContract?.toLowerCase()
      );
      if (targetToken) {
        const balance = parseFloat(targetToken.balance) / Math.pow(10, parseInt(targetToken.decimals));
        details.balance = balance.toString();
        checks.tokenBalance = criteria.minTokenBalance ? balance >= criteria.minTokenBalance : true;
      }
    } else {
      checks.tokenBalance = true; // Skip if no contract specified
    }

    // Check 2: NFT Holdings
    if (criteria.requiredNFT) {
      const nfts = await getWalletNFTs(walletAddress) as NFTItem[];
      const hasRequiredNFT = nfts.some((nft) => 
        nft.token_address.toLowerCase() === criteria.requiredNFT?.toLowerCase()
      );
      checks.nftHoldings = hasRequiredNFT;
      details.nftCount = nfts.length;
    } else {
      checks.nftHoldings = true; // Skip if no NFT required
    }

    // Check 3: Transaction Count
    if (criteria.minTransactions) {
      const transactions = await getNormalTransactions(walletAddress) as Transaction[];
      details.txCount = transactions.length;
      checks.transactionCount = transactions.length >= criteria.minTransactions;
    } else {
      checks.transactionCount = true; // Skip if no min transactions specified
    }

    // Protocol interactions (mock for now)
    checks.protocolInteractions = true;

    // Calculate estimated value (mock calculation)
    details.estimatedValue = Math.random() * 1000; // Replace with actual calculation

    const isEligible = Object.values(checks).every(check => check);

    return {
      isEligible,
      wallet: walletAddress,
      checks,
      details
    };
  } catch (error) {
    console.error('Eligibility check failed:', error);
    // Return not eligible if check fails
    return {
      isEligible: false,
      wallet: walletAddress,
      checks,
      details
    };
  }
};

export const batchCheckEligibility = async (
  wallets: string[],
  criteria: EligibilityCriteria
): Promise<EligibilityResult[]> => {
  const results = await Promise.all(
    wallets.map(wallet => checkAirdropEligibility(wallet, criteria))
  );
  return results;
};