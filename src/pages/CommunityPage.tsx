import { useEffect, useState } from 'react'
import { Users, Heart, Target, Check, ChevronRight, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { useAuth } from '@/context/AuthContext'
import {
  getCommunityGoals,
  getGoalSupportSummary,
  encourageGoal,
  type CommunityGoalWithDetails,
} from '@/services'
import type { GoalSupportSummary, SupporterInfo } from '@/types'
import { EmptyState } from '@/components/shared/EmptyState'
import { ListSkeleton } from '@/components/shared/LoadingSkeleton'
import { useLanguage } from '@/context/LanguageContext'
import { Avatar } from '@/components/shared/Avatar'
import { WeeklyActivityGrid } from '@/components/shared/WeeklyActivityGrid'
import { formatRelativeEncouragedDate } from '@/lib/utils'

const QUICK_MESSAGES = [
  '💪 สู้ ๆ นะ',
  '❤️ เป็นกำลังใจให้เสมอ',
  '✨ ทำได้แน่นอน',
  '🔥 อย่ายอมแพ้',
  '👏 เก่งมาก',
  '🌱 ค่อย ๆ ไป เดี๋ยวก็ถึงเป้าหมาย',
]

export function CommunityPage() {
  const { user, profile } = useAuth()
  const { t, language } = useLanguage()

  const [goals, setGoals] = useState<CommunityGoalWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [summaries, setSummaries] = useState<Record<string, GoalSupportSummary>>({})

  // Encouragement Dialog Modal State
  const [encourageModalOpen, setEncourageModalOpen] = useState(false)
  const [selectedGoalForEncourage, setSelectedGoalForEncourage] = useState<CommunityGoalWithDetails | null>(null)
  const [customMessage, setCustomMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Supporters List Modal Pagination State
  const [supportersModalOpen, setSupportersModalOpen] = useState(false)
  const [selectedGoalForSupporters, setSelectedGoalForSupporters] = useState<CommunityGoalWithDetails | null>(null)
  const [supporterPageLimit, setSupporterPageLimit] = useState(10)

  const loadCommunityData = async () => {
    setLoading(true)
    try {
      const communityGoals = await getCommunityGoals()
      setGoals(communityGoals)

      // Fetch support summary for each goal in parallel
      const summaryEntries = await Promise.all(
        communityGoals.map(async (goal) => {
          const summary = await getGoalSupportSummary(goal.id, user?.id)
          return [goal.id, summary] as const
        })
      )
      setSummaries(Object.fromEntries(summaryEntries))
    } catch (err) {
      console.error('Failed to load community goals:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadCommunityData()
  }, [user?.id])

  const openEncourageModal = (goal: CommunityGoalWithDetails) => {
    if (!user || goal.user_id === user.id) return
    setSelectedGoalForEncourage(goal)
    setCustomMessage('')
    setErrorMessage(null)
    setEncourageModalOpen(true)
  }

  const handleSendEncouragement = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !selectedGoalForEncourage || isSubmitting) return

    setIsSubmitting(true)
    setErrorMessage(null)

    const goal = selectedGoalForEncourage

    try {
      await encourageGoal(goal.id, user.id, goal.user_id, profile?.full_name, customMessage)

      // Optimistic update of local summary
      setSummaries((prev) => {
        const current = prev[goal.id] || {
          totalCount: 0,
          uniqueSupportersCount: 0,
          userHasEncouragedToday: false,
          userTotalEncouragements: 0,
          recentSupporters: [],
        }

        const updatedUserTotal = current.userTotalEncouragements + 1
        const updatedTotal = current.totalCount + 1
        const nowISO = new Date().toISOString()

        // Update or insert current user into recent supporters list
        const existingSupporters = [...current.recentSupporters]
        const userIndex = existingSupporters.findIndex((s) => s.user_id === user.id)

        if (userIndex >= 0) {
          existingSupporters[userIndex] = {
            ...existingSupporters[userIndex],
            last_encouraged_at: nowISO,
            total_encouragements: existingSupporters[userIndex].total_encouragements + 1,
          }
        } else if (profile) {
          existingSupporters.unshift({
            user_id: user.id,
            profile,
            last_encouraged_at: nowISO,
            total_encouragements: 1,
          })
        }

        // Re-sort by last_encouraged_at DESC
        existingSupporters.sort(
          (a, b) => new Date(b.last_encouraged_at).getTime() - new Date(a.last_encouraged_at).getTime()
        )

        return {
          ...prev,
          [goal.id]: {
            totalCount: updatedTotal,
            uniqueSupportersCount: existingSupporters.length,
            userHasEncouragedToday: true,
            userTotalEncouragements: updatedUserTotal,
            recentSupporters: existingSupporters,
          },
        }
      })

      setEncourageModalOpen(false)
      setSelectedGoalForEncourage(null)
      setCustomMessage('')
    } catch (err: any) {
      console.error('Failed to send encouragement:', err)
      setErrorMessage(err.message || 'ไม่สามารถส่งกำลังใจได้ กรุณาลองใหม่อีกครั้ง')
    } finally {
      setIsSubmitting(false)
    }
  }

  const openSupportersModal = (goal: CommunityGoalWithDetails) => {
    setSelectedGoalForSupporters(goal)
    setSupporterPageLimit(10)
    setSupportersModalOpen(true)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
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
            const summary = summaries[goal.id] || {
              totalCount: 0,
              uniqueSupportersCount: 0,
              userHasEncouragedToday: false,
              userTotalEncouragements: 0,
              recentSupporters: [],
            }
            const isOwnGoal = goal.user_id === user?.id
            // Show only latest 3 supporter avatars on card
            const displaySupporters = summary.recentSupporters.slice(0, 3)
            const remainingSupporters = Math.max(0, summary.uniqueSupportersCount - 3)

            return (
              <Card
                key={goal.id}
                style={{ animationDelay: `${idx * 50}ms` }}
                className="hover:border-primary-500/40 hover:-translate-y-0.5 transition-all duration-200 ease-out shadow-xs hover:shadow-sm flex flex-col justify-between p-5 space-y-4 animate-scale-in"
              >
                {/* 1. TOP SECTION: Owner Identity */}
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

                {/* 2. GOAL SECTION: Goal Title & Description */}
                <div className="space-y-1">
                  <div className="flex items-start gap-2">
                    <Target className="w-5 h-5 text-primary-500 shrink-0 mt-0.5" />
                    <h3 className="text-lg font-bold leading-snug text-foreground tracking-tight">
                      {goal.title}
                    </h3>
                  </div>
                  {goal.description && (
                    <p className="text-xs text-muted-foreground leading-relaxed pl-7 line-clamp-2">
                      {goal.description}
                    </p>
                  )}
                </div>

                <div className="border-t border-border/40" />

                {/* 3. PROGRESS SECTION: Streak & Weekly Activity Grid */}
                <WeeklyActivityGrid checkins={goal.checkins} streak={goal.streak ?? 0} />

                <div className="border-t border-border/40" />

                {/* 4. RECENT SUPPORTERS & DAILY ENCOURAGEMENT SYSTEM SECTION */}
                <div className="space-y-3.5 pt-1">
                  {/* Lifetime Counter & Personal Support Note */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <div className="inline-flex items-center gap-1.5 font-bold text-rose-500 dark:text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-full border border-rose-500/20 w-fit">
                      <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                      <span>{summary.totalCount.toLocaleString()} {t.totalEncouragements}</span>
                    </div>

                    {summary.userTotalEncouragements > 0 && (
                      <span className="text-[11px] text-muted-foreground font-medium">
                        คุณส่งกำลังใจให้เป้าหมายนี้ <strong className="text-foreground">{summary.userTotalEncouragements}</strong> ครั้ง
                      </span>
                    )}
                  </div>

                  {/* Encourage Button */}
                  {!isOwnGoal && user ? (
                    <Button
                      disabled={summary.userHasEncouragedToday}
                      onClick={() => openEncourageModal(goal)}
                      className={`w-full gap-2 font-semibold text-xs h-9 cursor-pointer transition-all duration-200 ${
                        summary.userHasEncouragedToday
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 cursor-not-allowed opacity-90'
                          : 'bg-primary-500 hover:bg-primary-600 text-white shadow-xs hover:scale-[1.01] active:scale-[0.98]'
                      }`}
                    >
                      {summary.userHasEncouragedToday ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-500" />
                          <span>{t.encouragedToday}</span>
                        </>
                      ) : (
                        <>
                          <Heart className="w-4 h-4 text-white fill-white transition-transform duration-200 group-hover:scale-110" />
                          <span>{t.sendEncouragement}</span>
                        </>
                      )}
                    </Button>
                  ) : isOwnGoal ? (
                    <div className="text-center text-[11px] text-muted-foreground py-1 font-medium bg-muted/30 rounded-lg border border-border/40">
                      เป้าหมายของคุณ — รับกำลังใจจากเพื่อนๆ ในชุมชน
                    </div>
                  ) : null}

                  {/* 5. RECENT SUPPORTERS COMPACT SECTION (Max 3 Avatars + Badge) */}
                  {summary.uniqueSupportersCount > 0 ? (
                    <div
                      onClick={() => openSupportersModal(goal)}
                      className="group pt-2 border-t border-border/30 flex items-center justify-between p-2 px-3 rounded-xl bg-muted/30 border border-border/40 hover:bg-muted/60 transition-all duration-200 cursor-pointer"
                    >
                      {/* Left: Overlapping Avatars Stack (Max 3) */}
                      <div className="flex items-center gap-2">
                        <div className="flex -space-x-2 overflow-hidden py-0.5">
                          {displaySupporters.map((s: SupporterInfo) => (
                            <Avatar
                              key={s.user_id}
                              src={s.profile?.avatar}
                              name={s.profile?.full_name}
                              userId={s.user_id}
                              size="xs"
                              className="ring-2 ring-background shrink-0"
                            />
                          ))}
                          {remainingSupporters > 0 && (
                            <div className="w-6 h-6 rounded-full bg-muted border border-border text-[10px] font-bold text-muted-foreground flex items-center justify-center ring-2 ring-background shrink-0">
                              +{remainingSupporters}
                            </div>
                          )}
                        </div>

                        <span className="text-xs font-semibold text-foreground group-hover:text-primary-500 transition-colors">
                          👥 {t.supportedByPeople.replace('{count}', summary.uniqueSupportersCount.toString())}
                        </span>
                      </div>

                      {/* Right: Chevron Arrow */}
                      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary-500 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  ) : (
                    /* EMPTY SUPPORTERS STATE */
                    <div className="pt-2 border-t border-border/30 flex flex-col items-center justify-center p-3 rounded-xl bg-muted/20 border border-border/30 text-center space-y-0.5">
                      <p className="text-xs font-semibold text-foreground flex items-center gap-1">
                        <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500/20" />
                        <span>{t.noSupportersYet}</span>
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {t.beFirstToEncourage}
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            )
          })}
        </div>
      )}

      {/* 1. SEND ENCOURAGEMENT MODAL / DIALOG */}
      <Dialog open={encourageModalOpen} onOpenChange={setEncourageModalOpen}>
        <DialogContent className="sm:max-w-md animate-scale-in border border-border/80 bg-card p-6 rounded-2xl shadow-lg">
          <DialogHeader className="space-y-1">
            <DialogTitle className="flex items-center gap-2 text-lg font-bold text-foreground">
              <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
              <span>{t.encourageModalTitle}</span>
            </DialogTitle>
            <p className="text-xs text-muted-foreground">
              {t.encourageModalSub}
            </p>
          </DialogHeader>

          {selectedGoalForEncourage && (
            <form onSubmit={handleSendEncouragement} className="space-y-4 pt-2">
              {/* Target Goal Summary Preview */}
              <div className="p-3 rounded-xl bg-muted/40 border border-border/60 space-y-1 text-xs">
                <div className="flex items-center gap-2">
                  <Avatar
                    src={selectedGoalForEncourage.profile?.avatar}
                    name={selectedGoalForEncourage.profile?.full_name}
                    userId={selectedGoalForEncourage.user_id}
                    size="xs"
                  />
                  <span className="font-semibold text-foreground">
                    {selectedGoalForEncourage.profile?.full_name || 'เพื่อนนิสิต'}
                  </span>
                </div>
                <p className="font-bold text-sm text-foreground pt-1 truncate">
                  "{selectedGoalForEncourage.title}"
                </p>
              </div>

              {errorMessage && (
                <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-xs font-medium">
                  {errorMessage}
                </div>
              )}

              {/* Quick Message Selectable Chips */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground">
                  {t.quickMessagesTitle}
                </label>
                <div className="flex flex-wrap gap-2">
                  {QUICK_MESSAGES.map((msg) => {
                    const isSelected = customMessage === msg
                    return (
                      <button
                        key={msg}
                        type="button"
                        onClick={() => setCustomMessage(msg)}
                        className={`text-xs px-3 py-1.5 rounded-full border transition-all duration-150 cursor-pointer ${
                          isSelected
                            ? 'bg-primary-500/15 border-primary-500 text-primary-600 dark:text-primary-400 font-semibold shadow-xs scale-105'
                            : 'bg-muted/40 hover:bg-muted border-border/70 text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        {msg}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Custom Message Textarea */}
              <div className="space-y-1.5">
                <div className="relative">
                  <textarea
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value.slice(0, 200))}
                    placeholder={t.encourageMessagePlaceholder}
                    rows={3}
                    maxLength={200}
                    className="w-full rounded-xl border border-input bg-transparent px-3.5 py-2.5 text-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                  />
                  <div className="text-[11px] text-muted-foreground text-right pt-0.5 font-medium">
                    {customMessage.length} / 200
                  </div>
                </div>
              </div>

              <DialogFooter className="gap-2 pt-2 sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEncourageModalOpen(false)}
                  className="cursor-pointer text-xs"
                >
                  {t.cancel}
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-primary-500 hover:bg-primary-600 text-white font-semibold gap-2 cursor-pointer text-xs h-9"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Heart className="w-4 h-4 fill-white" />
                      <span>{t.sendEncouragementButton}</span>
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* 2. RECENT SUPPORTERS COMPLETE MODAL (Paginated: Top 10 + Load More) */}
      <Dialog open={supportersModalOpen} onOpenChange={setSupportersModalOpen}>
        <DialogContent className="sm:max-w-md max-h-[80vh] flex flex-col animate-scale-in">
          <DialogHeader className="pb-2 border-b border-border/40">
            <DialogTitle className="space-y-1">
              <div className="flex items-center gap-2 text-base font-bold">
                <Users className="w-5 h-5 text-primary-500" />
                <span>{t.recentSupporters}</span>
              </div>

              {selectedGoalForSupporters && (
                <div className="text-xs font-semibold text-rose-500 dark:text-rose-400 flex items-center gap-1 pt-0.5">
                  <span>
                    {t.supportedByPeople.replace(
                      '{count}',
                      (summaries[selectedGoalForSupporters.id]?.uniqueSupportersCount || 0).toString()
                    )}
                  </span>
                  <span>❤️</span>
                </div>
              )}
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto space-y-3 py-3 pr-1">
            {selectedGoalForSupporters && (() => {
              const allSupporters = summaries[selectedGoalForSupporters.id]?.recentSupporters || []
              const paginatedSupporters = allSupporters.slice(0, supporterPageLimit)
              const hasMoreSupporters = allSupporters.length > supporterPageLimit

              return (
                <>
                  {paginatedSupporters.map((supporter: SupporterInfo) => (
                    <div
                      key={supporter.user_id}
                      className="flex items-start gap-3 p-3.5 rounded-xl bg-muted/40 border border-border/50 text-xs transition-all hover:bg-muted/70"
                    >
                      <Avatar
                        src={supporter.profile?.avatar}
                        name={supporter.profile?.full_name}
                        userId={supporter.user_id}
                        size="md"
                        className="mt-0.5 shrink-0"
                      />
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-bold text-sm text-foreground truncate">
                            {supporter.profile?.full_name || 'เพื่อนนิสิต'}
                          </span>
                        </div>

                        <div className="text-xs text-muted-foreground flex flex-col gap-0.5 pt-0.5">
                          <p className="flex items-center gap-1 text-[11px]">
                            <span>{t.lastEncouraged}</span>
                            <strong className="text-foreground font-semibold">
                              {formatRelativeEncouragedDate(supporter.last_encouraged_at, language)}
                            </strong>
                          </p>
                          <p className="text-[11px] text-primary-600 dark:text-primary-400 font-medium">
                            {t.encouragedGoalTimes.replace('{count}', supporter.total_encouragements.toString())}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}

                  {hasMoreSupporters && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSupporterPageLimit((prev) => prev + 10)}
                      className="w-full text-xs font-semibold cursor-pointer py-2 mt-1"
                    >
                      {t.loadMore} ({allSupporters.length - supporterPageLimit})
                    </Button>
                  )}
                </>
              )
            })()}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setSupportersModalOpen(false)} className="cursor-pointer">
              {t.close}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
