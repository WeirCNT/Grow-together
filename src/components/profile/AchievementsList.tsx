import { Award, Lock } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import type { GoalWithCheckins } from '@/types'
import { cn } from '@/lib/utils'

interface AchievementsListProps {
  goals: GoalWithCheckins[]
}

export function AchievementsList({ goals }: AchievementsListProps) {
  const totalGoals = goals.length
  const totalCheckins = goals.reduce((acc, g) => acc + g.checkins.length, 0)
  const maxStreak = goals.reduce((m, g) => Math.max(m, g.streak), 0)

  const achievements = [
    {
      id: 'first-goal',
      title: 'เป้าหมายแรก',
      description: 'สร้างเป้าหมายแรกเพื่อเริ่มต้นพัฒนาตนเอง',
      icon: '🏅',
      unlocked: totalGoals > 0,
    },
    {
      id: 'streak-7',
      title: 'ทำต่อเนื่อง 7 วัน',
      description: 'เช็กอินเป้าหมายติดต่อกันครบ 7 วัน',
      icon: '🔥',
      unlocked: maxStreak >= 7,
    },
    {
      id: 'first-support',
      title: 'กำลังใจแรก',
      description: 'ส่งกำลังใจเพื่อสร้างแรงบันดาลใจให้เพื่อน',
      icon: '❤️',
      unlocked: totalCheckins > 0,
    },
    {
      id: 'checkin-30',
      title: 'เช็กอิน 30 ครั้ง',
      description: 'สะสมการเช็กอินเป้าหมายครบ 30 ครั้ง',
      icon: '🎯',
      unlocked: totalCheckins >= 30,
    },
  ]

  const unlockedCount = achievements.filter((a) => a.unlocked).length

  return (
    <Card className="shadow-xs border-border/80">
      <CardHeader className="p-5 pb-3 flex flex-row items-center justify-between">
        <CardTitle className="text-base font-bold flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-500" />
          <span>เหรียญรางวัลความก้าวหน้า</span>
        </CardTitle>
        <span className="text-xs font-semibold text-muted-foreground">
          ปลดล็อกแล้ว {unlockedCount} / {achievements.length}
        </span>
      </CardHeader>

      <CardContent className="p-5 pt-0">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {achievements.map((item) => (
            <div
              key={item.id}
              className={cn(
                'p-3.5 rounded-xl border text-center space-y-1.5 transition-all duration-200',
                item.unlocked
                  ? 'bg-amber-500/10 border-amber-500/30 text-foreground'
                  : 'bg-muted/40 border-border/40 text-muted-foreground opacity-60'
              )}
            >
              <div className="text-2xl relative inline-block">
                {item.icon}
                {!item.unlocked && (
                  <Lock className="w-3.5 h-3.5 absolute -bottom-1 -right-1 text-muted-foreground" />
                )}
              </div>
              <p className="text-xs font-bold truncate">{item.title}</p>
              <p className="text-[10px] text-muted-foreground leading-tight line-clamp-2">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
