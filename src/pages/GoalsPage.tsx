import { useState, useEffect } from 'react'
import { Plus, Target } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { GoalCard } from '@/components/goals/GoalCard'
import { GoalForm } from '@/components/goals/GoalForm'
import { useGoals } from '@/hooks/useGoals'
import { useAuth } from '@/context/AuthContext'
import { ListSkeleton } from '@/components/shared/LoadingSkeleton'
import { EmptyState } from '@/components/shared/EmptyState'
import type { GoalWithCheckins } from '@/types'
import { useLanguage } from '@/context/LanguageContext'

const logEvent = (msg: string, ...args: any[]) => {
  console.log(`[${new Date().toISOString()}] [GoalsPage] ${msg}`, ...args)
}

export function GoalsPage() {
  const { user } = useAuth()
  const { t } = useLanguage()
  const { goals, loading, addGoal, editGoal, removeGoal, checkin, isCheckedInToday } = useGoals(user?.id)

  const [formOpen, setFormOpen] = useState(false)
  const [editingGoal, setEditingGoal] = useState<GoalWithCheckins | null>(null)

  useEffect(() => {
    logEvent(`GoalsPage mounted/updated. User ID: ${user?.id ?? 'null'}, Goals count: ${goals.length}, Loading: ${loading}`)
    return () => {
      logEvent('GoalsPage unmounting')
    }
  }, [user?.id, goals.length, loading])

  const handleCreateOrUpdate = async (title: string, description: string) => {
    logEvent(`handleCreateOrUpdate triggered. editingGoal: ${editingGoal?.id ?? 'null'}, title: "${title}"`)
    if (editingGoal) {
      await editGoal(editingGoal.id, { title, description: description || null })
    } else {
      await addGoal(title, description)
    }
    logEvent('handleCreateOrUpdate complete')
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{t.myGoals}</h2>
          <p className="text-sm text-muted-foreground">{t.manageHabits}</p>
        </div>
        <Button
          onClick={() => {
            logEvent('Add Goal button clicked')
            setEditingGoal(null)
            setFormOpen(true)
          }}
          className="gap-2"
        >
          <Plus className="w-4 h-4" /> {t.addGoal}
        </Button>
      </div>

      {loading ? (
        <ListSkeleton count={3} />
      ) : goals.length === 0 ? (
        <EmptyState
          icon={Target}
          title={t.noGoalsFound}
          description={t.noGoalsSub}
          actionLabel={t.createNewGoal}
          onAction={() => {
            logEvent('EmptyState action clicked')
            setEditingGoal(null)
            setFormOpen(true)
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {goals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              isCheckedIn={isCheckedInToday(goal)}
              onCheckIn={() => {
                logEvent(`CheckIn triggered for goalId: ${goal.id}`)
                checkin(goal.id)
              }}
              onEdit={() => {
                logEvent(`Edit triggered for goalId: ${goal.id}`)
                setEditingGoal(goal)
                setFormOpen(true)
              }}
              onDelete={() => {
                logEvent(`Delete triggered for goalId: ${goal.id}`)
                removeGoal(goal.id)
              }}
            />
          ))}
        </div>
      )}

      <GoalForm
        open={formOpen}
        onOpenChange={(open) => {
          logEvent(`GoalForm onOpenChange: ${open}`)
          setFormOpen(open)
        }}
        onSubmit={handleCreateOrUpdate}
        initialGoal={editingGoal}
      />
    </div>
  )
}
