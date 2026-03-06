import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import type { AirdropReward, AirdropRewardInput } from "@/types";
import {
  deleteAirdropReward,
  getAirdropRewardsByUserId,
  upsertAirdropReward,
} from "@/services/airdrop-rewards";

export function useAirdropRewards() {
  const { session } = useAuth();
  const user = session?.user;
  const [rewards, setRewards] = useState<AirdropReward[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadRewards = useCallback(async () => {
    if (!user) {
      setRewards([]);
      setLoading(false);
      return;
    }

    try {
      const data = await getAirdropRewardsByUserId(user.id);
      setRewards(data);
      setError(null);
    } catch (error) {
      console.error("Failed to load airdrop rewards:", error);
      setError(error instanceof Error ? error.message : "Failed to load airdrop rewards");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadRewards();
  }, [loadRewards]);

  const saveReward = useCallback(async (payload: AirdropRewardInput) => {
    if (!user) {
      throw new Error("No active user session");
    }

    const savedReward = await upsertAirdropReward(user.id, payload);
    setRewards((prev) => {
      const next = prev.filter((reward) => reward.airdropId !== savedReward.airdropId);
      return [savedReward, ...next];
    });
    setError(null);
    return savedReward;
  }, [user]);

  const removeReward = useCallback(async (id: string) => {
    await deleteAirdropReward(id);
    setRewards((prev) => prev.filter((reward) => reward.id !== id));
    setError(null);
  }, []);

  const rewardMap = useMemo(
    () => new Map(rewards.map((reward) => [reward.airdropId, reward])),
    [rewards]
  );

  return {
    rewards,
    rewardMap,
    loading,
    error,
    refetch: loadRewards,
    saveReward,
    removeReward,
  };
}
