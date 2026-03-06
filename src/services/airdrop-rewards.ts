import { supabase } from "@/lib/supabase";
import type { AirdropReward, AirdropRewardInput } from "@/types";

const mapRewardRow = (item: any): AirdropReward => ({
  id: item.id,
  userId: item.user_id,
  airdropId: item.airdrop_id,
  claimStatus: item.claim_status,
  amountUsd: Number(item.amount_usd ?? 0),
  tokenAmount: item.token_amount == null ? null : Number(item.token_amount),
  tokenSymbol: item.token_symbol ?? null,
  tgeDate: item.tge_date ?? null,
  claimedAt: item.claimed_at ?? null,
  notes: item.notes ?? null,
  createdAt: item.created_at,
  updatedAt: item.updated_at,
});

export async function getAirdropRewardsByUserId(userId: string): Promise<AirdropReward[]> {
  const { data, error } = await supabase
    .from("airdrop_rewards")
    .select("*")
    .eq("user_id", userId)
    .order("claimed_at", { ascending: false, nullsFirst: false })
    .order("updated_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data || []).map(mapRewardRow);
}

export async function upsertAirdropReward(userId: string, reward: AirdropRewardInput): Promise<AirdropReward> {
  const { data, error } = await supabase
    .from("airdrop_rewards")
    .upsert(
      {
        user_id: userId,
        airdrop_id: reward.airdropId,
        claim_status: reward.claimStatus,
        amount_usd: reward.amountUsd,
        token_amount: reward.tokenAmount ?? null,
        token_symbol: reward.tokenSymbol?.trim() || null,
        tge_date: reward.tgeDate || null,
        claimed_at: reward.claimedAt || null,
        notes: reward.notes?.trim() || null,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "user_id,airdrop_id",
      }
    )
    .select()
    .single();

  if (error) {
    throw error;
  }

  return mapRewardRow(data);
}

export async function deleteAirdropReward(id: string) {
  const { error } = await supabase
    .from("airdrop_rewards")
    .delete()
    .eq("id", id);

  if (error) {
    throw error;
  }
}
