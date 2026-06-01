import { useCallback, useMemo, useState } from "react";
import { analyzeWallet } from "@/services/walletService";
import type { AnalysisStatus, ChainFamily, WalletAnalysisResult } from "@/types/intelligence";
import { isValidEvmAddress, isValidSolanaAddress } from "@/utils/validation";

export function useWalletAnalysis() {
  const [status, setStatus] = useState<AnalysisStatus>("idle");
  const [result, setResult] = useState<WalletAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const run = useCallback(async (address: string, chain: ChainFamily) => {
    const trimmed = address.trim();
    setError(null);
    setResult(null);

    if (!trimmed) {
      setStatus("idle");
      setError("Enter wallet address to analyze activity.");
      return;
    }

    if (chain === "EVM" && !isValidEvmAddress(trimmed)) {
      setStatus("idle");
      setError("Invalid EVM address");
      return;
    }

    if (chain === "Solana" && !isValidSolanaAddress(trimmed)) {
      setStatus("idle");
      setError("Invalid Solana address");
      return;
    }

    setStatus("loading");
    try {
      setResult(await analyzeWallet(trimmed, chain));
      setStatus("success");
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : "Unable to analyze wallet";
      setError(message);
      setStatus("error");
    }
  }, []);

  const reset = useCallback(() => {
    setStatus("idle");
    setResult(null);
    setError(null);
  }, []);

  return useMemo(() => ({ status, result, error, run, reset }), [error, reset, result, run, status]);
}
