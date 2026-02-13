// ALPHA TRACKER - Supabase Database Service

import { supabase } from "@/lib/supabase";
import type { Airdrop } from "@/types";

/* ============================= */
/*        AIRDROP METHODS        */
/* ============================= */

export async function createAirdrop(data: any, userId: string) {
  const { data: result, error } = await supabase
    .from("airdrops")
    .insert([
      {
        user_id: userId,
        project_name: data.projectName,
        type: data.type,
        status: data.status,
        platform_link: data.platformLink,
        twitter_username: data.twitterUsername,
        wallet_address: data.walletAddress,
        notes: data.notes,
        tasks: data.tasks || [],
      },
    ])
    .select()
    .single();

  if (error) throw error;

  return result;
}

export async function getAirdropsByUserId(userId: string): Promise<Airdrop[]> {
  const { data, error } = await supabase
    .from("airdrops")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data || [];
}

export async function deleteAirdrop(id: string) {
  const { error } = await supabase
    .from("airdrops")
    .delete()
    .eq("id", id);

  if (error) throw error;
}
