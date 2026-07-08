import { Suspense, lazy, useEffect, useMemo, useRef, useState, type ChangeEvent, type KeyboardEvent } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useI18n } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { supabase } from "@/lib/supabase";
import {
  ArrowDownRight,
  ArrowUpRight,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  TrendingUp as TrendingUpIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { usePrices } from "@/hooks/use-prices";
import { useCurrencyRate } from "@/hooks/use-currency-rate";
import { useAirdropRewards } from "@/hooks/use-airdrop-rewards";
import { CurrencyConverter } from "@/components/dashboard/CurrencyConverter";
import { ProjectTableContainer } from "@/components/dashboard/ProjectTableContainer";
import { AIRDROPS_SYNC_EVENT, emitAirdropsSync, setCachedAirdrops } from "@/lib/airdrops-store";
import type { Airdrop } from "@/types";
import { createAirdrop, getAirdropsByUserId, updateAirdrop } from "@/services/database";

const RewardPerformancePanel = lazy(async () => {
  const module = await import("@/components/rewards/RewardPerformancePanel");
  return { default: module.RewardPerformancePanel };
});

const AirdropNewsPanel = lazy(async () => {
  const module = await import("@/components/dashboard/AirdropNewsPanel");
  return { default: module.AirdropNewsPanel };
});

const AirdropModal = lazy(async () => {
  const module = await import("@/components/modals/AirdropModal");
  return { default: module.AirdropModal };
});

const DeleteConfirmModal = lazy(async () => {
  const module = await import("@/components/modals/DeleteConfirmModal");
  return { default: module.DeleteConfirmModal };
});

const WalletConnectModal = lazy(async () => {
  const module = await import("@/components/modals/WalletConnectModal");
  return { default: module.WalletConnectModal };
});

const EligibilityModal = lazy(async () => {
  const module = await import("@/components/modals/EligibilityModal");
  return { default: module.EligibilityModal };
});

/* ---------- animations ---------- */
const ANIM_STYLE = `
@keyframes dashboardSoftFade {
  from { opacity: 0; }
  to   { opacity: 1; }
}
.anim-card {
  animation: dashboardSoftFade 140ms linear both;
}
.anim-fade {
  animation: dashboardSoftFade 120ms linear both;
}
.anim-card:nth-child(n+7) {
  animation: none;
  opacity: 1;
}
@media (prefers-reduced-motion: reduce) {
  .anim-card,
  .anim-fade {
    animation: none !important;
  }
}
`;

/* ---------- helpers ---------- */
function RewardPerformancePanelFallback() {
  return (
    <div className="overflow-hidden rounded-[1.15rem] border border-alpha-border bg-[color:var(--alpha-surface)] p-4">
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

function DashboardPanelFallback({ className = "" }: { className?: string }) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-[1.15rem] border border-alpha-border bg-[color:var(--alpha-hover-soft)] p-4",
        className
      )}
    >
      <div className="mb-3 h-4 w-28 rounded-full bg-[color:var(--alpha-border)]" />
      <div className="space-y-2">
        <div className="h-14 rounded-[0.95rem] bg-[color:var(--alpha-surface)]" />
        <div className="h-14 rounded-[0.95rem] bg-[color:var(--alpha-surface)]" />
        <div className="h-14 rounded-[0.95rem] bg-[color:var(--alpha-surface)]" />
      </div>
    </div>
  );
}

