import { useMemo } from 'react'
import { CheckCircle2, Flame } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip'
import { cn, formatDate } from '@/lib/utils'

interface DailyCheckinRecord {
  date: string
}

interface CheckinHeatmapProps {
  checkins?: DailyCheckinRecord[]
  maxStreak?: number
  className?: string
}

type HeatmapCell =
  | { isPadding: true; id: string }
  | {
      isPadding: false
      id: string
      dateISO: string
      dateObj: Date
      count: number
      isCheckedIn: boolean
      isToday: boolean
      colIndex: number
    }

export function CheckinHeatmap({ checkins = [], maxStreak = 0, className }: CheckinHeatmapProps) {
  const { gridCells, totalCheckinDays, activeMaxStreak } = useMemo(() => {
    const today = new Date()
    const todayISO = today.toISOString().split('T')[0]

    // Map of dateISO -> count of checkins
    const checkinCounts: Record<string, number> = {}
    checkins.forEach((c) => {
      checkinCounts[c.date] = (checkinCounts[c.date] || 0) + 1
    })

    // Calculate last 30 days range
    const daysList = []
    for (let i = 29; i >= 0; i--) {
      const d = new Date()
      d.setDate(today.getDate() - i)
      const dateISO = d.toISOString().split('T')[0]
      const count = checkinCounts[dateISO] || 0
      const dayOfWeek = d.getDay() // 0 = Sun, 1 = Mon, ... 6 = Sat
      const colIndex = (dayOfWeek + 6) % 7 // Mon = 0, Tue = 1, ... Sun = 6

      daysList.push({
        dateISO,
        dateObj: d,
        count,
        isCheckedIn: count > 0,
        isToday: dateISO === todayISO,
        colIndex,
      })
    }

    const totalCheckinDays = daysList.filter((d) => d.isCheckedIn).length

    // Align into 7 column grid (Mon - Sun)
    const firstColIndex = daysList[0]?.colIndex ?? 0
    const paddingStart: HeatmapCell[] = Array.from({ length: firstColIndex }).map((_, idx) => ({
      isPadding: true,
      id: `pad-${idx}`,
    }))

    const dayCells: HeatmapCell[] = daysList.map((d) => ({
      isPadding: false,
      id: d.dateISO,
      ...d,
    }))

    const gridCells: HeatmapCell[] = [...paddingStart, ...dayCells]

    return {
      gridCells,
      totalCheckinDays,
      activeMaxStreak: maxStreak,
    }
  }, [checkins, maxStreak])

  // Thai short weekday headers: Mon to Sun
  const weekHeaders = ['จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.', 'อา.']

  return (
    <Card className={cn('shadow-sm border-border/80', className)}>
      <CardHeader className="pb-3 text-center sm:text-left">
        <CardTitle className="text-base font-bold">
          สถิติการเช็กอิน (30 วันที่ผ่านมา)
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-5">
        <TooltipProvider delayDuration={80}>
          {/* Centered GitHub-style Heatmap Grid */}
          <div className="flex flex-col items-center justify-center">
            {/* Weekday Column Headers (Mon -> Sun) */}
            <div className="grid grid-cols-7 gap-1.5 mb-2 text-center text-xs font-semibold text-muted-foreground w-fit">
              {weekHeaders.map((header) => (
                <div key={header} className="w-5.5 sm:w-6 text-center">
                  {header}
                </div>
              ))}
            </div>

            {/* Heatmap Grid (Staggered load animation + hover scaling) */}
            <div className="grid grid-cols-7 gap-1.5 w-fit">
              {gridCells.map((cell, idx) => {
                if (cell.isPadding) {
                  return <div key={cell.id} className="w-5.5 h-5.5 sm:w-6 sm:h-6" />
                }

                return (
                  <Tooltip key={cell.dateISO}>
                    <TooltipTrigger asChild>
                      <div
                        style={{ animationDelay: `${idx * 15}ms` }}
                        className={cn(
                          'w-5.5 h-5.5 sm:w-6 sm:h-6 rounded-xs transition-all duration-150 ease-out border cursor-pointer shrink-0 animate-scale-in',
                          cell.isCheckedIn
                            ? 'bg-primary-500 border-primary-600 hover:scale-110 hover:shadow-xs'
                            : 'bg-muted/80 border-border/60 dark:bg-muted/40 hover:bg-muted hover:scale-105',
                          cell.isToday && 'ring-2 ring-primary-500/70 ring-offset-1 ring-offset-background'
                        )}
                      />
                    </TooltipTrigger>
                    <TooltipContent side="top" className="text-xs py-1.5 px-3 shadow-md">
                      <div className="font-semibold">{formatDate(cell.dateISO)}</div>
                      <div className="text-[11px] text-muted-foreground mt-0.5">
                        {cell.isCheckedIn
                          ? `✅ เช็กอินแล้ว (${cell.count} รายการ)`
                          : '⬛ ไม่ได้เช็กอิน'}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                )
              })}
            </div>
          </div>
        </TooltipProvider>

        {/* Clean Single-Row Footer Alignment */}
        <div className="border-t border-border/50 pt-3 flex items-center justify-between px-2 sm:px-6 text-xs sm:text-sm font-semibold">
          <div className="flex items-center gap-1.5 text-foreground">
            <CheckCircle2 className="w-4 h-4 text-primary-500 shrink-0" />
            <span>เช็กอิน <strong className="text-primary-500">{totalCheckinDays}</strong> / 30 วัน</span>
          </div>

          <div className="flex items-center gap-1.5 text-foreground">
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500/20 shrink-0" />
            <span>ต่อเนื่องสูงสุด <strong className="text-amber-500">{activeMaxStreak}</strong> วัน</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
