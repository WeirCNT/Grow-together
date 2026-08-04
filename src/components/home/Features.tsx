import { Target, CalendarCheck, BarChart3, Users } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'

export function Features() {
  const { t } = useLanguage()

  const features = [
    {
      icon: Target,
      title: t.customCategories,
      description: t.customCategoriesSub,
    },
    {
      icon: CalendarCheck,
      title: t.oneClickCheckin,
      description: t.oneClickCheckinSub,
    },
    {
      icon: BarChart3,
      title: t.visualDashboard,
      description: t.visualDashboardSub,
    },
    {
      icon: Users,
      title: t.mutualMotivation,
      description: t.mutualMotivationSub,
    },
  ]

  return (
    <section className="py-16 bg-muted/40 border-y border-border px-4">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-bold tracking-tight">{t.everythingYouNeed}</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            {t.featuresSub}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => {
            const Icon = f.icon
            return (
              <div key={i} className="p-6 rounded-xl border border-border bg-card space-y-3">
                <div className="w-10 h-10 rounded-lg bg-primary-500/10 text-primary-500 flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-base">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
