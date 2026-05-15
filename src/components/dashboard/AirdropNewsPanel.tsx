import type { CSSProperties } from "react";
import { ArrowUpRight, Newspaper, RefreshCw } from "lucide-react";
import { useAirdropNews } from "@/hooks/use-airdrop-news";

interface AirdropNewsPanelProps {
  isDark: boolean;
}

const formatPublishedAt = (value: string) => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;

  return parsed.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const tagStyles: Record<string, string> = {
  Waitlist: "border-[color:var(--alpha-border)] bg-[color:var(--alpha-hover-soft)] alpha-text-muted",
  Potential: "border-[color:var(--alpha-border)] bg-[color:var(--alpha-hover-soft)] alpha-text-muted",
  "Claim Live": "border-[color:var(--alpha-border-strong)] bg-[color:var(--alpha-hover-soft)] alpha-text",
  Farming: "border-[color:var(--alpha-border)] bg-[color:var(--alpha-hover-soft)] alpha-text-muted",
  Guide: "border-[color:var(--alpha-border)] bg-[color:var(--alpha-hover-soft)] alpha-text-muted",
  Airdrop: "border-[color:var(--alpha-border)] bg-[color:var(--alpha-hover-soft)] alpha-text-muted",
};

export function AirdropNewsPanel({ isDark }: AirdropNewsPanelProps) {
  const { items, loading, error } = useAirdropNews();
  const visibleItems = items.slice(0, 3);
  const surfaceClassName = isDark
    ? "border-[color:var(--alpha-border)] bg-[color:var(--alpha-surface)] hover:border-[color:var(--alpha-border-strong)] hover:bg-[color:var(--alpha-surface-soft)]"
    : "border-[color:var(--alpha-border)] bg-[color:var(--alpha-surface)] hover:border-[color:var(--alpha-border-strong)] hover:bg-[color:var(--alpha-surface-soft)]";

  return (
    <section className="macos-card relative overflow-hidden p-4 shadow-none">
      <span
        className="absolute inset-0 opacity-55"
        style={{ background: 'transparent' }}
      />
      <div className="relative">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--alpha-border)] bg-[color:var(--alpha-surface)] px-3 py-1 text-[10px] uppercase tracking-[0.18em] alpha-text-muted">
              <Newspaper className="h-3.5 w-3.5 alpha-text-muted" />
              Airdrop wire
            </div>
            <h3 className="mt-3 text-[16px] font-semibold alpha-text">Live airdrop news</h3>
            <p className="mt-1 text-[12px] leading-5 alpha-text-muted">Headline ringkas buat quick scan.</p>
          </div>

          <div className="rounded-full border border-[color:var(--alpha-border)] bg-[color:var(--alpha-surface)] px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] alpha-text-muted">
            <span className="inline-flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[color:var(--alpha-text-muted)]" />
              {items.length > 0 ? `${visibleItems.length} stories` : "Live"}
            </span>
          </div>
        </div>

        {loading ? (
          <div className="mt-4 space-y-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="rounded-[0.95rem] border border-[color:var(--alpha-border)] bg-[color:var(--alpha-surface)] px-3 py-3"
              >
                <div className="h-3 w-20 rounded-full bg-[color:var(--alpha-border)]" />
                <div className="mt-3 h-4 w-4/5 rounded-full bg-[color:var(--alpha-border)]" />
                <div className="mt-2 h-3 w-3/5 rounded-full bg-[color:var(--alpha-border)]" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="mt-4 rounded-[1rem] border border-[color:var(--alpha-danger-border)] bg-[color:var(--alpha-danger-soft)] px-4 py-4 text-sm text-[color:var(--alpha-danger)]">
            Gagal memuat news feed live sekarang. Coba refresh lagi nanti.
          </div>
        ) : (
          <div className="mt-4 space-y-2.5">
            {visibleItems.length > 0 ? (
              visibleItems.map((item, index) => (
                <a
                  key={item.id}
                  href={item.link}
                  target="_blank"
                  rel="noreferrer"
                  className={`macos-card-entry group flex items-start gap-3 rounded-[0.95rem] border px-3 py-3 transition-[transform,border-color,background-color] duration-150 hover:-translate-y-0.5 ${surfaceClassName}`}
                  style={{ '--mac-delay': `${index * 22}ms` } as CSSProperties}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`inline-flex rounded-full border px-2 py-0.5 text-[9px] font-medium uppercase tracking-[0.08em] ${tagStyles[item.tag] || tagStyles.Airdrop}`}>
                        {item.tag}
                      </span>
                      <span className="text-[10px] alpha-text-muted">{formatPublishedAt(item.publishedAt)}</span>
                    </div>
                    <h4 className="mt-2 line-clamp-2 text-[13px] font-semibold leading-5 alpha-text group-hover:text-[color:var(--alpha-text)]">
                      {item.title}
                    </h4>
                    <p className="mt-1.5 line-clamp-2 text-[11px] leading-5 alpha-text-muted">
                      {item.summary}
                    </p>
                  </div>
                  <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 alpha-text-muted transition-colors group-hover:text-[color:var(--alpha-text)]" />
                </a>
              ))
            ) : (
              <div className="rounded-[0.95rem] border border-dashed border-[color:var(--alpha-border)] bg-[color:var(--alpha-surface)] px-4 py-6 text-sm alpha-text-muted">
                Belum ada headline yang bisa ditampilkan sekarang.
              </div>
            )}
          </div>
        )}

        <div className="mt-3 flex items-center justify-between text-[10px] alpha-text-muted">
          <span className="inline-flex items-center gap-2">
            <RefreshCw className="h-3.5 w-3.5" />
            Auto refresh every 15 min
          </span>
          <span>Source: AirdropAlert RSS</span>
        </div>
      </div>
    </section>
  );
}
