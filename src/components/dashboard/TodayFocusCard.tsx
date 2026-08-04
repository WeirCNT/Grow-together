import { Link } from 'react-router'
import { CheckCircle2, ArrowRight, Target } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckInButton } from '@/components/goals/CheckInButton'
import type { GoalWithCheckins } from '@/types'
import { getTodayISO } from '@/lib/utils'

interface TodayFocusCardProps {
  goals: GoalWithCheckins[]
  onCheckIn: (goalId: string) => void
}

export function TodayFocusCard({ goals, onCheckIn }: TodayFocusCardProps) {
  const today = getTodayISO()
  
  const goalsNeedingCheckin = goals.filter(
    (g) => !g.checkins.some((c) => c.date === today)
  )

  const isAllCheckedIn = goals.length > 0 && goalsNeedingCheckin.length === 0

  if (goals.length === 0) {
    return (
      <Card className="border border-border/80 p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Target className="w-4 h-4 text-primary-500" />
            <span>ภารกิจวันนี้</span>
          </div>
        </div>
        <div className="text-xs text-muted-foreground">
          ยังไม่มีเป้าหมายสำหรับเช็กอินวันนี้ เริ่มสร้างเป้าหมายแรกเพื่อติดตามความก้าวหน้า
        </div>
        <Button asChild size="sm" className="gap-1.5 cursor-pointer">
          <Link to="/goals">
            <span>ไปที่หน้าเป้าหมาย</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </Button>
      </Card>
    )
  }

  return (
    <Card className="border border-border/80 shadow-xs">
      <CardHeader className="pb-3 p-5 flex flex-row items-center justify-between">
        <CardTitle className="text-base font-bold flex items-center gap-2">
          <Target className="w-4 h-4 text-primary-500" />
          <span>ภารกิจวันนี้ ({goals.length - goalsNeedingCheckin.length}/{goals.length} เป้าหมาย)</span>
        </CardTitle>

        <Button asChild variant="ghost" size="sm" className="text-xs gap-1 text-muted-foreground hover:text-foreground">
          <Link to="/goals">
            <span>ดูทั้งหมด</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </Button>
      </CardHeader>

      <CardContent className="p-5 pt-0 space-y-3">
        {isAllCheckedIn ? (
          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>🎉 ยอดเยี่ยมมาก! คุณเช็กอินเป้าหมายประจำวันครบทั้งหมดแล้ว รักษาความต่อเนื่องไว้นะ!</span>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground font-medium">
              เป้าหมายที่รอการเช็กอินวันนี้ ({goalsNeedingCheckin.length} รายการ):
            </p>
            <div className="grid gap-2">
              {goalsNeedingCheckin.slice(0, 3).map((goal) => (
                <div
                  key={goal.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-muted/50 border border-border/60 text-xs"
                >
                  <div className="space-y-0.5 pr-2 truncate">
                    <p className="font-semibold text-foreground truncate">{goal.title}</p>
                    <p className="text-[11px] text-muted-foreground">ทำต่อเนื่อง {goal.streak} วัน</p>
                  </div>

                  <CheckInButton
                    isChecked={false}
                    onClick={() => onCheckIn(goal.id)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
