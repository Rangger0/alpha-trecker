import { useEffect, useState } from "react";

export interface GasFeeItem {
  chainId: number;
  label: string;
  icon?: string;
  arch?: string;
  system: string;
  network: string;
  baseFee?: number;
  maxFee?: number;
  priorityFee?: number;
  confidence?: number;
  lowFee?: number;
  fastFee?: number;
  highFee?: number;
}

interface GasFeesSnapshot {
  items: GasFeeItem[];
  lastUpdated: number;
  totalChains: number;
}

interface BlocknativeChain {
  arch?: string;
  chainId: number;
  label: string;
  icon?: string;
  system: string;
  network: string;
  features?: string[];
}

interface EstimatedPrice {
  confidence?: number;
  price?: number;
  maxFeePerGas?: number;
  maxPriorityFeePerGas?: number;
}

interface BlockPriceEntry {
  baseFeePerGas?: number;
  estimatedPrices?: EstimatedPrice[];
}

interface BlockPricesResponse {
  blockPrices?: BlockPriceEntry[];
}

const BLOCKNATIVE_API_KEY = import.meta.env.VITE_BLOCKNATIVE_API_KEY?.trim();
const BLOCKNATIVE_CHAINS_URL = "https://api.blocknative.com/chains";
const BLOCKNATIVE_BLOCK_PRICES_URL = "https://api.blocknative.com/gasprices/blockprices";
const REFRESH_INTERVAL_MS = 1000 * 75;
const CACHE_TTL_MS = 1000 * 60;
const CHAIN_BATCH_SIZE = 4;
const MAX_VISIBLE_CHAINS = 10;

const PRIORITY_CHAIN_ORDER = [
  1,
  56,
  137,
  42161,
  10,
  8453,
  43114,
  250,
  100,
  59144,
  81457,
  324,
  534352,
  5000,
  34443,
  130,
  1329,
  146,
  57073,
  167000,
];

const CHAIN_LABEL_OVERRIDES: Record<number, string> = {
  1: "Ethereum",
  56: "BSC",
  137: "Polygon",
  42161: "Arbitrum",
  10: "Optimism",
  8453: "Base",
  43114: "Avalanche",
  250: "Fantom",
  100: "Gnosis",
  59144: "Linea",
  81457: "Blast",
  324: "zkSync",
  534352: "Scroll",
  5000: "Mantle",
  34443: "Mode",
  130: "Unichain",
  1329: "SEI",
  146: "Sonic",
  57073: "Ink",
  167000: "Taiko",
};

let cachedSnapshot: GasFeesSnapshot | null = null;
let cachedError: string | null = null;
let cachedAt = 0;

const sortChainOrder = (left: GasFeeItem, right: GasFeeItem) => {
  const leftIndex = PRIORITY_CHAIN_ORDER.indexOf(left.chainId);
  const rightIndex = PRIORITY_CHAIN_ORDER.indexOf(right.chainId);

  if (leftIndex === -1 && rightIndex === -1) {
    return left.label.localeCompare(right.label);
  }

  if (leftIndex === -1) return 1;
  if (rightIndex === -1) return -1;

  return leftIndex - rightIndex;
};

const pause = (ms: number, signal: AbortSignal) =>
  new Promise<void>((resolve, reject) => {
    const timeoutId = window.setTimeout(() => resolve(), ms);

    signal.addEventListener(
      "abort",
      () => {
        window.clearTimeout(timeoutId);
        reject(new DOMException("Request aborted", "AbortError"));
      },
      { once: true }
    );
  });

const fetchJson = async <T,>(url: string, signal: AbortSignal) => {
  const response = await fetch(url, {
    headers: BLOCKNATIVE_API_KEY ? { Authorization: BLOCKNATIVE_API_KEY } : undefined,
    signal,
  });

  if (!response.ok) {
    const suffix = response.status === 401
      ? " Tambahkan VITE_BLOCKNATIVE_API_KEY bila endpoint meminta auth."
      : "";

    throw new Error(`Gas fee request gagal (${response.status}).${suffix}`);
  }

  return (await response.json()) as T;
};

const normalizeChainList = (items: BlocknativeChain[]) => {
  const normalized = items
    .filter((chain) => {
      const features = chain.features ?? [];
      const isTestNetwork = /test|sepolia|holesky|goerli|devnet/i.test(chain.network);

      return chain.arch === "evm" && !isTestNetwork && features.includes("blockprices");
    })
    .sort((left, right) => sortChainOrder(
      {
        chainId: left.chainId,
        label: left.label,
        system: left.system,
        network: left.network,
      },
      {
        chainId: right.chainId,
        label: right.label,
        system: right.system,
        network: right.network,
      }
    ));

  const preferred = normalized.filter((chain) => PRIORITY_CHAIN_ORDER.includes(chain.chainId));
  return (preferred.length > 0 ? preferred : normalized).slice(0, MAX_VISIBLE_CHAINS);
};

