import { supabase } from '@/lib/supabase';
import type { Ecosystem, EcosystemData } from '@/types';

export type { EcosystemData };

/**
 * Note:
 * - This file keeps backward compatibility with an "icon" field,
 *   but prefers storing/returning "project_logo" (public URL/path) as `logo`.
 * - Ensure your DB has a column named "project_logo" (or change mapping below
 *   to the actual column name you use).
 */

export async function createEcosystem(data: EcosystemData, userId: string): Promise<Ecosystem> {
  const { data: newEcosystem, error } = await supabase
    .from('ecosystems')
    .insert({
      user_id: userId,
      name: data.name,
      description: data.description,
      // store public logo URL/path in project_logo; use icon as fallback
      project_logo: (data as any).logo ?? data.icon ?? null,
      icon: data.icon ?? null,
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
    // expose as `logo` for components that expect ecosystem.logo
    logo: newEcosystem.project_logo ?? newEcosystem.icon ?? null,
    icon: newEcosystem.icon ?? null,
    color: newEcosystem.color,
    createdAt: newEcosystem.created_at,
    updatedAt: newEcosystem.updated_at,
  } as Ecosystem;
}

export async function getEcosystemsByUserId(userId: string): Promise<Ecosystem[]> {
  const { data, error } = await supabase
    .from('ecosystems')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return (data || []).map((item: any) => ({
    id: item.id,
    userId: item.user_id,
    name: item.name,
    description: item.description,
    // normalize: prefer project_logo column, fallback to icon
    logo: item.project_logo ?? item.icon ?? null,
    icon: item.icon ?? null,
    color: item.color,
    createdAt: item.created_at,
    updatedAt: item.updated_at,
  })) as Ecosystem[];
}

export async function updateEcosystem(id: string, data: Partial<EcosystemData>): Promise<Ecosystem> {
  const { data: updated, error } = await supabase
    .from('ecosystems')
    .update({
      name: data.name,
      description: data.description,
      // allow caller to set `logo` or `icon`; store logo into project_logo column
      project_logo: (data as any).logo ?? (data as any).projectLogo ?? data.icon ?? null,
      icon: data.icon ?? null,
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
    logo: updated.project_logo ?? updated.icon ?? null,
    icon: updated.icon ?? null,
    color: updated.color,
    createdAt: updated.created_at,
    updatedAt: updated.updated_at,
  } as Ecosystem;
}

export async function deleteEcosystem(id: string): Promise<void> {
  const { error } = await supabase
    .from('ecosystems')
    .delete()
    .eq('id', id);

  if (error) throw error;
}