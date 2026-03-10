import { useMemo, type CSSProperties } from "react";
import { Flame, RefreshCw, Signal, WifiOff } from "lucide-react";
import { useGasFees } from "@/hooks/use-gas-fees";
import { usePrices } from "@/hooks/use-prices";

const NATIVE_PRICE_IDS: Record<number, string> = {
  1: "ethereum",
  56: "binancecoin",
  137: "matic-network",
  42161: "ethereum",
  10: "ethereum",
  8453: "ethereum",
  43114: "avalanche-2",
  250: "fantom",
  100: "gnosis",
  59144: "ethereum",
  81457: "ethereum",
  324: "ethereum",
  534352: "ethereum",
  5000: "mantle",
  34443: "ethereum",
  130: "ethereum",
  1329: "sei-network",
  146: "fantom",
  57073: "ethereum",
  167000: "ethereum",
};

const BASIC_TX_GAS_UNITS = 21000;

const formatGasValue = (value?: number) => {
  if (value == null || Number.isNaN(value)) return "--";
  if (value >= 100) return value.toFixed(0);
  if (value >= 10) return value.toFixed(1);
  return value.toFixed(2);
};

const estimateUsdFee = (gwei?: number, nativeUsd?: number) => {
  if (gwei == null || nativeUsd == null || Number.isNaN(gwei) || Number.isNaN(nativeUsd)) return undefined;
  return (gwei * BASIC_TX_GAS_UNITS * nativeUsd) / 1_000_000_000;
};

const formatUsdFee = (value?: number) => {
  if (value == null || Number.isNaN(value)) return "--";
  if (value > 0 && value < 0.01) return "<$0.01";
  return `$${value.toFixed(2)}`;
};

