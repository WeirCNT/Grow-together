import { useMemo } from 'react'
import { Flame } from 'lucide-react'
import { cn } from '@/lib/utils'

interface WeeklyActivityGridProps {
  checkins?: { date: string }[]
  streak?: number
  className?: string
}

export function WeeklyActivityGrid({ checkins = [], streak = 0, className }: WeeklyActivityGridProps) {
  const days = useMemo(() => {
    const today = new Date()
    const todayISO = today.toISOString().split('T')[0]
    const checkinSet = new Set(checkins.map((c) => c.date))
    const dayNamesTH = ['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.']

    const list = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(today.getDate() - i)
      const dateISO = d.toISOString().split('T')[0]
      const dayLabel = dayNamesTH[d.getDay()]
      const isCheckedIn = checkinSet.has(dateISO)
      const isToday = dateISO === todayISO

      list.push({
        dateISO,
        dayLabel,
        isCheckedIn,
        isToday,
      })
    }
    return list
  }, [checkins])

  const completedCount = useMemo(() => {
    return days.filter((d) => d.isCheckedIn).length
  }, [days])

  return (
    <div className={cn('space-y-1.5 py-0.5', className)}>
      {/* Line 1: Streak Badge & 7-day completion status */}
      <div className="flex items-center justify-between text-xs font-semibold">
        <span className="flex items-center gap-1 text-amber-500">
          <Flame className="w-3.5 h-3.5 fill-amber-500/20 shrink-0" />
          <span>ทำต่อเนื่อง {streak} วัน</span>
        </span>
        <span className="text-[11px] text-muted-foreground font-normal">
          ทำสำเร็จ {completedCount}/7 วัน
        </span>
      </div>

      {/* Line 2: Compact GitHub-style horizontal activity row */}
      <div className="flex items-center gap-1.5">
        {days.map((day) => (
          <div
            key={day.dateISO}
            title={`${day.dayLabel} (${day.dateISO})${day.isCheckedIn ? ' - เช็กอินแล้ว' : ''}`}
            className={cn(
              'w-3.5 h-3.5 rounded-xs transition-all duration-150 shrink-0 cursor-help',
              day.isCheckedIn
                ? 'bg-primary-500 border border-primary-600 shadow-xs'
                : 'bg-muted border border-border/60 dark:bg-muted/40',
              day.isToday && 'ring-2 ring-primary-500/70 ring-offset-1 ring-offset-background'
            )}
          />
        ))}
      </div>
    </div>
  )
}
