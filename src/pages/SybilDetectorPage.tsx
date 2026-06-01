import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Users } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useSybilAnalysis } from "@/hooks/useSybilAnalysis";

export function SybilDetectorPage() {
  const [address, setAddress] = useState("");
  const analysis = useSybilAnalysis();
  const running = analysis.status === "loading";
  const result = analysis.result;

  const analyze = () => {
    analysis.run(address);
  };

  const reset = () => {
    setAddress("");
    analysis.reset();
  };

  return (
    <DashboardLayout>
      <div className="macos-root macos-page-shell">
        <section className="macos-page-header macos-animate-up">
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px] xl:items-end">
            <div>
              <div className="macos-page-kicker">
                <Users className="h-3.5 w-3.5" />
                Sybil
              </div>
              <h1 className="macos-page-title">Sybil Detector</h1>
              <p className="macos-page-subtitle">Detect sybil / bot-like wallets and clustering signals.</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="macos-card rounded-[1.2rem] px-4 py-3">
                <p className="text-[10px] uppercase tracking-[0.2em] alpha-text-muted">Signals</p>
                <p className="mt-2 text-[1.25rem] font-semibold alpha-text">Clustering & timing</p>
              </div>
              <div className="macos-card rounded-[1.2rem] px-4 py-3">
                <p className="text-[10px] uppercase tracking-[0.2em] alpha-text-muted">Output</p>
                <p className="mt-2 text-[1.25rem] font-semibold alpha-text">Dynamic score</p>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[440px_1fr]">
          <div className="space-y-4">
            <div className="macos-card rounded-[1.2rem] p-4">
              <p className="text-[12px] font-semibold alpha-text-muted">Address</p>
              <div className="mt-3">
                <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="0x..." className="w-full rounded-md border px-3 py-2" />
                <div className="mt-3 flex gap-3">
                  <button onClick={analyze} disabled={running} className="rounded-full bg-[color:var(--alpha-highlight)] px-4 py-2 font-semibold text-[color:var(--alpha-accent-contrast)]">{running ? 'Analyzing...' : 'Analyze'}</button>
                  <button onClick={reset} className="rounded-full border px-4 py-2">Reset</button>
                </div>
              </div>
              {running ? (
                <div className="mt-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4 mt-2" />
                </div>
              ) : null}
              {analysis.error ? <div className="mt-2 text-[color:var(--alpha-danger)]">{analysis.error}</div> : null}

              <div className="mt-4">
                <p className="text-[11px] uppercase alpha-text-muted">What we check</p>
                <ul className="mt-2 list-inside list-disc alpha-text-muted">
                  <li>Repetitive patterns</li>
                  <li>Burst transactions</li>
                  <li>Shared funding sources</li>
                  <li>Low interaction diversity</li>
                </ul>
              </div>
            </div>

            <div className="macos-card rounded-[1.2rem] p-4">
              <p className="text-[11px] uppercase alpha-text-muted">AI Notes</p>
              <p className="mt-2 alpha-text-muted">Scoring runs only after chain data is fetched from Alchemy or Helius. Timing, diversity, bridge repetition, and funding-cluster signals are computed from fetched transactions.</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="macos-card rounded-[1.2rem] p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] alpha-text-muted">Sybil Score</p>
                  {running ? (
                    <div className="mt-3 space-y-2">
                      <Skeleton className="h-10 w-32" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  ) : result ? (
                    <div className="mt-2 flex items-end gap-3">
                      <div className="text-[2.5rem] font-semibold alpha-text">{`${result.score}%`}</div>
                      <div className="rounded-full border border-alpha-border bg-[color:var(--alpha-hover-soft)] px-3 py-1 text-[12px] alpha-text-muted">{result.label}</div>
                    </div>
                  ) : (
                    <div className="mt-2 rounded-[0.9rem] border border-dashed p-6 alpha-text-muted">Enter wallet address to analyze activity.</div>
                  )}
                </div>

                <div className="text-right alpha-text-muted">Confidence: {result ? result.confidence : "No analysis"}</div>
              </div>

              <div className="mt-4">
                <p className="text-sm font-semibold alpha-text">Indicators</p>
                <ul className="mt-2 list-inside list-disc alpha-text-muted">
                  {running ? <li>Analyzing wallet behavior...</li> : result ? result.indicators.map((i: string, idx: number) => <li key={idx}>{i}</li>) : <li>No score before scan.</li>}
                </ul>
              </div>
            </div>

            {result ? (
              <>
                <div className="macos-card rounded-[1.2rem] p-4">
                  <p className="text-[11px] uppercase alpha-text-muted">Evidence</p>
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <div className="rounded-[0.9rem] border p-3">
                      <p className="text-[10px] uppercase alpha-text-muted">Fetched Tx</p>
                      <p className="mt-2 text-sm alpha-text">{result.evidence.rawSampleSize}</p>
                    </div>
                    <div className="rounded-[0.9rem] border p-3">
                      <p className="text-[10px] uppercase alpha-text-muted">Wallet Age</p>
                      <p className="mt-2 text-sm alpha-text">{result.evidence.walletAgeDays === null ? "Unknown" : `${result.evidence.walletAgeDays} days`}</p>
                    </div>
                    <div className="rounded-[0.9rem] border p-3">
                      <p className="text-[10px] uppercase alpha-text-muted">Unique Contracts</p>
                      <p className="mt-2 text-sm alpha-text">{result.evidence.uniqueContracts ?? "Unknown"}</p>
                    </div>
                    <div className="rounded-[0.9rem] border p-3">
                      <p className="text-[10px] uppercase alpha-text-muted">Counterparties</p>
                      <p className="mt-2 text-sm alpha-text">{result.evidence.counterparties}</p>
                    </div>
                    <div className="rounded-[0.9rem] border p-3">
                      <p className="text-[10px] uppercase alpha-text-muted">Burst Tx</p>
                      <p className="mt-2 text-sm alpha-text">{result.evidence.burstTransactions}</p>
                    </div>
                    <div className="rounded-[0.9rem] border p-3">
                      <p className="text-[10px] uppercase alpha-text-muted">Bridge Usage</p>
                      <p className="mt-2 text-sm alpha-text">{result.evidence.bridgeUsage ?? "Unknown"}</p>
                    </div>
                  </div>
                </div>

                <div className="macos-card rounded-[1.2rem] p-4">
                  <p className="text-[11px] uppercase alpha-text-muted">Action</p>
                  <div className="mt-3 flex gap-2">
                    <button className="rounded-full border px-4 py-2">Flag Wallet</button>
                    <button className="rounded-full border px-4 py-2">Add to Watchlist</button>
                  </div>
                </div>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
