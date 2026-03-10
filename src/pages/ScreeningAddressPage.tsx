import { startTransition, useMemo, useRef, useState } from 'react';
import {
  Activity,
  ArrowUpRight,
  Loader2,
  RefreshCw,
  Search,
  ShieldCheck,
  Wallet,
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { screeningNetworks, type ScreeningEnvironment, type ScreeningNetwork } from '@/lib/screening-directory';

type AddressFamily = 'evm' | 'solana' | 'sui';
type EnvironmentFilter = 'All' | ScreeningEnvironment;
type ScanStatus = 'idle' | 'loading' | 'success' | 'error';

interface ScreeningResult {
  networkId: string;
  status: ScanStatus;
  txLabel: string;
  balanceLabel: string;
  detailLabel: string;
  error?: string;
}

interface SuiTransactionQueryResult {
  data?: unknown[];
  nextCursor?: string | null;
  hasNextPage?: boolean;
}

const familyOptions: Array<{ id: AddressFamily; label: string; note: string }> = [
  { id: 'evm', label: 'EVM', note: 'Ethereum, Base, Arbitrum, Polygon, BNB, Avalanche' },
  { id: 'solana', label: 'Solana', note: 'Mainnet + Devnet Solana address screening' },
  { id: 'sui', label: 'Sui', note: 'Mainnet + Testnet Sui address screening' },
];

const environmentFilters: EnvironmentFilter[] = ['All', 'Mainnet', 'Testnet'];

const EVM_ADDRESS_RE = /^0x[a-fA-F0-9]{40}$/;
const SOLANA_ADDRESS_RE = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;

function createIdleResult(networkId: string): ScreeningResult {
  return {
    networkId,
    status: 'idle',
    txLabel: '-',
    balanceLabel: '-',
    detailLabel: 'Ready',
  };
}

async function jsonRpc<T>(rpcUrl: string, method: string, params: unknown[]): Promise<T> {
  const response = await fetch(rpcUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: `${method}-${Date.now()}`,
      method,
      params,
    }),
  });

  if (!response.ok) {
    throw new Error(`RPC ${response.status}`);
  }

  const payload = await response.json();
  if (payload.error) {
    throw new Error(payload.error.message ?? 'Unknown RPC error');
  }

  return payload.result as T;
}

function formatBigIntUnits(value: bigint, decimals: number, precision = 4): string {
  const divisor = 10n ** BigInt(decimals);
  const whole = value / divisor;
  const fraction = (value % divisor).toString().padStart(decimals, '0').slice(0, precision).replace(/0+$/, '');
  return fraction ? `${whole.toString()}.${fraction}` : whole.toString();
}

function hexToBigIntValue(value: string | null | undefined): bigint {
  if (!value) return 0n;
  return BigInt(value);
}

function compactNumber(value: number): string {
  return new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(value);
}

function normalizeSuiAddress(value: string): string | null {
  const trimmed = value.trim().toLowerCase();
  const withoutPrefix = trimmed.startsWith('0x') ? trimmed.slice(2) : trimmed;

  if (!/^[0-9a-f]+$/.test(withoutPrefix) || withoutPrefix.length === 0 || withoutPrefix.length > 64) {
    return null;
  }

  return `0x${withoutPrefix.padStart(64, '0')}`;
}

function getValidationError(family: AddressFamily, address: string): string | null {
  const trimmed = address.trim();

  if (!trimmed) {
    return 'Masukkan address dulu sebelum scan.';
  }

  if (family === 'evm' && !EVM_ADDRESS_RE.test(trimmed)) {
    return 'Format address EVM harus 0x + 40 karakter hex.';
  }

  if (family === 'solana' && !SOLANA_ADDRESS_RE.test(trimmed)) {
    return 'Format address Solana harus berupa base58 wallet address yang valid.';
  }

  if (family === 'sui' && !normalizeSuiAddress(trimmed)) {
    return 'Format address Sui harus berupa address hex valid.';
  }

  return null;
}

