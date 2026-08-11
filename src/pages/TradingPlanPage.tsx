import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  BadgeDollarSign,
  BarChart3,
  BrainCircuit,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Coins,
  Copy,
  Download,
  Pencil,
  RotateCcw,
  Save,
  ShieldCheck,
  Target,
  Trash2,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
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
import { useAuth } from "@/contexts/AuthContext";
import { useI18n } from "@/contexts/LanguageContext";
import {
  createTradingPlan,
  deleteTradingPlan,
  getTradingPlansByUserId,
  updateTradingPlan,
} from "@/services/trading-plans";
import type { TradingPlan, TradingPlanInput } from "@/types";

type Direction = "Long" | "Short";
type Conviction = "wait" | "valid" | "aggressive";

const NUMBER_INPUT_CLASS = "macos-input";
const CONFLUENCE_OPTIONS = [
  "Support",
  "Resistance",
  "Trendline",
  "EMA",
  "VWAP",
  "Order Block",
  "FVG",
  "Liquidity Sweep",
  "RSI",
  "MACD",
  "Volume Confirmation",
  "Open Interest",
  "Funding Rate",
  "Bitcoin Dominance",
  "Higher Timeframe Confirmation",
  "News Confirmation",
];

const TRADE_CHECKLIST_OPTIONS = [
  "Trend Confirmed",
  "Volume Confirmed",
  "Risk Acceptable",
  "Stop Loss Ready",
  "Take Profit Ready",
  "Entry Confirmed",
  "Structure Confirmed",
  "No Emotional Bias",
  "News Checked",
  "Position Size Calculated",
];

const PSYCHOLOGY_OPTIONS = [
  "Slept well",
  "Follow trading plan",
  "No revenge trading",
  "No FOMO",
  "Accept risk",
  "Journal prepared",
  "Emotion under control",
];

const getToday = () => new Date().toISOString().slice(0, 10);
const getCurrentTime = () => new Date().toTimeString().slice(0, 5);

const defaultPlan = {
  tradeDate: getToday(),
  tradeTime: getCurrentTime(),
  coin: "BTC",
  customCoin: "",
  market: "BTC",
  exchange: "Binance",
  direction: "Long" as Direction,
  tradeType: "Swing",
  timeframe: "1H",
  setup: "Breakout retest",
  capital: "1000",
  riskPercent: "1",
  entryPrice: "65000",
  stopLoss: "63500",
  targetOne: "67500",
  targetTwo: "70000",
  targetThree: "72500",
  invalidationPrice: "63500",
  leverage: "1",
  fees: "0.08",
  expectedWinRate: "55",
  confidence: "75",
  marketTrend: "Bullish",
  marketStructure: "HH HL",
  volume: "Normal",
  liquidity: "Above High",
  bias: "Bullish",
  confluences: ["Support", "Volume Confirmation", "Higher Timeframe Confirmation"],
  reason:
    "Trend masih kuat, entry menunggu retest area support, invalidasi jelas di bawah struktur terakhir.",
  invalidation: "Close candle kuat di bawah stop loss atau volume breakout gagal follow-through.",
  additionalNotes: "",
  emotion: "Calm",
  psychologyChecklist: ["Follow trading plan", "No FOMO", "Accept risk", "Emotion under control"],
  news: "",
  newsImpact: "Low Impact",
  tradeChecklist: [
    "Trend Confirmed",
    "Risk Acceptable",
    "Stop Loss Ready",
    "Take Profit Ready",
    "Position Size Calculated",
  ],
  tradeStatus: "Pending",
  tradeResult: "Pending",
  pnl: "0",
  lessonsLearned: "",
  mistakes: "",
  beforeScreenshot: "",
  afterScreenshot: "",
  tags: "",
  notes: "Cek BTC dominance, funding, news, dan kondisi market sebelum entry.",
  checklistTrend: true,
  checklistRisk: true,
  checklistNews: false,
  checklistLiquidity: true,
  checklistEmotion: true,
};

type TradingPlanState = typeof defaultPlan;

const toNumber = (value: string) => {
  const parsed = Number(value || 0);
  return Number.isFinite(parsed) ? parsed : 0;
};

const toInputValue = (value: number | null | undefined) => String(value ?? 0);

const planRecordToState = (record: TradingPlan): TradingPlanState => ({
  ...defaultPlan,
  tradeDate: record.tradeDate,
  tradeTime: record.tradeTime,
  coin: record.coin,
  customCoin: record.customCoin ?? "",
  market: record.coin === "Custom" ? "Custom" : record.coin,
  exchange: record.exchange,
  direction: record.direction,
  tradeType: record.tradingType,
  timeframe: record.timeframe,
  capital: toInputValue(record.capital),
  riskPercent: toInputValue(record.riskPercent),
  entryPrice: toInputValue(record.entryPrice),
  stopLoss: toInputValue(record.stopLoss),
  targetOne: toInputValue(record.takeProfit1),
  targetTwo: toInputValue(record.takeProfit2),
  targetThree: toInputValue(record.takeProfit3),
  invalidationPrice: toInputValue(record.invalidation),
  leverage: toInputValue(record.leverage),
  expectedWinRate: toInputValue(record.expectedWinRate),
  confidence: toInputValue(record.confidence),
  marketTrend: record.marketTrend,
  marketStructure: record.marketStructure,
  volume: record.volume,
  liquidity: record.liquidity,
  bias: record.bias,
  confluences: record.confluences,
  reason: record.reason,
  invalidation: record.notes ?? "",
  additionalNotes: record.additionalNotes ?? "",
  emotion: record.emotion,
  psychologyChecklist: record.psychologyChecklist,
  news: record.news ?? "",
  newsImpact: record.newsImpact,
  tradeChecklist: record.tradeChecklist,
  tradeStatus: record.tradeStatus,
  tradeResult: record.tradeResult,
  pnl: toInputValue(record.pnl),
  lessonsLearned: record.lessonsLearned ?? "",
  mistakes: record.mistakes ?? "",
  beforeScreenshot: record.beforeScreenshot ?? "",
  afterScreenshot: record.afterScreenshot ?? "",
  tags: record.tags.join(", "),
  notes: record.notes ?? "",
});

