import { useEffect, useState } from 'react';
import { getExchangeRateIDRtoUSD } from '@/services/price';

interface ExchangeRate {
  idrToUsd: number;
  usdToIdr: number;
  timestamp: Date;
}

export function useCurrencyRate() {
  const [rate, setRate] = useState<ExchangeRate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    const fetchRate = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getExchangeRateIDRtoUSD();
        if (data) {
          setRate(data);
          setLastUpdated(new Date());
        } else {
          setError('Unable to fetch exchange rate');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch exchange rate');
      } finally {
        setLoading(false);
      }
    };

    // Fetch immediately
    fetchRate();

    // Refresh every 60 seconds
    const interval = setInterval(fetchRate, 60000);

    return () => clearInterval(interval);
  }, []);

  return { rate, loading, error, lastUpdated };
}
