import { supabase } from '@/lib/supabase';
import type { Ecosystem, EcosystemData } from '@/types';

export type { EcosystemData };

export async function createEcosystem(data: EcosystemData, userId: string): Promise<Ecosystem> {
  const { data: newEcosystem, error } = await supabase
    .from('ecosystems')
    .insert({
      user_id: userId,
      name: data.name,
      description: data.description,
      icon: data.icon,
      color: data.color,
    })
    .select()
    .single();

  if (error) throw error;

  return {
    id: newEcosystem.id,
    userId: newEcosystem.user_id,
    name: newEcosystem.name,
    description: newEcosystem.description,
    icon: newEcosystem.icon,
    color: newEcosystem.color,
    createdAt: newEcosystem.created_at,
    updatedAt: newEcosystem.updated_at,
  };
}

export async function getEcosystemsByUserId(userId: string): Promise<Ecosystem[]> {
  const { data, error } = await supabase
    .from('ecosystems')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return (data || []).map(item => ({
    id: item.id,
    userId: item.user_id,
    name: item.name,
    description: item.description,
    icon: item.icon,
    color: item.color,
    createdAt: item.created_at,
    updatedAt: item.updated_at,
  }));
}

export async function updateEcosystem(id: string, data: Partial<EcosystemData>): Promise<Ecosystem> {
  const { data: updated, error } = await supabase
    .from('ecosystems')
    .update({
      name: data.name,
      description: data.description,
      icon: data.icon,
      color: data.color,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;

  return {
    id: updated.id,
    userId: updated.user_id,
    name: updated.name,
    description: updated.description,
    icon: updated.icon,
    color: updated.color,
    createdAt: updated.created_at,
    updatedAt: updated.updated_at,
  };
}

export async function deleteEcosystem(id: string): Promise<void> {
  const { error } = await supabase
    .from('ecosystems')
    .delete()
    .eq('id', id);

  if (error) throw error;
}