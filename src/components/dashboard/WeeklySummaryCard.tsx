import { useMemo } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Calendar, Flame, TrendingUp, CheckCircle2 } from 'lucide-react'
import type { GoalWithCheckins } from '@/types'
import { getCheckinsLast7Days } from '@/services/checkinService'

interface WeeklySummaryCardProps {
  goals: GoalWithCheckins[]
}

export function WeeklySummaryCard({ goals }: WeeklySummaryCardProps) {
  const { checkinsLast7Days, maxStreak, totalCheckins } = useMemo(() => {
    const allCheckins = goals.flatMap((g) => g.checkins)
    const checkinsLast7Days = goals.reduce(
      (acc, g) => acc + getCheckinsLast7Days(g.checkins),
      0
    )
    const maxStreak = goals.reduce((m, g) => Math.max(m, g.streak), 0)
    return {
      checkinsLast7Days,
      maxStreak,
      totalCheckins: allCheckins.length,
    }
  }, [goals])

  return (
    <Card className="border border-border/80 shadow-xs">
      <CardHeader className="p-5 pb-3">
        <CardTitle className="text-base font-bold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary-500" />
            <span>สรุปผลประจำสัปดาห์</span>
          </div>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            ดีขึ้นจากสัปดาห์ก่อน
          </span>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-5 pt-0">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="p-3 rounded-xl bg-muted/60 border border-border/50 space-y-1">
            <span className="text-[11px] text-muted-foreground font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-primary-500" />
              เช็กอิน 7 วันล่าสุด
            </span>
            <p className="text-lg font-extrabold text-foreground">{checkinsLast7Days} ครั้ง</p>
          </div>

          <div className="p-3 rounded-xl bg-muted/60 border border-border/50 space-y-1">
            <span className="text-[11px] text-muted-foreground font-semibold flex items-center gap-1">
              <Flame className="w-3 h-3 text-amber-500 fill-amber-500/20" />
              ต่อเนื่องสูงสุด
            </span>
            <p className="text-lg font-extrabold text-foreground">{maxStreak} วัน</p>
          </div>

          <div className="col-span-2 sm:col-span-1 p-3 rounded-xl bg-muted/60 border border-border/50 space-y-1">
            <span className="text-[11px] text-muted-foreground font-semibold flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-blue-500" />
              สะสมรวมทั้งหมด
            </span>
            <p className="text-lg font-extrabold text-foreground">{totalCheckins} ครั้ง</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
