import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { Sprout, ArrowRight, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/context/AuthContext'
import { ThemeToggle } from '@/components/shared/ThemeToggle'
import { LanguageToggle } from '@/components/shared/LanguageToggle'
import { useLanguage } from '@/context/LanguageContext'

export function RegisterPage() {
  const [studentId, setStudentId] = useState('')
  const [fullName, setFullName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { signUp } = useAuth()
  const { t } = useLanguage()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const normalizedStudentId = studentId.trim().toUpperCase()
    if (!/^[A-Z0-9-]{5,30}$/.test(normalizedStudentId)) {
      setError('รหัสนิสิตต้องมี 5–30 ตัวอักษร และใช้ได้เฉพาะตัวอักษรภาษาอังกฤษ ตัวเลข หรือขีดกลาง')
      return
    }
    if (!fullName.trim()) { setError('กรุณากรอกชื่อ-นามสกุล'); return }
    if (password.length < 6) { setError('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร'); return }
    if (password !== confirmPassword) { setError('ยืนยันรหัสผ่านไม่ตรงกัน'); return }

    setError(null)
    setLoading(true)
    try {
      await signUp(normalizedStudentId, fullName, password)
      navigate('/dashboard')
    } catch (err) {
      console.error('Registration failed:', err)
      const message = err instanceof Error ? err.message : ''
      if (/already registered|duplicate|unique/i.test(message)) {
        setError('รหัสนิสิตนี้ถูกใช้งานแล้ว')
      } else if (/email.*confirmation/i.test(message)) {
        setError('ระบบต้องยืนยันบัญชีก่อนจึงจะใช้งานได้')
      } else {
        setError('ไม่สามารถสมัครสมาชิกได้ กรุณาลองใหม่อีกครั้ง')
      }
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-background relative">
      <div className="absolute top-4 right-4 flex items-center gap-2"><LanguageToggle /><ThemeToggle /></div>
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 text-xl font-bold">
            <div className="w-10 h-10 rounded-xl bg-primary-500/10 text-primary-500 flex items-center justify-center">
              <Sprout className="w-6 h-6" />
            </div>
            <span>{t.brandName}</span>
          </Link>
          <p className="text-sm text-muted-foreground">สร้างบัญชีสำหรับนิสิต</p>
        </div>
        <Card className="border-border shadow-lg">
          <CardHeader>
            <CardTitle>สมัครสมาชิก</CardTitle>
            <CardDescription>กรอกข้อมูลเพื่อเริ่มต้นใช้งาน</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm font-medium">{error}</div>}
              <div className="space-y-2">
                <Label htmlFor="student-id">รหัสนิสิต</Label>
                <Input id="student-id" type="text" autoComplete="username" placeholder="เช่น 6612345678" value={studentId} onChange={(e) => setStudentId(e.target.value.toUpperCase())} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="full-name">ชื่อ-นามสกุล</Label>
                <Input id="full-name" type="text" autoComplete="name" placeholder="เช่น สมชาย ใจดี" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">รหัสผ่าน</Label>
                <Input id="password" type="password" autoComplete="new-password" placeholder="อย่างน้อย 6 ตัวอักษร" value={password} onChange={(e) => setPassword(e.target.value)} minLength={6} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">ยืนยันรหัสผ่าน</Label>
                <Input id="confirm-password" type="password" autoComplete="new-password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
              </div>
              <Button type="submit" className="w-full gap-2" disabled={loading}>
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'สร้างบัญชี'}
                {!loading && <ArrowRight className="w-4 h-4" />}
              </Button>
            </form>
            <div className="mt-6 text-center text-sm text-muted-foreground">
              มีบัญชีอยู่แล้วใช่ไหม? <Link to="/login" className="text-primary-500 font-semibold hover:underline">เข้าสู่ระบบ</Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
