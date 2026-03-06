// (file lengkap dengan perbaikan dropdown clipping)
import { useEffect, useMemo, useState, ChangeEvent, MouseEvent } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useWalletContext } from "@/contexts/WalletContext";
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { AirdropNewsPanel } from "@/components/dashboard/AirdropNewsPanel";
import { supabase } from "@/lib/supabase";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
  Clock3,
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
  Layers,
  TrendingUp,
  CheckCircle,
  XCircle,
  Wallet,
  TrendingUp as TrendingUpIcon,
  Star,
} from "lucide-react";
import { AirdropModal } from "@/components/modals/AirdropModal";
import { DeleteConfirmModal } from "@/components/modals/DeleteConfirmModal";
import { WalletConnectModal } from "@/components/modals/WalletConnectModal";
import { EligibilityModal } from "@/components/modals/EligibilityModal";
import { RewardPerformancePanel } from "@/components/rewards/RewardPerformancePanel";
import { cn } from "@/lib/utils";
import { usePrices } from "@/hooks/use-prices";
import { useAirdropRewards } from "@/hooks/use-airdrop-rewards";
import type { Airdrop, AirdropType, AirdropStatus } from "@/types";
import { createAirdrop, getAirdropsByUserId } from "@/services/database";

/* ---------- constants ---------- */
const AIRDROP_TYPES: AirdropType[] = [
  'Testnet', 'AI', 'Quest', 'Daily', 'Daily Quest',
  'Retroactive', 'Waitlist', 'Depin', 'NFT', 'Domain Name',
  'Deploy SC', 'DeFi', 'Deploy NFT'
];

const AIRDROP_STATUSES: AirdropStatus[] = ['Planning', 'Ongoing', 'Done', 'Dropped'];

