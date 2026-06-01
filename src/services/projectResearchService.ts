import { supabase } from "@/lib/supabase";
import type { ProjectResearchInput, ProjectResearchResult } from "@/types/intelligence";

type ProjectResearchFunctionResponse = {
  ok?: boolean;
  result?: ProjectResearchResult;
  error?: string;
};

const emptyResearchResult = (): ProjectResearchResult => ({
  name: "Unknown project",
  score: 0,
  recommendation: "WATCHLIST",
  summary: [],
  metadata: null,
  github: null,
  funding: null,
  social: null,
});

const clampScore = (value: unknown) => {
  const score = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(score)) return 0;
  return Math.max(0, Math.min(10, Number(score.toFixed(1))));
};

const normalizeRecommendation = (value: unknown): ProjectResearchResult["recommendation"] => {
  if (value === "EXECUTE" || value === "WATCHLIST" || value === "SKIP") {
    return value;
  }
  return "WATCHLIST";
};

const normalizeStringArray = (value: unknown) =>
  Array.isArray(value)
    ? value.map((item) => String(item).trim()).filter(Boolean)
    : [];

const normalizeResearchResult = (value: unknown): ProjectResearchResult => {
  const parsed = (value && typeof value === "object" ? value : {}) as Partial<ProjectResearchResult>;
  const fallback = emptyResearchResult();

  return {
    name: typeof parsed.name === "string" && parsed.name.trim() ? parsed.name.trim() : fallback.name,
    score: clampScore(parsed.score),
    recommendation: normalizeRecommendation(parsed.recommendation),
    summary: normalizeStringArray(parsed.summary),
    metadata: parsed.metadata ?? null,
    github: parsed.github ?? null,
    funding: parsed.funding ?? null,
    social: parsed.social ?? null,
  };
};

export async function analyzeProject(input: ProjectResearchInput): Promise<ProjectResearchResult> {
  const { data, error } = await supabase.functions.invoke<ProjectResearchFunctionResponse>(
    "project-research",
    {
      body: input,
    },
  );

  if (error) {
    throw new Error(error.message || "Project research function gagal dipanggil.");
  }

  if (!data?.ok || !data.result) {
    throw new Error(data?.error || "Project research response kosong.");
  }

  return normalizeResearchResult(data.result);
}
