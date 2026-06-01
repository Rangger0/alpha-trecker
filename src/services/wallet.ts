// services/wallet.ts
import axios from 'axios';

const ETHERSCAN_API_KEY = import.meta.env.VITE_ETHERSCAN_API_KEY as string | undefined;
const BSCSCAN_API_KEY = import.meta.env.VITE_BSCSCAN_API_KEY as string | undefined;
const MORALIS_API_KEY = import.meta.env.VITE_MORALIS_API_KEY as string | undefined;
const COVALENT_API_KEY = import.meta.env.VITE_COVALENT_API_KEY as string | undefined;

function requireApiKey(value: string | undefined, provider: string) {
  if (!value) throw new Error(`${provider} API key is not configured`);
  return value;
}

interface EtherscanResponse<T> {
  status: string;
  message: string;
  result: T;
}

interface TokenTx {
  token_address: string;
  balance: string;
  decimals: string;
}

interface NFTItem {
  token_address: string;
  token_id: string;
}

interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
}

// Etherscan API
export const getWalletBalance = async (address: string): Promise<string> => {
  const apiKey = requireApiKey(ETHERSCAN_API_KEY, 'Etherscan');
  const url = `https://api.etherscan.io/api?module=account&action=balance&address=${address}&tag=latest&apikey=${apiKey}`;
  const response = await axios.get<EtherscanResponse<string>>(url);
  return response.data.result;
};

export const getTokenTransactions = async (address: string, contractAddress?: string): Promise<TokenTx[]> => {
  const apiKey = requireApiKey(ETHERSCAN_API_KEY, 'Etherscan');
  const url = contractAddress 
    ? `https://api.etherscan.io/api?module=account&action=tokentx&contractaddress=${contractAddress}&address=${address}&page=1&offset=100&sort=desc&apikey=${apiKey}`
    : `https://api.etherscan.io/api?module=account&action=tokentx&address=${address}&page=1&offset=100&sort=desc&apikey=${apiKey}`;
  const response = await axios.get<EtherscanResponse<TokenTx[]>>(url);
  return response.data.result;
};

export const getNormalTransactions = async (address: string): Promise<Transaction[]> => {
  const apiKey = requireApiKey(ETHERSCAN_API_KEY, 'Etherscan');
  const url = `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=100&sort=desc&apikey=${apiKey}`;
  const response = await axios.get<EtherscanResponse<Transaction[]>>(url);
  return response.data.result;
};

// BscScan API
export const getBSCWalletBalance = async (address: string): Promise<string> => {
  const apiKey = requireApiKey(BSCSCAN_API_KEY, 'BscScan');
  const url = `https://api.bscscan.com/api?module=account&action=balance&address=${address}&tag=latest&apikey=${apiKey}`;
  const response = await axios.get<EtherscanResponse<string>>(url);
  return response.data.result;
};

// Moralis API - Multi-chain
interface MoralisNFTResponse {
  result: NFTItem[];
}

interface MoralisTokenResponse {
  result: TokenTx[];
}

export const getWalletNFTs = async (address: string, chain: string = 'eth'): Promise<NFTItem[]> => {
  const apiKey = requireApiKey(MORALIS_API_KEY, 'Moralis');
  const url = `https://deep-index.moralis.io/api/v2/${address}/nft?chain=${chain}&format=decimal`;
  const response = await axios.get<MoralisNFTResponse>(url, {
    headers: {
      'X-API-Key': apiKey
    }
  });
  return response.data.result;
};

export const getTokenBalances = async (address: string, chain: string = 'eth'): Promise<TokenTx[]> => {
  const apiKey = requireApiKey(MORALIS_API_KEY, 'Moralis');
  const url = `https://deep-index.moralis.io/api/v2/${address}/erc20?chain=${chain}`;
  const response = await axios.get<MoralisTokenResponse>(url, {
    headers: {
      'X-API-Key': apiKey
    }
  });
  return response.data.result;
};

// Covalent API
interface CovalentBalanceItem {
  contract_address: string;
  balance: string;
}

interface CovalentResponse {
  data: {
    items: CovalentBalanceItem[];
  };
}

export const getCovalentBalances = async (chainId: number, address: string): Promise<CovalentBalanceItem[]> => {
  const apiKey = requireApiKey(COVALENT_API_KEY, 'Covalent');
  const url = `https://api.covalenthq.com/v1/${chainId}/address/${address}/balances_v2/?key=${apiKey}`;
  const response = await axios.get<CovalentResponse>(url);
  return response.data.data.items;
};
