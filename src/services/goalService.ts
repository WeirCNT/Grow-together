import { supabase } from '@/lib/supabase'
import type { Goal } from '@/types'
import { getCheckins, calculateStreak } from './checkinService'

export interface CommunityGoalWithDetails extends Goal {
  profile?: {
    full_name: string
    student_id?: string
    avatar?: string | null
  }
  checkins?: { date: string }[]
  checkins_count?: number
  streak?: number
}

export async function getGoals(userId: string): Promise<Goal[]> {
  const { data, error } = await supabase
    .from('goals')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data as Goal[]) ?? []
}

export async function getCommunityGoals(): Promise<CommunityGoalWithDetails[]> {
  // Query goals with joined profile details
  const { data, error } = await supabase
    .from('goals')
    .select('*, profile:profiles!goals_user_id_fkey(full_name, student_id, avatar)')
    .order('created_at', { ascending: false })
    .limit(50)

  let goalsList: any[] = []

  if (error) {
    // Fallback if explicit relationship query fails
    const { data: rawGoals, error: goalErr } = await supabase
      .from('goals')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50)

    if (goalErr) throw goalErr

    goalsList = await Promise.all(
      (rawGoals as Goal[]).map(async (g) => {
        const { data: prof } = await supabase
          .from('profiles')
          .select('full_name, student_id, avatar')
          .eq('id', g.user_id)
          .single()
        return {
          ...g,
          profile: prof ? (prof as any) : { full_name: 'เพื่อนนิสิต' },
        }
      })
    )
  } else {
    goalsList = ((data as any[]) ?? []).map((g) => ({
      ...g,
      profile: Array.isArray(g.profile) ? g.profile[0] : (g.profile || { full_name: 'เพื่อนนิสิต' }),
    }))
  }

  // Populate check-in records for each community goal
  const enrichedGoals = await Promise.all(
    goalsList.map(async (goal) => {
      try {
        const checkins = await getCheckins(goal.id)
        const streak = calculateStreak(checkins)

        return {
          ...goal,
          checkins,
          checkins_count: checkins.length,
          streak,
        }
      } catch {
        return {
          ...goal,
          checkins: [],
          checkins_count: 0,
          streak: 0,
        }
      }
    })
  )

  return enrichedGoals
}

export async function createGoal(
  userId: string,
  title: string,
  description?: string
): Promise<Goal> {
  const { data, error } = await supabase
    .from('goals')
    .insert([{ user_id: userId, title, description: description || null }] as any)
    .select()
    .single()

  if (error) throw error
  return data as Goal
}

export async function updateGoal(
  goalId: string,
  updates: { title?: string; description?: string | null; completed?: boolean }
): Promise<Goal> {
  const { data, error } = await supabase
    .from('goals')
    .update(updates as any)
    .eq('id', goalId)
    .select()
    .single()

  if (error) throw error
  return data as Goal
}

export async function deleteGoal(goalId: string): Promise<void> {
  const { error } = await supabase.from('goals').delete().eq('id', goalId)
  if (error) throw error
}
