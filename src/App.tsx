import React, { useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router'
import { HomePage } from '@/pages/HomePage'
import { LoginPage } from '@/pages/LoginPage'
import { RegisterPage } from '@/pages/RegisterPage'
import { GoalsPage } from '@/pages/GoalsPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { CommunityPage } from '@/pages/CommunityPage'
import { ProfilePage } from '@/pages/ProfilePage'
import { ChangePasswordPage } from '@/pages/ChangePasswordPage'
import { AppLayout } from '@/components/layout/AppLayout'
import { useAuth } from '@/context/AuthContext'
import { Skeleton } from '@/components/ui/skeleton'

const logEvent = (msg: string, ...args: any[]) => {
  console.log(`[${new Date().toISOString()}] [App/ProtectedRoute] ${msg}`, ...args)
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  useEffect(() => {
    logEvent(`ProtectedRoute rendered for pathname: "${location.pathname}". User: ${user?.id ?? 'null'}, Loading: ${loading}`)
  }, [location.pathname, user?.id, loading])

  if (loading) {
    logEvent(`ProtectedRoute returning Skeleton loader for path: "${location.pathname}"`)
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Skeleton className="w-32 h-8 rounded-md" />
      </div>
    )
  }

  if (!user) {
    logEvent(`ProtectedRoute returning <Navigate to="/login" replace /> from path: "${location.pathname}" because user is null`)
    return <Navigate to="/login" replace />
  }

  logEvent(`ProtectedRoute allowing render of children for path: "${location.pathname}"`)
  return <AppLayout>{children}</AppLayout>
}

export function App() {
  const location = useLocation()

  useEffect(() => {
    logEvent(`App location changed to: "${location.pathname}${location.search}${location.hash}"`)
  }, [location.pathname, location.search, location.hash])

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/goals" element={<ProtectedRoute><GoalsPage /></ProtectedRoute>} />
      <Route path="/community" element={<ProtectedRoute><CommunityPage /></ProtectedRoute>} />
      <Route path="/friends" element={<ProtectedRoute><CommunityPage /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      <Route path="/change-password" element={<ProtectedRoute><ChangePasswordPage /></ProtectedRoute>} />
    </Routes>
  )
}

export default App
