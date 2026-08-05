import { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import { supabase } from '@/lib/supabase'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { KeyRound, ArrowLeft, Loader2, CheckCircle2, Eye, EyeOff } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'

export function ChangePasswordPage() {
  const { t } = useLanguage()
  const navigate = useNavigate()

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (newPassword.length < 6) {
      setError('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('ยืนยันรหัสผ่านไม่ตรงกัน')
      return
    }

    setError(null)
    setLoading(true)

    try {
      const { error: updateErr } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (updateErr) {
        throw updateErr
      }

      setSuccess(true)
      setTimeout(() => {
        navigate('/profile')
      }, 1500)
    } catch (err: any) {
      console.error('Password change error:', err)
      setError(err.message || 'ไม่สามารถเปลี่ยนรหัสผ่านได้ กรุณาลองใหม่อีกครั้ง')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto space-y-6 py-6 animate-fade-in">
      <div className="flex items-center gap-2">
        <Button asChild variant="ghost" size="sm" className="gap-2 cursor-pointer">
          <Link to="/profile">
            <ArrowLeft className="w-4 h-4" />
            <span>{t.back}</span>
          </Link>
        </Button>
      </div>

      <Card className="shadow-xs border-border/80">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-primary-500/10 text-primary-500 flex items-center justify-center">
              <KeyRound className="w-5 h-5" />
            </div>
            <CardTitle className="text-xl font-bold">เปลี่ยนรหัสผ่าน</CardTitle>
          </div>
          <p className="text-xs text-muted-foreground">
            กรอกรหัสผ่านใหม่เพื่ออัปเดตความปลอดภัยของบัญชีผู้ใช้
          </p>
        </CardHeader>

        <CardContent>
          {success ? (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 space-y-2 text-center">
              <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500" />
              <p className="font-bold text-sm">เปลี่ยนรหัสผ่านเรียบร้อยแล้ว!</p>
              <p className="text-xs text-muted-foreground">กำลังนำคุณกลับไปยังหน้าโปรไฟล์...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-xs font-medium">
                  {error}
                </div>
              )}

              {/* New Password Field */}
              <div className="space-y-2">
                <Label htmlFor="newPassword">รหัสผ่านใหม่</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="อย่างน้อย 6 ตัวอักษร"
                    className="pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword((prev) => !prev)}
                    aria-label={showNewPassword ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md p-1 transition-colors cursor-pointer"
                  >
                    {showNewPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">ยืนยันรหัสผ่านใหม่</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="กรอกรหัสผ่านใหม่อีกครั้ง"
                    className="pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    aria-label={showConfirmPassword ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md p-1 transition-colors cursor-pointer"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <Button asChild variant="outline" className="flex-1 cursor-pointer">
                  <Link to="/profile">{t.cancel}</Link>
                </Button>

                <Button type="submit" disabled={loading} className="flex-1 gap-2 cursor-pointer">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'บันทึกรหัสผ่าน'}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
