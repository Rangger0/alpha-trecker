export type AnalysisStatus = "idle" | "loading" | "success" | "error";

export type ProjectResearchInput = {
  projectUrl?: string;
  docsUrl?: string;
  githubUrl?: string;
  twitterUrl?: string;
  notes?: string;
};

export type ProjectMetadata = {
  title?: string;
  description?: string;
  ecosystem?: string;
  hasToken?: boolean;
  url: string;
};

export type GithubRepoActivity = {
  fullName: string;
  sourceType: "repository" | "organization";
  description: string | null;
  stars: number;
  forks: number;
  openIssues: number;
  pushedAt: string | null;
  htmlUrl: string;
  repositoryCount?: number;
  topRepositories?: Array<{
    name: string;
    stars: number;
    pushedAt: string | null;
    htmlUrl: string;
  }>;
};

export type FundingData = {
  total?: string;
  investors: string[];
  sourceUrl?: string;
  sourceName?: string;
};

export type SocialData = {
  profileUrl: string;
  handle?: string;
  source: "twitter" | "x";
};

export type ProjectResearchResult = {
  name: string;
  score: number;
  recommendation: "EXECUTE" | "WATCHLIST" | "SKIP";
  summary: string[];
  metadata: ProjectMetadata | null;
  github: GithubRepoActivity | null;
  funding: FundingData | null;
  social: SocialData | null;
};

export type ChainFamily = "EVM" | "Solana";

export type WalletAnalysisResult = {
  address: string;
  chain: ChainFamily;
  provider: string;
  walletAgeDays: number | null;
  firstSeenAt: string | null;
  totalTx: number | null;
  mainnetTx: number | null;
  testnetTx: number | null;
  devnetTx: number | null;
  gasUsed: string | null;
  uniqueContracts: number | null;
  bridgeUsage: number | null;
  nftActivity: number | null;
  defiActivity: number | null;
  signals: string[];
  rawSampleSize: number;
  txTimestamps: string[];
  counterparties: string[];
};

export type SybilAnalysisResult = {
  address: string;
  chain: ChainFamily;
  score: number;
  label: "Low risk" | "Medium risk" | "High risk";
  confidence: "Low" | "Medium" | "High";
  indicators: string[];
  evidence: {
    totalTx: number | null;
    walletAgeDays: number | null;
    uniqueContracts: number | null;
    counterparties: number;
    burstTransactions: number;
    bridgeUsage: number | null;
    rawSampleSize: number;
  };
  wallet: WalletAnalysisResult;
};
