// ALPHA TRACKER - Supabase Database Service

import { supabase } from "@/lib/supabase";
import type { Airdrop, PriorityLevel } from "@/types";

const AIRDROP_META_PATTERN = /\n*\s*<!--alpha-meta:([^>]*)-->\s*$/;

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
    };
  }

  try {
    const parsed = JSON.parse(decodeURIComponent(match[1] ?? "")) as {
      waitlistCount?: unknown;
      funding?: unknown;
      potential?: unknown;
      airdropConfirmed?: unknown;
    };

    return {
      notes: rawNotes.replace(AIRDROP_META_PATTERN, "").trim(),
      waitlistCount: typeof parsed.waitlistCount === "number" ? parsed.waitlistCount : undefined,
      funding: typeof parsed.funding === "string" && parsed.funding.trim() ? parsed.funding.trim() : undefined,
      potential: isPriorityLevel(parsed.potential) ? parsed.potential : undefined,
      airdropConfirmed: typeof parsed.airdropConfirmed === "boolean" ? parsed.airdropConfirmed : undefined,
    };
  } catch {
    return {
      notes: rawNotes.replace(AIRDROP_META_PATTERN, "").trim(),
      waitlistCount: undefined as number | undefined,
      funding: undefined as string | undefined,
      potential: undefined as PriorityLevel | undefined,
      airdropConfirmed: undefined as boolean | undefined,
    };
  }
}

export function buildAirdropNotesWithMeta(data: {
  notes?: string;
  waitlistCount?: number;
  funding?: string;
  potential?: PriorityLevel;
  airdropConfirmed?: boolean;
}) {
  const baseNotes = parseAirdropNotes(data.notes).notes.trim();
  const meta = {
    waitlistCount: typeof data.waitlistCount === "number" ? data.waitlistCount : undefined,
    funding: data.funding?.trim() || undefined,
    potential: data.potential,
    airdropConfirmed: Boolean(data.airdropConfirmed),
  };
  const encoded = encodeURIComponent(JSON.stringify(meta));

  return `${baseNotes}${baseNotes ? "\n\n" : ""}<!--alpha-meta:${encoded}-->`;
}

/* ============================= */
/*        AIRDROP METHODS        */
/* ============================= */

export async function createAirdrop(data: any, userId: string) {
  console.log('Creating airdrop with data:', data);
  
  const { data: result, error } = await supabase
    .from("airdrops")
    .insert([
      {
        user_id: userId,
        project_name: data.projectName,
        project_logo: data.projectLogo,
        type: data.type,
        status: data.status,
        platform_link: data.platformLink,
        twitter_username: data.twitterUsername,
        wallet_address: data.walletAddress,
        notes: buildAirdropNotesWithMeta(data),
        tasks: data.tasks || [],
        priority: data.priority,
        deadline: data.deadline,
        is_priority: data.isPriority,
        ecosystem_id: data.ecosystemId,  // <-- NEW
      },
    ])
    .select()
    .single();

  if (error) {
    console.error('Supabase insert error:', error);
    throw error;
  }

  console.log('Created airdrop result:', result);
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
export async function updateAirdrop(id: string, data: any) {
  const { data: result, error } = await supabase
    .from("airdrops")
    .update({
      project_name: data.projectName,
      project_logo: data.projectLogo,
      type: data.type,
      status: data.status,
      platform_link: data.platformLink,
      twitter_username: data.twitterUsername,
      wallet_address: data.walletAddress,
      notes: buildAirdropNotesWithMeta(data),
      tasks: data.tasks,
      priority: data.priority,
      deadline: data.deadline,
      is_priority: data.isPriority,
      ecosystem_id: data.ecosystemId,  // <-- NEW
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

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
