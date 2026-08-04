import { getTodayQuote } from '@/lib/quotes'
import { Card } from '@/components/ui/card'
import { Sparkles } from 'lucide-react'

export function DailyMotivationCard() {
  const dailyQuote = getTodayQuote()

  return (
    <Card className="relative overflow-hidden border border-primary-500/20 bg-gradient-to-r from-primary-500/10 via-emerald-500/5 to-transparent p-4 sm:p-5 shadow-xs transition-all duration-200 hover:shadow-sm">
      <div className="flex items-center gap-3.5">
        <div className="w-10 h-10 rounded-xl bg-primary-500/15 text-primary-600 dark:text-primary-400 flex items-center justify-center text-xl shrink-0 shadow-2xs">
          {dailyQuote.icon}
        </div>
        <div className="flex-1 min-w-0 space-y-0.5">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-primary-600 dark:text-primary-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>แรงบันดาลใจประจำวัน</span>
          </div>
          <p className="text-sm font-medium text-foreground leading-relaxed">
            "{dailyQuote.quote}"
          </p>
        </div>
      </div>
    </Card>
  )
}
