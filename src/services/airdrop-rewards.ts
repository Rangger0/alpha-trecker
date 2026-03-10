import { supabase } from "@/lib/supabase";
import type { AirdropReward, AirdropRewardInput } from "@/types";

const LEGACY_FINANCE_PREFIX = "__alpha_reward_finance__=";

export const REWARD_FINANCE_SCHEMA_WARNING =
  "Schema reward Supabase belum lengkap. Jalankan `supabase/migrations/20260306_create_airdrop_rewards.sql` lalu `supabase/migrations/20260308_extend_airdrop_rewards_finance.sql`.";

type RewardRowRecord = {
  id: string;
  user_id: string;
  airdrop_id: string;
  claim_status: AirdropReward["claimStatus"];
  amount_usd: number | string | null;
  capital_usd?: number | string | null;
  fee_usd?: number | string | null;
  token_amount?: number | string | null;
  token_symbol?: string | null;
  tge_date?: string | null;
  claimed_at?: string | null;
  notes?: string | null;
  created_at: string;
  updated_at: string;
};

const toFiniteNumber = (value: unknown) => {
  if (value == null || value === "") return null;

  const nextValue = typeof value === "number" ? value : Number(value);
  return Number.isFinite(nextValue) ? nextValue : null;
};

const normalizeNotes = (value: unknown) => {
  if (typeof value !== "string") return null;

  const trimmedValue = value.trim();
  return trimmedValue ? trimmedValue.replace(/\r\n/g, "\n") : null;
};

const extractLegacyFinance = (rawNotes: unknown) => {
  const normalizedNotes = normalizeNotes(rawNotes);

  if (!normalizedNotes || !normalizedNotes.startsWith(LEGACY_FINANCE_PREFIX)) {
    return {
      capitalUsd: null as number | null,
      feeUsd: null as number | null,
      notes: normalizedNotes,
      usesLegacyStorage: false,
    };
  }

  const newlineIndex = normalizedNotes.indexOf("\n");
  const payloadText = normalizedNotes.slice(
    LEGACY_FINANCE_PREFIX.length,
    newlineIndex === -1 ? normalizedNotes.length : newlineIndex
  );
  const remainingNotes = newlineIndex === -1 ? null : normalizeNotes(normalizedNotes.slice(newlineIndex + 1));

  try {
    const payload = JSON.parse(payloadText) as {
      capitalUsd?: unknown;
      feeUsd?: unknown;
    };

    return {
      capitalUsd: toFiniteNumber(payload.capitalUsd),
      feeUsd: toFiniteNumber(payload.feeUsd),
      notes: remainingNotes,
      usesLegacyStorage: true,
    };
  } catch {
    return {
      capitalUsd: null as number | null,
      feeUsd: null as number | null,
      notes: normalizedNotes,
      usesLegacyStorage: false,
    };
  }
};

const encodeLegacyFinanceNotes = (
  notes: string | null | undefined,
  capitalUsd: number,
  feeUsd: number
) => {
  const cleanNotes = extractLegacyFinance(notes).notes;
  const financePayload = JSON.stringify({
    capitalUsd,
    feeUsd,
  });

  return cleanNotes
    ? `${LEGACY_FINANCE_PREFIX}${financePayload}\n${cleanNotes}`
    : `${LEGACY_FINANCE_PREFIX}${financePayload}`;
};

const resolveFinanceValue = (columnValue: unknown, legacyValue: number | null) => {
  const parsedColumnValue = toFiniteNumber(columnValue);

  if (parsedColumnValue == null) {
    return legacyValue ?? 0;
  }

  if (parsedColumnValue === 0 && legacyValue != null && legacyValue !== 0) {
    return legacyValue;
  }

  return parsedColumnValue;
};

const mapRewardRow = (item: RewardRowRecord): AirdropReward => {
  const legacyFinance = extractLegacyFinance(item.notes);

  return {
    id: item.id,
    userId: item.user_id,
    airdropId: item.airdrop_id,
    claimStatus: item.claim_status,
    amountUsd: toFiniteNumber(item.amount_usd) ?? 0,
    capitalUsd: resolveFinanceValue(item.capital_usd, legacyFinance.capitalUsd),
    feeUsd: resolveFinanceValue(item.fee_usd, legacyFinance.feeUsd),
    tokenAmount: toFiniteNumber(item.token_amount),
    tokenSymbol: item.token_symbol ?? null,
    tgeDate: item.tge_date ?? null,
    claimedAt: item.claimed_at ?? null,
    notes: legacyFinance.notes,
    createdAt: item.created_at,
    updatedAt: item.updated_at,
    storageMode: legacyFinance.usesLegacyStorage ? "legacy_notes" : "modern",
  };
};

const buildBaseRewardPayload = (userId: string, reward: AirdropRewardInput) => ({
  user_id: userId,
  airdrop_id: reward.airdropId,
  claim_status: reward.claimStatus,
  amount_usd: toFiniteNumber(reward.amountUsd) ?? 0,
  token_amount: toFiniteNumber(reward.tokenAmount),
  token_symbol: reward.tokenSymbol?.trim() || null,
  tge_date: reward.tgeDate || null,
  claimed_at: reward.claimedAt || null,
  notes: extractLegacyFinance(reward.notes).notes,
  updated_at: new Date().toISOString(),
});

const isMissingFinanceColumnError = (error: unknown) => {
  const code =
    typeof error === "object" && error !== null && "code" in error
      ? String((error as { code?: string }).code)
      : "";
  const message =
    typeof error === "object" && error !== null && "message" in error
      ? String((error as { message?: string }).message)
      : "";

  return (
    ((code === "PGRST204" || code === "PGRST205") &&
      (message.includes("capital_usd") || message.includes("fee_usd"))) ||
    message.includes("capital_usd") ||
    message.includes("fee_usd")
  );
};

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
  const basePayload = buildBaseRewardPayload(userId, reward);
  const { data, error } = await supabase
    .from("airdrop_rewards")
    .upsert(
      {
        ...basePayload,
        capital_usd: reward.capitalUsd,
        fee_usd: reward.feeUsd,
      },
      {
        onConflict: "user_id,airdrop_id",
      }
    )
    .select()
    .single();

  if (error) {
    if (!isMissingFinanceColumnError(error)) {
      throw error;
    }

    console.warn(
      "Supabase table public.airdrop_rewards belum punya capital_usd/fee_usd. Menyimpan finance data ke notes compatibility mode."
    );

    const { data: legacyData, error: legacyError } = await supabase
      .from("airdrop_rewards")
      .upsert(
        {
          ...basePayload,
          notes: encodeLegacyFinanceNotes(
            reward.notes,
            toFiniteNumber(reward.capitalUsd) ?? 0,
            toFiniteNumber(reward.feeUsd) ?? 0
          ),
        },
        {
          onConflict: "user_id,airdrop_id",
        }
      )
      .select()
      .single();

    if (legacyError) {
      throw legacyError;
    }

    return mapRewardRow(legacyData);
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
