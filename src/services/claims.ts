// src/services/claims.ts
import { supabase } from '@/lib/supabase';

export async function getAvailableClaims() {
  const { data, error } = await supabase
    .from('claims')
    .select('*')
    .eq('active', true)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data || [];
}

export async function claimAirdrop(claimId: string, userId: string) {
  const { error } = await supabase
    .from('user_claims')
    .insert([{ claim_id: claimId, user_id: userId }]);
  
  if (error) throw error;
}