const formatUsdPrice = (value?: number) => {
  if (value == null) return '--';
  if (value >= 1000) {
    return `$${value.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
  }
  if (value >= 1) {
    return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  return `$${value.toLocaleString('en-US', { minimumFractionDigits: 3, maximumFractionDigits: 4 })}`;
};

const parseFundingAmount = (value?: string) => {
  if (!value?.trim()) return 0;

  const normalized = value.trim().toLowerCase().replace(/,/g, '');
  const amount = Number.parseFloat(normalized.replace(/[^0-9.]/g, ''));

  if (!Number.isFinite(amount)) return 0;
  if (normalized.includes('b')) return amount * 1_000_000_000;
  if (normalized.includes('m')) return amount * 1_000_000;
  if (normalized.includes('k')) return amount * 1_000;

  return amount;
};

const formatWholeUsd = (value: number) => `$${value.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;

const formatIdrAmount = (value?: number | null) => {
  if (value == null || !Number.isFinite(value)) return '--';
  return `Rp ${Math.round(value).toLocaleString('id-ID')}`;
};

const formatMarketCardPrice = (value?: number) => {
  if (value == null) return '--';
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(2)}M`;
  }
  if (value >= 10_000) {
    return `$${(value / 1_000).toFixed(1)}K`;
  }
  if (value >= 1_000) {
    return `$${(value / 1_000).toFixed(2)}K`;
  }
  if (value >= 1) {
    return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  return `$${value.toLocaleString('en-US', { minimumFractionDigits: 3, maximumFractionDigits: 4 })}`;
};

const formatPriceChange = (value?: number) => {
  if (value == null) return '--';
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
};

const formatCalendarDate = (date?: Date) => {
  if (!date) return '--';

  return date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const parseProjectDate = (value?: string) => {
  if (!value) return null;

  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split('-').map(Number);
    return new Date(year, month - 1, day);
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
};

const isSameCalendarDay = (left: Date, right: Date) =>
  left.getFullYear() === right.getFullYear() &&
  left.getMonth() === right.getMonth() &&
  left.getDate() === right.getDate();

const getCalendarMonthLabel = (date: Date) =>
  date.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

const getCalendarGrid = (month: Date) => {
  const firstDayOfMonth = new Date(month.getFullYear(), month.getMonth(), 1);
  const startDate = new Date(firstDayOfMonth);
  startDate.setDate(startDate.getDate() - firstDayOfMonth.getDay());

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + index);
    return {
      date,
      inCurrentMonth: date.getMonth() === month.getMonth(),
    };
  });
};

type DeadlineEntry = {
  airdrop: Airdrop;
  date: Date;
};

function DashboardHero({
  airdrops,
  rewards,
  isDark,
}: {
  airdrops: Airdrop[];
  rewards: ReturnType<typeof useAirdropRewards>["rewards"];
  isDark: boolean;
}) {
  const nextUpcoming = useMemo(() => {
    return airdrops
      .map((airdrop) => {
        const date = parseProjectDate(airdrop.deadline ?? airdrop.createdAt);
        if (!date) return null;
        return { airdrop, date };
      })
      .filter((entry): entry is DeadlineEntry => Boolean(entry))
      .sort((left, right) => left.date.getTime() - right.date.getTime())[0] ?? null;
  }, [airdrops]);

  const claimedRewards = useMemo(
    () => rewards.filter((reward) => reward.claimStatus === "Claimed"),
    [rewards]
  );
  const { rate: currencyRate, loading: currencyRateLoading, lastUpdated: currencyLastUpdated } = useCurrencyRate();
  const usdInputRef = useRef<HTMLInputElement>(null);
  const [usdAmount, setUsdAmount] = useState("1");
  const totalRealized = useMemo(
    () => claimedRewards.reduce((sum, reward) => sum + reward.amountUsd, 0),
    [claimedRewards]
  );
  const priorityCount = useMemo(
    () => airdrops.filter((airdrop) => Boolean(airdrop.isPriority || airdrop.is_priority)).length,
    [airdrops]
  );
  const ongoingCount = useMemo(
    () => airdrops.filter((airdrop) => airdrop.status === "Ongoing").length,
    [airdrops]
  );
  const weeklyWatchCount = useMemo(() => {
    const today = new Date();
    const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const end = new Date(start);
    end.setDate(end.getDate() + 7);

    return airdrops.reduce((total, airdrop) => {
      const date = parseProjectDate(airdrop.deadline ?? airdrop.createdAt);
      if (!date) return total;
      return date.getTime() >= start.getTime() && date.getTime() <= end.getTime() ? total + 1 : total;
    }, 0);
  }, [airdrops]);

  const parsedUsdAmount = useMemo(() => {
    const parsed = Number(usdAmount.replace(',', '.'));
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
  }, [usdAmount]);

  const convertedIdr = currencyRate && parsedUsdAmount != null
    ? parsedUsdAmount * currencyRate.usdToIdr
    : null;

  const handleUsdAmountChange = (event: ChangeEvent<HTMLInputElement>) => {
    let nextValue = event.target.value.replace(',', '.').replace(/[^0-9.]/g, '');
    const firstDotIndex = nextValue.indexOf('.');
    if (firstDotIndex !== -1) {
      nextValue = `${nextValue.slice(0, firstDotIndex + 1)}${nextValue.slice(firstDotIndex + 1).replace(/\./g, '')}`;
    }
    setUsdAmount(nextValue);
  };

  const focusUsdInput = () => {
    usdInputRef.current?.focus();
  };

  const handleUsdCardKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      focusUsdInput();
    }
  };

  const heroStats = useMemo(
    () => {
      const totalProjects = airdrops.length;
      const fundingRaised = airdrops.reduce((sum, airdrop) => sum + parseFundingAmount(airdrop.funding), 0);
      const fundingFilledCount = airdrops.filter((airdrop) => Boolean(airdrop.funding?.trim())).length;
      const fundingProgress = totalProjects === 0 ? 0 : Math.round((fundingFilledCount / totalProjects) * 100);

      const waitlistTotalUsers = airdrops.reduce((sum, airdrop) => sum + (airdrop.waitlistCount ?? 0), 0);
      const waitlistFilledCount = airdrops.filter((airdrop) => airdrop.waitlistCount != null).length;
      const waitlistProgress = totalProjects === 0 ? 0 : Math.round((waitlistFilledCount / totalProjects) * 100);

      const potentialProjects = airdrops.filter((airdrop) => Boolean(airdrop.potential));
      const highPotentialCount = potentialProjects.filter((airdrop) => airdrop.potential === 'High').length;
      const potentialProgress = totalProjects === 0 ? 0 : Math.round((potentialProjects.length / totalProjects) * 100);
      const potentialTier = highPotentialCount > 0 ? 'High' : potentialProjects.length > 0 ? 'Tracked' : '-';

      return [
        {
          label: 'Tracked',
          value: airdrops.length,
          meta: `${ongoingCount} ongoing`,
        },
        {
          label: 'Priority',
          value: priorityCount,
          meta: priorityCount > 0 ? 'Pinned projects' : 'No pinned project',
        },
        {
          label: 'Claimed',
          value: claimedRewards.length,
          meta: claimedRewards.length > 0 ? `${formatUsdPrice(totalRealized)} realized` : 'Reward vault idle',
        },
        {
          label: 'This week',
          value: weeklyWatchCount,
          meta: weeklyWatchCount > 0 ? 'Deadline within 7 days' : 'No urgent deadline',
        },
        {
          label: 'Funding',
          value: fundingRaised > 0 ? formatWholeUsd(fundingRaised) : '--',
          badge: fundingFilledCount > 0 ? `${fundingFilledCount} filled` : '-',
          badgeClass: 'text-[color:var(--alpha-highlight)] border-[color:var(--alpha-highlight-border)] bg-[color:var(--alpha-highlight-soft)]',
          progress: fundingProgress,
          progressColor: 'color-mix(in srgb, var(--highlight-hex) 62%, transparent)',
          meta: fundingFilledCount > 0 ? `${fundingFilledCount}/${totalProjects} projects filled` : 'Belum ada funding',
        },
        {
          label: 'Waitlist',
          value: waitlistFilledCount > 0 ? waitlistTotalUsers : '--',
          badge: waitlistFilledCount > 0 ? `${waitlistFilledCount} filled` : '-',
          badgeClass: waitlistFilledCount > 0 ? 'border-[color:var(--alpha-highlight-border)] bg-[color:var(--alpha-highlight-soft)] text-[color:var(--alpha-highlight)]' : 'border-[color:var(--alpha-secondary-border)] bg-[color:var(--alpha-secondary-soft)] text-[color:var(--alpha-text-muted)]',
          progress: waitlistProgress,
          progressColor: 'color-mix(in srgb, var(--highlight-hex) 62%, transparent)',
          meta: waitlistFilledCount > 0 ? `${waitlistFilledCount}/${totalProjects} projects filled` : 'Belum ada waitlist',
        },
        {
          label: 'Potential',
          value: potentialProjects.length > 0 ? potentialProjects.length : '--',
          badge: potentialTier,
          badgeClass:
            potentialTier === 'High'
              ? 'border-[color:var(--alpha-highlight-border)] bg-[color:var(--alpha-highlight-soft)] text-[color:var(--alpha-highlight)]'
              : potentialTier === 'Tracked'
                ? 'border-[color:var(--alpha-highlight-border)] bg-[color:var(--alpha-highlight-soft)] text-[color:var(--alpha-highlight)]'
                : 'border-[color:var(--alpha-secondary-border)] bg-[color:var(--alpha-secondary-soft)] text-[color:var(--alpha-text-muted)]',
          progress: potentialProgress,
          progressColor:
            potentialTier === 'High'
              ? 'color-mix(in srgb, var(--highlight-hex) 62%, transparent)'
              : potentialTier === 'Tracked'
                ? 'color-mix(in srgb, var(--highlight-hex) 62%, transparent)'
                : 'color-mix(in srgb, var(--paragraph-hex) 55%, transparent)',
          meta: potentialProjects.length > 0 ? `${highPotentialCount} high potential` : 'Belum ada potential',
        },
      ];
    },
    [airdrops, claimedRewards.length, ongoingCount, priorityCount, totalRealized, weeklyWatchCount]
  );

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className="macos-card hud-panel anim-fade p-5 shadow-none sm:p-6"
    >
      <div className="grid gap-4 auto-rows-fr xl:grid-cols-[minmax(0,1fr)_minmax(0,420px)_minmax(0,420px)] 2xl:grid-cols-[minmax(0,1fr)_minmax(0,420px)_minmax(0,420px)] xl:items-stretch">
        <div className="flex h-full flex-col justify-between">
          <div className="inline-flex items-center gap-2 rounded-full border border-alpha-border bg-[color:var(--alpha-hover-soft)] px-3 py-1 text-[10px] uppercase tracking-[0.18em] alpha-text-muted">
            <Sparkles className="h-3.5 w-3.5 text-[color:var(--alpha-highlight)]" />
            Alpha control
          </div>
          <h1 className="mt-3 text-[2.6rem] font-semibold tracking-[-0.04em] alpha-text sm:text-[3.15rem]">
            Dashboard
          </h1>
          <p className="mt-2 max-w-2xl text-[14px] leading-7 alpha-text-muted">
            Track active projects, deadline, gas fee, dan reward flow dalam satu workspace yang lebih bersih.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-full border border-alpha-border bg-[color:var(--alpha-hover-soft)] px-3 py-1 text-[10px] uppercase tracking-[0.16em] alpha-text-muted">
              {nextUpcoming?.airdrop.projectName ?? "No active lane"}
            </span>
            <span className="rounded-full border border-alpha-border bg-[color:var(--alpha-hover-soft)] px-3 py-1 text-[10px] uppercase tracking-[0.16em] alpha-text-muted">
              {nextUpcoming ? formatCalendarDate(nextUpcoming.date) : "No due date"}
            </span>
          </div>
        </div>

        <CurrencyConverter isDark={isDark} />
        <PriceTracker isDark={isDark} />
      </div>

      <div className="mt-4 grid gap-2.5 sm:grid-cols-2 xl:grid-cols-4">
        {heroStats.map((card, index) => (
          <div
            key={card.label}
            className="hud-panel rounded-[1rem] border border-alpha-border bg-[color:var(--alpha-hover-soft)] px-4 py-3"
            style={{ animationDelay: `${index * 40}ms` }}
          >
            <p className="text-[10px] uppercase tracking-[0.18em] alpha-text-muted">{card.label}</p>
            {'progress' in card ? (
              <>
                <div className="mt-2 flex items-center justify-between gap-3">
                  <p className="text-[1.45rem] font-semibold tracking-tight alpha-text">{card.value}</p>
                  <span
                    className={`rounded-full border px-2 py-0.5 text-[9px] font-mono uppercase tracking-[0.12em] ${card.badgeClass}`}
                  >
                    {card.badge}
                  </span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[color:var(--alpha-hover-soft)] border border-alpha-border/40">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${card.progress}%`, background: card.progressColor }}
                  />
                </div>
                <p className="mt-1 text-[11px] alpha-text-muted">{card.meta}</p>
              </>
            ) : (
              <>
                <p className="mt-2 text-[1.45rem] font-semibold tracking-tight alpha-text">{card.value}</p>
                <p className="mt-1 text-[11px] alpha-text-muted">{card.meta}</p>
              </>
            )}
          </div>
        ))}
        <div
          role="button"
          tabIndex={0}
          onClick={focusUsdInput}
          onKeyDown={handleUsdCardKeyDown}
          className="hud-panel dashboard-usd-card cursor-text rounded-[1rem] border border-alpha-border bg-[color:var(--alpha-hover-soft)] px-4 py-3"
          style={{ animationDelay: `${heroStats.length * 40}ms` }}
        >
          <div className="flex items-center justify-between gap-3">
            <p className="text-[10px] uppercase tracking-[0.18em] alpha-text-muted">USD to IDR</p>
            <span className="rounded-full border border-alpha-border bg-[color:var(--alpha-surface)] px-2 py-0.5 text-[9px] uppercase tracking-[0.12em] alpha-text-muted">
              Live
            </span>
          </div>

          <label className="mt-2 flex h-9 items-center gap-2 rounded-[0.8rem] border border-alpha-border bg-[color:var(--alpha-surface)] px-2.5">
            <span className="text-[11px] font-semibold alpha-text-muted">USD</span>
            <input
              ref={usdInputRef}
              inputMode="decimal"
              value={usdAmount}
              onChange={handleUsdAmountChange}
              onFocus={(event) => event.currentTarget.select()}
              className="min-w-0 flex-1 border-0 bg-transparent p-0 text-right text-[14px] font-semibold tabular-nums alpha-text outline-none"
              aria-label="USD amount"
            />
          </label>

          <p className="mt-2 text-[1.45rem] font-semibold tracking-tight alpha-text">
            {currencyRateLoading && !currencyRate ? 'Loading' : formatIdrAmount(convertedIdr)}
          </p>
          <p className="mt-1 text-[11px] alpha-text-muted">
            {currencyLastUpdated
              ? `${formatIdrAmount(currencyRate?.usdToIdr)} per USD, update ${currencyLastUpdated.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`
              : 'Rate belum siap'}
          </p>
        </div>
      </div>
    </motion.section>
  );
}