async function countSolanaTransactions(rpcUrl: string, address: string, maxPages = 5): Promise<{ count: number; capped: boolean }> {
  let before: string | undefined;
  let total = 0;

  for (let page = 0; page < maxPages; page += 1) {
    const batch = await jsonRpc<Array<{ signature: string }>>(rpcUrl, 'getSignaturesForAddress', [
      address,
      { limit: 1000, before },
    ]);

    total += batch.length;

    if (batch.length < 1000) {
      return { count: total, capped: false };
    }

    before = batch[batch.length - 1]?.signature;
    if (!before) {
      return { count: total, capped: false };
    }
  }

  return { count: total, capped: true };
}

async function countSuiTransactions(rpcUrl: string, address: string, maxPages = 10): Promise<{ count: number; capped: boolean }> {
  let cursor: string | null = null;
  let total = 0;

  for (let page = 0; page < maxPages; page += 1) {
    const queryResult: SuiTransactionQueryResult = await jsonRpc<SuiTransactionQueryResult>(
      rpcUrl,
      'suix_queryTransactionBlocks',
      [{ filter: { FromAddress: address } }, cursor, 100, false],
    );

    const batch = queryResult.data ?? [];
    total += batch.length;

    if (!queryResult.hasNextPage) {
      return { count: total, capped: false };
    }

    cursor = queryResult.nextCursor ?? null;
    if (!cursor) {
      return { count: total, capped: false };
    }
  }

  return { count: total, capped: true };
}

async function scanEvmNetwork(network: ScreeningNetwork, address: string): Promise<ScreeningResult> {
  const [nonceHex, balanceHex, code] = await Promise.all([
    jsonRpc<string>(network.rpcUrl, 'eth_getTransactionCount', [address, 'latest']),
    jsonRpc<string>(network.rpcUrl, 'eth_getBalance', [address, 'latest']),
    jsonRpc<string>(network.rpcUrl, 'eth_getCode', [address, 'latest']),
  ]);

  const txCount = Number.parseInt(nonceHex, 16);
  const balance = formatBigIntUnits(hexToBigIntValue(balanceHex), 18, 5);

  return {
    networkId: network.id,
    status: 'success',
    txLabel: `${compactNumber(txCount)} sent tx`,
    balanceLabel: `${balance} native`,
    detailLabel: code && code !== '0x' ? 'Contract address' : 'EOA wallet',
  };
}

async function scanSolanaNetwork(network: ScreeningNetwork, address: string): Promise<ScreeningResult> {
  const [balanceResult, countResult] = await Promise.all([
    jsonRpc<{ value: number }>(network.rpcUrl, 'getBalance', [address]),
    countSolanaTransactions(network.rpcUrl, address),
  ]);

  const balance = formatBigIntUnits(BigInt(balanceResult.value), 9, 5);
  const txLabel = countResult.capped
    ? `${compactNumber(countResult.count)}+ activity`
    : `${compactNumber(countResult.count)} activity`;

  return {
    networkId: network.id,
    status: 'success',
    txLabel,
    balanceLabel: `${balance} SOL`,
    detailLabel: countResult.capped ? 'Capped at 5k signatures' : 'Full activity scan',
  };
}

async function scanSuiNetwork(network: ScreeningNetwork, address: string): Promise<ScreeningResult> {
  const normalizedAddress = normalizeSuiAddress(address);
  if (!normalizedAddress) {
    throw new Error('Invalid Sui address');
  }

  const [balanceResult, countResult] = await Promise.all([
    jsonRpc<{ totalBalance?: string }>(network.rpcUrl, 'suix_getBalance', [normalizedAddress]),
    countSuiTransactions(network.rpcUrl, normalizedAddress),
  ]);

  const balance = formatBigIntUnits(BigInt(balanceResult.totalBalance ?? '0'), 9, 5);
  const txLabel = countResult.capped
    ? `${compactNumber(countResult.count)}+ sent tx`
    : `${compactNumber(countResult.count)} sent tx`;

  return {
    networkId: network.id,
    status: 'success',
    txLabel,
    balanceLabel: `${balance} SUI`,
    detailLabel: countResult.capped ? 'Capped at 1k tx blocks' : 'FromAddress scan',
  };
}

function buildExplorerUrl(network: ScreeningNetwork, address: string): string {
  if (network.family === 'solana') {
    if (network.environment === 'Testnet') {
      return `${network.explorerUrl}${address}?cluster=devnet`;
    }

    return `${network.explorerUrl}${address}?cluster=mainnet`;
  }

  return `${network.explorerUrl}${address}`;
}

