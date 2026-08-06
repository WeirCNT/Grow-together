import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('th-TH', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function formatRelativeDate(date: string | Date): string {
  const now = new Date()
  const d = new Date(date)
  const diffMs = now.getTime() - d.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'เมื่อสักครู่'
  if (diffMins < 60) return `${diffMins} นาทีที่แล้ว`
  if (diffHours < 24) return `${diffHours} ชั่วโมงที่แล้ว`
  if (diffDays < 7) return `${diffDays} วันที่แล้ว`
  return formatDate(date)
}

export function formatRelativeEncouragedDate(date: string | Date, lang: 'th' | 'en' = 'th'): string {
  const now = new Date()
  const todayStr = getTodayISO()
  const target = new Date(date)
  const targetStr = `${target.getFullYear()}-${String(target.getMonth() + 1).padStart(2, '0')}-${String(target.getDate()).padStart(2, '0')}`

  if (targetStr === todayStr) {
    return lang === 'th' ? 'วันนี้' : 'Today'
  }

  const yesterday = new Date(now)
  yesterday.setDate(now.getDate() - 1)
  const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`

  if (targetStr === yesterdayStr) {
    return lang === 'th' ? 'เมื่อวาน' : 'Yesterday'
  }

  const diffMs = now.getTime() - target.getTime()
  const diffDays = Math.floor(diffMs / 86400000)
  if (diffDays < 7 && diffDays > 0) {
    return lang === 'th' ? `${diffDays} วันที่แล้ว` : `${diffDays} days ago`
  }

  return target.toLocaleDateString(lang === 'th' ? 'th-TH' : 'en-US', {
    month: 'short',
    day: 'numeric',
  })
}

export function getTodayISO(): string {
  const d = new Date()
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}