/* ---------- PriceTracker Component ---------- */
function PriceTracker({ isDark }: { isDark: boolean }) {
  const { prices, loading, error, lastUpdatedAt } = usePrices(['bitcoin', 'ethereum', 'solana', 'cardano', 'polkadot']);
  const coins = [
    { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', accent: '#ffd803' },
    { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', accent: '#2dd4bf' },
    { id: 'solana', symbol: 'SOL', name: 'Solana', accent: '#2dd4bf' },
    { id: 'cardano', symbol: 'ADA', name: 'Cardano', accent: '#2dd4bf' },
    { id: 'polkadot', symbol: 'DOT', name: 'Polkadot', accent: '#ffd803' },
  ];
  const lastUpdatedLabel = lastUpdatedAt
    ? lastUpdatedAt.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'Feed standby';
  const surfaceClass = isDark ? 'bg-[var(--alpha-surface)]' : 'bg-[var(--alpha-surface)]';
  const priceTextColor = 'var(--alpha-text)';
  const metaTextColor = 'var(--alpha-text-muted)';

  return (
    <section className={`hud-panel relative overflow-hidden rounded-[1.1rem] border p-3 shadow-none h-full ${isDark ? 'border-alpha-border bg-[color:var(--alpha-hover-soft)]' : 'border-alpha-border bg-[color:var(--alpha-hover-soft)]'}`}>
      <span className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,color-mix(in srgb, var(--main-hex) 16%, transparent),transparent_52%)] opacity-50" />
      <div className="relative h-full flex flex-col">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-[0.8rem] border border-alpha-border bg-[color:var(--alpha-surface)] text-[color:var(--alpha-highlight)]">
              <TrendingUpIcon className="h-3 w-3" />
            </div>
            <div>
              <p className="text-[9px] uppercase tracking-[0.2em] alpha-text-muted">Market</p>
              <h3 className="text-[12px] font-semibold leading-none alpha-text">Live prices</h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="rounded-full border border-[color:var(--alpha-highlight-border)] bg-[color:var(--alpha-highlight-soft)] px-1.5 py-0.5 text-[8px] uppercase tracking-[0.18em] text-[color:var(--alpha-highlight)] flex-shrink-0">
              {coins.length} assets
            </span>
            <p className="text-[8px] alpha-text-muted flex-shrink-0">
              {loading ? 'Loading' : lastUpdatedLabel}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="mt-2 flex-1 grid grid-cols-5 gap-1.5">
            {coins.map((coin) => (
              <div key={coin.id} className="min-w-0 rounded-lg border border-alpha-border bg-[color:var(--alpha-surface)] px-2 py-2">
                <div className="h-2 w-8 rounded-full bg-[color:var(--alpha-border)]" />
                <div className="mt-2 h-4 w-10 rounded-full bg-[color:var(--alpha-border)]" />
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-2 flex-1 grid grid-cols-5 gap-1.5">
            {coins.map((coin) => {
              const price = prices[coin.id];
              const change = price?.usd_24h_change;
              const isPositive = (change ?? 0) >= 0;
              const hasPrice = price?.usd != null;

              return (
                <div
                  key={coin.id}
                  className={`relative min-w-0 overflow-hidden rounded-lg border px-2 py-2 ${surfaceClass} border-alpha-border`}
                >
                  <span
                    className="absolute inset-x-0 top-0 h-px"
                    style={{ background: `linear-gradient(90deg, transparent, ${coin.accent}, transparent)` }}
                  />
                  <div className="flex items-center justify-between gap-1">
                    <p className="text-[8px] uppercase tracking-[0.18em] alpha-text-muted">{coin.symbol}</p>
                    <span className="h-1.5 w-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: coin.accent }} />
                  </div>
                  <p
                    className="mt-1 truncate text-[13px] font-semibold leading-none tracking-tight tabular-nums"
                    style={{ color: priceTextColor }}
                    title={hasPrice ? formatUsdPrice(price?.usd) : 'N/A'}
                  >
                    {hasPrice ? formatMarketCardPrice(price?.usd) : 'N/A'}
                  </p>
                  {hasPrice ? (
                    <div className={`mt-1 inline-flex items-center gap-0.5 rounded-full border px-1 py-0.5 text-[7px] font-medium ${
                      isPositive
                        ? 'border-[color:var(--alpha-highlight-border)] bg-[color:var(--alpha-highlight-soft)] text-[color:var(--alpha-highlight)]'
                        : 'border-[var(--alpha-danger-border)] bg-[var(--alpha-danger-soft)] text-[var(--alpha-danger)]'
                    }`}>
                      {isPositive ? <ArrowUpRight className="h-2 w-2" /> : <ArrowDownRight className="h-2 w-2" />}
                      {formatPriceChange(change)}
                    </div>
                  ) : (
                    <p className="mt-1 text-[7px] font-medium" style={{ color: metaTextColor }}>
                      {error ? 'N/A' : 'Wait'}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

function DashboardCalendarPanel({
  selectedDate,
  setSelectedDate,
  calendarMonth,
  setCalendarMonth,
  selectedEntriesCount,
  deadlineKeys,
  calendarDays,
  today,
  isDark,
  embedded = false,
}: {
  selectedDate: Date;
  setSelectedDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
  calendarMonth: Date;
  setCalendarMonth: React.Dispatch<React.SetStateAction<Date | undefined>>;
  selectedEntriesCount: number;
  deadlineKeys: Set<string>;
  calendarDays: { date: Date; inCurrentMonth: boolean }[];
  today: Date;
  isDark: boolean;
  embedded?: boolean;
}) {
  const weekdayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <section className={cn(
      "relative overflow-hidden",
      embedded
        ? "h-full rounded-[1.15rem] border border-alpha-border bg-[color:var(--alpha-hover-soft)] p-4 shadow-none"
        : "macos-card p-4 shadow-none",
      !isDark && !embedded && "bg-[color:var(--alpha-surface-soft)] border-[color:var(--alpha-border)]"
    )}>
      <span className={cn(
        "absolute inset-0 bg-[radial-gradient(circle_at_top_right,color-mix(in srgb, var(--main-hex) 16%, transparent),transparent_46%)] opacity-90",
        embedded && "opacity-55"
      )} />
      <div className="relative">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-alpha-border bg-[color:var(--alpha-surface)] px-3 py-1 text-[10px] uppercase tracking-[0.2em] alpha-text-muted">
              <CalendarDays className="h-3.5 w-3.5 text-[color:var(--alpha-highlight)]" />
              Project calendar
            </div>
            <h3 className="mt-3 text-[16px] font-semibold tracking-tight alpha-text">Deadline board</h3>
            <p className="mt-1.5 max-w-[18rem] text-[12px] leading-5 alpha-text-muted">
              Klik tanggal untuk lihat project aktif dan due date yang harus dikejar.
            </p>
          </div>

          <div className="min-w-[108px] rounded-full border border-alpha-border bg-[color:var(--alpha-surface)] px-3.5 py-2 text-center">
            <p className="text-[10px] uppercase tracking-[0.18em] alpha-text-muted">Focused day</p>
            <p className="mt-0.5 text-[14px] font-semibold alpha-text">{formatCalendarDate(selectedDate)}</p>
          </div>
        </div>

        <div className="mt-4 rounded-[1rem] border border-alpha-border bg-[color:var(--alpha-surface)] p-3.5">
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => {
                const next = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1);
                setCalendarMonth(next);
              }}
              className="dashboard-calendar-nav flex h-9 w-9 items-center justify-center rounded-[0.9rem] border border-alpha-border bg-[color:var(--alpha-hover-soft)] transition-colors hover:bg-[color:var(--alpha-highlight-soft)] hover:text-[color:var(--alpha-highlight)]"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <div className="text-center">
              <p className="text-[15px] font-semibold alpha-text">{getCalendarMonthLabel(calendarMonth)}</p>
              <p className="mt-1 text-[11px] alpha-text-muted">{selectedEntriesCount} project on focus</p>
            </div>

            <button
              type="button"
              onClick={() => {
                const next = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1);
                setCalendarMonth(next);
              }}
              className="dashboard-calendar-nav flex h-9 w-9 items-center justify-center rounded-[0.9rem] border border-alpha-border bg-[color:var(--alpha-hover-soft)] transition-colors hover:bg-[color:var(--alpha-highlight-soft)] hover:text-[color:var(--alpha-highlight)]"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-3.5 grid grid-cols-7 gap-1.5">
            {weekdayLabels.map((label) => (
              <div
                key={label}
                className="flex h-8 items-center justify-center text-[10px] font-medium uppercase tracking-[0.14em] alpha-text-muted"
              >
                {label}
              </div>
            ))}
          </div>

          <div className="mt-2 grid grid-cols-7 gap-1.5">
            {calendarDays.map(({ date, inCurrentMonth }) => {
              const hasDeadline = deadlineKeys.has(date.toDateString());
              const isSelected = isSameCalendarDay(date, selectedDate);
              const isToday = isSameCalendarDay(date, today);

              return (
                <button
                  key={date.toISOString()}
                  type="button"
                  onClick={() => {
                    setSelectedDate(date);
                    setCalendarMonth(new Date(date.getFullYear(), date.getMonth(), 1));
                  }}
                  className={cn(
                    "dashboard-calendar-day flex h-9 w-full items-center justify-center rounded-[0.95rem] border text-[12px] font-medium transition-[background-color,border-color,color] duration-150 sm:h-10",
                    !inCurrentMonth && "is-outside",
                    isToday && !isSelected && "is-today",
                    hasDeadline && !isSelected && "has-deadline",
                    isSelected && "is-selected"
                  )}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function DashboardWorkspacePanel({
  rewards,
  airdrops,
  isDark,
}: {
  rewards: ReturnType<typeof useAirdropRewards>["rewards"];
  airdrops: Airdrop[];
  isDark: boolean;
}) {
  const today = useMemo(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }, []);
  const { t } = useI18n();

  const deadlineEntries = useMemo(
    () =>
      airdrops
        .map((airdrop) => {
          const date = parseProjectDate(airdrop.deadline ?? airdrop.createdAt);
          if (!date) return null;
          return { airdrop, date };
        })
        .filter((entry): entry is DeadlineEntry => Boolean(entry))
        .sort((left, right) => left.date.getTime() - right.date.getTime()),
    [airdrops]
  );

  const [selectedDateOverride, setSelectedDateOverride] = useState<Date | undefined>(undefined);
  const [calendarMonthOverride, setCalendarMonthOverride] = useState<Date | undefined>(undefined);
  const activeSelectedDate = selectedDateOverride ?? today;
  const activeCalendarMonth = calendarMonthOverride ?? today;

  const selectedEntries = useMemo(
    () => deadlineEntries.filter((entry) => isSameCalendarDay(entry.date, activeSelectedDate)),
    [activeSelectedDate, deadlineEntries]
  );

  const deadlineKeys = useMemo(
    () => new Set(deadlineEntries.map((entry) => entry.date.toDateString())),
    [deadlineEntries]
  );

  const calendarDays = useMemo(
    () => getCalendarGrid(activeCalendarMonth),
    [activeCalendarMonth]
  );
  const setSelectedDate: React.Dispatch<React.SetStateAction<Date | undefined>> = (value) => {
    const nextValue = typeof value === 'function' ? value(activeSelectedDate) : value;
    setSelectedDateOverride(nextValue);
  };
  const setCalendarMonth: React.Dispatch<React.SetStateAction<Date | undefined>> = (value) => {
    const nextValue = typeof value === 'function' ? value(activeCalendarMonth) : value;
    setCalendarMonthOverride(nextValue);
  };

  return (
    <div className="space-y-4">
      <Suspense fallback={<RewardPerformancePanelFallback />}>
        <RewardPerformancePanel
          rewards={rewards}
          isDark={isDark}
          title={t("rewardVault.timelineTitle")}
          subtitle={t("rewardVault.timelineSubtitle")}
          compact
          embedded
        />
      </Suspense>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(380px,0.92fr)] 2xl:grid-cols-[minmax(0,1fr)_minmax(420px,0.96fr)]">
        <Suspense fallback={<DashboardPanelFallback className="min-h-[348px]" />}>
          <AirdropNewsPanel isDark={isDark} />
        </Suspense>
        <DashboardCalendarPanel
          selectedDate={activeSelectedDate}
          setSelectedDate={setSelectedDate}
          calendarMonth={activeCalendarMonth}
          setCalendarMonth={setCalendarMonth}
          selectedEntriesCount={selectedEntries.length}
          deadlineKeys={deadlineKeys}
          calendarDays={calendarDays}
          today={today}
          isDark={isDark}
          embedded
        />
      </div>
    </div>
  );
}

/* ---------- MAIN DASHBOARD CONTENT ---------- */
function DashboardContent() {
  const { session } = useAuth();
  const user = session?.user;
  const [airdrops, setAirdrops] = useState<Airdrop[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingAirdrop, setEditingAirdrop] = useState<Airdrop | null>(null);
  const [deletingAirdrop, setDeletingAirdrop] = useState<Airdrop | null>(null);
  const { theme } = useTheme();
  const [logoError, setLogoError] = useState<Record<string, boolean>>({});
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isEligibilityModalOpen, setIsEligibilityModalOpen] = useState(false);
  const { rewards } = useAirdropRewards();

  const isDark = theme === 'dark';

  // UI tokens - Updated to gold theme
  const bg      = 'alpha-bg';
  const text    = 'alpha-text';

  useEffect(() => {
    if (!user) return;
    getAirdropsByUserId(user.id).then((rows) => {
      const normalized = (rows || []).map((airdrop) => ({ ...airdrop, isPriority: Boolean(airdrop.isPriority || airdrop.is_priority) }));
      setAirdrops(normalized);
      setCachedAirdrops(user.id, normalized);
    });
  }, [user]);

  useEffect(() => {
    if (!user || typeof window === 'undefined') return;

    const handleSync = (event: Event) => {
      const detail = (event as CustomEvent<{ userId?: string }>).detail;
      if (detail?.userId && detail.userId !== user.id) return;

      getAirdropsByUserId(user.id).then((rows) => {
        const normalized = (rows || []).map((airdrop) => ({ ...airdrop, isPriority: Boolean(airdrop.isPriority || airdrop.is_priority) }));
        setAirdrops(normalized);
        setCachedAirdrops(user.id, normalized);
      });
    };

    window.addEventListener(AIRDROPS_SYNC_EVENT, handleSync);
    return () => window.removeEventListener(AIRDROPS_SYNC_EVENT, handleSync);
  }, [user]);

  const syncDashboardAirdrops = (nextAirdrops: Airdrop[]) => {
    setAirdrops(nextAirdrops);

    if (user) {
      setCachedAirdrops(user.id, nextAirdrops);
      emitAirdropsSync({ userId: user.id });
    }
  };

  async function handleAddAirdrop(data: Omit<Airdrop, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) {
    if (!user) return;
    await createAirdrop(data, user.id);
    const rows = await getAirdropsByUserId(user.id);
    syncDashboardAirdrops(rows.map((airdrop) => ({ ...airdrop, isPriority: Boolean(airdrop.isPriority || airdrop.is_priority) })));
    setIsAddModalOpen(false);
  }

  const handleEditAirdrop = async (data: Omit<Airdrop, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!editingAirdrop || !user) return;
    await updateAirdrop(editingAirdrop.id, data);
    const rows = await getAirdropsByUserId(user.id);
    syncDashboardAirdrops(rows.map((airdrop) => ({ ...airdrop, isPriority: Boolean(airdrop.isPriority || airdrop.is_priority) })));
    setEditingAirdrop(null);
  };

  const handleDeleteAirdrop = async () => {
    if (!deletingAirdrop) return;
    const { error } = await supabase.from('airdrops').delete().eq('id', deletingAirdrop.id);
    if (error) return console.error(error);
    syncDashboardAirdrops(airdrops.filter(a => a.id !== deletingAirdrop.id));
    setDeletingAirdrop(null);
  };

  // Toggle priority: update DB then refetch canonical list
  const handleAddPriority = async (airdrop: Airdrop) => {
    if (!user) return;
    const current = Boolean(airdrop.isPriority || airdrop.is_priority);
    const newVal = !current;
    const { error } = await supabase.from('airdrops')
      .update({ is_priority: newVal, updated_at: new Date().toISOString() })
      .eq('id', airdrop.id);
    if (error) {
      console.error(error);
      return;
    }
    const rows = await getAirdropsByUserId(user.id);
    syncDashboardAirdrops(rows.map((airdropRow) => ({ ...airdropRow, isPriority: Boolean(airdropRow.isPriority || airdropRow.is_priority) })));
  };

  return (
    <div className={`dashboard-clean min-h-screen flex flex-col transition-colors duration-300 macos-root ${bg} ${text}`}>
      <style>{ANIM_STYLE}</style>

      <main className="flex-1 w-full px-4 py-5 sm:px-6 sm:py-6 lg:px-6">
        <DashboardHero airdrops={airdrops} rewards={rewards} isDark={isDark} />

        <div className="mb-7 mt-6">
          <DashboardWorkspacePanel
            rewards={rewards}
            airdrops={airdrops}
            isDark={isDark}
          />
        </div>

        {/* New Refactored Project Table with Filter */}
        <ProjectTableContainer
          airdrops={airdrops}
          isDark={isDark}
          logoError={logoError}
          setLogoError={setLogoError}
          onEdit={(airdrop) => setEditingAirdrop(airdrop)}
          onDelete={(airdrop) => setDeletingAirdrop(airdrop)}
          onPriority={handleAddPriority}
          onAddNew={() => setIsAddModalOpen(true)}
        />
      </main>

      {/* MODALS */}
      {isAddModalOpen ? (
        <Suspense fallback={null}>
          <AirdropModal
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            onSubmit={handleAddAirdrop}
            mode="add"
            isDark={isDark}
          />
        </Suspense>
      ) : null}
      {editingAirdrop ? (
        <Suspense fallback={null}>
          <AirdropModal
            isOpen={Boolean(editingAirdrop)}
            onClose={() => setEditingAirdrop(null)}
            onSubmit={handleEditAirdrop}
            mode="edit"
            airdrop={editingAirdrop}
            isDark={isDark}
          />
        </Suspense>
      ) : null}
      {deletingAirdrop ? (
        <Suspense fallback={null}>
          <DeleteConfirmModal
            isOpen={Boolean(deletingAirdrop)}
            onClose={() => setDeletingAirdrop(null)}
            onConfirm={handleDeleteAirdrop}
            projectName={deletingAirdrop?.projectName}
            isDark={isDark}
          />
        </Suspense>
      ) : null}

      {isWalletModalOpen ? (
        <Suspense fallback={null}>
          <WalletConnectModal isOpen={isWalletModalOpen} onClose={() => setIsWalletModalOpen(false)} />
        </Suspense>
      ) : null}
      {isEligibilityModalOpen ? (
        <Suspense fallback={null}>
          <EligibilityModal isOpen={isEligibilityModalOpen} onClose={() => setIsEligibilityModalOpen(false)} />
        </Suspense>
      ) : null}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <DashboardLayout disableMonochrome>
      <DashboardContent />
    </DashboardLayout>
  );
}
