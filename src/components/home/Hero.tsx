import { Link } from 'react-router'
import { Sprout, ArrowRight, Target, Flame, HeartHandshake } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/context/LanguageContext'
import { motion, type Variants } from 'framer-motion'

export function Hero() {
  const { t } = useLanguage()

  const containerVariants: Variants = {
    hidden: { opacity: 0, y: 28 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
        staggerChildren: 0.12,
      },
    },
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
    },
  }

  return (
    <section className="py-24 md:py-32 px-4 text-center relative overflow-hidden">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="max-w-3xl mx-auto space-y-8"
      >
        <motion.div variants={itemVariants} className="inline-block">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-500/10 text-primary-500 border border-primary-500/20 text-xs font-semibold uppercase tracking-wider">
            <Sprout className="w-3.5 h-3.5" /> {t.heroTag}
          </div>
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-tight text-foreground"
        >
          {t.heroTitle1} <br />
          <span className="text-primary-500 bg-gradient-to-r from-primary-500 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
            {t.heroTitle2}
          </span>
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-base sm:text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-[170%]"
        >
          {t.heroSub}
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center pt-2"
        >
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.2 }}
          >
            <Button asChild size="lg" className="gap-2 text-base font-semibold px-8 shadow-md cursor-pointer w-full sm:w-auto h-12">
              <Link to="/register">
                {t.getStartedFree} <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.2 }}
          >
            <Button asChild variant="outline" size="lg" className="text-base font-semibold px-8 cursor-pointer w-full sm:w-auto h-12 border-white/10 bg-white/[0.03] backdrop-blur-xs hover:border-primary-500/50">
              <Link to="/login">{t.signIn}</Link>
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="pt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left max-w-2xl mx-auto"
        >
          <motion.div
            whileHover={{ y: -6, scale: 1.02 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="group p-4 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm flex items-start gap-3 hover:border-primary-500/50 hover:shadow-[0_8px_30px_rgb(34,197,94,0.1)] transition-all duration-250 cursor-pointer"
          >
            <div className="p-2 rounded-xl bg-primary-500/10 text-primary-500 group-hover:drop-shadow-[0_0_12px_rgba(34,197,94,0.5)] transition-all duration-250">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-foreground">{t.personalGoals}</h3>
              <p className="text-xs text-gray-400">{t.personalGoalsSub}</p>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -6, scale: 1.02 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="group p-4 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm flex items-start gap-3 hover:border-primary-500/50 hover:shadow-[0_8px_30px_rgb(34,197,94,0.1)] transition-all duration-250 cursor-pointer"
          >
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500 group-hover:drop-shadow-[0_0_12px_rgba(245,158,11,0.5)] transition-all duration-250">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-foreground">{t.dailyStreaks}</h3>
              <p className="text-xs text-gray-400">{t.dailyStreaksSub}</p>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -6, scale: 1.02 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="group p-4 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm flex items-start gap-3 hover:border-primary-500/50 hover:shadow-[0_8px_30px_rgb(34,197,94,0.1)] transition-all duration-250 cursor-pointer"
          >
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-500 group-hover:drop-shadow-[0_0_12px_rgba(244,63,94,0.5)] transition-all duration-250">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-foreground">{t.friendSupport}</h3>
              <p className="text-xs text-gray-400">{t.friendSupportSub}</p>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  )
}
