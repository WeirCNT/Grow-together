import { useState, useEffect, useCallback } from 'react'
import type { GoalWithCheckins } from '@/types'
import * as goalService from '@/services/goalService'
import * as checkinService from '@/services/checkinService'
import { getTodayISO } from '@/lib/utils'

const logEvent = (msg: string, ...args: any[]) => {
  console.log(`[${new Date().toISOString()}] [useGoals] ${msg}`, ...args)
}

export function useGoals(userId: string | undefined) {
  const [goals, setGoals] = useState<GoalWithCheckins[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchGoals = useCallback(async () => {
    logEvent(`fetchGoals called for userId: ${userId ?? 'undefined'}`)
    if (!userId) {
      logEvent('fetchGoals skipped because userId is falsy')
      setGoals([])
      setLoading(false)
      return
    }
    try {
      setLoading(true)
      logEvent('Fetching goals from goalService...')
      const goalsData = await goalService.getGoals(userId)

      logEvent(`Fetched ${goalsData.length} goals. Fetching checkins for each goal...`)
      const goalsWithCheckins = await Promise.all(
        goalsData.map(async (goal) => {
          const checkins = await checkinService.getCheckins(goal.id)
          const streak = checkinService.calculateStreak(checkins)
          const checkinsLast7Days = checkinService.getCheckinsLast7Days(checkins)
          const completionRate = Math.round((checkinsLast7Days / 7) * 100)

          return {
            ...goal,
            checkins,
            streak,
            completionRate,
            checkinsLast7Days,
          }
        })
      )

      logEvent('fetchGoals completed successfully. Updating goals state.')
      setGoals(goalsWithCheckins)
      setError(null)
    } catch (err) {
      logEvent('fetchGoals error:', err)
      setError(err instanceof Error ? err.message : 'ไม่สามารถโหลดเป้าหมายได้')
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    logEvent(`useGoals useEffect triggered with userId: ${userId ?? 'undefined'}`)
    fetchGoals()
  }, [fetchGoals, userId])

  const addGoal = async (title: string, description?: string) => {
    logEvent(`addGoal called: title="${title}"`)
    if (!userId) return
    await goalService.createGoal(userId, title, description)
    logEvent('createGoal complete. Triggering fetchGoals()...')
    await fetchGoals()
  }

  const editGoal = async (
    goalId: string,
    updates: { title?: string; description?: string | null; completed?: boolean }
  ) => {
    logEvent(`editGoal called: goalId="${goalId}"`, updates)
    await goalService.updateGoal(goalId, updates)
    logEvent('updateGoal complete. Triggering fetchGoals()...')
    await fetchGoals()
  }

  const removeGoal = async (goalId: string) => {
    logEvent(`removeGoal called: goalId="${goalId}"`)
    await goalService.deleteGoal(goalId)
    logEvent('deleteGoal complete. Triggering fetchGoals()...')
    await fetchGoals()
  }

  const checkin = async (goalId: string) => {
    logEvent(`checkin called: goalId="${goalId}"`)
    await checkinService.toggleCheckin(goalId)
    logEvent('toggleCheckin complete. Triggering fetchGoals()...')
    await fetchGoals()
  }

  const isCheckedInToday = (goal: GoalWithCheckins) => {
    const today = getTodayISO()
    return goal.checkins.some((c) => c.date === today)
  }

  return {
    goals,
    loading,
    error,
    addGoal,
    editGoal,
    removeGoal,
    checkin,
    isCheckedInToday,
    refresh: fetchGoals,
  }
}
