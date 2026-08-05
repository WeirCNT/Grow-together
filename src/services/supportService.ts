import { supabase } from '@/lib/supabase'
import type { Profile, SupporterInfo, GoalSupportSummary, AppNotification } from '@/types'
import { getTodayISO } from '@/lib/utils'

/**
 * Retrieves full encouragement stats for a specific goal:
 * - Total encouragements count (lifetime)
 * - Number of unique supporters
 * - Whether current user encouraged today
 * - Current user's total encouragements count for this goal
 * - Recent Supporters list (ordered by newest encouragement created_at DESC)
 */
export async function getGoalSupportSummary(
  goalId: string,
  currentUserId?: string
): Promise<GoalSupportSummary> {
  const todayISO = getTodayISO()

  try {
    // 1. Fetch all supports for this goal with associated profile details
    const { data: supports, error } = await supabase
      .from('supports')
      .select('id, goal_id, from_user, message, created_at, profile:profiles!supports_from_user_fkey(id, student_id, full_name, avatar)')
      .eq('goal_id', goalId)

    if (error) {
      // Fallback query if profiles foreign key alias differs
      const { data: rawSupports, error: rawErr } = await supabase
        .from('supports')
        .select('id, goal_id, from_user, message, created_at')
        .eq('goal_id', goalId)

      if (rawErr) {
        return {
          totalCount: 0,
          uniqueSupportersCount: 0,
          userHasEncouragedToday: false,
          userTotalEncouragements: 0,
          recentSupporters: [],
        }
      }

      return processRecentSupportersSummary(rawSupports || [], currentUserId, todayISO)
    }

    return processRecentSupportersSummary(supports || [], currentUserId, todayISO)
  } catch (err) {
    console.error('Failed to fetch goal support summary:', err)
    return {
      totalCount: 0,
      uniqueSupportersCount: 0,
      userHasEncouragedToday: false,
      userTotalEncouragements: 0,
      recentSupporters: [],
    }
  }
}

async function processRecentSupportersSummary(
  rawSupports: any[],
  currentUserId?: string,
  todayISO?: string
): Promise<GoalSupportSummary> {
  const totalCount = rawSupports.length

  const userSupports = currentUserId
    ? rawSupports.filter((s) => s.from_user === currentUserId)
    : []

  const userTotalEncouragements = userSupports.length

  // Check if encouraged today using created_at timestamp formatted as ISO YYYY-MM-DD
  const userHasEncouragedToday = currentUserId
    ? userSupports.some((s) => {
        const sDate = s.created_at ? s.created_at.split('T')[0] : ''
        return sDate === todayISO
      })
    : false

  // Group by unique supporter and record total count & latest encouragement timestamp (created_at)
  const supporterMap = new Map<
    string,
    { count: number; lastEncouragedAt: string; profile?: Profile }
  >()

  rawSupports.forEach((s) => {
    const uid = s.from_user
    if (!uid) return
    const prof = Array.isArray(s.profile) ? s.profile[0] : s.profile
    const timestamp = s.created_at || new Date().toISOString()
    const existing = supporterMap.get(uid)

    if (existing) {
      existing.count += 1
      if (!existing.profile && prof) existing.profile = prof
      if (new Date(timestamp).getTime() > new Date(existing.lastEncouragedAt).getTime()) {
        existing.lastEncouragedAt = timestamp
      }
    } else {
      supporterMap.set(uid, {
        count: 1,
        lastEncouragedAt: timestamp,
        profile: prof || { id: uid, full_name: 'เพื่อนนิสิต', student_id: '', avatar: null, created_at: '' },
      })
    }
  })

  // Fill in profile details if profile was not joined in query
  const aggregated = Array.from(supporterMap.entries()).map(([uid, data]) => ({
    user_id: uid,
    total_encouragements: data.count,
    last_encouraged_at: data.lastEncouragedAt,
    profile: data.profile!,
  }))

  const missingProfileUids = aggregated.filter((a) => !a.profile || !a.profile.full_name).map((a) => a.user_id)
  if (missingProfileUids.length > 0) {
    const { data: profs } = await supabase
      .from('profiles')
      .select('id, student_id, full_name, avatar, created_at')
      .in('id', missingProfileUids)

    if (profs) {
      const profMap = new Map(profs.map((p) => [p.id, p as Profile]))
      aggregated.forEach((item) => {
        if (profMap.has(item.user_id)) {
          item.profile = profMap.get(item.user_id)!
        }
      })
    }
  }

  // Sort by last_encouraged_at DESC (newest encouragement first)
  aggregated.sort(
    (a, b) => new Date(b.last_encouraged_at).getTime() - new Date(a.last_encouraged_at).getTime()
  )

  const recentSupporters: SupporterInfo[] = aggregated.map((item) => ({
    user_id: item.user_id,
    profile: item.profile,
    last_encouraged_at: item.last_encouraged_at,
    total_encouragements: item.total_encouragements,
  }))

  return {
    totalCount,
    uniqueSupportersCount: recentSupporters.length,
    userHasEncouragedToday,
    userTotalEncouragements,
    recentSupporters,
  }
}

