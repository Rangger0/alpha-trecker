import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getAirdropsByUserId } from '@/services/database';
import { useAirdropRewards } from '@/hooks/use-airdrop-rewards';
import type { Airdrop } from '@/types';

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

const parseProjectDate = (value?: string) => {
  if (!value) return null;

  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split('-').map(Number);
    return new Date(year, month - 1, day);
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;

  return new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
};

const formatFunding = (value: number) => {
  if (value <= 0) return '--';
  if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(2)}B`;
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}K`;
  return `$${Math.round(value).toLocaleString('en-US')}`;
};

export function useLandingWorkspaceStats() {
  const { session, isLoading: authLoading } = useAuth();
  const { rewards, loading: rewardsLoading } = useAirdropRewards();
  const [airdrops, setAirdrops] = useState<Airdrop[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const loadProjects = async () => {
      if (!session?.user) {
        setAirdrops([]);
        setLoadingProjects(false);
        return;
      }

      setLoadingProjects(true);

      try {
        const data = await getAirdropsByUserId(session.user.id);
        if (!cancelled) setAirdrops(data);
      } catch (error) {
        console.error('Failed to load landing workspace stats:', error);
        if (!cancelled) setAirdrops([]);
      } finally {
        if (!cancelled) setLoadingProjects(false);
      }
    };

    loadProjects();

    return () => {
      cancelled = true;
    };
  }, [session?.user]);

  return useMemo(() => {
    const isAuthenticated = Boolean(session?.user);
    const loading = authLoading || loadingProjects || rewardsLoading;
    const priorityProjects = airdrops.filter((airdrop) => Boolean(airdrop.isPriority || airdrop.is_priority)).length;
    const trackedWallets = new Set(airdrops.map((airdrop) => airdrop.walletAddress?.trim()).filter(Boolean)).size;
    const claimedRewards = rewards.filter((reward) => reward.claimStatus === 'Claimed');
    const claimedTotal = claimedRewards.reduce((sum, reward) => sum + reward.amountUsd, 0);
    const fundingTotal = airdrops.reduce((sum, airdrop) => sum + parseFundingAmount(airdrop.funding), 0);
    const activeAirdrops = airdrops.filter((airdrop) => airdrop.status === 'Ongoing').length;

    const today = new Date();
    const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const end = new Date(start);
    end.setDate(end.getDate() + 7);

    const weeklyDeadlines = airdrops.reduce((total, airdrop) => {
      const date = parseProjectDate(airdrop.deadline ?? airdrop.createdAt);
      if (!date) return total;
      return date.getTime() >= start.getTime() && date.getTime() <= end.getTime() ? total + 1 : total;
    }, 0);

    const opportunityScore = airdrops.length === 0
      ? null
      : Math.round(
          (priorityProjects / Math.max(airdrops.length, 1)) * 45 +
          (activeAirdrops / Math.max(airdrops.length, 1)) * 35 +
          (weeklyDeadlines > 0 ? 20 : 0)
        );

    return {
      isAuthenticated,
      loading,
      projects: airdrops.length,
      priorityProjects,
      trackedWallets,
      activeAirdrops,
      weeklyDeadlines,
      claimedRewards: claimedRewards.length,
      claimedTotal,
      fundingTotal,
      fundingLabel: formatFunding(fundingTotal),
      opportunityScore,
    };
  }, [airdrops, authLoading, loadingProjects, rewards, rewardsLoading, session?.user]);
}
