import { useAuth } from '@/context/AuthContext'
import { useGoals } from '@/hooks/useGoals'
import { StatsSkeleton } from '@/components/shared/LoadingSkeleton'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Target, Flame, CheckCircle2, ShieldCheck } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { Avatar } from '@/components/shared/Avatar'
import { CheckinHeatmap } from '@/components/dashboard/CheckinHeatmap'
import { DailyMotivationCard } from '@/components/dashboard/DailyMotivationCard'
import { TodayFocusCard } from '@/components/dashboard/TodayFocusCard'
import { OnboardingChecklist } from '@/components/dashboard/OnboardingChecklist'
import { WeeklySummaryCard } from '@/components/dashboard/WeeklySummaryCard'
import { calculateDisciplineScore } from '@/services/checkinService'
import { useCountUp } from '@/hooks/useCountUp'

export function DashboardPage() {
  const { user, profile } = useAuth()
  const { t } = useLanguage()
  const { goals, loading, checkin } = useGoals(user?.id)

  const totalGoals = goals.length
  const allCheckins = goals.flatMap((g) => g.checkins)
  const totalCheckins = allCheckins.length
  const maxStreak = goals.reduce((max, g) => Math.max(max, g.streak), 0)

  // Calculate gamified Discipline Score
  const disciplineScore = calculateDisciplineScore(goals)

  // Number counting animations on dashboard load
  const animatedGoals = useCountUp(totalGoals, 400)
  const animatedStreak = useCountUp(maxStreak, 500)
  const animatedCheckins = useCountUp(totalCheckins, 600)
  const animatedScore = useCountUp(disciplineScore, 500)

  if (loading) {
    return <StatsSkeleton />
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Avatar src={profile?.avatar} name={profile?.full_name} userId={profile?.id} size="lg" />
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">
            {t.welcomeStudent} {profile?.full_name || 'นิสิต'}! 👋
          </h2>
          <p className="text-sm text-muted-foreground font-normal">
            สร้างนิสัยที่ดี วันละนิด แล้วเติบโตไปด้วยกัน
          </p>
        </div>
      </div>

      {/* 1. Onboarding Guided Checklist (for new/setup users) */}
      <OnboardingChecklist profile={profile} goals={goals} />

      {/* 2. Daily Motivation Card */}
      <DailyMotivationCard />

      {/* 3. Today's Focus Card (Answers: What should I do today?) */}
      <TodayFocusCard goals={goals} onCheckIn={checkin} />

      {/* 4. Top Stat Cards (Answers: How am I doing?) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Goals */}
        <Card className="flex flex-col justify-between h-full shadow-xs border-border/80 hover:shadow-sm hover:-translate-y-0.5 transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2 p-5">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t.totalGoals}
            </CardTitle>
            <Target className="w-4 h-4 text-primary-500 shrink-0" />
          </CardHeader>
          <CardContent className="p-5 pt-0">
            <div className="text-2xl font-extrabold text-foreground">{animatedGoals}</div>
            <p className="text-[11px] text-muted-foreground mt-1">เป้าหมายทั้งหมดที่กำลังทำ</p>
          </CardContent>
        </Card>

        {/* Card 2: Best Streak */}
        <Card className="flex flex-col justify-between h-full shadow-xs border-border/80 hover:shadow-sm hover:-translate-y-0.5 transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2 p-5">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t.bestStreak}
            </CardTitle>
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500/20 shrink-0" />
          </CardHeader>
          <CardContent className="p-5 pt-0">
            <div className="text-2xl font-extrabold text-foreground">
              {animatedStreak} <span className="text-sm font-normal text-muted-foreground">{t.days}</span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">วันที่ทำสถิติต่อเนื่องยาวนานที่สุด</p>
          </CardContent>
        </Card>

        {/* Card 3: Total Checkins */}
        <Card className="flex flex-col justify-between h-full shadow-xs border-border/80 hover:shadow-sm hover:-translate-y-0.5 transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2 p-5">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t.totalCheckins}
            </CardTitle>
            <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />
          </CardHeader>
          <CardContent className="p-5 pt-0">
            <div className="text-2xl font-extrabold text-foreground">{animatedCheckins}</div>
            <p className="text-[11px] text-muted-foreground mt-1">จำนวนครั้งที่เช็กอินสะสม</p>
          </CardContent>
        </Card>

        {/* Card 4: Gamified Discipline Score */}
        <Card className="flex flex-col justify-between h-full shadow-xs border-border/80 hover:shadow-sm hover:-translate-y-0.5 transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2 p-5">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t.disciplineScore}
            </CardTitle>
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
          </CardHeader>
          <CardContent className="p-5 pt-0">
            <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
              {animatedScore}%
            </div>
            <p className="text-[11px] text-muted-foreground mt-1 truncate">
              {t.disciplineSubtitle}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 5. Weekly Summary Card */}
      <WeeklySummaryCard goals={goals} />

      {/* 6. GitHub-style 30-Day Check-in Heatmap */}
      <CheckinHeatmap checkins={allCheckins} maxStreak={maxStreak} />
    </div>
  )
}
