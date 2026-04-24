import { useEffect, useMemo, useState } from "react";
import {
  Calculator,
  CalendarDays,
  Coins,
  Edit3,
  ReceiptText,
  Save,
  Search,
  Sparkles,
  TrendingUp,
  WalletCards,
} from "lucide-react";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { AirdropModal } from "@/components/modals/AirdropModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useI18n } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useAirdrops } from "@/hooks/use-airdrops";
import { useAirdropRewards } from "@/hooks/use-airdrop-rewards";
import { supabase } from "@/lib/supabase";
import { REWARD_FINANCE_SCHEMA_WARNING } from "@/services/airdrop-rewards";
import { updateAirdrop } from "@/services/database";
import type {
  Airdrop,
  AirdropRewardInput,
  RewardClaimStatus,
} from "@/types";

const CLAIM_STATUSES: RewardClaimStatus[] = ["Pending TGE", "Claimed", "Missed"];
const INPUT_WITH_LEADING_ICON_CLASS = "macos-input !pl-11";

const getTodayDateInputValue = () => new Date().toISOString().slice(0, 10);

const normalizeDateInputValue = (value?: string | null) => {
  if (!value) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "";
  return parsed.toISOString().slice(0, 10);
};

const toNumber = (value: string) => {
  const parsed = Number(value || 0);
  return Number.isFinite(parsed) ? parsed : 0;
};

const formatPercent = (value: number | null) => {
  if (value == null || !Number.isFinite(value)) return "--";
  return `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`;
};

