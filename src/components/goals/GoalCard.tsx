import { useState, useEffect } from 'react'
import { MoreVertical, Trash2, Edit2, Heart, Pin } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { CheckInButton } from './CheckInButton'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import type { GoalWithCheckins, GoalEncouragement } from '@/types'
import { useLanguage } from '@/context/LanguageContext'
import { WeeklyActivityGrid } from '@/components/shared/WeeklyActivityGrid'
import { Avatar } from '@/components/shared/Avatar'
import { getGoalEncouragements } from '@/services'
import { formatRelativeDate } from '@/lib/utils'
import { EncouragementWallModal } from './EncouragementWallModal'

interface GoalCardProps {
  goal: GoalWithCheckins
  isCheckedIn: boolean
  onCheckIn: () => void
  onEdit: () => void
  onDelete: () => void
}

export function GoalCard({ goal, isCheckedIn, onCheckIn, onEdit, onDelete }: GoalCardProps) {
  const { t } = useLanguage()

  const [encouragements, setEncouragements] = useState<GoalEncouragement[]>([])
  const [loadingSupports, setLoadingSupports] = useState(false)
  const [wallModalOpen, setWallModalOpen] = useState(false)

  // Pin message state per goal (persisted in localStorage)
  const storageKey = `grow-together-pinned-${goal.id}`
  const [pinnedSupportId, setPinnedSupportId] = useState<string | null>(() => {
    return localStorage.getItem(storageKey)
  })

  useEffect(() => {
    let isMounted = true
    setLoadingSupports(true)

    getGoalEncouragements(goal.id)
      .then((data) => {
        if (isMounted) setEncouragements(data)
      })
      .finally(() => {
        if (isMounted) setLoadingSupports(false)
      })

    return () => {
      isMounted = false
    }
  }, [goal.id])

  const handleTogglePin = (supportId: string) => {
    setPinnedSupportId((prev) => {
      const next = prev === supportId ? null : supportId
      if (next) {
        localStorage.setItem(storageKey, next)
      } else {
        localStorage.removeItem(storageKey)
      }
      return next
    })
  }

  // Determine top 3 items to show on card (pinned item first if present)
  const pinnedItem = encouragements.find((item) => item.id === pinnedSupportId)
  const otherItems = encouragements.filter((item) => item.id !== pinnedSupportId)
  const displayItems = pinnedItem
    ? [pinnedItem, ...otherItems.slice(0, 2)]
    : encouragements.slice(0, 3)

  return (
    <>
      <Card className="hover:border-primary-500/50 transition-all duration-200 shadow-sm flex flex-col justify-between">
        <div>
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
            <div className="space-y-1 pr-4">
              <CardTitle className="text-base font-bold leading-snug">{goal.title}</CardTitle>
              {goal.description && (
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">{goal.description}</p>
              )}
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground cursor-pointer">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onEdit} className="gap-2">
                  <Edit2 className="w-4 h-4" /> {t.edit}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onDelete} className="gap-2 text-destructive">
                  <Trash2 className="w-4 h-4" /> {t.delete}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* GitHub Style 7-Day Activity Grid */}
            <WeeklyActivityGrid checkins={goal.checkins} streak={goal.streak} />

            <div className="pt-2 flex justify-end border-t border-border/50">
              <CheckInButton isChecked={isCheckedIn} onClick={onCheckIn} />
            </div>

            {/* WALL OF ENCOURAGEMENT SECTION FOR OWNED GOALS */}
            <div className="pt-3 border-t border-border/40 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-bold text-xs text-foreground">
                  <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                  <span>{t.latestEncouragements}</span>
                  {encouragements.length > 0 && (
                    <span className="text-[10px] text-muted-foreground font-semibold bg-muted px-2 py-0.5 rounded-full">
                      {encouragements.length}
                    </span>
                  )}
                </div>

                {encouragements.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setWallModalOpen(true)}
                    className="text-xs font-bold text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-0.5 cursor-pointer"
                  >
                    <span>{t.viewAllArrow}</span>
                  </button>
                )}
              </div>

              {loadingSupports ? (
                <div className="py-4 text-center text-xs text-muted-foreground animate-pulse">
                  กำลังโหลดข้อมูลกำลังใจ...
                </div>
              ) : encouragements.length === 0 ? (
                <div className="p-3 rounded-xl bg-muted/20 border border-border/30 text-center space-y-0.5">
                  <p className="text-xs font-semibold text-foreground flex items-center justify-center gap-1">
                    <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500/20" />
                    <span>{t.noEncouragementsYet}</span>
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {t.noEncouragementsSub}
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {displayItems.map((item) => {
                    const isPinned = item.id === pinnedSupportId

                    return (
                      <div
                        key={item.id}
                        className={`p-2.5 rounded-xl border text-xs space-y-1 transition-all ${
                          isPinned
                            ? 'bg-amber-500/10 border-amber-500/30'
                            : 'bg-muted/30 border-border/40'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <Avatar
                              src={item.profile?.avatar}
                              name={item.profile?.full_name}
                              userId={item.from_user}
                              size="xs"
                              className="shrink-0"
                            />
                            <span className="font-bold text-foreground text-xs truncate">
                              {item.profile?.full_name || 'เพื่อนนิสิต'}
                            </span>
                            {isPinned && (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 text-[9px] font-bold shrink-0">
                                <Pin className="w-2.5 h-2.5 fill-amber-500" />
                              </span>
                            )}
                          </div>

                          <span className="text-[10px] text-muted-foreground shrink-0">
                            {formatRelativeDate(item.created_at)}
                          </span>
                        </div>

                        <p className="text-xs text-foreground/90 font-medium leading-relaxed pl-7 line-clamp-2">
                          "{item.message || '❤️ เป็นกำลังใจให้นะ'}"
                        </p>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </CardContent>
        </div>
      </Card>

      {/* WALL OF ENCOURAGEMENT MODAL */}
      <EncouragementWallModal
        open={wallModalOpen}
        onOpenChange={setWallModalOpen}
        goalTitle={goal.title}
        encouragements={encouragements}
        pinnedSupportId={pinnedSupportId}
        onTogglePin={handleTogglePin}
        isOwner={true}
      />
    </>
  )
}
