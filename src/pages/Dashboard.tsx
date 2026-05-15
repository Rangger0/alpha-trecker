// (file lengkap dengan perbaikan dropdown clipping)
import { Suspense, lazy, useEffect, useMemo, useState, type ChangeEvent, type MouseEvent } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useI18n } from "@/contexts/LanguageContext";
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
  ExternalLink,
  Sparkles,
  Wallet,
  TrendingUp as TrendingUpIcon,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { usePrices } from "@/hooks/use-prices";
import { useAirdropRewards } from "@/hooks/use-airdrop-rewards";
import { CurrencyConverter } from "@/components/dashboard/CurrencyConverter";
import { emitAirdropsSync, setCachedAirdrops } from "@/lib/airdrops-store";
import type { Airdrop, AirdropType, AirdropStatus } from "@/types";
import { buildAirdropNotesWithMeta, createAirdrop, getAirdropsByUserId } from "@/services/database";

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

/* ---------- constants ---------- */
const AIRDROP_TYPES: AirdropType[] = [
  'Testnet', 'AI', 'Quest', 'Daily', 'Daily Quest',
  'Retroactive', 'Waitlist', 'Node', 'Depin', 'NFT', 'Domain Name',
  'Deploy SC', 'DeFi', 'Deploy NFT'
];

const AIRDROP_STATUSES: AirdropStatus[] = ['Planning', 'Ongoing', 'Done', 'Dropped'];

const TYPE_COLORS: Record<string, { dark: string; light: string }> = {
  'Testnet': { dark: 'bg-[color:var(--alpha-hover-soft)] text-[color:var(--alpha-text-muted)] border-[color:var(--alpha-border)]', light: 'bg-[color:var(--alpha-hover-soft)] text-[color:var(--alpha-text-muted)] border-[color:var(--alpha-border)]' },
  'AI': { dark: 'bg-[color:var(--alpha-hover-soft)] text-[color:var(--alpha-text-muted)] border-[color:var(--alpha-border)]', light: 'bg-[color:var(--alpha-hover-soft)] text-[color:var(--alpha-text-muted)] border-[color:var(--alpha-border)]' },
  'Quest': { dark: 'bg-[color:var(--alpha-hover-soft)] text-[color:var(--alpha-text-muted)] border-[color:var(--alpha-border)]', light: 'bg-[color:var(--alpha-hover-soft)] text-[color:var(--alpha-text-muted)] border-[color:var(--alpha-border)]' },
  'Daily': { dark: 'bg-[color:var(--alpha-hover-soft)] text-[color:var(--alpha-text-muted)] border-[color:var(--alpha-border)]', light: 'bg-[color:var(--alpha-hover-soft)] text-[color:var(--alpha-text-muted)] border-[color:var(--alpha-border)]' },
  'Daily Quest': { dark: 'bg-[color:var(--alpha-hover-soft)] text-[color:var(--alpha-text-muted)] border-[color:var(--alpha-border)]', light: 'bg-[color:var(--alpha-hover-soft)] text-[color:var(--alpha-text-muted)] border-[color:var(--alpha-border)]' },
  'Retroactive': { dark: 'bg-[color:var(--alpha-hover-soft)] text-[color:var(--alpha-text-muted)] border-[color:var(--alpha-border)]', light: 'bg-[color:var(--alpha-hover-soft)] text-[color:var(--alpha-text-muted)] border-[color:var(--alpha-border)]' },
  'Waitlist': { dark: 'bg-[color:var(--alpha-hover-soft)] text-[color:var(--alpha-text-muted)] border-[color:var(--alpha-border)]', light: 'bg-[color:var(--alpha-hover-soft)] text-[color:var(--alpha-text-muted)] border-[color:var(--alpha-border)]' },
  'Node': { dark: 'bg-[color:var(--alpha-hover-soft)] text-[color:var(--alpha-text-muted)] border-[color:var(--alpha-border)]', light: 'bg-[color:var(--alpha-hover-soft)] text-[color:var(--alpha-text-muted)] border-[color:var(--alpha-border)]' },
  'Depin': { dark: 'bg-[color:var(--alpha-hover-soft)] text-[color:var(--alpha-text-muted)] border-[color:var(--alpha-border)]', light: 'bg-[color:var(--alpha-hover-soft)] text-[color:var(--alpha-text-muted)] border-[color:var(--alpha-border)]' },
  'NFT': { dark: 'bg-[color:var(--alpha-hover-soft)] text-[color:var(--alpha-text-muted)] border-[color:var(--alpha-border)]', light: 'bg-[color:var(--alpha-hover-soft)] text-[color:var(--alpha-text-muted)] border-[color:var(--alpha-border)]' },
  'Domain Name': { dark: 'bg-[color:var(--alpha-hover-soft)] text-[color:var(--alpha-text-muted)] border-[color:var(--alpha-border)]', light: 'bg-[color:var(--alpha-hover-soft)] text-[color:var(--alpha-text-muted)] border-[color:var(--alpha-border)]' },
  'Deploy SC': { dark: 'bg-[color:var(--alpha-hover-soft)] text-[color:var(--alpha-text-muted)] border-[color:var(--alpha-border)]', light: 'bg-[color:var(--alpha-hover-soft)] text-[color:var(--alpha-text-muted)] border-[color:var(--alpha-border)]' },
  'DeFi': { dark: 'bg-[color:var(--alpha-hover-soft)] text-[color:var(--alpha-text-muted)] border-[color:var(--alpha-border)]', light: 'bg-[color:var(--alpha-hover-soft)] text-[color:var(--alpha-text-muted)] border-[color:var(--alpha-border)]' },
  'Deploy NFT': { dark: 'bg-[color:var(--alpha-hover-soft)] text-[color:var(--alpha-text-muted)] border-[color:var(--alpha-border)]', light: 'bg-[color:var(--alpha-hover-soft)] text-[color:var(--alpha-text-muted)] border-[color:var(--alpha-border)]' },
};