const formatUpdatedAt = (timestamp: number | null) => {
  if (!timestamp) return "--";

  return new Date(timestamp).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export function GasFeesPanel() {
  const { items, lastUpdated, totalChains, loading, error } = useGasFees();
  const visibleChainsLabel = totalChains > 0 ? `${items.length} chains live` : "Live";
  const nativeCoinIds = useMemo(
    () => Array.from(new Set(items.map((item) => NATIVE_PRICE_IDS[item.chainId]).filter(Boolean))),
    [items]
  );
  const { prices } = usePrices(nativeCoinIds);
  const valueMutedClassName = "alpha-text-muted";
  const emphasisTextClassName = "text-gold";
  const emphasisMutedClassName = "text-gold/80";
  const chipSurfaceClassName = "bg-[color:var(--alpha-surface-soft)]";
  const chipValueTextClassName = "alpha-text";
  const chipMutedTextClassName = "alpha-text-muted";

  return (
    <section className="rounded-[1.15rem] border border-alpha-border bg-[color:var(--alpha-hover-soft)] px-4 py-4 shadow-none">
      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-alpha-border bg-[color:var(--alpha-surface)] px-3 py-1 text-[10px] uppercase tracking-[0.18em] alpha-text-muted">
            <Signal className="h-3.5 w-3.5 text-gold" />
            Watchoor
          </div>
          <h4 className="mt-3 text-[16px] font-semibold alpha-text">Live gas fee</h4>
          <p className="mt-1.5 max-w-xl text-[12px] leading-5 alpha-text-muted">
            Snapshot biaya estimasi untuk basic transaction 21k gas. Layout ini dibikin lebih ringkas biar gampang scan chain yang lagi murah, normal, atau mahal.
          </p>
        </div>

        <div className="rounded-full border border-gold/20 bg-gold/10 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-gold">
          {visibleChainsLabel}
        </div>
      </div>

      {loading ? (
        <div className="mt-4 grid max-h-[280px] grid-cols-1 gap-3 overflow-y-auto pr-1 sm:grid-cols-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="rounded-[1rem] border border-alpha-border bg-[color:var(--alpha-surface)] px-3.5 py-3.5"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="h-3 w-24 rounded-full bg-[color:var(--alpha-border)]" />
                <div className="h-4 w-16 rounded-full bg-[color:var(--alpha-border)]" />
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <div className="h-11 rounded-[0.8rem] bg-[color:var(--alpha-border)]" />
                <div className="h-11 rounded-[0.8rem] bg-[color:var(--alpha-border)]" />
              </div>
              <div className="mt-2.5 grid grid-cols-3 gap-2">
                <div className="h-12 rounded-[0.8rem] bg-[color:var(--alpha-border)]" />
                <div className="h-12 rounded-[0.8rem] bg-[color:var(--alpha-border)]" />
                <div className="h-12 rounded-[0.8rem] bg-[color:var(--alpha-border)]" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="mt-4 rounded-[1rem] border border-[color:var(--alpha-danger-border)] bg-[color:var(--alpha-danger-soft)] px-4 py-4 text-sm text-[color:var(--alpha-danger)]">
          <div className="flex items-start gap-3">
            <WifiOff className="mt-0.5 h-4 w-4 shrink-0" />
            <div>
              <p className="font-medium">Gas feed belum bisa dimuat.</p>
              <p className="mt-1 text-[12px] leading-5 opacity-80">{error}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-4 grid max-h-[280px] grid-cols-1 gap-3 overflow-y-auto pr-1 sm:grid-cols-2">
          {items.map((item, index) => (
            <div
              key={item.chainId}
              className="macos-card-entry min-h-[206px] rounded-[1rem] border border-alpha-border bg-[color:var(--alpha-surface)] px-3.5 py-3.5 shadow-none"
              style={{ '--mac-delay': `${index * 18}ms` } as CSSProperties}
            >
              {(() => {
                const nativeUsd = prices[NATIVE_PRICE_IDS[item.chainId]]?.usd;
                const lowUsd = estimateUsdFee(item.lowFee, nativeUsd);
                const mediumUsd = estimateUsdFee(item.fastFee ?? item.maxFee, nativeUsd);
                const highUsd = estimateUsdFee(item.highFee ?? item.maxFee, nativeUsd);
                const mediumGwei = item.fastFee ?? item.maxFee;

                return (
                  <>
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  {item.icon ? (
                    <img
                      src={item.icon}
                      alt={item.label}
                      className="h-9 w-9 rounded-[0.9rem] border border-alpha-border bg-[color:var(--alpha-surface-soft)] object-cover p-1.5"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-9 w-9 items-center justify-center rounded-[0.9rem] border border-alpha-border bg-[color:var(--alpha-surface-soft)] text-xs font-semibold alpha-text">
                      {item.label.slice(0, 2).toUpperCase()}
                    </div>
                  )}

                  <div className="min-w-0">
                    <p className="truncate text-[14px] font-semibold alpha-text">{item.label}</p>
                    <p className="mt-0.5 text-[9px] uppercase tracking-[0.16em] alpha-text-muted">
                      #{item.chainId} • {item.system}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <p className="text-[9px] uppercase tracking-[0.16em] alpha-text-muted">Est. tx</p>
                  <p className={`mt-1.5 font-mono text-[15px] font-semibold tabular-nums ${emphasisTextClassName}`}>{formatUsdFee(mediumUsd)}</p>
                  <p className={`mt-0.5 font-mono text-[10px] tabular-nums ${valueMutedClassName}`}>{formatGasValue(mediumGwei)} gwei</p>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2">
                <div className={`rounded-[0.9rem] border border-alpha-border px-3 py-2 ${chipSurfaceClassName}`}>
                  <p className={`text-[8px] uppercase tracking-[0.18em] ${chipMutedTextClassName}`}>Base fee</p>
                  <p className={`mt-1.5 font-mono text-[13px] font-semibold tabular-nums ${chipValueTextClassName}`}>
                    {formatGasValue(item.baseFee)} gwei
                  </p>
                </div>
                <div className={`rounded-[0.9rem] border border-alpha-border px-3 py-2 ${chipSurfaceClassName}`}>
                  <p className={`text-[8px] uppercase tracking-[0.18em] ${chipMutedTextClassName}`}>Priority</p>
                  <p className={`mt-1.5 font-mono text-[13px] font-semibold tabular-nums ${chipValueTextClassName}`}>
                    {formatGasValue(item.priorityFee)} gwei
                  </p>
                </div>
              </div>

              <div className="mt-2.5 grid grid-cols-3 gap-2">
                <div className={`rounded-[0.9rem] border border-alpha-border px-2.5 py-2 text-center ${chipSurfaceClassName}`}>
                  <p className={`text-[8px] uppercase tracking-[0.16em] ${chipMutedTextClassName}`}>Low</p>
                    <p className={`mt-1.5 font-mono text-[11px] font-semibold tabular-nums ${chipValueTextClassName}`}>{formatUsdFee(lowUsd)}</p>
                    <p className={`mt-0.5 font-mono text-[9px] tabular-nums ${chipMutedTextClassName}`}>{formatGasValue(item.lowFee)} gwei</p>
                  </div>
                <div className="rounded-[0.9rem] border border-gold/20 bg-gold/10 px-2.5 py-2 text-center">
                  <p className={`text-[8px] uppercase tracking-[0.16em] ${emphasisTextClassName}`}>Medium</p>
                  <p className={`mt-1.5 font-mono text-[11px] font-semibold tabular-nums ${emphasisTextClassName}`}>{formatUsdFee(mediumUsd)}</p>
                  <p className={`mt-0.5 font-mono text-[9px] tabular-nums ${emphasisMutedClassName}`}>{formatGasValue(mediumGwei)} gwei</p>
                </div>
                <div className={`rounded-[0.9rem] border border-alpha-border px-2.5 py-2 text-center ${chipSurfaceClassName}`}>
                  <p className={`text-[8px] uppercase tracking-[0.16em] ${chipMutedTextClassName}`}>High</p>
                  <p className={`mt-1.5 font-mono text-[11px] font-semibold tabular-nums ${chipValueTextClassName}`}>{formatUsdFee(highUsd)}</p>
                  <p className={`mt-0.5 font-mono text-[9px] tabular-nums ${chipMutedTextClassName}`}>{formatGasValue(item.highFee ?? item.maxFee)} gwei</p>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between gap-2 text-[10px] alpha-text-muted">
                <span className="font-mono tabular-nums">{item.confidence ?? 90}% confidence</span>
                <span>{item.network}</span>
              </div>
                  </>
                );
              })()}
            </div>
          ))}
        </div>
      )}

      <div className="mt-2.5 flex items-center justify-between gap-3 text-[10px] alpha-text-muted">
        <span className="inline-flex items-center gap-2">
          <RefreshCw className="h-3.5 w-3.5" />
          Refresh sekitar tiap 75 detik
        </span>
        <span className="inline-flex items-center gap-2">
          <Flame className="h-3.5 w-3.5 text-gold" />
          Update {formatUpdatedAt(lastUpdated)}
        </span>
      </div>
    </section>
  );
}
