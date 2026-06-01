import type { FundingData } from "@/types/intelligence";

type RootDataSearchItem = {
  id?: number;
  project_id?: number;
  name?: string;
  project_name?: string;
  type?: number;
};

type RootDataProject = {
  project_name?: string;
  total_funding?: number | string;
  rootdataurl?: string;
  investors?: Array<{ name?: string } | string>;
};

async function rootDataRequest<T>(endpoint: string, body: Record<string, unknown>): Promise<T | null> {
  const apiKey = import.meta.env.VITE_ROOTDATA_API_KEY as string | undefined;
  if (!apiKey) return null;

  const response = await fetch(`https://api.rootdata.com/open/${endpoint}`, {
    method: "POST",
    headers: {
      apikey: apiKey,
      language: "en",
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) return null;
  const payload = await response.json();
  if (payload.result !== 200) return null;
  return payload.data as T;
}

function formatFunding(value: RootDataProject["total_funding"]) {
  if (value === undefined || value === null || value === "") return undefined;
  const amount = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(amount)) return String(value);
  if (amount >= 1_000_000_000) return `$${(amount / 1_000_000_000).toFixed(2)}B`;
  if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(2)}M`;
  if (amount >= 1_000) return `$${(amount / 1_000).toFixed(2)}K`;
  return `$${amount.toLocaleString()}`;
}

function mapInvestors(project: RootDataProject) {
  return (project.investors ?? [])
    .map((investor) => typeof investor === "string" ? investor : investor.name)
    .filter((name): name is string => Boolean(name));
}

export async function fetchFundingData(projectName: string): Promise<FundingData | null> {
  const cleanName = projectName.replace(/\s*[|–-].*$/, "").trim();
  if (!cleanName) return null;

  const searchResults = await rootDataRequest<RootDataSearchItem[]>("ser_inv", { query: cleanName });
  const projectMatch = searchResults?.find((item) => item.type === 1 || item.project_id || item.id);
  const projectId = projectMatch?.project_id ?? projectMatch?.id;
  if (!projectId) return null;

  const project = await rootDataRequest<RootDataProject>("get_item", {
    project_id: projectId,
    include_investors: true,
  });

  if (!project) return null;

  return {
    total: formatFunding(project.total_funding),
    investors: mapInvestors(project),
    sourceUrl: project.rootdataurl,
    sourceName: project.project_name,
  };
}