const normalizeGasItem = (chain: BlocknativeChain, payload: BlockPricesResponse): GasFeeItem | null => {
  const latestBlock = payload.blockPrices?.[0];
  if (!latestBlock) return null;

  const estimates = (latestBlock.estimatedPrices ?? [])
    .map((estimate) => ({
      ...estimate,
      resolvedFee: estimate.maxFeePerGas ?? estimate.price,
    }))
    .filter((estimate) => estimate.resolvedFee != null && !Number.isNaN(estimate.resolvedFee))
    .sort((left, right) => (left.resolvedFee ?? 0) - (right.resolvedFee ?? 0));

  const preferredEstimate =
    latestBlock.estimatedPrices?.find((estimate) => estimate.confidence === 90) ??
    latestBlock.estimatedPrices?.find((estimate) => estimate.confidence === 80) ??
    latestBlock.estimatedPrices?.[0];

  const lowEstimate = estimates[0];
  const fastEstimate =
    estimates.find((estimate) => estimate.confidence === 90) ??
    estimates[Math.min(1, Math.max(estimates.length - 1, 0))];
  const highEstimate = estimates[estimates.length - 1];

  return {
    chainId: chain.chainId,
    label: CHAIN_LABEL_OVERRIDES[chain.chainId] ?? chain.label,
    icon: chain.icon,
    arch: chain.arch,
    system: chain.system,
    network: chain.network,
    baseFee: latestBlock.baseFeePerGas,
    maxFee: preferredEstimate?.maxFeePerGas ?? preferredEstimate?.price,
    priorityFee: preferredEstimate?.maxPriorityFeePerGas,
    confidence: preferredEstimate?.confidence,
    lowFee: lowEstimate?.resolvedFee,
    fastFee: fastEstimate?.resolvedFee,
    highFee: highEstimate?.resolvedFee,
  };
};

const chunkItems = <T,>(items: T[], size: number) => {
  const chunks: T[][] = [];

  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }

  return chunks;
};

const loadGasFees = async (signal: AbortSignal): Promise<GasFeesSnapshot> => {
  const chains = await fetchJson<BlocknativeChain[]>(BLOCKNATIVE_CHAINS_URL, signal);
  const supportedChains = normalizeChainList(chains);
  const gasItems: GasFeeItem[] = [];

  const batches = chunkItems(supportedChains, CHAIN_BATCH_SIZE);

  for (let batchIndex = 0; batchIndex < batches.length; batchIndex += 1) {
    const batch = batches[batchIndex];
    const results = await Promise.allSettled(
      batch.map(async (chain) => {
        const payload = await fetchJson<BlockPricesResponse>(
          `${BLOCKNATIVE_BLOCK_PRICES_URL}?chainid=${chain.chainId}&confidenceLevels=70,80,90,95`,
          signal
        );

        return normalizeGasItem(chain, payload);
      })
    );

    results.forEach((result) => {
      if (result.status === "fulfilled" && result.value) {
        gasItems.push(result.value);
      }
    });

    if (!signal.aborted && batchIndex < batches.length - 1) {
      await pause(120, signal);
    }
  }

  if (gasItems.length === 0) {
    throw new Error("Gas fee live belum bisa dimuat dari sumber publik.");
  }

  return {
    items: gasItems.sort(sortChainOrder),
    lastUpdated: Date.now(),
    totalChains: supportedChains.length,
  };
};

export function useGasFees() {
  const [snapshot, setSnapshot] = useState<GasFeesSnapshot | null>(() => cachedSnapshot);
  const [loading, setLoading] = useState(() => cachedSnapshot == null);
  const [error, setError] = useState<string | null>(() => cachedError);

  useEffect(() => {
    let isMounted = true;
    let controller: AbortController | null = null;

    const run = async () => {
      controller?.abort();
      controller = new AbortController();

      if (cachedSnapshot == null) {
        setLoading(true);
      }

      try {
        const nextSnapshot = await loadGasFees(controller.signal);
        if (!isMounted) return;

        cachedSnapshot = nextSnapshot;
        cachedAt = Date.now();
        cachedError = null;
        setSnapshot(nextSnapshot);
        setError(null);
      } catch (caughtError) {
        if (!isMounted || (caughtError instanceof DOMException && caughtError.name === "AbortError")) return;

        const message = caughtError instanceof Error ? caughtError.message : "Gas fee live gagal dimuat.";
        cachedError = message;
        setError(message);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    const isCacheFresh = cachedSnapshot && Date.now() - cachedAt < CACHE_TTL_MS;

    if (isCacheFresh) {
      setSnapshot(cachedSnapshot);
      setError(cachedError);
      setLoading(false);
    } else {
      void run();
    }

    const intervalId = window.setInterval(() => {
      void run();
    }, REFRESH_INTERVAL_MS);

    return () => {
      isMounted = false;
      controller?.abort();
      window.clearInterval(intervalId);
    };
  }, []);

  return {
    items: snapshot?.items ?? [],
    lastUpdated: snapshot?.lastUpdated ?? null,
    totalChains: snapshot?.totalChains ?? 0,
    loading,
    error,
  };
}