const TYPE_COLORS: Record<string, { dark: string; light: string }> = {
  'Testnet': { dark: 'bg-[#8B5CF6]/10 text-[#8B5CF6] border-[#8B5CF6]/20', light: 'bg-[#4F46E5]/10 text-[#4F46E5] border-[#4F46E5]/30' },
  'AI': { dark: 'bg-[#3B82F6]/10 text-[#3B82F6] border-[#3B82F6]/20', light: 'bg-[#2563EB]/10 text-[#2563EB] border-[#2563EB]/30' },
  'Quest': { dark: 'bg-gold/10 text-gold border-gold/20', light: 'bg-gold/10 text-gold border-gold/30' },
  'Daily': { dark: 'bg-[#EC4899]/10 text-[#EC4899] border-[#EC4899]/20', light: 'bg-[#DB2777]/10 text-[#DB2777] border-[#DB2777]/30' },
  'Daily Quest': { dark: 'bg-[#EC4899]/10 text-[#EC4899] border-[#EC4899]/20', light: 'bg-[#DB2777]/10 text-[#DB2777] border-[#DB2777]/30' },
  'Retroactive': { dark: 'bg-[#8B5CF6]/10 text-[#8B5CF6] border-[#8B5CF6]/20', light: 'bg-[#4F46E5]/10 text-[#4F46E5] border-[#4F46E5]/30' },
  'Waitlist': { dark: 'bg-[#3B82F6]/10 text-[#3B82F6] border-[#3B82F6]/20', light: 'bg-[#2563EB]/10 text-[#2563EB] border-[#2563EB]/30' },
  'Depin': { dark: 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20', light: 'bg-[#059669]/10 text-[#059669] border-[#059669]/30' },
  'NFT': { dark: 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20', light: 'bg-[#DC2626]/10 text-[#DC2626] border-[#DC2626]/30' },
  'Domain Name': { dark: 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20', light: 'bg-[#DC2626]/10 text-[#DC2626] border-[#DC2626]/30' },
  'Deploy SC': { dark: 'bg-gold/10 text-gold border-gold/20', light: 'bg-gold/10 text-gold border-gold/30' },
  'DeFi': { dark: 'bg-gold/10 text-gold border-gold/20', light: 'bg-gold/10 text-gold border-gold/30' },
  'Deploy NFT': { dark: 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20', light: 'bg-[#DC2626]/10 text-[#DC2626] border-[#DC2626]/30' },
};

const STATUS_COLORS: Record<string, { dark: string; light: string }> = {
  'Planning': { dark: 'bg-light-muted/10 text-light-muted border-light-muted/20', light: 'bg-light-muted/10 text-light-muted border-light-muted/30' },
  'Ongoing': { dark: 'bg-[#3B82F6]/10 text-[#3B82F6] border-[#3B82F6]/20', light: 'bg-[#0EA5E9]/10 text-[#0EA5E9] border-[#0EA5E9]/30' },
  'Done': { dark: 'bg-gold/10 text-gold border-gold/20', light: 'bg-gold/10 text-gold border-gold/30' },
  'Dropped': { dark: 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20', light: 'bg-[#DC2626]/10 text-[#DC2626] border-[#DC2626]/30' },
};

/* ---------- animations ---------- */
const ANIM_STYLE = `
@keyframes fadeSlideUp {
  from { opacity: 0; transform: translateY(18px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}
.anim-card {
  animation: fadeSlideUp 0.45s cubic-bezier(.22,1,.36,1) both;
}
.anim-fade {
  animation: fadeIn 0.3s ease both;
}
`;

/* ---------- helpers ---------- */
const formatWallet = (address: string) => {
  if (!address) return '';
  if (address.length <= 12) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

const twitterAvatarUrl = (username: string) =>
  `https://unavatar.io/twitter/ ${username.replace('@', '')}`;

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

/* ---------- PriceTracker Component ---------- */
function PriceTracker({ isDark }: { isDark: boolean }) {
  const [showPrices, setShowPrices] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(() => new Date());
  const { prices, loading } = usePrices(['bitcoin', 'ethereum', 'solana', 'cardano', 'polkadot']);
  const coins = [
    { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', accent: '#F7931A' },
    { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', accent: '#627EEA' },
    { id: 'solana', symbol: 'SOL', name: 'Solana', accent: '#14F195' },
    { id: 'cardano', symbol: 'ADA', name: 'Cardano', accent: '#2A6AF7' },
    { id: 'polkadot', symbol: 'DOT', name: 'Polkadot', accent: '#E6007A' },
  ];
  const shellClassName = "relative h-[190px] sm:h-[198px]";

  useEffect(() => {
    if (!showPrices) return;
    setLastUpdated(new Date());
  }, [prices, showPrices]);

  if (!showPrices) return (
    <div className={shellClassName}>
      <Button
        onClick={() => setShowPrices(true)}
        className={`group relative h-full w-full overflow-hidden rounded-2xl border px-3.5 py-2.5 font-mono shadow-lg transition-all duration-300 hover:-translate-y-0.5 ${
          isDark
            ? 'border-alpha-border bg-dark-secondary/90 text-gold hover:border-gold/40 hover:bg-dark-secondary'
            : 'border-alpha-border bg-light text-dark-bg hover:border-gold/50 hover:bg-light'
        }`}
      >
        <span className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(184,207,206,0.18),transparent_55%)] opacity-80" />
        <span className="relative flex w-full items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-gold/25 bg-gold/10 text-gold">
            <Activity className="h-3.5 w-3.5" />
          </span>
          <span className="flex flex-col items-start">
            <span className="text-[10px] uppercase tracking-[0.28em] alpha-text-muted">Market Snapshot</span>
            <span className={`text-[13px] font-semibold leading-none ${isDark ? 'alpha-text' : 'text-dark-bg'}`}>Show prices</span>
          </span>
          <span className="ml-auto rounded-full border border-gold/25 bg-gold/10 px-2.5 py-0.5 text-[9px] uppercase tracking-[0.22em] text-gold">
            {coins.length} assets
          </span>
        </span>
      </Button>
    </div>
  );

  return (
    <div className={shellClassName}>
      <Card className={`relative h-full overflow-hidden border shadow-xl transition-all duration-300 ${isDark ? 'border-alpha-border bg-dark-secondary/95' : 'border-alpha-border bg-light'}`}>
        <span className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(184,207,206,0.18),transparent_52%)] opacity-80" />
        <CardContent className="relative flex h-full flex-col p-3.5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-2xl border border-gold/20 bg-gold/10 text-gold shadow-[0_0_24px_rgba(184,207,206,0.12)]">
                <TrendingUpIcon className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.28em] alpha-text-muted">Market Snapshot</p>
                <h3 className={`mt-0.5 text-[13px] font-semibold leading-none ${isDark ? 'alpha-text' : 'text-dark-bg'}`}>Live prices</h3>
                <p className="mt-0.5 text-[11px] alpha-text-muted">
                  Updated {lastUpdated.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowPrices(false)}
              className="inline-flex w-fit items-center gap-2 rounded-full border border-alpha-border bg-black/5 px-2.5 py-0.5 text-[9px] uppercase tracking-[0.24em] alpha-text-muted transition-colors hover:text-gold dark:bg-white/5"
            >
              <span className="h-2 w-2 rounded-full bg-gold" />
              Hide
            </button>
          </div>

          {loading ? (
            <div className="mt-3 flex flex-1 items-center justify-center rounded-2xl border border-dashed border-alpha-border bg-black/5 px-4 py-6 text-center text-sm alpha-text-muted dark:bg-white/[0.03]">
              Loading live prices...
            </div>
          ) : (
            <div className="mt-3 grid grid-cols-5 gap-1.5">
              {coins.map((coin) => {
                const price = prices[coin.id];
                const change = price?.usd_24h_change;
                const isPositive = (change ?? 0) >= 0;

                return (
                  <div
                    key={coin.id}
                    className={`relative overflow-hidden rounded-[1rem] border px-2 py-2 transition-all duration-300 hover:-translate-y-0.5 ${
                      isDark
                        ? 'border-alpha-border bg-dark-bg/90 hover:border-gold/30'
                        : 'border-alpha-border bg-white/80 hover:border-gold/40'
                    }`}
                  >
                    <span
                      className="absolute inset-x-0 top-0 h-px"
                      style={{ background: `linear-gradient(90deg, transparent, ${coin.accent}, transparent)` }}
                    />
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <p className={`text-[10px] uppercase tracking-[0.28em] ${isDark ? 'alpha-text-muted' : 'text-dark-secondary'}`}>
                          {coin.symbol}
                        </p>
                        <p className="mt-0.5 text-[9px] alpha-text-muted">{coin.name}</p>
                      </div>
                      <span
                        className="h-2 w-2 rounded-full shadow-[0_0_12px_currentColor]"
                        style={{ backgroundColor: coin.accent, color: coin.accent }}
                      />
                    </div>
                    <p className={`mt-2.5 text-[15px] font-semibold tracking-tight ${isDark ? 'alpha-text' : 'text-dark-bg'}`}>
                      {formatUsdPrice(price?.usd)}
                    </p>
                    <div
                      className={`mt-1.5 inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[9px] font-medium ${
                        isPositive
                          ? 'border-gold/30 bg-gold/10 text-gold'
                          : 'border-[#EF4444]/25 bg-[#EF4444]/10 text-[#EF4444]'
                      }`}
                    >
                      {isPositive ? <ArrowUpRight className="h-2.5 w-2.5" /> : <ArrowDownRight className="h-2.5 w-2.5" />}
                      {formatPriceChange(change)}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
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
        ? "h-full rounded-[1.6rem] border border-alpha-border bg-black/5 p-4 dark:bg-white/[0.04]"
        : "macos-card p-5"
    )}>
      <span className={cn(
        "absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(184,207,206,0.14),transparent_46%)] opacity-90",
        embedded && "opacity-70"
      )} />
      <div className="relative">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-alpha-border bg-black/5 px-3 py-1 text-[10px] uppercase tracking-[0.26em] alpha-text-muted dark:bg-white/[0.04]">
              <CalendarDays className="h-3.5 w-3.5 text-gold" />
              Project calendar
            </div>
            <h3 className="mt-4 text-xl font-semibold tracking-tight alpha-text">Deadline board</h3>
            <p className="mt-2 text-sm alpha-text-muted">
              Klik tanggal untuk lihat project aktif dan due date yang harus dikejar.
            </p>
          </div>

          <div className="rounded-full border border-alpha-border bg-black/5 px-3 py-1.5 text-right dark:bg-white/[0.04]">
            <p className="text-[10px] uppercase tracking-[0.22em] alpha-text-muted">Focused day</p>
            <p className="mt-0.5 text-sm font-semibold alpha-text">{formatCalendarDate(selectedDate)}</p>
          </div>
        </div>

        <div className="mt-5 rounded-[1.35rem] border border-alpha-border bg-black/5 p-3.5 dark:bg-white/[0.04]">
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => {
                const next = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1);
                setCalendarMonth(next);
              }}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-alpha-border bg-black/5 transition-colors hover:bg-gold/10 hover:text-gold dark:bg-white/[0.04]"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <div className="text-center">
              <p className="text-base font-semibold alpha-text">{getCalendarMonthLabel(calendarMonth)}</p>
              <p className="mt-1 text-[11px] alpha-text-muted">{selectedEntriesCount} project on focus</p>
            </div>

            <button
              type="button"
              onClick={() => {
                const next = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1);
                setCalendarMonth(next);
              }}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-alpha-border bg-black/5 transition-colors hover:bg-gold/10 hover:text-gold dark:bg-white/[0.04]"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-4 grid grid-cols-7 gap-2">
            {weekdayLabels.map((label) => (
              <div
                key={label}
                className="flex h-8 items-center justify-center text-[11px] font-medium uppercase tracking-[0.14em] alpha-text-muted"
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
                    "flex h-10 w-full items-center justify-center rounded-xl border text-[13px] font-medium transition-all sm:h-11",
                    inCurrentMonth ? "opacity-100" : "opacity-45",
                    isSelected
                      ? "border-gold bg-gold text-dark-bg shadow-sm"
                      : "border-transparent alpha-text hover:bg-black/5 dark:hover:bg-white/[0.05]",
                    isToday && !isSelected && "border-alpha-border bg-black/5 dark:bg-white/[0.04]",
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
  logoError,
  setLogoError,
}: {
  rewards: ReturnType<typeof useAirdropRewards>["rewards"];
  airdrops: Airdrop[];
  isDark: boolean;
  logoError: Record<string, boolean>;
  setLogoError: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
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

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [calendarMonth, setCalendarMonth] = useState<Date | undefined>(undefined);

  useEffect(() => {
    if (!selectedDate) {
      setSelectedDate(nextUpcoming?.date ?? today);
    }
    if (!calendarMonth) {
      setCalendarMonth(nextUpcoming?.date ?? today);
    }
  }, [calendarMonth, nextUpcoming, selectedDate, today]);

  const selectedEntries = useMemo(
    () =>
      selectedDate
        ? deadlineEntries.filter((entry) => isSameCalendarDay(entry.date, selectedDate))
        : [],
    [deadlineEntries, selectedDate]
  );

  const upcomingEntries = useMemo(
    () => deadlineEntries.filter((entry) => entry.date.getTime() >= today.getTime()).slice(0, 3),
    [deadlineEntries, today]
  );

  const deadlineKeys = useMemo(
    () => new Set(deadlineEntries.map((entry) => entry.date.toDateString())),
    [deadlineEntries]
  );

  const calendarDays = useMemo(
    () => getCalendarGrid(calendarMonth ?? today),
    [calendarMonth, today]
  );

  return (
    <section className="macos-card relative overflow-hidden p-5 sm:p-6">
      <span className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(184,207,206,0.14),transparent_48%)] opacity-90" />
      <div className="relative grid gap-5 xl:grid-cols-[minmax(0,1.15fr)_330px]">
        <div className="flex h-full flex-col gap-4">
          <RewardPerformancePanel
            rewards={rewards}
            isDark={isDark}
            title="Payout timeline"
            subtitle="Reward history from your claimed airdrops. Record income in Reward Vault and this panel updates automatically."
            compact
            embedded
          />

          <div className="rounded-[1.35rem] border border-alpha-border bg-black/5 p-4 dark:bg-white/[0.04]">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-alpha-border bg-white/60 px-3 py-1 text-[10px] uppercase tracking-[0.24em] alpha-text-muted dark:bg-black/10">
                  <Clock3 className="h-3.5 w-3.5 text-gold" />
                  Selected schedule
                </div>
                <h4 className="mt-3 text-lg font-semibold alpha-text">{formatCalendarDate(selectedDate)}</h4>
                <p className="mt-1 text-sm alpha-text-muted">
                  {selectedEntries.length > 0
                    ? 'Project yang terkait tanggal pilihan tampil di sini, jadi panel kalender tetap bersih.'
                    : 'Klik tanggal yang ada highlight untuk lihat project aktif atau due date berikutnya.'}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="rounded-full border border-gold/25 bg-gold/10 px-3 py-1 text-[11px] font-medium text-gold">
                  {selectedEntries.length} project
                </span>
              </div>
            </div>

            <div className="mt-4 grid gap-3">
              {selectedEntries.length > 0 ? (
                selectedEntries.slice(0, 3).map(({ airdrop, date }) => (
                  <div
                    key={airdrop.id}
                    className="flex items-center gap-3 rounded-2xl border border-alpha-border bg-white/60 px-3.5 py-3 dark:bg-black/10"
                  >
                    <ProjectAvatar airdrop={airdrop} size="sm" logoError={logoError} setLogoError={setLogoError} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold alpha-text">{airdrop.projectName}</p>
                      <p className="mt-1 text-xs alpha-text-muted">{airdrop.type} • {airdrop.status}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-medium text-gold">{formatCalendarDate(date)}</p>
                      <p className="mt-1 text-[11px] alpha-text-muted">Focus item</p>
                    </div>
                  </div>
                ))
              ) : upcomingEntries.length > 0 ? (
                upcomingEntries.slice(0, 2).map(({ airdrop, date }) => (
                  <button
                    key={airdrop.id}
                    type="button"
                    onClick={() => {
                      setSelectedDate(date);
                      setCalendarMonth(new Date(date.getFullYear(), date.getMonth(), 1));
                    }}
                    className="flex w-full items-center justify-between rounded-2xl border border-alpha-border bg-white/60 px-3.5 py-3 text-left transition-colors hover:border-gold/30 hover:bg-gold/5 dark:bg-black/10"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold alpha-text">{airdrop.projectName}</p>
                      <p className="mt-1 text-xs alpha-text-muted">Upcoming focus</p>
                    </div>
                    <div className="ml-3 text-right">
                      <p className="text-sm font-medium text-gold">{formatCalendarDate(date)}</p>
                    </div>
                  </button>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-alpha-border px-3 py-6 text-center text-sm alpha-text-muted">
                  Belum ada tanggal project yang tercatat.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="xl:border-l xl:border-alpha-border xl:pl-5">
          <DashboardCalendarPanel
            selectedDate={selectedDate ?? today}
            setSelectedDate={setSelectedDate}
            calendarMonth={calendarMonth ?? today}
            setCalendarMonth={setCalendarMonth}
            selectedEntriesCount={selectedEntries.length}
            deadlineKeys={deadlineKeys}
            calendarDays={calendarDays}
            today={today}
            embedded
          />
        </div>
      </div>
    </section>
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
    <div className={`${dim} rounded-lg flex-shrink-0 overflow-hidden border flex items-center justify-center transition-transform duration-300 group-hover:scale-105`}
      style={{ background: 'var(--alpha-panel)', borderColor: 'var(--alpha-border)' }}>
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
    <tr className={`border-b transition-all duration-200 group anim-card ${isDark ? 'border-alpha-border hover:bg-dark-hover' : 'border-alpha-border hover:bg-light'}`}
      style={{ animationDelay: `${index * 40}ms` }}>
      <td className="px-4 py-4">
        <span className="font-mono text-sm alpha-text-muted">{index + 1}</span>
      </td>

      {/* Name with Avatar */}
      <td className="px-4 py-4">
          <div className="flex items-center gap-3">
            <ProjectAvatar airdrop={airdrop} size="sm" logoError={logoError} setLogoError={setLogoError} />
            <div>
              <p className={`font-mono font-medium alpha-text`}>{airdrop.projectName}</p>
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
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border w-fit bg-gold/5 border-gold/20 text-gold`}>
            <Wallet className="w-3.5 h-3.5" />
            <span className="font-mono text-xs">{formatWallet(airdrop.walletAddress)}</span>
          </div>
        ) : (
          <span className={`font-mono text-xs px-3 py-1.5 rounded-lg border bg-dark-hover border-alpha-border alpha-text-muted`}>No address</span>
        )}
      </td>

      <td className="px-4 py-4">
        {airdrop.platformLink ? (
          <a href={airdrop.platformLink} target="_blank" rel="noopener noreferrer"
            className={`flex items-center gap-1.5 font-mono text-xs transition-all duration-200 hover:underline text-gold hover:text-gold-hover`}>
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
            className={`font-mono text-xs border transition-all duration-200 hover:scale-105 ${isDark ? 'border-alpha-border alpha-text-muted hover:bg-gold/10 hover:text-gold' : 'border-alpha-border alpha-text-muted hover:bg-gold/10 hover:text-gold'}`}
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
                className="w-8 h-8 transition-all duration-200 alpha-text-muted hover:text-gold hover:bg-gold/10"
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
function AirdropCardInline({
  airdrop, index, onEdit, onDelete, onToggleTask, onAddPriority,
  getProgress, logoError, setLogoError, isMenuOpen, onMenuToggle,
}: any) {
  const progress = getProgress(airdrop);
  const completedTasks = airdrop.tasks.filter((t:any) => t.completed).length;

  return (
    <div className={`relative p-5 macos-card macos-card-hover group anim-card`} style={{ animationDelay: `${index * 50}ms` }}>
      <div className="relative flex flex-col h-full">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
              <ProjectAvatar airdrop={airdrop} size="md" logoError={logoError} setLogoError={setLogoError} />
            <div className="flex-1 min-w-0">
              <h3 className={`font-mono font-bold text-base truncate alpha-text`}>{airdrop.projectName}</h3>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <Badge variant="outline" className="font-mono text-xs">{airdrop.type}</Badge>
                <Badge variant="outline" className="font-mono text-xs">{airdrop.status}</Badge>
              </div>
            </div>
          </div>

          <div className="relative">
            <Button variant="ghost" size="icon" onClick={(e: MouseEvent) => { e.stopPropagation(); onMenuToggle(e); }}
              className={`flex-shrink-0 border transition-all duration-200 border-alpha-border alpha-text-muted hover:text-gold`} >
              <MoreVertical className="h-4 w-4" />
            </Button>
            {isMenuOpen && (
              <div className="macos-popover absolute right-0 top-full mt-2 w-36 z-50" onClick={(e: MouseEvent) => e.stopPropagation()} style={{ borderColor: 'var(--alpha-border)', background: 'var(--alpha-panel)', color: 'var(--alpha-text)', zIndex: 9999 }}>
                <button onClick={(e: MouseEvent) => { e.stopPropagation(); onEdit(); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm font-mono text-left alpha-text hover:text-gold">
                  <Edit2 className="h-4 w-4" />EDIT
                </button>
                <button onClick={(e: MouseEvent) => { e.stopPropagation(); onDelete(); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm font-mono text-left text-[#EF4444]">
                  <Trash2 className="h-4 w-4" />DELETE
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="mb-3">
          <div className={`flex items-center justify-between text-xs font-mono mb-1.5 alpha-text-muted`}>
            <span>PROGRESS_{progress}%</span>
            <span className="text-gold">[{completedTasks}/{airdrop.tasks.length}]</span>
          </div>
          <div className={`h-1.5 rounded-full overflow-hidden bg-dark-secondary`}>
            <div className={`h-full rounded-full transition-all duration-700 ease-out bg-gold`} style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Tasks preview */}
        {airdrop.tasks?.length > 0 && (
          <div className="flex-1 space-y-1.5 mb-3">
            {airdrop.tasks.slice(0, 3).map((task:any) => (
              <div key={task.id} className="flex items-center gap-2 cursor-pointer" onClick={() => onToggleTask(airdrop.id, task.id)}>
                {task.completed
                  ? <CheckCircle2 className={`h-4 w-4 flex-shrink-0 text-gold`} />
                  : <Circle className={`h-4 w-4 flex-shrink-0 alpha-text-muted`} />
                }
                <span className={`text-xs font-mono truncate ${task.completed ? 'line-through alpha-text-muted' : 'alpha-text'}`}>{task.title}</span>
              </div>
            ))}
            {airdrop.tasks.length > 3 && (
              <p className="text-xs font-mono alpha-text-muted">+{airdrop.tasks.length - 3} more...</p>
            )}
          </div>
        )}

        <div className={`flex items-center gap-2 mt-auto pt-3 border-t border-alpha-border`}>
          {airdrop.platformLink && (
            <a href={airdrop.platformLink} target="_blank" rel="noopener noreferrer"
              className="p-1.5 rounded border transition-all duration-200 bg-dark-secondary border-alpha-border alpha-text hover:text-gold hover:border-gold/50">
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
          {airdrop.twitterUsername && (
            <a href={`https://twitter.com/ ${airdrop.twitterUsername.replace('@','')}`} target="_blank" rel="noopener noreferrer"
              className="p-1.5 rounded border transition-all duration-200 bg-dark-secondary border-alpha-border alpha-text hover:text-gold hover:border-gold/50">
              <svg style={{width:14,height:14}} viewBox="0 0 24 24"><path fill="currentColor" d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
          )}

          <button
            onClick={() => onAddPriority()}
            className={`ml-auto flex items-center gap-1 text-xs font-mono px-2 py-1 rounded border transition-all duration-200 ${
              (airdrop as any).isPriority 
                ? 'bg-gold text-dark-bg border-gold' 
                : 'bg-transparent alpha-text border-alpha-border hover:border-gold'
            }`}
          >
            <Star className={`h-3 w-3`} />
            {(airdrop as any).isPriority ? 'Priority' : '+ Priority'}
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
  const { wallets: _wallets } = useWalletContext();
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
  const accent  = 'text-gold';

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
      const normalized = (rows || []).map((r: any) => ({ ...r, isPriority: Boolean((r as any).isPriority || (r as any).is_priority) }));
      setAirdrops(normalized);
    });
  }, [user]);

  async function handleAddAirdrop(data: Omit<Airdrop, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) {
    if (!user) return;
    await createAirdrop(data, user.id);
    const rows = await getAirdropsByUserId(user.id);
    setAirdrops(rows.map((r:any) => ({ ...r, isPriority: Boolean((r as any).isPriority || (r as any).is_priority) })));
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
    setAirdrops(rows.map((r:any) => ({ ...r, isPriority: Boolean((r as any).isPriority || (r as any).is_priority) })));
    setEditingAirdrop(null);
  };

  const handleDeleteAirdrop = async () => {
    if (!deletingAirdrop) return;
    const { error } = await supabase.from('airdrops').delete().eq('id', deletingAirdrop.id);
    if (error) return console.error(error);
    setAirdrops(prev => prev.filter(a => a.id !== deletingAirdrop.id));
    setDeletingAirdrop(null);
  };

  // Toggle priority: update DB then refetch canonical list
  const handleAddPriority = async (airdrop: Airdrop) => {
    if (!user) return;
    const current = Boolean((airdrop as any).isPriority || (airdrop as any).is_priority);
    const newVal = !current;
    const { error } = await supabase.from('airdrops')
      .update({ is_priority: newVal, updated_at: new Date().toISOString() })
      .eq('id', airdrop.id);
    if (error) {
      console.error(error);
      return;
    }
    const rows = await getAirdropsByUserId(user.id);
    setAirdrops(rows.map((r:any) => ({ ...r, isPriority: Boolean((r as any).isPriority || (r as any).is_priority) })));
  };

  const handleToggleTask = async (airdropId: string, taskId: string) => {
    const airdrop = airdrops.find(a => a.id === airdropId);
    if (!airdrop) return;
    const updatedTasks = airdrop.tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t);
    const { error } = await supabase.from('airdrops').update({ tasks: updatedTasks }).eq('id', airdropId);
    if (error) return console.error(error);
    setAirdrops(prev => prev.map(a => a.id === airdropId ? { ...a, tasks: updatedTasks } : a));
  };

  const getProgress = (airdrop: Airdrop) => {
    if (!airdrop.tasks || !airdrop.tasks.length) return 0;
    return Math.round((airdrop.tasks.filter((t:any) => t.completed).length / airdrop.tasks.length) * 100);
  };

  const stats = [
    { label: 'TOTAL_PROJECTS', value: airdrops.length,                                    icon: Layers,      color: accent },
    { label: 'ACTIVE_NODES',   value: airdrops.filter(a => a.status === 'Ongoing').length, icon: TrendingUp,  color: 'text-[#3B82F6]' },
    { label: 'COMPLETED',      value: airdrops.filter(a => a.status === 'Done').length,    icon: CheckCircle, color: accent },
    { label: 'DROPPED',        value: airdrops.filter(a => a.status === 'Dropped').length, icon: XCircle,     color: 'text-[#EF4444]' },
  ];

  return (
    <div className={`min-h-screen flex flex-col font-mono transition-colors duration-300 macos-root ${bg} ${text}`}>
      <style>{ANIM_STYLE}</style>

      <main className="flex-1 w-full px-6 sm:px-7 lg:px-8 py-7">
        {/* Header */}
        <div className="mb-8 anim-fade">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight alpha-text">
              Dashboard
            </h1>
            <p className="mt-2 max-w-2xl text-sm alpha-text-muted">
              Track active projects, live prices, and realized airdrop income in one premium workspace.
            </p>
          </div>

          <div className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(430px,480px)] 2xl:grid-cols-[minmax(0,1fr)_minmax(450px,520px)]">
            <DashboardWorkspacePanel
              rewards={rewards}
              airdrops={airdrops}
              isDark={isDark}
              logoError={logoError}
              setLogoError={setLogoError}
            />
            <div className="flex flex-col gap-4 xl:self-start">
              <PriceTracker isDark={isDark} />
              <AirdropNewsPanel isDark={isDark} />
            </div>
          </div>
        </div>

        {/* Stats Cards - use macos-card */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, idx) => (
            <div key={idx} className={`relative p-6 macos-card macos-card-hover anim-card`}
              style={{ animationDelay: `${idx * 60}ms` }}>
              <div className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-r from-gold/10 via-transparent to-gold/10`} />
              <div className="relative flex items-center justify-between">
                <div>
                  <p className={`text-xs font-mono mb-1 alpha-text-muted`}>{stat.label}</p>
                  <p className={`text-3xl font-bold font-mono ${stat.color}`}>{String(stat.value).padStart(2, '0')}</p>
                </div>
                <div className={`w-12 h-12 rounded flex items-center justify-center transition-transform duration-300 group-hover:scale-110 bg-dark-secondary border border-alpha-border`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters - use macos-card */}
        <div className="mb-6 anim-fade" style={{ animationDelay: '200ms' }}>
          <div className="macos-card p-4">
            <div className="flex flex-col lg:flex-row gap-4 items-stretch">
              <div className="relative flex-1">
                <Search className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 alpha-text-muted`} />
                <Input
                  placeholder={isDark ? '> search --projects...' : 'Search projects...'}
                  value={searchQuery}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                  className={`pl-10 font-mono macos-input bg-dark-secondary border-alpha-border alpha-text`}
                />
              </div>
              <div className="flex flex-wrap gap-2 items-center">
                <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as AirdropType | 'all')}>
                  <SelectTrigger className={`w-[130px] font-mono macos-input bg-dark-secondary border-alpha-border alpha-text`}>
                    <Filter className={`h-4 w-4 mr-2 alpha-text-muted`} /><SelectValue placeholder="ALL_TYPES" />
                  </SelectTrigger>
                  <SelectContent className={`font-mono macos-popover bg-dark-secondary border-alpha-border`}>
                    <SelectItem value="all">ALL_TYPES</SelectItem>
                    {AIRDROP_TYPES.map(t => <SelectItem key={t} value={t}>{t.toUpperCase()}</SelectItem>)}
                  </SelectContent>
                </Select>

                <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as AirdropStatus | 'all')}>
                  <SelectTrigger className={`w-[130px] font-mono macos-input bg-dark-secondary border-alpha-border alpha-text`}>
                    <SelectValue placeholder="ALL_STATUS" />
                  </SelectTrigger>
                  <SelectContent className={`font-mono macos-popover bg-dark-secondary border-alpha-border`}>
                    <SelectItem value="all">ALL_STATUS</SelectItem>
                    {AIRDROP_STATUSES.map(s => <SelectItem key={s} value={s}>{s.toUpperCase()}</SelectItem>)}
                  </SelectContent>
                </Select>

                {/* View toggle */}
                <div className={`flex rounded p-1 bg-dark-secondary border border-alpha-border`}>
                  {(['grid', 'list'] as const).map((mode) => (
                    <Button key={mode} variant={viewMode === mode ? 'default' : 'ghost'} size="icon"
                      onClick={() => setViewMode(mode)}
                      className={`rounded font-mono transition-all duration-200 ${viewMode === mode ? 'bg-gold text-dark-bg' : 'alpha-text-muted hover:bg-gold/10 hover:text-gold'}`}>
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
          <div className={`relative p-12 macos-card text-center anim-fade`}>
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 border border-alpha-border opacity-50">
              <Search className="h-10 w-10 alpha-text-muted" />
            </div>
            <h3 className={`text-xl font-mono font-bold mb-2 alpha-text`}>{isDark ? '> NO_DATA_FOUND' : 'No airdrops found'}</h3>
            <p className={`font-mono text-sm mb-4 alpha-text-muted`}>{isDark ? 'Initialize new project tracking...' : 'Start tracking your first airdrop'}</p>
            <Button onClick={() => setIsAddModalOpen(true)}
              className={`font-mono macos-btn macos-btn--primary bg-gold text-dark-bg hover:bg-gold-hover`}>
              <Plus className="h-4 w-4 mr-2" />{isDark ? 'INIT_PROJECT()' : 'Add Your First Airdrop'}
            </Button>
          </div>
        ) : viewMode === 'list' ? (
          // <<< CHANGE: make card overflow-visible so row popovers can escape the card
          <div className={`macos-card overflow-visible anim-fade`}>
            <div className="overflow-x-auto">
              <table className="w-full macos-table">
                <thead>
                  <tr className={`border-b bg-dark-secondary border-alpha-border`}>
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
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
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
                isDark={isDark}
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
      <AirdropModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddAirdrop}
        mode="add"
        isDark={isDark}
      />
      <AirdropModal
        isOpen={!!editingAirdrop}
        onClose={() => setEditingAirdrop(null)}
        onSubmit={handleEditAirdrop}
        mode="edit"
        airdrop={editingAirdrop}
        isDark={isDark}
      />
      <DeleteConfirmModal
        isOpen={!!deletingAirdrop}
        onClose={() => setDeletingAirdrop(null)}
        onConfirm={handleDeleteAirdrop}
        projectName={deletingAirdrop?.projectName}
        isDark={isDark}
      />

      {priorityAirdrop && (
        <AirdropModal
          isOpen={!!priorityAirdrop}
          onClose={() => setPriorityAirdrop(null)}
          onSubmit={handleEditAirdrop}
          mode="edit"
          airdrop={priorityAirdrop}
          isDark={isDark}
        />
      )}

      <WalletConnectModal isOpen={isWalletModalOpen} onClose={() => setIsWalletModalOpen(false)} />
      <EligibilityModal isOpen={isEligibilityModalOpen} onClose={() => setIsEligibilityModalOpen(false)} />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <DashboardContent />
    </DashboardLayout>
  );
}
