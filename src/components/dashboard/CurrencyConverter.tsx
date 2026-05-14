import { useCurrencyRate } from '@/hooks/use-currency-rate';
import { ArrowRightLeft, TrendingUp as TrendingUpIcon } from 'lucide-react';

interface CurrencyConverterProps {
  isDark: boolean;
}

export function CurrencyConverter({ isDark }: CurrencyConverterProps) {
  const { rate, loading, error, lastUpdated } = useCurrencyRate();

  const formatRate = (value: number) => {
    if (value >= 1) {
      return value.toFixed(0);
    }
    return value.toFixed(6);
  };

  const lastUpdatedLabel = lastUpdated
    ? lastUpdated.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'Loading...';

  return (
    <section className={`hud-panel relative overflow-hidden rounded-[1.1rem] border p-3 shadow-none h-full ${
      isDark 
        ? 'border-alpha-border bg-[color:var(--alpha-hover-soft)]' 
        : 'border-alpha-border bg-[color:var(--alpha-hover-soft)]'
    }`}>
      <span className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(184,207,206,0.16),transparent_52%)] opacity-50" />
      
      <div className="relative h-full flex flex-col">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-[0.8rem] border border-alpha-border bg-[color:var(--alpha-surface)] text-[#00BFA5]">
              <ArrowRightLeft className="h-3 w-3" />
            </div>
            <div className="min-w-0">
              <p className="text-[9px] uppercase tracking-[0.2em] alpha-text-muted">Exchange</p>
              <h3 className="text-[12px] font-semibold leading-none alpha-text">IDR / USD</h3>
            </div>
          </div>

          <span className="rounded-full border border-[#00BFA5]/20 bg-[#00BFA5]/10 px-2 py-0.5 text-[8px] uppercase tracking-[0.18em] text-[#00BFA5] flex-shrink-0">
            Live
          </span>
        </div>

        {loading && !rate ? (
          <div className="mt-2 flex-1 space-y-2">
            <div className="h-8 rounded-lg bg-[color:var(--alpha-border)]" />
            <div className="h-8 rounded-lg bg-[color:var(--alpha-border)]" />
          </div>
        ) : error || !rate ? (
          <p className="mt-2 text-[9px] alpha-text-muted">{error || 'Unable to load'}</p>
        ) : (
          <div className="mt-2 flex-1 space-y-1.5">
            <div className="flex items-center justify-between rounded-lg border border-alpha-border bg-[color:var(--alpha-surface)] px-2 py-1.5">
              <div>
                <p className="text-[8px] uppercase tracking-[0.18em] alpha-text-muted">1 USD</p>
                <p className="text-[12px] font-semibold tabular-nums alpha-text">{formatRate(rate.usdToIdr)} IDR</p>
              </div>
              <span className="text-[9px] alpha-text-muted">≈ Rp {Math.round(rate.usdToIdr).toLocaleString('id-ID')}</span>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-alpha-border bg-[color:var(--alpha-surface)] px-2 py-1.5">
              <div>
                <p className="text-[8px] uppercase tracking-[0.18em] alpha-text-muted">1 IDR</p>
                <p className="text-[12px] font-semibold tabular-nums alpha-text">${formatRate(rate.idrToUsd)}</p>
              </div>
              <span className="text-[9px] alpha-text-muted">{rate.idrToUsd.toFixed(7)}</span>
            </div>

            <p className="text-[8px] alpha-text-muted px-1">
              {lastUpdated ? `Updated ${lastUpdated.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}` : ''}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
