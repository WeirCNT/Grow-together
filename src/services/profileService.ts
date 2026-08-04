import { supabase } from '@/lib/supabase'
import type { Profile } from '@/types'

export async function getProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) return null
  return data as Profile
}

export async function updateProfile(
  userId: string,
  updates: { full_name?: string; avatar?: string | null }
): Promise<Profile> {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates as any)
    .eq('id', userId)
    .select()
    .single()

  if (error) throw error
  return data as Profile
}
