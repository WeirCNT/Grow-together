import { Button } from '@/components/ui/button'
import { useLanguage } from '@/context/LanguageContext'
import { Globe } from 'lucide-react'

export function LanguageToggle() {
  const { language, toggleLanguage, t } = useLanguage()

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="gap-1.5 font-semibold text-xs border border-border/50 hover:bg-muted"
      aria-label={t.toggleLanguage}
    >
      <Globe className="w-3.5 h-3.5" />
      <span>{language === 'th' ? 'ไทย' : 'ไทย'}</span>
    </Button>
  )
}