const STATUS_COLORS: Record<string, { dark: string; light: string }> = {
  'Planning': { dark: 'bg-[color:var(--alpha-hover-soft)] text-[color:var(--alpha-text-muted)] border-[color:var(--alpha-border)]', light: 'bg-[color:var(--alpha-hover-soft)] text-[color:var(--alpha-text-muted)] border-[color:var(--alpha-border)]' },
  'Ongoing': { dark: 'bg-[color:var(--alpha-hover-soft)] text-[color:var(--alpha-text)] border-[color:var(--alpha-border-strong)]', light: 'bg-[color:var(--alpha-hover-soft)] text-[color:var(--alpha-text)] border-[color:var(--alpha-border-strong)]' },
  'Done': { dark: 'bg-[color:var(--alpha-hover-soft)] text-[color:var(--alpha-text)] border-[color:var(--alpha-border-strong)]', light: 'bg-[color:var(--alpha-hover-soft)] text-[color:var(--alpha-text)] border-[color:var(--alpha-border-strong)]' },
  'Dropped': { dark: 'bg-[color:var(--alpha-hover-soft)] text-[color:var(--alpha-text-muted)] border-[color:var(--alpha-border)]', light: 'bg-[color:var(--alpha-hover-soft)] text-[color:var(--alpha-text-muted)] border-[color:var(--alpha-border)]' },
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
          badgeClass: 'alpha-text-muted border-alpha-border bg-[color:var(--alpha-hover-soft)]',
          progress: fundingProgress,
          progressColor: 'var(--alpha-text-muted)',
          meta: fundingFilledCount > 0 ? `${fundingFilledCount}/${totalProjects} projects filled` : 'Belum ada funding',
        },
        {
          label: 'Waitlist',
          value: waitlistFilledCount > 0 ? waitlistTotalUsers : '--',
          badge: waitlistFilledCount > 0 ? `${waitlistFilledCount} filled` : '-',
          badgeClass: 'alpha-text-muted border-alpha-border bg-[color:var(--alpha-hover-soft)]',
          progress: waitlistProgress,
          progressColor: 'var(--alpha-text-muted)',
          meta: waitlistFilledCount > 0 ? `${waitlistFilledCount}/${totalProjects} projects filled` : 'Belum ada waitlist',
        },
        {
          label: 'Potential',
          value: potentialProjects.length > 0 ? potentialProjects.length : '--',
          badge: potentialTier,
          badgeClass:
            potentialTier === 'High'
              ? 'alpha-text border-alpha-border bg-[color:var(--alpha-hover-soft)]'
              : potentialTier === 'Tracked'
                ? 'alpha-text-muted border-alpha-border bg-[color:var(--alpha-hover-soft)]'
                : 'alpha-text-muted border-alpha-border bg-[color:var(--alpha-hover-soft)]',
          progress: potentialProgress,
          progressColor:
            potentialTier === 'High'
              ? 'var(--alpha-text)'
              : potentialTier === 'Tracked'
                ? 'var(--alpha-text-muted)'
                : 'var(--alpha-text-muted)',
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
            <Sparkles className="h-3.5 w-3.5 alpha-text-muted" />
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
      </div>
    </motion.section>
  );
}

