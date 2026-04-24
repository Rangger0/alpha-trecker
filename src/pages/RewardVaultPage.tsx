import { Suspense, lazy, useMemo, useState, type CSSProperties } from "react";
import {
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  Coins,
  Gem,
  Hourglass,
  Search,
  Sparkles,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { AirdropRewardModal } from "@/components/modals/AirdropRewardModal";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useI18n } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useAirdrops } from "@/hooks/use-airdrops";
import { useAirdropRewards } from "@/hooks/use-airdrop-rewards";
import { supabase } from "@/lib/supabase";
import { REWARD_FINANCE_SCHEMA_WARNING } from "@/services/airdrop-rewards";
import type { Airdrop, AirdropRewardInput, RewardClaimStatus } from "@/types";
import { toast } from "sonner";

const RewardPerformancePanel = lazy(async () => {
  const module = await import("@/components/rewards/RewardPerformancePanel");
  return { default: module.RewardPerformancePanel };
});

const formatPercent = (value: number) => {
  if (!Number.isFinite(value)) return "--";
  return `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`;
};

const getRewardCost = (reward?: RewardRow["reward"]) =>
  reward ? reward.capitalUsd + reward.feeUsd : 0;

const getRewardProfit = (reward?: RewardRow["reward"]) =>
  reward ? reward.amountUsd - getRewardCost(reward) : 0;

const getRewardRoi = (reward?: RewardRow["reward"]) => {
  const cost = getRewardCost(reward);
  if (!reward || cost <= 0) return 0;
  return (getRewardProfit(reward) / cost) * 100;
};

const getRewardTokenDisplay = (
  reward: RewardRow["reward"] | undefined,
  formatNumber: (value: number, options?: Intl.NumberFormatOptions) => string
) => {
  if (!reward) return null;

  const amount =
    reward.tokenAmount == null || !Number.isFinite(reward.tokenAmount)
      ? null
      : formatNumber(reward.tokenAmount, {
          minimumFractionDigits: reward.tokenAmount > 0 && reward.tokenAmount < 1 ? 2 : 0,
          maximumFractionDigits: reward.tokenAmount >= 1000 ? 2 : 4,
        });
  const symbol = reward.tokenSymbol?.trim() || null;

  if (!amount && !symbol) return null;
  if (amount && symbol) return `${amount} ${symbol}`;

  return amount || symbol;
};
type RewardRow = {
  airdrop: Airdrop;
  reward: ReturnType<typeof useAirdropRewards>["rewards"][number] | undefined;
};

type MacCardStyle = CSSProperties & {
  "--mac-delay": string;
};

function RewardPerformancePanelFallback() {
  return (
    <div className="mb-6 overflow-hidden rounded-[1.15rem] border border-alpha-border bg-[color:var(--alpha-surface)] p-4">
      <div className="mb-3 h-4 w-40 rounded-full bg-[color:var(--alpha-hover-soft)]" />
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="h-24 rounded-[1rem] bg-[color:var(--alpha-hover-soft)]" />
        <div className="h-24 rounded-[1rem] bg-[color:var(--alpha-hover-soft)]" />
        <div className="h-24 rounded-[1rem] bg-[color:var(--alpha-hover-soft)]" />
      </div>
      <div className="mt-4 h-48 rounded-[1rem] bg-[color:var(--alpha-hover-soft)]" />
    </div>
  );
}

