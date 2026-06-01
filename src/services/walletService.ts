import type { ChainFamily, WalletAnalysisResult } from "@/types/intelligence";

type AlchemyTransfer = {
  blockNum?: string;
  hash?: string;
  to?: string;
  from?: string;
  category?: string;
  asset?: string;
  metadata?: {
    blockTimestamp?: string;
  };
};

type HeliusTransaction = {
  timestamp?: number;
  type?: string;
  description?: string;
  fee?: number;
  feePayer?: string;
  nativeTransfers?: Array<{ fromUserAccount?: string; toUserAccount?: string }>;
  tokenTransfers?: Array<{ fromUserAccount?: string; toUserAccount?: string; mint?: string }>;
  accountData?: Array<{ account?: string }>;
};

const bridgeKeywords = ["bridge", "stargate", "layerzero", "hop", "across", "orbiter", "synapse"];
const defiKeywords = ["swap", "uniswap", "aave", "curve", "balancer", "sushi", "compound", "lido"];

function getAgeDays(firstSeenAt: string | null) {
  if (!firstSeenAt) return null;
  return Math.max(0, Math.floor((Date.now() - new Date(firstSeenAt).getTime()) / 86_400_000));
}

function uniqueCount(values: Array<string | undefined>) {
  return new Set(values.filter(Boolean).map((value) => value!.toLowerCase())).size;
}

function countKeywordMatches(transfers: AlchemyTransfer[], keywords: string[]) {
  return transfers.filter((transfer) => keywords.some((keyword) => JSON.stringify(transfer).toLowerCase().includes(keyword))).length;
}

function mergeTransfers(...groups: AlchemyTransfer[][]) {
  const byHash = new Map<string, AlchemyTransfer>();
  groups.flat().forEach((transfer) => {
    const key = transfer.hash ?? `${transfer.blockNum}-${transfer.from}-${transfer.to}-${transfer.category}`;
    byHash.set(key, transfer);
  });
  return Array.from(byHash.values()).sort((a, b) => {
    const left = a.metadata?.blockTimestamp ? new Date(a.metadata.blockTimestamp).getTime() : 0;
    const right = b.metadata?.blockTimestamp ? new Date(b.metadata.blockTimestamp).getTime() : 0;
    return left - right;
  });
}

function sumGas(receipts: Array<{ gasUsed?: string } | null>) {
  const total = receipts.reduce((acc, receipt) => acc + BigInt(receipt?.gasUsed ?? "0x0"), 0n);
  return total > 0n ? total.toString() : null;
}

