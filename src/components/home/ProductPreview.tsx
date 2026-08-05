import { useState } from 'react'
import { Target, Flame, ShieldCheck, CheckCircle2, Sparkles } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { motion } from 'framer-motion'

interface ProductPreviewProps {
  imageSrc?: string
}

export function ProductPreview({ imageSrc = '/dashboard-preview.png' }: ProductPreviewProps) {
  const { t } = useLanguage()
  const [imageError, setImageError] = useState(false)

  // 30-day heatmap grid indicators for fallback preview
  const heatmapCells = [
    true, false, true, true, false, true, true,
    true, true, false, true, true, true, false,
    true, true, true, false, true, true, true,
    true, false, true, true, true, true, true,
    true, true,
  ]

  return (
    <section className="py-20 md:py-28 px-4 relative">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-center space-y-4"
        >
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            {t.productPreviewTitle}
          </h2>
          <p className="text-base text-gray-400 max-w-xl mx-auto leading-[170%]">
            {t.productPreviewSub}
          </p>
        </motion.div>

        {/* Responsive Dashboard Preview Container */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-5xl mx-auto"
        >
          <div className="group rounded-2xl border border-white/10 bg-card/90 backdrop-blur-sm p-4 sm:p-8 shadow-2xl shadow-primary-500/10 hover:border-primary-500/40 hover:-translate-y-1 transition-all duration-300">
            {!imageError ? (
              <img
                src={imageSrc}
                alt="Grow Together Dashboard Preview"
                onError={() => setImageError(true)}
                className="w-full h-auto rounded-xl border border-white/5 object-cover"
              />
            ) : (
              /* High-fidelity fallback interface representation */
              <div className="space-y-6">
                {/* Header Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-500/20 text-primary-500 flex items-center justify-center font-bold text-sm">
                      นิสิต
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-foreground">ยินดีต้อนรับ นิสิตมหาวิทยาลัย 👋</h3>
                      <p className="text-xs text-gray-400">สร้างนิสัยที่ดี วันละนิด แล้วเติบโตไปด้วยกัน</p>
                    </div>
                  </div>

                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold self-start sm:self-auto">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>คะแนนวินัย 100%</span>
                  </div>
                </div>

                {/* Motivation Card */}
                <div className="p-4 rounded-xl border border-primary-500/20 bg-primary-500/5 flex items-center gap-3 text-xs sm:text-sm text-foreground font-medium">
                  <span className="text-xl">🌱</span>
                  <span>"วันนี้คุณจะเติบโตขึ้นอีก 1% ด้วยความตั้งใจเล็กๆ ในแต่ละวัน"</span>
                </div>

                {/* Stat Cards Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02] space-y-1">
                    <div className="flex items-center justify-between text-xs text-gray-400 font-medium">
                      <span>เป้าหมายทั้งหมด</span>
                      <Target className="w-4 h-4 text-primary-500" />
                    </div>
                    <div className="text-xl font-extrabold text-foreground">4</div>
                    <p className="text-[10px] text-gray-400">เป้าหมายที่กำลังทำ</p>
                  </div>

                  <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02] space-y-1">
                    <div className="flex items-center justify-between text-xs text-gray-400 font-medium">
                      <span>ทำต่อเนื่อง</span>
                      <Flame className="w-4 h-4 text-amber-500" />
                    </div>
                    <div className="text-xl font-extrabold text-foreground">7 <span className="text-xs text-gray-400 font-normal">วัน</span></div>
                    <p className="text-[10px] text-gray-400">สถิติต่อเนื่องสูงสุด</p>
                  </div>

                  <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02] space-y-1">
                    <div className="flex items-center justify-between text-xs text-gray-400 font-medium">
                      <span>เช็กอินสะสม</span>
                      <CheckCircle2 className="w-4 h-4 text-blue-500" />
                    </div>
                    <div className="text-xl font-extrabold text-foreground">28</div>
                    <p className="text-[10px] text-gray-400">จำนวนครั้งทั้งหมด</p>
                  </div>

                  <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02] space-y-1">
                    <div className="flex items-center justify-between text-xs text-gray-400 font-medium">
                      <span>คะแนนวินัย</span>
                      <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    </div>
                    <div className="text-xl font-extrabold text-emerald-400">100%</div>
                    <p className="text-[10px] text-gray-400">รักษาด้วยการเช็กอินทุกวัน</p>
                  </div>
                </div>

                {/* 30-Day Heatmap */}
                <div className="p-4 sm:p-5 rounded-xl border border-white/10 bg-white/[0.02] space-y-4">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-foreground">สถิติการเช็กอิน 30 วันที่ผ่านมา</span>
                    <span className="text-primary-400">เช็กอิน 25 / 30 วัน</span>
                  </div>

                  <div className="flex justify-center overflow-x-auto py-1">
                    <div className="grid grid-cols-10 sm:grid-cols-15 gap-1.5 min-w-fit">
                      {heatmapCells.map((isChecked, i) => (
                        <div
                          key={i}
                          className={`w-5 h-5 sm:w-6 sm:h-6 rounded-xs transition-colors duration-200 border ${
                            isChecked
                              ? 'bg-primary-500 border-primary-600'
                              : 'bg-white/5 border-white/10'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
