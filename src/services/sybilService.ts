import type { ChainFamily, SybilAnalysisResult, WalletAnalysisResult } from "@/types/intelligence";
import { isValidEvmAddress } from "@/utils/validation";
import { analyzeWallet } from "./walletService";

function countBurstWindows(timestamps: string[]) {
  const sorted = timestamps.map((timestamp) => new Date(timestamp).getTime()).filter(Number.isFinite).sort((a, b) => a - b);
  let bursts = 0;
  for (let index = 1; index < sorted.length; index += 1) {
    const minutes = (sorted[index] - sorted[index - 1]) / 60_000;
    if (minutes >= 0 && minutes <= 3) bursts += 1;
  }
  return bursts;
}

function scoreWallet(wallet: WalletAnalysisResult) {
  let score = 0;
  const indicators: string[] = [];
  const burstWindows = countBurstWindows(wallet.txTimestamps);
  const totalTx = wallet.totalTx ?? 0;
  const diversityRatio = wallet.uniqueContracts !== null && totalTx > 0 ? wallet.uniqueContracts / totalTx : null;
  const counterpartyRatio = totalTx > 0 ? wallet.counterparties.length / totalTx : null;
  const bridgeRatio = wallet.bridgeUsage !== null && totalTx > 0 ? wallet.bridgeUsage / totalTx : null;
  const burstRatio = wallet.txTimestamps.length > 1 ? burstWindows / wallet.txTimestamps.length : null;

  if (wallet.rawSampleSize === 0 || totalTx === 0) {
    indicators.push("No fetched transaction history; score cannot prove sybil behavior.");
    return {
      score: 0,
      indicators,
      burstWindows,
    };
  }

  if (wallet.walletAgeDays !== null && wallet.walletAgeDays < 7) {
    score += 28;
    indicators.push("Very new wallet age.");
  } else if (wallet.walletAgeDays !== null && wallet.walletAgeDays < 30) {
    score += 20;
    indicators.push("New wallet age.");
  } else if (wallet.walletAgeDays !== null && wallet.walletAgeDays < 90) {
    score += 8;
    indicators.push("Relatively young wallet.");
  }

  if (totalTx < 5) {
    score += 20;
    indicators.push("Very low transaction count.");
  } else if (totalTx < 15) {
    score += 8;
    indicators.push("Limited transaction history.");
  }

  if (diversityRatio !== null && totalTx > 20 && wallet.uniqueContracts !== null && wallet.uniqueContracts < 4) {
    score += 20;
    indicators.push("Low interaction diversity.");
  } else if (diversityRatio !== null && totalTx > 20 && diversityRatio < 0.2) {
    score += 10;
    indicators.push("Interaction diversity is below normal range.");
  }

  if (wallet.counterparties.length > 0 && totalTx > 15 && wallet.counterparties.length < 3) {
    score += 15;
    indicators.push("Funding or counterparty clustering detected.");
  } else if (counterpartyRatio !== null && totalTx > 25 && counterpartyRatio < 0.15) {
    score += 8;
    indicators.push("Counterparty set is narrow for this activity level.");
  }

  if (bridgeRatio !== null && bridgeRatio > 0.45) {
    score += 20;
    indicators.push("Bridge-heavy repeated behavior.");
  } else if (bridgeRatio !== null && bridgeRatio > 0.2) {
    score += 8;
    indicators.push("Bridge usage is elevated.");
  }

  if (burstRatio !== null && wallet.txTimestamps.length > 10 && burstRatio > 0.35) {
    score += 15;
    indicators.push("Burst transaction timing pattern.");
  } else if (burstRatio !== null && wallet.txTimestamps.length > 10 && burstRatio > 0.15) {
    score += 7;
    indicators.push("Some clustered transaction timing detected.");
  }

  if (wallet.rawSampleSize >= 1000) {
    score += 10;
    indicators.push("Provider sample limit reached; confidence reduced.");
  }

  return {
    score: Math.max(0, Math.min(100, score)),
    indicators,
    burstWindows,
  };
}

export async function analyzeSybil(address: string): Promise<SybilAnalysisResult> {
  const chain: ChainFamily = isValidEvmAddress(address) ? "EVM" : "Solana";
  const wallet = await analyzeWallet(address, chain);
  const analysis = scoreWallet(wallet);
  const label = analysis.score >= 70 ? "High risk" : analysis.score >= 35 ? "Medium risk" : "Low risk";
  const confidence = wallet.rawSampleSize >= 25 ? "High" : wallet.rawSampleSize >= 5 ? "Medium" : "Low";

  return {
    address,
    chain,
    score: analysis.score,
    label,
    confidence,
    indicators: analysis.indicators.length ? analysis.indicators : ["No major sybil indicators detected from fetched data."],
    evidence: {
      totalTx: wallet.totalTx,
      walletAgeDays: wallet.walletAgeDays,
      uniqueContracts: wallet.uniqueContracts,
      counterparties: wallet.counterparties.length,
      burstTransactions: analysis.burstWindows,
      bridgeUsage: wallet.bridgeUsage,
      rawSampleSize: wallet.rawSampleSize,
    },
    wallet,
  };
}
