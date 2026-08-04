import { useEffect, useState } from 'react'
import { Users, Heart, Sparkles, Check, MessageSquareText, Target, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { useAuth } from '@/context/AuthContext'
import { getCommunityGoals, getSupportsForGoal, sendSupport, PREDEFINED_ENCOURAGEMENTS, type CommunityGoalWithDetails } from '@/services'
import type { SupportWithProfile } from '@/types'
import { EmptyState } from '@/components/shared/EmptyState'
import { ListSkeleton } from '@/components/shared/LoadingSkeleton'
import { useLanguage } from '@/context/LanguageContext'
import { Avatar } from '@/components/shared/Avatar'
import { WeeklyActivityGrid } from '@/components/shared/WeeklyActivityGrid'
import { formatRelativeDate } from '@/lib/utils'

export function CommunityPage() {
  const { user } = useAuth()
  const { t } = useLanguage()

  const [goals, setGoals] = useState<CommunityGoalWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [goalSupports, setGoalSupports] = useState<Record<string, SupportWithProfile[]>>({})

  // Encouragement picker modal state
  const [supportDialogOpen, setSupportDialogOpen] = useState(false)
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null)
  const [selectedMessage, setSelectedMessage] = useState(PREDEFINED_ENCOURAGEMENTS[0])
  const [sending, setSending] = useState(false)

  // View All Supports modal state
  const [viewAllDialogOpen, setViewAllDialogOpen] = useState(false)
  const [activeGoalForModal, setActiveGoalForModal] = useState<CommunityGoalWithDetails | null>(null)

  const loadCommunityData = async () => {
    setLoading(true)
    try {
      const communityGoals = await getCommunityGoals()
      setGoals(communityGoals)

      const supportsEntries = await Promise.all(
        communityGoals.map(async (goal) => {
          const supports = await getSupportsForGoal(goal.id)
          return [goal.id, supports] as const
        })
      )
      setGoalSupports(Object.fromEntries(supportsEntries))
    } catch (err) {
      console.error('Failed to load community goals:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadCommunityData()
  }, [])

  const openEncouragementDialog = (goalId: string) => {
    setSelectedGoalId(goalId)
    const existing = goalSupports[goalId]?.find((s) => s.from_user === user?.id)
    if (existing) {
      setSelectedMessage(existing.message)
    } else {
      setSelectedMessage(PREDEFINED_ENCOURAGEMENTS[0])
    }
    setSupportDialogOpen(true)
  }

  const openViewAllSupportsModal = (goal: CommunityGoalWithDetails) => {
    setActiveGoalForModal(goal)
    setViewAllDialogOpen(true)
  }

  const handleSendSupport = async () => {
    if (!selectedGoalId || !user || !selectedMessage) return
    setSending(true)
    try {
      await sendSupport(selectedGoalId, user.id, selectedMessage)
      const latestSupports = await getSupportsForGoal(selectedGoalId)
      setGoalSupports((current) => ({ ...current, [selectedGoalId]: latestSupports }))
      setSupportDialogOpen(false)
    } catch (err) {
      console.error('Failed to send encouragement:', err)
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{t.communityTitle}</h2>
          <p className="text-sm text-muted-foreground">{t.communitySub}</p>
        </div>
      </div>

      {loading ? (
        <ListSkeleton count={3} />
      ) : goals.length === 0 ? (
        <EmptyState
          icon={Users}
          title={t.noCommunityGoals}
          description={t.noCommunityGoalsSub}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {goals.map((goal, idx) => {
            const supports = goalSupports[goal.id] ?? []
            const visibleSupports = supports.slice(0, 2)
            const remainingCount = Math.max(0, supports.length - 2)
            const userSupport = supports.find((s) => s.from_user === user?.id)
            const isOwnGoal = goal.user_id === user?.id

            return (
              <Card
                key={goal.id}
                style={{ animationDelay: `${idx * 50}ms` }}
                className="hover:border-primary-500/40 hover:-translate-y-0.5 transition-all duration-200 ease-out shadow-xs hover:shadow-sm flex flex-col justify-between p-5 space-y-4 animate-scale-in"
              >
                {/* 1. TOP SECTION: Student Identity + Own Goal Badge */}
                <div className="flex items-center gap-3">
                  <Avatar
                    src={goal.profile?.avatar}
                    name={goal.profile?.full_name}
                    userId={goal.user_id}
                    size="md"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-foreground truncate">
                        {goal.profile?.full_name || 'เพื่อนนิสิต'}
                      </p>
                      {isOwnGoal && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary-500/10 text-primary-600 dark:text-primary-400 border border-primary-500/30 text-[10px] font-semibold shrink-0">
                          👤 คุณ
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {goal.profile?.student_id ? `รหัสนิสิต ${goal.profile.student_id}` : 'นิสิตมหาวิทยาลัย'}
                    </p>
                  </div>
                </div>

                <div className="border-t border-border/40" />

                {/* 2. GOAL SECTION: Prominent Goal Title (Largest text on card) */}
                <div className="space-y-1">
                  <div className="flex items-start gap-2">
                    <Target className="w-6 h-6 text-primary-500 shrink-0 mt-0.5" />
                    <h3 className="text-xl font-extrabold leading-snug text-foreground tracking-tight">
                      {goal.title}
                    </h3>
                  </div>
                  {goal.description && (
                    <p className="text-sm text-muted-foreground leading-relaxed pl-8">
                      {goal.description}
                    </p>
                  )}
                </div>

                <div className="border-t border-border/40" />

                {/* 3. PROGRESS SECTION: Streak & Compact 7-Day Activity Row */}
                <div className="space-y-2">
                  <WeeklyActivityGrid checkins={goal.checkins} streak={goal.streak ?? 0} />
                </div>

                <div className="border-t border-border/40" />

                {/* 4. SUPPORT SECTION: Header + Top-Right Support Button + Support Chips (Max 2) */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                      <MessageSquareText className="w-4 h-4 text-primary-500" />
                      <span>กำลังใจ ({supports.length})</span>
                    </div>

                    {/* Support Button with smooth state transition */}
                    {!isOwnGoal && user && (
                      <Button
                        variant={userSupport ? 'secondary' : 'outline'}
                        size="sm"
                        onClick={() => openEncouragementDialog(goal.id)}
                        className={`gap-1.5 text-xs font-semibold cursor-pointer transition-all duration-200 ease-out active:scale-95 ${
                          userSupport
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20'
                            : 'border-primary-500/30 text-primary-600 dark:text-primary-400 hover:bg-primary-500/10'
                        }`}
                      >
                        {userSupport ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-500 transition-transform duration-200 scale-100" />
                            <span>{t.encouraged}</span>
                          </>
                        ) : (
                          <>
                            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 transition-transform duration-200 hover:scale-110" />
                            <span>{t.sendEncouragement}</span>
                          </>
                        )}
                      </Button>
                    )}
                  </div>

                  {/* Display at most 2 latest support message chips */}
                  {visibleSupports.length > 0 && (
                    <div className="flex flex-col gap-1.5 pt-1">
                      {visibleSupports.map((s) => (
                        <div
                          key={s.id}
                          className="flex items-center gap-2 p-2 px-2.5 rounded-lg bg-muted/60 border border-border/40 text-xs transition-all duration-150 hover:bg-muted"
                        >
                          <Avatar
                            src={s.profile?.avatar}
                            name={s.profile?.full_name}
                            userId={s.from_user}
                            size="xs"
                          />
                          <span className="font-semibold text-foreground shrink-0">
                            {s.profile?.full_name}:
                          </span>
                          <span className="text-muted-foreground truncate">{s.message}</span>
                        </div>
                      ))}

                      {/* +X More Messages Button */}
                      {remainingCount > 0 && (
                        <button
                          type="button"
                          onClick={() => openViewAllSupportsModal(goal)}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 hover:underline pt-1 cursor-pointer transition-colors duration-150"
                        >
                          <span>+{remainingCount} ข้อความเพิ่มเติม</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </Card>
            )
          })}
        </div>
      )}

      {/* 1. Predefined Encouragement Picker Modal Dialog */}
      <Dialog open={supportDialogOpen} onOpenChange={setSupportDialogOpen}>
        <DialogContent className="sm:max-w-md animate-scale-in">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary-500" />
              {t.selectEncouragement}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-2 py-3">
            {PREDEFINED_ENCOURAGEMENTS.map((msg) => (
              <button
                key={msg}
                type="button"
                onClick={() => setSelectedMessage(msg)}
                className={`p-3 rounded-xl border text-left text-sm font-medium transition-all duration-150 cursor-pointer ${
                  selectedMessage === msg
                    ? 'border-primary-500 bg-primary-500/10 text-primary-600 dark:text-primary-400 font-semibold shadow-2xs'
                    : 'border-border hover:bg-muted text-foreground'
                }`}
              >
                {msg}
              </button>
            ))}
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setSupportDialogOpen(false)}>
              {t.cancel}
            </Button>
            <Button onClick={handleSendSupport} disabled={sending || !selectedMessage} className="gap-2 bg-primary-500 hover:bg-primary-600 text-white cursor-pointer">
              <Heart className="w-4 h-4 fill-white" />
              {t.sendEncouragement}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 2. View All Supports Modal Dialog */}
      <Dialog open={viewAllDialogOpen} onOpenChange={setViewAllDialogOpen}>
        <DialogContent className="sm:max-w-md max-h-[85vh] flex flex-col animate-scale-in">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base font-bold">
              <MessageSquareText className="w-5 h-5 text-primary-500" />
              <span>กำลังใจทั้งหมด ({activeGoalForModal ? (goalSupports[activeGoalForModal.id] ?? []).length : 0})</span>
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto space-y-2.5 py-3 pr-1">
            {activeGoalForModal && (goalSupports[activeGoalForModal.id] ?? []).map((s) => (
              <div key={s.id} className="flex items-start gap-3 p-3 rounded-xl bg-muted/60 border border-border/50 text-xs transition-all duration-150 hover:bg-muted">
                <Avatar src={s.profile?.avatar} name={s.profile?.full_name} userId={s.from_user} size="sm" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-foreground">{s.profile?.full_name || 'เพื่อนนิสิต'}</span>
                    <span className="text-[10px] text-muted-foreground">{formatRelativeDate(s.created_at)}</span>
                  </div>
                  <p className="text-xs text-foreground mt-1 leading-relaxed font-medium">{s.message}</p>
                </div>
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setViewAllDialogOpen(false)} className="cursor-pointer">
              {t.close}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
