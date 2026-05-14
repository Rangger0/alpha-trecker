// services/price.ts
import axios from 'axios';

const COINGECKO_API = 'https://api.coingecko.com/api/v3';

// Type Definitions
interface CoinPriceResponse {
  [key: string]: {
    usd: number;
    usd_24h_change?: number;
  };
}

interface CoinMarketItem {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  total_volume: number;
  image: string;
}

interface SearchCoinItem {
  id: string;
  name: string;
  symbol: string;
  market_cap_rank: number;
  thumb: string;
  large: string;
}

interface SearchResponse {
  coins: SearchCoinItem[];
}

interface TrendingCoinItem {
  item: {
    id: string;
    name: string;
    symbol: string;
    market_cap_rank: number;
    thumb: string;
    large: string;
  };
}

interface TrendingResponse {
  coins: TrendingCoinItem[];
}

interface CMCQuote {
  price: number;
  percent_change_24h: number;
  market_cap: number;
  volume_24h: number;
}

interface CMCData {
  [key: string]: {
    id: number;
    name: string;
    symbol: string;
    quote: {
      USD: CMCQuote;
    };
  };
}

interface CMCResponse {
  data: CMCData;
}

// CoinGecko API (Free - No API Key Required)
export const getCoinPrice = async (coinId: string) => {
  const url = `${COINGECKO_API}/simple/price?ids=${coinId}&vs_currencies=usd&include_24hr_change=true`;
  const response = await axios.get<CoinPriceResponse>(url);
  return response.data[coinId];
};

export const getSimplePrices = async (coinIds: string[]) => {
  const url = `${COINGECKO_API}/simple/price?ids=${coinIds.join(',')}&vs_currencies=usd&include_24hr_change=true`;
  const response = await axios.get<CoinPriceResponse>(url);
  return response.data;
};

export const getCoinMarketData = async (coinIds: string[]) => {
  const url = `${COINGECKO_API}/coins/markets?vs_currency=usd&ids=${coinIds.join(',')}&order=market_cap_desc&per_page=100&page=1&sparkline=false`;
  const response = await axios.get<CoinMarketItem[]>(url);
  return response.data;
};

export const searchCoins = async (query: string) => {
  const url = `${COINGECKO_API}/search?query=${query}`;
  const response = await axios.get<SearchResponse>(url);
  return response.data.coins;
};

export const getTrendingCoins = async () => {
  const url = `${COINGECKO_API}/search/trending`;
  const response = await axios.get<TrendingResponse>(url);
  return response.data.coins;
};

// CoinMarketCap API (alternative - requires API key)
const CMC_API_KEY = 'YourCMCApiKey'; // Ganti dengan API key Anda

export const getCMCPrice = async (symbol: string) => {
  const url = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${symbol}`;
  const response = await axios.get<CMCResponse>(url, {
    headers: {
      'X-CMC_PRO_API_KEY': CMC_API_KEY
    }
  });
  return response.data.data[symbol];
};

// Helper function untuk format price
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 6
  }).format(price);
};

// Helper function untuk format percentage
export const formatPercentage = (percentage: number): string => {
  const sign = percentage >= 0 ? '+' : '';
  return `${sign}${percentage.toFixed(2)}%`;
};

// Get exchange rate IDR to USD
export const getExchangeRateIDRtoUSD = async () => {
  try {
    // Use USD to get IDR rate via fiat conversion
    const url = `${COINGECKO_API}/simple/price?ids=bitcoin&vs_currencies=idr,usd`;
    const response = await axios.get(url, { timeout: 5000 });
    const payload = response.data as { bitcoin?: { usd?: number; idr?: number } };
    const btcUsd = payload.bitcoin?.usd;
    const btcIdr = payload.bitcoin?.idr;
    
    if (btcUsd && btcIdr) {
      const usdToIdr = btcIdr / btcUsd;
      return {
        idrToUsd: 1 / usdToIdr,
        usdToIdr,
        timestamp: new Date(),
      };
    }
    
    return null;
  } catch (error) {
    console.error('Failed to fetch IDR/USD exchange rate:', error);
    return null;
  }
};
