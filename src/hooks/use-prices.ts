// hooks/use-prices.ts
import { useState, useEffect, useCallback, useMemo } from 'react';
import { getCoinMarketData, getSimplePrices } from '@/services/price';

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

interface SimplePriceData {
  [key: string]: {
    usd?: number;
    usd_24h_change?: number;
  };
}

export const usePrices = (coinIds: string[]) => {
  const [prices, setPrices] = useState<PriceData>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<Date | null>(null);
  const coinIdsKey = useMemo(() => coinIds.join(','), [coinIds]);

  const fetchPrices = useCallback(async () => {
    const requestedCoinIds = coinIdsKey.split(',').filter(Boolean);
    if (requestedCoinIds.length === 0) return;

    setLoading(true);
    setError(null);
    try {
      let priceMap: PriceData = {};

      try {
        const simpleData = await getSimplePrices(requestedCoinIds) as SimplePriceData;
        requestedCoinIds.forEach((coinId) => {
          const coin = simpleData[coinId];
          if (coin?.usd == null) return;

          priceMap[coinId] = {
            usd: coin.usd,
            usd_24h_change: coin.usd_24h_change,
          };
        });
      } catch {
        priceMap = {};
      }

      if (Object.keys(priceMap).length === 0) {
        const marketData = await getCoinMarketData(requestedCoinIds) as CoinData[];
        marketData.forEach((coin) => {
          priceMap[coin.id] = {
            usd: coin.current_price,
            usd_24h_change: coin.price_change_percentage_24h
          };
        });
      }

      if (Object.keys(priceMap).length === 0) {
        throw new Error('Price feed is unavailable');
      }

      setPrices(priceMap);
      setLastUpdatedAt(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch prices');
    } finally {
      setLoading(false);
    }
  }, [coinIdsKey]);

  useEffect(() => {
    fetchPrices();
    const interval = setInterval(fetchPrices, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, [fetchPrices]);

  return {
    prices,
    loading,
    error,
    lastUpdatedAt,
    refetch: fetchPrices
  };
};
