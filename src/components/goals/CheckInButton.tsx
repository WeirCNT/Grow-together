import { Check, Flame } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useLanguage } from '@/context/LanguageContext'

interface CheckInButtonProps {
  isChecked: boolean
  onClick: () => void
  disabled?: boolean
}

export function CheckInButton({ isChecked, onClick, disabled }: CheckInButtonProps) {
  const { t } = useLanguage()
  return (
    <Button
      variant={isChecked ? 'default' : 'outline'}
      size="sm"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'gap-2 transition-all duration-200 cursor-pointer',
        isChecked
          ? 'bg-primary-500 hover:bg-primary-600 text-white shadow-sm'
          : 'hover:border-primary-500 hover:text-primary-500'
      )}
    >
      {isChecked ? (
        <>
          <Check className="w-4 h-4" />
          <span>{t.checkedIn}</span>
        </>
      ) : (
        <>
          <Flame className="w-4 h-4" />
          <span>{t.dailyCheckin}</span>
        </>
      )}
    </Button>
  )
}