export function ScreeningAddressPage() {
  const [address, setAddress] = useState('');
  const [family, setFamily] = useState<AddressFamily>('evm');
  const [environmentFilter, setEnvironmentFilter] = useState<EnvironmentFilter>('All');
  const [isScanning, setIsScanning] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, ScreeningResult>>({});
  const [lastScannedAt, setLastScannedAt] = useState<string | null>(null);
  const latestRunRef = useRef(0);

  const visibleNetworks = useMemo(
    () =>
      screeningNetworks.filter((network) => {
        const matchesFamily = network.family === family;
        const matchesEnvironment =
          environmentFilter === 'All' || network.environment === environmentFilter;

        return matchesFamily && matchesEnvironment;
      }),
    [environmentFilter, family],
  );

  const resultList = useMemo(
    () =>
      visibleNetworks.map((network) => ({
        network,
        result: results[network.id] ?? createIdleResult(network.id),
      })),
    [results, visibleNetworks],
  );

  const validationError = getValidationError(family, address);

  const handleScan = async () => {
    const nextError = getValidationError(family, address);
    if (nextError) {
      setScanError(nextError);
      return;
    }

    const targetAddress = family === 'sui' ? normalizeSuiAddress(address) ?? address.trim() : address.trim();
    const runId = latestRunRef.current + 1;
    latestRunRef.current = runId;

    setIsScanning(true);
    setScanError(null);
    setResults(
      Object.fromEntries(
        visibleNetworks.map((network) => [
          network.id,
          {
            networkId: network.id,
            status: 'loading',
            txLabel: 'Scanning...',
            balanceLabel: 'Loading...',
            detailLabel: network.methodLabel,
          },
        ]),
      ),
    );

    const settled = await Promise.all(
      visibleNetworks.map(async (network) => {
        try {
          if (network.family === 'evm') {
            return await scanEvmNetwork(network, targetAddress);
          }

          if (network.family === 'solana') {
            return await scanSolanaNetwork(network, targetAddress);
          }

          return await scanSuiNetwork(network, targetAddress);
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Unknown error';
          return {
            networkId: network.id,
            status: 'error',
            txLabel: 'Unavailable',
            balanceLabel: 'Unavailable',
            detailLabel: network.methodLabel,
            error: message,
          } satisfies ScreeningResult;
        }
      }),
    );

    if (latestRunRef.current !== runId) {
      return;
    }

    setResults(Object.fromEntries(settled.map((entry) => [entry.networkId, entry])));
    setLastScannedAt(new Date().toISOString());
    setIsScanning(false);
  };

  const resetResults = () => {
    latestRunRef.current += 1;
    setResults({});
    setScanError(null);
    setLastScannedAt(null);
    setIsScanning(false);
  };

  return (
    <DashboardLayout disableMonochrome>
      <div className="macos-root macos-page-shell">
        <div className="macos-page-header macos-animate-up">
          <div className="macos-page-kicker">
            <ShieldCheck className="h-3.5 w-3.5" />
            Internal address scanner
          </div>

          <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-start">
            <div>
              <h1 className="macos-page-title">Screening Address</h1>
              <p className="macos-page-subtitle">
                Scan address langsung di Alpha Tracker untuk lihat aktivitas tx dan native balance per chain, 
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Networks', value: visibleNetworks.length },
                { label: 'Family', value: family.toUpperCase() },
                { label: 'Filter', value: environmentFilter },
              ].map((stat, index) => (
                <div
                  key={stat.label}
                  className="macos-card macos-card-entry rounded-[1.35rem] px-4 py-3"
                  style={{ ['--mac-delay' as any]: `${index * 40}ms` }}
                >
                  <p className="text-[10px] uppercase tracking-[0.24em] alpha-text-muted">{stat.label}</p>
                  <p className="mt-2 text-lg font-bold alpha-text">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
          <section className="space-y-4">
            <div className="macos-card rounded-[1.7rem] p-4">
              <div className="flex flex-wrap gap-2">
                {familyOptions.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => {
                      setFamily(option.id);
                      resetResults();
                    }}
                    className={`rounded-full border px-3 py-1.5 text-[11px] font-mono uppercase tracking-[0.22em] transition-colors duration-150 ${
                      family === option.id
                        ? 'border-[color:var(--alpha-highlight-border)] bg-[color:var(--alpha-highlight-soft)] text-[color:var(--alpha-highlight)]'
                        : 'border-[color:var(--alpha-border)] bg-[color:var(--alpha-surface)] alpha-text-muted hover:border-[color:var(--alpha-border-strong)] hover:text-[color:var(--alpha-text)]'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>

              <p className="mt-3 text-sm leading-6 alpha-text-muted">
                {familyOptions.find((option) => option.id === family)?.note}
              </p>

              <div className="mt-4 flex flex-col gap-3 lg:flex-row">
                <label className="flex flex-1 items-center gap-3 rounded-[1.2rem] border border-[color:var(--alpha-border)] bg-[color:var(--alpha-surface)] px-4 py-3">
                  <Search className="h-4 w-4 alpha-text-muted" />
                  <input
                    value={address}
                    onChange={(event) => {
                      const value = event.target.value;
                      startTransition(() => setAddress(value));
                    }}
                    placeholder={
                      family === 'evm'
                        ? '0x...'
                        : family === 'solana'
                          ? 'Solana wallet address'
                          : '0x... Sui address'
                    }
                    className="w-full border-0 bg-transparent p-0 text-sm alpha-text outline-none placeholder:text-[color:var(--alpha-text-muted)]"
                  />
                </label>

                <div className="flex gap-2">
                  <select
                    value={environmentFilter}
                    onChange={(event) => {
                      setEnvironmentFilter(event.target.value as EnvironmentFilter);
                      resetResults();
                    }}
                    className="rounded-[1.2rem] border border-[color:var(--alpha-border)] bg-[color:var(--alpha-surface)] px-4 py-3 text-sm alpha-text outline-none"
                  >
                    {environmentFilters.map((filter) => (
                      <option key={filter} value={filter}>
                        {filter}
                      </option>
                    ))}
                  </select>

                  <Button
                    type="button"
                    onClick={handleScan}
                    disabled={isScanning || Boolean(validationError)}
                    className="macos-btn macos-btn--primary min-w-[132px] justify-center gap-2"
                  >
                    {isScanning ? <Loader2 className="h-4 w-4 animate-spin" /> : <Activity className="h-4 w-4" />}
                    {isScanning ? 'Scanning' : 'Scan now'}
                  </Button>
                </div>
              </div>

              {validationError ? <p className="mt-3 text-sm text-[var(--alpha-danger)]">{validationError}</p> : null}
              {scanError ? <p className="mt-2 text-sm text-[var(--alpha-danger)]">{scanError}</p> : null}
            </div>

            <div>
              <div className="mb-3 flex items-center gap-2">
                <Wallet className="h-4 w-4 text-gold" />
                <h2 className="text-xs font-mono uppercase tracking-[0.24em] alpha-text-muted">Scan results</h2>
              </div>

              <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
                {resultList.map(({ network, result }, index) => (
                  <article
                    key={network.id}
                    className="macos-premium-card macos-card-entry group rounded-[1.7rem] p-4"
                    style={{ ['--mac-delay' as any]: `${index * 26}ms` }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-[1rem] border border-[color:var(--alpha-border)] bg-[color:var(--alpha-surface-soft)]"
                          style={{ boxShadow: `inset 0 1px 0 color-mix(in srgb, ${network.accent} 16%, transparent)` }}
                        >
                          <img src={network.logo} alt={network.name} loading="lazy" className="h-7 w-7 object-contain" />
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-base font-semibold alpha-text">{network.name}</p>
                          <p className="truncate text-[11px] uppercase tracking-[0.22em] alpha-text-muted">
                            {network.methodLabel}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-medium ${
                          result.status === 'error'
                            ? 'border-[color:var(--alpha-danger-border)] bg-[color:var(--alpha-danger-soft)] text-[var(--alpha-danger)]'
                            : result.status === 'success'
                              ? 'border-[color:var(--alpha-signal-border)] bg-[color:var(--alpha-signal-soft)] text-[var(--alpha-signal)]'
                              : 'border-[color:var(--alpha-border)] bg-[color:var(--alpha-hover-soft)] alpha-text-muted'
                        }`}
                      >
                        {result.status}
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div className="rounded-[1rem] border border-[color:var(--alpha-border)] bg-[color:var(--alpha-hover-soft)] px-3 py-2.5">
                        <p className="text-[10px] uppercase tracking-[0.22em] alpha-text-muted">Tx count</p>
                        <p className="mt-2 text-sm font-semibold alpha-text">{result.txLabel}</p>
                      </div>
                      <div className="rounded-[1rem] border border-[color:var(--alpha-border)] bg-[color:var(--alpha-hover-soft)] px-3 py-2.5">
                        <p className="text-[10px] uppercase tracking-[0.22em] alpha-text-muted">Balance</p>
                        <p className="mt-2 text-sm font-semibold alpha-text">{result.balanceLabel}</p>
                      </div>
                    </div>

                    <p className="mt-3 text-sm alpha-text">{result.detailLabel}</p>
                    {result.error ? <p className="mt-2 text-[12px] leading-5 text-[var(--alpha-danger)]">{result.error}</p> : null}

                    <div className="mt-4 flex items-center gap-2">
                      <a
                        href={buildExplorerUrl(network, family === 'sui' ? normalizeSuiAddress(address) ?? address.trim() : address.trim())}
                        target="_blank"
                        rel="noreferrer"
                        className="macos-btn macos-btn--ghost inline-flex items-center justify-center gap-2 px-3 py-2 text-sm"
                      >
                        <ArrowUpRight className="h-4 w-4" />
                        Explorer
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <aside className="space-y-4">
            <section className="macos-card rounded-[1.7rem] p-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--alpha-border)] bg-[color:var(--alpha-hover-soft)] px-3 py-1 text-[10px] uppercase tracking-[0.24em] alpha-text-muted">
                <RefreshCw className="h-3.5 w-3.5 text-gold" />
                Scan notes
              </div>

              <h3 className="mt-3 text-lg font-semibold alpha-text">Public RPC, bukan redirect</h3>
              <p className="mt-2 text-sm leading-6 alpha-text-muted">
           
              </p>

              <div className="mt-4 space-y-3">
                <div className="rounded-[1rem] border border-[color:var(--alpha-border)] bg-[color:var(--alpha-hover-soft)] px-3 py-3">
                  <p className="text-[10px] uppercase tracking-[0.22em] alpha-text-muted">Best for</p>
                  <p className="mt-2 text-sm alpha-text">.</p>
                </div>

                <div className="rounded-[1rem] border border-[color:var(--alpha-border)] bg-[color:var(--alpha-hover-soft)] px-3 py-3">
                  <p className="text-[10px] uppercase tracking-[0.22em] alpha-text-muted">Method</p>
                  <p className="mt-2 text-sm alpha-text">
                    
                  </p>
                </div>

                <div className="rounded-[1rem] border border-[color:var(--alpha-border)] bg-[color:var(--alpha-hover-soft)] px-3 py-3">
                  <p className="text-[10px] uppercase tracking-[0.22em] alpha-text-muted">Last scan</p>
                  <p className="mt-2 text-sm alpha-text">
                    {lastScannedAt
                      ? new Date(lastScannedAt).toLocaleString('id-ID', {
                          day: '2-digit',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : 'Belum ada scan'}
                  </p>
                </div>
              </div>
            </section>

            <section className="macos-card rounded-[1.7rem] p-4">
              <h3 className="text-lg font-semibold alpha-text">Network coverage</h3>
              <div className="mt-4 space-y-2">
                {visibleNetworks.map((network) => (
                  <div
                    key={network.id}
                    className="flex items-center gap-3 rounded-[1rem] border border-[color:var(--alpha-border)] bg-[color:var(--alpha-surface)] px-3 py-2.5"
                  >
                    <div
                      className="flex h-9 w-9 items-center justify-center rounded-[0.9rem] bg-[color:var(--alpha-surface-soft)]"
                      style={{ boxShadow: `inset 0 1px 0 color-mix(in srgb, ${network.accent} 16%, transparent)` }}
                    >
                      <img src={network.logo} alt={network.name} className="h-5 w-5 object-contain" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium alpha-text">{network.name}</p>
                      <p className="text-[11px] uppercase tracking-[0.22em] alpha-text-muted">{network.environment}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </div>
    </DashboardLayout>
  );
}
