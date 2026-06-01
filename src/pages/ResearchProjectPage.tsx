import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useProjectResearch } from "@/hooks/useProjectResearch";

function Step({ label, active, done }: { label: string; active: boolean; done: boolean }) {
  return (
    <div className={`flex items-center gap-3 ${active || done ? "alpha-text" : "alpha-text-muted"}`}>
      <div className={`h-2.5 w-2.5 rounded-full ${active ? "animate-pulse bg-[color:var(--alpha-highlight)]" : done ? "bg-[color:var(--alpha-signal)]" : "bg-[color:var(--alpha-border)]"}`} />
      <div className="text-sm">{label}</div>
    </div>
  );
}

export function ResearchProjectPage() {
  const [projectUrl, setProjectUrl] = useState("");
  const [docsUrl, setDocsUrl] = useState("");
  const [twitterUrl, setTwitterUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [notes, setNotes] = useState("");
  const research = useProjectResearch();
  const running = research.status === "loading";
  const result = research.result;

  const clear = () => {
    setProjectUrl("");
    setDocsUrl("");
    setTwitterUrl("");
    setGithubUrl("");
    setNotes("");
    research.reset();
  };

  const analyze = () => research.run({ projectUrl, docsUrl, githubUrl, twitterUrl, notes });

  return (
    <DashboardLayout>
      <div className="macos-root macos-page-shell">
        <section className="macos-page-header macos-animate-up">
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px] xl:items-end">
            <div>
              <div className="macos-page-kicker">
                <Search className="h-3.5 w-3.5" />
                Research
              </div>
              <h1 className="macos-page-title">Research Project</h1>
              <p className="macos-page-subtitle">Paste links and generate an AI research report with scoring and recommendations.</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="macos-card rounded-[1.2rem] px-4 py-3">
                <p className="text-[10px] uppercase tracking-[0.2em] alpha-text-muted">Inputs</p>
                <p className="mt-2 text-[1.25rem] font-semibold alpha-text">Link-based analysis</p>
              </div>
              <div className="macos-card rounded-[1.2rem] px-4 py-3">
                <p className="text-[10px] uppercase tracking-[0.2em] alpha-text-muted">AI Engine</p>
                <p className="mt-2 text-[1.25rem] font-semibold alpha-text">Live sources</p>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[520px_1fr]">
          <div className="space-y-4">
            <div className="macos-card rounded-[1.2rem] p-4">
              <p className="text-[12px] font-semibold alpha-text-muted">Project Links</p>

              <div className="mt-3 space-y-3">
                <label className="block">
                  <div className="text-[11px] alpha-text-muted">Project URL</div>
                  <input value={projectUrl} onChange={(e) => setProjectUrl(e.target.value)} placeholder="https://example.com" className="mt-1 w-full rounded-md border px-3 py-2" />
                  {research.fieldErrors.projectUrl ? <div className="mt-1 text-xs text-[color:var(--alpha-danger)]">{research.fieldErrors.projectUrl}</div> : null}
                </label>

                <label className="block">
                  <div className="text-[11px] alpha-text-muted">Docs URL</div>
                  <input value={docsUrl} onChange={(e) => setDocsUrl(e.target.value)} placeholder="https://docs.example.com" className="mt-1 w-full rounded-md border px-3 py-2" />
                  {research.fieldErrors.docsUrl ? <div className="mt-1 text-xs text-[color:var(--alpha-danger)]">{research.fieldErrors.docsUrl}</div> : null}
                </label>

                <label className="block">
                  <div className="text-[11px] alpha-text-muted">Twitter / X URL</div>
                  <input value={twitterUrl} onChange={(e) => setTwitterUrl(e.target.value)} placeholder="https://twitter.com/example" className="mt-1 w-full rounded-md border px-3 py-2" />
                  {research.fieldErrors.twitterUrl ? <div className="mt-1 text-xs text-[color:var(--alpha-danger)]">{research.fieldErrors.twitterUrl}</div> : null}
                </label>

                <label className="block">
                  <div className="text-[11px] alpha-text-muted">GitHub URL</div>
                  <input value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} placeholder="https://github.com/example" className="mt-1 w-full rounded-md border px-3 py-2" />
                  {research.fieldErrors.githubUrl ? <div className="mt-1 text-xs text-[color:var(--alpha-danger)]">{research.fieldErrors.githubUrl}</div> : null}
                </label>

                <label className="block">
                  <div className="text-[11px] alpha-text-muted">Optional Notes</div>
                  <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Any notes or context" className="mt-1 w-full rounded-md border px-3 py-2 min-h-[80px]" />
                </label>

                <div className="mt-3 flex gap-3">
                  <button onClick={analyze} disabled={running} className="rounded-full bg-[color:var(--alpha-highlight)] px-4 py-2 font-semibold text-[color:var(--alpha-accent-contrast)]">{running ? 'Analyzing...' : 'Analyze Project'}</button>
                  <button onClick={clear} className="rounded-full border px-4 py-2">Clear</button>
                </div>

                <div className="mt-4 space-y-2">
                  {running ? (
                    <div className="space-y-3">
                      {research.steps.map((s, i) => <Step key={s} label={s} active={i === research.stepIndex} done={i < research.stepIndex} />)}
                      <div className="space-y-2 pt-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-4 w-2/3" />
                      </div>
                    </div>
                  ) : (
                    research.steps.map((s) => <Step key={s} label={s} active={false} done={false} />)
                  )}
                </div>
              </div>
            </div>
            <div className="macos-card rounded-[1.2rem] p-4">
              <p className="text-[12px] font-semibold alpha-text-muted">AI Notes</p>
              <p className="mt-2 text-sm alpha-text-muted">Uses GitHub REST, RootData funding metadata, website/docs crawl, and social URL validation. Missing provider data stays empty instead of being fabricated.</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="macos-card rounded-[1.2rem] p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] alpha-text-muted">Project Score</p>
                  {research.status === "error" ? (
                    <div className="mt-3">
                      <p className="alpha-text-muted">{research.error}</p>
                      <div className="mt-2 flex gap-2">
                        <button onClick={analyze} className="rounded-full bg-[color:var(--alpha-highlight)] px-3 py-1 text-[color:var(--alpha-accent-contrast)]">Retry</button>
                      </div>
                    </div>
                  ) : result ? (
                    <div className="mt-2 flex items-end gap-3">
                      <div className="text-[2.5rem] font-semibold alpha-text">{`${result.score} / 10`}</div>
                      <div className="rounded-full border border-alpha-border bg-[color:var(--alpha-hover-soft)] px-3 py-1 text-[12px] alpha-text-muted">{result.recommendation}</div>
                    </div>
                  ) : research.error ? (
                    <div className="mt-2 text-[color:var(--alpha-danger)]">{research.error}</div>
                  ) : (
                    <div className="mt-2 alpha-text-muted">Paste a project link to begin AI research.</div>
                  )}
                </div>

                <div className="min-w-0 text-right">
                  <div className="text-sm alpha-text-muted">{result ? result.name : 'No analysis yet'}</div>
                </div>
              </div>

              {running ? (
                <div className="mt-4 space-y-3">
                  <Skeleton className="h-6 w-1/3" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ) : result ? (
                <>
                  <div className="mt-4">
                    <p className="text-sm font-semibold alpha-text">AI Summary</p>
                    <ul className="mt-2 list-inside list-disc text-sm alpha-text-muted">
                      {result.summary.map((s: string, i: number) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="rounded-[0.9rem] border p-3">
                      <p className="text-[10px] uppercase alpha-text-muted">Ecosystem</p>
                      <p className="mt-2 text-sm alpha-text">{result.metadata?.ecosystem ?? 'Not detected'}</p>
                    </div>
                    <div className="rounded-[0.9rem] border p-3">
                      <p className="text-[10px] uppercase alpha-text-muted">Funding</p>
                      <p className="mt-2 text-sm alpha-text">{result.funding?.total ?? 'No fetched data'}</p>
                    </div>
                    <div className="rounded-[0.9rem] border p-3">
                      <p className="text-[10px] uppercase alpha-text-muted">Community</p>
                      <p className="mt-2 text-sm alpha-text">{result.social?.handle ? `@${result.social.handle}` : 'No fetched data'}</p>
                    </div>
                    <div className="rounded-[0.9rem] border p-3">
                      <p className="text-[10px] uppercase alpha-text-muted">Development</p>
                      <p className="mt-2 text-sm alpha-text">{result.github ? `${result.github.repositoryCount ? `${result.github.repositoryCount} repos, ` : ''}${result.github.stars} stars` : 'No fetched data'}</p>
                    </div>
                  </div>

                  {result.github?.topRepositories?.length ? (
                    <div className="mt-4">
                      <p className="text-sm font-semibold alpha-text">Top GitHub Repos</p>
                      <div className="mt-2 grid gap-2">
                        {result.github.topRepositories.map((repo) => (
                          <a key={repo.htmlUrl} href={repo.htmlUrl} target="_blank" rel="noreferrer" className="rounded-[0.9rem] border px-3 py-2 text-sm alpha-text-muted hover:alpha-text">
                            {repo.name} · {repo.stars} stars
                          </a>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </>
              ) : (
                <div className="mt-4 alpha-text-muted">No analysis yet.</div>
              )}
            </div>

            {result ? (
              <div className="macos-card rounded-[1.2rem] p-4">
                <p className="text-[11px] uppercase alpha-text-muted">Funding Badges</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {result.funding && result.funding.investors.length ? (
                    result.funding.investors.map((inv, idx) => (
                      <span key={idx} className="rounded-full border px-3 py-1 text-[12px] alpha-text-muted">{inv}</span>
                    ))
                  ) : (
                    <div className="alpha-text-muted">No fetched funding data from configured providers.</div>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
