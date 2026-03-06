import { useMemo } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Coins, Sparkles, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AirdropReward } from "@/types";

interface RewardPerformancePanelProps {
  rewards: AirdropReward[];
  isDark: boolean;
  className?: string;
  title?: string;
  subtitle?: string;
  compact?: boolean;
  embedded?: boolean;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: value >= 1000 ? 0 : 2,
  }).format(value);

const formatCompactCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: value >= 1000 ? "compact" : "standard",
    minimumFractionDigits: value < 1000 ? 2 : 0,
    maximumFractionDigits: value >= 1000 ? 1 : 2,
  }).format(value);

const formatLabelDate = (value?: string | null) => {
  if (!value) return "Draft";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const getRewardTimelineDate = (reward: AirdropReward) => reward.claimedAt || reward.tgeDate || reward.createdAt;

export function RewardPerformancePanel({
  rewards,
  isDark,
  className,
  title = "Reward Vault",
  subtitle = "Realized airdrop income and claim timeline",
  compact = false,
  embedded = false,
}: RewardPerformancePanelProps) {
  const claimedRewards = useMemo(
    () =>
      rewards
        .filter((reward) => reward.claimStatus === "Claimed" && reward.amountUsd > 0)
        .sort(
          (left, right) =>
            new Date(getRewardTimelineDate(left)).getTime() - new Date(getRewardTimelineDate(right)).getTime()
        ),
    [rewards]
  );

  const totalEarned = useMemo(
    () => claimedRewards.reduce((sum, reward) => sum + reward.amountUsd, 0),
    [claimedRewards]
  );

  const averageClaim = claimedRewards.length > 0 ? totalEarned / claimedRewards.length : 0;
  const bestReward = claimedRewards.reduce((best, reward) => (reward.amountUsd > best.amountUsd ? reward : best), claimedRewards[0]);
  const latestReward = claimedRewards[claimedRewards.length - 1];

  const chartData = useMemo(
    () =>
      claimedRewards.slice(-8).map((reward) => ({
        label: formatLabelDate(getRewardTimelineDate(reward)),
        fullDate: getRewardTimelineDate(reward),
        amount: reward.amountUsd,
        token: reward.tokenSymbol || "Reward",
      })),
    [claimedRewards]
  );

  const emptyState = claimedRewards.length === 0;

  return (
    <section
      className={cn(
        "relative overflow-hidden",
        embedded ? "p-0" : "macos-card",
        embedded ? "" : compact ? "p-5 sm:p-6" : "p-6 sm:p-7",
        embedded ? "" : "before:pointer-events-none before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_top_left,rgba(184,207,206,0.18),transparent_38%)]",
        className
      )}
    >
      <div className="relative">
        <div className={cn("flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between", compact && "gap-4")}>
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-alpha-border bg-black/5 px-3 py-1 text-[10px] uppercase tracking-[0.28em] alpha-text-muted dark:bg-white/[0.04]">
              <Sparkles className="h-3.5 w-3.5 text-gold" />
              Premium payout stream
            </div>
            <h2 className={cn("mt-4 font-semibold tracking-tight alpha-text", compact ? "text-[1.7rem]" : "text-2xl")}>{title}</h2>
            <p className={cn("mt-2 max-w-2xl alpha-text-muted", compact ? "text-[13px] leading-6" : "text-sm")}>{subtitle}</p>
          </div>

          {!emptyState && (
            <div className={cn("rounded-2xl border border-alpha-border bg-black/5 text-right dark:bg-white/[0.04]", compact ? "px-4 py-3 lg:min-w-[164px]" : "px-4 py-3")}>
              <p className="text-[11px] uppercase tracking-[0.24em] alpha-text-muted">Latest realized</p>
              <p className={cn("mt-2 font-semibold alpha-text", compact ? "text-base" : "text-lg")}>{formatCurrency(latestReward.amountUsd)}</p>
              <p className="mt-1 text-xs alpha-text-muted">
                {formatLabelDate(getRewardTimelineDate(latestReward))}
                {latestReward.tokenSymbol ? ` • ${latestReward.tokenSymbol}` : ""}
              </p>
            </div>
          )}
        </div>

        <div className={cn("grid gap-3 sm:grid-cols-3", compact ? "mt-5" : "mt-6")}>
          <div className={cn("rounded-2xl border border-alpha-border bg-black/5 dark:bg-white/[0.04]", compact ? "p-3.5" : "p-4")}>
            <div className="flex items-center justify-between">
              <p className="text-[11px] uppercase tracking-[0.24em] alpha-text-muted">Total realized</p>
              <Coins className="h-4 w-4 text-gold" />
            </div>
            <p className={cn("mt-3 font-semibold alpha-text", compact ? "text-[1.9rem]" : "text-3xl")}>{formatCompactCurrency(totalEarned)}</p>
          </div>

          <div className={cn("rounded-2xl border border-alpha-border bg-black/5 dark:bg-white/[0.04]", compact ? "p-3.5" : "p-4")}>
            <div className="flex items-center justify-between">
              <p className="text-[11px] uppercase tracking-[0.24em] alpha-text-muted">Claimed projects</p>
              <span className="text-xs font-semibold text-gold">{String(claimedRewards.length).padStart(2, "0")}</span>
            </div>
            <p className={cn("mt-3 font-semibold alpha-text", compact ? "text-[1.9rem]" : "text-3xl")}>{claimedRewards.length}</p>
          </div>

          <div className={cn("rounded-2xl border border-alpha-border bg-black/5 dark:bg-white/[0.04]", compact ? "p-3.5" : "p-4")}>
            <div className="flex items-center justify-between">
              <p className="text-[11px] uppercase tracking-[0.24em] alpha-text-muted">Best payout</p>
              <Trophy className="h-4 w-4 text-gold" />
            </div>
            <p className={cn("mt-3 font-semibold alpha-text", compact ? "text-[1.9rem]" : "text-3xl")}>
              {bestReward ? formatCompactCurrency(bestReward.amountUsd) : "$0"}
            </p>
            <p className="mt-1 text-xs alpha-text-muted">
              Avg claim {formatCompactCurrency(averageClaim || 0)}
            </p>
          </div>
        </div>

        <div className={cn("rounded-[1.4rem] border border-alpha-border bg-black/5 dark:bg-white/[0.04]", compact ? "mt-5 p-3.5" : "mt-6 p-4")}>
          {emptyState ? (
            <div className={cn("flex flex-col items-center justify-center text-center", compact ? "h-[170px]" : "h-[220px]")}>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-dashed border-alpha-border bg-black/5 text-gold dark:bg-white/[0.04]">
                <Coins className="h-6 w-6" />
              </div>
              <p className="mt-4 text-lg font-medium alpha-text">No realized rewards yet</p>
              <p className="mt-2 max-w-md text-sm alpha-text-muted">
                Record your first claimed airdrop to unlock payout history, premium tracking, and dashboard insights.
              </p>
            </div>
          ) : (
            <div className={cn(compact ? "h-[170px]" : "h-[220px]")}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 8, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="rewardAreaFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#A5B68D" stopOpacity={0.45} />
                      <stop offset="100%" stopColor="#A5B68D" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" stroke={isDark ? "rgba(184, 207, 206, 0.14)" : "rgba(78, 85, 71, 0.12)"} />
                  <XAxis
                    dataKey="label"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "var(--alpha-text-muted)", fontSize: 11 }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "var(--alpha-text-muted)", fontSize: 11 }}
                    tickFormatter={(value: number) => formatCompactCurrency(value)}
                    width={64}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 16,
                      border: "1px solid var(--alpha-border)",
                      background: "var(--alpha-surface)",
                      color: "var(--alpha-text)",
                      boxShadow: "var(--alpha-shadow)",
                    }}
                    formatter={(value: number) => [formatCurrency(value), "Reward"]}
                    labelFormatter={(_, payload) => {
                      const item = payload?.[0]?.payload;
                      return item ? `${formatLabelDate(item.fullDate)} • ${item.token}` : "";
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="amount"
                    stroke="#A5B68D"
                    strokeWidth={3}
                    fill="url(#rewardAreaFill)"
                    dot={{ r: 4, fill: "#A5B68D", strokeWidth: 0 }}
                    activeDot={{ r: 6, fill: "#EAEFEF", stroke: "#A5B68D", strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