/**
 * Sends a daily encouragement for a goal.
 * Validates that:
 * 1. User is not encouraging their own goal
 * 2. User has not already encouraged this goal today
 */
export async function encourageGoal(
  goalId: string,
  fromUserId: string,
  goalOwnerId: string,
  senderName?: string
): Promise<void> {
  if (fromUserId === goalOwnerId) {
    throw new Error('ไม่สามารถส่งกำลังใจให้เป้าหมายของตนเองได้')
  }

  // 1. Insert support record matching schema: id, goal_id, from_user, message, created_at
  const { error: insertErr } = await supabase
    .from('supports')
    .insert([{
      goal_id: goalId,
      from_user: fromUserId,
      message: '❤️',
      created_at: new Date().toISOString(),
    }] as any)

  if (insertErr) {
    // If unique constraint error (duplicate encouragement on same day or goal)
    if (insertErr.code === '23505' || insertErr.message.includes('unique')) {
      throw new Error('คุณได้ส่งกำลังใจให้เป้าหมายนี้ในวันนี้ไปแล้ว')
    }
    throw insertErr
  }

  // 2. Create in-app notification for the goal owner
  try {
    await supabase.from('notifications').insert([{
      user_id: goalOwnerId,
      from_user: fromUserId,
      goal_id: goalId,
      message: `❤️ ${senderName || 'เพื่อนนิสิต'} ส่งกำลังใจให้เป้าหมายของคุณ`,
      is_read: false,
      created_at: new Date().toISOString(),
    }] as any)
  } catch {
    // Notifications creation is non-blocking if table is still migrating
  }
}

/**
 * Fetches user profile encouragement statistics:
 * - Encouragements Received (Total times friends encouraged user's goals)
 * - Encouragements Given (Total times user encouraged friends' goals)
 */
export async function getUserSupportStats(userId: string): Promise<{
  encouragementsReceived: number
  encouragementsGiven: number
}> {
  try {
    // 1. Encouragements Given
    const { count: givenCount } = await supabase
      .from('supports')
      .select('*', { count: 'exact', head: true })
      .eq('from_user', userId)

    // 2. Encouragements Received (Query goals owned by user, then count supports)
    const { data: userGoals } = await supabase
      .from('goals')
      .select('id')
      .eq('user_id', userId)

    let receivedCount = 0
    if (userGoals && userGoals.length > 0) {
      const goalIds = userGoals.map((g) => g.id)
      const { count: rCount } = await supabase
        .from('supports')
        .select('*', { count: 'exact', head: true })
        .in('goal_id', goalIds)

      receivedCount = rCount ?? 0
    }

    return {
      encouragementsReceived: receivedCount,
      encouragementsGiven: givenCount ?? 0,
    }
  } catch (err) {
    console.error('Failed to fetch user support stats:', err)
    return { encouragementsReceived: 0, encouragementsGiven: 0 }
  }
}

/**
 * Fetches unread notifications for a user
 */
export async function getUserNotifications(userId: string): Promise<AppNotification[]> {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('*, from_profile:profiles!notifications_from_user_fkey(id, full_name, avatar), goal:goals!notifications_goal_id_fkey(title)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10)

    if (error) {
      const { data: raw } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(10)

      return (raw as any[]) ?? []
    }

    return ((data as any[]) ?? []).map((n) => ({
      ...n,
      from_profile: Array.isArray(n.from_profile) ? n.from_profile[0] : n.from_profile,
      goal_title: n.goal?.title,
    }))
  } catch {
    return []
  }
}

/**
 * Marks a notification as read
 */
export async function markNotificationAsRead(notificationId: string): Promise<void> {
  await supabase
    .from('notifications')
    .update({ is_read: true } as any)
    .eq('id', notificationId)
}
