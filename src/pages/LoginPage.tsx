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

export function LoginPage() {
  const [studentId, setStudentId] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { signIn } = useAuth()
  const { t } = useLanguage()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const normalizedStudentId = studentId.trim().toUpperCase()
    if (!normalizedStudentId || !password) {
      setError('กรุณากรอกรหัสนิสิตและรหัสผ่าน')
      return
    }

    setError(null)
    setLoading(true)
    try {
      await signIn(normalizedStudentId, password)
      navigate('/dashboard')
    } catch {
      setError('รหัสนิสิตหรือรหัสผ่านไม่ถูกต้อง')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-background relative">
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <LanguageToggle />
        <ThemeToggle />
      </div>
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 text-xl font-bold">
            <div className="w-10 h-10 rounded-xl bg-primary-500/10 text-primary-500 flex items-center justify-center">
              <Sprout className="w-6 h-6" />
            </div>
            <span>{t.brandName}</span>
          </Link>
          <p className="text-sm text-muted-foreground">เข้าสู่ระบบด้วยรหัสนิสิตของคุณ</p>
        </div>
        <Card className="border-border shadow-lg">
          <CardHeader>
            <CardTitle>เข้าสู่ระบบ</CardTitle>
            <CardDescription>กรอกรหัสนิสิตและรหัสผ่านเพื่อดำเนินการต่อ</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm font-medium">{error}</div>}
              <div className="space-y-2">
                <Label htmlFor="student-id">รหัสนิสิต</Label>
                <Input id="student-id" type="text" autoComplete="username" placeholder="เช่น 6612345678" value={studentId} onChange={(e) => setStudentId(e.target.value.toUpperCase())} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">รหัสผ่าน</Label>
                <Input id="password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <Button type="submit" className="w-full gap-2" disabled={loading}>
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'เข้าสู่ระบบ'}
                {!loading && <ArrowRight className="w-4 h-4" />}
              </Button>
            </form>
            <div className="mt-6 text-center text-sm text-muted-foreground">
              ยังไม่มีบัญชีใช่ไหม? <Link to="/register" className="text-primary-500 font-semibold hover:underline">สมัครสมาชิก</Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
