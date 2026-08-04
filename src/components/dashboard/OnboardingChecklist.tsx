import { useState } from 'react'
import { Link } from 'react-router'
import { CheckCircle2, Circle, Camera, Target, Flame, Sparkles, X } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import type { Profile, GoalWithCheckins } from '@/types'

interface OnboardingChecklistProps {
  profile: Profile | null
  goals: GoalWithCheckins[]
}

export function OnboardingChecklist({ profile, goals }: OnboardingChecklistProps) {
  const [dismissed, setDismissed] = useState(() => {
    return localStorage.getItem('grow-together-onboarding-dismissed') === 'true'
  })

  // Step 1: Upload avatar
  const hasAvatar = Boolean(profile?.avatar)
  // Step 2: Create first goal
  const hasGoal = goals.length > 0
  // Step 3: Complete first check-in
  const hasCheckin = goals.some((g) => g.checkins.length > 0)

  const steps = [
    {
      id: 'avatar',
      label: 'เปลี่ยนรูปโปรไฟล์นิสิต',
      completed: hasAvatar,
      link: '/profile',
      icon: Camera,
    },
    {
      id: 'goal',
      label: 'สร้างเป้าหมายแรกของคุณ',
      completed: hasGoal,
      link: '/goals',
      icon: Target,
    },
    {
      id: 'checkin',
      label: 'เช็กอินบันทึกความก้าวหน้าวันแรก',
      completed: hasCheckin,
      link: '/goals',
      icon: Flame,
    },
  ]

  const completedCount = steps.filter((s) => s.completed).length
  const progressPercent = Math.round((completedCount / steps.length) * 100)
  const isAllComplete = completedCount === steps.length

  if (dismissed) return null

  const handleDismiss = () => {
    setDismissed(true)
    localStorage.setItem('grow-together-onboarding-dismissed', 'true')
  }

  return (
    <Card className="border border-primary-500/30 bg-gradient-to-r from-primary-500/10 via-emerald-500/5 to-transparent p-5 shadow-xs transition-all duration-200 animate-fade-in relative">
      <button
        type="button"
        onClick={handleDismiss}
        className="absolute top-3 right-3 text-muted-foreground hover:text-foreground cursor-pointer p-1 rounded-md"
        title="ปิดคำแนะนำ"
      >
        <X className="w-4 h-4" />
      </button>

      <CardHeader className="p-0 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary-500/15 text-primary-500 flex items-center justify-center">
            <Sparkles className="w-4.5 h-4.5" />
          </div>
          <div>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <span>เริ่มต้นใช้งาน Grow Together</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-primary-500/20 text-primary-600 dark:text-primary-400 font-semibold">
                {completedCount} / {steps.length}
              </span>
            </CardTitle>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0 space-y-3">
        <div className="space-y-1">
          <Progress value={progressPercent} className="h-1.5" />
        </div>

        {isAllComplete ? (
          <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              🎉 ยินดีด้วย! คุณเริ่มต้นเส้นทางการพัฒนาตนเองสำเร็จแล้ว
            </span>
            <Button size="sm" variant="ghost" onClick={handleDismiss} className="text-xs h-7 px-2 cursor-pointer">
              ปิด
            </Button>
          </div>
        ) : (
          <div className="grid gap-2">
            {steps.map((step) => {
              const StepIcon = step.icon
              return (
                <div
                  key={step.id}
                  className="flex items-center justify-between p-2.5 px-3 rounded-xl bg-background/80 border border-border/60 text-xs transition-all duration-150 hover:border-primary-500/30"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {step.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    ) : (
                      <Circle className="w-4 h-4 text-muted-foreground shrink-0" />
                    )}
                    <span className={step.completed ? 'line-through text-muted-foreground' : 'font-medium text-foreground'}>
                      {step.label}
                    </span>
                  </div>

                  {!step.completed && (
                    <Button asChild size="sm" variant="outline" className="h-7 text-[11px] px-2.5 cursor-pointer">
                      <Link to={step.link}>
                        <StepIcon className="w-3 h-3 text-primary-500" />
                        <span>ทำรายการ</span>
                      </Link>
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
