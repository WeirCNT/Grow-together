import { useMemo } from 'react'
import { cn } from '@/lib/utils'

interface AvatarProps {
  src?: string | null
  name?: string
  userId?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const colorVariants = [
  'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
  'bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/30',
  'bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/30',
  'bg-purple-500/20 text-purple-600 dark:text-purple-400 border-purple-500/30',
  'bg-rose-500/20 text-rose-600 dark:text-rose-400 border-rose-500/30',
  'bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border-cyan-500/30',
  'bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border-indigo-500/30',
  'bg-teal-500/20 text-teal-600 dark:text-teal-400 border-teal-500/30',
]

const sizeClasses = {
  xs: 'w-6 h-6 text-xs font-semibold',
  sm: 'w-8 h-8 text-xs font-semibold',
  md: 'w-10 h-10 text-sm font-bold',
  lg: 'w-16 h-16 text-xl font-bold',
  xl: 'w-24 h-24 text-3xl font-extrabold',
}

export function Avatar({ src, name = 'Student', userId = '', size = 'md', className }: AvatarProps) {
  // Generate consistent color index derived from userId or name
  const colorClass = useMemo(() => {
    const key = userId || name
    let hash = 0
    for (let i = 0; i < key.length; i++) {
      hash = key.charCodeAt(i) + ((hash << 5) - hash)
    }
    const index = Math.abs(hash) % colorVariants.length
    return colorVariants[index]
  }, [userId, name])

  // Get the first character (supports Thai and English)
  const initial = useMemo(() => {
    const trimmed = (name || 'S').trim()
    return trimmed.charAt(0).toUpperCase()
  }, [name])

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={cn(
          'rounded-full object-cover border border-border/80 shadow-sm shrink-0',
          sizeClasses[size],
          className
        )}
        onError={(e) => {
          // If image fails to load, fallback to initials
          (e.target as HTMLElement).style.display = 'none'
        }}
      />
    )
  }

  return (
    <div
      className={cn(
        'rounded-full flex items-center justify-center border shadow-sm shrink-0 transition-transform',
        sizeClasses[size],
        colorClass,
        className
      )}
    >
      <span>{initial}</span>
    </div>
  )
}
