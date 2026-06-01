import type { GithubRepoActivity } from "@/types/intelligence";

type GithubRepoResponse = {
  full_name: string;
  name: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  pushed_at: string | null;
  html_url: string;
};

function mapRepository(data: GithubRepoResponse): GithubRepoActivity {
  return {
    fullName: data.full_name,
    sourceType: "repository",
    description: data.description,
    stars: data.stargazers_count,
    forks: data.forks_count,
    openIssues: data.open_issues_count,
    pushedAt: data.pushed_at,
    htmlUrl: data.html_url,
  };
}

async function fetchJson<T>(url: string): Promise<T | null> {
  const headers: HeadersInit = { accept: "application/vnd.github+json" };
  const token = import.meta.env.VITE_GITHUB_TOKEN as string | undefined;
  if (token) headers.authorization = `Bearer ${token}`;

  const response = await fetch(url, { headers });
  if (!response.ok) return null;
  return response.json() as Promise<T>;
}

async function getOrganizationData(owner: string): Promise<GithubRepoActivity | null> {
  const repos = await fetchJson<GithubRepoResponse[]>(`https://api.github.com/orgs/${owner}/repos?sort=updated&per_page=20`)
    ?? await fetchJson<GithubRepoResponse[]>(`https://api.github.com/users/${owner}/repos?sort=updated&per_page=20`);

  if (!repos?.length) return null;

  const sortedByActivity = [...repos].sort((a, b) => new Date(b.pushed_at ?? 0).getTime() - new Date(a.pushed_at ?? 0).getTime());
  const totalStars = repos.reduce((total, repo) => total + repo.stargazers_count, 0);
  const totalForks = repos.reduce((total, repo) => total + repo.forks_count, 0);
  const totalIssues = repos.reduce((total, repo) => total + repo.open_issues_count, 0);
  const primary = sortedByActivity[0];

  return {
    fullName: owner,
    sourceType: "organization",
    description: primary?.description ?? null,
    stars: totalStars,
    forks: totalForks,
    openIssues: totalIssues,
    pushedAt: primary?.pushed_at ?? null,
    htmlUrl: `https://github.com/${owner}`,
    repositoryCount: repos.length,
    topRepositories: sortedByActivity.slice(0, 5).map((repo) => ({
      name: repo.full_name,
      stars: repo.stargazers_count,
      pushedAt: repo.pushed_at,
      htmlUrl: repo.html_url,
    })),
  };
}

export async function getGithubRepoData(githubUrl: string): Promise<GithubRepoActivity | null> {
  if (!githubUrl) return null;
  try {
    const parsed = new URL(githubUrl.match(/^https?:\/\//i) ? githubUrl : `https://${githubUrl}`);
    const [owner, repoSegment] = parsed.pathname.split("/").filter(Boolean);
    if (!owner) return null;

    if (!repoSegment) return getOrganizationData(owner);

    const repo = repoSegment.replace(/\.git$/, "");
    const data = await fetchJson<GithubRepoResponse>(`https://api.github.com/repos/${owner}/${repo}`);
    if (!data) return getOrganizationData(owner);
    return mapRepository(data);
  } catch {
    return null;
  }
}
