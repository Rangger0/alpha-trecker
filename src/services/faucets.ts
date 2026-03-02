import { supabase } from '@/lib/supabase';
import type { Faucet } from '@/types';

export interface FaucetData {
  projectName: string;
  url: string;
  logo?: string;  // NEW: Tambah logo
}

export async function createFaucet(data: FaucetData, userId: string): Promise<Faucet> {
  const { data: result, error } = await supabase
    .from('faucets')
    .insert([{ 
      user_id: userId,
      project_name: data.projectName,
      url: data.url,
      logo: data.logo,
    }])
    .select()
    .single();
  
  if (error) throw error;
  
  // Transform snake_case ke camelCase
  return {
    id: result.id,
    userId: result.user_id,
    projectName: result.project_name,
    url: result.url,
    logo: result.logo,
    createdAt: result.created_at,
    updatedAt: result.updated_at,
  };
}

export async function getFaucetsByUserId(userId: string): Promise<Faucet[]> {
  const { data, error } = await supabase
    .from('faucets')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  
  // Transform snake_case ke camelCase
  return (data || []).map(item => ({
    id: item.id,
    userId: item.user_id,
    projectName: item.project_name,
    url: item.url,
    logo: item.logo,
    createdAt: item.created_at,
    updatedAt: item.updated_at,
  }));
}

export async function updateFaucet(id: string, data: Partial<FaucetData>): Promise<Faucet> {
  const { data: result, error } = await supabase
    .from('faucets')
    .update({
      project_name: data.projectName,
      url: data.url,
      logo: data.logo,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  
  return {
    id: result.id,
    userId: result.user_id,
    projectName: result.project_name,
    url: result.url,
    logo: result.logo,
    createdAt: result.created_at,
    updatedAt: result.updated_at,
  };
}

export async function deleteFaucet(id: string): Promise<void> {
  const { error } = await supabase
    .from('faucets')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
}