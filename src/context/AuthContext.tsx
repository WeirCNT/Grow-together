import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import type { Profile } from '@/types'

const logEvent = (msg: string, ...args: any[]) => {
  console.log(`[${new Date().toISOString()}] [AuthContext] ${msg}`, ...args)
}

interface AuthContextType {
  user: User | null
  profile: Profile | null
  loading: boolean
  signUp: (studentId: string, fullName: string, password: string) => Promise<void>
  signIn: (studentId: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = async (userId: string) => {
    logEvent(`fetchProfile called for userId: ${userId}`)
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    if (error) {
      logEvent(`fetchProfile error: ${error.message}`)
    } else {
      logEvent(`fetchProfile success:`, data)
    }
    setProfile((data as Profile) ?? null)
  }

  const refreshProfile = async () => {
    logEvent(`refreshProfile called. Current user ID: ${user?.id}`)
    if (user) {
      await fetchProfile(user.id)
    }
  }

  useEffect(() => {
    logEvent('AuthProvider useEffect mounted. Initializing session lookup...')

    const getSession = async () => {
      logEvent('getSession starting...')
      const { data: { session }, error } = await supabase.auth.getSession()
      if (error) logEvent(`getSession error: ${error.message}`)
      logEvent(`getSession returned session user: ${session?.user?.id ?? 'none'}`)
      
      setUser(session?.user ?? null)
      if (session?.user) {
        await fetchProfile(session.user.id)
      }
      setLoading(false)
      logEvent('getSession completed, loading set to false')
    }

    getSession()

    logEvent('Attaching supabase.auth.onAuthStateChange listener...')
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        logEvent(`onAuthStateChange event fired: "${event}", session user: ${session?.user?.id ?? 'none'}`)
        setUser(session?.user ?? null)
        if (session?.user) {
          await fetchProfile(session.user.id)
        } else {
          setProfile(null)
        }
        setLoading(false)
        logEvent(`onAuthStateChange handler completed for event: "${event}"`)
      }
    )

    return () => {
      logEvent('Unsubscribing onAuthStateChange listener...')
      subscription.unsubscribe()
    }
  }, [])

  const getAuthEmail = (studentId: string) =>
    `student-${studentId.trim().toLowerCase()}@auth.growtogether.local`

  const signUp = async (studentId: string, fullName: string, password: string) => {
    logEvent(`signUp called for studentId: ${studentId}`)
    const normalizedStudentId = studentId.trim().toUpperCase()
    const { error } = await supabase.auth.signUp({
      email: getAuthEmail(normalizedStudentId),
      password,
      options: {
        data: {
          student_id: normalizedStudentId,
          full_name: fullName.trim(),
        },
      },
    })
    if (error) {
      logEvent(`signUp error: ${error.message}`)
      throw error
    }
    logEvent('signUp success')
  }

  const signIn = async (studentId: string, password: string) => {
    logEvent(`signIn called for studentId: ${studentId}`)
    const { error } = await supabase.auth.signInWithPassword({
      email: getAuthEmail(studentId.trim().toUpperCase()),
      password,
    })
    if (error) {
      logEvent(`signIn error: ${error.message}`)
      throw error
    }
    logEvent('signIn success')
  }

  const signOut = async () => {
    logEvent('signOut called')
    const { error } = await supabase.auth.signOut()
    if (error) {
      logEvent(`signOut error: ${error.message}`)
      throw error
    }
    setUser(null)
    setProfile(null)
    logEvent('signOut completed')
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, signUp, signIn, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
