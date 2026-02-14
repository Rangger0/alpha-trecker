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
        project_logo: data.projectLogo,
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

  // Transformasi snake_case ke camelCase
  return (data || []).map(item => ({
    id: item.id,
    userId: item.user_id,
    projectName: item.project_name,        // snake → camel
    projectLogo: item.project_logo,        // snake → camel  
    type: item.type,
    status: item.status,
    platformLink: item.platform_link,      // snake → camel
    twitterUsername: item.twitter_username, // snake → camel
    walletAddress: item.wallet_address,    // snake → camel
    notes: item.notes,
    tasks: item.tasks || [],
    createdAt: item.created_at,            // snake → camel
    updatedAt: item.updated_at,            // snake → camel
  }));
}

export async function deleteAirdrop(id: string) {
  const { error } = await supabase
    .from("airdrops")
    .delete()
    .eq("id", id);

  if (error) throw error;
}