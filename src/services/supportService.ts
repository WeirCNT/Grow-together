import { supabase } from '@/lib/supabase'
import type { SupportWithProfile } from '@/types'

export const PREDEFINED_ENCOURAGEMENTS = [
  '💪 สู้ๆ นะ! ทำได้แน่นอน',
  '🔥 สุดยอดเลย! ทำต่อไปนะ',
  '🌟 เก่งมาก! เป็นกำลังใจให้',
  '✌️ สู้ๆ! อีกนิดเดียวก็สำเร็จแล้ว',
  '❤️ เยี่ยมมาก! ยึดมั่นในวินัยนะ',
]

export async function getSupportsForGoal(goalId: string): Promise<SupportWithProfile[]> {
  const { data, error } = await supabase
    .from('supports')
    .select('*, profile:profiles!supports_from_user_fkey(*)')
    .eq('goal_id', goalId)
    .order('created_at', { ascending: false })
    .limit(10)

  if (error) {
    // Fallback if foreign key name varies
    const { data: raw, error: err2 } = await supabase
      .from('supports')
      .select('*')
      .eq('goal_id', goalId)
      .order('created_at', { ascending: false })
      .limit(10)
    if (err2) return []
    return (raw ?? []).map((s) => ({ ...s, profile: { full_name: 'เพื่อนนักศึกษา' } })) as any
  }

  return ((data as any[]) ?? []).map((s) => ({
    ...s,
    profile: Array.isArray(s.profile) ? s.profile[0] : (s.profile || { full_name: 'เพื่อนนักศึกษา' }),
  })) as SupportWithProfile[]
}

export async function sendSupport(
  goalId: string,
  fromUser: string,
  message: string
): Promise<void> {
  const { error } = await supabase
    .from('supports')
    .upsert(
      [{ goal_id: goalId, from_user: fromUser, message, created_at: new Date().toISOString() }] as any,
      { onConflict: 'goal_id,from_user' }
    )

  if (error) {
    // If upsert with onConflict isn't configured in DB constraint, try delete then insert
    await supabase.from('supports').delete().eq('goal_id', goalId).eq('from_user', fromUser)
    const { error: insErr } = await supabase
      .from('supports')
      .insert([{ goal_id: goalId, from_user: fromUser, message }] as any)
    if (insErr) throw insErr
  }
}
