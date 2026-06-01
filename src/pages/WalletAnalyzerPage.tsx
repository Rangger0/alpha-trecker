import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Wallet } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useWalletAnalysis } from "@/hooks/useWalletAnalysis";
import type { ChainFamily } from "@/types/intelligence";

function formatMetric(value: number | string | null) {
  return value === null ? "No fetched data" : value;
}

export function WalletAnalyzerPage() {
  const [address, setAddress] = useState("");
  const [network, setNetwork] = useState<ChainFamily>("EVM");
  const analysis = useWalletAnalysis();
  const running = analysis.status === "loading";
  const result = analysis.result;

  const analyze = () => {
    analysis.run(address, network);
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
                <Wallet className="h-3.5 w-3.5" />
                Wallet
              </div>
              <h1 className="macos-page-title">Wallet Analyzer</h1>
              <p className="macos-page-subtitle">Analyze EVM and Solana wallets with quick metrics and risk signals.</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="macos-card rounded-[1.2rem] px-4 py-3">
                <p className="text-[10px] uppercase tracking-[0.2em] alpha-text-muted">Chains</p>
                <p className="mt-2 text-[1.25rem] font-semibold alpha-text">EVM & Solana</p>
              </div>
              <div className="macos-card rounded-[1.2rem] px-4 py-3">
                <p className="text-[10px] uppercase tracking-[0.2em] alpha-text-muted">Analysis</p>
                <p className="mt-2 text-[1.25rem] font-semibold alpha-text">Provider-backed</p>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[420px_1fr]">
          <div className="space-y-4">
            <div className="macos-card rounded-[1.2rem] p-4">
              <p className="text-[12px] font-semibold alpha-text-muted">Wallet Input</p>

              <div className="mt-3 space-y-3">
                <label className="block">
                  <div className="text-[11px] alpha-text-muted">Address</div>
                  <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="0x... or solana address" className="mt-1 w-full rounded-md border px-3 py-2" />
                </label>

                <label className="block">
                  <div className="text-[11px] alpha-text-muted">Chain</div>
                  <select value={network} onChange={(e) => setNetwork(e.target.value as ChainFamily)} className="mt-1 w-full rounded-md border px-3 py-2">
                    <option value="EVM">EVM</option>
                    <option value="Solana">Solana</option>
                  </select>
                </label>

                <div className="mt-3 flex gap-3">
                  <button onClick={analyze} disabled={running} className="rounded-full bg-[color:var(--alpha-highlight)] px-4 py-2 font-semibold text-[color:var(--alpha-accent-contrast)]">{running ? 'Analyzing...' : 'Analyze Wallet'}</button>
                  <button onClick={reset} className="rounded-full border px-4 py-2">Reset</button>
                </div>

                {running ? (
                  <div className="mt-3">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4 mt-2" />
                  </div>
                ) : null}

                {analysis.error ? <div className="mt-2 text-[color:var(--alpha-danger)]">{analysis.error}</div> : null}
              </div>
            </div>

            <div className="macos-card rounded-[1.2rem] p-4">
              <p className="text-[11px] uppercase alpha-text-muted">Chain Support</p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <div className="rounded-[0.9rem] border p-3">Ethereum</div>
                <div className="rounded-[0.9rem] border p-3">Arbitrum</div>
                <div className="rounded-[0.9rem] border p-3">Base</div>
                <div className="rounded-[0.9rem] border p-3">Optimism</div>
                <div className="rounded-[0.9rem] border p-3">Polygon</div>
                <div className="rounded-[0.9rem] border p-3">BSC</div>
                <div className="rounded-[0.9rem] border p-3">Solana Mainnet</div>
                <div className="rounded-[0.9rem] border p-3">Solana Devnet</div>
              </div>
              <p className="mt-3 text-xs alpha-text-muted">Detailed providers: Alchemy Transfers API for EVM, Helius Enhanced Transactions for Solana, with Moralis/Covalent/Solscan ready as server-side fallbacks.</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="macos-card rounded-[1.2rem] p-4">
              <p className="text-[10px] uppercase tracking-[0.2em] alpha-text-muted">Wallet Metrics</p>

              {running ? (
                <div className="mt-3 grid grid-cols-2 gap-3">
                  {Array.from({ length: 8 }).map((_, index) => <Skeleton key={index} className="h-20 rounded-[0.9rem]" />)}
                </div>
              ) : result ? (
                <>
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <div className="rounded-[0.9rem] border p-3">
                      <p className="text-[10px] uppercase alpha-text-muted">Wallet Age</p>
                      <p className="mt-2 text-sm alpha-text">{result.walletAgeDays === null ? "No fetched data" : `${result.walletAgeDays} days`}</p>
                    </div>
                    <div className="rounded-[0.9rem] border p-3">
                      <p className="text-[10px] uppercase alpha-text-muted">Total Tx</p>
                      <p className="mt-2 text-sm alpha-text">{formatMetric(result.totalTx)}</p>
                    </div>
                    <div className="rounded-[0.9rem] border p-3">
                      <p className="text-[10px] uppercase alpha-text-muted">Mainnet Tx</p>
                      <p className="mt-2 text-sm alpha-text">{formatMetric(result.mainnetTx)}</p>
                    </div>
                    <div className="rounded-[0.9rem] border p-3">
                      <p className="text-[10px] uppercase alpha-text-muted">Testnet / Devnet</p>
                      <p className="mt-2 text-sm alpha-text">{`${formatMetric(result.testnetTx)} / ${formatMetric(result.devnetTx)}`}</p>
                    </div>
                    <div className="rounded-[0.9rem] border p-3">
                      <p className="text-[10px] uppercase alpha-text-muted">Unique Contracts</p>
                      <p className="mt-2 text-sm alpha-text">{formatMetric(result.uniqueContracts)}</p>
                    </div>
                    <div className="rounded-[0.9rem] border p-3">
                      <p className="text-[10px] uppercase alpha-text-muted">Bridge Usage</p>
                      <p className="mt-2 text-sm alpha-text">{formatMetric(result.bridgeUsage)}</p>
                    </div>
                    <div className="rounded-[0.9rem] border p-3">
                      <p className="text-[10px] uppercase alpha-text-muted">NFT Activity</p>
                      <p className="mt-2 text-sm alpha-text">{formatMetric(result.nftActivity)}</p>
                    </div>
                    <div className="rounded-[0.9rem] border p-3">
                      <p className="text-[10px] uppercase alpha-text-muted">DeFi Activity</p>
                      <p className="mt-2 text-sm alpha-text">{formatMetric(result.defiActivity)}</p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <p className="text-sm font-semibold alpha-text">Gas Usage</p>
                    <p className="mt-2 alpha-text-muted">{result.gasUsed ?? "No fetched data"}</p>
                  </div>
                </>
              ) : (
                <div className="mt-4 rounded-[0.9rem] border border-dashed p-6 alpha-text-muted">Enter wallet address to analyze activity.</div>
              )}
            </div>

            {result ? (
              <div className="macos-card rounded-[1.2rem] p-4">
                <p className="text-[11px] uppercase alpha-text-muted">Signals</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {result.signals.length ? (
                    result.signals.map((s, idx) => (
                      <span key={idx} className="rounded-full border px-3 py-1 text-[12px] alpha-text-muted">{s}</span>
                    ))
                  ) : (
                    <div className="alpha-text-muted">No notable signals.</div>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