/* ---------- PriceTracker Component ---------- */
function PriceTracker({ isDark }: { isDark: boolean }) {
  const { prices, loading, error, lastUpdatedAt } = usePrices(['bitcoin', 'ethereum', 'solana', 'cardano', 'polkadot']);
  const coins = [
    { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', accent: 'var(--alpha-text-muted)' },
    { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', accent: 'var(--alpha-text-muted)' },
    { id: 'solana', symbol: 'SOL', name: 'Solana', accent: 'var(--alpha-text-muted)' },
    { id: 'cardano', symbol: 'ADA', name: 'Cardano', accent: 'var(--alpha-text-muted)' },
    { id: 'polkadot', symbol: 'DOT', name: 'Polkadot', accent: 'var(--alpha-text-muted)' },
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
      <span className="absolute inset-0 bg-[color:var(--alpha-surface)] opacity-0" />
      <div className="relative h-full flex flex-col">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-[0.8rem] border border-alpha-border bg-[color:var(--alpha-surface)] alpha-text-muted">
              <TrendingUpIcon className="h-3 w-3" />
            </div>
            <div>
              <p className="text-[9px] uppercase tracking-[0.2em] alpha-text-muted">Market</p>
              <h3 className="text-[12px] font-semibold leading-none alpha-text">Live prices</h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="rounded-full border border-alpha-border bg-[color:var(--alpha-hover-soft)] px-1.5 py-0.5 text-[8px] uppercase tracking-[0.18em] alpha-text-muted flex-shrink-0">
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
                    style={{ background: 'var(--alpha-border)' }}
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
                        ? 'border-alpha-border bg-[color:var(--alpha-hover-soft)] alpha-text-muted'
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
        ? "h-full rounded-[1.15rem] border border-alpha-border bg-[color:var(--alpha-hover-soft)] p-4 shadow-none"
        : "macos-card p-4 shadow-none"
    )}>
      <span className={cn(
        "absolute inset-0 bg-[color:var(--alpha-surface)] opacity-0",
        embedded && "opacity-55"
      )} />
      <div className="relative">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-alpha-border bg-[color:var(--alpha-surface)] px-3 py-1 text-[10px] uppercase tracking-[0.2em] alpha-text-muted">
              <CalendarDays className="h-3.5 w-3.5 alpha-text-muted" />
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
              className="flex h-9 w-9 items-center justify-center rounded-[0.9rem] border border-alpha-border bg-[color:var(--alpha-hover-soft)] transition-colors hover:bg-[color:var(--alpha-surface-soft)] hover:text-[color:var(--alpha-text)]"
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
              className="flex h-9 w-9 items-center justify-center rounded-[0.9rem] border border-alpha-border bg-[color:var(--alpha-hover-soft)] transition-colors hover:bg-[color:var(--alpha-surface-soft)] hover:text-[color:var(--alpha-text)]"
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
                    "flex h-9 w-full items-center justify-center rounded-[0.95rem] border text-[12px] font-medium transition-[background-color,border-color,color] duration-150 sm:h-10",
                    inCurrentMonth ? "opacity-100" : "opacity-45",
                    isSelected
                      ? "border-[color:var(--alpha-border-strong)] bg-gray-200 text-[#111111] dark:bg-gray-700 dark:text-[#ffffff]"
                      : "border-transparent alpha-text hover:bg-[color:var(--alpha-hover-soft)]",
                    isToday && !isSelected && "border-alpha-border bg-[color:var(--alpha-hover-soft)]",
                    hasDeadline && !isSelected && "border border-alpha-border bg-[color:var(--alpha-hover-soft)] alpha-text-muted hover:bg-[color:var(--alpha-surface-soft)]"
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
          embedded
        />
      </div>
    </div>
  );
}

