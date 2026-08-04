import { Link } from 'react-router'
import { Sprout, ArrowRight, Target, Flame, HeartHandshake } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/context/LanguageContext'

export function Hero() {
  const { t } = useLanguage()

  return (
    <section className="py-20 md:py-28 px-4 text-center relative overflow-hidden">
      <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/10 text-primary-500 text-xs font-semibold uppercase tracking-wider">
          <Sprout className="w-3.5 h-3.5" /> {t.heroTag}
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
          {t.heroTitle1} <br />
          <span className="text-primary-500">{t.heroTitle2}</span>
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          {t.heroSub}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button asChild size="lg" className="gap-2 text-base font-semibold">
            <Link to="/register">
              {t.getStartedFree} <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="text-base font-semibold">
            <Link to="/login">{t.signIn}</Link>
          </Button>
        </div>

        <div className="pt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 text-left max-w-2xl mx-auto">
          <div className="p-4 rounded-xl border border-border bg-card/50 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-primary-500/10 text-primary-500">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">{t.personalGoals}</h3>
              <p className="text-xs text-muted-foreground">{t.personalGoalsSub}</p>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-border bg-card/50 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">{t.dailyStreaks}</h3>
              <p className="text-xs text-muted-foreground">{t.dailyStreaksSub}</p>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-border bg-card/50 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-rose-500/10 text-rose-500">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">{t.friendSupport}</h3>
              <p className="text-xs text-muted-foreground">{t.friendSupportSub}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
