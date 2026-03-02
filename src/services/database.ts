// ALPHA TRACKER - Supabase Database Service

import { supabase } from "@/lib/supabase";
import type { Airdrop } from "@/types";

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
        notes: data.notes,
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
  return (data || []).map(item => ({
    id: item.id,
    userId: item.user_id,
    projectName: item.project_name,
    projectLogo: item.project_logo,
    type: item.type,
    status: item.status,
    platformLink: item.platform_link,
    twitterUsername: item.twitter_username,
    walletAddress: item.wallet_address,
    notes: item.notes,
    tasks: item.tasks || [],
    createdAt: item.created_at,
    updatedAt: item.updated_at,
    priority: item.priority,
    deadline: item.deadline,
    isPriority: item.is_priority,
    ecosystemId: item.ecosystem_id,  // <-- NEW
  }));
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
      notes: data.notes,
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