// ALPHA TRACKER - Supabase Database Service

import { supabase } from "@/lib/supabase";
import type { Airdrop, PriorityLevel } from "@/types";

const AIRDROP_META_PATTERN = /\n*\s*<!--alpha-meta:([^>]*)-->\s*$/;

type AirdropInput = Omit<Airdrop, "id" | "userId" | "createdAt" | "updatedAt">;

function isPriorityLevel(value: unknown): value is PriorityLevel {
  return value === "Low" || value === "Medium" || value === "High";
}

function parseAirdropNotes(value?: string | null) {
  const rawNotes = value ?? "";
  const match = rawNotes.match(AIRDROP_META_PATTERN);

  if (!match) {
    return {
      notes: rawNotes,
      waitlistCount: undefined as number | undefined,
      funding: undefined as string | undefined,
      potential: undefined as PriorityLevel | undefined,
      airdropConfirmed: undefined as boolean | undefined,
      email: undefined as string | undefined,
    };
  }

  try {
    const parsed = JSON.parse(decodeURIComponent(match[1] ?? "")) as {
      waitlistCount?: unknown;
      funding?: unknown;
      potential?: unknown;
      airdropConfirmed?: unknown;
      email?: unknown;
    };

    return {
      notes: rawNotes.replace(AIRDROP_META_PATTERN, "").trim(),
      waitlistCount: typeof parsed.waitlistCount === "number" ? parsed.waitlistCount : undefined,
      funding: typeof parsed.funding === "string" && parsed.funding.trim() ? parsed.funding.trim() : undefined,
      potential: isPriorityLevel(parsed.potential) ? parsed.potential : undefined,
      airdropConfirmed: typeof parsed.airdropConfirmed === "boolean" ? parsed.airdropConfirmed : undefined,
      email: typeof parsed.email === "string" && parsed.email.trim() ? parsed.email.trim() : undefined,
    };
  } catch {
    return {
      notes: rawNotes.replace(AIRDROP_META_PATTERN, "").trim(),
      waitlistCount: undefined as number | undefined,
      funding: undefined as string | undefined,
      potential: undefined as PriorityLevel | undefined,
      airdropConfirmed: undefined as boolean | undefined,
      email: undefined as string | undefined,
    };
  }
}

export function buildAirdropNotesWithMeta(data: {
  notes?: string;
  waitlistCount?: number;
  funding?: string;
  potential?: PriorityLevel;
  airdropConfirmed?: boolean;
  email?: string;
}) {
  const baseNotes = parseAirdropNotes(data.notes).notes.trim();
  const meta = {
    waitlistCount: typeof data.waitlistCount === "number" ? data.waitlistCount : undefined,
    funding: data.funding?.trim() || undefined,
    potential: data.potential,
    airdropConfirmed: Boolean(data.airdropConfirmed),
    email: data.email?.trim() || undefined,
  };
  const encoded = encodeURIComponent(JSON.stringify(meta));

  return `${baseNotes}${baseNotes ? "\n\n" : ""}<!--alpha-meta:${encoded}-->`;
}

const isMissingEmailColumnError = (error: unknown) => {
  if (!error || typeof error !== "object") return false;
  const record = error as { code?: unknown; message?: unknown };
  const message = typeof record.message === "string" ? record.message.toLowerCase() : "";
  return record.code === "PGRST204" && message.includes("email");
};

const buildAirdropPayload = (data: AirdropInput, userId?: string, includeEmail = true) => ({
  ...(userId ? { user_id: userId } : {}),
  project_name: data.projectName,
  project_logo: data.projectLogo,
  type: data.type,
  status: data.status,
  platform_link: data.platformLink,
  twitter_username: data.twitterUsername,
  wallet_address: data.walletAddress,
  ...(includeEmail ? { email: data.email } : {}),
  notes: buildAirdropNotesWithMeta(data),
  tasks: data.tasks || [],
  priority: data.priority,
  deadline: data.deadline,
  is_priority: data.isPriority,
  ecosystem_id: data.ecosystemId,
});

/* ============================= */
/*        AIRDROP METHODS        */
/* ============================= */

export async function createAirdrop(data: AirdropInput, userId: string) {
  const { data: result, error } = await supabase
    .from("airdrops")
    .insert([buildAirdropPayload(data, userId)])
    .select()
    .single();

  if (error) {
    if (isMissingEmailColumnError(error)) {
      const { data: fallbackResult, error: fallbackError } = await supabase
        .from("airdrops")
        .insert([buildAirdropPayload(data, userId, false)])
        .select()
        .single();

      if (fallbackError) throw fallbackError;
      return fallbackResult;
    }

    console.error('Supabase insert error:', error);
    throw error;
  }

  return result;
}

export async function getAirdropsByUserId(userId: string): Promise<Airdrop[]> {
  const { data, error } = await supabase
    .from("airdrops")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  // Transformasi snake_case ke camelCase
  return (data || []).map(item => {
    const meta = parseAirdropNotes(item.notes);

    return {
      id: item.id,
      userId: item.user_id,
      projectName: item.project_name,
      projectLogo: item.project_logo,
      type: item.type,
      status: item.status,
      platformLink: item.platform_link,
      twitterUsername: item.twitter_username,
      walletAddress: item.wallet_address,
      email: item.email ?? meta.email ?? "",
      notes: meta.notes,
      tasks: item.tasks || [],
      createdAt: item.created_at,
      updatedAt: item.updated_at,
      priority: item.priority,
      deadline: item.deadline,
      waitlistCount: item.waitlist_count ?? meta.waitlistCount,
      funding: item.funding ?? meta.funding,
      potential: item.potential ?? meta.potential,
      airdropConfirmed: item.airdrop_confirmed ?? meta.airdropConfirmed,
      isPriority: item.is_priority,
      ecosystemId: item.ecosystem_id,  // <-- NEW
    };
  });
}

export async function deleteAirdrop(id: string) {
  const { error } = await supabase
    .from("airdrops")
    .delete()
    .eq("id", id);

  if (error) throw error;
}

// Update airdrop lengkap
export async function updateAirdrop(id: string, data: AirdropInput) {
  const { data: result, error } = await supabase
    .from("airdrops")
    .update({
      ...buildAirdropPayload(data),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error && isMissingEmailColumnError(error)) {
    const { data: fallbackResult, error: fallbackError } = await supabase
      .from("airdrops")
      .update({
        ...buildAirdropPayload(data, undefined, false),
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (fallbackError) throw fallbackError;
    return fallbackResult;
  }

  if (error) throw error;
  return result;
}

// NEW: Update hanya ecosystem_id
export async function updateAirdropEcosystem(id: string, ecosystemId: string | null) {
  const { error } = await supabase
    .from("airdrops")
    .update({ 
      ecosystem_id: ecosystemId,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) throw error;
}
