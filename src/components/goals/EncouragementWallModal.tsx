import { useState } from 'react'
import { Heart, Pin, PinOff, MessageSquare } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/shared/Avatar'
import type { GoalEncouragement } from '@/types'
import { formatRelativeDate } from '@/lib/utils'
import { useLanguage } from '@/context/LanguageContext'

interface EncouragementWallModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  goalTitle: string
  encouragements: GoalEncouragement[]
  pinnedSupportId: string | null
  onTogglePin: (supportId: string) => void
  isOwner?: boolean
}

export function EncouragementWallModal({
  open,
  onOpenChange,
  goalTitle,
  encouragements,
  pinnedSupportId,
  onTogglePin,
  isOwner = true,
}: EncouragementWallModalProps) {
  const { t } = useLanguage()

  // Track page limit (initially 20 items for performance)
  const [pageLimit, setPageLimit] = useState(20)

  // Track expanded message line clamp per item ID
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({})

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  // Separate pinned item and unpinned items
  const pinnedItem = encouragements.find((item) => item.id === pinnedSupportId)
  const otherItems = encouragements.filter((item) => item.id !== pinnedSupportId)

  // Paginate remaining unpinned items
  const paginatedOtherItems = otherItems.slice(0, pageLimit)
  const hasMore = otherItems.length > pageLimit

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[85vh] flex flex-col animate-scale-in border border-border/80 bg-card p-6 rounded-2xl shadow-xl">
        <DialogHeader className="pb-3 border-b border-border/40 space-y-1">
          <DialogTitle className="flex items-center gap-2 text-lg font-bold text-foreground">
            <div className="w-8 h-8 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center">
              <Heart className="w-4.5 h-4.5 fill-rose-500" />
            </div>
            <span>{t.wallOfEncouragementTitle}</span>
          </DialogTitle>
          <p className="text-xs text-muted-foreground">
            {t.wallOfEncouragementSub} — <span className="font-semibold text-foreground">"{goalTitle}"</span>
          </p>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-3.5 py-4 pr-1">
          {encouragements.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-2 text-muted-foreground bg-muted/20 rounded-2xl border border-border/30 p-6">
              <MessageSquare className="w-10 h-10 stroke-[1.5] text-rose-500/60 fill-rose-500/10" />
              <p className="font-bold text-sm text-foreground">{t.noEncouragementsYet}</p>
              <p className="text-xs max-w-xs text-muted-foreground leading-relaxed">{t.noEncouragementsSub}</p>
            </div>
          ) : (
            <>
              {/* PINNED ENCOURAGEMENT CARD */}
              {pinnedItem && (
                <div className="p-4 rounded-2xl bg-amber-500/10 border-2 border-amber-500/30 space-y-2 shadow-xs transition-all duration-200 relative">
                  <div className="flex items-center justify-between gap-2">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 text-[11px] font-bold">
                      <Pin className="w-3.5 h-3.5 fill-amber-500" />
                      <span>{t.pinnedEncouragement}</span>
                    </div>

                    {isOwner && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onTogglePin(pinnedItem.id)}
                        className="h-7 text-[11px] gap-1 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 cursor-pointer"
                      >
                        <PinOff className="w-3 h-3" />
                        <span>{t.unpinMessage}</span>
                      </Button>
                    )}
                  </div>

                  <div className="flex items-start gap-3 pt-1">
                    <Avatar
                      src={pinnedItem.profile?.avatar}
                      name={pinnedItem.profile?.full_name}
                      userId={pinnedItem.from_user}
                      size="md"
                      className="mt-0.5 shrink-0"
                    />

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-sm text-foreground truncate">
                          {pinnedItem.profile?.full_name || 'เพื่อนนิสิต'}
                        </span>
                        <span className="text-[10px] text-muted-foreground shrink-0 font-normal">
                          {formatRelativeDate(pinnedItem.created_at)}
                        </span>
                      </div>

                      <p
                        className={`text-xs leading-relaxed text-foreground font-medium ${
                          expandedIds[pinnedItem.id] ? '' : 'line-clamp-3'
                        }`}
                      >
                        {pinnedItem.message || '❤️ เป็นกำลังใจให้นะ'}
                      </p>

                      {pinnedItem.message && pinnedItem.message.length > 80 && (
                        <button
                          type="button"
                          onClick={() => toggleExpand(pinnedItem.id)}
                          className="text-[11px] font-bold text-amber-600 dark:text-amber-400 hover:underline pt-0.5 cursor-pointer block"
                        >
                          {expandedIds[pinnedItem.id] ? t.showLess : t.readMore}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* REGULAR ENCOURAGEMENT CARDS */}
              {paginatedOtherItems.map((item) => {
                const isExpanded = !!expandedIds[item.id]
                const isLongText = (item.message || '').length > 80

                return (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-muted/40 border border-border/60 hover:bg-muted/70 transition-all duration-200 space-y-2"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <Avatar
                          src={item.profile?.avatar}
                          name={item.profile?.full_name}
                          userId={item.from_user}
                          size="md"
                          className="mt-0.5 shrink-0"
                        />

                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-bold text-sm text-foreground truncate">
                              {item.profile?.full_name || 'เพื่อนนิสิต'}
                            </span>
                            <span className="text-[10px] text-muted-foreground shrink-0 font-normal">
                              {formatRelativeDate(item.created_at)}
                            </span>
                          </div>

                          <p
                            className={`text-xs leading-relaxed text-foreground/90 font-medium ${
                              isExpanded ? '' : 'line-clamp-3'
                            }`}
                          >
                            {item.message || '❤️ เป็นกำลังใจให้นะ'}
                          </p>

                          {isLongText && (
                            <button
                              type="button"
                              onClick={() => toggleExpand(item.id)}
                              className="text-[11px] font-bold text-primary-600 dark:text-primary-400 hover:underline pt-0.5 cursor-pointer block"
                            >
                              {isExpanded ? t.showLess : t.readMore}
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Pin button for Owner */}
                      {isOwner && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onTogglePin(item.id)}
                          title={t.pinMessage}
                          className="h-7 w-7 text-muted-foreground hover:text-amber-500 hover:bg-amber-500/10 cursor-pointer shrink-0"
                        >
                          <Pin className="w-3.5 h-3.5" />
                        </Button>
                      )}
                    </div>
                  </div>
                )
              })}

              {/* LOAD MORE BUTTON FOR LARGE DATASETS */}
              {hasMore && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPageLimit((prev) => prev + 20)}
                  className="w-full text-xs font-semibold cursor-pointer py-2 mt-2"
                >
                  {t.loadMore} ({otherItems.length - pageLimit})
                </Button>
              )}
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="cursor-pointer">
            {t.close}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
