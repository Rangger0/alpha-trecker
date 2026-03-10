import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import type { AirdropReward, AirdropRewardInput } from "@/types";
import {
  REWARD_FINANCE_SCHEMA_WARNING,
  deleteAirdropReward,
  getAirdropRewardsByUserId,
  upsertAirdropReward,
} from "@/services/airdrop-rewards";

const getSchemaWarning = (rewards: AirdropReward[]) =>
  rewards.some((reward) => reward.storageMode === "legacy_notes")
    ? REWARD_FINANCE_SCHEMA_WARNING
    : null;

export function useAirdropRewards() {
  const { session } = useAuth();
  const user = session?.user;
  const [rewards, setRewards] = useState<AirdropReward[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [schemaWarning, setSchemaWarning] = useState<string | null>(null);

  const loadRewards = useCallback(async () => {
    if (!user) {
      setRewards([]);
      setError(null);
      setSchemaWarning(null);
      setLoading(false);
      return;
    }

    try {
      const data = await getAirdropRewardsByUserId(user.id);
      setRewards(data);
      setError(null);
      setSchemaWarning(getSchemaWarning(data));
    } catch (error) {
      console.error("Failed to load airdrop rewards:", error);
      setError(error instanceof Error ? error.message : "Failed to load airdrop rewards");
      setSchemaWarning(null);
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

    try {
      const savedReward = await upsertAirdropReward(user.id, payload);
      const nextRewards = [
        savedReward,
        ...rewards.filter((reward) => reward.airdropId !== savedReward.airdropId),
      ];

      setRewards(nextRewards);
      setError(null);
      setSchemaWarning(getSchemaWarning(nextRewards));
      return savedReward;
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to save airdrop reward");
      throw error;
    }
  }, [user, rewards]);

  const removeReward = useCallback(async (id: string) => {
    try {
      await deleteAirdropReward(id);
      const nextRewards = rewards.filter((reward) => reward.id !== id);
      setRewards(nextRewards);
      setError(null);
      setSchemaWarning(getSchemaWarning(nextRewards));
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to delete airdrop reward");
      throw error;
    }
  }, [rewards]);

  const rewardMap = useMemo(
    () => new Map(rewards.map((reward) => [reward.airdropId, reward])),
    [rewards]
  );

  return {
    rewards,
    rewardMap,
    loading,
    error,
    schemaWarning,
    refetch: loadRewards,
    saveReward,
    removeReward,
  };
}
