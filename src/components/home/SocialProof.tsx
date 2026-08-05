import { Target, Flame, TrendingUp, Users } from 'lucide-react'
import { motion, type Variants } from 'framer-motion'
import { useLanguage } from '@/context/LanguageContext'

export function SocialProof() {
  const { t } = useLanguage()

  const cards = [
    {
      icon: Target,
      title: t.unlimitedGoalsTitle,
      description: t.unlimitedGoalsSub,
      color: 'text-primary-500 bg-primary-500/10 border-primary-500/20',
      glow: 'group-hover:drop-shadow-[0_0_12px_rgba(34,197,94,0.5)]',
    },
    {
      icon: Flame,
      title: t.oneClickTitle,
      description: t.oneClickSub,
      color: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
      glow: 'group-hover:drop-shadow-[0_0_12px_rgba(245,158,11,0.5)]',
    },
    {
      icon: TrendingUp,
      title: t.trackDisciplineTitle,
      description: t.trackDisciplineSub,
      color: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
      glow: 'group-hover:drop-shadow-[0_0_12px_rgba(59,130,246,0.5)]',
    },
    {
      icon: Users,
      title: t.sendSupportTitle,
      description: t.sendSupportSub,
      color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
      glow: 'group-hover:drop-shadow-[0_0_12px_rgba(16,185,129,0.5)]',
    },
  ]

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
      },
    },
  }

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
    },
  }

  return (
    <section className="py-24 px-4 relative bg-white/[0.01] border-y border-white/5">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-center space-y-4"
        >
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            {t.whyDifferent}
          </h2>
          <p className="text-base text-gray-400 max-w-xl mx-auto leading-[170%]">
            ระบบและเครื่องมือที่ออกแบบมาเพื่อช่วยให้นิสิตสร้างวินัยได้อย่างเป็นธรรมชาติ
          </p>
        </motion.div>

        {/* 4 Benefit Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {cards.map((card, idx) => {
            const Icon = card.icon
            return (
              <motion.div
                key={idx}
                variants={cardVariants}
                whileHover={{ y: -6, scale: 1.02 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="group p-6 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm space-y-4 shadow-xs hover:border-primary-500/50 hover:shadow-[0_8px_30px_rgb(34,197,94,0.1)] transition-all duration-250 cursor-pointer"
              >
                <div
                  className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-all duration-250 ${card.color} ${card.glow}`}
                >
                  <Icon className="w-6 h-6" />
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold text-lg text-foreground tracking-tight leading-snug">
                    {card.title}
                  </h3>
                  <p className="text-sm text-gray-400 leading-[170%]">
                    {card.description}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