const formatUsd = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: value >= 1000 ? 0 : 2,
  }).format(value);

const formatNumber = (value: number, maximumFractionDigits = 4) =>
  new Intl.NumberFormat("en-US", {
    maximumFractionDigits,
  }).format(value);

function MetricCard({
  label,
  value,
  hint,
  tone = "neutral",
}: {
  label: string;
  value: string;
  hint: string;
  tone?: "neutral" | "accent" | "soft" | "caution" | "danger";
}) {
  const toneClass = {
    neutral: "border-[color:var(--alpha-border)] bg-[color:var(--alpha-surface)]",
    accent: "border-[color:var(--alpha-highlight-border)] bg-[color:var(--alpha-highlight-soft)]",
    soft: "border-[color:var(--alpha-secondary-border)] bg-[color:var(--alpha-secondary-soft)]",
    caution: "border-[color:var(--alpha-highlight-border)] bg-[color:var(--alpha-signal-softest)]",
    danger: "border-[color:var(--alpha-danger-border)] bg-[color:var(--alpha-danger-soft)]",
  }[tone];

  return (
    <div className={`rounded-[1.15rem] border p-4 ${toneClass}`}>
      <p className="text-[11px] font-display font-bold uppercase tracking-[0.2em] alpha-text-muted">
        {label}
      </p>
      <p className="mt-2 text-2xl font-display font-bold alpha-text">{value}</p>
      <p className="mt-1 text-xs alpha-text-muted">{hint}</p>
    </div>
  );
}

function FieldShell({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label className="text-xs font-display font-bold uppercase tracking-[0.18em] alpha-text-muted">
        {label}
      </Label>
      {children}
    </div>
  );
}

function ChecklistItem({
  checked,
  label,
  onChange,
}: {
  checked: boolean;
  label: string;
  onChange: (checked: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`flex w-full items-center gap-3 rounded-xl border px-3 py-3 text-left transition-all duration-200 ${
        checked
          ? "border-[color:var(--alpha-highlight-border)] bg-[color:var(--alpha-highlight-soft)]"
          : "border-[color:var(--alpha-border)] bg-[color:var(--alpha-surface)] hover:bg-[color:var(--alpha-hover-soft)]"
      }`}
      aria-pressed={checked}
    >
      <CheckCircle2
        className={`h-4 w-4 shrink-0 ${checked ? "text-[color:var(--alpha-highlight)]" : "alpha-text-muted"}`}
      />
      <span className="text-sm font-medium alpha-text">{label}</span>
    </button>
  );
}

