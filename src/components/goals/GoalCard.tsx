import { MoreVertical, Trash2, Edit2 } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { CheckInButton } from './CheckInButton'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import type { GoalWithCheckins } from '@/types'
import { useLanguage } from '@/context/LanguageContext'
import { WeeklyActivityGrid } from '@/components/shared/WeeklyActivityGrid'

interface GoalCardProps {
  goal: GoalWithCheckins
  isCheckedIn: boolean
  onCheckIn: () => void
  onEdit: () => void
  onDelete: () => void
}

export function GoalCard({ goal, isCheckedIn, onCheckIn, onEdit, onDelete }: GoalCardProps) {
  const { t } = useLanguage()

  return (
    <Card className="hover:border-primary-500/50 transition-all duration-200 shadow-sm flex flex-col justify-between">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
        <div className="space-y-1 pr-4">
          <CardTitle className="text-base font-bold leading-snug">{goal.title}</CardTitle>
          {goal.description && (
            <p className="text-sm text-muted-foreground leading-relaxed">{goal.description}</p>
          )}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground cursor-pointer">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onEdit} className="gap-2">
              <Edit2 className="w-4 h-4" /> {t.edit}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDelete} className="gap-2 text-destructive">
              <Trash2 className="w-4 h-4" /> {t.delete}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* GitHub Style 7-Day Activity Grid */}
        <WeeklyActivityGrid checkins={goal.checkins} streak={goal.streak} />

        <div className="pt-2 flex justify-end border-t border-border/50">
          <CheckInButton isChecked={isCheckedIn} onClick={onCheckIn} />
        </div>
      </CardContent>
    </Card>
  )
}