async function callAlchemy(method: string, params: unknown[]) {
  const key = import.meta.env.VITE_ALCHEMY_API_KEY as string | undefined;
  if (!key) throw new Error("No EVM data provider configured. Add VITE_ALCHEMY_API_KEY, Moralis, or Covalent credentials.");

  const response = await fetch(`https://eth-mainnet.g.alchemy.com/v2/${key}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
  });

  if (!response.ok) throw new Error("Unable to fetch EVM wallet data");
  const payload = await response.json();
  if (payload.error) throw new Error(payload.error.message || "Unable to fetch EVM wallet data");
  return payload.result;
}

async function analyzeEvmWallet(address: string): Promise<WalletAnalysisResult> {
  const baseTransferParams = {
    fromBlock: "0x0",
    toBlock: "latest",
    category: ["external", "internal", "erc20", "erc721", "erc1155"],
    maxCount: "0x3e8",
    order: "asc",
    withMetadata: true,
    excludeZeroValue: false,
  };

  const [nonceHex, outgoingResult, incomingResult] = await Promise.all([
    callAlchemy("eth_getTransactionCount", [address, "latest"]),
    callAlchemy("alchemy_getAssetTransfers", [{ ...baseTransferParams, fromAddress: address }]),
    callAlchemy("alchemy_getAssetTransfers", [{ ...baseTransferParams, toAddress: address }]),
  ]);

  const outgoing = (outgoingResult?.transfers ?? []) as AlchemyTransfer[];
  const incoming = (incomingResult?.transfers ?? []) as AlchemyTransfer[];
  const transfers = mergeTransfers(outgoing, incoming);
  const firstSeenAt = transfers[0]?.metadata?.blockTimestamp ?? null;
  const txHashes = Array.from(new Set(transfers.map((transfer) => transfer.hash).filter((hash): hash is string => Boolean(hash))));
  const receipts = await Promise.all(txHashes.slice(-20).map((hash) => callAlchemy("eth_getTransactionReceipt", [hash]).catch(() => null)));
  const totalTx = Math.max(Number.parseInt(nonceHex, 16), txHashes.length);
  const counterparties = Array.from(new Set(transfers.flatMap((transfer) => [transfer.from, transfer.to]).filter((value): value is string => Boolean(value && value.toLowerCase() !== address.toLowerCase()))));

  return {
    address,
    chain: "EVM",
    provider: "Alchemy",
    walletAgeDays: getAgeDays(firstSeenAt),
    firstSeenAt,
    totalTx,
    mainnetTx: totalTx,
    testnetTx: null,
    devnetTx: null,
    gasUsed: sumGas(receipts),
    uniqueContracts: uniqueCount(transfers.map((transfer) => transfer.to)),
    bridgeUsage: countKeywordMatches(transfers, bridgeKeywords),
    nftActivity: transfers.filter((transfer) => transfer.category === "erc721" || transfer.category === "erc1155").length,
    defiActivity: countKeywordMatches(transfers, defiKeywords),
    signals: transfers.length >= 1000 ? ["Transfer history reached provider sample limit."] : [`Fetched ${incoming.length} incoming and ${outgoing.length} outgoing transfers.`],
    rawSampleSize: transfers.length,
    txTimestamps: transfers.map((transfer) => transfer.metadata?.blockTimestamp).filter((value): value is string => Boolean(value)),
    counterparties,
  };
}

async function analyzeSolanaWallet(address: string): Promise<WalletAnalysisResult> {
  const key = import.meta.env.VITE_HELIUS_API_KEY as string | undefined;
  if (!key) throw new Error("No Solana data provider configured. Add VITE_HELIUS_API_KEY or Solscan credentials.");

  const response = await fetch(`https://api-mainnet.helius-rpc.com/v0/addresses/${address}/transactions?api-key=${key}&limit=100`);

  if (!response.ok) throw new Error("Unable to fetch Solana wallet data");
  const payload = await response.json();
  if (payload.error) throw new Error(payload.error.message || "Unable to fetch Solana wallet data");

  const transactions = Array.isArray(payload) ? payload as HeliusTransaction[] : [];
  const oldest = transactions.length > 0 ? transactions[transactions.length - 1] : undefined;
  const firstSeenAt = oldest?.timestamp ? new Date(oldest.timestamp * 1000).toISOString() : null;
  const counterparties = Array.from(new Set(transactions.flatMap((transaction) => [
    transaction.feePayer,
    ...(transaction.nativeTransfers ?? []).flatMap((transfer) => [transfer.fromUserAccount, transfer.toUserAccount]),
    ...(transaction.tokenTransfers ?? []).flatMap((transfer) => [transfer.fromUserAccount, transfer.toUserAccount]),
  ]).filter((value): value is string => Boolean(value && value !== address))));
  const nftActivity = transactions.filter((transaction) => /nft/i.test(`${transaction.type ?? ""} ${transaction.description ?? ""}`)).length;
  const defiActivity = transactions.filter((transaction) => defiKeywords.some((keyword) => `${transaction.type ?? ""} ${transaction.description ?? ""}`.toLowerCase().includes(keyword))).length;
  const bridgeUsage = transactions.filter((transaction) => bridgeKeywords.some((keyword) => `${transaction.type ?? ""} ${transaction.description ?? ""}`.toLowerCase().includes(keyword))).length;

  return {
    address,
    chain: "Solana",
    provider: "Helius",
    walletAgeDays: getAgeDays(firstSeenAt),
    firstSeenAt,
    totalTx: transactions.length,
    mainnetTx: transactions.length,
    testnetTx: null,
    devnetTx: null,
    gasUsed: transactions.reduce((total, transaction) => total + (transaction.fee ?? 0), 0).toString(),
    uniqueContracts: uniqueCount(transactions.flatMap((transaction) => transaction.accountData?.map((account) => account.account) ?? [])),
    bridgeUsage,
    nftActivity,
    defiActivity,
    signals: transactions.length >= 100 ? ["Enhanced transaction history reached provider sample limit."] : [`Fetched ${transactions.length} enhanced Solana transactions.`],
    rawSampleSize: transactions.length,
    txTimestamps: transactions.map((transaction) => transaction.timestamp ? new Date(transaction.timestamp * 1000).toISOString() : undefined).filter((value): value is string => Boolean(value)),
    counterparties,
  };
}

export async function analyzeWallet(address: string, chain: ChainFamily): Promise<WalletAnalysisResult> {
  return chain === "EVM" ? analyzeEvmWallet(address) : analyzeSolanaWallet(address);
}
