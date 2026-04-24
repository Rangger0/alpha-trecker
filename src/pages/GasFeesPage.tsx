import { Activity, Flame, RefreshCw, Signal } from "lucide-react";
import type { CSSProperties } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { GasFeesPanel } from "@/components/dashboard/GasFeesPanel";

const gasPageStats = [
  {
    label: "Refresh",
    value: "75s",
    meta: "auto cycle",
    icon: RefreshCw,
    accent: "var(--alpha-signal)",
  },
  {
    label: "Tx basis",
    value: "21k",
    meta: "basic gas units",
    icon: Activity,
    accent: "var(--alpha-violet)",
  },
  {
    label: "Mode",
    value: "Live",
    meta: "multi-chain board",
    icon: Flame,
    accent: "var(--alpha-warning)",
  },
] as const;

export function GasFeesPage() {
  return (
    <DashboardLayout disableMonochrome>
      <div className="macos-root macos-page-shell">
        <section className="macos-page-header macos-animate-up">
          <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-end">
            <div>
              <div className="macos-page-kicker">
                <Signal className="h-3.5 w-3.5" />
                Watchoor board
              </div>
              <h1 className="macos-page-title">Live Gas Fee</h1>
              <p className="macos-page-subtitle">
                Monitor snapshot biaya transaksi multi-chain dalam layout Alpha Tracker yang tetap ringkas, jadi lebih gampang scan lane yang lagi murah, stabil, atau mulai mahal.
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full border border-alpha-border bg-[color:var(--alpha-hover-soft)] px-3 py-1 text-[10px] uppercase tracking-[0.18em] alpha-text-muted">
                  Multi-chain gas monitor
                </span>
                <span className="rounded-full border border-alpha-border bg-[color:var(--alpha-hover-soft)] px-3 py-1 text-[10px] uppercase tracking-[0.18em] alpha-text-muted">
                  Basic transaction baseline
                </span>
                <span className="rounded-full border border-alpha-border bg-[color:var(--alpha-hover-soft)] px-3 py-1 text-[10px] uppercase tracking-[0.18em] alpha-text-muted">
                  Auto refresh tiap 75 detik
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 xl:grid-cols-1">
              {gasPageStats.map((stat, index) => {
                const Icon = stat.icon;

                return (
                  <div
                    key={stat.label}
                    className="macos-card macos-card-entry rounded-[1.2rem] px-4 py-3"
                    style={{ "--mac-delay": `${index * 40}ms` } as CSSProperties}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-[10px] uppercase tracking-[0.22em] alpha-text-muted">{stat.label}</p>
                      <Icon className="h-4 w-4" style={{ color: stat.accent }} />
                    </div>
                    <p className="mt-2 text-2xl font-semibold alpha-text">{stat.value}</p>
                    <p className="mt-1 text-[11px] alpha-text-muted">{stat.meta}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <GasFeesPanel variant="page" showHeader={false} />
      </div>
    </DashboardLayout>
  );
}
