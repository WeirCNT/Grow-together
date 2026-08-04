import { Link, useLocation } from 'react-router'
import { LayoutDashboard, Target, Users, User, Sprout, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/context/AuthContext'
import { useLanguage } from '@/context/LanguageContext'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/shared/Avatar'

export function Sidebar() {
  const location = useLocation()
  const { profile, signOut } = useAuth()
  const { t } = useLanguage()

  const navItems = [
    { name: t.dashboard, path: '/dashboard', icon: LayoutDashboard },
    { name: t.goals, path: '/goals', icon: Target },
    { name: t.community, path: '/community', icon: Users },
    { name: t.profile, path: '/profile', icon: User },
  ]

  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-border bg-card p-4 h-screen sticky top-0">
      <div className="flex items-center gap-3 px-3 py-4 mb-6">
        <div className="w-9 h-9 rounded-xl bg-primary-500/10 text-primary-500 flex items-center justify-center font-bold">
          <Sprout className="w-5 h-5 text-primary-500" />
        </div>
        <span className="font-bold text-lg tracking-tight">{t.brandName}</span>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path || (item.path === '/community' && location.pathname === '/friends')
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
                isActive
                  ? 'bg-primary-500/10 text-primary-500 font-semibold'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <Icon className={cn('w-4 h-4', isActive ? 'text-primary-500' : 'text-muted-foreground')} />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {profile && (
        <div className="pt-4 border-t border-border mt-auto space-y-3">
          <div className="flex items-center gap-3 px-3 py-2">
            <Avatar src={profile.avatar} name={profile.full_name} userId={profile.id} size="sm" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{profile.full_name}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive px-3 cursor-pointer"
            onClick={signOut}
          >
            <LogOut className="w-4 h-4" />
            {t.signOut}
          </Button>
        </div>
      )}
    </aside>
  )
}
