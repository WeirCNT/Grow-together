import { useEffect, useState } from 'react'
import { Heart, ChevronDown, ChevronUp } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { getUserNotifications } from '@/services'
import type { AppNotification } from '@/types'
import { useAuth } from '@/context/AuthContext'
import { useLanguage } from '@/context/LanguageContext'
import { Avatar } from '@/components/shared/Avatar'
import { formatRelativeDate } from '@/lib/utils'

export function EncouragementNotificationsCard() {
  const { user } = useAuth()
  const { t } = useLanguage()
  const [notifications, setNotifications] = useState<AppNotification[]>([])
  const [showAll, setShowAll] = useState(false)
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({})

  useEffect(() => {
    if (user?.id) {
      getUserNotifications(user.id).then(setNotifications)
    }
  }, [user?.id])

  if (notifications.length === 0) return null

  const visibleNotifications = showAll ? notifications : notifications.slice(0, 5)

  const toggleExpandMessage = (id: string) => {
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <Card className="border border-rose-500/20 bg-rose-500/5 p-4 shadow-xs transition-all duration-200 animate-fade-in">
      <CardHeader className="p-0 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-rose-500/15 text-rose-500 flex items-center justify-center">
              <Heart className="w-4 h-4 fill-rose-500" />
            </div>
            <CardTitle className="text-sm font-bold text-foreground">
              {t.notifications} ({notifications.length})
            </CardTitle>
          </div>

          {notifications.length > 5 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAll((prev) => !prev)}
              className="text-xs h-7 gap-1 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <span>{showAll ? t.showLess : `${t.viewAll} (${notifications.length})`}</span>
              {showAll ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-0 space-y-2">
        {visibleNotifications.map((n) => {
          const isExpanded = !!expandedIds[n.id]

          return (
            <div
              key={n.id}
              className="flex items-start gap-3 p-3 rounded-xl bg-background/80 border border-border/60 text-xs transition-all duration-150"
            >
              <Avatar
                src={n.from_profile?.avatar}
                name={n.from_profile?.full_name}
                userId={n.from_user}
                size="sm"
                className="mt-0.5 shrink-0"
              />
              <div className="flex-1 min-w-0 space-y-0.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-foreground text-xs">
                    {n.from_profile?.full_name || 'เพื่อนนิสิต'}
                  </span>
                  <span className="text-[10px] text-muted-foreground shrink-0 font-normal">
                    {formatRelativeDate(n.created_at)}
                  </span>
                </div>

                <div className="pt-0.5">
                  <p
                    onClick={() => toggleExpandMessage(n.id)}
                    className={`text-xs text-rose-500 dark:text-rose-400 font-semibold cursor-pointer ${
                      isExpanded ? '' : 'line-clamp-2'
                    }`}
                  >
                    <Heart className="w-3 h-3 fill-rose-500 inline mr-1 shrink-0" />
                    <span>{n.message}</span>
                  </p>
                </div>

                {n.goal_title && (
                  <p className="text-[11px] text-muted-foreground truncate font-medium italic pt-0.5">
                    "{n.goal_title}"
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