export function RewardVaultPage() {
  const { theme } = useTheme();
  const { t, formatCompactCurrency, formatCurrency, formatDate, formatNumber, translateOption } = useI18n();
  const isDark = theme === "dark";
  const { airdrops, loading: loadingAirdrops, refetch: refetchAirdrops } = useAirdrops();
  const {
    rewards,
    rewardMap,
    loading: loadingRewards,
    error: rewardError,
    schemaWarning,
    saveReward,
    removeReward,
  } = useAirdropRewards();

  const [searchQuery, setSearchQuery] = useState("");
  const [claimFilter, setClaimFilter] = useState<RewardClaimStatus | "all" | "untracked">("all");
  const [selectedAirdrop, setSelectedAirdrop] = useState<Airdrop | null>(null);

  const rows = useMemo<RewardRow[]>(
    () =>
      airdrops
        .map((airdrop) => ({
          airdrop,
          reward: rewardMap.get(airdrop.id),
        }))
        .sort((left, right) => {
          const leftDate = left.reward?.claimedAt || left.reward?.tgeDate || left.airdrop.deadline || left.airdrop.createdAt;
          const rightDate = right.reward?.claimedAt || right.reward?.tgeDate || right.airdrop.deadline || right.airdrop.createdAt;
          return new Date(rightDate).getTime() - new Date(leftDate).getTime();
        }),
    [airdrops, rewardMap]
  );

  const filteredRows = useMemo(
    () =>
      rows.filter(({ airdrop, reward }) => {
        const query = searchQuery.trim().toLowerCase();
        const matchesQuery =
          !query ||
          airdrop.projectName.toLowerCase().includes(query) ||
          (airdrop.twitterUsername || "").toLowerCase().includes(query) ||
          (reward?.tokenSymbol || "").toLowerCase().includes(query) ||
          String(reward?.tokenAmount ?? "").toLowerCase().includes(query);

        if (!matchesQuery) {
          return false;
        }

        if (claimFilter === "all") return true;
        if (claimFilter === "untracked") return !reward;
        return reward?.claimStatus === claimFilter;
      }),
    [rows, searchQuery, claimFilter]
  );

  const claimedRewards = useMemo(
    () => rewards.filter((reward) => reward.claimStatus === "Claimed" && reward.amountUsd > 0),
    [rewards]
  );
  const totalEarned = claimedRewards.reduce((sum, reward) => sum + reward.amountUsd, 0);
  const totalCapital = rewards.reduce((sum, reward) => sum + reward.capitalUsd + reward.feeUsd, 0);
  const claimedCapital = claimedRewards.reduce((sum, reward) => sum + reward.capitalUsd + reward.feeUsd, 0);
  const netProfit = claimedRewards.reduce((sum, reward) => sum + getRewardProfit(reward), 0);
  const bestReward = claimedRewards.reduce((best, reward) => (reward.amountUsd > best ? reward.amountUsd : best), 0);
  const bestProfit = claimedRewards.reduce((best, reward) => {
    const currentProfit = getRewardProfit(reward);
    return currentProfit > best ? currentProfit : best;
  }, 0);
  const pendingCount = rows.filter(({ reward }) => !reward || reward.claimStatus === "Pending TGE").length;
  const averageRoi = claimedCapital > 0 ? (netProfit / claimedCapital) * 100 : 0;
  const averageClaim = claimedRewards.length > 0 ? totalEarned / claimedRewards.length : 0;

  const selectedReward = selectedAirdrop ? rewardMap.get(selectedAirdrop.id) ?? null : null;

  const loading = loadingAirdrops || loadingRewards;
  const showSchemaBanner = Boolean(
    schemaWarning ||
    rewardError?.includes("public.airdrop_rewards") ||
    rewardError?.includes("capital_usd") ||
    rewardError?.includes("fee_usd")
  );

  const getRewardErrorMessage = (error: unknown) => {
    const message = error instanceof Error ? error.message : "";
    const code = typeof error === "object" && error !== null && "code" in error ? String((error as { code?: string }).code) : "";

    if (
      code === "PGRST204" ||
      code === "PGRST205" ||
      message.includes("public.airdrop_rewards") ||
      message.includes("capital_usd") ||
      message.includes("fee_usd")
    ) {
      return REWARD_FINANCE_SCHEMA_WARNING;
    }

    return message || t("rewardVault.saveError");
  };

  const syncAirdropStatusFromReward = async (airdrop: Airdrop, payload: AirdropRewardInput) => {
    if (payload.claimStatus !== "Claimed") {
      return;
    }

    const updatedTasks = (airdrop.tasks || []).map((task) => ({
      ...task,
      completed: true,
      updatedAt: new Date().toISOString(),
    }));

    const { error } = await supabase
      .from("airdrops")
      .update({
        status: "Done",
        tasks: updatedTasks,
        updated_at: new Date().toISOString(),
      })
      .eq("id", airdrop.id);

    if (error) {
      throw error;
    }
  };

  const handleSaveReward = async (payload: AirdropRewardInput) => {
    try {
      const activeAirdrop = airdrops.find((airdrop) => airdrop.id === payload.airdropId);

      const savedReward = await saveReward(payload);

      if (activeAirdrop) {
        await syncAirdropStatusFromReward(activeAirdrop, payload);
        await refetchAirdrops();
      }

      toast.success(
        savedReward.storageMode === "legacy_notes"
          ? t("rewardVault.savedCompat")
          : t("rewardVault.saved")
      );
      setSelectedAirdrop(null);
    } catch (error) {
      console.error(error);
      toast.error(getRewardErrorMessage(error));
      throw error;
    }
  };

  const handleDeleteReward = async (rewardId: string) => {
    try {
      await removeReward(rewardId);
      toast.success(t("rewardVault.deleted"));
      setSelectedAirdrop(null);
    } catch (error) {
      console.error(error);
      toast.error(getRewardErrorMessage(error));
      throw error;
    }
  };

  const summaryCards = [
    { label: t("rewardVault.realizedRevenue"), value: formatCompactCurrency(totalEarned), icon: Coins, tone: "text-gold", accent: "var(--alpha-warning)" },
    { label: t("rewardVault.capitalDeployed"), value: formatCompactCurrency(totalCapital), icon: Gem, tone: "text-[var(--alpha-signal)]", accent: "var(--alpha-signal)" },
    { label: t("rewardVault.netProfit"), value: formatCompactCurrency(netProfit), icon: CheckCircle2, tone: netProfit >= 0 ? "text-gold" : "text-[var(--alpha-danger)]", accent: netProfit >= 0 ? "var(--alpha-warning)" : "var(--alpha-danger)" },
    { label: t("rewardVault.pendingTge"), value: String(pendingCount).padStart(2, "0"), icon: Hourglass, tone: "text-[var(--alpha-signal)]", accent: "var(--alpha-signal)" },
  ];

  const financePills = [
    { label: t("rewardVault.claimedProjects"), value: String(claimedRewards.length).padStart(2, "0") },
    { label: t("rewardVault.avgRoi"), value: formatPercent(averageRoi) },
    { label: t("rewardVault.avgPayout"), value: formatCompactCurrency(averageClaim) },
    { label: t("rewardVault.bestProfit"), value: formatCompactCurrency(bestProfit) },
    { label: t("rewardVault.bestPayout"), value: formatCompactCurrency(bestReward) },
  ];

  return (
    <DashboardLayout disableMonochrome>
      <div className="min-h-screen font-mono alpha-bg alpha-text">
        <main className="w-full px-5 py-6 sm:px-6 lg:px-7">
          <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-alpha-border bg-[color:var(--alpha-hover-soft)] px-3 py-1 text-[10px] uppercase tracking-[0.28em] alpha-text-muted">
                <Sparkles className="h-3.5 w-3.5 text-gold" />
                {t("rewardVault.badge")}
              </div>
              <h1 className="mt-3 text-[1.9rem] font-semibold tracking-tight alpha-text">{t("rewardVault.title")}</h1>
            </div>

            <div className="flex w-full min-w-0 flex-col gap-2.5 sm:flex-row lg:max-w-[520px]">
              <div className="relative min-w-0 flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 alpha-text-muted" />
                <Input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder={t("rewardVault.searchPlaceholder")}
                  className="macos-input !pl-11 pr-4 text-sm"
                />
              </div>

              <Select value={claimFilter} onValueChange={(value) => setClaimFilter(value as RewardClaimStatus | "all" | "untracked")}>
                <SelectTrigger className="w-full text-sm sm:w-[170px] macos-input">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="macos-popover">
                  <SelectItem value="all">{t("rewardVault.filter.all")}</SelectItem>
                  <SelectItem value="Claimed">{translateOption("rewardClaimStatus", "Claimed")}</SelectItem>
                  <SelectItem value="Pending TGE">{translateOption("rewardClaimStatus", "Pending TGE")}</SelectItem>
                  <SelectItem value="Missed">{translateOption("rewardClaimStatus", "Missed")}</SelectItem>
                  <SelectItem value="untracked">{t("rewardVault.filter.untracked")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {showSchemaBanner ? (
            <div className="mb-6 rounded-2xl border border-[var(--alpha-danger-border)] bg-[var(--alpha-danger-soft)] px-4 py-3 text-sm text-[var(--alpha-danger)]">
              {schemaWarning ?? REWARD_FINANCE_SCHEMA_WARNING}
            </div>
          ) : null}

          <div className="mb-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {summaryCards.map((item, index) => (
              <div
                key={item.label}
                className={`macos-premium-card macos-card-entry relative overflow-hidden p-4 group ${
                  isDark ? "bg-[var(--alpha-surface)] border-[var(--alpha-border)]" : "bg-[var(--alpha-panel)] border-[var(--alpha-border)]"
                }`}
                style={{ borderLeft: `3px solid ${item.accent}`, "--mac-delay": `${index * 48}ms` } as MacCardStyle}
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-lg"
                  style={{ background: `linear-gradient(135deg, ${item.accent}08 0%, transparent 50%)` }}
                />
                <div className="relative z-10 flex items-center justify-between gap-3">
                  <p className="text-[10px] uppercase tracking-[0.2em] alpha-text-muted">{item.label}</p>
                  <item.icon className={`h-4 w-4 ${item.tone}`} />
                </div>
                <p className={`mt-3 text-[1.8rem] font-semibold leading-none ${item.tone}`}>{item.value}</p>
              </div>
            ))}
          </div>

          <div className="mb-6 flex flex-wrap gap-2">
            {financePills.map((pill) => (
              <div
                key={pill.label}
                className="rounded-full border border-alpha-border bg-[color:var(--alpha-hover-soft)] px-3 py-1.5 text-[11px]"
              >
                <span className="uppercase tracking-[0.2em] alpha-text-muted">{pill.label}</span>
                <span className="ml-2 font-semibold alpha-text">{pill.value}</span>
              </div>
            ))}
          </div>

          <Suspense fallback={<RewardPerformancePanelFallback />}>
            <RewardPerformancePanel
              rewards={rewards}
              isDark={isDark}
              className="mb-6"
              title={t("rewardVault.timelineTitle")}
              subtitle={t("rewardVault.timelineSubtitle")}
              compact
            />
          </Suspense>

          <div className="bg-transparent">
            <div className="mb-5 flex items-center justify-between px-1">
              <div>
                <h2 className="text-lg font-semibold alpha-text">{t("rewardVault.trackedPayouts")}</h2>
                <p className="mt-1 text-[13px] alpha-text-muted">
                  {t("rewardVault.trackedCount", { count: filteredRows.length })}
                </p>
              </div>
            </div>

            {loading ? (
              <div className="px-5 py-12 text-center text-sm alpha-text-muted">{t("rewardVault.loading")}</div>
            ) : filteredRows.length === 0 ? (
              <div className="px-5 py-12 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-dashed border-alpha-border bg-[color:var(--alpha-hover-soft)] text-gold">
                  <Gem className="h-6 w-6" />
                </div>
                <p className="mt-4 text-lg font-medium alpha-text">{t("rewardVault.emptyTitle")}</p>
                <p className="mt-2 text-sm alpha-text-muted">{t("rewardVault.emptyDescription")}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-5">
                {filteredRows.map(({ airdrop, reward }, index) => {
                  let statusColor = "var(--alpha-text-muted)";
                  if (reward?.claimStatus === "Claimed") statusColor = "var(--alpha-warning)";
                  else if (reward?.claimStatus === "Pending TGE") statusColor = "var(--alpha-signal)";
                  else if (reward?.claimStatus === "Missed") statusColor = "var(--alpha-danger)";
                  const capital = getRewardCost(reward);
                  const profit = getRewardProfit(reward);
                  const roi = getRewardRoi(reward);
                  const tokenDisplay = getRewardTokenDisplay(reward, formatNumber);

                  return (
                    <div
                      key={airdrop.id}
                      onClick={() => setSelectedAirdrop(airdrop)}
                      className={`macos-premium-card macos-card-entry relative overflow-hidden p-4 group cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg ${
                        isDark ? "bg-[var(--alpha-surface)] border-[var(--alpha-border)]" : "bg-[var(--alpha-panel)] border-[var(--alpha-border)]"
                      }`}
                      style={{ borderLeft: `3px solid ${statusColor}`, "--mac-delay": `${index * 26}ms` } as MacCardStyle}
                    >
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-lg"
                        style={{ background: `linear-gradient(135deg, ${statusColor}08 0%, transparent 50%)` }}
                      />

                      <div className="mb-3 flex items-start justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-2.5">
                          <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg border border-alpha-border bg-[color:var(--alpha-surface)]">
                            {airdrop.projectLogo ? (
                              <img src={airdrop.projectLogo} alt={airdrop.projectName} className="h-full w-full object-cover" />
                            ) : (
                              <span className="text-xs font-semibold alpha-text">{airdrop.projectName.slice(0, 1).toUpperCase()}</span>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate pr-2 text-[13px] font-semibold alpha-text">{airdrop.projectName}</p>
                            <p className="truncate text-[10px] alpha-text-muted">{translateOption("airdropType", airdrop.type)}</p>
                          </div>
                        </div>
                        <ArrowUpRight className="h-4 w-4 shrink-0 opacity-0 transition-all duration-300 text-alpha-muted group-hover:opacity-100" />
                      </div>

                      <div className="mb-2.5 grid grid-cols-2 gap-2 text-xs">
                        <div className="rounded border border-alpha-border/50 bg-[color:var(--alpha-hover-soft)] p-2">
                          <p className="text-[10px] uppercase alpha-text-muted">{t("rewardVault.card.status")}</p>
                          <p className="font-medium mt-1 truncate" style={{ color: statusColor }}>
                            {reward ? translateOption("rewardClaimStatus", reward.claimStatus) : t("rewardVault.card.untracked")}
                          </p>
                        </div>
                        <div className="rounded border border-alpha-border/50 bg-[color:var(--alpha-hover-soft)] p-2">
                          <p className="text-[10px] uppercase alpha-text-muted">{t("rewardVault.card.revenue")}</p>
                          <p className={`font-medium mt-1 ${reward ? "text-gold" : "alpha-text-muted"}`}>{reward ? formatCurrency(reward.amountUsd) : "-"}</p>
                        </div>
                        <div className="rounded border border-alpha-border/50 bg-[color:var(--alpha-hover-soft)] p-2">
                          <p className="text-[10px] uppercase alpha-text-muted">{t("rewardVault.card.capital")}</p>
                          <p className="font-medium mt-1 alpha-text">{reward ? formatCurrency(capital) : "-"}</p>
                        </div>
                        <div className="rounded border border-alpha-border/50 bg-[color:var(--alpha-hover-soft)] p-2">
                          <p className="text-[10px] uppercase alpha-text-muted">{t("rewardVault.card.profit")}</p>
                          <p className={`font-medium mt-1 ${reward ? (profit >= 0 ? "text-gold" : "text-[var(--alpha-danger)]") : "alpha-text-muted"}`}>
                            {reward ? formatCurrency(profit) : "-"}
                          </p>
                        </div>
                      </div>

                      {reward ? (
                        <div className="mb-2.5 rounded-xl border border-alpha-border/50 bg-[color:var(--alpha-hover-soft)] px-3 py-2 text-xs">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="min-w-0">
                              <p className="text-[10px] uppercase tracking-[0.18em] alpha-text-muted">{t("rewardVault.card.tokenReward")}</p>
                              <p className={`mt-1 truncate font-medium ${tokenDisplay ? "alpha-text" : "alpha-text-muted"}`}>
                                {tokenDisplay || t("rewardModal.tokenEmpty")}
                              </p>
                            </div>
                            {reward.tokenSymbol ? (
                              <span className="rounded-full border border-gold/20 bg-gold/10 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-gold">
                                {reward.tokenSymbol}
                              </span>
                            ) : null}
                          </div>
                        </div>
                      ) : null}

                      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-alpha-border/50 pt-2 text-[10px] alpha-text-muted">
                        <div className="flex items-center gap-1">
                          <CalendarDays className="w-3 h-3" />
                          <span>{formatDate(reward?.tgeDate ?? airdrop.deadline)}</span>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                          <span className="font-mono">{reward ? formatPercent(roi) : "--"}</span>
                          {tokenDisplay ? (
                            <span className="font-mono break-all sm:break-normal">{tokenDisplay}</span>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </main>

        <AirdropRewardModal
          isOpen={!!selectedAirdrop}
          onClose={() => setSelectedAirdrop(null)}
          airdrop={selectedAirdrop}
          reward={selectedReward}
          onSubmit={handleSaveReward}
          onDelete={handleDeleteReward}
        />
      </div>
    </DashboardLayout>
  );
}
