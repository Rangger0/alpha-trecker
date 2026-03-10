// (file lengkap dengan perbaikan dropdown clipping)
import { Suspense, lazy, useEffect, useMemo, useState, type ChangeEvent, type MouseEvent } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { supabase } from "@/lib/supabase";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit2,
  Trash2,
  CheckCircle2,
  Circle,
  ExternalLink,
  LayoutGrid,
  List,
  Sparkles,
  Wallet,
  TrendingUp as TrendingUpIcon,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { usePrices } from "@/hooks/use-prices";
import { useAirdropRewards } from "@/hooks/use-airdrop-rewards";
import { emitAirdropsSync, setCachedAirdrops } from "@/lib/airdrops-store";
import type { Airdrop, AirdropType, AirdropStatus } from "@/types";
import { createAirdrop, getAirdropsByUserId } from "@/services/database";

const RewardPerformancePanel = lazy(async () => {
  const module = await import("@/components/rewards/RewardPerformancePanel");
  return { default: module.RewardPerformancePanel };
});

const AirdropNewsPanel = lazy(async () => {
  const module = await import("@/components/dashboard/AirdropNewsPanel");
  return { default: module.AirdropNewsPanel };
});

const GasFeesPanel = lazy(async () => {
  const module = await import("@/components/dashboard/GasFeesPanel");
  return { default: module.GasFeesPanel };
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

/* ---------- constants ---------- */
const AIRDROP_TYPES: AirdropType[] = [
  'Testnet', 'AI', 'Quest', 'Daily', 'Daily Quest',
  'Retroactive', 'Waitlist', 'Depin', 'NFT', 'Domain Name',
  'Deploy SC', 'DeFi', 'Deploy NFT'
];

const AIRDROP_STATUSES: AirdropStatus[] = ['Planning', 'Ongoing', 'Done', 'Dropped'];

const TYPE_COLORS: Record<string, { dark: string; light: string }> = {
  'Testnet': { dark: 'bg-[var(--alpha-violet-soft)] text-[var(--alpha-violet)] border-[var(--alpha-violet-border)]', light: 'bg-[var(--alpha-violet-soft)] text-[var(--alpha-violet)] border-[var(--alpha-violet-border)]' },
  'AI': { dark: 'bg-[var(--alpha-signal-soft)] text-[var(--alpha-signal)] border-[var(--alpha-signal-border)]', light: 'bg-[var(--alpha-signal-soft)] text-[var(--alpha-signal)] border-[var(--alpha-signal-border)]' },
  'Quest': { dark: 'bg-gold/10 text-gold border-gold/20', light: 'bg-gold/10 text-gold border-gold/30' },
  'Daily': { dark: 'bg-[var(--alpha-warning-soft)] text-[var(--alpha-warning)] border-[var(--alpha-warning-border)]', light: 'bg-[var(--alpha-warning-soft)] text-[var(--alpha-warning)] border-[var(--alpha-warning-border)]' },
  'Daily Quest': { dark: 'bg-[var(--alpha-warning-soft)] text-[var(--alpha-warning)] border-[var(--alpha-warning-border)]', light: 'bg-[var(--alpha-warning-soft)] text-[var(--alpha-warning)] border-[var(--alpha-warning-border)]' },
  'Retroactive': { dark: 'bg-[var(--alpha-violet-soft)] text-[var(--alpha-violet)] border-[var(--alpha-violet-border)]', light: 'bg-[var(--alpha-violet-soft)] text-[var(--alpha-violet)] border-[var(--alpha-violet-border)]' },
  'Waitlist': { dark: 'bg-[var(--alpha-signal-soft)] text-[var(--alpha-signal)] border-[var(--alpha-signal-border)]', light: 'bg-[var(--alpha-signal-soft)] text-[var(--alpha-signal)] border-[var(--alpha-signal-border)]' },
  'Depin': { dark: 'bg-[var(--alpha-signal-soft)] text-[var(--alpha-signal)] border-[var(--alpha-signal-border)]', light: 'bg-[var(--alpha-signal-soft)] text-[var(--alpha-signal)] border-[var(--alpha-signal-border)]' },
  'NFT': { dark: 'bg-[var(--alpha-danger-soft)] text-[var(--alpha-danger)] border-[var(--alpha-danger-border)]', light: 'bg-[var(--alpha-danger-soft)] text-[var(--alpha-danger)] border-[var(--alpha-danger-border)]' },
  'Domain Name': { dark: 'bg-[var(--alpha-danger-soft)] text-[var(--alpha-danger)] border-[var(--alpha-danger-border)]', light: 'bg-[var(--alpha-danger-soft)] text-[var(--alpha-danger)] border-[var(--alpha-danger-border)]' },
  'Deploy SC': { dark: 'bg-gold/10 text-gold border-gold/20', light: 'bg-gold/10 text-gold border-gold/30' },
  'DeFi': { dark: 'bg-gold/10 text-gold border-gold/20', light: 'bg-gold/10 text-gold border-gold/30' },
  'Deploy NFT': { dark: 'bg-[var(--alpha-danger-soft)] text-[var(--alpha-danger)] border-[var(--alpha-danger-border)]', light: 'bg-[var(--alpha-danger-soft)] text-[var(--alpha-danger)] border-[var(--alpha-danger-border)]' },
};

const STATUS_COLORS: Record<string, { dark: string; light: string }> = {
  'Planning': { dark: 'bg-light-muted/10 text-light-muted border-light-muted/20', light: 'bg-light-muted/10 text-light-muted border-light-muted/30' },
  'Ongoing': { dark: 'bg-[var(--alpha-signal-soft)] text-[var(--alpha-signal)] border-[var(--alpha-signal-border)]', light: 'bg-[var(--alpha-signal-soft)] text-[var(--alpha-signal)] border-[var(--alpha-signal-border)]' },
  'Done': { dark: 'bg-gold/10 text-gold border-gold/20', light: 'bg-gold/10 text-gold border-gold/30' },
  'Dropped': { dark: 'bg-[var(--alpha-danger-soft)] text-[var(--alpha-danger)] border-[var(--alpha-danger-border)]', light: 'bg-[var(--alpha-danger-soft)] text-[var(--alpha-danger)] border-[var(--alpha-danger-border)]' },
};

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
const formatWallet = (address: string) => {
  if (!address) return '';
  if (address.length <= 12) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

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

const twitterAvatarUrl = (username: string) =>
  `https://unavatar.io/twitter/${username.replace('@', '')}`;

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

const formatProjectDate = (value?: string) => {
  if (!value) return '--';

  const normalized = /^\d{4}-\d{2}-\d{2}$/.test(value) ? `${value}T00:00:00` : value;
  const parsed = new Date(normalized);

  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
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
  const heroStats = useMemo(
    () => [
      {
        label: "Tracked",
        value: airdrops.length,
        meta: `${ongoingCount} ongoing`,
      },
      {
        label: "Priority",
        value: priorityCount,
        meta: priorityCount > 0 ? "Pinned projects" : "No pinned project",
      },
      {
        label: "Claimed",
        value: claimedRewards.length,
        meta: claimedRewards.length > 0 ? `${formatUsdPrice(totalRealized)} realized` : "Reward vault idle",
      },
      {
        label: "This week",
        value: weeklyWatchCount,
        meta: weeklyWatchCount > 0 ? "Deadline within 7 days" : "No urgent deadline",
      },
    ],
    [airdrops.length, claimedRewards.length, ongoingCount, priorityCount, totalRealized, weeklyWatchCount]
  );

  return (
    <section className="macos-card anim-fade p-5 shadow-none sm:p-6">
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_640px] 2xl:grid-cols-[minmax(0,1fr)_700px] xl:items-start">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-alpha-border bg-[color:var(--alpha-hover-soft)] px-3 py-1 text-[10px] uppercase tracking-[0.18em] alpha-text-muted">
            <Sparkles className="h-3.5 w-3.5 text-gold" />
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

        <PriceTracker isDark={isDark} />
      </div>

      <div className="mt-4 grid gap-2.5 sm:grid-cols-2 xl:grid-cols-4">
        {heroStats.map((card, index) => (
          <div
            key={card.label}
            className="rounded-[1rem] border border-alpha-border bg-[color:var(--alpha-hover-soft)] px-4 py-3"
            style={{ animationDelay: `${index * 40}ms` }}
          >
            <p className="text-[10px] uppercase tracking-[0.18em] alpha-text-muted">{card.label}</p>
            <p className="mt-2 text-[1.45rem] font-semibold tracking-tight alpha-text">{card.value}</p>
            <p className="mt-1 text-[11px] alpha-text-muted">{card.meta}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------- PriceTracker Component ---------- */
function PriceTracker({ isDark }: { isDark: boolean }) {
  const { prices, loading, error, lastUpdatedAt } = usePrices(['bitcoin', 'ethereum', 'solana', 'cardano', 'polkadot']);
  const coins = [
    { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', accent: '#F7931A' },
    { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', accent: '#627EEA' },
    { id: 'solana', symbol: 'SOL', name: 'Solana', accent: '#14F195' },
    { id: 'cardano', symbol: 'ADA', name: 'Cardano', accent: '#2A6AF7' },
    { id: 'polkadot', symbol: 'DOT', name: 'Polkadot', accent: '#E6007A' },
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
    <section className={`relative overflow-hidden rounded-[1.1rem] border p-4 shadow-none ${isDark ? 'border-alpha-border bg-[color:var(--alpha-hover-soft)]' : 'border-alpha-border bg-[color:var(--alpha-hover-soft)]'}`}>
      <span className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(184,207,206,0.16),transparent_52%)] opacity-50" />
      <div className="relative">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-[0.95rem] border border-alpha-border bg-[color:var(--alpha-surface)] text-gold">
              <TrendingUpIcon className="h-3.5 w-3.5" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] alpha-text-muted">Market snapshot</p>
              <h3 className="mt-0.5 text-[14px] font-semibold leading-none alpha-text">Live prices</h3>
              <p className="mt-1 text-[10px] alpha-text-muted">
                {lastUpdatedAt ? `Updated ${lastUpdatedLabel}` : lastUpdatedLabel}
              </p>
            </div>
          </div>

          <span className="rounded-full border border-gold/20 bg-gold/10 px-2.5 py-1 text-[9px] uppercase tracking-[0.18em] text-gold">
            {coins.length} assets
          </span>
        </div>

        {loading ? (
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-5">
            {coins.map((coin) => (
              <div key={coin.id} className="min-w-0 rounded-[0.95rem] border border-alpha-border bg-[color:var(--alpha-surface)] px-2.5 py-3 sm:px-3">
                <div className="h-3 w-10 rounded-full bg-[color:var(--alpha-border)]" />
                <div className="mt-3 h-4 w-16 rounded-full bg-[color:var(--alpha-border)]" />
                <div className="mt-2 h-3 w-12 rounded-full bg-[color:var(--alpha-border)]" />
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-5">
            {coins.map((coin) => {
              const price = prices[coin.id];
              const change = price?.usd_24h_change;
              const isPositive = (change ?? 0) >= 0;
              const hasPrice = price?.usd != null;

              return (
                <div
                  key={coin.id}
                  className={`relative min-w-0 overflow-hidden rounded-[0.95rem] border px-2.5 py-3 sm:px-3 ${surfaceClass} border-alpha-border`}
                >
                  <span
                    className="absolute inset-x-0 top-0 h-px"
                    style={{ background: `linear-gradient(90deg, transparent, ${coin.accent}, transparent)` }}
                  />
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-[9px] uppercase tracking-[0.18em] alpha-text-muted">{coin.symbol}</p>
                      <p className="mt-0.5 text-[9px] alpha-text-muted">{coin.name}</p>
                    </div>
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: coin.accent }} />
                  </div>
                  <p
                    className="mt-3 truncate text-[15px] font-semibold leading-none tracking-tight tabular-nums"
                    style={{ color: priceTextColor }}
                    title={hasPrice ? formatUsdPrice(price?.usd) : 'N/A'}
                  >
                    {hasPrice ? formatMarketCardPrice(price?.usd) : 'N/A'}
                  </p>
                  {hasPrice ? (
                    <div className={`mt-1.5 inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[8px] font-medium ${
                      isPositive
                        ? 'border-gold/20 bg-gold/10 text-gold'
                        : 'border-[var(--alpha-danger-border)] bg-[var(--alpha-danger-soft)] text-[var(--alpha-danger)]'
                    }`}>
                      {isPositive ? <ArrowUpRight className="h-2.5 w-2.5" /> : <ArrowDownRight className="h-2.5 w-2.5" />}
                      {formatPriceChange(change)}
                    </div>
                  ) : (
                    <p className="mt-1.5 text-[9px] font-medium" style={{ color: metaTextColor }}>
                      {error ? 'Feed unavailable' : 'Waiting for update'}
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
  embedded?: boolean;
}) {
  const weekdayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <section className={cn(
      "relative overflow-hidden",
      embedded
        ? "h-full rounded-[1.15rem] border border-alpha-border bg-[color:var(--alpha-hover-soft)] p-3.5 shadow-none"
        : "macos-card p-4 shadow-none"
    )}>
      <span className={cn(
        "absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(184,207,206,0.14),transparent_46%)] opacity-90",
        embedded && "opacity-55"
      )} />
      <div className="relative">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-alpha-border bg-[color:var(--alpha-surface)] px-3 py-1 text-[10px] uppercase tracking-[0.2em] alpha-text-muted">
              <CalendarDays className="h-3.5 w-3.5 text-gold" />
              Project calendar
            </div>
            <h3 className="mt-3 text-[16px] font-semibold tracking-tight alpha-text">Deadline board</h3>
            <p className="mt-1.5 max-w-[18rem] text-[12px] leading-5 alpha-text-muted">
              Klik tanggal untuk lihat project aktif dan due date yang harus dikejar.
            </p>
          </div>

          <div className="rounded-full border border-alpha-border bg-[color:var(--alpha-surface)] px-3 py-1.5 text-right">
            <p className="text-[10px] uppercase tracking-[0.18em] alpha-text-muted">Focused day</p>
            <p className="mt-0.5 text-[13px] font-semibold alpha-text">{formatCalendarDate(selectedDate)}</p>
          </div>
        </div>

        <div className="mt-4 rounded-[1rem] border border-alpha-border bg-[color:var(--alpha-surface)] p-3">
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => {
                const next = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1);
                setCalendarMonth(next);
              }}
              className="flex h-8 w-8 items-center justify-center rounded-[0.9rem] border border-alpha-border bg-[color:var(--alpha-hover-soft)] transition-colors hover:bg-gold/10 hover:text-gold"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <div className="text-center">
              <p className="text-[14px] font-semibold alpha-text">{getCalendarMonthLabel(calendarMonth)}</p>
              <p className="mt-1 text-[10px] alpha-text-muted">{selectedEntriesCount} project on focus</p>
            </div>

            <button
              type="button"
              onClick={() => {
                const next = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1);
                setCalendarMonth(next);
              }}
              className="flex h-8 w-8 items-center justify-center rounded-[0.9rem] border border-alpha-border bg-[color:var(--alpha-hover-soft)] transition-colors hover:bg-gold/10 hover:text-gold"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-3 grid grid-cols-7 gap-1">
            {weekdayLabels.map((label) => (
              <div
                key={label}
                className="flex h-7 items-center justify-center text-[10px] font-medium uppercase tracking-[0.14em] alpha-text-muted"
              >
                {label}
              </div>
            ))}
          </div>

          <div className="mt-1.5 grid grid-cols-7 gap-1">
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
                    "flex h-8 w-full items-center justify-center rounded-[0.85rem] border text-[11px] font-medium transition-[background-color,border-color,color] duration-150 sm:h-9",
                    inCurrentMonth ? "opacity-100" : "opacity-45",
                    isSelected
                      ? "border-gold bg-gold text-[color:var(--alpha-accent-contrast)]"
                      : "border-transparent alpha-text hover:bg-[color:var(--alpha-hover-soft)]",
                    isToday && !isSelected && "border-alpha-border bg-[color:var(--alpha-hover-soft)]",
                    hasDeadline && !isSelected && "border border-gold/25 bg-gold/10 text-gold hover:bg-gold/15"
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

  const nextUpcoming = useMemo(
    () => deadlineEntries.find((entry) => entry.date.getTime() >= today.getTime()) ?? deadlineEntries[0] ?? null,
    [deadlineEntries, today]
  );

  const [selectedDateOverride, setSelectedDateOverride] = useState<Date | undefined>(undefined);
  const [calendarMonthOverride, setCalendarMonthOverride] = useState<Date | undefined>(undefined);
  const activeSelectedDate = selectedDateOverride ?? nextUpcoming?.date ?? today;
  const activeCalendarMonth = calendarMonthOverride ?? nextUpcoming?.date ?? today;

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
          title="Payout timeline"
          subtitle="Reward history from your claimed airdrops. Record income in Reward Vault and this panel updates automatically."
          compact
          embedded
        />
      </Suspense>

      <div className="grid gap-4 xl:grid-cols-[360px_minmax(0,1fr)_280px]">
        <Suspense fallback={<DashboardPanelFallback className="min-h-[348px]" />}>
          <AirdropNewsPanel isDark={isDark} />
        </Suspense>
        <Suspense fallback={<DashboardPanelFallback className="min-h-[348px]" />}>
          <GasFeesPanel />
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
          embedded
        />
      </div>
    </div>
  );
}

/* ---------- ProjectAvatar & TableRow/AirdropCard usage ---------- */

function ProjectAvatar({
  airdrop, size = 'md', logoError, setLogoError,
}: {
  airdrop: Airdrop; size?: 'sm' | 'md';
  logoError: Record<string, boolean>;
  setLogoError: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
}) {
  const dim = size === 'sm' ? 'w-10 h-10' : 'w-12 h-12';
  const textSize = size === 'sm' ? 'text-base' : 'text-xl';

  const [twitterError, setTwitterError] = useState(false);
  const hasLogoError = (logoError && logoError[airdrop.id]) || !airdrop.projectLogo;
  const twitterUser = airdrop.twitterUsername?.replace('@', '');
  const showTwitter = hasLogoError && twitterUser && !twitterError;

  return (
    <div className={`${dim} rounded-[0.95rem] flex-shrink-0 overflow-hidden border flex items-center justify-center transition-transform duration-200 group-hover:scale-[1.02]`}
      style={{ background: 'var(--alpha-surface)', borderColor: 'var(--alpha-border)' }}>
      {!hasLogoError ? (
        <img
          src={airdrop.projectLogo!}
          alt={airdrop.projectName}
          className="w-full h-full object-cover"
          onError={() => setLogoError(prev => ({ ...prev, [airdrop.id]: true }))}
        />
      ) : showTwitter ? (
        <img
          src={twitterAvatarUrl(twitterUser!)}
          alt={airdrop.projectName}
          className="w-full h-full object-cover"
          onError={() => setTwitterError(true)}
        />
      ) : (
        <span className={`${textSize} font-bold alpha-text`}>
          {airdrop.projectName[0].toUpperCase()}
        </span>
      )}
    </div>
  );
}

/* TableRow (list) - controlled by parent openMenuId */
function TableRow({
  airdrop, index, isDark, onEdit, onDelete, onAddPriority, logoError, setLogoError
}: {
  airdrop: Airdrop; index: number; isDark: boolean;
  onEdit: () => void; onDelete: () => void; onAddPriority: () => void;
  logoError: Record<string, boolean>;
  setLogoError: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
}) {
  const getTypeColor   = (t: string) => isDark ? TYPE_COLORS[t]?.dark   || TYPE_COLORS['Quest'].dark   : TYPE_COLORS[t]?.light   || TYPE_COLORS['Quest'].light;
  const getStatusColor = (s: string) => isDark ? STATUS_COLORS[s]?.dark || STATUS_COLORS['Planning'].dark : STATUS_COLORS[s]?.light || STATUS_COLORS['Planning'].light;

  return (
    <tr className={`border-b transition-colors duration-150 group anim-card ${isDark ? 'border-alpha-border hover:bg-[color:var(--alpha-hover-soft)]' : 'border-alpha-border hover:bg-[color:var(--alpha-hover-soft)]'}`}
      style={{ animationDelay: `${index * 40}ms` }}>
      <td className="px-4 py-4">
        <span className="font-mono text-sm alpha-text-muted">{index + 1}</span>
      </td>

      {/* Name with Avatar */}
      <td className="px-4 py-4">
          <div className="flex items-center gap-3">
            <ProjectAvatar airdrop={airdrop} size="sm" logoError={logoError} setLogoError={setLogoError} />
            <div>
                <p className="text-[14px] font-semibold alpha-text">{airdrop.projectName}</p>
              {airdrop.twitterUsername && (
                <p className="text-xs font-mono alpha-text-muted">@{airdrop.twitterUsername.replace('@', '')}</p>
              )}
              <p className="mt-1 flex items-center gap-1 text-[11px] font-mono alpha-text-muted">
                <CalendarDays className="h-3 w-3" />
                {formatProjectDate(airdrop.deadline ?? airdrop.createdAt)}
              </p>
            </div>
          </div>
      </td>

      <td className="px-4 py-4">
        <Badge variant="outline" className={`font-mono text-xs ${getTypeColor(airdrop.type)}`}>{airdrop.type}</Badge>
      </td>

      <td className="px-4 py-4">
        {airdrop.walletAddress ? (
          <div className="flex w-fit items-center gap-2 rounded-[0.9rem] border border-gold/20 bg-gold/10 px-3 py-1.5 text-gold">
            <Wallet className="w-3.5 h-3.5" />
            <span className="font-mono text-xs">{formatWallet(airdrop.walletAddress)}</span>
          </div>
        ) : (
          <span className="font-mono text-xs px-3 py-1.5 rounded-[0.9rem] border border-alpha-border bg-[color:var(--alpha-hover-soft)] alpha-text-muted">No address</span>
        )}
      </td>

      <td className="px-4 py-4">
        {airdrop.platformLink ? (
          <a href={airdrop.platformLink} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs transition-colors duration-150 hover:underline text-gold hover:text-gold-hover">
            <ExternalLink className="w-3.5 h-3.5" />
            {airdrop.platformLink.slice(0, 25)}...
          </a>
        ) : <span className="font-mono text-xs alpha-text-muted">-</span>}
      </td>

      <td className="px-4 py-4">
        <Badge variant="outline" className={`font-mono text-xs ${getStatusColor(airdrop.status)}`}>{airdrop.status}</Badge>
      </td>

      {/* Actions */}
      <td className="px-4 py-4">
        <div className="flex items-center gap-2">
          {/* Add Priority */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onAddPriority()}
            className={`h-8 rounded-[0.9rem] border px-3 font-mono text-xs transition-[border-color,background-color,color] duration-150 ${isDark ? 'border-alpha-border bg-[color:var(--alpha-surface)] alpha-text-muted hover:border-gold/25 hover:bg-gold/10 hover:text-gold' : 'border-alpha-border bg-[color:var(--alpha-surface)] alpha-text-muted hover:border-gold/25 hover:bg-gold/10 hover:text-gold'}`}
          >
            <Star className="w-3 h-3 mr-1" />
            Priority
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e: MouseEvent) => e.stopPropagation()}
                className="h-8 w-8 rounded-[0.9rem] border border-transparent bg-[color:var(--alpha-surface)] transition-[background-color,color,border-color] duration-150 alpha-text-muted hover:border-gold/20 hover:bg-gold/10 hover:text-gold"
              >
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              sideOffset={6}
              className="macos-popover min-w-[9rem] font-mono"
              style={{
                borderColor: 'var(--alpha-border)',
                background: 'var(--alpha-panel)',
                color: 'var(--alpha-text)',
                zIndex: 9999,
              }}
            >
              <DropdownMenuItem onSelect={() => onEdit()} className="gap-2 alpha-text hover:text-gold">
                <Edit2 className="h-4 w-4" />
                EDIT
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => onDelete()} variant="destructive" className="gap-2">
                <Trash2 className="h-4 w-4" />
                DELETE
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </td>
    </tr>
  );
}

/* AirdropCardInline (grid) - using macos-card */
interface AirdropCardInlineProps {
  airdrop: Airdrop;
  index: number;
  onEdit: () => void;
  onDelete: () => void;
  onToggleTask: (airdropId: string, taskId: string) => void;
  onAddPriority: () => void;
  getProgress: (airdrop: Airdrop) => number;
  logoError: Record<string, boolean>;
  setLogoError: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  isMenuOpen: boolean;
  onMenuToggle: (event: MouseEvent) => void;
}

function AirdropCardInline({
  airdrop, index, onEdit, onDelete, onToggleTask, onAddPriority,
  getProgress, logoError, setLogoError, isMenuOpen, onMenuToggle,
}: AirdropCardInlineProps) {
  const progress = getProgress(airdrop);
  const completedTasks = airdrop.tasks.filter((task) => task.completed).length;

  return (
    <div className="relative rounded-[1.1rem] p-4 macos-card macos-card-hover group anim-card shadow-none" style={{ animationDelay: `${index * 50}ms` }}>
      <div className="relative flex flex-col h-full">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
              <ProjectAvatar airdrop={airdrop} size="md" logoError={logoError} setLogoError={setLogoError} />
            <div className="flex-1 min-w-0">
              <h3 className="truncate text-[15px] font-semibold alpha-text">{airdrop.projectName}</h3>
              <div className="mt-1.5 flex items-center gap-2 flex-wrap">
                <Badge variant="outline" className="font-mono text-xs">{airdrop.type}</Badge>
                <Badge variant="outline" className="font-mono text-xs">{airdrop.status}</Badge>
              </div>
            </div>
          </div>

          <div className="relative">
            <Button variant="ghost" size="icon" onClick={(e: MouseEvent) => { e.stopPropagation(); onMenuToggle(e); }}
              className="flex-shrink-0 rounded-[0.9rem] border border-alpha-border bg-[color:var(--alpha-surface)] transition-[border-color,background-color,color] duration-150 alpha-text-muted hover:border-gold/20 hover:bg-gold/10 hover:text-gold" >
              <MoreVertical className="h-4 w-4" />
            </Button>
            {isMenuOpen && (
              <div className="macos-popover absolute right-0 top-full mt-2 w-36 z-50" onClick={(e: MouseEvent) => e.stopPropagation()} style={{ borderColor: 'var(--alpha-border)', background: 'var(--alpha-panel)', color: 'var(--alpha-text)', zIndex: 9999 }}>
                <button onClick={(e: MouseEvent) => { e.stopPropagation(); onEdit(); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm font-mono text-left alpha-text hover:text-gold">
                  <Edit2 className="h-4 w-4" />EDIT
                </button>
                <button onClick={(e: MouseEvent) => { e.stopPropagation(); onDelete(); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm font-mono text-left text-[var(--alpha-danger)]">
                  <Trash2 className="h-4 w-4" />DELETE
                </button>
              </div>
            )}
          </div>
        </div>

          <div className="mb-4">
            <div className="mb-2 flex items-center justify-between text-xs font-mono alpha-text-muted">
            <span>PROGRESS_{progress}%</span>
            <span className="text-gold">[{completedTasks}/{airdrop.tasks.length}]</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-[color:var(--alpha-hover-soft)]">
            <div className={`h-full rounded-full transition-[width] duration-500 ease-out bg-gold`} style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Tasks preview */}
        {airdrop.tasks?.length > 0 && (
          <div className="mb-4 flex-1 space-y-2.5">
            {airdrop.tasks.slice(0, 3).map((task) => (
              <div key={task.id} className="flex items-center gap-2 cursor-pointer" onClick={() => onToggleTask(airdrop.id, task.id)}>
                {task.completed
                  ? <CheckCircle2 className={`h-4 w-4 flex-shrink-0 text-gold`} />
                  : <Circle className={`h-4 w-4 flex-shrink-0 alpha-text-muted`} />
                }
                <span className={`truncate text-[12px] ${task.completed ? 'line-through alpha-text-muted' : 'alpha-text'}`}>{task.title}</span>
              </div>
            ))}
            {airdrop.tasks.length > 3 && (
              <p className="text-[12px] alpha-text-muted">+{airdrop.tasks.length - 3} more...</p>
            )}
          </div>
        )}

        <div className="mt-auto flex items-center gap-2 border-t border-alpha-border pt-3">
          {airdrop.platformLink && (
            <a href={airdrop.platformLink} target="_blank" rel="noopener noreferrer"
              className="rounded-[0.85rem] border border-alpha-border bg-[color:var(--alpha-surface)] p-1.5 transition-[border-color,background-color,color] duration-150 alpha-text hover:border-gold/25 hover:bg-gold/10 hover:text-gold">
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
          {airdrop.twitterUsername && (
            <a href={`https://twitter.com/${airdrop.twitterUsername.replace('@','')}`} target="_blank" rel="noopener noreferrer"
              className="rounded-[0.85rem] border border-alpha-border bg-[color:var(--alpha-surface)] p-1.5 transition-[border-color,background-color,color] duration-150 alpha-text hover:border-gold/25 hover:bg-gold/10 hover:text-gold">
              <svg style={{width:14,height:14}} viewBox="0 0 24 24"><path fill="currentColor" d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
          )}

          <button
            onClick={() => onAddPriority()}
            className={`ml-auto flex items-center gap-1 rounded-[0.85rem] border px-2.5 py-1 text-xs font-mono transition-[border-color,background-color,color] duration-150 ${
              airdrop.isPriority
                ? 'bg-gold text-[color:var(--alpha-accent-contrast)] border-gold' 
                : 'bg-[color:var(--alpha-surface)] alpha-text border-alpha-border hover:border-gold/25 hover:bg-gold/10'
            }`}
          >
            <Star className={`h-3 w-3`} />
            {airdrop.isPriority ? 'Priority' : '+ Priority'}
          </button>

          <div className="flex items-center gap-1 text-xs font-mono alpha-text-muted">
            <CalendarDays className="h-3 w-3" />
            <span>{formatProjectDate(airdrop.deadline ?? airdrop.createdAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- MAIN DASHBOARD CONTENT ---------- */
function DashboardContent() {
  const { session } = useAuth();
  const user = session?.user;
  const [airdrops, setAirdrops] = useState<Airdrop[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<AirdropType | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<AirdropStatus | 'all'>('all');
  const [sortBy] = useState<'newest' | 'progress'>('newest');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingAirdrop, setEditingAirdrop] = useState<Airdrop | null>(null);
  const [deletingAirdrop, setDeletingAirdrop] = useState<Airdrop | null>(null);
  const [priorityAirdrop, setPriorityAirdrop] = useState<Airdrop | null>(null);
  const { theme } = useTheme();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [logoError, setLogoError] = useState<Record<string, boolean>>({});
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isEligibilityModalOpen, setIsEligibilityModalOpen] = useState(false);
  const { rewards } = useAirdropRewards();

  const isDark = theme === 'dark';

  // UI tokens - Updated to gold theme
  const bg      = 'alpha-bg';
  const text    = 'alpha-text';

  const filteredAirdrops = useMemo(() => {
    let result = [...airdrops];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(a =>
        a.projectName.toLowerCase().includes(q) ||
        (a.twitterUsername || '').toLowerCase().includes(q) ||
        (a.walletAddress || '').toLowerCase().includes(q)
      );
    }
    if (typeFilter   !== 'all') result = result.filter(a => a.type   === typeFilter);
    if (statusFilter !== 'all') result = result.filter(a => a.status === statusFilter);
    if (sortBy === 'newest') result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return result;
  }, [airdrops, searchQuery, typeFilter, statusFilter, sortBy]);

  useEffect(() => {
    const close = () => setOpenMenuId(null);
    if (openMenuId) { document.addEventListener('click', close); return () => document.removeEventListener('click', close); }
  }, [openMenuId]);

  useEffect(() => {
    if (!user) return;
    getAirdropsByUserId(user.id).then((rows) => {
      const normalized = (rows || []).map((airdrop) => ({ ...airdrop, isPriority: Boolean(airdrop.isPriority || airdrop.is_priority) }));
      setAirdrops(normalized);
      setCachedAirdrops(user.id, normalized);
    });
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
    const { error } = await supabase.from('airdrops').update({
      project_name: data.projectName, project_logo: data.projectLogo,
      type: data.type, status: data.status, platform_link: data.platformLink,
      twitter_username: data.twitterUsername, wallet_address: data.walletAddress,
      notes: data.notes, tasks: data.tasks || [], priority: data.priority,
      deadline: data.deadline, is_priority: data.isPriority,
      updated_at: new Date().toISOString(),
    }).eq('id', editingAirdrop.id);
    if (error) return console.error(error);
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

  const handleToggleTask = async (airdropId: string, taskId: string) => {
    const airdrop = airdrops.find(a => a.id === airdropId);
    if (!airdrop) return;
    const updatedTasks = airdrop.tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t);
    const { error } = await supabase.from('airdrops').update({ tasks: updatedTasks }).eq('id', airdropId);
    if (error) return console.error(error);
    syncDashboardAirdrops(airdrops.map(a => a.id === airdropId ? { ...a, tasks: updatedTasks } : a));
  };

  const getProgress = (airdrop: Airdrop) => {
    if (!airdrop.tasks || !airdrop.tasks.length) return 0;
    return Math.round((airdrop.tasks.filter((task) => task.completed).length / airdrop.tasks.length) * 100);
  };

  return (
    <div className={`dashboard-clean min-h-screen flex flex-col transition-colors duration-300 macos-root ${bg} ${text}`}>
      <style>{ANIM_STYLE}</style>

      <main className="flex-1 w-full px-5 py-5 sm:px-6 sm:py-6 lg:px-7">
        <DashboardHero airdrops={airdrops} rewards={rewards} isDark={isDark} />

        <div className="mb-7 mt-6">
          <DashboardWorkspacePanel
            rewards={rewards}
            airdrops={airdrops}
            isDark={isDark}
          />
        </div>

        {/* Filters - use macos-card */}
        <div className="mb-3 flex items-center justify-between px-1">
          <div className="inline-flex items-center gap-2 rounded-full border border-alpha-border bg-[color:var(--alpha-hover-soft)] px-3 py-1 text-[10px] uppercase tracking-[0.2em] alpha-text-muted">
            <Filter className="h-3.5 w-3.5 text-gold" />
            Project radar
          </div>
          <span className="rounded-full border border-alpha-border bg-[color:var(--alpha-hover-soft)] px-3 py-1 text-[10px] uppercase tracking-[0.16em] alpha-text-muted">
            {filteredAirdrops.length} visible
          </span>
        </div>

        <div className="mb-6 anim-fade" style={{ animationDelay: '200ms' }}>
          <div className="macos-card p-4 shadow-none">
            <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
              <label
                className={`flex h-11 flex-1 items-center gap-3 rounded-[1rem] border border-alpha-border px-4 ${
                  isDark ? 'bg-[color:var(--alpha-surface-soft)]' : 'bg-[color:var(--alpha-surface)]'
                }`}
              >
                <Search className="h-4 w-4 shrink-0 alpha-text-muted" />
                <Input
                  placeholder={isDark ? 'search projects...' : 'Search projects...'}
                  value={searchQuery}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                  className={`h-auto border-0 bg-transparent p-0 font-mono shadow-none focus-visible:ring-0 ${
                    isDark
                      ? 'alpha-text placeholder:text-[color:var(--alpha-text-muted)]'
                      : 'alpha-text placeholder:text-[color:var(--alpha-text-muted)]'
                  }`}
                />
              </label>

              <div className="flex flex-wrap gap-2.5 items-center xl:justify-end">
                <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as AirdropType | 'all')}>
                    <SelectTrigger className={`h-11 min-w-[160px] rounded-[1rem] border-alpha-border ${
                      isDark ? 'bg-[color:var(--alpha-surface-soft)] alpha-text' : 'bg-[color:var(--alpha-surface)] alpha-text'
                    }`}>
                    <span className="flex min-w-0 items-center gap-2.5">
                      <Filter className="h-4 w-4 alpha-text-muted" />
                      <SelectValue placeholder="All types" />
                    </span>
                  </SelectTrigger>
                  <SelectContent className={`macos-popover border-alpha-border ${isDark ? 'bg-dark-secondary' : 'bg-[color:var(--alpha-panel)]'}`}>
                    <SelectItem value="all">All types</SelectItem>
                    {AIRDROP_TYPES.map(t => <SelectItem key={t} value={t}>{t.toUpperCase()}</SelectItem>)}
                  </SelectContent>
                </Select>

                <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as AirdropStatus | 'all')}>
                  <SelectTrigger className={`h-11 min-w-[160px] rounded-[1rem] border-alpha-border ${
                    isDark ? 'bg-[color:var(--alpha-surface-soft)] alpha-text' : 'bg-[color:var(--alpha-surface)] alpha-text'
                  }`}>
                    <span className="flex min-w-0 items-center gap-2.5">
                      <Activity className="h-4 w-4 alpha-text-muted" />
                      <SelectValue placeholder="All statuses" />
                    </span>
                  </SelectTrigger>
                  <SelectContent className={`macos-popover border-alpha-border ${isDark ? 'bg-dark-secondary' : 'bg-[color:var(--alpha-panel)]'}`}>
                    <SelectItem value="all">All statuses</SelectItem>
                    {AIRDROP_STATUSES.map(s => <SelectItem key={s} value={s}>{s.toUpperCase()}</SelectItem>)}
                  </SelectContent>
                </Select>

                {/* View toggle */}
                <div className={`flex h-11 items-center rounded-[1rem] border border-alpha-border p-1 ${
                  isDark ? 'bg-[color:var(--alpha-surface-soft)]' : 'bg-[color:var(--alpha-surface)]'
                }`}>
                  {(['grid', 'list'] as const).map((mode) => (
                    <Button key={mode} variant={viewMode === mode ? 'default' : 'ghost'} size="icon"
                      onClick={() => setViewMode(mode)}
                      className={`h-9 w-9 rounded-[0.8rem] transition-[background-color,color] duration-150 ${viewMode === mode ? 'bg-gold/90 text-[color:var(--alpha-accent-contrast)]' : 'alpha-text-muted hover:bg-gold/10 hover:text-gold'}`}>
                      {mode === 'grid' ? <LayoutGrid className="h-4 w-4" /> : <List className="h-4 w-4" />}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        {filteredAirdrops.length === 0 ? (
          <div className="relative p-12 macos-card rounded-[1.1rem] text-center anim-fade shadow-none">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 border border-alpha-border opacity-50">
              <Search className="h-10 w-10 alpha-text-muted" />
            </div>
            <h3 className={`text-xl font-mono font-bold mb-2 alpha-text`}>{isDark ? '> NO_DATA_FOUND' : 'No airdrops found'}</h3>
            <p className={`font-mono text-sm mb-4 alpha-text-muted`}>{isDark ? 'Initialize new project tracking...' : 'Start tracking your first airdrop'}</p>
            <Button onClick={() => setIsAddModalOpen(true)}
              className={`font-mono macos-btn macos-btn--primary bg-gold text-[color:var(--alpha-accent-contrast)] hover:bg-gold-hover`}>
              <Plus className="h-4 w-4 mr-2" />{isDark ? 'INIT_PROJECT()' : 'Add Your First Airdrop'}
            </Button>
          </div>
        ) : viewMode === 'list' ? (
          // <<< CHANGE: make card overflow-visible so row popovers can escape the card
          <div className="macos-card overflow-visible rounded-[1.1rem] anim-fade shadow-none">
            <div className="overflow-x-auto">
              <table className="w-full macos-table">
                <thead>
                  <tr className="border-b border-alpha-border bg-[color:var(--alpha-hover-soft)]">
                    {['NO','NAME','TYPE','WALLET ADDRESS','OFFICIAL LINK','STATUS','ACTIONS'].map(h => (
                      <th key={h} className={`px-4 py-3 text-left text-xs font-mono font-medium alpha-text-muted`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredAirdrops.map((airdrop, index) => (
                    <TableRow
                      key={airdrop.id}
                      airdrop={airdrop}
                      index={index}
                      isDark={isDark}
                      logoError={logoError}
                      setLogoError={setLogoError}
                    onEdit={() => setEditingAirdrop(airdrop)}
                    onDelete={() => setDeletingAirdrop(airdrop)}
                    onAddPriority={() => handleAddPriority(airdrop)}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {filteredAirdrops.map((airdrop, index) => (
              <AirdropCardInline
                key={airdrop.id}
                airdrop={airdrop}
                index={index}
                onEdit={() => { setEditingAirdrop(airdrop); setOpenMenuId(null); }}
                onDelete={() => { setDeletingAirdrop(airdrop); setOpenMenuId(null); }}
                onToggleTask={handleToggleTask}
                onAddPriority={() => handleAddPriority(airdrop)}
                getProgress={getProgress}
                logoError={logoError}
                setLogoError={setLogoError}
                isMenuOpen={openMenuId === airdrop.id}
                onMenuToggle={(e: MouseEvent) => { e.stopPropagation(); setOpenMenuId(openMenuId === airdrop.id ? null : airdrop.id); }}
              />
            ))}
          </div>
        )}
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

      {priorityAirdrop && (
        <Suspense fallback={null}>
          <AirdropModal
            isOpen={Boolean(priorityAirdrop)}
            onClose={() => setPriorityAirdrop(null)}
            onSubmit={handleEditAirdrop}
            mode="edit"
            airdrop={priorityAirdrop}
            isDark={isDark}
          />
        </Suspense>
      )}

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
