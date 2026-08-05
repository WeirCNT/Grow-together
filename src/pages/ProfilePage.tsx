import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router'
import { useAuth } from '@/context/AuthContext'
import { useGoals } from '@/hooks/useGoals'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { formatDate } from '@/lib/utils'
import { updateProfile, uploadAvatar, getUserSupportStats } from '@/services'
import { useLanguage } from '@/context/LanguageContext'
import { Avatar } from '@/components/shared/Avatar'
import { AchievementsList } from '@/components/profile/AchievementsList'
import { Camera, Loader2, Edit2, Heart, Users, Target, Flame, KeyRound } from 'lucide-react'

export function ProfilePage() {
  const { user, profile, refreshProfile } = useAuth()
  const { t } = useLanguage()
  const { goals } = useGoals(user?.id)

  const [name, setName] = useState(profile?.full_name || '')
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [supportStats, setSupportStats] = useState({ encouragementsReceived: 0, encouragementsGiven: 0 })

  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (user?.id) {
      getUserSupportStats(user.id).then(setSupportStats)
    }
  }, [user?.id])

  const handleSave = async () => {
    if (!user || !name.trim()) return
    setSaving(true)
    setErrorMessage(null)
    try {
      await updateProfile(user.id, { full_name: name.trim() })
      if (refreshProfile) await refreshProfile()
      setEditing(false)
    } catch (err: any) {
      setErrorMessage(err.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล')
    } finally {
      setSaving(false)
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return

    setUploading(true)
    setErrorMessage(null)

    try {
      await uploadAvatar(user.id, file)
      if (refreshProfile) await refreshProfile()
    } catch (err: any) {
      setErrorMessage(err.message || 'ไม่สามารถอัปโหลดรูปภาพได้')
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <Card className="shadow-xs border-border/80">
        <CardContent className="pt-6 flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
          <div className="relative group shrink-0">
            <Avatar
              src={profile?.avatar}
              name={profile?.full_name}
              userId={profile?.id}
              size="xl"
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="absolute inset-0 rounded-full bg-black/50 backdrop-blur-xs flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer disabled:cursor-not-allowed"
            >
              {uploading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  <Camera className="w-5 h-5 mb-0.5" />
                  <span className="text-[10px] font-semibold">เปลี่ยนรูป</span>
                </>
              )}
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          <div className="flex-1 space-y-3 w-full min-w-0">
            {errorMessage && (
              <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-xs font-medium">
                {errorMessage}
              </div>
            )}

            {editing ? (
              <div className="flex flex-col sm:flex-row gap-2">
                <Input value={name} onChange={(e) => setName(e.target.value)} className="flex-1" />
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleSave} disabled={saving}>
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : t.save}
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setEditing(false)}>
                    {t.cancel}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="text-xl font-bold">{profile?.full_name}</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    รหัสนิสิต: {profile?.student_id || '-'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t.joined} {profile?.created_at ? formatDate(profile.created_at) : t.recently}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-2 sm:pt-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="gap-1.5 text-xs cursor-pointer"
                  >
                    {uploading ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Camera className="w-3.5 h-3.5 text-primary-500" />
                    )}
                    <span>เปลี่ยนรูปโปรไฟล์</span>
                  </Button>

                  <Button variant="ghost" size="sm" onClick={() => setEditing(true)} className="gap-1.5 text-xs cursor-pointer">
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>{t.edit}</span>
                  </Button>

                  <Button asChild variant="outline" size="sm" className="gap-1.5 text-xs cursor-pointer">
                    <Link to="/change-password">
                      <KeyRound className="w-3.5 h-3.5 text-amber-500" />
                      <span>เปลี่ยนรหัสผ่าน</span>
                    </Link>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Top Profile Stat Cards (4 Grid) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <Card className="shadow-xs border-border/80">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
              <span>{t.activeGoals}</span>
              <Target className="w-3.5 h-3.5 text-primary-500" />
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 text-xl font-extrabold text-foreground">{goals.length}</CardContent>
        </Card>

        <Card className="shadow-xs border-border/80">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
              <span>{t.highestStreak}</span>
              <Flame className="w-3.5 h-3.5 text-amber-500" />
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 text-xl font-extrabold text-foreground">
            {goals.reduce((m, g) => Math.max(m, g.streak), 0)} <span className="text-xs font-normal text-muted-foreground">{t.days}</span>
          </CardContent>
        </Card>

        <Card className="shadow-xs border-border/80">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
              <span>{t.encouragementsReceived}</span>
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500/20" />
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 text-xl font-extrabold text-rose-500 dark:text-rose-400">
            {supportStats.encouragementsReceived.toLocaleString()}
          </CardContent>
        </Card>

        <Card className="shadow-xs border-border/80">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
              <span>{t.encouragementsGiven}</span>
              <Users className="w-3.5 h-3.5 text-blue-500" />
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 text-xl font-extrabold text-blue-500 dark:text-blue-400">
            {supportStats.encouragementsGiven.toLocaleString()}
          </CardContent>
        </Card>
      </div>

      {/* Achievements Badges */}
      <AchievementsList goals={goals} />
    </div>
  )
}
