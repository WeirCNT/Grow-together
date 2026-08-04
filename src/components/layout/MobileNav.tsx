import { Link, useLocation } from 'react-router'
import { LayoutDashboard, Target, Users, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useLanguage } from '@/context/LanguageContext'

export function MobileNav() {
  const location = useLocation()
  const { t } = useLanguage()

  const navItems = [
    { name: t.dashboard, path: '/dashboard', icon: LayoutDashboard },
    { name: t.goals, path: '/goals', icon: Target },
    { name: t.community, path: '/community', icon: Users },
    { name: t.profile, path: '/profile', icon: User },
  ]

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t border-border bg-card/90 backdrop-blur-md z-40 px-4 py-2 flex justify-around items-center">
      {navItems.map((item) => {
        const Icon = item.icon
        const isActive = location.pathname === item.path || (item.path === '/community' && location.pathname === '/friends')
        return (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              'flex flex-col items-center gap-1 p-2 rounded-lg text-xs font-medium transition-colors',
              isActive ? 'text-primary-500 font-semibold' : 'text-muted-foreground'
            )}
          >
            <Icon className="w-5 h-5" />
            <span>{item.name}</span>
          </Link>
        )
      })}
    </nav>
  )
}
