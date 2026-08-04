import { useState, useEffect, useCallback } from 'react'
import type { GoalWithCheckins } from '@/types'
import * as goalService from '@/services/goalService'
import * as checkinService from '@/services/checkinService'
import { getTodayISO } from '@/lib/utils'

export function useGoals(userId: string | undefined) {
  const [goals, setGoals] = useState<GoalWithCheckins[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchGoals = useCallback(async () => {
    if (!userId) return
    try {
      setLoading(true)
      const goalsData = await goalService.getGoals(userId)

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

      setGoals(goalsWithCheckins)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'ไม่สามารถโหลดเป้าหมายได้')
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    fetchGoals()
  }, [fetchGoals])

  const addGoal = async (title: string, description?: string) => {
    if (!userId) return
    await goalService.createGoal(userId, title, description)
    await fetchGoals()
  }

  const editGoal = async (
    goalId: string,
    updates: { title?: string; description?: string | null; completed?: boolean }
  ) => {
    await goalService.updateGoal(goalId, updates)
    await fetchGoals()
  }

  const removeGoal = async (goalId: string) => {
    await goalService.deleteGoal(goalId)
    await fetchGoals()
  }

  const checkin = async (goalId: string) => {
    await checkinService.toggleCheckin(goalId)
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