/* ---------- ProjectAvatar & Tactical List Row ---------- */

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

/* TableRow (list-only tactical monitoring board) */
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
          <div className="flex w-fit items-center gap-2 rounded-[0.9rem] border border-alpha-border bg-[color:var(--alpha-hover-soft)] px-3 py-1.5 alpha-text-muted">
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
            className="flex items-center gap-1.5 text-xs transition-colors duration-150 hover:underline alpha-text-muted hover:text-[color:var(--alpha-text)]">
            <ExternalLink className="w-3.5 h-3.5" />
            {airdrop.platformLink.slice(0, 25)}...
          </a>
        ) : <span className="font-mono text-xs alpha-text-muted">-</span>}
      </td>

      <td className="px-4 py-4">
        <Badge variant="outline" className={`font-mono text-xs ${getStatusColor(airdrop.status)}`}>{airdrop.status}</Badge>
      </td>

      {/* Project intelligence metrics */}
      {(() => {
        const fundingLabel = airdrop.funding?.trim() || '-';
        const waitlistLabel = airdrop.waitlistCount != null ? String(airdrop.waitlistCount) : '-';
        const effectivePotential = airdrop.potential ?? '-';
        const confirmedLabel = airdrop.airdropConfirmed ? 'Confirmed' : 'Unconfirmed';

        const tierToColor = (tier: string) =>
          tier === 'High'
            ? 'alpha-text'
            : tier === 'Medium'
              ? 'alpha-text-muted'
              : tier === 'Low'
                ? 'alpha-text-muted'
                : 'alpha-text-muted';

        const tierToDot = (tier: string) =>
          tier === 'High'
            ? 'var(--alpha-text)'
            : tier === 'Medium'
              ? 'var(--alpha-text-muted)'
              : tier === 'Low'
                ? 'var(--alpha-text-muted)'
                : 'var(--alpha-text-muted)';

        const fundingDot = airdrop.funding ? 'var(--alpha-text)' : 'var(--alpha-text-muted)';
        const fundingText = airdrop.funding ? 'alpha-text' : 'alpha-text-muted';
        const waitlistDot = airdrop.waitlistCount != null ? 'var(--alpha-text)' : 'var(--alpha-text-muted)';
        const waitlistText = airdrop.waitlistCount != null ? 'alpha-text' : 'alpha-text-muted';
        const confirmedDot = airdrop.airdropConfirmed ? 'var(--alpha-text)' : 'var(--alpha-text-muted)';
        const confirmedText = airdrop.airdropConfirmed ? 'alpha-text' : 'alpha-text-muted';

        return (
          <>
            <td className="px-4 py-4">
              <div className="hud-badge">
                <span className="hud-badge-dot" style={{ background: confirmedDot }} />
                <span className={`${confirmedText} font-semibold`}>{confirmedLabel}</span>
              </div>
            </td>
            <td className="px-4 py-4">
              <div className="hud-badge">
                <span className="hud-badge-dot" style={{ background: fundingDot }} />
                <span className={`${fundingText} font-semibold`}>{fundingLabel}</span>
              </div>
            </td>
            <td className="px-4 py-4">
              <div className="hud-badge">
                <span className="hud-badge-dot" style={{ background: waitlistDot }} />
                <span className={`${waitlistText} font-semibold`}>{waitlistLabel}</span>
              </div>
            </td>
            <td className="px-4 py-4">
              <div className="hud-badge">
                <span className="hud-badge-dot" style={{ background: tierToDot(effectivePotential) }} />
                <span className={`${tierToColor(effectivePotential)} font-semibold`}>{effectivePotential}</span>
              </div>
            </td>
          </>
        );
      })()}

      {/* Actions */}
      <td className="px-4 py-4">
        <div className="flex items-center gap-2">
          {/* Add Priority */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onAddPriority()}
            className={`h-8 rounded-[0.9rem] border px-3 font-mono text-xs transition-[border-color,background-color,color] duration-150 ${isDark ? 'border-alpha-border bg-[color:var(--alpha-surface)] alpha-text-muted hover:border-[color:var(--alpha-border-strong)] hover:bg-[color:var(--alpha-surface-soft)] hover:text-[color:var(--alpha-text)]' : 'border-alpha-border bg-[color:var(--alpha-surface)] alpha-text-muted hover:border-[color:var(--alpha-border-strong)] hover:bg-[color:var(--alpha-surface-soft)] hover:text-[color:var(--alpha-text)]'}`}
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
                className="h-8 w-8 rounded-[0.9rem] border border-transparent bg-[color:var(--alpha-surface)] transition-[background-color,color,border-color] duration-150 alpha-text-muted hover:border-[color:var(--alpha-border-strong)] hover:bg-[color:var(--alpha-surface-soft)] hover:text-[color:var(--alpha-text)]"
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
              <DropdownMenuItem onSelect={() => onEdit()} className="gap-2 alpha-text hover:text-[color:var(--alpha-text)]">
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
  const [logoError, setLogoError] = useState<Record<string, boolean>>({});
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isEligibilityModalOpen, setIsEligibilityModalOpen] = useState(false);
  const { rewards } = useAirdropRewards();

  const isDark = theme === 'dark';

  // UI tokens
  const bg      = 'alpha-bg';
  const text    = 'alpha-text';

  const filteredAirdrops = useMemo(() => {
    let result = [...airdrops];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(a =>
        a.projectName.toLowerCase().includes(q) ||
        (a.twitterUsername || '').toLowerCase().includes(q) ||
        (a.walletAddress || '').toLowerCase().includes(q) ||
        (a.funding || '').toLowerCase().includes(q) ||
        (a.potential || '').toLowerCase().includes(q) ||
        (a.waitlistCount != null && 'waitlist'.includes(q)) ||
        (a.airdropConfirmed && 'confirmed'.includes(q))
      );
    }
    if (typeFilter   !== 'all') result = result.filter(a => a.type   === typeFilter);
    if (statusFilter !== 'all') result = result.filter(a => a.status === statusFilter);
    if (sortBy === 'newest') result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return result;
  }, [airdrops, searchQuery, typeFilter, statusFilter, sortBy]);

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
      notes: buildAirdropNotesWithMeta(data), tasks: data.tasks || [], priority: data.priority,
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
            <Filter className="h-3.5 w-3.5 alpha-text-muted" />
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
              className={`font-mono macos-btn macos-btn--primary bg-[color:var(--alpha-accent)] text-[color:var(--alpha-accent-contrast)] hover:bg-[color:var(--alpha-accent-hover)]`}>
              <Plus className="h-4 w-4 mr-2" />{isDark ? 'INIT_PROJECT()' : 'Add Your First Airdrop'}
            </Button>
          </div>
        ) : (
          // <<< CHANGE: make card overflow-visible so row popovers can escape the card
          <div className="macos-card overflow-visible rounded-[1.1rem] anim-fade shadow-none">
            <div className="overflow-x-auto">
              <table className="w-full macos-table">
                <thead>
                  <tr className="border-b border-alpha-border bg-[color:var(--alpha-hover-soft)]">
                    {['NO','NAME','TYPE','WALLET ADDRESS','OFFICIAL LINK','STATUS','CONFIRMED','FUNDING','WAITLIST','POTENTIAL','ACTIONS'].map(h => (
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
