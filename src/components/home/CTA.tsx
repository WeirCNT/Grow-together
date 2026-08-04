import { Link } from 'react-router'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'

export function CTA() {
  const { t } = useLanguage()

  return (
    <section className="py-20 px-4 text-center">
      <div className="max-w-2xl mx-auto space-y-6 p-10 rounded-2xl bg-card border border-border shadow-xl">
        <h2 className="text-3xl font-bold tracking-tight">{t.readyToBuild}</h2>
        <p className="text-muted-foreground">
          {t.readyToBuildSub}
        </p>
        <Button asChild size="lg" className="gap-2 font-semibold">
          <Link to="/register">
            {t.createAccount} <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
      </div>
    </section>
  )
}