export function TradingPlanPage() {
  const { t } = useI18n();
  const { session } = useAuth();
  const user = session?.user;
  const [plan, setPlan] = useState<TradingPlanState>(defaultPlan);
  const [plans, setPlans] = useState<TradingPlan[]>([]);
  const [activePlanId, setActivePlanId] = useState<string | null>(null);
  const [isLoadingPlans, setIsLoadingPlans] = useState(true);
  const [isSavingPlan, setIsSavingPlan] = useState(false);
  const [schemaError, setSchemaError] = useState<string | null>(null);
  const [now, setNow] = useState(() => new Date());

  const updatePlan = <K extends keyof TradingPlanState>(key: K, value: TradingPlanState[K]) => {
    setPlan((current) => ({ ...current, [key]: value }));
  };

  const toggleListValue = (key: "confluences" | "psychologyChecklist" | "tradeChecklist", value: string) => {
    setPlan((current) => {
      const list = current[key];
      const nextList = list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
      return { ...current, [key]: nextList };
    });
  };

  const capital = toNumber(plan.capital);
  const riskPercent = toNumber(plan.riskPercent);
  const entryPrice = toNumber(plan.entryPrice);
  const stopLoss = toNumber(plan.stopLoss);
  const targetOne = toNumber(plan.targetOne);
  const targetTwo = toNumber(plan.targetTwo);
  const targetThree = toNumber(plan.targetThree);
  const leverage = Math.max(toNumber(plan.leverage), 1);
  const feesPercent = toNumber(plan.fees);
  const expectedWinRate = toNumber(plan.expectedWinRate);
  const confidence = toNumber(plan.confidence);
  const riskAmount = capital * (riskPercent / 100);
  const stopDistance = Math.abs(entryPrice - stopLoss);
  const riskPerUnit = stopDistance;
  const quantity = riskPerUnit > 0 ? riskAmount / riskPerUnit : 0;
  const notional = quantity * entryPrice;
  const marginNeeded = notional / leverage;
  const feeEstimate = notional * (feesPercent / 100);

  const targetOneProfit =
    plan.direction === "Long" ? (targetOne - entryPrice) * quantity : (entryPrice - targetOne) * quantity;
  const targetTwoProfit =
    plan.direction === "Long" ? (targetTwo - entryPrice) * quantity : (entryPrice - targetTwo) * quantity;
  const targetThreeProfit =
    plan.direction === "Long" ? (targetThree - entryPrice) * quantity : (entryPrice - targetThree) * quantity;
  const targetOneRr = riskAmount > 0 ? targetOneProfit / riskAmount : 0;
  const targetTwoRr = riskAmount > 0 ? targetTwoProfit / riskAmount : 0;
  const targetThreeRr = riskAmount > 0 ? targetThreeProfit / riskAmount : 0;
  const lossAfterFee = riskAmount + feeEstimate;
  const breakEvenPrice = plan.direction === "Long"
    ? entryPrice + (quantity > 0 ? feeEstimate / quantity : 0)
    : entryPrice - (quantity > 0 ? feeEstimate / quantity : 0);
  const liquidationPrice = plan.direction === "Long"
    ? entryPrice * (1 - 1 / leverage)
    : entryPrice * (1 + 1 / leverage);
  const checklistScore = [
    plan.checklistTrend,
    plan.checklistRisk,
    plan.checklistNews,
    plan.checklistLiquidity,
    plan.checklistEmotion,
  ].filter(Boolean).length;
  const confluenceCompletion = Math.round((plan.confluences.length / CONFLUENCE_OPTIONS.length) * 100);
  const tradeChecklistCompletion = Math.round((plan.tradeChecklist.length / TRADE_CHECKLIST_OPTIONS.length) * 100);
  const badEmotion = ["FOMO", "Revenge Trading", "Greed"].includes(plan.emotion);
  const totalTrades = plans.length;
  const closedPlans = plans.filter((item) => item.tradeStatus === "Closed");
  const winningTrades = closedPlans.filter((item) => item.tradeResult === "Win").length;
  const winRate = closedPlans.length ? (winningTrades / closedPlans.length) * 100 : 0;
  const netProfit = plans.reduce((sum, item) => sum + item.pnl, 0);
  const timezoneLabel = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const currentDateLabel = now.toLocaleDateString(undefined, {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const currentTimeLabel = now.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });

  const conviction: Conviction = useMemo(() => {
    if (badEmotion || tradeChecklistCompletion < 80 || confidence < 55 || targetOneRr < 1.5 || riskPercent > 2) return "wait";
    if (tradeChecklistCompletion >= 90 && targetTwoRr >= 3 && confidence >= 80 && riskPercent <= 1.5) return "aggressive";
    return "valid";
  }, [badEmotion, confidence, riskPercent, targetOneRr, targetTwoRr, tradeChecklistCompletion]);

  const convictionMeta = {
    wait: {
      label: t("tradingPlan.conviction.wait"),
      tone: "caution" as const,
      icon: AlertTriangle,
    },
    valid: {
      label: t("tradingPlan.conviction.valid"),
      tone: "accent" as const,
      icon: ShieldCheck,
    },
    aggressive: {
      label: t("tradingPlan.conviction.aggressive"),
      tone: "accent" as const,
      icon: TrendingUp,
    },
  }[conviction];

  const DirectionIcon = plan.direction === "Long" ? TrendingUp : TrendingDown;
  const ConvictionIcon = convictionMeta.icon;

  useEffect(() => {
    const intervalId = window.setInterval(() => setNow(new Date()), 60_000);
    return () => window.clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const loadPlans = async () => {
      if (!user) {
        setPlans([]);
        setActivePlanId(null);
        setIsLoadingPlans(false);
        return;
      }

      setIsLoadingPlans(true);
      try {
        const data = await getTradingPlansByUserId(user.id);
        setPlans(data);
        setSchemaError(null);
        if (data[0]) {
          setActivePlanId(data[0].id);
          setPlan(planRecordToState(data[0]));
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to load trading plans";
        setSchemaError(message);
        toast.error(message);
      } finally {
        setIsLoadingPlans(false);
      }
    };

    loadPlans();
  }, [user]);

  const buildPlanInput = (): TradingPlanInput => {
    const aiSummary =
      conviction === "wait"
        ? "Trading plan belum valid. Periksa emosi, checklist, confidence, risk, dan RR sebelum entry."
        : `${plan.coin} ${plan.direction} valid dengan bias ${plan.bias}, confidence ${confidence}%, risk ${riskPercent}%, dan RR ${formatNumber(targetTwoRr, 2)}R.`;

    return {
      tradeDate: plan.tradeDate,
      tradeTime: plan.tradeTime,
      coin: plan.coin,
      customCoin: plan.coin === "Custom" ? plan.customCoin : null,
      exchange: plan.exchange,
      tradingType: plan.tradeType,
      direction: plan.direction,
      timeframe: plan.timeframe,
      reason: plan.reason,
      additionalNotes: plan.additionalNotes,
      marketTrend: plan.marketTrend,
      marketStructure: plan.marketStructure,
      volume: plan.volume,
      liquidity: plan.liquidity,
      bias: plan.bias,
      confluences: plan.confluences,
      entryPrice,
      stopLoss,
      takeProfit1: targetOne,
      takeProfit2: targetTwo,
      takeProfit3: targetThree,
      invalidation: toNumber(plan.invalidationPrice),
      expectedWinRate,
      confidence,
      riskReward: targetTwoRr,
      capital,
      riskPercent,
      riskAmount,
      positionSize: quantity,
      leverage,
      marginUsed: marginNeeded,
      potentialProfit: targetTwoProfit - feeEstimate,
      potentialLoss: lossAfterFee,
      breakEvenPrice,
      liquidationPrice,
      emotion: plan.emotion,
      psychologyChecklist: plan.psychologyChecklist,
      news: plan.news,
      newsImpact: plan.newsImpact,
      tradeChecklist: plan.tradeChecklist,
      aiSummary,
      tradeStatus: plan.tradeStatus as TradingPlanInput["tradeStatus"],
      tradeResult: plan.tradeResult as TradingPlanInput["tradeResult"],
      pnl: toNumber(plan.pnl),
      profitPercent: capital > 0 && toNumber(plan.pnl) > 0 ? (toNumber(plan.pnl) / capital) * 100 : 0,
      lossPercent: capital > 0 && toNumber(plan.pnl) < 0 ? (Math.abs(toNumber(plan.pnl)) / capital) * 100 : 0,
      lessonsLearned: plan.lessonsLearned,
      mistakes: plan.mistakes,
      beforeScreenshot: plan.beforeScreenshot,
      afterScreenshot: plan.afterScreenshot,
      tags: plan.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
      notes: plan.notes,
    };
  };

  const handleSave = async () => {
    if (!user) {
      toast.error("Login dulu agar Trading Plan tersimpan real ke akun kamu.");
      return;
    }

    setIsSavingPlan(true);
    try {
      const payload = buildPlanInput();
      const savedPlan = activePlanId
        ? await updateTradingPlan(activePlanId, user.id, payload)
        : await createTradingPlan(user.id, payload);
      const nextPlans = [savedPlan, ...plans.filter((item) => item.id !== savedPlan.id)];
      setPlans(nextPlans);
      setActivePlanId(savedPlan.id);
      setSchemaError(null);
      toast.success(t("tradingPlan.toast.saved"));
    } catch (error) {
      const message = error instanceof Error ? error.message : "Gagal menyimpan trading plan.";
      setSchemaError(message);
      toast.error(message);
    } finally {
      setIsSavingPlan(false);
    }
  };

  const handleReset = () => {
    setActivePlanId(null);
    setPlan({ ...defaultPlan, tradeDate: getToday(), tradeTime: getCurrentTime() });
    toast.success(t("tradingPlan.toast.reset"));
  };

  const handleSelectPlan = (record: TradingPlan) => {
    setActivePlanId(record.id);
    setPlan(planRecordToState(record));
  };

  const handleDuplicate = async () => {
    if (!user) {
      toast.error("Login dulu agar duplikasi tersimpan ke database.");
      return;
    }

    setIsSavingPlan(true);
    try {
      const savedPlan = await createTradingPlan(user.id, {
        ...buildPlanInput(),
        tradeDate: getToday(),
        tradeTime: getCurrentTime(),
        notes: `${plan.notes || ""}\nDuplicated from ${activePlanId ?? "draft"}`.trim(),
      });
      setPlans([savedPlan, ...plans]);
      setActivePlanId(savedPlan.id);
      setPlan(planRecordToState(savedPlan));
      toast.success("Trading plan berhasil diduplikasi.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Gagal duplikasi trading plan.");
    } finally {
      setIsSavingPlan(false);
    }
  };

  const handleDelete = async (planId = activePlanId) => {
    if (!user || !planId) return;

    try {
      await deleteTradingPlan(planId, user.id);
      const nextPlans = plans.filter((item) => item.id !== planId);
      setPlans(nextPlans);
      if (planId === activePlanId && nextPlans[0]) {
        setActivePlanId(nextPlans[0].id);
        setPlan(planRecordToState(nextPlans[0]));
      } else if (planId === activePlanId) {
        setActivePlanId(null);
        setPlan({ ...defaultPlan, tradeDate: getToday(), tradeTime: getCurrentTime() });
      }
      toast.success("Trading plan dihapus dari database.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Gagal menghapus trading plan.");
    }
  };

  const handleExport = () => {
    const summary = [
      `Trading Plan: ${plan.coin} ${plan.direction.toUpperCase()}`,
      `Market: ${plan.market}`,
      `Setup: ${plan.setup}`,
      `Capital: ${formatUsd(capital)}`,
      `Risk: ${riskPercent}% / ${formatUsd(riskAmount)}`,
      `Entry: ${formatUsd(entryPrice)}`,
      `Stop: ${formatUsd(stopLoss)}`,
      `Target 1: ${formatUsd(targetOne)} (${formatNumber(targetOneRr, 2)}R)`,
      `Target 2: ${formatUsd(targetTwo)} (${formatNumber(targetTwoRr, 2)}R)`,
      `Target 3: ${formatUsd(targetThree)} (${formatNumber(targetThreeRr, 2)}R)`,
      `Size: ${formatNumber(quantity)} ${plan.coin}`,
      `Reason: ${plan.reason}`,
      `Invalidation: ${plan.invalidation}`,
      `Notes: ${plan.notes}`,
    ].join("\n");

    navigator.clipboard.writeText(summary);
    toast.success(t("tradingPlan.toast.exported"));
  };

  return (
    <DashboardLayout>
      <div className="space-y-5">
        <section className="overflow-hidden rounded-[1.35rem] border border-[color:var(--alpha-border)] bg-[color:var(--alpha-surface)]">
          <div className="grid gap-5 p-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.6fr)] lg:p-6">
            <div className="min-w-0">
              <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--alpha-highlight-border)] bg-[color:var(--alpha-highlight-soft)] px-3 py-1.5 text-[11px] font-display font-bold uppercase tracking-[0.18em] alpha-text">
                <ClipboardList className="h-3.5 w-3.5" />
                {t("tradingPlan.badge")}
              </div>
              <h1 className="mt-4 text-3xl font-display font-bold tracking-normal alpha-text sm:text-4xl">
                {t("tradingPlan.title")}
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 alpha-text-muted sm:text-base">
                {t("tradingPlan.subtitle")}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-[color:var(--alpha-border)] px-3 py-1.5 text-xs alpha-text-muted">
                  <CalendarDays className="h-3.5 w-3.5" />
                  {currentDateLabel}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-[color:var(--alpha-border)] px-3 py-1.5 text-xs alpha-text-muted">
                  {currentTimeLabel} {timezoneLabel}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-[color:var(--alpha-highlight-border)] bg-[color:var(--alpha-highlight-soft)] px-3 py-1.5 text-xs alpha-text">
                  Real Supabase Data
                </span>
              </div>
            </div>

            <div className={`rounded-[1.15rem] border p-4 ${
              convictionMeta.tone === "accent"
                ? "border-[color:var(--alpha-highlight-border)] bg-[color:var(--alpha-highlight-soft)]"
                : "border-[color:var(--alpha-highlight-border)] bg-[color:var(--alpha-signal-softest)]"
            }`}>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[color:var(--alpha-border)] bg-[color:var(--alpha-surface)]">
                  <ConvictionIcon className="h-5 w-5 alpha-text" />
                </div>
                <div>
                  <p className="text-[11px] font-display font-bold uppercase tracking-[0.2em] alpha-text-muted">
                    {t("tradingPlan.decision")}
                  </p>
                  <p className="text-xl font-display font-bold alpha-text">{convictionMeta.label}</p>
                </div>
              </div>
              <p className="mt-3 text-sm alpha-text-muted">
                {t("tradingPlan.checklistScore", { score: checklistScore })}
              </p>
            </div>
          </div>
        </section>

        {schemaError ? (
          <div className="rounded-[1.15rem] border border-[color:var(--alpha-danger-border)] bg-[color:var(--alpha-danger-soft)] p-4 text-sm alpha-text">
            {schemaError}
          </div>
        ) : null}

        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard label={t("tradingPlan.metric.risk")} value={formatUsd(riskAmount)} hint={`${riskPercent}% ${t("tradingPlan.metric.ofCapital")}`} tone={riskPercent > 2 ? "danger" : "accent"} />
          <MetricCard label={t("tradingPlan.metric.position")} value={formatUsd(notional)} hint={`${formatNumber(quantity)} ${plan.coin} / ${leverage}x`} />
          <MetricCard label={t("tradingPlan.metric.rr")} value={`${formatNumber(targetOneRr, 2)}R / ${formatNumber(targetTwoRr, 2)}R`} hint={t("tradingPlan.metric.targetHint")} tone={targetOneRr >= 1.5 ? "accent" : "caution"} />
          <MetricCard label={t("tradingPlan.metric.maxLoss")} value={formatUsd(lossAfterFee)} hint={t("tradingPlan.metric.afterFees")} tone={riskPercent > 2 ? "danger" : "neutral"} />
        </section>

        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="Total Trades" value={String(totalTrades)} hint={isLoadingPlans ? "Loading database..." : "Saved in Supabase"} />
          <MetricCard label="Winning Rate" value={`${formatNumber(winRate, 1)}%`} hint={`${closedPlans.length} closed trades`} tone={winRate >= 50 ? "accent" : "neutral"} />
          <MetricCard label="Net Profit" value={formatUsd(netProfit)} hint="All saved journal PnL" tone={netProfit >= 0 ? "accent" : "danger"} />
          <MetricCard label="Checklist" value={`${tradeChecklistCompletion}%`} hint="Trade plan completion" tone={tradeChecklistCompletion >= 80 ? "accent" : "caution"} />
        </section>

        <section className="rounded-[1.35rem] border border-[color:var(--alpha-border)] bg-[color:var(--alpha-surface)] p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-display font-bold alpha-text">Trading History</h2>
              <p className="text-sm alpha-text-muted">
                {isLoadingPlans ? "Loading plans from Supabase..." : `${plans.length} saved plans in your account`}
              </p>
            </div>
            <Button type="button" variant="outline" className="macos-btn rounded-[1rem]" onClick={handleReset}>
              <RotateCcw className="mr-2 h-4 w-4" />
              New Plan
            </Button>
          </div>
          {plans.length ? (
            <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
              {plans.slice(0, 6).map((item) => (
                <div
                  key={item.id}
                  className={`rounded-xl border p-3 text-left transition-all ${
                    activePlanId === item.id
                      ? "border-[color:var(--alpha-highlight-border)] bg-[color:var(--alpha-highlight-soft)]"
                      : "border-[color:var(--alpha-border)] hover:bg-[color:var(--alpha-hover-soft)]"
                  }`}
                >
                  <button type="button" onClick={() => handleSelectPlan(item)} className="w-full text-left">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-display font-bold alpha-text">{item.coin} {item.direction}</span>
                      <span className="text-xs alpha-text-muted">{item.tradeDate}</span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2 text-xs alpha-text-muted">
                      <span>{item.exchange}</span>
                      <span>{item.timeframe}</span>
                      <span>{item.tradeStatus}</span>
                      <span>{formatUsd(item.pnl)}</span>
                    </div>
                  </button>
                  <div className="mt-3 flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="macos-btn h-8 rounded-[0.75rem] px-3 text-xs"
                      onClick={() => handleSelectPlan(item)}
                    >
                      <Pencil className="mr-1.5 h-3.5 w-3.5" />
                      Edit
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="macos-btn h-8 rounded-[0.75rem] px-3 text-xs text-[color:var(--alpha-danger)]"
                      onClick={() => handleDelete(item.id)}
                    >
                      <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-[color:var(--alpha-border)] bg-[color:var(--alpha-hover-soft)] p-4 text-sm alpha-text-muted">
              Belum ada trading plan tersimpan di database. Isi form lalu klik Save Trading Plan.
            </div>
          )}
        </section>

        <section className="grid gap-5 xl:grid-cols-[minmax(0,1.1fr)_minmax(360px,0.9fr)]">
          <div className="space-y-5">
            <div className="rounded-[1.35rem] border border-[color:var(--alpha-border)] bg-[color:var(--alpha-surface)] p-5">
              <div className="mb-5 flex items-center gap-3">
                <Coins className="h-5 w-5 alpha-text" />
                <h2 className="text-xl font-display font-bold alpha-text">{t("tradingPlan.panel.asset")}</h2>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <FieldShell label="Trade Date">
                  <Input className="macos-input" type="date" value={plan.tradeDate} onChange={(event) => updatePlan("tradeDate", event.target.value)} />
                </FieldShell>
                <FieldShell label="Trade Time">
                  <Input className="macos-input" type="time" value={plan.tradeTime} onChange={(event) => updatePlan("tradeTime", event.target.value)} />
                </FieldShell>
                <FieldShell label={t("tradingPlan.field.coin")}>
                  <Select value={plan.coin} onValueChange={(value) => updatePlan("coin", value)}>
                    <SelectTrigger className="macos-input">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {["BTC", "ETH", "SOL", "BNB", "SUI", "HYPE", "ARB", "OP", "LINK", "AAVE", "DOGE", "PEPE", "Custom"].map((coin) => (
                        <SelectItem key={coin} value={coin}>{coin}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FieldShell>
                {plan.coin === "Custom" ? (
                  <FieldShell label="Coin Name">
                    <Input className="macos-input" value={plan.customCoin} onChange={(event) => updatePlan("customCoin", event.target.value.toUpperCase())} placeholder="TOKEN" />
                  </FieldShell>
                ) : null}
                <FieldShell label={t("tradingPlan.field.market")}>
                  <Select value={plan.market} onValueChange={(value) => updatePlan("market", value)}>
                    <SelectTrigger className="macos-input">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BTC">BTC</SelectItem>
                      <SelectItem value="ETH">ETH</SelectItem>
                      <SelectItem value="Altcoin">Altcoin</SelectItem>
                      <SelectItem value="Meme">Meme coin</SelectItem>
                      <SelectItem value="Perps">Perps</SelectItem>
                    </SelectContent>
                  </Select>
                </FieldShell>
                <FieldShell label="Exchange">
                  <Select value={plan.exchange} onValueChange={(value) => updatePlan("exchange", value)}>
                    <SelectTrigger className="macos-input">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {["Binance", "Bybit", "OKX", "Hyperliquid", "Bitget", "MEXC", "Other"].map((exchange) => (
                        <SelectItem key={exchange} value={exchange}>{exchange}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FieldShell>
                <FieldShell label={t("tradingPlan.field.direction")}>
                  <Select value={plan.direction} onValueChange={(value) => updatePlan("direction", value as Direction)}>
                    <SelectTrigger className="macos-input">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Long">Long</SelectItem>
                      <SelectItem value="Short">Short</SelectItem>
                    </SelectContent>
                  </Select>
                </FieldShell>
                <FieldShell label={t("tradingPlan.field.tradeType")}>
                  <Select value={plan.tradeType} onValueChange={(value) => updatePlan("tradeType", value)}>
                    <SelectTrigger className="macos-input">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Scalp">Scalp</SelectItem>
                      <SelectItem value="Intraday">Intraday</SelectItem>
                      <SelectItem value="Swing">Swing</SelectItem>
                      <SelectItem value="Position">Position</SelectItem>
                    </SelectContent>
                  </Select>
                </FieldShell>
                <FieldShell label="Timeframe">
                  <Select value={plan.timeframe} onValueChange={(value) => updatePlan("timeframe", value)}>
                    <SelectTrigger className="macos-input">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {["1m", "5m", "15m", "30m", "1H", "4H", "1D", "1W"].map((timeframe) => (
                        <SelectItem key={timeframe} value={timeframe}>{timeframe}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FieldShell>
                <div className="md:col-span-3">
                  <FieldShell label={t("tradingPlan.field.setup")}>
                    <Input className="macos-input" value={plan.setup} onChange={(event) => updatePlan("setup", event.target.value)} placeholder="Breakout, pullback, S/R flip" />
                  </FieldShell>
                </div>
              </div>
            </div>

            <div className="rounded-[1.35rem] border border-[color:var(--alpha-border)] bg-[color:var(--alpha-surface)] p-5">
              <div className="mb-5 flex items-center gap-3">
                <BarChart3 className="h-5 w-5 alpha-text" />
                <h2 className="text-xl font-display font-bold alpha-text">Market Analysis</h2>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <FieldShell label="Trend">
                  <Select value={plan.marketTrend} onValueChange={(value) => updatePlan("marketTrend", value)}>
                    <SelectTrigger className="macos-input"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["Bullish", "Bearish", "Sideway"].map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </FieldShell>
                <FieldShell label="Volume">
                  <Select value={plan.volume} onValueChange={(value) => updatePlan("volume", value)}>
                    <SelectTrigger className="macos-input"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["Strong", "Normal", "Weak"].map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </FieldShell>
                <FieldShell label="Liquidity">
                  <Select value={plan.liquidity} onValueChange={(value) => updatePlan("liquidity", value)}>
                    <SelectTrigger className="macos-input"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["Above High", "Below Low", "Equal High", "Equal Low"].map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </FieldShell>
                <FieldShell label="Market Structure">
                  <Select value={plan.marketStructure} onValueChange={(value) => updatePlan("marketStructure", value)}>
                    <SelectTrigger className="macos-input"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["HH HL", "LH LL", "Range", "Breakout", "BOS", "CHOCH"].map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </FieldShell>
                <FieldShell label="Bias">
                  <Select value={plan.bias} onValueChange={(value) => updatePlan("bias", value)}>
                    <SelectTrigger className="macos-input"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["Bullish", "Bearish", "Neutral"].map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </FieldShell>
                <div className="rounded-xl border border-[color:var(--alpha-border)] bg-[color:var(--alpha-hover-soft)] p-3">
                  <p className="text-[11px] font-display font-bold uppercase tracking-[0.18em] alpha-text-muted">Confluence Completion</p>
                  <p className="mt-2 text-lg font-display font-bold alpha-text">{confluenceCompletion}%</p>
                </div>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {CONFLUENCE_OPTIONS.map((item) => {
                  const checked = plan.confluences.includes(item);
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => toggleListValue("confluences", item)}
                      className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                        checked
                          ? "border-[color:var(--alpha-highlight-border)] bg-[color:var(--alpha-highlight-soft)] alpha-text"
                          : "border-[color:var(--alpha-border)] alpha-text-muted hover:bg-[color:var(--alpha-hover-soft)]"
                      }`}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-[1.35rem] border border-[color:var(--alpha-border)] bg-[color:var(--alpha-surface)] p-5">
              <div className="mb-5 flex items-center gap-3">
                <BadgeDollarSign className="h-5 w-5 alpha-text" />
                <h2 className="text-xl font-display font-bold alpha-text">{t("tradingPlan.panel.risk")}</h2>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <FieldShell label={t("tradingPlan.field.capital")}>
                  <Input className={NUMBER_INPUT_CLASS} inputMode="decimal" value={plan.capital} onChange={(event) => updatePlan("capital", event.target.value)} />
                </FieldShell>
                <FieldShell label={t("tradingPlan.field.riskPercent")}>
                  <Input className={NUMBER_INPUT_CLASS} inputMode="decimal" value={plan.riskPercent} onChange={(event) => updatePlan("riskPercent", event.target.value)} />
                </FieldShell>
                <FieldShell label={t("tradingPlan.field.leverage")}>
                  <Input className={NUMBER_INPUT_CLASS} inputMode="decimal" value={plan.leverage} onChange={(event) => updatePlan("leverage", event.target.value)} />
                </FieldShell>
                <FieldShell label={t("tradingPlan.field.entry")}>
                  <Input className={NUMBER_INPUT_CLASS} inputMode="decimal" value={plan.entryPrice} onChange={(event) => updatePlan("entryPrice", event.target.value)} />
                </FieldShell>
                <FieldShell label={t("tradingPlan.field.stop")}>
                  <Input className={NUMBER_INPUT_CLASS} inputMode="decimal" value={plan.stopLoss} onChange={(event) => updatePlan("stopLoss", event.target.value)} />
                </FieldShell>
                <FieldShell label={t("tradingPlan.field.fees")}>
                  <Input className={NUMBER_INPUT_CLASS} inputMode="decimal" value={plan.fees} onChange={(event) => updatePlan("fees", event.target.value)} />
                </FieldShell>
                <FieldShell label={t("tradingPlan.field.targetOne")}>
                  <Input className={NUMBER_INPUT_CLASS} inputMode="decimal" value={plan.targetOne} onChange={(event) => updatePlan("targetOne", event.target.value)} />
                </FieldShell>
                <FieldShell label={t("tradingPlan.field.targetTwo")}>
                  <Input className={NUMBER_INPUT_CLASS} inputMode="decimal" value={plan.targetTwo} onChange={(event) => updatePlan("targetTwo", event.target.value)} />
                </FieldShell>
                <FieldShell label="Take Profit 3">
                  <Input className={NUMBER_INPUT_CLASS} inputMode="decimal" value={plan.targetThree} onChange={(event) => updatePlan("targetThree", event.target.value)} />
                </FieldShell>
                <FieldShell label="Invalidation Price">
                  <Input className={NUMBER_INPUT_CLASS} inputMode="decimal" value={plan.invalidationPrice} onChange={(event) => updatePlan("invalidationPrice", event.target.value)} />
                </FieldShell>
                <FieldShell label="Expected Win Rate (%)">
                  <Input className={NUMBER_INPUT_CLASS} inputMode="decimal" value={plan.expectedWinRate} onChange={(event) => updatePlan("expectedWinRate", event.target.value)} />
                </FieldShell>
                <FieldShell label="Confidence (%)">
                  <Input className={NUMBER_INPUT_CLASS} inputMode="decimal" value={plan.confidence} onChange={(event) => updatePlan("confidence", event.target.value)} />
                </FieldShell>
                <div className="rounded-xl border border-[color:var(--alpha-border)] bg-[color:var(--alpha-hover-soft)] p-3">
                  <p className="text-[11px] font-display font-bold uppercase tracking-[0.18em] alpha-text-muted">
                    {t("tradingPlan.field.margin")}
                  </p>
                  <p className="mt-2 text-lg font-display font-bold alpha-text">{formatUsd(marginNeeded)}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div className="rounded-[1.35rem] border border-[color:var(--alpha-border)] bg-[color:var(--alpha-surface)] p-5">
              <div className="mb-5 flex items-center gap-3">
                <BarChart3 className="h-5 w-5 alpha-text" />
                <h2 className="text-xl font-display font-bold alpha-text">{t("tradingPlan.panel.execution")}</h2>
              </div>
              <div className="grid gap-3">
                <div className="flex items-center justify-between rounded-xl border border-[color:var(--alpha-border)] bg-[color:var(--alpha-hover-soft)] p-3">
                  <div className="flex items-center gap-3">
                    <DirectionIcon className="h-4 w-4 alpha-text" />
                    <span className="text-sm font-semibold alpha-text">{plan.direction.toUpperCase()} {plan.coin}</span>
                  </div>
                  <span className="text-sm alpha-text-muted">{plan.tradeType}</span>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <MetricCard label="TP1 PnL" value={formatUsd(targetOneProfit - feeEstimate)} hint={`${formatNumber(targetOneRr, 2)}R`} tone={targetOneProfit > 0 ? "accent" : "caution"} />
                  <MetricCard label="TP2 PnL" value={formatUsd(targetTwoProfit - feeEstimate)} hint={`${formatNumber(targetTwoRr, 2)}R`} tone={targetTwoProfit > 0 ? "accent" : "caution"} />
                  <MetricCard label="TP3 PnL" value={formatUsd(targetThreeProfit - feeEstimate)} hint={`${formatNumber(targetThreeRr, 2)}R`} tone={targetThreeProfit > 0 ? "accent" : "caution"} />
                  <MetricCard label="Break Even" value={formatUsd(breakEvenPrice)} hint={`Liq est. ${formatUsd(liquidationPrice)}`} />
                </div>
              </div>
            </div>

            <div className="rounded-[1.35rem] border border-[color:var(--alpha-border)] bg-[color:var(--alpha-surface)] p-5">
              <div className="mb-5 flex items-center gap-3">
                <BrainCircuit className="h-5 w-5 alpha-text" />
                <h2 className="text-xl font-display font-bold alpha-text">{t("tradingPlan.panel.reason")}</h2>
              </div>
              <div className="space-y-4">
                <FieldShell label={t("tradingPlan.field.reason")}>
                  <Textarea className="macos-input min-h-[110px]" value={plan.reason} onChange={(event) => updatePlan("reason", event.target.value)} />
                </FieldShell>
                <FieldShell label={t("tradingPlan.field.invalidation")}>
                  <Textarea className="macos-input min-h-[90px]" value={plan.invalidation} onChange={(event) => updatePlan("invalidation", event.target.value)} />
                </FieldShell>
                <FieldShell label={t("tradingPlan.field.notes")}>
                  <Textarea className="macos-input min-h-[90px]" value={plan.notes} onChange={(event) => updatePlan("notes", event.target.value)} />
                </FieldShell>
                <FieldShell label="Additional Notes">
                  <Textarea className="macos-input min-h-[80px]" value={plan.additionalNotes} onChange={(event) => updatePlan("additionalNotes", event.target.value)} />
                </FieldShell>
              </div>
            </div>

            <div className="rounded-[1.35rem] border border-[color:var(--alpha-border)] bg-[color:var(--alpha-surface)] p-5">
              <div className="mb-5 flex items-center gap-3">
                <BrainCircuit className="h-5 w-5 alpha-text" />
                <h2 className="text-xl font-display font-bold alpha-text">Psychology & News</h2>
              </div>
              <div className="space-y-4">
                <FieldShell label="Current Emotion">
                  <Select value={plan.emotion} onValueChange={(value) => updatePlan("emotion", value)}>
                    <SelectTrigger className="macos-input"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["Calm", "Confident", "Neutral", "Fear", "Greed", "FOMO", "Revenge Trading", "Overconfident"].map((item) => (
                        <SelectItem key={item} value={item}>{item}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FieldShell>
                {badEmotion ? (
                  <div className="rounded-xl border border-[color:var(--alpha-danger-border)] bg-[color:var(--alpha-danger-soft)] p-3 text-sm font-semibold alpha-text">
                    You should reconsider taking this trade.
                  </div>
                ) : null}
                <div className="grid gap-2">
                  {PSYCHOLOGY_OPTIONS.map((item) => (
                    <ChecklistItem
                      key={item}
                      checked={plan.psychologyChecklist.includes(item)}
                      label={item}
                      onChange={() => toggleListValue("psychologyChecklist", item)}
                    />
                  ))}
                </div>
                <FieldShell label="Important News">
                  <Textarea className="macos-input min-h-[90px]" value={plan.news} onChange={(event) => updatePlan("news", event.target.value)} placeholder="FOMC, CPI, listing, unlock, exploit, partnership..." />
                </FieldShell>
                <FieldShell label="News Impact">
                  <Select value={plan.newsImpact} onValueChange={(value) => updatePlan("newsImpact", value)}>
                    <SelectTrigger className="macos-input"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["High Impact", "Medium Impact", "Low Impact"].map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </FieldShell>
              </div>
            </div>

            <div className="rounded-[1.35rem] border border-[color:var(--alpha-border)] bg-[color:var(--alpha-surface)] p-5">
              <div className="mb-5 flex items-center gap-3">
                <Target className="h-5 w-5 alpha-text" />
                <h2 className="text-xl font-display font-bold alpha-text">{t("tradingPlan.panel.checklist")}</h2>
              </div>
              <div className="mb-4 h-2 overflow-hidden rounded-full bg-[color:var(--alpha-hover-soft)]">
                <div
                  className="h-full rounded-full bg-[color:var(--alpha-highlight)] transition-all duration-300"
                  style={{ width: `${tradeChecklistCompletion}%` }}
                />
              </div>
              {tradeChecklistCompletion < 80 ? (
                <div className="mb-4 rounded-xl border border-[color:var(--alpha-highlight-border)] bg-[color:var(--alpha-signal-softest)] p-3 text-sm alpha-text">
                  Trading Plan Incomplete.
                </div>
              ) : null}
              <div className="space-y-2">
                {TRADE_CHECKLIST_OPTIONS.map((item) => (
                  <ChecklistItem
                    key={item}
                    checked={plan.tradeChecklist.includes(item)}
                    label={item}
                    onChange={() => toggleListValue("tradeChecklist", item)}
                  />
                ))}
              </div>
            </div>

            <div className="rounded-[1.35rem] border border-[color:var(--alpha-border)] bg-[color:var(--alpha-surface)] p-5">
              <div className="mb-5 flex items-center gap-3">
                <ClipboardList className="h-5 w-5 alpha-text" />
                <h2 className="text-xl font-display font-bold alpha-text">Trade Journal</h2>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <FieldShell label="Trade Status">
                  <Select value={plan.tradeStatus} onValueChange={(value) => updatePlan("tradeStatus", value)}>
                    <SelectTrigger className="macos-input"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["Pending", "Running", "Closed"].map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </FieldShell>
                <FieldShell label="Trade Result">
                  <Select value={plan.tradeResult} onValueChange={(value) => updatePlan("tradeResult", value)}>
                    <SelectTrigger className="macos-input"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["Pending", "Win", "Loss", "Break Even"].map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </FieldShell>
                <FieldShell label="PnL">
                  <Input className={NUMBER_INPUT_CLASS} inputMode="decimal" value={plan.pnl} onChange={(event) => updatePlan("pnl", event.target.value)} />
                </FieldShell>
                <FieldShell label="Tags">
                  <Input className="macos-input" value={plan.tags} onChange={(event) => updatePlan("tags", event.target.value)} placeholder="breakout, btc, london" />
                </FieldShell>
                <div className="md:col-span-2">
                  <FieldShell label="Lessons Learned">
                    <Textarea className="macos-input min-h-[90px]" value={plan.lessonsLearned} onChange={(event) => updatePlan("lessonsLearned", event.target.value)} />
                  </FieldShell>
                </div>
                <div className="md:col-span-2">
                  <FieldShell label="Mistakes">
                    <Textarea className="macos-input min-h-[90px]" value={plan.mistakes} onChange={(event) => updatePlan("mistakes", event.target.value)} />
                  </FieldShell>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="flex flex-wrap justify-end gap-3">
          <Button type="button" variant="outline" className="macos-btn rounded-[1rem]" onClick={handleReset}>
            <RotateCcw className="mr-2 h-4 w-4" />
            {t("tradingPlan.action.reset")}
          </Button>
          <Button type="button" variant="outline" className="macos-btn rounded-[1rem]" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            {t("tradingPlan.action.export")}
          </Button>
          <Button type="button" variant="outline" className="macos-btn rounded-[1rem]" onClick={handleDuplicate} disabled={isSavingPlan}>
            <Copy className="mr-2 h-4 w-4" />
            Duplicate
          </Button>
          {activePlanId ? (
            <Button type="button" variant="outline" className="macos-btn rounded-[1rem] text-[color:var(--alpha-danger)]" onClick={() => handleDelete()}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          ) : null}
          <Button type="button" className="macos-btn macos-btn--primary rounded-[1rem]" onClick={handleSave} disabled={isSavingPlan}>
            <Save className="mr-2 h-4 w-4" />
            {isSavingPlan ? "Saving..." : activePlanId ? "Update Trading Plan" : t("tradingPlan.action.save")}
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
