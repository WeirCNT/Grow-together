import { supabase } from '@/lib/supabase'
import type { DailyCheckin } from '@/types'
import { getTodayISO } from '@/lib/utils'

export async function getCheckins(goalId: string): Promise<DailyCheckin[]> {
  const { data, error } = await supabase
    .from('daily_checkins')
    .select('*')
    .eq('goal_id', goalId)
    .order('date', { ascending: false })

  if (error) throw error
  return (data as DailyCheckin[]) ?? []
}

export async function getAllCheckins(userId: string): Promise<DailyCheckin[]> {
  const { data, error } = await supabase
    .from('daily_checkins')
    .select('*, goals!inner(user_id)')
    .eq('goals.user_id', userId)
    .order('date', { ascending: false })

  if (error) throw error
  return (data as DailyCheckin[]) ?? []
}

export async function toggleCheckin(goalId: string): Promise<boolean> {
  const today = getTodayISO()

  const { data: existing } = await supabase
    .from('daily_checkins')
    .select('id')
    .eq('goal_id', goalId)
    .eq('date', today)
    .single()

  if (existing) {
    const { error } = await supabase
      .from('daily_checkins')
      .delete()
      .eq('id', (existing as any).id)
    if (error) throw error
    return false
  } else {
    const { error } = await supabase
      .from('daily_checkins')
      .insert([{ goal_id: goalId, date: today }] as any)
    if (error) throw error
    return true
  }
}

export function calculateStreak(checkins: DailyCheckin[]): number {
  if (!checkins || checkins.length === 0) return 0

  const sorted = [...checkins]
    .map((c) => c.date)
    .sort((a, b) => b.localeCompare(a))

  const today = getTodayISO()
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayISO = yesterday.toISOString().split('T')[0]

  if (sorted[0] !== today && sorted[0] !== yesterdayISO) return 0

  let streak = 1
  for (let i = 1; i < sorted.length; i++) {
    const current = new Date(sorted[i - 1])
    const prev = new Date(sorted[i])
    const diffDays = (current.getTime() - prev.getTime()) / 86400000

    if (diffDays === 1) {
      streak++
    } else {
      break
    }
  }

  return streak
}

export function getCheckinsLast7Days(checkins: DailyCheckin[]): number {
  if (!checkins || checkins.length === 0) return 0

  const today = new Date()
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(today.getDate() - 6)

  const sevenDaysAgoISO = sevenDaysAgo.toISOString().split('T')[0]
  const todayISO = today.toISOString().split('T')[0]

  const uniqueDatesInWindow = new Set(
    checkins
      .map((c) => c.date)
      .filter((dateStr) => dateStr >= sevenDaysAgoISO && dateStr <= todayISO)
  )

  return Math.min(7, uniqueDatesInWindow.size)
}

export function calculateConsistencyRate(checkins: DailyCheckin[]): number {
  const count = getCheckinsLast7Days(checkins)
  return Math.round((count / 7) * 100)
}

export function calculateDisciplineScore(goals: { created_at?: string; checkins?: { date: string }[] }[]): number {
  if (!goals || goals.length === 0) return 100

  const today = new Date()

  // Determine earliest goal creation date
  const creationTimes = goals
    .map((g) => (g.created_at ? new Date(g.created_at).getTime() : Date.now()))
    .filter((t) => !isNaN(t))

  const earliestTime = creationTimes.length > 0 ? Math.min(...creationTimes) : Date.now()
  const earliestDateISO = new Date(earliestTime).toISOString().split('T')[0]

  // Collect all checkin dates across all goals
  const allCheckinDates = new Set<string>()
  goals.forEach((g) => {
    (g.checkins || []).forEach((c) => allCheckinDates.add(c.date))
  })

  // Look at past days (from yesterday back up to 14 days ago, but not before earliest goal creation)
  let missedDays = 0
  for (let i = 1; i <= 14; i++) {
    const d = new Date()
    d.setDate(today.getDate() - i)
    const dateISO = d.toISOString().split('T')[0]

    if (dateISO >= earliestDateISO && !allCheckinDates.has(dateISO)) {
      missedDays++
    }
  }

  // Deduct 5 points per missed day from 100
  const score = 100 - missedDays * 5
  return Math.max(0, Math.min(100, score))
}
