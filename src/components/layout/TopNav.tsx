import { ThemeToggle } from '@/components/shared/ThemeToggle'
import { LanguageToggle } from '@/components/shared/LanguageToggle'
import { useLocation } from 'react-router'
import { useLanguage } from '@/context/LanguageContext'

export function TopNav() {
  const location = useLocation()
  const { t } = useLanguage()

  const pageTitles: Record<string, string> = {
    '/dashboard': t.dashboard,
    '/goals': t.myGoals,
    '/community': t.communityTitle,
    '/friends': t.communityTitle,
    '/profile': t.myProfile,
  }

  const title = pageTitles[location.pathname] || t.brandName

  return (
    <header className="h-16 border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-30 px-6 flex items-center justify-between">
      <h1 className="text-lg font-bold tracking-tight">{title}</h1>
      <div className="flex items-center gap-2">
        <LanguageToggle />
        <ThemeToggle />
      </div>
    </header>
  )
}
