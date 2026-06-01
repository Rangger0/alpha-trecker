import { useCallback, useMemo, useState } from "react";
import { analyzeSybil } from "@/services/sybilService";
import type { AnalysisStatus, SybilAnalysisResult } from "@/types/intelligence";
import { isValidEvmAddress, isValidSolanaAddress } from "@/utils/validation";

export function useSybilAnalysis() {
  const [status, setStatus] = useState<AnalysisStatus>("idle");
  const [result, setResult] = useState<SybilAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const run = useCallback(async (address: string) => {
    const trimmed = address.trim();
    setError(null);
    setResult(null);

    if (!trimmed) {
      setStatus("idle");
      setError("Enter wallet address to analyze activity.");
      return;
    }

    if (!isValidEvmAddress(trimmed) && !isValidSolanaAddress(trimmed)) {
      setStatus("idle");
      setError("Invalid wallet address");
      return;
    }

    setStatus("loading");
    try {
      setResult(await analyzeSybil(trimmed));
      setStatus("success");
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : "Unable to analyze address";
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
