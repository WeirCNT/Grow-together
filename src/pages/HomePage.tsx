import { Hero } from '@/components/home/Hero'
import { Features } from '@/components/home/Features'
import { ProductPreview } from '@/components/home/ProductPreview'
import { CTA } from '@/components/home/CTA'
import { ThemeToggle } from '@/components/shared/ThemeToggle'
import { LanguageToggle } from '@/components/shared/LanguageToggle'
import { Link } from 'react-router'
import { Sprout } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/context/LanguageContext'

export function HomePage() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="h-16 border-b border-white/10 px-6 flex items-center justify-between max-w-7xl w-full mx-auto backdrop-blur-xs">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg">
          <div className="w-8 h-8 rounded-lg bg-primary-500/10 text-primary-500 flex items-center justify-center">
            <Sprout className="w-5 h-5 text-primary-500" />
          </div>
          <span>{t.brandName}</span>
        </Link>
        <div className="flex items-center gap-3">
          <LanguageToggle />
          <ThemeToggle />
          <Button asChild variant="ghost" size="sm" className="cursor-pointer">
            <Link to="/login">{t.signIn}</Link>
          </Button>
          <Button asChild size="sm" className="cursor-pointer">
            <Link to="/register">{t.getStarted}</Link>
          </Button>
        </div>
      </header>

      <main className="flex-1">
        <Hero />
        <Features />
        <ProductPreview />
        <CTA />
      </main>

      <footer className="py-6 border-t border-white/10 text-center text-xs text-gray-400">
        {t.brandName} — แพลตฟอร์มพัฒนาตนเองสำหรับนิสิต
      </footer>
    </div>
  )
}