export function CalculatorPage() {
  const { theme } = useTheme();
  const {
    t,
    displayCurrencyLabel,
    convertToUsd,
    formatCompactCurrency,
    formatCurrency,
    formatCurrencyInput,
    formatDate,
    formatNumber,
    translateOption,
  } = useI18n();
  const isDark = theme === "dark";
  const { airdrops, loading: loadingAirdrops, refetch: refetchAirdrops } = useAirdrops();
  const {
    rewardMap,
    loading: loadingRewards,
    saveReward,
    schemaWarning,
  } = useAirdropRewards();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAirdropId, setSelectedAirdropId] = useState<string | null>(null);
  const [isEditProjectOpen, setIsEditProjectOpen] = useState(false);

  const [claimStatus, setClaimStatus] = useState<RewardClaimStatus>("Pending TGE");
  const [amountUsd, setAmountUsd] = useState("0");
  const [capitalUsd, setCapitalUsd] = useState("0");
  const [feeUsd, setFeeUsd] = useState("0");
  const [tokenAmount, setTokenAmount] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [tgeDate, setTgeDate] = useState("");
  const [claimedAt, setClaimedAt] = useState("");
  const [notes, setNotes] = useState("");
  const [tokenPrice, setTokenPrice] = useState("0");
  const [exitPercent, setExitPercent] = useState("100");
  const [extraFees, setExtraFees] = useState("0");
  const [targetProfit, setTargetProfit] = useState("0");
  const [isSaving, setIsSaving] = useState(false);

  const filteredAirdrops = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return airdrops.filter((airdrop) => {
      if (!query) return true;

      const reward = rewardMap.get(airdrop.id);
      return (
        airdrop.projectName.toLowerCase().includes(query) ||
        airdrop.type.toLowerCase().includes(query) ||
        airdrop.status.toLowerCase().includes(query) ||
        (reward?.tokenSymbol || "").toLowerCase().includes(query)
      );
    });
  }, [airdrops, rewardMap, searchQuery]);

  useEffect(() => {
    if (!airdrops.length) {
      setSelectedAirdropId(null);
      return;
    }

    setSelectedAirdropId((current) => {
      if (current && airdrops.some((airdrop) => airdrop.id === current)) {
        return current;
      }

      return airdrops[0]?.id ?? null;
    });
  }, [airdrops]);

  const selectedAirdrop = useMemo(
    () => airdrops.find((airdrop) => airdrop.id === selectedAirdropId) ?? null,
    [airdrops, selectedAirdropId]
  );

  const selectedReward = selectedAirdrop ? rewardMap.get(selectedAirdrop.id) ?? null : null;

  useEffect(() => {
    if (!selectedAirdrop) {
      setClaimStatus("Pending TGE");
      setAmountUsd("0");
      setCapitalUsd("0");
      setFeeUsd("0");
      setTokenAmount("");
      setTokenSymbol("");
      setTgeDate("");
      setClaimedAt("");
      setNotes("");
      setTokenPrice("0");
      setExitPercent("100");
      setExtraFees("0");
      setTargetProfit("0");
      return;
    }

    setClaimStatus(selectedReward?.claimStatus ?? "Pending TGE");
    setAmountUsd(formatCurrencyInput(selectedReward?.amountUsd ?? 0));
    setCapitalUsd(formatCurrencyInput(selectedReward?.capitalUsd ?? 0));
    setFeeUsd(formatCurrencyInput(selectedReward?.feeUsd ?? 0));
    setTokenAmount(selectedReward?.tokenAmount != null ? String(selectedReward.tokenAmount) : "");
    setTokenSymbol(selectedReward?.tokenSymbol ?? "");
    setTgeDate(normalizeDateInputValue(selectedReward?.tgeDate ?? selectedAirdrop.deadline));
    setClaimedAt(normalizeDateInputValue(selectedReward?.claimedAt));
    setNotes(selectedReward?.notes ?? "");
    setTokenPrice(formatCurrencyInput(0));
    setExitPercent("100");
    setExtraFees(formatCurrencyInput(0));
    setTargetProfit(formatCurrencyInput(0));
  }, [formatCurrencyInput, selectedAirdrop, selectedReward]);

  const amountDisplayValue = toNumber(amountUsd);
  const capitalDisplayValue = toNumber(capitalUsd);
  const feeDisplayValue = toNumber(feeUsd);
  const tokenAmountValue = toNumber(tokenAmount);
  const tokenPriceDisplayValue = toNumber(tokenPrice);
  const exitPercentValue = toNumber(exitPercent);
  const extraFeesDisplayValue = toNumber(extraFees);
  const targetProfitDisplayValue = toNumber(targetProfit);
  const amountValue = convertToUsd(amountDisplayValue);
  const capitalValue = convertToUsd(capitalDisplayValue);
  const feeValue = convertToUsd(feeDisplayValue);
  const tokenPriceValue = convertToUsd(tokenPriceDisplayValue);
  const extraFeesValue = convertToUsd(extraFeesDisplayValue);
  const targetProfitValue = convertToUsd(targetProfitDisplayValue);
  const totalCost = capitalValue + feeValue;
  const netProfit = amountValue - totalCost;
  const roi = totalCost > 0 ? (netProfit / totalCost) * 100 : null;
  const estimatedGrossValue = tokenAmountValue * tokenPriceValue * (exitPercentValue / 100);
  const estimatedNetValue = estimatedGrossValue - (totalCost + extraFeesValue);
  const estimatedRoiValue =
    totalCost + extraFeesValue > 0 ? (estimatedNetValue / (totalCost + extraFeesValue)) * 100 : null;
  const breakEvenPrice =
    tokenAmountValue > 0 ? (totalCost + extraFeesValue) / tokenAmountValue : null;
  const targetValue = totalCost + extraFeesValue + targetProfitValue;

  const loading = loadingAirdrops || loadingRewards;

  const getRewardErrorMessage = (error: unknown) => {
    const message = error instanceof Error ? error.message : "";
    const code =
      typeof error === "object" && error !== null && "code" in error
        ? String((error as { code?: string }).code)
        : "";

    if (
      code === "PGRST204" ||
      code === "PGRST205" ||
      message.includes("public.airdrop_rewards") ||
      message.includes("capital_usd") ||
      message.includes("fee_usd")
    ) {
      return REWARD_FINANCE_SCHEMA_WARNING;
    }

    return message || t("calculator.toast.saveError");
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

  const handleSaveFinance = async () => {
    if (!selectedAirdrop) return;

    setIsSaving(true);
    try {
      const payload: AirdropRewardInput = {
        airdropId: selectedAirdrop.id,
        claimStatus,
        amountUsd: amountValue,
        capitalUsd: capitalValue,
        feeUsd: feeValue,
        tokenAmount: tokenAmount ? tokenAmountValue : null,
        tokenSymbol: tokenSymbol || null,
        tgeDate: tgeDate || null,
        claimedAt: claimStatus === "Claimed" ? claimedAt || getTodayDateInputValue() : claimedAt || null,
        notes: notes || null,
      };

      const savedReward = await saveReward(payload);
      await syncAirdropStatusFromReward(selectedAirdrop, payload);
      await refetchAirdrops();

      toast.success(
        savedReward.storageMode === "legacy_notes" ? t("rewardVault.savedCompat") : t("calculator.toast.saved")
      );
    } catch (error) {
      console.error(error);
      toast.error(getRewardErrorMessage(error));
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateProject = async (
    data: Omit<Airdrop, "id" | "userId" | "createdAt" | "updatedAt">
  ) => {
    if (!selectedAirdrop) return;

    try {
      await updateAirdrop(selectedAirdrop.id, data);
      await refetchAirdrops();
      setIsEditProjectOpen(false);
      toast.success(t("calculator.toast.projectUpdated"));
    } catch (error) {
      console.error(error);
      toast.error(t("calculator.toast.projectUpdateError"));
      throw error;
    }
  };

  const summaryCards = [
    {
      label: t("calculator.summary.activeProject"),
      value: selectedAirdrop?.projectName ?? t("calculator.summary.noProject"),
      meta: selectedAirdrop
        ? t("calculator.state.projectMeta", {
            type: translateOption("airdropType", selectedAirdrop.type),
            status: translateOption("airdropStatus", selectedAirdrop.status),
          })
        : t("calculator.state.synced"),
      icon: Sparkles,
      tone: "text-gold",
    },
    {
      label: t("calculator.summary.realizedValue"),
      value: formatCurrency(amountValue),
      meta: translateOption("rewardClaimStatus", claimStatus),
      icon: Coins,
      tone: "text-gold",
    },
    {
      label: t("calculator.summary.totalCapital"),
      value: formatCompactCurrency(totalCost),
      meta: selectedReward ? t("common.updated") : t("common.noData"),
      icon: WalletCards,
      tone: "text-[var(--alpha-signal)]",
    },
    {
      label: t("calculator.summary.netProfit"),
      value: formatCompactCurrency(netProfit),
      meta: `ROI ${formatPercent(roi)}`,
      icon: TrendingUp,
      tone: netProfit >= 0 ? "text-gold" : "text-[var(--alpha-danger)]",
    },
  ];

  return (
    <DashboardLayout disableMonochrome>
      <div className="min-h-screen font-mono alpha-bg alpha-text">
        <main className="w-full px-5 py-6 sm:px-6 lg:px-7">
          <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-alpha-border bg-[color:var(--alpha-hover-soft)] px-3 py-1 text-[10px] uppercase tracking-[0.28em] alpha-text-muted">
                <Calculator className="h-3.5 w-3.5 text-gold" />
                {t("calculator.badge")}
              </div>
              <h1 className="mt-3 text-[1.9rem] font-semibold tracking-tight alpha-text">{t("calculator.title")}</h1>
              <p className="mt-1.5 max-w-3xl text-[13px] alpha-text-muted">{t("calculator.subtitle")}</p>
            </div>

            <div className="relative min-w-0 lg:w-[360px]">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 alpha-text-muted" />
              <Input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder={t("calculator.searchPlaceholder")}
                className="macos-input !pl-11 pr-4 text-sm"
              />
            </div>
          </div>

          <div className="mb-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {summaryCards.map((item) => (
              <div
                key={item.label}
                className={`macos-premium-card relative overflow-hidden border p-4 ${
                  isDark ? "border-[var(--alpha-border)] bg-[var(--alpha-surface)]" : "border-[var(--alpha-border)] bg-[var(--alpha-panel)]"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[10px] uppercase tracking-[0.2em] alpha-text-muted">{item.label}</p>
                  <item.icon className={`h-4 w-4 ${item.tone}`} />
                </div>
                <p className={`mt-3 text-[1.55rem] font-semibold leading-tight ${item.tone}`}>{item.value}</p>
                <p className="mt-2 text-[11px] alpha-text-muted">{item.meta}</p>
              </div>
            ))}
          </div>

          {schemaWarning ? (
            <div className="mb-6 rounded-2xl border border-[var(--alpha-warning-border)] bg-[var(--alpha-warning-soft)] px-4 py-3 text-sm text-[var(--alpha-warning)]">
              {schemaWarning}
            </div>
          ) : null}

          <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
            <section className="rounded-[1.4rem] border border-alpha-border bg-[color:var(--alpha-surface)] p-4">
              <div className="mb-4">
                <h2 className="text-lg font-semibold alpha-text">{t("calculator.panel.projectList")}</h2>
                <p className="mt-1 text-[12px] alpha-text-muted">{t("calculator.panel.projectListHint")}</p>
              </div>

              {loading ? (
                <div className="rounded-2xl border border-dashed border-alpha-border px-4 py-8 text-center text-sm alpha-text-muted">
                  {t("common.loading")}
                </div>
              ) : !airdrops.length ? (
                <div className="rounded-2xl border border-dashed border-alpha-border px-4 py-8 text-center text-sm alpha-text-muted">
                  {t("calculator.state.noProjects")}
                </div>
              ) : !filteredAirdrops.length ? (
                <div className="rounded-2xl border border-dashed border-alpha-border px-4 py-8 text-center text-sm alpha-text-muted">
                  {t("calculator.state.noMatch")}
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredAirdrops.map((airdrop) => {
                    const reward = rewardMap.get(airdrop.id);
                    const itemCost = (reward?.capitalUsd ?? 0) + (reward?.feeUsd ?? 0);
                    const itemProfit = (reward?.amountUsd ?? 0) - itemCost;
                    const isActive = airdrop.id === selectedAirdropId;

                    return (
                      <button
                        key={airdrop.id}
                        type="button"
                        onClick={() => setSelectedAirdropId(airdrop.id)}
                        className={`w-full rounded-[1.2rem] border p-3 text-left transition-all duration-200 ${
                          isActive
                            ? "border-[color:var(--alpha-highlight-border)] bg-[color:var(--alpha-highlight)] text-[color:var(--alpha-accent-contrast)] shadow-[0_12px_24px_rgba(0,0,0,0.12)]"
                            : "border-alpha-border bg-[color:var(--alpha-hover-soft)] alpha-text hover:-translate-y-0.5 hover:bg-[color:var(--alpha-surface)]"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl border border-alpha-border bg-[color:var(--alpha-surface)]">
                            {airdrop.projectLogo ? (
                              <img src={airdrop.projectLogo} alt={airdrop.projectName} className="h-full w-full object-cover" />
                            ) : (
                              <span className="text-sm font-semibold alpha-text">{airdrop.projectName.slice(0, 1).toUpperCase()}</span>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className={`truncate text-sm font-semibold ${isActive ? "text-[color:var(--alpha-accent-contrast)]" : "alpha-text"}`}>
                              {airdrop.projectName}
                            </p>
                            <p className={`truncate text-[11px] ${isActive ? "text-[color:var(--alpha-accent-contrast)]/80" : "alpha-text-muted"}`}>
                              {t("calculator.state.projectMeta", {
                                type: translateOption("airdropType", airdrop.type),
                                status: translateOption("airdropStatus", airdrop.status),
                              })}
                            </p>
                          </div>
                        </div>

                        <div className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
                          <div className="rounded-xl border border-alpha-border/50 bg-[color:var(--alpha-surface)]/60 p-2">
                            <p className={`${isActive ? "text-[color:var(--alpha-accent-contrast)]/70" : "alpha-text-muted"}`}>
                              {t("rewardVault.card.revenue")}
                            </p>
                            <p className={`mt-1 font-semibold ${isActive ? "text-[color:var(--alpha-accent-contrast)]" : "alpha-text"}`}>
                              {reward ? formatCurrency(reward.amountUsd) : "--"}
                            </p>
                          </div>
                          <div className="rounded-xl border border-alpha-border/50 bg-[color:var(--alpha-surface)]/60 p-2">
                            <p className={`${isActive ? "text-[color:var(--alpha-accent-contrast)]/70" : "alpha-text-muted"}`}>
                              {t("rewardVault.card.profit")}
                            </p>
                            <p className={`mt-1 font-semibold ${itemProfit >= 0 ? "text-gold" : "text-[var(--alpha-danger)]"}`}>
                              {reward ? formatCurrency(itemProfit) : "--"}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </section>

            <div className="space-y-6">
              <section className="rounded-[1.4rem] border border-alpha-border bg-[color:var(--alpha-surface)] p-4">
                <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <h2 className="text-lg font-semibold alpha-text">{t("calculator.panel.editor")}</h2>
                    <p className="mt-1 text-[12px] alpha-text-muted">{t("calculator.panel.editorHint")}</p>
                  </div>

                  {selectedAirdrop ? (
                    <Button type="button" variant="ghost" className="macos-btn macos-btn--ghost" onClick={() => setIsEditProjectOpen(true)}>
                      <Edit3 className="mr-2 h-4 w-4" />
                      {t("calculator.action.editProject")}
                    </Button>
                  ) : null}
                </div>

                {!selectedAirdrop ? (
                  <div className="rounded-2xl border border-dashed border-alpha-border px-4 py-10 text-center text-sm alpha-text-muted">
                    {t("calculator.summary.noProject")}
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="rounded-2xl border border-alpha-border bg-[color:var(--alpha-hover-soft)] p-4">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                        <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl border border-alpha-border bg-[color:var(--alpha-surface)]">
                          {selectedAirdrop.projectLogo ? (
                            <img src={selectedAirdrop.projectLogo} alt={selectedAirdrop.projectName} className="h-full w-full object-cover" />
                          ) : (
                            <span className="text-lg font-semibold alpha-text">{selectedAirdrop.projectName.slice(0, 1).toUpperCase()}</span>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-lg font-semibold alpha-text">{selectedAirdrop.projectName}</p>
                          <p className="mt-1 text-sm alpha-text-muted">
                            {t("calculator.state.projectMeta", {
                              type: translateOption("airdropType", selectedAirdrop.type),
                              status: translateOption("airdropStatus", selectedAirdrop.status),
                            })}
                          </p>
                          <p className="mt-1 text-xs alpha-text-muted">
                            {formatDate(selectedReward?.claimedAt ?? selectedReward?.tgeDate ?? selectedAirdrop.deadline ?? selectedAirdrop.updatedAt)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <p className="text-sm alpha-text-muted">{t("calculator.moneyHint", { currency: displayCurrencyLabel })}</p>

                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                      <div className="space-y-2">
                        <Label htmlFor="calculator-claim-status" className="alpha-text">{t("calculator.field.claimStatus")}</Label>
                        <Select value={claimStatus} onValueChange={(value) => setClaimStatus(value as RewardClaimStatus)}>
                          <SelectTrigger id="calculator-claim-status" className="macos-input">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="macos-popover">
                            {CLAIM_STATUSES.map((status) => (
                              <SelectItem key={status} value={status}>
                                {translateOption("rewardClaimStatus", status)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="calculator-amount" className="alpha-text">{t("calculator.field.realizedValue")}</Label>
                        <div className="relative">
                          <Coins className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 alpha-text-muted" />
                          <Input
                            id="calculator-amount"
                            type="number"
                            min="0"
                            step="0.01"
                            value={amountUsd}
                            onChange={(event) => setAmountUsd(event.target.value)}
                            className={INPUT_WITH_LEADING_ICON_CLASS}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="calculator-capital" className="alpha-text">{t("calculator.field.capitalUsd")}</Label>
                        <div className="relative">
                          <WalletCards className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 alpha-text-muted" />
                          <Input
                            id="calculator-capital"
                            type="number"
                            min="0"
                            step="0.01"
                            value={capitalUsd}
                            onChange={(event) => setCapitalUsd(event.target.value)}
                            className={INPUT_WITH_LEADING_ICON_CLASS}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr,1fr,1.1fr]">
                      <div className="space-y-2">
                        <Label htmlFor="calculator-fee" className="alpha-text">{t("calculator.field.feeUsd")}</Label>
                        <div className="relative">
                          <ReceiptText className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 alpha-text-muted" />
                          <Input
                            id="calculator-fee"
                            type="number"
                            min="0"
                            step="0.01"
                            value={feeUsd}
                            onChange={(event) => setFeeUsd(event.target.value)}
                            className={INPUT_WITH_LEADING_ICON_CLASS}
                          />
                        </div>
                      </div>

                      <div className="rounded-2xl border border-alpha-border bg-[color:var(--alpha-hover-soft)] p-4">
                        <p className="text-[10px] uppercase tracking-[0.22em] alpha-text-muted">{t("rewardModal.totalCost")}</p>
                        <p className="mt-2 text-xl font-semibold alpha-text">{formatCurrency(totalCost)}</p>
                        <p className="mt-1 text-xs alpha-text-muted">{t("rewardModal.totalCostHint")}</p>
                      </div>

                      <div className="rounded-2xl border border-alpha-border bg-[color:var(--alpha-hover-soft)] p-4">
                        <div className="flex items-center justify-between">
                          <p className="text-[10px] uppercase tracking-[0.22em] alpha-text-muted">{t("rewardModal.netProfit")}</p>
                          <TrendingUp className={`h-4 w-4 ${netProfit >= 0 ? "text-gold" : "text-[var(--alpha-danger)]"}`} />
                        </div>
                        <p className={`mt-2 text-xl font-semibold ${netProfit >= 0 ? "text-gold" : "text-[var(--alpha-danger)]"}`}>
                          {formatCurrency(netProfit)}
                        </p>
                        <p className="mt-1 text-xs alpha-text-muted">{t("rewardModal.roi", { value: formatPercent(roi) })}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="calculator-tge" className="alpha-text">{t("calculator.field.tgeDate")}</Label>
                        <div className="relative">
                          <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 alpha-text-muted" />
                          <Input
                            id="calculator-tge"
                            type="date"
                            value={tgeDate}
                            onChange={(event) => setTgeDate(event.target.value)}
                            className={INPUT_WITH_LEADING_ICON_CLASS}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="calculator-claimed" className="alpha-text">{t("calculator.field.claimedAt")}</Label>
                        <div className="relative">
                          <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 alpha-text-muted" />
                          <Input
                            id="calculator-claimed"
                            type="date"
                            value={claimedAt}
                            onChange={(event) => setClaimedAt(event.target.value)}
                            className={INPUT_WITH_LEADING_ICON_CLASS}
                            disabled={claimStatus !== "Claimed"}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="calculator-token-symbol" className="alpha-text">{t("calculator.field.tokenSymbol")}</Label>
                        <Input
                          id="calculator-token-symbol"
                          value={tokenSymbol}
                          onChange={(event) => setTokenSymbol(event.target.value.toUpperCase())}
                          className="macos-input"
                          maxLength={16}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="calculator-token-amount" className="alpha-text">{t("calculator.field.tokenAmount")}</Label>
                        <Input
                          id="calculator-token-amount"
                          type="number"
                          min="0"
                          step="0.0001"
                          value={tokenAmount}
                          onChange={(event) => setTokenAmount(event.target.value)}
                          className="macos-input"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="calculator-notes" className="alpha-text">{t("calculator.field.notes")}</Label>
                      <Textarea
                        id="calculator-notes"
                        value={notes}
                        onChange={(event) => setNotes(event.target.value)}
                        placeholder={t("calculator.field.notesPlaceholder")}
                        className="macos-input min-h-[120px]"
                      />
                    </div>

                    <div className="flex flex-col gap-3 border-t border-alpha-border pt-4 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-sm alpha-text-muted">{t("calculator.state.synced")}</p>
                      <Button type="button" className="macos-btn macos-btn--primary" onClick={handleSaveFinance} disabled={isSaving}>
                        {isSaving ? <Save className="mr-2 h-4 w-4 animate-pulse" /> : <Save className="mr-2 h-4 w-4" />}
                        {isSaving ? t("calculator.action.saving") : t("calculator.action.saveFinance")}
                      </Button>
                    </div>
                  </div>
                )}
              </section>

              <section className="rounded-[1.4rem] border border-alpha-border bg-[color:var(--alpha-surface)] p-4">
                <div className="mb-5">
                  <h2 className="text-lg font-semibold alpha-text">{t("calculator.panel.quickCalc")}</h2>
                  <p className="mt-1 text-[12px] alpha-text-muted">{t("calculator.panel.quickCalcHint")}</p>
                </div>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
                  <div className="space-y-2">
                    <Label htmlFor="quick-token-price" className="alpha-text">{t("calculator.quick.tokenPrice")}</Label>
                    <Input
                      id="quick-token-price"
                      type="number"
                      min="0"
                      step="0.0001"
                      value={tokenPrice}
                      onChange={(event) => setTokenPrice(event.target.value)}
                      className="macos-input"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="quick-exit-percent" className="alpha-text">{t("calculator.quick.exitPercent")}</Label>
                    <Input
                      id="quick-exit-percent"
                      type="number"
                      min="0"
                      step="0.01"
                      value={exitPercent}
                      onChange={(event) => setExitPercent(event.target.value)}
                      className="macos-input"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="quick-extra-fees" className="alpha-text">{t("calculator.quick.extraFees")}</Label>
                    <Input
                      id="quick-extra-fees"
                      type="number"
                      min="0"
                      step="0.01"
                      value={extraFees}
                      onChange={(event) => setExtraFees(event.target.value)}
                      className="macos-input"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="quick-target-profit" className="alpha-text">{t("calculator.quick.targetProfit")}</Label>
                    <Input
                      id="quick-target-profit"
                      type="number"
                      step="0.01"
                      value={targetProfit}
                      onChange={(event) => setTargetProfit(event.target.value)}
                      className="macos-input"
                    />
                  </div>
                </div>

                {tokenAmountValue <= 0 ? (
                  <div className="mt-4 rounded-2xl border border-dashed border-alpha-border px-4 py-5 text-sm alpha-text-muted">
                    {t("calculator.quick.noToken")}
                  </div>
                ) : (
                  <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
                    <div className="rounded-2xl border border-alpha-border bg-[color:var(--alpha-hover-soft)] p-4">
                      <p className="text-[10px] uppercase tracking-[0.18em] alpha-text-muted">{t("calculator.quick.estimatedGross")}</p>
                      <p className="mt-2 text-lg font-semibold alpha-text">{formatCurrency(estimatedGrossValue)}</p>
                    </div>

                    <div className="rounded-2xl border border-alpha-border bg-[color:var(--alpha-hover-soft)] p-4">
                      <p className="text-[10px] uppercase tracking-[0.18em] alpha-text-muted">{t("calculator.quick.estimatedNet")}</p>
                      <p className={`mt-2 text-lg font-semibold ${estimatedNetValue >= 0 ? "text-gold" : "text-[var(--alpha-danger)]"}`}>
                        {formatCurrency(estimatedNetValue)}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-alpha-border bg-[color:var(--alpha-hover-soft)] p-4">
                      <p className="text-[10px] uppercase tracking-[0.18em] alpha-text-muted">{t("calculator.quick.estimatedRoi")}</p>
                      <p className="mt-2 text-lg font-semibold alpha-text">{formatPercent(estimatedRoiValue)}</p>
                    </div>

                    <div className="rounded-2xl border border-alpha-border bg-[color:var(--alpha-hover-soft)] p-4">
                      <p className="text-[10px] uppercase tracking-[0.18em] alpha-text-muted">{t("calculator.quick.breakEven")}</p>
                      <p className="mt-2 text-lg font-semibold alpha-text">
                        {breakEvenPrice == null ? "--" : formatCurrency(breakEvenPrice, { maximumFractionDigits: 4 })}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-alpha-border bg-[color:var(--alpha-hover-soft)] p-4">
                      <p className="text-[10px] uppercase tracking-[0.18em] alpha-text-muted">{t("calculator.quick.targetValue")}</p>
                      <p className="mt-2 text-lg font-semibold alpha-text">{formatCurrency(targetValue)}</p>
                      <p className="mt-1 text-xs alpha-text-muted">
                        {tokenSymbol ? `${formatNumber(tokenAmountValue, { maximumFractionDigits: 4 })} ${tokenSymbol}` : `${formatNumber(tokenAmountValue, { maximumFractionDigits: 4 })} token`}
                      </p>
                    </div>
                  </div>
                )}
              </section>
            </div>
          </div>
        </main>
      </div>

      {selectedAirdrop ? (
        <AirdropModal
          isOpen={isEditProjectOpen}
          onClose={() => setIsEditProjectOpen(false)}
          onSubmit={handleUpdateProject}
          mode="edit"
          airdrop={selectedAirdrop}
          isDark={isDark}
        />
      ) : null}
    </DashboardLayout>
  );
}
