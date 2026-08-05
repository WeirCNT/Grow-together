import { Link } from 'react-router'
import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { motion } from 'framer-motion'

export function CTA() {
  const { t } = useLanguage()

  return (
    <section className="py-24 px-4 text-center relative">
      <div className="max-w-2xl mx-auto space-y-6 p-8 sm:p-12 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm shadow-xl relative overflow-hidden hover:border-primary-500/40 transition-colors duration-300">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-500 px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20">
          <Sparkles className="w-3.5 h-3.5" />
          <span>เริ่มต้นพัฒนาตนเองวันนี้</span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
          {t.readyToBuild}
        </h2>
        
        <p className="text-gray-400 text-sm sm:text-base max-w-md mx-auto leading-[170%]">
          {t.readyToBuildSub}
        </p>

        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          transition={{ duration: 0.2 }}
          className="inline-block pt-2"
        >
          <Button asChild size="lg" className="gap-2 font-semibold px-8 h-12 text-base shadow-md cursor-pointer">
            <Link to="/register">
              {t.getStartedFree} <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
