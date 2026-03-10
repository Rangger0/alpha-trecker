import { useMemo } from "react";
import { Bar, CartesianGrid, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
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

  const chartData = useMemo(() => {
    return claimedRewards.slice(-8).reduce<Array<{
      label: string;
      fullDate: string;
      amount: number;
      trend: number;
      cumulative: number;
      token: string;
    }>>((timeline, reward, index, source) => {
      const previousTotal = timeline[timeline.length - 1]?.cumulative ?? 0;
      const cumulative = previousTotal + reward.amountUsd;
      const trendWindow = source.slice(Math.max(0, index - 2), index + 1);
      const trend = trendWindow.reduce((sum, item) => sum + item.amountUsd, 0) / trendWindow.length;

      timeline.push({
        label: formatLabelDate(getRewardTimelineDate(reward)),
        fullDate: getRewardTimelineDate(reward),
        amount: Number(reward.amountUsd.toFixed(2)),
        trend: Number(trend.toFixed(2)),
        cumulative: Number(cumulative.toFixed(2)),
        token: reward.tokenSymbol || "Reward",
      });

      return timeline;
    }, []);
  }, [claimedRewards]);

  const emptyState = claimedRewards.length === 0;
  const dashboardCompact = compact && embedded;
  const compactSummaryCards = [
    {
      label: "Total realized",
      value: formatCompactCurrency(totalEarned),
      meta: `${claimedRewards.length} payout recorded`,
      icon: Coins,
    },
    {
      label: "Claimed projects",
      value: String(claimedRewards.length).padStart(2, "0"),
      meta: averageClaim > 0 ? `Avg ${formatCompactCurrency(averageClaim)}` : "No claim yet",
      icon: Sparkles,
    },
    {
      label: "Best payout",
      value: bestReward ? formatCompactCurrency(bestReward.amountUsd) : "$0",
      meta: bestReward?.tokenSymbol ? bestReward.tokenSymbol : "Waiting reward",
      icon: Trophy,
    },
    {
      label: "Latest realized",
      value: latestReward ? formatCurrency(latestReward.amountUsd) : "$0",
      meta: latestReward
        ? `${formatLabelDate(getRewardTimelineDate(latestReward))}${latestReward.tokenSymbol ? ` • ${latestReward.tokenSymbol}` : ""}`
        : "No payout yet",
      icon: Sparkles,
    },
  ];
  const chartTotal = chartData.reduce((sum, item) => sum + item.amount, 0);
  const chartAverage = chartData.length > 0 ? chartTotal / chartData.length : 0;
  const chartPeak = chartData.reduce((best, item) => (item.amount > best.amount ? item : best), chartData[0]);
  const previousWindowAverage =
    chartData.length > 1 ? chartData.slice(0, -1).reduce((sum, item) => sum + item.amount, 0) / (chartData.length - 1) : 0;
  const latestChartPoint = chartData[chartData.length - 1];
  const chartChange =
    previousWindowAverage > 0 && latestChartPoint
      ? ((latestChartPoint.amount - previousWindowAverage) / previousWindowAverage) * 100
      : 0;
  const chartChangeLabel = `${chartChange >= 0 ? "+" : ""}${chartChange.toFixed(1)}%`;
  const palette = isDark
    ? {
        grid: "rgba(247, 247, 247, 0.12)",
        axis: "#929AAB",
        bar: "#FF5733",
        barSoft: "rgba(255, 87, 51, 0.12)",
        line: "#F7F7F7",
        badgeBg: "rgba(255, 87, 51, 0.08)",
        badgeText: "#FF6F4F",
        tooltipBg: "#111111",
      }
    : {
        grid: "rgba(57, 62, 70, 0.08)",
        axis: "#929AAB",
        bar: "#FF5733",
        barSoft: "rgba(255, 87, 51, 0.12)",
        line: "#393E46",
        badgeBg: "rgba(255, 87, 51, 0.08)",
        badgeText: "#FF5733",
        tooltipBg: "#EEEEEE",
      };
  const chartStats = [
    { label: "Window payout", value: formatCompactCurrency(chartTotal) },
    { label: "Average claim", value: formatCompactCurrency(chartAverage || 0) },
    { label: "Peak reward", value: chartPeak ? formatCompactCurrency(chartPeak.amount) : "$0" },
    { label: "Latest reward", value: latestChartPoint ? formatCompactCurrency(latestChartPoint.amount) : "$0" },
  ];

  return (
    <section
      className={cn(
        "relative overflow-hidden",
        embedded ? "p-0" : "macos-card",
        embedded ? "" : compact ? "p-4 sm:p-5" : "p-6 sm:p-7",
        embedded ? "" : "before:pointer-events-none before:absolute before:inset-0",
        !embedded && "shadow-none",
        className
      )}
      style={embedded ? undefined : { backgroundImage: 'radial-gradient(circle at top left, color-mix(in srgb, var(--alpha-highlight) 10%, transparent), transparent 38%)' }}
    >
      <div className="relative">
        <div className={cn("flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between", compact && "gap-3")}>
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-alpha-border bg-[color:var(--alpha-hover-soft)] px-3 py-1 text-[10px] uppercase tracking-[0.2em] alpha-text-muted">
              <Sparkles className="h-3.5 w-3.5 text-gold" />
              Premium payout stream
            </div>
            <h2 className={cn("font-semibold tracking-tight alpha-text", dashboardCompact ? "mt-3 text-[1.1rem]" : compact ? "mt-3 text-[1.5rem]" : "mt-4 text-2xl")}>{title}</h2>
            <p className={cn("max-w-2xl alpha-text-muted", dashboardCompact ? "mt-1.5 text-[12px] leading-5" : compact ? "mt-2 text-[12px] leading-5" : "mt-2 text-sm")}>{subtitle}</p>
          </div>

          {!emptyState && !dashboardCompact && (
            <div className={cn("rounded-[1rem] border border-alpha-border bg-[color:var(--alpha-hover-soft)] text-right", compact ? "px-4 py-3 lg:min-w-[152px]" : "px-4 py-3")}>
              <p className="text-[11px] uppercase tracking-[0.18em] alpha-text-muted">Latest realized</p>
              <p className={cn("mt-2 font-semibold alpha-text", compact ? "text-[15px]" : "text-lg")}>{formatCurrency(latestReward.amountUsd)}</p>
              <p className="mt-1 text-xs alpha-text-muted">
                {formatLabelDate(getRewardTimelineDate(latestReward))}
                {latestReward.tokenSymbol ? ` • ${latestReward.tokenSymbol}` : ""}
              </p>
            </div>
          )}
        </div>

        {dashboardCompact ? (
          <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
            {compactSummaryCards.map((card) => {
              const Icon = card.icon;
              return (
                <div key={card.label} className="flex min-h-[94px] flex-col justify-between rounded-[1rem] border border-alpha-border bg-[color:var(--alpha-surface)] p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-[9px] uppercase tracking-[0.16em] alpha-text-muted">{card.label}</p>
                    <Icon className="h-3.5 w-3.5 text-gold" />
                  </div>
                  <p className="mt-3 text-[1.3rem] font-semibold leading-none alpha-text">{card.value}</p>
                  <p className="mt-1.5 text-[11px] alpha-text-muted">{card.meta}</p>
                </div>
              );
            })}
          </div>
        ) : (
          <div className={cn("grid gap-3 sm:grid-cols-3", compact ? "mt-4" : "mt-6")}>
            <div className={cn("flex min-h-[112px] flex-col justify-between rounded-[1rem] border border-alpha-border bg-[color:var(--alpha-hover-soft)]", compact ? "p-3" : "p-4")}>
              <div className="flex items-center justify-between">
                <p className="text-[11px] uppercase tracking-[0.24em] alpha-text-muted">Total realized</p>
                <Coins className="h-4 w-4 text-gold" />
              </div>
              <p className={cn("mt-3 font-semibold alpha-text", compact ? "text-[1.6rem]" : "text-3xl")}>{formatCompactCurrency(totalEarned)}</p>
            </div>

            <div className={cn("flex min-h-[112px] flex-col justify-between rounded-[1rem] border border-alpha-border bg-[color:var(--alpha-hover-soft)]", compact ? "p-3" : "p-4")}>
              <div className="flex items-center justify-between">
                <p className="text-[11px] uppercase tracking-[0.24em] alpha-text-muted">Claimed projects</p>
                <span className="text-xs font-semibold text-gold">{String(claimedRewards.length).padStart(2, "0")}</span>
              </div>
              <p className={cn("mt-3 font-semibold alpha-text", compact ? "text-[1.6rem]" : "text-3xl")}>{claimedRewards.length}</p>
            </div>

            <div className={cn("flex min-h-[112px] flex-col justify-between rounded-[1rem] border border-alpha-border bg-[color:var(--alpha-hover-soft)]", compact ? "p-3" : "p-4")}>
              <div className="flex items-center justify-between">
                <p className="text-[11px] uppercase tracking-[0.24em] alpha-text-muted">Best payout</p>
                <Trophy className="h-4 w-4 text-gold" />
              </div>
              <p className={cn("mt-3 font-semibold alpha-text", compact ? "text-[1.6rem]" : "text-3xl")}>
                {bestReward ? formatCompactCurrency(bestReward.amountUsd) : "$0"}
              </p>
              <p className="mt-1 text-xs alpha-text-muted">
                Avg claim {formatCompactCurrency(averageClaim || 0)}
              </p>
            </div>
          </div>
        )}

        {!dashboardCompact ? (
        <div className={cn("rounded-[1.15rem] border border-alpha-border bg-[color:var(--alpha-hover-soft)]", compact ? "mt-4 p-3.5" : "mt-6 p-4")}>
          {emptyState ? (
            <div className={cn("flex flex-col items-center justify-center text-center", compact ? "h-[154px]" : "h-[220px]")}>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-dashed border-alpha-border bg-[color:var(--alpha-hover-soft)] text-gold">
                <Coins className="h-6 w-6" />
              </div>
              <p className="mt-4 text-lg font-medium alpha-text">No realized rewards yet</p>
              <p className="mt-2 max-w-md text-sm alpha-text-muted">
                Simpan reward claim pertama untuk mulai melihat timeline realized income di panel ini.
              </p>
            </div>
          ) : (
            <div>
              <div className="mb-4 grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(320px,520px)] xl:items-end">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-alpha-border bg-[color:var(--alpha-surface)] px-3 py-1 text-[10px] uppercase tracking-[0.18em] alpha-text-muted">
                    Cashflow analysis
                  </div>
                  <p className="mt-2 text-xs alpha-text-muted">
                    {chartData.length} realized payout{chartData.length === 1 ? "" : "s"} in active timeline
                  </p>
                  <div className="mt-4 flex flex-wrap items-end gap-3">
                    <p className="text-[2.2rem] font-semibold leading-none alpha-text">{formatCompactCurrency(chartTotal)}</p>
                    <span
                      className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold"
                      style={{ background: palette.badgeBg, color: palette.badgeText }}
                    >
                      {chartChangeLabel}
                    </span>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  {chartStats.map((stat) => (
                    <div key={stat.label} className="flex min-h-[84px] flex-col justify-between rounded-[1rem] border border-alpha-border bg-[color:var(--alpha-surface)] px-3.5 py-3">
                      <p className="text-[10px] uppercase tracking-[0.16em] alpha-text-muted">{stat.label}</p>
                      <p className="mt-2.5 text-lg font-semibold alpha-text">{stat.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className={cn(compact ? "h-[220px]" : "h-[300px]")}>
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={chartData} margin={{ top: 8, right: 10, left: 4, bottom: 8 }}>
                    <CartesianGrid vertical={false} strokeDasharray="4 4" stroke={palette.grid} />
                    <XAxis
                      dataKey="label"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: palette.axis, fontSize: 11 }}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: palette.axis, fontSize: 11 }}
                      tickFormatter={(value: number) => formatCompactCurrency(value)}
                      width={58}
                    />
                    <Tooltip
                      cursor={{ fill: palette.barSoft }}
                      contentStyle={{
                        borderRadius: 16,
                        border: "1px solid var(--alpha-border)",
                        background: palette.tooltipBg,
                        color: "var(--alpha-text)",
                        boxShadow: "var(--alpha-shadow)",
                      }}
                      formatter={(value: number, name: string) => [
                        formatCurrency(value),
                        name === "Trend line" ? "Trend line" : "Realized payout",
                      ]}
                      labelFormatter={(_, payload) => {
                        const item = payload?.[0]?.payload;
                        return item ? `${formatLabelDate(item.fullDate)} • ${item.token}` : "";
                      }}
                    />
                    <Bar
                      dataKey="amount"
                      name="Realized payout"
                      fill={palette.bar}
                      radius={[10, 10, 4, 4]}
                      barSize={24}
                    />
                    <Line
                      type="monotone"
                      dataKey="trend"
                      name="Trend line"
                      stroke={palette.line}
                      strokeWidth={2.75}
                      dot={{ r: 3.5, fill: palette.line, strokeWidth: 0 }}
                      activeDot={{ r: 5, fill: palette.tooltipBg, stroke: palette.line, strokeWidth: 2 }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-4 text-[11px] alpha-text-muted">
                <span className="inline-flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: palette.bar }} />
                  Realized payout
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="h-[2px] w-5 rounded-full" style={{ background: palette.line }} />
                  Trend line
                </span>
                <span className="ml-auto">
                  {latestChartPoint ? `Latest: ${formatLabelDate(latestChartPoint.fullDate)}` : ""}
                </span>
              </div>
            </div>
          )}
        </div>
        ) : null}
      </div>
    </section>
  );
}
