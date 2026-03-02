// hooks/use-prices.ts
import { useState, useEffect, useCallback } from 'react';
import { getCoinMarketData } from '@/services/price';

interface CoinData {
  id: string;
  current_price: number;
  price_change_percentage_24h: number;
}

interface PriceData {
  [key: string]: {
    usd: number;
    usd_24h_change?: number;
  };
}

export const usePrices = (coinIds: string[]) => {
  const [prices, setPrices] = useState<PriceData>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPrices = useCallback(async () => {
    if (coinIds.length === 0) return;
    
    setLoading(true);
    setError(null);
    try {
      const data = await getCoinMarketData(coinIds) as CoinData[];
      const priceMap: PriceData = {};
      data.forEach((coin) => {
        priceMap[coin.id] = {
          usd: coin.current_price,
          usd_24h_change: coin.price_change_percentage_24h
        };
      });
      setPrices(priceMap);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch prices');
    } finally {
      setLoading(false);
    }
  }, [coinIds.join(',')]);

  useEffect(() => {
    fetchPrices();
    const interval = setInterval(fetchPrices, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, [fetchPrices]);

  return {
    prices,
    loading,
    error,
    refetch: fetchPrices
  };
};