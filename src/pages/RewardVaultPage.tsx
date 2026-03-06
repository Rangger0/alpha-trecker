import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  Coins,
  Gem,
  Hourglass,
  Search,
  Sparkles,
  Trophy,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { RewardPerformancePanel } from "@/components/rewards/RewardPerformancePanel";
import { AirdropRewardModal } from "@/components/modals/AirdropRewardModal";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTheme } from "@/contexts/ThemeContext";
import { useAirdrops } from "@/hooks/use-airdrops";
import { useAirdropRewards } from "@/hooks/use-airdrop-rewards";
import { supabase } from "@/lib/supabase";
import type { Airdrop, AirdropRewardInput, RewardClaimStatus } from "@/types";
import { toast } from "sonner";
import { motion } from "framer-motion";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: value >= 1000 ? 0 : 2,
  }).format(value);

const formatDisplayDate = (value?: string | null) => {
  if (!value) return "--";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

type RewardRow = {
  airdrop: Airdrop;
  reward: ReturnType<typeof useAirdropRewards>["rewards"][number] | undefined;
};

export function RewardVaultPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { airdrops, loading: loadingAirdrops, refetch: refetchAirdrops } = useAirdrops();
  const {
    rewards,
    rewardMap,
    loading: loadingRewards,
    error: rewardError,
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
          (reward?.tokenSymbol || "").toLowerCase().includes(query);

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
  const bestReward = claimedRewards.reduce((best, reward) => (reward.amountUsd > best ? reward.amountUsd : best), 0);
  const pendingCount = rows.filter(({ reward }) => !reward || reward.claimStatus === "Pending TGE").length;

  const selectedReward = selectedAirdrop ? rewardMap.get(selectedAirdrop.id) ?? null : null;

  const loading = loadingAirdrops || loadingRewards;

  const getRewardErrorMessage = (error: unknown) => {
    const message = error instanceof Error ? error.message : "";
    const code = typeof error === "object" && error !== null && "code" in error ? String((error as { code?: string }).code) : "";

    if (code === "PGRST205" || message.includes("public.airdrop_rewards")) {
      return "Tabel reward belum ada di Supabase. Jalankan file SQL `supabase/migrations/20260306_create_airdrop_rewards.sql` dulu.";
    }

    return message || "Gagal menyimpan reward ke database.";
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

      await saveReward(payload);

      if (activeAirdrop) {
        await syncAirdropStatusFromReward(activeAirdrop, payload);
        await refetchAirdrops();
      }

      toast.success("Reward berhasil disimpan.");
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
      toast.success("Reward record dihapus.");
      setSelectedAirdrop(null);
    } catch (error) {
      console.error(error);
      toast.error(getRewardErrorMessage(error));
      throw error;
    }
  };

  const summaryCards = [
    { label: "Realized income", value: formatCurrency(totalEarned), icon: Coins, tone: "text-gold", accent: "#F59E0B" },
    { label: "Claimed projects", value: String(claimedRewards.length).padStart(2, "0"), icon: CheckCircle2, tone: "text-[#10B981]", accent: "#10B981" },
    { label: "Pending TGE", value: String(pendingCount).padStart(2, "0"), icon: Hourglass, tone: "text-[#3B82F6]", accent: "#3B82F6" },
    { label: "Best payout", value: formatCurrency(bestReward), icon: Trophy, tone: "text-[#F59E0B]", accent: "#F59E0B" },
  ];

  return (
    <DashboardLayout>
      <div className="min-h-screen font-mono alpha-bg alpha-text">
        <main className="w-full px-8 py-8">
          <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-alpha-border bg-black/5 px-3 py-1 text-[10px] uppercase tracking-[0.28em] alpha-text-muted dark:bg-white/[0.04]">
                <Sparkles className="h-3.5 w-3.5 text-gold" />
                New sidebar module
              </div>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight alpha-text">Reward Vault</h1>
              <p className="mt-2 max-w-2xl text-sm alpha-text-muted">
                Catat TGE, hasil claim, dan income per project langsung ke database. Saat reward sudah claimed, project akan ikut pindah ke status selesai.
              </p>
            </div>

            <div className="flex w-full flex-col gap-3 sm:flex-row lg:max-w-xl">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 alpha-text-muted" />
                <Input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search project, token, or username..."
                  className="macos-input pl-10"
                />
              </div>

              <Select value={claimFilter} onValueChange={(value) => setClaimFilter(value as RewardClaimStatus | "all" | "untracked")}>
                <SelectTrigger className="w-full sm:w-[180px] macos-input">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="macos-popover">
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="Claimed">Claimed</SelectItem>
                  <SelectItem value="Pending TGE">Pending TGE</SelectItem>
                  <SelectItem value="Missed">Missed</SelectItem>
                  <SelectItem value="untracked">Not recorded</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {rewardError?.includes("public.airdrop_rewards") ? (
            <div className="mb-8 rounded-2xl border border-[#EF4444]/25 bg-[#EF4444]/10 px-5 py-4 text-sm text-[#FCA5A5]">
              Tabel `airdrop_rewards` belum ada di Supabase. Jalankan migration file
              {" "}
              <span className="font-semibold text-white">supabase/migrations/20260306_create_airdrop_rewards.sql</span>
              {" "}
              dulu, baru fitur save reward bisa dipakai.
            </div>
          ) : null}

          <div className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {summaryCards.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`macos-premium-card relative p-5 overflow-hidden group ${
                  isDark ? "bg-[#161B22] border-[#1F2937]" : "bg-white border-[#E5E7EB]"
                }`}
                style={{ borderLeft: `3px solid ${item.accent}` }}
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-lg"
                  style={{ background: `linear-gradient(135deg, ${item.accent}08 0%, transparent 50%)` }}
                />
                <div className="relative z-10 flex items-center justify-between">
                  <p className="text-[11px] uppercase tracking-[0.22em] alpha-text-muted">{item.label}</p>
                  <item.icon className={`h-5 w-5 ${item.tone}`} />
                </div>
                <p className={`mt-4 text-3xl font-semibold ${item.tone}`}>{item.value}</p>
              </motion.div>
            ))}
          </div>

          <RewardPerformancePanel rewards={rewards} isDark={isDark} className="mb-8" />

          <div className="bg-transparent">
            <div className="mb-6 flex items-center justify-between px-1">
              <div>
              <h2 className="text-xl font-semibold alpha-text">Tracked payouts</h2>
              <p className="mt-1 text-sm alpha-text-muted">
                {filteredRows.length} project{filteredRows.length === 1 ? "" : "s"} ready for reward tracking.
              </p>
              </div>
            </div>

            {loading ? (
              <div className="px-5 py-12 text-center text-sm alpha-text-muted">Loading reward vault...</div>
            ) : filteredRows.length === 0 ? (
              <div className="px-5 py-12 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-dashed border-alpha-border bg-black/5 text-gold dark:bg-white/[0.04]">
                  <Gem className="h-6 w-6" />
                </div>
                <p className="mt-4 text-lg font-medium alpha-text">No matching projects</p>
                <p className="mt-2 text-sm alpha-text-muted">Try another keyword or change the reward status filter.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredRows.map(({ airdrop, reward }, index) => {
                  let statusColor = "#6B7280";
                  if (reward?.claimStatus === "Claimed") statusColor = "#F59E0B";
                  else if (reward?.claimStatus === "Pending TGE") statusColor = "#3B82F6";
                  else if (reward?.claimStatus === "Missed") statusColor = "#EF4444";

                  return (
                    <motion.div
                      key={airdrop.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => setSelectedAirdrop(airdrop)}
                      className={`macos-premium-card relative p-5 overflow-hidden group cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
                        isDark ? "bg-[#161B22] border-[#1F2937]" : "bg-white border-[#E5E7EB]"
                      }`}
                      style={{ borderLeft: `3px solid ${statusColor}` }}
                    >
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-lg"
                        style={{ background: `linear-gradient(135deg, ${statusColor}08 0%, transparent 50%)` }}
                      />

                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 flex items-center justify-center overflow-hidden rounded-lg border border-alpha-border bg-white/70 dark:bg-black/10">
                            {airdrop.projectLogo ? (
                              <img src={airdrop.projectLogo} alt={airdrop.projectName} className="h-full w-full object-cover" />
                            ) : (
                              <span className="text-sm font-semibold alpha-text">{airdrop.projectName.slice(0, 1).toUpperCase()}</span>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold alpha-text max-w-[120px]">{airdrop.projectName}</p>
                            <p className="text-[10px] alpha-text-muted truncate">{airdrop.type}</p>
                          </div>
                        </div>
                        <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all duration-300 text-alpha-muted" />
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                        <div className="p-2 rounded bg-black/5 dark:bg-white/5 border border-alpha-border/50">
                          <p className="text-[10px] uppercase alpha-text-muted">Status</p>
                          <p className="font-medium mt-1 truncate" style={{ color: statusColor }}>{reward?.claimStatus || "Untracked"}</p>
                        </div>
                        <div className="p-2 rounded bg-black/5 dark:bg-white/5 border border-alpha-border/50">
                          <p className="text-[10px] uppercase alpha-text-muted">Income</p>
                          <p className={`font-medium mt-1 ${reward ? "text-gold" : "alpha-text-muted"}`}>{reward ? formatCurrency(reward.amountUsd) : "-"}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[10px] alpha-text-muted pt-2 border-t border-alpha-border/50">
                        <div className="flex items-center gap-1">
                           <CalendarDays className="w-3 h-3" />
                           <span>{formatDisplayDate(reward?.tgeDate ?? airdrop.deadline)}</span>
                        </div>
                        {reward?.tokenSymbol && (
                           <span className="font-mono">{reward.tokenAmount} {reward.tokenSymbol}</span>
                        )}
                      </div>
                    </motion.div>
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
