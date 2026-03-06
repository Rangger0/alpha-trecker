import { motion } from "framer-motion";
import { ArrowUpRight, Newspaper, RefreshCw, Sparkles } from "lucide-react";
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
  Waitlist: "border-[#8B5CF6]/25 bg-[#8B5CF6]/10 text-[#8B5CF6]",
  Potential: "border-[#3B82F6]/25 bg-[#3B82F6]/10 text-[#3B82F6]",
  "Claim Live": "border-[#10B981]/25 bg-[#10B981]/10 text-[#10B981]",
  Farming: "border-gold/25 bg-gold/10 text-gold",
  Guide: "border-alpha-border bg-black/5 alpha-text-muted dark:bg-white/[0.05]",
  Airdrop: "border-[#F97316]/25 bg-[#F97316]/10 text-[#F97316]",
};

export function AirdropNewsPanel({ isDark }: AirdropNewsPanelProps) {
  const { items, loading, error } = useAirdropNews();

  return (
    <section className="macos-card relative overflow-hidden p-4">
      <span className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(184,207,206,0.16),transparent_50%)] opacity-80" />
      <div className="relative">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-alpha-border bg-black/5 px-3 py-1 text-[10px] uppercase tracking-[0.24em] alpha-text-muted dark:bg-white/[0.04]">
              <Newspaper className="h-3.5 w-3.5 text-gold" />
              Airdrop wire
            </div>
            <h3 className="mt-3 text-lg font-semibold alpha-text">Live airdrop news</h3>
            <p className="mt-1 text-xs alpha-text-muted">
              Waitlist, farming, and fresh campaign updates in one stream.
            </p>
          </div>

          <div className="rounded-full border border-alpha-border bg-black/5 px-2.5 py-1 text-[10px] uppercase tracking-[0.24em] alpha-text-muted dark:bg-white/[0.04]">
            <span className="inline-flex items-center gap-2">
              <span className="h-2 w-2 animate-pulse rounded-full bg-gold" />
              Live
            </span>
          </div>
        </div>

        {loading ? (
          <div className="mt-4 space-y-2.5">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="rounded-2xl border border-alpha-border bg-black/5 px-3.5 py-3 dark:bg-white/[0.04]"
              >
                <div className="h-3 w-20 rounded-full bg-black/10 dark:bg-white/[0.08]" />
                <div className="mt-3 h-4 w-4/5 rounded-full bg-black/10 dark:bg-white/[0.08]" />
                <div className="mt-2 h-3 w-3/5 rounded-full bg-black/10 dark:bg-white/[0.08]" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="mt-4 rounded-2xl border border-[#EF4444]/25 bg-[#EF4444]/10 px-4 py-4 text-sm text-[#FCA5A5]">
            Gagal memuat news feed live sekarang. Coba refresh lagi nanti.
          </div>
        ) : (
          <div className="mt-4 space-y-2.5">
            {items.slice(0, 4).map((item, index) => (
              <motion.a
                key={item.id}
                href={item.link}
                target="_blank"
                rel="noreferrer"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.28, delay: index * 0.06 }}
                className={`group block rounded-2xl border px-3.5 py-3 transition-all duration-200 hover:-translate-y-0.5 ${
                  isDark
                    ? "border-alpha-border bg-dark-bg/70 hover:border-gold/30 hover:bg-dark-bg/90"
                    : "border-alpha-border bg-white/70 hover:border-gold/35 hover:bg-white/90"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <span className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-medium ${tagStyles[item.tag] || tagStyles.Airdrop}`}>
                    {item.tag}
                  </span>
                  <ArrowUpRight className="h-4 w-4 shrink-0 alpha-text-muted transition-colors group-hover:text-gold" />
                </div>

                <h4 className="mt-3 line-clamp-2 text-sm font-semibold leading-5 alpha-text">
                  {item.title}
                </h4>
                <p className="mt-2 line-clamp-2 text-[12px] leading-5 alpha-text-muted">
                  {item.summary}
                </p>

                <div className="mt-3 flex items-center justify-between gap-3 text-[11px] alpha-text-muted">
                  <span>{formatPublishedAt(item.publishedAt)}</span>
                  <span className="inline-flex items-center gap-1">
                    <Sparkles className="h-3.5 w-3.5 text-gold" />
                    AirdropAlert
                  </span>
                </div>
              </motion.a>
            ))}
          </div>
        )}

        <div className="mt-3 flex items-center justify-between text-[11px] alpha-text-muted">
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
