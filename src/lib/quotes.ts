export interface DailyQuote {
  quote: string
  author?: string
  icon: string
}

export const DAILY_QUOTES: DailyQuote[] = [
  {
    quote: 'วันนี้คุณจะเติบโตขึ้นอีก 1% ด้วยความตั้งใจเล็กๆ ในแต่ละวัน',
    icon: '🌱',
  },
  {
    quote: 'ความสำเร็จเกิดจากการลงมือทำเล็ก ๆ อย่างสม่ำเสมอในทุกวัน',
    icon: '💡',
  },
  {
    quote: 'วินัยคือสะพานเชื่อมระหว่างเป้าหมายที่คุณอยากได้และความสำเร็จที่แท้จริง',
    icon: '🔥',
  },
  {
    quote: 'ก้าวเล็ก ๆ ในวันนี้ คือก้าวที่ยิ่งใหญ่ในการพัฒนาตนเองในอนาคต',
    icon: '🌟',
  },
  {
    quote: 'ลงมือทำในวันนี้ เพื่ออนาคตที่คุณจะภูมิใจในตัวเอง',
    icon: '🎯',
  },
  {
    quote: 'การเรียนรู้และพัฒนาตนเองไม่มีคำว่าสายเกินไป เริ่มต้นได้ทันที',
    icon: '📚',
  },
  {
    quote: 'รักษาความสม่ำเสมอในทุกๆ วัน ผลลัพธ์ที่ดีจะตามมาเอง',
    icon: '⚡',
  },
]

export function getTodayQuote(): DailyQuote {
  const now = new Date()
  const startOfYear = new Date(now.getFullYear(), 0, 0)
  const diff = now.getTime() - startOfYear.getTime()
  const oneDay = 1000 * 60 * 60 * 24
  const dayOfYear = Math.floor(diff / oneDay)

  const index = dayOfYear % DAILY_QUOTES.length
  return DAILY_QUOTES[index]
}
